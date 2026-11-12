#!/bin/sh
set -e
rm -rf .test-build
npx tsc --outDir .test-build --module es2022 --target es2022 --moduleResolution bundler --strict --skipLibCheck \
  src/imena-boga-horeb-3d/data/exhibits.ts \
  src/imena-boga-horeb-3d/data/validate.ts \
  src/imena-boga-horeb-3d/data/learningJourney.ts \
  src/imena-boga-horeb-3d/data/siteClues.ts \
  src/imena-boga-horeb-3d/data/expedition.ts \
  src/imena-boga-horeb-3d/data/fieldStudies.ts \
  src/imena-boga-horeb-3d/data/heroStudies.ts \
  src/imena-boga-horeb-3d/data/journeyBeats.ts \
  src/imena-boga-horeb-3d/engine/nav.ts \
  src/imena-boga-horeb-3d/engine/soundscape.ts \
  src/imena-boga-horeb-3d/engine/quality.ts
echo '{"type":"module"}' > .test-build/package.json
node tests/run.mjs
# Construction smoke test: esbuild bundles TS source (resolves extensionless imports), three stays external.
npx esbuild tests/construct.ts --bundle --platform=node --format=esm --external:three --outfile=.test-build/construct.mjs
node .test-build/construct.mjs
# Geometric placement check: every stele on solid ground (wall + zone-4 chasm ledge).
npx esbuild tests/placement.ts --bundle --platform=node --format=esm --external:three --outfile=.test-build/placement.mjs
node .test-build/placement.mjs
# Browser visual audit: Sparticuz Chromium 153 via @sparticuz/chromium + puppeteer-core.
# Optional — skipped if chromium binary or dev server unavailable.
if [ -x /tmp/chromium ] && curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:5173/ 2>/dev/null | grep -q 200; then
  echo "--- Browser visual audit (Sparticuz Chromium 153) ---"
  LD_LIBRARY_PATH=/tmp/al2023/lib node tests/browser-audit.mjs
  echo "--- Browser interaction test ---"
  LD_LIBRARY_PATH=/tmp/al2023/lib node tests/browser-interactions.mjs
  echo "--- Browser dialog & resilience test ---"
  LD_LIBRARY_PATH=/tmp/al2023/lib node tests/browser-dialogs.mjs
else
  echo "--- Browser tests: SKIPPED (chromium binary or dev server unavailable) ---"
fi
