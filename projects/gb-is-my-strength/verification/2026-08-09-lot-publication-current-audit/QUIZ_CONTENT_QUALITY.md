# Lot quiz content-quality audit — 2026-08-09

## Finding

`LOT-QUIZ-CONTENT-QUALITY-01` — **P2 pre-publication content-quality residual** — `CONFIRMED-CURRENT`.

This finding is independent of the shared native score-tier bug (`ARTICLE-QUIZ-SCORE-RANGE-01`). The Lot quiz renders through the native runtime, but the accepted eight-question content does not yet meet several explicit requirements of `docs/CONTENT-QUALITY-STANDARD.md` §4.

## Exact Product anchor

Audited source: `src/components/article-pilots/lot/lotQuiz.ts` on Product `main@1ef18c6584b00e536674be08a904036cbf9fbc1f` (same accepted Lot quiz data lineage used by active publication PR #1339).

## Contract 1 — `explanation.full` must be 2–4 sentences

The quality standard requires each `explanation.full` to be a genuine teaching explanation of **2–4 sentences**, not a one-line correctness label.

Current Lot result:

| Question | `full` sentence count | Disposition |
|---|---:|---|
| q1 | 1 | FAIL |
| q2 | 1 | FAIL |
| q3 | 1 | FAIL |
| q4 | 1 | FAIL |
| q5 | 2 | PASS |
| q6 | 2 | PASS |
| q7 | 1 | FAIL |
| q8 | 1 | FAIL |

Therefore **6 of 8** current `explanation.full` values fail the explicit 2–4 sentence teaching-depth contract.

Semicolons and colons inside a single sentence do not turn it into multiple explanatory sentences. This is a structural test, not a stylistic preference.

## Contract 2 — wrong options must be close and plausible

The standard explicitly rejects “очевидно-неверные затычки” and requires tempting, plausible wrong readings.

Several Lot questions currently use wrong options that are not credible competing readings after even a basic reading of the article, for example:

- q2: `Он становится царём города`;
- q2: `Он впервые встречает Аврама`;
- q6: `ЮНЕСКО признала Tall el-Hammam библейским Содомом`;
- q6: `Археологи полностью прекратили изучать памятник`;
- q7: `Что Быт 19 был написан в VI веке`;
- q8: `Она отменяет рассказ Быт 19`;
- q8: `Она называет Лота царём Моава`.

These distractors are useful as obvious anti-claims, but they do not satisfy the accepted quiz requirement that wrong answers should represent plausible confusions or tempting misreadings.

The clean repair is **not** to make the questions obscure. Replace the obviously impossible alternatives with nearby interpretive errors actually discussed in the article—for example confusing what the text explicitly states with a common inference, collapsing archaeological evidence levels, or overextending a canonical conclusion.

## Terminology / concept coverage — owner review, not promoted as a hard fail

The same standard asks for at least 1–2 terminology/concept questions and, for hermeneutics/exegesis, explanations of the relevant concepts.

The Lot quiz has categories including `hermeneutics`, `theology`, `canon` and `archaeology`, so it does test conceptual synthesis. However, no question clearly tests a named hermeneutical/exegetical term. Because the standard says “терминологии/понятиям” rather than terminology alone, this audit does **not** promote that observation as a separate confirmed defect. It should be considered while strengthening the weak distractors/explanations.

## What already passes

Do not rewrite working quiz properties unnecessarily:

- exactly 8 questions exist;
- each has 4 options;
- each current `answer` index is within range;
- source anchors point back into the article;
- question topics are grounded in accepted article sections;
- explanations are unique rather than duplicated boilerplate;
- the quiz spans text, theology, hermeneutics, ethics, archaeology and canon.

## Correct closure boundary

1. Expand q1/q2/q3/q4/q7/q8 `explanation.full` to 2–4 genuinely educational sentences grounded in the corresponding article section.
2. Replace obviously impossible distractors with plausible wrong interpretations without introducing claims the article never discusses.
3. Preserve exactly one correct answer per question and the canonical `lotQuiz.ts` data owner.
4. Do not duplicate quiz content into another route-local dataset.
5. Re-run the native quiz browser witness after the shared score-tier bug is repaired, because content-quality and runtime-result correctness are separate closure conditions.
6. Add a lightweight source contract that rejects one-sentence `full` explanations for new Lot questions and can flag known anti-pattern distractors only where deterministic checks are possible; do not try to automate subjective semantic quality with keyword hacks.

Final disposition: `CONFIRMED-CURRENT / ROUTE-CONTENT`, pre-publication quality work rather than a shared runtime repair.