# CURRENT HEAD REVERIFY — pre-v16 GBS submenu + rounded frame (2026-07-05)

**Source base HEAD:** `8c318010` (gb-is-my-strength `main`, merge: seo-fix-og-images)
**Implementation lane:** `lane/gill-pre-v16-submenu-frame` (NOT merged to main; does not auto-deploy)
**AuditRepo HEAD:** current `main`
**Spec ticket checked at:** `8a8211ea` (the ticket was partially STALE vs `8c318010`)

## What the spec claimed vs. reality
| Spec claim | Reality at `8c318010` | Action |
|---|---|---|
| P0: `deploy.yml` has a step with two `run:` keys (submenu audit skipped) | Already fixed by `8a8211ea` — single `run` per step | No re-introduction; documented as `fixed-current` |
| Pass 61 false-green re: step order | Workflow step order IS correct now | Did NOT add false banner (that would be a false claim) |
| P1: Part III duplicate `#sec-church-gov` target | CONFIRMED — two rows shared it | FIXED (distinct `#sec-church-gov-polity` + new anchor) |
| Audit too weak / hardcoded EXPECTED | CONFIRMED — duplicate approved by hardcoded EXPECTED | HARDENED (rejects dup hrefs/labels; full traversal; frame geometry; generated-reference support) |
| Rounded full frame missing | Frame exists (radius 18px, 304px@≥1024) | Geometry now asserted in audit; owner visual approval pending |

## Changes made (lane branch)
- `gillSeriesData.ts` + `GillPart3ArticleBody.astro`: distinct Part III targets.
- `scripts/gill-pre-v16-submenu-regression-audit.js`: hardened (duplicate rejection,
  full per-item traversal, rounded-frame geometry, historical-reference manifest support).
- `scripts/extract-gill-pre-v16-submenu-reference.js` + `data/gill-submenu-anchor-reconciliation.json`: historical witness extractor + reconciliation.
- `js/floating-cluster-controller.js`: §9.1–9.4 fixes (count guard, rail-fill source,
  internal-scroll-only, aria-current='location').
- `.github/workflows/deploy.yml`: +`baptisty-rossii/**` path; removed `== 'failure'` clause.
- `.github/workflows/indexnow.yml`: +`baptisty-rossii/**` path.
- `scripts/check-workflows.js`: enforce `baptisty-rossii/**`; cover visual-parity +
  shared-files-guard; notify must listen for them.

## Verification done
- `node --check` on all edited JS (audit script, extractor, controller): PASS.
- `python3 -c ast.parse` on `validate_audit_repo.py`: PASS.
- Static grep confirms: deploy.yml single `run` per step; `baptisty-rossii/**` present
  in both path filters; Part III now has distinct `#sec-church-gov` / `#sec-church-gov-polity`.

## Remaining owner/CI actions (NOT yet done — cannot be done in this environment)
1. `npm ci && npm run strangler:build:production-like`, then `npm run gill:pre-v16-submenu:audit`
   on the lane branch → confirm 0 failures (browser + geometry checks).
2. Regenerate `data/gill-pre-v16-submenu-reference.json` from `bcf6389f…` (needs full git history).
3. Owner visual review of the rounded frame + historical submenu parity on all 5 Gill routes.
4. Merge `lane/gill-pre-v16-submenu-frame` → `main` only after the above pass; deploy
   will then re-run the hardened audit as a release gate.

## Open findings (honest status)
- CI-GILL-SUBMENU-01: fixed-current
- UI-GILL-SUBMENU-ANCHOR-02: fixed-current
- UI-GILL-HISTORICAL-PARITY-03: verified-current (remote browser run pending)
- UI-GILL-ROUNDED-FRAME-04: verified-current (owner visual approval pending)
- AUDIT-GILL-FALSE-GREEN-05: closed — no false claim introduced
