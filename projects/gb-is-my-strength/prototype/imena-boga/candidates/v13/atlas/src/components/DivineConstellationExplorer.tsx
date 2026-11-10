import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Sparkles, X, BookOpen, CheckCircle2, Navigation, RotateCcw, Shuffle, SlidersHorizontal } from 'lucide-react';
import { DivineNameEntry, SOUL_NEED_LABELS, SoulNeed } from '../data/divineNames';

interface DivineConstellationExplorerProps {
  names: DivineNameEntry[];
  revealedIds: Set<string>;
  studiedIds: Set<string>;
  onSelectName: (entry: DivineNameEntry) => void;
  onJumpToName: (entry: DivineNameEntry) => void;
}

/** Fold Russian stress/yo and Hebrew niqqud for inclusive multilingual lookup. */
const foldSearch = (value: string) =>
  value.toLowerCase().replace(/ё/g, 'е').normalize('NFD').replace(/[\u0300-\u036f\u0591-\u05c7]/g, '');

const QUICK_SEARCH_TAGS = ['Яхве', 'Эль', 'Пастырь', 'Исход', 'Исаия', 'Голгофа'];

export const DivineConstellationExplorer: React.FC<DivineConstellationExplorerProps> = ({
  names,
  revealedIds,
  studiedIds,
  onSelectName,
  onJumpToName,
}) => {
  const [query, setQuery] = useState('');
  const searchRef = useRef<HTMLInputElement>(null);
  const [activeNeed, setActiveNeed] = useState<SoulNeed | 'all'>('all');
  const [onlyUnstudied, setOnlyUnstudied] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return;
      const focusSearch = (event.key === '/' && !event.ctrlKey && !event.altKey && !event.metaKey) ||
        ((event.ctrlKey || event.metaKey) && !event.altKey && event.key.toLowerCase() === 'k');
      if (!focusSearch) return;
      event.preventDefault();
      document.getElementById('constellation-atlas')?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      });
      searchRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const filtered = useMemo(() => {
    const terms = foldSearch(query.trim()).split(/\s+/).filter(Boolean);
    return names.filter((item) => {
      if (activeNeed !== 'all' && item.soulNeed !== activeNeed) return false;
      if (onlyUnstudied && studiedIds.has(item.id)) return false;
      if (terms.length === 0) return true;
      const haystack = foldSearch([
        item.transliteration, item.russianName, item.original, item.literalMeaning,
        item.category, item.strongs, item.summary, item.christologicalFulfillment,
        ...item.deepExegesis,
        ...item.keyVerses.flatMap((v) => [v.ref, v.synodal]),
      ].join(' '));
      return terms.every((term) => haystack.includes(term));
    });
  }, [names, query, activeNeed, onlyUnstudied, studiedIds]);

  const resetAllFilters = () => {
    setQuery('');
    setActiveNeed('all');
    setOnlyUnstudied(false);
  };

  return (
    <section
      id="constellation-atlas"
      data-reveal
      className="scroll-mt-24 my-16 rounded-3xl border p-4 sm:p-9 shadow-xl"
      style={{
        backgroundColor: 'var(--gb-surface)',
        borderColor: 'var(--gb-gold)',
        boxShadow: 'var(--gb-shadow-xl)',
      }}
    >
      <div className="text-center">
        <div
          className="font-ui inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase sm:px-3.5 sm:text-xs"
          style={{
            borderColor: 'var(--gb-border-strong)',
            backgroundColor: 'var(--gb-bg)',
            color: 'var(--gb-gold-ink)',
          }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Интерактивный справочник-созвездие</span>
        </div>

        <h2
          className="font-serif-display mt-2 text-xl font-bold leading-tight sm:mt-3 sm:text-3xl"
          style={{ color: 'var(--gb-ink)' }}
        >
          Сводная скрижаль 36 исследуемых библейских выражений
        </h2>
        <p
          className="font-body-editorial mx-auto mt-2 max-w-2xl text-sm sm:text-base"
          style={{ color: 'var(--gb-muted)' }}
        >
          <span className="sm:hidden">Ищите по названиям, стихам и номерам Стронга.</span>
          <span className="hidden sm:inline">
            Фильтруйте выражения по богословской теме или нужде души, ищите по русскому названию,
            оригиналу, номеру Стронга, библейскому сюжету или месту Писания.
          </span>
        </p>
      </div>

      {/* Search Bar + Random Meditation Name Trigger */}
      <div className="mx-auto mt-4 flex max-w-2xl flex-row items-stretch gap-2 sm:mt-6 sm:items-center sm:gap-2.5">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2"
            style={{ color: 'var(--gb-muted)' }}
          />
          <input
            id="constellation-search-input" aria-label="Поиск по библейским выражениям"
            ref={searchRef}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && filtered.length > 0) {
                event.preventDefault();
                onSelectName(filtered[0]);
              } else if (event.key === 'Escape') {
                event.preventDefault();
                if (query) setQuery('');
                else searchRef.current?.blur();
              }
            }}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск: Яхве, Шалом, Элохим, Иов 19, H3068, Мелхиседек..."
            className="font-ui w-full rounded-xl border py-3 pr-10 pl-11 text-sm outline-none transition-colors"
            style={{
              backgroundColor: 'var(--gb-bg)',
              borderColor: 'var(--gb-border-strong)',
              color: 'var(--gb-ink)',
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer rounded-full p-1 hover:opacity-75"
              style={{ color: 'var(--gb-muted)' }}
              aria-label="Очистить поиск"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            const pick = filtered[Math.floor(Math.random() * filtered.length)];
            if (pick) onSelectName(pick);
          }}
          disabled={filtered.length === 0}
          className="font-ui inline-flex min-h-11 min-w-11 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-semibold transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
          style={{
            backgroundColor: 'var(--gb-accent-soft)',
            borderColor: 'var(--gb-gold)',
            color: 'var(--gb-accent)',
          }}
          title="Открыть случайную исследуемую позицию для вдумчивого чтения"
           aria-label="Случайная позиция"
        >
          <Shuffle className="h-3.5 w-3.5" style={{ color: 'var(--gb-gold)' }} />
          <span className="hidden sm:inline">Случайная позиция</span>
        </button>
      </div>

      {/* Compact discovery first; advanced controls remain visible on larger screens. */}
      <div className="mt-3 flex items-center justify-between gap-2 sm:hidden">
        <p className="font-ui text-xs" role="status" aria-live="polite" style={{ color: 'var(--gb-ink-secondary)' }}>
          Найдено: {filtered.length}
        </p>
        <button
          type="button"
          onClick={() => setFiltersOpen((isOpen) => !isOpen)}
          aria-expanded={filtersOpen}
          aria-controls="constellation-filter-options"
          className="font-ui inline-flex min-h-11 items-center gap-2 rounded-xl border px-3 text-xs font-semibold transition-colors"
          style={{ borderColor: 'var(--gb-border-strong)', color: 'var(--gb-accent)', backgroundColor: 'var(--gb-bg)' }}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Фильтры{activeNeed !== 'all' || onlyUnstudied ? ' · активны' : ''}
        </button>
      </div>
      <div id="constellation-filter-options" className={filtersOpen ? 'block' : 'hidden sm:block'}>
      {/* Quick Search Tags + Unstudied Toggle */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
        <span className="font-ui text-[11px] mr-1" style={{ color: 'var(--gb-muted)' }}>
          Быстрый запрос:
        </span>
        {QUICK_SEARCH_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setQuery((prev) => (prev === tag ? '' : tag))}
            className="font-ui inline-flex min-h-11 cursor-pointer items-center rounded-lg border px-3 py-2 text-xs transition-colors hover:opacity-85"
            style={{
              backgroundColor: query === tag ? 'var(--gb-accent-soft)' : 'var(--gb-bg)',
              borderColor: query === tag ? 'var(--gb-accent)' : 'var(--gb-border)',
              color: query === tag ? 'var(--gb-accent)' : 'var(--gb-muted)',
            }}
          >
            {tag}
          </button>
        ))}

        {studiedIds.size > 0 && (
          <button
            type="button"
            onClick={() => setOnlyUnstudied((v) => !v)}
            className="font-ui ml-2 inline-flex cursor-pointer items-center gap-1 rounded-md border px-2.5 py-0.5 text-[11px] font-medium transition-colors"
            style={{
              backgroundColor: onlyUnstudied ? 'var(--gb-accent-soft)' : 'var(--gb-bg)',
              borderColor: onlyUnstudied ? 'var(--gb-accent)' : 'var(--gb-border-strong)',
              color: onlyUnstudied ? 'var(--gb-accent)' : 'var(--gb-ink-secondary)',
            }}
          >
            <CheckCircle2 className="h-3 w-3" />
            <span>Только неизученные ({names.length - studiedIds.size})</span>
          </button>
        )}
      </div>

      {/* Soul Need / Theological Filter Pills */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        {(Object.keys(SOUL_NEED_LABELS) as Array<SoulNeed | 'all'>).map((key) => {
          const isSelected = activeNeed === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveNeed(key)}
              className="font-ui min-h-11 cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all sm:min-h-0"
              style={{
                backgroundColor: isSelected ? 'var(--gb-accent)' : 'var(--gb-bg)',
                borderColor: isSelected ? 'var(--gb-accent)' : 'var(--gb-border-strong)',
                color: isSelected ? 'var(--gb-on-accent)' : 'var(--gb-ink-secondary)',
              }}
            >
              {SOUL_NEED_LABELS[key].label}
            </button>
          );
        })}
      </div>

      <p className="font-ui mt-3 text-center text-xs italic" style={{ color: 'var(--gb-muted)' }}>
        {SOUL_NEED_LABELS[activeNeed].description} — найдено: {filtered.length} · изучено вами:{' '}
        {studiedIds.size} из {names.length}
      </p>

      </div>
      {/* Grid of Interactive Mini Sacred Plaques */}
      {filtered.length === 0 ? (
        <div
          className="mt-8 rounded-2xl border p-8 text-center"
          style={{ borderColor: 'var(--gb-border)', backgroundColor: 'var(--gb-bg)' }}
        >
          <p className="font-body-editorial text-base" style={{ color: 'var(--gb-muted)' }}>
            По текущим условиям поиска выражений не найдено.
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="font-ui mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold gb-on-accent transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--gb-accent)' }}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Сбросить фильтры</span>
          </button>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-3.5 sm:mt-7 sm:grid-cols-2">
          {filtered.map((item) => {
            const isRevealed = revealedIds.has(item.id);
            const isStudied = studiedIds.has(item.id);
            return (
              <div
                key={item.id}
                 data-constellation-result
                className="group relative flex flex-col justify-between rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                style={{
                  backgroundColor: 'var(--gb-bg)',
                  borderColor: isRevealed ? 'var(--gb-border-strong)' : 'var(--gb-border)',
                }}
              >
                <button
                  type="button"
                  onClick={() => onSelectName(item)}
                  className="flex w-full cursor-pointer flex-col items-stretch gap-2 text-left focus:outline-none"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-ui text-[10px] font-bold tracking-wider uppercase"
                        style={{ color: 'var(--gb-gold-ink)' }}
                      >
                        № {item.number}
                      </span>
                      <span
                        className="font-ui rounded px-1.5 py-0.5 text-[10px] font-mono"
                        style={{
                          backgroundColor: 'var(--gb-surface)',
                          color: 'var(--gb-muted)',
                        }}
                      >
                        {item.strongs}
                      </span>
                      {isStudied && (
                        <span
                          className="inline-flex items-center gap-0.5 font-ui text-[10px] font-semibold text-emerald-600"
                          title="Изучено"
                        >
                          <CheckCircle2 className="h-3 w-3" />
                        </span>
                      )}
                    </div>
                    <h4
                      className="font-serif-display mt-1 text-base font-bold transition-colors group-hover:underline"
                      style={{ color: 'var(--gb-ink)' }}
                    >
                      {item.transliteration}
                    </h4>
                    <div className="font-ui text-xs font-medium" style={{ color: 'var(--gb-accent)' }}>
                      {item.russianName}
                    </div>
                  </div>

                  <span
                    className={`${
                      item.language === 'greek' ? 'font-greek' : 'font-hebrew'
                    } block w-full min-w-0 whitespace-normal break-normal text-right text-lg font-bold leading-snug sm:text-2xl [overflow-wrap:normal]`}
                    data-constellation-original
                    lang={item.language === 'greek' ? 'el' : item.language === 'aramaic' ? 'arc' : 'he'}
                    dir={item.language === 'greek' ? 'ltr' : 'rtl'}
                    style={{ color: 'var(--gb-ink)' }}
                  >
                    {item.original.split(/(\s+)/u).map((part, index) =>
                      /\s/u.test(part) ? part : (
                        <span key={index} data-constellation-original-token className="inline-block whitespace-nowrap">
                          {part}
                        </span>
                      ),
                    )}
                  </span>
                </button>

                <div
                  className="font-ui mt-3 flex min-h-11 flex-wrap items-center justify-between gap-1 border-t pt-2 text-xs"
                  style={{ borderColor: 'var(--gb-border)', color: 'var(--gb-muted)' }}
                >
                  <span>{item.keyVerses[0]?.ref}</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => onJumpToName(item)}
                      className="inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-md px-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{ color: 'var(--gb-muted)' }}
                      title="Перейти к карточке в тексте статьи"
                    >
                      <Navigation className="h-3 w-3" />
                      <span>В тексте</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectName(item)}
                      className="inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-md px-2 font-semibold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{ color: 'var(--gb-accent)' }}
                    >
                      <BookOpen className="h-3 w-3" />
                      <span>Разбор →</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
