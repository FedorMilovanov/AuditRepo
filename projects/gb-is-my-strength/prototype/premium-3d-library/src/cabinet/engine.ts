/**
 * Isolated, local laboratory state. It is NOT the Product GBReaderLibrary V3
 * schema and must never import/export from the Product's private storage keys.
 * Pure functions, deterministic IDs supplied by the caller, no DOM/IO.
 */
export const VAULT_VERSION = 1 as const;
export const MAX_EXPORT_BYTES = 350_000;
export const MAX_RECORDS = 300;
export const MAX_COLLECTIONS = 40;
const SITE = 'https://gospod-bog.ru';

export type Target = { contentId: string; path: string; title: string; anchor?: string };
export type Bookmark = { kind: 'bookmark'; id: string; target: Target; createdAt: string };
export type Quote = {
  kind: 'quote'; id: string; target: Target; exact: string; prefix: string; suffix: string;
  attribution: string; edition?: string; note?: string; createdAt: string;
  anchorStatus: 'needs-review';
};
export type ReaderRecord = Bookmark | Quote;
export type ReaderCollection = { id: string; title: string; recordIds: string[]; createdAt: string };
export type VaultState = { schemaVersion: 1; records: ReaderRecord[]; collections: ReaderCollection[] };
export const EMPTY_VAULT: VaultState = { schemaVersion: 1, records: [], collections: [] };
/** Secure IDs also work in a local-file preview where randomUUID() may be absent. */
export function newRecordId(): string {
  if (typeof crypto === 'undefined' || typeof crypto.getRandomValues !== 'function') throw new Error('Криптографический генератор ID недоступен');
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map(b=>b.toString(16).padStart(2,'0')).join('');
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}
export type Mutation = { ok: boolean; state: VaultState; reason: string };
export type QuoteMatch = { status: 'found'; start: number; end: number } | { status: 'ambiguous' | 'unresolved' };

function isPlain(x: unknown): x is Record<string, unknown> {
  return !!x && typeof x === 'object' && !Array.isArray(x) && Object.getPrototypeOf(x) === Object.prototype;
}
function bounded(x: unknown, min: number, max: number): x is string {
  return typeof x === 'string' && x.length <= max && x.trim().length >= min;
}
function safeId(x: unknown): x is string { return bounded(x, 1, 90) && /^[A-Za-z0-9][A-Za-z0-9_.:-]*$/.test(x); }
function instant(x: unknown): x is string {
  return typeof x === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d{1,3})?Z$/.test(x) && Number.isFinite(Date.parse(x)) && new Date(x).toISOString().slice(0, 19) === x.slice(0, 19);
}
/** Only same-origin published-route-shaped paths. Actual publication is checked by Product registry later. */
export function normalizeTarget(input: Target): Target | null {
  if (!isPlain(input) || !safeId(input.contentId) || !bounded(input.title, 1, 160) || typeof input.path !== 'string') return null;
  if (input.path.includes('\\') || input.path.includes('?') || input.path.includes('#') || /(^|\/)\.{1,2}(?:\/|$)/.test(input.path) || /%(?:2e|2f|5c)/i.test(input.path)) return null;
  let url: URL;
  try { url = new URL(input.path, SITE); } catch { return null; }
  if (url.origin !== SITE || url.username || url.password || url.search || url.hash) return null;
  if (!/^\/(?:[a-z0-9_-]+\/)*$/i.test(url.pathname) || url.pathname.length > 240) return null;
  if (input.anchor !== undefined && (!bounded(input.anchor, 1, 120) || !/^[\p{L}\p{N}_.:-]+$/u.test(input.anchor))) return null;
  return { contentId: input.contentId, title: input.title.trim(), path: url.pathname, ...(input.anchor ? { anchor: input.anchor } : {}) };
}
export function targetUrl(t: Target): string {
  const checked = normalizeTarget(t);
  if (!checked) return SITE;
  return SITE + checked.path + (checked.anchor ? '#' + encodeURIComponent(checked.anchor) : '');
}
function goodId(state: VaultState, id: string) {
  return safeId(id) && !state.records.some(r => r.id === id) && !state.collections.some(c => c.id === id);
}
function fail(state: VaultState, reason: string): Mutation { return { ok: false, state, reason }; }
function pass(state: VaultState, reason: string): Mutation { return { ok: true, state, reason }; }

