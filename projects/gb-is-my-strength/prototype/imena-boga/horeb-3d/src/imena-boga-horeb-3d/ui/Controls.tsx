import { useEffect, useRef, useState } from 'react';
import { ZONES } from '../data/exhibits';
import { BUSH, R_OUTER, R_INNER, halfWidth, TUNNEL_END } from '../engine/nav';

export type QualityMode = 'auto' | 'low' | 'high';
export interface UiSettings { quality: QualityMode; sound: boolean; particles: boolean; reducedMotion: boolean; exposure: number; showStats: boolean }

export function SettingsPanel({ s, set, stats }: { s: UiSettings; set: (p: Partial<UiSettings>) => void; stats?: string }) {
  return (
    <form className="space-y-5 text-parch" onSubmit={(e) => e.preventDefault()}>
      <fieldset>
        <legend className="text-bronze text-xs uppercase tracking-[0.14em] mb-2">Качество графики</legend>
        <div className="flex gap-2" role="radiogroup" aria-label="Качество графики">
          {(['auto', 'low', 'high'] as QualityMode[]).map((q) => (
            <label key={q} className={`chip cursor-pointer ${s.quality === q ? 'chip-on' : ''}`}>
              <input type="radio" className="sr-only" name="q" checked={s.quality === q} onChange={() => set({ quality: q })} />
              {q === 'auto' ? 'Авто' : q === 'low' ? 'Низкое' : 'Высокое'}
            </label>
          ))}
        </div>
        <p className="text-xs text-muted mt-2">Яркость и разрешение изменяются сразу; качество геометрии и антиалиасинг применятся при следующем входе в 3D-прогулку.</p>
        <p className="text-xs text-muted mt-2">Плотность геометрии фиксируется при входе в мир; разрешение меняется сразу.</p>
      </fieldset>
      {([
        ['sound', 'Звук окружения (ветер, капли, огонь; собственный синтез, без музыки)'],
        ['particles', 'Частицы пыли и искры'],
        ['reducedMotion', 'Уменьшить движение (без наклона камеры, медленнее огонь и пыль)'],
        ['showStats', 'Показывать диагностику (FPS, draw calls)'],
      ] as [keyof UiSettings, string][]).map(([k, label]) => (
        <label key={k} className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" className="mt-1 accent-amber-600 w-4 h-4" checked={Boolean(s[k])} onChange={(e) => set({ [k]: e.target.checked } as Partial<UiSettings>)} />
          <span>{label}</span>
        </label>
      ))}
      <label className="block">
        <span className="text-bronze text-xs uppercase tracking-[0.14em]">Яркость сцены: {s.exposure.toFixed(2)}</span>
        <input type="range" min={0.6} max={2} step={0.05} value={s.exposure} onChange={(e) => set({ exposure: Number(e.target.value) })} className="w-full accent-amber-600" />
      </label>
      <div className="text-sm text-parch/80 leading-relaxed border-t border-white/10 pt-4">
        <p><b>Клавиатура:</b> W A S D / стрелки — шаг и поворот; E или Enter — открыть экспонат / снять обувь; Esc — освободить мышь, закрыть окно; M — схема; R — сбросить камеру.</p>
        <p className="mt-2"><b>Мышь:</b> клик по сцене захватывает обзор (Esc отпускает). Если захват запрещён — обзор перетаскиванием.</p>
        <p className="mt-2"><b>Сенсор:</b> левый джойстик — шаг, правая половина экрана — обзор, крупная кнопка — действие.</p>
      </div>
      {stats && <p className="text-xs text-muted font-mono">{stats}</p>}
    </form>
  );
}

