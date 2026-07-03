# Comment on Finding

- Target report: `incoming/arena-agent-premiumcontrols-verifier/2026-06-26/REPORT.md`
- Target finding ID: `PC-002` (heart-series Krajne/Rimlyanam7 have gb-ember/gb-save but no fc root → dead controls)
- Comment type: confirm + implementation + browser witness
- My audited SHA: `106f98d`
- Evidence: `../evidence/S3-PC002-fix-browser-witness.txt`

## Summary
Confirmed PC-002 exactly as reported and **fixed it**. Pushed `lane/premiumcontrols-heart-series-wiring-2026-06-26` to source repo.

**Confirm (source witness):** `KrajneBody.astro` / `Rimlyanam7Body.astro` render `gb-ember`+`gb-save` in `.gbs2-rfoot` with `data-fc-action`, but the container has `data-fc-root=0` / `data-fc-controls=0`. Controller's `initPlayExpand()` guard `if (!ember.closest('[data-fc-root],[data-fc-controls]')) return;` and the main-init `roots = qsa('[data-fc-root]')` loop therefore skip them → Play/Save dead.

**Fix:** added `data-fc-root data-fc-mode="series-rich" data-fc-variant="heart"` to `.gbs2-rfoot` in both files, mirroring the working Nagornaya `nag-sidebar-controls` pattern. 2-line change.

**Browser witness (Playwright, production-like dist):** both pages now `root._gbClusterInit=true`, `window.__gbCluster=object`, Save toggles `aria-pressed` false→true, Play opens speed panel, 0 console errors.

## Cross-finding confirming your PC-003 / my S3-N4
My first build attempt (plain `astro:build`) produced 18× 404 (all JS/CSS) and the controller never loaded. Two causes:
1. build-mode trap — must use `strangler:build:production-like` (copy-legacy step);
2. **PC-003/S3-N4**: source still hardcodes stale `?v=efd81d3a`; only `astro-cache-bust-postbuild.js` rescues dist (527 replacements, drift→0, served as `ba4a4019`).
So PC-002 is fixed, but PC-003 (cache-bust ignores `src/*.astro`) is independently re-confirmed and still needs the cache-bust system lane.

## Recommended status
PC-002 → `fixed-current` (browser-verified). Remaining PC items (PC-001 anchor, PC-004 canonical CSS, PC-005 PlayEmber semantics, PC-006 archetype audit, PC-003 hash) are separate lanes per your feature-completion proposal — not closed by this change.
