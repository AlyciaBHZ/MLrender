import React, { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { hexToRgba } from '@/utils/color';
import { NodeResizer } from '@reactflow/node-resizer';
import MathText from '@/components/MathText';

export type DataNodeData = { label?: string; color?: string; direction?: 'left' | 'right'; formulaLabel?: string };

export default function DataNode({ data, selected }: NodeProps<DataNodeData>) {
  const label = data?.label ?? 'Data Block';
  const formulaLabel = data?.formulaLabel;
  const color = data?.color ?? '#6b7280';
  const direction: 'left' | 'right' = data?.direction ?? 'right';

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
      <div className="text-xs text-gray-500">Data</div>
      <div className="my-1">
        <svg viewBox="0 0 140 64" width="100%" height="44" xmlns="http://www.w3.org/2000/svg">
          {direction === 'right' ? (
            <>
              <polygon points="18,10 122,6 126,50 22,54" fill={hexToRgba(color, 0.08)} stroke={color} strokeWidth="2" />
              <path d="M38 28h64" stroke={color} strokeWidth="2" opacity="0.6" />
            </>
          ) : (
            <>
              <polygon points="14,6 118,10 114,54 10,50" fill={hexToRgba(color, 0.08)} stroke={color} strokeWidth="2" />
              <path d="M38 28h64" stroke={color} strokeWidth="2" opacity="0.6" />
            </>
          )}
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
