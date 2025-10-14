import React, { useMemo, useRef } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { useDiagramStore } from '@/diagram/DiagramState';
import { hexToRgba } from '@/utils/color';

// 中文说明：卷积层节点（ConvNode），使用简洁的“叠放方块”3D 视觉表现通道深度
export type ConvNodeData = {
  label?: string;
  color?: string;
  width?: number;
  typeLabel?: string;
};

export default function ConvNode({ id, data, selected }: NodeProps<ConvNodeData>) {
  const updateNodeData = useDiagramStore((s) => s.updateNodeData);
  const label = data?.label ?? 'Conv Layer';
  const color = data?.color ?? '#f59e0b';
  const width = Math.max(120, Math.min(360, data?.width ?? 160));

  const startX = useRef<number | null>(null);
  const startW = useRef<number>(width);

  const containerStyle = useMemo(
    () => ({
      borderColor: color,
      backgroundColor: hexToRgba(color, 0.08),
      width: `${width}px`,
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
    <div className="rounded-md border bg-white shadow-sm px-3 py-2 relative select-none" style={containerStyle}>
      <div className="text-xs text-gray-500">Conv</div>
      {/* 3D 叠放方块图示（根据宽度自适配高度） */}
      <div className="my-1">
        <svg viewBox="0 0 140 70" width="100%" height="48" xmlns="http://www.w3.org/2000/svg">
          {/* 背层 */}
          <rect x="38" y="10" width="82" height="48" rx="4" fill="#fff" stroke={color} strokeOpacity="0.45"/>
          {/* 中层 */}
          <rect x="24" y="6" width="82" height="48" rx="4" fill="#fff" stroke={color} strokeOpacity="0.7"/>
          {/* 前层 */}
          <rect x="10" y="2" width="82" height="48" rx="4" fill="#fff" stroke={color} strokeWidth="2"/>
          {/* 阴影 */}
          <g opacity="0.15">
            <rect x="44" y="58" width="60" height="6" rx="3" fill="#000" />
          </g>
        </svg>
      </div>
      <div className="text-sm font-medium text-gray-800 truncate" title={label}>{label}</div>

      {/* 缩放手柄 */}
      <div
        className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-sm border border-gray-300 bg-white cursor-se-resize"
        onMouseDown={onResizeMouseDown}
        title="拖动调整宽度"
      />

      {/* 连接句柄 */}
      <Handle type="target" position={Position.Left} className="w-2 h-2" style={handleStyle} />
      <Handle type="source" position={Position.Right} className="w-2 h-2" style={handleStyle} />
    </div>
  );
}
