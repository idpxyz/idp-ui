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
