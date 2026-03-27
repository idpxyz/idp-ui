import type { Preview } from '@storybook/react';
import { create, themes } from '@storybook/theming';
import { FORCE_RE_RENDER, GLOBALS_UPDATED } from 'storybook/internal/core-events';
import { addons } from 'storybook/internal/preview-api';
import type { ThemeVars } from 'storybook/internal/theming';
import React from 'react';
import './preview.css';

const DARK_BG = '#1e1e1e';
const LIGHT_BG = '#f7f8fa';

const docsDarkTheme: ThemeVars = create({
  ...themes.dark,
  appBg: DARK_BG,
  appContentBg: DARK_BG,
  barBg: '#252526',
});

const docsLightTheme: ThemeVars = create({
  ...themes.light,
  appBg: LIGHT_BG,
  appContentBg: LIGHT_BG,
  barBg: '#e5e7eb',
});

/** Mutable so Docs can follow Backgrounds toolbar (see `parameters.docs.theme` getter below). */
const docsThemeState: { current: ThemeVars } = {
  current:
    typeof window !== 'undefined' && localStorage.getItem('idpxyz-theme') === 'light'
      ? docsLightTheme
      : docsDarkTheme,
};

function isBackgroundLight(globals: Record<string, unknown> | undefined): boolean {
  const v = (globals?.backgrounds as { value?: string } | undefined)?.value;
  const normalized = typeof v === 'string' ? v.replace(/\s/g, '').toLowerCase() : '';
  return (
    v === 'light' || normalized === LIGHT_BG.replace(/\s/g, '').toLowerCase()
  );
}

function syncDocsThemeFromGlobals(globals: Record<string, unknown> | undefined): void {
  docsThemeState.current = isBackgroundLight(globals) ? docsLightTheme : docsDarkTheme;
}

/** Storybook backgrounds toolbar only paints the canvas; CSS variables follow `.light` / `:root`. */
function syncHtmlThemeFromBackground(globals: Record<string, unknown> | undefined) {
  if (typeof document === 'undefined') return;
  const isLight = isBackgroundLight(globals);

  const root = document.documentElement;
  if (isLight) {
    root.classList.add('light');
    root.classList.remove('dark');
    try {
      localStorage.setItem('idpxyz-theme', 'light');
    } catch {
      /* ignore */
    }
  } else {
    root.classList.add('dark');
    root.classList.remove('light');
    try {
      localStorage.setItem('idpxyz-theme', 'dark');
    } catch {
      /* ignore */
    }
  }
}

function syncPreviewFromGlobals(globals: Record<string, unknown> | undefined): void {
  syncHtmlThemeFromBackground(globals);
  syncDocsThemeFromGlobals(globals);
}

void addons.ready().then((channel) => {
  channel.on(GLOBALS_UPDATED, ({ globals }: { globals: Record<string, unknown> }) => {
    syncPreviewFromGlobals(globals);
    channel.emit(FORCE_RE_RENDER);
  });
});

const preview: Preview = {
  decorators: [
    (Story, context) => {
      const p = context.parameters as { disableStorybookThemeSync?: boolean } | undefined;
      if (!p?.disableStorybookThemeSync) {
        syncPreviewFromGlobals(context.globals as Record<string, unknown>);
      }
      return React.createElement(Story);
    },
  ],
  parameters: {
    docs: {
      get theme() {
        return docsThemeState.current;
      },
    },
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
      typeof window !== 'undefined' && localStorage.getItem('idpxyz-theme') === 'light'
        ? LIGHT_BG
        : DARK_BG,
    grid: false,
  },
};
