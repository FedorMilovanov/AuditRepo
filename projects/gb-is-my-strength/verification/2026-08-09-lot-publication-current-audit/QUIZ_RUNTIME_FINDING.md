# Lot quiz runtime verification — 2026-08-09

## Finding

`LOT-QUIZ-RENDER-01` — **P1/P2 functional publication blocker** — `CONFIRMED-CURRENT` on the audited Lot source/publication chain.

The Lot article advertises an eight-question quiz and the publication head correctly serializes those eight questions into `window.SITE_CONFIG.quiz`, but the currently loaded standalone runtime does not include the generic SITE_CONFIG quiz renderer that consumes `#quizPlaceholder`.

> **Correction to the first version of this evidence record:** the original report correctly identified the missing rendered quiz, but incorrectly said `#1339` added no quiz-data handoff. Fresh source inspection proved that `LotPageHead.astro` imports `LOT_QUIZ_QUESTIONS` and projects them into `window.SITE_CONFIG.quiz.questions`. The actual defect is the missing **renderer/runtime consumer**, not missing serialization. The disposition remains `CONFIRMED-CURRENT` and the causal chain below supersedes that one sentence from the original record.

## Exact Product evidence

Audited Product source anchors:

- accepted Lot authoring source on Product `main@8383f35e4596711e03d656846030f82cdbbf51c2`;
- publication owner `#1339@189dfddbeed537c849dd35b1a92578ead894079d` for route/chrome/head;
- current standalone residual runtime source on the same Product main.

### 1. Data exists and is serialized correctly

`src/components/article-pilots/lot/lotQuiz.ts` exports eight complete questions (`lot-q1` … `lot-q8`) with options, answer indexes, explanations and source anchors.

`#1339` `LotPageHead.astro` explicitly imports `LOT_QUIZ_QUESTIONS`, maps the records into runtime shape and writes them to:

```js
window.SITE_CONFIG.quiz.questions
```

It also declares:

```js
features.quiz.enabled = true
```

Therefore the quiz data is **not dead at the serialization boundary**. Any repair must preserve this existing source-of-truth handoff rather than duplicate the eight questions in markup or another JSON owner.

### 2. Body contains only the renderer mount point

`LotSectionQuiz.astro` renders:

```html
<h2 id="sec-quiz">Проверь себя</h2>
<p>…</p>
<div id="quizPlaceholder"></div>
```

There is no pre-rendered question markup in the section itself.

`LotArticleBody.astro` correctly mounts that section in the article. It does not itself need to import the question data if the runtime renderer consumes `window.SITE_CONFIG`.

### 3. The repository has a generic SITE_CONFIG quiz renderer — in `js/site.js`

The current repository `js/site.js` contains the actual generic renderer contract. It:

- checks `features.quiz.enabled`;
- looks up `#quizPlaceholder`;
- creates `#quizWrapper`, launch UI, question/result/review/bonus surfaces;
- reads `quiz.questions`, `quiz.scores`, `quiz.bonusQuestions`, `quiz.bonusScores` from `window.SITE_CONFIG`;
- renders options, correctness state, explanations and `sourceRef` links;
- reports `gb:quiz-rendered` and supports the existing result/review flows.

So the architecture already has the required renderer. A new Lot-specific quiz engine would be a duplicate owner and is **not** the correct repair.

### 4. The Lot route explicitly does not load `js/site.js`

`src/pages/articles/lot-i-sodom/index.astro` ends with `KodDaVinchiPageFooter.astro` and describes it as the current canonical standalone runtime loader.

The current `KodDaVinchiPageFooter.astro` is explicit about the migration boundary:

> “Reader actions and standalone chrome no longer depend on the legacy site.js monolith.”

It loads these residual runtimes:

- `bookmark-engine.js`;
- `site-utils.js`;
- `scroll-perf.js`;
- `glossary.js`;
- `sw-register.js`;
- lazy `search.js`;
- `highlights.js`;
- `enhancements.js`;
- `floating-cluster-controller.js`.

It does **not** load `site.js`.

### 5. The loaded residual runtimes do not replace the missing SITE_CONFIG renderer

The current `enhancements.js` has a separate, older inline-quiz enhancer that initializes **already-rendered** `.interactive-quiz` elements by reading `data-correct`, `.quiz-btn` and `.quiz-explanation`. It does not create the `#quizWrapper` from `#quizPlaceholder` and does not consume the Lot `window.SITE_CONFIG.quiz.questions` dataset.

The current `site-utils.js` provides shared utilities/config validation but no `#quizPlaceholder` renderer.

The floating-cluster controller is reader chrome/TTS/actions and has no Lot/SITE_CONFIG quiz materialization path.

Therefore the effective chain on the current Lot publication route is:

```text
lotQuiz.ts
  → LotPageHead.astro
  → window.SITE_CONFIG.quiz.questions (8 records)
  → [MISSING LOADED RENDERER]
  → #quizPlaceholder remains empty
```

while the existing renderer capable of consuming that config remains in `js/site.js`, which the canonical standalone footer intentionally no longer loads.

## Why this matters

This is stronger than a missing visual polish item:

1. the reader receives a “Проверь себя” section whose mount point is empty unless a renderer is restored through the standalone architecture;
2. `SITE_CONFIG` can look complete in source review while the public DOM still contains zero quiz questions;
3. a browser test that merely loops over **existing** quiz controls can pass vacuously when zero questions were materialized;
4. the publication PR explicitly names an “8-question quiz” as a final browser gate, so zero rendered questions violates its own completion boundary;
5. re-adding legacy `site.js` wholesale merely to recover quiz rendering would reverse the standalone migration boundary and would be an architectural workaround, not a clean repair.

## Correct repair boundary

Keep the canonical `lotQuiz.ts → SITE_CONFIG.quiz` data authority already implemented by `#1339`.

Required outcome:

- extract/transfer or otherwise expose the existing generic SITE_CONFIG quiz renderer through the current standalone runtime architecture **without restoring the whole legacy `site.js` monolith**;
- do not duplicate the eight questions in Astro markup, a second JSON blob, or route-specific JavaScript;
- render all **8** questions under `#sec-quiz` from the serialized canonical dataset;
- preserve answer/explanation/sourceRef semantics and existing shared quiz behavior;
- add a positive route-level assertion: expected configured questions = 8 and expected rendered quiz total = 8;
- exercise launch, one correct and one incorrect answer, explanation/source link, keyboard operation, result state and restart/review as applicable;
- make the runtime contract fail if `features.quiz.enabled=true` + nonempty `quiz.questions` + `#quizPlaceholder` results in zero rendered quiz UI;
- require this witness on the refreshed exact publication head after upstream catalog/Search/Scripture owners have landed.

## Disposition

`CONFIRMED-CURRENT` and should be treated as an explicit Lot publication/runtime residual. It is not represented by the catalog (#1348), Search-role (#1313), Scripture-writer (#1353), Avraam (#1334) or Strangler lanes.

The first AuditRepo version's “no quiz-data handoff” sentence is superseded by this corrected record. The stronger current conclusion is: **data authority exists and is serialized, but the standalone runtime dropped the renderer that consumes it.**
