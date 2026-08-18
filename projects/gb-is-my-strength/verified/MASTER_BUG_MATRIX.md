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
| Direct current defects | **3** |
| Verified necessary improvements | **0** |
| Narrowed residuals | **5** |
| System verification lanes | **2** |
| Owner decisions | **2** |
| Closed/stale/duplicate/absorbed rows in MASTER | **0** |

## CURRENT DEFECTS — 3

| ID | Current problem | Boundary |
|---|---|---|
| `D-19` | Brand title suffix is truncated to `| Господь Бог` instead of `| Господь Бог — Сила Моя`. verified-live + verified-source at Product `485db8c25287fa9bd2f53a5356885f02e4b81f4b`: 5 of 76 indexable routes (`/articles/20-antisovetov-pastoru/`, `/articles/kod-da-vinchi/`, `/articles/diotrefy-nashego-vremeni/`, `/nagornaya/`, `/pastor-series/`) against 50 routes carrying the canonical suffix. **This is a reintroduced regression, not a fresh typo:** Product `79e59b64` repaired the suffix and Product `23352ca2` reverted it five hours later with the commit message and `Writer-Lease:` trailer emitted by the `headline-autofix` job. Root owner is `SYS-BRAND-TITLE-AUTHORITY`; a page-only edit will be rewritten again. Lineage: `incoming/bugverifikator/2026-07-17/REPORT.md`; pass-2 mechanism in AuditRepo PR #328. | Page owners `AntisovetovPageHead.astro`, `KodDaVinchiPageHead.astro`, `DiotrophesPageHead.astro`, `NagornayaIndexPageHead.astro`, `PastorSeriesPageHead.astro`. Product branch `agent/antisovetov-title-suffix-20260818` already owns the Antisovetov page edit — reference it instead of starting a parallel lane; close only together with `SYS-BRAND-TITLE-AUTHORITY`. |
| `SEARCH-MANIFEST-TITLE-SUFFIX` | `data/search-manifest.json` keeps the site name inside item titles: verified-source + verified-live at Product `485db8c25287fa9bd2f53a5356885f02e4b81f4b`, 14 of 76 records carry the brand while 62 do not. `js/search.js` renders `item.title` in search results and `scripts/rss-feed-normalizer.js` re-emits it, so live `feed.xml` ships 7 of 58 item titles with a brand suffix (6 full, 1 truncated) while `feed-pastor-series.xml` publishes the same Diotrephes article with a clean title — two published feeds contradict each other about one article. Evidence: AuditRepo PR #328. | `data/search-manifest.json` plus the manifest normalizer (`scripts/search-manifest-policy-normalizer.js`); channel-level branding already exists in `<channel><title>`, so item titles must carry the article title only. Close with a rebuilt manifest, a regenerated `feed.xml` and a normalizer guard. |
| `GENESIS6-TITLE-BRAND` | `/hard-texts/genesis-6/` publishes `Бытие 6, Енох, Иуда и Пётр — исследовательская серия` with no brand token while all seven sibling `/hard-texts/*` routes carry `| Господь Бог — Сила Моя`. The page is `robots: index, follow`, so this is not an intentional holding-page exclusion. verified-live at Product `485db8c25287fa9bd2f53a5356885f02e4b81f4b`. Evidence: AuditRepo PR #328. | MDX frontmatter title for that entry plus the `Genesis6ArticlePage.astro` head owner; smallest possible edit, no route or slug change. |

## VERIFIED NECESSARY IMPROVEMENTS — 0

| ID | Needed implementation | Why |
|---|---|---|

## NARROWED RESIDUALS — 5

