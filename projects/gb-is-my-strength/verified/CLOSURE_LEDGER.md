# Closure Ledger — gb-is-my-strength

Append-only журнал компактных результатов verification/repair waves.

Цель — сохранять полезную историю без разрастания активного backlog и без обязательного exact-authority пересказа каждого Product merge.

## Current authority note

`MASTER_BUG_MATRIX.md` хранит только текущую верифицированную нужную работу и не содержит закрытых исторических строк. Этот ledger, verification/evidence, `legacy/` и Git history сохраняют provenance закрытий. Новая запись здесь не возвращает work unit в MASTER без свежей admission-проверки.

Новая запись не обязана сопровождаться отдельным `reverify/` документом. Он нужен только для спорного, системного, security/live/rights или исторически ценного решения.

---

## Entry format

```md
## YYYY-MM-DD — <wave or closure title>

- Scope: <single finding / cluster / system theme / owner decision>
- Inputs: <reports, matrix IDs or themes>
- Result:
  - closed-by-fix: ...
  - absorbed-by-system-fix: ...
  - stale/invalid: ...
  - parked/accepted-risk: ...
  - remaining independent: ...
- Product evidence: <PR/commit/contract links or “no Product mutation”>
- Regression witness: <what protects the result>
- Live evidence: required + obtained / not required / not claimed
- Detailed evidence: <optional link>
```

Do not copy every workflow run, later blob SHA or unrelated current HEAD into the entry.

---

## 2026-08-06 — AuditRepo operating-model reform initiated

- Scope: AuditRepo governance and documentation.
- Result:
  - defined AuditRepo as evidence memory rather than Product mirror;
  - replaced global-HEAD synchronization with event-driven current checks;
  - made evidence proportional by independent angles;
  - introduced optional work queue and system-theme map;
  - moved deep forensic toward periodic/manual execution;
  - preserved the existing matrix intact for gradual migration.
- Product evidence: no Product mutation and no finding disposition change.
- Regression witness: AuditRepo documentation/CI validation on the reform branch.
- Live evidence: not applicable.

This entry records the governance change only. It does not claim that the reform PR has merged until GitHub shows the final merge.

## 2026-08-06 — Strangler inventory verification wave

- Scope: `ST-STRANGLER`, historical `R-007` and `STRANGLER-HYGIENE` evidence family.
- Inputs: Product ownership manifest, committed public indexes, current legacy-shadow parity harness.
- Result:
  - verified-at-anchor: **52 public indexes = 51 Astro shadows / 4,026,027 bytes + 1 independent built app / 2,245,854 bytes; unowned 0**;
  - systemic-root: parity/reference authority is coupled to every committed Astro shadow;
  - invalidated approximation: the old `50/53` wording is not the exact inventory at this anchor;
  - remaining independent: storage/maintenance duplication remains, but current deletion-ready count is **0**;
  - owner exception: the Baptists 3D `_app` is explicit built-app ownership and is not a retirement candidate.
- Product evidence: PR #1082, merge `76737eefe16a0feb2fdf729c805d17b5cdcdc376`, exact tested head `e15afda5681ce4e2f0a713e6e7f0ca2afbb0efae`.
- Regression witness: dependency-free inventory self-test plus the existing Shared Files Guard integration; `legacy-shadow-wrapper-audit.js` remains unchanged.
- Live evidence: not required and not claimed.
- Detailed evidence: `../verification/2026-08-06-strangler-inventory-wave/REPORT.md`.

## 2026-08-06 — Bible corpus rights and provenance verification wave

- Scope: `ST-CONTENT-AUTHORITY` / `SEARCH-P2-07`.
- Inputs: current Product Bible owners plus Research PR #149 rights/provenance authority and machine ledger.
- Result:
  - verified candidate: exact CrossWire `RusSynodal` 1.9.1 is `CANDIDATE_ONLY` because institutional records identify `Public Domain`;
  - archive hold: official raw endpoint is known, but archive bytes, SHA-256, embedded configuration, book manifest and Product mapping were not obtained;
  - rejected shortcut: `RusSynodalLIO` is copyrighted and its CrossWire permission is not a general downstream licence;
  - rights hold: Cassian remains permission-controlled and cannot be expanded or republished from open-web copies;
  - remaining independent: exact acquisition, 66-book/versification mapping, verse-level comparison/import, complete per-record provenance and Product release evidence;
  - finding state: `SEARCH-P2-07` remains open; matrix arithmetic is unchanged.
