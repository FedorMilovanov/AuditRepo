import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, BookOpen, X, ChevronRight, Sun } from 'lucide-react';
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
      const nodeTop = node.offsetTop;
      const nodeHeight = node.offsetHeight;
      const containerHeight = container.clientHeight;
      const targetScroll = nodeTop - containerHeight / 2 + nodeHeight / 2;
      container.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth',
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
      className={`pointer-events-none fixed top-16 bottom-4 z-20 hidden lg:flex flex-col ${
        isLeft ? 'left-3 xl:left-4 2xl:left-6' : 'right-3 xl:right-4 2xl:right-6'
      } w-[196px] xl:w-[232px] 2xl:w-[264px]`}
    >
      {/* Top Pillar Capital Header */}
      <div
        className="pointer-events-auto mb-2 flex items-center justify-between gap-2 rounded-xl border px-3 py-2 text-[11px]"
        style={{
          backgroundColor: 'var(--gb-glass)',
          borderColor: 'var(--gb-border)',
          backdropFilter: 'blur(14px)',
          color: 'var(--gb-muted)',
        }}
      >
        <div className="flex items-center gap-1.5 truncate">
          <span
            className="font-ui font-semibold tracking-wider uppercase truncate"
            style={{ color: 'var(--gb-gold)' }}
          >
            {isLeft ? 'Скрижаль I · Основа' : 'Скрижаль II · Завет'}
          </span>
          <span className="font-ui tabular-nums opacity-80">
            ({revealedCount}/{items.length})
          </span>
        </div>

        <button
          type="button"
          onClick={onToggleIlluminateAll}
          title={
            illuminateAll
              ? 'Показывать имена постепенно по мере чтения'
              : 'Подсветить сразу все 36 имён на скрижалях'
          }
          className="font-ui inline-flex shrink-0 cursor-pointer items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium transition-colors hover:opacity-90"
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
      <div className="relative flex-1 overflow-hidden">
        <div
          aria-hidden="true"
          className={`sacred-filament pointer-events-none absolute top-2 bottom-2 w-[2px] opacity-35 ${
            isLeft ? 'left-2.5' : 'right-2.5'
          }`}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute top-2 w-[2.5px] rounded-full transition-all duration-150 ${
            isLeft ? 'left-2.5' : 'right-2.5'
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
          className="thin-sacred-scroll pointer-events-auto h-full space-y-2.5 overflow-y-auto px-1 py-2"
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
                  opacity: isRevealed ? 1 : 0.36,
                  transform: isRevealed
                    ? 'translateX(0px)'
                    : isLeft
                      ? 'translateX(-14px)'
                      : 'translateX(14px)',
                  backgroundColor: isActive
                    ? 'var(--gb-surface)'
                    : isRevealed
                      ? 'var(--gb-glass)'
                      : 'transparent',
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
                  <div className="flex items-baseline justify-between gap-2">
                    <span
                      className="font-ui inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase"
                      style={{
                        color: isActive ? 'var(--gb-accent)' : 'var(--gb-gold)',
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
                      } text-base xl:text-lg font-bold leading-none transition-all duration-500`}
                      style={{
                        color: isActive
                          ? 'var(--gb-gold-bright)'
                          : isRevealed
                            ? 'var(--gb-ink)'
                            : 'var(--gb-muted)',
                        textShadow: isActive
                          ? '0 0 18px var(--gb-gold-glow)'
                          : isRevealed
                            ? '0 0 8px rgba(184, 147, 106, 0.22)'
                            : 'none',
                        filter: isRevealed ? 'none' : 'blur(0.6px)',
                      }}
                    >
                      {item.original}
                    </span>
                  </div>

                  <div className="mt-1">
                    <div
                      className="font-serif-display text-xs xl:text-[13px] font-bold leading-snug transition-colors"
                      style={{
                        color: isActive ? 'var(--gb-accent)' : 'var(--gb-ink)',
                      }}
                    >
                      {item.transliteration}
                    </div>
                    <div
                      className="font-ui mt-0.5 line-clamp-1 text-[10.5px]"
                      style={{ color: 'var(--gb-muted)' }}
                    >
                      {isRevealed ? item.russianName : 'Явится при чтении…'}
                    </div>
                  </div>
                </button>

                {/* Secondary Action Strip (Valid Sibling Buttons) */}
                <div
                  className="relative z-10 mx-3.5 mb-2 flex items-center justify-between border-t pt-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
                  style={{ borderColor: 'var(--gb-border)' }}
                >
                  <button
                    type="button"
                    onClick={() => onSelectName(item)}
                    className="font-ui cursor-pointer text-[10px] font-medium hover:underline"
                    style={{ color: 'var(--gb-accent)' }}
                  >
                    Разбор →
                  </button>
                  <button
                    type="button"
                    onClick={() => onJumpToName(item)}
                    className="font-ui cursor-pointer text-[10px] underline decoration-dotted hover:opacity-80"
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
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Drawer accessibility: Escape to close + scroll lock
  useEffect(() => {
    if (!mobileDrawerOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileDrawerOpen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [mobileDrawerOpen]);
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
      if (window.innerWidth < 1024 || !activeNameId) {
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
  const activeEntry = names.find((n) => n.id === activeNameId) || names[0];
  const displayRevealedCount = illuminateAll ? names.length : revealedIds.size;

  const midX = (beamCoords.x1 + beamCoords.x2) / 2;
  const pathData = `M ${beamCoords.x1} ${beamCoords.y1} C ${midX} ${beamCoords.y1}, ${midX} ${beamCoords.y2}, ${beamCoords.x2} ${beamCoords.y2}`;

  return (
    <>
      {/* Desktop Luminous Sacred Ray Connecting Pillar to Active Card */}
      {beamCoords.visible && (
        <svg
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-15 hidden h-full w-full lg:block"
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

      {/* Mobile & Tablet Floating Sacred Ribbon Trigger (< lg) */}
      <div className="no-print fixed right-4 bottom-4 left-4 z-30 flex justify-center lg:hidden">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          className="sacred-active-glow flex w-full max-w-md cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3 shadow-xl transition-transform active:scale-[0.99]"
          style={{
            backgroundColor: 'var(--gb-surface)',
            borderColor: 'var(--gb-gold)',
            color: 'var(--gb-ink)',
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <Sparkles className="h-4 w-4 shrink-0" style={{ color: 'var(--gb-gold)' }} />
            <div className="truncate text-left">
              <div
                className="font-ui text-[10px] font-semibold tracking-wider uppercase"
                style={{ color: 'var(--gb-gold)' }}
              >
                Явлено {displayRevealedCount} из {names.length} имён
              </div>
              <div className="font-serif-display truncate text-sm font-bold">
                {activeEntry.transliteration}{' '}
                <span
                  className={activeEntry.language === 'greek' ? 'font-greek' : 'font-hebrew'}
                  style={{ color: 'var(--gb-accent)' }}
                >
                  ({activeEntry.original})
                </span>
              </div>
            </div>
          </div>

          <span
            className="font-ui inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white"
            style={{ backgroundColor: 'var(--gb-accent)' }}
          >
            <span>Скрижали</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </button>
      </div>

      {/* Mobile / Tablet Drawer Modal */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileDrawerOpen(false)}
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
              className="mb-4 flex items-center justify-between border-b pb-3"
              style={{ borderColor: 'var(--gb-border)' }}
            >
              <div>
                <div
                  className="font-ui text-[11px] font-semibold tracking-wider uppercase"
                  style={{ color: 'var(--gb-gold)' }}
                >
                  Скрижали Имён Божьих · {displayRevealedCount} / {names.length} открыто
                </div>
                <h3 className="font-serif-display text-lg font-bold">
                  Нажмите на любое Имя для чтения
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onToggleIlluminateAll}
                  className="font-ui inline-flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
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
                  onClick={() => setMobileDrawerOpen(false)}
                  className="rounded-full border p-2"
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
                    onClick={() => {
                      setMobileDrawerOpen(false);
                      onSelectName(item);
                    }}
                    className={`flex items-center justify-between gap-3 rounded-xl border p-3 text-left transition-all ${
                      isActive ? 'sacred-active-glow' : ''
                    }`}
                    style={{
                      opacity: isRevealed ? 1 : 0.58,
                      backgroundColor: isActive ? 'var(--gb-surface)' : 'var(--gb-bg)',
                      borderColor: isActive ? 'var(--gb-gold)' : 'var(--gb-border)',
                    }}
                  >
                    <div className="min-w-0">
                      <div
                        className="font-ui text-[10px] font-semibold uppercase"
                        style={{ color: 'var(--gb-gold)' }}
                      >
                        № {item.number} · {isRevealed ? 'Явлено' : 'Далее в тексте'}
                      </div>
                      <div className="font-serif-display truncate text-sm font-bold">
                        {item.transliteration}
                      </div>
                      <div className="font-ui truncate text-xs" style={{ color: 'var(--gb-muted)' }}>
                        {item.russianName}
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span
                        className={`${
                          item.language === 'greek' ? 'font-greek' : 'font-hebrew'
                        } text-lg font-bold`}
                        style={{ color: 'var(--gb-accent)' }}
                      >
                        {item.original}
                      </span>
                      <span
                        className="font-ui mt-1 inline-flex items-center gap-1 text-[10px]"
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
