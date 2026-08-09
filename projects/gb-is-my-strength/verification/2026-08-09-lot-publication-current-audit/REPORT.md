# Lot publication / content current audit — 2026-08-09

## Purpose

Current-state verification of the standalone Lot article without taking ownership from the active Product publication/media/catalog lanes.

This report is an **AuditRepo evidence record**, not a Product mirror and not a replacement for Product CI. It separates:

- current confirmed release defects;
- current work already owned by another Product lane;
- expected derived projection work;
- factual/source checks that passed;
- suspected problems that were disproved;
- work that is simply not implemented yet and therefore must not be described as complete.

## Exact anchors

| Surface | Exact anchor / state at audit |
|---|---|
| Product `main` | `6c38e340f3e6d3cb73d17c6a301b11f426e46373` — `fix(strangler): resolve Nagornaya visual references via storage authority (#1343)` |
| Lot publication owner | Product draft PR `#1339`, branch `release/lot-publication-20260809-r2`, head `189dfddbeed537c849dd35b1a92578ead894079d` |
| Product ancestry | `#1339` is currently **diverged / behind=1** from the observed `main`; merge base is `56972725dbe7aa9c5ecbf0d1efa2e9012e37f019` |
| Lot authoring source | already merged in Product `main` under `src/components/article-pilots/lot/**`; terminal order was repaired by `#1332` |
| Catalog/reachability owner | draft Product PR `#1348`, clean current-main successor of closed-unmerged `#1305` |
| Avraam / Tall el-Hammam owner | draft Product PR `#1334` under issue `#1298` |
| AuditRepo base | `00fd1ff37649ca4204fb9db28ab9b23d0b73378b` |

Because Product is moving concurrently, every repair/merge claim below must be rechecked against a fresh exact head. No green run from `189dfdd...` is merge authority after the branch is refreshed.

---

## Executive disposition

### Confirmed current Product defects / release blockers

| ID | Severity | Disposition | Evidence | Correct ownership / repair boundary |
|---|---|---|---|---|
| `LOT-SEO-WEBSITE-01` | P1 release blocker | `CONFIRMED-CURRENT` | Exact `#1339@189dfdd...` Route Registry Validators run `31286625171` fails registry-driven dist SEO with `articles/lot-i-sodom/index.html: JSON-LD @graph lacks #website node`. Direct source read confirms `LotPageHead.astro` has `Organization`, `Article`, and `BreadcrumbList` nodes but no canonical `WebSite` node. | Keep in publication owner `#1339`; add the existing site `WebSite` graph node (`https://gospod-bog.ru/#website`) consistently with known-good PageHead contracts, then rerun exact-head Route Registry / dist JSON-LD gates. Do not weaken `seo-audit.js`. |
| `LOT-HUMAN-REACHABILITY-01` | P1 release blocker | `CONFIRMED-CURRENT / OWNED` | Exact `#1339@189dfdd...` Deploy Candidate run `31286625059` builds the route, Pagefind and publication artifact successfully, then fails `human-reachability-audit.js`: `Human-orphan reading routes: /articles/lot-i-sodom/`, `55/56`. | Product `#1348` is now the canonical systemic repair: make `/articles/` exhaustive from Search Manifest + page ownership. Do **not** add a one-off Lot card/link. After `#1348` lands, refresh `#1339` and re-run the reachability witness. |
| `LOT-TOC-MAP-01` | P2 reader navigation | `CONFIRMED-CURRENT` | Merged `LotSectionArchaeology.astro` contains the normal H2 `<h2 id="sec-map-connection">Связь с картой Авраама на сайте</h2>`. Current `#1339` `LOT_TOC` jumps from `#sec-zoar-tradition` directly to `#sec-how-to-read`; `#sec-map-connection` is absent. | Route-local publication owner `#1339`: include the live H2 in the canonical TOC, then exercise the link in the planned Lot browser witness. |

### Current required work that is not a new semantic bug

| ID | Disposition | Evidence / boundary |
|---|---|---|
| `LOT-SCRIPTURE-PROJECTION-01` | `CONFIRMED-CURRENT / EXPECTED DERIVED REFRESH` | Exact `#1339@189dfdd...` Scripture Occurrence Index run `31286625101` fails `data/scripture-search-index.json is stale; run with --write`. This is the canonical derived index detecting new Lot Scripture occurrences. It must be refreshed only by `scripts/build-scripture-occurrence-index.mjs --write` / canonical owner, never hand-edited. |
| `LOT-ANCESTRY-01` | `MERGE-BARRIER` | Observed Product `main@6c38e340...` is one commit ahead of `#1339` (`behind=1`). Existing greens on the old head do not transfer after refresh. |
| `LOT-MEDIA-READINESS-01` | `IN-FLIGHT / NOT IMPLEMENTED` | `lane/lot-media-20260809` has no unique Product delta versus current main (`ahead=0`). `lane/lot-illustration-placement-20260809` only adds a reusable `LotFigure.astro` helper; it does not place the promised 14 illustration families into the article. Current `LotPageHead` still uses the generic site OG image. The publication PR itself explicitly lists 14 visual families + Lot-specific 1200×630 OG + browser marathon as remaining gates. This is unfinished work, not evidence of a shipped regression. |