- Product evidence: no Product mutation; evidence anchor `76737eefe16a0feb2fdf729c805d17b5cdcdc376`.
- Regression witness: Research `Repository authority integrity` run `31097491083` on exact head `be5354b92aa4ab1de6d9483c7b93740e2ff6ab34`; Research merge `d52ea9d54dd2c2488223d25f5f6cefd263c23328`.
- Live evidence: not required and not claimed.
- Detailed evidence: `../verification/2026-08-06-bible-corpus-rights-wave/REPORT.md`.

## 2026-08-06 — Search platform labels and Home footer closure

- Scope: `SEARCH-P3-01`, the repeated `HOME-P3-FOOTER-EDGE-CONSOLE` signal, and the obsolete predecessor transport recorded in Product PR #1074.
- Inputs: current Product command-palette owner, exact Chromium/WebKit browser evidence, Product control-plane policy and the Home responsive geometry contract.
- Result:
  - closed-by-fix: global Search triggers now expose exact `Ctrl+K` on Windows and `⌘+K` on Apple platforms through the existing `js/search.js` owner;
  - closed-by-fix: the Home footer has a real mobile viewport inset of at least 20 px, including safe-area insets, while the existing 17 px assertion remains unchanged;
  - absorbed-by-system-fix: duplicate Home/App platform-label helpers were removed in favour of the existing global owner;
  - rejected architecture: no separate global trigger-label runtime, no global `MutationObserver`, no Search writer inside the Glossary workflow and no surviving temporary write capability;
  - predecessor disposition: Product PR #1074 closed as superseded and its `autofix` label was removed; its branch was not deleted;
  - remaining independent: none for `SEARCH-P3-01` or the Home footer geometry signal.
- Product evidence: PR #1079, exact tested head `0bbeb51f93ae364d1f05721e7180e612d2b57f90`, merge `a55a03851506945ef61bb753efe58205d231a807`.
- Regression witness: all 25 exact-head pull-request workflows passed, including Search Modal, Shared Files Guard, Source Authority, Route Registry Chromium/WebKit surfaces, Runtime Interactive Audit, Home Chromium/WebKit interaction/lifecycle/A13 and Visual Parity policy.
- Live evidence: not required and not claimed.
- Detailed evidence: Product PR #1079 body and exact-head workflow evidence; no separate reverify document required.

## 2026-08-06 — AuditRepo maintenance backlog consolidation

- Scope: historical `AR-001`, `AR-004` and `AR-005` under the broader `ST-AUDIT-HARNESS` quality theme.
- Inputs: AuditRepo operating-model PR #196, validator/intake hardening PR #201 and the current proportional verification/reverify policy.
- Result:
  - closed-by-fix: `AR-001` — validator/scaffold hardening now blocks overwrite, traversal, invalid dates, placeholder anchors and template-only reports, with black-box regressions and same-PR concurrency cancellation;
  - absorbed-by-system-fix: `AR-004` — the useful verification goal is now owned by package waves, independent evidence angles, lightweight ordinary-PR checks and periodic/manual deep forensic rather than one mandatory protocol automator;
  - stale/retired: `AR-005` — blanket reverify automation is intentionally not a current invariant; narrow current checks and separate reverify documents are created only when selected evidence or risk justifies them;
  - remaining independent: `ST-AUDIT-HARNESS` stays active as a quality lens, and any future concrete false-green/false-red or evidence-integrity defect must be opened as its own bounded finding.
