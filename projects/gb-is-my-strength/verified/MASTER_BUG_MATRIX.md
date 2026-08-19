# MASTER BUG MATRIX — gb-is-my-strength

> Single source of truth for current verified necessary work.
> Not a history table; not a mirror of every Product signal.
> Anchor: Product HEAD `cb3681e1a85b5f8919c9dc537f812a842bbe9235` (2026-08-19)
> Evidence base: Wave 1 (2026-07-17), Wave 2 (2026-07-17), Arena Agent audit pass (2026-07-17), incoming AR-IDX-JS-02.
> Prior wave anchor: 485db8c25287fa9bd2f53a5356885f02e4b81f4b — re-check required where noted.

---

## Current state

| Field | Value |
|---|---|
| Active work units | **9** |
| Direct current defects | **6** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **2** |
| System verification lanes | **1** |
| Owner decisions | **0** |

---

## CURRENT DEFECTS — 6

| ID | Current problem | Boundary | Evidence | Min closure proof |
|---|---|---|---|---|
| `GENEALOGY-ID-INVALID-SPACE` | JSON ID ` lud_shem` has a leading space. Any automated processing, lookup or filter on `persons[].id` silently breaks for this node. Map key and all cross-references diverge. | HEAD cb3681e / `data/genealogy/genealogy.json` | Wave 2 source-read; FAIL | All IDs match `^[a-z_][a-z0-9_]*$`; no leading/trailing whitespace; cross-refs updated |
| `SITE-TS-SERIES-ORDER` | `SERIES_ORDER['dzhon-gill']` lists `chast-4-ekzeget` before `chast-3-nasledie`. Manual ordering error causes incorrect «next article» navigation and canonical series rendering. | HEAD cb3681e / `src/data/site.ts` lines ~35–41 | Wave 1 source-read; confirmed at current HEAD | `chast-3-nasledie` appears before `chast-4-ekzeget` in the array; regression test passes |
| `RODOSLOVIYE-OG-IMAGE` | `RodosloviyePageHead.astro` serves `og:image = /images/og-karty-1200x630.webp` — the karty (maps) image, not a genealogy-specific image. Wrong OG thumbnail on all rodosloviye shares. | HEAD cb3681e / `src/components/rodosloviye/RodosloviyePageHead.astro` | Wave 1 source-read; confirmed at current HEAD | Correct rodosloviye OG image path served; distinct from karty image |
| `APP-OG-TYPE-MISMATCH` | `src/pages/app/index.astro` sets `og:type = "website"` but also emits `article:published_time` and `article:modified_time` properties, which are valid only for `og:type = "article"`. Parsers may discard or misinterpret the article timestamps. | HEAD cb3681e / `src/pages/app/index.astro` | Arena Agent audit pass + Wave 2; confirmed at current HEAD | Either remove `article:*` meta tags or change `og:type` to `"article"` consistently |
| `APP-POSTDATED-METADATA` | `publishedTime` and `modifiedTime` in `app/index.astro` are hardcoded to `2026-08-17T00:00:00+03:00`. As of Product HEAD date (2026-08-19) this is in the past, but the file was only committed at HEAD (2026-08-19). If the page was live before 2026-08-17 the date is back-dated; if not, the date is accurate. **Requires owner verification.** | HEAD cb3681e / `src/pages/app/index.astro` | Wave 2; confirmed text present at HEAD | Owner confirms actual first-live date; metadata matches reality |
| `HTML-BTN-TYPE-MISSING` | Multiple `<button>` elements across the codebase (confirmed: `PastorSeriesPageChrome.astro` and others) omit `type="button"`. In forms this causes accidental form submission; outside forms it is an HTML conformance defect and an accessibility smell (implicit `type="submit"`). | HEAD cb3681e (system-wide) | Arena Agent pass 6, incoming pass; confirmed in PastorSeriesPageChrome | All interactive non-submit `<button>` elements carry explicit `type="button"` |

---

## NARROWED RESIDUALS — 2

| ID | Current residual | Evidence anchor | Next step |
|---|---|---|---|
| `AR-IDX-JS-02-THEME-MULTIWRITER` | `js/enhancements.js` writes `localStorage` theme via fallback `"theme"` key (`SiteUtils.themeKey \|\| "theme"`). `js/site.js` may contain similar fallback. Canonical owner is `gb:reader-preferences:v1` in `reader-preferences.js`. Co-existence creates multi-writer surface: whichever script runs last wins, potentially overriding canonical preference. | HEAD cb3681e (confirmed in enhancements.js) | Strip legacy `localStorage.setItem` theme writes from `enhancements.js` and `site.js`; delegate entirely to `reader-preferences.js` |
| `GENEALOGY-LINEAGE-ANCESTOR-TRACE` | `computeFocusLineage` in `layout.ts` traces ancestors strictly via `father` (and `mother` only for `jesus`). All other persons follow only the paternal line upward. Maternal ancestors are silently excluded from the focus lineage set, causing the filter to miss entire branches when a non-Jesus node is selected. | HEAD cb3681e / `src/components/genealogy/layout.ts` | Extend ancestor trace to follow both `father` and `mother` for every node, not only `jesus`; verify focus filter completeness |

---

## SYSTEM VERIFICATION LANES — 1

| ID | Verified work package | Scope | Next boundary |
|---|---|---|---|
| `SITEWIDE-BTN-TYPE-AUDIT` | Full audit of all `.astro` and `.tsx` components for `<button>` elements missing `type` attribute. `PastorSeriesPageChrome.astro` is a confirmed instance. Theme-toggle and search buttons are the most common pattern. | All `src/components/**/*.astro`, `src/components/**/*.tsx` | Pass over all component files; enumerate each instance; produce fix list |

---

## OWNER DECISIONS — 0

| ID | Missing decision |
|---|---|

---

## Terminal disposition

Admit a row only after signal classification, exact-anchor applicability, current necessity and ownership are established.
Remove solved, stale, duplicate, absorbed and superseded rows in the same closure transaction.
