import type { ReactNode } from 'react';
import { DensityProvider, ThemeProvider } from '@idpxyz/ui-theme-runtime';

/** Wraps workspace stories that use `useTheme` or `useDensity`. */
export function WorkspaceStoryProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <DensityProvider>{children}</DensityProvider>
    </ThemeProvider>
  );
}
