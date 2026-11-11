import { useState } from 'react';
import type { Exhibit } from '../data/exhibits';
import { RUSSIAN_DRAFT_CUES } from '../data/russianCues';
import { PILOT_LESSONS, type LearningChoice } from '../data/learningJourney';
import { SITE_CLUES, SITE_CLUE_IDS, type SiteClueId } from '../data/siteClues';

// These are original museum-guide paraphrases, NOT quotes from Scripture,
// not voiced divine speech, and not approved recorded audio.
export const HERO_MOMENTS: Record<string, { object: string; observation: string; comparison: string }> = {
  'elohim': {
    object: 'Горизонт за каменным проёмом',
    observation: 'Ландшафт — условный образ начала повествования, а не фотография сотворения мира.',
    comparison: 'В Быт. 1:1 обозначение Элохим согласуется с глаголом в единственном числе. Одна грамматическая форма не доказывает учение о Троице.',
  },
  'el-elyon': {
    object: 'Хлеб и вино на скромном привале',
    observation: 'Сначала звучит благословение Мелхиседека, затем ответ Аврама. Это два разных голоса рассказа.',
    comparison: 'В Быт. 14:22 Аврам связывает наименование Эль Элион с ЯХВЕ. Варианты древних свидетельств требуют отдельной проверки.',
  },
  'el-shaddai': {
    object: 'Патриархальный шатёр и сосуд',
    observation: 'Три окна Писания относятся к Аврааму, благословению Исаака и Иакову; говорящих нельзя смешивать.',
    comparison: 'Всемогущий — традиционный перевод. Первоначальная этимология выражения Шаддай остаётся дискуссионной.',
  },
  'el-olam': {
    object: 'Колодец Вирсавии и тамариск',
    observation: 'У колодца и дерева разные роли. Тамариск упоминается в Быт. 21:33.',
    comparison: 'Не путайте место повествования об Аврааме с источником, возле которого Агарь говорит о Боге в Быт. 16.',
  },
  'el-roi': {
    object: 'Источник воды в пустыне',
    observation: 'Здесь важны слова Агари и отдельно — название источника в следующем стихе.',
    comparison: 'Корень видеть (ראה) не совпадает с корнем пасти (רעה). Трудные чтения Быт. 16:13 остаются на исследовательской проверке.',
  },
  'yireh': {
    object: 'Горный склон, заросли и овен',
    observation: 'Сцена показывает место и предметы повествования; человеческое жертвоприношение не изображается.',
    comparison: 'В Быт. 22:14 названием обозначено место; это не новое собственное имя Бога.',
  },
  'ehyeh': {
    object: 'Внешняя граница у несгорающего куста',
    observation: 'Сначала изучите Исх. 3:5 и действие снятия обуви. Даже босиком подходить вплотную к кусту нельзя.',
    comparison: 'Исх. 3:14 содержит самоназвание אֶהְיֶה אֲשֶׁר אֶהְיֶה; это не тождественный текст форме из 3:15.',
  },
  'yhwh': {
    object: 'Место наблюдения у несгорающего куста',
    observation: 'Записанное четырьмя еврейскими буквами Имя представлено как текст свидетельства, а не светящаяся фигура Бога.',
    comparison: 'Исх. 3:15 отличается от самоназвания в 3:14. Реконструированное произношение не навязывается.',
  },
};

