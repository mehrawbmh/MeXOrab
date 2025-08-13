import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '@/App'

// Do not mock: we want to ensure tests run in CI, but keep simple here
vi.mock('@/hooks/useGameTimer', () => ({
  useGameTimer: () => ({ nowTs: Date.now(), remainingMs: 0 })
}))

describe('Phase 6 — Tests & Quality', () => {
  it('renders without console errors', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<App />)
    expect(screen.getByText(/MeXOrab/i)).toBeInTheDocument()
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })
})
