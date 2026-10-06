# Comment on Finding

## Identity

- Project: gb-is-my-strength
- Comment by: arena-dx-ux-audit
- Date: 2026-10-06
- Target report: matrix row `GBS-404-RELATIVE-READER-PREFERENCES-ASSETS` (MASTER_BUG_MATRIX.md, open table)
- Target finding ID: GBS-404-RELATIVE-READER-PREFERENCES-ASSETS
- Evidence anchor: `350848145ee252a4e6ad8b86c9c8e831e2b4cb12`

## Comment type

stale / evidence-addition (candidate for closed-by-fix at this anchor)

## Evidence angle

artifact (built dist) + browser (Pages-style 404 emulation)

## Evidence

```text
dist/404.html (built at 35084814):
  src="/js/reader-preferences-head.js?v=78fb2ef8"
  href="/css/reader-preferences.css?v=b740c21f"
  src="/js/reader-preferences.js?v=e26f05a8"
  non-root-absolute same-origin references in the whole document: 0

Pages-style emulation (unknown nested paths return the site's own 404.html with status 404):
  /deep/nested/missing/ -> HTTP 404, h1 «Страница не найдена»
  /deep/nested/missing/js/reader-preferences-head.js -> HTTP 404 (control: a relative reference would still fail here)

Chromium 153, stored preference theme=sepia, local exact-SHA build:
  /deep/nested/missing/ -> 404 | data-reader-theme="sepia" | body rgb(238,227,200)
     200 /js/reader-preferences-head.js?v=78fb2ef8
     200 /css/reader-preferences.css?v=b740c21f
     200 /js/reader-preferences.js?v=e26f05a8
  /404.html -> 200 | data-reader-theme="sepia" | body rgb(238,227,200)

Repair commit: e86725321 "fix(404): re-anchor nested reader preference asset roots (#2159)";
it is part of the deployed history (e8672532 appears in the successful deploys after 2026-10-02).
```

## Summary

The row's mechanism (relative `js/...` / `css/...` references resolved under the missing nested directory, so all three
requests return 404 HTML and stored preferences do not bootstrap) is no longer reproducible at the audited anchor: the built
404 page now uses root-absolute references, and both a nested and a root 404 load all three assets with 200 and apply the
stored Sepia theme. The control request under the nested path still returns 404, so the emulator is exercising the same path
resolution the original repro used.

## Recommended classification or action

- Result: `closed-by-fix` candidate at `350848145ee252a4e6ad8b86c9c8e831e2b4cb12` (verify and retire the row)
- Reason: root-absolute references make path depth irrelevant; the original nested-404 failure cannot occur
- Notes for verifier: this is a local exact-SHA witness, not live-host navigation. If the verifier requires a live-host
  witness, the remaining check is `curl -sI https://gospod-bog.ru/deep/nested/missing/js/reader-preferences.js` returning the
  site's 404 page while `/js/reader-preferences.js` returns 200 — the byte-level half (root-absolute references) is already
  proven in the built artifact.
