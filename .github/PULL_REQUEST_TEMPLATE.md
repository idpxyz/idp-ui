# Pull Request Template

## Summary

- What changed:
- Why:

## Architecture Boundary Check

- [ ] I confirm this PR does not introduce `packages -> apps` dependency.
- [ ] I confirm this PR does not introduce `apps -> apps` cross-product dependency.
- [ ] I ran `pnpm run arch:check` locally.

## Promotion Workflow (if moving code from app to package)

- `promotion_target`:
- `reuse_evidence` (at least 2 apps or approved roadmap):
- `breaking_risk`:
- Validation (story/test added):

## Exception Policy (required if any boundary exception)

- `exception_reason`:
- `owner`:
- `sunset_date`:
- `tracking_issue`:

## Validation

- [ ] `pnpm run build:all`
- [ ] Manual smoke checks (if UI impacted)
