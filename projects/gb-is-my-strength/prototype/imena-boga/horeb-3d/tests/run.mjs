// Unit tests: node tests/run.mjs (compiles data+nav via tsc first, see npm script in README)
import { EXHIBITS, containsTetragrammaton, isOriginalVoiced } from '../.test-build/data/exhibits.js';
import { validateExhibits, RESEARCH_IDS_42 } from '../.test-build/data/validate.js';
import * as N from '../.test-build/engine/nav.js';
import { soundscapeMixAt } from '../.test-build/engine/soundscape.js';
import { choosePixelRatio, resetsAutoLowered } from '../.test-build/engine/quality.js';
import { PILOT_IDS, PILOT_LESSONS, normalizeLearningJournal, observeLesson, completeLesson, nextLearningLesson } from '../.test-build/data/learningJourney.js';
import { SITE_CLUES, SITE_CLUE_IDS, isSiteClueId, normalizeSiteClues, addSiteClue } from '../.test-build/data/siteClues.js';
import { EXPEDITION_EVIDENCE, EXPEDITION_CHRONOLOGY, EXPEDITION_CONTRAST, expeditionReady, normalizeExpeditionCompletion, canCompleteExpedition, completeExpedition } from '../.test-build/data/expedition.js';
import { FIELD_IDS, FIELD_STUDIES, normalizeFieldJournal, canCompleteFieldStudy, markFieldStudy } from '../.test-build/data/fieldStudies.js';
import { HERO_STUDIES, HERO_STUDY_IDS, heroStudyReady, canCompleteHeroStudy, normalizeHeroStudyJournal, markHeroStudy } from '../.test-build/data/heroStudies.js';
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
inj('El Elyon final nun replaced with final mem', c => { c.find(e => e.id === 'el-elyon').originalUnicode = 'אֵל עֶלְיוֹם'; });
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
// Learning-gate checks: game progress cannot make a theological assertion,
// bypass an unseen scene, or accept a wrong / tampered answer.
t('learning has eight distinct canonical hero IDs',
  PILOT_IDS.length === 8 && new Set(PILOT_IDS).size === 8 &&
  PILOT_IDS.every((id) => EXHIBITS.some((e) => e.id === id)));
t('each hero question has exactly one valid answer within three choices',
  PILOT_LESSONS.every((l) => l.options.length === 3 &&
    new Set(l.options.map((x) => x.id)).size === 3 &&
    l.options.some((c) => c.id === l.answer) &&
    l.question.length > 20 && l.explanation.length > 30));
const emptyStudy = normalizeLearningJournal(null);
t('study progress starts with zero observed and understood',
  emptyStudy.observed.length === 0 && emptyStudy.understood.length === 0);
t('cannot complete a lesson without first observing it',
  completeLesson(emptyStudy, 'elohim', 'b').understood.length === 0);
const observedStudy = observeLesson(emptyStudy, 'elohim');
t('wrong answer does not count and correct answer counts only observed',
  completeLesson(observedStudy, 'elohim', 'a').understood.length === 0 &&
  completeLesson(observedStudy, 'elohim', 'b').understood.includes('elohim'));
t('learning journal refuses forged IDs and completion without observation',
  JSON.stringify(normalizeLearningJournal({
    observed: ['yhwh','fake','yhwh'],
    understood: ['fake','elohim','yhwh','yhwh'],
  })) === JSON.stringify({ observed: ['yhwh'], understood: ['yhwh'] }));
t('next story advances after completion, free movement remains independent',
  nextLearningLesson(completeLesson(observedStudy, 'elohim', 'b'))?.id === 'el-elyon' &&
  nextLearningLesson(emptyStudy)?.id === 'elohim');
t('all eight stories can be learned without changing nav or source registry',
  PILOT_LESSONS.reduce((state, l) => completeLesson(observeLesson(state,l.id),l.id,l.answer),
    emptyStudy).understood.length === 8);
// Treat the Tetragrammaton as written-only even when embedded in a phrase:
// 12 existing records contain יהוה, only one has the exact id 'yhwh'.
const writtenNameRefs = EXHIBITS.filter((e) => containsTetragrammaton(e.originalUnicode));
t('all twelve written Tetragrammaton occurrences are identified',
  writtenNameRefs.length === 12 && writtenNameRefs.some((e) => e.id === 'yhwh') &&
  writtenNameRefs.some((e) => e.id === 'sabaoth'));
