# gb-is-my-strength — live release / Strangler / Nagornaya reconciliation

Date: 2026-08-07

## Purpose

Reconcile three materially changed current findings without treating every Product `main` movement as an AuditRepo synchronization event:

1. close the remaining post-#1156 production-witness residual with exact push-to-main live evidence;
2. narrow `SYS-STRANGLER-RETIREMENT` from the pre-#1176 52-blocker state to the exact current-authority evidence produced by #1176;
3. broaden `NG-INLINE-01` from its original Part-I symptom to the verified duplicated series-level owner in Parts I/II/III/V.

No Product mutation is performed by this report.

---

## 1. Release lifecycle residual — CLOSED

Source lifecycle repair #1156 had already merged, but AuditRepo correctly withheld closure until one canonical push-to-main Pages release proved both generic and TTS live evidence on the same release/run/candidate.

Product #1185 merged as `c9055428da7f0249d4710e5946d4977e562d26a0` and its canonical `Deploy to GitHub Pages` push run `31213509892` failed in `Build and validate immutable release candidate` / `Static publication source gates`. The lifecycle notifier kept Product issue #474 open.

Product #1193 repaired the exact Hermenevtika semantic-manifest anchor and existing workflow trigger ownership, passed exact-head source/dist/shared/deploy/visual checks, and merged as:

`f3e291b714e6f834f73f3f4fa340719a5f6da6ea`

The next canonical push-to-main Pages run:

- workflow run: `31215559649`, attempt 1;
- branch: `main`;
- exact SHA: `f3e291b714e6f834f73f3f4fa340719a5f6da6ea`;
- notifier state: Product issue #474 automatically recovered/closed on this successful run.

### Generic live artifact

Artifact `release-live-deployment-31215559649`:

- artifact id: `9008856198`;
- artifact digest: `sha256:118489555f4015f6c107c884f540fdae24afb1a009a1df7c0cbe2774fe12ad9f`;
- `releaseSha` = `controlPlaneSha` = `f3e291b714e6f834f73f3f4fa340719a5f6da6ea`;
- `workflowRunId`: `31215559649`;
- candidate id: `f3e291b714e6f834f73f3f4fa340719a5f6da6ea:31215559649-1`;
- candidate digest: `sha256:3085206f896901ec58626c8ebfdb696e763dccb0526fd2c854edc2c2e2ffb613`;
- `phase: complete`;
- `result: PASS`;
- live Home bytes/SHA, Refutations stylesheet, sitemap, feed, Pagefind and service worker were bound to the immutable candidate.

### TTS live artifact

Artifact `tts-live-deployment-31215559649`:

- artifact id: `9008857496`;
- artifact digest: `sha256:c89fa76aaa63deed948d6de6bf9a4ea1b23cd889f7a6bbe66194a2d5b5c5e814`;
- `releaseSha` = `controlPlaneSha` = `f3e291b714e6f834f73f3f4fa340719a5f6da6ea`;
- `workflowRunId`: `31215559649`;
- provenance path: `/deployments/f3e291b714e6f834f73f3f4fa340719a5f6da6ea/31215559649-1.json`;
- candidate digest: `sha256:3085206f896901ec58626c8ebfdb696e763dccb0526fd2c854edc2c2e2ffb613`;
- `phase: complete`;
- `result: PASS`;
- both sampled live routes used the expected revisioned controller/engine and the worker/CSS/service-worker evidence matched the same release provenance.

### Disposition

`AUDIT-P2-WORKFLOWS-CHECK-GAP` is **closed**. The exact closure condition written in MASTER is satisfied: generic and TTS evidence are terminal `PASS / complete` and are bound to one current merged SHA, workflow run and immutable candidate digest.

---

## 2. `SYS-STRANGLER-RETIREMENT` — narrowed 52 → 23 blockers

Exact Product #1176 head:

`bb0f4dc717149b630588511b811984c4b7793436`

passed all 10 registered workflow groups. Shared Files Guard run `31209021610` emitted artifact `repository-control-plane-audit-31209021610`:

- artifact id: `9005922192`;
- digest: `sha256:b919c3b4aa6f0ea69303a428a3c2f159f34120e864e392a7f4b761f9dc46770b`.

Exact `legacy-shadow-retirement-readiness.json` summary:

