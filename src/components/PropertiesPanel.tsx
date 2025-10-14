import React, { useMemo } from 'react';
import { useDiagramStore } from '@/diagram/DiagramState';
import type { Edge } from 'reactflow';
import { MarkerType } from 'reactflow';
import { useTranslation } from 'react-i18next';

export default function PropertiesPanel() {
  const { t } = useTranslation();
  const nodes = useDiagramStore((s) => s.nodes);
  const updateNodeData = useDiagramStore((s) => s.updateNodeData);
  const edges = useDiagramStore((s) => s.edges);
  const updateEdge = useDiagramStore((s) => s.updateEdge);

  const selectedNodes = useMemo(() => nodes.filter((n) => n.selected), [nodes]);
  const selectedNode = selectedNodes[0];
  const isMulti = selectedNodes.length > 1;
  const selectedEdge = useMemo(() => edges.find((e) => (e as any).selected), [edges]);

  if (!selectedNode && !selectedEdge) {
    return <aside className="border-l bg-gray-50 p-3 text-sm text-gray-500">{t('panel.none')}</aside>;
  }

  if (isMulti) {
    const sample = selectedNodes[0];
    const data: any = sample.data ?? {};
    const color = data.color ?? '#2563eb';

    const onColorAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      selectedNodes.forEach((n) => updateNodeData(n.id, { color: v }));
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
        <div className="mb-2 font-medium text-gray-700">{t('panel.multi')} × {selectedNodes.length}</div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('panel.color')}</label>
            <input aria-label={t('panel.color')} type="color" value={color} onChange={onColorAll} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('panel.prefix')}</label>
            <div className="flex gap-2">
              <input className="flex-1 rounded border px-2 py-1" value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="Layer-" />
              <button className="text-xs px-2 py-1 rounded border hover:bg-gray-50" onClick={applyPrefix}>{t('panel.apply')}</button>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  if (selectedNode) {
    const data: any = selectedNode.data ?? {};
    const label = data.label ?? '';
    const formulaLabel = data.formulaLabel ?? '';
    const color = data.color ?? '#2563eb';

    const onLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => updateNodeData(selectedNode.id, { label: e.target.value });
    const onColorChange = (e: React.ChangeEvent<HTMLInputElement>) => updateNodeData(selectedNode.id, { color: e.target.value });

    return (
      <aside className="border-l bg-gray-50 p-3 text-sm">
        <div className="mb-2 font-medium text-gray-700">{t('panel.node')}</div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('panel.label')}</label>
            <input className="w-full rounded border px-2 py-1 text-gray-800" value={label} onChange={onLabelChange} placeholder="Node label" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('panel.formulaLabel')}</label>
            <input
              className="w-full rounded border px-2 py-1 text-gray-800"
              value={formulaLabel}
              onChange={(e) => updateNodeData(selectedNode.id, { formulaLabel: e.target.value })}
              placeholder={"e.g., y = W x + b or \\sum_i x_i"}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('panel.color')}</label>
            <input aria-label={t('panel.color')} type="color" value={color} onChange={onColorChange} />
          </div>
          <div className="text-xs text-gray-500">ID: {selectedNode.id}</div>
          <div className="text-xs text-gray-500">Type: {selectedNode.type}</div>
        </div>
      </aside>
    );
  }

  const e = selectedEdge as Edge | undefined;
  const stroke = (e?.style as any)?.stroke ?? '#111827';
  const edgeLabel = (e as any)?.label ?? '';
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
  const onEdgeLabel = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const v = ev.target.value;
    updateEdge!(e!.id, (edge) => ({ ...(edge as any), label: v } as any));
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
      <div className="mb-2 font-medium text-gray-700">{t('panel.edge')}</div>
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('panel.type')}</label>
          <select className="w-full rounded border px-2 py-1" value={e?.type ?? 'default'} onChange={onEdgeTypeChange}>
            <option value="default">default</option>
            <option value="simpleArrowEdge">Simple Arrow</option>
            <option value="residualEdge">Residual</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('edge.color')}</label>
          <input aria-label={t('edge.color')} type="color" value={stroke} onChange={onEdgeColor} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('edge.label')}</label>
          <input className="w-full rounded border px-2 py-1" value={edgeLabel} onChange={onEdgeLabel} placeholder="e.g., logits / residual" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={hasArrow} onChange={onEdgeArrow} /> Arrow
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isResidual} onChange={onEdgeResidual} /> Residual
        </label>
        <div className="text-xs text-gray-500">ID: {e?.id}</div>
      </div>
    </aside>
  );
}

