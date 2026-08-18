# Agent Audit Report — P1-13 / P1-14 / GBS2 Wiring Deep Pass

## Meta

- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength
- Agent: Arena Agent (arena.ai)
- Date: 2026-07-17
- Audited branch/ref: main
- Audited anchor (SHA): 485db8c25287fa9bd2f53a5356885f02e4b81f4b
- Environment: static source inspection via GitHub API + raw fetch
- Build mode: source
- Browser / device if used: N/A
- Scope: Deep pass on SEO-CANON-P1-13 (metadata parallel surfaces / drift), SEO-CANON-P1-14 (metadata fan-out asymmetry), GBS2 wiring (SeriesArticleLayout vs GillSeriesChrome vs baptisty-rossii runtime), feed.xml TZ/sort claims, ARTICLE_ROUTE_TYPES coverage, breadcrumb hardcode in SeriesArticleLayout
- Explicit exclusions: runtime Playwright verification; editorial-metadata.json content spot-checks (54kB file, inspected structure only)
- Signal class: Product
- Proof state: FAIL (confirmed defects below), PASS (several prior claims superseded/narrowed)
- Claim boundary: HEAD at anchor SHA 485db8c
- Preservation boundary: anchored to this SHA; do not update on Product movement
- Semantic owner: FedorMilovanov/gb-is-my-strength
- Overlapping active owner/PR/branch check: PR #1714 merged (name learning-sheet search input) — no overlap with audited surfaces

> The anchor records what this pass actually inspected. Do not update this report merely because the source repository later moved.

---

## 1. Deep findings — GBS2 wiring

### Finding `GBS2-ARCH-CONFIRMED-CURRENT` — GillSeriesChrome is the live GBS2 shell; SeriesArticleLayout.astro is orphaned

- Kind: defect (latent) / architecture debt
- Suggested impact: medium
- Route(s) / owner(s): `src/layouts/SeriesArticleLayout.astro`, `src/components/article-pilots/gill-series/GillSeriesChrome.astro`, `src/components/article-pilots/_shared/series/SeriesReaderChrome.astro`
- Observed on anchor: 485db8c

**Evidence:**

