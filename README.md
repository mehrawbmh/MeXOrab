<div align="center">

<img src="./favicon.svg" width="96" height="96" alt="MeXOrab XO" />

# MeXOrab — a sleek XO (Tic‑Tac‑Toe) in React

Play a fast, beautiful XO game. Crisp animations, round-based flow, and a clean codebase ready for features.

</div>

## ✨ Features
- Start overlay and round flow: Play to start, winner/draw overlay for 2s, then Play appears for next round
- Per-move timer (configurable in code), timeout awards the win to the opponent
- Scoreboard with player names; choose the starting player
- Winning line highlight and subtle effects
- Absolute imports (`@/`) and modular architecture (components + hooks)
- Tests: unit tests for logic, UI tests for critical flows

## 🎯 Roadmap (highlights)
- Accessibility polish: full keyboard control, improved ARIA live updates
- Theming and settings: dark/light, configurable timers, name presets
- Game modes: vs Computer (AI), Best-of series, casual mode
- Persistence and sharing: local storage, shareable links
- CI: GitHub Actions for lint, build, and test (done)

See `PLAN.md` for the full phased plan and backlog.

## 🚀 Quick start

```bash
# 1) Install
npm install

# 2) Run dev server
npm run dev

# 3) Build for production
npm run build

# 4) Run tests (headless)
npm run test
# or interactive:
npm run test:ui
```

Then open the app and hit Play. Winner/draw is shown for 2 seconds, then the next round awaits.

## 🧩 Architecture

- `src/constants.ts`: all magic numbers live here (board size, timers)
- `src/game.ts`: core game types and utilities (1D/2D adapters, win detection)
- `src/components/Board.tsx`: grid rendering, visually highlights the winning line
- `src/components/Overlays.tsx`: `StartOverlay` and `EndOverlay`
- `src/hooks/useGameTimer.ts`: ticker for deadlines
- `src/hooks/useRoundFlow.ts`: end-of-round timing and reset logic
- `src/App.tsx`: orchestrates state, renders components

Absolute imports are configured via `@` → `src` in both Vite and TypeScript.

## 🧪 Testing
- Vitest + React Testing Library + JSDOM
- Tests live in `src/__tests__/`
- UI tests cover the start flow and end-of-round overlay visibility

## 🛠️ Contributing
- Keep PRs small and focused; follow conventional commits
- Run locally before pushing:

```bash
npm run lint && npm run build && npm run test
```

- CI runs on every push/PR to `main`

## 📜 Rules
See `rules.md` for coding conventions, architecture guidance, and workflows.

## 🖼️ Screenshots (coming soon)
- Start screen with big Play button
- Win overlay and scoreboard

---

Made with ❤️ by Mehrab. Enjoy the game! 🌟
