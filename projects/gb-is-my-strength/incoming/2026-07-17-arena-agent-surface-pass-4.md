# Agent Audit Report — Surface Pass 4: ArticleLayout legacy date SSOT, rodosloviye OG image, GenealogyTree error boundary, astro.config sitemap, mobileChromeRegistry gaps, API endpoints

## Meta

- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength
- Agent: Arena Agent (arena.ai)
- Date: 2026-07-17
- Audited branch/ref: main
- Audited anchor (SHA): 485db8c25287fa9bd2f53a5356885f02e4b81f4b
- Environment: static source inspection via GitHub API
- Build mode: source
- Scope: ArticleLayout.astro (legacy date SSOT, seriesNames hardcode), rodosloviye OG/twitter image mismatch, GenealogyTree.tsx error boundary absence, astro.config.mjs sitemap filter coverage, mobileChromeRegistry completeness, src/pages/js + src/pages/data API endpoints, izbrannoe noindex vs sitemap, WORK_QUEUE relevance scan
- Explicit exclusions: React runtime rendering (requires browser); full genealogy.json data audit
- Signal class: Product
- Proof state: FAIL (confirmed defects), PASS (sitemap endpoint exclusion), CANDIDATE (error boundary)
- Claim boundary: HEAD SHA 485db8c
- Preservation boundary: anchored to this SHA

---

## 1. `RODOSLOVIYE-OG-IMAGE` — `/rodosloviye/` shares OG/twitter image with `/karty/`

- Kind: **defect**
- Suggested impact: low-medium
- Route(s) / owner(s): `src/components/rodosloviye/RodosloviyePageHead.astro`
- Observed on anchor: 485db8c

**Evidence:**

`RodosloviyePageHead.astro` L27 and L37:
```html
<meta property="og:image" content="https://gospod-bog.ru/images/og-karty-1200x630.webp" />
<meta name="twitter:image" content="https://gospod-bog.ru/images/og-karty-1200x630.webp" />
```

Both `og:image` and `twitter:image` use `og-karty-1200x630.webp` — the **maps (`/karty/`) preview image**, not a rodosloviye-specific image. When `/rodosloviye/` is shared to social media (VK, Telegram, Twitter/X), the link preview will show a maps image, misleading users about the page content.

The `og:image:alt` is correctly set to `"Родословие от Адама до Христа — интерактивное древо"` (L31) — the alt text is route-specific but the image itself is wrong.

- Evidence type: verified-source
- Confidence: high
- Possible mechanism: `RodosloviyePageHead.astro` was created by copying `KartyPageHead.astro` or similar; the `og:image` was not updated to a rodosloviye-specific asset.
- Fix: Create a dedicated `og-rodosloviye-1200x630.webp` image (or reuse an appropriate genealogy visual) and update both `og:image` and `twitter:image` in `RodosloviyePageHead.astro`.
- What this does NOT prove: does not prove a broken page; purely a content/SEO defect for social sharing.

---

## 2. `ARTICLE-LAYOUT-LEGACY-DATE-SSOT` — `ArticleLayout.astro` reads dates from legacy HTML at build time — third SSOT

- Kind: **defect / architecture** (extends P1-13 system theme)
- Suggested impact: medium
- Route(s) / owner(s): `src/layouts/ArticleLayout.astro` L24–44
- Observed on anchor: 485db8c

**Evidence:**

```typescript
// ArticleLayout.astro L24-32
function legacyArticleMetaTime(prop: 'article:published_time' | 'article:modified_time') {
  const file = path.join(process.cwd(), data.section, data.slug, 'index.html');
  if (!existsSync(file)) return '';
  const html = readFileSync(file, 'utf8');
  // ...regex to extract meta property from legacy HTML
}

const legacyPublished = safeDate(legacyArticleMetaTime('article:published_time'));
const legacyUpdated   = safeDate(legacyArticleMetaTime('article:modified_time'));
const published = legacyPublished || safeDate(data.publishedAt) || new Date(data.publishedAt);
const updated   = legacyUpdated   || safeDate(data.updatedAt);
```

**Three SSOTs for article publication dates, with legacy HTML taking highest priority:**

