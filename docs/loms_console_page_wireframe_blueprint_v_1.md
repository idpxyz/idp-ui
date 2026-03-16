# LOMS Console 页面级线框蓝图

**Version:** v1.0  
**Scope:** P0 核心页面  
**Audience:** Product / UX / UI / Frontend / Domain Architect  
**Design Baseline:** Workbench + Control Tower  

---

# 1. 目标

本文给出 LOMS Console 的页面级线框蓝图，覆盖 4 个最关键页面：

1. Console Home / Operations Dashboard
2. Shipment Monitor
3. Shipment Detail Workspace
4. Exception Workbench

目标不是输出高保真视觉稿，而是给出：

- 页面布局骨架
- 区块职责
- 组件清单
- 页面内导航与跳转关系
- 关键交互模式
- 状态与异常态设计
- 前后端拆分建议

---

# 2. 全局壳层（适用于全部页面）

## 2.1 总体布局

```text
┌────────────────────────────────────────────────────────────────────┐
│ Top Bar: Search | Command | Scope | Alerts | User                 │
├──────────────┬──────────────────────────────────────┬──────────────┤
│ Left Nav     │ Main Workspace                       │ Right Context│
│ Business IA  │ Page Content / Tabs / Views         │ Optional      │
├──────────────┴──────────────────────────────────────┴──────────────┤
│ Bottom Panel: Events | Logs | Cases | Jobs | Audit                │
└────────────────────────────────────────────────────────────────────┘
```

## 2.2 全局固定能力

### Top Bar
- Global Search
- Command Palette
- Scope Switcher
- Alert Center
- Recent Objects
- User Menu

### Left Navigation
- Overview
- Orders
- Fulfillment
- Shipments
- Legs
- Routing
- Exceptions
- Carrier Ops
- Billing
- Reports
- Admin

### Bottom Panel
- Events
- Logs
- Exceptions
- Jobs
- Audit

### Global UX Rules
- 所有业务对象支持在新标签页打开
- 所有关联对象支持一跳打开
- 所有列表支持 saved views
- 所有关键告警支持 drill-down
- 所有状态变化支持 timeline 追踪

---

# 3. 页面 01：Console Home / Operations Dashboard

## 3.1 页面目标

这是运营总入口，用于回答：

- 现在网络整体是否健康
- 今天哪里在积压
- 哪些 SLA 风险最高
- 哪些 carrier / node 出现故障
- 我下一步应该关注什么

## 3.2 页面布局

```text
┌────────────────────────────────────────────────────────────────────┐
│ Header: Page Title | Date Range | Scope | Refresh | Save View     │
├────────────────────────────────────────────────────────────────────┤
│ KPI Strip: Active Shipments | Delayed | At Risk | Open Cases ...  │
├───────────────────────┬────────────────────────────────────────────┤
│ Left Column           │ Main Center                                │
│ - My Queues           │ - Network Health Map / Flow Overview       │
│ - Critical Alerts     │ - SLA Heatmap                              │
│ - Saved Views         │ - Workload Trend                           │
├───────────────────────┼────────────────────────────────────────────┤
│ Lower Left            │ Lower Center                               │
│ - Carrier Status      │ - Top Delay Reasons                        │
│ - Job Failures        │ - Aging Queue / Exception Distribution     │
├───────────────────────┴────────────────────────────────────────────┤
│ Bottom Drill Panels: alert detail / selected widget expansion      │
└────────────────────────────────────────────────────────────────────┘
```

## 3.3 组件清单

### A. KPI Strip
建议卡片：
- Active Shipments
- Delayed Shipments
- At-Risk Shipments
- Open Exceptions
- Carrier Incidents
- Jobs Failed in Last 1h
- Avg Lead Time
- SLA Breach Today

### B. My Queues
- My unassigned cases
- My overdue cases
- My monitored shipments
- My saved watchlists

### C. Critical Alerts
- Carrier API down
- Route compute backlog
- Tracking stale > X hours
- Exception SLA breach in 30 min

### D. Network Health View
可以是：
- Network map
- Node-to-node flow view
- Region cards
- Lane performance matrix

### E. SLA Heatmap
维度建议：
- Node x Time bucket
- Carrier x Service level
- Country x Promise window

### F. Top Delay Reasons
- customs hold
- carrier scan missing
- handoff delay
- route mismatch
- address issue
- booking failure

## 3.4 关键交互

- 点击 KPI 卡片 → 打开对应过滤后的 Shipment Monitor
- 点击 Carrier Incident → 跳到 Carrier Ops
- 点击异常分布图 → 打开 Exception Workbench 对应队列
- 点击 Network 节点 → Drill into node-level shipment queue
- 保存当前筛选条件为 Saved View

## 3.5 推荐默认视图

按 persona 提供：
- Operations Controller Dashboard
- Exception Specialist Dashboard
- Carrier Ops Dashboard
- Supervisor Dashboard

## 3.6 空状态 / 异常状态

### 空状态
- 当前筛选下无数据
- 提供重置筛选与推荐 Saved Views

### 异常状态
- 某些 widget 数据加载失败
- 仅 widget 局部报错，不阻塞整页
- 提供 refresh 与 inspect detail

---

# 4. 页面 02：Shipment Monitor

## 4.1 页面目标

这是最核心的 operational list 页面，用于：

- 查询与筛选 Shipment
- 按风险、状态、carrier、lane、site 监控
- 快速批量处理
- 打开 shipment 详情工作台

## 4.2 页面布局

```text
┌────────────────────────────────────────────────────────────────────┐
│ Header: Shipment Monitor | Scope | Saved View | Export            │
├────────────────────────────────────────────────────────────────────┤
│ Filter Bar: Search | Status | Risk | Carrier | Node | Time ...    │
├────────────────────────────────────────────────────────────────────┤
│ Secondary Toolbar: Group | Sort | Columns | Bulk Action | View    │
├───────────────────────┬────────────────────────────────────────────┤
│ Left Side Panel       │ Main Grid / Board / Timeline              │
│ - Saved Views         │                                            │
│ - Watchlists          │                                            │
│ - Facet Summary       │                                            │
├───────────────────────┼────────────────────────────────────────────┤
│ Optional Preview Pane │ Table row preview / mini timeline          │
└───────────────────────┴────────────────────────────────────────────┘
```

## 4.3 视图模式

### A. Table View（默认）
列建议：
- Shipment No
- Order Ref
- FR No
- Current Status
- Current Leg
- Carrier
- Lane
- Last Event Time
- ETA / Promise
- Risk Level
- Open Exception Count
- SLA Remaining
- Owner

### B. Board View
按以下维度切换：
- by Status
- by Risk Level
- by Carrier
- by Region
- by Node

### C. Timeline View
适合查看：
- 即将超时对象
- 按 promised time 排布
- today execution load

## 4.4 过滤器体系

### 基础过滤器
- Shipment No
- Tracking No
- Customer Ref
- Order No

### 业务过滤器
- Shipment Status
- Leg Status
- Exception Status
- Carrier
- Service Level
- Origin / Destination Region
- Current Node
- Tenant / Client / Site

### 风险过滤器
- At risk
- SLA < 2h
- No tracking update > Xh
- Cost anomaly suspected
- Handoff pending too long

## 4.5 行级交互

每行支持：
- 单击：在右侧预览
- 双击：打开 Shipment Detail Workspace
- 右键：上下文动作菜单
- 新标签打开
- Pin 到 watchlist

## 4.6 批量动作

建议支持：
- Assign owner
- Add tag
- Add to watchlist
- Export selection
- Trigger resync
- Recompute route
- Escalate

## 4.7 右侧预览面板内容

显示选中 shipment 的：
- status summary
- current leg
- latest exception
- recent 5 events
- next recommended action
- quick open actions

## 4.8 状态设计

### Loading
- 表格 skeleton
- facet count skeleton

