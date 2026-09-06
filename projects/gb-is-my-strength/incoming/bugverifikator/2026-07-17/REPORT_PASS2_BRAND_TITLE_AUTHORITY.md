# INCOMING AUDIT REPORT — Brand-title authority conflict, RSS/search title pollution, and the harness gap that let them ship

## Meta

- Project: `gb-is-my-strength` (`gospod-bog.ru`)
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: `bugverifikator` (pass 2 — extends `incoming/bugverifikator/2026-07-17/REPORT.md`, which audited older HEAD `a2ef67da5`)
- Date: 2026-07-17 (agent local date; GitHub timestamps of the audited anchor are recorded verbatim below and are the authority for ordering)
- Audited branch/ref: `main`
- Audited anchor (SHA): `485db8c25287fa9bd2f53a5356885f02e4b81f4b` (`Merge pull request #1714`, committed `2026-08-18T19:36:32Z`)
- Live anchor: `https://gospod-bog.ru` fetched during this pass; `feed.xml` `lastBuildDate` = `Tue, 18 Aug 2026 19:36:32 GMT` (i.e. live bytes correspond to the audited source SHA)
- AuditRepo anchor: `main` `5ce827a3a09c01e6751a72b38d6f382ff1401996`
- Environment: source tarball of the exact SHA + live HTTPS production fetch (76 sitemap URLs + 114 unique assets)
- Build mode: source + live production (no local build — see limitations)
- Browser / device: none (no JS execution, no rendering)
- Scope: publication metadata authority (page `<title>`), RSS/search-manifest surfaces, the guards that are supposed to protect them
- Explicit exclusions: reader runtime, maps/atlas engine, CSS layers, Bible corpus, Research repo
- Signal class: Product + audit-harness
- Proof state: PASS (all claims below have a reproducible witness)
- Claim boundary: everything is stated about anchor `485db8c2` and the live bytes served at fetch time; no claim about future heads
- Preservation boundary: no Product mutation proposed inside another agent's active lane (see collision check)
- Semantic owner: publication metadata / SEO identity
- Overlapping active owner/PR/branch check (performed before writing):
  - open Product PRs: **0**
  - Product branches: `main`, `agent/antisovetov-title-suffix-20260818` (head `60ed2034`, `2026-08-18T13:02:06Z`), `fix/biografii-recent-heading-20260818`
  - `agent/antisovetov-title-suffix-20260818` **already owns the local D-19 edit** → this report does not open a competing lane for that file; it supplies the mechanism that makes that lane insufficient on its own.

> The anchor records what this pass actually inspected. Do not update this report merely because the source repository later moved.

---

## 0. Summary

| # | Finding | Kind | Impact | New? |
|---|---|---|---|---|
| `N-1` | `scripts/article-headline-contract.js` encodes the **truncated** brand suffix and an autofix job force-pushes it — this machine authority already reverted the human D-19 fix | system-root | high | **new** |
| `N-2` | 4 further production pages ship the truncated suffix (same class as D-19), 2 of them contradicting the recorded metadata registry/baseline | defect | medium | **new** |
| `N-3` | `data/search-manifest.json` carries the brand suffix in 14/76 titles → polluted site-search results and 7/58 RSS item titles; the same article is clean in one feed and suffixed in the other | defect | medium | **new** |
| `N-4` | `contract:compare` (deploy gate) measures **legacy root HTML that is never published**, and the dist comparison downgrades title drift to a warning → structural false-green | audit-harness | medium | **new** |
| `N-5` | Editorial metadata registry `--check` never compares its records with their own `metadataSource`; 0/43 records are `approved`, so the v3 dist projection is a no-op | audit-harness + owner-decision | medium | **new** |
| `N-6` | `[BugHunter]` internal debug tag shipped in a production console message | polish | low | **new** |
| `D-19` | confirmed at HEAD **and live**, plus regression lifecycle witness | confirmation | — | existing |
| `D-20`/`D-21` | my own pass-1 candidates dispositioned: `D-21` confirmed, `D-20` narrowed to owner-decision, one new `/hard-texts/genesis-6/` inconsistency found | disposition | — | — |
| `C-1…C-6` | challenges and negative findings that should stop other agents from acting on wrong or non-existent problems | challenge | — | — |

