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

---

## 35. Stable all-reading-route census / live control-plane addendum

This section is a **forward addendum** to the original `21b437cb...` snapshot above. It does not rewrite old forensic observations in place. For current active-work disposition, [`../../verified/MASTER_BUG_MATRIX.md`](../../verified/MASTER_BUG_MATRIX.md) remains authoritative.

### 35.1 Current anchors at this addendum

Freshly reverified Product main:

`11999f6d674e64e6afef590adeb71aeaaf303b3a`

`ci(source): cover Baptist publication surfaces (#1245)`

Fresh Research authority remained:

`d52ea9d54dd2c2488223d25f5f6cefd263c23328`

The strict reading-route inventory remains **55**. Product main moved repeatedly during this audit, so every future mutation must re-read main/open owners rather than treating this SHA as permanently current.

### 35.2 Stable browser-census authority

Product audit-only PR `#1212` reached stable-control-identity head:

`b48982428042df07c8a621bff40b64cb39b61536`

Runtime Interactive Audit run:

`31246241912`

Artifact:

- name: `article-control-census-31246241912-1`;
- artifact id: `9018812831`;
- SHA-256: `b63299fc6a173815914a87f04ce4a6836c1effc076ee2a31c4137956b85caf3a`.

Coverage:

- **55 routes**;
- **232 scenes**;
- **7020 control observations**;
- **1068 generic clicks**;
- 4035 specialized-inline controls intentionally excluded from generic geometry/click assertions and retained for specialized sweeps.

### 35.3 Why `887` is not “887 bugs”

The first full census produced roughly **1855 manifestations**. After fixing stale-control identity in the audit harness, the stable replay produced **887 manifestations**:

```text
all manifestations: 1855 → 887
click-failed:        374 → 124
```

The delta removes **968** manifestations after an audit-engine correction. Therefore old raw counts are not a Product backlog. A manifestation becomes Product evidence only when its shared source/runtime root survives calibration.

This is now an explicit audit rule:

> raw browser manifestations are evidence observations; MASTER stores verified shared roots.

### 35.4 High-confidence reader-control roots

#### Conditional Learning quiz orphan

Stable census finds **174 broken ARIA references across 42 routes**. Every one is the same root:

```text
panelQuiz aria-labelledby="tabQuiz"
```

while `tabQuiz` is absent.

Source re-read proves why: `GillLearningSheet.astro` conditionally renders the `tabQuiz` trigger under `hasQuiz`, but renders `panelQuiz` unconditionally. Series configurations with `quiz: []` therefore create a deterministic orphan label relation.

Correct bounded repair: condition the `panelQuiz` surface on the same `hasQuiz` authority; do not absorb this markup root into `reader-controls-a11y.js` while the relation-state successor owns that runtime.

#### Mobile Back authority

Stable census finds **174 Back-authority manifestations across 42 routes**. The shared mobile Back target diverges from canonical series/config parent authority on Heart, Baptist, Genesis and Pastor routes.

This independently validates the bounded Product successor `#1240`, which derives mobile Back from `config.railBackHref` instead of the Gill-specific `/biografii/` hardcode.

#### Semantic list structure

Stable census finds **103 invalid-list manifestations across 50 routes**:

- `gbs2-track`: 100;
- `hrail-track`: 3.

Source re-read confirms both shared reader rails place decorative `<span>` tracks directly inside semantic `<ul>` containers. This is a real HTML/list-semantics root, not a route-specific defect. Repair must preserve the current visual axis/geometry rather than blindly moving the decorative node.

#### Popup trigger relations

Stable census finds **70 missing popup-trigger relation manifestations across all 55 routes**. Most are shared `hMobileMenuBtn`; smaller classes include Nagornaya section controls and standalone/shared Settings/section triggers.

Product `#1246` owns only its bounded shared relation-state slice. It must not be described as closing every special-reader/Nagornaya relation manifestation.

Canonical Product authority for all four reader-control classes above remains issue `#1224`.

### 35.5 Footnote semantic projection is a separate system root

