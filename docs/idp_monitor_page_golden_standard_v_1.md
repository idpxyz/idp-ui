# IDP Monitor Page Golden Standard

**Version:** v1.0  
**Status:** Draft / Golden Standard Candidate  
**Scope:** IDP 产品族 Monitor / List / Queue / Control List 页面标准模板  
**Audience:** Product Design, UX, UI, Frontend, Design System, PM, Product Architect  

---

# 1. 文档目的

本文基于当前 LOMS Monitor 页设计演进结果，正式定义 IDP 产品族的 **Monitor Page 黄金标准模板**。

本模板不是单一产品页面，而是未来以下页面的统一母版：

- LOMS Shipment Monitor
- LOMS Orders Monitor
- LOMS Fulfillment Monitor
- LOMS Exception Queue
- Prism Inventory Monitor
- Prism Task / Wave Monitor
- Gatekeeper User / Role / Policy List
- LedgerMesh Billing Case Monitor
- Carrier Ops Incident Monitor
- 其他所有以“列表 + 筛选 + 批量动作 + drill-down”为核心的工作页

本模板的目标是解决：

- 跨产品页面结构不一致
- 列表页控制器位置不稳定
- 高密度数据页缺少统一骨架
- 过滤、表格、底部事实面板各自为政
- 无法将 Light Theme 与 Workbench 模式真正标准化

最终目标是建立：

**IDP 产品族统一的 Monitor / List / Queue 页设计母版。**

---

# 2. 页面定义

## 2.1 什么是 Monitor Page

Monitor Page 是 IDP 产品中的核心工作页之一，用于回答：

- 当前有哪些对象需要查看
- 哪些对象需要优先处理
- 如何快速筛选、排序、分组、批量处理
- 如何 drill-down 到对象工作区
- 如何在不离开列表上下文的情况下查看事实、事件、异常与审计

它不同于：

- Dashboard：回答“整体发生了什么”
- Workspace：回答“这个对象具体发生了什么”
- Studio：回答“我要配置/设计/编排什么”
- Admin Form：回答“我要编辑什么配置”

因此，Monitor Page 本质上是：

**企业级高密度对象监控与处理入口。**

---

# 3. Monitor Page 设计哲学

## 3.1 核心价值不是展示，而是操作效率

Monitor Page 不是报表页面，也不是静态列表，它必须服务于：
- 搜索
- 筛选
- 扫读
- 比较
- 排序
- 批量处理
- drill-down
- 快速回跳

## 3.2 视觉必须克制，但结构必须强

Monitor Page 不能花，但必须稳。

它应体现：
- 高信息密度
- 强结构感
- 快速扫读
- 低认知噪声
- 明确的工作流入口

## 3.3 Monitor Page 是 Workspace 的前室

它的任务不是把详情全塞进列表，而是：
- 让用户找到目标对象
- 建立对象优先级
- 提供轻量预览
- 再进入对象 Workspace

## 3.4 Light Theme 必须优先服务于长期使用

默认 Light Theme 应做到：
- 不刺眼
- 不漂白
- 有层级
- 有骨架
- 长时间操作不累

---

# 4. 黄金标准页面结构

## 4.1 最终固定结构

Monitor Page 固定采用以下五区结构：

```text
Top Bar
Left Navigation
Workbench Tabs
Main Monitor Workspace
Bottom Panel
```

其中 Main Monitor Workspace 再细分为：

```text
Page Header / Breadcrumb
Filter Bar
Optional Facet / Saved View Area
Main Table / Board / Timeline Area
Pagination / Footer
```

## 4.2 页面骨架总图

```text
┌ Top Bar ───────────────────────────────────────────────────────────────┐
├ Left Nav ┬ Workbench Tabs ────────────────────────────────────────────┤
│          ├ Page Header / Breadcrumb                                   │
│          ├ Filter Bar                                                 │
│          ├ Main Content: Table / Board / Timeline                     │
│          ├ Footer / Pagination                                        │
├──────────┴ Bottom Panel: Events / Logs / Cases / Jobs / Audit / ... ─┤
└───────────────────────────────────────────────────────────────────────┘
```

## 4.3 明确禁止

Monitor Page 禁止默认引入以下结构：
- 双右栏上下文重复
- 超长表单式筛选区
- 与 Workspace 混淆的详情堆叠页
- 卡片瀑布流式列表
- 大面积无业务意义的图表背景装饰

---

# 5. Top Bar 黄金标准

## 5.1 职责

Top Bar 承担全局能力，不承载当前列表页局部业务细节。

## 5.2 必备模块

### A. Product / Global Navigation
- Operations
- View
- Reports
- Admin
- Help

