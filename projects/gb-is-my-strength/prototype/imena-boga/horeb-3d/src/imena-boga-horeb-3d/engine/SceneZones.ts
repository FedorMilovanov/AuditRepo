import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { fbm, rng, glowTexture, shaftMaterial, caveSurfaceVariation } from './procedural';
import { halfWidth, vaultHeight, LEDGE_X, TUNNEL_END, BUSH, R_OUTER, R_INNER, chasmFactor } from './nav';

export interface Obstacle { x: number; z: number; r: number }
export interface Built {
  group: THREE.Group;
  obstacles: Obstacle[];
  update: (t: number, dt: number, px: number, pz: number, motion: boolean) => void;
  particles: THREE.Points[];
}

// Размещение экспонатов: [x, z]; поворот считается к центру прохода и навстречу идущему.
// 42 исследовательских обозначения Research #379, распределённые по 8 зонам.
export const PLACEMENTS: Record<string, [number, number]> = {
  // Зона 1 — Творение (6)
  'elohim': [-5.0, -14], 'el': [5.0, -24], 'el-elyon': [-5.0, -34],
  'tsur': [5.0, -43], 'el-emunah': [-5.0, -51], 'eloah': [5.0, -58],
  // Зона 2 — Патриархи (4)
  'el-shaddai': [-8.0, -72], 'el-olam': [8.0, -84], 'el-roi': [-8.0, -96], 'el-bethel': [8.0, -108],
  // Зона 3 — Память о действии (7)
  'yireh': [-3.5, -122], 'nissi': [3.5, -130], 'shalom': [-3.5, -138], 'rapha': [3.5, -146],
  'mekoddishkem': [-3.5, -154], 'yah': [3.5, -161], 'ro-i': [-3.5, -167],
  // Зона 4 — Святость и Воинства (11). Справа провал (часм): правые стелы на уступе x≈3.8 (не x=3.2 — props
  // не должны закрывать центр прохода), левые на широком полу x≈-8.5.
  'sabaoth': [-8.5, -176], 'el-gibbor': [3.8, -181], 'tsidkenu': [-8.5, -186], 'shammah': [3.8, -191],
  'el-qanna': [-8.5, -196], 'adonai': [3.8, -201], 'qedosh-yisrael': [-8.5, -206], 'el-hay': [3.8, -211],
  'avinu': [-8.5, -216], 'yhwh-ori': [3.8, -221], 'el-rahum-hannun': [-8.5, -225],
  // Зона 5 — Позднейшие свидетельства (12)
  'atiq-yomin': [-4.6, -234], 'elah-shmaya': [4.6, -238], 'abba': [-4.6, -243], 'pantokrator': [4.6, -248],
  'alpha-omega': [-4.6, -253], 'ego-eimi': [4.6, -258], 'immanuel': [-4.6, -263], 'kyrios-ho-theos': [4.6, -268],
  'poimen-ho-kalos': [-4.6, -273], 'anastasis-zoe': [4.6, -278], 'ho-on-erchomenos': [-4.6, -282], 'arche-telos': [4.6, -286],
  // Зона 7 — Хорив (2)
  'ehyeh': [-10.0, -347], 'yhwh': [10.0, -347],
};

const ss = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
export const chasmF = chasmFactor;

/** Continuous subsurface roof relief: NOT a separate stalactite mesh.
 * The same cave-vault triangles deform smoothly from a single lithological
 * field. Hard limits retain >3m walking clearance even in the narrow outlet.
 * Fresher chipped faces read as subdued bedding, never emissive spikes. */
export function exitVaultRelief(x: number, y: number, z: number,
  archSin: number, archCos: number) {
  // The previous erosion faded to ZERO before the actual mouth, producing
  // a mathematically perfect black semicircle at the very exit.
  // Keep weathering at FULL strength through the last physical ring
  // (HIGH ends at z=-322, LOW at ~-321.8). The old fade [-324,-319]
  // weakened the relief precisely at the silhouette, reconstructing a
  // textbook semicircle in the final metre. The falloff now ends BEYOND
  // the existing mesh, where no new geometry/draw call is created.
  // Continuous shell, no hanging spike meshes or new collision surface.
  const envelope = ss(-326, -323, z) * (1 - ss(-298, -288, z));
  if (envelope <= 0) return { roofDrop: 0, sideOut: 0, shade: 1 };
  const grain = fbm(x * 0.74 + 17, y * 0.31 - 2, z * 0.49 + 31, 3);
  // Geological weathering occurs on several continuous wavelengths.
  // The previous raised-to-1.6 field suppressed the actual relief and
  // looked identical to the original tube from a natural walking camera.
  const grainRelief = Math.pow(Math.abs(grain - 0.5) * 2, 0.72);
  const broader = fbm(x * 0.16 - 5, y * 0.16, z * 0.12 + 8, 3);
  const fold = Math.max(0, Math.min(1, 0.42 * grainRelief + 0.58 * broader));
  const ceiling = Math.pow(Math.max(0, archSin), 2.3);
  const flank = Math.pow(Math.max(0, Math.abs(archCos)), 2.2);
  const asymmetricBedding = fbm(x * 0.28 + 7.1, y * 0.20 - 8.2, z * 0.23, 3);
  const roofDrop = envelope * ceiling * (0.27 + 0.94 * fold) *
    (0.88 + 0.26 * asymmetricBedding);
  // Move shoulders OUTWARDS, not into the navigable passage. Nonidentical
  // cliff flanks break the textbook semicircular silhouette at the mouth.
  const sideOut = envelope * flank * (0.16 + 0.54 * fold) *
    (archCos < 0 ? 1.16 : 0.82);
  return { roofDrop, sideOut, shade: 1 - envelope * (0.07 + 0.15 * fold) };
}



