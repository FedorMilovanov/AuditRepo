# Optional Work Queue — gb-is-my-strength

This file is for **optional improvements, measurement-first work and reverify-before-promotion candidates**, not confirmed current bugs. `verified/MASTER_BUG_MATRIX.md` is the only active problem matrix.

Before starting any lane, inspect current Product `main`, open PRs/branches and the selected owner. Historical wording or a reserved branch name alone never authorizes Product mutation.

## Selected evidence-backed candidates

### Search continuation fixture fail-closed hardening — moved from Product #1242

- Provenance: Product issue `#1242`, created from final audit of Search continuation lane `#1209`; historical exact candidate `882d90422e3e0f3703c9a339fbe7e21a54500e89`, Search Modal run `31246406392`.
- 2026-08-10 current-main reverify at Product `757946da67287354b819737813c0a47095f2d759`: **no current runtime regression was proved**. Current `js/search.js` still bounds Pagefind hydration with `Math.min(8, e.length)` and generation cancellation; the issue itself records existing Chromium/WebKit desktop/mobile continuation and stale-query coverage.
- Parked quality/test-health work only: make continuation success explicitly fail on unexpected `pageErrors` / `console.error`; instrument synthetic delayed `data()` calls with active/peak counters; use enough hits to exercise the worker pool; assert peak never exceeds 8 and preferably reaches 8 so a dead/serial fixture cannot false-green.
- Preserve deterministic fixture identity, `serviceWorkers: 'block'`, Chromium + WebKit, 1440×900 + 390×844.
- **Do not change `js/search.js` unless the strengthened witness first exposes an actual Product defect.** Reverify ownership/current implementation before promotion.

### Search first-result latency measurement — moved from Product #1243

- Provenance: Product issue `#1243`, derived from Search `#1209` forensic review; historical exact candidate `882d90422e3e0f3703c9a339fbe7e21a54500e89`.
- 2026-08-10 current-main reverify at Product `757946da67287354b819737813c0a47095f2d759`: the current Pagefind path still hydrates the full raw result array before grouping/rendering, with fan-out capped at 8, but **no material latency regression is currently demonstrated**.
- Measurement-first roadmap: deterministic 25 / 100 / 300-hit delayed-data fixtures; record query-dispatch→first-visible-window time, total hydration time, peak `data()` concurrency, calls started before first window, and stale-query cancellation while hydration is in flight.
- Establish Chromium/WebKit baselines on the production-like Search contract and actual corpus shape before choosing any budget. Do not invent a threshold from guesswork.
- If measurement later proves material latency, design a truthful progressive strategy that preserves complete/deduped result semantics; never restore hidden pre-hydration truncation merely for speed.

### TTS click-to-first-audible latency measurement

- Current reader/TTS browser coverage proves play/pause/resume, boundary progression, speed recreation, pagehide cancellation and mobile geometry, but it does not record a true utterance `onstart` / first-audible timestamp.
- Measurement-first roadmap: separately record click→UI state, click→`speechSynthesis.speak()` invocation, click→utterance `onstart`/first-audible, and worker/model readiness→playback for cold, warm and consent-gated paths.
- Run representative Chromium + WebKit desktop/mobile samples and report p50/p95/worst with route identity before defining any latency budget.
- Do not classify perceived slowness as a Product defect without a current measured failure.

### Reader narrow-tablet geometry witness

- 2026-08-11 surgical reverify: the Hermenevtika cross-browser chrome contract covers 390/412/899/900/1199/1200/1440; the shared standalone reader layout guard covers 768 plus 390/1199/1200/1280/1366/1440/1920 in Chromium.
- Remaining evidence gap: 761/800/820/860 do not yet have an equivalent fresh cross-browser geometry/focus/overlap witness.
- This is coverage work, **not a confirmed layout defect**. Promote only if an exact built/browser witness shows overflow, clipping, focus loss, unreadably narrow measure or fixed/sticky collision.

