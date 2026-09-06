# Agent Audit Report

## Meta

- Project: `gb-is-my-strength / gospod-bog.ru`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: `arena-bugverifier`
- Date: `2026-07-17`
- Audited branch/ref: `main`
- Audited anchor (SHA / artifact / live snapshot): `485db8c25287fa9bd2f53a5356885f02e4b81f4b` (immutable source archive)
- Environment: Arena sandbox; repository archive fetched by exact SHA; Python 3 source inspection; Node/browser unavailable
- Build mode: source
- Browser / device if used: N/A
- Scope: homepage reading-resume markup, its inclusion owner, repository-wide runtime references, CSS hidden-state contract, and applicable owner contract
- Explicit exclusions: production-like build, browser behavior, live state, Product mutation, persistence-schema design, unrelated homepage surfaces
- Signal class: Product
- Proof state: FAIL
- Claim boundary: source proves that the homepage emits two resume surfaces permanently marked `hidden` but contains no Product runtime owner that reads progress, populates them, removes `hidden`, or handles dismissal. This report does not claim a live/deployed observation.
- Preservation boundary: preserve conditional rendering (show only for real data), existing element IDs/classes, homepage placement immediately after the hero, safe same-origin URL handling, and empty-state non-rendering.
- Semantic owner: `src/components/home/HomeSections/ResumeMobile.astro`, included by `src/components/home/HomeMain.astro`; expected behavior is constrained by `AGENTS-REFERENCE.md` §9.1b.
- Overlapping active owner/PR/branch check: Product API reported no open PRs at inspection time. Product branches were `agent/antisovetov-title-suffix-20260818`, `fix/biografii-recent-heading-20260818`, and `main`; neither named branch overlaps this homepage surface. AuditRepo had 10 open PRs (#316–#325); titles/heads and repository evidence search showed no resume-surface intake owner.

> The anchor records what this pass actually inspected. Do not update this report merely because the source repository later moved.

---

## 1. New observations

### Observation `HOME-RESUME-DEAD-01`

- Title: Homepage reading-resume surfaces are permanently hidden and have no runtime owner
- Kind: defect
- Suggested impact: medium
- Route(s) / owner(s): `/`; `HomeMain.astro` → `HomeSections/ResumeMobile.astro`; missing progress/resume runtime ownership
- Observed on anchor: `485db8c25287fa9bd2f53a5356885f02e4b81f4b`
- Expected: when real saved reading progress exists, the homepage should populate and reveal `#resumeReadingBlock` and/or `#resumeListBlock`; without data they should remain hidden. This is the explicit owner contract in `AGENTS-REFERENCE.md` §9.1b.
- Actual: both sections are rendered with the `hidden` attribute. Across the exact source archive, the IDs `resumeReadingBlock`, `resumeReadingLink`, `resumeReadingDismiss`, and `resumeListBlock` occur only in static markup (plus the contract references for the block/list IDs). No script reads saved progress for these surfaces, populates their placeholder title/meta/link/progress/list, removes `hidden`, or handles `#resumeReadingDismiss`. The CSS styles `:not([hidden])` states but does not create the missing state transition.
- Reproduction or inspection steps:
  1. Fetch the immutable archive for Product SHA `485db8c25287fa9bd2f53a5356885f02e4b81f4b`.
  2. Inspect `src/components/home/HomeMain.astro`: `<ResumeMobile />` is rendered immediately after `<HomeHero />`.
  3. Inspect `src/components/home/HomeSections/ResumeMobile.astro`: both top-level resume sections have `hidden`; content is placeholder markup and the continuation link starts as `href="#"`.
  4. Search the complete archive for `resumeReadingBlock`, `resumeReadingLink`, `resumeReadingDismiss`, and `resumeListBlock`.
  5. Observe that there is no runtime reference or event owner. The duplicate occurrences in root `index.html` are the same static publication markup, not behavior.
  6. Inspect `AGENTS-REFERENCE.md` §9.1b: it requires the resume block/list to appear after the hero when saved progress exists and only with real data.
- Evidence type: verified-source
- Evidence:
  - `src/components/home/HomeMain.astro:11,25` imports and renders `ResumeMobile` after `HomeHero`.
  - `src/components/home/HomeSections/ResumeMobile.astro:6-23` renders `#resumeReadingBlock` and `#resumeListBlock` with `hidden`.
  - `src/components/home/HomeSections/ResumeMobile.astro:15-16` leaves `#resumeReadingLink` at `href="#"` and emits `#resumeReadingDismiss`, with no handler owner.
  - Repository-wide exact-name census on the immutable archive found markup/contract occurrences only and no JavaScript consumers.
  - `AGENTS-REFERENCE.md` §9.1b states: if saved progress exists, `#resumeReadingBlock` / `#resumeListBlock` remains immediately after the hero and is shown only for real data.
  - `css/home.css` contains visual rules for `.resume-reading-block:not([hidden])` / `.resume-list-block:not([hidden])`, confirming an intended revealed state but not implementing it.
- Confidence: high
- Limitations of this method: Node was unavailable, so no production-like build or browser run was executed. Source inspection cannot prove whether an unrelated external/injected production script exists outside this repository. No concrete persistence schema is prescribed here.
- Possible mechanism: the responsive homepage refactor preserved the resume DOM and styling but omitted or retired the runtime/persistence owner. The contract and presentation shell remained while the state-producing code disappeared.
- Related existing findings: no matching active MASTER row or open AuditRepo intake/PR was found. `projects/gb-is-my-strength/incoming/arena-auditor-index/2026-07-14/README.md` only inventories `ResumeMobile.astro`; it does not report this mechanism.
- Applicability: the archive was fetched by exact SHA, and both the component inclusion and absence census apply to that same immutable anchor.
- What this evidence does **not** prove: it does not prove current live deployment identity, user prevalence, the desired storage key/schema, or that arbitrary historical progress data should be migrated. It does not justify showing placeholders without real data.

---

## 2. Confirmations and extensions

No existing finding was selected for confirmation; this is a new source observation after duplicate/overlap checks.

---

## 3. Challenges and negative findings

No existing finding was challenged in this pass.

---

## 4. Root-cause clusters

### Cluster `homepage-resume-owner-gap`

- Findings/symptoms included: `HOME-RESUME-DEAD-01`; permanently hidden resume card/list, inert dismiss control, placeholder continuation link, and unused revealed-state CSS.
- Shared mechanism: presentation and owner contract exist, but no state/persistence/runtime owner exists.
- Surface evidence: `ResumeMobile.astro` markup and `home.css` revealed-state styling.
- Mechanism evidence: repository-wide absence of consumers for all four stable resume IDs at the exact anchor.
- Lifecycle evidence: owner reference still explicitly requires conditional resume behavior, indicating that the shell is not merely undocumented dead markup.
- Why local patches may be insufficient: merely removing `hidden` would expose fake placeholder data and `href="#"`; a coherent data owner, validation boundary, population, reveal, dismissal, and test are required together.
- Suggested status: systemic-root
- Representative cases that should be tested: no saved data; one valid in-progress article; several valid articles; stale/malformed/off-origin stored URL; 0%/100% records; dismiss and reload; mobile and desktop homepage.
- Known exceptions: if the owner intentionally retired reading-progress persistence, the correct disposition is an owner decision to remove the dead shell and revise §9.1b rather than reveal it.

---

## 5. Value and cost assessment

- User/operator impact: users cannot continue unfinished reading from the homepage through the explicitly retained resume entry point.
- Frequency or blast radius: homepage-wide capability gap, conditional on users having or being expected to have saved progress.
- Recurrence risk: medium-high while markup, CSS, contract, and behavior have separate/absent ownership.
- Estimated repair size: medium; depends on whether a canonical progress store already exists on the selected current head.
- Regression risk: medium; persistence parsing, URL safety, completed-item filtering, hydration timing, and dismissal semantics need bounded tests.
- How many other findings this could absorb: four visible code symptoms under one missing-owner root.
- Recommendation: verify-first

---

## 6. Suggested verification wave

- Package of findings: `HOME-RESUME-DEAD-01` only.
- Questions the wave should answer: Is resume still owner-required? Is there a current canonical reading-progress producer/store? What record is considered resumable? Should old records migrate or fail closed? Does a production-like build contain any runtime owner absent from source search?
- Evidence-critical owners: homepage composition; reader progress producer; persistence schema; safe internal-route normalization; homepage browser test.
- Recommended witness angles: W2 source (already supplied), W3 production-like artifact, W4 browser/runtime with seeded valid and invalid storage, W5 lifecycle/owner decision if persistence was intentionally retired.
- What does **not** need global revalidation: unrelated search, favorites, maps, reader TTS, publication identity, or all homepage visual parity.
- Possible outputs: confirm current defect and select a bounded repair; narrow to missing producer; or owner-approved retirement of dead resume UI and contract.

---

## 7. Suggested repair boundaries

- Local lane: only if a canonical progress API already exists—bind `ResumeMobile` to it, validate records, populate via safe DOM APIs, reveal on real data, handle dismissal, and add bounded source/browser tests.
- System lane: if no progress producer/store exists, define one canonical reader-progress lifecycle before wiring the homepage consumer.
- Do not mix with: favorites redesign, homepage visual redesign, search, TTS, or unrelated mobile chrome work.
- Minimum regression witness: no-data remains hidden; valid seeded data reveals correct title/meta/progress/same-origin href; malformed/off-origin/completed data fails closed; dismiss works; no console/page errors.
- Is live evidence actually required? no for source repair admission; optional after publication
- Required exact-head checks: current Product `main`; open PR/branch overlap on homepage and reader-progress owners; production-like build command; targeted browser fixture; repository guards selected by the changed owners.
- Is merge admission machine-enforced? unknown

---

## 8. Owner decisions

- Decision needed: retain and implement the owner-documented reading-resume capability, or intentionally retire its dead shell and update the contract.
- Available options: (A) wire to an existing canonical progress store; (B) introduce a bounded canonical progress producer/store plus consumer; (C) remove the dead UI and revise §9.1b if the capability is no longer wanted.
- Trade-offs: A is smallest but only valid if a trustworthy producer exists; B restores the capability but expands lifecycle/privacy/test scope; C removes dead code but intentionally drops the promised user capability.
- Default recommendation: verify whether a canonical producer exists, then choose A; otherwise request explicit owner choice between B and C.

---

## 9. Summary for verifier

- Strongest new evidence: the exact-SHA archive contains the resume presentation shell, hidden states, and owner requirement, but no runtime consumer for any stable resume ID.
- Findings likely current when selected: `HOME-RESUME-DEAD-01` at anchor `485db8c25287fa9bd2f53a5356885f02e4b81f4b`.
- Systemic clusters: `homepage-resume-owner-gap`.
- Likely stale/invalid items: none asserted.
- Highest-value next work: one production-like/browser witness with seeded progress, plus an owner check for the canonical progress producer or intentional retirement.

---

## Files in this intake folder

- `REPORT.md` — this report.
