# PROGRAM CLOSURE MATRIX — gb-is-my-strength

> Program-level completion roadmap. This is deliberately separate from `verified/MASTER_BUG_MATRIX.md`.
>
> **MASTER=0 is not project-complete.** MASTER answers “what confirmed defect/system/decision work is currently admitted?”. This file answers “what product, editorial, research, publication and retirement programs remain before the owner can truthfully call the project complete?”.

Reverified 2026-09-24 after Product release `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`.

## Program state

| Wave | Program | State | Current measured boundary | Exit |
|---|---|---|---|---|
| 0 | Audit truth / control ledger | **VERIFIED_CLOSED** | MASTER reconciled after the release/Reader/genealogy closure chain; program work split out here | MASTER arithmetic and program matrix agree with current Product/live state |
| 1 | Release control plane + genealogy WebKit | **VERIFIED_CLOSED** | #2139/#2141 repair chain; resulting-main full Chromium/WebKit/Firefox and reduced-motion gates PASS | no weakened assertion; immutable release proof survives resulting-main |
| 2 | Production recovery + Reader | **VERIFIED_CLOSED** | #2140 and #2136 merged; production released exact `d9cbcdb...`, then Reader `335ff0c3...` | live releaseSha equality + Reader live proof |
| 3 | Genealogy engineering / safe editorial integration | **VERIFIED_CLOSED** | corrected #2137 merged as `d0e04a9c...`; candidate and promotion run `35927303479` PASS | exact build/projection/browser/live proof |
| 4 | Genealogy editorial corpus | **OPEN** | raw 3056 persons / 2053 edges / 982 isolated; RU review **2825**; publishable relation evidence **42 reviewed / 139 pending** | source-backed manual certification in deterministic batches; raw corpus remains fail-closed until Phase-1 exit criteria |
| 5A | Baptists Git + Drive source inventory | **IN_PROGRESS** | stale chapter research families remain hundreds of commits behind; Drive course/archive traversal begun; current Baptist Chapter 1 salvage PR #2142 exists | every unique research family and relevant Drive source has disposition, source tier, claim/page mapping and rights boundary |
| 5B | Baptists chapter/media publication | **OPEN** | many chapter dossiers exist but are not uniformly BOOK-READY; authentic-media branch still contains unique ledger/assets | fresh current-main chapter slices, claim ledger, media provenance/rights/hash, content/browser proof |
| 6 | Biblical maps | **OPEN** | production: **1 open / 9 on audit / 0 drafts on showcase**; three stale MapEngine families retain unique code | every audit map explicitly PUBLISHED or RETIRED after data, mobile/desktop, labels, controls, a11y/perf and owner visual review |
| 7 | Bible corpus / rights / external integrations | **PARTIAL / BLOCKED_EXTERNAL** | #1944 obsolete Cloudflare dependency is closed; #1753 and #1812 retain exact provider/legal boundaries | actionable engineering debt zero; unresolved provider/human/legal items explicitly BLOCKED_EXTERNAL, never inferred as permission |
| 8 | Measurement quality + dependencies + repository retirement | **OPEN** | measurement-first queue remains; Dependabot #2138 is 1 ahead / 22 behind; **203 branches total / 202 non-main** at latest count | measure before budgets; reverify dependency reachability; classify every remaining branch MERGED/SUPERSEDED/SALVAGED/REJECTED before deletion; final source/CI/live/AuditRepo recheck |

## Wave 4 — evidence-first genealogy batches

The safe #2137 intentionally rejected bulk automatic name certification. Exact CI triage on its final head reports:

| RU review tier | Pending |
|---|---:|
| A — strong verse pattern | 67 |
| B — very-high-confidence candidate | 507 |
| C — high-confidence candidate | 22 |
| D — medium candidate | 811 |
| E — low candidate | 803 |
| F — transliteration/manual | 615 |
| **Total** | **2825** |