- Product evidence: no Product mutation; AuditRepo PR #196 merged as `1fd204f0f7c76ead6dc7ab22b2a7feb46c0fc297`, PR #201 merged as `a0e49cec76173911b9cb489173d7729e5617a8e1`.
- Regression witness: PR #201 exact head `e1a2b2f565888b92a256da8cfea5644874fe1e4f`; AuditRepo Validate run `31098233305` passed compilation, structure, repository rules, validator regressions, scaffold regressions and clean-tree checks.
- Live evidence: not applicable and not claimed.
- Detailed evidence: `../verification/2026-08-06-auditrepo-maintenance-consolidation/REPORT.md`.

## 2026-08-06 — Route-scoped TTS loading absorbed by the current reader architecture

- Scope: historical `R-006` under `ST-PERFORMANCE` and `ST-RUNTIME-OWNERSHIP`.
- Inputs: current Product reader owner, representative unrelated native routes, Vosk document/Worker boundary, permanent TTS contracts and Product PR #876 evidence.
- Result:
  - absorbed-by-system-fix: unrelated representative Home/strict-native app routes do not mount `ReaderActionsRuntime`;
  - intended inclusion: `/baptisty-rossii/` mounts the runtime because it exposes a real PLAY control and speakable article body;
  - lazy heavy boundary: a plain page open does not create the Worker or request the model; user playback selects system speech and only then warms Vosk in the background;
  - worker ownership: model download, integrity verification, extraction, IndexedDB, ONNX preparation and synthesis remain outside the document main thread;
  - no measured residual: no current evidence demonstrates user-visible or operational harm from the lightweight bootstrap on eligible reader pages;
  - remaining independent: `R-005` and any future concrete route/request regression with direct measurement.
- Product evidence: current anchor `a55a03851506945ef61bb753efe58205d231a807`; no Product mutation. System repair PR #876 merged as `0d60315d37efd5b47c76795f8167e99398a5b7e3`.
- Regression witness: PR #876 exact tested head `4f42dc9b1da39cdc3d6d70360d0535a4418d8a8e` proved 56 routes × desktop/mobile = 112/112, exactly one 280,394,098-byte model request, Worker reuse and a 32.7 ms maximum UI heartbeat gap; current consent contract rejects heavyweight document-client ownership and premature Worker-start regressions.
- Live evidence: not required and not claimed.
- Detailed evidence: `../verification/2026-08-06-r006-tts-loading-wave/REPORT.md`.

## 2026-08-12 — Gill / Shared Files control-plane marathon terminal closure

- Scope: Product #474 assurance signal, Gill production-readiness oracle/evidence, Shared Files Guard closed-PR lifecycle applicability, post-merge Node Toolchain recovery and final Product-zero census.
- Inputs: Product PRs #1668, #1669 and #1667; exact candidate/main workflow evidence; retained Gill production evidence; final zero census.
- Result:
  - closed-by-fix: Gill production-readiness evidence is retained and the exact known optional HDRC transport outcomes are classified without wildcarding unrelated failures;
  - closed-by-fix: Shared Files Guard classifies explicitly closed PR lifecycle events N/A before live merge-ref authority, while open PR and push behavior remain applicable/fail-closed;
  - recovered-proof: Node Toolchain `31636750010` failed attempt 1 only at workflow lint and passed attempt 2 after exactly one effective failed-jobs rerun on the identical Product SHA, with no code/config/dependency change;
  - live release: Deploy `31636750081`, attempt 1, completed readiness, production Gill, Pages promotion, generic live witness, TTS witness and IndexNow successfully;
  - terminal census: Product `main` `64bb04bda2b228ef23c20214199b67b987c1eb94`; open PRs 0; open issues 0; open `ci-failure` issues 0; in-progress/queued main workflows 0/0;
  - remaining independent: none from these assurance/SYSTEM lanes.
- Product evidence: #1668 merge `1fe119c732aa3486fd384b65e6d9e638328c0676`; #1669 merge `74f11005f6c44e6989fa72661b4bd9965368230b`; #1667 final merge `64bb04bda2b228ef23c20214199b67b987c1eb94`.
- Regression witness: exact-head #1667 admission checks all green; final main Metadata `31636750134`, Shared Files Guard `31636749988`, Source Authority `31636750093`, Node Toolchain attempt 2 `31636750010`, Deploy attempt 1 `31636750081`, Deployment Witness Ledger `31638307040` all SUCCESS.
- Live evidence: required and obtained through successful Pages promotion plus generic live and TTS witnesses in Deploy `31636750081`.
- Detailed evidence: `./CONTROL_PLANE_FINAL_CLOSURE_2026-08-12.md`.