### Tooltip trigger↔popup accessibility-tree relation

- Current canonical article-tooltip owner still uses focusability/`role=button`/`aria-expanded` and reparents open popup content into a floating owner.
- The same canonical owner does not currently establish `aria-describedby`; glossary has legacy relationship behavior elsewhere, so footnote/scripture parity remains uncertain.
- Obtain a real Chromium accessibility-tree and, where practical, NVDA/VoiceOver-equivalent witness before promotion. Source shape alone is not enough to claim an AT failure.

### Glossary JS bundle ratchet reverify

- Exact #1584 Route Registry Validators head `9a8d71a5cbd546b8880072132f1d869d0ae2cf55` passed the route/sitemap/RSS/SEO/security surface and failed only because `js/glossary.js` measured 12,457 bytes against the audit's 12,000-byte hard cap.
- `js/glossary.js` changed again between that head and later current main, so the old number is not current authority.
- Re-run the same size audit on settled current main before promotion. Treat this as quality/performance ratchet work unless a reader-visible latency/download regression is measured.

### Dependency advisory/reachability reverify

- A stale-base CI install emitted an advisory summary, but the surgical pass did not establish exact current advisory IDs, dependency paths or production reachability.
- Obtain a current dependency graph/advisory report and classify dev-only/build-only/runtime reachability before any security defect is opened.
- Do not convert an advisory count into an exploitability claim.

### Owner-approved Product golden roadmap — moved from Product #298

- Provenance: Product issue `#298`; AuditRepo historical findings `VISUAL-COMMON-MODE-BLINDNESS` and `VISUAL-ROUTE-COVERAGE-NARROW`.
- Disposition on 2026-08-10: long-term quality-system roadmap, **not a fresh Product regression blocker**. Existing current legacy↔dist pixel parity remains useful migration-equivalence evidence but must not be overclaimed as immutable owner-approved product truth.
- Future architecture keeps two distinct contracts:
  1. migration parity: current legacy projection ↔ current dist;
  2. product golden regression: immutable owner-approved artifacts keyed by route family, viewport, theme, and state.
- Minimum future state matrix: initial/top; 35–50% scroll; active ReaderState/progress; open navigation/settings/search; light/dark; narrow mobile/desktop; representative ordinary article; flat series; book series; Gill reversible-card front/back. Physical print/PDF remains a separate semantic/physical contract.
- Representative routes must be selected from the effective public-surface/capability registry, not a second hardcoded route list. Shared-capability changes should select relevant state fixtures automatically.
- Golden update mode must be explicit/manual/owner-approved, record old/new artifact digests plus exact source SHA, and normal validation must remain read-only.
- Required future mutation witnesses: common-mode removal can keep migration parity green while Product golden turns red; shared reader CSS selects article + series states; normal CI cannot rewrite goldens; reports identify captured route/state/capability.
- Reverify current visual owners and cost/benefit before promotion; do not implement this system merely to reduce historical backlog count.

### Baptist authentic provenance media roadmap — moved from Product #1360

- Provenance: Product issue `#1360`; merged provenance fail-closed guard `#1350` is a guard, not visual-corpus completion.
- This is real future content/media work, **not a current code regression lane**. Preserve it until a deliberately scheduled Baptist media/content program is owned.
- Unresolved media families carried forward from the issue:
  - **«Ночь на Куре»** — historical Tiflis/Kura; Voronin / Kalveit / Delyakov; Voronin 1889-source scans;
  - **«Южная штунда»** — south-Russian German colonies; Unger / Tsimbal / Ryaboshapka / Ratushny / Pritskau; source scans;
  - **«Петербургская линия»** — Pashkov / Prokhanov / Kargel; 19th-century Petersburg; evangelical publications;
  - **Soviet night / Initiative Group / underground press** — decrees, prayer-house/repression evidence, publication covers, samizdat/printing material when rights are clear.
