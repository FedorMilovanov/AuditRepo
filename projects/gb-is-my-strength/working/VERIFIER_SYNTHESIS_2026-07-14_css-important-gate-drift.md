# Verifier Synthesis — CSS `!important` gate drift + release-contract break

## Meta
- **Date:** 2026-07-14
- **Verifier:** claude-auditor (Claude Code multi-agent session)
- **Project:** gb-is-my-strength (gospod-bog.ru)
- **Source repo:** `FedorMilovanov/gb-is-my-strength`
- **Current HEAD:** `bd8cb9a0` (authoritative `git ls-remote origin main`)
- **Evidence:** `reverify/CURRENT_HEAD_REVERIFY_2026-07-14_bd8cb9a0_css-important-gate-drift.md`;
  `incoming/gpt-css-important-audit/2026-07-14/evidence/verifier-witnesses.md`

## Inputs reviewed

| Agent | Path | Audited SHA | Scope | Findings | Confirmations | Challenges | Proposals |
|-------|------|-------------|-------|----------|---------------|------------|-----------|
| gpt-css-important-audit | `incoming/gpt-css-important-audit/2026-07-14/REPORT.md` | `bd8cb9a0` | CSS `!important` + grammar + CI | 4 major | — | — (report-only) | matrix-update §13 |
| claude-auditor (this) | reverify + synthesis | `bd8cb9a0` | verify + extend | +5 verifier-new | 12 of GPT | 1 (CSS≠sole cause: upheld) | canonical update |

---

## Bug Canonicalization

### New findings → canonical IDs
| Temp ID | Canonical ID | Title | Severity | Verification level |
|---------|--------------|-------|----------|-------------------|
| GPT P1 | `P1-CSS-IMPORTANT-GATE-DRIFT` | `site.css` 210 `!important` > 202/200 → deploy red | P1 | L3 confirmed-current (source+build+CI) |
| verifier-new | `P1-EDITORIAL-METADATA-REGISTRY-GAP` | 5 article routes missing in `editorial-metadata.json` → Metadata workflow red | P1 | L3 confirmed-current (source+CI) |
| verifier-new | `P1-NAGORNAYA-JS-UNREGISTERED` | `nagornaya-bar-extras.js` not in `ALLOWED_JS`/`cache-bust-assets` (latent deploy-blocker) | P1 (latent) | L3 confirmed-current (source+build) |
| GPT §7 | `P2-CSS-SYNTAX-SITECSS` | 4 grammar errors + 1 corrupted selector pass brace-only validator | P2 | L3 confirmed-current (source, ×5 patterns) |
| GPT §1 | `P2-SSOT-DRIFT-2026-07-14` | matrix HEAD `b8459bdf` non-existent; masthead «Deploy GREEN» false | P2 | L3 confirmed-current (`git cat-file`, CI) |
| GPT §9 | `P3-CSS-DUP-CLEANUP` | 2 full dups + nested `var()` + empty `html.dark` (1 safe ratchet-down) | P3 | L3 confirmed-current (source) |

### Confirmations incorporated
| Finding | Confirmed by | Evidence | Status |
|---------|-------------|---------|--------|
| site.css=210, ceilings 202/200 | verifier | node counts + code lines | confirmed-current |
| floating-cluster count | verifier (GPT left open) | **503** via 3 methods | **newly resolved** |
| deploy red = CSS gate | verifier | real failing job log run 29281815427 | confirmed-current |
| 5 grammar defects | verifier | direct pattern-search ×5 | confirmed-current |
| dups / var() / empty block | verifier | grep counts | confirmed-current |

---

## Evidence Merge
- **Weak + strong combined:** GPT's logical prediction of deploy failure → upgraded to **CI ground-truth**
  (actual failed `deploy` job log shows the exact `css:layer:validate` error + exit 1).
- **Cross-angle corroboration:** source (`grep`/counts) + build (in-repo gate exit 1) + CI (GitHub run logs) +
  history (git log root-cause) — 4 witness angles converge → L3 `confirmed-current`.

