# Audit marathon R3 — environment, browser, architecture and control-plane verification

## Meta

- **Severity:** P1/P2 mixed forensic intake
- **Observed on source SHA:** `dab31616ca77b7833e9d12ad9c80d63a751ed19e`
- **AuditRepo base:** `0fa085ea252e824367530e94df0e23b255fae112`
- **Research authority observed:** `b654c5375a7b212ff9b42c08bb0193eeaad70746`
- **Date:** 2026-07-25

This report extends, but does not overwrite, `../2026-07-25-r2/REPORT.md`. R2 corrected premature claims and established the primary release/print findings. R3 verifies the browser execution boundary and records deeper architectural gaps discovered after source advanced through merged PR #293 and corrective PR #297 opened.

---

## 1. Verification environment — Playwright is available; DNS is the constraint

### Finding `ENV-PLAYWRIGHT-LOCAL-CAPABLE`

**Severity:** INFO / verified capability

The working container has:

- Node.js `22.16.0`;
- npm `10.9.2`;
- Playwright CLI `1.57.0` at `/opt/pyvenv/bin/playwright`;
- working Python Playwright API;
- Chromium at `/usr/bin/chromium` and a Playwright-managed Chromium binary.

Therefore the statement “Playwright cannot run in this environment” would be false. Local browser tests can run against local files or a local HTTP server.

### Boundary `ENV-CONTAINER-DNS-BLOCKED`

The container cannot resolve:

- `github.com`;
- `api.github.com`;
- `gospod-bog.ru`.

Direct `git clone`, GitHub archive download and live-site Playwright navigation therefore fail before browser execution. This is a network/DNS boundary, not a Playwright limitation.

Official supported alternatives verified during this pass:

1. repository archive through GitHub REST ZIP/TAR endpoints;
2. workflow dispatch through GitHub REST/UI/CLI when exposed;
3. exact-head Playwright in GitHub Actions;
4. download of Actions artifacts/logs for local forensic inspection.

The current connector exposes Actions runs/jobs/logs/artifacts and reruns, but not workflow dispatch or repository-archive materialization. Until that connector gap is closed, real-repository and live-site browser evidence must be produced in GitHub Actions and imported by exact SHA/run/artifact.

Official references:

- https://playwright.dev/docs/browsers
- https://docs.github.com/en/rest/repos/contents#download-a-repository-archive-tar
- https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow
- https://docs.github.com/en/actions/how-tos/manage-workflow-runs/download-workflow-artifacts

---

## 2. Exact-head print evidence — product regression remains real

### Finding `PRINT-REVERSIBLE-BACK-3D-FLOW`

**Severity:** P1

PR #286 exact head observed during R3:

`7f1d970f8f816a747402ae400d8e0df506a003be`

Exact runs:

- Shared Files Guard `30167239267` — failure;
- temporary materializer `30167239266` — failure;
- Print Paper Contract `30167239281` — failure.

The Print Paper job proves:

- dependency installation passed;
- Playwright Chromium installation passed;
- production-like build passed;
- canonical PDF generation passed;
- page/palette/pagination audit passed;
- atomic/keep-with-next route-family contract passed;
- **physical reversible-card back state failed**;
- raster audit was skipped after the focused physical failure.

This is neither a DNS artifact nor flaky browser startup. The focused physical assertion is the failed step.

### Finding `PRINT-PRIORITY-RATCHET-SATURATED`

**Severity:** P1

The attempted product correction required an additional decisive `transform: none !important`, but the semantic materializer reached the configured site.css ceiling `201 > 200`. The ratchet correctly blocked the change.

Required direction:

- do not increase the ceiling;
- do not hide the new declaration in another stylesheet;
- remove or consolidate an existing redundant print priority in the same ownership block;
- retain one decisive shared owner for `.flip-card`, `.heart-flip-card` and `.error-flip-card` internals;
- final PR must contain no `_temp-*` writer/materializer.

### Finding `PRINT-THREE-OWNER-CASCADE`

**Severity:** P1

Print behavior currently spans:

1. `js/reader-preferences-head.js` runtime-injected print CSS/pagination;
2. `css/site.css` print contract;
3. `css/floating-cluster.css` high-priority legacy bridge.

