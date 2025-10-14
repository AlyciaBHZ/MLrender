import { BaseEdge, getStraightPath, type EdgeProps } from 'reactflow';

// 中文说明：简单直线箭头边（Simple Arrow），使用直线路径，样式跟随 edge.style
export default function SimpleArrowEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, style } = props;
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  return <BaseEdge id={id} path={edgePath} style={style} />;
}
