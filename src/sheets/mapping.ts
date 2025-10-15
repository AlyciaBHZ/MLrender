import type { Node } from 'reactflow';

export type ExportShape = 'rect' | 'circle' | 'diamond' | 'tensor' | 'group';

export type ExportMapping = {
  colorToken: string; // e.g., 'mlcd.linear', 'mlcd.data'
  shape: ExportShape;
};

export function mapNodeToExport(n: Node): ExportMapping {
  const type = n.type || '';
  const data: any = n.data || {};
  const variant: string | undefined = data.variant;
  if (type === 'tensorNode') return { colorToken: 'mlcd.data', shape: 'tensor' };
  if (type === 'activationNode') {
    const shape = data.shape === 'diamond' ? 'diamond' : 'circle';
    // default activation color: green; alt orange as opt-in
    const token = data.colorAlt === 'orange' ? 'mlcd.actO' : 'mlcd.actG';
    return { colorToken: token, shape };
  }
  if (type === 'convNode') return { colorToken: 'mlcd.linearAlt', shape: 'rect' };
  if (type === 'fcNode' || type === 'mlpNode') return { colorToken: 'mlcd.linear', shape: 'rect' };
  if (type === 'dropoutNode') return { colorToken: 'mlcd.aux', shape: 'rect' };
  if (type === 'circleNode') return { colorToken: 'mlcd.opt', shape: 'circle' };
  if (type === 'groupNode') return { colorToken: 'mlcd.dataN', shape: 'group' };
  if (type === 'boxNode') {
    switch (variant) {
      case 'loss':
        return { colorToken: 'mlcd.loss', shape: 'rect' };
      case 'dropout':
        return { colorToken: 'mlcd.aux', shape: 'rect' };
      case 'batchnorm':
        return { colorToken: 'mlcd.linearAlt', shape: 'rect' };
      case 'embedding':
        return { colorToken: 'mlcd.data', shape: 'rect' };
      case 'pool':
      case 'flatten':
        return { colorToken: 'mlcd.linear', shape: 'rect' };
      case 'attention':
        return { colorToken: 'mlcd.data', shape: 'rect' };
      case 'activation':
        return { colorToken: 'mlcd.actG', shape: 'rect' };
      default:
        return { colorToken: 'mlcd.linear', shape: 'rect' };
    }
  }
  // default fallback
  return { colorToken: 'mlcd.stroke', shape: 'rect' };
}

