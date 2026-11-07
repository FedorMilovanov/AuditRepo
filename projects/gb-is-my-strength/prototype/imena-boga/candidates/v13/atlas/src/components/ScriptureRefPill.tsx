import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BookOpen, X, Copy, Check } from 'lucide-react';

interface ScriptureRefPillProps {
  reference: string;
  synodalText: string;
  originalNote?: string;
}

export const ScriptureRefPill: React.FC<ScriptureRefPillProps> = ({
  reference,
  synodalText,
  originalNote,
}) => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [offsetX, setOffsetX] = useState<number>(0);
  const wrapperRef = useRef<HTMLSpanElement | null>(null);
  const popoverRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  // Clamp desktop popover horizontally inside the central reading column / viewport
  useLayoutEffect(() => {
    if (!open || window.innerWidth < 640) {
      setOffsetX(0);
      return;
    }
    const pop = popoverRef.current;
    const wrap = wrapperRef.current;
    if (!pop || !wrap) return;

    const wrapRect = wrap.getBoundingClientRect();
    const popWidth = pop.offsetWidth || 340;
    const margin = 16;
    const maxRight = window.innerWidth - margin;

    if (wrapRect.left + popWidth > maxRight) {
      const shift = maxRight - (wrapRect.left + popWidth);
      setOffsetX(Math.max(-wrapRect.left + margin, shift));
    } else {
      setOffsetX(0);
    }
  }, [open]);

  const handleCopyVerse = async () => {
    try {
      await navigator.clipboard.writeText(`«${synodalText}» (${reference})`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Ignore clipboard errors in restricted frames
    }
  };

  return (
    <span ref={wrapperRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="font-ui inline-flex cursor-pointer items-center gap-1 rounded-md border px-1.5 py-0.5 text-[0.82em] font-semibold transition-colors hover:opacity-85"
        style={{
          backgroundColor: 'var(--gb-accent-soft)',
          borderColor: open ? 'var(--gb-gold)' : 'var(--gb-border-strong)',
          color: 'var(--gb-accent)',
        }}
        title={`Открыть текст Писания: ${reference}`}
      >
        <BookOpen className="h-3 w-3 shrink-0" style={{ color: 'var(--gb-gold)' }} />
        <span>{reference}</span>
      </button>

      {open && (
        <span
          ref={popoverRef}
          role="dialog"
          aria-label={`Стих Писания: ${reference}`}
          style={{
            backgroundColor: 'var(--gb-surface)',
            borderColor: 'var(--gb-gold)',
            boxShadow: 'var(--gb-shadow-xl)',
            transform: offsetX !== 0 ? `translateX(${offsetX}px)` : undefined,
          }}
          className="fixed right-4 bottom-20 left-4 z-50 block rounded-2xl border p-4 text-left shadow-2xl sm:absolute sm:right-auto sm:bottom-full sm:left-0 sm:mb-2 sm:w-[340px]"
        >
          <span
            className="flex items-center justify-between gap-2 border-b pb-2"
            style={{ borderColor: 'var(--gb-border)' }}
          >
            <span className="font-ui text-xs font-bold" style={{ color: 'var(--gb-accent)' }}>
              {reference} · Синодальный перевод
            </span>
            <span className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleCopyVerse}
                className="cursor-pointer rounded-full p-1 hover:opacity-75"
                style={{ color: 'var(--gb-muted)' }}
                aria-label="Скопировать стих"
                title="Скопировать стих"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer rounded-full p-1 hover:opacity-75"
                style={{ color: 'var(--gb-muted)' }}
                aria-label="Закрыть стих"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          </span>

          <span
            className="font-quote-editorial mt-2 block text-base italic leading-relaxed"
            style={{ color: 'var(--gb-ink)' }}
          >
            «{synodalText}»
          </span>

          {originalNote && (
            <span
              className="font-ui mt-2 block rounded-lg px-2.5 py-1.5 text-[11px]"
              style={{ backgroundColor: 'var(--gb-bg)', color: 'var(--gb-muted)' }}
            >
              {originalNote}
            </span>
          )}
        </span>
      )}
    </span>
  );
};
