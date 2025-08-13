import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
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

  // Keyboard navigation state and refs
  const cellRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  function focusIndex(index: number | null): void {
    setFocusedIndex(index)
    if (index != null) {
      const btn = cellRefs.current[index]
      btn?.focus()
    }
  }

  function getNextIndex(
    current: number | null,
    key: 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'
  ): number | null {
    if (current == null) {
      for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
        const btn = cellRefs.current[i]
        if (btn && !btn.disabled) return i
      }
      return null
    }
    const row = Math.floor(current / BOARD_SIZE)
    const col = current % BOARD_SIZE
    let deltaRow = 0
    let deltaCol = 0
    switch (key) {
      case 'ArrowUp':
        deltaRow = -1
        break
      case 'ArrowDown':
        deltaRow = 1
        break
      case 'ArrowLeft':
        deltaCol = -1
        break
      case 'ArrowRight':
        deltaCol = 1
        break
    }
    // Scan forward along the direction to find the first enabled cell
    let r = row + deltaRow
    let c = col + deltaCol
    while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
      const candidate = r * BOARD_SIZE + c
      const btn = cellRefs.current[candidate]
      if (btn && !btn.disabled) return candidate
      r += deltaRow
      c += deltaCol
    }
    return current
  }

  useEffect(() => {
    if (!started) setFocusedIndex(null)
  }, [started])

  // When play starts, move focus to the first enabled cell
  useEffect(() => {
    if (started && !displayWinner && !isDraw) {
      const first = getNextIndex(null, 'ArrowRight')
      if (first != null) focusIndex(first)
    }
  }, [started, displayWinner, isDraw])

  const buttons: ReactNode[] = []
  cellRefs.current = []
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const index = r * BOARD_SIZE + c
      const value = board[r][c]
      const disabled = !started || Boolean(displayWinner) || isDraw || value !== null
      buttons.push(
        <button
          key={index}
          ref={(el) => { cellRefs.current[index] = el }}
          role="gridcell"
          className={[
            'cell',
            value === 'X' ? 'x' : value === 'O' ? 'o' : '',
            winningLine && winningLine.includes(index) ? 'win' : '',
          ].join(' ').trim()}
          aria-label={`cell ${index + 1}`}
          onClick={() => onCellClick(r, c)}
          disabled={disabled}
          tabIndex={-1}
          data-index={index}
        >
          {value ?? ''}
        </button>
      )
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>): void {
    const key = event.key
    if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight') {
      event.preventDefault()
      const next = getNextIndex(focusedIndex, key)
      if (next !== null) {
        focusIndex(next)
      }
    } else if (key === ' ' || key === 'Spacebar') {
      if (focusedIndex != null) {
        event.preventDefault()
        const btn = cellRefs.current[focusedIndex]
        if (btn && !btn.disabled) btn.click()
      }
    }
  }

  // removed handleGridFocus; we programmatically move focus

  // After a move, the previously focused cell may become disabled.
  // Keep the grid focused and move focus to a valid cell to maintain keyboard flow.
  useEffect(() => {
    if (!started || displayWinner || isDraw) return
    // If focused cell is now disabled, move to the first enabled cell
    if (focusedIndex != null) {
      const btn = cellRefs.current[focusedIndex]
      if (!btn || btn.disabled) {
        for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
          const candidate = cellRefs.current[i]
          if (candidate && !candidate.disabled) {
            focusIndex(i)
            break
          }
        }
      }
    }
  }, [board, started, displayWinner, isDraw])

  return (
    <div
      className="board"
      role="grid"
      aria-label="Tic Tac Toe board"
      aria-describedby="status"
      tabIndex={-1}
      onKeyDown={handleKeyDown}
    >
      {buttons}
    </div>
  )
}
