# ML Concept Designer (ML‑CD)

## ML Concept Designer (ML-CD) - 项目进度追踪（当前阶段）
- 当前阶段：Part 5 - 交互、公式与国际化

### 功能（MVP 进度）
- 拖拽式编辑器：支持常见节点类型与连线创建
- 节点类型：Input/FC/Conv/Pooling/RNN/Output/Loss/Optimizer 等
- 边类型：默认、箭头、残差（虚线）
- 画布交互：选择/移动/缩放、吸附网格、对齐/分布
- 属性编辑：标签、颜色、（边）颜色与文本标签
- 公式支持：公式标签 formulaLabel + KaTeX 渲染
- 导入导出：JSON（保存/加载）、CSV（Export to Sheets）、PNG（截图）
- 快捷键：删除、保存/打开、导出、Fit/Center 等

**[P1: 交互与专业内容]**
- [x] P1.1 节点自由拉伸 (Resizable Nodes)
- [x] P1.2 节点内公式标签支持 (LaTeX/Markdown)
- [x] P1.3 连接线属性编辑 (Edge Properties Panel)

**[P2: 系统与可用性]**
- [x] P2.1 基础国际化 (i18n) 集成
一句话定位：一个开源、免费、基于 Web 的工具，专注于生成高清晰度、专业且具有出版质量的机器学习概念图和系统架构图。
 - [x] P2.2 画布网格与对齐增强 (Snap to Grid)
 - [x] P2.3 代码重构与清理 (持续进行)

**[已完成基础]**
- [x] Vite + React + TypeScript 项目初始化

愿景（Vision）：成为面向研究人员、学生和工程师的 BioRender for ML/AI。

痛点（Problems）：现有通用制图工具（PPT/Visio/Draw.io）在抽象 ML 概念图上存在专业图标缺失、效率低、风格不统一等问题。

核心编辑范式：以拖拽式（Drag‑and‑Drop）编辑器为核心，长期演进到 AI Prompt‑to‑Diagram，实现“描述即成图”。

## 快速开始
- 依赖：Node.js 18+
- 安装：`npm install`
- 开发：`npm run dev` → 访问 `http://localhost:5173`
- 构建：`npm run build`

## 自监督进度跟踪 (P3.2 / P3.3 / P5.1)
- 更新时间: 2025-10-14
- P3.2 对齐/分布 (F_ALIGN): [x] 已完成 — 见 `src/components/Toolbar.tsx`；参阅本文件章节“Update: P3.2 (F_ALIGN)”。
- P3.3（待明确）: [ ] 未开始 — 下一步：明确需求与验收标准，设计交互与状态变更方案。
- P5.1（待明确）: [ ] 未开始 — 下一步：界定范围（如：导出/分享/性能等），拆分子任务与依赖。

维护规则（自监督）：
- 涉及上述条目的实现/重构/回归修复，请同步更新本节状态与“Update:”小节的一行摘要。
- 若条目定义或范围调整，请先在本节修正文案，再开展开发工作。
- 维护命令：`npm run progress:date` 自动更新本节“更新时间”。

## 技术栈（Core Technology Stack）
- React 18 + TypeScript 5
- Vite 5 + @vitejs/plugin-react
- Tailwind CSS 3 + PostCSS + Autoprefixer
- React Flow 11（节点、连接、缩放、选择、DnD）
- Zustand 4（全局状态）
- html-to-image（PNG 导出）

优势摘要
- 前端框架：React + TypeScript 保证代码质量、类型安全和组件化开发。
- 构建工具：Vite 极速开发和构建体验（ESM + HMR）。
- 画布引擎：React Flow 专注于图表结构和交互（节点、连接、缩放）。
- 样式：Tailwind CSS 快速、一致地应用专业美观的 UI 样式。
- 状态管理：Zustand 轻量级、简洁，避免过度复杂化。

## 目录导航（常用文件）
- `src/diagram/DiagramCanvas.tsx` 画布与交互逻辑
- `src/diagram/DiagramState.ts` 全局状态（nodes/edges/选中）
- `src/nodes/*` 节点渲染与样式
- `src/edges/*` 自定义边（含残差边）
- `src/components/*` Sidebar/Toolbar/PropertiesPanel 等 UI
- `src/sheets/*` Export to Sheets（CSV/JSON 导入导出）
- `docs/项目总纲.md` 项目总纲与路线图

## 项目进度（每次更新必填）
对应本 Prompt 的功能列表，使用 [x]/[ ] 标注：

当前阶段目标：Part 5 核心功能实现

