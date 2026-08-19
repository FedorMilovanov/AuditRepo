# Agent Audit Report — Wave 3 (Arena Agent)

## Meta

- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength
- Agent: Arena Agent (arena.ai)
- Date: 2026-07-17
- Audited branch/ref: main
- Audited anchor (SHA): cb3681e1a85b5f8919c9dc537f812a842bbe9235
- Commit message at HEAD: `feat(app): premium Bible App integration across site (#1725)`
- Environment: static source inspection via GitHub API / raw fetch
- Scope: new HEAD `cb3681e` — full re-read of: `src/pages/app/index.astro`, `src/data/site.ts`, `src/components/rodosloviye/RodosloviyePageHead.astro`, `src/components/karty/KartyPageHead.astro`, `src/components/genealogy/layout.ts`, `src/components/genealogy/GenealogyTree.tsx`, `data/genealogy/genealogy.json` (meta + first persons block), `src/components/reader-platform/ReaderPreferencesHead.astro`, `js/enhancements.js` (multi-writer surface), `src/components/article-pilots/_shared/mobileChromeRegistry.ts`
- Signal class: Product, Technical-Debt, Data
- Claim boundary: HEAD at anchor SHA above
- Preservation boundary: anchored to cb3681e; do not update merely because Product moves

---

## 1. Verification of prior Wave claims against new HEAD

| Prior finding ID | Prior anchor | Re-check result at cb3681e | Notes |
|---|---|---|---|
| `SITE-TS-SERIES-ORDER` | 485db8c | **CONFIRMED CURRENT** | `src/data/site.ts` SERIES_ORDER `dzhon-gill` still lists `chast-4-ekzeget` before `chast-3-nasledie` at cb3681e |
| `RODOSLOVIYE-OG-IMAGE` | 485db8c | **CONFIRMED CURRENT** | `RodosloviyePageHead.astro` still serves `og-karty-1200x630.webp` at cb3681e; rodosloviye page has wrong OG image |
| `HTML-BTN-TYPE-MISSING` | 485db8c | **CONFIRMED CURRENT** | Pattern persists; PastorSeriesPageChrome.astro not changed in PR #1725 |
| `AR-IDX-JS-02-THEME-MULTIWRITER` | 485db8c | **CONFIRMED CURRENT** | `js/enhancements.js` still contains `SiteUtils.themeKey\|\|"theme"` localStorage fallback at cb3681e |
| `GENEALOGY-LINEAGE-ANCESTOR-TRACE` | 485db8c | **CONFIRMED CURRENT** | `layout.ts` `computeFocusLineage` still only follows `mother` for `jesus`; all others paternal only |

---

## 2. New findings at HEAD cb3681e

### Finding: `APP-OG-TYPE-MISMATCH`

- **File:** `src/pages/app/index.astro`
- **Signal class:** Product / SEO
- **Proof state:** FAIL
- **Evidence angle:** source

PR #1725 introduced the `/app/` page. The page sets:

```html
<meta property="og:type" content="website" />
<meta property="article:published_time" content={publishedTime} />
<meta property="article:modified_time" content={modifiedTime} />
```

`article:published_time` and `article:modified_time` are Open Graph properties that belong to the `article` object type and are only valid when `og:type = "article"`. Using them under `og:type = "website"` is a spec violation. Facebook, LinkedIn and other parsers that implement the OG spec strictly will either ignore the timestamps or generate warnings. The issue is not cosmetic — it can cause incorrect rich-preview date display.

**Minimum closure proof:** Either remove both `article:*` tags (the page is a product landing, not an article) or change `og:type` to `"article"` and verify the canonical/sitemap implications.

---

### Finding: `APP-POSTDATED-METADATA`

- **File:** `src/pages/app/index.astro`
- **Signal class:** Product / Data Integrity
- **Proof state:** FAIL (requires owner confirmation)
- **Evidence angle:** source

Hardcoded timestamps:

```js
const publishedTime = '2026-08-17T00:00:00+03:00';
const modifiedTime  = '2026-08-17T00:00:00+03:00';
```

The commit introducing this page landed at `2026-08-19`. If the `/app/` URL was not live before 2026-08-17, the published date is accurate but two days behind the merge. If the page was live before the PR, the date is intentionally back-dated. Either way the `modifiedTime` should be updated on every material change and the current `publishedTime` should be owner-confirmed.

**Owner decision needed:** Confirm the actual first-live date of `/app/`; set `modifiedTime` to match commit date or build-time variable.

---

### Finding: `GENEALOGY-ID-INVALID-SPACE` — reconfirmed at cb3681e

- **File:** `data/genealogy/genealogy.json`
- **Signal class:** Data / Product
- **Proof state:** FAIL
- **Evidence angle:** source (confirmed via Wave 2 + current HEAD)

JSON persons array contains an entry with `"id": " lud_shem"` (leading space). The `genealogy.json` version string at HEAD is `2026-06-19-v3-integrity-fix`, suggesting a prior integrity fix pass that missed this entry. The layout engine builds a `Map<string, Person>` keyed on `p.id`; any lookup using the clean string `"lud_shem"` will return `undefined`. This silently breaks the genealogy tree rendering for that node and any edges referencing it.

---

## 3. Scope checked but PASS (no new finding)

| Surface | Result | Notes |
|---|---|---|
| `KartyPageHead.astro` OG image | PASS (no new finding) | Image `og-karty-1200x630.webp` is semantically correct for the /karty/ page |
| `mobileChromeRegistry.ts` engine selection | PASS | Registry-based, no pathname.includes(); compliant with declared design intent |
| `ReaderPreferencesHead.astro` search injection guard | NARROWED — still present | `searchOpenerRoutes` set is explicit: `/articles/`, `/biografii/`, `/pastor-series/`. Route `/pastor-series/` is in the set but the existence of static search buttons in Header.astro for those routes was previously flagged as `UI-DUPLICATE-SEARCH-BUTTON`. That finding requires separate Header.astro inspection to re-verify at cb3681e; not resolved by this pass |
| `content.config.ts` schema | PASS | Schema is consistent; `superRefine` validates `ogImageAlt` co-presence and `updatedAt ≥ publishedAt`; no defects found |

---

## 4. Executive result

| Input | Current local | Confirmed residuals | Stale | Invalid | Parked |
|---:|---:|---:|---:|---:|---:|
| 10 checks | 3 new FAIL | 5 prior confirmed | 0 | 0 | 1 (APP-POSTDATED needs owner confirm) |

### Root cause note

The `APP-OG-TYPE-MISMATCH` and `APP-POSTDATED-METADATA` findings share a single root: the `/app/` page was authored with article-style metadata (`article:published_time`) inside a `website`-typed document. The fix for both is a single metadata correction in `app/index.astro`.

`GENEALOGY-ID-INVALID-SPACE` and `GENEALOGY-LINEAGE-ANCESTOR-TRACE` share a data/logic root: the genealogy subsystem lacks a validation pass on node IDs and lineage tracing logic. These are distinct fixes but belong to the same `GENEALOGY-DATA-INTEGRITY` system theme.

---

## 5. MASTER update recommendation

This pass adds 2 confirmed new current defects to MASTER (`APP-OG-TYPE-MISMATCH`, `APP-POSTDATED-METADATA`). All 5 prior findings remain current at cb3681e. No rows should be retired from MASTER based on this pass.

