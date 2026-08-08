# TOTAL AUDIT / CURRENT GOLD — `gb-is-my-strength`

**Snapshot:** 2026-08-08  
**Product:** `FedorMilovanov/gb-is-my-strength`  
**Public site:** `gospod-bog.ru`  
**Product anchor:** `21b437cb79f7b74a4ad3c68e21ffad2edd8ce458`  
**AuditRepo role:** verification synthesis / evidence map; **not** a second active matrix and **not** a Product SSOT.

Active work is owned only by [`../../verified/MASTER_BUG_MATRIX.md`](../../verified/MASTER_BUG_MATRIX.md). This report keeps the detailed evidence, decomposition and sequencing behind the compact MASTER rows.

---

## 1. Executive verdict

The project is technically mature, but the claim **“all published content is closed 100%” is not currently defensible**.

The main remaining gap is not one giant code bug. It is a publication-readiness gap across several independent axes:

- content/source truth;
- public projection/catalog/navigation truth;
- Research completion and discrepancy handling;
- historical media provenance/rights;
- editorial metadata approval;
- representative mobile/desktop product evidence;
- source-vs-live release witness.

A green static publication pipeline proves a strong technical baseline. It does **not** automatically prove that every historical claim is current, every image is provenance-clean, every route is human-discoverable, every editorial date is approved or every production surface is owner-approved.

The correct target is a **derived CURRENT GOLD state**, computed from existing authorities, not another hand-maintained registry.

---

## 2. Current ownership / collision snapshot

### Product main

Current `main` remains:

`21b437cb79f7b74a4ad3c68e21ffad2edd8ce458`

`cleanup(css): remove duplicate shared presentation owners (#1205)`

### Active Product PR

At the latest check, Product has one open PR relevant to this audit:

- `#1209` — `fix(search): make result continuation truthful`
- owner: `SEARCH-P3-02`
- base: `21b437cb...`
- latest observed exact head: `88d3b3d02cfa85306daaa68ff88b0ad0de3ff70e`

The head moved several times during CI hardening. Therefore merge/readiness evidence must always use the actual current PR head, not a SHA copied into prose earlier in the lifecycle.

**Collision rule:** do not open parallel Search/shared-search work while `#1209` owns that surface.

---

## 3. Strict published article/part inventory

The strict count remains **55 published reader article/part routes**.

This number intentionally excludes hubs, maps, apps, utility pages and other public surfaces.

| Family | Count |
|---|---:|
| `/articles/<slug>/` | 34 |
| `/baptisty-rossii/<slug>/` | 10 |
| Genesis/Enoch hard-text article routes | 6 |
| `/nagornaya/chast-1..5/` | 5 |
| **Total** | **55** |

The 34 `/articles/` routes decompose to:

- Heart: 24 (6 core + 18 satellites);
- John Gill: 6;
- Pastor: 2;
- Hermenevtika: 1;
- Kod Da Vinci: 1.

### Important counting rule

Future reports must separate:

1. **article/part count**;
2. **total public surfaces**.

Do not compare a build route count, public-surface count and article count as if they were the same metric.

---

## 4. Why green CI is not CURRENT GOLD

The Product validation stack is already broad: route ownership, SEO, Pagefind, source hygiene, article QA, migration/metadata contracts, public-surface registry, reading time, maps, browser checks, visual parity and other gates.

But several gates are intentionally structural/technical.

For example, article QA can safely detect high-confidence mechanical corruption and selected semantic-manifest regressions. It cannot honestly determine whether:

- a disputed historical number has been resolved;
- a quotation was visually verified against a primary page;
- an interpretation is overstated relative to evidence;
- a historical photograph is correctly identified and legally publishable;
- an article fully incorporates the newest Research authority;
- an editorial date has been owner-approved.

Therefore:

```text
static publication green
!=
content/research/editorial/media/live CURRENT GOLD
```

---

## 5. `/articles/` — current catalog projection problem

