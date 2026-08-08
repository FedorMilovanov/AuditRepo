# МАСТЕР-ОТЧЁТ v7 — КОРРЕКЦИЯ: home-sacred ЖИВ (не мёртв), #61 закрыт, Нагорная зафиксирована

**Дата:** 2026-08-05 · **Source:** `d0647b71` (#1061) · **Ветка:** `arena/019fd2bb-auditrepo` (открыта)

---

## 1. ВАЖНАЯ КОРРЕКЦИЯ: home-sacred-scripture-bg — ЖИВ, был ложный FAIL

**Ошибка контракта (исправлена):** предыдущий контракт искал `#hScriptureBg`/`h-phrase` — и находил 0. Но это **не значит «фича мертва»**: Astro-реализация переписана под классы **`h-ambient-*`** (`HomeAmbientPhrases.astro` + scoped-стили `HomePageChromeStyles.astro`).

**Реальная находка (не потеря фичи, а дрейф):**
- legacy CSS `.h-phrase*` (6 классов в `home.css`) — **МЁРТВ** (Astro не использует);
- Astro-реализация `h-ambient-*` — жива и стилизована;
- **двойной нейминг** = дрейф: старый CSS надо удалить (или зафиксировать как удалённый).

**Урок:** контракт-система поймала собственную ошибку (ложный FAIL) — это её ценность: она заставила проверить реальную реализацию, а не верить первому grep.

## 2. #61 пункт 3 — ЗАКРЫТ (PR #1061)

Проверено: `favorite-store.js` имеет `SCHEMA_VERSION=1`, `routeId`/`category`/`section` из route-metadata, `GBFavoriteStore` version-gate; `izbrannoe/index.astro` переписан. **NEXT_AGENT_PROMPT обновлён** (Single-Writer): #61 остаётся только по пунктам 1-2 (AT-экспозиция speed/search, radiogroup roving).

## 3. Нагорная — LEGACY-APPROVED (owner-exception)

Твоё решение «не рефакторить движки Нагорной» зафиксировано в контракте: requiredTokens = только `nagornaya-page`, отсутствие `btoc-*` — ожидаемо. **PASS 1/1.**

## 4. Контрактная система — 9 контрактов, итог на `d0647b71`

| Контракт | Результат |
|---|---|
| gill-mobile-bar | PASS 3/3 |
| home-mobile-hero-hub | PASS 3/3 |
| home-sacred-scripture-bg | **PASS 2/2** (коррекция: жив как h-ambient-*) |
| karty-minimap | PASS 2/2 |
| nagornaya-mobile-bar | PASS 1/1 (LEGACY-APPROVED) |
| search-command-palette-a11y | PASS 4/4 |
| tts-lazy-chunk | PASS 3/3 |
| favorite-store-canonical | PASS 3/3 (новый) |
| **baptist-3d-app** | **FAIL 2/3** (app.css не внешний) |

**8 PASS / 1 FAIL** — единственный реальный FAIL: baptist-3d (2.25MiB не распакован).

## 5. Реальные вещи (не мелочь)

1. **#61 пункт 3 закрыт** — handoff обновлён, reverify в матрице нужен.
2. **home-sacred**: не «починить», а **удалить мёртвый `.h-phrase*` из home.css** (6 классов) — реальная разгрузка CSS.
3. **baptist-3d**: распаковать index.html (app.css внешний) — реальная разгрузка 2.25MiB.
4. **quiz-memory**: мёртв (маркер нигде) — удалить из site.js (−6КБ).

## 6. Следующие шаги (только реальное)

1. Reverify #1061 в матрице (пункт 3 #61 → closed).
2. Удалить мёртвый `.h-phrase*` из home.css.
3. Удалить `quiz-memory` из site.js.
4. baptist-3d: распаковать.

---

*Документ — untracked; будет добавлен в ветку коммитом.*
