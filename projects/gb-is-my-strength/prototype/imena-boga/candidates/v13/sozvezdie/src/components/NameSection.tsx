import { memo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock, Copy, Hash, Link2, MapPin, Quote, Share2, Sparkles, User } from "lucide-react";
import { useState } from "react";
import { NAMES, PARTS, type NameEntry } from "../data/names";
import { scriptAttrs, scriptLabel } from "../utils/script";
import { readerToAtlas } from "../data/topicCrosswalk";
import Reveal from "./Reveal";
import Tilt from "./Tilt";
import Tetragrammaton from "./Tetragrammaton";

const FACT_ICONS = {
  book: BookOpen,
  hash: Hash,
  map: MapPin,
  clock: Clock,
  user: User,
  sparkle: Sparkles,
} as const;

interface NameSectionProps {
  name: NameEntry;
  index: number;
  completed: boolean;
  isActive: boolean;
  onJump: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onNotify: (text: string, sub?: string) => void;
}

function NameSection({
  name,
  index,
  completed,
  isActive,
  onJump,
  onToggleComplete,
  onNotify,
}: NameSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const url = () => `${window.location.origin}${window.location.pathname}#${name.id}`;
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      onNotify("Ссылка скопирована", name.translit);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.history.replaceState(null, "", `#${name.id}`);
      onNotify("Адрес раздела в строке браузера", name.translit);
    }
  };

  const copyVerse = async () => {
    const text = `«${name.verse.text}»\n— ${name.verse.ref}\n\n${name.translit} · ${name.russian}\n${url()}`;
    try {
      await navigator.clipboard.writeText(text);
      onNotify("Стих скопирован", name.verse.ref);
    } catch {
      onNotify("Не удалось скопировать", "Выделите текст вручную");
    }
  };

  const share = async () => {
    try {
      await navigator.share({
        title: `${name.translit} — ${name.russian} · Имена Бога`,
        text: `«${name.verse.text}» — ${name.verse.ref}`,
        url: url(),
      });
    } catch {
      /* user cancelled */
    }
  };
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const wmY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const wmOpacity = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0, 1, 1, 0]);

  const flip = index % 2 === 1;
  const num = String(index + 1).padStart(2, "0");
  const attrs = scriptAttrs(name);
  const part = PARTS[name.part - 1];
  const counterpartId = readerToAtlas.get(name.id);
  const prev = index > 0 ? NAMES[index - 1] : null;
  const next = index < NAMES.length - 1 ? NAMES[index + 1] : null;
  const jump = onJump;
  const related = (name.related ?? [])
    .map((id) => NAMES.find((n) => n.id === id))
    .filter((n): n is NameEntry => !!n);

  return (
    <section
      ref={ref}
      id={name.id}
      className="relative scroll-mt-28 overflow-clip py-20 md:py-28"
    >
      {/* giant hebrew watermark */}
      <motion.span
        aria-hidden
        style={{ y: wmY, opacity: wmOpacity }}
        className={`pointer-events-none absolute top-1/2 select-none font-hebrew font-bold leading-none blur-[1px] transition-colors duration-1000 ${
          isActive ? "text-gold-500/[0.1]" : "text-gold-500/[0.045]"
        } ${
          flip ? "-right-8 md:-right-16" : "-left-8 md:-left-16"
        } -rotate-6 text-[34vw] md:text-[24rem]`}
      >
        {name.hebrew}
      </motion.span>

      <div className="reader-measure relative mx-auto px-6">
        {/* Subtle active-section reading guide; no floating marker beside prose. */}
        <span
          data-reader-guide
          aria-hidden
          className={`pointer-events-none absolute -left-1 top-0 hidden h-full w-px origin-top transition-all duration-1000 ease-out md:block ${
            isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
          }`}
          style={{ background: "linear-gradient(to bottom, transparent, rgba(236,211,154,0.85) 18%, rgba(212,175,55,0.35) 70%, transparent)" }}
        />
        {/* header */}
        <Reveal>
          <div
            className={`flex items-center gap-4 font-ui text-[10px] font-medium uppercase tracking-[0.4em] text-gold-400/90`}
          >
            <span>Раздел {num} / {NAMES.length}</span>
            <span className="hairline flex-1" />
            <span className="text-right text-cream-500">
              Часть {part.numeral}
              <span className="hidden lg:inline"> · {part.title} · {scriptLabel(name)}</span>
            </span>
          </div>
        </Reveal>

        <div className="mt-10 grid items-start gap-10 md:mt-14 md:grid-cols-12 md:gap-8">
          {/* left / name block */}
          <Reveal className={`md:col-span-5 md:sticky md:top-24 ${flip ? "md:order-2" : ""}`}>
            <div className={flip ? "md:text-right" : ""}>
              <motion.p
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className={`select-none font-hebrew text-6xl font-medium leading-tight transition-[color,text-shadow] duration-1000 md:text-7xl ${
                  isActive ? "glow-gold-strong text-gold-200" : "glow-gold text-gold-300"
                }`}
                {...attrs}
              >
                {name.hebrew}
              </motion.p>
              <h3 className="mt-6 font-display text-4xl font-semibold italic text-cream-50 md:text-5xl">
                {name.translit}
              </h3>
              <p className="mt-2 font-display text-xl text-cream-300">{name.russian}</p>
              <div className={`mt-6 flex items-center gap-3 ${flip ? "md:justify-end" : ""}`}>
                <span className="h-px w-8 bg-gold-500/50" />
                <p className="font-ui text-[10px] uppercase tracking-[0.3em] text-gold-400">
                  {name.meaning}
                </p>
              </div>
              <p className="mt-6 font-body text-lg italic leading-relaxed text-cream-500">
                «{name.tagline}»
              </p>
              {counterpartId && (
                <a
                  href={`/imena-boga/atlas/#name-${encodeURIComponent(counterpartId)}`}
                  className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-gold-500/35 bg-gold-500/[0.07] px-4 py-2 font-ui text-[10px] uppercase tracking-[0.16em] text-gold-200 transition-colors hover:border-gold-400/70 hover:bg-gold-500/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400"
                  aria-label={`Перейти к соответствующему разделу «${name.translit}» в Астролябии`}
                >
                  <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                  Астролябия · исследовать имя
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
              <div className={`mt-8 flex flex-wrap gap-2.5 ${flip ? "md:justify-end" : ""}`}>
                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-cream-800/60 px-4 font-ui text-[9px] uppercase tracking-[0.2em] text-cream-500 transition-all hover:border-gold-500/45 hover:text-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400"
                  aria-label={`Скопировать ссылку на ${name.translit}`}
                  aria-live="polite"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Link2 className="h-3.5 w-3.5" />}
                  {copied ? "Скопировано" : "Ссылка"}
                </button>
                {canShare && (
                  <button
                    type="button"
                    onClick={share}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-cream-800/60 px-4 font-ui text-[9px] uppercase tracking-[0.2em] text-cream-500 transition-all hover:border-gold-500/45 hover:text-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400"
                    aria-label={`Поделиться разделом ${name.translit}`}
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    Поделиться
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onToggleComplete(name.id)}
                  aria-pressed={completed}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 font-ui text-[9px] uppercase tracking-[0.2em] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400 ${
                    completed
                      ? "border-gold-400/70 bg-gold-500/15 text-gold-200 shadow-[0_0_22px_-6px_rgba(212,175,55,0.65)]"
                      : "border-cream-800/60 text-cream-500 hover:border-gold-500/45 hover:text-gold-300"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                  {completed ? "Изучено" : "Отметить"}
                </button>
              </div>
            </div>
          </Reveal>

          {/* right / content */}
          <div className={`md:col-span-7 ${flip ? "md:order-1" : ""}`}>
            {name.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.08 + i * 0.08}>
                <p
                  className={`reader-body font-body text-cream-300 ${i > 0 ? "mt-5" : ""}`}
                >
                  {p}
                </p>
              </Reveal>
            ))}

            {/* verse card */}
            <Reveal delay={0.15}>
              <Tilt className="mt-9" max={7}>
                <div className="card-parchment sheen relative overflow-hidden rounded-2xl border border-gold-500/25 p-8 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.85)] md:p-9">
                  <span className="absolute -right-6 -top-6 select-none font-hebrew text-8xl text-gold-500/10">
                    ”
                  </span>
                  <Quote className="h-5 w-5 text-gold-400" strokeWidth={1.5} />
                  <p className="mt-4 font-display text-xl font-medium italic leading-relaxed text-cream-100 md:text-2xl">
                    «{name.verse.text}»
                  </p>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="font-ui text-[11px] font-medium uppercase tracking-[0.35em] text-gold-400">
                      — {name.verse.ref}
                    </p>
                    <button
                      type="button"
                      onClick={copyVerse}
                      className="relative z-10 inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gold-500/25 px-3 py-1.5 font-ui text-[8.5px] uppercase tracking-[0.2em] text-cream-400 transition-all hover:border-gold-400/60 hover:bg-gold-500/10 hover:text-gold-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
                      aria-label={`Скопировать стих ${name.verse.ref}`}
                    >
                      <Copy className="h-3 w-3" strokeWidth={1.5} />
                      Копировать стих
                    </button>
                  </div>
                </div>
              </Tilt>
            </Reveal>

            {/* Unboxed reference notes keep the article readable. */}
            <div className="mt-8 grid gap-6 border-t border-gold-500/15 pt-6 sm:grid-cols-3">
              {name.facts.map((f, i) => {
                const Icon = FACT_ICONS[f.icon];
                return (
                  <Reveal key={f.label} delay={0.1 + i * 0.08} className="h-full">
                    <div className="h-full">
                      <Icon className="h-4 w-4 text-gold-500/80" strokeWidth={1.5} />
                      <p className="mt-3 font-ui text-[9px] uppercase tracking-[0.25em] text-cream-700">
                        {f.label}
                      </p>
                      <p className="mt-1 font-body text-[15px] leading-snug text-cream-300">
                        {f.value}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {name.id === "yhwh" && <Tetragrammaton />}

            {/* related names — the name in its scriptural context */}
            {related.length > 0 && (
              <Reveal delay={0.1}>
                <div className="mt-10 border-t border-gold-500/15 pt-6">
                  <p className="font-ui text-[9px] font-medium uppercase tracking-[0.35em] text-cream-700">
                    {name.id === "yhwh" ? "Имя в контексте: «Я есмь» и составные имена" : "Связанные имена"}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {related.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => jump(r.id)}
                        className="group flex items-center gap-2.5 rounded-full border border-cream-800/60 bg-ink-900/50 py-2 pl-4 pr-3 transition-all duration-300 hover:border-gold-500/50 hover:bg-ink-800 hover:shadow-[0_0_20px_-6px_rgba(212,175,55,0.4)]"
                        aria-label={`Перейти к имени ${r.translit}`}
                      >
                        <span
                          {...scriptAttrs(r)}
                          className="font-hebrew text-sm text-gold-400/80 transition-colors group-hover:text-gold-300"
                        >
                          {r.hebrew}
                        </span>
                        <span className="font-ui text-[9px] uppercase tracking-[0.2em] text-cream-500 transition-colors group-hover:text-cream-200">
                          {r.translit}
                        </span>
                        <ArrowRight className="h-3 w-3 text-cream-800 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-gold-400" strokeWidth={1.5} />
                      </button>
                    ))}
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </div>

        {/* prev / next navigation */}
        <div className="mt-16 flex items-stretch justify-between gap-4 border-t border-gold-500/15 pt-8">
          {prev ? (
            <button
              type="button"
              onClick={() => jump(prev.id)}
              className="group flex max-w-[46%] items-center gap-4 text-left"
              aria-label={`Предыдущее имя: ${prev.translit}`}
            >
              <ArrowLeft className="h-4 w-4 shrink-0 text-cream-700 transition-all duration-300 group-hover:-translate-x-1 group-hover:text-gold-300" strokeWidth={1.5} />
              <span>
                <span className="block font-ui text-[9px] uppercase tracking-[0.3em] text-cream-700 transition-colors group-hover:text-gold-500">
                  Предыдущее
                </span>
                <span className="mt-1 block font-display text-lg italic leading-tight text-cream-300 transition-colors group-hover:text-gold-200">
                  {prev.translit}
                </span>
              </span>
            </button>
          ) : (
            <span />
          )}
          {next ? (
            <button
              type="button"
              onClick={() => jump(next.id)}
              className="group ml-auto flex max-w-[46%] items-center justify-end gap-4 text-right"
              aria-label={`Следующее имя: ${next.translit}`}
            >
              <span>
                <span className="block font-ui text-[9px] uppercase tracking-[0.3em] text-cream-700 transition-colors group-hover:text-gold-500">
                  Следующее
                </span>
                <span className="mt-1 block font-display text-lg italic leading-tight text-cream-300 transition-colors group-hover:text-gold-200">
                  {next.translit}
                </span>
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-cream-700 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold-300" strokeWidth={1.5} />
            </button>
          ) : (
            <span />
          )}
        </div>
      </div>
    </section>
  );
}

export default memo(NameSection);
