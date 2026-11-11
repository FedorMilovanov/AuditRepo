> **Owner-selected Grok desktop reader continuation (2026-11-06):** [current V24 handoff](prototype/grok-desktop-reader/v24/README.md) and [interactive reference](prototype/grok-desktop-reader/v24/REFERENCE-V24.html). Prototype/evidence only, not Product release authority. This does not add a second active MASTER backlog.

# gb-is-my-strength / gospod-bog.ru

AuditRepo project for `FedorMilovanov/gb-is-my-strength`.

## Start

1. [`verified/MASTER_BUG_MATRIX.md`](./verified/MASTER_BUG_MATRIX.md) — **single active matrix of verified necessary work**.
2. [`DOC_MAP.md`](./DOC_MAP.md) — where each kind of evidence/status belongs.
3. [`WORK_QUEUE.md`](./WORK_QUEUE.md) — optional improvements that are not yet mandatory active work.
4. [`verified/SYSTEM_THEMES.md`](./verified/SYSTEM_THEMES.md) — reusable root-cause context.
5. `incoming/`, `verification/`, `reverify/` — evidence and current-check material.
6. `legacy/` — retired material available for later forensic lookup, not an active backlog.
7. [Редакционный аудит E0–E7: единый вход](./verification/2026-11-11-editorial-evidence-decision-index.md) — архив, решения, калибровка 12 статей, handoff владельцам; **не второй backlog**.

General model: [`../../AUDITREPO_OPERATING_MODEL.md`](../../AUDITREPO_OPERATING_MODEL.md).

## Редакционное качество — инструкция следующему агенту (11.11.2026)

**Точка входа:** [единый индекс E0–E7](./verification/2026-11-11-editorial-evidence-decision-index.md). В нём собраны исторические исследования трёх агентов (AuditRepo #548, 61 файл), [дедуплицированные 21 тема](./verification/2026-11-11-three-agent-article-decision-crosswalk.md) (#551), волны 4–7 (#552), калибровка 12 реальных статей и распределение владельцев E5/E7 (#553). Это *evidence и provenance*, а не 21 новая задача и не разрешение массово переписывать статьи.

**Правила, обязательные для редактора, находятся в Product.** Начать с [AGENTS-REFERENCE.md](https://github.com/FedorMilovanov/gb-is-my-strength/blob/main/AGENTS-REFERENCE.md), далее — [ARTICLE-STANDARD-CHARTER.md](https://github.com/FedorMilovanov/gb-is-my-strength/blob/main/docs/ARTICLE-STANDARD-CHARTER.md), [CONTENT-QUALITY-STANDARD.md](https://github.com/FedorMilovanov/gb-is-my-strength/blob/main/docs/CONTENT-QUALITY-STANDARD.md) и [EDITORIAL-SOURCE-POLICY.md](https://github.com/FedorMilovanov/gb-is-my-strength/blob/main/docs/EDITORIAL-SOURCE-POLICY.md). Изменения стандартов слиты Product [#2299](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2299); [workflow #43050451190 (attempt 3)](https://github.com/FedorMilovanov/gb-is-my-strength/actions/runs/43050451190) удостоверяет успешные build, deploy, generic live и TTS на **историческом** SHA `9618e8240731bd20e634506b4c975b154892c7ba`. Не переносить этот witness на будущий SHA и не объявлять все статьи исправленными.

**Что ещё исправлять:** [MASTER](./verified/MASTER_BUG_MATRIX.md) — единственная матрица *текущей подтверждённой необходимой* работы; [PROGRAM CLOSURE MATRIX](./PROGRAM_CLOSURE_MATRIX.md) — более широкая программа завершения сайта, [WORK_QUEUE](./WORK_QUEUE.md) — необязательные улучшения. Старые сырые количества, короткие абзацы, риторические тройки, «ИИ-похожесть» сами по себе не являются багами. Нельзя создавать вторую редакционную MASTER или новые автоматические AI-score/длины абзацев.

**Последовательность:** (1) проверить актуальные Product `main`, relevant open PR/branches и смыслового владельца; (2) открыть точную находку E0–E7 и первоисточник/издание; (3) получить current-source witness, сузить или опровергнуть claim; (4) если найден реальный незакрытый дефект, привязать его к существующему MASTER-owner (без дубля); (5) редактировать только в согласованном Product lane с применимыми exact-head checks и, если заявлен production, live witness. Архивные доказательства сами по себе не разрешают Product mutation.

**Известный охраняемый handoff:** документы издательства «Христианин» от 5 и 10 июня 1971 года — опубликованные репродукции обнаружены (AuditRepo #549), но сверка с подлинниками отделена от обнаружения текстов. Уникальная несмерженная правка — [закрытый Product #2298](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2298); на якоре E7 файл `BaptistyRossiiSpravochnikBody.astro` принадлежал [открытому Product #2292](https://github.com/FedorMilovanov/gb-is-my-strength/pull/2292). Перед новой работой проверить текущий owner; не перетирать чужую ветку, не удалять уникальную правку и не считать передачу исправлением.

## Stable project facts

- Source repository: `FedorMilovanov/gb-is-my-strength`.
- Public site: `gospod-bog.ru`.
- Architecture: Astro + strangler pattern with native routes and preserved legacy/static surfaces.
- Production-like verification must use the actual project build/publication path; plain `astro build` can create false findings.
- The project includes route-level applications, article/reader surfaces, search, maps, PWA/offline behavior and shared runtimes.

Current Product HEAD, open PRs, branch ownership, workflow status and deploy identity are read from the Product repository when work begins. They are intentionally not duplicated as permanent truth here.

## MASTER means work, not only bugs

A MASTER row may represent:

- a reproduced defect;
- a verified necessary implementation/improvement;
- a system/root-cause repair;
- a required migration/retirement step;
- a narrowed residual;
- an owner decision that blocks real work.

A proposed improvement enters MASTER only after verification shows that it is genuinely needed. Pure ideas, speculative refactors and low-value polish stay out of MASTER, normally in `WORK_QUEUE.md`.

## Evidence and witnesses

Raw reports are evidence, not automatic Product authority. Before implementation, inspect the selected current Product surface and use proportionate independent witnesses. For high-risk security, rights, release identity, data loss or production decisions, multiple independent angles are expected. For ordinary local work, one strong current witness plus a clear mechanism can be sufficient.

Historical evidence can always be consulted again, but it does not authorize a current Product mutation until applicability is rechecked.

## Continuous cleanup

MASTER must stay compact:

```text
verify needed work
→ put current work in MASTER
→ implement / decide
→ verify result
→ remove row from MASTER
→ preserve useful retirement context in legacy
```

Closed/stale/duplicate/absorbed/invalid rows do not accumulate in MASTER. If many symptoms reduce to one current root, replace them with one `SYS-*` row and retire the old symptom rows.

`legacy/` remains available if a regression, contradiction or historical question appears, but agents must not treat it as a task list.

## Collision boundary

Before Product work, always inspect current open Product PRs/branches and shared owners. Never create a parallel SYSTEM fix merely because historical AuditRepo evidence exists.

## Owner-selected design reference: Grok desktop reader (2026-11-06)

**[V23 current interactive HTML and complete next-agent handoff](./prototype/grok-desktop-reader/README.md).** This is a **desktop-only preintegration design reference**, not a Product deploy or a new MASTER entry. Includes exact V23/V22 HTML, preservation decisions, historical regressions, QA and a non-destructive Product pilot plan. Read it before attempting any Grok-style TOC migration; current Product/PR owners must be rechecked.
