/**
 * Core typography scale — font sizes, line heights, weights.
 */
export const coreTypography = {
  fontSize: {
    '2xs': '10px',
    xs: '11px',
    sm: '12px',
    md: '13px',
    lg: '14px',
    xl: '16px',
    '2xl': '20px',
    '3xl': '24px',
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.65,
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontFamily: {
    sans: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    mono: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', Consolas, monospace",
  },
} as const;
