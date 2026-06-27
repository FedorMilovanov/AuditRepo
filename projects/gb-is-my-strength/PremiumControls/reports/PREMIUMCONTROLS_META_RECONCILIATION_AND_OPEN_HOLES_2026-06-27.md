# PremiumControls meta-reconciliation + remaining holes — 2026-06-27

**Purpose:** reconcile the many PremiumControls reports after multiple agents/lanes landed on the same day, identify stale narratives, and isolate the still-live thin defects without bulldozing source code.  
**AuditRepo branch:** `lane/premiumcontrols-current-head-audit-2026-06-27`  
**Source current HEAD inspected:** `gb-is-my-strength origin/main@51dbd0e5`  
**Source current HEAD title:** `[LANE lane/branch-convergence-cleanup-2026-06-27] chore: cache-bust reconcile after rebase onto main`  
**Method:** read PremiumControls folder, incoming/verifier reports, branch handoff docs, current source files, remote branch ancestry, and current-main grep evidence.

---

## 0. Executive summary — current truth after reading the pile

PremiumControls is no longer in the original PC-001..PC-006 “missing implementation” state. Several reports in this folder are true only relative to older baselines (`e204104`, `251649fc`, `b00ca5b6`) and are now dangerous if read as current instructions.

Current `origin/main@51dbd0e5` has:

- PlayEmber hover-bloom / speed pill implementation.
- Russian TTS voice selection and runId/suppressEnd race guards.
- Gill family converged to v16 source chrome (`data-gill-v16`, `mobile-bottom-bar`, `gbs-rail-foot`) in all 5 Gill pages.
- `/izbrannoe/` contract registered.
- `workflows:check` green with `dist:jsonld:audit --root dist`.
- AGENTS.md now has a protected PremiumControls section.
- `audit:premium-controls` exists.

But current `origin/main@51dbd0e5` still has **subtle control-plane and audit holes**:

1. **PC-AUDIT-01:** `audit:premium-controls` is not in `validate:static-publication` or `strangler:audit:production-like`; it can be forgotten.
2. **PC-AUDIT-02:** `premium-controls-rollout-audit.js` is structural only; it does not detect browser-visible 0×0 controls or hidden mobile rail controls.
3. **PC-AUDIT-03:** the rollout audit does not guard retired `body.fc-single-active` / `body.fc-series-active` selectors; those dead selectors still exist in current `css/floating-cluster.css`.
4. **PC-AUDIT-04:** current `src/lib/asset-version.js` is stale for PremiumControls assets compared to file md5s; source still has unversioned PremiumControls refs in Gill/Baptisty components.
5. **PC-DOC-01:** `PremiumControls/README.md`, `ROADMAP.md`, `APPLIED-*`, and several playbooks disagree about what is open/closed; a weak agent can easily apply obsolete “turn-key” code over newer main.
6. **PC-COMMENT-01:** `js/floating-cluster-controller.js` comments still say “uses BookmarkEngine for save” even though the current code intentionally avoids BookmarkEngine as Save truth.
7. **PC-VIS-RECHECK:** earlier Playwright evidence found Nagornaya/Baptisty visibility traps; current source suggests some of this may have shifted, but because the local current-main build was killed by sandbox resources before dist proof, the next agent must re-run browser witness on current HEAD before declaring it closed.
8. **PC-BRANCH-01:** multiple remote PremiumControls lanes are now stale/superseded; raw merging them can revert newer work.

The most valuable next action is **not** a feature rewrite. It is a small audit/control-plane lane that makes current truth machine-checkable: integrate `audit:premium-controls`, add PC-009/PC-003 checks or consciously supersede them, and add a Playwright visibility smoke as manual/scheduled before making it blocking.

---

## 1. Source-current evidence snapshot (`origin/main@51dbd0e5`)

### 1.1 Current PremiumControls scripts

Current `package.json` relevant scripts:

```text
audit:premium-controls = node scripts/premium-controls-rollout-audit.js
ci:check = npm run cache-bust && npm run validate:static-publication && npm run workflows:check
dist:jsonld:audit = node scripts/dist-jsonld-audit.js --root dist
```

Absent on current main:

```text
premium-controls:rollout:audit
premium-controls:visibility:audit
audit:premium-controls:no-build
```

Also absent from the two important barriers:

```text
validate:static-publication  # does not include audit:premium-controls
strangler:audit:production-like # does not include audit:premium-controls
```

Interpretation: the audit exists, but it is not a normal release barrier except when a human remembers it.

### 1.2 Current workflow policy

Current `workflows:check` is green:

