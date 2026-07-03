# CURRENT HEAD REVERIFY — CI red on `b4b312a8`: Gill mobile audit catches runtime ReferenceErrors

**Date:** 2026-07-03  
**Mode:** Pure auditor / verifier; no source-code changes.  
**Source repo:** `FedorMilovanov/gb-is-my-strength`  
**Fresh source HEAD audited:** `b4b312a8ce0799e82a1075855518627ce9897d5d` (`chore: auto-update meta, cache-bust [skip ci]`)  
**Previous CI-recovery commits present in source history:**

- `a65874a0` — `fix(ci): css:layer:validate pointed at deleted css/site-layered.css [LANE lane/system-green-ci-recovery]`
- `849f2c49` — `fix(runtime): undeclared-var ReferenceError in enhancements.js + sw-register.js [LANE lane/system-green-ci-recovery]`

## 1. GitHub Actions status witness

Public GitHub Actions API, branch `main`, latest relevant deploy run:

```text
Run: 28677794134
Workflow: Deploy to GitHub Pages
HEAD: b4b312a8
Status: completed
Conclusion: failure
URL: https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/28677794134
```

Jobs API witness:

```text
JOB deploy: completed failure
Failed step: 23 Gill mobile reference layout audit
```

Raw job logs require admin rights (`403 Must have admin rights to Repository`), so the failure was reproduced locally on a fresh clone.

## 2. Fixed-current witness: old `css/site-layered.css` CI blocker is no longer current

Fresh `package.json` on `b4b312a8`:

```text
css:layer:validate = node scripts/css-layer-validator.js css/site.css --ceiling=202
```

Local command witness:

```text
npm run css:layer:validate → PASS
! important count: 202
ceiling 202: OK
```

Classification: **`CI-CSSLAYER-STALE` is fixed-current in source by `a65874a0`**.

## 3. Current blocker reproduced locally

Environment:

```text
Node: v22.14.0
Fresh clone: gb-is-my-strength @ b4b312a8
Build: npm run strangler:build:production-like → PASS, 53 pages built
Playwright: chromium installed with deps for browser evidence
```

Command:

```bash
npm run gill:mobile-layout:audit
```

Result:

```text
exit=1
reports/gill-mobile-layout-audit-2026-06-29/summary.json:
checks: 380
failures: 40
failure grouping:
  r is not defined  × 20
  tt is not defined × 20
```

Important nuance: the Gill mobile layout assertions themselves pass repeatedly:

```text
Gill root present
Gill mobile bar present
Explicit Part TOC button present
Explicit Series TOC button present
Bottom bar fixed
Bottom bar background alpha >= .94
No generic fallback controls over Gill mobile
No horizontal overflow
Article text does not run under bottom bar
Part TOC opens from bottom bar
Series TOC opens from bottom bar
```

The audit fails because it treats page runtime errors as blocking, correctly catching two global JS regressions.

## 4. Runtime error #1 — `js/highlights.js`: undeclared `r`

Browser/pageerror witness:

```text
ReferenceError: r is not defined
at http://127.0.0.1:<port>/js/highlights.js?v=c972d20e:1:638
at http://127.0.0.1:<port>/js/highlights.js?v=c972d20e:1:8481
```

Source witness (`js/highlights.js`, minified strict IIFE):

```js
!function(){"use strict";var n="gb-highlights-v1",e=!1;...
function i(n){return String(n).replace(...)}
r=document.createElement("link"),
r.rel="stylesheet",
r.href="/css/highlights-runtime.css?v="+(window.SITE_CONFIG&&window.SITE_CONFIG.version||""),
document.head.appendChild(r);
```

Because the IIFE is strict-mode, assigning to undeclared `r` throws immediately. This is analogous to the already attempted `849f2c49` recovery, but `highlights.js` remains unfixed on current `main`.

## 5. Runtime error #2 — `js/site.js`: undeclared/unknown `tt`

Browser/pageerror witness currently surfaced by the Gill mobile audit:

```text
ReferenceError: tt is not defined
at http://127.0.0.1:<port>/js/site.js?v=77687914:484:1
at Array.forEach (<anonymous>)
at makeBlock (http://127.0.0.1:<port>/js/site.js?v=77687914:479:10)
at http://127.0.0.1:<port>/js/site.js?v=77687914:490:14
```

Source witness (`js/site.js`, pretty line view):

