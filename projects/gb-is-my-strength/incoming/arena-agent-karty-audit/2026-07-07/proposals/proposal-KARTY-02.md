# Proposal: KARTY-02 — 8 karty-заглушек не имеют `<noscript>` fallback

**Source:** `incoming/arena-agent-karty-audit/2026-07-07/REPORT.md` §1 Finding KARTY-02
**Current source HEAD:** `75f807b73`

## Status: `proposal-open`

## Proposed severity: **P3** (a11y, no-JS users)

## Evidence

- `grep -c noscript karty/*/index.html`:
  - 8 заглушек: 0
  - `karty/ishod/index.html` (эталон): 0 (только theme inline)
  - `karty/avraam/index.html`: 1 (Y.Metrika only, не content)
  - `karty/index.html` (hub): 1 (Y.Metrika only)

- При отключённом JS пользователь видит пустой экран (только h1 sr-only + JSON-LD)

## Expected

sr-only список мест и этапов (в стиле h1 в `karty/ishod/index.html:42`):
```html
<noscript>
  <div class="me-fallback" style="padding:2rem;max-width:800px;margin:0 auto">
    <h2>Места карты (route.json)</h2>
    <ol>...11 places, 4 stories, 6 stages...</ol>
    <p>Включите JavaScript для интерактивной карты.</p>
  </div>
</noscript>
```

## Repair lane

W9 (вместе с KARTY-01).

## Suggested action

1. Создать `karty/_shared/noscript-fallback.html` (или JS-template)
2. Подключить во все 10 route.json (после init)
3. Тест: `playwright --js-disabled` на 10 маршрутах

## Do not mix with

- KARTY-01 (там про UI, тут про fallback)
- KARTY-15 (это про ishod, отдельная proposal)

---

**Owner decision:** нет (low-risk, можно в W1)
**LANE:** нет (FAST)
