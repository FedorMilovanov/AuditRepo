# NEXT AGENT PROMPT — gb-is-my-strength

> **Current operational truth only.** Historical prompts are archived under
> `archive/stale/2026-07-23-current-truth-cleanup/`. Bug status and counts belong to
> `verified/MASTER_BUG_MATRIX.md`; this file owns the exact current source/deploy boundary and next execution order.

**Source main:** `8a5352671375fdb01b6c30273c25ec4283a13f69`
**Production:** ✅ exact `8a535267`
**Readiness:** `30006414898` — success
**Pages:** `30007024100` — success
**Live sitemap:** 66 `<loc>`, SHA-256 `5f3fa280af1ddc73f166decce47535d48ec60718375dd7c0418ea3675f82a801`
**Current reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-07-23_8a535267_sitemap_contract.md`

## 1) Proven production boundary

The deployed source is exact `8a5352671375fdb01b6c30273c25ec4283a13f69`.

Exact chain:

1. Metadata & IndexNow Readiness `30006414898` — success on `8a535267`;
2. Deploy to GitHub Pages `30007024100` — success on the same SHA;
3. observer `30006649281`, artifact `8563907298`, independently matched both workflow records by exact `head_sha`;
4. live `sitemap.xml` contains 66 `<loc>` entries and hashes to `5f3fa280af1ddc73f166decce47535d48ec60718375dd7c0418ea3675f82a801`.

PR #163 closed the sitemap audit-scope defect without changing page markup, CSS, runtime or content. Expected sitemap routes now derive from the existing effective route registry rather than committed/root HTML.

Canonical evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-23_8a535267_sitemap_contract.md`.

## 2) Completed lanes — do not reopen without current-head evidence

- `NG-UI-EPISTEMIC-BIAS-01` / issue #153 — closed by PR #154.
- `READER-ROUTE-SEMANTICS-01` / issue #146 — closed by PR #157.
- `NG-PREMIUM-CONTROLS-ARIA-01` — closed by PR #158.
- `AUDIT-ATLAS-DOC-PATH-LEAK` — closed by PR #160 + PR #162.
- `AUDIT-FORBIDDEN-JS-NAGORNAYA` — closed: canonical allowlist contains `nagornaya-bar-extras.js`; exact audit-pro is green.
- `GATE-CSS-IMPORTANT-RATCHET` — closed: site.css is 183 against ceiling 200; both CSS gates are green.
- `ASTRO-P0-03` and `ASTRO-P0-04` — closed: map-route stats are fatal in CI and Avraam has one canonical 19-place set.
- `AUDIT-PRO-SITEMAP-ROOT-ONLY` — closed by PR #163: 66 indexable production routes are registry-derived sitemap obligations; explicit `seo.indexable=false` is the only production exemption; Astro-only route mutations fail.

The isolated mobile-map HTTP witness proved `ishod` and `avraam` clean when the required local server is started. The earlier `ERR_CONNECTION_REFUSED` result was test orchestration, not a product defect.

## 3) Concurrent-agent boundaries

Other agents are active. Do not overwrite or absorb their branches:

- source PR #161 — universal glossary contract; it has expanded substantially and now touches shared runtime, many publication files and dedicated CI;
- source PR #156 — Gill editorial/research corrections;
- Research PR #7 and AuditRepo PR #27 — Gill source corpus and its audit record.

Before starting a source lane, refresh the current `main`, list all active PR files and compare intersections. Work must land through an isolated, reviewed diff and merge into `main` only after exact checks.

## 4) Active work, in order

1. **Finish AuditRepo PR #29**
   - move `AUDIT-PRO-SITEMAP-ROOT-ONLY` from P3 open to closed;
   - update counters and source/deploy authority to exact `8a535267`;
   - remove the temporary production observer and restore read-only AuditRepo validation;
   - require zero matrix coverage drift before merge.

2. **Re-evaluate `SEO-AUDIT-ROOT-ONLY` after active PR refresh**
   - current `seo-audit.js` excludes `dist/` and audits only the root publication corpus;
   - preserve source/repository checks, but add a registry-driven production-dist mode after build rather than replacing one scope with another;
   - do not duplicate canonical route ownership or create hardcoded route lists;
   - confirm no overlap with the expanded glossary PR #161 before writing `package.json`, CI or shared scripts.

3. **Reader R6 / issue #59**
   - unify progress, resume, bookmarks and notes only after shared-runtime overlap with PR #161 is resolved;
   - do not create a separate book engine; books remain `surface=series` + `seriesShape=book`.

4. Continue verified P0/P1 order from `MASTER_BUG_MATRIX.md` after current-truth synchronization and active-PR collision checks.

## 5) Open findings that remain real

- `AUDIT-PRO-ROOT-ONLY` — broader audit-pro HTML/SEO/a11y scope still derives from root publication files; the sitemap sub-gap alone is closed.
- `SEO-AUDIT-ROOT-ONLY` — `seo-audit.js` excludes `dist/`.
- `STRANGLER-HYGIENE` — migration/reference debt remains; runtime ownership is clean.
- `TTS-DL-NO-TABLOCK` — no current proof of cross-tab ownership for the large model download.
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
- live marker/hash witness for the artifact or rendered surface that changed;
- only then update AuditRepo current truth.

## 7) Data hygiene rules

- `PROJECT_REGISTRY.md` is static; never put HEAD or session history there.
- `NEXT_AGENT_PROMPT.md` owns current execution truth.
- `verified/MASTER_BUG_MATRIX.md` owns status/counts.
- `reverify/` owns immutable current-head witnesses.
- superseded intake is moved to `archive/stale/`; fixed rows/evidence to `archive/fixed/`.
- no silent deletion of evidence; Git history alone is not a substitute for a provenance note when moving AuditRepo evidence.