| Priority | Source | Owner |
|---|---|---|
| 1 (highest) | Legacy HTML file `<section>/<slug>/index.html` at build time | legacy HTML on disk |
| 2 | MDX frontmatter `data.publishedAt` / `data.updatedAt` | content schema |
| 3 | `data/editorial-metadata.json` | registry (separate system) |

The comment explains this is intentional: "Public shadow articles must mirror legacy root SEO exactly." But the mechanism creates a hidden override where a stale legacy HTML file silently takes precedence over the MDX frontmatter. If `update-meta.js` writes an incorrect date to the legacy HTML, it propagates to JSON-LD, `og:article:published_time`, and RSS without any schema validation.

**Interaction with D-19 (antisovetov title bug):** The antisovetov article has known metadata drift between surfaces. If its legacy HTML has a different `article:published_time` than its MDX `publishedAt`, the rendered `datePublished` in JSON-LD will silently use the legacy HTML date — with no build warning.

**Routes affected:** All articles rendered via `ArticleLayout.astro` that have a corresponding legacy HTML file with `migrationLane !== 'content'` (i.e., still in reference mode).

- Evidence type: verified-source
- Confidence: high (mechanism is in source; exact current impact depends on what legacy HTML dates are)
- What this does NOT prove: does not prove dates are currently wrong; does not prove JSON-LD is incorrect for any specific article at this anchor.

---

## 3. `ARTICLE-LAYOUT-SERIES-NAMES-HARDCODE` — `seriesNames` map incomplete for new series

- Kind: **defect** (maintenance / latent)
- Suggested impact: low
- Route(s) / owner(s): `src/layouts/ArticleLayout.astro` L76–82
- Observed on anchor: 485db8c

**Evidence:**

```typescript
// ArticleLayout.astro L76-82
const seriesNames: Record<string, string> = {
  'dzhon-gill':      'Джон Гилл',
  'russian-baptism': 'Баптисты России',
  'hard-texts':      'Тайны человеческого сердца',
  'pastor-series':   'Тёмная сторона кафедры',
};
seriesLabel = seriesNames[data.series] || data.series;
```

Missing series keys: `'genesis-6'` (6 published articles in `hard-texts/` with `series: 'genesis-6'`), and any future series. If a genesis-6 article renders through `ArticleLayout`, `seriesLabel` falls back to the raw key string `"genesis-6"` instead of a human-readable name. This would appear in breadcrumbs, series navigation labels, and potentially JSON-LD.

The correct source of truth already exists: `SECTION_META` in `site.ts` has human labels for all sections; `SERIES_ORDER` in `site.ts` lists all series keys. A derived map from `SERIES_ORDER` + `SECTION_META` would be auto-complete.

- Evidence type: verified-source
- Confidence: high
- Fix: Add `'genesis-6': 'Бытие 6 — исследовательская серия'` (or appropriate title) to `seriesNames`, or derive labels from `SECTION_META`/`SERIES_ORDER` automatically.

---

## 4. `GENEALOGY-NO-ERROR-BOUNDARY` — `GenealogyTree` React island has no `ErrorBoundary`; runtime failure = blank div

- Kind: **risk** (medium)
- Suggested impact: medium
- Route(s) / owner(s): `src/pages/rodosloviye/index.astro`, `src/components/genealogy/GenealogyTree.tsx`
- Observed on anchor: 485db8c

**Evidence:**

`rodosloviye/index.astro`:
```html
<div id="genealogy-tree" style="width: 100%; height: 85vh; ...">
  <GenealogyTree client:only="react" persons={persons} eras={eras} />
</div>
```

`GenealogyTree.tsx` analysis:
- Uses `@xyflow/react` v12.11.3 (peer dependency: React 19.2.8)
- No `ErrorBoundary` wrapper found in `GenealogyTree.tsx`, `SplitView.tsx`, `DetailPanel.tsx`, or `PersonNode.tsx`
- `client:only="react"` means NO server-side rendering — the container `<div>` is empty HTML until React hydrates
- If `@xyflow/react` throws a runtime error (data shape mismatch, layout computation error, WebGL/canvas failure), React 19 will unmount the entire tree and the `<div id="genealogy-tree">` will be empty with no user-visible error message

