# IDP 工作台壳（Workbench shell）

各产品 App（如 `loms-web`、`myshop-web`）在布局上应遵循同一套 **DOM 顺序与 flex 约定**，以便共用 `@idpxyz/ui-workspace` 与主题。业务路由、底部面板、右侧栏内容仍放在各 App 内。

## 组件树（自上而下）

1. `ThemeProvider`（`product` 与产品一致：`loms` | `oms` | …）
2. `ToastProvider`（`@idpxyz/ui-theme-runtime`，与 Primitives 的 Toaster 二选一，勿混用）
3. 根容器：`h-screen w-screen flex flex-col overflow-hidden bg-vscode-bg`
4. `TitleBar`（可选：全屏/专注模式时可条件隐藏）
5. 主行：`flex flex-1 overflow-hidden`
   - `ActivityBar`（同上，可条件隐藏）
   - 可选：`Sidebar` + 水平 `resize-handle-h`
   - 主列：`flex-1 flex flex-col overflow-hidden`
     - **分屏容器**（`ref` 必须挂在 `useSplitResize` 返回的 `containerRef` 上）：`flex-1 flex overflow-hidden` + `flex-row` 或 `flex-col`
     - 每个 `EditorGroup` 占一列；多组时分隔条用 `resize-handle-v` / `resize-handle-h`，`onMouseDown` 使用 **当前方向** 对应的 `useSplitResize(...).handleMouseDown`
     - 可选：底部 `resize-handle-v` + `BottomPanel`（高度由 `useResize` vertical + `reverse` 管理）
   - 可选：右侧 `resize-handle-h` + `RightSidebar`
6. `StatusBar`
7. `CommandPalette`（受控 `open` / `onClose`）

## 分屏与拖拽

- 编辑器分屏比例：**两个** `useSplitResize('horizontal' | 'vertical')`，按 `splitDirection` 选用 `activeSplitResize`，不要把一套手写 `mousemove` 与另一套混用。
- 侧栏 / 底栏 / 右栏宽度：`useResize`，与 `ui-workspace` 导出保持一致。

## 状态与持久化

- 工作台状态（`groups`、`activeGroupId`、`closedTabs`、`recentObjects`、各面板显隐与尺寸、分屏比例）建议集中在 `hooks/useWorkspaceState.ts` 这类模块中，便于与壳结构文档对照；**localStorage 的 key 按产品区分**。

## 参考实现

- `apps/loms-web/src/App.tsx` + `apps/loms-web/src/hooks/useWorkspaceState.ts`
- `apps/myshop-web/src/App.tsx` + `apps/myshop-web/src/hooks/useWorkspaceState.ts`

## 编辑器标签（`EditorGroup`）

右键菜单与 **拖拽排序** 依赖父组件传入的回调：`onTabReorder`、`onCloseOthers`、`onCloseToRight`、`onCloseAll`、`onTabPin`、`onReopenClosed` 等。若传入空函数，交互不会更新状态。脚手架可使用 **`useEditorGroupTabState`**（`@idpxyz/ui-workspace`）管理本地 `EditorGroupData` 与上述回调；完整产品可改用 `useWorkspaceState` 等多组/持久化方案。

## 脚手架（新应用）

在 **`idp-ui` 仓库根目录**执行：

```bash
pnpm create-app <app-dir-name> [--product loms] [--port 5175] [--deps workspace|registry] [--ui-version x.y.z]
```

示例：`pnpm create-app acme-web --product prism --port 5180`

- **`--deps workspace`（默认）**：从 **`templates/workbench-app`** 生成，`@idpxyz/*` 使用 **`workspace:*`**，与仓库内 `packages/*` 联调。
- **`--deps registry`**：从 **`templates/workbench-app-registry`** 生成，`@idpxyz/*` 使用 **`^x.y.z`**（默认取生成时 **`packages/ui-workspace` 的 `version`**，可用 `--ui-version` 覆盖），从 **GitHub Packages** 安装；适合模拟独立仓库消费者，需在 `~/.npmrc` 配置 `//npm.pkg.github.com/:_authToken`。生成应用内含 **`link-workspace-packages=false`**，即使在 monorepo 的 `apps/` 下也会向 registry 解析（与独立项目一致）。

两种模板均包含 **底部面板 / 右侧栏** 占位与 `useResize`；业务内容在 App 内替换即可。
- 生成后会在根目录执行 **`pnpm install`**（若失败请手动执行）。
- 开发：`pnpm --filter @idpxyz/<app-dir-name> dev`

`--product` 须为 `packages/ui-tokens` 中已有 `ProductKey`（如 `loms`、`oms`、`prism` 等）。
