# Exact Scripture destination reachability — широкая волна 37

**Дата:** 2026-10-29  
**Current Product main:** `54877be73a590b1e29f4d701724b39ed41c17e14`  
**PR extension:** #2217 exact head `ff860d39dd107997ba70470960bfb003ebc2be1a`  
**Граница:** read-only; Product-файлы, PR, labels и комментарии не изменялись.

## Finding

Поиск маркирует каждый source-index record как **«Точное вхождение»**, даже если record не имеет fragment anchor. При выборе такого результата runtime выполняет route-level navigation без hash и оставляет читателя в начале длинной страницы, в то время как найденный текст находится на несколько экранов ниже.

Это не проблема валидности URL: документ действительно содержит ссылку на Писание. Дефект — несоответствие обещанного occurrence outcome фактическому destination outcome.

## Current-main corpus

Из committed index exact main `54877be…`:

- references с occurrences: **1306**;
- occurrences: **3228**;
- occurrences без anchor: **1515**;
- references, у которых первый result без anchor: **769/1306**;
- references только с unanchored occurrences: **513**;
- mixed references с anchored и unanchored occurrences: **325**.

Следовательно, это не редкий edge case одной новой Home-карточки. Для 58.9% exact references первый indexed occurrence не имеет fragment destination.

## Native current-main witness

Для current-main fixture `Бытие 2:7` первый результат:

```text
Библейская кардиология: что Библия называет сердцем
Точное вхождение · Антропология
```

Проверка выполнялась через production-like Chromium с current-main index. `js/search.js` и целевой `ChtoBibliyaBody.astro` byte-equivalent между current main и PR head, поэтому для current-main witness был подставлен только exact committed main index; после проверки dist-файл восстановлен.

Native flow:

1. открыть поиск `Ctrl+K`;
2. выбрать scope «Ссылки»;
3. ввести `Бытие 2:7`;
4. нажать Enter на уже выбранном первом exact result;
5. проверить URL, hash, H1, scroll и geometry настоящего occurrence paragraph.

| Profile | Destination | Hash | scrollY | Occurrence Y | Visible |
|---|---|---|---:|---:|---|
| desktop 1440×900 | `/articles/chto-bibliya-nazyvaet-serdcem/` | empty | 0 | 3768–4085 | no |
| mobile 390×844 | same | empty | 0 | 5459–5996 | no |

URL и H1 правильны, но пользователь не попадает к выбранному вхождению. Это не `loaded ≠ navigated`: document navigation состоялась; провален именно promised occurrence destination.

## PR #2217 extension

Repair wave 35 корректно добавил шесть Home occurrences для `Евреям 6`. Runtime дедуплицирует их по `url#anchor`, поэтому они становятся одним Home result, но ставятся первыми для exact query.

Native Enter на первом результате в desktop/mobile приводит к `/` без hash и с `scrollY=0`:

- Publications occurrence card: Y 3521 desktop / 2765 mobile;
- Refutations occurrence card: Y 6295 desktop / 5009 mobile;
- обе карточки вне viewport.

На PR head общий corpus уже содержит 1559 unanchored occurrences; 772/1368 references начинают выдачу с unanchored result. Новая Home-проекция не создала root cause, но дала актуальный и особенно заметный пример: promotional text вытесняет вниз более точные anchored article results.

## Почему зелёные gates этого не видят

`__gbScriptureOccurrenceItem()` всегда устанавливает:

```text
isExactScripture: true
Точное вхождение
```

и строит destination как `url` плюс optional anchor. `__gbRenderExactScripture()` сохраняет source order и дедуплицирует по `url#anchor`, но не ранжирует reachable anchored outcomes выше route-only records.

Permanent browser contract:

- проверяет, что preview href принадлежит locations из самого index;
- для keyboard navigation выбирает fixture, где **есть какой-либо** anchored occurrence;
- ждёт совпадения URL;
- не проверяет существующий fragment target, target geometry, viewport landing или честную маркировку unanchored result.

То есть gate доказывает runtime/index agreement, а не reader outcome. Зелёные index checks волны 35 были правильны относительно своей детерминированной freshness-задачи; они не являются доказательством destination reachability.

## Causality

Это **system/design failure**, не слабость автора статьи:

- авторы не управляют сортировкой exact results и обещанием UI;
- unanchored records являются разрешённым массовым output producer-а;
- runtime одинаково маркирует anchored и route-only outcomes;
- browser guard использует тот же index как oracle и не измеряет final target.

Исторический `SCRIPTURE-OCCURRENCE-ANCHOR-FALSE-WITNESS` касался ложных сохранённых fragments и был закрыт через representation oracle. Здесь fragment отсутствует честно, но UI всё равно обещает точное вхождение и admission не проверяет достижимость. Это отдельная текущая граница, а не reopening старого regex defect.

## Durable closure

Адмитирован один system lane `SYS-SCRIPTURE-EXACT-DESTINATION-REACHABILITY`.

Минимальный честный контракт:

1. anchored occurrences ранжируются выше unanchored records для exact query;
2. item с anchor называется exact occurrence только если final DOM содержит этот target;
3. route-only records получают отличимую маркировку вроде «Материал с упоминанием», а не ложный exact-destination promise;
4. native Enter/click проверяет final page identity, fragment target, target-in-viewport и winning hit-test;
5. mixed fixture доказывает, что unanchored promotional copy не вытесняет reachable anchored result;
6. all-unanchored fixture остаётся доступным как route-level discovery, а не молча удаляется;
7. negative fixture ломает fragment/reachability и делает gate красным.

Автоматически вставлять inline `id` на каждую ссылку Писания или строить brittle text-fragment URLs без owner policy не требуется.

## Итог

- Новый current-main system defect воспроизведён desktop/mobile.
- PR #2217 расширяет его, но не является первопричиной.
- Systems: **20 → 21**.
- Active total: **56 → 57**.
- Новая арифметика: **28 direct + 7 improvements + 1 residual + 21 system lanes = 57**.
- Product не изменялся.

**Широкая волна 37 завершена.**
