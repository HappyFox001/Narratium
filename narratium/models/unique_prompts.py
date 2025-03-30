from narratium.models.character import Character


class NPC(Character):
    pass


class World:
    def __init__(self):
        self.world_structure: str = None
        self.important_npc: str = None
        self.history: str = None
        self.world_architecture: str = None

    def initialize(self, world_structure, important_npc, history, world_architecture):
        self.world_structure = world_structure
        self.important_npc = important_npc
        self.history = history
        self.world_architecture = world_architecture

    def __str__(self):
        return (
            f"World Structure: {self.world_structure}\n"
            f"Important NPCs: {self.important_npc}\n"
            f"History: {self.history}\n"
            f"World Architecture: {self.world_architecture}"
        )


class UniquePrompts:
    def __init__(self):
        self.world: World = World()
        self.npc: NPC = NPC()
