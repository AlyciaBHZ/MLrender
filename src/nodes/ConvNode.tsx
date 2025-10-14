import React, { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { hexToRgba } from '@/utils/color';
import { NodeResizer } from '@reactflow/node-resizer';
import MathText from '@/components/MathText';

export type ConvNodeData = { label?: string; color?: string; formulaLabel?: string };

export default function ConvNode({ data, selected }: NodeProps<ConvNodeData>) {
  const label = data?.label ?? 'Conv Layer';
  const formulaLabel = data?.formulaLabel;
  const color = data?.color ?? '#f59e0b';

  const containerStyle = useMemo(
    () => ({
      borderColor: color,
      backgroundColor: hexToRgba(color, 0.08),
      width: '100%',
      height: '100%',
      boxShadow: selected ? `0 0 0 2px ${hexToRgba(color, 0.35)}` : undefined,
    }),
    [color, selected]
  );
  const handleStyle = useMemo(() => ({ backgroundColor: color }), [color]);

  return (
    <div className="rounded-md border bg-white shadow-sm px-3 py-2 min-w-[120px] min-h-[72px] relative select-none" style={containerStyle}>
      <NodeResizer minWidth={120} minHeight={72} isVisible={selected} />
      <div className="text-xs text-gray-500">Conv</div>
      <div className="my-1">
        <svg viewBox="0 0 140 70" width="100%" height="48" xmlns="http://www.w3.org/2000/svg">
          <rect x="38" y="10" width="82" height="48" rx="4" fill="#fff" stroke={color} strokeOpacity="0.45"/>
          <rect x="24" y="6" width="82" height="48" rx="4" fill="#fff" stroke={color} strokeOpacity="0.7"/>
          <rect x="10" y="2" width="82" height="48" rx="4" fill="#fff" stroke={color} strokeWidth="2"/>
          <g opacity="0.15">
            <rect x="44" y="58" width="60" height="6" rx="3" fill="#000" />
          </g>
        </svg>
      </div>
      <div className="text-sm font-medium text-gray-800 truncate" title={label}>
        {formulaLabel ? <MathText text={formulaLabel} enabled /> : label}
      </div>
      <Handle type="target" position={Position.Left} className="w-2 h-2" style={handleStyle} />
      <Handle type="source" position={Position.Right} className="w-2 h-2" style={handleStyle} />
    </div>
  );
}
