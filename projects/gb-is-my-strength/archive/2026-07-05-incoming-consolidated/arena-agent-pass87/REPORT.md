# Pass 87 — Configuration Files Audit: package.json

**Agent:** arena-agent  
**Date:** 2026-07-05  
**Source HEAD:** `8c318010` (updated by other agents)

---

## Executive Summary

Проведён **полный аудит** файла `package.json` (161 строка, 15KB). Это конфигурация npm для проекта.

Основные компоненты:
1. 100+ npm scripts
2. validate:static-publication — 30+ проверок в одной строке
3. Node.js >=22.12.0
4. Astro 6.4.6, React 19.2.7, TypeScript 6.0.3

Найдены **3 проблемы**:

---

## 🟡 P2 — High (1)

### BUG-CONFIG-001: Too many npm scripts (100+)
**Severity:** P2  
**Impact:** Difficult to maintain, understand, and use

**Analysis:**
```json
{
  "scripts": {
    "migration:matrix:check": "...",
    "content:sources:check": "...",
    "migration:metadata:check": "...",
    // ... 100+ more scripts
  }
}
```

**Problems:**
1. **100+ scripts** — too many to remember and maintain
2. **Complex naming** — difficult to understand what each script does
3. **Long script chains** — validate:static-publication has 30+ checks in one line

**Recommended fix:**
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

---

## 🔵 P3 — Medium (2)

### BUG-CONFIG-002: Long script chains in validate:static-publication
**Severity:** P3  
**Impact:** Difficult to debug, slow feedback

**Analysis:**
```json
"validate:static-publication": "npm run validate:all && npm run owner:ui-guard && npm run about:visual-parity:audit && npm run biografii:visual-parity:audit && ... (30+ more checks)"
```

**Problems:**
1. **30+ checks in one line** — difficult to debug which check failed
2. **Sequential execution** — slow feedback (all checks run even if first fails)
3. **No parallelization** — could run independent checks in parallel

**Recommended fix:**
```json
{
  "scripts": {
    "validate:static-publication": "npm-run-all --parallel validate:visual-parity validate:content validate:structure",
    "validate:visual-parity": "npm-run-all --parallel about:visual-parity:audit biografii:visual-parity:audit ...",
    "validate:content": "npm run content:parity && npm run editorial:lint",
    "validate:structure": "npm run mdx:structure:audit && npm run contract:compare"
  }
}
```

---

### BUG-CONFIG-003: Outdated description
**Severity:** P3  
**Impact:** Misleading information

**Analysis:**
```json
{
  "description": "Build scripts for gospod-bog.ru — AUDIT V2 + AUDIT_10_OF_10 patches applied."
}
```

**Problems:**
1. **Outdated** — "AUDIT V2 + AUDIT_10_OF_10" sounds like old audit patches
2. **Misleading** — doesn't describe current project state

**Recommended fix:**
```json
{
  "description": "Gospod Bog — theological library and blog (Astro + legacy HTML)"
}
```

---

## 📊 Summary

| Severity | Count | Description |
|----------|-------|-------------|
| P2 | 1 | Too many npm scripts (100+) |
| P3 | 2 | Long script chains, outdated description |
| **Total** | **3** | |

---

## 🎯 Top 3 Recommendations

### High Priority (This Month)
1. **Organize npm scripts** — group by category, use npm-run-all

### Medium Priority (This Quarter)
2. **Parallelize validate:static-publication** — use npm-run-all --parallel
3. **Update description** — reflect current project state

---

## 📈 Impact Analysis

### Current State
- **npm scripts:** 100+ (too many)
- **Script organization:** Flat structure
- **Execution:** Sequential
- **Description:** Outdated

### After Refactoring (Estimated)
- **npm scripts:** 50-60 (organized)
- **Script organization:** Grouped by category
- **Execution:** Parallel where possible
- **Description:** Current

---

## 🔍 Technical Debt Score

| Metric | Current | Target | Score |
|--------|---------|--------|-------|
| npm scripts count | 100+ | 50-60 | 🟡 High |
| Script organization | Flat | Grouped | 🟡 High |
| Execution | Sequential | Parallel | 🔵 Medium |
| Description | Outdated | Current | 🔵 Medium |

**Overall Technical Debt:** 🟡 **High** (requires reorganization)

---

*Pass 87 completed. All findings evidence-based.*
