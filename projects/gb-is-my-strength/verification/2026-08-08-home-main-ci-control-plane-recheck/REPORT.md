# GB Home / main / CI control-plane recheck — 2026-08-08

## Result

Fresh current-Product recheck at:

`FedorMilovanov/gb-is-my-strength@a068decefff4ddd0055da952c84b7a3633d7b43b`

This pass was scoped to the Home surface, temporary writer/config residue, active Product ownership/collision state and current CI authorization.

Disposition:

- **no new direct current Home defect is promoted to MASTER**;
- the Product move from `21b437cb...` to `a068dece...` is one merged Gill projection commit and changes no Home file;
- no previously suspected temporary Home dev config or arena one-shot workflow survives on current `main`;
- current Home source still has presentation-owner duplication, but without a fresh user-visible regression witness it remains **optional cleanup / Work Queue**, not a bug row;
- Product ownership changed materially: `#1209`, `#1214`, `#1216` and `#1217` now occupy existing MASTER work roots and must be treated as collision boundaries;
- there is no current evidence of a red Home regression on the merged current-main candidate, but several active PRs are not yet merge-authorized because CI is running, stale to current main, or `action_required`.

This report updates handoff/collision evidence; it does not create a second matrix or mirror volatile Product state beyond the evidence needed for this wave.

---

## 1. Current Product anchor and Home applicability

Previous narrow verification anchor:

`21b437cb79f7b74a4ad3c68e21ffad2edd8ce458`

Current Product `main`:

`a068decefff4ddd0055da952c84b7a3633d7b43b`

The only commit between those anchors is Product `#1213` (`fix(gill): converge public series projections`). Its current-main diff is exactly four files:

- `data/links-graph.json`;
- `scripts/gill-series-data-consistency-audit.js`;
- `src/components/biografii/BiografiiAwakeningSection.astro`;
- `src/components/biografii/BiografiiRecentSection.astro`.

Therefore the previous Home source observations remain applicable at the current Product anchor: **no Home source was changed by the latest main advance**.

Exact PR head for `#1213` was `a748cb57fe276693019bbdd4ec9db790050a43e9`. All 11 workflow groups returned for that exact head were terminal SUCCESS, including Shared Files Guard, Visual Parity, Native Source, Deploy Candidate, Search Modal, Print and Route Registry. No current merged-main Home regression is evidenced by this transition.

---

## 2. Current Home source ownership

### Directions: effective mobile presentation has two cascade owners

Current `src/pages/index.astro` renders:

`HomeResponsiveContracts → HomeMain → HomeVisualAuditFixes → HomeAmbientInteraction`

`HomeVisualAuditFixes.astro` explicitly says it is rendered after `HomeMain` so reviewed optical contracts win over earlier/shared presentation.

At `<=760px`, `HomeSections/Directions.astro` currently authors a horizontal showcase shelf with, among other values:

- `.h-home-route { grid-template-columns: minmax(0, 1fr); }`;
- `flex-basis: calc(100% - 26px)`;
- 124px object row;
- 178px glyph/object sizing;
- its own mobile typography/padding.

The later `HomeVisualAuditFixes.astro` then overrides the same current cards with a different mobile geometry:

- `grid-template-columns: 56px minmax(0, 1fr)`;
- different gap/padding;
- 56×64 glyph sizing;
- different object limits and label typography;
- further `<=340px` overrides.

This is a real current **ownership split**, but the current pass does not reproduce a user-visible Directions regression. Under AuditRepo rules it is not promoted to MASTER solely because the cascade is untidy.

### Ambient: presentation remains distributed across three owners

`HomeResponsiveContracts.astro` correctly owns safe-rail geometry, but it also still defines normal visual presentation for marginalia: text colors/blur/shadows, tooltip/source colors and typography, disclosure transforms/transitions and hover presentation.

`HomeAmbientInteraction.astro`, whose stated role is progressive interaction and disclosure timing, also defines tooltip/source transitions, hover/focus/pinned visual state and pinned text colors/shadows.

`HomeAmbientPhrases.astro` remains the leaf corpus/base presentation owner.

So the earlier geometry conflict is repaired, but **normal Ambient presentation still has Phrases + Responsive + Interaction owners**. This is the same class of maintainability risk as the Directions late override, not a fresh direct reader defect.

`HomeResponsiveContracts.astro` also retains a stale Directions comment describing a `::before` selection surface / `::after` edge tint, while the current Directions selection surface is a real `.h-home-route__surface` element. This is documentation debt, not a Product defect.

### Embedded localhost assertions

`HomeVisualAuditFixes.astro` and `HomeAmbientInteraction.astro` contain localhost-only browser assertions inside Product components. They return before the audit logic on public hostnames, so this pass does not classify them as a production runtime defect. Moving such assertions into existing browser-contract owners may be considered during an owner-convergence cleanup, but is not mandatory without a measured/current failure.

### Disposition

No `HOME-*` / `SYS-HOME-*` row is added to MASTER in this wave.

Current owner convergence is recorded in `WORK_QUEUE.md` with a promotion trigger: promote only if a fresh browser regression, false-green contract, recurring owner collision, or measured runtime/maintenance failure makes the consolidation independently necessary.

---

## 3. Temporary writer/config residue

Current-main checks at `a068dece...`:

