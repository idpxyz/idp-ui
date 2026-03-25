# IDP UI Foundation Monorepo ADR v1.1 Patch

- Status: Accepted with Follow-up Controls
- Date: 2026-03-17
- Based on: `docs/IDP-UI-Foundation-Monorepo-ADR-v1.md`
- Scope: Governance and enforcement addendum for `apps/*` + `packages/ui-*`

## Purpose

v1 已定义方向与目录边界。v1.1 补齐执行层，确保架构规则可被自动化约束，而不是依赖人工约定。

## Patch A: Boundary Enforcement (强制边界)

### A1. ESLint import 边界

在 workspace 统一 eslint config 中加入：

- `packages/ui-*` 禁止导入 `apps/*`
- `apps/*` 禁止互相导入
- `ui-workspace` 禁止导入产品业务模块

建议规则（示意）：

```js
"no-restricted-imports": [
  "error",
  {
    "patterns": [
      { "group": ["apps/*"], "message": "packages 不得依赖 apps" },
      { "group": ["@idp/*-web*"], "message": "shared layer 不得依赖产品 app" }
    ]
  }
]
```

### A2. CI 守卫

CI 新增 `arch:check`（必须通过）：

1. 扫描 `packages/ui-*` 是否出现产品关键词模块引用（`order`, `shipment`, `refund`, `oms`, `loms` 业务目录等）。
2. 扫描 `apps/*` 是否出现跨 app 相对路径导入。
3. PR 未通过 `arch:check` 不允许合并。

## Patch B: Package Layer Contract (层级契约)

新增统一约束表：

| Layer | 允许内容 | 禁止内容 |
| --- | --- | --- |
| `ui-tokens` | 设计 token 数据与构建产物 | React 组件、产品语义字段 |
| `ui-primitives` | Button/Input/Dialog 等原子组件 | 产品业务状态、产品字段名 |
| `ui-patterns` | PageHeader/FilterBar/InspectorPanel 等通用复合模式 | 产品路由、产品表模型 |
| `ui-workspace` | Shell、Split、CommandPalette、Layout Recipes | 订单/履约/退款等领域逻辑 |
| `apps/*` | 产品页面、路由、业务状态机、领域 mock | 反向修改 shared layer 逻辑 |

## Patch C: Promotion Workflow (组件上提流程)

组件从 app 上提到 package 必须满足 5 步：

1. **复用证据**：至少 2 个 app 已使用或明确排期复用。
2. **去业务化**：移除产品领域命名与数据结构耦合。
3. **接口收敛**：props 改为语义化通用接口。
4. **验证补齐**：至少补 1 个 story 或 1 个测试。
5. **迁移回填**：原 app 引用切到 package 并删除重复实现。

PR 必填字段：`promotion_target`、`reuse_evidence`、`breaking_risk`。

## Patch D: Exception Policy (例外策略)

允许临时越界，但必须满足：

- 在 PR 写明 `Exception Reason`
- 写 `Sunset Date`（默认 <= 30 天）
- 写 `Owner` 与回收任务链接

到期未回收的例外由平台负责人升级处理。

## Patch E: Ownership & Change Control

每个 `ui-*` 包必须声明：

- Primary Owner
- Backup Owner
- 必需 reviewer 规则（至少 1 名平台 reviewer）
- Breaking Change 流程（需要变更公告）

版本策略建议：

- 当前阶段使用 workspace lockstep（简单稳定）。
- 多团队并发后再评估 independent versioning + changesets。

## Patch F: Style System Governance

明确样式治理边界：

1. Token source of truth: `ui-tokens`。
2. App 不允许直接定义新的语义 token 名；只允许消费既有语义 token。
3. 产品差异优先走 `product-overrides`，禁止在页面写硬编码品牌色。
4. Tailwind 只做消费层，不作为 token 源。

## Rollout Plan

### R1 (本周)

- 建立 `arch:check` 脚本并接入 CI。
- 在 PR 模板增加 `Exception` 与 `Promotion` 字段。

### R2 (下周)

- 为 `ui-*` 包补 owner 清单与 review 规则。
- 选 1 个跨产品组件执行完整 promotion 流程。

### R3 (两周内)

- 建立 `ui-tokens` 的 core/semantic/themes/product-overrides 目录标准。
- 审计 app 中硬编码色值并形成回收清单。

## Acceptance Criteria (v1.1)

1. CI 已阻断边界违规导入。
2. 所有越界均有 exception 记录、owner、sunset date。
3. 至少 1 个组件完成“从 app 到 package”的标准上提流程。
4. `ui-*` 包 owner/reviewer 规则生效。
5. 样式治理规则在新 PR 中可执行。
