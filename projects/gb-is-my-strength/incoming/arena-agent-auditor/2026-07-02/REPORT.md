# Agent Work Report — gb-is-my-strength deep audit

## Meta
- **Project:** gb-is-my-strength (gospod-bog.ru)
- **Source repo:** FedorMilovanov/gb-is-my-strength
- **Audit repo:** FedorMilovanov/AuditRepo
- **Agent:** arena-agent-auditor
- **Date:** 2026-07-02
- **Audited branch:** main
- **Audited SHA:** `d5d9388b56a96ea26fe1c1309b07d6c4e2534f9b`
- **Current HEAD:** same
- **Mode:** free-intake, current-head

---

## Executive summary

All local gates (`audit-pro`, `validate:static-publication:light`, `workflows:check`, `data:consistency`, `migration:metadata:check`, `gill:mobile-play:smoke`, `gill:mobile-layout:audit`, `audit:premium-controls`) **PASS** on current HEAD. CI is green.

However, a thin pass does **not** mean the project is bug-free. The audit found:
- **1 P1 functional/operational risk** in Service Worker / Pagefind precache ordering.
- **1 P1 maintainability risk** from hand-managed `CACHE_VERSION` in `sw.js`.
- **Multiple P2/P3 weaknesses** in check coverage (legacy-only validator, TODOs in audit scripts, hardcoded route contracts, inconsistent title/og:title).
- **Confirmed/updated** several items from `AuditRepo/projects/gb-is-my-strength/verified/CURRENT_HEAD_CANONICAL_LEDGER_2026-06-27.md` as still open on newer HEAD `d5d9388b`.

No exploitable security vulnerabilities (XSS, eval, secret leaks) were found.

---

## 1. New findings

### P1-01 — SW precache entry `/pagefind/pagefind.js` missing from dist unless `pagefind:build:dist` runs first

- **Severity:** P1
- **Category:** build/deploy / Service Worker
- **Route/files:** `sw.js`, `scripts/sw-dist-readiness-audit.js`, `scripts/build-pagefind.js`, `deploy.yml`
- **Status:** `confirmed-current`
- **Evidence:**
  ```bash
  npm run strangler:build:production-like   # does NOT run pagefind:build:dist
  npm run sw:dist:audit:deploy-switch
  ```
  Output:
  ```
  ❌ PRECACHE_ASSETS entry missing in dist: /pagefind/pagefind.js
  ```
- **Root cause:** `validate:static-publication` does **not** include `sw:dist:audit:deploy-switch`. The only gate that catches this is the **deploy workflow itself**, which runs `pagefind:build:dist` *before* the SW audit. A local developer running the documented pre-push gate (`npm run validate:static-publication`) will see green while the deploy artifact is actually inconsistent.
- **Impact:** If CI step order is ever changed, or if a developer changes `sw.js` PRECACHE_ASSETS and only runs the static gate, the deployed SW will fail to precache Pagefind bootstrap → search offline-first behavior breaks.
- **Suggested repair lane:** `lane/system-sw-gate-coupling`
- **Repair direction:** Add `npm run sw:dist:audit:deploy-switch` (or a lighter `sw:dist:audit:pagefind`) to `validate:static-publication` / `validate:static-publication:light`, guarded by a prior `pagefind:build:dist` step; OR make `sw-dist-readiness-audit.js` skip the precache-existence check when running against source (not dist).
- **Do not mix with:** P1-02 (CACHE_VERSION automation).

---

### P1-02 — `CACHE_VERSION` in `sw.js` is hand-edited; `cache-bust.js` does not update it

- **Severity:** P1
- **Category:** caching / maintainability
- **Route/files:** `sw.js`, `scripts/cache-bust.js`, `scripts/cache-bust-assets.js`
- **Status:** `confirmed-current`
- **Evidence:**
  ```bash
  grep -n "CACHE_VERSION\|cache_name\|sw.js" scripts/cache-bust.js
  # → no matches
  git log --oneline -5 sw.js
  # → 2f65c2e7 ... SW cache bump
  # → 8aa0fb27 fix(remaining): close 6 open issues from deep audit
  # → cc336d5e fix(deploy): Patch 5 — ... SW cache bump
  ```
  `sw.js` line 1 contains `var CACHE_VERSION="gb-v182-gill-toc-actions-20260702"`.
