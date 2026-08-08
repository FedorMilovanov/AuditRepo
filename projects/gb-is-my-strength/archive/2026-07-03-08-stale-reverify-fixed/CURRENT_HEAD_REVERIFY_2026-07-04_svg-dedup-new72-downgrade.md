# Current-head reverify — NEW-72 SVG dedup opportunity downgraded

**Project:** `gb-is-my-strength`  
**Date:** 2026-07-04  
**Source HEAD checked:** `a434b45ee6d8cefb0ce281039ad683fe9b9589ba`  
**Mode:** audit-only / no source changes

---

## 1. Scope

Reverify `NEW-72`, originally reported as a P2 SVG dedup opportunity across runtime JS files with an estimated ~1.5–2KB raw saving.

This pass checks the current exact duplicate SVG fragments in `js/*.js` on source main `a434b45e`.

---

## 2. Current exact-duplicate scan

Current exact duplicate SVG fragments (`<svg ... </svg>`, whitespace-normalized):

| Count | Raw fragment length | Files | Description |
|---:|---:|---|---|
| 4 | 293 B | `nagornaya-mobile-toc.js` ×2, `site.js` ×2 | book / reading-time icon |
| 3 | 275 B | `site.js` ×3 | flip-card finger/tap icon |
| 2 | 291 B | `highlights.js` ×2 | close/delete X icon |
| 2 | 227 B | `glossary.js` ×2 | glossary expand chevron icon |

Raw duplicate overhead if perfectly deduped is approximately 1.9KB before helper/constant overhead. Gzip impact is likely smaller because repeated SVG strings compress well.

---

## 3. Classification

`NEW-72` is real but overstated as P2.

**Recommended status:** downgrade to `P3 / advisory micro-optimization`.

Rationale:

- No runtime error, deploy failure, SEO failure, or visual regression.
- Current exact duplicate count is small (4 patterns), not a broad systemic issue.
- The largest repeated icon spans two independent legacy runtime files (`site.js` and `nagornaya-mobile-toc.js`); cross-file dedup would require a shared runtime icon module, which is larger architectural work and not worth doing just for ~1–2KB raw.
- In-file dedup in minified legacy scripts is possible but should not be mixed with higher-priority runtime/CI/security work.

---

## 4. Suggested future lane if desired

```text
lane/perf-runtime-svg-dedup-micro-2026-07-04
```

Scope should be strictly limited to:

- `highlights.js` close/delete SVG constant;
- `glossary.js` expand chevron constant;
- optional `site.js` flip-card finger SVG constant.

Do **not** introduce a new global JS file for this. Do **not** refactor search/PremiumControls/Nagornaya runtime in the same lane.

---

## 5. Evidence command

```bash
python3 - <<'PY'
from pathlib import Path
import re
root=Path('/home/user/gb-is-my-strength')
all={}
for p in (root/'js').glob('*.js'):
    s=p.read_text(errors='ignore')
    for m in re.finditer(r'<svg[\s\S]*?</svg>',s):
        frag=re.sub(r'\s+',' ',m.group(0)).strip()
        all.setdefault(frag,[]).append((p.name,m.start()))
for frag,locs in sorted(all.items(), key=lambda kv:(-len(kv[1]), -len(kv[0]))):
    if len(locs)>=2:
        print('count',len(locs),'len',len(frag),'locs',locs,'frag',frag[:160])
PY
```
