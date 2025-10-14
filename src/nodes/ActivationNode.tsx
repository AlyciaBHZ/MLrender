import React, { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import MathText from '@/components/MathText';
import { hexToRgba } from '@/utils/color';
import NodeMarker from '@/components/NodeMarker';

export type ActivationNodeData = { label?: string; color?: string; shape?: 'circle' | 'diamond'; formulaLabel?: string };

export default function ActivationNode({ data, selected }: NodeProps<ActivationNodeData>) {
  const label = data?.label ?? 'Activation';
  const formulaLabel = data?.formulaLabel;
  const color = data?.color ?? '#22c55e';
  const shape = data?.shape ?? 'circle';
  const isCircle = shape === 'circle';

  const containerStyle = useMemo(
    () => ({
      borderColor: color,
      backgroundColor: hexToRgba(color, 0.08),
      width: '100%',
      height: '100%',
      borderRadius: isCircle ? '9999px' : 10,
      boxShadow: selected ? `0 0 0 2px ${hexToRgba(color, 0.35)}` : undefined,
    }),
    [color, selected, isCircle]
  );
  const handleStyle = useMemo(() => ({ backgroundColor: color }), [color]);

  return (
    <div className="border bg-white shadow-sm relative select-none flex items-center justify-center text-center px-2 min-w-[80px] min-h-[80px]" style={containerStyle}>
      <NodeResizer minWidth={80} minHeight={80} isVisible={selected} />
      <NodeMarker variant={'activation'} />
      {!isCircle && (
        <svg className="absolute inset-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,8 92,50 50,92 8,50" fill={hexToRgba(color, 0.08)} stroke={color} strokeWidth={2} />
        </svg>
      )}
      <div className="text-sm font-medium text-gray-800 truncate" title={label}>
        {formulaLabel ? <MathText text={formulaLabel} enabled /> : label}
      </div>
      <Handle type="target" position={Position.Left} className="w-2 h-2" style={handleStyle} />
      <Handle type="source" position={Position.Right} className="w-2 h-2" style={handleStyle} />
    </div>
  );
}
