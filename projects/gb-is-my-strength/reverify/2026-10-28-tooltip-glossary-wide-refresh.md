# Широкая волна 17: tooltip/focus topology, glossary identity и note authority

Дата: **2026-10-28**  
Product: resulting exact `1aff67560d56d8521aaeab81bdc361f33dbd6af6` = `origin/main`; production-like build чистый.  
Owner reconciliation: Product PR #2215 влился во время волны; его 15-file diff добавляет один Hard Texts route/registries, не меняет shared tooltip/glossary/note owners; открытых Product PR после merge нет.  
Машинный receipt: `evidence/2026-10-28-tooltip-glossary-wide-refresh.jsonl`.

## Итог

Четыре существующие границы подтверждены без дублирования:

- `SYS-TOOLTIP-INTERACTION-OWNER-EXCLUSIVITY` — первый popup исправен, но полный native Tab order системно обрывается;
- `GBS-GLOSSARY-1689-CONFESSION-LINEAGE-MISSTATEMENT` — ложная lineage-формулировка нативно открывается на 11 routes;
- `GBS-GLOSSARY-CONCEPT-IDENTITY-CONSOLIDATION` — шесть пар concept identity и inflected display headings остаются;
- `SYS-NOTE-NUMBER-AUTHORITY-CONTRADICTION` — executable projection и нормативный документ по-прежнему требуют противоположное.

Закрытых строк нет. Матрица остаётся **54 active = 28 direct + 7 improvements + 1 residual + 18 systems**.

## 1. Scope и метод

Из final dist выбраны все **23 маршрута**, где реально присутствуют `.gterm`, `.fn-marker` или `.bref`. Проверены 390/1280, Dark, reduced motion — **46 профилей**.

Использовались только native `Tab`, `Enter`, `Escape`; forced click и programmatic focus не применялись для traversal proof. Для каждого профиля отдельно проверялись:

1. первый trigger: Enter → popup → Escape → exact opener;
2. untouched forward Tab от начала документа до естественного цикла;
3. Axe, broken images, page/console errors, overflow, LCP/CLS;
4. JS-off native Tab control.

## 1.1. Resulting-main reconciliation

Начальный полный health pass был снят на `1a67c65c…`. Во время волны Product #2215 влился как `1aff6756…`; выполнены fetch, diff review и новый production-like build (**105 pages**). Новый `/hard-texts/otstuplenie-ot-very-iuda-evreyam-6/` содержит 0 tooltip triggers и 0 LBCF glossary triggers. На resulting main заново выполнены все 46 native first-trigger/traversal profiles, 23 JS-off controls, 11 LBCF native popup routes и source contracts. Ни один счётчик ниже не перенесён вслепую со старого head.

## 2. Первый tooltip работает во всех профилях

Первый реальный trigger во всех **46/46** профилях:

- открывает ровно один `.gb-floating-tip.is-open` по Enter;
- получает `aria-expanded="true"`;
- закрывается Escape;
- возвращает focus точному opener 46/46.

Closed payload leakage не найден: `closedNonInert=0` во всех 46 профилях. Это подтверждает исправление прежнего dual-owner/geometry слоя и не даёт оснований возвращать отдельную строку footnote geometry.

## 3. Полный native Tab order остаётся сломанным

На старте 46 профилей находится 1,404 trigger nodes, из них **1,329** имеют положительную painted geometry и не находятся под `[inert]`.

Untouched forward traversal достигает только **103/1,329** таких triggers. Во всех **46/46** профилях происходит ранний focus cycle; только **4/46** успевают пройти все painted triggers.

Характер цикла различается по surface:

- desktop: 21/23 возвращаются к `skip-link` `#main-content`, ещё 2/23 — к `#content`;
- mobile: 21/23 зацикливаются на portalled `.gtip-expand-btn`; два оставшихся цикла происходят на другом раннем control.

Это универсальная portal/topology проблема, а не дефект одного Krajne footnote. Строка `SYS-TOOLTIP-INTERACTION-OWNER-EXCLUSIVITY` сохранена и дополнена широкими счётчиками.

