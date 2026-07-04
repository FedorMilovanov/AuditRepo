# 🟢 CURRENT TRUTH — 2026-07-05 (READ FIRST)

**Source HEAD:** `6e68d7ca` (fix(ci): remove duplicate run: key — re-enable submenu audit)
**AuditRepo HEAD:** pending (Pass 64 — deep CI + deletions audit)
**Branches:** `origin/main` only (zero stale branches in both repos)
**CI:** ✅ **All P0 blockers closed** — BUG-CI-001 fixed, deletions audit passed

## ✅ P0 fixed — BUG-CI-001

| Bug | Description | Fix | Commit |
|-----|-------------|-----|--------|
| BUG-CI-001 | deploy.yml duplicate `run:` key — submenu audit disabled | Deleted line 156 | `6e68d7ca` ✅ |

## ✅ Deletions Audit — no regressions

Verified 11 major deletions (GillRailControls, site-layered.css, premium-controls, legacy utils, _headers, etc.). All were dead code or duplicates. Zero broken asset references, 63/63 JSON-LD valid, 22/22 cache-bust versions correct.

## Open items summary

| Уровень | Open | Closed | Всего |
|---------|------|--------|-------|
| P0 | 0 | 4 | 4 |
| P1 | 2 | 8 | 10 |
| P2 | 3 | 15 | 18 |
| P3 | 3 | 5 | 8 |
| Refactor | 4 | 0 | 4 |
| Cleanup | 5 | 0 | 5 |
| AuditRepo | 3 | 0 | 3 |
| **Total** | **20** | **32** | **52** |

## Ключевые документы

- `verified/MASTER_BUG_MATRIX.md` — consolidated canonical truth (Pass 64 updated)
- `incoming/arena-agent-pass63/REPORT.md` — Pass 64 deep CI audit report

## P1 items (non-blocking but important)

- BUG-CI-002: `validate:static-publication:light` пропускает 3 gates (MDX strict, baptisty series, SW dist)
- BUG-CI-003: indexnow.yml push retry — silent failure после 3 неудачных попыток

## P2 items (advisory)

- BUG-ARCH-001: SW PRECACHE_ASSETS содержит lazy-loaded файлы (search-manifest.json, search.js)
- BUG-SEO-001: IndexNow submit до Pages CDN propagation
- BUG-011: 23 px breakpoints (reclassified, no visual regression)

---

**Historical addendums archived:** `archive/2026-07-04-next-agent-prompt-history/`
