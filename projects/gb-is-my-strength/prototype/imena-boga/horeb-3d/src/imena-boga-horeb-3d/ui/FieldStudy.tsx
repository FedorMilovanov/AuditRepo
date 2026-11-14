import { useState } from 'react';
import type { Exhibit } from '../data/exhibits';
import { FIELD_STUDIES, NAMED_OBJECT_CHOICES, WRITTEN_LANGUAGE_CHOICES, canCompleteFieldStudy } from '../data/fieldStudies';

// Draft learning exercise, never a substitute for the linked Scripture or
// an authorization to publish the ongoing Research investigations.
export function FieldStudy({ e, completed, onComplete }: {
  e: Exhibit; completed: boolean;
  onComplete: (id: string, a: boolean, b: boolean, selection: string | null) => void;
}) {
  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [selection, setSelection] = useState<string | null>(null);
  const [retry, setRetry] = useState(false);
  const task = FIELD_STUDIES.find((t) => t.id === e.id);
  if (!task) return null;
  const isObject = task.kind === 'named-object';
  const isScript = task.kind === 'written-form';
  // All four modes require an actual evidence decision, not simply two clicks.
  const needsChoice = true;
  const kindTitle = task.kind === 'voices' ? 'Кто говорит и кто назван' :
    isObject ? 'Что получает название' :
      task.kind === 'parallel-witness' ? 'Два библейских контекста' :
        'Исходная письменная форма';
  const options = isObject ? NAMED_OBJECT_CHOICES : isScript ? WRITTEN_LANGUAGE_CHOICES : task.answerOptions ?? [];
  const leftTitle = task.kind === 'voices' ? 'Кто говорит' : isObject ? 'Событие' :
    task.kind === 'parallel-witness' ? 'Первый контекст' : 'Письменный оригинал';
  const rightTitle = task.kind === 'voices' ? 'Кто именуется' : isObject ? 'Что получает название' :
    task.kind === 'parallel-witness' ? 'Второй контекст' : 'Статус чтения';
  const firstEvidence = task.kind === 'voices' ? e.speaker :
    isObject ? e.meaningfulAction : task.kind === 'parallel-witness' ? e.verseReference :
      e.originalUnicode + ' · ' + e.transliteration;
  const secondEvidence = task.kind === 'voices' ? e.referent :
    isObject ? e.namedObject + ' · ' + e.verseReference :
      task.kind === 'parallel-witness' ? e.interpretiveNotes : e.textualVariantNotes;
  const submit = () => {
    if (!a || !b) return;
    const correct = canCompleteFieldStudy(e.id, a, b, selection);
    setRetry(!correct);
    if (correct) onComplete(e.id, a, b, selection);
  };
  return <section data-field-study={e.id} aria-label={'Полевое исследование: ' + e.displayLabelRu}
    className="mb-6 rounded-sm border border-bronze/40 bg-black/30 p-4 sm:p-5">
    <p className="eyebrow text-bronze">Полевое исследование · {kindTitle} · учебный черновик</p>
    <h3 className="mt-2 font-display text-xl text-parch">{task.prompt}</h3>
    <p className="mt-2 text-sm text-muted">Откройте оба свидетельства. Данные относятся к рабочему реестру; исходный библейский текст проверьте отдельно.</p>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
      <div className="rounded-sm border border-bronze/20 p-3">
        <button type="button" className="btn w-full text-left" data-field-lens="a" aria-expanded={a}
          aria-controls={'study-a-' + e.id} onClick={() => setA(v => !v)}>{leftTitle}</button>
        <div id={'study-a-' + e.id} hidden={!a} className="mt-3 text-sm text-parch/85">
          <p>{task.lensA}</p><p className="mt-2 text-muted">{firstEvidence}</p>
        </div>
      </div>
      <div className="rounded-sm border border-bronze/20 p-3">
        <button type="button" className="btn w-full text-left" data-field-lens="b" aria-expanded={b}
          aria-controls={'study-b-' + e.id} onClick={() => setB(v => !v)}>{rightTitle}</button>
        <div id={'study-b-' + e.id} hidden={!b} className="mt-3 text-sm text-parch/85">
          <p>{task.lensB}</p><p className="mt-2 text-muted">{secondEvidence}</p>
        </div>
      </div>
    </div>
    {needsChoice && <fieldset className="mt-4" disabled={!a || !b}>
      <legend className="font-display text-lg text-bronze">{isObject ? 'Что именно названо?' :
        isScript ? 'Какой язык у исходной записи?' : 'Какой вывод подтверждают оба свидетельства?'}</legend>
      <div className={'mt-3 grid gap-2 ' + (isObject || isScript ? 'sm:grid-cols-2' : '')}>
        {options.map((choice) => <label key={choice.id} className="flex gap-2 p-2.5 border border-white/15 rounded-sm text-sm cursor-pointer">
          <input type="radio" name={'study-choice-' + e.id} value={choice.id}
            checked={selection === choice.id} className="mt-1 accent-amber-600"
            onChange={() => { setSelection(choice.id); setRetry(false); }} />
          {choice.label}
        </label>)}
      </div>
    </fieldset>}
    <div className="mt-4 flex flex-wrap items-center gap-3">
      <button type="button" className="btn" data-field-submit
        disabled={!a || !b || (needsChoice && !selection)}
        onClick={submit}>{completed ? 'Повторить исследование' : 'Записать сопоставление'}</button>
      <a className="link text-sm" href={e.verseUrl} target="_blank" rel="noopener noreferrer">Библейский источник: {e.verseReference}</a>
    </div>
    {retry && <p data-study-feedback="retry" role="status" className="mt-3 text-sm text-amber-200">
      Выбранный вывод не подтверждается двумя контекстами рабочего реестра. Проверьте ссылки на Писание и попробуйте снова, без штрафов.
      {completed && ' Ранее сохранённое правильное сопоставление остаётся в дневнике.'}
    </p>}
    {completed && !retry && <div data-study-feedback="accepted" role="status" className="mt-4 border-l-2 border-bronze/50 pl-3 text-sm text-parch/90">
      <p>{task.takeaway}</p>
      <p className="mt-2 text-xs text-muted">Сохранено в локальном учебном дневнике, не является филологическим или богословским утверждением к публикации.</p>
    </div>}
  </section>;
}
