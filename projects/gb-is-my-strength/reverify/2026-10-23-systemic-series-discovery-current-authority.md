# Системная проверка: current authority серии и discovery projections

Дата: 2026-10-23  
Product anchor: `caeb92c839ff4b4f2838a0ad44a582034c41c8d4`  
AuditRepo input: `faec3f0b2dfa8d5927bcb07bc19fe4ff76d9d799`  
Режим: read-only causal consolidation; Product не изменялся

## Итог

`GBS-PASTOR-SERIES-DISCOVERY-DRIFT` и `GBS-WAVE12-CONTRACT-FROZEN-AT-BOUNDARY` — data symptom и guard symptom одного владельца: current published membership серии не имеет единой authority/projection, а единственный multi-surface contract запускается только против frozen release boundary.

Обе строки поглощены system lane `SYS-SERIES-DISCOVERY-CURRENT-AUTHORITY`.

## Текущие ручные проекции

На Product `caeb92c` серия «Тёмная сторона кафедры» представлена независимо:

- visible hub: 10 опубликованных cards;
- `data/series.json`: 9 numbered core parts;
- JSON-LD `CreativeWorkSeries`: `numberOfItems: 9`, `hasPart` 9;
- `feed-pastor-series.xml`: 2 `<item>`;
- `sitemap-pastor-series.xml`: 3 `<loc>` (hub + 2 materials).

`diotrefy-nashego-vremeni` видим на hub как «Досье A», но отсутствует из `data/series.json` и `hasPart`; JSON-LD упоминает его отдельно как `subjectOf`. Это доказывает, что роль companion material уже существует концептуально, но не представлена единым typed membership record, из которого выводятся hub/feed/sitemap/schema.

System repair не обязан превращать «Досье A» в numbered part. Он обязан хранить роль (`core`, `companion` или эквивалент) один раз и явно задавать projection policy для каждой discovery surface.

## Почему green guards не защищают current truth

`.github/workflows/diotrophes-wave12-release.yml` имеет широкие current path triggers, включая:

- `data/series.json`;
- `src/components/pastor-series/**`;
- `feed-pastor-series.xml`;
- `sitemap-pastor-series.xml`;
- relevant normalizers/contracts.

Но multi-surface release validator запускается так:

- historical validator извлекается из `aaf0ba7f…`;
- detached worktree создаётся на release boundary `fbd305a5…`;
- validator выполняется внутри этого historical worktree.

Поэтому его assertions доказывают неизменность исторического Wave 12 transaction, но физически не могут увидеть последующий current hub/data/feed/schema drift.

Current working-tree copy контракта ранее завершалась exit 1 на current source (`series landing Part II missing`, `series structured data drift`), тогда как workflow был зелёным. Это не делает historical check бесполезным; он проверяет другой инвариант.

## Общий causal owner

Два проявления образуют один замкнутый механизм:

1. membership вручную меняется в одной projection (hub);
2. остальные projection owners не получают transaction update;
3. guard с названиями feed/sitemap/numberOfItems проверяет frozen snapshot;
4. current CI остаётся green на реально разошедшихся surfaces.

Route-local синхронизация четырёх файлов закроет текущий diff, но оставит механизм повторяемым. Нужны typed membership authority, projections и current-head guard.

## Bounded closure

1. Один current series membership owner хранит все 10 опубликованных materials и их роли; numbered core и companion не смешиваются неявно.
2. Hub, `data/series.json`/runtime config, JSON-LD, series feed и series sitemap выводятся из owner либо проверяются против него.
3. Projection policy явно отвечает, входят ли companions в `hasPart`, `subjectOf`, feed и sitemap; visible published material нельзя случайно потерять из discovery.
4. Current-head guard падает при удалении/добавлении одного member только на одной surface.
5. Historical Wave 12 boundary witness сохраняется отдельно и продолжает доказывать release history.
6. Main `feed.xml`/`sitemap.xml` controls сохраняют полное текущее покрытие; series shards не подменяют primary discovery surfaces.
7. Generated output либо read-only check не создаёт неограниченный source writer; validation не мутирует tracked files.

## Почему это не blanket generator request

Система уже имеет разные семантические роли: nine-part canonical core и unnumbered documentary dossier. Поэтому простой regex/card scraper был бы новым хрупким владельцем.

Необходимый универсальный элемент — typed publication membership и declared projection rules. Route-specific title, description, artwork и card presentation могут оставаться локальными.

## Collision check

Ни один открытый Product PR не меняет series source/data/feed/sitemap owners. PR #2179 меняет только action pin в `.github/workflows/diotrophes-wave12-release.yml`; это workflow collision для будущей Product mutation, но не current data repair.

Перед repair file-list check повторяется. PR #2179 нельзя переписывать или закрывать без отдельного решения.

## Что не поглощено

- `GBS-SITEMAP-LASTMOD-UNOWNED` остаётся site-wide normalizer applicability defect.
- Primary sitemap/feed корректное покрытие не объявляется сломанным.
- Historical release witness не удаляется и не заменяется current-only check.
- Не доказано, что все серии сайта имеют такой же drift; system lane закрывает demonstrated Pastor-series owner и class-level recurrence guard.
- Content order/title решения не меняются.

## Источники

- `../incoming/arena-full-spectrum-audit/2026-10-14/REPORT.md` §20.1–20.2;
- `../incoming/arena-full-spectrum-audit/2026-10-14/evidence/2026-10-18-series-feeds-sitemap-sepia.json`;
- current Product `data/series.json`;
- current `PastorSeriesCardsSection.astro`, `PastorSeriesPageHead.astro`;
- current `feed-pastor-series.xml`, `sitemap-pastor-series.xml`;
- current `.github/workflows/diotrophes-wave12-release.yml`.
