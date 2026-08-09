# Lot quiz runtime verification — 2026-08-09

## Finding

`LOT-QUIZ-RENDER-01` — **P1/P2 functional publication blocker** — `CONFIRMED-CURRENT` on the audited Lot source/publication chain.

The Lot article advertises an eight-question quiz and the source tree contains a complete `LOT_QUIZ_QUESTIONS` data set, but the publication composition does not currently connect those questions to any renderer.

## Exact Product evidence

Audited Product source anchor:

- current source `main@8383f35e4596711e03d656846030f82cdbbf51c2` for the accepted Lot authoring components;
- publication owner remains `#1339@189dfddbeed537c849dd35b1a92578ead894079d` for the route/chrome/head layer.

### Data exists

`src/components/article-pilots/lot/lotQuiz.ts` exports eight complete questions (`lot-q1` … `lot-q8`) with options, answer indexes, explanations and source anchors.

### Placeholder exists

`LotSectionQuiz.astro` renders only:

```html
<h2 id="sec-quiz">Проверь себя</h2>
<p>…</p>
<div id="quizPlaceholder"></div>
```

There is no question markup in the component itself.

### Composition does not import quiz data

`LotArticleBody.astro` imports `LotSectionQuiz` but does **not** import `lotQuiz.ts`, `LOT_QUIZ_QUESTIONS`, or a Lot quiz renderer. It mounts the section placeholder and then proceeds to Sources.

The original merged authoring PR `#1300` changed exactly eleven Lot files: the article body, two semantic diagrams, six content sections, `LotSectionQuiz.astro`, and `lotQuiz.ts`. That file set contains no separate quiz renderer component.

The active publication PR `#1339` changes route/head/chrome/TOC/registry/discovery projections only; it adds no quiz renderer or quiz-data handoff.

### Loaded standalone runtime does not materialize the placeholder

The route uses `KodDaVinchiPageFooter.astro` as the current canonical standalone residual runtime loader. That loader brings in the existing shared runtime scripts.

The current `enhancements.js` quiz code initializes **already rendered** `.interactive-quiz` nodes: it reads their `data-correct`, `.quiz-btn` and `.quiz-explanation` markup and wires answer interactions. It does not read `#quizPlaceholder` and does not import TypeScript question data.

`lotQuiz.ts` is therefore not reachable through this runtime path merely because the file exists in the repository.

## Why this matters

This is stronger than a missing visual polish item:

1. the reader sees a “Проверь себя” section but receives an empty container rather than eight questions;
2. a browser test that merely counts or clicks **existing** quiz controls can pass vacuously when zero questions were rendered;
3. the publication PR explicitly names an “8-question quiz” as a final browser gate, so zero rendered questions violate the declared completion boundary;
4. the data file can look “finished” in code review while being dead from the public route.

## Correct repair boundary

Keep the repair inside the existing Lot/publication + canonical quiz architecture. Do not create a second generic quiz system.

Required outcome:

- explicitly import/serialize/project `LOT_QUIZ_QUESTIONS` through the repository's accepted quiz renderer pattern;
- render all **8** questions under `#sec-quiz`;
- preserve each question's answer/explanation/sourceRef semantics;
- use the existing `.interactive-quiz` / `.quiz-btn` runtime contract or its current canonical successor;
- do not solve this with a global parser that searches for `#quizPlaceholder` by route name;
- add a positive route-level assertion: expected question count = `8`, not “iterate any questions that happen to exist”;
- exercise one correct and one incorrect answer path, explanation visibility, source link/anchor, keyboard operation and post-answer state;
- require this witness on the refreshed exact publication head after upstream catalog/Search/Scripture owners have landed.

## Disposition

`CONFIRMED-CURRENT` and should be treated as an explicit Lot publication residual. It is not represented by the catalog (#1348), Search-role (#1313), Scripture-writer (#1353), Avraam (#1334) or Strangler lanes.

Do not mark Lot interaction completion from the current generic runtime greens until a route-positive quiz witness proves eight rendered questions.
