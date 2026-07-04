# Agent Work Report — Pass 63

## Meta
- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength
- Agent: arena-agent (Arena.ai Agent Mode)
- Date: 2026-07-04
- Audited branch: main
- Audited SHA: e5942361f642738e781f68c25b2dfa92aedba196
- Current HEAD: e5942361 (same)
- Mode: deep-audit

---

## 1. New Findings

### BUG-CI-001: deploy.yml — duplicate `run:` key silently disables submenu audit
- **Severity:** P0
- **Route/files:** `.github/workflows/deploy.yml` lines 155–156
- **Evidence:**
  ```bash
  $ sed -n '154,157p' .github/workflows/deploy.yml
        - name: Gill pre-v16 submenu regression audit
          run: npm run gill:pre-v16-submenu:audit
          run: npx playwright install --with-deps chromium

        - name: Gill mobile TOC and PlayEmber smoke
  ```
  YAML spec: duplicate keys in same mapping → last wins. The `run: npm run gill:pre-v16-submenu:audit` is overwritten by the second `run: npx playwright install --with-deps chromium`.
  Result: `gill:pre-v16-submenu:audit` (105 checks) NEVER runs in CI. Playwright install runs twice (lines 152 + 156).
- **Confidence:** high
- **Suggested repair lane:** ci-fix (1-line deletion)

### BUG-CI-002: `validate:static-publication:light` skips 3 critical gates
- **Severity:** P1
- **Route/files:** `package.json` scripts
- **Evidence:**
  ```
  FULL: 37 checks | LIGHT: 34 checks
  Missing in :light:
    - astro:audit:article-mdx:strict  (MDX structure defects, Ukrainian 'мін', 'Сперджен')
    - astro:audit:baptisty-series      (Baptist series shadow audit)
    - sw:dist:audit                   (Service Worker dist readiness)
  ```
  indexnow.yml fires on every content/CSS/JS push and runs `:light`. These 3 gates are only checked in deploy.yml full chain, creating a window where content regressions pass indexnow.yml.
- **Confidence:** high
- **Suggested repair lane:** ci-gate-alignment

### BUG-CI-003: indexnow.yml push retry — silent failure
- **Severity:** P1
- **Route/files:** `.github/workflows/indexnow.yml`
- **Evidence:**
  ```yaml
  for _attempt in 1 2 3; do
    if git push; then break; fi
    sleep 5
  done
  ```
  No `exit 1`, no `::error::`, no notification after 3 failed attempts. Workflow reports success even when cache-bust commit never reaches remote.
- **Confidence:** high
- **Suggested repair lane:** ci-fix

### BUG-ARCH-001: SW PRECACHE_ASSETS contradicts lazy search
- **Severity:** P2
- **Route/files:** `sw.js`
- **Evidence:**
  ```
  PRECACHE_ASSETS includes:
    "/data/search-manifest.json"  ← lazy-loaded since Pass 56
    "/js/search.js"               ← lazy-loaded since Pass 56
  ```
  Pass 56 made search lazy (no initial network request). But SW precache downloads both at install time, negating the bandwidth savings.
- **Confidence:** high
- **Suggested repair lane:** perf-cleanup

### BUG-SEO-001: IndexNow submit before Pages CDN propagation
- **Severity:** P2
- **Route/files:** `.github/workflows/deploy.yml`
- **Evidence:** IndexNow POST to api.indexnow.org and yandex.com/indexnow runs immediately after `actions/deploy-pages@v4`. GitHub Pages CDN propagation takes seconds to minutes. Search engines may crawl before new content is live.
- **Confidence:** medium
- **Suggested repair lane:** ci-seo

### BUG-SW-001: `isFont()` double negation
- **Severity:** P3
- **Route/files:** `sw.js`
- **Evidence:**
  ```javascript
  function isFont(t){return!(t.origin!==self.location.origin||!t.pathname.startsWith("/fonts/"))||"fonts.gstatic.com"===t.hostname}
  ```
  `!(a !== b || !c)` ≡ `a === b && c`. Correct but unreadable.
- **Confidence:** high
- **Suggested repair lane:** code-quality

---

## 2. Confirmations of Existing Findings

### Confirm BUG-011 (P2 breakpoints)
- Target: MASTER_BUG_MATRIX.md → BUG-011
- My evidence: Verified still open on e5942361. 23 unique px breakpoints confirmed.
- Recommended status: confirmed-current (no change needed)

### Confirm R-001 (site.js monolith)
- Target: MASTER_BUG_MATRIX.md → R-001
- My evidence: `js/site.js` still ~167KB monolith on e5942361.
- Recommended status: confirmed-current (no change needed)

### Confirm AR-001/004/005 (AuditRepo infra)
- Target: MASTER_BUG_MATRIX.md → AR section
- My evidence: `validate_audit_repo` still does not exist. PROJECT_REGISTRY.md still shows HEAD `43a515df` (stale by 6+ commits).
- Recommended status: confirmed-current

---

## 3. Challenges / Disputes

### (none)

---

## 4. Duplicate / Merge Proposals

### (none)

---

## 5. Severity Proposals

- BUG-CI-001: Proposed P0 (was not in matrix). 105 checks silently disabled = any desktop submenu regression ships undetected.
- BUG-CI-002: Proposed P1. Content regressions can pass indexnow.yml undetected.
- BUG-CI-003: Proposed P1. Silent push failure = stale metadata on production.

---

## 6. Repair Lane Suggestions

### Lane: ci-fix-emergency
- Bugs: BUG-CI-001, BUG-CI-003
- Why together: Both are deploy.yml / indexnow.yml defects, minimal code changes, high impact.
- What must NOT be mixed: Do NOT touch package.json scripts or sw.js in this lane.

