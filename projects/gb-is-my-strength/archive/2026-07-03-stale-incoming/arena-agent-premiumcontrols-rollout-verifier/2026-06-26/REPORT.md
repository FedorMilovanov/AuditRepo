# Agent Audit Report — PremiumControls rollout status (branches vs plan)

## Meta
- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: `arena-agent-premiumcontrols-rollout-verifier` (role: verifier / researcher / editor)
- Date: `2026-06-26`
- Audited branch: `main` + 4 unmerged `lane/premiumcontrols-*` / `lane/system-premiumcontrols-*` branches
- Audited SHA (main): `09c2d34aedf3d0a29e19298ffa886e60fea02b87`
- Audited branch tips: `099afce4` (heart-series), `71ea9b10` (playember), `39d1f10b` (rollout-audit), `e2041042` (system-hardening)
- Environment: Arena sandbox; source clone at `/home/user/gb-is-my-strength` (full history after unshallow)
- Build mode: source + git branch-graph + tree-hash verification; **no browser witness** (Playwright blocked by missing system lib `libnspr4.so`)
- Reference plan: owner-supplied `Полный план внедрения PremiumControls по всему проекту.pdf` (14 pp)
- Evidence: `evidence/premiumcontrols-unmerged-branch-matrix-2026-06-26.md`

---

## Executive summary

The PremiumControls plan is **NOT implemented on `main`**. It exists only as **four parallel, mutually-conflicting, unmerged feature branches**. None of the four is an ancestor of another, so there is no natural merge order; merging them in sequence will produce hard conflicts on `js/floating-cluster-controller.js`, both heart-series Astro bodies, ~20 committed `dist` HTML files, and a deleted lane-report `.md`.

Beyond merge mechanics, the rollout has three substantive defects:

1. **Phase 1 is implemented with an undocumented `data-fc-mode`.** lane `premiumcontrols-heart-series-wiring` marks heart-series roots `data-fc-mode="series-rich"`, but the plan's canonical enum is `single | series-lite | gill | disabled`, and the controller on `main` only branches on `single`, `series-lite`, `nagornaya`. So `series-rich` falls through → pilot activation is skipped → the wiring is **half-applied** (the exact failure mode the plan warns about).
2. **The architectural core of the plan is untouched in every branch.** `PremiumControlAnchor` primitive = 0 references across all four branches. No canonical `src/styles/premium-controls.css`. No `position: fixed → anchor geometry` split. The single biggest engineering error the plan identifies ("control layer decides its own geometry via `position: fixed`") is still present.
3. **Phase 1/2 is implemented three times over** (heart-series lane, playember lane, and the catch-all `system-premiumcontrols-hardening` lane whose commit message literally says "PremiumControls Phase 1-2").

Net: the plan is roughly at **Phase 0 (partial) + Phase 2 (one good lane) + Phase 1 (one broken lane)**, with Phases 3–7 not started and the merge topology itself a blocker.

---

## 1. New Findings

### Finding `PC-ROLL-01`

- Title: PremiumControls plan is implemented ONLY on 4 unmerged, mutually-conflicting branches; `main` carries none of it
- Severity: P1 (release/merge blocker for the feature)
- Observed on SHA: `09c2d34` (main) + branch tips above
- Repro steps:
  ```bash
  git clone https://github.com/FedorMilovanov/gb-is-my-strength
  git ls-remote --heads origin | grep -iE "premiumcontrols|system-premiumcontrols"
  # 4 branches returned; for each:
  git merge-base --is-ancestor <tip> main && echo IN-main || echo diverged
  git diff main..<tip> --stat
  ```
- Expected: rollout delivered as small, mergeable PRs landing on `main` (plan: "intentionally маленькими PR-ами … не более одного archetype-шага за раз").
- Actual: 4 divergent branches, 0 merged; conflict map in evidence file. `main` still has the transitional `floating-cluster` state (166 broken `var(--gb-*)` without fallback, no anchor primitive).
- Confidence: high
- Verification level: L2 (direct git tree-hash evidence, reproducible)
- Suggested repair lane: `lane/premiumcontrols-feature-completion-2026-06-26` (existing umbrella) — but first **rebase-collapse the 4 branches into one ordered stack**, see Section 6.
- Do not mix with: content/metadata/SEO lanes.
- Comments: This is the root "where is the plan" answer.

---

### Finding `PC-ROLL-02`