t('every source-language phrase containing יהוה is SILENT until an explicit policy revision',
  writtenNameRefs.every((e) => !isOriginalVoiced(e)));
t('names without the Tetragrammaton remain future phonetic-review candidates',
  EXHIBITS.filter((e) => !containsTetragrammaton(e.originalUnicode))
    .every((e) => isOriginalVoiced(e)));
t('vowel points and unpointed text match the same written-only policy',
  containsTetragrammaton('יְהוָה יִרְאֶה') &&
  containsTetragrammaton('יהוה') &&
  !containsTetragrammaton('אֶהְיֶה'));
// An observational game event must be authentic and idempotent, not a
// client-invented item, points system or route unlock.
t('seven 3D scene observations are canonical and tied to existing exhibits',
  SITE_CLUE_IDS.length === 7 && new Set(SITE_CLUE_IDS).size === 7 &&
  SITE_CLUE_IDS.every((id) => EXHIBITS.some((e) => e.id === SITE_CLUES[id].exhibitId)));
t('site observation normalizer discards unknown/prototype IDs and duplicates',
  JSON.stringify(normalizeSiteClues(['constructor','beersheba-well','bad','beersheba-well'])) ===
  JSON.stringify(['beersheba-well']) && !isSiteClueId('constructor'));
t('site observations record only known physical locations once',
  JSON.stringify(addSiteClue(addSiteClue([], 'hagar-spring'), 'hagar-spring')) ===
  JSON.stringify(['hagar-spring']) &&
  JSON.stringify(addSiteClue([], 'invalid')) === '[]');
t('site observations never imply an automatic educational completion',
  normalizeLearningJournal({ observed: [], understood: [] }).understood.length === 0 &&
  SITE_CLUES['beersheba-tamarisk'].reference === 'Быт. 21:33');
// The two new hero slices require actual spatial observations as distinct
// proof of attention, AND a source-grounded answer shared with FieldStudy.
// Completion booleans alone may not survive lost/forged observation journals.
const groveWitness = ['gethsemane-olive', 'gethsemane-prayer-stone'];
const jeremiahWitness = ['jeremiah-royal-sign', 'jeremiah-city-view'];
t('two hero studies reuse canonical source choices and seven physical meshes',
  HERO_STUDY_IDS.length === 2 && HERO_STUDIES.length === 2 &&
  HERO_STUDIES.every((study) => study.evidence.length === 2 &&
    study.evidence.every((id) => SITE_CLUE_IDS.includes(id)) &&
    FIELD_STUDIES.some((t) => t.id === study.id && t.correctAnswer)));
t('a hero study cannot pass without both sighted details',
  !heroStudyReady('abba', [groveWitness[0]]) &&
  !canCompleteHeroStudy('abba', [groveWitness[0]], true, true, 'b') &&
  !heroStudyReady('tsidkenu', [jeremiahWitness[0]]) &&
  !canCompleteHeroStudy('tsidkenu', [jeremiahWitness[0]], true, true, 'c'));
t('hero source conclusions fail closed when either text side is unopened',
  !canCompleteHeroStudy('abba', groveWitness, false, true, 'b') &&
  !canCompleteHeroStudy('abba', groveWitness, true, false, 'b') &&
  !canCompleteHeroStudy('tsidkenu', jeremiahWitness, false, false, 'c') &&
  markHeroStudy([], 'abba', groveWitness, true, false, 'b').length === 0 &&
  markHeroStudy([], 'tsidkenu', jeremiahWitness, false, true, 'c').length === 0);
t('Gethsemane and Jeremiah are two independently grounded interpretations',
  heroStudyReady('abba', groveWitness) && heroStudyReady('tsidkenu', jeremiahWitness) &&
  canCompleteHeroStudy('abba', groveWitness, true, true, 'b') &&
  !canCompleteHeroStudy('abba', groveWitness, true, true, 'c') &&
  canCompleteHeroStudy('tsidkenu', jeremiahWitness, true, true, 'c') &&
  !canCompleteHeroStudy('tsidkenu', jeremiahWitness, true, true, 'a') &&
  !canCompleteHeroStudy('abba', jeremiahWitness, true, true, 'b'));
