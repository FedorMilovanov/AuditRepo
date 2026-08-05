# МАСТЕР-ОТЧЁТ: 50+ ПРОВЕРОК + КОНТРАКТНАЯ СИСТЕМА «РЕФЕРЕНС → 1:1»

**Дата:** 2026-08-05 · **Source main:** `007c2d3c` · **AuditRepo:** ветка `arena/019fd2bb-auditrepo`
**Статус:** ветка открыта (НЕ закрывается), отчёт-ветка запушена

---

## 0. Что это

Консолидация ВСЕХ наших находок за сессию: 18 отчётов + 50+ проверок/углублений + внедрение контрактной системы «машиночитаемый референс». Документ — единая точка входа; детали — в приложенных файлах.

---

## 1. КОНТРАКТНАЯ СИСТЕМА «РЕФЕРЕНС → 1:1» (внедряется)

### 1.1. Проблема (доказана)
- Gill: legacy 97–129 классов на часть, Astro 151, **пересечение ~34 (25%)** — Astro переписывает разметку, не переносит.
- `#hScriptureBg` — JS/CSS живы, разметки нет → фича мертва молча.
- `h-mobile-dock` (13 классов) — CSS есть, разметки нет.
- Паттерн «нашёл на Gill — забыл на Hermenevtika» (`5c626ea3`).

### 1.2. Решение (3 артефакта)

**A. `docs/design-references/current/`** — агент сохраняет свой мокап (1:1, из чата) ДО внедрения.

**B. `contracts/<feature>.json`** — чек-лист, который агент сам выписывает из СВОЕГО мокапа:
```json
{
  "id": "gill-mobile-bar",
  "source": "docs/design-references/current/gill-mobile-bar.html",
  "requiredTokens": ["data-gill-v16", "__label", "toc-part-item", "mobile-toc-btn"],
  "requiredOrder": ["toc-sheet__handle", "toc-sheet__head", "toc-sheet__list"],
  "forbiddenTokens": ["hm-", "gbs2-"],
  "routes": ["gill-part-1", "gill-part-2", "gill-part-3", "gill-part-4", "hermenevtika"]
}
```
*Контракт не «пустой» и не «загружается»: его создаёт агент в момент старта, наполняя классами из своего же мокапа.*

**C. `scripts/diff-canonical.mjs`** — сверяет реализацию с контрактом:
```
PRESENT 9/12 · MISSING 3 · NEW 5 · VERDICT FAIL/PASS
```

### 1.3. Правило в `AGENTS.md` (одноразово, затем работает само)
```md
## Visual contracts
1. UI-задача «как в референсе»: сначала сохрани мокап в docs/design-references/current/<feature>.html (1:1).
2. Создай contracts/<feature>.json (requiredTokens/order/forbidden/routes) из СВОЕГО мокапа.
3. Внедряй по контракту, не по памяти. Новые классы без «ок» владельца — запрещены.
4. Перед PR: node scripts/diff-canonical.mjs --route <route> → отчёт.
5. Не получается 1:1 — ОСТАНОВИСЬ и спроси, не изобретай.
```

### 1.4. Почему это лечит «вдохновение»
| Схема | Судья | Результат |
|---|---|---|
| Правила + референс | понимание агента (ненадёжно) | «иначе» неизбежно |
| Контракт + diff | детерминированная проверка | «иначе» = красный PR |

---

## 2. СВОДНАЯ ТАБЛИЦА ВСЕХ НАХОДОК (50+ проверок)

### 2.1. Подтверждённые открытые строки (по коду `007c2d3c`) — ~77

**Karty/MapEngine (19):** MAP-P1-20 (unversioned map-engine.js), MAP-P1-11 (cfg.W0/view.w), MAP-P1-12 (compass 50,80), ENGINE-P1-29 (dblclick 450), RIVER-P1-01 (scale=7), RIVER-P1-02 (def в _engine), MINI-P1-01 (minimap без гео), TEXT-P1-01 (len*0.6), REG-P1-01 (0 regions), QUAL-P1-05 (5 non-passive), QUAL-P1-06 (24-25 таймеров), SIG-P1-01 (x-74), DRAW-P1-01 (ly+=12), LOD-P1-01 (stroke 2.6), PERF-P1-01 (dur=14s), QUAL-P2-04 (renderMarkers wipe), ENGINE-P2-04 (toast), UI-P1-01 (me-search abs), ENGINE-P2-03 (600ms)

