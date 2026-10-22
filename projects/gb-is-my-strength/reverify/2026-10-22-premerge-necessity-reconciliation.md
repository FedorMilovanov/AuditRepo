# 2026-10-22 — содержательная сверка перед мерджем PR #483

AuditRepo input: чистый `ad77ef12863a9bc702966d628bf855c7bdeead47`, baseline 4/4 PASS. Product `main` повторно прочитан и клонирован read-only: `d14da74cfe9f45e9b03e383e8e622695b01f8e16`, рабочее дерево чистое.

Это пересмотр необходимости работ, а не новый browser/release pass и не исправление Product. Исходные [REPORT §§1–24](../incoming/arena-full-spectrum-audit/2026-10-14/REPORT.md) и все receipts сохранены; нижеследующее явно supersedes спорные формулировки §§18–22.

## Решения

| ID | Disposition / основание |
|---|---|
| `GBS-AVRAAM-RUNTIME-DROPS-H1` | Alias → старший `GBS-AVRAAM-MAP-HEADING-LOST-ON-READY`. Один ready-observer удаляет один и тот же `h1`; более поздние DOM/AX и axe `passForModal` witnesses присоединены к canonical row. Проверять один содержательный h1 в DOM/AX, не требовать новый видимый overlay ради аудита. |
| `GBS-GILL-PART-NUMBERING-SWAP` | Retired → уже существующий optional `GILL-SLUG-NUMBERING-LEGACY` в Work Queue. `scripts/gill-series-data-consistency-audit.js` явно сохраняет ids/slugs и порядок `context,part1,part2,part4,part3,spravochnik`; прямой запуск exit 0. Требование переименовать утверждённые части по цифрам permalink противоречило этому owner contract. |
| `GBS-SERIES-RSS-SHARD-COVERAGE` | Retired → optional подписки по сериям. В прежнем same-SHA receipt все 49/49 опубликованных частей уже находятся в главном feed; найденного обязательства делать отдельный feed каждой серии нет. Stale уже опубликованный pastor feed остаётся реальным отдельным дефектом. |
| `GBS-GILL-SERIES-NO-HUB-NO-ISPARTOF` | Retired → optional schema consistency. У контекста isPartOf есть, у остальных 5 материалов нет; серия обнаруживается в manifest как `dzhon-gill-seriya`. Общий `validateArticle` в `scripts/schema-rich-results-audit.js` требует headline/dates/author/publisher, не isPartOf. Специальный Nagornaya identity contract нельзя автоматически переносить на Gill. Отсутствие optional поля не доказывает необходимую миграцию. |
| `GBS-SERIES-TEXT-GLYPH-CONTROLS` | Retired → optional согласованность UI. Именованные кнопки-команды `BaptistyRossiiBookLanding.astro:68–69,154–158` не обязаны становиться pressed-toggle или SVG; необходимость третьей темы не доказана. Измеренные contrast и `#articleEndPrintBtn` label failures уже находятся у двух canonical owners и не снимаются. |
| `GBS-HOME-OFFER-FROZEN` | Оставлен, сужен. Активный `HomeMain.astro` подключает `HomeSections/Publications.astro`, где строка 85 — **«Новые публикации»**, ниже 5 статических article hrefs. Прежние browser/build данные: на всём `/` 8 статей, самая новая опубликована 2026-07-09; 40 из 51 в библиотеке новее. Ложно было утверждение об отсутствии подписи «новое», а не эти даты. Нужно согласовать обещание новизны с подборкой; обязательные даты на всех карточках, первый экран и SEO-суффиксы каталога из closure исключены. |

Результат: **61 → 56 = 52 дефекта + 2 необходимых улучшения + 2 системные линии**. Это один дубль и четыре optional dispositions, **не пять починенных Product bugs**. Все прочие work units и исторические dispositions остаются без изменения. Registry сохраняет provenance удалённых ID, Work Queue — только добровольные кандидаты, не второй обязательный backlog.

## Где перепроверять исходные наблюдения

Все пути относительно [intake](../incoming/arena-full-spectrum-audit/2026-10-14/):

- Авраам: `evidence/2026-10-17-map-surfaces-and-3d-fallback.json` (`a1a`, `a1b`, `a2a`, `a2b`) и старший [lifecycle reverify](2026-09-29-current-avraam-map-heading-lifecycle.md).
- Home/Gill/glyphs: `evidence/2026-10-17-home-genealogy-mobile-icons.json` (`a2`, `a3`, `a3b`, `a4`, `c2`, `c3`, `c5` families); исправлен неверный JSON basename в активной Home row.
- Feeds: `evidence/2026-10-18-series-feeds-sitemap-sepia.json` (`s9-series-feed-coverage`); Gill discovery/schema correction: `evidence/2026-10-18-genealogy-relations-recheck.json`.

Отсутствие найденного обязательства не означает, что все контракты/поведение здоровы. Повторное повышение optional пункта требует нового доказательства необходимости, а не повторения прежнего списка пожеланий.

## Безопасность воспроизведения

В собственном `harness/rebuild-env.sh` убрано безусловное `rm -rf` существующего негитового Product каталога. Теперь это явный exit 11 без перезаписи; `GBS_PRODUCT_DIR` позволяет проверить preflight на изолированном пути. Никаких зависимостей или Product файлов эта правка не обновляет. Полный browser bootstrap/build в этой source-only сверке не запускается.

## Проверено после правок

- 4 основных AuditRepo гейта и 5 regression-команд CI — PASS; coverage: 56 active / 0 closed / 0 historical-only, registry 58 (1 alias / 43 retired / 9 informational / 5 false-positive).
- Канонический `parse_matrix` подтверждает ровно 5 удалённых и 2 изменённых active rows, остальные 54 побайтово прежние; исторические closure tables не считаются активными и сохранены целиком. Все прежние 53 registry entries неизменны.
- REPORT и 61 evidence-файл побайтово равны input `ad77ef1`; все 46 JSON, включая streams, по значениям равны `215b7ca`. Синтаксис 26 `.mjs` и shell script — PASS.
- Реальный полный bootstrap на существующем non-Git каталоге завершается exit 11, sentinel и состав каталога сохранены. Позитивный запуск именно preflight на существующем Product clone печатает `CLONE_OK`; остановлен до npm/build. Product HEAD/дерево неизменны. Полный rebuild не заявляется проверенным.
