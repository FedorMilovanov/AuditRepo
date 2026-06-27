# PremiumControls — deep reverify with Node 22, Playwright, remote branches

**Date:** 2026-06-27
**Source repo:** `gb-is-my-strength`
**AuditRepo file:** `projects/gb-is-my-strength/PremiumControls/DEEP_REVERIFY_2026-06-27.md`
**Target source lane:** `lane/system-premiumcontrols-surgical-2026-06-27`

> This report intentionally records 50+ concrete shell/Node/Playwright checks. It is a reverify and remote-branch collision audit after the surgical replay commit.

## A. Environment and git topology

### Check 1 — Node 22 version
```bash
/tmp/node-v22.12.0-linux-x64/bin/node -v 
```
**Result:** PASS
```text
v22.12.0
```

### Check 2 — npm version under Node 22
```bash
/tmp/node-v22.12.0-linux-x64/bin/npm -v 
```
**Result:** PASS
```text
10.9.0
```

### Check 3 — Source git status
```bash
git -C /home/user/work/gb-is-my-strength status --short --branch 
```
**Result:** PASS
```text
## lane/system-premiumcontrols-surgical-2026-06-27
```

### Check 4 — AuditRepo git status
```bash
git -C /home/user/work/AuditRepo status --short --branch 
```
**Result:** PASS
```text
## main...origin/main [ahead 1]
?? projects/gb-is-my-strength/PremiumControls/DEEP_REVERIFY_2026-06-27.md
```

### Check 5 — Fetch source remotes
```bash
git -C /home/user/work/gb-is-my-strength fetch --all --prune 
```
**Result:** PASS
```text
From https://github.com/FedorMilovanov/gb-is-my-strength
 * [new branch]        lane/system-premiumcontrols-guard-cleanup-2026-06-27 -> origin/lane/system-premiumcontrols-guard-cleanup-2026-06-27
 * [new branch]        lane/system-premiumcontrols-surgical-2026-06-27 -> origin/lane/system-premiumcontrols-surgical-2026-06-27
   b00ca5b6..46920582  main       -> origin/main
```

### Check 6 — Fetch AuditRepo
```bash
git -C /home/user/work/AuditRepo fetch --all --prune 
```
**Result:** PASS
```text
From https://github.com/FedorMilovanov/AuditRepo
   a629eb1..f7ad805  main       -> origin/main
 * [new branch]      lane/premiumcontrols-current-head-audit-2026-06-27 -> origin/lane/premiumcontrols-current-head-audit-2026-06-27
```

### Check 7 — Source current branch
```bash
git -C /home/user/work/gb-is-my-strength rev-parse --abbrev-ref HEAD 
```
**Result:** PASS
```text
lane/system-premiumcontrols-surgical-2026-06-27
```

### Check 8 — Source HEAD
```bash
git -C /home/user/work/gb-is-my-strength rev-parse --short HEAD 
```
**Result:** PASS
```text
6c9b3d06
```

### Check 9 — origin/main HEAD
```bash
git -C /home/user/work/gb-is-my-strength rev-parse --short origin/main 
```
**Result:** PASS
```text
46920582
```

### Check 10 — remote lane HEAD
```bash
git -C /home/user/work/gb-is-my-strength rev-parse --short origin/lane/system-premiumcontrols-surgical-2026-06-27 
```
**Result:** PASS
```text
6c9b3d06
```

### Check 11 — local equals remote lane
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ test\ \$\(git\ rev-parse\ HEAD\)\ =\ \$\(git\ rev-parse\ origin/lane/system-premiumcontrols-surgical-2026-06-27\)\ \&\&\ echo\ equal 
```
**Result:** PASS
```text
equal
```

### Check 12 — lane parent equals origin/main
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ test\ \$\(git\ rev-parse\ HEAD\^\)\ =\ \$\(git\ rev-parse\ origin/main\)\ \&\&\ echo\ parent-is-current-main 
```
**Result:** FAIL (exit 1)
```text
```

### Check 13 — ahead/behind lane vs main
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ git\ rev-list\ --left-right\ --count\ origin/main...HEAD 
```
**Result:** PASS
```text
1	1
```

### Check 14 — merge-tree no conflict with origin/main
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ \!\ git\ merge-tree\ \$\(git\ merge-base\ origin/main\ HEAD\)\ origin/main\ HEAD\ \|\ grep\ -E\ \'\<\<\<\<\<\<\<\|changed\ in\ both\|CONFLICT\' 
```
**Result:** FAIL (exit 1)
```text
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
changed in both
+<<<<<<< .our
```

### Check 15 — remote URLs sanitized
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ git\ remote\ -v\ \|\ sed\ -E\ \'s#https://\[\^@\]+@#https://\*\*\*@#\' 
```
**Result:** PASS
```text
origin	https://github.com/FedorMilovanov/gb-is-my-strength.git (fetch)
origin	https://github.com/FedorMilovanov/gb-is-my-strength.git (push)
```

### Check 16 — active remote lane list
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ git\ branch\ -r\ \|\ sed\ \'s/\^\ \*//\'\ \|\ grep\ \'\^origin/lane/\'\ \|\ sort 
```
**Result:** PASS
```text
origin/lane/audit-svg-pilot-bugs-2026-06-25
origin/lane/baptisty-content-expansion-2026-06-25
origin/lane/floating-cluster-guards-2026-06-27
origin/lane/gill-mobile-head-fix-2026-06-27
origin/lane/gill-part1-v16-converge-2026-06-27
origin/lane/gill-parts-v16-converge-2026-06-27
origin/lane/karty-avraam-indexable-text-layer-2026-06-26
origin/lane/system-premiumcontrols-guard-cleanup-2026-06-27
origin/lane/system-premiumcontrols-surgical-2026-06-27
origin/lane/system-release-gate-green-2026-06-26
origin/lane/tts-russian-voice-and-pause-2026-06-27
```


## B. Remote branch overlap / collision matrix

