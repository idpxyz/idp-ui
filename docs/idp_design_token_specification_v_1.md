# IDP Design Token 详细定义文档

**Version:** v1.0  
**Status:** Draft / Foundation Freeze Candidate  
**Scope:** IDP 全产品族设计系统基础 Token 层  
**Audience:** Design System, Product Design, Frontend, UI Engineering, Theme Engineering  

---

# 1. 文档目的

本文用于定义 IDP 产品族统一的 Design Token 体系，为以下内容提供单一事实来源：

- Figma Variables / Styles
- React 组件库主题系统
- 跨产品 Light / Dark Theme
- LOMS / Prism / Gatekeeper / RuleMesh / LedgerMesh / PHI / Sagapai 的一致视觉基础
- 页面模板、组件规范、状态语义与布局系统

本文件不负责定义具体页面，也不直接定义业务组件，而是建立：

- 颜色
- 字体
- 间距
- 圆角
- 阴影
- 边框
- 动效
- 层级
- 状态语义
- 产品 accent

的统一基础语言。

---

# 2. Token 设计原则

## 2.1 Token 是系统能力，不是静态样式表

IDP Token 体系必须支撑：
- 多产品
- 多主题
- 高信息密度
- 数据密集型工作台
- Studio / Console / Workspace / Admin 等多页面形态

## 2.2 先定义语义，再定义产品差异

优先级应为：

1. Foundation Tokens
2. Semantic Tokens
3. Component Tokens
4. Product Tokens

禁止直接在组件里硬编码产品颜色或页面特例颜色。

## 2.3 中性色比品牌色更重要

跨产品一致性的核心是：
- 背景
- 文字
- 边框
- hover
- disabled
- panel 分层

因此中性色系统必须最先冻结。

## 2.4 状态色是企业级语义资产

状态色不是装饰色，必须在所有产品中严格统一语义。

## 2.5 Token 必须能映射到代码与设计工具

每个 token 名称都应：
- 有稳定命名
- 可作为 Figma variable 名
- 可映射为 TypeScript / CSS variable / theme object
- 可扩展 Light / Dark / Product Accent

---

# 3. Token 架构总览

推荐四层：

```text
Foundation Tokens
├── color.base
├── spacing
├── radius
├── border.width
├── shadow
├── typography
├── motion
└── z-index

Semantic Tokens
├── bg.*
├── text.*
├── border.*
├── icon.*
├── status.*
├── focus.*
└── overlay.*

Component Tokens
├── button.*
├── input.*
├── table.*
├── tabs.*
├── badge.*
├── panel.*
└── workspace.*

Product Tokens
├── product.loms.*
├── product.prism.*
├── product.gatekeeper.*
├── product.rulemesh.*
├── product.ledgermesh.*
├── product.phi.*
└── product.sagapai.*
```

---

# 4. 命名规范

## 4.1 命名格式

统一采用：

```text
{layer}.{category}.{role}.{state?}.{scale?}
```

示例：
- `color.gray.100`
- `bg.canvas.default`
- `text.primary`
- `status.danger.fg`
- `button.primary.bg.hover`
- `table.row.bg.selected`
- `product.loms.accent`

## 4.2 命名要求
- 全小写
- 使用点号分层
- 避免缩写歧义
- 避免直接带业务名进入 foundation / semantic 层

## 4.3 禁止命名方式
- `blue1`, `gray2`, `mainColor`
- `shipmentRed`, `warningYellow2`
- `bg1`, `text2`

---

# 5. Color Foundation Tokens

---

## 5.1 Gray / Neutral Scale

中性色建议统一 11~12 阶，用于：
- 页面背景
- surface
- border
- text
- disabled
- hover
- overlay 分层辅助

### 推荐 Neutral Scale

```text
color.gray.0
color.gray.25
color.gray.50
color.gray.100
color.gray.200
color.gray.300
color.gray.400
color.gray.500
color.gray.600
color.gray.700
color.gray.800
color.gray.900
color.gray.950
```

