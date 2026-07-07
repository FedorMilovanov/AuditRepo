# gb-is-my-strength / gospod-bog.ru

**Status:** ⚠️ REGRESSION AUDIT #2 — P0-FC-REC fixed (ca6a25a), but REG-001 (P0: `_headers` useless on GitHub Pages) and REG-002 (P1: deploy SPOF) found. See `verified/MASTER_BUG_MATRIX.md`. **Separately:** TTS engine swap (2026-07-06, see below) merged directly to `main`, bypassing the normal PR/CI review gate at the user's explicit request — needs its own dedicated audit pass, it has not been through the workflow this repo normally requires.
**Last source HEAD checked:** `24582e7` (2026-07-07, `ALLOWED_JS` audit-allowlist fix — deploy.yml run `28863052825` confirmed green, all 30 steps incl. Gill smoke tests)
**Previous HEAD:** `86bec6e` (2026-07-06, Vosk TTS engine merge — see "Recent changes not yet audited" below)

## Quick facts

- Source: `FedorMilovanov/gb-is-my-strength`
- Production: `https://gospod-bog.ru`
- Tech: Astro + strangler pattern (root HTML + Astro dist)
- Premium controls: v16 SVG floating cluster (`gb-icon`, `gb-ember`, `gb-save`)

## Current operational truth

Use `verified/MASTER_BUG_MATRIX.md` first — updated 2026-07-03 Pass 23: REG-001 (P0: _headers useless on GitHub Pages), REG-002 (P1: deploy SPOF), 5 confirmed fixes.

Current source checks performed during cleanup:

```text
source HEAD: 66640561919501e68dd9d3cd290ff9afe53d3068
AuditRepo HEAD before cleanup: c3a9ae27df749c09a88650ae0e16e348db61c1c7
package.json scripts.dist:jsonld:audit = node scripts/dist-jsonld-audit.js --root dist
npm run workflows:check = PASS
```

### Recent changes not yet audited by a dedicated pass

