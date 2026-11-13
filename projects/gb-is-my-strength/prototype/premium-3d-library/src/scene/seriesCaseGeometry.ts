/** Physical dimensions of the Series bibliographic case (metres).
 * It stands on the existing historical-section stone pedestal.
 * Series are represented as indexed symbolic folios, NOT invented works.
 */
export const SERIES_CASE = Object.freeze({
  stationArtOriginY: 1.95,
  stonePedestalTopY: 1.09,
  shelfWidth: 1.80,
  shelfDepth: 0.70,
  bottomShelfCenterY: -0.82,
  bottomShelfThickness: 0.08,
  upperShelfCenterY: 0.30,
  upperShelfThickness: 0.07,
  crownCenterY: 1.15,
  crownThickness: 0.10,
  sideRailX: 0.79,
  sideRailWidth: 0.075,
  sideRailHeight: 2.06,
  sideRailCenterY: 0.17,
  bookDepth: 0.54,
  spineFaceZ: 0.277,
});

type SeriesVolume = Readonly<{
  id: string;
  roman: string;
  row: 0 | 1;
  x: number;
  width: number;
  height: number;
  leather: string;
}>;

/** Seven distinct physical bindings, each resting on one wooden shelf.
 * Roman numerals are display indices; they do not claim a real catalogue.
 */
export const SERIES_VOLUMES: readonly SeriesVolume[] = Object.freeze([
  { id: "i",   roman: "I",   row: 0, x: -0.53, width: 0.30, height: 0.95, leather: "#633d39" },
  { id: "ii",  roman: "II",  row: 0, x: -0.18, width: 0.31, height: 1.01, leather: "#354e57" },
  { id: "iii", roman: "III", row: 0, x:  0.17, width: 0.30, height: 0.98, leather: "#57472e" },
  { id: "iv",  roman: "IV",  row: 0, x:  0.51, width: 0.29, height: 0.96, leather: "#354a3b" },
  { id: "v",   roman: "V",   row: 1, x: -0.44, width: 0.38, height: 0.70, leather: "#5c414a" },
  { id: "vi",  roman: "VI",  row: 1, x:  0.00, width: 0.37, height: 0.73, leather: "#694a34" },
  { id: "vii", roman: "VII", row: 1, x:  0.44, width: 0.38, height: 0.68, leather: "#34485e" },
].map(volume => Object.freeze(volume)));

export const seriesShelfTop = (row: 0 | 1): number => {
  const c = SERIES_CASE;
  return row === 0
    ? c.bottomShelfCenterY + c.bottomShelfThickness / 2
    : c.upperShelfCenterY + c.upperShelfThickness / 2;
};
