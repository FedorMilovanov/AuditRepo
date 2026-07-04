# Conflict / Cleanup Registry — current-head truth pass — 2026-06-26

## Meta
- Project: gb-is-my-strength
- Date: 2026-06-26
- Verifier: `arena-agent`
- Scope: reconcile older canonical bug claims with current source/build/browser evidence

Related docs:
- `reverify/CURRENT_HEAD_REVERIFY_2026-06-26_current.md`
- `reverify/CURRENT_HEAD_REVERIFY_2026-06-26_browser-addendum.md`
- `verified/BUG_LEDGER_2026-06-25.md`

---

## C-2026-06-26-01 — PS-06 hidden readTime mismatch is stale on current production-like dist

### Previous canonical claim
- `PS-06`: Hermeneutics hidden readTime = 35 while visible = 50

### Current evidence
- `verified-production-like-dist`: page contains readTime metadata and visible reading time.
- `verified-browser`: `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/` reports:
  - `hiddenReadTime: "50"`
  - `visible50: true`

### Resolution recommendation
- Move exact `35 vs 50` claim to `stale-on-current-head` or `fixed-current`.
- If a broader readTime integrity bug remains, rewrite it against current evidence instead of keeping the old number pair.

---

## C-2026-06-26-02 — V2-3 / NEW-4 Avraam skip-link claim is stale on current production-like dist

### Previous canonical claim
- Avraam route has `href="#svg-map"` but no `id="svg-map"`

### Current evidence
- `verified-production-like-dist`: `dist/karty/avraam/index.html` contains neither marker.
- `verified-browser`: `/karty/avraam/`
  - `skipCount: 0`
  - `targetCount: 0`

### Resolution recommendation
- Retire the exact prior claim as stale.
- If Avraam still has an accessibility gap, open a new bug with current DOM evidence.

---

## C-2026-06-26-03 — P3-8 FAQ bug wording no longer matches current route DOM

### Previous canonical claim
- `src/components/article-pilots/antisovetov/AntisovetovBody.astro`: FAQ accordion HTML present but `faq-accordion.js` never loaded

### Current evidence
- `verified-production-like-dist`: route contains `faq-accordion` markers.
- `verified-browser`: `/articles/20-antisovetov-pastoru/` exposes zero FAQ buttons for tested selectors.

### Resolution recommendation
- Do not keep the exact wording as canonical without refreshed DOM/source evidence.
- Rewrite as one of the following only if confirmed:
  1. FAQ markup exists but no interactive controls are rendered.
  2. FAQ controls render but controller is missing.
  3. FAQ feature is intentionally static and should not be tracked as bug.

---

## C-2026-06-26-04 — P0-10 blanket stale-hash runtime claim is too strong for current HEAD

### Previous canonical claim
- 36+ Astro components have stale hardcoded asset hashes; cache-busting broken for Astro-owned pages.

### Current evidence
- `verified-build`: `npm run strangler:build:production-like` completes.
- `verified-build`: `astro-cache-bust-postbuild.js` reports `Hash replacements: 527` and `dist/ hash drift → 0`.
- `verified-build`: `validate:static-publication:light` passes.

### Resolution recommendation
- Split this into two layers:
  - **architectural defect**: manual/hash-embedded source + postbuild convergence dependency;
  - **route-level runtime bugs**: keep only those still reproduced on current production-like dist.
- Do not keep the old blanket impact sentence as present-tense canonical truth.

---

## C-2026-06-26-05 — Karty stale CSS hash exact example is outdated

### Previous canonical claim
- `src/components/karty/KartyPageHead.astro` hardcoded `?v=202876c3` should be `b880b524`

### Current evidence
- `verified-production-like-dist`: `dist/karty/index.html` loads `../css/site.css?v=b880b524`

### Resolution recommendation
- Mark the exact example stale-on-current-build.
- If source still relies on postbuild mutation, keep that as part of the broader hash-system defect, not as current dist truth.

---

## C-2026-06-26-06 — P1-2 sitemap incompleteness claim is stale

### Previous canonical claim
- `sitemap.xml` incomplete, missing multiple karty / baptisty / map / rodosloviye routes

### Current evidence
- `verified-source`: sitemap contains:
  - `https://gospod-bog.ru/karty/avraam/`
  - `https://gospod-bog.ru/map/`
  - `https://gospod-bog.ru/rodosloviye/`
  - `https://gospod-bog.ru/baptisty-rossii/`
  - `https://gospod-bog.ru/baptisty-rossii/dva-sezda-1884/`
- sitemap total count observed: 43 URLs

### Resolution recommendation
- Retire or rewrite P1-2. The previously stated missing-route examples are no longer valid.

---

## C-2026-06-26-07 — P1-3 search-manifest incompleteness claim is stale in its old form

### Previous canonical claim
- `data/search-manifest.json` incomplete with same gaps as sitemap

### Current evidence
- `verified-source`: manifest `items` include:
  - `/karty/avraam/`
  - `/map/`
  - `/rodosloviye/`
  - `/baptisty-rossii/`
  - `/baptisty-rossii/dva-sezda-1884/`
- total URL count observed in manifest items: 44

### Resolution recommendation
- Retire or rewrite P1-3. The previously named gaps are no longer current.

---

## C-2026-06-26-08 — P1-4 update-meta limitation appears still valid

### Previous canonical claim
- `scripts/update-meta.js` maps only 10 article PageHead files and misses baptisty/karty/nagornaya

### Current evidence
- `verified-source`: `ASTRO_PAGE_HEAD_MAP` contains exactly 10 entries.
- all entries are article-pilot pages only.

### Resolution recommendation
- Keep P1-4 open.

---

## C-2026-06-26-09 — P0-6 CI push-race wording likely needs downgrade/rewrite

### Previous canonical claim
- `indexnow.yml` has git push no retry → non-fast-forward cascade risk

### Current evidence
- `verified-source`: workflow now contains retry loop:
  - `for i in 1 2 3; do`
  - `git push && break || sleep 5`

### Resolution recommendation
- Old wording is stale.
- If CI race risk still exists, re-open with the current mechanism and new root cause.

---

## C-2026-06-26-10 — P0-3 robots query-blocking rule remains valid

### Previous canonical claim
- `robots.txt` has `Disallow: /*?*`

### Current evidence
- `verified-source`: rule still present.

### Resolution recommendation
- Keep open.

---

## Net effect on canonical bug truth

### Keep open confidently
- P0-3
- P1-4
- P1-13 / P1-14 / P1-15 family
- P1-17
- architectural split-registry / cache policy defects
- feed.xml date correctness issue
- Karty build warning
- title/og:title mismatch

### Rewrite / downgrade / retire
- PS-06 exact claim
- V2-3 / NEW-4 exact claim
- P3-8 exact wording
- P0-10 blanket phrasing
- P1-2 old missing-route claim
- P1-3 old missing-manifest claim
- P0-6 old no-retry wording
- P1-12 / P2-16 exact Karty stale-hash example
