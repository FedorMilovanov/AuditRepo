# Bug Ledger — АУДИТ 1.1 (Deep Dive Pass 2, 2026-07-05)

**Agent:** arena-agent-audit-1-1  
**Source HEAD:** `8c318010`  
**All gates verified:** GREEN ✅

---

## NEW BUGS (Pass 2 — 3 new, 2 upgrades)

| Temp ID | Title | Severity | Evidence Type | SHA Verified | Notes |
|---------|-------|----------|---------------|--------------|-------|
| AUDIT-P2-SW-PRECACHE-4 | SW PRECACHE contains 4 lazy-loaded assets (search.js, glossary.js, manifest.json, search-manifest.json) | **P2** (upgraded from P3) | verified-source | 8c318010 | 4 vs 2 assets — broader problem |
| AUDIT-P3-OG-LCP-MISMATCH | 4 routes have og:image ≠ LCP priority image | P3 | verified-source + audit-pro | 8c318010 | INFO level, intentional trade-off |
| AUDIT-P3-SEARCH-LAZY-CONFIRMED | Pass 56 search lazy loader works in HTML, negated by SW PRECACHE | P3 | verified-source | 8c318010 | Inline loader confirmed at index.html:1110 |

---

## UPGRADE/DOWNGRADE LOG

| Bug ID | Change | From | To | Reason |
|--------|--------|------|-----|--------|
| AUDIT-P3-SW-PRECACHE-LAZY | UPGRADE | P3 | **P2** | 4 assets (not 2) confirmed |
| AUDIT-P2-DEPLOY-ALWAYS | DOWNGRADE | P2 | **P3** | Intentional design — IndexNow submission is in deploy.yml post-deploy, safeguards work |
| AUDIT-P3-Z-INDEX-MAGIC | DOWNGRADE | P3 | **INFO** | 2147483000 is intentional technique for overlay stacking |

---

## CONFIRMATIONS (Pass 2)

| Bug ID | Matrix Entry | My Verdict | SHA | Notes |
|--------|-------------|-----------|-----|-------|
| AUDIT-P0-SWBASELINE | SW baseline drift | confirmed-current | 8c318010 | v187 vs v182, 5 versions |
| AUDIT-P1-FC-IMP | floating-cluster.css 490 !important | confirmed-current | 8c318010 | audit-pro.js only checks site.css |
| AUDIT-P1-CI-GATE-GAP | :light missing 3 checks | confirmed-current | 8c318010 | 37 vs 34 commands confirmed |
| BUG-CI-002 | CI gate gap | confirmed-current | 8c318010 | Same as AUDIT-P1-CI-GATE-GAP |
| BUG-CI-003 | IndexNow silent failure | confirmed-current + new finding | 8c318010 | DEPLOY-ALWAYS added context |
| AUDIT-P2-ACTIONLINT-NOT-WIRED | actionlint not called | confirmed-current | 8c318010 | check-workflows.js ≠ actionlint (different scope) |
| AUDIT-P2-AR-STALE | AuditRepo lags source | confirmed-current | d53805e | 2 commits behind, 10 passes unsynthesized |
| AUDIT-P2-MATRIX-DRIFT | 35/54/43 routes | confirmed-current | 8c318010 | matrix/ownership/sitemap divergence |
| BUG-ARCH-001 | SW PRECACHE lazy assets | confirmed-current | 8c318010 | Same as AUDIT-P2-SW-PRECACHE-4 |
| BUG-PERF-001 | Memory leaks 64 listeners | confirmed-current | 8c318010 | Code pattern confirms |

---

## COMPLETE BUG REGISTER (АУДИТ 1.0 + АУДИТ 1.1)

