import { useEffect, useRef, useState } from 'react';
import { achievements, buyDecor, DECOR, EMPTY_PROGRESS, LEVELS, inspectProgress, record, RULES, summarize, type Evidence, type ProgressState } from './engine';

const STORE_KEY = 'gb-premium-lab-progress-demo-v1'; // Lab only; NEVER Product reader key.

const samples: Array<{ label: string; detail: string; payload: Omit<Evidence, 'timestamp'> }> = [
  { label: 'Завершить материал', detail: 'Пример завершения чтения', payload: { action: 'article_finished', artifactId: 'demo-article-1', completed: true } },
  { label: 'Проверить источник', detail: 'Пример сверки первоисточника', payload: { action: 'source_checked', artifactId: 'demo-source-1', sourceVerified: true } },
  { label: 'Освоить тест', detail: 'Образец: 85% и прочитан разбор', payload: { action: 'quiz_mastered', artifactId: 'demo-quiz-1', masteryPercent: 85, feedbackReviewed: true } },
  { label: 'Сохранить заметку', detail: 'Образец заметки с источником', payload: { action: 'note_with_source', artifactId: 'demo-article-1', hasOwnNote: true, sourceRef: 'demo-source-1' } },
  { label: 'Составить коллекцию', detail: 'Образец: три разных материала', payload: { action: 'collection_curated', artifactId: 'demo-collection-1', itemCount: 3 } },
  { label: 'Завершить маршрут', detail: 'Образец: три учебных этапа', payload: { action: 'path_completed', artifactId: 'demo-path-1', pathStages: 3, completed: true } },
];
const emoji: Record<string, string> = { lamp: '♜', bookplate: '❧', hourglass: '⌛', wood: '▤', map: '◎' };

function seededDemo(): ProgressState {
  let state = structuredClone(EMPTY_PROGRESS);
  const timestamp = new Date().toISOString();
  for (let i = 0; i < 22; i++) {
    state = record(state, { action: 'article_finished', artifactId: `demo-book-${i}`, timestamp, completed: true }).state;
    if (i < 10) state = record(state, { action: 'source_checked', artifactId: `demo-source-${i}`, timestamp, sourceVerified: true }).state;
    if (i < 8) state = record(state, { action: 'quiz_mastered', artifactId: `demo-quiz-${i}`, timestamp, masteryPercent: 90, feedbackReviewed: true }).state;
    if (i < 4) state = record(state, { action: 'note_with_source', artifactId: `demo-book-${i}`, timestamp, hasOwnNote: true, sourceRef: `demo-source-${i}` }).state;
  }
  for (let i = 0; i < 5; i++) state = record(state, {action:'path_completed', artifactId:`demo-path-${i}`,timestamp,completed:true,pathStages:4}).state;
  return state;
}

function safeRead(): { state: ProgressState; blocked: boolean; reason: string } {
  try {
    const result = inspectProgress(localStorage.getItem(STORE_KEY));
    return result.ok ? { state:result.state,blocked:false,reason:'' } : { state:structuredClone(EMPTY_PROGRESS),blocked:true,reason:result.reason };
  } catch { return {state:structuredClone(EMPTY_PROGRESS),blocked:true,reason:'Браузер запретил доступ к сохранённому прогрессу'}; }
}

