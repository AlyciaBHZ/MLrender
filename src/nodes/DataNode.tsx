import { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { hexToRgba } from '@/utils/color';
import { NodeResizer } from '@reactflow/node-resizer';
import MathText from '@/components/MathText';
import NodeMarker from '@/components/NodeMarker';
import { NodeRoleColor } from '@/ui/tokens';

export type DataNodeData = {
  label?: string;
  color?: string;
  direction?: 'left' | 'right';
  formulaLabel?: string;
  dataSource?: string; // e.g., "CSV", "Image", "Audio", "Text"
  shape?: string; // e.g., "(N, 784)", "(B, 3, 224, 224)"
  ioType?: 'input' | 'output'; // Distinguish input from output
};

export default function DataNode({ data, selected }: NodeProps<DataNodeData>) {
  const label = data?.label ?? 'Data';
  const formulaLabel = data?.formulaLabel;
  const color = data?.color ?? NodeRoleColor.data;
  const direction: 'left' | 'right' = data?.direction ?? 'right';
  const dataSource = data?.dataSource;
  const shape = data?.shape;
  const ioType = data?.ioType ?? 'input';

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
    <div className="px-2 py-2 min-w-[120px] min-h-[100px] w-full h-full relative select-none flex flex-col items-center justify-center" style={containerStyle} data-node-type="data" data-type="data" data-role="data" data-direction={direction} data-io-type={ioType} aria-label={label}>
      <NodeResizer minWidth={120} minHeight={100} isVisible={selected} />
      <NodeMarker variant={'data'} />

      {/* Data node visualization (academic standard - parallelogram with flow direction) */}
      <svg viewBox="0 0 130 110" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`dataGrad-${color}-${direction}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: direction === 'right' ? 0.25 : 0.10 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: direction === 'right' ? 0.10 : 0.25 }} />
          </linearGradient>
          <filter id={`dataShadow-${color}`}>
            <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>

        <g data-selected={selected ? 'true' : undefined}>
          {/* Parallelogram showing data flow direction */}
          {direction === 'right' ? (
            <path
              d="M 20 25 L 110 20 L 100 75 L 10 80 Z"
              fill={`url(#dataGrad-${color}-${direction})`}
              stroke={color}
              strokeWidth="2.8"
              strokeLinejoin="round"
              filter={`url(#dataShadow-${color})`}
            />
          ) : (
            <path
              d="M 10 20 L 100 25 L 110 80 L 20 75 Z"
              fill={`url(#dataGrad-${color}-${direction})`}
              stroke={color}
              strokeWidth="2.8"
              strokeLinejoin="round"
              filter={`url(#dataShadow-${color})`}
            />
          )}

          {/* Data flow arrows */}
          <g opacity="0.5" stroke={color} strokeWidth="2" fill={color}>
            {direction === 'right' ? (
              <>
                <line x1="30" y1="52" x2="90" y2="48" strokeLinecap="round" />
                <path d="M 85 46 L 90 48 L 85 50 Z" />
              </>
            ) : (
              <>
                <line x1="90" y1="52" x2="30" y2="48" strokeLinecap="round" />
                <path d="M 35 46 L 30 48 L 35 50 Z" />
              </>
            )}
          </g>

          {/* I/O indicator badge (SOLID FILL, high contrast, ALWAYS VISIBLE - 36×18px) */}
          <g>
            <rect
              x={direction === 'right' ? '12' : '82'}
              y="28"
              width="36"
              height="18"
              rx="4"
              fill={ioType === 'input' ? '#22c55e' : '#ef4444'}
              opacity="1"
            />
            <text
              x={direction === 'right' ? '30' : '100'}
              y="40"
              textAnchor="middle"
              fontSize="10"
              fontWeight="900"
              fill="white"
              letterSpacing="0.5"
            >
              {ioType === 'input' ? 'IN' : 'OUT'}
            </text>
          </g>
        </g>

        {/* Type label */}
        <text x="65" y="14" textAnchor="middle" fontSize="10" fontWeight="700" fill="#6b7280" letterSpacing="0.5">
          DATA
        </text>

        {/* Data source indicator */}
        {dataSource && (
          <text x="65" y="95" textAnchor="middle" fontSize="8" fontWeight="600" fill="#9ca3af" fontFamily="monospace">
            {dataSource}
          </text>
        )}

        {/* Shape display */}
        {shape && (
          <text x="65" y={dataSource ? "103" : "95"} textAnchor="middle" fontSize="8" fontWeight="500" fill={color} opacity="0.6" fontFamily="monospace">
            {shape}
          </text>
        )}

        <text x="65" y={formulaLabel ? 105 : 108} textAnchor="middle" fontSize="11" fontWeight="500" fill="#374151">
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
