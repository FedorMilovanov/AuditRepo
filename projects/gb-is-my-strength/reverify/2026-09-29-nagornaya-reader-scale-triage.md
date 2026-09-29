# Current-main reverify — Nagornaya reader font scale (2026-09-29)

## Disposition

**Admit a narrow current reader-preference defect:** on the five Nagornaya chapters, the maximum stored font scale changes the `main` base from 16px to 20px, but 36 visible long prose paragraphs using the main text color do not change size. Fourteen of the unchanged paragraphs carry a `text-[16px]` utility yet compute to 14px at both settings because the current paragraph override inherits from a smaller-sized ancestor. The preference therefore enlarges most prose while leaving a substantial subset at small-print size.

ID: `GBS-NAGORNAYA-READER-FONT-SCALE-INCOMPLETE`. This admission does **not** assert that every fixed-size note, caption, definition, or bibliography item must scale; the 47/151 broad count is retained as measurement context, not as the admitted claim.

## Identity, overlap and scope

- Product `main` and `origin/main`: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`.
- Live `releaseSha` and `controlPlaneSha` read from `https://gospod-bog.ru/deployments/current.json`: the same SHA.
- Open PRs #2142–#2145 concern content, dependency updates and genealogy; none changes the reader-scale owners. Open issue searches for Nagornaya/font-scale/text-size returned no matches.
- Product source was not changed. This is an exact-SHA local production-like build/browser check, not a direct live-site browser run.

## Fresh browser method and measurements

Playwright with Chromium `153.0.8010.0` loaded the freshly generated `dist` through a local static HTTP server at a 390×844 mobile viewport. Before each chapter loaded, the test set `localStorage['gb:font-scale']` to `1` or `1.25`. It measured visible `main p` elements with more than 300 text characters, matching by DOM order, on all five chapters.

| Chapter | Long paragraphs | Changed | Unchanged | `main` at 1 → 1.25 |
|---|---:|---:|---:|---|
| 1 | 17 | 3 | 14 | 16px → 20px |
| 2 | 15 | 9 | 6 | 16px → 20px |
| 3 | 15 | 11 | 4 | 16px → 20px |
| 4 | 56 | 52 | 4 | 16px → 20px |
| 5 | 48 | 29 | 19 | 16px → 20px |
| **Total** | **151** | **104** | **47** | — |

The 47 unchanged paragraphs include 36 `text-stone-700` long content paragraphs; captions/other fixed-size categories are not all asserted as defects. Fourteen visible `text-stone-700 text-[16px] ...` paragraphs remain 14px at both settings. Example: chapter 1's paragraph beginning “Один из ключевых литературных приёмов здесь — inclusio...” is 14px with `gb:font-scale=1` and still 14px at 1.25 while `main` moves 16px → 20px. Ordinary paragraphs that inherit the article base do reach 20px. A further long `.text-[16px]` paragraph remains 16px at both states.

The current implementation explains the mismatch: `floating-cluster-controller.js:1128–1140` applies the scale to `main` using `article.style.fontSize = (fontScale * 100) + '%'`. `css/site.css` includes the Nagornaya `body.nagornaya-page main p.text-\\[16px\\] { font-size: inherit !important; }` adaptation. In the measured chapter 1 example, the paragraph inherits from its immediate `<div class="bg-white ... mb-4 text-sm text-stone-700">`, which stays 14px at both settings, while the outer content wrapper and `main` move from 16px to 20px. This directly explains why the override does not scale that content. Other long prose with `text-xs` / `text-sm` is also in the broad unchanged count, but this row is anchored to the directly checked main-color prose subset rather than assuming every smaller type role should be enlarged.

## Historical comparison and evidence boundary

The 2026-09-23 Wave 17 report also counted 47/151 unchanged, but described a different 16px → 22.5px result. That older scale ratio is **not** carried forward: the fresh exact-SHA measurement is 16px → 20px for `main`, exactly 1.25×. Fresh grouped measurements and reproducible page-by-page output are in `evidence/2026-09-29-fresh-playwright-reverify.json`; class counts and current prose examples are retained in `evidence/2026-09-29-reader-scale-content-classification.json`.

## Closure boundary

Apply the shared reader-scale preference consistently to Nagornaya prose (for example, use the shared reader root contract or scale the prose-size tokens, including text inside smaller-type wrappers). Resulting-main proof should compare matched body paragraphs at scale 1, an intermediate setting and 1.25 on all five chapters; confirm the intended typographic hierarchy remains readable, and regression-check line wrapping, horizontal overflow, light/dark appearance and the intentionally subordinate caption/reference roles.
