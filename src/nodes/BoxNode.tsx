import React, { useMemo, useRef } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { useDiagramStore } from '@/diagram/DiagramState';
import { hexToRgba } from '@/utils/color';
import NodeMarker from '@/components/NodeMarker';

export type BoxNodeData = {
  label?: string;
  color?: string;
  width?: number;
  typeLabel?: string; // 顶部小标题，如 Conv / Pooling
};

export default function BoxNode({ id, data, selected }: NodeProps<BoxNodeData>) {
  const updateNodeData = useDiagramStore((s) => s.updateNodeData);
  const label = data?.label ?? 'Node';
  const color = data?.color ?? '#2563eb';
  const width = Math.max(100, Math.min(400, data?.width ?? 160));
  const typeLabel = data?.typeLabel ?? 'Module';
  const variant: string | undefined = (data as any)?.variant;

  const startX = useRef<number | null>(null);
  const startW = useRef<number>(width);

  const containerStyle = useMemo(
    () => ({
      borderColor: color,
      backgroundColor: hexToRgba(color, variant === 'loss' ? 0.12 : 0.08),
      width: `${width}px`,
      boxShadow: selected ? `0 0 0 2px ${hexToRgba(color, 0.35)}` : undefined,
      borderStyle: variant === 'dropout' ? 'dashed' : 'solid',
      borderWidth: variant === 'dropout' || variant === 'loss' ? 2 : 1,
      // 胶囊外形（Capsule shape）用于通用网络层：FC/BatchNorm 等；Loss 保持普通矩形
      borderRadius: variant === 'fc' || variant === 'batchnorm' ? 9999 : variant === 'activation' ? 10 : variant === 'embedding' ? 4 : 6,
    }),
    [color, width, selected, variant]
  );
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
      {variant === 'batchnorm' && (
        <div className="absolute left-0 right-0 top-0 h-1.5 opacity-70" style={{ backgroundColor: color }} />
      )}
      <NodeMarker variant={variant as any} />
      <div className="text-xs text-gray-500">{typeLabel}</div>
      <div className="text-sm font-medium text-gray-800 truncate" title={label}>{label}</div>
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
