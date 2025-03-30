import json


class Story:
    def __init__(self, language: str, user_input: list[str] | None = None, story: list[str] | None = None):
        self.language = language
        self.user_input = user_input or []
        self.story = story or []

    def add_story(self, user_input: str, story: str):
        self.user_input.append(user_input)
        self.story.append(story)

    def get_story(self, start_index: int | None = None, end_index: int | None = None):
        if start_index is None:
            start_index = 0
        if end_index is None:
            end_index = len(self.story)
        result = ""
        if self.language == "zh":
            for i in range(start_index, end_index):
                result += (
                    ("" if self.user_input[i] == "" else f"你做出选择：{self.user_input[i]}\n\n")
                    + self.story[i]
                    + "\n\n"
                )
        elif self.language == "en":
            for i in range(start_index, end_index):
                result += (
                    ("" if self.user_input[i] == "" else f"You make a choice:{self.user_input[i]}\n\n")
                    + self.story[i]
                    + "\n\n"
                )
        return result


class History:
    def __init__(self, language: str, file_path: str = "history.json", mem_len: int = 10):
        self.file_path = file_path
        self.mem_len = mem_len
        self.story_framework = ""
        self.recent_story = Story(language)
        self.history_story = Story(language)

    def add_story(self, type: str, story: str, user_input: str | None = None):
        if type == "story_framework":
            self.story_framework = story
        elif type == "recent":
            self.recent_story.add_story(user_input, story)
        elif type == "history":
            self.history_story.add_story(user_input, story)

    def get_story(self, type: str):
        if type == "story_framework":
            return self.story_framework
        elif type == "recent":
            return self.recent_story.get_story(
                start_index=len(self.recent_story.story) - self.mem_len
                if len(self.recent_story.story) > self.mem_len
                else 0,
                end_index=len(self.recent_story.story),
            )
        elif type == "history":
            return self.history_story.get_story(
                start_index=0,
                end_index=len(self.history_story.story) - self.mem_len
                if len(self.history_story.story) > self.mem_len
                else 0,
            )

    def save_history(self):
        with open(self.file_path, "w") as f:
            json.dump(
                {
                    "story_framework": self.story_framework,
                    "recent_story_user_input": self.recent_story.user_input,
                    "recent_story_story": self.recent_story.story,
                    "history_story_user_input": self.history_story.user_input,
                    "history_story_story": self.history_story.story,
                },
                f,
                ensure_ascii=False,
            )

    def load_history(self):
        try:
            with open(self.file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.story_framework = data["story_framework"]
                self.recent_story.user_input = data["recent_story_user_input"]
                self.recent_story.story = data["recent_story_story"]
                self.history_story.user_input = data["history_story_user_input"]
                self.history_story.story = data["history_story_story"]
        except Exception:
            print("No history file found, creating new one")
            return False
        return True
