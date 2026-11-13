import { ArrowLeft, ArrowUpRight, Mail, Send } from "lucide-react";
import Reveal from "./Reveal";
import Starfield from "./Starfield";
import { NAMES } from "../data/names";

const FURTHER = [
  {
    title: "Нагорная проповедь: исследование в 5 частях",
    note: "Сравнительный разбор Матфея 5–7 и Луки 6:17–49",
    href: "https://gospod-bog.ru/nagornaya/seriya/",
  },
  {
    title: "Отступники: падение и возвращение",
    note: "Что говорит Писание об отступлении от веры",
    href: "https://gospod-bog.ru/otstupniki/",
  },
];

interface EpilogueProps {
  motionOn: boolean;
  completedIds: Set<string>;
  onSelect: (id: string) => void;
}

export default function Epilogue({ motionOn, completedIds, onSelect }: EpilogueProps) {
  const completedCount = completedIds.size;
  const total = NAMES.length;
  const done = completedCount >= total;
  const pct = Math.round((completedCount / total) * 100);
  const nextUnread = NAMES.find((n) => !completedIds.has(n.id)) ?? null;
  return (
    <footer className="relative overflow-hidden pt-24 md:pt-32">
      {/* atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,#1d180d_0%,#0a0907_70%)]" />
      <Starfield density={0.6} paused={!motionOn} />
      <div className="absolute bottom-0 left-1/2 h-[380px] w-[680px] -translate-x-1/2 translate-y-1/3 rounded-full bg-gold-500/[0.08] blur-[110px]" />

      <div className="relative mx-auto max-w-3xl px-[16px] pb-16 text-center sm:px-6">
        <Reveal>
          <span
            className="glow-gold block select-none font-hebrew text-6xl font-medium text-gold-300 md:text-7xl"
            dir="rtl"
          >
            שְׁמוֹת
          </span>
          <p className="mt-3 font-ui text-xs uppercase tracking-[0.4em] text-cream-500">
            Шмот — «Имена» (ивритское название книги Исход)
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-14 font-body text-xl leading-[1.85] text-cream-300 md:text-2xl">
            Эти библейские именования ведут читателя через Писание. Сначала Бог
            открывает Моисею Своё имя у горящего куста; затем звучат исповедания,
            титулы, эпитеты и названия мест и жертвенников. В Евангелии Сын
            говорит «Я есмь», а имя «Эммануил» напоминает: «с нами Бог».
            Здесь рассмотрено {NAMES.length} выражений — но не {NAMES.length}
            самостоятельных личных имён Бога.
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <p className="gold-text mt-10 font-display text-3xl font-semibold italic md:text-4xl">
            Soli Deo Gloria
          </p>
          <p className="mt-3 font-body italic text-cream-500">
            «Господь Бог — сила моя… и на высоты мои возведёт меня» — Аввакум 3:19
          </p>
        </Reveal>

        {/* reader's journey summary */}
        <Reveal delay={0.3}>
          <div className="mx-auto mt-12 flex max-w-md flex-col items-center gap-4 rounded-3xl border border-gold-500/20 bg-ink-900/55 px-[16px] py-6 backdrop-blur-sm sm:px-6">
            <div className="relative h-20 w-20">
              <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90" aria-hidden>
                <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(74,66,50,0.55)" strokeWidth="1.5" />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#d4af37"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray={`${(pct / 100) * 100.5} 100.5`}
                  style={{ filter: "drop-shadow(0 0 3px rgba(212,175,55,0.7))", transition: "stroke-dasharray 1s ease" }}
                />
              </svg>
              <span className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-2xl font-semibold leading-none text-gold-200">{completedCount}</span>
                <span className="font-ui text-xs tracking-[0.2em] text-cream-500">из {total}</span>
              </span>
            </div>
            <p className="font-ui text-xs uppercase tracking-[0.3em] text-cream-300">
              {done ? "Путь пройден целиком" : completedCount === 0 ? "Ваш путь по именам" : "Изучено на этом устройстве"}
            </p>
            {!done && nextUnread && (
              <button
                type="button"
                onClick={() => onSelect(nextUnread.id)}
                className="group inline-flex min-h-[44px] min-w-0 max-w-full flex-wrap items-center justify-center gap-[8px] rounded-full border border-gold-500/35 px-[12px] py-[10px] text-center font-ui text-xs uppercase tracking-normal text-gold-300 transition-all hover:border-gold-400/70 hover:bg-gold-500/10 sm:px-5 sm:py-2.5 sm:tracking-[0.22em]"
              >
                {completedCount === 0 ? "Начать с" : "Следующее неизученное"} · {nextUnread.translit}
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </button>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mx-auto mt-16 h-px w-40 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
        </Reveal>

        {/* further reading from the library */}
        <Reveal delay={0.4}>
          <div className="mt-14 text-left">
            <p className="text-center font-ui text-xs font-medium uppercase tracking-[0.4em] text-cream-500">
              Читать дальше в библиотеке
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {FURTHER.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  data-library-further-link
                  className="group flex min-w-0 max-w-full flex-col justify-between rounded-2xl border border-cream-800/50 bg-ink-900/60 p-[16px] transition-all duration-300 hover:border-gold-500/40 hover:bg-ink-850 sm:p-6"
                >
                  <span>
                    <span className="min-w-0 break-words [overflow-wrap:anywhere] font-display text-xl font-semibold leading-snug text-cream-100 transition-colors group-hover:text-gold-200">
                      {item.title}
                    </span>
                    <span className="mt-2 block font-body text-sm italic leading-relaxed text-cream-500">
                      {item.note}
                    </span>
                  </span>
                  <ArrowUpRight
                    className="mt-5 h-4 w-4 text-cream-700 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-400"
                    strokeWidth={1.5}
                  />
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.45}>
          <a
            href="https://gospod-bog.ru"
            data-library-return-link
            className="group mt-12 inline-flex min-h-[44px] min-w-0 max-w-full flex-wrap items-center justify-center gap-[8px] rounded-full border border-gold-500/30 bg-ink-900/70 px-[12px] py-[12px] text-center font-ui text-xs font-medium uppercase tracking-normal text-gold-300 transition-all duration-300 hover:border-gold-400/60 hover:bg-ink-800 hover:shadow-[0_0_40px_rgba(212,175,55,0.18)] sm:gap-3 sm:px-8 sm:py-4 sm:tracking-[0.3em]"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={1.5} />
            <span data-library-return-text className="min-w-0 whitespace-normal break-normal [overflow-wrap:normal]">Вернуться в библиотеку</span>
          </a>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="mt-12 flex min-w-0 flex-col items-center justify-center gap-4 font-ui text-xs tracking-normal text-cream-500 sm:flex-row sm:tracking-[0.15em]">
            <a
              href="mailto:viktorcoy2012@gmail.com"
              className="inline-flex min-h-[44px] min-w-0 max-w-full flex-wrap items-center justify-center gap-[6px] rounded-lg px-[8px] text-center transition-colors hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-offset-2 sm:min-h-11 sm:gap-2 sm:px-2"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
              <span className="min-w-0 break-all [overflow-wrap:anywhere]">viktorcoy2012@gmail.com</span>
            </a>
            <span className="hidden h-1 w-1 rotate-45 bg-cream-700 sm:block" />
            <a
              href="https://t.me/fedormilovanov"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[44px] min-w-0 max-w-full flex-wrap items-center justify-center gap-[6px] rounded-lg px-[8px] text-center transition-colors hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-offset-2 sm:min-h-11 sm:gap-2 sm:px-2"
            >
              <Send className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
              <span className="min-w-0 break-all [overflow-wrap:anywhere]">t.me/fedormilovanov</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.55}>
          <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-cream-800/40 pt-8 font-ui text-xs uppercase tracking-[0.25em] text-cream-700 md:flex-row">
            <span>Господь Бог — Сила Моя</span>
            <span>Библиотека Фёдора Милованова</span>
            <span>© 2026 · Изучайте медленно</span>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
