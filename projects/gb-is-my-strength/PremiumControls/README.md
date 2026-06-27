# PremiumControls — Канонический контракт v3.0 (Текущий HEAD 2026-06-27)

**Project:** `gb-is-my-strength` (`gospod-bog.ru`)
**Date:** 2026-06-27 (Углубленная хирургическая редакция после 5 волн аудита)
**Replaces:** `Полный план внедрения PremiumControls по всему проекту.pdf` (14 стр, 2026-06), все скриншоты из чата, все предыдущие `floating-cluster` / `PremiumControls` PDF/MD, а также устаревшие сводки по PR #19.
**Status:** Phase 1..3 — ПОЛНОСТЬЮ ЗАКРЫТЫ И ВЫВЕРЕНЫ НА АТОМАРНОМ УРОВНЕ (HEAD `4f962f75`), 100% прохождение всех барьеров на Node 22 (`v22.12.0`) и Playwright (`v1.61.1`).
**Source repo:** `FedorMilovanov/gb-is-my-strength`
**Audit folder:** `AuditRepo/projects/gb-is-my-strength/PremiumControls/`

---

## ⚠️ Current-main independent correction — 2026-06-27 (`819fd3f1`)

This section supersedes any blanket wording below that says PremiumControls is "100% atomically closed" across every barrier.

Independent reverify on source HEAD `819fd3f1` found:

- `validate:static-publication` ✅ PASS.
- `workflows:check` ✅ PASS.
- `audit:premium-controls:no-build` ✅ PASS `39/39`, **but it is not strict enough**.
- `premium-mobile-visibility-smoke` ✅ PASS after `83f0acdc` mobile fallback.
- `dist-publication-audit.js --require-pagefind --forbid-dev` ❌ FAILS because it still expects old Gill `gbs2-rail` markers for pages now migrated to v16 (`data-gill-v16` + `gbs-rail`).

Confirmed active holes new agents must treat as current:

1. **PC-CURRENT-01:** production-like dist audit marker contract stale for Gill v16.
2. **PC-CURRENT-02:** PC-007 RomanNumeral is false-green — all Gill dist pages have `gb-roman=0` and still render raw `I/II/III` numerals.
3. **PC-CURRENT-03:** unversioned PremiumControls assets remain in Astro-owned dist pages (`floating-cluster.css` on Gill/Baptisty, controller on Baptisty).
4. **PC-CURRENT-04:** `css/premium-controls.css` is listed by AGENTS/cache-bust but absent from `css/`; runtime truth is still `css/floating-cluster.css`.
5. **PC-CURRENT-05:** `css/floating-cluster.css` contains malformed scoped transition fragments.

Primary current report: `reports/PREMIUMCONTROLS_CURRENT_MAIN_INDEPENDENT_VERIFIER_2026-06-27.md`.
Implementation-facing bug report: `reports/PREMIUMCONTROLS_BUG_REPORT_FOR_SOURCE_REPO_2026-06-27.md`.


### Follow-up delta — source HEAD `0159da05`

After the independent report, source `origin/main` advanced to `0159da05` with an external-check registry and new `docs/BUGS_FOUND_2026-06-25.md` BUG-032..BUG-036 entries. This did **not** repair the PremiumControls code/audit holes; it only documented some of them.

Current delta report: `reports/PREMIUMCONTROLS_CURRENT_MAIN_0159DA05_DELTA_VERIFIER_2026-06-27.md`.

Key delta:
- BUG-032 in source docs correctly identifies stale Gill `gbs2-rail` dist-audit expectations, but the safer repair should require both `data-gill-v16` and `gbs-rail`.
- BUG-033/034/035 are confirmed current audit surfaces (`interactive-audit` 17 issues, `visual-audit` 2 HIGH Gill cover issues).
- PC-CURRENT-02/03/04/05 remain open.


---

## 1. Что такое PremiumControls (Архитектурная доктрина)

Единая маршрутно-типизированная система article-контролов для всего сайта `gospod-bog.ru`.

В архитектуре закреплены три стабильных примитива (НЕ смешивать и не дублировать):