### Check 17 — Changed files in PremiumControls lane
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ git\ diff\ --name-only\ origin/main...HEAD\ \|\ sort 
```
**Result:** PASS
```text
articles/20-antisovetov-pastoru/index.html
articles/dzhon-gill-chast-1-chelovek/index.html
articles/dzhon-gill-chast-2-uchenyi/index.html
articles/dzhon-gill-chast-3-nasledie/index.html
articles/dzhon-gill-istoricheskiy-kontekst/index.html
articles/dzhon-gill-spravochnik/index.html
articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html
articles/kod-da-vinchi/index.html
articles/krajne-li-isporcheno-serdce/index.html
articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/index.html
baptisty-rossii/dva-sezda-1884/index.html
baptisty-rossii/goneniya-i-sovest/index.html
baptisty-rossii/iniciativnaya-gruppa/index.html
baptisty-rossii/noch-na-kure/index.html
baptisty-rossii/peterburgskaya-liniya/index.html
baptisty-rossii/podpolnaya-pechat/index.html
baptisty-rossii/sovetskaya-noch/index.html
baptisty-rossii/spravochnik/index.html
baptisty-rossii/vsehib-1944/index.html
baptisty-rossii/yuzhnaya-shtunda/index.html
docs/refactor-2026/lanes/system-premiumcontrols-surgical-2026-06-27.md
js/floating-cluster-controller.js
nagornaya/chast-1/index.html
nagornaya/chast-2/index.html
nagornaya/chast-3/index.html
nagornaya/chast-4/index.html
nagornaya/chast-5/index.html
package.json
scripts/cache-bust.js
scripts/gill-spravochnik-visual-parity-audit.js
scripts/premium-controls-rollout-audit.js
src/components/article-pilots/antisovetov/AntisovetovBody.astro
src/components/article-pilots/gill-context/GillContextPageChrome.astro
src/components/article-pilots/gill-part1/GillPart1PageChrome.astro
src/components/article-pilots/gill-part1/GillPart1PageHead.astro
src/components/article-pilots/gill-part2/GillPart2PageChrome.astro
src/components/article-pilots/gill-part2/GillPart2PageHead.astro
src/components/article-pilots/gill-part3/GillPart3PageChrome.astro
src/components/article-pilots/gill-part3/GillPart3PageHead.astro
src/components/article-pilots/gill-spravochnik/GillSpravochnikPageChrome.astro
src/components/article-pilots/gill-spravochnik/GillSpravochnikPageHead.astro
src/components/article-pilots/hermenevtika/HermenevtikaBody.astro
src/components/article-pilots/kod-da-vinchi/KodDaVinchiPageFooter.astro
src/components/article-pilots/krajne/KrajneBody.astro
src/components/article-pilots/rimlyanam7/Rimlyanam7Body.astro
src/components/baptisty-rossii/BaptistyRossiiBody.astro
src/components/baptisty-rossii/BaptistyRossiiDvaSezda1884Body.astro
src/components/baptisty-rossii/BaptistyRossiiDvaSezda1884PageHead.astro
src/components/baptisty-rossii/BaptistyRossiiGoneniyaISovestBody.astro
src/components/baptisty-rossii/BaptistyRossiiGoneniyaISovestPageHead.astro
src/components/baptisty-rossii/BaptistyRossiiIniciativnayaGruppaBody.astro
src/components/baptisty-rossii/BaptistyRossiiIniciativnayaGruppaPageHead.astro
src/components/baptisty-rossii/BaptistyRossiiNochNaKureBody.astro
src/components/baptisty-rossii/BaptistyRossiiNochNaKurePageHead.astro
src/components/baptisty-rossii/BaptistyRossiiPageHead.astro
src/components/baptisty-rossii/BaptistyRossiiPeterburgskayaLiniyaBody.astro
src/components/baptisty-rossii/BaptistyRossiiPeterburgskayaLiniyaPageHead.astro
src/components/baptisty-rossii/BaptistyRossiiPodpolnayaPechatBody.astro
src/components/baptisty-rossii/BaptistyRossiiPodpolnayaPechatPageHead.astro
src/components/baptisty-rossii/BaptistyRossiiSovetskayaNochBody.astro
src/components/baptisty-rossii/BaptistyRossiiSovetskayaNochPageHead.astro
src/components/baptisty-rossii/BaptistyRossiiSpravochnikBody.astro
src/components/baptisty-rossii/BaptistyRossiiSpravochnikPageHead.astro
src/components/baptisty-rossii/BaptistyRossiiVsehib1944Body.astro
src/components/baptisty-rossii/BaptistyRossiiVsehib1944PageHead.astro
src/components/baptisty-rossii/BaptistyRossiiYuzhnayaShtundaBody.astro
src/components/baptisty-rossii/BaptistyRossiiYuzhnayaShtundaPageHead.astro
src/components/map/MapPageHead.astro
src/components/nagornaya/chast-1/NagornayaChast1PageFooter.astro
src/components/nagornaya/chast-2/NagornayaChast2PageFooter.astro
src/components/nagornaya/chast-3/NagornayaChast3PageFooter.astro
src/components/nagornaya/chast-4/NagornayaChast4PageFooter.astro
src/components/nagornaya/chast-5/NagornayaChast5PageFooter.astro
src/components/rodosloviye/RodosloviyeStyles.astro
src/layouts/BaseLayout.astro
src/lib/asset-version.js
```

### Check 18 — Overlap matrix against active remote lanes
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\;\ mine=\$\(mktemp\)\;\ git\ diff\ --name-only\ origin/main...HEAD\ \|\ sort\ \>\ \$mine\;\ for\ b\ in\ \$\(git\ branch\ -r\ \|\ sed\ \'s/\^\ \*//\'\ \|\ grep\ \'\^origin/lane/\'\ \|\ grep\ -v\ \'origin/lane/system-premiumcontrols-surgical-2026-06-27\'\ \|\ sort\)\;\ do\ other=\$\(mktemp\)\;\ git\ diff\ --name-only\ origin/main...\$b\ 2\>/dev/null\ \|\ sort\ \>\ \$other\ \|\|\ true\;\ c=\$\(comm\ -12\ \$mine\ \$other\ \|\ wc\ -l\ \|\ tr\ -d\ \'\ \'\)\;\ if\ \[\ \$c\ -gt\ 0\ \]\;\ then\ echo\ \"\$b\ overlap_files=\$c\"\;\ comm\ -12\ \$mine\ \$other\ \|\ sed\ \'s/\^/\ \ -\ /\'\ \|\ head\ -20\;\ fi\;\ rm\ -f\ \$other\;\ done\;\ rm\ -f\ \$mine 
```
**Result:** PASS
```text
origin/lane/gill-mobile-head-fix-2026-06-27 overlap_files=40
  - articles/20-antisovetov-pastoru/index.html
  - articles/dzhon-gill-chast-1-chelovek/index.html
  - articles/dzhon-gill-chast-2-uchenyi/index.html
  - articles/dzhon-gill-chast-3-nasledie/index.html
  - articles/dzhon-gill-istoricheskiy-kontekst/index.html
  - articles/dzhon-gill-spravochnik/index.html
  - articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html
  - articles/kod-da-vinchi/index.html
  - articles/krajne-li-isporcheno-serdce/index.html
  - articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/index.html
  - baptisty-rossii/dva-sezda-1884/index.html
  - baptisty-rossii/goneniya-i-sovest/index.html
  - baptisty-rossii/iniciativnaya-gruppa/index.html
  - baptisty-rossii/noch-na-kure/index.html
  - baptisty-rossii/peterburgskaya-liniya/index.html
  - baptisty-rossii/podpolnaya-pechat/index.html
  - baptisty-rossii/sovetskaya-noch/index.html
  - baptisty-rossii/spravochnik/index.html
  - baptisty-rossii/vsehib-1944/index.html
  - baptisty-rossii/yuzhnaya-shtunda/index.html
origin/lane/gill-part1-v16-converge-2026-06-27 overlap_files=41
  - articles/20-antisovetov-pastoru/index.html
  - articles/dzhon-gill-chast-1-chelovek/index.html
  - articles/dzhon-gill-chast-2-uchenyi/index.html
  - articles/dzhon-gill-chast-3-nasledie/index.html
  - articles/dzhon-gill-istoricheskiy-kontekst/index.html
  - articles/dzhon-gill-spravochnik/index.html
  - articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html
  - articles/kod-da-vinchi/index.html
  - articles/krajne-li-isporcheno-serdce/index.html
  - articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/index.html
  - baptisty-rossii/dva-sezda-1884/index.html
  - baptisty-rossii/goneniya-i-sovest/index.html
  - baptisty-rossii/iniciativnaya-gruppa/index.html
  - baptisty-rossii/noch-na-kure/index.html
  - baptisty-rossii/peterburgskaya-liniya/index.html
  - baptisty-rossii/podpolnaya-pechat/index.html
  - baptisty-rossii/sovetskaya-noch/index.html
  - baptisty-rossii/spravochnik/index.html
  - baptisty-rossii/vsehib-1944/index.html
  - baptisty-rossii/yuzhnaya-shtunda/index.html
origin/lane/system-premiumcontrols-guard-cleanup-2026-06-27 overlap_files=25
  - articles/20-antisovetov-pastoru/index.html
  - articles/dzhon-gill-chast-1-chelovek/index.html
  - articles/dzhon-gill-chast-2-uchenyi/index.html
  - articles/dzhon-gill-chast-3-nasledie/index.html
  - articles/dzhon-gill-istoricheskiy-kontekst/index.html
  - articles/dzhon-gill-spravochnik/index.html
  - articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html
  - articles/kod-da-vinchi/index.html
  - baptisty-rossii/dva-sezda-1884/index.html
  - baptisty-rossii/goneniya-i-sovest/index.html
  - baptisty-rossii/iniciativnaya-gruppa/index.html
  - baptisty-rossii/noch-na-kure/index.html
  - baptisty-rossii/peterburgskaya-liniya/index.html
  - baptisty-rossii/podpolnaya-pechat/index.html
  - baptisty-rossii/sovetskaya-noch/index.html
  - baptisty-rossii/spravochnik/index.html
  - baptisty-rossii/vsehib-1944/index.html
  - baptisty-rossii/yuzhnaya-shtunda/index.html
  - nagornaya/chast-1/index.html
  - nagornaya/chast-2/index.html
origin/lane/tts-russian-voice-and-pause-2026-06-27 overlap_files=41
  - articles/20-antisovetov-pastoru/index.html
  - articles/dzhon-gill-chast-1-chelovek/index.html
  - articles/dzhon-gill-chast-2-uchenyi/index.html
  - articles/dzhon-gill-chast-3-nasledie/index.html
  - articles/dzhon-gill-istoricheskiy-kontekst/index.html
  - articles/dzhon-gill-spravochnik/index.html
  - articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html
  - articles/kod-da-vinchi/index.html
  - articles/krajne-li-isporcheno-serdce/index.html
  - articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/index.html
  - baptisty-rossii/dva-sezda-1884/index.html
  - baptisty-rossii/goneniya-i-sovest/index.html
  - baptisty-rossii/iniciativnaya-gruppa/index.html
  - baptisty-rossii/noch-na-kure/index.html
  - baptisty-rossii/peterburgskaya-liniya/index.html
  - baptisty-rossii/podpolnaya-pechat/index.html
```

