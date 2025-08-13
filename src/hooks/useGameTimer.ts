import { useEffect, useMemo, useState } from 'react'
import { TICK_INTERVAL_MS } from '@/constants'

export function useGameTimer(deadlineTs: number | null) {
  const [nowTs, setNowTs] = useState<number>(() => Date.now())
  const remainingMs = useMemo(() => {
    if (!deadlineTs) return 0
    return Math.max(0, deadlineTs - nowTs)
  }, [deadlineTs, nowTs])

  useEffect(() => {
    if (!deadlineTs) return
    const id = window.setInterval(() => setNowTs(Date.now()), TICK_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [deadlineTs])

  return { nowTs, remainingMs }
}
