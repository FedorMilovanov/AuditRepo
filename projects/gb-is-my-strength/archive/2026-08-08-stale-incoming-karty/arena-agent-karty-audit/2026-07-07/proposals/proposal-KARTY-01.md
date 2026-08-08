# Proposal: KARTY-01 — 8 karty-маршрутов = намеренные noindex-заглушки (reclass P1→P3)

**Source:** `incoming/arena-agent-karty-audit/2026-07-07/REPORT.md` §1 Finding KARTY-01
**Current source HEAD:** `75f807b73` (verified, на проде, deploy run `28829729903`)

## Status: `proposal-open`

## Proposed severity: **P3** (originally P1, reclassified)

## Why downgraded from P1 → P3

Original severity P1 предполагал «deploy-blocking regression». Но при проверке current HEAD обнаружено:

1. Все 8 заглушек содержат JSON-LD `description`:
   > «Карта временно снята с витрины до ручной визуальной доводки: масштаб, подписи, мобильный вид и общее качество.»

2. Это **публично задокументированный намеренный статус** (владелец сам в HTML).
3. Заглушки исключены из sitemap через `data-pagefind-ignore` (per `MASTER_BUG_MATRIX.md:190`).
4. `check-map-publication-status.js` энфорсит noindex-набор (per `fable-super-audit/2026-07-06/REPORT.md:49` — CONFIRMED).

Это **не регрессия**, это **roadmap**. W9 (per SUPER_AUDIT) — активация MapEngine для всех 10 маршрутов.

## Evidence

- `evidence/karty-html-scripts.txt` (JSON-LD description всех 8)
- `evidence/file-inventory.txt` (все 10 route.json присутствуют, валидны)
- `comments/comment-on-BUG-SITEMAP-8-KARTY-MISSING.md` (cross-link)

## Repair lane

**W9 — MapEngine activation** (владелец нужен для sign-off после visual QA).

## Suggested action

1. ✅ Сохранить `BUG-SITEMAP-8-KARTY-MISSING` как `intentional / not-a-bug`
2. ⏳ В W9: подключить `<script src="../_engine/map-engine.js"></script>` + init-код (по образцу `karty/ishod/index.html`) к каждой из 8 заглушек
3. ⏳ Перед активацией — visual QA владельца (KARTY-01 указывает, что именно требует доводки)

## Do not mix with

- `BUG-SITEMAP-8-KARTY-MISSING` (там уже RESOLVED; это **extension**, не duplicate)
- `KARTY-02` (это про `<noscript>` fallback, отдельная proposal)
- `KARTY-15` (это про ishod, отдельная proposal)

---

**Owner decision required:** да (visual QA перед активацией W9)
**LANE required:** да (W9 — main delivery lane)
**Cross-agent:** fable-super-audit (2026-07-06) уже CONFIRMED намеренность