export function addBookmark(state: VaultState, input: { id: string; target: Target; at: string }): Mutation {
  const t = normalizeTarget(input.target);
  if (!t || !goodId(state, input.id) || !instant(input.at)) return fail(state, 'Недопустимая закладка');
  if (state.records.length >= MAX_RECORDS) return fail(state, 'Достигнут лимит локального прототипа');
  if (state.records.some(r => r.kind === 'bookmark' && r.target.contentId === t.contentId && (r.target.anchor || '') === (t.anchor || ''))) return fail(state, 'Это место уже сохранено');
  return pass({ ...state, records: [...state.records, { kind: 'bookmark', id: input.id, target: t, createdAt: input.at }] }, 'Закладка сохранена');
}
export function addQuote(state: VaultState, input: {
  id: string; target: Target; at: string; exact: string; prefix?: string; suffix?: string;
  attribution: string; edition?: string; note?: string;
}): Mutation {
  const t = normalizeTarget(input.target);
  if (!t || !goodId(state, input.id) || !instant(input.at) || !bounded(input.exact, 2, 1200) || !bounded(input.attribution, 2, 160) ||
      (input.prefix !== undefined && input.prefix.length > 160) || (input.suffix !== undefined && input.suffix.length > 160) ||
      (input.note !== undefined && input.note.length > 2000) || (input.edition !== undefined && input.edition.length > 120)) return fail(state, 'Проверьте текст, источник и ограничения полей');
  if (state.records.length >= MAX_RECORDS) return fail(state, 'Достигнут лимит локального прототипа');
  if (state.records.some(r => r.kind === 'quote' && r.target.contentId === t.contentId && r.exact === input.exact.trim())) return fail(state, 'Этот отрывок уже сохранён');
  const entry: Quote = { kind: 'quote', id: input.id, target: t, exact: input.exact.trim(), prefix: input.prefix || '', suffix: input.suffix || '',
    attribution: input.attribution.trim(), ...(input.edition?.trim() ? { edition: input.edition.trim() } : {}),
    ...(input.note?.trim() ? { note: input.note.trim() } : {}), createdAt: input.at, anchorStatus: 'needs-review' };
  return pass({ ...state, records: [...state.records, entry] }, 'Отрывок добавлен как личная выписка; привязку требуется проверить');
}
export function createCollection(state: VaultState, input: { id: string; title: string; at: string }): Mutation {
  if (!goodId(state, input.id) || !instant(input.at) || !bounded(input.title, 2, 64)) return fail(state, 'Неверное название коллекции');
  if (state.collections.length >= MAX_COLLECTIONS) return fail(state, 'Достигнут предел коллекций');
  if (state.collections.some(c => c.title.toLocaleLowerCase('ru-RU') === input.title.trim().toLocaleLowerCase('ru-RU'))) return fail(state, 'Коллекция с таким названием уже существует');
  return pass({ ...state, collections: [...state.collections, { id: input.id, title: input.title.trim(), recordIds: [], createdAt: input.at }] }, 'Коллекция создана');
}
export function attachToCollection(state: VaultState, collectionId: string, recordId: string): Mutation {
  const c = state.collections.find(x => x.id === collectionId);
  if (!c || !state.records.some(r => r.id === recordId)) return fail(state, 'Запись или коллекция не найдена');
  if (c.recordIds.includes(recordId)) return fail(state, 'Уже находится в коллекции');
  if (c.recordIds.length >= 100) return fail(state, 'В коллекции достигнут предел элементов');
  return pass({ ...state, collections: state.collections.map(x => x.id === collectionId ? { ...x, recordIds: [...x.recordIds, recordId] } : x) }, 'Добавлено в коллекцию');
}
export function deleteRecord(state: VaultState, id: string): Mutation {
  if (!state.records.some(r => r.id === id)) return fail(state, 'Запись не найдена');
  return pass({ ...state, records: state.records.filter(r => r.id !== id), collections: state.collections.map(c => ({ ...c, recordIds: c.recordIds.filter(x => x !== id) })) }, 'Запись удалена');
}
export function deleteCollection(state: VaultState, id: string): Mutation {
  if (!state.collections.some(c => c.id === id)) return fail(state, 'Коллекция не найдена');
  return pass({ ...state, collections: state.collections.filter(c => c.id !== id) }, 'Коллекция удалена; сохранённые материалы остались');
}
export function parseVault(raw: string): { ok: true; state: VaultState } | { ok: false; reason: string } {
  if (typeof raw !== 'string' || new TextEncoder().encode(raw).byteLength > MAX_EXPORT_BYTES) return { ok: false, reason: 'Файл превышает допустимый объём' };
  let p: unknown;
  try { p = JSON.parse(raw); } catch { return { ok: false, reason: 'Некорректный JSON' }; }
  if (!isPlain(p) || p.schemaVersion !== VAULT_VERSION || !Array.isArray(p.records) || !Array.isArray(p.collections) || p.records.length > MAX_RECORDS || p.collections.length > MAX_COLLECTIONS) return { ok: false, reason: 'Версия или структура личной библиотеки не поддерживается' };
  const ids = new Set<string>();
  const recordIds = new Set<string>();
  const dedupBook = new Set<string>();
  const dedupQuote = new Set<string>();
  const records: ReaderRecord[] = [];
  for (const r of p.records) {
    if (!isPlain(r) || !safeId(r.id) || ids.has(r.id) || !instant(r.createdAt)) return { ok: false, reason: 'Повреждена запись или повторяется её ID' };
    const t = normalizeTarget(r.target as Target);
    if (!t) return { ok: false, reason: 'Недопустимая ссылка в сохранённых материалах' };
    if (r.kind === 'bookmark') records.push({ kind:'bookmark', id:r.id, target:t, createdAt:r.createdAt });
    else if (r.kind === 'quote' && bounded(r.exact, 2, 1200) && bounded(r.attribution, 2, 160) && r.anchorStatus === 'needs-review' &&
      typeof r.prefix === 'string' && r.prefix.length <= 160 && typeof r.suffix === 'string' && r.suffix.length <= 160 &&
      (r.note === undefined || typeof r.note === 'string' && r.note.length <= 2000) && (r.edition === undefined || typeof r.edition === 'string' && r.edition.length <= 120)) {
      records.push({kind:'quote', id:r.id, target:t, createdAt:r.createdAt, exact:r.exact, prefix:r.prefix, suffix:r.suffix,
        attribution:r.attribution, ...(r.note ? {note:r.note}:{}), ...(r.edition ? {edition:r.edition}:{}), anchorStatus:'needs-review'});
    } else return { ok: false, reason: 'Запись не соответствует поддерживаемой схеме' };
    const identity = t.contentId + ':' + (t.anchor || '');
    const seen = r.kind === 'bookmark' ? dedupBook : dedupQuote;
    const sig = r.kind === 'quote' ? identity + ':' + r.exact : identity;
    if (seen.has(sig)) return {ok:false,reason:'Дублирование сохранённого материала'};
    seen.add(sig); ids.add(r.id); recordIds.add(r.id);
  }
  const collections: ReaderCollection[] = [];
  const names = new Set<string>();
  for (const c of p.collections) {
    if (!isPlain(c) || !safeId(c.id) || ids.has(c.id) || !bounded(c.title, 2, 64) || !instant(c.createdAt) ||
      !Array.isArray(c.recordIds) || c.recordIds.length > 100 || c.recordIds.some((v: unknown) => typeof v !== 'string' || !recordIds.has(v)) ||
      new Set(c.recordIds).size !== c.recordIds.length || names.has(c.title.trim().toLocaleLowerCase('ru-RU'))) return { ok: false, reason:'Повреждены связи коллекции' };
    ids.add(c.id); names.add(c.title.trim().toLocaleLowerCase('ru-RU'));
    collections.push({id:c.id, title:c.title.trim(), createdAt:c.createdAt, recordIds:[...c.recordIds]});
  }
  const state = { schemaVersion:VAULT_VERSION, records, collections } satisfies VaultState;
  return new TextEncoder().encode(JSON.stringify(state)).byteLength <= MAX_EXPORT_BYTES ? {ok:true, state} : {ok:false,reason:'Слишком большой файл'};
}
export function exportVault(state: VaultState): string { return JSON.stringify(state, null, 2); }
/** UTF-8 source normalization is a Product integration responsibility; no guessing after edits. */
export function resolveQuote(text: string, selected: Pick<Quote, 'exact' | 'prefix' | 'suffix'>): QuoteMatch {
  if (!selected.exact || text.length > 2_000_000) return {status:'unresolved'};
  // Search by UTF-16 offsets efficiently, report W3C character offsets (Unicode code points).
  let at = 0, found = -1, matches = 0;
  while ((at = text.indexOf(selected.exact, at)) !== -1) {
    const afterStart = at + selected.exact.length;
    const prefixOk = !selected.prefix || text.slice(Math.max(0, at-selected.prefix.length), at) === selected.prefix;
    const suffixOk = !selected.suffix || text.startsWith(selected.suffix, afterStart);
    if (prefixOk && suffixOk) { found = at; matches++; if (matches > 1) return { status:'ambiguous' }; }
    at += 1; // Overlapping occurrences must count as ambiguous too.
  }
  return matches === 1 ? { status:'found', start:Array.from(text.slice(0, found)).length,
    end:Array.from(text.slice(0, found + selected.exact.length)).length } : { status:'unresolved' };
}
