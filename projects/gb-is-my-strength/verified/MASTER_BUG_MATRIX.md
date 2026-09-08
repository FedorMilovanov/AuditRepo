# MASTER BUG MATRIX — gb-is-my-strength

> SSOT for current verified necessary work only. This is not a history table or a mirror of every source-repository signal.
>
> The causal system synthesis remains grounded in merged AuditRepo evidence package #344 (`45b985737f192f709d7e1ee7324250d0e0986ca1`) at Product anchor `94b8eaad0951c6b43cf1e55fc6c54b9114329f61` (2026-08-20). On 2026-09-06, the three bounded direct-defect rows were current-checked against Product `main` `f135a5739d2a557f866bb92740cd417fe1d185c2`: two were closed by merged Product repairs and moved to `CLOSURE_LEDGER.md`, while `RODOSLOVIYE-OG-IMAGE` remained current. Later the same day, `BROWSER-MATRIX-ZERO-WORKER-FAILOPEN` was separately current-checked against Product `main` `29204573b78f15f4e49455ccc4a63722f033d6bd` and removed after the complete #1798 + #1804 system repair chain. Later the same day, `LAZY-RUNTIME-LOADER-FAILURE-STATE` was closed by the selective Product repair chain #1814 + #1825 at Product `main` `87032f928c4894d8e2945aa1a41a1fe945eb72c5`. On 2026-09-07, `TTS-SHAREDWORKER-CLIENT-LIFECYCLE` was separately closed by Product #1831 at Product `main` `5938394cf4f308f441396c87a3ab5250483a539d`. Also on 2026-09-07, `SCRIPTURE-OCCURRENCE-REPRESENTATION-ORACLE` was separately closed by Product #1835 / merge `3cd80c63220d1a221f90b9aca3b5f6ddc2a17473`; its repair remained present at the then-current Product `main` `fc2e4570edd9bcc9ffb0588b0bb4f31299ecfb6b`. `SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS` was separately closed by Product #1829 / merge `4750b649eab5ad749c8b84f11fc064370b42225f`; its four repair paths remained unchanged through Product `main` `fc2e4570edd9bcc9ffb0588b0bb4f31299ecfb6b`. `RODOSLOVIYE-OG-IMAGE` was separately closed by Product #1843 / merge `856f1bdeab7b674aedd5655279e9fc3c5f6b0b76`: exact tested head `76e9b1898654dcb368eaa4777cfe7e72d63852a5` completed all applicable CI successfully, and the Product merge tree had no file difference from that certified head. `SW-ROOT-GENERATION-AUTHORITY` was separately closed by Product #1842 / merge `d6b1906f0d263e23b45355bea0460ee00581bc38`: exact certified head `cb63ba35612c6aa97044656e1ed65e29514e4328` completed all applicable admission CI successfully, the merge used an expected-head/CAS barrier, and current Product `main` retained the repair. On 2026-09-08, `ARTICLE-LEGACY-CAPABILITY-PARTIAL-MIGRATION-ROOT` was separately closed by Product #1851 / merge `3c2def019b88069d9e48ba866a3c4287b8e8add3`: exact certified head `87601539e9fe942c41e6a7e58bc9e34ee0a5d6ef` completed 44 terminal checks with no remaining failure/queued/in-progress result, merge used `expected_head_sha`, and the 11 Article repair paths remain unchanged through current Product `main` `d3759918e68e475ab6bdeadc11ff872a3ffa523f`. The remaining two system verification lanes are intentionally unchanged and require their own evidence before any future disposition.

## Current state

| Field | Value |
|---|---|
| Active work units | **2** |
| Direct current defects | **0** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **0** |
| System verification lanes | **2** |
| Owner decisions | **0** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

> Arithmetic: 0 direct current defects + 0 improvements + 0 residuals + 2 system verification lanes + 0 owner decisions = 2 independent repair owners. Named manifestations such as RSS date collapse, CSP variants/gaps and nosniff meta misuse remain closure witnesses under their causal owner; they are not separate active rows.

## CURRENT DEFECTS — 0

| ID | Current problem | Closure boundary |
|---|---|---|

## VERIFIED NECESSARY IMPROVEMENTS — 0

| ID | Required improvement | Closure boundary |
|---|---|---|

## NARROWED RESIDUALS — 0

| ID | Current residual | Closure boundary |
|---|---|---|

## SYSTEM VERIFICATION LANES — 2

