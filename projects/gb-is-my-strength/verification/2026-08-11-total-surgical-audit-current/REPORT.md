# Total surgical audit — current Product state

Date: 2026-08-11
Mode: **fresh live-state / exact-current authority / no Product mutation**
Disposition: **FINAL-ZERO NOT AUTHORIZED**

This pass re-checks current Product truth instead of trusting historical audit rows, PR descriptions or transient green jobs. The Product is under an active terminal transaction, so exact SHA authority is recorded wherever a claim depends on it.

## SSOT authority

Current AuditRepo `verified/MASTER_BUG_MATRIX.md` contains only three active work units:

- `V12-READER-LINEAR-TEXT-POLLUTION` — direct current defect;
- `V07-ATLAS-FOCUS-STATE` — direct current defect;
- `FINAL-ZERO-AUDIT` — system lane blocked on Product convergence.

The compact MASTER is directionally correct. This pass found no basis to resurrect already-terminal historical roots merely because old CI issues or branches still exist.

## Product authority moved during the pass

`main` advanced through multiple terminal commits while this audit was running. The latest observed authority for this report is:

`1cfe85ad387df2d598f055ea8834ca4e907732a3` — `chore(terminal): start direct self-cleaning final proof`.

Any later automatic terminal commit must be re-audited before a MASTER row is closed.

## V12 terminal false-green path — CONFIRMED / BLOCKING

### Current main still has the known Pagefind metadata-capture defect

At the audited current main, `scripts/project-reader-linear-text-to-dist.mjs` still emits projected metadata using `data-pagefind-meta="KEY"` while storing the value in the `content` attribute.

The already-developed repair uses the Pagefind attribute-capture form `data-pagefind-meta="KEY[content]"` and preserves the original value in `content`.

That stronger implementation exists on preserved branch `agent/reader-linear-meta-content-20260810` at closed-unmerged PR #1568 (`a796f135a88a9c1a6cbddf03bc5a2c15007c0c6c`). PR #1568 explicitly records the same root cause: a plain metadata key does not capture the meta element's `content` attribute; the key must declare `[content]`.

### The stronger V12 witness exists but is absent from current main

PR #1568 also strengthens `scripts/reader-linear-text-projection-browser-test.mjs` so it:

- inspects raw projected metadata before browser normalization;
- requires the projected Pagefind spec to capture `content` and requires a non-empty value;
- requires all five Krajne metadata fields to survive;
- repeats the metadata assertions in browser DOM;
- retains Chromium + WebKit, no-JS semantic projection, Pagefind and visible glossary checks.

Current main does not contain that strengthened contract.

### Current terminal proof does not include the V12 repair

The current direct-final transaction states that it will close both V07 and V12, but its bounded Product materialization only addresses the remaining Atlas focus handoff and generated revisions. It then runs the current reader witness. It does not port the #1568 projector repair or the strengthened #1568 reader witness.

Therefore there is a proven false-green route: a terminal run can report V12 success while the known metadata-capture defect remains in the Product tree.

### V12 disposition

`V12-READER-LINEAR-TEXT-POLLUTION` **must remain active** even if the current terminal transaction becomes green, unless a fresh final-main check proves all of the following:

- projected metadata uses a correct Pagefind attribute-capture contract;
- original metadata values are asserted rather than only the existence of fallback metadata;
- Krajne preserves image, author, readTime, category and scripture values;
- Krajne + Hermenevtika + an independent reader owner retain semantic boundaries and no raw metadata prefix/glued auxiliary prose;
- Chromium + WebKit permanent witness passes on the exact final main SHA.

## V07 Atlas focus lifecycle — STILL ACTIVE AT CURRENT SNAPSHOT

The current permanent Atlas contract is materially stronger than the original Wave 07 witness:

- Chromium + WebKit;
- widths 390, 680, 681, 980, 981, 1440;
- closed detail/drawer inert and semantic-hidden assertions;
- activeElement safety against BODY/HTML/hidden/unrendered surfaces;
- drawer open/group close/Escape;
- detail close/related replacement/detail Escape;
- desktop List→Graph focus transfer;
- history and breakpoint resize transitions.

The remaining current source at the audited terminal head still uses one focus call where the close-button object is selected before the fallback target. If the close control exists but cannot accept focus at that exact moment, the fallback is not attempted. The terminal transaction proposes a bounded repair with a real fallback/retry path.

At the audited snapshot that repair had not yet materialized into the #1598 Product source. V07 therefore remains active until the actual repair exists on current main and the exact Chromium/WebKit contract passes there.

The proposed witness change from requiring the close button specifically to requiring a meaningful focus target inside the open sidebar is acceptable only while existing checks continue to reject BODY, hidden, inert, unrendered or offscreen focus.

## Temporary control-plane transaction — FINAL-ZERO BLOCKER, NOT A NEW DIRECT ROOT

The terminal sequence temporarily places self-cleaning write-capable workflow helpers on `main`. Existing permanent workflow-policy checks reject those helpers while they are physically present.

The transaction is intended to remove all temporary helpers and restore the permanent Atlas workflow before its final tested tree is accepted. Treat this as a **transactional system blocker**, not automatically a third direct Product defect.

FINAL-ZERO requires the final main tree to contain no terminal helper residue and to pass the normal permanent control-plane checks.

## Hermenevtika SYSTEM lane — evidence strong; fresh-main replay still required

