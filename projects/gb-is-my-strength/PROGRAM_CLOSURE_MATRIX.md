# PROGRAM CLOSURE MATRIX — gb-is-my-strength

> Program-level completion roadmap. This is deliberately separate from `verified/MASTER_BUG_MATRIX.md`.
>
> **MASTER=0 is not project-complete.** MASTER answers “what confirmed defect/system/decision work is currently admitted?”. This file answers “what product, editorial, research, publication and retirement programs remain before the owner can truthfully call the project complete?”.

Reverified 2026-09-24 after Product release `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`.

**2026-09-29 incompleteness re-measure (arena-incompleteness-auditor).** Product `main` is still
`d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`, so no wave changed state because of a release. Waves 5B
and 6 were re-measured against source/artifact and live surface; Wave 8's Dependabot reference was
found stale. Wave 4 genealogy counts were **not** re-measured: 2825 / 139 remain carried forward.
A follow-up on 2026-09-30 used authenticated GitHub API to re-measure Wave 8: **205 branches total / 204 non-main**; targeted branch compares below. The earlier 203 / 202 was the 2026-09-24 count, not current. Evidence:
`incoming/arena-incompleteness-auditor/2026-09-29/REPORT.md`.

## Program state

| Wave | Program | State | Current measured boundary | Exit |
|---|---|---|---|---|
| 0 | Audit truth / control ledger | **VERIFIED_CLOSED** | MASTER reconciled after the release/Reader/genealogy closure chain; program work split out here | MASTER arithmetic and program matrix agree with current Product/live state |
| 1 | Release control plane + genealogy WebKit | **VERIFIED_CLOSED** | #2139/#2141 repair chain; resulting-main full Chromium/WebKit/Firefox and reduced-motion gates PASS | no weakened assertion; immutable release proof survives resulting-main |
| 2 | Production recovery + Reader | **VERIFIED_CLOSED** | #2140 and #2136 merged; production released exact `d9cbcdb...`, then Reader `335ff0c3...` | live releaseSha equality + Reader live proof |
| 3 | Genealogy engineering / safe editorial integration | **VERIFIED_CLOSED** | corrected #2137 merged as `d0e04a9c...`; candidate and promotion run `35927303479` PASS | exact build/projection/browser/live proof |
| 4 | Genealogy editorial corpus | **OPEN** | raw 3056 persons / 2053 edges / 982 isolated; RU review **2825**; publishable relation evidence **42 reviewed / 139 pending** | source-backed manual certification in deterministic batches; raw corpus remains fail-closed until Phase-1 exit criteria |
| 5A | Baptists Git + Drive source inventory | **IN_PROGRESS** | stale chapter research families remain hundreds of commits behind; Drive course/archive traversal begun; current Baptist Chapter 1 salvage PR #2142 exists | every unique research family and relevant Drive source has disposition, source tier, claim/page mapping and rights boundary |
| 5B | Baptists chapter/media publication | **OPEN** | measured 2026-09-29: **10** content files (`section: "baptisty-rossii"`) = 9 articles + 1 reference; live book index shows 4 главы / 9 статей / 1 форзац against a stated **17–20 article** target, and Глава V (эмиграция, диаспора, возврат архивов, после 1991) is explicitly not created. `data/baptisty-rossii-expansion-roadmap.json` declares a **20-chapter architecture with all 20 `status: "planned"`**, representing a **future five-part architecture** distinct from the current nine published articles; `scripts/baptisty-roadmap-audit.js` requires future chapters to stay `planned` until a dedicated publication lane promotes them. The book remains incomplete, but `planned` is not itself a status defect. Many chapter dossiers exist but are not uniformly BOOK-READY; the former authentic-media branch was deleted after cleanup; 33 media-related file blobs on its recorded head match current main exactly (content/rights readiness remains a separate gate) | fresh current-main chapter slices, claim ledger, media provenance/rights/hash, content/browser proof |
| 6 | Biblical maps | **OPEN** | production: **1 open / 9 on audit / 0 drafts on showcase** — re-measured live on `/karty/` 2026-09-29, unchanged since 2026-09-24, so nine maps remain suspended in audit; three stale MapEngine families retain unique code | every audit map explicitly PUBLISHED or RETIRED after data, mobile/desktop, labels, controls, a11y/perf and owner visual review |
| 7 | Bible corpus / rights / external integrations | **PARTIAL / BLOCKED_EXTERNAL** | #1944 obsolete Cloudflare dependency is closed; #1753 and #1812 retain exact provider/legal boundaries | actionable engineering debt zero; unresolved provider/human/legal items explicitly BLOCKED_EXTERNAL, never inferred as permission |
| 8 | Measurement quality + dependencies + repository retirement | **OPEN** | measurement-first queue remains; the 2026-09-24 Dependabot **#2138** reference is **stale** — #2138 is no longer open and the current Dependabot PR is **#2144** (2026-09-28), so the ahead/behind figures below are unverified; **205 branches total / 204 non-main**, re-measured 2026-09-30; full 204-ref compare inventory: **35 behind-only / 166 diverged / 3 ahead-only**; no branch disposition or deletion yet | measure before budgets; reverify dependency reachability; classify every remaining branch MERGED/SUPERSEDED/SALVAGED/REJECTED before deletion; final source/CI/live/AuditRepo recheck |

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

