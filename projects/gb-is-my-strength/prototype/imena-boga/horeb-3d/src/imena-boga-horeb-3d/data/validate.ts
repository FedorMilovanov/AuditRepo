import type { Exhibit, Category } from './exhibits';

// Fail-closed редакционные инварианты. Возвращает список ошибок (пусто = OK).
// Реестр должен содержать ровно 42 исследовательских обозначения Research #379.

// Research #379 canonical IDs (29 baseline + 13 extension), SHA 70442271.
export const RESEARCH_IDS_42: string[] = [
  // baseline 29
  'yhwh', 'ehyeh', 'yireh', 'rapha', 'nissi', 'mekoddishkem', 'ro-i', 'shalom', 'tsidkenu',
  'shammah', 'sabaoth', 'elohim', 'el', 'el-shaddai', 'el-elyon', 'el-olam', 'el-roi', 'el-gibbor',
  'el-bethel', 'el-qanna', 'adonai', 'qedosh-yisrael', 'tsur', 'atiq-yomin', 'abba', 'pantokrator',
  'alpha-omega', 'ego-eimi', 'immanuel',
  // extension 13
  'yah', 'eloah', 'elah-shmaya', 'el-hay', 'avinu', 'yhwh-ori', 'el-emunah', 'el-rahum-hannun',
  'kyrios-ho-theos', 'poimen-ho-kalos', 'anastasis-zoe', 'ho-on-erchomenos', 'arche-telos',
];

// Категория обязана совпадать с Research ledger (29 baseline + 13 extension).
const EXPECTED: Record<string, Exhibit['category']> = {
  yhwh: 'personal_divine_name',
  ehyeh: 'divine_self_declaration',
  yireh: 'place_name',
  rapha: 'metaphor_predication',
  nissi: 'altar_name',
  mekoddishkem: 'metaphor_predication',
  'ro-i': 'metaphor_predication',
  shalom: 'altar_name',
  tsidkenu: 'prophetic_christological_designation',
  shammah: 'city_name',
  sabaoth: 'divine_title',
  elohim: 'deity_designation',
  el: 'deity_designation',
  'el-shaddai': 'divine_title',
  'el-elyon': 'divine_title',
  'el-olam': 'divine_epithet',
  'el-roi': 'divine_epithet',
  'el-gibbor': 'divine_epithet',
  'el-bethel': 'place_name',
  'el-qanna': 'divine_epithet',
  adonai: 'divine_title',
  'qedosh-yisrael': 'divine_epithet',
  tsur: 'metaphor_predication',
  'atiq-yomin': 'divine_title',
  abba: 'intertextual_theological_interpretation',
  pantokrator: 'divine_title',
  'alpha-omega': 'divine_self_declaration',
  'ego-eimi': 'intertextual_theological_interpretation',
  immanuel: 'prophetic_christological_designation',
  yah: 'divine_title',
  eloah: 'deity_designation',
  'elah-shmaya': 'divine_title',
  'el-hay': 'divine_epithet',
  avinu: 'divine_title',
  'yhwh-ori': 'metaphor_predication',
  'el-emunah': 'divine_epithet',
  'el-rahum-hannun': 'divine_epithet',
  'kyrios-ho-theos': 'divine_title',
  'poimen-ho-kalos': 'intertextual_theological_interpretation',
  'anastasis-zoe': 'intertextual_theological_interpretation',
  'ho-on-erchomenos': 'divine_title',
  'arche-telos': 'divine_self_declaration',
};

// Именованный объект обязателен для категорий place/altar/city; иным — «—».
const NAMED_OBJECT_CATS = new Set<Category>(['altar_name', 'place_name', 'city_name']);
const BIDI = /[\u200E\u200F\u202A-\u202E\u2066-\u2069]/;
const HEBREW = /^[\u0591-\u05F4\s\u05BE,.-]+$/;
const GREEK = /^[\u0370-\u03FF\u1F00-\u1FFF\s,.]+$/;

