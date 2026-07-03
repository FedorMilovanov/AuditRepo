# Agent Work Report — gb-is-my-strength deepening / verification pass

## Meta
- **Project:** gb-is-my-strength (gospod-bog.ru)
- **Source repo:** FedorMilovanov/gb-is-my-strength
- **Audit repo:** FedorMilovanov/AuditRepo
- **Agent:** arena-agent-auditor
- **Date:** 2026-07-02 (deepening pass)
- **Audited branch:** main
- **Audited SHA:** `d5d9388b56a96ea26fe1c1309b07d6c4e2534f9b`
- **Current HEAD:** same
- **Mode:** free-intake, current-head, dist/browser verification

---

## Executive summary

This is a follow-up pass to `arena-agent-auditor/2026-07-02/REPORT.md`. It runs the heavy dist/browser checks that were deliberately skipped in the first pass and adds source-level deep dives on weak checks and stale documentation.

**Bottom line:** all gates still PASS on current HEAD `d5d9388b`, but the deep pass surfaced **new orchestration/robustness issues**, refined the severity of one earlier finding, and added concrete evidence for several stale-doc / dead-code clusters.

---

## 1. New findings

### P1-01-R — SW precache inconsistency is conditional, not constant; root cause is gate orchestration

- **Severity:** P1
- **Category:** build/deploy / Service Worker / CI orchestration
- **Route/files:** `package.json`, `scripts/sw-dist-readiness-audit.js`, `scripts/build-pagefind.js`, `.github/workflows/deploy.yml`
- **Status:** `confirmed-current` (refined from previous pass)
- **Evidence:**
  ```bash
  # Clean build, NO pagefind
  npm run strangler:build:production-like
  npm run sw:dist:audit:deploy-switch
  # → ❌ PRECACHE_ASSETS entry missing in dist: /pagefind/pagefind.js
  ```
  vs.
  ```bash
  # Build WITH pagefind
  npm run strangler:build:production-like
  npm run pagefind:build:dist
  npm run sw:dist:audit:deploy-switch
  # → ✅ SW dist readiness audit passed
  ```
- **Root cause (refined):** `validate:static-publication` does **not** include `sw:dist:audit:deploy-switch` or `pagefind:build:dist`. A developer following only the documented pre-push gate can see green while the deploy artifact is SW-inconsistent. CI happens to pass today because `deploy.yml` runs `pagefind:build:dist` before the SW audit, but this ordering is fragile.
- **Impact:** If CI step order is changed, or if a developer edits `sw.js` PRECACHE_ASSETS and runs only the static gate, the deployed Service Worker will fail to precache Pagefind bootstrap → offline-first search breaks.
- **Suggested repair lane:** `lane/system-sw-gate-coupling`
- **Repair direction:** Add `npm run sw:dist:audit:deploy-switch` to `validate:static-publication` / `validate:static-publication:light` with a preceding `pagefind:build:dist` step; OR introduce a lighter `sw:source:audit` that skips dist-only precache checks when run against source.
- **Do not mix with:** P1-02 (CACHE_VERSION automation).

---

### P2-03 — `dist:jsonld:audit` / `schema:rich-results:audit:dist` are not safe to run in parallel with `source:links:dist`

- **Severity:** P2
- **Category:** build-script race condition / local developer experience
- **Route/files:** `package.json` scripts `dist:jsonld:audit`, `schema:rich-results:audit:dist`, `source:links:dist`
- **Status:** `confirmed-current`
- **Evidence:**
  ```bash
  # Parallel execution
  npm run source:links:dist &
  npm run dist:jsonld:audit &
  npm run schema:rich-results:audit:dist &
  wait
  ```
  Output:
  ```text
  ❌ schema audit root missing: dist
  ❌ dist JSON-LD audit root missing: dist
  ```
  Sequential execution passes:
  ```bash
  npm run source:links:dist
  npm run dist:jsonld:audit        # ✅
  npm run schema:rich-results:audit:dist  # ✅
  ```
