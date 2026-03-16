# LOMS Shipment Workspace Query Contract Draft

**Version:** v1.0  
**Status:** Draft  
**Scope:** Shipment Detail Workspace / Shipment Object Page  
**Audience:** Product, Frontend, Backend, Domain Architect, API Designer  

---

# 1. 文档目的

本文定义 `Shipment Workspace` 的查询契约草案，用于支撑 LOMS Console 中 `Shipment Detail Workspace` 页面。

目标是冻结一个 **面向 UI 的聚合查询模型（UI-facing Query Contract）**，而不是让前端直接拼接多个领域聚合或多个底层 API。

该契约需要满足：

- 能支撑 Shipment Detail Workspace 的完整主视图
- 能支撑页面内各 tab 的按需加载
- 能支撑右侧上下文区的常驻信息
- 能支撑底部 panel 的上下文联动
- 能控制首屏加载体积
- 能与领域边界解耦，避免 UI 绑死领域内部实现

---

# 2. 设计裁决

## 2.1 Shipment Workspace 必须是聚合查询，不是前端拼装页

前端不应自行聚合：

- Shipment Aggregate
- Fulfillment Request
- Leg 列表
- Tracking facts
- Exception cases
- Documents
- Audit trail
- Integration logs

正确做法是由后端提供一个 **Workspace Query Facade**，向前端返回 UI 直接可消费的 view model。

## 2.2 列表查询与工作区查询必须分离

- `Shipment Monitor` 使用轻量 `ShipmentListItem`
- `Shipment Workspace` 使用富上下文 `ShipmentWorkspaceQueryResult`

不能把 Monitor 列表接口扩展成详情工作区接口。

## 2.3 首屏与次屏数据必须拆分

Shipment Workspace 不应首屏一次性加载全部：

- timeline
- raw tracking
- documents
- audit
- integration logs
- jobs

建议拆为：

- **首屏核心 contract**：对象头、摘要、右侧上下文、默认 tab
- **懒加载 contract**：route chain / timeline / tracking / exceptions / documents / audit
- **底部 panel contract**：events / logs / jobs / audit

## 2.4 Query Contract 是 UI 契约，不等于领域模型

例如：
- `riskLevel` 可以来自规则引擎或 projection，不一定是 Shipment 聚合原生字段
- `recommendedActions` 可以来自 capability + rules，不一定是领域实体属性
- `summaryStrip` 是纯 UI 投影视图，不应强行映射到某个领域对象

---

# 3. 页面上下文范围

Shipment Workspace 页面必须回答以下问题：

1. 当前 Shipment 是什么状态
2. 当前 active leg 是哪一段
3. route chain 是什么样
4. 最近发生了什么
5. 轨迹是否健康
6. 是否存在异常 case
7. 是否存在 SLA 风险
8. 还关联哪些对象
9. 用户下一步应该做什么

因此查询契约至少要覆盖：

- object identity
- status summary
- promise / SLA summary
- active leg summary
- route chain
- timeline
- tracking
- exceptions
- documents
- audit
- actions / recommendations
- related objects

---

# 4. 契约总览

推荐定义如下根对象：

```text
ShipmentWorkspaceQueryResult
├── meta
├── header
├── summaryStrip
├── defaultView
├── rightContext
├── tabAvailability
└── preload
```

其中：

- `header`：支撑顶部对象头
- `summaryStrip`：支撑对象头下方摘要条
- `defaultView`：默认 tab 首屏内容（通常为 Summary）
- `rightContext`：支撑右侧上下文区
- `tabAvailability`：告知前端哪些 tab 可用
- `preload`：可选的小块预加载数据，例如 recent exceptions count

---

# 5. Root Contract 定义

## 5.1 ShipmentWorkspaceQueryResult

```text
ShipmentWorkspaceQueryResult
- meta: WorkspaceMeta
- header: ShipmentWorkspaceHeader
- summaryStrip: ShipmentSummaryStrip
- defaultView: ShipmentSummaryView
- rightContext: ShipmentRightContext
- tabAvailability: ShipmentTabAvailability
- preload: ShipmentWorkspacePreload
```

---

## 5.2 WorkspaceMeta

```text
WorkspaceMeta
- objectType
- objectRef
- workspaceVersion
- generatedAt
- timezone
- dataFreshness
- permissions
```

