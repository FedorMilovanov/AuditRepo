# Широкая волна 10 — родословный атлас: семантика, направления связей и повторное открытие

**Дата:** 2026-10-28  
**Product exact current main:** `f72dc54b1a860658fbd0c4c52bb45e1256c9c9b8`  
**Runtime build anchor:** `4b0cc8a0eae848afcbdb6ae4d63a67f9fb9d8e53`  
**Режим:** read-only SYSTEM reverify; Product не изменялся  
**Строки:** `GBS-GENEALOGY-OVERVIEW-SEMANTICS`, `GBS-GENEALOGY-RELATION-LABEL-DIRECTION`, `GBS-GENEALOGY-POINTER-PANEL-STATE-DESYNC`.

## 1. Точная база и владелец

Во время волны Product main последовательно сдвинулся `d056a19c…` → `4b0cc8a0e…` → `f72dc54b1…`. Runtime/data diff до `4b0cc8a0e…` — merged genealogy v2 direct-name batch и commit-pinned Synodal source; после полного build и browser matrix пришёл только docs-only #2212 (`audit/APOSTASY-RECOVERY-PLAN…`, `audit/ARCHIVE-REGISTRY…`). Поэтому final `f72dc54b1…` runtime byte-equivalent проверенному build. Единственный открытый Product PR #2213 восстанавливает apostasy draft candidate и не пересекается с `/rodosloviye/`, genealogy components/data или contracts.

Production-like build прошёл на exact runtime anchor: Astro 625 files, 0 errors, 7 pre-existing hints; 104 Astro pages и итоговые 108 HTML. Product checkout остался clean. Существующий static server читал перестроенный `dist` напрямую.

## 2. Канонический release contract

`scripts/genealogy-browser-contract.mjs` запущен в Chromium 153 для 390×844 mobile/touch и 1440×1000 desktop:

- normal motion: PASS 2/2;
- reduced motion: PASS 2/2;
- на каждом профиле mounted persons = 154, overview anchors = 5;
- поиск, Fit View, semantic zoom, family navigation, relationship inspector, split view, theme lifecycle и focus return прошли;
- hydration-fallback проверен с заблокированными island scripts в Light/Dark;
- deliberate mutation `legal-relation-touch-target` корректно отвергнута каноническим negative witness.

WebKit exact-current run **SKIPPED: sandbox egress / engine executable unavailable** (`webkit-2336/pw_run.sh` отсутствует; разрешённого канала загрузки browser bundle нет). Это ограничение среды, не Product failure. Обязательный Chromium witness выполнен; исторически закрытый `SYS-GENEALOGY-WEBKIT-WITNESS` не переоткрывается.

## 3. `GBS-GENEALOGY-OVERVIEW-SEMANTICS` — `FIXED-CURRENT`

Fresh browser matrix: desktop/mobile × Light/Dark, во всех случаях reduced motion.

На overview по-прежнему монтируются 154 React Flow wrappers и рисуются пять story anchors (`Адам`, `Ной`, `Авраам`, `Давид`, `Иисус`), но семантический слой теперь совпадает с видимым:

- visible cards: 5;
- wrappers с role: 5;
- wrappers с accessible name: 5;
- focusable wrappers: 5;
- hidden semantic cards: 149;
- Chromium full AX tree person controls: ровно 5, role `group`;
- Axe `aria-prohibited-attr`, `aria-hidden-focus`, `nested-interactive`, `region`: 0 на всех четырёх профилях.

Current owner выдаёт `ariaLabel` и React Flow focusability только для `visibleNodeIds`; скрытые cards получают `aria-hidden` и `visibility:hidden`. Старый разрыв «5 нарисовано / 154 объявлено» устранён. Строка удаляется.

## 4. `GBS-GENEALOGY-POINTER-PANEL-STATE-DESYNC` — `FIXED-CURRENT`

Проверено восемь нативных сценариев на desktop/mobile × Light/Dark:

- Адам: закрытие кнопкой → один повторный click открывает panel;
- Ной: закрытие Escape → один повторный click открывает panel;
- после каждого закрытия focus возвращается точному `.react-flow__node[data-id]`;
- промежуточного клика, снимающего только highlight, больше нет.

Current handler переключает по `selected?.id`, то есть по фактическому владельцу details panel, а не по сохраняемому lineage `activeId`. 8/8 reopen и 8/8 exact focus return проходят без forced click, таймеров или синтетического второго нажатия. Строка удаляется.

## 5. `GBS-GENEALOGY-RELATION-LABEL-DIRECTION` — `FIXED-CURRENT`

На каждом из четырёх viewport/scheme профилей открыты реальные person panels и проверены шесть направлений — **24/24**:

1. Адам → Ева: `Супруги` с обеих сторон;
2. Адам → Каин: у Каина роль `Ребёнок`;
3. Ева → Каин: у Каина роль `Ребёнок`;
4. Иосиф (Обручник) → Иисус Христос: `Юридический родитель` со стороны Иосифа;
5. то же canonical direction: `Юридический ребёнок` со стороны Иисуса.

Каждый control имеет `data-relation-direction`, рисует явное `from → to` и сохраняет endpoint-relative role. Канонический contract дополнительно открыл inspector, проверил reviewed/pending evidence, source refs и exact focus return. Данные не перевёрнуты; исправлен только presentation formatter. Строка удаляется.

## 6. Data/runtime boundary

Targeted gates на final data state:

- raw v2 publication audit: ожидаемо `draft-blocked`, 3056 persons, 2814 RU review items, 0 unresolved refs;
- runtime guard: PASS — raw v2 references 0, runtime использует только отдельно audited publishable projection;
- publishable projection: 154 persons, 181 relations = 171 parent + 9 spouse + 1 legal-parent;
- relation evidence: 42 reviewed, 139 pending; состояния честно различаются в UI;
- edge annotation: 42 committed annotations, 9 negative cases, PASS;
- geometry: 154 persons, 0 overlaps, 5 overview anchors, PASS;
- focus graph, Gospel Matthew/Luke projection и runtime data boundary: PASS.

Очередь v2 не выдаётся за закрытую: она fail-closed и не подключена как raw runtime. Последний direct-name batch уменьшил review queue 2825→2814, не меняя certified 154-person projection. Новая matrix row не требуется.

## 7. Browser health

Четыре профиля дали:

- page errors 0;
- console errors 0;
- broken images 0;
- actionable request failures 0;
- local LCP 104–152 ms;
- CLS mobile 0, desktop 0.0005244;
- screenshots сохранены вне Git.

No-JS mobile Dark: HTTP 200, один `<main>`, visible native `.genealogy-island-fallback`, 1 recovery/methodology link и 1938 chars body text. Интерактивное древо честно обозначено как клиентское дополнение.

## 8. Reconciliation

Удалены как `FIXED-CURRENT`:

- `GBS-GENEALOGY-OVERVIEW-SEMANTICS`;
- `GBS-GENEALOGY-RELATION-LABEL-DIRECTION`;
- `GBS-GENEALOGY-POINTER-PANEL-STATE-DESYNC`.

Арифметика: **66 → 63 active units**, direct **40 → 37**; improvements/residual/systems остаются **7/1/18**. Product mutation не потребовалась: текущий main уже содержит три bounded repairs и канонические contracts.
