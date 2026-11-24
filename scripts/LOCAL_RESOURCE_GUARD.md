# Local resource guard — candidate controller v1

This is a cooperative single-slot Windows supervisor for heavy agent jobs. It is **not installed** on the owner's computer by committing this code. Before rollout, verify the hosted Windows suite, test the exact accepted source on the target machine, reconcile existing unwrapped heavy jobs and coordinate all agent entrypoints. Until then the shared policy's conservative admission remains in force.

## Operation

Use the GitHub connector and hosted CI instead whenever they can satisfy the task. For a genuinely device-bound command, invoke the accepted guard once, using an absolute executable, worktree, new log path, exact input identity and all output-volume paths. Example (paths are illustrative):

    python -B scripts/local_resource_guard.py --repo example --lane qa --input-id EXACT_SHA --kind browser --engine chromium --workdir C:\isolated\worktree --log C:\isolated\logs\qa-new.log --disk-path C:\isolated\outputs -- C:\Tools\node.exe tests\browser.cjs

The guard denies admission rather than queueing: one global mutex, fresh Commit/RAM/disk counters, 80% maximum admission (75% warning), 6 GiB available RAM and at least 15 GiB free on each declared volume. A runtime emergency at 90% Commit, 3 GiB RAM or 5 GiB free disk stops **only the owned job**, not the rest of the workstation. The disk minimum is adjustable upward. Default deadline 10 min browser / 20 min otherwise. Extended deadline requires an owner approval reference; the controller cannot authenticate that reference, so agent/owner approval is still required. No local WebKit/CUDA admission in this initial controller; no parallel engines or undeclared output volumes.

Windows Job Objects with KILL_ON_JOB_CLOSE and STARTUPINFOEX process-creation job and handle lists prevent the ordinary unowned-child launch race and restrict inherited handles. The child gets NUL stdin and a dedicated log; no terminal base64 screenshots or command argument dump. Root exit is not success if children remain: they are cleaned and the job is reported nonzero. Timeouts, pressure, busy lock and infrastructure failures are distinct nonzero outcomes. Never report PASS unless the child succeeds and the job's active count returns to zero.

This is not a security sandbox: unwrapped commands, external services, deliberately misdeclared engines, and existing independent processes are outside its containment. The mutex is shared across cooperating processes using the same fixed name; inaccessible mutex/counters and creation failure must fail closed. No installer, scheduled task, global environment modification, provider operation or automatic termination of other jobs is included.

## Verification

Run `python -B scripts/local_resource_guard_test.py`. Portable policy tests cover boundary conditions; hosted Windows integration tests exercise actual counters, success and error, pressure, timeout, descendants, orphan handling, contention and forced supervisor exit. Windows integration tests are explicitly skipped on non-Windows runners. Green hosted Windows CI is necessary but does not certify the owner's exact device or policy adoption.

Official Win32 references:
- https://learn.microsoft.com/en-us/windows/win32/procthread/job-objects
- https://learn.microsoft.com/en-us/windows/win32/api/processthreadsapi/nf-processthreadsapi-updateprocthreadattribute
- https://learn.microsoft.com/en-us/windows/win32/api/psapi/ns-psapi-performance_information
