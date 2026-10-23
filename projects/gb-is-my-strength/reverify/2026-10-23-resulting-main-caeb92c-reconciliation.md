# 2026-10-23 — resulting-main reconciliation после Product #2184

Scope: независимая перепроверка merged Product #2184 на resulting main **`caeb92c839ff4b4f2838a0ad44a582034c41c8d4`**, без Product mutation и без production claim. AuditRepo вход `522dd32f…`; Product PR head `58175a06…`, merge `caeb92c…`. Exact `npm ci`, production-like build и Pagefind build прошли; Product tree clean. Chromium **153.0.8010.0**, desktop1440/mobile390, Light/Dark, reduced motion; forced-colors использован только как эмуляционный контроль, не как Windows HCM witness.

## FIXED-CURRENT — 11 строк

1. `GBS-QUIZ-DARK-SURFACE-LOW-CONTRAST`: 24 quiz routes ×2 ширины ×2 темы = **96 states**, quiz-scoped axe color-contrast **0**.
2. `GBS-THEME-TOGGLE-FOCUS-INDICATOR-MISSING`: `/articles/` и `/izbrannoe/`, 8 keyboard Light/Dark states — настоящий Tab достигает `#themeToggle`, `:focus-visible=true`, outline2px; forced-colors controls также 2px.
3. `GBS-NAGORNAYA-SOURCE-LINKS-COLOR-ONLY`: три Nagornaya chapters + G3, Light/Dark — `link-in-text-block`0, sampled links имеют постоянный underline.
4. `GBS-MOBILE-CHROME-HIDDEN-FOCUSABLE-BEFORE-SCROLL`: все9 routes при scrollY0 вычисляют `visibility:hidden`, programmatic focus не принимается; после фактического раскрытия три контрола видимы и focusable. На `/articles/`, `/biografii/`, `/hard-texts/` для раскрытия по-прежнему нужен второй scroll event — это уже отдельный активный `GBS-MOBILE-CHROME-NAVBAR-SYNC-LAG`, не причина возвращать невидимые initial Tab stops.
5. `GBS-JOURNAL-MISSING-SKIP-LINK`: обе Journal routes ×1440/390 — skip-link первый Tab stop, Enter даёт `#main-content` и реальный focus на main, следующий Tab входит в content.
6. `GBS-H-SCROLL-TOP-INVISIBLE-FOCUS`: все6 routes — hidden control `visibility:hidden`, focus=false; после scroll видим/focusable, native click возвращает scrollY0.
7. `GBS-SECTION-HEADING-NAME-POLLUTION`: **105 HTML routes /2754 headings /1795 heading anchors /0 polluted names**; postbuild hygiene также сообщил 1584 статических aria-label и postcheck PASS. Copy controls не скрыты от AT.
8. `GBS-FAVORITES-WRITE-FAILURE-IGNORED`: четыре quota profiles показывают честный error toast, canonical items0/pressed=false; четыре migration-failure profiles сохраняют legacy flag=`1`; после освобождения места ложной записи нет. Healthy saves/migrations проходят.
9. `GBS-FAVORITES-COVER-LINK-UNNAMED`: две реальные сохранённые карточки ×4 profiles; native AX names осмысленны, favorite browser contract **138/138 PASS**, source contract **65/65 PASS**.
10. `GBS-GENESIS6-MOBILE-CRUMB-COLLISION`: mobile Light/Dark overlap brand↔breadcrumb **0 px²**, crumb остаётся «Хлебные крошки». Representative screenshots просмотрены.
11. `GBS-KARTY-SVG-UNNAMED`: Avraam/Ishod ×1440/390 имеют `role=application`, route-specific aria-label и keyboard instructions; Avraam сохраняет19 controls, Ishod current data —10. Diff c18→caeb меняет semantics map engine, не route data/controls; старое число13 уже не current baseline.

## PARTIAL/NARROWED — Home search

`GBS-HOME-SEARCH-DUPLICATE-CLOSE-CONTROLS` не закрывается целиком. Дубликат действительно устранён: во всех4 profiles видна ровно **1** кнопка «Закрыть поиск». Однако заявленная boundary требовала сохранить focus restoration, а native Escape и close-button оставляют desktop focus на `body`, mobile — на `#hMobileMenuBtn`, не на clicked `a#heroSearchBar`, и это сохраняется после1s. Source Home передаёт `restoreFocus:true`, поэтому остаток переименован в **`GBS-HOME-SEARCH-FOCUS-RESTORE`** с alias старого ID; арифметика этой единицы не меняется. Это согласуется с красным current-main `Home Chromium WebKit contract`, но причина удалённого CI failure по недоступному artifact log не приписывается автоматически именно этому поведению.

## CI, границы и арифметика

Current Product SHA имеет terminal checks **79 =62 success +3 failure +14 skipped**. Красные: `npm-audit`, `Chromium WebKit cold bootstrap`, `Home Chromium WebKit contract`; root causes этой wave не установлены. Product #2184 PR rollup содержит другие superseded/cancelled attempts и не используется вместо resulting-main checks. Нет production/live/all-green claim.

Evidence: [83 compact JSON documents](evidence/2026-10-23-resulting-main-caeb92c.json), exact line-by-line round-trip, max line629. Durable harness: `../incoming/arena-full-spectrum-audit/2026-10-14/harness/resulting-main-2184-recheck.mjs`. Product build, dependencies, logs and PNG remain outside Git.

**Arithmetic: 56 →45 =40 direct defects +4 necessary improvements +1 system lane.** Eleven independently reproduced fixes retire; Home remains one narrowed defect. Open backlog is not zero and does not block merging truthful AuditRepo evidence after its own exact-head gates are green; it does block any claim that the Product audit is finished.
