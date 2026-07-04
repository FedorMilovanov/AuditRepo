# PremiumControls — Surgical Finish Report

**Date:** 2026-06-27  
**Source repo:** `FedorMilovanov/gb-is-my-strength`  
**Source branch:** `lane/system-premiumcontrols-surgical-finish-2026-06-27`  
**Source commit:** `c30145d908a083008ba22de146a130b20daa7605`  
**Commit subject:** `[LANE lane/system-premiumcontrols-surgical-finish-2026-06-27] fix(premiumcontrols): finish rate/hash rollout guards`  
**Mode:** surgical/system lane, not bulldozer rewrite  
**Primary scope:** residual PremiumControls synchronization debt after the larger v2.1 / v16 stabilization wave.

---

## 0. Executive summary

This lane does **not** rewrite PremiumControls. It closes three thin but real synchronization gaps that remained after earlier commits:

1. **TTS speed state drift:** legacy `gbx-tts` in `js/site.js` still used `gbx-tts-rate` as the only source of truth, while PremiumControls had moved to canonical `gb:audio:rate` + `gb:tts-rate-change`.
2. **Asset-version helper drift:** `src/lib/asset-version.js` existed but was not updated by `scripts/cache-bust.js`, making it a new stale-hash island after CSS/JS edits.
3. **PremiumControls audit entrypoint / guard gap:** `scripts/premium-controls-rollout-audit.js` existed, but there was no npm script entrypoint and no explicit PremiumControls asset-hash syntax check in the rollout audit.

The lane therefore makes the existing architecture more coherent without changing route UI layout or doing a high-risk CSS/controller rewrite.

---

## 1. What was found

### 1.1 Runtime speed-key mismatch: `site.js` vs PremiumControls

Current PremiumControls controller already uses the canonical key/event pair:

```js
localStorage.getItem('gb:audio:rate') || localStorage.getItem('gbx-tts-rate')
window.dispatchEvent(new CustomEvent('gb:tts-rate-change', { detail: { rate: speed } }))
```

But the legacy sitewide TTS block in `js/site.js` still did this:

```js
rate = parseFloat(localStorage.getItem("gbx-tts-rate")) || 1
localStorage.setItem("gbx-tts-rate", String(rate))
```

This is subtle because `site.js` suppresses its old overlay when `.gb-ember`, `[data-fc-root]`, or `[data-gbs2-theme]` is present. However, the project still contains mixed/hybrid/public layers. Keeping the legacy key as the only key means speed state can diverge between old and new TTS surfaces.

**Risk if unfixed:** user sets speed in one surface, another surface silently reads a different speed; future route migrations revive the inconsistency.

---

### 1.2 PC-003 was not fully closed: helper drift remained

`src/lib/asset-version.js` was intended to be the central helper:

```js
export const ASSET_VERSIONS = {
  'css/floating-cluster.css': '56994ecc',
  'css/premium-controls.css': '35714e73',
  'js/site.js': '158b6e05',
  'js/floating-cluster-controller.js': 'd77256d1',
};
```

But `scripts/cache-bust.js` updated legacy HTML and Astro source references, while the helper itself was not synchronized. That means every future JS/CSS change could leave `asset-version.js` stale even though HTML/Astro had been corrected.

**Risk if unfixed:** a future agent adopts `assetUrl()` and unknowingly emits old hashes, re-opening PC-003 under a new name.

---

### 1.3 `css/premium-controls.css` was not in cache-bust asset set

The cache-bust asset list included `css/floating-cluster.css` and `js/floating-cluster-controller.js`, but not the canonical PremiumControls CSS file:

```js
'css/floating-cluster.css',
'fonts/fonts.css',
```

This leaves the PremiumControls canonical CSS outside the same cache invalidation discipline.

---

### 1.4 Rollout audit existed but was not callable as an npm gate

`script/premium-controls-rollout-audit.js` existed and is useful, but `package.json` had no stable command such as:

```json
"audit:premium-controls": "node scripts/premium-controls-rollout-audit.js"
```

This makes it easier for future agents to miss the audit.

---

## 2. What was changed in source repo

### 2.1 `js/site.js`: legacy TTS now follows canonical PremiumControls rate contract

#### Before

```js
var idx=0,playing=false,resumeTimer=null,rate=parseFloat(localStorage.getItem("gbx-tts-rate"))||1,...
```

```js
localStorage.setItem("gbx-tts-rate",String(rate));
```

#### After

```js
var idx=0,playing=false,resumeTimer=null,rate=parseFloat(localStorage.getItem("gb:audio:rate")||localStorage.getItem("gbx-tts-rate"))||1,...
```

