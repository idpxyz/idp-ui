# IDP 产品 UX/UI 设计规范手册

**Version:** v1.0  
**Scope:** IDP 产品族（LOMS / Prism / Gatekeeper / RuleMesh / LedgerMesh / PHI / Sagapai 等）  
**Audience:** Product / UX / UI / Frontend / Design System / Domain Architect / PMO  
**Status:** Foundation Handbook Draft  

---

# 1. 手册目的

本手册用于为 IDP 产品族建立统一、可扩展、可治理的 UX/UI 设计规范，确保未来包括但不限于以下产品在体验层面保持一致：

- LOMS（Logistics Order Management System）
- Prism（WMS / 仓储执行与库存可视化）
- Gatekeeper（IAM / 权限与身份治理）
- RuleMesh / DecisionMesh（规则与决策平台）
- LedgerMesh（计费 / 对账 / 结算）
- PHI / PHI Studio（标签打印 / 设计器 / 打印治理）
- Sagapai（CMS / 新闻与内容平台）
- 未来所有 IDP Control Tower / Studio / Console 型产品

本手册的目标不是定义某一个产品的页面，而是建立一套 **跨产品一致的体验操作系统**，使不同产品在以下维度形成统一：

- 视觉语言
- 信息架构
- 页面骨架
- 组件系统
- 交互规则
- 状态表达
- 数据密集型工作台体验
- 跨产品可学习性
- 设计与前端协作方式
- 设计治理与版本机制

---

# 2. 总体设计定位

## 2.1 我们不是在做“后台页面集合”

IDP 的产品不是消费级 App，也不是纯展示型 Dashboard，更不是零散管理后台的拼接。

IDP 产品族更准确的形态是：

- **Control Tower**：面向运营、监控、分析、风险与调度
- **Workbench**：面向多对象并行处理、异常闭环、连续工作流
- **Studio**：面向配置、设计、建模、治理、规则编排
- **Console**：面向管理员、高级操作员、实施支持、运维与治理角色

因此，IDP UX/UI 的核心不是“好看”，而是：

- 强信息密度下仍保持可读性
- 多对象、多上下文切换效率高
- 复杂业务下仍然具备一致性
- 大量状态、异常、流程、关系的可解释性强
- 让用户在复杂系统中形成稳定心智模型

## 2.2 设计哲学

IDP 产品设计应遵循以下总哲学：

### A. 专业优先于炫技
界面首先服务于高频专业用户，而不是视觉表演。

### B. 可操作优先于装饰
颜色、图标、层次都应首先承担业务语义，而不是装饰作用。

### C. 一致优先于局部最优
单一页面可以更酷，但整个产品族需要一致、可迁移、可复用。

### D. 结构优先于风格
用户长期记住的是结构与交互模式，而不是某个渐变色。

### E. 业务语义优先于技术语义
界面上应尽量展示业务语言，而不是底层技术实现语言。

---

# 3. 设计系统的适用范围

本手册适用于以下四类产品：

## 3.1 Monitor / Control Tower 类
例如：
- LOMS Operations Console
- Prism Execution Monitor
- Carrier Ops Console
- Billing Risk Monitor

特点：
- 数据密集
- 风险与异常驱动
- 长时间盯盘
- 多对象并行处理

## 3.2 Workspace / Case Handling 类
例如：
- Shipment Workspace
- Exception Workbench
- Inventory Discrepancy Workspace
- Billing Dispute Workspace

特点：
- 以对象为中心
- 强上下文分析
- 需要时间线 / 审计 / 推荐动作

## 3.3 Studio / Designer / Configurator 类
例如：
- **Canonicalization Studio**（LOMS 模块，IDP 产品族）：入站归一化 / mapping workbench，混合式 pipeline 编排与字段映射配置
- PHI Studio
- RuleMesh Studio
- Template Designer
- Workflow Builder

特点：
- 面向建模与配置
- 面板式工作区
- 可能包含画布 / 属性栏 / 资源区 / 预览区

