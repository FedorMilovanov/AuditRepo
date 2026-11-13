/**
 * Read-only Product-owned route projection. This adapter does not invent,
 * republish, or copy a mutable Product registry into the 3D laboratory.
 * In Product, the canonical route policy and metadata are supplied by the
 * existing build pipeline. In the Lab, fixtures are not publication claims.
 */
export type RoutePolicy = {
  indexPolicy: 'index' | 'noindex';
  pagefindPolicy: 'include' | 'metadata-only' | 'exclude';
  searchManifestPolicy: 'include' | 'exclude';
  sitemapPolicy: 'include' | 'exclude';
  librarySection: string;
  topicCategory: string;
  contentKind: string;
};
export type RouteProjection = { version: number; routes: Record<string, RoutePolicy> };
export type PublicMetadata = { path: string; title: string; summary?: string; stableId: string };
export type CatalogEntry = PublicMetadata & {
  section: string; topic: string; kind: string;
};
export type CatalogResult = { entries: CatalogEntry[]; excluded: number; errors: string[] };
const ID = /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,155}$/;
const PATH = /^\/(?:[a-z0-9_-]+\/)*$/i;
function validPath(path: unknown): path is string {
  return typeof path === 'string' && path.length <= 240 && PATH.test(path) && !path.includes('//');
}
function smallText(value: unknown, max: number): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= max;
}
/**
 * Only confirmed public/indexable entries with public search metadata can be
 * offered as library content. Noindex and absent metadata fail closed.
 */
export function projectCatalog(policy: unknown, metadata: unknown): CatalogResult {
  if (!policy || typeof policy !== 'object' || Array.isArray(policy) ||
      !('routes' in policy) || !policy.routes || typeof policy.routes !== 'object' || Array.isArray(policy.routes) ||
      !('version' in policy) || policy.version !== 1 || !Array.isArray(metadata)) {
    return { entries: [], excluded: 0, errors: ['Нужны действующий Product route policy и проверенный каталог метаданных'] };
  }
  const routes = policy.routes as Record<string, unknown>;
  const seenPaths = new Set<string>();
  const seenIds = new Set<string>();
  const entries: CatalogEntry[] = [];
  const errors: string[] = [];
  let excluded = 0;
  for (const row of metadata) {
    if (!row || typeof row !== 'object' || Array.isArray(row)) { errors.push('Некорректная запись каталога'); continue; }
    const m = row as Record<string, unknown>;
    if (!validPath(m.path) || !smallText(m.title, 200) || typeof m.stableId !== 'string' || !ID.test(m.stableId) ||
        (m.summary !== undefined && (typeof m.summary !== 'string' || m.summary.length > 600))) {
      errors.push('Некорректный адрес, заголовок или stable ID'); continue;
    }
    if (seenPaths.has(m.path) || seenIds.has(m.stableId)) { errors.push(`Повтор canonical ID или пути: ${m.path}`); continue; }
    seenPaths.add(m.path); seenIds.add(m.stableId);
    const p = routes[m.path];
    if (!p || typeof p !== 'object' || Array.isArray(p)) { excluded++; continue; }
    const r = p as Record<string, unknown>;
    // Deny malformed/incomplete policy records BEFORE checking inclusion.
    // The previous test against only "exclude" wrongly admitted undefined.
    if ((r.indexPolicy !== 'index' && r.indexPolicy !== 'noindex') ||
        (r.pagefindPolicy !== 'include' && r.pagefindPolicy !== 'metadata-only' && r.pagefindPolicy !== 'exclude') ||
        (r.searchManifestPolicy !== 'include' && r.searchManifestPolicy !== 'exclude') ||
        (r.sitemapPolicy !== 'include' && r.sitemapPolicy !== 'exclude')) {
      errors.push('Некорректная политика публикации: ' + m.path);
      continue;
    }
    if (r.indexPolicy !== 'index' || r.searchManifestPolicy !== 'include' || r.sitemapPolicy !== 'include' ||
        r.pagefindPolicy === 'exclude') { excluded++; continue; }
    if (!smallText(r.librarySection, 80) || !smallText(r.topicCategory, 80) || !smallText(r.contentKind, 60)) {
      errors.push(`У опубликованного маршрута отсутствуют категории: ${m.path}`);continue;
    }
    entries.push({ path:m.path, stableId:m.stableId, title:m.title.trim(), ...(m.summary !== undefined ? {summary:m.summary}:{}),
      section:r.librarySection.trim(), topic:r.topicCategory.trim(), kind:r.contentKind.trim() });
  }
  return { entries: entries.sort((a,b)=>a.section.localeCompare(b.section,'ru')||a.title.localeCompare(b.title,'ru')),excluded,errors };
}
/** For a personal bookmark: never infer a missing canonical route from a 3D mesh label. */
export function findPublishedContent(entries: readonly CatalogEntry[], stableId: string): CatalogEntry | null {
  return entries.find(e=>e.stableId===stableId) ?? null;
}
