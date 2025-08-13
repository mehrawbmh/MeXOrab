import { describe, it, expect } from 'vitest'
import { calculateWinner1D, type CellValue } from '@/game'

function boardFrom(marks: string): CellValue[] {
  const map: Record<string, CellValue> = { X: 'X', O: 'O', '.': null }
  return marks.split('').map((ch) => map[ch] ?? null)
}

describe('calculateWinner1D', () => {
  it('detects row wins', () => {
    const board = boardFrom('XXX' + '...' + '...')
    expect(calculateWinner1D(board)?.winner).toBe('X')
  })
  it('detects col wins', () => {
    const board = boardFrom('X..' + 'X..' + 'X..')
    expect(calculateWinner1D(board)?.winner).toBe('X')
  })
  it('detects diagonal wins', () => {
    const board = boardFrom('X..' + '.X.' + '..X')
    expect(calculateWinner1D(board)?.winner).toBe('X')
  })
  it('returns null when no winner', () => {
    const board = boardFrom('XO.' + 'OX.' + '.XO')
    expect(calculateWinner1D(board)).toBeNull()
  })
})
