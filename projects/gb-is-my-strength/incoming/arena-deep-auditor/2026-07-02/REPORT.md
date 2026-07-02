# Agent Work Report

## Meta
- Project: gb-is-my-strength (gospod-bog.ru)
- Source repo: https://github.com/FedorMilovanov/gb-is-my-strength
- Agent: arena-deep-auditor
- Date: 2026-07-02
- Audited branch: main
- Audited SHA: d5d9388b (HEAD at clone time)
- Current HEAD: d5d9388b
- Mode: free-intake (deep code audit — bugs, inaccuracies, stale checks, under-refactoring)

---

## 1. New Findings

### NEW-01 — P1: floating-cluster-controller.js — 38 addEventListener, 0 removeEventListener, нет destroy()
- **Severity:** P1
- **Category:** Runtime memory leak
- **Route/files:** `js/floating-cluster-controller.js` (1466 lines, 59KB)
- **Evidence:**
  ```bash
  $ grep -c 'addEventListener' js/floating-cluster-controller.js
  38
  $ grep -c 'removeEventListener' js/floating-cluster-controller.js
  0
  $ grep -n 'destroy\|cleanup\|dispose\|teardown' js/floating-cluster-controller.js
  (0 results)
  ```
- **Root cause:** Unlike `map-engine.js` (which was fixed in r157 with `destroy()` + `_cleanupAll()`), the floating-cluster-controller has ZERO cleanup mechanism. All 38 event listeners are leaked on every page that loads the controller.
- **Impact:** On long browsing sessions (the site is a library — users read multiple articles), accumulated listeners cause growing memory consumption and potential event handler duplication. Combined with 6 setInterval/setTimeout calls (also balanced 6/6 with clearTimeout but only within scope, no full teardown).
- **Confidence:** high
- **Suggested repair lane:** `lane/floating-cluster-cleanup` — dedicated lane per AGENTS.md §3.10 explicit forbid: "Split or refactor floating-cluster-controller.js without dedicated lane."
- **Not mixed with:** PremiumControls positioning/visual changes (separate lane, 14-day freeze).

---

### NEW-02 — P1: PageHead component duplication — 39 files, ~11000 lines, 92-93% copy-paste
- **Severity:** P1 (maintainability / regression surface)
- **Category:** Under-refactoring / code duplication
- **Route/files:** All 39 `*PageHead.astro` files across `src/components/`
- **Evidence:**
  ```bash
  $ find src/components -name "*PageHead*" | wc -l
  39
  # All BaptistyRossii article PageHeads: identical structure, only title/description/canonical/image differ
  $ wc -l src/components/baptisty-rossii/BaptistyRossii*PageHead.astro
  # All 20 lines each (except BaptistyRossiiPageHead at 28)
  
  # Gill parts 1/2/3: 310/310/309 lines — differ only in title/description/canonical/dates
  $ diff <(head -30 src/components/article-pilots/gill-part1/GillPart1PageHead.astro) \
         <(head -30 src/components/article-pilots/gill-part2/GillPart2PageHead.astro)
  # Only 4 lines differ (title, description, canonical, dates)
  
  # Nagornaya PageHeads: 339-387 lines each (5 chast + index + istochniki + nakhodki + seriya)
  # Total: ~3500 lines of Nagornaya head markup
  
  # Source-confirmed TODO:
  $ grep -rn 'TODO' src/components/baptisty-rossii/BaptistyRossiiPageHead.astro
  # TODO: Extract shared BasePageHead component to reduce 92-93% copy-paste
  ```
- **Impact:** Any CSP/SEO/meta change must be replicated across 39 files. If one file is updated but others are missed → inconsistency. This already happened: Gill Part 1 has `content="2026-05-31T01:05:00+03:00">` (no space before `>`) while Part 2 has `content="2026-05-31T01:05:00+03:00" />` (space before `/>`) — cosmetic but shows copy-paste divergence.
- **Confidence:** high
- **Suggested repair lane:** `lane/pagehead-base-component` — create a single `BasePageHead.astro` accepting props (title, description, canonical, ogImage, ogType, publishedTime, modifiedTime, seriesId) and replace all 39 instances.
- **Not mixed with:** Any visual/route migration work.

