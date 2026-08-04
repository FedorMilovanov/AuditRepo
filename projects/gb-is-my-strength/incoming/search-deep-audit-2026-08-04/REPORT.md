# Total search audit — gospod-bog.ru / gb-is-my-strength

**Дата:** 2026-08-04  
**Product source HEAD:** `f9d0120718569c510833dba7a3abd68ce2f6a003`  
**AuditRepo branch:** `arena/019fccbd-auditrepo`  
**Статус:** incoming evidence only; матрицу/счётчики не менял.  
**Цель:** мощный аудит поиска: визуал, функционал, пропущенные возможности, security/«вирусная» проверка, повторные проверки.

## 0. Executive verdict

Поиск не «сломанный»: production-like сборка проходит публикационные и Pagefind-контракты, индекс строится, базовые запросы работают, защита от простых XSS в search-manifest есть. Но есть несколько реальных продуктовых дыр:

1. **P1 — глобальный command-palette поиск не является действительно site-wide:** 13 HTML routes в dist не несут `js/search.js`/`command-palette`; среди них есть публичные index/pagefind/searchManifest routes (`/karty/avraam/`, `/karty/ishod/`, `/konfessii/russkij-baptizm/`, `/map/`). На `/map/` есть отдельный atlas-search, но это не тот же глобальный поиск/`Ctrl+K`.
2. **P1 — блок «Писание» обещает точный стиховой поиск, которого нет:** UI сам предлагает `Ин 3:16`, но ни manifest, ни Pagefind не имеют точного результата по Ин 3:16; пользователь получает нерелевантные материалы с `2 Тим 3:16`, `Ин 14:26` и т.п.
3. **P2 — `/hard-texts/genesis-6/` индексируется Pagefind и sitemap, но намеренно исключён из search-manifest:** это не нарушает текущий policy-gate, но ухудшает fallback/default discovery и выглядит как упущенная возможность для важного landing.
4. **P2 — accessibility debt:** listbox/results управляются визуально, но input не получает `aria-activedescendant`, а results сделаны как `button role="option"`; скринридеры получают менее надёжную навигационную модель.
5. **Security:** клиентский search bundle не показал malware/XSS-инъекций по проверенным паттернам, но `npm audit` даёт 6 transitive уязвимостей build/dev цепочки: 4 moderate + 2 high.

## 1. Что было проверено

### 1.1 Source/build/pagefind gates

Рабочая копия Product репозитория была взята с текущего main:

```text
git clone --depth 1 https://github.com/FedorMilovanov/gb-is-my-strength.git
HEAD = f9d0120718569c510833dba7a3abd68ce2f6a003
```

Запущенные проверки:

```text
npm ci
node scripts/search-manifest-policy-normalizer-test.js
node scripts/search-index-policy-contract-test.js
node scripts/search-index-policy-inventory.js
npm run strangler:build:production-like
npm run pagefind:build:dist
node scripts/dist-publication-audit.js --require-pagefind --forbid-dev
node scripts/sw-dist-readiness-audit.js --require-pagefind
node scripts/search-index-policy-inventory.js
npm run home:visual-parity:audit
npm audit --json
custom static/search/security scans
custom Pagefind query probe
custom jsdom click/query harness
```

Итоги позитивных gates:

```text
✅ search manifest policy normalizer
✅ search/index policy mutation contract
✅ strangler:build:production-like completed
✅ Pagefind v1.5.2 indexed 74 pages / 23347 words
✅ dist publication audit passed
✅ SW dist readiness audit passed
✅ Search/index policy: 83 production routes, 83 policies, 0 problem(s)
✅ Home native contract audit passed
```

### 1.2 Ограничения окружения

- `pwsh`/`powershell` в sandbox **не установлен**: `PowerShell runtime not installed in sandbox`. PowerShell-ветку перепроверки заменил эквивалентными Node/bash проверками с теми же инвариантами.
- Playwright browser runtime отсутствовал; `npx playwright install chromium` и `apt-get install chromium` не смогли скачать браузер из-за сетевых TLS/apt ограничений. Поэтому pixel/browser screenshot-прокликивание в реальном Chromium здесь не завершено. Вместо этого выполнены production-like build, static HTML/CSS audit, Pagefind API probe и jsdom interaction harness. Live preview production-like dist был поднят на `0.0.0.0:4173` для ручного просмотра.
- Direct `curl https://gospod-bog.ru/...` из sandbox падал на TLS (`SSL_ERROR_SYSCALL`); точный same-SHA production claim не делаю.

## 2. Evidence snapshots

### 2.1 Индекс и manifest

Production-like dist после Pagefind:

```json
{
  "manifestItems": 74,
  "dupUrls": [],
  "dupIds": [],
  "missingFields": 0,
  "noRead": [],
  "badUrl": [],
  "absImage": [],
  "sitemapCount": 74,
  "pagefindBodyCount": 74,
  "manifestNoBody": []
}
```

Единственная осознанная асимметрия:

```text
sitemap/pagefind body, but no search-manifest item: /hard-texts/genesis-6/
policy says searchManifestPolicy=exclude, pagefindPolicy=include, sitemapPolicy=include
```

### 2.2 Route coverage of global command palette

Static scan по `dist/**/*.html` на наличие command-palette/search assets показал:

```json
{
  "totalHtmlIndexRoutes": 84,
  "noGlobalCommandPaletteAssets": [
    "/karty/avraam/",
    "/karty/early-church/",
    "/karty/ishod/",
    "/karty/maccabim/",
    "/karty/melachim/",
    "/karty/pavel/",
    "/karty/revelation/",
    "/karty/shoftim/",
    "/karty/shvatim/",
    "/karty/yeshua/",
    "/konfessii/russkij-baptizm/",
    "/konfessii/russkij-baptizm/_app/",
    "/map/"
  ]
}
```

Особенно важно, что эти публичные routes одновременно имеют `indexPolicy=index`, `pagefindPolicy=include`, `searchManifestPolicy=include`:

```text
/karty/avraam/
/karty/ishod/
/konfessii/russkij-baptizm/
/map/
```

### 2.3 Query probes

Pagefind direct probe:

```text
QUERY Бытие 6 => 54 results; first: /hard-texts/angely-pod-mrakom-iuda-6-7-2-petra-2/
QUERY Код да Винчи => 4 results; first: /articles/kod-da-vinchi/
QUERY Ин 3:16 => 8 results; first results are not exact John 3:16
QUERY Фёдор => 51 results
QUERY благодать => 40 results
QUERY Яхве => 46 results
```

Manifest/jsdom fallback probe по routes `/about/`, `/articles/kod-da-vinchi/`, `/nagornaya/chast-3/`, `/baptisty-rossii/`, `/hard-texts/genesis-6/`:

```text
Код да Винчи => 1 result, correct first: «Код да Винчи»
Иер 17:9 => 2 results, first: Крайне ли испорчено сердце верующего?
Фёдор in authors scope => 12 results
Ин 3:16 in scripture scope => 3 results, but not an exact John 3:16 entry
Бытие 6 => 1 fallback result: Ангелы под мраком...
Escape closes overlay; Ctrl+K/API open works where search script exists.
```

## 3. Findings

### SEARCH-P1-01 — Глобальный поиск отсутствует на части публичных tool/app routes

**Severity:** P1  
**Type:** functional / site-wide consistency / missed discovery  
**Evidence:** static dist scan; policy inventory.

Публичные routes `/karty/avraam/`, `/karty/ishod/`, `/konfessii/russkij-baptizm/`, `/map/` являются indexable, включены в Pagefind и search-manifest policy, но в HTML нет unified `js/search.js` / `command-palette.css` / global `GBSearch` surface. `/map/` имеет локальный `.atlas-search`, но это другой поиск с другим UX и не заменяет глобальный command palette.

**Impact:** пользователь, находясь в дорогих интерактивных маршрутах, теряет привычный `Ctrl+K`/command-palette способ вернуться к библиотечному поиску. Это ломает ощущение единой библиотеки и снижает discovery.

**Repair direction:**

- Явно определить контракт: global command palette должен быть на всех `indexPolicy=index && searchManifestPolicy=include` routes, кроме формально исключённых owner routes.
- Для `/map/`: либо добавить command-palette рядом с atlas-search, либо документировать atlas-search как локальный и оставить глобальный shortcut.
- Добавить guard: dist scan должен fail, если публичный route без owner-exception не содержит global search bootstrap.

---

### SEARCH-P1-02 — Scripture scope обещает verse search, но `Ин 3:16` не работает как точная ссылка

**Severity:** P1  
**Type:** functional / theological UX integrity  
**Evidence:** hard-coded suggestions in `js/search.js`; Pagefind and manifest probes.

В empty-state scope «Писание» пользователь видит предложения:

```text
Ин 3:16, Мф 5:3, Рим 8:28, Иер 17:9
```

Но search corpus — это статьи/metadata, а не Bible verse database. В manifest нет item с `Ин 3:16`; Pagefind по `Ин 3:16` возвращает статьи, где встречаются другие `3:16` или nearby Gospel metadata. В jsdom fallback scope `scripture: Ин 3:16` дал 3 результата, но не точный John 3:16.

**Impact:** пользователь получает ложное обещание: UI выглядит как поиск по Библии/ссылкам, но фактически ищет по статьям. Для богословского сайта это высокий trust defect.

