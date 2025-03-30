import asyncio
import json
import os
from typing import AsyncGenerator, List, Optional

import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from narratium.core.game import TextAdventureGame
from narratium.utils.parser import parse_character, parse_event, parse_story

app = FastAPI(
    title="Narratium Text Adventure API",
    description="API for interacting with the Narratium Text Adventure Game",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

game_instances = {}


class GameInitRequest(BaseModel):
    model: Optional[str] = None
    file_path: Optional[str] = None
    language: str = "en"
    type: str = "openai"


class ActionRequest(BaseModel):
    game_id: str
    user_input: str


class NewGameRequest(BaseModel):
    game_id: str
    story_framework: str
    character_info: str


class GameResponse(BaseModel):
    game_id: str
    narrative: str
    next_prompts: List[str]
    success: bool
    message: Optional[str] = None


@app.post("/initialize", response_model=GameResponse)
async def initialize_game(request: GameInitRequest):
    game_id = os.urandom(8).hex()

    try:
        game = TextAdventureGame(
            model=request.model, file_path=f"history_{game_id}.json", auto_test=False, language=request.language
        )
        game.initialize_game(request.language, type=request.type)
        game_instances[game_id] = game

        return GameResponse(
            game_id=game_id,
            narrative="Game initialized successfully. Ready to setup a new game or load an existing one.",
            next_prompts=["Setup a new game", "Load existing game"],
            success=True,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to initialize game: {str(e)}")


@app.post("/setup", response_model=GameResponse)
async def setup_new_game(request: NewGameRequest):
    if request.game_id not in game_instances:
        raise HTTPException(status_code=404, detail="Game instance not found")

    game = game_instances[request.game_id]

    try:
        game.history.add_story("story_framework", story=request.story_framework)
        character_output = game.character_chain.invoke(request.character_info)
        character_info = parse_character(character_output)
        game.character.set_info(character_info)
        story_output = game.story_chain.invoke(
            {
                "story_framework": request.story_framework,
                "character_info": game.character.__str__(language=game.language),
            }
        )
        result = parse_story(story_output)

        game.history.add_story(type="recent", story=result["narrative"], user_input="")

        compressed_result = game.compression_chain.invoke({"user_input": "", "story": result["narrative"]})
        event = parse_event(compressed_result)
        game.history.add_story(type="history", story=event, user_input="")

        game.initialized = True
        game.history.save_history()

        return GameResponse(
            game_id=request.game_id, narrative=result["narrative"], next_prompts=result["next_prompts"], success=True
        )
    except Exception as e:
        return GameResponse(
            game_id=request.game_id,
            narrative=f"Error setting up game: {str(e)}",
            next_prompts=["Try again"],
            success=False,
            message=str(e),
        )


@app.post("/action", response_model=GameResponse)
async def take_action(request: ActionRequest):
    if request.game_id not in game_instances:
        raise HTTPException(status_code=404, detail="Game instance not found")

    game = game_instances[request.game_id]

    if not game.initialized:
        return GameResponse(
            game_id=request.game_id,
            narrative="Game not initialized. Please setup a new game first.",
            next_prompts=["Setup a new game"],
            success=False,
            message="Game not initialized",
        )

    try:
        result = game.take_action(request.user_input)

        return GameResponse(
            game_id=request.game_id, narrative=result["narrative"], next_prompts=result["next_prompts"], success=True
        )
    except Exception as e:
        return GameResponse(
            game_id=request.game_id,
            narrative=f"Error processing action: {str(e)}",
            next_prompts=["Try a different action", "Restart the game"],
            success=False,
            message=str(e),
        )


@app.post("/setup/stream")
async def setup_new_game_stream(request: NewGameRequest):
    if request.game_id not in game_instances:
        raise HTTPException(status_code=404, detail="Game instance not found")

    game = game_instances[request.game_id]

    async def generate_setup_stream() -> AsyncGenerator[str, None]:
        try:
            yield json.dumps({"type": "start", "game_id": request.game_id}) + "\n"

            game.history.add_story("story_framework", story=request.story_framework)
            yield json.dumps({"type": "progress", "step": "story_framework_added"}) + "\n"

            character_output = await asyncio.to_thread(game.character_chain.invoke, request.character_info)
            character_info = parse_character(character_output)
            game.character.set_info(character_info)
            yield json.dumps({"type": "progress", "step": "character_created"}) + "\n"

            story_params = {
                "story_framework": request.story_framework,
                "character_info": game.character.__str__(language=game.language),
            }

            story_output = await asyncio.to_thread(game.story_chain.invoke, story_params)
            result = parse_story(story_output)

            narrative = result["narrative"]
            chunk_size = 10
            for i in range(0, len(narrative), chunk_size):
                chunk = narrative[i : i + chunk_size]
                yield json.dumps({"type": "chunk", "content": chunk}) + "\n"
                await asyncio.sleep(0.1)

            game.history.add_story(type="recent", story=result["narrative"], user_input="")

            compressed_result = await asyncio.to_thread(
                game.compression_chain.invoke, {"user_input": "", "story": result["narrative"]}
            )
            event = parse_event(compressed_result)
            game.history.add_story(type="history", story=event, user_input="")

            game.initialized = True
            game.history.save_history()

            yield json.dumps({"type": "complete", "next_prompts": result["next_prompts"], "success": True}) + "\n"

        except Exception as e:
            yield json.dumps({"type": "error", "message": str(e), "success": False}) + "\n"

    return StreamingResponse(generate_setup_stream(), media_type="application/x-ndjson")


@app.post("/action/stream")
async def take_action_stream(request: ActionRequest):
    if request.game_id not in game_instances:
        raise HTTPException(status_code=404, detail="Game instance not found")

    game = game_instances[request.game_id]

    if not game.initialized:
        raise HTTPException(status_code=400, detail="Game not initialized")

    async def generate_stream() -> AsyncGenerator[str, None]:
        try:
            yield json.dumps({"type": "start", "game_id": request.game_id}) + "\n"
            result = await asyncio.to_thread(game.take_action, request.user_input)

            narrative = result["narrative"]
            chunk_size = 10
            for i in range(0, len(narrative), chunk_size):
                chunk = narrative[i : i + chunk_size]
                yield json.dumps({"type": "chunk", "content": chunk}) + "\n"
                await asyncio.sleep(0.1)

            yield json.dumps({"type": "complete", "next_prompts": result["next_prompts"], "success": True}) + "\n"

            game.history.save_history()

        except Exception as e:
            yield json.dumps({"type": "error", "message": str(e), "success": False}) + "\n"

    return StreamingResponse(generate_stream(), media_type="application/x-ndjson")


@app.get("/")
async def root():
    return {
        "message": "Welcome to Narratium API",
        "version": "1.0.0",
        "docs": "/docs",
    }


if __name__ == "__main__":
    uvicorn.run("narratium.api.api:app", host="0.0.0.0", port=8000, reload=True)
