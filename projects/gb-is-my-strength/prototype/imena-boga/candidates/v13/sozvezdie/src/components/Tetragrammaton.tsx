import { useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotionConfig } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Tilt from "./Tilt";

interface Letter {
  key: string;
  glyph: string;
  name: string;
  value: number;
  note: string;
  ref?: string;
}

/** Written right-to-left, exactly as the name stands in the Hebrew text: י ה ו ה */
const LETTERS: Letter[] = [
  {
    key: "yod",
    glyph: "י",
    name: "Йод",
    value: 10,
    note: "Самая маленькая буква еврейского письма. Именно её имеет в виду Христос, говоря, что «ни одна иота» не прейдёт из закона, пока не исполнится всё.",
    ref: "Матфея 5:18",
  },
  {
    key: "he-1",
    glyph: "ה",
    name: "Хе",
    value: 5,
    note: "Пятая буква еврейского алфавита. Обозначает согласный /h/; конкретный смысл Божьего имени нельзя вывести из символики отдельной буквы. Изменение имён Аврама и Сары в Бытии 17 требует самостоятельной экзегезы.",
    ref: "Бытие 17:5, 15",
  },
  {
    key: "vav",
    glyph: "ו",
    name: "Вав",
    value: 6,
    note: "Шестая буква еврейского алфавита. Как отдельное слово וְ часто выступает союзом «и». Историческая форма или название буквы не дают оснований приписывать ей отдельное пророческое значение внутри тетраграмматона.",
    ref: "Исход 26:32",
  },
  {
    key: "he-2",
    glyph: "ה",
    name: "Хе",
    value: 5,
    note: "Вторая «хе» замыкает имя. Четыре согласных записаны без гласных, поэтому точное древнее произношение не сохранилось, а форма «Яхве» — научная реконструкция.",
  },
];

const CHAIN = [
  { label: "Текст", value: "יהוה", sub: "4 согласные", he: true },
  { label: "Чтение", value: "אֲדֹנָי", sub: "«Адонай»", he: true },
  { label: "Септуагинта", value: "Κύριος", sub: "«Кириос»", he: false },
  { label: "Синодальный", value: "Господь", sub: "обычно «Господь»", he: false },
];

