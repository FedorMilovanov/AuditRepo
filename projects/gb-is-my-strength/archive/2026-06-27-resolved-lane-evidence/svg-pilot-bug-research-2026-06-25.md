# SVG pilot bug research — Hermeneutics + Gill Context

Дата: 2026-06-25
Проверено на актуальном `origin/main` после `git pull --rebase`
Актуальный remote commit во время проверки: `feedf2b`

Фокус:
- `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`
- `/articles/dzhon-gill-istoricheskiy-kontekst/`

## Прочитанные контракты и отчёты
- `AGENTS.md`
- `docs/WORK_MODES.md`
- `docs/LANE_LOCK_POLICY.md`
- `migration/route-migration-matrix.json`
- `docs/SANDBOX-ENV-2026-06-21.md`
- `docs/OWNER-REQUIREMENTS.md`
- `docs/ASTRO-PREMIUM-MIGRATION-ROADMAP.md`
- `docs/refactor-2026/FLOATING_CLUSTER_V16_FULL_SITE_PLAN.md`
- `docs/refactor-2026/lanes/system-floating-cluster-v16-pilot-gill-hermeneutics-2026-06-25.md`
- свежие audit-отчёты, уже появившиеся в репо параллельно (`audit/seo-2026-06-25/*` и др.)

## Выполненная верификация
- `npm ci` (Node 22.12.0)
- `npm run strangler:build`
- `npm run gill:context:visual-parity:audit`
- Playwright runtime probes на root и dist
- pixel diff first viewport: root vs dist

---

## Подтверждённые баги на текущем main

### BUG-A1 · Gill Context desktop rail не persistent / не sticky

**Route:** `/articles/dzhon-gill-istoricheskiy-kontekst/`

**Факт:** `.gbs-rail` в dist не закреплён во viewport и уезжает вверх вместе со страницей.

**Верификация:**
- computed style: `position: relative`
- Playwright scroll probe:
  - before: `top = 0`
  - after `scrollTo(0,1200)`: `top = -742`

**Почему это баг:** для Gill rich rail это должен быть рабочий persistent control/navigation rail, а не обычный потоковый блок, исчезающий после начала чтения.

---

### BUG-A2 · Gill Context mobile bottom bar не fixed-bottom

**Route:** `/articles/dzhon-gill-istoricheskiy-kontekst/`

**Факт:** `.mobile-bottom-bar` расположен в document flow и живёт почти у конца длинного документа, а не у нижнего края экрана.

**Верификация на viewport `390x844`:**
- computed style: `position: static`
- начальная геометрия:
  - `top = 27849.2`
  - `bottom = 28049.2`
- после `scrollTo(0,1200)`:
  - `top = 27036.2`

**Почему это баг:** mobile TOC/actions bar не помогает читать статью в реальном времени, потому что недоступен на первом экране и не закреплён.

---

### BUG-A3 · False-green source audit: Gill Context audit не ловит runtime UX-поломку

**Скрипт:** `npm run gill:context:visual-parity:audit`

**Факт:** audit проходит зелёным, хотя в реальном браузере:
- desktop rail не persistent
- mobile bottom bar не fixed

**Причина:** текущий audit проверяет source-структуру/markers/word-count/H2 parity, но не проверяет runtime positioning/behavior control rail и mobile bar.

**Следствие:** агент может получить зелёный audit при реально сломанной навигационной модели.

---

### BUG-A4 · False-green visual confidence: Hermeneutics article audit не ловит заметный mobile drift

**Route:** `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`

**Связанный скрипт:** `npm run astro:audit:article-mdx:no-build`

**Факт:** audit по статье проходит, но first-viewport pixel diff root vs dist на mobile остаётся заметным.

**Измерение:**
- desktop: `0.054%`
- mobile: `5.044%`

**Почему это баг:** для premium SVG pilot mobile drift уже не выглядит как шум/субпиксельная погрешность, а текущий article audit этого не блокирует.

---

## Pixel diff (first viewport, root vs dist)

### Hermeneutics
- desktop: `0.054%`
- mobile: `5.044%`

### Gill Context
- desktop: `13.708%`
- mobile: `22.481%`

## Интерпретация
- **Hermeneutics:** page ближе к норме, но mobile visual drift уже заметный.
- **Gill Context:** это большая visual/runtime divergence, не noise floor.

---

## Что я дополнительно перепроверил и НЕ считаю текущим багом