A physical state can therefore satisfy one owner and still lose to another cascade owner. The permanent repair must reduce ownership, not add a fourth bridge.

### Finding `PRINT-ENGINE-FIRST-PAINT-COUPLING`

**Severity:** P2

`reader-preferences-head.js` is declared as synchronous first-paint reader-preference bootstrap, but also contains the large `GBPrintPagination` engine. A PDF fix therefore changes a critical first-paint asset across the entire site and triggers mass cache-revision projection.

Target separation:

- first-paint bootstrap: theme/font/line-height/measure only;
- print pagination: independent shared module and print stylesheet loaded/prepared for print.

### Finding `PRINT-WORKFLOW-SOURCE-TRIGGER-GAP`

**Severity:** P1

The permanent Print Paper workflow is not triggered by all canonical inputs that can change pagination, including `src/content/**`, layouts/pages/lib/data/public inputs. Canonical MDX can change page breaks without starting the physical PDF contract.

The path decision should derive from the effective/public surface registry, not another hardcoded list.

---

## 3. Visual verification — parity is not a golden regression barrier

### Finding `VISUAL-COMMON-MODE-BLINDNESS`

**Severity:** P1

Current migration parity compares current legacy output with current dist. If the same functional element is removed from both projections, the pixel difference can remain zero.

Therefore current Visual Parity proves migration equivalence, not owner-approved product preservation.

Required split:

- migration parity: current legacy ↔ current dist;
- product golden: current product ↔ last owner-approved artifact.

Product goldens need stateful captures at minimum:

- top;
- 35–50% scroll;
- active ReaderState;
- open navigation/settings/search;
- dark/light/mobile;
- print separately.

### Finding `VISUAL-ROUTE-COVERAGE-NARROW`

**Severity:** P1

The heavy screenshot lane defaults to a small landing-route set. Most ordinary article routes and the Gill reversible-card state are not direct visual fixtures. A green Visual Parity result on a print/shared CSS PR is not proof that the changed article state was captured.

### Finding `HOME-BROWSER-CONTRACT-MISSING`

**Severity:** P1

The homepage source audit protects many correct markers—focus trap, BFCache, shortcut guards, no-JS navigation and landmark order—but it is fundamentally a source-string contract. A future implementation can preserve required strings while breaking execution order or event wiring.

A permanent Chromium/WebKit homepage interaction test should verify:

- mobile menu open/close/focus trap;
- resize mobile→desktop;
- BFCache restoration;
- exact Ctrl/Command+K handling and modifier rejection;
- lazy search initialization without double fire;
- Hebrew tap/translation behavior;
- scroll progress/back-to-top;
- no-JS route access.

---

## 4. Universal series architecture — registry permits private implementations

### Finding `SERIES-CORE-OPTIONAL-LOOPHOLE`

**Severity:** P1

A route may declare `surface: series` and `seriesShape: flat`, yet use route-specific PageHead/PageChrome/MainShell/Footer without `SeriesReaderChrome`. The public-surface registry derives a route-native adapter instead of failing.

The façade test only prohibits direct `GillSeriesChrome` imports and requires a historical minimum number of existing consumers. Adding a new private series does not reduce that count and is therefore accepted.

Required contract:

Every reading route with `surface: series` must either:

- consume the shared series reader core; or
- declare an explicit owner-approved exception with equivalent ReaderState, navigation, settings, TTS and print capabilities.

### Finding `BOOK-CONTRACT-HEART-CONFIG-COUPLING`

**Severity:** P1

The registry currently treats import of one concrete `hardTextsSeriesConfig.ts` as evidence of `seriesShape: book`. That file is specifically the “human heart” series configuration and imports `heartSeriesData`.

A new Genesis 6 book-shaped series should be validated through the `defineSeriesConfig` interface and `shape: book`, not through another series’ concrete config file.

The shared `defineSeriesConfig` implementation already validates chapters, articles, satellites, marks and parent relationships. Governance should consume that interface instead of inventing another engine.

---

## 5. Genesis 6 transport — integrity checks are not product review

### Finding `GENESIS6-OPAQUE-ISSUE-TRANSPORT`

**Severity:** P1

PR #296 exact head observed during R3:

`3a87074ad18a396e8a7a272f8c88ff3797aef02b`

Runs:

- Genesis 6 V3 transport verifier `30167237432` — success;
- Shared Files Guard `30167237392` — success.

This success proves the configured issue payload chunk/hash contract. It does not prove:

- the final archive reconstructs;
- the patch applies to current main;
- the five product routes are correct;
- the shared series engine is used;
- Research authority/provenance is pinned;
- temporary transport scaffolding is absent from the product commit.

PR #296 must close without merge. At most one fresh-main finalizer/activation PR should consume the fully verified payload and expose a normal reviewable Git diff.

---

## 6. Release control plane — corrective PR #297 is directionally correct, residuals remain

### Finding `DEPLOY-ACCEPTANCE-LEDGER-TTS-COUPLING`

**Severity:** P1 / source repair in progress

Merged PR #293 placed repository issue mutation inside the Pages job and described a TTS witness as production acceptance. Corrective PR #297 exact head observed:

`1ae9c9f53fe45d5f01f08923a4e2a6095b70d588`

Observed checks:

- Shared Files Guard `30167754562` — success;
- TTS Download Consent `30167754550` — still in progress at capture time.

#297 improves the architecture by:

- removing issue/pull-request permissions from deploy;
- separating a downstream `workflow_run` ledger;
- requiring a successful same-repository main deploy;
- downloading the exact run artifact;
- validating artifact ID, size and SHA-256 digest;
- validating exactly one PASS report and exact SHA/run/attempt;
- recording a generic envelope with `extensions.tts`;
- limiting the claim to “TTS capability witness”.

The row must remain open until exact-head TTS checks complete, the PR merges and a real post-merge deploy→ledger witness is produced.

### Residual `ACTIONS-MUTABLE-TAG-SUPPLY-CHAIN`

**Severity:** P1

The new writer workflow still uses mutable action tags such as `actions/checkout@v4`, `actions/download-artifact@v4` and `actions/github-script@v7` while holding `actions: read` and `issues: write`.

Writer/deploy workflows should pin external actions to full commit SHAs with version comments and let Dependabot update them.

### Finding `CONTROL-PLANE-NON-CONTENTS-WRITE-BLIND`

**Severity:** P1

The repository control-plane auditor principally detects `contents: write`. It does not model all mutation surfaces, including issue, pull-request, deployment, package or security-event permissions. This is why the #293 introduction of `issues: write` could coexist with a green control-plane audit.

Add a permission matrix by workflow/job and accepted purpose. Any write permission must have an explicit machine-checked owner and trigger boundary.

### Finding `CI-BUILD-MULTIPLE-TIMES`

**Severity:** P1 / existing #295

Readiness and deploy rebuild the same source repeatedly. Nested validation entrypoints can trigger multiple production-like builds inside each phase. The deployed bytes are not the exact readiness candidate bytes.

Target remains:

`build once → validate exact dist → digest/upload candidate → deploy same artifact → live witness`.

### Finding `DEPLOY-PROVENANCE-WHOLE-ARTIFACT-GAP`

**Severity:** P1 / existing #292

Current provenance verifies a TTS asset chain and run-addressed pointer, not the complete Pages artifact. It lacks a deterministic whole-dist digest/Merkle manifest covering routes, HTML, shared CSS/JS, Pagefind, sitemap/feed and images.

#297 correctly lists whole-artifact identity as a non-goal; it must not close #292/#295.

---

## 7. Dependency and network reproducibility

### Finding `FONT-PIPELINE-FAIL-OPEN`

**Severity:** P1

The font downloader:

- does not enforce HTTP success status/content type;
- does not validate `wOF2` magic or checksum;
- skips existing files without checksum;
- logs individual subset/download errors and continues;
- production workflows may continue after downloader failure.

A CDN error body can therefore be stored as `.woff2`, or readiness and deploy can build different font sets.

Required direction:

- committed/pinned font manifest with size + SHA-256 + magic;
- production build only verifies local files;
- network downloader is a separate manual generator and fails closed.

### Finding `SOURCE-LINK-REDIRECT-POLICY-BYPASS`

**Severity:** P2

The source-link audit checks forbidden hosts and plain-HTTP policy only for the original URL. Redirect destinations are followed without applying the same policy on every hop. `too many redirects` is classified as warning although the reader-facing link is unusable.