```text
GB WORKFLOW POLICY CHECK
✅ Workflow policy passed
```

So older documents saying workflow-policy mismatch is still current must be demoted. The mismatch was fixed by current main.

### 1.3 `/izbrannoe/` contract

Current source contains:

```text
migration/route-migration-matrix.json: "/izbrannoe/"
data/route-profiles/izbrannoe.json
migration/page-ownership.json: "/izbrannoe/"
```

So old `/izbrannoe/` contract warnings are no longer the top PremiumControls issue.

### 1.4 Gill v16 convergence

Current source marker check shows all 5 Gill PageChrome files now use the v16 structure:

```text
GillContextPageChrome.astro: data-gill-v16="context", gbs-rail-foot, mobile-bottom-bar
GillPart1PageChrome.astro:  data-gill-v16="part",    gbs-rail-foot, mobile-bottom-bar
GillPart2PageChrome.astro:  data-gill-v16="part",    gbs-rail-foot, mobile-bottom-bar
GillPart3PageChrome.astro:  data-gill-v16="part",    gbs-rail-foot, mobile-bottom-bar
GillSpravochnikPageChrome.astro: data-gill-v16="part", gbs-rail-foot, mobile-bottom-bar
```

Therefore older reports saying “Gill Context is v16 but parts are still legacy `gbs2-*`” are stale on current main.

### 1.5 Current TTS / PlayEmber runtime guards

Current `js/floating-cluster-controller.js` includes:

```text
runId
suppressEnd
pickRuVoice()
gb:audio:rate first, gbx-tts-rate fallback
role="radiogroup"
aria-checked
--gb-ember-shift
```

So the old “TTS is fake / no Russian voice / pause broken” narrative is stale. Any future TTS work should preserve these guards rather than re-import older branches.

---

## 2. Reports that are now stale or baseline-scoped

This is not criticism of the reports; most were correct at their audited SHA. The problem is that current HEAD moved repeatedly.

### 2.1 `PremiumControls/README.md`

Still contains old current-state table:

```text
Status: Phase 1+2 — MERGED in PR #19, Phase 3 — IN PROGRESS
PC-001 OPEN
PC-002 OPEN
PC-003 OPEN
PC-004 OPEN
PC-005 PARTIAL
PC-006 OPEN
```

But current main has moved far beyond PR #19:

- `PremiumControlAnchor.astro` exists.
- Heart-series wiring exists.
- Speed morph / TTS are advanced.
- `premium-controls-rollout-audit.js` exists.
- `audit:premium-controls` exists.
- Gill v16 convergence landed.

**Action:** do not edit the old section destructively; add a top “Current-head override” block pointing to this reconciliation file.

### 2.2 `ROADMAP.md`

`ROADMAP.md` is already partly updated with a current-head note, but it still mixes old checklist sections with current statuses. It is safe as historical roadmap, unsafe as a live task list.

**Action:** add a one-line pointer at top: “Use `reports/PREMIUMCONTROLS_META_RECONCILIATION_AND_OPEN_HOLES_2026-06-27.md` for current operational truth.”

### 2.3 `PREMIUMCONTROLS_SURGICAL_COMPLETION_TURNKEY_2026-06-27.md`

This file says “Verified & Turn-Key Ready” and contains broad packages including `/izbrannoe/`, SW precache, OG/LCP, Gill root legacy manipulation, and “guarantees ideal integration”. On current main:

- some items already landed;
- some commands target legacy/root files while current production truth is Astro/dist;
- some Gill instructions are stale after full v16 convergence;
- it claims “all patches merged to main” for a baseline that is no longer the latest truth.

**Action:** treat as historical proposal, not executable current playbook. Do not let a weak agent apply it wholesale.

### 2.4 `SURGICAL_REPLAY_CURRENT_MAIN_2026-06-27.md`

This is valuable, but it describes pushed lane `lane/system-premiumcontrols-surgical-2026-06-27` commit `6c9b3d06`, which is **not an ancestor of current main**.

Current main includes related work from other commits, but not every invariant from `6c9b3d06`.

**Current-main mismatch examples:**

- `audit:premium-controls` exists, but `audit:premium-controls:no-build` does not.
- `premium-controls-rollout-audit.js` does not include the PC-003 md5/cache-bust invariant described in that file.
- `src/lib/asset-version.js` is stale vs actual file md5s on current main.

**Action:** use this doc as a patch source for PC-003 guard ideas, not as proof that current main has those guards.

### 2.5 `PREMIUMCONTROLS_CURRENT_HEAD_SURGICAL_AUDIT_2026-06-27.md` and visibility playbook