На свежем main **не воспроизвёлся** ранний промежуточный дефект с `aria-disabled` у `PlayEmber`:
- сейчас `.gb-ember` не имеет ложного `aria-disabled="true"`
- click открывает speed panel
- toast про «озвучка не подключена» больше не показывается в моём повторном прогоне

Поэтому этот пункт **не включён** в подтверждённые баги текущего main.

---

## Короткий вывод

### Hermeneutics
- не «всё развалено»
- но mobile premium SVG/floater-пилот ещё не дотягивает до уверенной visual parity

### Gill Context
- есть реальные пользовательские баги
- основной дефект не в самих SVG-кнопках, а в том, что rail/bar UX сейчас не persistent

### System / audits
- часть текущих проверок даёт false-green
- это отдельная проблема защиты проекта

---

## Рекомендуемые фиксы

### P0
1. Сделать Gill desktop rail реально persistent (sticky/fixed по owner contract).
2. Сделать Gill mobile bottom bar реально fixed-bottom.

### P1
3. Расширить `gill:context:visual-parity:audit` runtime-check’ами:
   - rail остаётся в viewport после scroll
   - mobile bottom bar находится у нижней кромки viewport на первом экране
4. Для Hermeneutics добавить реальный mobile visual guard, а не ограничиваться content/source parity.

---

## Команды, которыми это подтверждалось

```bash
npm run strangler:build
npm run gill:context:visual-parity:audit
```

И дополнительно — Playwright runtime/pixel probes локально против root (`:8090`) и dist (`:8091`).

---

## Дополнительный follow-up pass: визуал, формулировки, грамматика, изображения

После первичного SVG pilot pass был сделан дополнительный ручной/браузерный проход по текущему `origin/main` с фокусом на:
- визуальные регрессии вне чистого SVG runtime
- битые формулировки / опечатки / текстовые артефакты
- портретные/9:16 изображения, которые на mobile занимают почти весь экран

### BUG-B1 · Published article corruption: `20-antisovetov-pastoru` содержит битый текст в публичном dist

**Public file:** `dist/articles/20-antisovetov-pastoru/index.html`
**Source file:** `src/components/article-pilots/antisovetov/AntisovetovBody.astro`

**Факт:** в опубликованном тексте есть реальная поломка строки с U+FFFD/обрезанным предложением:

> `Настоящая сломленность не прос�тематическом искажении фактов перед общиной.`

Текст очевидно оборван и склеен из двух предложений.

**Почему это важно:** это уже не стилистика, а публичный читательский дефект в боевом артефакте.

---

### BUG-B2 · Hermeneutics: production verse/tooltip corpus содержит текстовые ошибки

**Public file:** `dist/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html`
**Source file:** `src/components/article-pilots/hermenevtika/HermenevtikaBody.astro`

Подтверждены минимум такие production-ошибки в встраиваемом текстовом корпусе для verse/tooltip data:

1. Опечатка:
> `кик говорят некоторые между вами`

вместо
> `как говорят некоторые между вами`

2. Сломанная пунктуация/цитата:
> `скиния, называемая , .Святое Святых`

Это попадает в production HTML и потенциально показывается пользователю в tooltip/verse runtime.

**Почему это важно:** это уже не hidden source-only debt, а production textual layer с богословскими/библейскими данными.

---

### BUG-B3 · Gill Part I: портретная схема `9:16`-типа разворачивается почти во весь мобильный экран

**Route:** `/articles/dzhon-gill-chast-1-chelovek/`
**Source file:** `src/components/article-pilots/gill-part1/GillPart1SectionPastor.astro`
**Figure:**
```html
<figure class="article-img article-img--vertical article-img--wide reveal">
```
**Image asset:** `gill-pastoral-succession`

**Верификация на mobile viewport `390x844`:**
- figure width: `310.8px`
- figure height: `582.7px`
- rendered image height: `466.7px`
- aspect ratio rendered: `1.5`

То есть один блок занимает примерно **69% высоты экрана** вместе с подписью и ощущается как «почти весь экран занят одной вертикальной схемой».

**Почему это похоже на визуальный баг:** для narrative article это ломает ритм чтения на mobile и визуально воспринимается как «9:16 картинка на полстраницы/всю страницу», особенно на этапе скролла к этому блоку.

**Важно:** на desktop эта же схема рендерится умеренно (`~270x406` image), поэтому проблема в первую очередь мобильная.

---

## Быстрый severity summary after follow-up