- **Root cause:** Cache-bust only rewrites `?v=HASH` in HTML/Astro; it never bumps the SW cache name. Every cache invalidation relies on a human remembering to edit `sw.js` and pick a unique version string.
- **Impact:** Stale CSS/JS assets can be served from old SW caches even after HTML hashes change, because the static cache key only changes when `CACHE_VERSION` changes.
- **Suggested repair lane:** `lane/system-sw-automation`
- **Repair direction:** Make `cache-bust.js` derive and rewrite `CACHE_VERSION` from a content hash of the asset set (e.g., `gb-v${hash}-${date}`) and keep `CACHE_VERSION` as the single source of truth for cache invalidation.
- **Do not mix with:** P1-01 (step ordering).

---

### P2-01 — `scripts/validate.js` audits only legacy `articles/` folder, not Astro production routes

- **Severity:** P2
- **Category:** weak check / outdated coverage
- **Route/files:** `scripts/validate.js`, `src/pages/**/*.astro`, `src/content/articles/**/*.mdx`
- **Status:** `confirmed-current`
- **Evidence:**
  ```js
  // scripts/validate.js:43-44
  const ARTICLES  = path.resolve(__dirname, '../articles');
  const CSS_DIR   = path.resolve(__dirname, '../css');
  ```
  `validateArticle(slug)` is called for every directory under `../articles/` (10 legacy fallback files). It never reads `src/content/articles/` or `src/pages/`.
- **Root cause:** Validator was written before the Astro migration. It now only checks the rollback/source layer, while production output is generated from MDX/Astro.
- **Impact:** Many contract checks (canonical, og:image, byline, JSON-LD, duplicate IDs, image alt, `<h1>` count, FAQPage/accordion parity, inline style breakpoints) are **not enforced** on the pages that actually deploy. `audit-pro.js` and `content:parity` cover some of this, but the semantic checks in `validate.js` (e.g., FAQPage vs accordion) have no Astro equivalent.
- **Suggested repair lane:** `lane/system-validator-astro`
- **Repair direction:** Run `validate.js` against the production-like `dist/**/*.html` (after `strangler:build:production-like` + `pagefind:build:dist`) in addition to, or instead of, the legacy `articles/` tree; or split checks into source-layer and dist-layer validators.

---

### P2-02 — `scripts/cache-bust-assets.js` omits `css/site-layered.css`

- **Severity:** P2
- **Category:** cache-bust / incomplete asset list
- **Route/files:** `scripts/cache-bust-assets.js`, `css/site-layered.css`
- **Status:** `confirmed-current`
- **Evidence:**
  ```js
  // scripts/cache-bust-assets.js ASSETS list has 7 CSS/JS/font files
  // 'css/site-layered.css' is NOT present
  ```
  `css/site-layered.css` exists (283706 bytes) and is referenced by `scripts/css-layer-validator.js` and `scripts/generate-route-profiles.js` as the layered-CSS pilot.
- **Root cause:** `site-layered.css` is treated as a pilot/audit artifact, not a live asset, but it is still a committed CSS file. If it is ever promoted to production, its hash will not be propagated.
- **Impact:** If `site-layered.css` becomes a production link, users will get stale CSS or 404s because cache-bust and `astro-cache-bust-postbuild.js` ignore it.
- **Suggested repair lane:** `lane/system-cache-bust`
- **Repair direction:** Either (a) add `css/site-layered.css` to `ASSETS` now (idempotent if unused), or (b) explicitly mark it as non-production and add an audit-pro check that forbids `<link href="css/site-layered.css">` in dist without an accompanying `ASSETS` entry.

---

### P2-03 — `AGENTS.md` §2 claims 8 CSS files including `css/premium-controls.css`, but only 7 exist

- **Severity:** P2
- **Category:** documentation / inventory drift
- **Route/files:** `AGENTS.md`, `css/`
- **Status:** `confirmed-current`
- **Evidence:**
  ```bash
  ls css/*.css | wc -l   # 7
  grep -n "premium-controls.css" AGENTS.md
  # → referenced in §2 architecture inventory
  ```
  Actual files: `site.css`, `home.css`, `command-palette.css`, `mobile-hotfix.css`, `nagornaya-mobile-toc.css`, `floating-cluster.css`, `site-layered.css`.
