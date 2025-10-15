import React, { useMemo } from 'react';
import type { NodeProps } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';

export type GroupNodeData = {
  label?: string;
  color?: string; // border color
};

export default function GroupNode({ id, data, selected }: NodeProps<GroupNodeData>) {
  const label = data?.label ?? 'Group';
  const color = data?.color ?? '#6b7280'; // gray-500 as default border color

  const containerStyle = useMemo(() => ({
    borderColor: color,
    backgroundColor: 'rgba(107, 114, 128, 0.06)',
    width: '100%',
    height: '100%',
    boxShadow: selected ? `0 0 0 2px rgba(107, 114, 128, 0.25)` : undefined,
    borderStyle: 'dashed' as const,
    borderWidth: 2,
    borderRadius: 8,
  }), [color, selected]);

  const labelId = `group-label-${id}`;
  return (
    <div
      className="rounded-[8px] border bg-white/60 px-3 py-2 min-w-[140px] min-h-[80px] relative select-none"
      style={containerStyle}
      data-node-type="group"
      data-type="group"
      data-role="template"
      role="group"
      aria-labelledby={labelId}
      aria-label={label}
    >
      <NodeResizer minWidth={140} minHeight={80} isVisible={selected} />
      {/* Top label bar spanning container, centered label */}
      <div className="absolute left-2 right-2 top-1 h-7 rounded bg-mlcd-linear-alt border border-mlcd-stroke flex items-center justify-center">
        <span id={labelId} className="text-[10px] text-mlcd-label">{label}</span>
      </div>
    </div>
  );
}
