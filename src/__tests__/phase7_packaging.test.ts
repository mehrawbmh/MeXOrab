import { describe, it, expect } from 'vitest'
import fs from 'fs'

describe('Phase 7 — Packaging & Delivery', () => {
  it('includes Dockerfile and nginx.conf for static hosting', () => {
    expect(fs.existsSync('Dockerfile')).toBe(true)
    expect(fs.existsSync('nginx.conf')).toBe(true)
  })
})
