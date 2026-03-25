# Canonicalization Studio Left Sidebar UX 评估

针对 **Canonicalization Studio Workbench** 左侧面板（Left Sidebar）的 UX 评估，不涉及 LOMS Console 全局导航。

---

## 1. 当前实现概览

- **结构**：三个 Tab 互斥切换 — Source Schema、Canonical Model、Samples
- **内容**：Source Payload 树、Canonical Fields 树、Sample Payloads 列表
- **宽度**：可拖拽 180–400px
- **交互**：Tab 切换、树节点展开/折叠

---

## 2. 主要问题

### 2.1 Tab 互斥导致 Mapping 效率低（核心问题）

**现状**：Source Schema 与 Canonical Model 为互斥 Tab，一次只能看一个。

**设计文档要求**（Canonicalization_Studio_Final_Solution_v1 §4.2）：
> Left Panel 用于提供输入上下文：Source payload 树、Source schema、**Canonical schema**、Sample payload 列表

**影响**：Mapping 的核心动作是「从 source 字段映射到 canonical 字段」。Tab 互斥迫使用户频繁切换才能对照两边，打断工作流，效率明显下降。

---

### 2.2 无法拖拽到 Mapping Grid

**现状**：Schema 树与 Samples 均为只读展示，无拖拽交互。

**影响**：用户需在 Bottom Panel 的 Mapping Grid 中手动输入 `sourcePath`（如 `order.shipping.carrier`），无法从 Source 树拖入，易出错且效率低。

---

### 2.3 无搜索/过滤

**现状**：Schema 树无搜索框，字段多时需手动滚动查找。

**影响**：Source / Canonical 字段较多时，定位成本高。

---

### 2.4 Section 标题与 Tab 语义重叠

**现状**：Tab 为「Source Schema」「Canonical Model」，内容区又有「Source Payload」「Canonical Fields」标题。

**影响**：层级不清晰，存在重复概念。

---

### 2.5 Samples 与 Schema 混在同一侧栏

**现状**：Samples 与 Schema 共用 Left Sidebar，通过 Tab 切换。

**影响**：Samples 用于测试，Schema 用于映射，使用场景不同。混在一起且互斥，切换成本高；且 Samples 可能更适合放在 Bottom Panel 的 Preview 区或独立入口。

---

### 2.6 树节点交互弱

**现状**：树节点仅支持展开/折叠，无右键菜单、无复制 path、无「添加到 mapping」快捷操作。

**影响**：无法快速把字段加入 Mapping Grid，需手动输入路径。

---

## 3. 改进建议（按优先级）

### P0：Source + Canonical 并列展示

- 将 Source Schema 与 Canonical Model 改为**可折叠 Section**，可同时展开
- 上下分区：Source Payload 树 | Canonical Fields 树，各自可独立滚动
- 支持同时查看两边，减少 Tab 切换

### P1：支持拖拽到 Mapping Grid

- Source 树节点可拖拽到 Bottom Panel 的 Mapping Grid
- 或支持点击/右键「Add to mapping」自动填入 `sourcePath`

### P2：增加搜索

- 在 Source / Canonical 区各加搜索框，支持按字段名过滤

### P3：Samples 独立或下沉

- 将 Samples 移至 Bottom Panel 的 Preview 区，或作为独立 Tab
- 左侧专注 Schema 上下文，减少认知负担

### P4：树节点快捷操作

- 右键菜单：Copy path、Add to mapping
- 或悬停显示「+」按钮快速添加

---

## 4. 参考规范

| 规范 | 相关要求 |
|------|----------|
| Canonicalization_Studio_Final_Solution_v1 | §4.2 Left Panel：Source payload 树、Source schema、Canonical schema、Sample payload 列表 — 作为**上下文**同时提供 |
| Studio 类规范 | 左侧：资源、图层、模板、组件、节点；应支持高密度工作流 |

---

## 5. 结论

Canonicalization Studio Left Sidebar 的核心问题：

1. **Tab 互斥**：Source 与 Canonical 无法同时查看，违背 Mapping 工作流
2. **无拖拽**：无法从 Schema 树直接映射到 Grid
3. **无搜索**：字段多时定位困难

建议优先落实 **P0 并列展示** 和 **P1 拖拽支持**。
