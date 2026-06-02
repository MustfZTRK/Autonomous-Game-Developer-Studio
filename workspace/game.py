"""
Primary Game Orchestrator and State Manager
"""
import pygame
from level import Level
from ui import HUD

class Game:
    def __init__(self):
        self.screen = pygame.display.set_mode((800, 600))
        pygame.display.set_caption("Autonomous Rogue Adventure")
        self.clock = pygame.time.Clock()
        self.running = True
        self.hud = HUD(self)
        self.level = Level(self)
        
    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
            self.level.handle_event(event)

    def update(self):
        self.level.update()
        self.hud.update()

    def draw(self):
        self.screen.fill((20, 20, 30)) # Cosmic Deep BG
        self.level.draw(self.screen)
        self.hud.draw(self.screen)
        pygame.display.flip()

    def run(self):
        print("Game active! Core systems up.")
        while self.running:
            self.handle_events()
            self.update()
            self.draw()
            self.clock.tick(60)
        pygame.quit()
