import { NodeResizer } from '@reactflow/node-resizer';
import NodeMarker from '@/components/NodeMarker';
import { hexToRgba } from '@/utils/color';
import type React from 'react';

type Props = {
  label?: string;
  color?: string;
  selected: boolean;
  minWidth: number;
  minHeight: number;
  markerVariant?: string;
  role?: string;
  typeAttr?: string;
  containerClassName?: string;
  style?: React.CSSProperties;
  dataAttrs?: Record<string, string>;
  children: React.ReactNode;
  elevation?: 'low' | 'mid' | 'high';
  typeRibbonLabel?: string;
  showTypeRibbon?: boolean;
};

export default function NodeView({
  label,
  color: _color, // reserved for consumers to compute styles; unused here
  selected,
  minWidth,
  minHeight,
  markerVariant,
  role = 'core',
  typeAttr,
  containerClassName,
  style,
  dataAttrs,
  children,
  elevation = 'mid',
  typeRibbonLabel,
  showTypeRibbon = true,
}: Props) {
  const base = 'relative select-none w-full h-full';
  const cls = containerClassName ? `${base} ${containerClassName}` : base;
  const attrs: any = {
    'data-role': role,
    'aria-label': label,
  };
  if (typeAttr) attrs['data-type'] = typeAttr;
  if (dataAttrs) Object.assign(attrs, Object.fromEntries(Object.entries(dataAttrs).map(([k, v]) => [`data-${k}`, v])));

  // Compute a consistent shadow elevation if color was provided via style.background or consumer intent
  // We do not force background; we only normalize shadow/elevation.
  let mergedStyle: React.CSSProperties | undefined = style;
  try {
    const color = (style as any)?.borderColor || (style as any)?.shadowColor || undefined;
    const c = typeof color === 'string' ? color : undefined;
    const low = c ? `0 2px 8px ${hexToRgba(c, 0.12)}` : undefined;
    const mid = c ? `0 3px 10px ${hexToRgba(c, 0.15)}` : undefined;
    const high = c ? `0 0 0 3px hsl(var(--mlcd-hover) / 0.25), 0 6px 16px ${hexToRgba(c, 0.25)}` : undefined;
    const boxShadow = selected ? (high || (style as any)?.boxShadow) : (elevation === 'low' ? (low || (style as any)?.boxShadow) : (mid || (style as any)?.boxShadow));
    mergedStyle = { ...(style || {}), boxShadow } as React.CSSProperties;
  } catch {
    mergedStyle = style;
  }

  return (
    <div className={cls} style={mergedStyle} {...attrs}>
      <NodeResizer minWidth={minWidth} minHeight={minHeight} isVisible={selected} />
      {markerVariant && <NodeMarker variant={markerVariant} />}
      {showTypeRibbon && typeRibbonLabel && (
        <div className="absolute top-0 left-0 right-0 h-5 px-2 text-[10px] font-semibold tracking-wide text-gray-700/90 bg-white/85 border-b">
          {typeRibbonLabel}
        </div>
      )}
      {children}
    </div>
  );
}
