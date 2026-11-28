// Physical story details, not artefacts to collect or scripture substitutes.
// The original 3D props already have coordinates in buildExhibitProps;
// World registers matching physical silhouette positions at construction time.
// All render angles/distance/opaque occluders are revalidated by World on F.
export const SITE_CLUES = Object.freeze({
  'beersheba-well': {
    exhibitId: 'el-olam',
    label: 'Открытый колодец Вирсавии',
    finding: 'В повествовании Быт. 21 спор и договор касаются колодца. Это не источник Агари в Быт. 16.',
    reference: 'Быт. 21:25–33',
    targetHeight: 0.95, silhouetteTolerance: 1.55,
  },
  'beersheba-tamarisk': {
    exhibitId: 'el-olam',
    label: 'Тамариск Авраама',
    finding: 'Быт. 21:33 говорит, что Авраам посадил тамариск в Вирсавии. Дерево — свидетельство текста, а не магический предмет.',
    reference: 'Быт. 21:33',
    targetHeight: 1.5, silhouetteTolerance: 1.10,
  },
  'hagar-spring': {
    exhibitId: 'el-roi',
    label: 'Источник в истории Агари',
    finding: 'Это отдельный рассказ Быт. 16:13–14: слова Агари и название источника требуют различения.',
    reference: 'Быт. 16:13–14',
    targetHeight: 0.35, silhouetteTolerance: 0.75,
  },
  'gethsemane-olive': {
    exhibitId: 'abba',
    label: 'Олива в условном Гефсиманском саду',
    finding: 'Дерево помогает увидеть художественный контекст ночной молитвы в Мк. 14:36; его возраст и облик не установлены археологически.',
    reference: 'Мк. 14:36',
    targetHeight: 1.5, silhouetteTolerance: 1.1,
  },
  'gethsemane-prayer-stone': {
    exhibitId: 'abba',
    label: 'Пустое место молитвы',
    finding: 'Остановка у камня — художественная метка молитвы Иисуса в Мк. 14:36, не реконструкция точного камня или изображение Христа.',
    reference: 'Мк. 14:36; Рим. 8:15; Гал. 4:6',
    targetHeight: 0.15, silhouetteTolerance: 0.55,
  },
  'jeremiah-royal-sign': {
    exhibitId: 'tsidkenu',
    label: 'Царский знак — контекст Иер. 23:6',
    finding: 'Знак обозначает царскую фигуру Отрасли Давида как литературный референт в Иер. 23:6; это не находка и не изображение Бога.',
    reference: 'Иер. 23:5–6',
    targetHeight: 1.25, silhouetteTolerance: 0.60,
  },
  'jeremiah-city-view': {
    exhibitId: 'tsidkenu',
    label: 'Образ города — контекст Иер. 33:16',
    finding: 'Условный город позволяет отличить употребление выражения по отношению к Иерусалиму в Иер. 33:16 от царской фигуры в 23:6.',
    reference: 'Иер. 33:14–16',
    targetHeight: 0.9, silhouetteTolerance: 0.85,
  },
} as const);
export type SiteClueId = keyof typeof SITE_CLUES;
export const SITE_CLUE_IDS = Object.freeze(Object.keys(SITE_CLUES) as SiteClueId[]);
export const SITE_CLUE_STORAGE_KEY = 'imena-horeb.site-observations.v1';
export function isSiteClueId(value: unknown): value is SiteClueId {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(SITE_CLUES, value);
}
// Canonical order and allow-list only; forged IDs and duplicate data are ignored.
export function normalizeSiteClues(value: unknown): SiteClueId[] {
  return Array.isArray(value) ? SITE_CLUE_IDS.filter((id) => value.includes(id)) : [];
}
export function addSiteClue(existing: unknown, id: unknown): SiteClueId[] {
  const safe = normalizeSiteClues(existing);
  return isSiteClueId(id) ? normalizeSiteClues([...safe, id]) : safe;
}
