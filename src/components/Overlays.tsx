// no React import needed in Vite/TSX with new JSX transform

export function StartOverlay(props: { onPlay: () => void }) {
  return (
    <div className="start-overlay">
      <button className="play-button-large" onClick={props.onPlay}>
        ▶ Play
      </button>
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
