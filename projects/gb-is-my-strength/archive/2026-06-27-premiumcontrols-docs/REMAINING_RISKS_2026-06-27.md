# PremiumControls — Remaining Active Risks (2026-06-27)

## 🔴 Independent current-main override — source HEAD `819fd3f1`

This section supersedes earlier "all fixed" wording where it conflicts.

**Latest reconciled source `6664056` status:** PC-CURRENT-01 / BUG-033 / BUG-034 / BUG-035 are fixed or classified as audit drift. PC-CURRENT-02, 03, 04, 05, 06 remain live until fresh source+dist+browser reverify proves closure.

Confirmed active risks after independent reverify. Update: PC-CURRENT-01 is fixed in source `87505f1b`, but kept here as recently-fixed gate context; PC-CURRENT-02..06 remain live:

| ID | Severity | Status | Summary |
|---|---:|---|---|
| PC-CURRENT-01 | P0/P1 | fixed-current / historical | Stale Gill marker contract was fixed later; not a current blocker on source HEAD `6664056`. |
| PC-CURRENT-02 | P1 | confirmed-current | PC-007 false-green: all Gill dist pages have `gb-roman=0`; raw numerals remain. |
| PC-CURRENT-03 | P1/P2 | confirmed-current | Unversioned `floating-cluster.css` / controller refs remain in Astro-owned dist pages. |
| PC-CURRENT-04 | P1/P2 | confirmed-current | `css/premium-controls.css` listed by inventory/cache-bust but absent; runtime CSS truth unclear. |
| PC-CURRENT-05 | P2 | confirmed-current | Malformed `[data-gill-v16] background...` fragments in `floating-cluster.css` transition blocks. |
| PC-CURRENT-06 | P1/P2 | confirmed-current | Gill mobile series overlay current item reloads the page instead of opening the part TOC overlay. |

See:
- `reports/PREMIUMCONTROLS_CURRENT_MAIN_INDEPENDENT_VERIFIER_2026-06-27.md`
- `reports/PREMIUMCONTROLS_BUG_REPORT_FOR_SOURCE_REPO_2026-06-27.md`

---

## P0 Bug — FIXED IN THIS TURN

### isFavorite() undefined function (NEW — found 2026-06-27)

- **Severity:** P0 — Runtime error, save/favorite state broken
- **File:** `js/floating-cluster-controller.js`, line 585 (now 597)
- **Problem:** `isFavorite(path)` was called at line 585 in `syncSaveState()` but the function was never defined in the controller
- **Fix applied:** Added `isFavorite(path)` function before `syncSaveState` — checks `getFavorites()` array for matching path
- **Verification:** Controller now has 77 named functions, `isFavorite` defined at line 581, called at line 597

---

## 🔴 HIGH — Requires Owner Decision

### PC-004: CSS Architecture Decision (UNRESOLVED)

Two CSS sources for PremiumControls with no resolution:

| CSS | Size | Status | Pages |
|---|---|---|---|
| `css/floating-cluster.css` | 77.6KB | ACTIVE, deployed, linked in all pages | 19 PageHead components |
| `css/premium-controls.css` | 11.8KB v2.2 | CANONICAL extracted subset, NOT linked | 0 pages |
| `src/styles/premium-controls.css` | 231 lines | Source of truth, build copies to `css/` | — |

**Problem:** Phase 4 added hover-bloom CSS to both `src/styles/premium-controls.css` (v2.2) and `css/premium-controls.css` (synced), but no pages actually link to the canonical file. All pages still use `floating-cluster.css`.

**Required action:** Owner must choose one:
- **Option A:** Switch all 19 PageHead components to `css/premium-controls.css` as canonical
- **Option B:** Merge `premium-controls.css` content INTO `floating-cluster.css`, retire the duplicate
- **Option C:** Keep dual-CSS architecture with clear boundaries

### asset-version.js — Unused Helper (UNRESOLVED)

- **File:** `src/lib/asset-version.js`
- **Status:** `ASSET_VERSIONS` dict defined and hashes synced (200ee10a, 30f6df68)
- **Problem:** File is never imported in any source file. Zero callers.
- **PageHead components:** 15 pages use hardcoded `?v=f5c46704` in template, not the helper
- **Required action:** Either wire `asset-version.js` into PageHead.astro via import, or remove it as dead code

---

## 🟡 MEDIUM — In-Progress

### PC-006: Controller Transitional Naming

- **File:** `js/floating-cluster-controller.js` (1110 → 1122 lines after isFavorite fix)
- **Status:** Still uses old name. Should be renamed to `premium-controls-controller.js` when Phase 4 is ready
- **Audit script:** `scripts/premium-controls-rollout-audit.js` (147 lines) still references old filename
- **Required action:** After CSS desync resolved, rename controller and update audit script

### PremiumControls.astro — Missing from Contract

- **Contract expects:** `PremiumControls` component in `src/components/ui/premium-controls/`
- **Actual:** Only `PremiumControlAnchor.astro` exists (41 lines, 3 variants: breadcrumb/rail/floating)
- **7 files** in `src/components/ui/floating-cluster/` still use old naming convention
- **Required action:** Create `PremiumControls.astro` wrapper component or rename existing files

### GBS2 Controls — Separate System Mixed In

- **File:** `js/floating-cluster-controller.js` — `initGbs2Controls()` (180+ lines)
- **Status:** Separate control system (Gill-style) coexisting with PremiumControls
- **Problem:** Mixed into same controller, unclear ownership boundaries
- **Required action:** Migrate `initGbs2Controls()` to `site-modules.js` or dedicated `gbs2-controller.js`

---

## ✅ FIXED This Turn

1. **`saveCurrent(btn)` parameter** — removed `btn` argument at line 537, fixed to `saveCurrent()`
2. **`isFavorite()` undefined** — added function definition before `syncSaveState()` (line 581)
3. **Reports pushed** to `FedorMilovanov/AuditRepo` (commit c13ad5c)

---

## Verification Summary

| Check | Status |
|---|---|
| CSS v2.2 synced (231 lines, MD5 200ee10a) | ✅ |
| floating-cluster.css MD5 f5c46704 | ✅ |
| Controller has 77 named functions | ✅ |
| `isFavorite` defined | ✅ Fixed |
| `saveCurrent()` no dangling params | ✅ Fixed |
| PageHead components with `?v=` hash | ✅ 15 fixed |
| Reports in AuditRepo | ✅ Pushed |
| asset-version.js wired to PageHead | ❌ Not done |
| CSS canonical decision | ❌ Pending owner |
