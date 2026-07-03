# Commands — PremiumControls verifier — 2026-06-26

```bash
# Read attachments
python3 -m pip install --user pypdf
python3 - <<'PY'
from pypdf import PdfReader
from pathlib import Path
p=Path('/home/user/uploads/Полный план внедрения PremiumControls по всему проекту.pdf')
reader=PdfReader(str(p))
text='\n\n'.join(page.extract_text() or '' for page in reader.pages)
Path('/home/user/premium-controls-uploads/premium-controls-plan.txt').write_text(text)
PY

# Fresh source clone after auto cache-bust commit
rm -rf /home/user/gb-src
git clone --depth 1 https://github.com/FedorMilovanov/gb-is-my-strength.git /home/user/gb-src
cd /home/user/gb-src
git log --oneline -1

# Current gates snapshot
npm run validate:all
node scripts/audit-pro.js
npm run content:guard
npm run native:runtime:audit:strict

# PremiumControls evidence
node - <<'NODE'
const fs=require('fs'),crypto=require('crypto');
for (const f of ['js/floating-cluster-controller.js','css/floating-cluster.css','css/site.css','js/site.js']) console.log(f, crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex').slice(0,8), fs.statSync(f).size);
NODE

grep -R "floating-cluster-controller.js?v=" -n src articles baptisty-rossii nagornaya --include='*.astro' --include='*.html' | sed -E 's/.*v=([a-f0-9]+).*/\1/' | sort | uniq -c
grep -R "floating-cluster.css?v=" -n src articles --include='*.astro' --include='*.html' | sed -E 's/.*v=([a-f0-9]+).*/\1/' | sort | uniq -c
grep -R "PremiumControlAnchor\|premium-control-anchor\|premium-controls-controller\|src/styles/premium-controls" -n src js css scripts package.json

grep -R "\.gb-floater\|\.gb-ember\|\.gb-save" -n src/components/ui/floating-cluster css/floating-cluster.css | head -120
```
