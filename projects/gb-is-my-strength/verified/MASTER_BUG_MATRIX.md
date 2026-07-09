# MASTER BUG MATRIX — gb-is-my-strength

> **Canonical operational ledger.**  
> Source repository: `FedorMilovanov/gb-is-my-strength`  
> Current source HEAD: `ff55161b6858a1bbb0fad5704a11c6b41c961879` (2026-07-09)  
> Gill functional tree audited: `30d9fb61fe2c9116ee53a54d681c01455eef4fe6`  
> Net compare `30d9fb61..ff55161b`: no changed files  
> Research HEAD: `58e1ea5fab638812ae693a1d0b1e79c4dcb47131`  
> AuditRepo base before this branch: `18713174a343740cc0886df6c6441c51bde61274`

## Layer status

- The 38 P1/P2/P3/refactoring/AuditRepo rows below are the canonical **carry-over ledger from the AuditRepo base**. This Gill intake did not mass-reverify every carry-over row on source `ff55161b`; each still needs its own current-head check before repair or closure.
- The new Gill V10 intake currently has one source witness only. Its 11 rows are listed in **Pending cross-verification** and are **not counted as canonical open bugs**.
- Browser, built-artifact and production-like claims were not made by the Gill intake.
- `SUPER_AUDIT_2026-07-06_14a49be8.md` remains supporting historical evidence tied to an older source SHA; reverify each systemic claim before implementation.
- Freshness proof for the no-op current-head advance: `../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/evidence/REVERIFY_DELTA_ff55161.md`.

## Current handoff layers

### Verified / canonical

1. `MASTER_BUG_MATRIX.md` — this carry-over ledger and pending-queue index.
2. `START_HERE.md` — owner and next-agent canonical handoff.

### Working / not verified

3. `../working/START_HERE_2026-07-09.md` — Gill V10 candidate matrix.

### Verification queue

4. `../verification/START_HERE_2026-07-09.md` — required witness plan and promotion rules.

### Raw intake / evidence

5. `../incoming/gpt-5-5-gill-series-master-audit/2026-07-09/` — official raw source-audit package.

---

# 🔴 P0 — CANONICAL OPEN (0)

No canonical P0 row is added by this Gill intake. Six Gill publication-blocker candidates remain pending cross-verification below.

---

# 🟠 P1 — CANONICAL OPEN / CARRY-OVER (2)

| ID | Description | Status / evidence |
|---|---|---|
| `BUG-PERF-001` | addEventListener without corresponding cleanup: historical count 339 add / 25 remove across JS. | carry-over; reverify current source before repair |
| `TTS-DL-CONSENT` | First Play can trigger background download of ~280 MB neural model without explicit consent. Save-Data/opt-out is partial mitigation; owner UX decision required. | existing verified row; Gill V10 adds another source witness but does not make it repair-ready |

---

# 🟡 P2 — CANONICAL OPEN / CARRY-OVER (10)

| ID | Description | Status |
|---|---|---|
| `TTS-DL-UNZIP-SYNC` | `fflate.unzipSync` handles the full model archive on the main thread; potential one-time freeze. | carry-over; reverify current engine before fix |
| `TTS-DL-NO-TABLOCK` | No inter-tab lock; page-local warm-up state can permit duplicate large downloads. | carry-over; only fix with consent lifecycle after reverify |
| `AUDIT-P2-WORKFLOWS-CHECK-GAP` | Workflow checker does not validate deploy `if:` topology and relies on brittle string/regex checks. | carry-over / SUPER_AUDIT W1; reverify current workflow |
| `AUDIT-P2-MATRIX-DRIFT` | Route migration, ownership and sitemap registries lack complete cross-validation. | carry-over; Gill manifest is a candidate scoped instance |
| `BUG-SEO-001` | IndexNow submit can occur before actual CDN availability. | carry-over; reverify current workflows |
| `NEW-CANONICAL-IZBRANNOE-01-GAP` | Canonical guard historically missed relative canonical on noindex routes. | carry-over tooling gap; reverify current guard |
| `D-1` | Deploy and IndexNow concurrency groups are separate; cancel-in-progress can discard push deploys. | carry-over; reverify current YAML |
| `D-2` | CSS layer validator promises order/coverage checks but historically checks a narrower contract. | carry-over; reverify current script |
| `D-19` | Some custom PageHeads maintain separate title/OG/Twitter/JSON-LD literals. | carry-over; reverify affected routes |
| `D-21` | Glossary has dual render semantics (`innerHTML` vs `textContent`), causing markup drift and an XSS-sensitive surface. | carry-over from base matrix; reverify before any repair/status claim |

---

