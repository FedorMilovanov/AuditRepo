import * as THREE from 'three';
import { EXHIBITS, type Exhibit } from '../data/exhibits';
import { rockTextures, labelTexture, fbm } from './procedural';
import { buildZones, PLACEMENTS, type Obstacle } from './SceneZones';
import { buildBurningBush } from './BurningBush';
import { AmbientAudio } from './audio';
import { validateExhibits } from '../data/validate';
import { constrain, zoneAt, distToBush, sanitizeSpawn, ZONE_SPAWN, R_OUTER, TUNNEL_END, type Block } from './nav';
import { ENV_GENESIS_16_13_PRESET } from '../../world/exhibitPresets/ENV_GENESIS_16_13_preset';
import { ENV_GENESIS_21_33_PRESET } from '../../world/exhibitPresets/ENV_GENESIS_21_33_preset';
import { ENV_EXODUS_3_14_PRESET } from '../../world/exhibitPresets/ENV_EXODUS_3_14_preset';

export type Shoes = 'shod' | 'removing' | 'unshod';
export type Prompt = null | { kind: 'exhibit'; id: string } | { kind: 'shoes' };
export interface WorldState {
  zone: number; x: number; z: number; yaw: number; prompt: Prompt; shoes: Shoes; block: Block;
  distBush: number; fps: number; calls: number; tris: number; locked: boolean; contextLost: boolean; pixelRatio: number;
}
export interface WorldSettings { quality: 'low' | 'high'; reducedMotion: boolean; particles: boolean; sound: boolean; exposure: number; autoQuality: boolean }

