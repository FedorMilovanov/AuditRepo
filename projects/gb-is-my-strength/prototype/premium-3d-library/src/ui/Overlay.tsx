import { useCallback, useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { BASE, ITEMS, TOUR, byId, itemPos, type Item } from "../data";
import ProgressPanel from "../progression/ProgressPanel";
import CabinetPanel from "../cabinet/CabinetPanel";
import { exitLock } from "../store";
import {
  useApp,
  input,
  coarse,
  enterDesktop,
  enterCardboard,
  enterVR,
  exitToCover,
  openItem,
  closeItem,
  toggleSitemap,
  flyTo,
  toggleSound,
  toggleFullscreen,
  toggleQuality,
  toggleSit,
  startTour,
  endTour,
  tourStep,
  setSens,
  relock,
  set,
  togglePhoto,
  shareStation,
} from "../store";

/* ─────────── иконки ─────────── */
const Ico = ({ d, size = 18 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const I = {
  map: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14",
  soundOn: "M11 5 6 9H3v6h3l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13",
  soundOff: "M11 5 6 9H3v6h3l5 4V5zM22 9l-6 6M16 9l6 6",
  full: "M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5",
  home: "M3 11 12 3l9 8M5 10v10h14V10",
  ext: "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
  gauge: "M12 14l4-4M3.3 17a10 10 0 1 1 17.4 0",
  x: "M6 6l12 12M18 6 6 18",
  vr: "M2 8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-4l-2-3h-4l-2 3H4a2 2 0 0 1-2-2V8z",
  tour: "M4 6h16M4 12h10M4 18h13",
  cam: "M4 8h3l2-3h6l2 3h3v11H4zM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
  link: "M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1",
  walk: "M13 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM11 21l2-6-2-3 1-4 3 4 3 1M9 12l-2 4M14 15l-1 6",
};

function Btn({ children, onClick, title, active }: { children: ReactNode; onClick: () => void; title?: string; active?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`glass pointer-events-auto flex h-10 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium tracking-wide text-[#f5f1e7] transition hover:border-[#d8b88d] hover:bg-white/10 active:scale-95 ${
        active ? "!border-[#d8b88d]" : ""
      }`}
    >
      {children}
    </button>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex min-w-[26px] items-center justify-center rounded-md border border-white/20 bg-white/10 px-1.5 py-0.5 font-mono text-[11px] text-[#d8b88d]">
      {children}
    </kbd>
  );
}

/* ─────────── загрузка ─────────── */
function Loader({ fontsReady }: { fontsReady: boolean }) {
  const ready = useApp((s) => s.ready);
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (ready) {
      const t = setTimeout(() => setGone(true), 1100);
      return () => clearTimeout(t);
    }
  }, [ready]);
  if (gone) return null;
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#181c1a] transition-opacity duration-1000 ${
        ready ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative mb-8 h-20 w-20">
        <div className="absolute inset-0 animate-spin rounded-full border border-[#d8b88d]/30 border-t-[#d8b88d]" style={{ animationDuration: "2.4s" }} />
        <div className="absolute inset-3 animate-spin rounded-full border border-[#d8b88d]/20 border-b-[#d8b88d]" style={{ animationDuration: "1.6s", animationDirection: "reverse" }} />
        <div className="absolute inset-[30px] rounded-full bg-[#d8b88d] shadow-[0_0_22px_5px_rgba(216,184,141,0.3)]" />
      </div>
      <div className="font-display text-3xl tracking-wide text-[#f5f1e7]">Господь Бог — сила моя</div>
      <div className="mt-2 text-xs uppercase tracking-[0.35em] text-[#d8b88d]/80">{fontsReady ? "Возводим зал…" : "Загружаем шрифты…"}</div>
    </div>
  );
}

