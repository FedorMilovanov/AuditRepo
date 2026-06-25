# Verification Round 3 — Playwright — 2026-06-25

**Агент:** Arena Agent TOC  
**Метод:** Node.js v22.23.1 + Playwright Chromium headless  
**HEAD:** `30b2031` (main)  
**Тестировался:** root HTML (legacy)

---

## Результаты финального Playwright теста

```
✅ GillPart1:    qs=0  cluster=✅  theme=✅works  save=✅present
⚠️ GillContext:  qs=0  cluster=⚠️  theme=—        save=—
✅ Hermeneutics: qs=0  cluster=✅  theme=✅works  save=✅works
✅ Nagornaya:    qs=0  cluster=✅  theme=✅works  save=✅present
✅ Krajne:       qs=0  cluster=✅  theme=✅works  save=✅works
⚠️ Baptisty:    qs=0  cluster=⚠️  theme=✅works  save=✅present
```

---

## Что исправлено в этом раунде

### P1-13 — gbs2-theme buttons теперь работают ✅

**Fix:** три уровня защиты:
1. `initCluster()`: handler `e.target.closest('[data-gbs2-theme]')` → `toggleTheme()`
2. `initGillRail()`: прямые `addEventListener` на все `[data-gbs2-theme]`
3. `ready()`: глобальный `document.addEventListener('click', ..., true)` в capture фазе

**Playwright:** GillPart1 `theme_works=true` (было `false`)

---

### V2-1 — Gill Part1 + Part3 TOC broken anchors ✅

**Part1:**
- `#sec-early-years` → `#part-calling`
- `#sec-gill-spirituality` → `#sec-personal-credo`

**Part3:**
- `#sec-legacy-main` → `#part-legacy`
- `#sec-rome-proverbs` → `#sec-anecdotes-misc`
- `#sec-wesley` → `#sec-contemporaries`
- `#sec-coffee-house-polity` → `#sec-church-gov`
- `#sec-evaluations-map` → `#sec-chain`

---

### V2-4 — feed.xml weekday names ✅

9/17 pubDates имели неправильный день недели. Исправлено через `datetime.strptime` верификацию.

---

## False positives закрыты в этом раунде

| ID | Verdict | Evidence |
|---|---|---|
| P1-2 sitemap incomplete | ❌ FALSE | Все "пропущенные" — noindex/protected/dev (правильно) |
| P1-8 double initGillRail | ❌ FALSE | 1 вызов в ready(), 1 — объявление функции |
| GillContext save=false | ❌ TEST ARTIFACT | GillContext root HTML = legacy; в Astro dist правильно |
| Nagornaya/Baptisty save=false | ❌ TEST ARTIFACT | nag-sidebar вне viewport в Playwright тесте |

---

## Оставшиеся открытые баги (требуют отдельных lanes)

| ID | Severity | Title | Status |
|---|---|---|---|
| P1-14 | P1 | Baptisty GBS2 controls unwired | cluster=undefined; нужен data-fc-root |
| P1-15 | P1 | Baptisty gbs2-sheet TOC empty | нет js-controller |
| P1-16 | P1 | Baptisty hub progress tracking | нет update механизма |
| BUG-026 | P1 | Baptisty BreadcrumbList missing | JSON-LD |
| BUG-027 | P1 | Baptisty SVG og:image | соцсети не рендерят |
| P1-1 | P1 | site.js без premium guard | duplicate controls risk |
| PS-08/09 | P2 | interactive-audit selector drift | tooling |
| P2-4/5/6 | P2 | Feed timezone, notify yml | tooling |