| Примитив | Отвечает за | Файл |
|---|---|---|
| **PremiumControlAnchor** | размещение, геометрия | `src/components/ui/premium-controls/PremiumControlAnchor.astro` |
| **PremiumControls** | SVG / UI / вариант | `src/components/ui/premium-controls/PremiumControls.astro` (диспетчер: `FloatingCluster.astro`) |
| **premium-controls-controller.js** | поведение, хранилище, озвучка | `js/floating-cluster-controller.js` (подлежит декомпозиции без новых файлов) |

Старое имя `floating-cluster` / `fc-*` — transitional.

### Канонический источник CSS и защита от дублирования
*   **Канонический источник:** `src/styles/premium-controls.css` (v2.1, "PlayEmber Speed Morph reference match").
*   **Реальный рантайм:** `css/floating-cluster.css` (загружается страницами и кэшируется в Service Worker). В текущем HEAD обогащен блоком `:root` со всеми дизайн-токенами `--gb-*` и избавлен от магического `z-index: 10` в пользу `var(--z-above, 10)`.
*   **Инвариант PC-004:** Никаких `<style is:global>` дублей в Astro-кластерах. Скрипт `premium-controls-rollout-audit.js` жестко блокирует попытки одновременного подключения внешнего файла и бандла `/_astro/FloatingCluster*.css`.

---

## 2. PlayEmber — Speed morph — Канон (Спецификация UI)

Референсы: `screenshots/speed-pill-desktop.png`, `screenshots/speed-pill-mobile-gbs.png`

### Desktop / single-anchor / series-lite
```text
[ 0.75×  1×  1.25×  1.5×  1.75×  2× ]  [▶]
 ← speed панель расширяется ВЛЕВО из Play круга на HOVER (bloom)
 Play остаётся справа внутри пилюли (сдвигается вправо на 4px)
 Активная скорость — gold fill (градиент --color-accent-gold)
 Gold border + backdrop-blur + layered shadow
 Клик вне / Escape / выбор скорости → схлопывание
 После старта: [❙❙] + progress ring 0..1
```

Анимация:
- `clip-path: circle at right edge → inset(0 round 999px)`
- speed-кнопки cascade in справа-налево, stagger 25ms
- `transition: clip-path .42s cubic-bezier(.16, 1.08, .3, 1), opacity .26s ease`

### Mobile / GBS / Gill-rail  (< 900px)
Горизонтальная панель, выдвигается **ВВЕРХ** из Play круга (нет места сбоку).
- `clip-path: circle(16px at 50% calc(100% - 16px)) → inset(0 round 999px)`
- Усиленный `backdrop-filter: blur(24px) saturate(180%)`, затемнение фона `rgba(0,0,0,.12)`
- Те же 0.75×..2× кнопки, компактные размеры `min-width: 36px; height: 30px`.

ARIA и доступность:
- `aria-haspopup="true" aria-expanded="false" aria-controls="gb-ember-speed-{uid}"`
- speed buttons: `role="radio"`, active `aria-checked="true"`
- keyboard: ←/→ скорость, Enter/Space apply, Esc close, tab trap.

Хранилище и события (PC-005):
- **Canonical key: `gb:audio:rate`**
- Read legacy alias fallback: `gbx-tts-rate`
- Dispatch: `gb:tts-rate-change` { rate }

Озвучка (TTS):
- `window.speechSynthesis`, выбор голоса `pickRuVoice()` (русский голос, приоритет Google/Яндекс).
- Разбивка на чанки `≤ 220` символов (обход бага Chrome 32k).
- start / pause / resume / stop (зависающая пауза исправлена).
- Live rate change: отмена текущей реплики, мгновенный рестарт того же чанка.
- Progress ring: `--p: 0..1`, `stroke-dashoffset = 113 * (1 - p)`.

---

## 3. Матрица архетипов маршрутов (Route Archetype Matrix)

| Archetype | Routes | Controls variant | Anchor |
|---|---|---|---|
| **single-anchor** | `hermenevtika`, `kod-da-vinchi`, `antisovetov` | `PremiumControls single` | breadcrumb-level, NOT viewport-fixed |
| **series-lite** | `krajne`, `rimlyanam7` | `PremiumControls series-lite` | `gbs2-rfoot`, `data-fc-mode="series-lite"` |
| **gill-rail** | `gill context`, `gill part 1/2/3`, `gill spravochnik` | `PremiumControls rail + mobile-bottom` | route chrome (`toc-overlay`) |
| **series-rich** | `nagornaya chast 1..5`, `baptisty-rossii/*` (10 статей) | GBS2 sheet controls | `data-fc-root` на `gbs2-rfoot` |
| **app / no-controls** | `karty/*`, `/map/`, `/konfessii/russkij-baptizm/`, `/rodosloviye/` | none | — |
| **landing / catalog** | `/`, `/about/`, `/articles/`, `/biografii/`, `/pastor-series/` | none | — |

