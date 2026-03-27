# IDP Token Migration Playbook v1

## 1. 目标

本手册用于把当前 `idpxyz-*` 视觉变量体系平滑迁移到统一的 IDP Token 体系，且不破坏现有 UI。

当前已落地文件：

- `src/design-system/tokens/coreTokens.ts`
- `src/design-system/theme/applyThemeTokens.ts`
- `src/ThemeContext.tsx`（已接入 `applyThemeTokens`）

---

## 2. 全量范围（已完成）

- Foundation：`space` / `radius` / `borderWidth` / `motion` / `shadow`
- Semantic：`bg.*` / `text.*` / `border.*` / `status.*` / `focus.*`
- Component：`button` / `input` / `table` / `tabs` / `badge` / `panel`
- Density：`comfortable` / `compact`
- Layout：`topbar` / `sidebar` / `rightPanel` / `bottomPanel`
- Product Accent：`product.*.accent`
- Theme：`light` / `dark` 双模式
- Chart：`series.*` + `semantic.*`
- Studio：`canvas.*` + `inspector.*`

---

## 3. 命名规范（代码侧）

### 3.1 Canonical CSS Variables

统一采用 `--ds-` 前缀：

- `--ds-bg-canvas-default`
- `--ds-text-primary`
- `--ds-border-default`
- `--ds-status-danger-fg`
- `--ds-space-4`
- `--ds-radius-lg`
- `--ds-motion-duration-normal`
- `--ds-product-accent`

### 3.2 兼容桥变量

现有 Tailwind 主题仍消费 `--idpxyz-*`，通过 `applyThemeTokens` 映射：

- `--idpxyz-bg <- --ds-bg-canvas-default`
- `--idpxyz-text <- --ds-text-primary`
- `--idpxyz-border <- --ds-border-default`
- `--idpxyz-accent <- --ds-product-accent`

这样可“先引入 token，再分批替换组件”。

---

## 4. 统一交付清单（已完成）

1. 新建全量 token 定义：`src/design-system/tokens/coreTokens.ts`
2. 新建 runtime 主题应用器：`src/design-system/theme/applyThemeTokens.ts`
3. 在 `ThemeContext` 注入 token 应用
4. 建立 `--ds-* -> --idpxyz-*` 兼容桥，确保现有页面零中断
5. 完成文档侧命名和结构收敛（不再按 P 阶段命名）

## 5. 持续治理动作（非分阶段）

1. Tailwind config 逐步改为直接消费 `--ds-*`
2. 页面硬编码颜色持续清零
3. `--idpxyz-*` 兼容桥在稳定后下线
4. Figma 与代码 token 命名保持单一事实来源

---

## 6. 组件优先替换建议

按收益排序：

1. `Button`
2. `Table`
3. `Tabs`（Workbench + Content 两套）
4. `Badge/Status Pill`
5. `Panel/Card`

原因：这些组件覆盖率最高，替换后会立刻稳定跨页面视觉语义。

---

## 7. 风险与控制

### 风险 A：视觉回归

- 控制：保留 `--idpxyz-*` 兼容层一段时间，先“等价映射”再“语义升级”

### 风险 B：组件绕过 token

- 控制：Lint/CodeReview 规则禁止新写 hex，统一从 token 取值

### 风险 C：Light/Dark 不一致

- 控制：semantic token 必须双主题成对定义，不允许只配单主题

---

## 8. 执行检查清单

- [ ] 新增样式不再直接写 hex
- [ ] 新组件只消费 semantic/component token
- [ ] `status.*` 语义在所有页面一致
- [ ] `light/dark` 切换视觉稳定
- [ ] 每次 token 变更有变更记录（变更项/影响范围/是否破坏性）

---

## 9. 结论

当前方案适合作为 IDP 全产品 UI 基础设施的第一版可执行 token 体系：

- 结构正确
- 演进路径清晰
- 兼容现网实现
- 可渐进式迁移
