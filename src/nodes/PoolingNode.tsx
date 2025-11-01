import { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { hexToRgba } from '@/utils/color';
import MathText from '@/components/MathText';
import NodeMarker from '@/components/NodeMarker';
import { NodeRoleColor } from '@/ui/tokens';
import { resolveNodeColor } from '@/utils/color';
import { useDiagramStore } from '@/diagram/DiagramState';

export type PoolingNodeData = {
  label?: string;
  color?: string;
  formulaLabel?: string;
  poolType?: 'max' | 'avg' | 'global';
  poolSize?: string; // e.g., "2×2", "3×3"
  stride?: number;
  visualization?: 'funnel' | 'grid'; // Toggle between representations
};

export default function PoolingNode({ data, selected }: NodeProps<PoolingNodeData>) {
  const semanticLocked = useDiagramStore((s) => s.semanticColorsLocked);
  const label = data?.label ?? 'MaxPool2D';
  const formulaLabel = data?.formulaLabel;
  const color = resolveNodeColor(NodeRoleColor.pool, data, semanticLocked);
  const poolType = data?.poolType ?? 'max';
  const poolSize = data?.poolSize ?? '2×2';
  const stride = data?.stride;
  // const visualization = data?.visualization ?? 'funnel'; // reserved for future use

  const containerStyle = useMemo(
    () => ({
      backgroundColor: 'transparent',
      boxShadow: selected
        ? `0 0 0 3px hsl(var(--mlcd-hover) / 0.25), 0 4px 12px ${hexToRgba(color, 0.25)}`
        : `0 2px 8px ${hexToRgba(color, 0.12)}`,
      transition: 'box-shadow 0.2s ease',
    }),
    [selected, color]
  );
  const handleStyle = useMemo(() => ({ backgroundColor: color }), [color]);

  // Icon/indicator based on pooling type
  const poolIcon = useMemo(() => {
    switch (poolType) {
      case 'max':
        return '↑'; // Upward arrow for maximum
      case 'avg':
        return '≈'; // Approximately equal for average
      case 'global':
        return '⊕'; // Circle with plus for global
      default:
        return '↓';
    }
  }, [poolType]);

  return (
    <div className="relative select-none flex items-center justify-center text-center min-w-[120px] min-h-[100px] w-full h-full" style={containerStyle} data-node-type="pooling" data-type="pooling" data-role="core" aria-label={label}>
      <NodeResizer minWidth={120} minHeight={100} isVisible={selected} />
      <NodeMarker variant={'pool'} />

      {/* Pooling: 2×2 grid → single cell (academic standard from designer spec) */}
      <svg className="absolute inset-0" viewBox="0 0 130 90" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`poolGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.15 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.08 }} />
          </linearGradient>
          <marker id={`poolArrow-${color}`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#333" />
          </marker>
        </defs>

        <g data-selected={selected ? 'true' : undefined}>
          {/* Background container */}
          <rect
            x="2"
            y="10"
            width="126"
            height="70"
            rx="6"
            fill={`url(#poolGrad-${color})`}
            stroke={color}
            strokeWidth="1.5"
            opacity="0.25"
          />

          {/* 2×2 input grid (left) - showing feature map patch */}
          <g transform="translate(15, 30)">
            <rect x="0" y="0" width="18" height="18" fill="#BBD5EE" stroke="#333" strokeWidth="1.8" rx="1"/>
            <rect x="18" y="0" width="18" height="18" fill="#D4CBEA" stroke="#333" strokeWidth="1.8" rx="1"/>
            <rect x="0" y="18" width="18" height="18" fill="#DCEEF3" stroke="#333" strokeWidth="1.8" rx="1"/>
            <rect x="18" y="18" width="18" height="18" fill="#DECBE3" stroke="#333" strokeWidth="1.8" rx="1"/>

            <text x="18" y="46" fontSize="7" fontWeight="600" fill="#6b7280" textAnchor="middle">2×2</text>
          </g>

          {/* Transformation arrow */}
          <polyline
            points="60,45 78,45"
            stroke="#333"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            markerEnd={`url(#poolArrow-${color})`}
          />

          {/* Output cell (right) - aggregated result */}
          <g transform="translate(85, 36)">
            <rect x="0" y="0" width="20" height="20" fill="#DECBE3" stroke="#333" strokeWidth="2.5" rx="1"/>

            {/* Pool type icon inside */}
            <text x="10" y="14" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#333">
              {poolIcon}
            </text>

            <text x="10" y="30" fontSize="7" fontWeight="600" fill="#6b7280" textAnchor="middle">output</text>
          </g>

          {/* Pool size indicator */}
          {poolSize && (
            <text x="65" y="72" textAnchor="middle" fontSize="8" fontWeight="600" fill={color} opacity="0.7" fontFamily="monospace">
              {poolSize}
            </text>
          )}
        </g>

        {/* Type label handled by ribbon */}

        {/* Stride parameter */}
        {stride && (
          <text x="65" y="84" textAnchor="middle" fontSize="7" fontWeight="500" fill="#9ca3af" fontFamily="monospace">
            stride={stride}
          </text>
        )}

        <text x="65" y={formulaLabel ? 82 : 86} textAnchor="middle" fontSize="10" fontWeight="500" fill="#374151">
          {formulaLabel ? '' : label}
        </text>
      </svg>

      {/* LaTeX formula display */}
      {formulaLabel && (
        <div className="absolute bottom-1 text-sm font-medium text-gray-800" title={label}>
          <MathText text={formulaLabel} enabled />
        </div>
      )}

      <Handle type="target" position={Position.Left} className="w-3 h-3 rounded-sm border-2 border-white" style={handleStyle} data-port="in" data-slot="0" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 rounded-sm border-2 border-white" style={handleStyle} data-port="out" data-slot="0" />
    </div>
  );
}
