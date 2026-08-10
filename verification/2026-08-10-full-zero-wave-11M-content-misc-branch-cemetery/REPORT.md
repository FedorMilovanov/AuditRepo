# Wave 11M — Content / Baptist / Lot / Nagornaya / Misc branch cemetery

Date: 2026-08-10

Product: `FedorMilovanov/gb-is-my-strength`

Live preflight authority: `main@757946da67287354b819737813c0a47095f2d759` — exact requested rewritten-history anchor.

## Method / boundaries

This is cleanup verification only. Fresh live refs were used after the history rewrite; old clones/worktrees and pre-rewrite SHAs were not used as current truth. Every assigned ref was compared against exact current `main`; current head SHAs below were captured from live self-compare. `ahead` is the live rewritten unique-tail count.

No Product source was changed. No Product branch, successor/r2/transport branch, or PR was created. Historical refs were not rebased/refreshed or pushed. Product `main` and Dependabot #1538 were not touched.

Disposition is semantic/tree-based, not name/age based. In particular:

- `archive/offline-pwa-working-20260801` was not auto-kept because it says `archive`, and was not auto-deleted because it is old. Current main's `research/A07_OFFLINE_PWA_2026-08-01.md` explicitly identifies that branch as a **selective recovery source only**, lists the ten recovered semantic owners, and records that clean PR #819 squash-flattened the permanent tree onto current main. PR #819 is merged. Therefore the archive has no remaining positive recovery value requiring KEEP.
- Lot root #1295 is closed `completed` after the required post-merge production witness. Historical Lot authoring/media/source/illustration/projector refs are not reopened as publication work.
- Canonical Scripture projection/rights repair #1452 is merged and governs publication eligibility; the historical Lot Bible-corpus lane is not a reason to resurrect an alternate corpus/publication owner.
- Strangler root #1383 is closed `completed`; Baptist roadmap/reference tails depending on old physical-reference ownership do not survive as independent Product semantics.
- `audit/npm-security-inventory-v3-20260808` contains only an audit/helper workflow tail. It was not converted into dependency implementation, and Dependabot #1538 was not touched.

## Execution limitation

All 28 refs are semantically safe to delete. The authenticated GitHub connector available in this execution provides live ref read/compare/create/update but **no delete-ref/delete-branch operation**. Fresh local Git access was also unavailable because the runtime could not resolve `github.com`. `update_ref` was deliberately not used as a fake deletion mechanism.

Therefore no ref was physically deleted in this run. Per required lifecycle ordering, automated CI-failure issues for these branch identities were **not** closed before deletion. The matrix below is a terminal semantic disposition and destructive handoff, not a false claim that refs disappeared.

## Per-ref terminal matrix

