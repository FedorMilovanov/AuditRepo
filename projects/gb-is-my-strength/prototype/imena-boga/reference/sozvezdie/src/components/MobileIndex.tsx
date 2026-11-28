import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const current = NAMES.find((n) => n.id === active);
  const idx = NAMES.findIndex((n) => n.id === active);
  const progress = idx >= 0 ? ((idx + 1) / NAMES.length) * 100 : 0;

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 60);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 1280) setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      window.setTimeout(() => triggerRef.current?.focus(), 0);
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    onSelect(id);
  };

  return (
    <>
      {/* floating pill */}
      {visible && <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border border-gold-500/30 bg-ink-900/90 py-2.5 pl-4 pr-5 shadow-[0_10px_40px_rgba(0,0,0,0.7)] backdrop-blur-md transition-colors hover:border-gold-400/60 xl:hidden"
        aria-label="Открыть список имён"
      >
        <List className="h-4 w-4 text-gold-400" strokeWidth={1.5} />
        <span className="font-ui text-[10px] uppercase tracking-[0.25em] text-cream-300">
          {current ? current.translit : "Все имена"}
        </span>
        <span className="font-hebrew text-[10px] text-cream-700">
          {idx >= 0 ? `${String(idx + 1).padStart(2, "0")}/${NAMES.length}` : ""}
        </span>
      </button>}

      {/* overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            role="dialog"
            aria-modal="true"
            aria-label="Указатель имен Бога"
            className="fixed inset-0 z-50 flex flex-col bg-ink-950/96 backdrop-blur-xl xl:hidden"
          >
            <div className="flex items-center justify-between px-6 pt-6">
              <p className="font-ui text-[10px] uppercase tracking-[0.4em] text-gold-400">
                Все имена Бога
              </p>
              <button
                ref={closeRef}
                onClick={() => setOpen(false)}
                className="rounded-full border border-cream-800/60 p-2 text-cream-300 transition-colors hover:border-gold-500/50 hover:text-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
                aria-label="Закрыть"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
            <div className="mt-2 h-px w-full bg-cream-800/40">
              <div
                className="h-px bg-gold-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-24 pt-6">
              {PARTS.map((part, pi) => (
                <div key={part.id} className="mb-8">
                  <p className="flex items-center gap-3 font-ui text-[9px] uppercase tracking-[0.35em] text-cream-700">
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
                          onClick={() => go(n.id)}
                          className={`flex items-center gap-4 rounded-xl border px-4 py-3 text-left transition-all duration-300 ${
                            n.id === active
                              ? "border-gold-500/50 bg-ink-800"
                              : "border-cream-800/40 bg-ink-900/50 hover:border-gold-500/30"
                          }`}
                        >
                          <span className="font-hebrew text-sm text-cream-700">
                            {String(nIdx + 1).padStart(2, "0")}
                          </span>
                          <span className="font-hebrew text-lg text-gold-300" {...scriptAttrs(n)}>
                            {n.hebrew}
                          </span>
                          <span className="font-ui text-[11px] uppercase tracking-[0.2em] text-cream-300">
                            {n.translit}
                          </span>
                          {completedIds.has(n.id) && (
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-300 ring-1 ring-gold-500/35" aria-label="Изучено">
                              <Check className="h-3 w-3" strokeWidth={2.5} />
                            </span>
                          )}
                          <span className="ml-auto text-right font-body text-sm italic text-cream-500">
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