# 🟢 P3 — CANONICAL OPEN / CARRY-OVER (19)

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
| `AUDIT-PRO-VM-DEPRECATED` | Audit helper uses a `vm.Script` path considered fragile for future Node changes. |
| `SEO-AUDIT-ROOT-ONLY` | SEO audit excludes dist and can miss Astro-only output. |
| `VALIDATE-JS-VM-DEPRECATED` | Duplicate `vm.Script` dependency in validate path. |
| `VALIDATE-JS-ARTICLES-ONLY` | Article validator does not cover all article-like route families. |
| `AUDIT-PRO-ROOT-ONLY` | Audit-pro reasons primarily over root HTML, not complete production dist. |
| `STRANGLER-HYGIENE` | Most Astro routes still have root legacy shadows; by-design today, long-term debt. |
| `D-3` | Historical JS budget exceeded configured audit budget. |
| `D-4` | Magic z-index values remain; coordinate with PremiumControls. |
| `D-7` | Benign repo-relative documentation pointer in a source comment; cosmetic only. |
| `D-8` | Markdown-only changes do not trigger deploy; by-design while Markdown is not public input. |

All P3 descriptions above are carry-over summaries, not a claim that this Gill intake reverified them on `ff55161b`.

---

# 🔵 REFACTORING — CARRY-OVER (4)

| ID | Description |
|---|---|
| `R-001` | `site.js` monolith. |
| `R-002` | `enhancements.js` monolith. |
| `R-003` | No source maps. |
| `R-004` | Limited module/tree-shaking architecture. |

# 🟣 AUDITREPO — CARRY-OVER (3)

| ID | Description |
|---|---|
| `AR-001` | Harden `validate_audit_repo.py`, including its current REPORT-content indentation bug. |
| `AR-004` | Automate verification protocol/status movement. |
| `AR-005` | Automate current-HEAD reverify and canonical-header refresh. |

---

# 🟤 PENDING CROSS-VERIFICATION — GILL V10 (11, NOT COUNTED)

All rows below are currently:

```text
W1 source witness
verified-source
needs-cross-verification
not repair-ready
```

| Candidate ID | Proposed severity | Candidate summary |
|---|---:|---|
| `GILL-V10-SOURCE-TRUTH` | P0 publication blocker | MDX, production Astro bodies and root legacy shadows are separate representations; a Part II factual divergence is source-observed. |
| `GILL-V10-SERIES-MANIFEST` | P0 publication blocker | Five-document IDs/order/maps and total `149` remain hardcoded. Current rail already fixed the obsolete `Часть 3 из 5` display subclaim, so that subclaim is excluded. |
| `GILL-V10-HISTORICAL-TOC-CONTRACT` | P0 publication blocker | Historical item-count witness can preserve an incomplete current outline; Part II still configures only six TOC rows. |
| `GILL-V10-ROMAN-NUMBER-COLLISION` | P0 publication blocker | Standalone Part II begins at internal III/IV and Part III at V, potentially colliding with future series Part IV. |
| `GILL-V10-PART3-NARRATIVE` | P0 publication blocker | Major material follows death/burial and sources; repeated topic clusters need independent editorial verification. |
| `GILL-V10-PART4-OWNERSHIP` | P0 publication blocker | Parts II–III appear to consume much of the proposed Part IV doctrinal scope; owner decision required. |
| `GILL-V10-RESEARCH-CANON` | P1 | Research dossiers contain competing/superseding plans without explicit status metadata. |
| `GILL-V10-INTRO-OWNERSHIP` | P1 | Introduction/Part I/Part II appear to overlap in biography and historical context ownership. |
| `GILL-V10-READER-PROJECTIONS` | P1 | Source selectors indicate TOC/TTS/schema/table projections differ; build/browser witnesses required. |
| `GILL-V10-CLAIM-PROVENANCE` | P1 | Research dossier 07 contradicts itself about Rippon versus the modern ten-million-word extrapolation. |
| `GILL-V10-RESTORED-FIGURE-RELOCATION` | P2 | Part III figures SSR after the article and are moved client-side; no-JS/Pagefind/print/TTS impact requires verification. |

Canonical promotion is governed by `../verification/START_HERE_2026-07-09.md`.

---

# ✅ CLOSED / HISTORICAL

- The previous canonical matrix recorded **90 closed/fixed items** through 2026-07-08.
- The complete historical closed table remains available at immutable AuditRepo commit `18713174a343740cc0886df6c6441c51bde61274`, path `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md`.
- Known recent closures include `TTS-OUTCOME-TELEMETRY` (`a459ff3`) and already-fixed `D-22` (`365de50`).
- Do not reopen or remove historical rows without the repository retirement/reverify protocol.

---

# Statistics

| Category | Count |
|---|---:|
| Historical closed/fixed | 90 |
| Canonical P0 open | 0 |
| Canonical P1 open/carry-over | 2 |
| Canonical P2 open/carry-over | 10 |
| Canonical P3 open/carry-over | 19 |
| Refactoring carry-over | 4 |
| AuditRepo carry-over | 3 |
| **Canonical open/carry-over total** | **38** |
| Gill V10 pending candidates | 11 |

Do not report `49 active confirmed bugs`. The correct wording is:

```text
38 canonical carry-over rows from the base ledger, each requiring current-head reverify before repair/status change
+ 11 Gill V10 candidates pending cross-verification
```

---

# Current next steps

1. Run the Gill cross-verification queue before source implementation.
2. Reverify any selected carry-over row on current source `ff55161b` before repair or closure.
3. Record owner decisions for content ownership, Part IV scope and TTS consent.
4. Promote, downgrade, merge or reject each Gill candidate through a verification decision document.
5. Only promoted `repair-ready` rows may enter a source-repair lane.