### Partial Failure
- 某些 facet 加载失败不影响主 grid

### No Result
- 提供 clear filters
- 提供常用视图快捷入口

---

# 5. 页面 03：Shipment Detail Workspace

## 5.1 页面目标

这是 LOMS 最重要的业务对象页面，用于完整回答：

- 这个 shipment 当前处于什么状态
- 它的 route chain 是怎样的
- 当前 active leg 是哪一段
- 最近发生了什么
- 是否存在异常和 SLA 风险
- 操作员下一步该做什么

## 5.2 页面布局

```text
┌────────────────────────────────────────────────────────────────────┐
│ Object Header: Shipment No | Status | Risk | SLA | Quick Actions  │
├────────────────────────────────────────────────────────────────────┤
│ Summary Strip: Carrier | Active Leg | Promise | Owner | Cost      │
├──────────────────────────────┬─────────────────────────────────────┤
│ Main Content Tabs            │ Right Context Panel                │
│                              │ - Status Summary                   │
│ [Summary] [Timeline]         │ - Recommended Actions              │
│ [Route Chain] [Tracking]     │ - Related Objects                  │
│ [Exceptions] [Docs] [Audit]  │ - Alerts / SLA                     │
├──────────────────────────────┴─────────────────────────────────────┤
│ Bottom Panel: Events | Logs | Jobs | Audit                         │
└────────────────────────────────────────────────────────────────────┘
```

## 5.3 对象头（Object Header）

必须显示：
- Shipment No
- Current Status
- Sub-status
- Risk badge
- SLA badge
- Current owner
- Last updated time

快速动作：
- Re-sync tracking
- Open linked case
- Assign owner
- Recompute route
- Add note
- Escalate
- Open raw facts

## 5.4 Summary Tab

内容建议：

### A. Basic Info
- Shipment No
- Order Ref
- FR Ref
- Service level
- Incoterm / channel if relevant

### B. Origin / Destination
- ship-from
- ship-to
- destination region
- network / lane

### C. Current Execution Snapshot
- current leg
- current node
- last milestone
- latest carrier event
- next expected milestone

### D. Cost / Promise Snapshot
- expected cost
- actual known cost
- promise window
- expected delivery
- variance indicators

## 5.5 Route Chain Tab

展示 route / leg chain：

```text
Origin Node -> Leg 1 -> Handoff Node -> Leg 2 -> Destination Node
```

每段 leg 卡片显示：
- leg no
- leg type
- carrier
- origin node
- destination node
- status
- planned time window
- actual milestone times
- dwell time

支持：
- 展开某个 leg
- 一跳打开 leg detail
- 对比 planned vs actual

## 5.6 Timeline Tab

统一展示按时间排序的关键事件：
- internal domain events
- carrier normalized events
- manual operations
- case actions
- retry / recovery actions

每条 timeline item 建议显示：
- event type
- source
- timestamp
- object reference
- actor
- short description
- anomaly marker if any

## 5.7 Tracking Tab

区分两层：

### Normalized Tracking
给业务用户看的清洗后轨迹：
- Picked up
- In transit
- Arrived at node
- Out for delivery
- Delivered
- Exception

### Raw Carrier Events
给高级用户和实施支持看的原始事实：
- original code
- original description
- provider timestamp
- mapped normalized event

## 5.8 Exceptions Tab

展示：
- open cases
- closed cases
- severity
- owner
- root cause category
- SLA due
- latest action

支持：
- 新建 case
- 关联 case
- 打开 case workspace
- 执行 recommended action

## 5.9 Documents Tab

展示：
- label
- manifest
- customs doc
- POD
- attachments

支持：
- preview
- download
- version history

## 5.10 Audit Tab

展示：
- state changes
- manual edits
- assignment changes
- action history
- source channel

## 5.11 右侧上下文面板

### Status Summary
- Current state
- Time in state
- SLA remaining
- risk score

### Recommended Actions
- Resync tracking
- Assign case
- Retry booking
- Escalate to carrier ops
- Confirm manual override

### Related Objects
- Order
- FR
- active leg
- linked case
- billing item
- route decision record

### Alerts
- tracking stale
- leg dwell too long
- expected breach in 45 min
- carrier incident impacts this shipment

## 5.12 页面内交互重点

- 标签页之间切换不刷新对象上下文
- 点击 leg → 新标签页打开 Leg Detail 或在侧边展开
- timeline 和 tracking 可以联动高亮
- bottom panel 与 tab context 联动，例如查看当前 shipment 的 logs

## 5.13 空状态 / 异常状态

### 数据缺失
- 无 tracking
- 无 route chain
- 无 cost facts
- 需要明确标识“unknown / pending / unavailable”

### 集成异常
- 某一 provider facts 无法读取
- 只影响 raw facts 区，不影响 summary

---

# 6. 页面 04：Exception Workbench

## 6.1 页面目标

这是异常处理核心页面，用于：

- 处理 open cases
- 排序优先级
- 快速诊断根因
- 执行修复动作
- 跟踪 case 生命周期

## 6.2 页面布局

```text
┌────────────────────────────────────────────────────────────────────┐
│ Header: Exception Workbench | Queue | SLA View | Save View        │
├────────────────────────────────────────────────────────────────────┤
│ Filter Bar: Severity | Status | Owner | Type | Due Window ...     │
├───────────────────────┬────────────────────────────┬───────────────┤
│ Queue Panel           │ Case Investigation Panel   │ Action Panel  │
│ - case list           │ - case summary             │ - assign       │
│ - sort by SLA         │ - linked objects           │ - retry        │
│ - group by reason     │ - timeline                 │ - escalate     │
│ - bulk select         │ - facts / root cause       │ - resolve      │
├───────────────────────┴────────────────────────────┴───────────────┤
│ Bottom: linked logs / events / audit / comments                    │
└────────────────────────────────────────────────────────────────────┘
```

## 6.3 Queue Panel

列表字段建议：
- Case ID
- Severity
- Object Type
- Object Ref
- Reason Category
- Status
- Owner
- Age
- SLA Due
- Next Action Due

支持分组：
- by Severity
- by Reason
- by Owner
- by Carrier
- by Node

## 6.4 Investigation Panel

### A. Case Summary
- reason category
- symptom summary
- impact scope
- linked shipment / leg / FR
- first detected time

### B. Timeline
- case created
- alert raised
- first assignment
- retries executed
- escalations
- resolution / closure

### C. Linked Facts
- shipment current state
- active leg
- last tracking event
- carrier integration status
- related incidents

### D. Root Cause Hints
系统可推荐：
- likely missing scan
- provider booking timeout
- handoff confirmation absent
- customs hold suspected
- manual intervention required

## 6.5 Action Panel

动作按类别分层：

### Ownership
- assign to me
- assign to team member
- transfer queue

### Recovery
- re-sync tracking
- retry booking
- retry manifest
- recompute route
- create manual leg

### Escalation
- escalate to carrier ops
- escalate to supervisor
- notify stakeholder

### Resolution
- mark resolved
- close as duplicate
- suppress noise
- add resolution note

## 6.6 推荐交互

- 上下方向键快速切换 case
- 切换 case 不丢失筛选条件
- 常用动作支持快捷键
- resolve 前要求 resolution code
- 可展开 linked shipment mini preview

## 6.7 批量处理能力

支持：
- assign selected
- suppress duplicate alerts
- bulk resync
- bulk tag
- bulk export

## 6.8 状态与保护

### 高风险保护
- critical case resolve 需要备注
- bulk action 需要 summary preview
- destructive action 需要二次确认

### 协同保护
- case 正被他人处理时提示 lock / active editor
- 显示最后编辑者与编辑时间

---

# 7. 跨页面对象导航规则

## 7.1 Drill-down 规则

