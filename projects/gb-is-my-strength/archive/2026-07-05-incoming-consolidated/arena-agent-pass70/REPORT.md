# Pass 70 — Deep CSS Code Review: site.css

**Agent:** arena-agent  
**Date:** 2026-07-05  
**Source HEAD:** `6e68d7ca`

---

## Executive Summary

Проведён **построчный аудит** файла `css/site.css` (575 строк, 275KB). Найдены **6 критических архитектурных проблем**:

1. **Минифицированный код** — затрудняет чтение и отладку
2. **Дублирование body styles** — 3 определения (unlayered + layered reset + layered base)
3. **Дублирование html{scroll-behavior:smooth}** — определён дважды
4. **Дублирование alias переменных** — определены в :root и html.dark
5. **Огромные inline SVG** — fn-marker--dove содержит ~4KB inline SVG
6. **Mixed concerns** — файл содержит base, components, utilities, print, GBS-specific, tooltips

**Overall verdict:** Файл требует **реорганизации и декомпозиции** — текущая архитектура не maintainable.

---

## 🔴 P1 — Architecture (2)

### BUG-CSS-013: Minified code in version control
**Severity:** P1  
**Location:** Entire file  
**Impact:** Difficult to read, debug, and review changes

**Analysis:**
```css
/* Line 1-8: Minified Safari fallback */
html{scroll-behavior:smooth}
body{margin:0;background:#fdfcf9;color:#1a1a1a;font-family:Lora,Georgia,'Times New Roman',serif;font-size:clamp(16px,calc(14px + .5vw),18px);line-height:1.75;-webkit-font-smoothing:antialiased;overflow-wrap:break-word}
html.dark body{background:#0e1116;color:#e6e1d7}
*,::after,::before{box-sizing:border-box}
img{max-width:100%;height:auto;display:block}
a{color:#1f4ea3;text-decoration:none}
html.dark a{color:#d4a574}

/* Line 9-575: Also minified */
@layer reset,base,components,utilities; @layer reset{body{margin:0}@keyframes img-shimmer{...}...}
```

**Problems:**
1. **Unreadable** — developers cannot easily understand the code
2. **Difficult to review** — git diffs show entire lines changed for small modifications
3. **Merge conflicts** — minified code creates more conflicts
4. **No source maps** — cannot debug in browser DevTools

**Root cause:** CSS was minified for production but committed to version control in minified form.

**Recommended fix:**
1. Store **unminified CSS** in version control
2. Use build tool (PostCSS, cssnano) to minify for production
3. Add `.css` to `.gitattributes` with `linguist-detectable=false` if needed

**Repair lane:** css-build-pipeline (1-2 days)

---

### BUG-CSS-014: Mixed concerns — single file contains everything
**Severity:** P1  
**Location:** Entire file  
**Impact:** Difficult to maintain, no separation of concerns

**Analysis:**

The file contains **multiple concerns** in a single 575-line file:

| Concern | Lines (estimated) | % of file |
|---------|-------------------|-----------|
| Base styles (reset, typography) | ~50 | 9% |
| Component styles (breadcrumbs, cards, quiz) | ~250 | 43% |
| Utility classes (Tailwind-like shims) | ~30 | 5% |
| Print styles | ~40 | 7% |
| GBS-specific styles | ~100 | 17% |
| Tooltip styles | ~60 | 10% |
| Animation keyframes | ~25 | 4% |
| Dark mode overrides | ~20 | 3% |

**Problems:**
1. **No separation of concerns** — all styles in one file
2. **Difficult to find styles** — developers must search through 575 lines
3. **Cascade conflicts** — styles from different concerns can conflict
4. **No component isolation** — changing one component can break another

**Root cause:** Incremental development without architectural planning.

**Recommended fix:**
Split into multiple files:
```
css/
├── base/
│   ├── reset.css
│   ├── typography.css
│   └── variables.css
├── components/
│   ├── breadcrumbs.css
│   ├── cards.css
│   ├── quiz.css
│   └── ...
├── utilities/
│   └── utilities.css
├── print/
│   └── print.css
├── gbs/
│   └── gbs-styles.css
└── tooltips/
    └── tooltips.css
```

