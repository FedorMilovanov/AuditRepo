# Intake — release gate block after the Lawson merge, and Baptist copy/date provenance

## Identity

- Project: gb-is-my-strength
- Agent: arena-incompleteness-auditor
- Date: 2026-09-30
- Evidence anchor: Product `main` `d586aa63f02b569cfe050a63cc9078c044375d8d`; live release
  `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b` (`/deployments/d0e04a9c.../35927303479-1.json`);
  Research `main` `3d990d840e5708fdc517250031481f8cfafa77de` (the apostasy lane later advanced to
  `1876c38f...` — same day, does not change these findings)
- Evidence tier: verified-source (exact-SHA files), verified-artifact (local production-like
  build of `d586aa63` + full `validate:static-publication` chain run), verified-CI (Actions
  runs/jobs API), live HTTP retrieval. No browser rendering. No Product mutation.

## Findings

1. **Release blocked since the PR #2148 merge.** Every `main` push since 2026-09-30T11:00:41Z
   (`23bd8567`, the #2148 merge) fails `Deploy to GitHub Pages` at the step
   `Static publication source gates`. Last visible successful deploy run: `35796264804`
   (`d9cbcdb1`, 2026-09-22). Live production is still `d0e04a9c`, so the published Lawson route
   `https://gospod-bog.ru/articles/steven-lawson-samoobman-i-publichnyy-golos/` returns the 404
   page live.
2. **Exact boundary reproduced locally** — *step count corrected by the 2026-09-30 third pass: the
   figure originally written here did not match the script and is withdrawn; recomputed from Product
   `package.json` blob `812497795d8a3c5c7a2beb6224b2f9492354dfdf` at `d586aa63`, enumerated receipt
   `../../../reverify/evidence/2026-09-30-validate-static-publication-command-list.txt`*:
   `npm run validate:static-publication` has **41** top-level `&&` commands; run one by one **40 exit 0**
   and only command **#24**, `node scripts/audit-pro.js`, fails, with the single error `sitemap contract: missing canonical indexable production route:
   /articles/steven-lawson-samoobman-i-publichnyy-golos/`. PR #2150's own head `89e76794` fails
   the same gate → it does not unblock the release.
3. **Root cause — two owners of "canonical indexable production route":** the route is
   `production-dist` in `migration/page-ownership.json:54` and in its strict-native route profile,
   but absent from `data/route-search-policy.json`, `data/search-manifest.json`, `sitemap.xml`
   (94 `<loc>`) and `feed.xml`. `scripts/lib/sitemap-route-contract.js` (registry-driven `audit-pro`
   gate) expects it; `scripts/sitemap-policy-normalizer.js`
   (`POLICY_INCLUDE_AND_PRODUCTION_AND_MANIFEST_AND_VALID_DATE`) silently skips it. The sanctioned
   writers (`search-manifest-policy-normalizer --write`, `sitemap-policy-normalizer --write`,
   `rss-feed-normalizer --write`) all report "no changes required" and produce an empty diff —
   there is no machine repair path; an owner decision is required (register the route in the
   canonical discovery surfaces, or withdraw its production registration).
4. **Admission boundary observed:** PR #2148 merged with 22 FAILURE / 12 SUCCESS / 1 SKIPPED
   checks (including `Build and audit production-like candidate`, `validate-release` and
   `Search manifest, RSS and sitemap autofix`); `guard` and `Validate source metadata without
   building dist` were green. Branch-protection read is 403 for this token and `rulesets` is `[]`,
   so the exact required-check set is not asserted here.
5. **Baptist `????` copy loss — root cause and live impact:** the damaged props were introduced by
   commit `059b3024` (PR #2028, 2026-09-13) already corrupted; counts are identical on `main` and
   on the live release (Spravochnik 481, Podpolnaya 431, Iniciativnaya 289, Peterburgskaya 216,
   Goneniya 177, Yuzhnaya 129, Noch 118, Vsehib 97, DvaSezda 88), and the live
   `/baptisty-rossii/spravochnik/` page renders them. No approved original for those strings was
   found in the repository; restoration requires an owner-approved source, never machine guessing.
6. **Spravochnik visible «14 июня 2026» — origin established:** hardcoded
   `<time datetime="2026-06-14">14 июня 2026</time>` in
   `BaptistyRossiiSpravochnikBody.astro:8`, already present in the committed source shadow
   `baptisty-rossii/spravochnik/index.html`, introduced by `b051fd76`
   («feat(baptists): publish reference guide article», dated **2026-06-14**, same commit adds
   `baptisty-rossii/research/13-reference-article-transfer-2026-06-14.md`). It is a page-authored
   publication date that conflicts with the registry/JSON-LD `2026-06-10` — an owner decision, not
   a mechanical substitution.
7. **Byline split `main` vs live:** the four two-date repairs merged via #2146 exist on `main`
   only; live still shows the pre-repair single dates because no release has shipped since
   `d0e04a9c`. Five routes remain single-date on `main`
   (`iniciativnaya-gruppa`, `podpolnaya-pechat`, `sovetskaya-noch`, `vsehib-1944`, `spravochnik`).
8. **Scheduled `Source Link Audit` remains unclassified.** Local reproduction is impossible in this
   sandbox (423 transport warnings / 12 TLS-interception hard errors out of 435 links — sandbox
   artifacts, explicitly not product evidence); job logs and the `source-link-chain-36771339167`
   artifact are unreachable (blob egress denied); check-runs carry no annotations.

## Disposition

- MASTER: new system row `SYS-STRICT-NATIVE-PUBLICATION-COMPLETION` (absorbs the former
  `GBS-ARTICLES-CATALOG-STRICT-NATIVE-OMISSION`; primary manifestation is the release block);
  Baptist copy/date rows updated with the root causes and the newly established 14-June
  provenance; Product/live identity block refreshed.
- PROGRAM_CLOSURE_MATRIX: release-control-plane boundary and Wave 5B Baptist state updated.
- No Product PR was merged, closed, or modified; #2145 remains with its owning agent.

Full evidence, commands, run IDs and boundary notes:
`../../reverify/2026-09-30-release-block-and-baptist-provenance.md`.
