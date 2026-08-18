# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT только текущей верифицированной нужной работы `gospod-bog.ru`.** Это рабочая очередь, не архив и не зеркало Product. Решённое / stale / duplicate / absorbed / invalid / superseded не остаётся активным в MASTER. Current Product truth перечитывается из Product в момент решения.

Current forensic/admission model:
- [`FORENSIC_CONTROL_PLANE_AUDIT_2026-08-11.md`](./FORENSIC_CONTROL_PLANE_AUDIT_2026-08-11.md)

Latest historical terminal control-plane evidence:
- [`CONTROL_PLANE_FINAL_CLOSURE_2026-08-12.md`](./CONTROL_PLANE_FINAL_CLOSURE_2026-08-12.md)

Operating authority:
- [`../../../AUDITREPO_OPERATING_MODEL.md`](../../../AUDITREPO_OPERATING_MODEL.md)

Latest current reverify:
- [`../verification/2026-08-17-arena-current-head-reverify-gbs/REPORT.md`](../verification/2026-08-17-arena-current-head-reverify-gbs/REPORT.md) (Product `main` `3b6bac3904331176023fb7517f131c8c9360bbc5`)

## Current state

| Поле | Значение |
|---|---|
| Active work units | **6** |
| Direct current defects | **0** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **3** |
| System verification lanes | **2** |
| Owner decisions | **1** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

## CURRENT DEFECTS — 0

| ID | Current problem | Boundary |
|---|---|---|

## VERIFIED NECESSARY IMPROVEMENTS — 0

| ID | Needed implementation | Why |
|---|---|---|

## NARROWED RESIDUALS — 3

| ID | Current residual |
|---|---|
| `A11Y-NO-SCRIPT-ARIA` | `AtlasBody.astro` (`<main class="atlas-main">`) and `AtlasNoScriptFallback.astro` (`<main class="atlas-noscript">`) both render a `<main>` landmark on `/map` (`src/pages/map/index.astro`), exposing two `role=main` landmarks in one document. The original "title hidden/skipped" framing is invalid: `#atlasPageTitle` is server-rendered, not `hidden`, and not hidden by the noscript CSS. The residual keeps the ID and points at the real, reframed mechanism (one `main` per document). Needs a real browser/AT landmark-count check on `/map` with JS disabled. |
| `HTML-BTN-TYPE` | `themeToggle`, `hMobileMenuBtn` (and `hScrollTop`) in `HardTextsPageChrome`, `PastorSeriesPageChrome`, `AboutPageChrome`, `NagornayaSeriyaPageChrome` are missing `type="button"`. On HEAD `3b6bac3` the originally-stated "accidental submit" mechanism is **not supported**: none of the four shell components contain a `<form>`, and the buttons are siblings of `<slot/>`, not descendants of a slotted form. This is defensive hardening against a future form-in-shell path, not a current defect. Park candidate for `WORK_QUEUE.md` if a future form lands inside these shells. |
| `D-2` | `css:layer:validate` (`package.json`) runs `node scripts/css-layer-validator.js css/site.css --ceiling=200`; the validator processes exactly one file (`args.find(a => !a.startsWith('--'))`). `css/home.css` (113 KB) and `css/floating-cluster.css` (236 KB) bypass the @layer-contract / brace-balance / `!important`-ceiling guard despite being shipped CSS in the `validate:static-publication` chain. |

## SYSTEM VERIFICATION LANES — 2

