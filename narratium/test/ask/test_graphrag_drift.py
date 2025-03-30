import os
import sys

import dotenv

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from ask import ask_graphrag_drift

dotenv.load_dotenv()


def test_ask_graphrag_drift():
    success, response = ask_graphrag_drift(
        query="What is the main topic of this story?",
        api_key=os.getenv("GRAPHRAG_API_KEY"),
    )
    if not success:
        print(f"请求失败: {response}")
        raise Exception(response)

    else:
        print(f"用户: {response}")


if __name__ == "__main__":
    test_ask_graphrag_drift()
