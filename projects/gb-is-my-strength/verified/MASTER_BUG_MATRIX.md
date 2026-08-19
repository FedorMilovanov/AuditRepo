# MASTER BUG MATRIX — gb-is-my-strength

> SSOT for current verified necessary work only. This is not a history table or a mirror of every source-repository signal.
>
> Boundary: Product `main` **cb3681e** (2026-08-19). Consolidation wave **2026-08-19-b** (arena-bugverifikator) applied intake evidence from `incoming/arena-bugverifikator/2026-08-19/` (PR #339) on top of the earlier same-day re-anchor wave. Closed/stale/invalid/accepted rows left MASTER in this wave; provenance is in `CLOSURE_LEDGER.md` and the intake package.

## Current state

| Field | Value |
|---|---|
| Active work units | **14** |
| Direct current defects | **7** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **4** |
| System verification lanes | **3** |
| Owner decisions | **0** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

> Row arithmetic: 7 defects + 0 improvements + 4 residuals + 3 system lanes + 0 owner decisions = 14 active rows. Within these, `SECURITY-CSP-INCONSISTENCY` is kept in CURRENT DEFECTS only as the named absorbed manifestation of `FRAGMENTED-SECURITY-OWNERSHIP` (its real owner is the system lane). `TRACE-GOLDEN-PATH-PERF` is parked in `WORK_QUEUE.md` and is intentionally **not** an active MASTER row. Gill slug/ordinal hygiene after the accepted display reorder may live only in Work Queue as optional docs — not as a defect.

## CURRENT DEFECTS — 7

| ID | Current problem | Boundary |
|---|---|---|
| `RODOSLOVIYE-OG-IMAGE` | `/rodosloviye/` head uses the `/karty/` OG/Twitter image (`og-karty-1200x630.webp`) while `og:image:alt` describes родословие; asset and context disagree. Confirmed source + live + committed artifact (3 angles). Reconfirmed 2026-08-19-b. | HEAD cb3681e |
| `GENEALOGY-CHILDREN-UNRESOLVED` | `data/genealogy/genealogy.json` lists **59** `children[]` entries whose IDs are absent from `persons[]` (58 unique), including high-value names (`ishmael`, `haran`, `dinah`, sons of Moses/Aaron/Jesse, Table-of-Nations stubs). Layout/nav silently drop unresolved children via `byId.has` / id-set guards. Dataset `_status` overclaims («children arrays consistent», «0 orphan references») while only parent-direction orphans were cleared. | HEAD cb3681e |
| `GENEALOGY-NO-ERROR-BOUNDARY` | `GenealogyTree.tsx` React island has no `ErrorBoundary`; a runtime throw yields a blank/uncerrored surface. Source-only (no runtime crash reproduced yet). | HEAD cb3681e |
| `GENEALOGY-ID-INVALID-SPACE` | Leading space in ID `" lud_shem"` in `data/genealogy/genealogy.json` (L1395) + matching ref in Shem `children` (L403); `byId` Map keyed by exact id. Space is currently self-consistent (id↔ref) so latent, not a visible break today; graph-integrity invariant violated. Impact medium-low. | HEAD cb3681e |
| `EDITORIAL-LABEL-INCONSISTENCY` | `Header.astro` nav label for `/hard-texts/` is "Разбор заблуждений" while `site.ts` `SECTION_META['hard-texts']` canonical label is "Трудные тексты". Reconfirmed live 2026-08-19-b. | HEAD cb3681e |
| `SECURITY-CSP-INCONSISTENCY` | 4 distinct `img-src` variants coexist across 61 CSP-bearing heads; fragmentation of per-head hand-written CSP. **Absorbed symptom of `FRAGMENTED-SECURITY-OWNERSHIP`** (kept here only as the named manifestation; `'self'` already covers same-origin `gospod-bog.ru`, so no proven image breakage — defect is inconsistency, not a functional break). | HEAD cb3681e |
| `SECURITY-CSP-GAPS` | Reworded/narrowed: source-confirmed CSP-less surfaces are BaseLayout pages `/hard-texts/genesis-6/` and `/izbrannoe/`. `/app/` and `/rodosloviye/` are CSP-less in cb3681e source but **CSP-present in live + committed artifact** (source-vs-artifact divergence) — do not cite them as live gaps. Article pilots all have CSP. | HEAD cb3681e |


## VERIFIED NECESSARY IMPROVEMENTS — 0

| ID | Required improvement | Boundary |
|---|---|---|


## NARROWED RESIDUALS — 4

| ID | Current residual | Boundary |
|---|---|---|
| `SW-PWA-FRESHNESS` | **Narrowed:** pages using `assetUrl()` (all Astro components via `ReaderPreferencesHead`) emit `?v=<hash>` URLs → `isRevisioned()` → `revisionedStaticNetworkFirst` (network-first). Original broad claim partially mitigated. **Residual:** bare precache entry `/js/reader-preferences.js` at sw.js L44 has no `?v=`; if hit unversioned (old SW, direct nav, legacy page) → `cacheFirst` stale. Fix: remove bare precache entry or stamp `?v=` at build time. Evidence: `incoming/2026-07-17-arena-agent-audit-pass-wave5.md`. | HEAD cb3681e |
| `AR-IDX-JS-02-MULTIWRITER` | Multi-writer surface for theme persistence. `enhancements.js` and `site.js` write to legacy `theme` key, conflicting with canonical `reader-preferences.js` owner. Reconfirmed 2026-08-19-b. | HEAD cb3681e |
| `MISSING-BUTTON-TYPE` | **Full sitewide scan verified (543 files):** 20 files, 47 `<button>` elements without `type=` in `src/**/*.astro` and `src/**/*.tsx`. Patterns: FAQ accordion ×14 (KodDaVinchi, Hermenevtika, Krajne bodies), genealogy/rail/nav controls ×12 (GenealogyTree.tsx, GillSeriesRail, GillPartTocOverlay), mobile-menu-btn ×11 (NagornayaChrome ×7 copy-paste cluster, HardTexts, PastorSeries, NagornayaSeriya), theme-toggle ×7, scroll-top ×2, back-nav ×1. Evidence: `incoming/2026-07-17-sitewide-btn-type-evidence.md`; full instance list: `verification/2026-07-17-sitewide-btn-type-audit.md`. | HEAD cb3681e |
| `SEARCH-LAZY-LOADER-DRIFT` | **Verified (wave6):** 3 coexisting patterns. Pattern B (5 files): `PastorSeriesPageChrome`, `AboutPageChrome`, `NagornayaSeriyaBody`, `HermenevtikaBody`, `GillSeriesChrome` embed hardcoded lazy IIFE with literal `v=106d65f6` — matches `ASSET_VERSIONS` today but bypasses `assetUrl()`; will serve stale hash on next `cache-bust.js` run. Pattern C (1 file): `HardTextsPageChrome` uses `assetUrl()` but loads `search.js` **eagerly** (~31KB every page load, no Ctrl+K gate). Pattern A (`BaseLayout.astro`) is canonical — lazy + `assetUrl()`. Evidence: `incoming/2026-07-17-arena-agent-audit-pass-wave6.md`. | HEAD cb3681e |

## SYSTEM VERIFICATION LANES — 3

| ID | Verified work package | Next boundary |
|---|---|---|
| `SITEWIDE-BTN-TYPE-AUDIT` | Full sitewide scan completed at cb3681e (543 `src/` files): **20 files, 47 `<button>` elements missing `type=`**. Patterns verified: FAQ accordion ×14 across 3 article Body components; genealogy/rail/nav controls ×12 (GenealogyTree.tsx, GillSeriesRail, GillPartTocOverlay); mobile-menu-btn ×11 (NagornayaChrome ×7 copy-paste cluster + HardTexts + PastorSeries + NagornayaSeriya); theme-toggle ×7; scroll-top ×2; back-nav ×1. Evidence: `incoming/2026-07-17-sitewide-btn-type-evidence.md`. Full instance list: `verification/2026-07-17-sitewide-btn-type-audit.md`. | Add `type="button"` to all 47 instances; re-run full scan at fix anchor; zero hits. Retire lane on clean pass. |
| `METADATA-SSOT-PROLIFERATION` | Centralize metadata (series labels, author roles, nav labels) from layout/nav hardcode into `site.ts` SSOT consumed by all layouts/nav. Feeds `EDITORIAL-LABEL-INCONSISTENCY`. Note: orphan `ArticleLayout`/`SeriesArticleLayout` + `SERIES_ORDER` are dead carriers on cb3681e — live series engines are pilot configs (`gillSeriesData.ts` / `seriesConfig.ts` / Genesis-6 config). Optional cleanup: delete or quarantine dead layouts so consistency scripts stop treating them as runtime owners. | Verify removal of hardcode + that the active series engine and Header read the SSOT. |
| `FRAGMENTED-SECURITY-OWNERSHIP` | Centralize CSP generation into one unified security head emitting CSP + `X-Content-Type-Options` consistently; shared `img-src` allowlist; cover the BaseLayout CSP-less surfaces in source. Absorbs `SECURITY-CSP-INCONSISTENCY` and the narrowed `SECURITY-CSP-GAPS`. | Unified security head; source-vs-live CSP divergence closed. |

## OWNER DECISIONS — 0

| ID | Missing decision |
|---|---|


## Removed in consolidation wave 2026-08-19-b

Evidence package: `incoming/arena-bugverifikator/2026-08-19/` (PR #339). Ledger: `CLOSURE_LEDGER.md` entry same date.

- `SERIES-ORDER-INDEX-MISMATCH` — **accepted-product-state / invalid as defect.** Intentional 2026-07-09 Gill display reorder: product audit `scripts/gill-series-data-consistency-audit.js` locks `expectedOrder = [context,part1,part2,part4,part3,spravochnik]` with part4 display «III / Экзегет» before part3 «IV / Наследие». Live titles/nav match. Optional slug↔ordinal hygiene only in Work Queue if desired — not a defect.
- `MOBILE-CHROME-REGISTRY-GAPS` — **closed-by-fix.** Genesis-6 articles already mount `SeriesReaderChrome → GillSeriesChrome → GillSeriesMobileBar` (static). Live Enoch/corpus/audit routes show mobile bottom bar markers.
- `MOBILECHROME-GENESIS6-BAR-DECISION` — **drop / decision no longer blocking.** Bar is already present; no owner choice remains between «wire bar» vs «plain pages».

## Prior same-day removals (2026-08-19 re-anchor wave; provenance unchanged)

- `ARTICLE-AUTHOR-HARDCODED` — invalid: `ArticleLayout.astro` orphaned dead code at cb3681e; zero `src/pages/` importers.
- `ANCESTOR-TRACING-INCOMPLETE` — stale (closed-by-fix, multiparent lane).
- `UI-DUPLICATE-SEARCH-BUTTONS` — stale (Header and ReaderPreferencesHead on disjoint route sets; search lane reworked).
- `ARTICLE-LAYOUT-SERIES-HARDCODE` — invalid (dead-code carrier).
- `METADATA-FUTURE-DATED` — invalid as framed; literal-date concern parked in `WORK_QUEUE.md`.

## Terminal disposition

The matrix may be empty. Admit a row only after signal classification, exact-anchor applicability, current necessity and ownership are established. Remove solved, stale, duplicate, absorbed and superseded rows in the same closure transaction. Retained rows remain anchored at cb3681e; a later Product `main` advance requires a fresh current-check before any retained row is cited as current admission witness.
