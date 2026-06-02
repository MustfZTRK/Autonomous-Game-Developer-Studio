# Installation Guidelines

Follow these instructions to run and deploy the Autonomous Game Developer Studio.

## 🛠️ Local Machine Setup

### Prerequisites
- Node.js v18 or newer
- npm package manager

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Environment Configuration
Create a `.env` file in the root directory (based on `.env.example` file setup):
```env
GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"
APP_URL="http://localhost:3000"
```

### 3. Launch Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

---

## 🐳 Docker Deployment

To launch the entire platform in isolated containers:

```bash
# Build and run containers
docker-compose up --build -d
```
The application will run exposed on port `3000`. Persistent workspace directories of code, reports, screenshots and SQLite records are mounted onto your local workspace relative directory context.
