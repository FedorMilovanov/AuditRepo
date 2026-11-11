import { normalizeSiteClues, type SiteClueId } from './siteClues.js';

// Non-coercive 3D investigation, not a spiritual score or editorial verdict.
// Evidence can be collected in ANY walking order; historical order is a
// separate answer that must be reasoned from Genesis 16 and Genesis 21.
export const EXPEDITION_STORAGE_KEY = 'imena-horeb.expedition.beersheba-hagar.v1';
export const EXPEDITION_EVIDENCE: readonly SiteClueId[] = [
  'beersheba-well', 'beersheba-tamarisk', 'hagar-spring',
];
export const EXPEDITION_CHRONOLOGY = [
  { id: 'a', label: 'Тамариск → источник Агари → колодец Вирсавии' },
  { id: 'b', label: 'Источник Агари (Быт. 16) → колодец Вирсавии → тамариск (Быт. 21)' },
  { id: 'c', label: 'Колодец Вирсавии → тамариск → источник Агари' },
] as const;
export const EXPEDITION_CONTRAST = [
  { id: 'a', label: 'Один и тот же колодец и одно событие под разными именами' },
  { id: 'b', label: 'Тамариск является названием источника, найденного Агарью' },
  { id: 'c', label: 'Два разных повествования: Агарь у источника в Быт. 16; спор о колодце и тамариск Авраама в Быт. 21' },
] as const;

export function expeditionReady(raw: unknown): boolean {
  const seen = normalizeSiteClues(raw);
  return EXPEDITION_EVIDENCE.every((id) => seen.includes(id));
}
export function normalizeExpeditionCompletion(raw: unknown): boolean {
  return raw === true;
}
export function canCompleteExpedition(
  clues: unknown, chronology: string | null, contrast: string | null,
): boolean {
  return expeditionReady(clues) && chronology === 'b' && contrast === 'c';
}
export function completeExpedition(
  existing: unknown, clues: unknown, chronology: string | null, contrast: string | null,
): boolean {
  return normalizeExpeditionCompletion(existing) ||
    canCompleteExpedition(clues, chronology, contrast);
}
