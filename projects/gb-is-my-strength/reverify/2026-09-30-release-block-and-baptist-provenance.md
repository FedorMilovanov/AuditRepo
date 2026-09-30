# Release block after the Lawson publication, and Baptist copy/date provenance

Checked 2026-09-30 (later pass, after AuditRepo #477). Product `main`
`d586aa63f02b569cfe050a63cc9078c044375d8d`; live release `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b`
(`/deployments/d0e04a9c.../35927303479-1.json`, digest `sha256:6bc57487...`); Research `main`
`3d990d840e5708fdc517250031481f8cfafa77de`.

Evidence tiers used below: **source** (exact-SHA files), **artifact/build** (local
production-like build of `d586aa63` in `/tmp/gb-product`), **CI** (GitHub Actions metadata via
API), **live HTTP** (`fetch_page`). No browser rendering was performed in this pass; no Product
code was changed.

## 1. Current Product state that supersedes older prose

| Fact | Value | Witness |
|---|---|---|
| Product `main` | `d586aa63...` | `gh api repos/FedorMilovanov/gb-is-my-strength/commits/main` |
| Live release | `d0e04a9c...` (run `35927303479`) | `https://gospod-bog.ru/deployments/current.json` |
| Last successful `Deploy to GitHub Pages` visible on `main` | run `35796264804`, `d9cbcdb1`, 2026-09-22 | Actions API |
| Deploy failures (all step `Static publication source gates`) | `23bd8567` 11:00:41Z (`36705885839`), `5e76c6ec` 11:07 (`36706604401`), `78af031d` 20:10 (`36770727260`), `0adb8c36` 20:15 (`36771339049`), `d586aa63` 20:26 (`36772631762`) | Actions runs/jobs API |
| Open Product PRs | #2150, #2145, #2144, #2143 (draft), #2142 | `gh pr list` |

The first failing deploy run (`23bd8567`, 2026-09-30T11:00:41Z) is the merge commit of PR **#2148**
(«content(lawson): publish documented study of fall and public credibility», merged
2026-09-30T11:00:37Z, head `f5e36f6a`). Every subsequent `main` push has failed the same step.
Production therefore has not advanced past `d0e04a9c` and does not contain the Lawson route.

> Note on listing completeness: the paginated `branch=main` Actions listing omits several known
> deploy runs (including the successful live release run `35927303479`). Use exact run IDs /
> `head_sha` filters; do not treat a paginated listing as a deploy census.

## 2. Release block: exact boundary (reproduced locally)

Local clone at `d586aa63` with `npm ci` (sandbox node v22.22.3, npm 10.9.8; workflow pins
22.23.1). `npm run validate:static-publication` (the exact command behind the failing step
`Static publication source gates` in `.github/workflows/deploy.yml:148` and
`deploy-candidate-contract.yml:118`) was run step by step: **47 of 48 steps pass; the single
failing step is `node scripts/audit-pro.js`**, whose only error is:

```text
❌ sitemap contract: missing canonical indexable production route: /articles/steven-lawson-samoobman-i-publichnyy-golos/
❌ AUDIT FAILED — fix errors before deploy
```

Machine receipts: `/tmp/chain2.txt` (full chain run), `/tmp/gb-product/audit/audit-pro-2026-09-30T20-50-03-182Z.md`.
The same gate is red on PR #2150's own head `89e76794` (worktree `/tmp/gb2150`, log
`/tmp/audit2150.txt`) — so #2150 as it stands does **not** unblock the release.

Steps after `Static publication source gates` (production-like build, Pagefind, dist publication
audit, JSON-LD/schema audits, browser gates, genealogy gates) were skipped by CI and were **not**
independently run here; the build itself (`npm run strangler:build:production-like`) does pass at
`d586aa63` and emits 104+ routes. The block is therefore proven for the static gate; downstream
steps remain unverified.

## 3. Root cause: two owners disagree about the canonical sitemap set

The new route exists and is production-owned:

