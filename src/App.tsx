import './App.css'
import { useState } from 'react'
import { calculateWinner, type CellValue } from './game'

function App() {
  const [board, setBoard] = useState<CellValue[]>(Array<CellValue>(9).fill(null))
  const [xIsNext, setXIsNext] = useState<boolean>(true)

  const result = calculateWinner(board)
  const isDraw = !result && board.every((c) => c !== null)
  const currentPlayer: 'X' | 'O' = xIsNext ? 'X' : 'O'

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

      <div
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

      <div className="board" role="grid" aria-label="Tic Tac Toe board">
        {board.map((value, index) => (
          <button
            key={index}
            role="gridcell"
            className="cell"
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
