# Comment on Finding

## Identity
- Project: gb-is-my-strength
- Comment by: bugverifikator
- Date: 2026-08-19
- Target report: `incoming/2026-07-17-arena-agent-surface-pass-5.md`
- Target finding ID: `ANCESTOR-TRACING-INCOMPLETE`
- Audited anchor (SHA / artifact / live snapshot): Product `main` HEAD `cb3681e` (committed 2026-08-19T00:30Z); source witness of `src/components/genealogy/layout.ts`
- Signal class: Product
- Proof state: PASS (the symptom no longer reproduces)
- Claim boundary: current Product `main` HEAD cb3681e
- Semantic owner / overlap check: genealogy layout owner; no competing lane.

## Comment type
`stale` — defect already fixed; not reproducible on current HEAD.

## Evidence

```
# src/components/genealogy/layout.ts @ cb3681e, computeFocusLineage (≈L49-79)
  const byId = new Map(persons.map(p => [p.id, p]));   // ← O(1) map built
  ...
  // 1. Trace ancestors UP (father/mother → their father/mother → ... → root)
  let cur: Person | undefined = target;
  const upGuard = new Set<string>();
  while (cur && !upGuard.has(cur.id)) {
    result.add(cur.id); upGuard.add(cur.id);
    if (cur.id === 'jesus' && cur.mother) cur = byId.get(cur.mother);
    else cur = cur.father ? byId.get(cur.father) : (cur.mother ? byId.get(cur.mother) : undefined);  // ← father ?? mother
  }
  // 2. Trace descendants DOWN (recursive)
  const queue: string[] = [personId];   // ← BFS queue, not linear pointer
  const downGuard = new Set<string>();
  while (queue.length > 0) { ... for (const childId of p.children) { if (byId.has(childId) && !downGuard.has(childId)) queue.push(childId); } }
```
The target report's own "Evidence" block at 485db8c quotes the DESIRED form (`if (cur.id === 'jesus' && cur.mother) cur = byId.get(cur.mother); else cur = cur.father ? byId.get(cur.father) : (cur.mother ? byId.get(cur.mother) : undefined);`) as the fix. On cb3681e this exact form is the live code. Lifecycle: Product commit `b84aa56 [LANE lane/shared-genealogy-multiparent-2026-06-27] fix(genealogy): mu…` (from the layout.ts history) is the multiparent repair lane.

## Summary
The symptom described — `computeFocusLineage` using a linear pointer and ignoring maternal lines in multi-parent scenarios — is no longer present on cb3681e. The function now builds an id→Person map, walks ancestors via `father ?? mother` (with the documented `jesus`→mother special case), and walks descendants via a BFS queue with guards. Maternal lines and tree/queue traversal are present. The original filing was correct on 485db8c, but Product `main` has since advanced (14 commits 485db8c→cb3681e) and the multiparent lane closed it. (`traceGoldenPath`, a separate function for the messianic golden path, still follows father-only except `jesus`→mother — that is intended golden-path semantics, not this defect.)

## Recommended action
- Status change: `ANCESTOR-TRACING-INCOMPLETE` → **stale (closed-by-fix)**; remove from MASTER in the next consolidation wave.
- Proposal status: proposal-resolved (the fix the report proposed is already merged).
- Conflict registry entry: NO
- Notes for verifier: a one-line legacy note ("closed by multiparent lane b84aa56; not reproducible on cb3681e") is sufficient; full detail remains in Git/evidence. This is also a textbook Terminal-attestation-stale case: the MASTER row was bound to 485db8c and the touched owner advanced.
