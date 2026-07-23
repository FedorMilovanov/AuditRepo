# NEXT AGENT PROMPT — gb-is-my-strength

> **Current operational truth only.** Historical prompts are archived under
> `archive/stale/2026-07-23-current-truth-cleanup/`. Bug status and counts belong to
> `verified/MASTER_BUG_MATRIX.md`; this file owns the exact current source/deploy boundary and next execution order.

**Source main:** `7187c32a39e1d5b185dbf385f651da0906911d74`
**Last exact production:** ✅ `8a5352671375fdb01b6c30273c25ec4283a13f69`
**Production readiness:** `30006414898` — success
**Production Pages:** `30007024100` — success
**Live sitemap witness:** 66 `<loc>`, SHA-256 `5f3fa280af1ddc73f166decce47535d48ec60718375dd7c0418ea3675f82a801`
**Current source reverify:** `reverify/CURRENT_HEAD_REVERIFY_2026-07-23_7187c32a_search-seo-html-contracts.md`

## 1) Exact boundary

Source and production are intentionally different authorities:

- source `main` is `7187c32a`;
- the last exact deployed Pages SHA remains `8a535267`;
- PR #165, PR #167 and PR #166 are source/CI verified, but this AuditRepo update does not claim a new exact Pages deployment.

Canonical evidence: `reverify/CURRENT_HEAD_REVERIFY_2026-07-23_7187c32a_search-seo-html-contracts.md`.

## 2) Newly completed lanes

- `AUDIT-PRO-SITEMAP-ROOT-ONLY` — closed by PR #163.
- `SEO-AUDIT-ROOT-ONLY` — closed by PR #165: production SEO is registry-derived and audits all 75 built routes.
- `VALIDATE-SCOPE-GAP` — closed by PR #167: static HTML obligations derive from the public-surface registry.
- `VALIDATE-JS-ARTICLES-ONLY` — closed by the same PR #167 contract; `articles/*` and hardcoded `EXTRA_PAGES` are no longer the only breadth witness.
- Search & Index issue #57 — implemented by PR #166 through one explicit 75-route policy matrix for robots, Pagefind, search-manifest, sitemap and RSS.

PR #167 removed one real public broken link from `/baptisty-rossii/` to an unpublished local research Markdown file. PR #166 then normalized four missing search-manifest entries and 94 RSS metadata drifts through the shared policy projection.

## 3) Concurrent-agent boundaries

Do not overwrite or absorb active branches:

- source PR #161 — universal glossary contract; preserve removal of the unpublished Baptist research href during rebase;
- source PR #156 — Gill editorial/research corrections;
- Research PR #7 and AuditRepo PR #27 — Gill source corpus and evidence.

Before any source work, refresh `main`, list active PR files and compare intersections.

## 4) Active work, in order

1. **Narrow the remaining `AUDIT-PRO-ROOT-ONLY` tail**
   - sitemap breadth is closed by #163;
   - SEO breadth is closed by #165;
   - static HTML/link/alt/JSON-LD/H1 breadth is closed by #167;
   - search/index/RSS membership is now explicit and registry-backed by #166;
   - inventory only the still-root-specific `audit-pro.js` publication/cache-bust/general checks;
   - migrate or retire duplicated inference through existing registry/dist helpers, without another route list.

2. **Handle the PR #167 warning inventory only after PR #161 collision checks**
   - 19 title/OG-title drifts;
   - 10 Baptist reading pages without `article:modified_time`;
   - 5 Nagornaya reading pages without the generic byline marker.
   These are visible editorial debts, not suppressed baseline exceptions.

3. **Reader R6 / issue #59**
   - unify progress, resume, bookmarks and notes only after shared-runtime overlap with PR #161 is resolved;
   - books remain `surface=series` + `seriesShape=book`, not a second engine.

4. Continue verified P0/P1 order from `MASTER_BUG_MATRIX.md`.

## 5) Open findings that remain real

- `AUDIT-PRO-ROOT-ONLY` — only the remaining audit-pro-specific root-corpus/publication/cache-bust tail.
- `STRANGLER-HYGIENE` — migration/reference debt remains.
- `TTS-DL-NO-TABLOCK` — no current proof of cross-tab ownership for the large model download.
- `REG-001` — GitHub Pages response-header limitation / hosting decision.
- the 34 PR #167 warning-inventory items described above.

Do not reopen the closed sitemap/SEO/HTML breadth rows or the new Search & Index policy without current-head counter-evidence.

## 6) Non-negotiable gates

Before source merge:

- Shared Files Guard;
- Native Source Contract when source/profile paths are touched;
- Search Manifest Policy when search/index data is touched;
- Route Registry Validators and browser matrix for public semantics;
- Visual Parity for rendered surfaces;
- production-like build and the route-specific release gate.

After a production-impacting merge:

- exact readiness success;
- exact Pages success;
- live marker/hash witness for the changed artifact or surface;
- only then advance the production authority in AuditRepo.

## 7) Data hygiene

- `PROJECT_REGISTRY.md` is static.
- `NEXT_AGENT_PROMPT.md` owns current execution truth.
- `verified/MASTER_BUG_MATRIX.md` owns status and counters.
- `reverify/` owns immutable current-head witnesses.
- superseded intake moves to `archive/stale/`; fixed evidence moves to `archive/fixed/`.
- no silent evidence deletion and no temporary workflow in a final diff.
