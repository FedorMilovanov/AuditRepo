# Agent Audit Report — Atlas and Gill accessibility pass

## Meta

- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: `arena-agent-surface-pass-2`
- Date: `2026-07-17`
- Audited ref/SHA: Product `main` at `cb3681e1a85b5f8919c9dc537f812a842bbe9235`
- Build: production-like dist; local and live Chromium
- Browser/viewport: Playwright Chromium, `390×844`
- Scope: `/map/` responsive controls and Gill mobile data tables
- Explicit exclusion: `data:consistency`
- Signal class: Product accessibility/runtime
- Proof state: FAIL for three bounded contracts
- Claim boundary: exact source + current generated artifact + live runtime at observation time
- Semantic owners: `AtlasBody.astro`, `MapStyles.astro`, `atlas-runtime.js`, `GillSeriesResponsiveStyles.astro`, Gill table components
- Overlap: current Product PRs `#1721` and `#1722` are CSS/CI-adjacent and require exact-file recheck before mutation

---

## 1. New findings

### `ATLAS-MOBILE-FILTER-UNNAMED`

- Kind: accessibility defect; suggested severity `P2 / medium`
- Route: `/map/`, responsive boundary `≤980px`
- Expected: visible filter button exposes an accessible name describing its purpose
- Actual: CSS makes the button visible but hides its only text span; SVG is `aria-hidden` and the button has no `aria-label`
- Source: `AtlasBody.astro:39-42`; `MapStyles.astro:397-398`
- Live Chromium: button visible; text content is `Фильтры`; span computed `display:none`; ARIA snapshot is only `button`; role query by name `Фильтры` returns `0`
- Standard/mechanism: WCAG 4.1.2 / accessible-name failure; axe `button-name`, critical
- Confidence: high (source + generated artifact + local browser + live browser)

### `ATLAS-SEARCH-COMBOBOX-SEMANTICS`

- Kind: accessibility defect; suggested severity `P2 / medium`
- Route: `/map/`, all viewports
- Expected: input controlling a `listbox`, toggling expansion and using `aria-activedescendant` exposes a combobox contract
- Actual: native `type=search` remains role `searchbox` while carrying `aria-expanded`; axe reports `aria-expanded` is not allowed on that role. Runtime creates six options and sets active descendant, but the accessibility snapshot remains a plain searchbox with no combobox expanded/results semantics
- Source: `AtlasBody.astro:24-28`; `atlas-runtime.js:797-825,1030-1056`
- Live Chromium after query/ArrowDown: `aria-expanded=true`, active descendant `atlasSearchOption-0`, six `role=option` nodes, but combobox count `0` and snapshot remains `searchbox`
- Standard/mechanism: WCAG 4.1.2; axe `aria-allowed-attr`, critical
- Confidence: high

### `GILL-MOBILE-TABLE-KEYBOARD-SCROLL`

- Kind: accessibility defect; suggested severity `P2 / medium`
- Routes: Gill Parts I, II, III and `dzhon-gill-spravochnik`
- Expected: horizontally scrollable content regions are keyboard focusable or contain a focusable scrolling control
- Actual: responsive CSS turns `table.manuscript-table` into `display:block; overflow-x:auto`; overflowing tables retain `tabIndex=-1` and contain no focusable descendants
- Live census at `390×844`: 9 overflowing/non-focusable tables — Part I: 1; Part II: 2; Part III: 1; reference: 5. Largest observed `501px` content inside `340px` client width
- Standard/mechanism: keyboard users cannot deliberately enter/pan the clipped region; axe `scrollable-region-focusable`, serious
- Source: `GillSeriesResponsiveStyles.astro:60-69` plus table components; no focus owner/label is emitted
- Confidence: high (source + artifact + axe + live dimensions)

Evidence: `evidence/axe-summary.md`, `evidence/live-browser-witness.json`, `evidence/source-anchors.md`.

---

## 2. Confirmations and extensions

1. `incoming/chatgpt/2026-08-10/WAVE-06-EXACT-RELEASE-PUBLICATION-SEO-RUNTIME-PERF-CENSUS.md` correctly says the Atlas search has a name. This pass confirms the name but shows that naming alone is insufficient: the listbox state is attached to a searchbox rather than a combobox. See `comments/comment-on-wave06-atlas-search.md`.
2. `verification/2026-08-17-product-postmerge-same-sha-recovery/REPORT.md` proves responsive focus transfer involving `#atlasFilterTrigger`. This pass adds an orthogonal failure: at the same responsive state, the focus target has no accessible name. See `comments/comment-on-atlas-focus-recovery.md`.

