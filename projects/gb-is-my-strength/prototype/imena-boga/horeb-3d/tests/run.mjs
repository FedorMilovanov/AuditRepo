// Unit tests: node tests/run.mjs (compiles data+nav via tsc first, see npm script in README)
import { EXHIBITS } from '../.test-build/data/exhibits.js';
import { validateExhibits, RESEARCH_IDS_42 } from '../.test-build/data/validate.js';
import * as N from '../.test-build/engine/nav.js';
let pass = 0, fail = 0;
const t = (name, ok) => { ok ? pass++ : fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name); };
const errs = validateExhibits(EXHIBITS);
if (errs.length) console.log(errs.join('\n'));
t('registry passes editorial invariants', errs.length === 0);
// E1 COVERAGE — exactly the 42 Research IDs, no misses, no extras.
const ids = new Set(EXHIBITS.map((e) => e.id));
t('E1 exactly 42 exhibits', EXHIBITS.length === 42);
t('E1 all 42 Research IDs present', RESEARCH_IDS_42.every((id) => ids.has(id)));
t('E1 no extra IDs', [...ids].every((id) => RESEARCH_IDS_42.includes(id)));
// E2 STORY-SPECIFIC — every scene has >=2 anchor props + unique signature.
t('E2 every exhibit has >=2 anchor props', EXHIBITS.every((e) => e.anchorProps.length >= 2));
const sig = new Set(EXHIBITS.map((e) => `${e.environmentKey}::${e.meaningfulAction}`));
t('E2 all 42 scene signatures unique', sig.size === 42);
// E3 SEMANTIC TRUTH — deliberately injected defects MUST be caught.
const clone = () => JSON.parse(JSON.stringify(EXHIBITS));
const inj = (name, mut) => { const c = clone(); mut(c); t('detects: ' + name, validateExhibits(c).length > 0); };
inj('altar -> personal name', c => { c.find(e => e.id === 'nissi').category = 'personal_divine_name'; });
inj('place -> divine title', c => { c.find(e => e.id === 'yireh').category = 'divine_title'; });
inj('city -> personal name', c => { c.find(e => e.id === 'shammah').category = 'personal_divine_name'; });
inj('El Roi root swapped to רעה', c => { c.find(e => e.id === 'el-roi').originalUnicode = 'אֵל רֹעִי'; });
inj('Daniel marked Hebrew', c => { c.find(e => e.id === 'atiq-yomin').sourceLanguage = 'he'; });
inj('El Hay preposition stripped', c => { c.find(e => e.id === 'el-hay').originalUnicode = 'אֵל חָי'; });
inj('XSS in field', c => { c[0].interpretiveNotes = '<img src=x onerror=alert(1)>'; });
inj('bidi control', c => { c[0].originalUnicode = 'אֱלֹהִים\u202E'; });
inj('NFD Hebrew', c => { c[0].originalUnicode = 'ש\u05C1\u05BC'; });
inj('LXX = Jn 8:58 conflated', c => { c.find(e => e.id === 'ehyeh').originalUnicode = 'ἐγὼ εἰμί'; });
inj('published state', c => { c[0].publicationState = 'PUBLISHED'; });
inj('Sabaoth=sabbath', c => { c.find(e => e.id === 'sabaoth').literalGloss = 'от субботы'; });
inj('missing Research id', c => { c.splice(0, 1); });
inj('duplicate scene signature', c => { c[1].environmentKey = c[0].environmentKey; c[1].meaningfulAction = c[0].meaningfulAction; });
inj('empty anchor props', c => { c[2].anchorProps = ['stele']; });
// Navigation / sandals gate
let p = { x: 0, z: -330 }, blocked = false;
for (let i = 0; i < 400; i++) { const r = N.constrain(p.x, p.z - 0.1, true); p = r; if (r.block === 'outer') blocked = true; }
t('shod walk stops at outer radius', blocked && N.distToBush(p.x, p.z) >= N.R_OUTER - 1e-6);
let minD = 1e9;
for (let a = 0; a < 720; a++) { const ang = a / 720 * Math.PI * 2; for (const rr of [0, 3, 8, 13]) {
  const r = N.constrain(N.BUSH.x + Math.cos(ang) * rr, N.BUSH.z + Math.sin(ang) * rr, true); minD = Math.min(minD, N.distToBush(r.x, r.z)); } }
t('shod: no position inside outer radius from any angle', minD >= N.R_OUTER - 1e-6);
minD = 1e9;
for (let a = 0; a < 720; a++) { const ang = a / 720 * Math.PI * 2; for (const rr of [0, 1, 4, 6]) {
  const r = N.constrain(N.BUSH.x + Math.cos(ang) * rr, N.BUSH.z + Math.sin(ang) * rr, false); minD = Math.min(minD, N.distToBush(r.x, r.z)); } }
t('unshod: inner boundary never crossed', minD >= N.R_INNER - 1e-6);
const big = N.constrain(0, -366, false); t('exact center pushed out (unshod)', N.distToBush(big.x, big.z) >= N.R_INNER - 1e-6);
t('sanitizeSpawn on bush center -> outside outer', N.distToBush(N.sanitizeSpawn({ x: 0, z: -366 }).x, N.sanitizeSpawn({ x: 0, z: -366 }).z) >= N.R_OUTER - 1e-6);
t('sanitizeSpawn NaN -> start', N.sanitizeSpawn({ x: NaN, z: 1 }).z === N.START.z);
let wallOk = true;
for (let z = 2; z > -318; z -= 0.37) for (const x of [-40, 40]) { const r = N.constrain(x, z, true); if (Math.abs(r.x) > N.halfWidth(r.z)) wallOk = false; }
t('walls clamp at all z (angled entries)', wallOk);
t('chasm ledge enforced', N.constrain(10, -200, true).x <= N.LEDGE_X);
// The old step-function ledge snapped x by several metres at z=-176.
let previous = N.constrain(10, -175.9, true), largestJump = 0;
for (let z = -175.91; z > -182; z -= 0.01) {
  const current = N.constrain(previous.x, z, true);
  largestJump = Math.max(largestJump, Math.hypot(current.x - previous.x, current.z - previous.z));
  previous = current;
}
t('chasm entrance cannot teleport player sideways', largestJump < 0.06, `largest jump=${largestJump.toFixed(4)}`);
t('chasm geometry and collision use same taper', N.chasmFactor(-181) === 1 && N.chasmFactor(-176) === 0 && N.chasmFactor(-224) === 0);
// Walk along the centreline at walking-sized steps, then come back without a zone jump.
let journey = { ...N.START }, seen = new Set([N.zoneAt(journey.z)]), journeySafe = true;
for (const direction of [-1, 1]) {
  const target = direction < 0 ? -352 : N.START.z;
  for (let i = 0; i < 4000 && Math.abs(journey.z - target) > 0.03; i++) {
    const next = N.constrain(journey.x, journey.z + Math.sign(target - journey.z) * Math.min(0.08, Math.abs(target - journey.z)), true);
    if (Math.abs(next.z - journey.z) > 0.09 || N.distToBush(next.x, next.z) < N.R_OUTER - 1e-6) journeySafe = false;
    journey = next;
    seen.add(N.zoneAt(journey.z));
  }
}
t('continuous axial route reaches every zone and returns safely', journeySafe && seen.size === 8 && Math.abs(journey.z - N.START.z) < 0.03, `zones=${[...seen]}`);
t('non-finite coordinates fail closed', N.constrain(Infinity, -366, false).z === N.START.z && N.constrain(NaN, NaN, true).z === N.START.z);
console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
