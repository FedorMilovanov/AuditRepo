# Wave 07 — live readable-text pollution / inline editorial apparatus

Date: 2026-08-10
Auditor: ChatGPT autonomous browser/evidence wave
Product anchor: `171daaf3fd40b92208c6e8b551acccdc00efbb6c`
AuditRepo pre-write anchor: `8452aeda6ccfaf72ac4e27b8af3d2f0a97a7b817`
Mutation boundary: **AuditRepo evidence only; no Product mutation.**

## Scope

This wave continued the live/source audit with emphasis on crawler-readable text, accessibility/readability projection, article editorial apparatus, search-visible output and stale/false-positive separation.

Environment limitation remains: the local container could not DNS-resolve `gospod-bog.ru`, so no local Playwright click/screenshot is claimed. Public search/live crawl witnesses and exact current-source witnesses were used instead.

## Finding A — CONFIRMED CURRENT: article exposes glossary definitions and citation indices as undelimited body text

Route:

- `https://gospod-bog.ru/articles/krajne-li-isporcheno-serdce/`

Current source:

- `src/content/articles/krajne-li-isporcheno-serdce.mdx`
- exact Product anchor `171daaf3fd40b92208c6e8b551acccdc00efbb6c`

### Live witness

Public crawl output for the live route contains repeated concatenations that are semantically part of the visible/readable article stream rather than cleanly separated editorial apparatus. Representative examples observed on 2026-08-10:

- `остаточного греха В реформатском богословии: ...`
- `Вестминстерское исповедание Исповедание реформатской веры, составленное...`
- `Гейдельбергский катехизис Реформатский катехизис 1563 г....`
- `...новое означает исчезновения остаточного грехаВ реформатском богословии...`
- citation numbers directly glued to prose/source names, e.g. `...благодатью.8 Piper J.`, `...одежды»*.27 Hodge C.`, `...жизни».37 Owen J.`

The same live crawl also repeats the full glossary definition every time the term reappears, including in headings and bibliography/recommended-reading regions. This materially degrades the article's plain-text/search/accessibility projection: a reader/crawler receives definition text inline inside sentences instead of a distinguishable note/glossary relationship.

### Exact-source witness

The current MDX itself contains the same material as ordinary adjacent text, not merely as a crawler hallucination. Examples at the exact anchor include:

- `остаточного грехаВ реформатском богословии: ...`
- `Вестминстерское исповеданиеИсповедание реформатской веры...`
- source-number sequences such as `...Desiring God, 2014).8 Piper J.` and `...жизни».37 Owen J.`

Therefore this is not only a search-engine rendering quirk. The source projection itself lacks a reliable delimiter/semantic wrapper at these locations.

### Why this matters

This is user-facing editorial quality, readability and semantic-quality debt on a long-form flagship article. It affects at least:

1. plain-text reading / copy-paste;
2. search-engine extract quality;
3. likely screen-reader linearization unless a later runtime layer reconstructs semantics;
4. perceived polish/premium quality;
5. citation comprehension, because reference indices are visually/textually indistinguishable from surrounding prose in the source stream.

The mechanism differs from Wave 06's leaked `ogImage` path. Wave 06 identified a frontmatter/service-value leakage symptom; Wave 07 identifies **inline editorial-apparatus pollution already present in current article content**.

### Disposition

`CONFIRMED-CURRENT / LOCAL CONTENT+SEMANTICS` at Product `171daaf...`.

This is repair-ready as a bounded article/editorial-surface problem, but this evidence wave does **not** mutate Product and does not create a competing lane. Before implementation, recheck whether another owner/PR has claimed this article or its shared glossary/note mechanism.

Do not assume every repetition is a shared runtime bug until a representative second route is proved. Current evidence proves the route-local manifestation strongly; class-wide scope remains unproven.

## Finding B — current source confirms an independent grammar defect from Wave 06

The exact current MDX still contains:

`...фактическая сила греха действовать в человеке изнутри — соблазнять, оскверняет дела, ранить совесть, ослаблять общение с Богом.`

The verb chain mixes infinitives with finite `оскверняет`. This independently confirms the live grammar defect previously captured in Wave 06. No duplicate MASTER unit should be created; treat it as the same route-local editorial cleanup cluster if/when implementation is selected.

## Negative controls / things not promoted

- No claim of a live pixel/layout defect was made from crawler text alone.
- No claim that all site glossary/tooltips are broken was made; only this route has current source + live evidence in this wave.
- No new TTS latency bug was declared because no first-audible timing witness was available.
- No broken-link claim was promoted from search snippets without a direct HTTP/browser witness.

## Suggested next verification

1. Real browser DOM + accessibility-tree inspection on this route:
   - locate the repeated glossary definition text;
   - determine whether it is visible, visually hidden, or exposed only to accessibility/crawler text;
   - inspect accessible names/descriptions around glossary terms and citation indices.
2. Copy/paste representative paragraphs from the rendered article and compare with intended prose.
3. Run a second-route census for the same `term + definition glued inline` pattern before declaring a shared mechanism.
4. If route-local only, repair as one bounded article-content lane. If several routes share the mechanism, collapse to one shared root rather than many symptom rows.

## Evidence boundary

Product remained untouched. AuditRepo MASTER was intentionally not edited in this wave because its current file still contains stale pre-merge control-state fields (`Product main 757946d...`, open Dependabot #1538) while live Product truth is already `171daaf...` with no open PRs. Raw current evidence is therefore preserved here without coupling this wave to an unrelated MASTER control-state rewrite.
