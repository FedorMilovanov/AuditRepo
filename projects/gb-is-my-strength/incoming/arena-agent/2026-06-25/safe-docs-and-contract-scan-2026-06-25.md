# Safe docs / contract scan — 2026-06-25

**Branch:** `lane/docs-audit-consistency-2026-06-25`  
**Scope:** docs-only / audit-only safe pass, no implementation fixes on active premium-page lanes.  
**Method:** 50+ targeted bash scans + a few metadata normalizations in lane docs.

---

## 1. High-confidence documentation inconsistencies found

## 1.1 Lane index drift

`docs/refactor-2026/lanes/README.md` was missing several lane reports that already exist on disk.

Examples found by scan:
- `lane/content-gill-stale-trilogy-polish-2026-06-25`
- `lane/system-mobile-toc-v16`
- `lane/system-floating-cluster-v16-pilot-gill-hermeneutics-2026-06-25`
- `lane/system-route-profile-closeout-2026-06-24`
- `lane/fix-karty-konfessii-pagehead-scoped-styles-2026-06-23`

Also, lane names present in the index/history but missing a matching canonical lane report file:
- `lane/system-ci-contract-reconciliation-2026-06-24`
- `lane/phase3-protection-v1-5`

### Safe action taken
- `docs/refactor-2026/lanes/README.md` updated to include the most obvious indexed gaps and a dedicated “Report file gaps / indexing gaps” section.

---

## 1.2 Lane report metadata format drift

Several lane reports do not follow the current template consistently.

Detected issues:
- missing standard header fields (`Branch/Mode/Scope/Status/Owner`)
- non-standard title style (`# Lane: ...`, `# lane/...`, `# Lane Report — ...`)
- status in lane file not matching lane index

Examples:
- `fix-karty-konfessii-pagehead-scoped-styles-2026-06-23.md`
- `system-route-profile-closeout-2026-06-24.md`
- `visual-fix-nagornaya-native-2026-06-23.md`

### Safe action taken
Normalized the top metadata blocks of these docs to the current lane-report format without touching code or route implementation.

---

## 1.3 Living audit contradiction on “20 антисоветов”

`docs/refactor-2026/REFRACTOR_AUDIT_LIVING.md` contained both:
- a closed item for `20 антисоветов` read-time drift
- and a lower block that still looked like an open P0

### Safe action taken
- converted the lower section into an explicitly historical snapshot
- recorded that current repo state is already canonicalized to `67 мин`

---

## 2. Broken / stale documentation references

## 2.1 Broken local markdown link

Detected by local-link scan:

- `docs/LANE_LOCK_POLICY.md` → link target `docs/WORK_MODES.md`

From inside `docs/LANE_LOCK_POLICY.md`, that relative path is wrong; it should point to the sibling file, not `docs/docs/...`.

### Status
- **Not edited in this safe lane** because `docs/LANE_LOCK_POLICY.md` is a shared policy doc.
- Recommended separate shared-doc lane if owner wants strict cleanup.

---

## 2.2 Docs reference npm scripts that no longer exist

Examples found:
- `npm run article-mdx-pilot-audit`
- `npm run baptisty-series-shadow-audit`
- `npm run validate:content`
- `npm run test:e2e`
- `npm run test:visual`
- `npm run audit-pro`

Current package scripts use names like:
- `npm run astro:audit:article-mdx:strict`
- `npm run astro:audit:baptisty-series`
- `node scripts/audit-pro.js`
- `npm run visual-audit`

### Status
- recorded as docs drift
- **not mass-edited** in this lane because many references live in historical / research / roadmap docs where old command names may be snapshot-accurate for their date

---

## 2.3 Docs reference node scripts that do not exist in repo

Examples found:
- `scripts/new-article.js`
- `scripts/validate-sitemap.js`
- `scripts/validate-jsonld.js`
- `scripts/legacy-html-to-mdx-draft.js`
- `scripts/extract-avraam-route-draft.js`
- archived mention of removed `scripts/article-end-audit.py`

