# Verifier verdict — `lane/premiumcontrols-phase3-complete-2026-06-26`

- Project: `gb-is-my-strength`
- Agent: `arena-agent-premiumcontrols-rollout-verifier` (verifier / editor)
- Date: `2026-06-26`
- Branch under review: `lane/premiumcontrols-phase3-complete-2026-06-26` (tip `02bb0a6f`, + `ad5675dd`)
- Base: `lane/integration-monolith-preflight-2026-06-26-arena` (`51a0bc43`) — confirmed ancestor
- Method: full-history clone + worktree checkout + `npm ci` + `npm run validate:all` + static audit of source **and committed dist**

## Headline

**phase3-complete is the best candidate produced in 2 days, but it is NOT merge-ready and the agent's "closed под ключ" claim is false.** `validate:all` is green (0 errors, 5 pre-existing warnings) — but that gate does not catch the actual defects. There are **5 concrete gaps**, one of which is structural (Node ≥22.12.0 required to rebuild `dist`).

## What IS real on phase3 (verified, not illusion)

- ✅ **PC-004 (cluster side):** the 3 cluster components (`SingleArticleCluster`, `SeriesLiteCluster`, `GillRailControls`) genuinely lost their `<style is:global>` (0× each, was 1×), and all 3 now `<link rel="stylesheet" href="/css/premium-controls.css?v=pc-v21">`. `css/premium-controls.css` and `src/styles/premium-controls.css` are byte-identical (md5 `35714e73`) — single source reproduced to public asset. Delta vs integration: +747/−805 (net −58 lines).
- ✅ **PC-005 / TTS:** real `speechSynthesis` engine (ru-RU, chunk ≤220, start/pause/resume/stop, live rate), canonical key `gb:audio:rate` + legacy `gbx-tts-rate` fallback, `'Озвучка ещё не подключена'` toast removed from `handlePlayClick`, `aria-haspopup/controls/expanded` + `role=radio`/`aria-checked` on speed options.
- ✅ **PC-006 audit script:** `scripts/premium-controls-rollout-audit.js` (147 lines) exists — dead-controls guard + forbidden-route guard + PC-004 double-CSS invariant.
- ✅ **PC-001 primitive:** `PremiumControlAnchor.astro` created (`breadcrumb`/`rail`/`floating` variants).

## What is NOT done (the 5 gaps)

### Gap 1 — PC-004 is NOT "closed fully"; it split CSS delivery in two
`css/floating-cluster.css` (1932 lines) was **NOT removed**. The 19 PageHead components (Herm/Kod/Antisovetov/Gill×5/Baptisty×11) still `<link>` the OLD file; only the 3 cluster components use the new one. Result:
- Gill pages load **both** files → the exact double-CSS the plan forbids.
- The new `premium-controls.css` is **missing 23 selectors** present in the old file (12 `.gb-*`: `gb-ember__check`, `gb-floater--heart/pastor/series-lite`, `gb-icon`, `gb-series-chip*`, `gb-theme-toggle`, `gbs-rail-foot`). Dropping the old file now → visual regression on variants/series chip/theme toggle.

### Gap 2 — dist was NOT rebuilt; nothing shipped
Committed `dist` still loads `floating-cluster.css?v=f4bddc5b` on every article page; `dist/css/premium-controls.css` does not exist; `sw.js` precache lists only `floating-cluster.css`. **The entire phase3 CSS work has not reached the assembled site.** Root cause: `astro build` aborts on Node 20 (`Node.js v20.20.2 is not supported by Astro! Please upgrade to >=22.12.0`). This is the structural blocker.

### Gap 3 — PC-001 Anchor created but never mounted
`PremiumControlAnchor` is imported only by its own definition (1 ref). Not mounted in Herm/Kod/Antisovetov. Their controls are still `position: fixed`. The plan's central thesis (anchor = geometry, control = static) is unimplemented on routes.

### Gap 4 — PC-003 asset helper created but unwired AND contains wrong versions
`src/lib/asset-version.js` exists with `assetUrl()`, but **0 PageHead components use it** (36 still hardcoded `?v=`). Worse, the VERSIONS map is already wrong:
- `'css/premium-controls.css': 'v1'` but components link `?v=pc-v21`
- `'js/premium-controls-controller.js': 'pc3-20260626'` — **this file does not exist** (controller is still `floating-cluster-controller.js`). If wired as-is, it would 404.

### Gap 5 — CI workflows not fixed; gate not run on built dist
6 of 7 workflows use `actions/checkout@v4` with no token (only `deploy.yml` has one); `ARENA_AGENT` secret referenced nowhere. `audit:premium-controls` could not run (needs `dist`). So "всё зелёное" is `validate:all`-only, not the PC gate.

## Why 14 branches exist — root cause

Every agent can edit `src/` but **none can rebuild `dist`** (Node 22 missing in the sandbox). Each lane fixes source → committed `dist` drifts → next agent "fixes" the drift → new lane. This is an **infrastructure loop, not a code problem**. phase3 sits in the same state: source moved to `premium-controls.css`, dist still on `floating-cluster.css`.

## Verdict & recommended close (no new branches)

phase3-complete **is the correct base to finish on** (it already integrates the 4 conflicting lanes + PR #19 via `integration-monolith-preflight`). Do NOT open a 5th lane. Finish IN PLACE:

1. **On a Node ≥22.12.0 machine** (owner laptop or CI runner) — this unblocks everything:
   - merge the 23 missing selectors from `floating-cluster.css` into `premium-controls.css`;
   - switch the 19 PageHead `<link>`s to `premium-controls.css`;
   - delete `css/floating-cluster.css` + remove from `sw.js` PRECACHE_ASSETS;
   - fix `asset-version.js` versions (`premium-controls.css→pc-v21`, drop the phantom `premium-controls-controller.js` line);
   - run `npm run strangler:build:production-like && node scripts/cache-bust.js` → rebuilds `dist` consistently.
2. Mount `PremiumControlAnchor variant="breadcrumb"` in the 3 pilots (PC-001) — small, can be a follow-up commit, not a blocker for CSS unification.
3. Add `token: ${{ secrets.ARENA_AGENT }}` to the 6 `actions/checkout@v4` steps; run `npm run audit:premium-controls` on the fresh dist as the real gate.

After step 1, squash-merge `premiumcontrols-phase3-complete` → `main` and delete the 14 lanes listed in the owner's note. **One merge, one rebuild, done.**

The one thing that cannot be done from this sandbox: rebuilding `dist`. That single command, run on Node 22, collapses the whole 2-day loop.

## Verification commands (reproducible)
```bash
git clone https://github.com/FedorMilovanov/gb-is-my-strength
git fetch origin lane/premiumcontrols-phase3-complete-2026-06-26
git worktree add pc3 FETCH_HEAD && cd pc3 && npm ci
npm run validate:all                       # 0 errors, 5 warnings (pre-existing)
# Gap 1 — double CSS:
grep -rl "floating-cluster.css" src/components/article-pilots/*/  # 19 PageHead
comm -23 <(grep -oE "^\.[a-z][a-z0-9_-]*" css/floating-cluster.css|sort -u) \
         <(grep -oE "^\.[a-z][a-z0-9_-]*" css/premium-controls.css|sort -u)   # 23 missing
# Gap 2 — dist stale:
grep -o "premium-controls.css" articles/hermenevticheskaya-*/index.html   # none
# Gap 4 — wrong versions:
grep "premium-controls.css\|premium-controls-controller" src/lib/asset-version.js
```
