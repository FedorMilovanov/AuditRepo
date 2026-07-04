# Action Plan — gb-is-my-strength Technical Debt Remediation

**Created:** 2026-07-05  
**Based on:** 26 passes, 141 findings  
**Source HEAD:** `dea91376`  
**Total Technical Debt:** 141 open issues / 32 closed

---

## Executive Summary

Этот документ содержит **приоритизированный план действий** для исправления 141 найденной проблемы в проекте gb-is-my-strength. План разбит на 4 фазы с оценкой времени и зависимостями.

**Общая оценка времени:** 8-10 недель (1 опытный разработчик full-time)

---

## 🚨 Phase 1: Critical Fixes (1-2 weeks)

**Цель:** Исправить критические проблемы безопасности и стабильности  
**Приоритет:** CRITICAL  
**Оценка времени:** 1-2 недели

### 1.1 Unminify All JS Files (P1 — 2-3 дня)

**Проблема:** 11 минифицированных JS файлов в VCS (354KB)  
**Impact:** Невозможно отлаживать, ревьюить, поддерживать

**Шаги:**
1. Найти исходные (неминифицированные) версии всех 11 JS файлов
2. Заменить минифицированные версии на исходные
3. Настроить build pipeline для минификации:
   ```json
   // package.json
   {
     "scripts": {
       "build:js": "terser js/*.js --compress --mangle --output dist/js/"
     }
   }
   ```
4. Добавить `dist/js/` в `.gitignore`
5. Обновить все HTML файлы чтобы использовать `dist/js/` вместо `js/`

**Проверка:**
- [ ] Все 11 JS файлов неминифицированы в VCS
- [ ] Build pipeline минифицирует JS в dist/
- [ ] HTML файлы используют dist/js/
- [ ] Сайт работает корректно

**Зависимости:** Нет

---

### 1.2 Add Cleanup Systems to All JS Files (P1 — 3-4 дня)

**Проблема:** 314 memory leaks (339 addEventListener vs 25 removeEventListener)  
**Impact:** Memory leaks на SPA navigation, performance degradation

**Шаги:**
1. Добавить AbortController pattern ко всем JS файлам:
   ```javascript
   // В начале каждого файла
   const abortCtrl = new AbortController();
   const listeners = [];
   
   function addCleanListener(target, type, fn, options) {
     const opts = Object.assign({}, options, { signal: abortCtrl.signal });
     target.addEventListener(type, fn, opts);
     listeners.push({ target, type, fn, opts });
   }
   
   // Cleanup on page unload
   window.addEventListener('beforeunload', function() {
     abortCtrl.abort();
     listeners.length = 0;
   });
   ```

2. Заменить все `addEventListener` на `addCleanListener` в:
   - site.js (61 instances)
   - enhancements.js (10 instances)
   - search.js (22 instances)
   - nagornaya-mobile-toc.js (26 instances)
   - bookmark-engine.js (5 instances)
   - highlights.js (8 instances)
   - glossary.js (3 instances)
   - sw-register.js (2 instances)
   - site-utils.js (3 instances)
   - scroll-perf.js (2 instances)
   - floating-cluster-controller.js (200+ instances)

3. Протестировать все страницы на memory leaks:
   - Открыть DevTools → Memory
   - Навигировать между страницами
   - Проверить что memory не растёт

**Проверка:**
- [ ] Все JS файлы используют addCleanListener
- [ ] Memory не растёт при навигации
- [ ] Все event listeners удаляются на beforeunload
- [ ] Сайт работает корректно

**Зависимости:** 1.1 (unminify JS files)

---

### 1.3 Sanitize All innerHTML Assignments (P1 — 2-3 дня)

**Проблема:** 138+ innerHTML assignments (XSS risk)  
**Impact:** XSS vulnerabilities, security risk

**Шаги:**
1. Установить DOMPurify:
   ```bash
   npm install dompurify
   ```

2. Заменить все innerHTML assignments:
   ```javascript
   // Before
   element.innerHTML = userInput;
   
   // After
   import DOMPurify from 'dompurify';
   element.innerHTML = DOMPurify.sanitize(userInput);
   ```

