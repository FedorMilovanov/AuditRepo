import { create } from "zustand";
import { createXRStore } from "@react-three/xr";
import type { Object3D } from "three";
import { pageTurn, startAudio, setSound } from "./audio";
import { ITEMS, TOUR } from "./data";
import { appendVisitedRecord, parseVisited } from "./visited";

export type Phase = "intro" | "play";
export type Mode = "desktop" | "cardboard";

export const coarse =
  typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches;

interface State {
  ready: boolean;
  phase: Phase;
  mode: Mode;
  xr: boolean;
  xrSupported: boolean;
  paused: boolean;
  locked: boolean;
  aimed: string | null;
  opened: string | null;
  sitemap: boolean;
  quality: "high" | "low";
  qualityTransitioning: boolean;
  sound: boolean;
  tour: number | null;
  sitting: boolean;
  visited: string[];
  sens: number;
  photo: boolean;
  toast: string | null;
  glLost: boolean;
  fatal: null | string;
}

/** Corrupt session history must never crash the sitemap (or erase the
 * original localStorage record without the user's explicit consent). */
function readVisited(): string[] {
  try {
    return parseVisited(localStorage.getItem("gb-hall-seen"), ITEMS.map((it) => it.id));
  } catch {
    return [];
  }
}
function readNum(key: string, fallback: number) {
  try { const raw = localStorage.getItem(key); if (raw === null) return fallback; const v = Number(raw); return Number.isFinite(v) ? v : fallback; } catch { return fallback; }
}

export const useApp = create<State>(() => ({
  ready: false,
  phase: "intro",
  mode: "desktop",
  xr: false,
  xrSupported: false,
  paused: false,
  locked: false,
  aimed: null,
  opened: null,
  sitemap: false,
  quality: (() => { try { const saved = localStorage.getItem("gb-hall-quality"); return saved === "high" || saved === "low" ? saved : coarse ? "low" : "high"; } catch { return coarse ? "low" : "high"; } })(),
  qualityTransitioning: false,
  sound: (() => { try { return localStorage.getItem("gb-hall-sound") !== "0"; } catch { return true; } })(),
  tour: null,
  sitting: false,
  visited: readVisited(),
  sens: Math.min(2.2, Math.max(0.35, readNum("gb-hall-sens", 1))),
  photo: false,
  toast: null,
  glLost: false,
  fatal: null,
}));

