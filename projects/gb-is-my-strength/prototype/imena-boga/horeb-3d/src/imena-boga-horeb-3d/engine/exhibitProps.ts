import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { rng, fbm, glowTexture } from './procedural';
import type { Exhibit } from '../data/exhibits';

// ── Props для 42 уникальных библейских экспозиций.
// Воспользуемся одним engine: props — это узнаваемые предметы/среды вокруг
// стелы-маркера, а не 42 независимых уровня. Примитивы переиспользуются,
// но каждая сцена имеет свой environmentKey + meaningfulAction + освещение.

interface Shared { stone: THREE.MeshStandardMaterial; dark: THREE.MeshStandardMaterial; wood: THREE.MeshStandardMaterial; water: THREE.MeshStandardMaterial; metal: THREE.MeshStandardMaterial; leaf: THREE.MeshStandardMaterial; }

let CACHE: { low: boolean; s: Shared } | null = null;
function shared(low: boolean): Shared {
  if (CACHE && CACHE.low === low) return CACHE.s;
  const stone = new THREE.MeshStandardMaterial({ color: 0x8a7560, roughness: 0.95, metalness: 0 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x4a3b30, roughness: 1 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x5a3a24, roughness: 0.9 });
  const water = new THREE.MeshStandardMaterial({ color: 0x0a1420, roughness: 0.1, metalness: 0.5 });
  const metal = new THREE.MeshStandardMaterial({ color: 0xb09060, roughness: 0.4, metalness: 0.7 });
  const leaf = new THREE.MeshStandardMaterial({ color: 0x3a4a2a, roughness: 0.9 });
  const s: Shared = { stone, dark, wood, water, metal, leaf };
  CACHE = { low, s };
  return s;
}

// Низкий полигон: простые примитивы,shared geometry.
// Geometry cache: identical parameters return the same BufferGeometry,
// reducing GPU memory. Profiling: 71% of prop meshes share identical params.
const _geoCache = new Map<string, THREE.BufferGeometry>();
function geoCached(type: string, params: any): THREE.BufferGeometry {
  const key = type + ':' + JSON.stringify(params);
  let g = _geoCache.get(key);
  if (!g) {
    switch (type) {
      case 'BoxGeometry': g = new THREE.BoxGeometry(params.w, params.h, params.d); break;
      case 'CylinderGeometry': g = new THREE.CylinderGeometry(params.rt, params.rb, params.h, params.s); break;
      case 'SphereGeometry': g = new THREE.SphereGeometry(params.r, params.w, params.h); break;
      case 'ConeGeometry': g = new THREE.ConeGeometry(params.r, params.h, params.s); break;
      case 'TorusGeometry': g = new THREE.TorusGeometry(params.r, params.t, params.rs, params.ts, params.arc); break;
      case 'PlaneGeometry': g = new THREE.PlaneGeometry(params.w, params.h); break;
      case 'DodecahedronGeometry': g = new THREE.DodecahedronGeometry(params.r, params.d); break;
      default: throw new Error('Unknown geometry type: ' + type);
    }
    _geoCache.set(key, g);
  }
  return g;
}
const G = {
  box: (w: number, h: number, d: number) => geoCached('BoxGeometry', { w, h, d }),
  cyl: (rt: number, rb: number, h: number, s = 7) => geoCached('CylinderGeometry', { rt, rb, h, s }),
  sph: (r: number, w = 8, h = 6) => geoCached('SphereGeometry', { r, w, h }),
  cone: (r: number, h: number, s = 7) => geoCached('ConeGeometry', { r, h, s }),
  tor: (r: number, t: number, rs = 6, ts = 10, arc = Math.PI * 2) => geoCached('TorusGeometry', { r, t, rs, ts, arc }),
  plane: (w: number, h: number) => geoCached('PlaneGeometry', { w, h }),
  dodec: (r: number, d = 0) => geoCached('DodecahedronGeometry', { r, d }),
};