/* ─────────── обложка ─────────── */
function Intro({ onProgress, onCabinet }: { onProgress: () => void; onCabinet: () => void }) {
  const phase = useApp((s) => s.phase);
  const ready = useApp((s) => s.ready);
  const xrSupported = useApp((s) => s.xrSupported);
  if (phase !== "intro" || !ready) return null;
  return (
    <div data-gb-intro className="pointer-events-auto fixed inset-0 z-20 flex flex-col justify-between gap-6 overflow-x-hidden overflow-y-auto overscroll-y-contain p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] pt-[calc(1.25rem+env(safe-area-inset-top,0px))] sm:p-8">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#181c1a]/85 via-[#181c1a]/40 to-transparent sm:via-[#181c1a]/25" />
      <header className="fade-up flex shrink-0 items-start justify-between gap-4">
        <div className="glass pointer-events-auto flex items-center gap-3 rounded-full py-2 pl-2 pr-5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-b from-[#f9f1dc] to-[#b49a73] font-display text-lg font-semibold text-[#24231f]">Г</span>
          <span className="font-display text-lg leading-none">
            Богословская библиотека
            <span className="block pt-0.5 font-body text-[10px] uppercase tracking-[0.25em] text-[#d8b88d]/80">gospod-bog.ru</span>
          </span>
        </div>
        <div className="flex gap-2">
          <Btn onClick={() => toggleSitemap(true)} title="Карта сайта">
            <Ico d={I.map} /> <span className="hidden sm:inline">Карта сайта</span>
          </Btn>
          <a
            href={BASE}
            className="glass pointer-events-auto flex h-10 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium text-[#f5f1e7] transition hover:border-[#d8b88d]"
          >
            <Ico d={I.home} /> <span className="hidden sm:inline">Обычный сайт</span>
          </a>
        </div>
      </header>

      <main className="max-w-2xl shrink-0 pb-2">
        <div className="fade-up mb-4 inline-flex items-center gap-2 rounded-full border border-[#d8b88d]/40 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-[#d8b88d] backdrop-blur" style={{ animationDelay: "0.1s" }}>
          <span className="h-1.5 w-1.5 rounded-full bg-[#d8b88d]" /> Аввакум 3:19
        </div>
        <h1 className="fade-up font-display text-5xl font-semibold leading-[0.95] sm:text-7xl" style={{ animationDelay: "0.2s" }}>
          <span className="gold-text">Библиотека</span>
          <br />
          знаний
        </h1>
        <p className="fade-up mt-5 max-w-xl text-[15px] leading-relaxed text-[#e0dcd1]/90 sm:text-base" style={{ animationDelay: "0.35s" }}>
          Пространство для вдумчивого изучения Писания, богословия и истории Церкви. Пройдите по залу, выберите раздел или книгу, воспользуйтесь экскурсией. Для чтения всегда доступен обычный сайт.
        </p>

        <div className="fade-up mt-7 flex flex-wrap items-center gap-3" style={{ animationDelay: "0.5s" }}>
          <button
            onClick={enterDesktop}
            className="pointer-events-auto group relative flex h-14 items-center gap-3 overflow-hidden rounded-full bg-gradient-to-b from-[#e8cfaa] to-[#c29b6d] px-8 text-[15px] font-semibold tracking-wide text-[#24231f] shadow-[0_12px_36px_rgba(31,26,21,0.30)] transition hover:scale-[1.03] active:scale-95"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <span className="relative">Войти в библиотеку</span>
            <span className="relative text-xl">→</span>
          </button>
          <button
            onClick={startTour}
            className="glass pointer-events-auto flex h-14 items-center gap-2.5 rounded-full px-6 text-[15px] font-semibold text-[#f5f1e7] transition hover:border-[#d8b88d] hover:bg-white/10 active:scale-95"
          >
            <Ico d={I.tour} size={18} /> Экскурсия
          </button>
          <button onClick={onProgress} className="glass pointer-events-auto flex h-14 items-center gap-2 rounded-full px-6 text-[15px] font-semibold text-[#f5f1e7] transition hover:border-[#d8b88d]">Путь исследователя</button>
          <button onClick={onCabinet} className="glass pointer-events-auto flex h-14 items-center gap-2 rounded-full px-6 text-[15px] font-semibold text-[#f5f1e7] transition hover:border-[#d8b88d]">Моя библиотека</button>
          {xrSupported && (
            <button
              onClick={enterVR}
              className="glass pointer-events-auto flex h-14 items-center gap-2.5 rounded-full px-6 text-[15px] font-semibold text-[#f5f1e7] transition hover:border-[#d8b88d] hover:bg-white/10 active:scale-95"
            >
              <Ico d={I.vr} size={22} /> Войти в VR
            </button>
          )}
          {coarse && (
            <button
              onClick={enterCardboard}
              className="glass pointer-events-auto flex h-14 items-center gap-2.5 rounded-full px-6 text-[15px] font-semibold text-[#f5f1e7] transition hover:border-[#d8b88d] active:scale-95"
            >
              <Ico d={I.vr} size={22} /> Очки Cardboard
            </button>
          )}
        </div>

        <div className="fade-up mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#c3c0b8]" style={{ animationDelay: "0.65s" }}>
          {coarse ? (
            <>
              <span>Стик — идти</span>
              <span>Касание пола — подойти</span>
              <span>Касание книги — открыть</span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1"><Kbd>W</Kbd><Kbd>A</Kbd><Kbd>S</Kbd><Kbd>D</Kbd> ходьба</span>
              <span className="flex items-center gap-1">мышь — обзор</span>
              <span className="flex items-center gap-1"><Kbd>Shift</Kbd> бег</span>
              <span className="flex items-center gap-1"><Kbd>E</Kbd> открыть</span>
              <span className="flex items-center gap-1"><Kbd>T</Kbd> экскурсия</span>
              <span className="flex items-center gap-1"><Kbd>C</Kbd> присесть</span>
              <span className="flex items-center gap-1"><Kbd>M</Kbd> карта сайта</span>
            </>
          )}
          {!xrSupported && !coarse && <span className="text-[#d8b88d]/70">VR: откройте страницу в браузере шлема (Quest, Pico) — появится кнопка «Войти в VR»</span>}
        </div>
      </main>
    </div>
  );
}

/* ─────────── HUD ─────────── */
function Crosshair() {
  const aimed = useApp((s) => s.aimed);
  const phase = useApp((s) => s.phase);
  const paused = useApp((s) => s.paused);
  const opened = useApp((s) => s.opened);
  const sitemap = useApp((s) => s.sitemap);
  const xr = useApp((s) => s.xr);
  const mode = useApp((s) => s.mode);
  if (phase !== "play" || paused || opened || sitemap || xr || mode === "cardboard") return null;
  return (
    <div className="pointer-events-none fixed left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
      <div className={`rounded-full border transition-all duration-200 ${aimed ? "h-9 w-9 border-[#d8b88d] bg-[#d8b88d]/20 shadow-[0_0_12px_rgba(216,184,141,0.4)]" : "h-2 w-2 border-white/70 bg-white/60"}`} />
    </div>
  );
}

