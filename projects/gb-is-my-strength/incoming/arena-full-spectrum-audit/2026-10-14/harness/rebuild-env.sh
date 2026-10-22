#!/bin/bash
# rebuild-env.sh — restore the whole measurement environment after a sandbox reset.
#
# The sandbox has been reset six times during this audit, each time wiping the
# Chromium install, the product clone and any script kept outside git. Everything
# needed to rebuild the environment from scratch is therefore kept in this
# directory, and the working copy of scripts is only ever a copy.
#
# Usage:  bash rebuild-env.sh          (chromium + product clone + production-like build)
#         bash rebuild-env.sh --no-build   (chromium + clone only, ~40 s)
#
# Result: /tmp/gbchrome/chrome.sh  — Playwright/CHROME_PATH launcher (Chromium 153)
#         /home/user/gbs-src/dist  — production-like build, served on :8099 by
#                                    `python3 -m http.server 8099` from that dir
set -x
HERE="$(cd "$(dirname "$0")" && pwd)"
WORK=/home/user/arena-harness
mkdir -p "$WORK/out"
cd "$WORK" || exit 1

# --- 1. product clone (exact SHA is printed; the audit anchor is d14da74c) ---
PRODUCT="${GBS_PRODUCT_DIR:-/home/user/gbs-src}"
if [ ! -e "$PRODUCT/.git" ]; then
  if [ -e "$PRODUCT" ]; then
    echo "Refusing to overwrite existing non-Git product directory: $PRODUCT" >&2
    exit 11
  fi
  git clone -q --depth 1 https://github.com/FedorMilovanov/gb-is-my-strength "$PRODUCT" || exit 11
fi
PRODUCT_SHA="$(git -C "$PRODUCT" rev-parse --short HEAD)" || exit 11
echo "CLONE_OK $PRODUCT_SHA"

# --- 2. browser (199 MB binary ships inside the npm tarball; see setup-chrome.mjs) ---
[ -f package.json ] || npm init -y >/dev/null 2>&1
npm i --no-audit --no-fund @sparticuz/chromium @achingbrain/nss playwright-core axe-core pdfjs-dist @napi-rs/canvas || exit 12
cp "$HERE/setup-chrome.mjs" "$HERE/patch-nss.mjs" . || exit 13
node setup-chrome.mjs || exit 14
node patch-nss.mjs || exit 15
/tmp/gbchrome/chrome.sh --version || exit 16
echo "CHROME_OK"

# --- 3. production-like build ---
if [ "$1" != "--no-build" ]; then
  cd "$PRODUCT" || exit 17
  npm ci --no-audit --no-fund >/tmp/npmci.log 2>&1 || { tail -20 /tmp/npmci.log; exit 18; }
  echo "NPMCI_OK"
  npm run strangler:build:production-like >/tmp/build.log 2>&1 || { tail -30 /tmp/build.log; exit 19; }
  echo "BUILD_OK dist=$(du -sh dist | cut -f1)"
fi
echo "ENV_READY"
