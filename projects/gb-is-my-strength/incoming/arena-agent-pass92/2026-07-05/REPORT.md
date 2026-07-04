# Agent Work Report — Pass 92 (Content + Structure Deep Audit)

## Meta
- **Project:** gb-is-my-strength
- **Source repo:** FedorMilovanov/gb-is-my-strength
- **Agent:** arena-agent-pass92
- **Date:** 2026-07-05
- **Audited SHA:** `8c318010f6fd59694b6c9199cb54e4216e9d836d`
- **Current source HEAD:** `2f09c8f` (auto-update meta, cache-bust — no code changes from `8c318010`)
- **AuditRepo HEAD:** `ea221f5`
- **Mode:** deep-audit — content structure, frontmatter, build system, fonts, scripts

---

## 1. New Findings

### BUG-FRONTMATTER-INCONSISTENCY-01 — 9/20 MDX articles missing draft/noindex/sourcesRequired

- **Severity:** P2
- **Route/files:** `src/content/articles/*.mdx` (20 files)
- **Evidence (verified-source, `8c318010`):**
  ```
  Articles WITH draft/noindex/sourcesRequired (11):
    Gill series (5) ✅, pastor-series (1) ✅, hard-texts (2) ✅,
    kod-da-vinchi ✅, hermenevticheskaya ✅

  Articles WITHOUT draft/noindex/sourcesRequired (9):
    dva-sezda-1884, goneniya-i-sovest, iniciativnaya-gruppa,
    noch-na-kure, peterburgskaya-liniya, podpolnaya-pechat,
    sovetskaya-noch, spravochnik, vsehib-1944, yuzhnaya-shtunda
    → ALL baptisty-rossii series (russian-baptism)
  ```
- **Root cause:** Baptisty-rossii articles use a different layout (`SeriesArticleLayout` with `section: "baptisty-rossii"`) that may not check `draft`/`noindex`. But the inconsistency means: if an article accidentally ships as draft=true with the baptisty layout, nothing prevents it from being published.
- **Impact:**
  - `draft` missing → if set to `true`, does the build skip it? Unknown without runtime test.
  - `noindex` missing → search engines index by default (not necessarily wrong, but inconsistent).
  - `sourcesRequired` missing → no CI gate verifies sources exist for baptisty articles.
- **Confidence:** high
- **Suggested repair lane:** content-structure-normalization

---

### BUG-SCRIPTS-ORGANIZATION-01 — 133 npm scripts across 43 categories

- **Severity:** P2 (extends BUG-CONFIG-001)
- **Evidence (verified-source):**
  ```
  Total npm scripts: 133
  Categories (top): astro:19, strangler:10, gill:8, root:7,
    validate:7, contract:7, content:6, visual:6, smoke:5
  43 unique category prefixes
  ```
- **Analysis:** Not just "100+ scripts" (BUG-CONFIG-001) — the fragmentation into 43 categories with 1-2 scripts each is the real problem. `audit-pro.js` is 213KB (4498 lines) of monolithic validation with 398 error/warning/info calls. The script ecosystem has grown organically without consolidation.
- **Specific anti-patterns:**
  - `about:visual-parity:audit`, `biografii:visual-parity:audit`, `hard-texts:visual-parity:audit` etc. → 10 identical-pattern visual parity scripts that could be one with a route list parameter
  - `karty:visual-parity:audit`, `baptisty-rossii:visual-parity:audit` → same
- **Repair lane:** scripts-consolidation

---

### BUG-FONTS-CSS-MINIFIED — fonts.css stored minified in VCS

- **Severity:** P3
- **Evidence:** `fonts/fonts.css` — 1 line, 6.5KB, all `@font-face` declarations concatenated without formatting.
- **Analysis:** 27 `@font-face` declarations for 10 font families (Lora, Source Sans 3, Playfair Display, Cormorant Garamond, Inter, Noto Sans Hebrew, Noto Serif Hebrew, Noto Serif Greek, Noto Sans Greek). Impossible to review which weights/styles are loaded without tooling.
- **Specific issues:**
  - `Noto Serif Greek` loads BOTH woff2 AND ttf (fallback) — 2× the bytes. Is the TTF fallback intentionally kept after woff2 was added (commit `b9f4cb5`)?
  - `Lora` latin weights: 400, 400i, 600 — but cyrillic has 400, 400i, 500, 500i, 600. Latin is missing 500-weight. Intentional or gap?
- **Repair lane:** fonts-cleanup

---

### BUG-ROBOTS-TXT-SCOPING — duplicate confirmation

- **Severity:** P3 (confirms BUG-SEO-002)
- **Evidence:** `Allow: /llms.txt` is in the `User-agent: ImagesiftBot` block. AI retrieval bots that are separately blocked (`GPTBot`, `ClaudeBot`, `CCBot`) do NOT get the `Allow: /llms.txt` directive. They only see `Disallow: /`.
- **Impact:** `llms.txt` (44 entries, describing all site content for LLM consumption) is blocked for the very bots it was created for.
- **Repair lane:** seo-fix (already in matrix)

---

### BUG-STRANGLER-MATRIX-DRIFT — migration matrix (35) vs page-ownership (54) vs sitemap (43)

- **Severity:** P2 (confirms BUG-MATRIX-DRIFT-01)
- **Evidence:**
  ```
  route-migration-matrix.json: 35 routes (with 5 exclude patterns)
  page-ownership.json: 54 routes
  sitemap.xml: 43 <loc> entries
  ```