| # | Branch | Current head SHA | `main...ref` | Unique tail / tree evidence | Canonical successor / owner | Missing Product semantics? | Classification |
|---|---|---|---|---|---|---|---|
| 1 | `agent/auditrepo-active-work-contract-20260807` | `bc55ef20f29570253f7d0312c544448495e03777` | ahead 0 / behind 202 | no unique commits; live head reachable from current main | current AuditRepo/work-governance authority | no | **SAFE DELETE — REACHABLE/EMPTY** |
| 2 | `agent/baptisty-roadmap-route-authority-r2` | `46e1d2cb0b64f603d9f2f24cee4133e18876346c` | ahead 2 / behind 52 | historical Baptist roadmap audit + legacy-reference manifest tail | current Baptist publication/reference authority; terminal Strangler #1383 | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 3 | `agent/diotrophes-source-links-wave-b1-clean` | `d901d4212eb0a7f6077f734b7c2e793b07010711` | ahead 0 / behind 234 | no unique commits; reachable | current Diotrophes/source-link authority | no | **SAFE DELETE — REACHABLE/EMPTY** |
| 4 | `agent/nagornaya-visual-reference-storage-20260809` | `1bd5217edc8675bcd44710b734ced5fd34f5c3a9` | ahead 3 / behind 67 | legacy manifest/path contract + Nagornaya visual-reference audit predecessor | current Nagornaya visual/reference authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 5 | `archive/offline-pwa-working-20260801` | `478ecede6a99f9f32d05792eb28ac69e5ee781a3` | ahead 15 / behind 484 | genuine historical Offline/PWA implementation tail | **selectively recovered into current main; merged clean PR #819 owns permanent A07 tree** | no; recovery value already preserved explicitly | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 6 | `audit/baptist-media-coverage-20260809` | `c225142846609ae5be948688f8d4ce3b26f69f97` | ahead 1 / behind 52 | Baptist media coverage audit script only | current Baptist media/publication audit authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 7 | `audit/npm-security-inventory-v3-20260808` | `77d709b227efd100aa7278b5f7803381a9a91831` | ahead 1 / behind 139 | only `.github/workflows/npm-security-inventory-v3-helper.yml` | current security/dependency audit governance; no implementation owner created | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 8 | `fix/baptist-s12-spravochnik-metadata-20260808` | `975fea5ec3cf7d550dc9f0f32dc8454d4fdfc786` | ahead 2 / behind 135 | historical `sources-hygiene` + Baptist Spravochnik PageHead metadata repair | current Baptist metadata/source authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 9 | `fix/map-engine-correctness-bundle-20260807-r2` | `33b2bfef58c5608123a6f87d80f66ff14eacef5a` | ahead 24 / behind 181 | historical map engine + route validators + browser/regression bundle | current main contains later map-engine correctness browser/validator authority | no; large ancestry is superseded test/runtime lineage | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 10 | `fix/map-engine-correctness-bundle-20260807` | `a3bf70924e443b0644897b0c1c57b6c041d6b763` | ahead 1 / behind 183 | old map-engine P0 regression-test predecessor | current map correctness guards | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 11 | `lane/baptist-content-truth-20260808` | `fc91f8010d636c5744ab9ed55590bf1689355221` | ahead 1 / behind 142 | Baptist research/open-questions truth-register change | current Baptist content/publication authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 12 | `lane/baptist-media-provenance-20260809` | `fc0fe7303b72dcf0b3bbeedb3e1d1dc2041a0391` | ahead 2 / behind 66 | media ledger + Baptist roadmap-audit predecessor | current Baptist media/provenance authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 13 | `lane/baptist-s12-reader-facing-20260808` | `89e17911d8b71a9d7e1af59d6bd82e20a427d75d` | ahead 3 / behind 142 | historical reader-facing Baptist S12 repair | current Baptist reader/publication owner | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 14 | `lane/baptist-s12-search-manifest-20260808` | `6db47a013a923dfce49cfe86ce680d1fd3f50071` | ahead 4 / behind 138 | old Baptist Search Manifest/source-hygiene projection | current Search/Baptist publication authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 15 | `lane/diotrophes-source-links-wave-d-ct-20260805` | `32c17ff6ed05906d916d8bb6a1d2ecfa2751a477` | ahead 1 / behind 231 | small historical Diotrophes source-link contract tail | current source-links/cross-wave guards | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 16 | `lane/lot-illustration-placement-20260809` | `8ba2bfaac2915a57de86f43e3a528506d0d9f10c` | ahead 13 / behind 63 | historical Lot figure/illustration placement implementation | completed Lot publication root #1295/current Lot article | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 17 | `lane/lot-media-20260809` | `7001317c492042516e6eb28382f787f931d0df2d` | ahead 0 / behind 58 | no unique commits; reachable | completed Lot publication #1295 | no | **SAFE DELETE — REACHABLE/EMPTY** |
| 18 | `lane/lot-reader-copy-polish-20260809` | `780cdd11e6009d42a034ab412b2c5e08ca56891e` | ahead 0 / behind 57 | no unique commits; reachable | completed Lot publication #1295 | no | **SAFE DELETE — REACHABLE/EMPTY** |
| 19 | `lane/lot-source-polish-20260809` | `eddbf20199c016bdf73f1799fd10aeae35508711` | ahead 1 / behind 95 | alternative historical Lot section/source-polish assembly | completed Lot publication #1295/current accepted article tree | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 20 | `lane/nagornaya-library-theme-2026-08-07` | `49ad9cc86f44e6c83225c757ada90e664634744c` | ahead 3 / behind 178 | `NagornayaLibraryLinks` + shell-theme predecessor | current Nagornaya library/theme owner | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 21 | `lane/nagornaya-library-theme-20260807-r2` | `8a703db250f029131887dbac02c5fa7391a7903e` | ahead 1 / behind 177 | later shell-theme predecessor | current Nagornaya library/theme owner | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 22 | `lane/nagornaya-library-theme-20260807-r3` | `6d4e5c0445eb682dadc07b1081f90e86b6260f3c` | ahead 1 / behind 176 | later shell-theme predecessor | current Nagornaya library/theme owner | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 23 | `lane/system-diotrophes-cross-wave-guard-20260805` | `d901d4212eb0a7f6077f734b7c2e793b07010711` | ahead 0 / behind 234 | no unique commits; same reachable head as `agent/diotrophes-source-links-wave-b1-clean` | current Diotrophes cross-wave guard | no | **SAFE DELETE — REACHABLE/EMPTY** |
| 24 | `lane/system-lot-bible-corpus-20260809` | `b79be1cc2067d27101a07a7e72281e47a63df4cf` | ahead 4 / behind 53 | historical additions to small Cassian/Synodal Bible records for Lot | completed #1295 plus merged canonical Scripture rights/projection owner #1452 | no; do not resurrect alternate corpus/publication lane | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 25 | `system/baptisty-roadmap-publication-authority-20260809` | `9e4d046ed1d17eed0e74e1d367343a727665988b` | ahead 4 / behind 52 | shared-files/legacy manifest/Baptist roadmap publication-authority predecessor | current Baptist publication/reference authority; #1383 terminal where physical-reference dependency applied | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |
| 26 | `system/lot-authoring-projector-20260809` | `7a45d9f18536f31e23b2402431f735279cef1d18` | ahead 0 / behind 95 | no unique commits; reachable | completed Lot publication #1295 | no | **SAFE DELETE — REACHABLE/EMPTY** |
| 27 | `system/lot-source-polish-projector-20260809` | `7a45d9f18536f31e23b2402431f735279cef1d18` | ahead 0 / behind 95 | no unique commits; same reachable head as Lot authoring projector | completed Lot publication #1295 | no | **SAFE DELETE — REACHABLE/EMPTY** |
| 28 | `system/source-authority-baptist-publication-trigger-20260808` | `68e8b69aca9dd7c5655e61f7dcf88d7c17de940e` | ahead 2 / behind 138 | source-authority workflow trigger predecessor only | current Baptist/source-publication authority | no | **SAFE DELETE — SUPERSEDED/ABSORBED** |

