# DEEP MOBILE AUDIT — iPhone/Android/Modern Standards
**Agent:** arena-agent-6
**Date:** 2026-06-25
**Method:** Source code analysis, production HTTP, modern standards comparison

---

## 1. iPHONE SAFARI SPECIFIC

### ✅ Present
- Dynamic viewport height (dvh): 5 occurrences
- Home bar spacing (safe-area-inset): 5 occurrences
- Backdrop blur: 34 occurrences
- Pull-to-refresh prevention: 7 occurrences
- Touch action control: 8 occurrences
- viewport-fit=cover in meta tag

### ❌ Missing
- `-webkit-touch-callout`: 0 (iOS long-press callout control)
- `@supports (-webkit-touch-callout:none)`: 0 (iOS feature query)
- `position: sticky`: 0 (may cause issues on older iOS)
- `100lvh` / `100svh`: 0 (large/small viewport height)

### ⚠️ Potential Issues
- No `-webkit-touch-callout: none` on interactive elements → iOS shows callout on long-press
- No `position: sticky` → may cause issues with sticky headers on older iOS

---

## 2. ANDROID CHROME SPECIFIC

### ✅ Present
- Dynamic viewport height (dvh): 6 occurrences
- Overscroll behavior: 7 occurrences
- Touch action: 8 occurrences
- Tap highlight: 4 occurrences

### ❌ Missing
- `position: sticky`: 0 (may cause issues)
- `hover: none`: 0 (touch device detection)
- `pointer: coarse`: 0 in site.css (4 in mobile-hotfix.css)

---

## 3. MODERN CSS FEATURES

### ✅ Present (Good adoption)
- CSS Container Queries: 4 rules
- CSS color-mix(): 89 uses (excellent!)
- CSS aspect-ratio: 7 rules
- CSS gap: 151 uses
- CSS Grid: 121 rules
- CSS Flexbox: 347 rules
- CSS Smooth Scroll: 9 rules
- CSS Backdrop Filter: 34 rules
- CSS Color Scheme: 2 rules
- CSS Feature Queries: 14 rules
- CSS Containment: 25 rules
- content-visibility: 4 rules

### ❌ Missing (Could improve)
- OKLCH/OKLab colors: 0 (modern color spaces)
- CSS clamp(): 0 (responsive values)
- CSS min()/max(): 0 (responsive values)
- CSS Scroll Snap: 0 (scroll snapping)
- CSS Text Wrap Balance: 0 (text balancing)
- CSS Text Wrap Pretty: 0 (text prettyfying)
- CSS Logical Properties: 0 (RTL support)
- CSS Accent Color: 0 (form styling)

---

## 4. MODERN WEB STANDARDS COMPARISON

### ✅ Implemented
| Standard | Status | Notes |
|---|---|---|
| HTTPS | ✅ | HSTS enabled |
| Viewport meta | ✅ | viewport-fit=cover for iPhone X+ |
| theme-color | ✅ | Light + dark mode support |
| manifest.json | ✅ | PWA manifest complete |
| Service Worker | ✅ | Precaching + offline support |
| Lazy loading | ✅ | 13 images lazy loaded |
| WebP images | ✅ | 41 WebP images |
| CSS containment | ✅ | 25 rules |
| content-visibility | ✅ | 4 rules |
| color-mix() | ✅ | 89 uses |
| Container Queries | ✅ | 4 rules |

### ❌ Missing
| Standard | Status | Notes |
|---|---|---|
| AVIF images | ❌ | 0 AVIF (modern format) |
| font-display | ❌ | No declarations |
| font preloading | ❌ | No preloads |
| Scroll Snap | ❌ | Not used |
| Text Wrap Balance | ❌ | Not used |
| Logical Properties | ❌ | Not used |
| OKLCH colors | ❌ | Not used |
| Accent Color | ❌ | Not used |
| X-Content-Type-Options | ❌ | Not set |
| X-Frame-Options | ❌ | Not set |
| Referrer-Policy | ❌ | Not set |
| Permissions-Policy | ❌ | Not set |

