import { useEffect, useRef, useState } from "react";
import { useApp as useStore, get, input, set, openItem, closeItem, toggleSitemap, startTour, tourStep, endTour, toggleSit, togglePhoto, flyTo, deepLink } from "./store";
import { loadFonts } from "./fonts";
import World from "./scene/World";
import { SceneBoundary } from "./scene/SceneBoundary";
import Overlay from "./ui/Overlay";

const MOVE_KEYS = ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ShiftLeft", "ShiftRight"];

/** Нет WebGL — вместо чёрного экрана честно объясняем и отдаём обычный сайт. */
function webglOk() {
  try {
    const c = document.createElement("canvas");
    return !!c.getContext("webgl2");
  } catch {
    return false;
  }
}

export default function App() {
  const [fontsReady, setFontsReady] = useState(false);
  const fatal = useStore((s) => s.fatal);

  useEffect(() => {
    if (!webglOk()) {
      set({
        fatal:
          "Браузер не дал доступ к WebGL, поэтому 3D-зал не запускается. Обычно помогает обновление браузера или включение аппаратного ускорения в настройках.",
      });
      return;
    }
    loadFonts().catch(() => {}).finally(() => setFontsReady(true));
    // Card edition B accidentally removed VR capability detection, leaving a
    // permanently hidden button even on supported headsets. Restore safely.
    try {
      (navigator as Navigator & { xr?: { isSessionSupported?: (mode: string) => Promise<boolean> } }).xr
        ?.isSessionSupported?.("immersive-vr")
        .then((supported) => set({ xrSupported: !!supported }))
        .catch(() => set({ xrSupported: false }));
    } catch { set({ xrSupported: false }); }

    // Страховка: если зал так и не отрисовался, показываем понятное сообщение.
    const watchdog = window.setTimeout(() => {
      if (!get().ready && !get().fatal)
        set({
          fatal:
            "Зал не смог отрисоваться за отведённое время — видеоадаптер занят или ограничен браузером. Обновите страницу или откройте библиотеку в обычном виде.",
        });
    }, 30000);
    return () => window.clearTimeout(watchdog);
  }, []);

  // Ссылка вида …#s=articles открывает зал сразу у нужной станции.
  useEffect(() => {
    if (!deepLink) return;
    const onReady = (s: { ready: boolean }) => {
      if (!s.ready) return;
      unsub();
      try {
        history.replaceState(null, "", location.pathname + location.search);
      } catch {
        /* ignore */
      }
      flyTo(deepLink as string);
    };
    const unsub = useStore.subscribe(onReady);
    return unsub;
  }, []);

  useEffect(() => {
    const kd = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || document.querySelector("[data-gb-progression-modal], [data-gb-cabinet-modal]")) return;
      const s = get();
      if (s.fatal) return;
      if (s.phase === "play" && MOVE_KEYS.includes(e.code)) {
        input.keys.add(e.code);
        input.dest = null;
        if (s.sitting) toggleSit();
        if (e.code.startsWith("Arrow")) e.preventDefault();
      }
      if (e.repeat) return;
      if (s.phase === "play" && (e.code === "KeyE" || e.code === "KeyF") && s.aimed && !s.opened && !s.paused && !s.sitemap) openItem(s.aimed);
      if (e.code === "KeyM") toggleSitemap();
      if (e.code === "KeyT" && s.phase === "play" && !s.opened && !s.sitemap && !s.xr) {
        if (s.tour === null) startTour();
        else tourStep(1);
      }
      if (e.code === "KeyC" && s.phase === "play" && !s.opened && !s.sitemap) toggleSit();
      if (e.code === "KeyH" && s.phase === "play") togglePhoto();
      if (e.code === "Escape") {
        if (s.photo) togglePhoto(false);
        else if (s.opened) {
          input.suppressPause = performance.now() + 600;
          closeItem(false);
        } else if (s.sitemap) {
          input.suppressPause = performance.now() + 600;
          toggleSitemap(false);
        } else if (s.tour !== null) endTour();
        else if (s.sitting) toggleSit();
      }
    };
    const ku = (e: KeyboardEvent) => input.keys.delete(e.code);
    const blur = () => input.keys.clear();
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
      window.removeEventListener("blur", blur);
    };
  }, []);

  return (
    <div className="fixed inset-0 select-none overflow-hidden bg-[#c4c1b7]">
      {!fatal && fontsReady && (
        <SceneBoundary onCrash={(m) => set({ fatal: m })}>
          <World />
        </SceneBoundary>
      )}
      <Overlay fontsReady={fontsReady} />
      <FadeVeil />
    </div>
  );
}

/**
 * При переключении качества или входе в очки композер и материалы пересобираются —
 * без этой вуали это выглядит как мигание картинки.
 * Фото-режим меняет только HUD, не Canvas/материалы: сплошная вуаль
 * при входе/выходе из фото-режима не нужна и скрывает готовый 3D-кадр.
 */
function FadeVeil() {
  const quality = useStore((s) => s.quality);
  const mode = useStore((s) => s.mode);
  const xr = useStore((s) => s.xr);
  const [on, setOn] = useState(false);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setOn(true);
    const t = window.setTimeout(() => setOn(false), 520);
    return () => window.clearTimeout(t);
  }, [quality, mode, xr]);
  return (
    <div
      data-gb-fade-veil
      className="pointer-events-none fixed inset-0 z-[60] bg-[#c4c1b7] transition-opacity duration-500"
      style={{ opacity: on ? 1 : 0 }}
    />
  );
}
