import './App.css'
import { useMemo } from 'react'

type CellValue = 'X' | 'O' | null

function App() {
  const cells: CellValue[] = useMemo(() => Array<CellValue>(9).fill(null), [])

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">MeXOrab</h1>
        <p className="subtitle">Phase 1: UI scaffold</p>
      </header>

      <div className="board" role="grid" aria-label="Tic Tac Toe board">
        {cells.map((value, index) => (
          <button
            key={index}
            role="gridcell"
            className="cell"
            aria-label={`cell ${index + 1}`}
            disabled
          >
            {value ?? ''}
          </button>
        ))}
      </div>
    </div>
  )
}

export default App
