# Agent Audit Report — Learning-sheet search has no accessible name

## Meta

- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: Arena.ai Agent Mode
- Date: 2026-07-17
- Audited branch/ref: Product `main`
- Audited anchor: Product `a2ef67da54dd4ae00aedae154422280620acdf21`; current live route samples
- Environment: exact source + production-like dist + live HTML
- Build mode: source / dist / live
- Browser/device: accessible-name markup inspection; no AT announcement recording
- Scope: shared `GillLearningSheet` search input across current article families
- Explicit exclusions: global search, search algorithm relevance, quiz, Product mutation
- Signal class: Product + audit-harness
- Proof state: FAIL
- Claim boundary: the shared `type="search"` input is wrapped by a label containing only an aria-hidden SVG and has no text, `aria-label`, or `aria-labelledby`; placeholder is not a persistent accessible label
- Preservation boundary: preserve input ID, placeholder, search behavior, panel/tab wiring and all route composition
- Semantic owner: `GillLearningSheet.astro`
- Overlap check: no open Product PR/issues; only `main` returned

---

## 1. New observations

### Observation `LEARNING-SEARCH-UNNAMED-INPUT`

- Title: Shared learning-panel search field lacks an accessible name
- Kind: defect
- Suggested impact: medium
- Routes/owners: 48 current dist routes spanning Heart articles, Gill series, Enoch hard texts and Russian Baptist pages; shared learning sheet
- Observed: exact source, production-like dist, and live samples
- Expected: search input has a persistent programmatic label such as visible/sr-only text or `aria-label="Найти в этой статье"`
- Actual: markup is `<label class="gill-searchbox"><svg ... aria-hidden="true">…</svg><input id="learningSearchInput" type="search" placeholder="Найти в этой статье" ...></label>`; label contributes no text and input has no ARIA name
- Reproduction:
  1. inspect `GillLearningSheet.astro` around the search panel;
  2. enumerate final dist routes containing `learningSearchInput`;
  3. inspect live samples from three route families
- Evidence type: verified-source / verified-build / verified-live
- Evidence:
  - one shared source instance;
  - 48 final-dist route instances;
  - live samples: `/articles/serdce-i-yazyk/`, `/articles/dzhon-gill-chast-1-chelovek/`, `/hard-texts/mozhno-li-doveryat-1-enohu-kanonicheskiy-audit/` contain identical unnamed markup;
  - placeholder exists but disappears during typing and is not a substitute for a label
- Confidence: high
- Limitations: no NVDA/VoiceOver speech capture; exact announcement can vary by browser/AT and may expose placeholder heuristically. The source lacks a reliable explicit name regardless.
- Mechanism: visual icon + placeholder were treated as labeling while SVG is explicitly hidden from accessibility tree
- Related findings: none found in current AuditRepo search
- Applicability: shared component projects unchanged into multiple current route families
- Does not prove: no claim that search logic itself fails

### Observation `FORM-NAME-GUARD-GAP`

- Title: Current route checks do not fail unnamed form controls
- Kind: audit-harness
- Suggested impact: medium
- Observed: exact-head publication succeeds; repository searches found button/link name guards but no current form-control accessible-name assertion covering this component
- Expected: shared component contract or final-dist accessibility guard rejects an input without a programmatic name
- Actual: 48 instances ship
- Evidence type: verified-source / verified-build / verified-lifecycle
- Confidence: high
- Limitations: external browser audit jobs may test subsets; no passing check can substitute for the direct current markup witness
- Mechanism: historical guards focus on icon buttons and links, not label text computation for inputs
- Related finding: same shared root package
- Does not prove: all other form fields are unnamed

---

## 2. Confirmations and extensions

### Confirm shared blast radius

- Target: `LEARNING-SEARCH-UNNAMED-INPUT`
- Added angle: final-dist inventory
- Anchor: complete production-like dist
- Result: broader scope
- Change: one shared defect manifests on 48 routes; MASTER should keep one systemic/shared-owner unit, not 48 symptom rows

### Confirm live applicability

- Target: source finding
- Added angle: three live route families
- Anchor: current live samples
- Result: same symptom
- Change: excludes stale/unpublished-source interpretation

---

## 3. Challenges and negative findings

### Challenge “placeholder is enough”

- Target: potential invalidation
- Reason: placeholder is transient instructional content, disappears on input, and does not provide a robust label contract
- Evidence: source markup has no label text/ARIA name
- Recommended result: invalid challenge

### Challenge 48 independent bugs

- Target: per-route expansion
- Reason: all instances originate from one shared component and exact same markup
- Evidence: source import/inventory
- Recommended result: duplicate symptoms absorbed into one shared root

---

## 4. Root-cause clusters

### Cluster `LEARNING-SHEET-FORM-LABEL-CONTRACT`

- Manifestations: 48 unnamed search inputs; absent form-name guard
- Shared mechanism: shared component relies on placeholder and hidden icon
- Root owner: `GillLearningSheet.astro`
- Class-level prevention: accessible-name computation fixture for the shared component/final dist
- Required preservation: input ID and JS lookup remain unchanged
- Scope excludes map checkboxes and unrelated forms until independently verified

---

## 5. Value and cost assessment

| Work | Value | Cost | Assessment |
|---|---|---|---|
| Add sr-only label text or aria-label | Restores reliable form naming on 48 routes | Very small | Necessary |
| Shared component regression test | Prevents broad recurrence | Small | Necessary |
| Rewrite search UI | No demonstrated need | High | Reject |
| Add 48 local patches | Duplicative | High | Reject |

---

## 6. Suggested verification wave

1. Recheck current owner/collisions.
2. Choose one persistent Russian accessible name.
3. Implement in shared component without changing `learningSearchInput` ID.
4. Render representative routes from Heart, Gill, Enoch and Baptist families.
5. Verify computed accessible name in Chromium accessibility snapshot or axe equivalent.
6. Type text and confirm name persists after placeholder disappears.
7. Exercise search results and global-search handoff.
8. Add shared mutation test that removes label text/ARIA name and must fail.
9. Run overlay/runtime and representative browser smoke.

Closure: shared source fix + representative accessibility snapshot + final-dist inventory.

---

## 7. Suggested repair boundaries

- Primary file: `src/components/article-pilots/gill-series/GillLearningSheet.astro`.
- Preferred repair: include `<span class="sr-only">Найти в этой статье</span>` inside the existing label, or explicit `aria-label`; avoid duplicate conflicting names.
- Preserve input ID, type, autocomplete, placeholder and JS event logic.
- Supporting change: focused accessible-name regression test.
- Do not edit 48 generated route owners individually.
- Do not alter global command palette or search indexing.

Required checks: component render, accessibility name, representative route smoke, overlay contracts.

---

## 8. Owner decisions

1. Choose visible versus visually-hidden label. Recommendation: sr-only text inside existing `<label>` for native semantics.
2. Confirm wording. Recommendation: “Найти в этой статье”, matching placeholder.
3. Decide whether placeholder remains. Recommendation: retain as visual hint; it no longer carries naming authority.
4. Confirm one shared systemic repair rather than per-route lanes. Recommendation: yes.
