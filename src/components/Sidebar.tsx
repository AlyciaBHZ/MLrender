import React from 'react';
import FCLayerIcon from '@/assets/icons/FCLayerIcon';
import DataBlockIcon from '@/assets/icons/DataBlockIcon';
import DataInIcon from '@/assets/icons/DataInIcon';
import {
  ConvIcon,
  PoolIcon,
  RNNIcon,
  LossIcon,
  OptimIcon,
  ConnectorArrowIcon,
  ResidualIcon,
  ActivationIcon,
  BatchNormIcon,
  DropoutIcon,
  FlattenIcon,
  EmbeddingIcon,
  AttentionIcon,
  SoftmaxIcon,
  TensorIcon,
} from '@/assets/icons/BasicIcons';
import TanhIcon from '@/assets/icons/TanhIcon';
import SigmoidIcon from '@/assets/icons/SigmoidIcon';
import MLPIcon from '@/assets/icons/MLPIcon';
import NeuronIcon from '@/assets/icons/NeuronIcon';
import { useDiagramStore } from '@/diagram/DiagramState';
import TemplatesData from '@/data/templates';

const TemplateIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M8 8h8M8 12h8M8 16h6" />
  </svg>
);

type Item = {
  type: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  data?: any;
  draggable?: boolean;
  hint?: string;
};

type Category = { id: string; title: string; items?: Item[]; children?: Category[] };

const CATEGORIES: Category[] = [
  {
    id: 'core',
    title: 'Core Layers',
    children: [
      {
        id: 'core-linear-act',
        title: 'Linear & Activation',
        items: [
          { type: 'fcNode', label: 'FC Layer', Icon: FCLayerIcon, data: { label: 'FC Layer', typeLabel: 'Dense / Linear', color: '#2563eb', width: 160, variant: 'fc' } },
          { type: 'activationNode', label: 'Activation', Icon: ActivationIcon, data: { label: 'Activation', typeLabel: 'ReLU / GELU', color: '#22c55e', width: 120, variant: 'activation', shape: 'circle' } },
          { type: 'boxNode', label: 'Softmax', Icon: SoftmaxIcon, data: { label: 'Softmax', typeLabel: 'Activation', color: '#fb923c', width: 140, variant: 'activation' } },
          { type: 'mlpNode', label: 'MLP Layers', Icon: MLPIcon, data: { label: 'MLP Layers', typeLabel: 'MLP (FC�N)', color: '#8b5cf6', neuronRows: 3, neuronCols: 5 } },
        ],
      },
      {
        id: 'core-basic-unit',
        title: 'Basic Units',
        items: [
          { type: 'neuronNode', label: 'Neuron', Icon: NeuronIcon, data: { label: 'Neuron', typeLabel: 'Neuron', color: '#16a34a', width: 80 } },
        ],
      },
      {
        id: 'core-conv-pool',
        title: 'Convolution & Pooling',
        items: [
          { type: 'convNode', label: 'Conv Layer', Icon: ConvIcon, data: { label: 'Conv Layer', typeLabel: 'Conv', color: '#f59e0b', width: 160 } },
          { type: 'boxNode', label: 'Pooling', Icon: PoolIcon, data: { label: 'Pooling', typeLabel: 'Pooling', color: '#10b981', width: 150, variant: 'pool' } },
          { type: 'boxNode', label: 'Flatten', Icon: FlattenIcon, data: { label: 'Flatten', typeLabel: 'Reshape', color: '#f43f5e', width: 140, variant: 'flatten' } },
        ],
      },
      {
        id: 'core-rnn-norm-reg',
        title: 'RNN • Normalization • Regularization',
        items: [
          { type: 'boxNode', label: 'RNN/LSTM', Icon: RNNIcon, data: { label: 'RNN Cell', typeLabel: 'RNN / LSTM', color: '#a855f7', width: 170, variant: 'rnn' } },
          { type: 'boxNode', label: 'BatchNorm', Icon: BatchNormIcon, data: { label: 'BatchNorm', typeLabel: 'Normalization', color: '#3b82f6', width: 150, variant: 'batchnorm' } },
          { type: 'dropoutNode', label: 'Dropout', Icon: DropoutIcon, data: { label: 'Dropout', typeLabel: 'Regularization', color: '#06b6d4', width: 140, variant: 'dropout' } },
        ],
      },
      {
        id: 'core-embed-attn',
        title: 'Embedding & Attention',
        items: [
          { type: 'boxNode', label: 'Embedding', Icon: EmbeddingIcon, data: { label: 'Embedding', typeLabel: 'Embedding', color: '#10b981', width: 160, variant: 'embedding' } },
          { type: 'boxNode', label: 'Attention', Icon: AttentionIcon, data: { label: 'Attention', typeLabel: 'Attention', color: '#a78bfa', width: 170, variant: 'attention' } },
        ],
      },
    ],
  },
  {
    id: 'data',
    title: 'Data & Flow',
    children: [
      {
        id: 'data-io',
        title: 'I/O',
        items: [
          { type: 'dataNode', label: 'Input Data', Icon: DataInIcon, data: { label: 'Input', typeLabel: 'Input', color: '#6b7280', width: 180, variant: 'input', direction: 'left' } },
          { type: 'dataNode', label: 'Output', Icon: DataBlockIcon, data: { label: 'Output', typeLabel: 'Output', color: '#6b7280', width: 180, variant: 'input', direction: 'right' } },
        ],
      },
      {
        id: 'data-tensor-meta',
        title: 'Tensor & Meta',
        items: [
          { type: 'dataNode', label: 'Data Block', Icon: DataBlockIcon, data: { label: 'Data Block', typeLabel: 'Data', color: '#6b7280', width: 180, variant: 'input', direction: 'right' } },
          { type: 'tensorNode', label: 'Tensor', Icon: TensorIcon, data: { label: 'Tensor', typeLabel: 'Tensor', color: '#3b82f6', width: 160 } },
        ],
      },
      {
        id: 'data-loss-opt',
        title: 'Loss & Optimizer',
        items: [
          { type: 'boxNode', label: 'Loss', Icon: LossIcon, data: { label: 'Loss', typeLabel: 'Loss', color: '#ef4444', width: 140, variant: 'loss' } },
          { type: 'circleNode', label: 'Optimizer', Icon: OptimIcon, data: { label: 'Optimizer', typeLabel: 'Optimizer', color: '#0ea5e9', width: 120 } },
        ],
      },
    ],
  },
  {
    id: 'connectors',
    title: 'Connectors',
    items: [
      { type: 'edge-arrow', label: 'Arrow Connector', Icon: ConnectorArrowIcon, draggable: false, hint: 'Use toolbar to draw and customize edges' },
      { type: 'edge-straight', label: 'Simple Arrow', Icon: ConnectorArrowIcon, draggable: false, hint: 'Switch edge type in the edge panel' },
      { type: 'edge-residual', label: 'Residual Connector', Icon: ResidualIcon, draggable: false, hint: 'Use Residual edge type for skip connections' },
    ],
  },
  {
    id: 'aux',
    title: '辅助功能层 (Auxiliary Layers)',
    children: [
      {
        id: 'aux-regularization',
        title: '正则化约束 (Regularization)',
        items: [
          { type: 'dropoutNode', label: 'Dropout', Icon: DropoutIcon, data: { label: 'Dropout', typeLabel: 'Regularization', color: '#06b6d4', width: 140, variant: 'dropout' } },
        ],
      },
    ],
  },
  {
    id: 'acts',
    title: '激活函数 (Activation Functions)',
    children: [
      {
        id: 'acts-common',
        title: '常见激活函数 (Common)',
        items: [
          { type: 'activationNode', label: 'Tanh', Icon: TanhIcon, data: { label: 'Tanh', typeLabel: 'Activation', color: '#14b8a6', width: 120, variant: 'activation', shape: 'circle' } },
          { type: 'activationNode', label: 'Sigmoid', Icon: SigmoidIcon, data: { label: 'Sigmoid', typeLabel: 'Activation', color: '#f59e0b', width: 120, variant: 'activation', shape: 'circle' } },
        ],
      },
    ],
  },
];

