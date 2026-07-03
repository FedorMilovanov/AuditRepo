# Intake — gb-is-my-strength — arena-agent-6 — 2026-06-25

## Identity
- Project: gb-is-my-strength
- Agent: arena-agent-6
- Date: 2026-06-25
- Audited branch:
- Audited SHA:
- Current source HEAD at start:
- Environment:
- Build mode:
- Browser / device if used:

## Scope
- Routes checked:
- Files checked:
- Systems checked:
- Out of scope:

## Files in this folder

- `REPORT.md`      — универсальный рабочий пакет (sections 1-8)
- `comments/`      — комментарии к чужим находкам (comment-on-*.md)
- `proposals/`     — предложения статуса/severity/merge/repair (proposal-*.md)
- `evidence/`      — grep output, logs, трассы
- `artifacts/`     — патчи, сниппеты, скрины
- `commands.log`   — команды аудита

## Freedom with Evidence

Любой агент свободен: искать баги, подтверждать, оспаривать, предлагать
merge/split/severity/repair-lane, делать recheck на current HEAD.

Но: все действия — evidence-based. Утверждение без SHA и доказательства
не попадает в canonical ledger.

## Status rules

Allowed here: raw, suspected, reproduced-by-agent (L0), peer-reviewed (L1)
NOT allowed here (need verifier): repair-ready, fixed-current, confirmed-current (L2+) without 2+ agents or direct evidence

## Proposal statuses

proposal-open → proposal-supported → proposal-accepted (bug moves)
proposal-open → proposal-conflicted → resolved in conflicts/
proposal-open → proposal-rejected
proposal-open → proposal-superseded