### 字段说明
- `objectType`: 固定为 `shipment`
- `objectRef`: Shipment No
- `workspaceVersion`: 用于 UI contract 版本识别
- `generatedAt`: 本次结果生成时间
- `timezone`: 推荐返回 IANA timezone 或 UI约定 timezone
- `dataFreshness`: 数据新鲜度描述
- `permissions`: 当前用户在该对象上的动作权限摘要

### `dataFreshness` 建议

```text
DataFreshness
- snapshotAt
- trackingFreshness
- routeFreshness
- exceptionFreshness
- documentFreshness
```

---

# 6. Header Contract

## 6.1 ShipmentWorkspaceHeader

```text
ShipmentWorkspaceHeader
- shipmentNo
- displayTitle
- currentStatus
- subStatus
- riskLevel
- riskLabel
- slaUrgency
- owner
- lastUpdatedAt
- tags[]
- quickActions[]
```

### 字段定义

#### `shipmentNo`
主业务标识，例如：`SHP-240316-001`

#### `displayTitle`
给 UI 直接显示的标题，通常与 `shipmentNo` 相同，但保留扩展空间

#### `currentStatus`
UI 统一状态码，例如：
- created
- booked
- in_transit
- out_for_delivery
- delivered
- exception
- cancelled

#### `subStatus`
更细粒度的补充状态，例如：
- awaiting_handoff
- tracking_stale
- carrier_confirmation_pending

#### `riskLevel`
建议统一 code：
- none
- low
- medium
- high
- critical

#### `slaUrgency`
建议统一 code：
- none
- safe
- watch
- warning
- breach_risk
- breached

#### `owner`

```text
WorkspaceOwner
- ownerType
- ownerRef
- ownerName
```

#### `quickActions[]`
顶部动作菜单的直接数据源。

```text
WorkspaceAction
- actionCode
- actionLabel
- enabled
- reasonIfDisabled
- confirmationRequired
- actionGroup
```

推荐动作示例：
- resync_tracking
- assign_owner
- open_linked_case
- recompute_route
- add_note
- escalate_to_carrier_ops

---

# 7. Summary Strip Contract

## 7.1 ShipmentSummaryStrip

```text
ShipmentSummaryStrip
- carrier
- activeLeg
- promise
- ownerName
- costSnapshot
- networkSummary
```

### `carrier`

```text
CarrierSummary
- carrierCode
- carrierName
- serviceCode
- serviceName
```

### `activeLeg`

```text
ActiveLegSummary
- legNo
- legType
- status
- originNode
- destinationNode
- startedAt
- expectedEndAt
```

### `promise`

```text
PromiseSummary
- promiseAt
- eta
- etaConfidence
- promiseVarianceMinutes
```

### `costSnapshot`

```text
CostSnapshot
- currency
- expectedCost
- actualCostKnown
- variance
- varianceStatus
```

### `networkSummary`

```text
NetworkSummary
- laneCode
- originRegion
- destinationRegion
- currentNode
```

---

# 8. Default View Contract（Summary Tab）

## 8.1 ShipmentSummaryView

```text
ShipmentSummaryView
- basicInfo
- endpoints
- executionSnapshot
- promiseSnapshot
- businessFlags[]
```

### `basicInfo`

```text
ShipmentBasicInfo
- shipmentNo
- orderRef
- fulfillmentRequestNo
- customerRef
- channelRef
- serviceLevel
- incoterm
- createdAt
```

### `endpoints`

```text
ShipmentEndpoints
- shipFrom
- shipTo
- destinationRegion
- routeMode
```

其中：

```text
EndpointAddressSummary
- name
- countryCode
- stateCode
- city
- postalCode
```

### `executionSnapshot`

```text
ExecutionSnapshot
- currentLegNo
- currentLegStatus
- currentNode
- lastMilestone
- nextExpectedMilestone
- timeInCurrentStateMinutes
```

### `lastMilestone`

```text
MilestoneSummary
- milestoneCode
- milestoneLabel
- occurredAt
- source
```

### `nextExpectedMilestone`

```text
ExpectedMilestoneSummary
- milestoneCode
- milestoneLabel
- expectedAt
- confidence
```

### `promiseSnapshot`

```text
PromiseSnapshot
- promiseAt
- eta
- etaVarianceMinutes
- onTimeProbability
```

### `businessFlags[]`
用于摘要性标签，如：
- international
- customs_required
- handoff_required
- tracking_unstable
- exception_open

---

# 9. Right Context Contract

## 9.1 ShipmentRightContext

```text
ShipmentRightContext
- statusSummary
- recommendedActions[]
- relatedObjects[]
- alerts[]
- slaSummary
```

### `statusSummary`

