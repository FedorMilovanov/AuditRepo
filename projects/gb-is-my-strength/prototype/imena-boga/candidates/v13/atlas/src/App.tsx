import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ARTICLE_SECTIONS,
  DIVINE_NAMES,
  DivineNameEntry,
} from './data/divineNames';
import { SiteNavbar } from './components/SiteNavbar';
import { SacredAstrolabeHero } from './components/SacredAstrolabeHero';
import { LateralNamePillars } from './components/LateralNamePillars';
import { DivineNameTiltCard } from './components/DivineNameTiltCard';
import { DivineConstellationExplorer } from './components/DivineConstellationExplorer';
import { TetragrammatonAnatomy } from './components/TetragrammatonAnatomy';
import { CovenantAltarsAtlas } from './components/CovenantAltarsAtlas';
import { HebrewGreekLexiconMatrix } from './components/HebrewGreekLexiconMatrix';
import { ScriptureRefPill } from './components/ScriptureRefPill';
import { SevenIAmStatements } from './components/SevenIAmStatements';
import { NamesIndexTable } from './components/NamesIndexTable';
import { NearViewport } from './components/NearViewport';
import { DivineNameModal } from './components/DivineNameModal';
import { FeatureLoadBoundary } from './components/FeatureLoadBoundary';
import {
  BookOpen,
  Sparkles,
  ScrollText,
  ShieldCheck,
  Mail,
  Send,
  ArrowUpRight,
  ArrowUp,
  Compass,
  X,
  ChevronsUpDown,
} from 'lucide-react';

// Primary dossier is eager for responsiveness; only optional quiz is deferred.
const TheologicalQuiz = lazy(() =>
  import('./components/TheologicalQuiz').then(({ TheologicalQuiz }) => ({ default: TheologicalQuiz }))
);

type ReaderTheme = 'light' | 'sepia' | 'dark';

const SUMMARY_THESES = [
  'В Библии имя Бога — не магический инструмент контроля, а заветное самооткровение Его сущности, святости и неизменной верности.',
  'Элохим, Эль и Адонай — самостоятельные обозначения Бога; ЯХВЕ — Его собственное имя в контексте Завета. Каждое выражение рассматривается в своём библейском и языковом контексте.',
  'Выражения с именем ЯХВЕ возникают в конкретных событиях и текстах Ветхого Завета; их связь со Христом требует внимательной экзегезы, а не автоматического переноса каждого названия на Голгофу.',
  'В Новом Завете вся полнота Божественного Имени сосредоточена в Иисусе Христе — Воплощённом Логосе, «Я есмь», Авве Отце и Альфе и Омеге.',
];

const RELATED_LIBRARY_ARTICLES = [
  {
    tag: 'Богословие · Христология',
    title: 'Сердце Христа: образ Отца, Спаситель врагов, сила немощным',
    meta: '44 мин чтения · Серия о сердце',
    href: 'https://gospod-bog.ru/articles/serdce-hrista-k-nemoshchnym/',
  },
  {
    tag: 'Богословие · Благоговение',
    title: 'Страх Божий: рабский или сыновний',
    meta: '25 мин чтения · Экзегеза Писания',
    href: 'https://gospod-bog.ru/articles/strah-bozhij-rabskij-ili-synovnij/',
  },
  {
    tag: 'Интерактивные карты',
    title: 'Путь Авраама — интерактивная библейская карта',
    meta: 'География Завета и жертвенников',
    href: 'https://gospod-bog.ru/karty/avraam/',
  },
  {
    tag: 'Биографии служителей',
    title: 'Джон Гилл (1697–1771). Часть II: Учёный — экзегеза, система, иврит',
    meta: '39 мин чтения · Историческое богословие',
    href: 'https://gospod-bog.ru/articles/dzhon-gill-chast-2-uchenyi/',
  },
];