- **Root cause:** `source:links:dist` includes `npm run strangler:build:production-like`, which removes/recreates `dist/` during execution. Running other `dist`-rooted audits concurrently causes them to observe a missing or torn `dist/` directory.
- **Impact:** Local parallel CI runs (or an impatient developer running multiple checks at once) can produce false failures. This undermines trust in the gate and invites "just re-run it" workarounds.
- **Suggested repair lane:** `lane/system-script-safety`
- **Repair direction:** Either make `source:links:dist` not rebuild dist (use a separate `build` prerequisite) or make `strangler:build:production-like` write to a staging directory and atomically swap. Alternatively, document that dist-rooted scripts must run sequentially.
- **Do not mix with:** P1-01 (SW gate coupling).

---

### P2-04 — `interactive-audit` requires a running server but no npm script orchestrates one

- **Severity:** P2
- **Category:** developer experience / test orchestration
- **Route/files:** `scripts/interactive-audit.js`, `package.json`
- **Status:** `confirmed-current`
- **Evidence:**
  ```bash
  npm run interactive-audit
  # → FATAL page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:8080/...
  ```
  With a manually started server:
  ```bash
  python3 -m http.server 8080 --directory dist &
  AUDIT_BASE=http://127.0.0.1:8080 npm run interactive-audit
  # → ✅ Interactive audit passed
  ```
- **Root cause:** The script reads `AUDIT_BASE` (default `http://127.0.0.1:8080`) but no npm script starts a static server on that port before invoking the audit.
- **Impact:** `npm run interactive-audit` fails out of the box. It is also not part of `validate:publication` (`validate:static-publication && npm run interactive-audit`) because `validate:publication` itself does not orchestrate the server.
- **Suggested repair lane:** `lane/system-test-orchestration`
- **Repair direction:** Add a wrapper script or npm script that starts `http-server dist -p 8080`, runs `interactive-audit` with `AUDIT_BASE`, and tears down the server on exit.
- **Do not mix with:** P2-03 (script race conditions).

---

### P2-05 — AGENTS.md mandates `css/premium-controls.css` but the file is missing and the canonical source is unreferenced

- **Severity:** P2
- **Category:** stale documentation / dead source / asset inventory
- **Route/files:** `AGENTS.md` §2, `css/`, `src/styles/premium-controls.css`, `sw.js`, `src/components/ui/premium-controls/PremiumControlAnchor.astro`
- **Status:** `confirmed-current`
- **Evidence:**
  ```bash
  ls -1 css/*.css | wc -l
  # → 7
  ls -1 css/*.css
  # → command-palette.css, floating-cluster.css, home.css, mobile-hotfix.css,
  #    nagornaya-mobile-toc.css, site-layered.css, site.css
  test -f css/premium-controls.css || echo "MISSING"
  # → MISSING
  grep -R "premium-controls.css" src/ js/ css/ scripts/ sw.js .github/ 2>/dev/null
  # → (no matches)
  grep -R "src/styles/premium-controls.css\|styles/premium-controls.css" src/ js/ scripts/ 2>/dev/null
  # → (no matches)
  ```
  `AGENTS.md` line 335–342 explicitly lists:
  ```text
  ├── css/                            ← РОВНО 8 ФАЙЛОВ. БОЛЬШЕ НЕ СОЗДАВАТЬ.
  │   ├── premium-controls.css        ← копия канонического источника src/styles/premium-controls.css
  ```
- **Root cause:** `src/styles/premium-controls.css` exists (165 lines) but is not copied to `css/` and is not imported anywhere. The runtime PremiumControls styles live in component-scoped `<style>` blocks and/or `css/floating-cluster.css`. The AGENTS.md inventory is stale.
- **Impact:**
  1. **Documentation/contract drift:** new agents are told there are 8 CSS files and a specific copy relationship that does not exist.
  2. **Dead source risk:** `src/styles/premium-controls.css` may be silently rotting; future PremiumControls changes may be made in the wrong file.
  3. **SW precache gap:** if `css/premium-controls.css` was intended to be a runtime asset, it is not precached.
- **Suggested repair lane:** `lane/system-asset-inventory`
- **Repair direction:** Either (a) restore the copy step and add `css/premium-controls.css` to SW precache if it is needed, or (b) remove `src/styles/premium-controls.css` and update AGENTS.md to reflect the actual 7-file inventory.
- **Do not mix with:** P2-02 (cache-bust-assets omits `css/site-layered.css`).

---

### P2-06 — ~62 CSS custom properties are defined but never referenced

