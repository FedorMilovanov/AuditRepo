# PremiumControls / Floating Cluster — аудит unmerged remote branches

**Дата:** 2026-06-27  
**Source repo:** `github.com/FedorMilovanov/gb-is-my-strength`  
**Локальная точка аудита:** `b63b9f29` — `main` после PremiumControls surgical finish  
**Remote baseline на момент аудита:** `origin/main = 251649fc`  
**Важно:** локальный `main` был ahead of origin/main by 2 commits, поэтому remote branches оценивались относительно более свежей локальной правды.

---

## 0. Главный вывод

Remote branches **нельзя batch-merge**. Часть веток полезны как evidence/design, но raw merge создаёт конфликты или откатит свежую хирургическую правку PremiumControls.

Итоговая матрица:

| Remote branch | SHA | Verdict |
|---|---:|---|
| `origin/lane/audit-svg-pilot-bugs-2026-06-25` | `b0d84131` | Archive / evidence only |
| `origin/lane/baptisty-content-expansion-2026-06-25` | `ac78d674` | Content candidate, editorial review required |
| `origin/lane/floating-cluster-guards-2026-06-27` | `82147033` | Selective adoption recommended |
| `origin/lane/gill-mobile-head-fix-2026-06-27` | `e620bcdb` | Do not merge branch; maybe extract tiny CSS after browser repro |
| `origin/lane/gill-part1-v16-converge-2026-06-27` | `d040a30a` | High-value design evidence, dirty/high-risk raw branch |
| `origin/lane/karty-avraam-indexable-text-layer-2026-06-26` | `afd9cb53` | Mostly superseded / manual compare only |
| `origin/lane/tts-russian-voice-and-pause-2026-06-27` | `81126da9` | Superseded by current local TTS hardening |

---

## 1. Commands used

```bash
git fetch --all --prune
git branch -r --no-merged main --format='%(refname:short)' | sort
git for-each-ref refs/remotes/origin --format='%(refname:short) %(objectname:short)'
git merge-tree main origin/lane/<branch>
git diff --stat main..origin/lane/<branch>
git diff --name-only main..origin/lane/<branch>
```

Remote branches not merged into local `main`:

```text
origin/lane/audit-svg-pilot-bugs-2026-06-25
origin/lane/baptisty-content-expansion-2026-06-25
origin/lane/floating-cluster-guards-2026-06-27
origin/lane/gill-mobile-head-fix-2026-06-27
origin/lane/gill-part1-v16-converge-2026-06-27
origin/lane/karty-avraam-indexable-text-layer-2026-06-26
origin/lane/tts-russian-voice-and-pause-2026-06-27
```

---

## 2. Merge risk matrix

| Branch | Merge-tree result | Notes |
|---|---:|---|
| `audit-svg-pilot-bugs` | clean | docs-only old audit |
| `baptisty-content-expansion` | clean | no technical conflict, editorial risk |
| `floating-cluster-guards` | clean | CSS/doc useful, but do selective lane |
| `gill-mobile-head-fix` | conflicts | conflicts in `nagornaya/chast-1..5/index.html`; contains scratch files |
| `gill-part1-v16-converge` | many conflicts | conflicts in HTML, PageHeads, `GillPart1PageChrome.astro`; scratch files/screenshots |
| `karty-avraam-indexable-text-layer` | conflict | `src/components/karty/avraam/AvraamMap.astro` |
| `tts-russian-voice-and-pause` | many conflicts | controller + HTML/Astro; superseded by stronger TTS guards |

---

## 3. Branch notes

### 3.1 `audit-svg-pilot-bugs-2026-06-25`

Files:

```text
audit/svg-pilot-bug-research-2026-06-25.md
docs/refactor-2026/lanes/audit-svg-pilot-bugs-2026-06-25.md
```

Content:

- Gill Context desktop rail not persistent/sticky;
- Gill mobile bottom bar not fixed-bottom;
- false-green source audit;
- Hermeneutics mobile drift;
- old text corruptions such as `прос�`, `кик говорят`, `скиния, называемая , .Святое`;
- tooltip/glossary/MDX debt.

Current local check did not find old corruption strings:

```bash
grep -RIn "прос�\|кик говорят\|скиния, называемая , .Святое" articles src dist
```

No output.

Verdict: keep as historical evidence, not active repair source.

### 3.2 `baptisty-content-expansion-2026-06-25`

Files changed:

