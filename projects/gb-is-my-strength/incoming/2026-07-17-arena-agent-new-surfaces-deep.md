# Agent Audit Report — New Surface Deep Pass 2 (D-2, ST-CACHE, GillSeriesChrome paths, floating-cluster @layer, SW)

## Meta

- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength
- Agent: Arena Agent (arena.ai)
- Date: 2026-07-17
- Audited branch/ref: main
- Audited anchor (SHA): 485db8c25287fa9bd2f53a5356885f02e4b81f4b
- Environment: static source inspection via GitHub API
- Build mode: source + dist artefacts where applicable
- Scope: D-2 residual (css:layer:validate breadth), ST-CACHE (sw.js, CACHE_VERSION, PRECACHE_ASSETS vs asset-version.js), floating-cluster.css @layer structure, GillSeriesChrome relative script paths, genesis6 route depth, cache-bust-assets.js coverage, home.css @layer audit
- Explicit exclusions: runtime SW behaviour, full Pagefind index, Playwright browser sessions
- Signal class: Product
- Proof state: FAIL (D-2 confirmed current + new evidence), PASS (GillSeriesChrome depth), mixed (floating-cluster.css)
- Claim boundary: HEAD at anchor SHA 485db8c
- Preservation boundary: anchored to SHA; do not update on Product movement
- Semantic owner: FedorMilovanov/gb-is-my-strength
- Overlapping active owner/PR/branch check: PR #1714 merged — no overlap

---

## 1. D-2 residual — css:layer:validate breadth — CONFIRMED CURRENT + EXTENDED

### Confirm `D-2` — `css:layer:validate` covers only `site.css`

- Target finding: MASTER residual `D-2`
- Evidence angle: direct source read of `package.json` and `scripts/css-layer-validator.js` at anchor SHA
- My evidence anchor: 485db8c

**Exact source witness:**

`package.json`:
```
"css:layer:validate": "node scripts/css-layer-validator.js css/site.css --ceiling=200"
```

`css-layer-validator.js` L131–L138: the script accepts a single `cssFile` from `process.argv` — it validates exactly **one file** per invocation. The `package.json` script hardcodes `css/site.css` only.

**Extended scope — what else has @layer and is NOT validated:**

| File | @layer ORDER | @layer BLOCKS | Validated? |
|---|---|---|---|
| `css/site.css` | ✅ `reset,base,components,utilities` | ✅ reset, base, components, utilities | ✅ YES |
| `css/home.css` | ✅ `reset,base,components,utilities` | ✅ base, components | ❌ NOT validated |
| `css/floating-cluster.css` | ❌ **NONE** | ✅ `components` only | ❌ NOT validated |

**New sub-finding: `floating-cluster.css` uses `@layer components {}` with NO preceding `@layer ... ;` order declaration.**

`css/floating-cluster.css` L33: `@layer components {` — opening a named layer block at the very start of the cascade scope, with no `@layer reset,base,components,utilities;` order statement preceding it. Per CSS Cascade Layers spec, layers are ordered by first encounter; without an explicit order declaration, layer precedence is implicit and could conflict with `site.css` / `home.css` that DO declare explicit order. When multiple stylesheets are loaded on the same page and both define `@layer components`, the layer ordering is determined by sheet load order. If `floating-cluster.css` loads before `site.css`, its `components` layer could take a different precedence slot than intended.

- Evidence type: verified-source
- Confidence: high for D-2 breadth (mechanism clear); medium for floating-cluster cascade conflict (depends on load order, which is not deterministic from source alone)
- What this evidence does **not** prove: does not prove a current visual regression; CSS layer conflicts may be benign in practice depending on specificity; does not prove any user-visible breakage.

---

## 2. ST-CACHE — Service Worker cache model

### Finding `SW-CACHE-VERSION-STATIC` — `sw.js` CACHE_VERSION is a hardcoded string, not tied to `SITE_CONFIG.version` or asset hashes

- Kind: architecture risk / ST-CACHE candidate
- Suggested impact: medium
- Route(s) / owner(s): `sw.js`
- Observed on anchor: 485db8c

**Evidence:**

`sw.js` L2: `const CACHE_VERSION = 'gb-v197-bible-legacy-authority-20260804';`

This is a manually maintained semantic string. The SW cache version is updated by hand when content/assets change, NOT automatically tied to:
- `SITE_CONFIG.version` (which uses `Date.now()` at build time — itself a non-determinism concern per `BUILD-NONDETERMINISTIC-DATENOW` in SUPER_AUDIT)
- `asset-version.js` ASSET_VERSIONS hashes
- `cache-bust-assets.js` computed MD5 hashes

**PRECACHE_ASSETS vs ASSET_VERSIONS drift:**

`sw.js` PRECACHE_ASSETS lists bare paths WITHOUT `?v=` query strings:
```js
'/css/floating-cluster.css',  // bare, no ?v=
'/js/floating-cluster-controller.js', // bare, no ?v=
```

