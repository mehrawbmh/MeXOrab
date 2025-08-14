import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('@/hooks/useGameTimer', () => ({
  useGameTimer: () => ({ nowTs: Date.now(), remainingMs: 0 })
}))

import App from '@/App'

function startGame() {
  return userEvent.setup()
}

describe('Phase 10: Game Modes', () => {
  it('CPU easy plays a move for O', async () => {
    const user = startGame()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /play/i }))
    const mode = screen.getByLabelText(/mode/i)
    await user.selectOptions(mode, 'CPU easy')
    const cells = screen.getAllByRole('gridcell')
    await user.click(cells[0])
    await new Promise((r) => setTimeout(r, 300))
    const filled = cells.filter((c) => c.textContent === 'O')
    expect(filled.length).toBe(1)
  })

  it('CPU hard blocks immediate win', async () => {
    const user = startGame()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /play/i }))
    const mode = screen.getByLabelText(/mode/i)
    await user.selectOptions(mode, 'CPU hard')
    const cells = screen.getAllByRole('gridcell')
    await user.click(cells[0])
    await new Promise((r) => setTimeout(r, 250))
    await user.click(cells[1])
    await new Promise((r) => setTimeout(r, 250))
    // CPU should take 2 to block X's winning threat
    await new Promise((r) => setTimeout(r, 300))
    expect(cells[2].textContent).toBe('O')
  })
})