---

## 1. New observations

### Observation `N-1` — contradictory brand-title authority; the fix loop is machine-reverted

- Title: `article-headline-contract.js` is a *writing* authority that encodes the wrong canonical suffix
- Kind: system-theme / root cause
- Suggested impact: high (it silently reverts correct human fixes on a protected metadata surface)
- Route(s) / owner(s): `/articles/20-antisovetov-pastoru/`; owners `scripts/article-headline-contract.js`, `.github/workflows/indexnow.yml`
- Observed on anchor: `485db8c2`
- Expected: one canonical brand suffix, `" | Господь Бог — Сила Моя"`, with a single writing owner
- Actual: two authorities disagree, and the machine one wins:
  - `scripts/article-headline-contract.js:16` → `titleSuffix: ' | Господь Бог',`
  - `data/public-content-baseline.json` → `"title": "20 антисоветов, как пастору разрушить своё служение | Господь Бог — Сила Моя"`
  - `data/editorial-metadata.json` record `/articles/20-antisovetov-pastoru/` → same **full** suffix, and its `metadataSource` points at exactly the file the script rewrites
  - site convention: among brand-bearing titles in `src/` (literal `<title>` plus `const title = …`), **47 use the full suffix and 5 the truncated one**
- Reproduction / inspection steps (lifecycle witness, all from GitHub API on this repo):
  1. `79e59b64` (`2026-08-18T06:49`, "fix(seo): restore canonical title suffix (D-19)") changed the title **to** `… | Господь Бог — Сила Моя` (1 line, ancestor of `main`);
  2. `23352ca2` (`2026-08-18T11:49`) changed the same line **back** to `… | Господь Бог`;
  3. `23352ca2`'s message is `fix(metadata): normalize canonical article headline` with a `Writer-Lease:` trailer — byte-identical to the commit message hard-coded in `.github/workflows/indexnow.yml` job `headline-autofix`, which runs `node scripts/article-headline-contract.js --write`, commits, and `git push --force-with-lease` to the PR branch;
  4. therefore the revert was produced by the autofix writer, not by a human decision.
- Evidence type: verified-source + verified-lifecycle (+ verified-live via `N-2`)
- Confidence: high
- Limitations of this method: I could not execute the workflow; the identification rests on the exact commit message, the lease trailer and the one-line inverse diff. A CI run log would make it incontestable.
- Possible mechanism: a local repair of `AntisovetovPageHead.astro` (which branch `agent/antisovetov-title-suffix-20260818` currently holds) either (a) gets rewritten again the next time the `autofix` label is applied, or (b) fails `node scripts/article-headline-contract.js` in the same workflow's validation step. **D-19 cannot be closed by editing the `.astro` file alone.**
- Related existing findings: `D-19` in MASTER; sibling report `2026-07-17-d19-antisovetov-title.md`, `2026-07-17-d19-arena-verification.md`, `2026-07-17-full-arena-audit.md` §1 — all of which stop at the symptom line and none of which name the writer.
- Applicability: the anchor is the exact SHA the live site was built from; the two commits are ancestors of that SHA.
- What this evidence does **not** prove: it does not prove which suffix the owner *wants*; it proves only that the repository currently asserts both and that the writing authority contradicts the recorded contracts.

**Minimal root fix (single line, does not collide with the open branch):**

```diff
--- a/scripts/article-headline-contract.js
+++ b/scripts/article-headline-contract.js
@@ -13,7 +13,7 @@ const ARTICLES = [
     canonicalHeadline: '20 антисоветов, как пастору разрушить своё служение',
-    titleSuffix: ' | Господь Бог',
+    titleSuffix: ' | Господь Бог — Сила Моя',
```

After that the existing branch's page fix becomes durable, and `--write` starts repairing drift in the correct direction.

---

### Observation `N-2` — four further production pages ship the truncated suffix

