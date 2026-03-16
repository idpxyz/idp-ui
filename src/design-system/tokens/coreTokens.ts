export type ThemeMode = 'light' | 'dark';

export const foundation = {
  space: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },
  radius: {
    none: '0px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    '2xl': '16px',
    full: '9999px',
  },
  borderWidth: {
    none: '0px',
    hairline: '0.5px',
    sm: '1px',
    md: '2px',
  },
  motion: {
    duration: {
      fast: '120ms',
      normal: '180ms',
      slow: '240ms',
      xslow: '320ms',
    },
    easing: {
      standard: 'cubic-bezier(0.2, 0, 0, 1)',
      decelerate: 'cubic-bezier(0, 0, 0, 1)',
      accelerate: 'cubic-bezier(0.3, 0, 1, 1)',
      emphasized: 'cubic-bezier(0.2, 0, 0, 1.2)',
    },
  },
  shadow: {
    none: 'none',
    xs: '0 1px 2px rgba(0,0,0,0.18)',
    sm: '0 2px 6px rgba(0,0,0,0.2)',
    md: '0 6px 18px rgba(0,0,0,0.24)',
    lg: '0 10px 24px rgba(0,0,0,0.28)',
    xl: '0 14px 30px rgba(0,0,0,0.32)',
  },
} as const;

export const productAccent = {
  loms: {
    accent: '#007acc',
    subtle: 'rgba(0,122,204,0.20)',
    fg: '#ffffff',
  },
  prism: {
    accent: '#0891b2',
    subtle: 'rgba(8,145,178,0.18)',
    fg: '#ecfeff',
  },
  gatekeeper: {
    accent: '#6366f1',
    subtle: 'rgba(99,102,241,0.18)',
    fg: '#eef2ff',
  },
  rulemesh: {
    accent: '#7c3aed',
    subtle: 'rgba(124,58,237,0.18)',
    fg: '#f5f3ff',
  },
  ledgermesh: {
    accent: '#2563eb',
    subtle: 'rgba(37,99,235,0.18)',
    fg: '#eff6ff',
  },
  phi: {
    accent: '#ea580c',
    subtle: 'rgba(234,88,12,0.18)',
    fg: '#fff7ed',
  },
  sagapai: {
    accent: '#0369a1',
    subtle: 'rgba(3,105,161,0.18)',
    fg: '#f0f9ff',
  },
} as const;

