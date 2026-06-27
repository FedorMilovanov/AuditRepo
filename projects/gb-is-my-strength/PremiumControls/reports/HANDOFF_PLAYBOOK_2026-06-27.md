# PremiumControls handoff playbook — что делать следующему агенту

**Дата:** 2026-06-27  
**Назначение:** дать другому агенту понятный, безопасный, под-ключ план без batch merge и без визуального бульдозера.

---

## 1. Текущее состояние source repo после хирургической правки

Ожидаемый `main` после push:

```text
b63b9f29 merge: PremiumControls surgical finish — TTS race + speed pill geometry
23eac1ca [LANE lane/premiumcontrols-surgical-finish-2026-06-27] fix(premiumcontrols): harden TTS race + speed pill geometry
251649fc chore: auto-update meta, cache-bust [skip ci]
```

Ключевые файлы:

```text
js/floating-cluster-controller.js
css/floating-cluster.css
package.json
docs/refactor-2026/lanes/premiumcontrols-surgical-finish-2026-06-27.md
```

---

## 2. Запрещено

1. Не делать `git merge origin/lane/*` пачкой.
2. Не raw-merge `tts-russian-voice-and-pause`; он старее и слабее текущих TTS guards.
3. Не raw-merge `gill-part1-v16-converge`; он ценный как reference, но грязный как branch.
4. Не переписывать `floating-cluster-controller.js` в модули в том же лейне, где чинится визуал/TTS.
5. Не двигать `.gb-floater--hermeneutics` и Gill geometry без owner-approved reference + browser evidence.
6. Не писать inline `style.transform` для `.gb-ember-expand`; CSS владеет геометрией, JS даёт только `--gb-ember-shift`.

---

## 3. Быстрый recheck после pull

```bash
cd gb-is-my-strength
git pull --ff-only origin main
node --check js/floating-cluster-controller.js
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run audit:premium-controls
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run owner:ui-guard
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run validate:static-publication
```

Если Node 22 нет:

```bash
curl -fsSL https://nodejs.org/dist/v22.12.0/node-v22.12.0-linux-x64.tar.xz -o /tmp/node-v22.12.0-linux-x64.tar.xz
tar -C /tmp -xf /tmp/node-v22.12.0-linux-x64.tar.xz
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH node -v
```

---

## 4. Следующий безопасный лейн: selective floating-cluster guards

### 4.1 Создать ветку

```bash
git checkout main
git pull --ff-only origin main
git checkout -b lane/floating-cluster-guards-selective-2026-06-27
```

### 4.2 Перенести doc

```bash
git show origin/lane/floating-cluster-guards-2026-06-27:docs/refactor-2026/FLOATING_CLUSTER_FORBIDDEN_AND_TRUTHS.md \
  > docs/refactor-2026/FLOATING_CLUSTER_FORBIDDEN_AND_TRUTHS.md
```

### 4.3 Добавить CSS safety net

В `css/floating-cluster.css` рядом с Gill/v16 numeral styles добавить:

```css
/* =========================================================
   GILL-C SAFETY NET — roman numerals must NEVER inherit link blue.
   If a built page is missing the [data-gill-v16] attr (build desync),
   scoped gold rules do not apply and numerals can fall back to --color-link.
   This unscoped but Gill-specific fallback prevents that.
   ========================================================= */
.gbs-rail-card__num,
.toc-item__num,
.toc-part-item__num {
  color: var(--color-accent-gold, #b8936a);
}
```

### 4.4 Проверки

```bash
npm run cache-bust
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run strangler:build:production-like
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run audit:premium-controls
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run owner:ui-guard
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run validate:static-publication
git diff --check
```

### 4.5 Commit

Поскольку `css/floating-cluster.css` shared/system file, commit message обязан иметь `[LANE ...]`:

```bash
git add css/floating-cluster.css docs/refactor-2026/FLOATING_CLUSTER_FORBIDDEN_AND_TRUTHS.md
# plus cache-bust changed files
git add -u
git commit -m "[LANE lane/floating-cluster-guards-selective-2026-06-27] guard(floating-cluster): preserve Gill numeral safety rules"
```

---

## 5. Gill convergence: clean rebuild plan

### 5.1 Почему это нужно

Current marker split:

```text
Gill Context: data-gill-v16 present, mobile-bottom-bar present, gbs2 legacy absent
Gill Part I/II/III/Spravochnik: data-gill-v16 absent, gbs2-mobile-head/sheet/thumb present
```

Это не PremiumControls TTS bug, а отдельная недоделанная миграция Gill family.

### 5.2 Почему нельзя raw-merge old branch

`origin/lane/gill-part1-v16-converge-2026-06-27`:

- only Part I migrated;
- stacked on older mobile-head branch;
- has many conflicts;
- has scratch `.mjs` and `.png` files;
- can overwrite newer cache-bust/TTS/speed-pill hardening.

### 5.3 Правильный план

```bash
git checkout main
git pull --ff-only origin main
git checkout -b lane/gill-v16-convergence-part1-clean-2026-06-27
```

Use as reference only:

```bash
git show origin/lane/gill-part1-v16-converge-2026-06-27:src/components/article-pilots/gill-part1/GillPart1PageChrome.astro > /tmp/old-gill-part1-reference.astro
```

Port manually into current `src/components/article-pilots/gill-part1/GillPart1PageChrome.astro`:

```text
data-gill-v16="part"
gbs-rail
gbs-rail-card
gbs-rail-foot
mobile-bottom-bar
#seriesTocOverlay
#partTocOverlay
```

Do not include:

```text
gbs2-thumb
legacy gbs2-mobile-head
scratch scripts/screenshots
```

After Part I:

```bash
npm run cache-bust
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run strangler:build:production-like
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run owner:ui-guard
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run audit:premium-controls
PATH=/tmp/node-v22.12.0-linux-x64/bin:$PATH npm run validate:static-publication
```

Browser-smoke required:

- desktop rail sticky/persistent;
- roman numerals gold, not link-blue;
- no images in TOC;
- mobile bottom bar visible/fixed;
- Play/Speed opens upward and remains clickable;
- Save works;
- no horizontal overflow.

Only after owner approval repeat for Part II/III/Spravochnik.

---

## 6. TTS regression test snippet for future agents

A minimal browser stub should assert:

```js
window.speechSynthesis = {
  q: [],
  cancelCount: 0,
  getVoices(){ return [{ name: 'Google русский', lang: 'ru-RU', localService: false }]; },
  speak(u){ this.q.push(u); },
  cancel(){ this.cancelCount += 1; }
};
```

Assertions:

```text
click Play -> ember data-state = playing
utterance.lang = ru-RU
utterance.voice.lang = ru-RU
click speed 1.75x -> localStorage gb:audio:rate = 1.75
click speed 1.75x -> localStorage gbx-tts-rate = 1.75
rate change while playing -> cancelCount increments, queue restarts current chunk once
pause -> cancelCount increments, chunkIdx must not advance from synthetic onend
```

---

## 7. Known warnings not solved by PremiumControls lane

These are still outside the lane:

```text
css/floating-cluster.css nonstandard breakpoints: 960px, 500px, 420px
20-antisovetov-pastoru title != og:title
rimlyanam-7-veruyushchiy-ili-neveruyushchiy title != og:title
/izbrannoe/ missing route-migration-matrix/search-manifest entries
```

Do not hide these warnings as PremiumControls success/fail. They are separate cleanup lanes.
