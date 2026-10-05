# Comment on Finding

## Identity

- Project: gb-is-my-strength
- Comment by: arena-dx-ux-audit
- Date: 2026-10-06
- Target report: matrix row `GBS-QUIZ-NEXT-HIDDEN-GILL-V16` (MASTER_BUG_MATRIX.md, open table)
- Target finding ID: GBS-QUIZ-NEXT-HIDDEN-GILL-V16
- Evidence anchor: `68750830f4725213d80b833015520e5894699838` (fresh local production-like build; fix landed at `2ee584d`, 2026-10-04)

## Comment type

stale / evidence-addition (candidate for closed-by-fix)

## Evidence angle

source + artifact + browser

## Evidence

```text
source: `git show 2ee584d -- css/floating-cluster.css` deletes the row's exact mechanism:
    -  [data-gill-v16] .quiz-next { … }
    -  [data-gill-v16] .quiz-next.is-visible { display: block; }
  commit message: "Quiz lane — GBS-QUIZ-NEXT-HIDDEN-GILL-V16 (supersedes #2165): the Gill hide/reveal rules now target the
  owner button #glsQuizNext".
artifact: `grep -n "quiz-next" css/floating-cluster.css` -> 0 hits; the button is styled only by
  `src/runtime/article-interactions.css` (.quiz-launch, .quiz-next { … min-height:46px … }, 48px at mobile widths), emitted as
  `dist/_astro/ReaderActionsRuntime.BcTUkum_.css`. The runtime sets the class at `src/runtime/article-quiz.js:74,152`
  (`className = 'quiz-next'`). The `.quiz-next-btn{…display:none…}` left in `css/site.css` is a different, unused class.

browser (390x844 and 1440x900, after answering question 1):
  /articles/dzhon-gill-chast-2-uchenyi/ 390  .quiz-next display=block visibility=visible opacity=1 rect 277x48
  /articles/dzhon-gill-chast-2-uchenyi/ 1440 .quiz-next display=block visibility=visible opacity=1 rect 699x46
  /articles/20-antisovetov-pastoru/     390  .quiz-next display=block visibility=visible opacity=1 rect 277x48
  operability: scrollIntoView + trusted click -> «Вопрос 2 из 4» (Gill) and «Вопрос 2 из 10» (Антисоветы)
  mobile-chrome note: on those pages the button sits below the fold in the article flow (rect y≈1566/1756), which is geometry,
  not hiddenness.
```

## Summary

At current main the next-question control exists, is displayed and is operable on both a Gill v16 route and an
antisovetov route, at mobile and desktop widths. The CSS rule the row describes no longer exists anywhere in the repository,
and the commit that removed it names this exact finding. The observed "below the fold" position is ordinary article-flow
geometry.

## Recommended classification or action

- Result: `closed-by-fix` candidate at `68750830` (fix commit `2ee584d`, 2026-10-04, PR #2167)
- Reason: the mechanism `[data-gill-v16] .quiz-next{display:none}` is absent in source and artifact, and a browser witness shows
  a visible, clickable control that advances the quiz
- Notes for verifier: the sweep was on two routes (one Gill, one antisovetov); if the row's "15 of 23 routes" boundary must be
  retired route-by-route, the remaining check is a grep of the built CSS (currently 0 hits of `quiz-next` display suppression
  anywhere) plus the same two-step browser flow per route family. Also worth deciding separately: the dead `.quiz-next-btn`
  rules still shipped in `css/site.css` (no demonstrated reader impact).