// Цвет породы по зонам (запечённая палитра)
const TINTS: [number, [number, number, number]][] = [
  [4, [0.42, 0.36, 0.3]], [-30, [0.58, 0.47, 0.35]], [-64, [0.55, 0.42, 0.32]], [-90, [0.62, 0.4, 0.29]],
  [-118, [0.55, 0.38, 0.27]], [-145, [0.6, 0.38, 0.23]], [-172, [0.4, 0.39, 0.4]], [-200, [0.33, 0.36, 0.42]],
  [-230, [0.39, 0.42, 0.46]], [-260, [0.38, 0.41, 0.45]], [-292, [0.33, 0.33, 0.36]], [-322, [0.36, 0.37, 0.42]],
];
/** Very local, directional-looking mineral reflectance on the opposite
 * ravine wall. Existing cave-shell triangles and textured material only:
 * no detached stratum billboards, new lights, collider or draw calls.
 * The safe left-hand path and other seven zones are unaffected. */
/** Transition to metric arc-length UVs only on the deep OPPOSITE rock face.
 * Original angular UVs are suitable for the gallery vault but stretched
 * ~50m down the ravine across just a handful of contour samples. Blending
 * by actual world coordinates preserves the existing floor, visitor ledge
 * and all seven other zones without second textures or a special material. */
/** Actual continuous, bounded geology on the opposing *deep* ravine wall.
 * The existing rock used largely planar triangles and relied on a stretched
 * texture to imply fractures. Displace its real vertices, not billboard
 * fissures, mesh overlays, procedural fake lights or new collision shapes.
 * Relief is zero at the navigable ledge, above the deep wall, and outside
 * the chasm's existing axial envelope. */
