# 🎮 Prompt Playground

**Learn to think clearer and prompt better — one game at a time.**  
_A retro-style playground for mastering prompt engineering through fun, fast, skill-building mini-games._

---

## 🚀 What is Prompt Playground?

**Prompt Playground** is an open-source platform for teaching **prompt engineering** through interactive, dopamine-smart mini-games.  
We blend best practices from:

- 🧠 **Cognitive science** (spaced repetition, scaffolding, ZPD)
- 🤖 **AI alignment and LLM usage** (CoT, persona prompts, constraints)
- 🕹 **Game design** (variable reward loops, adaptive difficulty)

> Inspired by Ken Liu's vision of AI as a new artistic medium.

---

## 🎯 Who is it for?

- Power LLM users who want to level up
- Teachers introducing AI literacy in schools
- Developers, designers, and lifelong learners

---

## 🧪 Current Games

✅ Reverse Prompt Builder  
🧠 Guess the exact persona, CoT, and constraints used to produce a given output.

🧪 Coming soon:  
- Prompt Skeet (Persona switching)
- CoT Surgery (Prune verbose reasoning)
- Token Economy (Prompt efficiency challenge)

---

## 📦 Tech Stack

- `Tailwind CSS` + `Vite` (Frontend)
- `Python + FastAPI` (API scoring)
- `Netlify` (static hosting)
- `Render` (backend service)
- `Supabase` (auth + logging)
- `OpenAI / Deepgram` (AI backend)

---

## 💡 Contributing

We welcome feedback, issues, and PRs!

- Check out the `ideas/` folder for new game prototypes
- See `CONTRIBUTING.md` to get started
- All code under the [MIT License](./LICENSE)

---

## 🔮 Vision

To make **prompt fluency** feel like second nature — not through lectures or long docs, but **through games you want to play anyway**.

---

## 🌐 Live site

Coming soon: [https://promptplayground.org](https://promptplayground.org)

---

> "New mediums require new games." — You (soon)

# Promptcraft Guild

A card-based, character-driven, tabletop-style web game for prompt engineering practice.

## Overview

Promptcraft Guild is an interactive game where players strategically combine character cards (Mentors, Methods, and Modifiers) to craft effective prompts for AI. Players select cards that determine tone, structure, and constraints, then submit their prompts for evaluation.

## Tech Stack

### Frontend
- Vite + React + TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- @dnd-kit/core for drag-and-drop functionality
- Lucide icons

### Backend
- FastAPI (Python) with async endpoints
- Modular architecture with separate services:
  - API Core service (main routing)
  - Mistral 7B model for response generation
  - Prometheus 2 model for prompt evaluation

### Deployment
- Docker and Docker Compose for containerization
- Netlify for frontend hosting
- Render for backend hosting

## Features

- Drag-and-drop card gameplay
- Token counting and management
- Real-time prompt evaluation
- Feedback and suggestions
- Level progression system
- Character-driven interactions

## Getting Started

### Prerequisites

- Node.js 16+
- Python 3.10+
- Docker and Docker Compose (optional, for containerized deployment)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/promptcraft-guild.git
   cd promptcraft-guild
   ```

2. Set up the frontend:
   ```
   cd promptcraft-guild
   npm install
   ```

3. Set up the backend:
   ```
   cd ../promptcraft-guild-api
   pip install -r requirements.txt
   ```

4. Copy the environment variables:
   ```
   cp .env.sample .env
   ```

### Running Locally

#### Frontend

```
cd promptcraft-guild
npm run dev
```

The frontend will be available at `http://localhost:5173`.

#### Backend

```
cd promptcraft-guild-api
uvicorn api.main:app --reload
```

The API will be available at `http://localhost:8000`.

### Docker Deployment

To run the entire stack with Docker Compose:

```
docker-compose up -d
```

This will start all services:
- Frontend on port 3000
- API Core on port 8000
- Mistral service on port 7860
- Prometheus service on port 7861

## Game Rules

1. **Deal Phase**: Start with cards in your hand.
2. **Compose Phase**: Drag cards to their slots and craft your prompt. Respect the token limit and time constraint.
3. **Score Phase**: Submit your prompt for evaluation.
4. **Reflection Phase**: Review feedback and suggestions for improvement.

## Project Structure

```
.
├── docker-compose.yml      # Docker Compose configuration
├── .env.sample             # Sample environment variables
├── promptcraft-guild/      # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── api/            # API client hooks
│   │   ├── types/          # TypeScript type definitions
│   │   ├── utils/          # Utility functions
│   │   └── data/           # Mock data for cards
│   └── public/             # Static assets
└── promptcraft-guild-api/  # Backend services
    ├── api/
    │   ├── main.py         # FastAPI application
    │   ├── mistral.py      # Mistral router
    │   ├── prometheus.py   # Prometheus router
    │   └── models/         # Model implementations
    └── requirements.txt    # Python dependencies
```

## License

MIT