## 3.4 Governance / Admin 类
例如：
- Gatekeeper Admin
- Access Governance
- Tenant / Site / Role 管理

特点：
- 表格、表单、关系、授权、配置密集
- 需要较高一致性和可审计性

---

# 4. 品牌与产品体验层级

为保证产品族一致性，必须区分三个层级：

## 4.1 企业级品牌层（IDP Master Brand）
统一以下内容：
- 设计哲学
- token 体系
- 主色与中性色基因
- 字体体系
- spacing / radius / shadow / border
- 状态语义色
- 组件行为模型
- 全局 Shell 架构

## 4.2 产品层（LOMS / Prism / Gatekeeper 等）
允许差异化的内容：
- 产品图标 / 标识
- 产品强调色（accent）
- 某些对象语义标签
- 特定领域组件（如 route chain、库存位置树、规则节点编辑器）

## 4.3 页面 / 场景层
允许差异化的内容：
- 页面布局变体
- 角色视图
- 模块组合
- 特定任务流

**裁决原则：**
- 企业级品牌层必须统一
- 产品层可做受控差异化
- 页面层可以灵活，但不能破坏上层规则

---

# 5. 核心设计原则

## 5.1 可学习性（Learnability）
用户在 LOMS 学会的结构，应尽可能迁移到 Prism / LedgerMesh / RuleMesh。

例如：
- 左侧导航模式一致
- 顶栏搜索与 command 模式一致
- 对象详情页结构一致
- 底部日志 / 审计 / 事件面板一致
- Badge / Risk / SLA / Severity 的视觉语义一致

## 5.2 可预测性（Predictability）
同类操作在不同产品中应表现一致：
- 点击表格行的行为一致
- 双击打开对象工作区一致
- 右侧上下文区结构一致
- destructive action 的确认方式一致

## 5.3 可解释性（Explainability）
复杂业务系统必须让用户理解：
- 当前状态是什么
- 为什么会这样
- 有什么风险
- 下一步该做什么
- 操作会造成什么影响

## 5.4 可扩展性（Scalability）
设计规范不能只适配当前两个产品，而要能支撑未来更多产品和更多领域对象。

## 5.5 可治理性（Governability）
规范必须可以被审查、冻结、升级、兼容和下沉到前端组件库中。

---

# 6. 全局信息架构规范

## 6.1 顶层导航模型
IDP 产品统一采用：

```text
Top Bar + Left Navigation + Main Workspace + Optional Right Context + Bottom Panel
```

这是 IDP 产品族的默认壳层。

## 6.2 左侧导航规范
左侧导航用于承载：
- 业务域
- 模块入口
- 常驻导航
- Saved Views / Watchlists（可选）

禁止把左侧导航做成：
- 杂乱的功能树
- 无业务语义的技术资源树
- 每个产品都完全不同的分类方式

### 左侧导航的建议分层
- 一级：产品主域
- 二级：主功能分区
- 可选三级：轻量子模块

### 命名规则
导航命名应：
- 面向业务语义
- 尽量使用名词短语
- 避免歧义
- 避免内部技术实现名

例如：
- Shipments
- Exceptions
- Routing
- Inventory
- Waves
- Users & Roles
- Rules
- Billing Review

## 6.3 顶栏规范
所有产品顶部至少支持：
- Global Search
- Scope Switcher
- Alerts / Notifications
- User Menu

对 Workbench / Studio 类产品，建议增加：
- Command Palette
- Recent Objects
- Environment / Site / Tenant 切换

## 6.4 主工作区规范
主工作区是业务的中心，应承载：
- 列表页
- 详情工作区
- 面板页
- Studio 画布区
- Board / Timeline / Graph / Table 等视图

## 6.5 右侧上下文区规范
右侧区不是所有产品都必须有，但对于 Workspace / Studio / Monitor 类产品，强烈建议使用。

