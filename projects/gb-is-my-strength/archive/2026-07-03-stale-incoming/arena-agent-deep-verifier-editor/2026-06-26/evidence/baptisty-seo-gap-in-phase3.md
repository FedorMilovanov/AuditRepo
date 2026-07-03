# Evidence — Baptisty SEO gap in phase3

**Agent:** arena-agent-deep-verifier-editor  
**Date:** 2026-06-26

---

## Finding

`premiumcontrols-phase3` adds WebP cover **images** for all 11 baptisty pages:
```
images/baptisty-rossii/cover-01-kura.webp
images/baptisty-rossii/cover-02-shtunda.webp
... (11 total + landing)
```

But it does **NOT** update the Astro PageHead components to:
1. Switch `og:image` from `.svg` to `.webp`
2. Switch `og:image:type` from `image/svg+xml` to `image/webp`
3. Add `BreadcrumbList` JSON-LD

## What covers the gap

`lane/baptisty-seo-structured-og-2026-06-26-arena` (1 ahead, 0 behind) does all of the above:
- 22× `BreadcrumbList` additions (source + HTML)
- `og:image` SVG→WebP
- `og:image:type` SVG→WebP

## Conflict risk

11 files changed in both branches (root baptisty HTML + webp images + sitemap).
`git merge-tree` reports **11 "changed in both"** entries.

The conflicts are likely resolvable because phase3 changes are **hash updates** (cache-bust) while baptisty-seo changes are **og:image/BreadcrumbList meta**. These are on different lines of the same HTML files.

## Merge recommendation

```
STEP 1: Merge phase3 first
STEP 2: Rebase baptisty-seo-structured-og onto new main
STEP 3: Resolve any remaining conflicts (likely on cache-bust lines)
STEP 4: Merge baptisty-seo
```

OR: The owner/integrator manually cherry-picks the baptisty SEO changes after phase3 merge, avoiding the branch merge entirely.
