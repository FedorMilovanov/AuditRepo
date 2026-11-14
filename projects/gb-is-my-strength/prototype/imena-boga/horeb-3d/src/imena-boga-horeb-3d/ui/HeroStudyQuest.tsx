import { useState } from 'react';
import { EXHIBITS } from '../data/exhibits';
import { FIELD_STUDIES } from '../data/fieldStudies';
import { SITE_CLUES, type SiteClueId } from '../data/siteClues';
import { HERO_STUDIES, heroStudyReady, canCompleteHeroStudy, type HeroStudyId } from '../data/heroStudies';

// One optional, actual 3D-evidence-dependent step, not another generic modal
// or a doctrinal score. The same source question remains readable in HTML.
export function HeroStudyQuest({ id, observed, completed, onComplete }: {
  id: HeroStudyId;
  observed: readonly SiteClueId[];
  completed: boolean;
  onComplete: (id: HeroStudyId, first: boolean, second: boolean, answer: string) => void;
}) {
  const [openedFirst, setOpenedFirst] = useState(false);
  const [openedSecond, setOpenedSecond] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [attempt, setAttempt] = useState<'accepted' | 'retry' | null>(null);
  const study = HERO_STUDIES.find((x) => x.id === id);
  const sourceTask = FIELD_STUDIES.find((x) => x.id === id);
  const exhibit = EXHIBITS.find((x) => x.id === id);
  if (!study || !sourceTask || !sourceTask.answerOptions || !exhibit) return null;
  const ready = heroStudyReady(id, observed);
  const submit = () => {
    if (!ready || !openedFirst || !openedSecond || !answer) return;
    if (!canCompleteHeroStudy(id, observed, openedFirst, openedSecond, answer)) {
      setAttempt('retry');
      return;
    }
    setAttempt('accepted');
    onComplete(id, openedFirst, openedSecond, answer);
  };
  return <section data-hero-study={id} aria-label={'Пространственное исследование: ' + study.title}
    className="rounded-sm border border-bronze/30 bg-black/30 p-4">
    <p className="text-xs uppercase tracking-[0.12em] text-bronze">Смысловой маршрут · учебный черновик</p>
    <h4 className="font-display text-lg text-parch mt-2">{study.title}</h4>
    <p className="mt-2 text-sm leading-relaxed text-parch/80">{study.intro}</p>
    <ol className="mt-3 space-y-2 text-sm text-parch/80">
      {study.evidence.map((clue) => <li key={clue} className="border-l-2 border-bronze/25 pl-3">
        {observed.includes(clue) ? 'Осмотрено: ' : 'Найдите взглядом в 3D: '}
        {SITE_CLUES[clue].label}
      </li>)}
    </ol>
    {!ready && <p data-hero-feedback="locked" className="text-xs text-muted mt-2">
      Смысловое сопоставление доступно после осмотра обеих деталей в настоящей 3D-сцене.
      Полное досье можно читать без выполнения маршрута.
    </p>}
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <div className="rounded-sm border border-bronze/20 p-3">
        <button type="button" data-hero-lens="a" aria-expanded={openedFirst}
          aria-controls={'hero-first-' + id} className="btn w-full text-left"
          onClick={() => setOpenedFirst(v => !v)}>Первое текстовое свидетельство</button>
        <div id={'hero-first-' + id} hidden={!openedFirst}
          className="mt-3 text-sm text-parch/85">
          <p>{sourceTask.lensA}</p>
          <p className="mt-2 text-muted">{sourceTask.kind === 'voices' ? exhibit.speaker : exhibit.verseReference}</p>
        </div>
      </div>
      <div className="rounded-sm border border-bronze/20 p-3">
        <button type="button" data-hero-lens="b" aria-expanded={openedSecond}
          aria-controls={'hero-second-' + id} className="btn w-full text-left"
          onClick={() => setOpenedSecond(v => !v)}>Второе текстовое свидетельство</button>
        <div id={'hero-second-' + id} hidden={!openedSecond}
          className="mt-3 text-sm text-parch/85">
          <p>{sourceTask.lensB}</p>
          <p className="mt-2 text-muted">{sourceTask.kind === 'voices' ? exhibit.referent : exhibit.interpretiveNotes}</p>
        </div>
      </div>
    </div>
    <fieldset disabled={!ready || !openedFirst || !openedSecond} className="mt-4">
      <legend className="font-display text-base text-bronze">{sourceTask.prompt}</legend>
      <div className="mt-3 space-y-2">
        {sourceTask.answerOptions.map((option) => <label key={option.id}
          className="flex items-start gap-3 rounded-sm border border-white/15 p-3 text-sm text-parch/90 cursor-pointer">
          <input type="radio" name={'hero-choice-' + id} value={option.id}
            checked={answer === option.id}
            onChange={() => { setAnswer(option.id); setAttempt(null); }}
            className="mt-1 accent-amber-600" />
          <span>{option.label}</span>
        </label>)}
      </div>
    </fieldset>
    <div className="mt-4 flex flex-wrap gap-3 items-center">
      <button data-hero-submit={id} type="button" className="btn"
        disabled={!ready || !openedFirst || !openedSecond || !answer} onClick={submit}>
        {completed ? 'Повторно проверить контекст' : 'Сохранить сопоставление'}
      </button>
      <a className="link text-sm" href={exhibit.verseUrl} target="_blank" rel="noopener noreferrer">
        {study.source} · источник
      </a>
    </div>
    {attempt === 'retry' && <p data-hero-feedback="retry" role="status"
      className="mt-3 text-sm text-amber-200">
      Такое сопоставление не подтверждается указанными библейскими текстами.
      Проверьте говорящих и референтов. Штрафов и запретов нет.
      {completed && ' Предыдущая верная запись сохраняется.'}
    </p>}
    {(completed || attempt === 'accepted') && attempt !== 'retry' &&
      <p data-hero-feedback="accepted" role="status" className="mt-3 border-l-2 border-bronze/50 pl-3 text-sm text-parch/90">
        {sourceTask.takeaway} Запись учебная: это не независимое текстологическое
        одобрение или обязательное условие приближения к Хориву.
      </p>}
  </section>;
}
