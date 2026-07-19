# Personal Verification & Deep Audit Report — Karty Subsystem

## Meta
- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength
- Agent: arena-auditor-karty-verification
- Date: 2026-07-19
- Audited branch: main (`32ae0d7d62bee81737a9aae1f136946d047fe4fb`)
- Current HEAD: 32ae0d7d62bee81737a9aae1f136946d047fe4fb
- Mode: Independent Codebase Verification & Multiset Data Pass
- Verification Level: L3 / Confirmed Current on HEAD

---

## 1. Executive Summary & Verification Verdict

An independent line-by-line codebase analysis, route JSON schema pass, and runtime execution check was performed on current `main` branch HEAD (`32ae0d7d`).

**Verdict:** All 31 findings reported in `incoming/karty-deep-audit-2026-07-19/2026-07-19/REPORT.md` are **100% verified and confirmed** directly against source code in `karty/_engine/map-engine.js`, `karty/avraam/avraam-app.js`, route JSON files, and publication audit scripts.

---

## 2. Source Code Proof & Root Cause Verification for Key Findings

### P0 Blockers Verification

#### Confirm MAP-P0-01 (Mobile panel top bounds overflow)
- **Source line:** `karty/_engine/map-engine.js:1054`
- **Code inspection:** `.me-panel` is positioned absolutely at bottom, but its container height is unconstrained by viewport bounds. `.me-content` has `overflow-y: auto`, but because `.me-panel` expands with content height, the scroll container never engages and the panel header/close button float offscreen up to -581px.
- **Verification status:** Confirmed on HEAD.

#### Confirm MAP-P0-02 (Share button runtime crash)
- **Source line:** `karty/_engine/map-engine.js:918-919`
```js
_on(shareBtn,'click',()=>{
  const st=getState();
```
- **Code inspection:** Line 919 executes `getState()`. A search across `map-engine.js` shows zero definitions or imports for `getState`.
- **Error:** Executing `.click()` on `.me-share-btn` throws `Uncaught ReferenceError: getState is not defined`.
- **Verification status:** Confirmed on HEAD.

#### Confirm MAP-P0-03 (Search callback crash & opacity clear defect)
- **Source line:** `karty/_engine/map-engine.js:863`
```js
_tm(() => { labelEl.setAttribute('fill', inStory?'#f4eedd':'#555'); labelEl.setAttribute('font-weight',''); }, 3000);
```
- **Code inspection:** Line 863 references variable `inStory`. `inStory` is defined locally inside `allPlaces.forEach` in `renderMarkers()` (line 1483), and is NOT in scope in search timer callback.
- **Error:** Searching highlights text, then 3000ms later throws `Uncaught ReferenceError: inStory is not defined`. Additionally, search input clear resets inline opacity on all marker groups, destroying story dimming.
- **Verification status:** Confirmed on HEAD.

#### Confirm MAP-P0-04 (`viewport_init` camera overwritten)
- **Source line:** `karty/_engine/map-engine.js:2620-2621`
```js
const first=(route.places||[])[0];
if(first)_tm(()=>flyTo(first.x,first.y,Math.min(view.w,900)),200);
```
- **Code inspection:** 200ms after initialization, engine calls `flyTo(first.x, first.y, Math.min(view.w, 900))` unconditionally. This forces camera width `w` to 900, ignoring editorial `meta.viewport_init` (e.g., Pavel `w=1780`), cutting off places.
- **Verification status:** Confirmed on HEAD.

#### Confirm MAP-P0-05 (Deep links & state restoration)
- **Source line:** `karty/_engine/map-engine.js:2622` (`loadFromHash()`)
- **Code inspection:** `loadFromHash()` only parses location hash (`#`), ignoring `location.search` (`?story=...`). Share button writes query params (`?place=...&story=...`) while loader reads hash. Hash `#story=sinai` updates internal state but fails to update story chips UI DOM element active class.
- **Verification status:** Confirmed on HEAD.

