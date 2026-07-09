# NEXT AGENT PROMPT — gb-is-my-strength

> **Current as of 2026-07-09.**  
> Source `main`: `30d9fb61fe2c9116ee53a54d681c01455eef4fe6`.  
> Research: `58e1ea5fab638812ae693a1d0b1e79c4dcb47131`.

## Before any work

```bash
git fetch --all --prune
git checkout main
git pull --ff-only
git rev-parse HEAD
```

1. Compare source HEAD with `30d9fb61`.
2. If it moved, create a reverify delta before using the Gill candidate map.
3. Read source-repo `AGENTS.md`, `docs/WORK_MODES.md`, and `docs/OWNER-INVARIANTS.md`.
4. Read AuditRepo by layer:
   - `verified/START_HERE.md`
   - `verified/MASTER_BUG_MATRIX.md`
   - `working/START_HERE_2026-07-09.md`
   - `verification/START_HERE_2026-07-09.md`
   - Gill V10 raw intake only as evidence.

## Correct status

```text
38 canonical open/carry-over rows
11 Gill V10 candidates pending cross-verification
90 historical closed/fixed rows
```

The Gill candidates currently have one source witness:

```text
verified-source
needs-cross-verification
not repair-ready
```

Do **not** implement a Gill candidate directly from the raw intake or working matrix.

## Recommended next task

Choose one Gill candidate and provide an independent witness angle from the verification queue.

Examples:

- build a current heading↔TOC inventory;
- compare production-like dist with MDX/Astro/root representations;
- run no-JS/Pagefind/print/TTS checks for restored figures;
- produce an independent topic-ownership map;
- verify the Rippon wording and correct the Research dossier.

Then write a verifier decision with:

```text
source SHA
witness types
accepted/rejected severity
canonical status
owner decision
repair lane
not-stale result
```

## Gill candidate plan — not yet an implementation order

```text
canonical content graph
→ series manifest
→ outline / Reader model
→ semantic figure placement
→ topic ownership / Part III cleanup
→ Research governance
→ Introduction / Part IV authoring
→ atomic publication
```

### Current-head correction

Current `GillSeriesRail.astro` already filters Roman items and renders `Часть X из 3`. The old `3 из 5` display claim is stale and must not be reintroduced. The broader five-document manifest/audit hardcoding remains a candidate.

### Part IV proposal

```text
Часть IV. Богословие
Спорные тексты и логика спасения в системе Джона Гилла
```

Proposed evidence classification:

- seven disputed/universal-redemption texts;
- two positive soteriological anchors.

This remains an owner/editorial proposal, not canonical truth.

## Separate lanes — do not mix

- Gill content/architecture.
- PremiumControls/Floating Cluster visual work.
- TTS model delivery and consent.
- Glossary/Bible data.

## Hard rules

1. One subsystem per PR.
2. SHA-first.
3. Raw intake is not verified truth.
4. One source witness is not `confirmed-current`.
5. Browser claims require browser evidence.
6. Do not weaken obsolete gates; replace them with stronger semantic contracts.
7. Do not edit or delete another agent’s incoming evidence.
8. Only `repair-ready` rows may enter implementation.
9. Update AuditRepo atomically with any source repair.

## Required final report format

```text
Source functional SHA / bot SHA / deployed SHA:
AuditRepo SHA:
Candidate/canonical matrix IDs:
Witness types:
Root cause:
Owner decision used:
Fix + files:
Tests / mutation tests:
Production-like result:
Remaining risks:
AuditRepo update:
```

## AuditRepo validation

```bash
python3 scripts/check_auditrepo_structure.py
python3 scripts/validate_audit_repo.py
```

No merge claim without checks on the final PR head.