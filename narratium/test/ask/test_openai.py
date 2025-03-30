import os
import sys
import time

import dotenv

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from parser import parse_character

from ask import ask_openai
from character import Character
from system_prompts import SystemPrompts

dotenv.load_dotenv()

QWQ_MODEL = os.getenv("QWQ_MODEL")
QWQ_API_KEY = os.getenv("QWQ_API_KEY")
QWQ_URL = os.getenv("QWQ_URL")


def test_ask_openai():
    system_prompts = SystemPrompts("zh")
    character_base = "阿德，光明帝国的魔法帝王"
    prompt = system_prompts.get_character_easy_prompt(character_base)
    start_time = time.time()
    _, character_info = ask_openai(prompt=prompt, model=QWQ_MODEL, api_key=QWQ_API_KEY, base_url=QWQ_URL)
    end_time = time.time()
    print(f"OpenAI请求时间: {end_time - start_time:.2f}秒")
    print(f"OpenAI: {character_info}")
    character_info = parse_character(character_info)
    character = Character()
    character.set_info(character_info)
    user_prompt = system_prompts.get_structured_prompt(
        story_framework="黑暗大陆", character_info=character.get_info(language="zh")
    )
    system_prompt = system_prompts.get_world_prompt()
    start_time = time.time()
    success, response = ask_openai(
        prompt=user_prompt, system_prompt=system_prompt, model=QWQ_MODEL, api_key=QWQ_API_KEY, base_url=QWQ_URL
    )
    end_time = time.time()
    print(f"OpenAI请求时间: {end_time - start_time:.2f}秒")
    if success:
        print(f"用户: {user_prompt}")
        print(f"OpenAI: {response}")
    else:
        print(f"请求失败: {response}")


if __name__ == "__main__":
    test_ask_openai()
