# Browser harness for the 2026-10-14 full-spectrum pass (durable copy)

The sandbox that ran this pass does not persist `/home/user`, `/tmp` or `node_modules`, and it has been reset six times during the
audit. The harness is therefore kept here as text (no binaries, no PNG — those stay out of Git per the source protocol), and the
whole environment is rebuilt with one command.

## Rebuild everything (one command)

```sh
bash rebuild-env.sh                 # Chromium + product clone + production-like build (~4 min)
bash rebuild-env.sh --no-build      # Chromium + clone only (~40 s)
```

Result: `/tmp/gbchrome/chrome.sh` (Chromium 153 launcher) and `/home/user/gbs-src/dist` (production-like build; serve it with
`python3 -m http.server 8099` from that directory). The script asserts nothing about state — it prints `CLONE_OK`, `CHROME_OK`,
`NPMCI_OK`, `BUILD_OK`, `ENV_READY` so a failure is visible at the step that produced it.

## What is kept here in full

| file | purpose |
|---|---|
| `rebuild-env.sh` | one-command environment restore (clone, npm, browser, build) |
| `setup-chrome.mjs` | extracts Chromium 153 → `/tmp/gbchrome`, NSS libs → `/tmp/nsslib`, writes `chrome.sh` |
| `patch-nss.mjs` | byte-neutral `NSS_3.30` → `NSS_3.22` rewrite of the `.gnu.version_r` entry |
| `glossary-mobile-at.mjs` | 390×844 touch/keyboard/AX probe for the glossary trigger (receipt §2b, continuation 5) |

## Why the two patches exist

1. The npm tarball ships a Chromium built against NSS 3.30 while `@achingbrain/nss` provides 3.22, so `libnss3.so` cannot satisfy the
   binary. `patch-nss.mjs` finds `.gnu.version_r` through the section table, locates the `Vernaux` entry whose name is `NSS_3.30`,
   rewrites the name in `.dynstr` (same byte length) and recomputes `vna_hash` — the patch must stay byte-neutral, otherwise the section
   headers shift and the binary segfaults.
2. The 3.22 `libnss3.so` does not export `PK11_HasAttributeSet`, which that Chromium requires at load. `setup-chrome.mjs` compiles a
   stub with a version script pinning the symbol to `NSS_3.22` and loads it with `LD_PRELOAD` through `chrome.sh`.

Playwright uses `executablePath: '/tmp/gbchrome/chrome.sh'` with
`args: ['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']`.

## The rest of the probes

The earlier probe scripts (`gbs-audit.mjs`, `rows-probe.mjs`, `detail.mjs`, `header-probe.mjs`, `heart-print-rm.mjs`, `axe-flip2.mjs`,
`cards-probe.mjs`, `pdf-check.mjs`, `pdf-verify2.mjs`, `verify-print-rm.mjs`, plus the 2026-10-15/16 sets: `lcnm-table.mjs`,
`print-contrast-full.mjs`, `painted-contrast.mjs`, `marker-drift-sweep.mjs`, `tooltip-live2.mjs`, `glossary-sweep.mjs`,
`glossary-detail.mjs`, `gterm-ax-final.mjs`, `px4-probe.mjs`) were written during the pass and did **not** survive the sandbox
resets. They are not reconstructed here because each receipt records the method precisely enough to re-derive them — every receipt in
`../evidence/` names the technique, the route set, the selectors and the exact numbers it produced, and the run commands are recorded
in `../REPORT.md` §7–§13. What matters for re-verification is the measured data, which lives in `../evidence/*.json`.
