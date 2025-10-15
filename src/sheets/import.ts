// 中文说明：从 CSV（nodes.csv / edges.csv）构建 React Flow 图
import type { Node, Edge } from 'reactflow';
import { MarkerType } from 'reactflow';
import { NODE_HEADERS, EDGE_HEADERS } from './schema';

export async function readText(file: File): Promise<string> {
  return await file.text();
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let i = 0;
  let cur: string[] = [];
  let cell = '';
  let inQuotes = false;
  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 2; continue;
        } else { inQuotes = false; i++; continue; }
      } else { cell += ch; i++; continue; }
    } else {
      if (ch === '"') { inQuotes = true; i++; continue; }
      if (ch === ',') { cur.push(cell); cell = ''; i++; continue; }
      if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && text[i + 1] === '\n') i++;
        cur.push(cell); cell = '';
        if (cur.length > 1 || cur[0] !== '') rows.push(cur);
        cur = []; i++; continue;
      }
      cell += ch; i++;
    }
  }
  cur.push(cell);
  if (cur.length > 1 || cur[0] !== '') rows.push(cur);
  return rows;
}

function toBool(v: any): boolean {
  const s = String(v ?? '').trim().toLowerCase();
  return s === 'true' || s === '1' || s === 'yes';
}

export function buildDiagramFromCsv(nodesCsv: string, edgesCsv: string): { nodes: Node[]; edges: Edge[] } {
  const nodeRows = parseCsv(nodesCsv);
  const edgeRows = parseCsv(edgesCsv);
  const [nodeHeader, ...nodeData] = nodeRows;
  const [edgeHeader, ...edgeData] = edgeRows;
  // 构建列索引，兼容大小写
  const nh = Object.fromEntries(NODE_HEADERS.map((h) => [h, nodeHeader.findIndex((x) => x.trim().toLowerCase() === h)]));
  const eh = Object.fromEntries(EDGE_HEADERS.map((h) => [h, edgeHeader.findIndex((x) => x.trim().toLowerCase() === h)]));

  const nodes: Node[] = nodeData.map((r) => {
    const id = r[nh['id']];
    const type = r[nh['type']] || 'boxNode';
    const label = r[nh['label']] || '';
    const formula = nh['formula'] != null && nh['formula'] >= 0 ? r[nh['formula']] : '';
    const color = r[nh['color']] || undefined;
    const width = r[nh['width']] ? Number(r[nh['width']]) : undefined;
    const height = nh['height'] != null && nh['height'] >= 0 && r[nh['height']] ? Number(r[nh['height']]) : undefined;
    const x = r[nh['x']] ? Number(r[nh['x']]) : 0;
    const y = r[nh['y']] ? Number(r[nh['y']]) : 0;
    return { id, type, position: { x, y }, data: { label, formulaLabel: formula || undefined, color, width, height } } as Node;
  });

  const edges: Edge[] = edgeData.map((r) => {
    const id = r[eh['id']];
    const source = r[eh['source']];
    const target = r[eh['target']];
    const type = r[eh['type']] || undefined;
    const stroke = r[eh['stroke']] || undefined;
    const arrow = r[eh['arrow']] ? toBool(r[eh['arrow']]) : false;
    const residual = r[eh['residual']] ? toBool(r[eh['residual']]) : false;

    const style: any = {};
    if (stroke) style.stroke = stroke;
    if (residual) style.strokeDasharray = '6 4';

    const edge: Edge = { id, source, target, style } as Edge;
    if (type) (edge as any).type = type;
    if (arrow) (edge as any).markerEnd = { type: MarkerType.ArrowClosed, color: stroke } as any;
    if (residual) { (edge as any).type = 'residualEdge'; edge.data = { ...(edge.data || {}), residual: true } as any; }
    return edge;
  });
  return { nodes, edges };
}

export async function importFromSheets(files: FileList): Promise<{ nodes: Node[]; edges: Edge[] } | null> {
  if (!files || files.length === 0) return null;
  let nodesText = '';
  let edgesText = '';
  for (const file of Array.from(files)) {
    const text = await readText(file);
    const head = text.split(/\r?\n/, 1)[0].toLowerCase();
    if (NODE_HEADERS.every((h) => head.includes(h))) nodesText = text;
    if (head.includes('source') && head.includes('target')) edgesText = text;
  }
  if (!nodesText || !edgesText) return null;
  return buildDiagramFromCsv(nodesText, edgesText);
}
