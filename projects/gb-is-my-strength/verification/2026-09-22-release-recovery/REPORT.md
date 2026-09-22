# Release recovery — Wave 0 and ordered closure program

Observed: 2026-09-22, approximately 19:15–19:25 UTC. Owner: Codex, executing
Fedor Milovanov's instruction to complete verified waves with rechecks.
Disposition: **four admitted current work units; no Product-zero claim**.

## Anchors and independent witnesses

| Boundary | Observed evidence |
|---|---|
| Product main / rollback | `6bf5fd7212eaf88ac21d719947f98a1d6f21eb37` |
| AuditRepo pre-change main | `c6fb8e4e1eaa0a914b60118668adf90423aaa7c4` |
| Live release | [current.json](https://gospod-bog.ru/deployments/current.json), HTTP 200; `a9ab116f422b9c765cb63895760ef9c8bc5a6c39` |
| Live immutable identity | `/deployments/a9ab116f422b9c765cb63895760ef9c8bc5a6c39/35076562388-1.json`; candidate digest `sha256:5fa6352678335aca2361a55045ff759e1797cf880b32cca53560be74138fb279` |
| Commit ancestry | [compare](https://github.com/FedorMilovanov/gb-is-my-strength/compare/a9ab116f422b9c765cb63895760ef9c8bc5a6c39...6bf5fd7212eaf88ac21d719947f98a1d6f21eb37): main ahead 50 / behind 0 |
| Last main deploy | [run 35216588257](https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/35216588257), failure; promotion skipped |
| Exact failed step | [job 105186398884](https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/35216588257/job/105186398884): broad production-like dist smoke; desktop and mobile H1 mismatch |
| Native heading owner | [RodosloviyeBody.astro at main anchor](https://github.com/FedorMilovanov/gb-is-my-strength/blob/6bf5fd7212eaf88ac21d719947f98a1d6f21eb37/src/components/rodosloviye/RodosloviyeBody.astro): `От Адама до Христа` |
| Stale oracle | [dist-smoke-audit.js](https://github.com/FedorMilovanov/gb-is-my-strength/blob/6bf5fd7212eaf88ac21d719947f98a1d6f21eb37/scripts/dist-smoke-audit.js): `Родословие от Адама до Христа` |
| Existing independent oracle | [genealogy-browser-contract.mjs](https://github.com/FedorMilovanov/gb-is-my-strength/blob/6bf5fd7212eaf88ac21d719947f98a1d6f21eb37/scripts/genealogy-browser-contract.mjs): already asserts `От Адама до Христа` |

**Correction to the incoming plan:** the last main deployment did not fail in
WebKit. Its full genealogy and reduced-motion steps passed; the downstream H1
oracle failed. WebKit instability is separately evidenced on open PR #2139.
Do not infer its mechanism from the error message alone.

## Open work and collision boundaries

| PR | Exact observed head | Disposition |
|---|---|---|
| [#2136 Reader](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2136) | `246ddac7ed6da580ae284c79bc30248338e1e8b4` | Existing canonical Reader owner; final checks and production still required. |
| [#2137 editorial](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2137) | `e4cd38a1501f1879221af1e4549ba2cf922230d3` | Existing editorial owner; base `5e83852f...` precedes current main. Reported reduction is not merged completion. |
| [#2138 dependencies](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2138) | Read scope: package.json and lockfile | Fourth PR omitted from incoming census. Review independently after release recovery; do not silently combine Playwright/React/Astro changes with current failure diagnosis. |
| [#2139 WebKit](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2139) | `14dbc7b75d12f5f94572c3a77c70aeec1c1857aa` | Existing single-file harness owner; remains red. |

All four PR changed-file lists were checked for the bounded release repair.
None modifies `scripts/dist-smoke-audit.js` or
`.github/workflows/deploy-candidate-contract.yml`. AuditRepo had no open PR at
preflight. Branch age is not ownership or retirement proof.

## Admitted findings

### SYS-RELEASE-PRODUCTION-DRIFT — CONFIRMED-CURRENT

The last main candidate reports exactly two failures, both caused by the obsolete
H1 expectation; all 28 route/viewport lines report HTTP 200 and zero overflow.
The current native source and the dedicated genealogy contract agree on the new
heading. The PR candidate workflow does not run the broad smoke that deployment
runs, allowing this mismatch to escape pre-merge verification.

Bounded SYSTEM repair: update the independent expected heading and invoke the
existing broad smoke in the PR candidate workflow. Preserve canonical, H1,
overflow, page-error and desktop/mobile checks. Do not derive expected text from
the same rendered output or change the public heading to satisfy the stale test.

Closure requires the final PR SHA, resulting main deployment and live identity;
this report does not claim any of those future outcomes.

### SYS-GENEALOGY-WEBKIT-WITNESS — CONFIRMED-CURRENT, mechanism unresolved

[Exact #2139 candidate job](https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/35579709567/job/106269488296)
fails at `assertLegalRelationInteractions`, clicking the Jesus node after the
Joseph relation inspector. Stack: line 767 → isolated interaction phase → fresh
focus browser → main. Error: `Target page, context or browser has been closed`.
The viewport core reports success before that failure at 1440×1000.

Main already isolates WebKit by viewport. #2139 additionally isolates focus and
legal relations into fresh browser processes. Consequently, further isolation is
a hypothesis, not an established root-cause repair. Preserve every assertion;
add diagnostic/negative evidence appropriate to the eventual demonstrated fix.
No retries, skipped sizes or lowered gates constitute closure.

### GB-READER-POLISH-CLOSURE — verified necessary improvement

The owner's selected Reader implementation is present in open #2136. Reuse that
lane. Revalidate on the then-current published baseline, retain 320px controls,
TTS/fallback, print, focus and browser coverage, merge with an expected head SHA,
then inspect the resulting release and live Reader behavior.

### GB-GENEALOGY-EDITORIAL-CLOSURE — verified necessary improvement

#2137 reports 2825→1217 pending Russian names and 179→139 pending relations,
with 1608 direct name proofs and 40 additional Matthew relation qualifications.
Those figures are PR-body claims at the recorded head, not independent full
corpus certification in this pass. Rebuild and inspect proof semantics before
merge; then record measured batch deltas. Never equate Matthew's textual
genealogical assertion with proof that no generations were compressed. Keep raw
phase1-draft separate from the publishable projection.

## Ordered waves and exit evidence

This table sequences work; it is not a second active defect matrix. Promote later
program items only with the relevant current verification. MASTER owns admitted
findings; WORK_QUEUE retains optional measurements.

| Wave | Bounded result | Required exit evidence / dependency |
|---|---|---|
| 0 | Correct current truth | Reviewed narrow AuditRepo PR; matrix arithmetic and direct witnesses valid. |
| 1A | Release H1 oracle and candidate parity | Source + negative H1 witness; workflow/control-plane checks; exact-head candidate green. |
| 1B | Existing WebKit lane | Demonstrated mechanism; full browser/viewport and reduced-motion coverage; negative witness; no weakened assertion. Can proceed separately from 1A diagnosis. |
| 2A | Publish stable main | Immutable candidate → successful Pages promotion → releaseSha equality and required generic/TTS/genealogy live evidence. |
| 2B | Reader #2136 | Baseline 2A; final-head required checks, expected-head merge, new release and live witnesses. |
| 3 | Genealogy engineering and #2137 integration | Baseline 1B; final current-main projection/runtime/CI contracts; deterministic rebuild and editorial proof audit. |
| 4 | Genealogy editorial batches | Messianic spine, Matthew, Luke, patriarchs, Judah/David, Levites, tribes, women, nations, remaining source batches. Every reviewed item has direct evidence; pending counts decrease truthfully. |
| 5A | Baptist Git + Drive source inventory | Enumerated branch commits/files and Drive folders; source tier/page/claim mapping; no private archive export or automatic rights grant. |
| 5B | Baptist chapter reconciliation and media | Fresh source-backed chapter slices; current authoritative claim/media ledgers; rights and asset hashes; content/browser checks. Preserve old unique evidence until represented. |
| 6 | Maps publication | Current route/data/media review; label collision, controls, keyboard, mobile/desktop, themes, performance and applicable owner visual boundary. Each audit map gets explicit publish or retirement disposition. |
| 7 | Bible/rights integrations | Exact edition grant, attribution/storage/cache/search boundaries and fail-closed contracts. External unanswered requests remain BLOCKED_EXTERNAL, never fabricated permission. |
| 8 | Measured quality, dependency review, branch retirement | Baselines before budgets; classify dependencies; per-ref unique-content inventory and verified salvage before any deletion. Final source/CI/live/MASTER recheck. |

Useful parallel work during release recovery is read-only source/branch/rights
inventory. Shared runtime, CSS, workflows and publication remain single-owner
surfaces. No blanket rebase or bulk merge of old research branches.

## External and non-defect boundaries

- [#1753](https://github.com/FedorMilovanov/gb-is-my-strength/issues/1753)
  and [#1812](https://github.com/FedorMilovanov/gb-is-my-strength/issues/1812)
  remain external rights boundaries. Current issue text/grants must be reread
  before any integration or permission claim.
- [#1944](https://github.com/FedorMilovanov/gb-is-my-strength/issues/1944)
  remains open at census. Direct-Pages authority makes it a reverify-for-obsolescence
  candidate; this report does not close it merely from its title.
- [Map catalog](https://gospod-bog.ru/karty/) exposes one open and nine audit maps
  in the retrieved page. This is publication backlog, not proof that nine maps
  have the same renderer defect; obtain direct live browser evidence before changes.
- Drive traversal confirms a course/session archive and a common resource folder.
  File discovery does not establish historical accuracy or publication rights.
  Private links and document contents are excluded from this public repository.
- The earlier claim of 205 remote branches is not re-counted here. Treat it as
  incoming historical inventory until the planned fresh ref sweep is complete.
- Current-main scheduled Source Link Audit is red in run 35579235403. Its cause
  is not inspected here and is not yet an admitted independent defect.

## Verification record and limitations

- Pre-change AuditRepo matrix coverage: PASS, zero active IDs. This proves parser
  consistency, not current Product completeness.
- Read-only GitHub source/PR/job logs and live HTTP identity obtained independently.
- Product local install succeeded. Local WebKit execution is presently unavailable:
  required shared libraries are absent and the environment rejects apt's privilege
  transition. Browser downloads also encountered truncated archives. Do not count
  this as a Product regression or claim a local browser pass.
- Required hosted browser checks remain the merge barrier. No Product code,
  merge, deployment, external message or branch deletion is claimed by Wave 0.
