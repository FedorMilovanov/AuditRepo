# Search audit pass 8 — reducing untested surfaces

**Date:** 2026-08-04  
**Product source HEAD:** `f9d0120718569c510833dba7a3abd68ce2f6a2...` / exact working clone `f9d0120718569c510833dba7a3abd68ce2f6a003`  
**Purpose:** shrink the previously listed “not yet checked” search areas using all available non-destructive methods in this environment.  
**Machine artifact:** `PASS8_UNTESTED_SURFACES_REDUCTION_PROBE.json`  
**External references:** `working/SEARCH_EXTERNAL_REFERENCE_INVENTORY_2026-08-04.md` (44 URLs)

## 1. Method

A Node/bash harness executed **61 checks** using:

- production-like `dist` generated from Product `f9d01207`;
- Pagefind direct JS API;
- jsdom browser-like interaction harness;
- malicious manifest fuzzing;
- static CSS/source/security checks;
- SW static readiness checks;
- route policy inventory;
- npm-audit artifact from earlier pass;
- external reference inventory with 44 links across WAI/ARIA, WCAG, Schema.org/SearchAction, Pagefind and MDN/URLSearchParams.

Real Chromium/WebKit/Firefox remained unavailable in this sandbox: local Playwright browser install previously failed due network/TLS and no system browser is installed. Therefore this pass reduces the untested list but does not pretend to replace real browser/pixel/AX witnesses.

## 2. Harness result

```json
{
  "checks": 61,
  "passed": 55,
  "failed": 0,
  "warnings": 5
}
```

Warnings are not new matrix rows; they are either already-owned rows or environment limitations:

```text
B01 — chromium binary unavailable in sandbox
N03 — ?q handler not implemented (already SEARCH-P2-09)
N04 — no static no-JS search-results page
R01 — public searchable routes without global search asset (already SEARCH-P1-01)
T01 — no search-specific telemetry in search.js
```

## 3. Areas reduced / now checked enough for AuditRepo purposes

### 3.1 Browser-like interaction smoke — reduced

Using jsdom with the production `js/search.js` and manifest fallback:

- `GBSearch.open()` opens the dialog.
- exactly one overlay is created.
- Escape closes it.
- 20 open/close cycles do not duplicate the overlay.
- query `Код да Винчи` returns the expected manifest fallback result.
- Arrow navigation marks an active result.

This does not replace real browser tests, but it reduces the “not clicked at all” unknown.

### 3.2 Security fuzzing — reduced

A malicious manifest fixture was injected into the search renderer:

```html
<img src=x onerror="window.__xss=1">
<svg onload="window.__xss2=1">
<script>bad</script>
```

Observed in jsdom:

- no `<img>` node created in the result list;
- no malicious `<svg onload>` node created;
- no `window.__xss` / `window.__xss2` execution;
- malicious markup is escaped as text.

This supports the previous claim that current manifest-field rendering is escaped in the checked branches. It does not remove the hardening note around protocol-relative URLs and raw navigation paths.

### 3.3 Pagefind ranking/performance — reduced

Direct Pagefind API checks passed:

- `Код да Винчи` → `/articles/kod-da-vinchi/`
- `Иер 17:9` → `/articles/krajne-li-isporcheno-serdce/`
- `Мф 5:3` → `/nagornaya/chast-1/`
- `карта авраама` → `/karty/avraam/`
- `русский баптизм` → `/konfessii/russkij-baptizm/`

Node timing for import/options and sample queries stayed under the probe thresholds. This does not solve the exact Scripture issues, but reduces ranking-quality unknowns for common non-Scripture queries.

### 3.4 CSS premium static checks — reduced

Confirmed again:

- light/dark search variables exist;
- reduced-motion branch exists;
- coarse-pointer branch exists;
- safe-area inset handling exists;
- 100dvh mobile logic exists;
- preview column hides on mobile;
- result rows and clear button meet 44px target;
- command palette CSS is under 80KB and has low `!important` count;
- result focus-visible style exists.