或按产品组做轻量调整，但结构位置一致。

### B. Global Search
用于跨对象搜索：
- shipment
- order
- case
- policy
- user
- rule
- billing item

### C. Scope Switchers
至少支持：
- Tenant
- Network / Site / Region
- Time Context（必要时）

### D. Global Utility Zone
- Alerts
- Notifications
- Layout / panel toggle（如需要）
- User menu / persona

## 5.3 规范
- Top Bar 高度固定
- 全产品位置一致
- 不在这里塞当前页面的业务筛选项
- 全局搜索永远在稳定位置

---

# 6. Left Navigation 黄金标准

## 6.1 结构

Left Navigation 固定分为两层：

### A. My Work
- Saved Views
- Recent Objects
- Watchlists
- My Queues

### B. Business Navigation
- Overview
- Operations
- Management
- Admin

具体二级项按产品变化，但一级区块逻辑保持一致。

## 6.2 语义要求
- 不使用 `Explorer`
- 不做文件资源树语义
- 必须体现“我的工作入口 + 业务入口”

## 6.3 图标栏（最窄 rail）规则

如保留最左窄 rail，必须明确其职责是：
- 一级模式切换
或
- 全局快捷入口

不能只是装饰性保留。  
若无明确价值，应弱化甚至移除。

## 6.4 宽度与层级
- 主导航宽度固定
- 当前激活项高亮明确
- section title 不应喧宾夺主

---

# 7. Workbench Tabs 黄金标准

## 7.1 Monitor Page 中的角色

在 Monitor Page 中，Workbench Tabs 用于承载：
- 静态页面
- Monitor 页面
- 已打开的对象 Workspace 页面

## 7.2 当前页在 Tabs 中的显示
Monitor 当前页必须在 tabs 中有稳定位置，例如：
- Shipment Monitor
- Orders
- Fulfillment
- Operations Dashboard

## 7.3 规范
- 当前激活 tab 必须明确高亮
- tab 之间间距和高度统一
- tabs 与 Top Bar、Filter Bar 之间分层清楚
- Monitor 页 tabs 与对象 Workspace tabs 共用同一 workbench 体系

## 7.4 需要避免的问题
- tabs 太像普通网页二级导航
- 当前 tab 激活态不够强
- tab 太轻，无法形成 workbench 感

---

# 8. Page Header / Breadcrumb 黄金标准

## 8.1 作用

用于表达：
- 当前页面在业务体系中的位置
- 当前列表页标题
- 必要时的对象域上下文

## 8.2 规则
- 面包屑轻量，不喧宾夺主
- 页面标题可弱化为 breadcrumb + tab 双重表达
- 不要在 Monitor 页头部堆叠过多 KPI 卡片

## 8.3 典型形式
- `Operations > Orders`
- `Operations > Shipment Monitor`
- `Management > Billing`

---

# 9. Filter Bar 黄金标准

## 9.1 定位

Filter Bar 是 Monitor Page 的控制中枢。  
它必须标准化，而不是每页自由发挥。

## 9.2 最终标准结构

```text
Search Zone
Primary Filters
View / Group / Sort Controls
Saved View Controls
More Filters Entry
```

## 9.3 P0 最低可见结构
即使当前功能暂不完整，也应保留视觉占位和结构位置：
- Search
- Status
- Sort
- View Mode
- More Filters

## 9.4 搜索框规则
- placeholder 明确
- 支持对象编号 /关键词搜索
- 宽度足够
- 位置固定在左侧优先

## 9.5 主过滤器规则
高频过滤器前置，例如：
- Status
- Owner
- Carrier
- Site
- Severity
- SLA Window

## 9.6 More Filters
低频过滤器统一进入 More Filters / Advanced Filters，不平铺整行。

## 9.7 Saved View
建议长期固定支持：
- save current view
- update existing view
- switch saved view
- set default

## 9.8 黄金标准裁决
即使暂时只有 Search + Status，视觉上也必须按完整 Filter Bar 模板来做，不能像“只有两个孤立控件”。

---

# 10. Main Content 黄金标准

## 10.1 默认视图
默认必须是 **Table View**。

原因：
- 最适合高密度扫读
- 最适合批量处理
- 最适合运营系统
- 最容易跨产品复用

## 10.2 可选视图
视业务需要，Monitor 页可以扩展：
- Board View
- Timeline View
- Map / Graph View

但这些是补充视图，不应替代表格作为默认。

## 10.3 表格容器规则
表格必须放在明确的 `surface container` 中，而不是直接漂在页面背景上。

