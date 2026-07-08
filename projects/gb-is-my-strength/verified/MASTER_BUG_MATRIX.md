# MASTER BUG MATRIX — gb-is-my-strength

> **Canonical operational matrix.**  
> Source repository: `FedorMilovanov/gb-is-my-strength`  
> Source branch: `main`  
> **Current source HEAD checked: `ac26d8efa2b952df6dc46eef05908e6d65287e82` (2026-07-09).**  
> Research HEAD: `58e1ea5fab638812ae693a1d0b1e79c4dcb47131`.  
> Updated from AuditRepo base `18713174a343740cc0886df6c6441c51bde61274` by Gill-series V10 intake.  
> This matrix records current operational IDs. The previous 401-line matrix is retained immutably at AuditRepo commit `18713174a343740cc0886df6c6441c51bde61274` and indexed under `archive/stale/2026-07-09-pre-gill-v10/README.md`.

## Verification warning

- `ac26d8e` was source-inspected at the start and end of the Gill pass.
- No browser, production-like build or deploy run was executed in this intake.
- Source-structural findings below may be `confirmed-source-current`; browser-dependent UX claims remain `needs-browser-witness`.
- The 2026-07-06 `SUPER_AUDIT_2026-07-06_14a49be8.md` remains a valuable supporting backlog, but it is tied to an older source SHA. Reverify each item on current `main` before implementation.

## Canonical current inputs

1. `MASTER_BUG_MATRIX.md` — this operational index.
2. `START_HERE.md` — current owner/agent handoff.
3. `../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/REPORT.md` — official Gill V10 intake.
4. `../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/artifacts/GILL_SERIES_MASTER_CUMULATIVE_AUDIT_V10.md` — detailed Gill research handoff.
5. `SUPER_AUDIT_2026-07-06_14a49be8.md` — supporting historical systemic backlog; reverify-needed.

---

# 🔴 P0 — OPEN / STRUCTURAL MIGRATION BLOCKERS (6)

These are not claims that the website is wholly unavailable. They are blockers to publishing a coherent six-document Gill series without creating additional competing truth.

| ID | Description | Status / evidence |
|---|---|---|
| `GILL-V10-SOURCE-TRUTH` | Three content truths compete: MDX, production Astro bodies and root legacy HTML. Research/audits may verify text different from production; direct Part II factual divergence already exists. | `confirmed-source-current` @ `ac26d8e`; V10 intake §1 |
| `GILL-V10-SERIES-MANIFEST` | Gill series is hardcoded as five documents across series data, expected IDs/order/marks/routes and total `149`; current audit is a Part IV migration blocker. | `confirmed-source-current`; manifest lane required |
| `GILL-V10-HISTORICAL-TOC-CONTRACT` | Historical submenu item count is frozen while Part II is documented as 6→29 sections. Green regression audit certifies an intentionally incomplete current outline and false heading levels. | `confirmed-source-current`; reconciliation + audit source |
| `GILL-V10-ROMAN-NUMBER-COLLISION` | Standalone Part II begins at internal III/IV and Part III at V; publishing series Part IV creates two meanings for Roman IV. | `confirmed-source-current`; outline normalization required |
| `GILL-V10-PART3-NARRATIVE` | Part III is non-terminal and internally duplicated: death/burial and sources are followed by major new content; many real headings are absent from TOC. | `confirmed-source-current`; editorial restructure required |
| `GILL-V10-PART4-OWNERSHIP` | Parts II–III already own most proposed Part IV doctrine. Additive authoring would create a third copy; relocation/ownership must precede writing. | `confirmed-source-current`; owner editorial decision required |

---

# 🟠 P1 — OPEN (6)

| ID | Description | Status / evidence |
|---|---|---|
| `BUG-PERF-001` | addEventListener without corresponding cleanup: historical count 339 add / 25 remove across JS. | carry-over; reverify on `ac26d8e` before repair |
| `TTS-DL-CONSENT` | First Play can trigger background download of ~280 MB neural model without explicit consent. Save-Data/opt-out is only partial mitigation; owner UX decision required. | confirmed by V12 and Gill V10 source flow |
| `GILL-V10-RESEARCH-CANON` | Research dossiers 03/04/05/07 contain superseding Part IV/Introduction plans without canonical/supporting/superseded metadata; includes seven-versus-nine ambiguity. | `confirmed-source-current` @ Research `58e1ea5` |
| `GILL-V10-INTRO-OWNERSHIP` | Historical Introduction repeats personal Kettering biography while Parts I–II repeat Southwark/Salters’ Hall; dossier 07 mixes historical context with Part IV theology. | `confirmed-source-current`; editorial ownership required |
| `GILL-V10-READER-PROJECTIONS` | TOC, custom TTS, JSON-LD speakable, search and print infer different articles: summary contradiction, H4 loss, glossary H3 pollution, table loss. | source contradiction confirmed; browser/a11y witness pending |
| `GILL-V10-CLAIM-PROVENANCE` | Research converts Rippon’s “more than ten thousand” printing-sheet statement into a direct “more than ten million words” claim after correctly calling it an extrapolation. | `confirmed-source-current`; block claim until register fix |

---

# 🟡 P2 — OPEN (10)

