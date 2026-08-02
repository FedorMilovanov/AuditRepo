# Merge-time revalidation — 2026-08-02 — source `8f17085d`

> This note supersedes every use of “actual/current source HEAD = `2273b8c9`” in the original
> 2026-08-01 intake. The original evidence files remain immutable point-in-time evidence at
> `2273b8c9`; this document verifies whether their source/data verdicts still carry to the source
> HEAD observed during merge review.

## Authority snapshot

- AuditRepo PR: `FedorMilovanov/AuditRepo#120`
- Reviewed PR head before this addendum: `66f747f7341941892c52bbff722292298090bf3d`
- AuditRepo base: `bc067a1cbaf33ed3cafa72cf6f4e5201056125db`
- Recorded source authority in canon: `efaf2a51b1fcc7b7d3f8c9558ecb5acf849df3b3`
- Original intake verification SHA: `2273b8c930eebf383d429b917d3636bc28a80bae`
- Merge-time source `main`: `8f17085dc8411cffbcb5a4dcd2f8fc5db9c30a97`
- `efaf2a51..main`: **45 commits ahead**, 0 behind
- `2273b8c9..main`: **31 commits ahead**, 0 behind
- Last exact production authority remains separately recorded as
  `abf1edba190280e554dfda085bef9fb6594c896d`; this review does not claim production parity.

## Delta-impact review

The 31-commit delta from `2273b8c9` to `8f17085d` changes the Diotrophes release lane and registry
surfaces. Among source/data paths used by SD-6..SD-15, only
`migration/page-ownership.json` changed. The following evidence-critical paths did **not** change:

- `karty/_engine/map-engine.js`, `karty/_engine/base-geo.svg`, Karty `route.json` files
- `scripts/lib/sheet-engine.js`, `scripts/atlas-label-audit.js`
- `scripts/validate-map-routes.js`, `scripts/dist-smoke-audit.js`
- `audit/atlas-preview/atlas-reader.js`, `sw.js`
- `js/vosk-tts-engine.js`, `js/vosk-tts-core.js`, `scripts/validate.js`
- genealogy build/template paths cited by SD-15
- Avraam component/page paths cited by SD-10

`migration/page-ownership.json` was directly re-read at `8f17085d`: `/karty/` and all ten Karty
subroutes remain registered as `production-dist`. Therefore the SD-9 verdict for `QUAL-P2-03`
remains `STALE/FIXED candidate`; the registry rewrite did not reopen it.

## Disposition carry-forward

- SD-6 and SD-8..SD-15 source/data verdicts carry forward from `2273b8c9` to `8f17085d` because their
  evidence-critical paths are unchanged, with the explicit SD-9 registry recheck above.
- Browser/runtime/CI-class rows remain **unverified** by this source-only delta review. They must not
  be auto-closed and still require the planned browser reverify.
- SD-5 must be updated: authority advance is now `efaf2a51` → `8f17085d` (**45 commits**), not
  `efaf2a51` → `2273b8c9` (14 commits).
- SD-7 stale-witness distances to merge-time source `main` are now:
  - `32ae0d7d`: **638** commits behind
  - `2ca2af3`: **729** commits behind
  - `21624a3`: **689** commits behind
  - `30bf3f5c`: **1136** commits behind
- The explicit tables in `VERIFIED_DISPOSITIONS.md` contain **17 FIXED candidates**, **39 STILL OPEN
  entries**, and **17 listed browser/runtime/CI entries**. Approximate older summaries are superseded.

## CI / repository-forensic repair

The first PR-head workflow failed only because the canonical disposition for closed-unmerged PR #3
required archive ref `archive/forensic-pr-3-vosk-tts-report-2026-07-24`, while that ref was absent.
The recorded PR #3 head `07891373c6c9f488842a9a66e6cfde857ca74bce` remained accessible. The exact
archive ref was restored to that commit; the failed workflow was rerun and all three jobs passed:
`repository-history-forensic`, `validate`, and `matrix-coverage`.

## Merge gate

This intake is mergeable only if, at final merge time:

1. PR #120 still has no unresolved review threads or requested changes.
2. All required checks are green on the final PR head.
3. The final merge uses `expected_head_sha` to reject a race if the branch moves.
4. Canonical counters/statuses are not changed by this intake; its proposals are handled later by a
   dedicated verifier transaction.
