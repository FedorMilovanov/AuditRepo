import type { Exhibit } from './exhibits';

// Fail-closed редакционные инварианты. Возвращает список ошибок (пусто = OK).
const EXPECTED: Record<string, Exhibit['category']> = {
  'yhwh-nissi-ex-17-15': 'altar_name',
  'yhwh-shalom-judg-6-24': 'altar_name',
  'yhwh-yireh-gen-22-14': 'place_name',
  'beer-lahai-roi-gen-16-14': 'place_name',
  'yhwh-shammah-ezek-48-35': 'city_name',
  'yhwh-ex-3-15': 'personal_divine_name',
  'ehyeh-ex-3-14': 'divine_self_declaration',
};
const NAMED_OBJECT_CATS = new Set(['altar_name', 'place_name', 'city_name']);
const BIDI = /[\u200E\u200F\u202A-\u202E\u2066-\u2069]/;
const HEBREW = /^[\u0591-\u05F4\s\u05BE]+$/;
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
  }
  const get = (id: string) => list.find((x) => x.id === id);
  const e314 = get('ehyeh-ex-3-14'), e315 = get('yhwh-ex-3-15');
  if (!e314 || !e315) errs.push('Ex 3:14/3:15 missing');
  else if (e314.originalUnicode.includes(e315.originalUnicode)) errs.push('Ex 3:14 and 3:15 forms conflated');
  const roi = get('el-roi-gen-16-13'), roei = get('yhwh-roi-ps-23-1');
  if (roi && !roi.originalUnicode.includes('ר\u05B3א')) errs.push('El Roi must use root ראה');
  if (roei && !roei.originalUnicode.includes('ע')) errs.push('Ps 23:1 must use root רעה');
  const dan = get('attiq-yomin-dan-7-9');
  if (dan && dan.sourceLanguage !== 'arc') errs.push('Dan 7:9 must be Aramaic');
  const lxx = get('lxx-ego-eimi-ho-on-ex-3-14'), jn = get('ego-eimi-jn-8-58');
  if (lxx && jn && lxx.originalUnicode === jn.originalUnicode) errs.push('LXX Ex 3:14 conflated with Jn 8:58');
  const sab = get('yhwh-tsevaot-1sam-1-3');
  if (sab && /суббот/i.test(sab.literalGloss)) errs.push('Sabaoth glossed as sabbath');
  return errs;
}