## 2026-08-19 — Post-advance reverify + consolidation wave (485db8c → cb3681e)

- Scope: all 13 current defects + 1 improvement + 2 system lanes in `MASTER_BUG_MATRIX.md`, re-checked after Product `main` advanced 14 commits (485db8c → cb3681e).
- Inputs: `incoming/bugverifikator/2026-08-19/` (REPORT + 5 EVIDENCE + 6 COMMENT + VERIFIER_SYNTHESIS); arena-agent surface-pass-4/5/6 findings (anchor 485db8c); existing comment-* corpus.
- Current-check anchors: Product `main` HEAD `cb3681e` (committed 2026-08-19T00:30Z) source tree; live HTTP fetch of `/app/`, `/rodosloviye/`, `/articles/lot-i-sodom/`, `/articles/dzhon-gill-chast-3-nasledie/`, `/articles/dzhon-gill-chast-4-ekzeget/`; committed production-like artifacts (`articles/dzhon-gill-chast-3-nasledie/index.html`, `…/chast-4-ekzeget/index.html`, `rodosloviye/index.html`, `articles/20-antisovetov-pastoru/index.html`); Product branch census.
- Result:
  - closed-by-fix: `ANCESTOR-TRACING-INCOMPLETE` — `computeFocusLineage` on cb3681e walks `father ?? mother` + BFS queue (the originally proposed fix is live); multiparent lane `b84aa56`.
  - stale: `UI-DUPLICATE-SEARCH-BUTTONS` — `ui/Header` only on BaseLayout pages, `ReaderPreferencesHead` only on {/articles/,/biografii/,/pastor-series/}; disjoint; absent in committed artifact; search lane reworked (`e6972ea`).
  - invalid: `ARTICLE-LAYOUT-SERIES-HARDCODE` — carrier `ArticleLayout.astro` is orphaned (zero `src/` importers); symptom not in production artifact.
  - invalid-as-framed: `METADATA-FUTURE-DATED` — 2026-08-17 is in the past vs repo effective today ≈2026-08-19; the original "future" claim used a shell clock (2026-07-17) contradicting repo material timestamps. Literal-date concern parked in WORK_QUEUE.
  - absorbed-by-system-fix (symptom): `SECURITY-CSP-INCONSISTENCY` — one mechanism (per-head hand-written CSP) explains the 4 `img-src` variants; absorbed into `FRAGMENTED-SECURITY-OWNERSHIP` (kept in MASTER only as the named manifestation).
  - reworded/narrowed: `MOBILE-CHROME-REGISTRY-GAPS` → Genesis-6 article pages lack a mobile bar (pastor-series covered via SeriesReaderChrome); moved to Narrowed residuals + owner-decision. `SECURITY-CSP-GAPS` → BaseLayout pages (`/hard-texts/genesis-6/`, `/izbrannoe/`) in source; `/app/`+`/rodosloviye/` already CSP in live/artifact (source-vs-artifact divergence noted).
  - re-anchored root + impact: `SERIES-ORDER-INDEX-MISMATCH` → root `gillSeriesData.ts` `GILL_SERIES_ITEMS` (not dead `site.ts` `SERIES_ORDER`); impact low → medium; confirmed source + live + artifact.
  - pending: `ARTICLE-AUTHOR-HARDCODED` shares the dead `ArticleLayout` carrier — pending live-carrier re-check before staying.
  - parked: `TRACE-GOLDEN-PATH-PERF` remains optional in WORK_QUEUE (not necessary-current).
  - remaining independent and active: `RODOSLOVIYE-OG-IMAGE`, `SERIES-ORDER-INDEX-MISMATCH`, `ARTICLE-AUTHOR-HARDCODED` (pending), `GENEALOGY-NO-ERROR-BOUNDARY`, `GENEALOGY-ID-INVALID-SPACE`, `EDITORIAL-LABEL-INCONSISTENCY`, `SECURITY-CSP-GAPS` (narrowed); system lanes `METADATA-SSOT-PROLIFERATION`, `FRAGMENTED-SECURITY-OWNERSHIP`; owner decision `MOBILECHROME-GENESIS6-BAR-DECISION`.