### 建议语义分布（Light Theme 方向）
- `gray.0 ~ 50`: page canvas / elevated surfaces
- `gray.100 ~ 200`: subtle surfaces / hover / dividers
- `gray.300 ~ 400`: borders / disabled strokes
- `gray.500 ~ 600`: secondary text / icon
- `gray.700 ~ 800`: primary text
- `gray.900 ~ 950`: strongest text / dark theme inversions

---

## 5.2 Blue Scale

用于：
- info / in-progress
- primary accent base family（如未做产品差异时）
- links / active selection（受控使用）

```text
color.blue.50
color.blue.100
color.blue.200
color.blue.300
color.blue.400
color.blue.500
color.blue.600
color.blue.700
color.blue.800
color.blue.900
```

---

## 5.3 Green Scale

用于：
- success
- healthy
- completed
- positive KPI

```text
color.green.50
color.green.100
color.green.200
color.green.300
color.green.400
color.green.500
color.green.600
color.green.700
color.green.800
color.green.900
```

---

## 5.4 Amber / Orange Scale

用于：
- warning
- at risk
- nearing SLA threshold
- review required

```text
color.amber.50
color.amber.100
color.amber.200
color.amber.300
color.amber.400
color.amber.500
color.amber.600
color.amber.700
color.amber.800
color.amber.900
```

---

## 5.5 Red Scale

用于：
- danger
- failed
- critical
- breached
- destructive action

```text
color.red.50
color.red.100
color.red.200
color.red.300
color.red.400
color.red.500
color.red.600
color.red.700
color.red.800
color.red.900
```

---

## 5.6 Teal / Cyan Scale

可作为中性专业型产品的辅助 accent，如 LOMS / Prism 一类工作台中较适合。

```text
color.teal.50
color.teal.100
color.teal.200
color.teal.300
color.teal.400
color.teal.500
color.teal.600
color.teal.700
color.teal.800
color.teal.900
```

---

## 5.7 Purple / Indigo Scale

适合 Gatekeeper / RuleMesh 等偏治理、规则、图结构产品的 accent。

```text
color.indigo.50
color.indigo.100
color.indigo.200
color.indigo.300
color.indigo.400
color.indigo.500
color.indigo.600
color.indigo.700
color.indigo.800
color.indigo.900
```

---

# 6. Semantic Color Tokens

本节为真正供页面与组件消费的语义层。

---

## 6.1 Background Tokens

```text
bg.canvas.default
bg.canvas.subtle
bg.surface.default
bg.surface.elevated
bg.surface.sunken
bg.surface.hover
bg.surface.active
bg.surface.selected
bg.surface.disabled
bg.overlay.default
bg.backdrop.default
```

### 语义说明
- `bg.canvas.default`：应用最外层背景
- `bg.surface.default`：标准卡片 / panel / 表格容器
- `bg.surface.elevated`：浮层、dropdown、modal、drawer
- `bg.surface.sunken`：输入框内区、secondary region
- `bg.surface.hover`：行 hover / item hover
- `bg.surface.selected`：选中态背景
- `bg.overlay.default`：覆盖层内 panel 背景
- `bg.backdrop.default`：modal 背景遮罩

---

## 6.2 Text Tokens

```text
text.primary
text.secondary
text.tertiary
text.inverse
text.disabled
text.link
text.link.hover
text.on-accent
text.on-danger
text.on-success
text.on-warning
```

### 语义说明
- `text.primary`：主要信息、标题、表格主体
- `text.secondary`：辅助描述、元信息
- `text.tertiary`：说明、caption、次要标签
- `text.inverse`：深色底上的文字
- `text.disabled`：禁用
- `text.link`：链接

---

## 6.3 Icon Tokens

```text
icon.primary
icon.secondary
icon.tertiary
icon.disabled
icon.inverse
icon.info
icon.success
icon.warning
icon.danger
```

