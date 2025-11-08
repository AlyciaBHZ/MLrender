import { useMemo } from 'react';
import type { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';
import { NodeRoleColor } from '@/ui/tokens';
import { hexToRgba } from '@/utils/color';
import MathText from '@/components/MathText';
import NodeMarker from '@/components/NodeMarker';

export type AttentionNodeData = {
  label?: string;
  color?: string;
  formulaLabel?: string;
  numHeads?: number;
  embedDim?: number;
  dropout?: number;
};

export default function AttentionNode({ data, selected }: NodeProps<AttentionNodeData>) {
  const label = data.label || 'Attention';
  const formulaLabel = data.formulaLabel;
  const color = data.color || NodeRoleColor.attention;
  const numHeads = data.numHeads || 8;
  const embedDim = data.embedDim || 512;
  const dropout = data.dropout ?? 0.1;

  // Box shadow styling
  const boxShadowStyle = useMemo(
    () => ({
      boxShadow: selected
        ? `0 0 0 3px hsl(var(--mlcd-hover) / 0.25), 0 4px 12px ${hexToRgba(color, 0.25)}`
        : `0 2px 8px ${hexToRgba(color, 0.12)}`,
      transition: 'box-shadow 0.2s ease',
    }),
    [selected, color]
  );

  return (
    <div
      className="rounded-lg bg-white border-2 relative"
      style={{
        borderColor: color,
        minWidth: 140,
        minHeight: 100,
        width: 140,
        height: 100,
        ...boxShadowStyle,
      }}
      role="graphics-symbol"
      aria-label={`Attention node: ${label}`}
      data-node-type="attention"
    >
      {/* Corner Marker */}
      <div className="absolute top-1 left-1 pointer-events-none">
        <NodeMarker variant="attention" />
      </div>

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 rounded-sm border-2 border-white"
        style={{ backgroundColor: color }}
        data-port="in"
        data-slot="0"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 rounded-sm border-2 border-white"
        style={{ backgroundColor: color }}
        data-port="out"
        data-slot="0"
      />

      {/* SVG Visualization: Q-K-V Architecture */}
      <svg
        viewBox="0 0 140 100"
        className="absolute inset-0"
        style={{ pointerEvents: 'none' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient for Q-K-V boxes */}
          <linearGradient id={`attn-grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.15 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.05 }} />
          </linearGradient>
          
          {/* Drop shadow filter */}
          <filter id={`attn-shadow-${color}`}>
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.2" />
          </filter>

          {/* Softmax curve pattern */}
          <pattern id={`softmax-${color}`} patternUnits="userSpaceOnUse" width="40" height="20">
            <path
              d="M0,15 Q10,5 20,10 T40,10"
              stroke={color}
              strokeWidth="0.8"
              fill="none"
              opacity="0.3"
            />
          </pattern>
        </defs>

        {/* Q-K-V Boxes */}
        <g filter={`url(#attn-shadow-${color})`}>
          {/* Q Box */}
          <rect
            x="15"
            y="30"
            width="22"
            height="45"
            rx="3"
            fill={`url(#attn-grad-${color})`}
            stroke={color}
            strokeWidth="2"
          />
          <text
            x="26"
            y="56"
            fontSize="14"
            fontWeight="700"
            fill={color}
            textAnchor="middle"
          >
            Q
          </text>

          {/* K Box */}
          <rect
            x="45"
            y="30"
            width="22"
            height="45"
            rx="3"
            fill={`url(#attn-grad-${color})`}
            stroke={color}
            strokeWidth="2"
          />
          <text
            x="56"
            y="56"
            fontSize="14"
            fontWeight="700"
            fill={color}
            textAnchor="middle"
          >
            K
          </text>

          {/* V Box */}
          <rect
            x="75"
            y="30"
            width="22"
            height="45"
            rx="3"
            fill={`url(#attn-grad-${color})`}
            stroke={color}
            strokeWidth="2"
          />
          <text
            x="86"
            y="56"
            fontSize="14"
            fontWeight="700"
            fill={color}
            textAnchor="middle"
          >
            V
          </text>
        </g>

        {/* Attention mechanism arrows (Q·K → Softmax → V) */}
        <g opacity="0.6">
          {/* Q→K connection (dot product) */}
          <path
            d="M37,52 L45,52"
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="2,2"
            markerEnd={`url(#arrow-${color})`}
          />
          
          {/* K→V connection (weighted sum) */}
          <path
            d="M67,52 L75,52"
            stroke={color}
            strokeWidth="1.5"
            strokeDasharray="2,2"
            markerEnd={`url(#arrow-${color})`}
          />
        </g>

        {/* Arrow marker definition */}
        <defs>
          <marker
            id={`arrow-${color}`}
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill={color} />
          </marker>
        </defs>

        {/* Multi-head indicator */}
        {numHeads > 1 && (
          <g>
            <text
              x="105"
              y="25"
              fontSize="9"
              fontWeight="600"
              fill={color}
              opacity="0.8"
            >
              ×{numHeads}
            </text>
            <text
              x="105"
              y="34"
              fontSize="7"
              fill={color}
              opacity="0.6"
            >
              heads
            </text>
          </g>
        )}

        {/* Softmax visualization */}
        <rect
          x="42"
          y="22"
          width="28"
          height="8"
          rx="2"
          fill={`url(#softmax-${color})`}
          opacity="0.4"
        />
        <text
          x="56"
          y="28"
          fontSize="6"
          fontWeight="600"
          fill={color}
          textAnchor="middle"
          opacity="0.7"
        >
          softmax
        </text>
      </svg>

      {/* Label */}
      <div className="absolute bottom-2 left-2 right-2 text-center">
        {formulaLabel ? (
          <div className="text-xs font-medium text-gray-800" title={label}>
            <MathText text={formulaLabel} enabled />
          </div>
        ) : (
          <div
            className="text-xs font-semibold truncate"
            style={{ color }}
            title={label}
          >
            {label}
          </div>
        )}
      </div>

      {/* Parameter info (hover tooltip area) */}
      <div className="absolute top-2 right-2 text-[7px] text-gray-600 opacity-70 font-mono leading-tight text-right">
        <div>d={embedDim}</div>
        {dropout > 0 && <div>p={dropout.toFixed(2)}</div>}
      </div>
    </div>
  );
}

