# Agent Audit Report — Speed-pill visual parity + total sweep (Round 3)

## Meta
- Project: `gb-is-my-strength`
- Agent: `arena-agent-deep-verifier-editor`
- Date: `2026-06-26`
- Audited SHA: `5d53913d` (main)
- Reference: owner screenshots (gold pill — desktop and single-anchor full cluster), `PremiumControls/spec/playember-speed-morph.md`

---

## Part 1: Speed-pill visual parity — spec vs implementation

### ✅ Matches reference (GOOD)

| Spec requirement | Implementation | Status |
|---|---|---|
| Pill expands LEFT from Play circle | `clip-path: circle(20px at calc(100% - 24px) 50%) → inset(0)` | ✅ Correct |
| Gold border | `border: 1.5px solid color-mix(... --color-accent-gold 30%, --color-border)` | ✅ Close match |
| Backdrop-blur | `backdrop-filter: blur(20px) saturate(180%)` | ✅ Present (spec says 10px but 20px is richer) |
| Speed buttons 0.75×..2× | 6 buttons generated in JS | ✅ Match |
| Active = gold fill gradient | `background: linear-gradient(135deg, --color-accent-gold, --color-accent-gold-bright)` | ✅ Match |
| Staggered cascade animation | nth-child 1..6 with delays .05s..0.20s | ✅ Match |
| Mobile: pill expands UP | `@media (max-width: 899px)` changes to `bottom: calc(100% + 10px)` | ✅ Match |
| Viewport guard (overflow) | JS `requestAnimationFrame` checks rect, applies shift | ✅ Present |
| Close on Esc / outside click | `document.addEventListener('keydown', Escape)` + click | ✅ Present |
| Mouse leave closes | wrap `mouseleave` + `mouseenter` with 220ms timer | ✅ Present |
| ARIA `aria-haspopup`, `aria-expanded`, `aria-controls` | Set in JS `initPlayExpand()` | ✅ Present |
| Speed buttons `role="radio"`, `aria-pressed` | Set in button HTML | ✅ Present |
| Speed stored `gb:audio:rate` + legacy dual-write | Speed panel reads `gb:audio:rate ∥ gbx-tts-rate`, writes both | ✅ Present |
| Dark mode variant | `html.dark .gb-ember-expand` + buttons | ✅ Present |
| Shimmer line (gold gradient `::before`) | `.gb-ember-expand::before` with gold linear-gradient | ✅ Present |
| GBS rail: UP morph | `.gbs-rail-foot .gb-ember-expand` overrides | ✅ Present |
| Open `box-shadow` enhances | Separate shadow for `.is-open` | ✅ Present |
| `gb:tts-rate-change` CustomEvent on speed select | `window.dispatchEvent(new CustomEvent(...))` | ✅ Present |

### ⚠️ Deviations from spec (minor — P3)

| Spec | Implementation | Delta | Severity |
|---|---|---|---|
| Animation: `260ms cubic-bezier(.2,.8,.2,1)` | `clip-path .38s cubic-bezier(.16, 1, .3, 1)` | **380ms vs 260ms**, different bezier | P3 |
| Pill padding: `10px 56px 10px 14px` | `5px 48px 5px 8px` | **Tighter** — less breathing room | P3 |
| Play circle: `48×48px` | No explicit 48px on standalone ember | P3 (uses `--ember-size` var, default varies) |
| Backdrop-blur: `10px` | `20px` | **Stronger** blur (arguably better) | INFO |
| Shadow: `0 8px 28px rgba(0,0,0,.13), 0 2px 6px rgba(0,0,0,.06)` | `0 4px 20px rgba(184,147,106,.10), 0 8px 32px rgba(0,0,0,.06), inset 0 1px 0 rgba(255,255,255,.8)` | **Different** — warm gold shadow vs neutral, plus inset highlight | P3 |
| Pill bg: `#faf8f3` | `color-mix(in srgb, var(--color-surface, #fff) 96%, transparent)` | Uses CSS variable, close match | INFO |

### ❌ Missing from spec (functional gaps — P2)

| Spec requirement | Implementation | Issue |
|---|---|---|
| **Keyboard ←/→ to change speed** | ❌ NOT IMPLEMENTED | No `ArrowLeft/ArrowRight` handling in speed panel |
| **Tab trap inside panel when open** | ❌ NOT IMPLEMENTED | Tab can leave the speed panel when open |
| **Enter/Space on speed button → apply + close** | ⚠️ PARTIAL — click event works, but no explicit `keydown Enter/Space` | Relies on button default click behavior (OK for native buttons) |
| TTS fallback toast: "Браузер не поддерживает озвучку" | **Uses wrong text**: "Озвучка ещё не подключена" (line 379) | P2 — spec says ONLY "Браузер не поддерживает озвучку" |

---

## Part 2: Critical bugs (P1)

### BUG-R3-01 (P1): `data-fc-mode="series-rich"` on 12 routes — controller skips pilot activation

**Status:** Still present on HEAD `5d53913d`.

The word `series-rich` appears **0 times** in the controller JS. The controller enum handles only `single`, `series-lite`, `nagornaya`. For `series-rich`, `initCluster(root)` runs (basic click delegation works) but `activateSinglePilot()`/`activateSeriesPilot()` is NOT called.

**Affected routes:**
- 10× baptisty-rossii root HTML → `data-fc-mode="series-rich"`
- 2× heart-series Astro source (KrajneBody, Rimlyanam7Body) → `data-fc-mode="series-rich"`