function AimTooltip() {
  const aimed = useApp((s) => s.aimed);
  const phase = useApp((s) => s.phase);
  const paused = useApp((s) => s.paused);
  const opened = useApp((s) => s.opened);
  const sitemap = useApp((s) => s.sitemap);
  const xr = useApp((s) => s.xr);
  const mode = useApp((s) => s.mode);
  const tour = useApp((s) => s.tour);
  if (!aimed || phase !== "play" || paused || opened || sitemap || xr || mode === "cardboard" || tour !== null) return null;
  const it = byId(aimed);
  return (
    <div data-gb-aim className={`pointer-events-none fixed inset-x-0 z-10 flex justify-center px-4 ${coarse ? "bottom-[calc(11rem+env(safe-area-inset-bottom,0px))]" : "bottom-24 sm:bottom-10"}`}>
      <div key={aimed} className="glass fade-up pointer-events-auto flex max-w-lg items-center gap-4 rounded-3xl p-4 pr-5" style={{ animationDuration: "0.35s", borderColor: it.color + "99" }}>
        <div className="h-12 w-1 shrink-0 rounded-full" style={{ background: it.color, boxShadow: `0 0 16px ${it.color}` }} />
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.25em]" style={{ color: it.color }}>{it.label}</div>
          <div className="truncate font-display text-xl font-semibold leading-tight sm:text-2xl">{it.title}</div>
          <div className="mt-0.5 line-clamp-1 text-xs text-[#c3c0b8]">{it.desc}</div>
        </div>
        <button
          onClick={() => openItem(aimed)}
          className="flex shrink-0 items-center gap-2 rounded-full bg-[#d8b88d] px-4 py-2 text-sm font-semibold text-[#24231f] active:scale-95"
        >
          {!coarse && <span className="rounded bg-black/15 px-1.5 text-[11px]">E</span>} Открыть
        </button>
      </div>
    </div>
  );
}