已完成 [x]
- [x] 节点自由拉伸：新增高度控制（QuickPanel 滑块），宽高分别可调
- [x] LaTeX/公式支持：引入 KaTeX（CDN），节点标签支持 LaTeX 渲染（可开关）
- [x] P1.2(F_LATEX): 公式标签支持（formulaLabel + KaTeX），PropertiesPanel 增加“公式标签（可选）”\n- [x] 连接线属性编辑：线条粗细、标签可编辑（QuickPanel）
- [x] 基础国际化（i18n）：内置语言开关（中文/English），支持文案扩展
- [x] 拖拽式编辑器：核心节点（Input/FC/Conv/Pooling/RNN/Output/Loss/Optimizer）
- [x] 边类型：箭头/残差等自定义边
- [x] 画布交互：选择/移动/缩放、基础对齐辅助、删除
- [x] 属性编辑：侧边栏/属性面板（标签、颜色、尺寸）
- [x] 导出 PNG（html-to-image）
- [x] 导入导出 JSON（{ nodes, edges }）
- [x] Export to Sheets：导出 `nodes.csv`/`edges.csv`，并支持导入
- [x] 快捷键（保存/打开/导出/删除 等基础能力）
- [x] 技术栈落地：React 18/TS 5/Vite 5/Tailwind 3/React Flow 11/Zustand 4
- [x] 文档：新增并维护 `docs/项目总纲.md`（愿景、定位、路线图、技术栈优势等）

待办 [ ]
- [ ] 撤销/重做；吸附、对齐与分布增强；智能连线提示
- [ ] 模板与片段库（CNN/RNN/Transformer 常用结构）
- [ ] 分组/子图/模块化复用；长图导航与折叠
- [ ] 自动布局（层次/网格/力导）
- [ ] 导出 SVG/Mermaid；分享链接（只读视图/URL 编码）
- [ ] 国际化（中/英）与可访问性增强
- [ ] Export to Sheets 增强：CSV 校验与错误提示；可选列映射；（可选）Google Sheets 同步
- [ ] Prompt‑to‑Diagram 与语义建议（自动补全连接与参数）
- [ ] README 编码与内容保持 UTF‑8/最新（本次已修复编码并重构结构）

## 本次更新摘要
- 新增组件：`src/components/MathText.tsx`（LaTeX 渲染），`src/components/QuickPanel.tsx`（快速属性面板），`src/components/LangSwitch.tsx`（语言开关）
- 节点标签支持 LaTeX：已在 `src/nodes/*Node.tsx` 中应用 `MathText`
- 节点自由拉伸：新增高度数据字段（JSON/CSV 持久化），通过 QuickPanel 高度滑块调整
- 连接线属性编辑：QuickPanel 中新增线宽与标签编辑；默认边可显示 `label`
- 基础 i18n：引入 `src/i18n/`，添加语言切换 UI（右上角）
- CSV Schema 更新：`src/sheets/schema.ts` 新增 `height`；同步更新导入导出逻辑
- LaTeX 资源：在 `index.html` 注入 KaTeX CSS/JS（CDN），可离线替换为本地依赖
 - P1.1（F_RES）：移除 PropertiesPanel 宽度滑块，启用 React Flow 原生 NodeResizer，实现所有自定义节点（FC/Conv/Data/Box/Circle/Tensor/Activation）通过手柄自由拉伸；引入 `@reactflow/node-resizer` 样式于 `src/main.tsx`

## 典型场景（Examples）
- 学生与研究人员：快速制作论文、海报和毕设插图
- 工程师与布道师：绘制模型架构、数据流和系统设计用于文档与演示
- 评审前用 JSON/CSV 交换结构草图以便版本管理

## 参考与文档
- 项目总纲与路线图：`docs/项目总纲.md`


- P1.2(F_LATEX):
  - 在节点数据中增加 data.formulaLabel: string
  - 在 src/components/PropertiesPanel.tsx 增加“公式标签（可选）”输入框
  - 自定义节点条件渲染：存在 formulaLabel 时用 KaTeX 渲染
  - 说明：当前环境未安装 react-latex-next，采用内置 MathText + KaTeX 等效实现。如需改为依赖库，可开放网络后安装配置。


## Update: P1.3 (F_EDGE_PROP)
- PropertiesPanel: edge-specific editor now includes color picker and text label input.
- State Sync: updates propagate via updateEdge to React Flow state (style.stroke, edge.label).

## Update: P2.1 (F_I18N)
- Added i18next + react-i18next (update package.json). Run `npm install` to fetch dependencies.
- Initialized i18n in `src/i18n/index.ts` with locales:
  - `src/i18n/locales/en/translation.json`
  - `src/i18n/locales/zh/translation.json`
- Wired up in `src/main.tsx` via `import './i18n'`.
- Toolbar now includes a language switch; labels in PropertiesPanel/Toolbar begin using `t()`.