- `astro.config.dev.mjs` — **absent (404)**;
- `.github/workflows/arena-release-quote-inset-fix.yml` — **absent (404)**;
- repository search for `astro.config.dev.mjs` — no current result;
- repository search for `one-shot` — no current result;
- no current writer file was discovered by this scoped pass.

The canonical `astro.config.mjs` remains the ordinary static Astro config; the previously reviewed temporary dev-host bypass is not present on current `main`.

Therefore there is **no current temporary writer/config defect to add to MASTER**.

---

## 4. Active Product owners / collision boundaries

### `SEARCH-P3-02` → Product `#1209`

`#1209` is the current bounded Product owner for the existing MASTER improvement `SEARCH-P3-02`.

Current PR head observed in this pass:

`2b90612c82cf9df356c11b62d8099521700fd758`

Current-main ancestry check:

- base current main: `a068dece...`;
- `behind_by=0`;
- candidate is ahead of current main.

The PR body still names an earlier candidate SHA, so merge authorization must use the actual PR head, not prose history. On `2b90612c...` the current workflow set was queued/pending/in-progress at this snapshot; no returned failure was present, but the PR was **not yet terminal-green / merge-authorized**.

Do not open a competing Search continuation lane.

### `BAPT-S12-01` → Product `#1214`

`#1214` is the current Product repair owner for the existing MASTER defect `BAPT-S12-01`.

Head:

`8cc802cb24a89a92926cc71e73af559a37ee5d86`

Its exact-head workflow set returned terminal SUCCESS for the visible triggered groups, including Shared Files, Visual Parity, Native Source and Deploy Candidate. However after Gill `#1213` merged, current ancestry is `behind_by=1`; the old green head is therefore evidence, not current-main merge authorization. Rebase/clean-successor/current-head proof is required before merge.

### `CATALOG-PROJECTION-01` → Product `#1216`

`#1216` is the current Product owner for the existing MASTER defect `CATALOG-PROJECTION-01`.

Head:

`a76f98721145e76a1ffb89fed4c64cb65860cdab`

Current ancestry:

- `behind_by=1` after `#1213`;
- PR reports non-mergeable at this snapshot.

The latest returned workflow runs on this head are `action_required`, and the run inspected for Shared Files contains **zero jobs**. This is not evidence of a test assertion failure, but it is also not green CI and cannot authorize merge.

The actual PR changed-file list includes `.github/workflows/scripture-occurrence-index-contract.yml` and `data/scripture-search-index.json` in addition to the Articles files. That is materially broader than the prose claim that no workflow is changed. Before any merge, the PR owner must reconcile current-main ancestry, workflow authorization and the stated-vs-actual diff boundary rather than treating the current `action_required` set as passing evidence.

### `BAPT-CONTENT-TRUTH-01` → Product `#1217`

`#1217` is the clean current-main successor to `#1215` and owns the existing MASTER defect `BAPT-CONTENT-TRUTH-01`.

Head:

`e1bbc4746904a5c7639c49146c4d434f74bdb038`

It is based on current `main@a068dece...`, changes one QA-register file and is mergeable at this snapshot. Shared Files Guard and Metadata were already SUCCESS while other triggered workflows were still queued/in-progress. Keep the MASTER row active until exact-head CI and merge/result verification complete.

### Audit-only `#1212`

`#1212` adds an all-reading-route control census to the existing Runtime Interactive Audit. It is not a Product repair owner for any Home defect in this pass.

Head `3292f4c...` is currently `behind_by=1`; Shared Files / Metadata / Node Toolchain were green while Runtime Interactive Audit remained queued. Its Home evidence is useful as future guard coverage, but it should not be cited as current exact-main authorization until refreshed.

---

## 5. Branch forensic

Stale-looking Product refs still exist, including:

- `agent/home-marginalia-geometry-owner-20260807`;
- `agent/home-quote-static-mirror-fix`;
- `lane/home-footer-settled-contract-20260807` and `-r2`;
- `lane/system-home-searchaction-query-entry-20260805`;
- `transport/legacy-obsolete-writer-20260805`;
- `transport/legacy-obsolete-writer-v2-20260805`.

This pass deliberately does **not** delete them by name. Direct ancestry compares show at least the tested Home marginalia ref and writer-v2 ref are diverged from current `main` and retain unique branch commits by ancestry. That does not prove their material is still useful, but it also does not satisfy the AuditRepo rule for proven-obsolete ref deletion.

Required future cleanup boundary: inspect unique commits/material, map any surviving evidence to merged/current authorities, then delete only refs proven fully absorbed or useless. Branch count alone is not a defect.

---

## 6. Matrix effect

This verification does not change active-work counts by itself.

- direct Home defects added: **0**;
- temporary writer/config defects added: **0**;
- Home owner convergence: **Work Queue / optional until a promotion trigger exists**;
- existing Product work roots now have explicit current owners/collision status in MASTER `IN FLIGHT`;
- `#1216` is explicitly **not green** at this snapshot (`action_required`, zero jobs on inspected run) and is stale to current main;
- `#1209`, `#1217`, `#1212` have current CI still in flight at this snapshot;
- `#1214` has strong exact-head green evidence but that head is one commit behind current main.

The closure rule remains unchanged: after each Product owner merges and the result is verified on the resulting current surface, remove the corresponding completed MASTER work unit in the same reconciliation wave.