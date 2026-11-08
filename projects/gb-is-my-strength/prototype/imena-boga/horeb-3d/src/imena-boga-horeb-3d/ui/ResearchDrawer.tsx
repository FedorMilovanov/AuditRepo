import { useEffect, useRef, type ReactNode } from 'react';

/** Доступное модальное окно: фокус внутрь, Tab-ловушка, Esc закрывает, фокус возвращается. */
export function Modal({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const el = ref.current;
    el?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeRef.current(); return; }
      if (e.key === 'Tab' && el) {
        const f = Array.from(el.querySelectorAll<HTMLElement>('a[href],button,select,input,[tabindex]:not([tabindex="-1"])')).filter((x) => !x.hasAttribute('disabled'));
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => { window.removeEventListener('keydown', onKey, true); prev?.focus?.(); };
  }, []);
  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center bg-black/60" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title}
        className={`drawer relative w-full ${wide ? 'sm:max-w-3xl' : 'sm:max-w-xl'} max-h-[88vh] overflow-y-auto rounded-t-xl sm:rounded-xl p-5 sm:p-8`}>
        <div className="flex items-start justify-between gap-4 mb-2">
          <p className="eyebrow">{title}</p>
          <button data-autofocus className="btn-ghost" onClick={onClose} aria-label="Закрыть (Esc)">Закрыть · Esc</button>
        </div>
        {children}
      </div>
    </div>
  );
}
