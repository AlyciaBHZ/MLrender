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
import { buildGroupFromSelection, moveSelectionIntoGroup, ungroupSelectedNodes } from './grouping';

// 中文说明：集中管理图表状态（节点与连线），方便后续支持保存、加载与撤销操作。
export type DiagramState = {
  nodes: Node[];
  edges: Edge[];
  historyPast: { nodes: Node[]; edges: Edge[] }[];
  historyFuture: { nodes: Node[]; edges: Edge[] }[];
  isUndoRedo: boolean;
  // UI 设置
  snapToGrid: boolean;
  snapGrid: [number, number];
  semanticColorsLocked: boolean;
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
  setSemanticColorsLocked: (v: boolean) => void;
  removeSelected: () => void;
  duplicateSelected: () => void;
  groupSelectedIntoNewGroup: (label?: string) => void;
  groupSelectedInto: (groupId: string) => void;
  ungroupSelected: () => void;
  reset: () => void;
  undo: () => void;
  redo: () => void;
};

const MAX_HISTORY = 50;

function snapshot(state: Pick<DiagramState, 'nodes' | 'edges'>) {
  return {
    nodes: JSON.parse(JSON.stringify(state.nodes)),
    edges: JSON.parse(JSON.stringify(state.edges)),
  } as { nodes: Node[]; edges: Edge[] };
}