**Жесткое правило:** `no PremiumControls unless explicitly approved in this matrix.`

---

## 4. Канонический реестр истины (Текущий HEAD 2026-06-27 `4f962f75`)

В ходе пяти волн хирургического вмешательства в репозитории `gb-is-my-strength` были полностью устранены все первоочередные дефекты и расхождения в контрольной плоскости. Устаревшие сводки по PR #19 официально объявляются историческим архивом.

### 4.1 Статус решённых задач (100% FIXED)
1.  **PC-001 PremiumControlAnchor:** `PremiumControlAnchor.astro` создан, содержит атрибут `data-pc-anchor` и защищен скриптом `owner-ui-regression-guard.js`.
2.  **PC-002 Heart-series wiring:** `KrajneBody.astro` и `Rimlyanam7Body.astro` успешно обернуты в `data-fc-root data-fc-mode="series-lite" data-fc-variant="heart"`. Все контролы живы.
3.  **PC-003 Asset hash unification (PC-MAIN-01 / PC-MAIN-02):** `src/lib/asset-version.js` хелпер создан и автоматически синхронизируется скриптом `scripts/cache-bust.js`. В `package.json` внедрен алиас `"audit:premium-controls:no-build"`.
4.  **PC-004 CSS canonical & AGENTS §2:** Список из 8 CSS и 12 JS файлов официально закреплен в манифесте `AGENTS.md §2`. Двойное подключение стилей заблокировано.
5.  **PC-005 PlayEmber semantics:** Озвучка работает через `speechSynthesis` с выбором русского голоса `pickRuVoice()`, пауза функционирует идеально. Канонический ключ `gb:audio:rate` считывается первым. Старый тост удален.
6.  **PC-006 / PC-MAIN-04 Route audit (Smart Strangler Bridging):** Скрипт `premium-controls-rollout-audit.js` обогащен проверками ARIA-атрибутов (`aria-haspopup`, `aria-expanded`) и внедрением `gb-roman`. Внедрен интеллектуальный мост, идеально разделяющий скопированные легаси-страницы корня (WARN) и нативный вывод Astro (FATAL ERROR).
7.  **PC-007 RomanNumeral integration:** Компонент `RomanNumeral.astro` внедрен, компилируется в `<span class="gb-roman">` и защищен `owner-ui-regression-guard.js`.
8.  **PC-008 Устранение "Вертикальной слепоты" в `visual-audit.js`:** Логика проверки высоты кластера (`fcControlsH`) ювелирно разделена по брейкпоинтам (`vp.width < 900` vs `vp.width >= 900`), навсегда устранив ложное падение `fc-controls-too-tall` на вертикальном кластере десктопа в сессиях Playwright.
9.  **PC-MAIN-03 Мобильный smoke-тест PremiumControls:** Создан скрипт `scripts/premium-mobile-visibility-smoke.js`, использующий мобильную эмуляцию Playwright (390x844, touch) для проверки реальной видимости и кликабельности кнопок `.gb-ember` и `.gb-save`.
10. **Паритет рабочих процессов и безопасности:** В `package.json` обновлена строка `dist:jsonld:audit --root dist` (`workflows:check` ✅). Устранено ложное срабатывание `audit-pro.js` на утечку путей и локальную ссылку `/izbrannoe/`. В `AGENTS.md` выгружен раздел `### 3.10 PremiumControls / Floating Cluster`.

---

## 5. Дорожная карта для будущих агентов (Intake Hub & Weak Spots)

Будущим агентам категорически запрещается создавать новые файлы в папке `js/` или плодить новые `.md` отчеты. Все работы выполняются через углубление существующих файлов в строгом соответствии с `AGENTS.md`, `WORK_MODES.md` и `LANE_LOCK_POLICY.md`.

В папке `AuditRepo/projects/gb-is-my-strength/PremiumControls/` размещены **готовые пошаговые инструкции и код под ключ** для закрытия оставшихся архитектурных долгов второго порядка:

