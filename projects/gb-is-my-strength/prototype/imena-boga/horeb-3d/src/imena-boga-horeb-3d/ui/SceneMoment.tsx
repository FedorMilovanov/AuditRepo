import { useState } from 'react';
import type { Exhibit } from '../data/exhibits';
import { RUSSIAN_DRAFT_CUES } from '../data/russianCues';

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

export function SceneMoment({ e, examined, canInspect, onInspect }: {
  e: Exhibit; examined: boolean; canInspect: boolean; onInspect: () => void;
}) {
  const [showMeaning, setShowMeaning] = useState(false);
  const moment = HERO_MOMENTS[e.id];
  if (!moment) return null;
  return (
    <section className="rounded-sm border border-bronze/40 bg-black/35 p-4 sm:p-5 mb-6" aria-label="Исследование сцены">
      <p className="eyebrow text-bronze">Живая экспозиция · художественная реконструкция</p>
      <p className="font-display text-xl sm:text-2xl text-parch mt-2">{moment.object}</p>
      <p className="text-sm text-parch/75 mt-3">Действие: {e.meaningfulAction}</p>
      <div className="flex flex-wrap gap-2 mt-4">
        <button className="btn" disabled={!canInspect} onClick={onInspect}>
          {examined ? 'Осмотреть ещё раз в 3D' : 'Осмотреть место в 3D'}
        </button>
        <button className="btn" onClick={() => setShowMeaning((open) => !open)}
          aria-expanded={showMeaning}>
          {showMeaning ? 'Скрыть сопоставление' : 'Сопоставить с Писанием'}
        </button>
      </div>
      {!canInspect && <p className="text-sm text-parch/70 mt-3">
        Физический осмотр доступен только рядом со стелой. Сохранённое свидетельство можно читать и сравнивать из любой зоны.
      </p>}
      {examined && <p className="text-sm text-bronze mt-3" role="status">Место осмотрено. Вы можете исследовать свидетельство и сравнить контексты.</p>}
      {showMeaning && <div className="mt-4 border-l-2 border-bronze/50 pl-3 text-sm text-parch/85 space-y-2">
        <p>{moment.observation}</p>
        <p>{moment.comparison}</p>
        <a className="link" href={e.verseUrl} target="_blank" rel="noopener noreferrer">Открыть источник: {e.verseReference}</a>
      </div>}
      <details className="mt-4 text-sm text-parch/75">
        <summary className="cursor-pointer text-bronze">Реплика будущего диктора · текстовый черновик</summary>
        <p className="mt-2 leading-relaxed">{RUSSIAN_DRAFT_CUES[e.id]}</p>
        <p className="text-xs text-muted mt-2">Это ещё не аудиозапись. Человеческий голос, права и произношение проходят отдельную приёмку.</p>
      </details>
    </section>
  );
}