图标建议默认复用 text 语义，但单独保留一层可增强灵活性。

---

## 6.4 Border Tokens

```text
border.default
border.subtle
border.strong
border.inverse
border.disabled
border.focus
border.selected
border.danger
border.warning
border.success
```

### 建议用途
- `border.default`：标准卡片、表格、input
- `border.subtle`：低对比辅助分隔
- `border.strong`：当前选中层级、重要分割
- `border.focus`：焦点态

---

## 6.5 Focus Tokens

```text
focus.ring
focus.ring.offset
focus.border
```

所有可交互组件必须统一焦点态，不能每个组件自创。

---

## 6.6 Status Tokens

### Success
```text
status.success.bg
status.success.bg.subtle
status.success.fg
status.success.border
```

### Info
```text
status.info.bg
status.info.bg.subtle
status.info.fg
status.info.border
```

### Warning
```text
status.warning.bg
status.warning.bg.subtle
status.warning.fg
status.warning.border
```

### Danger
```text
status.danger.bg
status.danger.bg.subtle
status.danger.fg
status.danger.border
```

### Neutral
```text
status.neutral.bg
status.neutral.bg.subtle
status.neutral.fg
status.neutral.border
```

这些 token 将被所有 badge、pill、alert、toast、风险标签复用。

---

## 6.7 Severity Tokens

如果需要和 status 区分，可单独建立：

```text
severity.low.*
severity.medium.*
severity.high.*
severity.critical.*
```

但建议谨慎，避免与 warning/danger 重叠。  
建议优先通过 `status.*` + `badge label` 满足语义表达，再在确有必要时扩展独立 severity 体系。

---

# 7. Product Accent Tokens

产品 accent 只用于产品识别、局部强调和导航激活，不替代状态语义。

## 7.1 推荐产品 Accent

```text
product.loms.accent
product.loms.accent.subtle
product.loms.accent.fg

product.prism.accent
product.prism.accent.subtle
product.prism.accent.fg

product.gatekeeper.accent
product.gatekeeper.accent.subtle
product.gatekeeper.accent.fg

product.rulemesh.accent
product.rulemesh.accent.subtle
product.rulemesh.accent.fg

product.ledgermesh.accent
product.ledgermesh.accent.subtle
product.ledgermesh.accent.fg

product.phi.accent
product.phi.accent.subtle
product.phi.accent.fg

product.sagapai.accent
product.sagapai.accent.subtle
product.sagapai.accent.fg
```

## 7.2 推荐方向
- LOMS：teal / blue-teal
- Prism：cool blue-green / graphite accent
- Gatekeeper：indigo / blue-violet
- RuleMesh：violet / indigo-blue
- LedgerMesh：blue / slate-blue
- PHI：orange-blue dual identity, but token 用主 accent 即可
- Sagapai：calm editorial blue / deep cyan

---

# 8. Typography Tokens

---

## 8.1 Font Family Tokens

```text
font.family.sans
font.family.mono
```

### 建议策略
- `font.family.sans`：系统 UI 字体栈
- `font.family.mono`：日志、代码、ID、规则表达

---

## 8.2 Font Size Tokens

```text
font.size.10
font.size.12
font.size.13
font.size.14
font.size.16
font.size.18
font.size.20
font.size.24
font.size.28
font.size.32
```

### 建议用途
- 10：极小 caption（慎用）
- 12：caption / dense metadata
- 13：compact table / dense UI
- 14：标准 body
- 16：大 body / 小标题
- 18 / 20：section title
- 24 / 28 / 32：page title / hero level（少用）

---

## 8.3 Font Weight Tokens

```text
font.weight.regular
font.weight.medium
font.weight.semibold
font.weight.bold
```

建议避免过多细分，保证实现稳定。

---

## 8.4 Line Height Tokens

```text
font.line-height.tight
font.line-height.normal
font.line-height.relaxed
```

