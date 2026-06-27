# gb-is-my-strength / gospod-bog.ru

**Status: current-head re-verified / priority-reset in progress** (2026-06-27)

## Quick facts
- Source: `FedorMilovanov/gb-is-my-strength`
- Production: `https://gospod-bog.ru`
- Tech: Astro 5 + strangler pattern (root HTML + Astro dist)
- Premium controls: v16 SVG floating cluster (gb-icon, gb-ember, gb-save)


## PremiumControls current-main correction (2026-06-27 / `819fd3f1`)

Independent verifier pass found that older PremiumControls and Gill statements in this project are partly stale:

- Gill v16 layout is now present on all five Gill routes; old statements saying Parts 2/3/Spravochnik remain `gbs2-rail` are stale.
- Production-like dist audit is red until `scripts/dist-publication-audit.js` accepts current Gill v16 markers.
- PC-007 RomanNumeral is not actually landed (`gb-roman=0` in all five Gill dist pages).
- PremiumControls asset versioning is not fully protected because some Astro-owned pages still emit unversioned `floating-cluster.css` / controller refs.

Use `PremiumControls/reports/PREMIUMCONTROLS_CURRENT_MAIN_INDEPENDENT_VERIFIER_2026-06-27.md` before acting on older PremiumControls ledgers.


**Follow-up:** source `0159da05` added external-check docs and source BUG-032..BUG-036, but the PremiumControls code/audit holes remain open. See `PremiumControls/reports/PREMIUMCONTROLS_CURRENT_MAIN_0159DA05_DELTA_VERIFIER_2026-06-27.md`.


**Second follow-up:** source `87505f1b` fixes BUG-032/dist-publication gate and `strangler:audit:production-like` now passes, but PC-CURRENT-02/03/04/05 remain open and PC-CURRENT-06 was added. See `PremiumControls/reports/PREMIUMCONTROLS_CURRENT_MAIN_87505F1B_DELTA_TRIAGE_2026-06-27.md`.

## Current-head note (2026-06-27)

⚠️ **Do not treat older aggregate bug counts in this project as current operational truth.**

The project moved substantially after the 2026-06-25 synthesis wave. Current verifier position:
- use `verified/CURRENT_HEAD_CANONICAL_LEDGER_2026-06-27.md` as the primary current-head truth;
- use `verification/CANONICAL_VERIFIER_NOTE_2026-06-27_current-head-status-flips-and-second-order-defects.md` for status flips and second-order defects;
- use `verified/REPAIR_ORDER_DELTA_2026-06-27_current-head-priority-reset.md` for current repair ordering;
- treat older 2026-06-25 ledgers as historical baseline only.

## Current live themes (current HEAD)

- **Push volume warning:** the project changed materially through multiple same-day follow-up pushes after PR #19 (`99a7acfd` → `1a288da5` range). Always verify current HEAD instead of trusting a single merge summary.
1. **Workflow-policy mismatch:** `npm run workflows:check` is red while the broader publication gate is green; current evidence points to a narrow `dist:jsonld:audit` script-contract mismatch, not broad CI collapse.
2. **Partial route integration:** `/izbrannoe/` exists in source/UI but is not fully reconciled across migration/search/reference contracts; current evidence suggests only the migration-matrix gap is definitely real debt, while other warnings are checker/policy drift.
3. **Gill convergence debt:** Gill pages still span more than one UI family / premium-control structure.
4. **Source-vs-built publication risk:** source-side fixes cannot automatically be treated as publication truth in this hybrid repo.
5. **Ledger / guard drift:** some canonical-looking docs and some guards now lag current architecture or current HEAD reality.
6. **PremiumControls roadmap lag:** the PremiumControls phase roadmap/patch notes were written at PR #19 time and must be read through the 2026-06-27 current-head reverify lens.
7. **Route taxonomy nuance:** `/izbrannoe/` is not just missing a matrix entry; current runtime taxonomy still classifies it as `native-with-legacy-head`, so it remains slightly intermediate even beyond the warning surface.

## Primary current documents

| File | Purpose |
|------|---------|
| `verified/CURRENT_HEAD_CANONICAL_LEDGER_2026-06-27.md` | **Primary current-head operational truth** |
| `verification/CANONICAL_VERIFIER_NOTE_2026-06-27_current-head-status-flips-and-second-order-defects.md` | Status flips, stale-vs-live reset, second-order defects |
| `verified/REPAIR_ORDER_DELTA_2026-06-27_current-head-priority-reset.md` | Current repair-order reset |
| `verification/WORKFLOW_PARITY_DEEP_DIVE_2026-06-27.md` | Exact workflow guard-drift root cause + minimal repair path |
| `verification/IZBRANNOE_COMPLETION_DEEP_DIVE_2026-06-27.md` | `/izbrannoe/` contract-gap analysis |
| `verification/GILL_GUARD_ARCHITECTURE_PREFLIGHT_2026-06-27.md` | Gill guard/architecture collision map |
| `working/STATUS_MATRIX_2026-06-27_current-head-verifier-grade.md` | Quick verifier-grade classification matrix |
| `working/ARENA_DEEP_REVERIFY_2026-06-27_systemic-desync-and-unfinished-implementation.md` | Deep current-head analysis |

## Folder structure (cleaned 2026-06-27)

```text
incoming/
  raw reports from many agents — preserved, not rewritten
working/
  only active current-head working docs
verification/
  active verifier doctrine + current-head deep dives
verified/
  current canonical truth + current repair-order truth
reverify/
  only latest reverify snapshots still useful
archive/
  historical baselines, superseded syntheses, templates, old snapshots
```

## Intake rule

- `incoming/` не переписывать задним числом;
- каждый агент пишет в свою подпапку;
- current operational truth не размазывать по 20 старым документам;
- исторические сводки и superseded syntheses переносить в `archive/`, а не держать в корне актуальных папок.

## Current verifier status (2026-06-27)

**Primary current ledger:** `verified/CURRENT_HEAD_CANONICAL_LEDGER_2026-06-27.md`
**Canonical verifier note:** `verification/CANONICAL_VERIFIER_NOTE_2026-06-27_current-head-status-flips-and-second-order-defects.md`
**Priority reset:** `verified/REPAIR_ORDER_DELTA_2026-06-27_current-head-priority-reset.md`

### Main live issues on current HEAD
- workflow-policy mismatch (`workflows:check` red while full publication gate is green)
- incomplete `/izbrannoe/` route integration across contracts
- Gill split-family convergence debt
- source-vs-built publication risk as an active repo class
- ledger/guard drift across documents and anti-regression logic

## Archived historical material

Historical 2026-06-25/2026-06-26 syntheses, older verified ledgers, and superseded reverify snapshots were cleaned out of the active roots and moved under:
- `archive/2026-06-27-working/`
- `archive/2026-06-27-verified/`
- `archive/2026-06-27-verification/`
- `archive/2026-06-27-reverify/`

## Next step

Implementation and verifier agents should work from the **2026-06-27 current-head documents first**, and consult archived 2026-06-25/2026-06-26 material only as historical baseline / context.
