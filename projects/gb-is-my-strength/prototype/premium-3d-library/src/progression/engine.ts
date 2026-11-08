/** Laboratory-only progression: no site authority, no spiritual status, no server trust. */
export const LEVELS = [
  { name: "Посетитель", xp: 0, reward: "Личный кабинет" },
  { name: "Читатель", xp: 60, reward: "Персональный экслибрис" },
  { name: "Внимательный читатель", xp: 150, reward: "Оформление закладок" },
  { name: "Искатель источников", xp: 280, reward: "Бронзовый книгодержатель" },
  { name: "Исследователь", xp: 450, reward: "Оформление книжных полок" },
  { name: "Собиратель материалов", xp: 670, reward: "Дубовая отделка кабинета" },
  { name: "Составитель конспектов", xp: 930, reward: "Дизайн карточек цитат" },
  { name: "Архивариус", xp: 1250, reward: "Историческая карта в кабинете" },
  { name: "Знаток коллекций", xp: 1650, reward: "Освещение читального стола" },
  { name: "Хранитель библиотеки", xp: 2150, reward: "Табличка личного собрания" },
] as const;

export const RULES = {
  article_finished: { title: "Завершён материал", xp: 20, description: "После подтверждённого окончания чтения; один раз на материал" },
  source_checked: { title: "Проверен первоисточник", xp: 25, description: "С указанным источником; один раз на проверенный источник" },
  quiz_mastered: { title: "Освоен учебный тест", xp: 40, description: "Не менее 75% и просмотр разбора; один раз на тест" },
  note_with_source: { title: "Создана заметка с источником", xp: 15, description: "Своя мысль и ссылка на материал; один раз на материал" },
  review_completed: { title: "Повторение материала", xp: 25, description: "Через 1, 7 или 30 дней; каждый этап только однажды" },
  collection_curated: { title: "Собрана тематическая подборка", xp: 30, description: "Минимум три разных опубликованных материала" },
  path_completed: { title: "Завершён учебный маршрут", xp: 80, description: "Минимум три этапа с проверкой понимания" },
} as const;
export type Action = keyof typeof RULES;
export type Checkpoint = 1 | 7 | 30;
export type Evidence = {
  action: Action;
  artifactId: string;
  timestamp: string;
  completed?: boolean;
  sourceVerified?: boolean;
  masteryPercent?: number;
  feedbackReviewed?: boolean;
  hasOwnNote?: boolean;
  sourceRef?: string;
  checkpoint?: Checkpoint;
  itemCount?: number;
  pathStages?: number;
};
export type ProgressEvent = { key: string; action: Action; artifactId: string; timestamp: string; xp: number; checkpoint?: Checkpoint };
export type ProgressState = { schemaVersion: 1; events: ProgressEvent[]; purchases: string[] };
export const EMPTY_PROGRESS: ProgressState = { schemaVersion: 1, events: [], purchases: [] };
export const DECOR = [
  { id: "lamp", title: "Латунная настольная лампа", cost: 1, minLevel: 2 },
  { id: "bookplate", title: "Экслибрис с монограммой", cost: 2, minLevel: 3 },
  { id: "hourglass", title: "Песочные часы на столе", cost: 2, minLevel: 4 },
  { id: "wood", title: "Отделка тёмным орехом", cost: 3, minLevel: 6 },
  { id: "map", title: "Факсимиле старинной карты", cost: 3, minLevel: 8 },
] as const;

export function summarize(state: ProgressState) {
  const xp = state.events.reduce((n, e) => n + e.xp, 0);
  let level = 1;
  for (const [i, rank] of LEVELS.entries()) if (xp >= rank.xp) level = i + 1;
  const next = LEVELS[level] ?? null;
  const current = LEVELS[level - 1];
  const width = next ? next.xp - current.xp : 1;
  const tokensEarned = level - 1 + state.events.filter((e) => e.action === "path_completed").length;
  const tokensUsed = state.purchases.reduce((n, id) => n + (DECOR.find((item) => item.id === id)?.cost ?? 0), 0);
  return { xp, level, title: current.name, reward: current.reward, next, progress: next ? Math.min(1, Math.max(0, (xp - current.xp) / width)) : 1, tokens: Math.max(0, tokensEarned - tokensUsed) };
}

export const ACHIEVEMENTS = [
  { id: "first-read", title: "Начало пути", detail: "Первый завершённый материал", action: "article_finished", count: 1 },
  { id: "five-read", title: "Вдоль книжных полок", detail: "Пять разных завершённых материалов", action: "article_finished", count: 5 },
  { id: "first-source", title: "Голос источника", detail: "Первая сверка с первоисточником", action: "source_checked", count: 1 },
  { id: "three-sources", title: "Следы свидетельств", detail: "Три различных источника", action: "source_checked", count: 3 },
  { id: "first-note", title: "На полях", detail: "Первая собственная заметка с привязкой", action: "note_with_source", count: 1 },
  { id: "three-quiz", title: "Вдумчивое изучение", detail: "Три освоенных учебных теста", action: "quiz_mastered", count: 3 },
  { id: "first-collection", title: "Личная полка", detail: "Первая тематическая коллекция", action: "collection_curated", count: 1 },
  { id: "path", title: "Маршрут завершён", detail: "Первый оконченный учебный маршрут", action: "path_completed", count: 1 },
  { id: "spaced-return", title: "Возвращение к тексту", detail: "Повторение не ранее семи дней", action: "review_completed", count: 1, minCheckpoint: 7 },
] as const;

