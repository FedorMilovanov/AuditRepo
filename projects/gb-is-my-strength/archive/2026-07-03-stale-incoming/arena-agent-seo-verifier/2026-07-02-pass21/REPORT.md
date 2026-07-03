# Pass 21 — SEO / Public Surface / Matrix Re-verification

**Дата:** 2026-07-02  
**Agent:** Arena Agent SEO Verifier  
**Source HEAD verified:** `f284fc60` (`/home/user/gb-is-my-strength-fresh2`)  
**AuditRepo upstream before rebase:** `55318a4`  
**Mode:** read-only verifier/editor; no source repo fixes applied by this agent.

---

## 0. Scope

This pass re-verified the canonical matrix after concurrent source fixes landed in `gb-is-my-strength` (`f284fc60`) and AuditRepo advanced beyond `333de1c`.

Canonical matrix updated:

`projects/gb-is-my-strength/verified/MASTER_BUG_MATRIX.md`

Checks performed against:

- fresh source checkout: `/home/user/gb-is-my-strength-fresh2`
- live production: `https://gospod-bog.ru/`
- updated matrix and Pass 8–14 incoming reports

Focus areas:

1. sitemap/indexability correctness after `f284fc60`;
2. `llms.txt` coverage after `f284fc60`;
3. public artifact boundary (`research/`, internal `data/` JSON);
4. Pagefind indexing quality;
5. IndexNow/deploy workflow order;
6. security-header false-positive verification.

---

## 1. Matrix Corrections / Re-opened Items

### HSTS false positive — remove from active security bugs

**Old matrix claim:** HTTP `Strict-Transport-Security` missing.

**Live evidence:**

```txt
curl -I https://gospod-bog.ru/
strict-transport-security: max-age=31556952

curl -I https://gospod-bog.ru/articles/kod-da-vinchi/
strict-transport-security: max-age=31556952

curl -I https://gospod-bog.ru/karty/ishod/
strict-transport-security: max-age=31556952
```

**Conclusion:** HSTS is present on live production. The active security backlog should retain missing HTTP `X-Frame-Options` / HTTP CSP `frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`, `X-Content-Type-Options`, but not HSTS.

---

### `BUG-041` — fix attempt needs re-triage: sitemap now contains noindex URLs

**Old claim:** 8 `/karty/*` production routes were missing from sitemap.

**Current source `f284fc60`:**

```txt
sitemap.xml count = 51
```

The 8 added karty holding pages are still explicitly noindex:

```txt
/karty/early-church/  meta robots="noindex, follow"
/karty/maccabim/      meta robots="noindex, follow"
/karty/melachim/      meta robots="noindex, follow"
/karty/pavel/         meta robots="noindex, follow"
/karty/revelation/    meta robots="noindex, follow"
/karty/shoftim/       meta robots="noindex, follow"
/karty/shvatim/       meta robots="noindex, follow"
/karty/yeshua/        meta robots="noindex, follow"
```

**Source verification command result:**

```txt
sitemap URLs: 51
noindex in sitemap: 8
production-dist not sitemap: /izbrannoe/
```

**Live note:** live production still returned old sitemap with 43 URLs and 0 noindex URLs at verification time, indicating deploy lag or cache.

**Conclusion:** The initial “missing sitemap routes” framing was incomplete. These pages are production-dist but not indexable. Adding them to sitemap is not correct SEO coverage. The route contract needs a separate `indexable: false` concept or equivalent.

---

### `NEW-46` — `llms.txt` is improved but not complete

**Current source `f284fc60`:**

```txt
sitemap unique URLs = 51
llms.txt unique sitemap URLs = 42
```

Missing from `llms.txt` vs current sitemap:

```txt
https://gospod-bog.ru/
https://gospod-bog.ru/nagornaya/seriya/
https://gospod-bog.ru/nagornaya/chast-1/
https://gospod-bog.ru/nagornaya/chast-2/
https://gospod-bog.ru/nagornaya/chast-3/
https://gospod-bog.ru/nagornaya/chast-4/
https://gospod-bog.ru/nagornaya/chast-5/
https://gospod-bog.ru/nagornaya/istochniki/
https://gospod-bog.ru/nagornaya/nakhodki/
```

