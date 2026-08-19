# MASTER BUG MATRIX — gb-is-my-strength

> SSOT for current verified necessary work only. This is not a history table or a mirror of every source-repository signal.
>
> Re-anchored to Product `main` **cb3681e** (2026-08-19) by the 2026-08-19 post-advance reverify wave. Rows previously anchored at `485db8c` were re-checked against cb3681e + live + committed production artifacts. Closed/stale/invalid/absorbed rows were removed in the same consolidation wave; their provenance lives in `CLOSURE_LEDGER.md`, `verification/`, `incoming/bugverifikator/2026-08-19/` and Git history.

## Current state

| Field | Value |
|---|---|
| Active work units | **16** |
| Direct current defects | **7** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **5** |
| System verification lanes | **3** |
| Owner decisions | **1** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

> Row arithmetic: 7 defects + 0 improvements + 5 residuals + 3 system lanes + 1 owner decision = 16 active rows. Within these, `SECURITY-CSP-INCONSISTENCY` is kept in CURRENT DEFECTS only as the named absorbed manifestation of `FRAGMENTED-SECURITY-OWNERSHIP` (its real owner is the system lane). `TRACE-GOLDEN-PATH-PERF` is parked in `WORK_QUEUE.md` and is intentionally **not** an active MASTER row.

## CURRENT DEFECTS — 7

| ID | Current problem | Boundary |
|---|---|---|
| `RODOSLOVIYE-OG-IMAGE` | `/rodosloviye/` head uses the `/karty/` OG/Twitter image (`og-karty-1200x630.webp`) while `og:image:alt` describes родословие; asset and context disagree. Confirmed source + live + committed artifact (3 angles). | HEAD cb3681e |
| `SERIES-ORDER-INDEX-MISMATCH` | Gill series inverts Part 3/Part 4: `gillSeriesData.ts` `GILL_SERIES_ITEMS` orders `part4` before `part3` and labels part4 `III` / part3 `IV`; live + artifact show distorted in-series nav (part4→next part3). Impact medium. **Root is `gillSeriesData.ts`, not `site.ts` `SERIES_ORDER` (dead code).** | HEAD cb3681e |
| `GENEALOGY-NO-ERROR-BOUNDARY` | `GenealogyTree.tsx` React island has no `ErrorBoundary`; a runtime throw yields a blank/uncerrored surface. Source-only (no runtime crash reproduced yet). | HEAD cb3681e |
| `GENEALOGY-ID-INVALID-SPACE` | Leading space in ID `" lud_shem"` in `data/genealogy/genealogy.json` (L1395) + matching ref in Shem `children` (L403); `byId` Map keyed by exact id. Space is currently self-consistent (id↔ref) so latent, not a visible break today; graph-integrity invariant violated. Impact medium-low. | HEAD cb3681e |
| `EDITORIAL-LABEL-INCONSISTENCY` | `Header.astro` nav label for `/hard-texts/` is "Разбор заблуждений" while `site.ts` `SECTION_META['hard-texts']` canonical label is "Трудные тексты". | HEAD cb3681e |
| `SECURITY-CSP-INCONSISTENCY` | 4 distinct `img-src` variants coexist across 61 CSP-bearing heads; fragmentation of per-head hand-written CSP. **Absorbed symptom of `FRAGMENTED-SECURITY-OWNERSHIP`** (kept here only as the named manifestation; `'self'` already covers same-origin `gospod-bog.ru`, so no proven image breakage — defect is inconsistency, not a functional break). | HEAD cb3681e |
| `SECURITY-CSP-GAPS` | Reworded/narrowed: source-confirmed CSP-less surfaces are BaseLayout pages `/hard-texts/genesis-6/` and `/izbrannoe/`. `/app/` and `/rodosloviye/` are CSP-less in cb3681e source but **CSP-present in live + committed artifact** (source-vs-artifact divergence) — do not cite them as live gaps. Article pilots all have CSP. | HEAD cb3681e |


## VERIFIED NECESSARY IMPROVEMENTS — 0

| ID | Required improvement | Boundary |
|---|---|---|


## NARROWED RESIDUALS — 5

| ID | Current residual | Boundary |
|---|---|---|
| `SW-PWA-FRESHNESS` | **Narrowed:** pages using `assetUrl()` (all Astro components via `ReaderPreferencesHead`) emit `?v=<hash>` URLs → `isRevisioned()` → `revisionedStaticNetworkFirst` (network-first). Original broad claim partially mitigated. **Residual:** bare precache entry `/js/reader-preferences.js` at sw.js L44 has no `?v=`; if hit unversioned (old SW, direct nav, legacy page) → `cacheFirst` stale. Fix: remove bare precache entry or stamp `?v=` at build time. Evidence: `incoming/2026-07-17-arena-agent-audit-pass-wave5.md`. | HEAD cb3681e |
| `MOBILE-CHROME-REGISTRY-GAPS` | Narrowed: pastor-series articles are covered via `SeriesReaderChrome → GillSeriesChrome → GillSeriesMobileBar` (static mount). Residual = Genesis-6 article pages (`/hard-texts/enoh-…`, `/kniga-enoha-…`, `/mozhno-li-doveryat-1-enohu-…`) render via `Genesis6ArticlePage` and mount no mobile bottom bar. Whether a bar is required there is the owner decision below. | HEAD cb3681e |
| `AR-IDX-JS-02-MULTIWRITER` | Multi-writer surface for theme persistence. `enhancements.js` and `site.js` write to legacy `theme` key, conflicting with canonical `reader-preferences.js` owner. | HEAD cb3681e |
| `MISSING-BUTTON-TYPE` | **Full sitewide scan verified (543 files):** 20 files, 47 `<button>` elements without `type=` in `src/**/*.astro` and `src/**/*.tsx`. Patterns: FAQ accordion ×14 (KodDaVinchi, Hermenevtika, Krajne bodies), genealogy/rail/nav controls ×12 (GenealogyTree.tsx, GillSeriesRail, GillPartTocOverlay), mobile-menu-btn ×11 (NagornayaChrome ×7 copy-paste cluster, HardTexts, PastorSeries, NagornayaSeriya), theme-toggle ×7, scroll-top ×2, back-nav ×1. Evidence: `incoming/2026-07-17-sitewide-btn-type-evidence.md`; full instance list: `verification/2026-07-17-sitewide-btn-type-audit.md`. | HEAD cb3681e |
| `SEARCH-LAZY-LOADER-DRIFT` | **Verified (wave6):** 3 coexisting patterns. Pattern B (5 files): `PastorSeriesPageChrome`, `AboutPageChrome`, `NagornayaSeriyaBody`, `HermenevtikaBody`, `GillSeriesChrome` embed hardcoded lazy IIFE with literal `v=106d65f6` — matches `ASSET_VERSIONS` today but bypasses `assetUrl()`; will serve stale hash on next `cache-bust.js` run. Pattern C (1 file): `HardTextsPageChrome` uses `assetUrl()` but loads `search.js` **eagerly** (~31KB every page load, no Ctrl+K gate). Pattern A (`BaseLayout.astro`) is canonical — lazy + `assetUrl()`. Evidence: `incoming/2026-07-17-arena-agent-audit-pass-wave6.md`. | HEAD cb3681e |