- Dashboard KPI → Shipment Monitor
- Shipment row → Shipment Detail Workspace
- Shipment Detail exception badge → Exception Workbench / specific case
- Route Chain leg card → Leg Detail
- Carrier alert → Carrier Ops incident detail

## 7.2 打开方式规则

- 默认：当前页面 drill-down
- 用户可选择：在新标签页打开
- 高价值对象：始终支持 pin tab

## 7.3 Breadcrumb 建议

示例：

```text
Overview / Shipment Monitor / SHP-240316-001 / Exceptions / CASE-8892
```

但 breadcrumb 只做辅助，不替代 tab 导航。

---

# 8. 组件级设计规范建议

## 8.1 状态徽标

必须统一设计：
- shipment status badge
- exception severity badge
- SLA urgency badge
- risk badge

## 8.2 时间展示

统一显示：
- absolute time
- relative time
- timezone context

示例：
- 2026-03-16 14:25 JST
- 18 min ago

## 8.3 列表密度

建议提供：
- Comfortable
- Compact

LOMS 高级用户通常会偏好 Compact。

## 8.4 行内动作

保持克制：
- 只暴露高频动作
- 低频动作放进更多菜单

---

# 9. 前端实现建议

## 9.1 推荐页面分层

### Shell Layer
- app frame
- navigation
- tabs
- bottom panel

### Page Layer
- dashboard page
- shipment monitor page
- shipment detail page
- exception page

### Domain Widget Layer
- status summary card
- route chain viewer
- tracking timeline
- exception queue
- risk panel

### Shared Component Layer
- table
- badge
- filter bar
- timeline item
- entity header
- drawer
- split panel

## 9.2 状态管理建议

建议拆分：
- global app state
- page query state
- selected object state
- panel visibility state
- bottom panel context state

## 9.3 URL 设计建议

示例：
- `/console/overview`
- `/console/shipments`
- `/console/shipments/:shipmentNo`
- `/console/exceptions`
- `/console/exceptions/:caseId`

并支持 query persistence：
- filters
- sort
- selected view
- selected tab

---

# 10. P0 实施优先级

## 10.1 第一批必须完成

1. Global Shell
2. Dashboard
3. Shipment Monitor
4. Shipment Detail Workspace
5. Exception Workbench
6. Bottom Panel 基础版

## 10.2 第二批增强

1. Saved Views
2. Watchlists
3. Bulk Actions
4. Advanced Timeline
5. Raw Facts Viewer
6. Role-based default layouts

---

# 11. 最终裁决

这套页面蓝图的核心不是“像 VS Code”，而是：

- 用 workbench 的壳
- 支撑物流运营多对象并行处理
- 把异常、事件、状态、SLA 作为一等公民
- 让高级运营角色获得最大效率

所以最终产品形态应定义为：

**LOMS Operations Workbench**  
或  
**LOMS Fulfillment Control Tower Console**

而不是 IDE 风格后台。

---

# 12. 页面组件清单矩阵（Page → Widget → Data Contract）

本节用于把页面结构进一步压实到实现层，明确：

- 哪个页面包含哪些 widget
- 每个 widget 需要什么数据
- 数据应该来自哪个领域对象 / 查询模型
- 前端更适合一次性聚合加载还是分块懒加载

---

## 12.1 Console Home / Operations Dashboard

| Page | Widget | Purpose | Primary Data Contract | Suggested Source | Load Strategy |
|---|---|---|---|---|---|
| Dashboard | KPI Strip | 展示全局运行摘要 | `OperationsKpiSummary` | Overview Query Model | Initial load |
| Dashboard | My Queues | 显示当前用户待处理队列 | `MyQueueSummary[]` | Work Queue Query | Initial load |
| Dashboard | Critical Alerts | 展示高优先级告警 | `AlertSummary[]` | Alert / Incident Query | Initial load |
| Dashboard | Network Health | 展示网络健康与流向 | `NetworkHealthSnapshot` | Network Monitoring Query | Initial load |
| Dashboard | SLA Heatmap | 展示 SLA 风险分布 | `SlaHeatmapData` | SLA Analytics Query | Lazy after shell |
| Dashboard | Workload Trend | 展示趋势 | `WorkloadTrendSeries` | Operations Analytics Query | Lazy |
| Dashboard | Carrier Status | 展示 carrier 健康情况 | `CarrierStatusSummary[]` | Carrier Ops Query | Lazy |
| Dashboard | Delay Reason Breakdown | 展示延误原因分布 | `DelayReasonBreakdown` | Exception / Tracking Analytics | Lazy |
| Dashboard | Aging Queue | 展示积压与 aging | `QueueAgingSummary` | Work Queue Query | Lazy |

### Dashboard 推荐契约定义

#### `OperationsKpiSummary`
- activeShipmentCount
- delayedShipmentCount
- atRiskShipmentCount
- openExceptionCount
- criticalIncidentCount
- failedJobCountLastHour
- avgLeadTimeToday
- slaBreachedTodayCount

#### `MyQueueSummary`
- queueCode
- queueName
- itemCount
- overdueCount
- highestSeverity
- defaultAction

#### `AlertSummary`
- alertId
- severity
- alertType
- title
- relatedObjectType
- relatedObjectRef
- detectedAt
- status

---

## 12.2 Shipment Monitor

| Page | Widget | Purpose | Primary Data Contract | Suggested Source | Load Strategy |
|---|---|---|---|---|---|
| Shipment Monitor | Filter Bar | 查询与筛选 | `ShipmentMonitorFilterMeta` | Metadata Query | Initial load |
| Shipment Monitor | Saved Views | 快速切换视图 | `SavedViewSummary[]` | User Preference Query | Initial load |
| Shipment Monitor | Facet Summary | 展示分面数量 | `ShipmentFacetSummary` | Shipment Search Query | Initial load |
| Shipment Monitor | Shipment Table | 主工作列表 | `ShipmentListItem[]` + paging | Shipment Search Query | Initial load |
| Shipment Monitor | Board View | 分组工作视图 | `ShipmentBoardGroup[]` | Shipment Search Query | On demand |
| Shipment Monitor | Timeline View | 时间负载视图 | `ShipmentTimelineBucket[]` | Shipment Schedule Query | On demand |
| Shipment Monitor | Preview Pane | 行级快速预览 | `ShipmentPreview` | Shipment Preview Query | Row select |
| Shipment Monitor | Bulk Action Bar | 批量操作入口 | `BulkActionCapability` | Capability Query / static config | Selection change |

### Shipment Monitor 推荐契约定义

#### `ShipmentListItem`
- shipmentNo
- orderRef
- fulfillmentRequestNo
- currentStatus
- subStatus
- currentLegNo
- carrierCode
- laneCode
- lastEventAt
- promiseAt
- eta
- riskLevel
- openExceptionCount
- slaRemainingMinutes
- ownerName
- tags[]

#### `ShipmentPreview`
- shipmentNo
- currentStatus
- activeLegSummary
- latestExceptionSummary
- recentEvents[]
- recommendedActions[]
- relatedRefs

#### `ShipmentFacetSummary`
- byStatus[]
- byRisk[]
- byCarrier[]
- byNode[]
- byRegion[]

---

## 12.3 Shipment Detail Workspace

