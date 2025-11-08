# Minimal Canvas Scaffold

> 面向「我只能复制粘贴」的场景：这一份文档只保留画布最核心的组成部分——入口、布局、画布、拖拽、状态、节点清单与样式指针。把整份文件发给其他 AI，就能在不浏览整个仓库的情况下，快速理解并继续开发现有画布。

## 0. 运行依赖（节选自 `package.json`）

```jsonc
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "reactflow": "^11.11.2",
    "zustand": "^4.5.2",
    "html-to-image": "^1.11.11",
    "i18next": "^23.11.5",
    "react-i18next": "^13.5.0",
    "@reactflow/node-resizer": "^2.1.15",
    "tailwindcss": "^3.4.1"
  },
  "devDependencies": {
    "typescript": "^5.5.4",
    "vite": "^5.1.6"
  }
}
```

运行方式：`npm install && npm run dev`

---

## 1. 入口：`src/main.tsx`

```ts
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/tailwind.css';
import '@reactflow/node-resizer/dist/style.css';
import './i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 2. 布局骨架：`src/App.tsx`

核心是三栏布局（侧栏 / ReactFlow 画布 / 属性面板）以及导入导出与快捷键。为了保持最小骨架，可以关注以下 JSX：

```tsx
return (
  <div className="h-screen w-screen grid grid-cols-[260px_1fr_300px] grid-rows-[auto_1fr]">
    <header className="col-span-3 h-12 px-4 ..."> ... </header>

    <Sidebar />

    <main className="relative bg-mlcd-canvas">
      <DiagramCanvas />
      <QuickPanel />
    </main>

    <PropertiesPanel />
  </div>
);
```

若只需最小画布，可临时移除 `QuickPanel`、`PropertiesPanel`、`Toolbar`，但要保留 `Sidebar` + `DiagramCanvas` 组合与导入导出逻辑。

---

## 3. React Flow 画布：`src/diagram/DiagramCanvas.tsx`

**节点 / 连线注册**

```ts
const nodeTypes = useMemo(() => ({
  fcNode: FCNode,
  boxNode: BoxNode,
  circleNode: CircleNode,
  convNode: ConvNode,
  dataNode: DataNode,
  activationNode: ActivationNode,
  tensorNode: TensorNode,
  dropoutNode: DropoutNode,
  neuronNode: NeuronNode,
  mlpNode: MLPNode,
  groupNode: GroupNode,
  flattenNode: FlattenNode,
  poolingNode: PoolingNode,
  normalizationNode: NormalizationNode,
  embeddingNode: EmbeddingNode,
  attentionNode: AttentionNode,
  rnnNode: RNNNode,
}), []);

const edgeTypes = useMemo(() => ({
  residualEdge: ResidualEdge,
  simpleArrowEdge: SimpleArrowEdge,
}), []);
```

**画布主体**

```tsx
<ReactFlow
  nodes={nodes}
  edges={edges}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect}
  nodeTypes={nodeTypes}
  edgeTypes={edgeTypes}
  fitView
  defaultViewport={{ x: 0, y: 0, zoom: 1 }}
  proOptions={{ hideAttribution: true }}
  snapToGrid={snapToGrid}
  snapGrid={snapGrid}
  selectionMode={SelectionMode.Partial}
  panOnScroll
  defaultEdgeOptions={{
    type: 'straight',
    markerEnd: { type: 'arrowclosed', color: 'hsl(var(--mlcd-stroke))' },
    style: { stroke: 'hsl(var(--mlcd-stroke))', strokeWidth: 1.25 },
  }}
>
  <Background variant={BackgroundVariant.Dots} gap={snapGrid[0]} size={1} color={'var(--mlcd-grid-dot)'} />
  <MiniMap pannable zoomable nodeStrokeWidth={2} nodeColor={(n) => (n.data as any)?.color || '#4b5563'} />
  <Controls position="bottom-right" />
