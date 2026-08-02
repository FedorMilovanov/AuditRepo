# NEXT AGENT PROMPT — gb-is-my-strength

> **Только текущая операционная правда.** Счётчики принадлежат `verified/MASTER_BUG_MATRIX.md`.

**Verified product/evidence anchor:** `fc1085c805d72e6d43f58a6383c680d4e886183b`
**Source main observed after anchor:** `6cfa7468e033ed44dac79b9752b127f406d33724` (four workflow/control-plane-only commits after the anchor)
**Last exact production authority:** `abf1edba190280e554dfda085bef9fb6594c896d`
**Deployment status:** ⚠️ verified anchor `!=` production; no post-production same-SHA witness.
**Current reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-08-02_69d1e72a_third-pass-gate-hardening.md`
**Canonical matrix:** **358 IDs = 168 closed + 190 open**.

## 1. Точная граница source

- verified product/evidence anchor = `fc1085c805d72e6d43f58a6383c680d4e886183b`;
- former canonical source `efaf2a51b1fcc7b7d3f8c9558ecb5acf849df3b3` is **65 commits behind the verified anchor**;
- AuditRepo PR #120 merge-time anchor `8f17085dc8411cffbcb5a4dcd2f8fc5db9c30a97` is **20 commits behind the verified anchor**;
- the first 9 commits after PR #120 add the Pihahiroth uncertainty lane and modify Ishod projection surfaces, so Ishod browser/runtime verdicts still require a fresh exact-head witness;
- the next 11 commits up to `fc1085c8` affect Wave12/search/visual-policy files only and do not touch the earlier Karty/Vosk/genealogy evidence-critical paths;
- four later commits through `6cfa7468` only remove completed workflow writers and pin actions in the Pihahiroth/Wave12 release workflows; they do not change product, Karty/Ishod data or matrix evidence;
- future source movement does not silently change matrix statuses: a new status requires a new exact-head reverify;
- active source owner: draft PR #680 at `a231a5005f92d5f1e677ea87ece8bfb6a9dc31d7`; do not modify its branch or owner files;
- no post-`abf1edba` source merge is production without a separate same-SHA witness.

## 2. Last exact production

- deploy `30669840189`, attempt `1`, event `push`;
- release SHA = control-plane SHA = `abf1edba190280e554dfda085bef9fb6594c896d`;
- candidate `abf1edba190280e554dfda085bef9fb6594c896d:30669840189-1`;
- release digest `sha256:9ae50fc99476af4822181889ac9d3a802138e06265d5ac09d80133f64563d50a`;
- candidate artifact `8808656612`; generic live `8808666936`; TTS `8808667707`;
- release ledger comment `5148074092`; physical Windows witness `5148209495`.

```text
verified product/evidence anchor = fc1085c805d72e6d43f58a6383c680d4e886183b
source main later observed = 6cfa7468e033ed44dac79b9752b127f406d33724
last exact production = abf1edba190280e554dfda085bef9fb6594c896d
verified anchor != production
```

## 3. Матрица и AuditRepo

- `NEW-68` and `NEW-69` are separate closed canonical IDs; the former slash row counted as zero IDs, so the repair adds two canonical IDs;
- `AR-006` is closed and no longer counted in the open AUDITREPO section;
- counters: P0 0, P1 96, P2 36, P3 51, Refactoring 4, AuditRepo 3; total open 190; closed 168;
- rights-policy labels `RIGHT-4Q204-OPEN-SCHEMATIC` and `RIGHT-P72-TEXT-LINK-ONLY` are informational registry entries, not bugs;
- matrix coverage is blocking and must report zero diagnostics; CI uses `pipefail`, so `check_matrix_coverage.py | tee` cannot hide a non-zero exit;
- noncanonical table IDs, explicit closed rows in open sections, missing/duplicate section or statistics counters, per-category drift, archive-only open evidence, duplicate registry keys and unregistered reverify IDs are permanent blocking diagnostics.

## 4. Следующий порядок

1. Do not promote any post-`abf1edba` source SHA to production authority without exact same-SHA readiness → candidate → Pages/live → TTS → ledger evidence.
2. Do not interfere with active owner PR #680.
3. Re-run Ishod/Pihahiroth browser/runtime verification on an exact chosen source SHA before changing related matrix statuses.
4. Keep canonical counters synchronized atomically between this file and `MASTER_BUG_MATRIX.md`.
