# Proposal: MASTER_BUG_MATRIX.md Update — Add АУДИТ 1.0 + 1.1 + 1.2 Findings

## Identity

- **Project:** gb-is-my-strength
- **Proposed by:** arena-agent-audit-1-2 (verifier)
- **Date:** 2026-07-05
- **AuditRepo HEAD at proposal:** `3df4032` (verify(gb): АУДИТ 1.0 intake verification)
- **Proposal type:** matrix-update
- **Status:** PARTIALLY RESOLVED — matrix updated by 3df4032, some gaps remain

## Problem

MASTER_BUG_MATRIX.md had gaps from АУДИТ 1.0 + 1.1 + 1.2. Independent verifier (3df4032) updated the matrix for P0/P1 items. Remaining gaps from audit-1.1 and additional P2/P3 items still need entries.

## Current Matrix State (as of 3df4032)

✅ **Already added by 3df4032:**
- AUDIT-P0-SWBASELINE → P0 OPEN
- AUDIT-P1-FC-IMP → P1 OPEN (guard gap)
- AUDIT-IMPORTANT-COUNT-01 → P3 (metric gap, separate ID)
- SEC-001-VERIFIER → P1 OPEN (innerHTML XSS, site.js:288)
- AUDIT-ZINDEX-UNUSED-01 → P3 (in matrix via Pass 89)
- AUDIT-SEARCH-MINIFIED-01 → P3 (in matrix via Pass 89)

❌ **Still NOT in matrix (gaps):**
- AUDIT-P1-CI-GATE-GAP — P1, :light gate missing 3 checks (4th witness: me)
- AUDIT-P2-SW-PRECACHE-4 — P2, 4 lazy PRECACHE assets (upgrade from P3)
- AUDIT-P2-AR-STALE — P2, AuditRepo lags source
- AUDIT-P2-MATRIX-DRIFT — P2, 35/54/43 route divergence
- AUDIT-P2-SEARCH-TE — P3-INFO (downgraded: te() logic verified correct)
- AUDIT-P3-OG-LCP-MISMATCH — P3, 4 routes og:image ≠ LCP priority
- AUDIT-P3-SEARCH-LAZY-CONFIRMED — P3, Pass 56 lazy vs SW PRECACHE conflict

❌ **Rejection to note:**
- AUDIT-P2-NODE-REGEX — REJECTED as FABRICATED (mustScript doesn't exist)
- AUDIT-P3-REACT-UNDOCUMENTED — REJECTED as FALSE POSITIVE (React IS documented)

## Required Updates (remaining gaps)

### 1. ADD NEW BUGS (not in matrix)

| Bug ID | Title | Severity | Evidence | Repair Lane |
|--------|-------|----------|----------|-------------|
| AUDIT-P1-CI-GATE-GAP | :light gate missing 3 checks (astro:audit:article-mdx:strict, astro:audit:baptisty-series, sw:dist:audit) | **P1** | 4th witness: diff package.json full vs light | ci-gate-alignment |
| AUDIT-P2-SW-PRECACHE-4 | 4 lazy assets in SW PRECACHE (search.js, glossary.js, manifest.json, search-manifest.json) | **P2** | verified-source: grep PRECACHE_ASSETS sw.js | AUDIT-SW-HYGIENE |
| AUDIT-P2-AR-STALE | AuditRepo lags source by 2+ commits, 29+ passes not synthesized | **P2** | verified-AuditRepo: HEAD 3df4032 vs source 8c318010 | auditrepo-sync |
| AUDIT-P2-MATRIX-DRIFT | Migration matrix/ownership/sitemap: 35/54/43 routes | **P2** | verified-source: JSON parse divergence | migration-data-alignment |
| AUDIT-P3-OG-LCP-MISMATCH | 4 routes og:image ≠ LCP priority image | **P3** | verified-source: audit-pro INFO | seo-hardening |
| AUDIT-P3-SEARCH-LAZY-CONFIRMED | Pass 56 search lazy works in HTML, negated by SW PRECACHE | **P3** | verified-source: index.html:1110 inline loader + sw.js PRECACHE | ARCH-SEARCH |

### 2. UPDATE EXISTING BUGS

| Bug ID | Current State | Update |
|--------|---------------|--------|
| BUG-ARCH-001 | SW PRECACHE has 2 lazy assets | Update to: **4 assets** (search.js, glossary.js, manifest.json, search-manifest.json) |
| NEW-ACTIONLINT-CI-GAP | P3, confirmed-current | **Upgrade to P1** — 3 CI-YAML regressions in 24h, actionlint catches all, one-line fix |
| BUG-CI-002 | confirmed-current (3 witnesses) | Add: **4th witness** (arena-agent-audit-1-2). Consolidate with AUDIT-P1-CI-GATE-GAP |
| AUDIT-DEEP-STRUCTURE-01 | P3 (structural) | **Downgrade to INFO** — tooling fixed by Pass 89, evidence is real |

### 3. SEC-001-VERIFIER (NEW P1 — from 3df4032)

| Bug ID | Title | Severity | Evidence | Repair Lane |
|--------|-------|----------|----------|-------------|
| SEC-001-VERIFIER | site.js:288 owCard.innerHTML — 3 fields unescaped (w.transliteration, w.gloss, w.source) | **P1-SEC** | 3 fields wrapped in tt(), 3 fields raw. Defense-in-depth violation. | security-innerhtml-escape |

### 4. MERGE PROPOSALS (supporting Pass 89)

| Merge | Into | Bugs Merged |
|-------|------|-------------|
| CLEANUP-ALL | CLEANUP-ALL | BUG-CLEANUP-001 + 002 + 003 + 004 + BUG-CONFIG-003 |
| ARCH-SEARCH | ARCH-SEARCH | SEARCH-314..318 (5 bugs) + AUDIT-P3-SEARCH-LAZY-CONFIRMED + 24 SEARCH bugs → 5-7 architectural tasks |
| AUDIT-SW-HYGIENE | AUDIT-SW-HYGIENE | AUDIT-P0-SWBASELINE ✅ + AUDIT-P2-SW-PRECACHE-4 ❌ + BUG-ARCH-001 ✅ |

### 5. HEADER UPDATE

```
**Matrix HEAD:** 3df4032 (was 932af3f3 — PASS 71 stale)
**Source HEAD:** 8c318010
**Updated by:** arena-agent-audit-1-2 + independent verifier (3df4032)
**Date:** 2026-07-05
```

## Verification Evidence

All remaining gap bugs verified on SHA `8c318010` with verified-source or verified-AuditRepo evidence.

## Proposal status: partially-resolved

P0/P1 items added by 3df4032. Remaining: AUDIT-P1-CI-GATE-GAP, AUDIT-P2-SW-PRECACHE-4, AUDIT-P2-AR-STALE, AUDIT-P2-MATRIX-DRIFT, AUDIT-P3-OG-LCP-MISMATCH, AUDIT-P3-SEARCH-LAZY-CONFIRMED.

Awaiting next verifier to add remaining entries.