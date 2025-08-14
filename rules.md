# Project Rules and Conventions

This document codifies how we build and maintain MeXOrab (XO game). It’s the single source of truth for code structure, conventions, and workflows.

## Guiding Principles
- Keep it simple: bias toward readable, explicit code.
- Small, composable pieces: prefer hooks and small components.
- State is minimal and localized; derive when possible.
- Predictability over cleverness; avoid hidden side effects.

## Architecture Overview
- UI: React + TypeScript + Vite.
- Imports: absolute using alias `@` → `src/`.
- Board representation: 1D array for state; render via 2D adapter utilities.
- Components:
  - `Board`: grid rendering and cell interactions.
  - `StartOverlay` / `EndOverlay`: start and end-of-round overlays.
- Hooks:
  - `useGameTimer(deadlineTs)`: exposes `nowTs`, `remainingMs`.
  - `useRoundFlow({...})`: handles end-of-round timing and reset/credit.
  - `useLocalStorage(key, initial)`: persisted settings.
  - `useQueryParams`: apply and update query params.
  - `useAudio(enabled)`: play place/win/draw sounds when enabled.
- Utilities (in `game.ts`):
  - `calculateWinner1D`, `to2D`, `to1D`, `calculateWinner2D`, `createEmptyBoard2D`.
  - CPU helpers: `getAvailableMoves`, `pickRandomMove`, `minimax`.
- Constants (in `constants.ts`): `BOARD_SIZE`, `MOVE_TIME_MS`, `TICK_INTERVAL_MS`, `ROUND_END_DISPLAY_MS`.
  - Game mode types and defaults: `GameMode`, `TimerOption`, `DEFAULTS`, `timerOptionToMs`.

## UX Rules
- Start gate: game only starts when user clicks Play.
- Timer per move: enabled when at latest, no winner, started.
- End-of-round: show overlay for `ROUND_END_DISPLAY_MS` (2s) then stop the app and show Play.
- Draw overlay shows “Game draw”; no confetti for draws.
- Scoreboard credits exactly once per round (win or draw), including timeout wins.
- Series: best-of 1/3/5; series scoreboard increments on round wins; resets automatically when either reaches the target.
- Timer options: Off/5s/10s; when Off, show no countdown.
- CPU modes: `human`, `cpu-easy` (random), `cpu-hard` (minimax); CPU plays as O with a small delay.
- Sounds: enabled via toggle; must not break tests; in tests, `Audio` is stubbed.

## Coding Conventions
- TypeScript strict mode; no `any` unless necessary and justified.
- Naming:
  - Functions: verbs/verb-phrases (`resetGame`, `currentPlayer`).
  - Variables: descriptive nouns (`startingPlayer`, `remainingMs`).
- Control flow:
  - Prefer early returns and flat logic.
  - Avoid deep nesting and unnecessary try/catch.
- Comments: explain “why,” not “how.” No trivial comments.
- Formatting: follow existing style; keep lines readable; avoid unrelated reformatting.
- Magic numbers: replace with constants from `constants.ts`.
- Imports: use absolute paths (`@/foo`) not relative.

## Component/Hook Guidance
- Components should be presentational where possible; push logic into hooks.
- Keep props minimal, well-typed, and stable.
- Derive values (like `isDraw`, `displayWinner`) from source state.

## Testing
- Framework: Vitest + React Testing Library + JSDOM.
- Location: `src/__tests__/`.
- Guidance:
  - Unit-test core logic (winner, adapters).
  - Integration-test core flows (start, end-of-round overlay hide/show).
  - Test CPU behavior (easy/hard), series reset, timer Off, and query param application.
  - Jsdom URL set to `http://localhost/`; use relative `replaceState` for query updates.
  - Stub `Audio` in `vitest.setup.ts` to avoid unimplemented `HTMLMediaElement.play` errors.
  - Avoid flaky timer tests; prefer `waitFor` over fake-timer coupling unless necessary.

## CI
- GitHub Actions (`.github/workflows/ci.yml`): lint, build, test on push/PR to `main`.

## Git and Commits
- Conventional commits (examples):
  - `feat(...): ...`, `fix(...): ...`, `refactor(...): ...`, `test: ...`, `docs: ...`, `ci: ...`, `chore(...): ...`.
- Branching: small feature branches; PRs target `main`.
- Do not commit secrets.

## Accessibility (A11y)
- Pending Phase 8, but enforce:
  - Roles/labels on interactive elements, keyboard reachability.
  - `aria-live` for status updates (winner, draw, timer).
  - Visible focus styles.

## Performance
- Keep deps minimal; avoid heavy frameworks.
- Memoize only when measurable; premature optimization discouraged.

## Configuration
- Adjust gameplay timings in `constants.ts` only.
- Use `BOARD_SIZE` and 2D helpers if adding larger boards.

## Contributing
- Run `npm run lint`, `npm run build`, and `npm run test` locally before PRs.
- Ensure CI passes; add tests for new behavior.

## Roadmap Snapshot
- See `PLAN.md` for phases, backlog, and current status.