export function achievements(state: ProgressState) {
  return ACHIEVEMENTS.map(a => ({ ...a, earned: state.events.filter(e => e.action === a.action && ("minCheckpoint" in a ? (e.checkpoint ?? 0) >= a.minCheckpoint : true)).length >= a.count }));
}

export function keyOf(e: Evidence): string {
  // Revision-insensitive canonical IDs prevent re-publishing an article from minting points twice.
  return `${e.action}:${e.artifactId.trim()}` + (e.action === "review_completed" ? `:${e.checkpoint}` : "");
}

/** Reject permissive Date.parse() input and impossible UTC calendar dates. */
function dateDay(x: string): number {
  if (typeof x !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(x)) return NaN;
  const time = Date.parse(x);
  const canonical = x.endsWith('Z') && !x.includes('.') ? x.slice(0,-1)+'.000Z' : x;
  return Number.isFinite(time) && new Date(time).toISOString() === canonical ? time : NaN;
}
export function record(state: ProgressState, candidate: Evidence): { state: ProgressState; ok: boolean; reason: string } {
  if (!candidate || !Object.hasOwn(RULES, candidate.action) || typeof candidate.artifactId !== "string" ||
      !/^[a-z0-9][a-z0-9_:\/.-]{0,155}$/i.test(candidate.artifactId) ||
      !Number.isFinite(dateDay(candidate.timestamp)) || dateDay(candidate.timestamp) > Date.now() + 5 * 60_000) return { state, ok: false, reason: "Некорректные данные события" };
  const key = keyOf(candidate);
  if (state.events.length >= 500) return { state, ok: false, reason: "Лимит событий лаборатории исчерпан" };
  if (state.events.some((e) => e.key === key)) return { state, ok: false, reason: "Это достижение уже учтено" };
  switch (candidate.action) {
    case "article_finished": if (!candidate.completed) return { state, ok: false, reason: "Нужна проверка завершения материала" }; break;
    case "source_checked": if (!candidate.sourceVerified) return { state, ok: false, reason: "Источник не подтверждён" }; break;
    case "quiz_mastered": if (!(candidate.masteryPercent !== undefined && candidate.masteryPercent >= 75 && candidate.masteryPercent <= 100 && candidate.feedbackReviewed)) return { state, ok: false, reason: "Требуется 75% и просмотр разбора" }; break;
    case "note_with_source": if (!candidate.hasOwnNote || !candidate.sourceRef) return { state, ok: false, reason: "Нужна заметка и реальная ссылка на источник" }; break;
    case "review_completed": {
      if (![1, 7, 30].includes(candidate.checkpoint ?? 0)) return { state, ok: false, reason: "Неизвестный этап повторения" };
      const finished = state.events.find((e) => e.action === "article_finished" && e.artifactId === candidate.artifactId);
      if (!finished || dateDay(candidate.timestamp) - dateDay(finished.timestamp) < (candidate.checkpoint ?? 0) * 86_400_000)
        return { state, ok: false, reason: "Повторение пока недоступно" };
      break;
    }
    case "collection_curated": if (!(candidate.itemCount !== undefined && candidate.itemCount >= 3)) return { state, ok: false, reason: "Нужно минимум три разных материала" }; break;
    case "path_completed": if (!(candidate.pathStages !== undefined && candidate.pathStages >= 3 && candidate.completed)) return { state, ok: false, reason: "Не подтверждены этапы маршрута" }; break;
  }
  const event: ProgressEvent = { key, action: candidate.action, artifactId: candidate.artifactId, timestamp: candidate.timestamp, xp: RULES[candidate.action].xp, ...(candidate.action === "review_completed" ? {checkpoint: candidate.checkpoint}: {}) };
  return { state: { ...state, events: [...state.events, event] }, ok: true, reason: `+${event.xp} очков исследования` };
}

export function buyDecor(state: ProgressState, id: string) {
  const item = DECOR.find((x) => x.id === id);
  if (!item) return { state, ok: false, reason: "Награда не найдена" };
  if (state.purchases.includes(id)) return { state, ok: false, reason: "Уже в вашей мастерской" };
  const summary = summarize(state);
  if (summary.level < item.minLevel) return { state, ok: false, reason: `Открывается с уровня ${item.minLevel}` };
  if (summary.tokens < item.cost) return { state, ok: false, reason: "Недостаточно жетонов мастерской" };
  return { state: { ...state, purchases: [...state.purchases, id] }, ok: true, reason: "Предмет добавлен в коллекцию" };
}

