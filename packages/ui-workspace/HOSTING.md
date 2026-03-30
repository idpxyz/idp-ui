# Workspace 宿主约定（EditorGroup / 分屏）

`@idpxyz/ui-workspace` 提供 **无业务状态** 的壳组件；**多编辑器组、当前焦点组、tab 列表** 由宿主应用维护。下列约定来自 Parcel / LOMS 分屏实践，可避免「左右互扰、焦点错乱、隐藏 tab 仍跑副作用」等问题。

---

## 1. 分屏 DOM：不要用 `display: contents` 包一整格

- **避免**：在 flex 分屏容器里用 **`className="contents"`** 包裹「左侧一组 / 右侧一组」的外壳。`contents` 会让子节点顶到上层 flex，**指针命中与焦点边界**在部分场景下不符合直觉。
- **推荐**：用 **`Fragment` + `key={group.id}`**，每个分屏格是 **普通 flex 子节点**（`display: flex; flex-direction: column; min-width: 0; min-height: 0`），内层再放 `EditorGroup`。

---

## 2. 焦点（active editor group）

- 在 **分屏格容器**（包住单个 `EditorGroup` 的那层 `div`）上使用 **`onPointerDownCapture`**，在捕获阶段把「当前焦点组」设为该格的 `group.id`（与 VS Code 先点哪边哪边接收后续命令一致）。
- `EditorGroup` 的 **`onActivate`** 在点击组内区域时也会触发；子元素若 **`stopPropagation`**，可能点不到组外壳，因此 **capture 更稳**。

---

## 3. 状态机：组与 tab 的独立性

- **每个 `EditorGroupData` 一条记录**：各自维护 `tabs[]` 与 `activeTab`；**切某一组的 tab 只改该组**，不要在一次 `setGroups` 里误改另一组。
- **`EditorGroupData.id` 在 `groups[]` 内必须唯一**。若用 `group-0`、`group-1` 自增，**刷新后**须根据 **已持久化的 `groups`** 计算下一个序号（例如取现有 `group-n` 的最大 `n` 再 +1），避免与 localStorage 里的 id **撞号**。撞号时，一次 `clickTab` 可能更新 **多个** 同 id 的组，表现为「左边切 tab 右边跟着变」。
- **`openTab`（打开路由 tab）**：分屏下应 **按目标组追加或激活**，不要实现「全工作区已存在该 `tabId` 就跳到第一个组」的全局去重，否则焦点会被拉到另一侧。

---

## 4. `preserveInactiveTabContent`

- 为 `true` 时，**非当前 tab 的页面仍挂载**，仅 `hidden`。宿主页面若使用 **全局 React Query、定时器、自动选第一行** 等，应对 **`useWorkspaceTabPanel()` 的 `isActiveTab`** 做门控，或对查询使用 `enabled: isActiveTab`。
- `EditorGroup` 已在每个 tab 面板上注入 **`WorkspaceTabPanelProvider`**（`editorGroupId`、`tabId`、`isActiveTab`）。

---

## 5. React Query（可选）

- 列表类 **同一 `queryKey`** 时，多格共享缓存是预期行为；**交互/UI 状态**（选中行、滚动、向导 dirty）应按 **`editorGroupId`（或 tab 面板作用域）** 隔离。
- 仅在确有「每格独立服务端视图」时再拆 **per-pane queryKey**。

---

## 相关导出

| 符号 | 用途 |
|------|------|
| `WorkspaceTabPanelProvider` / `useWorkspaceTabPanel` | 当前 tab 面板元数据（含 `isActiveTab`） |
| `EditorGroup` | Tab 条 + 内容区；支持 `preserveInactiveTabContent` |
| `runWorkspaceNavigationGuard` | 与 `beforeNavigation` 配合的导航守卫 |

更多 API 见包内 `src/index.ts` 与 TypeScript 类型。
