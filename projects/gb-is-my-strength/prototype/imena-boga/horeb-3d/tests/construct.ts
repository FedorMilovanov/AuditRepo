// Source for the headless construction smoke test. Bundled with esbuild
// (which resolves extensionless TS imports) and run in Node.
import * as THREE from 'three';
import { EXHIBITS } from '../src/imena-boga-horeb-3d/data/exhibits';
import { buildExhibitProps, mergePropsGroup } from '../src/imena-boga-horeb-3d/engine/exhibitProps';
import { steleVariation } from '../src/imena-boga-horeb-3d/engine/nav';
import { buildBurningBush } from '../src/imena-boga-horeb-3d/engine/BurningBush';
import { BEACON_IDS, beaconOpacity, beaconVisualScale, beaconViewFactor } from '../src/imena-boga-horeb-3d/engine/NameBeacon';
import { ACOUSTIC, isApprovedAudioPath, APPROVED_NARRATION_ASSETS } from '../src/imena-boga-horeb-3d/engine/NarratorBus';
import { normalizeStudyBookmarks, toggleStudyBookmark } from '../src/imena-boga-horeb-3d/data/studyBookmarks';
import { caveSurfaceVariation } from '../src/imena-boga-horeb-3d/engine/procedural';
import { buildZones } from '../src/imena-boga-horeb-3d/engine/SceneZones';

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
  beaconVisualScale(2) < 0.8 && beaconVisualScale(24) > 1.1 &&
  beaconVisualScale(NaN) < 0.8);
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


// Zone 5 used to display four identical green-ball olive trees. Ensure
// Gethsemane now has multiple, individually positioned crown lobes per tree.
const gardenRecord = EXHIBITS.find((e) => e.environmentKey === 'gethsemane-garden');
if (gardenRecord) {
  const garden = buildExhibitProps(gardenRecord, false, 0, 0);
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
    leafSprigs(low) === 4 * 7 * 9);
  t('Gethsemane high detail doubles sprig density without extra trees',
    leafSprigs(garden) === 4 * 7 * 15);

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
  t('Beersheba well has an irregular hand-set fourteen-stone rim', stones === 14);
}
if (gardenRecord) {
  const grove = buildExhibitProps(gardenRecord, true, 0, 0);
  let branches = 0;
  grove.traverse((o) => { if (o.name === 'olive-branch') branches++; });
  const branchMats = new Set<THREE.Material>();
  grove.traverse((o) => { if (o.name === 'olive-branch' && o instanceof THREE.Mesh) branchMats.add(o.material as THREE.Material); });
  t('Gethsemane four trees have independent tapered structural branches',
    branches >= 24 && branchMats.size === 1);
}
const zoneGeometry = buildZones(true, new THREE.MeshStandardMaterial({ vertexColors: true }));
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
