import { useDiagramStore } from '@/diagram/DiagramState';
import { align, distribute, type AlignOp, type DistributeOp, AlignLeft, AlignTop, DistributeHorizontal, DistributeVertical } from '@/diagram/alignment';
import { useTranslation } from 'react-i18next';

export default function Toolbar() {
  const nodes = useDiagramStore((s) => s.nodes);
  const setNodes = useDiagramStore((s) => s.setNodes);
  const undo = useDiagramStore((s) => s.undo);
  const redo = useDiagramStore((s) => s.redo);
  const groupSelectedIntoNewGroup = useDiagramStore((s) => s.groupSelectedIntoNewGroup);
  const ungroupSelected = useDiagramStore((s) => s.ungroupSelected);
  const { t, i18n } = useTranslation();

  const doAlign = (op: AlignOp) => setNodes(align(nodes, op));
  const doDistrib = (op: DistributeOp) => setNodes(distribute(nodes, op));

  const btn = 'text-xs px-2 py-1 rounded border hover:bg-gray-50';

  return (
    <div className="flex gap-2 items-center">
      {/* Align group (icons) */}
      <div className="flex items-center gap-1">
        <button className={btn} title="Align Left" onClick={AlignLeft}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4v16"/>
            <rect x="6" y="6" width="12" height="4"/>
            <rect x="6" y="14" width="8" height="4"/>
          </svg>
        </button>
        <button className={btn} title="Align Center X" onClick={() => doAlign('centerX')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v18"/>
            <rect x="6" y="6" width="12" height="4"/>
            <rect x="8" y="14" width="8" height="4"/>
          </svg>
        </button>
        <button className={btn} title="Align Right" onClick={() => doAlign('right')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 4v16"/>
            <rect x="6" y="6" width="12" height="4"/>
            <rect x="10" y="14" width="8" height="4"/>
          </svg>
        </button>
      </div>
      {/* Vertical align group */}
      <div className="flex items-center gap-1">
        <button className={btn} title="Align Top" onClick={AlignTop}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16"/>
            <rect x="6" y="6" width="4" height="8"/>
            <rect x="14" y="6" width="4" height="12"/>
          </svg>
        </button>
        <button className={btn} title="Align Center Y" onClick={() => doAlign('centerY')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18"/>
            <rect x="6" y="6" width="4" height="12"/>
            <rect x="14" y="8" width="4" height="8"/>
          </svg>
        </button>
        <button className={btn} title="Align Bottom" onClick={() => doAlign('bottom')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 20h16"/>
            <rect x="6" y="6" width="4" height="12"/>
            <rect x="14" y="10" width="4" height="8"/>
          </svg>
        </button>
      </div>
      {/* Distribute group */}
      <div className="flex items-center gap-1">
        <button className={btn} title="Distribute Horizontally" onClick={DistributeHorizontal}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="8" width="4" height="8"/>
            <rect x="10" y="6" width="4" height="12"/>
            <rect x="16" y="8" width="4" height="8"/>
          </svg>
        </button>
        <button className={btn} title="Distribute Vertically" onClick={DistributeVertical}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="6" y="4" width="12" height="4"/>
            <rect x="8" y="10" width="8" height="4"/>
            <rect x="6" y="16" width="12" height="4"/>
          </svg>
        </button>
      </div>
      <button className={btn} title="Undo (Ctrl/Cmd+Z)" onClick={undo}>↶</button>
      <button className={btn} title="Redo (Shift+Ctrl/Cmd+Z)" onClick={redo}>↷</button>
      {/* Align/Distribute near shortcuts */}
      <div className="flex items-center gap-1 ml-2">
        {/* Align horizontal */}
        <button className={btn} title="Align Left" onClick={() => doAlign('left')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 3v18" />
            <rect x="6" y="6" width="10" height="4" />
            <rect x="6" y="14" width="6" height="4" />
          </svg>
        </button>
        <button className={btn} title="Align Center X" onClick={() => doAlign('centerX')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3v18" />
            <rect x="5" y="6" width="14" height="4" />
          </svg>
        </button>
        <button className={btn} title="Align Right" onClick={() => doAlign('right')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 3v18" />
            <rect x="8" y="6" width="10" height="4" />
            <rect x="12" y="14" width="6" height="4" />
          </svg>
        </button>
        {/* Align vertical */}
        <button className={btn} title="Align Top" onClick={() => doAlign('top')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 4h18" />
            <rect x="6" y="6" width="4" height="8" />
            <rect x="14" y="6" width="4" height="12" />
          </svg>
        </button>
        <button className={btn} title="Align Center Y" onClick={() => doAlign('centerY')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18" />
            <rect x="6" y="6" width="4" height="12" />
          </svg>
        </button>
        <button className={btn} title="Align Bottom" onClick={() => doAlign('bottom')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 20h18" />
            <rect x="6" y="6" width="4" height="12" />
            <rect x="14" y="10" width="4" height="8" />
          </svg>
        </button>
        {/* Distribute */}
        <button className={btn} title="Distribute Horizontally" onClick={() => doDistrib('horiz')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="8" width="4" height="8" />
            <rect x="10" y="6" width="4" height="12" />
            <rect x="16" y="8" width="4" height="8" />
          </svg>
        </button>
        <button className={btn} title="Distribute Vertically" onClick={() => doDistrib('vert')}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="6" y="4" width="12" height="4" />
            <rect x="8" y="10" width="8" height="4" />
            <rect x="6" y="16" width="12" height="4" />
          </svg>
        </button>
      </div>
      {/* Grouping */}
      <div className="flex items-center gap-1 ml-2">
        <button
          className={btn}
          title="Group selected into new group"
          onClick={() => groupSelectedIntoNewGroup('Group')}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeDasharray="3 2" strokeWidth="2">
            <rect x="4" y="4" width="16" height="12" />
          </svg>
        </button>
        <button
          className={btn}
          title="Ungroup selected"
          onClick={ungroupSelected}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12h16" />
            <path d="M8 8l-4 4 4 4" />
            <path d="M16 8l4 4-4 4" />
          </svg>
        </button>
      </div>
      <span className="mx-1" />
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