export const semanticByTheme: Record<ThemeMode, Record<string, string>> = {
  dark: {
    'bg.canvas.default': '#1e1e1e',
    'bg.canvas.subtle': '#252526',
    'bg.surface.default': '#252526',
    'bg.surface.elevated': '#2d2d2d',
    'bg.surface.sunken': '#1b1b1b',
    'bg.surface.hover': '#2a2d2e',
    'bg.surface.active': '#37373d',
    'bg.surface.selected': '#264f78',
    'bg.surface.disabled': '#2d2d2d',
    'bg.overlay.default': '#2d2d2d',
    'bg.backdrop.default': 'rgba(0,0,0,0.48)',
    'text.primary': '#cccccc',
    'text.secondary': '#a9a9a9',
    'text.tertiary': '#858585',
    'text.inverse': '#000000',
    'text.disabled': '#6b6b6b',
    'text.link': '#4ea1ff',
    'text.link.hover': '#82beff',
    'text.on-accent': '#ffffff',
    'text.on-danger': '#ffffff',
    'text.on-success': '#ffffff',
    'text.on-warning': '#111827',
    'icon.primary': '#cccccc',
    'icon.secondary': '#a9a9a9',
    'icon.tertiary': '#858585',
    'icon.disabled': '#6b6b6b',
    'icon.inverse': '#000000',
    'icon.info': '#60a5fa',
    'icon.success': '#4ade80',
    'icon.warning': '#fbbf24',
    'icon.danger': '#f87171',
    'border.default': '#3c3c3c',
    'border.subtle': '#323232',
    'border.strong': '#4a4a4a',
    'border.focus': '#4ea1ff',
    'status.success.bg': '#14532d',
    'status.success.bg.subtle': 'rgba(34,197,94,0.20)',
    'status.success.fg': '#4ade80',
    'status.success.border': 'rgba(74,222,128,0.35)',
    'status.info.bg': '#1e3a8a',
    'status.info.bg.subtle': 'rgba(59,130,246,0.20)',
    'status.info.fg': '#60a5fa',
    'status.info.border': 'rgba(96,165,250,0.35)',
    'status.warning.bg': '#78350f',
    'status.warning.bg.subtle': 'rgba(245,158,11,0.20)',
    'status.warning.fg': '#fbbf24',
    'status.warning.border': 'rgba(251,191,36,0.35)',
    'status.danger.bg': '#7f1d1d',
    'status.danger.bg.subtle': 'rgba(239,68,68,0.20)',
    'status.danger.fg': '#f87171',
    'status.danger.border': 'rgba(248,113,113,0.35)',
    'status.neutral.bg': '#374151',
    'status.neutral.bg.subtle': 'rgba(107,114,128,0.20)',
    'status.neutral.fg': '#9ca3af',
    'status.neutral.border': 'rgba(156,163,175,0.35)',
    'syntax.keyword': '#569cd6',
    'syntax.string': '#ce9178',
    'syntax.number': '#b5cea8',
    'syntax.comment': '#6a9955',
    'syntax.function': '#dcdcaa',
    'syntax.variable': '#9cdcfe',
    'syntax.type': '#4ec9b0',
    'syntax.tag': '#569cd6',
    'syntax.attribute': '#9cdcfe',
    'syntax.scrollbar': '#424242',
    'focus.ring': '#4ea1ff',
  },
  light: {
    'bg.canvas.default': '#f7f8fa',
    'bg.canvas.subtle': '#f1f3f5',
    'bg.surface.default': '#ffffff',
    'bg.surface.elevated': '#ffffff',
    'bg.surface.sunken': '#f3f4f6',
    'bg.surface.hover': '#eef2f7',
    'bg.surface.active': '#e5ebf4',
    'bg.surface.selected': '#dbeafe',
    'bg.surface.disabled': '#f5f6f8',
    'bg.overlay.default': '#ffffff',
    'bg.backdrop.default': 'rgba(15,23,42,0.32)',
    'text.primary': '#111827',
    'text.secondary': '#334155',
    'text.tertiary': '#64748b',
    'text.inverse': '#ffffff',
    'text.disabled': '#94a3b8',
    'text.link': '#2563eb',
    'text.link.hover': '#1e40af',
    'text.on-accent': '#ffffff',
    'text.on-danger': '#ffffff',
    'text.on-success': '#ffffff',
    'text.on-warning': '#111827',
    'icon.primary': '#111827',
    'icon.secondary': '#334155',
    'icon.tertiary': '#64748b',
    'icon.disabled': '#94a3b8',
    'icon.inverse': '#ffffff',
    'icon.info': '#2563eb',
    'icon.success': '#16a34a',
    'icon.warning': '#d97706',
    'icon.danger': '#dc2626',
    'border.default': '#d1d5db',
    'border.subtle': '#e5e7eb',
    'border.strong': '#c4c9d3',
    'border.focus': '#2563eb',
    'status.success.bg': '#d1fae5',
    'status.success.bg.subtle': 'rgba(34,197,94,0.12)',
    'status.success.fg': '#15803d',
    'status.success.border': 'rgba(34,197,94,0.30)',
    'status.info.bg': '#dbeafe',
    'status.info.bg.subtle': 'rgba(59,130,246,0.12)',
    'status.info.fg': '#1d4ed8',
    'status.info.border': 'rgba(37,99,235,0.30)',
    'status.warning.bg': '#fef3c7',
    'status.warning.bg.subtle': 'rgba(245,158,11,0.12)',
    'status.warning.fg': '#b45309',
    'status.warning.border': 'rgba(217,119,6,0.30)',
    'status.danger.bg': '#fee2e2',
    'status.danger.bg.subtle': 'rgba(239,68,68,0.12)',
    'status.danger.fg': '#b91c1c',
    'status.danger.border': 'rgba(220,38,38,0.30)',
    'status.neutral.bg': '#eef2f7',
    'status.neutral.bg.subtle': 'rgba(107,114,128,0.12)',
    'status.neutral.fg': '#334155',
    'status.neutral.border': 'rgba(75,85,99,0.30)',
    'syntax.keyword': '#0000ff',
    'syntax.string': '#a31515',
    'syntax.number': '#098658',
    'syntax.comment': '#008000',
    'syntax.function': '#795e26',
    'syntax.variable': '#001080',
    'syntax.type': '#267f99',
    'syntax.tag': '#800000',
    'syntax.attribute': '#ff0000',
    'syntax.scrollbar': '#c1c1c1',
    'focus.ring': '#2563eb',
  },
};

export const density = {
  comfortable: {
    rowHeight: '36px',
    controlHeight: {
      sm: '28px',
      md: '32px',
      lg: '36px',
    },
    cellPaddingY: '10px',
  },
  compact: {
    rowHeight: '28px',
    controlHeight: {
      sm: '24px',
      md: '28px',
      lg: '32px',
    },
    cellPaddingY: '4px',
  },
} as const;

