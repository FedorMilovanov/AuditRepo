# PremiumControls — Handoff Patch Guide

**Date:** 2026-06-27  
**Purpose:** give another agent enough exact context to reproduce/apply/review the surgical finish without relying on chat.  
**Source lane:** `lane/system-premiumcontrols-surgical-finish-2026-06-27`  
**Source commit:** `c30145d908a083008ba22de146a130b20daa7605`

---

## 1. Problem statement

PremiumControls had already received large repairs, but three small contract gaps remained:

| Area | Symptom | Fix type |
|---|---|---|
| TTS rate | old `site.js` still used `gbx-tts-rate` only | runtime compatibility fix |
| PC-003 hash parity | `src/lib/asset-version.js` could stay stale | cache-bust hardening |
| PC-006 rollout audit | audit existed but no npm gate / weak hash check | package script + stronger audit |

This guide gives exact patches and verification commands.

---

## 2. Patch 1 — `js/site.js` canonical TTS speed key

### Locate legacy TTS block

Search:

```bash
grep -n "gbx-tts-rate\|gb:audio:rate\|gb:tts-rate-change" js/site.js
```

### Required behavior

Read order:

```js
gb:audio:rate -> gbx-tts-rate -> 1
```

Write behavior:

```js
gb:audio:rate = rate
gbx-tts-rate = rate
window.dispatchEvent(new CustomEvent('gb:tts-rate-change', { detail: { rate } }))
```

### Exact replacement pattern

Replace old initialization:

```js
rate=parseFloat(localStorage.getItem("gbx-tts-rate"))||1
```

with:

```js
rate=parseFloat(localStorage.getItem("gb:audio:rate")||localStorage.getItem("gbx-tts-rate"))||1
```

Replace old setter:

```js
localStorage.setItem("gbx-tts-rate",String(rate));
```

with:

```js
try{localStorage.setItem("gb:audio:rate",String(rate));localStorage.setItem("gbx-tts-rate",String(rate));window.dispatchEvent(new CustomEvent("gb:tts-rate-change",{detail:{rate:rate}}));}catch(e){localStorage.setItem("gbx-tts-rate",String(rate));}
```

### Why `window.dispatchEvent`, not `document.dispatchEvent`

`js/floating-cluster-controller.js` listens with:

```js
window.addEventListener('gb:tts-rate-change', function (ev) { ... })
```

Dispatching on `document` would silently miss the listener.

---

## 3. Patch 2 — `scripts/cache-bust.js` includes PremiumControls CSS

In `ASSETS`, ensure this exists:

```js
'css/premium-controls.css',  /* PC-003: canonical PremiumControls CSS */
```

Near the existing block:

```js
'css/floating-cluster.css',
'css/premium-controls.css',
'fonts/fonts.css',
```

---

## 4. Patch 3 — `scripts/cache-bust.js` synchronizes `asset-version.js`

Add this function before `main()`:

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

Then in `main()`, after hash computation and before HTML traversal:

```js
// 2. Синхронизировать helper с теми же хешами (PC-003)
const helperChanged = bustAssetVersionHelper(hashes);
if (helperChanged) console.log('  ✎  src/lib/asset-version.js');
```

Update final count:

```js
const totalChanged = changed + astroChanged + (helperChanged ? 1 : 0);
```

And final log:

```js
console.log(`✅  Файлов ${action}: ${totalChanged} (helper: ${helperChanged ? 1 : 0}, HTML: ${changed}, Astro: ${astroChanged})\n`);
```

---

## 5. Patch 4 — `package.json` npm entrypoint

Add script:

```json
"audit:premium-controls": "node scripts/premium-controls-rollout-audit.js"
```

Expected location near other audit/check scripts is fine. JSON must remain valid.

Verify:

```bash
node -e "JSON.parse(require('fs').readFileSync('package.json','utf8')); console.log('package ok')"
```

---

## 6. Patch 5 — strengthen rollout audit hash checks

In `scripts/premium-controls-rollout-audit.js`, add:

```js
const FC_CONTROLLER_RE = /floating-cluster-controller\.js(?:\?v=[a-f0-9]{8})?/;
const PREMIUM_ASSET_HASH_RE = /(floating-cluster-controller\.js|floating-cluster\.css|premium-controls\.css)\?v=([^\"'&\s<>]+)/g;
```

Then inside the per-page loop after reading `html`:

```js
for (const premiumHash of html.matchAll(PREMIUM_ASSET_HASH_RE)) {
  if (!/^[a-f0-9]{8}$/.test(premiumHash[2])) {
    bad(`stale PremiumControls asset hash syntax: /${route}/`,
        `${premiumHash[1]} carries non-md5 cache token ?v=${premiumHash[2]}`);
  }
}
```

