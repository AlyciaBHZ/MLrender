import { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { hexToRgba } from '@/utils/color';
import { NodeResizer } from '@reactflow/node-resizer';
import { NodeRoleColor } from '@/ui/tokens';
import MathText from '@/components/MathText';

export type TensorNodeData = {
  label?: string;
  color?: string;
  depth?: number;
  typeLabel?: string;
  formulaLabel?: string;
  shape?: string; // e.g., "28×28×3", "[B, C, H, W]"
  dtype?: string; // e.g., "float32", "int64"
};

export default function TensorNode({ data, selected }: NodeProps<TensorNodeData>) {
  const label = data?.label ?? 'Tensor';
  const formulaLabel = data?.formulaLabel;
  const color = data?.color ?? NodeRoleColor.tensor;
  const depth = Math.max(3, Math.min(8, data?.depth ?? 5));
  const shape = data?.shape;
  const dtype = data?.dtype;

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

  // Generate stacked layers for 3D effect
  const layers = useMemo(() => {
    const result = [];
    const layerOffset = 6;
    for (let i = 0; i < depth; i++) {
      const offsetX = i * layerOffset;
      const offsetY = i * (layerOffset * 0.5);
      const opacity = 0.35 + (i / depth) * 0.65;
      result.push({ offsetX, offsetY, opacity, index: i });
    }
    return result;
  }, [depth]);

  return (
    <div className="px-2 py-2 min-w-[140px] min-h-[140px] w-full h-full relative select-none flex flex-col items-center justify-center" style={containerStyle} data-node-type="tensor" data-type="tensor" data-role="data" aria-label={label}>
      <NodeResizer minWidth={140} minHeight={140} isVisible={selected} />

      {/* 3D Stacked tensor representation (academic standard for multi-dimensional data) */}
      <svg viewBox="0 0 160 155" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`tensorGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.45 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.18 }} />
          </linearGradient>
          <filter id={`tensorShadow-${color}`}>
            <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodOpacity="0.2" />
          </filter>
        </defs>

        <g data-selected={selected ? 'true' : undefined}>
          {/* Draw layers from back to front with shadows between */}
          {layers.map((layer) => (
            <g key={layer.index} opacity={layer.opacity}>
              {/* Shadow between layers */}
              {layer.index < depth - 1 && (
                <rect
                  x={27 + layer.offsetX}
                  y={32 + layer.offsetY}
                  width="80"
                  height="60"
                  rx="4"
                  fill="#000"
                  opacity="0.08"
                />
              )}

              {/* Rounded rectangle for each tensor slice */}
              <rect
                x={25 + layer.offsetX}
                y={30 + layer.offsetY}
                width="80"
                height="60"
                rx="4"
                fill={layer.index === depth - 1 ? 'white' : `url(#tensorGrad-${color})`}
                stroke={color}
                strokeWidth={layer.index === depth - 1 ? '2.8' : '1.8'}
                filter={layer.index === depth - 1 ? `url(#tensorShadow-${color})` : undefined}
              />

              {/* Grid on front layer only */}
              {layer.index === depth - 1 && (
                <g opacity="0.3" stroke={color} strokeWidth="1">
                  <line x1={45 + layer.offsetX} y1={30 + layer.offsetY} x2={45 + layer.offsetX} y2={90 + layer.offsetY} />
                  <line x1={65 + layer.offsetX} y1={30 + layer.offsetY} x2={65 + layer.offsetX} y2={90 + layer.offsetY} />
                  <line x1={85 + layer.offsetX} y1={30 + layer.offsetY} x2={85 + layer.offsetX} y2={90 + layer.offsetY} />
                  <line x1={25 + layer.offsetX} y1={50 + layer.offsetY} x2={105 + layer.offsetX} y2={50 + layer.offsetY} />
                  <line x1={25 + layer.offsetX} y1={70 + layer.offsetY} x2={105 + layer.offsetX} y2={70 + layer.offsetY} />
                </g>
              )}

              {/* Depth indicator on back layer - ALWAYS VISIBLE */}
              {layer.index === 0 && (
                <text x={65 + layer.offsetX} y={65 + layer.offsetY} textAnchor="middle" fontSize="11" fontWeight="700" fill={color} opacity="0.7">
                  ×{depth}
                </text>
              )}
            </g>
          ))}
        </g>

        {/* Type label */}
        <text x="65" y="18" textAnchor="middle" fontSize="10" fontWeight="700" fill="#6b7280" letterSpacing="0.5">TENSOR</text>

        {/* Shape and dtype display */}
        {(shape || dtype) && (
          <text x="65" y="135" textAnchor="middle" fontSize="9" fontWeight="500" fill="#9ca3af">
            {shape && <tspan fontFamily="monospace">{shape}</tspan>}
            {shape && dtype && <tspan> · </tspan>}
            {dtype && <tspan fontWeight="600">{dtype}</tspan>}
          </text>
        )}

        <text x="65" y={formulaLabel ? 147 : 150} textAnchor="middle" fontSize="11" fontWeight="500" fill="#374151">
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
