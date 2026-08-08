# CURRENT HEAD REVERIFY — 2026-07-20 — `32ae0d7d`

## Meta
- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Current source HEAD: `32ae0d7d62bee81737a9aae1f136946d047fe4fb`
- Source headline commit: `merge: атлас — 256 этимологий (18 батчей, ~377 научных прогонов)`
- AuditRepo branch context: `integration/branch-reconcile-2026-07-20`
- Date: 2026-07-20
- Witness set:
  - verified-source (local clone of current `origin/main`)
  - verified-build (`npm run validate:static-publication` on local clone)
  - verified-ci (public GitHub Actions API for `deploy.yml`)

## 1. Executive summary

`AuditRepo` main was still anchored to source truth from **2026-07-14 / `2ca2af3b`**. That is stale.

Current reality on 2026-07-20:

1. **Source HEAD moved to `32ae0d7d`.**
2. **Prod is still stale / deploy red.** Last GREEN deploy remains `007b67def5` (run `29138555390`, 2026-07-11T03:46:58Z).
3. The **current deploy stop-point is no longer** the old 2026-07-14 blocker cluster (editorial registry / maps validate / avraam audit / CSS important ceiling).
4. The **current verified blocker** is inside **Static publication gates**: `audit-pro.js` fails on oversized raw atlas export PNGs.
5. Several not-merged AuditRepo branches still contain useful governed evidence and can be integrated safely as raw intake, but not as current SSOT.

## 2. Current deploy truth

### 2.1 GitHub Actions

Public API check of `deploy.yml` runs:

- latest deploy run: **#1603** → `32ae0d7d` → **failure**
- previous runs #1602..#1594 → all **failure**
- no successful deploys in the last 50 runs
- last successful deploy in the first 500-run search window:
  - **run `29138555390`**
  - source SHA **`007b67def5`**
  - created `2026-07-11T03:46:58Z`

### 2.2 Current stop-step

Run `29621961761` (`32ae0d7d`) fails at:

```text
step 7: Static publication gates  ❌
```

All later build/dist/deploy steps are skipped.

### 2.3 Local reproduction

Local current-head run:

```bash
npm run validate:static-publication
```

Result: **FAIL** inside `node scripts/audit-pro.js` with current hard errors:

- `images/atlas-export/shvatim-hires.png` — 13384 KB > 683.59375 KB
- `images/atlas-export/shvatim-preview.png` — 1379 KB > 683.59375 KB

Observed on current source clone; same chain reaches `audit-pro`, which means the older 2026-07-14 static blockers are no longer the active stop-point in this run.

### 2.4 Current deploy conclusion

**Canonical current statement:**

- `PROD-STALE-DEPLOY-RED` remains **OPEN**.
- Current mechanism is **Static publication gates red because of oversized raw atlas-export PNG artifacts**.
- Older 2026-07-14 deploy blockers are historical/fixed, not the current root cause.

## 3. Verified source state relevant to branch decisions

### 3.1 Heart / book mode is already landed in source

Current source contains the book-shaped engine in production code:

- `src/components/article-pilots/_shared/series/hardTextsSeriesConfig.ts`
  - `shape: 'book'`
  - explicit `HEART_CHAPTERS`
  - chapter (`tier:'chapter'`) + article (`mark.kind:'arabic'`) model
- `src/components/article-pilots/_shared/series/seriesConfig.ts`
  - validator supports `shape:'book'`, `chapterArticles()`, `topLevelItems()`, `sectionLabel()`
- `src/components/article-pilots/gill-series/GillSeriesRail.astro`
  - chapter/article rail logic present
- `src/components/article-pilots/gill-series/GillPartTocOverlay.astro`
  - 3-level chapter → article → section flow present

**Implication for AuditRepo branches:**
- book-engine branches (`019f67ec`, `019f675d`, `019f675e`) should be treated as **historical research / prototype evidence**, not as current implementation truth.

### 3.2 Hermeneutika intake is still materially current

Key findings from `audit/hermenevtika-ui-current-head-2026-07-09` remain source-current on `32ae0d7d`:

- `HermenevtikaMobileBar.astro`
  - JS-only back button via `data-home-href`
  - duplicate search inputs: `#hmTocSearch` and `#hmSheetSearch`
  - direct `document.body.style.overflow = 'hidden' / ''`
  - no modal focus lifecycle for the TOC sheet
  - whole-document progress math (`window.scrollY / docHeight`)
- `HermenevtikaPageHead.astro`
  - visible page dates still diverge from machine metadata
  - `hreflang="en"` still points to the TMSJ PDF
  - `article:published_time` remains `2016-09-01`
  - `features.footnotes.enabled: false` while active footnote UI exists
- `HermenevtikaBody.astro`
  - route still contains active `.bref[data-ref]` buttons in article body and complex footnote/tooltip machinery

**Implication:** the Hermeneutika audit branch is still worth preserving in AuditRepo as raw intake.

### 3.3 Genealogy progress branch is historical but legitimate

Current source HEAD is already beyond the branch note:

- source main now says **256 etymologies**
- branch note documents the prior milestone **233 etymologies** and search UX

**Implication:** merge as historical progress evidence only; not current SSOT.

### 3.4 Gill V10 branch remains raw evidence only

The Gill V10 branch contains useful raw intake, but its branch-level edits to `README`, `NEXT_AGENT_PROMPT`, `MASTER_BUG_MATRIX`, etc. are stale and must not override current SSOT.

**Implication:** preserve only raw intake artifacts, not branch-wide SSOT edits.

## 4. Branch reconciliation decision (verified)

### Safe to preserve in AuditRepo as governed evidence
- `audit/hermenevtika-ui-current-head-2026-07-09`
- `claude/biblical-genealogy-svg-6l6qb8` (progress note only)
- `arena/019f675e-auditrepo` → raw `incoming/arena-auditor/2026-07-16/`
- `audit/gill-series-v10-canonical-2026-07-09` → raw intake only
- `arena/019f675d-auditrepo` → `incoming/gbs-book-engine-research/2026-07-15/` only
- `arena/019f67ec-auditrepo` → compact standalone prototype reference only

### Not current-source truth
- old deploy blocker narrative from 2026-07-14
- branch-level rewrites of matrix / README / NEXT_AGENT prompt from stale heads
- book prototype branches as implementation instructions

## 5. Recommended current priority

Before any new feature work:

1. unblock deploy on source main (`32ae0d7d`) by resolving raw atlas-export PNG gate failures;
2. keep karty deep-audit backlog as the main product-quality lane;
3. treat imported historical branches as evidence/provenance, not as permission to reopen stale claims blindly.
