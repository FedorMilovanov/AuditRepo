import { useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotionConfig } from "framer-motion";
import { Check, List, X } from "lucide-react";
import { NAMES, PARTS } from "../data/names";
import { scriptAttrs } from "../utils/script";

interface MobileIndexProps {
  active: string;
  completedIds: Set<string>;
  onSelect: (id: string) => void;
  visible: boolean;
}

export default function MobileIndex({ active, completedIds, onSelect, visible }: MobileIndexProps) {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotionConfig();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreTriggerRef = useRef(false);
  const selectedTargetRef = useRef<string | null>(null);
  const current = NAMES.find((n) => n.id === active);
  const idx = NAMES.findIndex((n) => n.id === active);
  const progress = idx >= 0 ? ((idx + 1) / NAMES.length) * 100 : 0;

  useLayoutEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Commit the dialog and its initial keyboard focus in the same paint.
    closeRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        restoreTriggerRef.current = true;
        setOpen(false);
      }
      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;
      const buttons = [...dialog.querySelectorAll<HTMLButtonElement>("button:not([disabled])")];
      if (!buttons.length) return;
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      const inside = dialog.contains(document.activeElement);
      if (event.shiftKey && (!inside || document.activeElement === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!inside || document.activeElement === last)) {
        event.preventDefault();
        first.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1280) {
        restoreTriggerRef.current = false;
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const go = (id: string) => {
    selectedTargetRef.current = id;
    restoreTriggerRef.current = false;
    setOpen(false);
    onSelect(id);
  };

  const close = () => {
    restoreTriggerRef.current = true;
    selectedTargetRef.current = null;
    setOpen(false);
  };

  return (
    <>
      {/* floating pill */}
      {visible && <button
        ref={triggerRef}
        onClick={() => {
          restoreTriggerRef.current = true;
          selectedTargetRef.current = null;
          setOpen(true);
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="fixed left-1/2 z-40 flex min-h-11 max-w-[calc(100vw-2rem)] min-w-0 -translate-x-1/2 items-center gap-3 rounded-full border border-gold-500/40 bg-ink-950 px-4 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.7)] transition-colors hover:border-gold-300/65 motion-safe:active:scale-[0.98] motion-reduce:transition-none xl:hidden"
        style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom, 0px))" }}
        aria-label="Открыть список имён"
      >
        <List className="h-4 w-4 shrink-0 text-gold-300" strokeWidth={1.5} />
        <span className="font-ui min-w-0 break-words text-center text-xs font-medium uppercase leading-snug tracking-[0.15em] text-cream-200">
          {current ? current.translit : "Разделы"}
        </span>
        <span className="shrink-0 font-hebrew text-xs text-cream-500">
          {idx >= 0 ? `${String(idx + 1).padStart(2, "0")}/${NAMES.length}` : ""}
        </span>
      </button>}

      {/* overlay */}
      <AnimatePresence onExitComplete={() => {
        // Handoff keyboard focus after the dialog's exit animation completes.
        const targetId = selectedTargetRef.current;
        selectedTargetRef.current = null;
        if (targetId) {
          document.getElementById(targetId)?.querySelector<HTMLElement>("[data-name-heading]")
            ?.focus({ preventScroll: true });
        } else if (restoreTriggerRef.current && triggerRef.current?.getClientRects().length) {
          triggerRef.current.focus({ preventScroll: true });
        }
        restoreTriggerRef.current = false;
      }}>
        {open && (
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.24 }}
            role="dialog"
            aria-modal="true"
            aria-label="Указатель библейских выражений"
            className="fixed inset-0 z-50 flex flex-col bg-ink-950/96 backdrop-blur-xl xl:hidden"
          >
            <div className="flex min-w-0 items-center justify-between gap-3 px-5 pt-6 sm:px-6"
              style={{ paddingTop: "max(1.5rem, env(safe-area-inset-top, 0px))" }}>
              <p className="font-ui min-w-0 text-xs font-medium uppercase leading-relaxed tracking-[0.2em] text-gold-300">
                Указатель библейских выражений
              </p>
              <button
                ref={closeRef}
                onClick={close}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cream-800/60 text-cream-200 transition-colors hover:border-gold-500/60 hover:text-gold-200 motion-safe:active:scale-95 motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
                aria-label="Закрыть"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <div className="mt-2 h-px w-full bg-cream-800/40">
              <div
                className="h-px bg-gold-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex-1 overscroll-contain overflow-y-auto px-5 pb-24 pt-5 sm:px-6 sm:pt-6">
              {PARTS.map((part, pi) => (
                <div key={part.id} className="mb-8">
                  <p className="flex items-center gap-3 font-ui text-xs font-medium uppercase tracking-[0.2em] text-cream-400">
                    <span className="font-display text-base italic text-gold-500/80">
                      {part.numeral}
                    </span>
                    {part.title}
                    <span className="hairline flex-1" />
                  </p>
                  <div className="mt-4 grid grid-cols-1 gap-2">
                    {NAMES.filter((n) => n.part === pi + 1).map((n) => {
                      const nIdx = NAMES.findIndex((x) => x.id === n.id);
                      return (
                        <button
                          key={n.id}
                          data-mobile-index-entry
                          aria-current={n.id === active ? "location" : undefined}
                          onClick={() => go(n.id)}
                          className={`grid w-full min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-1.5 rounded-xl border px-4 py-3 text-left transition-colors duration-200 motion-safe:active:scale-[0.99] motion-reduce:transition-none sm:grid-cols-[auto_minmax(0,1fr)_minmax(0,1fr)] ${
                            n.id === active
                              ? "border-gold-500/50 bg-ink-800"
                              : "border-cream-800/40 bg-ink-900/50 hover:border-gold-500/30"
                          }`}
                        >
                          <span className="row-span-2 font-hebrew text-sm text-cream-700 sm:row-span-1">
                            {String(nIdx + 1).padStart(2, "0")}
                          </span>
                          <span className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                            <span data-mobile-name-text="original" className="min-w-0 break-words font-hebrew text-lg text-gold-300" {...scriptAttrs(n)}>
                              {n.hebrew}
                            </span>
                            <span data-mobile-name-text="translit" className="min-w-0 break-words font-ui text-xs font-medium uppercase tracking-[0.14em] text-cream-200">
                              {n.translit}
                            </span>
                            {completedIds.has(n.id) && (
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-300 ring-1 ring-gold-500/35" aria-label="Изучено">
                                <Check className="h-3 w-3" strokeWidth={2.5} />
                              </span>
                            )}
                          </span>
                          <span data-mobile-name-text="russian" className="col-start-2 min-w-0 max-w-full justify-self-end break-words text-right font-body text-sm italic text-cream-400 sm:col-start-3 sm:row-start-1">
                            {n.russian}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
