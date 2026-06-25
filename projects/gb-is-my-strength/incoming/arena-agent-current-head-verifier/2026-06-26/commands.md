# Commands — arena-agent-current-head-verifier — 2026-06-26

Source repo: `/home/user/gb-is-my-strength`
Audit repo: `/home/user/AuditRepo`

```bash
# Clone/read AuditRepo
git clone --depth 1 https://github.com/FedorMilovanov/AuditRepo.git /home/user/AuditRepo
find /home/user/AuditRepo -maxdepth 4 -type f | sort

# Read canonical docs
cat README.md
cat PROJECT_REGISTRY.md
cat MULTI_WITNESS_VERIFICATION_PROTOCOL.md
cat projects/gb-is-my-strength/README.md
cat projects/gb-is-my-strength/verified/START_HERE_2026-06-25.md
cat projects/gb-is-my-strength/verification/START_HERE_2026-06-25.md
cat projects/gb-is-my-strength/verified/UNIFIED_BUG_LEDGER_2026-06-25.md
cat projects/gb-is-my-strength/verified/repair-order-unified-2026-06-25.md
cat projects/gb-is-my-strength/verified/repair-order-2026-06-26-top-verifier.md
cat projects/gb-is-my-strength/working/VERIFIER_SYNTHESIS_TOPOVOY_2026-06-26.md

# Create intake
python3 scripts/scaffold_intake.py gb-is-my-strength arena-agent-current-head-verifier 2026-06-26
rm projects/gb-is-my-strength/incoming/arena-agent-current-head-verifier/2026-06-26/comments/comment-on-OTHER-AGENT-BUG-ID.md
rm projects/gb-is-my-strength/incoming/arena-agent-current-head-verifier/2026-06-26/proposals/proposal-TARGET-BUG-ID.md

# Current source repo evidence collection
cd /home/user/gb-is-my-strength
git status --short --branch
git log --oneline -3
node --version
npm --version
npm run validate:all || true
node scripts/audit-pro.js || true
npm run content:guard || true
npm run migration:metadata:check:strict || true
npm run native:runtime:audit:strict || true

grep -n 'visible FAQ without FAQPage\|FAQPage' -C 3 scripts/seo-audit.js
python3 - <<'PY'
from pathlib import Path
import re
for p in ['articles/20-antisovetov-pastoru/index.html','articles/krajne-li-isporcheno-serdce/index.html']:
    t=Path(p).read_text(errors='ignore')
    print(p)
    print('  contains exact old needle:', '"@type": "FAQPage"' in t)
    print('  regex FAQPage count:', len(re.findall(r'"@type"\s*:\s*"FAQPage"', t)))
PY

grep -n 'robots.*noindex\|canonical\|rodosloviye' rodosloviye/index.html sitemap.xml data/public-content-baseline.json | head -80

grep -R $'�' -n src articles baptisty-rossii nagornaya karty hard-texts map about index.html 2>/dev/null
grep -R 'кик говорят\|называемая , \.Святое' -n src articles baptisty-rossii nagornaya karty hard-texts map about index.html 2>/dev/null
grep -R 'баптистовОсобые\|супралапсарианскойСупра\|КархемишеБитва\|катехизисРеформатский' -n src/content/articles

grep -n 'PRECACHE_ASSETS' -m1 sw.js
grep -n 'site-layered\|site-modules\|series-cards\|sw.js PRECACHE_ASSETS missing live files' -C 2 scripts/cache-bust.js scripts/audit-pro.js sw.js | head -200

# Validate AuditRepo after writing intake
cd /home/user/AuditRepo
python3 scripts/validate_audit_repo.py
```
