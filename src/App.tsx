import './App.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { calculateWinner, type CellValue } from './game'

function App() {
  // History and navigation
  const [history, setHistory] = useState<CellValue[][]>([
    Array<CellValue>(9).fill(null),
  ])
  const [stepNumber, setStepNumber] = useState<number>(0)
  const board = history[stepNumber]

  // Start gate
  const [started, setStarted] = useState<boolean>(false)

  // Players and starter
  const [startingPlayer, setStartingPlayer] = useState<'X' | 'O'>('X')
  const [playerXName, setPlayerXName] = useState<string>('Player X')
  const [playerOName, setPlayerOName] = useState<string>('Player O')

  // Scoreboard
  const [score, setScore] = useState<{ X: number; O: number; Draws: number}>(
    { X: 0, O: 0, Draws: 0 },
  )
  const [forcedWinner, setForcedWinner] = useState<'X' | 'O' | null>(null)
  const [historyOpen, setHistoryOpen] = useState<boolean>(false)
  const resetTimerRef = useRef<number | null>(null)

  const result = calculateWinner(board)
  const isDraw = !result && board.every((c) => c !== null)
  const winningLine = result?.line ?? null
  const displayWinner: 'X' | 'O' | null = forcedWinner ?? result?.winner ?? null

  // Timer per move (5 seconds)
  const MOVE_TIME_MS = 5000
  const [deadlineTs, setDeadlineTs] = useState<number | null>(null)
  const [nowTs, setNowTs] = useState<number>(() => Date.now())
  const remainingMs = useMemo(() => {
    if (!deadlineTs) return 0
    return Math.max(0, deadlineTs - nowTs)
  }, [deadlineTs, nowTs])
  const timerActive = Boolean(deadlineTs) && !displayWinner && !isDraw && started

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
    setForcedWinner(null)
    setDeadlineTs(null)
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current)
      resetTimerRef.current = null
    }
  }

  function jumpTo(step: number): void {
    setStepNumber(step)
  }

  function resetScoreboard(): void {
    setScore({ X: 0, O: 0, Draws: 0 })
  }

  // Ticker (only while timer is active)
  useEffect(() => {
    if (!timerActive) return
    const id = window.setInterval(() => setNowTs(Date.now()), 100)
    return () => window.clearInterval(id)
  }, [timerActive])

  // Reset deadline whenever it's a playable latest position without result
  useEffect(() => {
    const atLatest = stepNumber === history.length - 1
    if (started && atLatest && !result && !forcedWinner) {
      setDeadlineTs(Date.now() + MOVE_TIME_MS)
    } else {
      setDeadlineTs(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, stepNumber, history.length, result, forcedWinner])

  // Auto-move or timeout win when time runs out
  useEffect(() => {
    if (!deadlineTs) return
    const atLatest = stepNumber === history.length - 1
    if (!started || !atLatest || result || forcedWinner) return
    if (deadlineTs - nowTs <= 0) {
      // time up: current player loses, opponent wins
      const loser = currentPlayer()
      const winner: 'X' | 'O' = loser === 'X' ? 'O' : 'X'
      setForcedWinner(winner)
      setScore((s) => ({ ...s, [winner]: s[winner] + 1 }))
      setDeadlineTs(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadlineTs, nowTs, stepNumber, history.length, result, board, forcedWinner, started])

  // After a round finishes, show result for 3s, then stop and show Play
  useEffect(() => {
    if (!started) return
    if (!displayWinner && !isDraw) return
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current)
      resetTimerRef.current = null
    }
    const id = window.setTimeout(() => {
      if (displayWinner && !forcedWinner && result) {
        setScore((s) => ({ ...s, [result.winner]: s[result.winner] + 1 }))
      } else if (isDraw) {
        setScore((s) => ({ ...s, Draws: s.Draws + 1 }))
      }
      setStarted(false)
      setHistory([Array<CellValue>(9).fill(null)])
      setStepNumber(0)
      setForcedWinner(null)
      setDeadlineTs(null)
    }, 3000)
    resetTimerRef.current = id
    return () => {
      clearTimeout(id)
      resetTimerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayWinner, isDraw, started])

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">MeXOrab</h1>
        <p className="subtitle">simple XO game created by Mehrab</p>
      </header>

      <div className="controls">
        <div
          id="status"
          className="status"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {!started
            ? 'Press Play to start'
            : displayWinner
            ? `Winner: ${displayWinner === 'X' ? playerXName : playerOName}`
            : isDraw
            ? 'Draw'
            : `Next: ${currentPlayer() === 'X' ? playerXName : playerOName}`}
        </div>
        {timerActive && (
          <div className="timer" aria-label="Time remaining">
            {(remainingMs / 1000).toFixed(1)}s
          </div>
        )}
        <div className="buttons">
          <button className="reset" onClick={resetGame} aria-label="Reset game">
            Reset
          </button>
          <button
            className="reset"
            onClick={resetScoreboard}
            aria-label="Reset scoreboard"
          >
            Reset score
          </button>
        </div>
        <button
          className="icon-button"
          aria-expanded={historyOpen}
          aria-controls="history-menu"
          onClick={() => setHistoryOpen((v) => !v)}
          title="Toggle history menu"
          aria-label="Toggle history"
        >
          ☰
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
          >
            <option value="X">X</option>
            <option value="O">O</option>
          </select>
          {/* helper removed per request */}
          
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

      <div className="board-wrap">
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
              disabled={!started || Boolean(displayWinner) || isDraw || value !== null}
            >
              {value ?? ''}
            </button>
          ))}
        </div>
      </div>

      <section
        id="history-menu"
        className={["history-menu", historyOpen ? "open" : ""].join(" ").trim()}
        aria-label="Move history"
        hidden={!historyOpen}
      >
        <div className="history-list">
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
        </div>
      </section>

      {displayWinner && (
        <div className="win-overlay" aria-live="polite">
          <div className="win-message">
            {displayWinner === 'X' ? playerXName : playerOName} wins!
          </div>
          <div className="confetti" aria-hidden="true" />
        </div>
      )}

      {!started && (
        <div className="start-overlay">
          <button className="play-button-large" onClick={() => setStarted(true)}>
            ▶ Play
          </button>
        </div>
      )}
    </div>
  )
}

export default App
