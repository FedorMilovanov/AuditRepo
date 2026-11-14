// Eight optional evidence-based micro-expeditions, not "spiritual experience" scores.
// Canonical HOREB exhibit IDs and references; never auto-approve Research/voice.
// The challenges test distinctions directly supported by the linked source context.
// Visiting or understanding a lesson never unlocks forbidden physical territory.
export type LearningChoice = 'a' | 'b' | 'c';
export type LearningLesson = {
  id: string; title: string; question: string;
  options: readonly { id: LearningChoice; text: string }[];
  answer: LearningChoice; explanation: string;
  mission: string; narratorBeat: string; sourceReference: string;
};
export const PILOT_LESSONS: readonly LearningLesson[] = Object.freeze([
  {
    id: 'elohim', title: 'Первое свидетельство', sourceReference: 'Быт. 1:1',
    mission: 'Посмотрите на горизонт и выясните, что утверждает сам стих.',
    question: 'Что можно обоснованно утверждать по Быт. 1:1?',
    options: [
      { id: 'a', text: 'Окончание слова само доказывает учение о Троице.' },
      { id: 'b', text: 'Повествование приписывает сотворение неба и земли Богу.' },
      { id: 'c', text: 'Стих описывает видимую внешность Бога.' },
    ], answer: 'b',
    explanation: 'Быт. 1:1 говорит о Боге как Творце. Вывод о Троице нельзя доказывать одним множественным окончанием.',
    narratorBeat: 'Перед нами — начало повествования. Сначала прочитайте свидетельство, а уже затем делайте вывод.',
  },
  {
    id: 'el-elyon', title: 'Благословение и ответ', sourceReference: 'Быт. 14:18–22',
    mission: 'Различите благословение Мелхиседека и ответ Аврама.',
    question: 'Кто благословляет, а кто отвечает в Быт. 14?',
    options: [
      { id: 'a', text: 'Аврам благословляет, а Мелхиседек отвечает.' },
      { id: 'b', text: 'Всё говорит один и тот же человек.' },
      { id: 'c', text: 'Мелхиседек благословляет, а Аврам отвечает.' },
    ], answer: 'c',
    explanation: 'В повествовании различаются речь Мелхиседека и ответ Аврама; текстовые варианты Быт. 14:22 исследуются отдельно.',
    narratorBeat: 'Два голоса древнего рассказа. Не смешивайте благословение и ответ.',
  },
  {
    id: 'el-shaddai', title: 'Перевод и происхождение', sourceReference: 'Быт. 17:1; 28:3; 35:11',
    mission: 'Сопоставьте три разных патриархальных контекста.',
    question: 'Как обращаться с выражением «Эль Шаддай» в исследовании?',
    options: [
      { id: 'a', text: '«Всемогущий» — традиционный перевод, но этимология Шаддай обсуждается.' },
      { id: 'b', text: 'Происхождение Шаддай окончательно доказано современным переводом.' },
      { id: 'c', text: 'В Быт. 17, 28 и 35 всегда один и тот же говорящий.' },
    ], answer: 'a',
    explanation: 'Традиционная передача значения не равна доказательству этимологии; говорящих и литературные контексты следует различать.',
    narratorBeat: 'Древнее выражение проходит через судьбы патриархов. Не объявляйте спорное установленным.',
  },
  {
    id: 'el-olam', title: 'Колодец и тамариск', sourceReference: 'Быт. 21:25–33',
    mission: 'Обследуйте место и найдите отличие от истории Агари.',
    question: 'Что действительно упоминает Быт. 21:33?',
    options: [
      { id: 'a', text: 'Агарь нарекает имя источнику в Вирсавии.' },
      { id: 'b', text: 'Авраам сажает тамариск в Вирсавии и призывает Господа.' },
      { id: 'c', text: 'На этом месте был построен позднейший храм.' },
    ], answer: 'b',
    explanation: 'В Быт. 21 говорится о Вирсавии и посаженном Авраамом дереве. Рассказ об Агари и источнике находится в Быт. 16.',
    narratorBeat: 'Одно дерево, один колодец и память о событии. У каждого повествования — своё место.',
  },
  {
    id: 'el-roi', title: 'Слова Агари', sourceReference: 'Быт. 16:13–14',
    mission: 'Найдите воду и отделите слова Агари от названия источника.',
    question: 'Какой смысловой контраст принципиален в этой истории?',
    options: [
      { id: 'a', text: 'Корень «видеть» и корень «пасти» всегда тождественны.' },
      { id: 'b', text: 'Название источника — ещё одно личное имя Бога.' },
      { id: 'c', text: 'Слова Агари и название источника — разные части рассказа; чтение стиха 13 обсуждается.' },
    ], answer: 'c',
    explanation: 'В Быт. 16:13 и 16:14 разные референты. Еврейские корни ראה («видеть») и רעה («пасти») нельзя смешивать.',
    narratorBeat: 'У воды в пустыне звучит свидетельство Агари. Не путайте её слова с названием места.',
  },
  {
    id: 'yireh', title: 'Название на горе', sourceReference: 'Быт. 22:14',
    mission: 'Обратите внимание, чему именно даётся название.',
    question: 'Кому или чему в Быт. 22:14 Авраам даёт название?',
    options: [
      { id: 'a', text: 'Месту, а не новому самостоятельному личному имени Бога.' },
      { id: 'b', text: 'Овну как имени Божества.' },
      { id: 'c', text: 'Новому человеческому персонажу.' },
    ], answer: 'a',
    explanation: 'Текст говорит о названии места. Не превращайте место повествования в самостоятельный теоним.',
    narratorBeat: 'Здесь важно не найти предмет, а точно услышать, что названо в стихе.',
  },
  {
    id: 'ehyeh', title: 'Два стиха у Хорива', sourceReference: 'Исх. 3:14–15',
    mission: 'Внешнюю границу разрешено пересекать только после снятия обуви; внутреннюю — никогда.',
    question: 'Как сравнить самоназвание в Исх. 3:14 с формой в 3:15?',
    options: [
      { id: 'a', text: 'Оба стиха дословно содержат одно и то же еврейское слово.' },
      { id: 'b', text: 'Это связанные, но различающиеся формы и контексты соседних стихов.' },
      { id: 'c', text: 'Разница исчезает, если не читать исходный текст.' },
    ], answer: 'b',
    explanation: 'Исх. 3:14 и 3:15 требуют различать формы и их референты; не приписывайте одну и ту же вокализацию обоим стихам.',
    narratorBeat: 'У границы наблюдения следует замолчать и открыть два соседних стиха.',
  },
  {
    id: 'yhwh', title: 'Четыре буквы', sourceReference: 'Исх. 3:15',
    mission: 'Сопоставьте письменный знак с традициями чтения, не изобретая звучание.',
    question: 'Как безопаснее представить тетраграмматон в этой экспозиции?',
    options: [
      { id: 'a', text: 'Включить произвольную нейроозвучку предполагаемого древнего чтения.' },
      { id: 'b', text: 'Сделать Имя видимым волшебным существом.' },
      { id: 'c', text: 'Показать четыре буквы в письменном тексте, а чтение и традиции объяснять отдельно.' },
    ], answer: 'c',
    explanation: 'Письменное обозначение и реконструкция его произношения — разные вопросы. Произвольную вокализацию и «голос Бога» исключаем.',
    narratorBeat: 'В тексте сохранены четыре буквы. Не выдавайте историческую гипотезу за запись древнего голоса.',
  },
]);
export const PILOT_IDS: readonly string[] = Object.freeze(PILOT_LESSONS.map((p) => p.id));
const PILOT_SET = new Set(PILOT_IDS);
export const LEARNING_STORAGE_KEY = 'imena-horeb.learning.v1';
export interface LearningJournal { observed: string[]; understood: string[] }
export function normalizeLearningJournal(raw: unknown): LearningJournal {
  const data = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {};
  const canonical = (value: unknown) =>
    Array.isArray(value) ? PILOT_IDS.filter((id) => value.includes(id)) : [];
  const observed = canonical(data.observed);
  const understood = canonical(data.understood).filter((id) => observed.includes(id));
  return { observed, understood };
}
export function observeLesson(journal: LearningJournal, id: string): LearningJournal {
  if (!PILOT_SET.has(id)) return normalizeLearningJournal(journal);
  return normalizeLearningJournal({ observed: [...journal.observed, id], understood: journal.understood });
}
export function completeLesson(journal: LearningJournal, id: string, choice: string): LearningJournal {
  const lesson = PILOT_LESSONS.find((l) => l.id === id);
  if (!lesson || lesson.answer !== choice || !journal.observed.includes(id)) return normalizeLearningJournal(journal);
  return normalizeLearningJournal({ observed: journal.observed, understood: [...journal.understood, id] });
}
export const nextLearningLesson = (journal: LearningJournal): LearningLesson | undefined =>
  PILOT_LESSONS.find((lesson) => !journal.understood.includes(lesson.id));