The public page is explicitly presented as **“Все статьи”**, but the publication grid is hand-authored rather than derived from current route/series/metadata authority.

That architecture has already produced measurable drift.

### Confirmed manifestations

- Gill public material is not represented as a complete canonical six-item sequence in the hand-authored catalog projection.
- Manual card metadata can diverge from canonical series metadata.
- A concrete reading-time mismatch exists for `Римлянам 7`: a manual catalog projection has used `12 мин`, while current canonical Heart data uses `45 мин`.

### Correct fix

Do **not** add dozens of manual cards.

`/articles/` should retain a curated editorial top section if desired, but the exhaustive library projection should be generated from existing publication authorities.

No new publication JSON should be introduced.

Use existing:

- route/public-surface authority;
- series configs;
- canonical article metadata;
- editorial metadata.

### Required invariant

Adding a new published route must not require remembering to update a hand-authored “all articles” list.

---

## 6. Human reachability

The question “is every article visible in all menus?” is the wrong invariant.

An indexable article does not need a top-level card everywhere. It needs at least one intentional, crawlable, human-facing semantic entry path.

### Required future gate

Build a directed graph from production-like built HTML and require for every published/indexable reader route:

- at least one real human inbound `<a href>` witness;
- self-links do not count;
- search does not count;
- sitemap/RSS do not count;
- debug/dev links do not count.

Allowed patterns:

- satellite → parent/core/series TOC;
- series part → hub/reader/neighbor;
- standalone → catalog/category/related.

Expected output:

```text
Human reachability: 55/55
```

or a precise orphan list with missing inbound witnesses.

This belongs inside the derived CURRENT GOLD package, not in a second hand-maintained navigation registry.

---

## 7. John Gill projection drift

Canonical logical sequence:

1. Historical Context
2. Part I — Человек
3. Part II — Учёный
4. Part III — Экзегет
5. Part IV — Наследие
6. Справочник

Historical slugs do not always match display numbering, which is acceptable if every public projection follows the canonical sequence.

### Current defects

`/biografii/` currently:

- shows Context;
- shows I;
- shows II;
- skips Part III;
- shows IV;
- shows Reference;
- still uses stale “Трилогия” wording.

`data/links-graph.json` also has semantic III/IV description inversion: the Part IV route is described as the third part and the Part III route as the fourth part.

### Repair boundary

Fix **projection convergence**, not one card.

Extend the existing Gill consistency contract to cover public prose/catalog projections so a future III/IV swap is a deterministic regression.

---

## 8. Russian Baptists — publication-readiness red zone

The Product roadmap itself states that current Baptist articles are **not final** and still require depth, structure, sources, rights-checked images and 3D-map linkage.

Current roadmap targets include:

- minimum 2800 words/article;
- preferred 4200;
- minimum 2 local historical images/article;
- preferred 4;
- remote hotlinks forbidden;
- media ledger required;
- map sync required.

Word-count targets are a quality guardrail, not permission to add filler. Scope/source closure comes first.

---

## 9. Baptist current factual blockers

### 9.1. `11 vs 21` arrested delegates, 1923

Current public `goneniya-i-sovest` states as settled fact that **11 delegates were arrested**.

The current Baptist QA discrepancy register still classifies the count as:

`11 vs 21 — open`.

The same register says disputed statements must not be published as settled facts before resolution.

This is current publication-truth debt.

Required outcome:

- establish what each number counts and resolve from strong evidence; or
- qualify the public wording by source/counting boundary;
- synchronize article/reference/map consumers.

### 9.2. Exact Petersburg meeting date, 1884

Current public `dva-sezda-1884` uses exact `1–6 апреля 1884` as settled fact.

The current discrepancy register still says the exact date requires additional primary/protocol confirmation.

Required outcome:

- prove exact `1–6`; or
- use source-qualified / less exact wording;
- synchronize summary, body, reference and map datasets.

### 9.3. 23 vs 24 agenda questions

