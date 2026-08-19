# MASTER BUG MATRIX — gb-is-my-strength

> SSOT for current verified necessary work only. This is not a history table or a mirror of every source-repository signal.
>
> Re-anchored to Product `main` **cb3681e** (2026-08-19) by the 2026-08-19 post-advance reverify wave. Rows previously anchored at `485db8c` were re-checked against cb3681e + live + committed production artifacts. Closed/stale/invalid/absorbed rows were removed in the same consolidation wave; their provenance lives in `CLOSURE_LEDGER.md`, `verification/`, `incoming/bugverifikator/2026-08-19/` and Git history.

## Current state

| Field | Value |
|---|---|
| Active work units | **13** |
| Direct current defects | **7** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **3** |
| System verification lanes | **3** |
| Owner decisions | **0** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

> Row arithmetic: 7 defects + 0 improvements + 3 residuals + 3 system lanes + 0 owner decisions = 13 active rows. Within these, `SECURITY-CSP-INCONSISTENCY` is kept in CURRENT DEFECTS only as the named absorbed manifestation of `FRAGMENTED-SECURITY-OWNERSHIP` (its real owner is the system lane), and `RSS-SERIES-DATE-COLLAPSE` is the named current manifestation of `METADATA-SSOT-PROLIFERATION` (kept separate: independent public artifact, independent repair). `TRACE-GOLDEN-PATH-PERF`, `GILL-SLUG-NUMBERING-LEGACY` and `PAGEFIND-STATIC-FRESHNESS-MEASUREMENT` are parked in `WORK_QUEUE.md` and are intentionally **not** active MASTER rows.

## CURRENT DEFECTS — 7

| ID | Current problem | Boundary |
|---|---|---|
| `RODOSLOVIYE-OG-IMAGE` | `/rodosloviye/` head uses the `/karty/` OG/Twitter image (`og-karty-1200x630.webp`) while `og:image:alt` describes родословие; asset and context disagree. Confirmed source + live + committed artifact (3 angles). | HEAD cb3681e |

| `GENEALOGY-NO-ERROR-BOUNDARY` | `GenealogyTree.tsx` React island has no `ErrorBoundary`; a runtime throw yields a blank/uncerrored surface. Source-only (no runtime crash reproduced yet). | HEAD cb3681e |

