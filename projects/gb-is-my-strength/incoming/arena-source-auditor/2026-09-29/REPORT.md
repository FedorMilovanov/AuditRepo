# Raw audit receipt — scheduled Source Link Audit red on Product main (gb-is-my-strength)

- Agent: `arena-source-auditor` (Arena.ai Agent Mode)
- Pass date: 2026-09-29
- Project: `FedorMilovanov/gb-is-my-strength` (gospod-bog.ru)
- AuditRepo anchor at pass start: `01a271488454b7e914a5e9641919d3414f36ece6` (main, PR #474 merge)
- Audited anchor: Product `main` = `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b` (2026-09-23T22:15:20Z, merge PR #2137)
- Product clone used for source inspection: exact `d0e04a9c` working tree
- Status: raw evidence + bounded current-check. **No independent defect admitted in this pass.**

## Executive summary

The weekly scheduled `Source Link Audit` (`.github/workflows/source-links.yml`) on Product `main` is **red in 8 consecutive runs since 2026-09-12**, including the 2026-09-28 run at the current HEAD `d0e04a9c`. Last green run: 2026-09-07. Per the auditor source contract, exit 1 means at least one publication-blocking condition (404/410, invalid URL, address/redirect policy violation, unusable final content) **or** a systemic transport failure (every link failed before an HTTP response) **or** an uncaught auditor exception. The exact failing boundary was not extractable from this sandbox (see Limitations), so this pass (a) records the persistent red gate as current evidence, (b) marks the 2026-09-24 MASTER current-state snapshot **STALE for this gate boundary only**, and (c) defines the bounded next check that classifies the failure.

This red state was already seen and explicitly deferred, unclassified, by the 2026-09-22 release-recovery wave: "Current-main scheduled Source Link Audit is red in run 35579235403. Its cause is not inspected here and is not yet an admitted independent defect."

## Verified observations

### 1. Gate history (GitHub API, checked 2026-09-29)

All runs of `source-links.yml` on `main` (workflow id 293095781):

| Run | Date (UTC) | Event | Head | Conclusion |
|---|---|---|---|---|
| `36403875153` | 2026-09-28 09:29 | schedule | `d0e04a9c` | **failure** |
| `35579235403` | 2026-09-21 08:41 | schedule | `6bf5fd72` | **failure** |
| `35026572287` | 2026-09-15 21:36 | push | `f8d70a9a` | **failure** |
| `34992349218` | 2026-09-15 16:01 | push | `2edd47a0` | **failure** |
| `34823901490` | 2026-09-14 08:40 | schedule | `17e6db45` | **failure** |
| `34760918650` | 2026-09-13 13:49 | push | `059b3024` | **failure** |
| `34705922456` | 2026-09-12 16:39 | push | `c4d5ab1c` | **failure** |
| `34693183399` | 2026-09-12 12:15 | push | `7f0496ef` | **failure** |
| `34098490942` | 2026-09-07 08:02 | schedule | `99a7b9a7` | success |
| `33377801507` | 2026-08-31 09:28 | schedule | `0664bdd5` | failure |
| `32688162554` | 2026-08-24 03:55 | schedule | `c4e2d75e` | success |

Run `36403875153` detail: job `source-links` → step **"Source link audit (production-like dist)"** failed with exit code 1 (check-run annotation). The `contract` job is `pull_request`-only and was skipped. Failing-step log and run artifact `source-link-chain-36403875153` (artifact id `10961780849`) are not downloadable from this sandbox (Limitations).

Interpretation boundary: `7f0496ef..d0e04a9c` spans 8 red runs over 16 days and 3 independent weekly schedules on 3 distinct heads — a one-off runner/network hiccup does not explain this pattern. The single 2026-08-31 red between greens is consistent with transient transport noise (the auditor is fail-closed by design since the 2026-08-19 hardening) and is **not** evidence for either hypothesis here.

### 2. Auditor contract at `d0e04a9c` (`scripts/source-link-audit.js`)

- Blocking (`result: 'hard'`, any `hardErrors > 0` → exit 1): invalid/non-HTTP URL, credentials in URL, forbidden host/port/scheme, private/reserved resolved address at any hop, HTTPS downgrade, redirect loop/overflow/missing Location, 404/410, unusable final content type.
- Non-blocking warnings: bot blocks, rate limits, timeouts, 5xx (explicitly do not prove a source invalid).
- Exit 1 also on `systemicTransportFailure` (every external link failed before any HTTP response → "network acceptance is invalid") and on uncaught exceptions (including the incomplete-scan guard).
- Report is written to `reports/source-links/report.json` and uploaded as artifact `source-link-chain-<runId>`; human-readable `❌ Hard errors (N): <reason>: <url> (<files>)` lines go to the step log only.

### 3. Correlation window (secondary, hypothesis-grade)

- Last green: 2026-09-07 at `99a7b9a7`. First red: 2026-09-12 12:15 UTC at `7f0496ef` (merge PR #2007, baptisty visual atlas rb01 staging).
- The 09-12 push runs fired because the workflow's push paths changed: `dc84b66` (Southern Shtunda atlas figure, 10:55 UTC), `0a57340` (Kura origins atlas figure, 11:19 UTC), later `059b3024` (#2028 authentic historical media, 09-13) and pastor/diotrophes rebases (09-15). These surfaces carry many external source links (archive.org, hathitrust, thebhhs.org PDF, wikimedia, azbyka.ru, doi.org, sudrf.ru court pages, etc.).
- The commit graph in this range is replay-heavy (680 commits in `99a7b9a7..7f0496ef` including replayed older work), so commit-graph attribution is unreliable. The audit scans **all** external links in `dist`, so the breaking link may equally have arrived via any content merged 09-08..09-12. **No source-level mechanism is established by this pass.**

### 4. Fresh cross-checks on 2026-09-29 (other boundaries unchanged)

- Product `main` HEAD: `d0e04a9c7ac78082f44ad70c4b1e3bbf50b5065b` — no commits after 2026-09-24 (MASTER anchor still exact).
- Live `https://gospod-bog.ru/deployments/current.json`: `releaseSha` = `controlPlaneSha` = `d0e04a9c…`, `immutablePath` = `/deployments/d0e04a9c…/35927303479-1.json`, candidate digest `sha256:6bc574877ae519edeccbb98bdbbfe4736400ff15a3786ab39cc137d738978579` — production == main == MASTER-recorded identity.
- Other scheduled gates on `main`: Runtime Interactive Audit run `36407025768` success (2026-09-28, schedule); Visual Parity Guard run `36427005618` success (2026-09-28, schedule).
- Open Product PRs: #2145 (content, 1 file), #2144 (dependabot, 2 files), #2143 (draft genealogy editorial, 5 files), #2142 (research, 1 file) — **none** touch `source-links.yml` / `scripts/source-link-audit*` (no collision on the failing surface).
- Open Product issues: #1812 (TMSJ rights), #1753 (Bible licensing) — rights lanes, unrelated to this gate.
- Remote branches: 205 (same as the 09-22 inventory note; retirement remains a PROGRAM lane, not a MASTER row).

## Limitations (honest boundaries of this pass)

1. GitHub Actions step logs and run artifacts are served from `results-receiver.actions.githubusercontent.com` / `productionresultssa0.blob.core.windows.net`; both are unreachable from this sandbox (TLS EOF), so the failing URL / `report.json` could not be read for runs 36403875153 or 35579235403.
2. General sandbox egress to arbitrary HTTPS hosts is blocked (curl tests to example.com/wikipedia/archive.org/azbyka.ru → connection failure), so a local re-run of the network auditor cannot discriminate hypotheses (it would fail closed for sandbox reasons, not Product reasons).
3. Commit-graph forensics in the 09-08..09-15 window are unreliable due to replay-style composition history.

## Hypotheses and how to discriminate (bounded next check)

- **H1 — real dead/blocked-class source link on a reader surface** (404/410/invalid URL/policy violation introduced between 09-08 and 09-12). Reader-facing integrity defect; would admit a current defect row with the specific URL as witness.
- **H2 — systemic transport failure in the Actions egress** ("network acceptance invalid" path): every link fails pre-response; audit-harness false-red, not a Product defect; would admit an audit-defect row per the multi-witness protocol (proof of false-red), with a harness fix or documented runner-network boundary.
- **H3 — uncaught auditor exception** (incomplete-scan guard or similar): audit-harness defect; same disposition path as H2.

Next check (requires an egress-capable environment, ~10 minutes):

1. Open run `36403875153` → download artifact `source-link-chain-36403875153` (or the failing step log; or re-dispatch `workflow_dispatch` of `source-links.yml` at current `main` if the artifact expired).
2. Read `report.json`: `hardErrors` vs `systemicTransportFailure` vs exception.
3. If H1: record the failing `source` URL(s) + `reason` + first `files[]`; spot-check the URL from a clean network; admit a MASTER defect row scoped to the owning surface; repair at the smallest root level.
4. If H2/H3: record the proof of false-red; file an audit-harness lane; the Product ZERO attestation for this boundary is restored only after a green re-run.

## Confidence

- Persistent red scheduled gate on `main` since 2026-09-12, current at `d0e04a9c`: **high** (direct run records, 3 independent scheduled executions).
- Failure class (H1 vs H2 vs H3): **unknown** — no witness available from this environment.
- Release identity / HEAD / other scheduled gates unchanged vs the 2026-09-24 snapshot: **high** (live artifact, run records).
- Attribution of the breaking link to the baptisty atlas staging files: **low, hypothesis only**.

## Partial probe addendum (same pass, platform-side network)

A small sample of the most probable "new" links from the 09-12 staging files was probed on 2026-09-29 through a separate network path (not the sandbox, not the auditor):

| URL | Result |
|---|---|
| `archive.org/details/sim_baptist-missionary-magazine_1870-01_50_1` | alive (200, real item page) |
| `www.thebhhs.org/wp-content/uploads/2025/03/Ukraine.pdf` | alive (PDF parses) |
| `catalog.hathitrust.org/Record/000543543` | **bot-blocked** (Cloudflare "Page Blocked", IP reputation) |
| `commons.wikimedia.org/wiki/File:Kalveit.jpg` | alive (200) |

Interpretation: the HathiTrust block is a bot-block class — a **warning** under the auditor contract, not a hard error, so it does not explain exit 1. No hard-error-class witness found within this small sample; the sample does not clear the full dist link set. H1/H2/H3 discrimination still requires the run artifact/step log.

## Proposed matrix disposition (executed in the same wave)

- Append a narrow dated freshness note to `verified/MASTER_BUG_MATRIX.md` marking the 2026-09-24 snapshot STALE **for the scheduled source-link gate boundary only** (Operating Model, "Terminal attestation и freshness", material event 3).
- Do **not** admit a defect row: mechanism and failing boundary are not yet witnessed; arithmetic stays 0 admitted work units.
- Provenance: this receipt is the raw intake owner of the observation; MASTER links here.
