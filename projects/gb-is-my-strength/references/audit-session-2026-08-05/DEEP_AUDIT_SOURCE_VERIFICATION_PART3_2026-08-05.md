# Глубокая source-верификация gb-is-my-strength — Часть 3 (Нагорная, Home/theme, PremiumControls, D-строки)

**Дата:** 2026-08-05 · **Проверено на:** `main@4ce39dc816727c43373491acfb5bad0916cde113`
**Серия:** Часть 1 (28 подтверждено / 3 лучше) → Часть 2 (17 подтверждено / бюджеты хуже) → **эта Часть 3**.

---

## 1. ✅ Подтверждены на текущем main (15)

| ID | Evidence | Вердикт |
|---|---|---|
| **NG-INLINE-01** | inline `#1c1410/#8a7968/#b8882a/#faf8f5` есть в `NagornayaChast{1,2}MainShell.astro`, `NagornayaChast{1,2}SectionX.astro` и др. | 🔴 подтверждён |
| **NG-TOC-01** | `css/mobile-hotfix.css:32`: `color:var(--ng-toc-accent-2, #f59e0b) !important` — токен теперь **определён** в `nagornaya-mobile-toc.css`, но amber-fallback остался в mobile-hotfix → ровно как в матрице (wave B) | 🔴 подтверждён (fallback) |
| **NG-STRUCT-01** | `class="group mb-6 mt-12"` в `NagornayaChast2SectionX.astro` — **0** вхождений (обёртки нет) | 🔴 подтверждён |
| **NG-CROSS-01** | `text-purple-800`/`text-emerald-700`/`text-blue-*` — есть в chast-1..5 компонентах | 🔴 подтверждён |
| **NG-SEO-01** | `v4.0 · Апрель 2026` в футере `Chast1/Chast2 MainShell+SectionX` (ch.4/5 без строки версии — согласуется) | 🔴 подтверждён (частично, см. §2) |
| **NG-SERIYA-01** | в `nagornaya/seriya/` нет `bg-stone-100` на body-уровне | 🔴 подтверждён |
| **NF-DEAD-ENHANCE-SHIM** | `enhanceGillMobileBarMarkup` = 2 вхождения в `js/floating-cluster-controller.js` (мёртвый shim жив) | 🔴 подтверждён |
| **NF-GATE-IZ5-STALE** | «Часть 1 из 5» всё ещё в **3 скриптах**: `gill-context-visual-parity-audit.js:207`, `gill-spravochnik-visual-parity-audit.js:187`, `gill-v16-mobile-play-smoke.js:274,288` — при том, что части рендерят «из 3» | 🔴 подтверждён (гейт вакуумный) |
| **NEW-HARDTEXTS-CSP-MISSING-HFCDN** | `hard-texts/index.astro:109` connect-src содержит `https://huggingface.co`, но **нет `*.aws.cdn.hf.co`** | 🔴 подтверждён |
| **NEW-SAVE-QUOTE-TIMER-RACE** | `js/highlights.js`: число `500` = 1, `setTimeout` = 11 — одноразовый 500ms-таймер инъекции сохранить-цитату жив | 🔴 подтверждён (suspected, как в матрице) |
| **SEARCH-P3-02** | `js/search.js`: `slice(0,10)` (Pagefind) и `slice(0,12)` (occurrences) — жёсткие капы без «Показать ещё» | 🔴 подтверждён |
| **SEARCH-P3-01** | fallback-инъекция в `search.js`: `aria-label="Поиск (⌘K)"`, `title="Поиск ⌘K"`, `<span class="kb">⌘K</span>` | 🔴 подтверждён |
| **D-2** | `scripts/css-layer-validator.js`: порог warning `<50%` (:121), target `≥80%` (в тексте), запуск по `css/site.css` (:13) — порядок слоёв «обещает», но энфорс только unlayered | 🔴 подтверждён |
| **D-7** | `PremiumControlAnchor.astro:3` — репо-относительная ссылка `FedorMilovanov/AuditRepo → projects/gb-is-my-strength/PremiumControls/README.md §1` (комментарий) | 🔴 подтверждён (косметика) |
| **AR-IDX-JS-02** | multi-writer остаётся: canonical `gb:reader-preferences` (reader-preferences.js) + legacy `localStorage.setItem('theme',…)` в `site.js:223` | 🔴 подтверждён (поверхность осталась) |
| **AUDIT-JS-ESCAPER-DUP-X5** | `function tt(` = **3** в site.js + `function F(` = 1 в search.js + `function h(` = 1 в highlights.js = **ровно 5 копий** | 🔴 подтверждён точно |
| **PC-CURRENT-02** | Гейт `premium-controls-rollout-audit.js:169-172,210-211` проверяет `cssCode.includes('gb-roman')` / `html.includes('gb-roman')` — substring-проверка, false-green риск сохраняется | 🔴 подтверждён (риск) |

