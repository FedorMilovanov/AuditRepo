# ROOT CAUSE ANALYSIS — Pass 15

**Дата:** 2026-07-02  
**HEAD:** d5d9388b  
**Фокус:** Глубокий анализ корневых причин критических багов

---

## 📊 Executive Summary

Проведён **root cause analysis** для 5 критических багов (P1 + P2). Выявлены системные проблемы архитектуры и процесса разработки.

**Ключевые findings:**
- 43 @media queries вместо 5 canonical breakpoints
- 39 PageHead компонентов с 92-93% дублированием
- 38 addEventListener без единого removeEventListener
- 36 копий CSP вместо централизованного компонента
- 9 production routes отсутствуют в sitemap.xml

**Системные проблемы:**
1. Отсутствие Design System (нет единой стратегии)
2. Отсутствие Component Library (нет каталога переиспользуемых компонентов)
3. Отсутствие Code Quality Gates (нет lint rules, automated checks)
4. Отсутствие Cleanup Process (нет регулярного аудита)
5. Migration without Refactoring (copy-paste вместо абстракций)

---

## 🔴 BUG-010: CSS Breakpoint Chaos (P1)

### Симптомы
- 43 @media queries в site.css
- 24 различных breakpoint значения
- Диапазон: 380px — 1180px
- Дубликаты: `@media (max-width:640px)` встречается 5 раз
- Смешение единиц: px и em (63.99em)

### Root Cause Analysis

**1. Отсутствие дизайн-системы**
- Нет единой стратегии адаптивности
- Breakpoints добавлялись ad-hoc по мере необходимости
- Каждый разработчик добавлял свои breakpoint без координации

**2. Отсутствие CSS переменных для breakpoints**
- Значения захардкожены в каждом @media query
- Нет централизованного определения (например, `--bp-mobile: 600px`)
- Невозможно централизованно изменить стратегию

**3. Отсутствие lint rules**
- Нет stylelint правил для enforcement breakpoint strategy
- Нет автоматической проверки дубликатов
- Нет валидации breakpoint values

**4. Legacy code accumulation**
- Старые breakpoints не удаляются при добавлении новых
- Нет процесса regular cleanup
- Нет документации по breakpoint strategy

### Impact
- **Непредсказуемое поведение** на разных viewport sizes
- **Сложность поддержки** — изменение одного breakpoint требует анализа 43 queries
- **Конфликты каскада** — перекрытие стилей на граничных значениях
- **Performance** — браузер обрабатывает 43 media queries на каждый resize

### Recommended Fix
```css
/* 1. Определить CSS переменные */
:root {
  --bp-xs: 480px;
  --bp-sm: 600px;
  --bp-md: 768px;
  --bp-lg: 1024px;
  --bp-xl: 1280px;
}

/* 2. Использовать только эти 5 breakpoints */
@media (max-width: var(--bp-sm)) { ... }
@media (max-width: var(--bp-md)) { ... }
/* и т.д. */

/* 3. Добавить stylelint правило */
/* stylelint.config.js */
module.exports = {
  rules: {
    'media-feature-name-value-allowed-list': {
      'max-width': ['480px', '600px', '768px', '1024px', '1280px'],
      'min-width': ['480px', '600px', '768px', '1024px', '1280px'],
    },
  },
};
```

---

## 🔴 BUG-001: Memory Leak в floating-cluster-controller.js (P1)

### Симптомы
- 38 вызовов `addEventListener`
- 0 вызовов `removeEventListener`
- Утечка памяти при длительной навигации

### Root Cause Analysis

**1. Отсутствие жизненного цикла компонентов**
- Astro компоненты — статические, нет concept "unmount"
- Event listeners добавляются в JavaScript, но не очищаются
- Нет pattern для cleanup при навигации

