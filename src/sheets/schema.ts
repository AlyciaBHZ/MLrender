// 中文说明：Export to Sheets 的列头规范，集中管理，避免分散硬编码
export const NODE_HEADERS = ['id', 'type', 'label', 'color', 'width', 'x', 'y'] as const;
export const EDGE_HEADERS = ['id', 'source', 'target', 'type', 'stroke', 'arrow', 'residual'] as const;

export type NodeHeader = typeof NODE_HEADERS[number];
export type EdgeHeader = typeof EDGE_HEADERS[number];