可进一步映射：
- tight：标题 / dense labels
- normal：正文 / 表格
- relaxed：长文档 / 富文本

---

## 8.5 Text Style Semantic Tokens

```text
typography.display
typography.h1
typography.h2
typography.h3
typography.title
typography.body
typography.body.small
typography.label
typography.caption
typography.code
```

建议在 Figma 和代码中都以此作为消费层，而不是组件直接拼 font-size/font-weight。

---

# 9. Spacing Tokens

## 9.1 Base Scale

```text
space.0 = 0
space.1 = 4
space.2 = 8
space.3 = 12
space.4 = 16
space.5 = 20
space.6 = 24
space.8 = 32
space.10 = 40
space.12 = 48
space.16 = 64
```

## 9.2 使用建议
- `space.1 ~ 2`：控件内小间距
- `space.3 ~ 4`：模块内标准间距
- `space.5 ~ 6`：section 间距
- `space.8+`：页面级块间距

## 9.3 统一规则
- 不使用任意像素间距
- 页面和组件都从该刻度中选
- Dense 场景优先使用 4 / 8 / 12 / 16

---

# 10. Radius Tokens

```text
radius.none = 0
radius.sm = 4
radius.md = 6
radius.lg = 8
radius.xl = 12
radius.2xl = 16
radius.full = 9999
```

## 使用建议
- 输入框 / 小按钮：`radius.md` 或 `radius.lg`
- 卡片 / panel：`radius.lg` / `radius.xl`
- pill / badge：`radius.full`
- Modal / Drawer：`radius.xl`

---

# 11. Border Width Tokens

```text
border.width.none = 0
border.width.hairline = 0.5
border.width.sm = 1
border.width.md = 2
```

## 使用建议
- 默认边框：`border.width.sm`
- 强调边框 / focus：`border.width.md`
- hairline 仅在高清显示下慎用

---

# 12. Shadow Tokens

企业级工作台中阴影应克制。

```text
shadow.none
shadow.xs
shadow.sm
shadow.md
shadow.lg
shadow.xl
```

## 使用建议
- `shadow.xs / sm`：dropdown, tooltip
- `shadow.md`：drawer, modal
- `shadow.lg+`：慎用，仅特殊 overlay

不建议普通卡片大量使用厚阴影。

---

# 13. Motion Tokens

## 13.1 Duration

```text
motion.duration.fast = 120ms
motion.duration.normal = 180ms
motion.duration.slow = 240ms
motion.duration.xslow = 320ms
```

## 13.2 Easing

```text
motion.easing.standard
motion.easing.decelerate
motion.easing.accelerate
motion.easing.emphasized
```

## 13.3 使用建议
- hover / focus：fast
- panel open / close：normal
- drawer / modal：normal / slow
- tab close/open：fast / normal

---

# 14. Z-Index Tokens

```text
z.base = 0
z.dropdown = 1000
z.sticky = 1100
z.overlay = 1200
z.drawer = 1300
z.modal = 1400
z.toast = 1500
z.tooltip = 1600
z.command = 1700
```

必须统一，不允许组件自己写魔法数。

---

# 15. Layout Tokens

除基础 spacing 外，建议建立少量布局 token。

```text
layout.topbar.height
layout.sidebar.width
layout.sidebar.collapsed-width
layout.rightpanel.width
layout.bottompanel.min-height
layout.bottompanel.default-height
layout.content.max-width
```

## 建议默认值方向
- topbar：48~56
- sidebar：240~280
- collapsed sidebar：56~72
- right panel：320~400
- bottom panel 默认：240~320

这些可以在后续组件级规范中再冻结具体值。

---

# 16. Density Tokens

IDP 产品需要统一支持至少两种密度：

```text
density.comfortable
density.compact
```

建议映射到：
- row height
- input height
- button height
- padding
- typography minor adjustments

### 示例方向
```text
size.control.height.sm
size.control.height.md
size.control.height.lg

size.row.height.compact
size.row.height.comfortable
```

