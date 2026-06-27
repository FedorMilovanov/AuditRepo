# Agent Work Report — PremiumControls current-main surgical follow-up

## Meta
- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength
- AuditRepo path: `projects/gb-is-my-strength/incoming/arena-agent-premiumcontrols-surgeon/2026-06-27/`
- Agent: Arena Agent
- Date: 2026-06-27
- Current source main audited: `23f283d4`
- Repair branch pushed: `lane/system-premiumcontrols-dist-gate-wiring-2026-06-27`
- Repair commits pushed:
  - `ae9f3d4f` — wire `audit:premium-controls` into dist/deploy gates
  - `7cb0f8c7` — align `dist-publication-audit` Gill markers with v16 chrome
- Mode: current-main reverify + precise system guard wiring + stale-guard classification

## 0. Sandbox / environment action

I re-read `docs/SANDBOX-ENV-2026-06-21.md` and applied its Arena guidance:

- Keep Node 22 in PATH for every command.
- Avoid parallel Astro builds.
- Use FAST loop + final FULL barrier.
- If build gates hit sandbox limits, document blockers.

The file states the environment is ~2 vCPU / ~1.9–2 GiB RAM. A later full build attempt hit `exit 137`; because this Arena has sudo/root access, I added temporary swap to increase effective memory for this session:

```bash
sudo fallocate -l 4G /swapfile-arena
sudo chmod 600 /swapfile-arena
sudo mkswap /swapfile-arena
sudo swapon /swapfile-arena
```

After that, `free -h` showed ~1.9 GiB RAM + 4.0 GiB swap, and the full production-like dist barrier completed.

## 1. New current-main findings confirmed by tests

### PC-GATE-2026-06-27 — PremiumControls audit existed but was not wired into production-like dist/deploy gate

**Status before repair:** confirmed-current on source `23f283d4`  
**Severity:** P1/P2 boundary — protection gap, not visible UI breakage  
**Scope:** `package.json`, `.github/workflows/deploy.yml`, `scripts/check-workflows.js`

Evidence:

- `package.json` had `audit:premium-controls = node scripts/premium-controls-rollout-audit.js`.
- `dist:jsonld:audit` was already fixed to `--root dist`.
- But `strangler:audit:production-like` did not call `audit:premium-controls`.
- Deploy workflow did not call it either.
- `check-workflows.js` did not require it.

Meaning: the new bulletproof PremiumControls rollout audit could be green manually, but still skipped by the main production-like dist barrier and Pages deploy.

### PC-DIST-GILL-MARKER-2026-06-27 — `dist-publication-audit` still expected legacy `gbs2-rail` on v16 Gill routes

**Status before repair:** confirmed-current on source `23f283d4` + branch after first repair  
**Severity:** P1 guard drift / false-red release blocker  
**Scope:** `scripts/dist-publication-audit.js`

After enabling swap, `npm run strangler:audit:production-like` completed the build but failed at `dist-publication-audit`:

```text
/articles/dzhon-gill-spravochnik/ missing visual-shadow markers: gbs2-rail
/articles/dzhon-gill-chast-1-chelovek/ missing visual-shadow markers: gbs2-rail
/articles/dzhon-gill-chast-2-uchenyi/ missing visual-shadow markers: gbs2-rail
/articles/dzhon-gill-chast-3-nasledie/ missing visual-shadow markers: gbs2-rail
```

This was stale guard truth. Current Gill v16 pages correctly use `data-gill-v16` + `gbs-rail`, not legacy `gbs2-rail`.

## 2. Repairs pushed to source branch

Pushed source branch:

```text
lane/system-premiumcontrols-dist-gate-wiring-2026-06-27
```

Commits:

```text
ae9f3d4f [LANE lane/system-premiumcontrols-dist-gate-wiring-2026-06-27] system(premiumcontrols): wire rollout audit into dist gates
7cb0f8c7 [LANE lane/system-premiumcontrols-dist-gate-wiring-2026-06-27] system(gill): align dist publication markers with v16 chrome
```

Changes:

- `package.json`
  - `strangler:audit:production-like` now runs `npm run audit:premium-controls` after `dist:jsonld:audit` and before browser dist smoke.
- `.github/workflows/deploy.yml`
  - deploy now runs `npm run audit:premium-controls` after dist JSON-LD parse audit.
- `scripts/check-workflows.js`
  - workflow policy now requires PremiumControls rollout audit in both production-like dist gate and deploy workflow.