- Future inventory must classify every current Baptist public media slot as authentic asset, deliberate text-only/semantic graphic, or placeholder/missing media; filenames alone are not proof of completion.
- **Provenance/rights boundary:** use the existing media ledger as authority. No hotlinks, unknown license, search-engine/Pinterest/social-only provenance, or AI-generated image presented as archival evidence. Prefer already-held project MASTER/Drive material only when provenance and rights can be established; otherwise use primary archives/Wikimedia/other rights-clear sources.
- Before publication record exact source URL, rights/license, caption attribution and evidence boundary, verification date, and MASTER/SHA-256. Store local production files under existing Baptist conventions with honest dimensions/variants and no fake duplicate-resolution aliases.
- Captions must distinguish direct evidence from contextual illustration. Fact-bearing maps/diagrams remain semantic or source-verified; generated imagery must not carry unverifiable historical facts.
- Permanent ledger guard requirement: no Baptist production evidence marker without a resolving local file + HTTPS provenance + allowed license + MASTER SHA-256 + `PUBLISHED / VERIFIED` ledger row; rendered articles must not silently fall back to an untracked placeholder.
- Final future browser requirement: Chromium + WebKit, mobile/desktop, day/dark; affected images have nonzero `naturalWidth`, correct `currentSrc/srcset`, no clipping/overflow, truthful alt/caption, and no broken placeholder.
- When eventually scheduled, claim bounded media slices one at a time and recheck current active owners first.

### Karty runtime performance measurements

- Historical `PERF-P1-01`: measure current Chromium/WebKit frame/input behavior before changing the Avraam animated water effect.
- Historical `QUAL-P2-04`: MapEngine source-level node recreation does not by itself prove material GC/jank; measure long tasks/input/frame impact first.
- Older MapScale witness work is historical/terminal under the current MASTER. Reverify current owners before opening any new map-performance lane.

### Home presentation-owner convergence

- Earlier audit found multiple presentation owners, but no current reader-visible regression was proved from ownership distribution alone.
- Keep parked until a fresh browser regression, false-green contract, recurring collision or measured failure proves convergence necessary.
- Historical Home/Search harness rows are not current MASTER authority; inspect current main and MASTER before scheduling anything here.

### Baptists 3D measured split

- Historical origin: `R-005`.
- Last recorded `_app/index.html` size was 2,245,854 bytes.
- It is an explicit built app, not a removable Strangler duplicate.
- Product #1402 is an audit/measurement owner for Baptist historical media coverage; it is **not** permission to mutate Product presentation before a current defect is confirmed.

### Runtime asset revision authority — reverify before promotion

- Historical `AR-IDX-05` observed runtime-loaded CSS using a generic `SITE_CONFIG.version` bridge while assets had their own revisions.
- Promote only after a fresh stale-cache/version witness.

### Shared JS escaping primitive — reverify before promotion

- Historical `AUDIT-JS-ESCAPER-DUP-X5` observed local equivalent escaping helpers.
- Duplication alone is not a defect. Re-count current implementations and prove semantic/security/maintenance divergence before promotion.

### Bible corpus acquisition/import proof

- Historical owner-decision provenance included `SEARCH-P2-07`; it is not a current MASTER row.
- Binding Research decision is `d52ea9d54dd2c2488223d25f5f6cefd263c23328` unless explicitly superseded by newer rights authority.
- Closed-unmerged Product #1389 remains a rights-blocked attempt, not approved corpus evidence.
- CrossWire `RusSynodal` 1.9.1 remains candidate-only pending exact archive SHA-256, licence/source/book manifest, 66-book mapping and verse-level import receipt.
- `RusSynodalLIO` and Cassian restrictions remain binding until superseded by explicit rights authority.

## Current-work boundary

