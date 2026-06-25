# Agent Work Report — Pass 3 (Runtime + Dist Verification)

## Meta
- Agent: arena-agent-reverify-1
- SHA: 03e01a0008de34d654175ea600cdf9f22b2351b4
- Build: Node 22 astro build + copy-legacy-to-dist + pagefind

---

## 1. New Findings

### N-REV1-6: P1 — 11 Baptisty pages: ALL GBS2 controls dead in production dist

- Severity: P1 (confirms P1-14 with dist-level evidence)
- Routes: All 10 baptisty-rossii articles + hub = 11 pages
- Evidence (dist build, NOT root HTML):
  ```
  dist/baptisty-rossii/noch-na-kure/index.html:
    floating-cluster-controller loaded: 0
    data-fc-action: 0
    data-fc-root: 0
    data-gbs2-theme: 1  ← button EXISTS
    gbs2-bbar: 1  ← bottom bar EXISTS
    gbs2-sheet: 1  ← sheet EXISTS
  ```
- Root cause: Astro source `BaptistyRossiiNochNaKureBody.astro` does NOT load `floating-cluster-controller.js`. And `site.js` doesn't wire `data-gbs2-theme`. So theme/search/share/font/offline buttons are completely dead HTML.
- Impact: Users cannot toggle theme, search, share, change font, or use offline on any baptisty page in production.
- Blast: 11 Astro-owned routes × 6 dead controls = 66 dead interactive elements
- Note: Root HTML has fc-controller (added earlier), but root HTML is **skipped** by copy-legacy-to-dist for Astro-owned routes. Only Astro output reaches dist.

### N-REV1-7: P2 — Double CSS load confirmed on 3 pages (Hermenevtika, KodDaVinchi, Antisovetov)

- Severity: P2
- Evidence from dist CSS link tags:
  ```
  Hermenevtika:  floating-cluster.css (external) + _astro/FloatingCluster._SRMcKLI.css (13KB bundled)
  KodDaVinchi:   floating-cluster.css (external) + _astro/FloatingCluster._SRMcKLI.css (13KB bundled)
  Antisovetov:   floating-cluster.css (external) + _astro/FloatingCluster._SRMcKLI.css (13KB bundled)
  Kontekst:      floating-cluster.css ONLY (no Astro bundle — uses PlayEmber/SaveButton without <style>)
  ```
- Root cause: These pages use `<FloatingCluster>` Astro component which includes `<style is:global>` → Astro bundles it as `FloatingCluster._SRMcKLI.css`. PLUS we added `<link floating-cluster.css>` to PageHead. Same `.gb-floater/.gb-icon/.gb-ember/.gb-save` rules loaded twice.
- Fix: Remove `<link floating-cluster.css>` from Hermenevtika/KodDaVinchi/Antisovetov PageHeads (Astro bundle handles it). Keep it ONLY on kontekst (which doesn't use FloatingCluster component).
- Impact: 13KB × 3 pages redundant CSS. No visual breakage.

---

## 2. Confirmations

### Confirm P1-14 with production dist evidence
- 11 baptisty pages in dist: ALL have `data-gbs2-theme` buttons but ZERO controller/wiring
- Status: **confirmed-current on dist build from 03e01a00**

### Confirm kontekst v16 clean in dist
- dist output: gbs-rail=1, mobile-bottom-bar=1, toc-overlay=1, data-gill-v16=1
- NO old gbs2-bbar/gbs2-sheet/themeToggle
- Canonical URL correct, JSON-LD present, meta description present
- Status: **kontekst v16 pilot clean in production dist**

---

## 7. Reverify Notes

| Finding | HEAD | Result |
|---------|------|--------|
| Kontekst v16 dist | 03e01a00 | ✅ Clean — all v16 markers, no legacy, CSS linked |
| Hermenevtika dist | 03e01a00 | ✅ Cluster works, but double CSS (N-REV1-7) |
| KodDaVinchi dist | 03e01a00 | ✅ Cluster works, no old controls, but double CSS |
| Antisovetov dist | 03e01a00 | ✅ Cluster works, no old controls, but double CSS |
| Baptisty dist (11 pages) | 03e01a00 | ❌ ALL dead GBS2 controls (N-REV1-6, confirms P1-14) |
| dist-publication-audit | 03e01a00 | ✅ PASSED |

---

## 8. Notes for Verifier

1. **N-REV1-6 is the single biggest functional gap** in production — 11 pages × 6 dead controls.
2. Fix for N-REV1-6 requires either:
   a. Add `floating-cluster-controller.js` to baptisty Astro Body/PageChrome
   b. OR add `data-gbs2-theme` wiring to `site.js` (P1-13)
   c. OR convert baptisty from gbs2-* to data-fc-action-* (bigger refactor)
3. N-REV1-7 (double CSS) is easy fix — remove `<link floating-cluster.css>` from 3 PageHeads that use FloatingCluster component.
4. Kontekst pilot is **production-clean** — can be used as reference for remaining Gill pages.
