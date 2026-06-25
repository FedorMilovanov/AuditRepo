# Runtime JS bugs — raw forensic detail — 2026-06-25

Agent: `arena-agent-2`
Source: `FedorMilovanov/gb-is-my-strength` @ `main`, cloned fresh.
This file holds the exact line numbers, code excerpts, and the deterministic Node
repro for the findings summarized in `cross-validation-runtime-2026-06-25.md`.

---

## CR-FCC-01 — `qs is not defined` (P0, CONFIRMED, two independent methods)

### File: `js/floating-cluster-controller.js`

### Structure (exact line numbers from the committed file)

```
17:  (function () {                         ← IIFE OPEN
18:    'use strict';
...
32:    function qs(sel, root) { ... }       ← LOCAL to IIFE
33:    function qsa(sel, root) { ... }      ← LOCAL to IIFE
...
343:   ready(function () {
344:     // 1. Inject SVG into ember buttons (if SSR did not)
345:     initEmbers();
346:     initTocPopups();                   ← THROWS HERE (calls qs)
347:     initActionHandlers();              ← never reached
348:     initPlayExpand();                  ← never reached
349:
350:     // 2. Init ALL cluster roots
351:     var roots = qsa('[data-fc-root]'); ← never reached
...
389:  })();                                 ← IIFE CLOSE
390:
394:  function initTocPopups() {            ← GLOBAL scope, AFTER close
395:    var seriesToc = qs('#seriesTocOverlay');   ← qs undefined here
...
457:  function initActionHandlers() { qs('.gbs-rail-back'); ... }   ← global
483:  function initPlayExpand() { qsa('.gb-ember'); ... }           ← global
```

### Why it throws

`ready()` defers via `DOMContentLoaded` only when `document.readyState === 'loading'`.
The file is loaded with `<script ... defer>`, so by the time it executes the
document is parsed and `readyState` is `'interactive'` (or `'complete'`) → `ready()`
runs the callback **synchronously** → `initTocPopups()` runs → references `qs`
(local to the now-closed IIFE) → **`ReferenceError: qs is not defined`**.

There is no try/catch around the init callback, so the whole `ready` block aborts.
Everything after `initTocPopups()` (line 346) is dead:

- `initActionHandlers()`, `initPlayExpand()`
- `roots.forEach(... initCluster(root) ...)` — click delegation never bound
- `initGillRail()`, `syncThemeButtons()`, `syncSaveState()`, `initKeyboard()`
- `window.__gbCluster = {...}` — public API never created

### Deterministic Node repro (no npm install, no browser)

```bash
# /tmp/test-fcc.js — minimal DOM stub, readyState:'complete'
cat > /tmp/test-fcc.js << 'EOF'
const store = {}; const evts = {};
function mkEl(){return{_cls:new Set(),_ds:{},style:{},children:[],
  classList:{add(c){this._t._cls.add(c)},remove(c){this._t._cls.delete(c)},
    toggle(c,f){},contains(c){return false}},
  querySelector(){return null}, querySelectorAll(){return []},
  addEventListener(){}, setAttribute(){}, getAttribute(){return null},
  insertAdjacentHTML(){}, appendChild(){}, insertBefore(c){return c},
  closest(){return null}, matches(){return false},
  getBoundingClientRect(){return{left:0,top:0,right:0,bottom:0,width:0,height:0}},
  parentNode:null,nextSibling:null}}
const body=mkEl(); body._t=body; body.classList._t=body;
const docEl=mkEl(); docEl._t=docEl; docEl.classList._t=docEl;
global.document={readyState:'complete',documentElement:docEl,body:body,
  createElement:mkEl,createComment(){return mkEl()},
  querySelector(){return null},querySelectorAll(){return[]},addEventListener(){},dispatchEvent(){}}
global.window={matchMedia(){return{matches:false}},SITE_CONFIG:{},location:{pathname:'/'},scrollTo(){},addEventListener(){}}
global.navigator={}; global.location=global.window.location;
global.localStorage={getItem(k){return store[k]||null},setItem(k,v){store[k]=String(v)},removeItem(k){delete store[k]}}
global.requestAnimationFrame=()=>0;
try{require('/home/user/gb-is-my-strength/js/floating-cluster-controller.js');
  console.log('OK: no crash')}catch(e){
  console.log('CRASH:',e.constructor.name,'-',e.message)}
EOF
node /tmp/test-fcc.js
# → CRASH: ReferenceError - qs is not defined
```

### Affected routes (root source — have BOTH `[data-fc-root]` AND load the controller)

```
./articles/20-antisovetov-pastoru/index.html
./articles/dzhon-gill-chast-1-chelovek/index.html
./articles/dzhon-gill-chast-2-uchenyi/index.html
./articles/dzhon-gill-chast-3-nasledie/index.html
./articles/dzhon-gill-istoricheskiy-kontekst/index.html   ← flagship v16 page
./articles/dzhon-gill-spravochnik/index.html
./articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html
./articles/kod-da-vinchi/index.html
```

(`arena-agent` adds 5 Nagornaya routes that load the controller only in the dist
build — consistent: dist wires the controller onto more pages.)

### Minimal fix

Move the closing `})();` from line 389 to the **end of the file** (after
`initPlayExpand`), so all three helper functions live inside the IIFE. Example
patch shape:

```
- })();                 (line 389)
+ void 0;               (keep IIFE open here)
  ...
  function initPlayExpand() { ... }
+ })();                 (end of file)
```

