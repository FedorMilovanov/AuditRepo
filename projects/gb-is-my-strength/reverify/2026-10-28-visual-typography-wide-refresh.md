# Широкая волна 14: визуальная типографика, масштаб и premium-подача

Дата: **2026-10-28**  
Product: exact `1a67c65cf2a30b06200480b7245abab873447a47` = `origin/main`; дерево чистое.  
Open owner: Product PR #2215 добавляет новый Hard Texts материал; shared typography, Nagornaya, Genesis, Hermenevtika chrome, hero и map owners не затрагивает.  
Машинный receipt: `evidence/2026-10-28-visual-typography-wide-refresh.jsonl`.

## Итог

Три старые прямые строки оказались исправлены на current main и закрыты:

- `GBS-GENESIS6-THEME-TOGGLE-LOW-CONTRAST`;
- `GBS-HERMENEUTIKA-MOBILE-SPEED-BADGE-UNDERSIZED`;
- `GBS-NAGORNAYA-READER-FONT-SCALE-INCOMPLETE`.

Семь presentation boundaries сохранены и уточнены:

- `GBS-NAGORNAYA-MOBILE-JUSTIFICATION-RIVERS`;
- `GBS-CUSTOM-FONT-MATRIX-MIXED-FAMILY-RENDERING`;
- `GBS-PRINT-MEDIA-CONTRAST-COLLAPSE`;
- `GBS-HERO-IMAGE-HIDPI-SOURCE-CAPACITY`;
- `GBS-MAP-ARCHAEOLOGY-MICROTEXT-DENSITY`;
- `GBS-SUMMARY-MICROHEADING-READABILITY`;
- `SYS-MATERIAL-TYPOGRAPHY-GATE-FAILOPEN`.

Арифметика: **62 → 59 active**, direct **36 → 33**; `59 = 33 + 7 + 1 + 18`.

## 1. Genesis 6: контраст переключателя темы закрыт

Исправление находится в Product `56424c8003`: scoped rule задаёт glyph `#f2ece1` на тёмной поверхности Genesis header в обеих темах.

Exact-main native proof: 390/1280 × Light/Dark. Для каждого профиля сделаны paired screenshots одного 44×44 target: обычный glyph и тот же clip со скрытыми SVG. Максимально различающийся painted pixel даёт:

- mobile Light: 14.28:1;
- mobile Dark: 16.08:1;
- desktop Light: 15.82:1;
- desktop Dark: 16.08:1.

Минимум существенно выше 3:1. Axe 0, broken images 0, page errors 0, overflow 0; LCP 256–568 ms, CLS ≤0.0012. Focus остаётся на реальном 44×44 control, forced-colors focus owner не изменён. Строка `FIXED-CURRENT`.

## 2. Hermenevtika-family: speed badge закрыт

Исправление пришло в Product `b2611caf09`. Проверены Kod Da Vinci, Lot и Hermenevtika при 390px × Light/Dark × reduced/normal motion — 12 профилей.

Во всех случаях:

- реальный badge box ≥36×28px;
- `::before` target =44×44px;
- площадь пересечения с соседним 38×38 Play target =0;
- native badge click открывает speed rail, повторный click закрывает: 12/12;
- отдельный Play click активирует Play owner, а не badge target: 12/12.

Reader-controls browser contract дополнительно проходит **141/141** checks, включая `aria-controls`, collapsed/expanded state, inert/Tab boundary, Arrow/Home/End, rate persistence и exact focus return.

Screenshots сохранены вне Git. Broken images/page errors 0; LCP 168–352 ms, CLS ≤0.00219. Два Axe contrast сигнала относятся к уже принятому aggregate contrast owner, не к размеру/пересечению badge. После намеренного Play sandbox не запускает системный синтез и пишет 12 `synthesis-failed`; это не delivery/target defect и не использовано как ложное функциональное падение. Строка `FIXED-CURRENT`.

## 3. Nagornaya: reader font scale закрыт

Исправление Product `7826432658` переводит prose utilities внутри `body.nagornaya-page main` на `calc(base * --gb-reader-font-scale)`.

Проверены пять частей × 390/1440 × Light/Dark = 20 профилей. В каждом через canonical persisted reader state последовательно применены 1, 1.15 и 1.25. Сопоставлено **596** long-prose profile witnesses:

- 12 → 13.8 → 15px;
- 14 → 16.1 → 17.5px;
- 16 → 18.4 → 20px;
- 18 → 20.7 → 22.5px.

Неизменившихся long prose: **0**. Root variable во всех профилях точно принимает `1 / 1.15 / 1.25`; горизонтальный overflow 0. Темы и иерархия сохранены. Axe-сигналы только на уже принятой keyboard-scroll таблице; broken images/page errors 0, representative LCP 128–228 ms, CLS 0. Строка `FIXED-CURRENT`.

## 4. Nagornaya: чрезмерная мобильная выключка остаётся