| Page | Widget | Purpose | Primary Data Contract | Suggested Source | Load Strategy |
|---|---|---|---|---|---|
| Shipment Detail | Object Header | 顶部对象识别与动作 | `ShipmentHeader` | Shipment Workspace Query | Initial load |
| Shipment Detail | Summary Strip | 核心摘要信息 | `ShipmentSummaryStrip` | Shipment Workspace Query | Initial load |
| Shipment Detail | Summary Tab | 基本业务摘要 | `ShipmentSummaryView` | Shipment Workspace Query | Initial load |
| Shipment Detail | Route Chain Tab | 展示 legs 与 route | `RouteChainView` | Route / Leg Query | Lazy tab load |
| Shipment Detail | Timeline Tab | 展示完整时间线 | `ShipmentTimelineView` | Event Timeline Query | Lazy tab load |
| Shipment Detail | Tracking Tab | 展示轨迹 | `TrackingWorkspaceView` | Tracking Query | Lazy tab load |
| Shipment Detail | Exceptions Tab | 展示异常与 case | `ShipmentExceptionView` | Exception Query | Lazy tab load |
| Shipment Detail | Documents Tab | 展示文档与附件 | `ShipmentDocumentView` | Document Query | Lazy tab load |
| Shipment Detail | Audit Tab | 展示审计轨迹 | `AuditTrailView` | Audit Query | Lazy tab load |
| Shipment Detail | Right Context Panel | 上下文摘要与动作 | `ShipmentContextPanel` | Shipment Workspace Query | Initial load |
| Shipment Detail | Bottom Events | 当前对象事件 | `DomainEventItem[]` | Event Query | Bottom panel open |
| Shipment Detail | Bottom Logs | 集成日志 | `IntegrationLogItem[]` | Integration Log Query | Bottom panel open |
| Shipment Detail | Bottom Jobs | 异步任务 | `JobExecutionSummary[]` | Job Query | Bottom panel open |

### Shipment Detail 推荐契约定义

#### `ShipmentHeader`
- shipmentNo
- currentStatus
- subStatus
- riskLevel
- slaUrgency
- owner
- lastUpdatedAt
- quickActions[]

#### `ShipmentSummaryStrip`
- carrierCode
- activeLegNo
- promiseAt
- ownerName
- expectedCost
- actualCostKnown

#### `RouteChainView`
- shipmentNo
- routeId
- routeStatus
- legs[]

`legs[]` 每项建议包含：
- legNo
- legType
- carrierCode
- originNode
- destinationNode
- plannedStartAt
- plannedEndAt
- actualStartAt
- actualEndAt
- currentStatus
- dwellMinutes
- anomalyFlags[]

#### `TrackingWorkspaceView`
- normalizedMilestones[]
- rawCarrierEvents[]
- trackingHealth
- lastTrackingUpdateAt
- staleHours

#### `ShipmentContextPanel`
- statusSummary
- recommendedActions[]
- relatedObjects[]
- alerts[]
- slaSummary

---

## 12.4 Exception Workbench

| Page | Widget | Purpose | Primary Data Contract | Suggested Source | Load Strategy |
|---|---|---|---|---|---|
| Exception Workbench | Filter Bar | 筛选 case | `ExceptionFilterMeta` | Metadata Query | Initial load |
| Exception Workbench | Queue Panel | case 队列 | `ExceptionCaseListItem[]` + paging | Exception Search Query | Initial load |
| Exception Workbench | Group Header | 分组与统计 | `ExceptionGroupSummary[]` | Exception Search Query | Initial load |
| Exception Workbench | Case Summary | 基本 case 信息 | `ExceptionCaseSummary` | Case Workspace Query | Row select |
| Exception Workbench | Investigation Panel | 根因分析面板 | `ExceptionInvestigationView` | Case Workspace Query | Row select |
| Exception Workbench | Linked Facts | 关联对象事实 | `LinkedOperationalFacts` | Cross-object Query | Row select |
| Exception Workbench | Action Panel | 修复动作与归属处理 | `CaseActionCapability` + `RecommendedAction[]` | Capability Query / Rule Result | Row select |
| Exception Workbench | Bottom Logs | 相关日志 | `IntegrationLogItem[]` | Integration Log Query | Bottom panel open |
| Exception Workbench | Bottom Events | 相关事件 | `DomainEventItem[]` | Event Query | Bottom panel open |
| Exception Workbench | Bottom Comments | 协作评论 | `CaseComment[]` | Collaboration Query | Bottom panel open |

### Exception Workbench 推荐契约定义

#### `ExceptionCaseListItem`
- caseId
- severity
- status
- objectType
- objectRef
- reasonCategory
- owner
- ageMinutes
- slaDueAt
- nextActionDueAt
- duplicateFlag

#### `ExceptionCaseSummary`
- caseId
- severity
- reasonCategory
- symptomSummary
- impactLevel
- linkedObjects[]
- createdAt
- detectedAt
- owner
- currentStatus

#### `ExceptionInvestigationView`
- timeline[]
- rootCauseHints[]
- relatedIncidents[]
- recentRetries[]
- recommendedResolutionCodes[]

#### `LinkedOperationalFacts`
- shipmentSnapshot
- activeLegSnapshot
- lastTrackingSnapshot
- carrierIncidentSnapshot
- routeDecisionSnapshot

---

## 12.5 全局 Bottom Panel 契约

| Widget | Primary Data Contract | Purpose |
|---|---|---|
| Events | `DomainEventItem[]` | 查看对象相关领域事件 |
| Logs | `IntegrationLogItem[]` | 查看调用日志与 provider 返回 |
| Jobs | `JobExecutionSummary[]` | 查看异步任务执行情况 |
| Audit | `AuditRecord[]` | 查看人工/系统操作轨迹 |
| Cases | `RelatedCaseSummary[]` | 查看相关异常 case |

### 推荐契约定义

#### `DomainEventItem`
- eventId
- eventType
- occurredAt
- source
- actorType
- actorRef
- objectType
- objectRef
- summary
- correlationId
- causationId

#### `IntegrationLogItem`
- logId
- provider
- operation
- requestAt
- responseAt
- latencyMs
- result
- errorCode
- correlationId
- objectRef

#### `JobExecutionSummary`
- jobId
- jobType
- status
- startedAt
- finishedAt
- durationMs
- retryCount
- relatedObjectRef

#### `AuditRecord`
- auditId
- actionType
- actor
- occurredAt
- objectType
- objectRef
- beforeSummary
- afterSummary

---

# 13. 页面与查询模型边界建议

为了避免 UI 直接绑死领域聚合，建议为 Console 建立专门的 **read model / query model 层**。

## 13.1 建议原则

### A. 页面拿的是 Workspace Query Model，不直接拼 Aggregate
例如 Shipment Detail 页面不应由前端自行拼：
- Shipment Aggregate
- Leg Aggregate
- Tracking facts
- Case list
- Audit trail

而应由后端提供：
- `ShipmentWorkspaceQueryResult`

### B. 列表页与详情页分离
- 列表页：轻量 projection
- 详情页：富上下文 projection

### C. Bottom Panel 单独查询
- 避免首页和详情页首次加载过重
- 日志、事件、审计按需打开再取

## 13.2 推荐查询对象

- `OperationsDashboardQueryResult`
- `ShipmentMonitorQueryResult`
- `ShipmentWorkspaceQueryResult`
- `ExceptionWorkbenchQueryResult`
- `BottomPanelContextQueryResult`

---

# 14. 前后端对齐建议

## 14.1 前端组件层不要直接感知领域复杂性
例如：
- `ShipmentHeaderCard`
- `RouteChainViewer`
- `TrackingTimeline`
- `ExceptionQueueTable`

这些组件都应消费已经整理好的 view model，而不是自己理解 LOMS 全域对象关系。

## 14.2 后端应提供稳定的 UI-facing contracts
建议：
- 版本化
- 字段命名统一
- 状态枚举统一
- 时间字段统一为 ISO + timezone 约定
- badge / severity / risk 使用统一 code system

## 14.3 推荐最先冻结的契约

优先冻结这 6 个：
1. `OperationsKpiSummary`
2. `ShipmentListItem`
3. `ShipmentPreview`
4. `ShipmentHeader`
5. `RouteChainView`
6. `ExceptionCaseListItem`

因为它们最影响 UI 骨架实现。

---

# 15. 四个页面的低保真 ASCII Wireframe v2

本节进一步把核心页面细化到低保真线框层，重点体现：

