import { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { hexToRgba } from '@/utils/color';
import MathText from '@/components/MathText';
import { NodeRoleColor } from '@/ui/tokens';

export type NeuronNodeData = {
  label?: string;
  color?: string;
  formulaLabel?: string;
  activationState?: number; // 0-1 value showing activation level
  showPulse?: boolean; // Animated pulse for active neurons
};

export default function NeuronNode({ data, selected }: NodeProps<NeuronNodeData>) {
  const label = data?.label ?? 'Neuron';
  const formulaLabel = data?.formulaLabel;
  const color = data?.color ?? NodeRoleColor.activation;
  const activationState = data?.activationState ?? 0.5;
  const showPulse = data?.showPulse ?? false;

  const containerStyle = useMemo(
    () => ({
      backgroundColor: 'transparent',
      boxShadow: selected
        ? `0 0 0 3px hsl(var(--mlcd-hover) / 0.25), 0 4px 12px ${hexToRgba(color, 0.3)}`
        : `0 2px 8px ${hexToRgba(color, 0.15)}`,
      transition: 'box-shadow 0.2s ease',
    }),
    [color, selected]
  );

  const handleStyle = useMemo(() => ({ backgroundColor: color }), [color]);

  return (
    <div className="relative select-none flex items-center justify-center text-center min-w-[70px] min-h-[70px] w-full h-full" style={containerStyle} data-node-type="neuron" data-type="neuron" data-role="func" aria-label={label}>
      <NodeResizer minWidth={70} minHeight={70} isVisible={selected} />

      {/* Single neuron visualization (academic standard - circular with activation state) */}
      <svg viewBox="0 0 80 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id={`neuronGrad-${color}`}>
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.8 }} />
            <stop offset="70%" style={{ stopColor: color, stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.1 }} />
          </radialGradient>
          <filter id={`neuronGlow-${color}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {showPulse && (
            <animate
              attributeName="r"
              values="28;32;28"
              dur="2s"
              repeatCount="indefinite"
            />
          )}
        </defs>

        <g data-selected={selected ? 'true' : undefined}>
          {/* Outer ring showing activation state */}
          <circle
            cx="40"
            cy="40"
            r="32"
            fill="none"
            stroke={color}
            strokeWidth="2"
            opacity="0.3"
          />

          {/* Main neuron body with gradient */}
          <circle
            cx="40"
            cy="40"
            r="28"
            fill={`url(#neuronGrad-${color})`}
            stroke={color}
            strokeWidth="2.8"
            filter={activationState > 0.7 ? `url(#neuronGlow-${color})` : undefined}
            opacity={0.3 + activationState * 0.7}
          />

          {/* Core nucleus */}
          <circle
            cx="40"
            cy="40"
            r={8 + activationState * 6}
            fill={color}
            opacity={0.6 + activationState * 0.4}
          />

          {/* Activation level indicator */}
          {activationState > 0 && (
            <text x="40" y="70" textAnchor="middle" fontSize="7" fontWeight="600" fill={color} opacity="0.7" fontFamily="monospace">
              {(activationState * 100).toFixed(0)}%
            </text>
          )}
        </g>

        {/* Type label */}
        <text x="40" y="10" textAnchor="middle" fontSize="8" fontWeight="700" fill="#6b7280" letterSpacing="0.3">
          N
        </text>
      </svg>

      {/* Label display */}
      <div className="absolute bottom-0 w-full text-center">
        {formulaLabel ? (
          <div className="text-xs font-medium text-gray-800" title={label}>
            <MathText text={formulaLabel} enabled />
          </div>
        ) : (
          <div className="text-[10px] font-medium text-gray-600 truncate px-1" title={label}>
            {label}
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 rounded-full border-2 border-white" style={handleStyle} data-port="in" data-slot="0" />
      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 rounded-full border-2 border-white" style={handleStyle} data-port="out" data-slot="0" />
    </div>
  );
}
