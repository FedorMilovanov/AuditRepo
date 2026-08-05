# АУДИТ «ТУПНЯКОВ» И 30+ ЗОЛОТЫХ МЕР РАЗГРУЗКИ — gb-is-my-strength

**Дата:** 2026-08-05 · **Source main:** `007c2d3c` (PR #1039) · **История:** 1611 коммитов с 01.07
**Метод:** полный git-log-анализ паттернов + сравнение legacy↔Astro главной + owner-референсы + 5 веб-пробегов (cache-busting, CI, a11y, SEO, dead-code).

---

# ЧАСТЬ 1. Таксономия «тупняков» агентов (по истории коммитов)

## 1.1. Revert'ы и «accidental» мусор в main — 8 revert + 33 probe/placeholder-коммита

```
65ae0a74 revert: remove accidental empty probe file
75e2232d revert accidental direct-main placeholder
75c49df9 revert: remove accidental A13 placeholder
e317425b revert: remove accidental projection placeholder
b845568e revert: remove accidental archaeology lane marker
4ec0f288 revert(home): remove direct-main route contract
49ccccad revert(home): restore branch publication boundary
```

**Паттерн «вируса»:** агенты пишут пробные файлы/заглушки прямо в main (или пушат в main минуя PR), потом revert'ят. Каждый revert = лишняя транзакция, дрейф HEAD, риск конфликтов у параллельных агентов. Это **прямо вредит** твоему сценарию «main едет вперёд другими агентами».

## 1.2. Hotfix-цепочки блокировки деплоя — 18 коммитов «hotfix/unblock/blocker»

```
7a410be9 hotfix: unblock deploy — mobile-play smoke stale for Часть IV (#69)
1491fbb2 hotfix: unblock deploy — Gill rail CSS scope-leak false-positive (#68)
4d9a63f7 [LANE lane/deploy-blocker-fixes] fix: устранены 3 блокера красного деплоя
41f78f43 fix(ci): retrigger readiness for script-only deploy fixes (#119)
```

**Корневой пример (твой любимый):** PR #67 (Часть IV Гилла) уронил прод-деплой → #68 hotfix (scope-leak гейт не распознавал `.gbs2-world[data-gill-v16]`) → #69 (мобильный smoke ждал «Часть 1 из 5», а стало «из 3»). **Два разных ложных гейта, оба про один и тот же контент.** Это ровно «костыль вместо точного переноса»: гейты писались под старую разметку, контент перенесли по-новому.

## 1.3. «Нашёл на одной странице — забыл на другой» — 5c626ea3

```
5c626ea3 Strict re-audit of Hermenevtika mobile bar against its reference
          — found the same two bug classes already fixed on Gill
```

**Прямое подтверждение твоей претензии:** агент перенёс фикс на Gill, но не на Hermenevtika (две страницы одного движка). Потом «строгий повторный аудит» нашёл то же самое. Это паттерн «не 1:1 перенос» в чистом виде. **Противовирусная мера:** контент-паритетные чекеры должны работать по **семейству** роутов (все 5 частей Гилла + Герменевтика), а не по одной странице.

## 1.4. Merge-first, repair-later (PR #45→#46→#47→#48) и «fix-фикс»

```
4d23b523 fix(gill): smart top-bar auto-hide, seamless mobile bars (#73) — после #72
b9ccdcf8 fix(search): preflight autofix branch lifecycle
1b2979fd fix(search): tolerate closed autofix branches
```

Исторически PR #45–#48 — каждый чинил «unblocks deploy» после merge предыдущего. **Паттерн:** merge-без-полного-гейта → следующий PR чинит. Это создаёт каскад.

## 1.5. Суперседы и двойная работа — 5+ (плюс закрытые unmerged)

| Пара | Судьба | Стоимость |
|---|---|---|
| NoteRegistry #680 (146 файлов) | → #758 (14 файлов) + #785 | ~130 файлов выброшено |
| W1 Article-retirement #306 | → #308 (stale-base) | полная переделка |
| W2 #309/#310 (параллельные) | → #311 | оба закрыты без merge |
| Reader-аудит #963/#965 | → #970 | «base races, synthetic merge provenance» |
| TS7 #800 | closed unmerged | правильно (peer-несовместимость) |

**Урок:** параллельные агенты делают одну и ту же работу → двойной merge-конфликт, потом переделка. **Противовирусная мера:** lane-lock policy уже есть в AGENTS.md — но она не работает, когда агенты не читают активные PR (см. марафон-аудит: «#759 body говорит 9 файлов, а live 15» — агент не обновил описание, пока другой менял ветку).

## 1.6. Stale-гейты и hardcoded-маркеры — 15+ коммитов «stale»

```
d6f07ad2 fix(home): prevent stale keyboard navigation (#832)
248c0474 fix(audit): close stale runtime contracts (#529)
1bbebc2d ci: block stale asset revisions before merge (#109)
869558cd fix(deploy): reconcile stale asset revisions (#108)
```

+ живой сейчас **NF-GATE-IZ5-STALE**: «Часть 1 из 5» в 4 скриптах, прод рендерит «из 3» → гейт вакуумный, пропустит будущий miscount.

## 1.7. «Был фикс, не было строки» — KARTY-Q-BUG-P0

ReferenceError `q` крешила поиск на проде `/karty/ishod/`. В матрицу занесли **задним числом** («запись задним числом: был фикс, не было строки → дрейф»). Классика: фикс прилетел, canonical-запись не обновилась → следующий агент переоткрывает/путается.

---

# ЧАСТЬ 2. Редакция главной — «не 1:1 перенос» (доказательства в коде)

## 2.1. 78 h-классов потеряно при Astro-миграции (legacy 153 → Astro 129)

Сравнение `index.html` (legacy) vs `src/pages/index.astro` + `src/components/home/*`:

**Пропали целые секции:**
- **`h-mobile-dock` (13 вхождений в legacy) — 0 в Astro.** Мобильный нижний док (Home/dock кнопки) не перенесён вообще.
- **`h-scripture-bg` (1) — 0 в Astro.** Фоновые библейские фразы (греч./иврит/лат.) — фирменная фича. **CSS для неё есть, JS-генератор `.h-phrase` жив (enhancements.js ×2), но контейнер `#hScriptureBg` не перенесли → `if(!e) return` → фича молча мертва.** Это идеальный пример «костыля»: JS и CSS остались, разметка потеряна.
- **`h-mobile-hero-hub` (12) — 1** (урезано в ~10 раз)
- **`h-featured-*` (61) — 3** (featured-серии урезаны)
- **`h-planned-*` (6) — 2**
- **`h-tetra` (4) — 1** (3D-тетраэдр почти пропал)
- **`h-nav-fav` (1) — 0** (AR-IDX-04: «Избранное» потеряло класс)

**Новые в Astro: 54** (в основном токены: `--h-bg`, `--h-accent` — это нормально).

## 2.2. Следствия потерянных переносов = уже известные баги

| Потеря | Симптом | Строка |
|---|---|---|
| `h-scripture-bg` | CSS клиппит отсутствующий контейнер | AR-IDX-CSS-02 |
| `h-nav-fav` | навбар без класса фаворита | AR-IDX-04 |
| reading-progress | рендерится, но enabled:false | AR-IDX-06 |
| version | 3 разных значения SITE_CONFIG.version | AR-IDX-05 |

## 2.3. Вывод по главной

**Твоя претензия подтверждена кодом:** агенты при Astro-миграции главной не сделали 1:1 перенос — 78 классов/секций потеряно, часть фич умерла молча (JS/CSS остались, разметки нет), часть урезана в разы. Дальнейшие «доправки» поверх этого создают каскад (AR-IDX-* 04..10, CSS-хаки).

---

# ЧАСТЬ 3. Owner-референсы — точные переносы (проверено)

| Требование owner (из `_OWNER_DOWNLOADS/README.md` и `references/gb-ui-canon-2026-07-13/`) | Статус в коде `007c2d3c` |
|---|---|
| Герменевтика: позиция на ИСТОРИЧЕСКОМ расстоянии `right: max(8.5vw)` / моб `4.5vw` | ✅ `floating-cluster.css:86,93` — точно |
| Мобильный TOC: референсные топовые римские | ✅ статические `.toc-part-item` roman в v16 (`floating-cluster-controller.js:2170`), gill-polish коммиты `7a5a0abb`/`616b87cc` |
| Никаких мини-картинок в оглавлениях Гилла | ✅ 0 (не добавляли) |
| play-expand не трогать | ✅ жив (8 вхождений `playExpand/gb-ember-expand`) |
| Гилл — единый эталонный блок (gill-context) во всех частях | 🟡 **GillContext используется только на странице «Исторический контекст»** (`src/pages/articles/dzhon-gill-istoricheskiy-kontekst/`), части I–V используют `GillSeriesRail` — надо сверить с эталоном owner |

**Вывод:** большинство owner-референсов соблюдены точно. Но **сам факт, что их пришлось проверять вручную** (а не автоматом), — это дыра: следующий агент снова «вдохновится» вместо точного переноса.

---

# ЧАСТЬ 4. 30+ ЗОЛОТЫХ МЕР (реально полезно; не тесты-миллионы)

> Принцип отбора: (а) убирает целый класс ошибок, (б) не добавляет новый CI-тяжёлый тест, (в) прямой ответ на «тупняки» из Части 1.

## A. Подстраховка от «не 1:1 переноса» (твоя главная боль) — 8 мер

1. **🟢 GOLDEN-ДИФФ КЛАССОВ ГЛАВНОЙ (новое, 1 скрипт):** авто-чек «каждый `h-*` класс legacy index.html должен иметь эквивалент в Astro home или явное owner-разрешение». Прямо ловит 78-потерянный-класс класс ошибок. Запускать только на изменениях home.
2. **🟢 ВЕРНУТЬ `#hScriptureBg`** (1 строка в разметке home) — оживит мёртвую фичу: JS-генератор уже готов. Затем удалить из CSS мёртвые `h-mobile-dock*` селекторы (13 классов без разметки).
3. **🟢 CONTENT-PARITY ПО СЕМЕЙСТВАМ:** распространить существующий legacy↔Astro parity-чекер на **все 5 частей Гилла + Герменевтику + Нагорную 5 частей** одним массивом роутов (не по одной странице) — ловит паттерн «нашёл на Gill, забыл на Hermenevtika».
4. **🟢 MATRIX-SHA-GATE (есть в AR-001 hardening, закрепить):** «нельзя закрыть строку без SHA или governed disposition» — уже реализовано в AuditRepo валидаторе; сделать blocking в CI, чтобы KARTY-Q-BUG-P0 («фикс без строки») не повторялся.
5. **🟢 COMMIT-CONTRACT «нет accidental»:** pre-push/CI-чек, блокирующий пустые файлы, `probe`/`placeholder`/`temp`-имена в diff main — убивает 8 revert'ов/33 probe-коммита.
6. **🟢 FAMILY-ROUTE TEST LIST:** один JSON «семейство роутов → обязательные контракты», которым пользуются все browser-контракты; новый роут без family-записи = fail. Вместо разрастания отдельных гейтов.
7. **🟡 OWNER-REFERENCE REPO-ЧЕК:** автоматизировать 5 требований owner (Часть 3) как read-only гейт (8.5vw/4.5vw, roman TOC, no mini-img, play-expand, gill-context) — чтобы «точный перенос» проверялся машиной, а не владельцем.
8. **🟡 REVERIFY-QUEUE ПО ДВИЖЕНИЮ MAIN (AR-005):** вместо ручного «main уехал» — авто-постановка affected-строк в очередь reverify при смене SHA (без создания новых тестов).

## B. Разгрузка (удалить/консолидировать) — 12 мер

9. **🟢 SITE_CONFIG.version → один генератор:** 3 значения (1778943682×10 / 1781282355×11 / 20260802×2) → 1 build-id. Убирает целый класс кэш-багoв (AR-IDX-05).
10. **🟢 NF-GATE-IZ5-STALE:** маркер «Часть 1 из 5» в 4 скриптах → производный от series.json. Убирает вакуумный гейт.
11. **🟢 Дедуп эскейпера 5→1** (site.js `tt`×3 + search.js `F` + highlights.js `h`) — в SiteUtils. Убирает класс D-21-рассинхронов.
12. **🟢 Unconditional prefetch 5 разделов → intent-based** (hover/focus/⌘K) — `BaseLayout.astro:170`. Экономия сети на каждом чтении.
13. **🟢 Preload `route.json` на картах** (MAP-P2-02) — убрать двойной запрос.
14. **🟢 Speakable-разметка (109 файлов)** — ru неэлигибелен; убрать из PageHead одним PR (W8).
15. **🟢 3D app `_app/index.html` 2.25 MiB raw → внешние hashed JS/CSS** (цель <50 KiB) — без redesign, только распаковка.
16. **🟡 Atlas-export ~26 MiB (34% кандидата)** — owner-решение: либо direct-download контракт, либо вон из Pages. Вместе с Deploy/Asset Manifest (P0 мастер-плана).
17. **🟡 `copy-legacy-to-dist.js` blanket-copy → exact allowlist** (Deploy Manifest) — убирает случайные draft/lab в проде.
18. **🟡 `includeLegacyRuntime` boolean → route capabilities** — развязать analytics/search/pwa/reader/notes.
19. **🟡 `mobile-hotfix.css` → component owners** (retirement ledger) — hotfix-слой должен уменьшаться.
20. **🟡 `astro-cache-bust-postbuild.js` → сокращать ветки** (CSP→metadata→relations→notes→…) — цель: Vite hashing вместо ручного.
21. **🟡 Knip-прогон мёртвого JS/TS** (NG-DEAD-01 — 15 Astro-компонентов 0 импортов; `enhanceGillMobileBarMarkup` мёртв) — разовое сокращение, потом в CI как warning-only.

## C. Золото (добавить немного, эффект большой) — 10 мер

22. **🟢 Final-dist crawler** (broken links/images/фрагменты/redirects/случайные файлы) — по расписанию и на релиз; internal 0. Один скрипт заменяет десятки разрозненных проверок.
23. **🟢 axe-core «no new violations»** на 4 ключевых роута (home, статья, серия, карта) со snapshot-базой — ловит a11y-дрейф на каждом PR без сотен тестов. Взято из веб-практики 2026 (qaskills/oneuptime).
24. **🟢 `Cache-Control: immutable` для hashed assets** (MDN best practice) — GitHub Pages отдаёт; проверить заголовки для `?v=`-ресурсов.
25. **🟢 Sitemap `lastmod` от контентных дат, не build-time** (Google доверяет lastmod для ре-краула; из crawl-budget гайдов) — совпадает с мастер-планом RSS-правилом.
26. **🟢 publicPayloadDigest + no-op release skip** — не делать deploy/IndexNow при неизменных публичных байтах (мастер-план §7).
27. **🟢 Merge queue + ruleset для main** (Mergify/нативный) — требует аккуратности с paths-фильтрами и `merge_group` (из веба); убирает «main едет вперёд» хаос при параллельных агентах.
28. **🟢 dorny/paths-filter** для пропуска no-op job'ов (monorepo-практика) — вместо хардкод-триггеров.
29. **🟢 Check Catalog + CI timings/retries** (телефония: duration, passed-after-retry) — флаки не маскируются (Hermenevtika hover).
30. **🟢 Pagefind `metaCacheTag` для SW-оффлайна поиска** (из веба) — оффлайн-поиск без пересборки индекса.
31. **🟡 Responsive image pipeline** (srcset/sizes/width/height; eager только LCP) — P0 мастер-плана; снижает INP/LCP.
32. **🟡 Route-level fonts** (3 preloads по waterfall-evidence) — убрать unused preload warnings.
33. **🟡 Structured-data freshness** (lastmod в JSON-LD/Article) — из веб-практики SEO 2026.
34. **🟡 AI-триаж false positives в CI** (Semgrep/CodeRabbit-класс) — 40-60% шума в статике уходит (из веба) — не обязательно именно эти, но принцип.

## D. Топ-10 «золотых» по ROI (если делать только 10)

1. **Вернуть `#hScriptureBg`** (оживёт фича, 1 строка) + golden-diff классов главной (мера 1–2) — **лечит твою главную боль**.
2. **SITE_CONFIG.version → 1 генератор** (мера 9) — лечит класс кэш-багов.
3. **NF-GATE-IZ5-STALE → data-driven** (мера 10).
4. **Content-parity по семействам** (мера 3) — ловит «на одной странице забыли».
5. **Commit-contract «нет accidental»** (мера 5) — убирает revert-мусор.
6. **axe-core no-new-violations на 4 роута** (мера 23).
7. **Final-dist crawler** (мера 22).
8. **Merge queue + ruleset** (мера 27) — порядок в параллельной работе.
9. **3D app → внешние assets** (мера 15) — 2.25 MiB → <50 KiB.
10. **Intent-based prefetch** (мера 12).

---

# ЧАСТЬ 5. Интернет-фичи (пробеги, с источниками)

| # | Фича/практика | Источник | Применимость |
|---|---|---|---|
| 1 | Cache-busting + `immutable` (URL = cache key) | MDN Cache-Control | ✅ прямо лечит AR-IDX-05 |
| 2 | HTML `no-cache`, assets `max-age=31536000, immutable` | benedikt-sperl.de 2026 | ✅ для Pages |
| 3 | Нативный GitHub merge queue + `merge_group` | Mergify | ✅ мера 27 |
| 4 | dorny/paths-filter для skip no-op jobs | GitHub community #177835 | ✅ мера 28 |
| 5 | axe-core no-new-violations (snapshot baseline) | qaskills 2026 / oneuptime 2026 | ✅ мера 23 |
| 6 | A11y: lint+axe в CI, ключевые флоу, не тысячи правил | reddit r/QA 2026 | ✅ согласуется |
| 7 | Crawl budget: только canonical 200-статус в sitemap, точный lastmod | w3era/Google dev | ✅ мера 25 |
| 8 | Freshness signals (lastmod в HTML+structured) | digitalapplied 2026 | ✅ мера 33 |
| 9 | Knip (dead JS/TS: unused exports/files/deps) | repowise.dev 2026 | ✅ мера 21 |
| 10 | Astro build: NODE_OPTIONS memory, targets 20-40% bundle cut | markaicode 2025 | 🟡 build-time |
| 11 | Astro islands: JS только на интерактив (5KB vs 200KB) | note.com 2026 | 🟡 уже так |
| 12 | Pagefind metaCacheTag для SW-оффлайна | pagefind.app | ✅ мера 30 |

---

# ЧАСТЬ 6. Итог

**Твоя претензия «агенты не 1:1 переносят референсы, потом доправляют и не могут внести» — подтверждена:** 78 потерянных h-классов главной, мёртвая `h-scripture-bg` (JS/CSS есть, разметки нет), паттерн «нашёл на Gill — забыл на Hermenevtika», 8 revert'ов, 33 probe-коммита, 2 вакуумных гейта из-за неперенесённого контента, 5+ суперседов из-за параллельной двойной работы.

**Противовирусные меры — это НЕ новые тесты, а 8 лёгких подстраховок (Часть 4.A) + 12 разгрузок (4.B) + 10 золотых (4.C).** Первые три действия, которые реально остановят «вирус»:
1. golden-diff классов главной + вернуть `#hScriptureBg`;
2. `SITE_CONFIG.version` → один генератор;
3. commit-contract «нет accidental» в CI (убирает revert-мусор из main).

*Документ — untracked в AuditRepo; коммиты/пуши не выполнялись.*