```text
StatusSummaryCard
- currentStatus
- subStatus
- timeInStateMinutes
- riskLevel
- healthScore
```

### `recommendedActions[]`
与 `quickActions[]` 不同：
- `quickActions[]` 用于顶部菜单中的通用动作
- `recommendedActions[]` 用于右侧“下一步建议”

```text
RecommendedAction
- actionCode
- actionLabel
- priority
- rationale
- enabled
- targetObjectType?
- targetObjectRef?
```

### `relatedObjects[]`

```text
RelatedObjectLink
- objectType
- objectRef
- label
- subtitle
- relationType
```

建议支持：
- order
- fulfillment_request
- leg
- case
- billing_case
- route_decision

### `alerts[]`

```text
WorkspaceAlert
- alertId
- severity
- alertType
- title
- summary
- detectedAt
- acknowledged
```

### `slaSummary`

```text
SlaSummary
- promiseAt
- slaStatus
- remainingMinutes
- breachRiskScore
```

---

# 10. Tab Availability Contract

## 10.1 ShipmentTabAvailability

```text
ShipmentTabAvailability
- summary
- routeChain
- timeline
- tracking
- exceptions
- documents
- audit
```

每个 tab 建议用：

```text
TabAvailability
- enabled
- reasonIfDisabled
- badgeCount?
```

示例：
- exceptions.badgeCount = 1
- documents.badgeCount = 4
- tracking.enabled = false, reason = "tracking_not_supported"

---

# 11. Preload Contract

## 11.1 ShipmentWorkspacePreload

用于首屏少量辅助信息，不进入完整 tab 内容。

```text
ShipmentWorkspacePreload
- openExceptionCount
- documentCount
- latestEventSummary
- trackingHealth
```

### `latestEventSummary`

```text
LatestEventSummary
- eventType
- occurredAt
- summary
```

### `trackingHealth`

```text
TrackingHealthSummary
- healthStatus
- lastTrackingUpdateAt
- staleHours
```

---

# 12. 分 Tab 查询契约

建议页面主体采用：

- `Workspace Root Query`
- `Tab Detail Query`
- `Bottom Panel Query`

而不是一个超大接口。

---

## 12.1 Route Chain Tab Query

### Query Name
`ShipmentRouteChainQueryResult`

### Contract

```text
ShipmentRouteChainQueryResult
- shipmentNo
- routeId
- routeStatus
- routeMode
- nodes[]
- legs[]
- routeAnomalies[]
```

### `nodes[]`

```text
RouteNodeView
- nodeCode
- nodeName
- nodeType
- sequence
- arrivedAt
- departedAt
```

### `legs[]`

```text
RouteLegView
- legNo
- sequence
- legType
- carrierCode
- carrierName
- originNode
- destinationNode
- currentStatus
- plannedStartAt
- plannedEndAt
- actualStartAt
- actualEndAt
- dwellMinutes
- anomalyFlags[]
```

### `routeAnomalies[]`

```text
RouteAnomaly
- anomalyCode
- severity
- summary
```

---

## 12.2 Timeline Tab Query

### Query Name
`ShipmentTimelineQueryResult`

### Contract

```text
ShipmentTimelineQueryResult
- shipmentNo
- items[]
```

### `items[]`

```text
TimelineItem
- itemId
- itemType
- occurredAt
- source
- actorType
- actorRef
- objectType
- objectRef
- title
- summary
- anomalyFlag
- correlationId
```

### `itemType` 建议
- domain_event
- tracking_event
- user_action
- case_action
- integration_event
- job_event

---

## 12.3 Tracking Tab Query

### Query Name
`ShipmentTrackingQueryResult`

### Contract

```text
ShipmentTrackingQueryResult
- shipmentNo
- trackingNo
- health
- normalizedMilestones[]
- rawCarrierEvents[]
```

### `health`

```text
TrackingHealth
- healthStatus
- lastTrackingUpdateAt
- staleHours
- anomalyFlags[]
```

### `normalizedMilestones[]`

```text
NormalizedTrackingMilestone
- milestoneCode
- milestoneLabel
- occurredAt
- sourceCarrier
- confidence
```

### `rawCarrierEvents[]`

```text
RawCarrierTrackingEvent
- eventId
- providerEventCode
- providerEventLabel
- providerDescription
- providerTimestamp
- normalizedMilestoneCode
- locationSummary
```

---

## 12.4 Exceptions Tab Query

### Query Name
`ShipmentExceptionsQueryResult`

### Contract