function Section({ cat, onDragStart, onItemClick }: { cat: Category; onDragStart: (e: React.DragEvent, type: string, data?: any) => void; onItemClick?: (item: Item) => void }) {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="ml-2">
      <button className="w-full flex items-center justify-between rounded px-2 py-1 hover:bg-gray-100 text-left" onClick={() => setOpen(!open)}>
        <span className="text-gray-800 font-medium">{cat.title}</span>
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor">
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
                title={draggable ? `Drag to canvas: ${label}` : hint || ''}
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
  const [query, setQuery] = React.useState('');

  const onDragStart = (event: React.DragEvent, nodeType: string, data?: any) => {
    if (nodeType === 'template' && data?.templateId) {
      event.dataTransfer.setData('application/x-mlcd-template', String(data.templateId));
      event.dataTransfer.effectAllowed = 'move';
      return;
    }
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/x-mlcd-data', JSON.stringify(data ?? {}));
    event.dataTransfer.effectAllowed = 'move';
  };

  const filterTree = (cats: Category[], q: string): Category[] => {
    const lower = q.toLowerCase();
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
    items: TemplatesData.map((t) => ({ type: 'template', label: t.name, Icon: TemplateIcon, draggable: true, hint: 'Click or drag to insert', data: { templateId: t.id } })),
  };

  const ALL_CATS = [...CATEGORIES, TEMPLATES_CAT];
  const cats = query ? filterTree(ALL_CATS, query) : ALL_CATS;

  return (
    <aside className="border-r bg-gray-50 p-3 text-sm">
      <div className="mb-2 font-medium text-gray-700">Components</div>
      <input
        className="mb-2 w-full rounded border px-2 py-1"
        placeholder="Search..."
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






