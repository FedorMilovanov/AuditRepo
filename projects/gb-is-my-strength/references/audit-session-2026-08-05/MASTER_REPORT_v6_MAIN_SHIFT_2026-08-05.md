# МАСТЕР-ОТЧЁТ v6 — MAIN СДВИНУЛСЯ + НАГОРНАЯ-ИСКЛЮЧЕНИЕ + #61 FAVORITES ЗАКРЫТ

**Дата:** 2026-08-05 · **Source main:** `007c2d3c` → **`d0647b71`** (PR #1061) · **Ветка:** `arena/019fd2bb-auditrepo` (открыта)

---

## 1. ВАЖНО: main сдвинулся

При проверке обнаружено: `007c2d3c` → **`d0647b71`** = **PR #1061 «fix(reader): complete canonical Favorite Store replay»** (49 файлов, +1202/−345).

**Что это закрывает:** пункт 3 umbrella **#61** (favorites metadata/store) — добавлен `src/runtime/favorite-store.js` (339 строк) с version-гейтом `GBFavoriteStore`, `category`/`section` из route-metadata; `izbrannoe/index.astro` переписан (220 строк).

**Матрица AuditRepo НЕ обновлена** (последняя запись: «#61 open for ... favorites metadata/store scopes»). Нужна reverify-транзакция: пункт 3 #61 → source-closed PR #1061.

## 2. OWNER-РЕШЕНИЕ: Нагорная — исключение

**Зафиксировано (2026-08-05):** Нагорная — старые виды/движки НЕ рефакторить (муторно, на сайте есть информация). Контракт `nagornaya-mobile-bar` переведён в **LEGACY-APPROVED**:
- `requiredTokens` = только `nagornaya-page` (ядро)
- отсутствие `btoc-panel`/`btoc-link` — **ОЖИДАЕМО и РАЗРЕШЕНО**
- Это защита от агентов, которые решат «доделать» Нагорную
- NG-TOC-01/NG-STRUCT-01 остаются открытыми как **контентные**, НЕ движковые

**Результат:** nagornaya-mobile-bar теперь PASS 1/1 (было FAIL).

## 3. Контрактная система — 9 контрактов, прогон на `d0647b71`

| Контракт | Результат |
|---|---|
| gill-mobile-bar | PASS 3/3 |
| home-mobile-hero-hub | PASS 3/3 |
| home-sacred-scripture-bg | **FAIL 0/3** (#hScriptureBg нет) |
| karty-minimap | PASS 2/2 |
| nagornaya-mobile-bar | **PASS 1/1** (LEGACY-APPROVED) |
| search-command-palette-a11y | PASS 4/4 |
| baptist-3d-app | **FAIL 2/3** (app.css не внешний) |
| tts-lazy-chunk | PASS 3/3 |
| **favorite-store-canonical** | **PASS 3/3** (новый, #1061 подтверждён) |

**7 PASS / 2 FAIL** — два FAIL = home-sacred (фича мертва) + baptist-3d (не распакован).

## 4. Практический вывод для агентов

1. **main движется постоянно** — перед каждым reverify/контрактом проверять свежий HEAD (`git ls-remote origin main`).
2. **Нагорная — НЕ трогать движки** (owner exception). Контракт защищает.
3. **#61 пункт 3 (favorites) закрыт #1061** — нужен reverify в матрице.

## 5. Следующие шаги

1. Reverify-транзакция в матрице: #61 favorites → closed (source #1061).
2. Починить home-sacred (#hScriptureBg, 1 строка) → PASS.
3. baptist-3d: распаковать (app.css внешний).
4. quiz-memory удалить (мёртв, −6КБ).

---

*Документ — untracked; будет добавлен в ветку коммитом.*
