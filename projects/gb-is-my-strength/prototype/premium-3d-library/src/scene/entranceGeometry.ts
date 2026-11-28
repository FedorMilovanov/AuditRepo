/**
 * Single source of truth for the open entrance portico (world metres).
 * The main player walk radius / stations are intentionally NOT changed.
 * All load-bearing entrance solids stay at |x| >= corridorHalfWidth.
 */
export const ENTRANCE_GEOMETRY = Object.freeze({
  radius: 14.45,
  pierX: 1.84,
  pierWidth: 0.62,
  corridorHalfWidth: 1.49,
  springY: 4.72,
  innerRadius: 1.49,
  outerRadius: 1.87,
  archStones: 13,
  faceDepth: 3.65,
  outsideFloorStart: 16.02,
  outsideFloorEnd: 24.25,
});