### Adjacent finding already owned elsewhere

| Finding | Disposition |
|---|---|
| Avraam Atlas still needs Tall el-Hammam retraction parity | `CONFIRMED-CURRENT / OWNED BY #1334 + #1298`. `#1334` repairs the static fallback and records a further `route.json` residual. Do not duplicate this as a Lot Product fix. |

---

## Root-cause notes

### 1. JSON-LD failure is real source drift, not CI noise

`LotPageHead.astro` currently constructs:

1. `Organization` with `@id=https://gospod-bog.ru/#organization`;
2. `Article`;
3. `BreadcrumbList`.

It omits the site `WebSite` node. The canonical `scripts/seo-audit.js` explicitly requires both `#organization` and `#website` whenever an `@graph` is present. Known-good production PageHeads, e.g. Hermenevtika, include:

- `@type: WebSite`;
- `@id: https://gospod-bog.ru/#website`;
- site name/url/language;
- publisher reference to `#organization`.

Therefore `LOT-SEO-WEBSITE-01` is a direct Product source defect with a precise bounded fix; changing the audit would create a false green.

### 2. Human orphan is a catalog-owner problem, not a Lot-card problem

The Deploy Candidate evidence is unusually clean:

- Astro production-like build succeeds;
- `/articles/lot-i-sodom/` is generated;
- Pagefind includes the publication corpus;
- offline/PWA witness succeeds;
- dist publication audit succeeds;
- only the human reachability gate fails for Lot.

This means the route exists technically but cannot be reached through the current visible static reading graph. `#1348` correctly addresses the root by replacing the hand-maintained `/articles/` inventory with a projection from existing publication/discovery authorities. A manual Lot-only link would merely recreate a second membership owner.

### 3. TOC omission is source-verifiable before browser work

The omission does not require pixel interpretation. A live H2 exists in the accepted article source and the route-local TOC omits exactly that destination. The later browser marathon should become the regression witness, not the first place where the defect is discovered.

---

## Content / factual verification

The factual pass was intentionally source-boundary oriented. It did not treat theological interpretation as an archaeological measurement and did not convert a disputed site proposal into proof of biblical Sodom.

### PASS — Tall el-Hammam retraction boundary

Current article treatment is accurate and appropriately narrow:

- *Scientific Reports* published the retraction note on **24 April 2025** for the 2021 Tall el-Hammam airburst paper.
- The editors cite methodology/mineralogical/geochemical objections raised by Jaret & Harris and unsupported Tunguska comparisons raised by Boslough & Bruno.
- The editors state that the airburst-destruction claims are not sufficiently supported and that they no longer have confidence in the reliability of the conclusions.
- The article correctly does **not** turn this into proof that Tall el-Hammam cannot be Sodom; it only refuses to use the retracted airburst paper as established positive evidence.

Primary authority:

- Nature / *Scientific Reports* retraction note: https://www.nature.com/articles/s41598-025-99265-5
- retracted 2021 article record: https://www.nature.com/articles/s41598-021-97778-3

Disposition: `VERIFIED-PASS`.

### PASS — Deir ‘Ain ‘Abata / Agios Lot tradition boundary

The Jordan Tentative List material published by the UNESCO World Heritage Centre supports the article's main claims:

- south-eastern Dead Sea, overlooking modern Safi / biblical Zoara;
- sixth-century Madaba mosaic depiction of the Sanctuary of Agios Lot next to Zoara;
- Byzantine monastic/basilical complex around a natural cave associated by early Christians with Lot and his daughters;
- Greek mosaic inscriptions dated **606** and **691**;
- further Greek inscriptions invoking Agios Lot.

The article also preserves the crucial evidentiary boundary: this is late-antique reception/local memory, not a Bronze Age identification tablet.

Important source-policy nuance: UNESCO explicitly states that Tentative List content is the responsibility of the submitting State Party; listing does not itself mean World Heritage Committee/Centre endorsement of the historical identification. The current Lot prose is safe because it says the material was submitted by Jordan rather than presenting UNESCO as independently certifying the Lot tradition.

Primary authority:

- UNESCO World Heritage Centre Tentative List 1551: https://whc.unesco.org/en/tentativelists/1551/

Disposition: `VERIFIED-PASS`.

