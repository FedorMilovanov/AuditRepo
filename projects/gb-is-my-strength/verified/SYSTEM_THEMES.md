# System Themes — gb-is-my-strength

Системные темы — это классы причин и направлений, извлечённые из многих audit passes. Они помогают не чинить десятки симптомов по одному.

Это **не список автоматически актуальных багов**. Каждая тема проверяется на текущем Product только когда владелец выбирает её для работы.

## Status model

- `evidence-rich` — много исторического evidence и проявлений;
- `candidate` — правдоподобная системная тема, нуждается в выбранной current-check wave;
- `active-work` — владелец выбрал тему для реализации;
- `absorbed/closed` — общий mechanism устранён и репрезентативно проверен;
- `parked` — тема признана, но сейчас не выбрана;
- `retired` — больше не полезна как активная причинная модель.

---

## ST-RELEASE — Release identity and publication transaction

- Status: `evidence-rich`, revalidate when selected.
- Historical manifestations: validated/built/deployed SHA ambiguity, dirty generated source, overlapping workflows, deploy recovery loops, notification drift.
- System question: существует ли один воспроизводимый candidate identity from validation through publication and notification?
- Better-than-local outcome: one release transaction owner and permanent candidate identity evidence.
- Do not assume every July formulation remains current.

## ST-EDITORIAL — Editorial dates and generated metadata ownership

- Status: `evidence-rich`, revalidate when selected.
- Historical manifestations: technical commits influencing visible/structured dates, duplicated date/read-time surfaces, source mutation by automation.
- System question: есть ли один explicit editorial data owner separated from build timestamps?
- Better-than-local outcome: typed publication metadata and read-only generation.

## ST-CACHE — Service worker, asset revisions and offline truth

- Status: `evidence-rich`; substantial repairs already exist, residuals require narrow verification.
- Historical manifestations: unversioned/versioned mismatch, stale HTML, cache baseline drift, offline route ambiguity.
- System question: какие remaining surfaces still have multiple cache/version authorities?
- Better-than-local outcome: one cache transaction and route-scoped offline contract.

## ST-RUNTIME-OWNERSHIP — Shared runtime ownership

- Status: `evidence-rich`; several clusters have already been improved.
- Historical manifestations: duplicate TTS, favorites, search, reader projection, overlay/focus owners.
- System question: где ещё одна user capability имеет несколько independent state owners?
- Better-than-local outcome: canonical owner APIs with representative route contracts.
- Closure rule: related symptoms may be `absorbed-by-system-fix` when shared ownership and class-level regression are proven.

## ST-STRANGLER — Legacy/native duplication and retirement

- Status: `evidence-rich`; current inventory is verified at Product exact head `e15afda5681ce4e2f0a713e6e7f0ca2afbb0efae`.
- Exact manifestation at that anchor: **52 public `index.html` = 51 Astro native shadows / 4,026,027 bytes + 1 explicit built app / 2,245,854 bytes; unowned = 0**.
- Important exception: `/konfessii/russkij-baptizm/_app/` is `built-app` / `copy-as-built-asset`, not a removable legacy duplicate.
- Common mechanism: current `legacy-shadow-wrapper-audit.js` uses every committed Astro shadow as canonical/noindex/structure/text parity evidence, so source duplication and verification authority are coupled.
- Current deletion-ready count at the verified anchor: **0**.
- System question: how can parity/reference authority be moved to a named immutable owner before a legacy shadow is retired?
- Better-than-local outcome: route-family evidence migration followed by bounded deletion and inventory reduction, without weakening parity coverage.
- Inventory counts remain advisory; reverify the selected route/family before work.
- Detailed evidence: `../verification/2026-08-06-strangler-inventory-wave/REPORT.md`.

## ST-PERFORMANCE — Measured route-scoped loading

- Status: `candidate` (`R-005`, `R-006`).
- Historical manifestations: large inline Baptists app surface, TTS runtime loaded beyond governed routes, monolithic legacy bundles.
- System question: где measurement proves user-visible or operational cost?
- Better-than-local outcome: route-scoped extraction/loading with before/after evidence.
- Do not create bundle thresholds before useful implementation evidence.

## ST-CONTENT-AUTHORITY — Content, Scripture corpus, rights and provenance

- Status: `evidence-rich`, often `owner-decision`.
- Historical manifestations: parallel corpora, non-authoritative text, source/provenance uncertainty, search promises exceeding licensed data.
- System question: какой corpus/source имеет publication authority and rights?
- Better-than-local outcome: explicit provenance, licensing boundary and consumer contract.
- Technical work cannot substitute for an owner/rights decision.

## ST-AUDIT-HARNESS — Audit and contract quality

- Status: `active governance theme`.
- Historical manifestations: wrong build mode, stale route shell assumptions, grep overstatement, fragile geometry thresholds, false-green/false-red harnesses, exact-head ritual larger than the finding.
- System question: измеряет ли каждый guard meaningful user/system behavior at proportionate cost?
- Better-than-local outcome: reuse existing owners, advisory-first new contracts, periodic deep forensic, lightweight ordinary PR validation.

---

## Adding or changing a theme

A theme should contain:

- at least several related manifestations or a clearly systemic mechanism;
- the common question/mechanism;
- what class-level outcome would be better than local patches;
- known exceptions;
- a trigger for current verification.

Do not turn every broad idea into a blocking program. System themes are navigation aids, not automatic obligations.