**2. Использование анонимных функций**
```javascript
// Плохо (анонимная функция, невозможно удалить)
btn.addEventListener('click', function() { openSearch(btn); });

// Хорошо (именованная функция, можно удалить)
function handleSearchClick() { openSearch(btn); }
btn.addEventListener('click', handleSearchClick);
// При cleanup:
btn.removeEventListener('click', handleSearchClick);
```

**3. Отсутствие AbortController pattern**
- Современный подход: использовать AbortController для управления listeners
```javascript
const controller = new AbortController();
document.addEventListener('click', handler, { signal: controller.signal });
// При cleanup:
controller.abort(); // Удаляет все listeners
```

**4. Нет глобального registry для listeners**
- Нет централизованного списка всех registered listeners
- Невозможно массово удалить listeners при navigation
- Нет механизма "dispose" для компонентов

**5. Navigation model mismatch**
- Сайт использует MPA (Multi-Page Application) модель
- При переходе между страницами JavaScript context уничтожается
- Но floating-cluster-controller.js работает на всех страницах
- Listeners накапливаются при SPA-like навигации (если есть)

### Impact
- **Memory leak** — при длительной сессии потребление памяти растёт
- **Performance degradation** — больше listeners → больше callback вызовов
- **Potential crashes** — на мобильных устройствах с ограниченной памятью

### Recommended Fix
```javascript
// 1. Использовать AbortController
class FloatingClusterController {
  constructor() {
    this.controller = new AbortController();
    this.init();
  }
  
  init() {
    const signal = this.controller.signal;
    document.addEventListener('click', this.handleClick, { signal });
    window.addEventListener('scroll', this.handleScroll, { signal });
  }
  
  dispose() {
    this.controller.abort(); // Удаляет все listeners
  }
  
  handleClick = (e) => { ... }
  handleScroll = () => { ... }
}

// 2. При navigation:
const controller = new FloatingClusterController();
// При unmount:
controller.dispose();
```

---

## 🔴 BUG-002: Дублирование 44 компонентов (P1)

### Симптомы
- 39 компонентов `*PageHead.astro`
- 5 компонентов `*PostArticle.astro`
- 92-93% кода идентично между компонентами

### Root Cause Analysis

**1. Migration from legacy HTML**
- Каждый PageHead создан копированием legacy HTML `<head>`
- Нет этапа рефакторинга для выделения общего кода
- "Works, don't touch" mentality

**2. Отсутствие BasePageHead компонента**
```astro
<!-- Должно быть: -->
<BasePageHead 
  title="Джон Гилл (1697–1771). Часть I"
  description="Первая часть серии..."
  canonical="https://gospod-bog.ru/articles/dzhon-gill-chast-1-chelovek/"
  ogImage="https://gospod-bog.ru/images/gill-part1.webp"
/>

<!-- Вместо этого: 39 копий с минимальными различиями -->
```

**3. Различия только в данных, не в структуре**
Анализ diff показывает, что различаются только:
- `<title>` (заголовок статьи)
- `<meta name="description">` (описание)
- `<link rel="canonical">` (URL)
- `<meta property="og:title">` (OG title)
- `<meta property="og:description">` (OG description)
- `<meta property="og:image">` (OG image)

Всё остальное (CSP, viewport, fonts preload, JSON-LD) — идентично.

**4. Отсутствие code review процесса**
- При добавлении нового PageHead не проверялось наличие дублирования
- Нет checklist для "is this component already exists?"
- Нет automated detection duplication

**5. Lack of component library documentation**
- Нет документации "какие компоненты уже существуют"
- Нет каталога переиспользуемых компонентов
- Разработчики не знают о существующих абстракциях

### Impact
- **Maintenance nightmare** — изменение CSP требует правки в 36 файлах
- **Inconsistency risk** — можно случайно пропустить обновление в одном компоненте
- **Code bloat** — 39 файлов × ~100 строк = ~3900 строк дублированного кода
- **Onboarding complexity** — новые разработчики не понимают структуру

