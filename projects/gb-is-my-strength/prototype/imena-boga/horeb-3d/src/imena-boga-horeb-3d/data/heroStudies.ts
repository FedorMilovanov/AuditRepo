import { FIELD_STUDIES } from './fieldStudies.js';
import { normalizeSiteClues, type SiteClueId } from './siteClues.js';

// Two optional, spatially witnessed contrasts from the SAME authored source
// questions used by the HTML/3D FieldStudy reader. No second answer ledger,
// second theological approval, points, or prerequisites for free exploration.
export const HERO_STUDY_STORAGE_KEY = 'imena-horeb.hero-context.v1';
export const HERO_STUDIES = [
  {
    id: 'abba',
    title: 'Гефсимания: место молитвы и разные говорящие',
    intro: 'Осмотрите оливу и пустое место молитвы как художественные ориентиры, не как найденные исторические предметы. Затем откройте Мк. 14:36, Рим. 8:15 и Гал. 4:6.',
    evidence: ['gethsemane-olive', 'gethsemane-prayer-stone'],
    source: 'Мк. 14:36; Рим. 8:15; Гал. 4:6',
  },
  {
    id: 'tsidkenu',
    title: 'Иеремия: царская фигура и город',
    intro: 'Обратите внимание на условный царский знак и вид города. Различите референтов в Иер. 23:6 и 33:16; модели не претендуют на археологическую точность.',
    evidence: ['jeremiah-royal-sign', 'jeremiah-city-view'],
    source: 'Иер. 23:5–6; 33:14–16',
  },
] as const satisfies readonly {
  id: string; title: string; intro: string;
  evidence: readonly SiteClueId[]; source: string;
}[];
export type HeroStudyId = (typeof HERO_STUDIES)[number]['id'];
export const HERO_STUDY_IDS: readonly HeroStudyId[] = HERO_STUDIES.map((study) => study.id);

export function heroStudyReady(id: string, rawClues: unknown): boolean {
  const study = HERO_STUDIES.find((s) => s.id === id);
  const clues = normalizeSiteClues(rawClues);
  return !!study && study.evidence.every((clue) => clues.includes(clue));
}
export function normalizeHeroStudyJournal(raw: unknown, rawClues: unknown): HeroStudyId[] {
  return Array.isArray(raw) ? HERO_STUDY_IDS.filter((id) =>
    raw.includes(id) && heroStudyReady(id, rawClues)) : [];
}
export function canCompleteHeroStudy(id: string, clues: unknown, answer: string | null): boolean {
  if (!heroStudyReady(id, clues)) return false;
  const sourceTask = FIELD_STUDIES.find((s) => s.id === id);
  return !!sourceTask?.answerOptions?.some((option) => option.id === answer) &&
    sourceTask.correctAnswer === answer;
}
export function markHeroStudy(
  existing: unknown, id: string, clues: unknown, answer: string | null,
): HeroStudyId[] {
  const journal = normalizeHeroStudyJournal(existing, clues);
  if (!canCompleteHeroStudy(id, clues, answer)) return journal;
  return normalizeHeroStudyJournal([...journal, id], clues);
}
