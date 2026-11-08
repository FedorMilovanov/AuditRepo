// Source for the headless construction smoke test. Bundled with esbuild
// (which resolves extensionless TS imports) and run in Node.
import * as THREE from 'three';
import { EXHIBITS } from '../src/imena-boga-horeb-3d/data/exhibits';
import { buildExhibitProps, mergePropsGroup } from '../src/imena-boga-horeb-3d/engine/exhibitProps';
import { steleVariation } from '../src/imena-boga-horeb-3d/engine/nav';
import { buildBurningBush } from '../src/imena-boga-horeb-3d/engine/BurningBush';

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
}


if (errors.length) console.log('errors:\n' + errors.join('\n'));
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
