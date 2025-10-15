import type { Node } from 'reactflow';
import { useDiagramStore } from './DiagramState';

// 中文说明：对齐与分布算法——在选中节点集合上应用位置调整
export type AlignOp = 'left' | 'centerX' | 'right' | 'top' | 'centerY' | 'bottom';
export type DistributeOp = 'horiz' | 'vert';

export function align(nodes: Node[], op: AlignOp): Node[] {
  const sel = nodes.filter((n) => n.selected);
  if (sel.length < 2) return nodes;

  const xs = sel.map((n) => n.position.x);
  const ys = sel.map((n) => n.position.y);
  const ws = sel.map((n) => (n.width ?? 0));
  const hs = sel.map((n) => (n.height ?? 0));

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs.map((x, i) => x + ws[i]));
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys.map((y, i) => y + hs[i]));
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  return nodes.map((n) => {
    if (!n.selected) return n;
    const w = n.width ?? 0;
    const h = n.height ?? 0;
    switch (op) {
      case 'left':
        return { ...n, position: { ...n.position, x: minX } };
      case 'right':
        return { ...n, position: { ...n.position, x: maxX - w } };
      case 'centerX':
        return { ...n, position: { ...n.position, x: centerX - w / 2 } };
      case 'top':
        return { ...n, position: { ...n.position, y: minY } };
      case 'bottom':
        return { ...n, position: { ...n.position, y: maxY - h } };
      case 'centerY':
        return { ...n, position: { ...n.position, y: centerY - h / 2 } };
      default:
        return n;
    }
  });
}

export function distribute(nodes: Node[], op: DistributeOp): Node[] {
  const sel = nodes.filter((n) => n.selected).sort((a, b) => a.position[op === 'horiz' ? 'x' : 'y'] - b.position[op === 'horiz' ? 'x' : 'y']);
  if (sel.length < 3) return nodes;

  const first = sel[0];
  const last = sel[sel.length - 1];
  const total = (op === 'horiz' ? last.position.x - first.position.x : last.position.y - first.position.y);
  const step = total / (sel.length - 1);

  const byId: Record<string, Node> = Object.fromEntries(nodes.map((n) => [n.id, n]));
  sel.forEach((n, idx) => {
    if (idx === 0 || idx === sel.length - 1) return;
    if (op === 'horiz') byId[n.id] = { ...n, position: { ...n.position, x: first.position.x + step * idx } };
    else byId[n.id] = { ...n, position: { ...n.position, y: first.position.y + step * idx } };
  });
  return Object.values(byId);
}

export function alignNodes(op: AlignOp): Node[] {
  const { nodes, setNodes } = useDiagramStore.getState();
  const snap = useDiagramStore.getState().snapGrid?.[0] ?? 8;
  const selectedNodes = nodes.filter((n) => n.selected);
  if (selectedNodes.length < 2) return selectedNodes;
  const next = align(nodes, op).map((n) => {
    if (!n.selected) return n;
    const x = Math.round(n.position.x / snap) * snap;
    const y = Math.round(n.position.y / snap) * snap;
    return { ...n, position: { ...n.position, x, y } };
  });
  setNodes(next);
  return selectedNodes;
}

export function distributeNodes(op: DistributeOp): Node[] {
  const { nodes, setNodes } = useDiagramStore.getState();
  const snap = useDiagramStore.getState().snapGrid?.[0] ?? 8;
  const selectedNodes = nodes.filter((n) => n.selected);
  if (selectedNodes.length < 3) return selectedNodes;
  const next = distribute(nodes, op).map((n) => {
    if (!n.selected) return n;
    const x = Math.round(n.position.x / snap) * snap;
    const y = Math.round(n.position.y / snap) * snap;
    return { ...n, position: { ...n.position, x, y } };
  });
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
