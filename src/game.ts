export type CellValue = 'X' | 'O' | null
export type Board2D = CellValue[][]

export type WinnerResult = {
  winner: 'X' | 'O'
  line: [number, number, number]
} | null

const WIN_LINES_1D: Array<[number, number, number]> = [
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

export function calculateWinner1D(board: CellValue[]): WinnerResult {
  for (const [a, b, c] of WIN_LINES_1D) {
    const va = board[a]
    if (va && va === board[b] && va === board[c]) {
      return { winner: va, line: [a, b, c] }
    }
  }
  return null
}

export function to1D(board: Board2D): CellValue[] {
  return board.flat()
}

export function to2D(board: CellValue[], size: number): Board2D {
  const rows: Board2D = []
  for (let r = 0; r < size; r++) {
    rows.push(board.slice(r * size, (r + 1) * size))
  }
  return rows
}

export function calculateWinner2D(board: Board2D): WinnerResult {
  const size = board.length
  // rows
  for (let r = 0; r < size; r++) {
    const first = board[r][0]
    if (!first) continue
    let allEqual = true
    for (let c = 1; c < size; c++) {
      if (board[r][c] !== first) { allEqual = false; break }
    }
    if (allEqual) {
      return { winner: first, line: [0, 1, 2].map((c) => r * size + c) as [number, number, number] }
    }
  }
  // cols
  for (let c = 0; c < size; c++) {
    const first = board[0][c]
    if (!first) continue
    let allEqual = true
    for (let r = 1; r < size; r++) {
      if (board[r][c] !== first) { allEqual = false; break }
    }
    if (allEqual) {
      return { winner: first, line: [0, 1, 2].map((r) => r * size + c) as [number, number, number] }
    }
  }
  // diagonals
  {
    const first = board[0][0]
    if (first && board[1][1] === first && board[2][2] === first) {
      return { winner: first, line: [0, 4, 8] }
    }
  }
  {
    const first = board[0][2]
    if (first && board[1][1] === first && board[2][0] === first) {
      return { winner: first, line: [2, 4, 6] }
    }
  }
  return null
}

export function createEmptyBoard2D(size: number): Board2D {
  return Array.from({ length: size }, () => Array<CellValue>(size).fill(null))
}

export function getAvailableMoves(board: CellValue[]): number[] {
  const indexes: number[] = []
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) indexes.push(i)
  }
  return indexes
}

export function pickRandomMove(board: CellValue[]): number | null {
  const moves = getAvailableMoves(board)
  if (moves.length === 0) return null
  const r = Math.floor(Math.random() * moves.length)
  return moves[r]
}

export function minimax(
  board: CellValue[],
  currentPlayer: 'X' | 'O',
  maximizingPlayer: 'X' | 'O'
): { score: number; move: number | null } {
  const winner = calculateWinner1D(board)
  if (winner) {
    return { score: winner.winner === maximizingPlayer ? 1 : -1, move: null }
  }
  if (board.every((c) => c !== null)) return { score: 0, move: null }
  let bestMove: number | null = null
  if (currentPlayer === maximizingPlayer) {
    let bestScore = -Infinity
    for (const move of getAvailableMoves(board)) {
      const next = board.slice()
      next[move] = currentPlayer
      const nextPlayer = currentPlayer === 'X' ? 'O' : 'X'
      const { score } = minimax(next, nextPlayer, maximizingPlayer)
      if (score > bestScore) {
        bestScore = score
        bestMove = move
      }
      if (bestScore === 1) break
    }
    return { score: bestScore, move: bestMove }
  } else {
    let bestScore = Infinity
    for (const move of getAvailableMoves(board)) {
      const next = board.slice()
      next[move] = currentPlayer
      const nextPlayer = currentPlayer === 'X' ? 'O' : 'X'
      const { score } = minimax(next, nextPlayer, maximizingPlayer)
      if (score < bestScore) {
        bestScore = score
        bestMove = move
      }
      if (bestScore === -1) break
    }
    return { score: bestScore, move: bestMove }
  }
}
