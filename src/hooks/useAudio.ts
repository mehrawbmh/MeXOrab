import { useCallback, useMemo } from 'react'

export function useAudio(enabled: boolean) {
  const supports = typeof Audio !== 'undefined'
  const place = useMemo(() => supports ? new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABYAAAABAAAA') : null, [supports])
  const win = useMemo(() => supports ? new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABYAAAABAAAA') : null, [supports])
  const draw = useMemo(() => supports ? new Audio('data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABYAAAABAAAA') : null, [supports])

  const playPlace = useCallback(() => { if (enabled && place) { try { place.currentTime = 0; void place.play() } catch {} } }, [enabled, place])
  const playWin = useCallback(() => { if (enabled && win) { try { win.currentTime = 0; void win.play() } catch {} } }, [enabled, win])
  const playDraw = useCallback(() => { if (enabled && draw) { try { draw.currentTime = 0; void draw.play() } catch {} } }, [enabled, draw])

  return { playPlace, playWin, playDraw }
}


