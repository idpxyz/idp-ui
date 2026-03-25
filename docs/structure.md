对于你们这种 **系列化产品 + 共享工作台 + 长期演进** 的场景，我建议不要把“共同 UI 基石”做成一个简单的 `components/` 目录，而是做成一个 **monorepo 下的分层 UI 体系**：顶层按 `apps/` 和 `packages/` 分开，UI 再拆成 tokens、foundation、primitives、patterns、workspace、product-kits、docs/test 几层。这样最符合当前主流 workspace/monorepo 的组织方式，也最适合把 Storybook、设计系统和多个产品一起演进。Turborepo 官方就是围绕 workspaces 组织仓库，并明确支持把 Storybook 与应用一起放在 monorepo 中开发；Style Dictionary 也把 design tokens 作为平台无关的设计决策输入；shadcn/ui 的 monorepo 方案同样采用应用与 `ui` workspace 分离的结构。([Turborepo][1])

我给你的最终建议，不是“一个 ui 包走天下”，而是下面这个结构。

```text
idp/
├─ apps/
│  ├─ loms-web/                  # LOMS 前端应用
│  ├─ prism-web/                 # Prism 前端应用
│  ├─ rulemesh-web/              # RuleMesh 前端应用
│  ├─ ledgermesh-web/            # LedgerMesh 前端应用
│  ├─ admin-portal/              # 平台级门户 / SSO / 控制台
│  ├─ storybook/                 # UI 组件与模式文档站
│  └─ docs-site/                 # 设计规范/开发规范站点（可选）
│
├─ packages/
│  ├─ ui-tokens/                 # 设计令牌：颜色、字体、间距、圆角、阴影、层级、动效
│  │  ├─ src/
│  │  │  ├─ core/                # 原始 token：gray/blue/spacing/radius...
│  │  │  ├─ semantic/            # 语义 token：success/warning/page-bg/text-primary...
│  │  │  ├─ themes/              # light / dark / brand / high-contrast
│  │  │  └─ product-overrides/   # loms/prism 可允许少量覆写
│  │  ├─ dist/
│  │  └─ style-dictionary/       # token 构建配置
│  │
│  ├─ ui-foundation/             # foundations：排版、颜色语义、密度、布局、断点、z-index
│  │  ├─ src/colors/
│  │  ├─ src/typography/
│  │  ├─ src/spacing/
│  │  ├─ src/elevation/
│  │  ├─ src/motion/
│  │  ├─ src/layout/
│  │  └─ src/accessibility/
│  │
│  ├─ ui-icons/                  # 图标、业务图标映射
│  │  ├─ src/system/
│  │  ├─ src/domain/
│  │  └─ src/file-types/
│  │
│  ├─ ui-primitives/             # 最底层基础组件，接近 shadcn/radix 层
│  │  ├─ src/button/
│  │  ├─ src/input/
│  │  ├─ src/select/
│  │  ├─ src/dialog/
│  │  ├─ src/table/
│  │  ├─ src/tabs/
│  │  ├─ src/tooltip/
│  │  └─ src/lib/
│  │
│  ├─ ui-patterns/               # 通用复合组件，不带具体产品业务
│  │  ├─ src/page-header/
│  │  ├─ src/filter-bar/
│  │  ├─ src/status-badge/
│  │  ├─ src/summary-metric/
│  │  ├─ src/timeline/
│  │  ├─ src/empty-state/
│  │  ├─ src/error-state/
│  │  ├─ src/inspector-panel/
│  │  └─ src/action-bar/
│  │
│  ├─ ui-workspace/              # 你们最关键的一层：工作台级框架
│  │  ├─ src/workspace-shell/
│  │  ├─ src/workspace-header/
│  │  ├─ src/context-bar/
│  │  ├─ src/object-tabs/
│  │  ├─ src/split-pane/
│  │  ├─ src/command-palette/
│  │  ├─ src/data-dense-table/
│  │  ├─ src/activity-timeline/
│  │  └─ src/recipes/
│  │      ├─ list-detail-inspector/
│  │      ├─ header-tabs-inspector/
│  │      └─ dashboard-workspace/
│  │
│  ├─ ui-product-kits/           # 产品级 UI 适配层
│  │  ├─ src/loms/
│  │  │  ├─ order-status-badge/
│  │  │  ├─ leg-timeline/
│  │  │  ├─ shipment-header/
│  │  │  └─ exception-panels/
│  │  ├─ src/prism/
│  │  │  ├─ inventory-badge/
│  │  │  ├─ task-priority-chip/
│  │  │  ├─ location-visual-tag/
│  │  │  └─ wave-panels/
│  │  └─ src/shared-domain/
│  │
│  ├─ ui-theme-runtime/          # ThemeProvider、CSS variables、运行时换肤
│  │  ├─ src/provider/
│  │  ├─ src/css-vars/
│  │  └─ src/theme-hooks/
│  │
│  ├─ ui-utils/                  # 前端纯工具：cn、formatters、keyboard、a11y helpers
│  │
│  ├─ ui-testing/                # 视觉回归、交互测试、test helpers
│  │  ├─ playwright/
│  │  ├─ storybook-tests/
│  │  └─ fixtures/
│  │
│  ├─ config-eslint/
│  ├─ config-typescript/
│  ├─ config-tailwind/
│  └─ config-vitest/
│
├─ tooling/
│  ├─ scripts/
│  ├─ generators/                # 组件/页面脚手架
│  ├─ codemods/
│  └─ ci/
│
├─ .changeset/
├─ turbo.json
├─ pnpm-workspace.yaml
└─ package.json
```

