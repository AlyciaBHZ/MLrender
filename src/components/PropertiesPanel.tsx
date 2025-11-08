import React, { useMemo, useCallback } from 'react';
import { useDiagramStore } from '@/diagram/DiagramState';
import type { Edge, Node } from 'reactflow';
import { MarkerType } from 'reactflow';
import { useTranslation } from 'react-i18next';
import { getNodeSchema, validateField, type FieldSpec } from '@/ui/nodeSchemas';

type Translate = ReturnType<typeof useTranslation>['t'];
type NodeDataUpdater = (id: string, data: Record<string, any>) => void;
type EdgeUpdater = (id: string, updater: (edge: Edge) => Edge) => void;

const panelClass = 'border-l bg-gray-50 p-3 text-sm';

function PanelShell({ children }: { children: React.ReactNode }) {
  return <aside className={panelClass}>{children}</aside>;
}

function EmptySelectionPanel({ t }: { t: Translate }) {
  return (
    <PanelShell>
      <div className="text-gray-500">{t('panel.none')}</div>
    </PanelShell>
  );
}

type MultiSelectionPanelProps = {
  nodes: Node[];
  prefix: string;
  setPrefix: React.Dispatch<React.SetStateAction<string>>;
  updateNodeData: NodeDataUpdater;
  t: Translate;
};

function MultiSelectionPanel({ nodes, prefix, setPrefix, updateNodeData, t }: MultiSelectionPanelProps) {
  const sampleColor = ((nodes[0]?.data as any)?.color as string) ?? '#2563eb';

  const handleColorChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const color = event.target.value;
      nodes.forEach((node) => updateNodeData(node.id, { color }));
    },
    [nodes, updateNodeData],
  );

  const handlePrefixApply = useCallback(() => {
    nodes.forEach((node, index) => {
      const base = (node.data as any)?.label ?? '';
      const fallback = base || String(index + 1);
      updateNodeData(node.id, { label: `${prefix}${fallback}` });
    });
  }, [nodes, prefix, updateNodeData]);

  return (
    <PanelShell>
      <div className="mb-2 font-medium text-gray-700">
        {t('panel.multiCount', { count: nodes.length, defaultValue: 'Nodes selected: {{count}}' })}
      </div>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-gray-500">{t('panel.color')}</label>
          <input
            aria-label={t('panel.color')}
            type="color"
            value={sampleColor}
            onChange={handleColorChange}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">{t('panel.prefix')}</label>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded border px-2 py-1"
              value={prefix}
              onChange={(event) => setPrefix(event.target.value)}
              placeholder={t('panel.prefixPlaceholder', { defaultValue: 'Layer-' })}
            />
            <button
              type="button"
              className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
              onClick={handlePrefixApply}
            >
              {t('panel.apply')}
            </button>
          </div>
        </div>
      </div>
    </PanelShell>
  );
}

type SchemaFieldsProps = {
  fields: FieldSpec[];
  data: Record<string, any>;
  onFieldChange: (field: FieldSpec, value: any) => void;
  t: Translate;
};