| ID | Description | Status |
|---|---|---|
| `TTS-DL-UNZIP-SYNC` | `fflate.unzipSync` handles the full model archive on the main thread; potential one-time freeze. | verified previously; reverify current engine before fix |
| `TTS-DL-NO-TABLOCK` | No inter-tab lock; page-local warm-up state permits duplicate large downloads in multiple tabs. | verified previously; only fix with consent lifecycle |
| `AUDIT-P2-WORKFLOWS-CHECK-GAP` | Workflow checker does not validate deploy `if:` topology and relies on brittle string/regex checks. | carry-over / SUPER_AUDIT W1 |
| `AUDIT-P2-MATRIX-DRIFT` | Route migration, ownership and sitemap registries have no complete cross-validation. | carry-over; Gill manifest is scoped high-priority instance |
| `BUG-SEO-001` | IndexNow submit can occur before actual CDN availability. | carry-over; reverify current workflows |
| `NEW-CANONICAL-IZBRANNOE-01-GAP` | Canonical guard historically missed relative canonical on noindex routes. | tooling gap; reverify current guard |
| `D-1` | Deploy and IndexNow concurrency groups are separate; cancel-in-progress can discard push deploys. | carry-over; reverify current YAML |
| `D-2` | CSS layer validator promises order/coverage checks but historically checks a narrower contract. | carry-over; reverify current script |
| `D-19` | Some custom PageHeads maintain separate title/OG/Twitter/JSON-LD literals. | carry-over; reverify affected routes |
| `D-21` | Glossary has dual render semantics (`innerHTML` vs `textContent`), causing markup drift and an XSS-sensitive surface. | carry-over; coordinate with glossary owner |

---

# 🟢 P3 — OPEN (19)

| ID | Description |
|---|---|
| `GATE-MARKER-DATA-DRIFT` | Hardcoded values in gates drift from parallel content lanes; move shared markers/lists into data/manifest modules. |
| `VALIDATE-SCOPE-GAP` | `validate.js` historically covers only a subset of route families. |
| `NEW-CSS-BUDGET-01` | CSS budget warning exists outside a clear repair backlog. |
| `NEW-OG-SIZE-PARAM` | SEO audit uses hardcoded OG-size assumptions without route-specific schema. |
| `AUDIT-P3-OG-LCP-MISMATCH` | Some routes use different OG and LCP images. |
| `BUG-011` | Breakpoint proliferation and 768px collision. |
| `NEW-72` | SVG dedup micro-optimization. |
| `SHADOW-AUDIT-NARROW` | Legacy-shadow audit covers only a fraction of production-dist routes. |
| `AUDIT-PRO-SITEMAP-ROOT-ONLY` | Sitemap coverage audit can miss Astro-only dist pages. |
| `AUDIT-PRO-VM-DEPRECATED` | Audit helper uses `vm.Script` path considered fragile/deprecated for future Node changes. |
| `SEO-AUDIT-ROOT-ONLY` | SEO audit excludes dist and can miss Astro-only output. |
| `VALIDATE-JS-VM-DEPRECATED` | Duplicate `vm.Script` dependency in validate path. |
| `VALIDATE-JS-ARTICLES-ONLY` | Article validator does not cover all article-like route families. |
| `AUDIT-PRO-ROOT-ONLY` | Audit-pro reasons primarily over root HTML, not complete production dist. |
| `STRANGLER-HYGIENE` | Most Astro routes still have root legacy shadows; by-design today, long-term debt. |
| `D-3` | Historical JS budget exceeded configured audit budget. |
| `D-4` | Magic z-index values remain; coordinate with PremiumControls. |
| `D-7` | Benign repo-relative documentation pointer in source comment; cosmetic only. |
| `D-8` | Markdown-only changes do not trigger deploy; by-design while Markdown is not public input. |

---

# 🔵 REFACTORING (4)

| ID | Description |
|---|---|
| `R-001` | `site.js` monolith. |
| `R-002` | `enhancements.js` monolith. |
| `R-003` | No source maps. |
| `R-004` | Limited module/tree-shaking architecture. |

# 🟣 AUDITREPO (3)

| ID | Description |
|---|---|
| `AR-001` | Harden `validate_audit_repo.py` (including the current REPORT-content indentation bug). |
| `AR-004` | Automate verification protocol/status movement. |
| `AR-005` | Automate current-HEAD reverify and canonical-header refresh. |

---

# ✅ CLOSED / HISTORICAL

- Previous canonical matrix recorded **90 closed/fixed items** through 2026-07-08.
- The full closed table and historical evidence log remain at immutable AuditRepo commit `18713174a343740cc0886df6c6441c51bde61274`, path `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md`.
- Do not copy closed rows back into the active matrix unless a current-head reverify reopens one.
- Known recent closures include `TTS-OUTCOME-TELEMETRY` (`a459ff3`) and already-fixed `D-22` (`365de50`).

---

# Statistics

| Category | Count |
|---|---:|
| Closed/fixed historical | 90 |
| P0 open | 6 |
| P1 open | 6 |
| P2 open | 10 |
| P3 open | 19 |
| Refactoring | 4 |
| AuditRepo | 3 |
| **Total active matrix items** | **48** |

Counting policy:

- Gill V10 uses consolidated root-cause IDs; detailed sub-IDs remain in the intake artifact.
- `TTS-DL-CONSENT` is not duplicated as a separate Gill row.
- Generic drift rows remain because they cover the whole site; scoped Gill P0 rows describe a concrete publication blocker.

---

# Current repair order

1. Reverify old systemic W1/W2 claims against `ac26d8e`; do not implement directly from `14a49be8` wording.
2. Resolve `TTS-DL-CONSENT` with the owner; do not mix with Gill content.
3. Gill Lane A: canonical content source + manifest.
4. Gill Lane B: outline/Reader AST + Roman normalization.
5. Gill Lane C: content ownership, Part III cleanup and relocation.
6. Gill Lane D: Research statuses/claim register and Part IV authoring.
7. Gill Lane E: atomic six-document publication.

Full Gill lane acceptance criteria are in the official intake proposal.