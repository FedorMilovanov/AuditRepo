# MASTER BUG MATRIX — gb-is-my-strength

> Canonical status ledger for the existing project backlog.  
> Current project source HEAD: `d579745c23d9a0e6dea3a8148a3369d46c47b94b`.  
> Matrix counts last reconciled: 2026-07-08.  
> The Gill V10 intake did **not** mass-reverify these 38 open rows; reverify a selected row before repair, closure or severity change.  
> Gill V10 candidates are tracked in `../working/START_HERE_2026-07-09.md` and are not included here.

## Closed — 90 IDs

Do not reopen a closed ID without current-head evidence and the retirement/reverify protocol.

```text
TTS-OUTCOME-TELEMETRY
D-22
P0-CRASH-001
P0-CRASH-002
P0-FC-REC
P1-NAGORNAYA
P1-CI-DUPE
P1-SITE-XSS
P1-LAYERED-CSS
P1-DEPLOY-FAIL
P2-NAGORNAYA-SITEUTILS
P2-SEARCH-EAGER
BUG-001
BUG-041
BUG-CI-001
PC-CURRENT-06
UI-GILL-DESKTOP-RAIL-01
UI-GILL-DESKTOP-TOC-02
NEW-45
NEW-46
NEW-48
NEW-59
NEW-64
NEW-65
NEW-66
NEW-68
NEW-69
NEW-70
NEW-71
NEW-README-ANCHOR-01
NEW-CANONICAL-IZBRANNOE-01
NEW-IMG-REGRESSION-01
SEC-001-VERIFIER
NEW-SAFEURL-XSS-HARDENING
NEW-CACHE-BUST-ASTRO
NEW-GITCONFIG-COMMITTED
BUG-CI-002
AUDIT-P1-CI-GATE-GAP
BUG-CI-003
NEW-ACTIONLINT-CI-GAP
NEW-OG-DIMENSIONS-HARDCODED
BUG-CLEANUP-001
BUG-SEO-002
NEW-STALE-BRANCHES
CONTENT-PARITY-LOSS-01
AUDIT-P1-FC-IMP
AUDIT-PRO-FC-IMPORTANT-GAP
BUG-SW-BASELINE-DRIFT
IMAGE-CROSSREF-GAP
DATA-SERIES-DRIFT
UI-GILL-SUBMENU-LABEL-SEMANTICS-09
NOINDEX-PHANTOM
AUDIT-PRO-REQUIRE-CRASH
DEAD-SCRIPTS-6
CACHE-BUST-STALE-MAIN
SEARCH-SCRIPTURE-BROKEN
GATE-GAP-NATIVE-TEXT-PARITY
SEARCH-MANIFEST-QUALITY
CONTENT-LOSS-AVRAAM-SOURCES
CSS-PARSE-CORRUPTION-SITECSS
GILL-SUBMENU-STEPPED-FILL
GLOSSARY-CARD-LILAC-LIGHT
HEADING-ANCHOR-FOCUS-FRAME
GILL-SUBMENU-COLLAPSIBLE-SUBGROUPS
GILL-RAIL-FLOW-CARD-RESTORE
GILL-SUBMENU-SUBDOT-CLIPPED
GILL-RAIL-FILL-LURCH
GILL-RAIL-LINE-GOLD-NOT-BEIGE
ARTICLE-END-ACTIONS-SKIPPED
GILL-SAVE-NO-FILL
RESUME-TOAST-STALE-NAG
GBS2-HERO-BOTTOM-STRIP
GILL-KINETIC-OVERLAP
TTS-PILL-CLIPPED-RING-DEAD
HOME-SEARCH-ICON-LAZY-MISSING
AUDIT-FILL-MONOTONIC-LAYOUT-AWARE
UI-GILL-SCROLLSPY-DEAD-06
UI-GILL-SUBMENU-ORDER-07
UI-GILL-DOT-TRACK-OFFSET-08
DEPLOY-YML-DEAD-WARN-STEP
AUDIT-P2-SW-PRECACHE-4
BUG-ARCH-001
AUDIT-P3-SEARCH-LAZY-CONFIRMED
BUG-SW-001
AUDIT-P3-STYLE-DUP
AUDIT-P3-QUOTE-NO-CONFIRM
NEW-PREFETCH-UNCONDITIONAL
BUG-CLEANUP-002
BUG-CLEANUP-003
BUG-CLEANUP-004
```

Detailed closure descriptions and commit references remain available in the immutable pre-cleanup snapshot:

```text
AuditRepo@18713174a343740cc0886df6c6441c51bde61274
projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md
```

## P1 open — 2

| ID | Description | Evidence/status |
|---|---|---|
| `BUG-PERF-001` | Historical listener imbalance: 339 `addEventListener` versus 25 removals across JS, concentrated in five files. | Existing two-witness row; current source must be recounted before repair. |
| `TTS-DL-CONSENT` | First Listen can trigger a roughly 280 MB neural-model lifecycle without explicit informed consent. Save-Data/opt-out is partial mitigation. | Owner UX decision required; Gill intake adds source support but does not make it repair-ready. |

## P2 open — 10

