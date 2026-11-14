> **V24 SUPERSESSION — 2026-11-06:** See [current V24 integration plan](v24/PRODUCT-ROLLOUT-V24.md) before using the historical V23 plan below. Product PR #2283 merged into main@717efc54772edf4224f44254651c102e2af24129. Recheck CI and live. Any "wait for #2283 merge" below is historical and no longer actionable. V24 adds focus-in-inert, keyboard, empty-search and motion fixes.

# Safe Product rollout: V23 design into existing components, not a rewrite

## 0. Collision/lane preflight (stop-ship if unresolved)

Read Product docs/LANE_LOCK_POLICY.md, current main, open PR diffs, writer leases and route ownership. On 2026-11-06 Product #2283 library v3 touched GillSeriesChrome, standalone/Baptist shells and reader-library scripts; #2269 owned print. Recheck status, do not modify a conflicting owner's files or create duplicate branches. AuditRepo active MASTER and other agents' PRs are separate owners.

## 1. Baseline BEFORE mutation

For current Product SHA take Chromium/WebKit baseline screenshots and DOM witnesses at *real* routes: hermeneutics standalone, John Gill historical context and an actual Baptist book article resolved from route registry. Capture full/compact reader, active H2/H3, context menu, settings, global search, print, TTS/save, 1480×900 and 900×480. Take 320/390 mobile baselines for NON-REGRESSION only. Record anchor/partToc census and reader-axis rectangles.

## 2. Minimum added code

- Pure read-only SeriesConfig/partToc → hierarchical nav adapter (book/flat/standalone; H2–H6, labels, satellites), with duplicate/missing anchor and order tests.
- ONE shared route-scoped desktop tree renderer; optional pilot flag selecting old or Grok view INSIDE existing ReaderRail/GillSeriesRail/series owners. Avoid rewriting page wrappers.
- Scoped design tokens per data-series-theme. The common tree logic is not copied to family-specific CSS.
- Bind existing action owners: SiteSectionsMenu/OverlayRuntime, GBReaderPreferences and existing setting sheets, GBSearch, PlayEmber, SaveButton/library PR #2283, ReaderActionsRuntime PrintEngine/share. No second storage, search, modal, TTS or scroll engine.

DO NOT directly port standalone prototype localStorage, fake voice control, JS searchDataset, JavaScript scroll compensation, or a global CSS breakpoint; those are demonstration substitutes and may conflict with Product lifecycle.

## 3. Release-gating tests

- Actual production-like Astro/dist pipeline, asset/cache/service worker and print pages; do not rely on plain astro build for preservation.
- npm run engine:contracts; npm run engine:guard (dist prerequisites); npm run data:consistency; node scripts/gill-pre-v16-submenu-regression-audit.js; browser overlay/search/reader/print contracts as applicable.
- Chromium, WebKit and Firefox, responsive 320/390/781/900×300/900×480/1024/1366/1480/1920; 130% font, wide measure, all theme modes, reduced motion, partial scroll, rapid rail toggles, Escape, Popstate/Back/Forward, keyboard arrows/Tab, deep H4 navigation and long Cyrillic labels.
- At transition time check inert/aria-hidden immediately after group collapse and no invisible focus. Animate from current height on reversal.
- Verify no disappearing Gill anchor e.g. #sec-gill-last-pages, no two focus/scroll owners, no 334px WebKit root overflow or reader-axis shift.
- Right 4 SVGs must stay vertical, not be printed, stay clear of article at compact desktop, and remain functional. Left bottom order/menu and anchored popovers remain canonical.
- Compare Product before/after screenshots on exact route/state; no "zero JS errors therefore premium parity" shortcut. Mobile remains unchanged.
- Exact pilot PR head CI and preview deployment before release. Roll back by turning off the narrow pilot flag, preserving old markup and unrelated fixes.

## 4. Rollout sequence

(1) Adapter tests and design-token audit, no Product UI mutation. (2) One standalone article desktop pilot. (3) Gill + Baptist representative pilot with legacy anchor/evidence parity. (4) Broader desktop family rollout only after owner accepts before/after screenshots and cross-browser test. (5) Retire old presentation CSS only when all consumers proven absent. Never delete historical references from AuditRepo.

## Current responsibility matrix

Product's current code is authoritative; check these owner surfaces directly: src/components/article-pilots/_shared/ReaderRail.astro; src/components/article-pilots/gill-series/GillSeriesRail.astro; src/components/article-pilots/_shared/series/seriesConfig.ts; src/components/article-pilots/_shared/SiteSectionsMenu.astro; js/search.js; js/reader-preferences.js; css/floating-cluster.css; original GillLeatherRibbon/GillLeatherDefs; existing reader-library PR and scripts. Do NOT edit the shared files simply because this list names them: scope/owner proof must come first.