# Fresh HEAD-Pass — gb-is-my-strength @ `2313f36f` (+149 commits vs matrix)

**Аудитор:** claude-auditor (Claude Code, multi-agent session)
**Project:** gb-is-my-strength
**Дата:** 2026-07-09
**Source HEAD:** `2313f36f` (main, deploy run green — verified-production-like-dist for no-gate-regression)
**Matrix tracked HEAD:** `de71fb3d` / `8c318010` (~149 commits stale)
**Environment:** production-like dist (`strangler:build:production-like`) + source inspection
**Report type:** reverify (full-matrix HEAD reconciliation + new findings)
**Method:** SHA-first. 2 independent witness auditors (A = new-surface deep code audit; B = matrix reconcile + delta regression scan) + verifier synthesis. Verification labels per `verification/VERIFICATION_LEVELS.md`.

## Source commit

`2313f36f` (main). Delta audited: `8c318010..2313f36f` (149 commits: TTS/Vosk engine, mobile-bar v4 refactor + speed-slot dedup, Hermenevtika rail rework, Gill premium images, quotes FAB, selection-popup, series-progress "Часть N из N" fixes).

## Summary of result

**Runtime layer SOLID.** The 149-commit unaudited delta introduced **no P0/P1 crash, no XSS, no visual-parity regression**. New TTS/Vosk engine (CSP redirect fix `932230d3`, SHA-256 integrity `d0833d11`), floating-cluster-controller TTS state machine, and quotes FAB all verified clean at source. **0 of the 27 tracked open matrix items were closed by the delta** (it was feature/polish, not backlog burndown). **10 new findings, all P3** (perf/hygiene/tooling). Matrix stat "40 open" is internally inflated — tables enumerate 27 rows; corrected honest count ≈ 27 tracked + 10 new = ~37 open.

## New findings (for matrix)

| ID | Severity | Label | Description | Evidence |
|----|----------|-------|-------------|----------|
| NEW-VOSK-UNZIP-SYNC-JANK | P3 | verified-source | `fflate.unzipSync` blocks main thread decompressing ~280MB model → ~700MB; UI freezes seconds on cold download | js/vosk-tts-engine.js:110 |
| NEW-VOSK-FETCH-NO-ABORT | P3 | verified-source | 280MB model `fetch(MODEL_URL)` not wired to AbortController; continues after opt-out/navigation | js/vosk-tts-engine.js:166 |
| NEW-VOSK-DEAD-SPLITSENTENCES | P3 | verified-source | `splitSentences` exported, never called (controller uses own `splitTtsChunks`) | js/vosk-tts-core.js:413,446 |
| NEW-HIGHLIGHTS-NO-REINIT-GUARD | P3 | suspected | highlights.js IIFE has no re-init guard; double-include would dup FAB + global listeners | js/highlights.js |
| NEW-SAVE-QUOTE-TIMER-RACE | P3 | suspected | Save-quote button injected via one-shot 500ms timer, never retried if popup absent | js/highlights.js le() |
| NEW-HARDTEXTS-CSP-MISSING-HFCDN | P3 | verified-source | hard-texts connect-src has huggingface.co but missing `*.aws.cdn.hf.co` (inert — no Listen btn there) | src/pages/hard-texts/index.astro:122 |
| NF-DEAD-ENHANCE-SHIM | P3 | verified-source | `enhanceGillMobileBarMarkup` dead-for-prod (bails :986); body builds `.mobile-btoc-meter`/`.mobile-icon-row` whose CSS was deleted by 30bf3f5c | js/floating-cluster-controller.js:973-1048 |
| NF-SPEEDSLOT-4TH-COPY | P3 | verified-source | GillSeriesRail keeps own inline `initGillRailSpeedSlot`, doesn't import `_shared/speedSlot.ts` (dedup 3-of-4, not 4-of-4) | src/components/article-pilots/gill-series/GillSeriesRail.astro:209 |
| NF-STRANGLER-BAR-DRIFT | P3 | verified-source | Gill root legacy HTML still has old 1-level mobile bar vs v4 astro source (production-dist so never served; drifting) | articles/dzhon-gill-spravochnik/index.html vs GillSeriesMobileBar.astro |
| NF-GATE-IZ5-STALE | P3 | verified-source | Gates hardcode forbidden `"Часть 1 из 5"`; parts now render `"из 3"` → guard passes vacuously, misses future miscount | premium-controls-rollout-audit.js:210; gill-v16-mobile-play-smoke.js:253 |

## Tracked-item reconciliation (highlights)

- BUG-PERF-001 (P1): still-open, slightly worse — js/ 348 add / 25 remove (was 339/25). MPA-mitigated. NEW code does NOT worsen it (controller auto-cleans via AbortController; vosk uses property handlers).
- AUDIT-P2-MATRIX-DRIFT (P2): still-open, unchanged (route-migration-matrix 35 ≠ page-ownership 54 ≠ sitemap 43). → fixed by merging the `lane/system-*` derived-registry stack.
- ROOT-ONLY audit gaps (AUDIT-PRO-ROOT-ONLY, SEO-AUDIT-ROOT-ONLY, VALIDATE-JS-ARTICLES-ONLY, SHADOW-AUDIT-NARROW): all still-open.
- GATE-MARKER-DATA-DRIFT (P3): still-open + new instances (NF-GATE-IZ5-STALE). → fix by moving series markers/counts to data/*.json.
- R-001..R-004 (site.js 169KB, enhancements.js 46KB, no sourcemaps, no modules): all still-open.
- Delta confirmed CLEAN: temp commits net zero; Gill image = owner pass (run 29011803614); deploy gates correctly migrated to v4 (e9949ef5, 76f7610f); enhance-shim graft (dd258988) properly fixed.

## Cross-repo note (Gill structure — owner track, NOT a bug)

Owner-approved plan (research repo `Джон Гилл/03_STRUCTURE_PROPOSAL.md`): add **«Часть IV. Богословие»** (doctrine) as roman IV, n=5, pushing Справочник to n=6 → Введение+I+II+III+IV+Справочник. Content ready with primary-source citations. Belongs to repair/author track, tracked as a work item.