| ID | Current causal problem | Absorbs / closure boundary |
|---|---|---|
| `METADATA-SSOT-PROLIFERATION` | Editorial/publication truth is still projected through multiple authorities. Current manifestations include `/hard-texts/` label divergence and RSS/page editorial-date divergence; route membership itself is currently consistent (sitemap 76/76, curated search manifest 75/75, RSS 58/58). | **Absorbs `EDITORIAL-LABEL-INCONSISTENCY` and `RSS-SERIES-DATE-COLLAPSE`.** One editorial authority feeds Header/page metadata/search-manifest/sitemap/feed; prove value parity and RSS ordering, not merely membership. |
| `FRAGMENTED-SECURITY-OWNERSHIP` | Security policy ownership is split across page-head CSP/meta/postbuild and transport response headers. Historical CSP variants/gaps are manifestations of the HTML/document layer; `X-Content-Type-Options: nosniff` is a response-header concern and cannot be closed by an HTML meta pragma. | **Absorbs `SECURITY-CSP-INCONSISTENCY`, `SECURITY-CSP-GAPS`, and `SECURITY-NOSNIFF-OWNER-LAYER-MISMATCH`.** Define separate authoritative document-policy and transport-header owners; prove source→artifact/live parity. Do not claim a live missing-nosniff vulnerability without response-header measurement. |

## OWNER DECISIONS — 0

| ID | Missing decision | Closure boundary |
|---|---|---|

## Retired / absorbed by the 2026-08-20 consolidation

These IDs are intentionally absent from active arithmetic; provenance is appended to `CLOSURE_LEDGER.md` and retained in merged evidence #344.

- `EDITORIAL-LABEL-INCONSISTENCY` → manifestation of `METADATA-SSOT-PROLIFERATION`.
- `RSS-SERIES-DATE-COLLAPSE` → public-artifact witness under `METADATA-SSOT-PROLIFERATION`.
- `SECURITY-CSP-INCONSISTENCY` + `SECURITY-CSP-GAPS` → manifestations of `FRAGMENTED-SECURITY-OWNERSHIP`.
- `SW-PWA-FRESHNESS` → superseded by the now-closed `SW-ROOT-GENERATION-AUTHORITY` owner.
- `MISSING-BUTTON-TYPE` → preventive cleanup/evidence under the closed `SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS` owner; it is not an independent current submit defect.
- `SITEWIDE-BTN-TYPE-AUDIT` → retired/replaced by the closed `SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS` owner.
- `AR-IDX-JS-02-MULTIWRITER` → retired from active MASTER: canonical `gb:reader-preferences:v1` owns truth; legacy `theme` is a coordinated compatibility mirror with regression coverage.

## Closed bounded direct defects after the 2026-08-20 consolidation

These IDs are intentionally absent from active arithmetic. The 2026-09-06 closures retain their exact Product repair receipts in `CLOSURE_LEDGER.md`; later closures retain dedicated current-head receipts under `reverify/`.

- `GENEALOGY-NO-ERROR-BOUNDARY` → closed by Product PR #1768 / merge `a24956adf4e8f759c07bcb0547539f2582179196`; current `GenealogyTree` owns an island-local error boundary and retry fallback.
- `APP-MASK-NO-WEBKIT-FALLBACK` → closed by Product PR #1770 / merge `35785842f7cabffaacf3ba60e2c549ad19733f96`; current App and Map mask owners carry paired WebKit/unprefixed declarations.
- `RODOSLOVIYE-OG-IMAGE` → closed by Product PR #1843 / merge `856f1bdeab7b674aedd5655279e9fc3c5f6b0b76`; exact tested head `76e9b1898654dcb368eaa4777cfe7e72d63852a5` owns the route-specific social image, metadata projection and deterministic source/dist contract, and the Product merge tree has no file difference from that certified head.

## Negative/current boundaries preserved

- Literal same-page fragments: 77 checked / 0 missing targets; generated Scripture occurrence fragments are now independently guarded by a structural literal-`id` oracle rather than the retired boundary regex.
- Literal ARIA relationships: 924 checked / 0 missing literal targets.
- Search manifest identity: 76 items / 76 unique IDs / 0 duplicate IDs.
- ReaderState: 48 series routes / 0 legacy-key collision groups.
- 380 current `_blank` source links include `noopener`.
- Telemetry graph: 53 route graphs with one Metrika init, 32 without, 0 duplicate init; no sitewide-analytics requirement was established.
- Two stale floating-controller TTS revision literals remain historical source-surface evidence only: all 57 real floating-controller Astro route graphs also mount canonical `ReaderActionsRuntime`; source-surface completeness itself is closed by the repository-derived scanner authority recorded below.

## Evidence authority

Primary merged causal package:

- `../incoming/chatgpt/2026-08-19/README.md`
- `../incoming/chatgpt/2026-08-19/VERIFIER_SYNTHESIS_TARGET_MATRIX_2026-08-20.md`
- supporting forensic witnesses in the same directory
- AuditRepo evidence merge #344: `45b985737f192f709d7e1ee7324250d0e0986ca1`

The remaining two system-lane evidence boundaries stay at Product `94b8eaad0951c6b43cf1e55fc6c54b9114329f61` until each owner is separately reverified or repaired. `BROWSER-MATRIX-ZERO-WORKER-FAILOPEN` was separately current-checked and removed at Product `29204573b78f15f4e49455ccc4a63722f033d6bd`; closure evidence is `../reverify/CURRENT_HEAD_REVERIFY_2026-09-06_browser-matrix-zero-worker-closure-29204573.md`. `LAZY-RUNTIME-LOADER-FAILURE-STATE` was separately current-checked and removed at Product `87032f928c4894d8e2945aa1a41a1fe945eb72c5` after Product #1814 + #1825; closure evidence is `../reverify/CURRENT_HEAD_REVERIFY_2026-09-06_lazy-runtime-loader-failure-state-closure-87032f92.md`. `TTS-SHAREDWORKER-CLIENT-LIFECYCLE` was separately current-checked and removed at Product `5938394cf4f308f441396c87a3ab5250483a539d` after Product #1831; closure evidence is `../reverify/CURRENT_HEAD_REVERIFY_2026-09-07_tts-sharedworker-client-lifecycle-closure-5938394c.md`. `SCRIPTURE-OCCURRENCE-REPRESENTATION-ORACLE` was separately current-checked and removed after Product #1835 / merge `3cd80c63220d1a221f90b9aca3b5f6ddc2a17473`; its current Product witness at reconciliation was `fc2e4570edd9bcc9ffb0588b0bb4f31299ecfb6b`, and closure evidence is `../reverify/CURRENT_HEAD_REVERIFY_2026-09-07_scripture-occurrence-representation-oracle-closure-3cd80c63.md`. `SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS` was separately current-checked and removed after Product #1829 / merge `4750b649eab5ad749c8b84f11fc064370b42225f`; its four repair paths were unchanged at Product `main` `fc2e4570edd9bcc9ffb0588b0bb4f31299ecfb6b`, and closure evidence is `../reverify/CURRENT_HEAD_REVERIFY_2026-09-07_source-surface-audit-false-completeness-closure-4750b649.md`. `RODOSLOVIYE-OG-IMAGE` was separately repaired by Product #1843 / merge `856f1bdeab7b674aedd5655279e9fc3c5f6b0b76`; exact tested head `76e9b1898654dcb368eaa4777cfe7e72d63852a5` completed all applicable CI successfully, and the Product merge commit had no file difference from the certified head; closure evidence is `../reverify/CURRENT_HEAD_REVERIFY_2026-09-07_rodosloviye-og-image-closure-856f1bde.md`. `SW-ROOT-GENERATION-AUTHORITY` was separately repaired by Product #1842 / merge `d6b1906f0d263e23b45355bea0460ee00581bc38`; exact certified head `cb63ba35612c6aa97044656e1ed65e29514e4328` completed all applicable admission CI successfully, merge used `expected_head_sha`, and current Product `main` retained the repair; closure evidence is `../reverify/CURRENT_HEAD_REVERIFY_2026-09-07_sw-root-generation-authority-closure-d6b1906f.md`. `ARTICLE-LEGACY-CAPABILITY-PARTIAL-MIGRATION-ROOT` was separately repaired by Product #1851 / merge `3c2def019b88069d9e48ba866a3c4287b8e8add3`; exact certified head `87601539e9fe942c41e6a7e58bc9e34ee0a5d6ef` completed 44 terminal checks with no remaining failure/queued/in-progress result, merge used `expected_head_sha`, and none of its 11 repair paths changed through current Product `main` `d3759918e68e475ab6bdeadc11ff872a3ffa523f`; closure evidence is `../reverify/CURRENT_HEAD_REVERIFY_2026-09-08_article-legacy-capability-partial-migration-root-closure-3c2def01.md`. Direct current defects remain 0. No closure inference is made for the remaining two system owners from unrelated Product movement.

## Terminal disposition

Admit only independent necessary work. A symptom may remain an important closure witness without becoming another repair row. Remove solved, stale, duplicate, absorbed and superseded rows in the same consolidation transaction, and preserve their provenance in `CLOSURE_LEDGER.md`, `reverify/`, evidence, or Git history as appropriate.