- Title: brand-suffix defect is a class, not a single page
- Kind: defect
- Suggested impact: medium (SERP/social/browser-tab identity inconsistency on 5 of 76 indexable pages)
- Observed on anchor: `485db8c2` + live fetch
- Method: fetched all 76 `sitemap.xml` + `sitemap-pastor-series.xml` URLs and compared the rendered `<title>` against the site convention.

| Live URL | Live `<title>` | Source owner | Contradicts |
|---|---|---|---|
| `/articles/20-antisovetov-pastoru/` | `… \| Господь Бог` | `AntisovetovPageHead.astro:16` | registry + baseline (**= D-19**, owned by open branch) |
| `/articles/kod-da-vinchi/` | `«Код да Винчи»: мифы о Марии Магдалине и Никее \| Господь Бог` | `KodDaVinchiPageHead.astro:14` | `editorial-metadata.json` **and** `public-content-baseline.json` both record the full suffix |
| `/articles/diotrefy-nashego-vremeni/` | `Диотрефы нашего времени: власть, подотчётность и верность \| Господь Бог` | `DiotrophesPageHead.astro:5` | site convention |
| `/nagornaya/` | `Нагорная проповедь — серия из 5 статей \| Господь Бог` | `NagornayaIndexPageHead.astro:20` | site convention (baseline records the truncated form here, i.e. the baseline itself is contaminated for this route) |
| `/pastor-series/` | `Тёмная сторона кафедры — пастырская власть и подотчётность \| Господь Бог` | `PastorSeriesPageHead.astro:5` | baseline records `Тёмная сторона кафедры — Серия материалов \| Господь Бог — Сила Моя` (headline **and** suffix drift) |

- Evidence type: verified-live + verified-source
- Confidence: high for `kod-da-vinchi` and `pastor-series` (an independent recorded contract disagrees); medium for `/nagornaya/` and `/articles/diotrefy-nashego-vremeni/` (convention only — `/nagornaya/` needs an owner ruling because the baseline agrees with the truncated form)
- Limitations: "convention" is statistical (47 vs 5 in `src/`), not a written invariant — see challenge `C-1`
- What this does **not** prove: that all five must be edited in one lane. `/articles/20-antisovetov-pastoru/` is already owned; the other four are unowned.

---

### Observation `N-3` — brand suffix leaks into search results and RSS item titles

- Title: `data/search-manifest.json` titles are not normalized
- Kind: defect
- Suggested impact: medium (visible in on-site search UI and in every RSS reader)
- Route(s) / owner(s): `data/search-manifest.json` → consumed by `js/search.js` (`fetch('/data/search-manifest.json')`, renders `item.title`) and by `scripts/rss-feed-normalizer.js` (`lines.push('<title>' + xmlEscape(item.title) + '</title>')`)
- Expected: item titles are article titles; the site name belongs to the feed `<channel><title>` (already `Господь Бог — Сила Моя`) and to the page `<title>`, not to each item
- Actual, at anchor and live:
  - `data/search-manifest.json`: **14 of 76** items carry the brand suffix (`/`, `/articles/`, `/konfessii/`, `/konfessii/russkij-baptizm/`, `/map/`, `/app/`, `/pastor-series/`, `/articles/diotrefy-nashego-vremeni/`, and 6 `/hard-texts/*`), 62 are clean;
  - live `feed.xml`: 58 items → 51 clean, 6 with the full suffix, 1 (`/articles/diotrefy-nashego-vremeni/`) with the truncated suffix;
  - live `feed-pastor-series.xml`: the *same* Diotrephes article appears as `Диотрефы нашего времени: власть, подотчётность и верность` — clean. **Two published feeds disagree about one article's title.**
- Reproduction: `GET https://gospod-bog.ru/feed.xml` and grep `<item><title>`; compare with `GET https://gospod-bog.ru/feed-pastor-series.xml`.
- Evidence type: verified-live (artifact) + verified-source
- Confidence: high
- Possible mechanism: those 14 manifest rows were populated from page `<title>` instead of the article headline; `rss-feed-normalizer.js` faithfully re-emits whatever the manifest holds, so the data defect fans out to two surfaces.
- Related: shares a root with `N-1`/`N-2` only in *subject* (brand identity), not in owner — this one is data, not the headline contract. Keep as its own work unit.
- What this does **not** prove: that the 14 rows should be edited by hand; a normalizer (strip a trailing ` | Господь Бог…` / ` — Господь Бог…` segment at manifest build time) is probably the durable fix. `scripts/search-manifest-policy-normalizer.js` already exists and is the natural owner.

