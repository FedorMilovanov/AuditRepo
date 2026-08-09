# Full Zero Wave 07 — Transport Branch Cemetery

Date: 2026-08-10  
Product: `FedorMilovanov/gb-is-my-strength`  
Scope: `transport/*` only; **no Product source changes**

## Live preflight

Fresh comparison authority: `main@f0ec90563ec5ae7eec439f78d0729694267af6df`.

All 13 expected transport refs still existed at preflight:

1. `transport/reader-projection-rebase-20260805`
2. `transport/search-manifest-main-refresh-after-1270-20260808`
3. `transport/lifecycle-retired-identities-20260805`
4. `transport/lifecycle-retired-identities-v2-20260805`
5. `transport/lifecycle-retired-identities-v3-20260805`
6. `transport/lifecycle-retired-identities-v4-20260805`
7. `transport/legacy-obsolete-writer-20260805`
8. `transport/legacy-obsolete-writer-v2-20260805`
9. `transport/legacy-reference-ledger-20260805`
10. `transport/legacy-reference-ledger-v2-20260805`
11. `transport/legacy-reference-ledger-v3-20260805`
12. `transport/legacy-reference-provenance-20260805`
13. `transport/legacy-reference-provenance-v2-20260805`

The only open Product PR at preflight was unrelated diagnostic #1460. No transport ref had active merge ownership.

## Disposition summary

| ref | fresh compare vs main | exact successor / containment receipt | semantic classification | disposition | deleted |
|---|---:|---|---|---|---|
| `transport/reader-projection-rebase-20260805` | ahead 0 / behind 212 | fully ancestor-contained in current main | ancestry-only transport | **SAFE DELETE** | no — no remote delete action available |
| `transport/search-manifest-main-refresh-after-1270-20260808` | ahead 0 / behind 125 | fully ancestor-contained in current main | ancestry-only transport | **SAFE DELETE** | no — tooling limitation |
| `transport/lifecycle-retired-identities-20260805` | ahead 1 / behind 225 | disposable #978 → merged #987 | temporary lifecycle materialization | **SUPERSEDED — SAFE DELETE** | no |
| `transport/lifecycle-retired-identities-v2-20260805` | ahead 1 / behind 225 | disposable #980 → merged #987 | temporary lifecycle materialization | **SUPERSEDED — SAFE DELETE** | no |
| `transport/lifecycle-retired-identities-v3-20260805` | ahead 1 / behind 225 | disposable #982 → merged #987 | temporary lifecycle materialization | **SUPERSEDED — SAFE DELETE** | no |
| `transport/lifecycle-retired-identities-v4-20260805` | ahead 2 / behind 225 | disposable #984 → merged #987 | staging history for final lifecycle scripts | **SUPERSEDED — SAFE DELETE** | no |
| `transport/legacy-reference-ledger-20260805` | ahead 2 / behind 223 | disposable #992 → #995/#997/#999/#1002 → merged #1005 | staged ledger payload/materialization | **SUPERSEDED — SAFE DELETE** | no |
| `transport/legacy-reference-ledger-v2-20260805` | ahead 1 / behind 222 | disposable #995 → #997/#1002 → merged #1005 | staged ledger payload/materialization | **SUPERSEDED — SAFE DELETE** | no |
| `transport/legacy-reference-ledger-v3-20260805` | ahead 2 / behind 222 | disposable #997 → merged #1005 | final staged ledger blobs, replayed cleanly | **SUPERSEDED — SAFE DELETE** | no |
| `transport/legacy-reference-provenance-20260805` | ahead 1 / behind 221 | disposable #999 → #1002 → merged #1005 | temporary provenance/workflow materialization | **SUPERSEDED — SAFE DELETE** | no |
| `transport/legacy-reference-provenance-v2-20260805` | ahead 2 / behind 221 | disposable #1002 → merged #1005 | clean staged provenance blobs, replayed | **SUPERSEDED — SAFE DELETE** | no |
| `transport/legacy-obsolete-writer-20260805` | ahead 1 / behind 220 | disposable #1007 → #1010 → merged #1013 | temporary obsolete-writer analysis/helper | **SUPERSEDED — SAFE DELETE** | no |
| `transport/legacy-obsolete-writer-v2-20260805` | ahead 2 / behind 220 | disposable #1010 → merged #1013 | staged writer-removal/inventory blobs | **SUPERSEDED — SAFE DELETE** | no |

## A. Two refs reverified at `ahead=0`

The previous audit result was not trusted blindly. Fresh compare against today's `main` again showed:

- `transport/reader-projection-rebase-20260805`: `ahead=0`, `behind=212`, no changed files;
- `transport/search-manifest-main-refresh-after-1270-20260808`: `ahead=0`, `behind=125`, no changed files.

