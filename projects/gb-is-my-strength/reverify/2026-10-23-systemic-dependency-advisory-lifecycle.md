# Системная проверка: dependency advisory and update lifecycle

Дата: 2026-10-23  
Product anchor: `caeb92c839ff4b4f2838a0ad44a582034c41c8d4`  
AuditRepo input: `945e52fae705b4ae1d364e88c91be6153c27dc54`  
Режим: read-only current-state reverify и causal consolidation; Product не изменялся

## Итог

Две direct строки описывают detect и remediate стороны одного незамкнутого dependency lifecycle:

- `GBS-DEPENDENCY-GATE-BLIND-ON-UNCHANGED-HEAD`;
- `GBS-DEPENDENCY-LAG-AND-STUCK-UPDATE-PRS`.

Они поглощены system lane `SYS-DEPENDENCY-ADVISORY-LIFECYCLE`.

Предыдущая конкретика устарела: npm PR #2144 больше не открыт, а advisory count вырос с 7 до 9. Root остаётся текущим и стал сильнее: unchanged main не переоценивается по расписанию, а update queue не доводит обнаруженные исправления до landed/accepted terminal state.

## Fresh current state

### Advisory drift

На clean Product `caeb92c` выполнено:

```bash
npm audit --package-lock-only --json
node scripts/npm-security-contract.mjs <fresh-report>
npm audit --package-lock-only --omit=dev --json
```

Результат полного lockfile audit:

- total 9;
- high 6;
- moderate 3;
- critical 0;
- production (`--omit=dev`) 0;
- strict Product contract: `FAIL (9 moderate/high/critical vulnerabilities)`.

Current affected package keys:

- direct: `astro`;
- transitive: `devalue`, `fast-uri`, `http-cache-semantics`, `sharp`, `smol-toml`, `source-map-js`, `undici`, `vite`.

Все отражены как fix-available в свежем npm report; это не доказательство безопасного автоматического merge, но доказывает наличие upgrade/remediation path.

### Detection applicability

`.github/workflows/dependency-security.yml` запускается только на:

- PR/push changes четырёх dependency/security files;
- manual `workflow_dispatch`.

`schedule` отсутствует. Поэтому новый advisory не создаёт run на неизменившемся lockfile. Последний green run на старом advisory feed не является текущим security result.

### Update queue current state

PR #2144 (`npm-non-major`, открыт 2026-09-28) был закрыт 2026-10-23 без merge как stale/red и мешавший merge-фазе #2184. Owner comment сохраняет точный disposition и подтверждает, что grouped versions могут быть пересозданы Dependabot.

Это корректирует прежнюю строку: #2144 уже не «open for 19 days». Но packages в Product не обновлены, свежий audit теперь содержит 9 vulnerabilities, а replacement npm update PR ещё не открыт.

PR #2179 (GitHub Actions group) остаётся:

- OPEN;
- non-draft;
- `BEHIND`;
- head `cef5bdb…`;
- множество failed required checks;
- меняет 77 workflow files, включая dependency-security и затронутые в этом AuditRepo PR workflows.

#2179 не исправляет npm advisories, но подтверждает общий queue behavior: bot создаёт broad grouped update, который остаётся неготовым к landing.

## Общий механизм

Lifecycle сейчас разорван между четырьмя независимыми стадиями:

1. external advisory feed изменяется;
2. change-triggered gate не запускается;
3. weekly Dependabot создаёт broad grouped PR;
4. красный/stale PR закрывается или остаётся behind без обязательного terminal remediation/acceptance record.

Detection row и lag row нельзя независимо закрыть надёжно:

- schedule без remediation создаст постоянный красный шум;
- обновление одного PR без schedule снова оставит будущий advisory невидимым;
- Dependabot PR без bounded grouping/triage снова может застрять на широком CI graph.

## Bounded closure

1. Advisory evaluation выполняется периодически на unchanged `main` и вручную; новый advisory способен сделать run красным без source change.
2. Отчёт явно разделяет production и dev/build exposure; production 0 не скрывает dev tooling risk.
3. Current 9 достигают terminal state: fixed либо dated owner acceptance с package/advisory/reason/expiry.
4. Update PR grouping ограничивает blast radius: security-fixable npm set не обязан ждать unrelated semver-major или 77-file Actions batch.
5. Каждый bot PR получает terminal disposition: green+landed либо закрыт с сохраняемым reason и replacement/acceptance owner.
6. Negative fixture доказывает scheduled/manual report enforcement; отсутствующий/невалидный audit artifact не проходит как green.
7. Main/PR required checks остаются применимыми к exact candidate; remediation не достигается ослаблением contract или игнорированием dev advisories без решения.

## Почему это не запрос «обновить всё до latest»

Semver-major gaps требуют отдельной compatibility работы и не являются автоматически security defects. System owner должен отделять:

- advisory remediation;
- safe non-major maintenance;
- planned major migrations;
- accepted temporary exceptions.

Closure не требует одномоментного latest для каждого package. Она требует замкнутой detect → classify → repair/accept → verify цепочки.

## Collision boundary

Открытый Product #2179 меняет 77 workflows. В частности он пересекает:

- `dependency-security.yml`;
- TTS workflows;
- editorial metadata workflows;
- Wave 12 workflow.

Поэтому будущая Product workflow mutation сейчас collision-unsafe без координации с #2179. Этот аудит не меняет и не закрывает #2179.

Закрытие #2144 было выполнено ранее другим owner-authorized действием; текущая проверка только читает его terminal state и не присваивает себе это решение.

## Что не доказано

- Dev advisories не объявляются production runtime exposure: `--omit=dev` = 0.
- Failed checks #2179 не диагностированы как package incompatibility; broad stale base и exact logs требуют отдельного разбора.
- Registry latest не пересчитан в этой проверке для всех 14 direct devDependencies; прежняя lag table не переносится как exact current count.
- Автоматический merge не предлагается.
- Product dependency/workflow files не изменялись.

## Источники

- current `.github/workflows/dependency-security.yml`;
- current `.github/dependabot.yml`;
- current `scripts/npm-security-contract.mjs`;
- fresh `/tmp/current-audit.json` и `/tmp/current-audit-prod.json` (вне Git);
- GitHub PR #2144 terminal state/comments;
- GitHub PR #2179 current state/check summary;
- исторические receipts `../incoming/arena-full-spectrum-audit/2026-10-14/evidence/2026-10-17-dependency-security-*`.
