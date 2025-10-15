import React, { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { hexToRgba } from '@/utils/color';

export type MLPNodeData = {
  label?: string;
  color?: string;
  neuronRows?: number;
  neuronCols?: number;
};

export default function MLPNode({ data, selected }: NodeProps<MLPNodeData>) {
  const label = data?.label ?? 'MLP Layers';
  const color = data?.color ?? '#8b5cf6';
  const rows = Math.max(2, Math.min(6, data?.neuronRows ?? 3));
  const cols = Math.max(3, Math.min(8, data?.neuronCols ?? 5));

  const containerStyle = useMemo(
    () => ({
      borderColor: color,
      backgroundColor: hexToRgba(color, 0.06),
      width: '100%',
      height: '100%',
      boxShadow: selected ? `0 0 0 3px hsl(var(--mlcd-hover) / 0.25)` : undefined,
    }),
    [color, selected]
  );

  const handleStyle = useMemo(() => ({ backgroundColor: color }), [color]);

  const dots: { cx: number; cy: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = 20 + (160 / (cols - 1)) * c;
      const cy = 30 + (60 / (rows - 1)) * r;
      dots.push({ cx, cy });
    }
  }

  return (
    <div className="rounded-[8px] border bg-white shadow-sm px-3 py-2 min-w-[140px] min-h-[80px] relative select-none" style={containerStyle} data-node-type="mlp" data-type="mlp" data-role="core" aria-label={label}>
      <NodeResizer minWidth={140} minHeight={80} isVisible={selected} />
      <div className="text-xs text-gray-500">MLP</div>
      <div className="my-1">
        <svg viewBox="0 0 200 100" width="100%" height="60" xmlns="http://www.w3.org/2000/svg">
          <g data-selected={selected ? 'true' : undefined}>
            <rect x="8" y="10" width="184" height="80" rx="8" fill={hexToRgba(color, 0.05)} stroke="hsl(var(--mlcd-stroke))" strokeWidth="1.25" />
            {dots.map((d, i) => (
              <circle key={i} cx={d.cx} cy={d.cy} r={3} fill={color} />
            ))}
          </g>
        </svg>
      </div>
      <div className="text-sm font-medium text-gray-800 truncate text-center" title={label}>{label}</div>
      <Handle type="target" position={Position.Left} className="w-2 h-2 rounded-full" style={handleStyle} data-port="in" data-slot="0" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 rounded-full" style={handleStyle} data-port="out" data-slot="0" />
    </div>
  );
}
