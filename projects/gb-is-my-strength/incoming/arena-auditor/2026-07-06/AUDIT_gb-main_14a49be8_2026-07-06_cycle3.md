# АУДИТ — gb-is-my-strength (re-audit cycle 3)

> **Режим:** чистый аудитор (только наблюдение и отчёт, без правки кода).
> **Объект:** `main` @ `14a49be83ab57212c0bbd26a8249b75ac026511d` (Merge PR #48).
> **Дата:** 2026-07-06 (цикл 3, углублённое чтение клиентского JS новых фич). **Аудитор:** arena-auditor (Node v22.12.0).
> **Продакшн:** 🟢 GREEN — run `28794737410` (`workflow_dispatch`, 2026-07-06T13:22Z, success). Новых CI-прогонов нет.

---

## 0. Регресс-контроль (этот цикл)

| Гейт | Результат | Деталь |
|---|---|---|
| `node scripts/audit-pro.js` (Node 22) | ✅ PASSED | те же 3 предупреждения (CSS/JS бюджеты, magic z-index) |
| `npm run validate:all` | ✅ PASSED | 0 errors; 2 неблок. `title≠og:title` (D-19) |
| `npm run data:consistency` | ✅ PASSED | `GB DATA CONSISTENCY AUDIT — passed` |
| CI deploy runs (API) | 🟢 1 success / 0 failure | `28794737410` success @ `14a49be8`; не повторялся |
| `git fetch` (gb) | ➖ 0 новых коммитов | `origin/main == HEAD == 14a49be8` |

**Вывод:** регрессий нет; продакшн стабильно GREEN. Цикл — углублённое чтение клиентского JS новых/менявшихся фич.

---

## 1. Области углублённого анализа (этот цикл)

Прочитаны и проанализированы исходники:
- `js/glossary.js` (глоссарий — недавно чинился: «вложенная подсветка ломала тултип»)
- `js/bookmark-engine.js` (движок закладок / «место чтения»)
- `src/pages/izbrannoe/index.astro` (логика «Избранного»: render/remove/clear)
- `src/components/home/HomeSections/Favorites.astro` (домашнее «Ваше избранное»)
- `js/enhancements.js` (FAQ-аккордеон + санизация для JSON-LD)
- `data/glossary.json` (проверка содержимого на raw-HTML)

---

## 2. НОВЫЕ находки

### D-21 (Low) — Глоссарий: несогласованное экранирование → буквальный `<em>` в тултипах
**Первопричина (доказано):** `js/glossary.js` рендерит `definition`/`detail` **двумя разными способами**:
- Путь гидрации `o(t,e)` — `a.innerHTML = ... + b + ... + d + ...`, где `b`/`d` берутся из `glossary.json` **без экранирования** → HTML (в т.ч. `<em>`) отображается как разметка (курсив).
- Путь «апгрейда» серверных `.gterm` `l()` — `host.querySelector(".gtip-papyrus").textContent = detail` → то же `detail` вставляется через **`textContent`**, поэтому `<em>` показывается **как буквальный текст** пользователю.

**Подтверждение данными:** `data/glossary.json` (210 КБ) содержит настоящий HTML в полях `detail` — десятки вхождений `<em>…</em>`, напр.:
- `"Герменевтика"`: `…<em>«верно преподающим слово истины»</em> (2 Тим. 2:15).`
- `"Эйзегеза"`: `…<em>«превращают, как и прочие Писания»</em> … (2 Пет. 3:16).`
- `"Sola Scriptura"`, `"Heilsgeschichte"`, `"Экзегеза"` и др.

Следствие: у серверно-отрендеренных глоссарий-тултипов (те, что проходят через ветку «апгрейда» `l()`) панель «Подробнее» покажет пользователю **видимый литерал `<em>«верно преподающим…»</em>`** вместо курсива. Визуальный баг несогласованности между двумя путями рендеринга.

**Связь с дисциплиной проекта:** `js/enhancements.js` FAQ-аккордеон, напротив, **санизирует** HTML (удаляет `script/style/iframe/on*/javascript:`), а `izbrannoe`/`Favorites` экранируют через `esc()`. Глоссарий `o()` — единственное место, где владелец-авторский HTML из данных вставляется через `innerHTML` без единой точки сана/экранирования. Поскольку источник доверенный (коммит владельца), это **не XSS**, а баг консистентности рендеринга; но при любом будущем изменении источника данных — риск.

**Рекомендация (для владельца):** привести оба пути к единому поведению — либо везде `textContent` (и хранить `detail` уже как plain-text без `<em>`), либо везде доверенный `innerHTML` (и в `l()` тоже рендерить `<em>`).

### D-22 (Low/Info) — Favorites.astro: `f.path` не валидируется на `javascript:`-схему перед `card.href`
**Доказательство:** `src/components/home/HomeSections/Favorites.astro`:
```js
var safePath = f.path ? String(f.path) : '/';
card.href = safePath.endsWith('/') ? safePath : safePath + '/';
card.setAttribute('data-fav-path', safePath);
```
`f.path` берётся из `localStorage['gb-favorites']` (тот же ключ, что и у `/izbrannoe/`) и подставляется в `href` **без проверки схемы**. При этом:
- Тот же компонент валидирует `f.image` регэкспом `/^(https?:)?\/\//i` — значит автор осознанно фильтрует URL-поля;
- «близнец» `src/pages/izbrannoe/index.astro` оборачивает `path` в `esc(path)` при вставке в `href` (и в `data-path`).

Следствие: если в `gb-favorites` записать `path = "javascript:alert(1)"`, `card.href` станет `javascript:alert(1)`, и клик по карточке выполнит JS. Источник — `localStorage` (same-origin, контролируется пользователем) ⇒ **само-XSS**, серьёзность Low. Но это расхождение с собственной проверкой `image` и с дисциплиной XSS-харденинга проекта (P1-SITE-XSS, NEW-48 Stored XSS, SEC-001-VERIFIER).

**Рекомендация:** перед `card.href =` отбрасывать/экранировать `javascript:`/`data:`-схемы (как минимум зеркалировать логику `izbrannoe`/`image`-чека).

---

## 3. Проверено и ЧИСТО (этот цикл)

- **`/izbrannoe/` (render/remove/clear):** все пользовательские поля (`path`, `title`, `description`, `section`, `image`) проходят через `esc()` перед вставкой в `innerHTML`/`href`; remove — корректное делегирование + фильтр по `data-path`; clear — `confirm()` + `write([])`; есть `storage`-синк между вкладками; `ruPlural` корректен. **Дефектов нет.**
- **`bookmark-engine.js`:** подозрительный фрагмент очистки `i&&i.savedAt&&i.path&&!(age>t)||removeItem(r)` **на деле корректен** (приоритет `&&` выше `||` ⇒ свежие записи сохраняются, устаревшие удаляются). Ключи очистки/`dismissed` не попадают под префикс `bookmark:<siteId>:` (ложного удаления нет). Слушатели навешиваются один раз под гардом `_initialized` (утечек нет). **Дефектов нет.**
- **`enhancements.js` FAQ:** HTML ответов санизируется (удаление `script/style/iframe/object/embed/link/meta/base/form/input/button/svg/math`, `on*`-атрибутов и `javascript:`-href) перед записью в JSON-LD. **Хорошая практика — позитив.**

---

## 4. Ограничения аудита
- Полный `strangler:build:production-like` локально OOM (exit 137); браузерные гейты — через CI (авторитетно).
- GitHub fine-grained PAT **нельзя отозвать через API** — отзыв вручную владельцем: https://github.com/settings/tokens (Fine-grained) → `github_pat_11B5…`.

---

## 5. Рекомендации (для владельца)
1. **(Low) D-21:** унифицировать рендеринг глоссарий-тултипов (`o()` ↔ `l()`) — единый способ вставки `detail` (textContent везде ИЛИ доверенный innerHTML везде).
2. **(Low) D-22:** в `Favorites.astro` валидировать `f.path` на `javascript:`/`data:`-схемы перед `card.href` (зеркалировать чек `image` и поведение `izbrannoe`).
3. **(Carry-over) D-1/D-2/D-3/D-4/D-7/D-8/D-9/D-19/D-20:** см. пред. циклы и матрицу.

---

*Подготовлено независимым аудитором (arena-auditor). Отчёт и матрица запушены в `FedorMilovanov/AuditRepo` в `incoming/arena-auditor/2026-07-06/` и `verified/MASTER_BUG_MATRIX.md`.*
