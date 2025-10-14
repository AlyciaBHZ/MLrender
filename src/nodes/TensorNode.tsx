import React, { useMemo, useRef } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { useDiagramStore } from '@/diagram/DiagramState';
import { hexToRgba } from '@/utils/color';

export type TensorNodeData = {
  label?: string;
  color?: string;
  width?: number; // 立方体正面宽度
  depth?: number; // 侧向偏移
  typeLabel?: string;
};

export default function TensorNode({ id, data, selected }: NodeProps<TensorNodeData>) {
  const updateNodeData = useDiagramStore((s) => s.updateNodeData);
  const label = data?.label ?? 'Tensor';
  const color = data?.color ?? '#3b82f6';
  const width = Math.max(120, Math.min(360, data?.width ?? 160));
  const depth = Math.max(6, Math.min(24, data?.depth ?? 12));

  const startX = useRef<number | null>(null);
  const startW = useRef<number>(width);

  const containerStyle = useMemo(
    () => ({
      borderColor: color,
      backgroundColor: hexToRgba(color, 0.06),
      width: `${width}px`,
      boxShadow: selected ? `0 0 0 2px ${hexToRgba(color, 0.3)}` : undefined,
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
      const next = Math.max(120, Math.min(360, startW.current + delta));
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
    <div className="rounded-md border bg-white shadow-sm px-3 py-2 min-w-[120px] relative select-none" style={containerStyle}>
      <div className="text-xs text-gray-500">Tensor</div>
      {/* 3D 立方体/棱柱示意 */}
      <div className="my-1">
        <svg viewBox="0 0 180 90" width="100%" height="56" xmlns="http://www.w3.org/2000/svg">
          {/* 后面层 */}
          <rect x={30 + depth} y={12} width={100} height={60} rx={6} fill={hexToRgba(color, 0.03)} stroke={color} strokeOpacity={0.4} />
          {/* 连接线 */}
          <path d={`M ${30+depth} 12 L 30 22 M ${130+depth} 12 L 130 22 M ${130+depth} 72 L 130 82 M ${30+depth} 72 L 30 82`} stroke={color} strokeOpacity={0.5} />
          {/* 前面层 */}
          <rect x={30} y={22} width={100} height={60} rx={6} fill={hexToRgba(color, 0.06)} stroke={color} strokeWidth={2} />
        </svg>
      </div>
      <div className="text-sm font-medium text-gray-800 truncate" title={label}>{label}</div>

      {/* 缩放手柄 */}
      <div
        className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-sm border border-gray-300 bg-white cursor-se-resize"
        onMouseDown={onResizeMouseDown}
        title="拖动调整宽度"
      />

      <Handle type="target" position={Position.Left} className="w-2 h-2" style={handleStyle} />
      <Handle type="source" position={Position.Right} className="w-2 h-2" style={handleStyle} />
    </div>
  );
}

