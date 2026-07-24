# Current-head reverify — source `5636a6a1`

Date: 2026-07-24  
Project: `FedorMilovanov/gb-is-my-strength`  
Source authority: `main@5636a6a1911c7eb0e7637406e87e749dd65dbaaf`  
Last exact production authority: `8a5352671375fdb01b6c30273c25ec4283a13f69`

## Authority boundary

This witness advances **source authority only**. It does not claim that
`5636a6a1` has passed the push-triggered Metadata & IndexNow Readiness workflow,
that GitHub Pages deployed that exact SHA, or that live hashes match it.
Production authority therefore remains `8a535267`.

The previously opened temporary production observer PR #202 was closed unmerged:
it was hardcoded to `c8b47201` and became inadmissible as soon as source advanced.

## Verified source chain after `c8b47201`

### PR #203 — map runtime/no-JS recovery

Merge: `0461faa8840448775bf8a2ae00d65691807fbf8f`  
Exact verified head: `1338f71faccc59a5b927416b0acb2945e8144303`

Seven route-owned files add a shared accessible recovery surface for the live
Ishod and Avraam maps. The source contract covers normal loading, JavaScript
disabled, `route.json` failure, MapEngine asset failure, runtime exception and
null engine. Failure states expose `.me-error[role="alert"]`, readable fallback
content, retry/back controls of at least 44 px, synchronized `data-map-state`
and `aria-busy`, and safe text construction without `innerHTML`.

Exact-head workflows completed successfully:

- Shared Files Guard;
- Native Source Contract;
- Route Registry Validators, including Chromium and WebKit public-surface rows;
- Overlay Runtime Contract;
- Glossary Contract;
- Visual Parity Guard.

The permanent `engine:sweep` includes eight Ishod/Avraam normal, no-JS,
`route.json` 503 and engine-asset failure scenarios. This closes canonical rows
`ASTRO-P0-05` and `ASTRO-P0-06` at source+CI level.

### PR #204 — control-plane integrity

Merge: `f11749ee1626695b3456e6454ee33cee7ea94263`  
Exact verified head: `bf7f3935b70985808299f13ad005435e7b187d2c`

The settled `_temp-gill-source-marathon-orchestrator.yml` was removed after its
owner transaction. It still requested `contents: write` and referenced the
already deleted `scripts/gill-native-finalize.js`, so retaining it on the
default branch was an actual control-plane defect.

A permanent filesystem-derived audit now checks npm/workflow local references,
local `uses: ./...` targets, mandatory governance documents, surviving
`_temp-*` workflows, write-capable workflow ownership and duplicated inline
actionlint installers. A repository-pinned actionlint runner verifies the
published release checksum before execution.

Exact-head Shared Files Guard succeeded. Its first artifact recorded:

- workflows: 19;
- npm scripts: 151;
- local references checked: 452;
- hard issues: 0;
- warnings: 8.

### PR #205 — warning convergence

Merge/source head: `5636a6a1911c7eb0e7637406e87e749dd65dbaaf`  
Exact verified head: `177507666478a2d1c7d42de25346dc8dfc879a93`

This CI-only lane removed two triggers for deleted one-off editorial branches
and migrated the Bible Reference, Glossary and TTS Download Consent workflows
to the checksum-verified shared actionlint runner. Product code, content,
runtime and rendered surfaces were not changed.

All five exact-head workflows completed successfully:

- Bible Reference Contract;
- Glossary Contract;
- TTS Download Consent;
- Editorial Metadata v3;
- Shared Files Guard.

The final control-plane artifact records:

- workflows: 19;
- npm scripts: 151;
- local references checked: 452;
- accepted guarded write workflows: 2;
- hard issues: 0;
- warnings: 3.

The three explicit remaining warnings are:

1. `package.json` `workflows:lint` has not yet converged on
   `scripts/run-actionlint.mjs`;
2. `package.json` lacks a `control-plane:audit` alias;
3. `route-registry-validators.yml` still has the retired
   `lane/system-route-registry-validators-v2-2026-07-09` push trigger.

They are bounded CI hygiene debt, not hidden or reclassified product defects.

## Lost-work and collision recheck

Current source preserves the complete homepage sequence #190/#193/#196/#195,
Gill final reconciliation #192, ReaderState R6 #191, Nagornaya WebKit fixes
#197/#199, the permanent all-route cross-browser matrix #200, map recovery #203
and both control-plane waves #204/#205.

No additional unpublished homepage package analogous to local `a532042` was
found. `gb-is-my-strength` has no open pull requests at this snapshot.

## Operational issue cleanup

The following source-repository issues were closed only after their canonical
implementations were verified in current history:

- #127 — ReaderState R6 umbrella, implemented by #191 and protected by #200;
- #117 — Nagornaya deep-audit umbrella, whose six canonical lanes are merged;
- #12 — stale aggregate Visual Parity alert, superseded by fail-closed #195 and
  later green exact-head runs;
- #17 — stale aggregate Shared Files alert, superseded by current green guards
  and the permanent #204/#205 control-plane contracts.

Deploy alert #11 and Source Link alert #89 remain open because exact current-SHA
production/live evidence has not been established.

## Matrix reconciliation required

`verified/MASTER_BUG_MATRIX.md` must be patched atomically:

- source head `c8b47201` → `5636a6a1`;
- last reverify → this file;
- `ASTRO-P0-05` and `ASTRO-P0-06` move from open to closed with PR #203 evidence;
- closed counter `144` → `146`;
- P0/P1-open counter `4` → `2`;
- remaining open P0 rows stay `MAP-P0-01` and `DATA-P0-01`;
- production authority stays `8a535267`.

AuditRepo issue #39 owns that exact full-file reconciliation. No other bug row
or counter may change without separate current-head evidence.

## Next execution order

1. Complete the atomic matrix/handoff reconciliation for source `5636a6a1`.
2. Prove a same-SHA readiness → Pages → live marker/hash chain before advancing
   production authority or closing deploy-related alerts.
3. Continue remaining release/runtime P0 work in canonical order:
   `MAP-P0-01`, then `DATA-P0-01`, with current-head browser/source evidence.
4. Close the three bounded control-plane warnings in an isolated CI-only lane.