**Karty data/sheet (15):** KARTY-DATA-P1-01 (anchors/leaders=0 ×11), GLYPH-P1-01 (glyphs=0 ×11), QUAL-P1-08 (og stub ×9), QUAL-P1-03 (330 ASCII), QUAL-P2-02 (nachalo), ORN/GRAT/SEA/HALO/ROUTE/RELIEF, SVG-P1-01 (nbsp), MEDIA-P1-01 (226 wikimedia), MAP-P2-02 (preload), MAP-P1-10 (ishod no geo), ARCH-P1-01

**Search (4):** SEARCH-P1-01 (4 роута без палитры), SEARCH-P2-07 (45/66 книг), SEARCH-P3-01 (⌘K), SEARCH-P3-02 (caps)

**Home (12):** AR-IDX-03/04/05/06/07/09/10, AR-IDX-JS-01/02, AR-IDX-CSS-02/03, AR-IDX-A11Y-01

**Nagornaya (9):** NG-INLINE-01, NG-TOC-01, NG-STRUCT-01 (SectionX), NG-CROSS-01, NG-SERIYA-01, NG-DEAD-01 (7/7), NG-SEO-01, NG-VIS-10, NG-A11Y-01 (49 emoji)

**CI/D/системные (18):** CI-WORKFLOW-PROLIFERATION (50), D-1, D-2, D-4, D-7, D-19 (обе), BUG-SEO-001, BUG-011, BUG-PERF-001 (368/31), S-SEC-01, GENEALOGY-ATLAS, GENESIS6, ATLAS-D-NAMESPACE, AUDIT-JS-ESCAPER-DUP-X5 (5 копий), AUDIT-CSS-GBFLOATER (83 @media), R-001/003/004, Speakable (109), NF-DEAD-ENHANCE-SHIM, NF-GATE-IZ5-STALE (×4), NF-STRANGLER-BAR-DRIFT, NEW-HARDTEXTS-CSP, NEW-SAVE-QUOTE

