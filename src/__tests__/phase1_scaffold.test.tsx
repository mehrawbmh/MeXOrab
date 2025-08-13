import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
vi.mock('@/hooks/useGameTimer', () => ({
  useGameTimer: () => ({ nowTs: Date.now(), remainingMs: 0 })
}))
import App from '@/App'

describe('Phase 1 — Scaffold & Baseline UI', () => {
  it('renders title, start overlay, and a 3x3 grid', () => {
    render(<App />)
    expect(screen.getByText(/MeXOrab/i)).toBeInTheDocument()
    // Start overlay play button present
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument()
    // Board structure
    const grid = screen.getByRole('grid', { name: /tic tac toe board/i })
    expect(grid).toBeInTheDocument()
    const cells = screen.getAllByRole('gridcell')
    expect(cells).toHaveLength(9)
  })
})