export const useDiagramStore = create<DiagramState>()((set, get) => ({
  // 初始为空图
  nodes: [],
  edges: [],
  historyPast: [],
  historyFuture: [],
  isUndoRedo: false,
  snapToGrid: true,
  snapGrid: [8, 8],
  semanticColorsLocked: true,

  // 处理节点变更（移动、选中、尺寸等）
  onNodesChange: (changes) => {
    const { nodes, edges, isUndoRedo, historyPast } = get();
    const nextNodes = applyNodeChanges(changes, nodes);
    if (!isUndoRedo) {
      const past = [...historyPast, snapshot({ nodes, edges })].slice(-MAX_HISTORY);
      set({ historyPast: past, historyFuture: [] });
    }
    set({ nodes: nextNodes, isUndoRedo: false });
  },

  // 处理连线变更
  onEdgesChange: (changes) => {
    const { nodes, edges, isUndoRedo, historyPast } = get();
    const nextEdges = applyEdgeChanges(changes, edges);
    if (!isUndoRedo) {
      const past = [...historyPast, snapshot({ nodes, edges })].slice(-MAX_HISTORY);
      set({ historyPast: past, historyFuture: [] });
    }
    set({ edges: nextEdges, isUndoRedo: false });
  },

  // 连接两个节点时触发，生成新的 edge
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

  // 新增节点（用于拖拽放置）
  addNode: (node) => {
    const { nodes, edges, historyPast } = get();
    const past = [...historyPast, snapshot({ nodes, edges })].slice(-MAX_HISTORY);
    set({ nodes: [...nodes, node], historyPast: past, historyFuture: [] });
  },

  // 根据 id 更新节点 data（浅合并）
  updateNodeData: (id, data) => {
    const { nodes, edges, historyPast } = get();
    const past = [...historyPast, snapshot({ nodes, edges })].slice(-MAX_HISTORY);
    set({
      nodes: nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, ...data } } : n)),
      historyPast: past,
      historyFuture: [],
    });
  },

  // 载入整张图
  setDiagram: ({ nodes, edges }) => {
    const s = get();
    const past = [...s.historyPast, snapshot({ nodes: s.nodes, edges: s.edges })].slice(-MAX_HISTORY);
    set({ nodes, edges, historyPast: past, historyFuture: [] });
  },

  // 更新单条边（样式或数据）
  updateEdge: (id, updater) => {
    const { nodes, edges, historyPast } = get();
    const past = [...historyPast, snapshot({ nodes, edges })].slice(-MAX_HISTORY);
    set({ edges: edges.map((e) => (e.id === id ? updater(e) : e)), historyPast: past, historyFuture: [] });
  },

  setNodes: (nodes) => {
    const s = get();
    const past = [...s.historyPast, snapshot({ nodes: s.nodes, edges: s.edges })].slice(-MAX_HISTORY);
    set({ nodes, historyPast: past, historyFuture: [] });
  },
  setEdges: (edges) => {
    const s = get();
    const past = [...s.historyPast, snapshot({ nodes: s.nodes, edges: s.edges })].slice(-MAX_HISTORY);
    set({ edges, historyPast: past, historyFuture: [] });
  },

  setSnapToGrid: (v) => set({ snapToGrid: v }),
  setSnapGrid: (v) => set({ snapGrid: v }),
  setSemanticColorsLocked: (v) => set({ semanticColorsLocked: v }),

  // 删除选中的节点与连线
  removeSelected: () => {
    const { nodes, edges, historyPast } = get();
    const selectedIds = new Set(nodes.filter((n) => n.selected).map((n) => n.id));
    const nextNodes = nodes.filter((n) => !selectedIds.has(n.id));
    const nextEdges = edges.filter((e) => !((e as any).selected) && !selectedIds.has(e.source) && !selectedIds.has(e.target));
    const past = [...historyPast, snapshot({ nodes, edges })].slice(-MAX_HISTORY);
    set({ nodes: nextNodes, edges: nextEdges, historyPast: past, historyFuture: [] });
  },

  // 复制选中的节点（简单偏移，不复制边）
  duplicateSelected: () => {
    const { nodes, edges, historyPast } = get();
    const selected = nodes.filter((n) => n.selected);
    if (!selected.length) return;
    const now = Date.now();
    const clones = selected.map((n, idx) => ({
      ...n,
      id: `n_${now}_${idx}_${Math.round(Math.random() * 1e4)}`,
      selected: false,
      position: { x: n.position.x + 40, y: n.position.y + 40 },
    }));
    const past = [...historyPast, snapshot({ nodes, edges })].slice(-MAX_HISTORY);
    set({ nodes: [...nodes, ...clones], historyPast: past, historyFuture: [] });
  },

  // Group selected nodes into a new dashed rectangle group node.
  groupSelectedIntoNewGroup: (label = 'Group') => {
    const { nodes, edges, historyPast } = get();
    const res = buildGroupFromSelection(nodes, label, 24);
    if (!res) return;
    const past = [...historyPast, snapshot({ nodes, edges })].slice(-MAX_HISTORY);
    set({ nodes: res.nodes, historyPast: past, historyFuture: [] });
    try {
      window.dispatchEvent(new CustomEvent('mlcd-group-created', { detail: { groupId: res.groupId, count: nodes.filter((n) => n.selected && n.type !== 'groupNode').length } }));
    } catch {}
  },

  // Move currently selected nodes into an existing group node.
  groupSelectedInto: (groupId: string) => {
    const { nodes, edges, historyPast } = get();
    const nextNodes = moveSelectionIntoGroup(nodes, groupId);
    const past = [...historyPast, snapshot({ nodes, edges })].slice(-MAX_HISTORY);
    set({ nodes: nextNodes, historyPast: past, historyFuture: [] });
  },

  // Ungroup: lift selected nodes (or children of selected groups) out of their parent group.
  ungroupSelected: () => {
    const { nodes, edges, historyPast } = get();
    const nextNodes = ungroupSelectedNodes(nodes);
    const past = [...historyPast, snapshot({ nodes, edges })].slice(-MAX_HISTORY);
    set({ nodes: nextNodes, historyPast: past, historyFuture: [] });
  },

  // 重置图表
  reset: () => {
    const { nodes, edges, historyPast } = get();
    const past = [...historyPast, snapshot({ nodes, edges })].slice(-MAX_HISTORY);
    set({ nodes: [], edges: [], historyPast: past, historyFuture: [] });
  },
  undo: () => {
    const { historyPast, historyFuture, nodes, edges } = get();
    if (!historyPast.length) return;
    const prev = historyPast[historyPast.length - 1];
    const past = historyPast.slice(0, -1);
    const future = [...historyFuture, snapshot({ nodes, edges })].slice(-MAX_HISTORY);
    set({ nodes: prev.nodes, edges: prev.edges, historyPast: past, historyFuture: future, isUndoRedo: true });
  },
  redo: () => {
    const { historyPast, historyFuture, nodes, edges } = get();
    if (!historyFuture.length) return;
    const next = historyFuture[historyFuture.length - 1];
    const future = historyFuture.slice(0, -1);
    const past = [...historyPast, snapshot({ nodes, edges })].slice(-MAX_HISTORY);
    set({ nodes: next.nodes, edges: next.edges, historyPast: past, historyFuture: future, isUndoRedo: true });
  },
}));
