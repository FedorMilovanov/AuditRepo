# Arena Agent Session 2 — 2026-06-26 Report

**Agent:** Arena Agent (session 2)
**SHA range:** `822b42d3` → `3253ea75`
**Branches merged:** 2 lanes

---

## Completed Fixes

### Lane 1: `lane/cleanup-double-css-dead-files-2026-06-26`
**Merged:** `df64e932`

| Bug ID | Severity | Title | Fix |
|--------|----------|-------|-----|
| **N-REV1-7** | P2 | Double CSS load on Hermenevtika/KodDaVinchi/Antisovetov | Removed external `<link>` to `floating-cluster.css` from 3 PageHeads — CSS already bundled via `SingleArticleCluster <style is:global>`. Gill pages keep the external link (no bundled CSS). |
| **P2-14** | P2 | `series-cards.js` in SW precache but never loaded | Removed `/js/series-cards.js` from `sw.js` PRECACHE_ASSETS and `cache-bust.js` ASSETS. File still exists on disk but 0 pages load it. |
| **P1-15** | P1 | GBS2 sheet TOC pane always empty | Added `initGbs2Controls()` to fc-controller: dynamically populates sidebar TOC (`#gbs2Toc`) and sheet TOC pane (`data-gbs2-pane="toc"`) from article `h2[id]/h3[id]` headings. |
| **P1-16** | P1 | Hub progress tracking elements unwired | `initGbs2Controls()` also wires: scroll progress (`#gbs2MobPct`, `#gbs2Pct`, `#gbs2Curbar`, `#gbs2Ring`), heading count (`#gbs2Count`), current heading in mobile bar (`#gbs2MobSec`). |
| **P1-13** | P1 | `data-gbs2-theme` unwired | **Verified already working** — fc-controller (loaded on baptisty via P1-14) wires `data-gbs2-theme` via global delegated click + `initGillRail()`. |

**Additional GBS2 wiring in `initGbs2Controls()`:**
- Mobile bottom bar (`#gbs2Bbar`) → opens sheet
- `data-gbs2-close` → closes sheet
- `data-gbs2-tab` → tab switching (parts/toc)
- `data-gbs2-font` → `changeFontSize()`
- `data-gbs2-share` → `navigator.share` / clipboard fallback
- CSS class names matched to existing `site.css`: `gbs2-open`, `gbs2-sheet-toclink`, `gbs2-sheet-sub`

### Lane 2: `lane/audit-pro-sync-p1-batch-2026-06-26`
**Merged:** `3253ea75`

| Bug ID | Severity | Title | Fix |
|--------|----------|-------|-----|
| **P1-9** | P1 | `audit-pro.js` CACHE_BUST_ASSETS hardcoded lie | Synced with `cache-bust.js` canonical ASSETS list. Removed stale `js/modules/*` entries, added missing `js/glossary.js`. |

---

## Verified as NOT BUGS / Already Fixed

| Bug ID | Status | Notes |
|--------|--------|-------|
| P0-3 | **Intentional** | robots.txt blocks AhrefsBot/SemrushBot/MJ12bot — deliberate owner policy (competitor crawlers, not search engines) |
| P1-1 | **Already fixed** | site.js FAB + TTS guards already check `[data-fc-root]`, `[data-gbs2-theme]`, `.gb-ember` |
| P1-7 | **Not active bug** | search.js hardcoded readTimes (89/41/30/50) match current search-manifest.json canonical values |
| P1-10 | **Already mitigated** | `git diff` in indexnow.yml has `2>/dev/null || true` fallback + retry loop (P0-6) |
| P3-NEW | **Not confirmed** | back-to-top.js — site.js handles `#back-to-top` via `SITE_CONFIG.features.backToTop` |

---

## Remaining Open Items (not addressed)

| Bug ID | Severity | Title | Why not addressed |
|--------|----------|-------|-------------------|
| P1-5 | P1 | page-ownership vs route-migration-matrix conflict | Data alignment — 19 routes in page-ownership not in matrix. Needs owner decision on migration mode for each. |
| P1-11 | P1 | dist-publication-audit doesn't detect stale hash mismatch | Tooling improvement, requires dist build to test |
| P1-17 | P1 | BaseLayout CSS loads WITHOUT hash | Architecture decision |
| P2 batch | P2 | Various tooling/docs improvements | Lower priority |
| P3 batch | P3 | Various minor issues | Lowest priority |

---

## Current HEAD
```
3253ea75 Merge: P1-9 audit-pro CACHE_BUST_ASSETS sync
df64e932 Merge: N-REV1-7 double CSS fix + P2-14 dead series-cards + P1-15/P1-16 GBS2 controls wiring
822b42d3 (previous session end)
```
