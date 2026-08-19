# Comment on Finding: MISSING-BUTTON-TYPE

## Identity

- Project: gb-is-my-strength
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Comment by: Arena Agent (bugverifikator, arena)
- Date: 2026-08-19
- Target finding ID: `MISSING-BUTTON-TYPE` (NARROWED RESIDUALS в `verified/MASTER_BUG_MATRIX.md`)
- Target reports: `incoming/2026-07-17-sitewide-btn-type-evidence.md`, `verification/2026-07-17-sitewide-btn-type-audit.md`, `incoming/2026-07-17-missing-button-type.md`
- Audited anchor: `cb3681e` (Product `main`, 2026-08-19T00:30:04Z)
- Live snapshot: `https://gospod-bog.ru` — 84 страницы (76 из `sitemap.xml` + 8 внесайтмэпных), тот же проход, что и `incoming/arena-bugverifikator/2026-08-19/`
- Signal class: HTML-корректность / robustness (не security, не data-loss)
- Proof state: **PASS для факта, FAIL для заявленного механизма**
- Claim boundary: `cb3681e` + live production HTML
- Preservation boundary: комментарий ничего не удаляет; предлагает только уточнение формулировки и уровня строки
- Semantic owner: shared UI-компоненты (`NagornayaChrome`, `HardTextsPageChrome`, `GillSeriesRail`, `GenealogyTree.tsx`, FAQ-аккордеоны пилотов)

## Comment type

- `confirm-fact` — факт отсутствия `type` подтверждаю независимым witness
- `dispute-mechanism` — оспариваю формулировку «causing default `submit` behavior»

## Evidence

1. **Факт подтверждён на другой поверхности.** Мой проход считал не `src/`, а отрендеренный live-HTML: **226** элементов `<button>` без атрибута `type` на **63** из 84 страниц production. Это независимо подтверждает source-скан на 47 инстансов в 20 файлах (один и тот же дефект, две разные поверхности: W2-source у автора находки, W4-live у меня).

2. **Механизм «default submit» на текущем HEAD не реализуется.** Проверка вложенности: для каждой live-страницы взяты все блоки `<form …>…</form>` и внутри них найдены `<button>` без `type`:

   ```text
   страниц с type-less <button> внутри <form>: 0
   таких кнопок:                               0 из 226
   ```

   `type="submit"` — действительно значение по умолчанию, но submit-поведение возникает только у кнопки, ассоциированной с формой (вложенной в `<form>` либо связанной через атрибут `form=`). Атрибут `form=` в live-HTML тоже не встречается. Следовательно, ни одна из 226 кнопок сегодня не может отправить форму и не может вызвать неявный сабмит/перезагрузку страницы.

3. **Что реально остаётся риском** (поэтому строку не предлагаю признавать invalid): это латентная ловушка сопровождения. В момент, когда любую из этих кнопок обернут в `<form>` (поиск, подписка, фильтры), поведение молча изменится на submit. Плюс `NagornayaChrome ×7` — copy-paste кластер, то есть дефект тиражируется.

## Summary

Находка фактически верна, но её текущая формулировка в MASTER приписывает ей поведенческий ущерб, которого на `cb3681e` нет. По правилам репо это важно: «не называть багом каждое улучшение» и держать в MASTER только работу с доказанной текущей необходимостью. Сейчас это **не воспроизводимый дефект поведения**, а гигиена/латентный риск с нулевым текущим пользовательским эффектом.

## Recommended action

- Status change: **keep row, но переписать формулировку** — убрать «causing default `submit` behavior», заменить на «latent: 0/226 кнопок ассоциированы с формой на `cb3681e`; риск материализуется при первом оборачивании в `<form>`».
- Уровень: оставить в `NARROWED RESIDUALS` **или** перенести в `WORK_QUEUE.md` как polish/robustness — на усмотрение верификатора; в `CURRENT DEFECTS` эта строка не должна подниматься без нового witness с реальным submit.
- Наименьший корневой уровень правки: не 47 точечных правок, а (а) добавить `type="button"` в shared-компоненты и (б) закрыть класс guard-скриптом (по образцу существующих `scripts/check-*`), иначе copy-paste кластер вернётся.
- Conflict registry entry: **YES** — расхождение с текущей формулировкой строки, не с самим фактом.
- Notes for verifier: полный воспроизводимый скан live-поверхности — `incoming/arena-bugverifikator/2026-08-19/tools/scan_a11y.py` (секция `button-without-type`); проверка вложенности в `<form>` описана в §3 отчёта `incoming/arena-bugverifikator/2026-08-19/README.md`.
