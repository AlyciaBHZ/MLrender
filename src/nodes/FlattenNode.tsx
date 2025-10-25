import { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { hexToRgba } from '@/utils/color';
import MathText from '@/components/MathText';
import NodeMarker from '@/components/NodeMarker';
import { NodeRoleColor } from '@/ui/tokens';

export type FlattenNodeData = {
  label?: string;
  color?: string;
  formulaLabel?: string;
};

export default function FlattenNode({ data, selected }: NodeProps<FlattenNodeData>) {
  const label = data?.label ?? 'Flatten';
  const formulaLabel = data?.formulaLabel;
  const color = data?.color ?? NodeRoleColor.tensor;

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
    <div className="px-2 py-2 min-w-[100px] min-h-[48px] w-full h-full relative select-none flex flex-col items-center justify-center" style={containerStyle} data-node-type="flatten" data-type="flatten" data-role="core" aria-label={label}>
      <NodeResizer minWidth={100} minHeight={48} isVisible={selected} />
      <NodeMarker variant={'tensor'} />

      {/* Flatten operation: 3D tensor → 1D vector (academic standard from designer spec) */}
      <svg viewBox="0 0 140 70" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`flattenGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.15 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.08 }} />
          </linearGradient>
          <filter id={`flattenShadow-${color}`}>
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.15" />
          </filter>
          <marker id={`flattenArrow-${color}`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L0,8 L8,4 z" fill="#333" />
          </marker>
        </defs>

        <g data-selected={selected ? 'true' : undefined}>
          {/* Background container */}
          <rect
            x="2"
            y="10"
            width="136"
            height="52"
            rx="6"
            fill={`url(#flattenGrad-${color})`}
            stroke={color}
            strokeWidth="1.5"
            opacity="0.3"
          />

          {/* 3D tensor cube (left) - isometric projection showing H×W×C */}
          <g transform="translate(15, 25)">
            {/* Back face (channels dimension) */}
            <polygon
              points="5,10 25,5 45,5 25,10"
              fill="#F5B700"
              opacity="0.7"
              stroke="#333"
              strokeWidth="1.8"
            />
            {/* Left face (height dimension) */}
            <polygon
              points="5,25 25,20 25,5 5,10"
              fill="#F27970"
              opacity="0.8"
              stroke="#333"
              strokeWidth="1.8"
            />
            {/* Right face (width dimension) */}
            <polygon
              points="25,20 45,20 45,5 25,5"
              fill="#5AB5E7"
              opacity="0.9"
              stroke="#333"
              strokeWidth="2"
            />
          </g>

          {/* Transformation arrow */}
          <polyline
            points="70,35 90,35"
            stroke="#333"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            markerEnd={`url(#flattenArrow-${color})`}
          />

          {/* 1D vector (right) - segmented bar showing flattened elements */}
          <g transform="translate(95, 29)">
            <rect x="0" y="0" width="12" height="6" fill="#5AB5E7" stroke="#333" strokeWidth="1.5" rx="0.5"/>
            <rect x="12" y="0" width="12" height="6" fill="#F27970" stroke="#333" strokeWidth="1.5" rx="0.5"/>
            <rect x="24" y="0" width="12" height="6" fill="#F5B700" stroke="#333" strokeWidth="1.5" rx="0.5"/>
            <text x="18" y="11" fontSize="7" fontWeight="600" fill="#6b7280" textAnchor="middle">vector</text>
          </g>
        </g>

        {/* Type label (top) */}
        <text x="70" y="8" textAnchor="middle" fontSize="9" fontWeight="700" fill="#6b7280" letterSpacing="0.5">
          FLATTEN
        </text>

        <text x="70" y={formulaLabel ? 64 : 67} textAnchor="middle" fontSize="10" fontWeight="500" fill="#374151">
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
