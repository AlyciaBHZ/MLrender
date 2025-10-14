import { create } from 'zustand';
import {
  type Edge,
  type Node,
  type OnEdgesChange,
  type OnNodesChange,
  type Connection,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from 'reactflow';

// 中文说明：集中管理图表状态（节点与连线），方便后续扩展保存/加载/撤销等
export type DiagramState = {
  nodes: Node[];
  edges: Edge[];
  // UI 设置
  snapToGrid: boolean;
  snapGrid: [number, number];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node) => void;
  updateNodeData: (id: string, data: Record<string, any>) => void;
  updateEdge: (id: string, updater: (edge: Edge) => Edge) => void;
  setDiagram: (payload: { nodes: Node[]; edges: Edge[] }) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  setSnapToGrid: (v: boolean) => void;
  setSnapGrid: (v: [number, number]) => void;
  removeSelected: () => void;
  duplicateSelected: () => void;
  reset: () => void;
};

export const useDiagramStore = create<DiagramState>((set, get) => ({
  // 初始为空图
  nodes: [],
  edges: [],
  snapToGrid: true,
  snapGrid: [10, 10],

  // 处理节点变更（移动、选中、尺寸等）
  onNodesChange: (changes) => {
    const { nodes } = get();
    set({ nodes: applyNodeChanges(changes, nodes) });
  },

  // 处理连线变更
  onEdgesChange: (changes) => {
    const { edges } = get();
    set({ edges: applyEdgeChanges(changes, edges) });
  },

  // 连接两个节点时触发，生成新的 edge
  onConnect: (connection) => {
    const { edges } = get();
    const color = '#111827';
    const { source, target, sourceHandle, targetHandle } = connection;
    if (!source || !target) return;
    set({
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

  // 新增节点（用于拖拽放置）
  addNode: (node) => {
    const { nodes } = get();
    set({ nodes: [...nodes, node] });
  },

  // 根据 id 更新节点 data（浅合并）
  updateNodeData: (id, data) => {
    const { nodes } = get();
    set({
      nodes: nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n)),
    });
  },

  // 载入整张图
  setDiagram: ({ nodes, edges }) => set({ nodes, edges }),

  // 更新单条边（样式/数据）
  updateEdge: (id, updater) => {
    const { edges } = get();
    set({ edges: edges.map((e) => (e.id === id ? updater(e) : e)) });
  },

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  setSnapToGrid: (v) => set({ snapToGrid: v }),
  setSnapGrid: (v) => set({ snapGrid: v }),

  // 删除选中的节点与连线
  removeSelected: () => {
    const { nodes, edges } = get();
    const selectedIds = new Set(nodes.filter((n) => n.selected).map((n) => n.id));
    const nextNodes = nodes.filter((n) => !selectedIds.has(n.id));
    const nextEdges = edges.filter((e) => !((e as any).selected) && !selectedIds.has(e.source) && !selectedIds.has(e.target));
    set({ nodes: nextNodes, edges: nextEdges });
  },

  // 复制选中的节点（简单偏移，不复制边）
  duplicateSelected: () => {
    const { nodes } = get();
    const selected = nodes.filter((n) => n.selected);
    if (!selected.length) return;
    const now = Date.now();
    const clones = selected.map((n, idx) => ({
      ...n,
      id: `n_${now}_${idx}_${Math.round(Math.random() * 1e4)}`,
      selected: false,
      position: { x: n.position.x + 40, y: n.position.y + 40 },
    }));
    set({ nodes: [...nodes, ...clones] });
  },

  // 重置图表
  reset: () => set({ nodes: [], edges: [] }),
}));
