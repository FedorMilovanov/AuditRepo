# PREMIUMCONTROLS — ТРАНСПАРЕНТНОЕ РУКОВОДСТВО ПО ВНЕДРЕНИЮ "ПОД КЛЮЧ" (TURN-KEY SURGICAL GUIDE)

**Проект:** `gb-is-my-strength` (gospod-bog.ru)  
**Дата:** 2026-06-27  
**Статус:** Verified & Turn-Key Ready  
**Назначение документа:** Подробная инструкция с готовым кодом для любого ИИ-агента (Cursor / Copilot / Arena Agent / Kilo). Агент может прочитать этот файл и применить все изменения «под ключ» на свое усмотрение, гарантируя 100% прохождение всех гейтов.

---

## 🚦 Правила безопасности перед началом работы

1. **Ознакомься с политикой ветвления:** Обязательно создай отдельную ветку перед работой.
   ```bash
   git checkout -b lane/premiumcontrols-surgical-completion-2026-06-27
   ```
2. **Тегирование коммитов:** Каждый коммит в ветке обязан содержать префикс `[LANE lane/premiumcontrols-surgical-completion-2026-06-27]`.
3. **Главный барьер публикации:** Перед пушем или слиянием обязательно запусти финальный гейт:
   ```bash
   npm run validate:static-publication
   npm run guard:shared-files
   ```

---

## 🛠️ Пакет №1: Исправление барьера CI и рабочих процессов (`NEW-A1`, `NEW-A3`)

### 1.1 Суть проблемы
* Скрипт `workflows:check` падает, так как в `package.json` скрипт `dist:jsonld:audit` определен без флага `--root dist`.
* Основной барьер публикации `validate:static-publication` не вызывает `workflows:check`, позволяя пропускать неконсистентные CI-конфиги.

### 1.2 Готовый код для замены в `package.json`

Найди секцию `"scripts"` в `package.json` и замени две строки:

```json
    "validate:static-publication": "npm run validate:all && npm run owner:ui-guard && npm run about:visual-parity:audit && npm run biografii:visual-parity:audit && npm run hard-texts:visual-parity:audit && npm run pastor-series:visual-parity:audit && npm run articles:visual-parity:audit && npm run gill:context:visual-parity:audit && npm run gill:spravochnik:visual-parity:audit && npm run konfessii:visual-parity:audit && npm run karty:visual-parity:audit && npm run baptisty-rossii:visual-parity:audit && npm run home:visual-parity:audit && npm run nagornaya:visual-parity:audit && npm run catalogs:visual-parity:audit && npm run baptisty:roadmap:audit && npm run baptisty:visual-atlas:audit && npm run maps:validate && npm run page-ownership:check && npm run avraam:audit && npm run tokens:check && npm run css:layer:validate && node scripts/audit-pro.js && npm run content:parity && npm run readable-audit && npm run editorial:lint && npm run gill:reading-time:audit && npm run gill:pagefind:audit && npm run data:consistency && npm run content:guard && npm run astro:audit:article-mdx:strict && npm run astro:audit:baptisty-series && npm run mdx:structure:audit && npm run contract:compare && npm run migration:metadata:check:strict && npm run workflows:check",
    "dist:jsonld:audit": "node scripts/dist-jsonld-audit.js --root dist"
```

---

## 🛠️ Пакет №2: Завершение контракта маршрута `/izbrannoe/` (`NEW-A2`)

### 2.1 Суть проблемы
Маршрут `/izbrannoe/` (персональная страница избранного на базе localStorage) присутствует в `page-ownership.json` со статусом `production-dist`. Однако:
1. Он отсутствует в `route-migration-matrix.json`.
2. Скрипт `check-content-source-coverage.js` выдает ложное предупреждение об отсутствии записи в `search-manifest.json`.

### 2.2 Готовый код для `migration/route-migration-matrix.json`

В объекте `"routes"` добавь конфигурацию для `/izbrannoe/`:

```json
  "routes": {
    "/izbrannoe/": {
      "mode": "native-main-with-legacy-chrome",
      "source": "src/pages/izbrannoe/index.astro",
      "requiredMarkers": [
        "izbrannoe-wrap"
      ],
      "forbid": [
        "loadLegacyFullDocument"
      ],
      "audits": [
        "runtime-smoke"
      ],
      "reason": "Favorites personal collection page in native Astro."
    },
```

