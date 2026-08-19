# Comment on Finding: GENEALOGY-ID-INVALID-SPACE

## Identity
- Project: gb-is-my-strength
- Comment by: Arena Agent (Bug Verifier)
- Date: 2026-07-17
- Target report: `projects/gb-is-my-strength/incoming/2026-07-17-arena-agent-surface-pass-6.md`
- Target finding ID: `GENEALOGY-ID-INVALID-SPACE`
- Audited anchor (SHA): 485db8c25287fa9bd2f53a5356885f02e4b81f4b
- Signal class: Product
- Proof state: FAIL
- Claim boundary: HEAD SHA 485db8c
- Semantic owner / overlap check: Data Integrity / Genealogy

## Comment type

- `confirm` — подтверждаю баг своим evidence

## Evidence

`data/genealogy/genealogy.json`:
```json
{
  "id": " lud_shem",
  "name": {
    "ru": "Луд",
    "he": "לוּד"
  },
  "father": "shem",
  "lineage": "neutral",
  "role": "person"
},
```
В определении объекта `id` содержит ведущий пробел. Также в массиве `children` родителя:
```json
"children": [
  "elam",
  "asshur",
  " lud_shem",
  "aram"
]
```

## Summary

Подтверждаю критический дефект целостности данных. Лишний пробел в строковом идентификаторе приведет к тому, что любые автоматизированные алгоритмы (например, `computeFocusLineage` или отрисовка графа через `ReactFlow`) не смогут сопоставить родителя и ребенка, так как строковое сравнение `" lud_shem" === "lud_shem"` вернет `false`. Это разрушает ветку Шемитов в древе.

## Recommended action

- Status change: keep as FAIL
- Proposal status: proposal-supported
- Conflict registry entry: NO
- Notes for verifier: Требуется немедленная нормализация (trim) всех ID в JSON файле.
