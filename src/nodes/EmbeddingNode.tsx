import { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { hexToRgba } from '@/utils/color';
import MathText from '@/components/MathText';
import NodeMarker from '@/components/NodeMarker';
import { NodeRoleColor } from '@/ui/tokens';

export type EmbeddingNodeData = {
  label?: string;
  color?: string;
  formulaLabel?: string;
  vocabSize?: number;
  embeddingDim?: number;
};

export default function EmbeddingNode({ data, selected }: NodeProps<EmbeddingNodeData>) {
  const label = data?.label ?? 'Embedding';
  const formulaLabel = data?.formulaLabel;
  const color = data?.color ?? NodeRoleColor.embedding;
  const vocabSize = data?.vocabSize;
  const embeddingDim = data?.embeddingDim;

  const containerStyle = useMemo(
    () => ({
      backgroundColor: 'transparent',
      boxShadow: selected
        ? `0 0 0 3px hsl(var(--mlcd-hover) / 0.25), 0 4px 12px ${hexToRgba(color, 0.25)}`
        : `0 2px 8px ${hexToRgba(color, 0.12)}`,
      transition: 'box-shadow 0.2s ease',
    }),
    [color, selected]
  );

  const handleStyle = useMemo(() => ({ backgroundColor: color }), [color]);

  return (
    <div className="px-2 py-2 min-w-[140px] min-h-[70px] w-full h-full relative select-none flex flex-col items-center justify-center" style={containerStyle} data-node-type="embedding" data-type="embedding" data-role="core" aria-label={label}>
      <NodeResizer minWidth={140} minHeight={70} isVisible={selected} />
      <NodeMarker variant={'embedding'} />

      {/* Embedding: sparse token indices → embedding matrix → dense vectors (academic standard from designer spec) */}
      <svg viewBox="0 0 160 85" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`embeddingGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.12 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.06 }} />
          </linearGradient>
          <marker id={`embeddingArrow-${color}`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#333" />
          </marker>
        </defs>

        <g data-selected={selected ? 'true' : undefined}>
          {/* Background container */}
          <rect
            x="2"
            y="8"
            width="156"
            height="68"
            rx="6"
            fill={`url(#embeddingGrad-${color})`}
            stroke={color}
            strokeWidth="1.5"
            opacity="0.25"
          />

          {/* Sparse token indices (left) - circles representing discrete IDs */}
          <g transform="translate(12, 25)" fill="#ffffff" stroke="#333" strokeWidth="1.8">
            <circle cx="0" cy="0" r="4"/>
            <text x="0" y="2" fontSize="6" fontWeight="600" fill="#333" textAnchor="middle">1</text>

            <circle cx="0" cy="15" r="4"/>
            <text x="0" y="17" fontSize="6" fontWeight="600" fill="#333" textAnchor="middle">5</text>

            <circle cx="0" cy="30" r="4"/>
            <text x="0" y="32" fontSize="6" fontWeight="600" fill="#333" textAnchor="middle">9</text>

            <text x="0" y="43" fontSize="6" fontWeight="500" fill="#6b7280" textAnchor="middle">tokens</text>
          </g>

          {/* Arrow to embedding matrix */}
          <polyline
            points="22,40 40,40"
            stroke="#333"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            markerEnd={`url(#embeddingArrow-${color})`}
          />

          {/* Embedding matrix (center) - grid representing lookup table */}
          <g transform="translate(48, 23)">
            {/* Matrix grid */}
            <rect x="0" y="0" width="44" height="36" fill="#F5B700" opacity="0.4" stroke="#333" strokeWidth="1.5"/>

            {/* Grid lines showing matrix structure */}
            <line x1="22" y1="0" x2="22" y2="36" stroke="#333" strokeWidth="1"/>
            <line x1="0" y1="18" x2="44" y2="18" stroke="#333" strokeWidth="1"/>

            {/* Highlight selected rows (showing lookup) */}
            <rect x="0" y="0" width="22" height="18" fill="#5AB5E7" opacity="0.7" stroke="#333" strokeWidth="1.5"/>
            <rect x="22" y="18" width="22" height="18" fill="#F27970" opacity="0.7" stroke="#333" strokeWidth="1.5"/>

            <text x="22" y="48" fontSize="6" fontWeight="500" fill="#6b7280" textAnchor="middle">matrix</text>
          </g>

          {/* Arrow to dense vector */}
          <polyline
            points="95,40 118,40"
            stroke="#333"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            markerEnd={`url(#embeddingArrow-${color})`}
          />

          {/* Dense embedding vector (right) - colored bars */}
          <g transform="translate(123, 34)">
            <rect x="0" y="0" width="14" height="7" fill="#5AB5E7" stroke="#333" strokeWidth="1.5" rx="0.5"/>
            <rect x="14" y="0" width="14" height="7" fill="#F27970" stroke="#333" strokeWidth="1.5" rx="0.5"/>

            <text x="14" y="14" fontSize="6" fontWeight="500" fill="#6b7280" textAnchor="middle">vector</text>
          </g>

          {/* Dimension labels if provided */}
          {(vocabSize || embeddingDim) && (
            <text x="80" y="72" textAnchor="middle" fontSize="7" fontWeight="500" fill="#9ca3af" fontFamily="monospace">
              {vocabSize && `V=${vocabSize}`}
              {vocabSize && embeddingDim && ' · '}
              {embeddingDim && `D=${embeddingDim}`}
            </text>
          )}
        </g>

        {/* Type label (top) */}
        <text x="80" y="6" textAnchor="middle" fontSize="9" fontWeight="700" fill="#6b7280" letterSpacing="0.5">
          EMBEDDING
        </text>

        <text x="80" y={formulaLabel ? 78 : 82} textAnchor="middle" fontSize="10" fontWeight="500" fill="#374151">
          {formulaLabel ? '' : label}
        </text>
      </svg>

      {/* LaTeX formula display */}
      {formulaLabel && (
        <div className="absolute bottom-0.5 text-xs font-medium text-gray-800" title={label}>
          <MathText text={formulaLabel} enabled />
        </div>
      )}

      <Handle type="target" position={Position.Left} className="w-3 h-3 rounded-sm border-2 border-white" style={handleStyle} data-port="in" data-slot="0" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 rounded-sm border-2 border-white" style={handleStyle} data-port="out" data-slot="0" />
    </div>
  );
}