```js
try{
  localStorage.setItem("gb:audio:rate",String(rate));
  localStorage.setItem("gbx-tts-rate",String(rate));
  window.dispatchEvent(new CustomEvent("gb:tts-rate-change",{detail:{rate:rate}}));
}catch(e){
  localStorage.setItem("gbx-tts-rate",String(rate));
}
```

#### Why this exact shape

- `gb:audio:rate` is now canonical.
- `gbx-tts-rate` remains as a compatibility alias.
- The event is dispatched on `window`, matching `floating-cluster-controller.js`, which listens via:

```js
window.addEventListener('gb:tts-rate-change', function (ev) { ... })
```

- The fallback catch preserves old behavior if `localStorage` or `CustomEvent` fails in an unusual browser context.

---

### 2.2 `scripts/cache-bust.js`: include canonical PremiumControls CSS

Added to `ASSETS`:

```js
'css/premium-controls.css',  /* PC-003: canonical PremiumControls CSS */
```

This ensures the canonical CSS participates in the same hash computation and rewrite flow as other public CSS/JS assets.

---

### 2.3 `scripts/cache-bust.js`: synchronize `src/lib/asset-version.js`

Added helper synchronization function:

```js
// ── Обновить src/lib/asset-version.js ────────────────────────────────────────
//
// PC-003 hardening: keep the helper's ASSET_VERSIONS synchronized with the same
// md5 hashes cache-bust writes into legacy HTML and Astro source. Without this,
// the helper itself becomes another stale-hash island after CSS/JS changes.
function bustAssetVersionHelper(hashes) {
  const helperPath = path.join(ROOT, 'src/lib/asset-version.js');
  if (!fs.existsSync(helperPath)) return false;
  const src = fs.readFileSync(helperPath, 'utf8');
  let updated = src;

  for (const [asset, hash] of Object.entries(hashes)) {
    if (!hash) continue;
    const escaped = asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(['"]${escaped}['"]\\s*:\\s*['"])[a-f0-9]{8}(['"])`, 'g');
    updated = updated.replace(re, `$1${hash}$2`);
  }

  if (updated === src) return false;
  if (!DRY_RUN) fs.writeFileSync(helperPath, updated, 'utf8');
  return true;
}
```

Then `main()` calls it before HTML/Astro traversal:

```js
const helperChanged = bustAssetVersionHelper(hashes);
if (helperChanged) console.log('  ✎  src/lib/asset-version.js');
```

And includes it in the final changed-file count:

```js
const totalChanged = changed + astroChanged + (helperChanged ? 1 : 0);
```

---

### 2.4 `src/lib/asset-version.js`: current synchronized values

After running `node scripts/cache-bust.js`, the helper has:

```js
export const ASSET_VERSIONS = {
  'css/site.css': 'b880b524',
  'css/command-palette.css': 'afe33045',
  'css/mobile-hotfix.css': 'c1f7664e',
  'css/floating-cluster.css': 'f5c46704',
  'css/premium-controls.css': '35714e73',
  'js/site.js': 'ee294db6',
  'js/floating-cluster-controller.js': '4f9f4f00',
};
```

---

### 2.5 `package.json`: official PremiumControls audit command

Added:

```json
"audit:premium-controls": "node scripts/premium-controls-rollout-audit.js"
```

Use after a production-like dist exists:

```bash
npm run strangler:build:production-like
npm run audit:premium-controls
```

Or directly:

```bash
node scripts/premium-controls-rollout-audit.js --build
```

---

### 2.6 `scripts/premium-controls-rollout-audit.js`: asset hash syntax check

Added constants:

```js
const FC_CONTROLLER_RE = /floating-cluster-controller\.js(?:\?v=[a-f0-9]{8})?/;
const PREMIUM_ASSET_HASH_RE = /(floating-cluster-controller\.js|floating-cluster\.css|premium-controls\.css)\?v=([^\"'&\s<>]+)/g;
```

Added loop per dist page:

```js
for (const premiumHash of html.matchAll(PREMIUM_ASSET_HASH_RE)) {
  if (!/^[a-f0-9]{8}$/.test(premiumHash[2])) {
    bad(`stale PremiumControls asset hash syntax: /${route}/`,
        `${premiumHash[1]} carries non-md5 cache token ?v=${premiumHash[2]}`);
  }
}
```

And controller detection now uses the explicit regex:

```js
const controllerLoaded = FC_CONTROLLER_RE.test(html);
```

---

## 3. Files changed by intent

Core intended edits:

```text
js/site.js
scripts/cache-bust.js
scripts/premium-controls-rollout-audit.js
package.json
src/lib/asset-version.js
```

Generated/synchronized cache-bust edits:

```text
*.html public source pages
src/components/**/*.astro pages that hardcode ?v= hashes
```

These generated edits are expected because `js/site.js` hash changed from the old value to:

```text
js/site.js?v=ee294db6
```

No content/body/layout rewrite was intended in those HTML/Astro files.

---

## 4. Verification performed

### 4.1 Syntax / diff

```bash
git diff --check
node -c scripts/premium-controls-rollout-audit.js
node -c scripts/cache-bust.js
node -c js/site.js
```

Result: ✅ passed.

---

### 4.2 Fast guards

```bash
npm run migration:metadata:check
npm run native:runtime:audit:strict
npm run data:consistency
npm run content:parity
```

Result: ✅ passed.

Known non-blocking warnings remain around `/izbrannoe/`; they are pre-existing current-head contract debt, not introduced by this lane.

---

### 4.3 Full publication barrier

Node 22 was installed in the Arena sandbox, then:

```bash
npm ci
npm run validate:static-publication
```

Result: ✅ passed.

Notes:
- Existing non-blocking warnings remain for CSS breakpoint policy and some title/og:title mismatches.
- The gate completed successfully after installing dependencies.

---

### 4.4 PremiumControls rollout audit

After the full gate built `dist/`:

```bash
npm run audit:premium-controls
```

Result:

```text
PremiumControls rollout audit: 28/28 passed
✅ PremiumControls rollout contract OK.
```

Observed coverage:

```text
scanned 54 dist pages; 26 carry PremiumControls
```

The audit confirmed:

- controls are scoped;
- `floating-cluster-controller.js` is loaded;
- forbidden app/landing/catalog routes do not accidentally carry article controls;
- no double `floating-cluster.css` delivery;
- no malformed PremiumControls cache-bust syntax was detected.

---

### 4.5 Shared-files guard

After commit with lane tag:

```bash
npm run guard:shared-files
```

Result: ✅ passed.

---

## 5. Known not-owned blocker

`npm run workflows:check` still fails with:

```text
package.json scripts.dist:jsonld:audit: must audit JSON-LD in dist artifact
```

This is not caused by the PremiumControls lane. It matches the already-canonicalized AuditRepo defect:

- B1 workflow-policy mismatch
- B2 `dist:jsonld:audit` contract mismatch

Do not confuse it with PremiumControls runtime health. It should be repaired in a separate workflow-policy lane.

---

## 6. How another agent should apply or review this lane

### Option A — review branch directly

```bash
git fetch origin
git checkout lane/system-premiumcontrols-surgical-finish-2026-06-27
git show --stat c30145d908a083008ba22de146a130b20daa7605
```

Then verify:

```bash
export PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH
npm ci
npm run validate:static-publication
npm run audit:premium-controls
npm run guard:shared-files
```

### Option B — cherry-pick if branch is not merged

```bash
git fetch origin
git checkout -b lane/system-premiumcontrols-surgical-finish-review-2026-06-27 origin/main
git cherry-pick c30145d908a083008ba22de146a130b20daa7605
node scripts/cache-bust.js
npm run validate:static-publication
npm run audit:premium-controls
```

If `cache-bust.js` changes hashes again because source moved, keep the newly computed values.

---

## 7. Regression watchlist after merge

After merge to `main`, re-check:

```bash
node scripts/cache-bust.js --dry-run
npm run validate:static-publication
npm run audit:premium-controls
```

Expected:

```text
✅ Хеши не изменились — HTML/Astro не тронуты.
✅ PremiumControls rollout contract OK.
```

If `node scripts/cache-bust.js --dry-run` reports files changed, then another commit edited CSS/JS without syncing hashes. Run real `node scripts/cache-bust.js` and commit the generated hash-only changes.

---

## 8. Important boundaries: what this lane intentionally did not do

This lane did **not**:

- rewrite `floating-cluster-controller.js`;
- remove or consolidate the 77KB `css/floating-cluster.css` legacy/runtime mass;
- migrate Gill rail architecture;
- change PlayEmber visual geometry;
- modify Nagornaya Tailwind exception surfaces;
- change content, headings, or public article text.

Those are separate higher-risk lanes and should follow the surgical sequencing already described in PremiumControls design reports.

---

## 9. Final status

**PremiumControls residual runtime/hash rollout synchronization is materially improved and verified.**  
The branch is safe for reviewer consideration as a focused system-lane patch, with the caveat that workflow-policy mismatch remains a separate known current-head issue.
