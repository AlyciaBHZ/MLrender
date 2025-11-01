import React, { useMemo } from 'react';
import { useDiagramStore } from '@/diagram/DiagramState';
import type { Edge } from 'reactflow';
import { MarkerType } from 'reactflow';
import { useTranslation } from 'react-i18next';
import { getNodeSchema, validateField, type FieldSpec } from '@/ui/nodeSchemas';

export default function PropertiesPanel() {
  const { t } = useTranslation();
  const nodes = useDiagramStore((s) => s.nodes);
  const updateNodeData = useDiagramStore((s) => s.updateNodeData);
  const edges = useDiagramStore((s) => s.edges);
  const updateEdge = useDiagramStore((s) => s.updateEdge);

  // IMPORTANT: All hooks must be called unconditionally at the top level
  const [prefix, setPrefix] = React.useState('');

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
    const applyPrefix = () => {
      selectedNodes.forEach((n, idx) => {
        const base = (n.data as any)?.label ?? '';
        updateNodeData(n.id, { label: `${prefix}${base || idx + 1}` });
      });
    };

    return (
      <aside className="border-l bg-gray-50 p-3 text-sm">
        <div className="mb-2 font-medium text-gray-700">{t('panel.multi')} · {selectedNodes.length}</div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('panel.color')}</label>
            <input aria-label={t('panel.color')} type="color" value={color} onChange={onColorAll} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('panel.prefix')}</label>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded border px-2 py-1"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value)}
                placeholder={t('panel.prefixPlaceholder', { defaultValue: 'Layer-' })}
              />
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
    const colorMode: 'semantic' | 'custom' = (data.colorMode as any) === 'custom' ? 'custom' : 'semantic';
    const showTypeRibbon: boolean = data.showTypeRibbon !== false;
    const lodOverride: 'auto' | 'simple' | 'detailed' = (data.lodOverride as any) || 'auto';
    const visualDensity: number = Number(data.visualDensity ?? 2);
    const semanticColorsLocked = useDiagramStore((s) => s.semanticColorsLocked);
    const schema = getNodeSchema(selectedNode.type);

    const onLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => updateNodeData(selectedNode.id, { label: e.target.value });
    const onColorChange = (e: React.ChangeEvent<HTMLInputElement>) => updateNodeData(selectedNode.id, { color: e.target.value });
    const onFieldChange = (field: FieldSpec, value: any) => {
      // Validate parameter value before updating
      const validatedValue = validateField(selectedNode.type || 'boxNode', field.key, value);
      updateNodeData(selectedNode.id, { [field.key]: validatedValue });
    };

    return (
      <aside className="border-l bg-gray-50 p-3 text-sm">
        <div className="mb-2 font-medium text-gray-700">{t('panel.node')}</div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('panel.label')}</label>
            <input
              className="w-full rounded border px-2 py-1 text-gray-800"
              value={label}
              onChange={onLabelChange}
              placeholder={t('panel.labelPlaceholder', { defaultValue: 'Node label' })}
            />
          </div>
          {/* Visual controls */}
          <div className="mt-2 space-y-2">
            <div className="text-xs font-medium text-gray-700">{t('panel.visual', { defaultValue: 'Visual' })}</div>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={showTypeRibbon} onChange={(e) => updateNodeData(selectedNode.id, { showTypeRibbon: e.target.checked })} />
              <span>{t('panel.typeRibbon', { defaultValue: 'Type ribbon' })}</span>
            </label>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-xs text-gray-500">{t('panel.lod', { defaultValue: 'LOD' })}</span>
              <select className="rounded border px-2 py-1" value={lodOverride}
                onChange={(e) => updateNodeData(selectedNode.id, { lodOverride: e.target.value })}>
                <option value="auto">{t('panel.lod.auto', { defaultValue: 'Auto' })}</option>
                <option value="simple">{t('panel.lod.simple', { defaultValue: 'Simple' })}</option>
                <option value="detailed">{t('panel.lod.detailed', { defaultValue: 'Detailed' })}</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-xs text-gray-500">{t('panel.density', { defaultValue: 'Visual density' })}</span>
              <select className="rounded border px-2 py-1" value={visualDensity}
                onChange={(e) => updateNodeData(selectedNode.id, { visualDensity: Number(e.target.value) || 2 })}>
                <option value={1}>Low</option>
                <option value={2}>Normal</option>
                <option value={3}>High</option>
              </select>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-xs text-gray-500">{t('panel.colorMode', { defaultValue: 'Color mode' })}</span>
              <select className="rounded border px-2 py-1" value={colorMode}
                disabled={semanticColorsLocked}
                onChange={(e) => updateNodeData(selectedNode.id, { colorMode: e.target.value })}>
                <option value="semantic">{t('panel.colorMode.semantic', { defaultValue: 'Semantic' })}</option>
                <option value="custom">{t('panel.colorMode.custom', { defaultValue: 'Custom' })}</option>
              </select>
              {semanticColorsLocked && (
                <span className="text-[11px] text-gray-400">{t('panel.colorMode.locked', { defaultValue: 'Locked globally' })}</span>
              )}
            </div>
          </div>
          {schema && (
            <div className="space-y-2">
              {(schema.fields || []).map((f) => (
                <div key={f.key}>
                  <label className="block text-xs text-gray-500 mb-1">{f.label}</label>
                  {f.type === 'select' && (
                    <select
                      className="w-full rounded border px-2 py-1"
                      value={data[f.key] ?? ''}
                      onChange={(e) => onFieldChange(f, e.target.value)}
                    >
                      <option value="" disabled>{t('panel.select', { defaultValue: 'Select...' })}</option>
                      {(f.options || []).map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  )}
                  {f.type === 'number' && (
                    <input
                      className="w-full rounded border px-2 py-1"
                      type="number"
                      min={f.min}
                      max={f.max}
                      step={f.step}
                      value={Number(data[f.key] ?? (f.min ?? 0))}
                      onChange={(e) => onFieldChange(f, Number(e.target.value))}
                    />
                  )}
                  {f.type === 'string' && (
                    <input
                      className="w-full rounded border px-2 py-1"
                      value={String(data[f.key] ?? '')}
                      onChange={(e) => onFieldChange(f, e.target.value)}
                    />
                  )}
                  {f.type === 'boolean' && (
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={Boolean(data[f.key])}
                        onChange={(e) => onFieldChange(f, e.target.checked)}
                      />
                      <span>{f.label}</span>
                    </label>
                  )}
                  {f.type === 'range' && (
                    <div className="space-y-1">
                      <input
                        className="w-full"
                        type="range"
                        min={f.min}
                        max={f.max}
                        step={f.step || 0.01}
                        value={Number(data[f.key] ?? (f.min ?? 0))}
                        onChange={(e) => onFieldChange(f, Number(e.target.value))}
                      />
                      <div className="text-xs text-gray-500 text-right">
                        {Number(data[f.key] ?? (f.min ?? 0)).toFixed(2)}
                      </div>
                    </div>
                  )}
                  {f.hint && (
                    <div className="text-xs text-gray-500 mt-0.5">{f.hint}</div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('panel.formulaLabel')}</label>
            <input
              className="w-full rounded border px-2 py-1 text-gray-800"
              value={formulaLabel}
              onChange={(e) => updateNodeData(selectedNode.id, { formulaLabel: e.target.value })}
              placeholder={t('panel.formulaPlaceholder', { defaultValue: 'e.g., y = W x + b or \\rac{1}{N}\\sum_i x_i' })}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">{t('panel.color')}</label>
            <input aria-label={t('panel.color')} type="color" value={color} onChange={onColorChange} disabled={semanticColorsLocked || colorMode !== 'custom'} />
          </div>
          <div className="text-xs text-gray-500">{t('panel.id', { defaultValue: 'ID' })}: {selectedNode.id}</div>
          <div className="text-xs text-gray-500">{t('panel.type')}: {selectedNode.type}</div>
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
            <option value="default">{t('edge.type.default', { defaultValue: 'Default' })}</option>
            <option value="simpleArrowEdge">{t('edge.type.simpleArrow', { defaultValue: 'Simple Arrow' })}</option>
            <option value="residualEdge">{t('edge.type.residual', { defaultValue: 'Residual' })}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('edge.color')}</label>
          <input aria-label={t('edge.color')} type="color" value={stroke} onChange={onEdgeColor} />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">{t('edge.label')}</label>
          <input
            className="w-full rounded border px-2 py-1"
            value={edgeLabel}
            onChange={onEdgeLabel}
            placeholder={t('edge.labelPlaceholder', { defaultValue: 'e.g., logits / residual' })}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={hasArrow} onChange={onEdgeArrow} /> {t('edge.arrow', { defaultValue: 'Arrow' })}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isResidual} onChange={onEdgeResidual} /> {t('edge.residual', { defaultValue: 'Residual' })}
        </label>
        <div className="text-xs text-gray-500">{t('panel.id', { defaultValue: 'ID' })}: {e?.id}</div>
      </div>
    </aside>
  );
}