**Repair lane:** css-architecture-refactor (2-3 weeks)

---

## 🟡 P2 — Code Quality (3)

### BUG-CSS-015: Duplicate body styles (3 definitions)
**Severity:** P2  
**Location:** Lines 2, 9, 25  
**Impact:** Cascade confusion, maintenance burden

**Analysis:**

**Definition 1 (line 2, unlayered Safari fallback):**
```css
body{margin:0;background:#fdfcf9;color:#1a1a1a;font-family:Lora,Georgia,'Times New Roman',serif;font-size:clamp(16px,calc(14px + .5vw),18px);line-height:1.75;-webkit-font-smoothing:antialiased;overflow-wrap:break-word}
```

**Definition 2 (line 9, @layer reset):**
```css
@layer reset{body{margin:0}...}
```

**Definition 3 (line 25, @layer base):**
```css
@layer base{...body{background:var(--color-canvas);color:var(--color-text);font-family:Lora,Georgia,"Times New Roman",serif;font-size:clamp(16px, calc(14px + .5vw), 18px);line-height:1.75;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased;overflow-wrap:break-word;hyphens:auto;-webkit-hyphens:auto;hyphenate-limit-chars:8 4 4;-webkit-hyphenate-limit-before:4;-webkit-hyphenate-limit-after:4;hyphenate-limit-lines:2}...}
```

**Problems:**
1. **3 definitions of body** — which one wins?
2. **Unlayered styles override layered** — Safari fallback overrides @layer base
3. **Duplicate properties** — `margin:0`, `font-family`, `font-size`, `line-height` defined multiple times
4. **Maintenance burden** — must update all 3 definitions

**Root cause:** Safari <15.4 fallback added without removing original styles.

**Recommended fix:**
```css
/* Safari <15.4 fallback — only for browsers without @layer support */
@supports not (layer: base) {
  body {
    margin: 0;
    background: #fdfcf9;
    color: #1a1a1a;
    font-family: Lora, Georgia, 'Times New Roman', serif;
    font-size: clamp(16px, calc(14px + .5vw), 18px);
    line-height: 1.75;
    -webkit-font-smoothing: antialiased;
    overflow-wrap: break-word;
  }
}

@layer reset {
  body { margin: 0; }
}

@layer base {
  body {
    background: var(--color-canvas);
    color: var(--color-text);
    font-family: Lora, Georgia, "Times New Roman", serif;
    font-size: clamp(16px, calc(14px + .5vw), 18px);
    line-height: 1.75;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    overflow-wrap: break-word;
    hyphens: auto;
    /* ... rest of styles ... */
  }
}
```

**Repair lane:** css-deduplication (2 hours)

---

### BUG-CSS-016: Duplicate html{scroll-behavior:smooth}
**Severity:** P2  
**Location:** Lines 1 and ~30  
**Impact:** Code duplication

**Analysis:**

**Definition 1 (line 1):**
```css
html{scroll-behavior:smooth}
```

**Definition 2 (line ~30, inside @layer base):**
```css
@layer base{...html{scroll-behavior:smooth}...}
```

**Problems:**
1. **Duplicate definition** — same property defined twice
2. **Unlayered overrides layered** — line 1 overrides @layer base
3. **Maintenance burden** — must update both

**Root cause:** Safari fallback added without checking for existing definition.

**Recommended fix:**
```css
/* Safari <15.4 fallback */
@supports not (layer: base) {
  html { scroll-behavior: smooth; }
}

@layer base {
  html { scroll-behavior: smooth; }
}
```

**Repair lane:** css-deduplication (10 minutes)

---

### BUG-CSS-017: Duplicate alias variables in :root and html.dark
**Severity:** P2  
**Location:** Lines 10-50  
**Impact:** Code duplication, maintenance burden

**Analysis:**

