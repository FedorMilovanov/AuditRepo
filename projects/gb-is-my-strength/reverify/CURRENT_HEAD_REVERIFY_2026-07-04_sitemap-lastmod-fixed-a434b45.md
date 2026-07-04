# Current-head reverify — sitemap lastmod drift fixed

**Project:** `gb-is-my-strength`  
**Date:** 2026-07-04  
**Source main before fix:** `da4a65cd33e046368dc089d48b42989de2344995`  
**Source fix commit:** `a434b45ee6d8cefb0ce281039ad683fe9b9589ba`  
**Source lane/main:** `lane/seo-sitemap-lastmod-refresh-2026-07-04` and `main`

---

## 1. Scope

Close `NEW-70` sitemap lastmod drift. The sitemap still contained broad stale June buckets for many pages whose route files had current July git modification dates.

---

## 2. Source changes

Commit `a434b45e`:

- `sitemap.xml`: refreshed each public route `<lastmod>` from the corresponding route file's latest git commit date, converted to Moscow `+03:00` ISO8601.
- Added lane report: `docs/refactor-2026/lanes/seo-sitemap-lastmod-refresh-2026-07-04.md`.

---

## 3. Verification

```text
git diff --check           PASS
npm run validate:all       PASS
node scripts/audit-pro.js  PASS
npm run contract:compare   PASS
npm run guard:shared-files PASS after lane commit
```

Post-fix sitemap stats:

```text
sitemap URLs: 43
unique lastmod values: 8
old June buckets removed from changed/current route files
all lastmod values remain ≤ current date
```

---

## 4. Status

`NEW-70`: **fixed-current on source main `a434b45e` by sitemap/static validation evidence**.

Remote workflow should be observed separately because this push triggers IndexNow metadata/cache-bust and then deploy.