The historical GBS2 wiring claims (P1-14/15/16 in prior agents' evidence) focused on whether `SeriesArticleLayout.astro` was correctly wired. Direct inspection at current HEAD reveals the architecture has diverged from that model:

1. **baptisty-rossii articles do NOT use `SeriesArticleLayout.astro`.**  
   Example: `src/pages/baptisty-rossii/noch-na-kure/index.astro` imports `BaptistyRossiiNochNaKureBody.astro` directly — no `SeriesArticleLayout`. All 10+ baptisty-rossii article pages follow the same per-article component pattern.

2. **The actual GBS2 shell is `GillSeriesChrome.astro`**, reached via the thin `SeriesReaderChrome.astro` adapter. `BaptistyRossiiNochNaKureBody.astro` wraps content in `<SeriesReaderChrome pageId="noch-na-kure" config={BAPTIST_SERIES}>`, which delegates to `GillSeriesChrome`.

3. **`GillSeriesChrome.astro` correctly wires all GBS2 IDs:**
   - `GillSeriesRail.astro` provides: `id="gbs2Ring"`, `id="gbs2Pct"`, `id="gbs2Meta"`, `id="gbs2Toc"`, `id="gbs2Count"`, `id="gbs2Curbar"`, `id="gbsTocToggle"`, `id="gbsTocScroll"`, `id="gbsRailMid"`
   - `floating-cluster-controller.js` queries all these IDs (L2130, L2180, L2389, L2391, L2393) and the wiring is live.
   - `data-gbs2-theme`, `data-gbs2-search`, `data-gbs2-font`, `data-gbs2-share` buttons are present in the rail and wired via both delegated listener (L1121–1122) and direct `qsa('[data-gbs2-theme]')` binding (L1144–1149).

4. **`data-gbs2-pane="toc"` IS populated at runtime.** `floating-cluster-controller.js` L2149–2170: `var sheetTocPane = qs('[data-gbs2-pane="toc"]')` — the sheet TOC pane is populated with headings extracted from the article body. The prior claim that this was broken (empty `<nav>`) was based on `SeriesArticleLayout.astro`, not `GillSeriesChrome`.

5. **`SeriesArticleLayout.astro` is an orphan at current HEAD.** It exists in `src/layouts/` but is not imported by any baptisty-rossii page. It may be used by some other route (not audited in this pass), but its `gbs2-ring` / `gbs2Pct` / `gbs2Meta` elements are **static** (hardcoded `Math.round(113 * currentPos / totalParts)`), whereas `GillSeriesChrome` provides dynamic SSR values plus runtime JS update via `floating-cluster-controller.js`.

**Confirmed defects in `SeriesArticleLayout.astro`** (even if orphaned, these are bugs if the file is ever activated):

**A. Hardcoded breadcrumb label — `GBS2-BREADCRUMB-HARDCODE`:**  
```html
<!-- SeriesArticleLayout.astro L168 -->
<li class="breadcrumb__item">
  <a class="breadcrumb__link" href="/{seriesSlug}/">Баптисты России</a>
</li>
```
The breadcrumb second-level label is hardcoded to `"Баптисты России"` regardless of `seriesSlug`. If this layout were used for `pastor-series`, `dzhon-gill`, or `hard-texts`, the breadcrumb would display the wrong series name. The correct value should be `{seriesTitle}` or derived from `SECTION_META[seriesSlug]?.label`.

**B. `coverImg(entry)` called with wrong arg — `GBS2-COVERIMG-ARG`:**  
```typescript
// L39
function coverImg(entry: any) { return entry.data.ogImage || ''; }
// L108 — called with data.slug (string), not entry object:
<img src={coverImg(data.slug)} .../>
// L176 — same:
<img src={coverImg(data.slug)} .../>
```
`coverImg` expects an `CollectionEntry` object (with `.data.ogImage`) but is called with `data.slug` (a string). `data.slug.data` is `undefined`, so `ogImage` is always `''`. All hero images and mobile header images in this layout would be blank/broken. Confirmed bug.

- Evidence type: verified-source
- Confidence: high
- What this evidence does **not** prove: does not prove any live user-facing page is currently broken (since `SeriesArticleLayout.astro` appears orphaned from baptisty-rossii pages at this anchor).

---

## 2. P1-13 / P1-14 — Metadata fan-out and parallel surfaces

### Finding `P1-14-CURRENT` — `ARTICLE_ROUTE_TYPES` excludes `series-chapter`; `eligibleRecords()` compensates but creates split logic

- Kind: defect (architecture inconsistency)
- Suggested impact: medium
- Route(s) / owner(s): `scripts/lib/route-source-contract.js`, `scripts/lib/editorial-metadata.js`
- Observed on anchor: 485db8c

**Evidence:**

`route-source-contract.js` L11:
```js
const ARTICLE_ROUTE_TYPES = new Set(['article', 'series-article']);
```
`series-chapter` (used by all nagornaya parts) is **not** in `ARTICLE_ROUTE_TYPES`.

`editorial-metadata.js` L204:
```js
(ARTICLE_ROUTE_TYPES.has(record.profile?.routeType) || record.profile?.routeType === 'series-chapter') &&
```
`eligibleRecords()` manually adds `series-chapter` as a special case outside the canonical Set. This creates two distinct code paths for what is conceptually the same class of content.

**Route profile confirmation:**
- `nagornaya-chast-1.json`: `"routeType": "series-chapter"` → covered via the special-case OR, not via `ARTICLE_ROUTE_TYPES`
- `baptisty-rossii-noch-na-kure.json`: `"routeType": "series-article"` → covered via `ARTICLE_ROUTE_TYPES`
- `articles-20-antisovetov-pastoru.json`: `"routeType": "article"` → covered via `ARTICLE_ROUTE_TYPES`

**Fan-out gap confirmed:** `public-surface-registry.js` L19 defines `READING_ROUTE_TYPES = new Set(['article', 'series-article', 'series-chapter'])`. This correctly includes `series-chapter`, but `route-source-contract.js` does not. Scripts that import `ARTICLE_ROUTE_TYPES` from `route-source-contract.js` and don't add the `series-chapter` special-case will silently exclude nagornaya content from editorial metadata operations.

- Evidence type: verified-source
- Confidence: high (mechanism confirmed by exact source)
- Possible mechanism: `ARTICLE_ROUTE_TYPES` was defined before `series-chapter` routeType existed; the hack in `eligibleRecords()` was added as a targeted workaround without updating the canonical Set.
- What this evidence does **not** prove: does not prove data loss has occurred; nagornaya entries may be correctly present in `editorial-metadata.json` via the special-case path.

---

### Finding `P1-13-CURRENT` — Multi-surface metadata drift: confirmed structural gap, RSS TZ now clean

- Kind: mixed — structural gap confirmed, prior RSS TZ claim superseded
- Route(s) / owner(s): `data/editorial-metadata.json`, `feed.xml`, `src/content.config.ts`
- Observed on anchor: 485db8c

**Evidence — RSS TZ claim (from SUPER_AUDIT P1-15) — SUPERSEDED:**

`feed.xml` at anchor SHA: all 58 `<pubDate>` values use the same format: `Sat, 08 Aug 2026 21:00:00 GMT`. No mixed `+0300`/`+0000` timezone strings found. All dates are consistently expressed in GMT. The prior claim of mixed TZ in RSS is **not current** at this anchor. Recommend retiring that specific symptom.

**Evidence — RSS sort order: PASS:**
All 58 pubDates are in descending chronological order (confirmed by programmatic sort check). No out-of-order items.

**Evidence — lastBuildDate gap:**
`lastBuildDate: Sun, 16 Aug 2026 21:00:00 GMT` — this is 8 days *after* the most recent item (`Sat, 08 Aug 2026`). This indicates `lastBuildDate` is set to a build/deploy timestamp, not to the most recent item's pubDate. Per RSS spec this is technically valid, but it means feed readers may re-fetch the feed unnecessarily when no new content exists. Minor concern only.

**Evidence — Structural metadata gap (P1-13 core mechanism) — CURRENT:**

`content.config.ts` defines the article schema with `publishedAt` and optional `updatedAt`. The `editorial-metadata.json` registry (54kB) is a separate parallel SSOT. `route-source-contract.js` `ARTICLE_ROUTE_TYPES` defines which routes are "articles" for scripted operations.

The fundamental issue: at least **two authoritative sources** for publication dates exist:
1. MDX frontmatter `publishedAt`/`updatedAt`
2. `data/editorial-metadata.json` registry fields

A third surface — `feed.xml` `<pubDate>` — is generated from one of the above but it's not immediately clear which one dominates when they diverge.

Prior evidence (2026-07-17-deep-p1-gbs2-audit.md) cited a concrete example: antisovetov title diverged between MDX and editorial-metadata. That specific drift warrants a targeted spot-check:

`articles-20-antisovetov-pastoru.json` route profile: `"section": "articles"`, `"routeType": "article"` → eligible under both ARTICLE_ROUTE_TYPES and standard editorial-metadata path.

The D-19 defect (title `| Господь Бог` instead of `| Господь Бог — Сила Моя`) is a separate rendering defect in `AntisovetovPageHead.astro`, not a metadata drift issue. That prior agent's claim conflating D-19 with P1-13 appears to be a misclassification — the title in `AntisovetovPageHead.astro` is hardcoded HTML, not driven by `editorial-metadata.json`.

- Evidence type: verified-source
- Confidence: high for RSS supersession; medium for structural gap (full editorial-metadata.json not read)
- What this evidence does **not** prove: does not prove current data loss in editorial-metadata.json; does not prove feed readers are experiencing problems.

---

## 3. Challenges and negative findings

### Challenge prior `P1-15 RSS TZ` claim

- Target: SUPER_AUDIT_2026-07-06 P1-15 claim: "смешанные TZ (+0300/+0000)"
- Reason: At anchor 485db8c, all 58 feed.xml `<pubDate>` values are uniformly in GMT format. No `+0300` or `+0000` strings present.
- Evidence anchor: 485db8c / `feed.xml` (sha computed from blob API)
- Recommended result: **retired** — the RSS TZ mixing was fixed before or at this anchor. The RSS sort-order claim is also resolved. The `lastBuildDate` drift is a minor separate concern.

### Challenge prior `GBS2 TOC pane empty` claim (from 2026-07-17-gbs2-wiring.md)

- Target: prior incoming evidence claiming `[data-gbs2-pane="toc"]` pane stays empty
- Reason: `floating-cluster-controller.js` L2149–2170 explicitly populates `[data-gbs2-pane="toc"]` with heading links extracted from the article body at runtime. The TOC pane population is live code.
- Evidence anchor: 485db8c / `js/floating-cluster-controller.js` L2149-2170
- Recommended result: **superseded** — the prior claim was based on `SeriesArticleLayout.astro` which is not used by live pages. The active GBS2 shell (`GillSeriesChrome`) populates the pane correctly via JS.

### Challenge prior `GBS2 gbs2Pct/gbs2Ring unwired` claim

- Target: prior incoming evidence claiming `gbs2Pct`, `gbs2Ring`, `gbs2Meta` IDs are missing or hardcoded
- Reason: `GillSeriesRail.astro` L118 provides `id="gbs2Ring"`, L120 `id="gbs2Pct"`, L122 `id="gbs2Meta"`. `floating-cluster-controller.js` L2389–2397 reads `data-gbs2-done-min`, `data-gbs2-part-min`, `data-gbs2-total-min` from `document.body` and dynamically updates all three elements. The body attributes ARE present in live pages (confirmed: `noch-na-kure/index.astro` has `data-gbs2-done-min="0" data-gbs2-part-min="18" data-gbs2-total-min="229"`).
- Evidence anchor: 485db8c
- Recommended result: **superseded** — the dynamic update is live and correctly wired in GillSeriesChrome path.

---

## 4. Confirmed new defects (independent of prior claims)

### `GBS2-BREADCRUMB-HARDCODE` — SeriesArticleLayout breadcrumb hardcoded to "Баптисты России"

| Field | Value |
|---|---|
| File | `src/layouts/SeriesArticleLayout.astro` L168 |
| Defect | `href="/{seriesSlug}/">Баптисты России</a>` — label hardcoded, independent of `seriesSlug` |
| Impact | Any non-baptisty-rossii series using this layout gets wrong breadcrumb |
| Fix | Replace text with `{SECTION_META[seriesSlug]?.label ?? seriesTitle}` |
| Current live impact | Low — layout appears orphaned at this anchor, but it remains in source and could be activated |

### `GBS2-COVERIMG-ARG` — SeriesArticleLayout `coverImg()` called with wrong argument type

| Field | Value |
|---|---|
| File | `src/layouts/SeriesArticleLayout.astro` L39, L108, L176 |
| Defect | `coverImg(entry: CollectionEntry)` called with `data.slug` (string). `(string).data` is `undefined` → `ogImage` always returns `''` → hero img src blank |
| Impact | All series article pages using this layout: hero cover image and mobile header image broken (empty `src`) |
| Fix | Call `coverImg(part)` (passing full entry object) or inline `part.data.ogImage \|\| ''` |
| Current live impact | Low — layout appears orphaned; if activated, hero images would be blank |

### `P1-14-SPLIT-LOGIC` — `ARTICLE_ROUTE_TYPES` and `eligibleRecords()` have split-brain for `series-chapter`

| Field | Value |
|---|---|
| File | `scripts/lib/route-source-contract.js` L11 vs `scripts/lib/editorial-metadata.js` L204 |
| Defect | `ARTICLE_ROUTE_TYPES` does not include `'series-chapter'`; `eligibleRecords()` manually ORs it in |
| Impact | Any new script importing `ARTICLE_ROUTE_TYPES` without the manual OR will silently exclude nagornaya chapters from editorial metadata operations |
| Fix | Add `'series-chapter'` to `ARTICLE_ROUTE_TYPES` in `route-source-contract.js` and remove the duplicate OR in `eligibleRecords()` |
| Current live impact | Medium risk — latent; current scripts compensate, but the pattern is fragile |

---

## 5. Root-cause clusters

### Cluster `GBS2-LAYOUT-SPLIT`

- Findings: GBS2-ARCH-CONFIRMED-CURRENT, GBS2-BREADCRUMB-HARDCODE, GBS2-COVERIMG-ARG
- Common root: `SeriesArticleLayout.astro` was the original GBS2 layout but was superseded by the `GillSeriesChrome` architecture. The old file was never deleted or updated, accumulating bugs that only manifest if it's reactivated. The two-layout bifurcation is the root cause.
- System theme: ST-RUNTIME-OWNERSHIP
- Recommended action: Either delete `SeriesArticleLayout.astro` (if confirmed unused by all routes) or repair it and migrate any remaining pages to use `SeriesReaderChrome`/`GillSeriesChrome`.

### Cluster `ROUTE-TYPE-CANONICAL-SPLIT`

- Findings: P1-14-SPLIT-LOGIC
- Common root: `ARTICLE_ROUTE_TYPES` was defined at a point in time when `series-chapter` did not exist as a routeType. The workaround accumulated in `eligibleRecords()` instead of fixing the canonical Set.
- Recommended action: Unify `ARTICLE_ROUTE_TYPES` to include `'series-chapter'`; verify all call sites remain correct.

---

## 6. Summary table — prior P1-13/P1-14/GBS2 claims at anchor 485db8c

| Prior claim | Status at this anchor |
|---|---|
| P1-15: RSS mixed TZ (+0300/+0000) | **SUPERSEDED** — all GMT, uniform |
| P1-15: RSS items not sorted | **SUPERSEDED** — confirmed descending order |
| GBS2: TOC pane stays empty | **SUPERSEDED** — FCC L2149-2170 populates it |
| GBS2: gbs2Ring/gbs2Pct unwired | **SUPERSEDED** — GillSeriesRail provides IDs, FCC updates them |
| GBS2: data-gbs2-* buttons unwired | **SUPERSEDED** — FCC L1144-1149 + delegated listener wires all |
| P1-14: nagornaya excluded from editorial-metadata eligibility | **CURRENT** — special-case OR compensates but split-brain persists |
| P1-13: multi-surface date SSOT gap | **CURRENT STRUCTURALLY** — two SSOTs (frontmatter vs registry) with no merge contract visible in source |
| NEW: SeriesArticleLayout breadcrumb hardcode | **NEW CONFIRMED DEFECT** |
| NEW: SeriesArticleLayout coverImg() wrong arg | **NEW CONFIRMED DEFECT** |
| NEW: SeriesArticleLayout appears orphaned | **NEW OBSERVATION** — needs owner confirmation |
