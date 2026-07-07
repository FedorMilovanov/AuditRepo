# Proposal: KARTY-10 — добавить `scripts/check-karty-routes.js` (validation gate)

**Source:** `incoming/arena-agent-karty-audit/2026-07-07/REPORT.md` §1 Finding KARTY-10
**Current source HEAD:** `75f807b73`

## Status: `proposal-open`

## Proposed severity: **P2** (preventive gate gap)

## Evidence

- `MapEngine.validateRoute()` (line 178) — существует, но не вызывается в CI
- `find . -name "check-karty-routes*"` — нет такого скрипта
- 10 route.json без сквозной валидации

## Repair lane

W1 (FAST).

## Suggested action

Создать `scripts/check-karty-routes.js`:

```js
const ajv = require('ajv');
const schema = require('../karty/_shared/route.schema.json');
const validate = ajv.compile(schema);
let errors = 0;
for (const route of ['avraam','ishod','early-church','maccabim','melachim','pavel','revelation','shoftim','shvatim','yeshua']) {
  const data = require(`../karty/${route}/route.json`);
  if (!validate(data)) {
    console.error(`${route}:`, validate.errors);
    errors++;
  }
}
process.exit(errors > 0 ? 1 : 0);
```

Добавить в `package.json`:
```json
"check:karty-routes": "node scripts/check-karty-routes.js"
```

Wire into `strangler:audit:production-like` (per `SUPER_AUDIT_W7`).

## Do not mix with

- KARTY-09 (schema patch)
- KARTY-16 (uniqueItems)

---

**Owner decision:** нет
**LANE:** нет
**Estimated LOC:** ~80
**Можно одной PR** с KARTY-09, KARTY-13, KARTY-16
