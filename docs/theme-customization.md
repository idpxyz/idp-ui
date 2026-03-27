# Theme Customization Guide

## Adding a New Product Accent

To add a new product (e.g., "prism") to the IDP design system:

### 1. Create Product Override

Create a file at `packages/ui-tokens/src/product-overrides/myproduct.ts`:

```typescript
import type { ProductAccent } from '../product-accents';

export const myproductAccent: ProductAccent = {
  accent:         '#7c3aed',  // Primary brand color
  accentHover:    '#8b5cf6',  // Hover state
  accentSubtle:   '#7c3aed1a', // 10% opacity for backgrounds
  accentMuted:    '#7c3aed40', // 25% opacity
};
```

### 2. Register the Product

In `packages/ui-tokens/src/product-overrides/index.ts`:

```typescript
export { myproductAccent } from './myproduct';
```

### 3. Use in ThemeProvider

In your app's root:

```tsx
import { ThemeProvider } from '@idpxyz/ui-theme-runtime';

function App() {
  return (
    <ThemeProvider product="myproduct">
      <YourApp />
    </ThemeProvider>
  );
}
```

## Dark / Light Theme

The theme provider automatically handles dark/light mode:

```tsx
import { useTheme } from '@idpxyz/ui-theme-runtime';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button onClick={toggleTheme}>
      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}
```

## Density

Switch between compact and comfortable layouts:

```tsx
import { DensityProvider, useDensity } from '@idpxyz/ui-theme-runtime';

function App() {
  return (
    <DensityProvider>
      <DensityToggle />
    </DensityProvider>
  );
}
```

## Design Token Reference

### Core Tokens
- **Colors**: `coreTokens.colors` (neutral palette, brand colors)
- **Spacing**: `coreTokens.spacing` (4px base unit: 1, 2, 3, 4, 6, 8, 10, 12, 16)
- **Typography**: `coreTokens.typography` (font families, sizes, weights, line heights)
- **Border**: `coreTokens.border` (widths, radiuses)
- **Shadow**: `coreTokens.shadow` (elevation levels)
- **Motion**: `coreTokens.motion` (durations, easings)

### Semantic Tokens
- **Background**: `surface-primary`, `surface-secondary`, `surface-tertiary`
- **Text**: `text-primary`, `text-secondary`, `text-muted`, `text-inverse`
- **Border**: `border-default`, `border-muted`, `border-strong`
- **Status**: `status-success`, `status-warning`, `status-error`, `status-info`

### VS Code Theme Tokens (Workspace)
Used by workspace components (EditorGroup, ActivityBar, etc.):
- `idpxyz-bg`, `idpxyz-sidebar`, `idpxyz-tab`, `idpxyz-editor`
- `idpxyz-text`, `idpxyz-textMuted`, `idpxyz-textBright`
- `idpxyz-accent`, `idpxyz-border`, `idpxyz-hover`, `idpxyz-activeItem`

## CSS Variables

All tokens are applied as CSS custom properties via `applyThemeTokens()`:

```css
/* Example usage in your CSS */
.my-component {
  color: var(--ds-text-primary);
  background: var(--ds-bg-surface-default);
  border: 1px solid var(--ds-border-default);
}
```
