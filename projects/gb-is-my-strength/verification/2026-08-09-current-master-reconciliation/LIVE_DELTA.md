# Live delta during 2026-08-09 MASTER reconciliation

This receipt records Product movement that happened **after** the initial reconciliation report was authored but **before** the AuditRepo consolidation PR was opened. It prevents the initial exact-anchor snapshot from being mistaken for final current state.

## Product main moved

Initial reconciliation observed Product `main@3a0f21b0ec01e423a2625becf13f600a07a6ddb5` (#1362).

Fresh race-check then observed merged Product #1364:

`1b05bf1f99f45d9dcf22e453f28dff2a68a304fa` — `fix(strangler): resolve all Gill claim legacy surfaces via reference authority (#1364)`.

Therefore:

- #1364 leaves the active PR census and becomes merged historical closure;
- truthful Strangler retirement readiness advances **13 → 12**;
- the next mechanical owner is new draft #1367.

## New Strangler owner #1367

Draft Product #1367:

`fix(strangler): resolve visual parity references through ledger authority`

Exact base at observation: `main@1b05bf1f...`.

Scope:

- `scripts/visual-parity-contract.js`;
- `data/legacy-reference-ledger/manifest.json`;
- `.github/workflows/visual-parity.yml`.

Confirmed mechanism: visual parity retained-reference HTML was still read directly from `ROOT/<rel>`, so quarantine could break the production visual contract while the ledger correctly classified this consumer as `must-update-before-move`. The workflow also triggered on changes to the contract without directly executing `visual:parity:production`.

Expected truthful effect after exact-head acceptance: **12 → 11**. #1367 reports the expected remaining classes after that as 1 mechanical (`gill-reading-time`, currently in #1348), 3 obsolete legacy audits and 7 owner-decision blockers. No physical move/delete is authorized.

## Current open Product PR census after #1364 merge

Eight open PRs still map to seven active MASTER roots:

- #1367 — `SYS-STRANGLER-RETIREMENT`;
- #1363 — `SYS-MAP-SCALE-RESIZE-WITNESS`;
- #1348 — `CATALOG-PROJECTION-01`;
- #1339 — `LOT-PUBLICATION-READINESS-01`;
- #1334 — `AVRAAM-HAMMAM-RETRACTION-PARITY`;
- #1313 — `SEARCH-MANIFEST-NEW-ROW-ROLE-AUTHORITY`;
- #1267 + #1212 — `SYS-READER-CONTROL-SEMANTICS`.

## Fresh ancestry checks

### Lot publication #1339

Compare from current Product main `1b05bf1f...` to #1339 head `189dfdd...`:

- status: diverged;
- ahead: 10;
- **behind: 6**;
- merge base: `56972725dbe7aa9c5ecbf0d1efa2e9012e37f019`.

Thus every old #1339 green remains historical until replay/current-head proof.

### Catalog #1348

Compare current main → `#1348@ac48467d...`:

- status: diverged;
- ahead: 9;
- **behind: 1**;
- merge base: prior main `3a0f21b0...`.

The one new main commit is Strangler-only; nevertheless final merge authority must be re-earned after ancestry refresh. #1348 remains intentionally downstream of #1313 role authority.

### Map scale harness #1363

Compare current main → `#1363@9f85b76...`:

- status: diverged;
- ahead: 3;
- **behind: 1**;
- semantic delta remains only `scripts/map-engine-correctness-browser-test.mjs`.

The harness mechanism/disposition is unchanged, but prior greens cannot authorize merge after #1364 moved main.

### Search role #1313 / Reader Quiz #1267

Fresh open-PR metadata already shows both refreshed onto `main@1b05bf1f...`:

- #1313 current head observed `7a8ef56d333ddb42d6300af05fec41ab23ee0494`;
- #1267 current head observed `8ca4a24dd8236d6441c1ecf590329d8ca2fa3276`.

Their semantic owner boundaries remain unchanged; fresh exact-head CI is still required by their own merge barriers.

## AuditRepo consequence

The active MASTER/SYSTEM_THEMES/Lot status in this consolidation branch must use Product `1b05bf1f...`, Strangler readiness 12 and next owner #1367. The initial `REPORT.md` remains a valid exact snapshot of the earlier point in the same consolidation; this file is its explicit successor delta.