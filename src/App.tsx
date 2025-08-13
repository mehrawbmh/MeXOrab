import './App.css'
import { useEffect, useRef, useState } from 'react'
import { calculateWinner1D, to2D, type CellValue } from './game'
import { BOARD_SIZE, MOVE_TIME_MS } from './constants'
import { useRoundFlow } from './hooks/useRoundFlow'
import { useGameTimer } from './hooks/useGameTimer'
import { Board } from './components/Board'
import { EndOverlay, StartOverlay } from './components/Overlays'

function App() {
  // History and navigation
  const NUM_CELLS = BOARD_SIZE * BOARD_SIZE
  const emptyBoard1D = () => Array<CellValue>(NUM_CELLS).fill(null)
  const [history, setHistory] = useState<CellValue[][]>([emptyBoard1D()])
  const [stepNumber, setStepNumber] = useState<number>(0)
  const board = history[stepNumber]
  const board2D = to2D(board, BOARD_SIZE)

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

  const result = calculateWinner1D(board)
  const isDraw = !result && board.every((c) => c !== null)
  const winningLine = result?.line ?? null
  const displayWinner: 'X' | 'O' | null = forcedWinner ?? result?.winner ?? null

  // Timer per move
  const [deadlineTs, setDeadlineTs] = useState<number | null>(null)
  const { nowTs, remainingMs } = useGameTimer(deadlineTs)
  const timerActive = Boolean(deadlineTs) && !displayWinner && !isDraw && started

  function currentPlayer(): 'X' | 'O' {
    const isEven = stepNumber % 2 === 0
    return isEven ? startingPlayer : startingPlayer === 'X' ? 'O' : 'X'
  }

  function handleCellClick(row: number, col: number): void {
    const index = row * BOARD_SIZE + col
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
    setHistory([emptyBoard1D()])
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
  // ticker moved to useGameTimer hook

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

  // End-of-round flow hook
  useRoundFlow({
    started,
    displayWinner,
    isDraw,
    forcedWinner,
    result,
    creditWin: (w) => setScore((s) => ({ ...s, [w]: s[w] + 1 })),
    creditDraw: () => setScore((s) => ({ ...s, Draws: s.Draws + 1 })),
    onStopAndReset: () => {
      setStarted(false)
      setHistory([emptyBoard1D()])
      setStepNumber(0)
      setForcedWinner(null)
      setDeadlineTs(null)
    },
  })

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
        <Board
          board={board2D}
          winningLine={winningLine}
          started={started}
          displayWinner={displayWinner}
          isDraw={isDraw}
          onCellClick={handleCellClick}
        />
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

      {(displayWinner || isDraw) && (
        <EndOverlay
          message={
            isDraw
              ? 'Game draw'
              : `${displayWinner === 'X' ? playerXName : playerOName} wins!`
          }
          showConfetti={!isDraw}
        />
      )}

      {!started && <StartOverlay onPlay={() => setStarted(true)} />}
    </div>
  )
}

export default App
