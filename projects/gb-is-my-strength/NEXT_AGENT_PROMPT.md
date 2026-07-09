# NEXT AGENT PROMPT — gb-is-my-strength

> **Current as of 2026-07-09.**  
> Source `main`: `30d9fb61fe2c9116ee53a54d681c01455eef4fe6`.  
> Initial Gill V10 baseline: `ac26d8efa2b952df6dc46eef05908e6d65287e82`.  
> AuditRepo canonical matrix: `verified/MASTER_BUG_MATRIX.md`.  
> Gill V10 intake: `incoming/gpt-5-5-gill-series-master-audit/2026-07-09/`.

## Before any work

```bash
git fetch --all --prune
git checkout main
git pull --ff-only
git rev-parse HEAD
```

1. Compare source HEAD with `30d9fb61`.
2. If it moved, record a reverify delta before relying on this handoff.
3. Read source-repo `AGENTS.md`, `docs/WORK_MODES.md`, and `docs/OWNER-INVARIANTS.md`.
4. Read AuditRepo:
   - `verified/START_HERE.md`
   - `verified/MASTER_BUG_MATRIX.md`
   - Gill V10 `REPORT.md`
   - Gill V10 master artifact
   - `evidence/REVERIFY_DELTA_30d9fb61.md`.

## Current state

```text
P0  6
P1  6
P2 11
P3 19
Refactor 4
AuditRepo 3
Total active 49
```

The six P0s are Gill-series structural publication blockers. They do not mean the production site is wholly unavailable.

## Current-head Gill change

Merge PR #50 restored two Part III figures without changing `GillPart3ArticleBody.astro`.

New P2:

```text
GILL-V10-RESTORED-FIGURE-RELOCATION
```

The figures are server-rendered after the article and moved into place by inline JS; the burial anchor matches exact Russian prose. Do not call this fixed or harmless without browser, no-JS, Pagefind and print verification.

## Gill task truth

Do **not** start by writing Part IV.

Required sequence:

```text
1. canonical content source
2. series manifest
3. generated outline / Reader AST
4. remove legacy III/IV/V internal numbering
5. direct semantic ownership of restored figures
6. content ownership manifest
7. deduplicate/reorder Part III
8. Research canonical/superseded statuses
9. relocate doctrine from Parts II–III
10. expand historical Introduction
11. author Part IV
12. publish all projections atomically
```

### Page ownership

```text
Introduction = historical/legal/confessional/print/urban world
Part I       = personal biography and pastoral formation
Part II      = scholarship, method, publication and intellectual workflow
Part III     = reception, controversy as history, influence, final life and death
Part IV      = doctrine, disputed texts and evaluation
Reference    = works, chronology, glossary, editions, sources, corrections
```

### Part IV

Use:

```text
Часть IV. Богословие
Спорные тексты и логика спасения в системе Джона Гилла
```

Distinguish:

- seven disputed texts;
- two positive soteriological anchors (`John 3:3`, `Romans 8:30`).

Do not put `7` or `9` into the permanent H1.

## Separate lanes — do not mix

### Gill content/architecture

Owner editorial decision required before moving prose.

### PremiumControls / Floating Cluster visual work

Do not alter rail geometry or visual behavior in a content lane.

### TTS model delivery

`TTS-DL-CONSENT` remains an owner decision. Save-Data is not explicit consent. Do not combine this with Gill article restructuring.

### Glossary/Bible data

Coordinate before touching owner-edited data.

## Older SUPER_AUDIT

`verified/SUPER_AUDIT_2026-07-06_14a49be8.md` is supporting historical evidence, not an automatically current repair order. Reverify each W1–W10 claim against current source HEAD before implementation.

## Hard rules

1. One subsystem per PR.
2. SHA-first: no current SHA, no repair-ready claim.
3. A green workflow step is evidence only when the failure path is strict and the checked/deployed SHA is explicit.
4. Astro↔legacy parity is not content truth.
5. Do not weaken a gate to make migration pass; replace obsolete contracts with stronger semantic contracts.
6. Do not edit or delete another agent’s incoming evidence.
7. Browser claims require browser evidence.
8. Update AuditRepo atomically with source repair.

## Required final report format

```text
Source functional SHA / bot SHA / deployed SHA:
AuditRepo SHA:
Canonical matrix IDs:
Root cause:
Owner decision used:
Fix + files:
Tests / mutation tests:
Production-like result:
Remaining risks:
AuditRepo update:
```

## AuditRepo branch validation

For documentation-only AuditRepo work:

```bash
python3 scripts/check_auditrepo_structure.py
python3 scripts/validate_audit_repo.py
```

No merge claim without those results.