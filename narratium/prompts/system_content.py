class SystemContents:
    def __init__(self, language: str):
        self.language = language

    def get_language(self):
        return self.language

    def get_start_message(self):
        if self.language == "en":
            return "=== SETTING UP NEW ADVENTURE ==="
        elif self.language == "zh":
            return "=== 开始新的冒险 ==="
        else:
            return "Invalid language!"

    def get_setting_message(self):
        if self.language == "en":
            return "\nDescribe the world of your adventure (setting, time period, magic/technology, etc.):"
        elif self.language == "zh":
            return "\n描述你的冒险世界（设定、时间、魔法/科技等）："
        else:
            return "Invalid language!"

    def get_welcome_message(self):
        if self.language == "en":
            return "\nWelcome to the game!"
        elif self.language == "zh":
            return "\n欢迎来到游戏！"
        else:
            return "Invalid language!"

    def get_character_message(self):
        if self.language == "en":
            return "\nWhat is your character's name and brief background?"
        elif self.language == "zh":
            return "\n你的角色叫什么名字，以及简要背景是什么？"
        else:
            return "Invalid language!"

    def get_general_adventure_message(self):
        if self.language == "en":
            return "\nGenerating your adventure world..."
        elif self.language == "zh":
            return "\n正在生成你的冒险世界..."
        else:
            return "Invalid language!"

    def get_continue_adventure_message(self):
        if self.language == "en":
            return "\nContinuing your adventure..."
        elif self.language == "zh":
            return "\n继续你的冒险..."
        else:
            return "Invalid language!"

    def get_game_setup_failed_message(self):
        if self.language == "en":
            return "\nGame setup failed. Exiting..."
        elif self.language == "zh":
            return "\n游戏设置失败。退出..."
        else:
            return "Invalid language!"

    def get_action_message(self):
        if self.language == "en":
            return "\nWhat would you like to do?"
        elif self.language == "zh":
            return "\n你想做什么？"
        else:
            return "Invalid language!"

    def get_quit_message(self):
        if self.language == "en":
            return "\nThanks for playing!"
        elif self.language == "zh":
            return "\n谢谢你的游玩！"
        else:
            return "Invalid language!"

    def get_game_not_initialized_message(self):
        if self.language == "en":
            return "\nGame is not properly initialized. Please restart and set up a new game."
        elif self.language == "zh":
            return "\n游戏未正确初始化。请重新启动并设置一个新的游戏。"
        else:
            return "Invalid language!"

    def get_maximum_retry_attempts_reached_message(self):
        if self.language == "en":
            return "\nMaximum retry attempts reached. Exiting..."
        elif self.language == "zh":
            return "\n最大重试次数达到。退出..."
        else:
            return "Invalid language!"

    def get_retry_initialization_message(self):
        if self.language == "en":
            return "\nRetry initialization? (y/n)"
        elif self.language == "zh":
            return "\n重试初始化？(y/n)"
        else:
            return "Invalid language!"

    def get_retrying_initialization_message(self):
        if self.language == "en":
            return "\nRetrying initialization..."
        elif self.language == "zh":
            return "\n正在重试初始化..."
        else:
            return "Invalid language!"

    def get_game_initialization_aborted_message(self):
        if self.language == "en":
            return "\nGame initialization aborted."
        elif self.language == "zh":
            return "\n游戏初始化已取消。"
        else:
            return "Invalid language!"

    def get_retry_action_message(self):
        if self.language == "en":
            return "Would you like to retry? (y/n)"
        elif self.language == "zh":
            return "\n你想重试行动吗？(y/n)"
        else:
            return "Invalid language!"

    def get_retrying_action_message(self):
        if self.language == "en":
            return "\nRetrying action..."
        elif self.language == "zh":
            return "\n正在重试行动..."
        else:
            return "Invalid language!"

    def get_failed_to_process_action_message(self):
        if self.language == "en":
            return "\nFailed to process action. Please try a different action."
        elif self.language == "zh":
            return "\n处理动作失败。请尝试不同的动作。"
        else:
            return "Invalid language!"
