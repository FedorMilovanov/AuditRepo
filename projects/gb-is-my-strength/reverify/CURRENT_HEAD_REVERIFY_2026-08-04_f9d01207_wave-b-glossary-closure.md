# CURRENT HEAD REVERIFY — Glossary detail trust-boundary closure

- Date: 2026-08-04
- Source repository: `FedorMilovanov/gb-is-my-strength`
- Canonical finding: `D-21`
- Current Product anchor: `f9d0120718569c510833dba7a3abd68ce2f6a003`
- AuditRepo base: `850429a299a6118db85811602fdb661b81b2296f`
- Product mutation: **none**
- Browser/live-production claim: **none**
- TTS scope: **excluded**

## Original claim

`D-21`: glossary dual renderer — `o()` used `innerHTML` (renders `<em>` italics), while the
upgrade path `l()` used `textContent` (literal `<em>`); `data/glossary.json` contains 55 `<em>`
markers, so server-side tooltips showed the literal string; raw `innerHTML` from JSON was flagged
as an XSS surface (W5).

## Current exact-source witness

At exact Product `f9d0120718569c510833dba7a3abd68ce2f6a003`:

- `js/glossary.js` contains **0** `innerHTML`;
- detail rendering is unified in `render(t,b,d)` → `inline(t,v)` — an allowlist parser that matches
  only `</?em\s*>` and builds real `<em>` elements via `createElement("em")` / `createTextNode`,
  so every other token (including `<script>`, `<img onerror>`, `javascript:`) is rendered as plain
  text through `createTextNode` (no raw HTML injection);
- both the runtime tooltip path (`tip()`) and the server `.gterm` upgrade path (`upgrade()` → `render()`)
  use the same `inline()` renderer, eliminating the dual-renderer literal-`<em>` inconsistency;
- `data/glossary.json` still contains 55 `<em>` markers, now rendered as genuine italic nodes on
  both paths;
- commit `d93039866` (`fix(glossary): enforce dictionary detail trust boundary (#683)`) is an
  ancestor of the exact head (`git merge-base --is-ancestor` → YES).

## Disposition

`D-21` → ✅ **FIXED-CURRENT / SOURCE VERIFIED.** The dual-renderer inconsistency and the
innerHTML-from-JSON XSS surface are both gone; the single allowlist renderer builds safe DOM nodes.
Historical commits `365de50` (original D-21/D-22 repair) and `d9303986` (#683 trust boundary) are
retained on the current head. The row is moved from the open P2 table to the closed section.

## Re-confirmed still-open (no count change)

- `D-2` — `css-layer-validator.js` now checks `@layer` order and is wired with `--ceiling=200`, but
  `css:layer:validate` still validates only `css/site.css` (breadth residual remains).
- `D-19` — antisovetov half: `AntisovetovPageHead.astro` `<title>` carries the `| Господь Бог` suffix
  while `og:title`/`twitter:title`/JSON-LD `headline` omit it; rimlyanam-7 half is already closed.
- `AR-IDX-JS-02` — theme persistence now has a canonical owner `gb:reader-preferences:v1`
  (`reader-preferences.js` `commit()`/`persist()`); the historical `SiteUtils.themeKey`-undefined
  write is gone, but `enhancements.js` and `site.js` still write the legacy `theme` key, so the
  multi-writer surface remains.
- `NG-TOC-01` — `--ng-toc-accent-2` token is now defined per-theme in `nagornaya-mobile-toc.css`,
  but `mobile-hotfix.css` retains the `var(--ng-toc-accent-2, #f59e0b)` amber fallback.
- `AR-IDX-03` / `AR-IDX-09` — search ⌘K label and `altKey`/`shiftKey` shortcut guard residuals remain
  in `js/search.js`.

## Also narrowed: MAP-P1-20

Exact `f9d01207` `sw.js` fetch-handler inspection narrows `MAP-P1-20`. Karty `route.json` is
fetched as `fetch('route.json')` with no version, but it matches **no** branch in the SW handler
(not `/data/*.json`, not static/image/html), so it is **not** SW-cached — the "JSON карт cacheFirst"
half of the claim is stale. The live residual is the unversioned engine asset: `map-engine.js` is
loaded as `<script src="../_engine/map-engine.js">` (no `?v=`) in `karty/*/index.html` and in
`IshodMap.astro`/`AvraamMap.astro`; it matches `isStaticAsset` (`.js`), is `!isRevisioned`, so the
handler serves `cacheFirst(request, CACHE_STATIC)` — a permanent-stale risk for that one file.
Repair owner: give `map-engine.js` a canonical `?v=` cache-bust revision and register it in the
cache-bust/ALLOWED_JS owners. No Product mutation or production claim.

## Canonical arithmetic for the AuditRepo transaction

- Canonical IDs: **358**
- Closed: **214 → 215**
- Open: **144 → 143**
- P0: 0
- P1: 69
- P2: **29 → 28**
- P3: 39
- Refactoring: 4
- AuditRepo: 3
- (MAP-P1-20 narrowed in place, no count change)

Total remains `358 = 215 + 143`.

## Evidence boundary

- exact Product `f9d0120718569c510833dba7a3abd68ce2f6a003`;
- direct current-source inspection (`glossary.js` 0 innerHTML; `inline()` allowlist parser; both render
  paths unified) and `git merge-base --is-ancestor d93039866 HEAD` = YES;
- no Product mutation;
- no browser, computed-style, deployed-SHA or live-production claim;
- no TTS inspection or modification.
