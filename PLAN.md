# MeXOrab - Project Plan

This plan breaks the XO (Tic-Tac-Toe) app into small, iterative phases. Each phase is shippable and increases functionality or polish.

## Phase 1 — Scaffold & Baseline UI
- Create React + Vite + TypeScript project (done).
- Ensure Node 18 compatibility (Vite 5) (done).
- Add minimal layout and a placeholder 3x3 grid.
- Commit baseline.

## Phase 2 — Core Game Logic
- Represent board as an array of 9 cells with types.
- Implement turns (X starts), placing marks, and preventing overwrites.
- Detect win/draw using a utility function.
- Show current player and game status.
- Commit.

## Phase 3 — UI/UX Polish
- Add reset button.
- Highlight winning line.
- Add hover/active animations and basic responsive styles.
- Keyboard accessibility for cells and reset. (done: grid focus, arrow-key navigation, Space to place)
- Commit.

## Phase 4 — Game Enhancements
- Scoreboard (session-based state).
- Allow choosing starting player.
- Move history (time travel) optional.
- Commit.

## Phase 5 — Theming & Animations
- Add lightweight styling utility (CSS Modules or Tailwind). Tailwind optional; keep CSS Modules by default for simplicity.
- Add subtle transitions on mark placement and win highlight.
- Commit.

## Phase 6 — Testing & Quality
- Add ESLint rules checked in CI script. (done: `eslint.config.js` present)
- Unit tests for win detection and reducer/state transitions (Vitest). (partially done: win logic + core UI flow tests in `src/__tests__`)
- Commit. (done)

## Phase 7 — Packaging & Delivery
- Update README with usage.
- Optional: Dockerfile and GitHub Actions for CI.
- Commit.

## Notes on Stack Choices
- React + Vite + TypeScript provides fast DX and type safety without a backend.
- Vite 5 is used for Node 18 compatibility. Alternatives:
  - Next.js (overkill for this SPA; adds routing/SSR you don’t need).
  - Parcel or esbuild (simpler, but Vite’s HMR is excellent).
  - Plain HTML/CSS/JS (feasible, but you preferred React + TS).

## Current Status Snapshot
- Core gameplay (3x3), win/draw detection, scoreboard: done
- Start overlay, end-of-round flow with 2s display and Play: done
- Absolute imports with `@` alias: done
- Tests: added for winner logic and key UI flows; expand coverage
- Remaining from earlier phases: keyboard accessibility, optional theming system
 - Packaging (Phase 7): CI present; Dockerfile + container docs added

## Next Phases

### Phase 8 — Accessibility & Input Polish
- Ensure all interactive elements have proper roles/labels and are reachable via keyboard (arrow-key navigation across grid, Enter to place mark).
- Add focus styles and screen-reader-only announcements for turn changes and outcomes.
- Add ARIA live region refinements for timer and status.

### Phase 9 — Theming and Settings
- Light/Dark theme toggle; persist preference in `localStorage`.
- Configurable per-move timer (off/5s/10s/custom) using a settings panel.
- also having the light/dark theme in setting panel

### Phase 10 — Game Modes
- vs Computer (simple AI: random, then minimax for optimal play).
- Best-of-N rounds mode with series scoreboard and series winner banner.
- “No timer” casual mode.

### Phase 11 — UX Enhancements
- Animations for place/win/draw using CSS transitions only (keep lightweight).
- Sound effects toggle for place/win/draw.
- Subtle confetti improvements and draw-specific animation.

### Phase 12 — Persistence & Share
- Persist scoreboard, names, and settings in `localStorage` with a `useLocalStorage` hook.
- Shareable game link for names/settings (query params).

### Phase 13 — Code Quality & CI
- Increase test coverage: timer expiry win path, scoreboard increments, history toggling, starter selector disabled when mid-game.
- GitHub Actions CI for lint, build, and test on PRs. (done: `.github/workflows/ci.yml`)

## Brainstormed Ideas (Backlog)
- 4x4 and 5x5 boards with dynamic win condition (e.g., 3-in-a-row on 3x3, 4-in-a-row on 5x5); reuse 2D utilities.
- Online multiplayer (WebRTC or a lightweight backend); spectator mode.
- Replay system: save and replay past rounds’ move history.
- Achievements/badges (win streaks, fastest win) and a simple profile.
- Mobile haptics on supported devices when placing marks.

## Open Items From Current Phases
- Keyboard accessibility for cells and reset (Phase 3): pending
- Optional theming system choice (Phase 5): pending (currently plain CSS)
- CI pipeline (Phase 7): done