# Глубокая source-верификация gb-is-my-strength — Часть 4 (Karty-runtime, гигиена, перф)

**Дата:** 2026-08-05 · **Проверено на:** `main@4ce39dc816727c43373491acfb5bad0916cde113`
**Серия:** Части 1–3 (см. файлы) + эта Часть 4.

---

## 1. ✅ Подтверждены на текущем main (14)

| ID | Evidence | Вердикт |
|---|---|---|
| **UI-P1-01** | `.me-search{position:absolute;top:8px;right:112px;…}` — абсолютный поверх карты (в матрице right:48px, сейчас 112px — суть та же, цифру обновить) | 🔴 подтверждён |
| **ENGINE-P2-03** | `_tm(()=>{loadingEl.style.opacity='0';…},600)` — 600мс задержка скрытия лоадера | 🔴 подтверждён (уточнение: не «данные», а сам лоадер) |
| **ENGINE-P2-04** | `.me-toast` без `role="status"`/`aria-live` (`toastEl.className='me-toast'`, :1337) | 🔴 подтверждён |
| **QUAL-P2-02** | `karty/nachalo/route.json`: нет `stories` (0), `meta` без `id/era/stats` (только title/subtitle/sheet_no/sheet_viewport/position_note), publication=draft | 🔴 подтверждён |
| **QUAL-P2-04** | `renderMarkers()` чистит **6 групп** через `innerHTML=''` и пересоздаёт узлы (`markersG/waypointsG/signatureG/storyFocusG/pathsG/ctxG`, :1717+) | 🔴 подтверждён |
| **SIG-P1-01** | `M${origin.x-74},${origin.y-86} C${origin.x-118},…` — жёсткие пиксельные смещения в water-split сигнатуре (:1952) | 🔴 подтверждён |
| **DRAW-P1-01** | `if (nearbyLabels.length > 0) ly += 12;` — фиксированный сдвиг 12px (:2196) | 🔴 подтверждён |
| **LOD-P1-01** | `path.setAttribute('stroke-width','2.6')` — без `vector-effect:non-scaling-stroke` на этом пути (:1840) → обводка масштабируется | 🔴 подтверждён |
| **PERF-P1-01** | `avraam/base.svg:40-45` `<feTurbulence id="waveTurb">` + `dur="14s" repeatCount="indefinite"` + `#grain` фильтр | 🔴 подтверждён |
| **MAP-P2-02** | `<link rel="preload" href="route.json" as="fetch">` в `avraam/index.html:17`, `ishod/index.html:17` — preload без credentials → двойной запрос | 🔴 подтверждён |
| **MAP-P1-10** | `karty/ishod/index.html` — **0** вхождений `terrain`/`base-geo`; в `avraam/index.html:1337` есть `<g id="terrain" data-layer="base-geo">` | 🔴 подтверждён (именно ishod) |
| **BUG-011** | брейкпоинты: `768px` ×**22** + соседние `760px`×28, `761px`×12 → коллизия у 768 остаётся | 🔴 подтверждён |
| **BUG-PERF-001** | `addEventListener` = **366** vs `removeEventListener` = **31** по всем js/ | 🔴 подтверждён (дисбаланс ~335) |
| **AUDIT-CSS-GBFLOATER-DUP-MEDIA** | `css/floating-cluster.css`: **83** @media; идентичные условия повторяются: `(max-width:899px)`×7, `(min-width:64em)`×8 и ×5 (с/без пробела), `(hover…)`×23 | 🔴 подтверждён (дубли условий есть; «побайтно дублируется» — требует точного сравнения блоков) |

## 2. 🟢 Реальность ЛУЧШЕ — кандидаты на закрытие/сужение (4)