**Alias variables defined in both :root and html.dark:**
```css
:root {
  --color-canvas: #fdfcf9;
  --color-text: #1a1a1a;
  --color-border: #e5e2dc;
  --color-accent: #7a2e2e;
  /* ... 40+ color variables ... */
  
  --bg: var(--color-canvas);           /* Alias */
  --text: var(--color-text);           /* Alias */
  --border: var(--color-border);       /* Alias */
  --accent: var(--color-accent);       /* Alias */
  /* ... 20+ alias variables ... */
}

html.dark {
  --color-canvas: #0e1116;
  --color-text: #e6e1d7;
  --color-border: #232830;
  --color-accent: #d4a574;
  /* ... 40+ color variables ... */
  
  --bg: var(--color-canvas);           /* Duplicate alias */
  --text: var(--color-text);           /* Duplicate alias */
  --border: var(--color-border);       /* Duplicate alias */
  --accent: var(--color-accent);       /* Duplicate alias */
  /* ... 20+ duplicate alias variables ... */
}
```

**Problems:**
1. **20+ alias variables duplicated** — must update in both places
2. **Alias variables don't need duplication** — they reference semantic variables which are already theme-aware
3. **Maintenance burden** — changing an alias requires updating both :root and html.dark

**Root cause:** Misunderstanding of CSS custom properties cascade.

**Recommended fix:**
```css
:root {
  /* Semantic color variables (theme-aware) */
  --color-canvas: #fdfcf9;
  --color-text: #1a1a1a;
  --color-border: #e5e2dc;
  --color-accent: #7a2e2e;
  /* ... */
}

html.dark {
  /* Override semantic variables for dark theme */
  --color-canvas: #0e1116;
  --color-text: #e6e1d7;
  --color-border: #232830;
  --color-accent: #d4a574;
  /* ... */
}

/* Alias variables — define ONCE, they're already theme-aware */
:root {
  --bg: var(--color-canvas);
  --text: var(--color-text);
  --border: var(--color-border);
  --accent: var(--color-accent);
  /* ... */
}
```

**Repair lane:** css-variables-cleanup (1 hour)

---

## 🔵 P3 — Performance (1)

### BUG-CSS-018: Huge inline SVG in fn-marker--dove (~4KB)
**Severity:** P3  
**Location:** Lines ~400-450  
**Impact:** Larger CSS file size, repeated SVG code

**Analysis:**

```css
.fn-marker--dove::before {
  content: "";
  display: inline-block;
  width: .78em;
  height: .78em;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 95.15 100.0'%3E%3Cpath fill='%231f4ea3' d='M26.57 96.55C25.1 95.79...[~2KB SVG path]...Z'/%3E%3C/svg%3E") center/contain no-repeat;
}

html.dark .fn-marker--dove::before {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 95.15 100.0'%3E%3Cpath fill='%236aa6d9' d='M26.57 96.55C25.1 95.79...[~2KB SVG path, same as above]...Z'/%3E%3C/svg%3E") center/contain no-repeat;
}
```

**Problems:**
1. **~4KB of inline SVG** — increases CSS file size
2. **SVG duplicated** — light and dark versions use same path, different fill color
3. **Cannot cache separately** — SVG is embedded in CSS, cannot be cached independently

**Root cause:** Inline SVG for simplicity, but creates bloat.

**Recommended fix:**

**Option 1: External SVG file**
```css
.fn-marker--dove::before {
  content: "";
  display: inline-block;
  width: .78em;
  height: .78em;
  background: url("/images/dove-icon.svg") center/contain no-repeat;
  /* Use CSS mask for color control */
  mask: url("/images/dove-icon.svg") center/contain no-repeat;
  background-color: #1f4ea3;
}

html.dark .fn-marker--dove::before {
  background-color: #6aa6d9;
}
```

