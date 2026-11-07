import { useState } from "react";
import { motion, useReducedMotionConfig } from "framer-motion";
import { Check } from "lucide-react";
import { NAMES, type NameEntry } from "../data/names";
import { scriptAttrs } from "../utils/script";
import Reveal from "./Reveal";

interface NameTreeProps {
  active: string;
  completedIds: Set<string>;
  onSelect: (id: string) => void;
}

/** Inner circle: the "I AM" thread — bush → Jesus → Immanuel. */
const INNER: { id: string; angle: number; ref: string }[] = [
  { id: "ehyeh", angle: -90, ref: "Исход 3:14" },
  { id: "ego-eimi", angle: 30, ref: "Иоанна 8:58" },
  { id: "immanuel", angle: 150, ref: "Матфея 1:23" },
];

/** Outer circle: the nine compound names built on יהוה. */
const OUTER_IDS = [
  "yireh",
  "rapha",
  "nissi",
  "mekoddishkem",
  "ro-i",
  "shalom",
  "tsidkenu",
  "shammah",
  "sabaoth",
];

const R_INNER = 26;
const R_OUTER = 48;

const polar = (r: number, deg: number) => {
  const rad = (deg * Math.PI) / 180;
  return { x: 50 + r * Math.cos(rad), y: 50 + r * Math.sin(rad) };
};

const byId = (id: string) => NAMES.find((n) => n.id === id) as NameEntry;

interface Node {
  name: NameEntry;
  x: number;
  y: number;
  angle: number;
  ring: "inner" | "outer";
}

const INNER_NODES: Node[] = INNER.map(({ id, angle }) => ({
  name: byId(id),
  ...polar(R_INNER, angle),
  angle,
  ring: "inner" as const,
})).filter((n) => !!n.name);

const OUTER_NODES: Node[] = OUTER_IDS.map((id, i) => {
  const angle = -70 + i * 40;
  return { name: byId(id), ...polar(R_OUTER, angle), angle, ring: "outer" as const };
}).filter((n) => !!n.name);

const NODES = [...INNER_NODES, ...OUTER_NODES];

const branchPath = (node: Node) => {
  if (node.ring === "inner") return `M50 50 L${node.x.toFixed(2)} ${node.y.toFixed(2)}`;
  const c = polar(R_OUTER * 0.52, node.angle - 14);
  return `M50 50 Q${c.x.toFixed(2)} ${c.y.toFixed(2)} ${node.x.toFixed(2)} ${node.y.toFixed(2)}`;
};

const thread = (() => {
  const [a, b, c] = INNER.map(({ angle }) => polar(R_INNER, angle));
  return `M${a.x} ${a.y} A${R_INNER} ${R_INNER} 0 0 1 ${b.x} ${b.y} A${R_INNER} ${R_INNER} 0 0 1 ${c.x} ${c.y}`;
})();

/** Hebrew of a compound name without the repeated יהוה prefix. */
const suffix = (n: NameEntry) => n.hebrew.replace("יהוה ", "");