Stable census reports `footnote-name-not-unique` in **14 scenes**, but 14 is not the number of affected notes.

Exact repeated generic-name note counts:

- Hermenevtika: **114**;
- `/articles/kod-da-vinchi/`: **21**;
- `/articles/krajne-li-isporcheno-serdce/`: **40**.

This strengthens Product issue `#1225`: footnotes need one source identity with truthful screen/accessibility/print projections. Route-local label patches or making floating tooltips visible in print would not solve the publication model.

### 35.6 Findings intentionally not promoted yet

#### Click failures

The stable 124 `click-failed` manifestations are heavily concentrated at mobile 390:

- `mobPartTocBtn`: 49;
- theme toggle: 49;
- Favorite: 18;
- remaining identities: small tail.

The runner still Escape-resets state on the same page between generic clicks rather than using a fresh page/context per control. Isolated representative replay is required before these counts can become Product defects.

#### Target size

Stable census records **207 undersized-target manifestations**, but the current assertion is only a size prefilter. WCAG 2.2 SC 2.5.8 permits undersized targets when the normative spacing/exception condition is met.

Therefore `width < 24 || height < 24` is not a complete accessibility verdict. The audit owner has been handed a stronger classification model:

- target-size pass;
- spacing pass;
- review/exception;
- fail with nearest conflicting target evidence.

No `207 accessibility defects` claim is authorized.

#### Runtime errors

Twelve runtime-error scenes remain mixed with WebKit `interactive-widget` warnings and localhost manifest/CSP noise. One Hermenevtika WebKit `TypeError: Load failed` merits isolated reproduction; the mixed raw count does not.

#### Nagornaya mobile clipping

`barShareBtn` is visually clipped in six mobile-390 scenes (all five parts in Chromium plus representative WebKit). This is stronger than a generic geometry warning, but exact markup/runtime ownership must be separated from current Search overlap before a mutation lane is opened.

### 35.7 S12 severity correction after route-owner verification

A first source scan found old backstage prose in `BaptistyRossiiBody.astro` (`MD-досье`, `<code>research</code>`, local copies and map-edit queue wording). Route wiring then disproved the assumption that this file is the current Baptist landing owner.

Current `/baptisty-rossii/` imports and renders `BaptistyRossiiBookLanding.astro`, whose reader-facing source/archive prose is materially cleaner and does not expose the repository workspace.

Therefore the old Body is currently a **retirement/source-scope ambiguity**, not a proved live-route defect. It should either be proven unused and retired through existing authority/Strangler machinery, or cleaned/guarded if it remains a valid publication source. The hygiene scanner must not simply exclude it to obtain green without retirement proof.

The real current direct S12 blocker remains `/baptisty-rossii/spravochnik/`: its route imports `BaptistyRossiiSpravochnikPageHead.astro`, and that PageHead repeats `research-досье и очередь правок 3D-карты` in meta description, Twitter, OG and Article JSON-LD.

This correction is important: the audit explicitly **demoted one initial hypothesis** after stronger route-owner evidence and preserved only the directly verified current defect.

### 35.8 Discovery/manifest authority widened beyond the original catalog finding

A later disposable read-only diagnostic measured existing Search-manifest field parity and found **67/73 existing manifest rows** diverge from built/PageHead metadata in at least one field:

- 66 title;
- 29 description;
- 4 missing image;
- 17 image mismatch;
- 16 published-date;
- 25 modified-date.

The canonical normalizer can derive the needed metadata, but its migration path skips rows already present in the manifest. This makes `CATALOG-PROJECTION-01` depend on a broader existing-row discovery-authority convergence rather than a manual catalog-only patch.

Direct manifest hand-editing remains the wrong mutation layer. Reconciliation must preserve non-derived extras such as featured/priority/scripture/series/author/wordCount fields where applicable.

### 35.9 Search current control-plane barrier

Search PR `#1209` remains the owner for truthful continuation. At the latest durable AuditRepo refresh, its observed head had advanced to `c8caefeeba8fef9c1a3cf8973203632f0a12af5a`, was still behind current main and still had an **84-file net diff** containing two temporary transport files:

