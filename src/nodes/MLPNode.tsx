import { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { hexToRgba } from '@/utils/color';
import MathText from '@/components/MathText';
import NodeMarker from '@/components/NodeMarker';
import { NodeRoleColor } from '@/ui/tokens';

export type MLPNodeData = {
  label?: string;
  color?: string;
  neuronRows?: number;
  neuronCols?: number;
  formulaLabel?: string;
  layerWidths?: number[]; // e.g., [512, 256, 128, 10]
  showConnections?: boolean; // Toggle connection density
};

export default function MLPNode({ data, selected }: NodeProps<MLPNodeData>) {
  const label = data?.label ?? 'MLP Block';
  const formulaLabel = data?.formulaLabel;
  const color = data?.color ?? NodeRoleColor.fc;
  const rows = Math.max(3, Math.min(5, data?.neuronRows ?? 4));
  const cols = Math.max(3, Math.min(5, data?.neuronCols ?? 4));
  const showConnections = data?.showConnections ?? true;
  const layerWidths = data?.layerWidths;

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

  // Generate neurons for each layer
  const layerPositions = [30, 60, 90, 120]; // X positions for layers
  const neurons: { x: number; y: number; layer: number }[] = [];

  layerPositions.slice(0, cols).forEach((x, layerIdx) => {
    const neuronsInLayer = layerIdx === 0 || layerIdx === cols - 1 ? rows : rows - 1;
    for (let i = 0; i < neuronsInLayer; i++) {
      const y = 25 + (70 / (neuronsInLayer - 1)) * i;
      neurons.push({ x, y, layer: layerIdx });
    }
  });

  // Generate connections between layers
  const connections: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let layer = 0; layer < cols - 1; layer++) {
    const currentLayer = neurons.filter(n => n.layer === layer);
    const nextLayer = neurons.filter(n => n.layer === layer + 1);

    currentLayer.forEach(n1 => {
      nextLayer.forEach(n2 => {
        connections.push({ x1: n1.x, y1: n1.y, x2: n2.x, y2: n2.y });
      });
    });
  }

  return (
    <div className="px-2 py-2 min-w-[160px] min-h-[120px] w-full h-full relative select-none flex flex-col items-center justify-center" style={containerStyle} data-node-type="mlp" data-type="mlp" data-role="core" aria-label={label}>
      <NodeResizer minWidth={160} minHeight={120} isVisible={selected} />
      <NodeMarker variant={'fc'} />

      {/* Multi-layer perceptron visualization (academic neural network style) */}
      <svg viewBox="0 0 150 125" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`mlpGrad-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.15 }} />
            <stop offset="50%" style={{ stopColor: color, stopOpacity: 0.08 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.15 }} />
          </linearGradient>
          <filter id={`mlpShadow-${color}`}>
            <feDropShadow dx="0" dy="1.5" stdDeviation="2" floodOpacity="0.15" />
          </filter>
        </defs>

        <g data-selected={selected ? 'true' : undefined}>
          {/* Background container with academic paper-style border */}
          <rect
            x="10"
            y="18"
            width="130"
            height="80"
            rx="6"
            fill={`url(#mlpGrad-${color})`}
            stroke={color}
            strokeWidth="2.8"
            filter={`url(#mlpShadow-${color})`}
          />

          {/* Connections between neurons (if enabled) */}
          {showConnections && (
            <g opacity="0.18" stroke={color} strokeWidth="0.6">
              {connections.map((conn, i) => (
                <line key={i} x1={conn.x1} y1={conn.y1} x2={conn.x2} y2={conn.y2} />
              ))}
            </g>
          )}

          {/* Neurons with better visibility */}
          {neurons.map((neuron, i) => (
            <circle
              key={i}
              cx={neuron.x}
              cy={neuron.y}
              r={4.5}
              fill={neuron.layer === 0 || neuron.layer === cols - 1 ? color : 'white'}
              stroke={color}
              strokeWidth="2"
              opacity={neuron.layer === 0 || neuron.layer === cols - 1 ? 1 : 0.85}
            />
          ))}

          {/* Layer dimension labels (if layerWidths provided) */}
          {layerWidths && layerWidths.length === cols && (
            <g fill="#6b7280" fontSize="7" fontWeight="600" fontFamily="monospace">
              {layerWidths.map((width, idx) => {
                const xPos = layerPositions[idx];
                return (
                  <text key={idx} x={xPos} y="108" textAnchor="middle" opacity="0.7">
                    {width}
                  </text>
                );
              })}
            </g>
          )}

          {/* Layer type labels */}
          <g fill="#9ca3af" fontSize="7" fontWeight="500" opacity="0.6">
            <text x="30" y={layerWidths ? "116" : "108"} textAnchor="middle">In</text>
            <text x="75" y={layerWidths ? "116" : "108"} textAnchor="middle">Hidden</text>
            <text x="120" y={layerWidths ? "116" : "108"} textAnchor="middle">Out</text>
          </g>
        </g>

        {/* Type label */}
        <text x="75" y="13" textAnchor="middle" fontSize="10" fontWeight="700" fill="#6b7280" letterSpacing="0.5">MLP</text>

        {/* Layer configuration display */}
        {layerWidths && (
          <text x="75" y="102" textAnchor="middle" fontSize="8" fontWeight="600" fill={color} opacity="0.5" fontFamily="monospace">
            {layerWidths.join('→')}
          </text>
        )}

        <text x="75" y={formulaLabel ? 120 : 123} textAnchor="middle" fontSize="11" fontWeight="500" fill="#374151">
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