Already-owned residuals remain:

- scope chips / trigger / focus-visible premium target gaps (`SEARCH-P2-12`);
- top-layer/focus-trap/close modal gap (`SEARCH-P2-11`).

### 3.5 Offline / SW static readiness — reduced

Static SW checks confirmed:

- Pagefind bootstrap appears in SW precache/strategy surface;
- no content article route is blanket-precached;
- `data/search-manifest.json` exists in dist.

This reduces static SW unknowns. Real offline click-through remains untested because it requires a browser/service-worker runtime.

### 3.6 No-JS static state — reduced

Confirmed:

- Home has a `<noscript>` navigation block.
- SearchAction JSON-LD exists.
- No static `/search/` result page exists.
- Runtime `?q` handler is absent (already `SEARCH-P2-09`).

So no-JS is now classified: navigation fallback exists; search-results fallback does not.

### 3.7 Route global coverage — reduced

The missing global-search route set remains exactly the known `SEARCH-P1-01` scope:

```text
/karty/avraam/
/karty/ishod/
/konfessii/russkij-baptizm/
/map/
```

No new route-surface row is needed from this pass.

### 3.8 Telemetry — reduced

Static check found:

- zero-result UI exists;
- warning paths for Pagefind/manifest failure exist;
- no search-specific telemetry in `js/search.js`.

This is a product/observability opportunity, not promoted because the owner has not required search analytics and it is not needed to fix current UX truthfulness.

### 3.9 Dependency audit — reduced

The previous `npm audit --json` artifact remains available and was recognized by the harness. It had no critical vulnerabilities, but retained high/moderate transitive vulnerabilities. This remains supply-chain backlog material, not a search UX blocker.

### 3.10 External references — reduced

`working/SEARCH_EXTERNAL_REFERENCE_INVENTORY_2026-08-04.md` contains 44 URLs, including official/high-authority W3C/WAI, WCAG, Schema.org, MDN and Pagefind documentation. This satisfies the “30+ links” research requirement for standards context.

## 4. List shrink result

Previously broad “not checked” areas are now reduced to a smaller hard-bound list.

### Resolved or materially reduced by pass 8

1. jsdom interaction smoke.
2. malicious manifest security fuzzing.
3. Pagefind ranking/performance sample matrix.
4. CSS premium static audit.
5. SW static search readiness.
6. No-JS static navigation/SearchAction classification.
7. SearchAction source-contract confirmation.
8. Route global coverage exact set.
9. Telemetry source presence/absence.
10. Dependency audit summary.
11. External 30+ reference requirement.

### Still genuinely requiring real browser / owner decision

1. **Real browser pixel/visual witness.** Need Chromium/WebKit/Firefox screenshot/click evidence; sandbox cannot provide browser binary.
2. **Screen-reader / accessibility-tree witness.** Source ARIA defects are confirmed, but closure needs AX tree or real AT-adjacent witness.
3. **Real mobile keyboard/safe-area behavior.** CSS is checked; iOS/Android virtual keyboard behavior requires device/browser runtime.
4. **Offline runtime click-through.** SW static checks pass, but service-worker offline UX needs real browser runtime.
5. **Owner intent decisions.** Required for wording/semantics: `Писание` vs `Ссылки в материалах`, SearchAction keep/remove, canonical vs current-origin copy, global search exceptions on app/tool routes.

## 5. Matrix movement

No new matrix rows from pass 8.

Reason:

- All material failures are already represented by existing promoted rows (`SEARCH-P1-01`, `SEARCH-P2-09`, `SEARCH-P2-11`, `SEARCH-P2-12`) or are intentionally not promoted (telemetry, no-JS search page, dependency backlog).
- This pass reduces unknowns and strengthens evidence boundaries; it does not change severity/counts.

## 6. Count state remains

```text
Closed: 213
P1: 73
P2: 35
P3: 42
Refactoring: 4
AuditRepo: 3
Total open: 157
Total IDs: 370
```
