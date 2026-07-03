# R7 — IMPLEMENTATION: 10 regression fixes pushed to main

## Meta
- Agent: arena-agent-deep-verifier-editor
- Date: 2026-06-26
- Source commit: `2be8c0ed` (pushed to main)
- Parent: `53f68d38`
- Files changed: 26
- Lines: +49 -46

---

## Fixes applied

| # | Bug ID | Fix | Files |
|---|--------|-----|-------|
| 1 | BUG-PROD-01 | Restore `<link floating-cluster.css>` in 3 PageHeads | 3 PageHead.astro |
| 2 | BUG-R3-01 (P1) | Nagornaya mode `series-rich` → `nagornaya` | 5 PageChrome.astro |
| 3 | BUG-R3-01 (P1) | Krajne/Rimlyanam7 mode `series-rich` → `series-lite` | 2 Body.astro |
| 4 | BUG-R3-14 (P0) | TTS auto-start after speed-select when idle | controller.js |
| 5 | BUG-R3-03 (P2) | Toast: "не подключена" → "не поддерживает" | controller.js |
| 6 | BUG-R3-04 (P2) | `getStoredRate()` reads `gb:audio:rate` first | controller.js |
| 7 | BUG-R3-01 (P1) | Add `series-rich` to controller enum | controller.js |
| 8 | BUG-R3-15 (P1) | Move sync/keyboard init before root-loop (no skip) | controller.js |
| 9 | BUG-PROD-03 (P2) | Add `.izbrannoe-card__link` CSS | izbrannoe/index.astro |
| 10 | PC-003 | Sync fc-controller hash in 15 Astro components + asset-version.js | 16 files |

## Remaining after this fix

| Sev | Count | Items |
|-----|-------|-------|
| P2 | 2 | Keyboard ←/→ in speed panel, tab trap |
| P3 | 6 | Dead files (premium-controls.css, PremiumControlAnchor), animation timing, CSS duplication |
| **Total** | **8** | Down from 17 before this fix |

## Verification needed

- [ ] Production deploy triggers (deploy.yml was fixed in prior commit)
- [ ] Hermeneutics desktop: controls in vertical cluster, proper layout
- [ ] Gill mobile: controls fit viewport, no overflow
- [ ] /izbrannoe/: cards render with image + title + description
- [ ] TTS: click Play → speed panel → select speed → TTS starts
- [ ] Nagornaya: pilot activation with mode=nagornaya