### Check 19 — Check remote lane direct conflict simulations
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\;\ for\ b\ in\ \$\(git\ branch\ -r\ \|\ sed\ \'s/\^\ \*//\'\ \|\ grep\ \'\^origin/lane/\'\ \|\ grep\ -v\ \'origin/lane/system-premiumcontrols-surgical-2026-06-27\'\ \|\ sort\)\;\ do\ base=\$\(git\ merge-base\ HEAD\ \$b\)\;\ if\ git\ merge-tree\ \$base\ HEAD\ \$b\ \|\ grep\ -q\ \'\<\<\<\<\<\<\<\'\;\ then\ echo\ \"CONFLICT\ \$b\"\;\ else\ echo\ \"clean\ \$b\"\;\ fi\;\ done 
```
**Result:** PASS
```text
clean origin/lane/audit-svg-pilot-bugs-2026-06-25
clean origin/lane/baptisty-content-expansion-2026-06-25
CONFLICT origin/lane/floating-cluster-guards-2026-06-27
CONFLICT origin/lane/gill-mobile-head-fix-2026-06-27
CONFLICT origin/lane/gill-part1-v16-converge-2026-06-27
clean origin/lane/gill-parts-v16-converge-2026-06-27
CONFLICT origin/lane/karty-avraam-indexable-text-layer-2026-06-26
CONFLICT origin/lane/system-premiumcontrols-guard-cleanup-2026-06-27
clean origin/lane/system-release-gate-green-2026-06-26
CONFLICT origin/lane/tts-russian-voice-and-pause-2026-06-27
```

### Check 20 — Find branches touching PremiumControls core files
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\;\ for\ b\ in\ \$\(git\ branch\ -r\ \|\ sed\ \'s/\^\ \*//\'\ \|\ grep\ \'\^origin/lane/\'\ \|\ sort\)\;\ do\ files=\$\(git\ diff\ --name-only\ origin/main...\$b\ 2\>/dev/null\ \|\ grep\ -E\ \'floating-cluster-controller\|floating-cluster.css\|premium-controls\|cache-bust\|premium-controls-rollout\|Gill.\*PageChrome\|Gill.\*PageHead\'\ \|\|\ true\)\;\ \[\ -n\ \"\$files\"\ \]\ \&\&\ \{\ echo\ \"---\ \$b\"\;\ echo\ \"\$files\"\ \|\ sed\ \'s/\^/\ \ /\'\;\ \}\;\ done 
```
**Result:** PASS
```text
--- origin/lane/floating-cluster-guards-2026-06-27
  css/floating-cluster.css
--- origin/lane/gill-mobile-head-fix-2026-06-27
  src/components/article-pilots/gill-context/GillContextPageHead.astro
  src/components/article-pilots/gill-part1/GillPart1PageHead.astro
  src/components/article-pilots/gill-part2/GillPart2PageHead.astro
  src/components/article-pilots/gill-part3/GillPart3PageHead.astro
  src/components/article-pilots/gill-spravochnik/GillSpravochnikPageHead.astro
--- origin/lane/gill-part1-v16-converge-2026-06-27
  css/floating-cluster.css
  src/components/article-pilots/gill-context/GillContextPageHead.astro
  src/components/article-pilots/gill-part1/GillPart1PageChrome.astro
  src/components/article-pilots/gill-part1/GillPart1PageHead.astro
  src/components/article-pilots/gill-part2/GillPart2PageHead.astro
  src/components/article-pilots/gill-part3/GillPart3PageHead.astro
  src/components/article-pilots/gill-spravochnik/GillSpravochnikPageHead.astro
--- origin/lane/system-premiumcontrols-guard-cleanup-2026-06-27
  css/floating-cluster.css
  scripts/premium-controls-rollout-audit.js
  src/components/article-pilots/gill-context/GillContextPageHead.astro
--- origin/lane/system-premiumcontrols-surgical-2026-06-27
  js/floating-cluster-controller.js
  scripts/cache-bust.js
  scripts/premium-controls-rollout-audit.js
  src/components/article-pilots/gill-context/GillContextPageChrome.astro
  src/components/article-pilots/gill-part1/GillPart1PageChrome.astro
  src/components/article-pilots/gill-part1/GillPart1PageHead.astro
  src/components/article-pilots/gill-part2/GillPart2PageChrome.astro
  src/components/article-pilots/gill-part2/GillPart2PageHead.astro
  src/components/article-pilots/gill-part3/GillPart3PageChrome.astro
  src/components/article-pilots/gill-part3/GillPart3PageHead.astro
  src/components/article-pilots/gill-spravochnik/GillSpravochnikPageChrome.astro
  src/components/article-pilots/gill-spravochnik/GillSpravochnikPageHead.astro
--- origin/lane/tts-russian-voice-and-pause-2026-06-27
  js/floating-cluster-controller.js
  src/components/article-pilots/gill-context/GillContextPageChrome.astro
  src/components/article-pilots/gill-part1/GillPart1PageChrome.astro
  src/components/article-pilots/gill-part2/GillPart2PageChrome.astro
  src/components/article-pilots/gill-part3/GillPart3PageChrome.astro
  src/components/article-pilots/gill-spravochnik/GillSpravochnikPageChrome.astro
```

### Check 21 — Latest source commits graph
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ git\ log\ --oneline\ --decorate\ --graph\ --max-count=16\ --all\ --date-order 
```
**Result:** PASS
```text
* faf27cb4 (origin/lane/system-premiumcontrols-guard-cleanup-2026-06-27) [LANE lane/system-premiumcontrols-guard-cleanup-2026-06-27] guard(premiumcontrols): rebase on current main and wire rollout audit
| * 46920582 (origin/main, origin/HEAD) [LANE lane/premiumcontrols-surgical-finish-2026-06-27] fix(premiumcontrols): reapply TTS race and speed pill guards after Gill v16 converge
|/  
| * 6c9b3d06 (HEAD -> lane/system-premiumcontrols-surgical-2026-06-27, origin/lane/system-premiumcontrols-surgical-2026-06-27) [LANE lane/system-premiumcontrols-surgical-2026-06-27] fix(premiumcontrols): replay audit gate on current main
|/  
* b00ca5b6 (origin/lane/gill-parts-v16-converge-2026-06-27) [LANE lane/gill-parts-v16-converge-2026-06-27] feat(gill): converge all parts to v16 chrome + fix part-TOC wipe + GILL-F responsive layer
* 251649fc (main) chore: auto-update meta, cache-bust [skip ci]
* 593d86a5 chore: remove remaining scratch test scripts
* be847937 chore: remove scratch screenshots/test files accidentally committed
*   fdd446b6 merge: PlayEmber premium hover-bloom + Russian TTS voice + working pause (owner-requested clean result)
|\  
| * 53212c14 [LANE lane/playember-hover-premium-2026-06-27] feat(playember): premium hover-bloom speed pill + Russian TTS voice + working pause
|/  
| * 81126da9 (origin/lane/tts-russian-voice-and-pause-2026-06-27) fix(tts): Russian voice + working pause (owner P0 functional bugs)
|/  
| * d040a30a (origin/lane/gill-part1-v16-converge-2026-06-27) [LANE lane/gill-part1-v16-converge-2026-06-27] feat(gill): converge Part I to v16 + add missing v16 mobile responsive layer (GILL-C/D/E/F)
| | * 82147033 (origin/lane/floating-cluster-guards-2026-06-27) docs+guard(floating-cluster): FORBIDDEN_AND_TRUTHS rules + plan pointer + GILL-C safety-net (roman numerals never inherit link-blue)
| |/  
|/|   
| * e620bcdb (origin/lane/gill-mobile-head-fix-2026-06-27) fix(GILL-A/B): repair vertical title + stretched footer on Gill mobile head (P0)
* | 1a288da5 chore: auto-update meta, cache-bust [skip ci]
* | 3e477231 [LANE lane/floating-cluster-finish-2026-06-27] fix(GILL-A): prevent vertical text in gbs2-mobile-head on narrow screens
|/  
* 4c93875e chore: auto-update meta, cache-bust [skip ci]
```


## C. PremiumControls source invariants

### Check 22 — controller syntax
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ node\ --check\ js/floating-cluster-controller.js 
```
**Result:** PASS
```text
```

### Check 23 — cache-bust syntax
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ node\ --check\ scripts/cache-bust.js 
```
**Result:** PASS
```text
```

### Check 24 — premium audit syntax
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ node\ --check\ scripts/premium-controls-rollout-audit.js 
```
**Result:** PASS
```text
```

### Check 25 — Gill spravochnik audit syntax
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ node\ --check\ scripts/gill-spravochnik-visual-parity-audit.js 
```
**Result:** PASS
```text
```

### Check 26 — Package has audit:premium-controls
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ node\ -e\ \"const\ s=require\(\'./package.json\'\).scripts\;\ if\(\!s\[\'audit:premium-controls\'\]\|\|\!s\[\'audit:premium-controls:no-build\'\]\)\ process.exit\(1\)\;\ console.log\(s\[\'audit:premium-controls\'\]\)\;\ console.log\(s\[\'audit:premium-controls:no-build\'\]\)\;\" 
```
**Result:** PASS
```text
node scripts/premium-controls-rollout-audit.js --build
node scripts/premium-controls-rollout-audit.js
```

/tmp/deep_pc_reverify.sh: line 57: ${f}:: command not found
### Check 27 — asset-version helper current for PremiumControls
```bash
bash -lc $'cd \'/home/user/work/gb-is-my-strength\' && PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':$PATH node - <<\'NODE\'\nconst fs=require(\'fs\'), crypto=require(\'crypto\');\nconst h=f=>crypto.createHash(\'md5\').update(fs.readFileSync(f)).digest(\'hex\').slice(0,8);\nconst helper=fs.readFileSync(\'src/lib/asset-version.js\',\'utf8\');\nfor (const f of [\'css/floating-cluster.css\',\'js/floating-cluster-controller.js\',\'css/premium-controls.css\']) {\n const hash=h(f); console.log(f, hash); if(!helper.includes()) process.exit(1);\n}\nNODE' 
```
**Result:** FAIL (exit 1)
```text
css/floating-cluster.css 16382d7e
```

### Check 28 — No unversioned PremiumControls refs in source
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ \!\ grep\ -RInE\ \'\(href\|src\)=\"\(\\.\\./\)\*css/floating-cluster\\.css\"\|\(href\|src\)=\"\(\\.\\./\)\*js/floating-cluster-controller\\.js\"\'\ src\ articles\ baptisty-rossii\ nagornaya\ 2\>/dev/null 
```
**Result:** PASS
```text
```

### Check 29 — All source PremiumControls refs have one current hash each
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ grep\ -RohE\ \'floating-cluster-controller\\.js\\\?v=\[a-f0-9\]\{8\}\|floating-cluster\\.css\\\?v=\[a-f0-9\]\{8\}\'\ src\ articles\ baptisty-rossii\ nagornaya\ \|\ sort\ \|\ uniq\ -c 
```
**Result:** PASS
```text
     51 floating-cluster-controller.js?v=131740c5
     42 floating-cluster.css?v=16382d7e
```

### Check 30 — No old unsupported TTS toast
```bash
bash -lc $'cd \'/home/user/work/gb-is-my-strength\' && ! grep -RIn \'\320\236\320\267\320\262\321\203\321\207\320\272\320\260 \320\265\321\211\321\221 \320\275\320\265 \320\277\320\276\320\264\320\272\320\273\321\216\321\207\320\265\320\275\320\260\' js src articles baptisty-rossii nagornaya' 
```
**Result:** PASS
```text
```

### Check 31 — Speed panel radiogroup present in controller
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ grep\ -n\ \"role\'\,\ \'radiogroup\'\\\|aria-checked\"\ js/floating-cluster-controller.js 
```
**Result:** PASS
```text
758:      panel.setAttribute('role', 'radiogroup');
762:        return '<button class="gb-ember-expand__btn' + active + '" type="button" role="radio" data-speed="' + s + '" aria-label="Скорость ' + s + '\u00d7" aria-checked="' + (s === currentRate ? 'true' : 'false') + '" aria-pressed="' + (s === currentRate ? 'true' : 'false') + '">' + s + '\u00d7</button>';
834:            b.setAttribute('aria-checked', isThis ? 'true' : 'false');
```

### Check 32 — No unused current var in syncSaveState
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ \!\ grep\ -n\ \'var\ current\ =\ engine.getCurrent\'\ js/floating-cluster-controller.js 
```
**Result:** PASS
```text
```

### Check 33 — Gill rail H2 parity source
```bash
bash -lc $'cd \'/home/user/work/gb-is-my-strength\' && for f in src/components/article-pilots/gill-part1/GillPart1PageChrome.astro src/components/article-pilots/gill-part2/GillPart2PageChrome.astro src/components/article-pilots/gill-part3/GillPart3PageChrome.astro src/components/article-pilots/gill-spravochnik/GillSpravochnikPageChrome.astro; do grep -q \'<h2>\320\224\320\266\320\276\320\275 \320\223\320\270\320\273\320\273 (1697\342\200\2231771)</h2>\' $f || exit 1; echo ok $f; done' 
```
**Result:** PASS
```text
ok src/components/article-pilots/gill-part1/GillPart1PageChrome.astro
ok src/components/article-pilots/gill-part2/GillPart2PageChrome.astro
ok src/components/article-pilots/gill-part3/GillPart3PageChrome.astro
ok src/components/article-pilots/gill-spravochnik/GillSpravochnikPageChrome.astro
```

### Check 34 — Gill spravochnik audit expects v16 markers
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ grep\ -n\ \'mobile-bottom-bar\\\|toc-overlay\\\|word-count\ within\ tolerance\'\ scripts/gill-spravochnik-visual-parity-audit.js 
```
**Result:** PASS
```text
147:  mustContain('page chrome has v16 mobile bottom bar', pageChrome, 'mobile-bottom-bar');
148:  mustContain('page chrome has v16 toc popup', pageChrome, 'toc-overlay');
163:  var drift = Math.abs(lw - rw); drift <= 200 ? ok(`word-count within tolerance: legacy=${lw}, reconstructed=${rw}, drift=${drift}`) : bad(`word-count drift: legacy=${lw}, reconstructed=${rw}`);
```

### Check 35 — cache-bust dry-run idempotent
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ npm\ run\ cache-bust\ --\ --dry-run\ \|\ tail\ -20 
```
**Result:** PASS
```text
  ✔  nagornaya/tw.min.css            →  ?v=2670414e
  ✔  js/site.js                      →  ?v=158b6e05
  ✔  js/site-utils.js                →  ?v=897afa55
  ✔  js/scroll-perf.js               →  ?v=454d6f7b
  ✔  js/bookmark-engine.js           →  ?v=c5e0bf10
  ✔  js/enhancements.js              →  ?v=b3b77aa6
  ✔  js/highlights.js                →  ?v=a1706b06
  ✔  js/search.js                    →  ?v=c9d65577
  ✔  js/sw-register.js               →  ?v=318502c5
  ✔  js/nagornaya-mobile-toc.js      →  ?v=866d4238
  ✔  js/glossary.js                  →  ?v=2100cf4f
  ✔  js/floating-cluster-controller.js  →  ?v=131740c5

  HTML-файлов в проекте: 56

  Astro-компонентов в src/: 395

──────────────────────────────────────────────────
✅  Хеши не изменились — HTML/Astro не тронуты.

```

### Check 36 — git diff check source
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ git\ diff\ --check\ HEAD\^..HEAD 
```
**Result:** PASS
```text
```


## D. Fast and full project gates

### Check 37 — validate:all
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ npm\ run\ validate:all 
```
**Result:** PASS
```text

> gb-is-my-strength@1.6.3 validate:all
> npm run validate:strict && npm run seo-audit


> gb-is-my-strength@1.6.3 validate:strict
> node scripts/validate.js --strict


🔍  validate.js

  📁  css/
  ⚠️  [css/floating-cluster.css] нестандартный брейкпоинт: 960px
  ⚠️  [css/floating-cluster.css] нестандартный брейкпоинт: 500px
  ⚠️  [css/floating-cluster.css] нестандартный брейкпоинт: 420px
  📁  js/
  📁  inline-scripts/
  📁  html-contracts/
  ✔  [html-contracts] Russian quote policy passed: no English direct quotes in reader-facing Russian text

  📄  20-antisovetov-pastoru
  ⚠️  [20-antisovetov-pastoru] <title> ≠ og:title\n           <title>: "20 антисоветов пастору: как разрушить служение"\n         og:title: "20 антисоветов, как пастору разрушить своё служение"

  📄  dzhon-gill-chast-1-chelovek

  📄  dzhon-gill-chast-2-uchenyi

  📄  dzhon-gill-chast-3-nasledie

  📄  dzhon-gill-istoricheskiy-kontekst

  📄  dzhon-gill-spravochnik

  📄  hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki

  📄  kod-da-vinchi

  📄  krajne-li-isporcheno-serdce

  📄  rimlyanam-7-veruyushchiy-ili-neveruyushchiy
  ⚠️  [rimlyanam-7-veruyushchiy-ili-neveruyushchiy] <title> ≠ og:title\n           <title>: "Римлянам 7: верующий или неверующий?"\n         og:title: "Римлянам 7: верующий, неверующий или человек под законом?"

  🗺  sitemap.xml + feed.xml

──────────────────────────────────────────────────
⚠️  Ошибок: 0  Предупреждений: 5
  → Предупреждения не прерывают workflow. Исправьте при возможности.


> gb-is-my-strength@1.6.3 seo-audit
> node scripts/seo-audit.js


SEO audit passed: 0 errors, 0 warnings.
```

### Check 38 — audit-pro
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ node\ scripts/audit-pro.js 
```
**Result:** PASS
```text

══════════════════════════════════════════════════════════════════════════════
GB-IS-MY-STRENGTH — PROFESSIONAL AUDIT
2026-06-27T07:33:19.881Z · 3.44s
══════════════════════════════════════════════════════════════════════════════

Summary: ✅ 161 passed · ⚠️ 4 warnings · ❌ 0 errors · ℹ️ 10 info

── PASSED ──
✅ Structure: exactly 7 CSS files in /css
✅ Structure: exactly 11 JS files in /js
✅ Structure: fonts/fonts.css and nagornaya/tw.min.css exist
✅ JS total 357352 bytes within budget
✅ site.css size 282788 bytes ≥ floor 200000 (anti-deletion guard)
✅ site.css !important within ratchet ceiling: 202 ≤ 202 (long-term goal 200)
✅ css/site.css: braces balanced
✅ css/home.css: braces balanced
✅ css/command-palette.css: braces balanced
✅ css/mobile-hotfix.css: braces balanced
✅ css/site-layered.css: braces balanced
✅ css/floating-cluster.css: braces balanced
✅ css/nagornaya-mobile-toc.css: braces balanced
✅ Dove markers: no dead inline fn-dove-icon SVG in HTML
✅ Dove markers: every fn-marker--dove has tooltip or data-tip content
✅ JS syntax valid (14 files)
✅ Inline script syntax valid (114 blocks)
✅ Quiz source schema is canonical across HTML pages
✅ OpenGraph / article singleton meta uniqueness passed
✅ SITE_CONFIG runtime contract passed across HTML pages
✅ JSON valid (86 files)
✅ HTML span balance: all files balanced
✅ Cache-bust hashes match file content (597 references checked)
✅ SEO basics passed (52 HTML files)
✅ JSON-LD parse passed (63 blocks)
✅ Russian quote policy passed: no English direct quotes in reader-facing Russian text
✅ Attribution guard passed: Фёдор is not marked as author
✅ No duplicate IDs
✅ All images have alt attributes
✅ manifest.json essentials valid
✅ SW CACHE_VERSION
✅ SW install event
✅ SW activate event
✅ SW fetch event
✅ SW skipWaiting
✅ SW clients.claim
✅ SW cache cleanup
✅ SW precache references existing repo files (31 URLs, pagefind skipped)
✅ search-manifest URLs valid (44 items)
✅ Nagornaya series structure checked
✅ CNAME is gospod-bog.ru
✅ robots.txt present
✅ sitemap.xml covers HTML pages (43 loc entries)
✅ feed.xml present
✅ Security hygiene passed (no repo path leaks / eval)
✅ deploy.yml present
✅ notify-on-failure.yml present — failures will open/update GitHub issue
✅ No garbage files (*.py / *.patch / *.bak / *.orig / *.rej / uploads/ / OS turds) anywhere in repo
✅ Image size hygiene: no PNG/JPG > 684 KB in /images/ (allowlist: 0)
✅ Series consistency: 5 series in series.json, all published parts exist on disk
✅ Series landing pages: no cross-series contamination
✅ /articles/ catalog: 7 cards, no duplicates
✅ Unified header: all pages with h-nav-links contain the canonical 5-item set
✅ Nav semantics: no <button> inside <ul class="h-nav-links">
✅ /hard-texts/ landing: all 3 article links are members of the series
✅ Hashed asset URLs: every ?v=… reference resolves to an existing file
✅ .gitignore covers npm/node_modules/OS turds
✅ article-topnav stays buried (AGENTS §9.8)
✅ Dead classes stay dead (5 guarded)
✅ No AI-disclosure spans inside <figcaption>
✅ OG/Twitter meta: no duplicates across pages (checked: og:image, og:title, og:url, og:description, twitter:image, og:type)
✅ All <source srcset> tags wrapped in <picture>
✅ Listener syntax: no broken function(, {…}) patterns
✅ Inline scripts: none larger than 500 LOC except known/guarded map app debt
✅ @keyframes integrity: all blocks have valid stops
✅ sw.js CACHE_VERSION="gb-v176-floating-cluster-gill-all-20260625" looks sane
✅ sitemap.xml: all 43 lastmod dates ≤ today
✅ Single <h1> per page: all content pages have exactly one
✅ Mixed-content: no http:// href/src (web.archive.org & w3.org whitelisted)
✅ target="_blank" links: all carry rel="noopener"
✅ Anchor href values: no href="javascript:…" and no truly-bare href="#"
```

### Check 39 — data:consistency
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ npm\ run\ data:consistency 
```
**Result:** PASS
```text

> gb-is-my-strength@1.6.3 data:consistency
> node scripts/check-data-consistency.js


GB DATA CONSISTENCY AUDIT
✅ Data consistency passed
```

### Check 40 — migration:metadata:check
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ npm\ run\ migration:metadata:check 
```
**Result:** PASS
```text

> gb-is-my-strength@1.6.3 migration:metadata:check
> npm run route:profiles:check && npm run migration:matrix:check && npm run content:sources:check


> gb-is-my-strength@1.6.3 route:profiles:check
> node scripts/check-route-profiles.js

=== Route Profiles Check ===
Mode: WARN

Routes checked: 52
Profiles found: 52

✅ Route profiles coherent with page ownership

> gb-is-my-strength@1.6.3 migration:matrix:check
> node scripts/check-route-migration-matrix.js

=== Route Migration Matrix Check ===
Mode: WARN

Routes checked against matrix: 34
Matrix entries: 34

⚠️  Warnings:
  ⚠️  /izbrannoe/: no entry in route-migration-matrix.json (add it before migration)

✅ Route migration modes are coherent with matrix

> gb-is-my-strength@1.6.3 content:sources:check
> node scripts/check-content-source-coverage.js

=== Content Source Coverage Check ===
Mode: WARN

Series parts checked: 23
Routes checked: 52
MDX files: 20
Profiles: 54
Search items: 44

⚠️  Warnings:
  ⚠️  route /izbrannoe/: production-dist route without search-manifest entry

✅ Content source coverage check completed (non-strict mode)
```

### Check 41 — native:runtime:audit:strict
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ npm\ run\ native:runtime:audit:strict 
```
**Result:** PASS
```text

> gb-is-my-strength@1.6.3 native:runtime:audit:strict
> node scripts/native-runtime-taxonomy-audit.js --strict

=== Native Runtime Taxonomy Audit ===
Mode: STRICT
Routes: 53

| Category | Count | % | Meaning |
|---|---:|---:|---|
| strict-native | 51 | 96.2% | no legacy loader/raw/set:html transport in route closure |
| native-with-legacy-head | 1 | 1.9% | native body/chrome, but legacy head/body attrs remain |
| native-main-with-legacy-chrome | 0 | 0.0% | native semantic main with legacy chrome/head transport |
| hybrid-raw-segments | 0 | 0.0% | ?raw/_legacy/body-segment transport remains in route closure |
| full-body-shadow | 0 | 0.0% | legacy bodyHtml emitted into Astro route |
| legacy-shadow-app-intentional | 1 | 1.9% | interactive/map/built app intentionally shadowed |

Examples (use --details for full route list):
- strict-native: /, /about/, /articles/, /articles/20-antisovetov-pastoru/, /articles/dzhon-gill-chast-1-chelovek/, /articles/dzhon-gill-chast-2-uchenyi/, /articles/dzhon-gill-chast-3-nasledie/, /articles/dzhon-gill-istoricheskiy-kontekst/, /articles/dzhon-gill-spravochnik/, /articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/, /articles/kod-da-vinchi/, /articles/krajne-li-isporcheno-serdce/ … +39
- native-with-legacy-head: /izbrannoe/
- native-main-with-legacy-chrome: —
- hybrid-raw-segments: —
- full-body-shadow: —
- legacy-shadow-app-intentional: /konfessii/russkij-baptizm/_app/

✅ native runtime taxonomy completed
```

### Check 42 — gill:spravochnik visual audit
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ npm\ run\ gill:spravochnik:visual-parity:audit 
```
**Result:** PASS
```text

> gb-is-my-strength@1.6.3 gill:spravochnik:visual-parity:audit
> node scripts/gill-spravochnik-visual-parity-audit.js

GILL SPRAVOCHNIK STRICT-NATIVE AUDIT
✅ legacy route: articles/dzhon-gill-spravochnik/index.html
✅ Astro route: src/pages/articles/dzhon-gill-spravochnik/index.astro
✅ pageHead: src/components/article-pilots/gill-spravochnik/GillSpravochnikPageHead.astro
✅ pageChrome: src/components/article-pilots/gill-spravochnik/GillSpravochnikPageChrome.astro
✅ shell: src/components/article-pilots/gill-spravochnik/GillSpravochnikMainShell.astro
✅ header: src/components/article-pilots/gill-spravochnik/GillSpravochnikHeaderHero.astro
✅ body: src/components/article-pilots/gill-spravochnik/GillSpravochnikArticleBody.astro
✅ post: src/components/article-pilots/gill-spravochnik/GillSpravochnikPostArticle.astro
✅ legacy spravochnik directory retired: src/components/article-pilots/gill-spravochnik/_legacy absent
✅ section component GillSpravochnikSectionSummary.astro: src/components/article-pilots/gill-spravochnik/GillSpravochnikSectionSummary.astro
✅ section component GillSpravochnikSectionPrdl.astro: src/components/article-pilots/gill-spravochnik/GillSpravochnikSectionPrdl.astro
✅ section component GillSpravochnikSectionTimeline.astro: src/components/article-pilots/gill-spravochnik/GillSpravochnikSectionTimeline.astro
✅ section component GillSpravochnikSectionWorks.astro: src/components/article-pilots/gill-spravochnik/GillSpravochnikSectionWorks.astro
✅ section component GillSpravochnikSectionBodyStructure.astro: src/components/article-pilots/gill-spravochnik/GillSpravochnikSectionBodyStructure.astro
✅ section component GillSpravochnikSectionNetwork.astro: src/components/article-pilots/gill-spravochnik/GillSpravochnikSectionNetwork.astro
✅ section component GillSpravochnikSectionDisputes.astro: src/components/article-pilots/gill-spravochnik/GillSpravochnikSectionDisputes.astro
✅ section component GillSpravochnikSectionTerms.astro: src/components/article-pilots/gill-spravochnik/GillSpravochnikSectionTerms.astro
✅ section component GillSpravochnikSectionLinks.astro: src/components/article-pilots/gill-spravochnik/GillSpravochnikSectionLinks.astro
✅ section component GillSpravochnikSectionSources.astro: src/components/article-pilots/gill-spravochnik/GillSpravochnikSectionSources.astro
✅ section component GillSpravochnikSectionQuizTail.astro: src/components/article-pilots/gill-spravochnik/GillSpravochnikSectionQuizTail.astro
✅ strict-native source scope: no loadLegacyFullDocument
✅ strict-native source scope: no headHtml
✅ strict-native source scope: no bodyHtml
✅ strict-native source scope: no bodyAttributes
✅ strict-native source scope: no ?raw
✅ strict-native source scope: no set:html
✅ strict-native source scope: no _legacy
✅ route imports native page head: contains GillSpravochnikPageHead
✅ route imports native page chrome: contains GillSpravochnikPageChrome
✅ route imports native main shell: contains GillSpravochnikMainShell
✅ route sets explicit body class: contains class="gbs-world"
✅ route sets explicit done minutes: contains data-gbs2-done-min="141"
✅ route sets explicit part minutes: contains data-gbs2-part-min="8"
✅ page head has canonical: contains rel="canonical"
✅ page head has SITE_CONFIG: contains window.SITE_CONFIG
✅ page head has JSON-LD: contains application/ld+json
✅ page head has Yandex: contains mc.yandex.ru
✅ page chrome exposes slot: contains <slot />
✅ page chrome has v16 mobile bottom bar: contains mobile-bottom-bar
✅ page chrome has v16 toc popup: contains toc-overlay
✅ page chrome keeps bookmark runtime: contains bookmark-engine.js
✅ page chrome keeps site runtime: contains site.js
✅ main shell renders main-content: contains <main id="main-content">
✅ main shell uses header: contains GillSpravochnikHeaderHero
✅ main shell uses article body: contains GillSpravochnikArticleBody
✅ main shell uses post article: contains GillSpravochnikPostArticle
✅ body component owns article wrapper: contains <article class="article-body" data-pagefind-body>
✅ body imports GillSpravochnikSectionSummary.astro: contains GillSpravochnikSectionSummary
✅ body imports GillSpravochnikSectionPrdl.astro: contains GillSpravochnikSectionPrdl
✅ body imports GillSpravochnikSectionTimeline.astro: contains GillSpravochnikSectionTimeline
✅ body imports GillSpravochnikSectionWorks.astro: contains GillSpravochnikSectionWorks
✅ body imports GillSpravochnikSectionBodyStructure.astro: contains GillSpravochnikSectionBodyStructure
✅ body imports GillSpravochnikSectionNetwork.astro: contains GillSpravochnikSectionNetwork
✅ body imports GillSpravochnikSectionDisputes.astro: contains GillSpravochnikSectionDisputes
✅ body imports GillSpravochnikSectionTerms.astro: contains GillSpravochnikSectionTerms
✅ body imports GillSpravochnikSectionLinks.astro: contains GillSpravochnikSectionLinks
✅ body imports GillSpravochnikSectionSources.astro: contains GillSpravochnikSectionSources
✅ body imports GillSpravochnikSectionQuizTail.astro: contains GillSpravochnikSectionQuizTail
✅ reconstructed body marker: contains class="gbs2-hero"
✅ reconstructed body marker: contains Джон Гилл: справочник
✅ reconstructed body marker: contains summary-card
✅ reconstructed body marker: contains id="sec-prdl"
✅ reconstructed body marker: contains id="sec-timeline"
✅ reconstructed body marker: contains id="sec-works"
✅ reconstructed body marker: contains id="sec-body-structure"
✅ reconstructed body marker: contains id="sec-network"
✅ reconstructed body marker: contains id="sec-disputes"
✅ reconstructed body marker: contains id="sec-terms"
✅ reconstructed body marker: contains id="sec-links"
✅ reconstructed body marker: contains id="sec-quiz"
✅ reconstructed body marker: contains gbs2-next
✅ reconstructed body marker: contains gbs2-timeline
✅ reconstructed body marker: contains article-end-sdg-wrap
⚠ reconstructed body differs from legacy body after normalization (non-blocking — word-count and markers match)
✅ word-count within tolerance: legacy=1938, reconstructed=1896, drift=42
```

### Check 43 — article mdx strict audit
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ npm\ run\ astro:audit:article-mdx:strict 
```
**Result:** PASS
```text

> gb-is-my-strength@1.6.3 astro:audit:article-mdx:strict
> node scripts/article-mdx-pilot-audit.js --require-content-parity

ARTICLE MDX PUBLIC SHADOW AUDIT (build, content parity required)
✅ kod-da-vinchi ArticleBody no longer imports monolithic article-body.html
✅ kod-da-vinchi all sections promoted — section glob retired (no raw fragments remain)
✅ kod-da-vinchi ArticleBody imports Astro Pagefind meta component: contains "KodDaVinchiPagefindMeta"
✅ kod-da-vinchi ArticleBody imports KodDaVinchiSectionCanon: contains "KodDaVinchiSectionCanon"
✅ kod-da-vinchi ArticleBody imports KodDaVinchiSectionChurch: contains "KodDaVinchiSectionChurch"
✅ kod-da-vinchi ArticleBody imports KodDaVinchiSectionConclusion: contains "KodDaVinchiSectionConclusion"
✅ kod-da-vinchi ArticleBody imports KodDaVinchiSectionDates: contains "KodDaVinchiSectionDates"
✅ kod-da-vinchi ArticleBody imports KodDaVinchiSectionErrors: contains "KodDaVinchiSectionErrors"
✅ kod-da-vinchi ArticleBody imports KodDaVinchiSectionFaq: contains "KodDaVinchiSectionFaq"
✅ kod-da-vinchi ArticleBody imports KodDaVinchiSectionFeminine: contains "KodDaVinchiSectionFeminine"
✅ kod-da-vinchi ArticleBody imports KodDaVinchiSectionGnostic: contains "KodDaVinchiSectionGnostic"
✅ kod-da-vinchi ArticleBody imports KodDaVinchiSectionIntro: contains "KodDaVinchiSectionIntro"
✅ kod-da-vinchi ArticleBody imports KodDaVinchiSectionLie1: contains "KodDaVinchiSectionLie1"
✅ kod-da-vinchi ArticleBody imports KodDaVinchiSectionLie2: contains "KodDaVinchiSectionLie2"
✅ kod-da-vinchi ArticleBody imports KodDaVinchiSectionLie3: contains "KodDaVinchiSectionLie3"
✅ kod-da-vinchi ArticleBody imports KodDaVinchiSectionLie4: contains "KodDaVinchiSectionLie4"
✅ kod-da-vinchi ArticleBody imports KodDaVinchiSectionLie5: contains "KodDaVinchiSectionLie5"
✅ kod-da-vinchi ArticleBody imports KodDaVinchiSectionLie6: contains "KodDaVinchiSectionLie6"
✅ kod-da-vinchi ArticleBody imports KodDaVinchiSectionPhenomenon: contains "KodDaVinchiSectionPhenomenon"
✅ kod-da-vinchi ArticleBody imports KodDaVinchiSectionQuiz: contains "KodDaVinchiSectionQuiz"
✅ kod-da-vinchi ArticleBody imports KodDaVinchiSectionQumran: contains "KodDaVinchiSectionQumran"
✅ kod-da-vinchi ArticleBody imports KodDaVinchiSectionSummaryTitleAuto: contains "KodDaVinchiSectionSummaryTitleAuto"
✅ kod-da-vinchi ArticleBody imports KodDaVinchiSectionWhy: contains "KodDaVinchiSectionWhy"
✅ kod-da-vinchi ArticleBody preserves article-body wrapper: contains "<article class="article-body" data-pagefind-body>"
✅ kod-da-vinchi monolithic article-body.html removed after section breakout
✅ kod-da-vinchi ALL 20 sections promoted to Astro (no raw fragments remain)
✅ kod-da-vinchi Canon component h2 anchor: contains "id="sec-canon""
✅ kod-da-vinchi Church component h2 anchor: contains "id="sec-church""
✅ kod-da-vinchi Conclusion component h2 anchor: contains "id="sec-conclusion""
✅ kod-da-vinchi Dates component h2 anchor: contains "id="sec-dates""
✅ kod-da-vinchi Errors component h2 anchor: contains "id="sec-errors""
✅ kod-da-vinchi Faq component h2 anchor: contains "id="sec-faq""
✅ kod-da-vinchi Feminine component h2 anchor: contains "id="sec-feminine""
✅ kod-da-vinchi Gnostic component h2 anchor: contains "id="sec-gnostic""
✅ kod-da-vinchi Intro component h2 anchor: contains "id="sec-intro""
✅ kod-da-vinchi Lie1 component h2 anchor: contains "id="sec-lie1""
✅ kod-da-vinchi Lie2 component h2 anchor: contains "id="sec-lie2""
✅ kod-da-vinchi Lie3 component h2 anchor: contains "id="sec-lie3""
✅ kod-da-vinchi Lie4 component h2 anchor: contains "id="sec-lie4""
✅ kod-da-vinchi Lie5 component h2 anchor: contains "id="sec-lie5""
✅ kod-da-vinchi Lie6 component h2 anchor: contains "id="sec-lie6""
✅ kod-da-vinchi Phenomenon component h2 anchor: contains "id="sec-phenomenon""
✅ kod-da-vinchi Quiz component h2 anchor: contains "id="sec-quiz""
✅ kod-da-vinchi Qumran component h2 anchor: contains "id="sec-qumran""
✅ kod-da-vinchi Why component h2 anchor: contains "id="sec-why""
✅ kod-da-vinchi Pagefind meta component data-pagefind-meta="image": contains "data-pagefind-meta="image""
✅ kod-da-vinchi Pagefind meta component data-pagefind-meta="author": contains "data-pagefind-meta="author""
✅ kod-da-vinchi Pagefind meta component data-pagefind-meta="readTime": contains "data-pagefind-meta="readTime""
✅ kod-da-vinchi Pagefind meta component data-pagefind-meta="category": contains "data-pagefind-meta="category""
✅ kod-da-vinchi index.astro no longer imports raw body-segment-0.html
✅ kod-da-vinchi index.astro no longer imports raw body-segment-1.html
✅ kod-da-vinchi index.astro imports PageHead component: contains "KodDaVinchiPageHead"
✅ kod-da-vinchi index.astro imports PageChrome component: contains "KodDaVinchiPageChrome"
✅ kod-da-vinchi index.astro imports PageFooter component: contains "KodDaVinchiPageFooter"
✅ kod-da-vinchi index.astro no legacy document loader: does not contain "loadLegacyFullDocument"
✅ kod-da-vinchi index.astro no headHtml transport: does not contain "headHtml"
✅ kod-da-vinchi index.astro no bodyAttributes transport: does not contain "bodyAttributes"
▶ Building strangler dist for MDX article shadow audit…

> gb-is-my-strength@1.6.3 strangler:build
> npm run astro:build && node scripts/copy-legacy-to-dist.js && node scripts/astro-cache-bust-postbuild.js


> gb-is-my-strength@1.6.3 astro:build
> npm run dist:clean && ASTRO_TELEMETRY_DISABLED=1 astro check && ASTRO_TELEMETRY_DISABLED=1 astro build


> gb-is-my-strength@1.6.3 dist:clean
> node -e "require('fs').rmSync('dist',{recursive:true,force:true})"

07:33:23 [content] Syncing content
07:33:24 [content] Synced content
07:33:24 [types] Generated 695ms
07:33:24 [check] Getting diagnostics for Astro files in /home/user/work/gb-is-my-strength...
[96msrc/components/home/HomePageChrome.astro[0m:[93m148[0m:[93m9[0m - [93mwarning[0m[90m astro(4000): [0mThis script will be treated as if it has the `is:inline` directive because it contains an attribute. Therefore, features that require processing (e.g. using TypeScript or npm packages in the script) are unavailable.
```

### Check 44 — premium controls audit no-build
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ npm\ run\ audit:premium-controls:no-build 
```
**Result:** PASS
```text

> gb-is-my-strength@1.6.3 audit:premium-controls:no-build
> node scripts/premium-controls-rollout-audit.js

✅ /articles/20-antisovetov-pastoru/ controls scoped + controller loaded
✅ /articles/dzhon-gill-chast-1-chelovek/ controls scoped + controller loaded
✅ /articles/dzhon-gill-chast-2-uchenyi/ controls scoped + controller loaded
✅ /articles/dzhon-gill-chast-3-nasledie/ controls scoped + controller loaded
✅ /articles/dzhon-gill-istoricheskiy-kontekst/ controls scoped + controller loaded
✅ /articles/dzhon-gill-spravochnik/ controls scoped + controller loaded
✅ /articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/ controls scoped + controller loaded
✅ /articles/kod-da-vinchi/ controls scoped + controller loaded
✅ /articles/krajne-li-isporcheno-serdce/ controls scoped + controller loaded
✅ /articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/ controls scoped + controller loaded
✅ /baptisty-rossii/dva-sezda-1884/ controls scoped + controller loaded
✅ /baptisty-rossii/goneniya-i-sovest/ controls scoped + controller loaded
✅ /baptisty-rossii/ controls scoped + controller loaded
✅ /baptisty-rossii/iniciativnaya-gruppa/ controls scoped + controller loaded
✅ /baptisty-rossii/noch-na-kure/ controls scoped + controller loaded
✅ /baptisty-rossii/peterburgskaya-liniya/ controls scoped + controller loaded
✅ /baptisty-rossii/podpolnaya-pechat/ controls scoped + controller loaded
✅ /baptisty-rossii/sovetskaya-noch/ controls scoped + controller loaded
✅ /baptisty-rossii/spravochnik/ controls scoped + controller loaded
✅ /baptisty-rossii/vsehib-1944/ controls scoped + controller loaded
✅ /baptisty-rossii/yuzhnaya-shtunda/ controls scoped + controller loaded
✅ /nagornaya/chast-1/ controls scoped + controller loaded
✅ /nagornaya/chast-2/ controls scoped + controller loaded
✅ /nagornaya/chast-3/ controls scoped + controller loaded
✅ /nagornaya/chast-4/ controls scoped + controller loaded
✅ /nagornaya/chast-5/ controls scoped + controller loaded
✅ scanned 54 dist pages; 26 carry PremiumControls
✅ no double floating-cluster CSS delivery (PC-004 invariant holds)
✅ css/floating-cluster.css cache-busted with current ?v=16382d7e
✅ js/floating-cluster-controller.js cache-busted with current ?v=131740c5
✅ src/lib/asset-version.js PremiumControls hashes current

PremiumControls rollout audit: 31/31 passed

✅ PremiumControls rollout contract OK.
```

### Check 45 — premium controls audit with build
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ npm\ run\ audit:premium-controls 
```
**Result:** PASS
```text

> gb-is-my-strength@1.6.3 audit:premium-controls
> node scripts/premium-controls-rollout-audit.js --build

Building production-like dist…

> gb-is-my-strength@1.6.3 strangler:build:production-like
> npm run astro:build && node scripts/copy-legacy-to-dist.js --omit-build-only && node scripts/astro-cache-bust-postbuild.js


> gb-is-my-strength@1.6.3 astro:build
> npm run dist:clean && ASTRO_TELEMETRY_DISABLED=1 astro check && ASTRO_TELEMETRY_DISABLED=1 astro build


> gb-is-my-strength@1.6.3 dist:clean
> node -e "require('fs').rmSync('dist',{recursive:true,force:true})"

07:35:42 [content] Syncing content
07:35:42 [content] Synced content
07:35:42 [types] Generated 633ms
07:35:42 [check] Getting diagnostics for Astro files in /home/user/work/gb-is-my-strength...
[96msrc/components/home/HomePageChrome.astro[0m:[93m148[0m:[93m9[0m - [93mwarning[0m[90m astro(4000): [0mThis script will be treated as if it has the `is:inline` directive because it contains an attribute. Therefore, features that require processing (e.g. using TypeScript or npm packages in the script) are unavailable.

See docs for more details: https://docs.astro.build/en/guides/client-side-scripts/#script-processing.

Add the `is:inline` directive explicitly to silence this hint.

[7m148[0m <script src="./js/search.js?v=c9d65577" defer></script>
[7m   [0m [93m        ~~~[0m
[96msrc/components/home/HomePageChrome.astro[0m:[93m147[0m:[93m9[0m - [93mwarning[0m[90m astro(4000): [0mThis script will be treated as if it has the `is:inline` directive because it contains an attribute. Therefore, features that require processing (e.g. using TypeScript or npm packages in the script) are unavailable.

See docs for more details: https://docs.astro.build/en/guides/client-side-scripts/#script-processing.

Add the `is:inline` directive explicitly to silence this hint.

[7m147[0m <script src="./js/sw-register.js?v=318502c5" defer></script>
[7m   [0m [93m        ~~~[0m
[96msrc/components/home/HomePageChrome.astro[0m:[93m134[0m:[93m9[0m - [93mwarning[0m[90m astro(4000): [0mThis script will be treated as if it has the `is:inline` directive because it contains an attribute. Therefore, features that require processing (e.g. using TypeScript or npm packages in the script) are unavailable.

See docs for more details: https://docs.astro.build/en/guides/client-side-scripts/#script-processing.

Add the `is:inline` directive explicitly to silence this hint.

[7m134[0m <script src="js/enhancements.js?v=b3b77aa6" defer></script>
[7m   [0m [93m        ~~~[0m
[96msrc/components/home/HomePageChrome.astro[0m:[93m133[0m:[93m9[0m - [93mwarning[0m[90m astro(4000): [0mThis script will be treated as if it has the `is:inline` directive because it contains an attribute. Therefore, features that require processing (e.g. using TypeScript or npm packages in the script) are unavailable.

See docs for more details: https://docs.astro.build/en/guides/client-side-scripts/#script-processing.

Add the `is:inline` directive explicitly to silence this hint.

[7m133[0m <script src="js/site.js?v=158b6e05" defer></script>
[7m   [0m [93m        ~~~[0m
[96msrc/components/home/HomePageChrome.astro[0m:[93m132[0m:[93m9[0m - [93mwarning[0m[90m astro(4000): [0mThis script will be treated as if it has the `is:inline` directive because it contains an attribute. Therefore, features that require processing (e.g. using TypeScript or npm packages in the script) are unavailable.

See docs for more details: https://docs.astro.build/en/guides/client-side-scripts/#script-processing.

Add the `is:inline` directive explicitly to silence this hint.

[7m132[0m <script src="js/scroll-perf.js?v=454d6f7b" defer></script>
[7m   [0m [93m        ~~~[0m
[96msrc/components/home/HomePageChrome.astro[0m:[93m131[0m:[93m9[0m - [93mwarning[0m[90m astro(4000): [0mThis script will be treated as if it has the `is:inline` directive because it contains an attribute. Therefore, features that require processing (e.g. using TypeScript or npm packages in the script) are unavailable.

See docs for more details: https://docs.astro.build/en/guides/client-side-scripts/#script-processing.

Add the `is:inline` directive explicitly to silence this hint.

[7m131[0m <script src="js/site-utils.js?v=897afa55" defer></script>
[7m   [0m [93m        ~~~[0m

[96msrc/components/karty/KartyHoldingPage.astro[0m:[93m25[0m:[93m3[0m - [93mwarning[0m[90m ts(6133): [0m'slug' is declared but its value is never read.

[7m25[0m   slug,
[7m  [0m [93m  ~~~~[0m

[96msrc/components/konfessii/russkij-baptizm/Baptizm3DBody.astro[0m:[93m56[0m:[93m9[0m - [93mwarning[0m[90m astro(4000): [0mThis script will be treated as if it has the `is:inline` directive because it contains an attribute. Therefore, features that require processing (e.g. using TypeScript or npm packages in the script) are unavailable.

See docs for more details: https://docs.astro.build/en/guides/client-side-scripts/#script-processing.

Add the `is:inline` directive explicitly to silence this hint.
```

### Check 46 — guard shared files
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ npm\ run\ guard:shared-files 
```
**Result:** PASS
```text

> gb-is-my-strength@1.6.3 guard:shared-files
> node scripts/guard-shared-files.js && npm run guard:agents-rev


=== SHARED FILES GUARD v3.0 ===
Branch: lane/system-premiumcontrols-surgical-2026-06-27
Lane: true | System lane: true | Shared lane: false
[LANE] tag: true
Files checked: 0
Shared/system files touched: 0

✅ Shared files guard PASSED

> gb-is-my-strength@1.6.3 guard:agents-rev
> node scripts/check-agents-rev-uniqueness.js

✅ AGENTS-rNNN entries are unique (55 total)
```

### Check 47 — validate:static-publication full gate
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ npm\ run\ validate:static-publication 
```
**Result:** PASS
```text

> gb-is-my-strength@1.6.3 validate:static-publication
> npm run validate:all && npm run owner:ui-guard && npm run about:visual-parity:audit && npm run biografii:visual-parity:audit && npm run hard-texts:visual-parity:audit && npm run pastor-series:visual-parity:audit && npm run articles:visual-parity:audit && npm run gill:context:visual-parity:audit && npm run gill:spravochnik:visual-parity:audit && npm run konfessii:visual-parity:audit && npm run karty:visual-parity:audit && npm run baptisty-rossii:visual-parity:audit && npm run home:visual-parity:audit && npm run nagornaya:visual-parity:audit && npm run catalogs:visual-parity:audit && npm run baptisty:roadmap:audit && npm run baptisty:visual-atlas:audit && npm run maps:validate && npm run page-ownership:check && npm run avraam:audit && npm run tokens:check && npm run css:layer:validate && node scripts/audit-pro.js && npm run content:parity && npm run readable-audit && npm run editorial:lint && npm run gill:reading-time:audit && npm run gill:pagefind:audit && npm run data:consistency && npm run content:guard && npm run astro:audit:article-mdx:strict && npm run astro:audit:baptisty-series && npm run mdx:structure:audit && npm run contract:compare && npm run migration:metadata:check:strict


> gb-is-my-strength@1.6.3 validate:all
> npm run validate:strict && npm run seo-audit


> gb-is-my-strength@1.6.3 validate:strict
> node scripts/validate.js --strict


🔍  validate.js

  📁  css/
  ⚠️  [css/floating-cluster.css] нестандартный брейкпоинт: 960px
  ⚠️  [css/floating-cluster.css] нестандартный брейкпоинт: 500px
  ⚠️  [css/floating-cluster.css] нестандартный брейкпоинт: 420px
  📁  js/
  📁  inline-scripts/
  📁  html-contracts/
  ✔  [html-contracts] Russian quote policy passed: no English direct quotes in reader-facing Russian text

  📄  20-antisovetov-pastoru
  ⚠️  [20-antisovetov-pastoru] <title> ≠ og:title\n           <title>: "20 антисоветов пастору: как разрушить служение"\n         og:title: "20 антисоветов, как пастору разрушить своё служение"

  📄  dzhon-gill-chast-1-chelovek

  📄  dzhon-gill-chast-2-uchenyi

  📄  dzhon-gill-chast-3-nasledie

  📄  dzhon-gill-istoricheskiy-kontekst

  📄  dzhon-gill-spravochnik

  📄  hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki

  📄  kod-da-vinchi

  📄  krajne-li-isporcheno-serdce

  📄  rimlyanam-7-veruyushchiy-ili-neveruyushchiy
  ⚠️  [rimlyanam-7-veruyushchiy-ili-neveruyushchiy] <title> ≠ og:title\n           <title>: "Римлянам 7: верующий или неверующий?"\n         og:title: "Римлянам 7: верующий, неверующий или человек под законом?"

  🗺  sitemap.xml + feed.xml

──────────────────────────────────────────────────
⚠️  Ошибок: 0  Предупреждений: 5
  → Предупреждения не прерывают workflow. Исправьте при возможности.


> gb-is-my-strength@1.6.3 seo-audit
> node scripts/seo-audit.js


SEO audit passed: 0 errors, 0 warnings.

> gb-is-my-strength@1.6.3 owner:ui-guard
> node scripts/owner-ui-regression-guard.js

✅ index.html: legacy premium home shell
✅ index.html: legacy home hero
✅ index.html: no rejected “Основные входы” strip
✅ js/site.js: TTS has homepage guard
✅ articles/index.html: articles-index-page
✅ articles/index.html: home-v20
✅ articles/index.html: h-hero-title
✅ articles/index.html: h-article-card
✅ articles/index.html: no generic Astro page shell
✅ articles/index.html: no generic Astro card grid
✅ biografii/index.html: home-v20
✅ biografii/index.html: h-hero-title
✅ biografii/index.html: h-article-card
✅ biografii/index.html: no generic Astro page shell
✅ biografii/index.html: no generic Astro card grid
✅ nagornaya/seriya/index.html: nagornaya-page nagornaya-series-page
✅ nagornaya/seriya/index.html: home-v20
✅ nagornaya/seriya/index.html: h-hero-title
```


## E. Dist / DOM / Playwright smoke

### Check 48 — dist exists after build
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ test\ -d\ dist\ \&\&\ find\ dist\ -name\ index.html\ \|\ wc\ -l 
```
**Result:** PASS
```text
54
```

### Check 49 — Dist PremiumControls current hashes
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ grep\ -RohE\ \'floating-cluster-controller\\.js\\\?v=\[a-f0-9\]\{8\}\|floating-cluster\\.css\\\?v=\[a-f0-9\]\{8\}\'\ dist\ \|\ sort\ \|\ uniq\ -c 
```
**Result:** PASS
```text
     26 floating-cluster-controller.js?v=131740c5
     19 floating-cluster.css?v=16382d7e
```

### Check 50 — Forbidden routes have zero controls in dist
```bash
bash -lc $'cd \'/home/user/work/gb-is-my-strength\' && PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':$PATH node - <<\'NODE\'\nconst fs=require(\'fs\');\nfor (const r of [\'karty/index.html\',\'map/index.html\',\'konfessii/russkij-baptizm/index.html\',\'rodosloviye/index.html\']) {\n const html=fs.readFileSync(\'dist/\'+r,\'utf8\');\n const n=(html.match(/gb-ember|gb-save/g)||[]).length; console.log(r,n); if(n) process.exit(1);\n}\nNODE' 
```
**Result:** PASS
```text
karty/index.html 0
map/index.html 0
konfessii/russkij-baptizm/index.html 0
rodosloviye/index.html 0
```

### Check 51 — Allowed sample routes have controls in dist
```bash
bash -lc $'cd \'/home/user/work/gb-is-my-strength\' && PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':$PATH node - <<\'NODE\'\nconst fs=require(\'fs\');\nfor (const r of [\'articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html\',\'articles/krajne-li-isporcheno-serdce/index.html\',\'articles/dzhon-gill-chast-1-chelovek/index.html\',\'baptisty-rossii/noch-na-kure/index.html\']) {\n const html=fs.readFileSync(\'dist/\'+r,\'utf8\');\n const ok=/gb-ember/.test(html)&&/(data-fc-root|data-fc-controls)/.test(html)&&/floating-cluster-controller\\.js\\?v=/.test(html); console.log(r, ok); if(!ok) process.exit(1);\n}\nNODE' 
```
**Result:** PASS
```text
articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/index.html true
articles/krajne-li-isporcheno-serdce/index.html true
articles/dzhon-gill-chast-1-chelovek/index.html true
baptisty-rossii/noch-na-kure/index.html true
```

### Check 52 — Playwright PremiumControls desktop smoke
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ python3\ -m\ http.server\ 8098\ --bind\ 127.0.0.1\ --directory\ dist\ \>/tmp/pc-smoke-8098.log\ 2\>\&1\ \&\ pid=\$\!\;\ trap\ \'kill\ \$pid\ 2\>/dev/null\ \|\|\ true\;\ rm\ -f\ /home/user/work/gb-is-my-strength/tmp-pc-smoke.mjs\'\ EXIT\;\ sleep\ 1\;\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ node\ tmp-pc-smoke.mjs 
```
**Result:** FAIL (exit 1)
```text
node:internal/modules/cjs/loader:1252
  throw err;
  ^

Error: Cannot find module '/home/user/tmp-pc-smoke.mjs'
    at Function._resolveFilename (node:internal/modules/cjs/loader:1249:15)
    at Function._load (node:internal/modules/cjs/loader:1075:27)
    at TracingChannel.traceSync (node:diagnostics_channel:322:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:219:24)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:170:5)
    at node:internal/main/run_main_module:36:49 {
  code: 'MODULE_NOT_FOUND',
  requireStack: []
}

