# TLP-ARCHIVE-001 verification — concurrent cross-tab favorites convergence

Verification date: 2026-08-07  
Product repository: `FedorMilovanov/TheLegendaryPoet`  
Product issue: #363  
Verified current Product head: `ab3fbf5f0b680f9457d905b792d693d287628c4a`  
Severity: P3  
Disposition: **VERIFIED-CURRENT / repair allowed only after this AuditRepo registration merges**

## Question

Does the current personal-archive implementation actually synchronize favorite **state** across tabs under concurrent mutations, or does it only synchronize notifications after a whole-snapshot last-writer-wins write?

## Current source evidence

`src/utils/myArchiveStore.ts` stores all saved poems under one `tlp-my-archive:v3` object:

```ts
{
  version: 3,
  items: Array<{ id: string; addedAt: number }>,
  updatedAt: number,
}
```

`toggleFavoritePoem` and `removeFavoritePoem` each:

1. call `readSnapshot()`;
2. derive a replacement whole `items` array from that read;
3. call `writeSnapshot(...)`;
4. `writeSnapshot` replaces the entire localStorage value with one `setItem`.

`subscribeFavoritePoems` listens to the same-tab custom event and browser `storage` events. A storage event invokes subscribers, causing other tabs to re-read the **already persisted winner**; it does not merge or replay a mutation that the winning whole-snapshot write has overwritten.

## Deterministic lost-update model

Initial durable archive: `[]`.

Two tabs race while independently holding the same old state:

1. A reads `[]` and prepares add `poem-a` → candidate `[A]`.
2. Before observing A's write, B reads `[]` and prepares add `poem-b` → candidate `[B]`.
3. A writes whole snapshot `[A]`.
4. B writes whole snapshot `[B]` from its stale read.
5. Durable state is `[B]`; A's intentional save is silently lost.
6. The later storage notification makes A re-read `[B]`; nothing in persisted state records the lost A operation, so notification cannot recover it.

Reversing the final two writes loses B instead. The same root permits stale add/remove snapshots to erase or resurrect a peer mutation.

This is not a question of localStorage write atomicity: each individual `setItem` can be atomic while the multi-step read-modify-write transaction still loses a concurrent update.

## Intended contract

Historical Product commit `c495577144ddd057d424a16f7897534ae37f3d15` is titled:

> Harden the personal archive and unify listening history

and explicitly describes the work as:

> synchronize favorite state across tabs

Its committed archive documentation says the browser `storage` event updates other tabs and lists cross-tab notifications among regression verification. This establishes cross-tab synchronization as an intentional Product property rather than an accidental UI detail.

The current implementation fulfills notification propagation but not mutation convergence.

## Current coverage gap

`scripts/validate-personal-archive-store.ts` currently proves:

- fresh v3 storage creation;
- v2 migration;
- malformed/duplicate cleanup;
- timestamp sanitation;
- same-tab mutation notifications;
- one synthetic matching storage event notification;
- invalid-ID rejection;
- write-failure truthfulness;
- reconciliation;
- defensive copies;
- corrupt JSON recovery.

It does **not** construct two independently read old snapshots and merge crosswise mutations. The synthetic storage event contains no competing archive payload and proves only listener routing.

Current browser certification likewise has no two-page near-concurrent distinct favorite-mutation witness.

## Severity

P3.

The defect is deterministic once the stale-read interleaving occurs, and the result is silent loss/resurrection of private user archive state. It requires concurrent multi-tab activity and affects local browser favorites rather than server/account data, so it is not elevated to P1/P2.

## Repair boundary

One bounded Product #363 lane may change only personal-archive persistence/convergence and its focused regression witnesses.

Required properties:

1. two concurrent adds of different poem IDs converge to both favorites regardless of write/delivery order;
2. add/remove conflict has an explicit deterministic ordering rule so stale state cannot silently resurrect a newer removal;
3. duplicate delivery is idempotent;
4. malformed/future ordering state cannot poison convergence;
5. existing v3 favorites migrate without user reset or silent loss;
6. failed storage writes continue to report the actual previous favorite state rather than false success;
7. reconciliation against the current poem library remains authoritative;
8. corrupt state still fails safely;
9. persistence remains bounded private browser state — no account/server feature;
10. no sleeps/debounce as correctness and no unrelated UI/audio/community changes.

A suitable design may migrate from a whole-list snapshot to a bounded per-poem last-operation representation containing add/remove tombstones with deterministic comparable operation clocks. The concrete representation remains a Product repair decision.

## Required witnesses before merge

- pure deterministic stale-reader A-add/B-add convergence in both write/delivery orders;
- pure add/remove ordering and stale resurrection prevention;
- duplicate/idempotent operation coverage;
- malformed/future ordering rejection;
- v3 → repaired-format migration preservation;
- existing failure/reconciliation/corrupt-state tests retained;
- real two-page browser witness that performs distinct near-concurrent favorite mutations and proves both pages plus persisted storage converge;
- full exact-head Product CI/build/budgets/routes and Manual Browser QA.

## Lifecycle

`VERIFY → AuditRepo registration → one Product #363 owner/branch → repair PR → exact-head gates → Browser QA → Product merge → resulting-main verification → AuditRepo closure → matrix back to zero.`
