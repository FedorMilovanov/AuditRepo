/** HOREB / biblical-world route CONTRACT (design state, not deployed geometry).
 *
 * One curatorial assignment per existing Research ID. Textual truth is owned
 * by EXHIBITS and Research PR #379, NOT by this route ledger. Do not copy
 * Scriptures, speaker claims or approval flags into scene navigation.
 *
 * The Genesis world may include a creation PROLOGUE; Exodus main path follows
 * Exodus 3-40; later Hebrew Scriptures and NT remain independently curated.
 * An entry's primary chapter is not a claim that all its referenced parallel
 * passages belong to that single historical scene.
 */
export type StoryWorld = 'genesis' | 'exodus' | 'later-ot' | 'nt-future';
export type StoryChapter =
  | 'creation-prologue' | 'patriarchs'
  | 'horeb-call' | 'egypt-return' | 'exodus-and-sea'
  | 'marah' | 'wilderness-sin' | 'rephidim' | 'sinai-covenant'
  | 'deuteronomy-epilogue' | 'later-ot-library' | 'nt-library';

export interface StoryStop {
  readonly id: StoryChapter;
  readonly world: StoryWorld;
  readonly biblicalRange: string;
  readonly place: string;
  readonly exhibitIds: readonly string[];
  readonly navigation: 'optional' | 'main' | 'future';
  readonly description: string;
}

/** Narrative order is deliberate. Empty stops are genuine Biblical episodes
 * without additional approved names-ledger ID, not fabricated exhibits.
 * These are proposed narrative ROUTES; only the original 8-zone lab is live. */
export const STORY_STOPS: readonly StoryStop[] = [
  { id: 'creation-prologue', world: 'genesis',
    biblicalRange: 'Быт. 1–11', place: 'Литературный пролог к миру Бытия',
    exhibitIds: ['elohim'], navigation: 'optional',
    description: 'Начало Бытия; не отождествлять творение с физической локацией патриархов.' },
  { id: 'patriarchs', world: 'genesis',
    biblicalRange: 'Быт. 12–50', place: 'Отдельный будущий мир патриархов',
    exhibitIds: ['el-elyon', 'el-shaddai', 'el-roi', 'el-olam', 'yireh', 'el-bethel'],
    navigation: 'future',
    description: 'Разные места и события Авраама, Агари и Иакова; не один общий колодец.' },
  { id: 'horeb-call', world: 'exodus',
    biblicalRange: 'Исх. 3–4', place: 'Хорив: призвание Моисея, неопалимая купина',
    exhibitIds: ['ehyeh', 'yhwh'], navigation: 'main',
    description: 'Отправная кульминация; Исх. 3:12 обещает служение на этой горе.' },
  { id: 'egypt-return', world: 'exodus',
    biblicalRange: 'Исх. 4:18–12:51', place: 'Переход к другой локации: Египет',
    exhibitIds: [], navigation: 'main',
    description: 'Моисей возвращается в Египет; Египет не является соседней пещерой Хорива.' },
  { id: 'exodus-and-sea', world: 'exodus',
    biblicalRange: 'Исх. 13–15:21', place: 'Море и Песнь Моисея',
    exhibitIds: ['yah'], navigation: 'main',
    description: 'Библейская последовательность, не GPS-модель маршрута или механизм чуда.' },
  { id: 'marah', world: 'exodus',
    biblicalRange: 'Исх. 15:22–27', place: 'Марра и Елим',
    exhibitIds: ['rapha'], navigation: 'main',
    description: 'Горькая вода и отличимый оазис; не смешивать с источником Агари.' },
  { id: 'wilderness-sin', world: 'exodus',
    biblicalRange: 'Исх. 16', place: 'Пустыня Син',
    exhibitIds: [], navigation: 'main',
    description: 'Манна и доверие; дополнительная глава без нового Research ID.' },
  { id: 'rephidim', world: 'exodus',
    biblicalRange: 'Исх. 17–18', place: 'Рефидим: вода из скалы и памятный жертвенник',
    exhibitIds: ['nissi'], navigation: 'main',
    description: 'Имя дано жертвеннику, а не создано новое личное имя Бога.' },
  { id: 'sinai-covenant', world: 'exodus',
    biblicalRange: 'Исх. 19–40', place: 'Синай: завет и последующее возобновление',
    exhibitIds: ['mekoddishkem', 'el-rahum-hannun', 'el-qanna', 'el'],
    navigation: 'main',
    description: 'Реальные стихи и несколько событий, не одна бесконечная церемония.' },
  { id: 'deuteronomy-epilogue', world: 'later-ot',
    biblicalRange: 'Втор. 32', place: 'Моисеева песнь: отдельное позднейшее свидетельство',
    exhibitIds: ['tsur', 'el-emunah', 'eloah'], navigation: 'future',
    description: 'Песнь относится к позднему контексту Второзакония, не в Исх. 3.' },
  { id: 'later-ot-library', world: 'later-ot',
    biblicalRange: 'Судьи, исторические книги, Псалтирь, пророки и Даниил',
    place: 'Будущие самостоятельные миры и исследовательская библиотека',
    exhibitIds: ['shalom', 'ro-i', 'sabaoth', 'el-gibbor', 'tsidkenu',
      'shammah', 'adonai', 'qedosh-yisrael', 'el-hay',
      'avinu', 'yhwh-ori', 'atiq-yomin', 'elah-shmaya'],
    navigation: 'future',
    description: 'Это библиотечная группа, НЕ реконструкция общей исторической сцены.' },
  { id: 'nt-library', world: 'nt-future',
    biblicalRange: 'Евангелия, апостольские свидетельства, Откровение',
    place: 'Отдельные будущие новозаветные локации',
    exhibitIds: ['abba', 'pantokrator', 'alpha-omega', 'ego-eimi', 'immanuel',
      'kyrios-ho-theos', 'poimen-ho-kalos', 'anastasis-zoe',
      'ho-on-erchomenos', 'arche-telos'],
    navigation: 'future',
    description: 'Значения имеют интертекстуальные связи с ВЗ; всё равно не помещать НЗ в Хорив.' },
] as const;

