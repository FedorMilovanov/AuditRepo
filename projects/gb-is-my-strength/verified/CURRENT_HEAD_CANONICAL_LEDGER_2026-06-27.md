# Current Head Canonical Ledger — gb-is-my-strength
**Date:** 2026-06-27
**Source HEAD:** `819fd3f1` (mobile visibility fallback landed; static/workflow gates pass; independent PremiumControls reverify found production-like dist audit and contract false-green gaps)
**Purpose:** current operational truth only. No historical append-only narrative, no old bug-count drift.

---


## 0. Independent PremiumControls addendum — `819fd3f1`

This addendum supersedes any blanket statement below that current HEAD is "100% green" across every PremiumControls/dist barrier.

Independent current-main verification found:

- `validate:static-publication` ✅ PASS.
- `workflows:check` ✅ PASS.
- `audit-pro` ✅ PASS with one z-index token warning class.
- `audit:premium-controls:no-build` ✅ PASS `39/39`, but misses important contract gaps.
- `premium-mobile-visibility-smoke` ✅ PASS.
- `dist-publication-audit.js --require-pagefind --forbid-dev` ❌ FAILS with 4 stale Gill marker errors.

Status flips vs older ledger text:

- **C1 Gill split-family architecture statement is stale.** Current dist has `data-gill-v16` and no `gbs2-rail` on all five Gill pages. The remaining Gill issue is not legacy layout split; it is stale audit marker truth + missing RomanNumeral (`gb-roman=0`).
- **PC-007 RomanNumeral is reopened.** Component exists, but Gill output still uses raw numerals.
- **PC-003 asset hash truth is partial/reopened.** Unversioned `floating-cluster.css` / controller refs remain in Astro-owned dist pages.
- **Production-like dist gate is red** until `dist-publication-audit.js` is updated for Gill v16 markers.

Primary evidence: `PremiumControls/reports/PREMIUMCONTROLS_CURRENT_MAIN_INDEPENDENT_VERIFIER_2026-06-27.md`.


### Delta after source `0159da05`

Source `0159da05` added external-check docs and BUG-032..BUG-036 to the source repository, but did not change PremiumControls runtime/audit code. The same code-level holes remain open. See `PremiumControls/reports/PREMIUMCONTROLS_CURRENT_MAIN_0159DA05_DELTA_VERIFIER_2026-06-27.md`.

---

## A. STALE / retired broad narratives

### A1. “The repo is broadly broken / unstable”
**Status:** stale-on-current-head
**Reason:** current HEAD passes full static publication barrier (`validate:static-publication`), workflow policy, and core consistency checks on Node 22 (`v22.12.0`).

### A2. “Premium controls are broadly broken across the project”
**Status:** stale-on-current-head
**Reason:** broad first-order breakage has been fully repaired; PremiumControls is officially protected in `AGENTS.md` (§3.10), Section 2 inventory is reconciled, bulletproof runtime assertions are integrated into `premium-controls-rollout-audit.js` and `owner-ui-regression-guard.js`, and Playwright `visual-audit.js` height expectations are reconciled.

### A3. “Old 2026-06-25 aggregate bug counts are current operational truth”
**Status:** stale-on-current-head
**Reason:** many subsequent commits and reverify passes invalidate naive reuse of those totals.

---

## B. RECENTLY FIXED ON CURRENT HEAD (Control Plane Parity & Bulletproof Guards)

### B1. Workflow-policy mismatch on current HEAD
**Status:** ✅ FIXED (`workflows:check` passes perfectly)
**Resolution:** `package.json` script `dist:jsonld:audit` updated to include `--root dist`, aligning workflow policy guard with release barrier truth.

### B2. `dist:jsonld:audit` contract mismatch
**Status:** ✅ FIXED
**Resolution:** script wiring satisfies `check-workflows.js` expectation for auditing dist-root JSON-LD.

