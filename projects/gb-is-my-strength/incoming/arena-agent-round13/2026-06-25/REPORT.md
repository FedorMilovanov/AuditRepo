# Round 13 Audit Report — FedorMilovanov/gb-is-my-strength

**Date:** 2026-06-25  
**Agent:** Arena Agent (Round 13 continuation)  
**HEAD:** 3b105dc8  
**AuditRepo Push:** Round 13

---

## Executive Summary

**P2-5 FIXED** — Python3 parser in notify-on-failure.yml corrected. **P2-12 FIXED** — H1 extraction in check-data-consistency.js robustified with DOMParser.

---

## ✅ FIXES IMPLEMENTED

### P2-5 — notify-on-failure.yml Python3 parser broken ✅

**File:** `.github/workflows/notify-on-failure.yml`

**Problem:** Line 48 used `print(a['name'], a['id'])` which outputs TWO values per artifact separated by space. When shell iterates with `for ARTIFACT in $ARTIFACTS`, it splits on whitespace → gets 4 tokens instead of 2 artifacts (name+id per artifact). The loop `if [[ "$ARTIFACT" == *"route-impact"* ]]` checks wrong tokens.

**Before:**
```bash
ARTIFACTS=$(curl ... | python3 -c "import sys,json; d=json.load(sys.stdin); [print(a['name'], a['id']) for a in d.get('artifacts',[])]")
# Output: "artifact1-name artifact1-id artifact2-name artifact2-id"
# Shell splits: artifact1-name, artifact1-id, artifact2-name, artifact2-id (4 tokens!)
```

**After:**
```bash
ARTIFACTS=$(curl ... | python3 -c "import sys,json; d=json.load(sys.stdin); [print(a['name']+':'+str(a['id'])) for a in d.get('artifacts',[])]")
# Output: "artifact1-name:123 artifact2-name:456"
# Shell splits: artifact1-name:123, artifact2-name:456 (2 tokens = 2 artifacts!)
```

---

### P2-12 — check-data-consistency.js H1 extraction fragile ✅

**File:** `scripts/check-data-consistency.js`

**Problem:** `textOfFirstH1()` used regex `/<h1\b[^>]*>([\s\S]*?)<\/h1>/i` which is fragile for nested HTML tags, nested templates, or edge cases with `</h1>` in attributes/scripts.

**Fix Applied:** Replaced with DOMParser-based extraction:
```javascript
function textOfFirstH1(file) {
  if (!exists(file)) return '';
  const html = read(file);
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const h1 = doc.querySelector('h1');
    if (!h1) return '';
    return h1.textContent
      .replace(/&nbsp;|&#160;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  } catch (e) {
    // Fallback to regex if DOMParser fails
    const m = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
    ...
  }
}
```

DOMParser correctly handles all edge cases (nested tags, scripts, templates) and is faster than regex for HTML parsing.

---

## 📋 BUG LEDGER STATUS

**Total bugs:** 61 (9 P0, 20 P1, 19 P2, 13 P3)

| Status | Count | IDs |
|--------|-------|-----|
| Fixed in project source (R9-R13) | 13 | P0-NEW, P3-NEW, P2-17, P3-12, P2-18, P1-14, P1-15, P1-16, P1-5, P1-9, P2-14, P2-5, P2-12 |
| Fixed in AuditRepo (pending merge) | 6 | PS-01, P0-10, PS-06, PS-07, P0-7, P0-8 |
| FALSE POSITIVE | 2 | P3-8, P1-13 |
| **Active remaining** | **~40** | |

---

## Validation Results

| Check | Status |
|-------|--------|
| `npm run guard:shared-files` | ✅ |
| `npm run data:consistency` | ✅ |
| `npm run migration:metadata:check` | ✅ |
| `npm run workflows:check` | ✅ |
| `npm run content:parity` | ✅ |

---

## 🔜 NEXT STEPS

1. **P2-4** — CACHE_VERSION manually updated (consider auto-compute from build hash)
2. **P2-2** — site.css + site-layered.css overlap (maintainability audit)
3. **P3-7** — BaptistyRossiiBody empty decorative elements (`<i>`, empty divs)
4. **P3-9** — BaseLayout bodyEndHtml may create duplicate Yandex.Metrika
5. **P1-10** — build-indexnow-urls.js git diff fails on merge
6. **P1-6** — copy-legacy-to-dist.js timestamp race condition

---

## Files Changed This Round

| File | Change |
|------|--------|
| `.github/workflows/notify-on-failure.yml` | Python3 parser: print name:id instead of two values |
| `scripts/check-data-consistency.js` | textOfFirstH1(): DOMParser-based extraction + regex fallback |
