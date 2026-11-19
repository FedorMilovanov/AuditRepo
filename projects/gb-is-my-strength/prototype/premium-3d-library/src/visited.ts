/** Untrusted, browser-owned lab visit history. Never throw on corrupt data.
 * Reject wrong JSON shapes; preserve the raw storage record without writes.
 * Unknown historical scene IDs are omitted from the display only.
 * The personal cabinet's IndexedDB data is entirely outside this feature.
 */
/** null means the persisted record is invalid and MUST NOT be overwritten.
 * An absent record is a valid empty history. This is a *pure* schema parser.
 */
export function decodeVisitedRecord(raw: string | null): string[] | null {
  if (raw === null) return [];
  if (!raw || raw.length > 16384) return null;
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { return null; }
  if (!Array.isArray(parsed) || parsed.length > 256 ||
      !parsed.every((v: unknown) => typeof v === "string" && v.length > 0 && v.length <= 156)) {
    return null;
  }
  return parsed as string[];
}

/** Render only current known station IDs while retaining historical IDs in
 * the raw record so they survive future compatible UI revisions. */
export function parseVisited(raw: string | null, knownIds: readonly string[]): string[] {
  const decoded = decodeVisitedRecord(raw);
  if (!decoded) return [];
  const allowed = new Set(knownIds);
  const result: string[] = [];
  const seen = new Set<string>();
  for (const id of decoded) {
    if (allowed.has(id) && !seen.has(id)) {
      seen.add(id);
      result.push(id);
    }
  }
  return result;
}

/** Compute a safe replacement without writing storage. Return null rather
 * than destroy unparseable, oversized, or older-edition visit history. */
export function appendVisitedRecord(raw: string | null, id: string): string | null {
  const original = decodeVisitedRecord(raw);
  if (original === null || !id || id.length > 156) return null;
  const merged = Array.from(new Set([...original, id]));
  return merged.length <= 256 ? JSON.stringify(merged) : null;
}
