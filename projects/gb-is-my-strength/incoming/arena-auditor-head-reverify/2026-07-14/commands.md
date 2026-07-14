# commands.log — 2026-07-14 arena-auditor-head-reverify

gh api repos/FedorMilovanov/gb-is-my-strength --jq default_branch,pushed_at
gh api repos/FedorMilovanov/gb-is-my-strength/commits/main
gh api repos/FedorMilovanov/gb-is-my-strength/commits?sha=main&per_page=30
gh api repos/FedorMilovanov/gb-is-my-strength/pulls?state=closed&base=main&per_page=20
gh api repos/FedorMilovanov/gb-is-my-strength/actions/runs?branch=main&per_page=15
gh api repos/FedorMilovanov/gb-is-my-strength/compare/b8459bdf...2ca2af3b91ac  # ahead_by=287
gh api repos/FedorMilovanov/gb-is-my-strength/compare/007b67def5...2ca2af3b91ac # ahead_by=277
gh api repos/.../actions/runs/29338523013/jobs  # Static publication gates FAIL
gh api repos/.../actions/workflows/deploy.yml/runs?status=success&per_page=5
gh api repos/.../actions/workflows/deploy.yml/runs?per_page=100  # 1 success / 59 fail / 25 cancel since 07-11
gh api repos/FedorMilovanov/AuditRepo/commits?sha=main&per_page=15
git -C AuditRepo fetch origin main; merge origin/main into arena branch

git clone --depth=1 --filter=blob:none gb-is-my-strength @ 2ca2af3b
git archive HEAD articles baptisty-rossii ... | tar -x   # restore legacy trees for gates

node scripts/editorial-metadata-registry.js --check     # exit 1, 5 missing routes
node scripts/css-layer-validator.js css/site.css --ceiling=202  # exit 1, 210>202
node scripts/validate-map-routes.js                     # exit 1, 25 issues
node scripts/avraam-map-audit.js                        # exit 1, 25/27
node scripts/check-route-profiles.js --strict           # exit 0 (full trees)
node scripts/check-page-ownership.js                    # exit 0
node scripts/check-map-publication-status.js            # exit 0
npm run gill:series:data:consistency:audit              # exit 0
npm run mdx:structure:audit                             # exit 0
npm run tokens:check                                    # exit 0
npm run editorial:lint                                  # exit 0
npm run maps:validate                                   # exit 1
npm run migration:metadata:check:strict                 # route profiles ok with trees

rg cancel-in-progress .github/workflows/deploy.yml indexnow.yml
rg "Date.now" src/layouts/BaseLayout.astro
head sw.js; cat migration/sw-cache-version-baseline.json
python3 -c 'glossary em count'  # 55
python3 hub missing count vs «на аудите»  # 10 vs 9

curl https://gospod-bog.ru/  # SSL_ERROR_SYSCALL from sandbox (no live HTML witness)
