import type { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider, useTheme } from './index';

const meta: Meta = { title: 'Theme/ThemeProvider' };
export default meta;

function ThemeDemo() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <div style={{ padding: 24, background: isDark ? '#1e1e1e' : '#f7f8fa', color: isDark ? '#ccc' : '#111', borderRadius: 8, minHeight: 200 }}>
      <div style={{ marginBottom: 16, fontSize: 14 }}>
        Current theme: <strong>{theme}</strong>
      </div>
      <button onClick={toggleTheme} style={{ padding: '8px 20px', borderRadius: 6, border: `1px solid ${isDark ? '#555' : '#ccc'}`, background: isDark ? '#333' : '#fff', color: isDark ? '#fff' : '#111', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
        Switch to {isDark ? 'Light' : 'Dark'} Mode
      </button>
      <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
        {[
          { var: '--vsc-bg', label: 'Background' },
          { var: '--vsc-sidebar', label: 'Surface' },
          { var: '--vsc-text', label: 'Text' },
          { var: '--ds-product-accent', label: 'Accent' },
        ].map(({ var: v, label }) => (
          <div key={v} style={{ padding: 16, borderRadius: 8, background: `var(${v})`, border: `1px solid ${isDark ? '#3c3c3c' : '#d1d5db'}`, fontSize: 11, color: v.includes('text') ? `var(${v})` : '#fff', textAlign: 'center' }}>
            <div style={{ fontWeight: 600 }}>{label}</div>
            <div style={{ opacity: 0.7, marginTop: 4 }}>{v}</div>
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