All remain `autoApprove=false`. A/B are prioritization aids, not automatic evidence.

Pending relation evidence: **139**:
- 59 with Gospel textual context;
- 59 curated explicit-parent candidates;
- 12 child-index evidence candidates;
- 9 reciprocal spouse candidates.

Recommended bounded editorial sequence remains: messianic spine → Matthew → Luke → patriarchs → Judah/David → Levites → tribes → women → nations → remaining source batches. Each batch must reduce measured debt without weakening admission.

## Wave 5 — Baptist salvage boundary

Do **not** merge ancient `book/*` or `reconcile/*` branches as wholes. Their useful content is research evidence, not a current codebase.

Fresh examples from the 2026-09-24 sweep:
- `book/ch06-kargel-source-to-claim`: 10 ahead / ~644 behind;
- `book/ch07-mazaev-prokhanov-research`: 18 ahead / ~644 behind;
- chapters 8–16 and 20 likewise retain narrow research dossiers while hundreds behind;
- `book/ch17-vsehb-1945-1959-research`: 0 ahead — absorbed candidate;
- `feat/baptist-authentic-media-composition-20260912`: 2 ahead / ~189 behind, with unique media ledger/assets;
- #2142 is a current narrow Chapter-1 authority-reconciliation salvage and must remain research-only until its own publication gates are satisfied.

Google Drive is a **source reservoir**, not automatic authority. Folder traversal found the `НББС/СПБХУ` course/session archive and historically useful pastor-course material. Seminary notes and later works (for example A. Gurtayev’s 2014 book) are contextual/bibliographic leads unless they independently qualify as the required source type. Historical claims should still resolve to primary or strong scholarly evidence and exact page/object provenance.

## Wave 6 — maps boundary

Live `/karty/` truth on 2026-09-24 remains:
- 1 published/open map;
- 9 maps on audit;
- 0 drafts shown as finished.

Stale MapEngine branches remain forensic inputs, not merge candidates:
- `fix/map-engine-capability-runtime-v1`;
- `refactor/map-engine-route-bootstrap`;
- `refactor/map-engine-shared-bootstrap-v2`.

Reverify each idea against current main and reimplement only what is still necessary.

## Wave 7 — external-gate semantics

`BLOCKED_EXTERNAL` is a valid terminal engineering disposition when code is already fail-closed and the missing fact is a provider/rights/human decision.

Current examples:
- #1753 — exact Bible edition/provider/rights boundaries;
- #1812 — future TMSJ translations only; the existing Chou translation is already cleared/implemented;
- #1944 — **closed as superseded/not-planned** because direct GitHub Pages is the selected release control plane.

Silence is not permission; API access is not redistribution permission; one edition/article grant is not a blanket grant.

## Wave 8 — retirement rule

A branch with unique commits is never deleted merely for age.

Every non-main branch must end in one of:
1. **MERGED** — content demonstrably represented in main;
2. **SUPERSEDED** — newer implementation/evidence is authoritative;
3. **SALVAGED** — useful content moved through a fresh current-main lane with receipt;
4. **REJECTED / ARCHIVED** — explicitly reviewed and intentionally not retained.

Known easy retirement candidates after a final compare include Journal foundation/production-promotion branches with `ahead=0`. `lane/journal-editorial-architecture` still retains two unique research documents and must be salvaged or explicitly archived first.

## Terminal project definition

The project is only “under zero” in the broad owner sense when all of the following hold simultaneously:

- MASTER active work units = 0;
- Waves 4–6 and 8 are CLOSED;
- Wave 7 has actionable engineering debt = 0 and any remaining external items are explicitly BLOCKED_EXTERNAL;
- open Product PRs are zero or deliberately external/automated with recorded disposition;
- branch retirement sweep is complete;
- current Product main has terminal required CI;
- live `deployments/current.json.releaseSha` equals the intended release main SHA;
- final AuditRepo recheck contains no stale completion claim.
