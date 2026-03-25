import type { Preview } from '@storybook/react';
import React from 'react';
import './preview.css';

const DARK_BG = '#1e1e1e';
const LIGHT_BG = '#f7f8fa';

/** Storybook backgrounds toolbar only paints the canvas; CSS variables follow `.light` / `:root`. */
function syncHtmlThemeFromBackground(globals: Record<string, unknown> | undefined) {
  if (typeof document === 'undefined') return;
  const v = (globals?.backgrounds as { value?: string } | undefined)?.value;
  const normalized = typeof v === 'string' ? v.replace(/\s/g, '').toLowerCase() : '';
  const isLight =
    v === 'light' ||
    normalized === LIGHT_BG.replace(/\s/g, '').toLowerCase();

  const root = document.documentElement;
  if (isLight) {
    root.classList.add('light');
    root.classList.remove('dark');
    try {
      localStorage.setItem('vscode-theme', 'light');
    } catch {
      /* ignore */
    }
  } else {
    root.classList.add('dark');
    root.classList.remove('light');
    try {
      localStorage.setItem('vscode-theme', 'dark');
    } catch {
      /* ignore */
    }
  }
}

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const p = context.parameters as { disableStorybookThemeSync?: boolean } | undefined;
      if (!p?.disableStorybookThemeSync) {
        syncHtmlThemeFromBackground(context.globals as Record<string, unknown>);
      }
      return React.createElement(Story);
    },
  ],
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: DARK_BG },
        { name: 'light', value: LIGHT_BG },
      ],
    },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
};

export default preview;

/** Restore toolbar + tokens from last session (Storybook reads this on load). */
export const initialGlobals = {
  backgrounds: {
    value:
      typeof window !== 'undefined' && localStorage.getItem('vscode-theme') === 'light'
        ? LIGHT_BG
        : DARK_BG,
    grid: false,
  },
};