- **Root cause:** Canonical runtime CSS is `css/floating-cluster.css`; `css/premium-controls.css` was removed or never created. AGENTS.md inventory was not reconciled.
- **Impact:** New agents may create a second `premium-controls.css` file thinking it is required, violating the 7/8-file limit and duplicating delivery (regression PC-004).
- **Suggested repair lane:** `lane/system-agents-sync`
- **Repair direction:** Update AGENTS.md to list exactly the 7 existing CSS files and state that `premium-controls.css` is retired/superseded by `floating-cluster.css`. Add an audit-pro check that fails if `css/premium-controls.css` appears.
- **See also:** AuditRepo canonical ledger PC-CURRENT-04.

---

### P2-04 — Hardcoded route contracts in `scripts/visual-parity-contract.js`

- **Severity:** P2
- **Category:** under-refactoring / tech debt
- **Route/files:** `scripts/visual-parity-contract.js`
- **Status:** `confirmed-current`
- **Evidence:**
  ```js
  /* scripts/visual-parity-contract.js line 2 */
  /* TODO: move route contracts to data/visual-route-contracts.json */
  ```
- **Root cause:** Route visual contracts are encoded in JS, making them hard to discover and version.
- **Impact:** Route ownership/migration metadata lives in multiple places (`page-ownership.json`, `route-migration-matrix.json`, route profiles, visual-parity-contract.js). Drift is likely as the site grows.
- **Suggested repair lane:** `lane/system-route-contracts`
- **Repair direction:** Extract contracts to `data/visual-route-contracts.json` and make `visual-parity-contract.js` consume it.

---

### P2-05 — `scripts/check-content-source-coverage.js` uses hardcoded exclusions

- **Severity:** P2
- **Category:** under-refactoring / weak check
- **Route/files:** `scripts/check-content-source-coverage.js`
- **Status:** `confirmed-current`
- **Evidence:**
  ```js
  // scripts/check-content-source-coverage.js:2
  // TODO: replace hardcoded exclusions with route-profile fields: contentSourceMode, renderSource, searchPolicy, profileRequired
  ```
- **Root cause:** Content-source coverage rules are not data-driven.
- **Impact:** Adding a new route type requires editing this script; the check cannot express per-route policy.
- **Suggested repair lane:** `lane/system-route-profiles`
- **Repair direction:** Add the listed fields to route profiles and rewrite the checker to use them.

---

### P2-06 — `scripts/check-route-migration-matrix.js` uses blanket exclusion instead of per-route status

- **Severity:** P2
- **Category:** under-refactoring / weak check
- **Route/files:** `scripts/check-route-migration-matrix.js`
- **Status:** `confirmed-current`
- **Evidence:**
  ```js
  // scripts/check-route-migration-matrix.js:138
  // TODO: replace blanket exclusion with per-route matrix status + reason+SHA
  ```
- **Root cause:** Excluded routes (Nagornaya, Gill, hard-texts, etc.) are skipped wholesale.
- **Impact:** The matrix cannot enforce mode-specific rules on excluded routes, and the reason for exclusion is not machine-readable.
- **Suggested repair lane:** `lane/system-migration-matrix`

---

### P2-07 — `scripts/interactive-audit.js` header TODO claims uncovered areas

- **Severity:** P2
- **Category:** outdated check / coverage gap
- **Route/files:** `scripts/interactive-audit.js`
- **Status:** `confirmed-current / needs reverify`
- **Evidence:**
  ```js
  /* scripts/interactive-audit.js:3 */
  /* TODO: gill-v16 | gbs2-baptisty | gbs2-hard-texts | astro-series */
  ```
  The file does include Gill routes and some baptisty routes, but the TODO itself is misleading and may hide real gaps for hard-texts GBS2 series and baptisty GBS2 runtime checks.
- **Impact:** Future agents may trust the TODO and skip adding coverage; alternatively they may duplicate coverage already present.
- **Suggested repair direction:** Audit the actual coverage matrix, remove the TODO if covered, or split remaining gaps into explicit issue items.

---

### P3-01 — `<title>` and `og:title` differ on two articles

