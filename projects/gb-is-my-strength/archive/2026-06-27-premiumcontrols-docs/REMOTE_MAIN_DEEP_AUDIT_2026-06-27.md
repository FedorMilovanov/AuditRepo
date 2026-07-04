# PremiumControls — remote main deep audit (50+ checks)

**Date:** 2026-06-27
**Audited source:** `origin/main` checked out locally as `main`
**Audit purpose:** re-check current remote main after multiple agents landed PremiumControls / Gill / audit lanes after the surgical replay.


## A. Remote state and branch topology

### Check 1 — Node 22 version
```bash
/tmp/node-v22.12.0-linux-x64/bin/node -v 
```
**Result:** PASS
```text
v22.12.0
```

### Check 2 — npm version
```bash
/tmp/node-v22.12.0-linux-x64/bin/npm -v 
```
**Result:** PASS
```text
10.9.0
```

### Check 3 — fetch source
```bash
git -C /home/user/work/gb-is-my-strength fetch --all --prune 
```
**Result:** PASS
```text
From https://github.com/FedorMilovanov/gb-is-my-strength
 - [deleted]           (none)     -> origin/lane/audit-svg-pilot-bugs-2026-06-25
 - [deleted]           (none)     -> origin/lane/baptisty-content-expansion-2026-06-25
 - [deleted]           (none)     -> origin/lane/floating-cluster-guards-2026-06-27
 - [deleted]           (none)     -> origin/lane/gill-mobile-head-fix-2026-06-27
 - [deleted]           (none)     -> origin/lane/gill-part1-v16-converge-2026-06-27
 - [deleted]           (none)     -> origin/lane/gill-parts-v16-converge-2026-06-27
 - [deleted]           (none)     -> origin/lane/karty-avraam-indexable-text-layer-2026-06-26
 - [deleted]           (none)     -> origin/lane/system-premiumcontrols-guard-cleanup-2026-06-27
 - [deleted]           (none)     -> origin/lane/system-premiumcontrols-surgical-2026-06-27
 - [deleted]           (none)     -> origin/lane/system-release-gate-green-2026-06-26
 - [deleted]           (none)     -> origin/lane/tts-russian-voice-and-pause-2026-06-27
```

### Check 4 — checkout main at origin/main
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ git\ checkout\ main\ \>/dev/null\ \&\&\ git\ reset\ --hard\ origin/main\ \&\&\ git\ status\ --short\ --branch 
```
**Result:** PASS
```text
Already on 'main'
HEAD is now at 4e57cf81 [LANE lane/system-premiumcontrols-dist-gate-wiring-clean-2026-06-27] system(premiumcontrols): wire rollout audit into dist deploy gates
## main...origin/main
```

### Check 5 — source HEAD
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ git\ rev-parse\ --short\ HEAD\ \&\&\ git\ log\ -1\ --oneline 
```
**Result:** PASS
```text
4e57cf81
4e57cf81 [LANE lane/system-premiumcontrols-dist-gate-wiring-clean-2026-06-27] system(premiumcontrols): wire rollout audit into dist deploy gates
```

### Check 6 — AuditRepo status
```bash
git -C /home/user/work/AuditRepo status --short --branch 
```
**Result:** PASS
```text
## main...origin/main [behind 1]
?? projects/gb-is-my-strength/PremiumControls/DEEP_REVERIFY_2026-06-27.md
?? projects/gb-is-my-strength/PremiumControls/REMOTE_MAIN_DEEP_AUDIT_2026-06-27.md
```

### Check 7 — remote URLs sanitized
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ git\ remote\ -v\ \|\ sed\ -E\ \'s#https://\[\^@\]+@#https://\*\*\*@#\' 
```
**Result:** PASS
```text
origin	https://github.com/FedorMilovanov/gb-is-my-strength.git (fetch)
origin	https://github.com/FedorMilovanov/gb-is-my-strength.git (push)
```

### Check 8 — active remote lanes
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ git\ branch\ -r\ \|\ sed\ \'s/\^\ \*//\'\ \|\ grep\ \'\^origin/lane/\'\ \|\ sort 
```
**Result:** PASS
```text
```

