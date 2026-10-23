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

## Current owner delta: Product #2185

После исходной фиксации открылся Product PR #2185, head `d0bb0b7052e25dd6fd7cee8af3bea1becacf6ffd`. Он содержит bounded lockfile-only remediation вместе с двумя unrelated salvage-коммитами; `package.json` не меняется.

Независимая проверка exact lockfile из этого head (`npm audit --package-lock-only --json`) подтверждает:

- total 1;
- moderate 1;
- high/critical 0;
- единственный package key — direct `astro` `<=7.3.2`;
- предлагаемое npm исправление — Astro 7.4.1, тогда как Product отдельно фиксирует Astro 7.2.9 и Satteri 0.3.8 compatibility contract.

То есть #2185 действительно убирает 8 из 9 package-level findings на своей exact candidate, но пока не является Product state: PR OPEN/MERGEABLE/UNSTABLE и не merged. `npm-audit` честно остаётся красным на одном moderate advisory; required `guard` и metadata-source check зелёные.

Первый inspected head `d0bb0b705…` имел пять добавленных Markdown lines с trailing whitespace в bundled research receipt; metadata/source-authority jobs останавливались на `git diff --check`, а Atlas/reader projection — на browser install до product assertions. Это были разные причины, не lockfile incompatibility.

Owner затем добавил commit `16d87310b…`, который заменил пять trailing-whitespace lines и перезапустил CI. Поэтому прежний hygiene blocker теперь исторический exact-head факт, а не current #2185 defect. На новом head `npm-audit` всё ещё честно красный на одном moderate Astro advisory; остальная матрица на момент recheck выполнялась.

Главное системное ограничение не закрыто: #2185 не добавляет scheduled reevaluation unchanged `main`, не задаёт dated exception/expiry для остатка Astro и ещё не достиг terminal landed/accepted state. Он является текущим remediation owner для npm lockfile, поэтому параллельная Product dependency mutation collision-unsafe.

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

Открытый Product #2185 владеет `package-lock.json` и exact npm remediation candidate. Не открывать параллельный dependency repair до его terminal disposition или явной координации.

Открытый Product #2179 меняет 77 workflows. В частности он пересекает:

- `dependency-security.yml`;
- TTS workflows;
- editorial metadata workflows;
- Wave 12 workflow.

Поэтому будущая Product workflow mutation сейчас collision-unsafe без координации с #2179. Этот аудит не меняет и не закрывает #2179.

Закрытие #2144 было выполнено ранее другим owner-authorized действием; текущая проверка только читает его terminal state и не присваивает себе это решение.

## Resulting-main refresh — 2026-10-24

Product #2185 reached terminal repository disposition after the original receipt:

- merged 2026-10-23T19:38:34Z;
- exact head `16d87310bd95476c2da1fdce4d61e3f1df8d6aa1`;
- merge `4c7ea615fbeea5acd806326b16227b7712482d09`;
- current Product main after subsequent research-only #2186: `8d93fe4206e579e766727dbe865e0d07cf30d3c5`.

Fresh immutable install and audit on that main now report **1 moderate / 0 high / 0 critical** package-level finding, production audit **0**. The remaining direct package is Astro 7.2.9, advisory `GHSA-98hj-9722-w3j8`; npm offers 7.4.1. Thus the lockfile remediation is landed and the former 9-finding current state is historical.

The system lane remains open, but its current boundary narrows:

1. `.github/workflows/dependency-security.yml` still has only path-filtered PR/push events and manual dispatch, no schedule, so unchanged-main advisory drift remains undetected;
2. the remaining moderate Astro advisory has neither a merged fix nor a dated acceptance with reason and expiry;
3. #2179 still overlaps workflow ownership; there is no longer an open lockfile owner.

This refresh removes #2185 collision language and does not treat its merged red optional checks as proof that the dependency lifecycle is closed. Compact evidence: `evidence/2026-10-24-dependency-lifecycle-resulting-main.jsonl`.

## Что не доказано

- Dev advisories не объявляются production runtime exposure: `--omit=dev` = 0.
- Failed checks #2179 не диагностированы как package incompatibility; broad stale base и exact logs требуют отдельного разбора.
- Browser-install failures первого #2185 head не считаются runtime regression, а исправленные следующим commit пять hygiene failures не считаются dependency incompatibility.
- Merge #2185 доказывает landed lockfile state, но не является владельческим принятием оставшегося Astro advisory и не добавляет scheduled detection.
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
- GitHub PR #2185 exact head/files/check-step summary and `/tmp/pr2185-audit.json` (вне Git);
- resulting-main compact refresh `evidence/2026-10-24-dependency-lifecycle-resulting-main.jsonl`;
- local `git apply --check --whitespace=error-all` over exact #2185 patch;
- исторические receipts `../incoming/arena-full-spectrum-audit/2026-10-14/evidence/2026-10-17-dependency-security-*`.