/** Станция из ссылки вида …#s=articles */
export const deepLink = (() => {
  try {
    const h = new URLSearchParams(location.hash.replace(/^#/, ""));
    return h.get("s");
  } catch {
    return null;
  }
})();

export const set = useApp.setState;
export const get = useApp.getState;

/** Изменяемое состояние «игрока» — читается каждый кадр без ре-рендера React. */
export const input = {
  keys: new Set<string>(),
  joy: { x: 0, y: 0 },
  walk: false,
  x: 0,
  z: 9.6,
  yaw: 0,
  pitch: 0.02,
  goto: null as string | null,
  dest: null as null | { x: number; z: number },
  resetSpawn: false,
  sitting: false,
  dwell: 0,
  sens: 1,
  /** не ставить паузу сразу после намеренного выхода из pointer lock */
  suppressPause: 0,
  /** поза камеры живёт здесь, а не в React: перемонтирование сцены её не теряет */
  pose: { x: 0, y: 1.65, z: 9.6, yaw: 0, pitch: 0.02 },
  seenIntro: false,
  flying: false,
};
input.sens = useApp.getState().sens;

export const registry = new Set<Object3D>();

export const xrStore = createXRStore({
  emulate: false,
  foveation: 0,
  frameRate: "high",
});

let lastUnlock = 0;

/**
 * Браузер отказывает в повторном захвате курсора примерно секунду после выхода.
 * Прямой запрос в этот момент даёт ошибку и «мигающую» паузу, поэтому ждём и повторяем.
 */
export function relock(attempt = 0) {
  const s = get();
  if (coarse || s.mode === "cardboard" || s.xr || s.phase !== "play" || s.opened || s.sitemap || document.querySelector("[data-gb-progression-modal], [data-gb-cabinet-modal]")) return;
  const el = document.querySelector("canvas");
  if (!el) return;
  const wait = performance.now() - lastUnlock < 1300 ? 320 : 0;
  if (wait) {
    if (attempt > 2) return;
    window.setTimeout(() => relock(attempt + 1), wait);
    return;
  }
  input.suppressPause = performance.now() + 900;
  try {
    const p: any = el.requestPointerLock?.();
    p?.catch?.(() => {});
  } catch {
    /* ignore */
  }
}

/** Выход из захвата без вспышки паузы. */
export function exitLock() {
  if (document.pointerLockElement) {
    lastUnlock = performance.now();
    input.suppressPause = performance.now() + 1000;
    document.exitPointerLock?.();
  }
}

export function enterDesktop() {
  startAudio(get().sound);
  set({ phase: "play", mode: "desktop", paused: false, opened: null, sitemap: false });
  relock();
}

export async function enterCardboard() {
  startAudio(get().sound);
  try {
    const DOE: any = (window as any).DeviceOrientationEvent;
    if (DOE?.requestPermission) await DOE.requestPermission();
  } catch {
    /* ignore */
  }
  try {
    await document.documentElement.requestFullscreen?.();
    await (screen.orientation as any)?.lock?.("landscape");
  } catch {
    /* ignore */
  }
  set({ phase: "play", mode: "cardboard", quality: "low", paused: false, opened: null, sitemap: false });
}

export async function enterVR() {
  startAudio(get().sound);
  input.resetSpawn = true;
  try {
    await xrStore.enterVR();
  } catch (e) {
    console.warn("VR недоступен", e);
  }
}

export function exitToCover() {
  exitLock();
  if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  set({ phase: "intro", mode: "desktop", opened: null, sitemap: false, paused: false, aimed: null });
}

export function markVisited(id: string) {
  const cur = get().visited;
  if (cur.includes(id)) return;
  const next = [...cur, id];
  set({ visited: next });
  try {
    // Unknown/legacy IDs are retained. Invalid raw data is never overwritten;
    // the source-owned pure append function is independently regression-tested.
    const nextRecord = appendVisitedRecord(localStorage.getItem("gb-hall-seen"), id);
    if (nextRecord === null) {
      notify("История посещений повреждена или переполнена: исходные данные не перезаписаны.");
      return;
    }
    localStorage.setItem("gb-hall-seen", nextRecord);
  } catch {
    /* Storage is unavailable; the in-memory visited UI still works. */
  }
}

export function openItem(id: string) {
  input.suppressPause = performance.now() + 700;
  input.dwell = 0;
  markVisited(id);
  pageTurn();
  set({ opened: id, sitemap: false, aimed: id, paused: false });
  exitLock();
}

export function closeItem(resume = true) {
  set({ opened: null });
  if (resume) relock();
}

export function toggleSitemap(force?: boolean) {
  const next = force ?? !get().sitemap;
  set({ sitemap: next, opened: null });
  if (next) exitLock();
  else relock();
}

export function flyTo(id: string) {
  input.goto = id;
  input.dest = null;
  input.sitting = false;
  const s = get();
  const entering = s.phase !== "play";
  if (entering) startAudio(s.sound);
  set({
    phase: "play",
    mode: s.xr ? s.mode : entering ? "desktop" : s.mode,
    sitemap: false,
    opened: null,
    paused: false,
    sitting: false,
    tour: null,
  });
  if (!entering && !s.xr && get().mode !== "cardboard") relock();
}

export function startTour() {
  startAudio(get().sound);
  input.sitting = false;
  input.dest = null;
  input.suppressPause = performance.now() + 700;
  exitLock();
  set({ tour: 0, phase: "play", mode: "desktop", sitemap: false, opened: null, paused: false, sitting: false });
  input.goto = TOUR[0].goto;
}

export function tourStep(delta: number) {
  const cur = get().tour ?? 0;
  const i = cur + delta;
  if (i < 0 || i >= TOUR.length) {
    endTour();
    return;
  }
  set({ tour: i, opened: null, paused: false });
  input.goto = TOUR[i].goto;
  input.dest = null;
}

export function endTour() {
  input.suppressPause = performance.now() + 700;
  set({ tour: null });
}

export function toggleSit() {
  const s = get();
  if (s.phase !== "play" || s.xr || s.opened) return;
  const next = !s.sitting;
  input.sitting = next;
  if (next) input.dest = null;
  set({ sitting: next });
}

export function setSens(v: number) {
  const sens = Math.min(2.2, Math.max(0.35, v));
  input.sens = sens;
  set({ sens });
  try {
    localStorage.setItem("gb-hall-sens", String(sens));
  } catch {
    /* ignore */
  }
}

/**
 * Switching shadows and GPU texture sizes can stall the browser's rendering
 * thread on first compilation. Show the transition layer on a rendered frame
 * BEFORE submitting the expensive quality mutation. Release it after frames
 * resume, not after an elapsed timeout that can expire during the stall.
 *
 * Repeated taps are coalesced. If VR/mode or quality changes via another path
 * during preparation, abort instead of applying a stale quality choice.
 */
export function toggleQuality() {
  const before = get();
  if (before.qualityTransitioning) return;
  const next = before.quality === "high" ? "low" : "high";
  set({ qualityTransitioning: true });

  let preparationFrames = 0;
  const prepare = () => {
    if (++preparationFrames < 2) {
      requestAnimationFrame(prepare);
      return;
    }
    const current = get();
    if (current.quality !== before.quality || current.mode !== before.mode || current.xr !== before.xr || current.phase !== before.phase || current.fatal !== before.fatal) {
      set({ qualityTransitioning: false });
      return;
    }
    set({ quality: next });
    try {
      localStorage.setItem("gb-hall-quality", next);
    } catch {
      /* ignore */
    }
    // rAF pauses when a graphics pipeline stalls, unlike setTimeout.
    let settledFrames = 0;
    const settle = () => {
      if (++settledFrames >= 2) set({ qualityTransitioning: false });
      else requestAnimationFrame(settle);
    };
    requestAnimationFrame(settle);
  };
  requestAnimationFrame(prepare);
}

export function toggleSound() {
  const on = !get().sound;
  set({ sound: on });
  try {
    localStorage.setItem("gb-hall-sound", on ? "1" : "0");
  } catch {
    /* ignore */
  }
  if (on) startAudio(true);
  else setSound(false);
}

export function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen?.();
  else document.documentElement.requestFullscreen?.().catch(() => {});
}

let toastTimer = 0;
export function notify(text: string) {
  set({ toast: text });
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => set({ toast: null }), 4200);
}

export function togglePhoto(force?: boolean) {
  const next = force ?? !get().photo;
  if (next) {
    exitLock();
    input.dest = null;
  }
  set({ photo: next });
}

export function stationLink(id: string) {
  return `${location.origin}${location.pathname}#s=${id}`;
}

export async function shareStation(id: string) {
  const url = stationLink(id);
  const it = ITEMS.find((i) => i.id === id);
  const name = it ? it.title : "Место в зале";
  try {
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (nav.share) {
      await nav.share({ title: name, text: "Место в 3D-зале библиотеки", url });
      return;
    }
    await navigator.clipboard.writeText(url);
    notify("Ссылка на это место скопирована");
  } catch {
    notify("Скопируйте из адресной строки: " + url);
  }
}
