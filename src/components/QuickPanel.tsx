import React, { useMemo, useCallback } from 'react';
import { useDiagramStore } from '@/diagram/DiagramState';
import { useTranslation } from 'react-i18next';

const HEIGHT_MIN = 48;
const HEIGHT_MAX = 240;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const QuickPanel = React.memo(function QuickPanel() {
  const { t } = useTranslation();
  const nodes = useDiagramStore((state) => state.nodes);
  const edges = useDiagramStore((state) => state.edges);
  const updateNodeData = useDiagramStore((state) => state.updateNodeData);
  const updateEdge = useDiagramStore((state) => state.updateEdge);

  const selectedNode = useMemo(() => nodes.find((node) => node.selected), [nodes]);
  const selectedEdge = useMemo(
    () => edges.find((edge: any) => edge.selected),
    [edges],
  ) as any;

  if (!selectedNode && !selectedEdge) return null;

  const nodeHeight = selectedNode
    ? clamp(Number((selectedNode.data as any)?.height ?? 64), HEIGHT_MIN, HEIGHT_MAX)
    : HEIGHT_MIN;

  const handleHeightChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!selectedNode) return;
      const value = clamp(Number(event.target.value) || HEIGHT_MIN, HEIGHT_MIN, HEIGHT_MAX);
      updateNodeData(selectedNode.id, { height: value });
    },
    [selectedNode, updateNodeData],
  );

  const handleLatexToggle = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!selectedNode) return;
      updateNodeData(selectedNode.id, { useLatex: event.target.checked });
    },
    [selectedNode, updateNodeData],
  );

  const handleEdgeStrokeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!selectedEdge) return;
      const strokeWidth = clamp(Number(event.target.value) || 1.5, 1, 8);
      updateEdge(selectedEdge.id, (edge: any) => ({
        ...edge,
        style: { ...(edge.style || {}), strokeWidth },
      }));
    },
    [selectedEdge, updateEdge],
  );

  const handleEdgeLabelChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!selectedEdge) return;
      const value = event.target.value;
      updateEdge(selectedEdge.id, (edge: any) => ({ ...edge, label: value }));
    },
    [selectedEdge, updateEdge],
  );

  return (
    <div className="absolute bottom-4 right-4 z-50 space-y-3 rounded border bg-white/95 p-3 text-xs shadow backdrop-blur">
      {selectedNode && (
        <div className="space-y-2">
          <div className="font-medium text-gray-700">
            {t('quick.nodeTitle', { defaultValue: 'Node Size & Math' })}
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-gray-500">
              {t('quick.height', { defaultValue: 'Height' })}: {nodeHeight}px
            </label>
            <input
              type="range"
              min={HEIGHT_MIN}
              max={HEIGHT_MAX}
              step={4}
              value={nodeHeight}
              onChange={handleHeightChange}
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean((selectedNode.data as any)?.useLatex)}
              onChange={handleLatexToggle}
            />
            <span>{t('quick.latex', { defaultValue: 'Render LaTeX formula' })}</span>
          </label>
        </div>
      )}

      {selectedEdge && (
        <div className="space-y-2">
          <div className="font-medium text-gray-700">
            {t('quick.edgeTitle', { defaultValue: 'Edge Style' })}
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-gray-500">
              {t('quick.strokeWidth', { defaultValue: 'Stroke width' })}
            </label>
            <input
              className="w-24 rounded border px-2 py-0.5"
              type="number"
              min={1}
              max={8}
              step={0.5}
              value={Number((selectedEdge.style || {}).strokeWidth ?? 1.5)}
              onChange={handleEdgeStrokeChange}
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] text-gray-500">{t('edge.label')}</label>
            <input
              className="w-40 rounded border px-2 py-0.5"
              value={String(selectedEdge.label ?? '')}
              onChange={handleEdgeLabelChange}
              placeholder={t('edge.labelPlaceholder', { defaultValue: 'e.g., logits' })}
            />
          </div>
        </div>
      )}
    </div>
  );
});

export default QuickPanel;
