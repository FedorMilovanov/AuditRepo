# Шаблон checkpoint для передачи работающего прототипа другому агенту

Использовать **в конкретной проектной папке** как `AGENT_HANDOFF.md` или обновлять существующий `NEXT-AGENT.md`; не плодить оба, если один уже служит текущей инструкцией.

## Project identity
- Product destination (NOT editable without approval):
- Experiment stable slug and canonical folder:
- Active AuditRepo branch / single PR:
- Latest **verified** source commit SHA:
- Original ZIP/source URL and immutable SHA-256:
- Prototype status: `source-import-pending | imported | lab-active | owner-review | promotion-ready | product-integrated | retired-reference`:
- Owner/editorial/rights hold:

## Source truth — do not guess
- Files/entrypoints actually confirmed on branch:
- Run/install/build/typecheck/test commands and runtime versions:
- Last independent checks, browser/device/viewport and exact SHA:
- Checks **not run** and why:
- Real preview URL (or `NONE`; local URL not public):
- Current known constraints and reproducible failures:

## Continue exactly this implementation
- Current goal and explicitly allowed files:
- Preserve these already-working capabilities:
- Specific next 1–3 engineering actions:
- Feature donor / reference provenance (if any):
- New code/version/PR creation **not** permitted unless exact reason and owner decision:
- Never modify Product/main, other experiments, Research, deploy, or editorial holds without distinct approval.

## Exit criteria this round
- What changed and why; root cause:
- Typecheck/build/unit/browser/visual/accessibility/performance witnesses:
- Exact new SHA and updated links:
- Residual blockers (do not claim total completion if any):
- Next checkpoint:

**FAIL-CLOSED:** If entrypoints are missing, hashes disagree, branch is inaccessible, or another active owner conflicts, do not invent the code or start another unrelated project. Surface the precise blocker and resume only after resolving it.
