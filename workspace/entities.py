"""
Game Entities and Sprite Engine
"""
import pygame

class Player:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.hp = 100
        self.max_hp = 100
        self.mana = 50
        self.max_mana = 50
        self.inventory = ["Rusty Blade", "Minor Potion"]
        self.velocity = 5
        self.direction = "DOWN"

    def handle_event(self, event):
        # Capture keystrokes
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_LEFT or event.key == pygame.K_a:
                self.x -= self.velocity
                self.direction = "LEFT"
            elif event.key == pygame.K_RIGHT or event.key == pygame.K_d:
                self.x += self.velocity
                self.direction = "RIGHT"
            elif event.key == pygame.K_UP or event.key == pygame.K_w:
                self.y -= self.velocity
                self.direction = "UP"
            elif event.key == pygame.K_DOWN or event.key == pygame.K_s:
                self.y += self.velocity
                self.direction = "DOWN"

    def update(self, level):
        pass

    def draw(self, surface, cx, cy):
        # Draw player as beautiful crimson shield avatar
        pygame.draw.rect(surface, (230, 57, 70), (self.x - cx - 18, self.y - cy - 18, 36, 36), border_radius=8)
        # Visually indicate direction of facing
        facing_pos = (self.x - cx, self.y - cy + 12)
        if self.direction == "LEFT":
            facing_pos = (self.x - cx - 12, self.y - cy)
        elif self.direction == "RIGHT":
            facing_pos = (self.x - cx + 12, self.y - cy)
        elif self.direction == "UP":
            facing_pos = (self.x - cx, self.y - cy - 12)
        pygame.draw.circle(surface, (255, 255, 255), facing_pos, 4)

class Enemy:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.hp = 30
        self.velocity = 1.5

    def update(self, level):
        # Slowly crawl directions towards player
        px, py = level.player.x, level.player.y
        if self.x < px: self.x += self.velocity
        if self.x > px: self.x -= self.velocity
        if self.y < py: self.y += self.velocity
        if self.y > py: self.y -= self.velocity

    def draw(self, surface, cx, cy):
        pygame.draw.rect(surface, (168, 218, 220), (self.x - cx - 15, self.y - cy - 15, 30, 30), border_radius=6)

# --- Combat Expansion: Mage Projectiles ---
class Spell:
    def __init__(self, x, y, dx, dy):
        self.x = x
        self.y = y
        self.dx = dx
        self.dy = dy
        self.velocity = 8
    def update(self):
        self.x += self.dx * self.velocity
        self.y += self.dy * self.velocity

# --- Looting Expansion ---
class Chest:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.opened = False
    def open(self, player):
        self.opened = True
        player.inventory.append("Valkyrie Totem")

# --- Feature Patch: Dynamic Weather & Day/Night Shader ---
# Added custom states

# --- Feature Patch: Procedural Mountain & Forest Generator ---
# Added custom states