### P0 / production-text
- `20-antisovetov-pastoru`: битая публичная фраза в dist
- `hermenevtika`: production corpus содержит как минимум одну явную опечатку и одну сломанную цитату

### P1 / visual-mobile
- `dzhon-gill-chast-1-chelovek`: слишком высокий portrait/wide succession image block на mobile
- `gill-context`: non-persistent desktop rail + non-fixed mobile bottom bar (из primary pass)
- `hermenevtika`: mobile visual drift `5.044%` root vs dist (из primary pass)

---

## Команды / probes для follow-up

```bash
npm run strangler:build
```

Дополнительно:
- Playwright runtime probes on `:8091`
- mobile figure measurements for `article-img--vertical`
- grep/text verification in source + dist

### BUG-B4 · Glossary popup text is semantically glued together in live runtime

**Routes verified:**
- `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`
- `/articles/krajne-li-isporcheno-serdce/`

**Факт:** при открытии `.gterm` popup live tooltip text собирается без нормальных текстовых разделителей между category / title / body.

**Примеры фактического popup textContent:**
- `Герменевтикаграмматико-исторический метод...`
- `Канон и текстыНового Завета...`

**Почему это баг:**
- это кривой читательский/plain-text слой;
- это потенциальный a11y bug для screen reader / text extraction;
- это визуально и смыслово выглядит как склеенный заголовочный блок, даже если popup-box сам по себе рендерится.

**Доп. наблюдение:**
в открытом tooltip у `gtip-luxury__title` и `gtip-luxury__body` computed layout остаётся `inline`, что делает этот glue-effect особенно вероятным для plain-text/assistive слоя.

---

### DEBT-B5 · Latent source corruption in MDX files for future native promotion

**Статус:** пока не подтверждено как текущий public bug, но это опасный source debt для следующих native promotions.

Подтверждённые source examples:

1. `src/content/articles/dzhon-gill-chast-1-chelovek.mdx`
> `...в среде Особых баптистовОсобые, или партикулярные, баптисты...`

2. `src/content/articles/dzhon-gill-chast-3-nasledie.mdx`
> `...доктрины супралапсарианскойСупралапсарианство — ...`

Это выглядит как склейка основного текста и врезанного пояснения/сноски без пробела или разделителя.

**Почему важно:** если route будет глубже переходить на native/MDX body вместо текущего shadow/public source, эти ошибки легко выйдут прямо в production текст.

### BUG-B6 · Kod da Vinchi: mobile manuscript figures become screen-dominating blocks

**Route:** `/articles/kod-da-vinchi/`

During the mobile figure-rhythm pass (`390x844`) two manuscript/document figures stood out as unusually dominant:

1. `Evangelio de Felipe / Codex II Nag-Hammadi` block
   - figure height: `523.98px`
   - viewport share: about `62%` of screen height

2. `Papyrus P52` block
   - figure height: `608.66px`
   - viewport share: about `72%` of screen height

**Why this matters:** these are not catastrophic layout breaks, but they create a strong “document page takes over the whole phone screen” effect and interrupt reading rhythm in a way similar to the owner’s complaint about tall portrait / 9:16-style visual dominance.

**Status:** visual-bug candidate / strong UX debt, not yet marked as hard blocker at the same level as text corruption.

---

### DEBT-B7 · Additional latent MDX concatenation defect found in `krajne`

**Source file:** `src/content/articles/krajne-li-isporcheno-serdce.mdx`

Confirmed concatenation pattern:

> `...После битвы при КархемишеБитва при Кархемише ...`

This matches the same family of source corruption as:
- `Особых баптистовОсобые...`
- `супралапсарианскойСупралапсарианство...`

**Why important:** not currently confirmed in public dist for this route, but dangerous for future MDX-native promotions or content reuse.

---

## Broader scan note

A broader mobile article figure pass across the major `dist/articles/*` routes was run with a simple heuristic (`figure height > 520px` on `390x844`). The strongest outliers found in this pass were:
- Gill Part I succession scheme
- Kod da Vinchi manuscript / papyrus figures

So the “tall image taking over the phone screen” problem is not everywhere, but it is real in a few high-visibility places.

### BUG-B8 · Glossary popup text-glue bug is systemic across all tested `gterm` article routes

Additional live-runtime pass confirmed the same glue pattern on every tested route that uses `.gterm` and was checked in browser:

- `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`
  - `Герменевтикаграмматико-исторический метод...`
