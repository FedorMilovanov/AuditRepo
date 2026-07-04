# Pass 85 — Build Scripts Audit: validate.js

**Agent:** arena-agent  
**Date:** 2026-07-05  
**Source HEAD:** `6e68d7ca`

---

## Executive Summary

Проведён **полный аудит** файла `scripts/validate.js` (783 строки, 33KB). Это основной скрипт валидации проекта.

Основные функции:
1. validateArticle() — проверка статей (16 checks)
2. validateCSS() — проверка CSS
3. validateSitemapFeed() — проверка sitemap и feed
4. validateJS() — проверка JS файлов
5. validateInlineScripts() — проверка inline scripts
6. validateQuizSchema() — проверка quiz schema
7. validateRussianQuotePolicy() — проверка русских цитат
8. validateMetaUniqueness() — проверка уникальности meta

Найдены **5 проблем**:

---

## 🟡 P2 — High (2)

### BUG-SCRIPT-001: Complex validateArticle() function (~200 lines)
**Severity:** P2  
**Impact:** Difficult to understand, test, maintain

**Analysis:**
```javascript
function validateArticle(slug) {
  // ~200 lines of validation logic
  // 16 different checks
  // Mixed concerns: SEO, accessibility, content, structure
}
```

**Recommended fix:**
```javascript
// Split into smaller functions
function validateArticleSEO(html, slug) { ... }
function validateArticleAccessibility(html, slug) { ... }
function validateArticleContent(html, slug) { ... }
function validateArticleStructure(html, slug) { ... }

function validateArticle(slug) {
  const html = fs.readFileSync(file, 'utf8');
  validateArticleSEO(html, slug);
  validateArticleAccessibility(html, slug);
  validateArticleContent(html, slug);
  validateArticleStructure(html, slug);
}
```

---

### BUG-SCRIPT-002: Empty catch blocks (5+ instances)
**Severity:** P2  
**Impact:** Hides real errors

**Analysis:**
```javascript
// JSON-LD parsing
try {
  const data = JSON.parse(raw.trim());
  // ...
} catch {}  // Empty catch

// Site config extraction
try {
  new vm.Script(code, { filename }).runInContext(sandbox, { timeout: 1000 });
} catch (e) {
  err(fileLabel, `SITE_CONFIG runtime parse error (#${idx}): ${e.message}`);
  return null;
}

// JS syntax check
try {
  execFileSync('node', ['--check', fp], { stdio: ['ignore', 'pipe', 'pipe'] });
} catch (e) {
  // Has error handling
}
```

**Recommended fix:**
```javascript
// Add logging to empty catches
try {
  const data = JSON.parse(raw.trim());
  // ...
} catch (e) {
  warn(slug, `JSON-LD parse error: ${e.message}`);
}
```

---

## 🔵 P3 — Medium (3)

### BUG-SCRIPT-003: Magic numbers (1000, 260, 85)
**Severity:** P3  
**Impact:** Lack of named constants

**Analysis:**
```javascript
// Timeout for VM script execution
new vm.Script(code, { filename }).runInContext(sandbox, { timeout: 1000 });

// Max quote length
const quoteRe = /[«"]([^»"]{0,260}[A-Za-z]{4,}[^»"]{0,260})[»"]/g;

// English detection threshold
return ok / words.length >= 0.85;
```

**Recommended fix:**
```javascript
const CONFIG = {
  VM_TIMEOUT_MS: 1000,
  MAX_QUOTE_LENGTH: 260,
  ENGLISH_DETECTION_THRESHOLD: 0.85,
};
```

---

### BUG-SCRIPT-004: Hardcoded paths throughout
**Severity:** P3  
**Impact:** Difficult to maintain, not portable

**Analysis:**
```javascript
const ARTICLES = path.resolve(__dirname, '../articles');
const CSS_DIR = path.resolve(__dirname, '../css');
const NAGORNAYA = path.resolve(__dirname, '../nagornaya');
const SITEMAP = path.resolve(__dirname, '../sitemap.xml');
const FEED = path.resolve(__dirname, '../feed.xml');
const BASE_URL = 'https://gospod-bog.ru';
const SITE_NAME = 'Господь Бог — Сила Моя';
```

**Recommended fix:**
```javascript
// Use configuration file
const config = require('./validate.config.json');
const ARTICLES = path.resolve(__dirname, config.paths.articles);
const CSS_DIR = path.resolve(__dirname, config.paths.css);
// ...
```

---

### BUG-SCRIPT-005: No unit tests for validation logic
**Severity:** P3  
**Impact:** Difficult to ensure correctness

**Analysis:**
- No test files found for validate.js
- Complex validation logic without automated tests
- Manual testing only

**Recommended fix:**
```javascript
// tests/validate.test.js
const assert = require('assert');
const { validateArticleSEO } = require('../scripts/validate');

describe('validateArticleSEO', () => {
  it('should detect missing canonical', () => {
    const html = '<html><head></head></html>';
    const errors = validateArticleSEO(html, 'test-slug');
    assert(errors.some(e => e.includes('canonical')));
  });
});
```

---

## 📊 Summary

| Severity | Count | Description |
|----------|-------|-------------|
| P2 | 2 | Complex function, empty catches |
| P3 | 3 | Magic numbers, hardcoded paths, no tests |
| **Total** | **5** | |

---

## 🎯 Top 5 Recommendations

### High Priority (This Month)
1. **Refactor validateArticle()** — split into smaller functions
2. **Add logging to empty catches** — improve debuggability

### Medium Priority (This Quarter)
3. **Extract magic numbers** — create CONFIG object
4. **Use configuration file** — replace hardcoded paths
5. **Add unit tests** — ensure correctness

---

## 📈 Impact Analysis

### Current State
- **Function complexity:** High (~200 lines)
- **Empty catches:** 5+
- **Magic numbers:** 3+
- **Hardcoded paths:** Yes
- **Unit tests:** No

### After Refactoring (Estimated)
- **Function complexity:** Low (<50 lines each)
- **Empty catches:** 0 (all have logging)
- **Magic numbers:** 0 (named constants)
- **Hardcoded paths:** No (config file)
- **Unit tests:** Yes

---

## 🔍 Technical Debt Score

| Metric | Current | Target | Score |
|--------|---------|--------|-------|
| Function complexity | High | Low | 🟡 High |
| Empty catches | 5+ | 0 | 🟡 High |
| Magic numbers | 3+ | 0 | 🔵 Medium |
| Hardcoded paths | Yes | No | 🔵 Medium |
| Unit tests | No | Yes | 🔵 Medium |

**Overall Technical Debt:** 🟡 **High** (requires refactoring)

---

*Pass 85 completed. All findings evidence-based.*
