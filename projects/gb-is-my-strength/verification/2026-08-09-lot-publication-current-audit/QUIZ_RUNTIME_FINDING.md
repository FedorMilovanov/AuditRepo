# Lot quiz runtime verification — 2026-08-09

## Final disposition

`LOT-QUIZ-RENDER-01` — **FALSE-POSITIVE / CLOSED**.

The first audit pass incorrectly concluded that the Lot eight-question dataset had no loaded renderer. A deeper exact-head dependency trace proved that the current native standalone architecture already renders the quiz correctly through `ReaderActionsRuntime`.

This file intentionally preserves the disproof so the same false positive is not reopened later.

## Exact Product anchor disproving the finding

Publication head checked directly:

- Product PR `#1339@189dfddbeed537c849dd35b1a92578ead894079d`.

The required chain exists **on that exact head**, not only on later `main`:

```text
lotQuiz.ts
  → LotPageHead.astro
  → window.SITE_CONFIG.quiz.questions (8 records)
  → LotPageChrome.astro
  → HermenevtikaMobileBar.astro
  → ReaderActionsRuntime.astro
  → src/runtime/article-interactions.js
  → src/runtime/article-quiz.js
  → #quizPlaceholder
  → rendered native quiz
```

## Evidence

### 1. Canonical data authority exists

`src/components/article-pilots/lot/lotQuiz.ts` exports eight complete questions (`lot-q1` … `lot-q8`).

`#1339` `LotPageHead.astro` imports `LOT_QUIZ_QUESTIONS`, maps the records into runtime shape and serializes them as:

```js
window.SITE_CONFIG.quiz.questions
```

with:

```js
features.quiz.enabled = true
```

The mapping supplies the native renderer's expected fields, including:

- `question`;
- `options`;
- `correct` from the canonical `answer` index;
- `explanation`;
- `sourceRef`.

### 2. The placeholder is intentionally a mount point

`LotSectionQuiz.astro` contains the expected native mount:

```html
<div id="quizPlaceholder"></div>
```

The absence of pre-rendered questions in Astro is therefore **not** evidence of missing functionality.

### 3. Lot loads the native article runtime

`LotPageChrome.astro` mounts `HermenevtikaMobileBar.astro` unconditionally as an Astro component. The visual bars are responsive, but the component also mounts:

```astro
<ReaderActionsRuntime />
```

on the exact publication head.

`ReaderActionsRuntime.astro` imports the native `src/runtime/article-interactions.js` module together with the other reader owners.

### 4. Native article interactions explicitly own quiz rendering

`src/runtime/article-interactions.js` imports:

```js
import { installArticleQuiz } from './article-quiz.js';
```

and calls `installArticleQuiz()` during installation.

This is the current native successor to the quiz logic historically present in the legacy `js/site.js` monolith. The standalone footer correctly does **not** need to load `site.js` for the quiz to work.

### 5. `article-quiz.js` consumes exactly the Lot contract

`src/runtime/article-quiz.js` on `#1339@189dfdd...`:

- reads `window.SITE_CONFIG?.quiz`;
- requires a non-empty `config.questions` array;
- queries `#quizPlaceholder`;
- creates a launch button and `.quiz-wrapper`;
- renders each question and options;
- compares the clicked index against `question.correct`;
- shows correct/incorrect state and explanation;
- appends `question.sourceRef` when present;
- advances through all configured questions;
- renders result text and restart;
- emits `gb:quiz-rendered`, which also gives the glossary runtime a post-render hydration hook.

Therefore the initial assumption that `enhancements.js` was the only loaded quiz owner was incomplete: the native module graph is loaded through `ReaderActionsRuntime`, not through `KodDaVinchiPageFooter`'s explicit residual root-script list.

## What remains worth testing

Closing this false positive does **not** mean the final publication may skip browser proof. The correct positive witness is still useful:

- configured question count = `8`;
- launch control exists;
- first question renders after launch;
- correct and incorrect paths expose the expected state;
- explanation and source link are present;
- all eight questions can be traversed;
- result and restart work;
- keyboard/focus behavior remains valid.

Those checks verify a real runtime chain; they are no longer evidence for a missing implementation bug.

## Audit lesson / closure rule

The erroneous first pass inspected:

- the empty Astro mount point;
- the legacy `site.js` quiz renderer;
- the residual footer scripts.

It failed to follow the **native module import graph** owned by `ReaderActionsRuntime`. For standalone article runtime findings, future audits must trace both:

1. explicit root `<script src>` residuals; and
2. Astro/Vite module owners imported by shared reader components.

Final status: `FALSE-POSITIVE / CLOSED`; no Product repair should be opened for `LOT-QUIZ-RENDER-01`.