---

### NEW-03 — P2: AGENTS.md §4.2 !important documentation significantly out of sync with reality
- **Severity:** P2 (documentation drift / audit mismatch)
- **Category:** Stale documentation / inaccurate checks
- **Route/files:** `AGENTS.md` §4.2 vs `css/home.css`, `css/mobile-hotfix.css`, `css/nagornaya-mobile-toc.css`
- **Evidence:**
  ```bash
  # AGENTS.md §4.2 documents:
  # home.css: 20
  # mobile-hotfix.css: 74
  # nagornaya-mobile-toc.css: 122
  
  # Actual counts (grep -o '!important' file | wc -l):
  $ grep -o '!important' css/home.css | wc -l        → 36   (documented: 20, +80%)
  $ grep -o '!important' css/mobile-hotfix.css | wc -l → 142  (documented: 74, +92%)
  $ grep -o '!important' css/nagornaya-mobile-toc.css | wc -l → 135  (documented: 122, +11%)
  $ grep -o '!important' css/site.css | wc -l         → 202  (documented: 202, ✅ matches)
  ```
- **Root cause:** AGENTS.md §4.2 table was last accurate at a previous point. Subsequent changes to home.css (+16), mobile-hotfix.css (+68!), nagornaya-mobile-toc.css (+13) were not reflected in documentation.
- **Impact:** Agents relying on AGENTS.md for !important budgets will make incorrect decisions. The IMPORTANT_CEIL in audit-pro.js (202) only guards site.css; other files have NO automated ceiling.
- **Confidence:** high
- **Suggested repair lane:** Update AGENTS.md §4.2 table with actual counts. Consider adding IMPORTANT ceilings for home.css (currently 36), mobile-hotfix.css (142), nagornaya-mobile-toc.css (135) in audit-pro.js.

---

### NEW-04 — P2: css/premium-controls.css listed in AGENTS.md §2 but doesn't exist on disk
- **Severity:** P2 (architecture documentation mismatch)
- **Category:** Missing file / stale documentation
- **Route/files:** `AGENTS.md` §2, `css/` directory
- **Evidence:**
  ```bash
  # AGENTS.md §2 says:
  # css/  ← РОВНО 8 ФАЙЛОВ
  # css/premium-controls.css ← копия канонического источника src/styles/premium-controls.css
  
  # Reality:
  $ ls css/
  command-palette.css  floating-cluster.css  home.css  mobile-hotfix.css
  nagornaya-mobile-toc.css  site-layered.css  site.css
  # = 7 files, no premium-controls.css
  
  # Source exists but is orphaned:
  $ ls src/styles/premium-controls.css
  src/styles/premium-controls.css  (8889 bytes)
  
  # Not referenced anywhere in production:
  $ grep -rn 'premium-controls.css' css/ sw.js scripts/ src/
  (0 results)
  
  # Not in SW precache:
  $ grep 'premium-controls' sw.js
  (0 results)
  
  # Not in audit-pro ALLOWED_CSS:
  $ grep 'premium-controls' scripts/audit-pro.js
  (0 results)
  ```
- **Impact:** AGENTS.md says 8 CSS files, reality is 7. New agents following AGENTS.md will be confused. The src/styles/premium-controls.css exists but is never copied to css/ — it's dead code in src/styles/.
- **Confidence:** high
- **Suggested repair lane:** Either (a) remove `css/premium-controls.css` from AGENTS.md §2 and update count to 7, or (b) create the copy from src/styles/premium-controls.css and wire into SW precache + audit-pro. Decision needed from owner.

---

