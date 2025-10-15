import React, { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import MathText from '@/components/MathText';
import { hexToRgba } from '@/utils/color';
import NodeMarker from '@/components/NodeMarker';
import { NodeRoleColor } from '@/ui/tokens';

export type ActivationNodeData = { label?: string; color?: string; shape?: 'circle' | 'diamond'; formulaLabel?: string };

export default function ActivationNode({ data, selected }: NodeProps<ActivationNodeData>) {
  const label = data?.label ?? 'Activation';
  const formulaLabel = data?.formulaLabel;
  const color = data?.color ?? NodeRoleColor.activation;
  const shape = data?.shape ?? 'circle';
  const isCircle = shape === 'circle';

  const containerStyle = useMemo(
    () => ({
      borderColor: color,
      backgroundColor: hexToRgba(color, 0.08),
      boxShadow: selected ? `0 0 0 3px hsl(var(--mlcd-hover) / 0.25)` : undefined,
    }),
    [color, selected]
  );
  const handleStyle = useMemo(() => ({ color }), [color]);
  const roundedClass = isCircle ? 'rounded-full' : 'rounded-[10px]';

  return (
    <div className={`${roundedClass} border bg-white shadow-sm relative select-none flex items-center justify-center text-center p-2 min-w-[80px] min-h-[80px] w-full h-full`} style={containerStyle} data-node-type="activation" data-type="activation" data-role="func" data-shape={shape} aria-label={label}>
      <NodeResizer minWidth={80} minHeight={80} isVisible={selected} />
      <NodeMarker variant={'activation'} />
      {!isCircle && (
        <svg className="absolute inset-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <g data-selected={selected ? 'true' : undefined}>
            <polygon points="50,8 92,50 50,92 8,50" fill={hexToRgba(color, 0.08)} stroke="hsl(var(--mlcd-stroke))" strokeWidth={1.25} />
          </g>
        </svg>
      )}
      <div className="text-sm font-medium text-gray-800 truncate" title={label}>
        {formulaLabel ? <MathText text={formulaLabel} enabled /> : label}
      </div>
      <Handle type="target" position={Position.Left} className="handle-touch" style={handleStyle} data-port="in" data-slot="0" />
      <Handle type="source" position={Position.Right} className="handle-touch" style={handleStyle} data-port="out" data-slot="0" />
    </div>
  );
}