- Title: lane `premiumcontrols-heart-series-wiring` uses `data-fc-mode="series-rich"`, which is **not in the plan's enum** and is **not handled by the controller** → half-wired controls
- Severity: P0/P1 (visible controls likely still not fully initialized)
- Route(s): `/articles/krajne-li-isporcheno-serdce/`, `/articles/rimlyanam-7-veruyushchiy-ili-neveruyushchiy/`
- Source file(s): `src/components/article-pilots/krajne/KrajneBody.astro`, `src/components/article-pilots/rimlyanam7/Rimlyanam7Body.astro`, `js/floating-cluster-controller.js`
- Observed on SHA: branch tip `099afce4`
- Repro steps:
  ```bash
  git show 099afce4:src/components/article-pilots/rimlyanam7/Rimlyanam7Body.astro | grep -oE 'data-fc-mode="[^"]*"'
  # → data-fc-mode="series-rich"
  # controller on main only knows:
  sed -n '434,437p' js/floating-cluster-controller.js
  #   var mode = root.getAttribute('data-fc-mode') || 'single';
  #   if (mode === 'single') activateSinglePilot();
  #   if (mode === 'series-lite') activateSeriesPilot();
  #   if (mode === 'nagornaya') activateSinglePilot();
  ```
- Expected: plan page 7 — "Минимальный enum: single, series-lite, gill, disabled. … нельзя по умолчанию считать root single."
- Actual: `series-rich` matches none of the three controller branches → pilot activation (`activateSinglePilot`/`activateSeriesPilot`) is **skipped** for heart-series roots. Root is marked, but series body classes / affordances not applied.
- Confidence: high (source-level)
- Verification level: L2 (direct source + controller branch logic)
- Suggested repair lane: `lane/premiumcontrols-heart-series-wiring-2026-06-26` (fix in place before merge)
- Do not mix with: PlayEmber semantics lane.
- Comments: Formal challenge filed in `comments/comment-on-heart-series-mode-enum-PC-002.md`. Note the **committed `dist` HTML uses a DIFFERENT wiring** (`data-fc-controls="gill-rail" data-fc-variant="heart"`) than this branch (`data-fc-root data-fc-mode="series-rich"`) — two competing approaches for the same two routes.

---

### Finding `PC-ROLL-03`

