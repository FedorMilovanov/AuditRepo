# Evidence — Phase3 TTS rate legacy alias potential bug

**Agent:** arena-agent-deep-verifier-editor  
**Date:** 2026-06-26  
**Source:** `lane/premiumcontrols-phase3-2026-06-26`, `js/floating-cluster-controller.js`

---

## Finding

In the phase3 branch controller diff:

```javascript
var TTS_RATE_KEY = 'gb:audio:rate';
var TTS_RATE_LEGACY = TTS_RATE_KEY;      // ← BUG: this is the SAME as TTS_RATE_KEY
```

The `getStoredRate()` function:
```javascript
function getStoredRate() {
    var r = 1;
    try {
      r = parseFloat(localStorage.getItem(TTS_RATE_KEY));
      if (isNaN(r)) r = parseFloat(localStorage.getItem(TTS_RATE_LEGACY)) || 1;
    } catch (_) {}
    ...
}
```

Because `TTS_RATE_LEGACY === TTS_RATE_KEY === 'gb:audio:rate'`, the fallback to the old key `gbx-tts-rate` is **dead code**. Users who previously saved their speed preference under `gbx-tts-rate` will lose it on upgrade.

## Expected behavior (per PremiumControls README §2)

> - **canonical key: `gb:audio:rate`**
> - read legacy alias: `gbx-tts-rate`

## Fix

```javascript
var TTS_RATE_KEY = 'gb:audio:rate';
var TTS_RATE_LEGACY = 'gbx-tts-rate';    // ← correct legacy alias
```

## Severity

P3 — UX annoyance (users lose saved speed preference on first visit after update). Easy one-line fix.

## Speed panel write path

The speed panel in `initPlayExpand()` on the old main writes to `localStorage['gbx-tts-rate']`. Phase3's `setStoredRate()` writes to `gb:audio:rate`. The old `gbx-tts-rate` key becomes orphaned after update.

With the fix, `getStoredRate()` would first try `gb:audio:rate`, then fall back to `gbx-tts-rate` — correctly migrating the user's preference on first read.