3. Приоритет файлов:
   - site.js (61 instances) — CRITICAL
   - enhancements.js (10 instances) — HIGH
   - search.js (22 instances) — HIGH
   - highlights.js (8 instances) — MEDIUM
   - bookmark-engine.js (5 instances) — MEDIUM
   - glossary.js (3 instances) — LOW

4. Для static content использовать createElement:
   ```javascript
   // Before
   element.innerHTML = '<span class="title">' + title + '</span>';
   
   // After
   const span = document.createElement('span');
   span.className = 'title';
   span.textContent = title;  // Safe
   element.appendChild(span);
   ```

**Проверка:**
- [ ] Все innerHTML assignments sanitized или используют createElement
- [ ] Нет XSS vulnerabilities (проверить с OWASP ZAP)
- [ ] Сайт работает корректно

**Зависимости:** 1.1 (unminify JS files)

---

### 1.4 Add Logging to All Empty Catch Blocks (P1 — 1-2 дня)

**Проблема:** 91+ empty catch blocks (hidden errors)  
**Impact:** Difficult to debug, hidden errors

**Шаги:**
1. Найти все empty catch blocks:
   ```bash
   grep -rn "catch.*{}" js/
   ```

2. Добавить logging:
   ```javascript
   // Before
   try {
     // ...
   } catch {}
   
   // After
   try {
     // ...
   } catch (e) {
     console.error('[ComponentName] Error:', e);
   }
   ```

3. Приоритет файлов:
   - site.js (20 instances) — CRITICAL
   - enhancements.js (5 instances) — HIGH
   - search.js (8 instances) — HIGH
   - floating-cluster-controller.js (30+ instances) — HIGH
   - bookmark-engine.js (3 instances) — MEDIUM
   - highlights.js (2 instances) — LOW
   - glossary.js (2 instances) — LOW

**Проверка:**
- [ ] Нет empty catch blocks
- [ ] Все ошибки логируются
- [ ] Сайт работает корректно

**Зависимости:** 1.1 (unminify JS files)

---

## 🟡 Phase 2: CSS Refactoring (2-3 weeks)

**Цель:** Уменьшить CSS technical debt  
**Приоритет:** HIGH  
**Оценка времени:** 2-3 недели

### 2.1 Remove Unnecessary !important Declarations (P2 — 1 неделя)

**Проблема:** 1047 !important declarations (specificity wars)  
**Impact:** Difficult to maintain, specificity wars

**Шаги:**
1. Проанализировать все !important declarations:
   ```bash
   grep -rn "!important" css/ | wc -l  # 1047
   ```

2. Приоритет файлов:
   - floating-cluster.css (524 instances) — CRITICAL
   - site.css (202 instances) — HIGH
   - mobile-hotfix.css (142 instances) — HIGH
   - nagornaya-mobile-toc.css (135 instances) — HIGH

3. Для каждого !important:
   - Проверить можно ли убрать
   - Если да — убрать и увеличить specificity selector
   - Если нет — добавить комментарий почему нужен

4. Пример рефакторинга:
   ```css
   /* Before */
   .button { color: red !important; }
   
   /* After */
   .container .button { color: red; }  /* Higher specificity */
   ```

**Проверка:**
- [ ] !important declarations < 100 (целевой показатель)
- [ ] Сайт работает корректно
- [ ] Нет visual regressions

**Зависимости:** Нет

---

### 2.2 Refactor Specificity Wars (P2 — 1 неделя)

**Проблема:** Specificity wars в floating-cluster.css  
**Impact:** Difficult to maintain, unpredictable styling

**Шаги:**
1. Проанализировать floating-cluster.css:
   - 524 !important declarations
   - 4 layers of specificity
   - Complex selectors

2. Рефакторинг strategy:
   - Использовать CSS layers (@layer)
   - Уменьшить specificity selectors
   - Consolidate duplicate rules

3. Пример:
   ```css
   /* Before */
   .floating-cluster .button { color: red !important; }
   .floating-cluster.active .button { color: blue !important; }
   
   /* After */
   @layer components {
     .floating-cluster .button { color: red; }
   }
   @layer components.active {
     .floating-cluster.active .button { color: blue; }
   }
   ```

