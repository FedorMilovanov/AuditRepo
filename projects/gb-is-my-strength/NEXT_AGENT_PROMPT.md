# 🟠 CURRENT TRUTH — 2026-07-05 (READ FIRST)

**Source HEAD:** `e5942361` (fix(images): Gill series image audit fixes)
**AuditRepo HEAD:** pending (Pass 64 — deep CI audit)
**Branches:** `origin/main` only (zero stale branches in both repos)
**CI:** ⚠️ **P0 blocker open** — BUG-CI-001 (deploy.yml duplicate `run:` key)

## ⚠️ P0 CI Blocker — требует немедленного fix

| Bug | Description | Fix |
|-----|-------------|-----|
| BUG-CI-001 | deploy.yml строки 155–156: два `run:` ключа в одном step. Второй перезаписывает первый. `gill:pre-v16-submenu:audit` (105 checks) НЕ ЗАПУСКАЕТСЯ. | Удалить строку 156 (`run: npx playwright install --with-deps chromium`). Playwright уже установлен в step 152. |

## Open items summary

| Уровень | Open | Closed | Всего |
|---------|------|--------|-------|
| P0 | 1 | 3 | 4 |
| P1 | 2 | 8 | 10 |
| P2 | 3 | 15 | 18 |
| P3 | 3 | 5 | 8 |
| Refactor | 4 | 0 | 4 |
| AuditRepo | 3 | 0 | 3 |
| **Total** | **16** | **31** | **47** |

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