export default function Tetragrammaton({ motionOn }: { motionOn: boolean }) {
  const [selected, setSelected] = useState("yod");
  const letterTabs = useRef<Array<HTMLButtonElement | null>>([]);
  const onTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex = index;
    // The visual sequence is right-to-left: ArrowLeft advances toward the left.
    if (event.key === "ArrowLeft") nextIndex = (index + 1) % LETTERS.length;
    else if (event.key === "ArrowRight") nextIndex = (index - 1 + LETTERS.length) % LETTERS.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = LETTERS.length - 1;
    else return;
    event.preventDefault();
    setSelected(LETTERS[nextIndex].key);
    letterTabs.current[nextIndex]?.focus();
  };
  const reduced = useReducedMotionConfig();
  const current = LETTERS.find((l) => l.key === selected) ?? LETTERS[0];
  const sum = LETTERS.reduce((acc, l) => acc + l.value, 0);

  return (
    <div id="tetragrammaton" className="mt-12 scroll-mt-28 border-t border-gold-500/15 pt-8">
      <p className="font-ui text-xs font-medium uppercase tracking-[0.35em] text-gold-400">
        Анатомия имени · тетраграмматон
      </p>
      <p className="mt-2 flex items-center gap-2 font-body text-sm italic text-cream-500">
        <ArrowLeft className="h-3.5 w-3.5 shrink-0 text-gold-600" strokeWidth={1.5} />
        Иврит читается справа налево — выберите букву
      </p>

      <div dir="rtl" className="mt-6 grid grid-cols-4 gap-2 sm:gap-3" role="tablist" aria-label="Четыре буквы имени ЯХВЕ">
        {LETTERS.map((letter, i) => {
          const on = letter.key === selected;
          return (
            <motion.div
              key={letter.key}
              initial={reduced ? false : { opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.85, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <Tilt max={12} className="rounded-2xl" enabled={motionOn}>
                <button
                  ref={(element) => { letterTabs.current[i] = element; }}
                  type="button"
                  role="tab"
                  id={`letter-tab-${letter.key}`}
                  tabIndex={on ? 0 : -1}
                  aria-selected={on}
                  aria-controls="letter-panel"
                  onKeyDown={(event) => onTabKeyDown(event, i)}
                  onClick={() => setSelected(letter.key)}
                  className={`group relative flex aspect-[3/4] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border transition-all duration-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 ${
                    on
                      ? "border-gold-400/70 bg-gradient-to-b from-ink-700 via-ink-800 to-ink-900 shadow-[0_0_45px_-10px_rgba(212,175,55,0.6)]"
                      : "border-cream-800/60 bg-ink-900/60 hover:border-gold-500/40"
                  }`}
                >
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gold-500/15 to-transparent transition-opacity duration-500 ${
                      on ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span
                    lang="he"
                    className={`relative font-hebrew text-4xl font-medium leading-none transition-all duration-500 sm:text-6xl ${
                      on ? "glow-gold-strong scale-110 text-gold-200" : "text-gold-400/70 group-hover:text-gold-300"
                    }`}
                  >
                    {letter.glyph}
                  </span>
                  <span dir="ltr" className="relative mt-2 font-ui text-xs uppercase tracking-[0.2em] text-cream-200 sm:mt-3 sm:text-xs">
                    {letter.name}
                  </span>
                  <span dir="ltr" className="relative mt-0.5 font-display text-sm italic text-gold-500">
                    {letter.value}
                  </span>
                </button>
              </Tilt>
            </motion.div>
          );
        })}
      </div>

      <div
        id="letter-panel"
        role="tabpanel"
        aria-labelledby={`letter-tab-${selected}`}
        tabIndex={0}
        className="relative mt-4 min-h-[132px] overflow-hidden rounded-2xl border border-gold-500/15 bg-ink-900/50 p-5"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={current.key}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
          >
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span lang="he" className="font-hebrew text-2xl text-gold-300">
                {current.glyph}
              </span>
              <span className="font-display text-xl font-semibold text-cream-100">{current.name}</span>
              {current.ref && (
                <span className="ml-auto font-ui text-xs uppercase tracking-[0.25em] text-gold-500">{current.ref}</span>
              )}
            </p>
            <p className="mt-2 font-body text-[15.5px] leading-relaxed text-cream-300">{current.note}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <p className="mt-3 text-right font-ui text-xs uppercase tracking-[0.18em] text-cream-700">
        числовые значения букв в традиционной системе счёта · {sum}
      </p>
      <p className="mt-2 font-body text-xs leading-relaxed text-cream-600">
        Эти числовые значения не являются самостоятельным богословским толкованием имени и не служат основанием для скрытых пророческих смыслов.
      </p>

      <p className="mt-9 font-ui text-xs font-medium uppercase tracking-[0.35em] text-cream-500">
        Как имя дошло до русского текста
      </p>
      <ol className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {CHAIN.map((step, i) => (
          <motion.li
            key={step.label}
            initial={reduced ? false : { opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.12 }}
            className="relative rounded-xl border border-cream-800/50 bg-ink-900/40 px-3 py-4 text-center"
          >
            <span className="absolute left-2 top-1.5 font-ui text-xs text-cream-700">{i + 1}</span>
            <span
              lang={step.he ? "he" : undefined}
              dir={step.he ? "rtl" : undefined}
              className={`block text-xl text-gold-300 ${step.he ? "font-hebrew" : "font-display italic"}`}
            >
              {step.value}
            </span>
            <span className="mt-1.5 block font-ui text-xs uppercase tracking-[0.18em] text-cream-300">{step.label}</span>
            <span className="mt-0.5 block font-body text-xs italic text-cream-500">{step.sub}</span>
          </motion.li>
        ))}
      </ol>
      <p className="mt-4 font-body text-sm italic leading-relaxed text-cream-500">
        Поэтому, встречая в Синодальном переводе слово «Господь», читатель чаще всего видит именно
        имя ЯХВЕ, а не титул. Форма «Иегова» возникла позже — из согласных тетраграмматона и
        гласных слова «Адонай».
      </p>
    </div>
  );
}
