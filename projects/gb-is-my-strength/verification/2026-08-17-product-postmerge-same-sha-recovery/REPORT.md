# Product post-merge same-SHA recovery reconciliation — 2026-08-17

## Scope

This report classifies two post-merge Product control-plane signals on the unchanged current Product `main` SHA:

- Product: `FedorMilovanov/gb-is-my-strength`
- Product `main`: `a2ef67da54dd4ae00aedae154422280620acdf21`
- Product tree: `9fc8e43a3ecffc4c87f303c837268600facd9a0e`

The purpose is to distinguish a current Product defect from a recoverable same-SHA execution/control-plane failure. No Product source mutation was made for either signal.

## 1. Atlas Focus State Contract

Workflow run `32051787990` is bound to Product `main` `a2ef67da54dd4ae00aedae154422280620acdf21`.

### Attempt 1

Job `95452632754` reached the substantive browser contract after successful checkout, exact-SHA proof, dependency install, Chromium/WebKit install and production-like build. The `Run Atlas focus-state contract` step failed while waiting for the semantic focus handoff across the `980 -> 981` breakpoint after responsive state synchronization. The failure artifact `atlas-focus-state-32051787990-1` was uploaded.

This was therefore not classified from the red badge alone. The failed attempt had entered the real browser witness and produced evidence.

### Attempt 2 — recovery

The native job rerun stayed on the same workflow run and same Product SHA. Job `95504712044` completed successfully:

- checkout exact tested commit — success;
- prove commit identity — success;
- install dependencies — success;
- install Chromium and WebKit — success;
- build production-like dist — success;
- run Atlas focus-state contract — **success**;
- upload Atlas focus evidence — **success**.

Attempt-2 artifact:

- name: `atlas-focus-state-32051787990-2`;
- artifact ID: `9300806284`;
- artifact digest: `sha256:d4e78bc015409b9817fe7cc5d7720fa1bc96e9a6f648e886f84275b72d3c05db`.

The uploaded `result.json` reports:

```text
conclusion = success
sha = a2ef67da54dd4ae00aedae154422280620acdf21
route = /map/
browsers = chromium, webkit
widths = 390, 680, 681, 980, 981, 1440
cases = 12
uncaught page errors = 0 across all 12 cases
```

The previously failing 980 -> 981 focus handoff is present in the successful evidence for both Chromium and WebKit: focus lands on a rendered interactive `.atlas-theme.is-active` control when the drawer becomes the desktop sidebar; the reverse transition restores focus to `#atlasFilterTrigger`. The adjacent resize witnesses also complete with safe rendered focus.

### Disposition

`Atlas Focus State Contract` is **same-SHA recovered**. The recovery executed the substantive contract and evidence upload; it did not merely clear a notifier. There is no current evidence requiring a Product code mutation, and `SYS-ATLAS-DRAWER-FOCUS-HANDOFF` is not reopened from this signal.

This disposition does not claim that arbitrary future Atlas reds are harmless. A future different-SHA failure or repeated same-mechanism failure requires fresh classification.

## 2. Product -> Research durable release receipt

The underlying Product workflow `Product to Research release witness` run `32051787946` completed successfully on the same Product SHA `a2ef67da54dd4ae00aedae154422280620acdf21` and produced artifact `product-research-release-witness-32051787946` (artifact ID `9295152593`).

The downstream `Notify on Workflow Failure` run `32052369487` initially failed only while publishing the durable receipt. Its lifecycle reconciliation step succeeded, but the GitHub API returned HTTP `503` while PATCHing issue `#836`. This left the durable issue body on an older Product SHA even though the underlying release witness itself was green.

A native rerun of the failed notifier job stayed on the same triggering Product evidence and completed successfully. Product issue `#836` is now closed/completed with:

- title: `Product release witness a2ef67da54dd`;
- tested SHA: `a2ef67da54dd4ae00aedae154422280620acdf21`;
- run: `32051787946` attempt 1;
- branch: `main`;
- evidence artifact: `product-research-release-witness-32051787946`, ID `9295152593`.

### Disposition

The durable Product -> Research receipt gap is **recovered**. The original failure was an external GitHub API service failure during publication of an already-green Product witness. No Product mutation is required.

## Active-work effect

These two post-merge Product signals are now classified as recovered and therefore do **not** add active MASTER rows.

The current terminal `PRODUCT ZERO` attestation nevertheless remains **STALE** for an independent reason: Research scheduled `Total cross-repo source audit` run `31996510796` is still an unrecovered red hard gate on Research `main` `8d6e5bc3f303d0a6a2d1a15969e042907f3387db`. Its active repair is owned by the separate Research branch `agent/source-audit-lock-recovery-20260817`; this report does not mutate or duplicate that work.

Likewise, `SYS-MAIN-ADMISSION-ENFORCEMENT` remains an owner decision. Product, AuditRepo and Research `main` still lack required-check enforcement.

## Final classification

```text
PRODUCT_POSTMERGE_ATLAS_RED = SAME_SHA_RECOVERED_WITH_SUBSTANTIVE_BROWSER_EVIDENCE
PRODUCT_TO_RESEARCH_DURABLE_RECEIPT_RED = SAME_EVIDENCE_RECOVERED_AFTER_GITHUB_API_503
PRODUCT_MUTATION_REQUIRED_BY_THESE_TWO_SIGNALS = NO
REOPEN_SYS_ATLAS_DRAWER_FOCUS_HANDOFF = NO
TERMINAL_PRODUCT_ZERO_CURRENT = NO
RESEARCH_SOURCE_AUDIT_HARD_GATE = STILL_ACTIVE
MAIN_ADMISSION_ENFORCEMENT_OWNER_DECISION = STILL_ACTIVE
```
