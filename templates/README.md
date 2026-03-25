# App templates

| Template                     | Purpose |
|-----------------------------|---------|
| `workbench-app/`            | Vite + React + Tailwind + IDP workbench shell — **`@idpxyz/*` via `workspace:*`** (monorepo default). |
| `workbench-app-registry/`   | Same app shell — **`@idpxyz/*` via semver** from GitHub Packages (`^x.y.z`), for consumer-style installs. |

Generate apps from the repo root:

```bash
# Default: workspace-linked packages
pnpm create-app <app-dir-name> [--product loms] [--port 5175]

# Published packages from registry (range from current packages/ui-workspace version, or override)
pnpm create-app <app-dir-name> --deps registry [--ui-version 0.1.4]
```

See `docs/workbench-shell.md` for layout conventions.
