# Agent Work Report

## Meta

- Project: `the-legendary-poet`
- Source repo: `FedorMilovanov/TheLegendaryPoet`
- Agent: `gpt-5-6-marathon-audit`
- Date: `2026-08-05`
- Audited base: `85c4303dc683abc6e201ea707a0b4d6f5f19f82c`
- Integration branch: `agent/marathon-audit-integration-20260805`
- Integration PR: `#286`
- Final audited head: `25cfa99e7b20af4d1c78b3ed1c7fd219878f8a81`
- Production squash merge: `e06d75970cf1262f4dab5bfd941e45328f07f747`
- Production status: `merged into main`

## 1. Branch reconciliation

### `arena/019fcf77-thelegendarypoet`

Disposition: broad integration base, then repaired. Retained source-honesty, reading-time, typography, search, dead-engine removal and compositor work. Its startup-bundle regression was rejected: the full longform corpus had entered the command-palette path and pushed the entry chunk to roughly `1,135 KiB`. A generated lightweight search index reduced the verified entry to about `650.92 KiB`, below the enforced `700 KiB` ceiling.

### `arena/019fcf76-thelegendarypoet`

Disposition: selective port only. Retained the NYPL evidence boundary, inline citation tooltips and bibliography anchors, safe browser storage, one live route registry, deterministic brand materialization fallback and additional validators. It was not merged wholesale because it overlapped the broader branch and would have reintroduced conflicts and duplicate architecture.

### `work/local-images-playwright-wtoc`

Disposition: not merged. Its history was old and deeply diverged. Only the independently verified design principle of a stable non-transforming pointer hit surface around the transformed visual plane was reused.

### Temporary trigger branches and PRs

Temporary PRs used to isolate or trigger checks were closed without merge. One-off workflow files, QA output and trigger-only code are absent from production.

## 2. Verified repair set

### TLP-MARATHON-01 — Reader copy exposed technical evidence language

Reader-facing content was cleared of `item-level`, `finding aid`, SHA/PDF framing and repository-style provenance leakage. NYPL archival descriptions now act as maps for further search, not as claims that underlying primary documents were read. Publication cards no longer use fabricated repository-ledger links.

Status: `closed-production`.

### TLP-MARATHON-02 — Citation interaction and ordering were brittle

Citation markers are ordered, non-breaking, keyboard-focusable and backed by immediate tooltips and bibliography anchors. The focused article acceptance expands and checks 64 unique citation targets and 64 HTTPS source links.

Status: `closed-production`.

### TLP-MARATHON-03 — Search imported full essays into startup code

The command palette now consumes generated lightweight article metadata. Longform bodies remain route-split; generator and validator enforce search-index freshness and shape.

Status: `closed-production`.

### TLP-MARATHON-04 — Duplicate route architecture could drift

The shadow `routeModules.tsx` registry was removed. One live lazy registry remains, and app-shell/route validators check the 14-route contract.

Status: `closed-production`.

### TLP-MARATHON-05 — Browser storage failures could break UI paths

Theme, analytics consent, community identity, favorites/audio state and related browser-only persistence use a safe storage wrapper. Blocked storage degrades persistence rather than rendering.

Status: `closed-production`.

### TLP-MARATHON-06 — Tilt interaction accumulated transition work and risked paint instability

Pointer handlers now live on a stable outer hit surface; only the inner plane transforms. Live tracking has no CSS transition backlog, settle transition applies after exit, and nested `preserve-3d` was removed. Chromium checks that the article title remains painted during movement.

Status: `closed-production`.

### TLP-MARATHON-07 — Dependency graph required a supported router line

Application imports moved from `react-router-dom` to direct `react-router`. Production contains `react`/`react-dom 19.2.8`, `react-router 8.3.0`, `vite 7.3.6` and explicit safe transitive overrides. Dedicated production and full lockfile audits reported zero vulnerabilities.

Status: `closed-production`.

## 3. QA defects separated from product defects

### TLP-QA-01 — Yesenin Part I assertion was coupled to locator internals

The article contained the required reader-visible statements in Chromium, Android Chrome and iPhone WebKit. The test first assumed global text uniqueness, then a literal `<p>`, then Playwright locator text normalization. The final contract reads the semantic article `innerText`, normalizes only Unicode whitespace and requires both complete statements. This preserves the content gate without coupling it to component tags.

Status: `closed-production`; final run `30989767467` succeeded.

### TLP-QA-02 — Fine-pointer assertions ran in touch projects

Android and iPhone intentionally disable pointer tilt. Two fine-pointer-only assertions now run only in desktop Chromium; touch behavior remains covered by mobile tests.

Status: `closed-production`; final Manual Browser QA run `30989767291` succeeded.

## 4. Evidence

### Dedicated integration wave

- Run `30969918518`, job `92191816076` — repository gates, production build/prerender and focused article/hover Chromium passed.

### Security and Router 8 wave

- Run `30971293287`, job `92195972276` — dependency selection, production/full audit, validators, TypeScript, build/output, prerender/SEO, routes, articles, tilt and focused Chromium interactions passed.

### Final exact-head PR matrix

Exact tested head: `25cfa99e7b20af4d1c78b3ed1c7fd219878f8a81`.

- `30989767599` — CI — success
- `30989767362` — Site route integrity audit — success
- `30989767318` — Articles catalog acceptance — success
- `30989767467` — Yesenin Part I browser acceptance — success
- `30989768212` — Yesenin Part I safe publication — success
- `30989767486` — Yesenin Part II safe publication — success
- `30989767485` — Yesenin Duncan safe publication — success
- `30989767985` — Brand raster QA — success
- `30989767787` — Brand deep reference and motion audit — success
- `30989767291` — Manual Browser QA — success; all four jobs succeeded
- `30989767003` — Request Pages deployment — skipped as expected for the PR event

### Merge evidence

- PR `FedorMilovanov/TheLegendaryPoet#286`
- Merge method: squash
- Merge guard: expected head `25cfa99e7b20af4d1c78b3ed1c7fd219878f8a81`
- Production `main` SHA: `e06d75970cf1262f4dab5bfd941e45328f07f747`
- Main was re-read after merge: production `package.json` and the corrected Yesenin browser contract are present.

## 5. Residual observations

- The Manual Browser workflow temporarily installs Playwright `1.54.1` with `--no-save --no-package-lock`; warnings from that runner-only graph are not the committed lockfile. The committed production and full audits are zero. This remains workflow-harness debt, not shipped dependency debt.
- Literary-style validation may still report allowed bibliography/policy terms such as `PDF`, `NYPL` or institutional-description language. Those warnings are not reader-copy leakage.
- Original Arena branches remain historical evidence. Production truth is the squash merge above, not a wholesale merge of every historical branch.
- Closed AuditRepo PR `#135` had no merged file changes; its percentage is not current-head evidence. The governed source-library intake from merged PR `#104` remains a separate evidence line.
