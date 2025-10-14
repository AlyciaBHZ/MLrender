import React, { useMemo, useRef } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { useDiagramStore } from '@/diagram/DiagramState';
import { hexToRgba } from '@/utils/color';
import NodeMarker from '@/components/NodeMarker';

// 激活函数节点（圆形或菱形），突出非线性决策点
export type ActivationNodeData = {
  label?: string;
  color?: string;
  width?: number; // 尺寸（圆的直径 / 菱形边长）
  shape?: 'circle' | 'diamond';
};

export default function ActivationNode({ id, data, selected }: NodeProps<ActivationNodeData>) {
  const updateNodeData = useDiagramStore((s) => s.updateNodeData);
  const label = data?.label ?? 'Activation';
  const color = data?.color ?? '#22c55e';
  const shape = data?.shape ?? 'circle';
  const width = Math.max(80, Math.min(300, data?.width ?? 120));

  const startX = useRef<number | null>(null);
  const startW = useRef<number>(width);

  const isCircle = shape === 'circle';

  const containerStyle = useMemo(() => ({
    borderColor: color,
    backgroundColor: hexToRgba(color, 0.08),
    width: `${width}px`,
    height: `${width}px`,
    borderRadius: isCircle ? '9999px' : 10,
    boxShadow: selected ? `0 0 0 2px ${hexToRgba(color, 0.35)}` : undefined,
  }), [color, width, selected, isCircle]);

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
    <div className="border bg-white shadow-sm relative select-none flex items-center justify-center text-center px-2"
         style={containerStyle}
    >
      <NodeMarker variant={'activation'} />
      {/* 当为菱形形态时，补充内部菱形图形以加强语义 */}
      {!isCircle && (
        <svg className="absolute inset-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,8 92,50 50,92 8,50" fill={hexToRgba(color, 0.08)} stroke={color} strokeWidth={2} />
        </svg>
      )}
      <div className="text-sm font-medium text-gray-800 truncate" title={label}>
        {label}
      </div>

      {/* 缩放手柄 */}
      <div
        className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-sm border border-gray-300 bg-white cursor-se-resize"
        onMouseDown={onResizeMouseDown}
        title="拖动调整大小"
      />

      {/* 输入/输出锚点 */}
      <Handle type="target" position={Position.Left} className="w-2 h-2" style={handleStyle} />
      <Handle type="source" position={Position.Right} className="w-2 h-2" style={handleStyle} />
    </div>
  );
}

