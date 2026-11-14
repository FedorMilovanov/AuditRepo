# Safe additive Product rollout — Grok Reader V25

**Current authoritative Product is NOT changed.** This document is a planning/verification owner. Exact main SHA, release SHA, branches and PRs MUST be refreshed before real implementation.

### Gate 0 — source and collaboration
Read Product docs/LANE_LOCK_POLICY.md and AuditRepo operating model, live Product main and open PRs. Library V3 PR #2283 has MERGED at Product main 717efc54772edf4224f44254651c102e2af24129. Exact-head 43 workflows: 33 success (incl. Pages Deploy, Reader Controls Accessibility, Visual Parity and Runtime Interactive), 9 skipped, 1 cancelled. No real live release JSON checked here. PR #2269 print and #2268 dependencies are separate owners; never mix those diffs into Grok PR. Recheck current main/leases before write.

### Gate 1 — immutable Product before-state
Use actual project production-like build (plain Astro build alone is not sufficient). Capture real Gill context + Part II, Baptist article 06, standalone Hermeneutics and unrelated control route. Freeze actual headings/anchors/partToc, published text/links, widths, click/keyboard/focus states, existing four right SVGs, overlay/menu/settings, library and print, at 1480×900, 1024×768, 900×480, 900×300. Capture **mobile 320/390 non-regression** witnesses and no-change diff. Day/Sepia/Night, 130% text, wide reading width and mid-article scroll.

### Gate 2 — purely read-only tree adapter
Use existing SeriesConfig/partToc as single data source. Book chapter/article/H2/H3/H4; flat series part/H2/H3/H4; standalone H2/H3. Typed interface and unit tests. Hard fail for duplicate/empty/missing DOM anchor IDs, unexpected heading jump, order change, wrong cross-article paths. Preserve Gill old slugs and #sec-gill-last-pages. NO UI mutation in this first PR.

### Gate 3 — one reversible desktop renderer
ONE shared view inside existing ReaderRail/GillSeriesRail/family shell (not cloned page or new layout runtime), gated by per-route/family feature flag. Preserve legacy view as fallback while piloting. CSS scoped by reader family and data-series-theme; no broad !important or deletion of legacy styles until all consumers proved absent. Browser Golden visual parity before/after on same routes/states. No new mobile UX, no horizontal top tools.

### Gate 4 — delegate ALL existing behavior
- GBReaderPreferences: single Day/Sepia/Night, type scale, leading, width, reduce motion. Quick night returns prior light mode.
- GBSearch and Pagefind: canonical full-text overlay/index. Add series scope only via supported canonical filter; NO second search runtime or demo title-only full-text claim.
- SiteSectionsMenu / overlay owner: native settings/site menu anchored to clicked trigger; no duplicate focus trap.
- PlayEmber/TTS: existing native play/speed/progress, not demo audio.
- SaveButton and GBReaderLibrary V3: original saved keys, notes, quote sources, statuses Читаю/Прочитано/Не интересно, reopen/backup/import, no duplicate storage.
- Existing reader scroll/anchor owner: active-section sync and any scroll offset compensation; never add second global window scroll/wheel handler from prototype.
- ReaderActionsRuntime and print owner #2269: native PDF/share only; print excludes UI.

### Gate 5 — acceptance evidence and stop-ship
Run current exact Product package scripts: validate:static-publication, engine contracts/guards, Gill pre-v16 submenu, search modal/bootstrap, library V3 E2E/progress, TTS/consent, print A4, Service Worker/cache, Reader Controls Accessibility, Visual Parity. Verify actual script names on the current head; no invented green.

Browser on Chromium, Firefox AND WebKit: 320/390 mobile unchanged, 781/900×300/900×480/1024/1366/1480/1920 desktop; long Cyrillic headings, H2–H4, active dots and only H2 hairlines, three themes, motion reduced, 130% font, rapid 4× reverse with intermediate frames 90/180/350/650ms, keyboard focus and ARIA, actual Back/Forward, trigger popovers, vertical right four, print A4, true reloading Library V3 and backups, no horizontal overflow, actual reader axis and scroll position.

**Stop ship** if any missing/renamed anchor or Gill leather; any mobile diff; WebKit 334px overflow; hidden focus, competing overlay/search/TTS/theme/scroll owners; clashing print PR; lost save/library V3 state; horizontal top action replacement; stale/failing CI or unverified live provenance.

### Gate 6 — publish and rollback
Adapter-only PR → standalone Hermeneutics desktop flag pilot → one Gill + one Baptist pilot → family rollout after screenshot owner acceptance + all browser gates. Rollback via pilot flag (restore old reader view), NOT blanket git revert that erases merged library V3 or other PRs. Record Product source SHA, tested CI, deploy/live identity and final decision in AuditRepo, then retire old presentation CSS only with consumer proof.
