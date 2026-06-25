# Верификация PS-* багов из incoming/arena-agent — 2026-06-25

**Агент:** Arena Agent TOC  
**Метод:** static source scan, git history analysis  
**Проверяемые баги:** PS-01..PS-10 из `premium-surface-bug-matrix-2026-06-25.md`  
**HEAD commit на момент проверки:** `4d4fbfc` (main)

---

## PS-01 — `qs is not defined` crash в floating-cluster-controller.js

**Вердикт: NEEDS-REVERIFICATION (возможно FIXED)**

**Факты:**
- В ТЕКУЩЕМ HEAD контроллере (`js/floating-cluster-controller.js`, строка 32): `function qs(sel, root) { return (root || document).querySelector(sel); }` — определена нормально.
- Во ВСЕХ 12 проверенных git-версиях контроллера `qs()` определена внутри IIFE.
- Сash-bust hash `c78a4236` (который в Astro source HermenevtikaBody.astro) = commit `39bb2a27` = наш rebuild, в нём `qs()` тоже есть.
- Вероятная причина репорта: другой агент тестировал production-like dist на основе БОЛЕЕ РАННЕЙ версии кода (до rebuild), или тест поймал другую ошибку.

**Рекомендация:** Re-run Playwright test против HEAD dist перед помещением в verified.

---

## PS-02 / PS-03 — Dead theme/save controls (controller crash downstream)

**Вердикт: CONDITIONAL — зависит от PS-01**

Если PS-01 реально resolved, то PS-02/PS-03 тоже resolved.  
Если PS-01 воспроизводится на HEAD — то PS-02/PS-03 confirmed.

---

## PS-04 — Heart series: gb-ember без контроллера

**Вердикт: CONFIRMED (статический)**

**Факты:**
- `src/components/article-pilots/krajne/KrajneBody.astro`: `grep floating-cluster-controller` → **0**
- `src/components/article-pilots/rimlyanam7/Rimlyanam7Body.astro`: `grep floating-cluster-controller` → **0**
- `grep "gb-ember" src/components/article-pilots/krajne/KrajneBody.astro` → **1** (кнопка есть)
- Контроллер добавлен только в root HTML (`articles/krajne-li-isporcheno-serdce/index.html`) но НЕ в Astro source
- Astro dist построится из Astro source → контроллер в dist отсутствует

**Severity:** P0 — кнопки рендерятся, но клики не обрабатываются

---

## PS-05 — Hermenevtika stray "76e7365" tail garbage

**Вердикт: FALSE POSITIVE (или исправлено до HEAD)**

**Факты:**
- `grep "76e7365" articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html` → **0**
- `grep "76e7365" src/components/article-pilots/hermenevtika/HermenevtikaBody.astro` → **0**
- Замечание: хеш `676e7365` (=commit `564d6cc8`, первый scaffold) обрезанный — `76e7365` совпадает с хвостом. Вероятно баг существовал в dist собранном ДО нашего rebuild (commit `39bb2a27`).
- В текущем HEAD не воспроизводится.

---

## PS-06 — Hermenevtika: Pagefind readTime 35 vs visible 50

**Вердикт: CONFIRMED (статический + в HEAD)**

**Факты:**
```
src/components/article-pilots/hermenevtika/HermenevtikaBody.astro:
  <span data-pagefind-meta="readTime" hidden="">35</span>  ← в Astro source
  <span>⏱ 50 мин</span>  ← visible
```
- Root HTML тоже: `readTime=35`, visible `50 мин`
- Это drift между Pagefind index (35) и редакционным решением (50 мин)
- Pagefind будет неправильно показывать read time в результатах поиска

**Severity:** P1

---

## PS-07 — Duplicate IDs: gbsTheme, gbsSearch на Gill pages

**Вердикт: CONFIRMED (статический)**

**Факты:**
- `GillPart1PageChrome.astro` включает `<GillRailControls context="mobile" />` И `<GillRailControls context="rail" />`
- `GillRailControls.astro` строка 43: `id="gbsTheme"`, строка 66: `id="gbsSearch"`
- Оба вызова рендерят одинаковые IDs → duplicate IDs в DOM на всех 4 Gill-страницах (Part1, Part2, Part3, Spravochnik)
- `document.getElementById("gbsTheme")` вернёт только первый → click на второй не обрабатывается

**Severity:** P0 (контроллер инициализирует по `[data-fc-controls="gill-rail"]` — OK, но ID-конфликт ломает точечные операции)

---

## PS-08 / PS-09 — Interactive-audit selector drift

**Вердикт: CONFIRMED (статический)**

**PS-08** — `interactive-audit.js` не включает `#gbFcTheme`, `.gb-theme-toggle`, `#gbsTheme`:
```
grep "gbFcTheme\|gb-theme-toggle\|gbsTheme" scripts/interactive-audit.js → 0
```
**PS-09** — Gill context проверяется по старым GBS2 маркерам, хотя теперь v16 shell.

Severity: P2 (tooling drift, не production bug)

---

## PS-10 — Cache-bust drift: controller version mismatch

**Вердикт: CONFIRMED (статический)**

**Факты:**
```
HermenevtikaBody.astro (Astro source): floating-cluster-controller.js?v=c78a4236
Root HTML (legacy):                    floating-cluster-controller.js?v=35a91710
Actual MD5 of file:                    35a91710
```
- `c78a4236` = версия из commit `39bb2a27` (наш rebuild July 25)
- `35a91710` = актуальная версия (после `3c49f8f`, `798b8de`)
- При Astro build dist выдаёт `c78a4236` — пользователи получат старый контроллер из CDN/SW-кэша

**Severity:** S0 → фактически P1 (браузер получит устаревший файл при cache-bust переходе)

---

## Сводка вердиктов

| ID | Вердикт | Severity | Действие |
|---|---|---|---|
| PS-01 | needs-reverification | P0 | Re-run Playwright на HEAD dist |
| PS-02 | conditional on PS-01 | P0 | Depends |
| PS-03 | conditional on PS-01 | P0 | Depends |
| PS-04 | **confirmed** | P0 | Fix: add controller to Astro source |
| PS-05 | **false-positive** (HEAD) | — | Close / no action |
| PS-06 | **confirmed** | P1 | Fix: readTime 35→50 in Astro source |
| PS-07 | **confirmed** | P0 | Fix: remove static IDs from GillRailControls |
| PS-08 | **confirmed** | P2 | Fix: update interactive-audit selectors |
| PS-09 | **confirmed** | P2 | Fix: update Gill context audit expectations |
| PS-10 | **confirmed** | P1 | Fix: update hash in HermenevtikaBody.astro |
