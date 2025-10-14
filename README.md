# ML Concept Designer (ML-CD)

一个用于机器学习概念图的开源 Web 编辑器（MVP）。使用 React + TypeScript + Vite 构建，Tailwind CSS 负责样式，React Flow 负责画布交互，Zustand 管理状态。

当前进度：Part 1 + Part 2 + Part 3（基础画布 + 图标侧边栏 + 多类型自定义节点 + 属性面板/保存加载/导出 PNG）。

## 功能（MVP 进度）
- [x] Vite + React + TypeScript 项目初始化
- [x] Tailwind CSS 集成
- [x] React Flow 画布（缩放、平移、基础节点/连线）
- [x] 图标侧边栏（拖拽创建节点）
- [x] 自定义节点：FCNode
- [x] 多种节点类型（Input/Conv/Pooling/RNN/Output/Loss/Optimizer）
- [x] 属性编辑面板：节点（标签/颜色/宽度）
- [x] 属性编辑面板：连线（颜色/箭头/残差虚线）
- [x] 保存/加载 JSON
- [x] 导出 PNG（html-to-image）
- [x] 对齐/分布工具（工具栏）
- [x] 网格吸附（可调整格距/开关）
- [x] 残差连接自定义边（residualEdge）
- [x] 快捷键：Delete 删除、Ctrl+D 复制、Ctrl+S 保存、Ctrl+O 加载、Ctrl+E 导出、Ctrl+F 适配视图、Ctrl+G 网格开关
- [x] 导出表格（CSV：nodes.csv / edges.csv）
- [x] 从表格导入（选择两个 CSV：nodes + edges）
- [x] 批量编辑（多选节点设置颜色/宽度/标签前缀）

## 技术栈
- React 18 + TypeScript
- Vite 5
- Tailwind CSS 3
- React Flow 11
- Zustand 4

## 本地开发
1. 安装依赖（需要 Node.js 18+）
   ```bash
   npm install
   ```
2. 启动开发服务器
   ```bash
   npm run dev
   ```
3. 浏览器打开 http://localhost:5173

## 代码结构
- `src/App.tsx`：主布局与顶部操作（保存/加载/导出）。
- `src/diagram/DiagramCanvas.tsx`：React Flow 画布容器与 DnD 处理、节点类型注册。
- `src/diagram/DiagramState.ts`：Zustand 全局状态（nodes/edges 与交互回调）。
- `src/styles/tailwind.css`：Tailwind 全局样式入口。
- `src/components/Sidebar.tsx`：图标侧边栏（可拖拽多类型到画布）。
- `src/components/PropertiesPanel.tsx`：右侧属性面板（节点/连线）。
- `src/nodes/FCNode.tsx`：FC 自定义节点（支持颜色与宽度、缩放手柄）。
- `src/nodes/BoxNode.tsx`：通用矩形节点（Conv/Pooling/Input/Loss/RNN）。
- `src/nodes/CircleNode.tsx`：通用圆形节点（Output/Optimizer）。
- `src/assets/icons/FCLayerIcon.tsx`：FC 图标。
- `src/assets/icons/BasicIcons.tsx`：其它简洁 SVG 图标集合。
- `src/sheets/`：Export to Sheets 模块
  - `schema.ts`：CSV 列头常量（统一管理）
  - `export.ts`：导出为 CSV（nodes/edges），支持可选时间戳
  - `import.ts`：从 CSV 构建图（解析与还原）
  - `index.ts`：聚合导出

## 使用说明
- 从左侧侧边栏拖拽节点（Input/FC/Conv/Pooling/RNN/Output/Loss/Optimizer）到画布创建节点。
- 在画布上拖动节点移动位置；从右侧锚点连到另一个节点左侧锚点以连接。
- 选中节点：右侧属性面板可编辑“标签/颜色/宽度”，并可拖动节点右下角的缩放手柄调整宽度（圆形节点为直径）。
- 选中连线：可编辑“颜色/箭头/残差样式（虚线）”。
- 顶部按钮：
  - “保存 JSON” 导出 `{ nodes, edges }` 到文件。
  - “加载 JSON” 从文件载入图表。
  - “导出 PNG” 截图当前画布。
  - “导出表格” 导出 `nodes.csv` 与 `edges.csv`，可导入 Google Sheets/Excel。
  - “导入表格” 同时选择 `nodes.csv` 与 `edges.csv` 将覆盖当前图。
  - “适配视图/重置中心”、网格开关与格距、对齐/分布等工具。

## 快捷键
- Delete/Backspace：删除选中
- Ctrl/⌘ + D：复制选中节点
- Ctrl/⌘ + S：保存 JSON
- Ctrl/⌘ + O：加载 JSON
- Ctrl/⌘ + E：导出 PNG
- Ctrl/⌘ + F：适配视图
- Ctrl/⌘ + G：切换网格吸附

## 说明
- JSON 保存/加载会直接写入 React Flow 的 `nodes/edges`，其中连线的箭头使用 `markerEnd: { type: ArrowClosed }`。
- 画布导出使用 `html-to-image`，如果你的图非常大，导出图片可能较慢。

## 后续计划
- 更多 ML 图标与节点外观（如 3D Conv、注意力模块等）。
- 自定义连线样式与标签（如权重/维度标注）。
- 撤销/重做、对齐/分布、对齐辅助线。
- 快捷键（删除、复制、粘贴、分组）。
