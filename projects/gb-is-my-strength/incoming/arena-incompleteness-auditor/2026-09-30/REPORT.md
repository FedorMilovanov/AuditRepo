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
