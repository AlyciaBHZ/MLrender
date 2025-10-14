import React, { useMemo, useRef } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { useDiagramStore } from '@/diagram/DiagramState';
import { hexToRgba } from '@/utils/color';
import NodeMarker from '@/components/NodeMarker';

// 中文说明：全连接层（FC）自定义节点，带输入/输出锚点与标签
export type FCNodeData = {
  label?: string;
  color?: string;
  width?: number;
};

export default function FCNode({ id, data, selected }: NodeProps<FCNodeData>) {
  const updateNodeData = useDiagramStore((s) => s.updateNodeData);
  const label = data?.label ?? 'FC Layer';
  const variant: string | undefined = (data as any)?.variant ?? 'fc';
  const color = data?.color ?? '#2563eb';
  const width = Math.max(100, Math.min(400, data?.width ?? 140));
  const startX = useRef<number | null>(null);
  const startW = useRef<number>(width);

  const containerStyle = useMemo(() => ({
    borderColor: color,
    backgroundColor: hexToRgba(color, 0.08),
    width: `${width}px`,
    // 胶囊外形（Capsule shape）
    borderRadius: 9999,
    boxShadow: selected ? `0 0 0 2px ${hexToRgba(color, 0.35)}` : undefined,
  }), [color, width, selected]);

  const handleStyle = useMemo(() => ({ backgroundColor: color }), [color]);

  const onResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    startX.current = e.clientX;
    startW.current = width;
    const onMove = (ev: MouseEvent) => {
      if (startX.current == null) return;
      const delta = ev.clientX - startX.current;
      const next = Math.max(100, Math.min(400, startW.current + delta));
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
    <div className="rounded-md border bg-white shadow-sm px-3 py-2 min-w-[100px] relative select-none" style={containerStyle}>
      <NodeMarker variant={variant} />
      <div className="text-xs text-gray-500">Dense / Linear</div>
      <div className="text-sm font-medium text-gray-800 truncate" title={label}>{label}</div>

      {/* 简单缩放手柄（右下角） */}
      <div
        className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-3 h-3 rounded-sm border border-gray-300 bg-white cursor-se-resize"
        onMouseDown={onResizeMouseDown}
        title="拖动调整宽度"
      />

      {/* 输入与输出锚点 */}
      <Handle type="target" position={Position.Left} className="w-2 h-2" style={handleStyle} />
      <Handle type="source" position={Position.Right} className="w-2 h-2" style={handleStyle} />
    </div>
  );
}