Artifact inspected: `hermenevtika-mobile-chrome-31434712840-1` from PR #1585.

The durable contract records 84/84 passes across:

- Chromium + WebKit;
- Hermenevtika and `/articles/lot-i-sodom/`;
- widths 390, 412, 899, 900, 1199, 1200, 1440;
- horizontal overflow;
- mobile top/bottom ownership through 1199;
- desktop floater/rail ownership from 1200;
- saved-quote/share docking and disabled docked animation.

Manual inspection of saved screenshots at 390/900/1199/1200 found no obvious horizontal clipping or bottom-bar content collision. The 1199→1200 owner switch is abrupt by design but visually coherent in the captured state.

This evidence does not authorize direct merge of the stale-base draft. #1585 still requires replay from the final current main after terminal cleanup.

## Narrow-tablet coverage — MEASUREMENT/COVERAGE GAP, NOT A CONFIRMED DEFECT

The Hermenevtika visual contract covers 899/900 but not the requested narrow-tablet cluster 761/768/800/820/860.

The shared `standalone-reader-layout-guard.mjs` does cover 768, plus 390/1199/1200/1280/1366/1440/1920, for Hermenevtika and Kod Da Vinci, but only in Chromium.

Therefore:

- 768 has durable reader-layout evidence;
- 761/800/820/860 do not yet have an equivalent fresh cross-browser geometry witness;
- absence of a test is not itself proof of a Product bug.

Keep this outside MASTER until an actual geometry/focus/overlap failure is measured.

## Tooltip accessibility relation — REVERIFY CANDIDATE

Current canonical `src/runtime/article-tooltips.js` still owns glossary, footnote and scripture-reference triggers, makes non-native triggers focusable and uses `aria-expanded`. It also reparents active popup content into a floating owner and later restores it.

The canonical owner still has no `aria-describedby` relation. This remains a legitimate accessibility-tree/AT candidate, especially for footnote/scripture relations after reparenting. It is **not promoted as a direct defect without an actual AX/AT witness**.

## Search/TTS performance — MEASUREMENT FIRST

No new current regression was proved in this pass for Search query→first-result latency or TTS click→first-audible latency. Both remain measurement-first work. Existing state-machine tests do not justify inventing latency budgets from source inspection alone.

## Remote branch cemetery is not terminal

Fresh remote branch census contains exactly 8 branches:

- `main`;
- `terminal/frozen-final-20260810`;
- `fix/home-search-scripture-settlement-20260811`;
- `lane/system-herm-mobile-chrome-integrity-2026-08-10`;
- `lane/system-site-menu-failsafe-2026-08-10`;
- `agent/reader-linear-meta-content-20260810`;
- `agent/krajne-schema-image-dimensions-20260810`;
- `agent/krajne-schema-image-dimensions-v2-20260810`.

Disposition:

- terminal/search/SYSTEM branches remain active transaction owners;
- `agent/reader-linear-meta-content-20260810` must be preserved until its unique V12 repair/witness is safely ported to final main;
- the two older Krajne branches survive although the successful Krajne repair landed through later PR #1564/v3. They are delete candidates only after a final unique-diff/commit check.

FINAL-ZERO requires every surviving non-main branch to have an explicit KEEP reason or be physically absent.

## CI issue cemetery is not terminal

Fresh issue census still contains many open lifecycle issues spanning current main failures, #1598, stale main Runtime/Native Source failures, stale-base SYSTEM PRs #1584/#1585, #1594, closed/merged PR identities such as #1568/#1569, and retired Atlas branch identities.

These issues are evidence, but their open state must not resurrect historical Product roots. FINAL-ZERO requires terminal disposition: current identities close through a newer successful run; retired identities close as retired/not-planned without falsely claiming recovery.

## AuditRepo WORK_QUEUE SSOT drift — DOCUMENTATION CLEANUP REQUIRED

`WORK_QUEUE.md` correctly states that MASTER is the only active problem matrix, but lower sections still claim historical families such as `SYS-STRANGLER-RETIREMENT`, Lot publication and old Search owner-decision rows are currently active in MASTER. That contradicts the fresh MASTER with only V12/V07/FINAL-ZERO.

This is AuditRepo documentation drift, not a Product defect. It should be cleaned so parallel agents do not reopen completed work from stale prose.

## Surgical disposition

### Confirmed direct Product roots

1. `V12-READER-LINEAR-TEXT-POLLUTION` — **OPEN; terminal false-green path proven.**
2. `V07-ATLAS-FOCUS-STATE` — **OPEN at audited snapshot; proposed final repair not yet materialized in current source.**

### Transaction/system blockers

- temporary terminal helpers must disappear and normal control-plane checks must pass on final main;
- #1594, #1584 and #1585 require fresh-main reconciliation after terminal transaction;
- branch and CI-issue cemetery must reach terminal dispositions;
- AuditRepo `WORK_QUEUE.md` stale active-work prose must be reconciled with MASTER.

### Held outside MASTER pending evidence

- 761/800/820/860 narrow-tablet cross-browser geometry;
- tooltip trigger↔popup AX/AT relation;
- Search first-result latency;
- TTS first-audible latency.

## FINAL-ZERO gate

**FAIL / NOT AUTHORIZED.**

Do not reduce MASTER to zero merely because a terminal workflow or commit message says V07/V12 closed. Re-open exact final main and prove Product code, permanent tests, normal CI, open PR count, issue cemetery and branch cemetery from that SHA.