```text
src/content/articles/dva-sezda-1884.mdx
src/content/articles/goneniya-i-sovest.mdx
src/content/articles/iniciativnaya-gruppa.mdx
src/content/articles/noch-na-kure.mdx
src/content/articles/peterburgskaya-liniya.mdx
src/content/articles/podpolnaya-pechat.mdx
src/content/articles/sovetskaya-noch.mdx
src/content/articles/vsehib-1944.mdx
src/content/articles/yuzhnaya-shtunda.mdx
```

Word-count comparison:

| File | Current | Branch |
|---|---:|---:|
| `dva-sezda-1884.mdx` | 672 | 1584 |
| `goneniya-i-sovest.mdx` | 2049 | 2351 |
| `iniciativnaya-gruppa.mdx` | 2102 | 2359 |
| `noch-na-kure.mdx` | 1014 | 1981 |
| `peterburgskaya-liniya.mdx` | 1381 | 1881 |
| `podpolnaya-pechat.mdx` | 1903 | 2164 |
| `sovetskaya-noch.mdx` | 1967 | 2075 |
| `vsehib-1944.mdx` | 1831 | 2102 |
| `yuzhnaya-shtunda.mdx` | 903 | 2028 |

Verdict: separate editorial lane only. It is not PremiumControls.

### 3.3 `floating-cluster-guards-2026-06-27`

Files:

```text
css/floating-cluster.css
docs/refactor-2026/FLOATING_CLUSTER_FORBIDDEN_AND_TRUTHS.md
docs/refactor-2026/FLOATING_CLUSTER_V16_FULL_SITE_PLAN.md
```

Valuable CSS safety net:

```css
.gbs-rail-card__num,
.toc-item__num,
.toc-part-item__num {
  color: var(--color-accent-gold, #b8936a);
}
```

Why useful: if `[data-gill-v16]` disappears in build/source desync, scoped v16 numeral rules go dead and roman numerals can inherit link-blue. This fallback is intentionally unscoped but class-specific to Gill/v16 numerals.

Valuable doc:

```text
docs/refactor-2026/FLOATING_CLUSTER_FORBIDDEN_AND_TRUTHS.md
```

Hard rules from doc:

- do not invent Hermeneutics positioning formulas;
- do not match DALLE screenshots;
- do not add halo/circle to `gb-save`;
- do not insert images/thumbs into Gill TOCs;
- do not touch `play-expand` without owner;
- do not treat source fix as complete without production-like rebuild and committed built HTML;
- do not remove `gbs2-*` markers required by `owner:ui-guard` without changing the guard contract;
- migrate Gill to v16 reference instead of patching legacy symptoms forever.

Verdict: adopt selectively in a small lane. Do **not** raw-merge if it would overwrite the new TTS/speed-pill work.

Recommended patch:

```bash
git checkout main
git pull --ff-only origin main
git checkout -b lane/floating-cluster-guards-selective-2026-06-27
```

Copy doc from branch:

```bash
git show origin/lane/floating-cluster-guards-2026-06-27:docs/refactor-2026/FLOATING_CLUSTER_FORBIDDEN_AND_TRUTHS.md \
  > docs/refactor-2026/FLOATING_CLUSTER_FORBIDDEN_AND_TRUTHS.md
```

Add CSS safety net to `css/floating-cluster.css` near Gill numeral rules:

```css
/* GILL-C SAFETY NET — roman numerals must NEVER inherit link blue. */
.gbs-rail-card__num,
.toc-item__num,
.toc-part-item__num {
  color: var(--color-accent-gold, #b8936a);
}
```

Then:

```bash
npm run cache-bust
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run strangler:build:production-like
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run audit:premium-controls
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run owner:ui-guard
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run validate:static-publication
git diff --check
git commit -am "[LANE lane/floating-cluster-guards-selective-2026-06-27] guard(floating-cluster): preserve Gill numeral safety rules"
```

### 3.4 `gill-mobile-head-fix-2026-06-27`

Useful CSS idea:

```css
.gbs2-mobile-title{min-width:0;flex:1 1 auto;overflow:hidden}
.gbs2-mobile-title span,.gbs2-mobile-title b{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:100%}
.gbs2-mobile-head .gbs-rail-foot{flex:0 0 auto;width:auto;margin-left:auto;gap:4px;padding-top:0;border-top:0;justify-content:flex-end;flex-wrap:nowrap}
.gbs2-mobile-head .gbs-rail-foot__btn{width:34px;height:34px}
.gbs2-mobile-head .gbs-rail-foot .gb-ember{--ember-size:30px}
```

But current main already has partial title overflow protection:

```css
.gbs2-mobile-title { overflow: hidden; }
.gbs2-mobile-title b,
.gbs2-mobile-title span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
```

Branch also contains scratch artifacts:

```text
_ctx.mjs
_desk.mjs
_fixed768.png
_gill.mjs
_herm.mjs
_shot.mjs
_verify.mjs
```

Verdict: do not merge. Browser-reproduce current Gill legacy mobile first; only then port minimal CSS.

### 3.5 `gill-part1-v16-converge-2026-06-27`

This is important evidence for the unfinished Gill convergence.

Branch report claims Part I migrated from legacy:

```text
gbs2-rail / gbs2-sheet / gbs2-mobile-head
```

to v16-style:

```text
data-gill-v16="part"
gbs-rail
gbs-rail-card
gbs-rail-foot
mobile-bottom-bar
#seriesTocOverlay
#partTocOverlay
```

Current local built marker check showed split-world:

```text
dzhon-gill-istoricheskiy-kontekst dist: v16=2 mobileHead=0 mobBar=2 gbsRail=2 gbs2Rail=0 gbs2Sheet=0 gbs2Thumb=0
dzhon-gill-chast-1-chelovek dist: v16=0 mobileHead=1 mobBar=0 gbsRail=1 gbs2Rail=1 gbs2Sheet=1 gbs2Thumb=1
dzhon-gill-chast-2-uchenyi dist: v16=0 mobileHead=1 mobBar=0 gbsRail=1 gbs2Rail=1 gbs2Sheet=1 gbs2Thumb=1
dzhon-gill-chast-3-nasledie dist: v16=0 mobileHead=1 mobBar=0 gbsRail=1 gbs2Rail=1 gbs2Sheet=1 gbs2Thumb=1
dzhon-gill-spravochnik dist: v16=0 mobileHead=1 mobBar=0 gbsRail=1 gbs2Rail=1 gbs2Sheet=1 gbs2Thumb=1
```

This confirms real unfinished implementation: Gill Context is v16, other Gill pages are legacy.

But raw branch has many conflicts and scratch files:

```text
_cmp.mjs
_ctx.mjs
_desk.mjs
_fixed768.png
_func.mjs
_gill.mjs
_herm.mjs
_p1_desk.png
_p1_mob.png
_p1m.png
_r.mjs
_shot.mjs
_v.mjs
_verify.mjs
```

Verdict: do not merge. Rebuild clean Gill convergence lane from current main, using this branch as reference only.

### 3.6 `karty-avraam-indexable-text-layer-2026-06-26`

Branch says Avraam map text layer expanded `467 → 1163 words`.

Current local main already has large text layer:

```text
src/components/karty/avraam/AvraamMap.astro
words ≈ 1118
```

Conflict exists in same file. Verdict: mostly superseded; manual compare only if content owner asks.

### 3.7 `tts-russian-voice-and-pause-2026-06-27`

Branch goal:

- Russian voice;
- pause click works.

Current local main already has:

```js
pickRuVoice()
u.lang = 'ru-RU'
if (ttsState.voice) u.voice = ttsState.voice
handlePlayClick() on ember click
runId / suppressEnd guards
```

Verdict: superseded. Do not merge; it can regress the stronger race hardening.

---

## 4. Recommended next lanes

### Lane A — Floating guards selective

Scope:

- add/copy `FLOATING_CLUSTER_FORBIDDEN_AND_TRUTHS.md`;
- add unscoped Gill roman numeral safety net;
- run gates.

### Lane B — Gill convergence clean rebuild

Scope:

- do not merge `gill-part1-v16-converge`;
- use it as reference;
- port clean v16 structure for Part I first;
- after owner/browser approval, migrate Part II/III/Spravochnik.

Required invariants:

```bash
for p in dzhon-gill-istoricheskiy-kontekst dzhon-gill-chast-1-chelovek dzhon-gill-chast-2-uchenyi dzhon-gill-chast-3-nasledie dzhon-gill-spravochnik; do
  echo "$p: v16=$(grep -c data-gill-v16 articles/$p/index.html) thumb=$(grep -c gbs2-thumb articles/$p/index.html) foot=$(grep -c gbs-rail-foot articles/$p/index.html)"
done
```

Target after full convergence:

```text
v16 >= 1
thumb = 0
foot >= 1
```

### Lane C — Baptisty content expansion

Separate editorial/content lane. Not PremiumControls.

### Lane D — Avraam manual compare

Only if owner asks; current main is already close.

