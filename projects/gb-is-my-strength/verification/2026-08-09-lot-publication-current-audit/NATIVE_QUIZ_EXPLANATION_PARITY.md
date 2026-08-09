# Native article quiz explanation-parity audit — 2026-08-09

## Finding

`ARTICLE-QUIZ-EXPLANATION-PARITY-01` — **P2 shared runtime migration regression** — `CONFIRMED-CURRENT`, discovered through Lot.

The native article quiz preserves question data and renders answers, but it drops the accepted two-layer teaching explanation whenever both `explanation.short` and `explanation.full` exist.

## Exact Product anchors

- Lot publication: `#1339@189dfddbeed537c849dd35b1a92578ead894079d`.
- Native renderer on that exact head: `src/runtime/article-quiz.js` blob `37e5ea1ff09d46c491ea58d13be98af6daade616`.
- Accepted legacy generic renderer: current `js/site.js` lineage inspected on Product main during the audit.
- Lot question authority: `src/components/article-pilots/lot/lotQuiz.ts`.

## Native behavior

After an answer, current `article-quiz.js` computes:

```js
const explanationData = question.explanation;
explanation.textContent = typeof explanationData === 'string'
  ? explanationData
  : String(explanationData?.short || explanationData?.full || '');
```

For every structured explanation with a non-empty `short`, `full` is unreachable.

Lot deliberately supplies both layers for all eight questions, so the public native quiz displays only the short response and never displays the full teaching explanation.

## Accepted legacy behavior

The previous generic quiz renderer normalized `explanation.short` + `explanation.full` and rendered both layers when they differed:

```text
quiz-explanation-short
quiz-explanation-full
```

It suppressed the full layer only when its normalized text was identical to the short layer.

That behavior is also consistent with `CONTENT-QUALITY-STANDARD.md` §4, where `explanation.full` is the required 2–4 sentence theological/historical/methodological teaching layer. The field is not intended to be dead storage.

## Interaction with the Lot content-quality finding

`LOT-QUIZ-CONTENT-QUALITY-01` separately proves that six of eight current Lot `full` values are still too short and need deeper 2–4 sentence content.

The two findings are independent and both must close:

1. route content must contain a real `full` explanation;
2. shared native runtime must actually display it.

Fixing only the content leaves the new explanation invisible. Fixing only the runtime exposes the currently underdeveloped one-sentence `full` values.

## Correct root repair

This is a shared native article-interaction issue, not a reason for Lot-specific rendering code.

Required outcome:

- preserve the short immediate correctness message;
- render the distinct full explanation as the deeper teaching layer, matching accepted behavior;
- avoid duplicate text when short/full normalize to the same value;
- preserve `sourceRef` after the explanation;
- keep text insertion safe (do not introduce unsanitized route HTML merely to recover styling);
- add a native unit/browser contract with deliberately different short/full strings and assert both are visible after answer;
- verify at least Lot plus one pre-existing native article using the same runtime.

## Ownership

No competing Product shared-runtime mutation is opened by this AuditRepo lane. The exact active Product PR census must be repeated before any repair of `src/runtime/article-quiz.js`.

Final disposition: `CONFIRMED-CURRENT / SYSTEMIC-ROOT`.