### Recommended Fix
```astro
<!-- 1. Создать BasePageHead.astro -->
---
interface Props {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  keywords?: string;
  jsonLd?: object;
}
const { title, description, canonical, ogImage, keywords, jsonLd } = Astro.props;
---
<meta charset="utf-8"/>
<meta http-equiv="Content-Security-Policy" content="..." />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImage} />
{keywords && <meta name="keywords" content={keywords} />}
{jsonLd && <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />}
<!-- Fonts preload, theme-color, etc. -->

<!-- 2. Использовать в GillPart1PageHead.astro -->
---
import BasePageHead from '@/components/BasePageHead.astro';
---
<BasePageHead
  title="Джон Гилл (1697–1771). Часть I: Человек"
  description="Первая часть серии о лондонском пасторе..."
  canonical="https://gospod-bog.ru/articles/dzhon-gill-chast-1-chelovek/"
  ogImage="https://gospod-bog.ru/images/gill-part1.webp"
  keywords="Джон Гилл, биография, XVIII век"
  jsonLd={{...}}
/>
```

---

## 🟡 BUG-030: CSP Duplication (36 копий) (P2)

### Симптомы
- 36 компонентов имеют свою копию CSP meta tag
- CSP практически идентичный (различия в 1-2 директивах)
- Изменение CSP требует правки в 36 файлах

### Root Cause Analysis

**1. CSP не вынесен в общий компонент**
- Каждый PageHead включает свою копию CSP
- Нет компонента `SecurityHeaders.astro`
- Нет централизованного управления security policy

**2. Отсутствие CSP генератора**
```javascript
// Должно быть:
import { generateCSP } from '@/lib/security';
const csp = generateCSP({
  allowYandex: true,
  allowWikimedia: true,
  allowInlineScripts: true,
});
```

**3. Нет environment-based CSP**
- Нет разделения CSP для development/production
- Нет возможности легко добавить новые источники
- Нет версионирования CSP policy

**4. Lack of security review process**
- CSP добавлялся copy-paste из одного компонента в другой
- Нет централизованного security policy document
- Нет автоматической валидации CSP consistency

### Impact
- **Security risk** — при изменении CSP можно пропустить некоторые страницы
- **Maintenance burden** — 36 файлов для одного изменения
- **Inconsistency** — разные страницы могут иметь разную security policy

### Recommended Fix
```astro
<!-- 1. Создать SecurityHeaders.astro -->
---
interface Props {
  allowYandex?: boolean;
  allowWikimedia?: boolean;
}
const { allowYandex = true, allowWikimedia = true } = Astro.props;

const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  allowYandex && "https://mc.yandex.ru https://*.yandex.ru",
  allowWikimedia && "https://commons.wikimedia.org https://upload.wikimedia.org",
  "img-src 'self' data: blob:",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "connect-src 'self'",
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
].filter(Boolean).join('; ');
---
<meta http-equiv="Content-Security-Policy" content={cspDirectives} />
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin" />

<!-- 2. Использовать в BasePageHead.astro -->
<SecurityHeaders allowYandex allowWikimedia />
```

---

## 🟡 BUG-041: Sitemap Missing 9 Routes (P2)

### Симптомы
- Sitemap.xml содержит 43 URL
- Page-ownership.json содержит 52 production routes
- Отсутствует 9 страниц (8 kart + /izbrannoe/)

### Root Cause Analysis

**1. Статический sitemap.xml не обновляется автоматически**
```javascript
// Проблема: copy-legacy-to-dist.js копирует старый sitemap.xml
// Astro генерирует новый sitemap, но он удаляется скриптом
const PUBLIC_ROOT_FILES = [
  'sitemap.xml',  // ← Копируется из legacy, игнорируя Astro-generated
  // ...
];
```

**2. Astro sitemap integration отключена**
```javascript
// astro.config.mjs
export default defineConfig({
  integrations: [
    // sitemap() ← Закомментировано или отсутствует
  ],
});
```

**3. Новые страницы добавляются без обновления sitemap**
- При добавлении новых kart страниц (pavel, shoftim, melachim и т.д.)
- Разработчик забыл добавить их в sitemap.xml
- Нет автоматической проверки "все production routes в sitemap"

