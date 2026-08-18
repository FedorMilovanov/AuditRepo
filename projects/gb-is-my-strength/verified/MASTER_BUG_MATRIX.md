# MASTER BUG MATRIX — gb-is-my-strength

> **SSOT только текущей верифицированной нужной работы `gospod-bog.ru`.** Это рабочая очередь, не архив и не зеркало Product. Решённое / stale / duplicate / absorbed / invalid / superseded не остаётся активным в MASTER. Current Product truth перечитывается из Product в момент решения.

Current forensic/admission model:
- [`FORENSIC_CONTROL_PLANE_AUDIT_2026-08-11.md`](./FORENSIC_CONTROL_PLANE_AUDIT_2026-08-11.md)

Latest historical terminal control-plane evidence:
- [`CONTROL_PLANE_FINAL_CLOSURE_2026-08-12.md`](./CONTROL_PLANE_FINAL_CLOSURE_2026-08-12.md)

Operating authority:
- [`../../../AUDITREPO_OPERATING_MODEL.md`](../../../AUDITREPO_OPERATING_MODEL.md)

## Current state

| Поле | Значение |
|---|---|
| Active work units | **7** |
| Direct current defects | **1** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **5** |
| System verification lanes | **0** |
| Owner decisions | **1** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

## CURRENT DEFECTS — 1

| ID | Current problem | Boundary |
|---|---|---|
| `D-19` | `AntisovetovPageHead.astro` `<title>` suffix is malformed. Confirmed current 2026-07-17 on 5 pages (Antisovetov, Kod Da Vinchi, Diotrefy, Pastor Series Home, Nagornaya Series Home). | `src/components/article-pilots/antisovetov/AntisovetovPageHead.astro` |

## VERIFIED NECESSARY IMPROVEMENTS — 0

| ID | Needed implementation | Why |
|---|---|---|

## NARROWED RESIDUALS — 5

| ID | Current residual |
|---|---|
| `HTML-BTN-TYPE` | JS-driven interactive buttons (`themeToggle`, `hMobileMenuBtn`) in `HardTextsPageChrome` are missing `type="button"`. Verified current in `HardTextsPageChrome` (all buttons), `AboutPageChrome` (#themeToggle) and `NagornayaChast1PageChrome` (#menuBtn). |
| `AR-IDX-JS-02` | Legacy runtime scripts (`js/enhancements.js`) still write to the legacy `theme` localStorage key, maintaining a multi-writer surface despite canonical owner in `reader-preferences.js`. |
| `D-2` | `css:layer:validate` script only validates `css/site.css`, bypassing layer validations for `css/home.css` and `css/floating-cluster.css`. |
| `A11Y-OG-META-MALFORMED` | `og:title` in articles (Antisovetov, Kod Da Vinchi, etc.) shares the `D-19` malformed suffix (`| Господь Бог` instead of full brand). Verified current 2026-07-17. |
| `A11Y-SEARCH-MODAL-MISSING` | `gbSearchBtn` present in multiple shell layouts but corresponding modal container (#searchModal or similar) is missing from static HTML source, relying entirely on unproven JS injection. |

## SYSTEM VERIFICATION LANES — 0

| ID | Verified work package | Next boundary |
|---|---|---|

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