function Minimap() {
  const phase = useApp((s) => s.phase);
  const xr = useApp((s) => s.xr);
  const mode = useApp((s) => s.mode);
  const cv = useRef<HTMLCanvasElement>(null);
  const show = phase === "play" && !xr && mode === "desktop";
  useEffect(() => {
    if (!show) return;
    const c = cv.current!;
    const ctx = c.getContext("2d")!;
    const S = 150, k = 4.7, cx = S / 2;
    c.width = S * 2;
    c.height = S * 2;
    ctx.scale(2, 2);
    let raf = 0;
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const st = useApp.getState();
      const aimed = st.aimed;
      ctx.clearRect(0, 0, S, S);
      ctx.strokeStyle = "rgba(240,194,122,0.55)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cx, 14.5 * k * 0.5 + 2, 0, 7);
      ctx.stroke();
      ctx.strokeStyle = "rgba(240,194,122,0.18)";
      ctx.beginPath();
      ctx.arc(cx, cx, 3.3 * k * 0.5, 0, 7);
      ctx.stroke();
      const sc = k * 0.5;
      ITEMS.forEach((it) => {
        const [x, z] = itemPos(it);
        const px = cx + x * sc, pz = cx + z * sc;
        const a = aimed === it.id;
        const rad = it.kind === "tome" ? (a ? 3 : 1.8) : it.kind === "section" ? (a ? 6 : 4.5) : a ? 4.5 : 3;
        ctx.fillStyle = it.color;
        ctx.shadowColor = it.color;
        ctx.shadowBlur = a ? 14 : it.kind === "tome" ? 0 : 6;
        ctx.beginPath();
        ctx.arc(px, pz, rad, 0, 7);
        ctx.fill();
        ctx.shadowBlur = 0;
        if (st.visited.includes(it.id)) {
          ctx.strokeStyle = "rgba(255,255,255,0.85)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(px, pz, rad + 2.2, 0, 7);
          ctx.stroke();
        }
      });
      const px = cx + input.x * sc, pz = cx + input.z * sc;
      const ang = Math.atan2(-Math.cos(input.yaw), -Math.sin(input.yaw));
      ctx.save();
      ctx.translate(px, pz);
      ctx.rotate(ang);
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 34);
      g.addColorStop(0, "rgba(255,255,255,0.35)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 34, -0.62, 0.62);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.moveTo(7, 0);
      ctx.lineTo(-4.5, -4.5);
      ctx.lineTo(-2.5, 0);
      ctx.lineTo(-4.5, 4.5);
      ctx.fill();
      ctx.restore();
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [show]);
  if (!show) return null;
  return (
    <div className="glass pointer-events-none fixed bottom-4 right-4 z-10 hidden rounded-full p-1 sm:block">
      <canvas ref={cv} style={{ width: 150, height: 150 }} className="rounded-full bg-[#1d211f]/70" />
    </div>
  );
}

function Joystick() {
  const phase = useApp((s) => s.phase);
  const xr = useApp((s) => s.xr);
  const mode = useApp((s) => s.mode);
  const opened = useApp((s) => s.opened);
  const sitemap = useApp((s) => s.sitemap);
  const paused = useApp((s) => s.paused);
  const tour = useApp((s) => s.tour);
  const knob = useRef<HTMLDivElement>(null);
  const id = useRef(-1);
  const active = coarse && phase === "play" && !xr && mode === "desktop"
    && !opened && !sitemap && !paused && tour === null;
  // Hiding the control does not unmount the React component. Clear movement on
  // every transition to an inactive state, not only when the pointer is released.
  useEffect(() => {
    if (!active) {
      id.current = -1;
      input.joy.x = input.joy.y = 0;
      if (knob.current) knob.current.style.transform = "translate(0,0)";
    }
  }, [active]);
  useEffect(() => () => { input.joy.x = input.joy.y = 0; }, []);
  if (!active) return null;
  const upd = (e: React.PointerEvent) => {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    let dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    let dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    const l = Math.hypot(dx, dy);
    if (l > 1) {
      dx /= l;
      dy /= l;
    }
    input.joy.x = dx;
    input.joy.y = dy;
    if (knob.current) knob.current.style.transform = `translate(${dx * 38}px, ${dy * 38}px)`;
  };
  const end = () => {
    id.current = -1;
    input.joy.x = input.joy.y = 0;
    if (knob.current) knob.current.style.transform = "translate(0,0)";
  };
  return (
    <div
      data-gb-joystick
      role="group"
      aria-label="Виртуальный джойстик движения"
      className="glass pointer-events-auto fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] left-4 z-10 grid h-32 w-32 touch-none place-items-center rounded-full"
      onPointerDown={(e) => {
        if (id.current !== -1) return;
        id.current = e.pointerId;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        upd(e);
      }}
      onPointerMove={(e) => id.current === e.pointerId && upd(e)}
      onPointerUp={end}
      onPointerCancel={end}
      onLostPointerCapture={end}
    >
      <div ref={knob} className="h-14 w-14 rounded-full bg-gradient-to-b from-[#e8cfaa] to-[#c29b6d] shadow-[0_0_24px_rgba(240,194,122,0.6)]" />
    </div>
  );
}

function TopBar({ onProgress, onCabinet }: { onProgress: () => void; onCabinet: () => void }) {
  const phase = useApp((s) => s.phase);
  const xr = useApp((s) => s.xr);
  const mode = useApp((s) => s.mode);
  const sound = useApp((s) => s.sound);
  const quality = useApp((s) => s.quality);
  const sitemap = useApp((s) => s.sitemap);
  const tourOn = useApp((s) => s.tour !== null);
  const sitting = useApp((s) => s.sitting);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    if (sitemap || phase !== "play" || xr) setMoreOpen(false);
  }, [sitemap, phase, xr]);

  useEffect(() => {
    if (!moreOpen) return;
    const dismiss = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [moreOpen]);

  const action = (run: () => void) => () => {
    setMoreOpen(false);
    run();
  };

  if (phase !== "play" || xr) return null;
  if (mode === "cardboard")
    return (
      <div className="pointer-events-none fixed inset-x-0 top-3 z-20 flex justify-center">
        <button onClick={exitToCover} className="glass pointer-events-auto rounded-full px-4 py-2 text-xs">✕ Выйти из режима очков</button>
      </div>
    );
  return (
    <>
      {moreOpen && <div className="pointer-events-auto fixed inset-0 z-10" onClick={() => setMoreOpen(false)} aria-hidden="true" />}
      <header data-gb-toolbar className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-start justify-between gap-2 px-3 pt-[calc(0.75rem+env(safe-area-inset-top,0px))] sm:px-5 sm:pt-5">
        <div className="pointer-events-auto shrink-0">
          <Btn onClick={exitToCover} title="Вернуться на обложку">
            <Ico d={I.home} /> <span className="hidden xl:inline">Обложка</span>
          </Btn>
        </div>
        <div className="hidden items-center gap-2 xl:flex">
          <Btn onClick={() => (tourOn ? endTour() : startTour())} active={tourOn} title="Экскурсия (T)">
            <Ico d={I.tour} /> Экскурсия {!coarse && <Kbd>T</Kbd>}
          </Btn>
          <Btn onClick={onProgress} title="Уровни и достижения">Уровни</Btn>
          <Btn onClick={onCabinet} title="Личные закладки и цитаты">Моя библиотека</Btn>
          <Btn onClick={() => toggleSitemap()} active={sitemap} title="Карта сайта (M)">
            <Ico d={I.map} /> Карта {!coarse && <Kbd>M</Kbd>}
          </Btn>
          <Btn onClick={toggleSit} active={sitting} title="Присесть (C)">{sitting ? "Встать" : "Сесть"}</Btn>
          <Btn onClick={toggleSound} title="Звук"><Ico d={sound ? I.soundOn : I.soundOff} /></Btn>
          <Btn onClick={toggleQuality} title="Качество графики"><Ico d={I.gauge} />{quality === "high" ? "Ультра" : "Лёгкая"}</Btn>
          <Btn onClick={toggleFullscreen} title="Полный экран"><Ico d={I.full} /></Btn>
          <Btn onClick={() => togglePhoto(true)} title="Фото-режим (H)"><Ico d={I.cam} /></Btn>
        </div>
        <div className="pointer-events-auto flex min-w-0 items-center justify-end gap-1.5 xl:hidden">
          <Btn onClick={onCabinet} title="Личные закладки и цитаты">Кабинет</Btn>
          <Btn onClick={() => toggleSitemap()} active={sitemap} title="Карта сайта"><Ico d={I.map} /></Btn>
          <button
            type="button"
            onClick={() => setMoreOpen((open) => !open)}
            aria-label="Дополнительные действия"
            aria-controls="gb-library-more"
            aria-expanded={moreOpen}
            className="glass pointer-events-auto flex h-10 shrink-0 items-center rounded-full px-3 text-[13px] font-medium text-[#f5f1e7] hover:border-[#d8b88d]"
          >Ещё</button>
        </div>
      </header>
      {moreOpen && (
        <nav
          id="gb-library-more"
          aria-label="Дополнительные действия"
          className="glass pointer-events-auto fixed right-3 top-[calc(4rem+env(safe-area-inset-top,0px))] z-20 grid max-h-[min(65dvh,420px)] w-[min(19rem,calc(100vw-1.5rem))] grid-cols-2 gap-2 overflow-y-auto rounded-2xl p-3 sm:right-5"
        >
          <button onClick={action(() => (tourOn ? endTour() : startTour()))} className="min-h-11 rounded-xl border border-white/20 px-2 text-sm">{tourOn ? "Завершить экскурсию" : "Экскурсия"}</button>
          <button onClick={action(onProgress)} className="min-h-11 rounded-xl border border-white/20 px-2 text-sm">Уровни</button>
          <button onClick={action(toggleSit)} className="min-h-11 rounded-xl border border-white/20 px-2 text-sm">{sitting ? "Встать" : "Сесть"}</button>
          <button onClick={action(toggleSound)} className="min-h-11 rounded-xl border border-white/20 px-2 text-sm">{sound ? "Выключить звук" : "Включить звук"}</button>
          <button onClick={action(toggleQuality)} className="min-h-11 rounded-xl border border-white/20 px-2 text-sm">Графика: {quality === "high" ? "ультра" : "лёгкая"}</button>
          <button onClick={action(toggleFullscreen)} className="min-h-11 rounded-xl border border-white/20 px-2 text-sm">Полный экран</button>
          <button onClick={action(() => togglePhoto(true))} className="col-span-2 min-h-11 rounded-xl border border-white/20 px-2 text-sm">Фото-режим</button>
        </nav>
      )}
    </>
  );
}

