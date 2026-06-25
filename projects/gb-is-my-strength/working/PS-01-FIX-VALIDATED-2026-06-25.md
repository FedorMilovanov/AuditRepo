# PS-01 fix — validated minimal patch — 2026-06-25

**Agent:** `arena-agent-2`
**Target:** P0 bug PS-01 (`qs is not defined` in `floating-cluster-controller.js`)
**This is the #1 priority fix per `UNIFIED_BUG_LEDGER`.**
This document provides a **tested, deterministic patch** — not a suggestion.

---

## The fix (2-line diff)

Move the IIFE closing `})();` from line **389** to the **end of the file** (after
`initPlayExpand`), so `initTocPopups` / `initActionHandlers` / `initPlayExpand` live
*inside* the IIFE and can see the locally-declared `qs`/`qsa`.

```diff
--- a/js/floating-cluster-controller.js   (line 389)
+++ b/js/floating-cluster-controller.js
@@ -386,7 +386,6 @@
     };
   });

-})();
-
   /* =====================================================
      v16 TOC POPUPS — Series & Part sheets
@@ -560,3 +559,4 @@
       });
     });
   }
+})();
```

**That's the entire change.** No other edits. Net diff: −1 line at 389, +1 line at EOF.

---

## Why this is the correct fix (root cause recap)

- `qs`/`qsa` are declared inside the IIFE (lines 32–33).
- The IIFE originally closed at line 389.
- The three init helpers were declared *after* the close (global scope) → they
  could not see `qs`/`qsa`.
- Under `<script defer>`, `ready()` runs the init callback synchronously;
  `initTocPopups()` (the first helper called, line 346) referenced `qs` →
  `ReferenceError: qs is not defined` → entire init aborted before `initCluster`
  bound any click handlers.

Moving the close to EOF makes the three helpers part of the IIFE scope. Trivial,
surgical, zero behavioral risk to the rest of the file.

---

## Deterministic validation (before → after)

Ran the **same** Node DOM-stub repro on both versions (readyState:'complete' so
`ready()` runs synchronously, with `[data-fc-root]` + `.gb-ember` present):

### BEFORE (current HEAD)
```
1) КРАШ: ReferenceError - qs is not defined ❌
```

### AFTER (patched)
```
1) КРАШ: отсутствует (qs видна) ✅
2) window.__gbCluster создан: ✅ да
3) click-делегирование на [data-fc-root]: ✅ привязано (1 handler)

ИТОГ: ✅ КЛАСТЕР ОЖИЛ — фикс валиден
```

`node --check` PASSES on the patched file.

---

## What this single fix revives (downstream PS-02/PS-03/P0-1)

Per the canonical root-cause clustering in `UNIFIED_BUG_LEDGER` (PS-01 cluster →
PS-01, PS-02, PS-03, PS-04, P0-1, P0-6, P1-8), applying this patch restores:

- `initCluster(root)` click delegation → theme / search / save / font / scroll-top
  buttons work again (closes **PS-02**, **PS-03**, **P0-1**)
- `window.__gbCluster` public API created
- `syncThemeButtons()` / `syncSaveState()` / `initKeyboard()` run
- `#mobTocBtn` / `#seriesTocOverlay` / `#partTocOverlay` TOC overlays wired
- `.gbs-rail-back` / share / print handlers

**Blast radius:** all 23 pages that load the controller
(8 articles + 10 baptisty-rossii + 5 nagornaya).

---

## What this fix does NOT close (must be fixed separately — NOT caused by PS-01)

To prevent the dangerous misattribution in `FALSE_POSITIVES_REGISTRY` (C-07), this
patch does **not** affect:

- **P0-10** (stale Astro component hashes) — completely independent; this patch
  touches no cache-bust logic. (Proved: the crash reproduces even with the
  *correct* current hash `35a91710`; fixing hashes would not have revived the cluster.)
- **NEW-1 / V2-1** (Gill TOC↔body anchor mismatch) — pure markup, independent of JS.
- **NEW-3 / V2-2** (Nagornaya font button selector mismatch) — separate JS file.
- **PS-07** (duplicate `gbsTheme`/`gbsSearch` IDs) — markup, in Astro components.

---

## Reproduction commands (for the implementation agent to self-verify)

```bash
# 1. apply the 2-line patch (move })(); from line 389 to EOF)
# 2. syntax check
node --check js/floating-cluster-controller.js

# 3. (optional) deterministic runtime proof — see incoming/arena-agent-2/
#    runtime-js-bugs-2026-06-25.md §CR-FCC-01 for the full DOM-stub script,
#    then re-run: node test-fcc.js  → expect no ReferenceError

# 4. after deploy: re-run interactive-audit / Playwright on the 23 routes
```

---

## Confidence

**HIGH.** The crash and its resolution are both deterministic (no browser/dist needed).
Three independent agents (arena-agent Playwright, arena-agent-2 Node stub,
arena-agent-verifier-2 jsdom) agree on the root cause and on this exact fix shape.
The patch is a 2-line structural move with `node --check` green and a passing
runtime proof.
