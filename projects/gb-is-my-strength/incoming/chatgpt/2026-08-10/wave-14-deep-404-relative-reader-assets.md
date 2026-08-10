# Wave 14 — deep-404 relative reader assets

Date: 2026-08-10
Auditor: ChatGPT
Mode: read-only Product audit; AuditRepo evidence write only

## Authority anchors

- Product current `main`: `6af19a6f219698112b74c4875f7fd2c03e7a4720`
- AuditRepo pre-write `main`: `02e6e60d5641c2c7f1dfcd478c9484357ac0b95c`
- Open Product PR census at inspection time: one PR, `#1545 fix(hermenevtika): align canonical original-work title`, scope does not overlap `404.html`.

Product operational contract was re-read from current `AGENTS.md`. AuditRepo operating model was re-read from current `README.md` and `AUDITREPO_OPERATING_MODEL.md` before this write.

## New finding candidate

### Deep custom-404 resolves two reader-preference assets against the missing route

Current `404.html` begins with:

```html
<script src="js/reader-preferences-head.js?v=2db7a79e"></script>
<link rel="stylesheet" href="css/reader-preferences.css?v=2b0b76ce">
<script defer src="js/reader-preferences.js?v=63b588b5"></script>
```

The first script and stylesheet are relative URLs; the later deferred reader-preferences script is also relative. Most other 404 assets are root-relative (`/fonts/...`, `/css/...`, `/js/...`).

For a custom 404 rendered at a nested missing URL such as:

```text
https://gospod-bog.ru/missing/deep/path/
```

normal URL resolution makes those three requests target:

```text
https://gospod-bog.ru/missing/deep/path/js/reader-preferences-head.js?v=2db7a79e
https://gospod-bog.ru/missing/deep/path/css/reader-preferences.css?v=2b0b76ce
https://gospod-bog.ru/missing/deep/path/js/reader-preferences.js?v=63b588b5
```

instead of the intended root assets:

```text
https://gospod-bog.ru/js/reader-preferences-head.js?v=2db7a79e
https://gospod-bog.ru/css/reader-preferences.css?v=2b0b76ce
https://gospod-bog.ru/js/reader-preferences.js?v=63b588b5
```

### User impact

On deep missing routes, the 404 page can lose its early reader-preference bootstrap/style and deferred reader-preference runtime while the rest of the root-relative CSS/JS still loads. This can produce preference/theme/typography mismatch specifically on the error surface and creates avoidable failed subrequests on an already degraded navigation path.

The same `404.html` is also the service-worker `OFFLINE_FALLBACK`, so the file is part of both not-found and offline/PWA recovery surfaces. Exact `/404.html` does not expose the path-resolution problem; the defect manifests when the document URL is a nested missing route.

## Independent evidence angles

1. **Current source witness:** `404.html` on Product `main@6af19a6f...` contains the three non-root-relative reader-preference asset URLs quoted above.
2. **Mechanism witness:** browser URL resolution of a relative subresource is against the document/base URL. A nested missing-route document therefore changes the target path; no `<base href="/">` exists in the current 404 head.
3. **PWA ownership witness:** current `sw.js` defines `OFFLINE_FALLBACK = '/404.html'` and precaches the same reader-preference root assets, making the error document part of the recovery surface.

## Browser/live limitation

The available web witness could read the live homepage and indexed live routes, but it could not directly execute a real browser navigation to a deliberately nonexistent nested route or expose the resulting network panel/subrequest statuses. Therefore **no screenshot, JS click, DevTools network capture, or direct live 404 failed-request witness is claimed here**.

A true browser verification should navigate to a unique nested nonexistent URL and confirm whether the three relative requests 404, then compare theme/reader-preference state with `/404.html` and a normal page.

## Disposition

`candidate / selected-for-current-browser-check`

This is a new mechanism-level defect candidate, not a duplicate of the earlier readable-text / reader-projection waves. It is **not promoted to MASTER yet**, because the available run lacks the direct live deep-404 browser/network witness required to make it repair-ready under the AuditRepo model.

If live browser verification confirms the requests fail, promote as a small current-local 404/PWA recovery defect. The bounded repair surface should be `404.html` only (convert the three reader-preference URLs to root-relative), with targeted nested-404 + offline-fallback verification; do not mix it with unrelated reader or Hermenevtika work.