**Risk scenario:** `genealogy.json` data changes shape (e.g., a `Person` entry missing a required field) → `buildLayout()` or `computeFocusLineage()` throws → React error propagates to root → blank 85vh div. No fallback content, no "failed to load" message.

**Aggravating factor:** The page has no `<noscript>` fallback for the genealogy tree content either.

- Evidence type: verified-source (absence of error boundary confirmed by full file read)
- Confidence: high (architectural gap is clear)
- Fix: Wrap `<GenealogyTree>` in a React `ErrorBoundary` component with a user-visible fallback message. Also add a `<noscript>` fallback in `rodosloviye/index.astro`.
- What this does NOT prove: does not prove the tree is currently crashing; the risk is latent.

---

## 5. `ASTRO-SITEMAP-FILTER-INCOMPLETE` — sitemap filter only excludes `/izbrannoe/`; other potential private routes unguarded

- Kind: **risk** (low)
- Route(s) / owner(s): `astro.config.mjs` L12
- Observed on anchor: 485db8c

**Evidence:**

```js
// astro.config.mjs L12
sitemap({ filter: (page) => !page.includes('/izbrannoe') })
```

The Astro sitemap integration auto-generates from all `prerender: true` pages. The filter explicitly excludes `/izbrannoe/` (correct — it has `robots: noindex`).

**Verified clean:**
- `/js/atlas-runtime.js` and `/data/relations.compiled.json` are API endpoints with no HTML route — they do NOT appear in the sitemap ✅
- `/izbrannoe/` correctly excluded ✅

**Gap:** `astro.config.mjs` relies on a single string-match filter. If a new `noindex` page is added (e.g., a user-auth callback, a private preview route), the developer must remember to add it to this filter. There is no automated cross-check between `robots: noindex` in page components and sitemap exclusion.

**Current state:** No current noindex page other than `/izbrannoe/` found at this anchor. Risk is latent/architectural.

- Evidence type: verified-source
- Confidence: high
- Impact: low (no current gap found; risk for future routes)

---

## 6. `MOBILECHROME-REGISTRY-GAPS` — `mobileChromeRegistry.ts` missing several live routes

- Kind: **defect** (scope/maintenance)
- Suggested impact: low
- Route(s) / owner(s): `src/components/article-pilots/_shared/mobileChromeRegistry.ts`
- Observed on anchor: 485db8c

**Evidence:**

`MOBILE_CHROME_ROUTES` registered entries at anchor:
- Series (static): all Gill articles, Hermenevtika
- Series landing: `/hard-texts/`
- Page (registry): `/articles/`, `/biografii/`, `/rodosloviye/`, `/karty/`, `/konfessii/`

**Missing from registry (live routes, not in any `static` chrome either):**
- `/pastor-series/` — uses `PastorSeriesPageChrome` which has no mobile chrome component
- `/nagornaya/` — series landing; uses NagornayaChast*PageChrome (which has a desktop sidebar, not a mobile bar)
- `/nagornaya/chast-1/` through `/chast-5/` — each has own `NagornayaChast*PageChrome` with sidebar but no MobileChromePage
- `/app/` — full-screen Telegram Mini App launcher; intentionally excluded (no scroll context)
- `/hard-texts/<slug>/` (genesis-6 articles) — uses `Genesis6ArticlePage`, not registered as static or registry

**Registry comment on intentional exclusions:** `/izbrannoe/` (sticky navbar, no scroll-reveal) and `/map/` (fullscreen graph) — both documented. But `/pastor-series/`, nagornaya chapters, and genesis-6 articles have no documented exclusion reason in the registry.

**Impact:** On mobile, users visiting `/pastor-series/` or genesis-6 articles get no mobile bottom-bar chrome (Back/Home/Search). They must use the page's own navigation (which PastorSeriesPageChrome provides via `h-navbar`). This may be acceptable by design, but is undocumented in the registry.

- Evidence type: verified-source
- Confidence: high (registry enumerated completely)
- Fix option: Either add entries for missing routes (if mobile chrome is desired) or add explicit `{ enabled: false }` entries with documented reasons to make the exclusion intentional and searchable.

---

## 7. `IZBRANNOE-SITEMAP-PASS` — `/izbrannoe/` correctly excluded from sitemap

