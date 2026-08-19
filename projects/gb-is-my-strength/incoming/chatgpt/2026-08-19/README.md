# Intake — chatgpt / 2026-08-19

## Identity

- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: `ChatGPT GPT-5.6 Sol`
- Date: 2026-08-19
- Audited Product anchor: `bcb41e57d7f9c011ac597c51a240fba19152a908`
- Local source snapshot: user-provided `gb-is-my-strength-main (13).zip`, equivalent to Product `d99bd866de090023eac39d1aa648feb63ff45d52` for the owners examined here; `d99bd866… → bcb41e57…` changes only `.github/workflows/notify-on-failure.yml` and `scripts/dist-css-parity-audit.js`.
- AuditRepo base: `6aae4f35a7f308d364f924bc41ea9796e99dd34f`
- Report type: `forensic-audit` / `audit-harness` / `search-representation`
- Product mutation: none
- MASTER mutation: none

## Files

| File | Role |
|---|---|
| `REPORT.md` | Evidence, root-cause synthesis, collision/currentness boundaries and verifier disposition for two independently reproduced oracle failures. |

## One-line outcome

Two material evidence-integrity findings are recorded without opening a Product repair lane: (1) Exact Scripture Search can surface source markup/props/template syntax as supposedly readable occurrence context while both its source contract and browser contract remain green; (2) the historical `SITEWIDE-BTN-TYPE-AUDIT` declared an exhaustive 543-file / 47-instance result even though two missing-type TSX buttons already existed at that exact anchor and were omitted from the claimed complete list.

## Collision boundary

Current Product work includes an active `/app/` preview lane that owns `data/scripture-search-index.json`; this intake therefore records evidence only and does not regenerate or repair that generated owner. Concurrent AuditRepo PRs own MASTER/matrix consolidation, so this branch deliberately uses a unique incoming path and does not edit governance rows.