// Source-grounded contextual investigations beyond the eight pilot lessons.
// These ARE NOT approved exegesis or 42 "new names of God": content remains
// linked to the existing, explicitly HOLD Research-based exhibit registry.
import { EXHIBITS, type Category } from './exhibits.js';

export type FieldKind = 'voices' | 'named-object' | 'parallel-witness' | 'written-form';
export interface FieldStudy {
  id: string;
  kind: FieldKind;
  prompt: string;
  lensA: string;
  lensB: string;
  takeaway: string;
  // Authored evidence decision; never used to score spiritual progress.
  answerOptions?: readonly { id: 'a' | 'b' | 'c'; label: string }[];
  correctAnswer?: 'a' | 'b' | 'c';
}
// Four differentiated, carefully authored investigative modes, 16 initial
// studies. The other 18 non-pilot exhibits remain full, freely readable
// dossiers until unique tasks have been researched and approved.
export const FIELD_STUDIES: readonly FieldStudy[] = Object.freeze([
  // Voice and referent mapping: the speaker is NOT necessarily the one named.
  { id:'el', kind:'voices',
    prompt:'Один термин не всегда указывает на одного референта. Кто говорит в каждом контексте?',
    lensA:'Установите, где повествователь сообщает событие, а где звучит прямая речь.',
    lensB:'Сопоставьте обозначение «Бог» с его референтом и с отрицательными контекстами.',
    answerOptions: [
      { id: 'a', label: 'Всякое употребление Эль всегда новое собственное имя Бога.' },
      { id: 'b', label: 'Говорящий и референт устанавливаются в каждом стихе: одного слова недостаточно.' },
      { id: 'c', label: 'Употребление Эль не нуждается в проверке отрицательных контекстов.' },
    ],
    correctAnswer: 'b',
    takeaway:'Референт определяется стихом, а не только словом אֵל.' },
  { id:'abba', kind:'voices',
    prompt:'Как различается употребление «Авва» в молитве Иисуса и в посланиях?',
    lensA:'Прочитайте Мк. 14:36, затем Рим. 8:15 и Гал. 4:6. Не смешивайте говорящих.',
    lensB:'Отделите обращение к Отцу от предположений о бытовом оттенке слова.',
    answerOptions: [
      { id: 'a', label: 'В Мк. 14:36 обращается Павел, а в Рим. 8:15 говорит только рассказчик.' },
      { id: 'b', label: 'В Мк. 14:36 к Отцу обращается Иисус, а Рим. 8:15 и Гал. 4:6 описывают обращение усыновлённых и действие Духа.' },
      { id: 'c', label: 'Во всех трёх стихах единственный говорящий — Марк.' },
    ],
    correctAnswer: 'b',
    takeaway:'Семитское обращение засвидетельствовано в греческом тексте; перевод «папочка» не следует объявлять точным без доказательств.' },
  { id:'ego-eimi', kind:'voices',
    prompt:'Одинаковая греческая форма в устах разных людей — всегда одно и то же утверждение?',
    lensA:'Сравните, кто говорит в Ин. 8:58 и 9:9. Исследуйте прямые слова и рассказчика.',
    lensB:'Не делайте одинаковый богословский вывод из одинакового сочетания без контекста.',
    answerOptions: [
      { id: 'a', label: 'В Ин. 8:58 и Ин. 9:9 выражение употребляет только Иисус.' },
      { id: 'b', label: 'В Ин. 8:58 говорит Иисус, а в Ин. 9:9 — исцелённый; форма требует учёта говорящего.' },
      { id: 'c', label: 'В обоих стихах форму употребляет только исцелённый.' },
    ],
    correctAnswer: 'b',
    takeaway:'В Ин. 9:9 говорящий — исцелённый, в других приведённых местах говорит Иисус. Контекст необходим.' },
  { id:'kyrios-ho-theos', kind:'voices',
    prompt:'В Лк. 1:32 кто произносит обещание, кто даёт и кому обещано?',
    lensA:'Выделите говорящего в повествовании о благовещении.',
    lensB:'Разведите грамматический субъект «Господь Бог» и того, кто получит престол.',
    answerOptions: [
      { id: 'a', label: 'В Лк. 1:32 Мария обещает Гавриилу престол.' },
      { id: 'b', label: 'В Лк. 1:32 Гавриил получает престол от Иисуса.' },
      { id: 'c', label: 'Гавриил сообщает обещание: Господь Бог даст престол Иисусу.' },
    ],
    correctAnswer: 'c',
    takeaway:'Гавриил говорит; «Господь Бог» — субъект обещания, Иисус — получатель. Это разные роли.' },
  // What receives a name? This is a precise literary referent distinction.
  { id:'el-bethel', kind:'named-object',
    prompt:'В повествовании об Иакове чему относится наименование в Вефиле?',
    lensA:'Рассмотрите сцену с алтарём, затем различите название места и обозначение Бога.',
    lensB:'Используйте исследовательскую категорию и объект в самом реестре.',
    takeaway:'Не всякий оборот с Эль классифицируется как новое личное имя Бога.' },
  { id:'nissi', kind:'named-object',
    prompt:'Что именно нарекает Моисей после событий Исх. 17?',
    lensA:'Отделите повествование о сражении от строительства и именования.',
    lensB:'Найдите грамматически именованный объект, а не угадывайте по переводу.',
    takeaway:'В Исх. 17:15 речь идёт об имени жертвенника; это не новое личное имя Бога.' },
  { id:'shalom', kind:'named-object',
    prompt:'Какой объект назван в Суд. 6:24 после встречи Гедеона?',
    lensA:'Различите библейское событие и материальный памятный объект.',
    lensB:'Проверьте, что именно называет Гедеон, прежде чем переносить выражение в список имён.',
    takeaway:'Именован жертвенник в Офре; нельзя терять указанный в тексте объект.' },
  { id:'shammah', kind:'named-object',
    prompt:'Кому дано название в финале видения Иезекииля?',
    lensA:'Рассмотрите модель города как художественный образ видения, не как археологическую карту.',
    lensB:'Уточните названный объект в Иез. 48:35.',
    takeaway:'Выражение связано с названием города видения, а не с новым самостоятельным личным именем.' },
  // Two contexts: same label can change referent or rhetorical force.
  { id:'tsur', kind:'parallel-witness',
    prompt:'Как образ «скалы» используется по-разному в Песни Моисея?',
    lensA:'Втор. 32:4: посмотрите на образ Скалы в отношении Бога Израиля.',
    lensB:'Втор. 32:31: сравните отрицательный контраст «скалы их» и не смешивайте референтов.',
    answerOptions: [
      { id: 'a', label: 'Во Втор. 32:4 и 32:31 слово «скала» относится к тому же самому референту.' },
      { id: 'b', label: 'Во Втор. 32:4 Скала относится к Богу Израиля, а в 32:31 «скала их» включена в контраст.' },
      { id: 'c', label: 'Во Втор. 32:31 речь исключительно о буквальной горе без поэтического сопоставления.' },
    ],
    correctAnswer: 'b',
    takeaway:'Поэтический образ Скалы требует различения говорящего и референта в каждом стихе.' },
  { id:'tsidkenu', kind:'parallel-witness',
    prompt:'Сопоставьте, кого касается выражение в Иер. 23:6 и Иер. 33:16.',
    lensA:'В Иер. 23:6 контекст относится к царской фигуре — Отрасли Давида.',
    lensB:'В Иер. 33:16 проверьте, что название относится к Иерусалиму.',
    answerOptions: [
      { id: 'a', label: 'Иер. 23:6 называет Иерусалим, а Иер. 33:16 — царя.' },
      { id: 'b', label: 'Оба стиха имеют референтом исключительно одного и того же царя.' },
      { id: 'c', label: 'Иер. 23:6 относится к царской фигуре, Иер. 33:16 — к Иерусалиму.' },
    ],
    correctAnswer: 'c',
    takeaway:'Одна формула используется с разными названными референтами; нельзя объединять их в один.' },
  { id:'qedosh-yisrael', kind:'parallel-witness',
    prompt:'Сопоставьте обличительный и утешительный контексты «Святого Израилева».',
    lensA:'В Ис. 1:4 обозначение находится внутри обличения Израиля.',
    lensB:'В Ис. 43:3 сопоставьте обращение к народу и исповедание Божьей святости.',
    answerOptions: [
      { id: 'a', label: 'Ис. 1:4 и Ис. 43:3 оба только утешают Израиль.' },
      { id: 'b', label: 'Ис. 1:4 содержит обличение, Ис. 43:3 — обращение и уверение; функцию определяет контекст.' },
      { id: 'c', label: 'Ис. 1:4 и Ис. 43:3 оба только обличают Израиль.' },
    ],
    correctAnswer: 'b',
    takeaway:'Эпитет сохраняет связь с Богом Израиля; риторическая функция стихов различается.' },
  { id:'immanuel', kind:'parallel-witness',
    prompt:'Чем исторический горизонт Ис. 7:14 отличается от цитаты Мф. 1:23?',
    lensA:'Читайте Ис. 7:14 в связи с обращением пророка к Ахазу и ребёнком-знамением.',
    lensB:'Затем откройте цитирование у Матфея, где имя связано с Иисусом.',
    answerOptions: [
      { id: 'a', label: 'В Мф. 1:23 Исайя впервые обращается к Ахазу.' },
      { id: 'b', label: 'Исайя цитирует Евангелие от Матфея как более раннее свидетельство.' },
      { id: 'c', label: 'В Ис. 7:14 пророк обращается к Ахазу, а Мф. 1:23 связывает цитату с Иисусом.' },
    ],
    correctAnswer: 'c',
    takeaway:'Исайя и Матфей принадлежат разным литературным горизонтам; их нельзя делать современниками.' },
  // Written form and language: no phonetic guesses or synthesis.
  { id:'atiq-yomin', kind:'written-form',
    prompt:'На каком языке зафиксировано выражение в тексте Дан. 7?',
    lensA:'Рассмотрите исходное написание и научную транслитерацию отдельно.',
    lensB:'Отделите язык книги от звучания реконструированного чтения.',
    takeaway:'В Дан. 7 этот фрагмент арамейский. Не выдавайте современное чтение за речь древнего пророка.' },
  { id:'elah-shmaya', kind:'written-form',
    prompt:'На каком языке передано «Бог Небес» в Дан. 2:18–19?',
    lensA:'Сравните начертание и транслитерацию в досье.',
    lensB:'Восстановите литературный контекст просьбы Даниила и благодарения.',
    takeaway:'Свидетельство здесь арамейское; точную артикуляцию следует утверждать отдельно.' },
  { id:'pantokrator', kind:'written-form',
    prompt:'К какому языку относится слово в Откр. 1:8 и 21:22?',
    lensA:'Исследуйте письменную форму и транслитерацию без её автоматического озвучивания.',
    lensB:'Сопоставьте два контекста Откровения и статус научной редакции.',
    takeaway:'Текст здесь древнегреческий; произношение зависит от названной традиции чтения.' },
  { id:'alpha-omega', kind:'written-form',
    prompt:'Почему «Альфа и Омега» требует различения стихов и языка?',
    lensA:'Рассмотрите греческие буквы как письменный образ, а не магические знаки.',
    lensB:'Сопоставьте Откр. 1:8, 21:6 и 22:13 по говорящим и контексту.',
    takeaway:'Это греческие буквы и формула самоназвания; нельзя упрощать различия говорящих в соседних контекстах.' },
]);
export const FIELD_IDS: readonly string[] = Object.freeze(FIELD_STUDIES.map((v) => v.id));
const FIELD_SET = new Set(FIELD_IDS);
export const FIELD_STORAGE_KEY = 'imena-horeb.field-studies.v1';

