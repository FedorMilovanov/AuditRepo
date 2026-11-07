#!/bin/sh
set -e
rm -rf .test-build
npx tsc --outDir .test-build --module es2022 --target es2022 --moduleResolution bundler --strict --skipLibCheck \
  src/imena-boga-horeb-3d/data/exhibits.ts \
  src/imena-boga-horeb-3d/data/validate.ts \
  src/imena-boga-horeb-3d/engine/nav.ts
echo '{"type":"module"}' > .test-build/package.json
node tests/run.mjs
# Construction smoke test: esbuild bundles TS source (resolves extensionless imports), three stays external.
npx esbuild tests/construct.ts --bundle --platform=node --format=esm --external:three --outfile=.test-build/construct.mjs
node .test-build/construct.mjs
# Geometric placement check: every stele on solid ground (wall + zone-4 chasm ledge).
npx esbuild tests/placement.ts --bundle --platform=node --format=esm --external:three --outfile=.test-build/placement.mjs
node .test-build/placement.mjs
