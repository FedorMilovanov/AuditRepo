# Current Head Canonical Ledger — gb-is-my-strength

> **SUPERSEDED 2026-07-03 — Pass 34:** this document is now a historical index, not the live truth. The current operational truth lives in:
>
> - `projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md` (head line, P0/P1/P2/P3 buckets, Pass 25-34 audit sections)
> - `projects/gb-is-my-strength/NEXT_AGENT_PROMPT.md` (top-of-page addendum with current HEAD and CI status)
> - `projects/gb-is-my-strength/reverify/CURRENT_HEAD_REVERIFY_2026-07-03_ci-red-b4b312a-runtime-reference-errors.md` (full evidence, including §10 Pass 34 refresh on `f1e9abd`)
>
> Do **not** edit this ledger as a competing source of truth. The fresh operational document is `MASTER_BUG_MATRIX.md` (head line updated in Pass 34 to `f1e9abd`).

---

**Evidence date:** 2026-07-01
**Source HEAD checked:** `8aa0fb27` (fix(remaining): close 6 open issues from deep audit)
**AuditRepo HEAD:** updated with sandbox CI-regression notes and duplicate block fix
**Previous ledger HEAD:** `6664056` (stale — 1779 commits behind)
**Purpose:** current-only operational truth. Historical evidence remains in older ledgers/incoming folders, but this file decides current repair selection.

---

## 0. Current gate facts (2026-07-01)

Source checks (all PASS on `8aa0fb27`):

```text
npm run gill:mobile-play:smoke    = PASS (5 routes × desktop + mobile)
npm run gill:mobile-layout:audit  = PASS (5 routes × 4 viewport/theme = 20 cases)
node scripts/audit-pro.js         = PASS (including G114.2 stylesheet SRI)
npm run strangler:build:production-like = PASS
GitHub Actions Deploy              = PASS (all 27 steps green)
```

---

## 1. Changes since stale ledger (6664056 → 8aa0fb27)

### Fixed / Closed

- **openSheet() scroll lock desync** — now uses SiteUtils.lockScroll('gbs2-sheet')
- **openOverlay() scroll lock** — uses SiteUtils.lockScroll('gill-toc')
- **Layout audit covers only 1 route** — expanded to all 5 Gill routes
- **G114 SRI gap** — G114.2 now checks `<link rel=stylesheet>` CDN; G114.1 uses ±300 char context
- **CACHE_BUST_ASSETS duplication** — extracted to shared `scripts/cache-bust-assets.js`
- **Dead search selectors** — 7 → 2 (removed 5 legacy selectors never matching in production)
- **Dead premium-controls stubs** — removed 6 files (~67KB) in `src/lib/premium-controls/`
- **pageerror filter** — narrowed from blanket null-reference suppression to targeted patterns
- **Cosmetic `if (document.body)` guards** — removed where body is never null at runtime

### Stale-on-current-head (previously reported, still fixed)

- `workflows:check` red due `dist:jsonld:audit` missing `--root dist` — fixed-current.
- "Gill parts 2/3/spravochnik are still legacy base" — stale. All 5 Gill routes are v16.
- Old 2026-06-25 aggregate bug counts — historical baseline only.

### Still open (P2-P3, not blocking deploy)

- BaptistyRossii 11 PageHead components — 92-93% copy-paste. Needs BaseSeoHead refactor.
- DEEP_CODE_AUDIT document tied to stale HEAD `27862d4d`.
- `data-gill-current-part` attribute not read by JS.
- 29 dead CSS custom properties, 6 empty @media blocks.
- NotoSerifGreek only TTF (no woff2).

---

## 2. CI Regression History (2026-06-30 — 2026-07-01)

7 of 8 agent commits broke CI. See SANDBOX-ENV-2026-06-21.md §0.1 for root cause analysis.
Key lesson: always run Playwright tests locally before push.
