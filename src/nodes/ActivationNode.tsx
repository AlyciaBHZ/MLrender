import { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import MathText from '@/components/MathText';
import { hexToRgba } from '@/utils/color';
import NodeMarker from '@/components/NodeMarker';
import { NodeRoleColor } from '@/ui/tokens';

export type ActivationNodeData = {
  label?: string;
  color?: string;
  shape?: 'circle' | 'diamond';
  formulaLabel?: string;
  activationType?: 'relu' | 'sigmoid' | 'tanh' | 'softmax' | 'leaky_relu' | 'gelu' | 'silu';
  alpha?: number; // For Leaky ReLU negative slope (default: 0.01)
};

export default function ActivationNode({ data, selected }: NodeProps<ActivationNodeData>) {
  const label = data?.label ?? 'ReLU';
  const formulaLabel = data?.formulaLabel;
  const color = data?.color ?? NodeRoleColor.activation;
  const shape = data?.shape ?? 'diamond';
  const activationType = data?.activationType ?? 'relu';

  const containerStyle = useMemo(
    () => ({
      backgroundColor: 'transparent',
      boxShadow: selected
        ? `0 0 0 3px hsl(var(--mlcd-hover) / 0.25), 0 4px 14px ${hexToRgba(color, 0.3)}`
        : `0 2px 8px ${hexToRgba(color, 0.15)}`,
      transition: 'box-shadow 0.2s ease',
    }),
    [selected, color]
  );
  const handleStyle = useMemo(() => ({ backgroundColor: color }), [color]);

  // Generate activation function curve based on type
  const activationCurve = useMemo(() => {
    switch (activationType) {
      case 'relu':
        return 'M 35 75 L 60 60 L 85 45'; // Piecewise linear
      case 'sigmoid':
        return 'M 35 80 Q 50 70, 60 60 T 85 40'; // S-curve in [0,1]
      case 'tanh':
        return 'M 35 75 Q 45 65, 60 60 Q 75 55, 85 45'; // Symmetric S-curve crossing 0
      case 'softmax':
        return 'M 35 70 Q 60 55, 85 50'; // Exponential rise
      case 'leaky_relu':
        return 'M 30 78 L 60 60 L 90 42'; // Slight negative slope
      case 'gelu':
        return 'M 35 78 Q 50 68, 60 60 Q 70 52, 85 43'; // Smooth Gaussian-like
      case 'silu':
        return 'M 35 80 Q 48 65, 60 58 Q 72 51, 85 45'; // Asymmetric smooth (sigmoid Ã— x)
      default:
        return 'M 35 75 L 60 60 L 85 45';
    }
  }, [activationType]);

  // Mathematical badge for instant recognition (ALWAYS VISIBLE - LOD exception)
  const mathBadge = useMemo(() => {
    switch (activationType) {
      case 'relu':
        return 'ReLU';
      case 'sigmoid':
        return 'Ïƒ'; // Greek sigma
      case 'tanh':
        return 'tanh';
      case 'softmax':
        return 'ð‘†'; // Script S
      case 'leaky_relu':
        return 'LReLU';
      case 'gelu':
        return 'ð’©'; // Script N (Gaussian hint)
      case 'silu':
        return 'swish';
      default:
        return 'ACT';
    }
  }, [activationType]);

  return (
    <div className="relative select-none flex items-center justify-center text-center min-w-[100px] min-h-[100px] w-full h-full" style={containerStyle} data-node-type="activation" data-type="activation" data-role="func" data-shape={shape} aria-label={label}>
      <NodeResizer minWidth={100} minHeight={100} isVisible={selected} />
      <NodeMarker variant={'activation'} />

      {/* Diamond shape for activations (academic standard) */}
      <svg className="absolute inset-0" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`actGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.25 }} />
            <stop offset="50%" style={{ stopColor: color, stopOpacity: 0.12 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.05 }} />
          </linearGradient>
          <filter id={`actShadow-${color}`}>
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.15" />
          </filter>
        </defs>
        <g data-selected={selected ? 'true' : undefined}>
          {/* Diamond shape with shadow */}
          <polygon
            points="60,12 108,60 60,108 12,60"
            fill={`url(#actGrad-${color})`}
            stroke={color}
            strokeWidth="2.8"
            strokeLinejoin="miter"
            filter={`url(#actShadow-${color})`}
          />

          {/* Coordinate axes (light) */}
          <g opacity="0.2" stroke="#9ca3af" strokeWidth="0.8">
            <line x1="30" y1="60" x2="90" y2="60" />
            <line x1="60" y1="30" x2="60" y2="90" />
          </g>

          {/* Activation function curve visualization */}
          <g opacity="0.7">
            <path
              d={activationCurve}
              stroke={color}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>

        {/* Mathematical badge (top-right, ALWAYS VISIBLE - LOD exception) */}
        <text
          x="92"
          y="28"
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill={color}
          opacity="0.8"
          style={{ userSelect: 'none' }}
        >
          {mathBadge}
        </text>
      </svg>

      {/* Main label */}
      <div className="relative z-10 text-center space-y-0.5">
        <div className="text-sm font-bold text-gray-800 max-w-[80%] mx-auto break-words" title={label}>
          {formulaLabel ? <MathText text={formulaLabel} enabled /> : label}
        </div>
        {!formulaLabel && (
          <div className="text-[10px] font-mono text-gray-400">{String(activationType).toUpperCase()}</div>
        )}
      </div>

      <Handle type="target" position={Position.Left} className="w-3 h-3 rounded-full border-2 border-white" style={handleStyle} data-port="in" data-slot="0" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 rounded-full border-2 border-white" style={handleStyle} data-port="out" data-slot="0" />
    </div>
  );
}




