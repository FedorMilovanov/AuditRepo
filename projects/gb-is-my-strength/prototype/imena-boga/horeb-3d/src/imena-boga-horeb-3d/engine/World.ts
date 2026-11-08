import * as THREE from 'three';
import { EXHIBITS, type Exhibit } from '../data/exhibits';
import { rockTextures, labelTexture, fbm, glowTexture } from './procedural';
import { buildZones, PLACEMENTS, type Obstacle } from './SceneZones';
import { buildExhibitProps, mergePropsGroup } from './exhibitProps';
import { buildBurningBush } from './BurningBush';
import { AmbientAudio } from './audio';
import { BEACON_IDS, createNameBeacon, beaconViewFactor } from './NameBeacon';
import { choosePixelRatio, resetsAutoLowered } from './quality';
import { validateExhibits } from '../data/validate';
import { constrain, zoneAt, distToBush, sanitizeSpawn, ZONE_SPAWN, R_OUTER, TUNNEL_END, steleVariation, separateObstacle, type Block } from './nav';

export type Shoes = 'shod' | 'removing' | 'unshod';
export type Prompt = null | { kind: 'exhibit'; id: string } | { kind: 'shoes' };
export interface WorldState {
  zone: number; x: number; z: number; yaw: number; prompt: Prompt; shoes: Shoes; block: Block;
  distBush: number; fps: number; calls: number; tris: number; locked: boolean; contextLost: boolean; pixelRatio: number;
}
export interface WorldSettings { quality: 'low' | 'high'; reducedMotion: boolean; particles: boolean; sound: boolean; exposure: number; autoQuality: boolean }

const FOG: [number, number, number][] = [ // zone → color, density
  [0x1a1410, 0.03, 0], [0x1c1610, 0.028, 0], [0x221810, 0.024, 0], [0x281610, 0.045, 0], [0x121620, 0.018, 0], [0x181412, 0.04, 0], [0x141820, 0.045, 0], [0x121830, 0.005, 0],
];
// Subtle zone-specific lighting; keep the brighter neutral base rather than applying fog colors unmodified.
const _baseWarm = new THREE.Color(0xffeedd);
const ZONE_LIGHT: { amb: THREE.Color; hemi: THREE.Color }[] = FOG.map((f) => {
  const tint = new THREE.Color(f[0]);
  return {
    amb: _baseWarm.clone().lerp(tint, 0.25),
    hemi: new THREE.Color(0x6a7cb0).clone().lerp(tint, 0.3),
  };
});
const EYE = 1.62;
const SPEED = 2.3;

export class World {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private keys = new Set<string>();
  private move = { x: 0, y: 0 };
  private vel = new THREE.Vector2();
  private pos = new THREE.Vector2(0, -2);
  yaw = 0; pitch = 0;
  private pitchOffset = 0;
  shoes: Shoes = 'shod';
  private block: Block = null;
  private inputLocked = false;
  private obstacles: Obstacle[] = [];
  private exhibitPos: { e: Exhibit; x: number; z: number; nx: number; nz: number }[] = [];
  private nameBeacons: { id: string; x: number; z: number; update: (distance: number, inspected?: boolean, viewFactor?: number) => void }[] = [];
  private activeInspection: { id: string; until: number } | null = null;
  private zones!: ReturnType<typeof buildZones>;
  private bush!: ReturnType<typeof buildBurningBush>;
  private ambient = new THREE.AmbientLight(0xffeedd, 4.0);
  private hemi = new THREE.HemisphereLight(0x6a7cb0, 0x3a2a20, 1.0);
  private moon = new THREE.DirectionalLight(0x9fb0e0, 0.8);
  private fogColor = new THREE.Color();
  private t = 0; private frames = 0; private fpsT = 0; private fps = 0; private lowFpsT = 0;
  private autoLoweredResolution = false;
  private emitT = 0;
  private stepAcc = 0;
  private dragging: { id: number; x: number; y: number } | null = null;
  private contextLost = false;
  private disposed = false;
  sandals: THREE.Group | null = null;
  audio = new AmbientAudio();
  settings: WorldSettings;
  private listeners: [EventTarget, string, EventListener, AddEventListenerOptions?][] = [];

