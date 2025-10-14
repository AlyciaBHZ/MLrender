import { BaseEdge, getBezierPath, type EdgeProps } from 'reactflow';

// 中文说明：残差连接自定义边，虚线 + 中间圆点标记
export default function ResidualEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style } = props;
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={{ strokeDasharray: '6 4', ...(style || {}) }} />
      {/* 中间标记点 */}
      <circle cx={labelX} cy={labelY} r={4} fill={(style as any)?.stroke || '#111827'} />
    </>
  );
}
