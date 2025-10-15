import React, { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { hexToRgba } from '@/utils/color';
import { NodeResizer } from '@reactflow/node-resizer';
import { NodeRoleColor } from '@/ui/tokens';
import MathText from '@/components/MathText';

export type TensorNodeData = { label?: string; color?: string; depth?: number; typeLabel?: string; formulaLabel?: string };

export default function TensorNode({ data, selected }: NodeProps<TensorNodeData>) {
  const label = data?.label ?? 'Tensor';
  const formulaLabel = data?.formulaLabel;
  const color = data?.color ?? NodeRoleColor.tensor;
  const depth = Math.max(6, Math.min(24, data?.depth ?? 12));

  const containerStyle = useMemo(
    () => ({
      borderColor: color,
      backgroundColor: hexToRgba(color, 0.06),
      boxShadow: selected ? `0 0 0 3px hsl(var(--mlcd-hover) / 0.25)` : undefined,
    }),
    [color, selected]
  );
  const handleStyle = useMemo(() => ({ color }), [color]);

  return (
    <div className="rounded-[8px] border bg-white shadow-sm px-3 py-2 min-w-[120px] min-h-[72px] w-full h-full relative select-none" style={containerStyle} data-node-type="tensor" data-type="tensor" data-role="data" aria-label={label}>
      <NodeResizer minWidth={120} minHeight={72} isVisible={selected} />
      <div className="text-xs text-gray-500">Tensor</div>
      <div className="my-1">
        <svg viewBox="0 0 180 90" width="100%" height="56" xmlns="http://www.w3.org/2000/svg">
          <g data-selected={selected ? 'true' : undefined}>
            <rect x={30 + depth} y={12} width={100} height={60} rx={6} fill={hexToRgba(color, 0.03)} stroke="hsl(var(--mlcd-stroke))" strokeOpacity={0.4} strokeWidth={1.25} />
            <path d={`M ${30+depth} 12 L 30 22 M ${130+depth} 12 L 130 22 M ${130+depth} 72 L 130 82 M ${30+depth} 72 L 30 82`} stroke="hsl(var(--mlcd-stroke))" strokeOpacity={0.5} strokeWidth={1.25} />
            <rect x={30} y={22} width={100} height={60} rx={6} fill={hexToRgba(color, 0.06)} stroke="hsl(var(--mlcd-stroke))" strokeWidth={1.25} />
          </g>
        </svg>
      </div>
      <div className="text-sm font-medium text-gray-800 truncate text-center" title={label}>
        {formulaLabel ? <MathText text={formulaLabel} enabled /> : label}
      </div>
      <Handle type="target" position={Position.Left} className="handle-touch" style={handleStyle} data-port="in" data-slot="0" />
      <Handle type="source" position={Position.Right} className="handle-touch" style={handleStyle} data-port="out" data-slot="0" />
    </div>
  );
}
