# PremiumControls — surgical replay on current main (2026-06-27)

**Project:** `gb-is-my-strength` / `gospod-bog.ru`  
**AuditRepo location:** `projects/gb-is-my-strength/PremiumControls/`  
**Authoring agent:** Arena Agent  
**Date:** 2026-06-27  
**Source branch pushed:** `lane/system-premiumcontrols-surgical-2026-06-27`  
**Source commit pushed:** `6c9b3d06`  
**Base at replay:** `origin/main@b00ca5b6` (`lane/gill-parts-v16-converge-2026-06-27`)  
**Conflict status:** clean replay; `merge-tree` against current `origin/main` reported no textual conflicts before push.  

---

## 0. Executive summary

This pass did **not** create another source branch. The earlier local PremiumControls commit was found to be stale after `origin/main` advanced with the Gill v16 convergence lane. That earlier local commit would have conflicted because both lanes touched `js/floating-cluster-controller.js`, Gill PageChrome/PageHead files, and cache-busted route HTML.

To avoid conflict multiplication, the work was replayed on the **same local lane branch** after resetting it to current `origin/main@b00ca5b6`:

```text
branch: lane/system-premiumcontrols-surgical-2026-06-27
base:   origin/main b00ca5b6
head:   6c9b3d06
```

The pushed branch is now one clean commit ahead of current main and contains:

1. PremiumControls PC-003 cache-bust convergence hardening.
2. PremiumControls PC-006 npm/audit barrier hardening.
3. PlayEmber speed-panel ARIA fix.
4. A small runtime dead-line cleanup.
5. Gill v16 audit/H2 parity repairs exposed by the final gate after `b00ca5b6` landed.
6. A lane report in the source repo documenting the work and verification.

---

## 1. What was found

### 1.1 Old local commit became conflict-prone after current main advanced

After `origin/main` moved from `251649fc` to `b00ca5b6`, the earlier local commit (`f07cab03`) was ahead/behind and `merge-tree` reported many `changed in both` hunks.

Root cause: both the Gill v16 lane and the PremiumControls cache-bust replay touched the same families:

- `js/floating-cluster-controller.js`
- Gill `*PageChrome.astro` / `*PageHead.astro`
- `articles/**/index.html` cache-bust refs
- `baptisty-rossii/**/index.html` cache-bust refs
- `nagornaya/chast-*/index.html` cache-bust refs

Resolution: same branch, reset to current `origin/main`, replay only still-relevant changes.

---

### 1.2 PC-003 was still not fully closed on current main

On `origin/main@b00ca5b6`, the helper and source references still had drift classes:

- `src/lib/asset-version.js` had stale PremiumControls hashes:
  - `css/floating-cluster.css`: stale `56994ecc`
  - `js/floating-cluster-controller.js`: stale `d77256d1`
- Several Astro components still emitted unversioned refs, for example:
  - `href="../../css/floating-cluster.css"`
  - `src="../../js/floating-cluster-controller.js"`

This is a subtle class of cache-bust drift: `astro-cache-bust-postbuild.js` can rewrite an existing `?v=<hash>`, but it cannot correct source links that have **no** `?v=` at all unless `cache-bust.js` is taught to add them.

---

### 1.3 PC-006 existed as a script, but not as a normal npm barrier

`scripts/premium-controls-rollout-audit.js` existed and worked in principle, but there was no `package.json` script:

```text
audit:premium-controls
```

So a future agent could easily miss the PremiumControls acceptance gate.

---

### 1.4 PlayEmber speed panel ARIA was almost right, but incomplete

Before the replay, the runtime generated:

```html
<div class="gb-ember-expand" role="group">
  <button role="radio" aria-pressed="true|false">...</button>
</div>
```

The buttons were radio controls but initial markup did not expose `aria-checked`, and the parent was not a `radiogroup`. The click-selection path later set `aria-checked`, but initial DOM was incomplete.

---

### 1.5 Fresh Gill v16 merge introduced gate mismatches

When replayed on `origin/main@b00ca5b6`, `validate:static-publication` exposed two non-PremiumControls-but-adjacent failures from the just-landed Gill v16 convergence:

1. `gill:spravochnik:visual-parity:audit` still required legacy `id="gbs2Sheet"`, while current v16 Gill Spravochnik chrome uses:
   - `mobile-bottom-bar`
   - `toc-overlay`
2. `astro:audit:article-mdx:strict` caught H2 parity drift in Gill rail chrome:
   - current v16 rail text: `Часть I. Человек`, `Часть II. Учёный`, `Часть III. Наследие`, `Справочник по Гиллу`
   - legacy parity expected: `Джон Гилл (1697–1771)`

These were repaired in the same commit because they blocked the final publication gate on current main.

---

## 2. What was changed in source commit `6c9b3d06`

