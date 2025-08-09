export type CellValue = 'X' | 'O' | null

export type WinnerResult = {
  winner: 'X' | 'O'
  line: [number, number, number]
} | null

const WIN_LINES: Array<[number, number, number]> = [
  // rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // cols
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // diagonals
  [0, 4, 8],
  [2, 4, 6],
]

export function calculateWinner(board: CellValue[]): WinnerResult {
  for (const [a, b, c] of WIN_LINES) {
    const va = board[a]
    if (va && va === board[b] && va === board[c]) {
      return { winner: va, line: [a, b, c] }
    }
  }
  return null
}
