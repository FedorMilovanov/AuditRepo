# Proposal: KARTY-15 — `karty/ishod/index.html` (эталон) не имеет `<noscript>` fallback

**Source:** `incoming/arena-agent-karty-audit/2026-07-07/REPORT.md` §1 Finding KARTY-15
**Current source HEAD:** `75f807b73`

## Status: `proposal-open`

## Proposed severity: **P3** (a11y)

## Evidence

- `karty/ishod/index.html` — 68 строк, **нет `<noscript>`** для content (только theme inline)
- При отключённом JS — пустой экран (только h1 sr-only + JSON-LD)

## Repair lane

W9 (sub-task к KARTY-02 — добавить во все 10 route, начиная с эталона).

## Suggested action

Добавить в `karty/ishod/index.html` после `<div id="stage">`:

```html
<noscript>
  <div class="me-fallback" style="padding:2rem;max-width:800px;margin:0 auto;color:#e9e4d6;font-family:Georgia,serif">
    <h2>Маршрут Исхода — список мест (без JavaScript)</h2>
    <p>Включите JavaScript для интерактивной карты. Текстовый список:</p>
    <ol>
      <!-- 11 places из route.json (вручную или template) -->
    </ol>
  </div>
</noscript>
```

(для других маршрутов — аналогично с их places)

## Do not mix with

- KARTY-02 (там 8 заглушек, тут эталон ishod)

---

**Owner decision:** нет
**LANE:** нет (FAST)
**Estimated LOC:** ~20