(or move the three functions above the `ready(...)` block, inside the IIFE).

---

## CR-FCC-02 — `initPlayExpand` hard `.gb-floater` filter (P1, latent, NEW)

### File: `js/floating-cluster-controller.js`, `initPlayExpand()` (~line 491)

```js
function initPlayExpand() {
  qsa('.gb-ember').forEach(function(ember) {
    if (!ember.closest('.gb-floater')) return;   // ← hard filter
    ...
```

### Evidence that Gill embers are NOT in `.gb-floater`

```bash
$ grep -rl "gb-floater" --include="*.html" --include="*.astro" .
./articles/20-antisovetov-pastoru/index.html
./articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html
./articles/kod-da-vinchi/index.html
./src/components/ui/floating-cluster/SeriesLiteCluster.astro
./src/components/ui/floating-cluster/SingleArticleCluster.astro
# ← NO gill-context / gill-part* components; Gill embers live in .gbs-rail-foot / .mobile-bottom-bar
```

The flagship `GillContextPageChrome.astro` renders `<PlayEmber>` inside
`.gbs-rail-foot` and `.mobile-bottom-bar`, never inside `.gb-floater`.

→ On Gill v16 pages the speed panel is never created. Masked today by CR-FCC-01.

### Fix

```js
- if (!ember.closest('.gb-floater')) return;
+ if (!ember.closest('.gb-floater, .gbs-rail-foot, .mobile-bottom-bar, [data-fc-root]')) return;
```

---

## CR-HERM-01 — hidden readTime 35 vs visible 50 (P1, CONFIRMED in root)

### File: `articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html`

```bash
$ grep -n 'data-pagefind-meta="readTime"' .../index.html
806:<span data-pagefind-meta="readTime" hidden="">35</span>

$ grep -oE "readingTime.:[0-9]+|⏱[^<]*мин" .../index.html | head
readingTime": 50
⏱ 50 мин
```

Hidden Pagefind value **35** vs SITE_CONFIG/visible **50**. Same as PS-06.

---

## CR-SW-01 — sw-register.js toast logic (P2, CONFIRMED, NEW)

### File: `js/sw-register.js`, function `r()`

```js
function r(){
  if(document.body){
    var e=document.getElementById("gb-sw-toast");
    e&&e!==a || e!==a&&document.body.appendChild(a)
  }
}
```

### Truth table

| `e` (existing #gb-sw-toast) | `a` (our node) | result | correct? |
|---|---|---|---|
| null (none) | our node | `appendChild` runs | ✅ |
| === a (already ours) | our node | no append | ✅ |
| !== a (foreign node, same id) | our node | `e&&e!==a` = true → short-circuit, **no append** | ❌ toast never attached |

### Node truth-table check

```bash
$ node -e '
function sim(e,a){return (e&&e!==a)||(e!==a&&"APPEND");}
console.log(sim(null,{}));        // APPEND  ✅
console.log(sim({},{}));          // false   ✅
console.log(sim({a:1},{}));'      // true (NOT APPEND) ❌
```

When a foreign element already holds the id, the real toast node stays detached
→ update/offline/cached toasts never render.

### Fix

```js
- e&&e!==a || e!==a&&document.body.appendChild(a)
+ if (!e || e !== a) document.body.appendChild(a);
```

---

## CR-SW-02 — SW precache vs `?v=` assets (P2, CONFIRMED, NEW)

### File: `sw.js`

```js
var PRECACHE_ASSETS=["/js/site.js","/css/site.css", ...];  // bare paths
...
function cacheFirst(t,e){
  ...
  return caches.open(e).then(function(e){
    return e.match(t).then(function(i){   // ← match() default: query string counts
```

### Why precache misses

Pages request versioned URLs via cache-bust: `/js/site.js?v=133dfac1`.
`cache.match()` compares the **full URL including query string** by default, so
the bare precache entry `/js/site.js` never matches the live request
`/js/site.js?v=133dfac1`. The asset only caches on its first real `fetch` (with
the `?v=` param). HTML pages are unaffected (navigate via stale-while-revalidate),
but the ~28 precached CSS/JS entries are effectively wasted and offline-by-default
for them is not achieved.

### Fix

```js
- return e.match(t).then(...)
+ return e.match(t, { ignoreSearch: true }).then(...)
```
(or precache the exact versioned URLs that `scripts/cache-bust.js` writes into HTML).

---

## Negative results (clean) — recorded to avoid duplicate work

- `node --check` PASSES on every `js/*.js` and `sw.js` (crash is runtime, not syntax).
- `wc -l == 0` on several files ≠ empty; they are single-line minified
  (`js/search.js` = 33 KB, `js/highlights.js` = 14 KB).
- `sitemap.xml`: 43 URLs, 0 broken (Python resolver check).
- `series.json` ↔ folders ↔ `data-gbs2-series`: consistent.
- `manifest.json` icons all exist.
- `update-meta.js` ASTRO_PAGE_HEAD_MAP: all 10 components exist and contain
  `article:modified_time` literal → cascade fix correct.
- `BookmarkEngine` exports: `saveNow`, `clearCurrent`, `getCurrent`,
  `getAllForSite`, `getResumeCandidate`, `getInProgressArticles`,
  `getCompletedArticles`, `markCompleted`, `clearAllForSite`, `destroy`.
