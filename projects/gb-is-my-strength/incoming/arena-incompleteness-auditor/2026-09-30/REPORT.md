# Completion audit — follow-up / correction (2026-09-30)

## Identity
- Project: gb-is-my-strength
- Agent: arena-incompleteness-auditor
- Date: 2026-09-30
- Audited anchor: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b` (Product main, verified with `gh repo view` and local shallow clone)
- Evidence tier: verified-source for files at SHA above; verified-lifecycle for GitHub refs and CI metadata. No browser or build assertion.

## Correction: false positive removed from MASTER

The 2026-09-29 report proposed `GBS-BAPTISTS-ROADMAP-STATUS-STALE`. This is **invalid**:
`data/baptisty-rossii-expansion-roadmap.json` explicitly separates `currentPublishedSurface`
(nine articles, one reference, four current chapters) from `targetArchitecture` (five *future*
parts, twenty future chapters). Its `principle` states that a planning entry does not create a
route. `scripts/baptisty-roadmap-audit.js:109` requires future chapters to remain `planned` until
a dedicated publication lane promotes them. Matching a future chapter title with an existing
article's title is not proof that a future chapter is published. This row has been removed from
MASTER; the actual incompleteness of the book remains in PROGRAM Wave 5B.

## Corpus census — no invented draft backlog

`src/content/articles/*.mdx` = **63** files at the SHA. Of these 53 have `draft: false` and
`noindex: false` in frontmatter; the remaining ten are the Baptists corpus and omit those fields,
but have published routes and appear in the current published surface. There is **no** `draft: true`
in the `.mdx` corpus. This does not assert that no draft material exists outside this directory.
The six-section heart-book shelf is intentionally a selection, not an incomplete index (see
2026-09-29 report's refutation).

## Branch retirement: freshly measured, not assumed

GitHub's paginated `GET /repos/FedorMilovanov/gb-is-my-strength/branches` returned **205 unique
names** (204 non-main), 2026-09-30; the 2026-09-24 count of 203/202 in PROGRAM is superseded.
`GET /repos/.../compare/main...<branch>` on selected refs returned:

| Ref | Ahead | Behind | Action boundary |
|---|---:|---:|---|
| `book/ch17-vsehb-1945-1959-research` | 0 | 639 | absorbed candidate; explicit retirement receipt still required |
| `book/ch06-kargel-source-to-claim` | 10 | 644 | salvage unique dossiers only |
| `book/ch07-mazaev-prokhanov-research` | 18 | 644 | salvage unique dossiers only |
| `book/ch07-mazaev-prokhanov-research-v2` | 2 | 1021 | additional chapter-7 ref; disposition required |
| `feat/baptist-authentic-media-composition-20260912` | 2 | 189 | media ledger/assets require rights/provenance salvage |
| `fix/map-engine-capability-runtime-v1` | 3 | 126 | reverify unique code before decision |
| `refactor/map-engine-route-bootstrap` | 27 | 165 | reverify unique code before decision |
| `refactor/map-engine-shared-bootstrap-v2` | 11 | 132 | reverify unique code before decision |
| `lane/journal-editorial-architecture-20260907` | 2 | 921 | salvage or explicitly archive research documents |

The unsuffixed `lane/journal-editorial-architecture` ref used in older PROGRAM prose returns
404 and is **not** in the 205-name list; the suffixed ref above is the actual active branch.
This is a **targeted sample**, not disposition of the remaining 195 non-main refs.

## CI gate recheck (unclassified)

`GET /actions/runs/36403875153` reports failure at Product SHA `d0e04a9c...`; jobs endpoint
identifies job `source-links`, step 6 `Source link audit (production-like dist)` as failed.
`gh run view --log-failed` could not download the signed log archive (`EOF`); failure details
remain **unclassified**. This does not justify admitting an independent MASTER defect.

## Next check

Classify the remaining 195 non-main refs (with ahead/behind and unique-file receipts), retrieve
the source-link gate's failing evidence from a working log channel, and verify live routes and
Pagefind coverage before asserting an orphaned series. No branch deletion or Product changes were
attempted.

## Conservative matrix correction — policy versus defect

Source anchor unchanged: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`.
On this follow-up, six additional 2026-09-29 entries were triaged out of MASTER:

| Former ID | Disposition and exact counter-witness |
|---|---|
| `GBS-GENESIS6-MISSING-FROM-SEARCH-MANIFEST` | **Invalid as filed.** `data/route-search-policy.json` explicitly gives `/hard-texts/genesis-6/` `searchManifestPolicy: "exclude"` and `pagefindPolicy: "include"`; `scripts/search-manifest-policy-normalizer-core.js` seeds this exact deliberate landing policy from `data/series.json`. Missing manifest entry is not a publication defect. Actual Pagefind index contents were not browser-verified. |
| `SYS-CONTENT-TAXONOMY-NAMESPACE-OVERLOAD` | **Not demonstrated as a necessary system repair.** Its asserted catalog orphan was the invalid Genesis 6 row above. Shared `hard-texts` section/series naming may be confusing but is not proof of a broken route or required migration. Re-admit only after a concrete reader failure with independent witnesses. |
| `GBS-DIOTREFY-OG-IMAGE-DUPLICATE` | **Unproved placeholder hypothesis.** `src/components/article-pilots/diotrophes/DiotrophesPageHead.astro` deliberately sets the same image in `og:image` and `twitter:image`; its OG alt explicitly calls it a *visual of the «Тёмная сторона кафедры» series*. Shared art is not necessarily a defect. A possible mismatch between OG alt and Twitter alt is a separate claim requiring image inspection. |
| `GBS-SERIES-MANIFEST-DUPLICATE-NAGORNAYA` | **No necessary fix demonstrated.** The two URLs have distinct native page components (`src/pages/nagornaya/index.astro` and `src/pages/nagornaya/seriya/index.astro`), so equal 89-minute summaries and art do not establish duplicate routes. Catalog presentation can be reviewed as optional polish after owner intent is established. |
| `GBS-GILL-SLUG-PART-NUMBER-INVERSION` | **Verified historical URL mismatch, not automatically mandatory.** Frontmatter slugs `chast-3-nasledie`/`chast-4-ekzeget` carry displayed parts IV/III; changing stable permalinks without owner approval could do harm. Park for editorial decision; do not assume a redirect is required. |
| `GBS-MANIFEST-TITLE-BRAND-SUFFIX-LEAK` | **Observed cosmetics, not a proved completion blocker.** Two catalog cards include `| Господь Бог` in their title; the source titles are intentionally suffixed for SEO, and the catalog copies them. Optional title/presentation policy review rather than MASTER defect. |

**Narrowing of retained time-label row:** The 24 heart MDX members' frontmatter times sum to 719
minutes and `/articles/` renders the book as a series with `2 мин`. `scripts/check-data-consistency.js`
only asserts aggregate time for known Nagornaya/Gill/pastor landing routes, not `/hard-texts/`;
thus the previous assertion that a universal series total contract was *proven* by the Baptists
control was too strong. `2 мин` may correctly describe reading the landing page. The actionable
question is which duration a reader expects a «Серия» card to convey. It is retained only with
that explicit qualification, not a demand to replace metadata with 719 automatically.

No Product code was changed, and no previously unseen bug has been admitted in this correction.

## Full branch divergence inventory (2026-09-30; read-only)

After the targeted sample above, all **204 non-main branches** returned by the paginated GitHub
branches endpoint were compared to `main` via `GET /repos/FedorMilovanov/gb-is-my-strength/compare/main...<branch>`.
The independent per-ref results are preserved in
`evidence/branch-compare-main-2026-09-30.csv` (branch name, GitHub status, ahead, behind,
count of compare API's listed changed files). There were **zero API failures**:

| Compare relationship to main | Branches | What this proves (and does not prove) |
|---|---:|---|
| `behind` (ahead = 0) | **35** | no unique commits vs main; **retirement candidate only**, not an approved deletion or proof of editorial equivalence |
| `diverged` | **166** | unique commits and missing main commits; content/code disposition requires review; do not merge wholesale |
| `ahead` (behind = 0) | **3** | content/apostasy, current Dependabot, genealogy direct-name PR heads; not automatically publication-ready |
| **Total** | **204** | main excluded; all rows received a compare response |

The three ahead-only branches are
`content/apostasy-bible-study` (1 ahead),
`dependabot/npm_and_yarn/npm-non-major-92ac384687` (1 ahead), and
`genealogy/editorial-direct-name-batch-20260924` (3 ahead).
The fourth open PR, #2142 (`reconcile/baptist-ch01-authority-salvage-20260924`), is **diverged**:
1 ahead / 5 behind and affects one research file.

The two document paths on `lane/journal-editorial-architecture-20260907`'s compare are
`research/JOURNAL_EDITORIAL_ARCHITECTURE_2026-09-07.md` and
`research/JOURNAL_NATIVE_UI_CONTRACT_2026-09-07.md` (2 ahead / 921 behind).
The media-composition branch is 2 ahead / 189 behind; its compare lists 47 changed paths,
including `baptisty-rossii/research/media-ledger.md` and raw historical images.
These are **compare-derived candidate contents**, not proof of usable rights or material absent
from all forms on main. Salvage requires source/rights receipts.

The per-branch inventory is a measurement artifact, **not** a second active bug matrix. Each
of the 35 `ahead=0` refs still requires explicit MERGED / SUPERSEDED / SALVAGED /
REJECTED-ARCHIVED owner disposition per PROGRAM Wave 8 before deletion; the 166 diverged refs
need unique-commit/file review, and the three ahead-only refs follow PR/CI gates. No branches
were deleted, merged or renamed in this pass.

## Product-content completion pass (requested owner scope: series, articles, abandoned work)

**Source anchor:** Product `main` `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`, fresh
shallow clone checked on 2026-09-30. This pass compares the actual publication registry,
`migration/page-ownership.json`, book configs and *canonical* editorial authority. It is
verified-source, **not** a build/browser recheck or a claim that every sentence has been certified.

| Unit | Published / owned witness | Actual uncompleted boundary | Disposition |
|---|---|---|---|
| Нагорная проповедь | `data/series.json`: 5/5 `published`; all 5 chapter routes `production-dist` | No source-backed missing chapter established. | Do not create program gap. |
| Джон Гилл | registry 6/6 `published`; all 6 routes `production-dist`; `research/GILL_VERIFICATION_2026-07-31.md` reports its historic editorial fixes closed, while separately noting nonblocking research debts | No source-backed missing published part established; URL/part-number cosmetic question is parked in WORK_QUEUE. | Do not treat archival research leads as 20 missing articles. |
| Тёмная сторона кафедры | registry 9/9 `published`; all 9 routes `production-dist`; first part is native route, not an MDX file | No source-backed missing core part established; Досье A is a separate content route, not a tenth mandatory core part. | No new PROGRAM row. |
| Подросток за кадром | registry 7/7 `published`; all 7 routes `production-dist`; `docs/TEEN-SERIES-PUBLICATION-CONTRACT.md` says `PUBLISHED / POST-RELEASE CONTRACT` | No missing article established. Quiz disabled by design for safeguarding; do **not** label as unfinished. | No new PROGRAM row. |
| Тайны человеческого сердца | 24 `series: "hard-texts"` MDX members; canonical `hardTextsSeriesConfig.ts` derives 4 chapters, 22 articles and 2 endpapers; all MDX members have `draft: false` | Old `docs/HEART-SERIES-COMPLETION-ROADMAP-2026-07-12.md` says 6 live / 18 drafts, but calls itself **ЗАМЕНЁН**, and the canonical architecture dated July describes a historical 6/18 baseline. Not current publication debt. | Do not copy old draft count to PROGRAM. Card time label remains a narrow MASTER issue. |
| Бытие 6 / Енох | registry 6/6 `published`; all 6 routes `production-dist`; the hub is deliberately excluded from `search-manifest` and included in Pagefind by policy | No missing registered core part established. | No new PROGRAM row. |
| Баптисты России | registry 10/10 `published`: 9 historical articles + 1 reference; 4 present-book chapters, 229 minutes. Product `docs/BAPTISTY-ROSSII-EDITORIAL-ARCHITECTURE.md` explicitly sets 17–20 articles as *conditional* expansion, not an order to generate 8–11 specific URLs. | **Confirmed publication program**, detailed by current-book split candidates and future-book research in the matrix below. | Update existing PROGRAM Wave 5B, not MASTER. |
| `/journal/` | `/journal/` and `/journal/dossiers/g3/` both `production-dist` in page ownership and implemented in `src/pages/journal/` | `research/JOURNAL_EDITORIAL_ARCHITECTURE_2026-09-09.md` says `NO_PUBLIC_ROUTE` but describes a historic pre-publication state; it is not a current witness. Six proposed category endpoints are an IA direction, not six missing commitments. | Do not claim journal wholly abandoned; request current editorial owner decision before program admission of additional categories. |

### Baptist book: bounded, evidence-backed incomplete editorial units

Authority: Product `docs/BAPTISTY-ROSSII-EDITORIAL-ARCHITECTURE.md` §§2–6 and 10;
`docs/BAPTISTY-ROSSII-BOOK-AUTHORITY-V2.md` §§2–5; `data/baptisty-rossii-expansion-roadmap.json`.
The two horizons must stay separate: **current book** = 4 chapters / 9 articles + 1 reference;
**future five-part/20-chapter book** = planning graph, not 20 broken routes, and all its
chapter statuses are deliberately `planned` until a dedicated publication lane.

| Book slice | Existing published base | Conditional/unpublished work, precisely bounded | Gate before route |
|---|---|---|---|
| Current Chapter I: origins | `noch-na-kure`, `yuzhnaya-shtunda`, `dva-sezda-1884` | Separate pre-Voronin prehistory article only **if** independent primary-source corpus exists; not mandatory just to reach a count. | Independent question + primary evidence. |
| Current Chapter II: Petersburg/union/conscience | `peterburgskaya-liniya`, `goneniya-i-sovest` | Seven *candidate slices* A–G in canonical architecture: Petersburg-person split; Mazaev/Prokhanov; print republic / «Слово истины»; 1917–1921 window; 1921–1924 relief; College Fund/school and unachieved unity; conscience before arms. **Not seven promised URLs**; some are split-ready, others primary-document holds. | Source-to-claim, page-level object, College Fund primary documents; separate Russian delegation vs BWA decisions. |
| Current Chapter III: Soviet night/union center | `sovetskaya-noch`, `vsehib-1944` | Five *candidate slices* A–E: “sectarian enemy” narrative; 1929 law; destruction/Great Terror; war pivot 1942–44; union 1944. Some are split-ready, others need archival strengthening; avoid duplicating published core. | Verify individual claims and early «Братский вестник» physical pages; do not elevate attributed releases to proven facts. |
| Current Chapter IV: division/underground | `iniciativnaya-gruppa`, `podpolnaya-pechat` | Four *candidate slices* A–D: 1960 documents; Council of Churches/prisoners/families; underground periodicals; «Христианин» print network. A/D have published core; B needs person/date/case matrix; C needs issue-level catalog. | Document facsimile, person/case and issue-level evidence, provenance/rights. |
| Deferred Chapter V: diaspora/memory | **No current chapter V**, by deliberate authority decision | Diaspora/overseas archives/Far East and post-1991 memory remain deferred, **not “coming soon”** and must not receive placeholder routes. | Separate credible source corpus + source-to-claim + rights/media + owner publication decision. |

Physical-source holds named by the same canonical authority: five early physical units of «Слово
истины» 1918; 1921 congress 31-page title/colophon; full 1925 plenum (81 pp.); exact Third
Baptist World Congress proceedings pages; obtained/verified Porter pp. 275–282; particular
archival folders/frames; College Fund transaction history; Pavlov report-date conflict; photo
rights/captions. This list is **source retrieval, not a count of 9 broken published articles**.
Publication must not synthesize unseen pages, silently resolve disputed dates, or hotlink
uncleared photography merely to mark a slice complete.

## Cross-repo content evidence: teen series / Genesis 6 / public Drive (2026-09-30)

Fresh Research `main` SHA: `0d4d897fe1180f791b433dce1c61b306efaec51e`.
Product `main` anchor: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`.
Research owns source/interpretive boundaries, Product owns current publication, and neither
one can be substituted for a live-reader browser audit. No private Google Drive account,
MASTER inventory, or private folder was available to this pass. **One linked public file
was checked; this is not an audit of the owner's whole Drive.**

| Subject | Research witness at exact SHA | Product witness at exact SHA | Classification / next check |
|---|---|---|---|
| `TEEN_DOUBLE_LIFE`: 7 core/adult articles | `TEEN_DOUBLE_LIFE/CURRENT_SERIES_HANDOFF.md` and `237_PUBLICATION_ARCHITECTURE_REVIEW...` own 3 core + A–D adult companions. The handoff's description of them as *draft/noindex* and old Product PR numbers belongs to its 2026-09-08 snapshot. | `docs/TEEN-SERIES-PUBLICATION-CONTRACT.md` explicitly says `PUBLISHED / POST-RELEASE CONTRACT`; `data/series.json` has 7/7 `published`, all seven routes `production-dist`, MDX frontmatter `draft: false`, `noindex: false`. | **No missing core article**. Don't reopen seven draft PRs from old Research handoff. Product reader text was not re-reviewed line by line against all Research P0s in this pass. |
| Teen specialized companions | Research handoff distinguishes `188` specialized proposals (positive sexual formation, child-on-child sexual harm, scrupulosity, institutional integrity, split households, AI/deepfakes, etc.) from `237` core 7; `299_LATE_RESEARCH_SATURATION_GAP_AUDIT...` says the late disclosure lane has no currently identified material *unowned category* and prioritizes compression/source refresh/Product preflight. | No additional specialized companion route was identified in the published seven-route contract. | **Owner-selection pool, not abandoned articles**. Before any new URL, establish explicit owner priority, claim ownership, safeguarding/jurisdiction and nonduplication. Do not publish a forensic manual merely because dossiers exist. |
| Teen Companion A direct-owner requirements | Research `302_COMPANION_A_PRODUCT_PREFLIGHT...` historically held Product creation; `303_COMPANION_A_DIRECT_OWNER_REQUIREMENTS...` insists on guarded Israel analogy, modern adult economy, blocked contact, rapid return. | The current article `src/content/articles/vzroslyy-rebenok-ushel-kontakt-pokayanie-vozvrashchenie.mdx` contains sections on bounded Israel analogy, blocked contact, economic independence, and prohibitions on fake-account pursuit. | **Negative witness against an easy false alarm.** Historic “creation held” is not current absence; no new defect admitted. Full claim-by-claim editorial parity is a separate reverify task. |
| `genesis-6` / fallen angels / daughters of humankind / Enoch | `GENESIS6_AUTHORITY_CONTRACT.md` requires exact Research commit and manifest digest; `data/genesis6-publication-ledger.json` has bundles for articles 6–9. An older Article-8 XLIV notice suspends an overconfident 1 Pet. 3:21 baptism formulation; XLVIII/XLIX and later corrections supersede earlier drafts. `data/genesis6-enoch-extension-publication-ledger.json` has a historical `blocked` decision for extensions 6A/6B. | `data/genesis6-research-provenance.json` records `releaseState: "published"`, six-article reader order 6,6A,6B,7,8,9, pinned Research commit `753e09027d4a33af5659ce1221ef8371e9dfae22`, manifest digest `95320c...`, and later `siteAcceptance` merge `522f0e1...`. Registry: 6/6 `published` and all routes `production-dist`. `scripts/genesis6-research-provenance-contract.mjs` explicitly checks historical extension HOLD *and* later site acceptance; its workflow has past green runs. | **Do not label the cluster unpublished solely because a preserved Research ledger says `blocked`.** The historic restriction and later publication acceptance have separate scopes. Remaining interpretive uncertainty is to be shown honestly in the articles, not transformed into a missing-article count. Fresh Research-main-vs-pinned-commit claim-delta and live article-browser comparison were NOT performed. |
| Direct public Google Drive object — Valkewich appendix | Product `baptisty-rossii/research/92-ch06-kargel-1869-baptism-discrepancy-resolution-2026-09-06.md` records ID `1bx53uaNT1X0pOTZXIlZNNmOJarjE1U8j` and identifies the 7z archive; Product research file 30 records a *historical* page-level check of appendix V pp. 27–28. | `https://drive.google.com/file/d/1bx53uaNT1X0pOTZXIlZNNmOJarjE1U8j/view` was fetched without account on 2026-09-30 and redirected to Google Drive's public **virus-scan warning** for «Валькевич. Приложение в pdf.7z», 455 MB. | **Public landing accessible; bytes/pages NOT revalidated.** The open landing is not a verified quote or fresh SHA-256. Don't download a 455 MB archive into AuditRepo. |
| Public handoff page to the archive | Product `baptisty-rossii/research/27-origins-web-source-ledger-30plus-2026-06-18.md` row 45 lists a Denis Samarin page as an archival lead. | A proxied fetch of that exact `www.denis-samarin.ru/...` URL on 2026-09-30 redirected to `denis-samarin.ru/...` and returned **404**. Direct Drive object still responds as above. | **Historical intermediary link stale; archive is not proven lost.** Next: update source-ledger link only after checking a valid canonical replacement; do not admit a live reader broken-link defect (no live reader link witnessed). |

Google Drive links in the Research teen and «ТРУДНЫЕ ТЕКСТЫ» Markdown corpus were not
found by a direct `drive.google.com` / `docs.google.com` URL scan. This does **not** prove the
underlying Research lacked Drive-based sources or that other project folders are public.
Additional Drive review requires the actual folder/file URL or an authorized public index;
never infer access from an old note or request credentials.