| ID | Severity | Title | Status |
|----|----------|-------|--------|
| AUDIT-P0-SWBASELINE | **P0** | SW cache baseline drifts 5 versions | OPEN |
| AUDIT-P1-FC-IMP | **P1** | floating-cluster.css 490 !important unguarded | OPEN |
| AUDIT-P1-CI-GATE-GAP | **P1** | validate:static-publication:light missing 3 checks | OPEN |
| AUDIT-P2-SW-PRECACHE-4 | **P2** | 4 lazy assets in SW PRECACHE (upgraded) | OPEN |
| AUDIT-P2-AR-STALE | **P2** | AuditRepo lags source by 2 commits + 10 passes | OPEN |
| AUDIT-P2-MATRIX-DRIFT | **P2** | Migration matrix/ownership/sitemap: 35/54/43 | OPEN |
| AUDIT-P2-NODE-REGEX | **P2** | audit-pro.js Node engine check broken regex | OPEN |
| AUDIT-P2-ACTIONLINT-NOT-WIRED | **P2** | actionlint registered KEEP but never invoked | OPEN |
| AUDIT-P2-SEARCH-TE | **P2** | search.js te() trailing slash bug OPEN | OPEN |
| AUDIT-P2-MATRIX-DRIFT | P2 | Migration data source divergence | OPEN |
| AUDIT-P3-OG-LCP-MISMATCH | P3 | 4 routes og:image ≠ LCP priority image | OPEN |
| AUDIT-P3-SEARCH-LAZY-CONFIRMED | P3 | Pass 56 search lazy works but SW negates | OPEN |
| AUDIT-P3-SEO-HARDCODED-OG | P3 | seo-audit.js hardcoded og:image no allowlist | OPEN |
| AUDIT-P3-COLOR-MIX-201 | P3 | 201 color-mix() no Safari fallback | OPEN |
| AUDIT-P3-STYLE-DUP | P3 | enhancements/highlights style inject no ID guard | OPEN |
| AUDIT-P3-QUOTE-NO-CONFIRM | P3 | highlights.js no confirm before delete quote | OPEN |
| AUDIT-P3-STALE-DOCS-UNENFORCED | P3 | 3 large doc candidates unarchived | OPEN |
| AUDIT-P3-REACT-UNDOCUMENTED | P3 | React integration not documented | OPEN |
| AUDIT-P3-SITEUTILS-WARN | P3 | SiteUtils emergency timer false-positive logic | OPEN |
| AUDIT-P3-MATRIX-DUPE | P3 | AGENTS-r321 self-reference unexplained | OPEN |
| AUDIT-P2-DEPLOY-ALWAYS | P3 (DOWN) | deploy.yml deploys on IndexNow failure | INFO |
| AUDIT-P3-Z-INDEX-MAGIC | INFO (DOWN) | z-index magic numbers intentional | INFO |

---

## REPAIR LANE UPDATE

| Lane | Bug IDs | Consolidated | Notes |
|------|---------|--------------|-------|
| `system-sw-baseline-sync` | AUDIT-P0-SWBASELINE + AUDIT-P2-SW-PRECACHE-4 + BUG-ARCH-001 | ✅ MERGE | Single SW hygiene lane |
| `ci-gate-alignment` | AUDIT-P1-CI-GATE-GAP + AUDIT-P2-ACTIONLINT-NOT-WIRED + BUG-CI-002/003 | ✅ MERGE | CI pipeline lane |
| `auditrepo-sync` | AUDIT-P2-AR-STALE + AUDIT-P2-SEARCH-TE | ✅ MERGE | AuditRepo process lane |
| `perf-cleanup` | BUG-PERF-001 + AUDIT-P2-SW-PRECACHE-4 + AUDIT-P3-SEARCH-LAZY-CONFIRMED | ✅ MERGE | Performance lane |
| `code-quality` | AUDIT-P3-STYLE-DUP + AUDIT-P3-QUOTE-NO-CONFIRM + AUDIT-P2-NODE-REGEX | ✅ MERGE | Code hygiene lane |
| `seo-hardening` | AUDIT-P3-SEO-HARDCODED-OG + AUDIT-P3-OG-LCP-MISMATCH | ✅ MERGE | SEO lane |

---

## TOP-5 ACTIONS (Consolidated from both passes)

1. **P0 — system-sw-baseline-sync**: baseline → v187; add SW hygiene to audit-pro
2. **P1 — css-floating-cluster-cleanup**: add floating-cluster.css !important ceiling to audit-pro.js
3. **P1 — ci-gate-alignment**: add 3 missing checks to :light gate; wire actionlint into deploy.yml
4. **P2 — perf-cleanup**: remove search.js, glossary.js, search-manifest.json from SW PRECACHE
5. **P2 — auditrepo-sync**: synthesize Pass 79-88 into matrix; update HEAD to 96959c93