This remains a Research discrepancy, but current body has already moved to the safer phrase “два с лишним десятка пунктов”.

Therefore **do not create a current Product defect solely from old commit history**. Resolve the Research discrepancy, but current public prose is already appropriately bounded on this point.

---

## 10. Baptist S12 reader-facing research leak

Current `Подпольная печать` again contains backstage wording equivalent to:

> Для сверки сохранены локально первые контрольные выпуски…

Top-level Article Charter S12 explicitly forbids public/internal wording about locally stored research files and other backstage notes.

### Why existing hygiene gate missed it

The current forensic pattern covers a `сохранён... локально` spelling path with `ё`, while the leaked phrase uses `сохранены локально` with `е`.

This is a classic false-green audit gap.

### Required bounded repair

- rewrite the public sentence bibliographically;
- normalize `е/ё` for the exact backstage-marker check, or equivalently cover both forms;
- add an adversarial fixture using the actual leaked form;
- do not broaden the checker into noisy stylistic heuristics.

---

## 11. Baptist evidence vocabulary drift

Three concepts are currently at risk of being conflated:

1. public evidence-strength language;
2. Research evidence-strength language;
3. acquisition/verification workflow stage.

The public Baptist reference teaches an A/B/C/D model, while the top-level Article Charter uses A1/A/B+/B/C/HOLD. Research additionally tracks stages such as bytes acquired, text-layer present, visual-page verified, quote-ready and rights/publication state.

### Correct model

Keep two independent axes:

**Evidence strength** — reader/editorial meaning.  
**Verification stage** — Research workflow state.

Do not present “bytes acquired” or “OCR exists” as if that makes a claim strong enough for publication.

This reconciliation can be handled inside the Baptist series publication-readiness package rather than creating another global taxonomy database.

---

## 12. Baptist media

### Current ledger status

`baptisty-rossii/research/media-ledger.md` currently contains only a TODO placeholder row.

Therefore a file existing in Drive or Research is **not** enough to classify it as production-ready media.

### Correct visual model

The current SVG series cover may remain as a design/identity layer.

Historical evidence media is a separate layer and needs:

- exact subject identification;
- source object/archive/publication;
- date/locator;
- rights/license;
- local production asset;
- truthful caption/alt;
- attribution;
- ledger row.

### Candidate seeds already located

Google Drive includes useful candidate objects such as:

- `Никита Исаевич Воронин.pdf_thumb.jpg`;
- `Баптист 1909 №11 — p15 — А. М. Мазаев signature — visual card.png`;
- `Братский Вестник 45-2.pdf_thumb.jpg`.

These are **candidates**, not automatically approved images.

A good existing production pattern is the Soviet-night facsimile path, where the displayed document has source, caption, rights state and bounded usage meaning.

---

## 13. Baptist 2D atlas

`data/baptisty-rossii-visual-atlas.json` defines a thoughtful set of ten diagrams, but their current statuses are `planned`.

Therefore a green atlas-plan audit proves plan integrity, not implementation completeness.

High-value diagrams should be implemented only where the visual form removes genuine reader ambiguity, e.g.:

- Kura/Tiflis origins route;
- southern shtunda network;
- split 1884 timeline/map;
- Soviet repression mechanism;
- initiative-group timeline;
- underground press flow;
- source-confidence matrix.

No pseudo-precision should be added where geography or source confidence remains disputed.

---

## 14. Baptist 3D map

The Research safe-update plan explicitly records that corrected source snapshots were **not rebuilt into the production iframe**.

Known data corrections include:

- southern shtunda needs a layered network rather than one flat node;
- Petersburg 1884 and Novo-Vasilievka 1884 are distinct events;
- Oncken is important to the German Baptist channel but is not a Petersburg-1884 participant;
- several geographic locations remain ambiguous;
- source confidence should remain visible.

### Correct architecture