### ⚠️ Partial
| Standard | Status | Notes |
|---|---|---|
| srcset | ⚠️ | Only 6 srcset |
| sizes | ⚠️ | Only 10 sizes |
| CSP | ⚠️ | unsafe-inline on all pages |

---

## 5. ACCESSIBILITY

### ✅ Present
- ARIA labels: 34 occurrences
- ARIA hidden: 58 occurrences
- ARIA live regions: 1 occurrence
- ARIA pressed: 4 occurrences
- ARIA current: 3 occurrences
- ARIA roles: 12 occurrences
- Tab index: 13 occurrences
- Skip links: 1 occurrence
- Reduced motion: 25 rules
- Contrast media query: 1 rule
- Forced colors mode: 1 rule

### ❌ Missing
- ARIA labelledby: 0
- ARIA describedby: 0
- ARIA expanded: 0 (in HTML, handled by JS)
- Focus visible: 0 in HTML (handled by CSS)
- Screen reader only: 0 in HTML (handled by CSS)

---

## 6. IMAGE OPTIMIZATION

### Current State
- WebP: 41 images ✅
- AVIF: 0 images ❌ (modern format)
- JPG: 2 images
- PNG: 5 images
- Lazy loading: 13 images ✅
- srcset: 6 images ⚠️ (responsive)
- sizes: 10 images ⚠️ (responsive)

### Recommendations
- Convert PNG to WebP/AVIF for better compression
- Add srcset/sizes to more images for responsive loading
- Consider AVIF for hero images (30-50% smaller than WebP)

---

## 7. FONT LOADING

### Current State
- No font-display declarations ❌
- No @font-face declarations in site.css ❌
- No font preloading ❌

### Impact
- Fonts may flash invisible (FOIT) or flash unstyled (FOUT)
- No control over font loading behavior

### Recommendation
- Add `font-display: swap` to @font-face declarations
- Preload critical fonts: `<link rel="preload" as="font" ...>`

---

## 8. SECURITY HEADERS

### Current State
- HSTS: ✅ enabled
- CSP: ⚠️ unsafe-inline
- X-Content-Type-Options: ❌ not set
- X-Frame-Options: ❌ not set
- Referrer-Policy: ❌ not set
- Permissions-Policy: ❌ not set

### Recommendation
- Add `X-Content-Type-Options: nosniff`
- Add `X-Frame-Options: DENY`
- Add `Referrer-Policy: strict-origin-when-cross-origin`
- Add `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 9. PERFORMANCE

### ✅ Good
- will-change: 6 hints
- CSS Containment: 25 rules
- content-visibility: 4 rules
- GPU acceleration: 8 transforms
- Intersection Observer: 15 uses
- requestAnimationFrame: 19 uses

### ⚠️ Could Improve
- No requestIdleCallback
- No AbortController in site.js (in modules only)
- site.js is ES5 (no const/let/arrow functions) — larger bundle

---

## 10. TOUCH TARGETS

### ✅ Good
- 44px minimum touch targets: 4 rules
- pointer:coarse detection: 4 rules
- hover:none detection: 1 rule

### ⚠️ Could Improve
- Only 4 touch target rules — could be more comprehensive
- hover:none only in 1 rule — could detect more touch-specific behavior

---

## 11. NEW BUGS FOUND

| ID | Sev | Title |
|---|---|---|
| STD-01 | P3 | No font-display declarations (FOIT/FOUT risk) |
| STD-02 | P3 | No font preloading (slower font loading) |
| STD-03 | P3 | No AVIF images (missing modern format) |
| STD-04 | P3 | Missing security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy) |
| STD-05 | P3 | Limited srcset/sizes usage (only 6/10 images) |
| STD-06 | P3 | No CSS Text Wrap Balance (text balancing) |
| STD-07 | P3 | No CSS Logical Properties (RTL support) |

---

## 12. CORRECTED BUG COUNT

### New bugs from this session: 7 (STD-01 through STD-07)
### Updated total:
- **Total bugs found:** 38 (31 previous + 7 new)
- **False positives:** 7
- **Net confirmed:** 31
