# Большая волна 6/16–20 — ownership интерактивных поверхностей

**Дата:** 2026-10-28  
**Product anchor:** `cdf994b104d7b5eaeef407bf60e341e436efe1df`  
**Кластер:** inline tooltips, rich footnotes, FAQ disclosure, strategic-map dialog, reversible cards  
**Вердикт:** четыре system lanes сохранены с новым resulting-main scope; один direct manifestation поглощён общим tooltip owner

## 1. Якорь и ownership

- Product checkout, `origin/main` и production-like `dist` совпадают на `cdf994b…`.
- Единственный открытый Product PR #2208 — docs-only и не затрагивает owners этой волны.
- Product до и после проверки чист; source, dependencies и workflows не изменялись.
- Browser evidence получен Chromium 153 через `@sparticuz/chromium`; force click и программный focus не использовались.

## 2. Объём и метод

Проверены пять активных единиц, объединённых focus/activation/portal ownership:

1. `SYS-TOOLTIP-INTERACTION-OWNER-EXCLUSIVITY`;
2. `GBS-FOOTNOTE-RICH-TOOLTIP-FOCUS-MODEL`;
3. `SYS-FAQ-COLLAPSED-FOCUS-EXPOSURE`;
4. `SYS-STRATEGIC-MAP-DIALOG-FOCUS-ENTRY`;
5. `SYS-REVERSIBLE-CARD-DESCENDANT-ACTIVATION-COLLISION`.

Использованы native hover/tap/click/Tab/Shift+Tab/Enter/Escape, полное CDP AX tree, Axe `nested-interactive`, no-JS contexts, desktop/mobile, Light/Dark и reduced/normal motion. Проверялись не только атрибуты, но active element, реальная geometry, hit path, card state и portal destination.

## 3. Tooltip ownership: старое столкновение исправлено, focus topology остаётся

### 3.1 Полный текущий census

Финальный `dist` содержит **23 routes** с `.gterm`, `.fn-marker` или `.bref`. Проверено **46 route/profile** состояний: desktop/mobile, Dark, reduced motion.

- `GBArticleTooltips.version === 20`: 46/46;
- `data-gb-article-tooltips-owner="article-inline-tooltip"`: 46/46;
- legacy `SiteUtils._tooltipControllers` для `.gterm/.fn-marker/.bref`: **0/46**;
- native hover/tap открыл popup: 46/46;
- popup полностью внутри viewport: 46/46;
- `left/top` имеют authoritative `!important`: 46/46;
- page errors: 0.

Baptist hub больше не воспроизводит прежний dual-owner geometry failure. `retireLegacyTooltipOwners()` действительно удаляет три legacy selector owners, а current runtime один владеет portal/geometry/state.

### 3.2 Текущий shared focus failure

В desktop первый tooltip trigger достигается, Enter открывает popup, Escape возвращает trigger — 23/23 controls. Но portal меняет последовательный порядок. На Krajne native Tab повторяет цикл:

`skip-link → первый .gterm → .gtip-expand-btn → body → skip-link`.

За 300 Tab первое rich footnote и всё последующее содержимое статьи не достигаются. На mobile первая glossary sheet ещё раньше переводит focus внутрь portaled popup, поэтому исходный target фиксируется как достигнутый только в 1/23 route controls; это не отсутствие trigger, а уход active element до следующего наблюдаемого шага.

Локальный bridge, добавленный в `article-tooltips.js`, умеет `Tab` из opener в popup и `Shift+Tab` обратно. На Gill I direct rich-footnote path он проходит. Но untouched Krajne path до семи rich markers недостижим из-за первого portaled glossary popup. Нельзя закрывать rich-footnote row programmatic focus либо запуском от уже выбранного marker.

### 3.3 Reconciliation

Прежняя причина `GBS-FOOTNOTE-RICH-TOOLTIP-FOCUS-MODEL` теперь является не отдельной footnote-реализацией, а одной манифестацией общего `article-tooltips.js` portal/focus owner. Direct row поглощается в `SYS-TOOLTIP-INTERACTION-OWNER-EXCLUSIVITY` без потери восьми linked-marker closure witnesses.

System lane сохраняется: dual ownership исправлен, но один текущий owner всё ещё нарушает последовательную доступность article content. Direct `44→43`; systems остаются 21.

## 4. FAQ: runtime state исправлен, no-JS boundary не выполнен

Проверены четыре FAQ routes × desktop/mobile × Light/Dark × reduced/normal motion = **32 runtime profiles**.

- 168/168 начальных answer instances collapsed;
- 168/168 имеют `inert` и property/attribute parity;
- native Tab после закрытия вошёл в collapsed answer: 0/32 targeted cases;
- pointer open снимает `inert`, keyboard Enter также открывает: 32/32;
- закрытие native click возвращает exact question: 32/32;
- page errors: 0.

