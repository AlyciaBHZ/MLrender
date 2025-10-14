import React, { useMemo, useRef } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { useDiagramStore } from '@/diagram/DiagramState';
import { hexToRgba } from '@/utils/color';

export type CircleNodeData = {
  label?: string;
  color?: string;
  width?: number; // 直径
  typeLabel?: string;
};

export default function CircleNode({ id, data, selected }: NodeProps<CircleNodeData>) {
  const updateNodeData = useDiagramStore((s) => s.updateNodeData);
  const label = data?.label ?? 'Node';
  const color = data?.color ?? '#2563eb';
  const width = Math.max(80, Math.min(300, data?.width ?? 120));
  const typeLabel = data?.typeLabel ?? 'Module';

  const startX = useRef<number | null>(null);
  const startW = useRef<number>(width);

  const containerStyle = useMemo(
    () => ({
      borderColor: color,
      backgroundColor: hexToRgba(color, 0.08),
      width: `${width}px`,
      height: `${width}px`,
      borderRadius: '9999px',
      boxShadow: selected ? `0 0 0 2px ${hexToRgba(color, 0.35)}` : undefined,
    }),
    [color, width, selected]
  );
  const handleStyle = useMemo(() => ({ backgroundColor: color }), [color]);

  const onResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    startX.current = e.clientX;
    startW.current = width;
    const onMove = (ev: MouseEvent) => {
      if (startX.current == null) return;
      const delta = ev.clientX - startX.current;
      const next = Math.max(80, Math.min(300, startW.current + delta));
      updateNodeData(id, { width: next });
    };
    const onUp = () => {
      startX.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div
      className="border bg-white shadow-sm relative select-none flex items-center justify-center text-center"
      style={containerStyle}
    >
      <div className="absolute top-1 left-1 text-[10px] text-gray-500">{typeLabel}</div>
      <div className="text-sm font-medium text-gray-800 px-2 truncate" title={label}>{label}</div>
      <div
        className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-sm border border-gray-300 bg-white cursor-se-resize"
        onMouseDown={onResizeMouseDown}
        title="拖动调整大小"
      />
      <Handle type="target" position={Position.Left} className="w-2 h-2" style={handleStyle} />
      <Handle type="source" position={Position.Right} className="w-2 h-2" style={handleStyle} />
    </div>
  );
}