Confirmed PASS: `astro.config.mjs` sitemap filter excludes `/izbrannoe/`; page has `robots="noindex, follow"`. Both exclusion mechanisms are consistent. ✅

---

## 8. `RODOSLOVIYE-SITEMAP-CONFIRMED` — `/rodosloviye/` is a real production route in sitemap

Prior candidate `RODOSLOVIYE-UNCONFIRMED` from pass 3 is resolved: `src/pages/rodosloviye/index.astro` exists, has `robots="index, follow"`, `canonical` set correctly, and appears in `sitemap.xml`. Route is confirmed live. ✅

---

## 9. Root-cause clusters — this pass

### Cluster `METADATA-SSOT-PROLIFERATION` (extends ST-EDITORIAL)

- Findings: `ARTICLE-LAYOUT-LEGACY-DATE-SSOT` (this pass), `P1-14-SPLIT-LOGIC` (pass 2), `P1-13-CURRENT` (pass 2)
- Common root: Editorial dates have three independent sources (legacy HTML, MDX frontmatter, `editorial-metadata.json`) with an implicit priority order baked into `ArticleLayout.astro`. No single declared canonical SSOT with validation.
- System theme: ST-EDITORIAL
- Recommended action: Define one canonical date source (likely `editorial-metadata.json`), pipe it through to `ArticleLayout.astro` at build time, and eliminate the `legacyArticleMetaTime()` fallback chain once legacy HTML is retired.

### Cluster `HARDCODED-LABEL-MAPS`

- Findings: `ARTICLE-LAYOUT-SERIES-NAMES-HARDCODE` (this pass), `GBS2-BREADCRUMB-HARDCODE` (pass 2)
- Common root: Human-readable series/section labels are maintained in multiple disconnected hardcoded maps (`seriesNames` in ArticleLayout, breadcrumb text in SeriesArticleLayout) rather than derived from the single authoritative `SECTION_META` / `SERIES_ORDER` in `site.ts`.
- Recommended action: Export a `seriesLabel(seriesKey: string): string` utility from `site.ts` and use it in both layouts.

### Cluster `REACT-ISLAND-RESILIENCE`

- Findings: `GENEALOGY-NO-ERROR-BOUNDARY` (this pass)
- Common root: `client:only="react"` islands have no SSR fallback and no React ErrorBoundary. Any runtime error = blank container.
- Recommended action: Wrap all `client:only` islands in an `ErrorBoundary` with a user-visible fallback. Add `<noscript>` content where the island carries primary page content.

---

## 10. Summary table — new findings this pass

| ID | Finding | Type | Impact |
|---|---|---|---|
| `RODOSLOVIYE-OG-IMAGE` | `/rodosloviye/` og:image + twitter:image = `og-karty-1200x630.webp` (wrong — karty/maps image) | defect | low-medium |
| `ARTICLE-LAYOUT-LEGACY-DATE-SSOT` | `legacyArticleMetaTime()` reads legacy HTML at build time; highest priority date source, silently overrides MDX frontmatter | defect / architecture | medium |
| `ARTICLE-LAYOUT-SERIES-NAMES-HARDCODE` | `seriesNames` map missing `'genesis-6'` and future series; falls back to raw key string in labels | defect | low |
| `GENEALOGY-NO-ERROR-BOUNDARY` | `GenealogyTree` React island has no `ErrorBoundary`; runtime failure = blank 85vh div, no feedback | risk | medium |
| `ASTRO-SITEMAP-FILTER-INCOMPLETE` | Single `!page.includes('/izbrannoe')` filter; no automated noindex↔sitemap consistency check | risk | low |
| `MOBILECHROME-REGISTRY-GAPS` | `/pastor-series/`, nagornaya chapters, genesis-6 articles not in registry — undocumented exclusions | maintenance | low |
| `IZBRANNOE-SITEMAP-PASS` | `/izbrannoe/` correctly excluded; noindex consistent with sitemap filter | PASS | — |
| `RODOSLOVIYE-SITEMAP-CONFIRMED` | `/rodosloviye/` confirmed live production route; prior `UNCONFIRMED` candidate resolved | PASS | — |
| `API-ENDPOINTS-SITEMAP-PASS` | `/js/atlas-runtime.js` and `/data/relations.compiled.json` correctly absent from sitemap | PASS | — |
