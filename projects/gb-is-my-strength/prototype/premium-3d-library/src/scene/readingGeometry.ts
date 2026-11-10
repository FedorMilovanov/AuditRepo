/** Single source of truth for physical reading furniture (metres/radians).
 * These dimensions are shared by the real scene and numerical regression.
 * V5.36 repair keeps the original styling, material ownership and positions.
 */
export const READING_GEOMETRY = Object.freeze({
  tableTopY: 1.63,
  bookCenterY: 2.00,
  bookCenterZ: 0.18,
  bookTiltX: 0.35,
  coverLocalY: -0.04,
  coverThickness: 0.10,
  coverDepth: 1.60,
  supportCenterY: 1.84,
  supportCenterZ: -0.43,
  supportTiltX: -0.24,
  supportHeight: 0.52,
  supportDepth: 0.15,
  lecternPageRotationX: -Math.PI / 2,
  lecternFacingTiltX: 0.62,
});
