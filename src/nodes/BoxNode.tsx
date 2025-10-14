import React, { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { hexToRgba } from '@/utils/color';
import NodeMarker from '@/components/NodeMarker';
import { NodeResizer } from '@reactflow/node-resizer';
import MathText from '@/components/MathText';

export type BoxNodeData = {
  label?: string;
  color?: string;
  typeLabel?: string;
  variant?: string;
  formulaLabel?: string;
};

export default function BoxNode({ data, selected }: NodeProps<BoxNodeData>) {
  const label = data?.label ?? 'Node';
  const formulaLabel = data?.formulaLabel;
  const color = data?.color ?? '#2563eb';
  const typeLabel = data?.typeLabel ?? 'Module';
  const variant = data?.variant as string | undefined;

  const containerStyle = useMemo(
    () => ({
      borderColor: color,
      backgroundColor: hexToRgba(color, variant === 'loss' ? 0.12 : 0.08),
      width: '100%',
      height: '100%',
      boxShadow: selected ? `0 0 0 2px ${hexToRgba(color, 0.35)}` : undefined,
      borderStyle: variant === 'dropout' ? 'dashed' : 'solid',
      borderWidth: variant === 'dropout' || variant === 'loss' ? 2 : 1,
      borderRadius: variant === 'fc' || variant === 'batchnorm' ? 9999 : variant === 'activation' ? 10 : variant === 'embedding' ? 4 : 6,
    }),
    [color, selected, variant]
  );
  const handleStyle = useMemo(() => ({ backgroundColor: color }), [color]);

  return (
    <div className="rounded-md border bg-white shadow-sm px-3 py-2 min-w-[100px] min-h-[56px] relative select-none" style={containerStyle}>
      <NodeResizer minWidth={100} minHeight={56} isVisible={selected} />
      {variant === 'batchnorm' && (
        <div className="absolute left-0 right-0 top-0 h-1.5 opacity-70" style={{ backgroundColor: color }} />
      )}
      <NodeMarker variant={variant as any} />
      <div className="text-xs text-gray-500">{typeLabel}</div>
      <div className="text-sm font-medium text-gray-800 truncate" title={label}>
        {formulaLabel ? <MathText text={formulaLabel} enabled /> : label}
      </div>
      <Handle type="target" position={Position.Left} className="w-2 h-2" style={handleStyle} />
      <Handle type="source" position={Position.Right} className="w-2 h-2" style={handleStyle} />
    </div>
  );
}