/** First 3D slice: physically separate Horeb from the legacy 42-item lab.
 * The two IDs are derived from the SAME canonical chronology, not from
 * an invented duplicate source registry. The complete 42 entries remain
 * in the accessible reader and the explicit legacy QA laboratory.
 */
export type ExpeditionMode = 'horeb' | 'legacy';
export const HOREB_CALL_STOP = STORY_STOPS.find(s => s.id === 'horeb-call')!;
export const EGYPT_RETURN_STOP = STORY_STOPS.find(s => s.id === 'egypt-return')!;
export const HOREB_CALL_START = { x: 0, z: -338 } as const;
export function sceneExhibitsForMode<T extends { readonly id: string }>(
  registry: readonly T[], mode: ExpeditionMode,
): T[] {
  if (mode === 'legacy') return [...registry];
  const activeIds = new Set(HOREB_CALL_STOP.exhibitIds);
  return registry.filter(item => activeIds.has(item.id));
}
export const EXODUS_CHAPTER_ORDER: readonly StoryChapter[] = [
  'horeb-call', 'egypt-return', 'exodus-and-sea', 'marah',
  'wilderness-sin', 'rephidim', 'sinai-covenant',
];

export function worldForResearchId(id: string): StoryWorld | null {
  return STORY_STOPS.find(s => s.exhibitIds.includes(id))?.world ?? null;
}
export function chapterForResearchId(id: string): StoryChapter | null {
  return STORY_STOPS.find(s => s.exhibitIds.includes(id))?.id ?? null;
}

export interface RoutableExhibit { readonly id: string; readonly publicationState: string; }

/** Fail-closed integrity validator; never mistake design routing for an
 * approval to display source claims or move physical props. */
export function validateStoryWorlds(registry: readonly RoutableExhibit[]): string[] {
  const errors: string[] = [];
  const exhibitIds = new Set(registry.map(e => e.id));
  if (registry.length !== 42 || exhibitIds.size !== 42)
    errors.push('expected exactly 42 distinct Research exhibits');
  const seen = new Set<string>();
  const chapterIds = new Set<StoryChapter>();
  for (const stop of STORY_STOPS) {
    if (chapterIds.has(stop.id)) errors.push('duplicate story chapter: ' + stop.id);
    chapterIds.add(stop.id);
    if (!stop.place || !stop.biblicalRange || !stop.description)
      errors.push('missing source or narrative label in ' + stop.id);
    for (const id of stop.exhibitIds) {
      if (!exhibitIds.has(id)) errors.push('missing Research ID: ' + id);
      if (seen.has(id)) errors.push('duplicate story assignment: ' + id);
      seen.add(id);
    }
  }
  for (const id of exhibitIds) if (!seen.has(id))
    errors.push('unassigned Research ID: ' + id);
  for (const id of seen) if (!exhibitIds.has(id))
    errors.push('story ID absent from registry: ' + id);
  if (registry.some(e => e.publicationState !== 'HOLD'))
    errors.push('story route cannot approve Research / rights');
  const exodus = STORY_STOPS.filter(s => s.world === 'exodus');
  if (exodus.map(s => s.id).join('|') !== EXODUS_CHAPTER_ORDER.join('|'))
    errors.push('Exodus 3–40 chapter order is broken');
  if (exodus[0]?.exhibitIds.join('|') !== 'ehyeh|yhwh' ||
      exodus[1]?.exhibitIds.length !== 0 ||
      exodus[4]?.exhibitIds.length !== 0)
    errors.push('Horeb / Egypt / wilderness narrative boundaries lost');
  if (exodus.some(s => s.navigation !== 'main') ||
      STORY_STOPS.filter(s => s.world === 'nt-future').some(s => s.navigation !== 'future'))
    errors.push('unapproved cross-world narrative route');
  return errors;
}