---

# 17. Component Token 建议

组件 token 应直接全量定义并纳入统一治理，避免后续页面层反向补洞。

---

## 17.1 Button Tokens

```text
button.height.sm
button.height.md
button.height.lg
button.padding.x.sm
button.padding.x.md
button.padding.x.lg
button.radius

button.primary.bg.default
button.primary.bg.hover
button.primary.bg.active
button.primary.fg.default
button.primary.border.default

button.secondary.bg.default
button.secondary.bg.hover
button.secondary.fg.default
button.secondary.border.default

button.ghost.bg.hover
button.ghost.fg.default

button.danger.bg.default
button.danger.bg.hover
button.danger.fg.default
```

---

## 17.2 Input Tokens

```text
input.height.sm
input.height.md
input.height.lg
input.padding.x
input.padding.y
input.radius
input.bg.default
input.bg.disabled
input.border.default
input.border.hover
input.border.focus
input.text.default
input.placeholder
```

---

## 17.3 Table Tokens

```text
table.header.bg
table.header.text
table.header.border
table.row.bg.default
table.row.bg.hover
table.row.bg.selected
table.row.border
table.row.height.compact
table.row.height.comfortable
table.cell.padding.x
table.cell.padding.y
```

---

## 17.4 Tabs Tokens

```text
tabs.height
tabs.gap
tabs.item.bg.active
tabs.item.bg.hover
tabs.item.text.default
tabs.item.text.active
tabs.item.border.active
tabs.item.close.icon
```

需要区分：
- workbench tabs
- content tabs

后续建议拆分：
- `tabs.workbench.*`
- `tabs.content.*`

---

## 17.5 Badge / Pill Tokens

```text
badge.height.sm
badge.height.md
badge.padding.x
badge.radius
badge.text
badge.success.*
badge.info.*
badge.warning.*
badge.danger.*
badge.neutral.*
```

---

## 17.6 Panel / Card Tokens

```text
panel.bg.default
panel.bg.elevated
panel.border.default
panel.radius
panel.padding
card.bg.default
card.border.default
card.radius
card.padding
```

---

# 18. Theme Mapping 建议

建议 Light / Dark Theme 都通过 Semantic Tokens 映射，而不是组件直接知道基础色号。

## 18.1 Light Theme 映射逻辑
- canvas 使用浅 neutral
- text.primary 使用深 neutral
- border.default 使用浅中 neutral
- status 使用中等饱和语义色

## 18.2 Dark Theme 映射逻辑
- canvas 使用深 neutral
- text.primary 使用浅 neutral
- border.default 使用深中 neutral
- hover / selected 增强亮度对比
- status 色需重新校准可读性，不直接照搬 light

## 18.3 Theme 切换原则
组件永远消费 semantic/component tokens。  
theme 只负责 semantic token 的值映射。

---

# 19. Figma 落地建议

## 19.1 Variables 分层
建议在 Figma 中建立：
- Foundation / Colors
- Foundation / Typography
- Foundation / Space
- Semantic / Light
- Semantic / Dark
- Product / Accent

## 19.2 Modes
建议至少支持：
- Light
- Dark

产品 accent 可作为独立 collection 或 mode 扩展。

## 19.3 Text Styles
优先用 semantic text styles：
- Display
- H1
- H2
- H3
- Body
- Body Small
- Label
- Caption
- Code

---

# 20. 前端实现建议

## 20.1 代码层级
建议在 React 组件库中建立：

```text
src/design-system/
├── foundation/
│   ├── colors.ts
│   ├── spacing.ts
│   ├── radius.ts
│   ├── shadow.ts
│   ├── typography.ts
│   └── motion.ts
├── semantic/
│   ├── light.ts
│   ├── dark.ts
│   └── product-accents.ts
├── components/
│   ├── button.tokens.ts
│   ├── input.tokens.ts
│   ├── table.tokens.ts
│   └── ...
└── theme/
    ├── create-theme.ts
    └── css-vars.ts
```