右侧区的统一结构应优先采用：

```text
1. Current Status / Selection Summary
2. Recommended Actions / Quick Actions
3. Related Objects / Properties / Context
```

## 6.6 底部面板规范
底部面板用于承载高密度辅助信息，如：
- Events
- Logs
- Cases
- Jobs
- Audit
- Comments

底部面板默认应：
- 折叠
- 可展开
- 可调整高度
- 记忆最近打开状态
- 懒加载内容

---

# 7. 页面类型规范

IDP 页面统一划分为以下几类：

## 7.1 Dashboard / Overview Page
回答“整体现在怎么样”。

适用于：
- Control Tower
- KPI 总览
- 风险分布
- 趋势视图

## 7.2 Monitor / List Page
回答“当前有哪些对象需要看/筛/查/批量处理”。

适用于：
- Shipments
- Inventory
- Tasks
- Users
- Policies
- Print Jobs

## 7.3 Workspace / Object Detail Page
回答“这个对象现在发生了什么，我该如何处理它”。

适用于：
- Shipment Workspace
- Exception Case Workspace
- Inventory Item / Location Workspace
- Billing Case Workspace

## 7.4 Studio / Editor Page
回答“我要创建/配置/设计/编排某种资产”。

适用于：
- Rule Builder
- Template Designer
- Workflow Editor
- Label Designer

## 7.5 Admin / Governance Page
回答“我要治理结构、配置、权限、关系”。

适用于：
- Tenant / Site / User / Role
- Policy 管理
- Option / Reference Data

每一类页面都应有标准布局模板，而不是每次从零设计。

---

# 8. 布局系统规范

## 8.1 栅格与密度
IDP 产品默认面向桌面端优先，采用高信息密度设计。

建议：
- 12-column grid 作为页面级栅格基准
- 组件内部使用 4pt / 8pt spacing 体系
- 提供 Comfortable 与 Compact 两种密度
- 运营 / 管理类页面默认可用 Compact
- Studio / 表单类页面默认 Comfortable

## 8.2 基础 spacing token
建议基础单位：
- 4
- 8
- 12
- 16
- 20
- 24
- 32
- 40
- 48

推荐使用场景：
- 4：超小间距，icon 与文本、badge 内边距
- 8：小间距，控件间距
- 12 / 16：标准模块内间距
- 24 / 32：模块间距
- 40 / 48：大段落 / 页面级间距

## 8.3 页面宽度与响应式原则
虽然面向桌面优先，但仍需定义响应规则：
- ≥ 1440：多面板 fully expanded
- 1280 ~ 1439：标准桌面布局
- 1024 ~ 1279：右侧上下文区可折叠
- < 1024：不推荐作为主工作端，但应提供降级布局

**裁决：** 对 Control Tower / Workbench / Studio 产品，不以移动优先为默认策略。

---

# 9. 视觉语言规范

## 9.1 总体视觉气质
IDP 产品的默认视觉气质应为：

- 专业（Professional）
- 稳定（Calm）
- 清晰（Readable）
- 可操作（Operable）
- 数据友好（Data Dense Friendly）
- 非消费级花哨（Non-Consumer Fancy）

## 9.2 主题策略
建议所有产品统一支持：
- Light Theme（默认）
- Dark Theme（可选）

### 默认主题建议
- 企业级工作台、后台、Studio 默认 Light
- Dark Theme 作为补充，不作为唯一主题

## 9.3 字体体系
建议统一采用一套系统字体策略，确保跨平台稳定。

### 字体层级建议
- Display（极少使用）
- Heading 1
- Heading 2
- Heading 3
- Body
- Body Small
- Label
- Caption
- Mono（仅技术/代码/ID/日志场景）

### 用法原则
- 数据表格主体使用 Body / Body Small
- 对象编号可用 SemiBold 或 Mono 变体
- 页面标题保持稳重，避免过度巨大化
- Studio / 技术治理产品中允许少量 Mono 字体用于 code / JSON / rule 表达