t('hero records require verified physical clues after reload and reject invented IDs',
  JSON.stringify(markHeroStudy([], 'abba', groveWitness, true, true, 'b')) === '["abba"]' &&
  JSON.stringify(markHeroStudy([], 'tsidkenu', jeremiahWitness, true, true, 'c')) === '["tsidkenu"]' &&
  JSON.stringify(markHeroStudy([], 'fake', [...groveWitness, ...jeremiahWitness], true, true, 'b')) === '[]' &&
  normalizeHeroStudyJournal(['abba', 'abba', 'fake'], groveWitness).join('|') === 'abba' &&
  normalizeHeroStudyJournal(['abba', 'tsidkenu'], groveWitness).join('|') === 'abba' &&
  normalizeHeroStudyJournal(['abba'], []).length === 0 &&
  markHeroStudy(['abba'], 'tsidkenu', groveWitness, true, true, 'c').join('|') === 'abba');
// Four different source-analysis interactions (16 authored investigations).
const kindCounts = Object.fromEntries(['voices','named-object','parallel-witness','written-form']
  .map((kind) => [kind, FIELD_STUDIES.filter((task) => task.kind === kind).length]));
t('four distinct fieldwork methods have exactly four authored dossiers each',
  FIELD_STUDIES.length === 16 && Object.values(kindCounts).every((n) => n === 4));
t('all fieldwork IDs exist in canonical 42 and exclude the 8 hero quizzes',
  new Set(FIELD_IDS).size === 16 && FIELD_IDS.every((id) =>
    EXHIBITS.some((e) => e.id === id) && !PILOT_IDS.includes(id)));
t('all authored evidence prompts and cautions have meaningful content',
  FIELD_STUDIES.every((task) => task.prompt.length > 35 &&
    task.lensA.length > 30 && task.lensB.length > 30 && task.takeaway.length > 35));
t('object classification matches registry rather than a new inferred divine name',
  FIELD_STUDIES.filter((task) => task.kind === 'named-object').every((task) =>
    ['altar_name','place_name','city_name'].includes(EXHIBITS.find((e) => e.id === task.id).category)));
t('written language tasks use canonical source language rather than speculative phonetics',
  FIELD_STUDIES.filter((task) => task.kind === 'written-form').every((task) =>
    ['arc','grc'].includes(EXHIBITS.find((e) => e.id === task.id).sourceLanguage)));
t('fieldwork cannot complete before both evidence perspectives are inspected',
  !canCompleteFieldStudy('nissi', true, false, 'altar_name') &&
  !canCompleteFieldStudy('ego-eimi', false, true, null));
t('a false named object or false language cannot be recorded',
  !canCompleteFieldStudy('nissi', true, true, 'city_name') &&
  !canCompleteFieldStudy('atiq-yomin', true, true, 'grc') &&
  markFieldStudy([], 'nissi', true, true, 'city_name').length === 0);
t('correct source-grounded category and language allow a local study record',
  canCompleteFieldStudy('nissi', true, true, 'altar_name') &&
  canCompleteFieldStudy('atiq-yomin', true, true, 'arc') &&
  markFieldStudy([], 'nissi', true, true, 'altar_name').includes('nissi'));
t('voice and parallel context studies require a supported response, not clicks',
  !canCompleteFieldStudy('tsidkenu', true, true, null) &&
  !canCompleteFieldStudy('ego-eimi', true, true, null) &&
  !canCompleteFieldStudy('tsidkenu', true, true, 'b') &&
  !canCompleteFieldStudy('ego-eimi', true, true, 'a') &&
  canCompleteFieldStudy('tsidkenu', true, true, 'c') &&
  canCompleteFieldStudy('ego-eimi', true, true, 'b'));