- **Severity:** P3
- **Category:** content / SEO inconsistency
- **Route/files:** `articles/20-antisovetov-pastoru/index.html`, `articles/rimlyanam-7-veruyushchiy-ili-neveruychiy/index.html`
- **Status:** `confirmed-current`
- **Evidence:**
  ```
  [20-antisovetov-pastoru] <title> ≠ og:title
     <title>: "20 антисоветов пастору: как разрушить служение"
     og:title: "20 антисоветов, как пастору разрушить своё служение"
  [rimlyanam-7-...] <title> ≠ og:title
     <title>: "Римлянам 7: верующий или неверующий?"
     og:title: "Римлянам 7: верующий, неверующий или человек под законом?"
  ```
- **Root cause:** These are fallback legacy files; Astro-generated dist likely has the same inconsistency. `validate.js` treats it as a warning, not an error.
- **Impact:** Social-share snippet may differ from browser tab / search result title. Minor SEO inconsistency.
- **Suggested repair lane:** `lane/content-title-sync`

---

### P3-02 — Non-blocking H1/title drift registered by `content:guard` and `contract:compare`

- **Severity:** P3
- **Category:** content drift / baseline maintenance
- **Route/files:** `data/public-content-baseline.json`, generated dist
- **Status:** `confirmed-current`
- **Evidence:**
  ```
  content:guard: H1 changed for /articles/dzhon-gill-chast-1-chelovek/
  contract:compare: title changed for /articles/20-antisovetov-pastoru/, /articles/kod-da-vinchi/, /articles/rimlyanam-7-...
  ```
- **Root cause:** Baseline was captured before Gill H1 enrichment and title tuning.
- **Impact:** Warnings are noisy but not blocking. Baseline should be regenerated (`npm run content:baseline`) after owner confirms the new titles/H1s are intentional.
- **Suggested repair lane:** `lane/content-baseline-refresh`

---

## 2. Confirmations of existing canonical-ledger items

### C-01 — BaptistyRossii PageHead copy-paste (canonical ledger P2)

- **Status:** `confirmed-current` on `d5d9388b`
- **Evidence:**
  ```astro
  <!-- src/components/baptisty-rossii/BaptistyRossiiPageHead.astro -->
  /**
   * TODO: Extract shared BasePageHead component to reduce 92-93% copy-paste
   * across 11 BaptistyRossii PageHead files.
   */
  ```
  Count of Baptisty PageHead components:
  ```bash
  ls src/components/baptisty-rossii/*PageHead*.astro | wc -l
  # → 11
  ```
- **Recommended action:** Create `src/components/shared/BasePageHead.astro` (or per-section `BaseSeriesPageHead.astro`) and migrate the 11 files. Track in `lane/system-baptisty-head-refactor`.

### C-02 — Floating-cluster CSS inventory decision unresolved (PC-CURRENT-04)

- **Status:** `confirmed-current` on `d5d9388b`
- **Evidence:** `css/premium-controls.css` does not exist; AGENTS.md still mentions it; `css/floating-cluster.css` is the deployed runtime.
- **Recommended action:** Resolve with P2-03 (AGENTS sync + audit guard).

### C-03 — Dead CSS custom properties (29) and empty @media blocks (6)

- **Status:** `confirmed-current`
- **Evidence:** Reported by `audit-pro.js` as INFO-level acceptable debt.
- **Note:** Not blocking, but contributes to the 283 KB `site.css` size and the 444 KB total CSS budget warning.

---

## 3. Weaknesses / stale checks observed

| Check | What it does | What it misses | Risk |
|---|---|---|---|
| `validate.js` | Audits legacy `articles/` HTML | Astro/MDX production routes | P2-01 |
| `validate:static-publication` | Runs root gates + route visual audits | Does **not** run `sw:dist:audit:deploy-switch` | P1-01 |
| `cache-bust.js` | Rewrites `?v=` hashes | Does **not** bump `CACHE_VERSION` in `sw.js` | P1-02 |
| `cache-bust-assets.js` | Shared asset list | Omits `css/site-layered.css` | P2-02 |
| `interactive-audit.js` | Runtime interactive checks | Header TODO claims gaps | P2-07 |
| `visual-parity-contract.js` | Route visual contracts | Hardcoded in JS | P2-04 |
| `check-content-source-coverage.js` | Content-source coverage | Hardcoded exclusions | P2-05 |
| `check-route-migration-matrix.js` | Migration mode coherence | Blanket exclusions | P2-06 |
| `content:guard` / `contract:compare` | Baseline drift detection | Non-blocking warnings not auto-refreshed | P3-02 |