- 布局区块
- 组件相对位置
- 高频操作入口
- 视图切换方式
- 右侧上下文与底部面板的打开逻辑

说明：以下为低保真结构草图，不代表最终视觉稿。

---

## 15.1 Console Home / Operations Dashboard

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ LOMS Console                                      [Global Search____________________] [Cmd] │
│ Scope: [Tenant ▼] [Network ▼] [Site ▼] [Today ▼]                [Alerts] [Recent] [User]   │
├───────────────┬──────────────────────────────────────────────────────────────────────────────┤
│ Left Nav      │ Overview / Operations Dashboard                                              │
│               ├──────────────────────────────────────────────────────────────────────────────┤
│ > Overview    │ KPI STRIP                                                                    │
│   Orders      │ [Active Shipments] [Delayed] [At Risk] [Open Cases] [Carrier Incidents]    │
│   Fulfillment │ [Failed Jobs] [Avg Lead Time] [SLA Breached Today]                          │
│   Shipments   ├───────────────────────────────┬──────────────────────────────────────────────┤
│   Legs        │ My Queues                     │ Network Health / Flow                         │
│   Routing     │ ┌───────────────────────────┐ │ ┌──────────────────────────────────────────┐ │
│   Exceptions  │ │ My Cases          12      │ │ │ Node / Lane / Region Health Overview    │ │
│   Carrier Ops │ │ Overdue Cases      4      │ │ │ Flow arrows / lane cards / node badges  │ │
│   Billing     │ │ My Watchlist       9      │ │ │ Clickable drill-down                     │ │
│   Reports     │ │ Saved View: Intl   >      │ │ └──────────────────────────────────────────┘ │
│   Admin       │ └───────────────────────────┘ │                                              │
│               ├───────────────────────────────┼──────────────────────────────────────────────┤
│               │ Critical Alerts               │ SLA Heatmap                                  │
│               │ ┌───────────────────────────┐ │ ┌──────────────────────────────────────────┐ │
│               │ │ Carrier API Failure       │ │ │ Carrier x Service / Node x Time Bucket  │ │
│               │ │ Tracking stale > 6h       │ │ │ color-coded cells                         │ │
│               │ │ Handoff delays rising     │ │ │ click → filtered monitor                  │ │
│               │ └───────────────────────────┘ │ └──────────────────────────────────────────┘ │
│               ├───────────────────────────────┼──────────────────────────────────────────────┤
│               │ Carrier Status                │ Delay Reason Breakdown / Aging Queue         │
│               │ ┌───────────────────────────┐ │ ┌──────────────────────────────────────────┐ │
│               │ │ USPS   Healthy            │ │ │ customs hold   28                         │ │
│               │ │ UPS    Warning            │ │ │ booking fail   13                         │ │
│               │ │ FedEx  Incident           │ │ │ stale tracking 11                         │ │
│               │ └───────────────────────────┘ │ └──────────────────────────────────────────┘ │
├───────────────┴──────────────────────────────────────────────────────────────────────────────┤
│ Bottom Panel: [Events] [Logs] [Cases] [Jobs] [Audit]                                        │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Dashboard 页面动作重点
- 点击 KPI 卡片 → 打开 Shipment Monitor 对应过滤视图
- 点击 Alert → 打开相关对象详情或 Exception Workbench
- 点击网络节点 / lane → 进入局部监控视图
- 点击 Saved View → 替换主内容上下文

---

## 15.2 Shipment Monitor

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ Shipment Monitor                                                           [Save View] [↻]  │
│ Search: [Shipment / Tracking / Order / FR ____________________________]     [Export] [Cmd]  │
├───────────────┬──────────────────────────────────────────────────────────────────────────────┤
│ Saved Views   │ Filter Bar                                                                    │
│ ┌───────────┐ │ [Status ▼] [Risk ▼] [Carrier ▼] [Node ▼] [Lane ▼] [Time ▼] [More Filters]  │
│ │ My Delay  │ ├──────────────────────────────────────────────────────────────────────────────┤
│ │ Intl Risk │ │ Toolbar: [Table] [Board] [Timeline] [Group By ▼] [Sort ▼] [Columns ▼]      │
│ │ SLA <2h   │ │ Selection: [Assign] [Tag] [Watchlist] [Resync] [Escalate]                    │
│ └───────────┘ ├──────────────────────────────────────────────────────────────────────────────┤
│               │ Facet Summary                                                                  │
│ Watchlists    │ Status: Created 12 | In Transit 219 | Exception 18                           │
│ ┌───────────┐ │ Risk: Critical 5 | High 22 | Medium 61                                        │
│ │ JP Lane   │ │ Carrier: USPS 108 | UPS 74 | FedEx 52                                         │
│ │ West Hub  │ ├──────────────────────────────────────────────────────────────────────────────┤
│ └───────────┘ │ TABLE VIEW                                                                     │
│               │ ┌────┬────────────┬──────────┬──────────┬─────────┬───────┬────────┬───────┐ │
│ Preview Pane  │ │Sel │ ShipmentNo │ Status   │ ActiveLg │ Carrier │ Risk  │ SLA    │ Owner │ │
│ ┌───────────┐ │ ├────┼────────────┼──────────┼──────────┼─────────┼───────┼────────┼───────┤ │
│ │ Shipment  │ │ │[]  │ SHP-001    │ InTransit│ LEG-02   │ USPS    │ High  │ 45 min │ Amy   │ │
│ │ status    │ │ │[]  │ SHP-002    │ Exception│ LEG-01   │ FedEx   │ Crit  │ 12 min │ Ken   │ │
│ │ last evt  │ │ │[]  │ SHP-003    │ Delivered│ --       │ UPS     │ Low   │ --     │ --    │ │
│ │ open case │ │ └────┴────────────┴──────────┴──────────┴─────────┴───────┴────────┴───────┘ │
│ │ rec act   │ │                                                                              │
│ └───────────┘ │ Pagination: < Prev  1 2 3 4  ...  Next >                                     │
├───────────────┴──────────────────────────────────────────────────────────────────────────────┤
│ Bottom Panel: [Events] [Logs] [Cases] [Jobs] [Audit]                                        │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Shipment Monitor 变体

#### Board View
```text
[Created]           [In Transit]         [At Risk]            [Exception]
┌──────────────┐    ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ SHP-001      │    │ SHP-018      │     │ SHP-102      │     │ SHP-233      │
│ USPS / JP    │    │ UPS / US     │     │ SLA < 1h     │     │ case open     │
└──────────────┘    └──────────────┘     └──────────────┘     └──────────────┘
```

#### Timeline View
```text
08:00   10:00   12:00   14:00   16:00   18:00
SHP-001  ━━━━━━━━━━━━━━━► ETA 15:30
SHP-018  ━━━━━━━━━━⚠────► SLA risk 14:45
SHP-233  ━━━━━━━✖        exception 12:10
```

### Shipment Monitor 页面动作重点
- 单击行 → 左/右 preview 更新
- 双击行 / Enter → 新标签页打开 Shipment Detail
- 多选 → 激活 Bulk Actions
- 过滤条件变化 → URL query persistence

---

