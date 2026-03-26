### 学习目标（用 `oms-demo-web` 做载体）
- **掌握 React 基础**：组件、JSX、props、状态、渲染周期与副作用
- **能写出可维护的页面**：列表页搜索/筛选/排序、组件拆分与复用
- **理解中型应用状态**：Tabs、分屏、关闭栈（undo）、事件驱动的 state 更新
- **具备工程化习惯**：TypeScript 类型、组件边界、可测试的逻辑拆分

---

### 学习路线（建议 2–3 周，按你节奏可拉长）

#### 第 0 天：跑起来 + 认识目录（30–60 分钟）
- **目标**：能跑 `oms-demo-web`，知道改哪里会生效  
- **阅读**：
  - `apps/oms-demo-web/src/main.tsx`：入口挂载
  - `apps/oms-demo-web/src/App.tsx`：整体布局/路由（tabs）
  - `apps/oms-demo-web/src/mock/oms.ts`：mock 数据来源
- **产出**：能描述“侧栏点菜单 → 打开 tab → EditorGroup 渲染页面”的链路

#### 第 1–2 天：React 基础（组件 + props + state）
- **目标**：能写一个受控输入框、能把 UI 拆成小组件
- **练习（以 `OrdersOverviewPage` 为主）**：
  - 加 **搜索框**：`useState` 保存 query，`useMemo` 过滤 `mockOrders`
  - 抽一个 `<StatusPill />` 组件：用 props 控制颜色/文案
- **关键点**：受控组件、条件渲染、列表渲染 key、`useMemo` 的意义

#### 第 3–5 天：列表页常用模式（筛选/排序/派生状态）
- **目标**：能写“搜索 + 状态筛选 + 排序 + 统计”
- **练习**：
  - 状态筛选（全部/待处理/已发货/已完成）
  - 点击表头排序（升/降/无）
  - 页面顶部显示统计：总数/各状态数（派生数据）
- **关键点**：把“源数据”与“派生数据”分开；避免重复 state

#### 第 6–8 天：中型状态管理（tabs/分屏）
- **目标**：看懂并能小改 `useOmsWorkbenchState`
- **阅读重点**：`apps/oms-demo-web/src/hooks/useOmsWorkbenchState.ts`
  - `groups` / `activeGroupId` / `splitDirection`
  - `openNavTab`、`closeTab`、`reorderTab`、`split`
- **练习**：
  - 给 `openNavTab` 加一个策略开关：新 tab 是否进“左侧 pane / 当前 pane”
  - 增加一个“关闭组”按钮（仅 demo）：当某组没 tab 时自动移除（你已经有接近逻辑）

#### 第 9–12 天：副作用与快捷键（useEffect）
- **目标**：能安全地绑定/解绑事件，避免在输入框里误触
- **练习**：
  - 把快捷键逻辑抽成 `useHotkeys(...)`（hook），并传入回调
- **关键点**：依赖数组、闭包、何时需要 `useCallback`

#### 第 13+ 天：工程化与质量
- **目标**：写得更像真实项目
- **练习**：
  - 给 mock 数据和页面组件补类型（你已经有一部分）
  - 统一 UI 原子组件（按钮/表格/卡片）
  - 补一两个 Story（学习组件隔离）

---

### 每天怎么学最有效（建议节奏）
- **15 分钟读代码**：只看一个文件、画出数据流
- **45–90 分钟做一个小改动**：能在 UI 上看到结果
- **10 分钟复盘**：写下“我改了什么 state，为什么要这样设计”

---

### 下一步（我来带你做的第一个练习）
我建议从 **“订单概览加搜索框 + 状态筛选”** 开始（最适合练 React 基础）。  
你告诉我你希望搜索哪些字段：**订单号/客户/渠道/全部**，我就直接按你选择把改动落到 `OrdersOverviewPage.tsx`，并保证 UI 体验好、类型不报错。