```text
Research
→ canonical historical dataset
→ article/reference consumers
→ 2D atlas consumers
→ 3D source data
→ deterministic rebuild
→ live QA
```

Do not hand-patch generated `_app` output.

The 3D build should wait for data truth rather than creating a third divergent historical narrative.

---

## 15. Modern statistics

Any modern Baptist statistic must be modeled with:

- value;
- unit;
- scope;
- `asOf`;
- source;
- retrieved/check date;
- confidence.

If the newest available official number is old, publish it as a dated historical/currently-known number rather than visually presenting it as “today”.

---

## 16. Bible governance / rights conflict

This is already owned conceptually by AuditRepo `SEARCH-P2-07`; do not open a competing owner row.

Current policy/evidence conflict:

- Article Charter S9 says Synodal by default unless explicitly stated otherwise;
- Content Quality annex directs NT → Cassian, OT → Synodal;
- Research `d52ea9d...` keeps the corpus fail-closed, Cassian permission-controlled, and CrossWire `RusSynodal` 1.9.1 candidate-only pending acquisition/hash/mapping/import proof.

Required owner decision:

1. approved default reader translation;
2. existing-corpus grandfathering boundary;
3. new-verse addition rule;
4. rights/provenance authority;
5. Cassian permission disposition;
6. canonical corpus/version/checksum;
7. Charter/annex convergence.

Do not expand permission-unproven corpus before this is resolved.

---

## 17. Genesis owner-gap is stale

AuditRepo previously retained `GENESIS6-ACTIVATION-OWNER-GAP` as an owner decision.

Current Product lifecycle evidence now contradicts that active state:

- Product issue `#362` is closed with state reason `completed`;
- its final lifecycle witness records:
  `COMPLETED / PRODUCTION WITNESSED / NO OPEN GENESIS PRODUCT DEFECT`.

Therefore the owner-gap row should leave active MASTER in the same reconciliation wave.

This retirement does **not** claim that every future Genesis editorial improvement is impossible; it only says the old “who/when will publish it?” decision is no longer current work.

---

## 18. Heart Research

Latest meaningful Research state shows the whole Heart research/book program remains incomplete:

- final entries: 18;
- entry citation passes complete: 13;
- open: 5;
- assembled readers: 13;
- missing standalone final readers: 5;
- Product source repairs remain;
- URL/path holds remain;
- whole-book assembly/citation/dedup/line-edit/bundle/release are not final.

### Important distinction

Do **not** equate “whole Heart book Research is unfinished” with “all 24 currently published Heart routes are invalid”.

The correct model has two closures:

1. route-level current publication readiness for the 24 published routes;
2. separate whole-book Research/manuscript completion.

Route-level blockers must be proven route by route.

---

## 19. Editorial metadata

The current editorial metadata freeze architecture correctly prevents technical commits from freely rewriting editorial dates.

But `inconsistent-needs-review` means:

> the discrepancy is frozen/protected for review

not:

> the metadata has been editorially approved.

For a route to become CURRENT GOLD, applicable publication/modified dates should be owner-approved and converge across the intended projections (meta/JSON-LD/search/sitemap/RSS according to policy).

Technical build time must not masquerade as editorial modification time.

---

## 20. Product visual truth

Existing Product issue `#298` already owns an important visual blind spot:

legacy↔dist parity can remain green if the same regression exists in both projections.

Do **not** open a duplicate visual-baseline system.

The CURRENT GOLD package should consume/reference #298's owner-approved product-golden evidence for representative route families/states.

Visual success and physical print/PDF correctness remain different claims.

---

## 21. Mobile / Learning evidence

Generic overlay infrastructure is already well tested for focus, inert, Escape, nested stack and lifecycle behavior.

That does not replace one real complete-process test of the actual Gill Learning reader.

Representative real-reader coverage should include:

- Learning open/close;
- terms/glossary hydration;
- outline → real anchor;
- in-article search;
- quiz answer/explanation/source;
- notes/highlights;
- settings persistence;
- TTS/rate interaction;
- keyboard/focus restore;
- touch narrow widths;
- day/sepia/night;
- Chromium + WebKit.