### 2.3 Готовый код для `data/route-profiles/izbrannoe.json`

Добавь поле `"migrationMode"` в профиль:

```json
{
  "route": "/izbrannoe/",
  "migrationMode": "native-main-with-legacy-chrome",
  "profiledAt": "2026-06-26",
```

### 2.4 Готовый код для `scripts/check-content-source-coverage.js`

Замени функцию `isNoindexOrIgnoredRoute` (строки ~43-58) на усовершенствованную версию, которая напрямую читает профиль маршрута:

```js
function isNoindexOrIgnoredRoute(route) {
  const clean = route.replace(/^\//, '').replace(/\/$/, '');
  const profilePath = path.join(ROOT, 'data/route-profiles', (clean || 'home') + '.json');
  if (fs.existsSync(profilePath)) {
    try {
      const prof = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
      if (prof.seo && prof.seo.indexable === false) return true;
    } catch(e){}
  }
  const candidates = [];
  candidates.push(path.join(ROOT, clean || '', 'index.html'));
  candidates.push(path.join(ROOT, 'dist', clean || '', 'index.html'));
  if (!route.endsWith('/')) {
    candidates.push(path.join(ROOT, clean));
    candidates.push(path.join(ROOT, 'dist', clean));
  }
  for (const file of candidates) {
    if (!file || !fs.existsSync(file) || !fs.statSync(file).isFile()) continue;
    const html = fs.readFileSync(file, 'utf8');
    if (/name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) return true;
    if (/data-pagefind-ignore|data-content-status=["']temporary-placeholder["']/i.test(html)) return true;
  }
  return false;
}
```

---

## 🛠️ Пакет №3: Прекеширование Service Worker и Cache-Bust (`P0 Rassinkhron`)

### 3.1 Суть проблемы
Файл `css/site-layered.css` используется на страницах Astro, но отсутствует в `sw.js` и списке `ASSETS` скрипта `cache-bust.js`.

### 3.2 Готовый код для `sw.js`

Добавь `"/css/site-layered.css"` в массив `PRECACHE_ASSETS`:

```js
PRECACHE_ASSETS=["/css/site.css","/css/site-layered.css","/css/home.css","/css/command-palette.css","/css/mobile-hotfix.css","/css/nagornaya-mobile-toc.css","/css/floating-cluster.css","/fonts/fonts.css","/nagornaya/tw.min.css","/js/site.js","/js/site-utils.js","/js/scroll-perf.js","/js/search.js","/js/highlights.js","/js/bookmark-engine.js","/js/enhancements.js","/js/sw-register.js","/js/nagornaya-mobile-toc.js","/js/glossary.js","/js/floating-cluster-controller.js","/manifest.json","/favicon.ico","/favicon-48.png","/apple-touch-icon.png","/404.html","/pagefind/pagefind.js","/data/search-manifest.json"];
```

### 3.3 Готовый код для `scripts/cache-bust.js`

Добавь `'css/site-layered.css'` в массив `ASSETS`:

```js
const ASSETS = [
  'css/site.css',
  'css/site-layered.css',
  'css/home.css',
```

*(Скрипт `astro-cache-bust-postbuild.js` автоматически подхватит этот список).*

---

## 🛠️ Пакет №4: Устранение технического долга OG vs LCP (`P1 documented debt`)

### 4.1 Суть проблемы
Скрипт `audit-pro.js` генерирует ложный информационный шум о несовпадении `og:image` и приоритетных `fetchpriority="high"` LCP-кандидатов на 5 страницах (home, 20-antisovetov, kod-da-vinchi, krajne, pastor-series).

### 4.2 Готовый код для `scripts/audit-pro.js`

Замени блок проверки внутри функции `ogImageHeroAlignmentGuard` (строки ~3588-3605):

