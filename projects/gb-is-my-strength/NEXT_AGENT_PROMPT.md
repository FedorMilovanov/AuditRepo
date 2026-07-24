# NEXT AGENT PROMPT — gb-is-my-strength

> **Current operational truth only.** Historical prompts are archived under
> `archive/stale/2026-07-23-current-truth-cleanup/`. Bug status and counters belong to
> `verified/MASTER_BUG_MATRIX.md`; this file owns the exact current source/deploy boundary and next execution order.

**Source main:** `5636a6a1911c7eb0e7637406e87e749dd65dbaaf`
**Last exact production:** ✅ `8a5352671375fdb01b6c30273c25ec4283a13f69`
**Production readiness:** `30006414898` — success
**Production Pages:** `30007024100` — success
**Live sitemap witness:** 66 `<loc>`, SHA-256 `5f3fa280af1ddc73f166decce47535d48ec60718375dd7c0418ea3675f82a801`
**Current source reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_5636a6a1_map-p0-control-plane.md`

## 1) Exact boundary

Source and production remain intentionally separate authorities:

- source `main` is `5636a6a1`;
- the last exact deployed Pages SHA remains `8a535267`;
- the source chain through homepage hardening, Gill reconciliation, ReaderState R6, permanent Android/WebKit coverage, map failure recovery and control-plane cleanup is source/CI verified;
- this AuditRepo update **does not** claim that `5636a6a1` has passed exact readiness or been deployed to Pages.

Canonical source evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-24_5636a6a1_map-p0-control-plane.md`.

## 2) Newly completed source lanes

Previously preserved and still present:

- Homepage PR #190 restored breakpoint/BFCache cleanup, no-JS navigation, focus transfer and correct landmarks.
- Homepage PR #193 made all substantive reveal sections visible without JavaScript and in print.
- Homepage PR #196 added the early no-`IntersectionObserver` fallback.
- Homepage audit PR #195 made Visual Parity fail closed on hidden reveal content.
- Nagornaya PR #197 and PR #199 closed the reproduced iPhone 320 WebKit overflows without root clipping.
- Gill PR #192 completed final source-level claim reconciliation.
- ReaderState R6 PR #191 introduced one canonical transaction for progress, resume and reading consumers.
- Browser PR #200 permanently audits all 75 public routes in Android Chromium and iPhone/desktop WebKit.

New after `c8b47201`:

- `ASTRO-P0-05` and `ASTRO-P0-06` — map recovery PR #203 replaces black-screen/no-JS failures with accessible route-owned recovery UI for Ishod and Avraam. Exact head `1338f71f` passed Shared, Native Source, Route Registry/Chromium/WebKit, Overlay, Glossary and Visual Parity.
- Control-plane PR #204 removed the settled Gill write workflow that referenced a deleted script, added a filesystem-derived local-reference audit and a checksum-verified shared actionlint runner. Exact-head Shared Files Guard passed with 0 hard issues.
- Control-plane PR #205 retired two deleted editorial branch triggers and migrated Bible, Glossary and TTS workflow linting to the shared runner. Exact head `17750766` passed all five triggered workflows; final audit: 19 workflows, 151 npm scripts, 452 local references, 0 hard issues, 3 bounded warnings.

At this snapshot, `FedorMilovanov/gb-is-my-strength` has **no open pull requests**.

## 3) Lost-work and collision recheck

Current `main@5636a6a1` preserves the entire homepage sequence, Gill final corpus, ReaderState R6, all-route Chromium/WebKit coverage, map failure recovery and both control-plane waves. No hidden fifth homepage package or unpublished analogue of local `a532042` was found.

Operationally completed source issues #127 (Reader R6), #117 (Nagornaya deep audit), #12 (stale Visual Parity alert) and #17 (stale Shared Files alert) are closed. Deploy alert #11 and Source Link alert #89 remain open because exact current-SHA production/live evidence is not yet proven.

## 4) Active work, in order

1. **Finish AuditRepo source reconciliation**
   - patch `verified/MASTER_BUG_MATRIX.md` atomically through source `5636a6a1`;
   - move `ASTRO-P0-05` and `ASTRO-P0-06` from open to closed;
   - change only directly affected counters: closed `144→146`, P0/P1 open `4→2`;
   - keep `MAP-P0-01` and `DATA-P0-01` open;
   - issue #39 owns the exact patch.

2. **Prove the current exact production boundary**
   - locate or run `Metadata & IndexNow Readiness` for the current source SHA;
   - require `Deploy to GitHub Pages` success on the same readiness-verified SHA;
   - capture a live marker/hash witness;
   - only then advance production authority and close deploy/source alerts where warranted.

3. **Continue canonical P0 order**
   - `MAP-P0-01`: mobile map panel can move above the viewport;
   - `DATA-P0-01`: MapEngine ignores author-authored curved `stages[].paths` in Avraam;
   - refresh current `main` and branch intersections before every lane.

4. **Bounded CI hygiene debt**
   - converge `package.json` `workflows:lint` on `scripts/run-actionlint.mjs`;
   - add `control-plane:audit` npm alias;
   - remove the retired route-registry rollout push trigger;
   - require the control-plane artifact to reach 0 issues / 0 warnings before merge.

5. **Remaining independent findings**
   - `STRANGLER-HYGIENE` migration/reference debt;
   - `TTS-DL-NO-TABLOCK` cross-tab ownership for the large model download;
   - `TTS-DL-UNZIP-SYNC` main-thread archive extraction;
   - `REG-001` GitHub Pages response-header/hosting limitation;
   - PR #167 editorial warning inventory where still reproduced on current source.

## 5) Concurrent-agent boundaries

There are no open source PRs at this snapshot. Before new source work:

1. refresh `main`;
2. list active PRs/branches again;
3. compare changed filenames and workflow intersections;
4. never restore superseded PR #194, #201 or stale observer PR #202 diffs;
5. do not reintroduce any `_temp-*` workflow on the default branch.

## 6) Non-negotiable gates

Before source merge:

- Shared Files Guard;
- repository control-plane audit for workflow/package changes;
- Native Source Contract when source/profile paths are touched;
- Search Manifest Policy when search/index data is touched;
- Route Registry Validators, Reader engine sweep and cross-browser matrices for public semantics;
- Visual Parity for rendered surfaces;
- production-like build and the route-specific release gate.

After a production-impacting merge:

- exact readiness success;
- exact Pages success;
- live marker/hash witness for the changed artifact or surface;
- only then advance production authority in AuditRepo.

## 7) Data hygiene

- `PROJECT_REGISTRY.md` is static.
- `NEXT_AGENT_PROMPT.md` owns current execution truth.
- `verified/MASTER_BUG_MATRIX.md` owns status and counters.
- Reader R6 is canonical only as `READER-R6-STATE-01`; do not maintain a parallel operational-only status.
- `reverify/` owns immutable current-head witnesses.
- superseded intake moves to `archive/stale/`; fixed evidence moves to `archive/fixed/`.
- no silent evidence deletion and no temporary workflow in a final diff.