- **Severity:** P2
- **Category:** maintainability / dead CSS / performance
- **Route/files:** `css/site.css`, `css/site-layered.css`, `css/home.css`, etc.
- **Status:** `suspected` → needs verifier/second witness because dynamic `setProperty`/`getPropertyValue` usage may explain some
- **Evidence:**
  ```bash
  python3 scripts/dead-css-vars.py   # see artifacts/dead-css-vars-2026-07-02.txt
  ```
  Result:
  ```text
  Defined: 242
  Used (var() in css/js/src): 413
  Dead candidates: 62
  Examples: --accent-strong, --action, --active, --after, --ambient, --before,
            --biography, --bl, --border-strong, --br, --centered, --closing,
            --current, --debunk, --dove, --email, --fg, --fg-secondary, --first,
            --float, --full, --ghost, --greek, --grid, --hebrew, --hermeneutics,
            --hero, --hidden, --icon-radius, --icon-size, --label, --latin,
            --link, --max, --mini, --mirror, --neutral, --ng-toc-bg, --no-border,
            --note-bg, ...
  ```
- **Root cause:** CSS custom properties accumulated during theme evolution and partial migrations. Some were likely replaced by Tailwind utilities or by differently-named variables; others may be reserved but unused.
- **Impact:** Bloat, misleading theming, higher specificity/debugging cost. Not a functional bug but a maintainability drag. The canonical ledger already notes "29 dead CSS custom properties, 6 empty @media blocks" from an older check; the current count on HEAD `d5d9388b` is higher, suggesting the debt is growing.
- **Suggested repair lane:** `lane/system-css-debt`
- **Repair direction:** Run a definitive dead-variable purge script that also checks `setProperty`/`getPropertyValue` and inline `style="--name"` usage, then remove confirmed-dead properties.
- **Do not mix with:** P2-05 (premium-controls.css inventory).

---

### P3-01 — `data-gill-current-part` is written but never read

- **Severity:** P3
- **Category:** dead HTML attribute / maintainability
- **Route/files:** `src/components/article-pilots/gill-series/GillSeriesOverlay.astro`
- **Status:** `confirmed-current`
- **Evidence:**
  ```bash
  grep -R "data-gill-current-part" src/ js/
  # → src/components/article-pilots/gill-series/GillSeriesOverlay.astro: ... data-gill-current-part={isCurrent ? 'true' : undefined} ...
  ```
  No JS reads the attribute.
- **Root cause:** Attribute added for a feature that was never implemented or was refactored away.
- **Impact:** Minor DOM/markup noise. Listed as still-open in `CURRENT_HEAD_CANONICAL_LEDGER_2026-06-27.md`; this pass confirms it remains true on newer HEAD `d5d9388b`.
- **Suggested repair lane:** `lane/system-micro-cleanup`
- **Repair direction:** Remove the attribute or implement the consumer.

---

## 2. Confirmations of existing findings

### Confirm P1-01 (previous pass) — SW precache / pagefind ordering
- **Target report:** `incoming/arena-agent-auditor/2026-07-02/REPORT.md`
- **Target finding:** P1-01 missing `/pagefind/pagefind.js` after `strangler:build:production-like`
- **My evidence:** Reproduced on current HEAD. Also confirmed the inverse: after `pagefind:build:dist` the audit passes.
- **Recommended status:** `confirmed-current` → refine title to "SW dist readiness not covered by local static gate".

### Confirm P1-02 (previous pass) — hand-edited `CACHE_VERSION`
- **Target report:** `incoming/arena-agent-auditor/2026-07-02/REPORT.md`
- **Target finding:** `CACHE_VERSION` in `sw.js` is hand-edited
- **My evidence:** `grep -n "CACHE_VERSION\|cache_name\|sw.js" scripts/cache-bust.js` returns no matches; `git log --oneline -5 sw.js` shows manual "SW cache bump" commits.
- **Recommended status:** `confirmed-current`.

### Confirm P2-01 (previous pass) — `validate.js` only audits legacy `articles/`
- **Target report:** `incoming/arena-agent-auditor/2026-07-02/REPORT.md`
- **My evidence:** `scripts/validate.js` lines 43–44 still point to `../articles`; only 10 legacy fallback HTML files are checked.
- **Recommended status:** `confirmed-current`.

