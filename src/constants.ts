export const BOARD_SIZE = 3;
export const MOVE_TIME_MS = 5000; // per move
export const TICK_INTERVAL_MS = 100; // ticker frequency for timer
export const ROUND_END_DISPLAY_MS = 2000; // show win/draw overlay
export const RESULT_TOAST_MS = 1000; // show compact result toast before reset

// Theme palette for X/O branding and accents
export const THEME_COLORS = {
  x: '#67d2ff', // blue for X
  o: '#ffc361', // yellow/orange for O
} as const

export type GameMode = 'human' | 'cpu-easy' | 'cpu-hard'
export type TimerOption = 'off' | '5' | '10'

export const DEFAULTS = {
  mode: 'human' as GameMode,
  timer: '5' as TimerOption,
  bestOf: 1 as 1 | 3 | 5,
  sound: true,
}

export function timerOptionToMs(option: TimerOption): number | null {
  if (option === 'off') return null
  if (option === '5') return 5000
  if (option === '10') return 10000
  return 5000
}
