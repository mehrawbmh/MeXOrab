import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
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
    const user = userEvent.setup()
    render(<App />)
    expect(getPlayButton()).toBeInTheDocument()
    // Fill names then play
    const xInput = screen.getByLabelText(/x name/i, { selector: '#start-x-name' })
    const oInput = screen.getByLabelText(/o name/i, { selector: '#start-o-name' })
    await user.clear(xInput)
    await user.type(xInput, 'Alice')
    await user.clear(oInput)
    await user.type(oInput, 'Bob')
    await user.click(getPlayButton())
    expect(screen.queryByRole('button', { name: /play/i })).not.toBeInTheDocument()
  })

  it('shows toast then overlay then Play after 2s', async () => {
    const user = userEvent.setup()
    render(<App />)
    // Start game quickly (skip names)
    await user.click(getPlayButton())

    // Make X win quickly: top row 0,1,2
    const cells = screen.getAllByRole('gridcell')
    const order = [0,3,1,4,2] // X at 0,1,2; O at 3,4
    for (const idx of order) {
      await user.click(cells[idx])
    }

    // Toast should appear first
    expect(screen.getByText(/wins$/i)).toBeInTheDocument()
    // Then overlay appears after toast hides, still within overall flow
    await waitFor(() => expect(screen.getByText(/wins!/i)).toBeInTheDocument(), { timeout: 1500 })
    // And eventually Play returns
    await waitFor(() => expect(getPlayButton()).toBeInTheDocument(), { timeout: 3000 })
  })
})