- Product evidence: no Product mutation by this agent. Existing owner lane `agent/antisovetov-title-suffix-20260818` (60ed203) already owns the antisovetov title-suffix symptom (D-19); not re-filed, no competing lane created.
- Regression witness: no Product change, so no new regression suite; dispositions rest on cb3681e source + live + committed-artifact angles. A fresh `astro:build` green run remains the owner's closure witness for any future repair lane.
- Live evidence: obtained for `RODOSLOVIYE-OG-IMAGE` and `SERIES-ORDER-INDEX-MISMATCH` (HTTP meta + nav cards); explicitly unnecessary for `GENEALOGY-ID-INVALID-SPACE` (data/source claim) and the dead-carrier invalidations (usage census suffices); not obtained for `GENEALOGY-NO-ERROR-BOUNDARY` (flagged needs runtime) and `SECURITY-CSP-GAPS` on `/hard-texts/genesis-6/`+`/izbrannoe/` (flagged needs live fetch).
- Detailed evidence: `../incoming/bugverifikator/2026-08-19/REPORT.md`, `…/EVIDENCE_*.md`, `…/COMMENT_*.md`, `…/VERIFIER_SYNTHESIS_gb-is-my-strength_2026-08-19.md`.

## 2026-08-19-b — arena-bugverifikator MASTER consolidation (SERIES-ORDER / Genesis-6 mobile / genealogy children)

