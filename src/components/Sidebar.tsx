import React from 'react';
import { useTranslation } from 'react-i18next';
import TemplatesData from '@/data/templates';
import type { CatalogCategory, CatalogItem } from '@/data/sidebarData';
import { SidebarCatalog } from '@/data/sidebarData';
import { getDefaultMLParams, NodeSizes } from '@/data';

const TemplateIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M8 8h8M8 12h8M8 16h6" />
  </svg>
);

type Category = CatalogCategory;
type Item = CatalogItem;

function Section({ cat, onDragStart, onItemClick }: { cat: Category; onDragStart: (e: React.DragEvent, type: string, data?: any) => void; onItemClick?: (item: Item) => void }) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(true);
  return (
    <div className="ml-2">
      <button
        className="w-full flex items-center justify-between rounded px-2 py-1 hover:bg-gray-100 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="text-gray-800 font-medium">{t(`sidebar.${cat.id}.title`, { defaultValue: cat.title })}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M6 6l6 4-6 4V6z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div className="mt-1 space-y-2">
          {(cat.items ?? []).map((item) => {
            const { type, label, Icon, data, draggable = true, hint } = item;
            const clickable = !draggable && !!onItemClick;
            return (
              <div
                key={`${cat.id}-${type}-${label}`}
                className={`flex items-center gap-2 rounded border bg-white px-2 py-1 ${draggable ? 'cursor-grab hover:bg-gray-50 active:cursor-grabbing' : 'hover:bg-gray-50 cursor-pointer'}`}
                draggable={!!draggable}
                onDragStart={(e) => draggable && onDragStart(e, type, data)}
                onClick={() => clickable && onItemClick!(item)}
                title={draggable ? t('sidebar.dragToCanvas', { label }) : hint || ''}
              >
                <Icon className="w-5 h-5" />
                <span className="text-gray-700">{label}</span>
              </div>
            );
          })}
          {(cat.children ?? []).map((child) => (
            <Section key={child.id} cat={child} onDragStart={onDragStart} onItemClick={onItemClick} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const { t } = useTranslation();
  const [query, setQuery] = React.useState('');

  const onDragStart = (event: React.DragEvent, nodeType: string, data?: any) => {
    if (nodeType === 'template' && data?.templateId) {
      event.dataTransfer.setData('application/x-mlcd-template', String(data.templateId));
      event.dataTransfer.effectAllowed = 'move';
      return;
    }

    // Try to find corresponding schema key from node type
    // Map node types to schema keys (e.g., 'fcNode' -> 'FC_LAYER')
    const schemaKeyMap: Record<string, string> = {
      'fcNode': 'FC_LAYER',
      'mlpNode': 'MLP_LAYERS',
      'convNode': 'CONV_LAYER',
      'poolingNode': 'POOLING',
      'flattenNode': 'FLATTEN',
      'activationNode': 'ACTIVATION',
      'dropoutNode': 'DROPOUT',
      'dataNode': 'DATA',
      'tensorNode': 'TENSOR',
      'neuronNode': 'NEURON',
      'normalizationNode': 'BATCH_NORM',
      'embeddingNode': 'EMBEDDING',
      'boxNode': 'DEFAULT',
      'circleNode': 'DEFAULT',
      'groupNode': 'GROUP',
    };

    const schemaKey = schemaKeyMap[nodeType];
    let enrichedData = data ?? {};

    // If we have a schema for this node type, merge in default ML params
    if (schemaKey && NodeSizes[schemaKey]) {
      const defaultMLParams = getDefaultMLParams(schemaKey);
      enrichedData = {
        ...enrichedData,
        ...defaultMLParams,
        componentType: schemaKey, // Store schema key for later lookup
      };
    }

    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/x-mlcd-data', JSON.stringify(enrichedData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const filterTree = (cats: Category[], q: string): Category[] => {
    const lower = q.trim().toLowerCase();
    if (!lower) return cats;
    const visit = (cat: Category): Category | null => {
      const items = (cat.items ?? []).filter((it) => it.label.toLowerCase().includes(lower));
      const children = (cat.children ?? []).map(visit).filter(Boolean) as Category[];
      if (items.length === 0 && children.length === 0) return null;
      return { ...cat, items, children };
    };
    return cats.map(visit).filter(Boolean) as Category[];
  };

  const insertTemplateById = (templateId: string) => {
    const detail = { templateId, at: 'center' } as any;
    window.dispatchEvent(new CustomEvent('mlcd-insert-template', { detail }));
  };

  const TEMPLATES_CAT: Category = {
    id: 'templates',
    title: 'Templates',
    items: TemplatesData.map((tmpl) => ({ type: 'template', label: tmpl.name, Icon: TemplateIcon, draggable: true, hint: t('sidebar.template.hint'), data: { templateId: tmpl.id } })),
  };

  const ALL_CATS = [...SidebarCatalog, TEMPLATES_CAT];
  const cats = filterTree(ALL_CATS, query);

  return (
    <aside className="border-r bg-gray-50 p-3 text-sm h-full min-h-0 overflow-y-auto overscroll-contain">
      <div className="mb-2 font-medium text-gray-700">{t('sidebar.title', { defaultValue: 'Components' })}</div>
      <input
        className="mb-2 w-full rounded border px-2 py-1"
        placeholder={t('sidebar.search', { defaultValue: 'Search...' })}
        aria-label={t('sidebar.search', { defaultValue: 'Search...' })}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="space-y-3">
        {cats.map((cat) => (
          <Section
            key={cat.id}
            cat={cat}
            onDragStart={onDragStart}
            onItemClick={(item) => {
              const tid = item.data?.templateId as string | undefined;
              if (tid) insertTemplateById(tid);
            }}
          />
        ))}
      </div>
    </aside>
  );
}
