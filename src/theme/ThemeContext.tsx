import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type ThemeName = 'dark' | 'light'

const ThemeContext = createContext<{
  theme: ThemeName
  setTheme: (t: ThemeName) => void
  toggleTheme: () => void
} | null>(null)

const STORAGE_KEY = 'mexorab:theme'

export function ThemeProvider(props: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(() => {
    const fromStorage = (typeof window !== 'undefined') ? window.localStorage.getItem(STORAGE_KEY) as ThemeName | null : null
    if (fromStorage === 'dark' || fromStorage === 'light') return fromStorage
    // fallback to system
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light'
    }
    return 'dark'
  })

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', theme)
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, theme)
    }
  }, [theme])

  const value = useMemo(() => ({
    theme,
    setTheme,
    toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
  }), [theme])

  return <ThemeContext.Provider value={value}>{props.children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
