export function BackgroundDecor() {
  return (
    <div className="background-decor" aria-hidden="true">
      <div className="edge-grid" />
      <svg className="o-shape" viewBox="0 0 500 500">
        <defs>
          <linearGradient id="oGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67d2ff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#67d2ff" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <circle cx="250" cy="250" r="170" fill="none" stroke="url(#oGrad)" strokeWidth="80" />
      </svg>
      <svg className="x-shape" viewBox="0 0 500 500">
        <defs>
          <linearGradient id="xGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffc361" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#ffc361" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <g stroke="url(#xGrad)" strokeWidth="80" strokeLinecap="round">
          <line x1="100" y1="100" x2="400" y2="400" />
          <line x1="400" y1="100" x2="100" y2="400" />
        </g>
      </svg>
    </div>
  )
}
