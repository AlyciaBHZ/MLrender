import { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { hexToRgba } from '@/utils/color';
import { NodeResizer } from '@reactflow/node-resizer';
import MathText from '@/components/MathText';
import NodeMarker from '@/components/NodeMarker';

export type CircleNodeData = {
  label?: string;
  color?: string;
  formulaLabel?: string;
  icon?: string; // Optional icon/emoji to display
  typeLabel?: string; // e.g., "LOSS", "METRIC", "OPTIMIZER"
};

export default function CircleNode({ data, selected }: NodeProps<CircleNodeData>) {
  const label = data?.label ?? 'Circle';
  const formulaLabel = data?.formulaLabel;
  const color = data?.color ?? '#2563eb';
  const icon = data?.icon;
  const typeLabel = data?.typeLabel;

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
    <div className="relative select-none flex items-center justify-center text-center min-w-[90px] min-h-[90px] w-full h-full" style={containerStyle} data-node-type="circle" data-type="optimizer" data-role="objective" aria-label={label}>
      <NodeResizer minWidth={90} minHeight={90} isVisible={selected} />
      <NodeMarker variant={'activation'} />

      {/* Generic circle node (flexible for loss, metrics, operators) */}
      <svg viewBox="0 0 100 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id={`circleGrad-${color}`}>
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.15 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.05 }} />
          </radialGradient>
          <filter id={`circleShadow-${color}`}>
            <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodOpacity="0.18" />
          </filter>
        </defs>

        <g data-selected={selected ? 'true' : undefined}>
          {/* Main circle */}
          <circle
            cx="50"
            cy="50"
            r="38"
            fill={`url(#circleGrad-${color})`}
            stroke={color}
            strokeWidth="2.8"
            filter={`url(#circleShadow-${color})`}
          />

          {/* Inner decorative circle */}
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity="0.3"
            strokeDasharray="3 3"
          />

          {/* Icon/content area */}
          {icon && (
            <text x="50" y="55" textAnchor="middle" fontSize="20" fill={color} opacity="0.8">
              {icon}
            </text>
          )}
        </g>

        {/* Type label */}
        {typeLabel && (
          <text x="50" y="12" textAnchor="middle" fontSize="9" fontWeight="700" fill="#6b7280" letterSpacing="0.5">
            {typeLabel}
          </text>
        )}

        <text x="50" y={formulaLabel ? 93 : 96} textAnchor="middle" fontSize="10" fontWeight="500" fill="#374151">
          {formulaLabel ? '' : label}
        </text>
      </svg>

      {/* LaTeX formula display */}
      {formulaLabel && (
        <div className="absolute bottom-1 text-xs font-medium text-gray-800" title={label}>
          <MathText text={formulaLabel} enabled />
        </div>
      )}

      <Handle type="target" position={Position.Left} className="w-3 h-3 rounded-full border-2 border-white" style={handleStyle} data-port="in" data-slot="0" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 rounded-full border-2 border-white" style={handleStyle} data-port="out" data-slot="0" />
    </div>
  );
}
