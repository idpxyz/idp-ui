# __APP_DIR__

Generated with `pnpm create-app` from `templates/workbench-app`.

## Dev

From the **idp-ui repository root**:

```bash
pnpm install
pnpm --filter __PACKAGE_NAME__ dev
```

## Next steps

1. Read `docs/workbench-shell.md` and align any new shell behavior.
2. Copy `useWorkspaceState` patterns from `apps/myshop-web` or `apps/loms-web` when you need tabs, splits, and persistence.
3. Replace the placeholder `renderContent` in `src/App.tsx` with your `PageRouter` and domain modules.
