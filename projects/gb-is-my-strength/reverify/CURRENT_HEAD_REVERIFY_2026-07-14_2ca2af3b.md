# Current Head Reverify — `2ca2af3b` (2026-07-14)

## Project
- Project: gb-is-my-strength
- Source repo: FedorMilovanov/gb-is-my-strength
- Current HEAD SHA: `2ca2af3b91ac`
- Previous tracked HEAD: `b8459bdf` (main @ 2026-07-10 per MASTER_BUG_MATRIX/NEXT_AGENT_PROMPT)
- Commits in delta: **29+ merges/features/fixes, ~80 failed/cancelled deploy runs since 2026-07-11**
- Date: 2026-07-14
- Verifier: arena-auditor-2026-07-14

## Compared against
- Canon before this pass:
  - `verified/MASTER_BUG_MATRIX.md` masthead @ `b8459bdf`, Deploy GREEN (run 29065454930)
  - `NEXT_AGENT_PROMPT.md` dated 2026-07-10
  - Last `reverify/CURRENT_HEAD_REVERIFY_2026-07-09_head-2313f36f-149-commit-delta.md`
- Production: https://gospod-bog.ru

## Witnesses
- `verified-source`: this document (gh api + git log inspection)
- `verified-build`: not performed locally (OOM risk for strangler-build per SANDBOX-ENV §2; relied on CI run outcomes)
- `verified-browser`: not performed (no Playwright run in this pass)
- Production-like dist: deferred — see RECOMMENDATIONS.

## Delta summary (b8459bdf → 2ca2af3)

### A. Atlas / Genealogy (new flagship track, source repo)
- **Course staked** in `AGENTS.md` §13 — «Библейский атлас родословий» (genealogy direction).
- **Card engine built and merged:** `scripts/genealogy-build/atlas-template.html`, `build-atlas.mjs`; output `data/genealogy/v2/build/atlas-interactive.html`. Cards, clusters, 3 semantic zoom levels, mini-map, search, filters, deep-linking, 8-step tour, share/save-view, a11y, prefers-reduced-motion.
- **Force-graph demoted** to secondary: `genealogy-interactive.html` (live tree) and `nations-interactive.html` (nations map) remain working but UI focus moves to atlas; closed bugs: nations dedup (mythWatch), clickable confidence filter, pinch-zoom, deep-linking, tooltip-flip at edges, separate header «Карта народов», zoom-adaptive labels, dblclick/Esc/keyboard.
- **Atlas waves KA-0…KA-8** (from `claude-atlas-deep-audit`): KA-0 done (contract 2026-07-10), KA-2a-f (data registries, OpenBible CC BY 4.0 enrichment, coordinate spaces, place.schema.json, 115 canonical places, periods 2166 BC–636 AD), KA-4b-v3 (shell prototype, light paint-set, print-CSS), KA-2d YEC positioning (owner decision), KA-7a-c (people registry, 13 emperors, 66 books, Fambius found), KA-3a label audit (30 collisions, labelBg bug).
- **Atlas verification passes:**
  - 2026-07-11: 9+2 screenshot iterations, LOD z2/z3, clickable everything, rivers fixed, click-everything witness.
  - 2026-07-12: control QA (3 batches) — Cyprus fish, Mamre umbrella, war label collisions, expedition line, Vhan/Urmia shape, Carchemish dedup, Ezion-Geber placed, D-16..D-19 closed.
  - **Serious river audit:** geometry bugs on BOTH sheets (Tigris source inside Lake Van → moved to highland, Tigris+Euphrates mouth eye-loop → clean Y confluence, Zab missing → added, Jordan DOUBLE-DRAWN → deduped, upper Jordan added, Yarmuk/Jabbok/Arnon seated to banks, lakes waterRipple reduced).
- **Abraham map merged** to `main` (`2ca2af3b`), but deploy is red (see B).
- **Atlas v1 milestone** (genealogy) merged to `main` (`0aee617`) but deploy is red.

### B. Production deploy status 🔴
- Last **successful** deploy workflow run for `deploy.yml` on `main`: **29138555390** @ `007b67de` — **2026-07-11**.
- Since then (through latest `2ca2af3b` 2026-07-14): **80 runs = 56 failure + 24 cancelled, 0 success**.
- Failing step: `deploy` → **`Static publication gates`** (audit-pro / migration:metadata / native:runtime / content coverage chain). Consistent across all recent pushes (content articles, Atlas v1, Abraham map, hard-texts description fix, /karty/ theme switch fix, Nagornaya fixes).
- **NOT** an infra timeout (which was D-17/D-18 pattern in July 06) — it is the static gates themselves failing, meaning content/asset regression was introduced on/after `007b67de` and never made it through the barrier.
- Production URL https://gospod-bog.ru has therefore NOT received:
  - 9 new «Сердце» articles (А3/А4/А5, Б1/Б2/Б3, В2, Г3, Д1)
  - Rimlyanam-7 lengthening (Augustine, 1689 ch.13, military metaphor)
  - Nagornaya 5-part fixes (lower bar Play/Save, istochniki/nakhodki/index, frame/color, speed panel raw-text bug)
  - /karty/ manual theme switch fix
  - /map/ thematic-cluster text overlap fix
  - hard-texts description trim
  - **Genealogy Atlas v1** (`0aee617`)
  - **Abraham map** (`2ca2af3b`)