`asset-version.js` and `cache-bust-assets.js` track hashed versions for the SAME files. Pages load them as `/css/floating-cluster.css?v=85a1bfb6` (with version query). But `sw.js` precaches them at `/css/floating-cluster.css` (without version query).

**Consequence:** When a browser fetches `/css/floating-cluster.css?v=85a1bfb6`, the SW intercepts the request. The SW cache key is the full URL including query string. If the SW precached `/css/floating-cluster.css` (bare), it does NOT have a cache entry for `/css/floating-cluster.css?v=85a1bfb6` — the request falls through to network. This is likely intentional (LAZY_NO_PRECACHE pattern), but creates an asymmetry: the SW precaches stale-cacheable bare URLs, while runtime uses busted versioned URLs.

**Note:** `sw-register.js` L3 appends `?v=siteVersion` to the SW URL itself: `'/sw.js?v=' + siteVersion`. SITE_CONFIG.version (Date.now() at build) is what rotates the SW registration. A new deploy = new version = new SW = new cache. This is a valid albeit fragile model.

- Evidence type: verified-source
- Confidence: medium — the interaction between bare-URL precache and version-query fetches requires runtime verification
- What this evidence does **not** prove: does not prove SW cache misses are occurring; does not prove users are getting stale assets; the model may be intentionally designed so precached bare URLs are superseded by versioned URLs (two independent caches)

---

### Finding `SW-PRECACHE-VERSION-DRIFT-RISK` — NagornayaPageFooterRuntime hardcoded `?v=` not tied to CACHE_VERSION

- Kind: latent cache coherence risk
- Route(s) / owner(s): `src/components/nagornaya/_shared/NagornayaPageFooterRuntime.astro`, `sw.js`
- Observed on anchor: 485db8c

**Evidence:**

`NagornayaPageFooterRuntime.astro` uses hardcoded hashes:
```html
<script defer src="/js/enhancements.js?v=1b5392b1" is:inline></script>
```

`sw.js` PRECACHE_ASSETS precaches `/js/enhancements.js` at bare URL. `asset-version.js` records the current hash. The hardcoded hash `1b5392b1` in NagornayaPageFooterRuntime **matches** the current ASSET_VERSIONS entry for `js/enhancements.js`. So at this anchor there is no drift.

But because the hash is hardcoded rather than via `assetUrl()`, a future `cache-bust.js` run will update `asset-version.js` and `assetUrl()` consumers but NOT this file. The next deploy's pages would then request `/js/enhancements.js?v=<new_hash>` which is a cache miss at the SW level AND a network fetch — correct behaviour (forces update), but the inconsistency between consumers of the same file means the nagornaya route's `enhancements.js` version could diverge from other routes that use `assetUrl()`.

- Evidence type: verified-source  
- Confidence: medium (no current drift confirmed; mechanism is clear)

---

## 3. GillSeriesChrome relative script paths — PASS with caveat

### Finding `GILL-RELATIVE-PATHS-DEPTH-VERIFIED` — relative paths correct for current routes; fragile for depth-1 routes

- Kind: risk (low)
- Route(s) / owner(s): `src/components/article-pilots/gill-series/GillSeriesChrome.astro`
- Observed on anchor: 485db8c

**Evidence:**

`GillSeriesChrome.astro` uses relative paths:
```html
<script is:inline defer src="../../js/bookmark-engine.js?v=fba4e559">
```

Route depth audit:
- `/baptisty-rossii/<slug>/` → depth 2, `../../` = root `/` → ✅ correct
- `/hard-texts/<slug>/` → depth 2, `../../` = `/` → ✅ correct (genesis6 articles at `/hard-texts/<slug>/`)
- `/articles/<slug>/` → depth 2, `../../` = `/` → ✅ correct (if any article used GillSeriesChrome)
- `/nagornaya/chast-1/` → depth 2, `../../` = `/` → ✅ but nagornaya does NOT use GillSeriesChrome; it uses NagornayaPageFooterRuntime with absolute `/js/` paths

**Caveat:** `hard-texts/genesis-6/` landing page is at depth 3 (`/hard-texts/genesis-6/index.astro`). It uses `Genesis6Hub.astro` via `BaseLayout`, NOT `GillSeriesChrome`. Individual genesis6 articles are at depth 2 (`/hard-texts/<slug>/`). So no current depth mismatch.

However: GillSeriesChrome is **not** using `assetUrl()` — it has its own hardcoded `?v=` hashes (same as the NagornayaPageFooterRuntime pattern). These match current ASSET_VERSIONS at this anchor, but will drift when `cache-bust.js` runs.

- Evidence type: verified-source
- Confidence: high (depth analysis is mechanically deterministic from route structure)
- What this does **not** prove: does not prove any current 404; the depth is correct for all current consumers.

---

## 4. D-2 extended — `home.css` has @layer but no validator coverage

### Finding `D-2-HOME-CSS-UNLAYERED-RULES` — `home.css` has both layered and unlayered rules; unlayered rules take precedence over @layer

