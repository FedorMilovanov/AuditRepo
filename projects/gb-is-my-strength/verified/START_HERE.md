# OWNER / NEXT-AGENT START HERE — gospod-bog.ru

> Date: **2026-07-09**  
> Current source `main`: `ff55161b6858a1bbb0fad5704a11c6b41c961879`  
> Gill functional tree audited: `30d9fb61fe2c9116ee53a54d681c01455eef4fe6`  
> Net compare: no changed files  
> Research checked: `58e1ea5fab638812ae693a1d0b1e79c4dcb47131`

## Canonical verified documents

- [`MASTER_BUG_MATRIX.md`](./MASTER_BUG_MATRIX.md) — canonical open/carry-over ledger.
- `START_HERE.md` — this canonical owner/agent handoff.

## Supporting historical evidence

- `SUPER_AUDIT_2026-07-06_14a49be8.md` — system audit tied to old source SHA; retain as evidence, reverify before repair use.

## Active non-canonical Gill layers

- [`../working/START_HERE_2026-07-09.md`](../working/START_HERE_2026-07-09.md) — 11 Gill V10 candidates structured as a working matrix.
- [`../verification/START_HERE_2026-07-09.md`](../verification/START_HERE_2026-07-09.md) — independent witness queue and promotion rules.
- [`../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/REPORT.md`](../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/REPORT.md) — raw official intake evidence.
- [`../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/evidence/REVERIFY_DELTA_ff55161.md`](../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/evidence/REVERIFY_DELTA_ff55161.md) — current-head freshness proof.

## Correct project counts

| Category | Count |
|---|---:|
| Historical closed/fixed | 90 |
| Canonical P0 open | 0 |
| Canonical P1 open | 2 |
| Canonical P2 open | 10 |
| Canonical P3 open | 19 |
| Refactoring | 4 |
| AuditRepo | 3 |
| **Canonical open/carry-over total** | **38** |
| **Gill V10 pending candidates** | **11** |

Correct wording:

```text
38 canonical carry-over rows from the base ledger
+ 11 Gill V10 candidates pending cross-verification
```

The 38 carry-over rows were not mass-reverified by the Gill intake; recheck a selected row on current source before repair or status change.

## Gill V10 status

The Gill package currently has one direct source witness from this intake:

```text
verified-source
needs-cross-verification
not repair-ready
```

Six candidates have a proposed P0 publication-blocker severity, four have proposed P1 and one has proposed P2. These severities are not canonical until verification accepts them.

## Current-head corrections already made

1. The functional audit advanced from `ac26d8e` to `30d9fb61`; the seven-commit delta was reviewed.
2. Current `GillSeriesRail.astro` correctly renders numbered progress as `Часть X из 3`; the earlier `3 из 5` subclaim was removed.
3. PR #50 introduced runtime relocation of two Part III figures; its no-JS/Pagefind/print/TTS impact remains a candidate requiring witnesses.
4. Later source commits `273ac48e` and `ff55161b` have an empty net file diff against `30d9fb61`; the functional tree is unchanged.
5. No new Gill row was promoted directly from raw intake into verified truth.

## Owner decisions that may proceed while verification runs

These are editorial/product decisions, not bug-status promotions:

### Page ownership proposal

```text
Introduction = historical world
Part I       = person/biography
Part II      = scholarly method and publication
Part III     = reception, influence and final life
Part IV      = doctrine, disputed texts and evaluation
Reference    = chronology, works, glossary and source matrix
```

### Part IV title proposal

```text
Часть IV. Богословие
Спорные тексты и логика спасения в системе Джона Гилла
```

### Evidence-set proposal

- seven disputed/universal-redemption texts;
- two positive soteriological anchors;
- no `7` or `9` in the permanent H1.

These remain proposals until the owner accepts them.

## What the next agent should do

1. Recheck source HEAD against `ff55161b`.
2. If it moved, compare from the audited functional tree and record a new reverify delta.
3. Work from `verification/START_HERE_2026-07-09.md`.
4. Supply independent source/build/browser witnesses for one candidate lane.
5. Record an explicit verifier decision before source implementation.
6. Keep Gill content, PremiumControls visual work, TTS model delivery and glossary data in separate lanes.

## Hard rules

- SHA-first.
- One subsystem per source PR.
- Raw intake is evidence, not canonical truth.
- One source witness is not `confirmed-current`.
- Browser claims require browser evidence.
- Do not edit or delete another agent’s incoming evidence.
- Only `repair-ready` rows may be handed to implementation.

## AuditRepo branch validation

The branch must pass:

```bash
python3 scripts/check_auditrepo_structure.py
python3 scripts/validate_audit_repo.py
```

The GitHub Actions workflow result must correspond to the final PR head.