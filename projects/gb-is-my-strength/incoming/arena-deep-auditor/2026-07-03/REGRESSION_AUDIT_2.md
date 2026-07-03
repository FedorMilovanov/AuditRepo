# Регрессионный аудит #2 — 2026-07-03

## Аудитор: Arena Deep Auditor (Pass 23 — Regression Watch)
## Цель: Проверить коммиты исправляющего агента на регрессии и новые баги
## Диапазон: `bba171a..e458581` (4 коммита)

---

## 🔴 P0 — REG-001: `_headers` бесполезен на GitHub Pages

**Файл:** `_headers` (добавлен в `bba171a`)  
**Коммит-сообщение:** "fix(sec+ai+ts): add _headers for HSTS/CSP frame-ancestors NEW-28/29/31/32"

`_headers` — конвенция **Netlify/Cloudflare Pages**. GitHub Pages **полностью игнорирует** этот файл.  
Все заявленные заголовки **НЕ применяются**: HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.

NEW-28/29/31/32 — **ЛОЖНО ЗАЯВЛЕНЫ КАК ИСПРАВЛЕННЫЕ**.

---

## 🟠 P1 — REG-002: Deploy pipeline SPOF

**Файл:** `.github/workflows/deploy.yml` (изменён в `29b49df`)

Убрано `workflow_run.conclusion == 'failure'` → 14 путей (css/**, js/**, articles/**, sw.js и др.) теперь полностью зависят от успешного завершения indexnow.yml. Если indexnow.yml упадёт — деплой заблокирован.

---

## 🟡 P2 — REG-003/004/005

- REG-003: CACHE_VERSION не обновлён после добавления back-to-top.js в PRECACHE_ASSETS
- REG-004: sync check в dist-publication-audit.js глушит ошибки `catch(e){}`
- REG-005: Порядок PRECACHE_ASSETS vs ASSETS расходится

---

## ✅ Подтверждённые исправления (6)

1. P0-FC-REC: addCleanListener рекурсия устранена (`ca6a25a`)
2. P2-TTS-LOCALSTORAGE: try/catch для обоих TTS rate вызовов (`e458581`)
3. P2-VIEWTRANSITION-TARGET: Guard улучшен `(!t.target||t.target==="_self")` (`e458581`)
4. P0-SW-DRIFT content: back-to-top.js в PRECACHE и ASSETS (`e458581`)
5. P1-BACK-TOP: back-to-top.js кэшируется и cache-bust'ится (`e458581`)
6. robots.txt NEW-55: Allow для fonts/images/icons с query (`e458581`)

## ⬇️ Понижение приоритета

- P0-FC-ABORT → P3: IIFE-паттерн корректно пересоздаёт AbortController
