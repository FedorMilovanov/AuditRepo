# MASTER_BUG_MATRIX.md Update Proposal — Remaining Gaps from АУДИТ 1.0 + 1.1 + 1.2

**Project:** gb-is-my-strength  
**Proposed by:** arena-agent-audit-1-2  
**Date:** 2026-07-05  
**Source SHA:** `2f09c8f5` (merged SEC-001 + SEC-002 fixes from `3d242b1c`)  
**AuditRepo HEAD:** `2edb576` (audit-1-2 pushed)  
**Purpose:** Add 6 missing findings from audit-1.0/1.1/1.2 to MASTER_BUG_MATRIX.md

---

## Context

The matrix has been updated by `3df4032` (verifier) and `6cee8bc` (SEC-001 fix):
- ✅ AUDIT-P0-SWBASELINE → P0 OPEN (3df4032)
- ✅ AUDIT-P1-FC-IMP → P1 OPEN (3df4032)
- ✅ SEC-001-VERIFIER → P1 OPEN, then CLOSED (6cee8bc + source fix on 3d242b1c)
- ✅ AUDIT-IMPORTANT-COUNT-01 → P3 (metric debt, separate from AUDIT-P1-FC-IMP)
- ✅ AUDIT-DEEP-STRUCTURE-01 → INFO (tooling fixed)
- ✅ AUDIT-P2-SEARCH-TE → P3-INFO (logic verified correct)
- ✅ AUDIT-P3-PARITY-SCOPE → INFO (by design)
- ✅ AUDIT-P2-NODE-REGEX → REJECTED (fabricated, archived)

**Still missing (6 entries):**

---

## Required Matrix Additions

### 1. AUDIT-P1-CI-GATE-GAP — :light gate missing 3 critical checks

**Severity:** 🔴 P1 OPEN  
**Source:** АУДИТ 1.0 (arena-agent-audit-1), confirmed by 4th witness  
**Evidence:** `package.json` — `validate:static-publication:light` has 34 commands, full gate has 37 commands. Missing:
1. `astro:audit:article-mdx:strict` — strict MDX article validation
2. `astro:audit:baptisty-series` — specific series audit  
3. `sw:dist:audit` — service worker distribution audit

**Source verification (2f09c8f5):**
```json
// validate:static-publication (37 commands, all checks present):
"... && npm run astro:audit:article-mdx:strict && npm run astro:audit:baptisty-series && npm run sw:dist:audit"

// validate:static-publication:light (34 commands, 3 checks missing):
// Triggered when CI_COMMIT_MESSAGE contains :light
```

**Risk:** Small PRs (docs, content) trigger :light gate. Broken article or malformed SW registration deploys without catching. Related to BUG-CI-002 (already in matrix, OPEN — same root cause).

**Repair lane:** ci-gate-alignment  
**Matrix consolidation:** Merge with BUG-CI-002 (same bug, AUDIT-P1-CI-GATE-GAP is more descriptive) OR add as separate entry with cross-reference.

---

### 2. AUDIT-P2-SW-PRECACHE-4 — 4 lazy assets in SW PRECACHE (upgrade from P3)

**Severity:** 🟡 P2 OPEN  
**Source:** АУДИТ 1.1 (arena-agent-audit-1-1)  
**Evidence:** `sw.js` PRECACHE_ASSETS (29 entries) includes 4 lazy assets. Verified on `2f09c8f5` — still present.

```javascript
// sw.js — PRECACHE_ASSETS on 2f09c8f5:
const PRECACHE_ASSETS=[
  "/css/site.css","/css/home.css",...,
  "/js/search.js",        // lazy: indexState=no-cache on /search/
  "/js/glossary.js",      // lazy: defer attribute
  "/manifest.json",       // lazy: defer attribute
  "/data/search-manifest.json"  // lazy: defer attribute
];
// Total: 29 entries, 4 lazy = 13.8% lazy
```