export function opposingRavineRelief(x: number, y: number, z: number, chasm: number): number {
  if (chasm <= 0 || x <= 12 || y >= -7) return 0;
  const gate = Math.min(1, Math.max(0, chasm)) *
    ss(12, 19, x) * ss(7, 23, -y);
  const broad = fbm(z * 0.075 + 7.7, y * 0.052 - 4.1, x * 0.025, 3);
  const fracture = fbm(z * 0.19 - 5.3, y * 0.11 + 8.4, x * 0.065, 3);
  const signed = (broad - 0.5) * 3.25 + (fracture - 0.5) * 1.4;
  return gate * Math.max(-1.15, Math.min(1.15, signed));
}
export function ravineMetricUvWeight(x: number, y: number, chasm: number): number {
  if (chasm <= 0 || x <= 12 || y >= -4) return 0;
  return Math.min(1, chasm) * ss(12, 18, x) * ss(4, 14, -y);
}
export function ravineStrataReflectance(x: number, y: number, z: number, chasm: number): number {
  if (chasm <= 0 || x < 12 || y >= -4) return 1;
  const depth = Math.min(1, Math.max(0, (-y - 4) / 24));
  // Gentle geological irregularity rather than repeated evenly spaced lines.
  const warp = fbm(x * 0.13 + 8, y * 0.17, z * 0.10 - 3, 3);
  const bedding = 0.5 + 0.5 * Math.sin(y * 0.91 + z * 0.045 + warp * 2.5);
  return 1 + chasm * depth * (0.36 + 0.18 * bedding);
}
function tint(z: number): [number, number, number] {
  for (let i = 0; i < TINTS.length - 1; i++) {
    const [za, a] = TINTS[i], [zb, b] = TINTS[i + 1];
    if (z <= za && z >= zb) { const t = (za - z) / (za - zb); return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  }
  return TINTS[TINTS.length - 1][1];
}
// Запечённые источники света: позиция, цвет, радиус
const BAKED: { p: [number, number, number]; c: [number, number, number]; r: number }[] = [
  { p: [2, 0, -30], c: [1.6, 1.25, 0.8], r: 6 }, { p: [0, 18, -30], c: [1.2, 1.0, 0.7], r: 8 },
  // Warm, baked entrance bounce: no additional GPU light or draw call.
  { p: [0, 4, -10], c: [1.25, 0.92, 0.62], r: 15 },
  { p: [-17, 6, -88], c: [1.5, 0.95, 0.55], r: 14 }, { p: [10, 1, -104], c: [0.3, 0.4, 0.5], r: 4 },
  { p: [-3.4, 1.6, -133], c: [1.6, 0.8, 0.35], r: 4 }, { p: [3.4, 1.6, -148], c: [1.6, 0.8, 0.35], r: 4 }, { p: [-3.4, 1.6, -163], c: [1.6, 0.8, 0.35], r: 4 },
  { p: [-3, 0, -200], c: [0.9, 1.05, 1.35], r: 7 }, { p: [0, 40, -200], c: [0.8, 0.95, 1.2], r: 10 },
  // A weak, local cold bounce reveals actual ravine strata on the distant
  // rock face. Vertex-baked only: no extra GPU light/draw call, no overall
  // cave exposure increase and no contribution at the sacred outer Horeb.
  { p: [17, 0, -200], c: [0.24, 0.29, 0.38], r: 14 },
  { p: [-5.6, 1.5, -238], c: [0.9, 0.6, 0.3], r: 2.5 }, { p: [5.6, 1.5, -254.5], c: [0.9, 0.6, 0.3], r: 2.5 }, { p: [-5.6, 1.5, -271], c: [0.9, 0.6, 0.3], r: 2.5 },
  // Cool indirect reflection from the narrowing exit; geometry remains
  // visibly different before the final moonlit exterior, not a new light.
  { p: [0, 4, -306], c: [0.21, 0.28, 0.37], r: 10 },
  { p: [0, 2, -322], c: [0.7, 0.8, 1.1], r: 16 },
];
function bake(x: number, y: number, z: number, out: [number, number, number]) {
  let r = 0.22, g = 0.21, b = 0.22;
  for (const L of BAKED) {
    const d2 = (x - L.p[0]) ** 2 + (y - L.p[1]) ** 2 + (z - L.p[2]) ** 2;
    const k = Math.exp(-d2 / (L.r * L.r));
    r += L.c[0] * k; g += L.c[1] * k; b += L.c[2] * k;
  }
  out[0] = r; out[1] = g; out[2] = b;
}

export function buildZones(low: boolean, rockMat: THREE.MeshStandardMaterial): Built {
  const group = new THREE.Group();
  const obstacles: Obstacle[] = [];
  const updaters: ((t: number, dt: number, px: number, pz: number, m: boolean) => void)[] = [];
  const particles: THREE.Points[] = [];
  const tmp: [number, number, number] = [0, 0, 0];

  // ── Тоннель / галереи: единая процедурная оболочка
  {
    const step = low ? 0.9 : 0.5, N = low ? 36 : 60;
    const zs: number[] = [];
    for (let z = 4; z >= TUNNEL_END - 4; z -= step) zs.push(z);
    const pos: number[] = [], col: number[] = [], uv: number[] = [], idx: number[] = [];
    let weatheredCliffVertices = 0, weatheredCliffMin = Infinity, weatheredCliffMax = -Infinity;
    for (let i = 0; i < zs.length; i++) {
      const z = zs[i], hw = halfWidth(z), H = vaultHeight(z), cf = chasmF(z);
      const amp = 0.6 + Math.min(2.6, (hw - 4) * 0.22) + (H > 20 ? 1.4 : 0);
      const [tr, tg, tb] = tint(z);
      let physicalArc = 0, prevX = 0, prevY = 0;
      for (let j = 0; j <= N; j++) {
        const a = -0.07 * Math.PI + (j / N) * 1.14 * Math.PI;
        const ca = Math.cos(a), sa = Math.sin(a);
        let x = hw * Math.sign(ca) * Math.pow(Math.abs(ca), 0.5);
        let y = sa >= 0 ? H * Math.pow(sa, 0.75) : sa * 4;
        const n = fbm(x * 0.22 + 7, y * 0.22, z * 0.18, low ? 3 : 4);
        const ridge = Math.abs(fbm(x * 0.05, y * 0.12, z * 0.05, 2) - 0.5) * 2;
        const disp = amp * (0.25 + n) + ridge * amp * 0.6;
        const nl = Math.hypot(x / hw, y / H) || 1;
        x += (x / hw / nl) * disp; y += (y / H / nl) * disp * 0.6;
        // Open the opposing side of zone 4 into a proper wide ravine.
        // The existing ~14 m wall stood so close to the safe viewing edge
        // that every downward sightline intersected the walking floor first.
        // Expand the SAME continuous shell, tapering smoothly to both exits;
        // no new mesh, collider, teleport or invisible safety rail.
        if (cf > 0 && ca > 0) {
          const irregular = fbm(x * 0.11 + 2, y * 0.08, z * 0.10, low ? 2 : 3);
          x += cf * Math.pow(ca, 1.35) * (8.5 + 2.1 * irregular);
        }
        if (cf > 0 && ca > 0 && y < H * 0.45) y -= cf * 55 * (1 - Math.max(-1, y) / (H * 0.45));
        const cliffRelief = opposingRavineRelief(x, y, z, cf);
        if (Math.abs(cliffRelief) > 0.001) {
          weatheredCliffVertices++;
          weatheredCliffMin = Math.min(weatheredCliffMin, cliffRelief);
          weatheredCliffMax = Math.max(weatheredCliffMax, cliffRelief);
        }
        x += cliffRelief;
        // Carve zone-6 fractures INTO the continuous cave shell. The previous
        // separate triangles looked like paper stalactites when lit. No new
        // mesh, material, collision shape or draw call is needed.
        const exit = exitVaultRelief(x, y, z, sa, ca);
        x += Math.sign(x) * exit.sideOut;
        y -= exit.roofDrop;
        // Accumulate true 3D profile length before assigning UVs. Both LODs
        // sample the same physical field and therefore get matching texture
        // density on very steep cliff faces, instead of lengthened streaks.
        if (j > 0) physicalArc += Math.hypot(x - prevX, y - prevY);
        prevX = x; prevY = y;
        pos.push(x, y, z);
        bake(x * 0.8, Math.max(0, y), z, tmp);
        const v = (0.55 + 0.6 * n) * caveSurfaceVariation(x, y, z) * exit.shade;
        const ao = (0.55 + 0.45 * Math.min(1, Math.max(0, y) / 3) *
          (1 - 0.35 * Math.max(0, y / H - 0.7))) *
          ravineStrataReflectance(x, y, z, cf);
        let vein = 1;
        if (z < -62 && z > -118) vein = 1 + 0.35 * Math.max(0, Math.sin(y * 1.7 + n * 9) - 0.85) * 6;
        col.push(tr * v * ao * tmp[0] * vein, tg * v * ao * tmp[1] * vein, tb * v * ao * tmp[2] * (vein > 1 ? 1.05 : 1));
        // World-space domain warp breaks the long UV-aligned bands in gallery walls.
        // Both components are continuous across z slices and keep one shared atlas.
        const warp = fbm(x * 0.11 + 4, y * 0.13, z * 0.11 + 8, 2) - 0.5;
        const angularU = (j / N) * (hw + H) * 0.5;
        const metricU = physicalArc * 0.25;
        const cliffUv = ravineMetricUvWeight(x, y, cf);
        uv.push(angularU + (metricU - angularU) * cliffUv + warp * 0.9,
          z * 0.25 + warp * 1.1);
      }
    }
    for (let i = 0; i < zs.length - 1; i++) for (let j = 0; j < N; j++) {
      const a = i * (N + 1) + j, b = a + N + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, rockMat);
    mesh.name = 'cave-vault-continuous';
    // One-time construction witness: confirms LOW and HIGH really received
    // physical variation. No per-frame work, new meshes or draw calls.
    mesh.userData.opposingCliffRelief = {
      affectedVertices: weatheredCliffVertices,
      min: weatheredCliffMin,
      max: weatheredCliffMax,
    };
    group.add(mesh);

    // Пол
    const M = low ? 16 : 28;
    const fp: number[] = [], fc: number[] = [], fu: number[] = [], fi: number[] = [];
    for (let i = 0; i < zs.length; i++) {
      const z = zs[i], hw = halfWidth(z) + 1.2, cf = chasmF(z);
      const xr = hw + (LEDGE_X + 0.75 - hw) * cf;
      const [tr, tg, tb] = tint(z);
      for (let j = 0; j <= M; j++) {
        let x = -hw + (xr + hw) * (j / M);
        // The chasm lip is a single eroded floor boundary, with its nearest
        // point still outside the existing nav/stele safety margin at 4.2m.
        if (j === M && cf > 0) x += cf * (
          0.075 * Math.sin(z * 0.79) + 0.065 *
          (fbm(x * 0.4, 0.7, z * 0.32, 3) - 0.5));
        const n = fbm(x * 0.4, 3, z * 0.4, 3);
        const edge = Math.max(0, Math.abs(x) - (hw - 2.2));
        const y = 0.06 * n + edge * 0.18 -
          (cf > 0 && j === M ? cf * (0.2 + 0.07 * n) : 0);
        fp.push(x, y, z);
        bake(x, 0, z, tmp);
        const wear = 1 + 0.12 * Math.exp(-(x * x) / 4);
        const v = (0.45 + 0.5 * n) * wear * 0.85 * caveSurfaceVariation(x, 0, z);
        fc.push(tr * v * tmp[0], tg * v * tmp[1], tb * v * tmp[2]);
        const warp = fbm(x * 0.12, 0.5, z * 0.12, 2) - 0.5;
        fu.push(x * 0.3 + warp * 0.4, z * 0.3 + warp * 0.5);
      }
    }
    for (let i = 0; i < zs.length - 1; i++) for (let j = 0; j < M; j++) {
      const a = i * (M + 1) + j, b = a + M + 1;
      fi.push(a, a + 1, b, b, a + 1, b + 1);
    }
    // Zone 4 is a true chasm. The former pitch-black rectangle at -52m
    // simulated depth, but there was no continuous rock between the walking
    // lip and the bottom. Extend THIS VERY FLOOR's right boundary into
    // downward bedding strata, sharing the boundary vertices and material.
    // This adds no new scene mesh, light, collision obstacle or draw call.
    // Recess deeper bedding to reveal actual geological relief. The old
    // 1.63m total recession over 43m produced an almost planar dark wall.
    // Keep the original floor-boundary vertices and same four rock strata:
    // no extra draw calls, physical rail, platform or floating billboard.
    const strata = [
      { depth: 0.85, outward: 0.11 },
      { depth: 5.8, outward: 0.73 },
      { depth: 18.5, outward: 2.30 },
      { depth: 43.0, outward: 4.80 },
    ] as const;
    const wallRows = new Map<number, number[]>();
    const floorVertexCount = fp.length / 3;
    let lowestWallY = 0, nearestWallX = Infinity, wallSegments = 0;
    for (let i = 0; i < zs.length; i++) {
      const z = zs[i], cf = chasmF(z);
      if (cf <= 0.00001) continue;
      const top = i * (M + 1) + M;
      const topX = fp[top * 3], topY = fp[top * 3 + 1];
      const row: number[] = [];
      for (let layer = 0; layer < strata.length; layer++) {
        const s = strata[layer];
        const ripple = fbm(topX * 0.31 + layer * 1.3, layer * 0.7, z * 0.29, 3);
        const x = topX + cf * (s.outward + 0.10 * layer * ripple);
        const depth = cf * (s.depth + (ripple - 0.5) * (0.2 + layer * 0.9));
        const y = topY - depth;
        const vertex = fp.length / 3;
        fp.push(x, y, z);
        const [tr, tg, tb] = tint(z);
        bake(x * 0.75, Math.max(0, y), z, tmp);
        const rockGrain = caveSurfaceVariation(x, y, z);
        // Preserve real depth attenuation while keeping far bedding just
        // legible under the existing cool vertex-baked light. Increasing
        // ambient light for the entire tunnel would flatten zone 4 and 7.
        const darkness = (0.60 + 0.28 * ripple) *
          (0.55 + 0.45 * Math.exp(-depth / 21));
        fc.push(tr * darkness * tmp[0] * rockGrain,
          tg * darkness * tmp[1] * rockGrain,
          tb * darkness * tmp[2] * rockGrain);
        const uvWarp = fbm(x * 0.2, y * 0.1, z * 0.15, 2) - 0.5;
        fu.push(y * 0.25 + uvWarp * 0.42,
          z * 0.27 + uvWarp * 0.55);
        nearestWallX = Math.min(nearestWallX, x);
        lowestWallY = Math.min(lowestWallY, y);
        row.push(vertex);
      }
      wallRows.set(i, row);
    }
    for (let i = 0; i < zs.length - 1; i++) {
      const next = wallRows.get(i + 1), row = wallRows.get(i);
      if (!row || !next) continue;
      let upperThis = i * (M + 1) + M;
      let upperNext = (i + 1) * (M + 1) + M;
      for (let layer = 0; layer < strata.length; layer++) {
        // Winding faces back toward the safe LEFT ledge (negative X).
        fi.push(upperThis, upperNext, row[layer],
          upperNext, next[layer], row[layer]);
        upperThis = row[layer]; upperNext = next[layer];
        wallSegments++;
      }
    }
    const fg = new THREE.BufferGeometry();
    fg.setAttribute('position', new THREE.Float32BufferAttribute(fp, 3));
    fg.setAttribute('color', new THREE.Float32BufferAttribute(fc, 3));
    fg.setAttribute('uv', new THREE.Float32BufferAttribute(fu, 2));
    fg.setIndex(fi);
    fg.computeVertexNormals();
    const caveFloor = new THREE.Mesh(fg, rockMat);
    caveFloor.name = 'cave-floor-continuous';
    caveFloor.userData.chasmStrata = {
      floorVertexCount, rows: wallRows.size, segments: wallSegments,
      lowestWallY, nearestWallX, levels: strata.length,
      integratedIntoFloor: true,
    };
    group.add(caveFloor);
  }

  // ── Зона 1: лучи сквозь разлом свода
  const shafts: THREE.ShaderMaterial[] = [];
  const addShaft = (x: number, y: number, z: number, w: number, h: number, rx: number, rz: number, color: number, s: number) => {
    const m = shaftMaterial(color, s); shafts.push(m);
    for (let k = 0; k < 2; k++) {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m);
      p.position.set(x, y, z); p.rotation.set(rx, k * Math.PI / 2, rz);
      group.add(p);
    }
  };
  addShaft(1, 9, -30, 3.2, 20, 0, 0.12, 0xffd9a0, 0.22);
  addShaft(-0.5, 9, -27, 1.4, 20, 0, 0.1, 0xffe2b0, 0.14);
  addShaft(-11, 6, -88, 4, 14, 0, -0.9, 0xffb878, 0.12); // зона 2: тёплый боковой свет
  // Diffuse reflected fissure light above the gorge, not a bright blue
  // laser-like column reaching the walking floor.
  addShaft(-2.5, 19, -200, 6, 33, 0, 0.03, 0xbcd4ff, 0.075);
  updaters.push((t) => shafts.forEach((m) => (m.uniforms.uT.value = t)));

  // ── Пыль в лучах (зоны 1, 2, 4) и сквозняк (зона 6)
  const dustTex = glowTexture('rgba(255,240,220,1)', 'rgba(255,240,220,0)');
  const mkDust = (cx: number, cz: number, sx: number, sy: number, sz: number, n: number, color: number, size: number, drift: [number, number, number]) => {
    const g = new THREE.BufferGeometry();
    const r = rng(n * 31 + cz | 0);
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { arr[i * 3] = cx + (r() - 0.5) * sx; arr[i * 3 + 1] = r() * sy; arr[i * 3 + 2] = cz + (r() - 0.5) * sz; }
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    const m = new THREE.PointsMaterial({ size, map: dustTex, color, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending });
    const p = new THREE.Points(g, m);
    group.add(p); particles.push(p);
    const base = arr.slice();
    updaters.push((t, _dt, _px, _pz, motion) => {
      if (!motion || !p.visible) return;
      const a = g.attributes.position.array as Float32Array;
      for (let i = 0; i < n; i++) {
        const ph = i * 1.37;
        a[i * 3] = base[i * 3] + Math.sin(t * 0.13 + ph) * 0.4 + ((t * drift[0] + ph) % sx);
        a[i * 3 + 1] = base[i * 3 + 1] + Math.sin(t * 0.09 + ph * 2) * 0.3;
        let zz = base[i * 3 + 2] + ((t * drift[2] + ph * 3) % sz);
        if (zz > cz + sz / 2) zz -= sz;
        a[i * 3 + 2] = zz;
      }
      g.attributes.position.needsUpdate = true;
    });
  };
  const k = low ? 0.35 : 1;
  mkDust(1, -30, 6, 16, 10, Math.floor(500 * k), 0xffe6c0, 0.06, [0, 0, 0]);
  mkDust(-4, -88, 22, 10, 40, Math.floor(700 * k), 0xffcf9a, 0.07, [0, 0, 0]);
  mkDust(-2, -200, 12, 38, 40, Math.floor(600 * k), 0xd8e6ff, 0.08, [0, 0, 0]);
  mkDust(0, -305, 5, 4, 26, Math.floor(260 * k), 0xcfd8ff, 0.04, [0, 0, 1.2]);

  // ── Зона 2: подземная лужица с каплей (микро-сцена)
  {
    const pool = new THREE.Mesh(new THREE.CircleGeometry(1.6, 40), new THREE.MeshStandardMaterial({ color: 0x05080a, roughness: 0.04, metalness: 0.6 }));
    pool.rotation.x = -Math.PI / 2; pool.position.set(9.5, 0.08, -104);
    group.add(pool);
    obstacles.push({ x: 9.5, z: -104, r: 1.8 });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 48), new THREE.MeshBasicMaterial({ color: 0x9fb8c8, transparent: true, opacity: 0 }));
    ring.rotation.x = -Math.PI / 2; ring.position.set(9.5, 0.1, -104);
    group.add(ring);
    const drop = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), new THREE.MeshBasicMaterial({ color: 0xcfe4ff }));
    group.add(drop);
    updaters.push((t, _dt, _px, _pz, motion) => {
      const cyc = t % 6.5;
      const fall = Math.min(1, cyc / 1.1);
      drop.visible = cyc < 1.1;
      drop.position.set(9.5, 12 * (1 - fall * fall), -104);
      const rp = (cyc - 1.1) / 2.4;
      if (rp > 0 && rp < 1) { const s = motion ? 0.05 + rp * 1.4 : 0.6; ring.scale.set(s, s, s); (ring.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - rp); }
      else (ring.material as THREE.MeshBasicMaterial).opacity = 0;
    });
  }

  // ── Зона 3: каменные жертвенники и факелы
  const stoneGeo = new THREE.DodecahedronGeometry(1, 1);
  {
    const p = stoneGeo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const v = new THREE.Vector3().fromBufferAttribute(p, i);
      v.multiplyScalar(0.75 + 0.5 * fbm(v.x * 2 + 3, v.y * 2, v.z * 2, 2));
      p.setXYZ(i, v.x, v.y, v.z);
    }
    stoneGeo.computeVertexNormals();
  }
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x8a7560, roughness: 0.95, map: rockMat.map, bumpMap: rockMat.bumpMap, bumpScale: 0.85 });
  const flameTex = glowTexture('rgba(255,230,170,1)', 'rgba(255,90,20,0)');
  const torches: THREE.Sprite[] = [];
  const altarAt = (x: number, z: number, seed: number) => {
    const r = rng(seed);
    const parts: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 9; i++) {
      const g = stoneGeo.clone();
      const s = 0.28 + r() * 0.18;
      const layer = Math.floor(i / 4);
      const m = new THREE.Matrix4().compose(
        new THREE.Vector3((r() - 0.5) * 0.9 * (1 - layer * 0.3), 0.22 + layer * 0.38, (r() - 0.5) * 0.9 * (1 - layer * 0.3)),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(r() * 3, r() * 3, r() * 3)),
        new THREE.Vector3(s * 1.2, s * 0.8, s));
      g.applyMatrix4(m); parts.push(g);
    }
    const mesh = new THREE.Mesh(mergeGeometries(parts), stoneMat);
    mesh.position.set(x, 0, z);
    group.add(mesh);
    obstacles.push({ x, z, r: 1.0 });
    // факел — простая стойка с пламенем, без «магии»
    const tx = x + (x < 0 ? 0.1 : -0.1), tz = z - 1.4;
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 1.5, 6), new THREE.MeshStandardMaterial({ color: 0x2a1d14, roughness: 1 }));
    post.position.set(tx, 0.75, tz); group.add(post);
    const fl = new THREE.Sprite(new THREE.SpriteMaterial({ map: flameTex, color: 0xffb070, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    fl.position.set(tx, 1.62, tz); fl.scale.set(0.5, 0.8, 1); group.add(fl); torches.push(fl);
    obstacles.push({ x: tx, z: tz, r: 0.35 });
  };
  altarAt(-3.3, -132, 11); altarAt(3.3, -148, 23); altarAt(-3.3, -163, 37);
  const torchLight = new THREE.PointLight(0xff9a50, 6, 14, 1.6);
  torchLight.position.set(0, 2.2, -148); group.add(torchLight);
  updaters.push((t, _dt, _px, pz, motion) => {
    const f = motion ? 0.85 + 0.15 * Math.sin(t * 11) * Math.sin(t * 7.3) : 1;
    torches.forEach((s, i) => s.scale.set(0.45 + 0.05 * Math.sin(t * 9 + i), 0.75 * f + 0.1, 1));
    torchLight.intensity = 6 * f;
    torchLight.position.z = Math.max(-163, Math.min(-132, pz));
  });

  // ── Зона 4: дно пропасти и холодный свет
  {
    // Deep rock face is now connected to the walking floor. A dark bottom
    // remains beyond its deepest stratum, but it cannot replace the wall.
    const pit = new THREE.Mesh(new THREE.PlaneGeometry(14, 48),
      new THREE.MeshBasicMaterial({ color: 0x020304 }));
    pit.name = 'chasm-deep-floor';
    pit.rotation.x = -Math.PI / 2; pit.position.set(11, -52, -200); group.add(pit);
    const mist = new THREE.Sprite(new THREE.SpriteMaterial({ map: dustTex, color: 0x6f86a8, transparent: true, opacity: 0.12, depthWrite: false }));
    mist.position.set(8, -18, -200); mist.scale.set(18, 30, 1); group.add(mist);
    const cold = new THREE.PointLight(0xb8ccff, 5, 30, 1.5); cold.position.set(-3, 12, -200); group.add(cold);
    // The cliff's navigable lip is now eroded and meshed into the floor.
    // Delete the previous 26 regularly spaced, apparently levitating rock
    // 'potatoes': they blocked the view and were redundant false geology.
  }

  // ── Зона 5: ниши позднейших свидетельств с маленькими светильниками
  for (const [id, p] of Object.entries(PLACEMENTS)) {
    if (p[1] > -232 || p[1] < -286) continue;
    void id;
    const lamp = new THREE.Sprite(new THREE.SpriteMaterial({ map: flameTex, color: 0xffa860, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.8 }));
    lamp.position.set(p[0] * 1.18, 0.35, p[1] - 0.9); lamp.scale.set(0.18, 0.26, 1); group.add(lamp);
  }

  // ── Зона 7: открытый ландшафт у Хорива
  {
    // One elevation function for both terrain vertices and distant rock crags.
    // Crags stay outside the player corridor and never alter the bush guards.
    const terrainHeight = (x: number, z: number): number => {
      const dw = Math.hypot(x / 1.3, (z - (BUSH.z + 10)) * 0.9);
      const mask = ss(36, 150, dw);
      const horeb = 330 * Math.exp(-((x - 30) ** 2 + (z + 760) ** 2) / (2 * 150 ** 2));
      const ridge = Math.pow(fbm(x * 0.006, 1, z * 0.006, 5), 2.2) * 260;
      const near = fbm(x * 0.12, 2, z * 0.12, 3) * 0.22;
      const backWall = ss(-345, -322, z) * 60 * ss(14, 60, Math.abs(x));
      return near + mask * (ridge + horeb * 0.9) + backWall;
    };
    const seg = low ? 110 : 200;
    const tg = new THREE.PlaneGeometry(1200, 1000, seg, seg);
    tg.rotateX(-Math.PI / 2);
    // Abut the existing cave floor without overlapping it by ~3 metres.
    // Its near edge is z=-322, while low/high cave strips end at -321.8/-322.
    tg.translate(0, 0, TUNNEL_END - 4 - 500);
    const p = tg.attributes.position;
    const tc: number[] = [];
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i);
      const y = terrainHeight(x, z);
      p.setY(i, y);
      const v = 0.5 + 0.5 * fbm(x * 0.05, 5, z * 0.05, 3);
      const hcol = Math.min(1, y / 200);
      const outdoor = [(0.26 + hcol * 0.08) * v,
        (0.2 + hcol * 0.05) * v, (0.17 + hcol * 0.06) * v];
      // A physically adjacent ground plane should not switch from near-black
      // cave floor to orange sand at the seam. Match the real cave vertex
      // field at the lip, then fade into natural exterior earth by z=-340.
      const mouth = ss(-340, TUNNEL_END - 4, z);
      if (mouth > 0) {
        const [tr, tg, tb] = tint(z);
        bake(x, 0, z, tmp);
        const floorN = fbm(x * 0.4, 3, z * 0.4, 3);
        const floorWear = 1 + 0.12 * Math.exp(-(x * x) / 4);
        const rockValue = (0.45 + 0.5 * floorN) * floorWear * 0.85 *
          caveSurfaceVariation(x, 0, z);
        tc.push(
          outdoor[0] * (1 - mouth) + tr * rockValue * tmp[0] * mouth,
          outdoor[1] * (1 - mouth) + tg * rockValue * tmp[1] * mouth,
          outdoor[2] * (1 - mouth) + tb * rockValue * tmp[2] * mouth,
        );
      } else tc.push(...outdoor);
    }
    tg.setAttribute('color', new THREE.Float32BufferAttribute(tc, 3));
    tg.computeVertexNormals();
    const terrainMat = rockMat.clone();
    terrainMat.side = THREE.FrontSide;
    const exteriorTerrain = new THREE.Mesh(tg, terrainMat);
    exteriorTerrain.name = 'horeb-exterior-terrain';
    group.add(exteriorTerrain);

    // Deterministic distant geology frames the narrow wilderness approach.
    // All instances are beyond x=±26m (the traversable region); no invisible
    // collision or new lights. Heights sample the SAME terrain function.
    const crags = new THREE.InstancedMesh(stoneGeo, stoneMat, low ? 32 : 64);
    crags.name = 'horeb-distant-crags';
    const cliffRng = rng(72026), cliffMatrix = new THREE.Matrix4();
    for (let i = 0; i < crags.count; i++) {
      const sign = i % 2 === 0 ? -1 : 1;
      const x = sign * (29 + cliffRng() * 23);
      const z = -326 - cliffRng() * 70;
      const size = 1.4 + cliffRng() * 3.6;
      cliffMatrix.compose(new THREE.Vector3(x, terrainHeight(x, z) + size * 0.24, z),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(
          (cliffRng() - 0.5) * 0.4, cliffRng() * Math.PI, (cliffRng() - 0.5) * 0.35)),
        new THREE.Vector3(size * (0.7 + cliffRng() * 0.4),
          size * (1.2 + cliffRng() * 0.8), size * (0.6 + cliffRng() * 0.4)));
      crags.setMatrixAt(i, cliffMatrix);
    }
    crags.instanceMatrix.needsUpdate = true;
    group.add(crags);

    // Скальная стена с выходом
    const shape = new THREE.Shape();
    shape.moveTo(-260, -2); shape.lineTo(260, -2); shape.lineTo(260, 120); shape.lineTo(-260, 120); shape.lineTo(-260, -2);
    // The old perfectly round 2.7 m doorway was NARROWER than the actual
    // tunnel shell; it cut into the view as two brown vertical streaks.
    // A wider, gently eroded irregular aperture surrounds the cave's real
    // 3D end profile instead of cutting across it.
    const hole = new THREE.Path();
    hole.moveTo(-3.6, -1.5);
    hole.lineTo(3.6, -1.5);
    hole.lineTo(3.6, 1.4);
    hole.bezierCurveTo(3.7, 3.8, 2.7, 5.6, 0.9, 6.0);
    hole.bezierCurveTo(-1.1, 6.3, -3.1, 5.4, -3.6, 2.4);
    hole.lineTo(-3.6, -1.5);
    shape.holes.push(hole);
    const cg = new THREE.ShapeGeometry(shape, 24);
    const cp = cg.attributes.position;
    // уплотнение: тесселяция ShapeGeometry грубая — компенсируем вертикальным сдвигом верхнего края
    for (let i = 0; i < cp.count; i++) {
      const x = cp.getX(i), y = cp.getY(i);
      const nearHole = Math.hypot(x, Math.max(0, y - 3)) < 6.4;
      if (y > 100) cp.setY(i, 70 + fbm(x * 0.02, 0, 0, 4) * 90);
      cp.setZ(i, nearHole ? 0 : fbm(x * 0.05, y * 0.05, 1, 3) * 8);
    }
    cg.computeVertexNormals();
    const cliff = new THREE.Mesh(cg, new THREE.MeshStandardMaterial({ color: 0x515057, roughness: 1, map: rockMat.map, bumpMap: rockMat.bumpMap, bumpScale: 3, side: THREE.DoubleSide }));
    cliff.name = 'horeb-outer-rock-face';
    cliff.rotation.y = Math.PI;
    cliff.position.set(0, 0, TUNNEL_END - 1.5);
    group.add(cliff);

    // Природные камни-рубежи: внешний порог — рассыпь мелких камней; внутренний — низкий скальный гребень
    const r = rng(5);
    // Loose natural scree subtly marks the thresholds. Earlier equal-angle
    // placements made two artificial, almost ceremonial stone circles.
    // Collision/sandal rules remain governed ONLY by R_OUTER and R_INNER.
    const thresholdScree = (name: string, radius: number, count: number, smin: number, smax: number, spread: number) => {
      const im = new THREE.InstancedMesh(stoneGeo, stoneMat, count);
      im.name = name;
      const m = new THREE.Matrix4();
      for (let i = 0; i < count; i++) {
        const a = r() * Math.PI * 2; // stochastic gaps and natural clusters
        const rr = radius + (r() - 0.5) * spread;
        const s = smin + r() * (smax - smin);
        m.compose(new THREE.Vector3(BUSH.x + Math.cos(a) * rr, s * 0.3, BUSH.z + Math.sin(a) * rr),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(r() * 3, r() * 3, r() * 3)), new THREE.Vector3(s * 1.3, s * 0.6, s));
        im.setMatrixAt(i, m);
      }
      group.add(im);
    };
    thresholdScree('outer-threshold-scree', R_OUTER + 0.8, 36, 0.12, 0.28, 3.4);
    thresholdScree('inner-threshold-scree', R_INNER + 0.8, 25, 0.22, 0.48, 2.4);
    // рассеянные валуны
    const boulders = new THREE.InstancedMesh(stoneGeo, stoneMat, low ? 120 : 320);
    const m = new THREE.Matrix4();
    for (let i = 0; i < boulders.count; i++) {
      let x = 0, z = 0;
      do { x = (r() - 0.5) * 120; z = TUNNEL_END - 6 - r() * 110; } while (Math.abs(x) < 27 && z > -398 || Math.hypot(x - BUSH.x, z - BUSH.z) < R_OUTER + 2);
      const s = 0.3 + Math.pow(r(), 3) * 3.5;
      m.compose(new THREE.Vector3(x, s * 0.2, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(r(), r() * 6, r())), new THREE.Vector3(s * 1.4, s * 0.8, s));
      boulders.setMatrixAt(i, m);
    }
    group.add(boulders);
    // маленькие камни в зоне прогулки
    const pebbles = new THREE.InstancedMesh(stoneGeo, stoneMat, low ? 80 : 200);
    for (let i = 0; i < pebbles.count; i++) {
      let x = 0, z = 0;
      do { x = (r() - 0.5) * 50; z = TUNNEL_END - 4 - r() * 76; } while (Math.hypot(x - BUSH.x, z - BUSH.z) < R_INNER + 1.5);
      const s = 0.05 + r() * 0.12;
      m.compose(new THREE.Vector3(x, s * 0.2, z), new THREE.Quaternion().setFromEuler(new THREE.Euler(r(), r() * 6, r())), new THREE.Vector3(s * 1.4, s * 0.7, s));
      pebbles.setMatrixAt(i, m);
    }
    group.add(pebbles);

    // Небо: предрассветный градиент + звёзды
    const sky = new THREE.Mesh(new THREE.SphereGeometry(1400, 32, 16), new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      vertexShader: `varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
      fragmentShader: `varying vec3 vP; void main(){ float h = max(vP.y, 0.0);
        vec3 top = vec3(0.012,0.018,0.045); vec3 mid = vec3(0.05,0.065,0.13); vec3 hor = vec3(0.32,0.2,0.16);
        float east = pow(max(0.0, dot(normalize(vec3(vP.x,0.0,vP.z)), vec3(0.6,0.0,-0.8))), 3.0);
        vec3 c = mix(mid, top, smoothstep(0.0, 0.5, h));
        c = mix(c, hor, (1.0 - smoothstep(0.0, 0.16, h)) * (0.35 + 0.65*east));
        gl_FragColor = vec4(c, 1.0);} `,
    }));
    sky.position.set(0, 0, -500);
    group.add(sky);
    const sn = low ? 900 : 2200;
    const sg = new THREE.BufferGeometry();
    const sa = new Float32Array(sn * 3);
    for (let i = 0; i < sn; i++) {
      const u = r() * Math.PI * 2, v = Math.acos(1 - r() * 0.95);
      sa[i * 3] = Math.sin(v) * Math.cos(u) * 1300; sa[i * 3 + 1] = Math.cos(v) * 1300 + 40; sa[i * 3 + 2] = Math.sin(v) * Math.sin(u) * 1300 - 500;
    }
    sg.setAttribute('position', new THREE.BufferAttribute(sa, 3));
    const stars = new THREE.Points(sg, new THREE.PointsMaterial({ size: 1.6, sizeAttenuation: false, color: 0xdfe6ff, transparent: true, opacity: 0.85, fog: false, depthWrite: false }));
    group.add(stars);
  }

  return {
    group, obstacles, particles,
    update: (t, dt, px, pz, m) => updaters.forEach((u) => u(t, dt, px, pz, m)),
  };
}
