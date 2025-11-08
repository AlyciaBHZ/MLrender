import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    katex?: {
      render: (expression: string, element: HTMLElement, options?: Record<string, unknown>) => void;
    };
  }
}

type Props = {
  text: string;
  enabled?: boolean;
  className?: string;
  title?: string;
};

export default function MathText({ text, enabled = true, className, title }: Props) {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    const renderAsLatex = Boolean(enabled && typeof window !== 'undefined' && window.katex);
    if (!renderAsLatex) {
      el.textContent = text;
      return undefined;
    }

    try {
      window.katex!.render(text, el, { throwOnError: false, displayMode: false });
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Failed to render KaTeX string', error);
      }
      el.textContent = text;
    }

    return () => {
      el.textContent = '';
    };
  }, [text, enabled]);

  return <span ref={spanRef} className={className} title={title ?? text} aria-label={title ?? text} />;
}
