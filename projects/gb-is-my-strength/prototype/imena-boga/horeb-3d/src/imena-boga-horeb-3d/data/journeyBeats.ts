// Optional walking captions, original museum interpretation, NEVER a divine
// voice, Scripture quote, or licensed recording. Later human voice is HOLD.
export interface JourneyBeat { id: string; atZ: number; title: string; text: string; source: string }
export const JOURNEY_BEATS: readonly JourneyBeat[] = Object.freeze([
  { id: 'threshold', atZ: -8, title: 'Каменный порог', text: 'Ландшафт здесь условный. Откройте первое свидетельство и сопоставьте его с текстом.', source: 'Быт. 1:1' },
  { id: 'forefathers', atZ: -65, title: 'Голоса патриархов', text: 'Колодец, шатёр и источник напоминают о разных событиях и разных местах.', source: 'Быт. 16; 17; 21' },
  { id: 'memorials', atZ: -119, title: 'Память пути', text: 'Свидетельства об алтарях относятся к разным временам. Сопоставляйте, не смешивая.', source: 'Быт. 22; Исх. 17; Суд. 6' },
  { id: 'chasm', atZ: -173, title: 'У края глубины', text: 'Справа обрыв. Осмотрите каменные пласты; основной проход остаётся слева.', source: 'Ис. 6:3; Втор. 32:4' },
  { id: 'witnesses', atZ: -231, title: 'Позднейшие свидетельства', text: 'Здесь образы из разных эпох. Оливковая роща напоминает об Иерусалиме, а не о Хориве.', source: 'Мк. 14:32–36' },
  { id: 'hush', atZ: -290, title: 'Тихий проход', text: 'Впереди выход из галереи. Дайте тишине и шагам обозначить переход.', source: 'Художественная композиция' },
  { id: 'wilderness', atZ: -325, title: 'Открытая земля', text: 'Ночной скальный пейзаж условен. Точное местонахождение библейского Хорива не установлено.', source: 'Исх. 3:1–6' },
  { id: 'approach', atZ: -343, title: 'Перед границей', text: 'Не спешите. Для дальнейшего подхода нужно снять обувь; сам куст остаётся недоступным.', source: 'Исх. 3:5' },
]);
export function journeyBeatCrossing(fromZ: number, toZ: number, seen: ReadonlySet<string>): JourneyBeat | null {
  if (![fromZ, toZ].every(Number.isFinite) || toZ >= fromZ || fromZ - toZ > 0.28) return null;
  return JOURNEY_BEATS.find(b => fromZ >= b.atZ && toZ < b.atZ && !seen.has(b.id)) ?? null;
}
