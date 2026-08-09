# System Themes — gb-is-my-strength

Системные темы — причинная карта из многих audit passes. Это **не второй backlog**: обязательная текущая работа живёт только в `MASTER_BUG_MATRIX.md`, а каждая тема перед Product mutation заново проверяется на текущем коде/owner.

## Status model

- `evidence-rich` — много исторического evidence и проявлений;
- `candidate` — правдоподобная тема, нужен selected current-check;
- `active-work` — текущий MASTER/владелец уже подтверждён;
- `absorbed/closed` — общий mechanism репрезентативно устранён;
- `parked` — известна, но сейчас не обязательна;
- `retired` — больше не полезна как активная причинная модель.

## ST-RELEASE — release identity and publication transaction

- Status: `evidence-rich`.
- Historical manifestations: validated/built/deployed SHA ambiguity, dirty generated source, overlapping writers, deploy recovery loops, notification drift.
- Current useful question: существует ли один воспроизводимый candidate identity from validation through publication, and does every generated projection come from its declared writer?
- Current Lot publication is a live example of why stale green cannot be merge authority: route registration, derived Search/Scripture/catalog/media/browser evidence must be re-earned after ancestry movement.
- Do not infer a site-wide release defect merely because one draft is behind main.

## ST-EDITORIAL — editorial dates and generated metadata ownership

- Status: `evidence-rich; major control-plane gap closed`.
- Editorial Metadata v3 remains the date authority separated from technical/build timestamps.
- The verified pre-merge freeze gap (`#1272`) is **closed/completed**: the existing PR Deploy Candidate path now runs the canonical freeze audit against the already-built production-like candidate; push-main release freeze remains a separate final boundary.
- Future work under this theme requires a new current drift/ownership witness; do not keep #1272 or its implementation as active work.

## ST-CACHE — service worker, asset revisions and offline truth

- Status: `evidence-rich`; substantial repairs already exist, residuals require narrow current verification.
- Historical manifestations: unversioned/versioned mismatch, stale HTML, cache baseline drift, offline route ambiguity.
- Current optional reverify candidate `AR-IDX-05` moved to WORK_QUEUE because the 2026-08-09 consolidation wave did not re-establish a current defect.
- Better-than-local outcome remains one truthful revision/cache authority per loaded asset and route-scoped offline contract.

## ST-RUNTIME-OWNERSHIP — shared runtime ownership

- Status: `active-work` where MASTER names a current root.
- Current concrete roots include:
  - `SYS-ARTICLE-QUIZ-NATIVE-PARITY`: native quiz migration changed accepted score-tier and explanation semantics; repair belongs to shared renderer/schema, not Lot-only code.
  - `SYS-READER-CONTROL-SEMANTICS`: shared reader control→surface/action semantics + class-level census.
  - `SYS-FOOTNOTE-SEMANTIC-PROJECTION`: one publication-note identity projected truthfully to screen/accessibility/print.
- Historical manifestations such as duplicate TTS/favorites/search owners are not automatically reopened; many were already absorbed by shared owners.
- Better-than-local outcome: canonical owner APIs/data contracts with representative route regression proofs.

## ST-STRANGLER — legacy/native duplication and retirement

