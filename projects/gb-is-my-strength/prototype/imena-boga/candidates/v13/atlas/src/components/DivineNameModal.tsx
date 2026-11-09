import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  BookOpen,
  Sparkles,
  Cross,
  HeartHandshake,
  Navigation,
  Volume2,
  Square,
  CheckCircle2,
  Link2,
  Share2,
  ArrowUpRight,
} from 'lucide-react';
import { DivineNameEntry } from '../data/divineNames';
import { atlasToReader } from '../data/topicCrosswalk';

interface DivineNameModalProps {
  entry: DivineNameEntry | null;
  allNames: DivineNameEntry[];
  studiedIds: Set<string>;
  onToggleStudied: (id: string) => void;
  onClose: () => void;
  onSelectEntry: (entry: DivineNameEntry) => void;
  onJumpToArticle: (entry: DivineNameEntry) => void;
}

export const DivineNameModal: React.FC<DivineNameModalProps> = ({
  entry,
  allNames,
  studiedIds,
  onToggleStudied,
  onClose,
  onSelectEntry,
  onJumpToArticle,
}) => {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [copiedVerseIdx, setCopiedVerseIdx] = useState<number | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [bannerTilt, setBannerTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, active: false });
  const scrollBodyRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  // A jump into the article deliberately transfers focus instead of restoring
  // it to the off-screen control that originally opened the dossier.
  const shouldRestoreFocusRef = useRef(true);

  const currentIndex = entry ? allNames.findIndex((n) => n.id === entry.id) : -1;
  const prevEntry = currentIndex > 0 ? allNames[currentIndex - 1] : null;
  const nextEntry =
    currentIndex >= 0 && currentIndex < allNames.length - 1 ? allNames[currentIndex + 1] : null;

  const counterpartId = entry ? atlasToReader.get(entry.id) : undefined;

  const relatedNames = useMemo(() => {
    if (!entry) return [];
    return allNames
      .filter((n) => n.id !== entry.id && (n.soulNeed === entry.soulNeed || n.sectionId === entry.sectionId))
      .slice(0, 4);
  }, [entry, allNames]);

  // Capture the opener before the dialog takes keyboard focus. Both layout
  // effects run in declaration order, before the newly opened dialog is painted.
  const isOpen = Boolean(entry);
  useLayoutEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      shouldRestoreFocusRef.current = true;
      return () => {
        if (shouldRestoreFocusRef.current) {
          previousFocusRef.current?.focus({ preventScroll: true });
        }
      };
    }
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!entry) return;
    if (scrollBodyRef.current) {
      scrollBodyRef.current.scrollTop = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
    setCopied(false);
    setLinkCopied(false);
    setCopiedVerseIdx(null);
    // The close control is present in the committed DOM; a timer here leaves
    // keyboard focus outside aria-modal for one or more frames.
    closeButtonRef.current?.focus({ preventScroll: true });
  }, [entry?.id]);

  useEffect(() => {
    if (!entry) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }
      // Do not hijack native arrow-key behaviour of focused interactive controls.
      const target = e.target as HTMLElement | null;
      const inInteractiveControl = Boolean(target?.closest('input, textarea, select, button, a, [contenteditable="true"]'));
      if (!inInteractiveControl && !e.altKey && !e.ctrlKey && !e.metaKey) {
        if (e.key === 'ArrowLeft' && prevEntry) {
          e.preventDefault();
          onSelectEntry(prevEntry);
        }
        if (e.key === 'ArrowRight' && nextEntry) {
          e.preventDefault();
          onSelectEntry(nextEntry);
        }
      }

      // Focus trap: keep Tab cycling inside the dialog
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setSpeaking(false);
    };
  }, [entry, prevEntry, nextEntry, onClose, onSelectEntry]);

  if (!entry) return null;

  const isStudied = studiedIds.has(entry.id);
  const hasSpeechSupport = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${entry.transliteration} (${entry.original}) — ${entry.russianName}: ${entry.literalMeaning}`
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard failure in restricted iframes
    }
  };

  const handleCopyLink = async () => {
    try {
      const url = `${window.location.origin}${window.location.pathname}#name-${entry.id}`;
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      window.setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // Ignore clipboard failure in restricted iframes
    }
  };

  const handleToggleSpeech = () => {
    if (!hasSpeechSupport) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToRead = [
      `${entry.transliteration} — ${entry.russianName}.`,
      `Буквальное значение: ${entry.literalMeaning}.`,
      entry.summary,
      ...entry.deepExegesis,
      `Исполнение во Христе Иисусе: ${entry.christologicalFulfillment}`,
      `Пастырское применение: ${entry.pastoralApplication}`,
    ].join(' ');

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.98;
    const voices = window.speechSynthesis.getVoices();
    const ruVoice =
      voices.find((v) => v.lang === 'ru-RU') ||
      voices.find((v) => v.lang.toLowerCase().startsWith('ru'));
    if (ruVoice) {
      utterance.voice = ruVoice;
    }
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyVerse = async (synodal: string, ref: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(`${synodal} (${ref})`);
      setCopiedVerseIdx(idx);
      window.setTimeout(() => setCopiedVerseIdx(null), 1800);
    } catch {
      // Ignore clipboard failure
    }
  };

  const handleBannerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setBannerTilt({
      rx: -(py - 0.5) * 8,
      ry: (px - 0.5) * 10,
      gx: px * 100,
      gy: py * 100,
      active: true,
    });
  };

  const handleBannerLeave = () => {
    setBannerTilt((prev) => ({ ...prev, rx: 0, ry: 0, active: false }));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-3 sm:p-6 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-divine-name-title"
    >
      <div
        ref={dialogRef}
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border shadow-2xl"
        style={{
          backgroundColor: 'var(--gb-canvas)',
          borderColor: 'var(--gb-gold)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.55), 0 0 40px var(--gb-gold-glow)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div
          className="flex items-center justify-between gap-2 border-b px-4 py-3.5 sm:px-8 sm:py-4"
          style={{
            backgroundColor: 'var(--gb-bg)',
            borderColor: 'var(--gb-border)',
          }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="font-ui inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold tracking-wider uppercase"
              style={{
                backgroundColor: 'var(--gb-accent-soft)',
                color: 'var(--gb-accent)',
              }}
            >
              <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--gb-gold)' }} />
              Позиция {entry.number} из {allNames.length}
            </span>

            <button
              type="button"
              onClick={() => onToggleStudied(entry.id)}
              className="font-ui inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-medium transition-colors"
              style={{
                backgroundColor: isStudied ? 'rgba(42, 107, 74, 0.12)' : 'var(--gb-surface)',
                borderColor: isStudied ? '#2a6b4a' : 'var(--gb-border-strong)',
                color: isStudied ? '#2a6b4a' : 'var(--gb-muted)',
              }}
              title="Отметить статус изучения этого Имени"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{isStudied ? 'Изучено' : 'Отметить'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {hasSpeechSupport && (
              <button
                type="button"
                onClick={handleToggleSpeech}
                className="font-ui inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors hover:opacity-85"
                style={{
                  borderColor: speaking ? 'var(--gb-accent)' : 'var(--gb-border-strong)',
                  backgroundColor: speaking ? 'var(--gb-accent-soft)' : 'var(--gb-surface)',
                  color: speaking ? 'var(--gb-accent)' : 'var(--gb-ink)',
                }}
                title="Озвучить разбор вслух (TTS)"
              >
                {speaking ? <Square className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">{speaking ? 'Остановить' : 'Слушать'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopy}
              className="font-ui inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors hover:opacity-85"
              style={{
                borderColor: 'var(--gb-border-strong)',
                backgroundColor: 'var(--gb-surface)',
                color: 'var(--gb-ink)',
              }}
              title="Скопировать имя и оригинал"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Скопировано' : 'Копировать'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="font-ui inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors hover:opacity-85"
              style={{
                borderColor: 'var(--gb-border-strong)',
                backgroundColor: 'var(--gb-surface)',
                color: 'var(--gb-ink)',
              }}
              title="Скопировать прямую ссылку на это Имя"
              aria-label="Скопировать прямую ссылку на это Имя"
            >
              {linkCopied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
              <span className="hidden md:inline">{linkCopied ? 'Ссылка скопирована' : 'Ссылка'}</span>
            </button>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-full border p-2 transition-colors hover:opacity-80"
              style={{
                borderColor: 'var(--gb-border-strong)',
                backgroundColor: 'var(--gb-surface)',
                color: 'var(--gb-ink)',
              }}
              aria-label="Закрыть окно"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Deep Study Content */}
        <div ref={scrollBodyRef} className="thin-sacred-scroll flex-1 overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
          {/* Illuminated 3D Tilting Original Banner */}
          <div style={{ perspective: '1000px' }}>
            <div
              onMouseMove={handleBannerMove}
              onMouseLeave={handleBannerLeave}
              className="relative overflow-hidden rounded-2xl border p-6 sm:p-7 text-center"
              style={{
                transform: bannerTilt.active
                  ? `rotateX(${bannerTilt.rx}deg) rotateY(${bannerTilt.ry}deg)`
                  : 'rotateX(0deg) rotateY(0deg)',
                transformStyle: 'preserve-3d',
                transition: bannerTilt.active ? 'transform 100ms ease-out' : 'transform 400ms ease',
                backgroundColor: 'var(--gb-surface)',
                borderColor: 'var(--gb-gold)',
                boxShadow: 'inset 0 0 32px rgba(184, 147, 106, 0.14)',
              }}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                  opacity: bannerTilt.active ? 0.85 : 0.35,
                  background: `radial-gradient(420px circle at ${bannerTilt.gx}% ${bannerTilt.gy}%, var(--gb-gold-glow), transparent 72%)`,
                }}
              />

              <div data-modal-original
                lang={entry.language === 'greek' ? 'el' : entry.language === 'aramaic' ? 'arc' : 'he'}
                dir={entry.language === 'greek' ? 'ltr' : 'rtl'}
                className={`${
                  entry.language === 'greek' ? 'font-greek' : 'font-hebrew'
                } relative z-10 block w-full min-w-0 break-words text-[clamp(1.5rem,6vw,3.75rem)] font-bold leading-snug [overflow-wrap:anywhere]`}
                style={{
                  color: 'var(--gb-ink)',
                  textShadow: '0 0 28px var(--gb-gold-glow)',
                }}
              >
                {entry.original}
              </div>

              <h2
                id="modal-divine-name-title"
                className="font-serif-display relative z-10 mt-3 text-2xl sm:text-3xl font-bold"
                style={{ color: 'var(--gb-ink)' }}
              >
                {entry.transliteration}
              </h2>
              <p
                className="font-serif-display relative z-10 mt-1 text-lg sm:text-xl italic font-semibold"
                style={{ color: 'var(--gb-accent)' }}
              >
                {entry.russianName}
              </p>

              <div
                className="font-ui relative z-10 mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 border-t pt-3.5 text-xs"
                style={{ borderColor: 'var(--gb-border)', color: 'var(--gb-muted)' }}
              >
                <span>
                  Стронг: <strong style={{ color: 'var(--gb-ink)' }}>{entry.strongs}</strong>
                </span>
                <span>·</span>
                <span>{entry.occurrences}</span>
                <span>·</span>
                <span>
                  Язык:{' '}
                  <strong style={{ color: 'var(--gb-gold-ink)' }}>
                    {entry.language === 'hebrew'
                      ? 'иврит'
                      : entry.language === 'aramaic'
                        ? 'арамейский'
                        : 'греческий'}
                  </strong>
                </span>
              </div>

              <p
                className="font-body-editorial relative z-10 mt-3 text-sm sm:text-base"
                style={{ color: 'var(--gb-ink-secondary)' }}
              >
                <strong>Буквальное значение:</strong> {entry.literalMeaning}
              </p>
            </div>
          </div>

          {/* Key Scripture Anchors */}
          <section className="mt-7">
            <h3
              className="font-ui mb-3 flex items-center gap-2 text-xs font-bold tracking-wider uppercase"
              style={{ color: 'var(--gb-gold-ink)' }}
            >
              <BookOpen className="h-4 w-4" />
              <span>Ключевые тексты Священного Писания</span>
            </h3>

            <div className="space-y-3">
              {entry.keyVerses.map((v, idx) => (
                <blockquote
                  key={idx}
                  className="rounded-xl border-l-4 p-4"
                  style={{
                    backgroundColor: 'var(--gb-surface-quote)',
                    borderLeftColor: 'var(--gb-accent)',
                  }}
                >
                  <p
                    className="font-quote-editorial text-lg sm:text-xl italic leading-relaxed"
                    style={{ color: 'var(--gb-ink)' }}
                  >
                    {v.synodal}
                  </p>
                  <footer className="font-ui mt-2 flex items-center justify-between gap-2 text-xs font-semibold">
                    <span style={{ color: 'var(--gb-accent)' }}>{v.ref}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyVerse(v.synodal, v.ref, idx)}
                      className="inline-flex cursor-pointer items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors hover:opacity-85"
                      style={{
                        borderColor: 'var(--gb-border)',
                        backgroundColor: 'var(--gb-surface)',
                        color: 'var(--gb-muted)',
                      }}
                      title="Скопировать этот стих Писания"
                    >
                      {copiedVerseIdx === idx ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span className="text-emerald-600">Скопировано</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Копировать стих</span>
                        </>
                      )}
                    </button>
                  </footer>
                  {v.note && (
                    <p
                      className="font-ui mt-2 border-t pt-2 text-xs leading-relaxed"
                      style={{ borderColor: 'var(--gb-border)', color: 'var(--gb-muted)' }}
                    >
                      Примечание экзегета: {v.note}
                    </p>
                  )}
                </blockquote>
              ))}
            </div>
          </section>

          {/* Deep Exegetical & Lexical Analysis */}
          <section className="mt-7">
            <h3
              className="font-serif-display mb-3 text-xl font-bold"
              style={{ color: 'var(--gb-ink)' }}
            >
              Экзегетический и лексический разбор
            </h3>
            <div
              className="font-body-editorial space-y-4 text-base leading-[1.78]"
              style={{ color: 'var(--gb-ink-secondary)' }}
            >
              {entry.deepExegesis.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </section>

          {/* Christological Fulfillment Box */}
          <section
            className="mt-7 rounded-2xl border p-5 sm:p-6"
            style={{
              backgroundColor: 'var(--gb-accent-soft)',
              borderColor: 'var(--gb-accent)',
            }}
          >
            <h3
              className="font-ui mb-2 flex items-center gap-2 text-xs font-bold tracking-wider uppercase"
              style={{ color: 'var(--gb-accent)' }}
            >
              <Cross className="h-4 w-4" />
              <span>Исполнение во Христе Иисусе</span>
            </h3>
            <p
              className="font-body-editorial text-[15.5px] leading-relaxed"
              style={{ color: 'var(--gb-ink)' }}
            >
              {entry.christologicalFulfillment}
            </p>
          </section>

          {/* Pastoral & Devotional Application */}
          <section
            className="mt-5 rounded-2xl border p-5 sm:p-6"
            style={{
              backgroundColor: 'var(--gb-surface)',
              borderColor: 'var(--gb-border-strong)',
            }}
          >
            <h3
              className="font-ui mb-2 flex items-center gap-2 text-xs font-bold tracking-wider uppercase"
              style={{ color: 'var(--gb-gold-ink)' }}
            >
              <HeartHandshake className="h-4 w-4" />
              <span>Пастырское применение для веры и молитвы</span>
            </h3>
            <p
              className="font-body-editorial text-[15.5px] leading-relaxed"
              style={{ color: 'var(--gb-ink-secondary)' }}
            >
              {entry.pastoralApplication}
            </p>
          </section>

          {/* Related Names Cross-Links */}
          {relatedNames.length > 0 && (
            <section className="mt-7 border-t pt-5" style={{ borderColor: 'var(--gb-border)' }}>
              <h4
                className="font-ui mb-3 flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase"
                style={{ color: 'var(--gb-muted)' }}
              >
                <Link2 className="h-3.5 w-3.5" style={{ color: 'var(--gb-gold)' }} />
                <span>Близкие по смыслу и завету имена</span>
              </h4>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {relatedNames.map((rel) => (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => onSelectEntry(rel)}
                    className="flex cursor-pointer items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left transition-colors hover:opacity-90"
                    style={{
                      backgroundColor: 'var(--gb-bg)',
                      borderColor: 'var(--gb-border-strong)',
                    }}
                  >
                    <div className="min-w-0 flex-1">
                      <div data-related-name-text="title" className="font-serif-display min-w-0 break-words text-sm font-bold" style={{ color: 'var(--gb-ink)' }}>
                        {rel.transliteration}
                      </div>
                      <div data-related-name-text="russian" className="font-ui min-w-0 break-words text-[11px]" style={{ color: 'var(--gb-muted)' }}>
                        {rel.russianName}
                      </div>
                    </div>
                    <span
                      className={`${rel.language === 'greek' ? 'font-greek' : 'font-hebrew'} text-base font-bold shrink-0`}
                      style={{ color: 'var(--gb-accent)' }}
                    >
                      {rel.original}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Bottom Navigation Bar */}
        <div
          className="flex flex-wrap items-center justify-between gap-2 border-t px-4 py-3.5 sm:px-8"
          style={{
            backgroundColor: 'var(--gb-bg)',
            borderColor: 'var(--gb-border)',
          }}
        >
          <button
            type="button"
            disabled={!prevEntry}
            onClick={() => prevEntry && onSelectEntry(prevEntry)}
            className="font-ui inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-35"
            style={{
              borderColor: 'var(--gb-border-strong)',
              backgroundColor: 'var(--gb-surface)',
              color: 'var(--gb-ink)',
            }}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="max-w-[120px] truncate">{prevEntry ? prevEntry.transliteration : 'Начало'}</span>
          </button>

          {counterpartId && (
            <a
              href={`/imena-boga/#${encodeURIComponent(counterpartId)}`}
              aria-label={`Продолжить чтение о «${entry.transliteration}» в Созвездии`}
              className="font-ui inline-flex min-h-10 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors hover:opacity-85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ borderColor: 'var(--gb-gold)', color: 'var(--gb-accent)' }}
            >
              <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
              Созвездие
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}

          <button
            type="button"
            onClick={() => {
              shouldRestoreFocusRef.current = false;
              onClose();
              onJumpToArticle(entry);
            }}
            className="font-ui inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: 'var(--gb-accent)' }}
          >
            <Navigation className="h-3.5 w-3.5" />
            <span>Перейти в статье</span>
          </button>

          <button
            type="button"
            disabled={!nextEntry}
            onClick={() => nextEntry && onSelectEntry(nextEntry)}
            className="font-ui inline-flex cursor-pointer items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-medium transition-opacity disabled:cursor-not-allowed disabled:opacity-35"
            style={{
              borderColor: 'var(--gb-border-strong)',
              backgroundColor: 'var(--gb-surface)',
              color: 'var(--gb-ink)',
            }}
          >
            <span className="max-w-[120px] truncate">{nextEntry ? nextEntry.transliteration : 'Конец'}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
