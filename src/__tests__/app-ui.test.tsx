import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
vi.mock('@/hooks/useGameTimer', () => ({
  useGameTimer: () => ({ nowTs: Date.now(), remainingMs: 0 })
}))
import App from '@/App'

function getPlayButton() {
  return screen.getByRole('button', { name: /play/i })
}

describe('App UI flow', () => {
  it('shows start overlay and starts on Play', async () => {
    render(<App />)
    expect(getPlayButton()).toBeInTheDocument()
    await userEvent.click(getPlayButton())
    expect(screen.queryByRole('button', { name: /play/i })).not.toBeInTheDocument()
  })

  it('shows win overlay and hides after 2s, then shows Play again', async () => {
    // Use real timers for this flow to avoid async deadlocks
    const user = userEvent.setup()
    render(<App />)
    await user.click(getPlayButton())

    // Make X win quickly: top row 0,1,2
    const cells = screen.getAllByRole('gridcell')
    const order = [0,3,1,4,2] // X at 0,1,2; O at 3,4
    for (const idx of order) {
      await user.click(cells[idx])
    }

    expect(screen.getByText(/wins/i)).toBeInTheDocument()

    await new Promise((r) => setTimeout(r, 2200))
    expect(getPlayButton()).toBeInTheDocument()
  })
})
