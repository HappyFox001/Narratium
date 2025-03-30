from utils.ask import ask_ollama

from narratium.prompts.system_prompts import SystemPrompts


class StoryCompressor:
    def __init__(self, model: str = "gemma3:4b-it-fp16", system_prompts: SystemPrompts = None):
        self.model = model
        self.system_prompts = system_prompts

    def compress(self, user_input: str, story: str):
        prompt = self.system_prompts.get_story_compressor_prompt(user_input, story)
        success, response = ask_ollama(prompt=prompt, model=self.model)
        if success:
            compressed_story = response
            return compressed_story
        else:
            print(f"Error compressing story: {response}")
            return story


def test_story_compressor():
    compressor = StoryCompressor()

    original_story = """
    Alice went to the store to buy some groceries. She bought apples, bread, and milk.
    On her way home, she saw a dog chasing a cat. The cat climbed up a tree to escape.
    When Alice got home, she realized she had forgotten to buy eggs. She decided to make
    pancakes without eggs. The pancakes didn't turn out very well, but she ate them anyway.
    Later that day, she called her friend Bob to tell him about her day.
    """

    user_input = "I went for a walk in the park after dinner."

    compressed_story = compressor.compress(user_input, original_story)

    print("Original story length:", len(original_story))
    print("Compressed story length:", len(compressed_story))
    print("\nOriginal story:")
    print(original_story)
    print("\nCompressed story:")
    print(compressed_story)

    if len(compressed_story) < len(original_story):
        print("\nSuccess: Story was compressed!")
    else:
        print("\nNote: Story wasn't reduced in length. Check the compression quality.")

    return compressed_story


if __name__ == "__main__":
    test_story_compressor()
