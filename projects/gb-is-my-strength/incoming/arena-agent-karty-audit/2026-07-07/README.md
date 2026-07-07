# Intake — gb-is-my-strength — arena-agent-karty-audit — 2026-07-07

## Identity
- Project: gb-is-my-strength
- Agent: arena-agent-karty-audit (independent Arena Agent, owner: Фёдор Милованов)
- Date: 2026-07-07
- Audited branch: `main`
- Audited SHA: `75f807b73aea28281ff132794c38d8a937cc9cfa` (на проде, run `28829729903` — production deploy per `auditrepo/verified/START_HERE.md` + `verified/MASTER_BUG_MATRIX.md`)
- Previous verified HEAD: `14a49be8` (per `auditrepo/verified/SUPER_AUDIT_2026-07-06_14a49be8.md`)
- Environment: E2B / Firecracker microVM, Debian 13 trixie, 2 vCPU / 2 GB RAM, Node 22.12.0 (per `auditrepo/SANDBOX-ENV-2026-06-21.md`)
- Build mode: **source only** (audit-only, no dist built, no Playwright run — out of scope per agent `audit_only` mode)
- Browser / device if used: **none** (read-only static analysis; no live visual QA)
- Report type: **source-audit** (per `projects/gb-is-my-strength/PROJECT_META.yml` `allowed_report_types`)

## Scope
- Routes checked: `karty/` (10 маршрутов + `_engine/` + `_shared/` + `index.html`)
  - `karty/avraam/`, `karty/ishod/`, `karty/early-church/`, `karty/maccabim/`,
    `karty/melachim/`, `karty/pavel/`, `karty/revelation/`,
    `karty/shoftim/`, `karty/shvatim/`, `karty/yeshua/`
  - `karty/_engine/` (universal map engine: `map-engine.js` v0.52.0, `base-geo.svg`)
  - `karty/_shared/` (contract: `route.schema.json`, `README.md`)
- Files checked: 16 base files + 30+ JS subfiles (see `evidence/file-inventory.txt`)
- Systems checked: source-tree, JSON schema, route data integrity, route.json vs schema,
  event listener lifecycle, memory leak surface, global pollution, CSP, SEO/JSON-LD headers,
  unique-IDs/uniqueness, dependency footprint, references/atlas registry
- Out of scope (per `audit_only` mode and SANDBOX constraints):
  - live Playwright/browser render of any karty route
  - dist build (`strangler:build:production-like`)
  - mutation of any file in `gb-is-my-strength` repo
  - `PremiumControls` / Gill UI (in-flight, frozen — per `START_HERE.md:3` and `SUPER_AUDIT §4`)
  - глоссарий (glossary, in-flight, frozen per W5)
  - Bible-хранилище (frozen per W6)
  - gsap / DrawSVG / MotionPath (only consumed by avraam, audit-only)

## Files in this folder

- `REPORT.md` — универсальный 8-секционный отчёт (findings, confirmations, challenges, merge proposals, severity proposals, repair lane, reverify, notes for verifier)
- `KARTY_AUDIT_2026-07-07.md` — полный сводный отчёт (TL;DR, состояние karty/, реестр атласов, 16 пронумерованных находок, карта рефакторинга, метрики, рекомендации)
- `comments/` — комментарии к существующим багам:
  - `comment-on-BUG-SITEMAP-8-KARTY-MISSING.md` — наблюдение: 8 заглушек это P1, не «намеренный noindex» (дискуссия)
  - `comment-on-MAP-01.md` — подтверждение с дополнительными доказательствами
  - `comment-on-VALIDATE-SCOPE-GAP.md` — расширение на karty/
  - `comment-on-SHADOW-AUDIT-NARROW.md` — karty/ в shadow-audit
- `proposals/` — 16 proposal'ов:
  - `proposal-KARTY-01..KARTY-16.md` — каждая находка с severity + repair lane
- `evidence/` — доказательная база:
  - `file-inventory.txt` — что проверял
  - `route-json-keys.txt` — что фактически в каждом route.json vs схема
  - `karty-html-scripts.txt` — какие <script src> подключены
  - `event-listeners.txt` — addEventListener/removeEventListener счётчики
  - `map-engine-public-api.txt` — что экспортирует map-engine.js
  - `avraam-app-engine-fallbacks.txt` — где avraam-app.js дублирует engine
  - `archaeology-references.txt` — реестр атласов
- `artifacts/` — нет (audit-only, никаких патчей)
- `commands.log` — все команды, которыми получены доказательства

## Freedom with Evidence

Согласно `CONTRIBUTING.md`, любой агент свободен искать, подтверждать, оспаривать, предлагать.
Все assertions в этом intake — **evidence-based** (file:line + SHA в каждом блоке).

## Status

- 16 NEW findings proposed (KARTY-01..KARTY-16)
- 2 confirmations of existing findings (MAP-01, BUG-SITEMAP-8-KARTY-MISSING)
- 0 challenges (no dispute with current verified)
- 0 merge proposals (все находки уникальны)
- 16 severity proposals (1×P1, 9×P2, 6×P3, 1×info)
- 1 repair-lane proposal (W9 MapEngine refactor, sub-lane: «avraam → engine migration»)

## Owner decisions required

См. `KARTY_AUDIT_2026-07-07.md` §7.2 — список из 9 действий, 3 из них требуют решения владельца
(visual QA, YEC-logic fix, экспертиза по arch_categories).

## Out of repo: NOT DONE

- Не пушил в `gb-is-my-strength` (audit-only режим)
- Не правил `MASTER_BUG_MATRIX.md` (это verifier'ская зона, см. `CONTRIBUTING.md` — синтез в `working/`, не в `incoming/`)
- Не запускал Playwright
