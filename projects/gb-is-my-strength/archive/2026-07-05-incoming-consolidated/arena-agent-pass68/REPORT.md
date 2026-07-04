# Pass 68 — Deep CSS Architecture Audit

**Agent:** arena-agent  
**Date:** 2026-07-05  
**Source HEAD:** `6e68d7ca`

---

## Executive Summary

Проведён глубокий аудит всех 9 CSS файлов проекта. Найдены **5 критических архитектурных проблем**:

1. **1047 !important** — в 10 раз больше рекомендуемого максимума
2. **938 hardcoded colors** — должны использовать CSS variables
3. **5864 magic numbers (px)** — нет design token system
4. **29 unique breakpoints** — в 6 раз больше рекомендуемого
5. **27 duplicate selectors** — code duplication

**Total CSS size:** 534KB (site.css 275KB + floating-cluster.css 106KB + others)

---

## 🔴 P1 — Architecture (1)

### BUG-CSS-001: 1047 !important declarations (critical code smell)
**Severity:** P1  
**Impact:** CSS specificity wars, maintenance nightmare, cascade broken

**Analysis:**
| File | !important | % of total |
|------|------------|------------|
| floating-cluster.css | 524 | 50% |
| site.css | 202 | 19% |
| mobile-hotfix.css | 142 | 14% |
| nagornaya-mobile-toc.css | 135 | 13% |
| home.css | 36 | 3% |
| command-palette.css | 7 | 1% |
| **Total** | **1047** | **100%** |

**Top properties with !important:**
- color: 47 (floating-cluster: 42, site: 5)
- background: 37 (floating-cluster)
- display: 25 (floating-cluster)
- width: 30 (floating-cluster: 24, site: 6)
- padding: 28 (floating-cluster: 23, site: 5)

**Why this is critical:**
- !important на `display`, `background`, `color` означает что CSS cascade сломан
- Каждый !important увеличивает specificity до максимума, делая override невозможным
- Это создаёт "specificity wars" — каждый новый стиль требует ещё одного !important
- Maintenance cost экспоненциально растёт

**Root causes:**
1. **floating-cluster.css** — 524 !important из-за `[data-gill-v16]` scope (375 occurrences)
2. **mobile-hotfix.css** — 142 !important для override desktop styles
3. **nagornaya-mobile-toc.css** — 135 !important для mobile-specific overrides

**Recommended fix:**
1. Use CSS layers (`@layer`) to control cascade order
2. Increase selector specificity instead of !important
3. Use CSS custom properties for theming
4. Refactor `[data-gill-v16]` scope to use proper component architecture

**Repair lane:** css-architecture-refactor (major effort)

---

## 🟡 P2 — Architecture (2)

### BUG-CSS-002: 938 hardcoded colors (should use CSS variables)
**Severity:** P2  
**Impact:** Theme maintenance difficult, dark mode inconsistencies

**Analysis:**
| File | Hardcoded colors |
|------|------------------|
| site.css | 551 |
| floating-cluster.css | 191 |
| nagornaya-mobile-toc.css | 52 |
| mobile-hotfix.css | 47 |
| home.css | 34 |
| command-palette.css | 31 |
| highlights-runtime.css | 20 |
| **Total** | **938** |

**Top hardcoded colors:**
- `#fff`: 59 (should be `var(--color-surface)` or `var(--color-text-inverse)`)
- `#7a2e2e`: 40 (should be `var(--color-accent)`)
- `#e8b878`: 24 (should be `var(--color-accent-strong)`)
- `#000`: 13 (should be `var(--color-text)`)
- `#d4a574`: 22 (should be `var(--color-accent-soft)`)

**Problem:**
- CSS variables defined в `:root` но не используются consistently
- Dark mode requires manual update of all hardcoded colors
- Theme changes require find-and-replace across 9 files

**Recommended fix:**
```css
/* Instead of: */
color: #7a2e2e;

/* Use: */
color: var(--color-accent);
```

**Repair lane:** css-variables-migration (medium effort)

---

### BUG-CSS-003: 29 unique breakpoints (should be 3-5 max)
**Severity:** P2  
**Impact:** Responsive design inconsistent, maintenance burden

**Analysis:**
- Total breakpoints: 189
- Unique breakpoints: 29
- Recommended max: 3-5

**Top breakpoints:**
| Breakpoint | Count | Issue |
|------------|-------|-------|
| 760px | 27 | ⚠ Conflict with 768px |
| 600px | 24 | ✅ Standard mobile |
| 480px | 22 | ✅ Standard small mobile |
| 768px | 20 | ✅ Standard tablet |
| 899px | 18 | ⚠ Non-standard |
| 761px | 12 | ⚠ 1px off from 760px |
| 640px | 10 | ✅ Standard large mobile |
| 680px | 6 | ⚠ Non-standard |
| 380px | 5 | ⚠ Non-standard |
| 900px | 5 | ⚠ 1px off from 899px |

**Problems:**
1. **760px vs 768px** — 8px difference, оба используются (27 vs 20 times)
2. **761px vs 760px** — 1px difference, вероятно опечатка
3. **899px vs 900px** — 1px difference, вероятно опечатка
4. **380px, 680px** — non-standard breakpoints

