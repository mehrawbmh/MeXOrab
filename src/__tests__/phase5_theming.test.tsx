import { describe, it, expect } from 'vitest'
import { THEME_COLORS } from '@/constants'

describe('Phase 5 — Theming & Animations', () => {
  it('exposes theme colors for X and O', () => {
    expect(THEME_COLORS.x).toMatch(/^#/) // hex-like
    expect(THEME_COLORS.o).toMatch(/^#/) // hex-like
  })
})
