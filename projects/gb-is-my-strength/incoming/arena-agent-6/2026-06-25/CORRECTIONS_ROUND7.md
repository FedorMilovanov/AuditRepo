# CORRECTION — Round 7 FALSE POSITIVES + Independent-2 Verification
**Agent:** arena-agent-6
**Date:** 2026-06-25
**Method:** Source code analysis, cross-agent verification

---

## 1. ROUND 7 FALSE POSITIVES

### P3-NEW: back-to-top.js module NEVER loaded
**Round 7 claim:** "back-to-top.js module NEVER loaded — button broken on 5 articles"
**Status:** ❌ FALSE POSITIVE

**Evidence:**
```javascript
// site.js already handles back-to-top:
var e = document.getElementById("back-to-top");
if (e) {
    var t = r.getConfig("features.backToTop", {});
    if (!1 !== t.enabled) {
        var n = t.showAfter || 400;
        window.addEventListener("scroll", function() {
            e.classList.toggle("visible", window.scrollY > n)
        }, {passive: !0});
        e.addEventListener("click", function() {
            r.scrollToTop()
        })
    }
}
```

**Details:**
- site.js handles back-to-top with configurable `showAfter` (default 400px)
- Uses `scrollToTop()` utility function
- The separate `back-to-top.js` module (threshold 600px) is redundant
- Only site.js is loaded → button works with 400px threshold

### P3-8 scope expansion (5 pages with faq-accordion)
**Round 7 claim:** "faq-accordion expanded to 5 pages — module NOT loaded"
**Status:** ❌ FALSE POSITIVE

**Evidence:**
```javascript
// site.js already handles faq-accordion:
document.querySelectorAll(".faq-accordion__q").forEach(function(e) {
    e.addEventListener("click", function() {
        var t = e.closest(".faq-accordion");
        if (!t || !t.getAttribute("data-gb-faq-enhanced")) {
            var n = e.closest(".faq-accordion__item");
            if (n) {
                var i = n.classList.contains("open");
                n.classList.toggle("open", !i);
                e.setAttribute("aria-expanded", String(!i));
            }
        }
    })
});
```

**Details:**
- site.js handles faq-accordion click → toggle `open` class + `aria-expanded`
- The separate `faq-accordion.js` module is redundant
- Playwright confirmed: buttons toggle `aria-expanded` at runtime

---

## 2. INDEPENDENT-2 VERIFICATION

### AAI2-NEW-1: SeriesArticleLayout empty alt="" on GBS2 thumbnails
**Status:** ✅ CONFIRMED
**Evidence:** 3 instances of `alt=""` in `SeriesArticleLayout.astro` at lines 118, 152, 289. These are per-part cover thumbnails, not purely decorative.

### AAI2-NEW-2: Sitemap metadata incomplete for karty/ and nagornaya
**Status:** ✅ CONFIRMED
**Evidence:**
- `/karty/` missing lastmod, changefreq, priority
- `/nagornaya/chast-1/` through `/nagornaya/chast-5/` missing changefreq, priority

---

## 3. CORRECTED BUG COUNT

### Bugs closed as FALSE POSITIVES:
| Bug | Original Claim | Reason |
|---|---|---|
| P3-NEW (back-to-top) | Module never loaded, button broken | site.js handles it |
| P3-8 scope expansion | faq-accordion not wired on 5 pages | site.js handles it |

### Updated count:
- **Total bugs found:** 28
- **False positives:** 7 (P0-NEW, P0-3, P1-13, P1-14, P3-8, P3-NEW, P3-8-scope)
- **Net confirmed:** 21
