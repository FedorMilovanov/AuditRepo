# Current HEAD Reverify — multi-agent convergence

## Boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Source branch: `main`
- Exact source SHA: `d94b54889e4f5f0330adaf2b9947e59af4aee7e4`
- Last fully imported AuditRepo production witness: `8a5352671375fdb01b6c30273c25ec4283a13f69`
- Newer production candidate requiring evidence import: `ddcf71533fe85606ae59d5a6e0d8662db3dd28cb`
- Date: 2026-07-25
- Witness angles: `verified-source`, `verified-pr-orchestration`, `verified-exact-head-ci`, `production-evidence-gap-explicit`

This witness advances **source and orchestration authority only**. It does not claim that `d94b5488` is deployed. It also does not silently promote `ddcf7153` to canonical AuditRepo production authority without importing the exact readiness, Pages and live-artifact identifiers.

## Source chain since the previous AuditRepo boundary

The previous canonical reverify stopped at `184d7ed1`. Current source now includes the later TTS, deploy, editorial and print sequence, including:

- exact lazy-precache ownership and live TTS deployment verification;
- semantic editorial datelines replacing foliant boxes;
- WebKit first-paint TTS status visibility;
- universal print pagination repair and final PDF convergence through PR #283.

Current `main@d94b5488` is the merge of PR #283: `fix(print): remove gold progress and keep reversible cards intact`.

## PDF ownership convergence

Two branches had been changing the same shared print surface:

- PR #280 — older diagnostic branch based on `555717f8`;
- PR #283 — final product branch based on `ddcf7153`.

Final disposition:

- PR #283 passed its exact-head 11-workflow matrix and was squash-merged as `d94b5488`;
- PR #280 was retitled superseded and closed without merge;
- the final #283 tree contains no temporary workflow/materializer;
- the five-route print matrix reports no missing/split atomic components and no missing/split keep-with-next pairs;
- raster evidence reports no repeated amber/gold header bars and no flat saturated artifacts;
- the visible Russian translation card remains intact on one physical page.

A unique evidence gap remained after merge: the focused physical front/back contract from #280 was not present on `main`. Narrow PR #286 owns only that missing permanent proof and does not own product CSS/JS.

## Current open ownership

At this witness:

- PR #284 — draft deployment provenance lane; generic infrastructure is still coupled to TTS and must be refactored before merge;
- PR #286 — draft physical reversible-card evidence lane; two permanent test files only.

Closed orchestration:

- PR #280 — superseded diagnostic, closed without merge;
- PR #285 — stale Genesis snapshot, closed without merge and branch reset to current main.

There is no active Genesis 6 activation owner. The already landed Genesis corpus remains intentionally draft/noindex.

## CI interpretation

Current red history must be classified, not flattened:

- Shared Files Guard failures on temporary write workflows were valid protective failures;
- `back: card root is not atomic` was a real product/evidence regression;
- cancelled runs caused by a newer head are superseded evidence, not product failures;
- old notify-on-failure issues can remain open after recovery because the notifier has no recovery state machine.

## Production boundary

AuditRepo previously presented `8a535267` as both current and fully sufficient production truth while source had advanced far beyond it. This reverify separates:

1. the last production witness whose exact run IDs are already pinned in AuditRepo (`8a535267`);
2. the newer candidate `ddcf7153`, whose permanent post-deploy TTS contract exists in source but whose exact readiness/Pages/live artifact identifiers still need to be imported;
3. current source `d94b5488`, which is newer than both and is not claimed deployed here.

This fail-closed distinction is preferable to inventing or inferring production provenance.

## Required next evidence

1. Finish and inspect PR #286 physical front/back artifact.
2. Import exact `ddcf7153` readiness, Pages, deployment and live-contract artifact identifiers if the run chain is verified.
3. Refactor PR #284 into feature-neutral deployment identity with `extensions.tts`.
4. Add recovery/superseded lifecycle to CI alerts.
5. Inventory capability overlap before any new permanent workflow.

## Verdict

`d94b5488` is the current source authority. Duplicate PDF ownership is resolved. Genesis snapshot drift is removed. The remaining high-priority work is governance/CI architecture and one focused physical PDF evidence gap, not another parallel print implementation.
