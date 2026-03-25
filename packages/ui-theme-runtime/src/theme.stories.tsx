import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider, useTheme, DensityProvider, useDensity } from './index';
import { Button } from '@idpxyz/ui-primitives';

const meta: Meta = { title: 'Theme/ThemeProvider' };
export default meta;

function ThemeDemo() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16, fontSize: 14, color: '#ccc' }}>
        Current theme: <strong>{theme}</strong>
      </div>
      <Button onClick={toggleTheme}>
        Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
      </Button>
      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {['--ds-bg-canvas-default', '--ds-bg-surface-default', '--ds-text-primary', '--ds-product-accent'].map(v => (
          <div key={v} style={{ padding: 12, borderRadius: 8, background: `var(${v})`, border: '1px solid #3c3c3c', fontSize: 10, color: '#fff' }}>
            {v}
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
