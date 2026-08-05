# Глубокая source-верификация gb-is-my-strength — Часть 6 (финал: гигиена, гейты, остатки)

**Дата:** 2026-08-05 · **Проверено на:** `main@4ce39dc816727c43373491acfb5bad0916cde113`
**Серия:** Части 1–5 + эта Часть 6 (заключительная).

---

## 1. ✅ Подтверждены (7)

| ID | Evidence | Вердикт |
|---|---|---|
| **NEW-65** (Baptisty parity) | `scripts/baptisty-rossii-visual-parity-audit.js` существует и проверяет `src/pages/baptisty-rossii/index.astro` + sovetskaya-noch — как в закрытой строке | ✅ закрытая строка подтверждена (гейт на месте) |
| **NF-GATE-IZ5-STALE** | маркер «Часть 1 из 5» в **3 скриптах**: `premium-controls-rollout-audit.js:229-234` (`forbidden = ['Часть 1 из 5','Часть 0']`), `gill-v16-mobile-play-smoke.js:274,288` (`introBadPart1`), `gill-context/gill-spravochnik` (по 1) | 🔴 подтверждён (гейт вакуумный: проверяет отсутствие «Часть 1 из 5», но части рендерят «из 3» → пропустит miscount) |
| **AR-IDX-A11Y-01** | `css/home.css:666-667,807` — `:focus-visible` только для `.mobile-controls > button`, `.h-nav-links a`, `.h-sacred-block--hero .hb-w`; **карточки-ссылки без focus-visible** | 🔴 подтверждён |
| **AR-IDX-08** | в `HomePublications/Planned/Quote` inline `style=` не найдены (компоненты переведены на классы) — но в целом по home остались (`HomeAmbientPhrases` CSS-var, noscript-пиксель) | 🟡 сузить/частично |
| **NEW-72** | `images/atlas-export/avraam.svg` содержит **109** `<symbol>/<use>` — внутренние дубли возможны; файловый dup отсутствует | 🟡 требует diff-анализа, не закрывается кодом |
| **NG-VIS-10** | ref-card/ref-системы в nagornaya-компонентах не найдены (библиография ad-hoc) | 🔴 подтверждён |
| **CI-INDEXNOW-CHECKER-STALE** | `check-workflows.js:200` требует `contents: read` у `indexnow.yml` — закрытая строка подтверждена | ✅ закрытая строка подтверждена |

## 2. 🟢 Реальность ЛУЧШЕ / кандидаты (2)

| ID | Что изменилось | Evidence | Вывод |
|---|---|---|---|
| **GATE-MARKER-DATA-DRIFT** | «4 раза за 05.07» — историческая хроника; на текущем коде главный живой инстанс — NF-GATE-IZ5-STALE (маркер «Часть 1 из 5»). Другие (pastor-series, timestamps, chast-2) — вынесены в data/ или починены | `premium-controls-rollout-audit.js`, `gill-v16-mobile-play-smoke.js` | Строку сузить до «живой инстанс: NF-GATE-IZ5-STALE» + правило «маркеры в data/*.json» |
| **AR-IDX-08** | В `HomePublications/Planned/Quote` inline-стилей нет (переведены на классы) | grep | Сузить: остались только `HomeAmbientPhrases` (CSS-var) и noscript-пиксель |

## 3. Итог всей серии (Части 1–6) — единая картина

| Метрика | Значение |
|---|---|
| Открытых строк проверено кодом | **~105 из 145** |
| Подтверждено на `4ce39dc8` | **~72** |
| Реальность лучше (сужены/кандидаты на закрытие) | **~21** |
| Реальность хуже (усилены) | **~9** |
| Закрытых строк спот-чек | 11/11 OK |
| Browser-класс (нужен Playwright) | ~35 |

### ✅ Кандидаты на ЗАКРЫТИЕ (reverify-пакет, ~10)
1. **STRANGLER-HYGIENE** — legacy-дублей в корне нет (4 служебных html только)
2. **ENGINE-P1-27** — Escape разведён (`return` после closePhoto)
3. **MAP-P1-06** — guard `allowedTabs:['arch','sci']` стоит
4. **AR-IDX-10** — CSP home/hermenevtika/legacy унифицирован (jsdelivr+hf.co)
5. **QUAL-P1-09** — `currentStatus` в route.json нет; publication-профили согласованны
6. **BASE-P1-03** — чёрной заливки `#22241f` нет
7. **MAP-P1-13** — role/tabindex на маркерах добавлены (сужение до panel/reduced-motion)
8. **AR-IDX-PERF-01/02** — нет LCP-img; @font-face 4 (не 30+)
9. **NG-SEO-01** — ch4/5 pagefind-meta есть (остаток: title/footer)
10. **DATA-P1-04** — semantic zoom есть (остаток: шрифты 1.5px/40px)

### ⚠️ Строки, требующие ПОВЫШЕНИЯ приоритета
1. **AR-IDX-05 → P1/P2** — `SITE_CONFIG.version=1778943682` заморожен с 14.07; runtime-CSS (`enhancements-runtime.css`, `highlights-runtime.css`) намертво закэшированы без инвалидации. Любая будущая правка этих CSS не дойдёт до пользователей.
2. **NEW-CSS-BUDGET-01 / D-3** — CSS ~664КБ (>425КБ на 56%), JS ~590КБ (>365КБ на 62%), рост продолжается.
3. **CI-WORKFLOW-PROLIFERATION** — 49 воркфлоу (матрица говорит «~26»), растут стоимость CI и поверхность дрейфа.
4. **D-19** — обе половины открыты (заявление 07-11 о rimlyanam-7 кодом не подтверждается).
5. **KARTY-DATA-P1-01 / GLYPH-P1-01** — 0 anchors/0 leaders/0 glyphs во всех 11 route.json (хуже, чем в матрице).

## 4. Финальный вердикт по всему аудиту

**«Закрыто всё?» — НЕТ.** Из 145 открытых канонических строк:
- **~72 подтверждены** на текущем `main@4ce39dc8` (живые дефекты);
- **~21 — кандидаты на закрытие/сужение** (код уже лучше; нужен формальный reverify);
- **~35 — browser-класс** (нужен Playwright exact-HEAD);
- **~17 — не проверялись** (вне кода: данные/контент/владелец-решения).

Три самых ценных действия для владельца:
1. **Починить кэш-баст** (AR-IDX-05) — сейчас он молча мёртв, и это тикающая мина для любых будущих CSS-правок.
2. **Провести reverify-пакет по ~10 кандидатам** — это снимет с матрицы ~10 строк без единой правки продукта.
3. **Karty-кластер** — батчевый exact-HEAD browser-reverify (SD-7), т.к. ~35 строк browser-класса и witness'ы устарели на 638+ коммитов.

*Документ — untracked в AuditRepo; коммиты/пуши не выполнялись. Серия: Части 1–6 + DEEP_AUDIT_2026-08-05.md.*