```text
479 filtered.forEach(function(n){
480   var a=document.createElement("a");
481   a.className="gbx-backlinks__link";
482   a.href=function(u){...}(n.url);
483   var groupNames={gill:"Джон Гилл", ...};
484   a.innerHTML=tt(n.title)+'<small>'+(groupNames[n.group]||"")+'</small>';
485   grid.appendChild(a);
486 });
```

`tt` is not defined in this scope. Because this runs during backlink block construction, the error appears on every audited Gill route/viewport/theme case.

Additional static scope witness: `tt` is not a one-off typo. It appears in three site.js feature blocks:

```text
256 vTip.innerHTML = ... tt(ref) ... tt(text) ...        # verse tooltip
288 owCard.innerHTML = ... tt(w.lang) ... tt(w.original) ... tt(w.definition) ...  # original-word card
484 a.innerHTML = tt(n.title) + ...                     # backlinks block (current CI manifestation)
```

So the executor should treat this as a missing/renamed shared HTML-escape helper in `site.js`, not only as a backlinks-only patch.


## 5.5 Blast-radius browser smoke across `dist/`

A follow-up temporary Playwright smoke visited 52 production-like `dist/` routes at mobile viewport `390x844` and recorded pageerrors. Localhost CSP favicon/icon noise was filtered out.

Relevant runtime failures:

```text
relevant failing routes: 33 / 52
r is not defined         32 route hits
tt is not defined        15 route hits
SiteUtils is not defined  1 route hit
```

Routes with `r is not defined` include all article routes, `baptisty-rossii/*`, major landings (`/biografii/`, `/hard-texts/`, `/pastor-series/`) and Nagornaya article/support pages. This confirms `js/highlights.js` is a broad runtime regression, not Gill-only.

Routes with `tt is not defined` include all current article routes and `nagornaya/chast-1..5`, matching the static `site.js` helper-missing scope.

Additional verified runtime finding from this broader smoke:

```text
/nagornaya/ :: SiteUtils is not defined
stack: js/nagornaya-mobile-toc.js?v=866d4238:1:696
```

Source/order witness for `/nagornaya/`:

```html
<script src="../js/nagornaya-mobile-toc.js?v=866d4238" defer></script>
<script defer src="/js/site-utils.js?v=897afa55"></script>
```

`js/nagornaya-mobile-toc.js` immediately calls `SiteUtils.ready(...)`, so on the landing route it can execute before `site-utils.js` has defined `window.SiteUtils`. This should be tracked as `CI-P1-NAGORNAYA-SITEUTILS-ORDER` unless merged into the same runtime no-undef executor lane.


Independent representative-smoke witness:

```bash
node scripts/dist-smoke-audit.js --no-build --production-like
```

Result on the same built `dist/`:

```text
exit=1
❌ dist smoke failed: 6 issue(s)
- [desktop] /articles/kod-da-vinchi/: page/console errors: r is not defined | tt is not defined
- [desktop] /baptisty-rossii/: page/console errors: r is not defined
- [desktop] /baptisty-rossii/noch-na-kure/: page/console errors: r is not defined
- [mobile] /articles/kod-da-vinchi/: page/console errors: r is not defined | tt is not defined
- [mobile] /baptisty-rossii/: page/console errors: r is not defined
- [mobile] /baptisty-rossii/noch-na-kure/: page/console errors: r is not defined
```

So the current runtime failure is independently visible through both:

1. the CI-failing Gill mobile reference layout audit, and
2. the representative production-like `dist-smoke-audit.js`.

## 6. Control witnesses

These checks were run on the same fresh source checkout:

```text
git status --short --branch → clean (main...origin/main)
for f in js/*.js; do node --check "$f"; done → PASS (syntax only; no-undef not covered)
npm run css:layer:validate → PASS
npm run tokens:check → PASS
npm run gill:mobile-play:smoke → PASS
npm run gill:mobile-layout:audit → FAIL (40 runtime pageerrors)
```

This explains why the earlier fixes could look green in syntax/build checks: `node --check` cannot catch strict-mode runtime no-undef assignments/usages.

## 7. Classification

### New/active bug

```text
ID: CI-P0-GILL-RUNTIME-REFS
Severity: P0 / CI-blocking runtime regression
Status: verified-current on b4b312a8
Failing gate: Deploy to GitHub Pages → Gill mobile reference layout audit
Primary files implicated: js/highlights.js, js/site.js
Symptom: strict mobile browser audit catches 40 pageerrors across 5 Gill routes × 2 viewports × 2 themes
```

### Fixed-current / stale blocker

```text
ID: CI-CSSLAYER-STALE
Status: fixed-current on b4b312a8 by a65874a0
Evidence: package script now targets css/site.css; local css:layer validates successfully
```

