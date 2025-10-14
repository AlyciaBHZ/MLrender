import { useDiagramStore } from '@/diagram/DiagramState';
import { align, distribute, type AlignOp, type DistributeOp } from '@/diagram/alignment';

// 中文说明：对齐/分布工具栏，操作当前选中节点
export default function Toolbar() {
  const nodes = useDiagramStore((s) => s.nodes);
  const setNodes = useDiagramStore((s) => s.setNodes);

  const doAlign = (op: AlignOp) => setNodes(align(nodes, op));
  const doDistrib = (op: DistributeOp) => setNodes(distribute(nodes, op));

  const btn = 'text-xs px-2 py-1 rounded border hover:bg-gray-50';

  return (
    <div className="flex gap-2 items-center">
      <span className="text-xs text-gray-500">对齐</span>
      <button className={btn} onClick={() => doAlign('left')}>左</button>
      <button className={btn} onClick={() => doAlign('centerX')}>水平居中</button>
      <button className={btn} onClick={() => doAlign('right')}>右</button>
      <button className={btn} onClick={() => doAlign('top')}>上</button>
      <button className={btn} onClick={() => doAlign('centerY')}>垂直居中</button>
      <button className={btn} onClick={() => doAlign('bottom')}>下</button>
      <span className="mx-1" />
      <span className="text-xs text-gray-500">分布</span>
      <button className={btn} onClick={() => doDistrib('horiz')}>水平</button>
      <button className={btn} onClick={() => doDistrib('vert')}>垂直</button>
    </div>
  );
}