---

### Observation `N-4` — the deploy gate that should have caught all of the above measures a dead surface

- Title: `contract:compare` extracts from repo-root legacy HTML that `copy-legacy-to-dist.js` never publishes
- Kind: audit-harness defect (false-green)
- Suggested impact: medium (a publication-identity gate that structurally cannot fail on the shipped bytes)
- Owner: `scripts/extract-url-contract.js`, `scripts/compare-url-contract.js`, `package.json` → `validate:static-publication`, `.github/workflows/deploy.yml:101`
- Mechanism, proven from source:
  1. `migration/page-ownership.json` now marks **85 of 86 routes** `owner: astro`, `status: production-dist`;
  2. `copy-legacy-to-dist.js` → `shouldSkipLegacyFile()` skips every legacy file whose route is Astro-owned — so the root `articles/**/index.html`, `hard-texts/index.html`, `nagornaya/**` etc. are **not** in dist;
  3. `contract:compare` = `contract:extract` (default `--root` = **repo root**, `DEFAULT_SKIP` excludes `src`) + compare → it therefore reads exactly those never-published files;
  4. quantified divergence between the dead legacy files and the live bytes for the 43 baseline pages: **5 pages differ in `<title>`**, e.g. legacy `20 антисоветов пастору: как разрушить служение | Господь Бог` vs live `20 антисоветов, как пастору разрушить своё служение | Господь Бог`; legacy `Карта связей | Господь Бог — Сила Моя` vs live `Атлас исследований | Господь Бог — Сила Моя`; legacy `Тёмная сторона кафедры — Серия материалов…` vs live `Тёмная сторона кафедры — пастырская власть и подотчётность…`.
  5. the dist-scoped variant `contract:compare:dist` (deploy.yml:135) *does* read dist — but it is invoked **without `--strict-title`**, and `compare-url-contract.js:89-91` downgrades `title changed` to a warning in that mode. So the only check that can see production titles is configured not to fail on them.
- Evidence type: verified-source + verified-live
- Confidence: high
- Limitations: I could not run `npm ci` / the gate itself (no Node in this environment), so I show scope and configuration, not a captured red/green run.
- Why it matters for the other rows: this is *why* `N-1`/`N-2` reached production and stayed. Fixing the titles without fixing the measurement leaves the same class of risk open — the operating-model criterion for treating it as system work.
- Suggested minimum: run the root-scoped comparison against `dist` only, and pass `--strict-title` in the dist gate (or explicitly document why title drift is allowed to ship as a warning).

---

### Observation `N-5` — editorial metadata registry cannot detect drift from its own source, and its dist projection is a no-op

- Title: registry `--check` validates only the registry file's shape
- Kind: audit-harness defect + owner-decision
- Owner: `scripts/editorial-metadata-registry.js`, `scripts/lib/editorial-metadata-v3.js`, `data/editorial-metadata.json`
- Facts at anchor:
  - `checkRegistry()` runs `validateRegistry(readRegistry())` — structural/semantic validation of the JSON only; it never opens the `metadataSource` file to compare the recorded `title`. Consequence: the registry records the **full** suffix for `/articles/20-antisovetov-pastoru/` and `/articles/kod-da-vinchi/` while the named source files ship the truncated one, and the gate stays green (`deploy.yml:96` runs exactly this check);
  - live cross-check of all 43 records against the rendered JSON-LD: **10 routes** have a `dateModified` that disagrees with `editorialModifiedAt` (registry `2026-06-12` vs live `2026-07-09` on 9 routes; registry `2026-07-11` vs live `2026-07-30` on `/articles/tma-na-serdce/`);
  - **all 43 records** are `reviewStatus: "inconsistent-needs-review"` (`provenance: production-like-dist-migration-freeze`), and `projectDist()` filters to `reviewStatus === 'approved'` → **0 records are projected**. The v3 projection pipeline, its workflow and its guard currently move nothing into dist.
