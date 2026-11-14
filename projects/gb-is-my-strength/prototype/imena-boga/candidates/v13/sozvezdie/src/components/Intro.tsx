import { Printer } from "lucide-react";
import { NAMES, PARTS } from "../data/names";
import Reveal from "./Reveal";

export default function Intro({ onSelect }: { onSelect: (id: string) => void }) {
  const totalWords = NAMES.reduce(
    (acc, n) => acc + n.paragraphs.join(" ").trim().split(/\s+/).length,
    0,
  );
  const minutes = Math.max(5, Math.round(totalWords / 170));
  return (
    <section id="intro" className="relative scroll-mt-24 py-28 [overflow-wrap:anywhere] md:py-36">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <p className="flex min-w-0 flex-wrap items-center gap-2 font-ui text-xs font-medium uppercase tracking-[0.1em] text-gold-400 sm:gap-4 sm:tracking-[0.45em]">
            <span className="hairline w-10" />
            Введение
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 font-display text-4xl font-medium leading-tight text-cream-100 md:text-6xl">
            Что значит <span className="gold-static italic">имя</span> Божие?
          </h2>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-6 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 font-ui text-xs font-medium uppercase tracking-[0.1em] sm:tracking-[0.3em] text-cream-500">
            <a
              href="https://gospod-bog.ru/about/"
              className="inline-flex min-h-11 items-center text-gold-400 transition-colors hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Фёдор Милованов
            </a>
            <span className="h-1 w-1 rotate-45 bg-cream-700" />
            <span className="min-w-0 break-words [overflow-wrap:anywhere]">Исследование</span>
            <span className="h-1 w-1 rotate-45 bg-cream-700" />
            <span>{NAMES.length} именований</span>
            <span className="h-1 w-1 rotate-45 bg-cream-700" />
            <span>≈ {minutes} мин чтения</span>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 border border-cream-800/60 px-3 py-1.5 text-xs text-cream-500 transition-all duration-300 hover:border-gold-500/50 hover:text-gold-300"
              aria-label="Распечатать статью"
            >
              <Printer className="h-3.5 w-3.5" strokeWidth={1.5} />
              Печать
            </button>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="drop-cap mt-10 font-body text-xl leading-[1.85] text-cream-300">
            В Писании имя нередко говорит больше, чем просто «как кого зовут».
            Переименование Аврама в Авраама или Симона в Петра связано с
            обещанием и призванием. Когда Бог открывает Своё имя Моисею, речь
            тоже идёт не о словаре обозначений: Он обещает быть с народом и
            вывести его из рабства (Исх 3:12–15).
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mt-8 font-body text-xl leading-[1.85] text-cream-300">
            От Элохим в первой строке Бытия до «Авва, Отче» в молитве Христа
            библейский текст показывает разные грани одного откровения. Здесь
            можно читать последовательно или выбрать любой раздел в боковом
            указателе. Возвращаясь к тексту Писания, мы различаем то, что
            говорит сам стих, и то, как его осмысляет христианская традиция.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <blockquote className="relative my-14 border-l-2 border-gold-500/50 pl-8">
            <p className="font-display text-2xl font-medium italic leading-snug text-gold-200 md:text-3xl">
              «Сущий послал меня к вам… это имя Моё в вечности, и памятование
              о Мне в род и род».
            </p>
            <cite className="mt-4 block font-ui text-xs not-italic uppercase tracking-[0.3em] text-cream-500">Исход 3:14–15</cite>
          </blockquote>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="border-y border-gold-500/20 py-9">
            <p className="font-ui text-xs font-medium uppercase tracking-[0.35em] text-gold-400">Как устроено исследование</p>
            <h3 className="mt-4 font-display text-3xl text-cream-100">{NAMES.length} именований. Не закрытый список.</h3>
            <p className="mt-4 font-body text-lg leading-relaxed text-cream-300">
              Писание не даёт одного исчерпывающего перечня «всех имён Бога».
              Здесь вместе собраны собственное имя ЯХВЕ, обращения, титулы,
              метафоры и фразы, которыми библейские авторы описывают Господа.
              Например, «Господь там» — имя города у Иезекииля, а «Господь —
              Пастырь мой» — исповедание псалмопевца. Они важны для темы, но
              не являются отдельными собственными именами в том же смысле,
              что тетраграмматон. Еврейские, арамейские и греческие формы
              сохранены на языке соответствующего текста.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <nav className="mt-14" aria-label="Части исследования">
            <p className="mb-6 font-ui text-xs uppercase tracking-[0.35em] text-cream-500">Путь чтения</p>
            {PARTS.map((part, i) => {
              const first = NAMES.find((n) => n.part === i + 1);
              if (!first) return null;
              return (
                <button
                  key={part.id}
                  type="button"
                  onClick={() => onSelect(first.id)}
                  className="group flex min-h-16 w-full min-w-0 items-center gap-3 border-b border-gold-500/15 py-4 text-left transition-colors hover:border-gold-400/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400"
                >
                  <span className="w-8 shrink-0 font-display text-2xl italic text-gold-500">{part.numeral}</span>
                  <span className="min-w-0 flex-1 break-words font-display text-2xl text-cream-100 transition-colors group-hover:text-gold-300">{part.title}</span>
                  <span className="ml-auto shrink-0 font-ui text-xs text-cream-500 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-300">↗</span>
                </button>
              );
            })}
          </nav>
        </Reveal>
      </div>
    </section>
  );
}