Do not multiply this into a heavyweight full E2E matrix across all 55 routes. Use representative complete-process evidence plus cheap all-route invariants.

No desktop Learning redesign is part of this current closure program.

---

## 22. Hermenevtika issue #54

Product issue `#54` is a historical umbrella with many good findings, but later work has already landed for footnotes, tooltip ownership, mobile chrome, settings and semantic preservation.

Therefore its old body must not be executed verbatim.

Before promoting any new Hermenevtika row, reclassify each residual as one of:

- `FIXED_CURRENT`;
- `STILL_CURRENT`;
- `SUPERSEDED`;
- `ABSORBED_BY_SYSTEM_OWNER`;
- `NEEDS_OWNER_DECISION`.

This is reverify work, not automatically active Product repair.

---

## 23. CURRENT GOLD architecture

Do **not** create another manually maintained publication inventory.

The Product already has a public-surface registry/route authority that can serve as the base identity layer.

A derived readiness result should join existing authorities and evidence, for example:

```yaml
route:
surface:
routeRole:
productSha:
researchAuthority:
checkedAt:

publication:
  productionOwned:
  canonical:
  indexable:

editorial:
  metadataStatus:
  contentReview:
  sourceReview:
  claimHolds:

discoverability:
  humanInboundWitnesses:
  catalog:
  series:
  search:
  sitemap:
  rss:

media:
  required:
  accepted:
  ledgerComplete:
  rightsComplete:

runtime:
  desktop:
  mobile:
  keyboard:
  touch:

visual:
  ownerApprovedEvidence:

live:
  deployedSha:
  routeWitness:

status:
blockers:
```

Recommended status vocabulary:

- `GOLD`
- `REVIEW_REQUIRED`
- `BLOCKED`
- `OPPORTUNITY_ONLY`
- `N/A`

### Core semantic rule

A future enrichment opportunity does **not** automatically remove Gold.

New Research should classify impact:

- correction;
- material qualification;
- source upgrade;
- extension/enrichment;
- media;
- structure;
- freshness/statistic.

Only material blockers reopen the relevant Gold dimension.

---

## 24. Source Gold vs Live Gold

These are different evidence states.

### Source CURRENT GOLD

Exact Product/Research state has:

- content/source closure;
- metadata approval;
- navigation/reachability;
- media/rights state;
- representative runtime/visual evidence;
- exact-head checks.

### Live CURRENT GOLD

Additionally proves:

- accepted source is contained in deployed artifact;
- deployment pointer is correct;
- critical live route witnesses pass;
- no release/cache identity mismatch.

Never collapse:

```text
PR green → merged → site Gold
```

into one unsupported claim.

---

## 25. Work decomposition (not a second active matrix)

The IDs below are decomposition/next-check labels. They are **not automatically active**. Active status is only what MASTER promotes after current verification.

### Foundational/current

- `BAPT-S12-01` — backstage leak + hygiene false-green.
- `BAPT-CONTENT-TRUTH-01` — published claim strength vs discrepancy authority.
- `GILL-PROJECTION-01` — canonical Gill sequence across public projections.
- `CATALOG-PROJECTION-01` — derived truthful `/articles/` catalog.
- `SYS-CURRENT-GOLD-READINESS` — derived readiness + human reachability + source/live split.
- `SYS-BAPTISTY-PUBLICATION-READINESS` — series-wide content/media/map readiness.

### Existing owners retained

- `SEARCH-P3-02` → Product #1209.
- `AR-IDX-05`.
- `AUDIT-JS-ESCAPER-DUP-X5`.
- `SYS-KARTY-HOLDING-PUBLICATION-READINESS`.
- `SYS-STRANGLER-RETIREMENT`.
- `SEARCH-P2-07`.
- `REG-001`.
- `NG-VIS-04`.

