# Canonicalization Studio 未实现功能清单

基于设计文档（Canonicalization_Studio_Final_Solution_v1）与当前实现对比。

---

## 1. 后端集成

| 功能 | 状态 | 说明 |
|------|------|------|
| Save Draft API | 未实现 | 当前仅 toast，无持久化 |
| Publish API | 未实现 | 当前仅 toast，无实际发布 |
| Preview Test API | 未实现 | Preview 使用 setTimeout 模拟，未调用 `/api/v1/intake/pipeline/preview` |
| Pipeline / Mapping CRUD | 未实现 | 数据来自 demo-pipelines.ts 硬编码 |

---

## 2. Top Toolbar

| 功能 | 状态 | 说明 |
|------|------|------|
| Undo | 未实现 | 按钮 disabled |
| Redo | 未实现 | 按钮 disabled |
| Preview Test | 未实现 | 点击无实际调用，未与 Preview 联动 |
| Save / Publish | 模拟 | 仅 toast，无 API |

---

## 3. Left Panel

| 功能 | 状态 | 说明 |
|------|------|------|
| 枚举字典 / reference data | 未实现 | 设计文档 §4.2 要求，当前无 |
| Schema 搜索/过滤 | 未实现 | 字段多时无搜索 |
| Source/Canonical 按 Pipeline 切换 | 未实现 | 树为固定 demo，未随 pipeline 变化 |
| 拖拽到 Mapping Grid | 未实现 | 仅有 Copy / Add to mapping 点击 |

---

## 4. Center Canvas (React Flow)

| 功能 | 状态 | 说明 |
|------|------|------|
| 添加节点 | 部分 | 有 add node，但类型/配置有限 |
| 删除节点 | 已实现 | ✓ |
| 节点状态摘要 | 部分 | 有基础展示，无 fieldCount/mappedCount 等 |
| Lineage / execution trace | 未实现 | 设计文档 §5.1 扩展项 |
| Error path 可视化 | 未实现 | 设计文档 §5.1 扩展项 |

---

## 5. Right Panel (Inspector)

| 功能 | 状态 | 说明 |
|------|------|------|
| 节点基本信息编辑 | 部分 | 有 label 等 |
| 绑定 schema / profile | 未实现 | 无 profile 选择器 |
| 样本测试 | 未实现 | 无单规则测试 |
| 错误统计 | 未实现 | 无 per-node 错误数 |
| 发布信息 | 未实现 | 无 publish 元数据展示 |

---

## 6. Bottom Panel

| 功能 | 状态 | 说明 |
|------|------|------|
| Mapping Grid | 已实现 | ✓ 含 inline edit、enum、fallback |
| Preview | 模拟 | 使用 mock 数据，未调 API |
| Validation Errors | 已实现 | ✓ 基于规则校验 |
| Diff | 模拟 | 使用 MOCK_DIFF 静态数据，非真实版本对比 |
| Diff 与版本联动 | 未实现 | 无法选择对比版本 |

---

## 7. 数据与状态

| 功能 | 状态 | 说明 |
|------|------|------|
| 多 Pipeline 切换 | 已实现 | ✓ |
| Pipeline 持久化 | 未实现 | 切换后无保存 |
| Mapping 持久化 | 未实现 | 修改仅内存 |
| 版本历史 | 未实现 | 无 v1.0 / v1.1 等版本列表 |
| 多租户 / Scope | 未实现 | 无 tenant / site 切换 |

---

## 8. 建议实现顺序

1. **P0**：Preview Test 调用后端 API（或 mock 更真实）
2. **P1**：Save Draft / Publish 对接 API
3. **P2**：Undo / Redo（基于 command 模式）
4. **P3**：Left Panel Schema 随 Pipeline 切换
5. **P4**：Diff 与真实版本数据联动
6. **P5**：枚举字典 / reference data 区
