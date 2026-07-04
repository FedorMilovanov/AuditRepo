# Cross-reference synthesis — Arena Agent Round 3 vs Arena Agent Round 1
**Date:** 2026-06-25  
**Purpose:** Merge findings from two arena-agent audit passes into unified bug ledger

---

## Agent findings overview

### Arena Agent (in `incoming/arena-agent/2026-06-25/`) — Premium surface focus

| ID | Severity | Description | Type |
|----|----------|-------------|------|
| PS-01 | P0 | `qs is not defined` — controller crash on 13 premium routes | Shared runtime |
| PS-02 | P0 | Dead premium theme controls (visible but non-functional) | Shared runtime |
| PS-03 | P0 | Dead premium save controls (render but no state change) | Shared runtime |
| PS-04 | P0 | Partial rollout: `.gb-ember` suppresses legacy TTS but no controller loaded | Ownership conflict |
| PS-05 | P1 | Hermeneutics stray `76e7365` in body | Route content |
| PS-06 | P1 | Hermeneutics hidden readTime=35 vs visible=50 | Metadata drift |
| PS-07 | P1 | Duplicate IDs `gbsTheme`/`gbsSearch` on 4 Gill pages | HTML validity |
| PS-08 | P2 | `interactive-audit` stale theme selectors (misses `#gbFcTheme`, `.gb-theme-toggle`) | Audit drift |
| PS-09 | P2 | `interactive-audit` wrong Gill context shell expectations | Audit drift |
| PS-10 | S0 | Legacy/root cache-bust drift for `floating-cluster-controller.js` | Source layer |

### Arena Agent Round 3 (this agent) — System tooling focus

| ID | Severity | Description | Type |
|----|----------|-------------|------|
| P0-1 | P0 | Gill Rail SAVE button NOP (`data-action="save"` not handled) | Shared runtime |
| P0-2 | P0 | `floating-cluster.css` empty file | Source layer |
| P0-3 | P0 | `robots.txt` blocks AhrefsBot/SemrushBot/MJ12bot | SEO/tooling |
| P0-6 | P0 | CI cascade race condition (git push rejected on concurrent workflows) | CI/CD |
| P0-7 | P0 | `css/site-layered.css` in SW precache but NOT in cache-bust.js | Cache sync |
| P0-8 | P0 | `js/site-modules.js` in SW precache but NOT in cache-bust.js | Cache sync |
| **P0-10** | **P0** | **All Astro components contain STALE HARDCODED asset hashes** | **Cache sync** |
| P1-1 | P1 | Old controls don't check `.has-premium-controls` | Shared runtime |
| P1-2 | P1 | sitemap.xml incomplete | Metadata |
| P1-3 | P1 | search-manifest.json incomplete | Metadata |
| P1-4 | P1 | ASTRO_PAGE_HEAD_MAP incomplete in update-meta.js | Metadata |
| P1-5 | P1 | page-ownership vs route-migration-matrix conflict | Migration |
| P1-6 | P1 | copy-legacy-to-dist.js race condition | Tooling |
| P1-7 | P1 | search.js hardcoded fallback readTime unvalidated | Shared runtime |
| P1-8 | P1 | Gill rail `[data-fc-root]` double initialization | Shared runtime |
| P1-9 | P1 | `audit-pro.js` CACHE_BUST_ASSETS diverges from real cache-bust.js | Tooling |
| P1-10 | P1 | `build-indexnow-urls.js` git diff fails on merge → empty IndexNow | SEO/tooling |
| **P1-11** | **P1** | **`dist-publication-audit.js` does NOT detect stale hash mismatch** | **Tooling** |
| P1-12 | P1 | KartyPageHead hardcoded stale CSS hash | Cache sync |
| P1-13 | P1 | `theme.js` doesn't wire GBS `data-gbs2-theme` buttons | Shared runtime |
| P2-1–P2-8 | P2 | Various tooling/audit drift issues | Tooling |
| P2-9 | P2 | Visual parity coverage gap | Tooling |
| P2-10 | P2 | sw-dist-readiness-audit missing cache-bust sync check | Tooling |
| P2-11 | P2 | deploy.yml redundant cache-bust | CI/CD |
| P2-12 | P2 | check-data-consistency H1 extraction fragile | Tooling |
| P2-13 | P2 | MDX canonicalOverride routing unclear | Route |
| P2-14 | P2 | series-cards.js precached but unused | Tooling |
| P2-15 | P2 | about/ page ownership unclear | Route |
| P3-1–P3-3 | P3 | Lower-priority issues | Various |
| P3-4 | P3 | Hardcoded word count floors drift | Tooling |
| P3-5 | P3 | interactive-audit hardcoded URL lists drift | Audit |
| P3-6 | P3 | floating-cluster-controller.js stale hash in 10 refs | Cache sync |

