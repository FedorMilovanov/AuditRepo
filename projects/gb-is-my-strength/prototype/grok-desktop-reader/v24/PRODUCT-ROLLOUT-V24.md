# Adoptive implementation plan V24 — Product untouched by AuditRepo update

## Gate 0 — HEAD and ownership before writing any Product code

Inspect `main` and branch protection, open PRs, writer lanes, current deploy/release SHA, docs/LANE_LOCK_POLICY.md, affected Astro components, and verified AuditRepo MASTER. The last recorded Product anchor is `main@717efc54772edf4224f44254651c102e2af24129`, with library V3 #2283 **merged**, not pending merge. Latest recorded recheck: 29 success, one in-progress (Deploy to GitHub Pages), seven skipped and one cancelled; never treat as terminal-green or as live. Recheck workflow status and true production version at exact head. #2269 print remains independent and open; do not modify its files while active.

## Gate 1 — immutable before-state witnesses

Use actual build/publication path (not plain `astro build` as a shortcut). Capture at least one actual standalone hermeneutics article, Gill historical context/current part and Baptist book article, plus one unaffected control route. For each, record Product SHA, route, viewport, Day/Sepia/Night, first screen + 50% scroll, full/collapsed rail, menu/settings/search, real 4 SVG cluster, active H2/H3, reading-axis bounding boxes, anchor IDs/order, visible endpapers and print. 320/390 mobile screenshots establish no-change. Keep baseline assets scoped to Product PR or AuditRepo evidence note, not an evergreen production fact.

## Gate 2 — pure model adapter, no UI mutations

Build a **read-only** tested tree projection from registered SeriesConfig/`partToc`; support book chapter→article→H2→H3/H4 and flat series/standalone. Guard duplicate/empty anchor IDs, missing actual DOM targets, heading jump, order and legacy labels; preserve `#sec-gill-last-pages` explicitly. Use exact existing slugs and path registry. Avoid loading all book content into rail client JS. Keep source-of-truth model and export stable typed interface.

## Gate 3 — one component, one owner, one route flag

Introduce ONE shared desktop-only navigation view inside existing `ReaderRail`/`GillSeriesRail`/family shell ownership, behind reversible route/family feature flag. Keep old markup as fallback until independently approved; do not globally rewrite footer/headers, right cluster, TTS, library, site menu, search or reader settings. Scope CSS by component/series token. No `!important` layers to obscure conflicting old rules; measure exact computed geometry. Preserve `data-series-theme` palettes and reader theme orthogonality. Scope breakpoints to site's actual family thresholds, **not** prototype's 781px fixture value.

## Gate 4 — integrate existing actions, not demo handlers

- `GBReaderPreferences` alone owns Day/Sepia/Night, size, leading, measure and reduced motion. Right quick theme shares state with the left settings; it must restore the last light mode.
- `GBSearch` alone owns the global overlay and data/manifest; scoped current-book filter must be a supported canonical search criterion, never title-only fallback passed off as full-text.
- `SiteSectionsMenu`/`OverlayRuntime` alone own menu and focus-trap; dropdown position near exact trigger and collision avoidance are view-layer improvements only.
- `PlayEmber`/Media Session/TTS alone own playback, speed and progress; no simulated audio.
- **Merged library V3 #2283** alone owns save, reading status, notes, quotes, backup/restore and resume. Explicitly test `Читаю`, `Прочитано`, `Не интересно`, local backup and no accidental overwrite, highlights/note keys, no desktop overlay collision. Do not copy prototype localStorage.
- Print/share continue through existing `ReaderActionsRuntime` and ongoing #2269 owner. Keep print-only output free of controls.
- Existing reader scrollspy must own active section and position compensation; do not install a competing `scroll`, `IntersectionObserver`, or wheel handler from V24 demo.

## Gate 5 — regression gates before pilot PR merge

Run repo-canonical production-like build/validate; npm run validate:static-publication, engine:contracts / engine:guard where applicable and real project scripts. Test: `scripts/gill-pre-v16-submenu-regression-audit.js`, reader focus, layout WebKit, search modal/cold bootstrap, site menu overlay, library v3 coverage, SW/cache-bust, TTS download/consent, print A4. Inspect actual package scripts/head workflow names before invoking.

Browser: Chromium **plus WebKit and Firefox**. Cover desktop 781/900×300/900×480/1024/1366/1480/1920, reduced motion, 130% text, rapid interruption, 3 themes, focus inside closing branch, keyboard arrow skipping inert during animation, zero-match Enter, anchor links/Back/Forward, multi-line labels, 4 vertical quick actions, *no duplicate overlays*, right cluster/article no collision, no horizontal overflow, stable reader-axis before/after within family contract, no unexpected scroll jump, native save/library V3 and print.

**Stop-ship:** stale/missing anchor; blank panel frames; hidden focus; second global owner for search/theme/TTS/scroll; mobile diff; broken Gill leather intro; WebKit 334px overflow; wrong canonical release; unresolved other-PR conflict; unreadable narrow viewport; CI not exact-head-green; failure of personal-library V3 states or backup.

## Gate 6 — rollout, rollback and knowledge handoff

First adapter-only PR; then one standalone desktop pilot, and finally one Gill + one Baptist pilot after visual acceptance. Add per-family rollout only after cross-browser + reviewer screenshot sign-off. Rollback = disable route flag, not a blanket Git revert that discards unrelated library/print fixes. Keep V23/22 forensic references, retire old presentation CSS only after a verified owner-consumer search. Update AuditRepo with *current Product anchor + outcome* once a real pilot is verified; remove superseded work from ACTIVE MASTER as required by AuditRepo model. A merged Product PR is not a production/live certificate.