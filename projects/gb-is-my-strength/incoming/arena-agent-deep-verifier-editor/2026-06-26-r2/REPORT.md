# Agent Audit Report — Post-merge PremiumControls v2.1 Total Verification

## Meta
- Project: `gb-is-my-strength`
- Agent: `arena-agent-deep-verifier-editor`
- Date: `2026-06-26`
- Audited SHA: `6c5b83a3` (main — after PremiumControls v2.1 merge)
- Environment: Arena sandbox; full clone
- Build mode: source + root artifact analysis; no browser witness

---

## Executive summary

PremiumControls v2.1 merge closed the majority of P0 bugs and introduced the planned primitives. However, the merge inherited the **wrong heart-series mode** from `integration-monolith-preflight` instead of the correct fix from `premiumcontrols-phase3`. The result: 12 routes use `data-fc-mode="series-rich"` which the controller doesn't handle — controls initialize via `initCluster()` (basic delegation works) but pilot activation is skipped.

Additionally there is a **root HTML vs Astro source schism** on heart-series: root HTML uses `data-fc-controls="gill-rail"` while Astro source uses `data-fc-root data-fc-mode="series-rich"` — two different wiring approaches on the same pages.

---

## ✅ What is FIXED (confirmed on HEAD `6c5b83a3`)

| Bug | Status |
|-----|--------|
| Content corruption (Antisovetov U+FFFD) | ✅ FIXED — 0 matches |
| Content corruption (Hermeneutics `кик говорят`) | ✅ FIXED — 0 matches |
| Content corruption (Hermeneutics `называемая , .`) | ✅ FIXED — 0 matches |
| Ishod JSON-LD invalid extra `}` | ✅ FIXED — `JSON.parse` succeeds |
| PC-001: PremiumControlAnchor primitive | ✅ CREATED — `src/components/ui/premium-controls/PremiumControlAnchor.astro` |
| PC-003: asset-version.js centralized hashes | ✅ CREATED — `src/lib/asset-version.js` |
| PC-003: fc-controller hash drift in Astro source | ✅ FIXED — all 15 components use `f2299253` = actual hash |
| PC-004: canonical CSS source | ✅ CREATED — `src/styles/premium-controls.css` + `css/premium-controls.css` |
| Dead controls (PC-002 class) | ✅ FIXED — 0 pages with `gb-ember` outside scope |
| Baptisty BreadcrumbList JSON-LD | ✅ FIXED — all 11 pages have it |
| Baptisty og:image SVG → WebP | ✅ FIXED — all 11 pages use `image/webp` |
| SW precache 404 (site-layered, site-modules) | ✅ FIXED (earlier) |
| Nagornaya font controls (V2-2) | ✅ FIXED (earlier) |
| robots.txt AhrefsBot/SemrushBot block | ✅ FIXED — robots.txt restructured, AI bots allowed |
| Branch cleanup | ✅ Done — 18 → 4 branches |

---

## ❌ Bugs & issues found on HEAD `6c5b83a3`

### PC-V21-01 (P1): `data-fc-mode="series-rich"` — not handled by controller

**Routes affected:** 12 (10 baptisty-rossii + 2 heart-series in Astro source)
**Root cause:** Controller branches on line 586-588:
```javascript
if (mode === 'single') activateSinglePilot();
if (mode === 'series-lite') activateSeriesPilot();
if (mode === 'nagornaya') activateSinglePilot();
```
`series-rich` matches NONE. `initCluster(root)` still runs (click delegation works), but `activateSinglePilot`/`activateSeriesPilot` are skipped — no body class toggle, no pilot-specific affordances.

**Fix options:**
1. Add `if (mode === 'series-rich') activateSeriesPilot();` — treat as series-lite equivalent
2. Rename all `series-rich` → `series-lite` in source + root HTML
3. Add fallback: `else { initCluster(root); }` (already happens, but pilot activation skipped)

**Recommended:** Option 1 (smallest change, preserves semantics).

**Evidence:** `evidence/series-rich-mode-analysis.md`

---