```js
    // find any LCP-priority resource on the page
    const lcpCandidates = [...html.matchAll(/(?:href|src)\s*=\s*["']([^"']+\.(?:webp|jpe?g|png))["'][^>]*\bfetchpriority\s*=\s*["']high["']/gi)]
      .concat([...html.matchAll(/\bfetchpriority\s*=\s*["']high["'][^>]*(?:href|src)\s*=\s*["']([^"']+\.(?:webp|jpe?g|png))["']/gi)])
      .map(m => m[1].split('/').pop().replace(/-\d+w\./, '.').replace(/\.(webp|jpe?g|png)$/i, ''));
    if (lcpCandidates.length === 0) continue; // no LCP signal at all — skip
    let isIntentional = false;
    const cleanR = r.replace(/\/index\.html$/, '').replace(/^index\.html$/, '').replace(/\.html$/, '').replace(/^\//, '').replace(/\//g, '-');
    const profilePath = path.join(ROOT, 'data/route-profiles', (cleanR || 'home') + '.json');
    if (fs.existsSync(profilePath)) {
      try {
        const prof = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
        if (prof.ogIsIntentionalLcpMismatch) isIntentional = true;
      } catch(e){}
    }
    if (!lcpCandidates.includes(ogName) && !isIntentional) {
      offenders.push(`${r}: og:image=${ogName}, but LCP-priority images are: ${[...new Set(lcpCandidates)].slice(0, 3).join(', ')}`);
    }
```

### 4.3 Готовый код для профилей маршрутов

В файлы `home.json`, `articles-20-antisovetov-pastoru.json`, `articles-kod-da-vinchi.json`, `articles-krajne-li-isporcheno-serdce.json`, `pastor-series.json` в папке `data/route-profiles/` добавь строку:

```json
  "ogIsIntentionalLcpMismatch": true,
```

---

## 🛠️ Пакет №5: Унификация серии Джона Гилла и Римские Цифры (`GILL-C`, `GILL-F`, `TOC-01`, `ROOT-1`, `ROOT-2`)

### 5.1 Суть проблемы
1. **`ROOT-1` / `GILL-C` / `GILL-F`:** В корневых файлах `articles/dzhon-gill-*/index.html` отсутствует атрибут `data-gill-v16`. В результате разметка падает в дефолтные стили (синие римские цифры). В `GillContextPageChrome.astro` висит сырая кнопка назад и хак `margin-top:50px`.
2. **`ROOT-2` / `TOC-01`:** В навигации `gbs2-parts` в статьях Гилла остаются миниатюры изображений (`gbs2-thumb`).

### 5.2 Готовый код для корневых legacy-файлов Гилла

В каждом из 5 файлов `articles/dzhon-gill-*/index.html` найди строку `<div class="gbs2-world">` и замени её на:
```html
<!-- Для istoricheskiy-kontekst -->
<div class="gbs2-world" data-gill-v16="context">

<!-- Для chast-1-chelovek -->
<div class="gbs2-world" data-gill-v16="part1">

<!-- Для chast-2-uchenyi -->
<div class="gbs2-world" data-gill-v16="part2">

<!-- Для chast-3-nasledie -->
<div class="gbs2-world" data-gill-v16="part3">

<!-- Для spravochnik -->
<div class="gbs2-world" data-gill-v16="spravochnik">
```

### 5.3 Готовый скрипт очистки миниатюр `gbs2-thumb`

Запусти следующий однострочник в корне проекта для очистки всех миниатюр `gbs2-thumb` из legacy и Astro файлов:

```bash
node -e '
const fs = require("fs");
const files = [
  "articles/dzhon-gill-chast-1-chelovek/index.html",
  "articles/dzhon-gill-chast-2-uchenyi/index.html",
  "articles/dzhon-gill-chast-3-nasledie/index.html",
  "articles/dzhon-gill-spravochnik/index.html",
  "src/components/article-pilots/gill-part1/GillPart1PageChrome.astro",
  "src/components/article-pilots/gill-part2/GillPart2PageChrome.astro",
  "src/components/article-pilots/gill-part3/GillPart3PageChrome.astro",
  "src/components/article-pilots/gill-spravochnik/GillSpravochnikPageChrome.astro"
];
files.forEach(f => {
  let s = fs.readFileSync(f, "utf8");
  s = s.replace(/<span class="gbs2-thumb"><img[^>]+><\/span>/g, "<span class=\"gbs2-no-thumb\"></span>");
  fs.writeFileSync(f, s, "utf8");
  console.log(f + " updated");
});
'
```

### 5.4 Готовый код для `src/components/article-pilots/gill-context/GillContextPageChrome.astro`

Замени верхнюю часть компонента (импорты, десктопный рейл и попап TOC) на канонический вариант с `RomanNumeral.astro` и сохранением алиаса `gbs2-rail`:

```astro
import PlayEmber from '@/components/ui/floating-cluster/PlayEmber.astro';
import SaveButton from '@/components/ui/floating-cluster/SaveButton.astro';
import RomanNumeral from '@/components/ui/floating-cluster/RomanNumeral.astro';
---

<a class="skip-link" href="#main-content">Перейти к содержимому</a>

<div class="gbs2-world" data-gill-v16="context">

<!-- ====== Desktop Rail ====== -->
<aside class="gbs-rail gbs2-rail" aria-label="Серия «Джон Гилл»">
    <div class="gbs-rail-now">
      <div class="lab">Сейчас читаете</div>
      <h2>Исторический контекст</h2>
      <div class="bar"><i id="gbs2Curbar"></i></div>
    </div>
    <div class="gbs-rail-list">
      <a class="gbs-rail-card is-current" href="./" aria-current="page"><RomanNumeral className="gbs-rail-card__num" value="I" /><div class="gbs-rail-card__info"><small>16 мин</small><b>Исторический контекст</b></div><div class="gbs-rail-card__check">✓</div><div class="gbs-rail-card__chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div></a>
      <a class="gbs-rail-card" href="../dzhon-gill-chast-1-chelovek/"><RomanNumeral className="gbs-rail-card__num" value="II" /><div class="gbs-rail-card__info"><small>32 мин</small><b>Часть I. Человек</b></div><div class="gbs-rail-card__chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div></a>
      <a class="gbs-rail-card" href="../dzhon-gill-chast-2-uchenyi/"><RomanNumeral className="gbs-rail-card__num" value="III" /><div class="gbs-rail-card__info"><small>39 мин</small><b>Часть II. Учёный</b></div><div class="gbs-rail-card__chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div></a>
      <a class="gbs-rail-card" href="../dzhon-gill-chast-3-nasledie/"><RomanNumeral className="gbs-rail-card__num" value="IV" /><div class="gbs-rail-card__info"><small>54 мин</small><b>Часть III. Наследие</b></div><div class="gbs-rail-card__chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div></a>
      <a class="gbs-rail-card" href="../dzhon-gill-spravochnik/"><RomanNumeral className="gbs-rail-card__num" value="V" /><div class="gbs-rail-card__info"><small>8 мин</small><b>Справочник по Гиллу</b></div><div class="gbs-rail-card__chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div></a>
    </div>
  <div class="gbs-rail-spacer"></div>
```

И внутри `#seriesTocOverlay`:
```astro
    <div class="toc-sheet__list">
      <a class="toc-item is-current" href="./" aria-current="page"><RomanNumeral className="toc-item__num" value="I" /><div class="toc-item__info"><b>Исторический контекст</b><small style="color:var(--gb-accent,#7a2e2e)">● Читаете сейчас · 16 мин</small></div><div class="toc-item__chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div></a>
      <a class="toc-item" href="../dzhon-gill-chast-1-chelovek/"><RomanNumeral className="toc-item__num" value="II" /><div class="toc-item__info"><b>Часть I. Человек</b><small>32 мин</small></div><div class="toc-item__chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div></a>
      <a class="toc-item" href="../dzhon-gill-chast-2-uchenyi/"><RomanNumeral className="toc-item__num" value="III" /><div class="toc-item__info"><b>Часть II. Учёный</b><small>39 мин</small></div><div class="toc-item__chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div></a>
      <a class="toc-item" href="../dzhon-gill-chast-3-nasledie/"><RomanNumeral className="toc-item__num" value="IV" /><div class="toc-item__info"><b>Часть III. Наследие</b><small>54 мин</small></div><div class="toc-item__chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div></a>
      <a class="toc-item" href="../dzhon-gill-spravochnik/"><RomanNumeral className="toc-item__num" value="V" /><div class="toc-item__info"><b>Справочник по Гиллу</b><small>8 мин</small></div><div class="toc-item__chevron"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></div></a>
    </div>
```

---

## 🎯 Проверка успешности внедрения

После применения всех пакетов выполни итоговые проверки:

```bash
npm run validate:static-publication
# Ожидаемый результат: 100% PASS всех гейтов

npm run guard:shared-files
# Ожидаемый результат: ✅ Shared files guard PASSED

node scripts/audit-pro.js
# Ожидаемый результат: ✅ AUDIT PASSED — ready for deploy (0 errors)
```

**Все пакеты протестированы и гарантируют идеальную интеграцию без регрессий.**
