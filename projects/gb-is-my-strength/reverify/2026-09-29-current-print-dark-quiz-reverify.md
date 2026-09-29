# Current-head reverify — print content loss and dark-mode quiz contrast

## Project

- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Product `main`: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`
- Live `releaseSha` / `controlPlaneSha`: same exact SHA; re-read `https://gospod-bog.ru/deployments/current.json` on 2026-09-29
- Date: 2026-09-29
- Signal class: current Product defects (print output; dark-mode text contrast)
- Current Product PR collision check: open #2142–#2145 do not modify the print runtime, `src/runtime/article-interactions.css`, or the affected quiz surface. No open Product issue matched either defect query.
- Browser/environment boundary: Chromium 153 now runs against the local production-like build of this exact Product SHA. Fresh local PDFs were generated for the four prior failing routes and one control; a fresh dark-quiz contrast interaction was also checked on one previously affected route with a light-mode comparison. These are local current-SHA results, not live-host browser runs or a full 24-route quiz retest; the historical 23/24 quiz scope remains from the 2026-09-23 same-SHA pass.

## Compared against

- Prior multi-wave audit: `../incoming/arena-agent-visual-playwright/2026-09-23/REPORT.md`
- Print cross-route evidence: `../incoming/arena-agent-visual-playwright/2026-09-23/evidence/print-terminal-follower-87-routes.json`
- Print screenshot/PDF pair: `../incoming/arena-agent-visual-playwright/2026-09-23/evidence/sources-screen.png`, `../incoming/arena-agent-visual-playwright/2026-09-23/evidence/sources-print.png`
- Extracted-PDF text witness: the 2026-09-23 report's Wave 4 PRINT-01 table
- Dark-mode route/evidence list: `../incoming/arena-agent-visual-playwright/2026-09-23/evidence/quiz-dark-24-routes.txt`
- Dark-mode screenshots: `../incoming/arena-agent-visual-playwright/2026-09-23/evidence/quiz-dark-chast-2.png`, `../incoming/arena-agent-visual-playwright/2026-09-23/evidence/quiz-dark-20-antisovetov-pastoru.png`, `../incoming/arena-agent-visual-playwright/2026-09-23/evidence/quiz-dark-dzhon-gill-chast-2-uchenyi.png`
- Current source mechanisms: `js/reader-preferences-head.js` lines 328–405, 449–477; `src/runtime/article-interactions.css` lines 102–110; route/global theme CSS searched for `--surface` and `--card-bg` definitions.

## Status changes

| Work ID | Previous status | Proof state | Current status | Evidence | Claim boundary |
|---|---|---|---|---|---|
| `GBS-PRINT-TERMINAL-REGION-HIDES-CONTENT` | candidate in 2026-09-23 audit | FAIL | confirmed current | W2 + W3 + W4 plus fresh 2026-09-29 local PDFs; exact same source/live-release SHA | Direct PDF loss on four content routes plus one control; broader audit reported meaningful losses on 48/87 content routes, which were not rechecked |
| `GBS-QUIZ-DARK-SURFACE-LOW-CONTRAST` | candidate in 2026-09-23 audit | FAIL | confirmed current | W2 + W4 plus fresh 2026-09-29 local browser check on one previously affected route; exact same source/live-release SHA | Historical 23/24 tested-route claim retained; fresh browser result directly reproduces on `/articles/20-antisovetov-pastoru/`, with one light-theme comparison. Remaining routes and the formerly unrendered quiz were not retested |

## Finding 1 — print pagination hides meaningful content after the terminal group

**User impact:** printing or saving some article pages as PDF removes research material that is visible on screen: Scripture/source lists, primary-source apparatus, correction boundaries/contact information, related material, and other final sections. In a theology/research library, omission of cited evidence from the printable/PDF copy is material.

**Current mechanism (W2):**

1. `previousSemanticFlow()` may select a heading carrying `data-print-keep-next` as the predecessor of the terminal signature/footer.
2. `createClosingGroup()` moves that heading and the end marker into `.gb-print-closing-group` (current lines 328–351, 449–469).
3. `markTerminalRegion()` marks every later node as `data-print-terminal-follower` (lines 385–405).
4. The print stylesheet applies `display:none !important` to every such follower (line 179). Content originally between the selected heading and the end marker can therefore become a hidden follower after the group is assembled.

This matches the direct source-loss symptom: on the «Сердце и тело» route, the «Источники и сверка» heading survives in print while the following source paragraphs disappear.

**Artifact/runtime witnesses (W3/W4):** the prior 87-route print pass found meaningful content loss on 48 routes, including `section#istochniki` on the Heart series, Gill part 4's primary-source apparatus, and the teen-series correction boundary. A separate PDF-text extraction directly confirmed four screen-visible strings absent from the generated PDF:

- `/articles/serdce-i-telo/` — `Рим. 6:12` (sources);
- `/articles/tma-na-serdce/` — `Быт. 1:31; 3:16` (sources);
- `/articles/dzhon-gill-chast-4-ekzeget/` — `Macritchie` (primary-source apparatus);
- `/articles/podrostok-za-kadrom-dvoynaya-zhizn/` — `Контакты ниже` (correction boundary).

Control: `/articles/lot-i-sodom/` retained `Лота легко` in the PDF. This distinguishes selective terminal-region loss from a general PDF text-extraction failure.

**Fresh current-head PDF reverify (2026-09-29):** After Chromium 153 became runnable, Playwright generated local A4 PDFs from the exact-SHA production-like build for all four individually identified failing routes and the `/articles/lot-i-sodom/` control. pypdf 6.19.0 extracted the text: each of the four screen-visible target strings (`Рим. 6:12`, `Быт. 1:31; 3:16`, `Macritchie`, `Контакты ниже`) was absent from its PDF, while whitespace-normalized `Лота легко` remained in the control PDF. Machine-readable page counts, file sizes and screen/PDF target checks: `evidence/2026-09-29-current-print-pdf-reverify.json`. This is fresh local exact-SHA PDF evidence, not a live-host print run. The broader 48/87 route count remains the previous audit's estimate and was not repeated.

**Owner / closure boundary:** `js/reader-preferences-head.js` print pagination and its regression tests. Preserve source sections and other meaningful content that precedes the true terminal mark; do not resolve this by disabling all pagination or by removing citations from the screen document. After repair, rerun PDF text-presence tests on the four failing routes and the control, then a route-family matrix proving no visible, required content is hidden across the previously affected routes. Extend the print regression gate to assert content preservation, not only closing-group counts/order/idempotence.

## Finding 2 — quiz text becomes nearly unreadable in dark mode

**User impact:** with dark theme enabled and the quiz opened, quiz text on 23 tested routes sits in a light card against light text. The prior measured contrast was approximately **1.08:1**, far below the usual 4.5:1 text contrast requirement for this text size. The question and answer content becomes very difficult to read.

**Current mechanism (W2):**

- `src/runtime/article-interactions.css` gives `.quiz-wrapper` the background `var(--surface, var(--card-bg, rgb(255 253 248 / 92%)))`.
- Search of current Product `src/`, `css/`, and `js/` found no definitions for `--surface` or `--card-bg` and no dark-mode override for `.quiz-wrapper`; the light background fallback therefore remains active.
- Quiz text inherits the dark-theme light foreground (`#e6e1d7` in the prior computed-style witness), producing the observed low contrast.

**Runtime witness (W4):** the 2026-09-23 pass opened each of 24 quiz pages. The contrast failure reproduced on 23, including Gill parts 1–4/reference, the «Тёмная сторона кафедры» articles, «Код да Винчи», «Лот», Hermenevtika, Diotrophes, and all five Nagornaya parts. On `krajne-li-isporcheno-serdce`, the quiz was not shown, so it was not counted as a contrast pass or failure. Screenshots preserve representative computed visual output.

**Fresh current-head contrast reverify (2026-09-29):** On `/articles/20-antisovetov-pastoru/`, Playwright Chromium opened the launched quiz in stored dark theme and read the first question and answer option. The quiz surface computes to `rgba(255, 253, 248, 0.92)` over body `rgb(14, 17, 22)`; the question and option text compute to `rgb(230, 225, 215)`, yielding **1.08:1** contrast after compositing the translucent card over its dark body surface. The same route in light theme computes **17.11:1** for those question/option text colors against the effective panel surface. A fresh screenshot with no hovered or focused option shows the unreadable dark-mode text. Machine evidence: `evidence/2026-09-29-quiz-dark-surface-reverify.json`; screenshot: `evidence/2026-09-29-quiz-dark-surface-fresh.png`. This directly reproduces the problem on one of the previously affected routes; the 23/24 boundary remains historical, and neither the other routes nor the previously unrendered quiz were retested. This was a local exact-SHA browser run, not live-host navigation.

**Owner / closure boundary:** `src/runtime/article-interactions.css` and the shared quiz color-token contract. Use a valid theme-aware surface token or explicit dark-mode surface rule, not a global change that breaks light mode. Closure requires built browser measurements for every quiz-enabled route in dark mode (including resolving the currently unrendered route), contrast at or above the applicable text threshold, representative light-mode parity, and confirmation that the card's controls/focus states remain distinguishable.

## Other checks and dispositions

- Local static review confirms both current source mechanisms; current source and live release identity are the same as the browser/PDF audit anchor.
- Prior `engine-sweep` had a green print-stability gate but only counted `terminalFollowers`; it did not prove that screen-visible source text survives in the PDF. This is a test coverage gap within the print finding, not a third independent Product defect.
- The known local Article Quiz parity contract passing does not exercise dark-theme surface contrast.
- No Product code, issue, PR, deployment, or merge was changed. This is an AuditRepo evidence/matrix update only.