These were written against an earlier state and then noted a rebase to `b00ca5b6`. Current main is now `51dbd0e5`, with more Gill and PremiumControls changes.

The visibility findings remain valuable as a **test category**, but they must be re-run against current HEAD before being called confirmed-current.

---

## 3. Still-live holes on current main

### PC-AUDIT-01 — PremiumControls audit exists but is not a release barrier

**Severity:** P1 process/control-plane  
**Evidence:** current `package.json` has:

```json
"audit:premium-controls": "node scripts/premium-controls-rollout-audit.js"
```

But `validate:static-publication` and `strangler:audit:production-like` do not include it.

**Why it matters:** every previous PremiumControls regression came from source/build/browser mismatch. An audit that is optional is not a barrier.

**Minimal repair:** add either:

```json
"premium-controls:rollout:audit": "node scripts/premium-controls-rollout-audit.js"
```

or reuse existing:

```json
"audit:premium-controls": "node scripts/premium-controls-rollout-audit.js"
```

Then insert after `dist:css-parity` or near dist publication gates:

```json
"strangler:audit:production-like": "... && npm run dist:css-parity && npm run audit:premium-controls && npm run sw:dist:audit:pagefind"
```

For `validate:static-publication`, be careful: the script currently expects `dist/` to exist. Either:

- do not add it to `validate:static-publication`, but add a separate workflow policy requirement that deploy/strangler runs it after build; or
- add `audit:premium-controls` with `--build` variant and accept extra build cost.

Recommended: **add to `strangler:audit:production-like` and deploy workflow first**, not the already-huge source-only `validate:static-publication`.

---

### PC-AUDIT-02 — Rollout audit is structural only, not viewport-visible

**Severity:** P1/P2  
**Evidence:** current audit checks HTML presence/scope/controller, not computed boxes.

Current audit logic:

```js
const hasScope = SCOPE_RE.test(html);
const controllerLoaded = /floating-cluster-controller\.js/.test(html);
```

It cannot detect:

```text
.gb-ember exists but width=0 height=0
.gb-save exists in desktop rail hidden on mobile
speed pill injected but clipped offscreen
button exists under hidden parent
```

**Minimal repair:** add a new Playwright smoke script, initially manual/scheduled:

```json
"premium-controls:visibility:audit": "node scripts/premium-controls-visibility-audit.js"
```

Do not put this directly into the main barrier until stable in CI. Use it in `interactive-audit.yml` or a manual workflow first.

---

### PC-AUDIT-03 — Dead `body.fc-*` selectors still exist and are unguarded

**Severity:** P2  
**Evidence on current main:**

```text
css/floating-cluster.css:107: body.fc-single-active .article-main,
css/floating-cluster.css:650: body.fc-series-active .article-main
css/floating-cluster.css:665-671: body.fc-single-active #reading-progress ...
css/floating-cluster.css:682-688: body.fc-series-active #reading-progress ...
```

Current controller activates:

```js
document.body.classList.add('gb-cluster-single-active');
document.body.classList.add('gb-cluster-series-active');
```

So `body.fc-*` state selectors are dead. They are not a visible break today because live `gb-cluster-*` selectors are also present, but they create false coverage and can mislead future grep-based agents.

**Minimal repair:** remove the `body.fc-*` branches only, keep `data-fc-*` attributes.

Add guard:

```js
const retiredFcStateRe = /body\.fc-(?:single|series)-active\b/;
```

Fail if found in source or dist CSS.

This is what `lane/system-premiumcontrols-guard-cleanup-2026-06-27` attempted. Because current main advanced, do not raw merge that branch; extract only this small patch if desired.

---

### PC-AUDIT-04 — Asset-version helper is stale; source has unversioned PremiumControls refs

**Severity:** P1/P2  
**Evidence on current main:**

Actual md5 short hashes:

```text
css/floating-cluster.css e7feff19
css/premium-controls.css 35714e73
js/floating-cluster-controller.js 2ea97d46
```

Current `src/lib/asset-version.js` says:

```js
'css/floating-cluster.css': '56994ecc',
'css/premium-controls.css': '35714e73',
'js/floating-cluster-controller.js': 'd77256d1',
```

So helper is stale for 2 of 3 PremiumControls assets.

Also current source contains unversioned PremiumControls refs, for example:

```text
src/components/article-pilots/gill-part1/GillPart1PageHead.astro:<link href="../../css/floating-cluster.css" rel="stylesheet"/>
src/components/baptisty-rossii/BaptistyRossiiNochNaKureBody.astro:<script is:inline defer src="../../js/floating-cluster-controller.js"></script>
```

