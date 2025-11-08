import { useMemo } from 'react';
import type { NodeProps } from 'reactflow';
import { Handle, Position } from 'reactflow';
import { NodeRoleColor } from '@/ui/tokens';
import { hexToRgba } from '@/utils/color';
import MathText from '@/components/MathText';
import NodeMarker from '@/components/NodeMarker';

export type RNNNodeData = {
  label?: string;
  color?: string;
  formulaLabel?: string;
  cellType?: 'RNN' | 'LSTM' | 'GRU';
  hiddenSize?: number;
  numLayers?: number;
  bidirectional?: boolean;
  dropout?: number;
};

export default function RNNNode({ data, selected }: NodeProps<RNNNodeData>) {
  const label = data.label || 'RNN';
  const formulaLabel = data.formulaLabel;
  const color = data.color || NodeRoleColor.rnn;
  const cellType = data.cellType || 'LSTM';
  const hiddenSize = data.hiddenSize || 256;
  const numLayers = data.numLayers || 2;
  const bidirectional = data.bidirectional ?? false;
  const dropout = data.dropout ?? 0.2;

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
      aria-label={`${cellType} node: ${label}`}
      data-node-type="rnn"
      data-cell-type={cellType.toLowerCase()}
    >
      {/* Corner Marker */}
      <div className="absolute top-1 left-1 pointer-events-none">
        <NodeMarker variant="rnn" />
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

      {/* SVG Visualization */}
      <svg
        viewBox="0 0 140 100"
        className="absolute inset-0"
        style={{ pointerEvents: 'none' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient for cell */}
          <linearGradient id={`rnn-grad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.15 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.05 }} />
          </linearGradient>
          
          {/* Drop shadow filter */}
          <filter id={`rnn-shadow-${color}`}>
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.2" />
          </filter>

          {/* Arrow marker */}
          <marker
            id={`rnn-arrow-${color}`}
            markerWidth="6"
            markerHeight="6"
            refX="5"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L6,3 L0,6 Z" fill={color} />
          </marker>
        </defs>

        {cellType === 'RNN' && (
          <g filter={`url(#rnn-shadow-${color})`}>
            {/* Simple RNN: Box with recurrent loop */}
            <rect
              x="50"
              y="40"
              width="40"
              height="25"
              rx="4"
              fill={`url(#rnn-grad-${color})`}
              stroke={color}
              strokeWidth="2"
            />
            
            {/* Recurrent loop arrow */}
            <path
              d="M70,40 C85,25 85,80 70,65"
              stroke={color}
              strokeWidth="2"
              fill="none"
              markerEnd={`url(#rnn-arrow-${color})`}
              opacity="0.8"
            />
            
            {/* Input arrow */}
            <path
              d="M30,52 L50,52"
              stroke={color}
              strokeWidth="1.5"
              markerEnd={`url(#rnn-arrow-${color})`}
              opacity="0.6"
            />
            
            {/* Output arrow */}
            <path
              d="M90,52 L110,52"
              stroke={color}
              strokeWidth="1.5"
              markerEnd={`url(#rnn-arrow-${color})`}
              opacity="0.6"
            />
            
            {/* h_t label */}
            <text x="70" y="55" fontSize="11" fontWeight="600" fill={color} textAnchor="middle">
              h<tspan fontSize="8" dy="2">t</tspan>
            </text>
          </g>
        )}

        {cellType === 'LSTM' && (
          <g filter={`url(#rnn-shadow-${color})`}>
            {/* LSTM: Cell state pathway with gates */}
            {/* Cell state highway */}
            <rect
              x="45"
              y="45"
              width="50"
              height="8"
              rx="4"
              fill={color}
              fillOpacity="0.15"
              stroke={color}
              strokeWidth="1.5"
            />
            
            {/* Forget Gate (F) */}
            <circle cx="35" cy="35" r="6" fill="#A7CEE7" fillOpacity="0.6" stroke={color} strokeWidth="1.5" />
            <text x="35" y="38" fontSize="8" fontWeight="700" fill={color} textAnchor="middle">F</text>
            
            {/* Input Gate (I) */}
            <circle cx="35" cy="49" r="6" fill="#B6DDBF" fillOpacity="0.6" stroke={color} strokeWidth="1.5" />
            <text x="35" y="52" fontSize="8" fontWeight="700" fill={color} textAnchor="middle">I</text>
            
            {/* Output Gate (O) */}
            <circle cx="35" cy="63" r="6" fill="#F8E5A0" fillOpacity="0.6" stroke={color} strokeWidth="1.5" />
            <text x="35" y="66" fontSize="8" fontWeight="700" fill={color} textAnchor="middle">O</text>
            
            {/* Gate connections */}
            <path d="M41,49 L45,49" stroke={color} strokeWidth="1" opacity="0.6" />
            
            {/* Cell state label */}
            <text x="70" y="53" fontSize="7" fill={color} opacity="0.7" textAnchor="middle">
              c<tspan fontSize="5" dy="1">t</tspan>
            </text>
          </g>
        )}

        {cellType === 'GRU' && (
          <g filter={`url(#rnn-shadow-${color})`}>
            {/* GRU: Update and Reset gates */}
            {/* Hidden state box */}
            <rect
              x="55"
              y="45"
              width="40"
              height="14"
              rx="3"
              fill={`url(#rnn-grad-${color})`}
              stroke={color}
              strokeWidth="2"
            />
            
            {/* Update Gate (U) */}
            <circle cx="38" cy="40" r="6" fill="#D4DDEE" fillOpacity="0.6" stroke={color} strokeWidth="1.5" />
            <text x="38" y="43" fontSize="8" fontWeight="700" fill={color} textAnchor="middle">U</text>
            
            {/* Reset Gate (R) */}
            <circle cx="38" cy="58" r="6" fill="#E6DDE4" fillOpacity="0.6" stroke={color} strokeWidth="1.5" />
            <text x="38" y="61" fontSize="8" fontWeight="700" fill={color} textAnchor="middle">R</text>
            
            {/* Gate connections */}
            <path d="M44,49 L55,52" stroke={color} strokeWidth="1" opacity="0.6" />
            
            {/* Hidden state label */}
            <text x="75" y="55" fontSize="9" fontWeight="600" fill={color} textAnchor="middle">
              h<tspan fontSize="7" dy="2">t</tspan>
            </text>
          </g>
        )}

        {/* Bidirectional indicator */}
        {bidirectional && (
          <g opacity="0.8">
            <path
              d="M25,30 L115,30"
              stroke={color}
              strokeWidth="1.5"
              strokeDasharray="3,2"
              opacity="0.5"
            />
            <path
              d="M25,70 L115,70"
              stroke={color}
              strokeWidth="1.5"
              strokeDasharray="3,2"
              opacity="0.5"
            />
            <text x="70" y="24" fontSize="7" fill={color} fontWeight="600" textAnchor="middle">
              ⇄
            </text>
          </g>
        )}

        {/* Layers indicator */}
        {numLayers > 1 && (
          <text
            x="105"
            y="25"
            fontSize="8"
            fontWeight="600"
            fill={color}
            opacity="0.8"
          >
            ×{numLayers}
          </text>
        )}
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

      {/* Parameter info */}
      <div className="absolute top-2 right-2 text-[7px] text-gray-600 opacity-70 font-mono leading-tight text-right">
        <div>{cellType}</div>
        <div>h={hiddenSize}</div>
        {dropout > 0 && <div>p={dropout.toFixed(2)}</div>}
      </div>
    </div>
  );
}


