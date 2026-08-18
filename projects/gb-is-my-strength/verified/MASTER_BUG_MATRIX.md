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
| Active work units | **12** |
| Direct current defects | **6** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **2** |
| System verification lanes | **3** |
| Owner decisions | **1** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

## CURRENT DEFECTS — 6

| ID | Current problem | Boundary |
|---|---|---|
| `D-20` | `GillContextPageHead.astro` currently omits the canonical `| Господь Бог — Сила Моя` title suffix. Current-check: Product `3b6bac3904331176023fb7517f131c8c9360bbc5`. | `src/components/article-pilots/gill-context/GillContextPageHead.astro`; close with source + built title/SEO witness. |
| `D-21` | `KodDaVinchiPageHead.astro` currently uses the shortened `| Господь Бог` title suffix instead of `| Господь Бог — Сила Моя`. Current-check: Product `3b6bac3904331176023fb7517f131c8c9360bbc5`. | `src/components/article-pilots/kod-da-vinchi/KodDaVinchiPageHead.astro`; close with source + built title/SEO witness. |
| `D-22` | Seven current external source links on `/articles/lot-i-sodom/` use `target="_blank" rel="noopener"` without explicit `noreferrer`; G23 checks only `noopener` and therefore cannot protect the requested privacy contract. `noopener` is present, so reverse tabnabbing is not claimed. Evidence: [`2026-07-17-arena-pr317-322-synthesis`](../verification/2026-07-17-arena-pr317-322-synthesis/REPORT.md), AuditRepo PR #319. | `src/components/article-pilots/lot/LotSectionSources.astro` + canonical external-new-tab guard; preserve seven citations and add order-independent mutation coverage. |
| `D-23` | Current `/map/` composition emits two document `main` elements: interactive `atlas-main` and no-JS `atlas-noscript`. Source, production-like dist and live HTML agree. Evidence: [`2026-07-17-arena-pr317-322-synthesis`](../verification/2026-07-17-arena-pr317-322-synthesis/REPORT.md), AuditRepo PR #320. | `AtlasBody.astro` / `AtlasNoScriptFallback.astro`; retain graph and complete no-JS material list while establishing one final main owner. |
| `D-24` | Current `/biografii/` recent-material shelf exposes six H3 card titles directly after H1 because visible “Последние добавленные материалы” is a styled `div`, not the H2 section owner. Later era shelves already use H2→H3. Evidence: [`2026-07-17-arena-pr317-322-synthesis`](../verification/2026-07-17-arena-pr317-322-synthesis/REPORT.md), AuditRepo PR #321. | `BiografiiRecentSection.astro`; semantic-only H2/`aria-labelledby` repair with visual parity. |
| `D-25` | Shared `GillLearningSheet` article-search input has no persistent accessible name: its wrapping label contains only an `aria-hidden` SVG and the input relies on placeholder text. One shared source projects to 48 current dist routes and representative live Heart/Gill/Enoch surfaces. Evidence: [`2026-07-17-arena-pr317-322-synthesis`](../verification/2026-07-17-arena-pr317-322-synthesis/REPORT.md), AuditRepo PR #322. | `src/components/article-pilots/gill-series/GillLearningSheet.astro`; one shared repair, computed-name witness while typing, representative family smoke. |

## VERIFIED NECESSARY IMPROVEMENTS — 0

| ID | Needed implementation | Why |
|---|---|---|

## NARROWED RESIDUALS — 2

| ID | Current residual |
|---|---|
| `AR-IDX-JS-02` | Legacy runtime scripts (`js/enhancements.js`) still write to the legacy `theme` localStorage key, maintaining a multi-writer surface despite canonical owner in `reader-preferences.js`. |
| `D-2` | `css:layer:validate` script only validates `css/site.css`, bypassing layer validations for `css/home.css` and `css/floating-cluster.css`. |

## SYSTEM VERIFICATION LANES — 3

| ID | Verified work package | Next boundary |
|---|---|---|
| `SYS-RESEARCH-SOURCE-AUDIT-HARD-GATE` | Research scheduled `Total cross-repo source audit` run `31996510796` failed on Research `main` `8d6e5bc3f303d0a6a2d1a15969e042907f3387db` before any substantive source-audit step executed. Job `95289017759` failed closed during hash-locked dependency installation; compile, deterministic/refined audits, dead-source classification, baseline enforcement and evidence upload were skipped. This red hard gate existed before AuditRepo #309 emitted its present-tense terminal attestation, so that terminal witness is stale. Evidence: `verification/2026-08-17-terminal-attestation-stale-research-hard-gate/REPORT.md`. | Do **not** duplicate the active Research repair: branch `agent/source-audit-lock-recovery-20260817` already advanced to `9eb87807a33a8e7cebfa4589710063b29d155a9d` and is treated as another agent's owner. Close this lane only after an exact-head repair is integrated without weakening fail-closed controls, a then-current Research-main source-audit run is green **and actually executes the substantive audit/evidence steps**, and AuditRepo performs a fresh cross-repo reconciliation before reissuing any terminal `ZERO`. |
| `SYS-AUDIT-ROOT-OWNERSHIP` | Current `npm run schema:rich-results:audit` is ownership-blind: on Product `3b6bac3904331176023fb7517f131c8c9360bbc5` it still fails four Krajne image-dimension checks against reference-only root HTML, while current Astro-owned dist/live publication uses correct `1200×630`. This does not reopen the repaired historical Product defect. Evidence: [`2026-07-17-arena-pr317-322-synthesis`](../verification/2026-07-17-arena-pr317-322-synthesis/REPORT.md), AuditRepo PR #317. | Define current owner semantics, make root/reference audit ownership-aware or explicitly separate reference parity, and prove with adversarial reference-only fixtures; do not patch only the Krajne symptom. |
| `SYS-CSS-PRESENCE-ADMISSION` | Current `dist:css-parity` recognizes legacy named CSS/inline style but rejects valid resolvable Astro `/_astro/*.css`, false-reding strict-native `/app/`; exact release admission omits the stale gate. Evidence: [`2026-07-17-arena-pr317-322-synthesis`](../verification/2026-07-17-arena-pr317-322-synthesis/REPORT.md), AuditRepo PR #318. | First implement truthful asset-resolving CSS-owner detection with missing/empty/utility-only mutations; then make the corrected check an always-created deploy admission witness. Do not whitelist `/app/`. |


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
| `D-NEW-01` | Potential query reflection without sanitization in `index.astro` search script. | `src/pages/index.astro` |
