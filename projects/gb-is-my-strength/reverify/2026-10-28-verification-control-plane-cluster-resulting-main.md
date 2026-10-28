# Широкая волна 8 — truthfulness verification control plane

**Дата:** 2026-10-28  
**Product resulting main:** `d056a19cfabe84dc2dbc59fc37ff4b03288917f1`  
**Режим:** read-only SYSTEM reverify; Product не изменялся  
**Кластер:** release auditor, TTS source contract/CI propagation, typograf drift, head asset projection, dependency lifecycle, CSS cascade governance.

## 1. База и owner routing

Перед прогонами повторно проверены Product `AGENTS.md`, `AGENTS-REFERENCE.md` и SYSTEM routing. Единственный открытый Product PR #2211 меняет только genealogy v2 data/config и не пересекается с шестью владельцами. Ранее блокировавший workflow-файл PR #2179 закрыт без merge 2026-10-28, поэтому прежняя lane-collision причина для отсутствующего `pipefail` больше не действует.

На exact HEAD уже прошли `npm run validate` и `npm run strangler:build:production-like`: 108 final HTML, 72 approved metadata records, 0 blocked. Все destructive controls выполнялись только над disposable `dist` и были восстановлены; `git status` Product остался clean.

## 2. `SYS-AUDIT-PRO-LLMS-ROOT-RESOLUTION` — `FIXED-CURRENT`

Текущий `llmsTxtSanityGuard` сначала разрешает путь против `dist/`, затем против root legacy fallback. Полный `node scripts/audit-pro.js` завершился exit 0 и сообщил:

> `llms.txt: all 55 referenced URLs exist and are indexable`

Старые постоянные warnings для двух Astro-native статей отсутствуют. Отрицательный контроль был настоящим: `dist/articles/anatomiya-padeniya-pyat-stadiy/index.html` временно убран, после чего тот же guard вернул точный warning `file not on disk in dist or root`; файл восстановлен trap-ом. Значит, repaired owner отличает native publication от реального отсутствия и не просто подавляет warning. Строка удаляется из активной матрицы.

Важно: весь `audit-pro` остаётся warning-oriented в ряде других областей, но это не продлевает именно llms-root row и не превращается в новый umbrella defect.

## 3. `SYS-TTS-ORT-PATH-CONTRACT-FALSE-RED` — сужено

Прямой `node scripts/tts-ort-worker-path-contract.js` теперь проходит и структурно отклоняет три adversarial mutations. Current implementation:

- сканирует все `wasmPaths` assignments независимо от whitespace;
- требует ровно одно присваивание `ORT_DIST`;
- проверяет порядок после ORT import и до session creation;
- каждая mutation сначала доказывает, что реально изменила source.

Следовательно, исходный false-red и silent no-op fixture исправлены.

CI propagation остаётся false-green: строки 113–114 workflow всё ещё используют `node … | tee …`, а `set -o pipefail` начинается только ниже. Shell control подтвердил `false | tee` → exit 0 без pipefail и exit 1 с pipefail. Историческая причина отката — overlap с #2179 — больше не актуальна, потому что #2179 закрыт. Row сохраняется, но только как workflow exit-propagation residual; runtime path semantics и direct contract больше не обвиняются.

## 4. `SYS-MATERIAL-TYPOGRAPHY-GATE-FAILOPEN` — подтверждён

`npm run typograf:dry` снова назвал ровно шесть retained HTML owners и напечатал `Would change: 6 files`, но завершился exit 0:

- Antisovetov;
- Gill II;
- Gill III;
- Hermenevtika;
- Kod da Vinchi;
- Krajne.

Значит, зелёный check по-прежнему не означает typographic cleanliness. Граница не расширялась: требуется strict drift exit и source-owner repair; generated-only rewrite остаётся недопустимым.

## 5. `SYS-HEAD-ASSET-PROJECTION-PROLIFERATION` — подтверждён

Source census на current exact head:

- 576 `.astro` files;
- 81 files / 493 hardcoded governed `?v=<hash>` literals;
- 70 files / 171 production-pinned common-resource references;
- `assetUrl()` остаётся редким относительно fan-out owner.

Final corpus: 108 HTML; 106 содержат hardcoded revision references (1 802 occurrences), 104 — production common-resource references (227 occurrences). Native Chromium 153 проверил `/about/` desktop Light и Krajne mobile Dark/reduced-motion:

- favicon/apple-touch/icon requests локальны;
- feed остаётся `https://gospod-bog.ru/feed.xml`;
- manifest остаётся `https://gospod-bog.ru/manifest.json`;
- Axe 0, broken images 0, page errors 0;
- единственный request failure — отфильтрованный sandbox egress к Yandex.

То есть ранее исправленная local icon часть сохранена, а единый common-head projection owner всё ещё отсутствует.

## 6. `SYS-DEPENDENCY-ADVISORY-LIFECYCLE` — расширен текущим advisory state

Fresh `npm audit --json` возвращает exit 1 и одну direct Astro package vulnerability record с двумя advisories:

- `GHSA-98hj-9722-w3j8`, moderate, Astro `<7.3.2`;
- `GHSA-mpr7-6m5w-76rw`, low, Astro `7.1.0–7.3.2`.

Итог npm: 1 moderate package, 0 high/critical; suggested fix — Astro 7.4.1. Current `npm-security-contract.mjs` честно завершился non-zero, поэтому detection на запускаемом workflow не false-green. Но `dependency-security.yml` по-прежнему имеет только PR/push path filters и manual dispatch, без `schedule`; unchanged-main advisory drift невидим. Ни fix, ни dated acceptance/reason/expiry для двух current advisories не найдены. #2179 закрыт и больше не является workflow collision owner. Row остаётся одним lifecycle owner, без создания второго defect на новый advisory.

## 7. `SYS-CSS-CASCADE-GOVERNANCE-NONENFORCING` — подтверждён

`npm run css:layer:validate` завершился exit 0 и трижды сообщил `VALIDATION PASSED`, несмотря на предупреждения ниже заявленной цели 80%:

| Root | Layered | `!important` | Ceiling |
|---|---:|---:|---|
| `home.css` | 35.4% | 52 | отсутствует |
| `floating-cluster.css` | 9.9% | 524 | 524 |
| `site.css` | 18.8% | 200 | 200 |

Синтаксическая и anti-growth часть guard полезна, но target completion всё ещё advisory. Row не поглощает UI-дефекты и не делает performance claim.

## 8. Browser/no-JS/print границы

В этой волне закрывается только audit-path resolution, а не визуальный дефект. Тем не менее current head projection проверен native browser в desktop/mobile, Light/Dark/reduced motion с screenshots вне Git, Axe, LCP/CLS, broken images и request failures. Head links являются статической HTML-проекцией и одинаково доступны без JS; отдельная no-JS мутация поведения не требуется. Print не участвует в исполнении release/CI gates и не заявляется closure surface.

## 9. Reconciliation

- `SYS-AUDIT-PRO-LLMS-ROOT-RESOLUTION` удалён как `FIXED-CURRENT`.
- `SYS-TTS-ORT-PATH-CONTRACT-FALSE-RED` сужен до CI pipeline propagation.
- Typography, head projection и CSS governance подтверждены без дублирования.
- Dependency lifecycle обновлён двумя current Astro advisories и снятой #2179 collision-причиной.

Арифметика: **70 → 69 active units**, verified improvements **8 → 7**; direct/residual/systems остаются **43/1/18**. Product не мутировался.
