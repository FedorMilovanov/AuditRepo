# CURRENT HEAD REVERIFY — Karty story identifier schema

- Date: 2026-08-04
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Canonical finding: `QUAL-P1-07`
- Current Product anchor: `0fbe7d1ead9ebd1bea867418e254da438ec63329`
- AuditRepo base: `8f5ebdd7e2ee1f56887110e74373c74761ccc01b`
- AuditRepo closure lane: PR #138
- Current production claim: **none**

## Original claim

The canonical JSON Schema allowed only hyphenated story identifiers, while published `early-church`, `melachim` and `revelation` data used underscore-bearing internal story/filter IDs. The mismatch made valid runtime/deep-link identifiers fail the Ajv 2020-12 schema contract.

## Disposition

### `QUAL-P1-07` — fixed-current

Product PR #666 repaired the bounded contract mismatch:

- exact PR head `12aa744e10c05c134adc951f01cb5e78ef25de65`;
- squash merge `424b09b25fc9d4bace3938f4d44f430be8cc7e4b`;
- changed only `karty/_shared/route.schema.json` and `scripts/map-layers-theme-regression-test.js`;
- changed the internal story ID pattern from `^[a-z0-9-]+$` to `^[a-z0-9_-]+$`;
- kept public route/meta IDs hyphen-only;
- renamed no published story ID or URL;
- loaded the canonical schema pattern in the permanent regression guard;
- validated every current `karty/*/route.json` story ID against that exact pattern.

The exact Product head passed four triggered workflows:

- Visual Parity Guard run `30677441958`;
- Shared Files Guard run `30677441985`;
- Metadata & IndexNow Readiness run `30677441960`;
- Editorial Dateline Contract run `30677441986`.

## Current-head source witness

At current Product anchor `0fbe7d1ead9ebd1bea867418e254da438ec63329`:

- `karty/_shared/route.schema.json` still declares story IDs with `^[a-z0-9_-]+$` and documents that underscore-bearing IDs are internal filter/deep-link identifiers rather than public route slugs;
- the schema continues to require hyphen-only `meta.id`, preserving the public route boundary;
- `scripts/map-layers-theme-regression-test.js` still reads the canonical schema, asserts the exact `^[a-z0-9_-]+$` pattern, enumerates every current Karty route containing `route.json`, and validates every story ID;
- later MapEngine changes advanced the runtime contract to v0.57.0 without removing or weakening the story-ID assertions.

The historical schema mismatch is therefore not open on current head.

## Evidence boundary

This closure covers only the internal story/filter ID schema mismatch. It does not validate unrelated route fields, rename existing IDs, claim all Karty schema debt is closed, or establish deployment of current Product `main`.

## Canonical arithmetic applied by this transaction

- Canonical IDs: **358**
- Closed: **194 → 195**
- Open: **164 → 163**
- P1: **76 → 75**
- P0: 0
- P2: 34
- P3: 47
- Refactoring: 4
- AuditRepo: 3

The total remains `358 = 195 + 163`.