Пять частей проверены на 320/390/768/1024/1280 × Light/Dark — 50 профилей. В каждой схеме остаётся 156 computed-justified prose blocks. Same-line Range census на одну схему:

| Width | gaps ≥20px | max gap |
|---:|---:|---:|
| 320 | 1763 | 136px |
| 390 | 1326 | 127px |
| 768 | 334 | 93.875px |
| 1024 | 388 | 93.875px |
| 1280 | 144 | 57.5px |

Горизонтального overflow нет: это именно rhythm/rivers defect, а не clipping. Row остаётся активной; current count уточнён с прежних 144 до 156 blocks на схему.

## 5. Custom-font matrix остаётся неполной

CDP `CSS.getPlatformFontsForNode` на 390/1280 подтверждает:

- Playfair 600 H1: 26 custom glyphs + 23–24 DejaVu Serif glyphs;
- Inter 700 mixed caption: 23 Inter SemiBold + 13–14 DejaVu Sans glyphs;
- requested Lora 700: целиком `Lora SemiBold`;
- Source Sans 3 600 summary label: `Source Sans 3 ExtraLight SemiBold`.

Следовательно, computed family/weight по-прежнему не гарантирует единое реальное начертание; platform-dependent split и silent weight substitution воспроизводятся. Текущие font-assets contracts зелёные (28 named checks, 3 alias fixtures, 28 pinned WOFF2), но не закрывают requested-token matrix. Direct row остаётся активной.

## 6. Summary microheading: measurable premium gap сохраняется

Все 105 final routes проверены при 390 и 1280. `h2.summary-card__head` найден на 50 маршрутах / 100 профилях:

- 34 routes × 2 = 68 witnesses: 9px / 9.9px / 1.8px tracking;
- 16 routes × 2 = 32 witnesses: 10px / 13px / 2.8px tracking;
- невидимых/clipped headings: 0.

Это по-прежнему не заявляется font-size-only WCAG failure. Improvement остаётся активным как системная иерархия/premium readability.

## 7. Hero HiDPI capacity уточнён

Тринадцать известных hero routes проверены при 1280 DPR1/DPR2:

- двенадцать routes выбирают fixed 600px source на painted width 688–694.2px и не имеют `srcset/sizes`;
- на DPR1 эти 12 уже upscale;
- на DPR2 недостаточная density есть у всех 13;
- Lot теперь рисует physical 760px source в 688px slot: DPR1 достаточен, DPR2 — нет;
- responsive candidates: 0/13.

Поэтому improvement остаётся, но старое утверждение `Lot 760→800` заменяется текущей геометрией и DPR2-only недостаточностью Lot.

## 8. Map archaeology microtext сохраняется

Выполнен только естественный native flow: «Начать изучение» → named SVG marker через Enter → вкладка «Археология». Проверены Avraam/Ur и Ishod/Rameses при 390/1280 × Light/Dark.

Painted microtext в каждом профиле:

- Avraam: 10 nodes по 8px, 49 по 9px, 29 по 10px; panel 634/3080 mobile и 639/2974 desktop;
- Ishod: 3 nodes по 8px, 9 по 9px, 6 по 10px; panel 634/781 mobile и 617/760 desktop.

Axe, broken images, page errors и horizontal overflow: 0. Зелёная доступность не отменяет плотную 8–10px библиографию. Improvement остаётся активным.

## 9. Print contrast: Biografii residual остаётся

`/biografii/` в print media проверен при 390/1280 × Light/Dark. Tagline имеет positive 16px box и computed black во всех 4 профилях, однако hit-test центра возвращает underlying `IMG` 4/4. То есть text layer формально существует, но painted stacking не даёт честного читаемого текста. Узкий Biografii residual и 16-route regression boundary сохраняются.

## 10. Typograf gate остаётся fail-open

`npm run typograf:dry` на exact main снова сообщает те же шесть файлов и `Would change: 6 files`, но завершает работу с exit 0. `SYS-MATERIAL-TYPOGRAPHY-GATE-FAILOPEN` остаётся активной.

## 11. Контракты и красные проверки

PASS:

- reader-preferences source regression;
- reader-controls-a11y browser contract: 141/141;
- font assets / alias / pinned-file contracts;
- Nagornaya visual parity;
- Nagornaya premium controls ARIA.

`reader-preferences-browser-smoke.js` при локальном HTTP отметил 23 failures только из-за заблокированного `https://mc.yandex.ru/metrika/tag.js` (`ERR_CONNECTION_CLOSED`). В его же payload canonical state, theme, scale, line-height, measure и overflow assertions имеют ожидаемые значения. Это отфильтрованный sandbox egress noise, не Product defect; тест не объявлен зелёным.

WebKit: `skipped: sandbox engine`. Chromium native evidence обязательно и получено.

## Решение

Широкая волна **14** завершена. Три stale direct rows удалены из active matrix по exact-main source+painted+native evidence; семь presentation owners сохранены без дробления и с актуальными счётчиками. Product не изменялся, PR #2215 не пересекался, новый Product PR не создавался.
