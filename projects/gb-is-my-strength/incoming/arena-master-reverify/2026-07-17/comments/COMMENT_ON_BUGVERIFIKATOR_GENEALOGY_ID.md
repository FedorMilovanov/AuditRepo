# Comment on Finding

## Identity

- Project: `gb-is-my-strength`
- Comment by: `arena-master-reverify`
- Date: 2026-07-17 UTC
- Target report: `incoming/bugverifikator/2026-08-19/EVIDENCE_GENEALOGY-ID-INVALID-SPACE.md`
- Target finding ID: `GENEALOGY-ID-INVALID-SPACE`
- Audited anchor (SHA / artifact / live snapshot): Product `main` `cb3681e1a85b5f8919c9dc537f812a842bbe9235`; live `/rodosloviye/` island props.
- Signal class: Product
- Proof state: PASS (latent data-integrity claim)
- Claim boundary: whitespace-normalization/key-invariant risk; not a claim of present visible graph failure.
- Semantic owner / overlap check: `data/genealogy/genealogy.json` consumed by `GenealogyTree.tsx`; no selected PR overlap.

## Comment type

`evidence-addition` — independently confirms the exact-key mechanism and establishes that the same malformed value is serialized into the current live island.

## Evidence

```json
// data/genealogy/genealogy.json
// L403, inside shem.children
" lud_shem"

// L1395, person key
"id": " lud_shem"
```

```ts
// GenealogyTree.tsx
const byId = new Map(persons.map(p => [p.id, p]));
// parent/child navigation uses byId.has(...) and byId.get(...)
```

The only `.trim()` calls in the tree component apply to the user search string, not imported IDs. Live `/rodosloviye/` returns HTTP 200 and its Astro-island props include the same whitespace-prefixed value.

## Summary

bugverifikator correctly frames this as self-consistent today but fragile under future normalization, validation, or canonical external lookup. The independent live witness shows it is not merely a non-emitted data fixture.

## Recommended action

- Status change: keep current as medium-low latent data-integrity work.
- Proposal status: proposal-supported.
- Conflict registry entry: NO.
- Notes for verifier: rename the ID and every reference atomically; add a data invariant rejecting leading/trailing whitespace rather than trimming one consumer.