## 9.4 圆角
建议统一 token：
- 4：紧凑控件
- 6 / 8：标准卡片和按钮
- 12：大卡片 / 浮层
- 16：仅用于少量高层容器

不建议每个产品都用不同的圆角语言。

## 9.5 阴影
阴影使用要克制，重点用于：
- 浮层
- Dropdown / Menu
- Modal / Drawer
- 当前激活层级的区分

避免滥用大面积厚重阴影。

## 9.6 边框
边框在 IDP 产品中非常重要，因为数据密集场景下，边框比阴影更有利于稳定分层。

建议：
- 多使用 1px subtle border
- 卡片、表格、侧栏、面板都可通过边框区分层次
- 将边框作为企业级工作台的主要层次工具

---

# 10. 色彩系统规范

## 10.1 色彩层级
建议色彩系统分为：

### A. Brand Colors
企业品牌色和产品强调色

### B. Neutral Colors
背景、边框、文字、容器、分割线

### C. Semantic Colors
成功、信息、警告、危险、异常、SLA 风险等

### D. Product Accent Colors
产品级差异化强调色，仅作点缀

## 10.2 中性色必须统一
跨产品一致性的基础不是品牌色，而是中性色。

应统一：
- 页面背景
- 面板背景
- 表格背景
- hover 背景
- border
- disabled
- primary text
- secondary text
- tertiary text

## 10.3 状态语义色必须统一
以下语义在所有产品中应尽可能保持一致：

- Success / Healthy
- Info / In Progress
- Warning / At Risk
- Danger / Failed / Critical
- Neutral / Unknown / Inactive

### 推荐统一映射
- Green：完成、健康、成功、可用
- Blue：进行中、信息提示、中性正向
- Amber / Orange：风险、注意、接近阈值
- Red：失败、严重异常、超时、不可恢复风险
- Gray：未知、未配置、无数据、禁用、历史态

## 10.4 产品 accent 使用规范
不同产品可有不同 accent，例如：
- LOMS：偏冷静蓝 / teal
- Prism：偏仓储工业感的蓝绿 / graphite accent
- Gatekeeper：偏安全治理的紫蓝 / indigo
- RuleMesh：偏决策 / graph 感的 violet / blue
- PHI Studio：偏设计与输出的橙蓝组合

但 accent 仅用于：
- Logo / 产品标识
- 当前产品一级入口高亮
- 少量 CTA / selected state

**禁止** 用 accent 替代状态语义色。

---

# 11. 组件系统规范

## 11.1 组件层级
建议组件分为 4 层：

### A. Primitive
- Button
- Input
- Select
- Checkbox
- Radio
- Tag
- Badge
- Tooltip
- Icon

### B. Composite
- Search Bar
- Filter Bar
- Table Toolbar
- Pagination
- Tabs
- Drawer
- Side Panel
- Split View

### C. Domain Widgets
- Shipment Summary Card
- Route Chain Viewer
- Exception Queue Table
- Inventory Snapshot
- Rule Node Inspector
- Label Preview Canvas

### D. Page Templates
- Dashboard Template
- Monitor Template
- Workspace Template
- Studio Template
- Admin Template

## 11.2 Button 规范
按钮必须定义统一优先级：
- Primary
- Secondary
- Tertiary / Ghost
- Danger
- Icon Button

### 使用规则
- 一个区域通常只允许一个 Primary Action
- destructive action 禁止伪装成普通按钮
- icon-only button 必须有 tooltip / accessible label

## 11.3 Input / Filter 规范
搜索与筛选是 IDP 产品的核心能力，必须统一。

建议统一提供：
- 全局搜索框
- 列表页 Filter Bar
- 高级筛选面板
- Saved Views
- Column / Sort / Group 控制器

## 11.4 Table 规范
表格是核心组件，必须高度标准化。