export function parseProgress(raw: string | null): ProgressState {
  try {
    if (!raw || raw.length > 150_000) return structuredClone(EMPTY_PROGRESS);
    const p = JSON.parse(raw);
    if (p?.schemaVersion !== 1 || !Array.isArray(p.events) || !Array.isArray(p.purchases)) throw new Error("schema");
    const unique = new Set<string>();
    const events: ProgressEvent[] = [];
    for (const e of p.events.slice(0, 500)) {
      if (!e || !Object.hasOwn(RULES, e.action) || typeof e.artifactId !== "string" ||
          typeof e.key !== "string" || e.key !== keyOf(e as Evidence) ||
          typeof e.timestamp !== "string" || !Number.isFinite(dateDay(e.timestamp)) ||
          e.xp !== RULES[e.action as Action].xp || unique.has(e.key)) continue;
      unique.add(e.key); events.push({ key: e.key, action: e.action, artifactId: e.artifactId, timestamp: e.timestamp, xp: e.xp, ...(e.action === "review_completed" ? { checkpoint: e.checkpoint }: {}) });
    }
    const purchases = [...new Set(p.purchases)].filter((id): id is string => typeof id === "string" && DECOR.some((d) => d.id === id));
    return { schemaVersion: 1, events, purchases };
  } catch { return structuredClone(EMPTY_PROGRESS); }
}

/** Strict loader for persisted Lab progress; unlike parseProgress(), never drops bad rows silently. */
export function inspectProgress(raw: string | null): { ok: true; state: ProgressState } | { ok: false; reason: string } {
  if (raw === null) return { ok:true, state:structuredClone(EMPTY_PROGRESS) };
  if (raw.length > 150_000) return { ok:false,reason:'Сохранённый прогресс превышает лимит' };
  let p: unknown;
  try {p=JSON.parse(raw)}catch{return {ok:false,reason:'Некорректный JSON прогресса'}}
  if(!p||typeof p!=='object'||Array.isArray(p)) return {ok:false,reason:'Неверный формат прогресса'};
  const v=p as Record<string,unknown>;
  if(v.schemaVersion!==1 || !Array.isArray(v.events) || !Array.isArray(v.purchases) || v.events.length>500 || v.purchases.length>DECOR.length) return {ok:false,reason:'Неизвестная версия или размер прогресса'};
  const used=new Set<string>();
  const events: ProgressEvent[]=[];
  for(const e of v.events){
    if(!e||typeof e!=='object'||Array.isArray(e))return {ok:false,reason:'Повреждённое событие'};
    const x=e as Record<string,unknown>;
    if(typeof x.action!=='string'||!Object.hasOwn(RULES,x.action)||typeof x.artifactId!=='string'||
       !/^[a-z0-9][a-z0-9_:\/.-]{0,155}$/i.test(x.artifactId)||typeof x.timestamp!=='string'||!Number.isFinite(dateDay(x.timestamp))||
       dateDay(x.timestamp)>Date.now()+5*60_000 || typeof x.key!=='string' || x.key!==keyOf(x as Evidence) || used.has(x.key) ||
       x.xp!==RULES[x.action as Action].xp) return {ok:false,reason:'Подмена, дубликат или некорректное время события'};
    if(x.action==='review_completed'){
      if(![1,7,30].includes(x.checkpoint as number))return {ok:false,reason:'Неизвестный этап повторения'};
      const source=events.find(y=>y.action==='article_finished'&&y.artifactId===x.artifactId);
      if(!source||Date.parse(x.timestamp)-Date.parse(source.timestamp)<(x.checkpoint as number)*86_400_000) return {ok:false,reason:'Нет подтверждённого срока повторения'};
    }else if(x.checkpoint!==undefined) return {ok:false,reason:'Лишний этап у события'};
    used.add(x.key);
    events.push({key:x.key,action:x.action as Action,artifactId:x.artifactId,timestamp:x.timestamp,xp:x.xp as number,...(x.action==='review_completed'?{checkpoint:x.checkpoint as Checkpoint}:{})});
  }
  const purchases:string[]=[];
  for(const id of v.purchases){if(typeof id!=='string'||purchases.includes(id)||!DECOR.some(d=>d.id===id))return {ok:false,reason:'Повреждённые покупки'};purchases.push(id)}
  const candidate:ProgressState={schemaVersion:1,events,purchases};
  const wallet=summarize(candidate);
  const earned=wallet.level-1+events.filter(e=>e.action==='path_completed').length;
  const spent=purchases.reduce((n,id)=>n+(DECOR.find(d=>d.id===id)?.cost||0),0);
  if(spent>earned||purchases.some(id=>(DECOR.find(d=>d.id===id)?.minLevel||Infinity)>wallet.level))return {ok:false,reason:'Нарушена целостность жетонов и уровней'};
  return {ok:true,state:candidate};
}
