import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from game import TextAdventureGame

if __name__ == "__main__":
    game = TextAdventureGame(auto_test=True)
    game.start_game()
