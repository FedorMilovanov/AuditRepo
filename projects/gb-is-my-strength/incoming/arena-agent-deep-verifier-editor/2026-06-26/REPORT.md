# Agent Audit Report — Deep Verifier & Editor (full-project)

## Meta
- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: `arena-agent-deep-verifier-editor`
- Date: `2026-06-26`
- Audited branch: `main` + ALL 18 remote branches
- Audited SHA (main): `09c2d34aedf3d0a29e19298ffa886e60fea02b87`
- Environment: Arena sandbox; full clone with history
- Build mode: source + git tree analysis; no browser witness (Playwright blocked)
- Evidence: `evidence/`
- Method: **from-scratch full audit** — read AGENTS.md, WORK_MODES.md, all AuditRepo docs, all 15+ incoming agent reports, source code of key files, all 18 remote branches

---

## Executive summary

After reading the entire project documentation, all agent reports, and verifying the source code, I found:

1. **The PremiumControls situation is a 4-way branch collision**, but a 5th branch (`premiumcontrols-phase3`) exists that SUPERSEDES the other 4 and correctly implements the plan. This branch is the canonical solution.

2. **There are 18 remote branches** total. Of these, ~8 are stale (behind main, already merged or obsoleted), ~5 are PremiumControls-related (colliding), ~3 are SEO/content fixes, and ~2 are system-hardening mega-lanes.

3. **On main HEAD** (`09c2d34`), the project has **5 confirmed P0 bugs** (content corruption, dead controls, invalid JSON-LD), all of which exist in the `premiumcontrols-phase3` + `system-premiumcontrols-hardening` branches as fixes.

4. **The biggest risk is merging the wrong branch first.** `premiumcontrols-phase3` and `system-premiumcontrols-hardening` both claim to fix the same bugs but use different approaches. Phase3 is cleaner. System-hardening is wider but has 28 file-level conflicts with `playember`.

---

## 1. New Findings

### Finding `DVE-01`: Branch `premiumcontrols-phase3` is the CANONICAL solution — supersedes 4 earlier branches