export default function ProgressPanel({ onClose }: { onClose: () => void }) {
  const [initial] = useState(safeRead);
  const [state, setState] = useState<ProgressState>(initial.state);
  const [blocked, setBlocked] = useState(initial.blocked);
  const [blockReason,setBlockReason] = useState(initial.reason);
  const [tab, setTab] = useState<'levels' | 'activity' | 'decor' | 'achievements'>('levels');
  const [message, setMessage] = useState('');
  const closeRef = useRef<HTMLButtonElement>(null);
  const level = summarize(state);
  useEffect(() => { if(blocked)return; try {localStorage.setItem(STORE_KEY,JSON.stringify(state))} catch {setBlocked(true);setBlockReason('Запись прогресса недоступна');setMessage('Запись прогресса недоступна; существующие данные не тронуты')} }, [state,blocked]);
  useEffect(() => {
    closeRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onClose(); }
      // Native focus trap prevents keyboard navigation into the moving 3D world.
      if (e.key === 'Tab') {
        const root = document.querySelector('[data-gb-progression-modal]');
        const nodes = [...(root?.querySelectorAll<HTMLButtonElement>('button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])') ?? [])]
          .filter((n) => n.getClientRects().length > 0);
        if (!nodes.length) return;
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [onClose]);
  function demoAction(event: Omit<Evidence, 'timestamp'>) {
    if(blocked){setMessage('Запись отключена из-за ошибки данных');return}
    const r = record(state, { ...event, timestamp: new Date().toISOString() });
    if (r.ok) setState(r.state);
    setMessage(r.reason);
  }
  function purchase(id: string) {
    if(blocked){setMessage('Запись отключена из-за ошибки данных');return}
    const r = buyDecor(state, id);
    if (r.ok) setState(r.state);
    setMessage(r.reason);
  }
  return (
    <div data-gb-progression-modal className="fixed inset-0 z-[75] flex items-center justify-center bg-[#111a18]/85 p-2 backdrop-blur-md sm:p-5" role="dialog" aria-modal="true" aria-labelledby="gb-progression-title">
      <div className="flex max-h-[96dvh] w-full max-w-[1040px] flex-col overflow-hidden rounded-[24px] border border-[#b9aa8d]/30 bg-[#f3efe5] text-[#292c27] shadow-[0_35px_100px_#0008] sm:max-h-[92dvh] sm:rounded-[30px]">
        <header className="relative flex shrink-0 items-start justify-between gap-2 border-b border-[#d9d0c1] bg-[#e7e2d5] px-4 py-4 sm:px-7 sm:py-5">
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#657369] sm:tracking-[0.32em]">Господь Бог — сила моя · личная библиотека</div>
            <h2 id="gb-progression-title" className="mt-1 font-display text-[28px] font-semibold leading-tight text-[#24382f] sm:text-[40px]">Путь исследователя</h2>
            <div className="mt-1 text-xs text-[#5d655f]">Лабораторный прототип · развитие навыков чтения, а не оценка веры</div>
          </div>
          <button ref={closeRef} onClick={onClose} className="shrink-0 rounded-full border border-[#aeb3a8] bg-white/65 px-3 py-2 text-sm font-semibold text-[#28352d] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b5546]" aria-label="Закрыть путь исследователя">Закрыть ×</button>
        </header>
        <div className="grid min-h-0 flex-1 overflow-y-auto md:grid-cols-[295px_1fr]">
          <aside className="flex flex-col gap-4 bg-[#243b32] p-5 text-[#f0eee6] sm:p-7">
            <div className="text-[11px] font-medium uppercase tracking-[0.19em] text-[#cfbd9c]">Текущий уровень</div>
            <div className="flex items-end gap-3">
              <span className="font-display text-[80px] leading-[0.83] text-[#ede2ce]">{level.level.toString().padStart(2,'0')}</span>
              <span className="pb-1 text-xs text-[#d3c9b9]">из 10<br/>ступеней</span>
            </div>
            <div className="font-display text-3xl leading-tight">{level.title}</div>
            {blocked && <div role="alert" className="rounded-xl bg-[#f8e1ce] p-3 text-xs text-[#573b25]">Данные не перезаписаны: {blockReason}. Сначала сохраните исходные данные из браузера, затем можно явно сбросить демо.</div>}
            <div className="grid grid-cols-2 gap-2 border-y border-[#ddd1b8]/25 py-4 text-center">
              <div><div className="font-display text-3xl">{level.xp.toLocaleString('ru-RU')}</div><div className="text-[11px] text-[#d0c9b9]">очки исследования</div></div>
              <div><div className="font-display text-3xl">{level.tokens}</div><div className="text-[11px] text-[#d0c9b9]">жетоны мастерской</div></div>
            </div>
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-[#e4ded0]"><span>До следующей ступени</span><span>{level.next ? `${level.next.xp - level.xp} очков` : 'Все ступени пройдены'}</span></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#799083]/50" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(level.progress * 100)}><div className="h-full rounded-full bg-[#dfc69b] transition-all" style={{ width: `${level.progress * 100}%` }}/></div>
            </div>
            <p className="text-xs leading-relaxed text-[#d2d9d1]">Награды не влияют на доступ к чтению и источникам. Нет рейтингов пользователей, серий обязательных дней и штрафов за перерыв.</p>
            <div className="mt-auto flex flex-wrap gap-2">
              <button disabled={blocked} onClick={() => {setState(seededDemo());setMessage('Загружен вымышленный пример прогресса');}} className="rounded-full border border-[#f0d7aa]/50 px-3 py-2 text-xs text-[#f2e5c9] hover:bg-white/10">Показать пример пути</button>
              <button onClick={() => {if(!confirm('Сбросить локальный демонстрационный прогресс?'))return;setBlocked(false);setState(structuredClone(EMPTY_PROGRESS));setMessage('Демонстрационный прогресс очищен');}} className="rounded-full border border-white/25 px-3 py-2 text-xs text-[#e7e3da] hover:bg-white/10">Сбросить демо</button>
            </div>
          </aside>
          <section className="min-w-0 p-4 sm:p-7">
            <nav className="flex flex-wrap gap-2 border-b border-[#c7c3b8] pb-4" aria-label="Разделы развития">
              {([{k:'levels',t:'Уровни'},{k:'activity',t:'Как получать очки'},{k:'decor',t:'Мастерская'},{k:'achievements',t:'Памятные знаки'}] as const).map(t=><button key={t.k} onClick={() => {setTab(t.k);setMessage('');}} aria-pressed={tab===t.k} className={`rounded-full px-3.5 py-2 text-[13px] font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b5546] ${tab===t.k?'bg-[#314e40] text-white':'bg-[#e4e0d5] text-[#415147] hover:bg-[#d8d4c7]'}`}>{t.t}</button>)}
            </nav>
            {tab === 'levels' && <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {LEVELS.map((x,i)=><div key={x.name} className={`flex items-center gap-3 rounded-2xl border p-3 ${i + 1 <= level.level?'border-[#b6b69d] bg-[#e6e7dc]':'border-[#dfdacf] bg-[#f9f7f2]'}`}>
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl font-display text-2xl ${i+1<=level.level?'bg-[#375948] text-white':'bg-[#e3ddcf] text-[#777466]'}`}>{String(i + 1).padStart(2,'0')}</span>
                <div className="min-w-0"><div className="text-[14px] font-semibold text-[#253b31]">{x.name}</div><div className="text-[11px] text-[#6d6b63]">{x.xp.toLocaleString('ru-RU')} очков · {x.reward}</div></div>
              </div>)}
            </div>}
            {tab === 'activity' && <div className="mt-5 space-y-3">
              <p className="text-sm leading-relaxed text-[#515b52]">Засчитывается осмысленная работа с материалами. Кнопки ниже — <strong>только симуляция</strong> событий в локальном эксперименте, не фактическая проверка чтения.</p>
              {samples.map(sample=>{
                const done = state.events.some(e => e.key === `${sample.payload.action}:${sample.payload.artifactId}`);
                return <div key={sample.label} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#dcd6ca] bg-white/60 px-4 py-3">
                  <div><div className="text-sm font-semibold text-[#31473a]">{sample.label}</div><div className="text-xs text-[#77746a]">{sample.detail} · +{RULES[sample.payload.action].xp} очков</div></div>
                  <button disabled={blocked||done} onClick={() => demoAction(sample.payload)} className="rounded-full border border-[#3e6a52] px-3 py-1.5 text-xs font-semibold text-[#28503c] hover:bg-[#e3ece3] disabled:cursor-not-allowed disabled:border-[#c9c6be] disabled:text-[#89877e]">{done?'Учтено':'Симулировать'}</button>
                </div>})}
              <div className="rounded-xl bg-[#e9e3d8] p-3 text-xs leading-relaxed text-[#595950]">Повторения: +25 очков спустя 1, 7 и 30 дней после первого завершения материала. Проверяется реальная задержка; повторное нажатие очков не даёт.</div>
            </div>}
            {tab === 'decor' && <div className="mt-5 space-y-3">
              <p className="text-sm leading-relaxed text-[#515b52]">Жетоны мастерской начисляются за новые уровни и завершённые маршруты. Предметы меняют только внешний вид личного кабинета; визуальное размещение в 3D — следующий этап.</p>
              {DECOR.map(item=>{
                const owned = state.purchases.includes(item.id);
                const available = level.level >= item.minLevel && level.tokens >= item.cost;
                return <div key={item.id} className="flex items-center gap-3 rounded-xl border border-[#dcd6ca] bg-white/60 px-4 py-3">
                  <span aria-hidden className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#e3ded0] text-2xl text-[#506b56]">{emoji[item.id]}</span>
                  <div className="min-w-0 flex-1"><div className="text-sm font-semibold">{item.title}</div><div className="text-[11px] text-[#77746a]">Уровень {item.minLevel} · {item.cost} жет.</div></div>
                  <button disabled={blocked||!available || owned} onClick={() => purchase(item.id)} className="rounded-full bg-[#365743] px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#d7d3c9] disabled:text-[#7a7b72]">{owned?'В коллекции':'Выбрать'}</button>
                </div>})}
            </div>}
            {tab === 'achievements' && <div className="mt-5 grid gap-2 sm:grid-cols-2">
              {achievements(state).map(a => <div key={a.id} className={`flex gap-3 rounded-2xl border p-3 ${a.earned ? 'border-[#b8cbb7] bg-[#e6eae0]':'border-[#dfdacf] bg-[#f9f7f2]'}`}>
                <span aria-hidden className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl text-xl ${a.earned?'bg-[#45634e] text-white':'bg-[#e3ded0] text-[#aaa393]'}`}>{a.earned ? '✦' : '◇'}</span>
                <div><div className="text-sm font-semibold text-[#263d30]">{a.title}</div><div className="text-xs text-[#74776c]">{a.detail}</div></div>
              </div>)}
            </div>}
            {message && <div role="status" className="mt-4 rounded-xl bg-[#e6ece2] p-3 text-[13px] text-[#28503c]">{message}</div>}
          </section>
        </div>
      </div>
    </div>
  );
}
