import React from 'react';
import { BaseEdge, getBezierPath, type EdgeProps } from 'reactflow';

export default function ResidualEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style } = props;
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const dashedStyle = {
    stroke: 'hsl(var(--mlcd-data))',
    strokeDasharray: '4 3',
    strokeWidth: 1.25,
    ...(style || {}),
  } as React.CSSProperties;

  return (
    <g data-kind="residual">
      <BaseEdge id={id} path={edgePath} style={dashedStyle} />
    </g>
  );
}

