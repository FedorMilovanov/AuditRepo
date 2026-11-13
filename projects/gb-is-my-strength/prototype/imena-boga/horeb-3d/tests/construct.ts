// Source for the headless construction smoke test. Bundled with esbuild
// (which resolves extensionless TS imports) and run in Node.
import * as THREE from 'three';
import { EXHIBITS } from '../src/imena-boga-horeb-3d/data/exhibits';
import { RUSSIAN_DRAFT_CUES } from '../src/imena-boga-horeb-3d/data/russianCues';
import { readFileSync } from 'node:fs';
import { buildExhibitProps, mergePropsGroup, OLIVE_GROVE_OFFSETS, BEERSHEBA_WELL_COLLIDER_RADIUS } from '../src/imena-boga-horeb-3d/engine/exhibitProps';
import { steleVariation, TUNNEL_END, LEDGE_X } from '../src/imena-boga-horeb-3d/engine/nav';
import { buildBurningBush } from '../src/imena-boga-horeb-3d/engine/BurningBush';
import { BEACON_IDS, beaconOpacity, beaconVisualScale, beaconViewFactor } from '../src/imena-boga-horeb-3d/engine/NameBeacon';
import { ACOUSTIC, isApprovedAudioPath, APPROVED_NARRATION_ASSETS, narrationOffsets, isApprovedAudioTrack, matchesAudioSha256 } from '../src/imena-boga-horeb-3d/engine/NarratorBus';
import { narrationPlan, APPROVED_BILINGUAL_CUES, NARRATION_LANGUAGE_LABEL } from '../src/imena-boga-horeb-3d/data/narrationPlan';
import { normalizeStudyBookmarks, toggleStudyBookmark } from '../src/imena-boga-horeb-3d/data/studyBookmarks';
import { caveSurfaceVariation } from '../src/imena-boga-horeb-3d/engine/procedural';
import { buildZones, PLACEMENTS, exitVaultRelief, ravineStrataReflectance, ravineMetricUvWeight, opposingRavineRelief, opposingRavineDrop } from '../src/imena-boga-horeb-3d/engine/SceneZones';

let pass = 0, fail = 0;
const t = (name: string, ok: boolean) => { ok ? pass++ : fail++; console.log((ok ? 'PASS ' : 'FAIL ') + name); };

let totalHigh = 0, totalLow = 0;
const errors: string[] = [];
for (const e of EXHIBITS) {
  try {
    const hi = buildExhibitProps(e, false, 0, 0);
    const lo = buildExhibitProps(e, true, 0, 0);
    let hc = 0, lc = 0;
    hi.traverse((o: { isMesh?: boolean }) => { if (o.isMesh) hc++; });
    lo.traverse((o: { isMesh?: boolean }) => { if (o.isMesh) lc++; });
    totalHigh += hc; totalLow += lc;
    t(`props[${e.id}] env=${e.environmentKey} high=${hc} low=${lc}`, hc > 0 && lc > 0);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(`${e.id}: ${msg}`);
    t(`props[${e.id}] build threw: ${msg}`, false);
  }
}
console.log(`\ntotal prop meshes: high=${totalHigh} low=${totalLow}`);

// The new light-based name hierarchy is a small pilot, not forty-two
// giant supernatural billboards. All original script comes from the registry.
t('8 pilot name beacons have unique canonical exhibit IDs',
  BEACON_IDS.length === 8 && new Set(BEACON_IDS).size === 8 &&
  BEACON_IDS.every((id) => EXHIBITS.some((e) => e.id === id)));
t('name beacon is legible at 24m but not drawn past 35m',
  beaconOpacity(24) > 0.3 && beaconOpacity(35) === 0 &&
  beaconOpacity(Infinity) === 0);
t('dark Horeb beacons stay below 55% brightness',
  beaconOpacity(9, true) <= 0.54 && beaconOpacity(9, true) > 0.5 &&
  beaconOpacity(9, false) > beaconOpacity(9, true));
t('name beacons stay compact close up and grow for distant recognition',
  beaconVisualScale(2) < 0.72 && beaconVisualScale(24) > 1.1 &&
  beaconVisualScale(NaN) < 0.72);
t('head-on original script remains visible at 8m on desktop',
  beaconViewFactor(8, 0, 0.81) > 0.9);
t('side inscription fades before desktop frame cuts through its letters',
  beaconViewFactor(8, 0.70, 0.81) === 0 &&
  beaconViewFactor(15, 0.3, 0.81) > 0.9);
t('portrait mobile culls side inscriptions but preserves centered farther names',
  beaconViewFactor(12, 0.5, 0.30) === 0 &&
  beaconViewFactor(15, 0, 0.30) > 0.5);
t('invalid camera angles fail closed', beaconViewFactor(NaN, 0, 0.81) === 0 &&
  beaconViewFactor(8, Infinity, 0.81) === 0);

// A professional narrator requires human-owned, reviewed source recordings.
// The DSP chain may exist in the lab without ever automatically inventing a
// divine voice or fetching arbitrary external audio.
t('three narrator spaces have physically bounded wet/dry preview profiles',
  Object.keys(ACOUSTIC).length === 3 &&
  Object.values(ACOUSTIC).every((p) => p.dry > p.wet && p.wet <= 0.2 && p.tail > 0));
t('narrator cannot play unreviewed, remote or traversal audio',
  Object.keys(APPROVED_NARRATION_ASSETS).length === 0 &&
  !isApprovedAudioPath('/audio/narration/elohim.mp3') &&
  !isApprovedAudioPath('https://unknown.example/speech.mp3') &&
  !isApprovedAudioPath('/audio/narration/../../other.mp3'));

// Zone 1's original-script label was hidden by a large foreground rock.
// The reconstructed boulder now sits behind the witness for a clear approach.
const creation = EXHIBITS.find((e) => e.environmentKey === 'creation-horizon');
const creationGroup = creation && buildExhibitProps(creation, false, 0, 0);
const creationRock = creationGroup?.getObjectByName('scenic-boulder');
t('creation landmark rock stays behind the Elōhîm label sightline',
  !!creationRock && creationRock.position.z <= -2.5);
t('creation rock is a low background shelf, not an oversized spherical prop',
  !!creationRock && creationRock.scale.y < 0.8 && creationRock.scale.x > creationRock.scale.y);

// Bookmarks are source references, not invented RPG progress or remote data.
const firstId = EXHIBITS[0].id, secondId = EXHIBITS[1].id;
t('study bookmark loader discards poisoned and unknown IDs without duplicates',
  normalizeStudyBookmarks(['bad-id', firstId, firstId, {}, '__proto__']).length === 1);
t('study bookmarks keep canonical ledger order even when added backwards',
  normalizeStudyBookmarks([secondId, firstId]).join('|') === [firstId, secondId].join('|'));
t('study bookmarks toggle exactly one canonical dossier and reject unknown IDs',
  toggleStudyBookmark([firstId], firstId).length === 0 &&
  toggleStudyBookmark([firstId], secondId).length === 2 &&
  toggleStudyBookmark([firstId], 'fake-id').join('|') === firstId);
t('bookmarks loader handles invalid storage values and excessive arrays',
  normalizeStudyBookmarks(null).length === 0 &&
  normalizeStudyBookmarks({ length: 42 }).length === 0 &&
  normalizeStudyBookmarks(Array(10000).fill('bad-id')).length === 0);

// No repetitive stone: 42 steles must not be identical — varied scale/tilt/zone-tint.
const scales = new Set(EXHIBITS.map((e) => steleVariation(e.id, e.zone).scale.toFixed(3)));
const tilts = new Set(EXHIBITS.map((e) => steleVariation(e.id, e.zone).tilt.toFixed(3)));
const labels = new Set(EXHIBITS.map((e) => steleVariation(e.id, e.zone).labelScale.toFixed(3)));
const tints = new Set(EXHIBITS.map((e) => steleVariation('__zone_' + e.zone, e.zone).tint));
t(`steles vary in scale (${scales.size} unique)`, scales.size >= 30);
t(`steles vary in tilt (${tilts.size} unique)`, tilts.size >= 30);
t(`labels vary in scale (${labels.size} unique)`, labels.size >= 30);
t(`zone tints vary (${tints.size} unique)`, tints.size >= 3);
// determinism: same id → same variation
const v1 = steleVariation('elohim', 1);
const v2 = steleVariation('elohim', 1);
t('steleVariation is deterministic', v1.scale === v2.scale && v1.tilt === v2.tilt && v1.tint === v2.tint);