- Evidence type: verified-source + verified-live
- Confidence: high (source), high (the 10 date mismatches are direct live JSON-LD reads)
- Owner decision needed: either the freeze is deliberate (then the registry must be labelled as non-authoritative and its check must stop implying convergence), or the records need review so projection can resume. An agent cannot pick this without the owner.
- What this does **not** prove: that any live date is *wrong* for the reader — only that the registry and the shipped page disagree and nothing in CI notices.

---

### Observation `N-6` — internal debug tag in a production console message

- `js/search.js` (shipped, verified live at `/js/search.js`) contains
  `console.warn("[BugHunter] Search manifest load failed, retrying…")`.
- Kind: polish. Impact: low. Confidence: high (single occurrence in shipped JS; string present in the live file).
- Per the operating model this is **Work Queue**, not MASTER.

---

## 2. Confirmations and extensions

### Confirm and extend `D-19`

- Target: MASTER row `D-19` (`AntisovetovPageHead.astro` malformed `<title>` suffix)
- Evidence angle added: **live production** + **git lifecycle**, on top of the source witness the sibling reports already provided
- My evidence anchor: source `485db8c2` line 16; live `GET https://gospod-bog.ru/articles/20-antisovetov-pastoru/` → `<title>20 антисоветов, как пастору разрушить своё служение | Господь Бог</title>`
- Result: **same symptom, stronger mechanism, broader scope**
- What this changes:
  1. D-19 is *not* a fresh typo — it is a **reintroduced regression** (`79e59b64` fixed it, `23352ca2` machine-reverted it 5 hours later);
  2. it belongs to a 5-page class (`N-2`) plus two downstream surfaces (`N-3`);
  3. its durable owner is `scripts/article-headline-contract.js`, not the `.astro` file;
  4. collision rule: branch `agent/antisovetov-title-suffix-20260818` already holds the page-level edit — **do not open a second lane on that file**; the script-level fix is a disjoint, independently mergeable surface.

---

## 2b. Disposition of my own earlier unproven candidates (`D-20`, `D-21`)

Pass 1 (`incoming/bugverifikator/2026-07-17/REPORT.md`, HEAD `a2ef67da5`) left two candidates `[UNPROVEN]` and asked for a production witness. This pass supplies it.

**Full live taxonomy of the `<title>` brand token across all 76 indexable pages (anchor `485db8c2`):**

| Pattern | Count | Verdict |
|---|---|---|
| `… \| Господь Бог — Сила Моя` | 50 | canonical |
| `… \| Господь Бог` (truncated) | **5** | **defect class** — `N-2` |
| `… — Господь Бог — Сила Моя` (dash instead of pipe) | 2 (`/app/`, `/articles/`) | acceptable variant, no action |
| homepage brand-first title | 1 (`/`) | correct by design |
| `… — Баптисты России` (section sub-brand) | 10 | consistent series convention, no action |
| no brand token at all | **8** | see below |

- **`D-21` (`/articles/kod-da-vinchi/`) → CONFIRMED, promote to current-confirmed.** Live title is `«Код да Винчи»: мифы о Марии Магдалине и Никее | Господь Бог`, while `data/editorial-metadata.json` **and** `data/public-content-baseline.json` both record the full suffix for this exact route. Two recorded contracts + live render = enough for a P2-class row. It is the same class as D-19 and shares the root cause in `N-1`.
- **`D-20` (`/articles/dzhon-gill-istoricheskiy-kontekst/`) → NARROWED, not confirmed as filed.** The page is not an isolated deviation: **all six** Gill pages ship without any brand token (`chast-1…4`, `istoricheskiy-kontekst`, `spravochnik`). A uniform six-page pattern reads as a deliberate long-title trim, not a typo, and no recorded contract contradicts it (these routes are absent from the baseline title set). Recommended status: `owner-decision` (does the Gill series opt out of the brand token?), **not** a defect row.
- **New, found while dispositioning `D-20`: `/hard-texts/genesis-6/` is a real within-section inconsistency.** Its live title is `Бытие 6, Енох, Иуда и Пётр — исследовательская серия` with no brand token, while **all 7 sibling `/hard-texts/*` pages** carry `| Господь Бог — Сила Моя`. The page is `robots: index, follow` (not a holding page), so this is not an intentional exclusion. Confidence: medium-high; owner: the MDX frontmatter title for that entry.

