import type { Node } from 'reactflow';
import { useDiagramStore } from './DiagramState';

// 中文说明：对齐与分布算法——在选中节点集合上应用位置调整
export type AlignOp = 'left' | 'centerX' | 'right' | 'top' | 'centerY' | 'bottom';
export type DistributeOp = 'horiz' | 'vert';

type Point = { x: number; y: number };

function buildIndex(nodes: Node[]) {
  return Object.fromEntries(nodes.map((n) => [n.id, n])) as Record<string, Node>;
}

function widthOf(n: Node): number {
  return (n.width ?? ((n.style as any)?.width as number) ?? ((n.data as any)?.width as number) ?? 120) as number;
}
function heightOf(n: Node): number {
  return (n.height ?? ((n.style as any)?.height as number) ?? ((n.data as any)?.height as number) ?? 64) as number;
}

function getAbsPos(n: Node, byId: Record<string, Node>): Point {
  let x = n.position.x;
  let y = n.position.y;
  let cur: Node | undefined = n as any;
  while (cur && (cur as any).parentNode) {
    const p = byId[(cur as any).parentNode as string];
    if (!p) break;
    x += p.position.x;
    y += p.position.y;
    cur = p;
  }
  return { x, y };
}

function getParentAbsPos(n: Node, byId: Record<string, Node>): Point {
  const parentId = (n as any).parentNode as string | undefined;
  if (!parentId) return { x: 0, y: 0 };
  return getAbsPos(byId[parentId], byId);
}

export function align(nodes: Node[], op: AlignOp): Node[] {
  const sel = nodes.filter((n) => n.selected && n.type !== 'groupNode');
  if (sel.length < 2) return nodes;
  const byId = buildIndex(nodes);
  const abs = sel.map((n) => getAbsPos(n, byId));
  const ws = sel.map((n) => widthOf(n));
  const hs = sel.map((n) => heightOf(n));

  const minX = Math.min(...abs.map((p) => p.x));
  const minY = Math.min(...abs.map((p) => p.y));
  const maxX = Math.max(...abs.map((p, i) => p.x + ws[i]));
  const maxY = Math.max(...abs.map((p, i) => p.y + hs[i]));
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  const snap = useDiagramStore.getState().snapGrid?.[0] ?? 8;
  const snapToGrid = useDiagramStore.getState().snapToGrid;

  return nodes.map((n) => {
    if (!n.selected || n.type === 'groupNode') return n;
    const parentAbs = getParentAbsPos(n, byId);
    const w = widthOf(n);
    const h = heightOf(n);
    let targetAbsX = n.position.x + parentAbs.x;
    let targetAbsY = n.position.y + parentAbs.y;
    switch (op) {
      case 'left': targetAbsX = minX; break;
      case 'right': targetAbsX = maxX - w; break;
      case 'centerX': targetAbsX = centerX - w / 2; break;
      case 'top': targetAbsY = minY; break;
      case 'bottom': targetAbsY = maxY - h; break;
      case 'centerY': targetAbsY = centerY - h / 2; break;
    }
    let relX = targetAbsX - parentAbs.x;
    let relY = targetAbsY - parentAbs.y;
    if (snapToGrid) {
      relX = Math.round(relX / snap) * snap;
      relY = Math.round(relY / snap) * snap;
    }
    return { ...n, position: { ...n.position, x: relX, y: relY } };
  });
}

export function distribute(nodes: Node[], op: DistributeOp): Node[] {
  const byId = buildIndex(nodes);
  const sel = nodes
    .filter((n) => n.selected && n.type !== 'groupNode')
    .sort((a, b) => {
      const pa = getAbsPos(a, byId);
      const pb = getAbsPos(b, byId);
      return (op === 'horiz' ? pa.x : pa.y) - (op === 'horiz' ? pb.x : pb.y);
    });
  if (sel.length < 3) return nodes;

  const centers = sel.map((n) => {
    const p = getAbsPos(n, byId);
    const w = widthOf(n);
    const h = heightOf(n);
    return op === 'horiz' ? p.x + w / 2 : p.y + h / 2;
  });
  const start = centers[0];
  const end = centers[centers.length - 1];
  const step = (end - start) / (sel.length - 1);

  const snap = useDiagramStore.getState().snapGrid?.[0] ?? 8;
  const snapToGrid = useDiagramStore.getState().snapToGrid;

  const indexById: Record<string, number> = Object.fromEntries(sel.map((s, i) => [s.id, i]));
  const next = nodes.map((n) => {
    const idx = indexById[n.id];
    if (idx === undefined) return n;
    if (idx <= 0 || idx === sel.length - 1) return n;
    const targetCenter = start + step * idx;
    const w = widthOf(n);
    const h = heightOf(n);
    const parentAbs = getParentAbsPos(n, byId);
    let relX = n.position.x;
    let relY = n.position.y;
    if (op === 'horiz') {
      const targetAbsX = targetCenter - w / 2;
      relX = targetAbsX - parentAbs.x;
    } else {
      const targetAbsY = targetCenter - h / 2;
      relY = targetAbsY - parentAbs.y;
    }
    if (snapToGrid) {
      relX = Math.round(relX / snap) * snap;
      relY = Math.round(relY / snap) * snap;
    }
    return { ...n, position: { ...n.position, x: relX, y: relY } };
  });
  return next;
}

export function alignNodes(op: AlignOp): Node[] {
  const { nodes, setNodes } = useDiagramStore.getState();
  const selectedNodes = nodes.filter((n) => n.selected);
  if (selectedNodes.length < 2) return selectedNodes;
  const next = align(nodes, op);
  setNodes(next);
  return selectedNodes;
}

export function distributeNodes(op: DistributeOp): Node[] {
  const { nodes, setNodes } = useDiagramStore.getState();
  const selectedNodes = nodes.filter((n) => n.selected);
  if (selectedNodes.length < 3) return selectedNodes;
  const next = distribute(nodes, op);
  setNodes(next);
  return selectedNodes;
}

export function AlignLeft() {
  return alignNodes('left');
}

export function AlignTop() {
  return alignNodes('top');
}

export function DistributeHorizontal() {
  return distributeNodes('horiz');
}

export function DistributeVertical() {
  return distributeNodes('vert');
}

export function groupSelectedNodes(label = 'Group') {
  const { groupSelectedIntoNewGroup } = useDiagramStore.getState() as any;
  groupSelectedIntoNewGroup(label);
}