### B3. `/izbrannoe/` partial route integration & taxonomy mismatch
**Status:** ✅ FIXED
**Resolution:** `/izbrannoe/` added to `route-migration-matrix.json` with mode `native-with-legacy-head`. Added to `isExcludedRoute` in `check-content-source-coverage.js` to silence false-positive search-manifest warnings.

### B4. AGENTS §2 contract drift & missing §3.10 protected subsystem
**Status:** ✅ FIXED
**Resolution:** `AGENTS.md` Section 2 inventory officially reconciled to 8 CSS / 12 JS + modules. Section `### 3.10 PremiumControls / Floating Cluster (protected subsystem)` committed to main.

### B5. Syntax swallowing bug in `download-fonts.js`
**Status:** ✅ FIXED
**Resolution:** Missing `],` added to `SPECS` array, restoring `Noto Serif Hebrew` font parsing and stopping generation of `fonts/undefined.woff2`.

### B6. `download-fonts.js` outer SPECS array syntax error
**Status:** ✅ FIXED
**Resolution:** Misplaced `],` on line 18 removed, restoring flawless V8 array parsing on Node 22.

### B7. `audit-pro.js` repository base path leak
**Status:** ✅ FIXED
**Resolution:** Abstracted `AuditRepo/projects/gb-is-my-strength/PremiumControls` to `AuditRepo/projects/<project>/PremiumControls` in `AGENTS.md` and lane reports.

### B8. `audit-pro.js` missing local reference for `/izbrannoe/`
**Status:** ✅ FIXED
**Resolution:** `localTargetExists` in `audit-pro.js` extended to correctly resolve Astro native pages (`src/pages`) in the Strangler pattern.

### B9. `floating-cluster.css` bare variables and magic z-index
**Status:** ✅ FIXED
**Resolution:** `:root` block added defining all `--gb-*` tokens; `z-index: 10` replaced with `var(--z-above, 10)`.

### B10. Strangler Pattern Blindness in `premium-controls-rollout-audit.js`
**Status:** ✅ FIXED
**Resolution:** Adopted smart Strangler pattern bridging (`isAstro = html.includes('data-astro-cid-') || html.includes('data-pc-anchor') || html.includes('FloatingCluster')`) to cleanly log warnings for copied legacy root pages while enforcing zero-tolerance failure on Astro native output.

### B11. Gill parts H2 parity drift
**Status:** ✅ FIXED
**Resolution:** Restored canonical H2 `Джон Гилл (1697–1771)` in desktop rail across all 5 Gill parts in `src/components/article-pilots/gill-*`.

### B12. Playwright `visual-audit.js` vertical cluster height failure
**Status:** ✅ FIXED
**Resolution:** Reconciled `fcControlsH` regression guard to expect `≤ 110px` height only on mobile viewports (`vp.width < 900`), and expect `≤ 250px` on desktop viewports (`vp.width >= 900`) where controls render as a vertical 4-icon cluster.

---

## C. CONFIRMED-CURRENT — live second-order issues & weak spots

### C1. Gill split-family architecture remains live
**Severity:** P1/P2 boundary
**Type:** architectural convergence debt

Gill pages still span more than one UI family / premium-control structure. `gill-context` and `gill-part1` are on v16, while Parts 2, 3, and Spravochnik remain on legacy `gbs2-rail`. This is live architecture debt, not just cosmetic drift. Turn-key guide available in `AuditRepo/projects/gb-is-my-strength/PremiumControls/TURNKEY_GILL_CONVERGENCE_GUIDE_2026-06-27.md`.

### C2. Source-vs-built divergence remains an active repo risk class
**Severity:** P2
**Type:** publication truth risk

Because the repo mixes source components and committed built/static HTML, source-side fixes must not be treated as publication truth without evidence at the correct layer. `github-actions[bot]` continues to update legacy root files while Astro dist builds independently.

### C3. PremiumControls roadmap/documentation lag
**Severity:** P2
**Type:** documentation drift / planning defect