- `migration/page-ownership.json:54` — `/articles/steven-lawson-samoobman-i-publichnyy-golos/`
  → `{"owner":"astro","source":"src/pages/articles/steven-lawson-samoobman-i-publichnyy-golos/index.astro","risk":2,"status":"production-dist"}`
- `data/route-profiles/articles-steven-lawson-samoobman-i-publichnyy-golos.json` —
  `currentStatus: production-dist`, `migrationMode: strict-native`, `contentSourceMode: mdx-native`,
  `mdxStatus: canonical`, no `seo.indexable:false`.
- `src/content/articles/steven-lawson-samoobman-i-publichnyy-golos.mdx` +
  `src/pages/articles/steven-lawson-samoobman-i-publichnyy-golos/index.astro` (+ companion
  `Lawson*` components, `src/styles/lawson-article.css`).

It is absent from every discovery surface:

| Surface | Contains the route? | Derivation |
|---|---|---|
| `data/route-search-policy.json` | no | hand-reviewed policy file (`reviewedAt`, `description`) |
| `data/search-manifest.json` | no | policy/manifest normalizer chain |
| `sitemap.xml` (94 `<loc>`) | no | `scripts/sitemap-policy-normalizer.js` (v3) |
| `feed.xml` | no | `scripts/rss-feed-normalizer.js` |
| `scripts/audit-pro.js` expectation | **yes → hard error** | `scripts/lib/sitemap-route-contract.js` via `scripts/lib/effective-route-registry.js`: `owner.status === 'production-dist' && profile.seo.indexable !== false` |

Normalizer eligibility is `POLICY_INCLUDE_AND_PRODUCTION_AND_MANIFEST_AND_VALID_DATE`; because the
route has no policy/manifest row it is never emitted, and the conjunction hides it. Observed
diagnostics on `main`:

```text
✅ Sitemap normalizer v3: sitemap.xml contains every canonically eligible policy route
Sitemap normalizer eligibility: POLICY_INCLUDE_AND_PRODUCTION_AND_MANIFEST_AND_VALID_DATE
Sitemap normalizer skipped diagnostics: /hard-texts/:VALID_DATE_MISSING, /hard-texts/genesis-6/:SEARCH_MANIFEST_ITEM_MISSING, /karty/:VALID_DATE_MISSING, /karty/avraam/:VALID_DATE_MISSING, /map/:VALID_DATE_MISSING
✅ feed.xml exactly matches route policy and search manifest
```

Comparison control: `/hard-texts/genesis-6/` has no manifest row either (it is a deliberate
`searchManifestPolicy: "exclude"` landing) but **is** in `data/route-search-policy.json` and in
`sitemap.xml:496`, so the strict gate is satisfied. Lawson has no policy row at all — that is the
difference.

**The machine repair path cannot fix this class.** The sanctioned writers were run on `d586aa63`
(dist built):

```text
node scripts/search-manifest-policy-normalizer.js --dist=dist --promote-rss-articles --write
  → "No search policy or manifest migration changes required."
node scripts/sitemap-policy-normalizer.js --write
  → "every canonically eligible policy route is already present."
node scripts/rss-feed-normalizer.js --write
  → "RSS feed already matches route policy and search manifest."
git diff --stat → empty
```

The autofix job that would normally repair this class (`search-manifest-autofix` /
«Search manifest, RSS and sitemap autofix» in `.github/workflows/search-manifest-policy.yml`) is
label-gated (`contains(pull_request.labels.*.name, 'autofix')`) and requires `contents: write`;
on PR #2148 that check was **failure**, and the PR was merged with the surfaces unnormalized.
Resolution therefore requires a Product-owner decision: register the route in the canonical
discovery surfaces (route-search-policy → manifest → sitemap/feed) **or** withdraw its
`production-dist` registration.

## 4. Admission boundary observed at the Lawson merge (facts only)