### Confirm canonical ledger item — BaptistyRossii 11 PageHead components 92–93% copy-paste
- **Target ledger:** `verified/CURRENT_HEAD_CANONICAL_LEDGER_2026-06-27.md`
- **My evidence:** `src/components/baptisty-rossii/BaptistyRossiiPageHead.astro` contains a TODO comment to the same effect; the 11 per-route PageHead files still exist on HEAD `d5d9388b`.
- **Recommended status:** `confirmed-current`.

### Confirm canonical ledger item — `data-gill-current-part` not read
- **Target ledger:** `verified/CURRENT_HEAD_CANONICAL_LEDGER_2026-06-27.md`
- **My evidence:** See P3-01 above.
- **Recommended status:** `confirmed-current`.

---

## 3. Challenges / Disputes

### Challenge P2-06 candidate count
- **Target finding:** P2-06 — 62 dead CSS custom properties
- **Reason for challenge:** The static grep does not catch dynamic `element.style.setProperty('--name')` or inline `style="--name:..."` usage. Some candidates (e.g., `--accent-strong`) may be used via JS or Astro props.
- **Current HEAD evidence:** `js/site.js` uses `setProperty('--gb-tip-arrow-x', ...)`, `setProperty('--gb-popover-arrow-x', ...)`, `setProperty('--home-tilt-*', ...)`. None of the 62 candidates were found in `setProperty` calls in a quick scan, but a full audit is needed.
- **Recommended status:** `suspected` until dynamic usage is ruled out.

---

## 4. Duplicate / Merge Proposals

None at this time.

---

## 5. Severity Proposals

- **P1-01 (previous pass):** Downgrade title from "SW precache entry missing" to "SW dist readiness not enforced by local static gate". Severity remains **P1** because deploy-fragile orchestration is a deploy-blocking risk class.
- **P2-06:** Proposed severity **P2** if confirmed dead after dynamic-usage check; otherwise **P3** or `false-positive`.

---

## 6. Repair Lane Suggestions

| Lane | Bug IDs | Rationale | Do NOT mix |
|------|---------|-----------|------------|
| `lane/system-sw-gate-coupling` | P1-01-R | CI/local gate orchestration | P1-02 |
| `lane/system-sw-automation` | P1-02 | CACHE_VERSION automation | P1-01-R |
| `lane/system-script-safety` | P2-03, P2-04 | npm script orchestration / concurrency | content fixes |
| `lane/system-asset-inventory` | P2-05, P2-02 | CSS asset inventory + cache-bust list | visual changes |
| `lane/system-css-debt` | P2-06 | dead custom properties cleanup | route-level work |
| `lane/system-micro-cleanup` | P3-01 | dead attributes | — |
| `lane/system-validator-astro` | P2-01 | extend validate.js to Astro/dist | content fixes |

---

## 7. Reverify notes

- All local gates PASS on `d5d9388b`.
- `visual:parity:guard` PASS: 11 routes × 2 viewports within baseline +0.5%.
- `konfessii:audit` PASS.
- `interactive-audit` PASS when run with a local server.
- `source:links:dist` PASS with 18 bot-block/timeout warnings (non-blocking).
- `dist:jsonld:audit` and `schema:rich-results:audit:dist` PASS when run sequentially after a stable dist build.
- `validate:all` PASS with 2 non-blocking title/og:title warnings.
- `native:runtime:audit:strict` PASS; `/izbrannoe/` is intentionally `native-with-legacy-head` per matrix contract.

---

## 8. Notes for verifier

1. The most actionable new finding is **P1-01-R**: the SW dist audit is green only because CI happens to run pagefind first. This is a latent fragility, not a constant failure.
2. **P2-03** and **P2-04** are developer-experience / robustness issues that can cause false CI failures or local confusion.
3. **P2-05** and **P2-06** are maintainability debt clusters. P2-05 is easy to resolve (update doc or restore/remove file). P2-06 needs a second witness with dynamic-usage awareness.
4. No new P0 or security findings were discovered in this pass.
5. All evidence commands are reproducible on HEAD `d5d9388b` with Node `v22.12.0` and Playwright Chromium installed per `SANDBOX-ENV-2026-06-21.md`.
