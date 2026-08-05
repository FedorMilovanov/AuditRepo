# MASTER-ОТЧЁТ v10 — SELF-AUDIT: AR-IDX-CSS-02 объект уточнён, Home/CI причины подтверждены

**Дата:** 2026-08-05 · **Source main:** `3a05a1e7` · **Ветка:** `arena/019fd2bb-auditrepo` (открыта)

---

## 1. AR-IDX-CSS-02 — объект УТОЧНЁН (важная докопка)

**Было в матрице/моих отчётах:** «`.home-v20{overflow-x:hidden}` клиппит `.h-scripture-bg` (фоновые цитаты)».

**Факт (проверено на 3a05a1e7):**
- `.h-scripture-bg` **отсутствует в Astro** (0 вхождений в src/) — это legacy-класс (index.html:155).
- Astro-реализация фраз — `h-ambient-*`: `HomePageChrome.astro:111` `<div class="home-v20">` → HomeHero → `HomeAmbientPhrases` → `h-ambient-native`.
- `h-ambient-native` стили (HomePageChromeStyles.astro:232): `left:50%; width:100vw; transform:translateX(-50%)` — **специально расширяется до 100vw**.
- `.home-v20{overflow-x:hidden}` (home.css) **реально клиппит** эти 100vw-фразы (на ширинах с вертикальным скроллбаром 100vw > контейнер).

**Уточнение причины:** клиппинг ЕСТЬ, но объект — **Astro `h-ambient-*` (100vw-фразы)**, а не legacy `h-scripture-bg`. Механика та же (overflow), объект другой. Рекомендация: обновить формулировку строки — «Astro-фразы `h-ambient-native` (width:100vw) обрезаются `overflow-x:hidden` на `.home-v20`».

## 2. Остальные Home/CI причины — подтверждены

| Строка | Проверка | Вердикт |
|---|---|---|
| AR-IDX-09 (⌘K без shiftKey) | оба keydown-обработчика без shift/alt | ✅ |
| D-1 (race deploy↔indexnow) | `pages` vs `metadata-indexnow-diagnostics-*` | ✅ |
| BUG-SEO-001 (нет ассерта 200/202) | continue-on-error + curl без проверки кода | ✅ |
| AR-IDX-CSS-03 (3s fallback reveal) | `h-reveal-fallback 0s 3s` в home.css | ✅ |
| AR-IDX-06 (reading-progress при enabled:false) | рендерится, флаг false | ✅ |

## 3. Итог self-audit (полный список уточнений за сессию)

| Строка | Уточнение |
|---|---|
| SEARCH-P2-07 | 45 уникальных книг (24+21, 0 пересечений), 21/66 не покрыто |
| NG-STRUCT-01 | SectionX=0 только chast-2/3/5 (chast-1/4 имеют) |
| MAP-P1-11 | константа W0=1900 vs renderedWidth (не «canvasWidth») |
| **AR-IDX-CSS-02** | объект = Astro `h-ambient-*` 100vw, не legacy `h-scripture-bg` |

**Ни одного неверного корня** — только уточнение объектов/формулировок для матрицы. Остальные ~15 перепроверенных причин верны.

---

*Документ — untracked; будет добавлен в ветку коммитом.*