## 15.3 Shipment Detail Workspace

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ Tabs: [Dashboard] [Shipment Monitor] [SHP-240316-001 ✕] [CASE-8892 ✕]                        │
├──────────────────────────────────────────────────────────────────────────────────────────────┤
│ Shipment: SHP-240316-001   [In Transit] [High Risk] [SLA 45 min]   Owner: Amy   [Actions▼] │
│ Summary: Carrier USPS | Active Leg LEG-02 | Promise 18:00 JST | Exp Cost $12.4 | Actual ?  │
├───────────────────────────────────────────────────────────────┬──────────────────────────────┤
│ Main Content Tabs                                             │ Right Context Panel          │
│ [Summary] [Route Chain] [Timeline] [Tracking] [Exceptions]   │ ┌──────────────────────────┐ │
│ [Documents] [Audit]                                           │ │ Status Summary           │ │
│                                                               │ │ Current: In Transit      │ │
│ SUMMARY TAB                                                   │ │ Time in state: 3h 12m    │ │
│ ┌───────────────────────────────────────────────────────────┐ │ │ SLA remain: 45m         │ │
│ │ Basic Info                                                │ │ │ Risk: High              │ │
│ │ Shipment No / Order Ref / FR Ref / Service / Lane         │ │ └──────────────────────────┘ │
│ ├───────────────────────────────────────────────────────────┤ │ ┌──────────────────────────┐ │
│ │ Origin / Destination                                       │ │ │ Recommended Actions     │ │
│ │ Ship-from / Ship-to / Region / Promise                    │ │ │ • Resync tracking       │ │
│ ├───────────────────────────────────────────────────────────┤ │ │ • Open linked case      │ │
│ │ Current Execution Snapshot                                 │ │ │ • Escalate to carrier   │ │
│ │ Active leg / Current node / Last milestone / Next target  │ │ └──────────────────────────┘ │
│ ├───────────────────────────────────────────────────────────┤ │ ┌──────────────────────────┐ │
│ │ Cost / Promise Snapshot                                    │ │ │ Related Objects         │ │
│ │ expected / actual / variance / ETA                         │ │ │ Order / FR / Leg / Case │ │
│ └───────────────────────────────────────────────────────────┘ │ └──────────────────────────┘ │
├───────────────────────────────────────────────────────────────┴──────────────────────────────┤
│ Bottom Panel: [Events] [Logs] [Jobs] [Audit]                                               │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Route Chain Tab

```text
Origin Node                      Handoff Node                    Destination Node
┌──────────────┐   LEG-01        ┌──────────────┐   LEG-02       ┌──────────────┐
│ CN-WH-001    │ ─────────────►  │ JP-HUB-01    │ ─────────────► │ TOKYO-LAST   │
└──────────────┘                 └──────────────┘                └──────────────┘

Leg Cards:
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ LEG-01 | Linehaul | Carrier: UPS | Planned 08:00-11:00 | Actual 08:10-10:55 | Completed  │
├────────────────────────────────────────────────────────────────────────────────────────────┤
│ LEG-02 | Last Mile| Carrier: USPS| Planned 12:00-18:00 | Actual start 12:22  | In Transit │
│ Dwell: 27m | Anomaly: tracking stale                                                      │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Timeline Tab

```text
12:22  Carrier scan received            source: USPS         normalized: InTransit
12:35  Shipment status updated          source: System       by: tracking sync job
13:10  Risk score raised                source: Rule engine  SLA risk detected
13:22  Exception case suggested         source: Monitor      pending confirmation
14:05  User note added                  source: Amy          "customer asked for ETA"
```

### Tracking Tab

```text
Normalized Tracking                          Raw Carrier Events
┌──────────────────────────────┐             ┌──────────────────────────────────────┐
│ Picked Up       08:10        │             │ 08:10  PU   Shipment picked up       │
│ Departed Hub    10:55        │             │ 10:55  DH   Departure scan            │
│ In Transit      12:22        │             │ 12:22  IT   On route to destination   │
│ Out for Delivery --          │             │ --                                           │
│ Delivered       --           │             │ --                                           │
└──────────────────────────────┘             └──────────────────────────────────────┘
```

### Exceptions Tab

```text
Open Cases
┌──────────┬──────────┬──────────────┬─────────┬────────────┬───────────┐
│ Case ID  │ Severity │ Reason       │ Owner   │ SLA Due    │ Status    │
├──────────┼──────────┼──────────────┼─────────┼────────────┼───────────┤
│ CASE-8892│ High     │ TrackingGap  │ Amy     │ 15:00 JST  │ Open      │
└──────────┴──────────┴──────────────┴─────────┴────────────┴───────────┘
[Open Case Workspace] [Add Note] [Resolve] [Create New Case]
```

### Shipment Detail 页面动作重点
- 顶部 Actions 菜单挂所有对象级动作
- 右侧面板始终保持“状态 + 建议动作 + 关联对象”
- 底部 panel 按需打开，不阻塞主体内容
- tab 切换保持对象上下文一致

---

## 15.4 Exception Workbench

```text
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ Exception Workbench                                                  [Save View] [Bulk ▼]  │
│ Filters: [Severity ▼] [Status ▼] [Owner ▼] [Reason ▼] [Due Window ▼] [Search__________]   │
├───────────────────────┬──────────────────────────────────────────────┬──────────────────────┤
│ Queue Panel           │ Investigation Panel                          │ Action Panel         │
│ ┌───────────────────┐ │ ┌──────────────────────────────────────────┐ │ ┌──────────────────┐ │
│ │ CASE-8892  High   │ │ │ Case Summary                             │ │ │ Ownership        │ │
│ │ SHP-001           │ │ │ Reason: TrackingGap                      │ │ │ [Assign to me]   │ │
│ │ Due 15:00         │ │ │ Impact: Shipment SLA at risk             │ │ │ [Assign ▼]       │ │
│ ├───────────────────┤ │ │ Linked: SHP-001 / LEG-02 / USPS incident │ │ └──────────────────┘ │
│ │ CASE-8893  Crit   │ │ ├──────────────────────────────────────────┤ │ ┌──────────────────┐ │
│ │ SHP-233           │ │ │ Timeline                                 │ │ │ Recovery         │ │
│ │ Due 14:20         │ │ │ 13:10 risk raised                        │ │ │ [Resync]         │ │
│ ├───────────────────┤ │ │ 13:22 case suggested                     │ │ │ [Retry booking]  │ │
│ │ CASE-8894 Medium  │ │ │ 13:30 assigned to Amy                    │ │ │ [Recompute]      │ │
│ └───────────────────┘ │ ├──────────────────────────────────────────┤ │ └──────────────────┘ │
│ Sort: [SLA ▲]         │ │ │ Linked Facts                            │ │ ┌──────────────────┐ │
│ Group: [Reason ▼]     │ │ │ Shipment: In Transit                    │ │ │ Escalation       │ │
│                       │ │ │ Active Leg: LEG-02                      │ │ │ [Carrier Ops]    │ │
│                       │ │ │ Last scan: 12:22                        │ │ │ [Supervisor]     │ │
│                       │ │ │ Incident: USPS timeout warning          │ │ └──────────────────┘ │
│                       │ │ ├──────────────────────────────────────────┤ │ ┌──────────────────┐ │
│                       │ │ │ Root Cause Hints                        │ │ │ Resolution       │ │
│                       │ │ │ • likely missing scan                   │ │ │ [Resolve]        │ │
│                       │ │ │ • carrier sync lag                      │ │ │ [Duplicate]      │ │
│                       │ │ │ • manual confirmation may be required   │ │ │ [Suppress]       │ │
│                       │ │ └──────────────────────────────────────────┘ │ └──────────────────┘ │
├───────────────────────┴──────────────────────────────────────────────┴──────────────────────┤
│ Bottom Panel: [Linked Logs] [Events] [Audit] [Comments]                                    │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Exception Workbench 页面动作重点
- 左侧 queue 支持键盘上下快速切换
- 中间 investigation 随选中 case 实时切换
- 右侧 action panel 固定，不随 tab 隐藏
- 高风险动作必须要求 resolution code / note

---

## 15.5 全局标签页模型（Tab Model）

建议采用类似 workbench 的多标签对象模型。

```text
Top-level Tabs
[Dashboard]
[Shipment Monitor]
[SHP-240316-001]
[SHP-240316-018]
[CASE-8892]
[Carrier Incident-UPS-0316]
```

### 标签页规则
- 列表页可常驻
- 对象页默认在新标签打开
- 支持 pin / close / reopen closed tab
- 支持 split view（P1 能力）
- 标签标题采用“对象类型 + 主键”形式，避免歧义

