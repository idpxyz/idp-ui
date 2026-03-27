# parcel-web

Generated with `pnpm create-app --deps registry` from `templates/workbench-app-registry`.

`@idpxyz/*` dependencies use **semver from GitHub Packages** (not `workspace:*`). The range is set from the current `packages/ui-workspace` version at generate time (`^x.y.z`), or override with `--ui-version`.

## Auth (GitHub Packages)

Create a classic PAT with `read:packages` (and `repo` if the registry is private). In **`~/.npmrc`** (machine-wide, not committed):

```ini
//npm.pkg.github.com/:_authToken=ghp_your_token_here
```

Or use `NPM_TOKEN` / `NODE_AUTH_TOKEN` in CI and write `.npmrc` in the deploy step.

## Dev

From the **idp-ui repository root** (if generated under `apps/`):

```bash
pnpm install
pnpm --filter @idpxyz/parcel-web dev
```

From a **standalone clone** of only this app:

```bash
pnpm install
pnpm dev
```

## Next steps

1. Read `idp-ui/docs/workbench-shell.md` (or your fork’s copy) for shell layout conventions.
2. Replace placeholder panels / `renderContent` in `src/App.tsx` with your router and domain code.
3. Bump `@idpxyz/*` versions in `package.json` when you adopt new published releases.