## 8. Recommended executor lane (do not implement in auditor mode)

Use a SYSTEM lane because this touches global JS assets and cache-busted public artifacts:

```text
lane/system-runtime-no-undef
```

Minimum executor checks after repair:

```bash
for f in js/*.js; do node --check "$f"; done
npm run strangler:build:production-like
npx playwright install --with-deps chromium
npm run gill:mobile-layout:audit
npm run gill:mobile-play:smoke
npm run validate:static-publication
npm run guard:shared-files
```

Recommended prevention audit: add or run a browser/runtime no-undef smoke that fails on pageerror for global JS, because syntax checks and Astro build did not catch this class.

---

## 9. Pass 30.b — second-source independent verification on current HEAD `dbd0bb55`

**Date:** 2026-07-03 (later same session)  
**Mode:** Pure auditor; no source-code changes; independent re-run on a fresh source checkout after pull of `e2f0ae4` (parallel patcher's `fix(gill): GB2 меню`).

**Source HEAD pulled:** `dbd0bb5` (`chore: auto-update meta, cache-bust [skip ci]`); one patcher commit between this verification and the previous (`e2f0ae4` Gill GB2 frame).

A later source commit landed after the original `b4b312a8` witness:

```text
e2f0ae4e fix(gill): GB2 меню — закреплённая полностраничная панель с отслеживанием текущего раздела [LANE lane/system-gill-rail-frame]
dbd0bb55 chore: auto-update meta, cache-bust [skip ci]
```

**Public GitHub Actions API status on `dbd0bb55`:**

```text
Run: 28679684009
Workflow: Deploy to GitHub Pages
HEAD: dbd0bb55
Status: completed
Conclusion: failure
URL: https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/28679684009

JOB deploy: completed failure
Failed step: 23 Gill mobile reference layout audit
```

→ CI status is **still red** after the parallel patcher's `e2f0ae4` Gill-GB2 fix; the failing gate is the same step. The patcher did not address the runtime ReferenceErrors.

### 9.1 Source witness on `dbd0bb55`

Static pattern scan on the source files committed in `dbd0bb55` (Node 22):

```text
js/highlights.js: bare r=document.createElement("link") in strict IIFE → YES (BUG)
  pattern: }r=document.createElement("link")
  file contains "use strict": true
js/site.js: function tt(e) declaration present in source; pattern uses tt(n.title) etc.
```

`js/highlights.js` is **structurally identical** to the b4b312a8 state with respect to the `r=...` bug — the parallel patcher did not touch this file. So W3 reproduction on a fresh build of `dbd0bb55` must produce the same 40 pageerrors.

### 9.2 W3 (browser) reproduction on `dbd0bb55`

Local environment, fresh strangler build:

```bash
npm run strangler:build:production-like   # PASS, 53 pages
nohup python3 -m http.server 8091 --bind 127.0.0.1 --directory /home/user/gb-is-my-strength/dist &
AUDIT_BASE=http://127.0.0.1:8091 npm run gill:mobile-layout:audit
```

Observed result (Playwright Chromium 1228, headless):

```text
40 pageerror events:
  ❌ r is not defined  × 20
       at http://127.0.0.1:8091/js/highlights.js?v=c972d20e:1:638
       at http://127.0.0.1:8091/js/highlights.js?v=c972d20e:1:8481
  ❌ tt is not defined × 20
       at http://127.0.0.1:8091/js/site.js?v=77687914:484:1
       at makeBlock (http://127.0.0.1:8091/js/site.js?v=77687914:479:10)
       at http://127.0.0.1:8091/js/site.js?v=77687914:490:14

Gill layout checks themselves: PASS (root, bar, part-TOC, series-TOC, no overflow, etc.)
```

The same 40-failure pattern is independently reproducible. This is the **third** independent confirmation (CI API, Pass 30 W3, this Pass 30.b W3) that the regression is alive on the current main.

### 9.3 CI-P0-GILL-RUNTIME-REFS — status

```text
Status: verified-current on dbd0bb55 (current HEAD as of 2026-07-03 19:35 UTC)
Triangulated witnesses:
  W1 source scan: highlights.js strict IIFE bare r=createElement('link') — present on dbd0bb55
  W2 dist artifact: dist/js/highlights.js?v=c972d20e still contains the bare assignment
  W3 browser runtime: 20 pageerrors "r is not defined" per gill-audit run
  W3 browser runtime: 20 pageerrors "tt is not defined" per gill-audit run
  GitHub Actions: Gill mobile reference layout audit failing step
  Cross-tool: dist-smoke-audit.js (Pass 30) also reports the same pageerrors
Severity: still P0 / CI-blocking
Ready for executor: YES (system lane recommended: lane/system-runtime-no-undef)
```

### 9.4 CI-P1-NAGORNAYA-SITEUTILS-ORDER — status

Not re-tested in this pass. Script-ordering issue is structural in the route source and likely independent of the JS runtime fixes. Recommend executor re-verify after the no-undef fix.

### 9.5 Audit recommendation for next auditor pass

1. Do **not** mark `CI-P0-GILL-RUNTIME-REFS` closed until Playwright + `npm run gill:mobile-layout:audit` reports 0 pageerrors on a fresh build.
2. After the patcher's fix, the audit should also re-run `dist-smoke-audit.js --no-build --production-like` to catch any other no-undef smoke that the gill-audit does not visit.
3. The `tt` failure in `site.js` is structural, not just backlinks — the fix should ensure `tt` is defined for the strict-mode scope where it is called (or replace with a noop / proper escape helper at a top-level scope).
4. Add an early-exit rule to CI: any pageerror on a Gill route page → block deploy, regardless of which feature caused it.

### 9.6 Independent cross-validator (parallel auditor) confirmation on `dbd0bb55`

A second independent auditor pass (on the same source HEAD) reproduced the same fresh local reverify:

```text
npm run strangler:build:production-like → PASS (53 pages built, dist hash drift 0)
npm run gill:mobile-layout:audit → FAIL
  r is not defined  ×20
  tt is not defined ×20
node scripts/dist-smoke-audit.js --no-build --production-like → FAIL (6 representative runtime issues)
```

Broad `dist/` route smoke on `dbd0bb55` is unchanged from `b4b312a8` after filtering localhost favicon CSP noise:

```text
routes scanned: 52
relevant failing routes: 33
r is not defined          32 route hits
tt is not defined         15 route hits
SiteUtils is not defined   1 route hit (/nagornaya/)
```

Conclusion: `e2f0ae4e` changed Gill rail/frame UI but did **not** retire `CI-P0-GILL-RUNTIME-REFS` or `CI-P1-NAGORNAYA-SITEUTILS-ORDER`. Both remain **verified-current** on source HEAD `dbd0bb55`.

---

## 10. Pass 34 — current HEAD refresh after `bced1c6` highlights fix (source HEAD `f1e9abd`)

**Date:** 2026-07-03 (continued session)
**Mode:** pure auditor/verifier; no source-code changes; no new report files.

Two patcher commits landed after the last witness on `dbd0bb55`:

```text
bced1c6 fix(highlights): declare r in highlights.js IIFE — убираем ReferenceError «r is not defined»
8446a0d chore(agents-md): resolve duplicate AGENTS-r312 revision-table entry
```

followed by cache-bust `f1e9abd`. Public GitHub Actions API on `f1e9abd`:

```text
Run: 28680826378
Workflow: Deploy to GitHub Pages
HEAD: f1e9abd
Status: completed
Conclusion: failure
Failed step: 23 Gill mobile reference layout audit
```

CI is **still red** — the `bced1c6` half-fix did not unblock deploy.

### 10.1 W1 source witness on `f1e9abd`

Static pattern scan:

```text
js/highlights.js:
  old bug pattern }r=document.createElement("link")  → 0 hits (RETIRED by bced1c6)
  fresh declaration var n="gb-highlights-v1",e=!1,r;  → present, var r declared before r=createElement("link")

js/site.js:
  a.innerHTML=tt(n.title)+'<small>'+(groupNames[n.group]||"")+'</small>';  → still bare tt() call
  function tt(e){...}                                                     → exists at depth 2 (non-strict outer IIFE)
  call site:                                                               → at depth 4 (post use strict)
  → strict-mode IIFE does not see the outer function declaration
```

### 10.2 W2 dist artifact on `f1e9abd`

After fresh `npm run strangler:build:production-like`:

```text
dist/js/highlights.js?v=c972d20e → contains var n,e,r; declaration  (r no-undef retired)
dist/js/site.js?v=77687914       → byte-identical to prior build (166,792 bytes; tt call still at depth 4)
```

### 10.3 W3 browser witness on `f1e9abd`

Local environment, fresh strangler build, Playwright Chromium 1228:

```text
AUDIT_BASE=http://127.0.0.1:8091 npm run gill:mobile-layout:audit

  ❌ page error 360x740-light — ReferenceError: tt is not defined
  ✅ Gill root present 360x740-light
  ❌ page error 360x740-dark  — ReferenceError: tt is not defined
  ✅ Gill root present 360x740-dark
  ❌ page error 390x844-light — ReferenceError: tt is not defined
  ✅ Gill root present 390x844-light
  ❌ page error 390x844-dark  — ReferenceError: tt is not defined
  ✅ Gill root present 390x844-dark

  repeated for 5 Gill routes × 2 viewports × 2 themes = 20 pageerrors
  Gill layout checks themselves: PASS
```

Numerical delta from `dbd0bb55`:

```text
                       dbd0bb55 → f1e9abd
r is not defined:      20      → 0     (FIXED by bced1c6)
tt is not defined:     20      → 20    (UNCHANGED)
SiteUtils not defined:  1      → ?     (not re-tested in Pass 34; presumed unchanged)
total pageerrors:      40+     → 20
```

### 10.4 Triangulation update

```text
CI-P0-GILL-RUNTIME-REFS:
  highlights half (r no-undef) → retired on f1e9abd (bced1c6)
  site half (tt no-undef)      → still verified-current on f1e9abd
  severity: P0 / CI-blocking (deploy red on gill:mobile-layout:audit pageerror gate)
  recommended executor lane: lane/system-runtime-no-undef (narrowed to site.js)
CI-P1-NAGORNAYA-SITEUTILS-ORDER:
  status: still verified-current (not re-tested this pass)
```

### 10.5 Executor guidance update

`lane/system-runtime-no-undef` is now narrowed to `js/site.js` only. The `r` half of `CI-P0-GILL-RUNTIME-REFS` is already retired by `bced1c6`; do not re-touch `js/highlights.js` IIFE wrapping.

Two equally minimal paths for the `tt` half:

1. **Surgical rename of the strict caller block** (lowest blast radius): drop `"use strict"` from the IIFE that calls `tt(n.title)` so the outer non-strict function-declaration hoisting applies. Re-run `node --check js/site.js` (syntax) and Playwright audit (runtime).

2. **Bring the helper into the strict scope**: insert `function tt(e){...}` inside the same strict IIFE that contains the call, or alias the outer helper as `var tt=function(...)` before the strict block. Keep the original escape semantics (`String(null==e?"":e).replace(/[&<>"]/g,...)`).

After fix:

```text
node --check js/site.js
npm run cache-bust         # refreshes ?v=... hash on dist assets
npm run strangler:build:production-like
npm run gill:mobile-layout:audit
node scripts/dist-smoke-audit.js --no-build --production-like
npm run audit:premium-controls
npm run validate:static-publication
```

Acceptance: `gill:mobile-layout:audit` PASS (0 pageerrors on Gill routes), `dist-smoke-audit` PASS (no `r`/`tt`/`SiteUtils` pageerrors on representative routes), Deploy step `Gill mobile reference layout audit` = success.


### 10.6 Additional gate-gap and visual witnesses on `f1e9abd9`

Supplemental local checks on the same current HEAD:

```text
Broad 52-route dist runtime smoke (localhost favicon CSP noise filtered):
  relevant failing routes: 16 / 52
  tt is not defined         15 route hits
  SiteUtils is not defined   1 route hit (/nagornaya/)
  r is not defined           0 route hits

node scripts/dist-smoke-audit.js --no-build --production-like:
  FAIL — /articles/kod-da-vinchi/ desktop+mobile: tt is not defined
```

Gate-gap witness:

* `strangler:audit:production-like` includes `node scripts/dist-smoke-audit.js --no-build --production-like`.
* `deploy.yml` does **not** run `dist-smoke-audit.js`.
* `validate:static-publication` also omits this browser runtime smoke.
* Current Deploy catches the global `tt` runtime only because Gill mobile layout audit is strict about pageerrors.

Visual parity side finding:

```text
node scripts/visual-parity-screenshots.js --routes "/,/about/,/articles/,/biografii/,/karty/,/baptisty-rossii/,/nagornaya/,/hard-texts/,/konfessii/,/pastor-series/,/map/" --threshold "1.0"

/baptisty-rossii/ desktop diff = 6.131%
/baptisty-rossii/ mobile  diff = 17.368%
all other default landing routes <= 1% threshold
```

GitHub Visual Parity Guard failed on intermediate commit `8446a0da` at `Run pixel-diff screenshots`; current `f1e9abd9` is `[skip ci]`, so remote visual parity did not rerun. Local evidence confirms the `/baptisty-rossii/` parity issue remains current.