## Update: P1.2 (F_LATEX) — Code References
- KaTeX assets: `index.html:8` (CDN stylesheet and script)
- Formula input: `src/components/PropertiesPanel.tsx` adds “公式标签（可选）” bound to `data.formulaLabel`
- Renderer: `src/components/MathText.tsx` uses `window.katex` to render; falls back to plain text on errors
- Example node rendering: `src/nodes/FCNode.tsx` chooses `formulaLabel` (KaTeX) or `label` (text)

## Update: P2.2 (F_GRID)
- Snap to Grid: already enabled via React Flow props snapToGrid and snapGrid bound to store.
- Dot Grid Background: enabled with <Background variant={Dots} gap={snapGrid[0]} size={1} color="#d1d5db" /> in src/diagram/DiagramCanvas.tsx.
- Grid size can be adjusted from the header input (Grid), snapping can be toggled (Snap).

## Update: P2.3 (F_CODE)
- Refactored custom nodes to align types and behavior:
  - Added ormulaLabel?: string to all node data types.
  - Replaced (data as any) access with typed properties.
  - Ensured consistent NodeResizer usage and min sizes across nodes.
  - Kept label rendering consistent: formulaLabel via KaTeX when present; fallback to label.
- Files: src/nodes/*Node.tsx (FC/Box/Conv/Data/Circle/Tensor/Activation)

## ML Concept Designer (ML-CD) - 项目进度追踪
- 当前阶段目标：Part 5 核心功能实现
- 完成情况
  - [x] P1.1（F_RES）节点自由拉伸（NodeResizer），移除宽度滑块
  - [x] P1.2（F_LATEX）公式标签支持：formulaLabel + KaTeX 渲染 + 面板输入
  - [x] P1.3（F_EDGE_PROP）边属性编辑：颜色与文本标签
  - [x] P2.1（F_I18N）基础 i18n：i18next/react-i18next 与语言切换
  - [x] P2.2（F_GRID）吸附网格 + 点状网格背景
  - [x] P2.3（F_CODE）节点类型与样式一致性重构

更新日志（简）
- 本次：新增“项目进度追踪”段落，并同步勾选已完成项。


## Update: P3.2 (F_ALIGN)
- Added icon-based alignment/distribution controls to toolbar
- Added a compact align/distribute group near the Undo/Redo shortcut area for quick access
- File: `src/components/Toolbar.tsx`
- Added exported helpers: `AlignLeft`, `AlignTop`, `DistributeHorizontal`, `DistributeVertical` in `src/diagram/alignment.ts`

## Update: P3.3 (F_GROUP)
- Added new group node type `groupNode` with dashed rectangle border
- Files:
  - `src/nodes/GroupNode.tsx`
  - `src/diagram/DiagramCanvas.tsx` (registered in `nodeTypes`)
- Grouping actions in store:
  - `groupSelectedIntoNewGroup(label?)`: wrap selected nodes into a new group node (auto size with padding)
  - `groupSelectedInto(groupId)`: move selected nodes into an existing group
  - `ungroupSelected()`: lift selected nodes out to root coordinates
- Toolbar: added grouping buttons (Group/Ungroup) near the alignment cluster — `src/components/Toolbar.tsx`
- Added helper: `groupSelectedNodes(label?)` in `src/diagram/alignment.ts` (wraps store action)
 - Added utilities: `getSelectedBounds()` and `createGroupNodeFromSelection(label?, padding?)` in `src/diagram/grouping.ts`
## Update: P3.1 (F_UNDO) — UI Integration
- Added Undo/Redo buttons in toolbar (↶ / ↷), with keyboard shortcuts preserved.
- File: `src/components/Toolbar.tsx`
## Update: P3.1 (F_UNDO) — API Exposure
- Exposed store methods: undo() and redo() for external usage
- Files:
  - src/diagram/DiagramState.ts — methods are included in the store API
  - src/App.tsx — keyboard shortcuts call useDiagramStore.getState().undo()/redo()
## Update: CSV Schema — formulaLabel persistence
- Nodes CSV adds ormula column (after label)
- Export: src/sheets/export.ts writes data.formulaLabel to ormula
- Import: src/sheets/import.ts reads ormula into data.formulaLabel

## Update: PropertiesPanel i18n cleanup
- Rewrote src/components/PropertiesPanel.tsx to use i18next (	())
- Unified labels for node/edge editors and removed garbled strings

### 高级阶段（P3/P4 进度，自监督跟踪）
- 说明：以下条目用于核心自监督机制，后续每次代码输出后同步更新状态。
- [ ] P3.1（待定义）
- [ ] P3.2（待定义）
- [ ] P3.3（待定义）
- [ ] P3.4（待定义）
- [ ] P4.1（待定义）

## Update: P3.1 (F_UNDO)
- Added undo/redo history to Zustand store with past/future stacks (max 50).
- Wrapped mutating actions to record snapshots; skip during undo/redo.
- Keyboard shortcuts: Ctrl/Cmd+Z (undo), Shift+Ctrl/Cmd+Z (redo).
- Files: src/diagram/DiagramState.ts, src/App.tsx (key handler)

## Update: P3.1 (F_UNDO) — Middleware
- Wrapped Zustand store with devtools middleware for better debugging.
- File: src/diagram/DiagramState.ts (create(devtools(..., { name: 'diagram-store' })))

## Update: P3.4 (F_SMOOTH)
- Deprecated: previous global smoothstep default.
- Now: default edges are straight with arrow markers and mlcd-stroke per UI spec.
- File: src/diagram/DiagramCanvas.tsx (ReactFlow props)


## Update: P4.1 (F_DETAIL)
- Sidebar data source refactored to tree structure (nested categories and items)
- Recursive rendering added for nested sections; search supports tree filtering
- File: src/components/Sidebar.tsx



## Update: P4.1 (F_DETAIL)
- Sidebar data source refactored to tree structure (nested categories and items)
- Recursive rendering added for nested sections; search supports tree filtering
- File: src/components/Sidebar.tsx
- Added new basic unit: Neuron node (CircleNode-based) under Core Layers → Basic Units



## Update: P4.1 (F_DETAIL)
- Sidebar data source refactored to tree structure (nested categories and items)
- Recursive rendering added for nested sections; search supports tree filtering
- File: src/components/Sidebar.tsx
- Added new basic unit: Neuron node (CircleNode-based) under Core Layers -> Basic Units
- Added new item: MLP Layers (Core Layers -> Linear & Activation)



## Update: P4.1 (F_DETAIL)
- Added new category: 辅助功能层 (Auxiliary Layers) with subgroup 正则化约束 (Regularization) and item Dropout
- Added new category: 激活函数 (Activation Functions) → 常见激活函数，新增 Tanh、Sigmoid
- File: src/components/Sidebar.tsx

## Update: Activation Icons (Tanh/Sigmoid)
- Added function-specific circular icons:
  - src/assets/icons/TanhIcon.tsx (saturating tanh-like curve)
  - src/assets/icons/SigmoidIcon.tsx (logistic-like curve)
- Sidebar wired to use new icons for Tanh/Sigmoid


## Update: New Node & Icon — Neuron
- Added solid-circle Neuron icon and node type
- Files:
  - src/assets/icons/NeuronIcon.tsx
  - src/nodes/NeuronNode.tsx (solid filled circle, resizable)
  - src/diagram/DiagramCanvas.tsx (registered as neuronNode)
  - src/components/Sidebar.tsx (Neuron now uses neuronNode + NeuronIcon)

## Update: MLP Layers Node
- Added custom MLP node (rectangle with internal neuron dots, resizable)
- New icon for MLP: src/assets/icons/MLPIcon.tsx
- Files:
  - src/nodes/MLPNode.tsx (rows×cols small dots rendered in SVG)
  - src/diagram/DiagramCanvas.tsx (registered as mlpNode)
  - src/components/Sidebar.tsx (MLP Layers now uses mlpNode + MLPIcon)


## Update: Dropout Node Visualization
- Added custom Dropout node (rectangle with random dots and diagonal slashes pattern)
- Files:
  - src/nodes/DropoutNode.tsx
  - src/diagram/DiagramCanvas.tsx (registered as dropoutNode)
  - src/components/Sidebar.tsx (Dropout now uses dropoutNode)


## Update: P4.1 (F_DETAIL) — Sidebar Recursive Rendering
- Refactored src/components/Sidebar.tsx to render multi-level menu recursively with collapsible sections
- Added Section component handling nested categories (children) and items



### 自监督追踪（P3/P5）
- [ ] P3.2（待定义）
- [ ] P3.3（待定义）
- [ ] P5.1（待定义）
## Update: P5.1 (F_TEMPLATE)

## Visual & Naming Spec (Draft)
- Central tokens: `src/ui/tokens.ts`; Tailwind theme extended with `semantic.*` colors.
- Node role → default color mapping documented in `docs/ui-spec.md`.
- Naming: PascalCase node components; `data.typeLabel` shows family; keep KaTeX/MathText.
- SVG-first: prefer inline SVG for visuals; current nodes partially use CSS borders — will migrate gradually.
- Added a templates data module with 3 presets (nodes/edges JSON):
  - Basic CNN Block, Basic RNN Cell, Attention Mechanism
- File: `src/data/templates.ts`
- Sidebar integration: added a Templates category with clickable items to insert templates — `src/components/Sidebar.tsx`
 - Drag/Click load: clicking a template inserts it centered in the viewport; dragging drops it at cursor point. Inserted nodes are pre-selected for immediate move/edit.
   - Handlers: `src/diagram/DiagramCanvas.tsx` listens to `mlcd-insert-template` event and performs centered insertion.
