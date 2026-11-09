import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { NAMES } from "../data/names";

interface RailsProps {
  active: string;
  completedIds: Set<string>;
  wide: boolean;
  onSelect: (id: string) => void;
}

function RailItem({
  index,
  translit,
  russian,
  active,
  passed,
  completed,
  onSelect,
  side,
  itemRef,
}: {
  index: number;
  translit: string;
  russian: string;
  active: boolean;
  passed: boolean;
  completed: boolean;
  onSelect: () => void;
  side: "left" | "right";
  itemRef?: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <motion.button
      ref={itemRef}
      onClick={onSelect}
      title={`${russian}${completed ? " · изучено" : ""} — перейти к разделу`}
      initial={{ opacity: 0, x: side === "left" ? -14 : 14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.03, 0.45) }}
      aria-current={active ? "true" : undefined}
      className={`group relative flex w-full items-center gap-3 rounded-lg px-2 py-1.5 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 ${
        side === "left" ? "flex-row-reverse" : ""
      } ${active ? "bg-gold-500/[0.14] ring-1 ring-inset ring-gold-500/35" : "hover:bg-gold-500/[0.05]"}`}
    >
      {/* diamond marker */}
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${
          active
            ? "bg-gold-300 shadow-[0_0_12px_rgba(212,175,55,0.9)]"
            : passed
              ? "bg-gold-600/70"
              : "bg-cream-700/40 group-hover:bg-gold-500/60"
        }`}
      />
      <span className={`flex min-w-0 flex-col ${side === "left" ? "items-end" : "items-start"}`}>
        <span
          className={`font-hebrew text-xs leading-none transition-all duration-500 ${
            active ? "text-gold-300/80" : passed ? "text-cream-400/80" : "text-cream-400/80 group-hover:text-cream-200"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={`flex max-w-full items-center gap-1.5 font-ui text-xs uppercase tracking-[0.12em] transition-all duration-500 ${
            active
              ? "glow-gold text-gold-200"
              : passed
                ? "text-cream-300"
                : "text-cream-300/80 group-hover:text-cream-100"
          } ${side === "left" ? "flex-row-reverse" : ""}`}
        >
          <span className="truncate">{translit}</span>
          {completed && <Check className="h-3 w-3 shrink-0 text-gold-400" strokeWidth={2.5} aria-hidden />}
        </span>
      </span>
    </motion.button>
  );
}

function Beam({ progress }: { progress: number }) {
  return (
    <span className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2">
      <span className="absolute inset-0 bg-cream-800/40" />
      <motion.span
        className="absolute left-0 top-0 w-px bg-gradient-to-b from-gold-300 via-gold-500 to-transparent shadow-[0_0_10px_rgba(212,175,55,0.7)]"
        animate={{ height: `${progress}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
    </span>
  );
}

export default function Rails({ active, completedIds, wide, onSelect }: RailsProps) {
  const activeIdx = NAMES.findIndex((n) => n.id === active);
  const midpoint = Math.ceil(NAMES.length / 2);
  const left = NAMES.slice(0, midpoint);
  const right = NAMES.slice(midpoint);
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());

  // keep the active name visible inside a rail that scrolls on short viewports
  useEffect(() => {
    if (!active) return;
    const el = itemRefs.current.get(active);
    const scrollBox = el?.closest<HTMLElement>("[data-rail-scroll]");
    if (!el || !scrollBox) return;
    // Keep the active item visible in this rail only. scrollIntoView
    // scrolls ancestor containers too, potentially moving the article.
    const viewport = scrollBox.getBoundingClientRect();
    const card = el.getBoundingClientRect();
    if (!viewport.height || !card.height) return;
    const delta = card.top < viewport.top
      ? card.top - viewport.top
      : card.bottom > viewport.bottom ? card.bottom - viewport.bottom : 0;
    if (Math.abs(delta) <= 1) return;
    scrollBox.scrollTo({
      top: Math.max(0, Math.min(
        scrollBox.scrollHeight - scrollBox.clientHeight,
        scrollBox.scrollTop + delta,
      )),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }, [active]);

  const rail = (items: typeof NAMES, offset: number, side: "left" | "right", title: string) => {
    const localActive = items.findIndex((n) => n.id === active);
    const progress = localActive >= 0 ? ((localActive + 0.5) / items.length) * 100 : 0;
    return (
      <aside
        data-rails
        className={`fixed top-1/2 z-40 hidden w-44 -translate-y-1/2 ${
          wide ? "min-[1560px]:block" : "min-[1440px]:block"
        } ${side === "left" ? "left-4 2xl:left-8" : "right-24 2xl:right-28"}`}
        aria-label={`Указатель имён: ${title}`}
      >
        <p
          className={`mb-4 flex items-center gap-3 font-ui text-xs uppercase tracking-[0.18em] text-cream-400 ${
            side === "left" ? "justify-end" : ""
          }`}
        >
          {side === "left" && <span className="hairline w-8" />}
          {title}
          {side === "right" && <span className="hairline w-8" />}
        </p>
        <div className="relative flex flex-col items-stretch">
          <Beam progress={progress} />
          <div
            data-rail-scroll
            className={`rail-scroll relative flex max-h-[72vh] flex-col gap-0.5 overflow-y-auto py-1 ${
              side === "left" ? "items-stretch pr-4" : "items-stretch pl-4"
            }`}
          >
            {items.map((n, i) => {
              const idx = offset + i;
              return (
                <RailItem
                  key={n.id}
                  index={idx}
                  translit={n.translit}
                  russian={n.russian}
                  active={n.id === active}
                  passed={activeIdx >= idx}
                  completed={completedIds.has(n.id)}
                  onSelect={() => onSelect(n.id)}
                  side={side}
                  itemRef={(el) => {
                    if (el) itemRefs.current.set(n.id, el);
                    else itemRefs.current.delete(n.id);
                  }}
                />
              );
            })}
          </div>
        </div>
      </aside>
    );
  };

  return (
    <>
      {rail(left, 0, "left", "Имена I–XV")}
      {rail(right, midpoint, "right", "Имена XVI–XXIX")}
    </>
  );
}