Node.js v22.12.0
```

### Check 53 — Playwright PremiumControls mobile tap smoke
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ python3\ -m\ http.server\ 8099\ --bind\ 127.0.0.1\ --directory\ dist\ \>/tmp/pc-smoke-8099.log\ 2\>\&1\ \&\ pid=\$\!\;\ trap\ \'kill\ \$pid\ 2\>/dev/null\ \|\|\ true\;\ rm\ -f\ /home/user/work/gb-is-my-strength/tmp-pc-mobile-smoke.mjs\'\ EXIT\;\ sleep\ 1\;\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ node\ tmp-pc-mobile-smoke.mjs 
```
**Result:** FAIL (exit 1)
```text
node:internal/modules/cjs/loader:1252
  throw err;
  ^

Error: Cannot find module '/home/user/tmp-pc-mobile-smoke.mjs'
    at Function._resolveFilename (node:internal/modules/cjs/loader:1249:15)
    at Function._load (node:internal/modules/cjs/loader:1075:27)
    at TracingChannel.traceSync (node:diagnostics_channel:322:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:219:24)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:170:5)
    at node:internal/main/run_main_module:36:49 {
  code: 'MODULE_NOT_FOUND',
  requireStack: []
}

Node.js v22.12.0
```


## F. AuditRepo report integrity

