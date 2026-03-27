/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/*/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        idpxyz: {
          bg: 'var(--idpxyz-bg)',
          editor: 'var(--idpxyz-editor)',
          sidebar: 'var(--idpxyz-sidebar)',
          activityBar: 'var(--idpxyz-activityBar)',
          titleBar: 'var(--idpxyz-titleBar)',
          statusBar: 'var(--idpxyz-statusBar)',
          statusHover: 'var(--idpxyz-statusHover)',
          tab: 'var(--idpxyz-tab)',
          tabActive: 'var(--idpxyz-tabActive)',
          tabBorder: 'var(--idpxyz-tabBorder)',
          panelBg: 'var(--idpxyz-panelBg)',
          border: 'var(--idpxyz-border)',
          hover: 'var(--idpxyz-hover)',
          activeItem: 'var(--idpxyz-activeItem)',
          accent: 'var(--idpxyz-accent)',
          text: 'var(--idpxyz-text)',
          textBright: 'var(--idpxyz-textBright)',
          textMuted: 'var(--idpxyz-textMuted)',
          inputBg: 'var(--idpxyz-inputBg)',
          breadcrumb: 'var(--idpxyz-breadcrumb)',
        },
      },
      ringColor: {
        'ds-focus': 'var(--ds-focus-ring)',
      },
    },
  },
  plugins: [],
};