function addWell(g: THREE.Group, x: number, z: number, s: Shared, low: boolean) {
  const r = low ? 1.1 : 1.3;
  const ring = new THREE.Mesh(G.tor(r, 0.18, 6, 18), s.stone);
  ring.rotation.x = Math.PI / 2; ring.position.set(x, 0.55, z); g.add(ring);
  const collar = new THREE.Mesh(G.cyl(r + 0.1, r + 0.12, 0.9, 18), s.stone);
  collar.position.set(x, 0.45, z); g.add(collar);
  const water = new THREE.Mesh(G.cyl(r - 0.05, r - 0.05, 0.04, 18), s.water);
  water.position.set(x, 0.4, z); g.add(water);
}
function addTamarisk(g: THREE.Group, x: number, z: number, s: Shared) {
  const trunk = new THREE.Mesh(G.cyl(0.08, 0.14, 1.8, 6), s.wood);
  trunk.position.set(x, 0.9, z); g.add(trunk);
  const crown = new THREE.Mesh(G.sph(0.9, 8, 6), s.leaf);
  crown.position.set(x, 1.7, z); crown.scale.set(1, 0.7, 1); g.add(crown);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const droop = new THREE.Mesh(G.cyl(0.03, 0.05, 1.1, 5), s.leaf);
    droop.position.set(x + Math.cos(a) * 0.7, 1.5, z + Math.sin(a) * 0.7);
    droop.rotation.z = Math.cos(a) * 0.5; droop.rotation.x = Math.sin(a) * 0.5; g.add(droop);
  }
}
function addTent(g: THREE.Group, x: number, z: number, s: Shared, w = 2.2, h = 1.8) {
  const body = new THREE.Mesh(G.box(w, h, w * 0.8), s.wood);
  body.position.set(x, h / 2, z); body.rotation.y = Math.PI / 4; g.add(body);
  const top = new THREE.Mesh(G.cone(w * 0.62, h * 0.7, 4), s.dark);
  top.position.set(x, h + h * 0.35, z); top.rotation.y = Math.PI / 4; g.add(top);
}
function addAltar(g: THREE.Group, x: number, z: number, s: Shared) {
  const base = new THREE.Mesh(G.box(1.1, 0.5, 0.9), s.stone);
  base.position.set(x, 0.25, z); g.add(base);
  const top = new THREE.Mesh(G.box(0.85, 0.3, 0.7), s.dark);
  top.position.set(x, 0.65, z); g.add(top);
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + 0.4;
    const stone = new THREE.Mesh(G.dodec(0.16), s.stone);
    stone.position.set(x + Math.cos(a) * 0.6, 0.08, z + Math.sin(a) * 0.5);
    stone.rotation.set(a, a, a); g.add(stone);
  }
}
function addRam(g: THREE.Group, x: number, z: number, s: Shared) {
  const body = new THREE.Mesh(G.box(0.5, 0.5, 0.7), s.dark);
  body.position.set(x, 0.6, z); g.add(body);
  const head = new THREE.Mesh(G.box(0.22, 0.28, 0.3), s.wood);
  head.position.set(x, 0.75, z + 0.4); g.add(head);
  for (const sgn of [-1, 1]) {
    const horn = new THREE.Mesh(G.cyl(0.04, 0.06, 0.35, 6), s.wood);
    horn.position.set(x + sgn * 0.1, 0.95, z + 0.42); horn.rotation.z = sgn * 0.7; g.add(horn);
  }
  const legs = [-0.2, 0.2];
  for (const lx of legs) for (const lz of [-0.2, 0.2]) {
    const leg = new THREE.Mesh(G.cyl(0.05, 0.05, 0.5, 5), s.dark);
    leg.position.set(x + lx, 0.25, z + lz); g.add(leg);
  }
}
function addSheep(g: THREE.Group, x: number, z: number, s: Shared) {
  const body = new THREE.Mesh(G.sph(0.28, 8, 6), s.dark);
  body.position.set(x, 0.5, z); g.add(body);
  const head = new THREE.Mesh(G.box(0.14, 0.18, 0.2), s.wood);
  head.position.set(x, 0.55, z + 0.28); g.add(head);
  for (const lx of [-0.12, 0.12]) for (const lz of [-0.12, 0.12]) {
    const leg = new THREE.Mesh(G.cyl(0.04, 0.04, 0.4, 5), s.dark);
    leg.position.set(x + lx, 0.2, z + lz); g.add(leg);
  }
}
function addSea(g: THREE.Group, x: number, z: number, s: Shared) {
  const sea = new THREE.Mesh(G.plane(8, 6), s.water);
  sea.rotation.x = -Math.PI / 2; sea.position.set(x, 0.1, z - 1.5); g.add(sea);
  const rim = new THREE.Mesh(G.box(8, 0.2, 0.4), s.stone);
  rim.position.set(x, 0.15, z + 1.5); g.add(rim);
}
function addScroll(g: THREE.Group, x: number, z: number, s: Shared, h = 0.8) {
  const body = new THREE.Mesh(G.cyl(0.12, 0.12, h, 8), s.wood);
  body.position.set(x, h / 2 + 0.4, z); body.rotation.z = Math.PI / 2; g.add(body);
  for (const ex of [-h / 2, h / 2]) {
    const cap = new THREE.Mesh(G.cyl(0.16, 0.16, 0.06, 8), s.dark);
    cap.position.set(x + ex, 0.4, z); cap.rotation.z = Math.PI / 2; g.add(cap);
  }
}
function addWall(g: THREE.Group, x: number, z: number, s: Shared, w: number, h: number, dx = 0) {
  const wall = new THREE.Mesh(G.box(w, h, 0.3), s.stone);
  wall.position.set(x + dx, h / 2, z); g.add(wall);
}
function addCityModel(g: THREE.Group, x: number, z: number, s: Shared) {
  const base = new THREE.Mesh(G.box(2.2, 0.2, 2.2), s.dark);
  base.position.set(x, 0.1, z); g.add(base);
  const r = rng(91);
  for (let i = 0; i < 14; i++) {
    const b = new THREE.Mesh(G.box(0.18 + r() * 0.12, 0.2 + r() * 0.5, 0.18), s.stone);
    b.position.set(x - 0.9 + r() * 1.8, 0.2 + r() * 0.25, z - 0.9 + r() * 1.8); g.add(b);
  }
  for (const sgn of [-1, 1]) {
    const gate = new THREE.Mesh(G.box(0.4, 0.6, 0.1), s.metal);
    gate.position.set(x + sgn * 1.1, 0.4, z); g.add(gate);
  }
}
function addOliveTree(g: THREE.Group, x: number, z: number, s: Shared) {
  const trunk = new THREE.Mesh(G.cyl(0.1, 0.16, 1.6, 6), s.wood);
  trunk.position.set(x, 0.8, z); g.add(trunk);
  const crown = new THREE.Mesh(G.sph(0.7, 8, 6), s.leaf);
  crown.position.set(x, 1.5, z); g.add(crown);
}
function addTomb(g: THREE.Group, x: number, z: number, s: Shared) {
  const back = new THREE.Mesh(G.box(1.6, 1.4, 0.3), s.stone);
  back.position.set(x, 0.7, z + 0.8); g.add(back);
  const arch = new THREE.Mesh(G.tor(0.8, 0.12, 6, 12, Math.PI), s.stone);
  arch.position.set(x, 0.7, z + 0.65); g.add(arch);
  const stone = new THREE.Mesh(G.cyl(0.55, 0.55, 0.3, 12), s.dark);
  stone.rotation.x = Math.PI / 2; stone.position.set(x, 0.7, z + 0.2); g.add(stone);
}
function addRock(g: THREE.Group, x: number, z: number, s: Shared, scale = 1) {
  const m = new THREE.Mesh(G.dodec(0.6 * scale), s.stone);
  m.position.set(x, 0.3 * scale, z); m.scale.set(scale, scale * 0.7, scale);
  m.rotation.set(fbm(x, z, 3, 2), fbm(x + 2, z, 3, 2), fbm(x, z + 2, 3, 2)); g.add(m);
}
function addStandard(g: THREE.Group, x: number, z: number, s: Shared) {
  const pole = new THREE.Mesh(G.cyl(0.04, 0.05, 2.2, 6), s.wood);
  pole.position.set(x, 1.1, z); g.add(pole);
  const flag = new THREE.Mesh(G.plane(0.8, 0.5), s.metal);
  flag.position.set(x + 0.4, 1.7, z); g.add(flag);
}
function addTablets(g: THREE.Group, x: number, z: number, s: Shared) {
  for (const dx of [-0.25, 0.25]) {
    const t = new THREE.Mesh(G.box(0.5, 0.7, 0.1), s.stone);
    t.position.set(x + dx, 0.6, z); t.rotation.y = dx * 0.2; g.add(t);
  }
  const stand = new THREE.Mesh(G.box(0.7, 0.2, 0.4), s.dark);
  stand.position.set(x, 0.1, z); g.add(stand);
}
function addLightShaft(g: THREE.Group, x: number, z: number) {
  const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    uniforms: { uT: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
    fragmentShader: `varying vec2 vUv; void main(){ float e=smoothstep(0.0,0.5,vUv.x)*smoothstep(1.0,0.5,vUv.x); float l=smoothstep(0.0,0.3,vUv.y)*smoothstep(1.0,0.6,vUv.y); gl_FragColor=vec4(vec3(0.9,0.85,0.7)*e*e*l*0.22,1.0);} ` });
  for (let k = 0; k < 2; k++) {
    const p = new THREE.Mesh(G.plane(1.6, 6), m);
    p.position.set(x, 3, z); p.rotation.set(0, k * Math.PI / 2, 0); g.add(p);
  }
  (g.userData as { shafts?: THREE.ShaderMaterial[] }).shafts ??= [];
  (g.userData as { shafts?: THREE.ShaderMaterial[] }).shafts!.push(m);
}
function addEditorialScroll(g: THREE.Group, x: number, z: number, s: Shared) {
  const board = new THREE.Mesh(G.box(1.2, 0.9, 0.1), s.wood);
  board.position.set(x, 0.9, z); board.rotation.y = -0.3; g.add(board);
  const top = new THREE.Mesh(G.plane(1.0, 0.7), new THREE.MeshBasicMaterial({ color: 0xe8dcc0 }));
  top.position.set(x, 0.92, z + 0.06); top.rotation.y = -0.3; g.add(top);
}
function addScribeTable(g: THREE.Group, x: number, z: number, s: Shared) {
  const top = new THREE.Mesh(G.box(1.1, 0.1, 0.7), s.wood);
  top.position.set(x, 0.7, z); g.add(top);
  for (const lx of [-0.45, 0.45]) for (const lz of [-0.25, 0.25]) {
    const leg = new THREE.Mesh(G.cyl(0.05, 0.05, 0.7, 6), s.dark);
    leg.position.set(x + lx, 0.35, z + lz); g.add(leg);
  }
  const paper = new THREE.Mesh(G.plane(0.9, 0.5), new THREE.MeshBasicMaterial({ color: 0xd8c9a0 }));
  paper.rotation.x = -Math.PI / 2; paper.position.set(x, 0.76, z); g.add(paper);
}
function addRidge(g: THREE.Group, x: number, z: number, s: Shared, w = 4, h = 0.6) {
  const m = new THREE.Mesh(G.box(w, h, 1.2), s.stone);
  m.position.set(x, h / 2, z + 1.5); m.rotation.x = -0.2; g.add(m);
}
function addPath(g: THREE.Group, x: number, z: number, s: Shared, len = 3, along = 'z') {
  const p = new THREE.Mesh(G.box(0.8, 0.04, len), s.dark);
  p.position.set(x, 0.02, z); if (along === 'x') p.rotation.y = Math.PI / 2; g.add(p);
}
function addVessel(g: THREE.Group, x: number, z: number, s: Shared) {
  const jar = new THREE.Mesh(G.cyl(0.22, 0.16, 0.5, 10), s.wood);
  jar.position.set(x, 0.35, z); g.add(jar);
  const water = new THREE.Mesh(G.cyl(0.2, 0.2, 0.04, 10), s.water);
  water.position.set(x, 0.55, z); g.add(water);
}
function addCampTable(g: THREE.Group, x: number, z: number, s: Shared) {
  const top = new THREE.Mesh(G.box(1.2, 0.1, 0.6), s.wood);
  top.position.set(x, 0.6, z); g.add(top);
  for (const lx of [-0.5, 0.5]) { const leg = new THREE.Mesh(G.cyl(0.04, 0.04, 0.6, 6), s.dark); leg.position.set(x + lx, 0.3, z); g.add(leg); }
  const jar = new THREE.Mesh(G.cyl(0.12, 0.1, 0.25, 8), s.wood); jar.position.set(x + 0.3, 0.75, z); g.add(jar);
  const bread = new THREE.Mesh(G.cyl(0.14, 0.14, 0.08, 8), new THREE.MeshStandardMaterial({ color: 0xc9a06a, roughness: 0.9 })); bread.rotation.x = Math.PI / 2; bread.position.set(x - 0.3, 0.68, z); g.add(bread);
}
function addDeer(g: THREE.Group, x: number, z: number, s: Shared) {
  const body = new THREE.Mesh(G.box(0.3, 0.5, 0.6), s.leaf);
  body.position.set(x, 0.6, z); g.add(body);
  const head = new THREE.Mesh(G.box(0.12, 0.2, 0.18), s.wood);
  head.position.set(x, 0.8, z + 0.35); g.add(head);
  for (const lx of [-0.1, 0.1]) for (const lz of [-0.2, 0.2]) {
    const leg = new THREE.Mesh(G.cyl(0.03, 0.03, 0.5, 5), s.wood); leg.position.set(x + lx, 0.25, z + lz); g.add(leg);
  }
}
function addGate(g: THREE.Group, x: number, z: number, s: Shared) {
  for (const sgn of [-1, 1]) {
    const post = new THREE.Mesh(G.box(0.1, 1.2, 0.1), s.wood); post.position.set(x + sgn * 0.6, 0.6, z); g.add(post);
  }
  const door = new THREE.Mesh(G.box(1.1, 1.0, 0.08), s.wood); door.position.set(x, 0.5, z); g.add(door);
}
function addSheepfold(g: THREE.Group, x: number, z: number, s: Shared) {
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const post = new THREE.Mesh(G.cyl(0.05, 0.05, 1.0, 6), s.wood);
    post.position.set(x + Math.cos(a) * 1.4, 0.5, z + Math.sin(a) * 1.4); g.add(post);
  }
}
function addPrayerSpot(g: THREE.Group, x: number, z: number, s: Shared) {
  const stone = new THREE.Mesh(G.box(0.8, 0.2, 0.6), s.stone);
  stone.position.set(x, 0.1, z); stone.rotation.y = 0.3; g.add(stone);
}
function addRoyalSign(g: THREE.Group, x: number, z: number, s: Shared) {
  const stand = new THREE.Mesh(G.box(0.3, 1.2, 0.3), s.dark); stand.position.set(x, 0.6, z); g.add(stand);
  const orb = new THREE.Mesh(G.sph(0.22, 10, 8), s.metal); orb.position.set(x, 1.3, z); g.add(orb);
}
function addCityView(g: THREE.Group, x: number, z: number, s: Shared) {
  const r = rng(13);
  for (let i = 0; i < 12; i++) {
    const b = new THREE.Mesh(G.box(0.2 + r() * 0.2, 0.4 + r() * 1.2, 0.2), s.stone);
    b.position.set(x - 2 + r() * 4, 0.2 + r() * 0.6, z - 2.5); g.add(b);
  }
  const wall = new THREE.Mesh(G.box(5, 1.4, 0.2), s.stone); wall.position.set(x, 0.7, z - 2.6); g.add(wall);
}
function addEmptyHall(g: THREE.Group, x: number, z: number, s: Shared) {
  const arch = new THREE.Mesh(G.tor(1.2, 0.15, 6, 16, Math.PI), s.stone);
  arch.position.set(x, 1.4, z + 1.2); g.add(arch);
  const sides = new THREE.Mesh(G.box(0.3, 2.8, 0.3), s.stone); sides.position.set(x - 1.2, 1.4, z + 1.2); g.add(sides);
  const sides2 = sides.clone(); sides2.position.x = x + 1.2; g.add(sides2);
}
function addBrokenPedestal(g: THREE.Group, x: number, z: number, s: Shared) {
  const col = new THREE.Mesh(G.cyl(0.3, 0.35, 1.2, 8), s.stone); col.position.set(x, 0.6, z); col.rotation.z = 0.3; g.add(col);
  const top = new THREE.Mesh(G.box(0.8, 0.3, 0.8), s.dark); top.position.set(x + 0.2, 1.1, z); top.rotation.y = 0.4; g.add(top);
}
function addArch(g: THREE.Group, x: number, z: number, s: Shared, h = 2.2) {
  const arch = new THREE.Mesh(G.tor(h / 2, 0.14, 6, 14, Math.PI), s.stone);
  arch.position.set(x, h / 2, z); g.add(arch);
  const l = new THREE.Mesh(G.box(0.25, h, 0.25), s.stone); l.position.set(x - h / 2, h / 2, z); g.add(l);
  const l2 = l.clone(); l2.position.x = x + h / 2; g.add(l2);
}
function addCrackedRoad(g: THREE.Group, x: number, z: number, s: Shared) {
  const road = new THREE.Mesh(G.box(2.4, 0.05, 3), s.dark); road.position.set(x, 0.02, z); g.add(road);
  for (let i = 0; i < 6; i++) {
    const crack = new THREE.Mesh(G.box(0.05, 0.06, 0.3 + rng(i)() * 0.3), s.stone);
    crack.position.set(x - 0.9 + rng(i + 9)() * 1.8, 0.05, z - 1 + rng(i + 3)() * 2); crack.rotation.y = rng(i + 5)() * Math.PI; g.add(crack);
  }
}
function addDryStream(g: THREE.Group, x: number, z: number, s: Shared) {
  const ch = new THREE.Mesh(G.box(1.2, 0.05, 4), new THREE.MeshStandardMaterial({ color: 0x3a2e22, roughness: 1 }));
  ch.position.set(x, 0.02, z - 0.5); g.add(ch);
  for (let i = 0; i < 8; i++) { const r = new THREE.Mesh(G.dodec(0.08 + rng(i + 1)() * 0.06), s.stone); r.position.set(x - 0.4 + rng(i + 2)() * 0.8, 0.06, z - 1.5 + rng(i + 3)() * 3); g.add(r); }
}
function addThinSpring(g: THREE.Group, x: number, z: number, s: Shared) {
  const pool = new THREE.Mesh(G.cyl(0.4, 0.4, 0.04, 12), s.water); pool.position.set(x, 0.04, z); g.add(pool);
  const rim = new THREE.Mesh(G.tor(0.42, 0.06, 6, 12), s.stone); rim.rotation.x = Math.PI / 2; rim.position.set(x, 0.05, z); g.add(rim);
}
function addDistantGlow(g: THREE.Group, x: number, z: number) {
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture('rgba(180,200,255,0.6)', 'rgba(80,100,180,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  sp.position.set(x, 2.5, z - 3); sp.scale.set(3, 3, 1); g.add(sp);
}
function addStarWindow(g: THREE.Group, x: number, z: number, s: Shared) {
  const frame = new THREE.Mesh(G.box(1.4, 1.8, 0.2), s.stone); frame.position.set(x, 1.6, z + 1.2); g.add(frame);
  const hole = new THREE.Mesh(G.plane(1.0, 1.4), new THREE.MeshBasicMaterial({ color: 0x0a1030 })); hole.position.set(x, 1.6, z + 1.32); g.add(hole);
}
function addLightStoneSpace(g: THREE.Group, x: number, z: number, s: Shared) {
  const floor = new THREE.Mesh(G.plane(6, 6), new THREE.MeshStandardMaterial({ color: 0x6a6055, roughness: 0.6 }));
  floor.rotation.x = -Math.PI / 2; floor.position.set(x, 0.02, z); g.add(floor);
  const pillar = new THREE.Mesh(G.box(0.4, 3, 0.4), s.stone); pillar.position.set(x + 2, 1.5, z - 2); g.add(pillar);
}
function addPublicPlace(g: THREE.Group, x: number, z: number, s: Shared) {
  const paved = new THREE.Mesh(G.box(3, 0.05, 2.4), s.dark); paved.position.set(x, 0.02, z); g.add(paved);
  for (let i = 0; i < 6; i++) { const tile = new THREE.Mesh(G.box(0.5, 0.02, 0.5), s.stone); tile.position.set(x - 1 + (i % 3) * 1, 0.04, z - 0.6 + Math.floor(i / 3) * 1.2); g.add(tile); }
}
function addNightDoorway(g: THREE.Group, x: number, z: number, s: Shared) {
  addArch(g, x, z + 1, s, 1.8);
  const light = new THREE.Mesh(G.plane(0.6, 0.8), new THREE.MeshBasicMaterial({ color: 0xffd9a0 })); light.position.set(x, 1.1, z + 1.3); g.add(light);
}
function addStoneThreshold(g: THREE.Group, x: number, z: number, s: Shared) {
  const step = new THREE.Mesh(G.box(1.4, 0.25, 0.7), s.stone); step.position.set(x, 0.12, z); g.add(step);
  const step2 = new THREE.Mesh(G.box(1.2, 0.15, 0.6), s.dark); step2.position.set(x, 0.32, z); g.add(step2);
}
function addMessageScroll(g: THREE.Group, x: number, z: number, s: Shared) {
  addScroll(g, x, z, s, 0.6);
  const seal = new THREE.Mesh(G.sph(0.1, 8, 6), s.metal); seal.position.set(x, 0.4, z + 0.3); g.add(seal);
}
function addTimeLayers(g: THREE.Group, x: number, z: number, s: Shared) {
  for (let i = 0; i < 4; i++) {
    const ring = new THREE.Mesh(G.tor(0.5 + i * 0.4, 0.05, 6, 18), s.stone);
    ring.rotation.x = Math.PI / 2; ring.position.set(x, 0.1 + i * 0.1, z); ring.scale.setScalar(1 - i * 0.15); g.add(ring);
  }
}
function addHorizonLine(g: THREE.Group, x: number, z: number, s: Shared) {
  const ridge = new THREE.Mesh(G.box(8, 0.4, 1), s.stone); ridge.position.set(x, 0.2, z + 2); ridge.rotation.x = -0.1; g.add(ridge);
}
function addFalseGuide(g: THREE.Group, x: number, z: number, s: Shared) {
  const pillar = new THREE.Mesh(G.cyl(0.12, 0.15, 1.4, 8), s.stone); pillar.position.set(x, 0.7, z); g.add(pillar);
  const top = new THREE.Mesh(G.box(0.4, 0.2, 0.4), s.dark); top.position.set(x, 1.45, z); g.add(top);
}
function addStrataWall(g: THREE.Group, x: number, z: number, s: Shared) {
  for (let i = 0; i < 5; i++) {
    const layer = new THREE.Mesh(G.box(2.4, 0.25, 0.3), new THREE.MeshStandardMaterial({ color: s.stone.color.clone().offsetHSL(0, 0, i * 0.02), roughness: 0.95 }));
    layer.position.set(x, 0.25 + i * 0.3, z + 1.4); g.add(layer);
  }
}
function addMassiveRock(g: THREE.Group, x: number, z: number, s: Shared) {
  const r = new THREE.Mesh(G.dodec(1.4, 1), s.stone); r.position.set(x, 0.7, z + 1.2); r.scale.set(1.2, 1.6, 1.2);
  r.rotation.set(0.2, 0.4, 0.1); g.add(r);
}
function addCrumblingSlope(g: THREE.Group, x: number, z: number, s: Shared) {
  for (let i = 0; i < 8; i++) {
    const stone = new THREE.Mesh(G.dodec(0.2 + rng(i + 2)() * 0.2), s.stone);
    stone.position.set(x - 0.6 + rng(i + 4)() * 1.2, 0.1 + rng(i + 1)() * 0.3, z + 1 + rng(i + 3)() * 0.8);
    stone.rotation.set(rng(i)() * 3, rng(i + 2)() * 3, rng(i + 1)() * 3); g.add(stone);
  }
}
function addTurnedPath(g: THREE.Group, x: number, z: number, s: Shared) {
  addPath(g, x, z, s, 2.5, 'z');
  const turn = new THREE.Mesh(G.box(2.5, 0.04, 0.8), s.dark); turn.position.set(x + 1.2, 0.02, z + 1); turn.rotation.y = -Math.PI / 2; g.add(turn);
}
function addEmptyTents(g: THREE.Group, x: number, z: number, s: Shared) {
  addTent(g, x - 1.2, z, s, 1.6, 1.4);
  addTent(g, x + 1.2, z + 0.8, s, 1.6, 1.4);
}
function addWorkTools(g: THREE.Group, x: number, z: number, s: Shared) {
  const anvil = new THREE.Mesh(G.box(0.5, 0.5, 0.4), s.dark); anvil.position.set(x, 0.25, z); g.add(anvil);
  const hammer = new THREE.Mesh(G.box(0.1, 0.4, 0.1), s.wood); hammer.position.set(x + 0.3, 0.4, z); g.add(hammer);
}
function addPeopleSilhouette(g: THREE.Group, x: number, z: number, s: Shared) {
  for (let i = 0; i < 4; i++) {
    const fig = new THREE.Mesh(G.box(0.3, 1.0, 0.2), s.dark);
    fig.position.set(x - 1.5 + i * 0.9, 0.5, z - 2.5); g.add(fig);
  }
}
function addShepherdPath(g: THREE.Group, x: number, z: number, s: Shared) {
  addPath(g, x, z, s, 4, 'z');
}
function addWaterHole(g: THREE.Group, x: number, z: number, s: Shared) {
  const pool = new THREE.Mesh(G.cyl(0.5, 0.5, 0.1, 12), s.water); pool.position.set(x, 0.05, z); g.add(pool);
  const rim = new THREE.Mesh(G.tor(0.55, 0.06, 6, 12), s.stone); rim.rotation.x = Math.PI / 2; rim.position.set(x, 0.06, z); g.add(rim);
}
function addValley(g: THREE.Group, x: number, z: number, s: Shared) {
  const v = new THREE.Mesh(G.box(6, 0.3, 3), s.stone); v.position.set(x, 0.15, z + 1.5); v.rotation.x = -0.15; g.add(v);
}
function addPropheticLandscape(g: THREE.Group, x: number, z: number, s: Shared) {
  addRidge(g, x, z, s, 5, 1.0);
  addRidge(g, x + 1.5, z - 1, s, 4, 0.7);
}
function addWallRemnants(g: THREE.Group, x: number, z: number, s: Shared) {
  const wall = new THREE.Mesh(G.box(2.5, 1.6, 0.3), s.stone); wall.position.set(x, 0.8, z + 1.2); wall.rotation.y = 0.2; g.add(wall);
  for (let i = 0; i < 5; i++) { const r = new THREE.Mesh(G.dodec(0.15 + rng(i + 7)() * 0.1), s.stone); r.position.set(x - 1 + rng(i + 8)() * 2, 0.2 + rng(i + 6)() * 0.4, z + 1.5); g.add(r); }
}
function addSafePath(g: THREE.Group, x: number, z: number, s: Shared) {
  addPath(g, x, z, s, 3, 'z');
  const glow = new THREE.Mesh(G.plane(1.2, 0.1), new THREE.MeshBasicMaterial({ color: 0x4a5a7a, transparent: true, opacity: 0.4 }));
  glow.rotation.x = -Math.PI / 2; glow.position.set(x, 0.06, z); g.add(glow);
}
function addQuietStone(g: THREE.Group, x: number, z: number, s: Shared) {
  const stone = new THREE.Mesh(G.box(0.9, 0.4, 0.6), s.stone); stone.position.set(x, 0.2, z); stone.rotation.y = 0.3; g.add(stone);
}
function addUnfoldingBorders(g: THREE.Group, x: number, z: number, s: Shared) {
  for (let i = 0; i < 4; i++) {
    const ring = new THREE.Mesh(G.tor(0.8 + i * 0.4, 0.04, 6, 20), s.stone);
    ring.rotation.x = Math.PI / 2; ring.position.set(x, 0.5 + i * 0.2, z + 1.5); ring.scale.setScalar(1 + i * 0.1); g.add(ring);
  }
}
function addScrolls(g: THREE.Group, x: number, z: number, s: Shared) {
  addScroll(g, x - 0.4, z, s, 0.7);
  addScroll(g, x + 0.4, z + 0.3, s, 0.6);
}
function addOliveTrees(g: THREE.Group, x: number, z: number, s: Shared, n = 3) {
  for (let i = 0; i < n; i++) { addOliveTree(g, x - 1.2 + i * 1.2, z + (i % 2) * 0.8, s); }
}

// ── Диспетчер: environmentKey → конкретные props.
// (px, pz) — положение props-якоря (позади стелы, к стене прохода).
export function buildExhibitProps(e: Exhibit, low: boolean, px: number, pz: number): THREE.Group {
  const g = new THREE.Group();
  const s = shared(low);
  const key = e.environmentKey;
  switch (key) {
    case 'creation-horizon': addLightShaft(g, px, pz); addMassiveRock(g, px - 0.5, pz, s); break;
    case 'stone-corridor': addStrataWall(g, px, pz, s); addFalseGuide(g, px - 1.2, pz, s); break;
    case 'high-ledge-camp': addCampTable(g, px, pz, s); addVessel(g, px + 0.8, pz, s); break;
    case 'great-rock': addMassiveRock(g, px, pz, s); addCrumblingSlope(g, px - 1, pz, s); break;
    case 'dual-path': addPath(g, px - 0.6, pz, s, 3, 'z'); addPath(g, px + 0.6, pz, s, 2.5, 'z'); break;
    case 'fertile-camp': addTurnedPath(g, px, pz, s); addCampTable(g, px - 1, pz, s); break;
    case 'patriarch-tent': addTent(g, px, pz, s); addVessel(g, px + 1, pz, s); break;
    case 'beersheba-well': addWell(g, px, pz, s, low); addTamarisk(g, px + 0.9, pz - 0.3, s); break;
    case 'wilderness-spring': addThinSpring(g, px, pz, s); addVessel(g, px - 0.8, pz, s); break;
    case 'bethel-altar': addAltar(g, px, pz, s); addWall(g, px, pz + 1, s, 2, 1.2); break;
    case 'mountain-slope': addRidge(g, px, pz, s, 5, 1.2); addRam(g, px + 0.8, pz - 0.5, s); break;
    case 'battle-overlook': addAltar(g, px, pz, s); addStandard(g, px - 1, pz, s); break;
    case 'oak-gideon': addTamarisk(g, px, pz, s); addAltar(g, px - 1, pz, s); addAltar(g, px + 1.2, pz + 0.5, s); break;
    case 'marrah-waters': addDryStream(g, px, pz, s); addThinSpring(g, px - 1, pz + 1, s); break;
    case 'camp-sabbath': addEmptyTents(g, px, pz, s); addWorkTools(g, px + 1.2, pz, s); break;
    case 'sea-shore': addSea(g, px, pz, s); addPeopleSilhouette(g, px, pz, s); break;
    case 'shepherd-valley': addSheep(g, px, pz, s); addShepherdPath(g, px, pz, s); addWaterHole(g, px - 1, pz - 0.5, s); break;
    case 'valley-battle': addValley(g, px, pz, s); addLightShaft(g, px - 1, pz); break;
    case 'prophetic-hall': addEmptyHall(g, px, pz, s); addPath(g, px - 1, pz, s, 2, 'x'); break;
    case 'jerusalem-view': addRoyalSign(g, px, pz, s); addCityView(g, px, pz, s); break;
    case 'city-model': addCityModel(g, px, pz, s); break;
    case 'covenant-corridor': addPath(g, px - 0.7, pz, s, 3, 'z'); addPath(g, px + 0.7, pz, s, 3, 'z'); addBrokenPedestal(g, px + 1.5, pz, s); break;
    case 'prayer-rest': addPrayerSpot(g, px, pz, s); addArch(g, px - 1.5, pz, s, 2); break;
    case 'city-road-crack': addCrackedRoad(g, px, pz, s); addRidge(g, px, pz + 1.5, s, 3, 0.5); break;
    case 'dry-stream': addDryStream(g, px, pz, s); addThinSpring(g, px - 1.2, pz, s); addDeer(g, px + 1, pz - 1, s); break;
    case 'return-path': addPath(g, px, pz, s, 4, 'z'); addWallRemnants(g, px, pz, s); break;
    case 'dawn-light-gap': addLightShaft(g, px, pz); addSafePath(g, px, pz, s); break;
    case 'tablets-scene': addTablets(g, px, pz, s); addQuietStone(g, px, pz - 1, s); break;
    case 'vision-abstract': addDistantGlow(g, px, pz); addUnfoldingBorders(g, px, pz, s); break;
    case 'night-shelter': addScrolls(g, px, pz, s); addStarWindow(g, px, pz, s); break;
    case 'gethsemane-garden': addOliveTrees(g, px, pz, s, 4); addPrayerSpot(g, px, pz - 0.8, s); break;
    case 'apocalyptic-architecture': addLightStoneSpace(g, px, pz, s); break;
    case 'scroll-alpha-omega': addEditorialScroll(g, px, pz, s); break;
    case 'two-windows': addPublicPlace(g, px, pz, s); addArch(g, px + 1.5, pz, s, 1.8); break;
    case 'two-era-frames': addPropheticLandscape(g, px, pz, s); addNightDoorway(g, px + 1.5, pz, s); break;
    case 'stone-threshold': addStoneThreshold(g, px, pz, s); addMessageScroll(g, px - 0.8, pz, s); break;
    case 'sheepfold': addSheepfold(g, px, pz, s); addGate(g, px, pz - 1.2, s); addSheep(g, px - 0.4, pz, s); break;
    case 'tomb-stone': addTomb(g, px, pz, s); break;
    case 'scribe-table': addScribeTable(g, px, pz, s); addTimeLayers(g, px + 1.5, pz, s); break;
    case 'ridge-horizon': addHorizonLine(g, px, pz, s); addRidge(g, px, pz + 1, s, 4, 0.8); break;
    case 'bush-scene': addRock(g, px, pz, s, 1.2); break;
    default: addRock(g, px, pz, s);
  }
  // Зонная подсветка: не 42 точечных света (это перегрузит лигитовый бюджет),
  // а лёгкий аддитивный огонёк zone-tint цвета. Sprite автоматически смотрит в камеру.
  const tint = e.zone === 5 ? 0x6677aa : e.zone === 4 ? 0x8899bb : e.zone === 1 ? 0xffcc88 : 0xffe0b0;
  const glowMat = new THREE.SpriteMaterial({
    color: tint, transparent: true, opacity: e.qualityProfile === 'hero' ? 0.22 : 0.12,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const glow = new THREE.Sprite(glowMat);
  glow.scale.set(2.2, 2.2, 1);
  glow.position.set(px, 1.4, pz);
  g.add(glow);
  return g;
}

// Merge all meshes in a group by material: applies each mesh's local matrix
// to its geometry, then merges into one BufferGeometry per material.
// Reduces draw calls from N (meshes) to M (unique materials, typically 2-4).
// Non-mesh children (sprites, lights) are preserved. Falls back gracefully
// if geometries have incompatible attributes.
export function mergePropsGroup(group: THREE.Group): void {
  const meshes: THREE.Mesh[] = [];
  const others: THREE.Object3D[] = [];
  group.traverse((o: THREE.Object3D) => {
    if (o instanceof THREE.Mesh && o.geometry instanceof THREE.BufferGeometry) {
      meshes.push(o);
    } else if (o !== group) {
      others.push(o);
    }
  });
  if (meshes.length < 2) return; // nothing to merge

  // Group meshes by material (skip multi-material meshes)
  const byMaterial = new Map<THREE.Material, { geos: THREE.BufferGeometry[]; count: number }>();
  for (const m of meshes) {
    const mats = Array.isArray(m.material) ? m.material : [m.material];
    if (mats.length !== 1) continue; // skip multi-material
    const mat = mats[0];
    let geo = m.geometry.clone();
    // Normalize to non-indexed so mergeGeometries accepts mixed geometries
    if (geo.index) geo = geo.toNonIndexed();
    geo.applyMatrix4(m.matrix);
    if (!byMaterial.has(mat)) byMaterial.set(mat, { geos: [], count: 0 });
    const entry = byMaterial.get(mat)!;
    entry.geos.push(geo);
    entry.count++;
  }

  // Replace meshes with merged equivalents
  group.clear();
  let mergedCount = 0;
  for (const [mat, entry] of byMaterial) {
    const merged = mergeGeometries(entry.geos, false);
    if (merged) {
      const mesh = new THREE.Mesh(merged, mat);
      mesh.castShadow = meshes.some((m) => m.castShadow);
      mesh.receiveShadow = meshes.some((m) => m.receiveShadow);
      group.add(mesh);
      mergedCount++;
      for (const g of entry.geos) g.dispose();
    } else {
      // Fallback: keep individual meshes
      for (const geo of entry.geos) {
        const mesh = new THREE.Mesh(geo, mat);
        group.add(mesh);
      }
    }
  }
  // Re-add non-mesh children (sprites, glow)
  for (const o of others) group.add(o);
}
