import { AnimatePresence, motion, useReducedMotionConfig } from "framer-motion";
import { Check, Sparkles } from "lucide-react";

export interface ToastMessage {
  id: number;
  text: string;
  sub?: string;
  tone?: "default" | "gold";
}

const RAYS = Array.from({ length: 28 }, (_, i) => i);

export default function Toast({ toast }: { toast: ToastMessage | null }) {
  const reduced = useReducedMotionConfig();
  const gold = toast?.tone === "gold";

  return (
    <>
      {/* golden burst for the "all names studied" moment */}
      <AnimatePresence>
        {toast && gold && !reduced && (
          <motion.div
            key={`burst-${toast.id}`}
            className="pointer-events-none fixed left-1/2 top-1/2 z-[80] h-0 w-0"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.4, delay: 0.6 }}
            aria-hidden
          >
            {RAYS.map((i) => {
              const angle = (i / RAYS.length) * Math.PI * 2;
              const dist = 160 + (i % 4) * 55;
              return (
                <motion.span
                  key={i}
                  className="absolute h-1.5 w-1.5 rotate-45 bg-gold-300 shadow-[0_0_12px_rgba(244,229,187,0.95)]"
                  initial={{ x: 0, y: 0, scale: 0.4 }}
                  animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, scale: [0.4, 1.4, 0] }}
                  transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                />
              );
            })}
            <motion.span
              className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-gold-400/25 blur-3xl"
              initial={{ scale: 0.2 }}
              animate={{ scale: 1.4 }}
              transition={{ duration: 1.6 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none fixed inset-x-0 top-16 z-[75] flex justify-center px-4" role="status" aria-live="polite">
        <AnimatePresence mode="wait">
          {toast && (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={`flex items-center gap-3 rounded-full border px-5 py-2.5 shadow-[0_18px_50px_rgba(0,0,0,0.75)] backdrop-blur-md ${
                gold
                  ? "border-gold-300/70 bg-gradient-to-r from-ink-900/95 via-ink-800/95 to-ink-900/95 shadow-[0_0_50px_-8px_rgba(212,175,55,0.6)]"
                  : "border-gold-500/30 bg-ink-950/90"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                  gold ? "bg-gold-400 text-ink-950" : "bg-gold-500/15 text-gold-300 ring-1 ring-gold-500/40"
                }`}
              >
                {gold ? <Sparkles className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
              </span>
              <span className="flex flex-col">
                <span className={`font-ui text-[10px] font-medium uppercase tracking-[0.22em] ${gold ? "text-gold-200" : "text-cream-100"}`}>
                  {toast.text}
                </span>
                {toast.sub && <span className="font-body text-sm italic text-cream-500">{toast.sub}</span>}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