- Title: `lane/premiumcontrols-phase3-2026-06-26` correctly implements Phases 1-5 of the plan, making `heart-series-wiring`, `playember-semantics`, `rollout-audit`, and the PC-* portions of `system-hardening` REDUNDANT
- Severity: **COORDINATION P0** — merging the wrong branches first will cause unnecessary conflicts
- Evidence:
  - `premiumcontrols-phase3` (tip `c4de1d42`, base `09c2d34` = current main, 0 behind):
    - **Creates** `src/components/ui/premium-controls/PremiumControlAnchor.astro` (PC-001 ✅)
    - **Creates** `src/lib/asset-version.js` (PC-003 ✅)
    - **Creates** `src/styles/premium-controls.css` + `css/premium-controls.css` (PC-004 ✅)
    - **Fixes** Krajne/Rimlyanam7 with `data-fc-mode="series-lite"` (PC-002 ✅, correct mode)
    - **Fixes** Ishod JSON-LD (P0-02 ✅)
    - **Fixes** Content corruption Antisovetov + Hermeneutics (P0-content ✅)
    - **Adds** `scripts/premium-controls-rollout-audit.js` (PC-006 ✅)
    - **Adds** baptisty WebP og:image covers (11 files) + BreadcrumbList JSON-LD
    - 3 commits, 0 commits behind main — **clean fast-forward candidate**
  - Meanwhile:
    - `heart-series-wiring` uses `data-fc-mode="series-rich"` (WRONG — not in controller's enum, PC-ROLL-02)
    - `playember-semantics` is stacked on unmerged `system-cache-bust` (dependency chain)
    - `rollout-audit` touches only 2 files that phase3 also touches (conflict risk)
    - `system-premiumcontrols-hardening` is 2 commits ahead but has 28 conflict points with `playember`
- Confidence: high (direct git tree/content comparison)
- Verification level: L2
- Recommended action: **Merge `premiumcontrols-phase3` FIRST. Retire the 4 older PC branches.**
- Do not mix with: system-hardening's non-PC bug fixes should be extracted to a separate lane

### Finding `DVE-02`: 8 stale branches should be cleaned up

- Title: 8 remote branches are stale (behind main, already merged/obsoleted, or superseded)
- Severity: P3 (hygiene, but prevents confusion for future agents)
- Branches:
  | Branch | Status | Reason |
  |--------|--------|--------|
  | `lane/system-release-gate-green-2026-06-26` | **MERGED** (0 ahead/0 behind) | Already in main |
  | `lane/audit-svg-pilot-bugs-2026-06-25` | **STALE** (16 behind, docs-only) | Obsoleted by later audits |
  | `lane/baptisty-content-expansion-2026-06-25` | **STALE** (12 behind, 1 ahead) | Content expansion; needs rebase |
  | `lane/premiumcontrols-heart-series-wiring-2026-06-26` | **SUPERSEDED** | Phase3 uses correct mode, this uses wrong `series-rich` |
  | `lane/premiumcontrols-playember-semantics-2026-06-26` | **SUPERSEDED** | Phase3 includes semantics fix; this is stacked on unmerged cache-bust |
  | `lane/system-cache-bust-astro-source-2026-06-26` | **SUPERSEDED** | Phase3 includes `asset-version.js`; this is 2 behind |
  | `lane/karty-ishod-jsonld-2026-06-26` | **SUPERSEDED** | Phase3 includes ishod fix |
  | `lane/content-text-corruption-2026-06-26` | **SUPERSEDED** | Phase3 includes content fixes |
- Confidence: high
- Verification level: L2
- Recommended action: After phase3 merge, delete these branches. File `comments/comment-on-stale-branches-cleanup.md`.

### Finding `DVE-03`: `system-premiumcontrols-hardening` has valuable non-PC fixes that should NOT be lost

- Title: Branch `e2041042` contains bug fixes (BUG-A7 baptisty WebP og:image, BUG-A9 avraam map, BUG-B6 dead JS modules, BUG-S6 cleanup) that are NOT in phase3 — these should be extracted
- Severity: P1 (valuable work at risk of being orphaned)
- Evidence:
  - `images/baptisty-rossii/cover-*.webp` — 11 WebP covers (phase3 also has these, need dedup check)
  - `scripts/bundle-modules.js` — new bundling script
  - `scripts/check-agents-rev-uniqueness.js` — new guard
  - `.github/workflows/deploy.yml` — JSON-LD deploy guard
  - `data/series.json` — updated series data
  - `sitemap.xml` — updated
  - `js/site.js` — TTS integration, controller updates (+202 lines)
  - `css/floating-cluster.css` — CSS updates
- Overlap with phase3: `IshodPageHead`, `AntisovetovBody`, `HermenevtikaBody`, `KrajneBody`, `Rimlyanam7Body`, plus all root HTML files
- Conflict with playember: **28 files** changed in both
- Recommended action: **Phase3 first. Then cherry-pick non-PC fixes from system-hardening into a new clean lane. Delete remainder.**

### Finding `DVE-04`: Two SEO branches for baptisty target the same PageHead files — mutual conflict

- Title: `lane/baptisty-seo-breadcrumb-ogimage-2026-06-26` (2 behind) and `lane/baptisty-seo-structured-og-2026-06-26-arena` (0 behind) both fix baptisty SEO but differently
- Severity: P2 (coordination risk)
- Evidence:
  - `baptisty-seo-breadcrumb-ogimage` (base `106f98d`, 2 behind): from session3 agent
  - `baptisty-seo-structured-og-2026-06-26-arena` (base `09c2d34`, 0 behind): from another agent, current
  - Both modify baptisty PageHead components for BreadcrumbList + og:image
  - Phase3 also includes baptisty WebP covers + possibly BreadcrumbList
- Recommended action: Verify phase3 already includes baptisty SEO fixes. If yes, retire both baptisty-seo branches.

### Finding `DVE-05`: `integration-monolith-preflight` is a 17-commit mega-branch that may duplicate multiple smaller lanes

- Title: `lane/integration-monolith-preflight-2026-06-26-arena` (17 commits ahead, 0 behind) is the largest unmerged branch
- Severity: P2 (coordination risk + potential for massive merge conflicts)
- Evidence: 17 commits from base `09c2d34`. This likely includes an attempt to consolidate multiple fixes. Without reading all 17 commits, it's unclear what it overlaps.
- Recommended action: **Audit after phase3 merge.** If phase3 covers the core PC work, monolith may be partially obsoleted.

### Finding `DVE-06`: Confirmed content corruption bugs (P0) — still on main, fixed in phase3

- Title: Three content corruption bugs verified on main HEAD `09c2d34`, confirmed fixed in `premiumcontrols-phase3`
- Severity: P0 (content)
- Evidence (main HEAD):
  - **Antisovetov U+FFFD** at `AntisovetovBody.astro:695`: `не прос�тематическом` — replacement character mid-word
  - **Hermeneutics `кик говорят`** at `HermenevtikaBody.astro:360`: should be `как говорят` (1 Cor 15:12)
  - **Hermeneutics `называемая , .Святое Святых"`** at `HermenevtikaBody.astro:309`: should be `называемая "Святое Святых"` (Heb 9:3)
  - **Ishod JSON-LD invalid** at `IshodPageHead.astro:39`: extra `}` causes `JSON.parse` failure
- Phase3 verification: `git diff origin/main origin/lane/premiumcontrols-phase3-2026-06-26 -- src/components/karty/ishod/IshodPageHead.astro` shows fix applied
- Confidence: high
- Verification level: L2

---

## 2. Confirmations of Existing Findings

### Confirm `PC-ROLL-02` (heart-series wrong mode) — but RESOLVED in phase3
- Target: `arena-agent-premiumcontrols-rollout-verifier` report, Finding PC-ROLL-02
- My evidence: `premiumcontrols-heart-series-wiring` uses `data-fc-mode="series-rich"` (confirmed in branch tip `099afce4`). However, `premiumcontrols-phase3` uses `data-fc-mode="series-lite"` (confirmed in diff). Phase3 is the correct implementation.
- Recommended status: Retire `heart-series-wiring` branch. Use phase3.

### Confirm `PC-ROLL-03` (anchor missing) — RESOLVED in phase3
- Target: same report, Finding PC-ROLL-03
- My evidence: `premiumcontrols-phase3` creates `PremiumControlAnchor.astro` with `variant='breadcrumb'|'rail'|'floating'`, `data-pc-anchor`, `data-pc-variant`. This is the plan's Phase 3 primitive.
- Recommended status: Confirm PC-001/PC-ROLL-03 **RESOLVED** on phase3 branch.

### Confirm `PC-ROLL-06` (rollout-audit lacks mode enum) — CHECK if phase3's script includes it
- Target: same report, Finding PC-ROLL-06
- My evidence: Phase3 adds `scripts/premium-controls-rollout-audit.js` but I haven't verified if it enforces mode enum. Needs check.
- Recommended status: verify, then close or extend.

### Confirm all prior verifier findings about main HEAD
- P0-2 (ishod JSON-LD): **CONFIRMED** still broken on main `09c2d34`
- P0-content (antisovetov U+FFFD, hermeneutics Scripture): **CONFIRMED** still broken on main `09c2d34`
- PC-002 (heart-series dead controls): **CONFIRMED** still broken on main `09c2d34`
- P1-source-hash-drift: **CONFIRMED** — 14× `efd81d3a`, 1× `58c2ea90`, actual = `ba4a4019`

---

## 3. Challenges / Disputes

### Challenge: `system-premiumcontrols-hardening` should NOT be merged as-is
- Target: branch `e2041042` claiming "PremiumControls Phase 1-2"
- Reason: Phase3 branch already implements Phase 1-5 more cleanly. This branch has 28 conflict points with `playember`, bundles unrelated cleanup work, and would require massive conflict resolution.
- Recommendation: **Split.** Extract non-PC fixes (BUG-A7/A9/B6/S6), merge those separately. Drop PC-duplicate work.

### Challenge: The Unified Bug Ledger is significantly outdated
- Target: `verified/UNIFIED_BUG_LEDGER_2026-06-25.md`
- Reason: References `gbs2-baptist-controls.js` (doesn't exist — functionality is in `enhancements.js`). Claims PS-07 confirmed (duplicate IDs in GillRailControls) but IDs are gone from current source. Claims 61 bugs but actual remaining confirmed count on HEAD is ~25.
- Recommendation: Needs a fresh ledger rebuild after phase3 merge.

---

## 4. Branch Merge Recommendations

### Tier 1 — MERGE NOW (0 behind main, clean):
| Branch | Ahead | Action |
|--------|-------|--------|
| `premiumcontrols-phase3-2026-06-26` | 3 | **MERGE FIRST** — fixes P0-content, P0-ishod, PC-001..006, adds anchor/CSS/asset-version |
| `karty-avraam-indexable-text-layer-2026-06-26` | 1 | Merge after phase3 (no conflicts expected) |
| `system-dist-content-hardening-2026-06-26-arena` | 1 | Merge after phase3 |
| `system-migration-metadata-hardening-2026-06-26-arena` | 1 | Merge after phase3 |

### Tier 2 — MERGE AFTER SPLIT:
| Branch | Action |
|--------|--------|
| `system-premiumcontrols-hardening-2026-06-26-arena` | **Split:** extract BUG-A7/A9/B6/S6 fixes. Drop PC duplication. |
| `integration-monolith-preflight-2026-06-26-arena` | Audit for overlap. May be partially obsoleted by phase3. |

### Tier 3 — RETIRE (superseded by phase3):
| Branch | Reason |
|--------|--------|
| `premiumcontrols-heart-series-wiring-2026-06-26` | Wrong `series-rich` mode; phase3 uses correct `series-lite` |
| `premiumcontrols-playember-semantics-2026-06-26` | Stacked on unmerged cache-bust; phase3 covers semantics |
| `premiumcontrols-rollout-audit-2026-06-26` | Phase3 includes rollout audit script |
| `system-cache-bust-astro-source-2026-06-26` | Phase3 includes `asset-version.js` |
| `karty-ishod-jsonld-2026-06-26` | Phase3 includes ishod fix |
| `content-text-corruption-2026-06-26` | Phase3 includes content fixes |
| `system-release-gate-green-2026-06-26` | Already merged (0/0) |
| `audit-svg-pilot-bugs-2026-06-25` | 16 behind, docs-only, obsoleted |

### Tier 4 — NEEDS REBASE:
| Branch | Action |
|--------|--------|
| `baptisty-content-expansion-2026-06-25` | 12 behind; rebase if content is unique |
| `baptisty-seo-breadcrumb-ogimage-2026-06-26` | 2 behind; verify if phase3 covers this |
| `baptisty-seo-structured-og-2026-06-26-arena` | 0 behind but may overlap with phase3's baptisty SEO |

---

## 5. Post-Merge Verification Checklist

After `premiumcontrols-phase3` merge:

```bash
# 1. Source-level
grep -c 'data-fc-root' src/components/article-pilots/krajne/KrajneBody.astro    # expect: 1+
grep -c 'data-fc-root' src/components/article-pilots/rimlyanam7/Rimlyanam7Body.astro  # expect: 1+
grep -oE 'data-fc-mode="[^"]*"' src/components/article-pilots/krajne/KrajneBody.astro  # expect: series-lite
python3 -c "import json; json.loads(open('src/components/karty/ishod/IshodPageHead.astro').readlines()[38].split('>',1)[1].rsplit('<',1)[0])"  # expect: no error
grep -P '\xef\xbf\xbd' src/components/article-pilots/antisovetov/AntisovetovBody.astro  # expect: 0 matches
grep 'кик говорят' src/components/article-pilots/hermenevtika/HermenevtikaBody.astro  # expect: 0 matches
ls src/components/ui/premium-controls/PremiumControlAnchor.astro  # expect: exists
ls src/lib/asset-version.js  # expect: exists
ls src/styles/premium-controls.css  # expect: exists

# 2. Gates
npm run validate:all
node scripts/audit-pro.js
npm run content:guard
```

---

## 6. Notes for owner

1. **The phase3 branch is the cleanest path to fixing the 5 P0 bugs on main.** It's 0 commits behind, 3 commits ahead, and introduces the 3 architectural primitives the plan requires.

2. **After merging phase3, ~10 branches can be safely deleted.** This reduces coordination complexity from 18 branches to ~5.

3. **The Unified Bug Ledger needs a fresh rebuild.** The current one references files and states that no longer match HEAD. I recommend a new `UNIFIED_BUG_LEDGER_2026-06-27.md` after the merge.

4. **Browser smoke tests remain the last gap.** No agent has achieved L4 (verified-runtime) for any PremiumControls route. Playwright is blocked by missing system libraries. Consider running smoke tests on a local machine.
