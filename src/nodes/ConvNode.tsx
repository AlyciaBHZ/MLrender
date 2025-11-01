import { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { hexToRgba } from '@/utils/color';
import { NodeRoleColor } from '@/ui/tokens';
import { resolveNodeColor } from '@/utils/color';
import { useDiagramStore } from '@/diagram/DiagramState';
import NodeView from '@/nodes/common/NodeView';
import MathText from '@/components/MathText';
import { HANDLE_CLASS } from '@/nodes/common/ports';

export type ConvNodeData = {
  label?: string;
  color?: string;
  formulaLabel?: string;
  kernelSize?: string; // e.g., "3×3" (legacy)
  kernel?: number;
  channels?: number; // Output channels
  stride?: number;
  dilation?: number;
  padding?: number;
};

export default function ConvNode({ data, selected }: NodeProps<ConvNodeData>) {
  const semanticLocked = useDiagramStore((s) => s.semanticColorsLocked);
  const label = data?.label ?? 'Conv2D';
  const formulaLabel = data?.formulaLabel;
  const color = resolveNodeColor(NodeRoleColor.conv, data, semanticLocked);
  const kernelSize = typeof (data as any)?.kernel === 'number'
    ? `${(data as any).kernel}×${(data as any).kernel}`
    : (data?.kernelSize ?? '3×3');
  const channels = data?.channels;
  const stride = data?.stride;
  const dilation = data?.dilation;
  const padding = data?.padding;

  const containerStyle = useMemo(
    () => ({
      backgroundColor: 'transparent',
      shadowColor: color,
    } as React.CSSProperties),
    [color]
  );
  const handleStyle = useMemo(() => ({ backgroundColor: color }), [color]);

  return (
    <NodeView
      label={label}
      color={color}
      selected={selected}
      minWidth={140}
      minHeight={160}
      role="core"
      typeAttr="conv"
      typeRibbonLabel="CONV2D"
      containerClassName="px-2 py-2 min-w-[140px] min-h-[160px] flex flex-col items-center justify-center"
      style={containerStyle}
      elevation="mid"
    >
      {/* 3D Cuboid representation */}
      <svg viewBox="0 0 160 150" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={`convGrad-top-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.8 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.4 }} />
          </linearGradient>
          <linearGradient id={`convGrad-side-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.5 }} />
          </linearGradient>
          <filter id={`shadow-${color}`}>
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
          </filter>
        </defs>

        <g data-selected={selected ? 'true' : undefined}>
          {/* Back face */}
          <path d="M 50 35 L 130 35 L 130 85 L 50 85 Z" fill={hexToRgba(color, 0.12)} stroke={color} strokeWidth="1.8" opacity="0.7" />
          {/* Top face */}
          <path d="M 30 25 L 110 25 L 130 35 L 50 35 Z" fill={`url(#convGrad-top-${color})`} stroke={color} strokeWidth="2" />
          {/* Left face */}
          <path d="M 30 25 L 30 75 L 50 85 L 50 35 Z" fill={`url(#convGrad-side-${color})`} stroke={color} strokeWidth="2" />
          {/* Front face */}
          <rect x="30" y="75" width="80" height="50" rx="3" fill="white" stroke={color} strokeWidth="2.8" filter={`url(#shadow-${color})`} />
          {/* Grid on front face */}
          <g opacity="0.65" stroke={color} strokeWidth="1.5">
            <line x1="50" y1="75" x2="50" y2="125" />
            <line x1="70" y1="75" x2="70" y2="125" />
            <line x1="90" y1="75" x2="90" y2="125" />
            <line x1="30" y1="90" x2="110" y2="90" />
            <line x1="30" y1="105" x2="110" y2="105" />
          </g>
          {/* Kernel size indicator */}
          <text x="70" y="102" textAnchor="middle" fontSize="10" fontWeight="700" fill={color} opacity="0.85">{kernelSize}</text>
        </g>

        {/* Labels */}
        {(channels || stride || typeof dilation === 'number' || typeof padding === 'number') && (
          <text x="80" y="145" textAnchor="middle" fontSize="9" fontWeight="500" fill="#9ca3af">
            {channels && `C=${channels}`}
            {(channels && (stride || typeof dilation === 'number' || typeof padding === 'number')) && ' · '}
            {stride && `S=${stride}`}
            {(stride && (typeof dilation === 'number' || typeof padding === 'number')) && ' · '}
            {typeof dilation === 'number' && `D=${dilation}`}
            {(typeof dilation === 'number' && typeof padding === 'number') && ' · '}
            {typeof padding === 'number' && `P=${padding}`}
          </text>
        )}
        <text x="80" y={formulaLabel ? 138 : 148} textAnchor="middle" fontSize="11" fontWeight="500" fill="#374151">{formulaLabel ? '' : label}</text>
      </svg>

      {formulaLabel && (
        <div className="absolute bottom-1 text-sm font-medium text-gray-800" title={label}>
          <MathText text={formulaLabel} enabled />
        </div>
      )}

      <Handle type="target" position={Position.Left} className={HANDLE_CLASS} style={handleStyle} data-port="in" data-slot="0" />
      <Handle type="source" position={Position.Right} className={HANDLE_CLASS} style={handleStyle} data-port="out" data-slot="0" />
    </NodeView>
  );
}