### NEW-05 — P2: search.js te() — wrong depth calculation for paths without trailing slash
- **Severity:** P2
- **Category:** Runtime bug (latent)
- **Route/files:** `js/search.js`, function `te()`
- **Evidence:** (Re-confirmed from DEEP_CODE_AUDIT_2026-06-30.md — still present on current HEAD d5d9388b)
- **Root cause:** `/articles/foo` (without trailing slash) → depth=1 → `'../'` instead of `'../../'` → pagefind.js loaded from wrong relative path → search breaks.
- **Mitigation:** All pages on the site are generated with trailing slash by Astro, so this doesn't manifest in production currently.
- **Risk:** If any future page or external link omits trailing slash, search silently breaks.
- **Confidence:** high (already known, re-verified still open)
- **Suggested repair lane:** Add `if (!p.endsWith('/')) p += '/'` normalization before slash counting in `te()`.

---

### NEW-06 — P3: data-gill-current-part attribute generated in HTML but never consumed by JS
- **Severity:** P3 (dead markup)
- **Category:** Stale attribute / under-refactoring artifact
- **Route/files:** `src/components/article-pilots/gill-series/GillSeriesOverlay.astro`
- **Evidence:** (Re-confirmed from DEEP_CODE_AUDIT_2026-06-30.md — still present)
  ```
  data-gill-current-part="true" is generated by Astro on <a> elements,
  but floating-cluster-controller.js uses only .is-current class.
  ```
- **Suggested repair lane:** Either use the attribute as an alternative selector in JS, or remove from Astro template.

---

### NEW-07 — P3: assetUrl() / ASSET_VERSIONS — dead TypeScript export
- **Severity:** P3 (dead code)
- **Category:** Under-refactoring / dead export
- **Route/files:** `src/lib/asset-version.js`
- **Evidence:** (Re-confirmed from DEEP_CODE_AUDIT_2026-06-30.md)
  ```bash
  $ grep -rn 'asset-version' src/
  # 493 ?v= references in 401 Astro components are all hardcoded manually
  # assetUrl() is exported but never imported by any component
  ```
- **Impact:** `cache-bust.js` updates `?v=` links via sed/regex, completely bypassing the TypeScript-typed API. The export exists in dead code.
- **Suggested repair lane:** Owner decision needed — either integrate `assetUrl()` into all components or remove the dead export.

---

### NEW-08 — P3: openSearch() — 7 legacy selectors, most don't match any current HTML
- **Severity:** P3 (dead code / minor performance)
- **Category:** Stale selectors
- **Route/files:** `js/floating-cluster-controller.js`, function `openSearch()`
- **Evidence:** (Re-confirmed from DEEP_CODE_AUDIT_2026-06-30.md)
  - 7 fallback selectors (`#searchToggle`, `#searchButton`, `#hCpBtnNav` etc.)
  - Only `[data-gbs2-search]` is actually used in current HTML
  - The rest are leftover from previous UI iterations
- **Suggested repair lane:** Reduce to 2-3 active selectors + CustomEvent fallback.

---

### NEW-09 — P3: highlights.js — no confirmation/undo before deleting saved quote
- **Severity:** P3 (UX)
- **Category:** Missing safety mechanism
- **Route/files:** `js/highlights.js`
- **Evidence:** (Re-confirmed from DEEP_CODE_AUDIT_2026-06-30.md)
- **Impact:** Accidental tap deletes saved quote permanently with no recovery path.
- **Suggested repair lane:** Add `confirm()` or toast-with-undo.

---

### NEW-10 — S0: AGENTS.md §2 CSS count states "5 CSS + 1 font" in one place and "8 CSS" in another
- **Severity:** S0 (documentation inconsistency)
- **Category:** Internal documentation conflict
- **Route/files:** `AGENTS.md` §0 ("5 CSS + 1 шрифтовой + 11 JS"), §2 ("РОВНО 8 ФАЙЛОВ"), §2 table (lists 7 actual + 1 missing)
- **Evidence:**
  - §0 says: "Создавать новые CSS/JS файлы. Архитектурный максимум: 5 CSS + 1 шрифтовой + 11 JS"
  - §2 says: "css/ ← РОВНО 8 ФАЙЛОВ. БОЛЬШЕ НЕ СОЗДАВАТЬ."
  - §2 table lists: site.css, home.css, command-palette.css, mobile-hotfix.css, nagornaya-mobile-toc.css, floating-cluster.css, premium-controls.css (MISSING), site-layered.css = 7 on disk + 1 phantom
  - JS count: §0 says 11, §2 says 12 files + modules/
  - Actual JS: 12 files (site.js, site-utils.js, scroll-perf.js, search.js, enhancements.js, highlights.js, glossary.js, bookmark-engine.js, series-cards.js, nagornaya-mobile-toc.js, sw-register.js, floating-cluster-controller.js) + modules/back-to-top.js
