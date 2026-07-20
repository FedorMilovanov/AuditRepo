# Intake Report — GBS Book Engine & HTML Prototypes Research (2026-07-15)

## Identity
- **Agent:** Arena Agent / Book Engine Research Unit
- **Date:** 2026-07-15
- **Project:** gb-is-my-strength
- **Source commit:** e9faea5b
- **AuditRepo commit:** 182af122

## Executive Summary
Данный интейк представляет собой полный исследовательский пакет по трёхуровневой архитектуре движков `gb-is-my-strength` (GBS) и внедрению книжного режима (Book Engine — `series.shape = 'book'`), распакованный из архива `ZIP GBS.zip`.
Пакет включает два набора данных:
1. `research-package/` — детальные аудиты (`ENGINE_DOCUMENTATION_AUDIT.md`, `ENGINE_PLATFORM_INTEGRATION.md`, `REFERENCE_TRACEABILITY.md`, `RISK_REGISTER.md`, `SVG_STATE_ANIMATION_MANIFEST.md`, `VALIDATION_STATUS.md`), контракты TypeScript и эталонный прототип `book-engine-reference-prototype.html`.
2. `prototypes/` — HTML-прототипы для всех режимов (`series-book.html`, `series-flat.html`, `article-reader.html`, `page-engine.html`).

## Findings Matrix

| ID | Severity | Title | Root cause | Status |
|---|---|---|---|---|
| BUG-ENG-01 | P1 | Astro Check failure on `SeriesMark.kind` | `SeriesMark.astro` принимает только `label \| roman \| letter`, но книжный режим вводит `arabic` для статей внутри глав (`parent: chapterId`). | Intake ready |
| BUG-ENG-02 | P1 | Editorial Registry structure mismatch | 18 новых маршрутов серии «Сердце» отсутствуют в `editorial-metadata-registry.json`. | Intake ready |
| BUG-ENG-03 | P2 | Documentation drift in `SERIES-ENGINE-GUIDE.md` | Документация описывает только 3 яруса (`roman/label/letter`) и не учитывает `tier:'chapter'` / `mark.kind:'arabic'`. | Intake ready |

### BUG-ENG-01: SeriesMark type constraint blocking ASTRO check
- **Severity:** P1
- **Root cause:** `src/components/article-pilots/gill-series/SeriesMark.astro` имеет жёстко заданный тип пропсов: `'label' | 'roman' | 'letter'`, в то время как конфигурация книжного режима (`hardTextsSeriesConfig.ts`) использует `arabic` для самостоятельных статей главы.
- **Evidence:** При запуске `astro check` на срезе `e9faea5b` возникают 3 ошибки типизации в `GillSeriesOverlay.astro` и `GillSeriesRail.astro`.
- **Proposed Fix:** Расширить тип `SeriesMark` в Astro-компонентах и добавить стилизацию для арабской нумерации статей внутри главы.

### BUG-ENG-02: Missing editorial metadata for 18 Heart book articles
- **Severity:** P1
- **Root cause:** При добавлении новых статей серии «Сердце» не был пересобран `editorial-metadata-registry.json`.
- **Evidence:** `node scripts/editorial-metadata-registry.js --check` выдаёт 18 отсутствующих записей (например, `skrytye-idoly`, `religioznoe`, `sovest`, и др.).
- **Proposed Fix:** Выполнить `node scripts/editorial-metadata-registry.js --write` и зафиксировать обновлённый реестр.

### BUG-ENG-03: Series Engine Guide outdated
- **Severity:** P2
- **Root cause:** Документ `docs/SERIES-ENGINE-GUIDE.md` в source репо и `ENGINES_ARCHITECTURE.md` в AuditRepo не описывают новую трёхуровневую модель (`chapter` + `arabic` + `label`).
- **Proposed Fix:** Обновить архитектурную документацию в соответствии с `ENGINE_PLATFORM_INTEGRATION.md`.

## Structure Distribution
Файлы распределены следующим образом:
- `incoming/gbs-book-engine-research/2026-07-15/research-package/` — спецификации, TS-контракты, реестр рисков и документационный аудит.
- `incoming/gbs-book-engine-research/2026-07-15/prototypes/` — HTML/CSS/JS прототипы.
- `working/gbs-book-engine-prototype-2026-07-15/` — рабочая зона с финальным отполированным прототипом книги и спецификацией по внедрению в репозиторий `gb-is-my-strength`.
