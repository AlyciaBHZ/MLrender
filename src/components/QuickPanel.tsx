import { useMemo } from 'react';
import { useDiagramStore } from '@/diagram/DiagramState';
import { useTranslation } from 'react-i18next';

export default function QuickPanel() {
  const { t } = useTranslation();
  const nodes = useDiagramStore((s) => s.nodes);
  const edges = useDiagramStore((s) => s.edges);
  const updateNodeData = useDiagramStore((s) => s.updateNodeData);
  const updateEdge = useDiagramStore((s) => s.updateEdge);

  const selectedNode = useMemo(() => nodes.find((n) => n.selected), [nodes]);
  const selectedEdge = useMemo(() => edges.find((e: any) => e.selected), [edges]) as any;

  if (!selectedNode && !selectedEdge) return null;

  return (
    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur rounded shadow border p-3 text-xs space-y-3 z-50">
      {selectedNode && (
        <div className="space-y-2">
          <div className="font-medium text-gray-700">{t('quick.nodeTitle', { defaultValue: 'Node Size & Math' })}</div>
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">{t('quick.height', { defaultValue: 'Height' })}: {(selectedNode.data as any)?.height ?? 64}px</label>
            <input
              type="range"
              min={48}
              max={240}
              step={4}
              value={Math.max(48, Math.min(240, (selectedNode.data as any)?.height ?? 64))}
              onChange={(e) => updateNodeData(selectedNode.id, { height: Number(e.target.value) })}
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={Boolean((selectedNode.data as any)?.useLatex)}
              onChange={(e) => updateNodeData(selectedNode.id, { useLatex: e.target.checked })}
            />
            <span>{t('quick.latex', { defaultValue: 'Render LaTeX formula' })}</span>
          </label>
        </div>
      )}

      {selectedEdge && (
        <div className="space-y-2">
          <div className="font-medium text-gray-700">{t('quick.edgeTitle', { defaultValue: 'Edge Style' })}</div>
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">{t('quick.strokeWidth', { defaultValue: 'Stroke width' })}</label>
            <input
              className="w-24 rounded border px-2 py-0.5"
              type="number"
              min={1}
              max={8}
              step={0.5}
              value={Number((selectedEdge.style || {}).strokeWidth ?? 1.5)}
              onChange={(e) => {
                const w = Number(e.target.value) || 1.5;
                updateEdge(selectedEdge.id, (edge) => ({ ...edge, style: { ...(edge.style || {}), strokeWidth: w } } as any));
              }}
            />
          </div>
          <div>
            <label className="block text-[11px] text-gray-500 mb-1">{t('edge.label')}</label>
            <input
              className="w-40 rounded border px-2 py-0.5"
              value={String(selectedEdge.label ?? '')}
              onChange={(e) => updateEdge(selectedEdge.id, (edge) => ({ ...edge, label: e.target.value } as any))}
              placeholder={t('edge.labelPlaceholder', { defaultValue: 'e.g., logits' })}
            />
          </div>
        </div>
      )}
    </div>
  );
}