t('all eight context studies have three distinct choices and one keyed answer',
  FIELD_STUDIES.filter((t) => t.kind === 'voices' || t.kind === 'parallel-witness').length === 8 &&
  FIELD_STUDIES.filter((t) => t.kind === 'voices' || t.kind === 'parallel-witness').every((t) =>
    t.answerOptions?.length === 3 &&
    new Set(t.answerOptions.map((o) => o.id)).size === 3 &&
    new Set(t.answerOptions.map((o) => o.label)).size === 3 &&
    t.answerOptions.every((o) => o.label.length > 20) &&
    t.answerOptions.some((o) => o.id === t.correctAnswer)));
t('wrong context evidence never updates journal',
  markFieldStudy([], 'tsur', true, true, null).length === 0 &&
  markFieldStudy([], 'tsur', true, true, 'a').length === 0 &&
  markFieldStudy([], 'tsur', true, true, 'b').includes('tsur'));
t('forged IDs duplicates and unknown journal keys remain excluded',
  JSON.stringify(normalizeFieldJournal(['constructor','nissi','nissi','fake'])) === JSON.stringify(['nissi']) &&
  !canCompleteFieldStudy('constructor', true, true, 'altar_name'));
// L7: a linked expedition requires three real spatial clues AND two
// independent source decisions. Merely opening dossier cards is not enough.
t('linked 3D expedition includes all and only the three canonical clues',
  EXPEDITION_EVIDENCE.length === 3 &&
  EXPEDITION_EVIDENCE.every((id) => SITE_CLUE_IDS.includes(id)) &&
  EXPEDITION_CHRONOLOGY.length === 3 && EXPEDITION_CONTRAST.length === 3);
t('linked expedition cannot complete from one or two observations',
  !expeditionReady(['beersheba-well', 'beersheba-tamarisk']) &&
  !canCompleteExpedition(['beersheba-well', 'beersheba-tamarisk'], 'b', 'c') &&
  !completeExpedition(false, ['beersheba-well', 'beersheba-tamarisk'], 'b', 'c'));
t('linked expedition refuses wrong chronology and false context conflation',
  !canCompleteExpedition(SITE_CLUE_IDS, 'c', 'c') &&
  !canCompleteExpedition(SITE_CLUE_IDS, 'b', 'a') &&
  !canCompleteExpedition(SITE_CLUE_IDS, null, 'c') &&
  !completeExpedition(false, SITE_CLUE_IDS, 'b', 'a'));
t('linked expedition persists only with all three canonical clues and both answers',
  expeditionReady(SITE_CLUE_IDS) &&
  canCompleteExpedition(SITE_CLUE_IDS, 'b', 'c') &&
  completeExpedition(false, SITE_CLUE_IDS, 'b', 'c') &&
  completeExpedition(true, SITE_CLUE_IDS, 'a', 'a') &&
  normalizeExpeditionCompletion(true, SITE_CLUE_IDS) &&
  !normalizeExpeditionCompletion('true', SITE_CLUE_IDS) &&
  !normalizeExpeditionCompletion({ completed: true }, SITE_CLUE_IDS));
t('linked expedition rejects forged completion without supporting observations',
  !normalizeExpeditionCompletion(true, []) &&
  !normalizeExpeditionCompletion(true, ['hagar-spring']) &&
  !normalizeExpeditionCompletion(true, ['hagar-spring', 'beersheba-well']) &&
  !normalizeExpeditionCompletion(true, ['fake', 'hagar-spring', 'beersheba-well']) &&
  !completeExpedition(true, [], 'a', 'a') &&
  !completeExpedition(true, ['beersheba-well', 'hagar-spring'], 'a', 'a'));
// D3 acoustic dramaturgy: the zone-six passage is ACTUALLY quieter than
// the preceding gallery, fades in both directions and has no zone boundary
// gain spike. Sound is synthesized only and optional; no spoken divine cues.
const galleryAudio = soundscapeMixAt(-265, 5);
const middleAudio = soundscapeMixAt(-305, 6);
const outsideAudio = soundscapeMixAt(-342, 7);
t('zone-six passage is acoustically quieter than adjacent gallery and outdoors',
  middleAudio.windBed < galleryAudio.windBed * 0.27 &&
  middleAudio.windBed < outsideAudio.windBed * 0.2 &&
  middleAudio.hush < 0.25 &&
  Math.abs(outsideAudio.windBed - 0.11) < 1e-9);
