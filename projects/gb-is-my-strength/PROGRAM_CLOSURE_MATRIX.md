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

**2026-09-30 later pass (release block measured).** Product `main` advanced to
`d586aa63f02b569cfe050a63cc9078c044375d8d`, but **production did not**: live
`deployments/current.json.releaseSha` is still `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`
(run `35927303479`) and every main push since the PR #2148 merge (`23bd8567`, 2026-09-30T11:00:41Z)
fails `Deploy to GitHub Pages` at the step `Static publication source gates`. Locally reproduced on
`d586aa63`: `validate:static-publication` has **41** top-level `&&` commands (counting rule: split the
script string, do not expand nested `npm run` calls; `package.json` blob
`812497795d8a3c5c7a2beb6224b2f9492354dfdf`). Run one by one, **40 exit 0** and only command **#24**,
`node scripts/audit-pro.js`, fails, with the single error `sitemap contract: missing canonical indexable production route:
/articles/steven-lawson-samoobman-i-publichnyy-golos/` — a strict-native route registered as
`production-dist` but absent from `data/route-search-policy.json`, `data/search-manifest.json`,
`sitemap.xml` and `feed.xml`. The sanctioned normalizer writers report "no changes required"
(empty diff), so the release cannot be unblocked by the machine path; a Product-owner decision
(register the route in the canonical discovery surfaces or withdraw its production registration) is
required. This is tracked in MASTER as `SYS-STRICT-NATIVE-PUBLICATION-COMPLETION`. Consequences for
this matrix: the Lawson/Chapter-1 publication lane (#2148, #2150) is not live, Baptist date/byline
repairs merged into `main` are not shipped, and two terminal conditions below are currently
**false**. Evidence: `reverify/2026-09-30-release-block-and-baptist-provenance.md`.

**2026-09-30 Baptist provenance correction.** The `????` visible-copy loss in nine published
Baptist article bodies entered already corrupted in `059b3024` (PR #2028, 2026-09-13), is
byte-identical on `main` and on the live release `d0e04a9c`, is rendered on live
`/baptisty-rossii/spravochnik/`, and has no approved original in the repository — Wave 5B must
carry it as an editorial recovery (owner-approved text), not as an encoding fix. The visible
Spravochnik «14 июня 2026» is a page-authored publication date (commit `b051fd76`, 2026-06-14,
with dossier `13-reference-article-transfer-2026-06-14.md`), not a registry value; the choice
between it and the registry/JSON-LD `2026-06-10` is an owner decision.

## Program state

| Wave | Program | State | Current measured boundary | Exit |
|---|---|---|---|---|
| 0 | Audit truth / control ledger | **VERIFIED_CLOSED** | MASTER reconciled after the release/Reader/genealogy closure chain; program work split out here | MASTER arithmetic and program matrix agree with current Product/live state |
| 1 | Release control plane + genealogy WebKit | **VERIFIED_CLOSED** | #2139/#2141 repair chain; resulting-main full Chromium/WebKit/Firefox and reduced-motion gates PASS | no weakened assertion; immutable release proof survives resulting-main |
| 2 | Production recovery + Reader | **VERIFIED_CLOSED** | #2140 and #2136 merged; production released exact `d9cbcdb...`, then Reader `335ff0c3...` | live releaseSha equality + Reader live proof |
| 3 | Genealogy engineering / safe editorial integration | **VERIFIED_CLOSED** | corrected #2137 merged as `d0e04a9c...`; candidate and promotion run `35927303479` PASS | exact build/projection/browser/live proof |
| 4 | Genealogy editorial corpus | **OPEN** | re-derived at `d586aa63` on 2026-09-30 (receipt `reverify/evidence/2026-09-30-program-currency-remeasure.txt`): raw layer 3056 persons / 2053 edges (parent 1908, spouse 144, ancestor 1) / 982 isolated, `ruNamed` 3056 (100 %), RU review queue **2825** (override 32 / seed 147 / structural 52 / pattern 67 / candidate 2143 / translit 615), clusters 14, nations 76, mirrorMisses 0, pipeline `0.3.0-phase1-explicit-gospels`, raw status **`phase1-draft — НЕ подключать в рантайм до exit-критериев Phase 1`**; publishable layer is a **closed curated subset** (`curated-subset-release-candidate`, 154 of 3056 persons, `completeness: partial-by-design`) with 181 relations (parent 171, spouse 9, legal 1) and relation evidence **42 reviewed / 139 pending** (provenanceClass 139 curated / 41 direct-scripture / 1 editorial), 42 editorial edge annotations, 116 textual assertions (114 matched to relations); rights: derived dataset **CC BY 4.0** with attribution to STEPBible.org / Tyndale House Cambridge, Russian text Synodal (public domain), chronology/disputed nodes/significance are project editorial | source-backed manual certification in deterministic batches; raw corpus remains fail-closed until Phase-1 exit criteria |
| 5A | Baptists Git + Drive source inventory | **IN_PROGRESS** | stale chapter research families remain hundreds of commits behind; Drive course/archive traversal begun; current Baptist Chapter 1 salvage PR #2142 exists | every unique research family and relevant Drive source has disposition, source tier, claim/page mapping and rights boundary |
| 5B | Baptists chapter/media publication | **OPEN** | measured 2026-09-29: **10** content files (`section: "baptisty-rossii"`) = 9 articles + 1 reference; live book index shows 4 главы / 9 статей / 1 форзац against a stated **17–20 article** target, and Глава V (эмиграция, диаспора, возврат архивов, после 1991) is explicitly not created. `data/baptisty-rossii-expansion-roadmap.json` declares a **20-chapter architecture with all 20 `status: "planned"`**, representing a **future five-part architecture** distinct from the current nine published articles; `scripts/baptisty-roadmap-audit.js` requires future chapters to stay `planned` until a dedicated publication lane promotes them. The book remains incomplete, but `planned` is not itself a status defect. Many chapter dossiers exist but are not uniformly BOOK-READY; the former authentic-media branch was deleted after cleanup; 33 media-related file blobs on its recorded head match current main exactly (content/rights readiness remains a separate gate); the merged Lawson publication (#2148) and its catalog follow-up (#2150, unmerged) are **not live** because the release path is blocked, and the nine bodies' `????` copy loss is live-rendered with no in-repo approved original. **2026-09-30 third pass (artifact-level):** production-like builds of Product main `d586aa63` **and** of the live release SHA `d0e04a9c` give byte-identical damaged counts per route (built pages: Spravochnik 506, Podpolnaya 471, Iniciativnaya 314, Peterburgskaya 239, Goneniya 183, Yuzhnaya 135, Noch 124, Vsehib 105, DvaSezda 91; hub and `sovetskaya-noch` 0), and live `/baptisty-rossii/spravochnik/` still renders the damaged cards verbatim including inside link text — the loss is not a terminal artifact and is not fixed on either head. Byline dates are narrowed: at main five routes still carry an update-day label in the publication slot while four repaired routes plus `peterburgskaya-liniya` show the correct two-slot shape; at the live SHA all nine article routes still render the single pre-repair label, so the repairs are main-only while the release is blocked. The `spravochnik` label choice («14 июня» authored in `b051fd76` vs registry `publishedAt` 2026-06-10) remains an **owner decision**. **Image rights / primary-source access re-measured at `d586aa63`:** `data/baptisty-rossii-visual-atlas.json` carries **10 diagrams, all `status: production`**, all 10 local SVG assets exist at their `assetPath`, all 10 carry `sourceConfidence` and `sourceFiles`, and the atlas policy forbids remote SVG, external raster inside SVG and AI historical photos while requiring accessibility, source confidence, map sync and mobile-first (max initial viewport 760). All **31 distinct source dossiers** referenced by those diagrams exist under `baptisty-rossii/research/` (161 `.md` files there) — byte-accessible evidence in Product, explicitly **not** public routes and excluded from the dateline-contract workflow paths | fresh current-main chapter slices, claim ledger, media provenance/rights/hash, content/browser proof |
| 6 | Biblical maps | **OPEN** | production: **1 open / 9 on audit / 0 drafts on showcase** — re-measured live on `/karty/` **2026-09-30** (release `d0e04a9c`; only `/karty/avraam/` is published), unchanged since 2026-09-24, so nine maps remain suspended in audit; data readiness at `d586aa63` (`data/atlas-inventory-baseline.json`): 10 maps, 132 places, 47 stages, 52 stories, 18 layers, 91 timeline entries, 23 verified waypoints, 84 scientific variants (59 linked), 153 photos, 223 928 content chars — the 10-in-data vs 1-on-showcase gap is the audit gap, not a defect; three stale MapEngine families retain unique code | every audit map explicitly PUBLISHED or RETIRED after data, mobile/desktop, labels, controls, a11y/perf and owner visual review |
| 7 | Bible corpus / rights / external integrations | **PARTIAL / BLOCKED_EXTERNAL** | #1944 obsolete Cloudflare dependency is closed; #1753 and #1812 retain exact provider/legal boundaries. Separately, the scheduled `Source Link Audit` on `main` is still red (latest: push run `36771339167` at `0adb8c36`, scheduled run `36403875153` at `d0e04a9c`) and remains **unclassified**: local reproduction in this sandbox is inadmissible (435 links → 423 transport warnings + 12 TLS-interception hard errors, all environment artifacts) and job logs/artifacts are unreachable (blob egress denied) | actionable engineering debt zero; unresolved provider/human/legal items explicitly BLOCKED_EXTERNAL, never inferred as permission; the source-link gate still needs one classification run from an egress-capable environment |
| 8 | Measurement quality + dependencies + repository retirement | **OPEN** | measurement-first queue remains; the 2026-09-24 Dependabot **#2138** reference is **stale** — #2138 is no longer open and the current Dependabot PR is **#2144** (2026-09-28), so the ahead/behind figures below are unverified; **37 branches total / 36 non-main**, re-measured 2026-09-30 (third pass; supersedes 205/204, 44/43 and 36/35 recorded earlier the same day — the count moves as cleanup proceeds, so classify against the dated snapshot); full 204-ref compare inventory from the earlier census: **35 behind-only / 166 diverged / 3 ahead-only**; no branch disposition or deletion yet. Open Product PRs at the third-pass sample, each recomputed at its own head: #2153 docs-only `c671491f` (no red, no repair), #2150 Lawson catalog `89e76794` (11 red, 37 behind), #2145 apostasy `994b8735` (4 red, other agent's lane), #2144 Dependabot `892977fd` (20 red), #2143 genealogy draft `acd4ace4` (no red), #2142 Baptist salvage `71a4f529` (no red, research-only) | measure before budgets; reverify dependency reachability; classify every remaining branch MERGED/SUPERSEDED/SALVAGED/REJECTED before deletion; final source/CI/live/AuditRepo recheck |

**2026-09-30 Baptist publication correction:** two *already published* routes attribute the same Delyakov phrase as exact speech while the primary-page locator is not quote-ready. This is an admitted **single two-route MASTER defect** `GBS-BAPTISTS-DELYAKOV-DIRECT-QUOTE-UNVERIFIED`, not a newly missing chapter; unmerged Product #2146 already paraphrases both. Separate Chapter 1 #2142 remains research-only / NOT BOOK-READY: 4/4 sampled canonical/duplicate Drive links redirect to Google sign-in anonymously even though historical acquisition SHA receipts exist. #2146 no longer contains the four redundant editorial-metadata supplements; its own branch-prefix shared-files guard remains red independently of the four date pairs that match base registry. Boundaries and exact SHAs: `incoming/arena-incompleteness-auditor/2026-09-30/BAPTISTS_RECOVERY_MULTILAYER.md`.

**2026-09-30 third pass — measurement corrections and the dateline class disposition.** Four
corrections apply to this program's own numbers, all recomputed from source rather than carried
forward: (1) the release-gate step count is **41 top-level commands** in
`validate:static-publication` at `d586aa63` (`package.json` blob `812497795d8a3c5c7a2beb6224b2f9492354dfdf`),
**40 exit 0 / 1 fails** at command #24 `node scripts/audit-pro.js`; the figure recorded earlier the
same day is withdrawn everywhere it appeared. (2) All 28 active MASTER units were
walked at `d586aa63` — 27 source-anchored units (25 defects + 2 lanes) re-checked by 45 anchor
assertions: 43 verbatim, 2 superseded expressions (`GBS-THEME-TOGGLE-FOCUS-INDICATOR-MISSING`
→ `body.home-page .mobile-controls > button:focus-visible` + `css/mobile-hotfix.css:12`;
`GBS-H-SCROLL-TOP-INVISIBLE-FOCUS` → `(window.scrollY || window.pageYOffset) > 500`), **0 rows closed
and 0 rows newly fixed**. (3) A site-wide dateline candidate (17 routes whose human label and
`datetime` name different days) was investigated and **rejected**: it is the owner-approved
exact-instant reconciliation of 2026-09-08, pinned by
`scripts/editorial-metadata-v3-approval-gate-test.js:102`; it is recorded as a negative boundary so
it is never re-filed. (4) One narrow row survived that rejection and is admitted in MASTER:
`GBS-NAGORNAYA-PUBLISHED-DATELINE-CARRIES-MODIFIED-INSTANT` — five Nagornaya chapters author
`<p class="article-updated …">Опубликовано: <time …>` so the sanctioned projector writes the
approved **modification** instant into a dateline that says "published", contradicting the same
page's JSON-LD `datePublished`; measured on builds of both main and the live SHA. Program-level
boundary for this pass: **no browser ran in that pass** (Playwright's own Chromium download fails with
`ECONNRESET` in this sandbox), and the HTML→text retrieval tool cannot read `<time>` element text — it
surfaces the hidden Pagefind spans instead — so live byline labels are witnessed from exact-SHA builds,
while ordinary live text (the `????` copy loss) is witnessed from the live site directly.
**Superseded on the browser tier — 2026-10-01:** a browser does run in this sandbox. `@sparticuz/chromium`
(the npm tarball ships the headless binary) plus `playwright-core` launch once `libnspr4`/`libnss3`/
`libnssutil3` are built from `mozilla/nspr` and `nss-dev/nss` (ninja/gyp from PyPI), because every apt
mirror and every Playwright browser CDN is blocked here; the recipe and the eleven-section result are in
`reverify/evidence/2026-10-01-fresh-browser-pass-at-anchor.txt`. The live host still has no network route
from the sandbox (`curl https://gb-is-my-strength.ru` → `000`), so this browser tier is exact-SHA local
build, not live-site: the public-page / byte-access / historical-SHA / visual-verification distinctions
above are unchanged, and only the "no browser" half of the boundary is retired. Program currency was also re-derived rather than carried forward: the article corpus is **64** MDX files at main vs **63** at the live SHA (the +1 is the blocked Lawson route), Wave 4 genealogy counts and the 42/139 relation-evidence split were re-read from `data/genealogy/v2/**`, Wave 5B diagram rights and the 31/31 primary-source dossiers were re-checked, and the Wave 6 showcase was re-measured live on 2026-09-30. Receipt: `reverify/evidence/2026-09-30-program-currency-remeasure.txt`. Full analysis:
`reverify/2026-09-30-step-count-correction-and-dateline-projection.md`.

## Wave 4 — evidence-first genealogy batches

**2026-09-30 batch freshness guard:** Product main still measures **2,825** RU names to review and **42 reviewed / 139 pending** relation evidence. Unmerged Product #2143 at old head `acd4ace4...` proposes 11 direct-name reviews and reports **2,814** RU names to review *on its branch*, with **no change** to relation evidence 42/139. Its checks passed on that old head but GitHub reports it BEHIND the now-newer main; a plain branch-versus-current-main diff includes later Lawson/heart-book changes unrelated to the name batch. Integrate only after a current-base resulting-diff and exact-head gate check; do not portray 2,814 as the released backlog or turn the 11 name edits into 11 certified edges. Evidence: `incoming/arena-incompleteness-auditor/2026-09-30/GENEALOGY_BATCH_BOUNDARY.md`.


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

**Historical pre-cleanup examples only** (selected 2026-09-30 compares below; do not treat deleted refs as current salvage work):
- `book/ch06-kargel-source-to-claim`: 10 ahead / ~644 behind;
- `book/ch07-mazaev-prokhanov-research`: 18 ahead / ~644 behind;
- chapters 8–16 and 20 likewise retain narrow research dossiers while hundreds behind;
- `book/ch17-vsehb-1945-1959-research`: **0 ahead / 639 behind** on 2026-09-30 — absorbed candidate, still needs an explicit retirement receipt;
- `book/ch07-mazaev-prokhanov-research-v2`: still **live**, now **2 ahead / 1051 behind** against main `5e76c6ec...`; two unique branch-only 292/403-line research dossiers, not BOOK-READY, need content/object-ID reconciliation with current main `94-`/`95-` dossiers and explicit disposition;
- `feat/baptist-authentic-media-composition-20260912`: **historical pre-cleanup** 2 ahead / ~189 behind; the ref is now deleted. Its recorded head `320866f994f4...` has 33 media-related file blobs (`media-ledger`, research/raw images, historical images, media audit scripts) identical to Product main `5e76c6ec...`; do not request their salvage again. This blob check does **not** certify media rights or all branch files. Evidence: `incoming/arena-incompleteness-auditor/2026-09-30/MEDIA_BRANCH_RECHECK.md`.
- #2142 is a current narrow Chapter-1 authority-reconciliation salvage and must remain research-only until its own publication gates are satisfied.

**Deleted-head content negative control (2026-09-30):** the `book/ch06-...` and original `book/ch07-...` refs above were deleted outside the still-unmerged #2146; on their recorded heads, 160/161 and 155/156 `baptisty-rossii/research/` file blobs respectively already match current main. The sole changed research path in each is a media ledger that evolved on main. This narrow check prevents double-salvage of those research files, not wholesale approval of every deleted branch. The retained `-v2` branch remains separate. See `incoming/arena-incompleteness-auditor/2026-09-30/DELETED_BOOK_BRANCHES_AND_RETAINED_CH07.md`.

Google Drive is a **source reservoir**, not automatic authority. Folder traversal found the `НББС/СПБХУ` course/session archive and historically useful pastor-course material. Seminary notes and later works (for example A. Gurtayev’s 2014 book) are contextual/bibliographic leads unless they independently qualify as the required source type. Historical claims should still resolve to primary or strong scholarly evidence and exact page/object provenance.

## Wave 6 — maps boundary

**2026-09-30 source-classified roster (11 route records, not just the hub counter):** `avraam` is `ready + featured`; `ishod` is `ready + withheld` (**already indexable/sitemap/Pagefind and a `production-dist` route**, but off the curated map hub); eight other routes are `temporary-placeholder + withheld`; `nachalo` is `draft + withheld` and awaits its G9 owner. Hence the hub's 1 open / 9 on audit / 0 drafts on showcase must not be paraphrased as “only one indexable map” or “nine maps are all noindex”: it counts showcase exposure, not the separate publication flag. Preserve the intentional two-axis status, audit the eight holding routes and the draft, and obtain explicit visual/owner review before *showcase* promotion. See `incoming/arena-incompleteness-auditor/2026-09-30/MAPS_TWO_AXIS_PUBLICATION_RECHECK.md`.


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

**2026-09-30 third-pass branch census (current):** the paginated branches endpoint returns
**37 total / 36 non-main** at Product main `d586aa63f02b569cfe050a63cc9078c044375d8d`; six of them
are open PR heads (#2153, #2150, #2145, #2144, #2143, #2142) and four are Lawson-active
(`fix/lawson-premium-polish-20260930`, `publication/lawson-release-hardening-20260930`,
`publication/steven-lawson-final-20260930`, plus its `tmp-…-fixup` twin). Machine receipt:
`reverify/evidence/2026-09-30-branch-census.txt`. The Lawson release decision is under
owner-directed stand-down in this pass, so those branches are counted, not classified or retired.

**2026-09-30 latest branch-count measurement (later the same day):** paginated branches endpoint
returns **36 total / 35 non-main** (five of them are open PR heads: #2150, #2145, #2144, #2143,
#2142). This number keeps moving as cleanup proceeds; classify against the dated snapshot, never
against the prose count itself.

**2026-09-30 later lifecycle recheck (after the 205-ref census):** GitHub's paginated branches endpoint now lists **44 total / 43 non-main**; Product `main` is still `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`. Open PR #2146 (`92a90a84732f25826bdcd0843a5799521dacfd7b`) reports **162 remote refs deleted outside the PR**, with a proposed 162-ref disposition register and four recovery units on its *unmerged* head. The previous 205/204 census and 204-ref compare below are historical pre-cleanup snapshots, **not the current remaining-branch backlog**. The 44 observed count includes the newly created #2146 head; its claimed 162 deletion classes have not been independently checked against the historical SHA register in this pass. Do not mark Wave 8 closed: review register/recovery content, retain the still-live refs by disposition, pass exact-head gates, merge or explicitly close #2146, then remeasure branches and Product main. See `incoming/arena-incompleteness-auditor/2026-09-30/BRANCH_LIFECYCLE_RECHECK.md`.


The 2026-09-30 full read-only branch compare is recorded in `incoming/arena-incompleteness-auditor/2026-09-30/REPORT.md` and its `evidence/branch-compare-main-2026-09-30.csv`: 35 behind-only, 166 diverged, 3 ahead-only; 0 API failures. **This is measurement, not classification or authorization to delete.** The 35 zero-ahead refs need explicit retirement dispositions, and the 166 diverged refs need unique-content review.

A branch with unique commits is never deleted merely for age.

Every non-main branch must end in one of:
1. **MERGED** — content demonstrably represented in main;
2. **SUPERSEDED** — newer implementation/evidence is authoritative;
3. **SALVAGED** — useful content moved through a fresh current-main lane with receipt;
4. **REJECTED / ARCHIVED** — explicitly reviewed and intentionally not retained.

**Post-cleanup correction (later 2026-09-30):** the old Journal foundation refs and `lane/journal-editorial-architecture-20260907` are absent from the current 44-ref list; #2146’s disposition register records the latter deleted at `c20728ef3b85` as `SUPERSEDED_VERIFIED`. Its two 2026-09-07 research files are not byte-identical to the newer 2026-09-09 journal architecture/UI documents on Product main. Do not demand salvage from a no-longer-existing ref or equate textual difference with a mandatory publication route; journal content remains governed by current Product and the bounded G3 handoff. Evidence: `incoming/arena-incompleteness-auditor/2026-09-30/JOURNAL_DELETED_REF_RECHECK.md`.

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

**Current counter-witness (2026-09-30 later pass).** Two of those conditions are presently false:
*current Product main has terminal required CI* — the release workflow fails on `main`; and *live
`releaseSha` equals the intended release main SHA* — live is `d0e04a9c...` while `main` is
`d586aa63...`. The release path is blocked by `SYS-STRICT-NATIVE-PUBLICATION-COMPLETION`.
