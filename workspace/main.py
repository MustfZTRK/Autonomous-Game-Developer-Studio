"""
Autonomous Game Studio - Primary Entry Point
Game Engine: pygame
"""
import sys
import pygame
from game import Game

def main():
    print("Initializing Pygame Sandbox...")
    pygame.init()
    pygame.key.set_repeat(10, 10)
    
    # Initialize Core Game
    game = Game()
    game.run()

if __name__ == "__main__":
    main()