---

## 3. Challenges and negative findings

### Challenge `C-1` — `2026-07-17-full-arena-audit.md` §1 cites an invariant that does not exist

- Claim under challenge: *"`OWNER-INVARIANTS.md` §1 and §3 require canonical suffix ' | Господь Бог — Сила Моя'"*
- Contradictory evidence: `docs/OWNER-INVARIANTS.md` at anchor `485db8c2` is 99 lines with headings §1 «Порядок авторитета», §2 «Контент и правда», §3 «UI и владельческие зоны», §4 «Процесс и доверие», §5 «Verified backlog…». `grep` for `Господь`, `title`, `<title>`, `суффикс` returns **zero matches** in that file.
- Also: the same report cites "line 22" for the `<title>`; at this anchor it is line 16.
- Recommended result: **audit-drift** in the citation, not in the conclusion. D-19 is real, but the authority must be restated as: `data/editorial-metadata.json` + `data/public-content-baseline.json` + the 47-vs-5 source convention. Otherwise the matrix inherits a fabricated citation.

### Challenge `C-2` — `D-NEW-01` "potential reflection in index search" is not a defect

- Target: `2026-07-17-full-arena-audit.md` §4
- Evidence: `src/pages/index.astro:38-57` reads `?q`, then `String(raw).replace(/\s+/g,' ').trim().slice(0,160)` and assigns it to `input.value` of an `HTMLInputElement` (guarded by `instanceof`). There is no HTML sink, no `innerHTML`, no `eval`, no URL sink; the report itself concedes `input.value` is safe.
- Recommended result: **invalid** — must not enter MASTER.

### Challenge `C-3` — "search lazy loader double execution" is a style drift, not a residual

- Target: `2026-07-17-search-lazy-drift.md`
- Evidence: `src/layouts/BaseLayout.astro:199` uses `o&&window.GBSearch&&window.GBSearch.open&&window.GBSearch.open()`; `js/search.js` uses `if(open&&window.GBSearch&&window.GBSearch.open)window.GBSearch.open()`. These are semantically identical, and the report states it "functionally works". No current defect witness, and the title claims "double execution" which the cited code does not show.
- Recommended result: **parked / Work Queue** (snippet unification), **not** a MASTER narrowed residual.

### Negative `C-4` — the 8 `karty` routes missing from `sitemap.xml` are correct

`/karty/{early-church,maccabim,melachim,pavel,revelation,shoftim,shvatim,yeshua}/` are absent from `sitemap.xml`, and `/izbrannoe/` too. This is **intentional**: all 8 render `KartyHoldingPage.astro`, which is `noindex` + `data-pagefind-ignore` until visual audit, and `astro.config.mjs` explicitly filters `/izbrannoe`. Do not "fix" the sitemap. Coverage of the remaining routes is exact: 76 sitemap URLs vs 85 production routes, difference = exactly these 9.

### Negative `C-5` — the Gill slug/part-number inversion is deliberate, do not touch URLs

`/articles/dzhon-gill-chast-3-nasledie/` serves «Часть IV: Наследие» and `/articles/dzhon-gill-chast-4-ekzeget/` serves «Часть III: Экзегет». Title, H1, description ordinal and the series navigation all agree (`Читать Часть III →` → `…chast-4-ekzeget`), and the progress widget reads «Часть 2 из 4». Only the historical slugs are inverted. Renaming them would break canonical URLs for no reader benefit → **accepted-risk / not-worth-fixing**, recorded here so the next agent does not "repair" it.

### Negative `C-6` — `/sitemap-index.xml` 404 is by design