</ReactFlow>
```

**模板 / 节点拖拽落点**

```ts
const onDrop = useCallback((event: React.DragEvent) => {
  event.preventDefault();
  const templateId = event.dataTransfer.getData('application/x-mlcd-template');
  if (templateId) {
    window.dispatchEvent(new CustomEvent('mlcd-insert-template', { detail: { templateId, at: 'point', clientX: event.clientX, clientY: event.clientY } }));
    return;
  }

  const type = event.dataTransfer.getData('application/reactflow');
  if (!type) return;
  const position = screenToFlowPosition({ x: event.clientX, y: event.clientY });

  let data: any = { label: 'Node' };
  const raw = event.dataTransfer.getData('application/x-mlcd-data');
  if (raw) { try { data = JSON.parse(raw); } catch {} }

  const id = `n_${Date.now()}_${Math.round(Math.random() * 1e5)}`;
  addNode({ id, type, position, data });
}, [addNode, screenToFlowPosition]);
```

---

## 4. 拖拽源：`src/components/Sidebar.tsx`

侧栏从 `SidebarCatalog` + `templates` 生成分组，并在拖拽时打包节点信息：

```ts
const schemaKeyMap: Record<string, string> = { fcNode: 'FC_LAYER', ... };

const onDragStart = React.useCallback((event, nodeType, data) => {
  if (nodeType === 'template' && data?.templateId) {
    event.dataTransfer.setData('application/x-mlcd-template', String(data.templateId));
    event.dataTransfer.effectAllowed = 'move';
    return;
  }

  const schemaKey = schemaKeyMap[nodeType];
  let enrichedData = data ?? {};
  if (schemaKey && NodeSizes[schemaKey]) {
    const defaultMLParams = getDefaultMLParams(schemaKey);
    enrichedData = { ...enrichedData, ...defaultMLParams, componentType: schemaKey };
  }

  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.setData('application/x-mlcd-data', JSON.stringify(enrichedData));
  event.dataTransfer.effectAllowed = 'move';
}, []);
```

拖拽的 UI 元素都由 `SidebarCatalog`（`src/data/sidebarData.ts`）和 `TemplatesData`（`src/data/templates.ts`）描述；想精简只需保留必要条目。

---

## 5. 状态容器：`src/diagram/DiagramState.ts`

Zustand 把 React Flow 的 `nodes` / `edges`、历史栈和节点操作集中管理。最小骨架只要保留加节点、连线及变更逻辑：

```ts
export const useDiagramStore = create<DiagramState>()((set, get) => ({
  nodes: [],
  edges: [],
  historyPast: [],
  historyFuture: [],
  isUndoRedo: false,
  snapToGrid: true,
  snapGrid: [8, 8],

  onNodesChange: (changes) => {
    const { nodes, edges, isUndoRedo, historyPast } = get();
    const nextNodes = applyNodeChanges(changes, nodes);
    if (!isUndoRedo) {
      const past = [...historyPast, snapshot({ nodes, edges })].slice(-MAX_HISTORY);
      set({ historyPast: past, historyFuture: [] });
    }
    set({ nodes: nextNodes, isUndoRedo: false });
  },

  onEdgesChange: (changes) => {
    const { nodes, edges, isUndoRedo, historyPast } = get();
    const nextEdges = applyEdgeChanges(changes, edges);
    if (!isUndoRedo) {
      const past = [...historyPast, snapshot({ nodes, edges })].slice(-MAX_HISTORY);
      set({ historyPast: past, historyFuture: [] });
    }
    set({ edges: nextEdges, isUndoRedo: false });
  },

  onConnect: (connection) => {
    const { nodes, edges, historyPast } = get();
    const past = [...historyPast, snapshot({ nodes, edges })].slice(-MAX_HISTORY);
    const color = '#111827';
    const { source, target, sourceHandle, targetHandle } = connection;
    if (!source || !target) return;
    set({
      historyPast: past,
      historyFuture: [],
      edges: [
        ...edges,
        {
          id: `${Date.now()}`,
          source,
          target,
          sourceHandle: sourceHandle ?? null,
          targetHandle: targetHandle ?? null,
          markerEnd: { type: MarkerType.ArrowClosed, color },
          style: { stroke: color },
        },
      ],
    });
  },

  addNode: (node) => {
    const { nodes, edges, historyPast } = get();
    const past = [...historyPast, snapshot({ nodes, edges })].slice(-MAX_HISTORY);
    set({ nodes: [...nodes, node], historyPast: past, historyFuture: [] });
  },
}));
```

撤销/重做、分组、语义色锁定、语言切换等功能都集中在同一 store，可在需要时再补齐。

---

## 6. 节点与连线清单

| 类型 ID            | 文件                               | 描述（可见名称通常在 node data 或 schema 中定义） |
| ------------------ | ---------------------------------- | ------------------------------------------------- |
| `boxNode`          | `src/nodes/BoxNode.tsx`            | 默认矩形节点                                     |
| `circleNode`       | `src/nodes/CircleNode.tsx`         | 圆形节点                                         |
| `fcNode`           | `src/nodes/FCNode.tsx`             | 全连接层表示                                     |
| `mlpNode`          | `src/nodes/MLPNode.tsx`            | 多层感知机模块                                   |
| `convNode`         | `src/nodes/ConvNode.tsx`           | 卷积层                                           |
| `poolingNode`      | `src/nodes/PoolingNode.tsx`        | 池化层                                           |
| `flattenNode`      | `src/nodes/FlattenNode.tsx`        | Flatten 操作                                     |
| `activationNode`   | `src/nodes/ActivationNode.tsx`     | 激活函数                                         |
| `dropoutNode`      | `src/nodes/DropoutNode.tsx`        | Dropout                                          |
| `normalizationNode`| `src/nodes/NormalizationNode.tsx`  | Batch/Layer Norm                                 |
| `tensorNode`       | `src/nodes/TensorNode.tsx`         | 张量描述                                         |
| `dataNode`         | `src/nodes/DataNode.tsx`           | 数据源 / 数据集                                  |
| `neuronNode`       | `src/nodes/NeuronNode.tsx`         | 单个神经元                                       |
| `embeddingNode`    | `src/nodes/EmbeddingNode.tsx`      | Embedding                                        |
| `attentionNode`    | `src/nodes/AttentionNode.tsx`      | 注意力单元                                       |
| `rnnNode`          | `src/nodes/RNNNode.tsx`            | RNN / LSTM                                       |
| `groupNode`        | `src/nodes/GroupNode.tsx`          | 分组容器                                         |
| `tensorNode`       | `src/nodes/TensorNode.tsx`         | 张量/特征块                                      |
| `residualEdge`     | `src/edges/ResidualEdge.tsx`       | 带描边的残差连线                                 |
| `simpleArrowEdge`  | `src/edges/SimpleArrowEdge.tsx`    | 直线箭头                                         |

> 任何要新增的节点类型 = 在 `src/nodes` 增加组件 + 在 `DiagramCanvas` `nodeTypes` 注册 + 在 `sidebarData` 添加拖拽项。

---

## 7. 数据与样式指针

- `src/data/sidebarData.ts`：定义侧栏分组、图标、拖拽默认 data。
- `src/data/templates.ts`：模板内容（预设 node/edge 列表），配合 `mlcd-insert-template` 事件插入。
- `src/data/index.ts`：暴露 `NodeSizes`, `getDefaultMLParams`，用于统一尺寸和默认参数。
- `src/styles/tailwind.css` + `tailwind.config.js`: 定义 `--mlcd-*` 主题变量与 Tailwind 扩展。
- `src/i18n/index.ts` + `src/i18n/locales/{en,zh}`：即使暂时不用多语言，也要保留初始化以免 `useTranslation()` 报错。

---

## 8. 可以暂时忽略的功能

| 功能                | 文件                               | 说明                                         |
| ------------------- | ---------------------------------- | -------------------------------------------- |
| 对齐 / 分布         | `src/components/AlignmentDropdown.tsx`, `src/diagram/alignment.ts` | 只在 Toolbar 上暴露，可暂不提供 |
| 撤销 / 重做 / 分组 | `Toolbar.tsx`, `DiagramState.ts` 中相关方法 | 若最小 demo 不需要历史功能，可不描述 |
| 语义色锁定 / 语言切换 | `Toolbar.tsx`, `src/i18n/*` | 对画布核心不构成阻塞                         |
| 属性面板 / 快速面板 | `src/components/PropertiesPanel.tsx`, `QuickPanel.tsx` | 可在需要时再补充                                |

---

复制本文件即可把「节点集合 + 拖拽逻辑 + 画布呈现 + 状态管理」的最小知识上下文交给其他 AI；当对方拿到仓库或需要更细代码时，再提示对应文件即可。