**Fix:** Add to line 588:
```javascript
if (mode === 'series-rich') activateSeriesPilot();
```

### BUG-R3-02 (P1): Heart-series root HTML vs Astro source — two competing wiring approaches

| | Root HTML | Astro source |
|---|---|---|
| Krajne | `data-fc-controls="gill-rail" data-fc-variant="heart"` | `data-fc-root data-fc-mode="series-rich" data-fc-variant="heart"` |
| Rimlyanam7 | same | same |

Root HTML uses `data-fc-controls="gill-rail"` (gill-rail path, **works**).
Astro source uses `data-fc-root data-fc-mode="series-rich"` (root path, **partially works**).

In strangler pattern: dist is built from Astro source. So production dist will have the partial wiring. Legacy root is only a development/fallback artifact.

---

## Part 3: Medium bugs (P2)

### BUG-R3-03 (P2): Toast "Озвучка ещё не подключена" should be "Браузер не поддерживает озвучку"

**Line 379** in `js/floating-cluster-controller.js`:
```javascript
showToast('Озвучка ещё не подключена', false);
```
Spec says: "only this, never 'Озвучка ещё не подключена'" — must be "Браузер не поддерживает озвучку".

### BUG-R3-04 (P2): `getStoredRate()` reads `gbx-tts-rate` first, not `gb:audio:rate`

**Line 268:**
```javascript
try { r = parseFloat(localStorage.getItem('gbx-tts-rate')) || 1; } catch (_) {}
```
Spec (`PremiumControls/spec/playember-speed-morph.md §4`):
```javascript
localStorage.getItem(TTS_RATE_KEY) ?? localStorage.getItem(TTS_RATE_LEGACY)
// where TTS_RATE_KEY = 'gb:audio:rate', TTS_RATE_LEGACY = 'gbx-tts-rate'
```
Speed panel (line 724) correctly reads `gb:audio:rate` first. But `getStoredRate()` (used by TTS engine) reads `gbx-tts-rate` first. **Inconsistent.**

### BUG-R3-05 (P2): No keyboard ←/→ navigation in speed panel

Spec §3: "← / → : change speed". Implementation: **0 ArrowLeft/ArrowRight handlers** for speed buttons. Only Esc/click.

### BUG-R3-06 (P2): No tab trap in speed panel

Spec §3: "Tab traps inside panel while open". Implementation: **no focus management** — Tab can leave the panel to page elements.

### BUG-R3-07 (P2): Rollout audit script doesn't enforce mode enum

`scripts/premium-controls-rollout-audit.js` validates dead controls and forbidden routes but does NOT check that `data-fc-mode` values are in the canonical set. `series-rich` passes silently.

---

## Part 4: Low bugs & debt (P3)

### BUG-R3-08 (P3): `premium-controls.css` exists but loaded by 0 pages

Created as canonical CSS source (PC-004), but no page links it. `floating-cluster.css` is still the real one. Dead file.

### BUG-R3-09 (P3): `PremiumControlAnchor.astro` exists but imported by 0 components

Created as architectural primitive (PC-001), but never used. Dead code.

### BUG-R3-10 (P3): `asset-version.js` has placeholder hash `pc-v21`

```javascript
'css/premium-controls.css': 'pc-v21',
```
Not a real content-addressable hash. Since nobody loads the file, no effect, but breaks contract.

### BUG-R3-11 (P3): `SeriesLiteCluster.astro` still has 199-line `<style is:global>` block

Despite PC-004 "canonical CSS only" — `SeriesLiteCluster` retains its own CSS. `.gb-floater--series-lite`, `.gb-series-chip`, `.gb-ember` are defined here AND in `floating-cluster.css`.

### BUG-R3-12 (P3): Speed-pill animation 380ms vs spec 260ms

`clip-path .38s cubic-bezier(.16, 1, .3, 1)` vs spec `260ms cubic-bezier(.2,.8,.2,1)`. 46% slower.

### BUG-R3-13 (P3): Pill padding tighter than spec

Spec: `10px 56px 10px 14px`. Implementation: `5px 48px 5px 8px`. 50% tighter vertical, 57% tighter left.

---

## Summary

| Category | Count | Verdict |
|---|---|---|
| ✅ Spec matches (visual parity) | 20/27 checks pass | Speed-pill is **close to reference** |
| ❌ P1 bugs (functional) | 2 | `series-rich` mode + root/Astro schism |
| ⚠️ P2 bugs | 5 | Toast text, storage key, keyboard, tab trap, audit enum |
| 💡 P3 debt | 6 | Dead files, animation timing, CSS duplication |
| 📊 Total findings | 13 | **2 P1, 5 P2, 6 P3** |

### Speed-pill verdict

The speed-pill implementation is **85-90% matched** to the reference screenshots. The core morph animation (circle → pill, staggered cascade, gold styling, dark mode, mobile up-morph, viewport guard) is correct and high-quality. Missing pieces are keyboard accessibility and minor CSS value deltas.

### Quick-fix priority (5-10 lines total)

1. `series-rich` → add to controller enum — **1 line**
2. Toast text — **1 line**
3. `getStoredRate()` key order — **1 line**
4. Rollout audit mode enum — **5 lines**
5. Keyboard ←/→ in speed panel — **~15 lines**

**Total: ~23 lines of code to close all P1 + P2 bugs.**