function SchemaFields({ fields, data, onFieldChange, t }: SchemaFieldsProps) {
  if (!fields.length) return null;

  return (
    <div className="space-y-2">
      {fields.map((field) => {
        const value = data[field.key];
        return (
          <div key={field.key}>
            {field.type !== 'boolean' && (
              <label className="mb-1 block text-xs text-gray-500">{field.label}</label>
            )}
            {field.type === 'select' && (
              <select
                className="w-full rounded border px-2 py-1"
                value={value ?? ''}
                onChange={(event) => onFieldChange(field, event.target.value)}
              >
                <option value="" disabled>
                  {t('panel.select', { defaultValue: 'Select...' })}
                </option>
                {(field.options || []).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            {field.type === 'number' && (
              <input
                className="w-full rounded border px-2 py-1"
                type="number"
                min={field.min}
                max={field.max}
                step={field.step}
                value={Number(value ?? field.min ?? 0)}
                onChange={(event) => onFieldChange(field, Number(event.target.value))}
              />
            )}
            {field.type === 'string' && (
              <input
                className="w-full rounded border px-2 py-1"
                value={value ?? ''}
                onChange={(event) => onFieldChange(field, event.target.value)}
              />
            )}
            {field.type === 'boolean' && (
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(value)}
                  onChange={(event) => onFieldChange(field, event.target.checked)}
                />
                <span>{field.label}</span>
              </label>
            )}
            {field.type === 'range' && (
              <div className="space-y-1">
                <input
                  className="w-full"
                  type="range"
                  min={field.min}
                  max={field.max}
                  step={field.step || 0.01}
                  value={Number(value ?? field.min ?? 0)}
                  onChange={(event) => onFieldChange(field, Number(event.target.value))}
                />
                <div className="text-right text-xs text-gray-500">
                  {Number(value ?? field.min ?? 0).toFixed(2)}
                </div>
              </div>
            )}
            {field.hint && <div className="mt-0.5 text-xs text-gray-500">{field.hint}</div>}
          </div>
        );
      })}
    </div>
  );
}

type NodePropertiesPanelProps = {
  node: Node;
  updateNodeData: NodeDataUpdater;
  semanticColorsLocked: boolean;
  t: Translate;
};

function NodePropertiesPanel({ node, updateNodeData, semanticColorsLocked, t }: NodePropertiesPanelProps) {
  const data = (node.data as Record<string, any>) ?? {};
  const label = data.label ?? '';
  const formulaLabel = data.formulaLabel ?? '';
  const color = data.color ?? '#2563eb';
  const colorMode: 'semantic' | 'custom' = data.colorMode === 'custom' ? 'custom' : 'semantic';
  const showTypeRibbon = data.showTypeRibbon !== false;
  const lodOverride: 'auto' | 'simple' | 'detailed' = data.lodOverride ?? 'auto';
  const visualDensity = Number(data.visualDensity ?? 2);
  const schema = getNodeSchema(node.type);
  const schemaFields = schema?.fields ?? [];

  const densityOptions = [
    { value: 1, label: t('panel.density.low', { defaultValue: 'Low' }) },
    { value: 2, label: t('panel.density.normal', { defaultValue: 'Normal' }) },
    { value: 3, label: t('panel.density.high', { defaultValue: 'High' }) },
  ];

  const updateNode = useCallback(
    (changes: Record<string, any>) => {
      updateNodeData(node.id, changes);
    },
    [node.id, updateNodeData],
  );

  const handleFieldChange = useCallback(
    (field: FieldSpec, value: any) => {
      const validatedValue = validateField(node.type || 'boxNode', field.key, value);
      updateNodeData(node.id, { [field.key]: validatedValue });
    },
    [node.id, node.type, updateNodeData],
  );

  return (
    <PanelShell>
      <div className="mb-2 font-medium text-gray-700">{t('panel.node')}</div>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-gray-500">{t('panel.label')}</label>
          <input
            className="w-full rounded border px-2 py-1 text-gray-800"
            value={label}
            onChange={(event) => updateNode({ label: event.target.value })}
            placeholder={t('panel.labelPlaceholder', { defaultValue: 'Node label' })}
          />
        </div>
        <div className="space-y-2 pt-2">
          <div className="text-xs font-medium text-gray-700">
            {t('panel.visual', { defaultValue: 'Visual' })}
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showTypeRibbon}
              onChange={(event) => updateNode({ showTypeRibbon: event.target.checked })}
            />
            <span>{t('panel.typeRibbon', { defaultValue: 'Type ribbon' })}</span>
          </label>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-xs text-gray-500">{t('panel.lod', { defaultValue: 'LOD' })}</span>
            <select
              className="rounded border px-2 py-1"
              value={lodOverride}
              onChange={(event) => updateNode({ lodOverride: event.target.value })}
            >
              <option value="auto">{t('panel.lod.auto', { defaultValue: 'Auto' })}</option>
              <option value="simple">{t('panel.lod.simple', { defaultValue: 'Simple' })}</option>
              <option value="detailed">{t('panel.lod.detailed', { defaultValue: 'Detailed' })}</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-xs text-gray-500">
              {t('panel.density', { defaultValue: 'Visual density' })}
            </span>
            <select
              className="rounded border px-2 py-1"
              value={visualDensity}
              onChange={(event) => updateNode({ visualDensity: Number(event.target.value) || 2 })}
            >
              {densityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-xs text-gray-500">
              {t('panel.colorMode', { defaultValue: 'Color mode' })}
            </span>
            <select
              className="rounded border px-2 py-1"
              value={colorMode}
              disabled={semanticColorsLocked}
              onChange={(event) => updateNode({ colorMode: event.target.value })}
            >
              <option value="semantic">
                {t('panel.colorMode.semantic', { defaultValue: 'Semantic' })}
              </option>
              <option value="custom">
                {t('panel.colorMode.custom', { defaultValue: 'Custom' })}
              </option>
            </select>
            {semanticColorsLocked && (
              <span className="text-[11px] text-gray-400">
                {t('panel.colorMode.locked', { defaultValue: 'Locked globally' })}
              </span>
            )}
          </div>
        </div>
        <SchemaFields fields={schemaFields} data={data} onFieldChange={handleFieldChange} t={t} />
        <div>
          <label className="mb-1 block text-xs text-gray-500">{t('panel.formulaLabel')}</label>
          <input
            className="w-full rounded border px-2 py-1 text-gray-800"
            value={formulaLabel}
            onChange={(event) => updateNode({ formulaLabel: event.target.value })}
            placeholder={t('panel.formulaPlaceholder', {
              defaultValue: 'e.g., y = W x + b or \\frac{1}{N}\\sum_i x_i',
            })}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">{t('panel.color')}</label>
          <input
            aria-label={t('panel.color')}
            type="color"
            value={color}
            onChange={(event) => updateNode({ color: event.target.value })}
            disabled={semanticColorsLocked || colorMode !== 'custom'}
          />
        </div>
        <div className="text-xs text-gray-500">
          {t('panel.id', { defaultValue: 'ID' })}: {node.id}
        </div>
        <div className="text-xs text-gray-500">
          {t('panel.type', { defaultValue: 'Type' })}: {node.type}
        </div>
      </div>
    </PanelShell>
  );
}

type EdgePropertiesPanelProps = {
  edge: Edge;
  updateEdge?: EdgeUpdater;
  t: Translate;
};

function EdgePropertiesPanel({ edge, updateEdge, t }: EdgePropertiesPanelProps) {
  const stroke = ((edge.style as any)?.stroke as string) ?? '#111827';
  const edgeLabel = (edge as any)?.label ?? '';
  const hasArrow = Boolean(edge.markerEnd);
  const isResidual = edge.type === 'residualEdge' || Boolean((edge.data as any)?.residual);

  const applyEdgeUpdate = useCallback(
    (updater: (edge: Edge) => Edge) => {
      if (!updateEdge) return;
      updateEdge(edge.id, updater);
    },
    [edge.id, updateEdge],
  );

  const handleColorChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const color = event.target.value;
      applyEdgeUpdate((current) => {
        const showArrow = Boolean(current.markerEnd);
        return {
          ...current,
          style: { ...(current.style || {}), stroke: color },
          markerEnd: showArrow ? { type: MarkerType.ArrowClosed, color } : undefined,
        };
      });
    },
    [applyEdgeUpdate],
  );

  const handleArrowToggle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      applyEdgeUpdate((current) => ({
        ...current,
        markerEnd: checked
          ? { type: MarkerType.ArrowClosed, color: (current.style as any)?.stroke || '#111827' }
          : undefined,
      }));
    },
    [applyEdgeUpdate],
  );

  const handleResidualToggle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      applyEdgeUpdate((current) => ({
        ...current,
        type: checked ? 'residualEdge' : undefined,
        data: { ...(current.data || {}), residual: checked },
        style: { ...(current.style || {}), strokeDasharray: checked ? '6 4' : undefined },
      }));
    },
    [applyEdgeUpdate],
  );

  const handleLabelChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      applyEdgeUpdate((current) => ({ ...(current as any), label: value } as Edge));
    },
    [applyEdgeUpdate],
  );

  const handleTypeChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value as 'default' | 'simpleArrowEdge' | 'residualEdge';
      applyEdgeUpdate((current) => {
        const next: Edge = { ...current } as Edge;
        if (value === 'default') {
          delete (next as any).type;
          next.style = { ...(next.style || {}) };
          if ((next.style as any).strokeDasharray) delete (next.style as any).strokeDasharray;
        } else if (value === 'simpleArrowEdge') {
          (next as any).type = 'simpleArrowEdge';
          next.style = { ...(next.style || {}) };
          if ((next.style as any).strokeDasharray) delete (next.style as any).strokeDasharray;
        } else if (value === 'residualEdge') {
          (next as any).type = 'residualEdge';
          next.style = { ...(next.style || {}), strokeDasharray: '6 4' };
          next.data = { ...(next.data || {}), residual: true };
        }
        return next;
      });
    },
    [applyEdgeUpdate],
  );

  return (
    <PanelShell>
      <div className="mb-2 font-medium text-gray-700">{t('panel.edge')}</div>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-gray-500">{t('panel.type')}</label>
          <select
            className="w-full rounded border px-2 py-1"
            value={edge.type ?? 'default'}
            onChange={handleTypeChange}
          >
            <option value="default">
              {t('edge.type.default', { defaultValue: 'Default' })}
            </option>
            <option value="simpleArrowEdge">
              {t('edge.type.simpleArrow', { defaultValue: 'Simple Arrow' })}
            </option>
            <option value="residualEdge">
              {t('edge.type.residual', { defaultValue: 'Residual' })}
            </option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">{t('edge.color')}</label>
          <input
            aria-label={t('edge.color')}
            type="color"
            value={stroke}
            onChange={handleColorChange}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-500">{t('edge.label')}</label>
          <input
            className="w-full rounded border px-2 py-1"
            value={edgeLabel}
            onChange={handleLabelChange}
            placeholder={t('edge.labelPlaceholder', { defaultValue: 'e.g., logits / residual' })}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={hasArrow} onChange={handleArrowToggle} />
          <span>{t('edge.arrow', { defaultValue: 'Arrow' })}</span>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isResidual} onChange={handleResidualToggle} />
          <span>{t('edge.residual', { defaultValue: 'Residual' })}</span>
        </label>
        <div className="text-xs text-gray-500">
          {t('panel.id', { defaultValue: 'ID' })}: {edge.id}
        </div>
      </div>
    </PanelShell>
  );
}

