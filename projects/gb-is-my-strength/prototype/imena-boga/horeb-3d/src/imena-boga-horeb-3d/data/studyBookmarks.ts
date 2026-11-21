import { EXHIBITS } from './exhibits';

// Personal study references remain exclusively in browser storage. They are
// neither a reward system nor a claim that a disputed form was approved.
export const STUDY_BOOKMARKS_KEY = 'imena-horeb.study-bookmarks.v1';

const canonicalIds = EXHIBITS.map((e) => e.id);
const validIds = new Set(canonicalIds);

/** Accept only canonical dossier IDs; discard duplicates and stale IDs.
 * Sorted in the same biblical/source order as the 42-record exhibit ledger.
 */
export function normalizeStudyBookmarks(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const selected = new Set(
    raw.slice(0, 512).filter((id): id is string =>
      typeof id === 'string' && validIds.has(id)),
  );
  return canonicalIds.filter((id) => selected.has(id));
}

export function toggleStudyBookmark(current: readonly string[], id: string): string[] {
  if (!validIds.has(id)) return normalizeStudyBookmarks(current);
  const selected = new Set(normalizeStudyBookmarks(current));
  if (selected.has(id)) selected.delete(id);
  else selected.add(id);
  return canonicalIds.filter((candidate) => selected.has(candidate));
}