### Check 54 — AuditRepo PremiumControls docs list
```bash
bash -lc cd\ \'/home/user/work/AuditRepo\'\ \&\&\ find\ projects/gb-is-my-strength/PremiumControls\ -maxdepth\ 2\ -type\ f\ \|\ sort 
```
**Result:** PASS
```text
projects/gb-is-my-strength/PremiumControls/DEEP_REVERIFY_2026-06-27.md
projects/gb-is-my-strength/PremiumControls/PREMIUMCONTROLS_SURGICAL_COMPLETION_TURNKEY_2026-06-27.md
projects/gb-is-my-strength/PremiumControls/README.md
projects/gb-is-my-strength/PremiumControls/ROADMAP.md
projects/gb-is-my-strength/PremiumControls/SURGICAL_REPLAY_CURRENT_MAIN_2026-06-27.md
projects/gb-is-my-strength/PremiumControls/patches/APPLIED-2026-06-26.md
projects/gb-is-my-strength/PremiumControls/patches/APPLIED-2026-06-27-current-main-replay.md
projects/gb-is-my-strength/PremiumControls/patches/APPLIED-2026-06-27.md
projects/gb-is-my-strength/PremiumControls/screenshots/speed-pill-desktop.png
projects/gb-is-my-strength/PremiumControls/screenshots/speed-pill-full-cluster.png
projects/gb-is-my-strength/PremiumControls/spec/playember-speed-morph.md
```

