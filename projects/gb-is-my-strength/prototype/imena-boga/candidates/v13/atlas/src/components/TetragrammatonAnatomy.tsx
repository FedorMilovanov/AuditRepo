import React, { useState } from 'react';
import { Sparkles, Eye, Info } from 'lucide-react';

interface LetterBreakdown {
  id: string;
  char: string;
  name: string;
  translit: string;
  position: string;
  meaning: string;
  theology: string;
}

// Ordered logically 1st -> 4th; rendered inside a dir="rtl" grid so it flows right-to-left on both 2x2 mobile and 1x4 desktop!
const TETRAGRAM_LETTERS: LetterBreakdown[] = [
  {
    id: 'yod', char: 'י', name: 'Йод', translit: 'Y', position: '1-я буква (справа)',
    meaning: 'Первая согласная имени יהוה',
    theology: 'Имя יהוה состоит из четырёх согласных. Связь имени с еврейским глаголом «быть» обсуждается в связи с Исх. 3:14–15; точная древняя огласовка неизвестна. Отдельная буква сама по себе не несёт самостоятельного богословского учения.',
  },
  {
    id: 'he-first', char: 'ה', name: 'Хе', translit: 'H', position: '2-я буква',
    meaning: 'Вторая согласная имени יהוה',
    theology: 'Буква ה входит в обычный алфавит древнееврейского языка. Утверждение, будто добавление этой буквы в имена Авраама и Сарры доказывает тайную связь с тетраграмматоном, нельзя представлять как установленный факт.',
  },
  {
    id: 'vav', char: 'ו', name: 'Вав', translit: 'W / V', position: '3-я буква',
    meaning: 'Третья согласная имени יהוה',
    theology: 'Вав может быть согласной и использоваться в других грамматических ролях, но в составе собственного имени её нельзя произвольно истолковывать как символ соединения прошлого, настоящего и будущего. Откр. 1:8 следует изучать в его собственном контексте.',
  },
  {
    id: 'he-final', char: 'ה', name: 'Хе', translit: 'H', position: '4-я буква (слева)',
    meaning: 'Последняя согласная тетраграмматона',
    theology: 'Повторение ה — графический факт написания имени, а не доказательство особого тайного значения этой буквы. Богословский смысл имени следует искать в тексте Исх. 3:14–15, Исх. 6:2–8 и других контекстах Писания.',
  },
];

