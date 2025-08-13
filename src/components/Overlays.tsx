// no React import needed in Vite/TSX with new JSX transform
import { useEffect, useRef, useState } from 'react'

type StartOverlayProps = {
  initialXName: string
  initialOName: string
  onPlay: (names: { xName: string; oName: string }) => void
  onSkip: () => void
}

export function StartOverlay(props: StartOverlayProps) {
  const [xName, setXName] = useState<string>(props.initialXName)
  const [oName, setOName] = useState<string>(props.initialOName)
  const xInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    xInputRef.current?.focus()
  }, [])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    props.onPlay({ xName: xName.trim() || props.initialXName, oName: oName.trim() || props.initialOName })
  }

  return (
    <div className="start-overlay">
      <form onSubmit={handleSubmit} className="start-form" aria-label="Start game">
        <label htmlFor="start-x-name">X name</label>
        <input
          id="start-x-name"
          ref={xInputRef}
          className="text"
          value={xName}
          onChange={(e) => setXName(e.target.value)}
        />
        <label htmlFor="start-o-name">O name</label>
        <input
          id="start-o-name"
          className="text"
          value={oName}
          onChange={(e) => setOName(e.target.value)}
        />
        <button type="submit" className="play-button-large" aria-label="Play">
          ▶ Play
        </button>
        <button type="button" className="link" onClick={props.onSkip} aria-label="Skip for now">
          Skip for now
        </button>
      </form>
    </div>
  )
}

export function EndOverlay(props: { message: string; showConfetti?: boolean }) {
  return (
    <div className="win-overlay" aria-live="polite">
      <div className="win-message">{props.message}</div>
      {props.showConfetti && <div className="confetti" aria-hidden="true" />}
    </div>
  )
}
