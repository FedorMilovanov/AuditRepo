# AuditRepo self-audit — wave 1 baseline

**Дата:** 2026-10-29  
**Anchor:** AuditRepo `main@eca8b551ab9cfa62720ab91c462beb577663f156`  
**Signal class:** control-plane / history / repository hygiene / governance  
**Статус:** verified-source + verified-history; GitHub protection state UNPROVEN

## Граница волны

Эта волна создаёт собственный project-scoped SSOT AuditRepo, фиксирует чистый baseline и принимает только корневые текущие work units. Она не закрывает/не мержит PR/issues, не удаляет refs и не меняет Product-репозитории.

## Чистый baseline

До scaffold/edit прошли:

- `check_auditrepo_structure.py`;
- workflow syntax preflight и regression;
- `validate_audit_repo.py` и regression;
- scaffold, ref-retirement и matrix-coverage regression.

Следовательно, принятые control-plane находки — false-green/coverage gaps действующих зелёных gates, а не ранее красный baseline.

## Проверенные факты

### Tree и история

- 1,903 commits; 2,689 tracked files; Git pack 107.32 MiB; unreachable objects не найдены.
- После полного fetch обнаружены 14 remote refs без symbolic `origin/HEAD`: `main`, один open-PR head и 12 intentional `archive/*` recovery refs.
- Точный census tracked artifacts: 222 PNG, 12 WebP, 3 ZIP и 1 PATCH. Самый заметный архив — `projects/gb-is-my-strength/ZIP GBS.zip` (7.4 MiB); это также единственный tracked path с пробелом.
- Content hash census файлов ≥1 KiB нашёл 28 duplicate groups. Основные классы — screenshots, prototype assets/fonts и повторённые research packages.
- `projects/gb-is-my-strength` доминирует: 2,272 tracked files и около 116.5 MB.

### PR/ref forensic

GitHub REST inventory: **479 PR = 409 merged + 69 closed-unmerged + 1 open**.

Production forensic script запущен с `gh api` transport adapter из-за sandbox-only ошибки Node `fetch`; результат strict green:

- 0 inaccessible closed heads;
- 0 unexplained refs;
- 0 manual candidates;
- 66 paths, добавленных closed-unmerged PR, сейчас отсутствуют в `main`.

Но permanent ledger содержит только **44/69** closed-unmerged PR. Оставшиеся 25 считаются resolved по regex над self-authored title/body/comments (`superseded`, `diagnostic` и т. п.). Код начисляет review priority только для `unclassified`/`parked`; поэтому эвристический `superseded` с отсутствующими путями не может сделать strict красным. Это подтверждает `AR-HISTORY-STRICT-001`, а не потерю всех 66 путей: каждый head доступен, content-level disposition ещё предстоит.

Единственный открытый PR #482:

- exact head `539d7b81ccb19b5f5267f4455bd6c25871ad177f`;
- 168 commits behind / 12 commits ahead относительно текущего main;
- 33 changed files, +9,330 lines;
- body прямо задаёт intake-only границу «PR не мержить»;
- branch не имеет отдельного archive ref, содержимое не находится в main.

Поэтому требуется preservation/disposition, но автоматический merge или close был бы неправильным.

### Issues

Inventory: **22 issues = 4 open + 18 closed; 21/22 без labels**.

- #489: title/body `probe`, без контекста;
- #484: evidence receipt с «post-merge QA pending»;
- #485: более поздний receipt, явно supersedes pending-параграф #484 и фиксирует complete;
- #437: bounded closure request, оставшийся open.

Это не четыре независимые текущие проблемы, а смешение probe, evidence archive и task semantics в одном open-state.

### Projects и authority

- Новый `projects/auditrepo/` зарегистрирован как собственный active project; MASTER становится единственным current-work owner self-audit.
- Matrix coverage отдельно прошёл для всех семи project folders.
- `code-audit` проходит structure gate, хотя имеет MASTER без `DOC_MAP.md`/`WORK_QUEUE.md`, а registry называет его `intake-only`; validator не различает канонический и явно legacy профиль.
- Current source heads проверены для пяти внешних repos. Само движение HEAD не открывает дефект, но Milovi Cake, Milovi School и The Legendary Poet имеют релевантные транзакции после записанных anchors; нужна bounded semantic currency check.

## Ограничения и отрицательные результаты

- Targeted active-navigation check не нашёл сломанных локальных ссылок. Broad Markdown regex дал 33 кандидата, но включал code/regex false positives и не принят как finding.
- GitHub rulesets REST вернул пустой список. Branch protection REST и GraphQL вернули `403 Resource not accessible by integration`; поэтому protection state **неизвестен**, а не «отсутствует».
- Никакой ref не удалён, issue/PR не закрыт, remote branch не изменён.

## Принятые текущие корни

См. [`../../verified/MASTER_BUG_MATRIX.md`](../../verified/MASTER_BUG_MATRIX.md): 6 work units — 2 direct defects, 2 necessary improvements, 1 bounded verification lane и 1 owner decision.

## Следующая волна

Сделать fail-closed forensic contract и regression, затем content-level reconciliation 25 ledger gaps. Отдельно выработать минимальную artifact admission policy и проверить её на текущем corpus без массового переписывания raw evidence.
