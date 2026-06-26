# Verifier Synthesis — Deep Verifier Editor — 2026-06-26

**Agent:** arena-agent-deep-verifier-editor  
**Date:** 2026-06-26  
**Source HEAD:** `09c2d34` (main)  
**AuditRepo HEAD:** `d39963b`

---

## Status: CLEAR MERGE PATH IDENTIFIED

After auditing the entire project (both repos, 18 remote branches, all documentation, all agent intakes), the situation is:

### The problem
- 18 remote branches, 4+ targeting PremiumControls
- Multiple branches doing the same work differently
- Heart-series wiring done with wrong mode in older branches
- 5 P0 bugs live on main
- No PC-plan primitives on main

### The solution
**`lane/premiumcontrols-phase3-2026-06-26`** (tip `c4de1d42`) supersedes 10+ branches and is the canonical merge candidate.

---

## Findings summary (DVE-01..DVE-07)

| ID | Severity | Title | Status |
|---|---|---|---|
| DVE-01 | **P0 coord** | phase3 supersedes 4 PC branches — merge it FIRST | **PROPOSAL OPEN** |
| DVE-02 | P3 | 8 stale branches should be cleaned up | **PROPOSAL OPEN** |
| DVE-03 | P1 | system-hardening has non-PC fixes that need extraction | **PROPOSAL OPEN** |
| DVE-04 | P2 | 2 baptisty SEO branches conflict with each other | needs dedup |
| DVE-05 | P2 | monolith-preflight (17 commits) uses wrong heart-series mode | **SUPERSEDED by phase3** |
| DVE-06 | P0 | Content corruption, Ishod JSON-LD confirmed on main | **CONFIRMED** — fixed in phase3 |
| DVE-07 | P3 | Phase3 TTS rate legacy alias bug (`TTS_RATE_LEGACY = TTS_RATE_KEY`) | **NEW BUG** — one-line fix |

---

## Cross-reference with prior verifiers

| Prior finding | This synthesis | Agreement |
|---|---|---|
| PC-ROLL-01 (4 branches not merged) | ✅ confirmed + found 5th branch (phase3) that resolves it | **STRENGTHENED** |
| PC-ROLL-02 (heart-series wrong mode) | ✅ confirmed on heart-series branch; **RESOLVED** in phase3 | **RESOLVED** |
| PC-ROLL-03 (no PremiumControlAnchor) | **RESOLVED** in phase3 (`PremiumControlAnchor.astro`) | **RESOLVED** |
| PC-ROLL-04 (Phase 1/2 triplicated) | ✅ confirmed; phase3 consolidates all 3 | **RESOLVED** |
| PC-ROLL-05 (stale bases / dependency chains) | ✅ confirmed; phase3 is 0 behind | **RESOLVED** |
| PC-ROLL-06 (rollout audit lacks mode enum) | needs verification on phase3's script | **OPEN** |
| PC-ROLL-07 (Playwright blocked) | still blocked — system lib issue | **STILL OPEN** |

---

## Canonical merge order

```
STEP 1: git merge origin/lane/premiumcontrols-phase3-2026-06-26
        (fixes P0-content × 3, P0-ishod, PC-001..006, adds anchor/CSS/asset-version/TTS)

STEP 2: Fix DVE-07 (TTS_RATE_LEGACY = 'gbx-tts-rate' instead of TTS_RATE_KEY)

STEP 3: Run gates:
        npm run validate:all
        node scripts/audit-pro.js
        npm run content:guard

STEP 4: Delete 10 superseded branches

STEP 5: Merge remaining independent lanes:
        - karty-avraam-indexable-text-layer (1 ahead, independent)
        - system-dist-content-hardening (1 ahead, may overlap — verify)
        - system-migration-metadata-hardening (1 ahead, may overlap — verify)
        - baptisty-seo-structured-og (1 ahead, verify phase3 coverage)

STEP 6: Extract non-PC fixes from system-premiumcontrols-hardening:
        - deploy.yml JSON-LD guard
        - data/series.json updates
        - scripts/bundle-modules.js
        Cherry-pick into clean lane, drop PC duplication

STEP 7: Audit integration-monolith-preflight for any unique post-merge work
        Cherry-pick if needed, then delete

STEP 8: Rebuild UNIFIED_BUG_LEDGER from scratch on new HEAD
```

---

## Files in this synthesis

- `REPORT.md` — full findings
- `evidence/branch-conflict-matrix-2026-06-26.md` — 18-branch inventory
- `evidence/premiumcontrols-phase3-vs-main-verification.md` — phase3 content verification
- `evidence/phase3-tts-rate-legacy-alias-bug.md` — DVE-07 bug evidence
- `evidence/monolith-preflight-analysis.md` — why monolith is superseded
- `comments/comment-on-stale-branches-cleanup.md` — cleanup proposal
- `comments/comment-on-premiumcontrols-phase3-endorsement.md` — merge endorsement
- `comments/comment-on-phase3-tts-legacy-alias-bug.md` — DVE-07 fix proposal
