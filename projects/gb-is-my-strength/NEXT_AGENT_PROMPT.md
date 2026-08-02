# NEXT AGENT PROMPT — gb-is-my-strength

> **Только текущая операционная правда.** Счётчики принадлежат `verified/MASTER_BUG_MATRIX.md`.

**Source main:** `5373c9854b3f1bb767cf18c4539de82db26b7b7a`
**Last exact production authority:** `abf1edba190280e554dfda085bef9fb6594c896d`
**Current source deployment status:** ⚠️ `source != production`; same-SHA production witness для текущего source отсутствует.
**Current reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-08-02_5373c985_matrix-reconciliation.md`
**Canonical matrix:** **358 IDs = 168 closed + 190 open**.

## 1. Точная граница source

- current source `main` = `5373c9854b3f1bb767cf18c4539de82db26b7b7a`;
- previous canonical source `efaf2a51b1fcc7b7d3f8c9558ecb5acf849df3b3` is **54 commits behind**;
- AuditRepo PR #120 merge-time anchor `8f17085dc8411cffbcb5a4dcd2f8fc5db9c30a97` is **9 commits behind**;
- the final nine commits add the Pihahiroth uncertainty release lane and modify Ishod projection files (`src/components/karty/ishod/IshodMap.astro`, `IshodPageHead.astro`, authority/contract/workflow files); therefore Ishod browser/runtime verdicts require a fresh exact-head witness and are not inherited source-only;
- active source owner: draft PR #680 NoteRegistry, based on `5373c9854b3f1bb767cf18c4539de82db26b7b7a`; do not modify its branch or owner files;
- no post-`abf1edba` source merge is production without a separate same-SHA witness.

## 2. Last exact production

- deploy `30669840189`, attempt `1`, event `push`;
- release SHA = control-plane SHA = `abf1edba190280e554dfda085bef9fb6594c896d`;
- candidate `abf1edba190280e554dfda085bef9fb6594c896d:30669840189-1`;
- release digest `sha256:9ae50fc99476af4822181889ac9d3a802138e06265d5ac09d80133f64563d50a`;
- candidate artifact `8808656612`; generic live `8808666936`; TTS `8808667707`;
- release ledger comment `5148074092`; physical Windows witness `5148209495`.

```text
current source = 5373c9854b3f1bb767cf18c4539de82db26b7b7a
last exact production = abf1edba190280e554dfda085bef9fb6594c896d
source != production
```

## 3. Матрица и AuditRepo

- `NEW-68` and `NEW-69` are separate closed canonical IDs; the former slash row counted as zero IDs, so the repair adds two canonical IDs;
- `AR-006` is closed and no longer counted in the open AUDITREPO section;
- counters: P0 0, P1 96, P2 36, P3 51, Refactoring 4, AuditRepo 3; total open 190; closed 168;
- rights-policy labels `RIGHT-4Q204-OPEN-SCHEMATIC` and `RIGHT-P72-TEXT-LINK-ONLY` are informational registry entries, not bugs;
- matrix coverage is blocking and must report zero diagnostics; CI uses `pipefail`, so `check_matrix_coverage.py | tee` cannot hide a non-zero exit;
- noncanonical table IDs, explicit CLOSED rows in open sections, heading/stat counter drift and unregistered reverify IDs are permanent blocking diagnostics.

## 4. Следующий порядок

1. Do not promote `5373c985` to production authority without exact same-SHA readiness → candidate → Pages/live → TTS → ledger evidence.
2. Do not interfere with active owner PR #680.
3. Re-run Ishod/Pihahiroth browser/runtime verification on the exact current source before changing related matrix statuses.
4. Keep canonical counters synchronized atomically between this file and `MASTER_BUG_MATRIX.md`.
