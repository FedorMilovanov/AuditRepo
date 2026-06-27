# Current Head Canonical Ledger — gb-is-my-strength
**Date:** 2026-06-27  
**Source HEAD:** `d5b2460f` (merged to main via `lane/system-premiumcontrols-reconciliation-2026-06-27`)  
**Purpose:** current operational truth only. No historical append-only narrative, no old bug-count drift.

---

## A. STALE / retired broad narratives

### A1. “The repo is broadly broken / unstable”
**Status:** stale-on-current-head  
**Reason:** current HEAD passes full static publication barrier, workflow policy, and core consistency checks.

### A2. “Premium controls are broadly broken across the project”
**Status:** stale-on-current-head  
**Reason:** broad first-order breakage has been fully repaired; PremiumControls is officially protected in `AGENTS.md` (§3.10) and Section 2 inventory is reconciled.

### A3. “Old 2026-06-25 aggregate bug counts are current operational truth”
**Status:** stale-on-current-head  
**Reason:** many subsequent commits and reverify passes invalidate naive reuse of those totals.

---

## B. RECENTLY FIXED ON CURRENT HEAD (Control Plane Parity)

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

---

## C. CONFIRMED-CURRENT — live second-order issues

### C1. Gill split-family architecture remains live
**Severity:** P1/P2 boundary  
**Type:** architectural convergence debt

Gill pages still span more than one UI family / premium-control structure. `gill-context` and `gill-part1` are on v16, while Parts 2, 3, and Spravochnik remain on legacy `gbs2-rail`. This is live architecture debt, not just cosmetic drift.

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

Controller remains a 1051-line monolith without a dedicated smoke test. Needs internal sectional decomposition into 6 strict logical domains (Theme, Search, Audio/TTS, PlayEmber, Bookmarks, Series) without adding new files in `/js/`.

### C5. `resolveParent` single-parent restriction in genealogy tree
**Severity:** P2  
**Type:** algorithmic restriction

ReactFlow genealogy layout (`src/components/genealogy/layout.ts`) limits nodes to a single parent (father priority), dropping maternal lines (Sarah, Rebekah, Bathsheba) and breaking the dual genealogy of Christ (Matthew vs Luke).

### C6. Map holding pages sitemap status mismatch
**Severity:** P2  
**Type:** metadata mismatch

8 map routes (`karty/pavel/`, `karty/shoftim/` etc.) are marked `production-dist` in `page-ownership.json` but excluded from `sitemap.xml` as holding pages.

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
   - Migrate Parts 2, 3, and Spravochnik to `GillContextPageChrome.astro` v16 standard.

2. **Decompose Controller (LANE `lane/system-premiumcontrols-controller-split`)**
   - Refactor `js/floating-cluster-controller.js` into strict internal domains.

3. **Repair Genealogy Layout (LANE `lane/shared-genealogy-multiparent-layout`)**
   - Rewrite `resolveParent` to support multi-parent DAGs.

4. **Reconcile Map Sitemap Status (LANE `lane/shared-karty-sitemap-reconciliation`)**
   - Move inactive map routes to `build-only` in `page-ownership.json`.

---

## F. Canonical one-paragraph summary

**Current HEAD `d5b2460f` has fully resolved all control plane parity defects (workflow policy match, `/izbrannoe/` integration, AGENTS §2/3.10 inventory reconciliation, font download syntax fix). Its remaining live challenges are purely second-order architectural cleanups: completing Gill v16 convergence, decomposing the controller monolith, repairing the genealogy multi-parent layout, and reconciling map holding page sitemap statuses.**
