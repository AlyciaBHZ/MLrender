import React, { useMemo } from 'react';
import { useDiagramStore } from '@/diagram/DiagramState';
import type { Edge } from 'reactflow';
import { MarkerType } from 'reactflow';

// 中文说明：右侧属性面板，支持编辑选中节点的标签、颜色、宽度
export default function PropertiesPanel() {
  const nodes = useDiagramStore((s) => s.nodes);
  const updateNodeData = useDiagramStore((s) => s.updateNodeData);

  const edges = useDiagramStore((s) => s.edges);
  const updateEdge = useDiagramStore((s) => s.updateEdge);

  const selectedNodes = useMemo(() => nodes.filter((n) => n.selected), [nodes]);
  const selectedNode = selectedNodes[0];
  const isMulti = selectedNodes.length > 1;
  const selectedEdge = useMemo(() => edges.find((e) => (e as any).selected), [edges]);

  if (!selectedNode && !selectedEdge) {
    return <aside className="border-l bg-gray-50 p-3 text-sm text-gray-500">未选择节点/连线</aside>;
  }

  if (isMulti) {
    const sample = selectedNodes[0];
    const data: any = sample.data ?? {};
    const color = data.color ?? '#2563eb';
    const width = Math.max(100, Math.min(400, data.width ?? 140));

    const onColorAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      selectedNodes.forEach((n) => updateNodeData(n.id, { color: v }));
    };
    const onWidthAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Number(e.target.value);
      selectedNodes.forEach((n) => updateNodeData(n.id, { width: v }));
    };

    const [prefix, setPrefix] = React.useState('');
    const applyPrefix = () => {
      selectedNodes.forEach((n, idx) => {
        const base = (n.data as any)?.label ?? '';
        updateNodeData(n.id, { label: `${prefix}${base || idx + 1}` });
      });
    };

    return (
      <aside className="border-l bg-gray-50 p-3 text-sm">
        <div className="mb-2 font-medium text-gray-700">批量节点属性（{selectedNodes.length} 项）</div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">颜色（全部）</label>
            <input type="color" value={color} onChange={onColorAll} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">宽度（全部）：{width}px</label>
            <input type="range" min={100} max={400} step={5} value={width} onChange={onWidthAll} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">标签前缀</label>
            <div className="flex gap-2">
              <input className="flex-1 rounded border px-2 py-1" value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="例如：Layer-" />
              <button className="text-xs px-2 py-1 rounded border hover:bg-gray-50" onClick={applyPrefix}>应用</button>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  if (selectedNode) {
    const data: any = selectedNode.data ?? {};
    const label = data.label ?? '';
    const color = data.color ?? '#2563eb';
    const width = Math.max(100, Math.min(400, data.width ?? 140));

    const onLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(selectedNode.id, { label: e.target.value });
    };
    const onColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(selectedNode.id, { color: e.target.value });
    };
    const onWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      updateNodeData(selectedNode.id, { width: Number(e.target.value) });
    };

    return (
      <aside className="border-l bg-gray-50 p-3 text-sm">
        <div className="mb-2 font-medium text-gray-700">节点属性</div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">标签</label>
            <input
              className="w-full rounded border px-2 py-1 text-gray-800"
              value={label}
              onChange={onLabelChange}
              placeholder="节点标签"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">颜色</label>
            <input type="color" value={color} onChange={onColorChange} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">宽度：{width}px</label>
            <input type="range" min={100} max={400} step={5} value={width} onChange={onWidthChange} />
          </div>
          <div className="text-xs text-gray-500">ID：{selectedNode.id}</div>
          <div className="text-xs text-gray-500">类型：{selectedNode.type}</div>
        </div>
      </aside>
    );
  }

  // Edge editor
  const e = selectedEdge as Edge | undefined;
  const stroke = (e?.style as any)?.stroke ?? '#111827';
  const hasArrow = Boolean((e as any)?.markerEnd);
  const isResidual = Boolean((e?.type === 'residualEdge') || (e?.data as any)?.residual);

  const onEdgeColor = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const color = ev.target.value;
    updateEdge!(e!.id, (edge) => ({
      ...edge,
      style: { ...(edge.style || {}), stroke: color },
      markerEnd: hasArrow ? { type: MarkerType.ArrowClosed, color } : undefined,
    }));
  };
  const onEdgeArrow = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const checked = ev.target.checked;
    updateEdge!(e!.id, (edge) => ({
      ...edge,
      markerEnd: checked ? { type: MarkerType.ArrowClosed, color: (edge.style as any)?.stroke || '#111827' } : undefined,
    }));
  };
  const onEdgeResidual = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const checked = ev.target.checked;
    updateEdge!(e!.id, (edge) => ({
      ...edge,
      type: checked ? 'residualEdge' : undefined,
      data: { ...(edge.data || {}), residual: checked },
      style: { ...(edge.style || {}), strokeDasharray: checked ? '6 4' : undefined },
    }));
  };

  const onEdgeTypeChange = (ev: React.ChangeEvent<HTMLSelectElement>) => {
    const v = ev.target.value as 'default' | 'simpleArrowEdge' | 'residualEdge';
    updateEdge!(e!.id, (edge) => {
      const next: Edge = { ...edge } as Edge;
      if (v === 'default') {
        delete (next as any).type;
        next.style = { ...(next.style || {}) };
        if ((next.style as any).strokeDasharray) delete (next.style as any).strokeDasharray;
      } else if (v === 'simpleArrowEdge') {
        (next as any).type = 'simpleArrowEdge';
        next.style = { ...(next.style || {}) };
        if ((next.style as any).strokeDasharray) delete (next.style as any).strokeDasharray;
      } else if (v === 'residualEdge') {
        (next as any).type = 'residualEdge';
        next.style = { ...(next.style || {}), strokeDasharray: '6 4' };
        next.data = { ...(next.data || {}), residual: true };
      }
      return next;
    });
  };

  return (
    <aside className="border-l bg-gray-50 p-3 text-sm">
      <div className="mb-2 font-medium text-gray-700">连线属性</div>
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">类型</label>
          <select
            className="w-full rounded border px-2 py-1"
            value={e?.type ?? 'default'}
            onChange={onEdgeTypeChange}
          >
            <option value="default">默认曲线</option>
            <option value="simpleArrowEdge">直线（Simple Arrow）</option>
            <option value="residualEdge">残差（Residual）</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">颜色</label>
          <input type="color" value={stroke} onChange={onEdgeColor} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={hasArrow} onChange={onEdgeArrow} /> 箭头
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isResidual} onChange={onEdgeResidual} /> 残差样式（虚线）
        </label>
        <div className="text-xs text-gray-500">ID：{e?.id}</div>
      </div>
    </aside>
  );
}