| ID | Description | Evidence/status |
|---|---|---|
| `TTS-DL-UNZIP-SYNC` | Full model archive is synchronously unzipped on the main thread, risking a one-time freeze. | Existing V12 source witness; reverify current engine before repair. |
| `TTS-DL-NO-TABLOCK` | No inter-tab lock prevents two tabs from downloading/initializing the model concurrently. | Existing V12 source witness; coordinate with consent lifecycle. |
| `AUDIT-P2-WORKFLOWS-CHECK-GAP` | Workflow checker does not validate deploy `if:` topology and relies on brittle string/regex checks. | Existing audit row; reverify current workflows. |
| `AUDIT-P2-MATRIX-DRIFT` | Route-migration, ownership and sitemap registries lack complete cross-validation. | Existing audit row; Gill manifest is only a pending scoped candidate. |
| `BUG-SEO-001` | IndexNow submission can occur before actual CDN availability. | Existing row; reverify release workflow. |
| `NEW-CANONICAL-IZBRANNOE-01-GAP` | Canonical guard historically missed relative canonical values on noindex routes. | Tooling-gap row; reverify current guard. |
| `D-1` | Deploy and IndexNow use separate concurrency groups; cancellation can discard push deploys. | Existing workflow row; reverify current YAML. |
| `D-2` | CSS layer validator promises broader order/coverage checks than it performs. | Existing row; reverify current script and thresholds. |
| `D-19` | Some custom PageHeads maintain independent title/OG/Twitter/JSON-LD literals. | Existing row; reverify affected routes. |
| `D-21` | Glossary render paths use inconsistent HTML/text semantics, producing markup drift and an XSS-sensitive surface. | Existing row; coordinate with glossary owner and reverify source. |

## P3 open — 19

| ID | Description |
|---|---|
| `GATE-MARKER-DATA-DRIFT` | Hardcoded strings and values in gates drift from parallel content lanes; shared markers/lists should live in data or common modules. |
| `VALIDATE-SCOPE-GAP` | `validate.js` historically covers only a subset of route families. |
| `NEW-CSS-BUDGET-01` | CSS budget warning exists without a clear repair backlog. |
| `NEW-OG-SIZE-PARAM` | SEO audit uses hardcoded OG-size assumptions without route-specific configuration. |
| `AUDIT-P3-OG-LCP-MISMATCH` | Some routes use different OG and LCP images. |
| `BUG-011` | Breakpoint proliferation and a 768px collision remain technical debt. |
| `NEW-72` | SVG deduplication is a small optimization opportunity. |
| `SHADOW-AUDIT-NARROW` | Legacy-shadow audit covers only a fraction of production-dist routes. |
| `AUDIT-PRO-SITEMAP-ROOT-ONLY` | Sitemap coverage audit can miss Astro-only dist pages. |
| `AUDIT-PRO-VM-DEPRECATED` | Audit helper uses a fragile/deprecated `vm.Script` path. |
| `SEO-AUDIT-ROOT-ONLY` | SEO audit excludes dist and can miss Astro-only output. |
| `VALIDATE-JS-VM-DEPRECATED` | Validation path duplicates the `vm.Script` dependency. |
| `VALIDATE-JS-ARTICLES-ONLY` | Article validator does not cover all article-like route families. |
| `AUDIT-PRO-ROOT-ONLY` | `audit-pro` reasons primarily over root HTML rather than complete production dist. |
| `STRANGLER-HYGIENE` | Most Astro routes still retain root legacy shadows; currently by design, but long-term debt. |
| `D-3` | Historical JS total exceeded the configured audit budget. |
| `D-4` | Magic z-index values remain; coordinate with PremiumControls before repair. |
| `D-7` | Benign repo-relative documentation pointer; cosmetic cleanup only. |
| `D-8` | Markdown-only changes do not trigger deploy; by design while Markdown is not a public input. |

## Refactoring — 4

| ID | Description |
|---|---|
| `R-001` | `site.js` monolith. |
| `R-002` | `enhancements.js` monolith. |
| `R-003` | No source maps. |
| `R-004` | Limited module/tree-shaking architecture. |

## AuditRepo — 3

| ID | Description |
|---|---|
| `AR-001` | Harden `validate_audit_repo.py`. |
| `AR-004` | Automate verification protocol/status movement. |
| `AR-005` | Automate current-head reverify and canonical-header refresh. |

## Duplicate and false-positive guardrails

- `BUG-ARCH-001` and `AUDIT-P2-SW-PRECACHE-4` were retained as historical closed IDs for compatibility.
- `AUDIT-P2-NODE-REGEX` and `AUDIT-P3-REACT-UNDOCUMENTED` are rejected false positives.
- `BUG-ASTRO-CONFIG-001` is informational, not an open bug.
- `BUG-SITEMAP-8-KARTY-MISSING` and `BUG-FRONTMATTER-INCONSISTENCY-01` were rejected as intentional/valid behavior.

## Statistics

| Category | Count |
|---|---:|
| Closed/fixed IDs | 90 |
| P1 open | 2 |
| P2 open | 10 |
| P3 open | 19 |
| Refactoring | 4 |
| AuditRepo | 3 |
| **Total open in this matrix** | **38** |

Historical cycle diaries, Research summaries and superseded positive claims were removed from this active matrix. Their evidence remains in Git history and the corresponding `incoming/` and `archive/` folders.