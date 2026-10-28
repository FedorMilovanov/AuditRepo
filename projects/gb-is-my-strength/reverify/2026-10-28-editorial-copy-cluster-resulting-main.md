# Editorial copy cluster: resulting-main reconciliation — 2026-10-28

## 1. Якорь и объём большой волны

Проверен неизменённый Product main `cdf994b104d7b5eaeef407bf60e341e436efe1df`; canonical production-like build прошёл и выпустил 108 HTML-документов. Product #2208 docs-only и не пересекается с content/component owners этой волны. Product не изменялся.

Большая волна 2/16–20 одновременно повторно квалифицирует шесть rows:

1. `GBS-GILL-PART1-RUSSIAN-COPY-QUALITY`;
2. `GBS-DIOTROPHES-NUMERAL-AGREEMENT`;
3. `GBS-DIOTROPHES-UNEXPLAINED-FIDEL-JARGON`;
4. `GBS-HERMENEUTIKA-TRANSLATION-AND-COPY-QUALITY`;
5. `GBS-LAWSON-QUOTE-RUSSIAN-CALQUE`;
6. `GBS-SEM-TIPOV-LITERAL-MARKDOWN-PREFIX`.

Машинное свидетельство: `evidence/2026-10-28-editorial-copy-cluster-resulting-main.jsonl`; 20 screenshots и полные browser outputs оставлены вне Git в `/tmp/wave14`.

## 2. Общая browser-матрица

Проверены пять routes × desktop 1280×900 / mobile 390×844 × Light/Dark, DPR2, reduced motion: **20 production-like profiles**.

Одиннадцать всегда видимых malformed phrases дали **44/44 painted profile-witnesses**:

- Gill: три конструкции;
- Diotrophes: `Все двадцать один материала различаются`;
- Hermenevtika: пять prose-калек;
- Lawson: `Неизвестно для меня эта площадка…`;
- Sem Tipov: literal `**Серия`.

Во всех профилях broken loaded images 0, horizontal overflow не положительный, page errors 0. Отфильтрованный `ERR_CONNECTION_CLOSED` на части article routes — sandbox delivery noise без поведенческого эффекта.

Axe: Light desktop/mobile и Dark mobile — 0. Dark desktop на Gill, Diotrophes и Sem Tipov повторяет по два узла `.mobile-btoc-section__label` / `#gbs2MobSec`, уже принадлежащие `GBS-TEXT-CONTRAST-RESIDUAL-BATCH`. Hermenevtika и Lawson Dark desktop — 0. Дубликаты не создавались.

## 3. Gill Part I

Три source/final фразы остаются ровно по одному разу и painted во всех четырёх профилях:

- `около двенадцати лет Гилл услышал`;
- `Продолжительность между`;
- `в виду многих зрителей`.

Это один conversion-section owner. Row остаётся `OPEN-CURRENT`; closure по-прежнему обязана сохранить Rippon attribution, возраст, интервал, дату и публичность крещения, а не выполнить глобальную замену `в виду`.

## 4. Diotrophes: agreement и unexplained jargon

Обычный paragraph `Все двадцать один материала различаются` остаётся painted 4/4. Row `GBS-DIOTROPHES-NUMERAL-AGREEMENT` — `OPEN-CURRENT`.

Learning Sheet проверен нативно: click `[data-gill-learning-open]` → click tab `#tabOutline`. Во всех четырёх профилях tab получил `aria-selected=true`, а `Фидельные свидетельства` появился как видимый `<small>`:

- desktop rect `407×34.8px`;
- mobile rect `319×34.8px`.

Значит, это не dormant config. `GBS-DIOTROPHES-UNEXPLAINED-FIDEL-JARGON` остаётся `OPEN-CURRENT`.

## 5. Hermenevtika: prose, tooltip и quiz payload

В пяти обычных paragraphs по одному разу остаются и painted 4/4:

- `не плотно соответствуют`;
- `двойное авторство оперирует`;
- `оговорки на формулу`;
- `рекапитулируются в конечном Давиде`;
- `кульминационный герой небом и землей`.

Отдельный trusted desktop flow открыл native click marker 107: popup получил `aria-expanded=true`, opacity 1 и painted rect `544×98.3px`; внутри реально показано `произвести истощенную Христологию`.

Quiz проверен настоящими действиями: scroll к `Проверь себя` → click `Начать проверку` → click answer первой задачи → click `Следующий вопрос`. Вопрос 2 отрисовал mixed-script option `чисто academическую условность` как видимую кнопку `634.8×76.9px`. Следовательно, bad payload не только загружен в JSON: он достигает native quiz UI.

`GBS-HERMENEUTIKA-TRANSLATION-AND-COPY-QUALITY` остаётся `OPEN-CURRENT`; prose editorial review и payload guard всё ещё нужны.

## 6. Lawson и Sem Tipov

Lawson malformed secondary-source rendering остаётся одним painted paragraph во всех четырёх профилях. Canonical research ledger также сохраняет фразу. Row остаётся `OPEN-CURRENT`; repair не должен молча повышать secondary review до original quotation authority.

Sem Tipov source `***Серия…*` по-прежнему компилируется в `<p>**<em>Серия…</em></p>`. Browser `innerText` содержит literal `**Серия` один раз и paints его 4/4. Другие найденные source строки с похожим Markdown prefix не дают этот exact final artifact на своих routed projections, поэтому row не расширен без rendered manifestation.

## 7. Gate gap и disposition

На exact main проходят `article-qa`, `readable-audit` и `editorial-lint`. В `scripts/tests/.github` нет exact negative fixtures для Gill, agreement, `Фидельные`, Lawson, `academическую` или Sem Tipov compiled prefix. Green checks не меняют disposition.

Все шесть rows подтверждены как `OPEN-CURRENT`. Новых work units нет; арифметика остаётся **45 direct + 8 improvements + 1 residual + 22 systems = 76**.
