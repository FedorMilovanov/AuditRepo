import React, { useEffect, useRef, useState } from 'react';
import {
  Sun,
  Moon,
  BookMarked,
  Sparkles,
  Compass,
  Search,
  Share2,
  Printer,
  SlidersHorizontal,
} from 'lucide-react';
import { ARTICLE_SECTIONS } from '../data/divineNames';

interface SiteNavbarProps {
  theme: 'light' | 'sepia' | 'dark';
  onChangeTheme: (theme: 'light' | 'sepia' | 'dark') => void;
  fontScale: number;
  onChangeFontScale: (scale: number) => void;
  progress: number;
  revealedCount: number;
  studiedCount: number;
  totalCount: number;
  activeSectionId: string | null;
  onOpenAtlas: () => void;
  onFocusSearch: () => void;
  onShare: () => void;
  onPrint: () => void;
}

export const SiteNavbar: React.FC<SiteNavbarProps> = ({
  theme,
  onChangeTheme,
  fontScale,
  onChangeFontScale,
  progress,
  revealedCount,
  studiedCount,
  totalCount,
  activeSectionId,
  onOpenAtlas,
  onFocusSearch,
  onShare,
  onPrint,
}) => {
  const [readerPanelOpen, setReaderPanelOpen] = useState(false);
  const readerPanelRef = useRef<HTMLDivElement>(null);
  const readerTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!readerPanelOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!readerPanelRef.current?.contains(target) && !readerTriggerRef.current?.contains(target)) {
        setReaderPanelOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setReaderPanelOpen(false);
        readerTriggerRef.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [readerPanelOpen]);

  const studiedRatio = totalCount > 0 ? Math.min(1, studiedCount / totalCount) : 0;
  const ringRadius = 9;
  const ringCircumference = 2 * Math.PI * ringRadius;
  return (
    <nav
      aria-label="Основная навигация сайта"
      className="fixed top-0 right-0 left-0 z-40 h-14 border-b transition-colors duration-300"
      style={{
        backgroundColor: 'var(--gb-bg)',
        borderColor: 'var(--gb-border-strong)',
        boxShadow: progress > 0.002 ? '0 8px 24px rgba(0, 0, 0, 0.08)' : 'none',
      }}
    >
      {/* Top 2.5px Crimson-Gold Reading Progress Bar */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 h-[2.5px] w-full origin-left transition-transform duration-75"
        style={{
          transform: `scaleX(${Math.max(0, Math.min(1, progress))})`,
          background: 'linear-gradient(90deg, var(--gb-accent), var(--gb-gold), var(--gb-accent-dim))',
        }}
      />

      <div className="mx-auto flex h-full max-w-[1680px] min-w-0 items-center justify-between gap-2 px-3 sm:gap-3 sm:px-6">
        {/* Authentic gospod-bog.ru Brand Logo */}
        <a
          href="#top"
          className="group flex min-w-0 shrink items-center gap-1.5 overflow-hidden text-decoration-none select-none xl:shrink-0"
          aria-label="Господь Бог — Сила Моя — в начало статьи"
        >
          <span
            className="font-serif-display min-w-0 truncate whitespace-nowrap text-base sm:text-[17px] font-bold tracking-wide transition-all"
            style={{ color: 'var(--gb-ink)' }}
          >
            Господь Бог
          </span>
          <span className="font-serif-display hidden min-[440px]:inline text-base" style={{ color: 'var(--gb-muted)' }}>
            —
          </span>
          <span
            className="font-serif-display hidden min-[440px]:inline text-base sm:text-[17px] font-bold italic"
            style={{ color: 'var(--gb-accent)' }}
          >
            Сила Моя
          </span>
        </a>

        {/* Section Quick-Jump Links (Desktop) */}
        <div className="hidden xl:flex items-center gap-3.5">
          {ARTICLE_SECTIONS.map((sec) => {
            const isCurrent = activeSectionId === sec.id;
            return (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                data-atlas-section-link
                className="font-ui inline-flex min-h-10 items-center rounded-md px-2 py-3 text-xs font-medium transition-colors"
                style={{
                  color: isCurrent ? 'var(--gb-accent)' : 'var(--gb-muted)',
                  backgroundColor: isCurrent ? 'var(--gb-accent-soft)' : 'transparent',
                }}
                title={sec.title}
              >
                Раздел {sec.roman}
              </a>
            );
          })}
        </div>

        {/* Right Reader Controls */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {/* Reading Progress Percentage (wide screens) */}
          <span
            className="font-ui hidden xl:inline-flex items-center gap-1 text-[11px] font-semibold tabular-nums"
            style={{ color: 'var(--gb-muted)' }}
            title="Процент прочтения статьи"
          >
            <span style={{ color: 'var(--gb-accent)' }}>{Math.round(progress * 100)}%</span>
            <span className="font-medium">прочитано</span>
          </span>

          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={onFocusSearch}
            className="font-ui inline-flex min-h-9 min-w-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg border px-2 py-1 text-xs font-medium transition-colors hover:opacity-90"
            style={{
              backgroundColor: 'var(--gb-surface)',
              borderColor: 'var(--gb-border)',
              color: 'var(--gb-muted)',
            }}
            title="Быстрый поиск по именам и стихам (клавиша /)"
            aria-label="Открыть поиск по именам"
          >
            <Search className="h-3.5 w-3.5" style={{ color: 'var(--gb-gold)' }} />
            <kbd className="hidden font-mono text-[10px] opacity-80 sm:inline">/</kbd>
          </button>


          {/* Arena Battle refinement: one responsive entry point for reader preferences.
              Keeps current v1.3 theme/font persistence, progress and print handlers. */}
          <div className="relative">
            <button
              ref={readerTriggerRef}
              type="button"
              aria-label="Настройки чтения и шрифта"
              aria-controls="gb-reader-settings"
              aria-expanded={readerPanelOpen}
              onClick={() => setReaderPanelOpen((open) => !open)}
              className="inline-flex min-h-9 min-w-9 cursor-pointer items-center justify-center rounded-lg border p-2 transition-colors hover:opacity-90"
              style={{
                color: 'var(--gb-ink)',
                borderColor: readerPanelOpen ? 'var(--gb-gold)' : 'var(--gb-border-strong)',
                backgroundColor: readerPanelOpen ? 'var(--gb-accent-soft)' : 'var(--gb-surface)',
              }}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            </button>
            {readerPanelOpen && (
              <div
                ref={readerPanelRef}
                id="gb-reader-settings"
                role="region"
                aria-label="Настройки чтения"
                className="fixed left-3 top-16 z-50 rounded-xl border p-3 shadow-xl sm:absolute sm:right-0 sm:left-auto sm:top-full sm:mt-2"
                style={{
                  width: 'min(18rem, calc(100vw - 1.5rem))',
                  backgroundColor: 'var(--gb-surface)',
                  borderColor: 'var(--gb-border-strong)',
                  boxShadow: 'var(--gb-shadow-xl)',
                }}
              >
                <p className="font-ui mb-2 text-[11px] font-semibold" style={{ color: 'var(--gb-ink)' }}>
                  Настройки чтения
                </p>
                <div role="group" aria-label="Тема оформления" className="grid grid-cols-3 gap-1">
                  {([
                    { value: 'light' as const, label: 'Светлая', Icon: Sun },
                    { value: 'sepia' as const, label: 'Сепия', Icon: BookMarked },
                    { value: 'dark' as const, label: 'Ночная', Icon: Moon },
                  ]).map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={theme === value}
                      onClick={() => onChangeTheme(value)}
                      className="font-ui flex min-h-9 items-center justify-center gap-1 rounded-md px-1 text-[11px] font-medium transition-colors"
                      style={{
                        color: theme === value ? 'var(--gb-accent)' : 'var(--gb-ink)',
                        backgroundColor: theme === value ? 'var(--gb-accent-soft)' : 'transparent',
                      }}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {label}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="font-ui text-xs" style={{ color: 'var(--gb-ink)' }}>Размер текста</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="Уменьшить размер текста в настройках"
                      onClick={() => onChangeFontScale(Math.max(0.9, Number((fontScale - 0.05).toFixed(2))))}
                      className="font-ui min-h-9 min-w-9 cursor-pointer rounded-md border text-xs font-semibold"
                      style={{ borderColor: 'var(--gb-border)', color: 'var(--gb-ink)' }}
                    >А−</button>
                    <button
                      type="button"
                      aria-label="Сбросить масштаб текста"
                      onClick={() => onChangeFontScale(1)}
                      className="font-ui min-h-9 min-w-11 cursor-pointer text-center text-xs tabular-nums"
                      style={{ color: 'var(--gb-muted)' }}
                    >{Math.round(fontScale * 100)}%</button>
                    <button
                      type="button"
                      aria-label="Увеличить размер текста в настройках"
                      onClick={() => onChangeFontScale(Math.min(1.2, Number((fontScale + 0.05).toFixed(2))))}
                      className="font-ui min-h-9 min-w-9 cursor-pointer rounded-md border text-xs font-semibold"
                      style={{ borderColor: 'var(--gb-border)', color: 'var(--gb-ink)' }}
                    >А+</button>
                  </div>
                </div>
                <div className="mt-2 border-t pt-2" style={{ borderColor: 'var(--gb-border)' }}>
                  <span className="font-ui text-[11px] tabular-nums" style={{ color: 'var(--gb-muted)' }}>
                    Изучено: {studiedCount} из {totalCount} · Открыто: {revealedCount}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { setReaderPanelOpen(false); onShare(); }}
                    className="font-ui inline-flex min-h-9 cursor-pointer items-center justify-center gap-1 rounded-md border px-2 text-[11px]"
                    style={{ borderColor: 'var(--gb-border)', color: 'var(--gb-ink)' }}
                  >
                    <Share2 className="h-3.5 w-3.5" aria-hidden="true" /> Поделиться
                  </button>
                  <button
                    type="button"
                    onClick={() => { setReaderPanelOpen(false); onPrint(); }}
                    className="font-ui inline-flex min-h-9 cursor-pointer items-center justify-center gap-1 rounded-md border px-2 text-[11px]"
                    style={{ borderColor: 'var(--gb-border)', color: 'var(--gb-ink)' }}
                  >
                    <Printer className="h-3.5 w-3.5" aria-hidden="true" /> Печать / PDF
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Study Progress Ring */}
          <button
            type="button"
            onClick={onOpenAtlas}
            className="font-ui hidden lg:inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-medium transition-colors hover:opacity-90"
            style={{
              backgroundColor: 'var(--gb-surface)',
              borderColor: 'var(--gb-border-strong)',
              color: 'var(--gb-ink)',
            }}
            title={`Изучено ${studiedCount} из ${totalCount} позиций. Открыть сводную скрижаль`}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true" className="shrink-0">
              <circle
                cx="11"
                cy="11"
                r={ringRadius}
                fill="none"
                stroke="var(--gb-border)"
                strokeWidth="2.4"
              />
              <circle
                cx="11"
                cy="11"
                r={ringRadius}
                fill="none"
                stroke="var(--gb-gold)"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeDasharray={ringCircumference}
                strokeDashoffset={ringCircumference * (1 - studiedRatio)}
                transform="rotate(-90 11 11)"
                style={{ transition: 'stroke-dashoffset 500ms ease' }}
              />
            </svg>
            <span className="tabular-nums">
              {studiedCount}
              <span className="font-medium">/{totalCount}</span>
            </span>
          </button>

          {/* Live Revealed Names Pill */}
          <button
            type="button"
            onClick={onOpenAtlas}
            className="font-ui hidden xl:inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:opacity-90"
            style={{
              backgroundColor: 'var(--gb-surface)',
              borderColor: 'var(--gb-border-strong)',
              color: 'var(--gb-ink)',
            }}
            title="Перейти к сводной таблице 36 библейских выражений"
          >
            <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--gb-gold)' }} />
            <span className="tabular-nums">
              {revealedCount} / {totalCount}
            </span>
          </button>

          {/* Share & Print Tools */}
          <div className="hidden 2xl:flex items-center gap-1">
            <button
              type="button"
              onClick={onShare}
              className="cursor-pointer rounded-lg border p-1.5 transition-colors hover:opacity-80"
              style={{
                borderColor: 'var(--gb-border)',
                backgroundColor: 'var(--gb-surface)',
                color: 'var(--gb-muted)',
              }}
              title="Поделиться исследованием"
              aria-label="Поделиться исследованием"
            >
              <Share2 className="h-3.5 w-3.5" style={{ color: 'var(--gb-gold)' }} />
            </button>
            <button
              type="button"
              onClick={onPrint}
              className="cursor-pointer rounded-lg border p-1.5 transition-colors hover:opacity-80"
              style={{
                borderColor: 'var(--gb-border)',
                backgroundColor: 'var(--gb-surface)',
                color: 'var(--gb-muted)',
              }}
              title="Распечатать статью или сохранить в PDF"
              aria-label="Распечатать статью или сохранить в PDF"
            >
              <Printer className="h-3.5 w-3.5" style={{ color: 'var(--gb-gold)' }} />
            </button>
          </div>

          {/* Font Scale Controls */}
          <div
            className="hidden 2xl:flex items-center rounded-lg border p-0.5"
            style={{ borderColor: 'var(--gb-border)', backgroundColor: 'var(--gb-surface)' }}
          >
            <button
              type="button"
              onClick={() => onChangeFontScale(Math.max(0.9, Number((fontScale - 0.05).toFixed(2))))}
              className="font-ui cursor-pointer rounded px-2 py-0.5 text-[11px] font-semibold transition-colors hover:opacity-80"
              style={{ color: 'var(--gb-muted)' }}
              aria-label="Уменьшить шрифт"
            >
              А−
            </button>
            <button
              type="button"
              onClick={() => onChangeFontScale(1)}
              className="font-ui cursor-pointer px-1 text-[10px] tabular-nums transition-colors hover:opacity-80"
              style={{ color: 'var(--gb-muted)' }}
              title="Сбросить масштаб текста к 100%"
            >
              {Math.round(fontScale * 100)}%
            </button>
            <button
              type="button"
              onClick={() => onChangeFontScale(Math.min(1.2, Number((fontScale + 0.05).toFixed(2))))}
              className="font-ui cursor-pointer rounded px-2 py-0.5 text-[11px] font-semibold transition-colors hover:opacity-80"
              style={{ color: 'var(--gb-ink)' }}
              aria-label="Увеличить шрифт"
            >
              А+
            </button>
          </div>

          {/* 3-Mode Reader Theme Switcher (Light / Sepia / Dark) */}
          <div
            className="hidden 2xl:flex items-center rounded-xl border p-0.5"
            style={{ borderColor: 'var(--gb-border-strong)', backgroundColor: 'var(--gb-surface)' }}
            role="group"
            aria-label="Тема оформления"
          >
            <button
              type="button"
              onClick={() => onChangeTheme('light')}
              className="cursor-pointer rounded-lg p-1.5 transition-all"
              style={{
                backgroundColor: theme === 'light' ? 'var(--gb-accent-soft)' : 'transparent',
                color: theme === 'light' ? 'var(--gb-accent)' : 'var(--gb-muted)',
              }}
              title="Дневная тема (бумага)"
              aria-label="Дневная тема"
            >
              <Sun className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onChangeTheme('sepia')}
              className="cursor-pointer rounded-lg p-1.5 transition-all"
              style={{
                backgroundColor: theme === 'sepia' ? 'var(--gb-accent-soft)' : 'transparent',
                color: theme === 'sepia' ? 'var(--gb-accent)' : 'var(--gb-muted)',
              }}
              title="Тема Сепия (пергамент)"
              aria-label="Тема Сепия"
            >
              <BookMarked className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onChangeTheme('dark')}
              className="cursor-pointer rounded-lg p-1.5 transition-all"
              style={{
                backgroundColor: theme === 'dark' ? 'var(--gb-accent-soft)' : 'transparent',
                color: theme === 'dark' ? 'var(--gb-gold)' : 'var(--gb-muted)',
              }}
              title="Ночная тема"
              aria-label="Ночная тема"
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenAtlas}
            className="lg:hidden inline-flex min-h-9 min-w-9 cursor-pointer items-center justify-center rounded-lg border p-1.5"
            style={{
              borderColor: 'var(--gb-border-strong)',
              backgroundColor: 'var(--gb-surface)',
              color: 'var(--gb-ink)',
            }}
            aria-label="Справочник выражений Писания"
          >
            <Compass className="h-4 w-4" style={{ color: 'var(--gb-gold)' }} />
          </button>
        </div>
      </div>
    </nav>
  );
};