| ID | Current residual |
|---|---|
| `HTML-BTN-TYPE` | JS-driven interactive buttons (`themeToggle`, `hMobileMenuBtn`) in `HardTextsPageChrome` are missing `type="button"`. Verified current in `HardTextsPageChrome` (all buttons), `AboutPageChrome` (#themeToggle) and `NagornayaChast1PageChrome` (#menuBtn). |
| `AR-IDX-JS-02` | Legacy runtime scripts (`js/enhancements.js`) still write to the legacy `theme` localStorage key, maintaining a multi-writer surface despite canonical owner in `reader-preferences.js`. |
| `D-2` | `css:layer:validate` script only validates `css/site.css`, bypassing layer validations for `css/home.css` and `css/floating-cluster.css`. |
| `A11Y-OG-META-MALFORMED` | **Narrowed after live re-measurement — the previous wording was wrong.** verified-live at Product `485db8c25287fa9bd2f53a5356885f02e4b81f4b`: `og:title` on `/articles/20-antisovetov-pastoru/` and `/articles/kod-da-vinchi/` carries **no** brand token at all, so those two named examples do not share the `D-19` suffix. Only 2 of 76 routes really publish a truncated brand inside `og:title` — `/articles/diotrefy-nashego-vremeni/` and `/pastor-series/` — and the other 12 brand-bearing `og:title` values use the canonical full form. Residual scope is those two routes, both already inside the `D-19` page set. Evidence: AuditRepo PR #328. |
| `A11Y-SEARCH-MODAL-MISSING` | **Re-scoped: the injection is no longer "unproven".** verified-source at Product `485db8c25287fa9bd2f53a5356885f02e4b81f4b`: `js/search.js` builds the palette itself — `document.createElement("div")` with `className="cp-backdrop"`, `role="dialog"`, `aria-modal="true"`, `aria-label="Поиск по сайту"` — and every `.cp-backdrop` occurrence in served homepage HTML sits inside guard scripts rather than static DOM, so lazy injection is the designed contract, not a missing container. What stays genuinely unproven is runtime behaviour: no browser witness exists for focus trap, restore-focus on close, or the injected dialog's computed accessible name. Evidence: AuditRepo PR #328. |

## SYSTEM VERIFICATION LANES — 2

| ID | Verified work package | Next boundary |
|---|---|---|
| `SYS-BRAND-TITLE-AUTHORITY` | Four authorities disagree about the brand suffix and the machine one wins. `scripts/article-headline-contract.js:16` hard-codes `titleSuffix: ' | Господь Бог'`; the `headline-autofix` job in `.github/workflows/indexnow.yml` runs it with `--write`, commits `fix(metadata): normalize canonical article headline` and force-pushes — which is exactly how Product `23352ca2` reverted the `D-19` repair made by Product `79e59b64`. Meanwhile `data/editorial-metadata.json` and `data/public-content-baseline.json` both record the full suffix for the affected routes, and 47 of 52 brand-bearing titles in `src/` use it. verified-source + verified-lifecycle at Product `485db8c25287fa9bd2f53a5356885f02e4b81f4b`. This lane explains `D-19`, `A11Y-OG-META-MALFORMED` and `SEARCH-MANIFEST-TITLE-SUFFIX`; a local page patch leaves the same class of risk, and the defect has already returned once. Evidence: AuditRepo PR #328. | One writing owner for the brand token. Minimum: correct `titleSuffix` in `scripts/article-headline-contract.js` (one line, disjoint from the Product branch that owns the page edit), then verify that `--write` repairs drift in the canonical direction. Do not close while any page in the `D-19` set still ships the truncated form. |
| `SYS-PUBLICATION-GATE-TITLE-BLIND` | The publication contract cannot see production titles. `npm run contract:compare` (inside `validate:static-publication`, `deploy.yml`) extracts from the **repo root**, but `migration/page-ownership.json` marks 85 of 86 routes `owner: astro, status: production-dist` and `scripts/copy-legacy-to-dist.js` → `shouldSkipLegacyFile()` skips exactly those legacy files, so the gate measures HTML that is never published: 5 of 43 baseline pages already differ between the legacy root file and the live bytes. The dist-scoped `contract:compare:dist` does read the shipped tree, but runs without `--strict-title`, and `scripts/compare-url-contract.js` downgrades `title changed` to a warning in that mode. Separately, `scripts/editorial-metadata-registry.js --check` validates only the registry's own shape and never compares a record with its declared `metadataSource`. verified-source at Product `485db8c25287fa9bd2f53a5356885f02e4b81f4b`. This is why the `D-19` class shipped and survived. Evidence: AuditRepo PR #328. | Point the publication comparison at `dist` and pass `--strict-title` there, or document explicitly why title drift may ship as a warning; and make the registry check compare each recorded `title` against its `metadataSource`. Harness-only lane: no content or route change. |

## OWNER DECISIONS — 2

| ID | Missing decision |
|---|---|
| `SYS-MAIN-ADMISSION-ENFORCEMENT` | Product, AuditRepo **and Research** `main` remain unprotected and required status-check enforcement is off. Research is authority-bearing input to Product admission/freshness, so omitting it from this decision would leave an uncontrolled authority path. Choose required always-created PR checks with a documented emergency bypass, or explicitly accept/document post-push red risk. This is a governance owner choice, not a current Product defect or a current release blocker, and this row does not authorize settings mutation or a workflow workaround pretending to be branch protection. Evidence: `verification/2026-08-13-max-agent-control-plane-retrospective/REPORT.md` plus `verification/2026-08-17-terminal-attestation-stale-research-hard-gate/REPORT.md`. |

| `EDITORIAL-REGISTRY-FREEZE` | All 43 records in `data/editorial-metadata.json` sit at `reviewStatus: "inconsistent-needs-review"` (`provenance: production-like-dist-migration-freeze`), while `projectDist()` in `scripts/lib/editorial-metadata-v3.js` projects only `approved` records — so the v3 editorial-metadata projection, its workflow and its guard currently move **zero** records into `dist`. verified-source + verified-live at Product `485db8c25287fa9bd2f53a5356885f02e4b81f4b`: 10 routes already publish a `dateModified` that disagrees with the registry (registry `2026-06-12` vs live `2026-07-09` on nine routes; `2026-07-11` vs `2026-07-30` on `/articles/tma-na-serdce/`). Either the freeze is deliberate — and then the registry must stop being cited as a converging authority — or the records need owner review so projection can resume. An agent cannot pick this. Evidence: AuditRepo PR #328. |

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