- `scripts/dist-publication-audit.js`
  - all five Gill routes now require `data-gill-v16` + `gbs-rail` markers instead of stale `gbs2-rail` markers.
- `docs/refactor-2026/lanes/system-premiumcontrols-dist-gate-wiring-2026-06-27.md`
  - source lane report updated with swap-backed final verification.

## 3. Verification evidence

Evidence files:

```text
evidence/PREMIUMCONTROLS_55_SOURCE_MATRIX_7cb0f8c7.log
evidence/VALIDATE_STATIC_PUBLICATION_7cb0f8c7.log
evidence/STRANGLER_AUDIT_PRODUCTION_LIKE_7cb0f8c7.log
```

### 55-check source/current-main matrix

```text
TOTAL=55 PASS=55 FAIL=0
```

Covered areas:

- workflow policy;
- shared-file guard;
- validate:all;
- owner UI guard;
- 13 visual/parity audits;
- maps, Avraam, tokens, CSS layer;
- audit-pro;
- content parity/readability/editorial/data/content guard;
- Gill reading-time and Pagefind-body audits;
- migration metadata strict + native runtime strict;
- route profiles / migration matrix / content-source strict;
- Astro no-build route audits;
- Gill v16 source invariants;
- retired legacy Gill mobile DOM class check;
- PremiumControls mode enum check;
- canonical PremiumControls CSS source/public parity;
- no phantom `premium-controls-controller` reference;
- `dist:jsonld:audit` root check;
- production-like PremiumControls audit wiring check;
- `package.json` parse.

### Full static publication

```text
npm run validate:static-publication ✅ PASS
```

### Full production-like dist / Playwright path

```text
npm run strangler:audit:production-like ✅ PASS
```

Important sub-results inside that gate:

```text
PremiumControls rollout audit: 39/39 passed
✅ PremiumControls rollout contract OK.
✅ dist smoke passed — representative production-like strangler output is healthy
✅ CSS parity audit passed: 52/52 pages carry project CSS.
✅ SW dist readiness audit passed
```

## 4. Relation to new AuditRepo PremiumControls wave

I synthesized the newer reports that landed after my prior pass, including:

- `PremiumControls/DEEP_REVERIFY_2026-06-27.md`
- `PremiumControls/REMOTE_MAIN_DEEP_AUDIT_2026-06-27.md`
- `PremiumControls/REMOTE_MAIN_DEEP_AUDIT_SUMMARY_2026-06-27.md`
- `PremiumControls/BUTTON_INTERACTION_AUDIT_2026-06-27.md`
- `incoming/arena-surgical-surgeon/2026-06-27/DEEP_FOURTH_WAVE_VISUAL_AUDIT_RECONCILIATION_2026-06-27.md`
- earlier PremiumControls remaining-risk / replay / reconciliation reports.

Synthesis:

- PC-001..PC-006 are no longer broad-open on current main.
- Current failures are second-order guard/truth-model issues, not “PremiumControls globally broken”.
- The newest reports correctly point toward smarter audits and guarded visual stability.
- My two repairs match that direction: do not retune visuals; instead, make the guards reflect v16 truth and make them unavoidable in production-like/deploy paths.

## 5. Current recommendation

1. Merge or PR source branch `lane/system-premiumcontrols-dist-gate-wiring-2026-06-27` if CI agrees.
2. Keep PremiumControls visual/position/speed-pill freeze intact.
3. Treat controller decomposition and CSS architecture decision as separate owner-approved lanes.
4. Consider documenting the temporary Arena swap trick in `SANDBOX-ENV-2026-06-21.md` later, but only via a separate docs/system lane; I did not modify that contract in this lane.

## 6. External audit toolbox added to source repo

A new source documentation file was created and pushed in the same branch:

```text
docs/EXTERNAL_AUDIT_CHECKS_TOOLBOX_2026-06-27.md
```

Source commit:

```text
01b38ac0 [LANE lane/system-premiumcontrols-dist-gate-wiring-2026-06-27] docs(audit): add external checks toolbox for Arena and production
```

It documents:

- why OOM happened in Arena and how temporary swap fixes it;
- Node 22 / Playwright setup;
- 70 external/local audit tools and sites;
- suggested staged adoption plan: manual → warn-only → selective CI;
- first safe experiments for Pa11y, Lighthouse, Lychee, Semgrep, Gitleaks/TruffleHog.

Recommendation: treat this as advisory research. Do not turn all external tools into blocking CI at once.
