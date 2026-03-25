# oms-demo-web

OMS-themed workbench demo with mock orders / inventory pages.

## Develop (inside `idp-ui` monorepo)

`@idpxyz/*` are **`workspace:*`** so you get the latest `packages/*` without publishing.

```bash
pnpm install
pnpm --filter @idpxyz/oms-demo-web dev
```

## Consumer-style install (outside monorepo)

Pin `@idpxyz/*` to published versions (e.g. `^0.1.5`) and set GitHub Packages auth in `~/.npmrc`. Use `templates/workbench-app-registry` from this repo as a starting point.
