# Agent Audit Report — Nagornaya keyboard and light-theme pass

## Meta

- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: `arena-agent-surface-pass-4`
- Date: `2026-07-17`
- Product ref/SHA: `main` at `cb3681e1a85b5f8919c9dc537f812a842bbe9235`
- Build/runtime: production-like dist + local/live Chromium
- Viewport/theme: `390×844`, default light theme
- Scope: Nagornaya tables and Part IV contrast
- Explicit exclusions: prior data/Atlas/Gill/Baptist findings
- Signal class: Product accessibility/runtime
- Proof state: FAIL for two bounded contracts
- Claim boundary: exact source, current artifact, current live routes
- Semantic owners: Nagornaya responsive table wrappers and chapter-IV light palette

---

## 1. New findings

### `NAGORNAYA-MOBILE-TABLE-KEYBOARD-SCROLL`

- Kind: accessibility defect / class extension; suggested severity `P2 / medium`
- Routes: `/nagornaya/chast-1/`, `/nagornaya/chast-3/`, `/nagornaya/chast-4/`
- Expected: actual horizontal scroll regions can be reached and panned by keyboard
- Actual: five `.overflow-x-auto` regions overflow at `390px`, retain `tabIndex=-1`, and contain no focusable descendants
- Live census:
  - Part I: three regions, `343px` client vs `384px` content;
  - Part III: one, `343px` vs `384px`;
  - Part IV: one, `291px` vs `384px`.
- Axe: Part I reports three `scrollable-region-focusable` serious violations
- Source: wrapper components in Parts I/III/IV; `NagornayaCompactBottomBar.astro:36-58` governs local overflow styling but emits no focus owner
- Confidence: high (source census + artifact + axe + live 200/browser dimensions)
- Classification note: same accessibility class as the accepted Gill-table finding, but a separate Product owner/surface. Verifier should prefer a shared system root with bounded owner-specific lanes rather than duplicate per-table rows.

### `NAGORNAYA-CH4-LIGHT-TEXT-CONTRAST`

- Kind: accessibility/theme defect; suggested severity `P2 / medium`
- Route: `/nagornaya/chast-4/`, default light theme
- Expected: normal-sized reader text/markers meet 4.5:1
- Actual: live axe reports 24 nodes below AA:
  - 20 footnote markers `.text-amber-600` at `3.18:1` (`#d97706` on white, 12px bold);
  - chapter kicker at `3.08:1` (`#d97706` on `#fcfbf9`);
  - two small labels at `4.39:1`;
  - one small muted label at `2.33:1`.
- Root: chapter-IV amber and muted light-theme tokens are used as small text without light-background contrast qualification
- Existing dark-theme evidence does not close this: its `text-amber-600` 12.05:1 verdict is the dark-theme remap, while this witness is the current default light cascade
- Confidence: high (live HTTP 200 + live axe/computed effective colors + exact source token history)

Evidence: `evidence/live-nagornaya-scroll-census.json`, `evidence/live-nagornaya-ch4-axe.json`, `evidence/source-anchors.md`.

---

## 2. Confirmations and extensions

1. The prior Gill table finding establishes the same keyboard-scroll mechanism on a different series owner. This pass extends class scope to five Nagornaya regions and supports a system-level merge proposal rather than five new symptoms.
2. `reverify/CURRENT_HEAD_REVERIFY_2026-08-04_f9d01207_nagornaya-dark-browser.md` correctly shows the dark remap of `text-amber-600` is readable. This pass narrows the new defect to default light theme. See `comments/comment-on-nagornaya-dark-browser.md`.
3. Earlier Nagornaya deep audits inventoried raw `#d97706`; this pass adds the missing live light-theme WCAG witness. See `comments/comment-on-nagornaya-deep-audit.md`.

---

## 3. Challenges and negative findings

- Do not describe Nagornaya pages as globally overflowing; page-level overflow is zero and the defect is local region keyboard entry.
- Do not create five table rows; one class/root covers all measured regions.
- Do not challenge the prior dark-theme amber closure; the current failure is light theme.
- Footnote markers remain readable to many users and content is present, so no P0/P1 claim is justified.
- Other historical dark-theme token residuals are not reopened by this package.

---

## 4. Duplicate and root-cause clusters

- Preferred root: `READING-TABLE-KEYBOARD-SCROLL` spanning Gill manuscript tables and Nagornaya `.overflow-x-auto` wrappers.
- Preserve owner-specific repair lanes because markup/CSS producers differ.
- Keep chapter-IV contrast separate from table keyboard access.
- Collapse all 24 contrast nodes into one chapter light-palette work unit.

---

## 5. Severity and value assessment

| Finding | Severity | Impact | Cost |
|---|---:|---|---:|
| Nagornaya table keyboard scroll | P2 | Keyboard-only readers cannot deliberately access clipped columns | low-medium |
| Chapter IV light contrast | P2 | Repeated source markers and labels are below AA across the article | low |

---

## 6. Suggested verification and repair lanes

### Shared reading-table system verification

- Reproduce Gill + Nagornaya predicates under one test contract.
- Add focusability/labels only to actual scroll regions where practical.
- Preserve table semantics, touch scroll, print and local overflow.
- Verify Tab entry and horizontal keyboard pan in Chromium/WebKit.

### Nagornaya Part IV light palette

- Retune effective amber/muted text colors against actual light surfaces.
- Preserve dark-theme remaps and chapter identity.
- Verify mobile/desktop, light/dark, normal and interactive/focus states.
- Acceptance: admitted axe nodes zero; previous 36-state dark verification remains green.

Proposals are under `proposals/`.

---

## 7. Reverify results

- Current live Parts I/III/IV each returned HTTP 200 and reproduced five exact scroll predicates.
- Local artifact and live dimensions agree.
- Part I targeted axe reports three serious scroll-region violations.
- Live Part IV targeted axe reports 24 color-contrast nodes.
- AuditRepo search found historical dark-theme amber evidence but no current light-theme or Nagornaya keyboard-scroll canonical row.
- Package validators run after assembly.

---

## 8. Notes for verifier

- Re-anchor Product main and inspect current Nagornaya/table PR overlap.
- Merge table class with Gill at root level if the accepted PR #337 evidence is canonical; do not duplicate symptoms.
- Keep a separate Part IV light contrast row.
- Require WebKit plus Chromium for table keyboard behavior.
- For contrast, test explicit default-light storage state and preserve dark remap.
- Suggested canonical result after independent reproduction: one expanded system table row/lane map plus one `current-local / accessibility / P2` contrast row.
- Provisional synthesis: `VERIFIER_SYNTHESIS.md`.
