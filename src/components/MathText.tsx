import React, { useEffect, useRef } from 'react';

declare global {
  interface Window { katex?: any }
}

type Props = {
  text: string;
  enabled?: boolean;
  className?: string;
  title?: string;
};

export default function MathText({ text, enabled, className, title }: Props) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;
    if (enabled && window.katex) {
      try {
        window.katex.render(text, el, { throwOnError: false, displayMode: false });
        return () => { el.innerHTML = ''; };
      } catch {
        el.textContent = text;
      }
    } else {
      el.textContent = text;
    }
  }, [text, enabled]);

  return <span ref={spanRef} className={className} title={title} />;
}