PR #2148 (`f5e36f6a` → merge `23bd8567`) was merged with **22 FAILURE / 12 SUCCESS / 1 SKIPPED**
checks. Failures included `Build and audit production-like candidate`, `validate-release`,
`metadata-ssot-closure`, `native-source-contract`, `Pagefind scripture, noindex and RSS/sitemap
contract`, `Search manifest, RSS and sitemap autofix`, `public-surface-browser-matrix`,
`pixel-diff` and the touch/scroll matrix; `guard` and `Validate source metadata without building
dist` were green.

Bounded claim: a PR that deterministically breaks the release gate was admitted to `main`. This
pass did **not** re-read branch protection (`GET /branches/main/protection` → 403 for the audit
token; `GET /rulesets` → `[]`), so the exact required-check set could not be re-verified here and
is not asserted. The observation is consistent with the previously recorded required-check pair
(`guard`, `Validate source metadata without building dist`) not covering the release contract.

## 5. Baptist visible copy loss (`????`) — root cause and live impact

Counts of literal `????` per published Baptist body component are **identical** on `main`
`d586aa63` and on the live release `d0e04a9c`:

| Component | `????` sequences |
|---|---:|
| `BaptistyRossiiSpravochnikBody.astro` | 481 |
| `BaptistyRossiiPodpolnayaPechatBody.astro` | 431 |
| `BaptistyRossiiIniciativnayaGruppaBody.astro` | 289 |
| `BaptistyRossiiPeterburgskayaLiniyaBody.astro` | 216 |
| `BaptistyRossiiGoneniyaISovestBody.astro` | 177 |
| `BaptistyRossiiYuzhnayaShtundaBody.astro` | 129 |
| `BaptistyRossiiNochNaKureBody.astro` | 118 |
| `BaptistyRossiiVsehib1944Body.astro` | 97 |
| `BaptistyRossiiDvaSezda1884Body.astro` | 88 |
| `BaptistyRossiiBody.astro` (hub), `BaptistyRossiiSovetskayaNochBody.astro` | 0 |

**Origin (git-verified):** the damaged strings were introduced by commit `059b3024`
(`feat(baptists): add authentic historical media and composition guards (#2028)`, 2026-09-13) —
the diff adds them already corrupted, e.g. `+ eyebrow="???????? ?????"`,
`+ marker: '????????', title: '?????? ?????????????'`. ASCII tokens inside the same strings
survive (`Public Domain, CC0`, `Creative Commons-????????`, `SHA-256`, `provenance`), i.e. a
lossy non-ASCII→`?` transformation, not a rendering artifact. `BaptistyEvidenceJourney.astro` is
used by three of the nine bodies; the remaining six carry the corruption in their own props.

**Live impact (witness):** `https://gospod-bog.ru/baptisty-rossii/spravochnik/` (release
`d0e04a9c`) renders the damaged cards verbatim, e.g. `01 ???? ??????? ????? ??????? …`,
`03 ???? ???????? ???????? ? SHA-256`. The defect is visible to readers today, not merely latent
in source.

**Recovery source:** no approved original for these strings was found in the repository. Searches
covered `data/baptisty-rossii-visual-atlas.json` (contains only a related, different caption
«Пять читательских типов свидетельств…»), `baptisty-rossii/research/*` dossiers,
`baptisty-rossii/research/media-ledger.md`, and the deleted media-branch head recorded by #2146
(`320866f994f4372c90e84f97c368bffb1ed942a7`; blob comparison in
`incoming/arena-incompleteness-auditor/2026-09-30/MEDIA_BRANCH_RECHECK.md` covers media files,
not these props). Restoration must use an owner-approved original — do not machine-guess Russian
text. A narrow recurrence guard belongs with the repair (the class is «non-ASCII replaced by `?`
in a published component prop»).

## 6. Baptist byline dates — current main/live split and the origin of «14 июня»

Visible bylines at `d586aa63` (source) and what the live release shows:

| Route | Visible on `main` | Visible on live `d0e04a9c` | Registry `editorialPublishedAt` / `editorialModifiedAt` |
|---|---|---|---|
| `dva-sezda-1884` | 3 июня + 13 июня | only 13 июня | 2026-06-03 / 2026-06-13 |
| `goneniya-i-sovest` | 5 июня + 13 июня | only 13 июня | 2026-06-05 / 2026-06-13 |
| `noch-na-kure` | 1 июня + 13 июня | only 13 июня | 2026-06-01 / 2026-06-13 |
| `yuzhnaya-shtunda` | 2 июня + 13 июня | only 13 июня | 2026-06-02 / 2026-06-13 |
| `iniciativnaya-gruppa` | only 13 июня | only 13 июня | 2026-06-08 / 2026-06-13 |
| `podpolnaya-pechat` | only 13 июня | only 13 июня | 2026-06-09 / 2026-06-13 |
| `sovetskaya-noch` | only 13 июня | only 13 июня | 2026-06-06 / 2026-06-13 |
| `vsehib-1944` | only 13 июня | only 13 июня | 2026-06-07 / 2026-06-13 |
| `spravochnik` | only 14 июня | only 14 июня | 2026-06-10 / 2026-06-13 |
| `peterburgskaya-liniya` (control) | 4 июня + 20 августа | 4 июня + 20 августа | 2026-06-04 / 2026-08-20 |

The four two-date repairs from merged #2146 exist on `main` only; because the release is blocked
(§2), live still shows the pre-repair single dates. `data/editorial-metadata.json` records these
values as *observations*, not sources (`provenance: production-like-dist-migration-freeze`;
`reviewStatus: inconsistent-needs-review` for the five single-date routes).

**Origin of the visible «14 июня 2026» on `/baptisty-rossii/spravochnik/` — established:**

- the byline is hardcoded in `src/components/baptisty-rossii/BaptistyRossiiSpravochnikBody.astro:8`:
  `<time datetime="2026-06-14">14 июня 2026</time>`;
- the same literal `<time datetime="2026-06-14">` is already present in the committed source
  shadow `baptisty-rossii/spravochnik/index.html`;
- git history: `b051fd76` — `feat(baptists): publish reference guide article`, **dated
  2026-06-14**, adds that page (+39 lines) together with the dossier
  `baptisty-rossii/research/13-reference-article-transfer-2026-06-14.md`; `data/series.json` was
  updated in the same commit;
- the strict-native migration carried the literal forward (`003fbb5d2`, 2026-06-23), and the
  registry froze it as an observation.

So «14 июня» is a **page-authored publication date** documented by the publishing commit, not a
garbled copy: it conflicts with the page's own JSON-LD/registry `editorialPublishedAt`
(2026-06-10) and `dateModified` (2026-06-13). The correct resolution is an owner decision about
which event the visible label and JSON-LD describe (reference-guide publication on 06-14 vs the
registry/series publication date 06-10) — not a mechanical substitution. The sibling four routes
keep the same shape of question (visible label shows only the modified date while the registry
records a distinct publication date).

## 7. Scheduled `Source Link Audit` — still unclassified (attempted here)

The gate remains red: push run `36771339167` at `0adb8c36` (2026-09-30T20:15:30Z) fails job
`source-links` at step `Source link audit (production-like dist)`; scheduled run `36403875153` at
`d0e04a9c` (2026-09-28) also failed. Attempted classification in this pass, all blocked by the
sandbox boundary:

- local run of `node scripts/source-link-audit.js --root dist` after a full production-like build:
  435 links, **423 transport warnings / 12 hard errors**, every one of them a sandbox artifact
  (`ECONNRESET` for ordinary hosts; `UNABLE_TO_VERIFY_LEAF_SIGNATURE` for `github.com` behind the
  sandbox TLS proxy) → **not product evidence**; the run cannot classify the CI failure;
- `gh run view --log-failed` and the job-log API fail with transport errors to
  `results-receiver`/`productionresultssa*.blob.core.windows.net`;