**Recommended fix:**
Consolidate to 5 standard breakpoints:
```css
--bp-xs: 480px;  /* Small mobile */
--bp-sm: 640px;  /* Large mobile */
--bp-md: 768px;  /* Tablet */
--bp-lg: 1024px; /* Desktop */
--bp-xl: 1280px; /* Large desktop */
```

**Repair lane:** css-breakpoints-consolidation (medium effort)

---

## 🔵 P3 — Code Quality (2)

### BUG-CSS-004: 5864 magic numbers (px values without design tokens)
**Severity:** P3  
**Impact:** Inconsistent spacing, difficult to maintain design system

**Analysis:**
| File | px values |
|------|-----------|
| site.css | 3382 |
| home.css | 936 |
| floating-cluster.css | 837 |
| command-palette.css | 381 |
| nagornaya-mobile-toc.css | 171 |
| mobile-hotfix.css | 77 |
| highlights-runtime.css | 56 |
| enhancements-runtime.css | 13 |
| sw-toast.css | 11 |
| **Total** | **5864** |

**Top magic numbers:**
- `1px`: 290 (borders)
- `10px`: 209 (spacing)
- `12px`: 205 (font-size, spacing)
- `14px`: 200 (font-size)
- `2px`: 181 (borders, shadows)
- `16px`: 177 (spacing, font-size)
- `8px`: 170 (spacing)
- `4px`: 144 (spacing)

**Problem:**
- No design token system for spacing (4px, 8px, 12px, 16px, 24px, 32px, 48px)
- No design token system for font sizes
- Inconsistent spacing across components

**Recommended fix:**
```css
:root {
  /* Spacing scale (4px base) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  
  /* Font sizes */
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
}
```

**Repair lane:** css-design-tokens (large effort)

---

### BUG-CSS-005: 27 duplicate selectors (code duplication)
**Severity:** P3  
**Impact:** Maintenance burden, inconsistent styles

**Analysis:**
| File | Duplicate selectors |
|------|---------------------|
| site.css | 21 |
| floating-cluster.css | 6 |
| **Total** | **27** |

**Examples:**
- `article p`: 3x in site.css
- `.bottom-bar`: 2x in site.css
- `#back-to-top`: 2x in site.css
- `#share-dialog-overlay`: 3x in site.css
- `.heading-anchor`: 3x in site.css
- `.gb-floater`: 2x in floating-cluster.css

**Problem:**
- Same selector defined multiple times
- Later definition overrides earlier
- Difficult to find "canonical" definition
- Risk of unintended side effects

**Recommended fix:**
1. Consolidate duplicate selectors into single definition
2. Use CSS layers to control override order
3. Use component-based architecture to avoid global selectors

**Repair lane:** css-deduplication (small effort)

---

## 📊 Summary

| Severity | Count | Description |
|----------|-------|-------------|
| P1 | 1 | 1047 !important (cascade broken) |
| P2 | 2 | 938 hardcoded colors, 29 breakpoints |
| P3 | 2 | 5864 magic numbers, 27 duplicate selectors |
| **Total** | **5** | |

---

## 🎯 Recommended Actions

### This Quarter (High Priority)
1. **BUG-CSS-001** — Reduce !important from 1047 to <100
   - Use CSS layers for cascade control
   - Refactor `[data-gill-v16]` scope
   - Estimated effort: 2-3 weeks

2. **BUG-CSS-003** — Consolidate 29 breakpoints to 5
   - Standardize on 480/640/768/1024/1280px
   - Fix 760px vs 768px conflict
   - Estimated effort: 1 week

### Next Quarter (Medium Priority)
3. **BUG-CSS-002** — Replace 938 hardcoded colors with variables
   - Use existing CSS variables consistently
   - Estimated effort: 1-2 weeks

4. **BUG-CSS-005** — Deduplicate 27 selectors
   - Consolidate into single definitions
   - Estimated effort: 2-3 days

### Advisory (Low Priority)
5. **BUG-CSS-004** — Implement design token system
   - Create spacing and font-size scales
   - Estimated effort: 1 week

---

## 📈 Impact Analysis

### Current State
- **Maintenance cost:** Very high (1047 !important, 938 hardcoded colors)
- **Theme changes:** Require find-and-replace across 9 files
- **Responsive design:** Inconsistent (29 breakpoints)
- **Code quality:** Poor (5864 magic numbers)

### After Refactoring (Estimated)
- **Maintenance cost:** Low (<100 !important, <50 hardcoded colors)
- **Theme changes:** Update CSS variables in one place
- **Responsive design:** Consistent (5 breakpoints)
- **Code quality:** Good (design tokens for spacing/fonts)

### Performance Impact
- **Current:** 534KB CSS (275KB site.css + 106KB floating-cluster.css + others)
- **After deduplication:** ~450KB (15% reduction)
- **After consolidation:** ~400KB (25% reduction)

---

## 🔍 Technical Debt Score

| Metric | Current | Target | Score |
|--------|---------|--------|-------|
| !important | 1047 | <100 | 🔴 Critical |
| Hardcoded colors | 938 | <50 | 🟡 High |
| Breakpoints | 29 | 5 | 🟡 High |
| Magic numbers | 5864 | <1000 | 🔵 Medium |
| Duplicate selectors | 27 | 0 | 🔵 Medium |

**Overall Technical Debt:** 🔴 **Critical** (requires major refactoring)

---

*Pass 68 completed. All findings evidence-based with file references.*