function HelpHint() {
  const phase = useApp((s) => s.phase);
  const xr = useApp((s) => s.xr);
  const mode = useApp((s) => s.mode);
  const tour = useApp((s) => s.tour);
  const [on, setOn] = useState(true);
  useEffect(() => {
    if (phase === "play") {
      setOn(true);
      const t = setTimeout(() => setOn(false), 9000);
      return () => clearTimeout(t);
    }
  }, [phase]);
  const aimed = useApp((s) => s.aimed);
  if (phase !== "play" || xr || !on || tour !== null || aimed) return null;
  return (
    <div data-gb-help className={`pointer-events-none fixed left-1/2 z-10 w-full max-w-md -translate-x-1/2 px-4 text-center ${coarse && mode !== "cardboard" ? "bottom-[calc(11rem+env(safe-area-inset-bottom,0px))]" : "bottom-28 sm:bottom-24"}`}>
      <div className="glass fade-up rounded-full px-5 py-2 text-xs text-[#e0dcd1]">
        {mode === "cardboard"
          ? "Поверните телефон и вставьте в очки · удерживайте экран, чтобы идти · задержите взгляд — откроется"
          : coarse
          ? "Стик — идти · перетаскивание — смотреть · касание книги открывает её"
          : "Клик по полу — идти · клик по книге — открыть · T — экскурсия · C — присесть"}
      </div>
    </div>
  );
}

