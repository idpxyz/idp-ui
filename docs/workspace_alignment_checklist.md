# Workspace Standards Unified Alignment Checklist

## Scope

- Source standards:
  - `docs/idp_product_ux_ui_design_system_handbook_v_1.md`
  - `docs/idp_workspace_page_golden_standard_v_1.md`

- Target project: `vscode-ui`

## Unified P0 Checklist

### 1) Global Shell

- [x] Top bar + left nav + main workspace + right context + bottom panel
- [x] Split pane layout for workspace
- [x] Bottom panel open/close state persisted across refresh
- [x] Shell interaction keyboard shortcuts unified (`Ctrl/Cmd+K`, `Esc`, `Ctrl/Cmd+W`, `Ctrl/Cmd+Shift+T`)

### 2) Command + Search System

- [x] Global search UI exists in title bar
- [x] Command palette implemented (`Ctrl/Cmd+K`)
- [x] Command palette supports page jump + object open + recent object open
- [x] Command actions use consistent feedback

### 3) Workspace Page Structure

- [x] Object Header present (example: ShipmentDetail)
- [x] Summary strip/context summary present
- [x] Main content tabs present
- [x] Right context panel present
- [x] Bottom panel (events/logs/audit/comments) present

### 4) State + Feedback Model

- [x] Some module-level loading skeletons exist (`ShipmentMonitor`, `BottomPanel`)
- [x] Unified page-level state primitives added (`page-states.tsx`)
- [x] Empty states categorized (truly empty / filtered empty / no permission / unavailable)
- [x] Error state primitives added (section/page unavailable patterns)
- [x] High-risk actions enforce confirmation + auditable feedback

### 5) Accessibility + Consistency

- [x] Icon buttons generally have `title`
- [x] Keyboard-first command/search workflow complete
- [x] Focus-visible ring is consistently applied in shared `Button`/`Input` primitives
- [x] Status semantics use icon + label in critical contexts (not color-only)

## Current Gap Priority

1. Expand page-state primitives usage to all major pages (remaining rollout)
2. Add deeper keyboard coverage for table row navigation patterns
3. Add command/action telemetry pipeline (optional enterprise extension)
4. Introduce code-splitting for command/object heavy modules

## Implementation Plan

1. Keep `CommandPalette` as shared shell capability
2. Reuse `ConfirmDialog` for all high-risk flows
3. Keep shell preferences in `localStorage` contract
4. Reuse `ui/page-states` primitives in new pages
5. Validate via `npm run build` on each milestone
