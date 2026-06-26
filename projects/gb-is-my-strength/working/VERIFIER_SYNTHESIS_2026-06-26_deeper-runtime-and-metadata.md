# Verifier Synthesis — deeper runtime + metadata pass — 2026-06-26

## Meta
- Project: gb-is-my-strength
- Date: 2026-06-26
- Verifier: `arena-agent`
- Scope:
  - deeper source/build/browser verification after current-head reverify
  - focus on runtime assembly, metadata automation, index surfaces, and canonical bug cleanup

Related docs:
- `reverify/CURRENT_HEAD_REVERIFY_2026-06-26_current.md`
- `reverify/CURRENT_HEAD_REVERIFY_2026-06-26_browser-addendum.md`
- `verification/conflicts/CONFLICT_REGISTRY_2026-06-26-current-head-cleanup.md`

---

## High-value confirmed findings from this pass

### D-01 — `update-meta.js` coverage gap remains real
- Prior ledger relation: **P1-4**
- Status: `confirmed-current`
- Severity: **P1**
- Witnesses:
  - `verified-source`: `ASTRO_PAGE_HEAD_MAP` contains exactly 10 entries.
  - `verified-source`: all entries are article pilot page-head components only.
- Interpretation:
  - metadata automation remains narrowly scoped and can drift on broader Astro-owned routes.
- Recommendation:
  - keep open as real automation coverage bug.

### D-02 — `robots.txt` query-string blocking rule remains present
- Prior ledger relation: **P0-3**
- Status: `confirmed-current`
- Severity: **P0** or strong P1 depending on SEO policy stance
- Witnesses:
  - `verified-source`: `Disallow: /*?*` still exists in `robots.txt`.
- Recommendation:
  - keep open.

### D-03 — current canonical claims about sitemap/search-manifest gaps are stale
- Prior ledger relation: **P1-2 / P1-3**
- Status: `stale-on-current-head` for old wording/examples
- Witnesses:
  - `verified-source`: sitemap contains current examples previously claimed missing.
  - `verified-source`: search-manifest `items` contains current examples previously claimed missing.
- Observed:
  - sitemap count: 43 URLs
  - search manifest items count: 44 URLs
- Recommendation:
  - retire old examples and avoid carrying them into repair lanes.

### D-04 — old `indexnow.yml no retry` claim is stale
- Prior ledger relation: **P0-6** old wording
- Status: `stale-on-current-head` for that exact claim
- Witnesses:
  - `verified-source`: workflow has retry loop around `git push`.
- Recommendation:
  - if there is still a race/cascade risk, re-open with fresh current-head root cause.

### D-05 — BaseLayout runtime assembly is guarded, but still complex enough to justify maintainability concern
- Prior ledger relation: **P3-9** adjacency / BaseLayout runtime concerns
- Status: `confirmed-current` as architectural complexity concern, **not** confirmed as widespread duplicate metrika defect
- Witnesses:
  - `verified-source`: `BaseLayout.astro` loads legacy runtime through `loadLegacyRuntime(canonical)` when `includeLegacyRuntime && !headHtml`.
  - `verified-source`: metrika presence is guarded via `hasMetrika` before `makeGenericRuntime(!hasMetrika)`.
  - `verified-source`: body runtime is assembled by merging `[autoLegacyRuntime, genericRuntime, bodyEndHtml]`.
- Interpretation:
  - current code is not naïvely duplicating metrika in the common branch; there is explicit protection.
  - however, runtime assembly remains complex and multi-path, so maintainability risk stays valid.
- Recommendation:
  - do **not** overstate this as confirmed duplicate Yandex.Metrika on all routes.
  - keep only as architectural/runtime-composition caution unless route-specific duplication is reproduced.

### D-06 — sampled dist pages do not show obvious duplicate metrika markers
- Prior ledger relation: **P3-9**
- Status: `challenge-to-overstatement`
- Witnesses:
  - `verified-production-like-dist`:
    - `dist/about/index.html` → `ym=1`, `watch=1`, `sitecfg=0`
    - `dist/articles/index.html` → `ym=1`, `watch=1`, `sitecfg=0`
    - `dist/index.html` → `ym=1`, `watch=1`, `sitecfg=0`
    - `dist/baptisty-rossii/index.html` → `ym=0`, `watch=0`, `sitecfg=1`
- Interpretation:
  - no duplicate Yandex.Metrika markers seen in sampled outputs.
  - `baptisty-rossii` notably differs by relying on `window.SITE_CONFIG` without metrika markers in sampled output.
- Recommendation:
  - do not promote duplicate-metrika claim without stronger route-specific evidence.

### D-07 — Astro check hints remain non-blocking but represent ongoing code-health debt
- Status: `confirmed-current`
- Severity: **P3**
- Witnesses:
  - `verified-build`: current build emits 13 hints, including script processing hints in HomePageChrome, RodosloviyeBody, and Baptizm3DBody, plus unused props.
- Recommendation:
  - keep as debt, not as production incident.

### D-08 — Karty unresolved build-time asset warning remains reproducible
- Prior relation: new current-head bug from earlier reverify
- Status: `confirmed-current`
- Severity: **P2**
- Witnesses:
  - `verified-build`: repeated warning about `../images/og-karty-1200x630.webp` unresolved at build time.
- Recommendation:
  - keep open.

---

## Net refinement of bug truth after this pass

### Strongly open
- P0-3 (`robots.txt` query blocking)
- P1-4 (`update-meta.js` coverage gap)
- P1-13 / P1-14 / P1-15 GBS2 wiring class
- P1-17 BaseLayout CSS/JS cache asymmetry
- split cache-bust / SW registry defect
- feed date correctness issue
- Karty build warning
- title / og:title mismatch

### Open but reclassify carefully
- BaseLayout runtime composition complexity → architectural caution, not automatically duplicate metrika bug
- stale-hash system → architectural/manual-hash + postbuild-dependence, not blanket current runtime outage

### Retire or rewrite old claims
- P1-2 old sitemap omissions
- P1-3 old search-manifest omissions
- P0-6 old no-retry CI wording
- PS-06 exact hidden readTime mismatch
- V2-3 / NEW-4 exact Avraam skip-link wording
- P3-8 old FAQ wording if no current DOM/controller proof is refreshed

---

## Recommended next step

Next highest-value audit wave:
1. route-by-route GBS2 runtime matrix (hub + child routes)
2. metadata automation blind spots beyond article pilots
3. precise current IndexNow payload behavior on synthetic changed-file sets
4. route-level cache/runtime evidence for any remaining stale-hash symptoms
