"""
Heads Up Display (HUD) and Interface Elements
"""
import pygame

class HUD:
    def __init__(self, game):
        self.game = game
        self.font = pygame.font.SysFont("Arial", 18)

    def update(self):
        pass

    def draw(self, surface):
        player = self.game.level.player
        # Draw HP bar and status panel
        pygame.draw.rect(surface, (30, 30, 45), (15, 15, 220, 65), border_radius=5)
        
        # HP Text & bar
        hp_text = self.font.render(f"HP: {player.hp}/{player.max_hp}", True, (255, 255, 255))
        surface.blit(hp_text, (25, 20))
        pygame.draw.rect(surface, (100, 20, 30), (25, 42, 180, 10))
        pygame.draw.rect(surface, (230, 57, 70), (25, 42, int(180 * (player.hp / player.max_hp)), 10))
        
        # Inventory text summary
        inv_text = self.font.render(f"Inventory: {', '.join(player.inventory)}", True, (180, 180, 200))
        surface.blit(inv_text, (25, 95))