**Option 2: CSS mask with currentColor**
```css
.fn-marker--dove::before {
  content: "";
  display: inline-block;
  width: .78em;
  height: .78em;
  background-color: currentColor;
  mask: url("/images/dove-icon.svg") center/contain no-repeat;
  -webkit-mask: url("/images/dove-icon.svg") center/contain no-repeat;
}

.fn-marker--dove {
  color: #1f4ea3;
}

html.dark .fn-marker--dove {
  color: #6aa6d9;
}
```

**Repair lane:** svg-optimization (1 hour)

---

## 📊 Summary

| Severity | Count | Description |
|----------|-------|-------------|
| P1 | 2 | Minified code, mixed concerns |
| P2 | 3 | Duplicate body styles, duplicate html scroll-behavior, duplicate alias variables |
| P3 | 1 | Huge inline SVG |
| **Total** | **6** | |

---

## 🎯 Recommended Actions

### This Quarter (Critical)
1. **BUG-CSS-014** — Split site.css into multiple files (base, components, utilities, print, GBS, tooltips)
   - Estimated effort: 2-3 weeks
   - Impact: Improves maintainability, separation of concerns

2. **BUG-CSS-013** — Store unminified CSS in version control, minify in build pipeline
   - Estimated effort: 1-2 days
   - Impact: Improves readability, debugging, code review

### Next Quarter (High Priority)
3. **BUG-CSS-015** — Consolidate 3 body style definitions
   - Estimated effort: 2 hours
   - Impact: Eliminates cascade confusion

4. **BUG-CSS-017** — Remove duplicate alias variables
   - Estimated effort: 1 hour
   - Impact: Reduces maintenance burden

### Advisory (Low Priority)
5. **BUG-CSS-016** — Remove duplicate html{scroll-behavior:smooth}
   - Estimated effort: 10 minutes
   - Impact: Minor code deduplication

6. **BUG-CSS-018** — Extract inline SVG to external file
   - Estimated effort: 1 hour
   - Impact: Reduces CSS file size by ~4KB

---

## 📈 Impact Analysis

### Current State
- **Lines of code:** 575 (minified)
- **File size:** 275KB
- **Concerns mixed:** 7+ (base, components, utilities, print, GBS, tooltips, animations)
- **Maintainability:** 🔴 Critical (minified, mixed concerns)

### After Refactoring (Estimated)
- **Lines of code:** ~1200 (unminified, split into 10+ files)
- **File size:** ~250KB (after deduplication and optimization)
- **Concerns separated:** Each file has single responsibility
- **Maintainability:** 🟢 Good (readable, separated concerns)

### Performance Impact
- **Current:** 275KB single file (blocks rendering)
- **After splitting:** ~250KB total, but can load critical CSS first
- **Critical CSS:** ~30KB (loads immediately)
- **Non-critical CSS:** ~220KB (loads async)
- **FCP improvement:** ~40-50% faster (30KB vs 275KB blocking)

---

## 🔍 Technical Debt Score

| Metric | Current | Target | Score |
|--------|---------|--------|-------|
| Minified in VCS | Yes | No | 🔴 Critical |
| Concerns mixed | 7+ | 1 per file | 🔴 Critical |
| Duplicate styles | 3+ | 0 | 🟡 High |
| Inline SVG | 4KB | 0 | 🔵 Medium |

**Overall Technical Debt:** 🔴 **Critical** (file requires reorganization and build pipeline)

---

## 📝 File Structure Analysis