## 20.2 CSS Variable 建议
建议最终生成：
- `--bg-canvas-default`
- `--text-primary`
- `--status-danger-fg`
- `--space-4`
- `--radius-lg`

等变量，方便 runtime theme 切换。

## 20.3 不建议做法
- 组件里直接写 hex
- 每个产品自己复制一份 token
- 先做组件再反推 token

---

# 21. 全量冻结的 Token 核心清单

建议直接冻结以下 10 类核心项：

1. Neutral Color Scale
2. Status Semantic Colors
3. Background / Text / Border Semantic Tokens
4. Typography Semantic Tokens
5. Spacing Scale
6. Radius Scale
7. Border Width Scale
8. Shadow Scale
9. Motion Duration / Easing
10. Product Accent Tokens

没有这 10 类，组件系统会持续漂移。

---

# 22. 全量补充 Token

在核心项冻结基础上，以下补充项也应同步完成并进入统一版本管理：
- component tokens 全量化
- density token 冻结
- layout token 冻结
- chart palette token
- studio canvas token
- data visualization token

---

# 23. 图表色板建议

图表不应滥用产品 accent，应以可读性与语义为主。

建议建立：

```text
chart.series.1
chart.series.2
chart.series.3
chart.series.4
chart.series.5
chart.positive
chart.warning
chart.negative
chart.neutral
```

## 规则
- 趋势图系列色固定顺序
- 风险/异常图尽量使用语义色
- 深浅模式下必须单独校准对比度

---

# 24. 示例：Token 消费链路

## 24.1 Button Primary

```text
Foundation:
color.blue.600
color.blue.700
color.gray.0
radius.lg
space.4

Semantic:
text.on-accent

Component:
button.primary.bg.default = product accent or semantic primary
button.primary.bg.hover = darker step
button.primary.fg.default = text.on-accent
button.radius = radius.lg
```

## 24.2 Status Badge - Danger

```text
Foundation:
color.red.50
color.red.600
color.red.200

Semantic:
status.danger.bg.subtle
status.danger.fg
status.danger.border

Component:
badge.danger.bg = status.danger.bg.subtle
badge.danger.fg = status.danger.fg
badge.danger.border = status.danger.border
```

---

# 25. 治理建议

## 25.1 Token 变更必须可审计
建议每次 token 变更都记录：
- 变更项
- 原因
- 影响范围
- 是否破坏性
- Figma / code 是否同步

## 25.2 禁止页面级私有 token 泛滥
允许临时 token，但必须：
- 明确标注 experimental
- 有过期计划
- 尽快收敛到系统 token

## 25.3 Token 评审顺序
优先评审：
- semantic token
- component token
- product accent token

不要先在页面上争论局部视觉。

---

# 26. 最终裁决

IDP 的 Design Token 不是“为了做主题方便”，而是为了建立：

- 跨产品一致性
- Light / Dark 稳定切换
- 设计资产与代码资产同源
- 组件库可治理
- 页面风格可预测

它是整个设计系统真正的基础设施层。

只有 token 冻结之后，后续的：
- Button / Table / Tabs / Workspace Shell 组件规范
- Figma 组件库
- React 组件库
- LOMS / Prism / PHI Studio 的产品化适配

才会真正稳定。

---

# 27. 下一步建议

最合理的后续产物有：

1. **核心组件规范手册**（Button / Table / Tabs / Filter Bar / Workspace Shell）
2. **IDP Light / Dark Theme 映射表**
3. **Figma Variables / Styles 组织规范**
4. **React 主题对象与 CSS Variables 命名规范**
5. **LOMS / Prism / PHI Studio 的产品 accent 应用示例**

如果按实施顺序，建议下一步直接完成：

**核心组件规范手册（Button / Table / Tabs / Filter Bar / Workspace Shell）**

因为这会把 token 真正落到可执行的设计与前端组件层。

