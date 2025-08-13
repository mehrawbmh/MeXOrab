import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
vi.mock('@/hooks/useGameTimer', () => ({
  useGameTimer: () => ({ nowTs: Date.now(), remainingMs: 0 })
}))
import App from '@/App'

/**
 * Phase 8 covers: start dialog semantics, timer/status aria-live, board Enter activation,
 * and result toast then overlay flow.
 */
describe('Phase 8 — Accessibility & Input Polish', () => {
  it('start overlay is a dialog with labeled inputs and submit via Enter', async () => {
    const user = userEvent.setup()
    render(<App />)
    const dialog = screen.getByRole('dialog', { name: /start game/i })
    expect(dialog).toBeInTheDocument()
    const xInput = screen.getByLabelText(/x name/i, { selector: '#start-x-name' })
    await user.type(xInput, '{Control>}a{/Control}Alice{Enter}')
    // After Enter on form, Play should submit and hide overlay
    await waitFor(() => expect(screen.queryByRole('dialog', { name: /start game/i })).not.toBeInTheDocument())
  })

  it('pressing Enter on focused cell places a mark', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /play/i }))
    await user.keyboard('[ArrowRight]')
    await user.keyboard('[Enter]')
    const cells = screen.getAllByRole('gridcell')
    expect(cells[1]).toHaveTextContent('X')
  })

  it('shows result toast then overlay before reset', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /play/i }))
    const cells = screen.getAllByRole('gridcell')
    const order = [0,3,1,4,2]
    for (const i of order) await user.click(cells[i])
    expect(screen.getByText(/wins$/i)).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText(/wins!/i)).toBeInTheDocument(), { timeout: 1500 })
  })
})
