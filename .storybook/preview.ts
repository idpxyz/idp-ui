import type { Preview } from '@storybook/react';
import './preview.css';

// Apply saved theme class globally
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('vscode-theme');
  if (savedTheme === 'light') {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }
}

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#1e1e1e' },
        { name: 'light', value: '#f7f8fa' },
      ],
    },
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
};

export default preview;