### Check 55 — AuditRepo current-main replay doc exists
```bash
bash -lc cd\ \'/home/user/work/AuditRepo\'\ \&\&\ test\ -s\ projects/gb-is-my-strength/PremiumControls/SURGICAL_REPLAY_CURRENT_MAIN_2026-06-27.md\ \&\&\ wc\ -l\ projects/gb-is-my-strength/PremiumControls/SURGICAL_REPLAY_CURRENT_MAIN_2026-06-27.md 
```
**Result:** PASS
```text
568 projects/gb-is-my-strength/PremiumControls/SURGICAL_REPLAY_CURRENT_MAIN_2026-06-27.md
```

### Check 56 — AuditRepo applied replay patch doc exists
```bash
bash -lc cd\ \'/home/user/work/AuditRepo\'\ \&\&\ test\ -s\ projects/gb-is-my-strength/PremiumControls/patches/APPLIED-2026-06-27-current-main-replay.md\ \&\&\ wc\ -l\ projects/gb-is-my-strength/PremiumControls/patches/APPLIED-2026-06-27-current-main-replay.md 
```
**Result:** PASS
```text
118 projects/gb-is-my-strength/PremiumControls/patches/APPLIED-2026-06-27-current-main-replay.md
```

### Check 57 — AuditRepo no git diff whitespace errors
```bash
bash -lc cd\ \'/home/user/work/AuditRepo\'\ \&\&\ git\ diff\ --check 
```
**Result:** PASS
```text
```


## Summary


Checks executed: **57**
PASS: **52**
WARN: **0**
FAIL: **5**

**Overall result:** FAIL — see failed checks above.
