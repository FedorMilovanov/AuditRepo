# Fixed-source closure wave V1 — exact anchor `3aba5112`

**AuditRepo base:** `f58b8c73af9e095833d563e2d67d74dd97c7b234`  
**Exact source verification anchor:** `3aba5112f0fc37712e027a1ad1d8379debe54377`  
**Last exact production authority:** `abf1edba190280e554dfda085bef9fb6594c896d`  
**Production claim:** none

## Purpose

Reduce the verified backlog using the owner workflow: verify first, close fixed/stale findings canonically, and leave browser-only or still-current claims open. This transaction changes no product source and does not treat source movement as a reason for authority-only synchronization.

## Boundary and method

- The 17 fixed candidates from the SD-6..SD-15 intake were re-read.
- `A11Y-P1-01` and `QUAL-P1-04` remain open because their final disposition requires browser evidence.
- Source PR #709 / merge `8bd891b1371d4ac2438f9026e40a9c723856556b` explicitly closed the MapEngine runtime cluster and passed eight exact-head workflows. Comparing that merge to `3aba5112f0fc37712e027a1ad1d8379debe54377` shows no later change to `karty/_engine/map-engine.js`.
- Comparing the earlier inspection anchor `2273b8c930eebf383d429b917d3636bc28a80bae` to `3aba5112f0fc37712e027a1ad1d8379debe54377` shows no changes to the remaining evidence-critical owner files except `migration/page-ownership.json`; that registry was directly re-read on the exact anchor and contains the governed Karty routes.
- No still-open disposition from the 39 confirmed-current source/data set is changed here.

## Closed dispositions

| ID | Former section | Final disposition | Immutable/source reference |
|---|---:|---|---|
| `ASTRO-P1-02` | P1 | FIXED-CURRENT | `8bd891b1` |
| `ENGINE-P1-21` | P1 | FIXED-CURRENT | `8bd891b1` |
| `ENGINE-P1-22` | P1 | FIXED-CURRENT | `8bd891b1` |
| `ENGINE-P1-23` | P1 | FIXED-CURRENT | `8bd891b1` |
| `ENGINE-P1-28` | P1 | FIXED-CURRENT | `8bd891b1` |
| `MAP-P1-14` | P1 | FIXED-CURRENT | `8bd891b1` |
| `MAP-P1-15` | P1 | FIXED-CURRENT | `8bd891b1` |
| `CSS-P1-01` | P1 | FIXED-CURRENT | `8bd891b1` |
| `GATE-P1-02` | P1 | FIXED-CURRENT | `3aba5112` |
| `COMP-P1-01` | P1 | FIXED-CURRENT | `3aba5112` |
| `ASTRO-P1-04` | P1 | FIXED-CURRENT | `3aba5112` |
| `GATE-P1-04` | P2 | FIXED-CURRENT | `3aba5112` |
| `QUAL-P2-03` | P2 | STALE-ON-CURRENT-HEAD | `3aba5112` |
| `NEW-VOSK-FETCH-NO-ABORT` | P3 | FIXED-CURRENT | `3aba5112` |
| `AR-AUDIT-17` | P3 | STALE-ON-CURRENT-HEAD | `3aba5112` |

## Arithmetic

```text
canonical IDs: 358 -> 358
closed:        168 -> 183
open:          190 -> 175
P0:              0 -> 0
P1:             96 -> 85
P2:             36 -> 34
P3:             51 -> 49
Refactoring:     4 -> 4
AuditRepo:       3 -> 3
```

## Evidence sources

- `incoming/arena-sync-assessment/2026-08-01/VERIFIED_DISPOSITIONS.md`
- `incoming/arena-sync-assessment/2026-08-01/evidence/sd6_verified_on_2273b8c9.txt`
- `incoming/arena-sync-assessment/2026-08-01/evidence/sd9_data_validation.txt`
- `incoming/arena-sync-assessment/2026-08-01/evidence/sd11_sheet_engine_gate.txt`
- `incoming/arena-sync-assessment/2026-08-01/evidence/sd12_remaining_units.txt`
- `incoming/arena-sync-assessment/2026-08-01/evidence/sd13_tour_a11y.txt`
- `incoming/arena-sync-assessment/2026-08-01/evidence/sd14_gate_draw.txt`
- `incoming/arena-sync-assessment/2026-08-01/evidence/sd15_vosk_genealogy.txt`
- source PR #709 exact-head CI and merge evidence
- direct exact-anchor read of `migration/page-ownership.json`

## Next gate

The next verifier wave is browser/runtime evidence for 23 rows. Product repairs begin only for rows that remain `CONFIRMED-CURRENT` after that wave, in independent bounded lanes.
