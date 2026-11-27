# R2 — протокол локальной проверки

**База обеих сборок:** `FedorMilovanov/gb-is-my-strength@9edef94ece08012223c1364bec7ddcd561cf5713`. Исходники получены из архива точного SHA. Сравнение: нетронутая копия и локальная копия после применения текста двух патчей. Один режим и один технический момент сборки: Node `22.23.4`, npm `10.9.9`, `CI=true`, `ASTRO_TELEMETRY_DISABLED=1`, `GB_BUILD_INSTANT=2026-11-18T13:24:28Z`. Технический момент не дата публикации или правок.

| Шаг | Результат | Доказательство |
|---|---|---|
| Примерка и откат | PASS: `--check --whitespace=error`, затем реальный apply, `cmp` с кандидатом, реальный reverse и исходные SHA-256 | [replay.txt](replay.txt), [хеши базы](body-base-sha256.txt), [хеши кандидата](body-candidate-sha256.txt), [хеши патчей](../patches/patch-sha256.txt) |
| Сравнение исходников | PASS: 3 517 файлов базы без изменений от сборки; в кандидате только 6 ожидаемых файлов, нет новых и удалённых исходников. Сгенерированные каталоги исключены; список исключений в JSON | [scope-check.json](scope-check.json) |
| Сборки | PASS: обе команды `strangler:build:production-like` целиком; 112 страниц Astro, 117 HTML в постобработке, 78/78 approved metadata, проверка drift = 0, G‑1…G‑8 | [база](before-build.txt), [кандидат](build.txt) |
| Строгий серийный аудит | PASS на обеих сборках: 36 маршрутов, 26 предупреждений вне строгих статей «Баптистов России». У всех 10 целевых статей прошли структура, self-canonical, отсутствие legacy byte copy и content floor | [база](before-series-audit.txt), [кандидат](series-audit.txt) |
| Source lint / hygiene / content guard | PASS на кандидате; hygiene: 164 файла; content guard: 43 baseline +3, неблокирующие уведомления по H1 в серии Гилла | [lint](editorial-lint.txt), [hygiene](sources-hygiene.txt), [guard](content-guard.txt) |
| HTML и Chromium | PASS: 33 посещения, неизменная разметка Body пяти контрольных страниц, точечные assertions в шести изменённых Body. Порядок и адреса TOC, заголовки, ID, canonical, `<time>`, подписи и адреса изображений без дрейфа. 0 локальных 4xx и необработанных исключений на кандидате; переполнение страницы 0 px в выборке. Открытие, переход по пункту и закрытие мобильного меню Справочника проверены на обеих сборках | [JSON](rendered-checks.json), [журнал](rendered-checks.txt), [проверяющий скрипт](rendered-check.mjs) |

Для самого пакета в AuditRepo прошли structure, artifact admission, validator, workflow preflight и compact matrix coverage ([журнал](auditrepo-gates.txt)). Проверка пакета не меняет статусы задач.

Приложены текстовые копии журналов этого прогона: удалены терминальная раскраска и префиксы временных каталогов. Это результаты на указанном SHA, а не новая сборка или live-проверка.

## Повторить на одноразовой копии Product

`PACK` — абсолютный путь к этому intake (`…/2026-11-18`). Ниже команды из корня **одноразовой копии Product** на указанном SHA, не из AuditRepo. Оставьте вторую неизменённую копию для `BASE_DIST`. Сборки `BASE_DIST` и `CANDIDATE_DIST` должны использовать один и тот же момент и toolchain.

```bash
(cd "$PACK/patches" && sha256sum -c patch-sha256.txt)
sha256sum -c "$PACK/evidence/body-base-sha256.txt"
patches=("$PACK/patches/chronology-and-voronin.patch" "$PACK/patches/underground-press-and-1971.patch")
git apply --check --whitespace=error "${patches[@]}"
git apply --whitespace=error "${patches[@]}"
sha256sum -c "$PACK/evidence/body-candidate-sha256.txt"

export GB_BUILD_INSTANT=2026-11-18T13:24:28Z CI=true ASTRO_TELEMETRY_DISABLED=1
npm ci --prefer-offline --no-audit --no-fund
npm run strangler:build:production-like
npm run astro:audit:baptisty-series:no-build
npm run editorial:lint -- --sources
npm run sources:hygiene
npm run content:guard
sha256sum -c "$PACK/evidence/body-candidate-sha256.txt"
```

Для обратной примерки на этой одноразовой копии: `git apply --reverse --check "${patches[@]}"`, затем `git apply --reverse "${patches[@]}"` и `sha256sum -c "$PACK/evidence/body-base-sha256.txt"`. Сборка `dist/` при этом не откатывается автоматически. Для переноса в Product после ревью предпочтительна **новая** сверка base/owner, а не применение на неизвестном HEAD.

Для браузерного повтора на Linux: в отдельной временной папке установите `playwright@1.64.1` и `@sparticuz/chromium@153.0.0`, скопируйте туда `rendered-check.mjs` (ESM ищет эти зависимости рядом со скриптом) и запустите:

```bash
node rendered-check.mjs "$CANDIDATE_DIST" "$BASE_DIST" rendered-checks.json
```

Нужны системные библиотеки Chromium (в sandbox использован отдельный каталог NSS с `LD_LIBRARY_PATH`). Сравнение авторской разметки использует полученный HTTP HTML, а не `textContent` после случайного момента гидратации глоссария; фразы и `href` дополнительно читаются локаторами из открытой страницы. Ссылки сравниваются в рамках src/dist; внешние запросы в браузере блокировались. Браузерная проверка не покрывает полный набор устройств, контраст, Pagefind, service worker, deploy/promotion, права на медиа или совпадение локальных артефактов с live.
