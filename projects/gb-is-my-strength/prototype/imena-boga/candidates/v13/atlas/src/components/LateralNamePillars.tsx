import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BookOpen, X, Sun } from 'lucide-react';
import { DivineNameEntry } from '../data/divineNames';

interface LateralNamePillarsProps {
  names: DivineNameEntry[];
  revealedIds: Set<string>;
  justRevealedIds: Set<string>;
  studiedIds: Set<string>;
  activeNameId: string | null;
  scrollProgress: number;
  illuminateAll: boolean;
  onToggleIlluminateAll: () => void;
  onSelectName: (entry: DivineNameEntry) => void;
  onJumpToName: (entry: DivineNameEntry) => void;
  mobileDrawerOpen: boolean;
  onMobileDrawerOpenChange: (open: boolean) => void;
}

interface PillarColumnProps {
  side: 'left' | 'right';
  items: DivineNameEntry[];
  revealedIds: Set<string>;
  justRevealedIds: Set<string>;
  studiedIds: Set<string>;
  activeNameId: string | null;
  scrollProgress: number;
  illuminateAll: boolean;
  onToggleIlluminateAll: () => void;
  onSelectName: (entry: DivineNameEntry) => void;
  onJumpToName: (entry: DivineNameEntry) => void;
  registerCardRef: (id: string, el: HTMLDivElement | null) => void;
  onPillarScroll: () => void;
}