## Challenge Resolution
| Challenge | Resolution | Evidence |
|-----------|-----------|---------|
| «CSS — единственная причина деплоя красным» | **partially refuted** (upholds GPT's own caution) | Metadata workflow fails on editorial-metadata registry, independent of CSS |
| matrix «Deploy GREEN @ b8459bdf» | **refuted** | `b8459bdf` not a valid git object; current main RED |

## Duplicate / Merge Decisions
| Finding A | Finding B | Decision | Canonical |
|-----------|-----------|---------|-----------|
| GPT «extend D-2» | existing `D-2` | **merge** — add grammar witnesses to D-2; keep P2-CSS-SYNTAX-SITECSS as the concrete-defect line | D-2 + P2-CSS-SYNTAX-SITECSS |
| `P1-NAGORNAYA-JS-UNREGISTERED` | `GATE-MARKER-DATA-DRIFT` (P3) | **relate, not merge** — this is a live deploy-blocking instance; keep own P1 line, cross-ref | both |

## Severity Changes
| Bug | Old | New | Evidence |
|-----|-----|-----|----------|
| Deploy status (masthead) | ✅ GREEN | 🔴 RED | 3 failing workflows on `bd8cb9a0` |
| BUG-011 | 23 bp | 57 bp (still P3) | recount |
| D-3 | 375041 | 469101 (still P3, warn) | recount |

---

## Verification Ladder Status

### L3 — Confirmed Current
- `P1-CSS-IMPORTANT-GATE-DRIFT`, `P1-EDITORIAL-METADATA-REGISTRY-GAP`, `P1-NAGORNAYA-JS-UNREGISTERED`,
  `P2-CSS-SYNTAX-SITECSS`, `P2-SSOT-DRIFT-2026-07-14`, `P3-CSS-DUP-CLEANUP`, and carry-over D-2/D-3/D-4/BUG-011 refresh.

### L4 — Repair Ready
- **None auto-promoted.** All P1 fixes touch the in-flight release transaction (SUPER_AUDIT W1) and
  owner-frozen zones (Нагорная visual, PremiumControls). Repair requires owner coordination; the +10
  `!important` are genuine a11y overrides needing architectural (not deletion) fix.

### Not confirmed
- Visual Parity pixel-diff root cause; backlinks-selector authorial intent; lost a11y declarations.

---

## Repair Lane Grouping
| Lane | Bug IDs | Count | Why together |
|------|---------|-------|-------------|
| lane/release-contract (owner) | P1-CSS-IMPORTANT-GATE-DRIFT, P1-EDITORIAL-METADATA-REGISTRY-GAP, P1-NAGORNAYA-JS-UNREGISTERED | 3 | все три — deploy-blocking из сессий контента 07-11..13; зелёный деплой требует всех трёх |
| lane/css-grammar | P2-CSS-SYNTAX-SITECSS (+ D-2 CI hardening) | 1(+1) | восстановление по history + настоящий CSS-parser в валидатор |
| lane/css-cleanup | P3-CSS-DUP-CLEANUP | 1 | дубли + var() + nagornaya 135→134 ratchet-down |

## Repair Order
1. **P1 release-contract** (owner-coordinated): site.css ≤200 архитектурно (не удалять a11y) → register JS в ALLOWED_JS+cache-bust → add 5 metadata records → unify ceilings → rerun `validate:static-publication` → redeploy; verify all 3 barriers green.
2. **P2 grammar + CI hardening:** restore SYNTAX-001/002/005, split @supports (003), decide DEAD-004; add real CSS parser, validate all core stylesheets, don't skip large files (extends D-2).
3. **P3 cleanup:** 2 dups + nested var(); ratchet nagornaya 135→134 after smoke.

## Notes for Implementation Agent
- **Не поднимать ceiling** вместо устранения — комментарий кода прямо запрещает (ratchet только вниз).
- +10 site.css `!important` = **реальные WCAG-фиксы** (reduced-motion + контраст) → архитектурная развязка, не `global replace`.
- Нагорная-визуал / PremiumControls — freeze-зоны; координировать с владельцем.
- Обновить оба ceiling из одного источника конфигурации (202/200 сейчас расходятся).
