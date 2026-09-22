# Baptist research branch reconciliation — bounded inventory

Observed 2026-09-22. Product authority:
`6bf5fd7212eaf88ac21d719947f98a1d6f21eb37`.
This is a read-only salvage assessment, not a branch-deletion receipt or a
declaration that the expanded book is publication-ready.

## Correction to the incoming backlog estimate

Full-history ancestry was fetched before comparison. The branch census contains
206 actual remote branch refs including main (the original 205 plus release
repair #2140); the symbolic `origin/HEAD` ref is excluded. Of these, 35 non-main
tips are ancestors of main and 170 branches have ahead commits. Ahead commits
measure ancestry divergence, not missing implementation or research.

For the 38 selected `book/*`, `reconcile/*`, and authentic-media branches, inspect
paths changed from each merge base to its tip, then compare the branch-tip blob
with the same path in current main. The bounded filter covers research, ledger
and provenance paths. It does not cover all assets/runtime paths or content that
existed only in intermediate historical commits.

| Measure | Result |
|---|---:|
| Branch/path occurrences examined | 165 |
| Distinct paths | 92 |
| Occurrences already byte-identical in main | 159 |
| Distinct paths already byte-identical in main | 86 |
| Paths absent under the old name | 5 |
| Same path with changed contents | 1 |

Exact branch tips, paths and Git blob identities are retained in
[BAPTIST_RESEARCH_INVENTORY.json](BAPTIST_RESEARCH_INVENTORY.json).

**Result:** it is incorrect to treat all ahead commits in the old chapter lanes
as unmerged research debt. Most examined research is already retained verbatim.
This does not prove publication completeness, nor that every other file on those
branches is redundant.

## Six exceptions and next dispositions

| Old file / branch | Current comparison | Disposition |
|---|---|---|
| `ch07-mazaev-prokhanov-source-to-claim-2026-09-06.md`, `book/ch07-mazaev-prokhanov-research-v2` | Main has numbered dossier `94-ch07-mazaev-prokhanov-source-to-claim-2026-09-06.md` plus date resolution 96 and acquisition dossier 97. Contents differ substantively. | Compare claims, not filenames. Old 18 July wording must not overwrite the newer distinction between the 18 July meeting and 19 July agreement. No wholesale import. |
| `ch07-mazaev-prokhanov-visual-dossier-2026-09-06.md`, same branch | Main has `95-ch07-mazaev-prokhanov-visual-dossier-2026-09-06.md`, with a revised shortlist, explicit facsimile route and corrected 18–19 July caption policy. | Treat as an alternate editorial draft until claim/visual candidates are reconciled. Not a missing chapter package. |
| `16-podpolnaya-pechat-bulletin-44-pdf-verification-2026-09-06.md`, `book/podpolnaya-pechat-golden-chapter` | Current file preserves the original blob identity and adds the exact PDF SHA-256 and 2026-09-12 byte-verification receipt. The visual gate remains open. | Older status is superseded at this file boundary; importing it would regress SHA verification. This is not whole-branch retirement proof. |
| `146-ch01-pre-baptist-origins-authority-reconciliation-2026-09-11.md`, `reconcile/ch01-pre-baptist-origins-research-20260911` | Absent from main. Its cited immutable Research acquisition authority was opened and checked; the historical receipts exist, separately from current access and visual gates. | Useful reconciliation candidate. Reconcile into the current owner after release recovery, preserving all source-chain, current-access and quotation HOLDs. |
| `147-media-container-recovery-status-2026-09-11.md`, `reconcile/baptisty-media-recovery-20260911` | Absent from main. This is an access/status report, not acquired historical media. | Keep as a recovery lead; refresh current container accessibility and verify candidate bytes before publication. |
| `148-book-production-reconciliation-status-2026-09-11.md`, `reconcile/baptisty-book-status-20260911` | Absent from main. Its claim that many chapter packages are not admitted is contradicted by the current blob comparison. | Do not import as current authority. Preserve useful publication/media boundaries and supersede stale admission claims. |

Immutable Research anchor checked for file 146:
[94f05457 — Baptist current authority](https://github.com/FedorMilovanov/Research/blob/94f05457c2cfb03560c41414cb6a44cc1fdd4a98/RUSSIAN_BAPTISTS_ARCHIVE/00_CURRENT_AUTHORITY_2026-08-02.md).
Historical acquisition is not a current downloadable-file proof, and neither is
an editorial certification of the full chapter.

## Source ownership for the next wave

Current Product already has
`docs/BAPTISTY-ROSSII-BOOK-AUTHORITY-V2.md`, source-to-claim dossiers and visual
dossiers. Reuse them. Its canonical Research classes are
`A1/A2/A3/B1/C/D`, with independent access, locator, rights and publication states;
do not install a competing generic Tier A/B/C/D registry.

Connected Drive inspection found both the seminary reservoir and the canonical
Baptist MASTER via an exact Research link. Private file identifiers, folder
inventory, excerpts and access details are retained outside this public repo.
An empty Drive name search did not prove the MASTER was unavailable. Catalog
availability also did not prove that its linked media/PDF containers were
currently accessible. No private source content was promoted into Product.

## Release work remains the prerequisite

Release repair [#2140](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2140)
fixes the stale generic H1 expectation and adds broad dist smoke to the candidate
workflow. Its first exact-head candidate reproduced the separate WebKit failure
on 390×844, clicking Jesus after Joseph's relation inspector:
[run 35773746852](https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/35773746852).
No green release or live promotion is claimed by this inventory.

The existing #2139 lane was continued: legal-relation assertions were restored to
Chromium/Firefox after inspection found they had been dropped by the earlier
extraction, and isolated-phase lifecycle diagnostics were added. A terminal fix
still requires the exact final head and negative browser evidence.

Issue [#1944](https://github.com/FedorMilovanov/gb-is-my-strength/issues/1944) was
closed as superseded after checking merged
[#1945](https://github.com/FedorMilovanov/gb-is-my-strength/pull/1945), current
deploy/control-plane contracts and live direct-Pages response. Cloudflare purge
credentials are no longer a release dependency. This closes an obsolete issue,
not the current production-drift root.

No Product branch was deleted or declared safely retired by this pass.