export const layout = {
  topbar: {
    height: '30px',
  },
  sidebar: {
    width: '240px',
    collapsedWidth: '56px',
  },
  rightPanel: {
    defaultWidth: '320px',
  },
  bottomPanel: {
    minHeight: '100px',
    defaultHeight: '240px',
  },
} as const;

export const componentTokens = {
  button: {
    height: {
      sm: '24px',
      md: '28px',
      lg: '32px',
    },
    paddingX: {
      sm: '8px',
      md: '10px',
      lg: '12px',
    },
    radius: '8px',
    primary: {
      bg: {
        default: '{product.accent}',
        hover: '{text.link.hover}',
      },
      fg: {
        default: '#ffffff',
      },
      border: {
        default: 'transparent',
      },
    },
    secondary: {
      bg: {
        default: '{bg.surface.default}',
        hover: '{bg.surface.hover}',
      },
      fg: {
        default: '{text.primary}',
      },
      border: {
        default: '{border.default}',
      },
    },
    ghost: {
      bg: {
        hover: '{bg.surface.hover}',
      },
      fg: {
        default: '{text.secondary}',
      },
    },
    danger: {
      bg: {
        default: '{status.danger.bg}',
        hover: '#b91c1c',
      },
      fg: {
        default: '#ffffff',
      },
    },
  },
  input: {
    height: {
      sm: '24px',
      md: '28px',
      lg: '32px',
    },
    radius: '6px',
    padding: {
      x: '8px',
      y: '4px',
    },
    bg: {
      default: '{bg.surface.sunken}',
      disabled: '{bg.surface.disabled}',
    },
    border: {
      default: '{border.default}',
      hover: '{border.strong}',
      focus: '{border.focus}',
    },
    text: {
      default: '{text.primary}',
      placeholder: '{text.tertiary}',
    },
  },
  table: {
    header: {
      bg: '{bg.surface.default}',
      text: '{text.secondary}',
      border: '{border.default}',
    },
    row: {
      bg: {
        default: '{bg.canvas.default}',
        hover: '{bg.surface.hover}',
        selected: '{bg.surface.selected}',
      },
      border: '{border.default}',
      height: {
        compact: '{density.compact.rowHeight}',
        comfortable: '{density.comfortable.rowHeight}',
      },
    },
    cell: {
      paddingX: '12px',
      paddingY: '{density.comfortable.cellPaddingY}',
    },
  },
  tabs: {
    workbench: {
      height: '35px',
      item: {
        bg: {
          active: '{bg.canvas.default}',
          hover: '{bg.surface.hover}',
        },
        text: {
          default: '{text.secondary}',
          active: '{text.primary}',
        },
        border: {
          active: '{border.default}',
        },
      },
    },
    content: {
      height: '34px',
      item: {
        bg: {
          active: '{bg.surface.default}',
          hover: '{bg.surface.hover}',
        },
        text: {
          default: '{text.secondary}',
          active: '{text.primary}',
        },
        border: {
          active: '{border.strong}',
        },
      },
    },
  },
  badge: {
    height: {
      sm: '18px',
      md: '20px',
    },
    paddingX: '6px',
    radius: '9999px',
    status: {
      success: '{status.success.bg.subtle}',
      info: '{status.info.bg.subtle}',
      warning: '{status.warning.bg.subtle}',
      danger: '{status.danger.bg.subtle}',
      neutral: '{status.neutral.bg.subtle}',
    },
  },
  panel: {
    bg: {
      default: '{bg.surface.default}',
      elevated: '{bg.surface.elevated}',
    },
    border: {
      default: '{border.default}',
    },
    radius: '8px',
    padding: '12px',
  },
} as const;

export const chartTokens = {
  series: {
    1: '#60a5fa',
    2: '#4ade80',
    3: '#fbbf24',
    4: '#a78bfa',
    5: '#f472b6',
  },
  semantic: {
    positive: '{status.success.fg}',
    warning: '{status.warning.fg}',
    negative: '{status.danger.fg}',
    neutral: '{status.neutral.fg}',
  },
} as const;

export const studioTokens = {
  canvas: {
    bg: {
      default: '{bg.canvas.default}',
      grid: '{bg.surface.default}',
    },
    border: {
      default: '{border.default}',
    },
  },
  inspector: {
    bg: '{bg.surface.default}',
    border: '{border.default}',
    title: '{text.secondary}',
  },
} as const;