Each redirect hop must be revalidated and the chain retained in evidence.

### Finding `DEPENDABOT-CONFIG-UNSUPPORTED-KEY`

**Severity:** P2 / requires confirmation in repository UI

The Dependabot configuration contains `automerge: false`, which is not a documented `dependabot.yml` option. Validate the file through Dependabot status, remove unsupported keys and control auto-merge through rules/workflows.

---

## 8. AuditRepo evidence model

### Finding `AUDITREPO-WITNESS-MODEL-NONENFORCING`

**Severity:** P1

The matrix evidence-coverage mechanism largely treats occurrence of an issue ID in Markdown as a witness. It does not enforce:

- independent agents;
- distinct source/build/browser angles;
- exact claim-to-evidence matching;
- source SHA freshness;
- route/file scope;
- L0–L4 prerequisites.

Coverage is also warning-only in the current validation chain. A green AuditRepo validator therefore proves repository structure and selected invariants, not that every open row has multi-witness support.

Target structured witness record:

```yaml
id: PRINT-REVERSIBLE-BACK-3D-FLOW
sourceSha: 7f1d970f...
claim: flipped back inner remains transformed
witnesses:
  - kind: source
    agent: auditor-A
  - kind: browser-pdf
    run: 30167239281
independence: 2
status: confirmed-current
```

### Finding `MATRIX-P1-SEMANTIC-CONTRADICTION`

**Severity:** P1 governance

The matrix has both an empty `P0/P1 — OPEN (0)` section and a populated `P1 — OPEN (...)` section. The intended distinction appears to be release-blocking versus total severity backlog, but the schema does not name that distinction.

Use orthogonal fields:

- `severity`;
- `releaseBlocking`;
- `status`.

Then headings can state `release-blocking P0/P1` without contradicting the total P1 count.

---

## 9. Research → site provenance

### Finding `RESEARCH-SITE-PROVENANCE-UNPINNED`

**Severity:** P1 publication integrity

Genesis/Jude/Peter MDX content is substantively careful, but site frontmatter does not pin:

- exact Research commit;
- authority document IDs;
- applied overlay chain;
- claim-ledger digest;
- rights-decision ID.

Research publication requires manual composition of XLVIII base, XLIX corrections, L rights decisions and LI precision overlays. A later overlay cannot automatically mark site content stale.

Target frontmatter:

```yaml
research:
  repository: FedorMilovanov/Research
  commit: <40-char SHA>
  authorities: [GEN6-XLVIII, GEN6-XLIX, GEN6-L, GEN6-LI]
  claimLedgerDigest: sha256:...
  rightsDecision: GEN6-L-RIGHTS
```

This complements Research issue #16; it does not replace content/editorial review.

---

## 10. Required convergence order after R3

1. Keep AuditRepo production authority at `8a535267` until one exact current source SHA has imported readiness, Pages, provenance, live artifact and ledger evidence.
2. Finish #286 without temporary writer/materializer and without increasing the CSS priority ceiling.
3. Finish exact-head checks for #297; merge only after TTS + Shared gates are green, then require a real downstream witness.
4. Close #296 without merge and expose one normal Genesis finalizer/activation diff from fresh main.
5. Implement #295 build-once promotion and #292 whole-artifact deterministic provenance.
6. Implement #294 failure/recovery state machine.
7. Make workflow permissions and external action SHAs part of the control-plane contract.
8. Split migration parity from product golden regression; add permanent homepage browser interactions.
9. Require shared series capabilities through registry/interface, not concrete Gill/heart implementation files.
10. Upgrade AuditRepo witness records from Markdown occurrence to structured claim/evidence independence.
11. Pin Research authority/provenance in site frontmatter and publication tooling.

---

## Evidence boundary

No source product code was changed by this intake. The report uses:

- GitHub connector exact PR heads/files;
- exact Actions runs/jobs/steps;
- downloaded Actions artifacts from prior passes;
- official Playwright and GitHub documentation;
- direct local environment probes for Node/npm/Playwright/Chromium and DNS behavior.

A local full repository Playwright run was not claimed because the connector cannot currently materialize repository archives and the container DNS cannot reach GitHub/live production. Exact-head remote Playwright/PDF evidence is explicitly identified by run ID instead.