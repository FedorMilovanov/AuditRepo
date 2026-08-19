# Evidence — GENEALOGY-ID-INVALID-SPACE

bugverifikator · 2026-08-19 · gb-is-my-strength · current-HEAD reverify (cb361e source)

## Finding
`GENEALOGY-ID-INVALID-SPACE` — confirmed current-local on cb3681e (source witness). Leading-space malformed person ID in the genealogy data graph.

## Witness angle
- **W2 source** (`verified-source`): `data/genealogy/genealogy.json` at cb3681e:
  - L1395: `"id": " lud_shem"` (leading space) — person object for Луд.
  - L403: same leading-space form referenced in Shem's `children` array: `" lud_shem"` (between `"asshur"` and `"aram"`).
- **W5 lifecycle/mechanism** (`verified-lifecycle`): `src/components/genealogy/GenealogyTree.tsx` at cb3681e consumes IDs as exact-match keys:
  - L211 / L236: `const byId = new Map(persons.map(p => [p.id, p]));` → key is `" lud_shem"`.
  - L213: `byId.has(pid)` / L214: `person.children?.filter(c => byId.has(c))` — exact match.
  - L217-220: sibling traversal `parent?.children?.filter(c => c !== activeId && byId.has(c))` — exact match.
  - L101 / L193 / L209 / L225: `persons.find(p => p.id === …)` — exact match.
  - L105: search `p.id.toLowerCase().includes(q)` — substring, so a search for `lud` still hits (with the space), but canonical ID lookups are space-sensitive.

## Mechanism
The malformed key `" lud_shem"` and its reference in `children` are *mutually consistent* (both carry the space), so the node currently resolves within the island's own `byId` map and the graph does not visibly break today. The defect is latent graph-integrity fragility: any consumer that canonicalizes/trim IDs, any future validation step, or any cross-reference by the canonical `lud_shem` (no space) will miss the node or produce a dangling edge. The data is the SSOT consumed by `types.ts` (`Person.id: string`) and the React island.

## Impact
medium-low — no current visible break because the space is consistent id↔reference, but the graph integrity invariant (canonical, trimmed IDs) is violated; a regression-prone latent defect. Aligns with the existing MASTER framing ("breaks graph integrity").

## Owner / collision
- Semantic owner: genealogy data owner (`data/genealogy/`).
- Open Product branch check (2026-08-19): no open branch touches `data/genealogy/genealogy.json`. No collision.

## Proposal (for the verification/consolidation wave)
- Keep as `current-local` defect in MASTER; re-anchor `HEAD 485db8c` → `cb3681e`.
- Suggested repair lane: normalize the ID in `data/genealogy/genealogy.json` — change `"id": " lud_shem"` → `"id": "lud_shem"` AND the matching reference in Shem's `children` array `" lud_shem"` → `"lud_shem"` (both must change together to keep the edge). Add/keep a data-consistency guard (`scripts/check-data-consistency.js` already references series data; a genealogy ID-trim/assert check would protect the class).
- Closure boundary: ID and its reference both trimmed; `check-data-consistency` (or an added genealogy ID guard) green; row removed from MASTER.

## What this evidence does NOT prove
- A visible runtime break today (the space is currently self-consistent, so the island resolves the node). The harm is latent/structural, not an active blank-edge today.
- That no other malformed IDs exist — only `" lud_shem"` was located in this pass via a targeted leading-space grep. A full ID-canonicalization audit is a worthwhile guard but out of scope here.

## Labels
`verified-source`, `verified-lifecycle`, `current-confirmed-for-work`
