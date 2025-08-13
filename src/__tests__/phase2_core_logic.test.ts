import { describe, it, expect } from 'vitest'
import { calculateWinner1D } from '@/game'

describe('Phase 2 — Core Game Logic', () => {
  it('detects a horizontal winner', () => {
    const board = [
      'X','X','X',
      null,null,null,
      null,null,null,
    ] as const
    const result = calculateWinner1D(board as any)
    expect(result?.winner).toBe('X')
    expect(result?.line).toEqual([0,1,2])
  })
})
