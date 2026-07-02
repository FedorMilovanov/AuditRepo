# Agent Work Report — COMBINED PASS 1 + PASS 2

## Meta
- Project: gb-is-my-strength (gospod-bog.ru)
- Source repo: https://github.com/FedorMilovanov/gb-is-my-strength
- Agent: arena-deep-auditor
- Date: 2026-07-02
- Audited branch: main
- Audited SHA: d5d9388b
- Current HEAD: d5d9388b
- Mode: free-intake (deep code audit — 2 passes)

---

## 1. New Findings — PASS 1 (Runtime, Architecture, Docs)

### NEW-01 — P1: floating-cluster-controller.js — 38 addEventListener, 0 removeEventListener
- **Severity:** P1
- **Category:** Runtime memory leak
- **Route/files:** `js/floating-cluster-controller.js` (1466 lines, 59KB)
- **Evidence:** `grep -c 'addEventListener' → 38`, `grep -c 'removeEventListener' → 0`, no `destroy()`/`cleanup()`
- **Impact:** Long browsing sessions accumulate leaked listeners
- **Confidence:** high
- **Suggested repair lane:** `lane/floating-cluster-cleanup`

---

### NEW-02 — P1: 39 PageHead components — 92-93% copy-paste (~11k lines)
- **Severity:** P1 (maintainability / regression surface)
- **Route/files:** All 39 `*PageHead.astro` files
- **Evidence:** Gill 1/2/3 differ in only 4 lines (title, desc, canonical, dates). 10 BaptistyRossii = identical 20-line clones.
- **Confidence:** high
- **Suggested repair lane:** `lane/pagehead-base-component`

---

### NEW-03 — P2: AGENTS.md §4.2 !important counts out of sync
- **Severity:** P2
- **Evidence:**
  - home.css: documented 20 → actual 36 (+80%)
  - mobile-hotfix.css: documented 74 → actual 142 (+92%)
  - nagornaya-mobile-toc.css: documented 122 → actual 135 (+11%)
  - site.css: documented 202 → actual 202 ✅

---

### NEW-04 — P2: css/premium-controls.css — phantom file
- **Severity:** P2
- **Evidence:** AGENTS.md §2 lists 8 CSS including `premium-controls.css`. On disk: 7 files. `src/styles/premium-controls.css` exists but is orphaned.

---

### NEW-05 — P2: search.js te() — trailing slash depth bug (latent)
- **Severity:** P2
- **Evidence:** Re-confirmed from DEEP_CODE_AUDIT_2026-06-30.md

---

### NEW-06 — P3: data-gill-current-part — dead attribute
- **Severity:** P3

### NEW-07 — P3: assetUrl() — dead TypeScript export
- **Severity:** P3

### NEW-08 — P3: openSearch() — 7 stale selectors
- **Severity:** P3

### NEW-09 — P3: highlights.js — no undo on quote delete
- **Severity:** P3

### NEW-10 — S0: AGENTS.md CSS count conflict (§0 "5 CSS" vs §2 "8 CSS")
- **Severity:** S0

### NEW-11 — S0: AGENTS.md §12.5.7 duplicated verbatim
- **Severity:** S0

### NEW-12 — S0: AGENTS.md changelog r300-r308 numbering conflicts
- **Severity:** S0

---

## 1b. New Findings — PASS 2 (Data Consistency)

### NEW-13 — P2: series.json field name inconsistency — 'readTime' vs 'readingTime'
- **Severity:** P2
- **Category:** Data schema inconsistency
- **Route/files:** `data/series.json`
- **Evidence:**
  ```bash
  # 23 of 24 series parts use 'readingTime'
  # 1 part uses 'readTime' (wrong field name):
  #   {slug: 'zakon-duha-zhizni-rimlyanam-8', status: 'planned', readTime: 0}
  ```
- **Impact:** Code iterating series parts and accessing `.readingTime` will get `undefined` for the planned Roman 8 article. Any aggregation logic (total series time, progress ring) will silently skip this part.
- **Confidence:** high
- **Suggested repair lane:** `lane/data-consistency-fix` — rename `readTime` → `readingTime` in the planned part

---

