# UI Package Governance

## Owners

| Package | Primary Owner | Backup Owner | Platform Review Required |
| --- | --- | --- | --- |
| `@idp/ui-tokens` | FE Platform | TBD | Yes |
| `@idp/ui-primitives` | FE Platform | TBD | Yes |
| `@idp/ui-patterns` | FE Platform | TBD | Yes |
| `@idp/ui-workspace` | FE Platform | TBD | Yes |
| `@idp/ui-theme-runtime` | FE Platform | TBD | Yes |
| `@idp/ui-utils` | FE Platform | TBD | Yes |

## Change Control

1. Any breaking change in `ui-*` must include migration note.
2. Any package API removal requires one release-cycle deprecation notice.
3. Shared package changes need at least one platform reviewer.
4. Boundary exceptions must follow ADR v1.1 patch policy.

## Version Policy

- Current: workspace lockstep (single-repo synchronized updates).
- Future option: independent versioning with changesets after team scale-up.
