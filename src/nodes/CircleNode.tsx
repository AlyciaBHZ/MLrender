import React, { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { hexToRgba } from '@/utils/color';
import { NodeResizer } from '@reactflow/node-resizer';
import MathText from '@/components/MathText';

export type CircleNodeData = { label?: string; color?: string; formulaLabel?: string };

export default function CircleNode({ data, selected }: NodeProps<CircleNodeData>) {
  const label = data?.label ?? 'Node';
  const formulaLabel = data?.formulaLabel;
  const color = data?.color ?? '#2563eb';

  const containerStyle = useMemo(
    () => ({
      borderColor: color,
      backgroundColor: hexToRgba(color, 0.08),
      width: '100%',
      height: '100%',
      borderRadius: '9999px',
      boxShadow: selected ? `0 0 0 3px hsl(var(--mlcd-hover) / 0.25)` : undefined,
    }),
    [color, selected]
  );
  const handleStyle = useMemo(() => ({ color }), [color]);

  return (
    <div className="border bg-white shadow-sm relative select-none flex items-center justify-center text-center min-w-[80px] min-h-[80px]" style={containerStyle} data-node-type="circle" data-type="optimizer" data-role="objective" aria-label={label}>
      <NodeResizer minWidth={80} minHeight={80} isVisible={selected} />
      <div className="text-sm font-medium text-gray-800 px-2 truncate" title={label}>
        {formulaLabel ? <MathText text={formulaLabel} enabled /> : label}
      </div>
      <Handle type="target" position={Position.Left} className="handle-touch" style={handleStyle} data-port="in" data-slot="0" />
      <Handle type="source" position={Position.Right} className="handle-touch" style={handleStyle} data-port="out" data-slot="0" />
    </div>
  );
}