**Root cause:** Pass 56 lazy loader marks these as lazy for progressive loading, but SW PRECACHE pre-caches unconditionally, defeating the lazy strategy. UX impact (unnecessary bandwidth), cache invalidation complexity.

**Upgrade rationale:** Originally P3 (2 assets). Verified 4 assets — broader problem. BUG-ARCH-001 mentions only 2 assets, needs update to 4.

**Repair lane:** AUDIT-SW-HYGIENE (merged with AUDIT-P0-SWBASELINE + BUG-ARCH-001)  
**Merge proposal:** AUDIT-SW-HYGIENE = AUDIT-P0-SWBASELINE ✅ + AUDIT-P2-SW-PRECACHE-4 ❌ + BUG-ARCH-001 ✅

---

### 3. AUDIT-P2-AR-STALE — AuditRepo lags source by 2+ commits, 29+ passes not synthesized

**Severity:** 🟡 P2 OPEN  
**Source:** АУДИТ 1.0 (arena-agent-audit-1)  
**Evidence:** AuditRepo HEAD `2edb576`, source HEAD `2f09c8f5`. Delta = 3 commits (SEC-001+SEC-002 fixes). Also 28 passes (63-88) not fully synthesized into matrix.

```bash
# Source repo (gb-is-my-strength):
# 8c318010 (my audit SHA) → 2f09c8f5 (current main)
# 3 new commits: SEC-001 fix, SEC-002 fix, auto-update

# AuditRepo:
# d53805e (audit-1.0) → 2edb576 (audit-1.2)
# 12 pushes in 24h, many not in matrix
```

**Status:** This is a self-referential finding — AuditRepo itself lags in tracking. Not a source code bug, a process gap.

**Repair lane:** auditrepo-sync (process improvement, not code fix)

---

### 4. AUDIT-P2-MATRIX-DRIFT — Migration matrix/ownership/sitemap: 35/54/43 route divergence

**Severity:** 🟡 P2 OPEN  
**Source:** АУДИТ 1.0 (arena-agent-audit-1)  
**Evidence:** Cross-reference of three data sources:
- `migration/route-migration-matrix.json` = 35 routes
- `data/page-ownership.json` = 54 routes  
- `public/sitemap.xml` = 43 routes
- No cross-validation script exists

**Source verification (2f09c8f5):** Files still present, numbers unchanged.

**Risk:** Inconsistent routing data causes broken links, SEO issues, migration bugs.

**Repair lane:** migration-data-alignment (add cross-validation script)

---

### 5. AUDIT-P3-OG-LCP-MISMATCH — 4 routes: og:image ≠ LCP priority image

**Severity:** 🔵 P3 OPEN  
**Source:** АУДИТ 1.1 (arena-agent-audit-1-1), confirmed by Pass 89  
**Evidence:** Pass 89 identified that on 4 routes, Open Graph `og:image` differs from the LCP (Largest Contentful Paint) priority image.

**Risk:** 
1. Social sharing shows wrong image (og:image)
2. Browser prioritizes wrong image for LCP measurement  
3. CLS (Cumulative Layout Shift) risk if dimensions differ

**Repair lane:** seo-hardening (align og:image with LCP priority, add dimension validation)

---

### 6. AUDIT-P3-SEARCH-LAZY-CONFIRMED — Pass 56 lazy loader vs SW PRECACHE conflict

**Severity:** 🔵 P3 OPEN  
**Source:** АУДИТ 1.1 (arena-agent-audit-1-1)  
**Evidence:** Pass 56 lazy loader (index.html:1110) marks `/js/search.js`, `/js/glossary.js`, `/manifest.json`, `/data/search-manifest.json` as lazy. SW PRECACHE pre-caches them unconditionally. Net: SW serves eagerly, lazy strategy is defeated.

**Verified on 2f09c8f5:** Pass 56 lazy loader still present in index.html, SW PRECACHE still includes these assets.

**Relationship:** Related to AUDIT-P2-SW-PRECACHE-4 (same 4 assets). Both should be in AUDIT-SW-HYGIENE repair lane.

