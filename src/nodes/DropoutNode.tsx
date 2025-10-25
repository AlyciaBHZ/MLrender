import { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { hexToRgba } from '@/utils/color';
import MathText from '@/components/MathText';
import NodeMarker from '@/components/NodeMarker';
import { NodeRoleColor } from '@/ui/tokens';

export type DropoutNodeData = {
  label?: string;
  color?: string;
  formulaLabel?: string;
  dropoutRate?: number; // e.g., 0.5 for 50%
  visualizeDropped?: boolean; // Show which neurons are "dropped"
  seed?: string; // Deterministic PRNG seed (defaults to node ID)
};

// Simple deterministic PRNG (xorshift algorithm)
function deterministicRandom(seed: string, index: number): number {
  let x = 0;
  for (let i = 0; i < seed.length; i++) {
    x = ((x << 5) - x) + seed.charCodeAt(i);
    x = x & x; // Convert to 32-bit integer
  }
  x = x ^ index;
  x = x ^ (x << 13);
  x = x ^ (x >>> 17);
  x = x ^ (x << 5);
  return ((x >>> 0) / 4294967296); // Normalize to [0,1]
}

export default function DropoutNode({ data, selected, id }: NodeProps<DropoutNodeData>) {
  const label = data?.label ?? 'Dropout';
  const formulaLabel = data?.formulaLabel;
  const color = data?.color ?? NodeRoleColor.dropout;
  const dropoutRate = data?.dropoutRate ?? 0.5;
  const visualizeDropped = data?.visualizeDropped ?? true;
  const seed = data?.seed ?? id; // Use node ID as default seed for determinism

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

  // Generate neurons - DETERMINISTIC based on seed (prevents flicker)
  const neurons = useMemo(() => {
    const result: { cx: number; cy: number; dropped: boolean }[] = [];
    const gridSize = 8; // 8x4 grid of neurons
    const spacing = 15;
    const startX = 20;
    const startY = 30;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < gridSize; col++) {
        const index = row * gridSize + col;
        const dropped = visualizeDropped && deterministicRandom(seed, index) < dropoutRate;
        result.push({
          cx: startX + col * spacing,
          cy: startY + row * spacing,
          dropped,
        });
      }
    }
    return result;
  }, [dropoutRate, visualizeDropped, seed]);

  return (
    <div className="px-2 py-2 min-w-[140px] min-h-[100px] w-full h-full relative select-none flex flex-col items-center justify-center" style={containerStyle} data-node-type="dropout" data-type="dropout" data-role="func" aria-label={label}>
      <NodeResizer minWidth={140} minHeight={100} isVisible={selected} />
      <NodeMarker variant={'dropout'} />

      {/* Dropout visualization (academic standard - dashed border with sparse dots) */}
      <svg viewBox="0 0 140 110" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`dropoutGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.08 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.03 }} />
          </linearGradient>
          <filter id={`dropoutShadow-${color}`}>
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.12" />
          </filter>
        </defs>

        <g data-selected={selected ? 'true' : undefined}>
          {/* Dashed rectangle showing regularization/masking */}
          <rect
            x="10"
            y="20"
            width="120"
            height="65"
            rx="6"
            fill={`url(#dropoutGrad-${color})`}
            stroke={color}
            strokeWidth="2.5"
            strokeDasharray="6 4"
            filter={`url(#dropoutShadow-${color})`}
          />

          {/* Neuron grid with crossed-out dropped neurons (academic standard from designer spec) */}
          {neurons.map((neuron, i) => (
            <g key={i}>
              <circle
                cx={neuron.cx}
                cy={neuron.cy}
                r={3.5}
                fill={neuron.dropped ? '#ffffff' : color}
                stroke={color}
                strokeWidth="1.5"
                opacity={neuron.dropped ? 0.3 : 0.75}
              />
              {neuron.dropped && (
                // Cross out dropped neurons with X
                <g stroke="#333" strokeWidth="1.5" opacity="0.6">
                  <line x1={neuron.cx - 3} y1={neuron.cy - 3} x2={neuron.cx + 3} y2={neuron.cy + 3} />
                  <line x1={neuron.cx + 3} y1={neuron.cy - 3} x2={neuron.cx - 3} y2={neuron.cy + 3} />
                </g>
              )}
            </g>
          ))}

          {/* Probability indicator */}
          <g opacity="0.6">
            <text x="70" y="98" textAnchor="middle" fontSize="9" fontWeight="600" fill={color} fontFamily="monospace">
              p={dropoutRate.toFixed(2)}
            </text>
          </g>
        </g>

        {/* Type label */}
        <text x="70" y="14" textAnchor="middle" fontSize="10" fontWeight="700" fill="#6b7280" letterSpacing="0.5">
          DROPOUT
        </text>

        <text x="70" y={formulaLabel ? 105 : 108} textAnchor="middle" fontSize="11" fontWeight="500" fill="#374151">
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