- **Suggested repair lane:** Reconcile counts. Update §0 to match §2 (8 CSS, 12 JS + modules/). Remove phantom premium-controls.css or create it.

---

### NEW-11 — S0: AGENTS.md §12.5.7 duplicated — appears twice verbatim
- **Severity:** S0 (document quality)
- **Category:** Copy-paste error in AGENTS.md
- **Route/files:** `AGENTS.md`
- **Evidence:**
  ```bash
  $ grep -n '### 12.5.7 Статус извлечения' AGENTS.md
  # Section 12.5.7 appears twice (after 12.5.6 and again after second 12.5.6)
  # The entire block from "### 12.5.7" to the closing code fence is duplicated
  ```
- **Impact:** Agents reading AGENTS.md encounter confusing repeated content.
- **Suggested repair lane:** Remove the duplicate §12.5.7 block.

---

### NEW-12 — S0: AGENTS.md version numbering conflicts — r300-r308 overlap with r260-r282
- **Severity:** S0 (document quality / changelog integrity)
- **Category:** Changelog numbering conflict
- **Route/files:** `AGENTS.md` changelog table
- **Evidence:**
  - r300 appears TWICE: once as "PremiumControls reconciliation (2026-06-27)" and once as "(was duplicate of r282)" for "Gill Phase G11"
  - r301 appears TWICE: "External checks registry" and "(was duplicate of r293)"
  - r302: "External checks wave 2" and "(was duplicate of r282)" 
  - r303-r308: Each appears twice — once for external checks wave 3+ and once as "(was duplicate of rNNN)" for Gill phases
- **Impact:** Machine-parseable changelog is corrupted. Any automation reading AGENTS-rNNN markers will get confused.
- **Suggested repair lane:** Resolve numbering conflicts. Use unique sequential numbers. Move historical duplicates to archive section or annotate clearly without reusing numbers.

---

## 2. Confirmations of Existing Findings

### Confirm DEEP_AUDIT-P2-01 (search.js te() depth)
- **Target report:** `audit/DEEP_CODE_AUDIT_2026-06-30.md` — P2 search.js te()
- **My evidence:** Re-verified on HEAD d5d9388b — the fix was NOT applied. `js/search.js` is minified (1 line, 12KB). The depth calculation still lacks trailing-slash normalization.
- **Recommended status:** confirmed-current

### Confirm DEEP_AUDIT-P2-02 (data-gill-current-part unused)
- **Target report:** `audit/DEEP_CODE_AUDIT_2026-06-30.md` — P2 data-gill-current-part
- **My evidence:** Re-verified on HEAD d5d9388b.
- **Recommended status:** confirmed-current

### Confirm DEEP_AUDIT-P2-03 (assetUrl() dead export)
- **Target report:** `audit/DEEP_CODE_AUDIT_2026-06-30.md` — P2 assetUrl()
- **My evidence:** Re-verified on HEAD d5d9388b.
- **Recommended status:** confirmed-current

### Confirm DEEP_AUDIT-P3-01 (openSearch() stale selectors)
- **Target report:** `audit/DEEP_CODE_AUDIT_2026-06-30.md` — P3 openSearch()
- **My evidence:** Re-verified on HEAD d5d9388b.
- **Recommended status:** confirmed-current

