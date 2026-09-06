# Verification Wave Synthesis — Arena PRs #317–#322

## Meta

- Date: 2026-07-17
- Verifier: Arena.ai Agent Mode
- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Wave purpose: current-head verification, deduplication and MASTER admission for AuditRepo PRs #317–#322
- Selected current-check anchors: Product `3b6bac3904331176023fb7517f131c8c9360bbc5`; AuditRepo `fabecaf2831c73447b2323c1d9c68a13aac0c3ca`; current live pages where named below
- Scope: schema root audit boundary, CSS parity admission, Lot outbound-link privacy, Atlas landmarks, Biografii heading hierarchy, shared learning-search accessible name
- Explicit exclusions: Product repair, visual redesign, unrelated historical claims, Research hard-gate lane
- Signal classes represented: Product, audit harness, control-plane, live
- Exact Product / artifact / event anchors: Product current source SHA above; earlier exact deploy run `32051788316` remains lifecycle evidence for CSS admission; live `/articles/lot-i-sodom/`, `/map/`, `/biografii/` and representative learning-sheet routes
- Semantic owners and overlap check: GitHub API returned no open Product PRs/issues and only Product `main`; no competing Product owner found

> This synthesis classifies a selected package. It does not promise to keep AuditRepo synchronized with every future Product commit.

---

## Inputs reviewed

| Agent/report | Audited anchor | Scope | Evidence angles | Findings/claims |
|---|---|---|---|---|
| AuditRepo PR #317 | Product `a2ef67d`; rechecked `3b6bac3` | root schema command | source, root command, dist/live history | reference-only legacy HTML creates current root-audit false-red |
| AuditRepo PR #318 | Product `a2ef67d`; rechecked `3b6bac3` | CSS parity/admission | source, build, live, lifecycle | valid Astro hashed CSS is rejected; deploy omits stale gate |
| AuditRepo PR #319 | Product `a2ef67d`; rechecked `3b6bac3` | Lot source links | source, dist, live, guard | seven external `_blank` links omit `noreferrer`; guard checks only `noopener` |
| AuditRepo PR #320 | Product `a2ef67d`; rechecked `3b6bac3` | Atlas landmarks | source, dist, live | interactive and no-JS owners each emit `main` |
| AuditRepo PR #321 | Product `a2ef67d`; rechecked `3b6bac3` | Biografii outline | source, dist, live | visible recent shelf label is a div while its six cards are H3 |
| AuditRepo PR #322 | Product `a2ef67d`; rechecked `3b6bac3` | shared learning search | source, dist inventory, live samples | input has no persistent accessible name; 48 route manifestations |

---

## Executive result

| Input count | Current local | Systemic roots | Duplicate symptoms | Stale | Invalid/audit drift | Parked/risk accepted | Owner decisions |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 6 | 4 | 2 | 55 manifestations absorbed | 0 | 0 | 0 | 0 |

### What changed in our understanding

- All six report packages remain applicable on Product `3b6bac3904331176023fb7517f131c8c9360bbc5`.
- PR #317 does **not** reopen the historically repaired live Krajne schema defect. Its current boundary is solely the ownership-blind root audit.
- PR #318 does **not** prove `/app/` is unstyled. It proves a false-red detector and the resulting release-admission gap.
- PR #319 is narrowed to explicit referrer privacy. `noopener` is already present, so reverse tabnabbing is not claimed.
- PR #322 is one shared-component defect, not 48 independent rows. Likewise PR #319 is one seven-instance component defect.
- MASTER contained solved and candidate-tagged rows inconsistent with the operating model. This consolidation removes solved rows and converts still-current title findings to current-confirmed rows.

### Highest-value next actions

1. Repair the shared learning-search accessible name and add a shared regression witness.
2. Repair the two audit-system roots before relying on their commands for admission.
3. Close the bounded Lot, Atlas and Biografii lanes with source + production-like dist witnesses.

---

## 1. Current local findings

