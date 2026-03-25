# IDP UI Foundation Monorepo ADR v1

- Status: Accepted
- Date: 2026-03-17
- Owners: Frontend Platform / Product FE
- Scope: `apps/*`, `packages/ui-*`, workspace-level tooling

## Context

当前仓库已进入多应用（`loms-web`、`myshop-web`）并行演进阶段。历史上存在两类结构风险：

1. 单产品主体实现进入 `packages`（例如原 `packages/loms-kit`）导致边界混乱。
2. workspace 根配置与 app 内配置混用，造成入口与脚手架认知成本高。

目标是建立可长期演进的分层结构：共享能力进 `packages`，产品业务进 `apps`，并保持依赖单向。

## Decision

采用以下结构原则：

1. `apps/*` 只承载产品业务实现与页面编排。
2. `packages/ui-*` 只承载共享 UI 能力（tokens/primitives/patterns/workspace/theme/utils）。
3. 产品专属组件默认放在 `apps/<product>/src`，仅在第二个产品复用后再上提共享层。
4. 依赖方向严格单向：

```text
ui-tokens
  -> ui-primitives
  -> ui-patterns
  -> ui-workspace
  -> apps/*
```

1. 禁止 `apps/*` 之间相互引用代码。
2. 禁止在 `packages/ui-*` 中引用产品业务模块（如订单、履约、退款等领域对象）。

## Repository Rules (Hard Rules)

### 1) 目录边界

- Allowed in `packages/ui-*`:
  - 通用组件、布局模式、shell、hooks、a11y helpers、主题运行时、token。
- Forbidden in `packages/ui-*`:
  - 产品页面、产品路由、产品 mock 数据、产品命令动作配置。
- Allowed in `apps/*`:
  - 页面、路由、产品数据模型、产品命令动作、产品导航。

### 2) 导入边界

- `apps/*` can import from `@idp/ui-*`。
- `packages/ui-*` cannot import from `apps/*`。
- `packages/ui-workspace` cannot import from `ui-product-kits`（若后续引入该层）。

### 3) 新组件上提准入

组件从 app 上提到 package 必须同时满足：

- 至少两个应用有重复实现或明确复用计划。
- 可移除产品领域命名与字段依赖。
- 提供最小示例/测试（Storybook 或单测其一）。

## Current-State Alignment (已完成)

本轮已对齐如下：

1. `loms-web` 主体实现已下沉到 `apps/loms-web/src/loms`。
2. 旧 `packages/loms-kit` 已移除。
3. `apps/loms-web/src/App.tsx` 已切换为本地 `./loms` 引用。
4. `apps/loms-web/package.json` 已移除 `@idp/loms-kit` 依赖。
5. `components.json` 已下沉到各应用：
   - `apps/loms-web/components.json`
   - `apps/myshop-web/components.json`
6. `pnpm run build:all` 验证通过。

## Recommended Next Steps

### Phase 1 (1-2 days)

- 保持现状，冻结目录边界。
- 在 PR 模板新增“是否违反 apps/packages 边界”检查项。

### Phase 2 (3-5 days)

- 在 `packages/ui-workspace` 建立最小标准目录：
  - `shell/`
  - `layouts/`
  - `patterns/`
  - `types/`
- 从两个应用中抽取真正通用的 workspace 级模式（先小后大）。

### Phase 3 (optional)

- 若多产品继续扩展，再引入 `ui-product-kits` 层。
- 仅承载“可复用但带产品语义”的中间层组件。

## Acceptance Criteria

以下条件全部满足则 ADR 落地完成：

1. 不存在产品主体实现目录位于 `packages`。
2. 根目录无 legacy 单应用入口配置残留。
3. 两个应用均可独立 `dev/build/preview`。
4. `build:all` 持续通过。
5. 新 PR 不再新增 `apps` 与 `packages` 边界反向依赖。

## Non-Goals

- 本 ADR 不要求一次性重写现有页面。
- 本 ADR 不要求立即引入 Storybook/Style Dictionary。
- 本 ADR 不改变现有业务功能与交互行为。
