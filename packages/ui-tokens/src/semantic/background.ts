/**
 * Semantic background tokens — maps core values to usage contexts.
 */
export const backgroundTokens = {
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
  },
} as const;
