# Bug Ledger — АУДИТ 1.0 (2026-07-05)

**Agent:** arena-agent-audit-1  
**Source HEAD:** `96959c93`  
**Verdict:** multi-witness / source-first  
**Confidence:** all findings verified-source or verified-build

---

## NEW BUGS (not in MASTER_BUG_MATRIX.md)

| Temp ID | Title | Severity | Confidence | Evidence Type | Verified on SHA | Suggested Lane |
|---------|-------|----------|------------|---------------|-----------------|----------------|
| AUDIT-P0-SWBASELINE | SW cache baseline drifts 5 versions | P0 | HIGH | verified-source + verified-build | 8c318010 | system-sw-baseline-sync |
| AUDIT-P1-FC-IMP | floating-cluster.css 490 !important unguarded | P1 | HIGH | verified-source | 8c318010 | css-floating-cluster-cleanup |
| AUDIT-P1-CI-GATE-GAP | validate:static-publication:light missing 3 checks | P1 | HIGH | verified-source | 8c318010 | ci-gate-alignment |
| AUDIT-P2-AR-STALE | AuditRepo lags source by 2 commits, 29 passes unsynthesized | P2 | HIGH | verified-source + verified-AuditRepo | dbb128c | auditrepo-sync |
| AUDIT-P2-MATRIX-DRIFT | Migration matrix vs ownership vs sitemap: 35/54/43 | P2 | HIGH | verified-source | 8c318010 | migration-data-alignment |
| AUDIT-P2-NODE-REGEX | audit-pro.js Node engine check broken regex | P2 | HIGH | verified-source | 8c318010 | code-quality |
| AUDIT-P2-IXNOW-RETRY | IndexNow push silently fails all 3 retries | P2 | HIGH | verified-source | 8c318010 | ci-fix-emergency |
| AUDIT-P2-ACTIONLINT-NOT-WIRED | actionlint registered but never invoked in CI | P2 | HIGH | verified-source + cross-file | 8c318010 | ci-gate-actionlint |
| AUDIT-P2-SEARCH-TE | search.js te() trailing slash bug still OPEN | P2 | MEDIUM | documented + unverified | 8c318010 | search-te-bug |
| AUDIT-P3-SW-PRECACHE-LAZY | SW PRECACHE includes lazy-loaded search assets | P3 | HIGH | verified-source | 8c318010 | perf-cleanup |
| AUDIT-P3-SEO-HARDCODED-OG | seo-audit.js hardcoded og:image size, no allowlist | P3 | HIGH | verified-source + history | 8c318010 | seo-hardening |
| AUDIT-P3-STYLE-DUP | enhancements/highlights style inject no ID guard | P3 | HIGH | verified-source | 8c318010 | code-quality |
| AUDIT-P3-QUOTE-NO-CONFIRM | highlights.js no confirm before delete quote | P3 | HIGH | verified-source | 8c318010 | code-quality |
| AUDIT-P3-STALE-DOCS-UNENFORCED | 3 large doc candidates unarchived, no size guard | P3 | HIGH | verified-source | 8c318010 | archive-giant-docs |
| AUDIT-P3-REACT-UNDOCUMENTED | React integration not documented in astro.config.mjs | P3 | HIGH | verified-source | 8c318010 | docs-react-bundle |
| AUDIT-P3-PARITY-SCOPE | visual-parity workflow scope differs from package.json | P3 | HIGH | verified-source | 8c318010 | css-architecture |
| AUDIT-P3-SITEUTILS-WARN | SiteUtils emergency timer false-positive warn logic | P3 | MEDIUM | verified-source | 8c318010 | code-quality |
| AUDIT-P3-MATRIX-DUPE | AGENTS-r321 self-reference unexplained | P3 | HIGH | verified-source | 8c318010 | docs-repair |

---

## CONFIRMATIONS (already in MASTER_BUG_MATRIX)

| Bug ID | Matrix Entry | My Verdict | Witness Type | SHA |
|--------|-------------|-----------|--------------|-----|
| BUG-CI-002 | CI gate gap — :light missing 3 checks | confirmed-current | verified-source | 96959c93 |
| BUG-CI-003 | IndexNow silent push failure | confirmed-current | verified-source | 96959c93 |
| NEW-ACTIONLINT-CI-GAP | actionlint not wired | confirmed-current | verified-source + cross-file | 96959c93 |
| BUG-ARCH-001 | SW PRECACHE includes lazy assets | confirmed-current | verified-source | 96959c93 |
| BUG-PERF-001 | Memory leaks 64 listeners | confirmed-current | verified-source | 96959c93 |

---

## CHALLENGES

| Target ID | My Challenge | Recommended Status |
|-----------|-------------|-------------------|
| BUG-ASTRO-CONFIG-001 (Pass 88) | False positive — React has documented use in src/components/react/ | downgrade to INFO |
| AGENTS-r321 | Self-reference "renumbered from r312 — was duplicate of r312" unexplained | clarification needed |

---

## MERGE PROPOSALS

| Proposal | New ID | Merge Into |
|----------|--------|-----------|
| SW hygiene consolidation | AUDIT-SW-HYGIENE | AUDIT-P0-SWBASELINE + BUG-ARCH-001 + AUDIT-P3-SW-PRECACHE-LAZY |
| Lane: system-sw-hygiene | — | — |

---

## SEVERITY CHANGES

| Bug | Current | Proposed | Evidence |
|-----|---------|----------|----------|
| NEW-ACTIONLINT-CI-GAP | P3 | P2 | High leverage, fast-track marked but unimplemented |
| BUG-ASTRO-CONFIG-001 | P3 | INFO | False positive |

---

## SUMMARY COUNTS

| Category | Count |
|----------|-------|
| New bugs found | 18 |
| New P0 | 1 |
| New P1 | 2 |
| New P2 | 6 |
| New P3 | 9 |
| Confirmations | 5 |
| Challenges | 2 |
| Merge proposals | 1 |
| Severity changes | 2 |

---

## TOP-3 RECOMMENDED ACTIONS

1. **P0**: Update `migration/sw-cache-version-baseline.json` to v187; make `--require-cache-bump` exit 1 in CI
2. **P1**: Add floating-cluster.css !important ceiling to audit-pro.js; add 3 missing checks to `:light` gate
3. **P2**: Wire actionlint into deploy.yml; synthesize Pass 79-88 into matrix; fix search.js te() bug
