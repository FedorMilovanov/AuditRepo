# PR #2217: resulting-head closure глоссария — широкая волна 29

**Дата:** 2026-10-29  
**Product base:** `54877be73a590b1e29f4d701724b39ed41c17e14`  
**Предыдущий head:** `918814db39d6bdfd4872fe235c3b1a47a20d0848`  
**Проверенный resulting head:** `36066273b6e06f0c156a31531cf551ebfce98bf5`  
**Граница:** detached read-only checkout; Product-файлы, PR comments и owner branch не изменялись.

## Изменение

Один новый commit `36066273…` изменяет только:

- `data/glossary.json` — добавляет `category` и `categorySlug` семи записям;
- `scripts/glossary-contract-audit.js` — требует непустые category и categorySlug для top-level и поддерживаемого nested-формата.

Категории используют существующую таксономию: четыре записи отнесены к сотериологии, `ожесточение` — к богословию, `церковная дисциплина` — к баптистской традиции, `lapsi` — к истории церкви. Полный словарь имеет 137 записей, 10 labels и 10 slugs; slug→label и label→slug однозначны, невалидных slug нет.

## Source/gate verification

Текущий gate проходит:

```text
Glossary contract passed: 137 terms, 378 aliases, 857 source files.
```

Две контролируемые мутации на временной копии доказали fail-closed поведение:

- удаление `category` у `отступничество` → exit 1 и точная ошибка `has no category`;
- удаление `categorySlug` → exit 1 и точная ошибка `has no categorySlug`.

После каждой мутации исходный файл был восстановлен; tracked diff Product отсутствует. Отдельной постоянной regression fixture для этих двух отрицательных случаев commit не добавляет, но сама проверка исполняется на полном словаре и доказанно падает при обоих нарушениях.

## Production-like build

`npm run strangler:build:production-like` на exact head завершился успешно: 111 Astro pages, 0 Astro errors. Существующие seven hints и известные build warnings не относятся к этому glossary commit. Финальный `dist/data/glossary.json` содержит обновлённую таксономию.

## Browser closure

Chromium 143 запущен через `@sparticuz/chromium` с локальными AL2023 NSS-библиотеками; никаких Product dependencies не добавлялось. Проверены пять статей в desktop Light 1440×900 и mobile Dark 390×844 с native keyboard Enter / touch tap.

Результаты 10 route/profile loads:

- Axe WCAG A/AA violations: 0;
- broken images: 0;
- console errors: 0;
- page errors: 0;
- все восемь route/profile случаев, где новый термин присутствует, открыли tooltip нативно;
- Part V не содержит триггеров этих семи терминов, поэтому два его профиля являются корректным zero-trigger control;
- LCP 152–1 488 ms, CLS 0–0.046555.

Полный runtime crawl всех 112 `dist/**/index.html` повторил прежний fan-out:

| Термин | Экземпляры | Неполная taxonomy |
|---|---:|---:|
| `отступничество` | 6 | 0 |
| `стойкость святых` | 3 | 0 |
| `временная вера` | 1 | 0 |
| `ожесточение` | 5 | 0 |
| `средства благодати` | 2 | 0 |
| `церковная дисциплина` | 2 | 0 |
| `lapsi` | 0 | 0 |

Итого: **19 экземпляров на 13 маршрутах, 0 неполных**. Для каждого проверены оба атрибута на `.gterm` и на вложенном `.gtip`. Desktop и mobile screenshots визуально подтверждают читаемый открытый tooltip; бинарные файлы остались вне Git.

Локальный server при остановке записал `BrokenPipeError` от прерванных браузером передач и ожидаемые 404 локального Pagefind. Это teardown/local-server noise, не Product defect; browser console/page-error census остаётся нулевым.

## Disposition

Наблюдение волны 27 **закрыто на resulting PR head**, но ещё не на Product main: PR остаётся внешним и неслитым. Исправление удачно системное — не только заполняет семь строк, но и делает повторение класса красным через общий contract gate.

Оставшиеся наблюдения волн 25–26 не затронуты этим двухфайловым commit:

- reader-facing языковые гибриды остаются;
- production-like HTML по-прежнему содержит 0 `.gbs2-next` и 0 `.gbs2-next-card` во всех пяти частях.

Matrix arithmetic не меняется: unmerged PR observation не был отдельной current-main строкой.

**Широкая волна 29 завершена.**