**Conclusion:** `NEW-46` should be marked as partially fixed, not fully closed.

---

### `BUG-002` count update

Current source count:

```txt
find src/components -name '*PageHead.astro' | wc -l      # 39
find src/components -name '*PostArticle.astro' | wc -l   # 6
Total = 45
```

Matrix updated from 44 to 45.

---

## 2. New Verified Findings Added to Matrix

### NEW-50 [P2] — Internal `baptisty-rossii/research/**` corpus copied to production

**User intent confirmation:** Research files are internal working files for collecting information before adding material to the site; they are not intended as public pages/assets.

**Current source evidence:**

```txt
baptisty-rossii/research files = 145
baptisty-rossii/research bytes ≈ 13,983,848
```

**Live/source exposure evidence:** Existing live has public research/raw-source URLs returning 200, and current copy pipeline still copies the whole `baptisty-rossii` directory.

Examples observed live:

```txt
/baptisty-rossii/research/78-theological-identity-orthodox-proximity-and-russian-baptist-selfhood-2026-06-21.md
→ 200 OK, text/markdown

/baptisty-rossii/research/raw-sources/azbyka-smolin-russian-sects.txt
→ 200 OK, text/plain

/baptisty-rossii/research/raw-sources/bulletin-council-relatives-010-1972.pdf
→ 200 OK, application/pdf
```

**Root cause:** `scripts/copy-legacy-to-dist.js` copies the whole `baptisty-rossii` directory:

```js
const PUBLIC_DIRS = [
  ...
  'baptisty-rossii',
  ...
];
```

**Recommendation:** exclude `baptisty-rossii/research/**` from `dist` entirely. Do not rely on `robots.txt` as the primary fix, because non-HTML `.md/.txt/.pdf` cannot be reliably noindexed on GitHub Pages without `X-Robots-Tag`.

---

### NEW-51 [P2] — Dist/publication audit does not guard nested private/public data leaks

`dist-publication-audit.js` checks only top-level forbidden dirs:

```js
const forbidden = ['.git', 'node_modules', 'src', 'scripts', 'docs', 'audit', '_build-tools', 'migration', 'reports'];
```

It does not fail on nested/internal public-surface paths:

```txt
baptisty-rossii/research/**
baptisty-rossii/research/raw-sources/**
data/route-profiles/**
data/public-content-baseline.json
data/visual-parity-baseline.json
```

**Recommendation:** add nested forbidden path checks and/or switch to explicit public-data whitelist.

---

### NEW-52 [P2] — Baptist pages Pagefind indexes only hidden 5–7 word snippets

**Live evidence:**

```txt
/baptisty-rossii/noch-na-kure/        data-pagefind-body = div.sr-only, 7 words
/baptisty-rossii/yuzhnaya-shtunda/    data-pagefind-body = div.sr-only, 6 words
/baptisty-rossii/spravochnik/         data-pagefind-body = div.sr-only, 5 words
```

But real article bodies are much larger:

```txt
noch-na-kure article body ≈ 943 words
spravochnik article body ≈ 2466 words
```

**Source evidence:** `src/pages/baptisty-rossii/*/index.astro` contains:

```html
<div class="sr-only" data-pagefind-body ...>
  Баптисты России. Часть ...
</div>
```

**Audit gap:** existing Baptist audits check marker presence only, not indexed word count or marker placement.

**Recommendation:** move `data-pagefind-body` to the real `<article>`/`<main>` or add a second real content body. Add a guard: article routes must have Pagefind body >= 500–600 words.

---

### NEW-53 [P2] — IndexNow notification runs before deploy

`indexnow.yml` builds and submits IndexNow payload before `deploy.yml` runs. `deploy.yml` is triggered by workflow_run after `IndexNow — Notify Search Engines` completes.

Current order:

```txt
push → indexnow.yml → update meta/cache-bust → commit → submit IndexNow → deploy.yml workflow_run → deploy pages
```

**Impact:** Bing/Yandex can be notified before the new production artifact exists. Existing URLs may be crawled stale; new URLs may be crawled before deploy.

**Recommendation:** split into predeploy metadata workflow + deploy + postdeploy IndexNow, or move IndexNow submit into deploy workflow after `actions/deploy-pages`.

---

## 3. Existing Finding Strengthened

### NEW-47 [P2] — `/rodosloviye/` interactive genealogy dead zone confirmed live

Current matrix already has `NEW-47` for dead React genealogy code. Pass 21 adds live evidence:

```bash
curl https://gospod-bog.ru/rodosloviye/ | grep -oE 'ReactFlow|genealogy|data/genealogy|@xyflow|Открыть родословие|Полная интерактивная версия'
```

Result:

```txt
Открыть родословие
Полная интерактивная версия
```

No ReactFlow/genealogy runtime markers are present. CTA points back to `/rodosloviye/` itself.

---

## 4. P3 Findings Added

### NEW-54 [P3] — Four sitemap URLs have zero live static inlinks

Live crawl of 43 sitemap URLs found 0 static incoming links from other sitemap pages for:

```txt
/karty/ishod/
/map/
/nagornaya/nakhodki/
/rodosloviye/
```

### NEW-55 [P3] — `robots.txt` query blocking misses cache-busted font stylesheet

Many pages load:

```txt
/fonts/fonts.css?v=864cc57a
```

But `robots.txt` allows query CSS only for `/css/*.css?*`, `/nagornaya/*.css?*`, not `/fonts/*.css?*`; `Disallow: /*?*` wins under longest-match style evaluation.

### NEW-56 [P3] — Social metadata incomplete across Baptist/maps/konfessii routes

Missing examples:

```txt
og:site_name missing on /baptisty-rossii/*, /konfessii/, /karty/ishod/, /map/
og:locale missing on /karty/ and /map/
twitter:image:alt missing on many Baptist/maps routes
og:image:alt missing on /baptisty-rossii/* and /karty/
```

### NEW-57 [P3] — Mismatched high-priority image preloads

Examples:

```txt
/baptisty-rossii/ preload cover-landing.webp, body renders cover-landing.svg
/baptisty-rossii/noch-na-kure/ preload cover-01-kura.webp, body renders cover-01-kura.svg
/pastor-series/ preload hero-main.webp, body renders hero.webp
```

### NEW-58 [P3] — `feed.xml` title drift on 13 items

Example:

```txt
feed: 20 антисоветов, как пастору разрушить своё служение
page: 20 антисоветов пастору: как разрушить служение | Господь Бог
```

### NEW-59 [P3] — `/hard-texts/` OG image dimensions mismatch

```txt
/hard-texts/
og:image = images/og-series-heart.webp
declared = 1200x630
actual = 1360x768
```

---

## 5. Positive Checks

- ✅ HSTS is present live (`Strict-Transport-Security: max-age=31556952`).
- ✅ Internal fragment links checked: 200, bad: 0.
- ✅ `target="_blank"` links checked: 219, missing `noopener`: 0.
- ✅ Non-Yandex images missing `width`/`height` live: 0.
- ✅ JSON-LD internal same-domain URLs resolve to sitemap/indexable-like URLs: 0 bad.
- ✅ Manifest icons all return 200.
- ✅ Verification root docs are not public: `/AGENTS.md`, `/AUDIT_HISTORY.md`, `/README.md` return 404.

---

## 6. Matrix Updates Applied

- `BUG-002` count updated to 45.
- HSTS removed from active bug wording and added as false positive.
- `NEW-46` downgraded from fixed to partially fixed / still open.
- `BUG-041` changed from fixed to re-opened / needs re-triage due noindex URLs in sitemap source.
- Added `NEW-50`–`NEW-59`.
- Updated next-agent prompt priorities to avoid sending agents after stale sitemap/HSTS directions.

