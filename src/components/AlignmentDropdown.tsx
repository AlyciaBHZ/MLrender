import React from 'react';
import IconButton from '@/ui/atoms/IconButton';
import { useTranslation } from 'react-i18next';
import { AlignLeft, AlignTop, DistributeHorizontal, DistributeVertical } from '@/diagram/alignment';

export default function AlignmentDropdown() {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as any)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <IconButton title={t('toolbar.align')} onClick={() => setOpen((v) => !v)}>
        {t('toolbar.align')}
      </IconButton>
      {open && (
        <div className="absolute z-50 mt-1 w-44 rounded border bg-white shadow">
          <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50" onClick={() => { setOpen(false); AlignLeft(); }}>
            {t('toolbar.align.left')}
          </button>
          <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50" onClick={() => { setOpen(false); AlignTop(); }}>
            {t('toolbar.align.top')}
          </button>
          <div className="my-1 h-px bg-gray-200" />
          <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50" onClick={() => { setOpen(false); DistributeHorizontal(); }}>
            {t('toolbar.distribute.horiz')}
          </button>
          <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50" onClick={() => { setOpen(false); DistributeVertical(); }}>
            {t('toolbar.distribute.vert')}
          </button>
        </div>
      )}
    </div>
  );
}

