import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from "framer-motion";
import NameTree from "./components/NameTree";
import Toast, { type ToastMessage } from "./components/Toast";
import Hero from "./components/Hero";
import Intro from "./components/Intro";
import PartDivider from "./components/PartDivider";
import NameSection from "./components/NameSection";
import Rails from "./components/Rails";
import Epilogue from "./components/Epilogue";
import MobileIndex from "./components/MobileIndex";
import NameGrid from "./components/NameGrid";
import ReaderDock from "./components/ReaderDock";
import { NAMES, PARTS } from "./data/names";
import { scriptAttrs } from "./utils/script";
import { BookOpen } from "lucide-react";

export type FontSize = "sm" | "md" | "lg";
export type Measure = "narrow" | "wide";

const PREFS_KEY = "gb-imena-prefs-v1";
const PROGRESS_KEY = "gb-imena-progress-v1";
const LAST_KEY = "gb-imena-last-v1";

function loadPrefs(): { font: FontSize; measure: Measure; motion: boolean } {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        font: p.font === "sm" || p.font === "lg" ? p.font : "md",
        measure: p.measure === "wide" ? "wide" : "narrow",
        motion: p.motion !== false,
      };
    }
  } catch {
    /* private mode */
  }
  return { font: "md", measure: "narrow", motion: true };
}

function loadProgress(): Set<string> {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    const valid = new Set(NAMES.map((name) => name.id));
    return new Set(parsed.filter((id): id is string => typeof id === "string" && valid.has(id)));
  } catch {
    return new Set();
  }
}