| ID | Verified work package | Next boundary |
|---|---|---|
| `SYS-RESEARCH-SOURCE-AUDIT-HARD-GATE` | Research scheduled `Total cross-repo source audit` run `31996510796` failed on Research `main` `8d6e5bc3f303d0a6a2d1a15969e042907f3387db` before any substantive source-audit step executed. Job `95289017759` failed closed during hash-locked dependency installation; compile, deterministic/refined audits, dead-source classification, baseline enforcement and evidence upload were skipped. This red hard gate existed before AuditRepo #309 emitted its present-tense terminal attestation, so that terminal witness is stale. Evidence: `verification/2026-08-17-terminal-attestation-stale-research-hard-gate/REPORT.md`. | Do **not** duplicate the active Research repair: branch `agent/source-audit-lock-recovery-20260817` already advanced to `9eb87807a33a8e7cebfa4589710063b29d155a9d` and is treated as another agent's owner. Close this lane only after an exact-head repair is integrated without weakening fail-closed controls, a then-current Research-main source-audit run is green **and actually executes the substantive audit/evidence steps**, and AuditRepo performs a fresh cross-repo reconciliation before reissuing any terminal `ZERO`. |
| `SYS-THEME-KEY-MULTIWRITER` | The `localStorage["theme"]` key has no single owner. At Product `main` `3b6bac3` >=4 writers across 3 files write it: `js/enhancements.js` (setTheme -> `SiteUtils.themeKey ? ... : "theme"`, with `SiteUtils.themeKey === "theme"` set in `js/site.js`), `js/reader-preferences.js` (`safeSet('theme', ...)`), and two writers in `js/site.js` (the themeToggle controller `o(e)` and an inline `SiteUtils.themeKey` writer). Each derives state independently and only some fire `theme:changed` / handle cross-tab `storage` parity, so persisted value and dispatched events differ across entry points. Absorbs the previous `AR-IDX-JS-02` symptom. Evidence: `verification/2026-08-17-arena-current-head-reverify-gbs/REPORT.md`. | One canonical theme-state module (natural owner: the `reader-preferences.js` controller); every other caller uses a single `setTheme/getTheme` and does not touch `localStorage["theme"]` or `document.documentElement.classList` directly. Cross-tab parity handled in one place. Close only after one owner, no stray `"theme"` literals outside it, and cross-tab `storage` parity is preserved with a regression witness. |

## Closure in this wave

- `D-19` -> `closed-by-fix`: Product commit `79e59b64e9` "fix(seo): restore canonical title suffix (D-19)" at `2026-08-18T06:49:00Z`; HEAD `3b6bac3` shows full `<title>20 антисоветов, как пастору разрушить своё служение | Господь Бог — Сила Моя</title>`. Row removed from active MASTER; closure note only — full history remains in Git.
- `AR-IDX-JS-02` -> `absorbed-by-system-fix`: now a symptom of `SYS-THEME-KEY-MULTIWRITER`. Row removed from active residuals; absorbed under the new system lane. Fully retires when the system lane closes.


## OWNER DECISIONS — 1

| ID | Missing decision |
|---|---|
| `SYS-MAIN-ADMISSION-ENFORCEMENT` | Product, AuditRepo **and Research** `main` remain unprotected and required status-check enforcement is off. Research is authority-bearing input to Product admission/freshness, so omitting it from this decision would leave an uncontrolled authority path. Choose required always-created PR checks with a documented emergency bypass, or explicitly accept/document post-push red risk. This is a governance owner choice, not a current Product defect or a current release blocker, and this row does not authorize settings mutation or a workflow workaround pretending to be branch protection. Evidence: `verification/2026-08-13-max-agent-control-plane-retrospective/REPORT.md` plus `verification/2026-08-17-terminal-attestation-stale-research-hard-gate/REPORT.md`. |

## Freshness-bound terminal attestation — 2026-08-17 — **STALE**

The former `PRODUCT ZERO` snapshot at Product `main` `c729f799a7922c3e2641c14b8637c2a94f5e3f9d` remains historical evidence only. AuditRepo #309 later emitted a terminal attestation at Product `main` `a2ef67da54dd4ae00aedae154422280620acdf21`; that Product evidence remains useful historical evidence, but its present-tense `PRODUCT ZERO: CURRENT` label is **stale and must not be used as a current admission witness**.

Reason for invalidation:

- Research `main`: `8d6e5bc3f303d0a6a2d1a15969e042907f3387db`;
- scheduled Research `Total cross-repo source audit` run `31996510796` was created at `2026-08-17T05:02:43Z` and concluded `failure`;
- job `95289017759` failed during hash-locked dependency installation, before the deterministic/refined source audits, classification, baseline enforcement, reproducibility manifest and evidence upload could run;
- AuditRepo #309 / `feca55c651c9bfc584e9128aed032431cd2671da` was merged later at `2026-08-17T17:53:32Z`;
- therefore the unrecovered scheduled red hard gate already existed when #309 issued its `PRODUCT ZERO: CURRENT` text, which violates the terminal freshness rule in `AUDITREPO_OPERATING_MODEL.md`.

