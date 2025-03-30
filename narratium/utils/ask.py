import os

from dotenv import load_dotenv
from langchain.schema import HumanMessage, SystemMessage
from langchain_ollama import ChatOllama
from langchain_openai import ChatOpenAI

load_dotenv()
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL")
OLLAMA_URL = os.getenv("OLLAMA_URL")
OPENAI_MODEL = os.getenv("OPENAI_MODEL")
OPENAI_URL = os.getenv("OPENAI_URL")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


def ask_ollama(
    prompt: str,
    model: str = OLLAMA_MODEL,
    system_prompt: str | None = None,
    base_url: str = OLLAMA_URL,
    temperature: float = 0.9,
    max_tokens: int = 2000,
    top_p: float = 1.0,
    top_k: int = 40,
    frequency_penalty: float = 0.0,
    presence_penalty: float = 0.0,
    seed: int = 42,
    stop: list[str] = [],
    num_ctx: int = 2048,
) -> tuple[bool, str]:
    try:
        chat = ChatOllama(
            model=model,
            base_url=base_url,
            temperature=temperature,
            max_tokens=max_tokens,
            top_p=top_p,
            top_k=top_k,
            frequency_penalty=frequency_penalty,
            presence_penalty=presence_penalty,
            seed=seed,
            stop=stop,
            num_ctx=num_ctx,
        )

        messages = []
        if system_prompt:
            messages.append(SystemMessage(content=system_prompt))
        messages.append(HumanMessage(content=prompt))

        response = chat.invoke(messages)
        return True, response.content

    except Exception as e:
        return False, f"Error: {str(e)}"


def ask_openai(
    prompt: str,
    api_key: str,
    model: str = OPENAI_MODEL,
    system_prompt: str | None = None,
    base_url: str = OPENAI_URL,
    temperature: float = 0.9,
    max_tokens: int = 2000,
    streaming: bool = False,
) -> tuple[bool, str]:
    try:
        chat = ChatOpenAI(
            model=model,
            api_key=api_key,
            base_url=base_url,
            temperature=temperature,
            max_tokens=max_tokens,
            streaming=streaming,
        )

        messages = []
        if system_prompt:
            messages.append(SystemMessage(content=system_prompt))
        messages.append(HumanMessage(content=prompt))

        response = chat.invoke(messages)
        return True, response.content

    except Exception as e:
        return False, f"Error calling OpenAI API: {str(e)}"
