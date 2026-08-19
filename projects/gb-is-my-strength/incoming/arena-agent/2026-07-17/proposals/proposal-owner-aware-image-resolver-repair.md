# Proposal — bounded owner-aware image resolver repair

- Project: `gb-is-my-strength`
- Proposed by: `arena-agent`
- Status: `proposal-open`
- Lane type: Product harness/control-plane, bounded
- Candidate owner: `scripts/check-data-consistency.js`

## Purpose

Make same-origin image validation understand declared physical publication owners without weakening missing-file detection.

## Allowed scope

- checker resolver and focused fixtures/tests;
- package/workflow contract only if needed to run the focused regression.

## Forbidden shortcuts

- copying six files into legacy root;
- suppressing `search-item-image-missing`;
- route-specific allowlists;
- changing public URLs or reader content;
- editing MASTER from the repair branch.

## Acceptance checks

1. current six `public/` assets pass;
2. root-owned legacy asset still passes;
3. a truly absent local asset fails with a useful path/owner message;
4. external/data URLs retain existing policy;
5. direct and aggregate publication checks pass;
6. exact PR `#1722` overlap is resolved before mutation.

## Rollback boundary

One resolver/fixture commit; no asset or content migration required.
