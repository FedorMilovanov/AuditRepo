# Agent Audit Report — Atlas renders two `main` landmarks

## Meta

- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: Arena.ai Agent Mode
- Date: 2026-07-17
- Audited branch/ref: Product `main`
- Audited anchor: Product `a2ef67da54dd4ae00aedae154422280620acdf21`; live `https://gospod-bog.ru/map/`
- Environment: exact GitHub source archive + production-like dist + live HTML
- Build mode: source / production-like dist / live
- Browser/device: static accessibility-tree semantics; no visual-browser claim
- Scope: `/map/` landmark structure
- Explicit exclusions: graph interaction, relation correctness, visual design, Product mutation
- Signal class: Product + audit-harness
- Proof state: FAIL
- Claim boundary: the current document contains two sibling `<main>` elements; one is inside `<noscript>`, so script-enabled and script-disabled document models expose different owners but source conformance still contains duplicate `main` landmarks
- Preservation boundary: preserve interactive Atlas, complete no-JS fallback, one H1, all fallback links and compiled relations
- Semantic owner: `AtlasBody.astro` + `AtlasNoScriptFallback.astro`
- Overlap check: GitHub API returned no open Product PRs/issues and only `main`

---

## 1. New observations

### Observation `MAP-DUPLICATE-MAIN-LANDMARK`

- Title: Atlas source and published HTML contain two `main` landmarks
- Kind: defect
- Suggested impact: medium
- Routes/owners: `/map/`; map composition owner
- Observed: exact source anchor, generated dist, and live HTML
- Expected: one document-level `main` landmark; no-JS fallback should preserve a single-main semantic model
- Actual: `AtlasBody.astro` emits `<main class="atlas-main">`; `AtlasNoScriptFallback.astro` independently emits `<main class="atlas-noscript">` inside `<noscript>`
- Reproduction:
  1. inspect both components;
  2. count `<main>` in `dist/map/index.html`;
  3. fetch live `/map/` and repeat
- Evidence type: verified-source / verified-build / verified-live
- Evidence: source has one main in each owner; dist and live each have 2 opening and 2 closing main tags
- Confidence: high
- Limitations: assistive-technology treatment of `<noscript>` content varies with scripting state; this report does not claim every screen reader exposes both landmarks simultaneously
- Mechanism: progressive fallback was authored as a second complete landmark instead of sharing or conditionally owning the single document main
- Related findings: none found in current AuditRepo search
- Applicability: identical source/dist/live projection
- Does not prove: no visual overlap or runtime graph defect is claimed

### Observation `MAP-MAIN-GUARD-GAP`

- Title: Current map contracts verify H1/runtime behavior but do not reject multiple main landmarks
- Kind: audit-harness
- Suggested impact: low
- Routes/owners: map/Atlas contract checks
- Observed: current scripts search found H1 checks and route-specific runtime checks, but no exactly-one-main assertion for `/map/`
- Expected: semantic route contract asserts one main owner across JS/no-JS projections
- Actual: duplicate landmark ships on a successful exact-head deploy
- Evidence type: verified-source / verified-lifecycle
- Confidence: high
- Limitation: absence was established in current repository checks, not all external CI services
- Mechanism: contracts focus on graph function and fallback presence, not document landmark cardinality
- Does not prove: broader routes have the same mechanism

---

## 2. Confirmations and extensions

### Confirm current publication

- Target: `MAP-DUPLICATE-MAIN-LANDMARK`
- Added angle: live HTML
- Anchor: current live `/map/`
- Result: same symptom
- Change: rules out a local-only build artifact

### Confirm fallback value

- Target: no-JS fallback
- Added angle: source content inspection
- Anchor: `AtlasNoScriptFallback.astro`
- Result: preservation requirement
- Change: fallback must not be deleted merely to obtain one main; its material list is valuable and intentional

---

## 3. Challenges and negative findings

### Challenge “delete noscript fallback”

- Target: trivial repair option
- Reason: fallback contains the accessible list of Atlas materials and deliberate no-JS styles
- Evidence: component source and live rendered-text extraction
- Recommended result: invalid repair boundary

### Challenge severe runtime wording

- Target: possible P1 characterization
- Reason: graph/runtime behavior was not shown broken; semantic ambiguity is bounded
- Evidence: current live route renders content
- Recommended result: medium/low accessibility structure defect, not outage

---

## 4. Root-cause clusters

### Cluster `ATLAS-SINGLE-MAIN-OWNERSHIP`

- Manifestations: interactive main + no-JS main; no cardinality guard
- Shared mechanism: two rendering modes independently claim the document-level landmark
- Root owner: Atlas page composition
- Class guard: parse final HTML and assert exactly one `<main>` while separately confirming useful fallback remains inside `<noscript>`
- Do not split into two Product bugs: detector gap belongs in the same durable repair package

---

## 5. Value and cost assessment

| Work | Value | Cost | Result |
|---|---|---|---|
| Refactor to one main owner | Correct landmark navigation in both modes | Small/medium | Necessary |
| Preserve fallback as section/div under valid owner | Keeps no-JS access | Small | Necessary |
| Add exact-one-main route guard | Prevents recurrence | Small | Necessary |
| Remove fallback | Loses functionality | Small | Reject |

---

## 6. Suggested verification wave

1. Recheck current head and collisions.
2. Capture current JS/no-JS HTML semantics.
3. Refactor so final HTML contains exactly one `<main>`.
4. With JS enabled, verify graph, list view, filters and detail UI.
5. With JS disabled, verify fallback material list remains visible and navigable.
6. Assert one H1 and one main in final dist.
7. Add mutation fixture with a second main and require failure.
8. Run map browser contract, engine guard, publication audit and accessibility smoke.

Closure requires both modes; a source-only tag count without no-JS verification is insufficient.

---

## 7. Suggested repair boundaries

- Allowed surfaces: `AtlasBody.astro`, `AtlasNoScriptFallback.astro`, narrowly relevant map contract test.
- Preserve all fallback links, compiled counts, H1 ownership and styling.
- Prefer one outer `<main>` with mode-specific descendant sections, or make fallback a non-main region while retaining an accessible name.
- Do not hide duplicate semantics with CSS alone.
- Do not globally rewrite unrelated route landmarks.

Required checks: final-dist one-main assertion, JS browser map contract, no-JS fallback witness, existing Atlas relation/runtime checks.

---

## 8. Owner decisions

1. Choose the canonical single-main owner: outer Atlas composition is recommended.
2. Choose fallback descendant semantics (`section`/`div` with accessible heading) while retaining all material links.
3. Confirm exact-one-main as a release invariant for production HTML. Recommendation: yes.
4. No owner decision is needed about removing no-JS support; this report explicitly preserves it.