## Terminal report

- assigned count: **28**
- examined count: **28**
- semantically SAFE DELETE count: **28**
  - SAFE DELETE — REACHABLE/EMPTY: **7**
  - SAFE DELETE — SUPERSEDED/ABSORBED: **21**
- physically deleted count: **0** — delete-ref/delete-branch primitive unavailable
- KEEP count: **0**
- MANUAL REVIEW count: **0**
- associated CI issues closed: **0** — intentionally not closed because physical deletion did not occur
- Product source mutations: **ZERO**
- new Product branches: **ZERO**
- new Product PR: **ZERO**
- Product `main` mutations: **ZERO**
- Dependabot #1538 mutations: **ZERO**

### Exact deleted branch names

None. No deletion primitive was available; no destructive outcome is claimed.

### Exact surviving branch names and reason

All 28 assigned refs still physically survive **only because this executor lacks a delete-ref/delete-branch capability**. None survives because of semantic KEEP or unresolved unique work:

- `agent/auditrepo-active-work-contract-20260807`
- `agent/baptisty-roadmap-route-authority-r2`
- `agent/diotrophes-source-links-wave-b1-clean`
- `agent/nagornaya-visual-reference-storage-20260809`
- `archive/offline-pwa-working-20260801`
- `audit/baptist-media-coverage-20260809`
- `audit/npm-security-inventory-v3-20260808`
- `fix/baptist-s12-spravochnik-metadata-20260808`
- `fix/map-engine-correctness-bundle-20260807-r2`
- `fix/map-engine-correctness-bundle-20260807`
- `lane/baptist-content-truth-20260808`
- `lane/baptist-media-provenance-20260809`
- `lane/baptist-s12-reader-facing-20260808`
- `lane/baptist-s12-search-manifest-20260808`
- `lane/diotrophes-source-links-wave-d-ct-20260805`
- `lane/lot-illustration-placement-20260809`
- `lane/lot-media-20260809`
- `lane/lot-reader-copy-polish-20260809`
- `lane/lot-source-polish-20260809`
- `lane/nagornaya-library-theme-2026-08-07`
- `lane/nagornaya-library-theme-20260807-r2`
- `lane/nagornaya-library-theme-20260807-r3`
- `lane/system-diotrophes-cross-wave-guard-20260805`
- `lane/system-lot-bible-corpus-20260809`
- `system/baptisty-roadmap-publication-authority-20260809`
- `system/lot-authoring-projector-20260809`
- `system/lot-source-polish-projector-20260809`
- `system/source-authority-baptist-publication-trigger-20260808`

`examined == assigned` is satisfied. Semantic classification is terminal; the only unfinished action is physical ref deletion (and only then branch-identity CI lifecycle issue closure) by an executor with the required destructive primitive.