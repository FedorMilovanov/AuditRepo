# Intake — chatgpt / 2026-08-19

## Identity

- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: `ChatGPT GPT-5.6 Sol`
- Date: 2026-08-19
- Audited Product anchor: `bcb41e57d7f9c011ac597c51a240fba19152a908`
- Local source snapshot: user-provided `gb-is-my-strength-main (13).zip`, equivalent to Product `d99bd866de090023eac39d1aa648feb63ff45d52` for the owners examined here; `d99bd866… → bcb41e57…` changes only `.github/workflows/notify-on-failure.yml` and `scripts/dist-css-parity-audit.js`.
- AuditRepo base: `6aae4f35a7f308d364f924bc41ea9796e99dd34f`
- Report type: `forensic-audit` / `audit-harness` / `search-representation` / `security-owner-layer`
- Product mutation: none
- MASTER mutation: none

## Files

| File | Role |
|---|---|
| `REPORT.md` | Evidence, root-cause synthesis, collision/currentness boundaries and verifier disposition for two independently reproduced oracle failures. |
| `SECURITY_NOSNIFF_OWNER_LAYER.md` | Standards-grounded challenge to treating `X-Content-Type-Options` as an HTML-head pragma; separates confirmed owner-layer defect from the still-unmeasured live response-header state. |

## One-line outcome

Three forensic results are recorded without opening a Product repair lane: (1) Exact Scripture Search can surface source markup/props/template syntax as supposedly readable occurrence context while both its source contract and browser contract remain green; (2) the historical `SITEWIDE-BTN-TYPE-AUDIT` declared an exhaustive 543-file / 47-instance result even though two missing-type TSX buttons already existed at that exact anchor and were omitted from the claimed complete list; (3) the security model conflates CSP's valid HTML pragma carrier with `X-Content-Type-Options`, which is a response-header property and therefore cannot be closed by unifying page `<head>` markup.

## Collision boundary

Current Product work includes an active `/app/` preview lane that owns `data/scripture-search-index.json`; this intake therefore records evidence only and does not regenerate or repair that generated owner. Concurrent AuditRepo PRs own MASTER/matrix consolidation, so this branch deliberately uses a unique incoming path and does not edit governance rows. The nosniff evidence deliberately stops before declaring a live vulnerability: actual deployed response headers still need an external/network witness.