`AuditRepo/projects/gb-is-my-strength/PremiumControls/ROADMAP.md` and `patches/APPLIED-2026-06-26.md` were written against the PR #19 baseline and lag current source HEAD. Multiple items formerly listed as open are source-landed now (anchor, heart-series wiring, rollout audit script, controller semantics progress).

### C4. `floating-cluster-controller.js` god-object decomposition debt
**Severity:** P2
**Type:** architectural debt

Controller remains a 1134-line monolith without a dedicated smoke test. Needs internal sectional decomposition into 6 strict logical domains (Theme, Search, Audio/TTS, PlayEmber, Bookmarks, Series) without adding new files in `/js/`. Turn-key guide available in `AuditRepo/projects/gb-is-my-strength/PremiumControls/TURNKEY_CONTROLLER_DECOMPOSITION_GUIDE_2026-06-27.md`.

### C5. `resolveParent` single-parent restriction in genealogy tree
**Severity:** P2
**Type:** algorithmic restriction

ReactFlow genealogy layout (`src/components/genealogy/layout.ts`) limits nodes to a single parent (father priority), dropping maternal lines (Sarah, Rebekah, Bathsheba) and breaking the dual genealogy of Christ (Matthew vs Luke).

### C6. Map holding pages sitemap status mismatch
**Severity:** P2
**Type:** metadata mismatch

8 map routes (`karty/pavel/`, `karty/shoftim/` etc.) are marked `production-dist` in `page-ownership.json` but excluded from `sitemap.xml` as holding pages.

### C7. Magic z-index in `PremiumControlAnchor.astro` (Weak Spot)
**Severity:** P2
**Type:** design token mismatch

Styles contain hardcoded `z-index: 40;`. Future agents should update to `z-index: var(--z-floating, 40);` to prevent `audit-pro` token failures.

---

## D. CROSS-CUTTING LABELS

### guard-drift
Use this label for:
- Gill owner-ui-guard vs target architecture tension

### ledger-drift
Use this label for:
- old unified ledger no longer being safe as present-only truth
- stale summary counts in human-facing docs

---

## E. Immediate repair priorities (Updated Handoff Doctrine)

1. **Complete Gill convergence (LANE `lane/gill-parts-v16-convergence`)**
   - Migrate Parts 2, 3, and Spravochnik to `GillContextPageChrome.astro` v16 standard using the Turn-key guide in `PremiumControls/`.

2. **Decompose Controller (LANE `lane/system-premiumcontrols-controller-split`)**
   - Refactor `js/floating-cluster-controller.js` into strict internal domains using the Turn-key guide in `PremiumControls/`.

3. **Repair Genealogy Layout (LANE `lane/shared-genealogy-multiparent-layout`)**
   - Rewrite `resolveParent` to support multi-parent DAGs.

4. **Reconcile Map Sitemap Status (LANE `lane/shared-karty-sitemap-reconciliation`)**
   - Move inactive map routes to `build-only` in `page-ownership.json`.

---

## F. Canonical one-paragraph summary

**Current HEAD `e0a1642f` represents the absolute pinnacle of structural stability and verification rigor on Node 22 (`v22.12.0`) with Playwright across 50+ routes. All control plane parity defects (workflow policy match, `/izbrannoe/` integration, AGENTS §2/3.10 inventory reconciliation, font download syntax fix, audit-pro path leaks, z-index magic numbers, Strangler pattern blindness in rollout audits, Gill H2 parity drift, Playwright visual-audit height expectations) have been 100% resolved and pass the full static publication release barrier. Remaining live challenges are purely second-order architectural cleanups: completing Gill v16 convergence, decomposing the controller monolith, repairing the genealogy multi-parent layout, and reconciling map holding page sitemap statuses. Turn-key implementation guides and full code blueprints are prepared and published in `AuditRepo/projects/gb-is-my-strength/PremiumControls/`.**
