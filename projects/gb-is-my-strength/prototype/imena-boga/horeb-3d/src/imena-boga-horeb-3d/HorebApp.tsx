import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EXHIBITS, ZONES, EX_3_5_RU, EX_3_5_SOURCE, CATEGORY_RU } from './data/exhibits';
import { validateExhibits } from './data/validate';
import { Modal } from './ui/ResearchDrawer';
import { AccessibleReader, ExhibitCard, SourcesAndLimits, AboutExhibition, Original } from './ui/AccessibleReader';
import { SettingsPanel, MiniMap, Joystick, type UiSettings } from './ui/Controls';
import { SceneMoment, HERO_MOMENTS } from './ui/SceneMoment';
import { STUDY_BOOKMARKS_KEY, normalizeStudyBookmarks, toggleStudyBookmark } from './data/studyBookmarks';
import type { World, WorldState } from './engine/World';
import { R_INNER } from './engine/nav';

type Screen = 'intro' | 'world' | 'reader';
type Dialog = null | { kind: 'exhibit'; id: string } | { kind: 'settings' } | { kind: 'map' } | { kind: 'sources' } | { kind: 'about' } | { kind: 'menu' } | { kind: 'bookmarks' };
const LS_SETTINGS = 'imena-horeb.settings.v1';
const LS_PROGRESS = 'imena-horeb.progress.v1';

const EDITORIAL_ERRORS = validateExhibits(EXHIBITS); // fail-closed: при ошибках 3D-метки не показываются

function readStored(k: string): unknown {
  try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; }
}
function readSettings(): UiSettings {
  const raw = readStored(LS_SETTINGS);
  const s = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {};
  return {
    quality: s.quality === 'low' || s.quality === 'high' ? s.quality : 'auto',
    sound: typeof s.sound === 'boolean' ? s.sound : true,
    particles: typeof s.particles === 'boolean' ? s.particles : true,
    reducedMotion: typeof s.reducedMotion === 'boolean' ? s.reducedMotion : prefersReduced(),
    // A modestly brighter initial image for phones; never override a saved choice.
    exposure: typeof s.exposure === 'number' && Number.isFinite(s.exposure) ? Math.min(2, Math.max(0.6, s.exposure)) : (coarse() ? 1.75 : 1.5),
    showStats: s.showStats === true,
  };
}
function readProgress(): { visited: number[]; last: null | { x: number; z: number } } {
  const raw = readStored(LS_PROGRESS);
  const p = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {};
  const visited = Array.isArray(p.visited) ? p.visited.filter((id) => Number.isInteger(id) && id >= 0 && id <= 7) : [];
  const last = p.last && typeof p.last === 'object' ? p.last as Record<string, unknown> : null;
  return {
    visited: [...new Set([0, ...visited])].sort((a, b) => a - b),
    last: last && typeof last.x === 'number' && Number.isFinite(last.x) && typeof last.z === 'number' && Number.isFinite(last.z)
      ? { x: last.x, z: last.z } : null,
  };
}
function hasWebGL() { try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; } }
const coarse = () => typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;
const prefersReduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

function StudyBookmarkList({ ids, onOpen }: { ids: readonly string[]; onOpen: (id: string) => void }) {
  const selected = new Set(ids);
  const entries = EXHIBITS.filter((e) => selected.has(e.id));
  if (!entries.length) return <p className="text-parch/75 leading-relaxed">
    Пока ничего не сохранено. В 3D-прогулке откройте досье клавишей E и нажмите «Сохранить свидетельство».
  </p>;
  return <div className="space-y-2">
    <p className="text-sm text-muted mb-3">{entries.length} из {EXHIBITS.length} свидетельств · хранятся только в этом браузере</p>
    <ul className="space-y-2">
      {entries.map((e) => <li key={e.id}>
        <button className="btn block w-full text-left" onClick={() => onOpen(e.id)}>
          <span className="block font-display text-lg">{e.displayLabelRu}</span>
          <span className="block text-xs text-muted mt-1">{CATEGORY_RU[e.category]} · {e.verseReference}</span>
        </button>
      </li>)}
    </ul>
  </div>;
}

