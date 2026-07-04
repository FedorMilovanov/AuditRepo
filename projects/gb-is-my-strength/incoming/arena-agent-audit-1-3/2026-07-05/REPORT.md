# Agent Work Report — АУДИТ 1.3 (CI-Gate Deep Dive + Matrix Sync)

**Project:** gb-is-my-strength (gospod-bog.ru)  
**Agent:** arena-agent-audit-1-3  
**Date:** 2026-07-05  
**Source HEAD:** `2f09c8f5` (merged SEC-001+SEC-002 from `3d242b1c`)  
**AuditRepo HEAD:** `2edb576` (audit-1-2)  
**Mode:** verifier / deep-dive / matrix-sync  
**Predecessors:** audit-1 (18 bugs), audit-1-1 (3 bugs), audit-1-2 (verifier)

---

## Executive Summary

АУДИТ 1.3 — follow-up на source SHA `2f09c8f5` (после SEC-001+SEC-002 фиксов) и углублённая проверка CI/CD механизмов. Ключевое открытие: `indexnow.yml` использует `validate:static-publication:light`, что подтверждает AUDIT-P1-CI-GATE-GAP как **production CI finding** (а не только local dev). SEC-001 зафиксен. 6 matrix gaps из предыдущих аудитов всё ещё не интегрированы.

---

## 1. VERIFIED: SEC-001 + SEC-002 Fixed on Source

### SEC-001-VERIFIER — CLOSED ✅

Source SHA `3d242b1c` (merged in `66919ace`, now at `2f09c8f5`):
- `js/site.js:288` — all 6 `owCard.innerHTML` fields now use `tt()` HTML escaper
- `w.transliteration`, `w.gloss`, `w.source` — previously raw, now escaped
- Verified by: `6cee8bc` (matrix updated, SEC-001 closed)

```javascript
// On 2f09c8f5 — site.js:288:
owCard.innerHTML = `<span class="hw">${tt(w.lang)}${tt(w.original)}</span>
  <span class="tr">${tt(w.transliteration)}</span>
  <span class="gx">${tt(w.gloss)}</span>
  <span class="src">${tt(w.source)}</span>...`;
// All 6 fields: tt() applied ✅
```

**Status:** ЗАКРЫТО in matrix. No further action.

### SEC-002 (NEW-SAFEURL-XSS-HARDENING) — CLOSED ✅

`safeUrl()` now blocks 4 URI schemes (javascript:, data:, vbscript:, unknown). Verified by `6cee8bc`. ЗАКРЫТО in matrix.

---

## 2. NEW FINDING: CI-Gate Gap Is a Production CI Issue

### AUDIT-P1-CI-GATE-GAP — Confirmed in Production CI ✅

**Severity:** 🔴 P1 (upgraded from "CI dev gap" to "production CI finding")  
**Source:** `2f09c8f5`, `.github/workflows/indexnow.yml:71`  
**Confidence:** HIGH  
**Evidence:**

```yaml
# .github/workflows/indexnow.yml:71 (on 2f09c8f5)
- name: Static publication gates
  run: npm run validate:static-publication:light
```

The `indexnow.yml` workflow submits URLs to IndexNow (search engine indexing service). 
It uses the `:light` gate which skips 3 critical checks:
1. `astro:audit:article-mdx:strict` — article-level MDX validation
2. `astro:audit:baptisty-series` — baptisty series audit  
3. `sw:dist:audit` — service worker distribution audit

**Critical risk:** If SW distribution is broken, IndexNow workflow passes (light gate ✅), 
but SW serves stale/malformed content. IndexNow submits URLs → search engines index 
stale/broken pages. This is NOT a local dev issue — it's a production CI issue.

**Impact chain:**
```
indexnow.yml → uses :light gate → skips sw:dist:audit → 
SW broken → IndexNow submits → search engines index wrong content → 
user finds broken page in Google → reputation damage
```

**Also: deploy.yml:101 uses full gate**
```yaml
# deploy.yml:101 — uses FULL gate (correct)
- name: Static publication gates
  run: npm run validate:static-publication
```

So the difference is:
- `deploy.yml` → full gate ✅ (catches all issues)
- `indexnow.yml` → :light gate ❌ (misses 3 checks including sw:dist:audit)

**Recommended fix:** Change `indexnow.yml:71` to use full gate:
```yaml
# indexnow.yml:71 — fix:
- name: Static publication gates
  run: npm run validate:static-publication
  # NOT: validate:static-publication:light
```

**Repair lane:** ci-gate-indexnow-fix  
**Matrix status:** Not yet in matrix. Needs entry (AUDIT-P1-CI-GATE-GAP, P1).

---