### C. Other source-repo fixes worth flagging
- `/karty/` manual theme switch fixed (previously ignored).
- `/map/` «Тематические кластеры» overlap fixed.
- Nagornaya (Нагорная проповедь) series across 5 parts: bottom bar revived, Play/Save buttons added, speed panel that rendered raw text fixed, frame/color audit done.
- Content: 6 «Сердце» articles (Б1, Б2, Б3, В2, Г3, Д1) + А3 (Совесть), А4 (Мысленная жизнь), А5 (Старые дорожки сердца); hard-texts description ≤220 chars per collection schema; `serdce-hrista` additions (Chalcedon, 1689 ch.8, Calvin on Gethsemane); `novoe-serdce` exegesis of promise; `serdce-i-duh` Rom 8 full exegesis; `strah-bozhij` 1 Jn 4:18.
- Atlas object library (6 phases): engraved mountains, walled cities/trees, cartouche/atlas frame, caravan, wind-rose.
- Sheet-engine: publishing text-halo for labels (AV-024/040).

### D. AuditRepo structural repair (this session)
- Root `DEBT-REGISTER.md` moved to `projects/gb-is-my-strength/working/atlas/DEBT-REGISTER.md` (project-scoped).
- Root `verification/atlas/*.png` (27 PNG, ~38 MB) moved to `projects/gb-is-my-strength/verification/atlas/root-evidence-2026-07-11/` to respect project-folder contract.
- Intake `claude-atlas-deep-audit/2026-07-10/` brought up to contract: added `README.md`, copied master plan to `REPORT.md`, moved inline `verification/atlas/*.png` → `evidence/screenshots/`.
- Intake `claude-genealogy-atlas-strategy/2026-07-14-milestone-atlas-v1/` renamed to contract-compliant `2026-07-14/` with `REPORT.md` + `README.md`.
- CI (auditrepo-validate.yml) returns to PASS after fixes.

## New findings surfaced by this reverify (for MASTER_BUG_MATRIX)
- **DEPLOY-STATIC-GATES-RED-2026-07-11** — `deploy.yml` failing on Static publication gates since 2026-07-11 (56/56 pushes red). Severity P0 (prod blocked). Witnesses: 80 CI runs, failing step `Static publication gates`.
- **ATLAS-DEBT-LOG-AT-ROOT** — closed (moved to project/working); root clutter removed. Witness: this reverify + validator PASS.
- **INTAKE-CONTRACT-VIOLATIONS-2026-07-14** — closed (claude-atlas-deep-audit, milestone-atlas-v1 repaired; CI PASS).
- **ATLAS-D-16-19-NAMESPACE-COLLISION** — atlas-specific D-16..D-19 reuse IDs that historically meant SW/deploy/title drift; recommend rename to `ATLAS-D-*` (see proposal in intake). Severity P2.

## Recommended next actions
1. Locate the failing static gate on source `2ca2af3b` (likely a new asset/revision reference or a route introduced by Abraham map / Atlas v1 that audit-pro rejects — e.g. cache-bust, content-provenance, route-registry, or native-runtime expectation violated). Run FAST loop locally:
   - `npm run guard:shared-files`
   - `npm run data:consistency`
   - `npm run migration:metadata:check`
   - `npm run audit-pro` (light)
   to find which gate blocks before attempting full strangler-build.
2. Until DEPLOY-STATIC-GATES-RED is fixed, **no new content deploy** is reaching production; do not merge further feature PRs into `main` without a local FAST-loop pass.
3. Once deploy turns green, run a production-like dist + browser witness on the genealogy atlas (`/rodosloviye/`) and Abraham map (`/karty/avraam/`) and record in the next reverify.
4. Promote new open items into MASTER_BUG_MATRIX; update masthead HEAD/deploy status.

## Outcome
- Canon HEAD before reverify: `b8459bdf` (stale 4 days).
- Reverified HEAD: `2ca2af3b` (deploy red, trackable).
- Canon after this session: needs masthead + matrix update (done in same commit as this reverify).
