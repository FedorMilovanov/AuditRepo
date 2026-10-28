# Alternative-media cluster: resulting-main reconciliation — 2026-10-28

## 1. Якорь и scope большой волны

Проверен неизменённый Product main `cdf994b104d7b5eaeef407bf60e341e436efe1df`; production-like corpus содержит 108 HTML-документов. Единственный открытый Product PR #2208 — docs-only и не владеет CSS/runtime owners этой волны. Product не изменялся.

Большая волна **4/16–20** повторно квалифицирует четыре rows одного alternative-media/CSS кластера:

1. `GBS-KRAJNE-REDUCED-MOTION-QUIZ-OCCLUSION`;
2. `GBS-PRINT-TERMINAL-REGION-HIDES-CONTENT`;
3. `GBS-NAGORNAYA-MENU-ICON-MISSING-FORCED-COLORS`;
4. `GBS-PRINT-MEDIA-CONTRAST-COLLAPSE`.

Машинное свидетельство: `evidence/2026-10-28-alternative-media-cluster-resulting-main.jsonl`. Полные browser outputs и screenshots оставлены вне Git в `/tmp/wave14`.

## 2. Krajne reduced motion — FIXED-CURRENT

Проверены 1440×900 и 390×844 × Light/Dark × `reduce`/`no-preference`: **8 профилей**. Во всех восьми настоящий `#quizLaunch` был центральным hit target и native click/tap открыл квиз без `force`. Затем keyboard activation прошла все 12 вопросов, показала результат `4 из 12`, активировала `Пройти ещё раз` и вернула первый вопрос; page errors 0.

При `reduce` карточка теперь действительно резервирует сумму двух static faces:

- desktop: card 1034.09px = 458.66 + 575.44px;
- mobile: card 933.41px = 207.19 + 726.22px.

Прежний механизм — max(face), который оставлял вторую face поверх `#quizLaunch`, — больше не воспроизводится. Normal-motion controls сохраняют overlay contract и тоже проходят полный flow. Row `GBS-KRAJNE-REDUCED-MOTION-QUIZ-OCCLUSION` закрыт как `FIXED-CURRENT`.

Health для тех же восьми профилей: broken loaded images 0, positive overflow 0, Axe violations 0, page errors 0. `ERR_CONNECTION_CLOSED` — отфильтрованный sandbox egress noise. Mobile LCP 792–1028ms; desktop Chromium shell не выдал LCP entry, что записано как `null`, а не ноль. Mobile CLS 0, desktop Light 0.00504.

Desktop Dark дал CLS 0.21869–0.21904. Отдельный source probe показывает один shift: `.gbs2-world` меняет rect с `x=304,width=1136` на `x=0,width=1440`. Это уже causal scope `GBS-SERIES-READER-COMPACT-DESKTOP-CAPACITY-CONFLICT`, поэтому новая строка не создана; прежний Dark-control statement этого row уточнён текущим Krajne witness.

## 3. Print terminal region — резко сужен, но не закрыт

Повторён browser print census на прежних 16 routes при A4-width 794px. На **15/16 routes** теперь нет ни одного `[data-print-terminal-follower]`, включая прежние крупные manifestations:

- Krajne: 203 nodes / 24 902 chars → 0;
- Genesis 6: 71 / 4 315 → 0;
- Kod da Vinchi: 34 / 1 292 → 0.

Остаётся `/about/`: 20 descendant followers, три root blocks, 124 reader characters. Print скрывает `gb-accuracy-block`, breadcrumb и citation `Аввакум 3:19`; visible followers 0. Это уже не route-family loss, но реальный reader citation всё ещё попадает под generic follower mask. Row остаётся `OPEN-CURRENT`, scope сужен до About terminal-anchor selection.

Все 16 профилей дали page errors 0. Historical PDF text-layer claims не использовались как closure oracle: disposition основан на DOM print state и page renders.

## 4. Nagornaya forced colors — repair присутствует, witness boundary остаётся

Current source содержит узкий системный fallback:

```css
@media (forced-colors: active) {
  #menuBtn .bar { background: CanvasText; }
  #menuBtn { border: 1px solid CanvasText; }
}
```

Восемь routes с `#menuBtn` проверены в mobile 390 × Light/Dark × `forcedColors: active`: **16 профилей**. Во всех случаях три bars вычисляются как system text colour, кнопка получает 1px system border, focus outline видим, native click открывает `#mobileMenu`, Escape закрывает его и возвращает focus; `aria-expanded`/label синхронны, page errors 0.

Однако существующая строка явно требует реального Windows High Contrast Mode witness для снятия прежней harness-limited границы. Chromium emulation доказывает source contract и native behavior, но не заменяет физический Windows repaint. Поэтому row не закрыт: disposition **FIXED-CANDIDATE / PENDING WINDOWS HCM WITNESS**, без нового work unit.

## 5. Print contrast — большая часть исправлена, Biografii остаётся

Current `@media print` reset получил `background: transparent !important` и `color: #000 !important`. Повторён тот же paired painted-glyph method: normal element screenshot против screenshot с transparent text, strongest pixel delta и WCAG luminance.

Исправлены прежние основные пары:

- четыре Home featured titles: screen 18.50–18.65:1, print **21:1**;
- Home kicker: print **21:1**;
- Home meta: print **21:1**;
- Nagornaya project nav: screen 5.72:1, print **11.30:1**.

Но `/biografii/` не закрыт. Screen tagline даёт 5.35:1; в print DOM она имеет `color: rgb(0,0,0)` и text range 249.9×11px, однако её центр hit-tests в hero `<img>`, не в текст. Normal-vs-transparent screenshot меняется лишь на один RGB step (`delta=1`), то есть glyph фактически не рисуется над изображением. Full-page render визуально подтверждает: hero image остаётся, а tagline/title/description отсутствуют перед большим пустым участком.

Следовательно, blanket reset исправил Home/Nagornaya contrast, но Biografii сохранил image-stacking/content-visibility manifestation. `GBS-PRINT-MEDIA-CONTRAST-COLLAPSE` остаётся `OPEN-CURRENT`, теперь сужен до Biografii hero и обязательного 16-route regression scan.

## 6. Gates и disposition

На exact Product main прошли:

- `nagornaya:visual-parity:audit`;
- `css:layer:validate`;
- `article:qa`;
- `readable-audit`;
- `ci-browser-print-stability-contract-test.mjs`;
- `note-registry-contract-test.mjs`.

Эти gates не обнаруживают About follower loss, физический Windows HCM repaint или Biografii print stacking; зелень не использована для ложного закрытия.

Итог: один direct row закрыт, два остаются `OPEN-CURRENT`, один — `FIXED-CANDIDATE / PENDING WINDOWS HCM WITNESS`. Новых rows нет. Арифметика меняется с 76 на **44 direct + 8 improvements + 1 residual + 22 systems = 75 active work units**.