**Repair direction options:**

1. Минимальный безопасный fix: убрать/заменить hard-coded suggestions, для которых нет exact result; текст заменить на «поиск по материалам, где указана ссылка».
2. Нормальный fix: добавить deterministic Scripture reference resolver: book aliases + chapter/verse normalization + exact metadata hit before Pagefind.
3. Лучший fix: отдельный mini-index библейских ссылок/перикоп, где `Ин 3:16` не подменяется `2 Тим 3:16`.
4. Permanent guard: every hard-coded suggestion must resolve to an exact or explicitly labelled result.

---

### SEARCH-P2-01 — `/hard-texts/genesis-6/` исключён из search-manifest при включённом Pagefind/sitemap

**Severity:** P2 / owner-decision  
**Type:** discovery / fallback  
**Evidence:** policy inventory and custom manifest scan.

`/hard-texts/genesis-6/`:

```text
indexPolicy=index
pagefindPolicy=include
sitemapPolicy=include
searchManifestPolicy=exclude
pagefindBodyCount=1
```

Это не contract failure, потому что policy явно says `exclude`. Но с точки зрения поиска это странно: важный landing виден поисковикам и Pagefind, но не участвует в manifest fallback/default/recommendations.

**Impact:** при Pagefind failure/offline fallback и в default/recommended states landing не может быть найден как самостоятельная карточка. Query `Бытие 6` уходит в related article, а не в landing.

**Repair direction:** owner decision: либо добавить manifest item для Genesis 6 landing, либо зафиксировать причину exclude в route profile и UI не ожидать его в fallback.

---

### SEARCH-P2-02 — Accessibility debt in listbox pattern

**Severity:** P2  
**Type:** accessibility  
**Evidence:** `js/search.js` generated markup.

Текущая модель:

- input: `aria-autocomplete="list" aria-controls="cp-listbox"`
- list: `role="listbox"`
- items: `<button class="cp-item" role="option" aria-selected="...">`
- active result обновляется visual class + `aria-selected`, но input не получает `aria-activedescendant`.

**Impact:** клавиатурная навигация визуально работает, но screen-reader announcement активного результата не гарантирован. `button role=option` также смешивает два паттерна: command list buttons vs listbox options.

**Repair direction:** выбрать один паттерн:

- Combobox/listbox: `role="combobox"`, `aria-expanded`, `aria-activedescendant`, stable ids на options, roving only through input.
- Или command menu: results как buttons/links без `role=listbox`, с нормальным focus roving.

---

### SEARCH-P2-03 — Dependency vulnerability backlog from `npm audit`

**Severity:** P2 security backlog  
**Type:** supply-chain/build-chain security  
**Evidence:** `npm audit --json` after `npm ci`.

```json
{
  "moderate": 4,
  "high": 2,
  "critical": 0,
  "total": 6
}
```

Packages/advisories:

- `fast-uri` high — host confusion via backslash authority delimiter / introducer.
- `fast-xml-parser` high — repeated DOCTYPE declarations reset entity expansion limits.
- `yaml` moderate — stack overflow via deeply nested YAML collections.
- `yaml-language-server`, `volar-service-yaml`, `@astrojs/language-server` moderate via YAML chain.

**Impact:** mostly dev/build chain rather than shipped `js/search.js`, but still should be tracked because content/build tooling consumes XML/YAML/URLs.

**Repair direction:** run targeted dependency update in separate supply-chain lane, then `npm audit`, full static publication gates, and ensure no Astro/toolchain regression.

---

### SEARCH-P3-01 — Copy-link in search preview hard-codes production origin

**Severity:** P3  
**Type:** staging/dev UX / correctness nuance  
**Evidence:** `js/search.js` preview copy handler.

```js
var t = "https://gospod-bog.ru" + (e.url || "")
```

**Impact:** on local preview, staging, PR previews, or mirrors the copied URL is production even if the user is browsing another origin. For production-only canonical sharing this may be intentional, but it should be explicit.

**Repair direction:** if canonical sharing is intended, label it «Скопировать каноническую ссылку». If not, use `new URL(e.url, location.origin).href`.

---

### SEARCH-P3-02 — Result truncation hides depth and lacks “show more”

**Severity:** P3  
**Type:** UX / missed opportunity  
**Evidence:** `Pagefind` branch slices to 10; manifest fallback slices to 12.

Examples:

```text
Pagefind: Бытие 6 => 54 raw results, UI will show top 10.
Pagefind: благодать => 40 raw results.
```

**Impact:** good for speed, but user has no idea that many more results exist and cannot expand/refine from UI. For library search, this is a discovery ceiling.

