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
- Current Lot publication is a live stale-green example: #1339 is eight commits behind Product `main@c389f88…`, so its route/source/discovery/media/browser proof must be re-earned after replay.
- Search role authority is now merged; stale Lot Search/RSS/sitemap is downstream derived work, not an open Search-writer root.
- Lot media adds a paged-output constraint: screen reveal animation is not print authority. Accepted semantic figures require an explicit print/PDF visibility witness.
- Do not infer a site-wide release defect merely because a draft is behind main.

## ST-EDITORIAL — editorial dates and generated metadata ownership

- Status: `evidence-rich; major control-plane gap closed`.
- Editorial Metadata v3 remains date authority separated from technical/build timestamps.
- Pre-merge freeze gap #1272 is closed/completed through existing Deploy Candidate freeze proof; future work needs a new current drift witness.

## ST-CACHE — service worker, asset revisions and offline truth

- Status: `evidence-rich`; residuals require narrow current verification.
- Historical `AR-IDX-05` remains in WORK_QUEUE as reverify-before-promotion, not a current mandatory defect.
- Better-than-local outcome remains one truthful revision/cache authority per loaded asset and route-scoped offline contract.

## ST-RUNTIME-OWNERSHIP — shared runtime ownership

- Status: `active-work` where MASTER names a current root.
- Current concrete roots:
  - `SYS-ARTICLE-QUIZ-NATIVE-PARITY` / Product #1369. Native quiz renderer already exists; #1365 is closed false-positive. Current defects are score-tier/explanation/badge semantic parity at the shared renderer/schema layer.
  - `SYS-READER-CONTROL-SEMANTICS` / Product #1224 with audit census #1212. Bounded slices #1258/#1259/#1267 are merged.
  - `SYS-FOOTNOTE-SEMANTIC-PROJECTION` / #1225.
- Historical duplicate TTS/favorites/search owners are not automatically reopened.

## ST-STRANGLER — legacy/native duplication and retirement

- Status: `active-work` via `SYS-STRANGLER-RETIREMENT`.
- Current Product anchor observed: `c389f88ed06eb8e30cebf2a1c4f0d5764c18522f` (merged Search #1313).
- Truthful readiness remains **12** after merged #1364.
- Current replay owner is **#1371@346776b2…**, created directly from current main after Search merge, with exactly four intended visual-parity/reference-storage files and expected **12 → 11**.
- #1367/#1370 are superseded replay history, not current owners.
- Expected post-merge classes: 1 mechanical `gill-reading-time` reader (inside current catalog #1348), 3 obsolete legacy audits, 7 owner-decision blockers.
- Hidden self-verifier arithmetic defect remains closed by #1270; no hidden +1.
- Physical move/delete remains unauthorized until readiness explicitly permits it.

## ST-PERFORMANCE — measured route-scoped loading

- Status: `candidate / measurement-first`.
- Baptists built app and Karty effects remain WORK_QUEUE measurement questions unless current browser evidence promotes them.

## ST-CONTENT-AUTHORITY — content, Scripture corpus, rights and provenance

- Status: `evidence-rich / owner-decision`.
- Binding Bible corpus-rights decision remains Research `d52ea9d54dd2c2488223d25f5f6cefd263c23328` (#149).
- Full-corpus publication remains fail-closed until exact source acquisition/provenance is complete.
- CrossWire `RusSynodal` 1.9.1 is candidate-only pending archive SHA-256, licence/source/book manifest, 66-book mapping and verse-level import receipt; LIO/Cassian restrictions remain binding.

## ST-DISCOVERY-AUTHORITY — Search/catalog role and membership projection

- Status: `active-work downstream only`.
- Existing-row Search reconciliation is closed (#1254, 46→0).
- **New-row Search role authority is now also closed upstream:** merged #1313 on `main@c389f88…` derives author/translator/editor from structured role authority and no longer synthesizes editor from meta-author.
- The active remaining root is `CATALOG-PROJECTION-01` / #1348. Current head `b526a175…` is **behind=0** from current main and direct source read proves role-aware consumer behavior already exists with author-only, author-editor, translation/editor and fail-closed owner-sensitive fixtures.
- Therefore #1348's current barrier is exact-head catalog/publication evidence, not inventing role semantics.
- Lot human reachability remains absorbed by #1348. Lot stale generated Search/RSS/sitemap is downstream replay after #1339 refresh, not a Search-root defect.

## ST-VISUAL-TRUTH — migration parity vs product regression

- Status: `active-work` through `SYS-PRODUCT-VISUAL-GOLDENS` / #298.
- Migration legacy↔dist parity does not prove owner-approved product-state preservation; common-mode deletion can remain green.
- #1371 only repairs retained-reference source resolution for existing migration parity; it does not close product-golden blind spot.
- Lot `LOT-MEDIA-REVEAL-PRINT-01` is a route publication/print-readiness residual, not a replacement for system product goldens: current placement uses hidden-base `.reveal`, while view timelines are inactive in paged media and no generic print reveal override was found.
- Print/PDF correctness remains a separate semantic/physical projection contract.

## ST-AUDIT-HARNESS — audit and contract quality

- Status: `active governance theme`.
- Current roots:
  - `SYS-MAP-SCALE-RESIZE-WITNESS` / #1363: fixed 120ms sampling during a `.3s` transition; bounded convergence must preserve the same ≤2.5px invariant.
  - `SYS-HOME-DESIGN-SEARCH-SETTLED` / #1299.
  - #1212 all-reading-route control census; real Product reds should repair Product, not be deleted from audit.
- Distinguish harness defects from Product defects before mutation.

## ST-SOURCE-GUARD-CLOSURE — validator strength and trigger applicability

- Status: `active-work` through `SYS-SOURCE-AUTHORITY-TRIGGER-CLOSURE` / #1244.
- Concrete Baptist trigger gaps were improved by #1245/#1260.
- Remaining question is authority-derived PR+push applicability with representative adversarial protected-source mutations, not more ad-hoc path-list accretion.

## Adding or changing a theme

A theme should contain a shared mechanism or several related manifestations, a better class-level outcome, known exceptions and a trigger for current verification. Current repair belongs in MASTER; optional/measurement-first work in WORK_QUEUE; closed work leaves active rows but retains provenance in verification/Git.