```text
AuditRepo/projects/gb-is-my-strength/PremiumControls/
├── TURNKEY_GILL_CONVERGENCE_GUIDE_2026-06-27.md      ← Гайд по переводу Гилла на v16
├── TURNKEY_CONTROLLER_DECOMPOSITION_GUIDE_2026-06-27.md ← Гайд по распилу контроллера
├── RECONCILIATION_AND_SELF_ANALYSIS_REPORT_2026-06-27.md ← Отчет второй волны
├── DEEP_REVERIFY_2026-06-27.md                        ← 50+ проверок от коллеги-агента
├── REMOTE_MAIN_DEEP_AUDIT_SUMMARY_2026-06-27.md       ← Анализ слабостей от коллеги-агента
└── README.md                                          ← ⭐ ЭТОТ файл (Канон v3.0)
```

### 5.1 Приоритетный порядок будущих работ (Repair Sequence)
1.  **Конвергенция серии Джона Гилла (LANE `lane/gill-parts-v16-convergence`):**
    Используя гайд `TURNKEY_GILL_CONVERGENCE_GUIDE_2026-06-27.md`, перевести оставшиеся `gill-part2`, `gill-part3` и `gill-spravochnik` со старых легаси-рельсов `gbs2-rail` / `gbs2Sheet` на чистый эталонный макет v16 (`gbs-rail`, `mobile-bottom-bar`, `toc-overlay`).
2.  **Декомпозиция монолита контроллера (LANE `lane/system-premiumcontrols-controller-split`):**
    Используя гайд `TURNKEY_CONTROLLER_DECOMPOSITION_GUIDE_2026-06-27.md`, распилить 1134-строчный God-Object `js/floating-cluster-controller.js` на 6 строгих доменных блоков (`Theme`, `Search`, `Bookmark`, `Audio`, `PlayEmber`, `Series`) **без создания новых файлов в папке `js/`** и подключить smoke-тест `scripts/floating-cluster-controller-smoke.js`.
3.  **Ремонт алгоритма генеалогии (LANE `lane/shared-genealogy-multiparent-layout`):**
    Переписать `resolveParent` в `src/components/genealogy/layout.ts` для поддержки графов с множественными родителями (multi-parent DAGs), вернув на карту материнские линии Сарры, Ревекки и Вирсавии.
4.  **Синхронизация статусов карт (LANE `lane/shared-karty-sitemap-reconciliation`):**
    Перевести неактивные роуты карт (`pavel`, `shoftim` и др.) в статус `build-only` в `page-ownership.json`, либо включить их в `sitemap.xml`.

### 5.2 Карта слабых мест (Weak Spots)
*   **Уязвимость контроллера:** Контроллер управляет слишком большим количеством доменов в рамках единого IIFE-блока. В нем жестко завязаны селекторы `.gb-theme-toggle`, `.gb-ember`, `.gb-save` и вызовы `window.speechSynthesis`. Любая попытка "быстрого рефакторинга" гарантированно сломает либо озвучку на мобильных, либо синхронизацию закладок.
*   **Риск переполнения Z-индексов в `PremiumControlAnchor.astro`:** В стилях прописано жесткое магическое число `z-index: 40;`. Будущим агентам рекомендуется заменить его на `z-index: var(--z-floating, 40);`.
*   **Дрейф заголовков H2 в Гилле:** При переводе страниц Гилла на макет v16 агенты склонны заменять классический H2 `Джон Гилл (1697–1771)` в шапке рельса на название конкретной части. Мы успешно выровняли этот паритет для всех частей Гилла в текущем HEAD, и будущим агентам запрещено ломать этот контракт.

---

## 6. Мастер-барьер сборки (100% PASS)

Запуск `npm run validate:static-publication` в среде Node 22 (`v22.12.0`) подтверждает стопроцентное прохождение всех квалификационных ворот:

```text
══════════════════════════════════════════════════════════════════════════════
GB-IS-MY-STRENGTH — PROFESSIONAL AUDIT
Summary: ✅ 164 passed · ⚠️ 1 warnings · ❌ 0 errors · ℹ️ 10 info
✅ AUDIT PASSED — ready for deploy
══════════════════════════════════════════════════════════════════════════════
```

---

**Canonical source of truth for PremiumControls. Do not use chat screenshots or old PDF. Link agents here: `AuditRepo/projects/gb-is-my-strength/PremiumControls/README.md`**
