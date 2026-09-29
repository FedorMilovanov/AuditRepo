# Current-head reverify — interactive article quizzes

## Project

- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Current Product `main`: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`
- Live `releaseSha` / `controlPlaneSha`: same exact SHA (`deployments/current.json`, read 2026-09-29)
- Date: 2026-09-29
- Verifier: Arena.ai Agent Mode
- Signal class: current Product defects (article quiz UI/data contract)
- Environment: exact shallow clone of Product `main`, Node 22.22.3, `npm ci`, production-like dist build; production-like output built successfully (103 Astro pages, then legacy projection). `node scripts/article-quiz-native-parity-test.mjs` PASS; all three Source Link Audit contract tests PASS.

## Compared against

- Current active ledger: `../verified/MASTER_BUG_MATRIX.md`
- Raw browser audit: `../incoming/arena-agent-visual-playwright/2026-09-23/REPORT.md` (same exact Product SHA; prior W4 runtime evidence and screenshots)
- Runtime quiz evidence: `../incoming/arena-agent-visual-playwright/2026-09-23/evidence/quiz-flow-light.json`, `../incoming/arena-agent-visual-playwright/2026-09-23/evidence/quiz-stuck-gill-1.png`, `../incoming/arena-agent-visual-playwright/2026-09-23/evidence/quiz-dark-chast-2.png`
- Current Product PRs checked: #2142, #2143, #2144, #2145. Their changed files do not touch the quiz runtime, quiz configs, or `css/floating-cluster.css`.
- Product issue search: no open quiz issue. Closed #1369 covered different, earlier score-tier/explanation parity defects; this report does not reopen it. Closed #1365 was a false-positive claim that the native renderer was absent and is not reopened.

## Status changes

| Work ID | Previous status | Proof state | Current status | Evidence | Claim boundary |
|---|---|---|---|---|---|
| `GBS-QUIZ-NEXT-HIDDEN-GILL-V16` | candidate in 2026-09-23 browser audit | FAIL | confirmed current | W2 + W3 current exact-main build; W4 prior browser run on the same unchanged Product SHA | 15 of 24 audited article-quiz routes are blocked after question 1; not a sitewide quiz outage |
| `GBS-QUIZ-LITERAL-MARKUP` | candidate in 2026-09-23 browser audit | FAIL | confirmed current | W2 + W3 current exact-main build; W4 prior runtime evidence on the same unchanged Product SHA | Literal `<em>` / `<span>` markup is shown in quiz text on 9+ routes; only the reported question/options/explanation fields are included |

## Finding 1 — Next/result button hidden on Gill-v16-backed article routes

**User impact:** after answering question 1 on 15 article routes, the quiz cannot advance; later questions and the result screen are unreachable. The other nine routes in the 24-route functional pass progressed normally, so this is route-family-specific, not a global quiz outage.

**Current source mechanism (W2):**

- `css/floating-cluster.css` defines `[data-gill-v16] .quiz-next { display: none }` and reveals it only through `[data-gill-v16] .quiz-next.is-visible { display: block }` (current lines 4063–4072).
- `src/runtime/article-quiz.js` creates the post-answer button with `className = 'quiz-next'` and never adds `is-visible` (current lines 150–159). The series wrapper supplies `data-gill-v16` for the Gill route family.
- The current production-like build includes this CSS and runtime. The same mismatch remains on the exact SHA currently published in production.

**Runtime witness (W4, same source/release SHA):** the 2026-09-23 Playwright pass answered question 1 and observed `.quiz-next` at `display:none`/0×0 on 15 routes; the saved flow records `STUCK q1` and `stuck: true`. The screenshot `../incoming/arena-agent-visual-playwright/2026-09-23/evidence/quiz-stuck-gill-1.png` records the visible effect. No application `pageerror` was recorded for these attempts.

**Boundary / limitations:** this turn rebuilt the exact current production-like dist and rechecked source. Chromium 153 became runnable later in the turn, but the fresh browser wave did not rerun the quiz interaction assertions; direct W4 runtime evidence remains from 2026-09-23 at the same Product/live SHA. Do not call the quiz runtime a fresh browser PASS.

**Owner / repair boundary:** the shared article quiz runtime and the legacy Gill-scoped CSS contract. Repair or retire the obsolete hidden-state rule at its semantic owner. Do not merely force visibility globally without checking other route families. Closure should include a resulting-main browser run that answers through the result and restart on all 15 affected routes, plus passing representative fixtures from the nine currently working routes, keyboard operation, and light/dark modes.

## Finding 2 — authored quiz markup appears literally in question text

**User impact:** on quiz-bearing pages, intended emphasis/glossary markup is printed as characters such as `<em>…</em>` or `<span class="gterm" …>` rather than rendering as formatted/semantic text. This degrades reading and exposes implementation noise to readers.

**Current source/artifact mechanism (W2/W3):**

- `src/runtime/article-quiz.js` assigns `question.question` and options to `textContent` (lines 101–114); explanations also use `textContent` (lines 130–141). This is safe against arbitrary HTML injection, but incompatible with quiz data that embeds markup.
- Current quiz data contains markup in question fields, e.g. `KrajnePageHead.astro` (`<em>`), `HermenevtikaPageHead.astro` and `KodDaVinchiPageHead.astro` (`<span class="gterm" ...>`), as well as Gill parts 2–4. The current exact-main production-like build succeeds and retains these data/runtime contracts.

**Runtime witness (W4, same source/release SHA):** the 2026-09-23 functional quiz pass recorded `literal-markup` on question 1 for multiple routes, and the saved flow includes literal tags in displayed question text. The audit's static dist census estimated at least nine affected routes; the counted field-level scope was a lower/upper bound, not a complete independent inventory in this reverify.

**Boundary / limitations:** the defect is confirmed for the routes and fields exercised in that pass, not every quiz field across the whole site. No unsanitized `innerHTML` change is recommended. Choose a single safe content contract: normalize quiz strings to plain text, or support a narrowly allowlisted/sanitized rich-text representation with regression fixtures for glossary terms and emphasis. Closure requires a built/browser assertion that visible text has no raw tags and that semantic emphasis/glossary behavior is preserved where intended.

## Other checks and dispositions

- Production-like build: PASS.
- `article-quiz-native-parity-test.mjs`: PASS; its present covered contract does not detect these Gill route-family CSS/data mismatches.
- Source Link Audit contract tests: PASS locally. This is not the scheduled external-link audit and does **not** classify the separate red scheduled gate recorded in the 2026-09-29 intake report.
- This work changed AuditRepo evidence only. No Product files, issue, PR, deployment, or merge were changed by this verification.