```text
ShipmentExceptionsQueryResult
- shipmentNo
- openCases[]
- closedCases[]
- recommendedResolutionHints[]
```

### `openCases[]` / `closedCases[]`

```text
ShipmentCaseSummary
- caseId
- severity
- status
- reasonCategory
- ownerName
- createdAt
- slaDueAt
- latestActionSummary
```

### `recommendedResolutionHints[]`

```text
ResolutionHint
- hintCode
- label
- rationale
```

---

## 12.5 Documents Tab Query

### Query Name
`ShipmentDocumentsQueryResult`

### Contract

```text
ShipmentDocumentsQueryResult
- shipmentNo
- items[]
```

### `items[]`

```text
ShipmentDocumentItem
- documentId
- documentType
- fileName
- version
- createdAt
- createdBy
- previewAvailable
- downloadAvailable
```

### `documentType` 建议
- label
- manifest
- customs_doc
- pod
- attachment

---

## 12.6 Audit Tab Query

### Query Name
`ShipmentAuditQueryResult`

### Contract

```text
ShipmentAuditQueryResult
- shipmentNo
- records[]
```

### `records[]`

```text
ShipmentAuditRecord
- auditId
- actionType
- actor
- occurredAt
- beforeSummary
- afterSummary
- sourceChannel
```

---

# 13. Bottom Panel 查询契约

底部 panel 不应复用 tab 契约，应单独按对象上下文查询。

---

## 13.1 Events Panel Query

### Query Name
`ShipmentEventPanelQueryResult`

```text
ShipmentEventPanelQueryResult
- shipmentNo
- events[]
```

```text
DomainEventItem
- eventId
- eventType
- occurredAt
- source
- actorType
- actorRef
- summary
- correlationId
- causationId
```

---

## 13.2 Logs Panel Query

### Query Name
`ShipmentLogsPanelQueryResult`

```text
ShipmentLogsPanelQueryResult
- shipmentNo
- logs[]
```

```text
IntegrationLogItem
- logId
- provider
- operation
- requestAt
- responseAt
- latencyMs
- result
- errorCode
- correlationId
```

---

## 13.3 Jobs Panel Query

### Query Name
`ShipmentJobsPanelQueryResult`

```text
ShipmentJobsPanelQueryResult
- shipmentNo
- jobs[]
```

```text
JobExecutionSummary
- jobId
- jobType
- status
- startedAt
- finishedAt
- retryCount
- durationMs
```

---

## 13.4 Audit Panel Query

可直接复用 `ShipmentAuditQueryResult`，但建议在底部 panel 只取最近 N 条。

---

# 14. API 组织建议

## 14.1 推荐 API 形态

建议采用 **workspace root + tab endpoints** 模式。

### Root
```text
GET /api/console/shipments/{shipmentNo}/workspace
```

### Tabs
```text
GET /api/console/shipments/{shipmentNo}/route-chain
GET /api/console/shipments/{shipmentNo}/timeline
GET /api/console/shipments/{shipmentNo}/tracking
GET /api/console/shipments/{shipmentNo}/exceptions
GET /api/console/shipments/{shipmentNo}/documents
GET /api/console/shipments/{shipmentNo}/audit
```

### Bottom Panels
```text
GET /api/console/shipments/{shipmentNo}/panel/events
GET /api/console/shipments/{shipmentNo}/panel/logs
GET /api/console/shipments/{shipmentNo}/panel/jobs
GET /api/console/shipments/{shipmentNo}/panel/audit
```

---

## 14.2 为什么不建议一个超级大接口

因为会导致：

- 首屏过重
- 某一子模块失败拖垮整页
- 缓存粒度粗
- 页面切 tab 时无法按需拉取
- 后端聚合复杂度失控

---

# 15. 加载策略建议

## 15.1 首屏加载
Root Query 首屏必须返回：
- meta
- header
- summaryStrip
- defaultView
- rightContext
- tabAvailability
- preload

## 15.2 次级加载
仅在用户点开 tab 时再请求：
- route chain
- timeline
- tracking
- exceptions
- documents
- audit

## 15.3 底部 panel
仅在 panel 展开后加载。

## 15.4 刷新策略
建议：
- header / rightContext：可支持手动 refresh
- tracking / timeline：可支持对象级局部 refresh
- logs / jobs：panel 内独立 refresh

---

# 16. 错误与空状态契约

Query Contract 必须支持 UI 判断以下状态：

- 无 tracking
- 无 document
- 无 open case
- route chain unavailable
- 某 provider facts unavailable
- 用户无权限查看某 tab

