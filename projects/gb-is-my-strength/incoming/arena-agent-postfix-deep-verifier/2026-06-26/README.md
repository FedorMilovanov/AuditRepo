# Intake — gb-is-my-strength — arena-agent-postfix-deep-verifier — 2026-06-26

## Identity
- Project: gb-is-my-strength
- Agent: arena-agent-postfix-deep-verifier
- Date: 2026-06-26
- Audited branch: `main`
- Audited SHA: `106f98d`
- Current source HEAD at start: `106f98d chore: auto-update meta, cache-bust [skip ci]`
- Environment: Arena sandbox; default Node `v20.20.2`, Node 22 through `npx -y node@22`; Playwright Chromium + deps installed during pass for runtime probe
- Build mode: source/static gates + production-like dist already built via Astro Node 22 + `copy-legacy-to-dist.js --omit-build-only` + `astro-cache-bust-postbuild.js` + Pagefind
- Browser / device if used: Playwright Chromium, mobile viewport 390×844 for runtime duplicate-id probe

## Scope
- Routes checked: `/`, Gill article, Hermeneutics, Krajne, Baptisty article, `/karty/avraam/`, `/karty/ishod/`, `/rodosloviye/`
- Files/systems checked: static release gate, dist URL contract, dist JSON-LD parse, content-corruption grep, Baptisty structured data/OG, migration metadata matrix/profile consistency, runtime tooltip IDs after JS hydration
- Out of scope: no source repairs in `gb-is-my-strength`; no direct edit to `verified/` ledger

## Files in this folder
- `REPORT.md` — current post-fix verification and new findings
- `commands.log` — environment and command summary
- `evidence/` — command outputs and focused probes
- `comments/`, `proposals/`, `artifacts/` — reserved; no separate files in this pass

## Notes for verifier
- This intake follows after source repo moved from `02e1a0f` to `106f98d` and AuditRepo validation became green.
- Key nuance: `validate:static-publication:light` is now green, but production-like dist and runtime probes still reveal hidden issues.