export const TetragrammatonAnatomy: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('yod');
  const [showMasoreticVowels, setShowMasoreticVowels] = useState<boolean>(true);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const activeLetter =
    TETRAGRAM_LETTERS.find((l) => l.id === selectedId) || TETRAGRAM_LETTERS[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: -ny * 7, ry: nx * 9 });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div
      data-reveal
      className="my-10"
      style={{ perspective: '1100px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="rounded-3xl border p-6 sm:p-8 shadow-xl transition-transform duration-200"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: 'preserve-3d',
          backgroundColor: 'var(--gb-surface)',
          borderColor: 'var(--gb-gold)',
          boxShadow: 'var(--gb-shadow-xl)',
        }}
      >
        <div
          className="flex flex-wrap items-center justify-between gap-3 border-b pb-4"
          style={{ borderColor: 'var(--gb-border)' }}
        >
          <div>
            <div
              className="font-ui flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase"
              style={{ color: 'var(--gb-gold)' }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Четыре буквы тетраграмматона · письмо и контекст</span>
            </div>
            <h3
              className="font-serif-display mt-1 text-xl sm:text-2xl font-bold"
              style={{ color: 'var(--gb-ink)' }}
            >
              Четыре священные буквы Имени (чтение справа налево ←)
            </h3>
          </div>

          <button
            type="button"
            onClick={() => setShowMasoreticVowels((v) => !v)}
            className="font-ui inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors"
            style={{
              backgroundColor: showMasoreticVowels ? 'var(--gb-accent-soft)' : 'var(--gb-bg)',
              borderColor: showMasoreticVowels ? 'var(--gb-accent)' : 'var(--gb-border-strong)',
              color: showMasoreticVowels ? 'var(--gb-accent)' : 'var(--gb-ink)',
            }}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>
              {showMasoreticVowels ? 'С огласовкой (יְהוָה)' : 'Консонантный текст (יהוה)'}
            </span>
          </button>
        </div>

        {/* Full Word Display */}
        <div
          className="mt-5 flex flex-col items-center justify-center rounded-2xl border py-5 px-4 text-center"
          style={{
            backgroundColor: 'var(--gb-bg)',
            borderColor: 'var(--gb-border)',
          }}
        >
          <div
            className="font-hebrew text-5xl sm:text-6xl font-bold tracking-widest"
            style={{
              color: 'var(--gb-ink)',
              textShadow: '0 0 24px var(--gb-gold-glow)',
            }}
          >
            {showMasoreticVowels ? 'יְהוָה' : 'יהוה'}
          </div>
          <p className="font-ui mt-2 text-xs" style={{ color: 'var(--gb-muted)' }}>
            {showMasoreticVowels
              ? 'Масоретская огласовка (Шва – Холам – Камац) взята от слова Адонай (אֲדֹנָי) как напоминание при чтении вслух'
              : 'Древний консонантный корень ЙХВХ (Йод — Хе — Вав — Хе) без позднейших огласовок'}
          </p>
        </div>

        {/* 4 Interactive Letter Plaques in authentic Hebrew RTL grid flow */}
        <div dir="rtl" className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {TETRAGRAM_LETTERS.map((letter) => {
            const isSelected = letter.id === selectedId;
            return (
              <button
                key={letter.id}
                type="button"
                dir="ltr"
                onClick={() => setSelectedId(letter.id)}
                className={`group flex cursor-pointer flex-col items-center rounded-2xl border p-4 text-center transition-all duration-300 ${
                  isSelected ? 'sacred-active-glow scale-[1.03]' : 'hover:-translate-y-0.5'
                }`}
                style={{
                  backgroundColor: isSelected ? 'var(--gb-accent-soft)' : 'var(--gb-bg)',
                  borderColor: isSelected ? 'var(--gb-gold)' : 'var(--gb-border-strong)',
                  transform: isSelected ? 'translateZ(18px) scale(1.03)' : 'translateZ(0px)',
                }}
              >
                <span
                  className="font-ui text-[10px] font-bold tracking-wider uppercase"
                  style={{ color: isSelected ? 'var(--gb-accent)' : 'var(--gb-gold)' }}
                >
                  {letter.position}
                </span>
                <span
                  className="font-hebrew my-2 text-4xl sm:text-5xl font-bold"
                  style={{ color: 'var(--gb-ink)' }}
                >
                  {letter.char}
                </span>
                <span
                  className="font-serif-display text-sm font-bold"
                  style={{ color: 'var(--gb-ink)' }}
                >
                  {letter.name}
                </span>
                <span
                  className="font-ui mt-0.5 text-[11px] font-mono"
                  style={{ color: 'var(--gb-muted)' }}
                >
                  [{letter.translit}]
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Letter Exegetical Panel */}
        <div
          className="mt-5 rounded-2xl border p-5 transition-all"
          style={{
            backgroundColor: 'var(--gb-surface-quote)',
            borderColor: 'var(--gb-border-strong)',
          }}
        >
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 shrink-0" style={{ color: 'var(--gb-accent)' }} />
            <h4
              className="font-serif-display text-base sm:text-lg font-bold"
              style={{ color: 'var(--gb-ink)' }}
            >
              {activeLetter.name} ({activeLetter.position}): {activeLetter.meaning}
            </h4>
          </div>
          <p
            className="font-body-editorial mt-2.5 text-[15px] leading-relaxed"
            style={{ color: 'var(--gb-ink-secondary)' }}
          >
            {activeLetter.theology}
          </p>
        </div>
      </div>
    </div>
  );
};
