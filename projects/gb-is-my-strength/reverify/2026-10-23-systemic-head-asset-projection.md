# Системная проверка: проекция общих `<head>`-ресурсов и ревизий

Дата: 2026-10-23  
Product anchor: `caeb92c839ff4b4f2838a0ad44a582034c41c8d4` (`main`, merge PR #2184)  
AuditRepo base: `a10afa2cfa2d5add23bfffcbcaaf8cf82f160eb5`  
Режим: read-only аудит Product; Product-файлы не изменялись

## Итог

`GBS-HEAD-ASSETS-PINNED-TO-PRODUCTION` — не изолированный набор неверных URL. Он является одним проявлением более общего текущего механизма: Astro-страницы вручную несут общие `<head>`-ресурсы и их content hashes, хотя в репозитории уже существует центральный `assetUrl()`/`ASSET_VERSIONS`.

В MASTER прямой симптом поглощён системной lane `SYS-HEAD-ASSET-PROJECTION-PROLIFERATION`. Число work units не меняется: один прямой дефект заменён одним системным владельцем.

## Свежие свидетели

### 1. Центральный владелец существует, но не владеет большинством Astro-проекций

Текущий `src/lib/asset-version.js` объявляет `ASSET_VERSIONS` для 32 ресурсов и `assetUrl(path)`. Комментарий файла утверждает, что helper заменяет hardcoded `?v=...` в `36+ Astro PageHead components`.

Фактический census `src/**/*.astro` на anchor:

- 576 Astro-файлов;
- 81 файл всё ещё содержит hardcoded revision literals в статических `href`/`src`;
- 496 таких ссылок;
- только 19 Astro-файлов вызывают `assetUrl()`;
- 68 вызовов `assetUrl()`.

То есть helper не является общей проекцией: `scripts/cache-bust.js` по-прежнему переписывает source-файлы через `rewriteAstro()`.

### 2. Один общий CSS/runtime batch создаёт десятки source-only изменений

Для merged Product PR #2184 сравнен точный диапазон:

- base `c18cd9621d5d72dd6505bb3b4993533bafa1812c`;
- resulting main `caeb92c839ff4b4f2838a0ad44a582034c41c8d4`;
- 90 изменённых файлов, 864 changed lines по `git diff --numstat`.

Каждая пара файлов была сравнена после единственной нормализации `?v=<hex>` → `?v=<HASH>`. Результат:

- **71 из 90 файлов** (78.9%) отличаются только hash-литералами;
- это **284 из 864 changed lines** (32.9%);
- substantive diff остаётся в 19 файлах;
- revision-only fan-out затронул 404, `sw.js` и 68+ Astro component owners, главным образом многочисленные `*PageHead.astro`.

Это не оценка по имени файла: normalized byte comparison доказывает, что 71 файл не содержит другого изменения.

PR #2184 полезен как lifecycle witness, а не как обвинение конкретного repair: системные a11y/CSS изменения были узкими, но текущий revision writer размножил их по 71 source carrier.

### 3. Один `<head>`-owner уже проявляет отдельный runtime-дефект

Текущая строка `GBS-HEAD-ASSETS-PINNED-TO-PRODUCTION` ранее доказала:

- 69 component files pin `https://gospod-bog.ru/...` для icons/apple-touch/manifest/feed;
- на non-production origin ссылки уходят в production;
- 46 из 108 страниц имеют CSP `img-src`, не разрешающий этот host;
- локальный production-like build дал пять CSP icon refusals на страницу в измеренном классе.

Hardcoded origin и hardcoded revision — два разных пользовательских/операционных проявления одного source owner: общая head-resource projection вручную скопирована в route-family components.

### 4. Дублирование шире одного PR

Site-wide census source-файлов (`.astro/.html/.js/.mjs`, без build output) нашёл:

- 1,204 versioned `href`/`src` references;
- 119 уникальных комбинаций path+hash/prefix;
- 131 source carrier files.

Разные hashes одного логического ресурса одновременно встречаются из-за активных и retained legacy/reference источников. Поэтому число 1,204 не используется как требование «заменить всё одним regex». Closure ограничен authority-aware Astro projection; immutable reference snapshots и independent built apps нельзя массово переписывать.

## Текущая защита: что она доказывает и чего не доказывает

`scripts/cache-bust.js` полезно и fail-closed:

- вычисляет текущие hashes;
- проверяет/переписывает HTML/Astro literals;
- исключает declared reference-only snapshots и built-app artifacts;
- проверяет source-kind corpus и stale literals;
- обновляет `src/lib/asset-version.js`.

Но защита валидирует согласованность **размноженных значений**, а не инвариант «у общей ревизии один source owner». В write mode она сама создаёт большой source diff. Green check поэтому не означает отсутствие projection proliferation.

Это не false-green в смысле неверного результата cache-bust: checker корректно обнаруживает drift. Это лишняя сложность и слабый архитектурный инвариант: исправляется симптом stale hash, сохраняется причина fan-out.

## Необходимая граница исправления

Нужен один bounded owner для общих Astro head resources:

1. Astro source не хранит hash literals для governed assets; URL получает ревизию через `assetUrl()`/manifest projection или эквивалентный общий component owner.
2. Icons/apple-touch/manifest/feed проецируются origin-relative (кроме ресурсов, которым по контракту действительно нужен canonical absolute URL).
3. Route-specific metadata и стили остаются route-specific; не требуется один гигантский universal Head.
4. Reference-only legacy snapshots и independent built apps сохраняют declared authority boundary.
5. При изменении одного governed asset regression control не создаёт десятки route-source edits: меняется central manifest/generated output, а production build выдаёт новую ревизию на всех применимых маршрутах.
6. Non-production-origin browser control загружает свои icon/manifest/feed resources и даёт 0 соответствующих CSP refusals.
7. Class-level guard запрещает новые hardcoded governed `?v=<hash>` и production-pinned common head resources в Astro authority corpus.

Первичная миграция 81 carrier может потребовать механических изменений, но это одноразовая смена владельца. Критерий ценности — последующие shared asset changes больше не изменяют десятки route source files.

## Collision check

На 2026-10-23 просмотрены file lists всех открытых Product PR. Ни один не меняет:

- `scripts/cache-bust.js`;
- `scripts/cache-bust-assets.js`;
- `src/lib/asset-version.js`;
- `src/layouts/BaseLayout.astro`;
- файлы `*PageHead.astro`.

Это только текущий collision witness, не reservation и не разрешение на Product mutation. Перед будущим repair требуется повторная проверка.

## Что не доказано

- Не доказан stale-cache runtime incident на production; systemic admission основан на текущем source fan-out плюс уже подтверждённый preview/CSP-дефект.
- Не заявлено, что все 1,204 literals должны быть удалены: retained legacy authorities имеют другие правила.
- Не заявлено, что каждый PageHead должен быть объединён: только общая asset projection.
- Не измерена browser performance стоимость; performance-дефект не открывается.
- Product mutation, build и live deployment в этой проверке не выполнялись.

## Воспроизводимость подсчёта

```bash
# exact merged range
git diff --numstat c18cd9621d5d72dd6505bb3b4993533bafa1812c..caeb92c839ff4b4f2838a0ad44a582034c41c8d4

# revision-only classification
# Для каждого changed path прочитать обе blobs и сравнить после:
# re.sub(rb'\\?v=[0-9a-fA-F]{8,}', rb'?v=<HASH>', blob)

# current Astro carrier census
# src/**/*.astro: static href/src containing ?v=<8+ hex> versus assetUrl( calls
```

Все числа получены из чистого Product clone `/tmp/gbs-system` на exact anchor; временный clone и raw command output не добавлялись в AuditRepo.
