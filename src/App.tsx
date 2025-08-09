import './App.css'
import { useState } from 'react'
import { calculateWinner, type CellValue } from './game'

function App() {
  const [board, setBoard] = useState<CellValue[]>(Array<CellValue>(9).fill(null))
  const [xIsNext, setXIsNext] = useState<boolean>(true)

  const result = calculateWinner(board)
  const isDraw = !result && board.every((c) => c !== null)
  const currentPlayer: 'X' | 'O' = xIsNext ? 'X' : 'O'
  const winningLine = result?.line ?? null

  function resetGame(): void {
    setBoard(Array<CellValue>(9).fill(null))
    setXIsNext(true)
  }

  function handleCellClick(index: number): void {
    if (result || board[index] !== null) return
    const nextBoard = board.slice()
    nextBoard[index] = currentPlayer
    setBoard(nextBoard)
    setXIsNext((prev) => !prev)
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">MeXOrab</h1>
        <p className="subtitle">Phase 2: Core game logic</p>
      </header>

      <div className="controls">
        <div
          id="status"
          className="status"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {result
            ? `Winner: ${result.winner}`
            : isDraw
            ? 'Draw'
            : `Next: ${currentPlayer}`}
        </div>
        <button className="reset" onClick={resetGame} aria-label="Reset game">
          Reset
        </button>
      </div>

      <div
        className="board"
        role="grid"
        aria-label="Tic Tac Toe board"
        aria-describedby="status"
      >
        {board.map((value, index) => (
          <button
            key={index}
            role="gridcell"
            className={[
              'cell',
              value === 'X' ? 'x' : value === 'O' ? 'o' : '',
              winningLine && winningLine.includes(index) ? 'win' : '',
            ].join(' ').trim()}
            aria-label={`cell ${index + 1}`}
            onClick={() => handleCellClick(index)}
            disabled={Boolean(result) || value !== null}
          >
            {value ?? ''}
          </button>
        ))}
      </div>
    </div>
  )
}

export default App
