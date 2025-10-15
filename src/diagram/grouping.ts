import type { Node } from 'reactflow';
import { useDiagramStore } from './DiagramState';

type Bounds = { x: number; y: number; w: number; h: number };

function buildIndex(nodes: Node[]) {
  return Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<string, Node>;
}

export function getAbsolutePosition(n: Node, byId: Record<string, Node>): { x: number; y: number } {
  let x = n.position.x;
  let y = n.position.y;
  let cur: Node | undefined = n;
  while (cur && (cur as any).parentNode) {
    const p = byId[(cur as any).parentNode as string];
    if (!p) break;
    x += p.position.x;
    y += p.position.y;
    cur = p;
  }
  return { x, y };
}

export function getSelectedBounds(padding = 24): Bounds | null {
  const { nodes } = useDiagramStore.getState();
  const selected = nodes.filter((n) => n.selected && n.type !== 'groupNode');
  if (!selected.length) return null;
  const byId = buildIndex(nodes);
  const fallbackW = 140;
  const fallbackH = 80;
  const xs = selected.map((n) => getAbsolutePosition(n, byId).x);
  const ys = selected.map((n) => getAbsolutePosition(n, byId).y);
  const ws = selected.map((n) => n.width ?? fallbackW);
  const hs = selected.map((n) => n.height ?? fallbackH);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs.map((x, i) => x + ws[i]));
  const maxY = Math.max(...ys.map((y, i) => y + hs[i]));
  return { x: minX - padding, y: minY - padding, w: (maxX - minX) + padding * 2, h: (maxY - minY) + padding * 2 };
}

// Create a new groupNode enclosing all currently selected nodes
export function createGroupNodeFromSelection(label = 'Group', padding = 24): string | null {
  const { nodes, setNodes } = useDiagramStore.getState();
  const selected = nodes.filter((n) => n.selected && n.type !== 'groupNode');
  if (!selected.length) return null;
  const byId = buildIndex(nodes);
  const bounds = getSelectedBounds(padding);
  if (!bounds) return null;
  const id = `g_${Date.now()}_${Math.round(Math.random() * 1e5)}`;

  const nextNodes: Node[] = nodes.map((n) => {
    if (!n.selected || n.type === 'groupNode') return n;
    const abs = getAbsolutePosition(n, byId);
    const rel = { x: abs.x - bounds.x, y: abs.y - bounds.y };
    return { ...n, parentNode: id as any, position: rel, extent: 'parent' as any, selected: false };
  });

  const groupNode: Node = {
    id,
    type: 'groupNode' as any,
    position: { x: bounds.x, y: bounds.y },
    data: { label } as any,
    style: { width: bounds.w, height: bounds.h },
    selected: true,
  } as Node;

  setNodes([...nextNodes, groupNode]);
  return id;
}

