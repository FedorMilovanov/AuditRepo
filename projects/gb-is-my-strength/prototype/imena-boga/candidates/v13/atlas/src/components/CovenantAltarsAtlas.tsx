import React, { useState } from 'react';
import { MapPin, Compass, BookOpen, Navigation, ChevronLeft, ChevronRight } from 'lucide-react';
import { COVENANT_ALTARS, DivineNameEntry } from '../data/divineNames';

interface CovenantAltarsAtlasProps {
  names: DivineNameEntry[];
  onSelectName: (entry: DivineNameEntry) => void;
  onJumpToName: (entry: DivineNameEntry) => void;
}

export const CovenantAltarsAtlas: React.FC<CovenantAltarsAtlasProps> = ({
  names,
  onSelectName,
  onJumpToName,
}) => {
  const [selectedAltarId, setSelectedAltarId] = useState<string>(COVENANT_ALTARS[2].id); // Default to Moriah (Yahweh-Yireh)

  const currentIdx = COVENANT_ALTARS.findIndex((a) => a.id === selectedAltarId);
  const safeIdx = currentIdx >= 0 ? currentIdx : 0;
  const activeAltar = COVENANT_ALTARS[safeIdx];
  const linkedName = names.find((n) => n.id === activeAltar.nameId) || names[0];

  const handlePrevAltar = () => {
    const prevIdx = (safeIdx - 1 + COVENANT_ALTARS.length) % COVENANT_ALTARS.length;
    setSelectedAltarId(COVENANT_ALTARS[prevIdx].id);
  };

  const handleNextAltar = () => {
    const nextIdx = (safeIdx + 1) % COVENANT_ALTARS.length;
    setSelectedAltarId(COVENANT_ALTARS[nextIdx].id);
  };

  const getLabelPositionClasses = (align: 'top' | 'bottom' | 'left' | 'right' = 'bottom') => {
    switch (align) {
      case 'top':
        return 'left-1/2 bottom-full mb-1.5 -translate-x-1/2';
      case 'left':
        return 'right-full top-1/2 mr-2 -translate-y-1/2';
      case 'right':
        return 'left-full top-1/2 ml-2 -translate-y-1/2';
      case 'bottom':
      default:
        return 'left-1/2 top-full mt-1.5 -translate-x-1/2';
    }
  };

  return (
    <section
      id="covenant-altars-atlas"
      data-reveal
      className="scroll-mt-24 my-16 rounded-3xl border p-6 sm:p-8 shadow-xl"
      style={{
        backgroundColor: 'var(--gb-surface)',
        borderColor: 'var(--gb-border-strong)',
        boxShadow: 'var(--gb-shadow-xl)',
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4" style={{ borderColor: 'var(--gb-border)' }}>
        <div className="min-w-0 flex-1">
          <div className="font-ui flex min-w-0 flex-wrap items-center gap-2 text-xs font-bold tracking-wider uppercase" style={{ color: 'var(--gb-gold-ink)' }}>
            <Compass className="h-4 w-4" />
            <span className="min-w-0 break-words">Библейская география откровения · В духе раздела «Карты»</span>
          </div>
          <h2 className="font-serif-display mt-1 min-w-0 text-2xl sm:text-3xl font-bold break-words" style={{ color: 'var(--gb-ink)' }}>
            Карта жертвенников и мест явления Имён Божьих
          </h2>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrevAltar}
            className="font-ui inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors hover:opacity-85"
            style={{
              borderColor: 'var(--gb-border-strong)',
              backgroundColor: 'var(--gb-bg)',
              color: 'var(--gb-ink)',
            }}
            aria-label="Предыдущее место на карте"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Назад</span>
          </button>
          <span className="font-ui px-1.5 text-xs tabular-nums font-semibold" style={{ color: 'var(--gb-gold-ink)' }}>
            {safeIdx + 1} / {COVENANT_ALTARS.length}
          </span>
          <button
            type="button"
            onClick={handleNextAltar}
            className="font-ui inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors hover:opacity-85"
            style={{
              borderColor: 'var(--gb-border-strong)',
              backgroundColor: 'var(--gb-bg)',
              color: 'var(--gb-ink)',
            }}
            aria-label="Следующее место на карте"
          >
            <span className="hidden sm:inline">Далее</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <p className="font-body-editorial mt-3 text-[15px] leading-relaxed" style={{ color: 'var(--gb-ink-secondary)' }}>
        В Писании имена Бога открывались не в отвлечённых философских диспутах, а в конкретных
        точках земли — у колодцев пустыни, на горных вершинах и у жертвенников завета. Нажмите на
        любой маяк на карте или выберите этап пути завета ниже.
      </p>

      {/* Quick Chronological Waypoint Strip */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {COVENANT_ALTARS.map((altar, idx) => {
          const isSelected = altar.id === activeAltar.id;
          return (
            <button
              key={altar.id}
              type="button"
              onClick={() => setSelectedAltarId(altar.id)}
              className="font-ui cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all"
              style={{
                backgroundColor: isSelected ? 'var(--gb-accent)' : 'var(--gb-bg)',
                borderColor: isSelected ? 'var(--gb-accent)' : 'var(--gb-border-strong)',
                color: isSelected ? '#ffffff' : 'var(--gb-ink-secondary)',
              }}
            >
              {idx + 1}. {altar.placeName.split(' (')[0]}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Stylized Cartographic Map Canvas */}
        <div
          className="relative min-h-[360px] sm:min-h-[400px] overflow-hidden rounded-2xl border lg:col-span-7"
          style={{
            borderColor: 'var(--gb-gold)',
            background:
              'radial-gradient(circle at 45% 45%, rgba(184, 147, 106, 0.16), rgba(124, 45, 45, 0.06) 70%, transparent 100%), var(--gb-bg)',
          }}
        >
          {/* Cartographic Coordinate Grid & Ancient Coastline SVG */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full opacity-45"
          >
            {/* Latitude / Longitude Rhumb Lines */}
            <line x1="20" y1="0" x2="20" y2="100" stroke="var(--gb-border-strong)" strokeWidth="0.25" strokeDasharray="1 1.5" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="var(--gb-border-strong)" strokeWidth="0.25" strokeDasharray="1 1.5" />
            <line x1="80" y1="0" x2="80" y2="100" stroke="var(--gb-border-strong)" strokeWidth="0.25" strokeDasharray="1 1.5" />
            <line x1="0" y1="25" x2="100" y2="25" stroke="var(--gb-border-strong)" strokeWidth="0.25" strokeDasharray="1 1.5" />
            <line x1="0" y1="55" x2="100" y2="55" stroke="var(--gb-border-strong)" strokeWidth="0.25" strokeDasharray="1 1.5" />
            <line x1="0" y1="82" x2="100" y2="82" stroke="var(--gb-border-strong)" strokeWidth="0.25" strokeDasharray="1 1.5" />

            {/* Stylized Mediterranean Coastline & Jordan Rift Valley */}
            <path
              d="M 0,10 Q 26,26 24,56 T 10,80 L 0,84 Z"
              fill="rgba(184, 147, 106, 0.11)"
              stroke="var(--gb-gold)"
              strokeWidth="0.35"
            />
            {/* Jordan River & Dead Sea */}
            <path
              d="M 62,10 Q 63,28 61,48 L 61,64"
              fill="none"
              stroke="var(--gb-gold)"
              strokeWidth="0.55"
              opacity="0.65"
            />
            {/* Red Sea / Gulf of Suez & Aqaba */}
            <path
              d="M 14,91 L 24,100 M 46,93 L 41,100"
              fill="none"
              stroke="var(--gb-gold)"
              strokeWidth="0.6"
              opacity="0.6"
            />

            {/* Connecting Covenant Pilgrim Path */}
            <polyline
              points={COVENANT_ALTARS.map((a) => `${a.x},${a.y}`).join(' ')}
              fill="none"
              stroke="var(--gb-accent)"
              strokeWidth="0.45"
              strokeDasharray="1.4 1.2"
              opacity="0.65"
            />
          </svg>

          {/* Regional Watermark Labels */}
          <span
            aria-hidden="true"
            className="font-serif-display pointer-events-none absolute top-4 left-4 text-[11px] italic tracking-widest uppercase opacity-50"
            style={{ color: 'var(--gb-muted)' }}
          >
            Великое Море
          </span>
          <span
            aria-hidden="true"
            className="font-serif-display pointer-events-none absolute bottom-2.5 left-1/2 -translate-x-1/2 text-[11px] italic tracking-widest uppercase opacity-50"
            style={{ color: 'var(--gb-muted)' }}
          >
            Полуостров Синай
          </span>

          {/* Interactive Altar Pins */}
          {COVENANT_ALTARS.map((altar, idx) => {
            const isSelected = altar.id === activeAltar.id;
            return (
              <button
                key={altar.id}
                type="button"
                onClick={() => setSelectedAltarId(altar.id)}
                style={{ left: `${altar.x}%`, top: `${altar.y}%`, zIndex: isSelected ? 20 : 10 }}
                className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none"
                aria-label={`${idx + 1}. ${altar.placeName} — ${altar.scriptureRef}`}
              >
                {/* Pulsing Halo for Selected Pin */}
                {isSelected && (
                  <span
                    aria-hidden="true"
                    className="absolute -inset-2.5 animate-ping rounded-full opacity-55"
                    style={{ backgroundColor: 'var(--gb-gold)' }}
                  />
                )}
                <span
                  className={`relative flex h-6 w-6 items-center justify-center rounded-full border shadow-md transition-transform duration-200 ${
                    isSelected ? 'scale-125' : 'group-hover:scale-110'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'var(--gb-accent)' : 'var(--gb-surface)',
                    borderColor: 'var(--gb-gold)',
                    color: isSelected ? '#ffffff' : 'var(--gb-accent)',
                  }}
                >
                  <MapPin className="h-3.5 w-3.5" />
                </span>

                {/* Floating Place Label with Smart Non-Overlapping Alignment */}
                <span
                  className={`font-ui pointer-events-none absolute whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-semibold shadow-sm transition-opacity ${getLabelPositionClasses(
                    altar.labelAlign
                  )} ${isSelected ? 'opacity-100' : 'opacity-85 group-hover:opacity-100'}`}
                  style={{
                    backgroundColor: isSelected ? 'var(--gb-ink)' : 'var(--gb-glass)',
                    color: isSelected ? 'var(--gb-canvas)' : 'var(--gb-ink)',
                  }}
                >
                  {idx + 1}. {altar.placeName.split(' (')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Altar & Divine Name Details Card */}
        <div
          className="flex flex-col justify-between rounded-2xl border p-5 sm:p-6 lg:col-span-5"
          style={{
            backgroundColor: 'var(--gb-bg)',
            borderColor: 'var(--gb-border-strong)',
          }}
        >
          <div>
            <div className="font-ui text-[11px] font-bold tracking-wider uppercase" style={{ color: 'var(--gb-gold-ink)' }}>
              {activeAltar.era}
            </div>
            <h3 className="font-serif-display mt-1 text-xl sm:text-2xl font-bold" style={{ color: 'var(--gb-ink)' }}>
              {activeAltar.placeName}
            </h3>
            <div className="font-ui text-xs font-medium" style={{ color: 'var(--gb-muted)' }}>
              {activeAltar.biblicalRegion} · <strong style={{ color: 'var(--gb-accent)' }}>{activeAltar.scriptureRef}</strong>
            </div>

            <p className="font-body-editorial mt-4 text-[15px] leading-relaxed" style={{ color: 'var(--gb-ink-secondary)' }}>
              {activeAltar.eventSummary}
            </p>

            {/* Linked Divine Name Mini Plaque */}
            <div
              className="mt-5 rounded-xl border p-4"
              style={{
                backgroundColor: 'var(--gb-surface)',
                borderColor: 'var(--gb-gold)',
              }}
            >
              <div className="font-ui text-[10px] font-semibold uppercase" style={{ color: 'var(--gb-gold-ink)' }}>
                Открытое здесь Имя Бога (№ {linkedName.number})
              </div>
              <div className="mt-1.5 flex items-baseline justify-between gap-2">
                <div>
                  <div className="font-serif-display text-lg font-bold" style={{ color: 'var(--gb-ink)' }}>
                    {linkedName.transliteration}
                  </div>
                  <div className="font-ui text-xs font-medium" style={{ color: 'var(--gb-accent)' }}>
                    {linkedName.russianName}
                  </div>
                </div>
                <span
                  className={`${linkedName.language === 'greek' ? 'font-greek' : 'font-hebrew'} text-2xl font-bold`}
                  style={{ color: 'var(--gb-ink)' }}
                >
                  {linkedName.original}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5 pt-3 border-t" style={{ borderColor: 'var(--gb-border)' }}>
            <button
              type="button"
              onClick={() => onSelectName(linkedName)}
              className="font-ui inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--gb-accent)' }}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Открыть разбор</span>
            </button>

            <button
              type="button"
              onClick={() => onJumpToName(linkedName)}
              className="font-ui inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border px-3.5 py-2.5 text-xs font-medium transition-colors hover:opacity-85"
              style={{
                borderColor: 'var(--gb-border-strong)',
                backgroundColor: 'var(--gb-surface)',
                color: 'var(--gb-ink)',
              }}
            >
              <Navigation className="h-3.5 w-3.5" />
              <span>В тексте</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
