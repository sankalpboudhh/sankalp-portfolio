import { useEffect, useState } from 'react';
import './ThemeToggle.css';

const ACCENTS = [
  { id: 'lime', color: '#c8f560' },
  { id: 'orange', color: '#ffa94d' },
  { id: 'blue', color: '#6cb6ff' },
];

const root = document.documentElement;
const read = (k, fallback) => {
  try { return localStorage.getItem(k) || fallback; } catch { return fallback; }
};
const save = (k, v) => { try { localStorage.setItem(k, v); } catch {} };

function ThemeToggle() {
  const [theme, setTheme] = useState(root.dataset.theme || 'dark');
  const [accent, setAccent] = useState(read('accent', 'lime'));

  useEffect(() => {
    root.dataset.theme = theme;
    save('theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'light' ? '#f6f4ef' : '#0d0d0d';
  }, [theme]);

  useEffect(() => {
    if (accent === 'lime') delete root.dataset.accent;
    else root.dataset.accent = accent;
    save('accent', accent);
  }, [accent]);

  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <div className="theme-controls">
      <div className="accent-picker" role="group" aria-label="Accent colour">
        {ACCENTS.map((a) => (
          <button
            key={a.id}
            type="button"
            className={`accent-dot ${accent === a.id ? 'active' : ''}`}
            style={{ background: a.color }}
            aria-label={`${a.id} accent`}
            aria-pressed={accent === a.id}
            onClick={() => setAccent(a.id)}
          />
        ))}
      </div>
      <button
        type="button"
        className="theme-btn"
        aria-label={`Switch to ${next} theme`}
        title={`Switch to ${next} theme`}
        onClick={() => setTheme(next)}
      >
        {theme === 'dark' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default ThemeToggle;
