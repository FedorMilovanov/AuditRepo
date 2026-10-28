# LBCF punctuation spacing: resulting-main reconciliation — 2026-10-28

## 1. Якорь и owner boundary

Проверен неизменённый Product main `cdf994b104d7b5eaeef407bf60e341e436efe1df` на canonical production-like build из 108 документов. Появившийся Product #2208 меняет только `audit/BRANCH-CLEANUP-ADDENDUM-2026-10-28.md`, поэтому не владеет MDX, final reader text или content checks этой lane. Product не изменялся.

Цель волны — проверить current status `GBS-LBCF-REFERENCE-PUNCTUATION-SPACING` и наличие обещанной source-level защиты. Машинное свидетельство: `evidence/2026-10-28-lbcf-punctuation-resulting-main.jsonl`; полные outputs и 16 PNG оставлены вне Git в `/tmp/wave10`.

## 2. Source и final output

В четырёх MDX owners по-прежнему находятся восемь pre-punctuation spaces:

- `Conscience ;` — четыре раза;
- `The Church .` — три раза;
- `redeeming-power ;` — один раз.

Production-like `body.innerText` сохраняет каждую из восьми exact sequences ровно один раз на своём route. Каждая находится в видимом `<li>` с ненулевой геометрией и без `hidden`/`aria-hidden`. Разделение ссылки и следующего знака по соседним text/element nodes не устраняет пробел в rendered text; это не ошибка простого source grep и не generated-only артефакт.

## 3. Browser matrix

Проверены четыре routes × desktop 1280×900 / mobile 390×844 × Light/Dark, DPR2, reduced motion: **16 production-like profiles / 32 occurrence-profile witnesses**. Во всех профилях exact sequences присутствуют и painted; сохранён screenshot соответствующего списка источников.

Во всех 16 profiles: broken loaded images 0, horizontal overflow 0, page errors 0, console errors 0. Light desktop/mobile и Dark mobile дают Axe 0. Dark desktop повторяет по два уже известных contrast nodes (`.mobile-btoc-section__label`, `#gbs2MobSec`) и reconciled с `GBS-TEXT-CONTRAST-RESIDUAL-BATCH`; новый row не создаётся.

LCP/CLS записаны только как health control. Программный переход к нижней библиографии входит в observer window, поэтому высокие mobile CLS не приписываются punctuation без causal trace и не дублируют reader-capacity owner.

## 4. Защита отсутствует

`article-qa`, `readable-audit` и `editorial-lint` проходят на текущем main. Поиск по `scripts`, `tests` и `.github` не находит ни known exact fixtures, ни общего source rule для whitespace перед `,.;:!?` после Markdown link/inline boundary.

Closure остаётся узким: исправить восемь authored occurrences и добавить source-level check с negative fixtures и source→final parity. Нельзя применять глобальную замену whitespace вокруг ссылок или править generated HTML: обычный межсловный пробел после ссылки должен сохраняться.

## 5. Disposition

1. `GBS-LBCF-REFERENCE-PUNCTUATION-SPACING` остаётся `OPEN-CURRENT`: 8/8 source и 32/32 occurrence-profile browser witnesses подтверждены.
2. Product #2208 docs-only и не является owner.
3. Отдельный системный row не нужен; narrow content guard входит в closure существующего row.
4. Новых work units нет. Арифметика остаётся **45 direct + 8 improvements + 1 residual + 22 systems = 76**.
