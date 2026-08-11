# Current Verification — rating methodology and reading-progress truth

Date: 2026-08-12

## Scope and source authority

Read-only audit of `FedorMilovanov/TheLegendaryPoet` at exact `main@d59cceccb0c49af59b1be38d4c547a6240b3005a`.

Product mutation: **none**.

No competing open Product issue was found for the rating-method or reading-progress mechanisms in this wave.

## 1. CONFIRMED — sparse-sample ranking does not satisfy the reader-facing methodology promise

### Reader-facing contract

The `/ratings` hero states:

> `Таблица учитывает размер выборки, поэтому один случайный голос не захватывает первое место.`

The page labels the default metric `Индекс читателей` and later describes it as a Bayesian adjustment that increasingly gives the observed mean more weight as votes accumulate.

### Current formula

The implementation uses:

```ts
const PRIOR_WEIGHT = 5;
const globalMean = weighted mean of the same current leaderboard;
readerScore = (votes * rawScore + PRIOR_WEIGHT * globalMean) / (votes + PRIOR_WEIGHT);
```

The prior is therefore not an independent historical/reference prior. In a sparse leaderboard it moves with the very extreme observation it is supposed to shrink.

### Deterministic counterexample

Two rated poets are enough:

- A: 1 vote at 5.0;
- B: 20 votes at 4.5.

Current global mean:

`(1 × 5 + 20 × 4.5) / 21 = 4.5238095...`

Current reader indexes:

- A: `(1 × 5 + 5 × 4.5238095) / 6 = 4.6031746...`;
- B: `(20 × 4.5 + 5 × 4.5238095) / 25 = 4.5047619...`.

A single maximum vote therefore ranks **above twenty 4.5 votes** and becomes the page’s `Выбор читателей` because `topReader` has no minimum-vote gate.

This is not an edge case requiring zero competitors; it is a direct contradiction of the explicit sample-size promise.

The same self-derived global prior is used for dimension indexes. `dimensionLeaders` likewise has no minimum sample gate, whereas `consensus` / `controversial` explicitly require at least 3 votes. The product already demonstrates the pattern needed to gate sample-sensitive claims; it is simply not applied to top-reader/dimension-leader authority.

### Separation from `TLP-RATING-SOURCE-001`

`TLP-RATING-SOURCE-001` concerns **which source owns a displayed/ranking value** — reader `/5` versus editorial `/10`, including the hidden editorial tie-break.

This wave is different: even after removing editorial influence, the **reader-only statistical estimator itself** does not enforce the methodology it advertises.

### Root cause

**The shrinkage prior is derived from the same sparse current sample and ranking claims have no evidence threshold.** Sample size is included algebraically but does not provide the stated protection.

### Disposition

New active root: **`TLP-RATING-METHOD-001` / P2**.

Required terminal outcome must choose one transparent methodology and make copy/code/tests agree. Acceptable shapes include:

- an independently defined/stable prior plus an evidence threshold;
- Wilson/lower-bound or another explicitly justified confidence-aware ranking;
- minimum sample gating before a poet can hold `Место`, `Выбор читателей` or dimension-leader status;
- or narrower copy that does not claim protection the method does not provide.

The terminal method must be documented in reader-facing language and regression-tested against adversarial sparse-sample fixtures, including 1×5.0 versus 20×4.5.

Do not solve this by arbitrary cosmetics such as hiding vote counts.

## 2. CONFIRMED — ReadingProgress measures document completion, not article completion

`ReadingProgress` presents itself as a reading-progress bar and has two implementations:

- modern path: CSS `animation-timeline: scroll(root)`;
- fallback: `window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)`.

Both use the **root document scroll range**.

On `EssayPage`, the actual article is only one bounded `<article>` inside a larger route. After the body it can contain:

- series navigation;
- source library;
- community section;
- surrounding route space;
- persistent site Footer after the route content.

Consequently reaching the end of the prose/article does not produce 100%; 100% is reached only near the bottom of the whole document.

The compositor and fallback implementations are consistent with each other, but consistently measure the wrong semantic owner.

### Disposition

New active root: **`TLP-READING-PROGRESS-001` / P3**.

Required terminal outcome:

- define the semantic reading range from the article container (or explicit start/end sentinels), not root document height;
- preserve the compositor path if a scoped scroll/view timeline can express the intended semantics reliably, otherwise use a bounded/coalesced fallback;
- define behavior for entering before article start and continuing into sources/community after article end;
- browser regression must prove progress is ~100% at the selected article end even when a long source/community/footer tail follows.

## 3. Audit-harness impact

Existing **`TLP-AUDIT-004`** absorbs two missing proofs:

- deterministic ranking fixtures that test the actual reader-facing methodology promise rather than only rendering/sort mechanics;
- reading-progress geometry test with a deliberately long post-article tail, verifying semantic 0/100 boundaries in both supported execution paths where practical.

## Root-cause consolidation

| Finding | Disposition |
|---|---|
| One 5.0 vote can outrank 20 votes at 4.5 | new `TLP-RATING-METHOD-001` / P2 |
| Dimension leader can be selected from one vote | same methodology root |
| Editorial rating hidden tie-break/source ambiguity | existing `TLP-RATING-SOURCE-001`, not duplicated |
| Reading progress uses root document | new `TLP-READING-PROGRESS-001` / P3 |
| Missing statistical/geometry regressions | existing `TLP-AUDIT-004` |

## Checkpoint

- Product source: unchanged.
- Source anchor: `d59cceccb0c49af59b1be38d4c547a6240b3005a`.
- New roots: 1 P2 + 1 P3.
- Existing root strengthened: `TLP-AUDIT-004`.