### 表格统一支持
- 行 hover
- 行选中
- 列显示控制
- 排序
- 筛选
- 批量选择
- 空状态
- loading skeleton
- density 切换
- sticky header（必要时）

### 表格交互统一建议
- 单击行：选中 / 预览
- 双击行：打开对象工作区
- 右键：上下文菜单
- Shift / Cmd 选择：多选

## 11.5 Tabs 规范
统一支持两层：
- 全局 Workbench Tabs
- 页面内 Content Tabs

两种 Tabs 不可混淆，视觉层级必须不同。

## 11.6 Badge / Tag / Status Pill 规范
必须统一定义：
- status badge
- severity badge
- SLA badge
- risk badge
- object tag

原则：
- badge 表示状态
- tag 表示分类 / 属性
- 数量不宜过多
- 同一语义必须跨产品复用视觉规则

## 11.7 Drawer / Modal / Side Panel 规范
### Drawer 适合：
- 快速预览
- 辅助编辑
- 不打断主工作流的上下文操作

### Modal 适合：
- 确认
- 小型配置
- 高风险操作

### Side Panel 适合：
- 当前对象上下文
- 属性 / 检查器
- 推荐动作

---

# 12. 交互模式规范

## 12.1 Drill-down 模式
所有产品统一优先采用三种 drill-down：
- Current Context
- New Tab
- Side Preview

### 建议规则
- Monitor 页单击：预览
- Monitor 页双击：新 tab 打开对象
- 关键关联对象点击：新 tab
- 轻量查看：side preview

## 12.2 Command Palette
对于复杂产品，应统一支持 Command Palette。

它应允许：
- 跳转页面
- 打开对象
- 执行动作
- 调出 saved view
- 最近访问切换

## 12.3 全局搜索
全局搜索必须跨产品保持一致的体验模型：
- 支持对象编号搜索
- 支持模糊匹配
- 支持分组结果
- 支持 recent / pinned / recommended
- 搜索结果可直接打开为 tab

## 12.4 批量操作
表格类页面的 bulk action 交互必须一致：
- 勾选后出现批量操作栏
- 仅在选中项 > 0 时显示
- 破坏性动作要求确认
- 动作后提供 feedback 与结果摘要

## 12.5 快捷键
建议跨产品统一最少一组基础快捷键：
- `Cmd/Ctrl + K`：Command Palette
- `Cmd/Ctrl + /`：全局搜索聚焦（可选）
- `Esc`：关闭 preview / dismiss panel
- `Cmd/Ctrl + W`：关闭当前 tab（视平台策略）
- `Cmd/Ctrl + Shift + T`：恢复关闭 tab

---

# 13. 状态与反馈规范

## 13.1 Loading
必须定义统一 loading 体验：
- 页面首屏 skeleton
- 列表 skeleton
- 卡片 skeleton
- 面板局部 loading
- 按钮 loading

禁止：
- 整页反复闪烁
- 不可解释的转圈等待

## 13.2 Empty State
空状态必须区分：
- truly empty
- filtered empty
- not configured
- no permission
- data unavailable

不同空状态必须有不同文案与引导。

## 13.3 Error State
错误必须区分：
- whole page error
- widget error
- section error
- action error
- background refresh error

并尽量局部隔离，不要一个局部接口失败就让整个页面崩掉。

## 13.4 Success Feedback
操作成功反馈建议分层：
- 微交互提示（toast）
- 对象状态即时更新
- 时间线 / 审计记录体现

## 13.5 高风险操作
高风险动作应统一要求：
- 明确后果
- 二次确认
- 必要时输入确认信息
- 记录审计信息

例如：
- Delete
- Recompute and override
- Force close case
- Change permission / policy
- Bulk release / bulk cancel

---

# 14. 数据可视化规范

## 14.1 数据图表不是装饰
图表必须服务于：
- 分布判断
- 风险识别
- 趋势追踪
- Drill-down

