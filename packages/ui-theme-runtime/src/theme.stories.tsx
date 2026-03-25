import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider, useTheme } from './index';

/** Global Storybook decorator syncs `html` from the backgrounds toolbar; this story owns theme via ThemeProvider + applyThemeTokens. */
const meta: Meta = {
  title: 'Theme/ThemeProvider',
  parameters: { disableStorybookThemeSync: true },
};
export default meta;

function ThemeDemo() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const swatches: { varName: `--${string}`; label: string; labelOnAccent?: boolean }[] = [
    { varName: '--vsc-bg', label: 'Background' },
    { varName: '--vsc-sidebar', label: 'Surface' },
    { varName: '--vsc-accent', label: 'Accent', labelOnAccent: true },
    { varName: '--vsc-border', label: 'Border' },
  ];
  return (
    <div
      style={{
        padding: 24,
        background: 'var(--vsc-bg)',
        color: 'var(--vsc-text)',
        borderRadius: 8,
        minHeight: 200,
      }}
    >
      <div style={{ marginBottom: 16, fontSize: 14 }}>
        Current theme: <strong>{theme}</strong>
      </div>
      <button
        type="button"
        onClick={toggleTheme}
        style={{
          padding: '8px 20px',
          borderRadius: 6,
          border: '1px solid var(--vsc-border)',
          background: 'var(--vsc-sidebar)',
          color: 'var(--vsc-text)',
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        Switch to {isDark ? 'Light' : 'Dark'} Mode
      </button>
      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {swatches.map(({ varName, label, labelOnAccent }) => (
          <div
            key={varName}
            style={{
              padding: 16,
              borderRadius: 8,
              background: `var(${varName})`,
              border: '1px solid var(--vsc-border)',
              fontSize: 11,
              color: labelOnAccent ? '#ffffff' : 'var(--vsc-text)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontWeight: 600 }}>{label}</div>
            <div style={{ opacity: 0.85, marginTop: 4 }}>{varName}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export const DarkLight: StoryObj = {
  render: () => (
    <ThemeProvider product="loms">
      <ThemeDemo />
    </ThemeProvider>
  ),
};
