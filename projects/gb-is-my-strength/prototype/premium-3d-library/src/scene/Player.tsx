import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { XROrigin, useXR, useXRControllerLocomotion } from "@react-three/xr";
import { StereoEffect } from "three/examples/jsm/effects/StereoEffect.js";
import * as THREE from "three";
import { EYE, ITEMS, OBSTACLES, PLAYER_COLLISION_RADIUS, SPAWN, VIEWS, WALK_RADIUS, approachPose } from "../data";
import { get, input, registry, set, openItem, type Phase } from "../store";
import { footstep, ping } from "../audio";

interface Pose {
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
}

export function collide() {
  const r = Math.hypot(input.x, input.z);
  if (r > WALK_RADIUS) {
    input.x *= WALK_RADIUS / r;
    input.z *= WALK_RADIUS / r;
  }
  for (const [ox, oz, or] of OBSTACLES) {
    const dx = input.x - ox, dz = input.z - oz;
    const d = Math.hypot(dx, dz);
    const m = or + PLAYER_COLLISION_RADIUS;
    if (d < m) {
      const nx = d > 1e-4 ? dx / d : 1;
      const nz = d > 1e-4 ? dz / d : 0;
      input.x = ox + nx * m;
      input.z = oz + nz * m;
    }
  }
}

/** Slow interior architectural dolly, rather than a flight around the outside walls. */
export function orbit(t: number): Pose {
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  const a = (reduced ? 0 : t * 0.014) + 0.32;
  const R = 10.35;
  const x = Math.sin(a) * R, z = Math.cos(a) * R;
  const y = 4.45;
  const dx = -x, dz = -z, dy = 2.30 - y;
  return { x, y, z, yaw: Math.atan2(-dx, -dz), pitch: Math.atan2(dy, Math.hypot(dx, dz)) };
}

const ease = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const wrapPi = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

/** Frame the central reading table on narrow touch displays without changing
 * walking coordinates, collision volume, desktop spawn or XR orientation. */
const PORTRAIT_TOUCH_SPAWN_PITCH = -0.08;
function entryPitch(): number {
  return window.matchMedia("(pointer: coarse) and (orientation: portrait)").matches
    ? PORTRAIT_TOUCH_SPAWN_PITCH
    : SPAWN.pitch;
}