| ID | Что изменилось | Evidence | Вывод |
|---|---|---|---|
| **STRANGLER-HYGIENE** | «50/53 Astro-маршрутов имеют дублирующийся legacy HTML в корне» | В корне только **4 служебных** html: `404.html`, `google7e02…html`, `index.html`, `yandex_42bc…html` (83 Astro-страницы). **Legacy-дублей в корне нет** | 🟢 **кандидат на закрытие (stale)** — нужен формальный reverify |
| **MAP-P1-06** | «_renderArchaeologyFooter рендерится под всеми вкладками (267 раз)» | Теперь `_renderArchaeologyProjection(tab,place)` с guard `allowedTabs:['arch','sci']` — `if(!allowed.includes(tab))return` (:2532) | 🟢 сужено/закрыто — рендер только на arch/sci |
| **ENGINE-P1-27** | «Escape закрывает модалку фото + панель места одновременно» | Escape-обработчик (:3091-3098): `if(photoModal open){closePhoto('escape');return}` затем отдельно панель — `return` разводит сценарии | 🟢 **не воспроизводится** на текущем коде — кандидат на закрытие |
| **QUAL-P1-01** | «15 контролов <44px» | Теперь `min-height:44px` у `.me-back/.me-story-chip/.me-tab/.me-zoom-btn/.me-share-btn`; **остался `.me-arch-more{min-height:32px}`** | 🟡 сузить до arch-more (+проверить panel__resize) |

## 3. ⚠️ Требует browser-свидетеля (не закрывается кодом) — 7

| ID | Что видно в коде | Чего не хватает |
|---|---|---|
| ENGINE-P1-26 | click-обработчик есть на ВСЕХ маркерах (`g.addEventListener('click')→open(place.id)`, :2133) | Нужно проверить: скрыты ли точки вне сюжета (display/visibility) при активном сюжете → клик физически недоступен |
| MAP-P1-09 | story-чипы есть (`storiesBar role=tablist`, :1218) | «600мс автопанель первого места» — только browser |
| MAP-P1-19 | rotate-оверлей «Разверните устройство» в коде не найден | Проверить, существует ли ещё (возможно, убран) |
| AVRAAM-P1-03 | `#me-prev/#me-next` + мобильные стрелки существуют | «дублирование навигации» — визуальная оценка |
| HUB-P2-01 | QA-терминов в route.json не видно | «запечённый текст/138px зазор» — browser/скриншот |
| MAP-P1-04 | `.me-timeline{position:absolute;top:0;…}` над картой | Перекрытия header×timeline — browser-замеры |
| NEW-72 | atlas-export содержит 2 SVG, дублей файлов нет | «dedup ~1.9KB» — про внутренние символы, требует diff-анализа |

## 4. Итог по всей серии (Части 1–4)

| Метрика | Значение |
|---|---|
| Открытых строк проверено кодом | **~85 из 145** |
| Подтверждено на `4ce39dc8` | **~60** |
| Реальность лучше (сужены/кандидаты на закрытие) | **~17** (STRANGLER-HYGIENE, MAP-P1-06, ENGINE-P1-27, QUAL-P1-01→arch-more, QUAL-P1-09, MAP-P1-13, DATA-P1-04, BASE-P1-03, MAP-P1-18, NG-SEO-01 часть, PC-CURRENT-03, AR-IDX-PERF-01/02, NG-A11Y-01, RIVER-P1-02, S-SEC-01, SEARCH-MANIFEST-QUALITY) |
| Реальность хуже (усилены) | **6** (AR-IDX-05 кэш-баст, CI-WORKFLOW-PROLIFERATION 49, NEW-CSS-BUDGET ~664КБ, D-3 ~590КБ, KARTY-DATA-P1-01/GLYPH-P1-01 0/0, BUG-PERF-001 366/31) |
| Browser-класс (Playwright) | ~35 строк |

**Быстрые победы (по убыванию ценности):**
1. **STRANGLER-HYGIENE → закрыть** (legacy-дублей в корне нет) — reverify + строка долой.
2. **ENGINE-P1-27 и MAP-P1-06 → закрыть/сузить** (код уже исправлен).
3. **QUAL-P1-01 → сузить** до `.me-arch-more` 32px (остальное 44px).
4. **AR-IDX-05 → поднять severity и починить** (кэш-баст молча мёртв 3 недели).
5. **Бюджеты → обновить цифры** (CSS 664КБ/425КБ, JS 590КБ/365КБ — превышение 56–62%).

*Документ — untracked в AuditRepo; коммиты/пуши не выполнялись.*
