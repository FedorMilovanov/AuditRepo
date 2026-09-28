#!/usr/bin/env bash
# Rebuild audit sandbox: Product dist + Chromium (sparticuz) + route list. Server is started separately on :8080.
set -e
cd /home/user/AuditRepo && git fetch -q origin arena/01a0d074-auditrepo && git reset -q FETCH_HEAD
[ -d /tmp/gb ] || git clone -q --depth 1 https://github.com/FedorMilovanov/gb-is-my-strength /tmp/gb
cd /tmp/gb && [ -f dist/index.html ] || { npm ci --no-audit --no-fund >/tmp/npmci.log 2>&1 && npm run -s strangler:build:production-like >/tmp/build.log 2>&1 && npm run -s pagefind:build:dist >/tmp/pf.log 2>&1; }
mkdir -p /tmp/chr /tmp/al /tmp/aud && cd /tmp/chr && [ -d node_modules/@sparticuz ] || { npm init -y >/dev/null && npm i -s @sparticuz/chromium axe-core >/dev/null 2>&1; }
cd /tmp/chr/node_modules/@sparticuz/chromium/bin && node -e "const z=require('zlib'),f=require('fs');f.writeFileSync('/tmp/chromium',z.brotliDecompressSync(f.readFileSync('chromium.br')));for(const t of ['al2023','swiftshader','fonts'])f.writeFileSync('/tmp/'+t+'.tar',z.brotliDecompressSync(f.readFileSync(t+'.tar.br')))" && chmod +x /tmp/chromium && for t in al2023 swiftshader fonts; do tar -xf /tmp/$t.tar -C /tmp/al; done
cd /tmp/gb/dist && find . -name index.html -not -path "./pagefind/*" | sed 's|^\.||;s|index.html$||' | sort > /tmp/routes.txt
echo "ready: $(git -C /tmp/gb log --oneline -1) routes=$(wc -l </tmp/routes.txt)"
# run scripts with: LD_LIBRARY_PATH=/tmp/al/lib:/tmp/al:/tmp node <script>
