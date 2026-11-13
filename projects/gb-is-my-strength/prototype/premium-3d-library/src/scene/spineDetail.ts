/**
 * Source-owned restrained gilded accents for a small subset of real folios.
 * All coordinates are book-local normalized units, so the details inherit
 * the real scale/tilt of each existing volume without moving its geometry.
 */
export const SPINE_DETAIL = Object.freeze({
  cadence: 12,
  bandsPerVolume: 2,
  heightOffset: 0.28,
  faceOffset: -0.507,
  bandWidth: 0.78,
  bandHeight: 0.026,
  bandDepth: 0.024,
});
export function gildedVolume(bay: number, level: number, b: number): boolean {
  return (b + bay * 3 + level * 5) % SPINE_DETAIL.cadence === 0;
}
