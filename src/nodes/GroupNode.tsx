import { useMemo } from 'react';
import type { NodeProps } from 'reactflow';
import { NodeResizer } from '@reactflow/node-resizer';
import { hexToRgba } from '@/utils/color';
import { NodeRoleColor } from '@/ui/tokens';

export type GroupNodeData = {
  label?: string;
  color?: string;
  collapsible?: boolean; // Whether group can be collapsed
  collapsed?: boolean; // Current collapse state
  subtitle?: string; // Optional subtitle for group
};

export default function GroupNode({ id, data, selected }: NodeProps<GroupNodeData>) {
  const label = data?.label ?? 'Group';
  const color = data?.color ?? NodeRoleColor.group;
  const subtitle = data?.subtitle;
  const collapsible = data?.collapsible ?? false;
  const collapsed = data?.collapsed ?? false;

  const containerStyle = useMemo(() => ({
    borderColor: color,
    backgroundColor: hexToRgba(color, 0.03),
    width: '100%',
    height: '100%',
    boxShadow: selected
      ? `0 0 0 3px hsl(var(--mlcd-hover) / 0.15), 0 2px 8px ${hexToRgba(color, 0.1)}`
      : `0 1px 4px ${hexToRgba(color, 0.08)}`,
    borderStyle: 'dashed' as const,
    borderWidth: 2.5,
    borderRadius: 12,
    transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
  }), [color, selected]);

  const labelId = `group-label-${id}`;
  const headerBgStyle = useMemo(() => ({
    backgroundColor: hexToRgba(color, 0.08),
    borderColor: color,
  }), [color]);

  return (
    <div
      className="rounded-[12px] border bg-white/40 px-2 py-2 min-w-[180px] min-h-[120px] relative select-none"
      style={containerStyle}
      data-node-type="group"
      data-type="group"
      data-role="template"
      role="group"
      aria-labelledby={labelId}
      aria-label={label}
    >
      <NodeResizer minWidth={180} minHeight={120} isVisible={selected} />

      {/* Enhanced header bar with gradient and better styling */}
      <div
        className="absolute left-3 right-3 top-2 px-3 py-2 rounded-lg border flex items-center justify-between shadow-sm"
        style={headerBgStyle}
      >
        <div className="flex-1">
          <div id={labelId} className="text-xs font-semibold" style={{ color }}>
            {label}
          </div>
          {subtitle && (
            <div className="text-[9px] text-gray-500 mt-0.5 font-medium">
              {subtitle}
            </div>
          )}
        </div>

        {collapsible && (
          <div className="text-xs font-bold ml-2" style={{ color, opacity: 0.6 }}>
            {collapsed ? '-' : '+'}
          </div>
        )}
      </div>

      {/* Corner decorations removed to avoid invalid SVG paths */}
    </div>
  );
}