**64-file corpus control (same Product main; Research `d418894a...`):** 128 per-file shell assertions and 192 route/index cross-checks confirmed 64 published MDX routes with page ownership and route sources; the single search-manifest omission remains the already-admitted Lawson catalog row. Research `STEVE_LAWSON/CURRENT.md` supersedes the dated V4 queue: V6 publication-ready-with-guardrails, external archive acquisition active but not an automatic publication blocker. Details: `incoming/arena-incompleteness-auditor/2026-09-30/CORPUS_AND_LAWSON_RECHECK.md`.

**Later 2026-09-30 Product recheck:** Product main advanced to `5e76c6ec81f3c192510c70e49a3deba64fb676c2` with a published Steven Lawson MDX route; `/articles/` source still projects only the legacy manifest and omits this route. This specific new catalog discoverability defect is admitted in MASTER as `GBS-ARTICLES-CATALOG-STRICT-NATIVE-OMISSION`, with unmerged Product #2150 already owning the proposed repair. Older corpus counts and the previous "only series-catalog defect" wording below apply to the explicitly dated `d0e04a9c...` snapshot, not the advanced main. Details: `incoming/arena-incompleteness-auditor/2026-09-30/CONTENT_CATALOG_RECHECK.md`.

## Published series versus unfinished content (2026-09-30)

Do not infer content debt from an old plan alone. Product main at `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b` reports all registered parts of Nagornaya (5), Gill (6), pastor core (9), teen series (7) and Genesis 6 (6) as `published`; every listed part has a `production-dist` page-ownership entry. The heart-book config has 24 MDX members (`draft: false`) and its canonical current 4/22/2 structure; the old “6 live / 18 draft” roadmap is explicitly **superseded**, not current completion debt. This is source/ownership proof only, not an independent live browser recheck or certification of every article claim.

| Content lane | Published authority | Incomplete work / explicit boundary | Next admissible decision |
|---|---|---|---|
| Baptists current book | 4 chapters, 9 articles + 1 reference; 229 min. `docs/BAPTISTY-ROSSII-EDITORIAL-ARCHITECTURE.md` §§2–3. | Chapter II is overloaded (seven *candidate* split/research slices: Petersburg people, Mazaev/Prokhanov, print republic, 1917–21, relief 1921–24, College Fund/school, conscience); III has five candidate split/research slices (enemy narrative, 1929 law, Terror, war pivot, 1944); IV has four candidate slices (1960 documents, prisoners/families, periodicals, underground print). The numbered slices are **not** counts of missing URLs; they overlap published cores and have different evidence readiness. | Admit a new route only for an independent question with source-to-claim matrix, page/object provenance and rights; don't split a published monolith solely to meet a target count. |
| Baptists future book | `docs/BAPTISTY-ROSSII-BOOK-AUTHORITY-V2.md`: 5 future parts / 20 future chapters; all `planned` deliberately. | Chapter V diaspora/archives/post-1991 intentionally deferred; missing physical sources and media rights block unconditional publication. **Do not** subtract current 9 articles from the future 20-chapter architecture. | Source retrieval, claim and media bridge, explicit publication decision; no empty chapter routes. |
| Journal | `/journal/` and `/journal/dossiers/g3/` are `production-dist` on this SHA. | A 2026-09-09 research note still says `NO_PUBLIC_ROUTE`, but predates these two routes. Its proposed IA (`news`, `documents`, etc.) is not automatically a six-route release promise. | Owner confirms whether any further journalism category is a current mandatory program before creating a wave or a route. |
| Other named series | Nagornaya 5/5; Gill 6/6; pastor core 9/9; teen 7/7; Genesis 6 6/6 registered published parts; heart book 24 MDX members and canonical book config. | No source-backed missing *registered* part was found in this pass. A published part may still have separate MASTER quality defects; “registered” is not proof of editorial perfection. | Do not invent uncompleted chapters from stale research documents. |

