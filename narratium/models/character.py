class Character:
    def __init__(self):
        self.name = None
        self.description = None
        self.personality = None
        self.background = None
        self.appearance = None
        self.skills = None
        self.location = None
        self.status = None

    def set_info(self, info):
        self.name = info["name"]
        self.description = info["description"]
        self.personality = info["personality"]
        self.background = info["background"]
        self.appearance = info["appearance"]
        self.skills = info["skills"]
        self.location = info["location"]
        self.status = info["status"]

    def __str__(self, language="en"):
        if language == "en":
            return f"""
            Character Information:
            Name: {self.name}
            Description: {self.description}
            Personality: {self.personality}
            Background: {self.background}
            Appearance: {self.appearance}
            Skills: {self.skills}
            Location: {self.location}
            Status: {self.status}
        """
        else:
            return f"""
            角色信息:
            名称: {self.name}
            描述: {self.description}
            性格: {self.personality}
            背景: {self.background}
            外貌: {self.appearance}
            技能: {self.skills}
            位置: {self.location}
            状态: {self.status}
            """
