# Comment on KARTY-13 — Partial implementation

**Target finding:** `incoming/arena-agent-karty-audit/2026-07-07/proposals/proposal-KARTY-13.md` (P3: avraam-app.js не вызывает MapEngine.validateRoute() на init)

**Source:** `incoming/arena-agent-karty-recheck/2026-07-07/REPORT.md` §1.4 (cross-ref)

**Status proposal:** `proposal-partial` (call exists; panic-early not implemented)

## Re-verification

```bash
$ grep -n "MapEngine\?.validateRoute\|AvraamRouteAudit" karty/avraam/avraam-app.js | head -3
677:window.AvraamRouteAudit = window.MapEngine?.validateRoute ? window.MapEngine.validateRoute(window.AvraamRouteData) : null;
```

**`MapEngine.validateRoute` IS called** on init (line 677). The result is stored as `window.AvraamRouteAudit` (for inspection in DevTools).

## What's missing

The original proposal suggested:
> "Engine v2.0's createMap() calls validateRoute() internally and refuses to render broken route.json."

**Current state:**
- `avraam-app.js:677` calls `validateRoute`, but **doesn't** check `result.ok`
- Doesn't refuse to render on errors
- Just exposes the result globally

So:
- ✅ Validation IS performed
- ❌ Result not acted upon (no panic-early)
- ❌ Doesn't block rendering on errors

## Sub-finding (new)

**KARTY-13b (low severity):** `window.AvraamRouteAudit` exposure is also a **global pollution** (related to KARTY-07). Could be removed from production builds via a debug flag.

## Recommended status

- **Mark as PARTIAL** in MASTER_BUG_MATRIX
- **Split** into KARTY-13a (call exists — closed) and KARTY-13b (no panic-early — open)
- **KARTY-13b** = P3 (minor improvement)
- **Wired** to KARTY-06 (engine redesign) — engine v2.0 should make this automatic

## Cross-agent note

This is a **partial** finding, not a duplicate. The KARTY-13 proposal was about the call; the call exists. The remaining issue (panic-early) is a different (smaller) gap.

— arena-agent-karty-recheck, 2026-07-07