### Check 9 — latest main history
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ git\ log\ --oneline\ --decorate\ --max-count=20\ origin/main 
```
**Result:** PASS
```text
4e57cf81 (HEAD -> main, origin/main, origin/HEAD) [LANE lane/system-premiumcontrols-dist-gate-wiring-clean-2026-06-27] system(premiumcontrols): wire rollout audit into dist deploy gates
d4ddc422 [LANE lane/system-visual-audit-height-reconciliation-2026-06-27] system(visual-audit): reconcile height expectations for desktop vertical cluster vs mobile horizontal pill
6af03136 [LANE lane/shared-genealogy-multiparent-2026-06-27] fix(genealogy): multi-parent edges so matriarchs connect to children
23f283d4 [LANE lane/system-premiumcontrols-bulletproof-guards-2026-06-27] system(premiumcontrols): enhance rollout audit and owner UI guard with bulletproof assertions
87ca1f8f chore: auto-update meta, cache-bust [skip ci]
51dbd0e5 [LANE lane/branch-convergence-cleanup-2026-06-27] chore: cache-bust reconcile after rebase onto main
5e4059c7 [LANE lane/branch-convergence-cleanup-2026-06-27] feat: GILL-C numeral safety-net + Abraham map indexable text layer
16e30c7b chore: auto-update meta, cache-bust [skip ci]
1cda1d03 [LANE lane/system-gill-parts-2-3-h2-parity-2026-06-27] system(gill): fix H2 parity between legacy dzhon-gill-chast-2/3 and Astro reconstructions
ca96d795 [LANE lane/system-gill-part1-h2-parity-2026-06-27] system(gill): fix H2 parity between legacy dzhon-gill-chast-1-chelovek and Astro reconstruction
2833c0fe [LANE lane/system-gill-spravochnik-h2-parity-2026-06-27] system(gill): fix H2 parity between legacy dzhon-gill-spravochnik and Astro reconstruction
f6b34cbc [LANE lane/system-lane-report-leak-fix-2026-06-27] system(audit-pro): fix base path leak in previous lane report
c5fde4b4 [LANE lane/system-audit-pro-clean-reconciliation-2026-06-27] system(audit-pro): fix AGENTS path leak, izbrannoe local ref, z-index magic number, bare CSS vars
d2d5494b [LANE lane/system-download-fonts-syntax-fix-2026-06-27] system(fonts): fix SPECS outer array syntax in download-fonts.js
8cc76885 [LANE lane/system-premiumcontrols-reconciliation-2026-06-27] system(reconciliation): PremiumControls protected status in AGENTS.md + workflow parity + izbrannoe contract
46920582 [LANE lane/premiumcontrols-surgical-finish-2026-06-27] fix(premiumcontrols): reapply TTS race and speed pill guards after Gill v16 converge
b00ca5b6 [LANE lane/gill-parts-v16-converge-2026-06-27] feat(gill): converge all parts to v16 chrome + fix part-TOC wipe + GILL-F responsive layer
251649fc chore: auto-update meta, cache-bust [skip ci]
593d86a5 chore: remove remaining scratch test scripts
be847937 chore: remove scratch screenshots/test files accidentally committed
```

### Check 10 — PremiumControls-related commits in latest main
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ git\ log\ --oneline\ --grep=\'premiumcontrols\\\|PremiumControls\\\|floating-cluster\\\|playember\\\|Gill\'\ --all\ --max-count=40 
```
**Result:** PASS
```text
4e57cf81 [LANE lane/system-premiumcontrols-dist-gate-wiring-clean-2026-06-27] system(premiumcontrols): wire rollout audit into dist deploy gates
23f283d4 [LANE lane/system-premiumcontrols-bulletproof-guards-2026-06-27] system(premiumcontrols): enhance rollout audit and owner UI guard with bulletproof assertions
5e4059c7 [LANE lane/branch-convergence-cleanup-2026-06-27] feat: GILL-C numeral safety-net + Abraham map indexable text layer
8cc76885 [LANE lane/system-premiumcontrols-reconciliation-2026-06-27] system(reconciliation): PremiumControls protected status in AGENTS.md + workflow parity + izbrannoe contract
46920582 [LANE lane/premiumcontrols-surgical-finish-2026-06-27] fix(premiumcontrols): reapply TTS race and speed pill guards after Gill v16 converge
6c9b3d06 [LANE lane/system-premiumcontrols-surgical-2026-06-27] fix(premiumcontrols): replay audit gate on current main
b00ca5b6 [LANE lane/gill-parts-v16-converge-2026-06-27] feat(gill): converge all parts to v16 chrome + fix part-TOC wipe + GILL-F responsive layer
53212c14 [LANE lane/playember-hover-premium-2026-06-27] feat(playember): premium hover-bloom speed pill + Russian TTS voice + working pause
3e477231 [LANE lane/floating-cluster-finish-2026-06-27] fix(GILL-A): prevent vertical text in gbs2-mobile-head on narrow screens
f372505f [LANE lane/floating-cluster-finish-2026-06-27] fix(POS-01): restore EXACT historical .theme-toggle position for Hermeneutics
d6a23cae [LANE lane/floating-cluster-finish-2026-06-27] fix(VR-02+VR-09): Gill footer reference-exact + Hermeneutics modifier in built HTML
66650847 fix(critical): VR-07 Gill huge icons + VR-01 position override + VR-02 footer layout
2b823687 fix(critical): restore breadcrumb-level positioning + mobile pill + fc-single-active
8f42c9f8 cleanup(P3): remove CSS duplication + dead links — single source of truth
b29d4a5d fix(ui): speed-pill closer to reference — Play shifts right on open, 999px pill, 260ms anim, 25ms stagger, cache-bust sync
2be8c0ed fix(critical): close 10 P0-P2 regressions — restore CSS links, fix modes, TTS click path, toast, rate key, init order
53f68d38 feat(premiumcontrols): add Play+Save to all 11 Baptisty bodies — closes last Save gap
a38d7e03 feat(premiumcontrols): dedicated /izbrannoe/ favorites page + nav links
6c5b83a3 fix(pc-003): correct asset-version.js hashes + drop phantom premium-controls-controller.js
99a7acfd release: PremiumControls v2.1 — close PC-001..PC-006 + 12 audit bugs + TTS
dd1656b7 chore: cache-bust Astro source + CI ARENA_AGENT token
4967f218 merge: PR #19 system-premiumcontrols-hardening → pc-final
02bb0a6f feat(premiumcontrols): PC-004 — canonical CSS only, remove 3× <style is:global> duplicates
ad5675dd feat(premiumcontrols): Phase 3 complete — PC-002/005 + Anchor + CSS + audit + TTS
e2041042 [LANE lane/system-premiumcontrols-hardening-2026-06-26-arena] close BUG-A7/A9/B6/S6 + cleanup dead JS modules
debf4030 [LANE lane/system-premiumcontrols-hardening-2026-06-26-arena] fix(audit): close 12 P0/P1/P2 bugs + PremiumControls Phase 1-2
171ced0c Merge remote-tracking branch 'origin/lane/premiumcontrols-heart-series-wiring-2026-06-26' into integration/monolith-preflight-2026-06-26-arena
099afce4 fix(premiumcontrols): wire dead Play/Save on heart-series articles (PC-002)
eb1504ea [LANE lane/cleanup-double-css-dead-files-2026-06-26] fix: N-REV1-7 double CSS + P2-14 dead series-cards.js
1c76879b [LANE lane/fix-p0-p1-batch-2026-06-26] fix: P0-6 + P0-7/P0-8 + P1-8 + P1-14 batch
d30042a8 Merge: PlayEmber speed popover redesign + Gill part1/2/3 wiring (conflict resolved)
7db3531a Merge: Gill desktop theme/search buttons clickability fix
0f35321c [LANE lane/fix-play-popover-premiumcontrols-2026-06-25] fix(ui): PlayEmber speed popover redesign + Gill part1/2/3 wiring
dc197731 [LANE lane/seo-audit-2026-06-25] fix(seo): wordCount+timeRequired, loading=lazy, sitemap lastmod, llms.txt
85718490 [LANE lane/fix-gill-rail-clickability-premiumcontrols-2026-06-25] fix(ui): Gill GBS2 desktop theme/search buttons not clickable (PremiumControls)
7918cd77 [LANE lane/seo-audit-2026-06-25] fix(seo): P1 structured data + H1 + alt + sitemap — 25 files
834f5949 [LANE lane/seo-audit-2026-06-25] audit(seo): verification pass — confirmed bugs + revised statuses
97b59087 [LANE lane/seo-audit-2026-06-25] audit(seo): full SEO audit report 2026-06-25
8f2b29e8 [LANE lane/ui-premium-svg-controls-final-polish-2026-06-25] fix(net-new-bugs): V2-1+V2-2+V2-3+V2-4 from verifier-2 amendments + sw.js path-quoting fix
2f2e2bb6 [LANE lane/fix-krajne-rimlyanam-sync-2026-06-25] fix: sync heart/nagornaya + controller early-exit
```