---

## Cross-reference: duplicate findings

| Shared finding | Arena Agent ID | Round 3 ID | Status |
|----------------|----------------|------------|--------|
| Gill SAVE/controls not working | PS-02 + PS-03 (theme+save dead) | P0-1 (save NOP) | **Same root cause** — controller doesn't handle save action |
| `floating-cluster-controller.js` hash drift | PS-10 (root vs Astro drift) | P0-10 (all Astro stale hashes) | **PS-10 is PART of P0-10** — P0-10 is the systemic version |
| theme controls non-functional | PS-02 (visible but dead) | P1-13 (theme.js doesn't wire GBS buttons) | **Related** — PS-02 is symptom, P1-13 is root cause (subset) |
| DuplicateGill IDs | PS-07 | (same finding) | **Confirmed by both** |

---

## Cross-reference: complementarity (non-overlapping)

### Arena Agent found, Round 3 confirmed or extended:
- PS-01 (`qs is not defined`): Round 3 confirms root in fc-controller init
- PS-02/PS-03: Round 3 provides specific evidence (P0-1: data-action="save" not in handler)
- PS-07 (duplicate Gill IDs): Round 3 traced to `GillRailControls.astro` hardcoded id

### Round 3 found, Arena Agent didn't cover:
- **P0-6**: CI cascade race condition (indexnow.yml git push)
- **P0-7 + P0-8**: site-layered.css + site-modules.js missing from cache-bust
- **P0-10**: Astro hardcoded stale hashes — THE BIGGEST FINDING
- **P1-9**: audit-pro CACHE_BUST_ASSETS hardcoded lie
- **P1-10**: build-indexnow-urls.js git diff on merge
- **P1-11**: dist-publication-audit doesn't check hashes
- **P1-12**: KartyPageHead stale CSS hash
- **P1-13**: theme.js data-gbs2-theme not wired
- P1-2, P1-3, P1-4 (sitemap/manifest/astro-head-map): metadata structural
- P2-1 to P2-12, P3-4 to P3-6: tooling/system

---

## False positive corrections

Both agents found and corrected:
- `P0-4 CORRECTED` (feed.xml dead link): grep=0, not in current code
- `P0-5 CORRECTED` (cache-bust regex): verified `/\./g` works with g-flag

---

## Severity recalibration after cross-reference

| Original ID | Recalibrated to | Reason |
|-------------|-----------------|--------|
| PS-08 (P2) | P1-11 | Audit script not detecting real P0-10 bug = tooling failure at P1 level |
| PS-10 (S0) | P0-10 | Actually affects ALL Astro-owned pages, not just legacy/root |
| P0-4, P0-5 | CLOSED | False positives confirmed |

---

## Unified P0 priority

| Priority | Bug | Source | Impact |
|----------|-----|--------|--------|
| **1** | P0-10: ALL Astro components stale hash | Round 3 | All Astro-owned pages get wrong CSS/JS — affects PS-01..PS-04 symptoms |
| **1** | PS-01: `qs is not defined` controller crash | Arena Agent | 13 premium routes non-functional |
| **1** | P0-7 + P0-8: cache-bust missing assets in SW | Round 3 | Stale assets served from SW cache |
| **2** | P0-6: CI cascade race condition | Round 3 | Deploy pipeline unreliable |
| **2** | PS-02 + PS-03 + P0-1: dead premium controls | Both | All premium theme/save buttons non-functional |
| **2** | PS-04: partial rollout ownership conflict | Arena Agent | Heart routes suppress TTS without controller |
| **2** | P1-9: audit-pro CACHE_BUST_ASSETS lie | Round 3 | Audit checks wrong things |
| **2** | P1-11: dist-publication-audit blind to hash drift | Round 3 | Quality gate misses critical bug |