## 3. VERIFIED: Source Findings Still Present on 2f09c8f5

| Finding | Status on 2f09c8f5 | Evidence |
|---------|-------------------|---------|
| AUDIT-P0-SWBASELINE | ✅ PRESENT | CACHE_VERSION=gb-v187-pagefind-bootstrap-20260703, baseline v182 |
| AUDIT-P1-FC-IMP | ✅ PRESENT | floating-cluster.css 490 !important, audit-pro.js only checks site.css |
| AUDIT-P2-SW-PRECACHE-4 | ✅ PRESENT | PRECACHE_ASSETS 29 entries, 4 lazy (search.js, glossary.js, manifest.json, search-manifest.json) |
| AUDIT-P2-MATRIX-DRIFT | ✅ PRESENT | route-migration-matrix=35, page-ownership=54, sitemap=43 |
| AUDIT-P3-OG-LCP-MISMATCH | ✅ PRESENT | Pass 89 confirmed on original SHA, still present |
| AUDIT-P3-SEARCH-LAZY-CONFIRMED | ✅ PRESENT | Pass 56 lazy in index.html, SW PRECACHE overrides |

---

## 4. Matrix Gaps — Still Not Integrated

As of `2edb576` (audit-1-2 pushed), MASTER_BUG_MATRIX.md still missing:

| ID | Title | Priority | Evidence |
|----|-------|----------|----------|
| AUDIT-P1-CI-GATE-GAP | :light gate missing 3 checks, used by indexnow.yml | P1 | CI workflow evidence |
| AUDIT-P2-SW-PRECACHE-4 | 4 lazy PRECACHE assets | P2 | verified-source 2f09c8f5 |
| AUDIT-P2-AR-STALE | AuditRepo lags source | P2 | process observation |
| AUDIT-P2-MATRIX-DRIFT | 35/54/43 route divergence | P2 | verified-source |
| AUDIT-P3-OG-LCP-MISMATCH | 4 routes og:image ≠ LCP | P3 | Pass 89 confirmed |
| AUDIT-P3-SEARCH-LAZY-CONFIRMED | Pass 56 vs SW PRECACHE conflict | P3 | verified-source |

---

## 5. SEVERITY: No Changes Proposed

All severity proposals from audit-1-2 remain valid:
- NEW-ACTIONLINT-CI-GAP → P1 ✅ (already in matrix)
- AUDIT-DEEP-STRUCTURE-01 → INFO ✅ (already in matrix)
- AUDIT-P2-DEPLOY-ALWAYS → P3 ✅ (confirmed by audit-1-1)
- AUDIT-P3-SW-PRECACHE-LAZY → P2 (now AUDIT-P2-SW-PRECACHE-4) ✅ (pending matrix entry)

---

## 6. MERGE PROPOSALS — Status Update

| Proposal | Status | Updates |
|----------|--------|--------|
| CLEANUP-ALL | SUPPORTED | Awaiting matrix update |
| ARCH-SEARCH | SUPPORTED | Add AUDIT-P3-SEARCH-LAZY-CONFIRMED to cluster |
| AUDIT-SW-HYGIENE | SUPPORTED | Add AUDIT-P2-SW-PRECACHE-4 (verified 4 assets on 2f09c8f5) |

---

## 7. REVERIFICATIONS

| Bug | Result | Evidence |
|-----|--------|---------|
| SEC-001-VERIFIER | CLOSED (source fix on 3d242b1c) | 66919ace merge, verified site.js:288 |
| SEC-002 | CLOSED (source fix on 3d242b1c) | safeUrl() blocks 4 URI schemes |
| AUDIT-P1-CI-GATE-GAP | CONFIRMED (production CI) | indexnow.yml:71 uses :light gate |
| AUDIT-P0-SWBASELINE | CONFIRMED PRESENT | sw.js still v187, baseline still v182 |

---

## Evidence Log (SHA-First, 2f09c8f5)

| Evidence | Type | SHA | Source |
|----------|------|-----|--------|
| indexnow.yml:71 uses :light gate | verified-source | 2f09c8f5 | grep indexnow.yml |
| deploy.yml:101 uses full gate | verified-source | 2f09c8f5 | grep deploy.yml |
| SW CACHE_VERSION v187 | verified-source | 2f09c8f5 | grep sw.js |
| PRECACHE_ASSETS 29 entries, 4 lazy | verified-source | 2f09c8f5 | grep sw.js |
| site.js:288 — all 6 fields tt() | verified-source | 2f09c8f5 | grep site.js |
| SEC-001 closed in matrix | verified-AuditRepo | 6cee8bc | MASTER_BUG_MATRIX.md |
| audit-1-2 pushed | verified-AuditRepo | 2edb576 | git show |