### Check 11 — remote branch conflict simulation vs current main
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\;\ for\ b\ in\ \$\(git\ branch\ -r\ \|\ sed\ \'s/\^\ \*//\'\ \|\ grep\ \'\^origin/lane/\'\ \|\ sort\)\;\ do\ base=\$\(git\ merge-base\ origin/main\ \$b\)\;\ if\ \[\ \$\(git\ rev-parse\ \$b\)\ =\ \$\(git\ rev-parse\ origin/main\)\ \]\;\ then\ echo\ \"same-as-main\ \$b\"\;\ elif\ git\ merge-tree\ \$base\ origin/main\ \$b\ \|\ grep\ -q\ \'\<\<\<\<\<\<\<\'\;\ then\ echo\ \"CONFLICT\ \$b\"\;\ else\ echo\ \"clean\ \$b\"\;\ fi\;\ done 
```
**Result:** PASS
```text
```

### Check 12 — lanes touching PremiumControls core
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\;\ for\ b\ in\ \$\(git\ branch\ -r\ \|\ sed\ \'s/\^\ \*//\'\ \|\ grep\ \'\^origin/lane/\'\ \|\ sort\)\;\ do\ files=\$\(git\ diff\ --name-only\ origin/main...\$b\ 2\>/dev/null\ \|\ grep\ -E\ \'premium-controls\|floating-cluster\|PlayEmber\|Gill.\*PageChrome\|cache-bust\|package.json\|workflow\'\ \|\|\ true\)\;\ \[\ -n\ \"\$files\"\ \]\ \&\&\ \{\ echo\ \"---\ \$b\"\;\ echo\ \"\$files\"\ \|\ sed\ \'s/\^/\ \ /\'\;\ \}\;\ done 
```
**Result:** PASS
```text
```


## B. PremiumControls source invariants on current main

### Check 13 — controller syntax
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ node\ --check\ js/floating-cluster-controller.js 
```
**Result:** PASS
```text
```

### Check 14 — cache-bust syntax
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ node\ --check\ scripts/cache-bust.js 
```
**Result:** PASS
```text
```

### Check 15 — premium rollout audit syntax
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ node\ --check\ scripts/premium-controls-rollout-audit.js 
```
**Result:** PASS
```text
```

### Check 16 — owner UI guard syntax
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ node\ --check\ scripts/owner-ui-regression-guard.js 
```
**Result:** PASS
```text
```

### Check 17 — package PremiumControls scripts
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ node\ -e\ \'const\ s=require\(\"./package.json\"\).scripts\;\ console.log\(s\[\"audit:premium-controls\"\]\|\|\"missing\"\)\;\ console.log\(s\[\"audit:premium-controls:no-build\"\]\|\|\"missing\"\)\;\ if\(\!s\[\"audit:premium-controls\"\]\)\ process.exit\(1\)\' 
```
**Result:** PASS
```text
node scripts/premium-controls-rollout-audit.js
missing
```

### Check 18 — controller ARIA radiogroup
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ grep\ -n\ \"radiogroup\\\|aria-checked\"\ js/floating-cluster-controller.js\ \|\ head\ -10 
```
**Result:** PASS
```text
788:      panel.setAttribute('role', 'radiogroup');
792:        return '<button class="gb-ember-expand__btn' + active + '" type="button" role="radio" data-speed="' + s + '" aria-label="Скорость ' + s + '\u00d7" aria-pressed="' + (s === currentRate ? 'true' : 'false') + '" aria-checked="' + (s === currentRate ? 'true' : 'false') + '">' + s + '\u00d7</button>';
862:            b.setAttribute('aria-checked', isThis ? 'true' : 'false');
```

### Check 19 — canonical rate key present
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ grep\ -n\ \"gb:audio:rate\\\|gb:tts-rate-change\"\ js/floating-cluster-controller.js\ \|\ head\ -20 
```
**Result:** PASS
```text
221:     применяя сохранённую скорость из localStorage gb:audio:rate (fallback gbx-tts-rate).
296:    try { r = parseFloat(localStorage.getItem('gb:audio:rate') || localStorage.getItem('gbx-tts-rate')) || 1; } catch (_) {}
406:  window.addEventListener('gb:tts-rate-change', function (ev) {
780:      try { currentRate = parseFloat(localStorage.getItem('gb:audio:rate') || localStorage.getItem('gbx-tts-rate')) || 1; } catch(_){}
857:          try { localStorage.setItem('gb:audio:rate', speed); try{localStorage.setItem('gbx-tts-rate', speed)}catch(_){}; } catch(_){}
866:            window.dispatchEvent(new CustomEvent('gb:tts-rate-change', {
```

### Check 20 — legacy TTS toast absent
```bash
bash -lc $'cd \'/home/user/work/gb-is-my-strength\' && ! grep -RIn \'\320\236\320\267\320\262\321\203\321\207\320\272\320\260 \320\265\321\211\321\221 \320\275\320\265 \320\277\320\276\320\264\320\272\320\273\321\216\321\207\320\265\320\275\320\260\' js src articles baptisty-rossii nagornaya 2>/dev/null' 
```
**Result:** PASS
```text
```

### Check 21 — unversioned floating refs in source
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ \!\ grep\ -RInE\ \'\(href\|src\)=\"\(\\.\\./\)\*css/floating-cluster\\.css\"\|\(href\|src\)=\"\(\\.\\./\)\*js/floating-cluster-controller\\.js\"\'\ src\ articles\ baptisty-rossii\ nagornaya\ 2\>/dev/null 
```
**Result:** FAIL (exit 1)
```text
src/components/article-pilots/gill-part1/GillPart1PageHead.astro:72:<link href="../../css/floating-cluster.css" rel="stylesheet"/>
src/components/article-pilots/gill-part2/GillPart2PageHead.astro:72:<link href="../../css/floating-cluster.css" rel="stylesheet"/>
src/components/article-pilots/gill-part3/GillPart3PageHead.astro:71:<link href="../../css/floating-cluster.css" rel="stylesheet"/>
src/components/article-pilots/gill-spravochnik/GillSpravochnikPageHead.astro:62:<link href="../../css/floating-cluster.css" rel="stylesheet"/>
src/components/baptisty-rossii/BaptistyRossiiBody.astro:8:<script is:inline defer src="../../js/floating-cluster-controller.js"></script>
src/components/baptisty-rossii/BaptistyRossiiDvaSezda1884Body.astro:8:<script is:inline defer src="../../js/floating-cluster-controller.js"></script>
src/components/baptisty-rossii/BaptistyRossiiDvaSezda1884PageHead.astro:16:<link href="../../css/floating-cluster.css" rel="stylesheet"/>
src/components/baptisty-rossii/BaptistyRossiiGoneniyaISovestBody.astro:8:<script is:inline defer src="../../js/floating-cluster-controller.js"></script>
src/components/baptisty-rossii/BaptistyRossiiGoneniyaISovestPageHead.astro:16:<link href="../../css/floating-cluster.css" rel="stylesheet"/>
src/components/baptisty-rossii/BaptistyRossiiIniciativnayaGruppaBody.astro:8:<script is:inline defer src="../../js/floating-cluster-controller.js"></script>
src/components/baptisty-rossii/BaptistyRossiiIniciativnayaGruppaPageHead.astro:16:<link href="../../css/floating-cluster.css" rel="stylesheet"/>
src/components/baptisty-rossii/BaptistyRossiiNochNaKureBody.astro:8:<script is:inline defer src="../../js/floating-cluster-controller.js"></script>
src/components/baptisty-rossii/BaptistyRossiiNochNaKurePageHead.astro:16:<link href="../../css/floating-cluster.css" rel="stylesheet"/>
src/components/baptisty-rossii/BaptistyRossiiPageHead.astro:17:<link href="../../css/floating-cluster.css" rel="stylesheet"/>
src/components/baptisty-rossii/BaptistyRossiiPeterburgskayaLiniyaBody.astro:8:<script is:inline defer src="../../js/floating-cluster-controller.js"></script>
src/components/baptisty-rossii/BaptistyRossiiPeterburgskayaLiniyaPageHead.astro:16:<link href="../../css/floating-cluster.css" rel="stylesheet"/>
src/components/baptisty-rossii/BaptistyRossiiPodpolnayaPechatBody.astro:8:<script is:inline defer src="../../js/floating-cluster-controller.js"></script>
src/components/baptisty-rossii/BaptistyRossiiPodpolnayaPechatPageHead.astro:16:<link href="../../css/floating-cluster.css" rel="stylesheet"/>
src/components/baptisty-rossii/BaptistyRossiiSovetskayaNochBody.astro:8:<script is:inline defer src="../../js/floating-cluster-controller.js"></script>
src/components/baptisty-rossii/BaptistyRossiiSovetskayaNochPageHead.astro:16:<link href="../../css/floating-cluster.css" rel="stylesheet"/>
src/components/baptisty-rossii/BaptistyRossiiSpravochnikBody.astro:37:<script is:inline defer src="../../js/floating-cluster-controller.js"></script>
src/components/baptisty-rossii/BaptistyRossiiSpravochnikPageHead.astro:16:<link href="../../css/floating-cluster.css" rel="stylesheet"/>
src/components/baptisty-rossii/BaptistyRossiiVsehib1944Body.astro:8:<script is:inline defer src="../../js/floating-cluster-controller.js"></script>
src/components/baptisty-rossii/BaptistyRossiiVsehib1944PageHead.astro:16:<link href="../../css/floating-cluster.css" rel="stylesheet"/>
src/components/baptisty-rossii/BaptistyRossiiYuzhnayaShtundaBody.astro:8:<script is:inline defer src="../../js/floating-cluster-controller.js"></script>
src/components/baptisty-rossii/BaptistyRossiiYuzhnayaShtundaPageHead.astro:16:<link href="../../css/floating-cluster.css" rel="stylesheet"/>
```

### Check 22 — all source floating hashes
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ grep\ -RohE\ \'floating-cluster-controller\\.js\\\?v=\[a-f0-9\]\{8\}\|floating-cluster\\.css\\\?v=\[a-f0-9\]\{8\}\'\ src\ articles\ baptisty-rossii\ nagornaya\ \|\ sort\ \|\ uniq\ -c 
```
**Result:** PASS
```text
     40 floating-cluster-controller.js?v=2ea97d46
     27 floating-cluster.css?v=e7feff19
```

/tmp/current_main_pc_audit.sh: line 47: ${f}:: command not found
### Check 23 — real hashes vs asset-version helper
```bash
bash -lc $'cd \'/home/user/work/gb-is-my-strength\' && PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':$PATH node - <<\'NODE\'\nconst fs=require(\'fs\'), crypto=require(\'crypto\');\nconst h=f=>crypto.createHash(\'md5\').update(fs.readFileSync(f)).digest(\'hex\').slice(0,8);\nconst helper=fs.existsSync(\'src/lib/asset-version.js\')?fs.readFileSync(\'src/lib/asset-version.js\',\'utf8\'):\'\';\nfor (const f of [\'css/floating-cluster.css\',\'js/floating-cluster-controller.js\',\'css/premium-controls.css\']) {\n const hash=h(f); const ok=helper.includes(); console.log(f, \'real=\'+hash, \'helperCurrent=\'+ok); if(!ok) process.exitCode=1;\n}\nNODE' 
```
**Result:** FAIL (exit 1)
```text
css/floating-cluster.css real=e7feff19 helperCurrent=false
js/floating-cluster-controller.js real=2ea97d46 helperCurrent=false
css/premium-controls.css real=35714e73 helperCurrent=false
```

### Check 24 — cache-bust dry run
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ npm\ run\ cache-bust\ --\ --dry-run\ \|\ tail\ -25 
```
**Result:** PASS
```text
  ✔  css/command-palette.css         →  ?v=afe33045
  ✔  css/mobile-hotfix.css           →  ?v=c1f7664e
  ✔  css/nagornaya-mobile-toc.css    →  ?v=c4a4a7fd
  ✔  css/floating-cluster.css        →  ?v=e7feff19
  ✔  fonts/fonts.css                 →  ?v=4504f3cb
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
  ✔  js/floating-cluster-controller.js  →  ?v=2ea97d46

  HTML-файлов в проекте: 56

  Astro-компонентов в src/: 395

──────────────────────────────────────────────────
✅  Хеши не изменились — HTML/Astro не тронуты.

```

### Check 25 — PremiumControls audit script contains PC-003 checks
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ grep\ -n\ \"PC-003\\\|cache-bust\ drift\\\|asset-version\\\|floating-cluster-controller.js\"\ scripts/premium-controls-rollout-audit.js\ \|\ head\ -40 
```
**Result:** PASS
```text
13: *      [data-fc-controls] scope, so floating-cluster-controller.js never wires
112:        'floating-cluster-controller.js missing → controls dead');
139:const controllerPath = path.join(ROOT, 'js/floating-cluster-controller.js');
143:    ok('floating-cluster-controller.js canonical storage & events OK (PC-005)');
145:    bad('floating-cluster-controller.js missing canonical rate or events', 'must contain gb:audio:rate and gb:tts-rate-change');
148:  bad('floating-cluster-controller.js missing', 'core PremiumControls runtime missing');
```

### Check 26 — owner UI guard contains PremiumControls assertions
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ grep\ -n\ \"PremiumControls\\\|gb-ember\\\|floating-cluster\\\|PlayEmber\"\ scripts/owner-ui-regression-guard.js\ \|\ head\ -60 
```
**Result:** PASS
```text
82:// PremiumControls protected subsystem guard (PC-001..PC-007)
84:mustContain('src/components/ui/floating-cluster/RomanNumeral.astro', 'gb-roman', 'RomanNumeral component exists');
85:mustContain('AGENTS.md', '3.10 PremiumControls / Floating Cluster', 'AGENTS.md Section 3.10 PremiumControls protected status');
```

### Check 27 — Gill v16 H2 parity in source
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ for\ f\ in\ src/components/article-pilots/gill-part1/GillPart1PageChrome.astro\ src/components/article-pilots/gill-part2/GillPart2PageChrome.astro\ src/components/article-pilots/gill-part3/GillPart3PageChrome.astro\ src/components/article-pilots/gill-spravochnik/GillSpravochnikPageChrome.astro\;\ do\ echo\ -n\ \"\$f:\ \"\;\ grep\ -o\ \'\<h2\>\[\^\<\]\*\</h2\>\'\ \$f\ \|\ head\ -1\;\ done 
```
**Result:** PASS
```text
src/components/article-pilots/gill-part1/GillPart1PageChrome.astro: <h2>Джон Гилл (1697–1771)</h2>
src/components/article-pilots/gill-part2/GillPart2PageChrome.astro: <h2>Джон Гилл (1697–1771)</h2>
src/components/article-pilots/gill-part3/GillPart3PageChrome.astro: <h2>Джон Гилл (1697–1771)</h2>
src/components/article-pilots/gill-spravochnik/GillSpravochnikPageChrome.astro: <h2>Джон Гилл (1697–1771)</h2>
```


## C. Project gates on current main

### Check 28 — validate:all
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

### Check 29 — audit-pro
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ node\ scripts/audit-pro.js 
```
**Result:** PASS
```text

══════════════════════════════════════════════════════════════════════════════
GB-IS-MY-STRENGTH — PROFESSIONAL AUDIT
2026-06-27T08:04:31.796Z · 3.48s
══════════════════════════════════════════════════════════════════════════════

Summary: ✅ 164 passed · ⚠️ 1 warnings · ❌ 0 errors · ℹ️ 10 info

── PASSED ──
✅ Structure: exactly 7 CSS files in /css
✅ Structure: exactly 11 JS files in /js
✅ Structure: fonts/fonts.css and nagornaya/tw.min.css exist
✅ JS total 358546 bytes within budget
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
✅ Local resources and internal links valid (2470 refs checked)
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
✅ All content pages have <html lang="…">
✅ Anchors: every <a> has visible text / aria-label / alt
✅ Buttons: every icon-only <button> carries aria-label
✅ Tabindex hygiene: no positive tabindex values
✅ CSS variables: 277 defined; bare-usage check passed (28 runtime externals)
✅ Image references: every src/srcset URL resolves to an existing file
✅ sitemap.xml: no noindex pages listed (checked 43 URLs)
✅ Canonical URLs: present + unique + match own page (51 pages)
✅ Viewport: user zoom allowed on all pages (no user-scalable=no / maximum-scale=1)
✅ No inline event handlers (onclick/onload/…) in HTML — CSP-safe
✅ <meta charset> appears in first 1KB of every page
✅ sw.js precache: every referenced asset exists (27 checked, pagefind/ skipped)
✅ CSP img-src covers every external <img> host found in HTML
✅ feed.xml lastBuildDate is 0 days old (fresh)
✅ JSON-LD shape: every block has valid @context (schema.org) and @type/@graph
✅ Meta descriptions: all ≤ 300 chars (Russian-friendly cap)
✅ No surprise noindex (12 pages explicitly allowed: 404 + robot stubs)
✅ JS bundle ratchet OK (6 files watched)
✅ innerHTML hygiene: no untrusted-source assignments (location/cookie/input/fetch/storage)
```

### Check 30 — owner UI guard
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ npm\ run\ owner:ui-guard 
```
**Result:** PASS
```text

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
✅ nagornaya/seriya/index.html: h-article-card
✅ nagornaya/seriya/index.html: no generic Astro page shell
✅ nagornaya/seriya/index.html: no generic Astro card grid
✅ articles/dzhon-gill-chast-1-chelovek/index.html: gbs-world
✅ articles/dzhon-gill-chast-1-chelovek/index.html: data-gbs2-series="dzhon-gill"
✅ articles/dzhon-gill-chast-1-chelovek/index.html: gbs2-rail
✅ articles/dzhon-gill-chast-1-chelovek/index.html: gbs2-hero
✅ articles/dzhon-gill-chast-1-chelovek/index.html: no generic Astro page shell
✅ articles/dzhon-gill-chast-1-chelovek/index.html: no generic Astro card grid
✅ articles/dzhon-gill-chast-2-uchenyi/index.html: gbs-world
✅ articles/dzhon-gill-chast-2-uchenyi/index.html: data-gbs2-series="dzhon-gill"
✅ articles/dzhon-gill-chast-2-uchenyi/index.html: gbs2-rail
✅ articles/dzhon-gill-chast-2-uchenyi/index.html: gbs2-hero
✅ articles/dzhon-gill-chast-2-uchenyi/index.html: no generic Astro page shell
✅ articles/dzhon-gill-chast-2-uchenyi/index.html: no generic Astro card grid
✅ articles/dzhon-gill-chast-3-nasledie/index.html: gbs-world
✅ articles/dzhon-gill-chast-3-nasledie/index.html: data-gbs2-series="dzhon-gill"
✅ articles/dzhon-gill-chast-3-nasledie/index.html: gbs2-rail
✅ articles/dzhon-gill-chast-3-nasledie/index.html: gbs2-hero
✅ articles/dzhon-gill-chast-3-nasledie/index.html: no generic Astro page shell
✅ articles/dzhon-gill-chast-3-nasledie/index.html: no generic Astro card grid
✅ karty/index.html: Avraam remains on map shelf
✅ karty/index.html: premium map shelf hero
✅ karty/index.html: unfinished map shelf warning
✅ karty/index.html: no unfinished demos on map shelf
✅ karty/ishod/index.html: ishod loads shared live map engine
✅ karty/ishod/index.html: no ishod is a live map, not a holding page
✅ karty/pavel/index.html: pavel holding page
✅ karty/pavel/index.html: no pavel unfinished live MapEngine root
✅ karty/shoftim/index.html: shoftim holding page
✅ karty/shoftim/index.html: no shoftim unfinished live MapEngine root
✅ karty/melachim/index.html: melachim holding page
✅ karty/melachim/index.html: no melachim unfinished live MapEngine root
✅ karty/shvatim/index.html: shvatim holding page
✅ karty/shvatim/index.html: no shvatim unfinished live MapEngine root
✅ karty/yeshua/index.html: yeshua holding page
✅ karty/yeshua/index.html: no yeshua unfinished live MapEngine root
✅ karty/maccabim/index.html: maccabim holding page
✅ karty/maccabim/index.html: no maccabim unfinished live MapEngine root
✅ karty/early-church/index.html: early-church holding page
✅ karty/early-church/index.html: no early-church unfinished live MapEngine root
✅ karty/revelation/index.html: revelation holding page
✅ karty/revelation/index.html: no revelation unfinished live MapEngine root
✅ baptisty-rossii/index.html: Russian Baptists GBS2 series shell
✅ baptisty-rossii/index.html: Russian Baptists complete series count
✅ css/site.css: Russian Baptists premium landing CSS guard
✅ css/site.css: Russian Baptists desktop compact card grid
✅ docs/OWNER-REQUIREMENTS.md: Astro 95% visual parity doctrine
✅ docs/OWNER-REQUIREMENTS.md: SEO is not visual parity doctrine
✅ docs/ASTRO-PREMIUM-MIGRATION-ROADMAP.md: premium Astro roadmap exists
✅ docs/ASTRO-PREMIUM-MIGRATION-ROADMAP.md: roadmap visual parity target
✅ AGENTS.md: AGENTS visual parity doctrine
✅ src/components/ui/premium-controls/PremiumControlAnchor.astro: PremiumControlAnchor component exists
✅ src/components/ui/floating-cluster/RomanNumeral.astro: RomanNumeral component exists
✅ AGENTS.md: AGENTS.md Section 3.10 PremiumControls protected status

OWNER UI REGRESSION GUARD
✅ Owner UI regression guard passed
```

### Check 31 — data consistency
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

### Check 32 — migration metadata strict
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ npm\ run\ migration:metadata:check:strict 
```
**Result:** PASS
```text

> gb-is-my-strength@1.6.3 migration:metadata:check:strict
> npm run route:profiles:check -- --strict && npm run migration:matrix:check -- --strict && npm run content:sources:check -- --strict


> gb-is-my-strength@1.6.3 route:profiles:check
> node scripts/check-route-profiles.js --strict

=== Route Profiles Check ===
Mode: STRICT

Routes checked: 52
Profiles found: 52

✅ Route profiles coherent with page ownership

> gb-is-my-strength@1.6.3 migration:matrix:check
> node scripts/check-route-migration-matrix.js --strict

=== Route Migration Matrix Check ===
Mode: STRICT

Routes checked against matrix: 35
Matrix entries: 35

✅ Route migration modes are coherent with matrix

> gb-is-my-strength@1.6.3 content:sources:check
> node scripts/check-content-source-coverage.js --strict

=== Content Source Coverage Check ===
Mode: STRICT

Series parts checked: 23
Routes checked: 52
MDX files: 20
Profiles: 54
Search items: 44

✅ Content source coverage is coherent
```

### Check 33 — native runtime strict
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

### Check 34 — Gill spravochnik visual audit
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
✅ H2 parity: 12

✅ Gill spravochnik strict-native audit passed
```

### Check 35 — article MDX strict audit
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

08:04:36 [content] Syncing content
08:04:36 [content] Synced content
08:04:36 [types] Generated 672ms
08:04:36 [check] Getting diagnostics for Astro files in /home/user/work/gb-is-my-strength...
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
```

### Check 36 — PremiumControls audit before build if dist exists
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ npm\ run\ audit:premium-controls\ \|\|\ true 
```
**Result:** PASS
```text

> gb-is-my-strength@1.6.3 audit:premium-controls
> node scripts/premium-controls-rollout-audit.js

⚠️ /articles/dzhon-gill-chast-1-chelovek/ (legacy root copy): missing gb-roman class (will be fixed upon Astro promotion)
⚠️ /articles/dzhon-gill-chast-2-uchenyi/ (legacy root copy): missing gb-roman class (will be fixed upon Astro promotion)
⚠️ /articles/dzhon-gill-chast-3-nasledie/ (legacy root copy): missing gb-roman class (will be fixed upon Astro promotion)
⚠️ /articles/dzhon-gill-istoricheskiy-kontekst/ (legacy root copy): missing gb-roman class (will be fixed upon Astro promotion)
⚠️ /articles/dzhon-gill-spravochnik/ (legacy root copy): missing gb-roman class (will be fixed upon Astro promotion)
⚠️ /articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/ (legacy root copy): missing ARIA attributes on controls (will be fixed upon Astro promotion)
⚠️ /baptisty-rossii/dva-sezda-1884/ (legacy root copy): missing ARIA attributes on controls (will be fixed upon Astro promotion)
⚠️ /baptisty-rossii/goneniya-i-sovest/ (legacy root copy): missing ARIA attributes on controls (will be fixed upon Astro promotion)
⚠️ /baptisty-rossii/ (legacy root copy): missing ARIA attributes on controls (will be fixed upon Astro promotion)
⚠️ /baptisty-rossii/iniciativnaya-gruppa/ (legacy root copy): missing ARIA attributes on controls (will be fixed upon Astro promotion)
⚠️ /baptisty-rossii/noch-na-kure/ (legacy root copy): missing ARIA attributes on controls (will be fixed upon Astro promotion)
⚠️ /baptisty-rossii/peterburgskaya-liniya/ (legacy root copy): missing ARIA attributes on controls (will be fixed upon Astro promotion)
⚠️ /baptisty-rossii/podpolnaya-pechat/ (legacy root copy): missing ARIA attributes on controls (will be fixed upon Astro promotion)
⚠️ /baptisty-rossii/sovetskaya-noch/ (legacy root copy): missing ARIA attributes on controls (will be fixed upon Astro promotion)
⚠️ /baptisty-rossii/spravochnik/ (legacy root copy): missing ARIA attributes on controls (will be fixed upon Astro promotion)
⚠️ /baptisty-rossii/vsehib-1944/ (legacy root copy): missing ARIA attributes on controls (will be fixed upon Astro promotion)
⚠️ /baptisty-rossii/yuzhnaya-shtunda/ (legacy root copy): missing ARIA attributes on controls (will be fixed upon Astro promotion)
⚠️ /nagornaya/chast-1/ (legacy root copy): missing ARIA attributes on controls (will be fixed upon Astro promotion)
⚠️ /nagornaya/chast-2/ (legacy root copy): missing ARIA attributes on controls (will be fixed upon Astro promotion)
⚠️ /nagornaya/chast-3/ (legacy root copy): missing ARIA attributes on controls (will be fixed upon Astro promotion)
⚠️ /nagornaya/chast-4/ (legacy root copy): missing ARIA attributes on controls (will be fixed upon Astro promotion)
⚠️ /nagornaya/chast-5/ (legacy root copy): missing ARIA attributes on controls (will be fixed upon Astro promotion)
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
✅ floating-cluster-controller.js canonical storage & events OK (PC-005)
✅ floating-cluster.css canonical rules OK (POS-01, speed morph, gb-roman)
✅ /articles/20-antisovetov-pastoru/ ARIA / accessibility parity OK
✅ /articles/dzhon-gill-chast-1-chelovek/ ARIA / accessibility parity OK
✅ /articles/dzhon-gill-chast-2-uchenyi/ ARIA / accessibility parity OK
✅ /articles/dzhon-gill-chast-3-nasledie/ ARIA / accessibility parity OK
✅ /articles/dzhon-gill-istoricheskiy-kontekst/ ARIA / accessibility parity OK
✅ /articles/dzhon-gill-spravochnik/ ARIA / accessibility parity OK
✅ /articles/hermenevticheskaya-otsenka-hristotsentrichnoy-germenevtiki/ ARIA / accessibility parity OK
✅ /articles/kod-da-vinchi/ ARIA / accessibility parity OK
✅ /articles/krajne-li-isporcheno-serdce/ ARIA / accessibility parity OK

PremiumControls rollout audit: 39/39 passed

✅ PremiumControls rollout contract OK.
```

### Check 37 — production-like build
```bash
bash -lc cd\ \'/home/user/work/gb-is-my-strength\'\ \&\&\ PATH=\'/tmp/node-v22.12.0-linux-x64/bin\':\$PATH\ npm\ run\ strangler:build:production-like 
```
