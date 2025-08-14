import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('@/hooks/useGameTimer', () => ({
  useGameTimer: () => ({ nowTs: Date.now(), remainingMs: 0 })
}))

import App from '@/App'

describe('Phase 10: Best-of series', () => {
  it('plays best-of-3 and continues without series UI', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /play/i }))
    await user.selectOptions(screen.getByLabelText(/best of/i), '3')
    const playRound = async () => {
      const cells = screen.getAllByRole('gridcell')
      const order = [0,3,1,4,2]
      for (const idx of order) await user.click(cells[idx])
      await waitFor(() => expect(screen.getByText(/wins!/i)).toBeInTheDocument(), { timeout: 1500 })
      await waitFor(() => expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument(), { timeout: 2500 })
      await user.click(screen.getByRole('button', { name: /play/i }))
    }
    await playRound()
    const xScore1 = screen.getByText(/\(X\)/i).parentElement?.querySelector('.value')?.textContent
    expect(xScore1).toBe('1')
    await playRound()
    const xScore2 = screen.getByText(/\(X\)/i).parentElement?.querySelector('.value')?.textContent
    expect(xScore2).toBe('2')
    expect(screen.queryByText(/Series\s+[XO]/i)).not.toBeInTheDocument()
  })
})