`copy-legacy-to-dist.js:183-188` deliberately removes Astro's partial `sitemap-index.xml` / `sitemap-N.xml` shards because they list Astro-owned routes only; the curated root `sitemap.xml` + `sitemap-pastor-series.xml` are the advertised ones and `verifyAdvertisedSitemaps()` fails closed if `robots.txt` advertises a missing one. Live `robots.txt` advertises exactly those two, both `200`.

### Clean sweeps (no finding — recorded so the next wave can skip them)

Across all 76 live indexable pages: canonical present, single, and self-referencing (76/76); exactly one `<h1>` (76/76); `og:image` present (76/76); `<html lang="ru">` (76/76); zero duplicate `id`s; zero unresolved `aria-labelledby` / `aria-describedby` / `aria-controls` / `aria-activedescendant` / `label[for]` targets; zero dead in-page `#fragment` links; 114/114 referenced assets return `200`; `/app/` nav link present on 75/75 pages other than `/app/` itself (the #1704/#1710 discoverability lane is genuinely complete); no `<meta name="description">` actually missing (an attribute-order artefact — `<meta content="…" name="description">` — produced 7 false positives in my first pass and is retracted here).

---

## 4. Root-cause clusters

### Cluster `brand-identity-authority`

One question — *who owns the site-name string on a published surface?* — currently has four uncoordinated answers:

| Authority | Says | Can write? |
|---|---|---|
| `scripts/article-headline-contract.js` | `" | Господь Бог"` | **yes** (`--write` + force-push via `indexnow.yml`) |
| `data/editorial-metadata.json` | `" | Господь Бог — Сила Моя"` | no (never compared with source) |
| `data/public-content-baseline.json` | `" | Господь Бог — Сила Моя"` (contaminated for `/nagornaya/`) | no (compared against a dead surface, warning-only) |
| `data/search-manifest.json` | mixed: 14/76 items keep the suffix | yes → RSS + search UI |

Merge criterion from the operating model is met: one mechanism explains ≥3 symptoms (`N-1`, `N-2`, `N-3`), a local patch leaves the same class of risk (`N-4`), and the defect **already returned once** (`79e59b64` → `23352ca2`). Recommend one system lane *plus* the small independent data lane, not five page edits.

---

## 5. Suggested MASTER delta (owner/verifier decision, not applied by me)

Proposed, in the operating model's terms:

- `D-19` — **keep**, but restate as *reintroduced regression*, add the live witness, and point the row at the branch that owns the page edit; note that closure requires the script change, otherwise the row will return.
- **new system row** `SYS-BRAND-TITLE-AUTHORITY` — `N-1` + `N-2` + `N-4`: one writing owner for the brand suffix, correct suffix in `article-headline-contract.js`, dist-scoped and `--strict-title` publication comparison.
- `D-21` (`/articles/kod-da-vinchi/`) — **promote** from unproven candidate to current-confirmed defect, absorbed by the same system row.
- `D-20` — **do not admit as a defect**; convert to an owner-decision question about the Gill series brand token, or drop.
- **new current defect row** `SEARCH-MANIFEST-TITLE-SUFFIX` — `N-3` (14 manifest rows → 7 RSS items; two feeds contradict each other for one article).
- **new owner-decision row** `EDITORIAL-REGISTRY-FREEZE` — `N-5`: 0/43 approved ⇒ projection is a no-op; decide freeze-or-review, and make `--check` compare against `metadataSource` (or stop implying convergence).
- **Work Queue, not MASTER**: `N-6` (`[BugHunter]` log tag), `C-3` (search snippet unification).
- **Do not admit**: `C-2` (invalid), and correct the citation in the existing D-19 evidence per `C-1`.

## 6. Limitations of this pass

- No Node/npm in this environment → no `npm ci`, no `astro build`, no execution of the repository's own guards; every harness claim is a scope/configuration reading of the script source plus a live consequence, not a captured CI run.
- No browser → no rendered-DOM, focus-order, contrast or reduced-motion evidence; the a11y sweep above is static-HTML only.
- Live fetches are a snapshot; `feed.xml` `lastBuildDate` matches the audited SHA, which is what ties the live and source witnesses together.
- Nothing here was pushed to the Product repo; no branch, no PR, no file mutated.
