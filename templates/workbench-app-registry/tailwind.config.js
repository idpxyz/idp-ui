/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    /** Monorepo (idp-ui/apps/…): source packages */
    '../../packages/*/src/**/*.{js,ts,jsx,tsx}',
    /** Registry / external install: published @idpxyz sources under node_modules */
    './node_modules/@idpxyz/*/src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@idpxyz/*/dist/**/*.{js,mjs,cjs}',
  ],
  theme: {
    extend: {
      colors: {
        vscode: {
          bg: 'var(--vsc-bg)',
          editor: 'var(--vsc-editor)',
          sidebar: 'var(--vsc-sidebar)',
          activityBar: 'var(--vsc-activityBar)',
          titleBar: 'var(--vsc-titleBar)',
          statusBar: 'var(--vsc-statusBar)',
          statusHover: 'var(--vsc-statusHover)',
          tab: 'var(--vsc-tab)',
          tabActive: 'var(--vsc-tabActive)',
          tabBorder: 'var(--vsc-tabBorder)',
          panelBg: 'var(--vsc-panelBg)',
          border: 'var(--vsc-border)',
          hover: 'var(--vsc-hover)',
          activeItem: 'var(--vsc-activeItem)',
          accent: 'var(--vsc-accent)',
          text: 'var(--vsc-text)',
          textBright: 'var(--vsc-textBright)',
          textMuted: 'var(--vsc-textMuted)',
          inputBg: 'var(--vsc-inputBg)',
          breadcrumb: 'var(--vsc-breadcrumb)',
        },
      },
      ringColor: {
        'ds-focus': 'var(--ds-focus-ring)',
      },
    },
  },
  plugins: [],
};