- Title: Architectural core of the plan is absent in ALL branches — no `PremiumControlAnchor`, no canonical `src/styles/premium-controls.css`, no geometry split
- Severity: P1 (the plan's central thesis is unaddressed)
- Observed on SHA: all four branch tips + main `09c2d34`
- Repro steps:
  ```bash
  for b in premiumcontrols-heart-series-wiring-2026-06-26 \
           premiumcontrols-playember-semantics-2026-06-26 \
           premiumcontrols-rollout-audit-2026-06-26 \
           system-premiumcontrols-hardening-2026-06-26-arena; do
    echo "--- $b ---"
    git grep -c "PremiumControlAnchor\|premium-control-anchor\|data-pc-anchor" refs/remotes/origin/lane/$b -- 'src/' || echo 0
    git show refs/remotes/origin/lane/$b:src/styles/premium-controls.css 2>/dev/null | head -1 || echo "(no canonical CSS)"
  done
  # → 0 anchor refs in every branch; canonical CSS missing everywhere
  ```
- Expected: plan pages 4–7 — three-layer split (`PremiumControlAnchor` = layout, `PremiumControls` = UI, controller = behavior); single canonical CSS source.
- Actual: every branch still works inside the transitional `floating-cluster` component family with `position: fixed` geometry. The plan's stated "ключевая инженерная ошибка прошлых попыток" (control decides its own geometry) is **still present**.
- Confidence: high
- Verification level: L2
- Suggested repair lane: `lane/premiumcontrols-anchor-architecture-2026-06-26`
- Do not mix with: Phase 1/2 wiring fixes.
- Comments: This is the plan's Phase 3 ("Add/settle anchor layer") + the CSS Phase 4 work. Neither started.

---

### Finding `PC-ROLL-04`

- Title: Phase 1/2 is implemented **three times** across three branches → redundant, conflicting work
- Severity: P2 (wasted effort + merge friction), but P1 for coordination
- Observed on SHA: branch tips
- Evidence (commit messages):
  - `099afce4` heart-series: "wire dead Play/Save on heart-series articles (PC-002)" — Phase 1
  - `71ea9b10` playember: "normalize PlayEmber semantics + canonical audio rate key (PC-005)" — Phase 2
  - `debf4030b` system-hardening: "fix(audit): close 12 P0/P1/P2 bugs + **PremiumControls Phase 1-2**" — Phase 1+2 AGAIN
- File-level overlap that forces conflicts:
  - `js/floating-cluster-controller.js`: playember (+56) **and** system-hardening (+202)
  - `KrajneBody.astro` + `Rimlyanam7Body.astro`: heart-series **and** rollout-audit (both edit the same `gbs2-rfoot` line)
  - ~20 `articles|baptisty|nagornaya/*/index.html`: playember **and** system-hardening
  - `docs/refactor-2026/lanes/system-release-gate-green-2026-06-26.md`: **deleted** by both heart-series and playember
- Confidence: high
- Verification level: L2
- Suggested repair lane: collapse to ONE feature-completion lane (see Section 6)
- Do not mix with: —
- Comments: The three lanes were not coordinated against the same lane-lock.

---

### Finding `PC-ROLL-05`

- Title: lane `premiumcontrols-playember-semantics` is **stacked on yet another unmerged lane** (`system-cache-bust-astro-source`), and 2 of the 4 rollout lanes fork from a **stale** commit (`106f98d`, 2 commits behind main)
- Severity: P1 (merge readiness / staleness)
- Evidence (branch graph):
  - `heart-series` and `playember` merge-base with main = `106f98d` (main is at `09c2d34`, i.e. these are 2 commits behind)
  - `playember` builds directly on top of `e7724a7 system-cache-bust-astro-source-2026-06-26` (another unmerged lane) → to merge playember you must first merge cache-bust
  - `rollout-audit` and `system-hardening` fork from `09c2d34` (= current main)
- Confidence: high
- Verification level: L2 (git graph)
- Suggested repair lane: rebasing pass before any merge
- Do not mix with: —
- Comments: None of the four is a fast-forward candidate as-is.

---

### Finding `PC-ROLL-06`

- Title: rollout-audit lane's new guard (`scripts/premium-controls-rollout-audit.js`) is good and matches Phase 0, but does **not** validate `data-fc-mode` values — so it will not catch the `series-rich` defect of `PC-ROLL-02`
- Severity: P2 (gate blind spot)
- Source file(s): `scripts/premium-controls-rollout-audit.js` (new on lane `premiumcontrols-rollout-audit`)
- Observed on SHA: `39d1f10b`
- Evidence: the script checks for dead controls (visible `gb-ember`/`gb-save` outside `[data-fc-root]`/`[data-fc-controls]`) and forbidden-route rollout, but `grep` for `series-rich|series-lite|data-fc-mode` in the script returns nothing — no mode-enum enforcement.
- Expected: plan page 7 — controller must reject unknown modes; the audit is the natural place to enforce the canonical enum.
- Actual: an unknown mode silently passes the rollout gate.
- Confidence: high
- Verification level: L2
- Suggested repair lane: extend the Phase 0 script with an `ALLOWED_MODES = new Set(['single','series-lite','gill','disabled'])` check.
- Do not mix with: —
- Comments: Easy, high-value addition; it would have auto-caught `PC-ROLL-02`.

---

### Finding `PC-ROLL-07`

- Title: Phase 6 (browser smoke gate) is **structurally blocked** — no Playwright runtime in the sandbox
- Severity: P1 (process blocker; cannot reach L4 verification)
- Evidence: prior verifier reports + this run: Playwright fails on missing `libnspr4.so`. The plan's acceptance criteria (alignment ≤8px, clickability 100%, speed persistence, no duplicates) are **runtime** criteria that source-level checks cannot satisfy.
- Expected: plan page 9–10 — Playwright contract + acceptance metrics.
- Actual: every "CI green" claim so far is `verified-source`, not `verified-runtime`.
- Confidence: high
- Verification level: L1 (environment fact)
- Suggested repair lane: infra — install browser deps in the agent sandbox, or run smoke on the owner's machine.
- Do not mix with: —
- Comments: Must be resolved before any branch can be called "feature complete".

---

## 2. Confirmations of Existing Findings

### Confirm `PC-005` (playember-semantics lane)

- Target report: `incoming/arena-agent-premiumcontrols-verifier/2026-06-26/REPORT.md` (Finding PC-005)
- My evidence: lane `71ea9b10` introduces `AUDIO_RATE_KEY='gb:audio:rate'` + `AUDIO_RATE_KEY_LEGACY='gbx-tts-rate'` with dual-write (`readAudioRate`/`writeAudioRate`), adds `aria-haspopup/aria-controls/aria-expanded`, and the idle `'Озвучка ещё не подключена'` toast is **gone** from `handlePlayClick()`.
- Same bug / related / stronger root cause: **CONFIRMED-RESOLVED on that lane** (not on main). The dual-write-to-legacy is actually a sound choice and exceeds the plan's alias requirement.
- Recommended status: this lane correctly closes PC-005; promote it as the canonical Phase 2 implementation.

### Confirm `PC-006` (route-archetype audit)

- Target report: same, Finding PC-006
- My evidence: lane `39d1f10b` adds `scripts/premium-controls-rollout-audit.js` (147 lines) running against built `dist`, with FORBIDDEN_ROUTE_PREFIXES for app/landing routes.
- Recommended status: **CONFIRMED-PARTIAL** — script exists and is the right Phase 0 artifact, but lacks mode-enum enforcement (PC-ROLL-06).

### Confirm `PC-001` / `PC-004` (anchor + CSS canonicalization)

- My evidence: 0 `PremiumControlAnchor` refs in any branch; no `src/styles/premium-controls.css`. lane `rollout-audit` documents PC-001/PC-004 as "verified state" but does not implement them.
- Recommended status: **STILL-OPEN**. Documenting a bug as "verified" in a lane report is not fixing it.

---

## 3. Challenges / Disputes

### Challenge the `series-rich` mode choice (PC-002 lane)

- Target report: lane `premiumcontrols-heart-series-wiring` (`099afce4`)
- Target finding: heart-series roots wired with `data-fc-mode="series-rich"`.
- Reason for challenge: not in plan enum; not handled by controller → half-wired.
- Current HEAD evidence: controller branches only on `single/series-lite/nagornaya`.
- Recommended status: **disputed / must-fix-before-merge**. Full text in `comments/comment-on-heart-series-mode-enum-PC-002.md`.

### Challenge lane `system-premiumcontrols-hardening` scope

- Target: `e2041042` / `debf4030b`
- Target finding: commit claims "PremiumControls Phase 1-2".
- Reason for challenge: this duplicates the dedicated Phase 1 (heart-series) and Phase 2 (playember) lanes AND bundles 2708 lines of unrelated BUG-A7/A9/B6/S6 + image/cleanup work — violates the plan's "не более одного archetype-шага за раз" and risks a giant conflict-prone merge.
- Recommended status: **split** — extract the PremiumControls bits, discard the Phase 1-2 duplication, land the BUG-* fixes on their own lane.

---

## 4. Phase-by-phase status (vs the 7-phase plan)

| Plan phase | Status on branches | Notes |
|---|---|---|
| pilot-hardening | not started | Herm/Gill pilots not hardened to anchor model |
| primitives-extract | not started | no `PremiumControlAnchor`/canonical CSS/controller-rename |
| article-archetype | not started | Herm/Kod/Antisovetov still `position:fixed` |
| series-lite | partial-broken | heart-series lane = `series-rich` (PC-ROLL-02) |
| gill-formalize | not started | Gill still ad-hoc, excluded in matrix |
| legacy-exclusion | partial | Phase 0 audit script forbids app routes; `disabled` mode not wired |
| cleanup | premature | dead-file cleanup already attempted on main (`series-cards.js`) but half-done |

Net rollout completeness estimate (branches, if merged): **~25%**. On main: **0%**.

---

## 5. Recommended merge order (if owner proceeds)

1. Land `system-cache-bust-astro-source` first (playember depends on it).
2. Fix `series-rich → series-lite` on heart-series lane (PC-ROLL-02), then merge heart-series.
3. Merge playember (cleanest, highest-quality).
4. Merge rollout-audit + extend it with mode-enum check (PC-ROLL-06).
5. **Split** system-hardening: keep BUG-A7/A9/B6/S6 fixes, drop its Phase 1-2 duplication, merge remainder.
6. THEN start the missing architectural core (PC-ROLL-03) as Phase 3+.
7. Unblock Phase 6 (browser deps) before declaring done.

**Preferred alternative:** collapse the four lanes into a single `lane/premiumcontrols-feature-completion-2026-06-26` stack, resolve the heart-series mode, and merge as one reviewed unit — this matches the umbrella lane the verifier proposal already named.

---

## 6. Notes for the next verifier / editor

- The earlier `arena-agent-premiumcontrols-verifier` REPORT (`106f98d`) is still accurate for `main`, but it predates these branches. This intake updates the picture: the work the earlier verifier asked for **was started**, just not merged and not coordinated.
- Do NOT mark any PC-* item FIXED based on a branch tip. The project ledger convention requires status against `main` HEAD. As of `09c2d34`, **no PC-* item is fixed on main**.
- The owner-supplied PDF plan should be treated as the canonical repair order for PC-001…PC-006 and the 7-phase rollout.
