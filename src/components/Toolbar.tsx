import React from 'react';
import { useTranslation } from 'react-i18next';
import IconButton from '@/ui/atoms/IconButton';
import AlignmentDropdown from '@/components/AlignmentDropdown';
import { useDiagramStore } from '@/diagram/DiagramState';

export default function Toolbar() {
  const undo = useDiagramStore((state) => state.undo);
  const redo = useDiagramStore((state) => state.redo);
  const groupSelectedIntoNewGroup = useDiagramStore((state) => state.groupSelectedIntoNewGroup);
  const ungroupSelected = useDiagramStore((state) => state.ungroupSelected);
  const semanticColorsLocked = useDiagramStore((state) => state.semanticColorsLocked);
  const setSemanticColorsLocked = useDiagramStore((state) => state.setSemanticColorsLocked);
  const { t, i18n } = useTranslation();

  const handleGroup = React.useCallback(() => {
    groupSelectedIntoNewGroup(t('node.group.label'));
  }, [groupSelectedIntoNewGroup, t]);

  const handleUngroup = React.useCallback(() => {
    ungroupSelected();
  }, [ungroupSelected]);

  const handleSemanticLockChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSemanticColorsLocked(event.target.checked);
    },
    [setSemanticColorsLocked],
  );

  const handleLanguageChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      i18n.changeLanguage(event.target.value);
    },
    [i18n],
  );

  const languages = React.useMemo(
    () => [
      { value: 'zh', label: t('lang.zh') },
      { value: 'en', label: t('lang.en') },
    ],
    [t],
  );

  const semanticLabel = t('toolbar.semanticColors', { defaultValue: 'Semantic colors' });
  const languageLabel = t('toolbar.language', { defaultValue: 'Language' });

  return (
    <div className="flex flex-wrap items-center gap-2">
      <AlignmentDropdown />
      <IconButton title={t('toolbar.undo')} onClick={undo}>
        {t('toolbar.undo')}
      </IconButton>
      <IconButton title={t('toolbar.redo')} onClick={redo}>
        {t('toolbar.redo')}
      </IconButton>
      <div className="ml-2 flex items-center gap-1">
        <IconButton title={t('toolbar.group')} onClick={handleGroup} ariaLabel={t('toolbar.group')}>
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeDasharray="3 2"
            strokeWidth="2"
            aria-hidden="true"
          >
            <rect x="4" y="4" width="16" height="12" />
          </svg>
        </IconButton>
        <IconButton
          title={t('toolbar.ungroup')}
          onClick={handleUngroup}
          ariaLabel={t('toolbar.ungroup')}
        >
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M4 12h16" />
            <path d="M8 8l-4 4 4 4" />
            <path d="M16 8l4 4-4 4" />
          </svg>
        </IconButton>
      </div>
      <span className="ml-3" />
      <label className="flex items-center gap-1 text-xs text-gray-600">
        <input type="checkbox" checked={semanticColorsLocked} onChange={handleSemanticLockChange} />
        {semanticLabel}
      </label>
      <span className="ml-1" />
      <span className="text-xs text-gray-500">{languageLabel}:</span>
      <select
        className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
        value={i18n.language}
        onChange={handleLanguageChange}
        aria-label={languageLabel}
      >
        {languages.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
