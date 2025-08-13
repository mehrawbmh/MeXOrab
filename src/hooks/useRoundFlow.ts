import { useEffect, useRef } from 'react'
import { ROUND_END_DISPLAY_MS } from '../constants'

export function useRoundFlow(params: {
  started: boolean
  displayWinner: 'X' | 'O' | null
  isDraw: boolean
  forcedWinner: 'X' | 'O' | null
  result: { winner: 'X' | 'O'; line: [number, number, number] } | null
  creditWin: (w: 'X' | 'O') => void
  creditDraw: () => void
  onStopAndReset: () => void
}) {
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!params.started) return
    if (!params.displayWinner && !params.isDraw) return
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    const id = window.setTimeout(() => {
      if (params.displayWinner && !params.forcedWinner && params.result) {
        params.creditWin(params.result.winner)
      } else if (params.isDraw) {
        params.creditDraw()
      }
      params.onStopAndReset()
    }, ROUND_END_DISPLAY_MS)
    timerRef.current = id
    return () => {
      clearTimeout(id)
      timerRef.current = null
    }
  }, [params.started, params.displayWinner, params.isDraw, params.forcedWinner, params.result])
}
