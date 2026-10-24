# Системная проверка: injected header control host

Дата: 2026-10-23  
Product anchor: `caeb92c839ff4b4f2838a0ad44a582034c41c8d4`  
AuditRepo input: `d09830b789ccba21afc17571aafc7c0afe0f30d5`  
Режим: read-only source/root consolidation; Product не изменялся

## Итог

Два current geometry findings на `/articles/` — overlap и viewport clipping — являются одним repair unit и двумя измерениями одного implicit injected-control contract:

- `GBS-HEADER-SEARCH-THEME-TARGET-OVERLAP`;
- `GBS-HEADER-MOBILE-CONTROLS-CLIPPED-OUTSIDE-VIEWPORT`.

Они поглощены system lane `SYS-INJECTED-HEADER-CONTROL-HOST`.

## Текущий общий механизм

`ArticlesPageChrome.astro` авторитативно создаёт:

- `.h-navbar` / `.h-navbar__inner`;
- generic `.mobile-controls`;
- `#themeToggle`;
- mobile menu button.

Search control отсутствует в authored markup. `ReaderPreferencesHead.astro` позже выполняет route-gated DOM mutation для `/articles/`, `/biografii/`, `/pastor-series/`:

1. находит первый `document.querySelector('.mobile-controls')`;
2. создаёт 44px-class `#gbSearchBtn.gb-nav-search-icon`;
3. вставляет его перед `#themeToggle`;
4. не согласует число controls, доступную ширину, breakpoint или host capability.

Legacy CSS одновременно задаёт generic host policy:

```css
.mobile-controls { display:flex; align-items:center; gap:4px }
@media(max-width:760px) {
  .mobile-controls { flex-shrink:1; max-width:120px; overflow:hidden }
}
```

Shared Astro `Header.astro` имеет собственные scoped overrides и geometry/focus contract; native Articles chrome их не получает. Поэтому исправление shared Header #2167 успешно, но не закрывает injected native host.

## Два проявления одной геометрии

Fresh retained browser evidence на current owner:

- search и theme имеют 44×44 targets;
- горизонтальный overlap стабильно 12px на 390/768/1280;
- при mobile-touch 768 search right = 791.328, theme right = 823.328;
- оба центра находятся за viewport и `centre hit=false`;
- healthy shared Header controls на `/`, `/izbrannoe/`, `/hard-texts/genesis-6/` дают overlap 0 и hit=true.

Overlap и clipping нельзя надёжно закрыть разными patches: изменение width/position одного injected control одновременно меняет обе метрики. Два backlog units провоцировали бы конкурирующие правки одного host.

## Почему это системный, а не только route-local root

Runtime выбирает host по общему presentation selector `.mobile-controls`, а route allowlist содержит три разных chrome families. Никакой interface не сообщает:

- разрешена ли динамическая вставка;
- где должен стоять search control;
- сколько controls вмещает breakpoint;
- кто владеет focus/geometry styles;
- какой host выбран при нескольких `.mobile-controls`.

Текущий доказанный user-visible failure ограничен `/articles/`; `/biografii/` и `/pastor-series/` не объявляются сломанными без browser witness. Но repair owner уже class-level: explicit host/component contract вместо первого совпадения generic selector.

## Bounded closure

1. Search opener является authored child общего header-control component либо вставляется только в explicit named host (`data-*`/API), не в первый generic `.mobile-controls`.
2. Host владеет числом controls, gap, shrink/min-width и safe-area/viewport containment на каждом breakpoint.
3. `/articles/` на 320/390/768 и desktop имеет overlap 0, каждый target полностью внутри viewport/clip ancestors и centre hit-testable.
4. Pointer/touch, keyboard order, visible focus, theme toggle, menu и Ctrl/⌘+K сохраняются.
5. `/biografii/` и `/pastor-series/` проходят те же class-level checks как route allowlist consumers; healthy shared Header controls остаются controls.
6. Guard строит страницу с дополнительным injected control либо mutation fixture и падает при capacity/host ambiguity; `overflow-x:hidden` не считается repair.
7. Нет второго search opener и нет отдельного competing click handler.

## Collision check

На 2026-10-23 открытые Product PR не меняют:

- `ReaderPreferencesHead.astro`;
- `ArticlesPageChrome.astro`;
- `css/home.css`;
- shared `Header.astro`.

Перед Product mutation проверка повторяется. Product #2179 затрагивает workflows, но не эти source owners.

## Что не поглощено

- `GBS-MOBILE-CHROME-NAVBAR-SYNC-LAG` остаётся отдельным visibility/event synchronization defect.
- Home search focus restoration остаётся overlay opener/restore lifecycle, не host geometry.
- Другие route families не объявлены defective только из-за `.mobile-controls` class.
- Новый визуальный дизайн header не требуется.
- Browser заново в этой проверке не запускался; current source trace соединён с сохранённым resulting-main geometry receipt.

## Источники

- `../reverify/evidence/2026-10-22-header-byline-recheck.json`;
- `../reverify/2026-10-22-postclosure-current-main.md`;
- `../reverify/2026-09-29-current-header-search-theme-target-overlap.md`;
- Product `ReaderPreferencesHead.astro`, `ArticlesPageChrome.astro`, `Header.astro`, `css/home.css` на `caeb92c`.