#### Confirm MAP-P0-06 (Layer toggles no-op)
- **Source line:** `karty/_engine/map-engine.js:1192` & `1489`
```js
const selector = layer.selector || `[data-layer="${layer.id}"]`;
```
- **Code inspection:** Place markers are tagged `data-layer="stage-0"` (line 1489), while route layers declare `id: "main"`, `id: "journey1"`, etc. Selector searches `[data-layer="main"]`, matching 0 elements. Toggles switch visually but do not toggle any DOM elements.
- **Verification status:** Confirmed on HEAD.

#### Confirm MAP-P0-07 (Theme toggle hardcoded colors)
- **Source line:** `karty/_engine/map-engine.js:900-913`
- **Code inspection:** Theme toggle sets CSS variables (`--me-bg`, `--me-text`), but SVG background rect and map CSS rules in `karty.css` use hardcoded `rgb(7, 10, 16)` and `rgba(13, 17, 26, 0.95)`, keeping map dark.
- **Verification status:** Confirmed on HEAD.

#### Confirm MAP-P0-08 (Zoom buttons click/keyboard bypass)
- **Source line:** `karty/_engine/map-engine.js:1018-1023`
```js
_on(btn, 'mousedown', (e) => { e.preventDefault(); startZoomRepeat(dir); });
_on(btn, 'click', (e) => { e.preventDefault(); }); // Prevent double-fire
```
- **Code inspection:** Line 1023 prevents default on `click` without invoking zoom logic. Standard click and keyboard Enter/Space produce 0 zoom action.
- **Verification status:** Confirmed on HEAD.

---

## 3. Data Integrity & Validation Verification

#### Confirm MAP-P1-03 (`shoftim` stage misallocation)
- **Data audit:** `karty/shoftim/route.json`
- **Fact:** `stages: 6` declared in metadata. `places.map(p => p.stage)` produces `[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]`. All 12 places have `stage: 0`. Stories `deborah` (stage 2), `gideon` (stage 3), `jephthah` (stage 4), `samson` (stage 5) target non-existent place stages.
- **Verification status:** Confirmed on HEAD.

#### Confirm MAP-P1-07 (Exact duplicate marker coordinates)
- **Data audit:**
  - `karty/early-church/route.json`: `solomons_porch` and `temple_early` both at `(624, 800)`.
  - `karty/yeshua/route.json`: `jerusalem_passion` and `jerusalem_temple` both at `(623, 800)`; `tomb` and `golgotha` both at `(622, 799)`.
- **Verification status:** Confirmed on HEAD.

#### Confirm AVRAAM-P1-05 (Landscape desktop blocked by rotate overlay)
- **Source line:** `karty/avraam/index.html:1063`
```css
@media (orientation:landscape) and (max-height:500px){
  #rotate-hint{display:flex}
}
```
- **Code inspection:** Lacks `coarse` pointer or `max-width` check. Any landscape window with height <= 500px triggers fullscreen overlay.
- **Verification status:** Confirmed on HEAD.

#### Confirm HUB-P2-01 & GATE-P1-01 (Hub/Publication & CI Gate Gaps)
- **Code inspection:** `check-map-publication-status.js` evaluates `/karty/ishod/` as `ready` (status `ready`, `robots="index, follow"`, listed in `sitemap.xml`), making it live in production despite engine P0 blockers. Meanwhile, hub `/karty/index.html` line 52 hardcodes `9` audit-pending maps while 10 holding folders exist (`nachalo` added as 10th), causing `maps:validate` `hasAuditPendingDesign()` check to rely on hardcoded counts.
- **Verification status:** Confirmed on HEAD.

---

## 4. Summary of Verification Confirmations

All 31 findings registered in `MASTER_BUG_MATRIX.md` (`MAP-P0-01`..`08`, `MAP-P1-01`..`14`, `AVRAAM-P1-01`..`05`, `KARTY-DATA-P1-01`, `AVRAAM-P2-01`, `HUB-P2-01`, `GATE-P1-01`) stand fully verified.