---

## 15.6 右侧上下文区统一规范

无论是 Shipment Detail 还是未来的 Leg Detail / Case Detail，右侧区建议统一为 3 段：

```text
┌──────────────────────────┐
│ 1. Current Status        │
│ 2. Recommended Actions   │
│ 3. Related Objects       │
└──────────────────────────┘
```

这样用户能始终回答三个问题：
- 现在是什么状态
- 下一步做什么
- 我还要看什么对象

---

## 15.7 底部面板统一规范

```text
[Events] [Logs] [Cases] [Jobs] [Audit] [Comments]
```

### 打开逻辑
- 默认折叠
- 用户点击后展开为 25%~35% 高度
- 支持拖拽高度
- 支持记忆最近打开的 tab

### 数据策略
- 仅在展开时懒加载
- 与当前对象上下文联动
- 支持“Open full view”跳出到独立页面

---

# 16. Console 前端路由树 + Tab 打开模型

本节用于定义 LOMS Console 前端壳层的核心机制：

- 页面与对象页如何组织路由
- Workbench Tab 如何创建、激活、关闭、恢复
- URL 如何表达当前上下文
- Drill-down 如何在“当前页 / 新标签 / 侧边预览”之间切换
- 如何为后续扩展 Order / Leg / Carrier Incident / Billing Case 页面预留能力

目标是让控制台具备真正的 **Workbench Shell** 能力，而不是普通后台菜单页。

---

## 16.1 设计裁决

### 16.1.1 路由不是唯一导航机制
Console 中存在三层导航：

1. **Global Navigation**：左侧业务导航
2. **Page Routing**：URL 对应的页面路由
3. **Workbench Tabs**：对象工作页容器

因此，不应把对象详情页仅仅理解成普通二级路由。

### 16.1.2 列表页与对象页必须分离
建议始终区分：

- **List / Monitor Pages**：如 Shipment Monitor、Exception Workbench
- **Object Workspace Pages**：如 Shipment Detail、Case Detail、Leg Detail

列表页负责筛选、查找、批量操作。  
对象页负责上下文分析、处理、操作闭环。

### 16.1.3 URL 要能表达“当前页”，但不必完整承载全部 tab 状态
推荐：
- URL 表达当前激活页与关键 query state
- Tab 栈状态由客户端 shell store 管理
- 必要时支持 session persistence

这样既保持 URL 可分享，又避免 URL 过长、过复杂。

---

## 16.2 推荐路由总树

```text
/console
├── /overview
│   ├── /operations
│   ├── /sla
│   └── /network
├── /orders
│   ├── /monitor
│   └── /:orderNo
├── /fulfillment
│   ├── /monitor
│   ├── /manual-queue
│   └── /:fulfillmentRequestNo
├── /shipments
│   ├── /monitor
│   ├── /tracking
│   └── /:shipmentNo
├── /legs
│   ├── /monitor
│   └── /:legNo
├── /routing
│   ├── /decisions
│   ├── /recompute-tasks
│   └── /:routeDecisionId
├── /exceptions
│   ├── /workbench
│   └── /:caseId
├── /carrier-ops
│   ├── /status
│   ├── /incidents
│   └── /incidents/:incidentId
├── /billing
│   ├── /review
│   ├── /settlement-exceptions
│   └── /:billingCaseId
├── /reports
│   ├── /delay-analysis
│   ├── /carrier-performance
│   └── /node-performance
└── /admin
    ├── /config
    ├── /rules
    ├── /audit
    └── /access
```

---

## 16.3 P0 必须落地的路由

P0 只建议冻结以下路由：

```text
/console/overview/operations
/console/shipments/monitor
/console/shipments/:shipmentNo
/console/exceptions/workbench
/console/exceptions/:caseId
```

这是最小可用 Workbench 壳。

---

## 16.4 Shell 路由分层建议

## 16.4.1 一级壳层

```text
ConsoleShell
├── TopBar
├── LeftNav
├── WorkbenchTabsBar
├── ActiveRouteViewport
└── BottomPanelHost
```

说明：
- `ActiveRouteViewport` 承载当前激活 route/tab 的主内容
- `WorkbenchTabsBar` 不属于具体页面，而属于全局壳层
- `BottomPanelHost` 由 shell 托管，与当前对象上下文联动

## 16.4.2 页面级壳层

例如 Shipment Detail 页：

```text
ShipmentWorkspacePage
├── ObjectHeader
├── SummaryStrip
├── ContentTabs
├── RightContextPanel
└── LocalActionHost
```

页面级 tabs 与全局 workbench tabs 是两层：
- 全局 tabs：不同对象 / 页面
- 页面内 tabs：当前对象的 Summary / Timeline / Tracking / Exceptions

---

## 16.5 Tab 模型设计

建议将 Workbench Tab 视为独立的一等公民。

## 16.5.1 Tab 类型

### A. Static Page Tab
静态页面标签，例如：
- Dashboard
- Shipment Monitor
- Exception Workbench

特征：
- 可常驻
- 通常不可重复打开多份
- 支持 pin

### B. Object Workspace Tab
对象工作页标签，例如：
- Shipment `SHP-240316-001`
- Case `CASE-8892`
- Leg `LEG-02`
- Carrier Incident `INC-UPS-0316-01`

特征：
- 由对象主键唯一标识
- 同一对象通常不重复打开
- 支持 reopen / pin / close others

### C. Temporary Utility Tab（P1）
临时工具标签，例如：
- Advanced Search Result
- Compare View
- Raw Fact Inspector

P0 可不实现。

---

## 16.5.2 推荐 Tab 数据结构

```text
WorkbenchTab
- tabId
- tabType                // static-page | object-workspace | utility
- objectType?            // shipment | case | leg | order | incident
- objectRef?             // SHP-240316-001
- routePath              // /console/shipments/SHP-240316-001
- title                  // Shipment SHP-240316-001
- subtitle?              // In Transit / High Risk
- iconKey
- isPinned
- isDirty?               // 未来支持表单编辑时使用
- openedAt
- lastActivatedAt
- closable
- restorePayload?        // optional, for local state restoration
```

---

## 16.5.3 Tab 唯一性规则

### 静态页面
- Shipment Monitor：只允许 1 个实例
- Exception Workbench：只允许 1 个实例
- Dashboard：只允许 1 个实例

### 对象页
- 同一 `objectType + objectRef` 只允许 1 个实例
- 再次打开时，不新建 tab，而是激活已存在 tab

这样可以避免同一 Shipment 打开多次造成混乱。

---

## 16.5.4 Tab 标题规则

建议统一：

```text
Dashboard
Shipment Monitor
Exception Workbench
SHP-240316-001
CASE-8892
LEG-02
```

若需要增强识别，可加 subtitle：

```text
SHP-240316-001
In Transit · High Risk
```

但标签栏内不建议过长。

---

## 16.6 打开策略（Open Strategy）

所有 drill-down 行为建议统一为以下三种模式：

## 16.6.1 Open In Current Context
用于：
- 左侧导航切换静态页面
- Dashboard widget drill-down 到 monitor 页
- 同类页面内非关键跳转

例如：
- Dashboard → Shipment Monitor

## 16.6.2 Open In New Tab
默认推荐用于：
- 列表行双击打开对象
- 关键业务对象 drill-down
- 跨对象关联跳转

例如：
- Shipment Monitor 行 → Shipment Detail
- Shipment Detail 的 open case → Case Detail
- Case Detail 的 active leg → Leg Detail

## 16.6.3 Open In Side Preview
用于轻量查看，不进入完整工作页：
- Monitor 页面单击行
- 只需看 status summary / latest events / recommended action 时

例如：
- Shipment Monitor 单击行 → Preview Pane 更新

---

