'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useStorage } from '@/hooks/use-storage';

type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'dark' | 'light';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme, isStorageReady] = useStorage<Theme>('theme', 'system');
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    if (!isStorageReady || typeof window === 'undefined') return;

    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    let resolved: 'dark' | 'light' = 'light';
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    } else {
      resolved = theme;
    }

    root.classList.add(resolved);
    setResolvedTheme(resolved);
  }, [theme, isStorageReady]);

  // Ensure setTheme is always defined - create a stable wrapper
  const handleSetTheme = React.useCallback(
    (newTheme: Theme) => {
      setTheme(newTheme);
    },
    [setTheme]
  );

  // Always provide the context with stable values to prevent hydration issues
  const contextValue = React.useMemo(
    () => ({
      theme: isStorageReady ? theme : ('system' as Theme),
      setTheme: handleSetTheme,
      resolvedTheme: isStorageReady ? resolvedTheme : ('light' as const),
    }),
    [theme, resolvedTheme, isStorageReady, handleSetTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

