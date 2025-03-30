import os
import random

from dotenv import load_dotenv
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_ollama import ChatOllama
from langchain_openai import ChatOpenAI

from narratium.models.character import Character
from narratium.models.history import History
from narratium.prompts.system_content import SystemContents
from narratium.prompts.system_prompts import SystemPrompts
from narratium.utils.parser import parse_character, parse_event, parse_story

load_dotenv()
model = os.getenv("QWQ_MODEL")
url = os.getenv("QWQ_URL")
api_key = os.getenv("QWQ_API_KEY")
ollama_model = os.getenv("OLLAMA_MODEL")
ollama_url = os.getenv("OLLAMA_URL")


class TextAdventureGame:
    def __init__(
        self,
        model: str = model,
        file_path: str = "history.json",
        auto_test: bool = False,
        language: str = "en",
    ):
        self.model = model
        self.character = Character()
        self.language = language
        self.file_path = file_path
        self.history = None
        self.system_prompts = None
        self.system_contents = None
        self.initialized = False
        self.auto_test = auto_test
        self.action_history = None
        self.llm = None
        self.character_chain = None
        self.story_chain = None
        self.action_chain = None
        self.compression_chain = None

    def initialize_game(self, language: str, type: str = "openai"):
        self.language = language
        self.history = History(language, self.file_path)
        self.initialized = self.load_game_state()
        self.system_prompts = SystemPrompts(language=language)
        self.system_contents = SystemContents(language=language)
        self.setup_llm(type)
        self.setup_chains()

        if self.auto_test:
            self.action_history = []

    def setup_llm(self, type: str = "openai"):
        try:
            if type == "openai":
                self.llm = ChatOpenAI(
                    model=self.model,
                    api_key=api_key,
                    base_url=url,
                    temperature=0.9,
                    max_tokens=2000,
                    streaming=True,
                )
            elif type == "ollama":
                self.llm = ChatOllama(
                    model=self.model,
                    base_url=ollama_url,
                    temperature=0.9,
                    max_tokens=2000,
                    streaming=True,
                )
            else:
                raise ValueError(f"Unknown LLM type: {type}")
        except Exception as e:
            print(f"Error setting up LLM: {str(e)}")
            try:
                self.llm = ChatOllama(
                    model=ollama_model,
                    base_url=ollama_url,
                    temperature=0.9,
                    max_tokens=2000,
                    streaming=True,  # 启用流式输出
                )
            except Exception as e:
                print(f"Error setting up Ollama LLM: {str(e)}")
                raise RuntimeError("Failed to initialize any LLM")

    def setup_chains(self):
        character_prompt = ChatPromptTemplate.from_messages(
            ("human", self.system_prompts.get_character_easy_prompt("{character_info}")),
        )
        self.character_chain = (
            {"character_info": RunnablePassthrough()} | character_prompt | self.llm | StrOutputParser()
        )

        system_prompt = self.system_prompts.get_text_adventure_prompt()
        story_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", system_prompt),
                ("human", self.system_prompts.get_setting_prompt("{story_framework}", "{character_info}")),
            ]
        )
        self.story_chain = (
            {"story_framework": lambda x: x["story_framework"], "character_info": lambda x: x["character_info"]}
            | story_prompt
            | self.llm
            | StrOutputParser()
        )

        action_prompt = ChatPromptTemplate.from_messages(
            [
                ("system", system_prompt),
                (
                    "human",
                    self.system_prompts.get_embedded_story_prompt(
                        "{story_framework}", "{character_info}", "{history_story}", "{recent_story}", "{user_input}"
                    ),
                ),
            ]
        )
        self.action_chain = (
            {
                "story_framework": lambda x: x["story_framework"],
                "character_info": lambda x: x["character_info"],
                "history_story": lambda x: x["history_story"],
                "recent_story": lambda x: x["recent_story"],
                "user_input": lambda x: x["user_input"],
            }
            | action_prompt
            | self.llm
            | StrOutputParser()
        )

        compression_prompt = ChatPromptTemplate.from_messages(
            ("human", self.system_prompts.get_story_compressor_prompt("{user_input}", "{story}"))
        )
        self.compression_chain = (
            {"user_input": lambda x: x["user_input"], "story": lambda x: x["story"]}
            | compression_prompt
            | self.llm
            | StrOutputParser()
        )

    def start_game(self):
        print("=" * 50)
        print("INFINITE TEXT ADVENTURE / 无限文本冒险")
        print("=" * 50)
        print("\nSelect language / 选择语言 1 or 2:\n")
        print("1. English")
        print("2. 中文\n")
        while True:
            lang_choice = input("> ").strip()
            if lang_choice in ["1", "2"]:
                language = "en" if lang_choice == "1" else "zh"
                self.language = language
                break
            print("Invalid choice. Please enter 1 or 2 / 无效选择。请输入 1 或 2")

        self.initialize_game(language)

        if self.initialized:
            print(self.system_contents.get_continue_adventure_message())
            print(self.history.get_story("recent"))
        else:
            initialization_success, result = self.setup_new_game()

            print("\n" + "-" * 50)
            print(result["narrative"])
            print("\n")
            for prompt in result["next_prompts"]:
                print(prompt)
            if self.auto_test:
                self.action_history = result["next_prompts"]
            print("-" * 50)

            if not initialization_success:
                print(self.system_contents.get_game_setup_failed_message())
                return

        self.game_loop()

    def game_loop(self):
        while True:
            print(self.system_contents.get_action_message())
            if self.auto_test:
                user_input = random.choice(self.action_history)
                print(f"\nauto test: {user_input}")
            else:
                user_input = input("\n> ")

            if user_input.lower() in ["quit", "exit", "q"]:
                print(self.system_contents.get_quit_message())
                break

            result = self.take_action(user_input)

            print("\n" + "-" * 50)
            print(result["narrative"])
            print("\n")
            for prompt in result["next_prompts"]:
                print(prompt)
            if self.auto_test:
                self.action_history = result["next_prompts"]
            print("-" * 50)

    def setup_new_game(self, retry_count=0, max_retries=3):
        print(self.system_contents.get_start_message())
        print(self.system_contents.get_setting_message())
        story_framework = input("\n> ")
        self.history.add_story("story_framework", story=story_framework)
        print(self.system_contents.get_character_message())

        character_info = input("\n> ")

        try:
            character_output = self.character_chain.invoke(character_info)
            character_info = parse_character(character_output)
            self.character.set_info(character_info)
        except Exception as e:
            print(f"Error generating character: {str(e)}")
            return False, str(e)

        print(self.system_contents.get_general_adventure_message())

        try:
            story_output = self.story_chain.invoke(
                {"story_framework": story_framework, "character_info": self.character.__str__(language=self.language)}
            )

            result = parse_story(story_output)

            self.history.add_story(type="recent", story=result["narrative"], user_input="")

            compressed_result = self.compression_chain.invoke({"user_input": "", "story": result["narrative"]})

            event = parse_event(compressed_result)
            self.history.add_story(type="history", story=event, user_input="")
            self.initialized = True
            self.history.save_history()

            return True, result

        except Exception as e:
            print(f"Error generating adventure world: {str(e)}")

            if retry_count >= max_retries:
                print(self.system_contents.get_maximum_retry_attempts_reached_message())
                return False, str(e)

            print(self.system_contents.get_retry_initialization_message())
            retry = input("\n> ").lower()

            if retry == "y" or retry == "yes":
                print(self.system_contents.get_retrying_initialization_message())
                return self.setup_new_game(retry_count + 1, max_retries)
            else:
                print(self.system_contents.get_game_initialization_aborted_message())
                return False, ""

    def take_action(self, user_input):
        if not self.initialized:
            print(self.system_contents.get_game_not_initialized_message())
            return {"narrative": self.system_contents.get_game_not_initialized_message(), "next_prompts": []}

        try:
            action_output = self.action_chain.invoke(
                {
                    "story_framework": self.history.get_story("story_framework"),
                    "character_info": self.character.__str__(language=self.language),
                    "history_story": self.history.get_story("history"),
                    "recent_story": self.history.get_story("recent"),
                    "user_input": user_input,
                }
            )

            result = parse_story(action_output)

            self.history.add_story("recent", story=result["narrative"], user_input=user_input)

            compressed_result = self.compression_chain.invoke({"user_input": user_input, "story": result["narrative"]})

            event = parse_event(compressed_result)
            self.history.add_story("history", story=event, user_input=user_input)
            self.history.save_history()

            return result

        except Exception as e:
            error_message = f"Error processing action: {str(e)}"
            print(error_message)

            print(self.system_contents.get_retry_action_message())
            retry = input("\n> ").lower()

            if retry == "y" or retry == "yes":
                print(self.system_contents.get_retrying_action_message())
                return self.take_action(user_input)
            else:
                return {
                    "narrative": self.system_contents.get_failed_to_process_action_message(),
                    "next_prompts": ["Try a different action", "Restart the game"],
                }

    def load_game_state(self):
        if os.path.exists(self.file_path):
            success = self.history.load_history()
            return success and bool(self.history.get_story("story_framework"))
        return False


if __name__ == "__main__":
    game = TextAdventureGame()
    game.start_game()