// Схема маршрута: тоннель сверху вниз, открытая земля внизу
export function MiniMap({ x, z, visited, onGo, current }: { x: number; z: number; visited: Set<number>; onGo: (zone: number) => void; current: number }) {
  const W = 120, H = 420, s = 1.05;
  const toY = (zz: number) => 10 + -zz * s;
  const pts: string[] = [];
  for (let zz = 2; zz >= TUNNEL_END; zz -= 4) pts.push(`${W / 2 + halfWidth(zz) * 1.6},${toY(zz)}`);
  for (let zz = TUNNEL_END; zz <= 2; zz += 4) pts.push(`${W / 2 - halfWidth(zz) * 1.6},${toY(zz)}`);
  return (
    <div className="flex gap-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-[52vh] max-h-[420px] w-auto shrink-0" role="img" aria-label={`Схема маршрута. Вы в зоне ${current}.`}>
        <polygon points={pts.join(' ')} fill="rgba(201,164,106,0.12)" stroke="rgba(201,164,106,0.5)" strokeWidth="0.8" />
        <rect x={W / 2 - 28} y={toY(TUNNEL_END)} width={56} height={H - toY(TUNNEL_END) - 4} fill="rgba(60,80,120,0.15)" stroke="rgba(150,170,220,0.3)" strokeWidth="0.6" />
        <circle cx={W / 2 + BUSH.x * 1.6} cy={toY(BUSH.z)} r={R_OUTER * 1.05} fill="none" stroke="rgba(230,160,80,0.4)" strokeDasharray="2 2" />
        <circle cx={W / 2 + BUSH.x * 1.6} cy={toY(BUSH.z)} r={R_INNER * 1.05} fill="none" stroke="rgba(230,120,60,0.7)" />
        <circle cx={W / 2} cy={toY(BUSH.z)} r={1.6} fill="#ffb060" />
        <circle cx={W / 2 + x * 1.6} cy={toY(z)} r={3.2} fill="#efe2c6" stroke="#000" strokeWidth="0.8" />
      </svg>
      <ol className="space-y-1 text-sm">
        {ZONES.map((zn) => {
          const ok = visited.has(zn.id);
          return (
            <li key={zn.id}>
              <button disabled={!ok} onClick={() => onGo(zn.id)} className={`text-left w-full px-2 py-1 rounded ${current === zn.id ? 'bg-bronze/20' : ''} ${ok ? 'hover:bg-white/5 text-parch' : 'text-muted/50 cursor-not-allowed'}`}>
                <span className="text-bronze mr-1">{zn.id}</span> {zn.title}
                {!ok && <span className="sr-only"> (ещё не посещена)</span>}
              </button>
            </li>
          );
        })}
        <li className="text-xs text-muted pt-2">Переход доступен в уже посещённые зоны.</li>
      </ol>
    </div>
  );
}

export function Joystick({ onMove }: { onMove: (x: number, y: number) => void }) {
  const base = useRef<HTMLDivElement>(null);
  const [k, setK] = useState({ x: 0, y: 0, active: false });
  const idRef = useRef<number | null>(null);
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;
  useEffect(() => {
    // Pointercancel is not guaranteed when a phone locks or swaps apps.
    // Match World.stopMovement and reset the visible stick as well.
    const release = () => {
      idRef.current = null;
      setK({ x: 0, y: 0, active: false });
      onMoveRef.current(0, 0);
    };
    const hidden = () => { if (document.hidden) release(); };
    window.addEventListener('blur', release);
    document.addEventListener('visibilitychange', hidden);
    return () => {
      window.removeEventListener('blur', release);
      document.removeEventListener('visibilitychange', hidden);
      onMoveRef.current(0, 0);
    };
  }, []);
  const upd = (cx: number, cy: number) => {
    const r = base.current!.getBoundingClientRect();
    let dx = (cx - (r.left + r.width / 2)) / (r.width / 2), dy = (cy - (r.top + r.height / 2)) / (r.height / 2);
    const l = Math.hypot(dx, dy); if (l > 1) { dx /= l; dy /= l; }
    setK({ x: dx, y: dy, active: true }); onMove(dx, -dy);
  };
  return (
    <div ref={base} aria-hidden="true"
      className="fixed left-5 bottom-6 z-20 w-32 h-32 rounded-full border border-parch/25 bg-black/25 touch-none select-none"
      onPointerDown={(e) => { idRef.current = e.pointerId; (e.target as HTMLElement).setPointerCapture(e.pointerId); upd(e.clientX, e.clientY); }}
      onPointerMove={(e) => { if (idRef.current === e.pointerId) upd(e.clientX, e.clientY); }}
      onPointerUp={() => { idRef.current = null; setK({ x: 0, y: 0, active: false }); onMove(0, 0); }}
      onPointerCancel={() => { idRef.current = null; setK({ x: 0, y: 0, active: false }); onMove(0, 0); }}>
      <div className="absolute w-12 h-12 rounded-full bg-parch/30 border border-parch/50 pointer-events-none"
        style={{ left: `calc(50% - 1.5rem + ${k.x * 40}px)`, top: `calc(50% - 1.5rem + ${k.y * 40}px)` }} />
    </div>
  );
}