### Detailed future decomposition inside system packages

- human reachability generator;
- derived current-publication readiness output;
- route metadata approval batches;
- Baptist media candidate/ledger/production batches;
- Baptist article-by-article Research/content closure;
- Baptist 2D diagrams;
- Baptist canonical 3D dataset;
- Baptist deterministic 3D rebuild/live QA;
- Heart remaining Research passes;
- Heart route-level readiness;
- Heart whole-book closure;
- Gill content/source Gold review;
- Nagornaya route-level Gold review;
- standalone article Gold review;
- Hermenevtika residual reverify;
- final live Gold witness.

---

## 26. Non-conflicting sequencing

### While Product #1209 remains active

Safe/read-only or different-owner work:

- Baptist source research for 1923 / exact 1884 date;
- Baptist media provenance/rights candidate intake;
- Bible rights/policy owner decision work;
- Hermenevtika #54 reverify;
- Genesis stale AuditRepo row retirement;
- design/evidence work for CURRENT GOLD without touching Product Search/shared owners.

### First fresh main after #1209

1. exact-head Product reverify;
2. bounded `BAPT-S12-01`;
3. bounded Gill projection repair;
4. catalog projection architecture;
5. human reachability/current-Gold tooling.

### Then

Run independent article-family content/media lanes, avoiding shared Product owners.

Baptist 3D comes **after** historical data truth, not in parallel with unresolved factual reconciliation.

---

## 27. Definition of CURRENT GOLD — one article

A route is Gold only if all applicable dimensions are green:

### Publication

- production-owned;
- canonical correct;
- indexability intentional;
- no draft/noindex leak.

### Content / sources

- current canonical body;
- no known unqualified material contradiction;
- source strength matches claim strength;
- direct quotes/locators handled appropriately;
- Research holds are not presented as facts;
- no backstage research prose.

### Metadata

- editorial dates approved where applicable;
- intended meta/JSON-LD/search/sitemap/RSS projections converge.

### Discoverability

- at least one valid human inbound witness;
- series/category placement is correct;
- search/sitemap states are intentional.

### Media

- requirement classified;
- historical media provenance/rights complete when required;
- caption/alt truthful;
- no fake historical AI evidence.

### Runtime / visual

- representative desktop/mobile evidence;
- keyboard/touch/reduced-motion where applicable;
- no critical runtime error;
- owner-approved product visual evidence where required.

### Live

- accepted source contained by deployment;
- live route witness.

---

## 28. Definition of CURRENT GOLD — series

In addition to route-level readiness:

- canonical order;
- hub accurately represents all parts;
- next/prev consistent;
- TOC consistent;
- catalog projection consistent;
- graph projection consistent;
- total time/counts derived rather than manually copied;
- shared glossary/transliteration consistent;
- series Research holds closed or qualified;
- media coverage meets approved series target;
- representative mobile/desktop reader journey passes;
- live series journey witnessed.

---

## 29. Definition of CURRENT GOLD — site

A defensible site-level claim requires roughly:

```text
all required reading routes Gold
+ public landings production-ready
+ complete human reachability
+ no stale publication owner decisions
+ no rights-unknown corpus expansion
+ no known unqualified material factual contradiction
+ truthful Search
+ truthful catalog
+ approved editorial metadata model
+ maps Gold or explicitly Holding
+ representative owner visual evidence
+ source → artifact → live witness
```

Architecture retirement is a separate claim: the Product may reach publication Gold while retained legacy remains explicitly reference-only, but `SYS-STRANGLER-RETIREMENT` cannot be called complete until its own deletion/move safety contract becomes true.

---

## 30. What not to do

