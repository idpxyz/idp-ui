import {
  type ThemeMode,
  semanticByTheme,
  foundation,
  productAccent,
  type ProductKey,
  density,
  layout,
  componentTokens,
  chartTokens,
  studioTokens,
} from '@idpxyz/ui-tokens';

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

export function applyThemeTokens(mode: ThemeMode, product: ProductKey = 'loms') {
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

  // Workbench shell: map semantic --ds-* tokens onto --idpxyz-* (consumed by Tailwind `idpxyz.*` colors)
  setVar(root, '--idpxyz-bg', semantic['bg.canvas.default']);
  setVar(root, '--idpxyz-sidebar', semantic['bg.surface.default']);
  setVar(root, '--idpxyz-activityBar', semantic['bg.surface.elevated']);
  setVar(root, '--idpxyz-editor', semantic['bg.canvas.default']);
  setVar(root, '--idpxyz-tab', semantic['bg.surface.elevated']);
  setVar(root, '--idpxyz-tabActive', semantic['bg.canvas.default']);
  setVar(root, '--idpxyz-tabBorder', semantic['border.default']);
  setVar(root, '--idpxyz-statusBar', accent.accent);
  setVar(root, '--idpxyz-titleBar', semantic['bg.surface.elevated']);
  setVar(root, '--idpxyz-border', semantic['border.default']);
  setVar(root, '--idpxyz-text', semantic['text.primary']);
  setVar(root, '--idpxyz-textMuted', semantic['text.tertiary']);
  setVar(root, '--idpxyz-textBright', semantic['text.primary']);
  setVar(root, '--idpxyz-accent', accent.accent);
  setVar(root, '--idpxyz-panelBg', semantic['bg.canvas.default']);
  setVar(root, '--idpxyz-panelBorder', semantic['border.default']);
  setVar(root, '--idpxyz-breadcrumb', semantic['text.secondary']);
  setVar(root, '--idpxyz-findMatch', semantic['bg.surface.hover']);
  setVar(root, '--idpxyz-hover', semantic['bg.surface.hover']);
  setVar(root, '--idpxyz-activeItem', semantic['bg.surface.active']);
  setVar(root, '--idpxyz-inputBg', semantic['bg.surface.sunken']);
  setVar(root, '--idpxyz-statusHover', semantic['text.link.hover']);
  setVar(root, '--idpxyz-selection', semantic['bg.surface.selected']);
  setVar(root, '--idpxyz-activeLine', semantic['bg.surface.hover']);

  // Syntax colors (semanticized by theme)
  setVar(root, '--idpxyz-lineNumber', semantic['text.tertiary']);
  setVar(root, '--idpxyz-lineNumberActive', semantic['text.secondary']);
  setVar(root, '--idpxyz-keyword', semantic['syntax.keyword']);
  setVar(root, '--idpxyz-string', semantic['syntax.string']);
  setVar(root, '--idpxyz-number', semantic['syntax.number']);
  setVar(root, '--idpxyz-comment', semantic['syntax.comment']);
  setVar(root, '--idpxyz-function', semantic['syntax.function']);
  setVar(root, '--idpxyz-variable', semantic['syntax.variable']);
  setVar(root, '--idpxyz-type', semantic['syntax.type']);
  setVar(root, '--idpxyz-operator', semantic['text.primary']);
  setVar(root, '--idpxyz-tag', semantic['syntax.tag']);
  setVar(root, '--idpxyz-attribute', semantic['syntax.attribute']);
  setVar(root, '--idpxyz-punctuation', semantic['text.primary']);
  setVar(root, '--idpxyz-minimap', semantic['bg.canvas.subtle']);
  setVar(root, '--idpxyz-scrollbar', semantic['syntax.scrollbar']);
}