### PC-V21-02 (P1): Root HTML vs Astro source wiring schism on heart-series

| | Root HTML (legacy) | Astro source |
|---|---|---|
| Krajne | `data-fc-controls="gill-rail" data-fc-variant="heart"` | `data-fc-root data-fc-mode="series-rich" data-fc-variant="heart"` |
| Rimlyanam7 | same | same |

Two completely different wiring approaches. Root HTML uses `data-fc-controls` (gill-rail path), Astro source uses `data-fc-root` (mode path). When dist is built from Astro, users get `series-rich` mode (partially wired). When legacy root is served, users get `gill-rail` controls (fully wired via `initCluster` on gill-rail containers).

**Fix:** Align one to the other. Recommended: change Astro source to match the gill-rail approach (already proven working), OR add `series-rich` to controller enum.

---

### PC-V21-03 (P2): Old toast "Озвучка ещё не подключена" still in controller

**Line:** 379 in `js/floating-cluster-controller.js`
**Context:** This is the fallback when `window.speechSynthesis` is NOT available (old browsers). The plan says the ONLY acceptable toast is "Браузер не поддерживает озвучку".
**Impact:** Low — only fires on browsers without Speech API.
**Fix:** Change text to "Браузер не поддерживает озвучку".

---

### PC-V21-04 (P2): TTS uses `gbx-tts-rate` as primary key, not `gb:audio:rate`

**Evidence:**
```javascript
// getStoredRate() line 268:
r = parseFloat(localStorage.getItem('gbx-tts-rate')) || 1;

// Speed panel line 724:
currentRate = parseFloat(localStorage.getItem('gb:audio:rate') || localStorage.getItem('gbx-tts-rate')) || 1;

// Speed panel write line 793:
localStorage.setItem('gb:audio:rate', speed);
localStorage.setItem('gbx-tts-rate', speed);  // dual-write
```

Mixed: `getStoredRate()` reads ONLY `gbx-tts-rate`. Speed panel reads `gb:audio:rate` first. Both write both keys. Not unified.
**Plan says:** `gb:audio:rate` canonical, `gbx-tts-rate` read-only legacy alias.
**Fix:** `getStoredRate()` should read `gb:audio:rate` first, fall back to `gbx-tts-rate`.

---

### PC-V21-05 (P2): CSS triple-source remains (PC-004 incomplete)

Three CSS sources coexist:
1. `css/floating-cluster.css` — 1975 lines, 76× `gb-ember` — loaded by **23 pages**
2. `css/premium-controls.css` — 165 lines, 46× `gb-ember` — loaded by **0 pages** (!)
3. `SeriesLiteCluster.astro <style is:global>` — 199 lines with `.gb-floater--series-lite`, `.gb-series-chip`, `.gb-ember`

**Critical:** `premium-controls.css` exists but is loaded by ZERO pages. It's dead CSS.
**`floating-cluster.css`** is still the real CSS source. The new canonical file is unused.
**Component CSS** in SeriesLiteCluster still has 199 lines of `<style is:global>` — direct duplication with `floating-cluster.css`.

PC-004 is structurally OPEN despite the file being created.

---

### PC-V21-06 (P2): Rollout audit script doesn't enforce mode enum

`scripts/premium-controls-rollout-audit.js` checks:
- ✅ Dead controls (gb-ember outside scope)
- ✅ Forbidden routes (app/landing/catalog)
- ✅ Double CSS delivery
- ❌ Does NOT check that `data-fc-mode` values are in `{single, series-lite, nagornaya, gill, disabled}`