---

## 3. Challenges and negative findings

- No duplicate ID, broken ordinary internal route/asset/fragment, missing image alt, or unsafe `_blank` relation was found in the 89-document production-like artifact.
- Metadata and visible text for all 76 sitemap routes matched live production; no release-staleness finding was admitted.
- Atlas filter failure is not “button absent” or “focus transfer broken”; visibility/focus behavior can pass while accessible naming fails.
- Atlas search is not unlabeled; the defect is role/state contract, not its accessible name.
- Gill tables are not globally viewport-overflowing: overflow is intentionally local. The defect is keyboard entry into the local scrolling region, not page layout overflow.
- Existing tooltip keyboard-dead-end evidence was reproduced incidentally but is not a new finding and was not re-admitted here.

---

## 4. Duplicate and root-cause clusters

- Keep the two Atlas findings as distinct acceptance failures but one repair lane: responsive control naming and combobox semantics share the Atlas control-contract owner.
- Keep Gill table keyboard access separate: different component/CSS owner and acceptance test.
- Do not merge either cluster into `MOBILE-CHROME-REGISTRY-GAPS`; that row concerns registry/mount coverage, not control semantics.
- Do not merge with `MISSING-BUTTON-TYPE`; Atlas filter already has `type=button`.

---

## 5. Severity and value assessment

| Finding | Proposed severity | User impact | Repair cost |
|---|---:|---|---:|
| Atlas filter unnamed | P2 | Screen-reader user hears an unlabeled visible button and cannot identify filter action | low |
| Atlas search semantics | P2 | Search results/expanded state are not represented as a combobox relationship | low-medium |
| Gill table keyboard scroll | P2 | Sighted keyboard-only user cannot enter/pan clipped columns on multiple reading routes | low-medium |

No P0/P1 claim: content remains available, no data loss/security/release failure is shown.

---

## 6. Suggested verification and repair lanes

### Atlas lane

- Recheck exact current PR files.
- Give filter trigger a stable accessible name independent of responsive display.
- Implement the standard input/listbox combobox contract (`role=combobox`, appropriate autocomplete/popup/state ownership) without breaking current keyboard selection.
- Verify closed/expanded ARIA snapshots, ArrowDown active descendant, Escape, responsive focus handoff, Chromium + WebKit, desktop + mobile.

### Gill lane

- Provide keyboard focusability only for tables that become scroll containers, with a useful accessible label/instruction.
- Preserve native table semantics, touch scrolling, thin visible scrollbar and print reversal.
- Verify Tab entry and arrow-key horizontal pan on every overflowing table; avoid unnecessary tab stops for non-overflowing tables if runtime conditioning is chosen.

Proposals: `proposals/proposal-atlas-control-a11y-lane.md`, `proposals/proposal-gill-table-keyboard-lane.md`.

---

## 7. Reverify results

- Product direct Astro build: PASS, 85 pages.
- Production-like copy/postbuild: PASS, 89 HTML documents.
- Existing dist smoke and overlay browser contracts: PASS.
- Axe WCAG A/AA representative scan reproduced the three admitted violations.
- Live `/map/` returned 200 and reproduced both Atlas failures.
- Four live Gill routes returned current tables; 9 regions met the exact overflow + no focus owner predicate.
- Current MASTER and incoming/verification text search found no canonical rows for these exact mechanisms.

---

## 8. Notes for verifier

- Independently reproduce on a real current checkout and inspect exact PR heads before promotion.
- Use three finding IDs but at most two repair lanes.
- For Atlas search, do not “fix” by deleting `aria-expanded`; preserve the listbox behavior through a valid combobox contract.
- For Gill, do not remove local overflow or force all columns into unreadably narrow wrapping.
- Require live/browser evidence after repair, not source-only assertions.
- Suggested disposition if reproduced: three `current-local / accessibility / P2` rows, then same-wave closure after runtime acceptance passes.
- Provisional synthesis: `VERIFIER_SYNTHESIS.md`.
