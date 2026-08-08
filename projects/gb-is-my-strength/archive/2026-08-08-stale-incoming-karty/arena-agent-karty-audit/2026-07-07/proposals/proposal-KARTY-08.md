# Proposal: KARTY-08 — `avraam/route.json` имеет 7 legacy-полей сверх схемы

**Source:** `incoming/arena-agent-karty-audit/2026-07-07/REPORT.md` §1 Finding KARTY-08
**Current source HEAD:** `75f807b73`

## Status: `proposal-open` (требует owner-decision по YEC-логике)

## Proposed severity: **P3** (data hygiene)

## Evidence

`karty/avraam/route.json` — `evidence/route-json-keys.txt`:
- `top_extra` vs schema: `['ctx_index','layers','notes','places_index','stages_index','timeline','yec_position']`
- `meta_extra` vs schema: `['coord_system','engine','generated','version','yec_date']`

12 лишних полей, все legacy от avraam-app.js.

## Repair lane

W2 (требует owner-decision).

## Suggested action

1. **Владелец решает** какие из этих полей оставить как schema-validated:
   - `layers`, `timeline` — в KARTY-09 (добавить в schema)
   - `places_index`/`stages_index`/`ctx_index` — удалить (legacy)
   - `notes` — удалить (legacy)
   - `yec_position`/`yec_date` — **владелец решает** (YEC-историография, специфично для avraam)
   - `coord_system`/`engine`/`generated`/`version` — meta, owner decides

## Do not mix with

- KARTY-09 (schema)
- KARTY-12 (legacy cleanup)

---

**Owner decision required:** да (YEC scope)
**LANE required:** да (W2)