  private constructor(private canvas: HTMLCanvasElement, settings: WorldSettings, private onState: (s: WorldState) => void, private onEvent: (e: string) => void) {
    this.settings = settings;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: settings.quality === 'high', powerPreference: 'high-performance' });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = settings.exposure;
    this.camera = new THREE.PerspectiveCamera(66, 1, 0.05, 3200);
    this.camera.rotation.order = 'YXZ';
    this.scene.background = new THREE.Color(0x100c08);
    this.scene.fog = new THREE.FogExp2(0x1a1410, 0.03);
    this.moon.position.set(120, 200, -200);
    this.scene.add(this.ambient, this.hemi, this.moon);
  }

  static async create(canvas: HTMLCanvasElement, settings: WorldSettings, spawn: { x: number; z: number } | null, onState: (s: WorldState) => void, onEvent: (e: string) => void, signal?: AbortSignal) {
    try { await (document as Document & { fonts?: FontFaceSet }).fonts?.ready; } catch { /* шрифты необязательны */ }
    if (signal?.aborted || !canvas.isConnected) throw new DOMException('Scene creation cancelled', 'AbortError');
    const w = new World(canvas, settings, onState, onEvent);
    try {
      w.build();
      if (signal?.aborted || !canvas.isConnected) throw new DOMException('Scene creation cancelled', 'AbortError');
      const s = sanitizeSpawn(spawn);
      w.pos.set(s.x, s.z);
      w.bind();
      w.applySettings(settings);
      w.resize();
      w.updateActiveState();
      return w;
    } catch (error) {
      // A build may fail after renderer/context and some scene resources were allocated.
      w.dispose();
      throw error;
    }
  }

  private build() {
    const low = this.settings.quality === 'low';
    const { tex, bump } = rockTextures(low ? 256 : 512);
    tex.repeat.set(1, 1);
    const rock = new THREE.MeshStandardMaterial({ vertexColors: true, map: tex, bumpMap: bump, bumpScale: 2.2, roughness: 0.96, metalness: 0, side: THREE.DoubleSide });
    this.zones = buildZones(low, rock);
    this.scene.add(this.zones.group);
    this.obstacles.push(...this.zones.obstacles);
    this.bush = buildBurningBush(low);
    this.scene.add(this.bush.group);

    // Стелы экспонатов
    const steleGeo = new THREE.BoxGeometry(1.5, 2.6, 0.42, 6, 10, 2);
    const p = steleGeo.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const n = fbm(x * 2 + 5, y * 2, z * 2, 3);
      const edge = Math.abs(x) > 0.7 || Math.abs(y) > 1.25 ? 1 : 0.25;
      p.setXYZ(i, x + (n - 0.5) * 0.12 * edge, y + 1.3 + (y > 1.2 ? (n - 0.5) * 0.25 : 0), z + (z < 0 ? (n - 0.5) * 0.1 : 0));
    }
    steleGeo.computeVertexNormals();
    // Zone-tinted materials: 8 clones (not 42) — ранние зоны теплые, поздние холодные.
    // Плюс per-exhibit scale/tilt/labelScale через steleVariation — 42 стелы не идентичны.
    const steleMats = new Map<number, THREE.MeshStandardMaterial>();
    const steleMatFor = (zone: number) => {
      if (!steleMats.has(zone)) {
        const tint = steleVariation('__zone_' + zone, zone).tint;
        steleMats.set(zone, new THREE.MeshStandardMaterial({ color: tint, roughness: 0.95, map: tex, bumpMap: bump, bumpScale: 2 }));
      }
      return steleMats.get(zone)!;
    };
    const plane = new THREE.PlaneGeometry(1.16, 1.63);
    // One radial alpha mask per World, reused by all 42 scenic glows.
    // A SpriteMaterial without a map renders a visible square billboard.
    const propGlow = glowTexture('rgba(255,255,255,1)', 'rgba(255,255,255,0)');
    const editorialOk = validateExhibits(EXHIBITS).length === 0; // fail-closed
    for (const e of editorialOk ? EXHIBITS : []) {
      const pl = PLACEMENTS[e.id];
      if (!pl) continue; // fail-closed: экспонат без размещения не попадает в 3D (но есть в HTML)
      const [x, z] = pl;
      const g = new THREE.Group();
      const v = steleVariation(e.id, e.zone);
      const steleMesh = new THREE.Mesh(steleGeo, steleMatFor(e.zone));
      steleMesh.scale.setScalar(v.scale);
      steleMesh.rotation.z = v.tilt;
      g.add(steleMesh);
      const tx = labelTexture(e, e.zone === 5, low);
      const lab = new THREE.Mesh(plane, new THREE.MeshStandardMaterial({ map: tx, emissiveMap: tx, emissive: 0xffffff, emissiveIntensity: 0.42, roughness: 0.85 }));
      lab.position.set(0, 1.42, 0.225);
      lab.scale.setScalar(v.labelScale);
      g.add(lab);
      if ((BEACON_IDS as readonly string[]).includes(e.id)) {
        const beacon = createNameBeacon(e, low);
        g.add(beacon.mesh);
        this.nameBeacons.push({ id: e.id, x, z, update: beacon.update });
      }
      let nx = -Math.sign(x) * 0.85, nz = 0.53;
      if (e.zone === 7) { nx = -Math.sign(x) * 0.6; nz = 0.8; }
      g.position.set(x, 0, z);
      g.rotation.y = Math.atan2(nx, nz);
      g.userData.exhibitId = e.id;
      this.scene.add(g);
      // Уникальные props сцены: перед стелом (к центру прохода), видны при подходе;
      // снаружи стелы (к стене) они бы попадали в свод прохода — поэтому впереди.
      const d = Math.hypot(nx, nz) || 1;
      const bx = x + (nx / d) * 1.2, bz = z + (nz / d) * 1.2;
      const props = buildExhibitProps(e, low, bx, bz, { map: tex, bump, glow: propGlow });
      mergePropsGroup(props); // merge meshes by material — reduce draw calls
      this.scene.add(props);
      this.obstacles.push({ x, z, r: 0.85 }); // стелы
      // The creation rock was moved behind its stele to clear Hebrew script.
      // Keep its physical collider aligned with actual geometry, not the old
      // abstract props anchor (the light shaft itself needs no collider).
      if (e.id === 'elohim') this.obstacles.push({ x: bx - 1.4, z: bz - 3.0, r: 1.75 });
      else this.obstacles.push({ x: bx, z: bz, r: 0.6 }); // other props anchors
      this.exhibitPos.push({ e, x, z, nx, nz });
    }
  }

  private on(t: EventTarget, type: string, fn: EventListener, o?: AddEventListenerOptions) { t.addEventListener(type, fn, o); this.listeners.push([t, type, fn, o]); }

  private bind() {
    const c = this.canvas;
    this.on(window, 'keydown', ((e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
      if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        if (this.inputLocked) return;
        // Browsers may suspend Web Audio when the scene was loaded through an
        // async dynamic import. Resume only inside a real keyboard gesture.
        if (e.isTrusted) this.audio.unlockFromGesture();
        this.keys.add(e.code);
        if (e.code.startsWith('Arrow') && (tag === 'BODY' || tag === 'CANVAS')) e.preventDefault();
      }
    }) as unknown as EventListener);
    this.on(window, 'keyup', ((e: KeyboardEvent) => { this.keys.delete(e.code); }) as unknown as EventListener);
    this.on(window, 'blur', () => this.keys.clear());
    this.on(document, 'mousemove', ((e: MouseEvent) => {
      if (document.pointerLockElement === c && !this.inputLocked) this.look(e.movementX, e.movementY);
    }) as unknown as EventListener);
    this.on(c, 'pointerdown', ((e: PointerEvent) => {
      if (this.inputLocked) return;
      if (e.isTrusted) this.audio.unlockFromGesture();
      if (e.pointerType === 'mouse') {
        if (document.pointerLockElement !== c) {
          // осознанное начало: клик — запрос pointer lock; при отказе — обзор перетаскиванием
          const r = c.requestPointerLock?.() as unknown as Promise<void> | undefined;
          if (r && typeof r.catch === 'function') r.catch(() => this.onEvent('pointerlock-denied'));
          this.dragging = { id: e.pointerId, x: e.clientX, y: e.clientY };
        }
      } else {
        this.dragging = { id: e.pointerId, x: e.clientX, y: e.clientY };
      }
    }) as unknown as EventListener);
    this.on(window, 'pointermove', ((e: PointerEvent) => {
      if (!this.dragging || e.pointerId !== this.dragging.id || document.pointerLockElement === c || this.inputLocked) return;
      const k = e.pointerType === 'mouse' ? 1 : 1.6;
      this.look((e.clientX - this.dragging.x) * k, (e.clientY - this.dragging.y) * k);
      this.dragging.x = e.clientX; this.dragging.y = e.clientY;
    }) as unknown as EventListener);
    const end = ((e: PointerEvent) => { if (this.dragging?.id === e.pointerId) this.dragging = null; }) as unknown as EventListener;
    this.on(window, 'pointerup', end); this.on(window, 'pointercancel', end);
    this.on(document, 'pointerlockchange', () => this.emit(true));
    this.on(document, 'pointerlockerror', () => this.onEvent('pointerlock-denied'));
    this.on(window, 'resize', () => this.resize());
    this.on(document, 'visibilitychange', () => {
      if (document.hidden) { this.keys.clear(); this.vel.set(0, 0); }
      this.updateActiveState();
    });
    this.on(c, 'webglcontextlost', ((e: Event) => {
      e.preventDefault(); this.contextLost = true; this.updateActiveState(); this.emit(true);
    }) as unknown as EventListener);
    this.on(c, 'webglcontextrestored', () => {
      this.contextLost = false; this.updateActiveState(); this.emit(true);
    });
  }

  private look(dx: number, dy: number) {
    this.yaw -= dx * 0.0022;
    this.pitch = Math.max(-1.15, Math.min(1.15, this.pitch - dy * 0.0022));
  }

  resize() {
    const w = this.canvas.clientWidth || window.innerWidth, h = this.canvas.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  // One source of truth for GPU/audio activity: dialogs, hidden tabs and lost
  // WebGL contexts should not continue rendering or playing procedural audio.
  private updateActiveState() {
    const active = !this.disposed && !this.contextLost && !this.inputLocked && !document.hidden;
    if (active) {
      this.clock.getDelta(); // discard wall time after a pause
      this.renderer.setAnimationLoop(this.loop);
      if (this.settings.sound) this.audio.start();
    } else {
      this.renderer.setAnimationLoop(null);
      this.audio.suspend();
    }
  }

  applySettings(s: WorldSettings) {
    // Do not undo an FPS-driven downgrade when changing sound, exposure or
    // particles. Explicitly changing the quality mode still resets it.
    if (resetsAutoLowered(this.settings, s)) {
      this.autoLoweredResolution = false;
      this.lowFpsT = 0;
    }
    this.settings = s;
    this.renderer.setPixelRatio(choosePixelRatio(s.quality, window.devicePixelRatio || 1,
      s.autoQuality && this.autoLoweredResolution));
    this.renderer.toneMappingExposure = s.exposure;
    this.zones.particles.forEach((p) => (p.visible = s.particles));
    this.bush.sparks.visible = s.particles;
    this.audio.setEnabled(s.sound);
    this.updateActiveState();
    this.resize();
  }

  setInputLocked(v: boolean) {
    if (this.inputLocked === v) return;
    this.inputLocked = v;
    if (v) {
      this.keys.clear();
      this.move.x = this.move.y = 0;
      this.vel.set(0, 0); // never drift through scenery behind a modal
      this.dragging = null;
      if (document.pointerLockElement === this.canvas) document.exitPointerLock();
    }
    this.updateActiveState();
  }
  setMoveInput(x: number, y: number) {
    if (this.inputLocked || !Number.isFinite(x) || !Number.isFinite(y)) {
      this.move.x = this.move.y = 0;
      return;
    }
    // Do not let external touch input exceed keyboard speed or poison coordinates.
    const len = Math.hypot(x, y);
    const scale = len > 1 ? 1 / len : 1;
    this.move.x = x * scale;
    this.move.y = y * scale;
    // Joystick callbacks execute synchronously within a trusted pointer
    // gesture on real touchscreens; no automatic voice playback is triggered.
    if (len > 0.05) this.audio.unlockFromGesture();
  }
  requestLock() { const r = this.canvas.requestPointerLock?.() as unknown as Promise<void> | undefined; if (r?.catch) r.catch(() => this.onEvent('pointerlock-denied')); }

  /** Снять обувь — только у внешнего порога, только из состояния 'shod'. Повторные вызовы игнорируются. */
  removeShoes(): boolean {
    if (this.shoes !== 'shod') return false;
    if (distToBush(this.pos.x, this.pos.y) > R_OUTER + 3) return false;
    this.audio.unlockFromGesture();
    this.shoes = 'removing';
    this.keys.clear(); this.vel.set(0, 0);
    const reduced = this.settings.reducedMotion;
    const start = performance.now();
    const fwd = new THREE.Vector2(-Math.sin(this.yaw), -Math.cos(this.yaw));
    const tick = () => {
      if (this.disposed) return;
      const k = Math.min(1, (performance.now() - start) / 2600);
      this.pitchOffset = reduced ? 0 : -0.55 * Math.sin(Math.PI * k);
      if (k < 1) requestAnimationFrame(tick);
      else {
        this.pitchOffset = 0;
        this.shoes = 'unshod';
        this.block = null;
        this.placeSandals(this.pos.x + fwd.x * -0.3, this.pos.y + fwd.y * -0.3);
        this.onEvent('shoes-removed');
        this.emit(true);
      }
    };
    requestAnimationFrame(tick);
    this.emit(true);
    return true;
  }
  private placeSandals(x: number, z: number) {
    const g = new THREE.Group();
    const leather = new THREE.MeshStandardMaterial({ color: 0x5a3a24, roughness: 0.9 });
    for (const s of [-1, 1]) {
      const sole = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.17, 4, 8), leather);
      sole.rotation.z = Math.PI / 2; sole.rotation.y = Math.PI / 2 + s * 0.12; sole.scale.set(0.5, 1, 1);
      sole.position.set(s * 0.09, 0.03, 0);
      g.add(sole);
    }
    g.position.set(x, 0, z); g.rotation.y = this.yaw;
    this.scene.add(g); this.sandals = g;
  }

  teleportZone(zone: number) { const s = ZONE_SPAWN[zone] ?? ZONE_SPAWN[0]; this.teleportTo(s.x, s.z); this.yaw = 0; this.pitch = 0; }
  teleportTo(x: number, z: number) {
    if (this.shoes === 'removing') return;
    const c = constrain(x, z, this.shoes !== 'unshod');
    this.pos.set(c.x, c.z); this.vel.set(0, 0); this.block = null; this.emit(true);
  }
  inspectExhibit(id: string): boolean {
    const item = this.exhibitPos.find((p) => p.e.id === id);
    if (!item || this.disposed || Math.hypot(this.pos.x - item.x, this.pos.y - item.z) > 5.5) return false;
    this.activeInspection = { id, until: this.t + 8 };
    this.audio.inspectCue(id, this.t);
    return true;
  }
  resetCamera() { this.pitch = 0; this.yaw = this.pos.y < TUNNEL_END ? this.yawToBush() : 0; }
  private yawToBush() { return Math.atan2(-(0 - this.pos.x), -(-366 - this.pos.y)); }
  get position() { return { x: this.pos.x, z: this.pos.y }; }

  interactTarget(): Prompt {
    if (this.shoes === 'shod' && distToBush(this.pos.x, this.pos.y) < R_OUTER + 2.5) return { kind: 'shoes' };
    const fx = -Math.sin(this.yaw), fz = -Math.cos(this.yaw);
    let best: Prompt = null, bd = 3.6;
    for (const p of this.exhibitPos) {
      const dx = p.x - this.pos.x, dz = p.z - this.pos.y, d = Math.hypot(dx, dz);
      if (d > bd) continue;
      if ((dx * fx + dz * fz) / (d || 1) < 0.3) continue;
      if (-dx * p.nx + -dz * p.nz < -0.2) continue; // со стороны надписи
      bd = d; best = { kind: 'exhibit', id: p.e.id };
    }
    return best;
  }

  private loop = () => {
    const dt = Math.min(0.1, this.clock.getDelta()); // коллизия аналитическая — туннелирования нет
    this.t += dt;
    const motion = !this.settings.reducedMotion;
    // ── PlayerController
    let ix = this.move.x, iy = this.move.y;
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) iy += 1;
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) iy -= 1;
    if (this.keys.has('KeyD')) ix += 1;
    if (this.keys.has('KeyA')) ix -= 1;
    if (this.keys.has('ArrowLeft')) this.yaw += 1.6 * dt;
    if (this.keys.has('ArrowRight')) this.yaw -= 1.6 * dt;
    const il = Math.hypot(ix, iy); if (il > 1) { ix /= il; iy /= il; }
    if (this.inputLocked || this.shoes === 'removing') { ix = iy = 0; }
    const shod = this.shoes !== 'unshod';
    const db = distToBush(this.pos.x, this.pos.y);
    let sp = SPEED;
    if (shod && db < R_OUTER + 3) sp *= Math.max(0.35, (db - R_OUTER) / 3); // плавное замедление у порога
    if (!shod && db < 10) sp *= 0.6;
    const fx = -Math.sin(this.yaw), fz = -Math.cos(this.yaw), rx = Math.cos(this.yaw), rz = -Math.sin(this.yaw);
    const tx = (fx * iy + rx * ix) * sp, tz = (fz * iy + rz * ix) * sp;
    const acc = 1 - Math.exp(-dt * 5);
    this.vel.x += (tx - this.vel.x) * acc; this.vel.y += (tz - this.vel.y) * acc;
    let nx = this.pos.x + this.vel.x * dt, nz = this.pos.y + this.vel.y * dt;
    for (const o of this.obstacles) {
      const dx = nx - o.x, dz = nz - o.z, d = Math.hypot(dx, dz), r = o.r + 0.35;
      if (d < r) {
        const pushed = separateObstacle(nx, nz, this.pos.x, this.pos.y, o);
        nx = pushed.x; nz = pushed.z;
      }
    }
    const c = constrain(nx, nz, shod);
    const moving = il > 0.05;
    const prevBlock = this.block;
    const nearOuter = shod && distToBush(c.x, c.z) < R_OUTER + 0.9; // полоса остановки у порога
    if (c.block === 'outer' || c.block === 'inner' || nearOuter) { if (nearOuter && !c.block) c.block = 'outer'; this.block = c.block; if (moving) this.vel.multiplyScalar(0.3); }
    else if (this.block && distToBush(c.x, c.z) > (this.block === 'outer' ? R_OUTER + 2.5 : 9)) this.block = null;
    const stepD = Math.hypot(c.x - this.pos.x, c.z - this.pos.y);
    this.pos.set(c.x, c.z);
    this.stepAcc += stepD;
    if (this.stepAcc > 0.72) { this.stepAcc = 0; this.audio.step(!shod); }
    if (prevBlock !== this.block) this.emit(true);

    this.camera.position.set(this.pos.x, EYE, this.pos.y);
    this.camera.rotation.set(this.pitch + this.pitchOffset, this.yaw, 0);

    // ── Атмосфера по зонам
    const zone = zoneAt(this.pos.y);
    const f = FOG[zone];
    this.fogColor.set(f[0]);
    const fog = this.scene.fog as THREE.FogExp2;
    const k = 1 - Math.exp(-dt * 1.5);
    fog.color.lerp(this.fogColor, k);
    fog.density += (f[1] - fog.density) * k;
    (this.scene.background as THREE.Color).copy(fog.color);
    const out = Math.min(1, Math.max(0, (TUNNEL_END + 2 - this.pos.y) / 10));
    this.ambient.intensity = 3.0 * (1 - out) + 0.35 * out;
    this.hemi.intensity = 0.3 * (1 - out) + 0.55 * out;
    const zl = ZONE_LIGHT[zone];
    this.ambient.color.lerp(zl.amb, k);
    this.hemi.color.lerp(zl.hemi, k);
    this.moon.intensity = 0.2 * (1 - out) + 0.55 * out;

    this.zones.update(this.t, dt, this.pos.x, this.pos.y, motion);
    // Canvas label is wider than its stela. At oblique approach angles it
    // otherwise clips harshly against the viewport edge. Match actual camera
    // horizontal FOV (important on portrait mobile) without extra draw calls.
    const halfHFov = Math.atan(Math.tan(THREE.MathUtils.degToRad(this.camera.fov) / 2) * this.camera.aspect);
    const fwdX = -Math.sin(this.yaw), fwdZ = -Math.cos(this.yaw);
    for (const beacon of this.nameBeacons) {
      const dx = beacon.x - this.pos.x, dz = beacon.z - this.pos.y;
      const dist = Math.hypot(dx, dz);
      const dot = dist > 0 ? THREE.MathUtils.clamp((dx * fwdX + dz * fwdZ) / dist, -1, 1) : -1;
      const bearing = Math.acos(dot);
      beacon.update(dist,
        this.activeInspection?.id === beacon.id && this.t < this.activeInspection.until,
        beaconViewFactor(dist, bearing, halfHFov));
    }
    if (this.pos.y < -280) this.bush.update(this.t, motion, this.renderer.domElement.height);
    this.bush.group.visible = this.pos.y < -286;
    this.audio.update(this.t, zone, db, Math.hypot(this.pos.x - 9.5, this.pos.y + 104));

    this.renderer.render(this.scene, this.camera);

    // ── Диагностика (реальные значения renderer.info)
    this.frames++; this.fpsT += dt;
    if (this.fpsT >= 1) {
      this.fps = Math.round(this.frames / this.fpsT); this.frames = 0; this.fpsT = 0;
      if (this.settings.autoQuality && this.fps < 38 && this.renderer.getPixelRatio() > 1) {
        this.lowFpsT++;
        if (this.lowFpsT >= 3) {
          this.autoLoweredResolution = true;
          this.renderer.setPixelRatio(choosePixelRatio(this.settings.quality, window.devicePixelRatio || 1, true));
          this.resize(); this.onEvent('auto-lowered'); this.lowFpsT = 0;
        }
      } else this.lowFpsT = 0;
    }
    this.emitT += dt;
    if (this.emitT > 0.12) { this.emitT = 0; this.emit(false); }
  };

  private emit(force: boolean) {
    const prompt = this.inputLocked ? null : this.interactTarget();
    const s: WorldState = {
      zone: zoneAt(this.pos.y), x: this.pos.x, z: this.pos.y, yaw: this.yaw, prompt, shoes: this.shoes, block: this.block,
      distBush: distToBush(this.pos.x, this.pos.y), fps: this.fps, calls: this.renderer.info.render.calls, tris: this.renderer.info.render.triangles,
      locked: document.pointerLockElement === this.canvas, contextLost: this.contextLost, pixelRatio: this.renderer.getPixelRatio(),
    };
    void force;
    this.onState(s);
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    for (const [t, ty, fn, o] of this.listeners) t.removeEventListener(ty, fn, o);
    if (document.pointerLockElement === this.canvas) document.exitPointerLock();
    // A single procedural atlas/material is shared by dozens of scene props.
    // Dispose each GPU resource exactly once instead of re-disposing shared assets.
    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    const textures = new Set<THREE.Texture>();
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry instanceof THREE.BufferGeometry) geometries.add(m.geometry);
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      for (const material of mats) materials.add(material);
    });
    for (const material of materials) {
      for (const value of Object.values(material)) {
        if (value instanceof THREE.Texture) textures.add(value);
      }
      const uniforms = (material as THREE.ShaderMaterial).uniforms;
      if (uniforms) for (const u of Object.values(uniforms)) {
        if (u.value instanceof THREE.Texture) textures.add(u.value);
      }
      material.dispose();
    }
    for (const geometry of geometries) geometry.dispose();
    for (const texture of textures) texture.dispose();
    this.audio.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
