import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
vi.mock('@/hooks/useGameTimer', () => ({
  useGameTimer: () => ({ nowTs: Date.now(), remainingMs: 0 })
}))
import App from '@/App'

describe('Phase 3 — Keyboard Accessibility', () => {
  it('arrow keys move focus and Space places a mark', async () => {
    const user = userEvent.setup()
    render(<App />)

    // Start game quickly
    await user.click(screen.getByRole('button', { name: /play/i }))

    const grid = screen.getByRole('grid', { name: /tic tac toe board/i })
    // Ensure grid can handle key events: move right twice, then space
    await user.keyboard('[ArrowRight][ArrowRight]')
    await user.keyboard('[Space]')

    const cells = screen.getAllByRole('gridcell')
    // First move should be by X
    expect(cells[2]).toHaveTextContent('X')
  })
})
