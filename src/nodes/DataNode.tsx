import React, { useMemo, useRef } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { useDiagramStore } from '@/diagram/DiagramState';
import { hexToRgba } from '@/utils/color';
import NodeMarker from '@/components/NodeMarker';

// 中文说明：数据块节点（DataNode），以倾斜的矩形/梯形示意数据流
export type DataNodeData = {
  label?: string;
  color?: string;
  width?: number;
  typeLabel?: string;
  direction?: 'left' | 'right';
};

export default function DataNode({ id, data, selected }: NodeProps<DataNodeData>) {
  const updateNodeData = useDiagramStore((s) => s.updateNodeData);
  const label = data?.label ?? 'Data Block';
  const variant: string | undefined = (data as any)?.variant ?? 'input';
  const color = data?.color ?? '#6b7280';
  const width = Math.max(120, Math.min(360, data?.width ?? 180));
  const direction: 'left' | 'right' = (data as any)?.direction ?? 'right';

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
      <NodeMarker variant={variant} />
      <div className="text-xs text-gray-500">Data</div>
      {/* 倾斜矩形/梯形图示 */}
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
