import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('@/hooks/useGameTimer', () => ({
  useGameTimer: () => ({ nowTs: Date.now(), remainingMs: 0 })
}))

import App from '@/App'

describe('Phase 10: No timer mode', () => {
  it('hides timer when timer is Off', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /play/i }))
    await user.selectOptions(screen.getByLabelText(/timer/i), 'Off')
    expect(screen.queryByRole('status', { name: /time remaining/i })).not.toBeInTheDocument()
  })
})


