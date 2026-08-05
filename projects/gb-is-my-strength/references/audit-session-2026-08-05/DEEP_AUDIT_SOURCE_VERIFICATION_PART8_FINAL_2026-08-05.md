# Глубокая source-верификация gb-is-my-strength — Часть 8 (security, refactoring, остатки — финал)

**Дата:** 2026-08-05 · **Проверено на:** `main@4ce39dc816727c43373491acfb5bad0916cde113`
**Серия:** Части 1–7 + эта. Заключительная проверка оставшихся кластеров.

---

## 1. Новые проверки

| ID | Evidence | Вердикт |
|---|---|---|
| **SEARCH-P1-01** (расширено) | `/map/index.astro` и `/konfessii/russkij-baptizm/index.astro` — **0** упоминаний GBSearch/command-palette/cp-backdrop (в дополнение к /karty/avraam, /karty/ishod) | 🔴 подтверждён для всех 4 роутов |
| **R-003** (нет source maps) | `astro.config.mjs` — нет `sourcemap`-настройки (только mdx/sitemap/react) | 🔴 подтверждён |
| **R-004** (нет type=module) | `type="module"` в Astro-компонентах не найден (классические script include) | 🔴 подтверждён |
| **D-22 / HOME-FAVORITES-HREF** (закрыт) | `site.js` startViewTransition guard: `n.startsWith("javascript:")` блокируется + same-origin check `new URL(e,location.href).origin===location.origin` — фикс на месте | ✅ закрытая строка подтверждена |
| **FAV-POISON-STORAGE** | `highlights.js`: `JSON.parse(localStorage.getItem("gb-highlights-v1"))` в try/catch, `gbDedupeHighlights`, `slice(0,200)` cap, quota-fallback `slice(0,50)` | ✅ защита от poison на месте (строка закрыта корректно) |
| **QUIZ-OPTION-INNERHTML** | quiz-рендер (`enhancements.js`): dataset/classList/aria, без innerHTML-вставки опций из данных | 🟢 не воспроизводится (закрыта или устарела — сверка со статусом) |
| **TTS / D-23** (закрыт) | `floating-cluster-controller.js`: `warmVoskInBackground({manual,retry})` + комментарии «Web Speech стартует сразу, Vosk греется в фоне» — фикс на месте (10 упоминаний resolveTtsEngine/warmVosk) | ✅ закрытая строка подтверждена |

## 2. Финальная сводка по ВСЕМ 145 открытым строкам (Части 1–8)

| Категория | Кол-во | Комментарий |
|---|---|---|
| 🔴 Подтверждено на `4ce39dc8` | **~77** | Живые дефекты с evidence (полный список — части 1–8) |
| 🟢 Кандидаты на закрытие/сужение | **~22** | Код уже лучше; reverify снимет ~12 строк |
| 🟡 Browser-класс (Playwright) | **~33** | Туры, перекрытия, viewport, a11y-взаимодействия, OG/LCP |
| 🟡 Owner/live/данные | **~13** | REG-001, GENESIS6, live-проверки, часть P3 |
| ⚠️ Усилены (хуже, чем в матрице) | **~9** | AR-IDX-05, D-19, 49 воркфлоу, бюджеты, anchors/glyphs 0/0, 366/31, D-4 |

**Проверяемость:** кодом покрыто ~112 из 145 строк (77 подтверждены + 22 кандидата + 13 owner/live). Оставшиеся ~33 — browser-класс (принципиально не проверяются grep'ом).

## 3. Точный «чек-лист закрытых» — подтверждено кодом (итого ~13 спот-чеков)

D-21 (0 innerHTML), SEARCH-P2-08 (verses.json удалён), NG-DARK-01 (134 !important), TTS-DL-NO-TABLOCK (SharedWorker), NF-SPEEDSLOT (0 копий), HUB-AUDIT-COUNT-DRIFT (инвентарь), AR-IDX-01 (hreflang), SEARCH-P2-09 (SearchAction), ReaderProjection (workflow+маркеры), NEW-65 (baptisty parity), CI-INDEXNOW-CHECKER-STALE (contents:read), D-22 (href-guard), D-23 (warmVosk) — **все на месте.**

## 4. Итог

**«Закрыто всё?» — НЕТ.** Точная картина на 2026-08-05, `main@4ce39dc8`:

- **~77 открытых строк — реальные дефекты**, воспроизводятся в коде (Karty ~35, Home ~12, Nagornaya ~10, Search ~9, CI/системные ~8, прочее ~3).
- **~22 — кандидаты на закрытие** (код уже исправлен/устарел): reverify-пакет даст ~12 чистых закрытий без правок продукта.
- **~33 — browser-класс**: нужен Playwright exact-HEAD (SD-7-лейн) — Karty-туры/перекрытия/viewport, OG/LCP, WebKit-TOC.
- **~13 — owner/live/данные**: REG-001 (решение), GENESIS6 (права), live-проверки извне песочницы.
- **~9 — недооценены в матрице**: поднять severity/цифры.

### Приоритеты владельцу (без изменений, но теперь с полным evidence)
1. **P0** — AR-IDX-05: кэш-баст мёртв (`SITE_CONFIG.version=1778943682` с 14.07; runtime-CSS не обновятся у пользователей). Один PR.
2. **P1** — reverify-пакет ~22 кандидатов (12 закрытий, 0 правок).
3. **P2** — Karty browser-reverify (SD-7): ~33 строки.
4. **P3** — обновить цифры матрицы (бюджеты 664/590КБ, воркфлоу 49, anchors/glyphs 0/0), D-19 пересмотреть, live-проверки.

*Документ — untracked в AuditRepo; коммиты/пуши не выполнялись. Серия: DEEP_AUDIT_SOURCE_VERIFICATION{,PART2..PART8}_2026-08-05.md — 9 файлов.*