## 14.2 图表选型原则
- 时间趋势：line / area
- 状态分布：bar / stacked bar
- 风险矩阵：heatmap
- 层级流转：timeline / sankey / flow chain（慎用）
- 节点关系：graph / route chain（仅在确有业务价值时）

## 14.3 图表交互规范
- 可 hover 获取详细信息
- 可点击 drill-down 到列表或对象
- 图表颜色遵循统一语义色
- 不允许为了“炫酷”破坏可读性

---

# 15. 对象工作区（Workspace）统一规范

这是 IDP 产品族最核心的体验模式之一。

## 15.1 对象工作区标准结构
建议统一为：

```text
Object Header
Summary Strip
Main Content Tabs
Right Context Panel
Bottom Panel
```

## 15.2 Object Header 统一要素
- 对象主编号
- 当前状态
- 风险 / 优先级 / SLA
- 负责人
- 最后更新时间
- 快速动作

## 15.3 Summary Strip 统一要素
用于展示该对象最关键的 4~6 个指标，不宜过长。

## 15.4 Main Content Tabs 统一思路
根据对象类型选择，但命名和顺序应尽量稳定。

例如：
- Summary
- Timeline
- Related
- Exceptions
- Documents
- Audit

不是每个对象都必须全有，但模式要稳定。

## 15.5 Right Context Panel 统一规则
优先展示：
1. 当前状态摘要
2. 推荐动作
3. 关联对象 / 依赖关系

## 15.6 Bottom Panel 统一规则
承载：
- Events
- Logs
- Jobs
- Audit
- Comments

---

# 16. Studio 类产品规范

Studio 与 Console 最大差异在于多面板编辑。

## 16.1 Studio 统一结构
建议：

```text
Top Bar
Left Asset / Navigator Panel
Main Canvas / Editor Area
Right Inspector / Properties Panel
Bottom Output / Validation / Preview Panel
```

### 16.1.1 Top Bar 归属信息规范（必选）

所有 Studio / Workbench / Console 的 Top Bar 或 Page Header 左侧**必须**展示产品归属信息，格式为：

```text
{产品} / IDP · {模块名称}
```

示例：
- `LOMS / IDP · Canonicalization Studio`
- `LOMS / IDP · Exception Workbench`
- `Prism / IDP · Execution Monitor`
- `RuleMesh / IDP · PolicyOps Console`

- **产品**：所属 IDP 产品（LOMS / Prism / Gatekeeper / RuleMesh / LedgerMesh / PHI 等）
- **IDP**：统一品牌标识
- **模块名称**：当前页面/工作台的业务名称

实现建议：归属信息使用 `text-muted-foreground` 或等效弱化样式，模块名称使用主色；中间用 `·` 分隔。

## 16.2 Studio 中的左右面板规则
- 左侧：资源、图层、模板、组件、节点
- 中部：主画布 / 流程编排区 / 设计区
- 右侧：属性、样式、规则、配置

## 16.3 Studio 的核心统一组件
- Canvas
- Inspector Panel
- Layer / Asset Tree
- Validation Panel
- Preview Panel
- Version / Draft Status

## 16.4 Studio 的状态规范
- draft
- published
- invalid
- unsaved changes
- locked

这些状态必须跨 Studio 产品统一。

---

# 17. Monitor / Control Tower 规范

## 17.1 Monitor 页统一结构
建议：

```text
Page Header
Filter Bar
Toolbar
Main List / Board / Timeline
Optional Preview Pane
Bottom Panel
```

## 17.2 Monitor 页视图模式规范
允许标准切换：
- Table
- Board
- Timeline
- Map / Graph（必要时）

## 17.3 Preview Pane 规范
Preview 用于轻量上下文查看，不取代完整详情页。

适合显示：
- 状态摘要
- 最近事件
- 当前风险
- 推荐动作
- 关键关联对象

---

# 18. 表单与配置页规范

