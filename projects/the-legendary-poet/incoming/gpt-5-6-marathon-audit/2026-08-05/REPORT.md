# Agent Work Report

## Meta

- Project: `the-legendary-poet`
- Source repo: `FedorMilovanov/TheLegendaryPoet`
- Agent: `gpt-5-6-marathon-audit`
- Date: `2026-08-05`
- Mode: `free-intake / multi-branch synthesis / implementation verification`
- Audited base: `85c4303dc683abc6e201ea707a0b4d6f5f19f82c`
- Integration branch: `agent/marathon-audit-integration-20260805`
- Integration PR: `#286`
- Current audited head: `33e539ea3d4fb33b37bb23a360f06c2137856a55`
- Production status at intake time: `not merged`

## 1. Branch reconciliation

### `arena/019fcf77-thelegendarypoet`

- Disposition: `selected as broad integration base, then repaired`.
- Useful scope:
  - reader-facing source honesty;
  - computed reading time and Russian typography;
  - search cleanup;
  - removal of the dead article engine;
  - hover/compositor corrections.
- Rejected regression:
  - full longform article data had entered the startup search path and enlarged the entry bundle to roughly `1,135 KiB`.
- Resolution:
  - generated lightweight article search index;
  - final measured entry bundle on the audited head: about `650.75 KiB`, below the enforced `700 KiB` limit.

### `arena/019fcf76-thelegendarypoet`

- Disposition: `selective port only`.
- Retained unique changes:
  - explicit evidence boundary for NYPL archival descriptions;
  - inline citation tooltips and bibliography anchors;
  - safe browser-storage access;
  - one live route registry;
  - deterministic brand-materialization fallback;
  - additional content/build validators.
- Not merged wholesale because it overlapped the broader branch and would have reintroduced conflicts and duplicate architecture.

### `work/local-images-playwright-wtoc`

- Disposition: `not merged`.
- Reason: old and deeply diverged history.
- Reused concept only: a stable non-transforming pointer hit surface around the transformed visual plane.

### Temporary trigger branches and PRs

- PRs used only to trigger or isolate checks were closed without merge.
- No temporary workflow, QA output or trigger-only code is part of the integration tree.

## 2. Confirmed findings and implemented repairs

### TLP-MARATHON-01 — Technical evidence language leaked into reader copy

- Original symptoms: `item-level`, `finding aid`, SHA/PDF framing and repository-style provenance language appeared in article-facing content.
- Repair:
  - reader copy rewritten in normal editorial language;
  - NYPL archival descriptions bounded as maps for further search, not as read primary evidence;
  - publication links no longer point to fabricated repository ledgers.
- Evidence angle: `source + content validators + browser rendering`.
- Status at audited head: `fixed-on-integration-head`.

### TLP-MARATHON-02 — Citation interaction and ordering were brittle

- Repair:
  - citation numbers are ordered and non-breaking;
  - hover/focus tooltip is immediate;
  - citations link to expandable bibliography cards;
  - focused article acceptance checks 64 unique targets and 64 expanded HTTPS source links.
- Status at audited head: `fixed-on-integration-head`.

### TLP-MARATHON-03 — Search imported the full essay corpus into startup code

- Repair:
  - generated `essaySearchIndex.generated.ts` contains lightweight searchable metadata;
  - generator and validator enforce freshness and shape;
  - longform article bodies remain route-split.
- Measured result: startup entry about `650.75 KiB`, enforced ceiling `700 KiB`.
- Status at audited head: `fixed-on-integration-head`.

### TLP-MARATHON-04 — Duplicate route architecture could drift

- Original symptom: shadow `routeModules.tsx` coexisted with the active route system.
- Repair:
  - duplicate registry removed;
  - one live lazy registry remains;
  - app-shell validator checks 14 lazy routes and route integrity.
- Status at audited head: `fixed-on-integration-head`.

### TLP-MARATHON-05 — Browser storage failures could break UI paths

