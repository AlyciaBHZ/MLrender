import React, { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { hexToRgba } from '@/utils/color';
import MathText from '@/components/MathText';
import NodeMarker from '@/components/NodeMarker';
import { NodeResizer } from '@reactflow/node-resizer';

export type FCNodeData = { label?: string; color?: string; formulaLabel?: string; variant?: string };

export default function FCNode({ data, selected }: NodeProps<FCNodeData>) {
  const label = data?.label ?? 'FC Layer';
  const formulaLabel = data?.formulaLabel;
  const color = data?.color ?? '#2563eb';
  const variant: string | undefined = data?.variant ?? 'fc';

  const containerStyle = useMemo(
    () => ({
      borderColor: color,
      backgroundColor: hexToRgba(color, 0.08),
      borderRadius: 9999,
      boxShadow: selected ? `0 0 0 2px ${hexToRgba(color, 0.35)}` : undefined,
      width: '100%',
      height: '100%'
    }),
    [color, selected]
  );

  const handleStyle = useMemo(() => ({ backgroundColor: color }), [color]);

  return (
    <div className="rounded-md border bg-white shadow-sm px-3 py-2 min-w-[100px] min-h-[56px] relative select-none" style={containerStyle}>
      <NodeResizer minWidth={100} minHeight={56} isVisible={selected} />
      <NodeMarker variant={variant} />
      <div className="text-xs text-gray-500">Dense / Linear</div>
      <div className="text-sm font-medium text-gray-800 truncate" title={label}>
        {formulaLabel ? <MathText text={formulaLabel} enabled /> : label}
      </div>
      <Handle type="target" position={Position.Left} className="w-2 h-2" style={handleStyle} />
      <Handle type="source" position={Position.Right} className="w-2 h-2" style={handleStyle} />
    </div>
  );
}