### Interpretation
Most of these live in planning / research docs and look like:
- abandoned planned utilities,
- historical references,
- or proposal documents, not current runnable contracts.

### Status
- recorded as documentation drift
- no code touched

---

## 3. Architecture-doc drift vs actual repo surface

Repo reality today:
- root `css/` file count = **7**
- root `js/` file count = **13**

Actual extra files beyond the older 5/11 doctrine:
- `css/floating-cluster.css`
- `css/site-layered.css`
- `js/floating-cluster-controller.js`
- `js/site-modules.js`

But docs/contracts still contain older wording such as:
- “РОВНО 5 ФАЙЛОВ”
- “РОВНО 11 ФАЙЛОВ”
- “5 CSS + 11 JS”

Files containing this stale doctrine include:
- `AGENTS.md`
- `README.md`
- several historical refactor docs

### Status
- **not edited** in this lane because `AGENTS.md` and `README.md` are protected/shared system docs
- recorded as a high-confidence contract/doc drift for future system-doc cleanup

---

## 4. Premium controls rollout coordination scan

Compared safely against the attached rollout plan:

- `uploads/GB_PREMIUM_CONTROLS_FULL_PROJECT_ROLLOUT_PLAN_V4_2026-06-25.md`

Created a repo-specific route map:

- `docs/refactor-2026/PREMIUM_CONTROLS_ROUTE_MAP_2026-06-25.md`

Main safe findings from that scan:

- route registry in `src/data/floating-cluster-ui.ts` is ahead of implementation for the heart series routes;
- Gill rollout is not one shape: Gill context uses a custom v16 shell, while Gill parts/spravochnik use embedded `GillRailControls`;
- `floating-cluster-controller.js` currently loads on **23** public article/series pages, but only **8** of those show premium roots/hooks, so the controller blast radius is much wider than the real premium rollout surface.

## 5. Safe doc fixes applied in current / normative docs

Applied without touching route implementation:

- fixed broken local relative link in `docs/LANE_LOCK_POLICY.md`
- updated stale repo command names in:
  - `docs/refactor-2026/QUALITY_GATES_AND_TESTING_2026.md`
  - `docs/refactor-2026/TECHNICAL_MIGRATION_RUNBOOK_2026.md`
  - `docs/refactor-2026/DEPLOYMENT_SECURITY_ENV_2026.md`

After these edits, the targeted local-link scan over `docs/` + `audit/` returned:

```txt
issues 0
```

## 6. Runtime / implementation bugs observed but left out-of-lane

These are real, but implementation is being worked by other agents, so this lane only records them.

### 4.1 Shared runtime regression
- `js/floating-cluster-controller.js`
- browser error: `qs is not defined`
- impact: Hermeneutics + Gill + other pages loading floating cluster controller

### 4.2 Hermeneutics stray tail garbage
- `src/components/article-pilots/hermenevtika/HermenevtikaBody.astro`
- stray text after script tag: `76e7365"></script>`

### 4.3 Hermeneutics hidden read-time drift
- visible/canonical: `50 мин`
- hidden pagefind meta still `35`

Detailed implementation audit is stored separately:
- `audit/premium-svg-pages-bug-investigation-2026-06-25.md`

---

## 7. Summary of safe edits actually made in this lane

Edited:
- `docs/refactor-2026/lanes/README.md`
- `docs/refactor-2026/REFRACTOR_AUDIT_LIVING.md`
- `docs/refactor-2026/lanes/fix-karty-konfessii-pagehead-scoped-styles-2026-06-23.md`
- `docs/refactor-2026/lanes/system-route-profile-closeout-2026-06-24.md`
- `docs/refactor-2026/lanes/visual-fix-nagornaya-native-2026-06-23.md`

Created:
- `audit/premium-svg-pages-bug-investigation-2026-06-25.md`
- `audit/safe-docs-and-contract-scan-2026-06-25.md`
- `docs/refactor-2026/lanes/docs-audit-consistency-2026-06-25.md`

No implementation/code fixes were applied to active premium-page lanes in this pass.
