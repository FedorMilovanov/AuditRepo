# LEGACY — D-2 CSS layer validator closure — 2026-08-07

This file is **retirement evidence, not active backlog**.

## ID

`D-2`

## Historical active formulation

The 2026-08-07 consolidation promoted `D-2` because `scripts/css-layer-validator.js` advertised declared-layer architecture checks it did not actually enforce and reported a layered target of at least 80% while warning only below 50%.

The detailed historical activation evidence remains in:

- `../verification/2026-08-07-full-matrix-consolidation/REPORT.md`;
- `MATRIX_CLEANUP_2026-08-07.md`;
- AuditRepo commit `c3d6f84e2bd50e1fdbe8759483711a28df132b37`.

## Closure

Disposition: `closed-by-fix`.

Product owner: `FedorMilovanov/gb-is-my-strength#1138`.

Product merge: `f4cfb8653551ed8459aba1bfcf65f03e27fdfbb2`.

The final repair does **not** require physical monotonic ordering of repeated named `@layer` blocks. Current-source re-verification showed that later reopening of an already declared layer is valid Cascade Layers behavior and does not alter the precedence established by the order statement.

The validator now protects the actual contract:

- an order statement must exist;
- it must precede the first named layer block;
- declaration names must be unique;
- every used named layer must be declared exactly;
- legal layer reopening remains allowed;
- the published 80% layered-coverage target and warning threshold share one value;
- internal executable assertions guard these semantics.

Exact Product merge evidence and the CI/review boundary are recorded in:

`../verification/2026-08-07-d2-css-layer-validator-closure/REPORT.md`.

`D-2` must not be revived from this file without a new current Product witness proving that the repaired validator again fails its real layer-precedence/integrity contract.