## 10.4 表格区必须尽量“吃满空间”
Monitor 页中，主表格应成为绝对主体。

### 禁止
- 大量无意义底部留白
- 过度收缩只显示少量行
- 下方空白大于实际数据区视觉重量

## 10.5 分页与页脚
分页应稳定在主表格底部，而不是漂浮不定。

---

# 11. Table 黄金标准（Monitor 场景）

## 11.1 行为规则
- 单击：选中 / 更新上下文预览（如有）
- 双击：打开对象 Workspace 新 tab
- 右键：上下文菜单（P1）
- 多选：激活批量操作

## 11.2 列规则
列应优先包含：
- Identity
- Status
- Key business context
- Time
- Numeric / cost / quantity
- Related object links

## 11.3 状态列规则
状态 badge 必须可扫读、统一、克制。

## 11.4 关联对象列规则
如 shipment refs、case refs、policy refs，可用 link / pill / compact link cluster。

## 11.5 密度
P0 应支持：
- Comfortable
- Compact

Monitor 页默认推荐：**Compact 或偏紧凑 Comfortable**。

---

# 12. Bottom Panel 黄金标准

## 12.1 角色
Bottom Panel 是 Monitor Page 的 **事实面板 / 系统面板**，而不是普通附属 tabs。

## 12.2 标准内容
固定优先支持：
- Events
- Logs
- Cases
- Jobs
- Audit
- Comments

## 12.3 作用
用于承载：
- 当前列表上下文相关的事件流
- 当前筛选结果对象的系统事实
- 运营、集成、审计、协作信息

## 12.4 视觉与层级
Bottom Panel 应采用更 `sunken` 的 surface 层，和主表格区形成明确分层。

## 12.5 行为
- 默认折叠或半展开
- 高度可调
- 内容懒加载
- 记忆最近打开 tab
- 与当前 Monitor 上下文绑定

## 12.6 黄金标准裁决
Bottom Panel 必须看起来像系统事实区，而不是“第二个普通内容块”。

---

# 13. Light Theme 黄金标准

## 13.1 当前问题总结
普通企业后台常见失败点：
- 页面过白
- 所有 surface 一样亮
- 边界不清
- 层次不明显
- 列表页像 Excel 截图

## 13.2 黄金标准目标
IDP Monitor Light Theme 必须做到：
- 干净但不漂
- 稳定但不沉闷
- 层级清楚但不过度依赖阴影
- 长时间使用不累

## 13.3 四层 surface 模型
必须固定为：

### Layer 1: Canvas
整页背景

### Layer 2: Surface
主内容、表格容器、普通卡片

### Layer 3: Elevated Surface
dropdown、menu、抽屉、当前激活高层容器

### Layer 4: Sunken Surface
bottom panel、输入内区、次级嵌套区

## 13.4 最终裁决
Monitor 页若想达到 10 分，不能靠加颜色，而要靠：
- surface 层差
- border 系统
- typography hierarchy
- spacing discipline

---

# 14. 留白与空间分配黄金标准

## 14.1 Monitor 页空间原则
主工作区应优先分配给：
- 表格内容
- 视图本体

而不是：
- 过高的页头
- 冗余说明区
- 过大底部空白

## 14.2 留白不是越多越高级
对于高密度 Monitor 页，黄金标准不是“大留白”，而是：
- 精准 spacing
- 稳定栅格
- 行高合理
- 区块分隔明确

## 14.3 当前最重要的优化点
当列表数据行数较少时，应减少“主表格到底部 panel 之间的大空白感”。

可通过：
- 提高默认可见行数
- 收紧主表格底部空白
- 调整 bottom panel 默认高度
- 更明确表格区容器边界

来改善。

---

# 15. 状态语义黄金标准

## 15.1 必须严格分层
Monitor 页中最容易失控的就是状态标签。  
最终必须区分：

### A. Lifecycle Status
如：
- Created
- Processing
- Confirmed
- Shipped
- Delivered
- Pending

### B. SLA Status
如：
- On Track
- At Risk
- Breached

### C. Risk Level
如：
- Low
- Medium
- High
- Critical

### D. Severity
如：
- Minor
- Major
- Critical

### E. Flags / Tags
如：
- Open Case
- Customs Required
- Multi-leg

## 15.2 当前 Orders Monitor 的适用范围
当前这页主要展示的是 **Lifecycle Status**，因此可以暂不混入其他 badge。  
但设计系统层必须预先定义好分层，以免未来扩展时混乱。

---

# 16. 10 分版 Monitor Page 最终规则

下面是最终必须冻结的规则。

## Rule 1
**Monitor 页不使用双右栏上下文结构。**

