import Reveal from "./Reveal";
import type { NameEntry } from "../data/names";
import { scriptAttrs } from "../utils/script";

interface PartDividerProps {
  numeral: string;
  title: string;
  desc: string;
  entries: NameEntry[];
  onSelect: (id: string) => void;
}

export default function PartDivider({ numeral, title, desc, entries, onSelect }: PartDividerProps) {
  return (
    <div className="relative overflow-hidden py-20 md:py-28">
      {/* faint roman numeral backdrop */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[16rem] font-semibold text-gold-500/[0.05] md:text-[24rem]"
      >
        {numeral}
      </span>

      <div className="relative mx-auto max-w-3xl px-6">
        <Reveal>
          <div className="flex items-center gap-6">
            <span className="hairline flex-1" />
            <span className="font-display text-2xl italic text-gold-500/80">{numeral}</span>
            <span className="hairline flex-1" />
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="gold-text mt-8 text-center font-display text-5xl font-semibold leading-tight md:text-6xl">
            {title}
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-xl text-center font-body text-lg italic leading-relaxed text-cream-500">
            {desc}
          </p>
        </Reveal>

        {/* chips of names inside this part */}
        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {entries.map((entry) => {
              const attrs = scriptAttrs(entry);
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => onSelect(entry.id)}
                  className="group rounded-full border border-cream-800/60 bg-ink-900/50 px-4 py-2 transition-all duration-300 hover:border-gold-500/50 hover:bg-ink-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
                  aria-label={`Перейти к имени ${entry.translit}`}
                >
                  <span
                    {...attrs}
                    className="font-hebrew text-sm text-gold-400/80 transition-colors duration-300 group-hover:text-gold-300"
                  >
                    {entry.hebrew}
                  </span>
                  <span className="mx-2 text-[10px] text-cream-700">·</span>
                  <span className="font-ui text-[9px] uppercase tracking-[0.2em] text-cream-500 transition-colors duration-300 group-hover:text-cream-300">
                    {entry.translit}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>
    </div>
  );
}
