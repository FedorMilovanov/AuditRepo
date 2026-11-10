import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, type MotionValue } from "framer-motion";
import {
  ArrowUp,
  Columns2,
  Keyboard,
  Minus,
  Plus,
  Printer,
  Sparkles,
  Square,
  Volume2,
  X,
} from "lucide-react";
import type { NameEntry } from "../data/names";
import type { FontSize, Measure } from "../App";

interface ReaderDockProps {
  visible: boolean;
  progress: MotionValue<number>;
  exactProgress: MotionValue<number>;
  completedCount: number;
  totalCount: number;
  activeName: NameEntry | null;
  font: FontSize;
  measure: Measure;
  motionOn: boolean;
  onFont: (f: FontSize) => void;
  onMeasure: (m: Measure) => void;
  onMotion: (on: boolean) => void;
  onTop: () => void;
}

const FONT_ORDER: FontSize[] = ["sm", "md", "lg"];

const SHORTCUTS: [string, string][] = [
  ["← →  /  J K", "Предыдущее / следующее имя"],
  ["M", "Отметить раздел изученным"],
  ["/", "Поиск по именам"],
  ["Esc", "Закрыть окно"],
];

function cancelSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}

// The ring itself is informative. Only the compact mobile presentation
// has a disclosure control; desktop must not expose an inert button in Tab order.
function ProgressRing({
  progress, pct, completedCount, expanded = false,
}: {
  progress: MotionValue<number>;
  pct: number;
  completedCount: number;
  expanded?: boolean;
}) {
  return (
    <>
      <svg viewBox="0 0 36 36" className="h-8 w-8 -rotate-90 sm:h-9 sm:w-9" aria-hidden="true">
        <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(74,66,50,0.5)" strokeWidth="2" />
        <motion.circle
          cx="18" cy="18" r="15" fill="none" stroke="#d4af37"
          strokeWidth="2" strokeLinecap="round" style={{ pathLength: progress }}
        />
      </svg>
      <span className="absolute font-ui text-xs tabular-nums text-gold-300" aria-hidden="true">
        {expanded ? <X className="h-3 w-3 sm:hidden" /> : null}
        <span className={expanded ? "hidden sm:inline" : ""}>{pct}</span>
      </span>
      {completedCount > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 font-ui text-xs font-semibold tabular-nums text-ink-950 shadow-[0_0_10px_rgba(212,175,55,0.55)]"
        >
          {completedCount}
        </span>
      )}
    </>
  );
}

