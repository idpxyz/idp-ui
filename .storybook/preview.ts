import React from 'react';
import type { Preview, Decorator } from '@storybook/react';
import { ThemeProvider } from '@idpxyz/ui-theme-runtime';
import './preview.css';

const withTheme: Decorator = (Story) =>
  React.createElement(ThemeProvider, { product: 'loms' }, React.createElement(Story));

const preview: Preview = {
  decorators: [withTheme],
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
