import React from 'react';
import { useI18n } from '@/i18n';

export default function LangSwitch() {
  const { lang, setLang, t } = useI18n();
  return (
    <div className="absolute top-2 right-2 z-50 bg-white/90 border rounded px-2 py-1 text-xs flex items-center gap-1">
      <span>{t('toolbar.language')}:</span>
      <select className="rounded border px-1 py-0.5" value={lang} onChange={(e) => setLang(e.target.value as any)}>
        <option value="zh">中文</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}

