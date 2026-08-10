# Terminal verification — Rodословие viewport + Split View accessibility

Date: 2026-08-10
Product: `FedorMilovanov/gb-is-my-strength`
Disposition: **TERMINAL / MERGED-GREEN**

## Closed roots

- `V05-ROD-VIEWPORT`
- `V05-ROD-SPLIT-A11Y`

## Repair owner

PR #1548 — `fix(rodosloviye): close viewport and split-view accessibility roots`

- starting main: `29770e1c7a99478ce7dc2a01abec206ac1daa69b`
- final PR head: `ef372845f8816ad8ad35186051ced2ee4973608a`
- merged current-main commit: `533193eeb01dd4b68626f6f58496fe1663b4ed78`

The repair established one normalized genealogy world-coordinate contract, made the Matthew/Luke comparison a native modal lifecycle with focus containment/Escape/opener restoration, and added permanent Chromium + WebKit browser coverage at 390×844 and 1440×1000.

## Guard correction during verification

The first browser guard falsely hardcoded the historical observed mount subset `143`, while canonical `data/genealogy/genealogy.json` currently contains 156 persons and `/rodosloviye/` passes `genealogyData.persons` directly to the React tree.

That false-red test root was corrected before merge. The permanent guard now derives expected mounted-person count from `data/genealogy/genealogy.json#persons.length` and compares the rendered graph against that canonical authority. It therefore fails on real source↔DOM drift without failing merely because the legitimate dataset grows.

## Exact PR-head CI

Final head `ef372845f8816ad8ad35186051ced2ee4973608a` completed all observed workflows successfully, including:

- Runtime Interactive Audit — success;
- Visual Parity Guard — success;
- Deploy Candidate Contract — success;
- Source Authority Contract — success;
- Scripture Occurrence Index Contract — success;
- Native Source Contract — success;
- Metadata & IndexNow Readiness — success;
- Glossary Contract — success;
- Shared Files Guard — success;
- Print Paper Contract — success;
- Editorial Dateline Contract — success;
- Node Toolchain Contract — success.

The Runtime Interactive Audit's dedicated Home Chromium/WebKit job also completed the new genealogy browser contract, headed Home lifecycle and A13 WebKit accessibility scene matrix successfully.

## Merged-main identity check

The merge was squash-style, so commit ancestry differs from the PR branch. Current-main file identity was therefore checked at the blob level rather than inferred from ancestry.

Examples:

- `scripts/genealogy-browser-contract.mjs` blob on merged `main`: `72bbfc1fb9823cdb47452ccab383d4647d0d3d68`; same blob on final PR head: `72bbfc1fb9823cdb47452ccab383d4647d0d3d68`.
- `src/components/genealogy/layout.ts` blob on merged `main`: `7d2c1115ee40328ba79e9c9a16a306d7e8ebb588`; same blob on final PR head: `7d2c1115ee40328ba79e9c9a16a306d7e8ebb588`.

The merged commit itself records the complete five-file genealogy repair scope and is the latest Product main commit at this terminal check.

## Lifecycle census

A fresh authenticated Product issue census after merge returned **0 open issues**. The transient CI lifecycle issue #1549 created for the earlier false-red Runtime run is therefore terminal and does not remain as current work.

## Terminal outcome

Both `V05-ROD-VIEWPORT` and `V05-ROD-SPLIT-A11Y` are merged, regression-guarded and current-main-identical to the green tested owner. They must leave the active MASTER matrix.
