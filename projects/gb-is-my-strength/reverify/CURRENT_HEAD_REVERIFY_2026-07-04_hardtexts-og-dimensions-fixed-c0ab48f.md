# Current-head reverify — hard-texts OG dimensions fixed

**Project:** `gb-is-my-strength`  
**Date:** 2026-07-04  
**Source main before fix:** `a434b45ee6d8cefb0ce281039ad683fe9b9589ba`  
**Source fix commit:** `c0ab48fc845ef27a1575d13a078dc832cab8df48`  
**Source lane/main:** `lane/seo-hardtexts-og-dimensions-2026-07-04` and `main`

---

## 1. Scope

Close the `NEW-59` part of the social/SEO metadata bundle: `/hard-texts/` declared its `og:image` dimensions as `1200×630`, while the referenced image `images/og-series-heart.webp` is actually `1360×768`.

---

## 2. Source changes

Commit `c0ab48fc`:

- `hard-texts/index.html`: `og:image:width` / `og:image:height` set to `1360` / `768`.
- `src/pages/hard-texts/index.astro`: same source-route update.
- Added lane report: `docs/refactor-2026/lanes/seo-hardtexts-og-dimensions-2026-07-04.md`.

---

## 3. Verification

```text
PIL image check: images/og-series-heart.webp = 1360×768 PASS
npm run validate:strict                                  PASS (0 errors, 2 pre-existing warnings)
npm run schema:rich-results:audit                        PASS
node scripts/audit-pro.js                                PASS
git diff --check                                         PASS
npm run guard:shared-files                               PASS
```

---

## 4. Status

`NEW-59`: **fixed-current on source main `c0ab48fc`**.

Other `NEW-54..58` social/SEO bundle items remain separate and should not be closed by this fix.