export default function App() {
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [inArticle, setInArticle] = useState(false);
  const [prefs, setPrefs] = useState(loadPrefs);
  const [completedIds, setCompletedIds] = useState<Set<string>>(loadProgress);
  const [resumeId, setResumeId] = useState<string | null>(() => {
    try {
      if (window.location.hash) return null;
      const id = localStorage.getItem(LAST_KEY);
      return id && id !== "yhwh" && NAMES.some((n) => n.id === id) ? id : null;
    } catch {
      return null;
    }
  });
  const mainRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
  }, [prefs]);

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify([...completedIds]));
    } catch {
      /* ignore */
    }
  }, [completedIds]);

  // One viewport marker drives header state, active section AND rail visibility.
  // Rails are bound to the <main> article region so they can never overlap the
  // wide "Созвездие имён" grid or the intro above it.
  useEffect(() => {
    const sections = NAMES.map((n) => document.getElementById(n.id)).filter(
      (el): el is HTMLElement => !!el,
    );
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > 60);
        const marker = window.innerHeight * 0.44;
        const current = sections.find((section) => {
          const rect = section.getBoundingClientRect();
          return rect.top <= marker && rect.bottom > marker;
        });
        if (current) setActive(current.id);
        const m = mainRef.current?.getBoundingClientRect();
        setInArticle(!!m && m.top < window.innerHeight * 0.5 && m.bottom > window.innerHeight * 0.5);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollTo = useCallback((id: string) => {
    if (NAMES.some((n) => n.id === id)) setActive(id);
    window.history.pushState(null, "", `#${id}`);
    document.getElementById(id)?.scrollIntoView({
      behavior: !prefs.motion || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start",
    });
  }, [prefs.motion]);

  const toggleComplete = useCallback((id: string) => {
    setCompletedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearProgress = useCallback(() => setCompletedIds(new Set()), []);

  // ——— resume reading ———
  useEffect(() => {
    if (!active) return;
    try {
      localStorage.setItem(LAST_KEY, active);
    } catch {
      /* ignore */
    }
  }, [active]);
  useEffect(() => {
    if (inArticle) setResumeId(null);
  }, [inArticle]);

  // ——— toasts ———
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastTimer = useRef(0);
  const notify = useCallback((text: string, sub?: string, tone: ToastMessage["tone"] = "default") => {
    window.clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), text, sub, tone });
    toastTimer.current = window.setTimeout(() => setToast(null), tone === "gold" ? 5200 : 2400);
  }, []);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  // Celebrate the moment every name has been studied (not on page load).
  const prevCompleted = useRef(completedIds.size);
  useEffect(() => {
    const prev = prevCompleted.current;
    prevCompleted.current = completedIds.size;
    if (prev < NAMES.length && completedIds.size === NAMES.length) {
      notify(`Все ${NAMES.length} имён изучены`, "«Господь Бог — сила моя» · Soli Deo Gloria", "gold");
    }
  }, [completedIds, notify]);

  const toggleCompleteWithToast = useCallback(
    (id: string) => {
      const name = NAMES.find((n) => n.id === id);
      const willComplete = !completedIds.has(id);
      toggleComplete(id);
      if (willComplete && completedIds.size + 1 < NAMES.length) {
        notify("Отмечено как изученное", `${name?.translit} · ${completedIds.size + 1} из ${NAMES.length}`);
      }
    },
    [completedIds, notify, toggleComplete],
  );

  // ——— keyboard navigation: ← → / J K between names, M to mark ———
  const activeRef = useRef(active);
  const inArticleRef = useRef(inArticle);
  activeRef.current = active;
  inArticleRef.current = inArticle;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      // Navigation shortcuts must never hijack an active button/link/dialog.
      if (t?.closest('input, textarea, select, button, a, [role="dialog"], [role="menu"], [contenteditable="true"]')) return;
      if (e.metaKey || e.ctrlKey || e.altKey || !inArticleRef.current) return;
      const idx = NAMES.findIndex((n) => n.id === activeRef.current);
      if (idx < 0) return;
      const key = e.key.toLowerCase();
      if (key === "arrowright" || key === "j" || key === "о") {
        e.preventDefault();
        if (idx < NAMES.length - 1) scrollTo(NAMES[idx + 1].id);
      } else if (key === "arrowleft" || key === "k" || key === "л") {
        e.preventDefault();
        if (idx > 0) scrollTo(NAMES[idx - 1].id);
      } else if (key === "m" || key === "ь") {
        e.preventDefault();
        toggleCompleteWithToast(NAMES[idx].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scrollTo, toggleCompleteWithToast]);

  useEffect(() => {
    const followHash = () => {
      let id: string;
      try {
        id = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return; // A malformed external fragment must not crash navigation.
      }
      if (!id) return;
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: "instant", block: "start" });
      if (NAMES.some((name) => name.id === id)) setActive(id);
    };
    const timeout = window.setTimeout(followHash, 120);
    window.addEventListener("hashchange", followHash);
    window.addEventListener("popstate", followHash);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("hashchange", followHash);
      window.removeEventListener("popstate", followHash);
    };
  }, []);

  // render name sections interleaved with part dividers
  let renderedPart = 0;
  const blocks: ReactNode[] = [];
  NAMES.forEach((name, i) => {
    if (renderedPart !== name.part) {
      renderedPart = name.part;
      const part = PARTS[name.part - 1];
      blocks.push(
        <PartDivider
          key={part.id}
          numeral={part.numeral}
          title={part.title}
          desc={part.desc}
          entries={NAMES.filter((n) => n.part === name.part)}
          onSelect={scrollTo}
        />,
      );
    }
    blocks.push(
      <NameSection
        key={name.id}
        name={name}
        index={i}
        completed={completedIds.has(name.id)}
        onJump={scrollTo}
        isActive={active === name.id}
        onToggleComplete={toggleCompleteWithToast}
        onNotify={notify}
      />,
    );
  });

  const activeEntry = NAMES.find((n) => n.id === active);
  const activeIdx = NAMES.findIndex((n) => n.id === active);

  return (
    <MotionConfig reducedMotion={prefs.motion ? "user" : "always"}>
    <div
      className="vignette noise relative min-h-screen bg-ink-950 font-body text-cream-100"
      data-motion={prefs.motion ? "on" : "off"}
      style={
        {
          "--body-size": prefs.font === "sm" ? "1rem" : prefs.font === "lg" ? "1.1875rem" : "1.0625rem",
          "--measure": prefs.measure === "wide" ? "56rem" : "48rem",
        } as React.CSSProperties
      }
    >
      {/* top progress bar */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[60] h-[2.5px] origin-left bg-gradient-to-r from-gold-700 via-gold-400 to-gold-200 shadow-[0_0_12px_rgba(212,175,55,0.6)]"
        style={{ scaleX: progress }}
      />

      {/* skip link for keyboard readers */}
      <a
        href="#yhwh"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:border focus:border-gold-500 focus:bg-ink-950 focus:px-6 focus:py-3 focus:font-ui focus:text-xs focus:uppercase focus:tracking-[0.25em] focus:text-gold-300"
      >
        Сразу к ЯХВЕ
      </a>

      {/* header */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled ? "border-b border-gold-500/10 bg-ink-950/85 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-1.5 sm:gap-4 sm:px-6">
          <a
            href="https://gospod-bog.ru"
            className="flex min-h-11 min-w-0 shrink items-center whitespace-nowrap font-ui text-[10px] font-medium uppercase tracking-[0.1em] text-cream-300 transition-colors hover:text-gold-300 min-[400px]:tracking-[0.25em] lg:tracking-[0.35em]"
          >
            Господь Бог — Сила Моя
          </a>

          {/* live current-section state */}
          {activeEntry && inArticle ? (
            <button
              type="button"
              onClick={() => scrollTo("sozvezdie")}
              title="Открыть указатель всех имён"
              className="group hidden min-w-0 items-center gap-3 rounded-full border border-gold-500/20 bg-ink-900/70 px-4 py-1.5 transition-colors hover:border-gold-400/50 sm:flex"
            >
              <span
                className="font-hebrew text-sm leading-none text-gold-300"
                {...scriptAttrs(activeEntry)}
              >
                {activeEntry.hebrew}
              </span>
              <span className="h-1 w-1 rotate-45 bg-gold-500/60" />
              <span className="truncate font-ui text-[10px] uppercase tracking-[0.22em] text-cream-200 group-hover:text-gold-200">
                {activeEntry.translit}
              </span>
              <span className="font-ui text-[9px] tabular-nums text-cream-700">
                {String(activeIdx + 1).padStart(2, "0")}/{NAMES.length}
              </span>
            </button>
          ) : (
            <span className="hidden font-hebrew text-sm text-gold-400/90 sm:block">שְׁמוֹת</span>
          )}

          <a
            href="https://gospod-bog.ru/articles/"
            aria-label="Библиотека статей"
            className="group flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap font-ui text-[10px] font-medium uppercase tracking-[0.25em] text-cream-500 transition-colors hover:text-gold-300 lg:tracking-[0.35em]"
          >
            <BookOpen className="h-4 w-4 text-gold-400 min-[400px]:hidden" strokeWidth={1.5} aria-hidden="true" />
            <span className="hidden min-[400px]:inline">Библиотека</span>
            <span aria-hidden="true" className="hidden h-1 w-1 rotate-45 bg-gold-500 transition-transform duration-300 group-hover:rotate-[135deg] min-[400px]:inline-block" />
          </a>
        </div>
      </motion.header>

      <Hero motionOn={prefs.motion} />
      <Intro onSelect={scrollTo} />
      <NameTree active={active} completedIds={completedIds} onSelect={scrollTo} motionOn={prefs.motion} />
      <NameGrid
        active={active}
        completedIds={completedIds}
        onSelect={scrollTo}
        onClearProgress={clearProgress}
      />

      {inArticle && <Rails active={active} completedIds={completedIds} wide={prefs.measure === "wide"} onSelect={scrollTo} />}
      <MobileIndex active={active} completedIds={completedIds} onSelect={scrollTo} visible={inArticle} />

      <main ref={mainRef}>{blocks}</main>

      <Epilogue motionOn={prefs.motion} completedIds={completedIds} onSelect={scrollTo} />

      <ReaderDock
        visible={inArticle}
        progress={progress}
        completedCount={completedIds.size}
        totalCount={NAMES.length}
        activeName={activeEntry ?? null}
        font={prefs.font}
        measure={prefs.measure}
        motionOn={prefs.motion}
        onFont={(font) => setPrefs((p) => ({ ...p, font }))}
        onMeasure={(measure) => setPrefs((p) => ({ ...p, measure }))}
        onMotion={(motionOn) => setPrefs((p) => ({ ...p, motion: motionOn }))}
        onTop={() => window.scrollTo({
          top: 0,
          behavior: !prefs.motion || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        })}
      />

      <AnimatePresence>
        {resumeId && !inArticle && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-gold-500/35 bg-ink-950/90 p-1 pl-1 shadow-[0_18px_50px_rgba(0,0,0,0.8),0_0_40px_-12px_rgba(212,175,55,0.45)] backdrop-blur-md"
            role="region"
            aria-label="Продолжить чтение"
          >
            <button
              type="button"
              onClick={() => {
                const id = resumeId;
                setResumeId(null);
                scrollTo(id);
              }}
              className="group flex items-center gap-3 rounded-full py-2 pl-4 pr-3 transition-colors hover:bg-gold-500/10"
            >
              <span className="font-ui text-[9px] uppercase tracking-[0.25em] text-cream-500">Продолжить</span>
              <span {...scriptAttrs(NAMES.find((n) => n.id === resumeId)!)} className="font-hebrew text-sm text-gold-300">
                {NAMES.find((n) => n.id === resumeId)?.hebrew}
              </span>
              <span className="max-w-[9rem] truncate font-display text-base italic text-cream-100 group-hover:text-gold-200 sm:max-w-none">
                {NAMES.find((n) => n.id === resumeId)?.translit}
              </span>
              <span className="text-gold-400 transition-transform group-hover:translate-x-0.5">→</span>
            </button>
            <button
              type="button"
              onClick={() => setResumeId(null)}
              aria-label="Скрыть"
              className="flex h-8 w-8 items-center justify-center rounded-full text-cream-700 transition-colors hover:bg-gold-500/10 hover:text-gold-300"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <Toast toast={toast} />
    </div>
    </MotionConfig>
  );
}
