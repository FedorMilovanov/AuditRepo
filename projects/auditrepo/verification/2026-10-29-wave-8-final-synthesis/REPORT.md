# Итоговый self-audit AuditRepo — broad wave 8

**Базовый anchor:** `main@eca8b551ab9cfa62720ab91c462beb577663f156`  
**Накопительный PR:** #502  
**Статус:** аудит завершён; осталось 2 явно ограниченных owner/admin решения

## 1. Что было проверено

- корневые governance/authority документы, project contracts и templates;
- validators, regression suites и все пять GitHub Actions workflows;
- tracked tree, размеры, бинарные/архивные артефакты, exact duplicates и Git object graph;
- все remote refs, 480 PR на момент повторного forensic прохода и 22 issues;
- 69 закрытых без merge PR, их exact heads, добавленные пути, replacement/landed/archive proofs;
- существующие корневые `verification/` пакеты и ref-retirement requests/results;
- semantic currency внешних project matrices относительно текущих source owners;
- единственный старый открытый AuditRepo PR #482 на уровне его 33 файлов и выводов.

Self-audit не имеет пользовательского UI, поэтому browser/axe/screenshot evidence к самому AuditRepo неприменимо. Product UI не выдаётся за проверенный этой волной; внешние project conclusions ограничены source/API/current-owner evidence.

## 2. Итоговое состояние authority

Создан и зарегистрирован `projects/auditrepo/`:

- `verified/MASTER_BUG_MATRIX.md` — единственный current-work owner self-audit;
- `verified/SYSTEM_THEMES.md` — механизмы, не backlog;
- `verified/CLOSURE_LEDGER.md` — компактные outcomes волн;
- `verification/2026-10-29-wave-*` — подробная доказательная цепочка.

Старые root `verification/` пакеты сохранены как исторические evidence-at-anchor. Они не конкурируют с новым MASTER: branch-cemetery отчёты описывают выполненные прежние инвентаризации, а 2026-09-06 governance/control-plane/integrity отчёты содержат старые counts и уже закрытые ремонты. Переписывать их под текущие цифры было бы подменой истории.

## 3. Закрытые корневые дефекты и улучшения

### History forensic false green

До ремонта regex по PR prose мог терминально классифицировать closed-unmerged PR без reviewed ledger. Теперь:

- ledger coverage 69/69;
- любой новый unledgered PR делает strict красным;
- ветка объясняется closed disposition только после ledger;
- replacement PR должен быть merged, landed commit — ancestor main, archive ref — равен exact PR head.

### Project shape false green

Structure gate теперь требует канонические authority owners, а не только папки. `code-audit` приведён из противоречивого `intake-only`+MASTER состояния в честный `paused` terminal-zero contract. Добавлен отрицательный regression fixture.

### Artifact growth

- удалён 7,690,266-byte nested ZIP после доказательства 49/49 + 22/22 byte-identical retained entries;
- tracked paths с whitespace: 1 → 0;
- новый changed-path gate запрещает exact binary duplicates и требует exact identity/provenance sidecar для архивов и >2 MiB artifacts;
- исторические 28 duplicate groups не удалены массово: потенциальная экономия 4,562,304 bytes не оправдывает разрушение raw/package topology.

### Issue semantics

Созданы четыре lifecycle labels и формализована граница active/evidence/superseded/diagnostic. Integration не может применить labels к issues (REST и GraphQL HTTP 403), поэтому четыре текущие классификации оставлены owner action, а не объявлены выполненными.

### Project currency

- Milovi Cake terminal-zero признан stale: приняты два текущих residual owner — main Lighthouse divergence и open PR #107 WebKit instability;
- Milovi School GSC ownership row закрыт по свежему Product issue #32 receipt и 166/166 URL inspection;
- TLP сохраняет единственный human-Turnstile proof root; поздние contrast/UI changes его не закрывают;
- bible-bot/code-audit terminal states не были механически reopened из-за времени или HEAD movement.

## 4. История, refs и потенциальная потеря

Текущий forensic не нашёл inaccessible closed heads, unexplained refs или manual candidates. Двенадцать `archive/*` refs остаются intentional recovery authority; удаление не рекомендовано без отдельного proof wave. Unreachable Git objects отсутствовали на baseline.

PR #482 полностью reconciled:

- все explicit IDs имеют более новые reverify/closure owners;
- authoring-DX механизм поглощён более сильным current `SYS-CONTENT-AUTHORING-PUBLICATION-CONTRACT`;
- три queue additions stale/absorbed;
- whole merge удалил бы более новые queue updates;
- +9,330 строк старого raw corpus не импортируются ради формальной сохранности.

Рекомендация — закрыть #482 как superseded без удаления branch. Это требует явной owner authorization; ref retirement остаётся отдельной exact-SHA destructive transaction.

## 5. Workflow/control-plane результат

Подтверждено:

- immutable action pins и YAML preflight;
- read-only default permissions у обычных audits;
- path-scoped expensive checks с fail-closed corpus resolution;
- scheduled/manual complete deep audit;
- ref-retirement как единственный write-capable workflow с exact SHA, current-main, open-PR/archive protection и post-delete proof;
- prospective artifact admission на каждом PR/push validation.

Не подтверждены как дефекты: unpinned actions, implicit write escalation, force path или zero-work success.

Public branch metadata исправляет baseline-неопределённость: `main.protected=true`, enforcement `everyone`, required contexts `validate` и `preflight`. Admin-only protection detail остаётся недоступен integration; force/deletion/admin параметры подтверждены прежним owner closure receipt #373, а не новым readback.

## 6. Документация и порядок

- targeted current-navigation link check не нашёл broken local links;
- broad regex-кандидаты не приняты из-за code/regex false positives;
- текущие authority roles согласованы через registry/DOC_MAP/structure gate;
- dated evidence не переписывается под новые anchors;
- `code-audit` больше не обозначен одновременно intake-only и синтезированным terminal project;
- issue open-state больше не считается автоматически backlog truth по governance contract.

## 7. Оставшиеся current owner decisions

1. `AR-ISSUE-LIFECYCLE-001`: применить подготовленные labels к #489/#485/#484/#437 и решить terminal closure. Рекомендуемые классы: diagnostic / evidence / superseded / superseded.
2. `AR-PR482-DISPOSITION-001`: явно разрешить close PR #482 как superseded, branch не удалять.

Это не скрытые недоделки инженерного аудита: classification, evidence и рекомендуемая disposition уже завершены; остаётся только внешняя административная воля/permission.

## 8. Root causes

1. **Recognized state принимался за reviewed truth.** Исправлено fail-closed ledger и canonical project contract.
2. **Evidence retention не имел admission budget.** Исправлено prospective gate; historical topology сохранено пропорционально риску.
3. **GitHub open-state смешивал semantics.** Policy/labels созданы; применение ограничено integration permission.
4. **Event-driven freshness не имела компактной reconciliation wave.** Выполнена semantic, а не timestamp-based сверка внешних owners.
5. **Исторический intake мог оставаться открытым как будто это merge queue.** PR #482 теперь имеет content-level terminal recommendation.

## 9. Не сделано намеренно

- не закрыты issues или PR #482;
- не удалены remote refs;
- не изменены Product repositories;
- не переписана Git history и не заявлено уменьшение pack size от удаления ZIP;
- не удалены raw evidence packages только ради косметического уменьшения дерева;
- не сделаны выводы о закрытых admin-only branch-protection полях без доступного readback.

Аудит считается полным при сохранении этих двух owner decisions в MASTER. После owner action обе строки должны уйти в той же административной closure wave.
