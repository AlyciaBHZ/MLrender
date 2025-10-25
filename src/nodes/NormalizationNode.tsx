import { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { hexToRgba } from '@/utils/color';
import MathText from '@/components/MathText';
import NodeMarker from '@/components/NodeMarker';
import { NodeRoleColor } from '@/ui/tokens';

export type NormalizationNodeData = {
  label?: string;
  color?: string;
  formulaLabel?: string;
  normType?: 'batch' | 'layer' | 'instance' | 'group';
  epsilon?: number; // Small constant for numerical stability
  numGroups?: number; // For group normalization
};

export default function NormalizationNode({ data, selected }: NodeProps<NormalizationNodeData>) {
  const label = data?.label ?? 'BatchNorm2D';
  const formulaLabel = data?.formulaLabel;
  const color = data?.color ?? NodeRoleColor.norm;
  const normType = data?.normType ?? 'batch';
  const epsilon = data?.epsilon;
  const numGroups = data?.numGroups;

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

  return (
    <div className="relative select-none flex items-center justify-center text-center min-w-[130px] min-h-[100px] w-full h-full" style={containerStyle} data-node-type="normalization" data-type="normalization" data-role="core" aria-label={label}>
      <NodeResizer minWidth={130} minHeight={100} isVisible={selected} />
      <NodeMarker variant={'norm'} />

      {/* Normalization: multiple distributions → standard distribution (academic standard from designer spec) */}
      <svg className="absolute inset-0" viewBox="0 0 150 95" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`normGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.12 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.06 }} />
          </linearGradient>
          <marker id={`normArrow-${color}`} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L0,7 L7,3.5 z" fill="#333" />
          </marker>
        </defs>

        <g data-selected={selected ? 'true' : undefined}>
          {/* Background container */}
          <rect
            x="2"
            y="10"
            width="146"
            height="75"
            rx="6"
            fill={`url(#normGrad-${color})`}
            stroke={color}
            strokeWidth="1.5"
            opacity="0.25"
          />

          {/* Multiple unnormalized distributions (left) */}
          <g transform="translate(15, 25)">
            {/* Three bell curves with different means/variances */}
            <path
              d="M 0 35 Q 8 15, 16 35"
              stroke="#74A3CE"
              fill="none"
              strokeWidth="2.2"
              opacity="0.8"
            />
            <path
              d="M 8 35 Q 16 18, 24 35"
              stroke="#CEA8BF"
              fill="none"
              strokeWidth="2.2"
              opacity="0.8"
            />
            <path
              d="M 16 35 Q 24 20, 32 35"
              stroke="#F5B478"
              fill="none"
              strokeWidth="2.2"
              opacity="0.8"
            />

            <text x="16" y="46" fontSize="7" fontWeight="500" fill="#6b7280" textAnchor="middle">varied</text>
          </g>

          {/* Transformation arrow */}
          <polyline
            points="63,48 86,48"
            stroke="#333"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            markerEnd={`url(#normArrow-${color})`}
          />

          {/* Single normalized distribution (right) - centered, standard */}
          <g transform="translate(93, 25)">
            <path
              d="M 0 35 Q 15 10, 30 35"
              stroke="#74A3CE"
              fill="none"
              strokeWidth="2.5"
              opacity="0.9"
            />

            {/* Center line showing mean = 0 */}
            <line x1="15" y1="12" x2="15" y2="35" stroke={color} strokeWidth="1.2" strokeDasharray="2,2" opacity="0.5" />

            <text x="15" y="46" fontSize="7" fontWeight="500" fill="#6b7280" textAnchor="middle">μ=0, σ=1</text>
          </g>

          {/* Formula annotation */}
          <g transform="translate(75, 68)">
            <text x="0" y="0" fontSize="9" fontWeight="600" fill={color} opacity="0.6" fontFamily="serif" fontStyle="italic" textAnchor="middle">
              (x−μ)/σ
            </text>
          </g>
        </g>

        {/* Type label */}
        <text x="75" y="8" textAnchor="middle" fontSize="9" fontWeight="700" fill="#6b7280" letterSpacing="0.5">
          {normType.toUpperCase()}NORM
        </text>

        {/* Parameters */}
        {(epsilon || numGroups) && (
          <text x="75" y="88" textAnchor="middle" fontSize="7" fontWeight="500" fill="#9ca3af" fontFamily="monospace">
            {epsilon && `ε=${epsilon}`}
            {epsilon && numGroups && ' · '}
            {numGroups && `groups=${numGroups}`}
          </text>
        )}

        <text x="75" y={formulaLabel ? 90 : 93} textAnchor="middle" fontSize="10" fontWeight="500" fill="#374151">
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
