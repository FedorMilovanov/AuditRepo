# Proposal: KARTY-12 — удалить 4 legacy-ключа из `avraam/route.json`

**Source:** `incoming/arena-agent-karty-audit/2026-07-07/REPORT.md` §1 Finding KARTY-12
**Current source HEAD:** `75f807b73`

## Status: `proposal-open` (зависит от KARTY-06)

## Proposed severity: **P3** (cleanup)

## Evidence

`karty/avraam/route.json` имеет:
- `places_index` — дубль `places` (для legacy avraam-app.js)
- `stages_index` — дубль `stages`
- `ctx_index` — дубль `ctx`
- `notes` — комментарии, не нужны движку

После KARTY-06 (миграция avraam-app.js → engine) эти поля **становятся неиспользуемыми**.

## Repair lane

W9 (sub-task к KARTY-06).

## Suggested action

1. После KARTY-06: удалить `places_index`, `stages_index`, `ctx_index`, `notes` из `karty/avraam/route.json`
2. Удалить fallback-логику в avraam-app.js (если ещё не удалена в KARTY-06)

## Do not mix with

- KARTY-08 (там YEC-поля, эти — технические legacy)

---

**Owner decision:** нет (cleanup, после KARTY-06)
**LANE:** да (W9, sub-task)
**Estimated LOC:** -200 в route.json