**4. /izbrannoe/ — специальный случай**
- Это localStorage-only страница (не индексируется)
- Должна быть исключена из sitemap
- Но нет явного правила для исключения

**5. Отсутствие валидации**
- Нет CI check "sitemap.xml содержит все production routes"
- Нет automated test для sitemap completeness
- Нет warning при расхождении sitemap vs page-ownership

### Impact
- **SEO impact** — поисковые системы не обнаруживают 9 страниц
- **Crawl budget waste** — боты тратят время на неактуальные URL
- **Indexation delay** — новые страницы индексируются медленнее

### Recommended Fix
```javascript
// 1. Включить Astro sitemap integration
// astro.config.mjs
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/izbrannoe'), // Исключить localStorage
    }),
  ],
});

// 2. Удалить sitemap.xml из PUBLIC_ROOT_FILES
// scripts/copy-legacy-to-dist.js
const PUBLIC_ROOT_FILES = [
  // 'sitemap.xml',  // ← Удалить, использовать Astro-generated
  // ...
];

// 3. Добавить CI validation
// scripts/validate-sitemap.js
const ownership = require('./migration/page-ownership.json');
const sitemap = parseXml('./dist/sitemap.xml');
const missingRoutes = ownership.routes
  .filter(r => r.status === 'production-dist' && !r.includes('/izbrannoe'))
  .filter(r => !sitemap.urls.includes(`https://gospod-bog.ru${r}`));

if (missingRoutes.length > 0) {
  console.error(`❌ Missing in sitemap: ${missingRoutes.join(', ')}`);
  process.exit(1);
}
```

---

## 🎯 Общие системные проблемы

### 1. Отсутствие Design System
- Нет единой стратегии для breakpoints, colors, typography
- Каждый компонент определяет свои значения
- Нет централизованного токенов

### 2. Отсутствие Component Library
- Нет каталога переиспользуемых компонентов
- Нет документации "какие компоненты уже существуют"
- Разработчики создают новые компоненты вместо переиспользования

### 3. Отсутствие Code Quality Gates
- Нет lint rules для enforcement consistency
- Нет automated detection duplication
- Нет pre-commit hooks для проверки

### 4. Отсутствие Cleanup Process
- Нет регулярного аудита кода
- Нет процесса удаления мёртвого кода
- Нет metric для code quality tracking

### 5. Migration without Refactoring
- Legacy HTML → Astro migration выполнено copy-paste
- Нет этапа рефакторинга для выделения абстракций
- "Works, don't touch" mentality вместо "Make it better"

---

## 📋 Recommended Actions

### Immediate (Week 1)
1. **BUG-001:** Добавить AbortController pattern в floating-cluster-controller.js
2. **BUG-010:** Определить 5 canonical breakpoints в CSS переменных
3. **BUG-030:** Создать SecurityHeaders.astro компонент

### Short-term (Week 2-3)
4. **BUG-002:** Создать BasePageHead.astro, мигрировать все 39 компонентов
5. Добавить stylelint правила для breakpoints
6. Добавить automated duplication detection

### Medium-term (Month 1-2)
7. Создать Design System документацию
8. Создать Component Library каталог
9. Добавить pre-commit hooks для quality gates
10. Провести регулярный cleanup мёртвого кода

---

## 📊 Metrics

| Metric | Current | Target |
|--------|---------|--------|
| @media queries | 43 | 5 (canonical breakpoints) |
| PageHead components | 39 | 1 (BasePageHead) |
| CSP copies | 36 | 1 (SecurityHeaders) |
| removeEventListener calls | 0 | 38 (matching addEventListener) |
| Code duplication | 92-93% | <20% |
| Sitemap coverage | 43/52 routes | 52/52 routes |

---

**Root Cause Analysis complete. 5 critical bugs analyzed. Systemic issues identified. 🔍🎯**
