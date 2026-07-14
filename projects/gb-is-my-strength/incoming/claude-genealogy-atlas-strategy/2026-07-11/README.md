# Intake — gb-is-my-strength — claude-genealogy-atlas-strategy — 2026-07-11

## Identity
- Project: gb-is-my-strength
- Agent: claude-genealogy-atlas-strategy (Claude Code, remote session)
- Date: 2026-07-11
- Audited branch: claude/biblical-genealogy-svg-6l6qb8 (= main на момент клона)
- Audited SHA: 47cdf86b3dc7632362ad4b66d8c4ce22a573568f (47cdf86)
- Current source HEAD at start: 47cdf86
- Environment: Claude Code remote sandbox, Node 22, npm ci OK
- Build mode: plain `astro build` (evidence только по Astro-owned route; strangler-слой не гонялся)
- Browser / device if used: —

## Scope
- Routes checked: /rodosloviye/ (source + dist); karty/konfessii — как интеграционные прецеденты
- Files checked: src/components/genealogy/**, src/components/rodosloviye/**,
  src/pages/rodosloviye/, rodosloviye/index.html, data/genealogy/genealogy.json,
  migration/page-ownership.json, data/route-profiles/rodosloviye.json,
  docs/GENEALOGY-*.md, docs/refactor-2026/lanes/shared-genealogy-multiparent-2026-06-27.md,
  docs/design-references/selected/01_genealogy_references/**, AGENTS.md, README.md
- Systems checked: Astro build/dist emission острова, bundle weights, route
  ownership/matrix/profile, discoverability (входящие ссылки)
- Out of scope: правки source repo (аудит-фаза, имплементации нет);
  репозиторий Research (исключён владельцем)

## Mode
- free-intake, **strategy/foundation audit** (не bug-hunt): владелец запросил
  фундаментальный аудит «как ввести топовый генеалогический SVG-отдел на полную
  Библию (~3 254 персоны) по референсам GPT-image» + внешнее веб-исследование
  (50+ источников) по датасетам/платформам/рендерингу/semantic zoom.
- Прецедент такого intake: `incoming/arena-agent-karty-strategy/2026-07-07/`.

## Files in this folder

- `REPORT.md`      — универсальный рабочий пакет (sections 1-8) + стратегия
- `comments/`      — комментарии к чужим находкам (comment-on-*.md)
- `proposals/`     — предложения статуса/severity/merge/repair (proposal-*.md)
- `evidence/`      — build output, wc -l, grep, JSON-статистика
- `artifacts/`     — веб-исследование (50+ источников)
- `commands.md`    — команды аудита

## Freedom with Evidence

Любой агент свободен: искать баги, подтверждать, оспаривать, предлагать
merge/split/severity/repair-lane, делать recheck на current HEAD.

Но: все действия — evidence-based. Утверждение без SHA и доказательства
не попадает в canonical ledger.

## Status rules

Allowed here: raw, suspected, reproduced-by-agent (L0), peer-reviewed (L1)
NOT allowed here (need verifier): repair-ready, fixed-current, confirmed-current (L2+) without 2+ agents or direct evidence

Стратегические рекомендации в REPORT.md — proposals для владельца, не canonical
решения.

## Proposal statuses

proposal-open → proposal-supported → proposal-accepted (bug moves)
proposal-open → proposal-conflicted → resolved in conflicts/
proposal-open → proposal-rejected
proposal-open → proposal-superseded
