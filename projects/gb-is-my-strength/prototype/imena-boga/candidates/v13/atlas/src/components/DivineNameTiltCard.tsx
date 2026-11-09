import React, { useRef, useState } from 'react';
import {
  BookOpen,
  Sparkles,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Cross,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';
import { DivineNameEntry } from '../data/divineNames';

interface DivineNameTiltCardProps {
  entry: DivineNameEntry;
  isActive: boolean;
  isRevealed: boolean;
  isStudied: boolean;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onToggleStudied: (id: string) => void;
  onSelect: (entry: DivineNameEntry) => void;
}

export const DivineNameTiltCard: React.FC<DivineNameTiltCardProps> = ({
  entry,
  isActive,
  isRevealed,
  isStudied,
  isExpanded,
  onToggleExpand,
  onToggleStudied,
  onSelect,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, glowX: 50, glowY: 50, hovering: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;

    const ry = (px - 0.5) * 8;
    const rx = -(py - 0.5) * 6;

    setTilt({
      rx,
      ry,
      glowX: px * 100,
      glowY: py * 100,
      hovering: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt((prev) => ({
      ...prev,
      rx: 0,
      ry: 0,
      hovering: false,
    }));
  };

  const primaryVerse = entry.keyVerses[0];

  return (
    <article
      id={`name-${entry.id}`}
      data-name-id={entry.id}
      tabIndex={-1}
      className="scroll-mt-24 my-9 transition-all duration-700"
      style={{
        perspective: '1150px',
        opacity: isRevealed ? 1 : 0.72,
        transform: isRevealed ? 'translateY(0px)' : 'translateY(14px)',
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={`group relative overflow-hidden rounded-2xl border p-6 sm:p-8 text-left transition-shadow duration-500 ${
          isActive ? 'sacred-active-glow' : ''
        }`}
        style={{
          transform:
            tilt.hovering && !isExpanded
              ? `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(1.008, 1.008, 1.008)`
              : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transformStyle: 'preserve-3d',
          transition: tilt.hovering
            ? 'transform 90ms ease-out, box-shadow 300ms ease, border-color 300ms ease'
            : 'transform 450ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 400ms ease, border-color 400ms ease',
          backgroundColor: 'var(--gb-surface)',
          borderColor: isActive || tilt.hovering ? 'var(--gb-gold)' : 'var(--gb-border-strong)',
          boxShadow: isActive ? 'var(--gb-shadow-xl)' : 'var(--gb-shadow-lg)',
        }}
      >
        {/* Dynamic Cursor-Following Specular Golden Sheen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: tilt.hovering ? 0.9 : isActive ? 0.45 : 0,
            background: `radial-gradient(460px circle at ${tilt.glowX}% ${tilt.glowY}%, var(--gb-gold-glow), transparent 72%)`,
          }}
        />

        {/* Subtle Engraved Inner Sacred Border */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 rounded-xl border opacity-35 transition-opacity group-hover:opacity-65"
          style={{ borderColor: 'var(--gb-gold)' }}
        />

        {/* Giant Architectural Calligraphy Watermark */}
        <div
          aria-hidden="true"
          className={`${
            entry.language === 'greek' ? 'font-greek' : 'font-hebrew'
          } pointer-events-none absolute -right-3 -bottom-5 select-none text-7xl sm:text-8xl md:text-9xl font-bold opacity-[0.055] transition-transform duration-700 group-hover:scale-105`}
          style={{ color: 'var(--gb-gold)' }}
        >
          {entry.original}
        </div>

        {/* Top Meta Header */}
        <div
          className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b pb-4"
          style={{ borderColor: 'var(--gb-border)' }}
        >
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className="font-ui inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold tracking-wider uppercase"
              style={{
                backgroundColor: 'var(--gb-accent-soft)',
                color: 'var(--gb-accent)',
              }}
            >
              <Sparkles className="h-3 w-3" style={{ color: 'var(--gb-gold)' }} />
              Позиция {entry.number}
            </span>
            <span className="font-ui text-xs font-medium" style={{ color: 'var(--gb-muted)' }}>
              {entry.category}
            </span>
            {isStudied && (
              <span
                className="font-ui inline-flex items-center gap-1 rounded-full border border-emerald-600/40 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600"
                title="Вы отметили это Имя как изученное"
              >
                <CheckCircle2 className="h-3 w-3" />
                <span>Изучено</span>
              </span>
            )}
          </div>

          <div className="font-ui flex items-center gap-2 text-[11px]" style={{ color: 'var(--gb-muted)' }}>
            <span
              className="rounded border px-2 py-0.5 font-mono"
              style={{ borderColor: 'var(--gb-border)', backgroundColor: 'var(--gb-bg)' }}
            >
              {entry.strongs}
            </span>
            <span className="hidden sm:inline">{entry.occurrences}</span>
          </div>
        </div>

        {/* Main Name Display Row: Russian Title + Vocalized Original */}
        <div className="relative z-10 mt-5 grid min-w-0 grid-cols-1 gap-4" data-name-display>
          <div className="min-w-0 w-full">
            <button
              type="button"
              onClick={() => onSelect(entry)}
              data-name-primary-title className="font-serif-display block w-full min-w-0 cursor-pointer break-words text-left text-2xl font-bold leading-tight tracking-tight transition-colors hover:underline sm:text-3xl"
              style={{ color: 'var(--gb-ink)' }}
            >
              {entry.transliteration}
            </button>
            <p
              className="font-serif-display mt-0.5 text-base sm:text-lg italic font-semibold"
              style={{ color: 'var(--gb-accent)' }}
            >
              {entry.russianName}
            </p>
            <p className="font-ui mt-1.5 text-xs" style={{ color: 'var(--gb-muted)' }}>
              Буквально: <span style={{ color: 'var(--gb-ink-secondary)' }}>{entry.literalMeaning}</span>
            </p>
          </div>

          {/* Original Script Plaque (with true 3D Z-elevation on hover) */}
          <button
            type="button"
            onClick={() => onSelect(entry)}
            title="Нажмите, чтобы открыть полное досье"
            className="min-w-0 max-w-full justify-self-end cursor-pointer rounded-xl border px-4 py-3 text-right shadow-sm motion-safe:transition-transform motion-safe:duration-300 sm:px-5"
            style={{
              backgroundColor: 'var(--gb-bg)',
              borderColor: 'var(--gb-gold)',
              transform: tilt.hovering ? 'translateZ(22px) scale(1.03)' : 'translateZ(0px) scale(1)',
            }}
          >
            <div data-name-original
              lang={entry.language === 'greek' ? 'el' : entry.language === 'aramaic' ? 'arc' : 'he'}
              dir={entry.language === 'greek' ? 'ltr' : 'rtl'}
              className={`${
                entry.language === 'greek' ? 'font-greek' : 'font-hebrew'
              } block min-w-0 max-w-full break-words text-xl font-bold leading-tight [overflow-wrap:anywhere] sm:text-2xl md:text-3xl`}
              style={{
                color: 'var(--gb-ink)',
                textShadow: isActive ? '0 0 18px var(--gb-gold-glow)' : 'none',
              }}
            >
              {entry.original}
            </div>
            <div
              className="font-ui mt-1 text-[10px] tracking-widest uppercase"
              style={{ color: 'var(--gb-gold-ink)' }}
            >
              {entry.language === 'hebrew'
                ? 'Древнееврейский'
                : entry.language === 'aramaic'
                  ? 'Арамейский'
                  : 'Древнегреческий'}
            </div>
          </button>
        </div>

        {/* Synodal Key Scripture Quotes */}
        {primaryVerse && (
          <div className="relative z-10 mt-5 space-y-2.5">
            <blockquote
              className="rounded-xl border-l-4 px-4 py-3.5"
              style={{
                backgroundColor: 'var(--gb-surface-quote)',
                borderLeftColor: 'var(--gb-accent)',
              }}
            >
              <p
                className="font-quote-editorial text-lg sm:text-[1.22rem] italic leading-relaxed"
                style={{ color: 'var(--gb-ink)' }}
              >
                {primaryVerse.synodal}
              </p>
              <footer
                className="font-ui mt-1.5 flex items-center justify-between text-xs font-semibold"
                style={{ color: 'var(--gb-accent)' }}
              >
                <span>{primaryVerse.ref}</span>
                <span className="font-normal text-[11px]" style={{ color: 'var(--gb-muted)' }}>
                  Синодальный перевод
                </span>
              </footer>
              {primaryVerse.note && (
                <p
                  className="font-ui mt-2 border-t pt-2 text-xs leading-relaxed"
                  style={{ borderColor: 'var(--gb-border)', color: 'var(--gb-muted)' }}
                >
                  Примечание экзегета: {primaryVerse.note}
                </p>
              )}
            </blockquote>

            {entry.keyVerses[1] && (
              <div
                className="rounded-xl border px-3.5 py-2.5 text-sm"
                style={{
                  backgroundColor: 'var(--gb-bg)',
                  borderColor: 'var(--gb-border)',
                }}
              >
                <span className="font-quote-editorial italic" style={{ color: 'var(--gb-ink-secondary)' }}>
                  {entry.keyVerses[1].synodal}
                </span>{' '}
                <span
                  className="font-ui text-xs font-semibold whitespace-nowrap"
                  style={{ color: 'var(--gb-gold-ink)' }}
                >
                  — {entry.keyVerses[1].ref}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Concise Exegetical Summary */}
        <p
          className="font-body-editorial relative z-10 mt-5 text-[15.5px] sm:text-base leading-relaxed"
          style={{ color: 'var(--gb-ink-secondary)' }}
        >
          {entry.summary}
        </p>

        {/* Inline Expandable Full Exegesis, Christology & Pastoral Application (also visible on print) */}
        <div className={`${isExpanded ? 'block' : 'hidden print:block'} relative z-10 mt-6 space-y-5 border-t pt-5`} style={{ borderColor: 'var(--gb-border)' }}>
          <div>
            <h4
              className="font-serif-display mb-2.5 text-lg font-bold"
              style={{ color: 'var(--gb-ink)' }}
            >
              Экзегетический и лексический разбор
            </h4>
            <div
              className="font-body-editorial space-y-3.5 text-[15.5px] leading-[1.8]"
              style={{ color: 'var(--gb-ink-secondary)' }}
            >
              {entry.deepExegesis.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          <div
            className="rounded-xl border p-4 sm:p-5"
            style={{
              backgroundColor: 'var(--gb-accent-soft)',
              borderColor: 'var(--gb-accent)',
            }}
          >
            <div
              className="font-ui mb-1.5 flex items-center gap-2 text-xs font-bold tracking-wider uppercase"
              style={{ color: 'var(--gb-accent)' }}
            >
              <Cross className="h-3.5 w-3.5" />
              <span>Исполнение во Христе Иисусе</span>
            </div>
            <p className="font-body-editorial text-[15px] leading-relaxed" style={{ color: 'var(--gb-ink)' }}>
              {entry.christologicalFulfillment}
            </p>
          </div>

          <div
            className="rounded-xl border p-4 sm:p-5"
            style={{
              backgroundColor: 'var(--gb-bg)',
              borderColor: 'var(--gb-border-strong)',
            }}
          >
            <div
              className="font-ui mb-1.5 flex items-center gap-2 text-xs font-bold tracking-wider uppercase"
              style={{ color: 'var(--gb-gold-ink)' }}
            >
              <HeartHandshake className="h-3.5 w-3.5" />
              <span>Пастырское применение для веры и молитвы</span>
            </div>
            <p
              className="font-body-editorial text-[15px] leading-relaxed"
              style={{ color: 'var(--gb-ink-secondary)' }}
            >
              {entry.pastoralApplication}
            </p>
          </div>
        </div>

        {/* Bottom Interactive Action Strip */}
        <div
          className="no-print relative z-10 mt-6 flex flex-wrap items-center justify-between gap-3 border-t pt-4"
          style={{ borderColor: 'var(--gb-border)' }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleExpand(entry.id)}
              className="font-ui inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:opacity-85"
              style={{
                borderColor: 'var(--gb-border-strong)',
                backgroundColor: 'var(--gb-bg)',
                color: 'var(--gb-ink-secondary)',
              }}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" style={{ color: 'var(--gb-gold)' }} />
                  <span>Свернуть в тексте</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" style={{ color: 'var(--gb-gold)' }} />
                  <span>Развернуть в тексте</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onToggleStudied(entry.id)}
              className="font-ui inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:opacity-85"
              style={{
                borderColor: isStudied ? '#2a6b4a' : 'var(--gb-border-strong)',
                backgroundColor: isStudied ? 'rgba(42, 107, 74, 0.12)' : 'var(--gb-bg)',
                color: isStudied ? '#2a6b4a' : 'var(--gb-ink-secondary)',
              }}
              title="Отметить это Имя как изученное"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{isStudied ? 'Изучено ✓' : 'Отметить изученным'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => onSelect(entry)}
            className="font-ui inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all hover:translate-x-0.5"
            style={{
              backgroundColor: 'var(--gb-accent-soft)',
              color: 'var(--gb-accent)',
            }}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Открыть полное досье</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