| Finding | Signal class | Proof state | Evidence angles | Current-check anchor | Claim boundary | Suggested lane | Minimum closure proof |
|---|---|---|---|---|---|---|---|
| `D-22 LOT-EXTERNAL-NOREFERRER` | Product + harness | FAIL/current | source + dist + live + guard | `3b6bac3` | seven Lot external `_blank` links omit explicit `noreferrer`; no opener claim | Lot sources + G23 guard | zero missing tokens in source/dist; mutation fixture |
| `D-23 MAP-DUPLICATE-MAIN` | Product + harness | FAIL/current | source + dist + live | `3b6bac3` | two main owners across interactive/no-JS composition | Atlas semantic composition | one final main; JS graph and no-JS list both work |
| `D-24 BIO-RECENT-HEADING` | Product + harness | FAIL/current | source + dist + live | `3b6bac3` | recent shelf starts H1→H3 because visible section label is not H2 | Biografii recent shelf | H1→H2→H3 sequence plus visual parity |
| `D-25 LEARNING-SEARCH-NAME` | Product + harness | FAIL/current | shared source + 48-route dist inventory + live samples | `3b6bac3` | one shared search input lacks persistent accessible name | GillLearningSheet owner | computed name persists while typing; representative family smoke |

---

## 2. Systemic root causes

### System root `SYS-AUDIT-ROOT-OWNERSHIP`

- Symptoms absorbed or related: PR #317 root schema false-red; historical Krajne `900×600` residue in reference-only HTML.
- Shared mechanism: `schema-rich-results-audit.js --root .` scans repository-root HTML without applying current route ownership/publication status.
- Surface evidence: root command still fails four Krajne dimension checks on Product `3b6bac3`.
- Mechanism evidence: current Krajne route is Astro-owned/production-dist; live and current production artifact use `1200×630`.
- Lifecycle evidence: historical report records the old published defect, while current publication repaired it.
- Why local patches are insufficient: changing the stale Krajne copy alone leaves the ownership-blind class and future false-reds intact.
- Proposed common owner/process/contract: ownership-aware source/reference audit semantics with adversarial reference-only fixtures.
- Representative case: `/articles/krajne-li-isporcheno-serdce/`.
- Exceptions: if owner explicitly makes legacy reference copies current semantic authority, document that contract and keep root parity as a separate named gate.
- Findings that may close as absorbed-by-system-fix: PR #317 candidate wording.

### System root `SYS-CSS-PRESENCE-ADMISSION`

- Symptoms absorbed or related: PR #318 `/app/` false-red and absence of CSS parity from deploy admission.
- Shared mechanism: detector recognizes legacy named CSS/inline style but not resolvable Astro `/_astro/*.css` output.
- Surface evidence: current detector regex is unchanged on `3b6bac3`; `/app/` source still compiles global style to hashed CSS.
- Mechanism evidence: built/live `/app/` carries resolvable route CSS despite detector failure.
- Lifecycle evidence: exact deploy run `32051788316` succeeded without a CSS parity step.
- Why local patches are insufficient: whitelisting `/app/` would not model current CSS owners and could hide future missing assets.
- Proposed common owner/process/contract: resolve approved same-origin stylesheets, require meaningful route styling, add adversarial missing/empty/utility-only fixtures, then enforce in deploy admission.
- Representative case: strict-native `/app/`.
- Exceptions: intentional self-contained bundled applications remain explicitly classified.
- Findings that may close as absorbed-by-system-fix: both observations in PR #318.

---

## 3. Duplicate and merge decisions

| Finding | Canonical owner/root | Decision | Reason |
|---|---|---|---|
| Seven Lot link instances | `D-22` | duplicate-symptom | one component and one guard mechanism |
| 48 learning-search route instances | `D-25` | duplicate-symptom | one shared `GillLearningSheet` owner |
| PR #317 historical Krajne dimensions | `SYS-AUDIT-ROOT-OWNERSHIP` current boundary | merge/narrow | published Product defect is historical; only audit-boundary residue remains |
| PR #318 deploy omission | `SYS-CSS-PRESENCE-ADMISSION` | merge | detector must become truthful before admission can safely require it |
| PRs #320 and #321 | independent local owners | keep-independent | different routes, semantics and closure witnesses |