export function normalizeFieldJournal(raw: unknown): string[] {
  return Array.isArray(raw) ? FIELD_IDS.filter((id) => raw.includes(id)) : [];
}
// The manuscript and the category are from the read-only registry; users
// cannot gain access to a forbidden location by completing a study.
export function canCompleteFieldStudy(
  id: string, inspectedA: boolean, inspectedB: boolean, answer: string | null,
): boolean {
  const task = FIELD_STUDIES.find((t) => t.id === id);
  const exhibit = EXHIBITS.find((e) => e.id === id);
  if (!task || !exhibit || !inspectedA || !inspectedB) return false;
  if (task.kind === 'named-object') return answer === exhibit.category;
  if (task.kind === 'written-form') return answer === exhibit.sourceLanguage;
  if (task.kind === 'voices' || task.kind === 'parallel-witness')
    return !!task.answerOptions?.some((o) => o.id === answer) &&
      !!task.correctAnswer && answer === task.correctAnswer;
  return false;
}
export function markFieldStudy(
  raw: unknown, id: string, inspectedA: boolean, inspectedB: boolean, answer: string | null,
): string[] {
  const journal = normalizeFieldJournal(raw);
  if (!FIELD_SET.has(id) || !canCompleteFieldStudy(id, inspectedA, inspectedB, answer)) return journal;
  return normalizeFieldJournal([...journal, id]);
}
export const NAMED_OBJECT_CHOICES: readonly { id: Category; label: string }[] = [
  { id: 'place_name', label: 'Название места' },
  { id: 'altar_name', label: 'Название жертвенника' },
  { id: 'city_name', label: 'Название города' },
  { id: 'personal_divine_name', label: 'Личное имя Бога' },
];
export const WRITTEN_LANGUAGE_CHOICES = [
  { id: 'he', label: 'Древнееврейский' },
  { id: 'arc', label: 'Арамейский' },
  { id: 'grc', label: 'Древнегреческий' },
] as const;
