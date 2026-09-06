# Agent Audit Report

## Meta

- Project: `gb-is-my-strength / gospod-bog.ru`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: `arena-lot-main-id-verifier`
- Date: `2026-07-17`
- Audited branch/ref: `main`
- Audited anchor (SHA / artifact / live snapshot): `485db8c25287fa9bd2f53a5356885f02e4b81f4b` (immutable source archive)
- Environment: Arena sandbox; exact-SHA source archive; Python 3 control-flow-aware source inspection; Node/Astro/browser unavailable
- Build mode: source
- Browser / device if used: N/A
- Scope: `/articles/lot-i-sodom/` component composition; `<main>` ownership; `FloatingCluster` mode selection; IDs `gbFloatingControls`, `gbFcTheme`, `gbFcSearch`
- Explicit exclusions: production-like artifact, browser accessibility tree, unrelated Lot external-link finding, Product mutation
- Signal class: harness
- Proof state: PASS for source composition uniqueness; FAIL for the branch-insensitive scanner claim
- Claim boundary: on the exact source anchor, the route has one literal `<main>` owner and selects one floating-cluster implementation. A production-like artifact was not built, so this report does not claim an artifact/browser census.
- Preservation boundary: preserve the single route-level article `<main>`, `FloatingCluster` mode exclusivity, stable control IDs, and independent mobile/desktop visibility behavior.
- Semantic owner: `src/pages/articles/lot-i-sodom/index.astro`; `src/components/article-pilots/lot/LotPageChrome.astro`; `src/components/ui/floating-cluster/FloatingCluster.astro`; `SingleArticleCluster.astro`
- Overlapping active owner/PR/branch check: Product API reported no open PRs; current non-main branches were limited to Antisovetov title and Biografii heading work. AuditRepo open PR #319 concerns Lot external-link `noreferrer`, not landmarks/IDs. No overlapping current intake was found by exact-ID/route search.

> The anchor records what this pass actually inspected. Do not update this report merely because the source repository later moved.

---

## 1. New observations

### Observation `HARNESS-ASTRO-BRANCH-EXPAND-01`

- Title: Branch-insensitive Astro import expansion creates false duplicate-main/duplicate-ID findings
- Kind: audit-harness
- Suggested impact: low
- Route(s) / owner(s): source-only route composition scanners; reproduced while inspecting `/articles/lot-i-sodom/`
- Observed on anchor: `485db8c25287fa9bd2f53a5356885f02e4b81f4b`
- Expected: a source composition scanner should count only components reachable through the selected Astro render branch, or report its result as an unproven candidate pending artifact inspection.
- Actual: a naive recursive scanner sees both imports in `FloatingCluster.astro` and expands both `SingleArticleCluster` and `SeriesLiteCluster`, even though the route passes the literal prop `mode="single"` and the ternary renders only `SingleArticleCluster`. This fabricates duplicate `gbFloatingControls`, `gbFcTheme`, and `gbFcSearch` IDs. Counting `<main>` strings without stripping frontmatter/comments similarly fabricates extra landmarks from documentation comments.
- Reproduction or inspection steps:
  1. Inspect `src/pages/articles/lot-i-sodom/index.astro`: there is one markup `<main ... id="content">` and one closing `</main>`.
  2. Inspect `LotPageChrome.astro`: it renders exactly one `<FloatingCluster mode="single" ... />` and contains no `<main>`.
  3. Inspect `FloatingCluster.astro`: `mode === 'single'` selects `SingleArticleCluster`; `SeriesLiteCluster` is in the mutually exclusive `series-lite` branch.
  4. Inspect `SingleArticleCluster.astro`: it owns `gbFloatingControls`, `gbFcTheme`, and `gbFcSearch` once each and contains no `<main>`.
  5. Observe that the apparent duplicates arise only if both mutually exclusive imports are recursively expanded.
- Evidence type: verified-source
- Evidence:
  - `src/pages/articles/lot-i-sodom/index.astro:16-58`: one actual `<main id="content">` pair.
  - `src/components/article-pilots/lot/LotPageChrome.astro:11`: literal `mode="single"` call.
  - `src/components/ui/floating-cluster/FloatingCluster.astro:27-37`: mutually exclusive ternary branches.
  - `src/components/ui/floating-cluster/SingleArticleCluster.astro`: one owner each for `gbFloatingControls`, `gbFcTheme`, `gbFcSearch`.
  - `SeriesLiteCluster.astro` is imported but not rendered for `mode="single"`.
- Confidence: high for source composition; medium for final artifact uniqueness until a production-like build witness is added
- Limitations of this method: Astro was not executed and no final HTML/browser DOM was inspected. The proof relies on literal props and direct conditional composition at this anchor.
- Possible mechanism: the audit walker treats every imported component mentioned in markup as unconditional and ignores Astro expression control flow; a second counting error includes frontmatter/comment strings such as documented `<main>` examples.
- Related existing findings: AuditRepo PR #319 is a separate Lot link-policy intake. No active Lot duplicate-main/duplicate-ID finding was found.
- Applicability: all inspected files come from the same immutable Product anchor, and `mode="single"` is literal at the named route.
- What this evidence does **not** prove: it does not prove all routes using `FloatingCluster` are unique, nor does it replace a final artifact/DOM census when a duplicate-ID claim is consequential.

