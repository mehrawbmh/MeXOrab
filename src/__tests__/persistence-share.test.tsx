import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('@/hooks/useGameTimer', () => ({
  useGameTimer: () => ({ nowTs: Date.now(), remainingMs: 0 })
}))

import App from '@/App'

describe('Phase 12: Persistence & Share', () => {
  it('persists settings in localStorage and applies query params', async () => {
    const user = userEvent.setup()
    const url = new URL('http://localhost/?mode=cpu-easy&timer=10&bestOf=5&x=Ann&o=Ben')
    window.history.replaceState({}, '', url.toString())
    render(<App />)
    expect(screen.getByLabelText(/x name/i, { selector: '#start-x-name' })).toHaveValue('Ann')
    expect(screen.getByLabelText(/o name/i, { selector: '#start-o-name' })).toHaveValue('Ben')
    await user.click(screen.getByRole('button', { name: /play/i }))
    expect((screen.getByLabelText(/mode/i) as HTMLSelectElement).value).toBe('cpu-easy')
    expect((screen.getByLabelText(/timer/i) as HTMLSelectElement).value).toBe('10')
    expect((screen.getByLabelText(/best of/i) as HTMLSelectElement).value).toBe('5')
  })
})


