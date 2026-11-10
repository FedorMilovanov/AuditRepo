/**
 * Architectural scale of the library's peripheral oak casework.
 *
 * Source of truth for both volume instances and the actual shelf/joinery
 * geometry. Dimensions are in world metres, not screen pixels. Earlier
 * V5.29 shelves stood 1.06 m apart and the book boxes were 0.60–0.90 m high,
 * making ordinary volumes resemble oversized architectural blocks.
 *
 * The 12-row design allows 0.31–0.48 m folios on 0.59 m-pitch shelves.
 * The 20 original room bays, 15.85 m outer radius, entrance, window views,
 * navigable 14.5 m colonnade and every editorial station remain unchanged.
 */
export const CASEWORK = Object.freeze({
  bays: 20,
  radius: 15.85,
  shelfRows: 12,
  booksPerShelf: 38,
  shelfWidth: 4.03,
  firstShelfY: 0.56,
  shelfPitch: 0.59,
  trimAboveShelf: 0.02,
  spineBaseAboveShelf: 0.06,
  minVolumeHeight: 0.31,
  volumeHeightVariation: 0.17,
  minVolumeWidth: 0.07,
  volumeWidthVariation: 0.035,
});