**Проверка:**
- [ ] Specificity wars resolved
- [ ] Сайт работает корректно
- [ ] Нет visual regressions

**Зависимости:** 2.1 (remove !important)

---

### 2.3 Consolidate Duplicate CSS (P2 — 3-5 дней)

**Проблема:** Duplicate CSS rules across files  
**Impact:** Larger bundle size, maintenance burden

**Шаги:**
1. Найти duplicate CSS rules:
   ```bash
   # Найти duplicate selectors
   grep -h "^\\." css/*.css | sort | uniq -d
   ```

2. Consolidate duplicates в общий файл:
   - Создать `css/common.css`
   - Переместить общие правила
   - Импортировать во все файлы

3. Удалить duplicates из оригинальных файлов

**Проверка:**
- [ ] Нет duplicate CSS rules
- [ ] Bundle size уменьшился
- [ ] Сайт работает корректно

**Зависимости:** 2.1, 2.2

---

## 🔵 Phase 3: Code Quality (2-3 weeks)

**Цель:** Улучшить качество кода  
**Приоритет:** MEDIUM  
**Оценка времени:** 2-3 недели

### 3.1 Refactor Complex Functions (P2 — 1 неделя)

**Проблема:** Complex functions (200+ lines)  
**Impact:** Difficult to understand, test, maintain

**Шаги:**
1. Рефакторить validateArticle() в validate.js:
   ```javascript
   // Before: 200 lines
   function validateArticle(slug) { ... }
   
   // After: 4 functions < 50 lines each
   function validateArticleSEO(html, slug) { ... }
   function validateArticleAccessibility(html, slug) { ... }
   function validateArticleContent(html, slug) { ... }
   function validateArticleStructure(html, slug) { ... }
   ```

2. Рефакторить другие complex functions:
   - validate.js: validateArticle() (200 lines)
   - floating-cluster-controller.js: initPlayExpand() (200 lines)
   - enhancements.js: makeGenericRuntime() (150 lines)

**Проверка:**
- [ ] Все функции < 50 lines
- [ ] Код легче читать
- [ ] Сайт работает корректно

**Зависимости:** Phase 1 complete

---

### 3.2 Extract Magic Numbers to Constants (P2 — 3-5 дней)

**Проблема:** 100+ magic numbers across all files  
**Impact:** Difficult to understand, maintain

**Шаги:**
1. Создать CONFIG объекты в каждом файле:
   ```javascript
   // site.js
   const CONFIG = {
     YANDEX_METRIKA_ID: '108353327',
     VERSION: '1778943682',
     DEBOUNCE_DELAY_MS: 100,
     MAX_RETRIES: 3,
   };
   ```

2. Заменить все magic numbers:
   ```javascript
   // Before
   ym(108353327, 'init', { ... });
   
   // After
   ym(CONFIG.YANDEX_METRIKA_ID, 'init', { ... });
   ```

3. Приоритет файлов:
   - site.js (30+ instances) — HIGH
   - enhancements.js (15+ instances) — HIGH
   - search.js (10+ instances) — MEDIUM
   - floating-cluster-controller.js (20+ instances) — MEDIUM
   - BaseLayout.astro (5 instances) — LOW

**Проверка:**
- [ ] Нет magic numbers
- [ ] Все константы в CONFIG
- [ ] Сайт работает корректно

**Зависимости:** Phase 1 complete

---

### 3.3 Organize npm Scripts (P2 — 3-5 дней)

**Проблема:** 100+ npm scripts (difficult to maintain)  
**Impact:** Difficult to understand, use

**Шаги:**
1. Организовать scripts по категориям:
   ```json
   {
     "scripts": {
       "test": "npm run test:unit && npm run test:integration",
       "test:unit": "jest",
       "test:integration": "playwright test",
       
       "build": "npm run build:astro && npm run build:legacy",
       "build:astro": "astro build",
       "build:legacy": "node scripts/copy-legacy-to-dist.js",
       
       "validate": "npm run validate:quick && npm run validate:full",
       "validate:quick": "npm run validate:strict",
       "validate:full": "npm run validate:static-publication"
     }
   }
   ```

2. Использовать npm-run-all для parallelization:
   ```bash
   npm install npm-run-all --save-dev
   ```