- Kind: defect (low-medium)
- Route(s) / owner(s): `css/home.css`
- Observed on anchor: 485db8c

**Evidence:**

`home.css` structure:
- L0: `@layer reset,base,components,utilities;` — order declaration present ✓
- L0: `@layer base{:root{...}}` — base variables in layer ✓  
- Layer blocks: `base`, `components`

But the `css-layer-validator.js` is NOT run against `home.css`. The validator would check that all rules are inside declared layers and report the unlayered ratio.

`home.css` has rules outside any `@layer` block. Sample (verified by source read): rules like `.h-article-list.h-article-list--grid{display:grid;...}` appear at the top level without an enclosing `@layer`. **Unlayered rules have higher specificity than layered rules** in the CSS Cascade — they will win over any `@layer components` rule regardless of selector specificity. If any rule in home.css was intended to be overridable by `floating-cluster.css`'s `@layer components`, it won't be.

- Evidence type: verified-source  
- Confidence: medium — the presence of unlayered rules is confirmed; whether any current visual bug results requires a full cascade analysis not possible from source alone
- Possible mechanism: `home.css` was not migrated to full layer coverage during the @layer adoption; `css:layer:validate` not covering it means the 80% layered target is unverified for this file

---

## 5. Root-cause clusters — this pass

### Cluster `CSS-LAYER-GOVERNANCE-GAP`

- Findings: D-2 (confirmed), D-2-HOME-CSS-UNLAYERED-RULES (new), floating-cluster.css no order declaration (new)
- Common root: The `css:layer:validate` NPM script hardcodes `css/site.css` as its single target. `home.css` (112kB) and `floating-cluster.css` (226kB) are not validated. Each has distinct @layer structure problems: `home.css` has unlayered rules, `floating-cluster.css` has no order declaration.
- System theme: ST-CACHE (indirect), ST-RUNTIME-OWNERSHIP
- Recommended action: Add `home.css` and `floating-cluster.css` invocations to `css:layer:validate` (or a new `css:layer:validate:all` composite script). Fix `floating-cluster.css` to include an explicit `@layer` order declaration.

### Cluster `HARDCODED-VERSION-BYPASS` (extended from pass 1)

- Findings: NEW-ASSET-VERSION-DRIFT (pass 1), SW-PRECACHE-VERSION-DRIFT-RISK (this pass), GILL-RELATIVE-PATHS-DEPTH-VERIFIED (this pass, GillSeriesChrome hardcoded ?v=)
- Common root: Three independent components bypass `assetUrl()`: NagornayaPageFooterRuntime, GillSeriesChrome, and sw.js PRECACHE_ASSETS bare URLs. All are currently in sync with ASSET_VERSIONS at this anchor, but will drift independently after the next `cache-bust.js` run.
- System theme: ST-CACHE
- Recommended action: Migrate GillSeriesChrome script/style references to use `assetUrl()`. Keep NagornayaPageFooterRuntime migration from pass 1 recommendation. Verify sw.js PRECACHE_ASSETS bare-URL strategy is intentional (likely is — SW uses CACHE_VERSION rotation not hash rotation for cache invalidation).

---

## 6. Summary table — new findings this pass

| ID | Finding | Type | Impact | Boundary |
|---|---|---|---|---|
| `D-2-CONFIRMED` | `css:layer:validate` only validates `site.css`; `home.css` and `floating-cluster.css` uncovered | defect (confirmed) | medium | `package.json`, `scripts/css-layer-validator.js` |
| `D-2-FC-NO-ORDER` | `floating-cluster.css` has `@layer components {}` block without `@layer ..., components, ...;` order declaration | defect (new) | low-medium | `css/floating-cluster.css` L33 |
| `D-2-HOME-UNLAYERED` | `home.css` has unlayered rules above `@layer` blocks; unlayered rules win the cascade unconditionally | defect (new) | low-medium | `css/home.css` |
| `SW-CACHE-VERSION-STATIC` | `sw.js` `CACHE_VERSION` is manually maintained string, not auto-derived from asset hashes | risk | medium | `sw.js` L2 |
| `SW-PRECACHE-BARE-URLS` | PRECACHE_ASSETS uses bare paths; runtime pages use versioned `?v=` URLs → two independent caches | risk/architecture | low | `sw.js` L18-50 |
| `GILL-HARDCODED-VERSIONS` | `GillSeriesChrome.astro` hardcodes `?v=` hashes like NagornayaPageFooterRuntime — will drift on next `cache-bust.js` run | risk | low | `src/components/article-pilots/gill-series/GillSeriesChrome.astro` L53-63 |
| `GILL-RELATIVE-PATH-DEPTH-PASS` | Relative `../../js/` paths in GillSeriesChrome correct for all current consumers (depth-2 routes) | PASS | — | verified |
| `HOME-CSS-LAYER-ORDER-PASS` | `home.css` HAS a valid `@layer order` declaration | PASS | — | `css/home.css` L0 |