export default function NameTree({ active, completedIds, onSelect }: NameTreeProps) {
  const [hover, setHover] = useState<string | null>(null);
  const reduced = useReducedMotionConfig();
  const yhwhActive = active === "yhwh";
  const root = byId("yhwh");

  return (
    <section
      id="tsentr"
      className="relative scroll-mt-24 overflow-clip px-6 pb-20 pt-8 md:pb-28"
      aria-labelledby="tsentr-title"
    >
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="flex items-center justify-center gap-4 font-ui text-[10px] font-medium uppercase tracking-[0.45em] text-gold-400">
            <span className="hairline w-10" />
            Имя в центре
            <span className="hairline w-10" />
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 id="tsentr-title" className="mt-4 font-display text-3xl font-medium text-cream-100 md:text-5xl">
            ЯХВЕ — <span className="gold-static italic">центральное имя</span> Писания
          </h2>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mx-auto mt-4 max-w-xl font-body text-lg italic leading-relaxed text-cream-500">
            ЯХВЕ — личное имя Бога и самое частое имя Библии: около 6 800 раз. Оно не
            «корень», от которого произошли прочие имена, — Элохим, Эль и Адонай
            самостоятельны. Но именно вокруг ЯХВЕ выстроено откровение: внутренний
            круг — нить «Я есмь», внешний — девять имён, где ЯХВЕ стоит рядом со
            словом о том, чем Он является для Своего народа.
          </p>
        </Reveal>
      </div>

      {/* ─────────── radial diagram · tablet & desktop ─────────── */}
      <div className="relative mx-auto mt-12 hidden aspect-square w-full max-w-[660px] md:block">
        <div aria-hidden className="pointer-events-none absolute inset-[2%] rounded-full border border-dashed border-gold-500/10 animate-rotate-slow" />
        <div aria-hidden className="pointer-events-none absolute inset-[24%] rounded-full border border-gold-500/10 animate-rotate-rev" />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[46%] w-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-500/[0.07] blur-3xl animate-glow-pulse" />

        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
          <defs>
            <linearGradient id="branch" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f4e5bb" />
              <stop offset="100%" stopColor="#8a6f24" />
            </linearGradient>
          </defs>

          {NODES.map((node, i) => {
            const lit = hover === node.name.id || active === node.name.id;
            const dim = hover !== null && !lit;
            return (
              <motion.path
                key={node.name.id}
                d={branchPath(node)}
                fill="none"
                stroke={lit ? "#ecd39a" : "url(#branch)"}
                strokeWidth={lit ? 0.45 : 0.22}
                strokeLinecap="round"
                initial={reduced ? false : { pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: dim ? 0.18 : lit ? 1 : 0.55 }}
                animate={{ opacity: dim ? 0.18 : lit ? 1 : 0.55 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  pathLength: { duration: 1.4, delay: 0.2 + i * 0.07, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.35 },
                }}
                style={lit ? { filter: "drop-shadow(0 0 1.2px rgba(236,211,154,0.9))" } : undefined}
              />
            );
          })}

          <motion.path
            d={thread}
            fill="none"
            stroke="#d4af37"
            strokeWidth={0.3}
            strokeDasharray="1 1.2"
            initial={reduced ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 0.8 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 2.2, delay: 0.5, ease: "easeInOut" }}
          />
        </svg>

        <motion.button
          type="button"
          onClick={() => onSelect("yhwh")}
          initial={reduced ? false : { scale: 0.6, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className={`group absolute left-1/2 top-1/2 z-10 flex h-[20%] w-[20%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border bg-ink-950/90 backdrop-blur-sm transition-all duration-500 hover:border-gold-300/80 hover:shadow-[0_0_70px_-6px_rgba(212,175,55,0.65)] ${
            yhwhActive
              ? "border-gold-300/80 shadow-[0_0_70px_-6px_rgba(212,175,55,0.65)]"
              : "border-gold-500/45 shadow-[0_0_50px_-10px_rgba(212,175,55,0.45)]"
          }`}
          aria-label="ЯХВЕ — центральное имя Бога. Открыть раздел"
        >
          <span className="pointer-events-none absolute inset-1.5 rounded-full border border-gold-500/20" aria-hidden />
          <span dir="rtl" lang="he" className="glow-gold font-hebrew text-4xl font-medium leading-none text-gold-200 lg:text-5xl">
            יהוה
          </span>
          <span className="mt-1.5 font-ui text-[9px] uppercase tracking-[0.3em] text-cream-300">ЯХВЕ · центр</span>
        </motion.button>

        {NODES.map((node, i) => {
          const isActive = active === node.name.id;
          const done = completedIds.has(node.name.id);
          const lit = hover === node.name.id || isActive;
          return (
            <motion.button
              key={node.name.id}
              type="button"
              onClick={() => onSelect(node.name.id)}
              onPointerEnter={() => setHover(node.name.id)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(node.name.id)}
              onBlur={() => setHover(null)}
              initial={reduced ? false : { scale: 0.4, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.9 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              className="absolute z-10 flex w-[112px] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
              aria-label={`${node.name.translit} — ${node.name.russian}${done ? ", изучено" : ""}`}
            >
              <span
                className={`relative flex h-11 w-11 items-center justify-center rounded-full border bg-ink-950/90 transition-all duration-300 ${
                  lit
                    ? "scale-110 border-gold-300/80 shadow-[0_0_28px_-2px_rgba(212,175,55,0.7)]"
                    : done
                      ? "border-gold-500/55"
                      : "border-gold-500/25"
                }`}
              >
                <span className={`h-1.5 w-1.5 rotate-45 ${lit || done ? "bg-gold-300" : "bg-gold-600/70"}`} />
                {done && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-gold-400 shadow-[0_0_8px_rgba(212,175,55,0.9)]" aria-hidden />
                )}
              </span>
              <span
                {...scriptAttrs(node.name)}
                className={`mt-1.5 font-hebrew text-[15px] leading-tight transition-colors ${
                  lit ? "text-gold-200" : "text-gold-400"
                }`}
              >
                {node.ring === "outer" ? suffix(node.name) : node.name.id === "ehyeh" ? "אֶהְיֶה" : node.name.hebrew}
              </span>
              <span
                className={`mt-0.5 font-ui text-[9px] uppercase leading-tight tracking-[0.1em] transition-colors ${
                  lit ? "text-cream-50" : "text-cream-300"
                }`}
              >
                {node.name.russian}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* ─────────── branch list · phones ─────────── */}
      <div className="mx-auto mt-10 max-w-md md:hidden">
        {/* root */}
        <button
          type="button"
          onClick={() => onSelect(root.id)}
          className={`card-parchment sheen relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border px-5 py-4 text-left transition-all ${
            yhwhActive ? "border-gold-300/70 shadow-[0_0_36px_-10px_rgba(212,175,55,0.6)]" : "border-gold-500/40"
          }`}
        >
          <span dir="rtl" lang="he" className="glow-gold font-hebrew text-4xl leading-none text-gold-200">
            יהוה
          </span>
          <span className="min-w-0">
            <span className="block font-ui text-[8px] uppercase tracking-[0.3em] text-gold-500">Центральное имя Писания</span>
            <span className="mt-1 block font-display text-2xl font-semibold italic text-cream-50">ЯХВЕ</span>
            <span className="block font-body text-sm text-cream-500">Сущий · Господь Завета</span>
          </span>
          {completedIds.has(root.id) && <Check className="ml-auto h-4 w-4 shrink-0 text-gold-400" strokeWidth={2.5} />}
        </button>

        {/* the "I AM" thread */}
        <div className="relative mt-2 pl-7">
          <span aria-hidden className="absolute bottom-4 left-[11px] top-0 w-px bg-gradient-to-b from-gold-400/70 via-gold-600/40 to-transparent" />
          <p className="relative pt-5 font-ui text-[8.5px] uppercase tracking-[0.3em] text-gold-500">
            <span aria-hidden className="absolute -left-7 top-[26px] h-1.5 w-1.5 translate-x-[8px] rotate-45 bg-gold-400" />
            Нить «Я есмь»
          </p>
          <div className="mt-3 space-y-2">
            {INNER.map(({ id, ref }) => {
              const n = byId(id);
              if (!n) return null;
              const on = active === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelect(id)}
                  className={`relative flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                    on ? "border-gold-400/60 bg-ink-800/80" : "border-cream-800/60 bg-ink-900/50"
                  }`}
                >
                  <span aria-hidden className="absolute -left-[18px] top-1/2 h-px w-[18px] bg-gold-600/50" />
                  <span {...scriptAttrs(n)} className="shrink-0 font-hebrew text-lg text-gold-300">
                    {id === "ehyeh" ? "אֶהְיֶה" : n.hebrew}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg italic leading-tight text-cream-100">{n.translit}</span>
                    <span className="block font-body text-sm leading-tight text-cream-500">{n.russian}</span>
                  </span>
                  <span className="shrink-0 font-ui text-[8px] uppercase tracking-[0.14em] text-gold-600">{ref}</span>
                  {completedIds.has(id) && <Check className="h-3.5 w-3.5 shrink-0 text-gold-400" strokeWidth={2.5} />}
                </button>
              );
            })}
          </div>

          {/* nine compound names */}
          <p className="relative pt-7 font-ui text-[8.5px] uppercase tracking-[0.3em] text-gold-500">
            <span aria-hidden className="absolute -left-7 top-[34px] h-1.5 w-1.5 translate-x-[8px] rotate-45 bg-gold-400" />
            Девять имён с ЯХВЕ
          </p>
          <div className="mt-3 space-y-2">
            {OUTER_IDS.map((id) => {
              const n = byId(id);
              if (!n) return null;
              const on = active === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelect(id)}
                  className={`relative flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all ${
                    on ? "border-gold-400/60 bg-ink-800/80" : "border-cream-800/60 bg-ink-900/50"
                  }`}
                >
                  <span aria-hidden className="absolute -left-[18px] top-1/2 h-px w-[18px] bg-gold-600/40" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg italic leading-tight text-cream-100">{n.translit}</span>
                    <span className="block font-body text-sm leading-tight text-cream-500">{n.russian}</span>
                  </span>
                  <span {...scriptAttrs(n)} className="shrink-0 font-hebrew text-base text-gold-300">
                    {suffix(n)}
                  </span>
                  {completedIds.has(id) && <Check className="h-3.5 w-3.5 shrink-0 text-gold-400" strokeWidth={2.5} />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <p className="mx-auto mt-8 max-w-md text-center font-ui text-[9px] uppercase leading-relaxed tracking-[0.28em] text-cream-700">
        <span className="mr-2 inline-block h-px w-6 translate-y-[-3px] border-t border-dashed border-gold-500" />
        нить «Я есмь» · Исх 3:14 → Ин 8:58 → Мф 1:23
      </p>
    </section>
  );
}
