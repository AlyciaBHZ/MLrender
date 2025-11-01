import { BaseEdge, getStraightPath, type EdgeProps } from 'reactflow';

// Simple straight edge. Visuals are controlled via edge.style (color, width, etc.).
export default function SimpleArrowEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, style } = props;
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  return <BaseEdge id={id} path={edgePath} style={style} />;
}

