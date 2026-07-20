# Engine Integration Risk Register

| ID | Риск | Severity | Признак | Защита |
|---|---|---:|---|---|
| R-01 | Book становится четвёртым runtime | P0 | отдельные Book CSS/JS/Play/Settings | `shape:'book'` только внутри series engine |
| R-02 | Type drift `arabic` | P0 | `astro check` TS2322 | общий mark type + top-level narrowing |
| R-03 | Editorial registry не знает новые routes | P0 | readiness RED | registry `--write` + review + `--check` |
| R-04 | Узлы метро-линии уходят с оси | P1 | circle visually right/left of line | один axis token + bounding-box contract ≤0.25 px |
| R-05 | Desktop rail и sheet показывают разный current | P1 | два активных раздела | один `currentArticleId/currentSectionId` store |
| R-06 | В книге раскрываются все статьи сразу | P1 | огромный sheet/rail | accordion exclusivity per chapter |
| R-07 | Flat series меняет DOM/вид | P0 | Gill pixel diff | default `shape:'flat'`, flat snapshots before landing |
| R-08 | Article engine получает series semantics | P1 | dual ring/roman marks на Herm | discriminated engine contract + negative sweep |
| R-09 | Page engine получает fake reader controls | P1 | TTS/progress на каталоге | registry page adapter has no playback/settings/help |
| R-10 | Второй TTS runtime | P0 | два audio state/controller | только `PlayEmber` + `floating-cluster-controller` |
| R-11 | Speed badge не синхронен | P1 | 1× в одном месте, 1.5× в другом | единственный rate state + multi-surface assertion |
| R-12 | Theme icon не соответствует теме | P1 | Sun в dark | canonical sun/moon markup + computed display check |
| R-13 | Sepia смешивается с dark | P1 | два theme state одновременно | applyTheme mutually exclusive |
| R-14 | Sheet ломает scroll/focus | P1 | фон скроллится, Tab уходит | lifecycle helper, lock, trap, restore |
| R-15 | Auto-hide прячет PLAY во время TTS | P0 | top bar исчезает при playing | `canAutoHide` pinned-state assertion |
| R-16 | Toast перекрывает sheet | P2 | bookmark toast поверх Settings/TOC | dismiss toast before modal open |
| R-17 | SVG расходится с каноном | P1 | другая home/save/gear geometry | SVG manifest + source path assertions |
| R-18 | Settings превращаются в тяжёлую полоску | P2 | общий filled segment background | border-only options contract |
| R-19 | Малые viewports теряют Share | P2 | overflow на 320 | responsive action policy; explicit 320 screenshot |
| R-20 | Reduced-motion игнорируется | P1 | spring/fade остаются | media query + Playwright emulation |
| R-21 | Nested TOC якоря не существуют | P0 | клик ведёт в пустоту | build validator + DOM anchor sweep |
| R-22 | Progress denominator неверен | P1 | глава считается страницей | chapter excluded from route/progress list |
| R-23 | Chapter href создаёт пустую страницу | P1 | отдельный chapter route | href projection → first published article |
| R-24 | Mobile and desktop duplicate markup drift | P1 | разные titles/minutes | shared series tree projection |
| R-25 | Массовая посадка до GREEN | P0 | deploy + visual одновременно RED | сначала type/registry unblock, затем visual lane |

## Landing rule

Ни один визуальный diff не закрывается фразой «в прототипе выглядит хорошо». Требуется:

```text
source invariant
+ current-head reproduction
+ negative test
+ production-like build
+ desktop/mobile screenshots
+ exact SHA
```
