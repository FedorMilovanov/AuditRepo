# CURRENT_HEAD REVERIFY — 2026-07-09: main `2313f36f` (+149 commits since matrix)

**Verifier:** claude-auditor (Claude Code multi-agent session)
**Date:** 2026-07-09
**Source HEAD:** `2313f36f` (main; latest feature-level: b8eabe75 hermenevtika rail, d579745c gill images, TTS/Vosk engine, mobile-bar v4)
**Matrix tracked HEAD:** `de71fb3d` / `8c318010` (~149 commits stale)
**AuditRepo HEAD:** see git log
**Method:** SHA-first. 2 independent witness auditors + verifier synthesis. Production-like dist built (`strangler:build:production-like`, 56 HTML). Labels per `verification/VERIFICATION_LEVELS.md`.

---

## 0. Why this pass (justified per START_HERE rule 2)

The matrix tracked `de71fb3d`; main advanced **~149 commits** carrying large NEW surfaces that never went through a pass: the Vosk neural TTS engine (3 new js files + ~280MB model pipeline), the mobile-bar v4 refactor + speed-slot dedup, the Hermenevtika rail rework, Gill premium images, the quotes FAB redesign, and the series-progress "Часть N из N" corrections. A fresh HEAD-pass was required.

---

## 1. Verification of open matrix items on `2313f36f`

### 🟠 P1
| Bug ID | Status | Evidence |
|--------|--------|----------|
| BUG-PERF-001 | ✅ CONFIRMED-CURRENT (worse) | js/ addEventListener/removeEventListener = **348 / 25** (was 339/25). site.js 54/4. MPA-mitigated; NEW code does not worsen it (controller AbortController-cleaned, vosk property-handlers). `verified-source` |

### 🟡 P2
| Bug ID | Status | Evidence |
|--------|--------|----------|
| AUDIT-P2-MATRIX-DRIFT | ✅ CONFIRMED-CURRENT | route-migration-matrix **35** ≠ page-ownership **54** ≠ sitemap **43**; no 3-way reconciliation. Fixed by merging `lane/system-*` derived-registry. `verified-source` |
| AUDIT-P2-WORKFLOWS-CHECK-GAP | ✅ CONFIRMED-CURRENT | check-workflows.js validates deploy.yml by presence-regex; no job-level `if:`/`\|\| failure` reachability check. `verified-source` |
| BUG-SEO-001 | needs-live-recheck | IndexNow submit after deploy at both HEADs; residual = CDN edge propagation, live-only. |
| NEW-CANONICAL-IZBRANNOE-01-GAP | ✅ CONFIRMED-CURRENT | canonicalSanityGuard walks ROOT only; astro-only /izbrannoe/ invisible. Subsumed by AUDIT-PRO-ROOT-ONLY. `verified-source` |

### 🟢 P3 (still-open, verified-source unless noted)
AUDIT-PRO-ROOT-ONLY, SEO-AUDIT-ROOT-ONLY, VALIDATE-JS-ARTICLES-ONLY, VALIDATE-SCOPE-GAP, SHADOW-AUDIT-NARROW (7-route), AUDIT-PRO-SITEMAP-ROOT-ONLY, AUDIT-PRO-VM-DEPRECATED, VALIDATE-JS-VM-DEPRECATED, GATE-MARKER-DATA-DRIFT (+ new instances), NEW-CSS-BUDGET-01, NEW-OG-SIZE-PARAM, NEW-72, STRANGLER-HYGIENE (concrete drift, see §2), BUG-011 (worse: 768px 21×) — all **still-open**. AUDIT-P3-OG-LCP-MISMATCH — needs-live-recheck.

### 🔵 Refactor (still-open)
R-001 (site.js **169,492 B**), R-002 (enhancements.js **46,141 B**), R-003 (no sourcemaps), R-004 (no `type=module`). AR-001/004/005 (auditrepo tooling) untouched by product delta.

**Result: 0 of 27 tracked open items closed by the 149-commit delta.**

---

## 2. NEW findings (not in matrix) — all P3