- public indexes: `53 / 53`;
- native shadows: `52`;
- ledger entries: `53`;
- missing ledger candidates: `0`;
- classification-clear references: **52**;
- unknown reference decisions: **0**;
- reference owner decisions: **0**;
- unexpected reference classifications: `0`;
- integrity problems: `0`;
- inventory coverage problems: `0`;
- parity problems: `0`;
- parity authority clear: `true`;
- mechanical repoints: **13**;
- obsolete-or-repoint: **3**;
- dependency owner decisions: **7**;
- unknown dependency impacts: `0`;
- blocker total: **23**;
- `deletionReady: false`;
- `physicalMoveAuthorized: false`;
- verdict: `NOT_YET_SAFE_TO_MOVE_OR_DELETE`.

The pre-#1176 29 unknown reference decisions are therefore no longer current blockers. Route profiles now provide explicit current authority; immutable ledger classification remains historical snapshot metadata.

### Remaining mechanical repoints — 13

- `scripts/article-native-contract-audit.js`
- `scripts/content-coverage-audit.js`
- `scripts/content-source-provenance-audit.js`
- `scripts/gill-claim-surface-audit.js`
- `scripts/gill-context-visual-parity-audit.js`
- `scripts/gill-reading-time-canonical-audit.js`
- `scripts/gill-spravochnik-visual-parity-audit.js`
- `scripts/legacy-shadow-wrapper-audit.js`
- `scripts/legacy-source-authority-regression-test.js`
- `scripts/lib/legacy-source-authority.js`
- `scripts/lib/route-source-contract.js`
- `scripts/nagornaya-visual-parity-audit.js`
- `scripts/visual-parity-contract.js`

### Obsolete / repoint — 3

- `scripts/legacy-audits/article-mdx-pilot-audit-legacy.js`
- `scripts/legacy-audits/baptisty-series-shadow-audit-legacy.js`
- `scripts/legacy-audits/check-mdx-html-parity-legacy.js`

### Owner decisions — 7

- `scripts/audit-pro.js`
- `scripts/baptisty-roadmap-audit.js`
- `scripts/nagornaya-bar-asset-contract-test.js`
- `scripts/nagornaya-pastoral-safety-regression-test.js`
- `scripts/nagornaya-source-integrity-regression-test.js`
- `scripts/owner-ui-regression-guard.js`
- `scripts/readable-audit.js`

Physical move/delete remains forbidden. The next transaction is dependency/quarantine-owner work until `blockerTotal=0`, followed by one atomic move and a fresh production-like publication proof.

Active Product #1187 is currently refining the cache-bust/reference-only authority boundary and registers `scripts/cache-bust.js` as an additional existing dependency reader. Its final exact-head artifact may increase the dependency-record count, but it does not reopen the 29 retired reference decisions; final Strangler counters should be re-read after #1187 before a physical-retirement transaction.

---

## 3. `NG-INLINE-01` — current root broadened

Fresh current-main source verification on Product `f3e291b714e6f834f73f3f4fa340719a5f6da6ea` found the same `Из библиотеки` presentation block in:

- `src/components/nagornaya/chast-1/NagornayaChast1MainShell.astro`;
- `src/components/nagornaya/chast-2/NagornayaChast2MainShell.astro`;
- `src/components/nagornaya/chast-3/NagornayaChast3MainShell.astro`;
- `src/components/nagornaya/chast-5/NagornayaChast5MainShell.astro`.

Part IV does not carry that block.

The four copies retain the same hardcoded light/bronze presentation family, including `#faf8f5`, `#b8882a`, `#8a5c10`, `#8a7968` and rgba border/rule values. This is therefore one duplicated series-level presentation owner, not a Part-I-only defect.

Product #1186 proved a clean Part-I token mapping and passed its exact-head checks, but was closed **without merge** after this broader root was discovered. A fresh successor must repair I/II/III/V together, preserve Part IV, copy/text/link semantics and avoid unrelated shared CSS/JS ownership. Old #1186 green evidence must not be reused as successor merge evidence.

---

## Current coordination boundary

At this report:

- Product #1193: merged as `f3e291b7…`;
- Product #1187: active SYSTEM owner for cache-bust/reference-only authority;
- Product #1183: active/frozen Search SYSTEM owner, to be rebuilt/re-proved after #1187;
- Product #1186: closed unmerged as superseded after the Nagornaya root broadened;
- AuditRepo has no competing gb-is-my-strength PR owner before this reconciliation lane.

No new Product lane should collide with #1187/#1183 shared authority/runtime surfaces. The fresh Nagornaya successor should be opened only against the then-current main after that shared boundary is stable enough to avoid synthetic projection churn.