const FOG: [number, number, number][] = [ // zone → color, density
  [0x0d0a08, 0.035, 0], [0x0f0b08, 0.03, 0], [0x120c08, 0.026, 0], [0x140a05, 0.05, 0], [0x070a10, 0.02, 0], [0x0c0a09, 0.045, 0], [0x0a0d14, 0.05, 0], [0x0b1020, 0.0055, 0],
];
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
  private zones!: ReturnType<typeof buildZones>;
  private bush!: ReturnType<typeof buildBurningBush>;
  private ambient = new THREE.AmbientLight(0xffeedd, 1.6);
  private hemi = new THREE.HemisphereLight(0x6a7cb0, 0x3a2a20, 0);
  private moon = new THREE.DirectionalLight(0x9fb0e0, 0);
  private fogColor = new THREE.Color();
  private t = 0; private frames = 0; private fpsT = 0; private fps = 0; private lowFpsT = 0;
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
    this.scene.background = new THREE.Color(0x050403);
    this.scene.fog = new THREE.FogExp2(0x0d0a08, 0.035);
    this.moon.position.set(120, 200, -200);
    this.scene.add(this.ambient, this.hemi, this.moon);
  }

  static async create(canvas: HTMLCanvasElement, settings: WorldSettings, spawn: { x: number; z: number } | null, onState: (s: WorldState) => void, onEvent: (e: string) => void, signal?: AbortSignal) {
    try { await (document as Document & { fonts?: FontFaceSet }).fonts?.ready; } catch { /* шрифты необязательны */ }
    if (signal?.aborted || !canvas.isConnected) throw new DOMException('Scene creation cancelled', 'AbortError');
    const w = new World(canvas, settings, onState, onEvent);
    w.build();
    const s = sanitizeSpawn(spawn);
    w.pos.set(s.x, s.z);
    w.bind();
    w.applySettings(settings);
    w.resize();
    w.renderer.setAnimationLoop(w.loop);
    return w;
  }

  private build() {
    const low = this.settings.quality === 'low';
    const { tex, bump } = rockTextures(low ? 256 : 512);
    tex.repeat.set(1, 1);
    const rock = new THREE.MeshStandardMaterial({ vertexColors: true, map: tex, bumpMap: bump, bumpScale: 2.2, roughness: 0.96, metalness: 0, side: THREE.DoubleSide });
    this.zones = buildZones(low, rock);
    this.scene.add(this.zones.group);
    this.obstacles.push(...this.zones.obstacles);
    this.bush = buildBurningBush(low, !low && ENV_EXODUS_3_14_PRESET.bushQuality === 'high');
    this.scene.add(this.bush.group);

    // --- W1: уникальные физические якоря для el-roi (Быт 16:13) и el-olam (Быт 21:33) ---
    const roiPos = PLACEMENTS['el-roi-gen-16-13'];
    if (roiPos && ENV_GENESIS_16_13_PRESET) {
      const [wx, wz] = roiPos;
      const well = new THREE.Group();
      const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.05, 0.55, 14, 1, true), new THREE.MeshStandardMaterial({ color: 0x5a5042, roughness: 0.92, map: tex, bumpMap: bump, bumpScale: 1.4, side: THREE.DoubleSide }));
      ring.position.y = 0.275; well.add(ring);
      const water = new THREE.Mesh(new THREE.CircleGeometry(0.85, 16), new THREE.MeshStandardMaterial({ color: 0x1a2630, roughness: 0.25, metalness: 0.1 }));
      water.rotation.x = -Math.PI / 2; water.position.y = 0.3; well.add(water);
      well.position.set(wx - 1.8, 0, wz - 1.1);
      this.scene.add(well);
      this.obstacles.push({ x: wx - 1.8, z: wz - 1.1, r: 1.1 });
    }
    const olamPos = PLACEMENTS['el-olam-gen-21-33'];
    if (olamPos && ENV_GENESIS_21_33_PRESET) {
      const [tx0, tz0] = olamPos;
      const tamarisk = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.26, 3.2, 7), new THREE.MeshStandardMaterial({ color: 0x3f3228, roughness: 0.95 }));
      trunk.position.y = 1.6; tamarisk.add(trunk);
      const canopy = new THREE.Mesh(new THREE.SphereGeometry(1.5, 10, 8), new THREE.MeshStandardMaterial({ color: 0x4f5a3a, roughness: 1 }));
      canopy.position.y = 3.3; canopy.scale.set(1.3, 0.75, 1.3); tamarisk.add(canopy);
      tamarisk.position.set(tx0 + 1.9, 0, tz0 - 1.2);
      this.scene.add(tamarisk);
      this.obstacles.push({ x: tx0 + 1.9, z: tz0 - 1.2, r: 0.6 });
    }

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
    const steleMat = new THREE.MeshStandardMaterial({ color: 0x6d5d4f, roughness: 0.95, map: tex, bumpMap: bump, bumpScale: 2 });
    const plane = new THREE.PlaneGeometry(1.16, 1.63);
    const editorialOk = validateExhibits(EXHIBITS).length === 0; // fail-closed
    for (const e of editorialOk ? EXHIBITS : []) {
      const pl = PLACEMENTS[e.id];
      if (!pl) continue; // fail-closed: экспонат без размещения не попадает в 3D (но есть в HTML)
      const [x, z] = pl;
      const g = new THREE.Group();
      g.add(new THREE.Mesh(steleGeo, steleMat));
      const tx = labelTexture(e, e.zone === 5);
      const lab = new THREE.Mesh(plane, new THREE.MeshStandardMaterial({ map: tx, emissiveMap: tx, emissive: 0xffffff, emissiveIntensity: 0.42, roughness: 0.85 }));
      lab.position.set(0, 1.42, 0.225);
      g.add(lab);
      let nx = -Math.sign(x) * 0.85, nz = 0.53;
      if (e.zone === 7) { nx = -Math.sign(x) * 0.6; nz = 0.8; }
      g.position.set(x, 0, z);
      g.rotation.y = Math.atan2(nx, nz);
      g.userData.exhibitId = e.id;
      this.scene.add(g);
      this.obstacles.push({ x, z, r: 0.85 });
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
      if (document.hidden) { this.renderer.setAnimationLoop(null); this.audio.suspend(); this.keys.clear(); }
      else if (!this.contextLost && !this.disposed) { this.clock.getDelta(); this.renderer.setAnimationLoop(this.loop); this.audio.resume(); }
    });
    this.on(c, 'webglcontextlost', ((e: Event) => { e.preventDefault(); this.contextLost = true; this.renderer.setAnimationLoop(null); this.emit(true); }) as unknown as EventListener);
    this.on(c, 'webglcontextrestored', () => { this.contextLost = false; this.clock.getDelta(); this.renderer.setAnimationLoop(this.loop); this.emit(true); });
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

  applySettings(s: WorldSettings) {
    this.settings = s;
    const dpr = window.devicePixelRatio || 1;
    this.renderer.setPixelRatio(s.quality === 'high' ? Math.min(dpr, 2) : Math.min(dpr, 1));
    this.renderer.toneMappingExposure = s.exposure;
    this.zones.particles.forEach((p) => (p.visible = s.particles));
    this.bush.sparks.visible = s.particles;
    this.audio.setEnabled(s.sound);
    if (s.sound) this.audio.start();
    this.resize();
  }

  setInputLocked(v: boolean) {
    this.inputLocked = v;
    if (v) { this.keys.clear(); this.move.x = this.move.y = 0; this.dragging = null; if (document.pointerLockElement) document.exitPointerLock(); }
  }
  setMoveInput(x: number, y: number) { this.move.x = x; this.move.y = y; }
  requestLock() { const r = this.canvas.requestPointerLock?.() as unknown as Promise<void> | undefined; if (r?.catch) r.catch(() => this.onEvent('pointerlock-denied')); }

  /** Снять обувь — только у внешнего порога, только из состояния 'shod'. Повторные вызовы игнорируются. */
  removeShoes(): boolean {
    if (this.shoes !== 'shod') return false;
    if (distToBush(this.pos.x, this.pos.y) > R_OUTER + 3) return false;
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
      if (d < r && d > 1e-6) { nx = o.x + (dx / d) * r; nz = o.z + (dz / d) * r; }
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
    this.ambient.intensity = 1.6 * (1 - out) + 0.35 * out;
    this.hemi.intensity = 0.55 * out;
    this.moon.intensity = 0.55 * out;

    this.zones.update(this.t, dt, this.pos.x, this.pos.y, motion);
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
        if (this.lowFpsT >= 3) { this.renderer.setPixelRatio(1); this.resize(); this.onEvent('auto-lowered'); this.lowFpsT = 0; }
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
    this.disposed = true;
    this.renderer.setAnimationLoop(null);
    for (const [t, ty, fn, o] of this.listeners) t.removeEventListener(ty, fn, o);
    if (document.pointerLockElement === this.canvas) document.exitPointerLock();
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
      for (const mat of mats) {
        for (const v of Object.values(mat)) if (v instanceof THREE.Texture) v.dispose();
        if ((mat as THREE.ShaderMaterial).uniforms) for (const u of Object.values((mat as THREE.ShaderMaterial).uniforms)) if (u.value instanceof THREE.Texture) u.value.dispose();
        mat.dispose();
      }
    });
    this.audio.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}
