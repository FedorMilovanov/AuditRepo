# Broad wave 34 — resulting head c9ae14e: homepage promotion и красный scripture index

Дата: 2026-10-29  
Product PR: #2217, exact head `c9ae14e3dfab39b9c7db23eeeda76ae7a3c97d59`  
Предыдущий проверенный head: `36066273b6e06f0c156a31531cf551ebfce98bf5`

## Изменение scope

После завершения wave 33 Product owner продвинул PR новым коммитом `feat(home): feature «Отступники» series and Евреям 6 mega on homepage`. Diff ограничен двумя файлами и 91 добавленной строкой:

- `HomeSections/Publications.astro` — featured-card серии `/otstupniki/` и отдельная evergreen-card большого разбора Евреям 6;
- `HomeSections/Refutations.astro` — вторая карточка того же большого разбора в разделе опровержений.

Product не изменялся этим аудитом.

## Два красных CI — один точный root cause

На exact head одновременно красны:

1. `Exact Scripture occurrences before Pagefind`;
2. `Deterministic source index and dist witness`.

Локально canonical source check воспроизводится:

```text
SCRIPTURE OCCURRENCE INDEX FAILED:
data/scripture-search-index.json is stale; run with --write
```

Контролируемый `--write` был выполнен только для диагностики, diff сохранён вне Git, затем файл восстановлен и `git diff --exit-code` снова прошёл. Требуемое обновление:

- references остаются 1368;
- occurrences: **3468 → 3474**;
- добавляются ровно **6** homepage occurrences `Евреям 6`;
- четыре принадлежат `HomeSections/Publications.astro`, две — `HomeSections/Refutations.astro`;
- route у всех `/`, source kind `astro-source`.

Таким образом, это не две независимые поломки и не дефект индексации: автор добавил новый индексируемый scripture copy, но не выполнил объявленную write/check transaction. Оба специализированных workflow корректно остановили head. Класс причины — **ошибка агента, пойманная системой**, а не repository/system failure. Новый matrix row не нужен.

При этом ручной `npm run strangler:build:production-like` проходит. Это ожидаемо и полезно локализует admission boundary: generic build сам по себе stale generated index не обнаруживает, но обязательные специализированные checks обнаруживают.

## Browser/output контроль новой Home-проекции

Свежая production-like сборка проверена в Chromium:

- desktop 1440×900 Light;
- mobile 390×844 Dark, touch/reduced motion.

Финальный Home содержит:

- одну видимую featured-card `/otstupniki/` в «Исследования, с которых стоит начать»;
- две видимые карточки большого разбора Евреям 6: evergreen в том же исследовательском разделе и debunk-card в «Разбор заблуждений»;
- native clicks всех трёх типов приводят к правильным route/H1 (`/otstupniki/` → «Отступники»; обе mega cards → статья Евреям 6).

Одинаковая mega-статья представлена дважды намеренно в двух редакционных контекстах. Это дублирование source copy повышает стоимость синхронизации, но сейчас title/author/time/target согласованы; без реального drift или owner-policy запрета оно не выдано за отдельный дефект.

Health controls:

- Axe: 0 в desktop/mobile;
- broken loaded images: 0;
- attributable console errors: 0;
- page errors: 0;
- CLS: desktop 0.03958, mobile 0;
- local warm LCP: 240/144 ms, без production claim;
- featured card screenshot сохранён вне Git для обоих профилей.

## Вывод и disposition

Wave 34 не меняет арифметику matrix. Красный exact head нельзя считать merge-ready, но root уже защищён действующими gates и не требует новой системной защиты. Правильное действие владельца — выполнить canonical index write, проверить минимальный generated diff и дождаться полностью зелёного нового exact head. Аудиту не следует параллельно коммитить Product fix в чужой active lane.
