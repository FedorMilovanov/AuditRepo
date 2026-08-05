# CURRENT_HEAD_REVERIFY_2026-08-05_d0647b71_favorite-store-d22.md

**Тип:** self-audit reverify (проверка собственного аудита + регрессия D-22)
**Source anchor:** `d0647b71b557c17e408c09712fcd8c3ab05ba257` (PR #1061 canonical Favorite Store)
**AuditRepo ветка:** `arena/019fd2bb-auditrepo` (открыта)

---

## 1. Что проверялось

После того как PR #1061 переписал `Favorites.astro`, `izbrannoe/index.astro` и добавил `src/runtime/favorite-store.js`, перепроверен **закрытый D-22** (href/image-guard против XSS-схем), т.к. оба файла — те самые, где D-22 был закрыт ранее.

## 2. Результаты

### 2.1. href-часть D-22 — СОХРАНЕНА ✅

`normalizePath` (favorite-store.js:28-37):
- `new URL(value, origin)` + `url.origin !== location.origin → ''` — блокирует `javascript:`, `data:`, `vbscript:`, `//evil`, `https://evil`.
- Протестировано Node: все XSS-векторы → `''` (блок).

### 2.2. image-часть D-22 — ДРЕЙФ ❌

`normalizeImage` (favorite-store.js:40-50):
```js
const url = new URL(raw, location.origin);
if (!/^https?:$/.test(url.protocol)) return '';
return url.href;
```
- Проверяет **только protocol**, НЕ origin.
- `//evil.com/x.png` → protocol `https:` → **PASS** (в backgroundImage).
- `https://evil.com/x.png` → **PASS**.
- Старый D-22 guard (`/^\/(?!\/)/` + protocol-allowlist) требовал **только same-origin `/...`**.
- **Противоречит заявлению PR #1061** «fail-closed legacy image migration ... clears unsafe values».

**Severity:** не XSS (background-image не исполняет JS), но: (1) утечка data-exfiltration-вектор (внешний URL в `background-image:url(...)` при рендере), (2) дрейф от зафиксированного D-22-контракта, (3) PR-описание обещает fail-closed, которого нет.

**Рекомендация:** добавить `url.origin === location.origin` в `normalizeImage` (1 строка) — вернёт D-22-контракт.

## 3. Что ещё нашлось (self-audit собственных отчётов)

| Утверждение в моих отчётах | Перепроверка | Вердикт |
|---|---|---|
| BUG-PERF-001 = 368/31 | **369/31** | ❌ +1 (обновить) |
| CI-WORKFLOW-PROLIFERATION = 50 | **51** (favorite-store.yml) | ❌ +1 (обновить) |
| AR-IDX-05 = «3 версии SITE_CONFIG.version» | верно (10+11+2); «version:1» ×20 — JSON-LD, не SITE_CONFIG | ✅ верно |
| home-sacred «фича мертва» | **ложный FAIL** — фича жива как h-ambient-*; мёртв legacy .h-phrase* CSS | ❌ исправлено v7 |
| D-19 обе половины | верно | ✅ |
| QUAL-P1-03 = 330 | верно (только N:N-N) | ✅ |

## 4. Итог

- **D-22 image-часть дрейфнула** при #1061 — реальная находка, внести в матрицу как «PARTIAL/REGRESSED» (href ок, image требует same-origin).
- Собственные счётчики обновить: BUG-PERF-001 369/31, workflows 51.
- Остальные утверждения подтверждены.

*Документ — untracked; будет добавлен в ветку коммитом.*
