import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  const Icon = theme === 'dark' ? Sun : Moon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === 'light'}
      title={`Switch to ${nextTheme} mode`}
      className={`theme-toggle-button inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${compact ? 'w-10 px-0' : ''}`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span className={compact ? 'sr-only' : ''}>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
    </button>
  );
};