## Rule 2
**Filter Bar 必须标准化，即使功能未完整，也要按完整模板布局。**

## Rule 3
**Main Table 必须成为主视觉中心。**

## Rule 4
**Bottom Panel 必须是系统事实区，而不是普通附属内容区。**

## Rule 5
**Light Theme 必须通过 surface 层级和 border 建立骨架，不依赖厚阴影。**

## Rule 6
**Left Navigation 永远是“我的工作入口 + 业务入口”，不是 Explorer。**

## Rule 7
**Workbench Tabs 必须有真正的激活态，不可像轻飘网页 tabs。**

## Rule 8
**状态 badge 必须按语义分层设计，不能混用。**

## Rule 9
**Monitor 页优先解决操作效率，不追求装饰性。**

## Rule 10
**该模板必须可一键迁移到 LOMS / Prism / Gatekeeper / LedgerMesh。**

---

# 17. 跨产品复用映射

## 17.1 LOMS
直接适用：
- Shipment Monitor
- Orders
- Fulfillment
- Exceptions
- Carrier Ops Queue

## 17.2 Prism
直接适用：
- Inventory Monitor
- Receiving Queue
- Putaway Task List
- Picking / Packing Task Queue
- Exception Queue

## 17.3 Gatekeeper
直接适用：
- User List
- Role List
- Policy List
- Access Review Queue

## 17.4 LedgerMesh
直接适用：
- Billing Case Monitor
- Dispute Queue
- Settlement Review List

## 17.5 PHI / Studio 后台管理部分
适用于：
- Template List
- Print Job Monitor
- Device Queue

---

# 18. 与 Workspace / Studio 的边界

## 18.1 不能把 Monitor 做成 Workspace
Monitor 页不负责承载完整对象处理。

## 18.2 不能把 Studio 套进 Monitor 模板
Studio 的主任务是设计 / 编排 / 配置，不是列表监控。

## 18.3 最终边界
- Monitor：找对象、筛对象、比较对象、批量处理、drill-down
- Workspace：处理单对象
- Studio：设计或编排资产

---

# 19. 逐区块精修建议（针对当前设计）

## 19.1 Top Bar
- 保持当前总体方向
- 进一步强化全局搜索与 scope 的稳定位置
- icons 间距收紧，减少漂浮感

## 19.2 Left Navigation
- `MY WORK` 方向正确
- section title 可再弱一点
- 当前高亮项可以再更稳、更明确
- 最左窄 rail 需进一步明确职责或弱化

## 19.3 Workbench Tabs
- 当前比上一版好，但激活态还可以更强
- tab 的上下边界与 filter bar 分层应更清晰

## 19.4 Filter Bar
- 当前仍偏薄
- 建议补足结构：Search / Status / Sort / View / More Filters / Saved View
- 即使部分先 disabled，也要先定模板

## 19.5 Main Table
- 方向正确
- 可见行数建议增加或收紧下方无效留白
- 容器边界可再强一点，形成更稳的工作面

## 19.6 Bottom Panel
- 保留
- 进一步做成 sunken system panel
- tabs 区可更像系统面板标签而不是普通文本导航

---

# 20. P0 冻结建议

建议先冻结以下内容：

1. Monitor Page 固定五区骨架
2. Left Nav 结构
3. Workbench Tabs 规则
4. Filter Bar 结构模板
5. Table 默认行为
6. Bottom Panel 标准内容与行为
7. Light Theme 四层 surface 模型
8. 状态 badge 分层模型
9. 留白与空间分配规则
10. 跨产品适配边界

---

# 21. 最终裁决

IDP 的 Monitor Page 不应再被理解成“一个列表页”，而应被定义为：

**企业级 Control Tower / Workbench 系统中的标准监控与处理入口。**

它的核心价值在于：
- 统一跨产品操作方式
- 为高密度列表场景建立稳定母版
- 让用户在不同产品中迁移成本极低
- 成为 Dashboard 与 Workspace 之间最重要的中间层

这就是它作为黄金标准页的真正意义。

---

# 22. 下一步建议

最合理的后续产物有：

1. **IDP_Workspace_Page_Golden_Standard_v1**
2. **IDP_Studio_Page_Golden_Standard_v1**
3. **IDP_Light_Theme_Surface_Refinement_Guide_v1**
4. **LOMS / Prism / Gatekeeper Monitor Page Adaptation Examples**
5. **Monitor Page Figma Layout Spec**

如果按实施顺序，建议下一步直接完成：

**IDP_Workspace_Page_Golden_Standard_v1**

因为 Monitor 页和 Workspace 页是整个产品族最核心的两张母版页面。

