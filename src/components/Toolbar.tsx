import { useDiagramStore } from '@/diagram/DiagramState';
import { align, distribute, type AlignOp, type DistributeOp } from '@/diagram/alignment';
import { useTranslation } from 'react-i18next';

export default function Toolbar() {
  const nodes = useDiagramStore((s) => s.nodes);
  const setNodes = useDiagramStore((s) => s.setNodes);
  const { t, i18n } = useTranslation();

  const doAlign = (op: AlignOp) => setNodes(align(nodes, op));
  const doDistrib = (op: DistributeOp) => setNodes(distribute(nodes, op));

  const btn = 'text-xs px-2 py-1 rounded border hover:bg-gray-50';

  return (
    <div className="flex gap-2 items-center">
      <span className="text-xs text-gray-500">{t('toolbar.align')}</span>
      <button className={btn} onClick={() => doAlign('left')}>L</button>
      <button className={btn} onClick={() => doAlign('centerX')}>CX</button>
      <button className={btn} onClick={() => doAlign('right')}>R</button>
      <button className={btn} onClick={() => doAlign('top')}>T</button>
      <button className={btn} onClick={() => doAlign('centerY')}>CY</button>
      <button className={btn} onClick={() => doAlign('bottom')}>B</button>
      <span className="mx-1" />
      <span className="text-xs text-gray-500">{t('toolbar.distribute')}</span>
      <button className={btn} onClick={() => doDistrib('horiz')}>H</button>
      <button className={btn} onClick={() => doDistrib('vert')}>V</button>
      <span className="ml-3" />
      <span className="text-xs text-gray-500">{t('toolbar.language')}:</span>
      <select className={btn} value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)}>
        <option value="zh">中文</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}

