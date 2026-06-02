# 🤖 Autonomous Game Developer Studio

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![Gemini AI](https://img.shields.io/badge/Powered%20by-Gemini%20AI-blue)](https://deepmind.google/technologies/gemini/)

**Autonomous Game Developer Studio** is an AI-orchestrated development environment where specialized agents collaborate to design, build, test, and refine a Python/Pygame adventure game. It's not just a code generator; it's a full-stack engineering working in real-time.

---
<a href="https://ibb.co/cKWq7xQQ"><img src="https://i.ibb.co/qLH6Pxpp/Ekran-g-r-nt-s-2026-06-02-173643.png" alt="Ekran-g-r-nt-s-2026-06-02-173643" border="0"></a>
<a href="https://ibb.co/nqjMVFdx"><img src="https://i.ibb.co/fVHdKs6j/Ekran-g-r-nt-s-2026-06-02-173647.png" alt="Ekran-g-r-nt-s-2026-06-02-173647" border="0"></a>
<a href="https://ibb.co/0yHWcKDS"><img src="https://i.ibb.co/ZzqwVSLP/Ekran-g-r-nt-s-2026-06-02-173653.png" alt="Ekran-g-r-nt-s-2026-06-02-173653" border="0"></a>
<a href="https://ibb.co/7xx6yD22"><img src="https://i.ibb.co/sppM34yy/Ekran-g-r-nt-s-2026-06-02-173657.png" alt="Ekran-g-r-nt-s-2026-06-02-173657" border="0"></a>
<a href="https://ibb.co/TxxbSPGJ"><img src="https://i.ibb.co/fzzn5rWZ/Ekran-g-r-nt-s-2026-06-02-173702.png" alt="Ekran-g-r-nt-s-2026-06-02-173702" border="0"></a>
## 🌟 Key Features

- **Agent Orchestration Matrix**: 8 specialized agents (Project Manager, Architect, Software Engineer, Build Analyst, QA Tester, Vision Analyzer, Bug Specialist, Release Reporter) working in a continuous loop.
- **Interactive Sandbox Viewport**: Watch the AI develop the game in real-time and jump into a playable HTML5 canvas RPG demo at any time.
- **Auto-Pilot Mode**: Toggle autonomous mode to let the agents iterate on features, fix bugs, and optimize the game without manual intervention.
- **Physical Workspace Integration**: The AI writes real Python code into the `/workspace` folder. You can view, edit, and save changes instantly via the integrated File Explorer.
- **Real-Time Event Engine**: A reactive dashboard powered by Server-Sent Events (SSE) providing instant feedback on agent logs and system state.

## 🏗️ The Agent

The development loop flows through these specialized roles:

1.  **Project Manager (PM)**: Schedules features and defines roadmap landmarks.
2.  **Lead Architect**: Designs class hierarchies and system schemas.
3.  **Software Engineer (Coder)**: Implements features and applies hot-patches to the workspace.
4.  **Build Analyst**: Performs syntactic validation and integrity checks.
5.  **QA Tester**: Measures performance, fun factors, and stability.
6.  **Vision Analyzer**: Uses Gemini Vision APIs to evaluate game layout and aesthetics.
7.  **Bug Specialist**: Identifies, isolates, and resolves edge cases and errors.
8.  **Release Reporter**: Finalizes iterations, generates reports, and triggers state updates.

---

## 📁 Repository Structure

```yaml
/autonomous-game-developer-studio
  /workspace          # Target directory for the generated Python code
  /data               # Local persistent JSON databases (Bugs, Tasks, Iterations)
  /config             # System settings and profiles
  /src                # React/TypeScript Frontend source code
    /components       # Modular dashboard components
    /types.ts         # Centralized type definitions
  /server.ts          # Express.js backend & Vite integration server
  /ARCHITECTURE.md    # Deep dive into system design
  /API.md             # REST and SSE API documentation
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **Gemini API Key**: Obtain one from [Google AI Studio](https://aistudio.google.com/)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/autonomous-game-developer-studio.git
    cd autonomous-game-developer-studio
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure environment variables**:
    Copy the example file and add your Gemini API key.
    ```bash
    cp .env.example .env
    ```
    Edit `.env` and set `GEMINI_API_KEY`.

4.  **Run the development server**:
    ```bash
    npm run dev
    ```

5.  **Access the dashboard**:
    Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Configuration

The project uses `.env` for core settings:

| Variable | Description |
| :--- | :--- |
| `GEMINI_API_KEY` | Your Google Gemini API Key |
| `APP_URL` | The base URL of the application (default: http://localhost:3000) |

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.
