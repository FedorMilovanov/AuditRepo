# Wave 06 — live article text leakage + current content-quality witness

Date: 2026-08-10
Auditor: ChatGPT autonomous browser/source wave

## Anchors

- Product current main checked before analysis: `171daaf3fd40b92208c6e8b551acccdc00efbb6c`
- AuditRepo main rechecked immediately before write: `a7b27f14ce699a96147007868b5c0bbf4ef08b6c`
- Product mutation: **none**

## Capability boundary

The local execution container still cannot resolve `github.com`, so no fresh local Playwright screenshot is claimed. This wave uses two independent live/public crawl witnesses from the deployed article plus current exact-head source fetched through the GitHub connector. Findings are scoped to what those witnesses actually prove.

---

## Finding A — deployed article exposes the raw OG-image pathname in crawler-readable body text

**Disposition:** `CURRENT-LIVE CRAWLER-VISIBLE DEFECT`; browser/pixel confirmation still desirable before calling it a visible-layout defect.

Route:

`https://gospod-bog.ru/articles/krajne-li-isporcheno-serdce/`

Two independent public retrievals of the deployed HTML expose this sequence immediately before the article H1/body metadata:

`/images/og-krajne-isporcheno.webp Автор-редактор: Фёдор Милованов 41 Богословие Иер 17:9 ...`

The same pathname is not article prose. On current Product source it is frontmatter metadata only:

```yaml
ogImage: "/images/og-krajne-isporcheno.webp"
```

while the actual in-article hero illustration is a separate Markdown image:

```md
![Сердце человека на фоне разделённых путей — образ Иеремии 17 о доверии и самообмане](/images/og-krajne-isporcheno-600w.webp)
```

So the deployed body/text projection is leaking a metadata value that should normally remain an attribute/meta/structured value, not standalone reader/crawler text.

### Evidence strength

- **Live witness 1:** public HTML extraction places the raw pathname at the top of the article body immediately before author/category metadata.
- **Live witness 2:** independent search crawl for the exact pathname returns the same article and includes the same raw pathname in the body snippet.
- **Source witness:** exact current-head MDX confirms the raw 1200/OG pathname exists only as `ogImage` frontmatter; the reader image is the `-600w.webp` Markdown asset.

### Why this matters

Even if CSS visually hides the offending node in some browser states, it is entering the deployed document/text surface and search crawler extraction. This is a publication-quality / semantic-noise defect and may also indicate an article-header projection bug affecting other routes with the same rendering mechanism.

### Required next check

1. Capture the route in a real browser with CSS enabled and inspect the header DOM around the hero/byline block.
2. Determine whether the pathname is visually painted, visually hidden but accessibility/crawler-visible, or emitted through malformed markup/attribute fallback.
3. Census representative article routes to determine whether this is route-local or a shared article-header/root projection defect.
4. If shared, add a publication/browser guard asserting OG metadata values never appear as standalone visible/accessibility body text.

Do **not** fix by deleting `ogImage` metadata; the metadata is legitimate. Root cause belongs in the renderer/projection if reproduced there.

---

## Finding B — current deployed/source prose contains a concrete grammatical break in a high-visibility explanatory paragraph

**Disposition:** `CONFIRMED-CURRENT / content-quality defect`, low severity and route-local unless a source transformation caused it.

In the same live article, the paragraph describing the continuing activity of sin currently reads:

`...фактическая сила греха действовать в человеке изнутри — соблазнять, оскверняет дела, ранить совесть, ослаблять общение с Богом.`

The infinitive series is grammatically broken by `оскверняет`; the parallel form should be an infinitive (for example `осквернять дела`) or the sentence should be recast.

The live crawl and current exact-head MDX both contain the same wording, so this is not stale-index noise.

This is not MASTER-worthy by itself unless editorial policy treats current reader-text defects as active necessary work. It is suitable as a bounded current content-quality repair candidate after collision/current-owner check.

---

## Negative / narrowed observations

- The live article has a real skip link (`Перейти к содержанию`) in deployed extraction; therefore no generic claim of “reader routes lack skip navigation” is supported by this route.
- The `/hard-texts/` series surface also exposes coherent primary navigation and breadcrumb text in live extraction; no new broken-navigation defect was established in this wave.
- No fresh claim is made about visual pixel severity of Finding A until an actual browser screenshot/DOM geometry witness is available.

---

## Collision / mutation note

No Product files, PRs, branches, MASTER rows, or Work Queue entries were modified. This is incoming evidence only. AuditRepo head was rechecked immediately before publication and had not advanced beyond Wave 05, so no parallel AuditRepo work was overwritten.
