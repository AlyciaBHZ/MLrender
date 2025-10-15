// 中文说明：将 React Flow 图导出为 CSV（nodes.csv / edges.csv），供 Sheets/Excel 使用
import type { Node, Edge } from 'reactflow';
import { NODE_HEADERS, EDGE_HEADERS } from './schema';
import { mapNodeToExport } from './mapping';

function toCsv(rows: (string | number | boolean | null | undefined)[][]) {
  const esc = (v: any) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  return rows.map((r) => r.map(esc).join(',')).join('\n');
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function exportNodesCsv(nodes: Node[], filename = 'nodes.csv') {
  const header = [...NODE_HEADERS];
  const rows = nodes.map((n) => {
    const map = mapNodeToExport(n);
    const color = (n.data as any)?.color ?? `token:${map.colorToken}`;
    return [
    n.id,
    n.type || '',
    (n.data as any)?.label ?? '',
    (n.data as any)?.formulaLabel ?? '',
    color,
    map.shape,
    (n.data as any)?.width ?? '',
    (n.data as any)?.height ?? '',
    n.position.x,
    n.position.y,
  ];
  });
  const csv = toCsv([header, ...rows]);
  downloadCsv(filename, csv);
}

export function exportEdgesCsv(edges: Edge[], filename = 'edges.csv') {
  const header = [...EDGE_HEADERS];
  const rows = edges.map((e) => [
    e.id,
    e.source,
    e.target,
    e.type || 'default',
    (e.style as any)?.stroke ?? '',
    Boolean((e as any).markerEnd),
    Boolean((e.data as any)?.residual || e.type === 'residualEdge'),
  ]);
  const csv = toCsv([header, ...rows]);
  downloadCsv(filename, csv);
}

export function exportToSheets(nodes: Node[], edges: Edge[], withTimestamp = false) {
  const ts = withTimestamp ? `-${new Date().toISOString().replace(/[:.]/g, '').slice(0, 15)}` : '';
  exportNodesCsv(nodes, `nodes${ts}.csv`);
  exportEdgesCsv(edges, `edges${ts}.csv`);
}