CDP full AX tree для закрытого Krajne answer не содержит его уникальный текст: inert действительно убирает subtree из реального AX tree. `locator.ariaSnapshot()` здесь не используется как authority, поскольку locator snapshot может сериализовать адресованный скрытый subtree.

Открытый answer восстанавливает controls. В 7/8 dedicated desktop/mobile keyboard controls следующий Tab входит в answer. В mobile Antisovetov focus сразу переходит из answer glossary trigger в его portaled `.gtip-expand-btn`; это текущий tooltip focus owner из §3, а не повторная collapsed-state утечка.

Но no-JS проверка четырёх routes × desktop/mobile даёт **0/8 readable**: первый answer имеет `height=0`, `scrollHeight=0`, хотя text существует в DOM. CSS без enhancement сохраняет `max-height:0`/`grid-template-rows:0fr`; JS, который должен снять/управлять collapse, отсутствует.

`SYS-FAQ-COLLAPSED-FOCUS-EXPOSURE` поэтому не закрывается. Runtime keyboard/AX manifestation исправлен; residual сужен до no-JS readability contract.

## 5. Strategic map: focus entry исправлен, mobile triggers не универсальны

Antisovetov содержит 39 triggers. Проверены 39 × desktop/mobile × Light/Dark = **156 trigger/profile cases**.

### Исправлено

На desktop все 78 pointer-open и 78 keyboard-open cases:

- открывают dialog;
- переводят focus на named close button;
- имеют непустые record sections;
- остаются внутри viewport;
- Escape возвращает exact trigger.

Switching trigger A→B проходит 2/2 desktop schemes: A получает `aria-expanded=false`, B — `true`, focus остаётся в новом dialog.

На mobile все **72/78** естественно достигнутых cases также переводят focus в dialog и возвращают opener. Исходная статистика 0/156 focus entry больше не актуальна.

### Осталось

В каждом mobile scheme **36/39** `.map-trigger` имеют zero-height rect. Большинство всё ещё попадает в Tab order, но три уникальных trigger (`data-tip=1,5,6`) native Tab не достигает; pointer тоже не имеет физической element box. Итого native trigger reach/open/return — **150/156**, а не требуемые 156/156.

Это не оправдывает forced click: closure прямо требует все 39 triggers на mobile. Lane остаётся и сужается с dialog focus entry до mobile trigger geometry/reachability плюс сохранение уже исправленного focus contract.

## 6. Reversible cards: event collision исправлен, nested semantics остаётся

Финальный corpus по-прежнему содержит **17 cards на четырёх routes**. Gill III имеет четыре cards, в трёх front faces `article-heading-anchors` по-прежнему вставляет по focusable link внутрь card с `role=button`/`tabindex=0`.

Для трёх nested anchors проверены desktop Light/Dark × reduced/normal motion:

- pointer activation копирует ссылку и не flips ancestor: 12/12;
- native Tab → Enter копирует ссылку и не flips ancestor: 12/12;
- page errors: 0.

Следовательно, `event.target.closest(INTERACTIVE_SELECTOR)` и `event.target !== card` устранили исходное double activation.

Но closure требует ноль interactive descendants внутри button-like container либо отдельный explicit toggle. Это не выполнено:

- nested heading anchors: 3;
- Axe `nested-interactive`: 3 desktop nodes × 4 profiles = **12**;
- heading-anchor filter всё ещё не исключает reversible-card hosts.

`SYS-REVERSIBLE-CARD-DESCENDANT-ACTIVATION-COLLISION` остаётся активным, суженным до структурной/semantic composition и mobile/no-JS preservation; repaired event isolation нужно сохранить.

## 7. Gates

- `npm run validate` — PASS.
- `tooltip-trigger-normalizer-test.js` — PASS.
- `tooltip-style-normalizer-test.js` — PASS.
- `faq-jsonld-text-contract-test.js` — PASS.
- Product checkout после всех probes чист.

Зелёные нормализаторы не проверяют найденный portal Tab cycle; FAQ text contract не проверяет no-JS visibility; это зафиксированные guard boundaries, а не основание открыть новые дубли.

## 8. Итог

**Большая волна 6/16–20 завершена.**

- Новых defect IDs не создано.
- Rich-footnote direct manifestation поглощена общим tooltip system owner.
- Tooltip dual-owner geometry, FAQ runtime inert/AX, strategic dialog focus entry и card descendant event isolation подтверждены как реальные улучшения.
- Четыре system lanes остаются с точными текущими residuals.
- Новая арифметика: **43 direct + 8 improvements + 1 residual + 21 systems = 73 active work units**.