This is exactly the subtle PC-003 class: root HTML can be cache-busted while source Astro remains unversioned/stale.

**Minimal repair options:**

1. Make `cache-bust.js` sync `src/lib/asset-version.js` from the same `ASSETS` list.
2. Make `cache-bust.js` add missing `?v=<hash>` to Astro `href/src` attributes.
3. Add PC-003 checks to `premium-controls-rollout-audit.js`.

Use ideas from `SURGICAL_REPLAY_CURRENT_MAIN_2026-06-27.md`, but reapply on current `origin/main@51dbd0e5` and do not pull old Gill/H2 changes blindly.

---

### PC-VIS-RECHECK — Nagornaya/Baptisty visibility needs re-verification on current main

**Severity:** unknown until browser rerun; likely P1/P2 if confirmed.  
**Earlier evidence:** Playwright found:

- Nagornaya Play/Save markup present but `0×0` due missing PremiumControls CSS.
- Baptisty mobile Play/Save present only inside hidden desktop rail.

**Current-main source nuance:**

- root `nagornaya/chast-*.html` now contains `floating-cluster.css`, but source `src/components/nagornaya/chast-1/NagornayaChast1PageHead.astro` still shows no `floating-cluster.css`. Since production dist is Astro-owned, the root file alone is not enough proof.
- Baptisty source still has `.gbs2-mobile-actions` with theme/search only, while Play/Save are in `.gbs2-rfoot` inside desktop rail.

Because a local current-main build was killed by sandbox resource limits before producing dist, this should be classified as:

```text
needs-current-browser-recheck
```

not `confirmed-current` yet.

**Required recheck:** run Playwright against production-like `dist` on current HEAD for:

```text
/nagornaya/chast-1/
/baptisty-rossii/noch-na-kure/
```

Check `.gb-ember` and `.gb-save` visible rects per viewport.

---

### PC-DOC-01 — AuditRepo PremiumControls docs are contradictory

**Severity:** P1 for multi-agent coordination  
**Evidence:** same folder contains:

- README saying PC-001..PC-006 open against PR #19.
- ROADMAP partly saying they are source-landed/current.
- APPLIED files claiming broad “all merged to main” for older baselines.
- SURGICAL_REPLAY describing branch `6c9b3d06`, not in current main.
- CURRENT_HEAD report describing branch `faf27cb4`, not in current main.
- HANDOFF saying Gill convergence still split, but current source shows all 5 Gill pages v16.

**Minimal repair:** add a root file:

```text
PremiumControls/CURRENT_HEAD_TRUTH_2026-06-27.md
```

or point README top to this report.

Do not delete older reports; mark them as baseline-scoped.

---

### PC-COMMENT-01 — Controller comments stale around BookmarkEngine

**Severity:** P3, but high confusion value.

Current code comments still include:

```text
- Использует window.BookmarkEngine для save
Фасад над BookmarkEngine. Если нет engine — localStorage fallback.
```

But current implementation near `syncSaveState()` says:

```js
// Do not depend on BookmarkEngine here: PremiumControls Favorites are stored
// in gb-favorites, while BookmarkEngine is reading-position infrastructure.
```

This is a low-risk cleanup: update top comments to stop future agents from reintroducing BookmarkEngine as Save truth.

---

## 4. Remote branch status after current-main reconciliation

Do **not** raw merge these without re-evaluating on `origin/main@51dbd0e5`.

| Branch | Current status | Why |
|---|---|---|
| `origin/lane/system-premiumcontrols-guard-cleanup-2026-06-27` | stale/surgical-patch-source only | Based before later main changes; contains useful PC-009 but broad diff vs current main. |
| `origin/lane/system-premiumcontrols-surgical-2026-06-27` | patch-source only | Contains PC-003 ideas, but not ancestor of current main; some work may be partially superseded. |
| `origin/lane/system-premiumcontrols-surgical-finish-2026-06-27` | mostly superseded by current main | Current main has TTS race/speed guards via `46920582`, but compare if needed. |
| `origin/lane/floating-cluster-guards-2026-06-27` | mostly superseded by `5e4059c7` | Current main includes GILL-C numeral safety-net + docs through branch convergence cleanup. |
| `origin/lane/gill-part1-v16-converge-2026-06-27` | superseded/design history | Current main has all Gill pages v16, not only Part I. |
| `origin/lane/tts-russian-voice-and-pause-2026-06-27` | superseded | Current main has stronger TTS guards and Russian voice. |

---

## 5. Recommended next lane — smallest valuable action

