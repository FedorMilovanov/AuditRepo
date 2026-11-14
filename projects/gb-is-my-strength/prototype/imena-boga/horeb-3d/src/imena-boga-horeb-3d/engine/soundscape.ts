// Acoustic dramaturgy is based on actual visitor position, not zone changes
// alone: no abrupt volume step while crossing the quiet passage in either
// direction. Pure calculations are testable without AudioContext or GPU.
const smoothstep = (a: number, b: number, value: number): number => {
  const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export interface SoundscapeMix {
  /** Intentional hush of the zone-6 passage (1 = full natural ambience). */
  hush: number;
  /** Smooth emergence into open-air mountain wind (0 = cave, 1 = outside). */
  outside: number;
  /** Unmodulated gain before gust, explicit silence and user mute. */
  windBed: number;
  /** Wind tone; band-limited synthesised air, never speech or a cue. */
  windCutoff: number;
}

export function soundscapeMixAt(z: number, zone: number): SoundscapeMix {
  if (!Number.isFinite(z)) return { hush: 1, outside: 0, windBed: 0.045, windCutoff: 280 };
  const travel = -z;
  // From last gallery -> narrowing -> exit: 15m fade in, 16m hold,
  // 15m release. Last gallery quietens *before* crossing the zone label.
  const entering = smoothstep(282, 297, travel);
  const leaving = smoothstep(313, 328, travel);
  const hush = 1 - 0.82 * entering * (1 - leaving);
  const outside = smoothstep(310, 336, travel);
  const windBed = (0.045 + 0.065 * outside) * hush;
  const windCutoff = (zone === 4 ? 180 : 280) * (1 - outside) + 650 * outside;
  return { hush, outside, windBed, windCutoff };
}
