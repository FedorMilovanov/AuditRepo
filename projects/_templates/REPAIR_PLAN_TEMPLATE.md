# Repair Plan Template

## Meta
- Project:
- Source repo:
- Target SHA:
- Implementation lane:
- Date:
- Signal class:
- Exact target SHA/tree/event:
- Proof state before mutation: FAIL / UNPROVEN
- Claim boundary:
- Semantic owner:
- Overlap/preflight result:

## Bugs included
- ID:
- ID:

## Fix order
1.
2.
3.

## Preservation boundary
- invariants that must remain unchanged:
- producer / assertion / artifact relationships to preserve:
- negative mutation fixture:

## Verification required after fix
- source check
- production-like dist check
- browser check
- reverify ledger update
- exact-head applicable checks
- production/live witness only if the claim requires it

## Stop conditions
- same-owner head changed
- applicability cannot be proved
- unrelated new failure
- preservation witness is absent or red