Detailed slice/source ledger and negative checks: `incoming/arena-incompleteness-auditor/2026-09-30/REPORT.md`, section “Product-content completion pass”.

## Research and public Drive cross-check (2026-09-30)

Research `main` `0d4d897fe1180f791b433dce1c61b306efaec51e` was read against Product `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`. In `TEEN_DOUBLE_LIFE`, the historical handoff still calls the seven core/adult pieces draft lanes, but Product's current publication contract and routes show 7/7 published. Research `188` specialized companions are an **owner-selection pool**, not automatically owed new articles; its `299` late-lane audit recommends Product compression and preflight, not limitless new modules. Current Companion A already contains the guarded Israel analogy, blocked-contact and modern-economy questions required by Research `303`. No missing core part was admitted from this cross-check.

For «Бытие 6 / Енох / ангелы», Product pins an exact Research authority bundle and records six published routes plus later site acceptance; earlier Research Article-8 and 6A/6B `HOLD` decisions must not be mistaken for current publication state without applying their supersession/acceptance chain. This cross-check **does not certify all theological claims**: a claim-level Research-main-to-pinned-delta and live article reading would be separate work. Evidence: `incoming/arena-incompleteness-auditor/2026-09-30/REPORT.md` (“Cross-repo content evidence”).

A public Drive appendix object `https://drive.google.com/file/d/1bx53uaNT1X0pOTZXIlZNNmOJarjE1U8j/view` was accessible to an unauthenticated page fetch (455 MB 7z, virus-scan warning). **Neither archive bytes nor pages were downloaded/reverified**. The old Denis Samarin intermediary URL recorded in Product's source ledger currently yields 404, while the direct Drive link remains reachable; recheck a replacement source-ledger URL before changing citations. This is not a verified live-reader broken link. The full private Drive MASTER was not accessible; no assertion about its completeness follows.

## Research-only series versus unmerged publication collision (2026-09-30)

| Proposed material | Research status (Research main `0d4d897fe1180f791b433dce1c61b306efaec51e`) | Product witness | Required disposition |
|---|---|---|---|
| «Отступничество и стойкость веры» | `apostasy/25_PUBLICATION_READINESS_AND_CLAIM_LEDGER_2026-09-30.md`: `PUBLICATION_HOLD`; no item is `PUBLICATION-CANDIDATE`. `apostasy/14_PRODUCT_SERIES_BLUEPRINT_V2_2026-09-30.md` proposes a hub + 6 separate pieces + conditional Jude and explicitly says `DO NOT IMPLEMENT`. | Product `main` has no article yet, but open **#2145** at `994b8735...` proposes one 319-line MDX combining Judas/Hebrews/whole Bible with `draft: false`, `noindex: false`, `series: "hard-texts"` (currently the heart-book key), `related: []`. Four PR checks are failing; failure mechanisms not extracted. | **Active other-agent lane (owner confirmed 2026-09-30).** PR #2145 snapshot conflicts with the later Research publication hold and heart-book series key, but this audit does not own, edit, close or merge it. Hand off the exact evidence to the working agent; re-fetch PR/Research heads and checks at release decision. Covered by existing MASTER owner-decision row, not a competing defect. |
| «1 Коринфянам 11:2–16» | `СЕРИЯ 1 КОРИНФЯНАМ 11/00_README_AND_MASTER_AUTHORITY_INDEX.md`: `RESEARCH-ONLY / NOT-FOR-PUSH / HOLD`, interpretive questions not settled. | No matching published Product route found by targeted route scan. | Preserve the explicit research-only status; absence from Product is **intentional**, not a missing published chapter. |
| «Роль женщины в церкви» | `СЕРИЯ ЖЕНЩИНЫ В СЛУЖЕНИИ/00_MASTER_INDEX_AND_SERIES_STRUCTURE.md`: 5-part foundation, `DEFERRED-GOAL / RESEARCH-ONLY / PUBLICATION_HOLD`, pending completion of 1 Cor 11 or owner decision. | No matching published Product series route found by targeted route scan. | Future owner-selection pool, not five empty routes to generate. |