## 18.1 表单布局原则
- 简单表单：单列优先
- 中等复杂度：分组分段
- 高复杂度配置：分区 + anchor navigation / tabs

## 18.2 字段说明规则
- Label 清晰
- Helper text 解释业务含义
- 校验文案说明错误原因，不只说 invalid

## 18.3 保存策略
需统一：
- 自动保存 vs 手动保存
- draft vs publish
- unsaved changes 的提示方式

Studio 与治理页尤其要统一此规则。

---

# 19. 文案与术语规范

## 19.1 术语优先级
术语必须优先使用领域统一语言（ubiquitous language），而不是设计师个人习惯。

例如：
- Shipment
- Leg
- Exception
- Recompute Route
- Inventory Snapshot
- Policy
- Role Binding

## 19.2 文案风格
整体文案风格应：
- 简洁
- 明确
- 面向业务动作
- 避免模糊词
- 避免技术黑话泛滥

## 19.3 CTA 命名规范
按钮命名优先采用动词短语：
- Create Shipment
- Assign Owner
- Retry Sync
- Recompute Route
- Publish Rule
- Resolve Case

避免：
- OK
- Submit（过于泛）
- Do It

---

# 20. 图标规范

## 20.1 图标使用原则
图标是辅助识别，不应单独承担全部语义。

建议：
- 关键导航图标配文本
- icon-only button 必须 tooltip
- 不同产品避免混用不同图标风格

## 20.2 图标风格
建议统一：
- 线性图标优先
- 风格简洁
- 粗细统一
- 避免一个系统中混用线性、填充、手绘风格

---

# 21. 可访问性规范

即使系统主要面向企业用户，也必须定义基础可访问性标准。

## 21.1 基础要求
- 颜色不作为唯一信息传递方式
- 交互控件有明确 focus state
- 键盘可导航关键流程
- 文本与背景对比度达标
- 图标按钮有 accessible name

## 21.2 数据密集型产品额外要求
- 表格键盘导航
- 行焦点态清晰
- panel 打开关闭可由键盘控制
- command/search 具备键盘支持

---

# 22. Design Token 体系建议

建议建立统一 token 层：

## 22.1 Foundation Tokens
- color
- spacing
- radius
- border
- shadow
- typography
- motion
- z-index

## 22.2 Semantic Tokens
- text.primary
- text.secondary
- bg.canvas
- bg.surface
- border.default
- status.success
- status.warning
- status.danger
- status.info
- focus.ring

## 22.3 Product Tokens
- product.loms.accent
- product.prism.accent
- product.gatekeeper.accent
- product.rulemesh.accent

**原则：** 产品 token 不能覆盖基础语义 token，只能在允许的范围内定制。

---

# 23. 动效规范

## 23.1 动效原则
动效用于：
- 强化层级切换
- 帮助理解状态变化
- 降低突兀感

不用于：
- 炫耀
- 过度复杂过场
- 妨碍高频操作

## 23.2 建议动效场景
- panel expand / collapse
- dropdown / menu
- tab open / close
- inline success feedback
- loading skeleton shimmer（克制使用）

## 23.3 高密度工作台中的动效节制
对频繁刷新、实时监控页，动效必须克制，避免视觉疲劳。

---

# 24. 前端实现与设计系统落地建议

## 24.1 三层落地
建议设计系统落地为三层：

### A. Design Handbook
本手册，定义原则与规则

### B. Figma Library / Design Assets
设计稿组件与 token 资产

### C. Frontend Component Library
前端组件库（React），沉淀为可复用组件

## 24.2 前端组件库分层
建议：
- foundation
- primitives
- composites
- domain widgets
- page templates

## 24.3 设计与前端 contract
每个组件应尽量有：
- 组件说明
- 变体定义
- 状态定义
- do / don’t
- 前端 props 约定
- 示例

---

# 25. 治理机制规范

设计系统如果没有治理，最终一定失控。

## 25.1 角色建议
- Design System Owner
- Product Designer
- Frontend Design System Maintainer
- Product Architect / PM
- Reviewer