## SYSTEM VERIFICATION LANES — 3

| ID | Verified work package | Next boundary |
|---|---|---|
| `SITEWIDE-BTN-TYPE-AUDIT` | Full sitewide scan completed at cb3681e (543 `src/` files): **20 files, 47 `<button>` elements missing `type=`**. Patterns verified: FAQ accordion ×14 across 3 article Body components; genealogy/rail/nav controls ×12 (GenealogyTree.tsx, GillSeriesRail, GillPartTocOverlay); mobile-menu-btn ×11 (NagornayaChrome ×7 copy-paste cluster + HardTexts + PastorSeries + NagornayaSeriya); theme-toggle ×7; scroll-top ×2; back-nav ×1. Evidence: `incoming/2026-07-17-sitewide-btn-type-evidence.md`. Full instance list: `verification/2026-07-17-sitewide-btn-type-audit.md`. | Add `type="button"` to all 47 instances; re-run full scan at fix anchor; zero hits. Retire lane on clean pass. |
| `METADATA-SSOT-PROLIFERATION` | Centralize metadata (series labels, author roles, nav labels) from layout/nav hardcode into `site.ts` SSOT consumed by all layouts/nav. Feeds `SERIES-ORDER-INDEX-MISMATCH` (data), `EDITORIAL-LABEL-INCONSISTENCY`. Note: the original `ArticleLayout.seriesNames` carrier is dead code on cb3681e — the live series engine is `seriesConfig.ts`/`gillSeriesData.ts`. | Verify removal of hardcode + that the active series engine and Header read the SSOT. |
| `FRAGMENTED-SECURITY-OWNERSHIP` | Centralize CSP generation into one unified security head emitting CSP + `X-Content-Type-Options` consistently; shared `img-src` allowlist; cover the BaseLayout CSP-less surfaces in source. Absorbs `SECURITY-CSP-INCONSISTENCY` and the narrowed `SECURITY-CSP-GAPS`. | Unified security head; source-vs-live CSP divergence closed. |

## OWNER DECISIONS — 1

| ID | Missing decision |
|---|---|
| `MOBILECHROME-GENESIS6-BAR-DECISION` | Do Genesis-6 article pages require a mobile bottom bar? (a) wire `Genesis6ArticlePage` to a mobile bar → convert `MOBILE-CHROME-REGISTRY-GAPS` to a repair lane; (b) leave as plain long-form reader pages → drop the residual as accepted. Owner value/editorial decision; blocks whether the residual becomes work. Evidence: `incoming/bugverifikator/2026-08-19/COMMENT_pass4_MOBILECHROME-REGISTRY-GAPS.md`, `incoming/bugverifikator/2026-08-19/REPORT.md`. |

## Removed in this wave
- `ARTICLE-AUTHOR-HARDCODED` — invalid: `ArticleLayout.astro` is orphaned dead code at cb3681e; zero `src/pages/` files import it. No live defect. Evidence: `incoming/2026-07-17-arena-agent-audit-pass-wave4.md`.
 (provenance in CLOSURE_LEDGER.md + incoming/bugverifikator/2026-08-19/)

- `ANCESTOR-TRACING-INCOMPLETE` — stale (closed-by-fix, multiparent lane; live code matches the originally proposed fix).
- `UI-DUPLICATE-SEARCH-BUTTONS` — stale (Header and ReaderPreferencesHead on disjoint route sets on cb3681e; absent in committed artifact; search lane reworked).
- `ARTICLE-LAYOUT-SERIES-HARDCODE` — invalid (dead-code carrier `ArticleLayout.astro`; zero `src/` importers; symptom not in production artifact).
- `METADATA-FUTURE-DATED` — invalid as framed (2026-08-17 is in the past vs the repository's effective today ≈2026-08-19; the original "future" claim relied on a shell clock contradicting repo material timestamps). Literal-date concern parked in `WORK_QUEUE.md`.

## Terminal disposition

The matrix may be empty. Admit a row only after signal classification, exact-anchor applicability, current necessity and ownership are established. Remove solved, stale, duplicate, absorbed and superseded rows in the same closure transaction. This wave re-anchored all retained rows to cb3681e; a later Product `main` advance requires a fresh current-check before any retained row is cited as current admission witness.