export function App() {
  const [theme, setTheme] = useState<ReaderTheme>(() => {
    try {
      const raw = window.localStorage.getItem('gb:imena:atlas:reader-preferences:v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.theme === 'dark' || parsed?.theme === 'sepia' || parsed?.theme === 'light') {
          return parsed.theme;
        }
      }
    } catch {
      // Ignore storage access errors
    }
    return 'light';
  });

  const [fontScale, setFontScale] = useState<number>(() => {
    try {
      const raw = window.localStorage.getItem('gb:imena:atlas:reader-preferences:v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed?.fontScale === 'number' && parsed.fontScale >= 0.9 && parsed.fontScale <= 1.2) {
          return parsed.fontScale;
        }
      }
    } catch {
      // Ignore storage errors
    }
    return 1;
  });

  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [illuminateAll, setIlluminateAll] = useState<boolean>(false);

  // Track which divine names have progressively appeared as the reader scrolls down
  const [revealedIds, setRevealedIds] = useState<Set<string>>(() => {
    return new Set(['elohim', 'el']);
  });
  const [justRevealedIds, setJustRevealedIds] = useState<Set<string>>(() => new Set());

  // Track which divine names have been deeply studied in the modal
  const [studiedIds, setStudiedIds] = useState<Set<string>>(() => {
    try {
      const raw = window.localStorage.getItem('gb:imena:atlas:names-studied:v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return new Set(parsed);
        }
      }
    } catch {
      // Ignore storage errors
    }
    return new Set();
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('gb:imena:atlas:names-studied:v1', JSON.stringify(Array.from(studiedIds)));
    } catch {
      // Ignore storage errors
    }
  }, [studiedIds]);

  const handleToggleStudied = useCallback((id: string) => {
    setStudiedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const [activeNameId, setActiveNameId] = useState<string | null>('elohim');
  const [selectedModalEntry, setSelectedModalEntry] = useState<DivineNameEntry | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const allExpanded = expandedIds.size === DIVINE_NAMES.length;
  const handleToggleExpandAll = useCallback(() => {
    setExpandedIds((prev) =>
      prev.size === DIVINE_NAMES.length
        ? new Set()
        : new Set(DIVINE_NAMES.map((n) => n.id))
    );
  }, []);

  // Transient feedback toast (share/copy/print/bookmark)
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => setToast(null), 2800);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  // Reading-position memory
  const [resumePosition, setResumePosition] = useState<number | null>(() => {
    try {
      const raw = window.localStorage.getItem('gb:imena:atlas:reading-position:v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed?.y === 'number' && parsed.y > 1400) {
          return parsed.y;
        }
      }
    } catch {
      // Ignore storage errors
    }
    return null;
  });
  const [resumePercent, setResumePercent] = useState<number>(0);

  useEffect(() => {
    if (!resumePosition) return;
    const computePct = () => {
      const d = document.documentElement.scrollHeight - window.innerHeight;
      if (d > 0) {
        setResumePercent(Math.min(99, Math.max(1, Math.round((resumePosition / d) * 100))));
      }
    };
    computePct();
    window.addEventListener('resize', computePct);
    return () => window.removeEventListener('resize', computePct);
  }, [resumePosition, fontScale, expandedIds.size]);

  // Persist reader preferences (theme + fontScale)
  useEffect(() => {
    document.documentElement.setAttribute('data-reader-theme', theme);
    // Reflect reading mode in mobile browser chrome, not only the React tree.
    const themeColors: Record<ReaderTheme, string> = {
      light: '#fdfcf9',
      sepia: '#f4ede0',
      dark: '#0e1116',
    };
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', themeColors[theme]);
    try {
      const existingRaw = window.localStorage.getItem('gb:imena:atlas:reader-preferences:v1');
      const existing = existingRaw ? JSON.parse(existingRaw) : { version: 1 };
      window.localStorage.setItem(
        'gb:imena:atlas:reader-preferences:v1',
        JSON.stringify({ ...existing, theme, fontScale })
      );
    } catch {
      // Ignore storage errors
    }
  }, [theme, fontScale]);

  const markNewlyRevealed = useCallback((ids: string[]) => {
    if (ids.length === 0) return;
    setJustRevealedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.add(id));
      return next;
    });
    window.setTimeout(() => {
      setJustRevealedIds((prev) => {
        const next = new Set(prev);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    }, 1450);
  }, []);

  // Mirror of revealedIds for side-effect-free computation inside scroll handler
  const revealedRef = useRef<Set<string>>(revealedIds);
  useEffect(() => {
    revealedRef.current = revealedIds;
  }, [revealedIds]);

  // Progressive Scroll Revelation + Active Name Spy + Reading Progress
  const lastSavedRef = useRef<number>(0);
  const rafPendingRef = useRef<number>(0);
  // Browser scroll restoration is not a reader's intent to dismiss a bookmark.
  const userScrollIntentRef = useRef(false);
  useEffect(() => {
    const updateScrollState = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (docHeight > 0) {
        setScrollProgress(Math.min(1, Math.max(0, scrollTop / docHeight)));
      }

      const viewportTriggerLine = window.innerHeight * 0.72;
      const viewportCenter = window.innerHeight * 0.44;

      let closestId: string | null = null;
      let closestDistance = Infinity;
      const newlyRevealed: string[] = [];

      for (const entry of DIVINE_NAMES) {
        const el = document.getElementById(`name-${entry.id}`);
        if (!el) continue;
        const rect = el.getBoundingClientRect();

        if (rect.top <= viewportTriggerLine) {
          newlyRevealed.push(entry.id);
        }

        const cardCenter = rect.top + rect.height * 0.35;
        const dist = Math.abs(cardCenter - viewportCenter);
        if (dist < closestDistance) {
          closestDistance = dist;
          closestId = entry.id;
        }
      }

      // Compute genuinely new ids against the ref mirror (no side effects inside updaters)
      const genuinelyNew = newlyRevealed.filter((id) => !revealedRef.current.has(id));
      if (genuinelyNew.length > 0) {
        genuinelyNew.forEach((id) => revealedRef.current.add(id));
        setRevealedIds(new Set(revealedRef.current));
        markNewlyRevealed(genuinelyNew);
      }

      if (closestId) {
        setActiveNameId(closestId);
      }

      // Do not treat browser restoration or a layout-triggered scroll as intent.
      if (userScrollIntentRef.current && scrollTop > 900) {
        setResumePosition((prev) => (prev !== null ? null : prev));
      }

      // Persist reading position at most every 2.5s (avoids storage thrash)
      if (scrollTop > 1400 && Date.now() - lastSavedRef.current > 2500) {
        lastSavedRef.current = Date.now();
        try {
          window.localStorage.setItem(
            'gb:imena:atlas:reading-position:v1',
            JSON.stringify({ y: Math.round(scrollTop), at: Date.now() })
          );
        } catch {
          // Ignore storage errors
        }
      }
    };

    const scheduleUpdate = () => {
      if (rafPendingRef.current) return;
      rafPendingRef.current = window.requestAnimationFrame(() => {
        rafPendingRef.current = 0;
        updateScrollState();
      });
    };

    const markScrollIntent = (event: Event) => {
      if (event.type !== 'keydown') {
        userScrollIntentRef.current = true;
        return;
      }
      const key = (event as KeyboardEvent).key;
      if (!['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '].includes(key)) return;
      const target = event.target;
      if (target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))) return;
      userScrollIntentRef.current = true;
    };
    updateScrollState();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('wheel', markScrollIntent, { passive: true });
    window.addEventListener('touchstart', markScrollIntent, { passive: true });
    window.addEventListener('keydown', markScrollIntent);
    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('wheel', markScrollIntent);
      window.removeEventListener('touchstart', markScrollIntent);
      window.removeEventListener('keydown', markScrollIntent);
      if (rafPendingRef.current) window.cancelAnimationFrame(rafPendingRef.current);
    };
  }, [markNewlyRevealed]);

  // Manual scroll restoration: always start at the top so the resume prompt can appear
  useEffect(() => {
    try {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
    } catch {
      // Ignore in sandboxed iframes
    }
    window.scrollTo(0, 0);
  }, []);

  // Scroll-reveal animations for section headers and major blocks
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (targets.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleResumeReading = useCallback(() => {
    if (!resumePosition) return;
    window.scrollTo({ top: resumePosition, behavior: 'smooth' });
    setResumePosition(null);
  }, [resumePosition]);

  const handleDismissResume = useCallback(() => {
    setResumePosition(null);
    try {
      window.localStorage.removeItem('gb:imena:atlas:reading-position:v1');
    } catch {
      // Ignore storage errors
    }
  }, []);

  const handleShare = useCallback(async () => {
    const shareData = {
      title: 'Имена Бога в Писании — Господь Бог: Сила Моя',
      text: 'От Элохим и Яхве до Альфы и Омеги: 36 имён Божиих с экзегезой, лексикой и христологией.',
      url: window.location.href,
    };
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      showToast('Ссылка на исследование скопирована');
    } catch {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Ссылка на исследование скопирована');
      } catch {
        showToast('Не удалось скопировать ссылку');
      }
    }
  }, [showToast]);

  const handlePrint = useCallback(() => {
    showToast('Подготовка к печати / сохранению в PDF…');
    window.setTimeout(() => window.print(), 220);
  }, [showToast]);

  const handleFocusSearch = useCallback(() => {
    const atlas = document.getElementById('constellation-atlas');
    if (atlas) {
      atlas.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    window.setTimeout(() => {
      const input = document.getElementById('constellation-search-input') as HTMLInputElement | null;
      if (input) input.focus();
    }, 450);
  }, []);

  // Search keyboard ownership belongs to DivineConstellationExplorer.
  // Keeping a second global listener would duplicate navigation and focus.

  const ensureRevealed = useCallback(
    (id: string) => {
      if (!revealedRef.current.has(id)) {
        revealedRef.current.add(id);
        setRevealedIds(new Set(revealedRef.current));
        markNewlyRevealed([id]);
      }
    },
    [markNewlyRevealed]
  );

  const handleJumpToName = useCallback(
    (entry: DivineNameEntry) => {
      ensureRevealed(entry.id);
      setActiveNameId(entry.id);
      const el = document.getElementById(`name-${entry.id}`);
      if (el) {
        // Move the assistive-technology reading position with the visual jump.
        // The modal explicitly suppresses focus restoration for this action.
        el.focus({ preventScroll: true });
        el.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
          block: 'center',
        });
      }
    },
    [ensureRevealed]
  );

  const handleOpenName = useCallback(
    (entry: DivineNameEntry) => {
      ensureRevealed(entry.id);
      setSelectedModalEntry(entry);
      try {
        window.history.replaceState(null, '', `#name-${entry.id}`);
      } catch {
        // Ignore history errors in sandboxed iframes
      }
    },
    [ensureRevealed]
  );

  const handleCloseModal = useCallback(() => {
    setSelectedModalEntry(null);
    try {
      if (window.location.hash.startsWith('#name-')) {
        window.history.replaceState(
          null,
          '',
          window.location.pathname + window.location.search
        );
      }
    } catch {
      // Ignore history errors in sandboxed iframes
    }
  }, []);

  // Deep-link support on initial mount & hashchange if URL contains #name-<id>
  useEffect(() => {
    const navigateToHashName = () => {
      const hash = window.location.hash;
      if (!hash || !hash.startsWith('#name-')) return;
      const id = hash.replace('#name-', '').trim();
      const targetIdx = DIVINE_NAMES.findIndex((n) => n.id === id);
      if (targetIdx < 0) return;

      const target = DIVINE_NAMES[targetIdx];
      // Reveal all names up to and including the deep-linked entry
      let added = false;
      for (let i = 0; i <= targetIdx; i++) {
        const nid = DIVINE_NAMES[i].id;
        if (!revealedRef.current.has(nid)) {
          revealedRef.current.add(nid);
          added = true;
        }
      }
      if (added) {
        setRevealedIds(new Set(revealedRef.current));
      }
      setActiveNameId(target.id);
      setResumePosition(null);

      window.setTimeout(() => {
        const el = document.getElementById(`name-${target.id}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 260);
    };

    navigateToHashName();
    window.addEventListener('hashchange', navigateToHashName);
    return () => window.removeEventListener('hashchange', navigateToHashName);
  }, []);

  const handleSelectGlyphById = useCallback(
    (nameId: string) => {
      const found = DIVINE_NAMES.find((n) => n.id === nameId) || DIVINE_NAMES[0];
      handleOpenName(found);
    },
    [handleOpenName]
  );

  const handleStartReading = () => {
    const el = document.getElementById('article-introduction');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenAtlas = () => {
    const el = document.getElementById('constellation-atlas');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const activeSectionId = useMemo(() => {
    const entry = DIVINE_NAMES.find((n) => n.id === activeNameId);
    return entry ? entry.sectionId : null;
  }, [activeNameId]);

  return (
    <div id="top" className="paper-texture min-h-screen transition-colors duration-300">
      {/* Skip link for keyboard users */}
      <a
        href="#article-introduction"
        className="font-ui sr-only focus:not-sr-only focus:absolute focus:top-16 focus:left-4 focus:z-[60] focus:rounded-lg focus:border focus:px-4 focus:py-2 focus:text-xs focus:font-semibold"
        style={{
          backgroundColor: 'var(--gb-surface)',
          borderColor: 'var(--gb-gold)',
          color: 'var(--gb-accent)',
        }}
      >
        Перейти к содержанию статьи
      </a>

      {/* Top Glassmorphic Site Chrome */}
      <SiteNavbar
        theme={theme}
        onChangeTheme={setTheme}
        fontScale={fontScale}
        onChangeFontScale={setFontScale}
        progress={scrollProgress}
        revealedCount={illuminateAll ? DIVINE_NAMES.length : revealedIds.size}
        studiedCount={studiedIds.size}
        totalCount={DIVINE_NAMES.length}
        activeSectionId={activeSectionId}
        onOpenAtlas={handleOpenAtlas}
        onFocusSearch={handleFocusSearch}
        onShare={handleShare}
        onPrint={handlePrint}
      />

      {/* Left & Right Glowing Lateral Flanking Pillars of Divine Names + Luminous Ray */}
      <LateralNamePillars
        names={DIVINE_NAMES}
        revealedIds={revealedIds}
        justRevealedIds={justRevealedIds}
        studiedIds={studiedIds}
        activeNameId={activeNameId}
        scrollProgress={scrollProgress}
        illuminateAll={illuminateAll}
        onToggleIlluminateAll={() => setIlluminateAll((v) => !v)}
        onSelectName={handleOpenName}
        onJumpToName={handleJumpToName}
      />

      {/* Epic 3D Astrolabe & Interactive Sacred Medallion Hero */}
      <SacredAstrolabeHero
        theme={theme}
        onStartReading={handleStartReading}
        onOpenAtlas={handleOpenAtlas}
        onSelectGlyphName={handleSelectGlyphById}
      />

      {/* Central Editorial Reading Column (carefully padded so lateral pillars never collide) */}
      <main
        className="relative z-10 mx-auto max-w-[740px] px-5 pt-12 pb-28 sm:px-8 lg:max-w-[560px] xl:max-w-[710px] 2xl:max-w-[750px]"
        style={{ fontSize: `${fontScale}rem` }}
      >
        {/* Authentic gospod-bog.ru "Коротко" (Summary Card) */}
        <section
          aria-label="Коротко о главном"
          className="mb-9 rounded-2xl border p-5 sm:p-7"
          style={{
            backgroundColor: 'var(--gb-surface)',
            borderColor: 'var(--gb-gold)',
            boxShadow: 'var(--gb-shadow-lg)',
          }}
        >
          <div className="mb-4 flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--gb-border)' }}>
            <span
              className="font-serif-display text-lg sm:text-xl font-bold"
              style={{ color: 'var(--gb-accent)' }}
            >
              Коротко
            </span>
            <span className="font-ui text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--gb-gold-ink)' }}>
              Четыре тезиса исследования
            </span>
          </div>

          <div className="space-y-3.5">
            {SUMMARY_THESES.map((thesis, index) => (
              <div key={index} className="flex items-start gap-3.5">
                <span
                  className="font-serif-display mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
                  style={{
                    borderColor: 'var(--gb-gold)',
                    backgroundColor: 'var(--gb-accent-soft)',
                    color: 'var(--gb-accent)',
                  }}
                >
                  {index + 1}
                </span>
                <p
                  className="font-body-editorial text-[15px] sm:text-[15.5px] leading-relaxed"
                  style={{ color: 'var(--gb-ink)' }}
                >
                  {thesis}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Arena Battle's useful idea, rewritten as a clear research-stage contract.
            Never treat draft linguistic claims as approved publication evidence. */}
        <section
          aria-labelledby="gb-methodology-title"
          className="mb-10 rounded-2xl border p-5 sm:p-6"
          style={{ backgroundColor: 'var(--gb-surface)', borderColor: 'var(--gb-border)' }}
        >
          <h2
            id="gb-methodology-title"
            className="font-serif-display text-lg font-semibold sm:text-xl"
            style={{ color: 'var(--gb-ink)' }}
          >
            Как устроено исследование
          </h2>
          <p className="font-body-editorial mt-3 text-[15px] leading-relaxed" style={{ color: 'var(--gb-ink-secondary)' }}>
            Здесь собрано {DIVINE_NAMES.length} рабочих записей: имена и титулы,
            описания, образы и именования, связанные с библейскими повествованиями.
            Число записей справочника не означает, что в Писании существует
            именно столько самостоятельных имён Бога.
          </p>
          <details className="mt-4 rounded-lg border px-3 py-2" style={{ borderColor: 'var(--gb-border)' }}>
            <summary
              className="font-ui cursor-pointer text-xs font-semibold"
              style={{ color: 'var(--gb-accent)' }}
            >
              Метод и границы достоверности
            </summary>
            <div className="mt-3 space-y-2 text-[14px] leading-relaxed" style={{ color: 'var(--gb-ink-secondary)' }}>
              <p>
                Имя, титул, метафора, географическое название и богословское
                истолкование — разные категории. Их нельзя отождествлять
                без проверки контекста и грамматики исходного текста.
              </p>
              <p>
                Значения, транслитерации, отсылки к древним рукописям и
                христологические выводы требуют самостоятельной сверки.
                Пока исследовательский корпус не получил редакционного допуска,
                этот интерфейс остаётся рабочим прототипом, а не окончательной публикацией.
              </p>
            </div>
          </details>
        </section>

        {/* Table of Contents / Quick Study Map */}
        <nav
          aria-label="Оглавление исследования"
          data-reveal
          className="mb-12 rounded-2xl border p-5 sm:p-6"
          style={{
            backgroundColor: 'var(--gb-surface)',
            borderColor: 'var(--gb-border-strong)',
            boxShadow: 'var(--gb-shadow-sm)',
          }}
        >
          <div
            className="font-ui mb-3 flex flex-col items-start gap-1 text-xs font-bold tracking-wider uppercase sm:flex-row sm:items-center sm:justify-between"
            style={{ color: 'var(--gb-gold-ink)' }}
          >
            <span className="flex min-w-0 items-start gap-2">
              <BookOpen className="h-4 w-4 shrink-0" />
              Структура исследования (5 частей · 36 имён)
            </span>
            <span style={{ color: 'var(--gb-muted)' }}>Прокручивайте вниз</span>
          </div>

          <ol className="space-y-2">
            {ARTICLE_SECTIONS.map((sec) => {
              const sectionCount = DIVINE_NAMES.filter((n) => n.sectionId === sec.id).length;
              return (
                <li key={sec.id}>
                  <a
                    href={`#${sec.id}`}
                    className="group flex items-baseline justify-between gap-3 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <span className="font-body-editorial text-[15px] font-medium" style={{ color: 'var(--gb-ink)' }}>
                      <strong className="font-serif-display mr-2" style={{ color: 'var(--gb-accent)' }}>
                        {sec.roman}.
                      </strong>
                      {sec.title}
                    </span>
                    <span className="font-ui shrink-0 text-[11px]" style={{ color: 'var(--gb-muted)' }}>
                      {sectionCount} имён
                    </span>
                  </a>
                </li>
              );
            })}
            <li>
              <a
                href="#covenant-altars-atlas"
                className="group flex items-baseline justify-between gap-3 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              >
                <span className="font-body-editorial text-[15px] font-medium" style={{ color: 'var(--gb-ink)' }}>
                  <strong className="font-serif-display mr-2" style={{ color: 'var(--gb-gold-ink)' }}>
                    VI.
                  </strong>
                  Карта жертвенников и мест явления Имён Божьих
                </span>
                <span className="font-ui shrink-0 text-[11px]" style={{ color: 'var(--gb-muted)' }}>
                  10 мест
                </span>
              </a>
            </li>
            <li>
              <a
                href="#constellation-atlas"
                className="group flex items-baseline justify-between gap-3 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
              >
                <span className="font-body-editorial text-[15px] font-medium" style={{ color: 'var(--gb-ink)' }}>
                  <strong className="font-serif-display mr-2" style={{ color: 'var(--gb-gold-ink)' }}>
                    VII.
                  </strong>
                  Сводная скрижаль и поиск по всем 36 именам
                </span>
                <span className="font-ui shrink-0 text-[11px]" style={{ color: 'var(--gb-muted)' }}>
                  Справочник
                </span>
              </a>
            </li>
          </ol>
        </nav>

        {/* Reader Guide + Numeric Overview */}
        <section
          aria-label="Как читать это исследование"
          className="mb-12 rounded-2xl border p-5 sm:p-6"
          style={{
            backgroundColor: 'var(--gb-bg)',
            borderColor: 'var(--gb-border)',
          }}
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { value: '36', label: 'имён и титулов Бога', sub: 'иврит · арамейский · греческий' },
              { value: '5', label: 'частей-эпох', sub: 'от Творения до Троицы' },
              { value: '10', label: 'мест откровения', sub: 'на библейской карте' },
              { value: '4', label: 'режима чтения', sub: 'бумага · сепия · ночь · печать' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border p-3 text-center"
                style={{
                  backgroundColor: 'var(--gb-surface)',
                  borderColor: 'var(--gb-border)',
                }}
              >
                <div
                  className="font-serif-display text-2xl font-bold leading-none"
                  style={{ color: 'var(--gb-accent)' }}
                >
                  {stat.value}
                </div>
                <div className="font-ui mt-1 text-[11px] font-semibold" style={{ color: 'var(--gb-ink)' }}>
                  {stat.label}
                </div>
                <div className="font-ui mt-0.5 text-[10px] leading-snug" style={{ color: 'var(--gb-muted)' }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2.5 border-t pt-3.5 sm:flex-row sm:gap-5" style={{ borderColor: 'var(--gb-border)' }}>
            {[
              {
                icon: '☰',
                title: 'Боковые скрижали',
                text: 'Имена являются по мере чтения; нажмите на любое, чтобы открыть разбор.',
              },
              {
                icon: '◈',
                title: '3D-карточки и карта',
                text: 'Наклоняйте карточки курсором, исследуйте жертвенники и «созвездие» имён.',
              },
              {
                icon: '✓',
                title: 'Отметки изучения',
                text: 'В досье каждого имени ставьте «Изучено» — прогресс сохраняется в браузере.',
              },
            ].map((tip) => (
              <div key={tip.title} className="flex flex-1 items-start gap-2">
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px]"
                  style={{ backgroundColor: 'var(--gb-accent-soft)', color: 'var(--gb-accent)' }}
                  aria-hidden="true"
                >
                  {tip.icon}
                </span>
                <div>
                  <div className="font-ui text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--gb-gold-ink)' }}>
                    {tip.title}
                  </div>
                  <p className="font-ui mt-0.5 text-[11.5px] leading-snug" style={{ color: 'var(--gb-muted)' }}>
                    {tip.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Introduction Essay */}
        <section id="article-introduction" className="scroll-mt-24 space-y-5">
          <h2
            className="font-serif-display text-2xl sm:text-3xl font-bold leading-snug"
            style={{ color: 'var(--gb-ink)' }}
          >
            Почему Бог открывает Свои имена: не заклинание, а заветное самооткровение
          </h2>

          <div
            className="font-body-editorial space-y-5 text-[1.06em] leading-[1.82]"
            style={{ color: 'var(--gb-ink-secondary)' }}
          >
            <p>
              В древнем языческом мире знание имени божества считалось способом подчинить его своей
              воле — магическим рычагом, с помощью которого жрец или заклинатель пытался заставить
              небо служить человеческим страстям. Библия с первой до последней страницы разрушает
              этот подход (ср.{' '}
              <ScriptureRefPill
                reference="Быт. 32:29"
                synodalText="Спросил и Иаков, говоря: скажи мне имя Твоё. И Он сказал: на что ты спрашиваешь о имени Моём? И благословил его там."
                originalNote="Евр. לָמָּה זֶּה תִּשְׁאַל לִשְׁמִי — Бог пресекает попытку овладеть Его Именем, но дарует Своё благословение."
              />{' '}
              и{' '}
              <ScriptureRefPill
                reference="Суд. 13:18"
                synodalText="Ангел Господень сказал ему: что ты спрашиваешь об имени Моём? оно чудно."
                originalNote="Евр. פֶּלִאי (пели) — «чудно, непостижимо, превыше человеческого разумения»."
              />
              ). В Священном Писании имя Бога никогда не даётся человеку в качестве инструмента
              контроля; напротив, Сам Творец по Своей суверенной благодати открывает Своё имя,
              чтобы творение могло познать Его характер, доверять Его обетованиям и укрываться в
              Нём, как в неприступной крепости (
              <ScriptureRefPill
                reference="Притч. 18:11"
                synodalText="Имя Господа — крепкая башня: убегает в неё праведник — и безопасен."
                originalNote="Евр. מִגְדַּל־עֹז שֵׁם יְהוָה — «Башня силы — Имя Яхве»."
              />
              ).
            </p>

            <p>
              Как писал пуританский баптистский богослов <strong>Джон Гилл</strong> в третьей главе
              первой книги <em>«Системы догматического богословия»</em>, «имена лиц и вещей обычно
              суть первое, что становится о них известным; и если эти имена не познаны, нельзя
              ожидать глубокого познания самой сущности». Бесконечный и непостижимый Бог снисходит
              к человеческому языку, как отец наклоняется к ребёнку, и в разные эпохи истории
              искупления — у дубравы Мамре, у источника в пустыне Сур, у горящего тернового куста,
              на вершине горы Мориа, в долине Рефидим и, наконец, в Вифлееме и на Голгофе —
              произносит Свои имена.
            </p>

            <div
              className="rounded-2xl border-l-4 p-5 sm:p-6"
              style={{
                backgroundColor: 'var(--gb-surface-quote)',
                borderLeftColor: 'var(--gb-gold)',
              }}
            >
              <div
                className="font-ui mb-1.5 text-xs font-bold tracking-wider uppercase"
                style={{ color: 'var(--gb-gold-ink)' }}
              >
                Как читать имена Бога в Синодальном переводе
              </div>
              <p className="font-body-editorial text-[0.98em] leading-relaxed" style={{ color: 'var(--gb-ink)' }}>
                В русском Синодальном переводе разные еврейские имена часто передаются одними и теми
                же словами — «Бог» или «Господь». За словом <strong>«Бог»</strong> в оригинале
                чаще всего стоят <span className="font-hebrew font-bold">אֱלֹהִים</span> (<em>Элохим</em>)
                или <span className="font-hebrew font-bold">אֵל</span> (<em>Эль</em>). За словом{' '}
                <strong>«Господь»</strong> в Ветхом Завете в подавляющем большинстве случаев скрыт
                священный Тетраграмматон <span className="font-hebrew font-bold">יְהוָה</span> (<em>Яхве</em>),
                а в некоторых местах — титул владычества <span className="font-hebrew font-bold">אֲדֹנָי</span> (<em>Адонай</em>).
                Различение этих корней возвращает тексту Писания его первоначальную глубину.
              </p>
            </div>
          </div>

          {/* Interactive Hebrew -> LXX -> New Testament -> Synodal Matrix */}
          <HebrewGreekLexiconMatrix names={DIVINE_NAMES} onSelectName={handleOpenName} />

          {/* Global Reading Mode Bar: Expand / Collapse all 36 exegeses inline */}
          <div
            className="no-print mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 sm:px-5"
            style={{
              backgroundColor: 'var(--gb-surface)',
              borderColor: 'var(--gb-border-strong)',
            }}
          >
            <div className="font-ui text-xs" style={{ color: 'var(--gb-muted)' }}>
              <strong style={{ color: 'var(--gb-ink)' }}>Режим чтения карточек:</strong> вы можете
              открывать 3D-досье по нажатию или развернуть все 36 полных разборов прямо в потоке статьи.
            </div>
            <button
              type="button"
              onClick={handleToggleExpandAll}
              className="font-ui inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-colors hover:opacity-90"
              style={{
                backgroundColor: allExpanded ? 'var(--gb-accent)' : 'var(--gb-accent-soft)',
                borderColor: allExpanded ? 'var(--gb-accent)' : 'var(--gb-gold)',
                color: allExpanded ? '#ffffff' : 'var(--gb-accent)',
              }}
            >
              <ChevronsUpDown className="h-3.5 w-3.5" />
              <span>
                {allExpanded
                  ? 'Свернуть все 36 разборов'
                  : 'Развернуть все 36 разборов в тексте'}
              </span>
            </button>
          </div>
        </section>

        {/* All 5 Sections with Narrative Exposition + Interactive 3D Tilt Divine Name Cards */}
        {ARTICLE_SECTIONS.map((section) => {
          const sectionNames = DIVINE_NAMES.filter((n) => n.sectionId === section.id);

          return (
            <section key={section.id} id={section.id} className="scroll-mt-24 mt-20">
              {/* Section Ornamental Divider */}
              <div className="mb-8 flex items-center gap-4">
                <div className="h-[1px] flex-1" style={{ backgroundColor: 'var(--gb-border-strong)' }} />
                <span
                  className="font-serif-display inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold"
                  style={{
                    borderColor: 'var(--gb-gold)',
                    backgroundColor: 'var(--gb-surface)',
                    color: 'var(--gb-accent)',
                  }}
                >
                  {section.roman}
                </span>
                <div className="h-[1px] flex-1" style={{ backgroundColor: 'var(--gb-border-strong)' }} />
              </div>

              {/* Section Header */}
              <header className="mb-8" data-reveal>
                <div
                  className="font-ui text-xs font-semibold tracking-wider uppercase"
                  style={{ color: 'var(--gb-gold-ink)' }}
                >
                  Часть {section.roman} · {sectionNames.length} изучаемых имён и титулов
                </div>
                <h2
                  className="font-serif-display mt-1.5 text-2xl sm:text-4xl font-bold leading-tight"
                  style={{ color: 'var(--gb-ink)' }}
                >
                  {section.title}
                </h2>
                <p
                  className="font-body-editorial mt-2.5 text-base sm:text-lg"
                  style={{ color: 'var(--gb-muted)' }}
                >
                  {section.subtitle}
                </p>

                <blockquote
                  className="font-quote-editorial mt-5 border-l-2 pl-4 text-lg sm:text-xl italic"
                  style={{
                    borderLeftColor: 'var(--gb-accent)',
                    color: 'var(--gb-ink-secondary)',
                  }}
                >
                  {section.epigraph}{' '}
                  <span
                    className="font-ui text-xs not-italic font-semibold"
                    style={{ color: 'var(--gb-accent)' }}
                  >
                    ({section.epigraphRef})
                  </span>
                </blockquote>
              </header>

              {/* Insert Interactive 3D Tetragrammaton Anatomy inside Section II */}
              {section.id === 'section-2' && <TetragrammatonAnatomy />}

              {/* Insert Interactive Seven "I AM" Statements inside Section V */}
              {section.id === 'section-5' && <SevenIAmStatements />}

              {/* Cards in this section */}
              <div>
                {sectionNames.map((entry) => (
                  <DivineNameTiltCard
                    key={entry.id}
                    entry={entry}
                    isActive={activeNameId === entry.id}
                    isRevealed={illuminateAll || revealedIds.has(entry.id)}
                    isStudied={studiedIds.has(entry.id)}
                    isExpanded={expandedIds.has(entry.id)}
                    onToggleExpand={handleToggleExpand}
                    onToggleStudied={handleToggleStudied}
                    onSelect={handleOpenName}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* Interactive Biblical Geography & Covenant Altars Map */}
        <CovenantAltarsAtlas
          names={DIVINE_NAMES}
          onSelectName={handleOpenName}
          onJumpToName={handleJumpToName}
        />

        {/* Theological Synthesis Section */}
        <section
          className="mt-16 rounded-3xl border p-6 sm:p-9"
          style={{
            backgroundColor: 'var(--gb-surface)',
            borderColor: 'var(--gb-border-strong)',
            boxShadow: 'var(--gb-shadow-lg)',
          }}
        >
          <div
            className="font-ui mb-2 flex items-center gap-2 text-xs font-bold tracking-wider uppercase"
            style={{ color: 'var(--gb-accent)' }}
          >
            <Sparkles className="h-4 w-4" style={{ color: 'var(--gb-gold)' }} />
            <span>Богословский итог</span>
          </div>
          <h2
            className="font-serif-display text-2xl sm:text-3xl font-bold"
            style={{ color: 'var(--gb-ink)' }}
          >
            Все имена Бога сходятся в одном Имени: Иисус Христос
          </h2>

          <div
            className="font-body-editorial mt-4 space-y-4 text-[1.04em] leading-[1.8]"
            style={{ color: 'var(--gb-ink-secondary)' }}
          >
            <p>
              Ни одно отдельное имя не способно исчерпать бездонную природу Бога, поэтому Писание
              даёт нам целое созвездие имён — подобно тому как драгоценный камень поворачивают к
              свету разными гранями. Элохим показывает Его творческую мощь, Яхве — Его неизменную
              верность завету, Эль-Шаддай — Его вседостаточность, Яхве-Цидкену — Его оправдывающую
              праведность, Яхве-Рои — Его пастырскую нежность.
            </p>
            <p>
              Но в полноте времён все эти лучи сошлись в одной Личности. Само имя{' '}
              <strong>Иисус</strong> (<span className="font-hebrew font-bold">יֵשׁוּעַ</span>,{' '}
              <em>Йешуа</em>) означает <em>«Яхве есть спасение»</em>. И когда апостол Павел пишет,
              что Бог превознёс Христа и «дал Ему имя выше всякого имени, дабы пред именем Иисуса
              преклонилось всякое колено… и всякий язык исповедал, что Господь [Κύριος — Яхве]
              Иисус Христос в славу Бога Отца» (
              <ScriptureRefPill
                reference="Флп. 2:9–11"
                synodalText="Посему и Бог превознёс Его и дал Ему имя выше всякого имени, дабы пред именем Иисуса преклонилось всякое колено небесных, земных и преисподних, и всякий язык исповедал, что Господь Иисус Христос в славу Бога Отца."
                originalNote="Греч. Κύριος Ἰησοῦς Χριστός — прямое перенесение клятвы Яхве из Исаии 45:23 на Христа."
              />
              ), он провозглашает, что вся полнота Божественного Имени обитает в Нём телесно (
              <ScriptureRefPill
                reference="Кол. 2:9"
                synodalText="Ибо в Нём обитает вся полнота Божества телесно."
                originalNote="Греч. πᾶν τὸ πλήρωμα τῆς θεότητος σωματικῶς — вся полнота Божественной сущности, а не просто божественных качеств."
              />
              ).
            </p>
          </div>
        </section>

        {/* Interactive 36-Name Constellation Search & Filter Atlas */}
        <DivineConstellationExplorer
          names={DIVINE_NAMES}
          revealedIds={illuminateAll ? new Set(DIVINE_NAMES.map((n) => n.id)) : revealedIds}
          studiedIds={studiedIds}
          onSelectName={handleOpenName}
          onJumpToName={handleJumpToName}
        />

        {/* Interactive Theological Self-Check Quiz */}
        <NearViewport ariaLabel="Богословский тест" minimumHeight={280}>
          <FeatureLoadBoundary label="Богословский тест">
            <Suspense fallback={<div className="min-h-[280px]" aria-label="Загрузка богословского теста" />}>
              <TheologicalQuiz />
            </Suspense>
          </FeatureLoadBoundary>
        </NearViewport>

        {/* Printable Names Index Table */}
        <NamesIndexTable
          names={DIVINE_NAMES}
          studiedIds={studiedIds}
          onJumpToName={handleJumpToName}
          onSelectName={handleOpenName}
        />

        {/* Authentic gospod-bog.ru Sources & Verification Block */}
        <section
          className="mt-16 border-t pt-10"
          style={{ borderColor: 'var(--gb-border-strong)' }}
        >
          <div className="mb-4 flex items-center gap-2.5">
            <ShieldCheck className="h-5 w-5" style={{ color: 'var(--gb-accent)' }} />
            <h2 className="font-serif-display text-xl sm:text-2xl font-bold" style={{ color: 'var(--gb-ink)' }}>
              Источники и сверка
            </h2>
          </div>

          <div
            className="font-body-editorial space-y-3 text-sm leading-relaxed"
            style={{ color: 'var(--gb-muted)' }}
          >
            <p>
              <strong style={{ color: 'var(--gb-ink)' }}>Источники для дальнейшей редакционной сверки:</strong>{' '}
              Синодальный перевод Священного Писания; масоретский текст <em>Biblia Hebraica Stuttgartensia</em> (BHS);
              греческий текст <em>Nestle-Aland 28</em>; <em>The Hebrew and Aramaic Lexicon of the Old Testament</em> (HALOT);
              <em>Brown-Driver-Briggs Hebrew and English Lexicon</em> (BDB); <em>A Greek-English Lexicon of the New Testament</em> (BDAG).
            </p>
            <p>
              <strong style={{ color: 'var(--gb-ink)' }}>Богословские работы для проверки и углубления:</strong>{' '}
              Джон Гилл, <em>A Body of Doctrinal Divinity</em> (1769), кн. I, гл. 3 «Of the Names of God»;
              Жан Кальвин, <em>Наставление в христианской вере</em>, кн. I, гл. 13;
              Стивен Чарнок, <em>Discourses upon the Existence and Attributes of God</em> (1682);
              Герман Бавинк, <em>Reformed Dogmatics</em>, т. 2 «God and Creation», гл. 3 «The Names of God».
            </p>
          </div>
        </section>

        {/* Authentic gospod-bog.ru "Нашли неточность?" Block */}
        <section
          className="mt-12 rounded-2xl border p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          style={{
            backgroundColor: 'var(--gb-surface)',
            borderColor: 'var(--gb-border-strong)',
          }}
        >
          <div>
            <h3 className="font-serif-display text-lg font-bold" style={{ color: 'var(--gb-ink)' }}>
              Нашли неточность?
            </h3>
            <p className="font-ui mt-0.5 text-xs" style={{ color: 'var(--gb-muted)' }}>
              Богословскую или техническую — напишите редактору библиотеки, исправим.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="mailto:viktorcoy2012@gmail.com?subject=Неточность%20в%20статье%20об%20Именах%20Бога"
              className="font-ui inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors hover:opacity-85"
              style={{
                borderColor: 'var(--gb-border-strong)',
                backgroundColor: 'var(--gb-bg)',
                color: 'var(--gb-ink)',
              }}
            >
              <Mail className="h-3.5 w-3.5" style={{ color: 'var(--gb-accent)' }} />
              <span>Email</span>
            </a>
            <a
              href="https://t.me/fedormilovanov"
              target="_blank"
              rel="noopener noreferrer"
              className="font-ui inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--gb-accent)' }}
            >
              <Send className="h-3.5 w-3.5" />
              <span>Telegram</span>
            </a>
          </div>
        </section>

        {/* Authentic gospod-bog.ru "Читайте также в библиотеке" Block */}
        <section className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-serif-display text-xl font-bold" style={{ color: 'var(--gb-ink)' }}>
              Читайте также в библиотеке
            </h3>
            <a
              href="https://gospod-bog.ru/articles/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-ui inline-flex items-center gap-1 text-xs font-semibold hover:underline"
              style={{ color: 'var(--gb-accent)' }}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>Весь каталог</span>
            </a>
          </div>

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            {RELATED_LIBRARY_ARTICLES.map((art, idx) => (
              <a
                key={idx}
                href={art.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  backgroundColor: 'var(--gb-surface)',
                  borderColor: 'var(--gb-border-strong)',
                }}
              >
                <div>
                  <span
                    className="font-ui text-[10px] font-semibold tracking-wider uppercase"
                    style={{ color: 'var(--gb-gold-ink)' }}
                  >
                    {art.tag}
                  </span>
                  <h4
                    className="font-serif-display mt-1 text-[15px] font-bold leading-snug group-hover:underline"
                    style={{ color: 'var(--gb-ink)' }}
                  >
                    {art.title}
                  </h4>
                </div>
                <div
                  className="font-ui mt-3 flex items-center justify-between text-[11px]"
                  style={{ color: 'var(--gb-muted)' }}
                >
                  <span>{art.meta}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: 'var(--gb-accent)' }} />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Authentic Site Footer */}
        <footer
          className="mt-14 rounded-2xl border p-6 text-center"
          style={{
            backgroundColor: 'var(--gb-bg)',
            borderColor: 'var(--gb-border)',
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <ScrollText className="h-4 w-4" style={{ color: 'var(--gb-accent)' }} />
            <span className="font-serif-display text-base font-bold" style={{ color: 'var(--gb-ink)' }}>
              Господь Бог — <span className="italic" style={{ color: 'var(--gb-accent)' }}>Сила Моя</span>
            </span>
          </div>
          <p className="font-quote-editorial mt-2 text-base italic" style={{ color: 'var(--gb-muted)' }}>
            «Господь Бог — сила моя: Он сделает ноги мои как у оленя и на высоты мои возведёт меня». — Аввакум 3:19
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <span className="font-ui text-[11px] tracking-widest uppercase" style={{ color: 'var(--gb-gold-ink)' }}>
              Soli Deo Gloria · Материалы для вдумчивого изучения Писания
            </span>
            <a
              href="#top"
              className="font-ui inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium transition-colors hover:opacity-85"
              style={{
                borderColor: 'var(--gb-border-strong)',
                backgroundColor: 'var(--gb-surface)',
                color: 'var(--gb-ink)',
              }}
            >
              <ArrowUp className="h-3 w-3" style={{ color: 'var(--gb-accent)' }} />
              <span>Наверх</span>
            </a>
          </div>
        </footer>
      </main>

      {/* Floating Resume-Reading Recall (appears when a saved position exists) */}
      {resumePosition !== null && !selectedModalEntry && (
        <div className="no-print fixed bottom-20 left-4 z-30 lg:bottom-5 lg:left-6">
          <div
            className="flex items-center gap-2 rounded-2xl border px-3 py-2 shadow-xl backdrop-blur-md"
            style={{
              backgroundColor: 'var(--gb-glass)',
              borderColor: 'var(--gb-border-strong)',
            }}
          >
            <button
              type="button"
              onClick={handleResumeReading}
              className="font-ui inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold transition-opacity hover:opacity-85"
              style={{ color: 'var(--gb-accent)' }}
            >
              <BookOpen className="h-3.5 w-3.5" style={{ color: 'var(--gb-gold)' }} />
              <span>Продолжить чтение · {resumePercent}%</span>
            </button>
            <button
              type="button"
              onClick={handleDismissResume}
              className="cursor-pointer rounded-full p-0.5 transition-opacity hover:opacity-75"
              style={{ color: 'var(--gb-muted)' }}
              aria-label="Скрыть предложение продолжить чтение"
              title="Скрыть"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      <div aria-live="polite" aria-atomic="true" className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 lg:bottom-8">
        {toast && (
          <div
            className="font-ui rounded-xl border px-4 py-2.5 text-xs font-medium shadow-2xl"
            style={{
              backgroundColor: 'var(--gb-surface)',
              borderColor: 'var(--gb-gold)',
              color: 'var(--gb-ink)',
              boxShadow: 'var(--gb-shadow-xl), 0 0 24px var(--gb-gold-glow)',
            }}
          >
            {toast}
          </div>
        )}
      </div>

      {/* Deep-Dive Scholarly Dossier Modal */}
      <DivineNameModal
        entry={selectedModalEntry}
        allNames={DIVINE_NAMES}
        studiedIds={studiedIds}
        onToggleStudied={handleToggleStudied}
        onClose={handleCloseModal}
        onSelectEntry={(entry) => handleOpenName(entry)}
        onJumpToArticle={handleJumpToName}
      />
    </div>
  );
}

export default App;
