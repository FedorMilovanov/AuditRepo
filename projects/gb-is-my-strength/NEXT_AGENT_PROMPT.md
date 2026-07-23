# NEXT AGENT PROMPT — gb-is-my-strength

> **Current operational truth only.** Historical prompts are archived under
> `archive/stale/2026-07-23-current-truth-cleanup/`. Bug status and counts belong to
> `verified/MASTER_BUG_MATRIX.md`; this file owns the exact current source/deploy boundary and next execution order.

**Source main:** `0f5b330799292d995c62bbb7d63a83870d93318e`
**Production:** ✅ exact `0f5b3307`
**Readiness:** `29972524675` — success
**Pages:** `29972909431` — success, all 30 deployment stages green
**Current reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-07-23_0f5b3307_production.md`

## 1) Proven production boundary

The deployed source is exact `0f5b330799292d995c62bbb7d63a83870d93318e`.

Exact chain:

1. Metadata & IndexNow Readiness `29972524675` — success on `0f5b3307`;
2. Deploy to GitHub Pages `29972909431` — success on the same SHA;
3. all 30 deploy stages passed, including static publication, Astro build, ownership, Pagefind, visual parity, JSON-LD, PremiumControls, Gill browser smokes, broad runtime, content coverage, Service Worker, Pages and IndexNow;
4. `0f5b3307` differs from deployed `a73f609f` only by a source comment in `PremiumControlAnchor.astro`; rendered output is unchanged;
5. the previous live witness remains byte-relevant for rendered pages and found all Nagornaya epistemic markers plus Play-control ARIA.

Completed source-cleanup descendants:

- PR #159 — retired four proven unreferenced legacy control/evidence files: `681a8a97`;
- PR #160 — replaced two Atlas workspace-specific paths: `a73f609f`;
- PR #162 — removed the final workspace-specific `AuditRepo/projects/...` source comment: `0f5b3307`.

Canonical evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-23_0f5b3307_production.md`.

## 2) Completed lanes — do not reopen without current-head evidence

- `NG-UI-EPISTEMIC-BIAS-01` / issue #153 — closed by PR #154.
- `READER-ROUTE-SEMANTICS-01` / issue #146 — closed by PR #157.
- `NG-PREMIUM-CONTROLS-ARIA-01` — closed by PR #158.
- `AUDIT-ATLAS-DOC-PATH-LEAK` — closed by PR #160 + PR #162.
- `AUDIT-FORBIDDEN-JS-NAGORNAYA` — closed: canonical allowlist contains `nagornaya-bar-extras.js`; exact audit-pro is green.
- `GATE-CSS-IMPORTANT-RATCHET` — closed: site.css is 183 against hard ceiling 200; both CSS gates are green.
- `ASTRO-P0-03` and `ASTRO-P0-04` — closed: map-route stats are fatal in CI and Avraam has one canonical 19-place set.

The isolated mobile-map HTTP witness proved `ishod` and `avraam` clean when the required local server is started. The earlier `ERR_CONNECTION_REFUSED` result was test orchestration, not a product defect.

## 3) Concurrent-agent boundaries

Other agents are active. Do not overwrite or absorb their branches:

- source PR #161 — universal glossary contract; touches glossary runtime, many published HTML files, Gill chrome and asset versions;
- source PR #156 — Gill editorial/research corrections; touches Gill article components only;
- Research PR #7 and AuditRepo PR #27 — Gill source corpus and its audit record.

Before starting a source lane, compare its file set against these PRs and rebase from the latest `main`. Work must land through an isolated, reviewed diff and then merge into `main`.

## 4) Active work, in order

1. **Finish AuditRepo current-truth cleanup — PR #28**
   - remove all `_temp-*` workflows and the one-shot reconciliation writer;
   - keep permanent matrix coverage tooling and archived evidence;
   - obtain clean `AuditRepo Validate` and strict zero matrix coverage;
   - merge the cleaned PR into `main`.

2. **Independent source lane: `AUDIT-PRO-SITEMAP-ROOT-ONLY`**
   - current audit-pro sitemap coverage derives from committed/root HTML while `dist/` is skipped;
   - extend or replace this check with the effective route registry / production-like dist contract;
   - do not touch glossary or Gill article files;
   - require mutation coverage proving an Astro-only route cannot disappear from sitemap unnoticed.

3. **Reader R6 / issue #59**
   - unify progress, resume, bookmarks and notes only after shared-runtime overlap with PR #161 is resolved;
   - do not create a separate book engine; books remain `surface=series` + `seriesShape=book`.

4. Continue verified P0/P1 order from `MASTER_BUG_MATRIX.md` after the governance and sitemap-audit lanes.

## 5) Open findings that remain real

- `AUDIT-PRO-SITEMAP-ROOT-ONLY` — audit scope gap, not a currently broken sitemap.
- `STRANGLER-HYGIENE` — migration/reference debt; runtime is already legacy-clean.
- `TTS-DL-NO-TABLOCK` — no cross-tab ownership for the large model download.
- `REG-001` — GitHub Pages response-header limitation / hosting decision.

Do not close these from old reports or by aliasing. Each needs current-source evidence or an explicit owner decision.

## 6) Non-negotiable gates

Before any source merge:

- Shared Files Guard;
- Native Source Contract when source/profile paths are touched;
- Route Registry Validators and browser matrix when public semantics are touched;
- Visual Parity policy when rendered surfaces are touched;
- production-like build and route-specific release gate for deploy blockers.

After any production-impacting merge:

- exact readiness success;
- exact Pages success;
- live marker/hash witness when rendered output changes;
- only then update AuditRepo current truth.

## 7) Data hygiene rules

- `PROJECT_REGISTRY.md` is static; never put HEAD or session history there.
- `NEXT_AGENT_PROMPT.md` owns current execution truth.
- `verified/MASTER_BUG_MATRIX.md` owns status/counts.
- `reverify/` owns immutable current-head witnesses.
- superseded intake is moved to `archive/stale/`; fixed rows/evidence to `archive/fixed/`.
- no silent deletion of evidence; Git history alone is not a substitute for a provenance note when moving AuditRepo evidence.
