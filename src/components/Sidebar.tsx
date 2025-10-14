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

type Item = {
  type: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  data?: any;
  draggable?: boolean;
  hint?: string;
};

type Category = { id: string; title: string; items: Item[] };

const CATEGORIES: Category[] = [
  {
    id: 'core',
    title: '核心网络层 (Core Layers)',
    items: [
      { type: 'fcNode', label: 'FC Layer', Icon: FCLayerIcon, data: { label: 'FC Layer', typeLabel: 'Dense / Linear', color: '#2563eb', width: 160, variant: 'fc' } },
      { type: 'convNode', label: 'Conv Layer', Icon: ConvIcon, data: { label: 'Conv Layer', typeLabel: 'Conv', color: '#f59e0b', width: 160 } },
      { type: 'boxNode', label: 'Pooling', Icon: PoolIcon, data: { label: 'Pooling', typeLabel: 'Pooling', color: '#10b981', width: 150, variant: 'pool' } },
      { type: 'boxNode', label: 'RNN/LSTM', Icon: RNNIcon, data: { label: 'RNN Cell', typeLabel: 'RNN / LSTM', color: '#a855f7', width: 170, variant: 'rnn' } },
      { type: 'activationNode', label: 'Activation', Icon: ActivationIcon, data: { label: 'Activation', typeLabel: 'ReLU / GELU', color: '#22c55e', width: 120, variant: 'activation', shape: 'circle' } },
      { type: 'boxNode', label: 'BatchNorm', Icon: BatchNormIcon, data: { label: 'BatchNorm', typeLabel: 'Normalization', color: '#3b82f6', width: 150, variant: 'batchnorm' } },
      { type: 'boxNode', label: 'Dropout', Icon: DropoutIcon, data: { label: 'Dropout', typeLabel: 'Regularization', color: '#06b6d4', width: 140, variant: 'dropout' } },
      { type: 'boxNode', label: 'Flatten', Icon: FlattenIcon, data: { label: 'Flatten', typeLabel: 'Reshape', color: '#f43f5e', width: 140, variant: 'flatten' } },
      { type: 'boxNode', label: 'Embedding', Icon: EmbeddingIcon, data: { label: 'Embedding', typeLabel: 'Embedding', color: '#10b981', width: 160, variant: 'embedding' } },
      { type: 'boxNode', label: 'Attention', Icon: AttentionIcon, data: { label: 'Attention', typeLabel: 'Attention', color: '#a78bfa', width: 170, variant: 'attention' } },
      { type: 'boxNode', label: 'Softmax', Icon: SoftmaxIcon, data: { label: 'Softmax', typeLabel: 'Activation', color: '#fb923c', width: 140, variant: 'activation' } },
    ],
  },
  {
    id: 'data',
    title: '数据与流程 (Data & Flow)',
    items: [
      { type: 'dataNode', label: 'Data Block', Icon: DataBlockIcon, data: { label: 'Data Block', typeLabel: 'Data', color: '#6b7280', width: 180, variant: 'input', direction: 'right' } },
      { type: 'dataNode', label: 'Input Data', Icon: DataInIcon, data: { label: 'Input', typeLabel: 'Input', color: '#6b7280', width: 180, variant: 'input', direction: 'left' } },
      { type: 'dataNode', label: 'Output', Icon: DataBlockIcon, data: { label: 'Output', typeLabel: 'Output', color: '#6b7280', width: 180, variant: 'input', direction: 'right' } },
      { type: 'tensorNode', label: 'Tensor', Icon: TensorIcon, data: { label: 'Tensor', typeLabel: 'Tensor', color: '#3b82f6', width: 160 } },
      { type: 'boxNode', label: 'Loss', Icon: LossIcon, data: { label: 'Loss', typeLabel: 'Loss', color: '#ef4444', width: 140, variant: 'loss' } },
      { type: 'circleNode', label: 'Optimizer', Icon: OptimIcon, data: { label: 'Optimizer', typeLabel: 'Optimizer', color: '#0ea5e9', width: 120 } },
      { type: 'boxNode', label: 'Embedding', Icon: EmbeddingIcon, data: { label: 'Embedding', typeLabel: 'Embedding', color: '#10b981', width: 160 } },
    ],
  },
  {
    id: 'connectors',
    title: '连接与箭头 (Connectors)',
    items: [
      { type: 'edge-arrow', label: 'Arrow Connector', Icon: ConnectorArrowIcon, draggable: false, hint: '从节点锚点拖拽创建带箭头连线' },
      { type: 'edge-straight', label: 'Simple Arrow', Icon: ConnectorArrowIcon, draggable: false, hint: '选中连线后在右侧选择类型：直线（Simple Arrow）' },
      { type: 'edge-residual', label: 'Residual Connector', Icon: ResidualIcon, draggable: false, hint: '创建后在右侧属性中切换“残差样式”' },
    ],
  },
];