---

## 2. Confirmations and extensions

No existing verified Product finding was confirmed. The candidate duplicate report was narrowed to an audit-harness false positive.

---

## 3. Challenges and negative findings

### Challenge `LOT-DUPLICATE-MAIN-AND-FC-IDS-CANDIDATE`

- Target report/finding: candidate claim that `/articles/lot-i-sodom/` renders duplicate `<main>` landmarks and duplicate IDs `gbFloatingControls`, `gbFcTheme`, `gbFcSearch`
- Reason: the source scanner expanded mutually exclusive Astro branches and counted non-markup comment/frontmatter strings.
- Contradictory evidence angle: control-flow-aware W2 source composition
- Evidence anchor: Product `485db8c25287fa9bd2f53a5356885f02e4b81f4b`
- Recommended result: invalid as a current Product defect; retain only as a harness false-positive case unless a production-like artifact independently shows duplication

A negative result is useful. Do not preserve a persuasive old claim when the method or build was wrong.

---

## 4. Root-cause clusters

### Cluster `branch-insensitive-astro-source-scanning`

- Findings/symptoms included: fabricated duplicate floating-cluster IDs and inflated `<main>` counts.
- Shared mechanism: source walker ignores conditional render semantics and markup boundaries.
- Surface evidence: false duplicate list for the Lot route.
- Mechanism evidence: literal `mode="single"` plus mutually exclusive ternary in `FloatingCluster.astro`.
- Lifecycle evidence: none; this is a bounded harness-method failure.
- Why local patches may be insufficient: suppressing the three IDs would hide one symptom; the scanner must distinguish imports from rendered branches and comments from markup.
- Suggested status: systemic-root for the scanner only; no Product root
- Representative cases that should be tested: literal `mode="single"`; literal `mode="series-lite"`; conditional component branches; comments containing `<main>`; actual unconditional duplicate components.
- Known exceptions: dynamic props may remain `UNPROVEN` and require a build/artifact witness.

---

## 5. Value and cost assessment

- User/operator impact: none from the challenged Product claim; audit operators can waste repair capacity or mutate correct DOM ownership.
- Frequency or blast radius: any Astro wrapper importing mutually exclusive implementations.
- Recurrence risk: high for naive recursive source scanners.
- Estimated repair size: small to medium for the audit script/method.
- Regression risk: low if uncertain dynamic cases fail as `UNPROVEN` rather than `PASS`.
- How many other findings this could absorb: unknown; potentially other source-only duplicate landmark/ID candidates.
- Recommendation: verify-first

---

## 6. Suggested verification wave

- Package of findings: the Lot duplicate `<main>` / floating-control-ID candidate only.
- Questions the wave should answer: does the production-like Lot HTML contain exactly one `<main>` and one of each named ID?
- Evidence-critical owners: production-like build output for `/articles/lot-i-sodom/`.
- Recommended witness angles: W3 artifact DOM census; optionally W4 browser DOM/accessibility landmark census.
- What does **not** need global revalidation: Lot content, external-link privacy, TTS, search functionality, or all routes.
- Possible outputs: terminal false-positive closure; or reopen as Product defect only if artifact evidence contradicts source composition.

---

## 7. Suggested repair boundaries

- Local lane: add a bounded artifact assertion for the Lot route if this class needs machine enforcement.
- System lane: make source scanners branch-aware or classify ambiguous component expansion as `UNPROVEN`.
- Do not mix with: Product DOM changes or PR #319 link-policy work.
- Minimum regression witness: fixture distinguishes mutually exclusive branches from real simultaneous duplicate rendering.
- Is live evidence actually required? no
- Required exact-head checks: current Product main, exact route artifact, current open PR/branch overlap.
- Is merge admission machine-enforced? unknown

---

## 8. Owner decisions

- Decision needed: none for Product repair; optional decision whether to harden the audit harness.
- Available options: artifact-only duplicate census; branch-aware source analysis; or keep source results as candidates requiring verification.
- Trade-offs: artifact census is authoritative but build-costly; branch analysis is faster but incomplete for dynamic props; candidate classification is safest but less automated.
- Default recommendation: artifact census for admission, source scan only for candidate generation.

---

## 9. Summary for verifier

- Strongest new evidence: literal `mode="single"` reaches only `SingleArticleCluster`, while the Lot route itself owns one `<main>` pair.
- Findings likely current when selected: harness false-positive mechanism only.
- Systemic clusters: `branch-insensitive-astro-source-scanning`.
- Likely stale/invalid items: Lot duplicate-main and duplicate `gbFloatingControls` / `gbFcTheme` / `gbFcSearch` Product claims.
- Highest-value next work: one exact production-like artifact DOM census if terminal multi-angle closure is desired.

---

## Files in this intake folder

- `REPORT.md` — this report.
