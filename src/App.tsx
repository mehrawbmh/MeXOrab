import './App.css'
import { useState } from 'react'
import { calculateWinner, type CellValue } from './game'

function App() {
  // History and navigation
  const [history, setHistory] = useState<CellValue[][]>([
    Array<CellValue>(9).fill(null),
  ])
  const [stepNumber, setStepNumber] = useState<number>(0)
  const board = history[stepNumber]

  // Players and starter
  const [startingPlayer, setStartingPlayer] = useState<'X' | 'O'>('X')
  const [playerXName, setPlayerXName] = useState<string>('Player X')
  const [playerOName, setPlayerOName] = useState<string>('Player O')

  // Scoreboard
  const [score, setScore] = useState<{ X: number; O: number; Draws: number}>(
    { X: 0, O: 0, Draws: 0 },
  )

  const result = calculateWinner(board)
  const isDraw = !result && board.every((c) => c !== null)
  const winningLine = result?.line ?? null

  function currentPlayer(): 'X' | 'O' {
    const isEven = stepNumber % 2 === 0
    return isEven ? startingPlayer : startingPlayer === 'X' ? 'O' : 'X'
  }

  function handleCellClick(index: number): void {
    if (result || board[index] !== null) return
    const nextBoard = board.slice()
    nextBoard[index] = currentPlayer()

    const nextHistory = history.slice(0, stepNumber + 1)
    nextHistory.push(nextBoard)
    setHistory(nextHistory)
    setStepNumber(nextHistory.length - 1)
  }

  function resetGame(): void {
    // If game finished, update scoreboard once per reset
    if (result) {
      setScore((s) => ({ ...s, [result.winner]: s[result.winner] + 1 }))
    } else if (isDraw) {
      setScore((s) => ({ ...s, Draws: s.Draws + 1 }))
    }
    // Reset history and step
    setHistory([Array<CellValue>(9).fill(null)])
    setStepNumber(0)
  }

  function jumpTo(step: number): void {
    setStepNumber(step)
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">MeXOrab</h1>
        <p className="subtitle">Phase 4: Scoreboard, names, history, starter</p>
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
            ? `Winner: ${result.winner === 'X' ? playerXName : playerOName}`
            : isDraw
            ? 'Draw'
            : `Next: ${currentPlayer() === 'X' ? playerXName : playerOName}`}
        </div>
        <button className="reset" onClick={resetGame} aria-label="Reset game">
          Reset
        </button>
      </div>

      <section className="panel" aria-label="Settings and scoreboard">
        <div className="form-row">
          <label htmlFor="nameX">X name</label>
          <input
            id="nameX"
            className="text"
            value={playerXName}
            onChange={(e) => setPlayerXName(e.target.value)}
          />
          <label htmlFor="nameO">O name</label>
          <input
            id="nameO"
            className="text"
            value={playerOName}
            onChange={(e) => setPlayerOName(e.target.value)}
          />
          <label htmlFor="starter">Starter</label>
          <select
            id="starter"
            className="select"
            value={startingPlayer}
            onChange={(e) => setStartingPlayer(e.target.value as 'X' | 'O')}
            disabled={stepNumber !== 0}
            aria-describedby={stepNumber !== 0 ? 'starter-help' : undefined}
          >
            <option value="X">X</option>
            <option value="O">O</option>
          </select>
          {stepNumber !== 0 && (
            <span id="starter-help" className="help">
              Change starter when a new game begins
            </span>
          )}
        </div>

        <div className="scoreboard" role="group" aria-label="Scoreboard">
          <div className="score x">
            <span className="label">{playerXName} (X)</span>
            <span className="value">{score.X}</span>
          </div>
          <div className="score draws">
            <span className="label">Draws</span>
            <span className="value">{score.Draws}</span>
          </div>
          <div className="score o">
            <span className="label">{playerOName} (O)</span>
            <span className="value">{score.O}</span>
          </div>
        </div>
      </section>

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

      <section className="history" aria-label="Move history">
        {history.map((_, move) => {
          const desc = move === 0 ? 'Go to start' : `Go to move #${move}`
          return (
            <button
              key={move}
              className={['history-btn', move === stepNumber ? 'active' : '']
                .join(' ')
                .trim()}
              onClick={() => jumpTo(move)}
              disabled={move === stepNumber}
            >
              {desc}
            </button>
          )
        })}
      </section>
    </div>
  )
}

export default App
