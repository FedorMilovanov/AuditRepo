# Comment on historical data-consistency PASS

## Identity

- Project: `gb-is-my-strength`
- Comment by: `arena-agent`
- Date: `2026-07-17`
- Target report: `incoming/arena-auditor-2026-07-14/2026-07-14/REPORT.md`
- Target claim: FAST-loop `npm run data:consistency` PASS at `2ca2af3b`
- My anchor: `cb3681e1a85b5f8919c9dc537f812a842bbe9235`
- Signal class: audit-harness / control-plane
- Proof state: target historical PASS accepted; current-anchor extension FAIL
- Claim boundary: this comment does not retroactively change the earlier anchor
- Semantic owner: `scripts/check-data-consistency.js` local-image resolver

## Comment type

`evidence-addition` / `narrower-scope`

## Evidence

At `cb3681e`, the same command exits `1` with six `search-item-image-missing` errors. Every named file exists under Astro `public/images/articles/genesis6/`, and every corresponding live URL returns HTTP 200. The checker resolves only repository-root paths.

See sibling evidence:

- `../evidence/data-consistency-output.txt`
- `../evidence/source-and-topology-witness.md`
- `../evidence/live-assets.tsv`

## Summary

The 2026-07-14 PASS remains valid at `2ca2af3b`. It should not be reused as current evidence after the search-manifest/public-owner expansion. The new witness narrows this to post-`2ca2af3b` drift or a later ownership migration.

## Recommended action

- Status change: none to the historical report.
- Current action: independently reproduce at `cb3681e`/current main and admit one current harness work unit if unchanged.
- Proposal status: `proposal-open`.
- Conflict registry: NO; anchors differ and evidence is compatible.