- Scope: consolidation of intake `incoming/arena-bugverifikator/2026-08-19/` (PR #339) into active MASTER; no Product mutation.
- Inputs:
  - `incoming/arena-bugverifikator/2026-08-19/REPORT.md`
  - `COMMENT_SERIES-ORDER-INDEX-MISMATCH.md`
  - `COMMENT_MOBILE-CHROME-REGISTRY-GAPS.md`
  - `EVIDENCE_GENEALOGY-CHILDREN-UNRESOLVED.md`
  - `WITNESS_MATRIX.md`
  - Product anchor `cb3681e` + live `gospod-bog.ru` (same-day)
- Result:
  - accepted-product-state / invalid-as-defect: `SERIES-ORDER-INDEX-MISMATCH` — intentional 2026-07-09 Gill display reorder locked by `scripts/gill-series-data-consistency-audit.js` (`expectedOrder` part4 before part3; roman III/IV match live titles). Removed from MASTER. Optional slug hygiene is Work Queue only, not a defect.
  - closed-by-fix: `MOBILE-CHROME-REGISTRY-GAPS` — Genesis-6 article pages already mount `SeriesReaderChrome → GillSeriesChrome → GillSeriesMobileBar`; live Enoch/corpus/audit routes carry mobile bottom-bar markers. Removed from MASTER.
  - decision-resolved / dropped: `MOBILECHROME-GENESIS6-BAR-DECISION` — bar already present; owner choice no longer blocks work. Removed from MASTER.
  - admitted: `GENEALOGY-CHILDREN-UNRESOLVED` — 59 dangling `children[]` refs (58 unique ids) in `genealogy.json`; runtime silently drops; `_status` overclaims integrity. Added under CURRENT DEFECTS next to other genealogy integrity rows.
  - reconfirmed retained: `RODOSLOVIYE-OG-IMAGE`, `EDITORIAL-LABEL-INCONSISTENCY`, `GENEALOGY-ID-INVALID-SPACE`, `GENEALOGY-NO-ERROR-BOUNDARY`, CSP pair + `FRAGMENTED-SECURITY-OWNERSHIP`, `SW-PWA-FRESHNESS`, `AR-IDX-JS-02-MULTIWRITER`, `MISSING-BUTTON-TYPE` / `SITEWIDE-BTN-TYPE-AUDIT`, `SEARCH-LAZY-LOADER-DRIFT`, `METADATA-SSOT-PROLIFERATION` (wording updated: no longer lists SERIES-ORDER as a fed defect; notes dead layouts).
  - MASTER arithmetic after wave: **14** active units (7 defects + 4 residuals + 3 system + 0 owner).
- Product evidence: no Product mutation; boundary remains Product `main` `cb3681e1a85b5f8919c9dc537f812a842bbe9235`.
- Regression witness: intake multi-angle package under `incoming/arena-bugverifikator/2026-08-19/`; product Gill consistency audit remains the lock against accidental order «fixes».
- Live evidence: obtained for OG/nav/Gill titles/Genesis-6 bar markers (2026-08-19 HTTP GET); genealogy children claim is source-only.
- Detailed evidence: `../incoming/arena-bugverifikator/2026-08-19/REPORT.md`

## 2026-08-19-c — arena-bugverifikator admissions + measurement rewordings (post-`cb3681e`)

- Scope: the part of the arena-bugverifikator pass that wave `2026-08-19-b` did not absorb — 2 new admissions, 4 measurement rewordings, 1 retraction by the same agent. No Product mutation.
- Inputs: `incoming/arena-bugverifikator/2026-08-19/` (report, `tools/`, `evidence/`), `incoming/2026-08-19-comment-missing-button-type.md`, `reverify/CURRENT_HEAD_REVERIFY_2026-08-19_arena-bugverifikator-6-row-disposition-cb3681e.md`.
- Result:
  - admitted (current defect): `RSS-SERIES-DATE-COLLAPSE` — live `feed.xml` carries 9 distinct `pubDate` across 58 items; the «Баптисты России» series ships 11 items on one date while the pages' JSON-LD spans 2026-06-01…06-10 (Δ up to 17 days), so ordering falls through to the alphabetical slug tie-break and part 3 is published before part 1. Mechanism: `scripts/rss-feed-normalizer.js:78` reads `data/search-manifest.json`; the page reads its own head component (`BaptistyRossiiDvaSezda1884PageHead.astro:28`); tie-break at `:96`.
  - admitted (current defect, low): `APP-MASK-NO-WEBKIT-FALLBACK` — `src/pages/app/index.astro:138` and `src/components/map/MapStyles.astro:255,451` ship `mask-image` with no `-webkit-mask-image` pair; confirmed in the published bundle `/_astro/index.FPviil9R.css` (zero `-webkit-mask` occurrences), against the project's own paired convention.
  - reworded (no status change): `SECURITY-CSP-INCONSISTENCY` re-measured to 5 `img-src` variants / 8 full CSP strings across 84 CSP-bearing live pages plus 18 pages without `X-Content-Type-Options`; `MISSING-BUTTON-TYPE` and `SITEWIDE-BTN-TYPE-AUDIT` marked latent (226 rendered instances, 0 inside a `<form>`, no `form=` attribute); `METADATA-SSOT-PROLIFERATION` gained a measurable date-SSOT closure criterion (0 of 43 records may remain `inconsistent-needs-review`; `sitemap lastmod` ≠ JSON-LD `dateModified` on 40 routes) and now also feeds `RSS-SERIES-DATE-COLLAPSE`; `SW-PWA-FRESHNESS` gained the live corroboration that 84/84 pages request runtime JS revisioned, so the bare precache entry is reachable only through an unversioned request.
  - corroborated, not re-decided: the three retirements of wave `2026-08-19-b` (`SERIES-ORDER-INDEX-MISMATCH`, `MOBILE-CHROME-REGISTRY-GAPS`, `MOBILECHROME-GENESIS6-BAR-DECISION`) and the earlier `ARTICLE-AUTHOR-HARDCODED` removal rest on the same evidence package; nothing is reopened here. The wave5 narrowing of `SW-PWA-FRESHNESS` is accepted as the better formulation.
  - retracted by the same agent: the intake claim «7 live pages carry no CSP meta» was a regex artifact (Astro pilots emit `content=` before `http-equiv=`). Order-insensitive re-parse gives **0** live pages without CSP; `SECURITY-CSP-GAPS` stands as written.
  - parked (not MASTER): `GILL-SLUG-NUMBERING-LEGACY` (URL slug ≠ displayed part number; needs 301s plus sitemap/RSS/manifest/canonical sync), `PAGEFIND-STATIC-FRESHNESS-MEASUREMENT` (cache-first `/pagefind/*` under a `CACHE_VERSION` unchanged since 2026-08-04; no runtime witness).
  - re-retired (accidental resurrection, no new witness): `MOBILE-CHROME-REGISTRY-GAPS`, `MOBILECHROME-GENESIS6-BAR-DECISION` — both were closed by wave `2026-08-19-b` and reappeared in the `bb7bd81` matrix rewrite without being mentioned in it.
  - evidence recovery: the PR #336 intake body, overwritten by PR #339, was restored byte-identical from `935fe31` as `incoming/arena-bugverifikator/2026-08-19/ARENA_FULL_SURFACE_PASS_2026-08-19.md`; the parallel pass keeps its own `REPORT.md`. The same commit repairs the red `auditrepo-validate` on `main` (intake README had no identity markers since `d95b648`).
  - MASTER arithmetic after this wave: **13** active units (7 defects + 0 improvements + 3 residuals + 3 system lanes + 0 owner decisions).
- Product evidence: no Product mutation by this agent; active Product PRs #1721/#1722 inspected, no overlap, no competing lane created.
- Regression witness: reproducible scanners in `incoming/arena-bugverifikator/2026-08-19/tools/`; a date-SSOT guard becomes the durable witness once the RSS repair lands.
- Live evidence: required and obtained — 84 live pages, `feed.xml`, `sitemap.xml`, `sw.js`, `/_astro/index.FPviil9R.css` (2026-08-19).
- Detailed evidence: `../reverify/CURRENT_HEAD_REVERIFY_2026-08-19_arena-bugverifikator-6-row-disposition-cb3681e.md`.

## 2026-08-20 — forensic verifier consolidation (#344 → causal MASTER)

- Scope: merged forensic evidence package #344 plus current 13-row MASTER; causal deduplication and current-check only. No Product mutation.
- Inputs: `incoming/chatgpt/2026-08-19/README.md`, `VERIFIER_SYNTHESIS_TARGET_MATRIX_2026-08-20.md`, supporting witnesses in the same directory, current Product `main` `94b8eaad0951c6b43cf1e55fc6c54b9114329f61`.
- Result:
  - retained bounded direct defects: `RODOSLOVIYE-OG-IMAGE`, narrowed `GENEALOGY-NO-ERROR-BOUNDARY`, `APP-MASK-NO-WEBKIT-FALLBACK`;
  - absorbed: `EDITORIAL-LABEL-INCONSISTENCY` + `RSS-SERIES-DATE-COLLAPSE` → `METADATA-SSOT-PROLIFERATION`;
  - absorbed: `SECURITY-CSP-INCONSISTENCY` + `SECURITY-CSP-GAPS` + `SECURITY-NOSNIFF-OWNER-LAYER-MISMATCH` → layered `FRAGMENTED-SECURITY-OWNERSHIP`;
  - superseded/absorbed: `SW-PWA-FRESHNESS` → `SW-ROOT-GENERATION-AUTHORITY`;
  - retired/replaced: `SITEWIDE-BTN-TYPE-AUDIT`; `MISSING-BUTTON-TYPE` becomes preventive cleanup/evidence under `SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS`, not a second active Product defect;
  - retired from active MASTER: `AR-IDX-JS-02-MULTIWRITER`; current canonical ReaderPreferences owner and compatibility bridge are coordinated and regression-covered;
  - admitted independent system roots: `SCRIPTURE-OCCURRENCE-REPRESENTATION-ORACLE`, `SOURCE-SURFACE-AUDIT-FALSE-COMPLETENESS`, `SW-ROOT-GENERATION-AUTHORITY`, `BROWSER-MATRIX-ZERO-WORKER-FAILOPEN`, `ARTICLE-LEGACY-CAPABILITY-PARTIAL-MIGRATION-ROOT`, `TTS-SHAREDWORKER-CLIENT-LIFECYCLE`, `LAZY-RUNTIME-LOADER-FAILURE-STATE`;
  - arithmetic after consolidation: **12 independent active units = 3 bounded direct defects + 9 system/root packages**.
- Product evidence: no Product mutation. Product advanced from the earlier synthesis anchor to `94b8eaad`; the two touched evidence surfaces were rechecked before consolidation. Product #1752 left `/app/` with unprefixed-only `mask-image` and changed `data/scripture-search-index.json` only by adding one `/app/` occurrence (`2429 → 2430`), leaving the previously audited records untouched. Product #1759 changed aggregate engine-contract wiring, not the admitted runtime/parser owners.
- Regression witness: merged AuditRepo #344 (`45b985737f192f709d7e1ee7324250d0e0986ca1`) plus exact-current source/patch reverify; future closure criteria are encoded in the consolidated MASTER rows.
- Live evidence: no new live claim required for this documentation consolidation; previous live/artifact witnesses are preserved in their source evidence. No deployed-response `nosniff` absence is claimed without a header witness.
- Detailed evidence: `../incoming/chatgpt/2026-08-19/VERIFIER_SYNTHESIS_TARGET_MATRIX_2026-08-20.md` and the evidence index beside it.

## 2026-09-06 — bounded direct-defect current reconciliation

- Scope: the three bounded direct defects retained by the 2026-08-20 causal MASTER: `RODOSLOVIYE-OG-IMAGE`, `GENEALOGY-NO-ERROR-BOUNDARY`, `APP-MASK-NO-WEBKIT-FALLBACK`.
- Inputs: current Product `main` `f135a5739d2a557f866bb92740cd417fe1d185c2`; Product PR #1768 and merge `a24956adf4e8f759c07bcb0547539f2582179196`; Product PR #1770 and merge `35785842f7cabffaacf3ba60e2c549ad19733f96`; current `src/components/genealogy/GenealogyTree.tsx`, `src/pages/app/index.astro`, `src/components/map/MapStyles.astro`, `src/components/rodosloviye/RodosloviyePageHead.astro`; current Product image inventories.
- Result:
  - closed-by-fix: `GENEALOGY-NO-ERROR-BOUNDARY` — Product PR #1768 merged a route-local React error boundary around `GenealogyTreeContent`, with explicit fallback, `role="alert"`, and retry that resets only the interactive island while preserving the native surrounding page.
  - closed-by-fix: `APP-MASK-NO-WEBKIT-FALLBACK` — Product PR #1770 repaired the App owner; current Product source additionally confirms paired `-webkit-mask-image` / `mask-image` declarations in both `/app/` and the Map mask owners, so the original bounded compatibility defect is no longer current.
  - remaining independent: `RODOSLOVIYE-OG-IMAGE` — current `RodosloviyePageHead.astro` still points OG/Twitter identity to generic `images/og-karty-1200x630.webp`; no route-owned `rodosloviye`/`genealogy` raster exists in the inspected current image roots. The row remains active rather than substituting an unrelated generic asset or fabricating a closure image.
  - unchanged/unreverified here: all nine system verification lanes. This bounded reconciliation makes no inference about their current disposition.
- Product evidence: PR #1768 merged as `a24956adf4e8f759c07bcb0547539f2582179196`; PR #1770 merged as `35785842f7cabffaacf3ba60e2c549ad19733f96`; current direct-defect source witness at Product `f135a5739d2a557f866bb92740cd417fe1d185c2`.
- Regression witness: current `GenealogyTree` still owns `GenealogyErrorBoundary`; current App and Map CSS still carry paired vendor/unprefixed masks. Historical PR scopes remain narrow (one Product file each at merge), and no unrelated Product mutation is made by this AuditRepo reconciliation.
- Live evidence: not newly claimed; source/merge evidence is sufficient to remove the two stale direct rows from the current-work SSOT. `RODOSLOVIYE-OG-IMAGE` remains open and therefore receives no false live-closure claim.
- Detailed evidence: Product PRs #1768 and #1770 plus the current-source witnesses cited above; no separate `reverify/` document required for this bounded stale-row reconciliation.