const PillarColumn: React.FC<PillarColumnProps> = ({
  side,
  items,
  revealedIds,
  justRevealedIds,
  studiedIds,
  activeNameId,
  scrollProgress,
  illuminateAll,
  onToggleIlluminateAll,
  onSelectName,
  onJumpToName,
  registerCardRef,
  onPillarScroll,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isHoveredRef = useRef<boolean>(false);

  useEffect(() => {
    if (!activeNameId || isHoveredRef.current) return;
    const node = itemRefs.current[activeNameId];
    const container = scrollContainerRef.current;
    if (node && container) {
      // offsetTop can use a different offsetParent from this scrollbox.
      // Rectangles keep the active plaque properly centered across fonts.
      const card = node.getBoundingClientRect();
      const viewport = container.getBoundingClientRect();
      const targetScroll = container.scrollTop
        + card.top - viewport.top
        - (viewport.height - card.height) / 2;
      container.scrollTo({
        top: Math.max(0, Math.min(container.scrollHeight - container.clientHeight, targetScroll)),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
    }
  }, [activeNameId]);

  const isLeft = side === 'left';
  const revealedCount = illuminateAll
    ? items.length
    : items.filter((item) => revealedIds.has(item.id)).length;

  return (
    <aside
      aria-label={isLeft ? 'Левая скрижаль имён Бога' : 'Правая скрижаль имён Бога'}
      className={`pointer-events-none fixed top-16 bottom-4 z-20 hidden min-[1440px]:flex flex-col ${
        isLeft ? 'left-3 xl:left-4 2xl:left-6' : 'right-3 xl:right-4 2xl:right-6'
      } w-[196px] xl:w-[232px] 2xl:w-[264px]`}
    >
      {/* Top Pillar Capital Header */}
      <div
        className="pointer-events-auto mb-2 flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-xs"
        style={{
          backgroundColor: 'var(--gb-glass)',
          borderColor: 'var(--gb-border)',
          backdropFilter: 'blur(14px)',
          color: 'var(--gb-muted)',
        }}
      >
        <div className="flex min-w-0 flex-col justify-center leading-tight">
          <span
            className="font-ui whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.08em]"
            style={{ color: 'var(--gb-gold-ink)' }}
          >
            {isLeft ? 'Скрижаль I' : 'Скрижаль II'}
          </span>
          <span className="mt-0.5 flex items-center gap-1.5 whitespace-nowrap font-ui text-xs">
            <span>{isLeft ? 'Основа' : 'Завет'}</span>
            <span className="tabular-nums opacity-80">({revealedCount}/{items.length})</span>
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleIlluminateAll}
          title={
            illuminateAll
              ? 'Показывать имена постепенно по мере чтения'
              : 'Подсветить все 36 исследуемых выражений на скрижалях'
          }
          className="font-ui inline-flex min-h-8 shrink-0 cursor-pointer items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors hover:opacity-90"
          style={{
            backgroundColor: illuminateAll ? 'var(--gb-accent-soft)' : 'var(--gb-surface)',
            borderColor: illuminateAll ? 'var(--gb-gold)' : 'var(--gb-border-strong)',
            color: illuminateAll ? 'var(--gb-accent)' : 'var(--gb-muted)',
          }}
        >
          <Sun className="h-2.5 w-2.5" />
          <span>{illuminateAll ? 'Все' : 'Свет'}</span>
        </button>
      </div>

      {/* Vertical Glowing Spine Filament + Live Scroll Light Beam */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <div
          aria-hidden="true"
          className={`sacred-filament pointer-events-none absolute top-2 bottom-2 w-[2px] opacity-35 ${
            isLeft ? 'left-0' : 'right-0'
          }`}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute top-2 w-[2.5px] rounded-full transition-all duration-150 ${
            isLeft ? 'left-0' : 'right-0'
          }`}
          style={{
            height: `${Math.max(4, Math.min(98, scrollProgress * 100))}%`,
            background: 'linear-gradient(180deg, var(--gb-gold), var(--gb-accent))',
            boxShadow: '0 0 12px var(--gb-gold-glow)',
          }}
        />

        {/* Scrollable Epiphany List */}
        <div
          ref={scrollContainerRef}
          onScroll={onPillarScroll}
          onMouseEnter={() => {
            isHoveredRef.current = true;
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
          }}
          className={`thin-sacred-scroll pointer-events-auto h-full space-y-2.5 overflow-y-auto overscroll-contain py-2 ${
            isLeft ? 'pl-4 pr-1' : 'pr-4 pl-1'
          }`}
        >
          {items.map((item) => {
            const isRevealed = illuminateAll || revealedIds.has(item.id);
            const isJustRevealed = !illuminateAll && justRevealedIds.has(item.id);
            const isStudied = studiedIds.has(item.id);
            const isActive = activeNameId === item.id;

            return (
              <div
                key={item.id}
                ref={(el) => {
                  itemRefs.current[item.id] = el;
                  registerCardRef(item.id, el);
                }}
                className={`group relative w-full rounded-xl border transition-all duration-700 ${
                  isActive
                    ? 'sacred-active-glow scale-[1.02]'
                    : isJustRevealed
                      ? 'sacred-epiphany-bloom hover:scale-[1.015]'
                      : 'hover:scale-[1.015]'
                }`}
                style={{
                  // Unread names stay legible: progress changes accents,
                  // never the visibility of the name or its description.
                  opacity: 1,
                  backgroundColor: isActive ? 'var(--gb-surface)' : 'var(--gb-glass)',
                  borderColor: isActive
                    ? 'var(--gb-gold)'
                    : isRevealed
                      ? 'var(--gb-border-strong)'
                      : 'var(--gb-border)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* Ambient radial aura behind revealed/active card */}
                {(isRevealed || isActive) && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-xl opacity-65 transition-opacity duration-700"
                    style={{
                      background: isActive
                        ? 'radial-gradient(circle at 50% 50%, var(--gb-gold-glow), transparent 75%)'
                        : 'radial-gradient(circle at 50% 50%, rgba(184, 147, 106, 0.14), transparent 80%)',
                    }}
                  />
                )}

                {/* Primary Button: Opens Deep-Dive Modal */}
                <button
                  type="button"
                  onClick={() => onSelectName(item)}
                  className="relative z-10 block w-full cursor-pointer px-3.5 pt-2.5 pb-1.5 text-left focus:outline-none"
                >
                  <div className="flex min-w-0 flex-col items-stretch gap-1">
                    <span
                      className="font-ui inline-flex items-center gap-1 text-xs font-semibold tracking-wider uppercase"
                      style={{
                        color: isActive ? 'var(--gb-accent)' : 'var(--gb-gold-ink)',
                      }}
                    >
                      <span>№ {item.number}</span>
                      {isStudied && (
                        <span
                          title="Изучено"
                          className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"
                        />
                      )}
                    </span>

                    <span
                      className={`${
                        item.language === 'greek' ? 'font-greek' : 'font-hebrew'
                      } block w-full min-w-0 whitespace-normal break-normal text-right text-base xl:text-lg font-bold leading-snug [overflow-wrap:normal] transition-colors duration-300`}
                      style={{
                        color: isActive ? 'var(--gb-accent)' : 'var(--gb-ink)',
                        textShadow: isActive ? '0 0 12px var(--gb-gold-glow)' : 'none',
                      }}
                    >
                      {item.original.split(/(\s+)/u).map((part, index) =>
                        /\s/u.test(part) ? part : (
                          <span key={index} data-atlas-pillar-token className="whitespace-nowrap">
                            {part}
                          </span>
                        ),
                      )}
                    </span>
                  </div>

                  <div className="mt-1">
                    <div
                      className="font-serif-display break-words text-xs xl:text-[13px] font-bold leading-snug transition-colors"
                      style={{
                        color: isActive ? 'var(--gb-accent)' : 'var(--gb-ink)',
                      }}
                    >
                      {item.transliteration}
                    </div>
                    <div
                      className="font-ui mt-0.5 line-clamp-2 text-[10.5px] leading-snug"
                      style={{ color: 'var(--gb-muted)' }}
                    >
                      {item.russianName}
                    </div>
                  </div>
                </button>

                {/* Secondary Action Strip (Valid Sibling Buttons) */}
                <div
                  className="relative z-10 mx-3.5 mb-2 flex items-center justify-between gap-2 border-t pt-1 opacity-80 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
                  style={{ borderColor: 'var(--gb-border)' }}
                >
                  <button
                    type="button"
                    onClick={() => onSelectName(item)}
                    className="font-ui inline-flex min-h-11 items-center rounded-md px-2 text-xs font-medium hover:underline"
                    style={{ color: 'var(--gb-accent)' }}
                  >
                    Разбор →
                  </button>
                  <button
                    type="button"
                    onClick={() => onJumpToName(item)}
                    className="font-ui inline-flex min-h-11 items-center rounded-md px-2 text-xs underline decoration-dotted hover:opacity-80"
                    style={{ color: 'var(--gb-muted)' }}
                  >
                    К тексту
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export const LateralNamePillars: React.FC<LateralNamePillarsProps> = ({
  names,
  revealedIds,
  justRevealedIds,
  studiedIds,
  activeNameId,
  scrollProgress,
  illuminateAll,
  onToggleIlluminateAll,
  onSelectName,
  onJumpToName,
  mobileDrawerOpen,
  onMobileDrawerOpenChange,
}) => {
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const drawerCloseRef = useRef<HTMLButtonElement | null>(null);
  const restoreDrawerFocusRef = useRef(false);

  // A mobile drawer is a modal: commit its focus before the first paint,
  // contain Tab, and restore focus to its trigger when dismissed.
  useLayoutEffect(() => {
    if (!mobileDrawerOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawerCloseRef.current?.focus({ preventScroll: true });
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        restoreDrawerFocusRef.current = true;
        onMobileDrawerOpenChange(false);
      }
      if (event.key !== 'Tab' || !drawerRef.current) return;
      const buttons = Array.from(
        drawerRef.current.querySelectorAll<HTMLButtonElement>('button:not([disabled])')
      );
      if (!buttons.length) return;
      const first = buttons[0], last = buttons[buttons.length - 1];
      const inside = drawerRef.current.contains(document.activeElement);
      if (event.shiftKey && (!inside || document.activeElement === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!inside || document.activeElement === last)) {
        event.preventDefault();
        first.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1440) {
        restoreDrawerFocusRef.current = false;
        onMobileDrawerOpenChange(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('resize', onResize);
      const trigger = document.getElementById('gb-mobile-atlas-nav-trigger');
      if (restoreDrawerFocusRef.current && trigger instanceof HTMLElement && trigger.getClientRects().length) {
        trigger.focus({ preventScroll: true });
      }
      restoreDrawerFocusRef.current = false;
    };
  }, [mobileDrawerOpen, onMobileDrawerOpenChange]);
  const pillarCardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [beamCoords, setBeamCoords] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    visible: boolean;
  }>({ x1: 0, y1: 0, x2: 0, y2: 0, visible: false });

  const registerCardRef = (id: string, el: HTMLDivElement | null) => {
    pillarCardRefs.current[id] = el;
  };

  const rafRef = useRef<number>(0);

  const scheduleUpdateBeam = React.useCallback(() => {
    window.cancelAnimationFrame(rafRef.current);
    rafRef.current = window.requestAnimationFrame(() => {
      if (window.innerWidth < 1440 || !activeNameId) {
        setBeamCoords((prev) => (prev.visible ? { ...prev, visible: false } : prev));
        return;
      }

      const activeEntry = names.find((n) => n.id === activeNameId);
      const cardEl = document.getElementById(`name-${activeNameId}`);
      const pillarEl = pillarCardRefs.current[activeNameId];

      if (!activeEntry || !cardEl || !pillarEl) {
        setBeamCoords((prev) => (prev.visible ? { ...prev, visible: false } : prev));
        return;
      }

      const cardRect = cardEl.getBoundingClientRect();
      const pillarRect = pillarEl.getBoundingClientRect();

      if (cardRect.bottom < 80 || cardRect.top > window.innerHeight - 60) {
        setBeamCoords((prev) => (prev.visible ? { ...prev, visible: false } : prev));
        return;
      }

      const isLeft = activeEntry.side === 'left';
      const x1 = isLeft ? pillarRect.right : pillarRect.left;
      const y1 = pillarRect.top + pillarRect.height / 2;

      // Hide ray if the pillar item is scrolled outside the visible pillar scroll window
      if (y1 < 104 || y1 > window.innerHeight - 20) {
        setBeamCoords((prev) => (prev.visible ? { ...prev, visible: false } : prev));
        return;
      }

      const x2 = isLeft ? cardRect.left : cardRect.right;
      const y2 = Math.min(
        window.innerHeight - 80,
        Math.max(90, cardRect.top + Math.min(cardRect.height * 0.35, 110))
      );

      setBeamCoords({ x1, y1, x2, y2, visible: true });
    });
  }, [activeNameId, names]);

  // Compute luminous SVG bezier ray connecting active central card to active lateral pillar plaque
  useEffect(() => {
    scheduleUpdateBeam();
    window.addEventListener('scroll', scheduleUpdateBeam, { passive: true });
    window.addEventListener('resize', scheduleUpdateBeam);
    const interval = window.setInterval(scheduleUpdateBeam, 350);

    return () => {
      window.cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', scheduleUpdateBeam);
      window.removeEventListener('resize', scheduleUpdateBeam);
      window.clearInterval(interval);
    };
  }, [scheduleUpdateBeam]);

  const leftItems = names.filter((n) => n.side === 'left');
  const rightItems = names.filter((n) => n.side === 'right');
  const displayRevealedCount = illuminateAll ? names.length : revealedIds.size;
  const dismissDrawer = () => {
    restoreDrawerFocusRef.current = true;
    onMobileDrawerOpenChange(false);
  };
  const selectFromDrawer = (entry: DivineNameEntry) => {
    restoreDrawerFocusRef.current = false;
    onMobileDrawerOpenChange(false);
    // The dossier captures the current focus for its own close/restore flow.
    // Hand it a persistent trigger, not a name button being unmounted.
    const trigger = document.getElementById('gb-mobile-atlas-nav-trigger');
    if (trigger instanceof HTMLElement) trigger.focus({ preventScroll: true });
    onSelectName(entry);
  };

  const midX = (beamCoords.x1 + beamCoords.x2) / 2;
  const pathData = `M ${beamCoords.x1} ${beamCoords.y1} C ${midX} ${beamCoords.y1}, ${midX} ${beamCoords.y2}, ${beamCoords.x2} ${beamCoords.y2}`;

  return (
    <>
      {/* Desktop Luminous Sacred Ray Connecting Pillar to Active Card */}
      {beamCoords.visible && (
        <svg
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-15 hidden h-full w-full min-[1440px]:block"
        >
          <defs>
            <linearGradient id="sacredRayGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--gb-gold)" stopOpacity="0.65" />
              <stop offset="50%" stopColor="var(--gb-accent)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="var(--gb-gold)" stopOpacity="0.65" />
            </linearGradient>
          </defs>
          <path
            id="activeSacredRayPath"
            d={pathData}
            fill="none"
            stroke="url(#sacredRayGrad)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <circle cx={beamCoords.x1} cy={beamCoords.y1} r="3.5" fill="var(--gb-gold)" opacity="0.85" />
          <circle cx={beamCoords.x2} cy={beamCoords.y2} r="3.5" fill="var(--gb-accent)" opacity="0.85" />
          {/* Animated traveling light pulse along the sacred filament */}
          <circle r="3" fill="var(--gb-gold-bright)" opacity="0.95">
            <animateMotion dur="2.4s" repeatCount="indefinite" path={pathData} />
          </circle>
        </svg>
      )}

      {/* Desktop Left & Right Glowing Pillars */}
      <PillarColumn
        side="left"
        items={leftItems}
        revealedIds={revealedIds}
        justRevealedIds={justRevealedIds}
        studiedIds={studiedIds}
        activeNameId={activeNameId}
        scrollProgress={scrollProgress}
        illuminateAll={illuminateAll}
        onToggleIlluminateAll={onToggleIlluminateAll}
        onSelectName={onSelectName}
        onJumpToName={onJumpToName}
        registerCardRef={registerCardRef}
        onPillarScroll={scheduleUpdateBeam}
      />
      <PillarColumn
        side="right"
        items={rightItems}
        revealedIds={revealedIds}
        justRevealedIds={justRevealedIds}
        studiedIds={studiedIds}
        activeNameId={activeNameId}
        scrollProgress={scrollProgress}
        illuminateAll={illuminateAll}
        onToggleIlluminateAll={onToggleIlluminateAll}
        onSelectName={onSelectName}
        onJumpToName={onJumpToName}
        registerCardRef={registerCardRef}
        onPillarScroll={scheduleUpdateBeam}
      />

      {/* A single responsive trigger in SiteNavbar opens this shared drawer;
          no floating duplicate may obscure the text column. */}
      {/* Mobile / Tablet Drawer Modal */}
      {mobileDrawerOpen && (
        <div
          id="gb-mobile-pillars-dialog"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Скрижали имён Бога"
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm min-[1440px]:hidden"
          onClick={dismissDrawer}
        >
          <div
            className="max-h-[84vh] w-full rounded-t-3xl border-t p-5 shadow-2xl flex flex-col"
            style={{
              backgroundColor: 'var(--gb-canvas)',
              borderColor: 'var(--gb-gold)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="mb-4 flex flex-col gap-3 border-b pb-3 sm:flex-row sm:items-center sm:justify-between"
              style={{ borderColor: 'var(--gb-border)' }}
            >
              <div>
                <div
                  className="font-ui text-xs font-semibold tracking-wider uppercase"
                  style={{ color: 'var(--gb-gold-ink)' }}
                >
                  Указатель выражений Писания · {displayRevealedCount} / {names.length} открыто
                </div>
                <h3 className="font-serif-display text-lg font-bold">
                  Выберите выражение для изучения
                </h3>
              </div>
              <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
                <button
                  type="button"
                  onClick={onToggleIlluminateAll}
                  className="font-ui inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: illuminateAll ? 'var(--gb-accent-soft)' : 'var(--gb-surface)',
                    borderColor: illuminateAll ? 'var(--gb-gold)' : 'var(--gb-border-strong)',
                    color: illuminateAll ? 'var(--gb-accent)' : 'var(--gb-ink)',
                  }}
                >
                  <Sun className="h-3.5 w-3.5" />
                  <span>{illuminateAll ? 'По чтению' : 'Озарить все'}</span>
                </button>
                <button
                  type="button"
                  ref={drawerCloseRef}
                  onClick={dismissDrawer}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border"
                  style={{ borderColor: 'var(--gb-border)', color: 'var(--gb-ink)' }}
                  aria-label="Закрыть скрижаль"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto pb-6">
              {names.map((item) => {
                const isRevealed = illuminateAll || revealedIds.has(item.id);
                const isActive = activeNameId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectFromDrawer(item)}
                    className={`flex min-w-0 flex-col items-stretch gap-2 rounded-xl border p-3 text-left transition-colors ${
                      isActive ? 'sacred-active-glow' : ''
                    }`}
                    style={{
                      // Progress is communicated by the label and border, never
                      // by making unread names hard to read on mobile.
                      opacity: 1,
                      backgroundColor: isActive ? 'var(--gb-surface)' : 'var(--gb-bg)',
                      borderColor: isActive
                        ? 'var(--gb-gold)'
                        : isRevealed ? 'var(--gb-border-strong)' : 'var(--gb-border)',
                    }}
                  >
                    <div className="min-w-0 w-full">
                      <div
                        className="font-ui text-xs font-semibold uppercase"
                        style={{ color: 'var(--gb-gold-ink)' }}
                      >
                        № {item.number} · {isRevealed ? 'Явлено' : 'Далее в тексте'}
                      </div>
                      <div data-atlas-mobile-text="title" className="font-serif-display min-w-0 break-words text-sm font-bold">
                        {item.transliteration}
                      </div>
                      <div data-atlas-mobile-text="russian" className="font-ui min-w-0 break-words text-xs" style={{ color: 'var(--gb-muted)' }}>
                        {item.russianName}
                      </div>
                    </div>
                    <div className="flex min-w-0 w-full flex-col items-end">
                      <span
                        data-atlas-mobile-original
                        className={`${
                          item.language === 'greek' ? 'font-greek' : 'font-hebrew'
                        } w-full min-w-0 break-words text-right text-lg font-bold leading-snug [overflow-wrap:anywhere]`}
                        style={{ color: 'var(--gb-accent)' }}
                      >
                        {item.original}
                      </span>
                      <span
                        className="font-ui mt-1 inline-flex items-center gap-1 text-xs"
                        style={{ color: 'var(--gb-muted)' }}
                      >
                        <BookOpen className="h-3 w-3" /> Читать
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
