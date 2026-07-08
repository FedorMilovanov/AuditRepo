# OWNER / NEXT-AGENT START HERE — gospod-bog.ru

> Date: **2026-07-09**  
> Source `main` checked: `ac26d8efa2b952df6dc46eef05908e6d65287e82`  
> Research checked: `58e1ea5fab638812ae693a1d0b1e79c4dcb47131`  
> AuditRepo branch: `audit/gill-series-v10-canonical-2026-07-09`

## Canonical documents

- [`MASTER_BUG_MATRIX.md`](./MASTER_BUG_MATRIX.md) — current operational matrix.
- [`../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/REPORT.md`](../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/REPORT.md) — official Gill V10 intake.
- [`../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/artifacts/GILL_SERIES_MASTER_CUMULATIVE_AUDIT_V10.md`](../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/artifacts/GILL_SERIES_MASTER_CUMULATIVE_AUDIT_V10.md) — detailed architecture/content research.
- `SUPER_AUDIT_2026-07-06_14a49be8.md` — supporting historical backlog only; reverify each claim on current source.

## Current matrix

| Category | Count |
|---|---:|
| Historical closed/fixed | 90 |
| P0 open | 6 |
| P1 open | 6 |
| P2 open | 10 |
| P3 open | 19 |
| Refactoring | 4 |
| AuditRepo | 3 |
| **Active items** | **48** |

The six P0s are structural blockers for a coherent six-document Gill publication. They do not mean the whole production site is down.

## Owner decisions needed

### 1. Gill editorial ownership

Accept or revise this page ownership:

```text
Introduction = historical world
Part I       = person/biography
Part II      = scholarly method and publication
Part III     = reception, influence and final life
Part IV      = doctrine, disputed texts and evaluation
Reference    = chronology, works, glossary and source matrix
```

### 2. Part IV scope

Recommended title:

```text
Часть IV. Богословие
Спорные тексты и логика спасения в системе Джона Гилла
```

Recommended evidence design:

- seven disputed texts;
- two positive soteriological anchors;
- no `7` or `9` in the permanent H1.

### 3. TTS consent

`TTS-DL-CONSENT` remains unresolved: Save-Data is mitigation, not explicit consent to a ~280 MB model download. This lane must remain separate from Gill content.

## Gill implementation order

```text
A. canonical content source + series manifest
B. generated outline / Reader AST + Roman normalization
C. section ownership + Part III dedup/reorder
D. Research statuses + claim register
E. Introduction expansion + Part IV authoring
F. atomic publication to all projections
```

Do not author or publish Part IV before A–D.

## Immediate risks

1. Research may verify MDX while production renders different Astro copy.
2. Historical submenu audit can reject a complete TOC and approve an incomplete one.
3. Part II/III legacy Roman numbering collides with planned Part IV.
4. Part III continues after death, burial and sources, and repeats major episodes.
5. TTS/schema/search/print do not share one semantic article model.
6. Old systemic SUPER_AUDIT wording is tied to `14a49be8`; current source moved to `ac26d8e`.

## Non-negotiable rules

- SHA-first.
- One subsystem per source PR.
- No source repair directly from raw intake.
- No claim of browser/production behavior from source inspection alone.
- Do not edit or delete another agent’s incoming evidence.
- AuditRepo matrix + reverify + source fix must move atomically when implementation occurs.
- Do not mix Gill content, PremiumControls visual work, TTS model delivery and glossary data.

## Merge readiness for this AuditRepo branch

Before merge, run in AuditRepo checkout:

```bash
python3 scripts/check_auditrepo_structure.py
python3 scripts/validate_audit_repo.py
```

Then inspect branch diff to ensure only AuditRepo documentation/evidence changed.