## 16.7 典型跳转矩阵

| From | Action | To | Open Mode |
|---|---|---|---|
| Dashboard KPI | Click delayed shipments | Shipment Monitor | Current Context |
| Dashboard Alert | Click incident | Carrier Incident / Case | New Tab |
| Shipment Monitor row | Single click | Shipment Preview | Side Preview |
| Shipment Monitor row | Double click | Shipment Detail | New Tab |
| Shipment Detail related case | Click | Case Detail | New Tab |
| Shipment Detail active leg | Click | Leg Detail | New Tab |
| Exception queue row | Single click | Investigation Panel | Current Context |
| Exception queue row | Double click | Case Detail | New Tab |
| Bottom Panel event object ref | Click | Related Object | New Tab |

---

## 16.8 URL 规则建议

## 16.8.1 列表页 URL
列表页应持久化：
- filters
- sort
- view mode
- saved view id
- selected group

示例：

```text
/console/shipments/monitor?view=table&status=in_transit&risk=high&carrier=USPS&savedView=my-delay
```

## 16.8.2 对象页 URL
对象页 URL 应简洁、稳定：

```text
/console/shipments/SHP-240316-001
/console/exceptions/CASE-8892
/console/legs/LEG-02
```

可选追加页面内 tab：

```text
/console/shipments/SHP-240316-001?tab=tracking
```

## 16.8.3 不建议把整个 workbench tab 栈编码进 URL
原因：
- URL 过长
- 分享困难
- 恢复逻辑复杂
- 对实际用户价值有限

更好的做法是：
- URL 只表达当前激活页
- tab 栈本地 store + session storage 恢复

---

## 16.9 Tab 生命周期

## 16.9.1 创建
触发条件：
- 用户 drill-down 打开对象
- 用户从命令面板打开对象
- 用户从全局搜索打开对象

动作：
1. 检查是否已存在对应 tab
2. 若存在 → activate
3. 若不存在 → create + activate

## 16.9.2 激活
激活时：
- 更新当前 URL
- 更新 activeTabId
- 更新 bottom panel context
- 更新 recent objects

## 16.9.3 关闭
关闭时：
- 若关闭的是非激活页 → 仅移除
- 若关闭的是当前激活页 → 激活最近访问 tab
- 若仅剩一个必需静态 tab → 不允许全部关闭到空白壳

## 16.9.4 恢复
建议支持：
- 浏览器刷新后恢复最后激活 tab
- 会话内恢复 pinned tabs
- 恢复最近 5~10 个对象页

P0 可以只做：
- 恢复最后激活页
- 保留 pinned static tabs

---

## 16.10 Tab 操作菜单建议

每个标签右键或更多菜单建议支持：
- Close
- Close Others
- Close Tabs to Right
- Pin Tab
- Reopen Closed Tab
- Copy Link
- Reveal in Navigation

P0 最少应支持：
- Close
- Close Others
- Pin Tab
- Reopen Closed Tab

---

## 16.11 Recent Objects 模型

建议 Top Bar 提供 Recent Objects 下拉，按最近访问对象展示：

```text
Recent Objects
- SHP-240316-001
- CASE-8892
- SHP-240316-018
- LEG-02
```

选择后逻辑：
- 若 tab 已存在 → 激活
- 若不存在 → 新建 tab

这会大幅提升复杂排查场景中的回跳效率。

---

## 16.12 命令面板与路由/Tab 的联动

命令面板建议支持：
- Go to Shipment Monitor
- Open Shipment by No
- Open Case by ID
- Open Leg by No
- Switch to Dashboard
- Reopen Closed Tab
- Open My Delayed Shipments

命令执行结果不应直接只是导航，而应明确：
- 打开静态页 → 激活静态 tab
- 打开对象 → 新建或激活对象 tab

---

## 16.13 壳层状态管理建议

建议在前端建立独立 `WorkbenchShellStore`，管理：

```text
WorkbenchShellState
- tabs[]
- activeTabId
- recentClosedTabs[]
- pinnedTabIds[]
- bottomPanelState
- recentObjects[]
- sidePreviewState
- activeScope
```

### 说明
- 路由状态与 shell 状态分离
- 但 route activation 会驱动 shell store 更新
- shell store 也可以反向触发 route changes

---

## 16.14 页面内状态与壳层状态的边界

### 壳层负责
- tab 栈
- active route
- bottom panel
- preview pane
- recent objects
- global scope

### 页面负责
- 当前页 filters
- 当前页 selection
- 页面内 tab（Summary / Tracking / Exceptions）
- 页面局部 loading / error state

这样可以避免壳层 store 过于臃肿。

---

## 16.15 Bottom Panel 路由联动规则

建议 Bottom Panel 不单独映射完整路由，而作为当前对象页的附属上下文。

例如当前激活对象：
- `/console/shipments/SHP-240316-001`

Bottom Panel 状态：
- tab = logs
- expanded = true

不必写成独立长路由。  
P0 更适合由 shell state 管理。

如确需深链接，可采用 query：

```text
/console/shipments/SHP-240316-001?bottom=logs
```

但建议只在确有分享需求时再加。

---

## 16.16 Side Preview 模型

Monitor 页建议支持轻量 Preview Pane。

### Preview 状态结构

```text
SidePreviewState
- enabled
- objectType
- objectRef
- sourcePage
- width
```

### 使用场景
- Shipment Monitor 单击行
- Exception Queue 单击行
- Dashboard 中点击 alert 但不想离开当前页

### 退出规则
- Esc 关闭
- 单击空白关闭（可配置）
- 双击对象转完整 tab

---

## 16.17 推荐前端实现骨架

```text
src/console/
├── shell/
│   ├── ConsoleShell.tsx
│   ├── WorkbenchTabsBar.tsx
│   ├── BottomPanelHost.tsx
│   ├── SidePreviewHost.tsx
│   ├── LeftNavigation.tsx
│   └── shell-store.ts
├── routes/
│   ├── overview/
│   ├── shipments/
│   │   ├── monitor/
│   │   └── [shipmentNo]/
│   ├── exceptions/
│   │   ├── workbench/
│   │   └── [caseId]/
│   └── ...
├── pages/
│   ├── dashboard/
│   ├── shipment-monitor/
│   ├── shipment-workspace/
│   └── exception-workspace/
├── widgets/
│   ├── shipment/
│   ├── exception/
│   ├── routing/
│   └── common/
└── contracts/
    ├── overview.ts
    ├── shipment-monitor.ts
    ├── shipment-workspace.ts
    └── exception-workspace.ts
```

---

## 16.18 P0 冻结建议

P0 最值得冻结的壳层规则：

1. 静态页与对象页分离
2. 同一对象只开一个 tab
3. 列表页 filters 写入 URL
4. 对象页 URL 简洁稳定
5. tab 栈不编码到 URL
6. bottom panel 由 shell store 管理
7. preview pane 只用于 monitor/workbench 页
8. 命令面板与全局搜索统一走 tab opening service

---

## 16.19 最终裁决

LOMS Console 前端不应采用传统“菜单 → 单页面详情 → 返回列表”的后台模式。  
更合理的前端壳层是：

**Route-driven Workbench Shell**

其核心是：
- 左侧业务导航决定主域入口
- 路由表达当前激活页面
- tab 模型承载对象级并行工作
- preview / bottom panel 承担轻量上下文浏览

这才适合高频、多对象、异常驱动的物流运营场景。

---

# 17. 下一步建议

现在最适合继续的产物有三个：

1. **Design Token / 视觉规范草案**
2. **Shipment Workspace Query Contract 初稿**
3. **Exception Workbench Query Contract 初稿**

如果按实施优先级，我建议先做：

**Shipment Workspace Query Contract 初稿**

因为它会直接决定前后端接口如何聚合、字段如何冻结，以及 Shipment Detail Workspace 是否能高质量落地。