### Lane: ci-gate-alignment
- Bugs: BUG-CI-002, BUG-SEO-001
- Why together: Both relate to CI gate coverage and SEO pipeline timing.
- What must NOT be mixed: Do NOT change deploy.yml structure here.

### Lane: perf-cleanup
- Bugs: BUG-ARCH-001, BUG-SW-001
- Why together: Both are sw.js code quality / performance.
- What must NOT be mixed: Do NOT change CACHE_VERSION or cache strategy in this lane (only PRECACHE_ASSETS list and code formatting).

---

## 7. Reverify Notes

### BUG-RUNTIME-001 (initial finding: empty genericRuntime in BaseLayout.astro)
- Current HEAD: e5942361
- Result: **FALSE POSITIVE**
- Evidence: `fetch_page` on GitHub raw returned truncated template literals (HTML/JS inside backticks was stripped by markdown rendering). Actual source shows full Yandex Metrika (id: 108353327), `window.SITE_CONFIG`, site-utils.js, scroll-perf.js, site.js, sw-register.js, and lazy search bootstrap. All runtime is intact.
- Recommendation: Do NOT add to matrix.

### PROJECT_REGISTRY.md HEAD staleness
- Registry says: `43a515df`
- Actual HEAD: `e5942361`
- Gap: 8+ commits
- Recommendation: Update PROJECT_REGISTRY.md to current HEAD.

### NEXT_AGENT_PROMPT.md stale addendums
- 6 historical addendum blocks from 2026-07-04 still present
- Passes 43, 51, 52, 52b all superseded by Pass 56 (search full lazy loader)
- Recommendation: Archive historical addendums, keep only CURRENT TRUTH + Gill Desktop Rail fixed block.

---

### BUG-SEO-002: robots.txt — `Allow: /llms.txt` scoped to wrong User-agent
- **Severity:** P3
- **Route/files:** `robots.txt`
- **Evidence:**
  ```
  User-agent: ImagesiftBot
  Disallow: /

  Allow: /llms.txt

  Sitemap: https://gospod-bog.ru/sitemap.xml
  ```
  `Allow: /llms.txt` стоит после `User-agent: ImagesiftBot` — по правилам robots.txt, это правило применяется ТОЛЬКО к ImagesiftBot. Если владелец хочет разрешить всем blocked AI bots доступ к `/llms.txt`, нужно добавить `Allow: /llms.txt` в каждый User-agent блок или создать глобальный `User-agent: *` блок.
- **Confidence:** high
- **Suggested repair lane:** seo-fix

### BUG-CLEANUP-001: 4 dead scripts (~27KB)
- **Severity:** P3
- **Route/files:** `scripts/`
- **Evidence:**
  ```
  about-leaf-parity-shots.js      3KB  0 external refs (superseded)
  generate-route-profiles.js      4KB  0 external refs (one-time generator)
  premium-mobile-visibility-smoke.js  4KB  0 external refs (superseded)
  route-impact-report.js         11KB  0 external refs (superseded)
  ```
  Note: `genealogy-e2e-v2.js`, `ishod-qa.js`, `map-visual-qa.js` — NOT dead (intentionally kept for manual QA per docs/BUGS_FOUND_2026-06-25.md).
- **Confidence:** high
- **Suggested repair lane:** cleanup

### BUG-CLEANUP-002: 31MB stale lane docs
- **Severity:** P3 (advisory)
- **Route/files:** `docs/refactor-2026/lanes/`
- **Evidence:** 52 files, 31MB total. Pass 62 confirmed all merged. Should be archived per CLEANUP_RETENTION_POLICY §3.2.
- **Confidence:** high
- **Suggested repair lane:** cleanup (owner decision)

### BUG-CLEANUP-003: AUDIT_HISTORY.md stale (187KB)
- **Severity:** P3 (advisory)
- **Route/files:** `AUDIT_HISTORY.md`
- **Evidence:** 187KB, 51 sections, last updated 2026-06-22 (12 days stale). Pass 62 flagged. Should be archived.
- **Confidence:** high
- **Suggested repair lane:** cleanup (owner decision)

### BUG-CLEANUP-004: docs/BUGS_FOUND_2026-06-25.md stale (78KB)
- **Severity:** P3 (advisory)
- **Route/files:** `docs/BUGS_FOUND_2026-06-25.md`
- **Evidence:** 78KB, all bugs fixed per Pass 62. Should be archived.
- **Confidence:** high
- **Suggested repair lane:** cleanup (owner decision)

---

## 8. Notes for Verifier

1. **BUG-CI-001 is P0 and trivially fixable** — delete line 156 (`run: npx playwright install --with-deps chromium`) from deploy.yml. Playwright is already installed at line 152. This is a 1-line fix that re-enables 105 submenu regression checks.

2. **BUG-RUNTIME-001 was a false positive** caused by GitHub raw markdown rendering stripping template literal content. I verified against actual source code via git clone — Metrika, SITE_CONFIG, and all legacy runtime are fully present.

3. **PROJECT_REGISTRY.md and NEXT_AGENT_PROMPT.md need HEAD sync** — both are 6-8 commits behind. This is a documentation-only fix.

4. **AUDIT_HISTORY.md (191KB)** was flagged as stale by Pass 62 but not archived. Per CLEANUP_RETENTION_POLICY §3.2, it should be demoted to `archive/stale/` rather than deleted.

5. **No runtime bugs found** — the project is in good shape at the runtime level. All issues are in CI configuration, documentation, and minor code quality.
