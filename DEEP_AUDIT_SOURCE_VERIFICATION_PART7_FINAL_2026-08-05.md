# Глубокая source-верификация gb-is-my-strength — Часть 7 (ФИНАЛ: консолидированный статус)

**Дата:** 2026-08-05 · **Проверено на:** `main@4ce39dc816727c43373491acfb5bad0916cde113`
**Серия:** Части 1–6 + эта. **Итоговый документ всей серии.**

---

## 1. Новые проверки этой части

| ID | Evidence | Вердикт |
|---|---|---|
| **GENEALOGY-ATLAS-V1-SHIPPED-NOT-PROD** | `data/genealogy/v2/build/atlas-interactive.html` **есть в main** (в `data/`, которое в NEVER_COPY_DIRS → в dist не попадает) | 🔴 подтверждён: «в main, не на проде» — delivery risk жив (нужна live-проверка из-вне песочницы) |
| **NF-STRANGLER-BAR-DRIFT** | `articles/dzhon-gill-chast-1-chelovek/index.html`: `data-gill-v16` ×2 + **`id="mobTocBtn"`** ×1 (старый 1-уровневый бар), `partTocOverlay`/`seriesTocOverlay`; `__label` = 0 | 🔴 подтверждён: legacy Gill-бар дрейфует (mobTocBtn без __label) |
| **NEW-CANONICAL-IZBRANNOE-01-GAP** | `canonicalSanityGuard` (`audit-pro.js:1885+`) проверяет canonical на `https://gospod-bog.ru/…` по всем html; G31 проверяет «noindex не в sitemap». Отдельного «relative canonical на noindex-роутах» — не видно | 🟡 частично: guard расширен (canonical-абсолютность + G31), но «noindex-роут с relative canonical» не ловится явно — сузить формулировку |
| **AR-IDX-JS-01** | `pagehide` в **5 файлах**: `reader-state.js`, `scroll-perf.js`, `site-utils.js`, `site.js`, `sw-register.js` (всего 8 вхождений) | 🔴 подтверждён (Mobile Safari не шлёт pagehide при background) |
| **AUDIT-CSS-DEAD-KEYFRAMES-TOKENS** | 43 `@keyframes` в css/*.css — **все используются** (0 мёртвых на CSS-уровне); токены `--z-*` определены (D-4-заметка) | 🟢 сузить/закрыть: keyframes-половина не воспроизводится; остаётся токен-часть (если есть) |
| **REG-001** | hosting-заголовки: live из песочницы недоступен (сетевой фильтр), но GitHub Pages не отдаёт response-level CSP/XFO/Referrer-Policy — по-прежнему owner-решение | 🟡 открыт (owner-decision) |
| **AUDIT-P3-OG-LCP-MISMATCH** | 4 роута og:image≠LCP — LCP требует browser | 🟡 browser-класс |

## 2. Live-проверка — НЕВОЗМОЖНА из песочницы

`curl https://gospod-bog.ru/` → `SSL_ERROR_SYSCALL` (и http → `Empty reply`). IP резолвится на GitHub Pages (185.199.108.153), но исходящие соединения к хосту блокируются средой. **Вывод:** live-свидетельства (актуальный production SHA, live-заголовки, atlas на проде) требуют проверки извне — пометил соответствующие строки как «live pending».

## 3. Итоговый консолидированный статус всех 145 открытых строк

| Категория | Кол-во | Что это |
|---|---|---|
| 🔴 **Подтверждено на `4ce39dc8`** | **~75** | Живые дефекты, воспроизводятся в коде (полный список evidence — в частях 1–7) |
| 🟢 **Кандидаты на закрытие/сужение** | **~22** | Код уже лучше заявленного; нужен формальный reverify: STRANGLER-HYGIENE, ENGINE-P1-27, MAP-P1-06, AR-IDX-10, QUAL-P1-09, BASE-P1-03, MAP-P1-13, AR-IDX-PERF-01/02, NG-SEO-01(часть), DATA-P1-04, AUDIT-CSS-DEAD-KEYFRAMES-TOKENS, RIVER-P1-02, S-SEC-01(часть), MAP-P1-18, NG-A11Y-01, SEARCH-MANIFEST-QUALITY, PC-CURRENT-03, AR-IDX-08, GATE-MARKER-DATA-DRIFT(сузить), NEW-CANONICAL-IZBRANNOE(сузить), NEW-HIGHLIGHTS(не менять) |
| 🟡 **Browser-класс** | **~35** | Нужен Playwright exact-HEAD (туры, перекрытия, viewport, a11y-взаимодействия, OG/LCP) |
| 🟡 **Owner/live/данные** | **~13** | REG-001 (решение), GENESIS6 (права), GENEALOGY-ATLAS (live), AVRAAM-P1-*, часть P3-полиш |
| ⚠️ **Усилены (хуже, чем в матрице)** | **~9** | AR-IDX-05 (кэш-баст мёртв, runtime-CSS), D-19 (обе половины), CI-WORKFLOW-PROLIFERATION (49), NEW-CSS-BUDGET-01 (~664КБ), D-3 (~590КБ), KARTY-DATA-P1-01 (0/11), GLYPH-P1-01 (0/11), BUG-PERF-001 (366/31), D-4 (магик z-index жив) |

### Точные цифры бюджета (для обновления матрицы)
- Core CSS: site.css **314 302** + floating-cluster.css **236 873** + home.css **113 458** ≈ **664 КБ** vs `MAX_CSS_TOTAL=425_000` (audit-pro.js:99) → **+56%**
- JS: все js/*.js ≈ **590 КБ** vs `MAX_JS_TOTAL=365_000` (audit-pro.js:100) → **+62%**
- Workflows: **49** файлов в `.github/workflows/` (матрица: «~26», session log: «42»)
- `SITE_CONFIG.version`: **`1778943682`** (заморожен с 14.07; cache-buster для `enhancements-runtime.css`, `highlights-runtime.css`)

## 4. Что делать дальше (приоритезированный план)

### P0 — исправить (1 PR в source)
1. **AR-IDX-05**: поднять `SITE_CONFIG.version` или заменить на детерминированный build-id (W2). Разблокирует кэш-баст runtime-CSS. Это единственная строка, которая «молча ломает будущие релизы».

### P1 — reverify-пакет в AuditRepo (~22 строки → ~12 закрытий, 0 правок продукта)
Оформить по формату проекта `reverify/CURRENT_HEAD_REVERIFY_<date>_<sha>.md` с exact-HEAD evidence по списку 🟢. Ожидаемый эффект: открытые 145 → ~133.

### P2 — Karty-кластер (SD-7)
Батчевый Playwright exact-HEAD reverify по ~35 browser-строкам. Witness'ы `c2c339708252`/`32ae0d7d` устарели на 638+ коммитов. Ожидаемый эффект: часть строк закроется/сузится, остальное получит свежие witness'ы.

### P3 — гигиена и данные
- Обновить цифры в матрице (бюджеты, воркфлоу, anchors/glyphs 0/0).
- D-19: пересмотреть статус (обе половины открыты).
- CI-WORKFLOW-PROLIFERATION: capability inventory (A14/W1).
- Live-проверки (atlas, production SHA, заголовки) — с машины вне песочницы.

## 5. Прямой ответ

**«Закрыто всё?» — нет.** По результатам source-верификации ~75 из 145 открытых строк подтверждены как живые дефекты на текущем main; ~22 — кандидаты на закрытие (код уже лучше); ~35 требуют browser-свидетеля; ~9 строк в матрице недооценены (хуже, чем записано).

*Документ — untracked в AuditRepo; коммиты/пуши не выполнялись. Полная серия: DEEP_AUDIT_SOURCE_VERIFICATION_{,PART2..PART7}_2026-08-05.md.*
