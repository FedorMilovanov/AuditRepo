# Malformed Russian batch: resulting-main reconciliation — 2026-10-28

## 1. Якорь и границы

Проверен неизменённый Product main `cdf994b104d7b5eaeef407bf60e341e436efe1df`. Использован уже прошедший canonical production-like build на 108 финальных HTML-документов. На момент проверки открытых Product PR нет; issues #1812/#1753 относятся к лицензированию и не владеют этой редакторской lane. Product не изменялся.

Цель bounded-волны — проверить текущую судьбу `GBS-READER-MALFORMED-RUSSIAN-WORDS-BATCH` и наличие требуемой защиты от возврата уже известных форм. Машинное свидетельство: `evidence/2026-10-28-malformed-russian-resulting-main.jsonl`; полные browser outputs и 16 PNG оставлены вне Git в `/tmp/wave10`.

## 2. Source и final output

Все пять известных manifestations остаются ровно по одному разу в authored source:

- `обеспечредительные` и `обеспредительная` — `cerkovnaya-disciplina-vlast-granicy-zashchita.mdx`;
- `самосуверенности` — `vzroslaya-doch-otets-brak-soglasie-granitsy-vlasti.mdx`;
- `установленно виновным` — `vernye-i-neizvestnye-zdorovoe-pastyrstvo.mdx`;
- `телологии` — `BaptistyRossiiPeterburgskayaLiniyaBody.astro`.

В production-like final DOM каждое выражение также существует ровно в одном text node, не находится под `hidden`/`aria-hidden` и имеет painted Range. На mobile фраза `установленно виновным` переносится на два rect; это обычный перенос, не дубликат.

Следовательно, row остаётся current, а не historical residue. Редакторская семантика closure не меняется: две discipline-формы требуют точного выбора между safeguard и procedural response; остальные три исправляются без изменения фактических тезисов.

## 3. Browser matrix

Проверены четыре route × desktop 1280×900 / mobile 390×844 × Light/Dark, DPR2, `prefers-reduced-motion: reduce`: **16 production-like profiles / 20 token-profile witnesses**.

Во всех профилях:

- exact malformed text painted;
- broken loaded images 0;
- horizontal overflow 0;
- page errors 0;
- console errors 0;
- сохранён screenshot с находкой.

Axe: Light desktop/mobile и Dark mobile — 0 violations. Dark desktop даёт по два `color-contrast` nodes (`.mobile-btoc-section__label`, `#gbs2MobSec`) на каждом route; это уже охваченный `GBS-TEXT-CONTRAST-RESIDUAL-BATCH`, не следствие орфографии и не новый row.

LCP составил 404–3328 ms. CLS записан как контроль, но не приписан текстовым ошибкам: программный переход к глубокой фразе попадает в окно observer, а отдельные высокие значения согласуются с уже известными reader cold/compact проявлениями и не имеют causal trace в этой волне.

## 4. Guard reconciliation

Проверены текущие `article-qa`, `readable-audit` и `editorial-lint`: все три проходят при наличии пяти форм. Поиск в `scripts`, `tests` и `.github` даёт **0 fixtures** для каждого из пяти exact tokens.

Это не основание вводить глобальный spellchecker как блокирующую семантическую authority: specialist corpus содержит имена, транслитерации и богословскую лексику. Но уже требуемая row-ом узкая защита отсутствует. Closure по-прежнему должна включать reviewable exact-negative fixture для пяти известных malformed forms и source→final parity, а не только разовую редактуру.

## 5. Disposition

1. `GBS-READER-MALFORMED-RUSSIAN-WORDS-BATCH` остаётся `OPEN-CURRENT`: 5/5 source и 5/5 final manifestations сохранены.
2. Ни один текущий Product owner не пересекает lane; отдельный Product repair в этой AuditRepo-волне не создавался.
3. Нового systemic row нет: требуемая narrow negative-fixture защита остаётся частью closure существующего batch.
4. Новых work units нет. Арифметика остаётся **45 direct + 8 improvements + 1 residual + 22 systems = 76**.