export default function ReaderDock({
  visible,
  progress,
  exactProgress,
  completedCount,
  totalCount,
  activeName,
  font,
  measure,
  motionOn,
  onFont,
  onMeasure,
  onMotion,
  onTop,
}: ReaderDockProps) {
  const [speaking, setSpeaking] = useState(false);
  const [pct, setPct] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const [headerSlot, setHeaderSlot] = useState<HTMLElement | null>(null);
  const [compact, setCompact] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 1279px)").matches
  );
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const media = window.matchMedia("(max-width: 1279px)");
    const update = () => {
      setCompact(media.matches);
      setHeaderSlot(document.getElementById("sozvezdie-header-reader-slot"));
    };
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // The compact toolbar lives inside the site header and never obscures prose.
  useEffect(() => {
    if (!compact || !expanded) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setExpanded(false);
      mobileTriggerRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [compact, expanded]);

  // The decorative ring may spring, but the numeric percentage tracks real scroll.
  useEffect(() => {
    const sync = (v: number) => setPct(Math.round(v * 100));
    sync(exactProgress.get());
    return exactProgress.on("change", sync);
  }, [exactProgress]);

  // Speech must never outlive its visible control.
  useEffect(() => {
    cancelSpeech();
    setSpeaking(false);
  }, [activeName?.id]);

  useEffect(() => {
    if (!visible) {
      cancelSpeech();
      setSpeaking(false);
      setShowKeys(false);
    }
  }, [visible]);

  useEffect(() => () => cancelSpeech(), []);

  useEffect(() => {
    if (!showKeys) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setShowKeys(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showKeys]);

  const ttsAvailable = typeof window !== "undefined" && "speechSynthesis" in window;

  const toggleSpeech = () => {
    if (!ttsAvailable || !activeName) return;
    if (speaking) {
      cancelSpeech();
      setSpeaking(false);
      return;
    }
    cancelSpeech();
    const u = new SpeechSynthesisUtterance(
      `${activeName.translit}. ${activeName.russian}. ${activeName.paragraphs.join(" ")} ${activeName.verse.ref}. ${activeName.verse.text}`,
    );
    u.lang = "ru-RU";
    const ru = window.speechSynthesis
      .getVoices()
      .find((voice) => voice.lang.toLowerCase().replace("_", "-").startsWith("ru"));
    if (ru) u.voice = ru;
    u.rate = 0.97;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  const stepFont = (dir: 1 | -1) => {
    const i = FONT_ORDER.indexOf(font);
    onFont(FONT_ORDER[Math.min(FONT_ORDER.length - 1, Math.max(0, i + dir))]);
  };

  if (!visible) return null;

  const btn =
    "flex h-11 w-11 items-center justify-center rounded-full text-cream-400 transition-all duration-300 hover:bg-gold-500/15 hover:text-gold-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 disabled:pointer-events-none disabled:opacity-30";
  const divider = <span aria-hidden="true" className="hidden h-px w-7 shrink-0 bg-cream-800/60 xl:block" />;

  const toolbar = (
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        data-reader-dock
        className={`${compact ? "relative z-10 flex-row" : "fixed bottom-5 right-2 z-40 w-14 flex-col gap-1 py-2"} flex items-center gap-0.5 rounded-full border border-gold-500/20 bg-ink-950 px-1.5 py-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.75)]`}
        role="toolbar"
        aria-label="Настройки чтения"
      >
        {/* Mobile: a real disclosure button controlling the compact tools. */}
        <button
          type="button"
          ref={mobileTriggerRef}
          onClick={() => setExpanded((v) => !v)}
          aria-controls="reader-dock-options"
          aria-expanded={expanded}
          aria-label={`Прочитано ${pct}%. ${expanded ? "Свернуть" : "Развернуть"} панель чтения`}
          title={`Прочитано ${pct}% · изучено ${completedCount} из ${totalCount}`}
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full xl:hidden"
        >
          <ProgressRing progress={progress} pct={pct} completedCount={completedCount} expanded={expanded} />
        </button>
        {/* Desktop: progress is read-only; keyboard focus skips this indicator. */}
        <div
          role="img"
          aria-label={`Прочитано ${pct}%. Изучено ${completedCount} из ${totalCount}`}
          title={`Прочитано ${pct}% · изучено ${completedCount} из ${totalCount}`}
          className="relative hidden h-10 w-10 shrink-0 items-center justify-center rounded-full xl:mb-1 xl:flex"
        >
          <ProgressRing progress={progress} pct={pct} completedCount={completedCount} />
        </div>

        <div id="reader-dock-options" className={`${expanded ? "grid" : "hidden"} absolute top-full right-0 mt-2 grid-cols-3 items-center gap-1 rounded-2xl border border-gold-500/25 bg-ink-950 p-2 shadow-xl xl:static xl:mt-0 xl:flex xl:flex-col xl:gap-1 xl:border-0 xl:bg-transparent xl:p-0 xl:shadow-none`}>
          {divider}
          <button type="button" className={btn} onClick={() => stepFont(1)} disabled={font === "lg"} title="Крупнее шрифт" aria-label="Увеличить шрифт">
            <Plus className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button type="button" className={btn} onClick={() => stepFont(-1)} disabled={font === "sm"} title="Мельче шрифт" aria-label="Уменьшить шрифт">
            <Minus className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className={`${btn} hidden md:flex ${measure === "wide" ? "bg-gold-500/15 text-gold-200" : ""}`}
            onClick={() => onMeasure(measure === "wide" ? "narrow" : "wide")}
            title={measure === "wide" ? "Узкая колонка" : "Широкая колонка"}
            aria-label="Ширина колонки"
            aria-pressed={measure === "wide"}
          >
            <Columns2 className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className={`${btn} ${!motionOn ? "bg-gold-500/15 text-gold-200" : ""}`}
            onClick={() => onMotion(!motionOn)}
            title={motionOn ? "Выключить анимации" : "Включить анимации"}
            aria-label="Анимации"
            aria-pressed={!motionOn}
          >
            <Sparkles className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className={`${btn} ${speaking ? "bg-gold-500/20 text-gold-200 shadow-[0_0_16px_rgba(212,175,55,0.35)]" : ""}`}
            onClick={toggleSpeech}
            disabled={!ttsAvailable || !activeName}
            title={activeName ? `Озвучить: ${activeName.translit}` : "Озвучка доступна в разделе имени"}
            aria-label={speaking ? "Остановить озвучку" : "Озвучить текущий раздел"}
          >
            {speaking ? <Square className="h-3.5 w-3.5 fill-current" /> : <Volume2 className="h-4 w-4" strokeWidth={1.5} />}
          </button>
          <button type="button" className={`${btn} hidden sm:flex`} onClick={() => window.print()} title="Печать статьи" aria-label="Печать">
            <Printer className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            className={`${btn} hidden xl:flex ${showKeys ? "bg-gold-500/15 text-gold-200" : ""}`}
            onClick={() => setShowKeys((v) => !v)}
            title="Горячие клавиши"
            aria-label="Горячие клавиши"
            aria-expanded={showKeys}
            aria-controls={showKeys ? "reader-shortcut-reference" : undefined}
          >
            <Keyboard className="h-4 w-4" strokeWidth={1.5} />
          </button>
          {divider}
          <button type="button" className={btn} onClick={onTop} title="Наверх" aria-label="Наверх">
            <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </motion.div>
  );

  return (
    <>
      {compact && headerSlot ? createPortal(toolbar, headerSlot) : toolbar}

      <AnimatePresence>
        {showKeys && (
          <motion.div
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-5 right-[4.75rem] z-40 hidden w-72 rounded-2xl border border-gold-500/25 bg-ink-950/95 p-5 shadow-[0_24px_60px_rgba(0,0,0,0.85)] backdrop-blur-md xl:block"
            id="reader-shortcut-reference"
            role="region"
            aria-label="Горячие клавиши"
          >
            <p className="font-ui text-xs uppercase tracking-[0.35em] text-gold-400">Горячие клавиши</p>
            <dl className="mt-4 space-y-2.5">
              {SHORTCUTS.map(([key, label]) => (
                <div key={key} className="flex items-center justify-between gap-4">
                  <dt>
                    <kbd className="rounded border border-cream-800/80 bg-ink-900 px-1.5 py-0.5 font-ui text-xs text-gold-300">{key}</kbd>
                  </dt>
                  <dd className="text-right font-body text-sm text-cream-300">{label}</dd>
                </div>
              ))}
            </dl>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
