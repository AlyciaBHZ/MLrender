import React from 'react';
import IconButton from '@/ui/atoms/IconButton';
import { useTranslation } from 'react-i18next';
import { AlignLeft, AlignTop, DistributeHorizontal, DistributeVertical } from '@/diagram/alignment';

type MenuAction = {
  key: string;
  label: string;
  onSelect: () => void;
  section?: 'align' | 'distribute';
};

export default function AlignmentDropdown() {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const menuId = React.useId();

  const menuActions = React.useMemo<MenuAction[]>(
    () => [
      { key: 'align-left', label: t('toolbar.align.left'), onSelect: AlignLeft, section: 'align' },
      { key: 'align-top', label: t('toolbar.align.top'), onSelect: AlignTop, section: 'align' },
      { key: 'distribute-horizontal', label: t('toolbar.distribute.horiz'), onSelect: DistributeHorizontal, section: 'distribute' },
      { key: 'distribute-vertical', label: t('toolbar.distribute.vert'), onSelect: DistributeVertical, section: 'distribute' },
    ],
    [t],
  );

  const closeMenu = React.useCallback(
    (restoreFocus = false) => {
      setOpen(false);
      if (restoreFocus) {
        buttonRef.current?.focus();
      }
    },
    [],
  );

  React.useEffect(() => {
    if (!open) return undefined;
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        closeMenu();
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        closeMenu(true);
      }
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, closeMenu]);

  const handleToggle = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const handleSelect = React.useCallback(
    (action: MenuAction['onSelect']) => {
      action();
      closeMenu();
    },
    [closeMenu],
  );

  return (
    <div className="relative" ref={containerRef}>
      <IconButton
        ref={buttonRef}
        title={t('toolbar.align')}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={handleToggle}
      >
        {t('toolbar.align')}
      </IconButton>
      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={t('toolbar.align')}
          className="absolute z-50 mt-1 w-48 rounded border bg-white shadow focus:outline-none"
        >
          {menuActions.map((item, index) => {
            const prev = menuActions[index - 1];
            const needsDivider = prev && prev.section !== item.section;
            return (
              <React.Fragment key={item.key}>
                {needsDivider && <div className="my-1 h-px bg-gray-200" />}
                <button
                  type="button"
                  role="menuitem"
                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 focus:bg-gray-100 focus:outline-none"
                  onClick={() => handleSelect(item.onSelect)}
                >
                  {item.label}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