## 4. JS-off boundary

При `javaScriptEnabled:false` на всех 23 маршрутах:

- в статическом DOM остаются 509 triggers и 235 `.gtip/.tooltip` payloads;
- суммарный payload text — 45,297 символов;
- native Tab достигает первого trigger 23/23;
- ни на одном маршруте первый payload не становится реально painted: единственный positive box у Kod остаётся `opacity:0`.

Этот результат записан как boundary существующего shared owner. Отдельная строка не создана: Product contract должен явно решить, обязаны ли определения быть доступны без JS либо достаточно линейной/print projection. JS-off не выдан за исправный только из-за присутствия текста в DOM.

## 5. Health boundary

На 46 JS-enabled профилях:

- page errors: 0;
- отфильтрованные console errors: 0;
- horizontal overflow: 0;
- CLS ≤0.00225;
- LCP среди наблюдённых entries ≤840 ms;
- Axe: 20 clean, 24 с уже существующим `color-contrast`, 2 с уже существующим `scrollable-region-focusable`.

Один первоначальный `broken image` на Kod desktop оказался lazy-load observation race: немедленный изолированный network-idle повтор дал 0 broken images. Он не классифицирован как Product defect.

## 6. Ложная история LBCF 1689 подтверждена нативно

Static text census находит упоминание LBCF 1689 на 14 routes. После runtime glossary projection ложный brief прикреплён к **12 triggers на 11 routes**; три routes содержат только обычное текстовое упоминание.

На всех 11 trigger routes native focus + Enter открывает формулировку:

> «переработка Лондонского исповедания 1644 года, наследовавшая структуру Уэстминстерского исповедания 1647 года».

Popup открылся 11/11, Escape вернул focus 11/11. Следовательно, это reader-visible canonical glossary content, а не dormant dictionary entry. Direct row остаётся активной.

## 7. Concept identity и display lemma остаются

`glossary-contract-audit.js` зелёный: 130 terms, **370 unique aliases**, 849 source files. Raw alias entries — 378. Shape/collision gate не распознаёт semantic identity.

Все шесть известных same-concept pairs остаются отдельными canonical records:

- `regula fidei` / `правило веры`;
- `pactum salutis` / `завет искупления`;
- `antinomianism` / `антиномианизм`;
- `well-meant offer` / `искреннее предложение`;
- `free offer` / `свободное предложение`;
- `особые баптисты` / `партикулярные баптисты`.

Mobile native Learning Sheet снова показывает inflected headings `Кархемише` и `козьего двора`, а не owner-approved nominative display lemma. Improvement остаётся активным.

## 8. Note number authority всё ещё противоречива

Source contracts зелёные:

- NoteRegistry core;
- NoteRegistry workflow policy;
- tooltip style/trigger normalizers;
- marker audit: 380 markers, 358 numbered, 22 doves, 0 invalid.

Но `docs/REFERENCE-TOOLTIP-CONTRACT.md` всё ещё требует сохранять visible authored number, тогда как generator/test канонизирует manuscript digits в published ordinal и хранит authored value только как provenance. Green executable tests подтверждают одну сторону, но не отменяют противоположную normative policy. System row остаётся.

## 9. Контракты и ограничения

PASS:

- glossary contract: 130 terms / 370 unique aliases / 849 files;
- glossary placement normalizer;
- glossary trust-boundary source contract;
- NoteRegistry core и workflow policy;
- tooltip style/trigger normalizers;
- tooltip marker source audit.

Два штатных Product browser scripts не стартовали из-за отсутствующего bundled Playwright browser (`Executable doesn't exist`). Это environment invocation failure, не Product defect и не заявленный PASS. Обязательный Chromium evidence получен отдельным harness через `@sparticuz/chromium` + versioned AL2023 NSS; 46 route profiles и JS-off control завершены.

## Решение

Широкая волна **17** завершена. Исправный first-trigger path отделён от сломанной route-wide focus topology; glossary history, concept identity, display lemma и note policy не смешаны в одну строку. Product не изменялся, новых дубликатов не создано, PR #2215 не пересекался.
