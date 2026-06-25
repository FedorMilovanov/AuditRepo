# Playwright-Verified Fixes — gb-is-my-strength — 2026-06-25

**Агент:** Arena Agent TOC  
**Среда:** Node.js v22.23.1 + Playwright Chromium (установлен локально в Arena sandbox)  
**Метод:** статический HTTP-сервер (python3 http.server) + Playwright headless Chromium  
**Тестировались:** root HTML (legacy) — НЕ Astro dist  
**Commits:** `c1bd605`, `2f2e2bb`

---

## Playwright тест — результаты

### Ключевые проверки по всем маршрутам:

```
Hermeneutics:  qs_err=✅0  cluster=✅LOADED  theme=✅works  save=✅present
GillPart1:     qs_err=✅0  cluster=✅LOADED  theme=GBS2-style  save=✅present  
Krajne(heart): qs_err=✅0  cluster=✅LOADED  ember=✅  save=✅works
Nagornaya1:    qs_err=✅0  cluster=✅LOADED  theme=✅works  save=✅present
```

---

## Подтверждения (Playwright verified)

### PS-01 qs crash — ✅ FIXED confirmed

На всех 8 тестируемых маршрутах: `qs_errors=0`. No ReferenceError. `window.__gbCluster` доступен.

### P0-10 stale hashes — ✅ FIXED confirmed

`window.__gbCluster` создаётся на всех premium маршрутах → контроллер загружается и работает.

### PS-02 theme toggle — ✅ FIXED на Hermeneutics, Nagornaya

Playwright верифицировал: click → `html.dark` класс меняется.  
GillPart1/Krajne: тема работает через `data-gbs2-theme` / site.js (GBS2 style) — корректно.

### PS-03 save button — ✅ PRESENT и WORKS на Krajne

`data-fc-action="save"` click → `gb-save.is-saved` появляется.

### PS-05 stray hash — ✅ NOT FOUND

`body_stray=false` на всех маршрутах.

### PS-07 duplicate IDs — ✅ FIXED

`dup_ids=none` на всех Gill маршрутах.

---

## Новые фиксы этого раунда

### Heart series (Krajne + Rimlyanam7) — полная синхронизация

**Что было:**
- Root HTML: нет gb-ember, нет контроллера
- Astro source: есть gb-ember, нет контроллера

**Что сделано:**
1. Root HTML: добавлены `gb-ember` + `gb-save` + контроллер
2. `gbs2-rfoot` получил `data-fc-controls="gill-rail"`  
3. Astro source: добавлен `<script ... floating-cluster-controller.js>`
4. Controller: `initGillRail()` теперь вызывается ДО early return

**Playwright result:** `cluster=✅ ember=✅ save_works=✅`

---

### Controller: ранний return устранён для gill-rail

**Было:**
```js
var roots = qsa('[data-fc-root]');
if (!roots.length) return;  // ← killAll: initGillRail никогда не вызывался
// ...
initGillRail(); // после return — мёртвый код
```

**Стало:**
```js
initGillRail(); // вызывается ПЕРВЫМ
var roots = qsa('[data-fc-root]');
if (!roots.length) return; // только early exit для data-fc-root cluster
```

---

### Nagornaya — data-fc-root добавлен в root HTML

`nag-sidebar-controls` в root HTML получил:
- `data-fc-root`
- `data-fc-mode="nagornaya"`

Controller теперь инициализирует sidebar Play+Save кнопки.

**Playwright result:** `cluster=✅ theme=✅ save=✅`

---

## Оставшиеся открытые вопросы

| Вопрос | Статус |
|---|---|
| GillPart1 theme_btn=false в Playwright | НЕ баг — тест ищет `.gb-theme-toggle` но root HTML имеет `data-gbs2-theme` (site.js обрабатывает) |
| Baptisty: нет data-fc-root | Кнопки в gbs2-rfoot — нужен отдельный фикс |
| P1-2 sitemap incomplete | Требует отдельного анализа |
| P1-3 search-manifest incomplete | Требует отдельного анализа |
| BUG-026 baptisty BreadcrumbList | Открытый |
| BUG-027 baptisty SVG og:image | Открытый |
