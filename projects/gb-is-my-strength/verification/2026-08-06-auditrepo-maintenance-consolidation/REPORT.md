# AuditRepo maintenance consolidation — AR-001 / AR-004 / AR-005

## Disposition

- Wave type: system/governance consolidation.
- AuditRepo base anchor: `379b9697aea780118074bf895d8a74ddf27edaad`.
- Product mutation: none.
- Production/live claim: none.
- Historical matrix recount: intentionally not performed under operating-model v2.

## Evidence anchors

1. Operating-model reform: AuditRepo PR #196, exact tested head `f98f895c251f66f9e881afec0e5641db2e740797`, squash merge `1fd204f0f7c76ead6dc7ab22b2a7feb46c0fc297`.
2. Intake/validator hardening: AuditRepo PR #201, exact tested head `e1a2b2f565888b92a256da8cfea5644874fe1e4f`, squash merge `a0e49cec76173911b9cb489173d7729e5617a8e1`.
3. Exact PR #201 validation: AuditRepo Validate run `31098233305` passed Python compilation, structure, repository rules, validator regressions, scaffold regressions and clean-tree checks.
4. Canonical policy: `AUDITREPO_OPERATING_MODEL.md`, `projects/gb-is-my-strength/DOC_MAP.md` and the lightweight ordinary-PR / periodic-deep-forensic split on the base anchor above.

## Scope

This wave classifies only the three historical AuditRepo-maintenance rows still listed in the transitional `MASTER_BUG_MATRIX.md`:

- `AR-001` — `validate_audit_repo.py hardening`;
- `AR-004` — `verification protocol automation`;
- `AR-005` — `reverify automation`.

It does not classify Product defects, refactoring lanes, rights/content work or the broader `ST-AUDIT-HARNESS` theme.

## Findings

### AR-001 — closed-by-fix

The historical row asked for validator hardening. PR #201 implemented the concrete missing protections discovered after operating-model v2 entered real use:

- existing projects and immutable intake folders cannot be silently overwritten;
- unsafe path components and `.` / `..` are rejected;
- dates must be real, zero-padded `YYYY-MM-DD` values;
- changed intake requires a concrete value on an explicit evidence-anchor line;
- unrelated URLs and option-only templates cannot satisfy report-content checks;
- generic structured finding tables and historical evidence-index reports remain recognized;
- black-box regressions cover overwrite, traversal, invalid date, placeholder and historical-report cases;
- superseded validation runs for the same PR/ref are cancelled.

This is a direct implementation with exact-head CI, so `AR-001` is `closed-by-fix`.

### AR-004 — absorbed-by-system-fix

The old phrase “verification protocol automation” assumed a single mandatory protocol and a central automation path. Operating-model v2 intentionally replaced that premise with:

- package-level verification waves;
- evidence strength based on independent witness angles rather than agent count;
- optional owner-selected work queues;
- local, systemic, parked, accepted-risk and no-fix dispositions;
- lightweight validation on ordinary PRs;
- full matrix/evidence/branch forensic only periodically or manually;
- no required exact-authority synchronization after unrelated Product movement.

The useful goal—repeatable verification—now exists as a broader, cheaper system. The old standalone automation obligation has no independent repair owner, so `AR-004` is `absorbed-by-system-fix`.

### AR-005 — stale / retired obligation

Routine “reverify automation” is no longer a valid desired invariant. The canonical model requires a new current check only when a finding is selected, its evidence-critical owner changed materially, contradictory evidence appeared, or a security/live/rights/important disposition requires it.

A separate `reverify/` document is expressly reserved for disputed, systemic, security/live/rights/data-loss or independently valuable engineering evidence. Creating one after every Product merge is classified as non-standard process because it recreates a second Product control plane.

Therefore the old blanket automation request is stale as formulated. Useful narrow reverification remains available on demand, but `AR-005` is retired as an always-on backlog obligation.

## Result

- `AR-001`: `closed-by-fix`.
- `AR-004`: `absorbed-by-system-fix`.
- `AR-005`: `stale` / retired obligation.
- Remaining independent theme: `ST-AUDIT-HARNESS` stays active as a general quality lens. Future concrete false-green, false-red, security or evidence-integrity defects should receive their own bounded finding rather than reopening these three generic rows.

## Matrix transition boundary

`MASTER_BUG_MATRIX.md` is a transitional historical corpus with manually repeated counts. Operating-model v2 explicitly avoids rewriting that large file for every compact disposition. These three rows remain discoverable there until a dedicated active-backlog migration/consolidation wave, while this report and `verified/CLOSURE_LEDGER.md` carry the current disposition.

No claim is made that every AuditRepo tool is permanently defect-free, and no Product or live evidence is required for this governance-only closure.
