import React, { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';

export type NeuronNodeData = { label?: string; color?: string };

export default function NeuronNode({ data, selected }: NodeProps<NeuronNodeData>) {
  const label = data?.label ?? 'Neuron';
  const color = data?.color ?? '#16a34a';

  const containerStyle = useMemo(
    () => ({
      backgroundColor: color,
      width: '100%',
      height: '100%',
      borderRadius: '9999px',
      color: '#ffffff',
      boxShadow: selected ? `0 0 0 3px hsl(var(--mlcd-hover) / 0.25)` : undefined,
    }),
    [color, selected]
  );

  const handleStyle = useMemo(() => ({ color: '#ffffff' }), []);

  return (
    <div className="relative select-none flex items-center justify-center text-center min-w-[60px] min-h-[60px]" style={containerStyle} data-node-type="neuron" data-type="neuron" data-role="func" aria-label={label}>
      <NodeResizer minWidth={60} minHeight={60} isVisible={selected} />
      <div className="text-xs font-medium px-2 truncate" title={label}>
        {label}
      </div>
      <Handle type="target" position={Position.Left} className="handle-touch" style={handleStyle} data-port="in" data-slot="0" />
      <Handle type="source" position={Position.Right} className="handle-touch" style={handleStyle} data-port="out" data-slot="0" />
    </div>
  );
}

