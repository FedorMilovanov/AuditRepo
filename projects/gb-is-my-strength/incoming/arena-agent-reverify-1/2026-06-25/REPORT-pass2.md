# Agent Work Report — Pass 2 (Deep Audit)

## Meta
- Project: gb-is-my-strength
- Agent: arena-agent-reverify-1
- Date: 2026-06-25
- Audited SHA: 03e01a0008de34d654175ea600cdf9f22b2351b4
- Mode: deep audit + reverification
- Build verified: Node 22 Astro build + copy-legacy-to-dist + dist-publication-audit

---

## 1. New Findings

### N-REV1-3: P2 — Double CSS load on Hermenevtika (and potentially Antisovetov, KodDaVinchi)

- Severity: P2
- Route: `/articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/`
- Evidence:
  ```
  HermenevtikaPageHead.astro: <link href="floating-cluster.css"> (external, 68KB)
  HermenevtikaBody.astro uses <FloatingCluster> → SingleArticleCluster.astro
  SingleArticleCluster.astro has <style is:global> with SAME gb-floater/gb-icon/gb-ember/gb-save/gb-theme-toggle rules
  → Both CSS sources loaded = duplicate rules in dist output
  Same pattern applies to AntisovetovBody.astro (SeriesLiteCluster <style is:global>)
  and KodDaVinchiPageChrome.astro (FloatingCluster → SingleArticleCluster)
  ```
- Root cause: floating-cluster.css was designed as canonical CSS for legacy root HTML. Astro components already embed identical CSS via `<style is:global>`. Adding `<link>` to PageHead creates double load.
- Impact: ~68KB redundant CSS per page. No visual breakage (same rules), but wasted bandwidth.
- Fix options:
  1. Remove `<link floating-cluster.css>` from PageHeads that use FloatingCluster Astro component (Hermenevtika, Antisovetov, KodDaVinchi)
  2. OR remove `<style is:global>` from SingleArticleCluster/SeriesLiteCluster and keep only external file
  3. Gill kontekst is DIFFERENT — uses PlayEmber/SaveButton (no <style>), needs external CSS
- Confidence: high

### N-REV1-4: P3 — GillRailControls.astro `<style is:global>` orphan on kontekst

- Severity: P3
- Files: `src/components/ui/floating-cluster/GillRailControls.astro`
- Evidence:
  ```
  GillRailControls still used by: Part1, Part2, Part3, Spravochnik (4 pages)
  NOT used by kontekst (replaced with direct v16 markup)
  GillRailControls has <style is:global> for .gb-rail-foot — this CSS only applies on Part1-3/Spravochnik
  Kontekst gets its rail-foot CSS from floating-cluster.css [data-gill-v16] scope
  ```
- Impact: None functional. Just architectural note — two CSS sources for rail-foot on different pages.
- Confidence: medium

### N-REV1-5: P2 — series-cards.js precached in SW but 0 Astro imports

- Severity: P2
- Files: sw.js, js/series-cards.js
- Evidence:
  ```
  grep -rc 'series-cards' src/ --include='*.astro' → 0
  grep -c 'series-cards' sw.js → 1 (in PRECACHE_ASSETS)
  ls dist/js/series-cards.js → EXISTS (copied by copy-legacy-to-dist)
  ```
- Root cause: series-cards.js used by legacy HTML only, never imported by Astro. SW precaches it, which works because copy-legacy-to-dist copies it. But it adds unnecessary precache weight.
- Confidence: high (confirms existing P2-14)

---

## 2. Confirmations of Existing Findings

### Confirm P1-14 (GBS2 controls unwired on baptisty)
- Evidence: `grep -c 'data-gbs2-theme' baptisty-rossii/noch-na-kure/index.html` → 1 (button exists)
- `grep -c 'data-fc-action="theme"' baptisty-rossii/noch-na-kure/index.html` → 0 (no fc-controller wiring)
- Status: **confirmed-current on 03e01a00** — baptisty theme buttons still dead

### Confirm P1-15 (gbs2-sheet TOC pane empty)
- Evidence: `data-gbs2-pane="toc"` nav content length = 0 chars (empty)
- Status: **confirmed-current on 03e01a00**

### Confirm P1-8 (double init)
- Evidence: `initGillRail()` at line 377 calls `initCluster(railControls)` at line 332.
  Main loop at line 388 also calls `initCluster(root)` for each `[data-fc-root]`.
  If railControls has `data-fc-root`, initCluster is called TWICE on it.
- Status: **confirmed-current on 03e01a00**

### Confirm P0-6 (CI cascade)
- Evidence: `grep -c 'retry\|for i in\|force-with-lease' .github/workflows/indexnow.yml` → 0
- Status: **confirmed-current on 03e01a00** — no retry mechanism

---

## 3. Challenges / Disputes

### Challenge P0-NEW (SW precache 404)
- Target: Unified Ledger P0-NEW
- Reason: Ledger says "assets don't exist in dist" but this is WRONG for production-like build.
- Evidence: After `astro build + copy-legacy-to-dist --omit-build-only`:
  - `dist/css/site-layered.css` → EXISTS (copied from root by copy-legacy-to-dist)
  - `dist/js/site-modules.js` → EXISTS (copied from root)
  - `dist/js/series-cards.js` → EXISTS (copied from root)
- Root cause of error: original finding tested plain `astro build` without `copy-legacy-to-dist`. Production pipeline ALWAYS runs both.
- Recommended status: **downgrade P0→P2** (not 404 in production, but unnecessary precache weight + no hash sync)

---

## 7. Reverify Notes

| Bug | HEAD | Result | Evidence |
|-----|------|--------|----------|
| P0-3 | 03e01a00 | ⚠️ intentional design | AhrefsBot/SemrushBot blocked deliberately |
| P0-6 | 03e01a00 | ❌ still open | No retry in indexnow.yml |
| P0-7 | 03e01a00 | ❌ REGRESSED | site-layered.css back in sw.js (see pass 1) |
| P0-8 | 03e01a00 | ❌ REGRESSED | site-modules.js back in sw.js (see pass 1) |
| P0-NEW | 03e01a00 | 🟡 downgrade to P2 | Files DO reach dist via copy-legacy |
| P1-2 | 03e01a00 | ❌ still open | 43 URLs in sitemap (52+ expected) |
| P1-5 | 03e01a00 | ⚠️ structural | PO has 53 routes, RM has 34 — different scope |
| P1-8 | 03e01a00 | ❌ still open | Double initCluster on Gill rail |
| P1-13 | 03e01a00 | ❌ still open | data-gbs2-theme unwired |
| P1-14 | 03e01a00 | ❌ still open | Baptisty controls dead |
| P1-15 | 03e01a00 | ❌ still open | TOC pane empty |
| P2-14 | 03e01a00 | ❌ still open | series-cards.js 0 Astro imports |
| dist-publication-audit | 03e01a00 | ✅ passed | Full strangler build clean |

---

## 8. Notes for Verifier

1. **P0-NEW should be downgraded to P2** — files reach dist via copy-legacy-to-dist, not Astro. SW precache works. Issue is hash sync, not 404.
2. **N-REV1-3 (double CSS)** is a new P2 finding — floating-cluster.css external link + SingleArticleCluster `<style is:global>` = redundant 68KB.
3. **P1-14/P1-15/P1-16 cluster** is the biggest functional gap on baptisty pages — all GBS2 controls dead.
4. **P0-7/P0-8 regression** from 8f2b29e8 needs immediate re-fix.
5. `dist-publication-audit` passes clean on full strangler build — no blockers for deploy on current HEAD.
