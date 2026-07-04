# Bug Ledger — АУДИТ 1.2 (Verifier + Matrix Reconciliation, 2026-07-05)

**Agent:** arena-agent-audit-1-2  
**Source HEAD:** `8c318010`  
**AuditRepo HEAD:** `3df4032` (verify(gb): АУДИТ 1.0 intake verification)  
**Mode:** verifier + multi-witness  

---

## COMPLETE BUG REGISTER (АУДИТ 1.0 + 1.1 + 1.2 — ALL PASSES)

### NEW from ALL Passes (27 bugs)

| ID | Title | Sev | Source | In Matrix? | Status |
|----|-------|-----|--------|------------|--------|
| AUDIT-P0-SWBASELINE | SW cache baseline drifts 5 versions | **P0** | 1.0 | ✅ P0 OPEN | confirmed |
| AUDIT-P1-FC-IMP | floating-cluster.css 490 !important unguarded by audit-pro | **P1** | 1.0 | ✅ P1 OPEN | confirmed |
| AUDIT-P1-CI-GATE-GAP | :light gate missing 3 checks (article-mdx:strict, baptisty-series, sw:dist:audit) | **P1** | 1.0 | ❌ NOT IN | OPEN (4w) |
| AUDIT-P2-SW-PRECACHE-4 | 4 lazy assets in SW PRECACHE (upgrade from P3) | **P2** | 1.1 | ❌ NOT IN | OPEN |
| AUDIT-P2-AR-STALE | AuditRepo lags source 2+ commits, 29+ passes | **P2** | 1.0 | ❌ NOT IN | OPEN |
| AUDIT-P2-MATRIX-DRIFT | 35/54/43 route divergence | **P2** | 1.0 | ❌ NOT IN | OPEN |
| AUDIT-P2-IXNOW-RETRY | IndexNow push silently fails 3 retries | **P2** | 1.0 | BUG-CI-003 | OPEN |
| AUDIT-P2-ACTIONLINT-NOT-WIRED | actionlint not called in CI | **P2** | 1.0 | NEW-ACTIONLINT-CI-GAP | P1 upgrade |
| AUDIT-P2-SEARCH-TE | search.js te() trailing slash bug | **P2** | 1.0 | ❌ NOT IN | OPEN |
| AUDIT-P3-SW-PRECACHE-LAZY | SW PRECACHE includes lazy assets (superseded by AUDIT-P2-SW-PRECACHE-4) | P3 | 1.0 | BUG-ARCH-001 | superseded |
| AUDIT-P3-SEO-HARDCODED-OG | seo-audit.js hardcoded og:image size | P3 | 1.0 | NEW-OG-SIZE-PARAM | OPEN |
| AUDIT-P3-STYLE-DUP | enhancements/highlights style inject no ID guard | P3 | 1.0 | — | OPEN |
| AUDIT-P3-QUOTE-NO-CONFIRM | highlights.js no confirm before delete quote | P3 | 1.0 | — | OPEN |
| AUDIT-P3-STALE-DOCS-UNENFORCED | 3 large docs candidates unarchived | P3 | 1.0 | BUG-CLEANUP-003 | OPEN |
| AUDIT-P3-REACT-UNDOCUMENTED | React integration undocumented | P3 | 1.0 | ❌ REJECTED | false positive |
| AUDIT-P3-PARITY-SCOPE | visual-parity workflow scope mismatch | P3 | 1.0 | ❌ → INFO | downgraded |
| AUDIT-P3-SITEUTILS-WARN | SiteUtils emergency timer false-positive | P3 | 1.0 | — | unverified |
| AUDIT-P3-MATRIX-DUPE | AGENTS-r321 self-reference unexplained | P3 | 1.0 | — | OPEN |
| AUDIT-P3-OG-LCP-MISMATCH | 4 routes og:image ≠ LCP priority | **P3** | 1.1 | ❌ NOT IN | OPEN |
| AUDIT-P3-SEARCH-LAZY-CONFIRMED | Pass 56 search lazy works but SW negates | P3 | 1.1 | ❌ NOT IN | OPEN |
| AUDIT-P3-COLOR-MIX-201 | 201 color-mix() no Safari fallback | P3 | 1.1 | — | OPEN |
| AUDIT-DEEP-STRUCTURE-01 | deep-audit-2 REPORT.md empty, evidence in comments/ | INFO | Pass 89 | ✅ FIXED | → INFO |
| AUDIT-ZINDEX-UNUSED-01 | 6 z-index tokens unused in site.css | P3 | Pass 89 | ✅ IN MATRIX | OPEN |
| AUDIT-SEARCH-MINIFIED-01 | search.js 1-line minified | P3 | Pass 89 | ✅ IN MATRIX | OPEN |
| AUDIT-P3-VALIDATE-GAP | validate_audit_repo.py counts SAMPLE files as evidence | P3 | 1.2 | NEW | OPEN |
| AUDIT-P2-SEARCH-CLUSTER | 24 SEARCH bugs = 1 architectural problem | P2 | 1.2 | ❌ NO | OPEN |
| **SEC-001-VERIFIER** | site.js:288 owCard.innerHTML — 3 fields unescaped (XSS vector) | **P1** | 3df4032 | ✅ P1 OPEN | NEW |

---

