# Local execution and remote resource protocol

Status: mandatory shared workstation operating policy after integration into each repository's authority. Applies to all agents, repositories and tool accounts on the owner's Windows workstation. It governs execution transport and resource use, not evidence quality, provider writes, release approval or source ownership. Stricter repository-specific constraints remain binding.

## 1. QUALITY FIRST, RESOURCE SMART — choose the best execution surface

Optimize total cost to obtain a correct, complete result: quality and safety are non-negotiable; compare elapsed time, ChatGPT tokens, RDC credits, CI queue time, local load, rework risk and evidence fidelity. No rigid tool order, per-call approval, proof that every alternative failed, or fixed RDC call cap. A useful RDC call is welcome whenever it materially improves speed, quality, reliability or overall cost, including bulk repository operations and short edit/test loops in an existing authorized worktree. For a simple remote read or PR status, the connector usually wins; do not use RDC merely out of habit. Avoid replacing one efficient call with dozens of inferior ones.

- GitHub connector/API normally suits bounded source reads, diffs, issues, PRs and CI; use exact refs and existing ownership/write gates. An efficient local batch is equally legitimate when it offers a net advantage.
- Hosted sandbox/CI normally suits heavy builds, full browser matrices and reproducible tests. Use existing valid evidence and artifacts, and account for actual queue time. Do not treat a different device, synthetic merge or stale head as the required witness.
- Official provider API/connector and existing provider-write authority remain binding. Transport optimization is not permission to publish, bypass quotas or use a different account.
- Preserve owner privacy, isolation and desktop noninterference. Fresh scoped consent for foreground UI remains mandatory; never export private local files merely to save calls.

## 2. Proportionate execution and useful calls

Classify the actual workload, not the executable name. Examples are illustrative, not hard quotas.

| Class | Examples | Admission |
|---|---|---|
| LIGHT | Targeted file reads, metadata/hash queries, short git/CLI calls, small scripts and bounded source edits | Use autonomously; no resource inventory, shared slot or separate justification per call. |
| MEDIUM | Small incremental builds, bounded file transforms, short isolated screenshots/probes | Use autonomously within existing authority; check resource risk proportionately, clean owned children and bound duration. If it can create sustained pressure, persistent browser/server processes or uncertain peak usage, classify HEAVY. |
| HEAVY | Full builds/browser matrices, long-running browser/server trees, ASR, encoding, large PDF/image/media batches, unknown significant demand | Mandatory shared admission, fresh counters, deadline and cleanup under §3. Do not split work into nominally LIGHT/MEDIUM calls to evade admission. |

For LIGHT no special reporting ceremony. For MEDIUM record meaningful evidence and cleanup as needed. For HEAVY record scope, input identity, admission, expected outputs, deadline and cancellation path once per job or meaningful phase, not per tool call. A short Chromium probe can be MEDIUM only if bounded, isolated, nonpersistent and demonstrably low-demand; WebKit/CUDA exceptions never inherit that freedom. Existing project-specific quality and write gates remain in force.

Batch operations that naturally belong together, retain process/call IDs, and prefer compact structured results. Reuse existing exact-provenance worktrees, dependencies and outputs. Do not merge unrelated operations just to reduce call count. Poll when useful (including a meaningful short verification), not continuously; reconcile uncertain outcomes before replaying mutations or heavy launches. Extra calls are justified by real new evidence, diagnosis or quality improvement. Do not switch accounts to evade limits. No quota target may cause skipped tests, fake success or inferior evidence.

## 3. Shared machine admission and timeouts

- Before any HEAVY owner-PC task (as classified in §2), check system commit bytes/limit, free physical memory and disk on the actual target, plus existing owned heavy jobs. A wording-only GitHub change requires no desktop inventory.
- Until a cross-process admission controller is installed and verified, **at most one heavy job across the whole workstation**, with positive coordination evidence; if ownership/admission cannot be established, use CI/sandbox or HOLD. After verified controller deployment, use its actual enforced slot count (initially one; maximum two only after measured acceptance), with WebKit, CUDA and large media jobs requiring stricter explicit admission. No parallel browser engines inside a slot.
- Warn at 75% Commit; deny new heavy jobs at 80%; at 90% stop adding work and diagnose/coordinate cleanup. Also deny when available RAM < 6 GiB or target disk free < 15 GiB; large outputs require a calculated larger disk reserve. Fail closed on missing counters or lock; never use a stale measurement as admission.
- Windows local WebKit is **disabled by default**: use hosted WebKit CI. Incident 2026-11-24: two long-running test WebKit GPU processes each showed about 25 GiB shared commit; terminating their verified test trees reduced actual system commit by about 55 GiB. This is a workstation incident, not a claim about all WebKit versions. A necessary Windows-specific exception requires explicit owner approval, dedicated isolation, one slot, memory supervision and a short bounded reproduction. CUDA disabled by default on this machine; no silent fallback to a different transcription model.
- Default browser probe deadline 10 min, heavy local build/QA 20 min. These are defaults, not an instruction to abort useful longer work when a bounded safe deadline is warranted. A genuinely long media task may use a separately approved bounded deadline with progress, estimated disk/memory, cancel path and no duplicate runs. Never represent a timed-out test as PASS. Mandatory final checks still run in suitable hosted environments.
- Every HEAVY job has a job ID, repo/lane, exact head or local input identity, root PID plus creation time, start/deadline, owned children, and artifact/log path. Close browser/context/server in finally; external watchdog must cover a hung process. On timeout terminate only the verified job tree, after identifying PID reuse and protecting owner/other jobs. Retain outputs, dirty changes and partial evidence; no blanket taskkill by process name.

## 4. Enforcement and reporting

A policy document is not a running scheduler. A common workstation controller must provide atomic cross-process admission, live counters, bounded timeout, job-tree containment, cleanup, crash recovery and logs without secrets. Install only after isolated tests and explicit workstation rollout; until then section 3's conservative admission applies. HEAVY jobs must not bypass the controller once adopted. LIGHT and genuinely bounded MEDIUM operations do not require a heavy slot; admission failures must not be bypassed by relabeling a workload. Repository instructions must link this policy and carry essential fail-closed rules so link unavailability does not authorize unsafe execution.

Report substantive phase outcomes, actual RDC call count where meaningful (not guessed credits), local job outcome/cleanup, exact evidence and remaining HOLD. Do not measure agent performance by low call count alone. Do not weaken browser matrices, visual/manual acceptance, source verification, editorial or release gates to save resources; move the same required checks to the appropriate execution surface. Do not call an incident closed until measured verification confirms it.