- `/articles/dzhon-gill-chast-1-chelovek/`
  - `БогословиеСвод богословия...`
- `/articles/dzhon-gill-chast-2-uchenyi/`
  - `БогословиеСвод богословия...`
- `/articles/dzhon-gill-chast-3-nasledie/`
  - `БогословиеСвод богословия...`
- `/articles/krajne-li-isporcheno-serdce/`
  - `ИсторияКархемишеБитва при Кархемише...`

This upgrades the issue from “isolated popup wording defect” to a **systemic glossary runtime bug** in the premium tooltip layer.

---

### DEBT-B9 · MDX concatenation family now confirmed in 4 distinct source patterns

Current confirmed latent source concatenations in `src/content/articles/*.mdx`:

1. `Особых баптистовОсобые...`
2. `супралапсарианскойСупралапсарианство...`
3. `КархемишеБитва...`
4. `Гейдельбергский катехизисРеформатский...` (3 occurrences in `krajne-li-isporcheno-serdce.mdx`)

This is no longer a one-off typo story. It is a recognizable **content-ingestion / inline-note concatenation family** that should be treated as a migration-risk class.

## Scope note from broader public scan

A broader `dist/**/*.html` corruption pass was run with three concrete public heuristics:
- `U+FFFD`
- `кик говорят`
- `называемая , .Святое Святых`

Current result on built `dist`:
- `U+FFFD`: only confirmed in `articles/20-antisovetov-pastoru/index.html`
- `кик говорят`: confirmed in Hermeneutics public HTML
- `называемая , .Святое Святых`: confirmed in Hermeneutics public HTML

So this is **not** currently a site-wide encoding collapse, but it **is** a real public production-text defect cluster in high-visibility article routes.

### BUG-B10 · Mobile academic footnote tooltips (`.fn-marker > .tooltip`) do not open on tap

**Systemic scope confirmed on tested routes:**
- `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`
- `/articles/kod-da-vinchi/`
- `/articles/krajne-li-isporcheno-serdce/`
- `/articles/dzhon-gill-chast-1-chelovek/`

**Mobile behavior (`390x844`):**
- tapping the first `.fn-marker` does **not** add `.is-open`
- tooltip remains offscreen:
  - `top = 844`
  - `pointer-events = none`
  - `opacity = 1` but still translated below viewport

**Desktop control check:**
- on desktop the same interaction works: `.fn-marker` becomes `.is-open`, tooltip moves into viewport and becomes usable.

**Why this is serious:** academic/source footnotes are part of the reading contract on these pages. On mobile they are effectively inaccessible.

---

### BUG-B11 · Mobile Bible-reference popups (`.bref > .btip`) do not open on tap

**Systemic scope confirmed on all tested routes that use `.bref`:**
- `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`
- `/articles/kod-da-vinchi/`
- `/articles/krajne-li-isporcheno-serdce/`

**Mobile behavior (`390x844`):**
- tapping the first `.bref` leaves class unchanged (`bref` stays `bref`)
- `.btip` remains hidden:
  - `opacity = 0`
  - `top = -9999px`
  - `left = -9999px`

**Desktop control check:**
- on desktop the same interaction works: `.bref` becomes `.bref is-open`, popup is positioned and visible.

**Why this is serious:** Bible-reference quick lookup is working on desktop but functionally dead on mobile for tested routes.

---

### DEBT-B12 · Mobile tooltip architecture creates many offscreen fixed sheets even before interaction

**Supporting observation for BUG-B10:**
On mobile, every `.tooltip` receives the mobile sheet-style CSS even before any marker is opened. Example from `css/site.css` mobile rule family:
- `top:auto !important; left:0 !important; right:0 !important; bottom:0 !important;`
- `opacity:1; visibility:visible;`
- `transform: translateY(100%)`

In practice this means many full-width fixed tooltip panels are instantiated just below the viewport from page load.

**Observed counts of mobile `.tooltip` sheet instances with geometry:**
- Hermeneutics: `116`
- Kod da Vinchi: `21`
- Krajne: `38`
- Gill Part I: `5`
- Gill Part II: `1`
- Romans 7: `8`

Because they stay translated below the viewport they are not all immediately seen by the reader, but this is still a bad runtime state:
- unnecessary heavy DOM/UI layer on mobile
- likely related to why tap-open behavior is broken
- poor accessibility semantics (many visible-ish panels in DOM state before opening)

This is recorded as a supporting architecture/runtime debt, not just a copy issue.
