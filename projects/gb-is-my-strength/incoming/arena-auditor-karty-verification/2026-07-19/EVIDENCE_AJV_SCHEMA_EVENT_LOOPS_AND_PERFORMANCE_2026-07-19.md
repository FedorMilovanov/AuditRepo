# EVIDENCE: AJV DRAFT 2020-12 SCHEMA INTEGRITY, PASSIVE LISTENERS & TIMER LEAKS

**Project:** `gb-is-my-strength`  
**Date:** 2026-07-19  
**Source HEAD:** `32ae0d7d62bee81737a9aae1f136946d047fe4fb`  
**Auditor:** `arena-auditor-karty-verification`  
**Subsystem:** Ajv Draft 2020-12 Validation, Passive Touch/Wheel Listeners, Timer Closures, and Schema Property Quality

---

## 1. Ajv Draft 2020-12 JSON Schema Validation Pass

Validation of all 11 map `route.json` files against canonical `karty/_shared/route.schema.json` using `Ajv2020` revealed schema violations across 4 routes:

| Map Route | Status | Errors | Violation Instance | Schema Rule Violated |
|---|---|---:|---|---|
| `avraam` | ❌ **FAIL** | 3 | `/places/19`, `/places/20`, `/places/21` (`babylon`, `mari`, `paran-region`) | `must have required property 'stage'` |
| `early-church` | ❌ **FAIL** | 4 | `jerusalem_church`, `peter_john`, `stephen_philip`, `paul_early` | `must match pattern "^[a-z0-9-]+$"` (underscores `_` used instead of `-`) |
| `melachim` | ❌ **FAIL** | 1 | `exile_return` | `must match pattern "^[a-z0-9-]+$"` (underscore `_` used) |
| `revelation` | ❌ **FAIL** | 1 | `first_love` | `must match pattern "^[a-z0-9-]+$"` (underscore `_` used) |
| `nachalo` | ❌ **FAIL** | 6 | Root `stories` missing, `meta.id`, `meta.era`, `meta.stats` missing | Required root & meta schema properties omitted |
| `ishod`, `maccabim`, `pavel`, `shoftim`, `shvatim`, `yeshua` | ✅ **PASS** | 0 | None | Full compliance |

---

## 2. Passive Event Listener Audit (`QUAL-P1-05`)

High-frequency input events (`wheel`, `touchstart`, `touchmove`, `mousemove`, `scroll`) in `karty/_engine/map-engine.js` and `karty/avraam/avraam-app.js` were inspected for passive binding:

1. **`map-engine.js` (11 non-passive listeners):**
   - `canvas.addEventListener('touchstart', ...)` (line 2110): lacks `{ passive: true }`.
   - `canvas.addEventListener('touchmove', ...)` (line 2115): lacks `{ passive: true }`.
   - `contentEl.addEventListener('scroll', ...)` (line 1092): lacks `{ passive: true }`.
   - Touch drag handlers block smooth compositor-driven scrolling on mobile browsers.

2. **`avraam-app.js` (5 non-passive listeners):**
   - `svg.addEventListener('wheel', ...)` (line 1120): unflagged passive mode.
   - `document.addEventListener('mousemove', ...)` (line 2290): parallax listener lacks passive flag.
   - `document.addEventListener('touchmove', ...)` (line 2296): parallax touch listener lacks passive flag.

---

## 3. Timer Closure & RequestAnimationFrame Leak Audit (`QUAL-P1-06`)

Count of timer allocations vs cancellation calls:

| Code File | `setTimeout` / `_tm` Calls | `clearTimeout` Calls | `setInterval` Calls | `clearInterval` Calls | `rAF` Calls | `cancelAnimationFrame` |
|---|---:|---:|---:|---:|---:|---:|
| `map-engine.js` | **38** | 7 | 2 | 2 | **12** | 2 |
| `avraam-app.js` | **36** | 9 | 0 | 0 | **22** | 3 |

**Finding:** 31 `setTimeout` timers in `map-engine.js` and 27 in `avraam-app.js` run detached from lifecycle cleanup. In active map instances, pending `_tm()` callbacks (e.g. search delayed highlight, flyTo camera callbacks) execute after element removal, throwing uncaught exceptions or leaking scope references.