## 2. 🟡 Реальность ЛУЧШЕ заявленного (кандидаты на сужение/закрытие)

| ID | Что изменилось | Evidence | Вывод |
|---|---|---|---|
| **NG-SEO-01** | ch.4/5 **уже имеют** `data-pagefind-meta="scripture"` | `chast-4/index.astro:20`, `chast-5/index.astro:20` | Строку сузить: остаются title≠og:title и «v4.0 · Апрель 2026»/отсутствие версии в ch4/5 |
| **PC-CURRENT-03** | `assetUrl('css/floating-cluster.css')` **версионируется** | `src/lib/asset-version.js:8` `'css/floating-cluster.css':'d26d83c2'`; `:40-46` assetUrl добавляет `?v=` | Astro-роуты ок; проверить только legacy HTML-зеркала (быстро) |
| **AR-IDX-PERF-01** | На home **нет LCP-изображения** в разметке (hero текстовый; единственный `<img>` — noscript-пиксель Yandex с `decoding="async"`, не LCP) | `HomePageChrome.astro:301` | «LCP image decoding=async» не воспроизводится; остаются 5 render-blocking CSS → сузить |
| **AR-IDX-PERF-02** | `@font-face` всего **4** (в `fonts/fonts.css`), не 30+ | `fonts/fonts.css` | Цифра «30+» устарела → обновить/сузить |
| **NG-A11Y-01** | Emoji-символы в astro-компонентах nagornaya **не найдены** (0 совпадений; контент в `src/content/` — только articles, без nagornaya) | grep по `src/components/nagornaya/**`, `src/pages/nagornaya/**` | Не подтверждается в текущем коде — нужен точный поиск в данных/генерируемом контенте либо пометить «stale на текущем HEAD» |
| **NEW-HIGHLIGHTS-NO-REINIT-GUARD** | guard'а `if(window.__highlightsInit)` нет; есть только `window.__ssLastText/__ssLastTextUrl` (не guard) | `js/highlights.js` | Как в матрице: suspected, низкий риск — не менять статус без browser-свидетеля |

## 3. 🆕 Уточнения, которых нет в матрице

1. **PC-CURRENT-03 сужен к legacy-зеркалам:** версионирование через `assetUrl` работает для Astro (floating-cluster.css `d26d83c2`, controller `2b92a1a5`), но **не покрывает legacy HTML-копии в корне** (если они грузят `css/floating-cluster.css` напрямую без `?v=`). Проверка: `grep -l 'floating-cluster.css' $(find . -maxdepth 1 -name '*.html')`.
2. **NG-A11Y-01 (emoji-иконки) — «не воспроизводится в src»:** вероятно, контент генерируется из data/ (или emoji в mdx внутри `src/content/articles`, но nagornaya-путей там нет). Требует уточнения владельца/данных, а не кода.
3. **NF-GATE-IZ5-STALE подтверждён тройным гейтом** — это конкретный инстанс GATE-MARKER-DATA-DRIFT: 3 скрипта ждут «Часть 1 из 5», прод рендерит «из 3» → будущий miscount пройдёт молча.

## 4. Итог серии (Части 1–3)

| Метрика | Значение |
|---|---|
| Открытых строк проверено кодом | **~60** (из 145) |
| Подтверждено на текущем main | **~45** |
| Реальность лучше (сужены/кандидаты на закрытие) | **~12** (QUAL-P1-09, MAP-P1-13, DATA-P1-04, BASE-P1-03, MAP-P1-18, NG-SEO-01 часть, PC-CURRENT-03, AR-IDX-PERF-01/02, NG-A11Y-01, RIVER-P1-02, S-SEC-01) |
| Реальность хуже (усилены) | **5** (AR-IDX-05 застойный кэш-баст, CI-WORKFLOW-PROLIFERATION 49, NEW-CSS-BUDGET ~664КБ, D-3 ~590КБ, KARTY-DATA-P1-01/GLYPH-P1-01 0/0 во всех 11) |
| Закрытых строк спот-чек | 9/9 OK |
| Browser-класс (требует Playwright) | ~35 (туры, перекрытия, viewport, a11y-взаимодействия) |

**Практические выводы:**
1. **Кэш-баст сломан молча** (AR-IDX-05: `version: 1778943682` не двигается с 14.07) — самый дешёвый фикс с самым большим эффектом.
2. **3 «вакуумных» гейта** (NF-GATE-IZ5-STALE) — починить маркер «Часть 1 из 3» и вынести в data/ (GATE-MARKER-DATA-DRIFT).
3. **~12 строк готовы к сужению/закрытию** после формального reverify — кандидаты перечислены выше.
4. **Бюджеты CSS/JS превышены на 56–62%** и продолжают расти — это уже не «warning», а техдолг, который скоро ударит по INP/стоимости CI.

*Документ — untracked в AuditRepo; коммиты/пуши не выполнялись.*