### NEW-14 — P2: 17 search-manifest items missing readTime
- **Severity:** P2
- **Category:** Missing data
- **Route/files:** `data/search-manifest.json`
- **Evidence:**
  ```
  17 items missing 'readTime' field, including:
  - ALL 10 baptisty-rossii/* articles
  - 4 landings (/, /articles/, /konfessii/, /nagornaya/)
  - 3 tools/pages
  ```
  The baptisty-rossii HTML files don't have readingTime in SITE_CONFIG at all — they use GBS2 data attributes (`data-gbs2-part-min`) instead. This is by design for legacy shadow-wrap, but the search index still needs readTime for UI display.
- **Impact:** Search/command-palette UI cannot show reading time badges for 17 items (all baptisty-rossii articles appear without "N мин" badge)
- **Confidence:** high
- **Suggested repair lane:** Add `readTime` to all baptisty-rossii items in search-manifest.json (values already exist in series.json)

---

### NEW-15 — P3: Cross-file field naming inconsistency
- **Severity:** P3
- **Category:** Schema naming inconsistency
- **Evidence:**
  | File | Field name |
  |---|---|
  | `data/search-manifest.json` | `readTime` |
  | `data/series.json` (23/24) | `readingTime` |
  | HTML `SITE_CONFIG` | `readingTime` |
- **Impact:** No actual bugs found, but maintenance burden. Any new code must handle both names.
- **Suggested repair lane:** Standardize on `readingTime` across all data files (larger refactor)

---

### NEW-16 — P3: Planned article in series.json with readTime=0 and note
- **Severity:** P3
- **Route/files:** `data/series.json`, hard-texts series, part 3
- **Evidence:**
  ```json
  {"n": 3, "slug": "zakon-duha-zhizni-rimlyanam-8", "title": "Закон духа жизни: Римлянам 8",
   "status": "planned", "readTime": 0, "note": "Не опубликовано; readTime будет заполнен при публикации"}
  ```
- **Impact:** Not a runtime bug (planned articles are correctly excluded from search-manifest). But: (a) wrong field name, (b) readTime=0 means any UI showing series total time will undercount.
- **Suggested repair lane:** Either exclude planned parts from readingTime aggregation, or use a placeholder value

---

## 2. Confirmations of Existing Findings (Re-verified on d5d9388b)

| Source | Finding | Status |
|---|---|---|
| DEEP_CODE_AUDIT_2026-06-30 | search.js te() depth | confirmed-current |
| DEEP_CODE_AUDIT_2026-06-30 | data-gill-current-part unused | confirmed-current |
| DEEP_CODE_AUDIT_2026-06-30 | assetUrl() dead export | confirmed-current |
| DEEP_CODE_AUDIT_2026-06-30 | openSearch() stale selectors | confirmed-current |
| DEEP_CODE_AUDIT_2026-06-30 | highlights.js no undo | confirmed-current |

## 2b. Positive Checks (no issues found)

| Check | Result |
|---|---|
| All 10 karty/*/route.json | ✅ Valid JSON |
| CSS brace balance (site.css, home.css) | ✅ 0 (balanced) |
| eval()/Function() in JS | ✅ 0 occurrences |
| http:// mixed content in HTML | ✅ 0 insecure links |
| SW CACHE_VERSION | ✅ Up-to-date (v182, 20260702) |
| Scheduled workflows | ✅ 3 weekly schedules (Mon 03:30, 03:00, 06:00 UTC) |

---

## 3. Severity Summary

| Severity | Count | Key items |
|---|---|---|
| **P1** | 2 | Memory leak, PageHead duplication |
| **P2** | 5 | !important drift, phantom CSS, search depth, field naming, missing readTime |
| **P3** | 6 | Dead attrs/exports, stale selectors, no undo, cross-file naming |
| **S0** | 3 | Doc conflicts, duplicate section, changelog numbering |
| **TOTAL** | **16** | |

---

## 6. Repair Lane Suggestions

| Bug IDs | Lane | Why together |
|---|---|---|
| NEW-01 | `lane/floating-cluster-cleanup` | Dedicated lane required per §3.10 |
| NEW-02 | `lane/pagehead-base-component` | 39-file structural refactor |
| NEW-03, NEW-04, NEW-10, NEW-11, NEW-12 | `lane/agents-md-reconciliation` | All documentation fixes |
| NEW-05 | `lane/search-depth-fix` | Small targeted fix |
| NEW-06, NEW-07, NEW-08, NEW-09 | `lane/js-dead-code-cleanup` | Minor JS cleanups |
| NEW-13, NEW-14, NEW-15, NEW-16 | `lane/data-consistency-fix` | All data schema alignment |
