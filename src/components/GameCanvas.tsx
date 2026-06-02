import React, { useEffect, useRef, useState } from 'react';
import { Play, Sparkles, AlertCircle, Gamepad2, Info, Swords } from 'lucide-react';
import { SystemStatus } from '../types';

interface GameCanvasProps {
  status: SystemStatus;
}

export function GameCanvas({ status }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [useAutoPilot, setUseAutoPilot] = useState(true);
  const [gameScore, setGameScore] = useState(0);
  const [playerHp, setPlayerHp] = useState(100);
  const [equippedWeapon, setEquippedWeapon] = useState("Rusty Dagger");
  const [gold, setGold] = useState(15);
  const [activeInventory, setActiveInventory] = useState<string[]>(["Rusty Dagger", "Minor Health Flask"]);

  // Core level unlock trackers based on iterations
  const isShootingUnlocked = status.currentIteration >= 2;
  const isWeatherUnlocked = status.currentIteration >= 3;
  const isProceduralUnlocked = status.currentIteration >= 4;
  const isDashUnlocked = status.currentIteration >= 5;
  const isChestsUnlocked = status.currentIteration >= 6;
  const isBossUnlocked = status.currentIteration >= 7;
  const isMinimapUnlocked = status.currentIteration >= 8;

  // Local game loops state using Refs to prevent React re-render conflicts during canvas animation
  const gameStateRef = useRef({
    player: { x: 300, y: 220, vx: 0, vy: 0, size: 24, speed: 4.2 },
    isDashActive: false,
    dashTimer: 0,
    dashCooldown: 0,
    keyboard: {} as Record<string, boolean>,
    projectiles: [] as any[],
    enemies: [] as any[],
    particles: [] as any[],
    chests: [] as any[],
    obstacles: [] as any[],
    boss: null as any,
    weatherParticles: [] as any[],
    lastSpawn: 0,
    viewport: { x: 0, y: 0, width: 800, height: 450 }
  });

  // Re-initialize lists depending on iteration unlocks
  useEffect(() => {
    const state = gameStateRef.current;
    
    // Generate obstacle grids if procedural is unlocked
    if (isProceduralUnlocked && state.obstacles.length === 0) {
      state.obstacles = [
        { x: 120, y: 150, r: 20, type: 'rock' },
        { x: 550, y: 100, r: 25, type: 'rock' },
        { x: 380, y: 320, r: 35, type: 'tree' },
        { x: 180, y: 350, r: 22, type: 'tree' },
        { x: 680, y: 280, r: 30, type: 'tree' },
      ];
    } else if (!isProceduralUnlocked) {
      state.obstacles = [];
    }

    // Spawn chests if they are unlocked
    if (isChestsUnlocked && state.chests.length === 0) {
      state.chests = [
        { x: 150, y: 80, size: 18, looted: false, reward: 'Valkyrie Shield' },
        { x: 620, y: 380, size: 18, looted: false, reward: 'Epic Spell Tome' }
      ];
    } else if (!isChestsUnlocked) {
      state.chests = [];
    }

    // Spawn boss if boss unlocked
    if (isBossUnlocked && !state.boss) {
      state.boss = {
        x: 400,
        y: 100,
        vx: 2,
        vy: 0,
        hp: 400,
        maxHp: 400,
        size: 55,
        shootTimer: 0
      };
    } else if (!isBossUnlocked) {
      state.boss = null;
    }

    // Generate weather raindrops
    if (isWeatherUnlocked && state.weatherParticles.length === 0) {
      state.weatherParticles = Array.from({ length: 40 }, () => ({
        x: Math.random() * 800,
        y: Math.random() * 450,
        speed: 4 + Math.random() * 3,
        len: 8 + Math.random() * 8
      }));
    } else if (!isWeatherUnlocked) {
      state.weatherParticles = [];
    }
  }, [isProceduralUnlocked, isChestsUnlocked, isWeatherUnlocked, isBossUnlocked, status.currentIteration]);

  // Primary animation loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas sizes setting
    canvas.width = 800;
    canvas.height = 450;

    // Handle standard inputs
    const handleKeyDown = (e: KeyboardEvent) => {
      gameStateRef.current.keyboard[e.key.toLowerCase()] = true;
      if (e.key === ' ' || e.key.toLowerCase() === 'shift') {
        // Trigger dash boost
        if (isDashUnlocked && gameStateRef.current.dashCooldown <= 0) {
          gameStateRef.current.isDashActive = true;
          gameStateRef.current.dashTimer = 8; // dash lasts 8 frames
          gameStateRef.current.dashCooldown = 60; // cooldown lasts 60 frames (1s)
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      gameStateRef.current.keyboard[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Mouse click weapon projectile trigger
    const handleCanvasClick = (e: MouseEvent) => {
      if (!isShootingUnlocked) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const state = gameStateRef.current;
      const p = state.player;

      // Project direction vector towards mouse coordinates
      const angle = Math.atan2(clickY - p.y, clickX - p.x);
      state.projectiles.push({
        x: p.x,
        y: p.y,
        vx: Math.cos(angle) * 7.5,
        vy: Math.sin(angle) * 7.5,
        size: 5,
        color: '#fbbf24', // golden glow
        friendly: true
      });

      // Sparks flare
      for (let i = 0; i < 4; i++) {
        state.particles.push({
          x: p.x,
          y: p.y,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          r: 2,
          alpha: 1,
          color: '#fbbf24'
        });
      }
    };

    canvas.addEventListener('click', handleCanvasClick);

    // Initial setup enemies
    const state = gameStateRef.current;
    if (state.enemies.length === 0) {
      state.enemies = [
        { x: 100, y: 100, hp: 30, maxHp: 30, size: 16, color: '#06b6d4', speed: 1.2 },
        { x: 700, y: 350, hp: 30, maxHp: 30, size: 16, color: '#06b6d4', speed: 1.2 }
      ];
    }

    const render = () => {
      // Clear
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background tiling
      ctx.fillStyle = '#0f172a'; // cosmic slate
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid helper lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 1. UPDATE OBSTACLES
      if (isProceduralUnlocked) {
        state.obstacles.forEach((obs) => {
          ctx.beginPath();
          if (obs.type === 'rock') {
            ctx.fillStyle = '#475569';
            ctx.arc(obs.x, obs.y, obs.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          } else {
            // tree trunk
            ctx.fillStyle = '#78350f';
            ctx.fillRect(obs.x - 6, obs.y, 12, obs.r * 0.8);
            // foliage
            ctx.fillStyle = '#059669';
            ctx.beginPath();
            ctx.arc(obs.x, obs.y - 5, obs.r, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      // 2. LOOT CHESTS
      if (isChestsUnlocked) {
        state.chests.forEach((c) => {
          ctx.beginPath();
          if (!c.looted) {
            ctx.fillStyle = '#ea580c'; // shiny gold/orange chest
            ctx.fillRect(c.x - c.size/2, c.y - c.size/2, c.size, c.size);
            // Lock indicator
            ctx.fillStyle = '#facc15';
            ctx.fillRect(c.x - 3, c.y - 1, 6, 4);
          } else {
            ctx.fillStyle = '#451a03'; // brown wooden depleted box
            ctx.fillRect(c.x - c.size/2, c.y - c.size/2, c.size, c.size);
          }
        });
      }

      // 3. PLAYER MOVEMENT & AUTOPILOT
      const p = state.player;
      let dx = 0;
      let dy = 0;

      if (useAutoPilot) {
        // Auto pilot tracks closest threat or item chest
        let target = null as any;
        
        if (state.boss) {
          target = state.boss;
        } else if (state.enemies.length > 0) {
          // Find closest alive enemy
          let minD = Infinity;
          state.enemies.forEach((en) => {
            const d = Math.hypot(en.x - p.x, en.y - p.y);
            if (d < minD) {
              minD = d;
              target = en;
            }
          });
        } else {
          // Wander paths
          target = { x: 400 + Math.sin(Date.now() / 600) * 200, y: 220 + Math.cos(Date.now() / 600) * 100 };
        }

        if (target) {
          const angle = Math.atan2(target.y - p.y, target.x - p.x);
          const d = Math.hypot(target.y - p.y, target.x - p.x);
          
          if (d > 60) {
            dx = Math.cos(angle);
            dy = Math.sin(angle);
          } else if (d < 30) {
            // backpedal
            dx = -Math.cos(angle);
            dy = -Math.sin(angle);
          }

          // Auto firing Magic Bolts
          if (isShootingUnlocked && Math.random() < 0.08 && state.projectiles.length < 15) {
            state.projectiles.push({
              x: p.x,
              y: p.y,
              vx: Math.cos(angle) * 7.5,
              vy: Math.sin(angle) * 7.5,
              size: 5,
              color: '#fbbf24',
              friendly: true
            });
          }
        }
      } else {
        // Manual controls WASD/Arrows
        if (state.keyboard['w'] || state.keyboard['arrowup']) dy = -1;
        if (state.keyboard['s'] || state.keyboard['arrowdown']) dy = 1;
        if (state.keyboard['a'] || state.keyboard['arrowleft']) dx = -1;
        if (state.keyboard['d'] || state.keyboard['arrowright']) dx = 1;
      }

      // Apply coordinates speeds
      let currentSpeed = p.speed;
      if (state.isDashActive) {
        currentSpeed *= 3.5;
        state.dashTimer--;
        if (state.dashTimer <= 0) state.isDashActive = false;
        
        // Trail particles
        state.particles.push({
          x: p.x,
          y: p.y,
          vx: 0,
          vy: 0,
          r: 5,
          alpha: 0.8,
          color: '#34d399' // mint dash glow
        });
      }

      if (state.dashCooldown > 0) state.dashCooldown--;

      // Normalize speed
      if (dx !== 0 && dy !== 0) {
        const norm = Math.hypot(dx, dy);
        dx /= norm;
        dy /= norm;
      }

      p.x += dx * currentSpeed;
      p.y += dy * currentSpeed;

      // Keep player inside boundary viewport map limits and floor to guarantee no floating-point overlaps
      p.x = Math.floor(Math.max(16, Math.min(canvas.width - 16, p.x)));
      p.y = Math.floor(Math.max(16, Math.min(canvas.height - 16, p.y)));

      // Obstacle collision resolver
      if (isProceduralUnlocked) {
        state.obstacles.forEach((obs) => {
          const dist = Math.hypot(p.x - obs.x, p.y - obs.y);
          if (dist < obs.r + 10) {
            // Push player outside radius bounds
            const angle = Math.atan2(p.y - obs.y, p.x - obs.x);
            p.x = obs.x + Math.cos(angle) * (obs.r + 10);
            p.y = obs.y + Math.sin(angle) * (obs.r + 10);
          }
        });
        // Re-clamp and round coordinates to enforce clean boundary limits and prevent floating-point overlap
        p.x = Math.floor(Math.max(16, Math.min(canvas.width - 16, p.x)));
        p.y = Math.floor(Math.max(16, Math.min(canvas.height - 16, p.y)));
      }

      // Draw Player: Crimson Champion with gold shield contour
      ctx.beginPath();
      ctx.fillStyle = '#ef4444'; // main red body
      ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b'; // golden outline
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Energy crown indicator
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size / 2 + 5, 1.25 * Math.PI, 1.75 * Math.PI);
      ctx.strokeStyle = '#38bdf8';
      ctx.stroke();

      // 4. MOB ENEMIES SPOWNS & UPDATES
      if (Date.now() - state.lastSpawn > 4200) {
        if (state.enemies.length < 5) {
          const spawnSide = Math.random() < 0.5;
          const sx = spawnSide ? 30 : 770;
          const sy = Math.random() * 400 + 25;
          state.enemies.push({
            x: sx,
            y: sy,
            hp: 30,
            maxHp: 30,
            size: 16,
            color: '#06b6d4',
            speed: 1.1 + (status.currentIteration * 0.1) // slightly scale difficulties
          });
        }
        state.lastSpawn = Date.now();
      }

      state.enemies.forEach((en, enIdx) => {
        // En move to player coords
        const angle = Math.atan2(p.y - en.y, p.x - en.x);
        en.x += Math.cos(angle) * en.speed;
        en.y += Math.sin(angle) * en.speed;

        // Draw dynamic health indicator above enemy mobs
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(en.x - 12, en.y - 18, 24, 3);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(en.x - 12, en.y - 18, Math.max(0, 24 * (en.hp / en.maxHp)), 3);

        // Render Enemy Avatar
        ctx.fillStyle = '#a8a29e'; // stone core shadow
        ctx.fillRect(en.x - en.size/2 - 2, en.y - en.size/2 - 2, en.size + 4, en.size + 4);
        ctx.fillStyle = '#d946ef'; // demonic neon magenta heart core
        ctx.fillRect(en.x - en.size/2, en.y - en.size/2, en.size, en.size);

        // Player collides with mobs damage tick
        const distToPlayer = Math.hypot(p.x - en.x, p.y - en.y);
        if (distToPlayer < p.size/2 + en.size/2) {
          setPlayerHp((prev) => {
            const nextHp = Math.max(0, prev - 0.2);
            if (nextHp <= 0) {
              // auto respawn
              setGameScore(0);
              return 100;
            }
            return nextHp;
          });
          
          // sparks flash
          state.particles.push({
            x: p.x,
            y: p.y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            r: 3,
            alpha: 1,
            color: '#ef4444'
          });
        }
      });

      // 5. BOSS DRAGON AI CORE
      if (state.boss) {
        const boss = state.boss;
        boss.x += boss.vx;
        if (boss.x < 150 || boss.x > 650) boss.vx = -boss.vx;

        // Auto Fire multi bullets
        boss.shootTimer++;
        if (boss.shootTimer > 65) {
          // Fire spiral wave bullets
          const baseAngle = Date.now() / 500;
          for (let i = 0; i < 4; i++) {
            const angle = baseAngle + (i * Math.PI / 2);
            state.projectiles.push({
              x: boss.x,
              y: boss.y + 15,
              vx: Math.cos(angle) * 3.2,
              vy: Math.sin(angle) * 3.2,
              size: 8,
              color: '#ef4444', // red poison
              friendly: false
            });
          }
          boss.shootTimer = 0;
        }

        // Draw Boss HP panel with nice coordinates
        ctx.fillStyle = '#3f3f46';
        ctx.fillRect(200, 20, 400, 10);
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(200, 20, Math.max(0, 400 * (boss.hp / boss.maxHp)), 10);
        ctx.strokeStyle = '#fad02c';
        ctx.strokeRect(199, 19, 402, 12);

        // Draw Boss graphics
        ctx.beginPath();
        ctx.fillStyle = '#a21caf';
        ctx.arc(boss.x, boss.y, boss.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fad02c';
        ctx.stroke();

        // Eye glow
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(boss.x - 12, boss.y, 4, 0, Math.PI*2);
        ctx.arc(boss.x + 12, boss.y, 4, 0, Math.PI*2);
        ctx.fill();
      }

      // 6. DRAW & UPDATE BALLISTIC PROJECTILES
      state.projectiles = state.projectiles.filter((proj) => {
        proj.x += proj.vx;
        proj.y += proj.vy;

        // Draw Projectile globes
        ctx.beginPath();
        ctx.fillStyle = proj.color;
        ctx.arc(proj.x, proj.y, proj.size, 0, Math.PI * 2);
        ctx.fill();

        if (proj.friendly) {
          // Check collision with mobs
          let hitMob = false;
          state.enemies.forEach((en, enIdx) => {
            const d = Math.hypot(en.x - proj.x, en.y - proj.y);
            if (d < en.size/2 + proj.size) {
              en.hp -= 10;
              hitMob = true;
              
              // Mob dies?
              if (en.hp <= 0) {
                state.enemies.splice(enIdx, 1);
                setGold(g => g + 4);
                setGameScore(s => s + 100);
              }

              // Flash explosions particles
              for (let i = 0; i < 6; i++) {
                state.particles.push({
                  x: proj.x,
                  y: proj.y,
                  vx: (Math.random() - 0.5) * 5,
                  vy: (Math.random() - 0.5) * 5,
                  r: 3,
                  alpha: 1,
                  color: '#fbbf24'
                });
              }
            }
          });

          // Check hit against boss
          if (state.boss) {
            const boss = state.boss;
            const dB = Math.hypot(boss.x - proj.x, boss.y - proj.y);
            if (dB < boss.size/2 + proj.size) {
              boss.hp -= 10;
              hitMob = true;

              if (boss.hp <= 0) {
                state.boss = null; // Boss defeated!
                setGold(g => g + 150);
                setGameScore(s => s + 2000);
                console.log("VICTORY! Giant Boss slain in playable simulation viewport.");
              }
            }
          }

          return !hitMob && proj.x > 0 && proj.x < canvas.width && proj.y > 0 && proj.y < canvas.height;
        } else {
          // Dark bullet hitting player
          const dToP = Math.hypot(p.x - proj.x, p.y - proj.y);
          if (dToP < p.size/2 + proj.size) {
            setPlayerHp(h => Math.max(0, h - 8));
            return false;
          }
          return proj.x > 0 && proj.x < canvas.width && proj.y > 0 && proj.y < canvas.height;
        }
      });

      // 7. PARTICLES DYNAMICS
      state.particles = state.particles.filter((pt) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.alpha -= 0.035;

        ctx.beginPath();
        ctx.save();
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.fillStyle = pt.color;
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        return pt.alpha > 0;
      });

      // 8. LOOT CHEST DETECTORS
      if (isChestsUnlocked) {
        state.chests.forEach((c) => {
          if (!c.looted) {
            const dist = Math.hypot(p.x - c.x, p.y - c.y);
            if (dist < p.size/2 + c.size) {
              c.looted = true;
              setGold(g => g + 50);
              
              // Unlocked custom loot logic
              setActiveInventory(prev => {
                if (!prev.includes(c.reward)) {
                  setEquippedWeapon(c.reward);
                  return [...prev, c.reward];
                }
                return prev;
              });

              console.log(`QA loot trigger: Opened chest, unlocked [${c.reward}] item. Gold reward +50.`);

              // Loot particles burst
              for (let i = 0; i < 15; i++) {
                state.particles.push({
                  x: c.x,
                  y: c.y,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.5) * 6,
                  r: 4,
                  alpha: 1,
                  color: '#facc15'
                });
              }
            }
          }
        });
      }

      // 9. ATMOSPHERE WEATHER SHADER LAYER
      if (isWeatherUnlocked) {
        // Overlay transparent night sky filter
        ctx.fillStyle = 'rgba(12, 10, 40, 0.45)'; // soft atmospheric dusk
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Falling raindrops drawing
        ctx.strokeStyle = 'rgba(14, 165, 233, 0.5)';
        ctx.lineWidth = 1;
        state.weatherParticles.forEach((drop) => {
          ctx.beginPath();
          ctx.moveTo(drop.x, drop.y);
          ctx.lineTo(drop.x - 1, drop.y + drop.len);
          ctx.stroke();

          // Advance raindrop coordinates
          drop.y += drop.speed;
          if (drop.y > canvas.height) {
            drop.y = -20;
            drop.x = Math.random() * canvas.width;
          }
        });
      }

      // 10. MINIMAP HUD NAVIGATOR
      if (isMinimapUnlocked) {
        // Draw minimap circle frame at bottom right
        const mapCX = canvas.width - 65;
        const mapCY = canvas.height - 65;
        const mapRadius = 45;

        // Background circle
        ctx.beginPath();
        ctx.arc(mapCX, mapCY, mapRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(9, 9, 11, 0.85)';
        ctx.fill();
        ctx.strokeStyle = '#06b6d4'; // Cyan border
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Crosshairs lines
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
        ctx.lineWidth = 0.5;
        ctx.moveTo(mapCX - mapRadius, mapCY);
        ctx.lineTo(mapCX + mapRadius, mapCY);
        ctx.moveTo(mapCX, mapCY - mapRadius);
        ctx.lineTo(mapCX, mapCY + mapRadius);
        ctx.stroke();

        // Inside the minimap circle, the player is always at the center mapCX, mapCY.
        // Scale factor: canvas map is 800x450.
        // let's render entities relative to the player
        if (isProceduralUnlocked) {
          state.obstacles.forEach(obs => {
            const relX = (obs.x - p.x) * 0.12;
            const relY = (obs.y - p.y) * 0.12;
            const dist = Math.hypot(relX, relY);
            if (dist < mapRadius - 3) {
              ctx.beginPath();
              ctx.arc(mapCX + relX, mapCY + relY, 1.5, 0, Math.PI * 2);
              ctx.fillStyle = '#4b5563'; // Gray obstacles
              ctx.fill();
            }
          });
        }

        // For Chests
        if (isChestsUnlocked) {
          state.chests.forEach(c => {
            if (!c.looted) {
              const relX = (c.x - p.x) * 0.12;
              const relY = (c.y - p.y) * 0.12;
              const dist = Math.hypot(relX, relY);
              if (dist < mapRadius - 3) {
                ctx.beginPath();
                ctx.arc(mapCX + relX, mapCY + relY, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#f59e0b'; // Amber chests
                ctx.fill();
              }
            }
          });
        }

        // For Enemies
        state.enemies.forEach(en => {
          if (en.hp > 0) {
            const relX = (en.x - p.x) * 0.12;
            const relY = (en.y - p.y) * 0.12;
            const dist = Math.hypot(relX, relY);
            if (dist < mapRadius - 3) {
              ctx.beginPath();
              ctx.arc(mapCX + relX, mapCY + relY, 2, 0, Math.PI * 2);
              ctx.fillStyle = '#ef4444'; // Red enemies
              ctx.fill();
            }
          }
        });

        // For Boss
        if (state.boss && state.boss.hp > 0) {
          const relX = (state.boss.x - p.x) * 0.12;
          const relY = (state.boss.y - p.y) * 0.12;
          const dist = Math.hypot(relX, relY);
          if (dist < mapRadius - 3) {
            ctx.beginPath();
            ctx.arc(mapCX + relX, mapCY + relY, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#ec4899'; // Pink boss
            ctx.fill();
          }
        }

        // Center Player Marker
        ctx.beginPath();
        ctx.arc(mapCX, mapCY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#10b981'; // Green player center
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        // Minimap label
        ctx.fillStyle = '#06b6d4';
        ctx.font = 'bold 8px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('NAVIGATOR', mapCX, mapCY + mapRadius - 5);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [isPlaying, useAutoPilot, isShootingUnlocked, isWeatherUnlocked, isProceduralUnlocked, isDashUnlocked, isChestsUnlocked, isBossUnlocked, status.currentIteration]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 font-sans shadow-xl flex flex-col h-auto" id="pygame_runtime_canvas_sandbox">
      {/* Visual Canvas header with simulation controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-850 pb-4 mb-4 select-none">
        <div>
          <div className="flex items-center gap-1.5">
            <Gamepad2 className="h-4.5 w-4.5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase font-mono tracking-tight flex items-center gap-2">
              PYGAME RUNTIME SANDBOX VIEWPORT
            </h3>
            <span className="text-[9px] bg-zinc-800 text-cyan-400 border border-cyan-500/20 px-1.5 rounded font-mono font-bold">REALTIME_SIM_PORT</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
            Playable interactive sandbox compiled from Python workspace rules.
          </p>
        </div>
        
        {/* Toggle controls pilot */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setUseAutoPilot(!useAutoPilot)}
            className={`px-2.5 py-1.5 rounded text-[10px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer border ${useAutoPilot ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/35' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-zinc-200'}`}
          >
            <Swords className="h-3.5 w-3.5" /> {useAutoPilot ? "AI AUTOPILOT ON" : "PILOT OFF (MANUAL WASD)"}
          </button>
        </div>
      </div>

      {/* Main Viewport Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1">
        
        {/* Actual Graphics Canvas Panel */}
        <div className="lg:col-span-3 flex items-center justify-center bg-zinc-950 rounded-lg overflow-hidden border border-zinc-850 min-h-[300px] relative" ref={containerRef}>
          <canvas ref={canvasRef} className="w-full h-auto block select-none bg-zinc-950 aspect-[16/9]" />
          
          {/* Unlocked feature overlay overlays */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 pointer-events-none select-none font-mono text-[9px]">
            <div className={`p-1 px-1.5 rounded bg-zinc-950/80 border ${isShootingUnlocked ? 'text-emerald-400 border-emerald-500/20' : 'text-zinc-600 border-zinc-900'}`}>
              ⚡ SHOT SPELL: {isShootingUnlocked ? "UNLOCKED (Iteration 2)" : "LOCKED"}
            </div>
            <div className={`p-1 px-1.5 rounded bg-zinc-950/80 border ${isWeatherUnlocked ? 'text-emerald-400 border-emerald-500/20' : 'text-zinc-600 border-zinc-900'}`}>
              🌧️ WEATHER GRID: {isWeatherUnlocked ? "UNLOCKED (Iteration 3)" : "LOCKED"}
            </div>
            <div className={`p-1 px-1.5 rounded bg-zinc-950/80 border ${isProceduralUnlocked ? 'text-emerald-400 border-emerald-500/20' : 'text-zinc-600 border-zinc-900'}`}>
              🌲 MOUNTAINS MAP: {isProceduralUnlocked ? "UNLOCKED (Iteration 4)" : "LOCKED"}
            </div>
          </div>

          <div className="absolute top-4 right-4 flex flex-col gap-1.5 pointer-events-none select-none font-mono text-[9px] text-right">
            <div className={`p-1 px-1.5 rounded bg-zinc-950/80 border ${isDashUnlocked ? 'text-emerald-400 border-emerald-500/20' : 'text-zinc-600 border-zinc-900'}`}>
              💨 DASH METRIC: {isDashUnlocked ? "SHIFT UNLOCKED (Iteration 5)" : "LOCKED"}
            </div>
            <div className={`p-1 px-1.5 rounded bg-zinc-950/80 border ${isChestsUnlocked ? 'text-emerald-400 border-emerald-500/20' : 'text-zinc-600 border-zinc-900'}`}>
              📦 TREASURES LOOT: {isChestsUnlocked ? "UNLOCKED (Iteration 6)" : "LOCKED"}
            </div>
            <div className={`p-1 px-1.5 rounded bg-zinc-950/80 border ${isBossUnlocked ? 'text-pink-400 border-pink-500/30' : 'text-zinc-600 border-zinc-900 animate-pulse'}`}>
              👾 BOSS DUNGEON: {isBossUnlocked ? "ACTIVE (Iteration 7)" : "LOCKED"}
            </div>
            <div className={`p-1 px-1.5 rounded bg-zinc-950/80 border ${isMinimapUnlocked ? 'text-cyan-400 border-cyan-500/20' : 'text-zinc-600 border-zinc-900'}`}>
              🗺️ MINIMAP HUD: {isMinimapUnlocked ? "UNLOCKED (Iteration 8)" : "LOCKED"}
            </div>
          </div>
        </div>

        {/* HUD state indicators stats */}
        <div className="bg-zinc-950/80 border border-zinc-850 rounded-lg p-4 font-mono text-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-zinc-900 pb-2.5">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">CONTROLLABLE METRICS</span>
              <div className="flex items-center justify-between text-white font-bold">
                <span>Play HP:</span>
                <span className={playerHp < 35 ? "text-rose-400 animate-pulse" : "text-emerald-400"}>{Math.ceil(playerHp)}/100</span>
              </div>
              <div className="w-full bg-zinc-900 h-1 rounded overflow-hidden mt-1 bg-zinc-850">
                <div className="h-full bg-emerald-500" style={{ width: `${playerHp}%` }} />
              </div>
            </div>

            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">SCORE CARD</span>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Total Score:</span>
                <span className="text-zinc-250 font-bold text-white text-right">{gameScore.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-zinc-400">Gold loot:</span>
                <span className="text-amber-400 font-bold font-mono">+{gold}g</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">EQUIPPED ARMORIES</span>
              <div className="flex items-center justify-between text-white">
                <span>Current Slot:</span>
                <span className="text-emerald-400 font-bold text-right truncate bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 max-w-[120px]">{equippedWeapon}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-2">LOOT INVENTORY ({activeInventory.length})</span>
              <div className="flex flex-wrap gap-1">
                {activeInventory.map((item, id) => (
                  <span key={id} className="text-[9px] bg-zinc-900 text-zinc-400 border border-zinc-800 rounded px-1.5 py-0.5">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-900 pt-4 mt-4 text-[10px] text-zinc-500 leading-relaxed flex items-start gap-1.5 select-none">
            <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <p>
              In Auto-Pilot, the player utilizes target-pursuit algorithms to test the gameplay rules designed by the Agent crew. Click anywhere on the map to manually aim and shoot golden bolt spells.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
