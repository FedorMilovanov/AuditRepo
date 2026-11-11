import { useState } from 'react';
import { SITE_CLUES, type SiteClueId } from '../data/siteClues';
import {
  EXPEDITION_EVIDENCE, EXPEDITION_CHRONOLOGY, EXPEDITION_CONTRAST,
  expeditionReady, canCompleteExpedition,
} from '../data/expedition';

// The clue observations are validated by World through genuine sight rays
// and action F. Reading the 42 dossiers never depends on solving this quest.
export function ExpeditionQuest({ observed, completed, onComplete }: {
  observed: readonly SiteClueId[];
  completed: boolean;
  onComplete: (chronology: string, contrast: string) => void;
}) {
  const [chronology, setChronology] = useState<string | null>(null);
  const [contrast, setContrast] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<'accepted' | 'retry' | null>(null);
  const ready = expeditionReady(observed);
  const correct = completed || attempt === 'accepted';
  const submit = () => {
    if (!ready || !chronology || !contrast) return;
    if (canCompleteExpedition(observed, chronology, contrast)) {
      setAttempt('accepted');
      onComplete(chronology, contrast);
    } else setAttempt('retry');
  };
  return <section data-expedition-quest="beersheba-hagar"
    aria-label="Связанная экспедиция: Вирсавия и Агарь"
    className="rounded-sm border border-bronze/40 bg-black/35 p-4 sm:p-5">
    <p className="eyebrow text-bronze">Экспедиция по свидетельствам · учебный черновик</p>
    <h3 className="font-display text-xl text-parch mt-2">Два источника — два повествования</h3>
    <p className="text-sm text-parch/80 mt-2">
      Исследуйте три разные детали настоящей 3D-сцены. Их можно находить в любой
      последовательности. Затем сравните Быт. 16:13–14 и Быт. 21:25–33:
      порядок событий — не порядок ваших прогулок.
    </p>
    <ol className="mt-3 space-y-2 text-sm text-parch/85">
      {EXPEDITION_EVIDENCE.map((id) => <li key={id}
        className="border-l-2 border-bronze/30 pl-3">
        <span>{observed.includes(id) ? 'Найдено: ' : 'Не найдено в 3D: '}{SITE_CLUES[id].label}</span>
        <span className="text-muted"> · {SITE_CLUES[id].reference}</span>
      </li>)}
    </ol>
    {!ready && <p data-expedition-feedback="locked" className="mt-3 text-xs text-parch/70">
      Для итоговой проверки найдите все три объекта взглядом и нажмите F рядом с
      каждым. Досье и источники доступны без прохождения этого задания.
    </p>}
    <fieldset disabled={!ready} className="mt-4 space-y-3">
      <legend className="font-display text-base text-bronze">1. Восстановите последовательность текста</legend>
      {EXPEDITION_CHRONOLOGY.map((option) => <label key={option.id}
        className="flex gap-3 rounded-sm border border-white/15 px-3 py-2 text-sm cursor-pointer">
        <input type="radio" name="beersheba-hagar-chronology" value={option.id}
          checked={chronology === option.id}
          onChange={() => { setChronology(option.id); setAttempt(null); }}
          className="mt-1 accent-amber-600" />
        <span>{option.label}</span>
      </label>)}
    </fieldset>
    <fieldset disabled={!ready} className="mt-4 space-y-3">
      <legend className="font-display text-base text-bronze">2. Различите свидетельства</legend>
      {EXPEDITION_CONTRAST.map((option) => <label key={option.id}
        className="flex gap-3 rounded-sm border border-white/15 px-3 py-2 text-sm cursor-pointer">
        <input type="radio" name="beersheba-hagar-contrast" value={option.id}
          checked={contrast === option.id}
          onChange={() => { setContrast(option.id); setAttempt(null); }}
          className="mt-1 accent-amber-600" />
        <span>{option.label}</span>
      </label>)}
    </fieldset>
    <button type="button" data-expedition-submit className="btn mt-4"
      disabled={!ready || !chronology || !contrast} onClick={submit}>
      {completed ? 'Перепроверить вывод' : 'Записать итог расследования'}
    </button>
    {attempt === 'retry' && <p data-expedition-feedback="retry" role="status"
      className="mt-3 text-sm text-amber-200">
      Этот вывод не подтверждается обоими рассказами. Сверьте главы 16 и 21;
      {completed && ' ранее записанный правильный результат остаётся в дневнике.'}
      {!completed && ' штрафов и ограничений нет.'}
    </p>}
    {correct && attempt !== 'retry' && <p data-expedition-feedback="accepted"
      role="status" className="mt-3 border-l-2 border-bronze/50 pl-3 text-sm text-parch/90">
      Два свидетельства сопоставлены. Колодец и тамариск относятся к
      повествованию Быт. 21; источник Агари — к Быт. 16.
      Это учебный результат, не редакционное разрешение к публикации.
    </p>}
  </section>;
}
