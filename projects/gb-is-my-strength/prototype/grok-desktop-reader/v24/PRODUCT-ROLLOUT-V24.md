# V24 adoption plan — additive, reversible, non-destructive

## Gate 0: authority and collision check (before changing Product)

Read latest `FedorMilovanov/gb-is-my-strength` `main`, `docs/LANE_LOCK_POLICY.md`, all open Product PRs/branches and writer owners, exact CI and live release SHA. Current recorded Product `main@717efc54772edf4224f44254651c102e2af24129` includes merged library V3 [#2283](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2283); do NOT keep telling agents to await its merge. At recorded snapshot CI had five in-progress workflows (Deploy Pages, Site Sections Menu, Reader Controls Accessibility, Visual Parity, Runtime Interactive Audit); refresh and only then mark terminal status. Print [#2269](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2269) remains separately owned.

## Gate 1: immutable real-site baseline

At exact Product SHA, capture DOM and screenshots from a *true standalone hermeneutics article*, current Gill context/article, Baptist book article and one unaffected control route, not demo content. Verify at 1480×900 and 900×480, with 320/390 mobile for **non-regression**. Record full/collapsed state, 4 vertical SVG actions, all 3 themes, mid-article anchor, multi-line active card, menu/settings/library/search, print, original leather labels, text-axis coordinates, exact current `partToc` anchor IDs/order and true release source. Do not compare a plain `astro build` if Product's publication path includes other steps.

## Gate 2: pure adapter only

Implement a *read-only* projection from current `SeriesConfig`/registered `partToc` into a typed unified tree. Test book chapter/article/H2/H3/H4, flat cycles, standalone, intro/reference/satellites, missing/duplicate/out-of-order anchors and heading jumps. Never infer href from display title, renumber stable Gill URLs or delete historical `#sec-gill-last-pages`. No second content registry.

## Gate 3: bounded desktop renderer behind rollback flag

Introduce ONE common deskop tree presentation inside the current `ReaderRail`, `GillSeriesRail` and family-owned wrappers using route-scoped flag. Keep old HTML/CSS fallback, no mass swap, no global breakpoint copied from V24 fixture (781px is a *prototype* choice). Use CSS variables per `data-series-theme`; preserve original Gill ribbon and four upper-right vertical controls. Do not globally delete existing rules while consumers remain. Inactive view must be truly inert/hidden without duplicate IDs or controls.

## Gate 4: reuse canonical action owners

- Settings and themes: `GBReaderPreferences`; right night toggle shares previous Day/Sepia state; no extra storage.
- Search: `GBSearch` + canonical search manifest/Pagefind, contextual filter only if its contract supports it; no second modal or fake title-only search.
- Site menu: `SiteSectionsMenu` + OverlayRuntime owns focus/trap/placement; cosmetics only.
- TTS/speed: `PlayEmber` and Media Session own actual audio; no demo TTS.
- **Library V3 already merged**: `GBReaderLibrary`, `GBHighlights`, `GBFavoriteStore` own saves, reading statuses «Читаю / Прочитано / Не интересно», resume, notes/quotes and import/backup; test existing storage keys. Do not copy V24 localStorage.
- Scrollspy: keep existing reader scroll/position owner; do not import demo's wheel/RAF scroll compensation.
- Print/share: `ReaderActionsRuntime`/PrintEngine, independent print PR #2269; UI excluded from printed pages.
- Mobile: preserve exact existing source and visual behavior.

## Gate 5: release-blocking verification

Use actual repo build/deploy and scripts available at current head: `npm run validate:static-publication`, engine contracts/guard, Gill pre-v16 submenu audit, search modal and cold bootstrap, reader focus/layout, SiteSections overlay, merged Library V3 browser tests, SW/cache-bust, TTS, print A4. Run **Chromium, WebKit, Firefox**, at representative 781/900×300/900×480/1024/1366/1480/1920, with 130% text, Day/Sepia/Night, reduced-motion, rapid reverse, keyboard ArrowDown from closed branch and no invisible focus, open/close panels near correct buttons, Back/Forward, jump to real H3/H4, content/axis/anchor parity, no horizontal overflow or 334px WebKit axis defect. Verify exact pilot PR head CI, preview and live before claiming release.

**STOP-SHIP:** missing Gill anchor, corrupted book hierarchy, text axis drift, two search/settings/save/TTS/scroll owners, mobile diff, inaccessible focus, wrong label, blank transition frames, wrong palette, lost local library/notes/backup, incomplete CI/deploy, conflict with print lane or inability to revert view safely.

## Gate 6: narrow rollout and rollback

One adapter-only step → one standalone pilot → Gill + Baptist sample pilots after visual review → per-family acceptance → wider desktop rollout. Rollback by disabling flag; **do not mass-revert unrelated Library V3 or print changes**. Only retire legacy CSS after a consumer search and production witness. A Product PR merge is not production proof. Update AuditRepo evidence/MASTER only with measured current Product status; leave prior V22/V23 available as history.