- `.github/workflows/search-stale-interaction-finalizer.yml`;
- `scripts/search-stale-interaction-finalizer.mjs`.

Earlier exact-head failures proved the repository policy rejects repo-wide staging / unauthorized `cache-bust --write` in that transport. Those historical reds must not be mislabeled as the latest-head conclusion if the head moves, but the structural merge barrier is unchanged:

1. temporary writer/applicator absent from final net diff;
2. current main contained without force/rebase;
3. PR body names actual final SHA/scope;
4. final exact-head Shared/Search/runtime/deploy gates terminal green.

Do not debug Search continuation from a source/cache-projection red that aborts before browser runtime.

### 35.10 Source Authority trigger closure: concrete witness fixed, system guard incomplete

Merged Product `#1245` fixed the concrete Baptist trigger false-negative by adding Baptist MDX/body publication roots to Source Authority PR/push filters.

That does **not** by itself prove the broader trigger-closure failure mode cannot recur when validator scope expands. Product issue `#1244` requested an adversarial/path-applicability contract; `#1245` intentionally changed only four filter lines and did not implement that guard.

Correct current classification:

- concrete Baptist witness: **fixed**;
- generic Source Authority trigger-closure guard health: **active SYSTEM residual** under `#1244`.

### 35.11 Reader successors and ancestry

Current bounded reader successors at the addendum anchor:

- `#1240@f91507fb...` — mobile Back authority, two intended files;
- `#1246@3cd81b29...` — relation-state synchronization, two intended files.

Both are semantically bounded but `behind=2` after independent Product main advances. Do not create v3/v4 successors every time main moves. Refresh each once when the near-term main mover settles, rerun exact-head CI and preserve the existing forensic predecessors.

### 35.12 Strangler Wave A status

Product `#1222` head `22983986fadc50f22fb831a2b956915576448aad` contains Product `main@11999f6d...`, remains exactly five intended files and preserves the verified readiness improvement:

```text
retirement blockers: 26 → 21
11 mechanical + 3 obsolete + 7 owner decisions
```

At the latest check:

SUCCESS:

- Shared Files;
- Deploy Candidate;
- Metadata & IndexNow;
- Search Modal;
- Source Authority.

Still non-terminal:

- Visual Parity: in progress;
- Route Registry: queued.

Therefore the semantic repair looks healthy, but **merge authorization is still false until the exact-head suite is terminal**.

### 35.13 Updated non-conflicting sequence

The immediate sequence after this addendum is:

1. keep `#1209` isolated until temporary transport disappears and final exact-head Search evidence is clean;
2. allow `#1222` to finish its independent terminal gates; do not touch its five files;
3. after Search releases Spravochnik PageHead, repair `BAPT-S12-01` at source metadata authority, then run canonical manifest/RSS/sitemap convergence;
4. unblock `#1221` only after discovery metadata is source-converged;
5. refresh `#1240/#1246` once onto the then-current main;
6. repair conditional quiz/list/Menu residuals as separate bounded slices under issue `#1224`, reusing existing guard owners rather than creating another reader framework;
7. keep `#1225` footnote projection independent from reader-control runtime;
8. continue Baptist media/content/3D, Heart, Bible and live-Gold lanes without combining them into shared refactors.

### 35.14 Updated audit rule

This marathon produced a reusable governance principle:

> **A stronger later witness may promote, narrow, or demote an audit finding.**

Examples from this wave:

- `1855` browser manifestations were reduced to `887` after fixing the audit harness itself;
- old Baptist landing backstage prose was demoted from “live defect” to “shadow/retirement ambiguity” after route-owner verification;
- `#1245` closed the concrete Baptist Source Authority trigger witness but left the broader adversarial guard-health requirement active;
- Search red checks that abort in cache/source validation are not evidence that continuation runtime itself is broken.

This principle should remain part of CURRENT GOLD practice: preserve forensic history, but never defend an earlier severity/count after stronger evidence changes the classification.