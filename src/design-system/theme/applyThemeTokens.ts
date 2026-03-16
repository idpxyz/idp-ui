import {
  type ThemeMode,
  semanticByTheme,
  foundation,
  productAccent,
  density,
  layout,
  componentTokens,
  chartTokens,
  studioTokens,
} from '../tokens/coreTokens';

function setVar(root: HTMLElement, name: string, value: string) {
  root.style.setProperty(name, value);
}

function flattenTokenObject(
  root: HTMLElement,
  prefix: string,
  value: unknown,
  resolve: (v: string) => string
) {
  if (typeof value === 'string') {
    setVar(root, prefix, resolve(value));
    return;
  }
  if (typeof value !== 'object' || value === null) return;
  Object.entries(value as Record<string, unknown>).forEach(([k, v]) => {
    flattenTokenObject(root, `${prefix}-${k}`, v, resolve);
  });
}

export function applyThemeTokens(mode: ThemeMode, product: keyof typeof productAccent = 'loms') {
  const root = document.documentElement;
  const semantic = semanticByTheme[mode];
  const accent = productAccent[product];

  const resolveTokenRef = (raw: string): string => {
    const match = raw.match(/^\{(.+)\}$/);
    if (!match) return raw;
    const token = match[1];
    if (token === 'product.accent') return accent.accent;
    if (token === 'product.accent.subtle') return accent.subtle;
    if (token === 'product.accent.fg') return accent.fg;
    if (semantic[token]) return semantic[token];
    if (token.startsWith('density.')) {
      const [, modeKey, ...rest] = token.split('.');
      const target = (density as unknown as Record<string, unknown>)[modeKey];
      if (!target) return raw;
      let cursor: unknown = target;
      rest.forEach((part) => {
        if (cursor && typeof cursor === 'object') cursor = (cursor as Record<string, unknown>)[part];
      });
      return typeof cursor === 'string' ? cursor : raw;
    }
    return raw;
  };

  // Semantic -> canonical CSS vars (--ds-*)
  Object.entries(semantic).forEach(([tokenName, tokenValue]) => {
    const cssName = `--ds-${tokenName.replace(/\./g, '-')}`;
    setVar(root, cssName, tokenValue);
  });

  // Foundation vars
  flattenTokenObject(root, '--ds-foundation-space', foundation.space, resolveTokenRef);
  flattenTokenObject(root, '--ds-foundation-radius', foundation.radius, resolveTokenRef);
  flattenTokenObject(root, '--ds-foundation-border-width', foundation.borderWidth, resolveTokenRef);
  flattenTokenObject(root, '--ds-foundation-motion-duration', foundation.motion.duration, resolveTokenRef);
  flattenTokenObject(root, '--ds-foundation-motion-easing', foundation.motion.easing, resolveTokenRef);
  flattenTokenObject(root, '--ds-foundation-shadow', foundation.shadow, resolveTokenRef);

  // Product accent
  setVar(root, '--ds-product-accent', accent.accent);
  setVar(root, '--ds-product-accent-subtle', accent.subtle);
  setVar(root, '--ds-product-accent-fg', accent.fg);

  // Density, layout, component, chart and studio tokens
  flattenTokenObject(root, '--ds-density', density, resolveTokenRef);
  flattenTokenObject(root, '--ds-layout', layout, resolveTokenRef);
  flattenTokenObject(root, '--ds-component', componentTokens, resolveTokenRef);
  flattenTokenObject(root, '--ds-chart', chartTokens, resolveTokenRef);
  flattenTokenObject(root, '--ds-studio', studioTokens, resolveTokenRef);

  // Backward-compat bridge: map existing --vsc-* vars to --ds-* tokens
  setVar(root, '--vsc-bg', semantic['bg.canvas.default']);
  setVar(root, '--vsc-sidebar', semantic['bg.surface.default']);
  setVar(root, '--vsc-activityBar', semantic['bg.surface.elevated']);
  setVar(root, '--vsc-editor', semantic['bg.canvas.default']);
  setVar(root, '--vsc-tab', semantic['bg.surface.elevated']);
  setVar(root, '--vsc-tabActive', semantic['bg.canvas.default']);
  setVar(root, '--vsc-tabBorder', semantic['border.default']);
  setVar(root, '--vsc-statusBar', accent.accent);
  setVar(root, '--vsc-titleBar', semantic['bg.surface.elevated']);
  setVar(root, '--vsc-border', semantic['border.default']);
  setVar(root, '--vsc-text', semantic['text.primary']);
  setVar(root, '--vsc-textMuted', semantic['text.tertiary']);
  setVar(root, '--vsc-textBright', semantic['text.primary']);
  setVar(root, '--vsc-accent', accent.accent);
  setVar(root, '--vsc-panelBg', semantic['bg.canvas.default']);
  setVar(root, '--vsc-panelBorder', semantic['border.default']);
  setVar(root, '--vsc-breadcrumb', semantic['text.secondary']);
  setVar(root, '--vsc-findMatch', semantic['bg.surface.hover']);
  setVar(root, '--vsc-hover', semantic['bg.surface.hover']);
  setVar(root, '--vsc-activeItem', semantic['bg.surface.active']);
  setVar(root, '--vsc-inputBg', semantic['bg.surface.sunken']);
  setVar(root, '--vsc-statusHover', semantic['text.link.hover']);
  setVar(root, '--vsc-selection', semantic['bg.surface.selected']);
  setVar(root, '--vsc-activeLine', semantic['bg.surface.hover']);

  // Syntax colors (semanticized by theme)
  setVar(root, '--vsc-lineNumber', semantic['text.tertiary']);
  setVar(root, '--vsc-lineNumberActive', semantic['text.secondary']);
  setVar(root, '--vsc-keyword', semantic['syntax.keyword']);
  setVar(root, '--vsc-string', semantic['syntax.string']);
  setVar(root, '--vsc-number', semantic['syntax.number']);
  setVar(root, '--vsc-comment', semantic['syntax.comment']);
  setVar(root, '--vsc-function', semantic['syntax.function']);
  setVar(root, '--vsc-variable', semantic['syntax.variable']);
  setVar(root, '--vsc-type', semantic['syntax.type']);
  setVar(root, '--vsc-operator', semantic['text.primary']);
  setVar(root, '--vsc-tag', semantic['syntax.tag']);
  setVar(root, '--vsc-attribute', semantic['syntax.attribute']);
  setVar(root, '--vsc-punctuation', semantic['text.primary']);
  setVar(root, '--vsc-minimap', semantic['bg.canvas.subtle']);
  setVar(root, '--vsc-scrollbar', semantic['syntax.scrollbar']);
}