这套结构的关键，不是文件多，而是**依赖方向单向清晰**。你要把它理解成 6 层：

```text
ui-tokens
   ↓
ui-foundation
   ↓
ui-primitives
   ↓
ui-patterns
   ↓
ui-workspace
   ↓
ui-product-kits
   ↓
apps/*
```

也就是说：

* `ui-tokens` 只定义 token，不引用 React 业务组件。
* `ui-foundation` 只定义设计规则和语义，不碰产品逻辑。
* `ui-primitives` 是 Button、Input、Dialog 这种原子/基础层。
* `ui-patterns` 是 PageHeader、InspectorPanel、FilterBar 这种“通用复合模式”。
* `ui-workspace` 是你们产品共同的工作台骨架，是最重要的一层。
* `ui-product-kits` 才允许出现 `loms`、`prism` 这些领域 UI 组件。
* `apps/*` 只消费，不反向污染共享层。

**这是你们现在最需要的，不是“大一统 ui 包”，而是“共享核心 + 领域适配”的结构。**

---

## 为什么我认为这对你们最科学

第一，**design tokens 必须独立成包**。Style Dictionary 官方把 design tokens 定义为“平台无关的设计决策表达”，适合成为整个 UI 系统的源头，而不是散落在各 app 的 CSS 变量里。([Style Dictionary][2])

第二，**Storybook 必须是独立 app，而不是塞进某个产品里**。Turborepo 官方明确把 Storybook 当作在 monorepo 中与应用并行开发设计系统的方式，这对你们这种多产品共享 UI 非常适合。([Turborepo][3])

第三，**共享 UI 不应直接等于共享产品页面**。shadcn/ui 官方 monorepo 文档虽然示例是 `web + ui` 两个 workspace，但它体现的是一个重要原则：基础组件和应用要分仓位，CLI/导入路径也围绕 workspace 边界管理。这个思路非常适合你们继续扩展为 `ui-primitives / ui-patterns / ui-workspace / ui-product-kits` 这种更企业化的分层。([Shadcn][4])

第四，**以后你们很可能需要 registry，而不是只靠 copy/paste**。shadcn 的 registry 文档说明了自定义 registry 可以把组件作为标准化 JSON 项输出，这对你们未来做内部组件分发、模板注入、脚手架生成很有价值。([Shadcn][5])

---

## 你们这个场景里，最容易犯的 5 个结构错误

### 1. 把所有共享东西都放进 `packages/ui`

后期一定会变成：

* 基础组件
* 业务组件
* 页面框架
* theme
* hooks
* utils
* 图标
* 测试工具

全堆一起，最后无法治理。

### 2. 把 LOMS 和 Prism 的业务组件放进 shared primitives

例如：

* `ShipmentStatusBadge`
* `WaveProgressCard`
* `InventoryTruthPanel`

这些不能进 `ui-primitives`，否则共享层会被业务污染。

### 3. 把页面模板放在 app 内

你们真正要沉淀的不是单个按钮，而是：

* `ListDetailInspector`
* `HeaderTabsInspector`
* `WorkspaceShell`
* `CommandPalette`
* `DenseEnterpriseTable`

这些应该进 `ui-workspace`，因为它们才是“系列产品共同 UI 基石”。

### 4. tokens 不独立

如果颜色、间距、字号散在 Tailwind config、CSS module、组件局部常量里，后面就没法做到统一主题、品牌扩展、暗色模式和产品差异化。

### 5. 文档和测试不独立

共享 UI 没有 Storybook、视觉回归、组件级测试，最后所有“规范”都会停留在 PPT。

---

## 结合你们 IDP 产品体系，我建议的命名

你们不要用太泛的名字，建议直接品牌化。