- **Analysis:** Matrix covers 35 routes with migration status. Ownership covers 54 (defines Astro vs legacy owner). Sitemap has 43 (some routes are noindex). The exclude patterns in migration matrix (`nagornaya/**`, `articles/dzhon-gill-*`, etc.) overlap with Astro-native routes but exclude them from migration tracking.
- **Risk:** A route in page-ownership but not in migration-matrix has no declared migration mode. If it breaks during a refactor, no script catches it.
- **Repair lane:** migration-data-alignment (already in matrix)

---

### BUG-STRANGLER-NO-LEGACY-ROOT-CHECK — copy-legacy-to-dist.js has no integrity gate for PUBLIC_ROOT_FILES

- **Severity:** P3
- **Evidence:** `scripts/copy-legacy-to-dist.js` defines `PUBLIC_ROOT_FILES` (16 files: .nojekyll, 404.html, CNAME, robots.txt, sitemap.xml, feed.xml, manifest.json, sw.js, llms.txt, favicon files, google/yandex verification HTML). The script copies them from root to dist, but does NOT verify that any of them exist before copying. A `copyFile` for a missing file silently fails.
- **Impact:** If `sw.js` or `sitemap.xml` is accidentally deleted from root, the strangler build passes without them. The dist would ship without a service worker or sitemap.
- **Suggested fix:** Add `fs.existsSync(rootFile)` check before each `copyFile`, with at minimum a `console.warn` for missing critical files (sw.js, sitemap.xml, robots.txt, CNAME).
- **Repair lane:** build-hardening

---

### BUG-DEV-ROUTE-EXPOSED — /dev/astro-test/ exists in page-ownership

- **Severity:** P3
- **Evidence:** `page-ownership.json` lists `/dev/astro-test/` → `src/pages/dev/astro-test.astro`. Marked as `build-only` (removed by `--production-like` flag). But the source file exists and is tracked in VCS.
- **Analysis:** This is a development/debug route. It's correctly excluded from production via `--production-like`. However, the route exists in the ownership registry and `astro build` generates it. If anyone runs `npm run build` without `--production-like`, the route ships.
- **Repair lane:** code-quality (document as intentional, add CI check that `--production-like` is always used for deploy)

---

### BUG-ARTICLE-NO-SERIES — 2 articles without series field

- **Severity:** P3
- **Evidence:**
  - `hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki.mdx` — no `series` field. Author: `abner-chou` (only non-Fedor author in the set).
  - `kod-da-vinchi.mdx` — no `series` field.
- **Analysis:** These are standalone articles. The absence of `series` is correct for standalone articles. But the frontmatter schema should explicitly document that `series` is optional, not required. Currently, 18/20 articles have it — the 2 without look like an omission rather than intentional.
- **Repair lane:** content-structure-normalization (document the schema)

---

## 2. Confirmations of Existing Findings

### Confirm BUG-SEO-002 (robots.txt scoping) — CONFIRMED on `8c318010`
- `Allow: /llms.txt` is scoped to `User-agent: ImagesiftBot`. AI bots (`GPTBot`, `ClaudeBot`) have `Disallow: /` with no `/llms.txt` exception.

### Confirm BUG-MATRIX-DRIFT-01 — CONFIRMED
- 35 migration routes vs 54 page-ownership entries vs 43 sitemap URLs. No cross-validation.

### Confirm BUG-CONFIG-001 (too many npm scripts) — CONFIRMED + EXTENDED
- 133 scripts across 43 categories. Beyond just "too many" — the fragmentation creates maintenance burden.

---

## 3. Challenges / Disputes

### (none)

---

## 4. Repair Lane Suggestions

| Lane | Bug IDs | Priority | Why |
|------|---------|----------|-----|
| `content-structure-normalization` | BUG-FRONTMATTER-INCONSISTENCY-01, BUG-ARTICLE-NO-SERIES | MEDIUM | 9 articles missing 3 fields. Standardize frontmatter schema. |
| `build-hardening` | BUG-STRANGLER-NO-LEGACY-ROOT-CHECK, BUG-DEV-ROUTE-EXPOSED | LOW | Build integrity improvements. |
| `fonts-cleanup` | BUG-FONTS-CSS-MINIFIED | LOW | De-minify, audit weight coverage. |
| `scripts-consolidation` | BUG-SCRIPTS-ORGANIZATION-01 + BUG-CONFIG-001 | LOW | Long-term refactor. |

---

## 5. Notes for Verifier

### Frontmatter inconsistency is systematic
The 9 baptisty-rossii articles ALL share the same missing fields. This isn't accidental — it's a different template/convention for that series. The question is: is this intentional (baptisty articles don't need `draft`/`noindex`/`sourcesRequired`) or an oversight during the Astro migration?

The `SeriesArticleLayout.astro` likely handles these articles differently than `ArticleLayout.astro` which processes the `articles` section. A verifier should check:
1. Does `SeriesArticleLayout` read `draft`/`noindex`/`sourcesRequired`?
2. If not, are baptisty articles implicitly always published and indexed?
3. Does `validate.js` or `audit-pro.js` check frontmatter completeness?

### Script consolidation is low-priority but high-value
The 133 scripts with 43 categories is technical debt that grows with every new feature. A consolidation pass (one script with route-list parameter instead of 10 identical scripts) would reduce maintenance burden significantly. But this is P3 — not blocking.

### Source HEAD note
Source has advanced to `2f09c8f` (auto cache-bust) and includes `66919ac` (SEC-001 + SEC-002 fixes). These are non-breaking metadata changes. All findings verified on `8c318010` remain valid for current HEAD.