With no active PR/owner and zero forward commits, both refs are fully contained ancestors. No semantic tree comparison ambiguity remains.

Verdict: **SAFE DELETE** for both.

## B. `lifecycle-retired-identities` x4

PRs #978, #980, #982 and #984 are all closed unmerged transport PRs. Their own PR records explicitly identify them as disposable materialization/transport and not merge vehicles.

Fresh branch comparisons show why `ahead>0` cannot be read as a Product ownership signal:

- v1: one forward transport commit; historical diff included a temporary form of `scripts/article-headline-contract.js`;
- v2: one forward transport commit with materialized patch/helper state;
- v3: one forward transport commit with the same lifecycle reconstruction family;
- v4: two forward transport commits; its meaningful tail resolves to the three permanent lifecycle scripts later accepted cleanly.

Canonical PR #987 is merged and is the clean lifecycle repair. It carries the permanent lifecycle implementation without the transport-materialization history. Therefore the unique transport ancestry is not required Product semantics.

Verdict for all four: **SUPERSEDED — SAFE DELETE**.

## C. Legacy-reference transport family

A branch name was never used as deletion proof. Each exact ref was tied to its disposable PR and then to a clean merged successor.

### Ledger/provenance chain → merged #1005

Exact transport PR mapping:

- #992 — `transport/legacy-reference-ledger-20260805`; closed unmerged; disposable materialization.
- #995 — `transport/legacy-reference-ledger-v2-20260805`; closed unmerged; disposable successor.
- #997 — `transport/legacy-reference-ledger-v3-20260805`; closed unmerged; stages the final permanent ledger/audit blobs.
- #999 — `transport/legacy-reference-provenance-20260805`; closed unmerged; temporary provenance/workflow transport.
- #1002 — `transport/legacy-reference-provenance-v2-20260805`; closed unmerged; clean materialization of the final seven-file payload.

Merged PR #1005 is the canonical clean inventory/provenance owner. Its record explicitly states that disposable materialization/provenance PRs are absent from merged history. It accepts the permanent seven-file governance result while rejecting stale transport hashes/materializers.

Fresh tree tails match that history:

- early ledger refs contain payload chunks, temporary helper/audit combinations and staged manifest changes;
- later ledger/provenance refs converge on the permanent manifest + shard/audit set;
- temporary workflow/materialization ancestry does not survive as Product authority.

The current Strangler/storage-authority chain later evolved these permanent owners further, including storage-aware inventory hardening after root #1383 reached terminal dependency state. Therefore #1005 is not being treated as the end of history; it is the exact clean receipt that replaced these transport refs, with later current-main evolution layered on top.

Verdict for all five ledger/provenance refs: **SUPERSEDED — SAFE DELETE**.

### Obsolete-writer chain → merged #1013

Exact mapping:

- #1007 — `transport/legacy-obsolete-writer-20260805`; closed unmerged, disposable analysis/materialization.
- #1010 — `transport/legacy-obsolete-writer-v2-20260805`; closed unmerged, staged writer-removal/inventory blobs.

Merged PR #1013 is the canonical clean successor. It was rebuilt directly on current main from the final intended blobs and removes the sole obsolete mutable writer without carrying the disposable transport history.

Fresh compares show that early transport-only helper shape (`article-headline-contract.js`) and staged manifest/audit changes are superseded by that clean successor and later current-main storage-authority evolution.

Verdict for both obsolete-writer refs: **SUPERSEDED — SAFE DELETE**.

## Squash / transport ancestry rule

The seven legacy refs and four lifecycle refs often report `ahead>0` because their transport commits are not ancestors of squash-clean successors. That forward ancestry was inspected semantically rather than treated as unique Product work.

Containment was established through:

1. exact disposable PR identity;
2. explicit clean successor record;
3. permanent-file shape in the successor;
4. rejection/removal of temporary payload/workflow/helper material;
5. later current-main Strangler/storage-authority evolution.

No branch was classified merely because its name is old.

## Deletion execution boundary

Every ref in this report is semantically authorized for deletion. Actual remote deletion was not possible because the connected GitHub action surface available in this session does not expose branch/ref deletion, and no separately authenticated local `gh` transport is available.

Accordingly `deleted=no` is intentional and truthful. This report is an authorization/provenance receipt, not a fabricated deletion receipt.

## Product mutation boundary

No Product source, PR implementation, Search repair, Strangler root, `#1295`, or `#1403` was changed.

## MASTER recommendation

Treat the two `ahead=0` refs as **SAFE DELETE** and the remaining eleven transport refs as **SUPERSEDED — SAFE DELETE** through merged #987, #1005 and #1013 plus later current-main storage-authority evolution. Delete the refs directly when an authenticated remote-ref deletion operation is available; do not merge, rebase, cherry-pick or resurrect transport ancestry first.