- Repair: safe storage wrapper applied to theme, analytics consent, community identity, favorites/audio state and related browser-only access.
- Contract: blocked or unavailable storage degrades persistence, not rendering.
- Status at audited head: `fixed-on-integration-head`.

### TLP-MARATHON-06 — Tilt interaction accumulated transition work and risked paint instability

- Repair:
  - pointer handlers live on a stable outer hit surface;
  - only the inner visual plane transforms;
  - live pointer tracking has no CSS transition backlog;
  - settle transition applies after pointer exit;
  - nested `preserve-3d` removed;
  - Chromium checks that the article title remains painted during live 3D movement.
- Status at audited head: `fixed-on-integration-head`.

### TLP-MARATHON-07 — Dependency graph required a current supported router line

- Repair:
  - application imports migrated from `react-router-dom` to direct `react-router`;
  - `react-router 8.3.0`;
  - `react` and `react-dom 19.2.8`;
  - `vite 7.3.6`;
  - compatible build/type packages and explicit safe transitive overrides.
- Dedicated evidence:
  - run `30971293287`, job `92195972276`;
  - production and full lockfile audit: `0 vulnerabilities`;
  - validators, typecheck, build, prerender, route and browser checks passed.
- Status at audited head: `fixed-on-integration-head`.

## 3. QA findings that were not product regressions

### TLP-QA-01 — Yesenin Part I text locator assumed a specific DOM element

- The article accessibility snapshot contained the required paragraph in Chromium, Android Chrome and iPhone WebKit.
- The failed test first used global text matching, then assumed the accessibility paragraph was a literal `<p>`.
- Final contract scopes `toContainText` to the semantic `article` reader surface.
- This still proves the reader-visible evidence boundary without coupling to internal component tags.
- Status: `QA contract corrected; final workflow evidence pending at intake time`.

### TLP-QA-02 — Fine-pointer tests were scheduled in touch-only projects

- Android and iPhone profiles intentionally disable pointer tilt.
- Two tests specifically require fine pointer movement and therefore belong to the desktop Chromium project.
- Playwright project filters now express that capability boundary explicitly; touch behavior remains covered by mobile tests.
- Status: `QA capability matrix corrected; final workflow evidence pending at intake time`.

## 4. Verification evidence completed before the final PR matrix

### Full integration wave

- Run: `30969918518`
- Job: `92191816076`
- Result: repository gates, production build/prerender and focused article/hover Chromium checks passed.

### Security and Router 8 wave

- Run: `30971293287`
- Job: `92195972276`
- Result: dependency selection, full and production audits, validators, TypeScript, build/output, prerender/SEO, routes, articles, tilt and focused Chromium interactions passed.

## 5. Current-head gate rule

No finding in this raw intake is promoted to `fixed-current` or `closed-production` until all of the following are true:

1. standard PR workflows pass on exact head `33e539ea3d4fb33b37bb23a360f06c2137856a55`;
2. PR `#286` is squash-merged without head drift;
3. the resulting `main` merge SHA is recorded in `verification/`, `verified/` and `reverify/`;
4. AuditRepo validates and merges its own closure package.

## 6. Residual observations

- The isolated workflow command that temporarily installs Playwright `1.54.1` can print audit warnings for that temporary runner-only graph. This is not the committed project lockfile, whose dedicated production and full audits are zero. It remains workflow-harness debt, not evidence of a shipped application dependency.
- Literary-style validation may continue to report allowed source-facing terms such as `PDF`, `NYPL` or institutional-description language in bibliography/policy contexts; those warnings must not be confused with reader-copy leakage.
- Original Arena branches remain historical evidence. The integration PR, not a direct wholesale merge of each branch, is the controlled repair unit.

## 7. Notes for verifier

Use the exact source merge SHA and final standard workflow run IDs when promoting this package. Do not reuse the percentage stated in closed PR `#135`: that PR had no merged repository changes and is not current-head evidence. The governed source-library intake from merged PR `#104` remains a separate evidence line and is not replaced by this repair wave.
