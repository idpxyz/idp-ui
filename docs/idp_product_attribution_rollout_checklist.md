# IDP 产品归属信息推广清单

基于 Canonicalization Studio 的 `LOMS / IDP · {模块名}` 模式，本清单用于指导后续模块的归属信息补充与验收。

---

## 1. 设计规范（已完成）

- [x] `idp_product_ux_ui_design_system_handbook_v_1.md` §16.1.1 新增「Top Bar 归属信息规范」
- [x] `Canonicalization_Studio_Final_Solution_v1.md` 新增「0. 产品归属」章节
- [x] Studio 类示例中补充 Canonicalization Studio 作为 LOMS/IDP 模块说明

---

## 2. 待补充归属的模块

| 模块 | 产品 | 文件路径 | 当前标题 | 建议格式 |
|------|------|----------|----------|----------|
| Exception Workbench | LOMS | `idp-ui/apps/loms-web/src/loms/pages/ExceptionWorkbench.tsx` | Exception Workbench | LOMS / IDP · Exception Workbench |
| Ops Console | LOMS | `idp-loms/apps/loms-web/src/pages/OpsPage.tsx` | Ops Console | LOMS / IDP · Ops Console |
| LOMS Operations Workbench | LOMS | `idp-ui/apps/loms-web/src/App.tsx` | LOMS Operations Workbench | LOMS / IDP · Operations Workbench |
| PolicyOps Console | RuleMesh | `idp-rulemesh/web/console/src/components/layout/AppLayout.tsx` | PolicyOps Console | RuleMesh / IDP · PolicyOps Console |
| TitleBar（通用壳层） | 多产品 | `idp-ui/packages/ui-workspace/src/TitleBar.tsx` | 按产品注入 | 需支持 `product` / `module` props |
| Prism TopBar | Prism | `idp-prism/prism/ux-labs/src/components/layout/top-bar.tsx` | — | Prism / IDP · {当前页面} |
| LedgerMesh Header | LedgerMesh | `idp-ledgermesh/apps/ledgermesh-web/src/components/layout/Header.tsx` | — | LedgerMesh / IDP · {模块} |

---

## 3. 实施顺序建议

1. **P0**：LOMS 相关（Exception Workbench、Ops Console、Operations Workbench）— 与 Canonicalization Studio 同产品线，优先统一
2. **P1**：RuleMesh PolicyOps Console — 跨产品验证模式
3. **P2**：通用 TitleBar 支持归属 props — 为 myshop-web、loms-web 等壳层提供统一能力
4. **P3**：Prism、LedgerMesh 等 — 随各产品 UI 迭代补充

---

## 4. 验收标准

- Top Bar / Page Header 左侧可见 `{产品} / IDP · {模块名}`
- 归属信息样式弱于模块名（muted）
- 与设计手册 §16.1.1 一致

---

## 5. 可选：可复用组件

若多处需要，可抽取 `ProductAttribution` 组件：

```tsx
// 示例 API
<ProductAttribution product="LOMS" module="Canonicalization Studio" />
// 渲染: LOMS / IDP · Canonicalization Studio
```

放置于 `@idp/ui-primitives` 或 `ui-workspace`，供各产品消费。