| ID | Sev | Label | Description | File:line |
|----|-----|-------|-------------|-----------|
| NEW-VOSK-UNZIP-SYNC-JANK | P3 | verified-source | `fflate.unzipSync` blocks main thread on ~280MB→700MB decompress (cold download UI freeze) | vosk-tts-engine.js:110 |
| NEW-VOSK-FETCH-NO-ABORT | P3 | verified-source | 280MB model fetch not cancellable; continues after opt-out/nav | vosk-tts-engine.js:166 |
| NEW-VOSK-DEAD-SPLITSENTENCES | P3 | verified-source | dead exported fn | vosk-tts-core.js:413,446 |
| NEW-HIGHLIGHTS-NO-REINIT-GUARD | P3 | suspected | no double-include guard on FAB/global listeners | highlights.js |
| NEW-SAVE-QUOTE-TIMER-RACE | P3 | suspected | one-shot 500ms Save-button inject, no retry | highlights.js le() |
| NEW-HARDTEXTS-CSP-MISSING-HFCDN | P3 | verified-source | connect-src missing `*.aws.cdn.hf.co` (inert; no Listen btn) | hard-texts/index.astro:122 |
| NF-DEAD-ENHANCE-SHIM | P3 | verified-source | `enhanceGillMobileBarMarkup` dead-for-prod; builds CSS-deleted els | floating-cluster-controller.js:973-1048 |
| NF-SPEEDSLOT-4TH-COPY | P3 | verified-source | GillSeriesRail keeps inline speed-slot; dedup 3-of-4 not 4-of-4 | GillSeriesRail.astro:209 |
| NF-STRANGLER-BAR-DRIFT | P3 | verified-source | Gill root legacy HTML = old 1-level bar vs v4 astro (never served, drifting) | articles/dzhon-gill-*/index.html |
| NF-GATE-IZ5-STALE | P3 | verified-source | gates forbid "Часть 1 из 5" but parts render "из 3" → vacuous guard | premium-controls-rollout-audit.js:210 |

**Delta confirmed CLEAN** (no manufactured findings): TTS/Vosk engine (CSP `932230d3` + integrity `d0833d11` correct in dist), floating-cluster-controller TTS state machine (runId/suppressEnd), quotes FAB + selection popup (no XSS — user text escaped/`textContent`). temp commits net zero. Gill image = owner pass (run 29011803614). Deploy gates correctly on v4.

**Pre-existing (NOT delta):** orphan component sweep flags ClusterButton.astro, PremiumControlAnchor.astro, NagornayaChast{1-5}*, Home* as unimported — last touched before de71fb3d. Separate cleanup pass.

---

## 3. Summary

| Category | Count |
|----------|-------|
| Tracked open items re-confirmed still-open | 27 |
| Tracked open items closed by delta | 0 |
| New P3 findings this pass | 10 |
| P0/P1 crash/XSS/visual regressions in delta | 0 |
| **Honest open total after pass** | **~37** (matrix "40" was inflated; tables enumerate 27) |

**Systemic themes (the "close-to-zero" leverage points):**
1. ROOT-ONLY audit coverage (audits blind to astro-only routes) — extend to dist/ or use derived registry.
2. GATE-MARKER-DATA-DRIFT (hardcoded markers/counts) — move to data/*.json (also unlocks cheap Gill Part IV).
3. AUDIT-P2-MATRIX-DRIFT — merge `lane/system-*` derived-registry stack.
4. BUG-PERF-001 listener leak.
5. R-001..004 JS/CSS refactor debt (owner-scoped).

**Bottom line:** project is HEALTHY. No user-facing breakage found across 149 unaudited commits. Open backlog = tooling-coverage gaps + refactor tech-debt + 1 MPA-mitigated P1.

---

## 4. Reconciliation with canonical matrix (post-fetch, 2026-07-09)

On fetch, the canonical `MASTER_BUG_MATRIX.md` (origin/main) was found further advanced than the clone base: it tracks `75f807b` with a D-1..D-23 system + `SUPER_AUDIT_2026-07-06_14a49be8.md` (waves W1-W10), 90 closed / 38 open. **My clone's matrix was stale; I did NOT clobber the canon** — reconciled instead:
- My Vosk findings are ALREADY tracked there — `NEW-VOSK-UNZIP-SYNC-JANK` = **TTS-DL-UNZIP-SYNC** (P2); download-UX (`NEW-VOSK-FETCH-NO-ABORT`) is covered by **TTS-DL-CONSENT** (P1) + **TTS-DL-NO-TABLOCK** (P2). Not re-added.
- Genuinely-new to the canon (from the `75f807b..2313f36f` mobile-bar/rail delta the canon predates): **8 P3** — NF-DEAD-ENHANCE-SHIM, NF-SPEEDSLOT-4TH-COPY, NF-GATE-IZ5-STALE (instance of GATE-MARKER-DATA-DRIFT), NF-STRANGLER-BAR-DRIFT (instance of STRANGLER-HYGIENE), NEW-VOSK-DEAD-SPLITSENTENCES, NEW-HARDTEXTS-CSP-MISSING-HFCDN, NEW-HIGHLIGHTS-NO-REINIT-GUARD (suspected), NEW-SAVE-QUOTE-TIMER-RACE (suspected).
- Canon updated: source note `75f807b`→`2313f36f`, P3 open 19→27, total 38→**46**, Passes 95+.
- **Gill Part IV refinement (owner track):** the canon's cycle-4/5/6 research (`RESEARCH_gill-series-structure-proposal` + theology deep-dive, now in the Research repo) found Gill's theology is **already embedded in Часть II. Учёный** — a full separate 6th «Богословие» doc would overlap. Refined recommendation: a focused **«Богословие Гилла: 7 спорных текстов»** article (exegetical climax + hyper-calvinism balance) cross-linked to Part II, not a blanket new part. Supersedes my initial "add Part IV" framing.
