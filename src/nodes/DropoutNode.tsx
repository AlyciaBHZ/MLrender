import React, { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { hexToRgba } from '@/utils/color';

export type DropoutNodeData = { label?: string; color?: string };

export default function DropoutNode({ data, selected }: NodeProps<DropoutNodeData>) {
  const label = data?.label ?? 'Dropout';
  const color = data?.color ?? '#06b6d4';

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

  const handleStyle = useMemo(() => ({ color }), [color]);

  const slashes: { x1: number; y1: number; x2: number; y2: number }[] = [];
  const dots: { cx: number; cy: number }[] = [];
  for (let y = 16; y <= 72; y += 14) {
    for (let x = 16; x <= 184; x += 18) {
      slashes.push({ x1: x - 4, y1: y - 4, x2: x + 4, y2: y + 4 });
    }
  }
  for (let y = 22; y <= 78; y += 20) {
    for (let x = 26; x <= 194; x += 20) {
      dots.push({ cx: x, cy: y });
    }
  }

  return (
    <div className="rounded-[8px] border bg-white shadow-sm px-3 py-2 min-w-[140px] min-h-[80px] relative select-none" style={containerStyle} data-node-type="dropout" data-type="dropout" data-role="func" aria-label={label}>
      <NodeResizer minWidth={140} minHeight={80} isVisible={selected} />
      <div className="text-xs text-gray-500">Regularization</div>
      <div className="my-1">
        <svg viewBox="0 0 210 100" width="100%" height="60" xmlns="http://www.w3.org/2000/svg">
          <g data-selected={selected ? 'true' : undefined}>
            <rect x="10" y="12" width="190" height="76" rx="8" fill={hexToRgba(color, 0.05)} stroke="hsl(var(--mlcd-stroke))" strokeWidth="1.25" strokeDasharray="6 4" />
            <g stroke={color} strokeOpacity="0.5" strokeWidth="1.25">
              {slashes.map((s, i) => (
                <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />
              ))}
            </g>
            <g fill={color} fillOpacity="0.4">
              {dots.map((d, i) => (
                <circle key={`d${i}`} cx={d.cx} cy={d.cy} r={2} />
              ))}
            </g>
          </g>
        </svg>
      </div>
      <div className="text-sm font-medium text-gray-800 truncate text-center" title={label}>{label}</div>
      <Handle type="target" position={Position.Left} className="handle-touch" style={handleStyle} data-port="in" data-slot="0" />
      <Handle type="source" position={Position.Right} className="handle-touch" style={handleStyle} data-port="out" data-slot="0" />
    </div>
  );
}
