# Arena Agent 2 — corrections to UNIFIED_BUG_LEDGER — 2026-06-25

**Agent:** `arena-agent-2`
**Method:** runtime Node DOM-stub execution + committed root-source grep (distinct
from the Playwright/dist and code-audit methods used to build the unified ledger).
**Target:** `verified/UNIFIED_BUG_LEDGER_2026-06-25.md`
**Intent:** flag one false positive, correct two root causes, add two net-new bugs.
This is an **amendment**, not a rewrite — the unified ledger is left untouched.

---

## A. FALSE POSITIVE — P0-2 should be DOWNGRADED/CLOSED

### Ledger claim (P0-2)
> `floating-cluster.css` — EMPTY file. File contains only comment header; all CSS in `site.css` + inline.

### Verification (source)
```bash
$ wc -l  css/floating-cluster.css   →  1869 lines
$ wc -c  css/floating-cluster.css   →  68596 bytes
$ grep -cE "^\.|#|^@media|^\*|--|{|}" css/floating-cluster.css   →  911 rule/selector hits
```
The file is a **full 1869-line / 68 KB stylesheet** (911 real CSS rules). The
P0-2 finding is incorrect. Whoever filed it likely `cat`-ed a *different* empty
file (e.g. one of the legacy `js/*.js` zero-line minified stubs, or a stale
working-tree state), or confused `floating-cluster.css` with an unrelated empty
asset.

**Recommendation:** move P0-2 to CLOSED (false positive), like P0-4/P0-5.

---

## B. ROOT-CAUSE CORRECTION — PS-01 (`qs is not defined`)

### Ledger claim
> Root cause: "`floating-cluster-controller.js` loads before `qs` defined".

### Actual root cause
It is a **lexical scope** defect, NOT a load-order / timing defect:

- `qs`/`qsa` are declared **inside** the module's IIFE (lines 32–33).
- The IIFE **closes** at line 389 (`})();`).
- Three functions — `initTocPopups` (394), `initActionHandlers` (457),
  `initPlayExpand` (483) — are declared **after** the close, i.e. in **global
  scope**.
- Under `<script defer>`, `document.readyState !== 'loading'`, so `ready()`
  invokes the init callback **synchronously** → `initTocPopups()` calls `qs`
  → `ReferenceError: qs is not defined` → the whole init aborts before `initCluster`.

### Why the correction matters for implementation
"Loads before qs defined" implies a fix like "reorder script tags" or "defer qs".
That would **not** fix it. The real fix is to **move the three helper functions
inside the IIFE** (or move the `})();` close to end-of-file).

### Evidence (deterministic, independent of the dist build)
A minimal DOM stub with `readyState:'complete'` + `require()`-ing the file throws
`ReferenceError: qs is not defined` — reproduced without `npm install` or a
browser (full trace in `incoming/arena-agent-2/2026-06-25/runtime-js-bugs-2026-06-25.md`).

---

## C. ROOT-CAUSE CORRECTION — P0-1 (Gill Rail SAVE button)

### Ledger claim (P0-1)
> Root cause: "`data-action=\"save\"` not handled by fc-controller".

### Verification (source)
The markup uses `data-fc-action="save"` (which IS handled), **not** `data-action="save"`:
```bash
$ grep -c 'data-fc-action="save"' src/components/ui/floating-cluster/SaveButton.astro       → 1
$ grep -c 'data-fc-action="save"' src/components/article-pilots/gill-context/GillContextPageChrome.astro  → 1
```
`floating-cluster-controller.js` handles `data-fc-action` via click delegation
(`else if (action === 'save') { saveCurrent(btn); }`).

### Actual situation
The save button is dead **because** of PS-01 (init aborts before `initCluster`
binds the click handler) — i.e. P0-1 is a **symptom of PS-01**, not a separate
attribute-mismatch bug. Once PS-01 is fixed, `data-fc-action="save"` works as-is.

**Recommendation:** fold P0-1 into PS-01 (or into B-03 "dead save controls"),
dropping the inaccurate `data-action` framing.

---

## D. CONFIRM — P0-7 / P0-8 (cache-bust vs SW precache divergence)

### Ledger claim
> `css/site-layered.css` / `js/site-modules.js` are in SW precache but missing from `cache-bust.js` ASSETS.

### Verification (source)
```bash
$ grep -c 'site-layered.css\|site-modules.js' sw.js               → 2 (both present in PRECACHE_ASSETS)
$ grep -c 'site-layered.css\|site-modules.js' scripts/cache-bust.js  → 0 (NEITHER present)
```
Confirmed. The SW precaches both, but `cache-bust.js` never version-busts them,
so their `?v=` never changes even when the file does. **P0-7 and P0-8 are real.**

(Note: this is the same class of defect as my B-08 — SW also does
`cache.match(request)` without `ignoreSearch`, so even the *versioned* request
would miss the bare precache entry. B-08 + P0-7/P0-8 compound each other.)

---

## E. NET-NEW BUG — N-1: `initPlayExpand` `.gb-floater` filter (P1)

**Not in the unified ledger.** The speed-select panel (`0.75×…2×`) is only built
for embers inside `.gb-floater`:
```js
// floating-cluster-controller.js, initPlayExpand()
if (!ember.closest('.gb-floater')) return;
```
On Gill v16 pages the embers live in `.gbs-rail-foot` / `.mobile-bottom-bar`
(`.gb-floater` is absent from Gill markup — verified by grep). So even after
PS-01 is fixed, the speed selector never appears on Gill pages. Masked today by
PS-01; will surface the moment PS-01 is repaired, so it should be fixed in the
**same edit**.

---

## F. NET-NEW BUG — N-2: `sw-register.js` toast logic (P2)

**Not in the unified ledger.** Function `r()`:
```js
var e=document.getElementById("gb-sw-toast");
e&&e!==a || e!==a&&document.body.appendChild(a)
```
Truth-table check: when a *foreign* node already holds `#gb-sw-toast`,
`e&&e!==a` is true → short-circuit → `appendChild` skipped → the real toast
node stays detached → update/offline/cached notifications never render. Fix:
`if (!e || e !== a) document.body.appendChild(a);`

---

## G. Summary of amendments

| Ledger item | Action | Confidence |
|---|---|---|
| **P0-2** `floating-cluster.css` EMPTY | → **CLOSE (false positive)** | high (1869 lines, 911 rules) |
| **PS-01** root cause "loads before qs" | → **correct to IIFE-scope defect** | high (Node repro) |
| **P0-1** "data-action save" | → **fold into PS-01; attribute is correct** | high (grep) |
| **P0-7 / P0-8** cache-bust divergence | → **CONFIRM** | high (grep) |
| **(none)** speed panel filter | → **ADD N-1 (P1)** | high (grep) |
| **(none)** sw-register toast | → **ADD N-2 (P2)** | high (truth-table) |

**Net effect on counts:** 40 → 41 confirmed (−1 false positive P0-2, +1 net-new N-1,
+1 net-new N-2; P0-1 folded so −1 in spirit but its symptom already counted under
PS-01/PS-03). The headline P0 count drops by 1 (P0-2 false positive), which the
final verifier should reflect.
