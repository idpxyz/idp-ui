/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vscode: {
          bg: 'var(--vsc-bg)',
          sidebar: 'var(--vsc-sidebar)',
          activityBar: 'var(--vsc-activityBar)',
          editor: 'var(--vsc-editor)',
          tab: 'var(--vsc-tab)',
          tabActive: 'var(--vsc-tabActive)',
          tabBorder: 'var(--vsc-tabBorder)',
          statusBar: 'var(--vsc-statusBar)',
          titleBar: 'var(--vsc-titleBar)',
          border: 'var(--vsc-border)',
          text: 'var(--vsc-text)',
          textMuted: 'var(--vsc-textMuted)',
          textBright: 'var(--vsc-textBright)',
          accent: 'var(--vsc-accent)',
          lineNumber: 'var(--vsc-lineNumber)',
          lineNumberActive: 'var(--vsc-lineNumberActive)',
          selection: 'var(--vsc-selection)',
          keyword: 'var(--vsc-keyword)',
          string: 'var(--vsc-string)',
          number: 'var(--vsc-number)',
          comment: 'var(--vsc-comment)',
          function: 'var(--vsc-function)',
          variable: 'var(--vsc-variable)',
          type: 'var(--vsc-type)',
          operator: 'var(--vsc-operator)',
          tag: 'var(--vsc-tag)',
          attribute: 'var(--vsc-attribute)',
          punctuation: 'var(--vsc-punctuation)',
          minimap: 'var(--vsc-minimap)',
          scrollbar: 'var(--vsc-scrollbar)',
          panelBg: 'var(--vsc-panelBg)',
          panelBorder: 'var(--vsc-panelBorder)',
          breadcrumb: 'var(--vsc-breadcrumb)',
          findMatch: 'var(--vsc-findMatch)',
          hover: 'var(--vsc-hover)',
          activeItem: 'var(--vsc-activeItem)',
          inputBg: 'var(--vsc-inputBg)',
          statusHover: 'var(--vsc-statusHover)',
          activeLine: 'var(--vsc-activeLine)',
        }
      },
      fontSize: {
        'code': '13px',
      }
    },
  },
  plugins: [],
}
