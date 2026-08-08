# CURRENT_HEAD REVERIFY — Content Parity Loss on Astro-Native Routes (found + fix prepared)

**Verifier:** Claude (session claude/image-generation-query-3e8rd5)
**Date:** 2026-07-05
**Source HEAD:** `68b2bf4c` (Merge PR #32)
**Method:** SHA-first; full-history forensics (`git fetch --unshallow`, 1867 commits); word-multiset text parity (legacy HTML ↔ Astro sources); dist build verification.

---

## 1. NEW FINDING — CONTENT-PARITY-LOSS-01 (P1, fix prepared)

**Владелец просил проверить потери контента из-за действий агентов. Подтверждено: контент терялся на 2 production-маршрутах.**

### Root cause chain

1. `2026-06-23` — маршруты `/nagornaya/seriya/` и `/konfessii/russkij-baptizm/` переведены на **100% native Astro** (page-ownership: `owner: astro`, `status: production-dist`).
2. `2026-06-25` — коммит `e0e83598` (`lane/seo-audit-2026-06-25`, «fix(seo): thin-content — prose blocks + noindex») добавил SEO-прозу в **legacy** root HTML этих маршрутов — **через 2 дня после cutover**, т.е. в мёртвую (shadow) поверхность.
3. Ни один гейт не сравнивает **текст** legacy ↔ Astro для native-маршрутов (visual-parity проверяет маркеры/forbidden-токены, не контент) → потеря невидима для CI.

### Evidence (word-multiset diff, Russian words ≥3 chars)

| Route | Added by e0e83598 | Missing in ALL of src/ (до фикса) |
|---|---|---|
| `/nagornaya/seriya/` | 170 слов («О серии»: интро серии, методология TMS/Chicago + источники MacArthur/Thomas&Farnell/Warfield/Чау, аннотации «Что исследуется в каждой части» I–V, ссылки istochniki/nakhodki) | **81** |
| `/konfessii/russkij-baptizm/` | 101 слово («Три истока русского баптизма»: Тифлис 1867 / Юж. Украина 1864–69 / Петербург 1874, ВСЕХБ 1944) | **88** |
| `/map/` | 126 слов («Тематические кластеры») | 0 — портировано в `MapBody.astro` ✅ |
| `/rodosloviye/` | ~0 (noindex-твик) | 0 ✅ |

Все остальные nagornaya-маршруты (chast-1..5, istochniki, nakhodki) — **0 пропавших слов** против `pre-astro-refactor-baseline-2026-06-14`. Потерь в главах серии НЕТ; потеря была только в hub-странице seriya + konfessii/russkij-baptizm.

### Fix prepared (commit `d2f34a66`, branch `claude/image-generation-query-3e8rd5`)

- `NagornayaSeriyaBody.astro`: блок «О серии» восстановлен в дизайн-системе `h-*` (theme-aware токены `--h-ink/--h-muted/--h-accent`), вставлен после SERIES STATS внутри `main`.
- `Baptizm3DBody.astro`: блок «Три истока» восстановлен 1:1 (страница по дизайну имеет изолированные inline-стили).
- Re-verify: 0 missing words на обоих маршрутах; `audit-pro` 165 passed / 0 errors (после cache-bust regen); `astro build` 53 pages, блоки присутствуют в dist.

**⚠️ Push blocked:** session has no write access (git-proxy 403 + GitHub App «Resource not accessible by integration»). Коммит существует локально в workspace; требуется восстановление push-доступа или перенос патча.

---

## 2. NEW FINDING — GATE-GAP-NATIVE-TEXT-PARITY (P2)

Для native-маршрутов нет текстового parity-гейта legacy↔Astro (и после удаления legacy — нет baseline-гейта на непреднамеренное удаление контента). Именно поэтому CONTENT-PARITY-LOSS-01 прожил 10 дней незамеченным. Рекомендация: word-coverage гейт (скрипт по образцу этого reverify: word-multiset legacy/baseline ↔ dist), warn при >2% потерь, bad при >10%.

## 3. NEW FINDING — CACHE-BUST-STALE-MAIN (P2, process; самолечится)

На текущем `main` (`68b2bf4c`) — **26 cache-bust mismatch ошибок** в `audit-pro` на чистом checkout: HTML ссылается на `floating-cluster-controller.js?v=1559278a`, актуальный хеш `024540c5`.

Причинная цепочка: PR #31 изменил `js/floating-cluster-controller.js` → indexnow.yml сработал, но упал на path-leak гейте (самоинфликтированный регресс `96959c9`) → его авто-коммит `chore: auto-update meta, cache-bust` не состоялся → фикс path-leak (PR #32) был docs-only и indexnow не перезапустил → ручной deploy прошёл (deploy.yml гоняет собственный cache-bust) → **прод корректен, но repo main рассинхронен**; локальный audit-pro красный у всех агентов. Самолечится первым же пушем в main по content-путям. Урок для процесса: после падения indexnow-гейта нужно re-dispatch indexnow (не только deploy), иначе auto-commit-слой пропадает.

## 4. DISPUTE RESOLUTION — P1-DEPLOY-FAIL is FIXED-CURRENT (false reopen)

`working/VERIFIER_SYNTHESIS` и intake `arena-agent-verifier-hardening-2026-07-05` считали баг reopened по grep-хиту `conclusion == 'failure'` в deploy.yml. **Reachability-анализ на `68b2bf4c`:** job-level `if:` (deploy.yml:62-65) пускает job только при `workflow_dispatch || push || conclusion=='success'` → при failure job скипается целиком; клауза `=='failure'` живёт в warn-шаге (строки 72-75), который **недостижим** (dead code) и несёт вводящий в заблуждение текст «Deploying anyway». Матрица права (закрыт `29b49df`). Новый P3: **DEPLOY-YML-DEAD-WARN-STEP** — удалить мёртвый шаг, чтобы прекратить grep-ложноположительные reopen'ы.

## 5. SEVERITY RESOLUTION — BUG-SW-BASELINE-DRIFT = P2 (подтверждаю)

`sw.js` = `gb-v187`, baseline = `gb-v182`. `sw-dist-readiness-audit.js:82-86` энфорсит только «≠ pre-switch v171»; несовпадение с `currentExpectedCacheVersion` даёт `note()` (строки 88-89), не `bad()`. Это документационный drift + двухстрочный фикс гейта (bump baseline до v187 + равенство под `--require-cache-bump`), не deploy-риск уровня P0.