| `EDITORIAL-LABEL-INCONSISTENCY` | `Header.astro` nav label for `/hard-texts/` is "Разбор заблуждений" while `site.ts` `SECTION_META['hard-texts']` canonical label is "Трудные тексты". | HEAD cb3681e |
| `SECURITY-CSP-INCONSISTENCY` | Re-measured 2026-08-19 on live with order-insensitive `<meta>` parsing: **5 distinct `img-src` variants and 8 distinct full CSP strings across 84 CSP-bearing pages**, plus 18 pages with no `X-Content-Type-Options` (`/`, `/app/`, `/map/`, `/rodosloviye/`, `/izbrannoe/`, `/konfessii/*`, `/karty/*`, `/hard-texts/genesis-6/`); fragmentation of per-head hand-written CSP. **Absorbed symptom of `FRAGMENTED-SECURITY-OWNERSHIP`** (kept here only as the named manifestation; `'self'` already covers same-origin `gospod-bog.ru`, so no proven image breakage — defect is inconsistency, not a functional break). | HEAD cb3681e |
| `RSS-SERIES-DATE-COLLAPSE` | Public artifact contradicts the public page: live `feed.xml` (58 items) carries only 9 distinct `pubDate` values. The «Баптисты России» series ships 11 items on one identical date while the pages' JSON-LD `datePublished` are distinct (2026-06-01…2026-06-10) — divergence up to 17 days — so feed order degenerates to the alphabetical slug tie-break (`dva-sezda-1884` before `noch-na-kure`, i.e. part 3 before part 1). Gill parts 1–3 collapse the same way (Δ≈121 h). Mechanism: `scripts/rss-feed-normalizer.js:78` reads the date from `data/search-manifest.json` (`:658` = `2026-06-18` for `/baptisty-rossii/noch-na-kure/`) while the page reads its own head component (`BaptistyRossiiDvaSezda1884PageHead.astro:28` = `2026-06-03`); equal dates fall through to `localeCompare` at `:96`. Named current manifestation of `METADATA-SSOT-PROLIFERATION`; repair the date **source**, not editorial values (`data/editorial-metadata.json` policy `editorial-time-is-not-build-time`). Evidence: `incoming/arena-bugverifikator/2026-08-19/ARENA_FULL_SURFACE_PASS_2026-08-19.md` §2.1, `reverify/CURRENT_HEAD_REVERIFY_2026-08-19_arena-bugverifikator-6-row-disposition-cb3681e.md` §8. | HEAD cb3681e + live |
| `APP-MASK-NO-WEBKIT-FALLBACK` | `/app/` (Telegram Mini App landing added by Product #1725) and `/map/` emit `mask-image` with no `-webkit-mask-image` pair: `src/pages/app/index.astro:138`, `src/components/map/MapStyles.astro:255,451`; the published bundle `/_astro/index.FPviil9R.css` contains zero `-webkit-mask` occurrences, while project convention pairs them everywhere else (`HomeMain.astro:103-104`, `css/home.css:606-607`, `css/floating-cluster.css:1285`). On WebKit < 15.4 the gradient mask is ignored and the decorative `body::before` grid stops fading; the surface is the Mini App entry point where old iOS WebKit share is highest. Additive 3-line fix. Evidence: `incoming/arena-bugverifikator/2026-08-19/ARENA_FULL_SURFACE_PASS_2026-08-19.md` §2.3. | HEAD cb3681e + artifact |
| `SECURITY-CSP-GAPS` | Reworded/narrowed: source-confirmed CSP-less surfaces are BaseLayout pages `/hard-texts/genesis-6/` and `/izbrannoe/`. `/app/` and `/rodosloviye/` are CSP-less in cb3681e source but **CSP-present in live + committed artifact** (source-vs-artifact divergence) — do not cite them as live gaps. Article pilots all have CSP. | HEAD cb3681e |


## VERIFIED NECESSARY IMPROVEMENTS — 0

| ID | Required improvement | Boundary |
|---|---|---|


## NARROWED RESIDUALS — 3

| ID | Current residual | Boundary |
|---|---|---|
| `SW-PWA-FRESHNESS` | **Narrowed:** pages using `assetUrl()` (all Astro components via `ReaderPreferencesHead`) emit `?v=<hash>` URLs → `isRevisioned()` → `revisionedStaticNetworkFirst` (network-first). Original broad claim partially mitigated. **Residual:** bare precache entry `/js/reader-preferences.js` at sw.js L44 has no `?v=`; if hit unversioned (old SW, direct nav, legacy page) → `cacheFirst` stale. Fix: remove bare precache entry or stamp `?v=` at build time. Evidence: `incoming/2026-07-17-arena-agent-audit-pass-wave5.md`. Independent live corroboration 2026-08-19 (arena-bugverifikator): **84 of 84** live pages request runtime JS revisioned (`/js/reader-preferences.js?v=63b588b5`, `reader-state.js?v=b3deb501`, …), so no current live path reaches the bare precache entry — the residual is latent, triggered only by an unversioned request. | HEAD cb3681e + live |
| `AR-IDX-JS-02-MULTIWRITER` | Multi-writer surface for theme persistence. `enhancements.js` and `site.js` write to legacy `theme` key, conflicting with canonical `reader-preferences.js` owner. | HEAD cb3681e |
| `MISSING-BUTTON-TYPE` | **Full sitewide scan verified (543 files):** 20 files, 47 `<button>` elements without `type=` in `src/**/*.astro` and `src/**/*.tsx`. Patterns: FAQ accordion ×14 (KodDaVinchi, Hermenevtika, Krajne bodies), genealogy/rail/nav controls ×12 (GenealogyTree.tsx, GillSeriesRail, GillPartTocOverlay), mobile-menu-btn ×11 (NagornayaChrome ×7 copy-paste cluster, HardTexts, PastorSeries, NagornayaSeriya), theme-toggle ×7, scroll-top ×2, back-nav ×1. Evidence: `incoming/2026-07-17-sitewide-btn-type-evidence.md`; full instance list: `verification/2026-07-17-sitewide-btn-type-audit.md`. **Latent, not a behavioural defect on `cb3681e`:** independent live witness counts 226 type-less `<button>` on 63 of 84 pages, of which **0 sit inside a `<form>`** and none carry a `form=` attribute, so no implicit submit can fire today; the risk materialises the first time such a button is wrapped in a form. See `incoming/2026-08-19-comment-missing-button-type.md`. | HEAD cb3681e + live |


## SYSTEM VERIFICATION LANES — 3

| ID | Verified work package | Next boundary |
|---|---|---|
| `SITEWIDE-BTN-TYPE-AUDIT` | Full sitewide scan completed at cb3681e (543 `src/` files): **20 files, 47 `<button>` elements missing `type=`**. Patterns verified: FAQ accordion ×14 across 3 article Body components; genealogy/rail/nav controls ×12 (GenealogyTree.tsx, GillSeriesRail, GillPartTocOverlay); mobile-menu-btn ×11 (NagornayaChrome ×7 copy-paste cluster + HardTexts + PastorSeries + NagornayaSeriya); theme-toggle ×7; scroll-top ×2; back-nav ×1. Evidence: `incoming/2026-07-17-sitewide-btn-type-evidence.md`. Full instance list: `verification/2026-07-17-sitewide-btn-type-audit.md`. | Add `type="button"` at the shared-component level (not 47 point edits) and close the class with a guard script, otherwise the `NagornayaChrome ×7` copy-paste cluster returns; re-run full scan at fix anchor; zero hits. Live cross-check 2026-08-19: 226 rendered instances, 0 inside a `<form>` — hygiene/robustness lane, not a current submit bug. Retire lane on clean pass. |
| `METADATA-SSOT-PROLIFERATION` | Centralize metadata (series labels, author roles, nav labels) from layout/nav hardcode into `site.ts` SSOT consumed by all layouts/nav. Feeds `SERIES-ORDER-INDEX-MISMATCH` (data), `EDITORIAL-LABEL-INCONSISTENCY`. Note: the original `ArticleLayout.seriesNames` carrier is dead code on cb3681e — the live series engine is `seriesConfig.ts`/`gillSeriesData.ts`. | Verify removal of hardcode + that the active series engine and Header read the SSOT. Measurable date criterion added 2026-08-19: page, `sitemap.xml`, `feed.xml` and `data/search-manifest.json` resolve editorial dates from one source, and `data/editorial-metadata.json` holds **0** records with `reviewStatus: inconsistent-needs-review` (currently 43/43; `sitemap lastmod` ≠ JSON-LD `dateModified` on 40 routes). Now also feeds `RSS-SERIES-DATE-COLLAPSE`. |
| `FRAGMENTED-SECURITY-OWNERSHIP` | Centralize CSP generation into one unified security head emitting CSP + `X-Content-Type-Options` consistently; shared `img-src` allowlist; cover the BaseLayout CSP-less surfaces in source. Absorbs `SECURITY-CSP-INCONSISTENCY` and the narrowed `SECURITY-CSP-GAPS`. | Unified security head; source-vs-live CSP divergence closed. |

## OWNER DECISIONS — 0

| ID | Missing decision |
|---|---|

## Removed in this wave
- `GENEALOGY-ID-INVALID-SPACE` — closed-by-fix: leading space removed from `data/genealogy/genealogy.json` L1395 + children ref L403. Product commit: `fa0a0fe6de4a`.
- `SERIES-ORDER-INDEX-MISMATCH` — closed-by-fix: `GILL_SERIES_ITEMS` array corrected in `gillSeriesData.ts` — part3/chast-3-nasledie → roman III, part4/chast-4-ekzeget → roman IV. Product commit: `0a7f0ca43545`.
- `SEARCH-LAZY-LOADER-DRIFT` — closed-by-fix: Pattern B (5 files) migrated from hardcoded `v=106d65f6` to `assetUrl()` + define:vars; Pattern C (HardTextsPageChrome) converted from eager to lazy IIFE. Product commits: `b0a3ec76`, `b048270483b8`, `5dbc416c`, `260bbe45`, `58621aa3`, `71ff491c`. Residual: Pattern B files now use `assetUrl()` — canonical. Lane `SEARCH-LAZY-LOADER-DRIFT` can be retired.

- `ARTICLE-AUTHOR-HARDCODED` — invalid: `ArticleLayout.astro` is orphaned dead code at cb3681e; zero `src/pages/` files import it. No live defect. Evidence: `incoming/2026-07-17-arena-agent-audit-pass-wave4.md`.
 (provenance in CLOSURE_LEDGER.md + incoming/bugverifikator/2026-08-19/)

- `ANCESTOR-TRACING-INCOMPLETE` — stale (closed-by-fix, multiparent lane; live code matches the originally proposed fix).
- `UI-DUPLICATE-SEARCH-BUTTONS` — stale (Header and ReaderPreferencesHead on disjoint route sets on cb3681e; absent in committed artifact; search lane reworked).
- `ARTICLE-LAYOUT-SERIES-HARDCODE` — invalid (dead-code carrier `ArticleLayout.astro`; zero `src/` importers; symptom not in production artifact).
- `METADATA-FUTURE-DATED` — invalid as framed (2026-08-17 is in the past vs the repository's effective today ≈2026-08-19; the original "future" claim relied on a shell clock contradicting repo material timestamps). Literal-date concern parked in `WORK_QUEUE.md`.

## Re-retired 2026-08-19-c (accidental resurrection)

- `MOBILE-CHROME-REGISTRY-GAPS` and `MOBILECHROME-GENESIS6-BAR-DECISION` were retired by consolidation wave `2026-08-19-b` (closed-by-fix / decision no longer blocking) and reappeared in the `bb7bd81` matrix rewrite, whose commit message does not mention them. No new evidence argues they are current: all six Genesis-6 article routes still render `mobile-bottom-bar` on live at `cb3681e`. Removed again; if any agent holds a current witness to the contrary, re-admit with that witness attached.

## Terminal disposition

The matrix may be empty. Admit a row only after signal classification, exact-anchor applicability, current necessity and ownership are established. Remove solved, stale, duplicate, absorbed and superseded rows in the same closure transaction. This wave re-anchored all retained rows to cb3681e; a later Product `main` advance requires a fresh current-check before any retained row is cited as current admission witness.


