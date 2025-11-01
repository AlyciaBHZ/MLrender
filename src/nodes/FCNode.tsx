import { useMemo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { hexToRgba, resolveNodeColor } from '@/utils/color';
import MathText from '@/components/MathText';
import NodeView from '@/nodes/common/NodeView';
import { HANDLE_CLASS } from '@/nodes/common/ports';
import { useDiagramStore } from '@/diagram/DiagramState';

export type FCNodeData = {
  label?: string;
  color?: string;
  formulaLabel?: string;
  variant?: string;
  inputDim?: number;
  outputDim?: number;
  units?: number;
  bias?: boolean;
  height?: number;
};

export default function FCNode({ data, selected }: NodeProps<FCNodeData>) {
  const semanticLocked = useDiagramStore((s) => s.semanticColorsLocked);
  const label = data?.label ?? 'FC Layer';
  const formulaLabel = data?.formulaLabel;
  const color = resolveNodeColor('#4169E1', data, semanticLocked);
  const variant: string | undefined = data?.variant ?? 'fc';
  const inputDim = data?.inputDim;
  const outputDim = data?.outputDim;
  const units = Math.max(1, Math.min(64, Number(data?.units ?? 0))) || undefined;
  const bias = Boolean(data?.bias);

  const containerStyle = useMemo(
    () => ({
      borderColor: color,
      backgroundColor: hexToRgba(color, 0.08),
      shadowColor: color,
    }),
    [color]
  );

  const handleStyle = useMemo(() => ({ backgroundColor: color }), [color]);

  const neuronLines = useMemo(() => {
    const lines: { x: number; key: number }[] = [];
    const lineCount = 7;
    for (let i = 0; i < lineCount; i++) {
      const x = 15 + (70 / (lineCount - 1)) * i;
      lines.push({ x, key: i });
    }
    return lines;
  }, []);

  return (
    <NodeView
      label={label}
      color={color}
      selected={selected}
      minWidth={80}
      minHeight={120}
      markerVariant={variant}
      role="core"
      typeAttr="fc"
      typeRibbonLabel="DENSE"
      containerClassName="rounded-md border-2 bg-white px-4 py-3 min-w-[80px] min-h-[120px] flex flex-col items-center justify-center transition-shadow duration-200"
      style={containerStyle}
      elevation="mid"
    >
      <svg className="absolute inset-2" viewBox="0 0 100 140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`fcGrad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.15 }} />
            <stop offset="50%" style={{ stopColor: color, stopOpacity: 0.25 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0.15 }} />
          </linearGradient>
        </defs>
        {units ? (
          <g fill={color} opacity="0.28">
            {(() => {
              const dots: any[] = [];
              const cols = Math.min(8, Math.max(3, Math.ceil(Math.sqrt(units))));
              const rows = Math.min(8, Math.max(3, Math.ceil(units / cols)));
              const startX = 20, endX = 80, startY = 20, endY = 120;
              const dx = (endX - startX) / Math.max(1, cols - 1);
              const dy = (endY - startY) / Math.max(1, rows - 1);
              let count = 0;
              for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                  if (count++ >= units) break;
                  const cx = startX + dx * c;
                  const cy = startY + dy * r;
                  dots.push(<circle key={`d-${r}-${c}`} cx={cx} cy={cy} r={2.2} />);
                }
              }
              return dots;
            })()}
          </g>
        ) : (
          <g>
            {neuronLines.map((line) => (
              <line
                key={line.key}
                x1={line.x}
                y1="12"
                x2={line.x}
                y2="128"
                stroke={`url(#fcGrad-${color})`}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ))}
          </g>
        )}
      </svg>

      <div className="relative z-10 text-center space-y-1">
        {(inputDim || outputDim) && (
          <div className="text-[10px] font-mono text-gray-400 mb-2">
            {inputDim && <span>In: {inputDim}</span>}
            {inputDim && outputDim && <span className="mx-1">→</span>}
            {outputDim && <span>Out: {outputDim}</span>}
          </div>
        )}

        <div className="text-xs font-semibold text-gray-500 tracking-wide">DENSE{bias ? ' +b' : ''}</div>
        <div className="text-sm font-medium text-gray-800 break-words px-1" title={label}>
          {formulaLabel ? <MathText text={formulaLabel} enabled /> : label}
        </div>
      </div>

      <Handle type="target" position={Position.Top} className={HANDLE_CLASS} style={handleStyle} data-port="in" data-slot="0" />
      <Handle type="source" position={Position.Bottom} className={HANDLE_CLASS} style={handleStyle} data-port="out" data-slot="0" />
    </NodeView>
  );
}