- **2026-07-06, `main` @ `86bec6e`** — TTS engine on article pages
  (`js/floating-cluster-controller.js`'s "Слушать" ember) replaced: Web
  Speech API (`speechSynthesis`) → **vosk-tts** (alphacep/vosk-tts, Apache
  2.0, VITS + BERT stress model) run client-side via onnxruntime-web, with
  automatic silent fallback to Web Speech on any failure (network,
  unsupported browser, model parse error). New files: `js/vosk-tts-core.js`
  (JS port of vosk-tts's Python text pipeline), `js/vosk-tts-engine.js`
  (browser wrapper, lazy-loads model+runtime only on first click, caches in
  IndexedDB). CSP (`script-src`/`connect-src`) extended to
  `cdn.jsdelivr.net` and `alphacephei.com` on the 37 `*PageHead.astro`/
  `*PageChrome.astro` components that actually reach production (verified
  via `migration/page-ownership.json` — see the incoming report's
  post-merge correction) + the `DEFAULT_DIST_CSP` fallback in
  `scripts/astro-cache-bust-postbuild.js`. A same-day follow-up also
  edited 26 root-level legacy HTML pages under `articles/`,
  `baptisty-rossii/`, `nagornaya/` on the mistaken belief they were live —
  they are all `owner: astro` / `status: production-dist` in
  `page-ownership.json` and `copy-legacy-to-dist.js` never copies them
  into `dist/`, so those 26 are stale strangler-migration leftovers with
  no production effect. Harmless edit, but not a real fix; see the
  incoming report for the full correction and a housekeeping suggestion
  (deleting this class of orphaned root HTML) for a future pass.
  Full detail and known caveats: `incoming/vosk-tts-integration-2026-07-06/REPORT.md`.
  **This merged straight to `main` without going through this repo's normal
  PR-triggered CI/validate:static-publication gate** (explicit user
  decision — see the incoming report for why). `npm run validate`
  (non-strict) was run and passed clean; `validate:static-publication` /
  full `astro:build` were **not** run. Flag this for the next audit pass:
  treat it as unverified against this repo's usual bar until someone runs
  the full validation suite and/or a live production smoke test of the
  "Слушать" button confirms the `alphacephei.com` model fetch actually
  succeeds cross-origin from `gospod-bog.ru` (verified only from
  `localhost`/`file://` during development — see the incoming report's
  CORS caveat).

- **2026-07-06→07, `main` @ `3280445` → `c95ef43` → `24582e7`** — three
  follow-up pushes after the TTS merge above, all direct-to-`main`:
  - `3280445` — **D-23 deploy-blocking regression fix.** The original
    `resolveTtsEngine()` design (synchronous wait for Vosk on first click)
    broke the deploy-blocking `gill:mobile-play:smoke` test (8 failing
    assertions), silently pinning production to `14a49be8` with no
    user-visible error. Fixed by making Web Speech start immediately/
    synchronously when available, warming Vosk silently in the background
    (`warmVoskInBackground()`) for next time.
  - `c95ef43` — layered Russian stress dictionary (`js/vosk-stress-lookup.js`
    + `js/vosk-custom-terms.json` + `js/vosk-stress-marker.bin`, sourced
    from the new [gb-vosk-tts](https://github.com/FedorMilovanov/gb-vosk-tts)
    repo) wired into `vosk-tts-engine.js` to fill stress gaps for
    site-specific theological terms and proper names vosk-tts's own
    dictionary leaves completely unstressed.
  - `24582e7` — **repeat of the same CI-blocking-miss pattern as D-23:**
    `scripts/audit-pro.js`'s `ALLOWED_JS` allowlist didn't include the new
    `js/vosk-stress-lookup.js`, failing `indexnow.yml`'s "Static publication
    gates" step and blocking `deploy.yml`'s `workflow_run` trigger. Fixed by
    adding the filename to `ALLOWED_JS`; confirmed via `mcp__github__actions_get`
    that `deploy.yml` re-ran (triggered directly via its own `scripts/**`
    push-path filter) and completed all 30 steps successfully.
  Full detail: `incoming/vosk-tts-integration-2026-07-06/REPORT.md`
  ("Round 3"). **Recurring lesson for this repo:** any push that adds a new
  file under `js/` must also add it to `scripts/audit-pro.js`'s `ALLOWED_JS`
  set, or CI fails silently and deploy just never runs — always check
  Actions status after a direct-to-`main` push, don't assume green.

### Current fixed/stale items

- Old workflow-policy red item for `dist:jsonld:audit --root dist` is **fixed-current / stale-on-current-head**.
- Old broad “CI collapse” framing is stale.
- Old “Gill parts 2/3/spravochnik are still the legacy base” framing is stale for current planning. The current base is v16; the remaining work is v16 consolidation.
- Old 2026-06-25 “60 confirmed bugs / 9 P0” is historical baseline, not active repair order.

### Current open PremiumControls/Gill items

- **PC-CURRENT-02:** RomanNumeral false-green unless fresh source+dist evidence proves `gb-roman` is present on all five Gill routes and raw `I/II/III` is gone.
- **PC-CURRENT-03:** unversioned PremiumControls asset refs unless fresh source+dist evidence proves versioned `floating-cluster.css` / controller refs.
- **PC-CURRENT-04:** CSS inventory decision: deployed runtime truth is `css/floating-cluster.css`; absent `css/premium-controls.css` must not be listed as deployed canon.
- **PC-CURRENT-05:** malformed transition fragments / Gill v16 CSS scope leaks unless fresh CSS sanitation proof closes them.
- **PC-CURRENT-06:** Gill mobile current series item must open `#partTocOverlay` without navigation and have an interactive guard.

## Hermeneutics position truth

Canonical source truth must match `css/floating-cluster.css`:

```css
.gb-floater--hermeneutics {
  top: calc(clamp(24px, 3.5vw, 44px) - 4px);
  right: max(8.5vw, env(safe-area-inset-right, 0px));
}

@media (max-width: 899px) {
  .gb-floater--hermeneutics {
    top: calc(clamp(24px, 3.5vw, 44px) - 4px);
    right: max(4.5vw, env(safe-area-inset-right, 0px));
  }
}
```

Old formula is **SUPERSEDED / WRONG / POS-01 / NEVER REINTRODUCE**:

```css
right: max(calc((100vw - min(820px, 92vw)) / 2 - 28px), 16px);
```

## Primary current documents

| File | Purpose |
|------|---------|
| `verified/CURRENT_HEAD_CANONICAL_LEDGER_2026-06-27.md` | Primary current-head operational truth |
| `verified/REPAIR_ORDER_DELTA_2026-06-27_current-head-priority-reset.md` | Current repair ordering |
| `verification/CANONICAL_VERIFIER_NOTE_2026-06-27_current-head-status-flips-and-second-order-defects.md` | Status flips and stale/current classes |
| `PremiumControls/README.md` | PremiumControls current contract |

## Historical baseline only

- `verified/UNIFIED_BUG_LEDGER_2026-06-25.md`
- `verified/repair-order-unified-2026-06-25.md`
- older `incoming/` reports and archived ledgers

Do not delete evidence. Do not use historical counts as current operational truth without fresh HEAD reverify.