// Merge test: mergePropsGroup should reduce mesh count overall.
// Some exhibits may not merge (incompatible attributes or single mesh) — that's fine.
let mergeTotalBefore = 0, mergeTotalAfter = 0;
for (const e of EXHIBITS) {
  const g = buildExhibitProps(e, false, 0, 0);
  let before = 0;
  g.traverse((o: { isMesh?: boolean }) => { if (o.isMesh) before++; });
  mergePropsGroup(g);
  let after = 0;
  g.traverse((o: { isMesh?: boolean }) => { if (o.isMesh) after++; });
  mergeTotalBefore += before;
  mergeTotalAfter += after;
}
const mergeReduction = Math.round((1 - mergeTotalAfter / mergeTotalBefore) * 100);
t(`mergePropsGroup reduces meshes overall (${mergeTotalBefore}→${mergeTotalAfter}, ${mergeReduction}% reduction)`, mergeReduction > 30);

// Geometry optimization regression: compare actual 3D bounding boxes before/after merge.
// Box3.setFromObject uses a conservative, inflated bounding box for ROTATED
// meshes. After merge, the geometry has rotated vertices baked in, so that
// approximate box is not comparable. Compare the actual transformed vertices.
function vertexBounds(group: THREE.Group): THREE.Box3 {
  group.updateMatrixWorld(true);
  const box = new THREE.Box3();
  const point = new THREE.Vector3();
  group.traverse((o) => {
    if (!(o instanceof THREE.Mesh) || !(o.geometry instanceof THREE.BufferGeometry)) return;
    const position = o.geometry.getAttribute('position');
    if (!position) return;
    for (let i = 0; i < position.count; i++) {
      point.fromBufferAttribute(position, i).applyMatrix4(o.matrixWorld);
      box.expandByPoint(point);
    }
  });
  return box;
}
const displaced: string[] = [];
for (const e of EXHIBITS) {
  const group = buildExhibitProps(e, false, 0, 0);
  const before = vertexBounds(group);
  mergePropsGroup(group);
  const after = vertexBounds(group);
  if (before.isEmpty() || after.isEmpty() ||
      !Number.isFinite(before.min.x) || !Number.isFinite(after.max.z) ||
      before.min.distanceTo(after.min) > 0.001 ||
      before.max.distanceTo(after.max) > 0.001) displaced.push(e.id);
}
t('geometry merge preserves bounding boxes of all 42 scenes', displaced.length === 0);
if (displaced.length) console.log('Displaced scene props: ' + displaced.join(', '));

// Runtime can reuse the exact tunnel stone atlas with no additional GPU textures.
const testAtlas = new THREE.DataTexture(new Uint8Array([180, 155, 130, 255]), 1, 1);
const texturedProps = buildExhibitProps(EXHIBITS[0], false, 0, 0, { map: testAtlas, bump: testAtlas });
let texturedStones = 0;
texturedProps.traverse((o) => {
  if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshStandardMaterial &&
      o.material.map === testAtlas && o.material.bumpMap === testAtlas) texturedStones++;
});
t('3D stone props reuse the shared world rock atlas', texturedStones > 0);
// Without a shared alpha map, SpriteMaterial draws a solid translucent square
// in front of each exhibit rather than a soft radial glow.
const testGlow = new THREE.DataTexture(new Uint8Array([255, 255, 255, 0]), 1, 1);
let maskedGlows = 0;
for (const e of EXHIBITS) {
  const group = buildExhibitProps(e, false, 0, 0, { map: testAtlas, bump: testAtlas, glow: testGlow });
  group.traverse((o) => {
    if (o instanceof THREE.Sprite && o.material instanceof THREE.SpriteMaterial && o.material.map === testGlow) maskedGlows++;
  });
}
t('all 42 exhibit glow sprites share a non-square alpha mask', maskedGlows === 42);
testGlow.dispose();
testAtlas.dispose();

// The Horeb shrub must be alive and not consumed by animation. Keep the
// foliage static and inexpensive, while the flame has its own GPU points.
for (const low of [true, false]) {
  const bush = buildBurningBush(low);
  const mode = low ? 'low' : 'high';
  t('Horeb ' + mode + ': living foliage uses one instanced draw call',
    bush.foliage instanceof THREE.InstancedMesh &&
    bush.group.children.filter((o) => o === bush.foliage).length === 1 &&
    bush.foliage.count >= 32 && !!bush.foliage.instanceColor);
  const leafMatrixBefore = bush.foliage.instanceMatrix.array.slice();
  bush.update(12.5, true, 900);
  bush.update(21, false, 900);
  t('Horeb ' + mode + ': flame does not consume, move or regenerate leaves',
    leafMatrixBefore.every((v, i) => v === bush.foliage.instanceMatrix.array[i]) &&
    bush.fire instanceof THREE.Points && bush.sparks instanceof THREE.Points);
  t('Horeb ' + mode + ': flame and shrub remain inside the same scene',
    bush.group.children.includes(bush.fire) && bush.group.children.includes(bush.foliage));
  const soil = bush.group.getObjectByName('bush-soil-base');
  t('Horeb ' + mode + ': small natural soil base, no stage-like pedestal',
    !!soil && soil.scale.x <= 0.8 && soil.scale.y <= 0.1 && soil.scale.z <= 0.8);
}


// Real recorded masters must play in order, never overlap or repeat.
t('bilingual playback schedules original, pause and then Russian voice',
  JSON.stringify(narrationOffsets([1.25, 2.5])) === '[0,1.8]' &&
  JSON.stringify(narrationOffsets([5])) === '[0]');
t('bilingual playback rejects missing, invalid or more-than-two clips',
  narrationOffsets([]) === null && narrationOffsets([1, 2, 3]) === null &&
  narrationOffsets([0, 2]) === null && narrationOffsets([Infinity]) === null &&
  narrationOffsets([1, 2], 0) === null && narrationOffsets([1, 2], 8) === null);
t('narrator rejects absent SHA, unsigned paths and arbitrary external tracks',
  !isApprovedAudioTrack({ path: '/audio/narration/elohim.mp3', sha256: '' }) &&
  !isApprovedAudioTrack({ path: '/audio/narration/elohim.mp3', sha256: '1'.repeat(64) }) &&
  !isApprovedAudioTrack({ path: 'https://not-approved.example/test.mp3', sha256: '1'.repeat(64) }));
