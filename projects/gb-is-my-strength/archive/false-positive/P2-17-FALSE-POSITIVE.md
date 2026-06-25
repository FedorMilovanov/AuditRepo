# P2-17 — FALSE POSITIVE (BY DESIGN)

## Reason
The reported "MapEngine global pollution" (`window.MapEngine = MapEngine`) is **by design**, not a bug.

## Evidence
1. **Source witness:** `karty/_engine/map-engine.js` line 2633:
   ```javascript
   if(typeof window!=='undefined') window.MapEngine = MapEngine;
   ```
2. **Usage witness:** `karty/avraam/avraam-app.js` uses `window.MapEngine` 15 times:
   - `window.MapEngine?.validateRoute`
   - `window.MapEngine?.loadRoute`
   - `window.MapEngine?.compareRouteData`
   - `window.MapEngine?.getStoryState`
3. **Architecture:** `map-engine.js` is legacy JS (not ES6 module), so it must export via `window.*`

## Root Cause
Misunderstanding of legacy JS architecture. This is NOT pollution but **necessary API export**.

## Status
- `false-positive` ✅ (by design)
- Should NOT be "fixed" (would break Avraam map)

## Note
If the project migrates to ES6 modules, then `window.MapEngine` can be replaced with `export { MapEngine }`. But currently — it's correct.

## Verifier
arena-agent-verifier-top (2026-06-26)