```text
packages/
  idp-ui-tokens/
  idp-ui-foundation/
  idp-ui-icons/
  idp-ui-primitives/
  idp-ui-patterns/
  idp-ui-workspace/
  idp-ui-product-kits/
  idp-ui-theme-runtime/
  idp-ui-utils/
  idp-ui-testing/
```

如果走 workspace alias，可以用：

```ts
@idp/ui-tokens
@idp/ui-foundation
@idp/ui-primitives
@idp/ui-patterns
@idp/ui-workspace
@idp/ui-product-kits
```

这个命名会比单纯 `@idp/ui` 更清晰，因为它天然表达层次边界。

---

## `ui-workspace` 这一层要怎么拆

这是你们最核心的一层，我单独给一个建议结构：

```text
packages/ui-workspace/
├─ src/
│  ├─ shell/
│  │  ├─ WorkspaceShell.tsx
│  │  ├─ WorkspaceSidebar.tsx
│  │  ├─ WorkspaceContent.tsx
│  │  └─ WorkspaceInspector.tsx
│  │
│  ├─ header/
│  │  ├─ PageHeader.tsx
│  │  ├─ PageHeaderTitle.tsx
│  │  ├─ PageHeaderMeta.tsx
│  │  └─ PageHeaderActions.tsx
│  │
│  ├─ context-bar/
│  │  ├─ ContextBar.tsx
│  │  ├─ ContextMetric.tsx
│  │  └─ ContextRiskBadge.tsx
│  │
│  ├─ layouts/
│  │  ├─ ListDetailInspectorLayout.tsx
│  │  ├─ HeaderTabsInspectorLayout.tsx
│  │  └─ DashboardWorkspaceLayout.tsx
│  │
│  ├─ patterns/
│  │  ├─ ActivityTimeline.tsx
│  │  ├─ InspectorPanel.tsx
│  │  ├─ DenseTable.tsx
│  │  ├─ FilterToolbar.tsx
│  │  └─ CommandPalette.tsx
│  │
│  ├─ hooks/
│  ├─ types/
│  ├─ recipes/
│  └─ index.ts
├─ stories/
├─ tests/
└─ package.json
```

这层做完之后，你们未来的产品页面就不是“从零拼页面”，而是：

* 选一个 workspace layout
* 套 PageHeader
* 配 ContextBar
* 填充 tab / table / inspector
* 再接入产品 kit

这样才能真的形成系列产品的一致性。

---

## 设计 tokens 建议怎么组织

建议采用 **core → semantic → theme → product override** 四段式，而不是直接写一堆 `primary-500`。

```text
ui-tokens/src/
├─ core/
│  ├─ color.json
│  ├─ spacing.json
│  ├─ radius.json
│  ├─ shadow.json
│  ├─ typography.json
│  └─ motion.json
├─ semantic/
│  ├─ background.json
│  ├─ text.json
│  ├─ border.json
│  ├─ status.json
│  ├─ surface.json
│  └─ action.json
├─ themes/
│  ├─ light.json
│  ├─ dark.json
│  └─ high-contrast.json
└─ product-overrides/
   ├─ loms.json
   ├─ prism.json
   └─ rulemesh.json
```

理由很简单：

* `core` 是原始设计值
* `semantic` 才是组件真正依赖的语义
* `themes` 管主题
* `product-overrides` 只允许少量品牌差异，不允许破坏系统规则

---

## 我对你们的最终裁决

对于 IDP 这种多产品平台，**最佳实践不是“一个 components 目录”**，而是：

> **apps + layered UI packages + tokens as source + storybook as independent app + workspace patterns as first-class package**

也就是这四条：

1. **顶层用 monorepo**
2. **共享 UI 必须分层，不要一个 ui 包打天下**
3. **`ui-workspace` 必须成为一级包**
4. **产品差异进 `ui-product-kits`，不要污染 shared core**

如果你认可，我下一步可以直接继续给你输出一份 **“IDP UI Foundation Monorepo Directory ADR v1”**，包括：

* 完整目录树
* 每个 package 的职责边界
* import 依赖规则
* 命名规范
* Storybook / token / test / 发布流程约束
* 对应到 LOMS / Prism 的落地示例

[1]: https://turborepo.com/docs/crafting-your-repository/structuring-a-repository "Structuring a repository"
[2]: https://styledictionary.com/info/tokens/ "Design Tokens | Style Dictionary"
[3]: https://turborepo.com/docs/guides/tools/storybook "Storybook"
[4]: https://ui.shadcn.com/docs/monorepo "Monorepo - shadcn/ui"
[5]: https://ui.shadcn.com/docs/registry/getting-started "Getting Started - shadcn/ui"