**Result:** `series-rich` (which controller doesn't fully handle) passes the audit silently.

**Fix:** Add mode enum validation:
```javascript
const ALLOWED_MODES = new Set(['single', 'series-lite', 'nagornaya', 'gill', 'disabled', '']);
// in the loop:
const mode = html.match(/data-fc-mode="([^"]*)"/)?.[1] || '';
if (mode && !ALLOWED_MODES.has(mode)) {
  bad(`unknown fc-mode "${mode}" on /${route}/`, 'not in allowed set');
}
```

---

### PC-V21-07 (P3): `premium-controls.css` not referenced anywhere

Created as the "canonical source" (PC-004) but:
- 0 HTML pages load it
- 0 Astro PageHead components reference it
- `asset-version.js` lists it with hash `pc-v21` (not a real hash)
- `floating-cluster.css` is still the real style source

**Implication:** The canonical CSS migration is started but not completed. File is dead weight.

---

### PC-V21-08 (P3): `asset-version.js` has non-hash value `pc-v21`

```javascript
'css/premium-controls.css': 'pc-v21',
```

All other entries are real MD5 8-char hashes. `pc-v21` is a placeholder. Since nobody loads this CSS, it doesn't matter now, but it breaks the contract that all values are content-addressable hashes.

---

### PC-V21-09 (P3): PremiumControlAnchor created but not used

`src/components/ui/premium-controls/PremiumControlAnchor.astro` exists (966 bytes) but:
```bash
grep -rl 'PremiumControlAnchor' src/ --include='*.astro' | wc -l  → 1 (only itself)
```
No page/component imports or uses it. The anchor primitive exists but is dead code.

---

### PC-V21-10 (P3): `floating-cluster.css` undefined CSS variables

The `audit-pro.js` has previously flagged undefined `var(--gb-*)` in `floating-cluster.css`. This 1975-line file is the real style source but contains references to custom properties that may not be defined in all contexts.

---

### PC-V21-11 (INFO): Remaining 4 remote branches

| Branch | Ahead | Behind | Action needed |
|--------|-------|--------|---------------|
| `lane/audit-svg-pilot-bugs-2026-06-25` | 7 | many | **DELETE** — stale docs |
| `lane/baptisty-content-expansion-2026-06-25` | 1 | many | **DELETE or REBASE** — unique content? |
| `lane/karty-avraam-indexable-text-layer-2026-06-26` | 1 | some | **REVIEW** — may have unique avraam text |
| `lane/system-release-gate-green-2026-06-26` | 0 | 0 | **DELETE** — already merged |

---

## Summary table

| ID | Sev | Title | Category |
|----|-----|-------|----------|
| PC-V21-01 | **P1** | `series-rich` mode not handled by controller | **BUG — functional** |
| PC-V21-02 | **P1** | Root HTML vs Astro source wiring schism | **BUG — inconsistency** |
| PC-V21-03 | P2 | Old "Озвучка ещё не подключена" toast text | **BUG — UX text** |
| PC-V21-04 | P2 | TTS rate key inconsistency (gbx vs gb:audio) | **BUG — storage** |
| PC-V21-05 | P2 | CSS triple-source (PC-004 incomplete) | **DEBT — architecture** |
| PC-V21-06 | P2 | Rollout audit doesn't enforce mode enum | **GAP — guard** |
| PC-V21-07 | P3 | `premium-controls.css` loaded by 0 pages | **DEAD CODE** |
| PC-V21-08 | P3 | `asset-version.js` has placeholder `pc-v21` | **INCONSISTENCY** |
| PC-V21-09 | P3 | `PremiumControlAnchor` created but unused | **DEAD CODE** |
| PC-V21-10 | P3 | `floating-cluster.css` undefined CSS vars | **DEBT** |
| PC-V21-11 | INFO | 4 stale remote branches | **CLEANUP** |

**Total: 2 P1, 4 P2, 4 P3, 1 INFO = 11 findings.**

---

## Recommended immediate actions

1. **PC-V21-01:** Add `if (mode === 'series-rich') activateSeriesPilot();` to controller — **1 line, P1**
2. **PC-V21-02:** Decide canonical wiring for heart-series (gill-rail vs series-rich) — align source
3. **PC-V21-03:** Change toast text — **1 line**
4. **PC-V21-04:** Fix `getStoredRate()` to read `gb:audio:rate` first — **1 line**
5. **PC-V21-06:** Add mode enum to rollout audit — **5 lines**

These 5 fixes = ~10 lines of code total.