- Status: `active-work` via `SYS-STRANGLER-RETIREMENT`.
- Current Product anchor observed in the 2026-08-09 consolidation: `3a0f21b0ec01e423a2625becf13f600a07a6ddb5` (#1362).
- Current truthful readiness reported by the active retirement program: **13 blockers**.
- Current next bounded owner: Product #1364, which must make the six Gill claim legacy surfaces resolver-backed and fail closed at 6/6; expected arithmetic **13 → 12** with 53 references / 36 dependencies / 7 owner-decision blockers otherwise stable.
- The old hidden self-verifier arithmetic defect is closed by #1270; do not add a hidden +1 to current readiness.
- Core invariant: logical retained-reference identity is immutable while physical storage is resolved through the central active/quarantine authority; ambiguity/missing authority fails closed.
- **Physical move/delete remains unauthorized** until readiness explicitly permits it. Historical 26→21→20→19→18→17… counts are forensic history, not current planning numbers.

## ST-PERFORMANCE — measured route-scoped loading

- Status: `candidate / measurement-first`.
- Historical TTS heavy-model work was absorbed into lazy Worker-owned behavior; do not reopen generic TTS loading without a route/request regression.
- Baptists built app and Karty rendering effects remain measurement questions in WORK_QUEUE, not automatic MASTER rows.
- System question: where does direct current measurement prove user-visible/operational cost that remains after current owner/lazy-loading repairs?

## ST-CONTENT-AUTHORITY — content, Scripture corpus, rights and provenance

- Status: `evidence-rich / owner-decision`.
- Research current head has advanced in unrelated Heart work, but the binding Bible-corpus rights/provenance decision remains Research merge `d52ea9d54dd2c2488223d25f5f6cefd263c23328` (#149).
- Product has a governed 66-book registry, but full-corpus publication remains fail-closed until exact source acquisition/provenance is complete.
- CrossWire `RusSynodal` 1.9.1 remains candidate-only pending archive SHA-256, embedded licence/source/book manifest, 66-book/versification mapping and verse-level import receipt.
- `RusSynodalLIO` requires downstream permission; Cassian must not be expanded/republished without explicit permission.
- MASTER owner-decision `SEARCH-P2-07` remains the actionable boundary.

## ST-DISCOVERY-AUTHORITY — Search/catalog role and membership projection

- Status: `active-work`.
- Existing-row Search reconciliation is **closed**: merged #1254 refined the writer-owned baseline to 46 rows and converged it 46→0 without seizing editor/tags/dates/priority authority.
- Current writer root is `SEARCH-MANIFEST-NEW-ROW-ROLE-AUTHORITY` / #1261/#1313: new rows must preserve distinct author/editor/translator roles.
- Current downstream catalog root is `CATALOG-PROJECTION-01` / #1348: `/articles/` membership should derive from existing Search + publication ownership, not another hand-maintained card registry.
- Lot human reachability and Lot generated role drift are symptoms absorbed by these owners, not reasons for one-off route hacks.

## ST-VISUAL-TRUTH — migration parity vs product regression

- Status: `active-work` through `SYS-PRODUCT-VISUAL-GOLDENS` / Product #298.
- Current legacy↔dist pixel parity proves projection equivalence, not preservation of an owner-approved product state; common-mode deletion can remain green.
- Better-than-local outcome: immutable owner-approved route/state goldens selected from public capability authority; ordinary PR CI read-only; explicit/manual update transaction with old/new digests and exact source SHA.
- Print/PDF correctness remains a separate semantic/physical contract, not a screenshot substitute.

## ST-AUDIT-HARNESS — audit and contract quality

- Status: `active governance theme`; current mandatory instances exist in MASTER.
- Historical manifestations: wrong build mode, stale shell assumptions, grep overstatement, fragile geometry thresholds, false-green/false-red harnesses, stale exact-head evidence.
- Current concrete roots:
  - `SYS-MAP-SCALE-RESIZE-WITNESS` / #1363: fixed 120ms wait sampled a `.3s` scale-line transition; bounded convergence must preserve the same runtime invariant.
  - `SYS-HOME-DESIGN-SEARCH-SETTLED` / #1299: Home Design uses a non-canonical settled-state heuristic and lacks useful timeout diagnostics while canonical Search Modal can remain green.
  - #1212 remains the all-reading-route reader-control census; confirmed Product reds should repair Product, not be deleted from the census merely to make audit CI green.
- Better-than-local outcome: measure meaningful behavior with stable observable state and proportionate cost; distinguish harness defect from Product defect before mutation.

## ST-SOURCE-GUARD-CLOSURE — validator strength and trigger applicability

- Status: `active-work` through `SYS-SOURCE-AUTHORITY-TRIGGER-CLOSURE` / Product #1244.
- Concrete Baptist trigger gaps were improved by merged #1245/#1260, including an independent internal `_app/index.html` leak witness.
- Remaining SYSTEM question is broader than those paths: can applicability be derived/tested from the actual static-publication source authority so representative protected mutations trigger on PR **and** push without an ad-hoc path list drifting again?

## Adding or changing a theme

A theme should contain a shared mechanism or several related manifestations, a better class-level outcome, known exceptions and a trigger for current verification. Do not turn every broad idea into a blocking program. If a current repair is selected, represent it in MASTER; if it is optional/measurement-first, put it in WORK_QUEUE; if closed, remove it from active rows while keeping useful provenance in verification/Git.