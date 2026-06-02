"""
Procedural Level Generator & Tile Management
"""
import random
from entities import Player, Enemy

class Level:
    def __init__(self, game):
        self.game = game
        self.width = 1600
        self.height = 1200
        self.tiles = []
        self.camera_offset_x = 0
        self.camera_offset_y = 0
        
        # Instantiate characters
        self.player = Player(400, 300)
        self.enemies = [Enemy(200, 200), Enemy(600, 400)]
        
        self.generate_ground()

    def generate_ground(self):
        # Initial ground system
        self.tiles = []
        for x in range(0, self.width, 64):
            for y in range(0, self.height, 64):
                if random.random() < 0.15:
                    self.tiles.append((x, y, "obstacle"))
                else:
                    self.tiles.append((x, y, "floor"))

    def handle_event(self, event):
        self.player.handle_event(event)

    def update(self):
        self.player.update(self)
        
        # Update camera center on player
        self.camera_offset_x = self.player.x - 400
        self.camera_offset_y = self.player.y - 300
        
        for enemy in self.enemies:
            enemy.update(self)

    def draw(self, surface):
        # Draw all elements with camera offset
        for tile in self.tiles:
            tx, ty, tile_type = tile
            color = (40, 45, 60) if tile_type == "floor" else (70, 60, 50)
            pygame.draw.rect(surface, color, (tx - self.camera_offset_x, ty - self.camera_offset_y, 62, 62))
        
        # Draw characters
        self.player.draw(surface, self.camera_offset_x, self.camera_offset_y)
        for enemy in self.enemies:
            enemy.draw(surface, self.camera_offset_x, self.camera_offset_y)
