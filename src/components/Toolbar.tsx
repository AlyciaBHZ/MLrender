import { useTranslation } from 'react-i18next';
import IconButton from '@/ui/atoms/IconButton';
import AlignmentDropdown from '@/components/AlignmentDropdown';
import { useDiagramStore } from '@/diagram/DiagramState';

export default function Toolbar() {
  const undo = useDiagramStore((s) => s.undo);
  const redo = useDiagramStore((s) => s.redo);
  const groupSelectedIntoNewGroup = useDiagramStore((s) => s.groupSelectedIntoNewGroup);
  const ungroupSelected = useDiagramStore((s) => s.ungroupSelected);
  const semanticColorsLocked = useDiagramStore((s) => s.semanticColorsLocked);
  const setSemanticColorsLocked = useDiagramStore((s) => s.setSemanticColorsLocked);
  const { t, i18n } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <AlignmentDropdown />
      <IconButton title={t('toolbar.undo')} onClick={undo}>{t('toolbar.undo')}</IconButton>
      <IconButton title={t('toolbar.redo')} onClick={redo}>{t('toolbar.redo')}</IconButton>
      {/* Grouping */}
      <div className="flex items-center gap-1 ml-2">
        <IconButton title={t('toolbar.group')} onClick={() => groupSelectedIntoNewGroup(t('node.group.label'))}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeDasharray="3 2" strokeWidth="2" aria-hidden="true">
            <rect x="4" y="4" width="16" height="12" />
          </svg>
        </IconButton>
        <IconButton title={t('toolbar.ungroup')} onClick={ungroupSelected}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M4 12h16" />
            <path d="M8 8l-4 4 4 4" />
            <path d="M16 8l4 4-4 4" />
          </svg>
        </IconButton>
      </div>
      <span className="ml-3" />
      <label className="text-xs text-gray-600 flex items-center gap-1">
        <input type="checkbox" checked={semanticColorsLocked} onChange={(e) => setSemanticColorsLocked(e.target.checked)} />
        Semantic colors
      </label>
      <span className="ml-1" />
      <span className="text-xs text-gray-500">{t('toolbar.language')}:</span>
      <select
        className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
        value={i18n.language}
        onChange={(e) => i18n.changeLanguage(e.target.value)}
      >
        <option value="zh">{t('lang.zh')}</option>
        <option value="en">{t('lang.en')}</option>
      </select>
    </div>
  );
}