Exact file/head/check witnesses and claim limits: `incoming/arena-incompleteness-auditor/2026-09-30/REPORT.md`, “Additional Research-series scope”.

### External source access and acquisition stage (dated authority, not a fresh Drive census)

The public Google Sheets [Baptists MASTER Dashboard](https://docs.google.com/spreadsheets/d/1y9d_7bWAEsz8iYdMuRrtb6onDYEXLQx5PgT95oYNsSM/edit) was anonymously readable on 2026-09-30. Its displayed status rows are from the **2026-07-30/31** audit and agree with the **2026-08-02** Research archive authority, *not* a fresh physical sweep: «Слово истины» 1918 had 3/8 physical objects (five named unacquired); «Братский листок» had 22/60 locally present with eight content-unknown positions; the photo archive included 786 uncaptained entries and a PDF download queue of 390. These are **archive/acquisition denominators, not 390 missing Product citations or publication-ready images**. The Research authority forbids primary-source quotation from two identified modern derivative transcriptions. The public Sinichkin file-ID link and the Drive snapshot folder each redirect to Google sign-in when fetched anonymously, while the public Valkewich 455 MB appendix landing does not. A Google Sheet that opens is not proof that every underlying file opens. Next: retrieve current authority rows with permitted access or a public export; verify binary/locator/rights per planned book slice, without requesting credentials. Details: `incoming/arena-incompleteness-auditor/2026-09-30/REPORT.md`.

## Wave 5 — Baptist salvage boundary

Do **not** merge ancient `book/*` or `reconcile/*` branches as wholes. Their useful content is research evidence, not a current codebase.

Fresh examples from the 2026-09-24 sweep (selected 2026-09-30 compares below):
- `book/ch06-kargel-source-to-claim`: 10 ahead / ~644 behind;
- `book/ch07-mazaev-prokhanov-research`: 18 ahead / ~644 behind;
- chapters 8–16 and 20 likewise retain narrow research dossiers while hundreds behind;
- `book/ch17-vsehb-1945-1959-research`: **0 ahead / 639 behind** on 2026-09-30 — absorbed candidate, still needs an explicit retirement receipt;
- `book/ch07-mazaev-prokhanov-research-v2`: **2 ahead / 1021 behind** on 2026-09-30 — additional chapter 7 branch absent from the 2026-09-24 examples; disposition needed;
- `feat/baptist-authentic-media-composition-20260912`: **historical pre-cleanup** 2 ahead / ~189 behind; the ref is now deleted. Its recorded head `320866f994f4...` has 33 media-related file blobs (`media-ledger`, research/raw images, historical images, media audit scripts) identical to Product main `5e76c6ec...`; do not request their salvage again. This blob check does **not** certify media rights or all branch files. Evidence: `incoming/arena-incompleteness-auditor/2026-09-30/MEDIA_BRANCH_RECHECK.md`.
- #2142 is a current narrow Chapter-1 authority-reconciliation salvage and must remain research-only until its own publication gates are satisfied.

Google Drive is a **source reservoir**, not automatic authority. Folder traversal found the `НББС/СПБХУ` course/session archive and historically useful pastor-course material. Seminary notes and later works (for example A. Gurtayev’s 2014 book) are contextual/bibliographic leads unless they independently qualify as the required source type. Historical claims should still resolve to primary or strong scholarly evidence and exact page/object provenance.

## Wave 6 — maps boundary

Live `/karty/` truth re-measured 2026-09-29:
- 1 published/open map;
- 9 maps on audit;
- 0 drafts shown as finished.

Stale MapEngine branches remain forensic inputs, not merge candidates:
- `fix/map-engine-capability-runtime-v1`;
- `refactor/map-engine-route-bootstrap`;
- `refactor/map-engine-shared-bootstrap-v2`.

Fresh 2026-09-30 compares: `fix/map-engine-capability-runtime-v1` **3 ahead / 126 behind**; `refactor/map-engine-route-bootstrap` **27 ahead / 165 behind**; `refactor/map-engine-shared-bootstrap-v2` **11 ahead / 132 behind**. Reverify each idea against current main and reimplement only what is still necessary.

**Research→Product false-positive control:** the August Research Atlas authority lists Pihahiroth uncertainty-corridor implementation as open, but Product main at `d0e04a9c...` already has the three-corridor `karty/ishod/pihahiroth-authority.json` and `IshodMap.astro` projection. Do not file the absence of uncertainty polygons from that stale Research sentence. Ishod still requires the separate map visual/publication gates; no live/browser result is inferred from code presence.

## Wave 7 — external-gate semantics

**2026-09-30 current-source corpus census:** the 66-book *registry* has 42 local book files and 300 sparse keyed records, but Product's rights/publication resolver admits **0/300**; the search index has 1,216 references, 148 canonical text fields, **0 approved**. The Scripture route projection explicitly checks eligibility, so raw local text must not be treated as publishable Bible tooltips or a complete licensed 66-book corpus. Research's CrossWire `RusSynodal` 1.9.1 is an acquisition candidate, not an approved Product import; #1753's free-only/per-edition/provider gates still control. This is a quantified intentionally held capability, not a newly found bypass. Evidence: `incoming/arena-incompleteness-auditor/2026-09-30/BIBLE_CORPUS_AND_G3_CLAIM_RECHECK.md`.


`BLOCKED_EXTERNAL` is a valid terminal engineering disposition when code is already fail-closed and the missing fact is a provider/rights/human decision.

Current examples:
- #1753 — exact Bible edition/provider/rights boundaries;
- #1812 — future TMSJ translations only; the existing Chou translation is already cleared/implemented;
- #1944 — **closed as superseded/not-planned** because direct GitHub Pages is the selected release control plane.

Silence is not permission; API access is not redistribution permission; one edition/article grant is not a blanket grant.

## Wave 8 — retirement rule

**2026-09-30 later lifecycle recheck (after the 205-ref census):** GitHub's paginated branches endpoint now lists **44 total / 43 non-main**; Product `main` is still `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`. Open PR #2146 (`92a90a84732f25826bdcd0843a5799521dacfd7b`) reports **162 remote refs deleted outside the PR**, with a proposed 162-ref disposition register and four recovery units on its *unmerged* head. The previous 205/204 census and 204-ref compare below are historical pre-cleanup snapshots, **not the current remaining-branch backlog**. The 44 observed count includes the newly created #2146 head; its claimed 162 deletion classes have not been independently checked against the historical SHA register in this pass. Do not mark Wave 8 closed: review register/recovery content, retain the still-live refs by disposition, pass exact-head gates, merge or explicitly close #2146, then remeasure branches and Product main. See `incoming/arena-incompleteness-auditor/2026-09-30/BRANCH_LIFECYCLE_RECHECK.md`.


The 2026-09-30 full read-only branch compare is recorded in `incoming/arena-incompleteness-auditor/2026-09-30/REPORT.md` and its `evidence/branch-compare-main-2026-09-30.csv`: 35 behind-only, 166 diverged, 3 ahead-only; 0 API failures. **This is measurement, not classification or authorization to delete.** The 35 zero-ahead refs need explicit retirement dispositions, and the 166 diverged refs need unique-content review.

A branch with unique commits is never deleted merely for age.

Every non-main branch must end in one of:
1. **MERGED** — content demonstrably represented in main;
2. **SUPERSEDED** — newer implementation/evidence is authoritative;
3. **SALVAGED** — useful content moved through a fresh current-main lane with receipt;
4. **REJECTED / ARCHIVED** — explicitly reviewed and intentionally not retained.

Known easy retirement candidates after a final compare include Journal foundation/production-promotion branches with `ahead=0`. `lane/journal-editorial-architecture-20260907` (the actual current ref; the old unsuffixed name returns 404) is **2 ahead / 921 behind** as of 2026-09-30 and retains two unique research documents and must be salvaged or explicitly archived first.

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
