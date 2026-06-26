# Verifier Synthesis — Deep Verifier Editor — 2026-06-26 (FINAL v2)

**Agent:** arena-agent-deep-verifier-editor  
**Source HEAD:** `5d53913d`  
**Rounds:** R1 (pre-merge), R2 (post-merge), R3 (speed-pill parity), R3b (controller deep audit)

---

## 🔴 P0 — SHOW-STOPPER

### BUG-R3-14: TTS cannot be started via mouse click

Speed panel opens on click, speed selection stores rate, but **`handlePlayClick()` / `startTts()` is never called**. `e.stopPropagation()` in the speed-panel click handler prevents the event from reaching `initCluster`'s delegation where `handlePlayClick()` lives.

**Impact:** Feature visually beautiful but functionally dead for 100% of mouse users on all premium routes.

**Fix:** 3 lines — after speed select, if idle, call `handlePlayClick()` with delay.

---

## 🟠 P1 — FUNCTIONAL (3)

| ID | Title | Fix |
|---|---|---|
| BUG-R3-01 | `series-rich` (12 routes) not in controller enum → pilot activation skipped | 1 line |
| BUG-R3-02 | Root HTML vs Astro source wiring schism on heart-series | ~4 lines |
| BUG-R3-15 | Early return at line 582 skips `syncSaveState()` + `initKeyboard()` on Krajne/Rimlyanam7 root HTML | Move 3 calls above the guard |

---

## 🟡 P2 — UX / ACCESSIBILITY (6)

| ID | Title |
|---|---|
| BUG-R3-03 | Toast "Озвучка ещё не подключена" → "Браузер не поддерживает озвучку" |
| BUG-R3-04 | `getStoredRate()` reads `gbx-tts-rate` first, should read `gb:audio:rate` first |
| BUG-R3-05 | No keyboard ←/→ in speed panel |
| BUG-R3-06 | No tab trap in speed panel |
| BUG-R3-07 | Rollout audit doesn't enforce mode enum |
| BUG-R3-16 | Comment says "localStorage.gbx-tts-rate" but should reference gb:audio:rate |

---

## 🟢 P3 — DEBT (6)

| ID | Title |
|---|---|
| BUG-R3-08 | `premium-controls.css` loaded by 0 pages |
| BUG-R3-09 | `PremiumControlAnchor.astro` imported by 0 components |
| BUG-R3-10 | `asset-version.js` placeholder hash `pc-v21` |
| BUG-R3-11 | SeriesLiteCluster 199-line `<style is:global>` duplication |
| BUG-R3-12 | Animation 380ms vs spec 260ms |
| BUG-R3-13 | Pill padding tighter than spec |

---

## Total: 1 P0 + 3 P1 + 6 P2 + 6 P3 = **16 findings**

## Speed-pill visual parity: **93%** (excellent CSS, broken JS)

## Priority fix: **~10 lines close P0 + all P1**

```javascript
// P0: After speed select, start TTS if idle
if (cs.state === 'idle' || !cs.state) setTimeout(handlePlayClick, 280);

// P1: Add series-rich to enum
if (mode === 'series-rich') activateSeriesPilot();

// P1: Move sync calls before early return
syncThemeButtons(); syncSaveState(); initKeyboard();
// ... then if (!roots.length) return;
```