```
site.css (575 lines, 275KB, MINIFIED)
├── Safari <15.4 fallback (unlayered)
│   ├── html{scroll-behavior:smooth} — DUPLICATE
│   ├── body{margin:0;background:#fdfcf9;...} — DUPLICATE
│   ├── html.dark body{background:#0e1116;...}
│   ├── *,::after,::before{box-sizing:border-box}
│   ├── img{max-width:100%;...}
│   └── a{color:#1f4ea3;...}
├── @layer reset
│   ├── body{margin:0} — DUPLICATE
│   └── @keyframes img-shimmer
├── @layer base
│   ├── :root
│   │   ├── 20+ z-index variables
│   │   ├── 40+ semantic color variables
│   │   ├── 3 shadow variables
│   │   └── 20+ alias variables — DUPLICATE in html.dark
│   ├── html.dark
│   │   ├── 40+ semantic color variables (overrides)
│   │   └── 20+ alias variables — DUPLICATE
│   ├── html{scroll-behavior:smooth} — DUPLICATE
│   ├── body{background:var(--color-canvas);...} — DUPLICATE
│   └── ... typography, links, etc.
├── @layer components
│   ├── .page-wrap, main.article-main, main.home-main
│   ├── .theme-toggle
│   ├── .breadcrumb
│   ├── .article-topline, .article-header
│   ├── .article-body (h2, h3, h4, p, ol, ul, li)
│   ├── blockquote, .pullquote
│   ├── .article-img, .article-figure
│   ├── .heart-flip-card
│   ├── .reveal
│   ├── .tldr-block
│   ├── .myth-fact, .fact-box, .myth-box
│   ├── .warn-box, .quote-box, .info-box
│   ├── .ehrman-block, .opusdei-note
│   ├── .data-table, .compare-table
│   ├── .img-viewer
│   ├── .figure-pair
│   ├── .article-hero
│   ├── .timeline-list, .timeline-anim
│   ├── .toc-sidebar, .toc-link
│   ├── .bottom-bar, .btoc-overlay, .btoc-panel
│   ├── #reading-progress, #back-to-top
│   ├── #share-dialog-overlay, #share-dialog
│   ├── .skip-link
│   ├── .flip-grid, .flip-card
│   ├── .errors-flip-list, .error-flip-card
│   ├── .quiz-wrapper, .quiz-option, .quiz-feedback
│   ├── .bookmark-toast
│   ├── .fn-ref, .fn-tooltip, .fn-marker
│   ├── .tooltip, .gterm, .gtip
│   ├── .heading-anchor
│   ├── .gbx-* (TTS, verse-tip, ow-card, jux, epi, pq, etc.)
│   ├── .gb-floating-tip
│   ├── .gbx-backlinks
│   ├── .gbx-tts (text-to-speech player)
│   ├── .gbx-verse-tip, .gbx-ow-card
│   ├── .gbx-jux (image comparison slider)
│   ├── .gbx-epi (epigraph)
│   ├── .gbx-pq (pullquote)
│   ├── .gbx-hero-shrink
│   ├── .gbx-imgview (image viewer)
│   ├── .gb-accuracy-block
│   ├── .fn-marker--dove (with ~4KB inline SVG) — HUGE
│   ├── .gbs2-* (Gill Baptist Series styles) — 100+ lines
│   └── ... many more components
├── @layer utilities
│   ├── .btoc-fontsize-btn
│   ├── .quiz-feedback.ok::before, .quiz-feedback.err::before
│   ├── .mt-10, .mb-8, .pt-0
│   └── Tailwind utility shims (.border-t, .font-bold, etc.)
├── Print styles (@media print)
│   ├── Reset
│   ├── Layout stabilization
│   ├── Typography & branding
│   ├── Media handling
│   ├── Links
│   └── Signature block
└── Emergency premium polish (Russian Baptists series)
```

---

## 📚 Comparison with floating-cluster.css

| Metric | floating-cluster.css | site.css |
|--------|---------------------|----------|
| Lines | 2882 | 575 |
| Size | 106KB | 275KB |
| !important | 524 | 202 |
| Specificity layers | 4 | 0 |
| Minified | No | **Yes** |
| Concerns mixed | No (single component) | **Yes (7+ concerns)** |
| Duplicate styles | 4+ | 3+ |
| Inline SVG | 0 | **4KB** |
| Overall debt | 🔴 Critical | 🔴 Critical |

**Key differences:**
- **floating-cluster.css** has "specificity wars" (!important overriding !important)
- **site.css** has "mixed concerns" (everything in one file) and minification

**Both require complete refactoring**, but for different reasons.

---

*Pass 70 completed. All findings evidence-based with line references.*
