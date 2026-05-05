'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'educa-theme';

type ThemeMode = 'light' | 'dark';

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme: ThemeMode = stored === 'dark' || stored === 'light' ? stored : preferredDark ? 'dark' : 'light';

    setTheme(initialTheme);
    applyTheme(initialTheme);
    setReady(true);
  }, []);

  function handleToggle() {
    const nextTheme: ThemeMode = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="icon-button"
      aria-label={ready ? `Activar modo ${theme === 'dark' ? 'claro' : 'oscuro'}` : 'Cambiar tema'}
      title={ready ? `Modo ${theme === 'dark' ? 'oscuro' : 'claro'} activo` : 'Cambiar tema'}
    >
      {theme === 'dark' ? (
        <Sun aria-hidden="true" className="h-[18px] w-[18px]" />
      ) : (
        <Moon aria-hidden="true" className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
