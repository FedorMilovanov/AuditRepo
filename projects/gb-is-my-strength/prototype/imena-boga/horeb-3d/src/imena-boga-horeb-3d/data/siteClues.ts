// Physical story details, not artefacts to collect or scripture substitutes.
// The original 3D props already have coordinates in buildExhibitProps;
// World registers the matching centres at construction time.
export const SITE_CLUES = Object.freeze({
  'beersheba-well': {
    exhibitId: 'el-olam',
    label: 'Открытый колодец Вирсавии',
    finding: 'В повествовании Быт. 21 спор и договор касаются колодца. Это не источник Агари в Быт. 16.',
    reference: 'Быт. 21:25–33',
  },
  'beersheba-tamarisk': {
    exhibitId: 'el-olam',
    label: 'Тамариск Авраама',
    finding: 'Быт. 21:33 говорит, что Авраам посадил тамариск в Вирсавии. Дерево — свидетельство текста, а не магический предмет.',
    reference: 'Быт. 21:33',
  },
  'hagar-spring': {
    exhibitId: 'el-roi',
    label: 'Источник в истории Агари',
    finding: 'Это отдельный рассказ Быт. 16:13–14: слова Агари и название источника требуют различения.',
    reference: 'Быт. 16:13–14',
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