export default function HorebApp() {
  const [screen, setScreen] = useState<Screen>(() => (location.hash === '#read' ? 'reader' : 'intro'));
  const [settings, setSettings] = useState<UiSettings>(readSettings);
  const [progress, setProgress] = useState(readProgress);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [introDialog, setIntroDialog] = useState<Dialog>(null);
  const [ws, setWs] = useState<WorldState | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [finale, setFinale] = useState<'none' | 'show' | 'seen'>('none');
  const [examined, setExamined] = useState<Set<string>>(() => new Set());
  const [bookmarks, setBookmarks] = useState<string[]>(() => normalizeStudyBookmarks(readStored(STUDY_BOOKMARKS_KEY)));
  const [guideCaption, setGuideCaption] = useState<string | null>(null);
  const [webgl] = useState(hasWebGL);
  const [isTouch] = useState(coarse);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const worldRef = useRef<World | null>(null);
  // A persisted checkpoint always re-enters through World.create's
  // existing shod/outer-gate sanitization; it never bypasses the holy boundary.
  const resumePos = useRef<{ x: number; z: number } | null>(progress.last);
  const checkpointRef = useRef<{ x: number; z: number } | null>(progress.last);
  const checkpointAt = useRef(0);
  const stateRef = useRef<WorldState | null>(null);

  useEffect(() => { try { localStorage.setItem(LS_SETTINGS, JSON.stringify(settings)); } catch { /* приватный режим */ } }, [settings]);
  useEffect(() => { try { localStorage.setItem(LS_PROGRESS, JSON.stringify(progress)); } catch { /* */ } }, [progress]);
  useEffect(() => { try { localStorage.setItem(STUDY_BOOKMARKS_KEY, JSON.stringify(bookmarks)); } catch { /* private mode */ } }, [bookmarks]);

  const resolved = useMemo(() => {
    const low = settings.quality === 'low' || (settings.quality === 'auto' && (isTouch || (navigator.hardwareConcurrency || 8) <= 4 || innerWidth < 700));
    return { quality: (low ? 'low' : 'high') as 'low' | 'high', reducedMotion: settings.reducedMotion, particles: settings.particles, sound: settings.sound, exposure: settings.exposure, autoQuality: settings.quality === 'auto' };
  }, [settings, isTouch]);

  const saveCheckpoint = useCallback((pos: { x: number; z: number }) => {
    if (!Number.isFinite(pos.x) || !Number.isFinite(pos.z)) return;
    const point = { x: pos.x, z: pos.z };
    checkpointRef.current = point;
    resumePos.current = point;
    checkpointAt.current = performance.now();
    setProgress((old) => old.last &&
      Math.hypot(old.last.x - point.x, old.last.z - point.z) < 0.01
      ? old : { ...old, last: point });
  }, []);

  // ── Жизненный цикл 3D-мира (создаётся только по кнопке; уничтожается при выходе)
  useEffect(() => {
    if (screen !== 'world' || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const controller = new AbortController();
    let cancelled = false;
    let w: World | null = null;
    import('./engine/World').then(({ World }) => {
      if (cancelled) return null;
      return World.create(canvas, resolved, resumePos.current, (s) => {
        stateRef.current = s;
        setWs(s);
        const prev = checkpointRef.current;
        const moved = Math.hypot(s.x - (prev?.x ?? 0), s.z - (prev?.z ?? -2)) > 2;
        if (!s.contextLost && s.shoes !== 'removing' && moved &&
            performance.now() - checkpointAt.current > 4000)
          saveCheckpoint({ x: s.x, z: s.z });
      }, (e) => {
        if (e === 'pointerlock-denied') setToast('Захват мыши недоступен — обзор перетаскиванием.');
        if (e === 'shoes-removed') setToast('Обувь снята. Тропа к месту наблюдения открыта; к ветвям — нельзя.');
        if (e === 'auto-lowered') setToast('Разрешение снижено для плавности.');
      }, controller.signal);
    }).then((world) => {
      if (!world) return;
      if (cancelled) { world.dispose(); return; }
      w = world; worldRef.current = world;
      if (new URLSearchParams(location.search).has('e2e')) (window as unknown as { __horeb: unknown }).__horeb = { world, state: () => stateRef.current };
    }).catch((e) => { if (!cancelled && e?.name !== 'AbortError') { console.error(e); setErr('Не удалось запустить 3D-сцену на этом устройстве.'); } });
    return () => {
      cancelled = true;
      controller.abort();
      if (w) {
        resumePos.current = w.position;
        w.dispose();
      }
      if (new URLSearchParams(location.search).has('e2e')) {
        const debug = window as unknown as { __horeb?: { world: World } };
        if (debug.__horeb?.world === w) delete debug.__horeb;
      }
      stateRef.current = null;
      worldRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  useEffect(() => { worldRef.current?.applySettings(resolved); }, [resolved]);
  useEffect(() => { worldRef.current?.setInputLocked(dialog !== null); }, [dialog, ws === null]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 4200); return () => clearTimeout(t); }, [toast]);
  useEffect(() => { if (!guideCaption) return; const t = setTimeout(() => setGuideCaption(null), 7500); return () => clearTimeout(t); }, [guideCaption]);

  // посещённые зоны
  const zone = ws?.zone ?? 0;
  useEffect(() => {
    if (screen === 'world' && ws && !progress.visited.includes(ws.zone)) setProgress((p) => ({ ...p, visited: [...p.visited, ws.zone].sort() }));
  }, [zone, screen]); // eslint-disable-line react-hooks/exhaustive-deps
  // финал: тишина у границы наблюдения
  useEffect(() => {
    if (ws && ws.shoes === 'unshod' && ws.distBush < R_INNER + 1.6 && finale === 'none') setFinale('show');
  }, [ws, finale]);

  // Keyboard/touch events must use the freshest World state, not React's last
  // committed render. Rapid teleport/zone changes otherwise open a stale dossier
  // or ignore E even though the visible world already offers a new target.
  const interact = useCallback(() => {
    const w = worldRef.current;
    const prompt = stateRef.current?.prompt;
    if (!w || !prompt) return;
    if (prompt.kind === 'shoes') { w.removeShoes(); return; }
    saveCheckpoint(w.position);
    setDialog({ kind: 'exhibit', id: prompt.id });
  }, [saveCheckpoint]);

  useEffect(() => {
    if (screen !== 'world') return;
    const onKey = (e: KeyboardEvent) => {
      if (dialog || e.repeat) return;
      const tag = (document.activeElement as HTMLElement)?.tagName;
      const free = tag === 'BODY' || tag === 'CANVAS' || !tag;
      if (e.code === 'KeyE' || (e.key === 'Enter' && free)) { e.preventDefault(); interact(); }
      else if (e.code === 'KeyM') setDialog({ kind: 'map' });
      else if (e.code === 'KeyR') worldRef.current?.resetCamera();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [screen, dialog, interact]);

  const start = () => { setErr(null); setFinale('none'); setScreen('world'); };
  const leaveWorld = (next: 'intro' | 'reader') => {
    const pos = worldRef.current?.position;
    if (pos) saveCheckpoint(pos);
    setDialog(null);
    setScreen(next);
    if (next === 'intro') setWs(null);
  };
  const exitWorld = () => leaveWorld('intro');
  const resetProgress = () => {
    resumePos.current = null;
    checkpointRef.current = null;
    checkpointAt.current = performance.now();
    setProgress({ visited: [0], last: null });
  };
  const exhibit = dialog?.kind === 'exhibit' ? EXHIBITS.find((e) => e.id === dialog.id) : undefined;
  const promptEx = ws?.prompt?.kind === 'exhibit' ? EXHIBITS.find((e) => e.id === (ws.prompt as { id: string }).id) : undefined;
  const zoneInfo = ZONES[zone];
  // User-approved subdued HUD: let the bush take visual focus at close range.
  // Critical prompts and the sandal gate live outside .hud and remain opaque.
  const hudOpacity = ws && ws.zone === 7 ? Math.max(0.4, Math.min(1, (ws.distBush - 8) / 28)) : 1;

  if (screen === 'reader') return <AccessibleReader onClose={() => { history.replaceState(null, '', location.pathname); setScreen('intro'); }} />;

  if (screen === 'intro') return (
    <main className="intro relative min-h-screen overflow-hidden bg-ink text-parch">
      <svg className="sinai absolute inset-x-0 bottom-0 w-full h-[62vh]" viewBox="0 0 1600 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#05060b" /><stop offset="1" stopColor="#2a1a12" /></linearGradient>
          <linearGradient id="m1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2c231d" /><stop offset="1" stopColor="#0b0907" /></linearGradient>
        </defs>
        <rect width="1600" height="600" fill="url(#sky)" opacity="0.6" />
        <path d="M0 470 L120 400 L210 430 L330 330 L420 380 L520 260 L600 300 L700 170 L760 210 L820 120 L880 190 L960 160 L1040 250 L1130 220 L1230 320 L1330 290 L1450 380 L1600 340 L1600 600 L0 600Z" fill="#1a1512" opacity="0.8" />
        <path d="M0 520 L160 470 L260 500 L400 430 L520 470 L640 400 L760 450 L900 380 L1040 450 L1180 410 L1320 470 L1460 440 L1600 480 L1600 600 L0 600Z" fill="url(#m1)" />
        <circle cx="800" cy="545" r="2.2" fill="#ffb060" className="ember" />
      </svg>
      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-[12vh] sm:pt-[16vh] text-center">
        <p className="eyebrow reveal">Интерактивная экспозиция · лабораторный прототип</p>
        <h1 className="font-display text-5xl sm:text-7xl tracking-[0.12em] mt-5 reveal d1">ИМЕНА БОГА</h1>
        <p className="font-display italic text-2xl sm:text-3xl text-bronze mt-3 reveal d2">Перед Святым</p>
        <p className="mt-8 text-parch/75 leading-relaxed max-w-xl mx-auto reveal d3">
          Путь через каменные галереи к открытой земле у Хорива. География и пещерные переходы — художественная экспозиция;
          каждое письменное свидетельство указано книгой и стихом.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center reveal d3">
          {webgl ? <button className="btn btn-primary" onClick={start}>{progress.last ? 'Продолжить путешествие' : 'Начать путешествие'}</button>
            : <p role="alert" className="text-amber-300/90 text-sm max-w-sm">WebGL недоступен в этом браузере — 3D-прогулка не запустится. Вся экспозиция доступна в режиме чтения.</p>}
          <button className="btn" onClick={() => setScreen('reader')}>Режим чтения</button>
          <button className="btn" onClick={() => setIntroDialog({ kind: 'bookmarks' })}>Мои закладки ({bookmarks.length})</button>
          <button className="btn" onClick={() => setIntroDialog({ kind: 'settings' })}>Настройки доступности</button>
        </div>
        {err && <p role="alert" className="mt-6 text-amber-300">{err} <button className="link" onClick={() => setScreen('reader')}>Открыть режим чтения</button></p>}
        <div className="mt-8 flex gap-5 justify-center text-sm reveal d3">
          <button className="link" onClick={() => setIntroDialog({ kind: 'about' })}>Об экспозиции</button>
          <button className="link" onClick={() => setIntroDialog({ kind: 'sources' })}>Источники и ограничения исследования</button>
        </div>
        {progress.last && <p className="mt-3 text-sm text-parch/75 reveal d3">
          Последняя точка сохранена. При продолжении границы у куста остаются обязательными.
        </p>}
        <p className="mt-10 text-xs text-muted reveal d3">Без регистрации, cookies и трекеров. Настройки и посещённые зоны хранятся только в этом браузере.
          {(progress.visited.length > 1 || progress.last !== null) && <> <button className="link" onClick={resetProgress}>Сбросить прогресс</button></>}</p>
      </div>
      {introDialog?.kind === 'settings' && <Modal title="Настройки доступности" onClose={() => setIntroDialog(null)}><SettingsPanel s={settings} set={(p) => setSettings((s) => ({ ...s, ...p }))} /></Modal>}
      {introDialog?.kind === 'sources' && <Modal wide title="Источники и ограничения" onClose={() => setIntroDialog(null)}><SourcesAndLimits /></Modal>}
      {introDialog?.kind === 'about' && <Modal wide title="Об экспозиции" onClose={() => setIntroDialog(null)}><AboutExhibition /></Modal>}
      {introDialog?.kind === 'bookmarks' && <Modal wide title="Мои закладки Писания" onClose={() => setIntroDialog(null)}>
        <StudyBookmarkList ids={bookmarks} onOpen={(id) => setIntroDialog({ kind: 'exhibit', id })} />
      </Modal>}
      {introDialog?.kind === 'exhibit' && <Modal wide title="Сохранённое свидетельство" onClose={() => setIntroDialog({ kind: 'bookmarks' })}>
        <button className="btn mb-5" aria-pressed={bookmarks.includes(introDialog.id)} onClick={() => setBookmarks((prev) => toggleStudyBookmark(prev, introDialog.id))}>
          {bookmarks.includes(introDialog.id) ? 'Убрать из закладок' : 'Добавить в закладки'}
        </button>
        <ExhibitCard e={EXHIBITS.find((e) => e.id === introDialog.id)!} headingLevel={2} />
      </Modal>}
    </main>
  );

  // ── Прогулка
  const gateOuter = ws?.block === 'outer' && ws.shoes === 'shod';
  const gateInner = ws?.block === 'inner';
  return (
    <main className="fixed inset-0 bg-black text-parch select-none">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block outline-none" tabIndex={0} aria-label="3D-сцена. Полный текст экспозиции доступен в режиме чтения." />
      <div className="fade-in-black pointer-events-none absolute inset-0 bg-black" style={{ animationDuration: settings.reducedMotion ? '0.01s' : '3s' }} />
      {!ws && !err && <p className="absolute inset-0 grid place-items-center text-muted" role="status">Камень раскрывается…</p>}

      <div className="hud transition-opacity duration-700" style={{ opacity: hudOpacity }}>
        <div className="absolute top-3 left-3 sm:top-5 sm:left-6 max-w-[60vw] rounded-sm border border-parch/10 bg-black/65 px-3 py-2 shadow-lg backdrop-blur-sm" aria-live="polite">
          <p className="eyebrow">Зона {zone}{zone === 5 ? ' · позднейшие свидетельства' : ''}</p>
          <p className="font-display text-xl sm:text-2xl leading-tight">{zoneInfo.title}</p>
          {ws && ws.zone >= 6 && <p className="text-xs text-muted mt-1">{ws.shoes === 'shod' ? 'В обуви' : ws.shoes === 'removing' ? 'Снимаете обувь…' : 'Босиком'}</p>}
        </div>
        <nav className="absolute top-3 right-3 sm:top-5 sm:right-6 flex flex-wrap justify-end gap-1.5 max-w-[60vw]" aria-label="Управление экспозицией">
          {isTouch ? <button className="btn-ghost" onClick={() => setDialog({ kind: 'menu' })}>Меню</button> : <>
          <button className="btn-ghost" onClick={() => setDialog({ kind: 'map' })}>Схема</button>
          <button className="btn-ghost" onClick={() => leaveWorld('reader')}>Читать</button>
          <button className="btn-ghost" onClick={() => setDialog({ kind: 'bookmarks' })}>Закладки ({bookmarks.length})</button>
          <button className="btn-ghost" onClick={() => setDialog({ kind: 'sources' })}>Источники</button>
          <button className="btn-ghost" onClick={() => setDialog({ kind: 'settings' })}>Настройки</button>
          <button className="btn-ghost" onClick={exitWorld}>Выйти</button>
          </>}
        </nav>
        {settings.showStats && ws && <p className="absolute top-20 right-4 text-[11px] font-mono text-muted text-right">{ws.fps} fps · {ws.calls} calls · {(ws.tris / 1000).toFixed(0)}k tris · dpr {ws.pixelRatio}<br />x {ws.x.toFixed(1)} z {ws.z.toFixed(1)} · куст {ws.distBush.toFixed(1)} м · {ws.shoes}</p>}
      </div>

      {ws && !ws.locked && !isTouch && !dialog && !ws.block && ws.zone < 7 && (
        <p className="absolute bottom-24 inset-x-0 px-3 text-center pointer-events-none">
          <span className="inline-block max-w-[95vw] rounded-sm border border-parch/15 bg-black/70 px-4 py-2 text-sm leading-snug text-parch/90 shadow-lg backdrop-blur-sm">
            Кликните по сцене, чтобы осмотреться мышью · W A S D — шаг · Esc — отпустить
          </span>
        </p>
      )}
      {ws?.locked && <div className="absolute left-1/2 top-1/2 w-1 h-1 -ml-0.5 -mt-0.5 rounded-full bg-parch/60 pointer-events-none" />}

      {/* Святой порог */}
      {gateOuter && !dialog && (
        <section role="alert" className={`gate absolute left-1/2 -translate-x-1/2 ${isTouch ? 'top-24' : 'bottom-4 sm:bottom-6'} w-[min(94vw,36rem)] text-center p-4`}>
          <p className="font-display text-lg sm:text-xl italic leading-snug">«{EX_3_5_RU}»</p>
          <p className="text-xs text-muted mt-2">{EX_3_5_SOURCE}</p>
          <button className="btn btn-primary mt-4" onClick={() => worldRef.current?.removeShoes()}>Снять обувь <span className="opacity-60 text-xs ml-1">E</span></button>
        </section>
      )}
      {ws?.shoes === 'removing' && <p role="status" className="absolute inset-x-0 bottom-36 text-center font-display text-2xl italic text-parch/90">Обувь снимается…</p>}
      {gateInner && !dialog && <p role="status" className="absolute inset-x-0 bottom-32 text-center text-parch/85 px-6">Здесь — граница наблюдения. Ближе подходить нельзя.</p>}

      {/* Подсказка взаимодействия — кликабельна */}
      {ws?.prompt && !dialog && ws.shoes !== 'removing' && !(ws.prompt.kind === 'shoes' && gateOuter) && (
        <button className="prompt absolute left-1/2 -translate-x-1/2 bottom-8 sm:bottom-10" onClick={interact}>
          <span className="kbd">E</span>
          {ws.prompt.kind === 'shoes' ? 'Снять обувь' : <>Контекст и источники: <b className="font-normal text-parch">{promptEx?.displayLabelRu}</b> · {promptEx?.verseReference}</>}
        </button>
      )}

      {isTouch && ws && !dialog && <>
        <Joystick onMove={(x, y) => worldRef.current?.setMoveInput(x, y)} />
        <button className="fixed right-6 bottom-8 z-20 w-20 h-20 rounded-full bg-amber-900/50 border border-parch/40 text-sm" onClick={interact} disabled={!ws.prompt}>Действие</button>
      </>}

      {ws?.contextLost && (
        <div role="alert" className="absolute inset-0 grid place-items-center bg-black/80 text-center p-6">
          <div><p className="font-display text-2xl">Графический контекст потерян</p><p className="text-muted mt-2">Ожидаем восстановления…</p>
            <div className="mt-4 flex gap-2 justify-center"><button className="btn" onClick={() => { exitWorld(); setTimeout(start, 50); }}>Перезапустить сцену</button><button className="btn" onClick={() => leaveWorld('reader')}>Режим чтения</button></div></div>
        </div>
      )}
      {err && <div role="alert" className="absolute inset-0 grid place-items-center bg-black text-center p-6"><div><p>{err}</p><button className="btn mt-4" onClick={() => leaveWorld('reader')}>Режим чтения</button></div></div>}
      {toast && <p role="status" className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 rounded text-sm max-w-[90vw] text-center">{toast}</p>}
      {guideCaption && !dialog && <section role="status" aria-label="Текст рассказчика" className="pointer-events-none absolute top-36 left-1/2 -translate-x-1/2 w-[min(90vw,38rem)] rounded-sm border border-bronze/20 bg-black/75 px-5 py-4 text-center shadow-xl">
        <p className="eyebrow text-bronze/85">Текст будущего рассказчика · без аудиозаписи</p>
        <p className="mt-2 font-display text-lg sm:text-xl leading-snug text-parch/90">{guideCaption}</p>
      </section>}

      {finale === 'show' && !dialog && (
        <section className="absolute right-4 bottom-28 sm:right-8 sm:bottom-10 w-[min(90vw,24rem)] gate p-5" aria-label="Место наблюдения">
          <p className="font-display text-lg italic">Здесь можно остановиться и молчать.</p>
          <p className="text-sm text-parch/75 mt-2">Рядом — Исх. 3:12–15: обещание «Я буду с тобою», самоназвание <Original e={EXHIBITS.find((e) => e.id === 'ehyeh')!} /> и имя <Original e={EXHIBITS.find((e) => e.id === 'yhwh')!} /> — разные формы в разных стихах.</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <button className="btn" onClick={() => leaveWorld('reader')}>Открыть Атлас (чтение)</button>
            <button className="btn" onClick={() => { setFinale('seen'); worldRef.current?.teleportZone(1); }}>Вернуться в галереи</button>
            <button className="btn-ghost" onClick={() => setFinale('seen')}>Скрыть</button>
          </div>
        </section>
      )}

      {exhibit && <Modal wide title={`${CATEGORY_RU[exhibit.category]} · ${exhibit.verseReference}`} onClose={() => setDialog(null)}>
        <button className="btn mb-5" aria-pressed={bookmarks.includes(exhibit.id)} onClick={() => setBookmarks((prev) => toggleStudyBookmark(prev, exhibit.id))}>
          {bookmarks.includes(exhibit.id) ? 'Убрать из закладок' : 'Сохранить свидетельство'}
        </button>
        <SceneMoment key={exhibit.id} e={exhibit} examined={examined.has(exhibit.id)} canInspect={worldRef.current?.canInspectExhibit(exhibit.id) ?? false} onInspect={() => {
          if (!worldRef.current?.inspectExhibit(exhibit.id)) return;
          setExamined((old) => new Set(old).add(exhibit.id));
          setGuideCaption(HERO_MOMENTS[exhibit.id]?.cue ?? null);
          setDialog(null);
          setToast('Осмотрите освещённую надпись и предметы. Нажмите E снова, чтобы сопоставить с Писанием.');
        }} />
        <ExhibitCard e={exhibit} headingLevel={2} />
      </Modal>}
      {dialog?.kind === 'menu' && <Modal title="Управление экспозицией" onClose={() => setDialog(null)}>
        <div className="grid gap-3">
          <button className="btn" onClick={() => setDialog({ kind: 'map' })}>Схема маршрута</button>
          <button className="btn" onClick={() => setDialog({ kind: 'bookmarks' })}>Закладки Писания ({bookmarks.length})</button>
          <button className="btn" onClick={() => leaveWorld('reader')}>Читать экспозицию</button>
          <button className="btn" onClick={() => setDialog({ kind: 'sources' })}>Источники и ограничения</button>
          <button className="btn" onClick={() => setDialog({ kind: 'settings' })}>Настройки доступности</button>
          <button className="btn" onClick={exitWorld}>Выйти из прогулки</button>
        </div>
      </Modal>}
      {dialog?.kind === 'bookmarks' && <Modal wide title="Мои закладки Писания" onClose={() => setDialog(null)}>
        <StudyBookmarkList ids={bookmarks} onOpen={(id) => setDialog({ kind: 'exhibit', id })} />
      </Modal>}
      {dialog?.kind === 'settings' && (
        <Modal title="Настройки" onClose={() => setDialog(null)}>
          <SettingsPanel s={settings} set={(p) => setSettings((s) => ({ ...s, ...p }))} stats={ws ? `Измерено сейчас: ${ws.fps} fps, ${ws.calls} draw calls, ${ws.tris} треугольников, pixelRatio ${ws.pixelRatio}, геометрия: ${resolved.quality}` : undefined} />
          <div className="flex flex-wrap gap-2 mt-5">
            <button className="btn" onClick={() => { worldRef.current?.resetCamera(); setDialog(null); }}>Сбросить камеру</button>
            <button className="btn" onClick={resetProgress}>Сбросить прогресс</button>
          </div>
        </Modal>
      )}
      {dialog?.kind === 'sources' && <Modal wide title="Источники и ограничения" onClose={() => setDialog(null)}><SourcesAndLimits />{EDITORIAL_ERRORS.length > 0 && <p className="text-red-300 mt-4">Редакционные ошибки реестра: {EDITORIAL_ERRORS.join('; ')}</p>}</Modal>}
      {dialog?.kind === 'map' && ws && (
        <Modal title="Схема маршрута" onClose={() => setDialog(null)}>
          <MiniMap x={ws.x} z={ws.z} current={ws.zone} visited={new Set(progress.visited)} onGo={(z) => { worldRef.current?.teleportZone(z); setDialog(null); }} />
          <div className="flex flex-wrap gap-2 mt-4">
            <button className="btn" disabled={!progress.last} onClick={() => { if (progress.last) worldRef.current?.teleportTo(progress.last.x, progress.last.z); setDialog(null); }}>Вернуться к последней точке</button>
            <button className="btn" onClick={() => { worldRef.current?.resetCamera(); setDialog(null); }}>Сбросить камеру</button>
          </div>
        </Modal>
      )}
    </main>
  );
}
