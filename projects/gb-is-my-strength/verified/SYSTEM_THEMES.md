# System Themes — gb-is-my-strength

Системные темы — причинная карта из многих audit passes. Это **не второй backlog** и не authority на Product mutation. Обязательная текущая работа живёт только в [`MASTER_BUG_MATRIX.md`](./MASTER_BUG_MATRIX.md); перед любой lane перепроверяются свежие Product owner, anchor, PR/branch overlap и применимые checks.

## Status model

- `evidence-rich` — исторический механизм хорошо задокументирован;
- `candidate` — нужна выбранная current verification;
- `active-work` — допустимо только при ссылке на существующий canonical MASTER row;
- `absorbed/closed` — механизм репрезентативно закрыт;
- `parked` — не обязательная текущая работа;
- `retired` — больше не полезная активная модель.

Ни один старый PR, SHA, issue или branch reservation сам по себе не поддерживает `active-work`. Точные прежние состояния остаются в verification, closure ledger и Git history.

## ST-RELEASE — release identity and publication transaction

- Status: `evidence-rich / reverify-on-demand`.
- Theme: source, candidate, publication and live state are different authorities. A green lane proves only its declared dimension.
- Recheck trigger: a newly admitted release/publication work unit or a current production incident.

## ST-EDITORIAL — editorial dates and generated metadata ownership

- Status: `evidence-rich`.
- Theme: editorial authority, generated metadata and release-time freeze must have one declared ownership chain.
- Recheck trigger: a current mismatch or an admitted change to the producer/freeze contract.

## ST-CACHE — service worker, asset revisions and offline truth

- Status: `evidence-rich / candidate`.
- Theme: asset revision ownership, runtime cache identity and offline behavior must be verified together when a relevant signal is selected.
- Recheck trigger: reproducible stale asset/offline failure or a current verified necessary improvement.

## ST-RUNTIME-OWNERSHIP — shared runtime ownership

- Status: `evidence-rich`.
- Theme: file isolation does not prevent collisions in shared overlay, focus, reader, navigation or lifecycle owners.
- Recheck trigger: several manifestations share one live owner, or an exact current browser/runtime witness proves a collision.

## ST-STRANGLER — legacy/native duplication and retirement

- Status: `evidence-rich / reverify-before-mutation`.
- Theme: counted dependency zero is necessary but not sufficient for physical move/delete; immutable content, storage authority and representative runtime behavior must survive.
- Recheck trigger: a fresh retirement candidate with a non-destructive dry-run and positive preservation witnesses.

## ST-PERFORMANCE — measured route-scoped loading

- Status: `candidate / measurement-first`.
- Theme: source shape or bundle size alone is not a material performance defect. Measure representative runtime impact before promotion.
- Recheck trigger: a current budget failure or reproducible user-visible cost.

## ST-CONTENT-AUTHORITY — content, Scripture corpus, rights and provenance

- Status: `evidence-rich / owner-decision when admitted`.
- Theme: content existence, publication rights, provenance and rendered truth are separate required authorities.
- Recheck trigger: a selected corpus/media publication decision with exact source/licence/import evidence.

## ST-DISCOVERY-AUTHORITY — Search/catalog membership projection

- Status: `evidence-rich`.
- Theme: public membership, search role, catalog, sitemap/RSS and generated indexes must be derived from canonical owners rather than hand-maintained per-route copies.
- Recheck trigger: a current projection mismatch or an admitted publication transaction.

## ST-VISUAL-TRUTH — migration parity versus product regression

- Status: `parked / owner-value decision` unless MASTER says otherwise.
- Theme: legacy↔dist parity proves migration equivalence, not owner-approved product truth; browser, accessibility, search and publication claims remain dimension-scoped.
- Recheck trigger: an owner-approved golden program or a current route-specific visual/runtime defect.

## ST-AUDIT-HARNESS — oracle and evidence quality

- Status: `evidence-rich / current only through exact MASTER rows`.
- Theme: `UNPROVEN != PASS`; locators and structural surrogates are not semantics; same-tree contradictory outcomes require event/environment investigation; temporary writers are not terminal proof.
- Recheck trigger: a reproducible false green/false red, evidence-integrity defect or current control-plane admission.

## ST-SOURCE-GUARD-CLOSURE — validator strength and trigger applicability

- Status: `evidence-rich / reverify-on-change`.
- Theme: a guard must prove both its semantic invariant and its applicability on the event/final head that matters. A check that is absent, skipped or unable to start is not a pass.
- Recheck trigger: a source/guard workflow change, a lifecycle mismatch or a newly admitted enforcement decision.

## Adding or changing a theme

1. Record signal class, exact anchor/event and proof state.
2. State the claim boundary and what the witness does not prove.
3. Name the semantic owner and overlapping active work.
4. Put current repair only in MASTER after admission; put optional/measurement-first work in WORK_QUEUE.
5. Remove closed work from MASTER while retaining provenance in evidence/ledger/Git.

A Product main SHA change alone is not a reason to rewrite themes or synchronize AuditRepo.
