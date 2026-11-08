import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import { XR } from "@react-three/xr";
import { useApp, xrStore, set, get, input, toggleQuality, notify } from "../store";
import { Platform } from "./Platform";
import { Center } from "./Center";
import { Stations } from "./Stations";
import { Cards, VRDetail } from "./Cards";
import { Dressing } from "./Dressing";
import { Tomes } from "./Tomes";
import { Vault } from "./Vault";
import { Architecture } from "./Architecture";
import { Player, XRRig, CardboardRig } from "./Player";

/** The visual target is daylight architectural realism, not cinematic bloom. */
function ReadyFlag() {
  const n = useRef(0);
  useFrame(() => {
    if (n.current < 12 && ++n.current === 12) set({ ready: true });
  });
  return null;
}

/**
 * Если зал идёт рывками — сам переходит на «Лёгкую» графику, один раз за сессию.
 * Меряем только когда игрок стоит или идёт сам: во время перелётов кадр всегда тяжёлый.
 */
function AutoQuality() {
  const acc = useRef({ t: 0, n: 0, low: 0, spent: 0, done: false });
  useFrame((_, dt) => {
    const s = get();
    const a = acc.current;
    if (a.done || s.quality !== "high" || s.xr || s.mode === "cardboard") return;
    if (s.phase !== "play" || s.photo || s.paused || s.sitemap || s.opened || input.flying) {
      a.t = 0;
      a.n = 0;
      return;
    }
    a.t += dt;
    a.n++;
    a.spent += dt;
    if (a.t > 4 && a.spent > 10) {
      const fps = a.n / a.t;
      a.low = fps < 36 ? a.low + 1 : 0;
      a.t = 0;
      a.n = 0;
      if (a.low >= 3) {
        a.done = true;
        toggleQuality();
        notify("Включил «Лёгкую» графику — так плавнее.");
      }
    }
  });
  return null;
}

/**
 * Progressive pixel-ratio adaptation keeps geometry/material quality high while
 * lowering fill-rate cost before falling back to the full "low" preset.
 * CPU bottlenecks are left to the existing persistent-low-FPS fallback.
 */
function AdaptiveResolution() {
  const setDpr = useThree((state) => state.setDpr);
  const metrics = useRef({ seconds: 0, frames: 0, recovering: 0 });
  useFrame((state, dt) => {
    const s = get();
    const m = metrics.current;
    if (s.quality !== "high" || s.xr || s.mode === "cardboard" || s.phase !== "play" ||
      s.paused || s.opened || s.sitemap || s.photo || input.flying || dt >= 0.2) {
      m.seconds = 0; m.frames = 0; m.recovering = 0;
      return;
    }
    m.seconds += dt;
    m.frames++;
    if (m.seconds < 3.2) return;
    const fps = m.frames / m.seconds;
    const actual = state.viewport.dpr;
    const max = Math.min(window.devicePixelRatio || 1, window.matchMedia?.("(pointer: coarse)").matches ? 1.5 : 1.75);
    if (fps < 47 && actual > 1.02) {
      setDpr(Math.max(1, Math.round((actual - 0.15) * 100) / 100));
      m.recovering = 0;
    } else if (fps > 58 && actual < max - 0.05) {
      m.recovering += m.seconds;
      if (m.recovering >= 12) {
        setDpr(Math.min(max, Math.round((actual + 0.1) * 100) / 100));
        m.recovering = 0;
      }
    } else {
      m.recovering = 0;
    }
    if (new URLSearchParams(window.location.search).get("debug3d") === "1") {
      console.info(`[Library 3D] ${fps.toFixed(1)} FPS; DPR ${actual.toFixed(2)}`);
    }
    m.frames = 0; m.seconds = 0;
  });
  return null;
}

function Cardboard() {
  const mode = useApp((s) => s.mode);
  const phase = useApp((s) => s.phase);
  return mode === "cardboard" && phase === "play" ? <CardboardRig /> : null;
}

/** Настройки контекста фиксируются один раз: WebGL не умеет менять их на ходу,
 *  а новая объектная обёртка заставила бы R3F пересоздать рендерер — и «мигнуть». */
const GL = {
  antialias: true,
  powerPreference: "high-performance" as const,
  stencil: false,
  alpha: false,
  depth: true,
};
const CAMERA = { fov: 68, near: 0.15, far: 450, position: [0, 9.5, 21] as [number, number, number] };

export default function World() {
  const q = useApp((s) => s.quality);
  const coarse = typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)").matches;

  return (
    <Canvas
      dpr={q === "high" ? [1, coarse ? 1.5 : 1.75] : [1, 1.25]}
      camera={CAMERA}
      shadows={q === "high" ? "percentage" : false}
      gl={GL}
      onCreated={({ gl }) => {
        // Потеря контекста — самая частая причина «чёрного экрана» на слабых GPU.
        gl.domElement.addEventListener(
          "webglcontextlost",
          (e) => {
            e.preventDefault();
            set({ glLost: true });
          },
          false
        );
        gl.domElement.addEventListener(
          "webglcontextrestored",
          () => {
            set({ glLost: false });
          },
          false
        );
      }}
    >
      <XR store={xrStore}>
        <color attach="background" args={["#d4e3e9"]} />
        <fog attach="fog" args={["#d9e2e2", 85, 360]} />
        <Sky sunPosition={[-36, 58, -48]} turbidity={2.8} rayleigh={0.75} mieCoefficient={0.004} mieDirectionalG={0.78} distance={380} />
        <ambientLight intensity={0.34} />
        <hemisphereLight args={["#eaf1f4", "#8f7b68", 1.15]} />
        <directionalLight
          position={[-22, 35, -28]}
          color="#fff0d6"
          intensity={2.15}
          castShadow={q === "high"}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-24}
          shadow-camera-right={24}
          shadow-camera-top={24}
          shadow-camera-bottom={-24}
          shadow-camera-near={1}
          shadow-camera-far={90}
          shadow-bias={-0.00012}
          shadow-normalBias={0.035}
        />
        <directionalLight position={[13, 13, 17]} intensity={0.35} color="#d9e7f1" />

        <Platform />
        <Architecture />
        <Vault />
        <Center />
        <Stations />
        <Cards />
        <Tomes />
        <Dressing />
        <VRDetail />

        <Player />
        <XRRig />
        <Cardboard />
        <ReadyFlag />
        <AdaptiveResolution />
        <AutoQuality />
      </XR>
    </Canvas>
  );
}