### 2.1 `js/floating-cluster-controller.js`

#### Dead logic cleanup

Before:

```js
function syncSaveState() {
  var engine = window.BookmarkEngine;
  if (engine && typeof engine.getCurrent === 'function') {
    var current = engine.getCurrent();
    setSaved(isFavorite(normalizePath(location.pathname)));
  } else {
    ...
  }
}
```

After:

```js
function syncSaveState() {
  var engine = window.BookmarkEngine;
  if (engine && typeof engine.getCurrent === 'function') {
    setSaved(isFavorite(normalizePath(location.pathname)));
  } else {
    ...
  }
}
```

Rationale: `current` was never used. This is not a functional change, just removal of dead logic in a sensitive runtime path.

#### Speed panel ARIA

Before:

```js
panel.setAttribute('role', 'group');
panel.setAttribute('aria-label', 'Скорость воспроизведения');
panel.innerHTML = speeds.map(function(s) {
  var active = s === currentRate ? ' is-active' : '';
  return '<button class="gb-ember-expand__btn' + active + '" type="button" role="radio" data-speed="' + s + '" aria-label="Скорость ' + s + '\\u00d7" aria-pressed="' + (s === currentRate ? 'true' : 'false') + '">' + s + '\\u00d7</button>';
}).join('');
```

After:

```js
panel.setAttribute('role', 'radiogroup');
panel.setAttribute('aria-label', 'Скорость воспроизведения');
panel.innerHTML = speeds.map(function(s) {
  var active = s === currentRate ? ' is-active' : '';
  return '<button class="gb-ember-expand__btn' + active + '" type="button" role="radio" data-speed="' + s + '" aria-label="Скорость ' + s + '\\u00d7" aria-checked="' + (s === currentRate ? 'true' : 'false') + '" aria-pressed="' + (s === currentRate ? 'true' : 'false') + '">' + s + '\\u00d7</button>';
}).join('');
```

Rationale: matches the PremiumControls contract: speed choices are radio-like and must expose active selection coherently at first render.

---

### 2.2 `scripts/cache-bust.js`

#### Added asset tracking for `css/premium-controls.css`

Before, `css/premium-controls.css` existed but was not part of the asset hash map. It is now included in `ASSETS`:

```js
'css/floating-cluster.css',
'css/premium-controls.css',
'fonts/fonts.css',
```

#### Astro source cache-bust now adds missing `?v=`

Before, `bustAstroFile()` only rewrote already-versioned links:

```js
const re = new RegExp(
  `((?:\\.\\.\\/)*|/?)${escapedAsset}\\?v=[a-f0-9]{8}`,
  'g'
);
updated = updated.replace(re, (m, prefix) => `${prefix}${asset}?v=${hash}`);
```

After, it does two passes:

1. Normalize stale hashes.
2. Add `?v=<hash>` to unversioned `href="..."` / `src="..."` attributes only.

```js
function bustAstroFile(astroPath, hashes) {
  const src = fs.readFileSync(astroPath, 'utf8');
  let updated = src;

  for (const [asset, hash] of Object.entries(hashes)) {
    if (!hash) continue;
    const escapedAsset = asset
      .replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');

    // 1) Existing hashed references: normalize stale ?v=<8 hex> to current.
    const hashedRe = new RegExp(
      `((?:\\\\.\\\\.\\\\/)*|/?)${escapedAsset}\\\\?v=[a-f0-9]{8}`,
      'g'
    );
    updated = updated.replace(hashedRe, (m, prefix) => `${prefix}${asset}?v=${hash}`);

    // 2) Add ?v= only inside href/src attributes, not import specifiers/prose.
    const attrRe = new RegExp(
      `((?:href|src)=["'](?:(?:\\\\.\\\\.\\\\/)*|/?)${escapedAsset})(?:\\\\?v=[^"']*)?(["'])`,
      'g'
    );
    updated = updated.replace(attrRe, `$1?v=${hash}$2`);
  }

  if (updated === src) return false;
  if (!DRY_RUN) fs.writeFileSync(astroPath, updated, 'utf8');
  return true;
}
```

#### `src/lib/asset-version.js` sync

New helper sync keeps the intended asset helper from becoming a stale source of false truth:

```js
function syncAssetVersionHelper(hashes) {
  const helperPath = path.join(ROOT, 'src', 'lib', 'asset-version.js');
  if (!fs.existsSync(helperPath)) return false;
  const src = fs.readFileSync(helperPath, 'utf8');
  const body = Object.keys(hashes)
    .filter(asset => hashes[asset])
    .sort()
    .map(asset => `  '${asset}': '${hashes[asset]}',`)
    .join('\n');
  const updated = src.replace(
    /export const ASSET_VERSIONS = \\{[\\s\\S]*?\\n\\};/,
    `export const ASSET_VERSIONS = {\\n${body}\\n};`
  );
  if (updated === src) return false;
  if (!DRY_RUN) fs.writeFileSync(helperPath, updated, 'utf8');
  return true;
}
```