### DISPROVED — suspected Numayra excavation-date error

A possible date inconsistency was tested rather than promoted.

The specific Expedition to the Dead Sea Plain Numayra material describes excavation of the extant site in **1979–1983**; broader EDSP project histories can also describe the Numayra campaign/publication horizon as **1977–1983** because survey/field seasons and project chronology are counted differently.

The Lot source wording `раскопкам 1979–1983 годов` is therefore defensible for the cited Numayra excavation page and is **not** a proven factual error.

Disposition: `FALSE-POSITIVE / DO NOT PROMOTE`.

### Biblical/canonical source boundary

Direct source review found no material contradiction requiring a correction in the currently merged Lot sections for these central claims:

- Lot as Abraham's nephew and the Genesis 13 separation;
- the Genesis 14 rescue and the 318 trained men belonging to Abraham's household force;
- 2 Peter 2:6–9's explicit righteous-Lot control;
- Genesis 19 crowd/coercion, Lot's delay and the hand-led rescue;
- Ezekiel 16:49–50's pride/fullness/ease/failure toward the poor;
- Jude 7's sexual-immorality/`other flesh` language with the article explicitly preserving interpretive dispute;
- Moab/Ben-Ammi and the later canonical Ruth → Obed → Jesse → David line.

No `CONFIRMED-CURRENT` factual correction was produced from this pass.

---

## Suspected items deliberately not promoted

### `Сигор` vs `Цоар` in the TOC

`LOT_TOC` labels `#sec-zoar` as `Сигор`, while the visible section language often uses `Цоар`. Both are established Russian renderings/transliterations in the project's biblical context; this audit does not yet have evidence that one is forbidden by the route's editorial contract. Keep as an editorial consistency observation only.

### Jude 7 quiz wording

The quiz explanation says Jude 7 emphasizes sexual immorality while the body gives a more nuanced note about the exact force of `other flesh`. The broad statement is not false, and the body already protects the disputed inference. Do not promote without a demonstrated quiz/body semantic-contract requirement.

---

## Publication readiness truth table

| Surface | Current audit verdict |
|---|---|
| Authoring/body source | `PASS WITH ONE TOC PUBLICATION RESIDUAL` |
| Tall el-Hammam factual boundary | `PASS` |
| Deir ‘Ain ‘Abata factual boundary | `PASS` |
| Numayra suspected date issue | `FALSE-POSITIVE` |
| Route generation/build | `PASS ON #1339 HEAD` |
| JSON-LD registry SEO | `FAIL — #website missing` |
| Human reachability | `FAIL — Lot is orphan 55/56` |
| Scripture occurrence projection | `FAIL — canonical derived index stale` |
| Catalog root cause | `OWNED BY #1348` |
| Lot-specific OG | `NOT IMPLEMENTED YET` |
| 14 responsive illustration families in Product | `NOT IMPLEMENTED YET` |
| Lot browser marathon Chromium/WebKit × 390/412/1024/1366 × day/dark | `NOT YET EVIDENCED` |
| Current-main ancestry | `FAIL FOR MERGE AUTHORITY — #1339 behind=1` |
| Production/live witness | `NOT CLAIMED / NOT YET APPLICABLE` |

---

## Correct next order

1. Let `#1348` finish the exhaustive catalog/reachability owner; do not create a manual Lot-only catalog patch.
2. In `#1339`, fix the missing JSON-LD `#website` node and `#sec-map-connection` TOC entry without weakening shared audits.
3. Refresh the publication branch from the then-current `main`; previous greens become historical only.
4. Let the canonical Scripture occurrence writer materialize the required derivative if exact-head check still requests it.
5. Land the bounded Lot media transaction: 14 visual families at honest 600/900/1200 WebP + dedicated 1200×630 OG, with no duplicate unsuffixed 1200 aliases.
6. Run the promised Lot browser witness across Chromium/WebKit, four widths and day/dark, including every TOC target, tooltips, quiz, both semantic SVGs, comparison table and all raster families.
7. Require `behind=0`, terminal applicable exact-head CI and clean review state.
8. Only after merge require an independent production/live witness; source merge is not production proof.

---

## AuditRepo hygiene disposition

This report intentionally does **not** rewrite the old global MASTER anchor just because Product `main` moved. AuditRepo policy treats the MASTER as a registry of verified active work, not commit telemetry. The current Lot findings are recorded here first because Product ownership is active and some blockers already have live owners (`#1348`, `#1334`).

Promote a compact Lot row into `verified/MASTER_BUG_MATRIX.md` only if, after the next exact-head refresh, a confirmed residual remains open without being fully represented by its Product owner. Conversely, once `#1339/#1348` resolve a finding, classify it `FIXED-CURRENT` here/in a successor verification record rather than preserving a stale MASTER row.
