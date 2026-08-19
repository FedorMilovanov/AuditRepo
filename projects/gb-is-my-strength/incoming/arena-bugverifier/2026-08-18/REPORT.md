# Agent Audit Report — orphaned static guards on current main

## Meta

- Project: `gb-is-my-strength`
- Source repo: `FedorMilovanov/gb-is-my-strength`
- Agent: `arena-bugverifier` (Arena.ai Agent Mode)
- Date: `2026-08-18`
- Audited branch/ref: `main`
- Audited anchor (SHA / artifact / live snapshot):
  - Product `main` = `a2ef67da54dd4ae00aedae154422280620acdf21` (`chore(deps-dev): update vetted non-major dependencies (#1683)`, authored `2026-08-17T17:45:57Z`);
  - live snapshot of `https://gospod-bog.ru/app/` fetched `2026-08-18T06:55Z`;
  - open Product PRs at inspection time: **0**.
- Environment: Linux sandbox, Node `v22.14.0`, `npm ci` from the committed `package-lock.json` (499 packages). No `git` binary and no Playwright browsers available.
- Build mode: **source** (+ one live HTTP witness). Production-like dist build was attempted and **did not complete** in this environment (`astro check` aborted with V8 OOM/SIGABRT), so no dist/browser claim is made.
- Browser / device if used: none. No Playwright evidence in this pass.
- Scope: CI wiring of repository guards versus their actual execution; static contract scripts runnable without a browser; external reader-facing source links; the new `/app/` surface introduced 2026-08-17.
- Explicit exclusions: browser/runtime behaviour, visual parity, dist-only audits, Research repo, control-plane/attestation freshness (already owned by `SYS-RESEARCH-SOURCE-AUDIT-HARD-GATE`).
- Signal class: **harness** (audit/CI wiring), with a secondary Product-source component.
- Proof state: **FAIL** for `AB-01`; **PASS/negative** for the link and `/app/` CSP hypotheses.
- Claim boundary: proves what a *source-level* guard run and CI-wiring scan show at the named anchor. It does **not** prove a user-visible defect on production.
- Preservation boundary: no Product file was mutated; no AuditRepo MASTER row was edited by this intake.
- Semantic owner: `scripts/check-engine-contracts.js` + `.github/workflows/native-source-contract.yml` / `route-registry-validators.yml`.
- Overlapping active owner/PR/branch check (re-checked against AuditRepo `main` `d79d080d7331427c0d0aa348c005ceca8936968a`, 2026-08-18T07:01Z):
  - MASTER now holds `HTML-BTN-TYPE`, `SYS-RESEARCH-SOURCE-AUDIT-HARD-GATE` and the `SYS-MAIN-ADMISSION-ENFORCEMENT` owner decision (earlier `D-20`/`D-21`/`P1-*`/`GBS2-WIRING-*` rows have already moved). **None of them owns CI wiring of `engine:contracts`** — no duplicate row exists for `AB-01`;
  - 7 open AuditRepo PRs (#316–#322) all write to *different* intake folders (`incoming/arena/…`, `incoming/arena-source-auditor/…`); this intake writes only to `incoming/arena-bugverifier/2026-08-18/`, so there is **no file-level collision**;
  - no open Product PR touches these files. Nearest existing theme: `ST-SOURCE-GUARD-CLOSURE`.
- Relation to `SYS-MAIN-ADMISSION-ENFORCEMENT`: that decision records that required status-check enforcement is **off**. `AB-01` is the complementary half — even where a check *is* nominally wired by `paths:`, one guard is never executed at all. The two compound: an unenforced check plus an unexecuted guard means the `paths:` citation implies coverage that does not exist. `AB-01` does not replace or resolve that owner decision.

> The anchor records what this pass actually inspected. Do not update this report merely because the source repository later moved.

---

## 1. New observations

### Observation `AB-01`

- Title: `engine:contracts` and two route-contract auditors are cited as workflow path triggers but are never executed by any workflow, and they are currently red on `main`
- Kind: audit-harness (with Product-source drift underneath)
- Suggested impact: **medium-high** (guard credibility / false-green class), not a proven user-facing defect
- Route(s) / owner(s): `scripts/check-engine-contracts.js`, `scripts/route-profile-contract-audit.js`, `scripts/route-migration-matrix-contract-audit.js`; `.github/workflows/native-source-contract.yml`, `.github/workflows/route-registry-validators.yml`
- Observed on anchor: Product `main` `a2ef67da54dd4ae00aedae154422280620acdf21`
- Expected: a script listed under a workflow's `paths:` trigger is expected to be enforced by that workflow — changing it should cause it to run and to fail closed if its invariant is broken. `package.json` also exposes it as a first-class guard (`engine:contracts`, `engine:guard`).
- Actual:
  1. **Never executed.** `check-engine-contracts.js` appears in `native-source-contract.yml` (lines 32, 75) and `route-registry-validators.yml` (line 67) **only inside `paths:` trigger lists**. No `run:` step in any of the 60 workflow files invokes it, and no executed `npm run` chain reaches `engine:contracts`/`engine:guard`. The only executed engine-related script is `npm run engine:sweep` (`route-registry-validators.yml:247`), which is a *different* script (`engine-sweep.mjs`) and does not call `check-engine-contracts.js`.
  2. **It is red.** Run at the anchor with real dependencies installed: `exit=1`, `❌ engine:contracts — 2 contract(s) failed. Fix the cause; never weaken the guard.`
     - `❌ Reader actions: Astro module graph owns hashing and legacy root stays clean` — the contract asserts `!readerActionsRuntime.includes('assetUrl(')`, but `src/components/reader-platform/ReaderActionsRuntime.astro` imports `assetUrl` (line 35) and uses it (line 39, `const voskEngineSrc = assetUrl('js/vosk-tts-engine.js');`).
     - `❌ Atlas: detail rail consumes desktop grid only during focus` — the contract asserts `atlasRuntime.includes("app.classList.add('has-detail')")`, but `src/runtime/atlas-runtime.js` now uses `app.classList.toggle('has-detail', Boolean(open))` (line 308). The `remove` half (line 1098) still matches.
  3. Two further orphaned auditors are also red at the anchor: `route-profile-contract-audit.js` (`exit=1`) and `route-migration-matrix-contract-audit.js` (`exit=1`), both reporting production Astro routes "missing matrix contract". The **wired** equivalent `check-route-migration-matrix.js` passes (`exit=0`), i.e. the wired and orphaned auditors disagree about the same surface.
- Reproduction or inspection steps:
  ```bash
  git checkout a2ef67da54dd4ae00aedae154422280620acdf21
  npm ci
  node scripts/check-engine-contracts.js;            echo "exit=$?"   # 1
  node scripts/route-profile-contract-audit.js;      echo "exit=$?"   # 1
  node scripts/route-migration-matrix-contract-audit.js; echo "exit=$?" # 1
  node scripts/check-route-migration-matrix.js;      echo "exit=$?"   # 0
  # wiring: cited only as a trigger, never as a run step
  grep -rn "check-engine-contracts\|engine:contracts\|engine:guard" .github/workflows/
  ```
- Evidence type: verified-source, verified-lifecycle (historical raw-file inspection)
- Evidence:
  - `evidence/engine-contracts.log` — full guard output at the anchor, `EXIT=1`;
  - `evidence/route-profile-contract-audit.log`, `evidence/route-matrix-contract-audit.log`;
  - `evidence/ci-wiring-scan.py` + `evidence/ci-wiring-scan.log` — parses only `run:` step bodies, expands `npm run` chains transitively, and reports scripts cited in workflow files but never executed (23 cited-but-never-executed; after removing those that are `require`d/spawned by another script, `check-engine-contracts.js` is the one with **no** executing caller at all).
- Confidence: **high** for "never executed" and "currently red"; **medium** for impact ranking.
- Limitations of this method: static wiring analysis of workflow YAML plus local source runs. It cannot observe GitHub-side required-status-check configuration or branch protection, and this environment could not complete a dist build, so no dist/browser claim is made.
- Possible mechanism: the guard was wired by `paths:` when it was authored, but the executing step was never added (or was later dropped). With nothing running it, ordinary refactors legitimately changed the implementation (`assetUrl` composition for the Vosk engine; `classList.toggle` instead of `add`) while the string-literal assertions kept referencing the older shapes. Nothing failed, so the drift stayed invisible.
- Related existing findings: `ST-SOURCE-GUARD-CLOSURE` ("a check that is absent, skipped or unable to start is not a pass"); `ST-AUDIT-HARNESS` ("`UNPROVEN != PASS`"). This is a concrete, reproducible instance of both themes rather than a new theme.
- Applicability: the wiring scan and all four runs were performed on the exact named anchor with dependencies resolved from the committed lockfile.
- What this evidence does **not** prove:
  - it does **not** prove any user-visible defect on `gospod-bog.ru`. Both engine failures are stale *assertions*, not broken behaviour: `assetUrl()` is the repo's normal cache-busting composition, and `classList.toggle(x, Boolean(open))` is behaviourally equivalent to the asserted `add`/`remove` pair;
  - it does **not** prove the two route auditors are correct — they may themselves be superseded by the wired effective-registry checks. Which side is authoritative is an owner call (see §8);
  - it does **not** prove the guard would be red on a full production-like dist build.

### Dated drift boundary for `AB-01`

Raw historical file inspection (no clone required) narrows when each assertion broke:

| Contract | Last inspected commit satisfying it | First inspected commit breaking it |
|---|---|---|
| Reader actions / `assetUrl` | none of the inspected commits | already broken at `1509f997` (2026-08-05) and `eeaa4a8c` (2026-08-09) |
| Atlas `has-detail` | `eeaa4a8c` (2026-08-09) — satisfied | `8757bec6` (2026-08-10, `fix(atlas): align drawer lifecycle`) and `8c192a9d` (2026-08-10) |

So this is **long-standing drift, not a fresh regression** from the 2026-08-17 Bible-app wave. That distinction matters for wave selection: it is not a `/app/` rollback signal.

---

## 2. Confirmations and extensions

### Confirm or extend `ST-SOURCE-GUARD-CLOSURE`

- Target report/finding: `verified/SYSTEM_THEMES.md` → `ST-SOURCE-GUARD-CLOSURE`
- Evidence angle added: repository-wide **executed-vs-cited** wiring scan (parses `run:` bodies only and expands `npm run` chains), rather than per-workflow reading
- My evidence anchor: `a2ef67da54dd4ae00aedae154422280620acdf21`
- Result: **stronger mechanism** — the theme's "applicability" half now has a reproducible detector and one concrete orphan with a dated drift boundary
- What this changes: the theme's recheck trigger can become mechanical (a scan) instead of relying on a human noticing a missing step.

---

## 3. Challenges and negative findings

Three hypotheses were tested and **refuted**. Recording them so a later wave does not re-spend the effort.

### Challenge `HYP-CSP-APP` — "`/app/` ships without a CSP meta"

- Reason: `/app/` (new on 2026-08-17) is one of the `src/pages` routes with no CSP meta in source, while `dist-publication-audit.js:checkCspCoverage()` fails closed on any dist HTML lacking one.
- Contradictory evidence angle: source + **live**
- Evidence anchor: `scripts/astro-cache-bust-postbuild.js` injects `DEFAULT_DIST_CSP` during postbuild; live fetch of `https://gospod-bog.ru/app/` on 2026-08-18T06:55Z returns a CSP meta including `form-action 'self'`.
- Recommended result: **invalid** — CSP is a postbuild-owned concern; source-level absence is by design.

### Challenge `HYP-DEAD-LINKS` — "`fix(sources): repair dead archival links` (0432a554) replaced live links with dead ones"

- Reason: the commit swapped two working `archive.org` URLs for `catalog.hathitrust.org` and `legifrance.gouv.fr` URLs that both return **403** to a plain client, while the replaced `archive.org` URLs return **200** with correct item titles.
- Contradictory evidence angle: the project's own policy in `scripts/source-link-audit.js` — only `404/410`/unusable content are publication-blocking; `401/403/405/418/429/5xx` are explicitly **warnings** ("bot blocks ... do not prove that a reader-facing source is permanently invalid"). A 403 to an unauthenticated datacenter IP is exactly that case.
- Evidence anchor: all **261** reader-facing external `href`s across `src/`, `articles/`, `hard-texts/`, `baptisty-rossii/`, `biografii/`, `konfessii/`, `data/` etc. were probed on 2026-08-18: **205 OK**, **0 × 404**, **0 × 410**; every non-200 is 403/405/timeout from a bot-blocking or slow host.
- Recommended result: **invalid** (no defect). The external link surface is clean under the project's own contract.

### Challenge `HYP-SW-PRECACHE` — "`sw.js` precaches a missing asset"

- Reason: `/pagefind/pagefind.js` is in `PRECACHE_ASSETS` but absent from the source tree, and `cache.addAll()` rejects atomically if any entry fails.
- Contradictory evidence angle: `pagefind/` is generated at build time (`pagefind:build:dist`), and `checkSwPrecache()` explicitly skips `pagefind/` prefixes.
- Recommended result: **invalid** (wrong-build reasoning on my side).

---

## 4. Root-cause clusters

### Cluster `orphaned-guard-wiring`

- Shared mechanism: a guard's *existence* and its *enforcement* are declared in two different places (`package.json` script + workflow `paths:`) with nothing proving the third thing — that a `run:` step actually executes it. A guard can therefore be authored, trusted, cited, and silently never run.
- Members: `check-engine-contracts.js` (no executing caller at all); `route-profile-contract-audit.js` and `route-migration-matrix-contract-audit.js` (red, superseded-or-not is undecided).
- Why one root: all three are invisible for the same structural reason, and all three drifted red without anyone noticing — which is the definition of the failure mode, not three separate content bugs.
- Class-level guard that would have caught it: a meta-check asserting that every script named in a workflow `paths:` list is either executed by some `run:` step, `require`d by an executed script, or explicitly registered as intentionally non-enforcing.

---

## 7. Suggested repair boundaries

- Local lane: refresh the two stale assertions in `check-engine-contracts.js` to match current implementations (`assetUrl` composition is legitimate; accept `classList.toggle('has-detail', …)` alongside `add`/`remove`) — **only after** the owner decides these are assertion drift rather than intended invariants.
- System lane: add the meta-check from §4 so a cited-but-never-executed guard fails closed; then wire `engine:contracts` into `native-source-contract.yml`.
- Do not mix with: `SYS-RESEARCH-SOURCE-AUDIT-HARD-GATE` (Research-side red hard gate, different owner) or any `/app/` content lane.
- Minimum regression witness: `node scripts/check-engine-contracts.js` exits `0` on the fix branch **and** the new wiring meta-check fails on a synthetic orphan fixture.
- Is live evidence actually required? **no** for the guard repair; the wiring claim is source-provable.
- Required exact-head checks: `engine:contracts`, `native-source-contract`, `route-registry-validators`.
- Is merge admission machine-enforced? **unknown** — not observable from the source tree in this environment.

---

## 8. Owner decisions

- Decision needed: for each of the three orphaned auditors — **enforce** or **retire**?
- Available options:
  1. *Enforce as-is*: wire them and repair the underlying code to satisfy the assertions.
  2. *Enforce after refresh*: update the stale string assertions to current implementation shapes, then wire (recommended for `check-engine-contracts.js` — the two failures look like assertion drift, not behaviour regressions).
  3. *Retire*: if `route-profile-contract-audit.js` / `route-migration-matrix-contract-audit.js` are genuinely superseded by the wired effective-registry checks, delete them and remove their `paths:` citations so they stop implying coverage.
- Trade-offs: option 2 is cheap and restores real coverage; option 3 removes a false impression of coverage but loses a stricter (if outdated) lens. Leaving them as-is is the only strictly bad outcome, because the repository currently *looks* guarded where it is not.
- Default recommendation: **option 2** for `check-engine-contracts.js`; explicit **option 3 vs 2 owner call** for the two route auditors, since the wired check disagrees with them about the same routes.

---

## 9. Summary for verifier

- Strongest new evidence: `check-engine-contracts.js` is cited as a trigger in two workflows, executed by none, and exits `1` on current `main` — with a dated drift boundary showing the Atlas half broke on 2026-08-10 and the reader half before 2026-08-05.
- Findings likely current when selected: `AB-01` (harness). No current Product defect was proved by this pass.
- Systemic clusters: `orphaned-guard-wiring` — belongs under existing `ST-SOURCE-GUARD-CLOSURE`, not as a new theme.
- Likely stale/invalid items: `HYP-CSP-APP`, `HYP-DEAD-LINKS`, `HYP-SW-PRECACHE` — all three refuted here; do not reopen without a new angle.
- Highest-value next work: the §4 meta-check, because it converts a recurring theme into a mechanical fail-closed guard rather than fixing three symptoms one at a time.

## Status boundary

Status of `AB-01`: `candidate` / `reproduced-by-agent` (harness signal, source-verified at the named anchor). Durable classification is left to a verifier synthesis or ledger decision.