### Confirm DEEP_AUDIT-P3-02 (highlights.js no undo)
- **Target report:** `audit/DEEP_CODE_AUDIT_2026-06-30.md` — P3 highlights.js
- **My evidence:** Re-verified on HEAD d5d9388b.
- **Recommended status:** confirmed-current

---

## 6. Repair Lane Suggestions

| Bug IDs | Lane | Why together | What must NOT be mixed |
|---|---|---|---|
| NEW-01 | `lane/floating-cluster-cleanup` | Requires dedicated lane per AGENTS.md §3.10 | Any PremiumControls visual/positioning changes |
| NEW-02 | `lane/pagehead-base-component` | Large structural refactor touching 39 files | Any route migration or visual changes |
| NEW-03, NEW-04, NEW-10, NEW-11, NEW-12 | `lane/agents-md-reconciliation` | All are documentation accuracy fixes | Code changes |
| NEW-05 | `lane/search-depth-fix` | Small targeted fix in minified search.js | Other search changes |
| NEW-06, NEW-07, NEW-08, NEW-09 | `lane/js-dead-code-cleanup` | All minor JS cleanups | PremiumControls, GBS2 core |

---

## 7. Reverify Notes

| Bug | Source | Current HEAD | Result | Evidence |
|---|---|---|---|---|
| search.js te() depth | DEEP_CODE_AUDIT | d5d9388b | confirmed-current | Minified file unchanged |
| data-gill-current-part | DEEP_CODE_AUDIT | d5d9388b | confirmed-current | GillSeriesOverlay.astro still emits attribute |
| assetUrl() dead export | DEEP_CODE_AUDIT | d5d9388b | confirmed-current | 0 imports found |
| openSearch() stale selectors | DEEP_CODE_AUDIT | d5d9388b | confirmed-current | 7 selectors in minified code |
| highlights.js no undo | DEEP_CODE_AUDIT | d5d9388b | confirmed-current | No confirm/undo in minified code |
| floating-cluster memory leak | NEW | d5d9388b | confirmed-current | 38 add / 0 remove |

---

## 8. Notes for Verifier

### Priority matrix

| ID | Severity | Actionability | Risk if not fixed |
|---|---|---|---|
| NEW-01 | P1 | Medium (needs dedicated lane) | Memory leak on long sessions |
| NEW-02 | P1 | High (clear fix path) | CSP/meta inconsistency surface |
| NEW-03 | P2 | Low (doc update) | Agent confusion |
| NEW-04 | P2 | Medium (owner decision needed) | Architecture docs wrong |
| NEW-05 | P2 | Low (minified file) | Latent search breakage |
| NEW-06 | P3 | Low | Dead markup |
| NEW-07 | P3 | Medium (owner decision) | Dead API |
| NEW-08 | P3 | Low | Dead selectors |
| NEW-09 | P3 | Low | UX papercut |
| NEW-10 | S0 | Low | Documentation confusion |
| NEW-11 | S0 | Low | Document quality |
| NEW-12 | S0 | Medium | Changelog integrity |

### Additional observations (not filed as bugs)

1. **karty/_engine/modules/ directory** — AGENTS.md §12.5.1 says "мёртвый код (не использовать)". Directory confirmed empty/non-existent on HEAD. Documentation accurate.

2. **JS files are minified** — Most js/ files (bookmark-engine.js, enhancements.js, glossary.js, highlights.js, nagornaya-mobile-toc.js, scroll-perf.js, search.js, series-cards.js, site-utils.js, sw-register.js) are single-line minified files. Only `floating-cluster-controller.js` (1466 lines) and `site.js` (577 lines of which most is minified content) retain readability. This makes auditing and fixing bugs in these files significantly harder.

3. **SW cache naming** — CACHE_VERSION is `gb-v182-gill-toc-actions-20260702` — appears up-to-date as of current HEAD.

4. **Brace balance** — Both css/site.css and css/home.css have balanced braces (0). This was fixed per AGENTS-r257.

5. **No http:// mixed content** — No insecure links found in legacy HTML files.

6. **No eval()** — No eval() or Function() constructors found in any js/ file.
