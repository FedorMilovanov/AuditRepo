# CURRENT HEAD REVERIFY — 2026-07-28 — `0e5cd33e` Genesis 6 LXV/LXVI source

## Status

`SOURCE-MERGED / EXACT-HEAD-CI-VERIFIED / PRODUCTION-WITNESS-PENDING / PUBLICATION-BLOCKED`

## Boundary

- Source repository: `FedorMilovanov/gb-is-my-strength`
- Source issue / owner: #362
- Source PR: #492
- Fresh base before PR merge: `36cb2cd06d9a688c3ef9331c6cd478f1a87b5ec8`
- Final exact PR head: `e5494e4bcebb8c4e76e8bb74c3f5a89b6e6f5dec`
- Source merge commit: `0e5cd33e02de8c424bfaab4127e4463851bfeb1e`
- Research authority: `FedorMilovanov/Research@753e09027d4a33af5659ce1221ef8371e9dfae22`
- Research extension schema: `6`
- Extension manifest SHA-256: `947e7b86705fd1729f86f0f99c60afee9b850f794d439729698be7d2f1edaaf7`
- Last accepted production authority at capture: `36cb2cd06d9a688c3ef9331c6cd478f1a87b5ec8`
- Production authority for `0e5cd33e…`: **not yet accepted**

This document records source acceptance only. An infrastructure deployment of the repository does not authorize Genesis route publication, remove `draft/noindex`, or close issue #362.

## Changed source scope

Exactly six intended files changed:

- `.github/workflows/genesis6-research-provenance.yml`;
- `data/genesis6-research-provenance.json`;
- `scripts/genesis6-research-provenance-contract.mjs`;
- `src/components/article-pilots/_shared/series/genesis6SeriesData.ts`;
- `src/content/articles/kniga-enoha-kotoroy-ne-bylo-kak-raznye-proizvedeniya-stali-korpusom.mdx`;
- `src/content/articles/mozhno-li-doveryat-1-enohu-kanonicheskiy-audit.mdx`.

No temporary carrier, materializer or diagnostic file remained. The ordinary merge refresh preserved the already accepted Atlas/Gill repair from base `36cb2cd0…`.

## Research decision → reader-facing wording

### LXV — 1 Enoch 70–71

Accepted source boundary:

- modern critical 71:14 preserves direct second-person address to Enoch;
- Charles's third-person reading is classified as editorial emendation/history of interpretation rather than the neutral manuscript default;
- 70:1 remains version-sensitive;
- composition of 70–71 and total figure identity remain qualified;
- maximal identification creates serious canonical tension, but disputed composition alone does not establish formal `DIRECT-CONFLICT`;
- reader status: `DIRECT-ADDRESS-ESTABLISHED / COMPOSITION-AND-IDENTITY-QUALIFIED`.

### LXVI — Astronomical Book plurality

Accepted source boundary:

- `4Q208` and `4Q209` belong to one compositional tradition while preserving genuine scheme-level textual plurality;
- `4Q208–4Q211` are multiple physical manuscripts, not one immutable Aramaic text;
- parts of `4Q209` have direct Geʽez parallels;
- the Synchronistic Calendar has no simple full Geʽez equivalent;
- an earlier-stage → fuller 364-day adaptation is presented as a strong modern reconstruction rather than universal consensus;
- reader status: `TEXTUAL-PLURALITY-ESTABLISHED / EVOLUTION-MODEL-QUALIFIED`.

## Preserved uncertainty and content invariants

The source contract preserves qualified uncertainty for:

- `1-enoch-10-8-interpretive-scope`;
- `1-enoch-15-8-12-version-details-and-demon-identity`;
- `1-enoch-70-71-composition-and-figure-identity`;
- `astronomical-book-reconstruction-direction-and-joins`;
- `parables-date-and-witness-form`;
- `animal-apocalypse-decomposition`;
- `chapter-108-relation-to-epistle`;
- `codex-panopolitanus-editorial-intention`.

Additional invariants:

- 6A remains exactly 27 claim-level footnote groups;
- 6B remains exactly 26 claim-level footnote groups;
- reading times reconcile to `19 + 38 + 42 + 24 + 28 + 19 = 170` minutes;
- rendered cover paths and alt text remain aligned with the approved Genesis image manifest;
- no manuscript image or protected apparatus reproduction was introduced.

## Exact-head acceptance

All eleven required workflows completed successfully on exact head `e5494e4bcebb8c4e76e8bb74c3f5a89b6e6f5dec`:

| Contract | Run | Result |
|---|---:|---|
| Genesis 6 Research provenance | `30403175226` | success |
| Shared Files Guard | `30403175204` | success |
| Glossary Contract | `30403175174` | success |
| Overlay Runtime Browser | `30403175282` | success |
| Deploy Candidate Contract | `30403175166` | success |
| Editorial Dateline Contract | `30403175193` | success |
| Native Source Contract | `30403175170` | success |
| Print Paper Contract | `30403175164` | success |
| Visual Parity Guard | `30403175185` | success |
| Route Registry Validators | `30403175169` | success |
| Runtime Interactive Audit | `30403175200` | success |

Unavailable checks: none. Failed checks on final head: none. Review threads: none.

## Publication boundary

The following remains authoritative after source merge:

```text
draft: true
noindex: true
sourcesRequired: true
releaseState: blocked
mayPublish: false
mayRemoveNoindex: false
```

Research blocking HOLDs for the implemented wording are closed, but public activation remains a separate explicit editorial/confessional publication transaction under issue #362.

## Production evidence still required

Before `0e5cd33e…` may replace `36cb2cd0…` as imported production authority, one exact automatic deploy run must prove:

1. readiness checked out exact release/control-plane SHA `0e5cd33e…`;
2. one immutable candidate was built and fully validated;
3. promotion downloaded the same-run candidate without checkout/install/rebuild;
4. Pages deployment succeeded;
5. generic live acceptance passed;
6. TTS extension acceptance passed;
7. candidate, Pages, generic and TTS artifacts were retained with identities/digests;
8. Deployment Witness Ledger recorded the same run, attempt and SHA.

Even after infrastructure production acceptance, Genesis routes remain `draft/noindex` until issue #362 authorizes publication separately.
