import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Check, ChevronDown, RotateCcw, Search, Shuffle, SlidersHorizontal, X } from "lucide-react";
import { NAMES, PARTS } from "../data/names";
import { normalizeSearch, scriptAttrs, scriptLabel } from "../utils/script";

interface NameGridProps {
  active: string;
  completedIds: Set<string>;
  onSelect: (id: string) => void;
  onClearProgress: () => void;
  motionOn: boolean;
}

const GLOBAL_INDEX = new Map(NAMES.map((name, index) => [name.id, index]));

/** Match on folded letters while preserving the original Unicode offsets.
 * This prevents highlights splitting Hebrew niqqud or Greek combining marks.
 */
function Highlight({ text, query }: { text: string; query: string }) {
  const tokens = normalizeSearch(query).split(/\s+/).filter(Boolean);
  if (!tokens.length) return <>{text}</>;

  let folded = "";
  // Keep the original source offsets for every folded letter. Codepoints
  // dropped by normalization (accents/niqqud) must remain attached to their
  // base letter, while whitespace must never disappear inside the text.
  const starts: number[] = [];
  const ends: number[] = [];
  const combining = /[\u0300-\u036f\u0591-\u05c7]/u;
  for (let pos = 0; pos < text.length;) {
    const codepoint = String.fromCodePoint(text.codePointAt(pos)!);
    const end = pos + codepoint.length;
    const normalized = /\s/u.test(codepoint) ? " " : normalizeSearch(codepoint);
    if (normalized) {
      for (let j = 0; j < normalized.length; j++) {
        starts.push(pos);
        ends.push(end);
      }
      folded += normalized;
    } else if (combining.test(codepoint) && ends.length) {
      ends[ends.length - 1] = end;
    }
    pos = end;
  }
  const spans: Array<[number, number]> = [];
  for (const token of tokens) {
    let from = 0;
    while (from < folded.length) {
      const idx = folded.indexOf(token, from);
      if (idx === -1) break;
      spans.push([starts[idx], ends[idx + token.length - 1]]);
      from = idx + token.length;
    }
  }
  if (!spans.length) return <>{text}</>;
  spans.sort((a, b) => a[0] - b[0]);
  const merged: Array<[number, number]> = [];
  for (const [first, last] of spans) {
    const previous = merged[merged.length - 1];
    if (previous && first <= previous[1]) previous[1] = Math.max(previous[1], last);
    else merged.push([first, last]);
  }
  const parts: ReactNode[] = [];
  let cursor = 0;
  for (const [first, last] of merged) {
    if (first > cursor) parts.push(text.slice(cursor, first));
    parts.push(<mark key={`${first}-${last}`} className="rounded-sm bg-gold-500/25 px-0.5 text-gold-100">{text.slice(first, last)}</mark>);
    cursor = last;
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return <>{parts}</>;
}

export default function NameGrid({ active, completedIds, onSelect, onClearProgress, motionOn }: NameGridProps) {
  const [query, setQuery] = useState("");
  const [partFilter, setPartFilter] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing || event.repeat ||
          event.altKey || event.shiftKey) return;
      const slash = event.key === "/" && !event.ctrlKey && !event.metaKey;
      const searchCommand = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
      if (!slash && !searchCommand) return;

      const target = event.target instanceof Element ? event.target : null;
      // Search must never steal keys from native controls, links or an open
      // modal. In particular, focus must remain trapped in the mobile index.
      if (document.querySelector('[aria-modal="true"]') ||
          target?.closest('input, textarea, select, button, a, [role="dialog"], [role="menu"], [contenteditable="true"]'))
        return;

      const search = searchRef.current;
      if (!search) return;
      event.preventDefault();
      search.focus({ preventScroll: true });
      document.getElementById("sozvezdie")?.scrollIntoView({
        behavior: !motionOn || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
        block: "start",
      });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [motionOn]);

  const filtered = useMemo(() => {
    const q = normalizeSearch(query);
    return NAMES.filter((name) => {
      if (partFilter !== 0 && name.part !== partFilter) return false;
      if (!q) return true;
      const haystack = normalizeSearch(
        [
          name.translit,
          name.russian,
          name.meaning,
          name.tagline,
          name.verse.ref,
          name.verse.text,
          name.hebrew,
          scriptLabel(name),
        ].join(" "),
      );
      return q.split(/\s+/).every((word) => haystack.includes(word));
    });
  }, [partFilter, query]);

  const openRandomFiltered = () => {
    const remaining = filtered.filter((name) => name.id !== active);
    const pool = remaining.length > 0 ? remaining : filtered;
    if (pool.length === 0) return;
    const name = pool[Math.floor(Math.random() * pool.length)];
    onSelect(name.id);
  };

  const progress = Math.round((completedIds.size / NAMES.length) * 100);

  const resetFilters = () => {
    setQuery("");
    setPartFilter(0);
    searchRef.current?.focus();
  };

  return (
    <nav
      id="sozvezdie"
      className="relative mx-auto max-w-6xl scroll-mt-28 px-6 pb-6 pt-4 md:pb-16"
      aria-label="Указатель по 29 библейским именованиям и выражениям"
    >
      {/* header */}
      <div className="mb-8 flex flex-col items-center text-center">
        <p className="flex max-w-full flex-wrap items-center justify-center gap-2 font-ui text-xs font-medium uppercase tracking-[0.2em] text-gold-400">
          <span className="hairline w-10" />
          Панорама имён
          <span className="hairline w-10" />
        </p>
        <h2 className="mt-4 font-display text-3xl font-medium text-cream-100 md:text-4xl">
          29 именований и выражений — <span className="gold-static italic">одним взглядом</span>
        </h2>
        <p className="mt-3 max-w-lg font-body text-base italic leading-relaxed text-cream-500">
          Выберите именование, чтобы перейти к его разбору. На общей схеме представлены {NAMES.length}{" "}
          именований и выражений Писания.
        </p>
      </div>

      {/* search and study progress */}
      <div className="mx-auto mb-10 max-w-4xl rounded-3xl border border-gold-500/15 bg-ink-900/45 p-4 shadow-[0_24px_70px_-35px_rgba(0,0,0,0.9)] backdrop-blur-sm sm:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <label className="group relative w-full min-w-0 flex-1">
            <span className="sr-only">Найти имя Бога</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-cream-700 transition-colors group-focus-within:text-gold-400" />
            <input
              data-name-grid-search
              ref={searchRef}
              onKeyDown={(e) => {
                if (e.key === "Enter" && filtered.length > 0) {
                  e.preventDefault();
                  onSelect(filtered[0].id);
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  if (query) setQuery("");
                  else searchRef.current?.blur();
                }
              }}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder="Найти: целитель, пастырь, Исход 3, ἐγώ εἰμι…"
              className="h-12 w-full min-w-0 rounded-full border border-cream-800/70 bg-ink-950/75 pl-11 pr-11 font-body text-base text-cream-100 outline-none transition-all placeholder:text-cream-700 focus:border-gold-500/60 focus:shadow-[0_0_0_4px_rgba(212,175,55,0.08)]"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-0.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-cream-500 transition-colors hover:bg-gold-500/10 hover:text-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400"
                aria-label="Очистить поиск"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded border border-cream-800/70 px-1.5 py-0.5 font-ui text-xs text-cream-700 sm:block">
                /
              </kbd>
            )}
          </label>

          <div className="w-full min-w-0 md:w-auto md:min-w-44 md:text-right">
            <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 md:justify-end">
              <p className="min-w-0 break-words font-ui text-xs uppercase tracking-[0.28em] text-cream-500">
                Изучено {completedIds.size}/{NAMES.length}
              </p>
              {completedIds.size > 0 && (
                <button
                  type="button"
                  onClick={onClearProgress}
                  className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 font-ui text-xs uppercase tracking-[0.18em] text-cream-700 transition-colors hover:text-gold-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400 md:min-h-0"
                >
                  <RotateCcw className="h-3 w-3" /> Сброс
                </button>
              )}
            </div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-cream-800/50" aria-hidden>
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-700 via-gold-500 to-gold-300 shadow-[0_0_12px_rgba(212,175,55,0.55)] transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={openRandomFiltered}
            disabled={filtered.length === 0}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-gold-500/30 px-4 py-2 font-ui text-xs uppercase tracking-[0.16em] text-gold-200 transition-colors hover:border-gold-400/60 hover:bg-gold-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400 disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Открыть случайное имя из результатов поиска"
            title="Открыть случайное имя из выбранной части исследования"
          >
            <Shuffle className="h-3.5 w-3.5" aria-hidden /> Случайное имя
          </button>
        </div>

        <div className="mt-4 md:hidden">
          <button
            type="button"
            data-name-filters-toggle
            aria-expanded={filtersOpen}
            aria-controls="sozvezdie-name-filters"
            onClick={() => setFiltersOpen((open) => !open)}
            className="flex min-h-11 w-full min-w-0 flex-wrap items-center gap-2 rounded-xl border border-cream-800/70 bg-ink-950/55 px-3 py-2 text-left font-ui text-xs uppercase tracking-[0.15em] text-cream-300 transition-colors hover:border-gold-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400"
          >
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-gold-400" aria-hidden />
            <span className="min-w-0 break-words [overflow-wrap:anywhere]">Разделы</span>
            <span className="min-w-0 flex-1 break-words text-right normal-case tracking-normal text-cream-500">
              {partFilter === 0 ? "Все" : PARTS[partFilter - 1].title}
            </span>
            <span className="shrink-0 text-gold-300">{filtered.length}</span>
            <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${filtersOpen ? "rotate-180" : ""}`} aria-hidden />
          </button>
        </div>

        <div
          id="sozvezdie-name-filters"
          data-name-filters-options
          className={`${filtersOpen ? "flex" : "hidden"} mt-3 flex-wrap items-center gap-2 md:mt-4 md:flex`}
          aria-label="Фильтр по частям исследования"
        >
          <button
            type="button"
            onClick={() => setPartFilter(0)}
            aria-pressed={partFilter === 0}
            className={`min-h-11 rounded-full border px-3.5 py-1.5 font-ui text-xs uppercase tracking-[0.2em] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400 md:min-h-0 ${
              partFilter === 0
                ? "border-gold-400/70 bg-gold-500/15 text-gold-200"
                : "border-cream-800/60 text-cream-500 hover:border-gold-500/35 hover:text-cream-300"
            }`}
          >
            Все · {NAMES.length}
          </button>
          {PARTS.map((part, index) => {
            const count = NAMES.filter((name) => name.part === index + 1).length;
            const selected = partFilter === index + 1;
            return (
              <button
                key={part.id}
                type="button"
                onClick={() => setPartFilter(index + 1)}
                aria-pressed={selected}
                className={`min-h-11 rounded-full border px-3.5 py-1.5 font-ui text-xs uppercase tracking-[0.18em] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold-400 md:min-h-0 ${
                  selected
                    ? "border-gold-400/70 bg-gold-500/15 text-gold-200"
                    : "border-cream-800/60 text-cream-500 hover:border-gold-500/35 hover:text-cream-300"
                }`}
              >
                {part.numeral}. {part.title} · {count}
              </button>
            );
          })}
          <span className="ml-auto font-ui text-xs uppercase tracking-[0.22em] text-cream-700" aria-live="polite">
            {query && filtered.length > 0 ? "Enter — открыть первое" : `Показано: ${filtered.length}`}
          </span>
        </div>
        <p className="mt-3 hidden items-center gap-4 border-t border-cream-800/40 pt-3 font-ui text-xs uppercase tracking-[0.2em] text-cream-700 lg:flex">
          <span><kbd className="rounded border border-cream-800/80 px-1 text-gold-400">/</kbd> поиск</span>
          <span><kbd className="rounded border border-cream-800/80 px-1 text-gold-400">← →</kbd> соседние имена в статье</span>
          <span><kbd className="rounded border border-cream-800/80 px-1 text-gold-400">M</kbd> отметить изученным</span>
        </p>
      </div>

      {/* parts */}
      {PARTS.map((part, pi) => {
        const entries = filtered.filter((name) => name.part === pi + 1);
        if (entries.length === 0) return null;
        return (
          <div key={part.id} className="mb-8 min-w-0">
            <p className="mb-4 grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 font-ui text-xs font-medium uppercase tracking-[0.2em] text-cream-500">
              <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                <span className="mr-2 font-display text-lg italic text-gold-500">{part.numeral}</span>
                {part.title}
              </span>
              <span className="justify-self-end tracking-[0.1em] text-cream-700">{entries.length}</span>
            </p>
            <div
              data-name-result-grid
              data-single-result={entries.length === 1 ? "true" : "false"}
              className={entries.length === 1
                ? "grid grid-cols-1 justify-items-center gap-2 md:gap-3"
                : "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 md:gap-3 lg:grid-cols-5"}
            >
              {entries.map((name) => {
                const n = (GLOBAL_INDEX.get(name.id) ?? 0) + 1;
                const attrs = scriptAttrs(name);
                const isActive = active === name.id;
                const isCompleted = completedIds.has(name.id);
                return (
                  <button
                    key={name.id}
                    onClick={() => onSelect(name.id)}
                    aria-label={`Перейти к разделу: ${name.translit}${isCompleted ? ", изучено" : ""}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`group relative flex w-full max-w-80 min-h-[136px] flex-col items-center justify-center overflow-hidden rounded-xl border px-2 py-4 transition-colors duration-300 motion-safe:hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400 ${
                      isActive
                        ? "border-gold-500/60 bg-gradient-to-b from-ink-800 to-ink-900 shadow-[0_0_35px_-8px_rgba(212,175,55,0.35)]"
                        : isCompleted
                          ? "border-gold-600/35 bg-ink-900/55 hover:border-gold-500/50 hover:bg-ink-850"
                          : "border-cream-800/50 bg-ink-900/40 hover:border-gold-500/40 hover:bg-ink-850 hover:shadow-[0_0_28px_-10px_rgba(212,175,55,0.25)]"
                    }`}
                  >
                    <span
                      className={`absolute left-2.5 top-2 font-ui text-xs tracking-[0.12em] transition-colors duration-300 ${
                        isActive || isCompleted ? "text-gold-400" : "text-cream-400 group-hover:text-gold-300"
                      }`}
                    >
                      {String(n).padStart(2, "0")}
                    </span>
                    {isCompleted ? (
                      <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500/20 text-gold-300 ring-1 ring-gold-500/40">
                        <Check className="h-2.5 w-2.5" strokeWidth={2.5} />
                      </span>
                    ) : null}
                    <span
                      {...attrs}
                      className={`select-none text-center font-hebrew text-xl font-medium leading-tight transition-all duration-500 md:text-2xl ${
                        isActive ? "glow-gold text-gold-200" : "text-gold-300/90 group-hover:text-gold-200"
                      }`}
                    >
                      {name.hebrew}
                    </span>
                    <span
                      data-name-translit className={`mt-2 min-w-0 max-w-full break-words px-1 text-center font-ui text-[12px] font-medium leading-snug tracking-[0.02em] transition-colors duration-300 [overflow-wrap:anywhere] ${
                        isActive ? "text-cream-100" : "text-cream-300 group-hover:text-cream-100"
                      }`}
                    >
                      <Highlight text={name.translit} query={query} />
                    </span>
                    <span className="mt-1 line-clamp-3 max-w-full break-words text-center font-display text-sm italic leading-snug text-cream-300 transition-colors group-hover:text-cream-100">
                      <Highlight text={name.russian} query={query} />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div className="rounded-3xl border border-gold-500/15 bg-ink-900/40 px-6 py-12 text-center">
          <p className="font-display text-2xl italic text-cream-300">По этому запросу имён не нашлось</p>
          <p className="mx-auto mt-2 max-w-md font-body text-base text-cream-500">
            Попробуйте транслитерацию, русский смысл или ссылку — например, «шалом», «пастырь» или «Иоанна 8».
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-6 rounded-full border border-gold-500/40 px-5 py-2.5 font-ui text-xs uppercase tracking-[0.25em] text-gold-300 transition-colors hover:bg-gold-500/10"
          >
            Показать все имена
          </button>
        </div>
      )}
    </nav>
  );
}