export default function PropertiesPanel() {
  const { t } = useTranslation();
  const nodes = useDiagramStore((state) => state.nodes);
  const edges = useDiagramStore((state) => state.edges);
  const updateNodeData = useDiagramStore((state) => state.updateNodeData);
  const updateEdge = useDiagramStore((state) => state.updateEdge);
  const semanticColorsLocked = useDiagramStore((state) => state.semanticColorsLocked);

  const [prefix, setPrefix] = React.useState('');

  const selectedNodes = useMemo(() => nodes.filter((node) => node.selected), [nodes]);
  const selectedEdge = useMemo(
    () => edges.find((edge: any) => edge.selected) as Edge | undefined,
    [edges],
  );
  const isMulti = selectedNodes.length > 1;
  const focusedNode = !isMulti ? selectedNodes[0] : undefined;

  React.useEffect(() => {
    if (!isMulti && prefix) {
      setPrefix('');
    }
  }, [isMulti, prefix]);

  if (!focusedNode && !selectedEdge && !isMulti) {
    return <EmptySelectionPanel t={t} />;
  }

  if (isMulti) {
    return (
      <MultiSelectionPanel
        nodes={selectedNodes}
        prefix={prefix}
        setPrefix={setPrefix}
        updateNodeData={updateNodeData}
        t={t}
      />
    );
  }

  if (focusedNode) {
    return (
      <NodePropertiesPanel
        node={focusedNode}
        updateNodeData={updateNodeData}
        semanticColorsLocked={semanticColorsLocked}
        t={t}
      />
    );
  }

  if (selectedEdge) {
    return <EdgePropertiesPanel edge={selectedEdge} updateEdge={updateEdge} t={t} />;
  }

  return <EmptySelectionPanel t={t} />;
}
