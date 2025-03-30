import os
import sys
import time

import dotenv

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from parser import parse_character

from ask import ask_ollama
from character import Character
from system_prompts import SystemPrompts

dotenv.load_dotenv()


def test_ask_ollama():
    system_prompts = SystemPrompts("zh")
    character_base = "阿德，光明帝国的魔法帝王"
    prompt = system_prompts.get_character_easy_prompt(character_base)
    start_time = time.time()
    _, character_info = ask_ollama(prompt=prompt)
    end_time = time.time()
    print(f"Ollama请求时间: {end_time - start_time:.2f}秒")
    print(f"Ollama: {character_info}")
    character_info = parse_character(character_info)
    character = Character()
    character.set_info(character_info)
    user_prompt = system_prompts.get_structured_prompt(
        story_framework="黑暗大陆", character_info=character.get_info(language="zh")
    )

    system_prompt = system_prompts.get_world_prompt()
    start_time = time.time()
    success, response = ask_ollama(prompt=user_prompt, system_prompt=system_prompt)
    end_time = time.time()
    print(f"Ollama请求时间: {end_time - start_time:.2f}秒")
    if success:
        print(f"用户: {user_prompt}")
        print(f"Ollama: {response}")
    else:
        print(f"请求失败: {response}")


if __name__ == "__main__":
    test_ask_ollama()