## 25.2 变更流程
所有设计系统变更建议走轻量 ADR / RFC：
- 变更动机
- 影响范围
- 设计方案
- backward compatibility
- token / component / template 受影响项
- rollout 计划

## 25.3 版本策略
建议：
- v1 foundation
- minor 版本新增组件或变体
- major 版本处理破坏性升级

## 25.4 禁止行为
- 每个产品私自改状态色
- 每个页面自己发明按钮层级
- 不走设计系统直接定制表格、tabs、filter bar
- 在没有评审的情况下引入大量新交互模式

---

# 26. 跨产品一致性裁决规则

当出现“某产品想特殊化”的需求时，按以下顺序判断：

## 26.1 第一问：是否真的是领域特有问题？
如果不是，就应复用通用模式。

## 26.2 第二问：是否能通过产品 token 或 domain widget 解决？
如果能，就不应破坏基础设计系统。

## 26.3 第三问：是否会损害用户跨产品迁移体验？
如果会，应谨慎。

## 26.4 第四问：是否值得升级为全产品族模式？
如果这个模式未来多个产品都可能用，应沉淀为系统规范。

---

# 27. LOMS / Prism / 其他产品的统一示例

## 27.1 LOMS 与 Prism
虽然领域不同，但以下模式应保持一致：
- Monitor 页结构
- Workspace 页结构
- 状态 badge 语义
- 右侧上下文区结构
- 底部 panel 结构
- 全局搜索 / command / recent objects

## 27.2 Gatekeeper 与 LedgerMesh
虽然偏治理 / 结算，但仍应保持一致：
- Admin 页面布局
- 表格交互
- form / modal / drawer 规则
- 空状态 / 错误态 / toast 规则

## 27.3 RuleMesh / PHI Studio
虽然属于 Studio 类，但应保持一致：
- Shell 结构
- 左资源 / 中画布 / 右属性模式
- Save / Publish / Validation 语义
- Inspector 样式
- 底部输出面板规范

---

# 28. 首批必须冻结的规范清单（P0）

建议优先冻结以下 12 项：

1. 全局 Shell 结构
2. 左侧导航规则
3. Top Bar 规则
4. 页面类型模板
5. Button / Input / Table / Tabs / Badge 规范
6. 状态语义色
7. Typography / spacing / radius / border token
8. Workspace 标准结构
9. Monitor 标准结构
10. Studio 标准结构
11. Loading / Empty / Error / Success 规则
12. 设计治理流程

只有这 12 项冻结，产品族一致性才真正有基础。

---

# 29. 最终裁决

IDP 的 UX/UI 规范不应理解为“做一套漂亮组件”，而应理解为：

**为整个产品族建立一套统一的体验操作系统。**

它必须同时解决：
- 跨产品一致性
- 数据密集型工作场景
- 复杂对象与流程
- 监控、工作台、Studio、治理四种形态
- 设计与前端协作
- 长期治理与演进

因此，这份手册的最终目标是让未来的 LOMS、Prism、Gatekeeper、RuleMesh、LedgerMesh、PHI、Sagapai 等产品，即使领域不同，也能让用户感受到：

- 同一家公司出品
- 同一套工作方式
- 同一套交互逻辑
- 同一套状态语言
- 同一套专业气质

这才是设计系统真正的价值。

---

# 30. 下一步建议

最合理的后续产物有：

1. **Design Token 详细定义文档**
2. **核心组件规范手册（Button / Table / Tabs / Filter Bar / Workspace Shell）**
3. **Figma 信息架构与页面模板规范**
4. **前端 React 组件库分层与目录规范**
5. **LOMS / Prism / PHI Studio 三个产品的适配示例**

如果按实施顺序，建议下一步直接完成：

**Design Token 详细定义文档**

因为 token 是后续 UI 视觉统一、Figma 资产统一、前端组件统一的基础。