- the uploaded artifact `source-link-chain-36771339167` cannot be downloaded (same blob egress
  denial); the check-run exposes no annotations.

Status: **unclassified**, unchanged. Classifying it still requires an environment with open
egress to arbitrary hosts or a working log/artifact channel.

## 8. Open Product PR dispositions (heads re-fetched 2026-09-30)

All five are `mergeable: true` with `mergeStateStatus: UNKNOWN`; all are diverged from `main`.

| PR | Head / compare | Current checks | Recommended disposition |
|---|---|---|---|
| #2150 Lawson catalog projection | `89e76794`, 1 ahead / 3 behind | 14 workflow runs: green `Metadata & IndexNow Readiness`, `Shared Files Guard`, `Glossary Contract`; red `Deploy Candidate Contract`, `Search Modal Contract`, `pixel-diff`, `Editorial Dateline`, `Scripture Occurrence Index`, `Source Authority`, `Metadata SSOT Closure`, `Print Paper`, `Search Cold Bootstrap`, `Site Sections Menu`, `Native Source` | **Keep open, do not merge as a release fix.** Catalog projection is a correct partial repair, but its head still fails `node scripts/audit-pro.js` with the same Lawson sitemap error (local reproduction in §2). Needs rebase on current `main` plus the §3 discovery registration (or withdrawal) before exact-head gates can be meaningful. |
| #2145 apostasy study | `994b8735`, 1 ahead / 33 behind | red: `Build and audit production-like candidate`, `native-source-contract`, `registry-contracts`, `production-like-contract`; 16 green; 3 skipped | **Owned by another agent — not this audit's lane.** Research `main` `3d990d84` closes H1–H6 and opens the P1 exact-locator queue; `PUBLICATION_HOLD` is **not** lifted and no item is `PUBLICATION-CANDIDATE`. Hand off: failing checks above + Research boundary; require rebase, green gates and Research P1 closure before publication. |
| #2144 Dependabot npm-non-major | `892977fd`, 1 ahead / 33 behind (only `package.json` + lockfile) | ~20 red including `npm-audit`, browser/contract matrices | **Not mergeable as-is.** Rebase or let Dependabot refresh; must not be merged while the release gate is red. |
| #2143 genealogy direct-name batch (draft) | `acd4ace4`, 3 ahead / 33 behind (`data/genealogy/v2/*`, 11 name reviews) | 15 checks green **at its old base** | **Keep as draft.** Requires current-base resulting-diff + exact-head gate re-run; the 11 names are batch 1 of 2,825 RU reviews and do not certify edges (Wave 4). |
| #2142 Baptist Chapter-1 authority salvage | `71a4f529`, 1 ahead / 38 behind (one research dossier, +161) | `guard`, `Validate source metadata without building dist` green; autofix skipped | **Keep research-only.** No book/publication admission; the route/publication questions are Wave 5B, not this PR. |

## 9. Row-by-row currency pass over the MASTER defect rows

Method (bounded, no browser): compare the last full browser-wave Product anchor (`d0e04a9c`, which
is also the current live release) with current `main` `d586aa63`, and re-check the named anchors in
source where a row could plausibly have moved.

