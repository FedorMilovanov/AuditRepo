# Имена Бога — первое независимое build/browser witness (2026-11-07)

## Статус и граница

Тест выполнен на **копиях поздних исходников Arena** (A и B), лежащих в отдельных каталогах `%USERPROFILE%\Downloads\_Arena_Imena_Boga_QA_Atlas` и `_Arena_Imena_Boga_QA_Sozvezdie`. Исходные файлы `originals/` и `reference/` в PR #538 **не изменены**. Это исследовательская проверка reference, а не Product CI, не публикация и не полный тест исправленного пакета v0.3.

Проверка Windows: Node 22.23.1, Google Chrome headless; `npm.cmd ci --no-audit --no-fund --prefer-offline` и `npm.cmd run build` в каждом QA checkout.

## Реальный baseline build

| Вариант | Vite build | Single-file HTML | gzip (Vite output) |
|---|---|---:|---:|
| A — Астролябия, исходный reference | PASS, Vite 7.3.2 | 550.80 kB | 154.24 kB |
| B — Созвездие, исходный reference | PASS, Vite 7.3.2 | 584.92 kB | 172.74 kB |

B original `npm run qa` не выполнен: команда отсутствует в `package.json` (`Missing script: "qa"`). Наличие `scripts/qa.mjs` не равно успешному выполнению. Browser smoke ниже запускался отдельной проверкой, не `npm run qa`.

## Chromium document geometry

Standalone `dist/index.html` открывались локально через `file://`, без изменения браузера владельца. На каждом viewport фиксировались `clientWidth`, `scrollWidth`, количество текстового контента, JavaScript `pageerror`. В тестовой копии A устранены две найденные причины mobile overflow (см. ниже) и выполнен повторный build.

| Вариант после targeted A fix | 320×844 | 390×844 | 412×844 | 768×900 | 1440×900 |
|---|---|---|---|---|---|
| A (отдельная QA-копия, не reference) | 320=320 | 390=390 | 412=412 | 768=768 | 1440=1440 |
| B reference (без изменений) | 320=320 | 390=390 | 412=412 | 768=768 | 1440=1440 |

Во всех десяти повторных прогонах JavaScript `pageerror`: **0**. Это **не** проверка контраста, реальных кликов, фокус-ловушки, TTS, доступности, лицензионности фото или финальных Product-маршрутов.

## Найденный и подтверждённый UI-дефект оригинала A

Первый запуск A при 390×844: `documentElement.scrollWidth=438px` при `clientWidth=390px` — 48px горизонтального переполнения. DOM-диагностика выявила:
1. В `DivineConstellationExplorer.tsx` длинный греческий оригинал (например, `τὸ Ἄλφα καὶ τὸ Ὦ · Παντοκράτωρ`) стоял как `shrink-0` flex-child с правым краем до 438px.
2. В `SiteNavbar.tsx` полное название на телефоне конкурировало с правыми кнопками; один контрол выходил до x=416px.

В изолированной QA-копии оригинала:
- у original-script label удалено `shrink-0`, добавлены `min-w-0 max-w-[54%] break-words [overflow-wrap:anywhere]`;
- в navbar в ширинах ниже 440px скрыты декоративные длинные части названия, но сохранён полный доступный `aria-label`.

`npm run build` после двух точечных правок: PASS, HTML 552.49kB, gzip 154.53kB. Повторные browser geometry прогоны 320/390/412/768/1440: root width==viewport, pageerror 0.

**Исправление также перенесено в самостоятельный кандидат v0.3**, где дополнены `lang`/`dir` оригинальных написаний. Однако **весь кандидат v0.3 НЕ проходил здесь build/browser test**; нельзя переносить эти успешные результаты на другой SHA.

## Что осталось до Product

- Настоящий typecheck и полный browser interaction suite (desktop/mobile/focus/modal/hash/TTS/reduced motion), лицензионная проверка изображения Синая и шрифтов.
- Полная редакционная верификация 36 + 29 записей и corpus/Strong's.
- Адаптация только к текущим Astro, React islands, маршрутам, design tokens и существующим shared reader/search controls `gb-is-my-strength`, не замена Product SPA.
- Не заявлять live/production readiness до Product exact-head checks + deploy witness.

Искусственные screenshots от headless smoke сохранены локально в `%USERPROFILE%\Downloads\imena-original-<atlas|sozvezdie>-<width>.png`; визуальное принятие владельцем пока не проводилось.