const knownBytes = new TextEncoder().encode('abc').buffer as ArrayBuffer;
t('signed narration verifies downloaded SHA-256 and rejects modified bytes',
  await matchesAudioSha256(knownBytes, 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad') &&
  !(await matchesAudioSha256(knownBytes, '0'.repeat(64))) &&
  !(await matchesAudioSha256(new TextEncoder().encode('abd').buffer as ArrayBuffer,
    'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')));

// The editorial matrix is the canonical source; runtime and no-JS must not
// gain a separate, drifting corpus or auto-generated unreviewed Russian lines.
const sourceRows = readFileSync('audit/HOREB_SCENE_MATRIX_42_V1.md', 'utf8')
  .split('\n').filter((line) => /^\|\s*\d{2}\s*·\s*`/.test(line));
const sceneDrafts = sourceRows.map((row) => {
  const parts = row.split('|');
  const id = parts[1]?.match(/`([a-z0-9-]+)`/)?.[1];
  let cue = parts[5]?.trim();
  if (cue?.startsWith('«') && cue.endsWith('»')) cue = cue.slice(1, -1);
  return { id, cue };
});
t('all 42 Russian voice drafts come from canonical exhibit matrix with no duplicate IDs',
  sourceRows.length === 42 &&
  Object.keys(RUSSIAN_DRAFT_CUES).length === 42 &&
  sceneDrafts.every((item, i) => item.id === EXHIBITS[i].id &&
    RUSSIAN_DRAFT_CUES[item.id ?? ''] === item.cue));
t('all 42 bilingual plans show a genuine Russian editorial draft but remain HOLD',
  EXHIBITS.every((exhibit) => {
    const p = narrationPlan(exhibit);
    return !!p.russianDraft && p.russianDraft === RUSSIAN_DRAFT_CUES[exhibit.id] &&
      p.status === 'HOLD' && p.playback.length === 0;
  }));

// 42 bilingual stages are metadata, not fabricated Hebrew or auto-TTS.
// Language follows the actual source (Hebrew / Aramaic / Greek), including
// Greek-script transcriptions of Aramaic such as abba, pending human review.
const voicePlans = EXHIBITS.map((e) => narrationPlan(e));
t('all 42 original-language → Russian narrator plans derive from canonical exhibits',
  voicePlans.length === 42 && new Set(voicePlans.map((p) => p.exhibitId)).size === 42 &&
  voicePlans.every((p, i) => p.originalUnicode === EXHIBITS[i].originalUnicode &&
    p.sourceLanguage === EXHIBITS[i].sourceLanguage &&
    !!NARRATION_LANGUAGE_LABEL[p.sourceLanguage]));
t('unreviewed voice is fail-closed: no Hebrew, Aramaic, Greek or Russian playback',
  Object.keys(APPROVED_BILINGUAL_CUES).length === 0 &&
  voicePlans.every((p) => p.status === 'HOLD' && !p.ready && p.playback.length === 0));
t('Tetragrammaton is written only; no speculative original-language spoken track',
  voicePlans.find((p) => p.exhibitId === 'yhwh')?.originalSpoken === false &&
  voicePlans.find((p) => p.exhibitId === 'yhwh')?.order === 'written-original-then-russian');
t('Aramaic and Greek exhibits retain their own languages, never silently Hebrew',
  voicePlans.some((p) => p.sourceLanguage === 'arc' && p.originalSpoken) &&
  voicePlans.some((p) => p.sourceLanguage === 'grc' && p.originalSpoken) &&
  voicePlans.find((p) => p.exhibitId === 'abba')?.sourceLanguage === 'grc');
t('unverified external exhibit or arbitrary Russian draft cannot authorize playback',
  !narrationPlan({ ...EXHIBITS[0], originalUnicode: 'FAKE' }, 'Russian approved').ready &&
  !narrationPlan(EXHIBITS[0], 'Russian draft').ready);

// Well joints must be geometrically recessed; visual contrast cannot rely
// solely on different tan rectangles blending into a cylinder silhouette.
const wellToAudit = EXHIBITS.find((e) => e.environmentKey === 'beersheba-well');
if (wellToAudit) {
  const constructed = buildExhibitProps(wellToAudit, true, 0, 0);
  const mortar = constructed.getObjectByName('well-recessed-mortar');
  let stones = 0;
  const materials = new Set<THREE.Material>();
  constructed.traverse((o) => {
    if (o.name !== 'well-course-stone' || !(o instanceof THREE.Mesh)) return;
    stones++;
    materials.add(o.material as THREE.Material);
  });
  t('Beersheba masonry exposes genuinely recessed dark joint backing',
    mortar instanceof THREE.Mesh &&
    mortar.geometry instanceof THREE.CylinderGeometry &&
    mortar.geometry.parameters.openEnded === true &&
    mortar.geometry.parameters.radiusTop > 1.20 &&
    mortar.geometry.parameters.radiusTop < 1.23 &&
    mortar.material instanceof THREE.MeshStandardMaterial &&
    mortar.material.color.getHex() === 0x4b4037 && stones === 42);
  t('Beersheba courses use authored separate limestone tones instead of one painted barrel',
    materials.size === 3 && stones === 42);
  let ringPieces = 0, nonRadial = 0;
  const layers = new Map<number, Array<{ start: number; end: number; bottom: number; top: number }>>();
  constructed.traverse((o) => {
    if (!(o instanceof THREE.Mesh) ||
        !['well-course-stone', 'well-rim-stone'].includes(o.name)) return;
    ringPieces++;
    const bond = o.userData.wellBond as {
      layer: number; start: number; end: number;
      inner: number; outer: number; bottom: number; top: number;
    } | undefined;
    if (!bond || !(o.geometry instanceof THREE.ExtrudeGeometry) ||
        bond.inner <= 1.05 || bond.outer >= BEERSHEBA_WELL_COLLIDER_RADIUS ||
        bond.end <= bond.start || bond.end - bond.start > Math.PI * 2 / 14 ||
        bond.top <= bond.bottom) {
      nonRadial++; return;
    }
    const pieces = layers.get(bond.layer) ?? [];
    pieces.push(bond);
    layers.set(bond.layer, pieces);
  });
  const coursesBonded = [0, 1, 2, 3].every((layer) => {
    const pieces = (layers.get(layer) ?? []).sort((a, b) => a.start - b.start);
    return pieces.length === 14 &&
      pieces.every((v, i) => i === pieces.length - 1 ||
        pieces[i + 1].start - v.end >= 0.020);
  });
  t('Beersheba physically fitted annular wedges, 14 per layer, have recessed radial joints',
    ringPieces === 56 && nonRadial === 0 && coursesBonded);
  const lower = layers.get(0) ?? [], upper = layers.get(1) ?? [];
  t('Beersheba masonry has three genuine horizontal mortar bands and staggered stone joints',
    lower.length === 14 && upper.length === 14 &&
    upper[0].start - lower[0].start > 0.15 &&
    [0, 1, 2].every((layer) => {
      const below = layers.get(layer)?.[0], above = layers.get(layer + 1)?.[0];
      return !!below && !!above && above.bottom > below.top + 0.005;
    }));
}

// Zone 5 used to display four identical green-ball olive trees. Ensure
// Gethsemane now has multiple, individually positioned crown lobes per tree.
const gardenRecord = EXHIBITS.find((e) => e.environmentKey === 'gethsemane-garden');
if (gardenRecord) {
  const garden = buildExhibitProps(gardenRecord, false, 0, 0);
  const trunkHeights: number[] = [];
  garden.traverse((obj) => {
    if (obj.name === 'olive-main-trunk' && obj instanceof THREE.Mesh &&
        obj.geometry instanceof THREE.CylinderGeometry)
      trunkHeights.push(obj.geometry.parameters.height);
  });
  t('Gethsemane four trees have deliberately different age-scale silhouettes',
    trunkHeights.length === 4 && new Set(trunkHeights.map((h) => h.toFixed(2))).size === 4 &&
    Math.max(...trunkHeights) - Math.min(...trunkHeights) >= 0.25);
  const prayerStone = garden.getObjectByName('gethsemane-prayer-stone');
  t('Gethsemane prayer viewpoint is a natural low irregular stone, not an altar box',
    prayerStone instanceof THREE.Mesh &&
    prayerStone.geometry instanceof THREE.DodecahedronGeometry &&
    prayerStone.scale.y < 0.35 && prayerStone.position.y < 0.2);
  let oliveLobes = 0;
  garden.traverse((o) => { if (o.name === 'olive-crown-lobe') oliveLobes++; });
  t('Gethsemane grove uses irregular multi-lobed olive crowns, not four spheres', oliveLobes >= 28);
  const leafSprigs = (group: THREE.Group) => {
    let count = 0;
    group.traverse((o) => { if (o.name === 'olive-leaf-sprig') count++; });
    return count;
  };
  const low = buildExhibitProps(gardenRecord, true, 0, 0);
  t('Gethsemane grove has individually shaped olive leaf sprigs in low mode',
    leafSprigs(low) === 4 * 7 * 5 * 6 * 2);
  t('Gethsemane high detail increases sprig density without extra trees',
    leafSprigs(garden) === 4 * 7 * 7 * 7 * 2);

} else {
  t('Gethsemane visual scene exists', false);
}

// Journey & Art Foundation: shared stone palette must vary in world space
// instead of using the former periodic horizontal bands.
const stoneField = [
  [0, 2, -10], [-6, 4, -42], [8, 8, -90],
  [-3, 12, -140], [2, 30, -200], [1, 5, -260],
].map(([x, y, z]) => caveSurfaceVariation(x, y, z));
t('3D rock coloration is deterministic, bounded and not uniformly striped',
  stoneField.every((v) => Number.isFinite(v) && v >= 0.64 && v <= 1.2) &&
  Math.max(...stoneField) - Math.min(...stoneField) > 0.025 &&
  caveSurfaceVariation(0, 2, -10) === stoneField[0]);

const wellRecord = EXHIBITS.find((e) => e.environmentKey === 'beersheba-well');
if (wellRecord) {
  const well = buildExhibitProps(wellRecord, true, 0, 0);
  let stones = 0;
  well.traverse((o) => { if (o.name === 'well-rim-stone') stones++; });
  let groundStones = 0;
  well.traverse((o) => { if (o.name === 'well-ground-stone') groundStones++; });
  let courses = 0, sprays = 0, needles = 0;
  well.traverse((o) => {
    if (o.name === 'well-course-stone') courses++;
    if (o.name === 'tamarisk-spray') sprays++;
    if (o.name === 'tamarisk-needle') needles++;
  });
  const shaft = well.getObjectByName('well-open-shaft');
  t('Beersheba well is a hollow stone shaft, never capped by a cylinder lid',
    shaft instanceof THREE.Mesh &&
    shaft.geometry instanceof THREE.CylinderGeometry &&
    shaft.geometry.parameters.openEnded === true &&
    courses === 42 && stones === 14 && groundStones === 18);
  t('Beersheba tamarisk has airy sprays, not an opaque green canopy',
    sprays === 10 && needles === 70);
  const highWell = buildExhibitProps(wellRecord, false, 0, 0);
  const outerStoneRadius = (group: THREE.Group): number => {
    group.updateMatrixWorld(true);
    let maxRadius = 0;
    const vertex = new THREE.Vector3();
    group.traverse((o) => {
      if (!(o instanceof THREE.Mesh) ||
          !['well-course-stone', 'well-rim-stone'].includes(o.name)) return;
      const positions = o.geometry.getAttribute('position');
      for (let i = 0; i < positions.count; i++) {
        vertex.fromBufferAttribute(positions, i).applyMatrix4(o.matrixWorld);
        maxRadius = Math.max(maxRadius, Math.hypot(vertex.x, vertex.z));
      }
    });
    return maxRadius;
  };
  const lowRadius = outerStoneRadius(well), highRadius = outerStoneRadius(highWell);
  t('Beersheba high and low well masonry share the physical collision footprint',
    BEERSHEBA_WELL_COLLIDER_RADIUS === 1.45 &&
    lowRadius > 1.1 && lowRadius < BEERSHEBA_WELL_COLLIDER_RADIUS &&
    highRadius > 1.1 && highRadius < BEERSHEBA_WELL_COLLIDER_RADIUS &&
    Math.abs(lowRadius - highRadius) < 0.005);
  let rimPieces = 0, roundedCourses = 0;
  highWell.traverse((o) => {
    if (o.name === 'well-rim-stone') rimPieces++;
    if (o.name === 'well-course-stone' && o instanceof THREE.Mesh &&
        o.geometry.type === 'ExtrudeGeometry') roundedCourses++;
  });
  t('Beersheba coping consists of 14 individually fitted stones, not a continuous torus',
    rimPieces === 14 && roundedCourses === 42 &&
    !highWell.children.some((o) => o instanceof THREE.Mesh &&
      o.geometry instanceof THREE.TorusGeometry && o.position.y > 0.7));
  // A circle with identical curved sectors still reads as a manufactured
  // concrete cylinder. The exposed outer cut of each limestone block must
  // have a real irregular polygonal profile, not just noisy surface colours.
  const sampleBlock = highWell.getObjectByName('well-course-stone');
  let edgeErosion = 0, outerProfileSteps = 0;
  if (sampleBlock instanceof THREE.Mesh && sampleBlock.geometry instanceof THREE.ExtrudeGeometry) {
    const outline = sampleBlock.geometry.parameters.shapes as THREE.Shape;
    const points = outline.getPoints(1).slice(0, 6);
    const radii = points.map((point) => Math.hypot(point.x, point.y));
    outerProfileSteps = points.length;
    edgeErosion = Math.max(...radii) - Math.min(...radii);
  }
  let copingMinY = Infinity, copingMaxY = -Infinity;
  highWell.traverse((object) => {
    if (object.name !== 'well-rim-stone') return;
    const bond = object.userData.wellBond;
    if (!bond) return;
    copingMinY = Math.min(copingMinY, bond.top);
    copingMaxY = Math.max(copingMaxY, bond.top);
  });
  t('Beersheba individual cut stones show eroded edges and uneven coping',
    outerProfileSteps === 6 && edgeErosion > 0.006 &&
    copingMaxY - copingMinY > 0.012);
}
const hagarRecord = EXHIBITS.find((e) => e.environmentKey === 'wilderness-spring');
if (hagarRecord) {
  const scene = buildExhibitProps(hagarRecord, true, 0, 0);
  let edges = 0;
  scene.traverse((o) => { if (o.name === 'spring-natural-edge-stone') edges++; });
  t('Hagar spring has a shallow irregular water polygon and natural bank',
    scene.getObjectByName('spring-irregular-water') instanceof THREE.Mesh &&
    scene.getObjectByName('spring-irregular-bank') instanceof THREE.Mesh &&
    edges === 13);
  const surface = scene.getObjectByName('spring-irregular-water');
  const bank = scene.getObjectByName('spring-irregular-bank');
  t('Hagar spring uses distinct lit dielectric water, not black metallic deep-well water',
    surface instanceof THREE.Mesh && bank instanceof THREE.Mesh &&
    surface.material instanceof THREE.MeshStandardMaterial &&
    bank.material instanceof THREE.MeshStandardMaterial &&
    surface.material !== bank.material &&
    surface.material.metalness === 0 &&
    surface.material.roughness >= 0.15 && surface.material.roughness <= 0.4 &&
    surface.material.emissiveIntensity === 1 &&
    surface.material.emissive.getHex() === 0 &&
    surface.material.color.g > bank.material.color.g * 1.5);
  let submerged = 0, fakeUnlitGlints = 0;
  scene.traverse((o) => {
    if (o.name === 'spring-submerged-stone') submerged++;
    if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshBasicMaterial &&
        o.material.transparent && o.geometry instanceof THREE.PlaneGeometry) fakeUnlitGlints++;
  });
  const bed = scene.getObjectByName('spring-sediment-bed');
  t('Hagar spring reads as actual translucent water over sediment, with no fake unlit glint',
    surface instanceof THREE.Mesh &&
    surface.material instanceof THREE.MeshStandardMaterial &&
    surface.material.transparent === true &&
    surface.material.opacity >= 0.55 && surface.material.opacity <= 0.78 &&
    surface.material.depthWrite === false &&
    bed instanceof THREE.Mesh &&
    bed.position.y < surface.position.y &&
    submerged === 11 && fakeUnlitGlints === 0);
}
if (gardenRecord) {
  const grove = buildExhibitProps(gardenRecord, true, 0, 0);
  let branches = 0;
  grove.traverse((o) => { if (o.name === 'olive-branch') branches++; });
  const branchMats = new Set<THREE.Material>();
  grove.traverse((o) => { if (o.name === 'olive-branch' && o instanceof THREE.Mesh) branchMats.add(o.material as THREE.Material); });
  t('Gethsemane four trees have independent tapered structural branches',
    branches >= 24 && branchMats.size === 1);
  // Every major branch must share the trunk's real fissured bark, not the
  // flat light-grey wood used for the small twigs and buried roots. The
  // matching vertex attributes are also a prerequisite for safe batching.
  const trunk = grove.getObjectByName('olive-main-trunk');
  const trunkBark = trunk instanceof THREE.Mesh ? trunk.material : null;
  let barkedBranches = 0, minBark = Infinity, maxBark = -Infinity;
  grove.traverse((o) => {
    if (o.name !== 'olive-branch' || !(o instanceof THREE.Mesh)) return;
    const colors = o.geometry.getAttribute('color');
    const positions = o.geometry.getAttribute('position');
    if (!colors || !positions || colors.count !== positions.count ||
        o.material !== trunkBark) return;
    barkedBranches++;
    for (let i = 0; i < colors.count; i++) {
      minBark = Math.min(minBark, colors.getX(i));
      maxBark = Math.max(maxBark, colors.getX(i));
    }
  });
  t('Gethsemane structural wood shares true bark material and varied colors',
    trunkBark !== null && barkedBranches === branches &&
    maxBark - minBark > 0.06 && branchMats.size === 1);
  // One C1-continuous taper must connect each old two-piece Y fork.
  // Test the REAL triangulated rings against the parametric curve rather
  // than relying on primitive counts or names. A loose joint, open gap at
  // the bole, reversed taper or conspicuous sharp elbow must fail CI.
  let organicForks = 0, anchoredForks = 0, taperedForks = 0, smoothForks = 0;
  grove.traverse((o) => {
    if (o.name !== 'olive-branch' || !(o instanceof THREE.Mesh) ||
        !(o.geometry instanceof THREE.TubeGeometry)) return;
    const geo = o.geometry, pos = geo.getAttribute('position');
    const { tubularSegments, radialSegments, path } = geo.parameters;
    if (tubularSegments < 12 || radialSegments < 9 ||
        pos.count !== (tubularSegments + 1) * (radialSegments + 1)) return;
    organicForks++;
    const ring = (k: number) => {
      const centre = new THREE.Vector3();
      for (let j = 0; j < radialSegments; j++) {
        const i = k * (radialSegments + 1) + j;
        centre.add(new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)));
      }
      return centre.divideScalar(radialSegments);
    };
    const root = ring(0), mid = ring(tubularSegments / 2), end = ring(tubularSegments);
    if (root.distanceTo(path.getPointAt(0)) < 0.008 &&
        end.distanceTo(path.getPointAt(1)) < 0.008 &&
        mid.distanceTo(path.getPointAt(0.5)) < 0.008) anchoredForks++;
    const radius = (k: number) => {
      const centre = ring(k);
      let total = 0;
      for (let j = 0; j < radialSegments; j++) {
        const i = k * (radialSegments + 1) + j;
        total += centre.distanceTo(new THREE.Vector3(
          pos.getX(i), pos.getY(i), pos.getZ(i)));
      }
      return total / radialSegments;
    };
    if (radius(0) > 0.085 && radius(tubularSegments) < 0.018 &&
        radius(0) > radius(tubularSegments) * 4 &&
        radius(tubularSegments / 2) < radius(0)) taperedForks++;
    let maxTurn = 0;
    for (let k = 1; k < tubularSegments; k++) {
      const incoming = ring(k).sub(ring(k - 1)).normalize();
      const outgoing = ring(k + 1).sub(ring(k)).normalize();
      maxTurn = Math.max(maxTurn, incoming.angleTo(outgoing));
    }
    if (mid.distanceTo(root.clone().lerp(end, 0.5)) > 0.016 &&
        maxTurn < 0.65) smoothForks++;
  });
  // A foliage twig must emerge from an actual nearby living branch,
  // not from an arbitrary terminal starburst or an ungrounded point.
  const branchCurves: THREE.CatmullRomCurve3[] = [];
  grove.traverse((o) => {
    if (o.name === 'olive-branch' && o instanceof THREE.Mesh &&
        o.geometry instanceof THREE.TubeGeometry &&
        o.geometry.parameters.path instanceof THREE.CatmullRomCurve3)
      branchCurves.push(o.geometry.parameters.path);
  });
  let attachedLeafTwigs = 0, spreadAlongBranch = 0;
  grove.traverse((o) => {
    if (o.name !== 'olive-foliage-twig' || !(o instanceof THREE.Mesh) ||
        !(o.geometry instanceof THREE.CylinderGeometry)) return;
    const from = o.position.clone().add(new THREE.Vector3(
      0, -o.geometry.parameters.height / 2, 0).applyQuaternion(o.quaternion));
    let nearest = Infinity, nearestT = 0;
    for (const curve of branchCurves) for (let k = 11; k <= 20; k++) {
      const t = k / 20;
      const d = curve.getPointAt(t).distanceTo(from);
      if (d < nearest) { nearest = d; nearestT = t; }
    }
    if (nearest < 0.042) {
      attachedLeafTwigs++;
      if (nearestT < 0.86) spreadAlongBranch++;
    }
  });
  t('Gethsemane foliage twigs attach across sculpted branch trajectories',
    attachedLeafTwigs === 4 * 7 * 5 &&
    spreadAlongBranch >= 4 * 7 * 2);
    t('Gethsemane all four trees use 28 individually continuous branches',
    branches === 28 && organicForks === branches);
  t('Gethsemane structural tube ends meet original rooted path endpoints',
    anchoredForks === branches);
  t('Gethsemane sculpted forks continuously taper from trunk to live tip',
    taperedForks === branches);
  t('Gethsemane mature structural branches curve without sharp elbow joints',
    smoothForks >= 24);
  // Regression: a curved branch is an individually owned BufferGeometry.
  // Batched prop scenes discard those source meshes, so their buffers must be
  // explicitly released, while shared cached cylinders stay intact.
  const batchableGarden = buildExhibitProps(gardenRecord, true, 0, 0);
  let ownedBranches = 0, disposedOwnedBranches = 0;
  batchableGarden.traverse((object) => {
    if (object.name !== 'olive-branch' || !(object instanceof THREE.Mesh) ||
        !object.geometry.userData.horebOwnedBeforeMerge) return;
    ownedBranches++;
    object.geometry.addEventListener('dispose', () => { disposedOwnedBranches++; });
  });
  mergePropsGroup(batchableGarden);
  t('Gethsemane merged branch buffers are disposed once after batching',
    ownedBranches >= 28 && disposedOwnedBranches === ownedBranches &&
    !batchableGarden.children.some((object) => object.name === 'olive-branch'));
  const barkBatches = batchableGarden.children.filter((object) =>
    object instanceof THREE.Mesh && object.material === trunkBark);
  t('Gethsemane bark and structural forks form one GPU material batch',
    barkBatches.length === 1 &&
    barkBatches[0] instanceof THREE.Mesh &&
    barkBatches[0].geometry.getAttribute('color')?.count ===
      barkBatches[0].geometry.getAttribute('position')?.count);
  let trunks = 0, roots = 0, flatLeaves = 0;
  grove.traverse((o) => {
    if (o.name === 'olive-main-trunk') trunks++;
    if (o.name === 'olive-root') roots++;
    if (o.name === 'olive-leaf-sprig' && o instanceof THREE.Mesh &&
      o.geometry instanceof THREE.ShapeGeometry &&
      o.material instanceof THREE.MeshStandardMaterial &&
      o.material.side === THREE.DoubleSide) flatLeaves++;
  });
  t('Gethsemane olives have segmented rooted trunks and botanically thin leaves',
    trunks === 4 && roots === 12 && flatLeaves === 4 * 7 * 5 * 6 * 2);
  let gnarled = 0, twigs = 0, totalCrownHeight = 0;
  grove.traverse((o) => {
    if (o.name === 'olive-foliage-twig') twigs++;
    if (o.name === 'olive-main-trunk' && o instanceof THREE.Mesh &&
        o.geometry instanceof THREE.CylinderGeometry &&
        o.geometry.parameters.heightSegments >= 12) {
      gnarled++;
      totalCrownHeight += o.position.y + o.geometry.parameters.height / 2;
    }
  });
  t('Gethsemane mature boles support genuine attached foliage twigs',
    gnarled === 4 && twigs === 4 * 7 * 5 && totalCrownHeight > 6.5);
  let maxTrunkRadius = 0, sculptedTrunks = 0;
  grove.traverse((o) => {
    if (o.name !== 'olive-main-trunk' || !(o instanceof THREE.Mesh)) return;
    sculptedTrunks++;
    const positions = o.geometry.getAttribute('position');
    for (let i = 0; i < positions.count; i++) {
      maxTrunkRadius = Math.max(maxTrunkRadius,
        Math.hypot(positions.getX(i), positions.getZ(i)));
    }
  });
  t('Gethsemane deformed wooden boles stay inside the shared 0.29m trunk collider',
    sculptedTrunks === 4 && maxTrunkRadius <= 0.29);
  let barkVertices = 0, shadeRange = 0, foliageTwigs = 0, biggestCore = 0;
  grove.traverse((o) => {
    if (o.name === 'olive-foliage-twig') foliageTwigs++;
    if (o.name === 'olive-crown-lobe' && o instanceof THREE.Mesh) {
      biggestCore = Math.max(biggestCore, o.scale.x, o.scale.y, o.scale.z);
    }
    if (o.name === 'olive-main-trunk' && o instanceof THREE.Mesh) {
      const colors = o.geometry.getAttribute('color');
      if (colors && o.material instanceof THREE.MeshStandardMaterial &&
          o.material.vertexColors === true) {
        barkVertices += colors.count;
        const channels: number[] = [];
        for (let i = 0; i < colors.count; i++) channels.push(colors.getX(i));
        shadeRange = Math.max(shadeRange, Math.max(...channels) - Math.min(...channels));
      }
    }
  });
  t('Gethsemane bark has continuous vertex-colour fissures, not a flat trunk material',
    barkVertices >= 4 * 180 && shadeRange > 0.045);
  t('Gethsemane foliage is paired along joined twig sprays, with no giant opaque balls',
    foliageTwigs === 4 * 7 * 5 && biggestCore <= 0.14 &&
    flatLeaves === 4 * 7 * 5 * 6 * 2);
  let tooLongLeaves = 0, verticalLeaves = 0, paleTrunks = 0;
  grove.traverse((o) => {
    if (o.name === 'olive-leaf-sprig' && o instanceof THREE.Mesh) {
      if (o.scale.y > 0.116) tooLongLeaves++;
      if (Math.abs(o.rotation.z) < 0.8) verticalLeaves++;
    }
    if (o.name === 'olive-main-trunk' && o instanceof THREE.Mesh &&
        o.material instanceof THREE.MeshStandardMaterial &&
        o.material.color.getHex() !== 0x777168) paleTrunks++;
  });
  t('Gethsemane laminae stay short and slanted, while bark is not chalk-white',
    tooLongLeaves === 0 && verticalLeaves === 0 && paleTrunks === 0);
  const gardenX = PLACEMENTS['abba'][0];
  const inward = -Math.sign(gardenX) * 0.85;
  const anchorX = gardenX + inward * 1.2 / Math.hypot(inward, 0.53);
  t('grove physics and art share one layout and preserve the central walk',
    OLIVE_GROVE_OFFSETS.length === 4 &&
    OLIVE_GROVE_OFFSETS.every(([dx, dz]) => Number.isFinite(dx) && Number.isFinite(dz)) &&
    OLIVE_GROVE_OFFSETS.every(([dx]) => Math.abs(anchorX + dx) > 0.29 + 0.35 + 0.05));
}
const zoneGeometry = buildZones(true, new THREE.MeshStandardMaterial({ vertexColors: true }));
// Zone-6 geometry is a literal deformation OF the cave shell, not detached
// paper spikes or a theatrical portal, and cannot intersect walking height.
const exitCeiling = exitVaultRelief(0.5, 5, -306, 1, 0);
const exitSide = exitVaultRelief(2.0, 3, -306, 0.1, 1);
const mouthRelief = exitVaultRelief(1.2, 3.4, -320, 1, 0);
const mouthLeft = exitVaultRelief(-2.1, 3.4, -320, 0.2, -1);
const mouthRight = exitVaultRelief(2.1, 3.4, -320, 0.2, 1);
t('zone-6 cave mouth remains eroded and visibly asymmetric through last shell rings',
  mouthRelief.roofDrop > 0.08 && mouthLeft.sideOut > mouthRight.sideOut * 1.25);
const erodedLeftShoulder = exitVaultRelief(1.4, 4, -320, 0.85, -0.47);
const erodedRightShoulder = exitVaultRelief(1.4, 4, -320, 0.85, 0.47);
t('zone-6 mouth includes real asymmetric upper shoulder bedding, not a round portal',
  erodedLeftShoulder.roofDrop > erodedRightShoulder.roofDrop + 0.14 &&
  erodedLeftShoulder.roofDrop < 1.25 &&
  exitVaultRelief(1.4, 4, -330, 0.85, -0.47).roofDrop === 0);


t('zone-6 erosion modifies the original vault without out-of-zone artefacts',
  exitCeiling.roofDrop > 0.4 && exitCeiling.roofDrop < 1.22 &&
  exitCeiling.shade < 0.96 && exitCeiling.shade >= 0.78 &&
  exitSide.sideOut > 0.18 && exitSide.roofDrop < 0.05 &&
  exitVaultRelief(0, 5, -285, 1, 0).roofDrop === 0 &&
  exitVaultRelief(0, 5, -327, 1, 0).roofDrop === 0);
const lastRingRoof = exitVaultRelief(0.5, 5, -322, 1, 0);
const lastRingFlank = exitVaultRelief(-2.1, 2.5, -322, 0.2, -1);
const priorLastRingRoof = exitVaultRelief(0.5, 5, -320, 1, 0);
t('zone-six eroded roof and shoulders persist to final rendered shell ring',
  lastRingRoof.roofDrop > 0.40 &&
  lastRingRoof.roofDrop > priorLastRingRoof.roofDrop * 0.60 &&
  lastRingFlank.sideOut > 0.24);
t('zone-six mouth erodes only within old rock shell and safe profile',
  lastRingRoof.roofDrop < 1.25 &&
  lastRingFlank.sideOut < 0.95 &&
  exitVaultRelief(0, 5, -330, 1, 0).roofDrop === 0 &&
  exitVaultRelief(0, 5, -287, 1, 0).roofDrop === 0);
for (const lowMode of [true, false]) {
  const sceneGeometry = buildZones(lowMode,
    new THREE.MeshStandardMaterial({ vertexColors: true }));
  const vault = sceneGeometry.group.getObjectByName('cave-vault-continuous');
  const obsolete = sceneGeometry.group.getObjectByName('zone-6-geological-roof-fractures');
  let minHeight = Infinity, inspected = 0;
  if (vault instanceof THREE.Mesh) {
    const vertices = vault.geometry.getAttribute('position');
    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i), y = vertices.getY(i), z = vertices.getZ(i);
      if (Math.abs(x) < 1.25 && z < -300 && z > -315 && y > 2.7) {
        minHeight = Math.min(minHeight, y);
        inspected++;
      }
    }
  }
  t('zone-6 continuous rock contour keeps the safe tunnel, no detached fins ' +
    (lowMode ? 'LOW' : 'HIGH'),
    vault instanceof THREE.Mesh && obsolete == null &&
    inspected > (lowMode ? 40 : 90) && minHeight > 3.0 &&
    !sceneGeometry.obstacles.some((o) => o.z < -292 && o.z > -318));
}

// The exterior terrain used to overlap the cave floor by ~3m at the mouth,
// producing obvious brown triangles and a geometric double surface. Their
// actual world-space edges now adjoin; the broad facade aperture is measured.
for (const lowMode of [true, false]) {
  const geoScene = buildZones(lowMode, new THREE.MeshStandardMaterial({ vertexColors: true }));
  const floor = geoScene.group.getObjectByName('cave-floor-continuous');
  const terrain = geoScene.group.getObjectByName('horeb-exterior-terrain');
  const face = geoScene.group.getObjectByName('horeb-outer-rock-face');
  const minZ = (mesh: THREE.Object3D) => {
    const points = (mesh as THREE.Mesh).geometry.getAttribute('position');
    let min = Infinity;
    for (let i = 0; i < points.count; i++) min = Math.min(min, points.getZ(i));
    return min;
  };
  const maxZ = (mesh: THREE.Object3D) => {
    const points = (mesh as THREE.Mesh).geometry.getAttribute('position');
    let max = -Infinity;
    for (let i = 0; i < points.count; i++) max = Math.max(max, points.getZ(i));
    return max;
  };
  // The old test tolerated a 0.9m geometric gap at the cave mouth.
  // The ground and cave now share the precise final ring even on LOW,
  // whose angular/axial step lands at -321.8 rather than -322.
  const seamZ = floor ? minZ(floor) : NaN;
  t('Horeb floor and exterior earth physically meet without gap or overlap ' +
      (lowMode ? 'LOW' : 'HIGH'),
    !!floor && !!terrain &&
    Number.isFinite(seamZ) &&
    Math.abs(seamZ - maxZ(terrain)) < 0.00005 &&
    maxZ(terrain) <= TUNNEL_END - 3.7);
  if (floor instanceof THREE.Mesh && terrain instanceof THREE.Mesh) {
    const cPos = floor.geometry.getAttribute('position');
    const cCol = floor.geometry.getAttribute('color');
    const cUv = floor.geometry.getAttribute('uv');
    const cNormal = floor.geometry.getAttribute('normal');
    const gPos = terrain.geometry.getAttribute('position');
    const gCol = terrain.geometry.getAttribute('color');
    const gUv = terrain.geometry.getAttribute('uv');
    const gNormal = terrain.geometry.getAttribute('normal');
    const front: number[] = [];
    for (let i = 0; i < gPos.count; i++)
      if (Math.abs(gPos.getZ(i) - seamZ) < 0.00005) front.push(i);
    front.sort((a, b) => gPos.getX(a) - gPos.getX(b));
    const portalSamples = front.filter(i => Math.abs(gPos.getX(i)) < 4.5);
    t('Horeb exterior terrain reuses every cave mouth X station ' +
        (lowMode ? 'LOW' : 'HIGH'),
      portalSamples.length >= (lowMode ? 17 : 29));
    // A graph with two merely close spline contours still has raster slits.
    // Prove every cave boundary station has a matching exterior vertex
    // with the EXACT same position, vertex tint and UV, not a nearby
    // interpolated edge. This prohibits T-junctions at either LOD.
    let caveStations = 0, matchedStations = 0;
    let maxPositionError = 0, maxColorError = 0, maxUvError = 0;
    let maxNormalError = 0, minMouthNormalY = Infinity;
    for (let i = 0; i < cPos.count; i++) {
      if (Math.abs(cPos.getZ(i) - seamZ) > 0.00005) continue;
      caveStations++;
      const x = cPos.getX(i);
      let nearest = -1, distance = Infinity;
      for (const id of front) {
        const d = Math.abs(gPos.getX(id) - x);
        if (d < distance) { distance = d; nearest = id; }
      }
      if (nearest < 0 || distance > 0.00005) continue;
      matchedStations++;
      if (cNormal && gNormal) {
        for (const channel of ['X', 'Y', 'Z'] as const) {
          const read = channel === 'X' ? 'getX' : channel === 'Y' ? 'getY' : 'getZ';
          maxNormalError = Math.max(maxNormalError,
            Math.abs(cNormal[read](i) - gNormal[read](nearest)));
        }
        minMouthNormalY = Math.min(minMouthNormalY,
          cNormal.getY(i), gNormal.getY(nearest));
      }
      maxPositionError = Math.max(maxPositionError, distance,
        Math.abs(cPos.getY(i) - gPos.getY(nearest)),
        Math.abs(cPos.getZ(i) - gPos.getZ(nearest)));
      if (cCol && gCol) for (const channel of ['X', 'Y', 'Z'] as const) {
        const read = channel === 'X' ? 'getX' :
          channel === 'Y' ? 'getY' : 'getZ';
        maxColorError = Math.max(maxColorError,
          Math.abs(cCol[read](i) - gCol[read](nearest)));
      }
      if (cUv && gUv) for (const channel of ['X', 'Y'] as const) {
        const read = channel === 'X' ? 'getX' : 'getY';
        maxUvError = Math.max(maxUvError,
          Math.abs(cUv[read](i) - gUv[read](nearest)));
      }
    }
    console.log('HOREB mouth seam ' + (lowMode ? 'LOW' : 'HIGH') +
      ' ' + JSON.stringify({ caveStations, matchedStations,
        maxPositionError, maxColorError, maxUvError, maxNormalError, minMouthNormalY }));
    t('Horeb cave and exterior share every boundary vertex without T-junctions ' +
        (lowMode ? 'LOW' : 'HIGH'),
      caveStations === (lowMode ? 17 : 29) &&
      matchedStations === caveStations && maxPositionError < 0.00005);
    t('Horeb cave/exterior mouth shares exact stone colour and UV per station ' +
        (lowMode ? 'LOW' : 'HIGH'),
      matchedStations === caveStations &&
      maxColorError < 0.00005 && maxUvError < 0.00005);
    t('Horeb cave/exterior share lighting normals at every mouth station ' +
        (lowMode ? 'LOW' : 'HIGH'),
      matchedStations === caveStations && !!cNormal && !!gNormal &&
      maxNormalError < 0.00005 && minMouthNormalY > 0.6);

    // Terrain UV density must be measured in world metres, not inherited
    // from a 1200x1000 plane. Repeating a texture once across kilometres
    // looks like an untextured slab even when the seam's first row matches.
    const centreUvStations: { z: number; v: number }[] = [];
    for (let i = 0; i < gPos.count; i++) {
      const x = gPos.getX(i), z = gPos.getZ(i);
      if (Math.abs(x) < 0.00005 && z < -345 && z > -395)
        centreUvStations.push({ z, v: gUv.getY(i) });
    }
    centreUvStations.sort((a, b) => a.z - b.z);
    const centreUvRates = centreUvStations.slice(1).map((item, index) => {
      const prev = centreUvStations[index];
      return Math.abs(item.v - prev.v) / Math.abs(item.z - prev.z);
    });
    t('Horeb exterior stone texture retains world-metric UV density ' +
        (lowMode ? 'LOW' : 'HIGH'),
      centreUvRates.length >= (lowMode ? 3 : 6) &&
      centreUvRates.every(rate => rate > 0.18 && rate < 0.42));

    // The original 1200x1000 plane had 5m HIGH / 9.1m LOW spacing
    // immediately outside the lip: the ground looked like a polygonal
    // empty sheet despite being textured. Reuse the SAME grid indices but
    // redistribute axial rings into the first 30m of real walking space.
    const axialAtCentre: number[] = [];
    for (let i = 0; i < gPos.count; i++)
      if (Math.abs(gPos.getX(i)) < 0.00005) axialAtCentre.push(gPos.getZ(i));
    axialAtCentre.sort((a, b) => b - a);
    const firstAxialStep = axialAtCentre[0] - axialAtCentre[1];
    const resolvedApronRings = axialAtCentre.filter(z =>
      z <= seamZ + 0.00005 && z >= seamZ - 32).length;
    t('Horeb exterior apron has real near-field axial terrain sampling ' +
        (lowMode ? 'LOW' : 'HIGH'),
      axialAtCentre.length === (lowMode ? 111 : 201) &&
      Math.abs(axialAtCentre[0] - seamZ) < 0.00005 &&
      firstAxialStep > 0.8 && firstAxialStep < 2.8 &&
      resolvedApronRings >= (lowMode ? 9 : 16));
    const apronStones = geoScene.group.getObjectByName('horeb-outdoor-pebbles');
    t('Horeb near-mouth scree uses existing instancing not extra draw calls ' +
        (lowMode ? 'LOW' : 'HIGH'),
      apronStones instanceof THREE.InstancedMesh &&
      apronStones.count === (lowMode ? 80 : 200));


  }
  let apertureSafe = false;
  if (face instanceof THREE.Mesh && face.geometry instanceof THREE.ShapeGeometry) {
    const shapes = face.geometry.parameters.shapes;
    const holes = (Array.isArray(shapes) ? shapes[0] : shapes).holes;
    const points = holes?.[0]?.getPoints(24) ?? [];
    const highRidge = points.reduce((best: THREE.Vector2, current: THREE.Vector2) =>
      current.y > best.y ? current : best, points[0]);
    apertureSafe = points.length >= 100 &&
      Math.min(...points.map((p: THREE.Vector2) => p.x)) <= -3.75 &&
      Math.max(...points.map((p: THREE.Vector2) => p.x)) >= 3.75 &&
      highRidge.y > 6.15 && highRidge.x < -0.15 &&
      Math.max(...points.filter((p: THREE.Vector2) =>
        Math.abs(p.x) < 0.3).map((p: THREE.Vector2) => p.y)) > 5.85;
  }
  t('Horeb rock face aperture clears real wider cave shell ' +
      (lowMode ? 'LOW' : 'HIGH'),
    apertureSafe);
}

// Local mineral shading is attached to the ORIGINAL shell, not a giant
// light that bleaches the floor, nearby testimony, or sacred final scene.
const deepBedding = ravineStrataReflectance(22, -22, -200, 1);
t('deep opposing ravine has subdued depth-sensitive mineral reflectance',
  deepBedding > 1.25 && deepBedding < 1.55 &&
  ravineStrataReflectance(22, -6, -200, 1) < deepBedding);
t('ravine local reflectance cannot alter walkable lip or other zones',
  ravineStrataReflectance(2.8, -22, -200, 1) === 1 &&
  ravineStrataReflectance(22, 0, -200, 1) === 1 &&
  ravineStrataReflectance(22, -22, -88, 0) === 1 &&
  ravineStrataReflectance(22, -22, -340, 0) === 1);

t('metric cliff UV is restricted to far geological strata, never walkable floor',
  ravineMetricUvWeight(22, -22, 1) === 1 &&
  ravineMetricUvWeight(22, -22, 0) === 0 &&
  ravineMetricUvWeight(2.8, -22, 1) === 0 &&
  ravineMetricUvWeight(22, 1, 1) === 0 &&
  ravineMetricUvWeight(22, -8, 1) > 0 &&
  ravineMetricUvWeight(22, -8, 1) < 1);
const ravineUvDensity: Record<string, number> = {};
// The raw drop itself must be C1-smooth. The former branch at 0.45 H
// generated a visible horizontal seam; switching quality MUST NOT reintroduce
// a first-derivative discontinuity at either end of the 55m descent.
const H = 40, crest = H * 0.45;
t('zone-4 deep cliff transitions smoothly from actual untouched upper vault',
  opposingRavineDrop(crest, H, 1) === 0 &&
  opposingRavineDrop(crest + 0.1, H, 1) === 0 &&
  opposingRavineDrop(crest - 0.1, H, 1) < 0.015 &&
  opposingRavineDrop(crest - 0.2, H, 1) < 0.04);
t('zone-4 cliff reaches real 55m depth without bottom-slope discontinuity',
  opposingRavineDrop(-1, H, 1) === 55 &&
  opposingRavineDrop(-1.1, H, 1) === 55 &&
  55 - opposingRavineDrop(-0.9, H, 1) < 0.015 &&
  opposingRavineDrop(-5, H, 0) === 0 &&
  opposingRavineDrop(-5, H, 0.5) === 27.5);
t('zone-4 cliff profile descends monotonically through the actual full height',
  Array.from({ length: 190 }, (_, i) => crest - i * 0.1)
    .every((y) => opposingRavineDrop(y - 0.1, H, 1) + 1e-10 >=
      opposingRavineDrop(y, H, 1)));
// The new cliff relief is physically continuous and limited to the *far*
// wall. It must not change the safe ledge, another gallery, the top lip,
// collision obstacles or the sacred perimeter.
const reliefSamples: number[] = [];
for (const z of [-223, -217, -211, -205, -199, -193, -187, -181])
  for (const y of [-12, -20, -28, -42]) {
    const value = opposingRavineRelief(23, y, z, 1);
    reliefSamples.push(value);
  }
t('zone-4 deep cliff relief is bounded, variable and grounded in real rock',
  reliefSamples.every((v) => Number.isFinite(v) && Math.abs(v) <= 1.15 + 1e-9) &&
  Math.max(...reliefSamples) - Math.min(...reliefSamples) > 0.20);
t('zone-4 rock relief cannot move any navigable lip or other zone',
  opposingRavineRelief(3.4, -29, -200, 1) === 0 &&
  opposingRavineRelief(23, -5, -200, 1) === 0 &&
  opposingRavineRelief(23, -29, -200, 0) === 0 &&
  opposingRavineRelief(23, -29, -88, 0) === 0 &&
  opposingRavineRelief(23, -29, -348, 0) === 0);
t('zone-4 relief changes smoothly across adjacent 3D samples',
  [-195, -200, -205].every((z) =>
    Math.abs(opposingRavineRelief(23, -24, z + 0.04, 1) -
      opposingRavineRelief(23, -24, z - 0.04, 1)) < 0.25) &&
  Math.abs(opposingRavineRelief(23, -23, -200, 0.02)) < 0.024);
// A visible ravine must descend from the exact right-hand floor vertices,
// not be simulated by a disconnected dark plane fifty metres underneath.
for (const lowMode of [true, false]) {
  const constructed = buildZones(lowMode,
    new THREE.MeshStandardMaterial({ vertexColors: true }));
  const walkingFloor = constructed.group.getObjectByName('cave-floor-continuous');
  const depthPlate = constructed.group.getObjectByName('chasm-deep-floor');
  // The opposite rock must be far enough to reveal actual descending
  // geology from behind the unchanged safe lip; the original ~14m wall
  // made deep sightlines almost entirely floor-occluded.
  const opposingVault = constructed.group.getObjectByName('cave-vault-continuous');
  let farRockX = -Infinity, intersectedRockEdges = 0;
  if (opposingVault instanceof THREE.Mesh) {
    const pos = opposingVault.geometry.getAttribute('position');
    const columns = (lowMode ? 36 : 60) + 1;
    // A vertical line at y=-18 must cross ACTUAL mesh edges even when the
    // coarser LOW tessellation has zero vertices inside the old hard-coded
    // [-27,-8] sample band. Interpolate along connected angular neighbours
    // of the original continuous shell instead of weakening the >20m gate.
    for (let row = 0; row + columns <= pos.count; row += columns) {
      const z = pos.getZ(row);
      if (z <= -201 || z >= -199) continue;
      for (let col = 1; col < columns; col++) {
        const first = row + col - 1, second = row + col;
        const y0 = pos.getY(first), y1 = pos.getY(second);
        if ((y0 + 18) * (y1 + 18) > 0 || Math.abs(y1 - y0) < 1e-7) continue;
        const fraction = (-18 - y0) / (y1 - y0);
        const x = pos.getX(first) + fraction *
          (pos.getX(second) - pos.getX(first));
        if (x > 0) {
          intersectedRockEdges++;
          farRockX = Math.max(farRockX, x);
        }
      }
    }
  }
  t('zone-4 opposing cliff opens real 20m+ ravine without extra geometry ' +
    (lowMode ? 'LOW' : 'HIGH'),
    intersectedRockEdges >= 2 && farRockX > 20 && farRockX < 28);
  // Physically measured cliff length, not arbitrary j/N surface indices:
  // enforce texture frequency remains comparable on LOW and HIGH.
  if (opposingVault instanceof THREE.Mesh) {
    const relief = opposingVault.userData.opposingCliffRelief as
      { affectedVertices: number; min: number; max: number };
    t('zone-4 relief is embedded in actual cave triangles ' +
      (lowMode ? 'LOW' : 'HIGH'),
      relief?.affectedVertices > (lowMode ? 25 : 40) &&
      Number.isFinite(relief.min) && Number.isFinite(relief.max) &&
      relief.max - relief.min > 0.20);
    const position = opposingVault.geometry.getAttribute('position');
    const texcoord = opposingVault.geometry.getAttribute('uv');
    const segments = lowMode ? 36 : 60;
    const rowWidth = segments + 1;
    let summedU = 0, summedLength = 0, measuredEdges = 0;
    for (let i = 0; i + rowWidth < position.count; i += rowWidth) {
      const z = position.getZ(i);
      if (z < -205 || z > -195) continue;
      for (let j = 1; j < rowWidth; j++) {
        const a = i + j - 1, b = i + j;
        if (position.getX(a) < 19 || position.getX(b) < 19 ||
            position.getY(a) > -14 || position.getY(b) > -14) continue;
        const length = Math.hypot(position.getX(a) - position.getX(b),
          position.getY(a) - position.getY(b));
        if (length < 0.15 || length > 10) continue;
        summedLength += length;
        summedU += Math.abs(texcoord.getX(b) - texcoord.getX(a));
        measuredEdges++;
      }
    }
    const density = summedU / summedLength;
    ravineUvDensity[lowMode ? 'low' : 'high'] = density;
    t('zone-4 physically scaled deep rock UV has real arc-length sampling ' +
      (lowMode ? 'LOW' : 'HIGH'),
      measuredEdges > 12 && Number.isFinite(density) &&
      density > 0.12 && density < 0.55);
  }
  let good = walkingFloor instanceof THREE.Mesh && depthPlate instanceof THREE.Mesh;
  if (walkingFloor instanceof THREE.Mesh) {
    const g = walkingFloor.geometry;
    const meta = walkingFloor.userData.chasmStrata as {
      floorVertexCount: number; rows: number; segments: number;
      lowestWallY: number; nearestWallX: number;
      levels: number; integratedIntoFloor: boolean;
    };
    const points = g.getAttribute('position'), uv = g.getAttribute('uv');
    const faces = g.getIndex();
    const m = lowMode ? 16 : 28;
    const floorCount = meta.floorVertexCount;
    const wallVertexCount = points.count - floorCount;
    // The four actual connected strata must recede across the chasm;
    // a nearly vertical, uniformly dark extrusion is not acceptable.
    // Compare actual shallow and deep vertices at the SAME Z slice.
    // World geometry may interleave rows when its tessellation changes:
    // never infer adjacent vertices are necessarily the four layer IDs.
    const crossSections = new Map<string, { rim: number; deep: number }>();
    for (let i = floorCount; i < points.count; i++) {
      const z = points.getZ(i);
      if (z <= -207 || z >= -193) continue;
      const key = z.toFixed(2);
      const section = crossSections.get(key) ?? { rim: Infinity, deep: -Infinity };
      const y = points.getY(i), x = points.getX(i);
      if (y > -3) section.rim = Math.min(section.rim, x);
      if (y < -35) section.deep = Math.max(section.deep, x);
      crossSections.set(key, section);
    }
    const maxMidspanRecession = Math.max(0, ...[...crossSections.values()]
      .map((section) => section.deep - section.rim)
      .filter(Number.isFinite));
    const terracedAtMidspan = maxMidspanRecession > 3.3;
    let joinedFaces = 0, safeBoundary = true;
    if (faces) {
      for (let i = 0; i < faces.count; i += 3) {
        const a = faces.getX(i), b = faces.getX(i + 1), c = faces.getX(i + 2);
        if ([a, b, c].some((idx) => idx >= floorCount) &&
            [a, b, c].some((idx) => idx < floorCount)) {
          joinedFaces++;
          // Ground-truth lip bound; never rely on a decorative invisible rail.
          for (const idx of [a, b, c]) {
            if (idx < floorCount && idx % (m + 1) === m &&
                points.getX(idx) < LEDGE_X + 0.56) safeBoundary = false;
          }
        }
      }
    }
    good = good && meta.integratedIntoFloor && meta.levels === 4 &&
      meta.rows > 35 && meta.segments > 120 &&
      meta.lowestWallY < -35 && meta.nearestWallX >= LEDGE_X + 0.5 &&
      wallVertexCount === meta.rows * 4 && terracedAtMidspan &&
      joinedFaces > 35 && safeBoundary &&
      uv.count === points.count &&
      !constructed.obstacles.some((o) => o.z < -175 && o.z > -225 &&
        o.x > LEDGE_X && o.x < LEDGE_X + 2);
    if (!good) {
      const mid: Array<{ z: number; dx: number; y: number }> = [];
      for (let k = 0; k < Math.floor(wallVertexCount / 4); k++) {
        const first = floorCount + 4 * k, deepest = first + 3;
        const z = points.getZ(first);
        if (z < -207 && z > -193) mid.push({
          z, dx: points.getX(deepest) - points.getX(first),
          y: points.getY(deepest),
        });
      }
      console.log('CHASM_GEOMETRY_DIAGNOSTIC', JSON.stringify({
        lowMode, meta, floorCount, wallVertexCount, terracedAtMidspan,
        maxMidspanRecession, joinedFaces, safeBoundary, uvCount: uv.count, pointCount: points.count,
        middleSample: mid.slice(0, 3), middleSampleCount: mid.length,
        maximumMiddleRecession: Math.max(...mid.map((x) => x.dx)),
        lowestMiddleY: Math.min(...mid.map((x) => x.y)),
      }));
    }
  }
  t('zone-4 ravine connects 4 natural strata to safe existing floor edge ' +
    (lowMode ? 'LOW' : 'HIGH'), good);
}

t('deep rock UV density consistent between independent low and high meshes',
  Number.isFinite(ravineUvDensity.low) && Number.isFinite(ravineUvDensity.high) &&
  Math.abs(ravineUvDensity.low - ravineUvDensity.high) < 0.13);
const distantCrags = zoneGeometry.group.getObjectByName('horeb-distant-crags');
let distantSafe = distantCrags instanceof THREE.InstancedMesh && distantCrags.count === 32;
if (distantCrags instanceof THREE.InstancedMesh) {
  const matrix = new THREE.Matrix4();
  const point = new THREE.Vector3();
  for (let i = 0; i < distantCrags.count; i++) {
    distantCrags.getMatrixAt(i, matrix);
    point.setFromMatrixPosition(matrix);
    if (!Number.isFinite(point.y) || Math.abs(point.x) <= 26 ||
        point.z > -325 || point.z < -397) distantSafe = false;
  }
}
t('distant Horeb geology frames the approach outside all navigable bounds',
  distantSafe);

if (errors.length) console.log('errors:\n' + errors.join('\n'));
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