function CategorySection({ cat, isOpen, toggle, onDragStart }: {
  cat: Category;
  isOpen: boolean;
  toggle: () => void;
  onDragStart: (e: React.DragEvent, type: string, data?: any) => void;
}) {
  return (
    <div>
      <button
        className="w-full flex items-center justify-between rounded px-2 py-1 hover:bg-gray-100 text-left"
        onClick={toggle}
      >
        <span className="text-gray-800 font-medium">{cat.title}</span>
        <span className="flex items-center gap-2 text-gray-500 text-xs">
          <span>{cat.items.length}</span>
          <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 6l6 4-6 4V6z" clipRule="evenodd" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div className="mt-1 space-y-2">
          {cat.items.map(({ type, label, Icon, data, draggable = true, hint }) => (
            <div
              key={`${cat.id}-${type}-${label}`}
              className={`flex items-center gap-2 rounded border bg-white px-2 py-1 ${draggable ? 'cursor-grab hover:bg-gray-50 active:cursor-grabbing' : 'opacity-70 cursor-not-allowed'}`}
              draggable={!!draggable}
              onDragStart={(e) => draggable && onDragStart(e, type, data)}
              title={draggable ? `拖拽到画布：${label}` : hint || ''}
            >
              <Icon className="w-5 h-5" />
              <span className="text-gray-700">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const [query, setQuery] = React.useState('');
  const [open, setOpen] = React.useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem('mlcd-sidebar-open');
      return raw ? JSON.parse(raw) : { core: true, data: true, connectors: true };
    } catch {
      return { core: true, data: true, connectors: true };
    }
  });

  const persistOpen = (next: Record<string, boolean>) => {
    setOpen(next);
    try { localStorage.setItem('mlcd-sidebar-open', JSON.stringify(next)); } catch {}
  };

  const onDragStart = (event: React.DragEvent, nodeType: string, data?: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('application/x-mlcd-data', JSON.stringify(data ?? {}));
    event.dataTransfer.effectAllowed = 'move';
  };

  const filtered: Category[] = CATEGORIES
    .map((cat) => ({
      ...cat,
      items: cat.items.filter((it) => it.label.toLowerCase().includes(query.toLowerCase())),
    }))
    .filter((cat) => cat.items.length > 0);

  const cats = query ? filtered : CATEGORIES;

  return (
    <aside className="border-r bg-gray-50 p-3 text-sm">
      <div className="mb-2 font-medium text-gray-700">图标库</div>
      <input
        className="mb-2 w-full rounded border px-2 py-1"
        placeholder="搜索..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="space-y-3">
        {cats.map((cat) => (
          <CategorySection
            key={cat.id}
            cat={cat}
            isOpen={open[cat.id] ?? true}
            toggle={() => persistOpen({ ...open, [cat.id]: !(open[cat.id] ?? true) })}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </aside>
  );
}
