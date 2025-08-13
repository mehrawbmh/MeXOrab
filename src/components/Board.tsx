import type { ReactNode } from 'react'
import { type Board2D } from '@/game'
import { BOARD_SIZE } from '@/constants'

export type BoardProps = {
  board: Board2D
  winningLine: number[] | null
  started: boolean
  displayWinner: 'X' | 'O' | null
  isDraw: boolean
  onCellClick: (row: number, col: number) => void
}

export function Board(props: BoardProps) {
  const { board, winningLine, started, displayWinner, isDraw, onCellClick } = props
  const buttons: ReactNode[] = []
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const index = r * BOARD_SIZE + c
      const value = board[r][c]
      buttons.push(
        <button
          key={index}
          role="gridcell"
          className={[
            'cell',
            value === 'X' ? 'x' : value === 'O' ? 'o' : '',
            winningLine && winningLine.includes(index) ? 'win' : '',
          ].join(' ').trim()}
          aria-label={`cell ${index + 1}`}
          onClick={() => onCellClick(r, c)}
          disabled={!started || Boolean(displayWinner) || isDraw || value !== null}
        >
          {value ?? ''}
        </button>
      )
    }
  }
  return (
    <div className="board" role="grid" aria-label="Tic Tac Toe board" aria-describedby="status">
      {buttons}
    </div>
  )
}
