import { useTheme, type ThemeName } from '@/theme/ThemeContext'

export function SettingsDialog(props: { onClose: () => void }) {
  const { theme, setTheme, toggleTheme } = useTheme()

  function handleThemeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setTheme(e.target.value as ThemeName)
  }

  return (
    <div className="settings-overlay" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div className="settings-panel">
        <h2 id="settings-title">Settings</h2>
        <fieldset className="theme-controls">
          <legend>Theme</legend>
          <div className="row">
            <label>
              <input type="radio" name="theme" value="dark" checked={theme === 'dark'} onChange={handleThemeChange} />
              Dark
            </label>
            <label>
              <input type="radio" name="theme" value="light" checked={theme === 'light'} onChange={handleThemeChange} />
              Light
            </label>
          </div>
          <button className="toggle" type="button" onClick={toggleTheme} aria-label="Toggle theme">Toggle</button>
        </fieldset>
        <div className="settings-actions">
          <button className="reset" onClick={props.onClose} aria-label="Close settings">Close</button>
        </div>
      </div>
    </div>
  )
}
