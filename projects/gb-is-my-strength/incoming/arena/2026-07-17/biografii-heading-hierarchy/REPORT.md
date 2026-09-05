# Agent Audit Report — Biografii recent shelf skips H2

## Meta

- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: Arena.ai Agent Mode
- Date: 2026-07-17
- Audited branch/ref: Product `main`
- Audited anchor: Product `a2ef67da54dd4ae00aedae154422280620acdf21`; live `https://gospod-bog.ru/biografii/`
- Environment: exact source archive + production-like dist + live HTML
- Build mode: source / dist / live
- Browser/device: semantic heading inspection; no screenshot claim
- Scope: recent-material shelf immediately following the page H1
- Explicit exclusions: biography editorial content, later era sections, visual typography, Product mutation
- Signal class: Product + audit-harness
- Proof state: FAIL
- Claim boundary: the first six card titles after the H1 are H3 elements under a non-heading label; heading navigation jumps directly H1→H3
- Preservation boundary: preserve card links, ordering, visual style, text, images and later era H2/H3 hierarchy
- Semantic owner: `BiografiiRecentSection.astro`
- Overlap check: no open Product PR/issues; only `main` returned

---

## 1. New observations

### Observation `BIO-RECENT-H1-H3-SKIP`

- Title: Recent biographies shelf has no H2 owner for six H3 card headings
- Kind: defect
- Suggested impact: low
- Route/owner: `/biografii/`; recent shelf
- Observed: exact source, dist and live
- Expected: the shelf label is a real H2 (visually styled as desired), followed by H3 card titles; heading navigation communicates the section boundary
- Actual: “Последние добавленные материалы” is a styled `<div>`; six card titles are `<h3>`, so sequence starts H1, H3×6, then later H2 era sections
- Reproduction: enumerate headings in final dist/live and inspect component lines 9–27 onward
- Evidence type: verified-source / verified-build / verified-live
- Evidence: live heading sequence begins `h1 Биографии служителей`, then six `h3` Gill cards, then `h2 Ранняя Церковь`
- Confidence: high
- Limitations: skipped levels are not always a strict WCAG failure in every document model; this is a concrete navigation/outline defect in this section because a visible named section already exists but is not encoded as its owner
- Mechanism: visual eyebrow `<div>` replaced the structural shelf heading while cards retained H3 semantics
- Related findings: no current matching report found
- Applicability: same markup in source/dist/live
- Does not prove: no claim that later era H2/H3 blocks are wrong

### Observation `BIO-HEADING-GUARD-GAP`

- Title: Current checks enforce H1 cardinality but do not catch initial H1→H3 shelf jump
- Kind: audit-harness
- Suggested impact: low
- Observed: repository scripts contain H1 checks; no current Biografii hierarchy assertion found
- Expected: route contract protects the named shelf H2 and H3 children
- Actual: exact-head deploy succeeds with the current sequence
- Evidence type: verified-source / verified-lifecycle
- Confidence: high
- Limitation: not a claim about all heading jumps repository-wide; card/overlay headings can require context-specific modeling
- Mechanism: generic single-H1 checks do not model section ownership
- Related finding: same durable repair package
- Does not prove: a naive global “never skip” regex would be safe

---

## 2. Confirmations and extensions

### Confirm source-to-live projection

- Target: `BIO-RECENT-H1-H3-SKIP`
- Added angle: live output
- Anchor: current live `/biografii/`
- Result: same symptom
- Change: confirms publication, not stale source

### Confirm narrowed boundary

- Target: whole-page heading hierarchy
- Added angle: sequence inspection
- Anchor: final dist
- Result: narrower scope
- Change: later era sections correctly use H2 section titles and H3 cards/stubs; repair should target only recent shelf ownership

---

## 3. Challenges and negative findings

### Challenge “change all card H3 to H2”

- Target: possible fix
- Reason: it would flatten six sibling cards into top-level sections and diverge from later era H2→H3 structure
- Evidence: full route heading sequence
- Recommended result: invalid repair; promote the shelf label to H2 instead

### Challenge high severity

- Target: possible broad accessibility blocker wording
- Reason: links and visible content remain usable; issue is structural navigation clarity
- Evidence: live rendered content
- Recommended result: low severity, current local defect

---

## 4. Root-cause clusters

### Cluster `BIO-RECENT-SECTION-SEMANTIC-OWNER`

- Manifestations: non-heading visible shelf label; six orphaned H3 children; absent route guard
- Shared mechanism: styling element owns the visible section name but not heading semantics
- Root repair: one H2 owner plus existing H3 cards
- Class-level guard: route-specific sequence assertion around recent shelf and era sections
- Do not merge with unrelated Kod Da Vinci H2→H4 callout headings; different semantic owner and repair boundary

---

## 5. Value and cost assessment

| Work | Value | Cost | Assessment |
|---|---|---|---|
| Convert visible shelf label to H2 | Restores outline/navigation | Very small | Worth fixing |
| Preserve CSS via class/reset | No visual redesign | Small | Required |
| Route hierarchy test | Prevents recurrence | Small | Worth adding |
| Global heading-level rewrite | High collision risk | High | Reject |

---

## 6. Suggested verification wave

1. Recheck head/collisions.
2. Change recent shelf label to an H2 with stable ID.
3. Optionally connect section via `aria-labelledby` instead of `aria-label`.
4. Preserve card H3 elements and visual computed style.
5. Build dist and assert sequence starts H1→H2→H3.
6. Check later era sections remain H2→H3.
7. Run Biografii visual parity, owner UI guard, static publication and accessibility heading navigation.
8. Add focused regression assertion.

Closure witness: source + final dist sequence and visual parity.

---

## 7. Suggested repair boundaries

- Primary file: `BiografiiRecentSection.astro`.
- Allowed supporting surface: focused Biografii contract test/CSS reset.
- Preserve exact label text, six cards, ordering, links, metadata and appearance.
- Recommended shape: `<section aria-labelledby="...">` with `<h2 id="..." class="...">Последние добавленные материалы</h2>`.
- Avoid heading changes in era sections or unrelated pages.

Required checks: route heading sequence, Biografii visual parity, owner UI guard, production-like dist.

---

## 8. Owner decisions

1. Confirm visible “Последние добавленные материалы” as the semantic H2 owner. Recommendation: yes.
2. Confirm cards remain H3. Recommendation: yes, matching era shelves.
3. Decide whether the section should use `aria-labelledby` rather than duplicate `aria-label`. Recommendation: use the heading ID as one source of truth.
4. No editorial or design decision is required; this can be a semantic-only repair.