---

## 4. Under-refactoring / tech-debt clusters

1. **PageHead duplication:** 11 Baptisty PageHead files + similar patterns likely exist for other series. Canonical ledger already flags Baptisty; a wider grep would probably reveal Nagornaya/Gill/Hard-texts duplication.
2. **Route contract scattering:** `page-ownership.json`, `route-migration-matrix.json`, route profiles, visual-parity-contract.js, content-source-coverage.js all encode overlapping route policy.
3. **Legacy `articles/` fallback tree:** 10 legacy HTML files are kept as source/rollback layer but are not the deployed output. Their drift from Astro-generated dist is only partially checked (`content:parity`).
4. **Holding map pages:** 8 `/karty/*/` routes are Astro-owned holding pages. They are reachable but noindex. This is intentional but creates maintenance surface.
5. **Astro check hints:** 13 hints (unused vars, `is:inline` suggestions) are non-blocking but indicate incomplete cleanup.

---

## 5. Severity proposals / status flips

| Item | Proposed status | Reason |
|---|---|---|
| PC-CURRENT-04 CSS inventory | keep `current-open` / escalate to P1 | AGENTS.md still teaches the absent file; risk of duplicate CSS delivery |
| PC-CURRENT-05 malformed transition cleanup | keep `current-open` | `audit:premium-controls` passes, but source inspection still has TODOs and dead rules |
| Baptisty PageHead copy-paste | keep `current-open` P2 | Confirmed on `d5d9388b`; 11 files still duplicate |
| Old 2026-06-25 aggregate bug counts | `stale-on-current-head` | Already superseded by canonical ledger; do not use for planning |
| `workflows:check` `dist:jsonld:audit --root dist` mismatch | `fixed-current` | Confirmed green on `d5d9388b` |

---

## 6. Repair lane suggestions

| Lane | Bugs | Why together | What must NOT be mixed |
|---|---|---|---|
| `lane/system-sw-gate-coupling` | P1-01 | Couples SW readiness to static gate | Route/content changes |
| `lane/system-sw-automation` | P1-02 | Automates CACHE_VERSION | Route/content changes |
| `lane/system-agents-sync` | P2-03, C-02 | Documentation + inventory truth | Code behavior changes |
| `lane/system-cache-bust` | P2-02 | Asset-list integrity | CSS content changes |
| `lane/system-validator-astro` | P2-01 | Extends validator coverage | UI refactors |
| `lane/system-route-contracts` | P2-04, P2-05, P2-06, C-01 | Route metadata consolidation | Content updates |
| `lane/content-title-sync` | P3-01, P3-02 | Content metadata refresh | System/CI changes |

---

## 7. Notes for verifier

- All findings above are reproducible on SHA `d5d9388b56a96ea26fe1c1309b07d6c4e2534f9b` with Node 22.12.0 and the commands shown.
- No browser-only bugs were found because Playwright smoke/layout audits for Gill pass. A wider Playwright pass (interactive-audit, visual-parity-screenshots, konfessii:audit) would be the next level of verification.
- The P1 items are **operational risks**, not current production outages — CI ordering currently masks P1-01. They become outages if CI step order is accidentally changed.
- Several items overlap with the canonical ledger; they are included as confirmations plus fresh evidence on a newer HEAD.

---

## 8. SHA-First Evidence Log

```
SHA: d5d9388b56a96ea26fe1c1309b07d6c4e2534f9b
node: v22.12.0
npm ci: OK
npm run audit-pro.js: PASS (163 passed, 3 warnings, 0 errors)
npm run validate:static-publication:light: PASS (with non-blocking warnings)
npm run gill:mobile-play:smoke: PASS
npm run gill:mobile-layout:audit: PASS
npm run sw:dist:audit:deploy-switch: FAIL without prior pagefind:build:dist
npm run source:links: PASS (16 bot-block warnings)
```