Create a new lane, do not reuse old branches:

```bash
git checkout main
git pull --rebase origin main
git checkout -b lane/premiumcontrols-audit-barrier-current-2026-06-27
```

Scope only:

1. Add PC-009 dead-selector guard or remove dead `body.fc-*` selectors.
2. Decide how `audit:premium-controls` enters production-like gates.
3. Add PC-003 helper/hash drift checks, or create a separate lane if too broad.
4. Add a non-blocking Playwright visibility script or report current browser evidence.
5. Update top of PremiumControls README with current-head pointer.

Avoid:

- Gill visual edits.
- PlayEmber geometry edits.
- TTS rewrite.
- source branch raw merges.
- mass report rewriting.

---

## 6. Concrete code snippets for the next agent

### 6.1 PC-009 guard snippet

```js
// In scripts/premium-controls-rollout-audit.js after structural page scan
const runtimeCssFiles = [
  path.join(ROOT, 'css', 'floating-cluster.css'),
  path.join(DIST, 'css', 'floating-cluster.css'),
];
const retiredFcStateRe = /body\.fc-(?:single|series)-active\b/;
for (const cssFile of runtimeCssFiles) {
  if (!fs.existsSync(cssFile)) continue;
  const css = fs.readFileSync(cssFile, 'utf8');
  if (retiredFcStateRe.test(css)) {
    bad(`retired fc-* state selector remains: ${path.relative(ROOT, cssFile)}`,
        'use gb-cluster-single-active / gb-cluster-series-active only; keep data-fc-* attributes');
  } else {
    ok(`no retired fc-* state selectors in ${path.relative(ROOT, cssFile)}`);
  }
}
```

### 6.2 PC-003 helper/hash drift snippet

```js
const crypto = require('crypto');
function md5short(relPath) {
  const abs = path.join(ROOT, relPath);
  if (!fs.existsSync(abs)) return null;
  return crypto.createHash('md5').update(fs.readFileSync(abs)).digest('hex').slice(0, 8);
}

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
  const escaped = asset.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  let staleCount = 0;
  let unversionedCount = 0;
  for (const f of files) {
    const html = fs.readFileSync(f, 'utf8');
    if (!html.includes(asset)) continue;
    const unversioned = new RegExp(`(?:href|src)=["'](?:/|(?:\.\./)*|)${escaped}(?!\\?v=)`, 'g');
    const badUnversioned = html.match(unversioned);
    if (badUnversioned) unversionedCount += badUnversioned.length;
    const anyVersion = html.match(new RegExp(`(?:/|(?:\.\./)*|)${escaped}\\?v=([a-f0-9]{8})`, 'g')) || [];
    staleCount += anyVersion.filter(ref => !ref.endsWith(`?v=${hash}`)).length;
  }
  if (unversionedCount || staleCount) {
    bad(`cache-bust drift for ${asset}`, `unversioned=${unversionedCount}, stale=${staleCount}, expected ?v=${hash}`);
  } else {
    ok(`${asset} cache-busted with current ?v=${hash}`);
  }
}
```

### 6.3 Visibility smoke skeleton

Use as manual first:

```js
const { chromium } = require('playwright');
const routes = [
  '/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/',
  '/articles/dzhon-gill-chast-1-chelovek/',
  '/baptisty-rossii/noch-na-kure/',
  '/nagornaya/chast-1/',
];
const viewports = [
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];
```

For each route:

```js
const result = await page.evaluate(() => {
  const controls = [...document.querySelectorAll('.gb-ember, .gb-save')].map(el => {
    const cs = getComputedStyle(el);
    const b = el.getBoundingClientRect();
    return {
      className: String(el.className),
      visible: cs.display !== 'none' && cs.visibility !== 'hidden' && b.width > 0 && b.height > 0,
      rect: { width: b.width, height: b.height, x: b.x, y: b.y }
    };
  });
  return {
    visibleEmbers: controls.filter(c => c.className.includes('gb-ember') && c.visible).length,
    visibleSaves: controls.filter(c => c.className.includes('gb-save') && c.visible).length,
    overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
    controls
  };
});
```

Do not make it blocking until CI browser setup is stable.

---

## 7. Final verifier stance

As of `origin/main@51dbd0e5`, PremiumControls is functionally much closer to done than the older reports imply. The live problem is **not** “implement PremiumControls from scratch”; it is **truth-layer hardening**:

- make the audit unavoidable;
- make the audit catch dead selector/hash/visibility classes;
- reconcile docs so old baseline instructions do not overwrite current main;
- keep future agents away from raw stale branch merges.

That is the surgical path.