t('acoustic transition never jumps across zone-5/6 or zone-6/7 boundaries',
  Math.abs(soundscapeMixAt(-288.0001, 6).windBed -
    soundscapeMixAt(-287.9999, 5).windBed) < 0.0001 &&
  Math.abs(soundscapeMixAt(-318.0001, 7).windBed -
    soundscapeMixAt(-317.9999, 6).windBed) < 0.0001 &&
  Math.abs(soundscapeMixAt(-318.0001, 7).windCutoff -
    soundscapeMixAt(-317.9999, 6).windCutoff) < 0.01);
t('quiet passage fade is bounded, reversible and does not alter zone-four acoustics',
  Array.from({ length: 561 }, (_, i) => -280 - i * 0.1).every((z) => {
    const a = soundscapeMixAt(z, N.zoneAt(z));
    const b = soundscapeMixAt(z - 0.1, N.zoneAt(z - 0.1));
    return a.hush >= 0.18 - 1e-9 && a.hush <= 1 &&
      Math.abs(a.windBed - b.windBed) < 0.004 &&
      a.windBed >= 0 && a.windBed <= 0.11;
  }) &&
  soundscapeMixAt(-195, 4).windCutoff === 180 &&
  soundscapeMixAt(N.ZONE_SPAWN[5].z, 5).windBed >
    soundscapeMixAt(N.ZONE_SPAWN[6].z, 6).windBed &&
  soundscapeMixAt(N.ZONE_SPAWN[7].z, 7).windBed >
    soundscapeMixAt(N.ZONE_SPAWN[6].z, 6).windBed);
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

// Regression: exact-centre collider contacts must not skip displacement.
// This happens when a spawn/teleport or a rare frame lands on a prop anchor.
const propCollider = { x: 5, z: -100, r: 0.85 };
const pushedCentre = N.separateObstacle(5, -100, 0, -100, propCollider);
t('exact obstacle centre is pushed outside physical player radius',
  Math.hypot(pushedCentre.x - propCollider.x, pushedCentre.z - propCollider.z) >= 1.2 - 1e-6 && pushedCentre.x < 5);
const centredWithoutHistory = N.separateObstacle(-5, -100, -5, -100, { x: -5, z: -100, r: 0.85 });
t('zero normal uses a deterministic corridor-facing escape',
  centredWithoutHistory.x > -5 && Math.hypot(centredWithoutHistory.x + 5, centredWithoutHistory.z + 100) >= 1.2 - 1e-6);
let propContactSafe = true;
for (let a = 0; a < 720; a++) {
  const angle = a * Math.PI * 2 / 720;
  for (const radius of [0, 0.05, 0.7, 1.0, 1.2, 1.5]) {
    const x = 5 + Math.cos(angle) * radius, z = -100 + Math.sin(angle) * radius;
    const out = N.separateObstacle(x, z, 0, -100, propCollider);
    if (Math.hypot(out.x - 5, out.z + 100) < 1.2 - 1e-6) propContactSafe = false;
  }
}
t('single-obstacle collision displaces every interior contact', propContactSafe);
const outside = N.separateObstacle(6.8, -100, 0, -100, propCollider);
t('separation does not alter a safe position', outside.x === 6.8 && outside.z === -100);

// Auto-FPS downgrade is sticky during unrelated settings edits, but reversible
// when the user explicitly switches between graphics quality modes.
t('high-DPR graphics use a capped ratio', choosePixelRatio('high', 3, false) === 2);
t('low quality and FPS downgrade use at most native 1x',
  choosePixelRatio('low', 3, false) === 1 && choosePixelRatio('high', 3, true) === 1);
t('fractional DPR and non-finite DPR remain safe',
  choosePixelRatio('high', 0.8, true) === 0.8 && choosePixelRatio('high', NaN, false) === 1);
const autoState = { quality: 'high', autoQuality: true };
t('changing volume/brightness does not reset FPS resolution downgrade',
  !resetsAutoLowered(autoState, { ...autoState }));
t('changing manual/automatic quality resets FPS downgrade',
  resetsAutoLowered(autoState, { quality: 'high', autoQuality: false }) &&
  resetsAutoLowered(autoState, { quality: 'low', autoQuality: true }));

console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail ? 1 : 0);
