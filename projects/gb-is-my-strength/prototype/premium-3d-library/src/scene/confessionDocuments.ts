/**
 * Editorial metadata for an INTERPRETIVE archival display (not reproduced
 * historical title pages or invented confessional quotations).
 * The second London confession was printed in 1677 and publicly adopted
 * by the London Baptist General Assembly in 1689.
 * References: Westminster Assembly Project, Ligonier, Baptist Studies Online.
 */
export const CONFESSION_DOCUMENTS = Object.freeze([
  {
    date: "1530",
    tradition: "ЛЮТЕРАНСКАЯ",
    lines: ["АУГСБУРГСКОЕ", "ИСПОВЕДАНИЕ"],
    cover: "#594039",
  },
  {
    date: "1563",
    tradition: "РЕФОРМАТСКАЯ",
    lines: ["ГЕЙДЕЛЬБЕРГСКИЙ", "КАТЕХИЗИС"],
    cover: "#435b50",
  },
  {
    date: "1646",
    tradition: "ПРЕСВИТЕРИАНСКАЯ",
    lines: ["ВЕСТМИНСТЕРСКОЕ", "ИСПОВЕДАНИЕ"],
    cover: "#4a5367",
  },
  {
    date: "1677/1689",
    tradition: "БАПТИСТСКАЯ",
    lines: ["ВТОРОЕ ЛОНДОНСКОЕ", "БАПТИСТСКОЕ", "ИСПОВЕДАНИЕ"],
    cover: "#66503e",
  },
] as const);