3. Parallelize validate:static-publication:
   ```json
   {
     "validate:static-publication": "npm-run-all --parallel validate:visual-parity validate:content validate:structure"
   }
   ```

**Проверка:**
- [ ] Scripts организованы по категориям
- [ ] Parallelization работает
- [ ] Все scripts работают

**Зависимости:** Нет

---

## 🟢 Phase 4: Performance (1-2 weeks)

**Цель:** Улучшить performance  
**Приоритет:** MEDIUM  
**Оценка времени:** 1-2 недели

### 4.1 Fix Render-Blocking CSS (P2 — 3-5 дней)

**Проблема:** Render-blocking CSS (slow FCP)  
**Impact:** Slow First Contentful Paint

**Шаги:**
1. Определить critical CSS:
   - Above-the-fold CSS
   - Font CSS
   - Layout CSS

2. Inline critical CSS:
   ```html
   <head>
     <style>
       /* Critical CSS here */
     </style>
     <link rel="preload" href="/css/site.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
   </head>
   ```

3. Defer non-critical CSS:
   ```html
   <link rel="preload" href="/css/mobile-hotfix.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
   ```

**Проверка:**
- [ ] FCP улучшился на 40-50%
- [ ] Сайт работает корректно
- [ ] Нет visual regressions

**Зависимости:** Phase 2 complete

---

### 4.2 Optimize Bundle Size (P2 — 3-5 дней)

**Проблема:** Large bundle size  
**Impact:** Slow loading

**Шаги:**
1. Анализировать bundle size:
   ```bash
   npx webpack-bundle-analyzer dist/js/
   ```

2. Оптимизировать:
   - Удалить unused code
   - Code splitting
   - Tree shaking

3. React optimization:
   - Document React usage
   - Consider alternatives (Alpine.js, vanilla JS)
   - Lazy load React components

**Проверка:**
- [ ] Bundle size уменьшился на 30-50%
- [ ] Сайт работает корректно
- [ ] Performance улучшился

**Зависимости:** Phase 3 complete

---

### 4.3 Document React Usage (P3 — 1-2 дня)

**Проблема:** React integration undocumented  
**Impact:** Unclear why React is needed

**Шаги:**
1. Audit React components:
   ```bash
   find src/components -name "*.tsx" -o -name "*.jsx"
   ```

2. Document в astro.config.mjs:
   ```javascript
   export default defineConfig({
     integrations: [
       mdx(),
       sitemap({ ... }),
       // React used for: genealogy tree, interactive maps, quiz components
       // See: src/components/react/README.md
       react(),
     ],
   });
   ```

3. Создать README.md для React components

**Проверка:**
- [ ] React usage documented
- [ ] README.md создан
- [ ] Clear why React is needed

**Зависимости:** Нет

---

## 📊 Success Metrics

### Phase 1 Success Metrics
- [ ] Все 11 JS файлов неминифицированы
- [ ] Memory leaks < 10 (было 314)
- [ ] innerHTML assignments = 0 (было 138+)
- [ ] Empty catch blocks = 0 (было 91+)

### Phase 2 Success Metrics
- [ ] !important declarations < 100 (было 1047)
- [ ] Specificity wars resolved
- [ ] Duplicate CSS rules = 0
- [ ] CSS bundle size уменьшился на 20%

### Phase 3 Success Metrics
- [ ] Все функции < 50 lines
- [ ] Magic numbers = 0
- [ ] npm scripts организованы

### Phase 4 Success Metrics
- [ ] FCP улучшился на 40-50%
- [ ] Bundle size уменьшился на 30-50%
- [ ] React usage documented

---

## 🎯 Conclusion

Этот action plan содержит **concrete steps** для исправления 141 найденной проблемы. План разбит на 4 фазы с общей оценкой времени **8-10 недель** для одного опытного разработчика full-time.

**Приоритет:**
1. **Phase 1** (Critical) — начать немедленно
2. **Phase 2** (High) — начать после Phase 1
3. **Phase 3** (Medium) — начать после Phase 2
4. **Phase 4** (Medium) — начать после Phase 3

**Общая оценка:** После выполнения всех 4 фаз technical debt уменьшится с **141 open** до **< 20 open** (85% reduction).
