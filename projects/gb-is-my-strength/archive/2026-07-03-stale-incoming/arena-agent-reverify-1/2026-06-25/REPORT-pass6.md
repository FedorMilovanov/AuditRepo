# Agent Work Report — Pass 6 (CI/CD + Tooling + Edge Cases)

## Meta
- Agent: arena-agent-reverify-1
- SHA: 03e01a0008de34d654175ea600cdf9f22b2351b4

---

## 2. Confirmations

### Confirm P0-6 — CI cascade
- `indexnow.yml`: `git push` at line 73 with NO retry, NO --force-with-lease
- NO concurrency group on indexnow.yml (can run parallel with itself)
- Status: **confirmed-current**

### Confirm P1-9 — audit-pro vs cache-bust ASSETS divergence
- cache-bust.js has 22 assets
- audit-pro.js CACHE_BUST_ASSETS has different set:
  - Only in cache-bust.js: `glossary.js`, `series-cards.js`
  - Only in audit-pro.js: `js/modules/back-to-top.js`, `faq-accordion.js`, `img-loaded.js`, `theme.js`
- Status: **confirmed-current** (6 asymmetric entries)

### Confirm P1-6 — copy-legacy-to-dist no timestamp protection
- `grep -c 'mtime|timestamp|newer|older' scripts/copy-legacy-to-dist.js` → 0
- Status: **confirmed-current**

### Confirm P1-7 — search.js hardcoded fallback readTimes
- Hardcoded: 89, 41, 30, 50 (not validated against source data)
- Status: **confirmed-current**

### Confirm P2-4 — CACHE_VERSION manual
- `CACHE_VERSION="gb-v176-floating-cluster-gill-all-20260625"` — manually set string
- Status: **confirmed-current**

### Confirm P2-8 — cache-bust.js no duplicates
- `sort | uniq -d` → 0 duplicates
- Status: **fixed / not applicable on current HEAD**

### Confirm P3-8 — faq-accordion.js source files exist
- `js/modules/faq-accordion.js` exists (1494 bytes)
- BUT: functionality is bundled inside `site.js` (minified), standalone module file is dead weight
- On Antisovetov: HTML buttons present, accordion behavior handled by site.js at runtime
- Need runtime test to confirm if accordion actually works

---

## 1. New Findings

### N-REV1-11: P3 — js/modules/*.js are dead standalone files (bundled into site.js)

- Severity: P3
- Files: `js/modules/back-to-top.js`, `faq-accordion.js`, `img-loaded.js`, `theme.js`
- Evidence:
  ```
  Astro imports: 0 for all 4
  HTML script tags: 0 for all 4
  site.js contains same logic (minified): back-to-top=1, faq-accordion=1, img-loaded=1, theme=4 refs
  ```
- Root cause: Modules were extracted from site.js as source files (refactor pilot) but never wired as separate `<script>` imports. Site.js still contains the bundled versions.
- Impact: 4 dead files (~8KB) in repo. In audit-pro CACHE_BUST_ASSETS but not in cache-bust.js.
- Note: `theme.js` module has 0 refs to `data-gbs2-theme` — even if loaded, it wouldn't fix P1-13.

### N-REV1-12: P3 — 2 undefined CSS custom properties in floating-cluster.css

- Severity: P3
- Evidence: `--gb-tooltip-bg` and `--gb-tooltip-text` used but not defined in floating-cluster.css or known site.css vars
- Impact: None — both have inline fallback values (`var(--gb-tooltip-bg, #1a1a1a)`)

### N-REV1-13: P2 — indexnow.yml missing concurrency group

- Severity: P2
- Evidence: `grep -c 'concurrency' .github/workflows/indexnow.yml` → 0
- Impact: Multiple concurrent indexnow runs can push simultaneously → non-fast-forward → P0-6 cascade
- Related: Amplifies P0-6

---

## 8. Notes for Verifier

1. **P1-9 confirmed** — 6 entries differ between cache-bust.js and audit-pro.js CACHE_BUST_ASSETS. The js/modules/*.js files in audit-pro are dead standalone files.
2. **P1-13 root cause clarified**: even `js/modules/theme.js` source doesn't handle `data-gbs2-theme`. Fix must go into site.js or fc-controller.
3. **N-REV1-13** (indexnow no concurrency) amplifies P0-6 — should be fixed together.
4. **P2-8 clean** on current HEAD — no duplicate entries in cache-bust.js.
5. **P3-8** needs runtime verification — site.js may handle accordion at runtime even without separate script tag. Cannot confirm dead vs working without browser test.
