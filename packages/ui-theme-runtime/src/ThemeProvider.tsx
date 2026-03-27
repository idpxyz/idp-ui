import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { applyThemeTokens } from './applyThemeTokens';
import type { ThemeMode, ProductKey } from '@idpxyz/ui-tokens';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => {},
});

export function ThemeProvider({
  children,
  product = 'loms',
}: {
  children: ReactNode;
  product?: ProductKey;
}) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('idpxyz-theme');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(theme);
    applyThemeTokens(theme, product);
    localStorage.setItem('idpxyz-theme', theme);
  }, [theme, product]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
