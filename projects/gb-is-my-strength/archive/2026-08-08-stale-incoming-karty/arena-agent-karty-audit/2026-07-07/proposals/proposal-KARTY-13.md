# Proposal: KARTY-13 — `avraam-app.js` не вызывает `MapEngine.validateRoute()` на init

**Source:** `incoming/arena-agent-karty-audit/2026-07-07/REPORT.md` §1 Finding KARTY-13
**Current source HEAD:** `75f807b73`

## Status: `proposal-open`

## Proposed severity: **P3** (preventive)

## Evidence

`karty/avraam/avraam-app.js:677`:
```js
window.AvraamRouteAudit = window.MapEngine?.validateRoute ? window.MapEngine.validateRoute(window.AvraamRouteData) : null;
```

Вызов **существует** (line 677), но:
- Только как audit (сохранение в global для проверки)
- Не используется для panic-early на broken route
- Line 680-682: только `compareRouteData` (drift-check), без `validateRoute`

## Repair lane

W1 (FAST).

## Suggested action

1. В `avraam-app.js` init:
```js
if (window.MapEngine?.validateRoute) {
  const result = window.MapEngine.validateRoute(route);
  if (!result.ok) {
    console.error('[avraam] route.json validation failed:', result.errors);
    if (result.errors.length > 0) {
      // show user-facing error
      container.innerHTML = '<div class="me-error">...</div>';
      return;
    }
  }
  if (result.warnings.length > 0) {
    console.warn('[avraam] route.json warnings:', result.warnings);
  }
}
```

2. То же для всех 10 маршрутов (после KARTY-01 — подключение engine к 8 заглушкам).

## Do not mix with

- KARTY-10 (там про CI gate)
- KARTY-09 (там schema)

---

**Owner decision:** нет
**LANE:** нет
**Estimated LOC:** ~20
**Можно одной PR** с KARTY-09, KARTY-10, KARTY-16