A separate post-#309 Product freshness signal has been classified and **recovered**, so it is not an active MASTER root: `Diotrophes Live Release Extension` run `32053106622` attempt 1 failed only because GitHub's artifact service could not serve the exact prerequisite live-PASS artifact. Native failed-job rerun attempt 2 stayed on the same run and Product SHA `a2ef67da54dd4ae00aedae154422280620acdf21`, downloaded the same artifact with the expected SHA-256, passed the verifier source contract, ran the actual live Diotrophes verifier successfully, uploaded evidence and recorded the idempotent witness. No Product mutation was required. Evidence: `verification/2026-08-17-diotrophes-live-release-same-sha-recovery/REPORT.md`.

This invalidation is deliberately bounded. It does **not** itself prove a new Product code defect and does not reopen the two repaired Product roots. The code/CI evidence at the attested Product tree remains historical evidence:

- Product `main`: `a2ef67da54dd4ae00aedae154422280620acdf21`;
- Product tree: `9fc8e43a3ecffc4c87f303c837268600facd9a0e`;
- exact pre-merge integration candidate: `6799a1213be673c7fee7f2cdeb13868fb383f73d`, with the **same tree** `9fc8e43a3ecffc4c87f303c837268600facd9a0e`;
- that exact candidate was integrated on top of then-current Product `main` `78bec8d7757d2746275a20ff3b1845d9ed206354` and completed all 20 observed relevant workflows successfully before squash merge, including Atlas Focus State, Native Source, Source Authority, Pagefind Landing Body, Runtime Interactive, Route Registry, Deploy Candidate, Visual Parity, dependency security, shared-files and supporting browser contracts;
- Visual Parity attempt 1 had one external TLS/certificate browser failure in the home progressive-enhancement step; attempt 2 on the **same exact SHA** completed successfully, and the stale notifier was closed as recovered rather than ignored;
- no separate post-merge workflow run was visible immediately for squash SHA `a2ef67da54dd4ae00aedae154422280620acdf21`; no post-merge-run claim is made. The historical merge evidence is bound to the byte-identical tree that completed the exact-head integration suite;
- the #309 reconciliation found **0 open Product issues** and **0 open Product PRs** at that time;
- AuditRepo issue #225 remains separate rights/outreach coordination. External replies include limited-quotation conditions/referrals/procedural API paths, but no protected full-corpus licence or TMS authorization has been admitted into Product; therefore it is not a Product mutation row in this MASTER.

Closure of the two previously active Product roots remains historical and is not reversed by the Research hard-gate failure:

- `PROD-SOURCE-LINK-ROT-20260817` — closed after Product PR #1692 merged and the relevant external source scan reported 311 checked links with 0 hard errors and no systemic transport failure;
- `SYS-ATLAS-DRAWER-FOCUS-HANDOFF` — closed after Product PR #1683 merged from an exact current-main integration candidate with Atlas Chromium/WebKit focus lifecycle green and surrounding source/build/runtime/deploy/visual gates green.

A new terminal `CURRENT` attestation may be issued only after `SYS-RESEARCH-SOURCE-AUDIT-HARD-GATE` satisfies its closure boundary and then-current Product, Research and AuditRepo anchors are reconciled. The standard invalidation rules still apply: Product main movement, new admitted defects, red hard gates, material Research authority movement, rights/provenance changes, or branch/ruleset/admission changes require fresh reconciliation.

Historical closure evidence remains in `CLOSURE_LEDGER.md`, `CONTROL_PLANE_FINAL_CLOSURE_2026-08-12.md`, verification/reverify material and Git history; it is intentionally not duplicated as active or closed rows in MASTER.

```text
PRODUCT ZERO: STALE — DO NOT USE AS CURRENT ADMISSION WITNESS
PRODUCT CODE DEFECT BACKLOG AT THE #309 ATTESTED TREE: 0
AUDITREPO / CONTROL-PLANE: 1 SYSTEM VERIFICATION LANE; 1 NON-BLOCKING OWNER DECISION
NO RIGHTS-BASED FULL-CORPUS PRODUCT MUTATION AUTHORIZED
```

Future signals must pass the normal admission gate from fresh current Product evidence before they enter MASTER.