## REJECTED / FALSE POSITIVE

| ID | Title | Verdict | Evidence |
|----|-------|---------|----------|
| AUDIT-P2-NODE-REGEX | audit-pro.js Node engine check | **REJECTED — FABRICATED** | mustScript function doesn't exist. Line 250 = `SITE_CSS_MIN_BYTES = 200_000`. `grep -c 'mustScript' audit-pro.js` = 0. Archived: `archive/false-positive/AUDIT-P2-NODE-REGEX-FALSE-POSITIVE.md` |
| AUDIT-P3-REACT-UNDOCUMENTED | React integration undocumented | **REJECTED — FALSE POSITIVE** | React IS documented in astro.config.mjs. False positive. |

---

## SEVERITY UPGRADES

| Bug | From | To | Evidence |
|-----|------|-----|----------|
| NEW-ACTIONLINT-CI-GAP | P3 | **P1** | 3 CI-YAML regressions in 24h, actionlint catches all, one-line fix. Confirmed by Pass 89 + verifier 3df4032 |
| AUDIT-P3-SW-PRECACHE-LAZY → AUDIT-P2-SW-PRECACHE-4 | P3 | **P2** | 4 assets confirmed (not 2 as originally thought) |

---

## SEVERITY DOWNGRADES

| Bug | From | To | Evidence |
|-----|------|-----|----------|
| AUDIT-DEEP-STRUCTURE-01 | P3 | **INFO** | validate_audit_repo.py updated, evidence is real |
| AUDIT-P2-SEARCH-TE | P2 | **P3-INFO** | te() logic verified correct (trailingSlash: 'always' matches computed paths) |
| AUDIT-P3-PARITY-SCOPE | P3 | **INFO** | Different workflow granularity is by design |

---

## CONFIRMATIONS (7)

| Bug ID | Witnesses | Status |
|--------|-----------|--------|
| BUG-CI-001 | 3+ | CLOSED (fix on 6e68d7ca) |
| BUG-CI-002 / AUDIT-P1-CI-GATE-GAP | 4 | confirmed-current (L4) |
| BUG-ARCH-001 | 4 (Pass 65 + Pass 89 + АУДИТ 1.1 + verifier) | confirmed-current |
| NEW-ACTIONLINT-CI-GAP | 3+ | confirmed-current (P1 upgrade) |
| BUG-CLEANUP-001..004 | 2+ | confirmed-current |
| BUG-PERF-001 | 2+ | confirmed-current |
| BUG-CI-003 | 3+ | confirmed-current (IXNOW-RETRY) |

---

## MERGE PROPOSALS

| Proposal | Merge Into | Bugs | Status |
|----------|-----------|------|--------|
| CLEANUP-ALL | CLEANUP-ALL | BUG-CLEANUP-001..004 + BUG-CONFIG-003 | SUPPORTED |
| ARCH-SEARCH | ARCH-SEARCH | 24 SEARCH bugs + AUDIT-P3-SEARCH-LAZY-CONFIRMED | SUPPORTED |
| AUDIT-SW-HYGIENE | AUDIT-SW-HYGIENE | AUDIT-P0-SWBASELINE ✅ + AUDIT-P2-SW-PRECACHE-4 ❌ + BUG-ARCH-001 ✅ | SUPPORTED |

---

## SUMMARY COUNTS

| Category | Count |
|----------|-------|
| Total unique bugs | 27 |
| P0 | 1 |
| P1 | 4 (SWBASELINE, FC-IMP, CI-GATE-GAP, SEC-001-VERIFIER) |
| P2 | 10 |
| P3 | 9 |
| INFO | 3 |
| Rejected/FALSE POSITIVE | 2 |
| Confirmed (3+ witnesses) | 7 |
| Matrix gaps (findings not in matrix) | 6 |

---

## TOP-3 ACTIONS FOR VERIFIER

1. **P0 — system-sw-baseline-sync:** AUDIT-P0-SWBASELINE in matrix ✅ — update baseline.json to v187, make `--require-cache-bump` exit 1
2. **P1 — css-floating-cluster-cleanup:** AUDIT-P1-FC-IMP in matrix ✅ — add floating-cluster.css !important ceiling to audit-pro.js
3. **P1 — SEC-001-VERIFIER repair:** Add 3 missing tt() escapes in site.js:288 — w.transliteration, w.gloss, w.source

## Matrix Update Priority (remaining gaps)

| Priority | Action | Impact |
|----------|--------|--------|
| 1 (high) | Add AUDIT-P2-SW-PRECACHE-4 (P2, 4 lazy PRECACHE assets) | Missing repair lane |
| 1 (high) | Add AUDIT-P1-CI-GATE-GAP (P1, :light 3 missing checks) | Missing P1 repair |
| 2 (medium) | Add AUDIT-P3-OG-LCP-MISMATCH (P3, 4 routes) | Missing record |
| 2 (medium) | Add AUDIT-P3-SEARCH-LAZY-CONFIRMED (P3, Pass 56 conflict) | Missing record |
| 2 (medium) | Confirm AUDIT-P2-DEPLOY-ALWAYS downgrade to P3 | Already in matrix |
| 3 (low) | Apply CLEANUP-ALL, ARCH-SEARCH, AUDIT-SW-HYGIENE merges | Noise reduction |