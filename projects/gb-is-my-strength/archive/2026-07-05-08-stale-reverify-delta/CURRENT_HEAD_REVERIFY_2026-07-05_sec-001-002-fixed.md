# CURRENT_HEAD REVERIFY — SEC-001-VERIFIER + SEC-002 Fixed

**Verifier:** Arena Agent (same session as verification pass)  
**Date:** 2026-07-05  
**Source commit:** `66919ace` (merge: security-innerhtml-escape lane)  
**Fix commit:** `3d242b1c` (lane/security-innerhtml-escape-2026-07-05)  
**Source HEAD pre-fix:** `96959c93`  

---

## Bug: SEC-001-VERIFIER — innerHTML XSS (3 unescaped fields)

**Status:** ✅ **FIXED-CURRENT** on `3d242b1c`

### Evidence

```bash
# Before fix (96959c93):
# Fields wrapped in tt(): ['w.lang', 'w.original', 'w.definition']
# Fields RAW (unescaped): ['w.transliteration', 'w.gloss', 'w.source']

# After fix (3d242b1c):
# Fields wrapped in tt(): ['w.lang', 'w.original', 'w.transliteration', 'w.gloss', 'w.definition', 'w.source']
# Fields RAW (unescaped): []
```

All 6 fields in `owCard.innerHTML` now use `tt()` HTML escaper.

### Verification steps
1. `python3 -c "..." ` confirms 6/6 wrapped, 0/6 raw ✅
2. cache-bust.js updated 71 files with new hashes ✅
3. No functional regression (same escape logic as existing tt() calls) ✅

---

## Bug: SEC-002 — safeUrl() incomplete scheme blocklist

**Status:** ✅ **FIXED-CURRENT** on `3d242b1c`

### Evidence

```bash
# Before fix:
# function safeUrl(e){var s=String(e||"").trim();return/^javascript:/i.test(s)?"#":s||"#"}

# After fix:
# function safeUrl(e){var s=String(e||"").trim();return/^(javascript|data|vbscript|blob):/i.test(s)?"#":s||"#"}
```

Now blocks 4 dangerous URI schemes instead of 1.

### Verification steps
1. `grep 'safeUrl' js/search.js` confirms expanded regex ✅
2. No functional regression (all existing first-party URLs are `https://` or `/path/`) ✅

---

## Matrix update

| Bug | Old status | New status | Commit |
|-----|-----------|-----------|--------|
| SEC-001-VERIFIER | 🔴 OPEN | ✅ FIXED-CURRENT | `3d242b1c` |
| SEC-002 (NEW-SAFEURL-XSS-HARDENING) | 🟡 OPEN | ✅ FIXED-CURRENT | `3d242b1c` |
