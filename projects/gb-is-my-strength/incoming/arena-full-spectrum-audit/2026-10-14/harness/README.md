# Browser harness for the 2026-10-14 full-spectrum pass (durable copy)

The sandbox that ran this pass does not persist `/home/user`, `/tmp` or `node_modules`, so the harness is stored here as text
(no binaries, no PNG — those stay out of Git per the source protocol) and rebuilt in ~20 s.

## Rebuild

```sh
mkdir -p /home/user/arena-harness && cd /home/user/arena-harness
npm init -y >/dev/null
npm i --no-audit --no-fund @sparticuz/chromium @achingbrain/nss playwright-core axe-core pdfjs-dist
node <this dir>/setup-chrome.mjs      # extracts Chromium 153 -> /tmp/gbchrome, NSS libs -> /tmp/nsslib, builds chrome.sh
node <this dir>/patch-nss.mjs         # byte-neutral NSS_3.30 -> NSS_3.22 rewrite of the vernaux entry
/tmp/gbchrome/chrome.sh --version     # expect: Chromium 153.0.8010.0
```

Playwright then uses `executablePath: '/tmp/gbchrome/chrome.sh'` with
`args: ['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']`.

## Why the two patches exist

1. The npm tarball ships a Chromium built against NSS 3.30 while `@achingbrain/nss` provides 3.22, so `libnss3.so` cannot satisfy the
   binary. `patch-nss.mjs` finds `.gnu.version_r` through the section table, locates the `Vernaux` entry whose name is `NSS_3.30`,
   rewrites the name in `.dynstr` (same byte length) and recomputes `vna_hash` — the patch must stay byte-neutral, otherwise the section
   headers shift and the binary segfaults.
2. The 3.22 `libnss3.so` does not export `PK11_HasAttributeSet`, which that Chromium requires at load. `setup-chrome.mjs` compiles a
   stub with a version script pinning the symbol to `NSS_3.22` and loads it with `LD_PRELOAD` through `chrome.sh`.

## Probes used by the receipts

The probe scripts (`gbs-audit.mjs` — 64-load axe/overview matrix, `rows-probe.mjs`, `detail.mjs`, `header-probe.mjs`,
`heart-print-rm.mjs`, `axe-flip2.mjs`, `cards-probe.mjs`, `pdf-check.mjs`, `pdf-verify2.mjs`, `verify-print-rm.mjs`) are short
Playwright scripts; each receipt in `../evidence/` names the probe that produced it, and the run commands are recorded in
`../REPORT.md` §7–§9.