### 2.2. Кандидаты на ЗАКРЫТИЕ (код уже лучше) — ~22
STRANGLER-HYGIENE, ENGINE-P1-27, MAP-P1-06, AR-IDX-10, QUAL-P1-09, BASE-P1-03, MAP-P1-13, DATA-P1-04, AR-IDX-PERF-01/02, NG-SEO-01 (часть), AUDIT-CSS-DEAD-KEYFRAMES (43 все используются), SEARCH-P2-10/11/12 (закрыты PR #1039), RIVER-P1-02 (сужен), S-SEC-01 (safeUrl), GATE-MARKER-DATA-DRIFT (сузить), NEW-CANONICAL-IZBRANNOE, PC-CURRENT-03, AR-IDX-08, NEW-HIGHLIGHTS (не менять)

### 2.3. Хуже записи (недооценено) — 9
AR-IDX-05 (3 версии SITE_CONFIG.version), CI-WORKFLOW-PROLIFERATION (50), NEW-CSS-BUDGET-01 (CSS 664КБ), D-3 (JS 590КБ), KARTY-DATA-P1-01 (0/0), GLYPH-P1-01 (0/0), BUG-PERF-001 (368/31), D-19 (обе), D-4

### 2.4. Browser-класс (нужен Playwright) — ~33
MAP-P1-01..05, 07..09, 18, 19; AVRAAM-P1-01..05; ENGINE-P1-26; HUB-P2-01; NEW-72; AUDIT-P3-OG-LCP; CI-WEBKIT-TOC; и др.

---

## 3. АНАЛИЗ «ТУПНЯКОВ» (по истории, 1611 коммитов)

| Паттерн | Кол-во | Пример |
|---|---|---|
| revert «accidental» | 8 | `revert: remove accidental empty probe file` |
| probe/placeholder | 33 | `accidental A13 placeholder`, `accidental projection placeholder` |
| hotfix/unblock | 18 | `hotfix: unblock deploy — mobile-play smoke stale` |
| «нашёл на одной, забыл на другой» | паттерн | `5c626ea3` Hermenevtika ↔ Gill |
| суперседы (двойная работа) | 5+ | #680→#758, #306→#308, #309/#310→#311, #963/#965→#970 |
| stale-гейты | 15+ | NF-GATE-IZ5-STALE, «Часть 1 из 5» ×4 |

**Корневая причина:** референсы не машиночитаемы → агенты «вдохновляются» → каскад.

---

## 4. ЗОЛОТЫЕ РЕШЕНИЯ (не «ещё тесты», а устранение классов ошибок)

1. **diff-canonical** (референс→контракт→проверка) — решает «вдохновение».
2. **SITE_CONFIG.version → 1 генератор** — лечит кэш-баг (3 значения→1).
3. **dead-surface-scan** — ловит «фичу убили молча» (#hScriptureBg, h-mobile-dock).
4. **AST-проекции** (HTML/SSML/search из одного MDX-AST) — TTS не читает DOM.
5. **Мини-FSM для плеера** — 17 setTimeout → детерминированные переходы.
6. **ci-routes.json маршрутизатор** — 49 workflow → 1 + JSON.
7. **Структурный снимок главной** — ловит «секцию выкинули».
8. **Content-parity по семействам** — 5 частей Гилла + Герменевтика одним прогоном.
9. **Commit-contract «нет accidental»** — блокирует probe/placeholder в main.
10. **NF-GATE-IZ5 → data-driven** — маркер из series.json, не хардкод.

---

## 5. ИНТЕРНЕТ-ПРОБЕГИ (5 тем, с источниками в деталях)

- Cache-busting + `immutable` (MDN) → лечит AR-IDX-05.
- Merge queue + `merge_group` (Mergify) → порядок в параллельной работе.
- dorny/paths-filter (GitHub community) → skip no-op jobs.
- axe-core no-new-violations (qaskills/oneuptime 2026) → a11y без сотен тестов.
- Crawl budget: точный lastmod (w3era/Google) → SEO.
- Knip dead-code (repowise) → NG-DEAD-01-класс.

---

## 6. СТАТУС ВЕТКИ

- Ветка: `arena/019fd2bb-auditrepo` (открыта, НЕ закрывается).
- Содержит: 18 отчётов + этот мастер-отчёт + (внедрение контрактной системы в docs/).
- Отставание от origin/main: 1 коммит (TLP W3) — не влияет на отчёты.
- **Пушить: да. Закрывать: нет.**

## 7. ПРИЛОЖЕНИЯ (файлы в этой ветке)

| Файл | Содержимое |
|---|---|
| AUDIT_REPORT_2026-08-05_gb-is-my-strength.md | тотальный аудит (первый) |
| DEEP_AUDIT_SOURCE_VERIFICATION{,_PART2..8}.md | 8 частей source-верификации |
| REVERIFICATION_PASS{,_2}_2026-08-05_007c2d3c.md | 2 полных ре-прогона |
| MASTER_VERIFICATION_2026-08-05.md | единая таблица ID→статус |
| VERIFICATION_AGENTS_A01-A17_2026-08-05.md | волна 17 агентов |
| VERIFICATION_MARATHON_BATCH_2026-08-05.md | марафон + zero backlog |
| AUDIT_BIG_MD_2026-08-05.md | аудит большого MD (gist) |
| AUDIT_TUPNYAKI_I_ZOLOTO_2026-08-05.md | таксономия тупняков + 30+ мер |
| AUDIT_VDOHNOVENIE_VS_1TO1_2026-08-05.md | доказательство «вдохновения» |
| GOLD_SOLUTIONS_LEVEL2_2026-08-05.md | 6 золотых решений |
| REFERENSY_MASHINOCHITAEMYE_2026-08-05.md | как референсы становятся машиночитаемыми |

*Документ — untracked до коммита; будет запушен в `arena/019fd2bb-auditrepo`.*
