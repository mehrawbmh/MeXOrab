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
- Keyboard accessibility for cells and reset.
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
- Add ESLint rules checked in CI script.
- Unit tests for win detection and reducer/state transitions (Vitest).
- Commit.

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

## Next Step
- Implement Phase 1 UI scaffold for the 3x3 grid in `src/` and wire initial state.