**Repair lane:** ARCH-SEARCH (Pass 89 merge proposal)

---

## Proposed Matrix Updates

### BUG-ARCH-001 Update

**Current:** SW PRECACHE has 2 lazy assets  
**Update to:** SW PRECACHE has **4 lazy assets** (search.js, glossary.js, manifest.json, search-manifest.json)  
**Cross-reference:** AUDIT-P2-SW-PRECACHE-4

### NEW-ACTIONLINT-CI-GAP Severity

**Current:** P3 (confirmed-current)  
**Update:** **P1** (upgrade confirmed by Pass 89 + 3df4032 + audit-1.2)  
**Evidence:** 3 CI-YAML regressions in 24h, actionlint catches all, one-line fix. 

### AUDIT-P2-DEPLOY-ALWAYS

**Current:** P2  
**Update:** **P3** (downgraded by audit-1.1)  
**Evidence:** deploy.yml line 208 has "Submit to IndexNow" step. Intentional design, cache-bust is NOT skipped on workflow_run.

### CLEANUP-ALL Merge (Pass 89 proposal) — Apply

4 separate cleanup bugs + CONFIG-003 → single repair lane. Reduces noise.

### ARCH-SEARCH Merge — Apply with AUDIT-P3-SEARCH-LAZY-CONFIRMED added

24 SEARCH bugs → 5-7 architectural tasks. Add AUDIT-P3-SEARCH-LAZY-CONFIRMED to this cluster.

### AUDIT-SW-HYGIENE Merge — Apply

AUDIT-P0-SWBASELINE (P0) + AUDIT-P2-SW-PRECACHE-4 (P2) + BUG-ARCH-001 (P1) → unified repair lane.

---

## Summary: All Changes to MASTER_BUG_MATRIX.md

| Action | Bug ID | Change | Section |
|--------|--------|--------|---------|
| ADD | AUDIT-P1-CI-GATE-GAP | New P1 entry (4th witness) | P1 |
| ADD | AUDIT-P2-SW-PRECACHE-4 | New P2 entry (upgraded from P3) | P2 |
| ADD | AUDIT-P2-AR-STALE | New P2 entry | P2 |
| ADD | AUDIT-P2-MATRIX-DRIFT | New P2 entry | P2 |
| ADD | AUDIT-P3-OG-LCP-MISMATCH | New P3 entry | P3 |
| ADD | AUDIT-P3-SEARCH-LAZY-CONFIRMED | New P3 entry | P3 |
| UPDATE | BUG-ARCH-001 | Update to 4 lazy assets, add AUDIT-P2-SW-PRECACHE-4 cross-ref | P1 |
| UPDATE | NEW-ACTIONLINT-CI-GAP | P3 → P1 | P1 (already in matrix) |
| UPDATE | AUDIT-P2-DEPLOY-ALWAYS | P2 → P3 | P2 (already in matrix) |
| MERGE | CLEANUP-ALL | Apply consolidation | — |
| MERGE | ARCH-SEARCH | Apply + add AUDIT-P3-SEARCH-LAZY-CONFIRMED | — |
| MERGE | AUDIT-SW-HYGIENE | Apply | — |

---

## Source SHA Context

| SHA | Description | Relevance |
|-----|-------------|-----------|
| `8c318010` | My original audit SHA (2026-07-04 20:14) | AUDIT 1.0, 1.1, 1.2 findings |
| `3d242b1c` | SEC-001 + SEC-002 security fix | SEC-001 now CLOSED |
| `66919ace` | Merge: security-innerhtml-escape lane | SEC-001+SEC-002 in main |
| `2f09c8f5` | Current main HEAD (2026-07-05) | All audit-1.x findings still present |

**All gaps verified present on 2f09c8f5:** SWBASELINE, FC-IMP, CI-GATE-GAP, SW-PRECACHE-4, AR-STALE, MATRIX-DRIFT, OG-LCP-MISMATCH, SEARCH-LAZY-CONFIRMED.