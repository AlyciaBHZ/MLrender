import { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { hexToRgba } from '@/utils/color';
import NodeMarker from '@/components/NodeMarker';
import { NodeResizer } from '@reactflow/node-resizer';
import MathText from '@/components/MathText';

export type BoxNodeData = {
  label?: string;
  color?: string;
  typeLabel?: string;
  variant?: string;
  formulaLabel?: string;
};

export default function BoxNode({ data, selected }: NodeProps<BoxNodeData>) {
  const label = data?.label ?? 'Module';
  const formulaLabel = data?.formulaLabel;
  const color = data?.color ?? '#2563eb';
  const typeLabel = data?.typeLabel ?? 'CUSTOM';
  const variant = data?.variant as string | undefined;

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
  const dataType = variant === 'loss' ? 'loss' : variant === 'activation' ? 'activation' : variant === 'dropout' ? 'dropout' : 'fc';
  const dataRole = variant === 'loss' ? 'objective' : variant === 'activation' || variant === 'dropout' ? 'func' : 'core';

  return (
    <div className="px-2 py-2 min-w-[110px] min-h-[80px] w-full h-full relative select-none flex flex-col items-center justify-center" style={containerStyle} data-node-type="box" data-variant={variant} data-type={dataType as any} data-role={dataRole as any} aria-label={`${typeLabel} ${label}`}>
      <NodeResizer minWidth={110} minHeight={80} isVisible={selected} />
      <NodeMarker variant={variant as any} />

      {/* Generic box/module visualization (flexible container) */}
      <svg viewBox="0 0 120 90" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`boxGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.12 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.04 }} />
          </linearGradient>
          <filter id={`boxShadow-${color}`}>
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.15" />
          </filter>
        </defs>

        <g data-selected={selected ? 'true' : undefined}>
          {/* Main rounded rectangle */}
          <rect
            x="10"
            y="20"
            width="100"
            height="55"
            rx="8"
            fill={`url(#boxGrad-${color})`}
            stroke={color}
            strokeWidth="2.5"
            filter={`url(#boxShadow-${color})`}
          />

          {/* Decorative corner marks (showing modularity) */}
          <g opacity="0.4" stroke={color} strokeWidth="1.5" fill="none">
            <path d="M 18 25 L 18 28 M 18 25 L 21 25" />
            <path d="M 102 25 L 102 28 M 102 25 L 99 25" />
            <path d="M 18 70 L 18 67 M 18 70 L 21 70" />
            <path d="M 102 70 L 102 67 M 102 70 L 99 70" />
          </g>

          {/* Center icon/indicator (generic module) */}
          <g opacity="0.5">
            <rect x="52" y="42" width="16" height="16" rx="2" stroke={color} strokeWidth="1.5" fill="none" />
            <circle cx="60" cy="50" r="3" fill={color} />
          </g>
        </g>

        {/* Type label */}
        <text x="60" y="14" textAnchor="middle" fontSize="9" fontWeight="700" fill="#6b7280" letterSpacing="0.5">
          {typeLabel}
        </text>

        <text x="60" y={formulaLabel ? 82 : 85} textAnchor="middle" fontSize="11" fontWeight="500" fill="#374151">
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