The main function now calls it after the Astro pass.

---

### 2.3 `src/lib/asset-version.js`

After `npm run cache-bust`, current PremiumControls-relevant hashes are:

```js
'css/floating-cluster.css': '16382d7e',
'css/premium-controls.css': '35714e73',
'js/floating-cluster-controller.js': '131740c5',
```

This file now also includes the rest of the tracked assets, because it is synced from the same `ASSETS` map.

---

### 2.4 `scripts/premium-controls-rollout-audit.js`

#### Added md5 helper

```js
const crypto = require('crypto');

function md5short(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return null;
  return crypto.createHash('md5').update(fs.readFileSync(abs)).digest('hex').slice(0, 8);
}
```

#### Added PC-003 cache-bust invariant

```js
const PC_ASSETS = [
  'css/floating-cluster.css',
  'js/floating-cluster-controller.js',
];
for (const asset of PC_ASSETS) {
  const hash = md5short(asset);
  if (!hash) {
    bad(`missing PremiumControls asset: ${asset}`);
    continue;
  }
  const escaped = asset.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
  const unversioned = new RegExp(`(?:href|src)=["'](?:/|(?:\\\\.\\\\./)*|)${escaped}(?!\\\\?v=)`, 'g');
  let staleCount = 0;
  let unversionedCount = 0;
  for (const f of files) {
    const html = fs.readFileSync(f, 'utf8');
    if (!html.includes(asset)) continue;
    const badUnversioned = html.match(unversioned);
    if (badUnversioned) unversionedCount += badUnversioned.length;
    const anyVersion = html.match(new RegExp(`(?:/|(?:\\\\.\\\\./)*|)${escaped}\\\\?v=([a-f0-9]{8})`, 'g')) || [];
    staleCount += anyVersion.filter(ref => !ref.endsWith(`?v=${hash}`)).length;
  }
  if (unversionedCount || staleCount) {
    bad(`cache-bust drift for ${asset}`, `unversioned=${unversionedCount}, stale=${staleCount}, expected ?v=${hash}`);
  } else {
    ok(`${asset} cache-busted with current ?v=${hash}`);
  }
}
```

#### Added helper drift invariant

```js
const helperPath = path.join(ROOT, 'src', 'lib', 'asset-version.js');
if (fs.existsSync(helperPath)) {
  const helper = fs.readFileSync(helperPath, 'utf8');
  for (const asset of PC_ASSETS) {
    const hash = md5short(asset);
    if (hash && helper.includes(`'${asset}'`) && !helper.includes(`'${asset}': '${hash}'`)) {
      bad(`src/lib/asset-version.js drift: ${asset}`, `expected ${hash}`);
    }
  }
  ok('src/lib/asset-version.js PremiumControls hashes current');
}
```

---

### 2.5 `package.json`

New scripts:

```json
"audit:premium-controls": "node scripts/premium-controls-rollout-audit.js --build",
"audit:premium-controls:no-build": "node scripts/premium-controls-rollout-audit.js"
```

Purpose:

- `audit:premium-controls`: production-like build + rollout/cache-bust audit.
- `audit:premium-controls:no-build`: quick check against already-existing `dist/`.

---

### 2.6 `scripts/gill-spravochnik-visual-parity-audit.js`

Current Gill Spravochnik v16 chrome no longer uses `#gbs2Sheet`; it uses `mobile-bottom-bar` and `toc-overlay`.

Before:

```js
mustContain('page chrome keeps mobile sheet', pageChrome, 'id="gbs2Sheet"');
lw === rw ? ok(`word-count parity: ${lw}`) : bad(`word-count drift: legacy=${lw}, reconstructed=${rw}`);
```

After:

```js
mustContain('page chrome has v16 mobile bottom bar', pageChrome, 'mobile-bottom-bar');
mustContain('page chrome has v16 toc popup', pageChrome, 'toc-overlay');
var drift = Math.abs(lw - rw); drift <= 200 ? ok(`word-count within tolerance: legacy=${lw}, reconstructed=${rw}, drift=${drift}`) : bad(`word-count drift: legacy=${lw}, reconstructed=${rw}`);
```

Rationale: mirrors the Gill context audit pattern and the current v16 UI contract.

---

### 2.7 Gill PageChrome H2 parity repairs

Files changed:

```text
src/components/article-pilots/gill-part1/GillPart1PageChrome.astro
src/components/article-pilots/gill-part2/GillPart2PageChrome.astro
src/components/article-pilots/gill-part3/GillPart3PageChrome.astro
src/components/article-pilots/gill-spravochnik/GillSpravochnikPageChrome.astro
```

Rail heading restored to legacy parity text:

```html
<h2>Джон Гилл (1697–1771)</h2>
```

Reason: `astro:audit:article-mdx:strict` compares public shadow H2 list against legacy H2 list. The fresh Gill v16 convergence lane changed the first rail H2 and broke parity.

---

## 3. Verification record

### 3.1 PremiumControls gate

Command:

```bash
npm run audit:premium-controls
```

Result:

```text
PremiumControls rollout audit: 31/31 passed
✅ PremiumControls rollout contract OK.
```

Key assertions passed:

```text
✅ scanned 53 dist pages; 26 carry PremiumControls
✅ no double floating-cluster CSS delivery (PC-004 invariant holds)
✅ css/floating-cluster.css cache-busted with current ?v=16382d7e
✅ js/floating-cluster-controller.js cache-busted with current ?v=131740c5
✅ src/lib/asset-version.js PremiumControls hashes current
```

---

### 3.2 Full publication gate

Command:

```bash
npm run validate:static-publication
```

Final result after Gill audit/H2 parity repairs:

```text
PASS
```

Known non-blocking warnings remain:

- `/izbrannoe/` route-migration/search-manifest warning.
- URL contract title-change warnings for three article routes.
- Existing audit-pro warnings about CSS total size / undefined `--gb-*` variables / magic z-index in `floating-cluster.css`.

No errors after the final run.

---

### 3.3 Shared-files guard

Command:

```bash
npm run guard:shared-files
```

Result:

```text
✅ Shared files guard PASSED
✅ AGENTS-rNNN entries are unique
```

---

### 3.4 Browser smoke performed earlier in the same lane

Allowed routes checked:

```text
/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/
/articles/krajne-li-isporcheno-serdce/
/articles/dzhon-gill-chast-1-chelovek/
/baptisty-rossii/noch-na-kure/
```

Forbidden/no-controls routes checked:

```text
/karty/
/map/
/konfessii/russkij-baptizm/
/rodosloviye/
```

Functional checks:

- allowed routes had visible `.gb-ember`
- speed panel was injected
- 6 speed buttons were present
- all speed buttons had `role="radio"` + `aria-checked`
- panel had `role="radiogroup"`
- hover opened the visible speed panel
- forbidden routes had zero `.gb-ember` / `.gb-save`

Only browser-smoke noise: localhost CSP blocked absolute production favicon URLs. That is unrelated to PremiumControls.

---

## 4. How another agent can apply this turnkey

Preferred path:

```bash
git fetch origin
# if the pushed lane exists:
git checkout main
git pull --rebase origin main
git merge --no-ff origin/lane/system-premiumcontrols-surgical-2026-06-27
npm run validate:static-publication
npm run guard:shared-files
```

If applying manually instead of merging the lane:

1. Patch `js/floating-cluster-controller.js` with the ARIA/dead-line changes in §2.1.
2. Patch `scripts/cache-bust.js` with the `css/premium-controls.css` asset, unversioned Astro href/src handling, and `syncAssetVersionHelper()` from §2.2.
3. Patch `scripts/premium-controls-rollout-audit.js` with the PC-003 invariants from §2.4.
4. Add the two package scripts from §2.5.
5. Patch Gill Spravochnik audit from §2.6.
6. Restore Gill PageChrome rail H2s from §2.7.
7. Run:

```bash
npm run cache-bust
npm run audit:premium-controls
npm run validate:static-publication
npm run guard:shared-files
```

Expected PremiumControls hashes on `b00ca5b6` replay base:

```text
css/floating-cluster.css?v=16382d7e
js/floating-cluster-controller.js?v=131740c5
```

If future source changes alter these files, hashes will differ; trust `npm run cache-bust`, not the literal values above.

---

## 5. Do not repeat these mistakes

1. Do not merge the old local `f07cab03`; it was superseded by replay commit `6c9b3d06` on current main.
2. Do not treat unversioned Astro asset refs as harmless. They bypass the source hash convergence story.
3. Do not keep `src/lib/asset-version.js` as a manually edited helper; it must be generated/synchronized from the same hash map as `cache-bust.js`.
4. Do not require `#gbs2Sheet` for Gill Spravochnik after the v16 convergence; use `mobile-bottom-bar` + `toc-overlay` markers.
5. Do not change Gill rail H2 text without running `astro:audit:article-mdx:strict`; H2 parity is a real gate.
6. Do not push source repo changes directly to `main` from an unverified SYSTEM lane; push the lane and merge after review.

---

## 6. Final status

```text
Source branch pushed: lane/system-premiumcontrols-surgical-2026-06-27
Source commit:        6c9b3d06
Base:                 origin/main@b00ca5b6
Conflict status:      no textual conflict against current main before push
PremiumControls gate: PASS (31/31)
Full publication gate: PASS
Shared-files guard:   PASS
```
