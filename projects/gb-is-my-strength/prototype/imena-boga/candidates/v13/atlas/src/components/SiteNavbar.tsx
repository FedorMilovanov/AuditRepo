import React from 'react';
import {
  Sun,
  Moon,
  BookMarked,
  Sparkles,
  Compass,
  Search,
  Share2,
  Printer,
  CheckCircle2,
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
  const studiedRatio = totalCount > 0 ? Math.min(1, studiedCount / totalCount) : 0;
  const ringRadius = 9;
  const ringCircumference = 2 * Math.PI * ringRadius;
  return (
    <nav
      aria-label="Основная навигация сайта"
      className="fixed top-0 right-0 left-0 z-40 h-14 border-b transition-colors duration-300"
      style={{
        backgroundColor: 'var(--gb-glass)',
        borderColor: 'var(--gb-border)',
        backdropFilter: 'blur(18px) saturate(150%)',
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

      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        {/* Authentic gospod-bog.ru Brand Logo */}
        <a
          href="#top"
          className="group flex shrink-0 items-center gap-1.5 text-decoration-none select-none"
          aria-label="Господь Бог — Сила Моя — в начало статьи"
        >
          <span
            className="font-serif-display text-base sm:text-[17px] font-bold tracking-wide transition-all"
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
        <div className="hidden md:flex items-center gap-3.5">
          {ARTICLE_SECTIONS.map((sec) => {
            const isCurrent = activeSectionId === sec.id;
            return (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="font-ui rounded-md px-2 py-1 text-xs font-medium transition-colors"
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
        <div className="flex items-center gap-2">
          {/* Reading Progress Percentage (wide screens) */}
          <span
            className="font-ui hidden xl:inline-flex items-center gap-1 text-[11px] font-semibold tabular-nums"
            style={{ color: 'var(--gb-muted)' }}
            title="Процент прочтения статьи"
          >
            <span style={{ color: 'var(--gb-accent)' }}>{Math.round(progress * 100)}%</span>
            <span className="opacity-70">прочитано</span>
          </span>

          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={onFocusSearch}
            className="font-ui hidden sm:inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors hover:opacity-90"
            style={{
              backgroundColor: 'var(--gb-surface)',
              borderColor: 'var(--gb-border)',
              color: 'var(--gb-muted)',
            }}
            title="Быстрый поиск по именам и стихам (клавиша /)"
          >
            <Search className="h-3.5 w-3.5" style={{ color: 'var(--gb-gold)' }} />
            <kbd className="font-mono text-[10px] opacity-80">/</kbd>
          </button>

          {/* Study Progress Ring */}
          <button
            type="button"
            onClick={onOpenAtlas}
            className="font-ui hidden sm:inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2 py-1 text-xs font-medium transition-colors hover:opacity-90"
            style={{
              backgroundColor: 'var(--gb-surface)',
              borderColor: 'var(--gb-border-strong)',
              color: 'var(--gb-ink)',
            }}
            title={`Изучено ${studiedCount} из ${totalCount} имён. Открыть сводную скрижаль`}
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
              <span className="opacity-60">/{totalCount}</span>
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
            title="Перейти к сводной таблице 36 рассмотренных имён"
          >
            <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--gb-gold)' }} />
            <span className="tabular-nums">
              {revealedCount} / {totalCount}
            </span>
          </button>

          {/* Share & Print Tools */}
          <div className="hidden md:flex items-center gap-1">
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

          {/* Mobile studied badge */}
          <button
            type="button"
            onClick={onOpenAtlas}
            className="font-ui sm:hidden inline-flex cursor-pointer items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold"
            style={{
              backgroundColor: 'var(--gb-surface)',
              borderColor: 'var(--gb-border-strong)',
              color: 'var(--gb-accent)',
            }}
            aria-label={`Изучено ${studiedCount} из ${totalCount} имён`}
          >
            <CheckCircle2 className="h-3 w-3" style={{ color: 'var(--gb-gold)' }} />
            <span className="tabular-nums">{studiedCount}</span>
          </button>

          {/* Font Scale Controls */}
          <div
            className="hidden sm:flex items-center rounded-lg border p-0.5"
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
            className="flex items-center rounded-xl border p-0.5"
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
            className="sm:hidden cursor-pointer rounded-lg border p-1.5"
            style={{
              borderColor: 'var(--gb-border-strong)',
              backgroundColor: 'var(--gb-surface)',
              color: 'var(--gb-ink)',
            }}
            aria-label="Справочник всех имён"
          >
            <Compass className="h-4 w-4" style={{ color: 'var(--gb-gold)' }} />
          </button>
        </div>
      </div>
    </nav>
  );
};
