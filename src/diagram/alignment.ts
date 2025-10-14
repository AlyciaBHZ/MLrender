import type { Node } from 'reactflow';

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

