# Current-head reverify — dist CSP form-action / karty CSP fixed

**Project:** `gb-is-my-strength`  
**Date:** 2026-07-04  
**Source main before fix:** `01ff5ce3f4264510bccc1c4480c720ca22f181c1`  
**Source fix commit:** `14574a9a21e6a5ba729df837c652c8db6ef599ff`  
**Source lane/main:** `lane/security-dist-csp-form-action-2026-07-04` and `main`

---

## 1. Scope

Close current CSP dist regressions:

- `NEW-68`: dist CSP meta existed on many pages but missed `form-action 'self'`.
- `NEW-69`: Astro-owned karty/map-like dist routes missed CSP meta entirely.

---

## 2. Source changes

Commit `14574a9a`:

- `scripts/astro-cache-bust-postbuild.js`: added a postbuild CSP hardening pass over `dist/**/*.html`:
  - append `form-action 'self';` to existing CSP meta if missing;
  - inject a broad safe site CSP on dist pages with `<html>/<head>` and no CSP meta.
- `scripts/dist-publication-audit.js`: added blocking dist checks:
  - every dist HTML document must have a CSP meta;
  - every CSP meta must include `form-action 'self'`.
- Added lane report: `docs/refactor-2026/lanes/security-dist-csp-form-action-2026-07-04.md`.

This is deploy-artifact hardening. It does not alter PremiumControls/Gill geometry or runtime behavior.

---

## 3. Verification

Environment: Node `v22.14.0`, Playwright Chromium/deps installed.

```text
node --check scripts/astro-cache-bust-postbuild.js                PASS
node --check scripts/dist-publication-audit.js                    PASS
npm run workflows:check                                           PASS
npm run strangler:build:production-like                           PASS
npm run pagefind:build:dist                                       PASS
node scripts/dist-publication-audit.js --require-pagefind --forbid-dev PASS
npm run strangler:audit:production-like                           PASS
npm run validate:static-publication                               PASS
git diff --check                                                  PASS
npm run guard:shared-files                                        PASS after lane commit
```

Manual dist CSP scan after production-like build:

```text
dist HTML documents with <html>: 55
missing CSP: 0
CSP without form-action: 0
postbuild CSP files touched: 54 (injected: 16, form-action fixed: 38)
```

---

## 4. Status

- `NEW-68`: **fixed-current on source main `14574a9a` by production-like dist evidence**.
- `NEW-69`: **fixed-current on source main `14574a9a` by production-like dist evidence**.

Remote GitHub Actions should be observed separately for final workflow status.

---

## 5. Remote workflow

Remote `Deploy to GitHub Pages` is **green** on source main `14574a9a`: run `28693431471` (https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/28693431471).