/* ─────────── Карта сайта ─────────── */
function Row({ it }: { it: Item }) {
  const seen = useApp((s) => s.visited.includes(it.id));
  return (
    <div className="group flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] p-3 transition hover:border-white/25 hover:bg-white/[0.08] sm:gap-3">
      <button onClick={() => flyTo(it.id)} className="flex min-h-11 min-w-0 flex-1 items-center gap-2 text-left focus-visible:rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8b88d] sm:gap-3" title="Подойти в 3D">
        <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-semibold text-[#242824]" style={{ background: it.color, boxShadow: `0 0 18px ${it.color}77` }}>
          {it.n}
          {seen && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border border-[#242824] bg-white" title="Уже открывали" />}
        </span>
        <span className="min-w-0">
          <span className="line-clamp-2 break-words font-display text-lg font-semibold leading-tight">{it.title}</span>
          <span className="line-clamp-2 break-words text-xs leading-snug text-[#c9c6bc]">{it.kind === "section" ? it.desc : it.label}</span>
        </span>
      </button>
      <button onClick={() => flyTo(it.id)} className="hidden rounded-full border border-[#d8b88d]/50 px-3 py-1.5 text-[11px] font-medium text-[#d8b88d] transition hover:bg-[#d8b88d] hover:text-[#24231f] sm:block">
        Подойти
      </button>
      <button onClick={() => shareStation(it.id)} aria-label={`Скопировать ссылку: ${it.title}`} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[#ddd7c9] transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8b88d]" title="Ссылка на это место">
        <Ico d={I.link} size={15} />
      </button>
      <a href={BASE + it.href} target="_blank" rel="noreferrer" aria-label={`Открыть на сайте: ${it.title}`} className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-[#ddd7c9] transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8b88d]" title="Открыть на сайте">
        <Ico d={I.ext} size={15} />
      </a>
    </div>
  );
}

function SitemapPanel() {
  const open = useApp((s) => s.sitemap);
  const phase = useApp((s) => s.phase);
  const visited = useApp((s) => s.visited);
  const [q, setQ] = useState("");
  const panelRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const root = document.getElementById("root");
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const wasInert = root?.inert ?? false;

    // The dialog is portaled to document.body, not a child of #root.
    // Inert prevents both background keyboard focus and AT traversal.
    if (root) root.inert = true;
    searchRef.current?.focus({ preventScroll: true });
    return () => {
      if (root) root.inert = wasInert;
      if (trigger?.isConnected && trigger !== document.body) {
        trigger.focus({ preventScroll: true });
      } else {
        // Touch Safari/WebKit does not focus buttons on tap. Restore to the
        // logical opener even when activeElement was BODY before the dialog.
        const selector = phase === "intro"
          ? '[data-gb-intro] button[title="Карта сайта"]'
          : window.matchMedia("(min-width: 1280px)").matches
            ? '[data-gb-toolbar] button[title="Карта сайта (M)"]'
            : '[data-gb-toolbar] button[title="Карта сайта"]';
        document.querySelector<HTMLElement>(selector)?.focus({ preventScroll: true });
      }
    };
  }, [open, phase]);

  const onDialogKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      toggleSitemap(false);
      return;
    }
    if (event.key !== "Tab") return;
    const nodes = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(
      'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    ) ?? []).filter((node) => node.getClientRects().length > 0 && !node.inert);
    if (!nodes.length) {
      event.preventDefault();
      return;
    }
    // WebKit desktop may skip button elements in native Tab navigation,
    // depending on Full Keyboard Access. Explicitly advance within the
    // actual visible controls so focus never leaves the modal in that mode.
    const index = nodes.indexOf(document.activeElement as HTMLElement);
    const nextIndex = event.shiftKey
      ? (index <= 0 ? nodes.length - 1 : index - 1)
      : (index < 0 || index === nodes.length - 1 ? 0 : index + 1);
    event.preventDefault();
    nodes[nextIndex].focus();
  };
  if (!open) return null;
  const query = q.trim().toLowerCase();
  const match = (it: Item) => !query || (it.title + " " + it.desc + " " + it.label + " " + it.tags.join(" ") + " " + (it.spine || "")).toLowerCase().includes(query);
  const sections = ITEMS.filter((i) => i.kind === "section" && match(i));
  const cards = ITEMS.filter((i) => (i.kind === "card" || i.kind === "lectern") && match(i));
  const tomes = ITEMS.filter((i) => i.kind === "tome" && match(i));
  const empty = sections.length + cards.length + tomes.length === 0;
  return createPortal(
    <div data-gb-sitemap-backdrop className="fixed inset-0 z-30 flex justify-end bg-black/30 backdrop-blur-[2px]" onClick={() => toggleSitemap(false)}>
      <aside
        data-gb-sitemap-dialog
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gb-sitemap-title"
        onKeyDown={onDialogKeyDown}
        onClick={(e) => e.stopPropagation()}
        className="scroll-thin map-enter flex h-full w-full max-w-md flex-col overflow-y-auto overscroll-contain border-l border-[#d8b88d]/25 bg-[#19211d] p-5 text-[#f5f1e7] shadow-2xl sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#d8b88d]">Навигация</div>
            <h2 id="gb-sitemap-title" className="font-display text-4xl font-semibold leading-none">Карта сайта</h2>
            <p className="mt-2 text-xs text-[#bcb5aa]">
              {phase === "play" ? "Выберите станцию — вы окажетесь рядом с ней в зале." : "Все материалы библиотеки. «Подойти» откроет зал и подведёт к нужному месту."}{" "}
              Открыто {visited.length} из {ITEMS.length}.
            </p>
          </div>
          <button type="button" aria-label="Закрыть карту сайта" onClick={() => toggleSitemap(false)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 text-[#e0dcd1] hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8b88d]">
            <Ico d={I.x} />
          </button>
        </div>

        <label htmlFor="gb-sitemap-search" className="mb-2 text-xs text-[#d8b88d]">Поиск по карте сайта</label>
        <input
          id="gb-sitemap-search"
          ref={searchRef}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Найти: Гилл, сердце, карты…"
          className="mb-4 w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-[#f5f1e7] outline-none placeholder:text-[#aaa397] focus:border-[#d8b88d]/60"
        />

        <a href={BASE} target="_blank" rel="noreferrer" className="mb-5 flex items-center justify-between rounded-2xl border border-[#d8b88d]/30 bg-[#d8b88d]/10 px-4 py-3 text-sm text-[#d8b88d] hover:bg-[#d8b88d]/20">
          <span>Главная · поиск по материалам</span>
          <Ico d={I.ext} size={15} />
        </a>

        {empty && <p className="mb-6 text-sm text-[#bcb5aa]">В зале такого нет. Попробуйте другое слово или откройте поиск на сайте.</p>}

        {sections.length > 0 && <h3 className="mb-2 text-[11px] uppercase tracking-[0.25em] text-[#bcb5aa]">Пять направлений</h3>}
        <div className="mb-6 flex flex-col gap-2">
          {sections.map((it) => (
            <Row key={it.id} it={it} />
          ))}
        </div>
        {cards.length > 0 && <h3 className="mb-2 text-[11px] uppercase tracking-[0.25em] text-[#bcb5aa]">Редакторский выбор и о проекте</h3>}
        <div className="mb-6 flex flex-col gap-2">
          {cards.map((it) => (
            <Row key={it.id} it={it} />
          ))}
        </div>
        {tomes.length > 0 && <h3 className="mb-2 text-[11px] uppercase tracking-[0.25em] text-[#bcb5aa]">Колоннада</h3>}
        <div className="flex flex-col gap-2 pb-4">
          {tomes.map((it) => (
            <Row key={it.id} it={it} />
          ))}
        </div>
        <div className="mt-auto pt-4 text-center font-display text-sm italic text-[#d8b88d]/70">Soli Deo Gloria</div>
      </aside>
    </div>,
    document.body
  );
}

/* ─────────── Детали материала ─────────── */
function Detail() {
  const opened = useApp((s) => s.opened);
  const xr = useApp((s) => s.xr);
  if (!opened || xr) return null;
  const it = byId(opened);
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => closeItem(true)}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass fade-up scroll-thin relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl"
        style={{ borderColor: it.color + "88", animationDuration: "0.5s" }}
      >
        <button
          onClick={() => {
            closeItem(false);
            toggleSitemap(false);
            flyTo(it.id);
          }}
          className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full border border-white/25 bg-black/50 px-3 py-1.5 text-xs text-[#f5f1e7] backdrop-blur transition hover:bg-black/70"
          title="Подойти к этому месту в зале"
        >
          <Ico d={I.walk} size={14} /> Подойти в зале
        </button>
        {it.image && (
          <div className="relative h-52 w-full overflow-hidden sm:h-64" style={{ background: `linear-gradient(160deg, ${it.color}44, #222926)` }}>
            <img
              src={it.image}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => ((e.currentTarget.parentElement as HTMLElement).style.display = "none")}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#222926] via-transparent to-transparent" />
          </div>
        )}
        <div className="p-6 sm:p-8">
          <div className="mb-2 text-[11px] uppercase tracking-[0.3em]" style={{ color: it.color }}>{it.label}</div>
          <h2 className="font-display text-4xl font-semibold leading-[1.02] sm:text-5xl">{it.title}</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-[#e0dcd1]">{it.desc}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {it.tags.map((t) => (
              <span key={t} className="rounded-full border px-3 py-1 text-xs" style={{ borderColor: it.color + "66", color: it.color }}>{t}</span>
            ))}
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={BASE + it.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full bg-gradient-to-b from-[#e8cfaa] to-[#c29b6d] px-6 py-3 text-sm font-semibold text-[#24231f] shadow-[0_0_30px_rgba(240,194,122,0.35)] transition hover:scale-[1.03]"
            >
              Открыть на сайте <Ico d={I.ext} size={16} />
            </a>
            <button onClick={() => closeItem(true)} className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-[#f5f1e7] hover:bg-white/10">
              Вернуться в зал
            </button>
            <button
              onClick={() => shareStation(it.id)}
              className="flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-[#c3c0b8] hover:text-white"
              title="Скопировать ссылку на это место"
            >
              <Ico d={I.link} size={16} /> Ссылка
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pause() {
  const paused = useApp((s) => s.paused);
  const phase = useApp((s) => s.phase);
  const opened = useApp((s) => s.opened);
  const sitemap = useApp((s) => s.sitemap);
  if (!paused || phase !== "play" || opened || sitemap) return null;
  return (
    <div
      className="fixed inset-0 z-20 flex cursor-pointer items-center justify-center bg-[#181c1a]/55 backdrop-blur-sm"
      onClick={() => {
        set({ paused: false });
        relock();
      }}
    >
      <div className="glass fade-up rounded-3xl px-10 py-8 text-center">
        <div className="gold-text font-display text-4xl font-semibold">Пауза</div>
        <div className="mt-2 text-sm text-[#e0dcd1]">Нажмите, чтобы продолжить прогулку</div>
        <label className="mt-5 flex items-center justify-center gap-3 text-xs text-[#c3c0b8]" onClick={(e) => e.stopPropagation()}>
          Мышь
          <input
            type="range"
            min={0.4}
            max={1.8}
            step={0.05}
            defaultValue={useApp.getState().sens}
            onChange={(e) => setSens(Number(e.target.value))}
            className="accent-[#d8b88d]"
          />
        </label>
        <div className="mt-4 flex justify-center gap-5 text-xs text-[#c3c0b8]">
          <span className="flex items-center gap-1"><Kbd>W</Kbd><Kbd>A</Kbd><Kbd>S</Kbd><Kbd>D</Kbd></span>
          <span className="flex items-center gap-1"><Kbd>E</Kbd> открыть</span>
          <span className="flex items-center gap-1"><Kbd>T</Kbd> экскурсия</span>
          <span className="flex items-center gap-1"><Kbd>C</Kbd> сесть</span>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Btn onClick={startTour}><Ico d={I.tour} /> Экскурсия</Btn>
          <Btn onClick={() => toggleSitemap(true)}><Ico d={I.map} /> Карта сайта</Btn>
          <Btn onClick={exitToCover}><Ico d={I.home} /> Обложка</Btn>
        </div>
      </div>
    </div>
  );
}

function Compass() {
  const phase = useApp((s) => s.phase);
  const xr = useApp((s) => s.xr);
  const mode = useApp((s) => s.mode);
  const tour = useApp((s) => s.tour);
  const [label, setLabel] = useState("");
  useEffect(() => {
    if (phase !== "play" || xr || mode === "cardboard") return;
    const id = window.setInterval(() => {
      const fx = -Math.sin(input.yaw);
      const fz = -Math.cos(input.yaw);
      let best = "";
      let bestD = 0.72;
      for (const it of ITEMS) {
        if (it.kind === "tome") continue;
        const [x, z] = itemPos(it);
        const dx = x - input.x;
        const dz = z - input.z;
        const d = Math.hypot(dx, dz) || 1;
        const dot = (dx / d) * fx + (dz / d) * fz;
        if (dot > bestD) {
          bestD = dot;
          best = it.kind === "section" ? it.title : it.spine || it.title;
        }
      }
      setLabel(best);
    }, 140);
    return () => window.clearInterval(id);
  }, [phase, xr, mode]);
  if (phase !== "play" || xr || mode === "cardboard" || tour !== null || !label) return null;
  return (
    <div className="pointer-events-none fixed left-1/2 top-[74px] z-10 -translate-x-1/2 sm:top-[86px]">
      <div className="rounded-full border border-[#d8b88d]/25 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[#d8b88d]/90 backdrop-blur-sm">
        {label}
      </div>
    </div>
  );
}

function TourCard() {
  const step = useApp((s) => s.tour);
  const opened = useApp((s) => s.opened);
  if (step === null || opened) return null;
  const t = TOUR[step];
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-20 flex justify-center px-3 sm:bottom-6">
      <div className="glass fade-up pointer-events-auto w-full max-w-xl rounded-3xl p-4 sm:p-5" style={{ animationDuration: "0.4s" }}>
        <div className="mb-1 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.28em] text-[#d8b88d]">
          <span>{t.kicker}</span>
          <span>
            {step + 1} / {TOUR.length}
          </span>
        </div>
        <p className="font-display text-lg leading-snug text-[#f5f1e7] sm:text-xl">{t.text}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => tourStep(-1)} disabled={step === 0} className="rounded-full border border-white/20 px-4 py-2 text-sm text-[#f5f1e7] disabled:opacity-30">
            Назад
          </button>
          <button onClick={() => tourStep(1)} className="rounded-full bg-[#d8b88d] px-5 py-2 text-sm font-semibold text-[#24231f]">
            {step === TOUR.length - 1 ? "Закончить" : "Дальше"}
          </button>
          <button onClick={endTour} className="rounded-full px-3 py-2 text-sm text-[#c3c0b8] hover:text-white">
            Выйти
          </button>
        </div>
      </div>
    </div>
  );
}

function PhotoMode() {
  const photo = useApp((s) => s.photo);
  const [hint, setHint] = useState(true);
  useEffect(() => {
    if (!photo) return;
    setHint(true);
    const t = setTimeout(() => setHint(false), 3500);
    return () => clearTimeout(t);
  }, [photo]);
  if (!photo) return null;
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-40 ring-1 ring-inset ring-white/10" />
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
        <button
          onClick={() => togglePhoto(false)}
          className={`glass pointer-events-auto flex items-center gap-2 rounded-full px-5 py-2.5 text-sm text-[#f5f1e7] transition-opacity duration-500 ${hint ? "opacity-100" : "opacity-35 hover:opacity-100"}`}
        >
          <Ico d={I.cam} size={16} /> Фото-режим · выйти (H)
        </button>
      </div>
    </>
  );
}

function Toast() {
  const toast = useApp((s) => s.toast);
  if (!toast) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 top-16 z-40 flex justify-center px-4">
      <div className="glass fade-up flex max-w-md items-center gap-3 rounded-2xl px-5 py-3 text-sm text-[#f5f1e7]" style={{ animationDuration: "0.3s" }}>
        <button
          onClick={toggleQuality}
          className="shrink-0 rounded-full bg-[#d8b88d] px-3 py-1 text-xs font-semibold text-[#24231f]"
        >
          Вернуть
        </button>
        <span>{toast.replace("Вернуть можно в меню сверху.", "")}</span>
      </div>
    </div>
  );
}

function SitNote() {
  const sitting = useApp((s) => s.sitting);
  const tour = useApp((s) => s.tour);
  const opened = useApp((s) => s.opened);
  if (!sitting || tour !== null || opened) return null;
  return (
    <div className={`pointer-events-none fixed inset-x-0 z-10 flex justify-center px-4 ${coarse ? "bottom-[calc(11rem+env(safe-area-inset-bottom,0px))]" : "bottom-6"}`}>
      <button onClick={toggleSit} className="glass pointer-events-auto rounded-full px-5 py-2 text-sm text-[#f5f1e7]">
        Вы сидите · встать
      </button>
    </div>
  );
}

function Fatal({ text, onCabinet }: { text: string; onCabinet: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#181c1a] p-6">
      <div className="glass max-w-lg rounded-3xl p-7 text-center">
        <div className="gold-text font-display text-3xl font-semibold">Зал закрыт на ремонт</div>
        <p className="mt-3 text-sm leading-relaxed text-[#e0dcd1]">{text}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={onCabinet} className="rounded-full border border-[#e8cfaa] px-5 py-2.5 text-sm font-semibold text-[#e8cfaa]">Моя библиотека · без 3D</button>
          <button onClick={() => location.reload()} className="rounded-full bg-gradient-to-b from-[#e8cfaa] to-[#c29b6d] px-5 py-2.5 text-sm font-semibold text-[#24231f]">
            Обновить страницу
          </button>
          <a href={BASE} target="_blank" rel="noreferrer" className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm text-[#f5f1e7] hover:bg-white/10">
            Обычная библиотека <Ico d={I.ext} size={15} />
          </a>
        </div>
      </div>
    </div>
  );
}

function GlLost() {
  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-[#181c1a]/85 backdrop-blur-sm">
      <div className="glass rounded-3xl px-8 py-7 text-center">
        <div className="mx-auto mb-5 h-14 w-14 animate-spin rounded-full border border-[#d8b88d]/30 border-t-[#d8b88d]" style={{ animationDuration: "1.6s" }} />
        <div className="font-display text-2xl">Перезапускаю зал…</div>
        <p className="mt-2 max-w-sm text-sm text-[#c3c0b8]">Видеоадаптер на мгновение отключился. Обычно всё возвращается само за пару секунд.</p>
      </div>
    </div>
  );
}

export default function Overlay({ fontsReady }: { fontsReady: boolean }) {
  const [progressOpen, setProgressOpen] = useState(() => new URLSearchParams(location.search).get("panel") === "progress");
  const [cabinetOpen, setCabinetOpen] = useState(() => new URLSearchParams(location.search).get("panel") === "cabinet");
  const progressTrigger = useRef<HTMLElement | null>(null);
  const openProgress = useCallback(() => { progressTrigger.current = document.activeElement as HTMLElement; exitLock(); input.keys.clear(); setCabinetOpen(false); setProgressOpen(true); }, []);
  const openCabinet = useCallback(() => { progressTrigger.current = document.activeElement as HTMLElement; exitLock(); input.keys.clear(); setProgressOpen(false); setCabinetOpen(true); }, []);
  const closeProgress = useCallback(() => {
    setProgressOpen(false); setCabinetOpen(false);
    window.setTimeout(() => {
      progressTrigger.current?.focus?.();
      if (useApp.getState().phase === "play" && !useApp.getState().paused) relock();
    }, 0);
  }, []);
  const photo = useApp((s) => s.photo);
  const glLost = useApp((s) => s.glLost);
  const fatal = useApp((s) => s.fatal);
  if (fatal) return <><Fatal text={fatal} onCabinet={openCabinet}/>{cabinetOpen && <CabinetPanel onClose={closeProgress} />}</>;
  const body = photo ? (
      <>
        <PhotoMode />
        <Toast />
        <Loader fontsReady={fontsReady} />
      </>
    ) : (
    <>
      <Crosshair />
      <Compass />
      <AimTooltip />
      <Minimap />
      <Joystick />
      <TopBar onProgress={openProgress} onCabinet={openCabinet} />
      <HelpHint />
      <Intro onProgress={openProgress} onCabinet={openCabinet} />
      <SitemapPanel />
      <Detail />
      <Pause />
      <TourCard />
      <SitNote />
      <Toast />
      <Loader fontsReady={fontsReady} />
    </>
  );
  return (
    <>
      {body}
      {progressOpen && <ProgressPanel onClose={closeProgress} />}
      {cabinetOpen && <CabinetPanel onClose={closeProgress} />}
      {glLost && <GlLost />}
    </>
  );
}
