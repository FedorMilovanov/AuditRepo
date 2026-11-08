#!/bin/sh
set -e
rm -rf .test-build
npx tsc --outDir .test-build --module es2022 --target es2022 --moduleResolution bundler --strict --skipLibCheck src/imena-boga-horeb-3d/data/exhibits.ts src/imena-boga-horeb-3d/data/validate.ts src/imena-boga-horeb-3d/engine/nav.ts
echo '{"type":"module"}' > .test-build/package.json
node tests/run.mjs
