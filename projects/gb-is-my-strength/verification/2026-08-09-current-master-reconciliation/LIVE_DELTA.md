# Live delta during 2026-08-09 MASTER reconciliation

This receipt records Product movement that happened **after** the initial reconciliation report was authored and continued while the AuditRepo consolidation PR was being validated. It prevents any earlier exact-anchor snapshot from being mistaken for final current state.

## Product main moved — first checkpoint

Initial reconciliation observed Product `main@3a0f21b0ec01e423a2625becf13f600a07a6ddb5` (#1362).

Fresh race-check then observed merged Product #1364:

`1b05bf1f99f45d9dcf22e453f28dff2a68a304fa` — `fix(strangler): resolve all Gill claim legacy surfaces via reference authority (#1364)`.

Therefore:

- #1364 left the active PR census and became merged historical closure;
- truthful Strangler retirement readiness advanced **13 → 12**;
- the next mechanical owner became draft #1367.

## New Strangler owner #1367

Draft Product #1367:

`fix(strangler): resolve visual parity references through ledger authority`

Exact base at first observation: `main@1b05bf1f...`.

Current semantic scope:

- `scripts/visual-parity-contract.js`;
- `data/legacy-reference-ledger/manifest.json`;
- `.github/workflows/visual-parity.yml`;
- `scripts/legacy-reference-path-contract-test.js`.

Confirmed mechanism: visual parity retained-reference HTML was still read directly from `ROOT/<rel>`, so quarantine could break the production visual contract while the ledger correctly classified this consumer as `must-update-before-move`. The workflow also triggered on changes to the contract without directly executing `visual:parity:production`. A red-driven contract check then correctly required the new direct API consumer to be added to the exact expected consumer set; that assertion was not weakened.

Expected truthful effect after exact-head acceptance: **12 → 11**. #1367 reports the expected remaining classes after that as 1 mechanical (`gill-reading-time`, currently in #1348), 3 obsolete legacy audits and 7 owner-decision blockers. No physical move/delete is authorized.

## Product main moved again — reader #1267 merged

A later pre-merge race-check observed:

`3c7b3c199dcf3d2464f38a55550d730a3279c171` — `fix(reader): gate quiz panel with quiz tab (#1267)`.

Consequences:

- #1267 leaves the active PR census and becomes another merged reader slice under system root #1224;
- issue #1224 remains open because its Definition of Done is broader than this one conditional Quiz-panel repair;
- audit-only #1212 remains the class-level reader/control census and must still be calibrated/refreshed rather than weakened;
- Strangler readiness remains **12** because #1267 is unrelated to retirement storage.

## Shared native quiz root reverified and assigned Product issue #1369

Because #1267 touched reader semantics, the native article quiz root was reverified directly on exact current Product `main@3c7b3c19...` before creating any Product owner.

Current `src/runtime/article-quiz.js` still proves both AuditRepo findings:

1. score selection requires `score >= Number(entry.min) && score <= Number(entry.max)`, while accepted configs such as Lot provide ordered `min` thresholds without `max`; named tiers therefore fall through to generic score output;
2. structured answer feedback renders `short || full`, so a distinct `full` teaching explanation is suppressed whenever `short` exists.

Product issue **#1369** was created as the shared owner:

`SYSTEM: restore native article quiz score and explanation parity`

The issue explicitly closes the Lot-only workaround path: do not patch Lot by adding ad-hoc max fields or deleting short explanations. The separately disproved claim that the Lot quiz does not render remains closed.

## Current open Product PR census after #1267 merge

Seven open PRs now map to seven active MASTER roots:

- #1367 — `SYS-STRANGLER-RETIREMENT`;
- #1363 — `SYS-MAP-SCALE-RESIZE-WITNESS`;
- #1348 — `CATALOG-PROJECTION-01`;
- #1339 — `LOT-PUBLICATION-READINESS-01`;
- #1334 — `AVRAAM-HAMMAM-RETRACTION-PARITY`;
- #1313 — `SEARCH-MANIFEST-NEW-ROW-ROLE-AUTHORITY`;
- #1212 — `SYS-READER-CONTROL-SEMANTICS` audit/census owner.

`SYS-ARTICLE-QUIZ-NATIVE-PARITY` now has Product **issue #1369** but no implementation PR at this checkpoint.

## Fresh ancestry checks from Product `main@3c7b3c19...`

### Lot publication #1339

Current main → `#1339@189dfdd...`:

- status: diverged;
- ahead: 10;
- **behind: 7**;
- merge base: `56972725dbe7aa9c5ecbf0d1efa2e9012e37f019`.

Every historical #1339 green is non-authoritative until replay/current-head proof.

### Catalog #1348

Current main → `#1348@ac48467d...`:

- status: diverged;
- ahead: 9;
- **behind: 2**;
- merge base: `3a0f21b0...`.

It remains deliberately downstream of #1313 and must absorb the role authority after that merge.

### Strangler #1367

Current main → `#1367@590c06d...`:

- status: diverged;
- ahead: 4;
- **behind: 1**;
- semantic delta remains the intended four retirement/visual-parity files.

Prior exact-head greens from the `1b05bf1f...` base are historical after #1267 moved main.

### Map scale harness #1363

Current main → `#1363@9f85b76...`:

- status: diverged;
- ahead: 3;
- **behind: 2**;
- semantic delta remains only `scripts/map-engine-correctness-browser-test.mjs`.

The mechanism remains unchanged; final authority requires another ancestry refresh and exact-head run.

### Search role #1313

Current main → `#1313@7a8ef56d...`:

- status: diverged;
- ahead: 17;
- **behind: 1**;
- semantic diff remains exactly the three intended Search authority files.

#1313 had absorbed `main@1b05bf1f...`, but #1267 moved main again before this AuditRepo consolidation closed.

## AuditRepo consequence

The final active MASTER/SYSTEM_THEMES/Lot status in this consolidation branch must use Product `3c7b3c19...`, Strangler readiness 12, next retirement owner #1367, merged reader slice #1267, and shared quiz issue #1369. The initial `REPORT.md` and the earlier sections of this file remain exact historical checkpoints; this later section is the current successor delta.