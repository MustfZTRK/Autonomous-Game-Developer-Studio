# Architecture & Design Specifications

This file details the modular inner workings of the loop cycles and agent behaviors.

## 🔄 Autonomous Loop State Machine

The loop operates sequentially on the backend server. When started, a timer schedules a tick every `iterationSpeed` seconds to advance to the next agent:

```
[System Init] → [pm] → [architect] → [coder] → [builder] → [tester] → [vision] → [bug] → [reporter] → (Auto-Commit & Refresh Loop)
```

```markdown
1. Project Manager (pm):
   Analyzes features log tables and schedules the next RPG element landmark (e.g. Projectiles Shooting, Looting, Weather matrices).
   
2. Lead Architect (architect):
   Specifies class hierarchies, properties schema changes, and class signatures to structure the feature development.

3. Software Engineer (coder):
   Hot-patches physical workspace codes by appending structure files.

4. Build Analyst (builder):
   Runs syntactic checks, verifying imports mapping integrity and sandbox execution status.

5. QA Tester (tester):
   Simulates keyboard and trigger matches, measures FPS trends, and updates Stability and Fun scoring maps.

6. Vision Analyzer (vision):
   Screens game state configurations. Interacts with Gemini Vision APIs if active to assess boundaries contrast and layout ergonomics.

7. Bug Specialist (bug):
   Monitors unhandled logs warning exceptions, resolves bounding boxes overflows, and isolates warning states.

8. Release Reporter (reporter):
   Saves reports, assigns a new incremented Git-like commit hash, resolves all active tasks, and issues state SSE triggers to clients.
```
