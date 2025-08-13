import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
vi.mock('@/hooks/useGameTimer', () => ({
  useGameTimer: () => ({ nowTs: Date.now(), remainingMs: 0 })
}))
import App from '@/App'

describe('Phase 4 — Game Enhancements', () => {
  it('scoreboard increments after a win', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /play/i }))

    const cells = screen.getAllByRole('gridcell')
    const order = [0,3,1,4,2] // X wins
    for (const i of order) await user.click(cells[i])

    // Wait until scoreboard credit is applied (on reset)
    await waitFor(() => {
      expect(screen.getByText(/\(X\)/).closest('.score')!).toHaveTextContent(/1$/)
    }, { timeout: 3000 })
  })
})