`git diff --name-only d0e04a9c..d586aa63` = **40 files**, all in these families: Baptist article
bodies/PageHeads (9 components + hub, #2146 date/byline and Delyakov work), six Gill metadata-only
MDX + two heart-book MDX (#2151/#2146), the Lawson publication files, `migration/page-ownership.json`,
`data/editorial-metadata-supplements/lawson-publication-20260930.json`, `css/series-samizdat.css`,
`scripts/guard-shared-files.js`, `sw.js`, `src/lib/asset-version.js`.

No changed file belongs to the owner surface of any admitted defect row. Therefore **no admitted
defect was closed or narrowed by a merged repair since the browser wave**, and their browser
anchors continue to point at the live release `d0e04a9c`:

- quiz: `GBS-QUIZ-NEXT-HIDDEN-GILL-V16`, `GBS-QUIZ-LITERAL-MARKUP`, `GBS-QUIZ-DARK-SURFACE-LOW-CONTRAST`
- print/reader: `GBS-PRINT-TERMINAL-REGION-HIDES-CONTENT`, `SYS-READER-SPEED-KEYBOARD-MODEL`,
  `GBS-HERMENEUTIKA-MOBILE-SPEED-BADGE-UNDERSIZED`
- theme/focus: `GBS-THEME-TOGGLE-FOCUS-INDICATOR-MISSING`, `GBS-GENESIS6-THEME-TOGGLE-LOW-CONTRAST`
- structure/focus: `GBS-AVRAAM-MAP-HEADING-LOST-ON-READY`, `GBS-ANTISOVETOV-NESTED-MAP-TRIGGERS`,
  `GBS-KOD-DA-VINCHI-TIMELINE-KEYBOARD-SCROLL`, `GBS-NAGORNAYA-SOURCE-LINKS-COLOR-ONLY`,
  `GBS-NAGORNAYA-READER-FONT-SCALE-INCOMPLETE`, `GBS-NAGORNAYA-MENU-ICON-MISSING-FORCED-COLORS`
- chrome/navigation: `GBS-MOBILE-CHROME-HIDDEN-FOCUSABLE-BEFORE-SCROLL`,
  `GBS-MOBILE-CHROME-NAVBAR-SYNC-LAG`, `GBS-MOBILE-CHROME-SEARCH-TOUCH-LOAD-RACE`,
  `GBS-BASELAYOUT-MISSING-SKIP-LINK`, `GBS-JOURNAL-MISSING-SKIP-LINK`,
  `GBS-H-SCROLL-TOP-INVISIBLE-FOCUS`, `GBS-HEADER-SEARCH-THEME-TARGET-OVERLAP`,
  `GBS-HEADER-SEARCH-TRIGGER-NOT-WIRED`, `GBS-HOME-SEARCH-DUPLICATE-CLOSE-CONTROLS`
- platform: `GBS-404-RELATIVE-READER-PREFERENCES-ASSETS`
- Baptist (re-scoped this pass): `GBS-BAPTISTS-VISIBLE-COPY-QUESTION-MARK-LOSS`,
  `GBS-BAPTISTS-BYLINE-PUBLICATION-DATE-DIVERGENCE` (see §5–§6)

Anchors directly re-checked in source on `d586aa63` this pass: `reader-preferences-head.js`
(`data-print-keep-next` at lines 166/255/318/445), `css/floating-cluster.css` and `css/site.css`
(`.quiz-next`, `.quiz-wrapper`), `css/mobile-hotfix.css`/`css/home.css` (`outline:0`),
`KodDaVinchiSectionCanon*` (`.ctw-body`), `js/site.js` (`nav-hidden`), `js/*` (`h-scroll-top`,
`quiz-next`). Their presence is source-level confirmation only — the row texts deliberately keep
their 2026-09-29 browser evidence as the reproduction, and none is re-labelled here as a fresh
browser run.

The one row that changed disposition is the catalog row, absorbed into
`SYS-STRICT-NATIVE-PUBLICATION-COMPLETION` in MASTER (its own owner PR #2150 stays open); no other
row was removed, and no new defect row was added beyond the release-block system lane.

## 10. Boundaries of this pass

- No browser (Playwright) rendering was performed; all UI-facing defect rows in MASTER keep their
  previously recorded browser anchors and are **not** re-labelled as freshly browser-verified.
- The local build (`npm ci`, `astro:build`, production-like dist) and Node/npm differ from CI only
  in the patch version of Node (22.22.3 vs 22.23.1).
- Live facts come from `fetch_page` HTTP retrieval of server-rendered HTML, not from a rendering
  browser and not from Search Console.
- No Product code, branch or PR was changed; no Product PR was merged or closed.