Use explicit controller regex:

```js
const controllerLoaded = FC_CONTROLLER_RE.test(html);
```

instead of a loose `/floating-cluster-controller\.js/` test.

---

## 7. Required generated step

After code edits, run:

```bash
node scripts/cache-bust.js
```

This will update:

- public HTML hash references;
- Astro source hash references;
- `src/lib/asset-version.js`.

Do **not** manually edit the generated hash-only changes unless there is a conflict.

Expected current values from the implemented lane:

```text
css/floating-cluster.css        f5c46704
css/premium-controls.css        35714e73
js/site.js                      ee294db6
js/floating-cluster-controller.js 4f9f4f00
```

If source moved, `js/site.js` hash may differ. That is normal; trust `cache-bust.js` output.

---

## 8. Verification commands

### Minimal syntax + cache-bust idempotence

```bash
git diff --check
node -c js/site.js
node -c scripts/cache-bust.js
node -c scripts/premium-controls-rollout-audit.js
node scripts/cache-bust.js --dry-run
```

Expected idempotence:

```text
✅  Хеши не изменились — HTML/Astro не тронуты.
```

### Fast project checks

```bash
npm run migration:metadata:check
npm run native:runtime:audit:strict
npm run data:consistency
npm run content:parity
```

### Full gate

Arena requires Node 22 for Astro 6-class tooling. In a fresh Arena session:

```bash
if [ ! -x /tmp/node-v22.12.0-linux-x64/bin/node ]; then
  wget -q https://nodejs.org/dist/v22.12.0/node-v22.12.0-linux-x64.tar.xz -O /tmp/node22.tar.xz
  tar -xf /tmp/node22.tar.xz -C /tmp/
fi
export PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH
npm ci
npm run validate:static-publication
```

### PremiumControls audit

If `dist/` already exists from the full gate:

```bash
npm run audit:premium-controls
```

Otherwise:

```bash
node scripts/premium-controls-rollout-audit.js --build
```

Expected implemented-lane result:

```text
PremiumControls rollout audit: 28/28 passed
✅ PremiumControls rollout contract OK.
```

---

## 9. Conflict handling

### If `js/site.js` conflicts

Keep both of these properties:

```js
localStorage.getItem("gb:audio:rate") || localStorage.getItem("gbx-tts-rate")
```

and:

```js
window.dispatchEvent(new CustomEvent("gb:tts-rate-change",{detail:{rate:rate}}))
```

Do not dispatch on `document` unless the controller listener is changed too.

### If `scripts/cache-bust.js` conflicts

Preserve three capabilities:

1. `css/premium-controls.css` is in `ASSETS`.
2. `bustAssetVersionHelper(hashes)` exists.
3. `main()` calls the helper before HTML/Astro traversal and counts it in summary.

### If generated `?v=` files conflict

Prefer recomputation over manual merge:

```bash
node scripts/cache-bust.js
```

Then inspect:

```bash
git diff --stat
grep -RIn "js/site.js?v=" src *.html articles baptisty-rossii nagornaya about biografii hard-texts pastor-series 2>/dev/null | head
```

### If `package.json` conflicts

Just keep a valid script entry:

```json
"audit:premium-controls": "node scripts/premium-controls-rollout-audit.js"
```

No package-lock change was needed for this script-only addition.

---

## 10. What not to bundle with this patch

Do not combine this surgical patch with:

- `dist:jsonld:audit` workflow-policy repair;
- `/izbrannoe/` migration-matrix/search-manifest completion;
- Gill rail architecture convergence;
- large CSS deduplication of `css/floating-cluster.css`;
- PlayEmber visual redesign.

Those are separate lanes. Keeping them separate avoids conflict explosions.

---

## 11. Acceptance criteria

A reviewer can accept this patch if all are true:

- `site.js` reads/writes canonical `gb:audio:rate` and keeps `gbx-tts-rate` alias.
- `gb:tts-rate-change` is emitted on `window`.
- `cache-bust.js` includes `css/premium-controls.css`.
- `cache-bust.js` updates `src/lib/asset-version.js`.
- `node scripts/cache-bust.js --dry-run` is idempotent.
- `npm run validate:static-publication` passes.
- `npm run audit:premium-controls` passes on `dist/`.
- `npm run guard:shared-files` passes after a lane-tagged commit.

---

## 12. Current known external warning

`npm run workflows:check` may still fail with:

```text
package.json scripts.dist:jsonld:audit: must audit JSON-LD in dist artifact
```

This is a separate verified current-head issue. Do not block PremiumControls patch review on it unless the owner requests one combined system-policy lane.
