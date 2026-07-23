# Current-head reverify — `83f04647` production

**Date:** 2026-07-23
**Source repository:** `FedorMilovanov/gb-is-my-strength`
**Exact source/deployed SHA:** `83f04647c470a92c340d4d7990485c4e1376836b`

## Immutable release ancestry

- epistemic UI PR #154 → `f1946b523d45028c17e39ecf1dc6e9b361887401`;
- route semantics PR #157 → `6f412430a21eae411970f8601687c4f99f61e9c4`;
- PremiumControls ARIA PR #158 → `6fe9be4064ffa4d50549607f89a9d2ca2f42c2f5`;
- production descendant → `83f04647c470a92c340d4d7990485c4e1376836b`.

The release repair is an ancestor of production; seven later commits changed CI/control workflow state and did not revert product files.

## Exact production chain

| Boundary | Run | Result |
|---|---:|---|
| Metadata & IndexNow Readiness | `29966152952` | success |
| Deploy to GitHub Pages | `29966633078` | success |
| AuditRepo live observer | `29967501124` | success; artifact `8548383473` |

Pages passed every publication step: static gates, production-like build, ownership, Pagefind, visual parity, publication audit, URL contracts, JSON-LD, rich results, PremiumControls, Gill audits/smokes, broad runtime, content coverage, SW readiness, upload/deploy and IndexNow.

## Live witness

HTTP 200 and required markers were observed on the public domain:

- `nagornaya-matthew-luke-observation-matrix` — present;
- `nagornaya-part4-green-model` — present;
- `nagornaya-part4-thomas-model` — present;
- Nagornaya Play disclosure ARIA — present on parts I and IV.

SHA-256:

- `/nagornaya/chast-1/`: `d8a15ef9a83ead0dea12f29ad64b6bb0d7904397fecda7abc9de4ea33a79ffeb`;
- `/nagornaya/chast-4/`: `45168405d3b946a8e1cae295affa75947ca668ed5941f511a5c4096f19b39c6d`.

## Closed lanes

- `NG-UI-EPISTEMIC-BIAS-01` / #153 — registry-driven neutral comparisons deployed.
- `READER-ROUTE-SEMANTICS-01` / #146 — reading/landing/reference/application/page roles deployed.
- `NG-PREMIUM-CONTROLS-ARIA-01` — disclosure ARIA deployed; PremiumControls release proof 158/158.

## Remaining boundary

This witness proves deployment/current truth, not that the full matrix is zero. AuditRepo matrix coverage still has orphan/unregistered evidence debt and must remain explicitly open until resolved.