**Repair direction:** show raw count from Pagefind, add “ещё N результатов”, or progressive “Показать ещё”.

---

### SEARCH-P3-03 — Shortcut labels drift between routes/platforms

**Severity:** P3  
**Type:** visual polish / UX consistency  
**Evidence:** route labels from jsdom/static probe.

Examples:

```text
/                         => "Поиск (Ctrl+K)"
/nagornaya/chast-3/       => "Поиск (⌘K)"
/hard-texts/genesis-6/    => "Поиск (Ctrl+K)"
```

The actual handler supports both `metaKey` and `ctrlKey`, but route labels differ. On Windows/Linux `⌘K` looks alien; on macOS `Ctrl+K` is less canonical.

**Repair direction:** platform-adaptive label after hydration, or neutral `Ctrl/⌘ K` everywhere.

## 4. Visual audit notes

### Strengths

- Command palette has coherent premium visual language: card, preview column, dark-mode variables, safe-area padding, reduced-motion branch, coarse pointer branch.
- Touch targets are mostly guarded: `.cp-clear`, `.cp-item`, `.cp-preview-btn`, home close button use 44px-ish minimums.
- Mobile hides preview column under 768px, preventing cramped two-column layout.
- CSS includes `prefers-reduced-motion: reduce` and `hover:none/pointer:coarse` handling.
- Home route has additional search a11y/visual guard scripts and passed `home:visual-parity:audit`.

### Visual/UX risks and opportunities

- Mobile loses preview context entirely. Good for space, but no substitute detail panel/expand affordance exists.
- Empty states use strong suggestions, but suggestions are not guaranteed by a corpus contract (`Ин 3:16` issue).
- Status text `N рез.` is compact but not semantically rich; no query echo, no “searched in articles/Pagefind/fallback”.
- Search UX changes across special app/tool routes: command palette vs local atlas search vs no obvious global search.

## 5. Security / “viral” scan

### 5.1 Client search bundle pattern scan

Scanned:

```text
js/search.js
dist/js/search.js
data/search-manifest.json
dist/data/search-manifest.json
sw.js
dist/sw.js
```

Findings:

```text
No eval()
No new Function()
No document.write()
No setTimeout/string execution
No manifest fields matching <script/onerror/onload/javascript:/vbscript:/iframe/object/embed
innerHTML exists in search renderer, but title/description/metadata go through escaping helpers F()/R()/V() in checked branches.
safeUrl blocks javascript/data/vbscript/blob for result URLs.
```

Expected/known patterns:

```text
innerHTML assignments: 17 in search UI renderer
localStorage: 3 uses for recent search history
execCommand('copy'): fallback copy handler
external hard-coded URL: https://gospod-bog.ru for copy-link
```

### 5.2 Supply chain

`npm audit` returned 6 vulnerabilities (2 high, 4 moderate). No critical vulnerabilities. See `SEARCH-P2-03`.

## 6. Recommended repair order

1. **P1 global surface contract:** decide whether unified command palette must exist on every public indexed/searchable route; patch `/karty/avraam/`, `/karty/ishod/`, `/konfessii/russkij-baptizm/`, `/map/`; add a permanent dist guard.
2. **P1 Scripture truthfulness:** remove false exact-verse suggestions or implement exact reference resolver. Do not leave `Ин 3:16` as a promise without exact hit.
3. **P2 Genesis 6 discovery decision:** include `/hard-texts/genesis-6/` in manifest or document why fallback excludes it.
4. **P2 a11y:** normalize combobox/listbox semantics and add `aria-activedescendant` or switch to command-button pattern.
5. **Security lane:** dependency updates with full gates.
6. **Polish:** copy-link origin labeling, result expansion, shortcut label unification.

## 7. Non-findings / confirmed healthy areas

- No duplicate search-manifest URLs or IDs.
- No missing required manifest fields.
- No missing readTime for article/series manifest entries.
- No unsafe manifest URL protocols found.
- Pagefind index exists and count matches `data-pagefind-body` route count.
- SW audit confirms Pagefind bootstrap/data strategies and no fail-open precache.
- Production-like dist does not copy private/build directories.

## 8. Suggested permanent guard snippets

High-value guard idea for future Product PR:

```js
// Fail public searchable routes without global command palette assets,
// unless route profile has explicit globalSearchPolicy: "local-only"/"exclude".
require(route.indexPolicy === 'index' && route.searchManifestPolicy === 'include')
  .toHaveGlobalSearchBootstrap();
```

Hard-coded suggestion guard:

```js
for (const suggestion of SEARCH_SUGGESTIONS) {
  assert(exactResolver(suggestion) || manifestOrPagefindHasExactHit(suggestion),
    `${suggestion}: hard-coded search suggestion has no exact result`);
}
```