因此建议：
- 对象存在但数据为空 → 返回空集合 + availability enabled
- 数据不可用 → 返回 availability disabled 或 section error metadata

---

## 16.1 Section Error 建议

```text
SectionError
- code
- message
- retryable
```

例如：
- `tracking_provider_timeout`
- `route_projection_unavailable`
- `documents_forbidden`

---

# 17. 权限与能力控制

Root Query 中的 `permissions` 建议至少覆盖：

```text
WorkspacePermissions
- canAssignOwner
- canRecomputeRoute
- canResyncTracking
- canOpenCase
- canViewDocuments
- canViewAudit
- canEscalate
```

UI 动作启用与否，不应仅靠前端规则判断，应以该契约为准。

---

# 18. 推荐 JSON 骨架示例

```json
{
  "meta": {
    "objectType": "shipment",
    "objectRef": "SHP-240316-001",
    "workspaceVersion": "v1",
    "generatedAt": "2026-03-16T14:30:00+09:00",
    "timezone": "Asia/Tokyo"
  },
  "header": {
    "shipmentNo": "SHP-240316-001",
    "displayTitle": "SHP-240316-001",
    "currentStatus": "in_transit",
    "subStatus": "tracking_stale",
    "riskLevel": "high",
    "slaUrgency": "breach_risk",
    "owner": {
      "ownerType": "user",
      "ownerRef": "u_1024",
      "ownerName": "Amy"
    },
    "lastUpdatedAt": "2026-03-16T14:22:00+09:00",
    "quickActions": [
      {
        "actionCode": "resync_tracking",
        "actionLabel": "Resync Tracking",
        "enabled": true,
        "confirmationRequired": false,
        "actionGroup": "recovery"
      }
    ]
  },
  "summaryStrip": {
    "carrier": {
      "carrierCode": "USPS",
      "carrierName": "USPS",
      "serviceCode": "PM",
      "serviceName": "Priority Mail"
    },
    "activeLeg": {
      "legNo": "LEG-02",
      "legType": "last_mile",
      "status": "in_transit",
      "originNode": "JP-HUB-01",
      "destinationNode": "TOKYO-LAST"
    },
    "promise": {
      "promiseAt": "2026-03-16T18:00:00+09:00",
      "eta": "2026-03-16T18:35:00+09:00",
      "etaConfidence": 0.68,
      "promiseVarianceMinutes": 35
    },
    "ownerName": "Amy"
  },
  "defaultView": {
    "basicInfo": {
      "shipmentNo": "SHP-240316-001",
      "orderRef": "ORD-9001",
      "fulfillmentRequestNo": "FR-7001",
      "serviceLevel": "express"
    }
  },
  "rightContext": {
    "recommendedActions": [
      {
        "actionCode": "resync_tracking",
        "actionLabel": "Resync Tracking",
        "priority": "high",
        "rationale": "No carrier update for 3 hours"
      }
    ]
  }
}
```

---

# 19. P0 冻结建议

P0 最值得先冻结的契约对象：

1. `ShipmentWorkspaceQueryResult`
2. `ShipmentWorkspaceHeader`
3. `ShipmentSummaryStrip`
4. `ShipmentSummaryView`
5. `ShipmentRightContext`
6. `ShipmentRouteChainQueryResult`
7. `ShipmentTrackingQueryResult`
8. `ShipmentExceptionsQueryResult`

这些对象一旦稳定，Shipment Detail Workspace 就可以进入前后端并行开发。

---

# 20. 最终裁决

对于 LOMS 这种复杂、多对象、事件密集型系统，`Shipment Workspace` 不应实现成“详情页拼装器”，而应实现成：

**一个以 Shipment 为中心的 UI-facing Query Workspace Contract**。

这意味着：
- UI 看到的是稳定 view model
- 后端内部可以自由调整 projection / read model / join 机制
- 页面可以在不暴露领域内部复杂性的情况下高质量落地

这才是最适合 Workbench 式控制台的实现方式。

---

# 21. 下一步建议

最自然的后续文档是：

1. `Exception Workbench Query Contract Draft`
2. `Shipment Workspace API Error Code & Empty State Contract`
3. `Shipment Workspace Frontend TypeScript Types Draft`
4. `Shipment Workspace Backend Query Facade ADR`

如果按实施顺序，建议下一步直接完成：

**Exception Workbench Query Contract Draft**

因为它会和 Shipment Workspace 构成整个控制台最核心的两张页面契约。