---

## 4. Stale, invalid and audit-drift

| Finding | Result | Decisive evidence | Historical value retained |
|---|---|---|---|
| “Current live Krajne JSON-LD is `900×600`” | stale/closed historical claim, not an input admitted to MASTER | current live/dist `1200×630` | prior verification remains historical provenance |
| “`/app/` is unstyled” | invalid wording / audit false-red | resolvable hashed Astro CSS in built/live page | detector failure retained under system root |
| “Lot links permit reverse tabnabbing” | invalid overstatement | all seven include `noopener` | missing `noreferrer` privacy boundary retained |

No PR #317–#322 report is discarded wholesale; each was narrowed where necessary.

---

## 5. Parked, accepted risk and not worth fixing

| Finding | Result | Reason | Revisit trigger |
|---|---|---|---|
| None | N/A | all six packages contain current necessary work after narrowing | N/A |

No optional visual redesign, global referrer-policy rewrite or broad heading rewrite is admitted.

---

## 6. Owner decisions

| Decision | Why needed | Options | Recommendation |
|---|---|---|---|
| Root legacy HTML authority | determines exact implementation of PR #317 root fix | current authority vs explicitly named reference-parity gate | current route ownership must govern current publication claims |
| CSS presence in deploy | determines enforcement after detector repair | optional composite-only vs always-created deploy check | enforce after truthful detector is green |

These are implementation-contract choices inside admitted system roots, not additional MASTER owner-decision rows: they do not block acknowledging the current false-red mechanisms.

---

## 7. Repair lane options

### Lane A — shared accessibility owner

- Scope: `GillLearningSheet` accessible name and focused regression.
- Parallelism: independent of all other lanes.
- Checks: component render, accessibility snapshot, representative Heart/Gill/Enoch/Baptist smoke.

### Lane B — bounded route semantics

- Scope: Lot links + guard, Atlas single-main composition, Biografii shelf H2.
- Parallelism: three independently mergeable lanes; no shared Product files identified.
- Checks: route-specific source/dist/live-equivalent witnesses and visual/runtime preservation.

### Lane C — audit/control-plane roots

- Scope: ownership-aware root schema semantics; CSS-owner detector then deploy admission.
- Parallelism: separate script owners, but workflow mutation should follow detector repair.
- Checks: adversarial fixtures, complete production-like artifact, workflow/control-plane audit.

### Sequencing constraints

- Do not add current `dist:css-parity` to deploy before correcting its false-red.
- Do not “fix” PR #317 by reopening the live Krajne Product defect.
- Do not split repeated Lot or learning-sheet manifestations into per-link/per-route lanes.

---

## 8. Verification sufficiency

| Finding/root | Surface | Source/mechanism | Build/artifact | Live/lifecycle | Sufficient for MASTER? |
|---|---:|---:|---:|---:|---:|
| `D-22` | yes | yes | yes | yes | yes |
| `D-23` | yes | yes | yes | yes | yes |
| `D-24` | yes | yes | yes | yes | yes |
| `D-25` | yes | yes | yes, 48 routes | representative live samples | yes |
| `SYS-AUDIT-ROOT-OWNERSHIP` | yes | yes | current dist/history | lifecycle history | yes |
| `SYS-CSS-PRESENCE-ADMISSION` | yes | yes | yes | exact deploy lifecycle | yes |

### Final admission decision

- Admit four current Product defects: `D-22`–`D-25`.
- Admit two verified necessary audit/control-plane implementations: `SYS-AUDIT-ROOT-OWNERSHIP` and `SYS-CSS-PRESENCE-ADMISSION`.
- Keep zero duplicate symptom rows.
- Remove solved rows and non-current candidate labels from MASTER during this same consolidation wave.