// Optional story: inspect, compare Scripture, answer one context question.
// Never gate 3D movement, free source reading or the sacred barefoot boundary.
export function SceneMoment({ e, examined, canInspect, onInspect,
  understood = false, onUnderstood, textMode = false, siteClues = [] }: {
  e: Exhibit; examined: boolean; canInspect: boolean; onInspect: () => void;
  understood?: boolean; onUnderstood?: (choice: LearningChoice) => void;
  textMode?: boolean; siteClues?: readonly SiteClueId[];
}) {
  const [showMeaning, setShowMeaning] = useState(false);
  const [selected, setSelected] = useState<LearningChoice | null>(null);
  const [attempt, setAttempt] = useState<'right' | 'retry' | null>(null);
  const moment = HERO_MOMENTS[e.id];
  const lesson = PILOT_LESSONS.find((entry) => entry.id === e.id);
  const physicalClues = SITE_CLUE_IDS.filter((id) => SITE_CLUES[id].exhibitId === e.id);
  if (!moment) return null;
  const answered = understood || attempt === 'right';
  const submit = () => {
    if (!lesson || !selected || !examined || !showMeaning) return;
    if (selected === lesson.answer) {
      setAttempt('right');
      onUnderstood?.(selected);
    } else setAttempt('retry');
  };
  return (
    <section className="rounded-sm border border-bronze/40 bg-black/35 p-4 sm:p-5 mb-6" aria-label={'Путь понимания: ' + e.displayLabelRu}>
      <p className="eyebrow text-bronze">Экспедиция смыслов · художественная реконструкция</p>
      <p className="font-display text-xl sm:text-2xl text-parch mt-2">{moment.object}</p>
      <p className="text-sm text-parch/75 mt-3">Задача: {lesson?.mission ?? e.meaningfulAction}</p>
      {physicalClues.length > 0 && !textMode && <div className="mt-4 rounded-sm border border-bronze/20 bg-black/35 p-3 text-sm">
        <p className="text-bronze">Необязательная 3D-экспедиция: {physicalClues.filter((id) => siteClues.includes(id)).length} из {physicalClues.length} наблюдений</p>
        <p className="text-xs text-parch/70 mt-1">Отыщите детали в сцене, наведите взгляд и нажмите F (или кнопку на экране). Вопрос по Писанию доступен независимо от этого.</p>
        <ul className="mt-2 space-y-2">
          {physicalClues.map((id) => <li key={id}>
            {siteClues.includes(id) ? 'Изучено: ' : 'Найдите: '}{SITE_CLUES[id].label}
            {siteClues.includes(id) && <p className="text-xs text-muted mt-1">{SITE_CLUES[id].finding}</p>}
          </li>)}
        </ul>
      </div>}
      <ol className="list-decimal pl-5 text-sm text-parch/75 mt-4 space-y-1">
        <li>{examined ? 'Наблюдение выполнено' : textMode ? 'Изучить описание сцены' : 'Осмотреть сцену вблизи в 3D'}</li>
        <li>{showMeaning ? 'Контекст открыт' : 'Различить свидетельства в тексте'}</li>
        <li>{answered ? 'Смысловое различие усвоено в этой задаче' : 'Ответить на вопрос о тексте'}</li>
      </ol>
      <div className="flex flex-wrap gap-2 mt-4">
        <button className="btn" disabled={!canInspect} onClick={onInspect}>
          {textMode ? (examined ? 'Ещё раз изучить сцену' : 'Изучить описание сцены') :
            examined ? 'Осмотреть ещё раз в 3D' : 'Осмотреть место в 3D'}
        </button>
        <button className="btn" onClick={() => setShowMeaning((open) => !open)}
          aria-expanded={showMeaning} aria-controls={'compare-' + e.id}>
          {showMeaning ? 'Скрыть сопоставление' : 'Сопоставить с Писанием'}
        </button>
      </div>
      {!canInspect && !textMode && <p className="text-sm text-parch/70 mt-3">
        Физический осмотр доступен только рядом со стелой. Сохранённое свидетельство можно читать и сравнивать из любой зоны.
      </p>}
      {examined && <p className="text-sm text-bronze mt-3" role="status">Место осмотрено. Вы можете исследовать свидетельство и сравнить контексты.</p>}
      {showMeaning && <div id={'compare-' + e.id} className="mt-4 border-l-2 border-bronze/50 pl-3 text-sm text-parch/85 space-y-2">
        <p>{moment.observation}</p>
        <p>{moment.comparison}</p>
        <a className="link" href={e.verseUrl} target="_blank" rel="noopener noreferrer">Открыть источник: {e.verseReference}</a>
      </div>}
      {lesson && <fieldset className="mt-5 border-t border-bronze/20 pt-4" disabled={!examined || !showMeaning}>
        <legend className="text-bronze font-display text-lg pt-3">Вопрос по источнику · {lesson.sourceReference}</legend>
        <p className="text-sm leading-relaxed text-parch/90 mb-3">{lesson.question}</p>
        <div className="space-y-2">
          {lesson.options.map((choice) => (
            <label key={choice.id} className="flex items-start gap-3 rounded-sm border border-white/10 px-3 py-2 cursor-pointer hover:border-bronze/50">
              <input type="radio" name={'learning-' + lesson.id} value={choice.id}
                checked={selected === choice.id}
                onChange={() => { setSelected(choice.id); setAttempt(null); }}
                className="mt-1 accent-amber-600" />
              <span className="text-sm text-parch/90 leading-relaxed">{choice.text}</span>
            </label>
          ))}
        </div>
        <button className="btn mt-3" disabled={!selected} onClick={submit} type="button">
          {answered ? 'Проверить ещё раз' : 'Проверить понимание'}
        </button>
        {!examined && <p className="mt-2 text-xs text-muted">Сперва осмотрите сюжет или изучите его описание в доступном режиме.</p>}
        {examined && !showMeaning && <p className="mt-2 text-xs text-muted">Прежде чем выбирать, откройте сравнение библейских контекстов.</p>}
      </fieldset>}
      {attempt === 'retry' && <p data-learning-feedback="retry" role="status" className="mt-3 text-sm text-amber-200">
        Это не соответствует приведённому контексту. Сравните формулировки и попробуйте снова, без штрафов.
        {understood && ' Ранее подтверждённый ответ остаётся в дневнике.'}
      </p>}
      {answered && attempt !== 'retry' && lesson && <div data-learning-feedback="accepted" className="mt-3 rounded-sm border border-bronze/30 p-3" role="status">
        <p className="text-sm text-parch/90">{lesson.explanation}</p>
        <p className="text-xs text-bronze mt-2">Исследование отмечено в вашем локальном путевом дневнике, не как богословское или редакционное утверждение.</p>
        <details className="mt-3 text-sm text-parch/75">
          <summary className="cursor-pointer text-bronze">Величественный закадровый рассказчик · текст сценария</summary>
          <p className="mt-2">{lesson.narratorBeat}</p>
          <p className="text-xs mt-2 text-muted">Голос ещё не записан и не утверждён. Иностранные слова автоматически не озвучиваются.</p>
        </details>
      </div>}
      <details className="mt-4 text-sm text-parch/75">
        <summary className="cursor-pointer text-bronze">Реплика будущего диктора · предварительный текст</summary>
        <p className="mt-2 leading-relaxed">{RUSSIAN_DRAFT_CUES[e.id]}</p>
        <p className="text-xs text-muted mt-2">Это не аудиозапись. Человеческий голос, права и произношение проходят отдельную приёмку.</p>
      </details>
    </section>
  );
}
