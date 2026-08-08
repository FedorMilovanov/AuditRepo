# TLP-ARCHIVE-001 closure — deterministic cross-tab favorites convergence

Closure recorded: 2026-08-08  
Verification package opened: 2026-08-07  
Product repository: `FedorMilovanov/TheLegendaryPoet`  
Product issue: #363  
Superseded repair transport: PR #365, closed unmerged  
Final Product repair: PR #368  
Verified-current defect anchor: `ab3fbf5f0b680f9457d905b792d693d287628c4a`  
Final current-main base before repair: `6f92da1741e7480d65f3a23b04aab407bafe76a5`  
Exact tested Product head: `6f9408aceccfae0fbb0abf1993695f000e84ffe0`  
Product squash merge / resulting main: `576ac818d6ca426e5786aba3efc27f8b20abf2bf`  
AuditRepo row: `TLP-ARCHIVE-001`

## Disposition

**CLOSED-BY-FIX / P3 removed from active engineering matrix.**

The personal archive no longer relies on a whole-snapshot last-writer-wins protocol for cross-tab favorite mutations. Product #363 closed automatically after the expected-head-protected squash merge of #368, and the resulting Product `main` was reverified as the merge SHA.

`TLP-HALL-001` / Product #369 is a separate owner-selected architecture lane. It is not an engineering defect row and is not closed or weakened by this archive closure.

## Verified root cause

At the defect anchor, all favorites lived inside one `tlp-my-archive:v3` object. `toggleFavoritePoem` and `removeFavoritePoem` performed a read-modify-write of the entire `items` array.

A deterministic stale-reader race therefore existed:

1. tab A reads the old snapshot and derives add A;
2. tab B independently reads the same old snapshot and derives add B;
3. A writes its whole replacement snapshot;
4. B writes its stale whole replacement snapshot;
5. the durable state contains B but silently loses A.

The browser `storage` event only notified subscribers after the physical overwrite. The losing operation was no longer represented in persisted state, so notification alone could not reconstruct it. The same root could erase or resurrect concurrent add/remove intent.

## Repair

Final Product PR #368 carries the exact final six content blobs from the previously verified draft #365, but starts from the fresh post-wave7 Product main as repository rules require.

### v4 per-poem operation state

Current key:

`tlp-my-archive:v4`

Each poem owns one winning operation with:

- poem id;
- favorite boolean;
- presentation `addedAt`;
- canonical decimal causal `generation`;
- stable writer id.

Causal ordering is independent of wall-clock time. A higher generation wins. Equal-generation add/remove conflicts are removal-wins; writer id only total-orders equal-intent concurrent operations. `addedAt` is presentation metadata and cannot decide convergence.

### Cross-tab stale-overwrite repair

For v4 storage events, the store merges:

- the current physical localStorage value;
- `StorageEvent.oldValue`;
- `StorageEvent.newValue`.

If a stale last write physically overwrites another tab's distinct operation, `oldValue` still carries the overwritten state and deterministic per-poem merge restores the union. Repeating the same delivery is idempotent.

For the same poem, a newer removal cannot be resurrected by an older add. A later intentional re-add that has observed the removal advances generation and can win normally.

### Migration and reconciliation

- valid v3 whole snapshots migrate losslessly to v4 operations;
- legacy v2 arrays remain migration inputs;
- previous keys retire only after successful v4 persistence;
- read-side migration does not emit a false user-mutation notification;
- reconciliation converts removed-library favorites into removal tombstones rather than forgetting their history, preventing stale-peer resurrection.

### Failure truthfulness

Storage quota/private-mode failures still return the actual prior favorite state. Invalid IDs, malformed generation/writer metadata and corrupt JSON fail safely. Returned active-favorite arrays remain defensive copies.

## Permanent deterministic evidence

`npm run validate:archive-store` now covers:

- fresh v4 creation;
- v3 and v2 migration with delayed retirement;
- malformed id/generation/writer rejection;
- future display timestamp isolation from causal ordering;
- distinct stale-reader add/add convergence in both orders;
- equal-generation removal-wins behavior;
- stale-add non-resurrection and later intentional re-add;
- duplicate-delivery idempotence;
- physical stale-overwrite repair through storage-event `oldValue` + `newValue`;
- same-tab and cross-tab notification behavior;
- failed-write truthfulness;
- reconciliation tombstones;
- defensive copies and corrupt-state recovery.

## Real browser evidence

`qa/archive-cross-tab.cases.mjs` adds a real Chromium two-tab witness through public poet routes:

1. open canonical Yesenin and Pushkin poet pages in the same browser context;
2. locate two real `Добавить «…» в архив` controls for distinct poem ids;
3. click both near-concurrently through `Promise.all`;
4. prove both controls remain pressed;
5. poll persisted v4 operations until both active poem ids are present;
6. open `/archive` in the same context and prove at least both saved entries are rendered.

Existing reader journeys were moved from the retired v3 storage shape to v4 so blocked-add and blocked-removal honesty tests continue to target the storage protocol Production actually writes.

## Current-main successor discipline

Draft #365 had the correct final implementation but was based on `main@c7e656dca8e0b6a6da8ab975970067e6470ebb53`. Product main then advanced only in `src/data/essays/yeseninPartTwoPublic.ts` through Yesenin wave7.

Rather than mutate or merge a stale owner branch, #365 was closed unmerged and current-main successor #368 was created from exact `main@6f92da1741e7480d65f3a23b04aab407bafe76a5`.

The successor changed exactly six archive/proof files and reproduced the exact final #365 blobs:

- `docs/PERSONAL_ARCHIVE_STORAGE.md` — `11e1f2cd4a3e1634f4326480c4552b11f230d106`;
- `qa/archive-cross-tab.cases.mjs` — `671da2d0755825966695ea09b1cf037db235af8a`;
- `qa/audio-cross-tab.spec.mjs` — `a8ef756eb00a5c6544de62204ff0ddab81f96751`;
- `qa/reader-journeys.spec.mjs` — `dbfb3301e85f3d677307224bc9e3a4367d39bca2`;
- `scripts/validate-personal-archive-store.ts` — `fc62d8534f26f8d0793a08ce0da9c4ed08d08c3b`;
- `src/utils/myArchiveStore.ts` — `ad22966401376555f390e650052812c01eb07c99`.

No essay, catalog, brand, package or workflow file was part of the repair.

## Exact-head Product gates

All effective PR-triggered gates on exact tested head `6f9408aceccfae0fbb0abf1993695f000e84ffe0` completed successfully before merge:

- `CI` — run `31233518436`: success;
- `Project contracts` — run `31233518450`: success;
- `Brand deep reference and motion audit` — run `31233518444`: success;
- `Site route integrity audit` — run `31233518434`: success;
- `Manual Browser QA` — run `31233518443`: success.

Manual Browser QA specifically completed successfully for:

- premium desktop/home and pointer-performance matrix;
- desktop WebKit home/reveal and route QA;
- critical/reduced-motion iPhone contours;
- Chromium and Android Chrome core QA, including the new real two-tab archive convergence witness;
- base iPhone Safari in fresh browser processes.

`Request Pages deployment` was skipped on the PR as expected and was not treated as a failed validation gate.

Immediately before merge:

- Product main was still exact `6f92da1741e7480d65f3a23b04aab407bafe76a5`;
- #368 was six commits ahead / zero behind;
- changed files were exactly the six registered archive/proof files;
- review threads: 0;
- submitted reviews: 0;
- conversation comments: 0;
- PR head remained `6f9408aceccfae0fbb0abf1993695f000e84ffe0`.

PR #368 was marked ready and squash-merged with expected-head protection for that SHA.

## Post-merge verification

GitHub produced Product squash merge / resulting main:

`576ac818d6ca426e5786aba3efc27f8b20abf2bf`

Post-merge checks:

- Product `main` compares identical to that merge SHA;
- Product issue #363 is closed with state reason `completed`;
- current `src/utils/myArchiveStore.ts` is the expected v4 blob `ad22966401376555f390e650052812c01eb07c99`;
- current `qa/archive-cross-tab.cases.mjs` is the expected browser-witness blob `671da2d0755825966695ea09b1cf037db235af8a`.

The repair is therefore present in current Product source truth, not only in a closed PR diff.

## Matrix effect

After this closure:

- P0: `0`;
- P1: `0`;
- P2: `0`;
- P3: `0`;
- total active engineering rows: `0`.

The owner-selected Hall v3 foundation remains separate. At this closure moment Product `docs/project-contract.json` still has zero source-registered architecture lanes; Product #369 owns the next bounded foundation transaction that will register `TLP-HALL-001` in source truth.

## Durable evidence

- activation report: `REPORT.md` in this directory;
- Product issue: #363;
- superseded draft: #365, closed unmerged;
- final Product PR: #368;
- exact tested head: `6f9408aceccfae0fbb0abf1993695f000e84ffe0`;
- Product merge / resulting main: `576ac818d6ca426e5786aba3efc27f8b20abf2bf`.