export function Player() {
  const { camera, gl } = useThree();
  /**
   * Позу держим в модуле, а не в ref: при пересоздании рендерера (смена качества,
   * потеря контекста) компонент перемонтируется, и игрок не должен оказаться в небе.
   */
  const pose = useRef<Pose>(input.pose);
  const tween = useRef<null | { t: number; dur: number; from: Pose; to: () => Pose; arc: number }>(null);
  const prev = useRef<Phase | null>(get().phase);
  // первый кадр после перемонтирования: сразу ставим камеру в сохранённую позу
  const [initial] = useState(() => ({ ...input.pose }));
  const vel = useRef({ x: 0, z: 0 });
  const bob = useRef(0);
  const clockT = useRef(0);
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const center = useMemo(() => new THREE.Vector2(0, 0), []);
  const dev = useRef({ has: false, a: 0, b: 0, g: 0, calib: null as null | number });
  const eul = useMemo(() => new THREE.Euler(), []);
  const q0 = useMemo(() => new THREE.Quaternion(), []);
  const q1 = useMemo(() => new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)), []);
  const qDev = useMemo(() => new THREE.Quaternion(), []);
  const qYaw = useMemo(() => new THREE.Quaternion(), []);
  const zee = useMemo(() => new THREE.Vector3(0, 0, 1), []);
  const fwd = useMemo(() => new THREE.Vector3(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const hitV = useMemo(() => new THREE.Vector3(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);
  const stuck = useRef(0);
  const lastAim = useRef<string | null>(null);
  const stepMark = useRef(0);

  // ввод: мышь (pointer lock), перетаскивание, касания
  useEffect(() => {
    const el = gl.domElement;
    const onMove = (e: MouseEvent) => {
      const s = get();
      if (s.phase !== "play" || s.mode !== "desktop" || tween.current) return;
      if (document.pointerLockElement === el) {
        const sens = input.sens;
        input.yaw -= e.movementX * 0.0022 * sens;
        input.pitch = clamp(input.pitch - e.movementY * 0.0022 * sens, -1.45, 1.45);
      }
    };
    document.addEventListener("mousemove", onMove);

    let id = -1, lx = 0, ly = 0, moved = 0;
    const down = (e: PointerEvent) => {
      const s = get();
      if (s.phase !== "play") return;
      if (document.pointerLockElement === el) {
        if (e.button === 0 && !s.opened && !s.sitemap && !s.paused && !s.photo) {
          if (s.aimed) openItem(s.aimed);
          else {
            ray.setFromCamera(center, camera);
            ray.far = 40;
            const pt = ray.ray.intersectPlane(plane, hitV);
            if (pt && Math.hypot(pt.x, pt.z) < WALK_RADIUS - 0.1) {
              input.dest = { x: pt.x, z: pt.z };
              input.sitting = false;
              if (s.sitting) set({ sitting: false });
            }
          }
        }
        return;
      }
      id = e.pointerId;
      lx = e.clientX;
      ly = e.clientY;
      moved = 0;
      if (s.mode === "cardboard") input.walk = true;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      const s = get();
      const dx = e.clientX - lx, dy = e.clientY - ly;
      lx = e.clientX;
      ly = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      if (s.phase === "play" && s.mode === "desktop" && !tween.current && !s.opened && !s.sitemap) {
        const k = (e.pointerType === "mouse" ? 0.003 : 0.0052) * input.sens;
        input.yaw -= dx * k;
        input.pitch = clamp(input.pitch - dy * k, -1.45, 1.45);
      }
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      id = -1;
      input.walk = false;
      const s = get();
      if (moved < 8 && s.phase === "play" && !s.opened && !s.sitemap && !s.paused && s.mode !== "cardboard" && !s.photo) {
        const rect = el.getBoundingClientRect();
        ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
        ray.setFromCamera(ndc, camera);
        ray.far = 18;
        const hits = ray.intersectObjects(Array.from(registry), false);
        const id = hits[0]?.object.userData.id as string | undefined;
        if (id) openItem(id);
        else {
          const pt = ray.ray.intersectPlane(plane, hitV);
          if (pt && Math.hypot(pt.x, pt.z) < WALK_RADIUS - 0.1) {
            input.dest = { x: pt.x, z: pt.z };
            input.sitting = false;
            if (s.sitting) set({ sitting: false });
          }
        }
      }
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);

    const orient = (e: DeviceOrientationEvent) => {
      if (e.alpha == null) return;
      dev.current.has = true;
      dev.current.a = THREE.MathUtils.degToRad(e.alpha);
      dev.current.b = THREE.MathUtils.degToRad(e.beta ?? 0);
      dev.current.g = THREE.MathUtils.degToRad(e.gamma ?? 0);
    };
    window.addEventListener("deviceorientation", orient);
    return () => {
      document.removeEventListener("mousemove", onMove);
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("deviceorientation", orient);
    };
  }, [gl, camera, ray, center, plane, hitV, ndc]);

  // «замок» указателя
  useEffect(() => {
    const onLock = () => {
      const locked = document.pointerLockElement === gl.domElement;
      const s = get();
      if (locked) set({ locked: true, paused: false });
      else {
        const wasLocked = s.locked;
        set({ locked: false });
        if (
          wasLocked &&
          performance.now() > input.suppressPause &&
          s.phase === "play" &&
          s.mode === "desktop" &&
          !s.opened &&
          !s.sitemap &&
          !s.xr &&
          s.tour === null
        )
          set({ paused: true });
      }
    };
    document.addEventListener("pointerlockchange", onLock);
    return () => document.removeEventListener("pointerlockchange", onLock);
  }, [gl]);

  // сразу после монтирования камера могла сброситься на дефолт — возвращаем позу
  useEffect(() => {
    camera.position.set(initial.x, initial.y, initial.z);
    camera.rotation.set(initial.pitch, initial.yaw, 0, "YXZ");
    camera.updateMatrixWorld();
  }, [camera, initial]);

  useFrame((state, dtRaw) => {
    const s = get();
    if (s.xr) return;
    input.flying = tween.current !== null || s.phase === "intro";
    const dt = Math.min(dtRaw, 0.05);
    const cine = Math.min(dtRaw, 0.35);
    const t = state.clock.elapsedTime;
    clockT.current = t;
    const P = pose.current;

    // смена фазы → плавный перелёт
    if (prev.current !== s.phase) {
      const first = !input.seenIntro;
      prev.current = s.phase;
      if (s.phase === "play") {
        input.seenIntro = true;
        const dest = { x: SPAWN.x, y: EYE, z: SPAWN.z, yaw: SPAWN.yaw, pitch: entryPitch() };
        input.x = dest.x;
        input.z = dest.z;
        input.yaw = dest.yaw;
        input.pitch = dest.pitch;
        vel.current = { x: 0, z: 0 };
        dev.current.calib = null;
        tween.current = {
          t: 0,
          dur: first ? 0.01 : 2.6,
          from: { ...P },
          to: () => dest,
          arc: 0.55,
        };
      } else {
        tween.current = { t: 0, dur: 2.6, from: { ...P }, to: () => orbit(clockT.current), arc: 0 };
      }
    }

    // телепорт по карте сайта, экскурсии или именованной точке
    if (input.goto && s.phase === "play") {
      const key = input.goto;
      input.goto = null;
      const view = VIEWS[key];
      const it = ITEMS.find((i) => i.id === key);
      const ap = view ?? (it ? approachPose(it) : null);
      if (ap) {
        const tgt: Pose = { x: ap.x, y: EYE, z: ap.z, yaw: ap.yaw, pitch: ap.pitch };
        const d = Math.hypot(tgt.x - P.x, tgt.z - P.z);
        tween.current = { t: 0, dur: clamp(d / 7, 0.85, 2.6), from: { ...P }, to: () => tgt, arc: clamp(d / 26, 0.12, 0.85) };
        vel.current = { x: 0, z: 0 };
        input.dest = null;
      }
    }

    const tw = tween.current;
    if (tw) {
      tw.t += cine / tw.dur;
      const k = Math.min(tw.t, 1);
      const e = ease(k);
      const to = tw.to();
      P.x = tw.from.x + (to.x - tw.from.x) * e;
      P.y = tw.from.y + (to.y - tw.from.y) * e + Math.sin(k * Math.PI) * tw.arc;
      P.z = tw.from.z + (to.z - tw.from.z) * e;
      P.yaw = tw.from.yaw + wrapPi(to.yaw - tw.from.yaw) * e;
      P.pitch = tw.from.pitch + (to.pitch - tw.from.pitch) * e;
      if (s.phase === "play") {
        input.x = P.x;
        input.z = P.z;
        input.yaw = wrapPi(P.yaw);
        input.pitch = P.pitch;
      }
      if (k >= 1) tween.current = null;
    } else if (s.phase === "intro") {
      // записываем орбиту в общую позу: возврат на обложку и обратно не теряет состояние
      Object.assign(P, orbit(t));
      Object.assign(input.pose, P);
    } else {
      // ───── свободное перемещение ─────
      const k = input.keys;
      const blocked = s.paused || !!s.opened || s.sitemap || input.sitting;
      let f = (k.has("KeyW") || k.has("ArrowUp") ? 1 : 0) - (k.has("KeyS") || k.has("ArrowDown") ? 1 : 0) - input.joy.y;
      let r = (k.has("KeyD") || k.has("ArrowRight") ? 1 : 0) - (k.has("KeyA") || k.has("ArrowLeft") ? 1 : 0) + input.joy.x;
      if (s.mode === "cardboard" && input.walk && !input.sitting) f = 1;
      if (blocked) f = r = 0;
      if (f !== 0 || r !== 0) input.dest = null;
      const len = Math.hypot(f, r);
      if (len > 1) {
        f /= len;
        r /= len;
      }
      const sprint = k.has("ShiftLeft") || k.has("ShiftRight") ? 1.9 : 1;
      const sp = 3.3 * sprint;
      const sy = Math.sin(input.yaw), cy = Math.cos(input.yaw);
      let tx = (-sy * f + cy * r) * sp;
      let tz = (-cy * f - sy * r) * sp;
      if (input.dest && f === 0 && r === 0 && !blocked) {
        const dx = input.dest.x - input.x;
        const dz = input.dest.z - input.z;
        const d = Math.hypot(dx, dz);
        if (d < 0.28) input.dest = null;
        else {
          tx = (dx / d) * 3.05;
          tz = (dz / d) * 3.05;
        }
      }
      const a = 1 - Math.exp(-9 * dt);
      vel.current.x += (tx - vel.current.x) * a;
      vel.current.z += (tz - vel.current.z) * a;
      const before = input.dest ? Math.hypot(input.dest.x - input.x, input.dest.z - input.z) : 0;
      input.x += vel.current.x * dt;
      input.z += vel.current.z * dt;
      collide();
      if (input.dest) {
        const after = Math.hypot(input.dest.x - input.x, input.dest.z - input.z);
        stuck.current = after > before - 0.004 ? stuck.current + dt : 0;
        if (stuck.current > 0.45 || after < 0.28) {
          input.dest = null;
          stuck.current = 0;
        }
      } else stuck.current = 0;
      const speed = Math.hypot(vel.current.x, vel.current.z);
      bob.current += speed * dt * 2.4;
      if (speed > 0.85) {
        const mark = Math.floor(bob.current / Math.PI);
        if (mark !== stepMark.current) {
          stepMark.current = mark;
          footstep();
        }
      }
      const stand = input.sitting ? 1.02 : EYE;
      const bobY = input.sitting ? 0 : Math.sin(bob.current) * 0.022 * Math.min(speed / 3, 1.3);
      P.x = input.x;
      P.z = input.z;
      P.y += (stand + bobY - P.y) * (1 - Math.exp(-10 * dt));
      P.yaw = input.yaw;
      P.pitch = input.pitch;
    }

    // применяем к камере и запоминаем: перемонтирование сцены позу не потеряет
    Object.assign(input.pose, P);
    camera.position.set(P.x, P.y, P.z);
    if (s.mode === "cardboard" && s.phase === "play" && dev.current.has && !tw) {
      const d = dev.current;
      const orientAngle = THREE.MathUtils.degToRad((screen.orientation?.angle ?? (window as any).orientation ?? 0) as number);
      eul.set(d.b, d.a, -d.g, "YXZ");
      qDev.setFromEuler(eul);
      qDev.multiply(q1);
      qDev.multiply(q0.setFromAxisAngle(zee, -orientAngle));
      if (d.calib === null) {
        fwd.set(0, 0, -1).applyQuaternion(qDev);
        d.calib = input.yaw - Math.atan2(-fwd.x, -fwd.z);
      }
      qYaw.setFromAxisAngle(new THREE.Vector3(0, 1, 0), d.calib);
      camera.quaternion.copy(qYaw).multiply(qDev);
      eul.setFromQuaternion(camera.quaternion, "YXZ");
      input.yaw = eul.y;
      input.pitch = eul.x;
    } else {
      camera.rotation.set(P.pitch, P.yaw, 0, "YXZ");
    }
    camera.updateMatrixWorld();

    // что в центре взгляда?
    if (s.phase === "play" && !tw && !s.paused && !s.opened && !s.sitemap) {
      ray.setFromCamera(center, camera);
      ray.far = 14;
      const hits = ray.intersectObjects(Array.from(registry), false);
      const id = (hits[0]?.object.userData.id as string | undefined) ?? null;
      if (id !== lastAim.current) {
        lastAim.current = id;
        input.dwell = 0;
        if (id !== s.aimed) {
          set({ aimed: id });
          if (id) {
            const idx = ITEMS.findIndex((i) => i.id === id);
            ping(523.25 * Math.pow(2, [0, 2, 4, 7, 9][idx % 5] / 12) * (idx >= 5 ? 1 : 2), 0.035);
          }
        }
      }
      if (s.mode === "cardboard" && id && !input.walk) {
        input.dwell += dt / 1.15;
        if (input.dwell >= 1) {
          input.dwell = 0;
          openItem(id);
        }
      } else input.dwell = Math.max(0, input.dwell - dt * 1.6);
    } else if (s.phase === "intro" && s.aimed) {
      set({ aimed: null });
    }
  });

  return null;
}

/** VR: смещение «ног» игрока, локомоция стиками контроллеров */
export function XRRig() {
  const session = useXR((s) => s.session);
  const origin = useRef<THREE.Group>(null);
  const was = useRef(false);

  useEffect(() => {
    const on = !!session;
    set({ xr: on });
    if (on) {
      was.current = true;
      input.x = SPAWN.x;
      input.z = SPAWN.z;
      input.yaw = 0;
      set({ phase: "play", mode: "desktop", paused: false, opened: null, sitemap: false });
    } else if (was.current) {
      was.current = false;
      set({ phase: "intro", aimed: null });
    }
  }, [session]);

  useXRControllerLocomotion(
    (vel, rotY, dt) => {
      if (get().opened) return;
      input.yaw += rotY;
      input.x += vel.x * dt;
      input.z += vel.z * dt;
      collide();
    },
    { speed: 3.2 },
    { type: "snap", degrees: 45 }
  );

  useFrame(() => {
    if (origin.current) {
      origin.current.position.set(input.x, 0, input.z);
      origin.current.rotation.y = input.yaw;
    }
  });
  return session ? <XROrigin ref={origin} /> : null;
}

/** Режим VR-очков для телефона (Cardboard): стерео-рендер + гироскоп + прицел */
export function CardboardRig() {
  const { gl, scene, camera, size } = useThree();
  const effect = useMemo(() => {
    const e = new StereoEffect(gl);
    e.setEyeSeparation(0.064);
    return e;
  }, [gl]);
  const ret = useMemo(() => {
    const g = new THREE.Group();
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.012, 0.02, 40),
      new THREE.MeshBasicMaterial({ color: "#ffd58a", depthTest: false, transparent: true, toneMapped: false, side: THREE.DoubleSide })
    );
    const fill = new THREE.Mesh(
      new THREE.RingGeometry(0.004, 0.011, 40),
      new THREE.MeshBasicMaterial({ color: "#fff6dc", depthTest: false, transparent: true, opacity: 0.85, toneMapped: false, side: THREE.DoubleSide })
    );
    g.add(ring, fill);
    g.renderOrder = 999;
    return g;
  }, []);

  useEffect(() => {
    scene.add(ret);
    return () => {
      scene.remove(ret);
      gl.setScissorTest(false);
      gl.setViewport(0, 0, size.width, size.height);
    };
  }, [scene, gl, size.width, size.height, ret]);

  useFrame(() => {
    ret.position.copy(camera.position);
    ret.quaternion.copy(camera.quaternion);
    ret.translateZ(-1.35);
    const d = input.dwell;
    ret.scale.setScalar(1 + d * 0.85);
    (ret.children[1] as THREE.Mesh).scale.setScalar(0.35 + d * 0.7);
    effect.render(scene, camera);
  }, 1);
  return null;
}
