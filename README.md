# IDP UI — Design System & Component Library

Shared UI component library for the IDP product family. Published as `@idpxyz/*` packages on GitHub Packages.

## Packages

| Package | Description | Key Exports |
|---------|-------------|-------------|
| `@idpxyz/ui-tokens` | Design tokens (colors, spacing, typography, themes) | `coreTokens`, `semanticTokens`, `darkTheme`, `lightTheme` |
| `@idpxyz/ui-primitives` | Base UI components | `Button`, `Input`, `Select`, `Table`, `Badge`, `Tabs`, `Tooltip` |
| `@idpxyz/ui-patterns` | Composite patterns | `StatusBadge`, `FilterBar`, `PageHeader`, `Skeleton` |
| `@idpxyz/ui-icons` | Domain-specific icon mappings | `domainIcons`, `statusIcons`, `systemIcons` |
| `@idpxyz/ui-theme-runtime` | Runtime theme switching | `ThemeProvider`, `DensityProvider`, `useTheme` |
| `@idpxyz/ui-utils` | Shared utilities | `cn` (class merge), utility functions |
| `@idpxyz/ui-workspace` | IDE-style workspace components | `EditorGroup`, `ActivityBar`, `Sidebar`, `StatusBar`, `useResize` |

## Quick Start

### Install in your project

```bash
# Configure GitHub Packages registry
echo "@idpxyz:registry=https://npm.pkg.github.com" >> .npmrc

# Install packages
npm install @idpxyz/ui-workspace @idpxyz/ui-theme-runtime @idpxyz/ui-primitives
```

### Usage

```tsx
import { ThemeProvider, useTheme } from '@idpxyz/ui-theme-runtime';
import { EditorGroup, useResize } from '@idpxyz/ui-workspace';
import { Button, Table } from '@idpxyz/ui-primitives';
import { StatusBadge } from '@idpxyz/ui-patterns';

function App() {
  return (
    <ThemeProvider product="loms">
      <YourApp />
    </ThemeProvider>
  );
}
```

## Development

### Prerequisites

- Node.js 20+
- pnpm 10+

### Setup

```bash
pnpm install
```

### Build all packages

```bash
pnpm build:packages
```

### Development with linked packages

```bash
# Build in watch mode (for individual package)
cd packages/ui-workspace
pnpm build --watch
```

## Publishing

### One-click publish

```bash
# Patch version bump (0.1.0 -> 0.1.1)
./scripts/publish.sh patch

# Minor version bump (0.1.0 -> 0.2.0)
./scripts/publish.sh minor

# Major version bump (0.1.0 -> 1.0.0)
./scripts/publish.sh major
```

### Manual publish

```bash
pnpm build:packages
pnpm publish:all
```

### CI/CD

Push a version tag to trigger automated publishing:

```bash
git tag v0.2.0
git push origin v0.2.0
```

## Project Structure

```
idp-ui/
├── packages/
│   ├── ui-tokens/          # Design tokens & themes
│   ├── ui-utils/           # Shared utilities
│   ├── ui-icons/           # Icon mappings
│   ├── ui-primitives/      # Base components (Button, Input, Table...)
│   ├── ui-theme-runtime/   # Theme provider & switching
│   ├── ui-patterns/        # Composite patterns (StatusBadge, FilterBar...)
│   └── ui-workspace/       # IDE workspace components (EditorGroup, Sidebar...)
├── apps/
│   └── loms-web/           # Demo/reference app
├── scripts/
│   └── publish.sh          # One-click publish script
├── .github/workflows/
│   └── publish.yml         # CI publish on tag
└── tooling/                # Shared build config
```

## Dependency Graph

```
ui-tokens
    └── ui-theme-runtime
ui-utils
    ├── ui-primitives
    │       └── ui-patterns
    │               └── ui-workspace
    └── ui-workspace
```

## Design Principles

- **Token-driven** — All colors, spacing, and typography come from design tokens, enabling consistent theming
- **Product-agnostic** — Components work across IDP products (BIP, LOMS, Prism) via product accent overrides
- **Dark/Light** — Full dark and light theme support with runtime switching
- **Density-aware** — Compact and comfortable density modes
- **Accessible** — Semantic HTML, keyboard navigation, ARIA attributes

## License

Proprietary — IDP Cloud
