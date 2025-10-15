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
      boxShadow: selected ? `0 0 0 3px hsl(var(--mlcd-hover) / 0.25)` : undefined,
    }),
    [color, selected]
  );
  const handleStyle = useMemo(() => ({ color }), [color]);

  return (
    <div className="rounded-[8px] border bg-white shadow-sm px-3 py-2 min-w-[120px] min-h-[72px] w-full h-full relative select-none" style={containerStyle} data-node-type="data" data-type="tensor" data-role="data" data-direction={direction} aria-label={label}>
      <NodeResizer minWidth={120} minHeight={72} isVisible={selected} />
      <div className="text-xs text-gray-500">Data</div>
      <div className="my-1">
        <svg viewBox="0 0 140 64" width="100%" height="44" xmlns="http://www.w3.org/2000/svg">
          <g data-selected={selected ? 'true' : undefined}>
            {direction === 'right' ? (
              <>
                <polygon points="18,10 122,6 126,50 22,54" fill={hexToRgba(color, 0.08)} stroke="hsl(var(--mlcd-stroke))" strokeWidth="1.25" />
                <path d="M38 28h64" stroke="hsl(var(--mlcd-stroke))" strokeWidth="1.25" opacity="0.6" />
              </>
            ) : (
              <>
                <polygon points="14,6 118,10 114,54 10,50" fill={hexToRgba(color, 0.08)} stroke="hsl(var(--mlcd-stroke))" strokeWidth="1.25" />
                <path d="M38 28h64" stroke="hsl(var(--mlcd-stroke))" strokeWidth="1.25" opacity="0.6" />
              </>
            )}
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