export function validateExhibits(list: Exhibit[]): string[] {
  const errs: string[] = [];
  const ids = new Set<string>();
  for (const e of list) {
    const p = `[${e.id}]`;
    if (ids.has(e.id)) errs.push(`${p} duplicate id`);
    ids.add(e.id);
    for (const [k, v] of Object.entries(e)) {
      if (typeof v === 'string') {
        if (!v.trim()) errs.push(`${p} empty field ${k}`);
        if (/[<>]/.test(v)) errs.push(`${p} markup in ${k}`);
        if (BIDI.test(v)) errs.push(`${p} bidi control in ${k}`);
      }
    }
    if (e.publicationState !== 'HOLD') errs.push(`${p} publicationState must be HOLD in lab`);
    if (!/^https:\/\//.test(e.verseUrl)) errs.push(`${p} verseUrl must be https`);
    const o = e.originalUnicode;
    if (o.normalize('NFC') !== o) errs.push(`${p} originalUnicode not NFC`);
    if ((e.sourceLanguage === 'he' || e.sourceLanguage === 'arc') && !HEBREW.test(o)) errs.push(`${p} non-Hebrew-script chars`);
    if (e.sourceLanguage === 'grc' && !GREEK.test(o)) errs.push(`${p} non-Greek chars`);
    const exp = EXPECTED[e.id];
    if (exp && e.category !== exp) errs.push(`${p} category ${e.category} != expected ${exp}`);
    if (NAMED_OBJECT_CATS.has(e.category) && e.namedObject === '—') errs.push(`${p} named object missing`);
    if (e.namedObject.includes('жертвенник') && e.category === 'personal_divine_name') errs.push(`${p} altar marked as personal name`);
    if (['жертвенник', 'место', 'город', 'колодец'].includes(e.namedObject) && !NAMED_OBJECT_CATS.has(e.category))
      errs.push(`${p} object-name must be altar/place/city category`);
    // Scene-direction invariants
    if (!Array.isArray(e.anchorProps) || e.anchorProps.length < 2) errs.push(`${p} needs >=2 anchor props (no 42 identical slabs)`);
    if (!e.meaningfulAction || !e.meaningfulAction.trim()) errs.push(`${p} meaningfulAction missing`);
    if (!e.caution || !e.caution.trim()) errs.push(`${p} caution missing`);
    if (!e.environmentKey || !e.environmentKey.trim()) errs.push(`${p} environmentKey missing`);
    if (e.qualityProfile !== 'hero' && e.qualityProfile !== 'micro') errs.push(`${p} qualityProfile must be hero|micro`);
  }
  // E1 COVERAGE: exactly the 42 Research IDs, no misses, no extras.
  const listIds = new Set(list.map((e) => e.id));
  for (const id of RESEARCH_IDS_42) if (!listIds.has(id)) errs.push(`E1 missing Research id: ${id}`);
  for (const id of listIds) if (!RESEARCH_IDS_42.includes(id)) errs.push(`E1 extra id not in Research: ${id}`);
  if (list.length !== 42) errs.push(`E1 registry must contain exactly 42 exhibits, got ${list.length}`);
  // E2 STORY-SPECIFIC: each scene has a unique (environmentKey + meaningfulAction) pair (no mechanical quota).
  const seen = new Set<string>();
  for (const e of list) {
    const k = `${e.environmentKey}::${e.meaningfulAction}`;
    if (seen.has(k)) errs.push(`E2 duplicate scene signature: ${k}`);
    seen.add(k);
  }
  // E3 SEMANTIC TRUTH — critical invariants.
  const get = (id: string) => list.find((x) => x.id === id);
  const e314 = get('ehyeh'), e315 = get('yhwh');
  if (!e314 || !e315) errs.push('Ex 3:14/3:15 missing');
  else if (e314.originalUnicode.includes(e315.originalUnicode)) errs.push('Ex 3:14 and 3:15 forms conflated');
  const roi = get('el-roi'), roei = get('ro-i');
  if (roi && !roi.originalUnicode.includes('ר\u05B3א')) errs.push('El Roi must use root ראה');
  if (roei && !roei.originalUnicode.includes('ע')) errs.push('Ps 23:1 must use root רעה');
  const dan = get('atiq-yomin');
  if (dan && dan.sourceLanguage !== 'arc') errs.push('Dan 7:9 must be Aramaic');
  const sh = get('elah-shmaya');
  if (sh && sh.sourceLanguage !== 'arc') errs.push('Dan 2:18 must be Aramaic');
  const sab = get('sabaoth');
  if (sab && /суббот/i.test(sab.literalGloss)) errs.push('Sabaoth glossed as sabbath');
  const hay = get('el-hay');
  if (hay && !hay.originalUnicode.startsWith('לְ')) errs.push('El Hay must keep the preposition לְ');
  const yireh = get('yireh');
  if (yireh && yireh.category !== 'place_name') errs.push('Yireh must be a place name');
  const nissi = get('nissi'), shalom = get('shalom');
  if (nissi && nissi.category !== 'altar_name') errs.push('Nissi must be an altar name');
  if (shalom && shalom.category !== 'altar_name') errs.push('Shalom must be an altar name');
  const shm = get('shammah');
  if (shm && shm.category !== 'city_name') errs.push('Shammah must be a city name');
  const bethel = get('el-bethel');
  if (bethel && bethel.category !== 'place_name') errs.push('El Bethel must be a place name');
  return errs;
}