Current active authority lives only in `verified/MASTER_BUG_MATRIX.md`. This queue deliberately carries no copied snapshot of MASTER IDs: a duplicated list becomes stale and can resurrect already closed work. Always read fresh MASTER and current Product ownership before starting a lane.

Do not reopen historical Strangler, Lot, Source Authority, Avraam, Home Search, MapScale, genealogy, legacy mobile-nav, speed-rail or other completed families from older prose without fresh current-main evidence.

## Parked non-defect improvement families

- Home/runtime performance: `AR-IDX-PERF-01`, `AR-IDX-PERF-02`, `AR-IDX-JS-01`.
- CSS/JS budget measurements: `NEW-CSS-BUDGET-01`, `D-3`, `AUDIT-P3-OG-LCP-MISMATCH`.
- Karty runtime measurement: `PERF-P1-01`, `QUAL-P2-04`.
- Karty dormant/optional UI: `MINI-P1-01`.
- Decorative/cartographic style ideas.
- Home polish/cleanup: `AR-IDX-07`, `AR-IDX-08`, `AR-IDX-CSS-03`.
- Generic refactor wishes: `R-001`, `R-002`, `R-003`, `R-004`.
- Measured built-app split: `R-005`.
- 2026-08-19 wave parked items (from invalid/narrowed dispositions, not current defects):
  - `/app/` literal publication date — derive `publishedTime`/`modifiedTime` from build/release time instead of a hard-coded literal, so a future release cannot ship another misaligned date. (From `METADATA-FUTURE-DATED`, invalid as future-dated on cb3681e; parked as a structural cleanliness item.)
  - ReaderPreferencesHead guard — have the dynamic search-button injector bail if any `.gb-nav-search-icon` already exists, hardening against a future regression of the now-stale `UI-DUPLICATE-SEARCH-BUTTONS` overlap (Header re-wired onto a `searchOpenerRoutes` page).
  - `ArticleLayout.astro` / `SeriesArticleLayout.astro` orphan cleanup — delete the dead layouts (or re-wire as the future unified article layout if that plan is active) so audits stop reading them as live carriers. (From `ARTICLE-LAYOUT-SERIES-HARDCODE` invalid + `ARTICLE-AUTHOR-HARDCODED` pending re-check.)
  - `TRACE-GOLDEN-PATH-PERF` — refactor `traceGoldenPath` to a Map for O(1) lookups (already listed conceptually; optional, not necessary-current until a measurable scale need).
- 2026-08-19-c arena-bugverifikator parked items:
  - `GILL-SLUG-NUMBERING-LEGACY` — Gill series URLs invert their displayed part numbers (`/articles/dzhon-gill-chast-4-ekzeget/` renders «Часть III: Экзегет», `/articles/dzhon-gill-chast-3-nasledie/` renders «Часть IV: Наследие»). Content, series data, in-series navigation and the product-side `gill-series-data-consistency-audit.js` lock are mutually consistent, so this is URL semantics only; any repair needs 301 redirects plus synchronized `sitemap.xml`, `feed.xml`, `data/search-manifest.json`, canonical/OG. Cost currently exceeds benefit. (Residual of the retired `SERIES-ORDER-INDEX-MISMATCH`.)
  - `PAGEFIND-STATIC-FRESHNESS-MEASUREMENT` — measurement-first: `sw.js` serves `/pagefind/*.js|wasm` through `pagefindStaticCacheFirst` while `CACHE_VERSION` has not moved since `gb-v197-…-20260804`. Hypothesis: a returning client can pair a cached loader with a freshly rebuilt index. **No runtime witness exists**; do not touch `sw.js` before one is produced. Distinct from the `SW-PWA-FRESHNESS` residual, which owns the bare `/js/reader-preferences.js` precache entry.

## Queue hygiene

The queue may be empty. Do not copy old audit rows here merely to retain history; history already lives in verification/Git. Promote only a current formulation backed by fresh evidence. If an item is disproved, solved, superseded or not worth doing, remove it.
