# Intake — code-audit — arena-agent — 2026-07-02

## Identity
- Project: code-audit
- Agent: arena-agent
- Date: 2026-07-02
- Audited branch: `main` *(recovered during Pass 90 metadata hygiene)*
- Audited SHA: original 2026-07-02 intake did not record the audited commit; current source HEAD recovered on 2026-07-05 = `6f88ae38ffdb1cd7e9821f28d417b255b4489be7`
- Current source HEAD at start: `6f88ae38ffdb1cd7e9821f28d417b255b4489be7` *(recovery note; original value absent in initial scaffolded intake)*
- Environment: Arena sandbox
- Build mode: source audit
- Browser / device if used: not recorded in original intake

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