- Do not create a new publication SSOT.
- Do not manually add 55+ cards to keep `/articles/` “complete”.
- Do not count Search or sitemap as human navigation.
- Do not treat Baptist roadmap/atlas plan audits as implementation completion.
- Do not bulk-replace Baptist covers with unidentified Drive images.
- Do not treat an SVG cover as historical evidence.
- Do not patch generated Baptist 3D `_app` output manually.
- Do not publish open discrepancies as exact facts.
- Do not create a noisy automated “theology quality score”.
- Do not auto-update product goldens in normal CI.
- Do not treat old PR body SHAs as exact current-head merge evidence.
- Do not execute old umbrella issue bodies without current reverify.

---

## 31. Evidence authorities used by this audit

### Product

- current `main@21b437cb...`;
- Product PR `#1209` / Search owner;
- route/public-surface authority and series configs;
- `/articles/` and `/biografii/` source projections;
- Gill series consistency owners;
- Baptist article bodies;
- Baptist roadmap;
- Baptist visual-atlas plan;
- Baptist media ledger;
- Baptist discrepancy register;
- Baptist 3D safe-update plan;
- Article Charter;
- Content Quality Standard;
- existing Product issue `#298`;
- existing Product issue `#54`;
- Product issue `#362` lifecycle evidence.

### AuditRepo

- `AUDITREPO_OPERATING_MODEL.md`;
- project `DOC_MAP.md`;
- current `MASTER_BUG_MATRIX.md`;
- previous current verification waves.

### Research

- Bible rights/provenance authority `d52ea9d...`;
- Heart current authority through `c3f7ea27...`.

### Drive candidate evidence

Candidate historical assets were searched only as candidate intake. A Drive file is not treated as publication-rights authority by existence alone.

---

## 32. Confidence / remaining exact evidence

### High confidence current findings

- strict 55 article/part count at the current Product anchor;
- catalog is hand-authored and currently drifts;
- Gill public projection drift;
- Baptist roadmap explicitly says current articles are not final;
- Baptist media ledger is TODO-only;
- current Baptist `11 vs 21` conflict;
- current exact-1884-date confidence conflict;
- current Baptist S12 leak + hygiene false-green mechanism;
- Baptist 3D source snapshot has corrections not rebuilt into production iframe;
- Bible policy/rights conflict;
- Heart Research remains incomplete;
- Genesis activation owner-gap is stale based on completed production-witnessed issue lifecycle;
- Strangler retirement remains unsafe to physically move/delete.

### Needs dedicated exact runs before closure

- current reader-visible word count for all 10 Baptist routes;
- generated 55/55 human inbound graph;
- per-route editorial metadata approval state;
- complete media dimensions/provenance/rights audit;
- current deployed SHA vs current Product main;
- complete Hermenevtika #54 residual classification;
- live current 3D rendered labels vs source snapshot.

These are explicit next evidence lanes, not facts to guess into “green”.

---

## 33. Update protocol

This report is a **snapshot evidence/synthesis document**.

After relevant Product/Research changes:

1. reverify only affected claims;
2. update active MASTER only when disposition/scope/next action materially changes;
3. remove solved/stale active rows immediately;
4. keep optional enrichment out of MASTER until it becomes verified necessary work;
5. leave Product route/public-surface authority in Product;
6. leave Research source/provenance/rights authority in Research;
7. use this report for detailed rationale, not as runtime config or second work matrix.

---

## 34. Bottom line

The next phase should not be another round of disconnected polish.

The durable model is:

```text
Product publication authority
+ Research truth/provenance
+ human navigation
+ editorial approval
+ media rights
+ representative runtime/visual evidence
+ live deployment witness
→ derived CURRENT GOLD
```

The highest-value immediate repairs are bounded and independently testable:

- Baptist S12 leak/guard;
- Baptist factual-strength reconciliation;
- Gill public projection convergence;
- truthful derived `/articles/` catalog.

The larger programs remain separate:

- Baptist content/media/3D publication readiness;
- CURRENT GOLD evidence tooling;
- Heart Research/route review;
- Bible rights/policy;
- Karty publication readiness;
- Strangler retirement.

This keeps the active MASTER small while giving every agent one durable place to read the full audit rationale and next boundaries.