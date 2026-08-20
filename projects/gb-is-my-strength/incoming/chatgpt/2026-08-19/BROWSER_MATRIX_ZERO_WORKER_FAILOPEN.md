# BROWSER-MATRIX-ZERO-WORKER-FAILOPEN

## Classification

- Project: `gb-is-my-strength`
- Signal class: audit-harness / evidence-integrity
- Proof state: current-source + deterministic JavaScript semantics
- Audited anchor: Product `main` `bcb41e57d7f9c011ac597c51a240fba19152a908`
- Product behavior defect: none claimed
- Current official CI bypass: none claimed; current workflow supplies valid literal worker counts
- Product mutation: none
- MASTER mutation: none
- Suggested theme: `ST-AUDIT-HARNESS`

## Finding

Both all-public-surface browser matrices parse an environment-controlled worker count through a numeric clamp that does **not** reject non-numeric input:

```js
const MAX_WORKERS = Math.max(1, Math.min(4, Number(process.env.GB_MATRIX_WORKERS || 4)));
const WORKERS = Math.max(1, Math.min(4, Number(process.env.GB_CROSS_BROWSER_WORKERS || 2)));
```

For a non-empty malformed value such as `abc` or `4x`:

```text
Number('abc')     → NaN
Math.min(4, NaN)  → NaN
Math.max(1, NaN)  → NaN
```

Both pool implementations then use:

```js
Array.from({ length: Math.min(WORKERS, items.length) }, run)
```

Converting `NaN` to an array length yields zero. No runner executes.

A dependency-free reproduction of the exact clamp/pool-width semantics on ten input cases gives:

```text
raw=abc  workers=NaN  poolWidth=NaN  runnerCount=0
raw=4x   workers=NaN  poolWidth=NaN  runnerCount=0
raw=0    workers=1    poolWidth=1    runnerCount=1
raw=-2   workers=1    poolWidth=1    runnerCount=1
raw=2    workers=2    poolWidth=2    runnerCount=2
raw=4    workers=4    poolWidth=4    runnerCount=4
```

The defect is specifically malformed nonnumeric input; zero/negative finite values are clamped to one.

## Why zero work becomes green

After the pool returns, both scripts derive failure only from recorded results:

```js
const failures = results.filter((item) => !item.ok);
const passed = results.length - failures.length;
...
if (failures.length) process.exitCode = 1;
```

There is no invariant that:

- at least one case ran;
- the number of route/profile cases processed equals the planned case count;
- `results.length` meets a per-case minimum contract count.

Therefore malformed worker input produces:

```text
results = []
failures = []
passed = 0
exit code = 0
```

and the generated Markdown chooses its success branch because `failures.length === 0`, emitting the equivalent of:

```text
Contracts: 0/0 PASS
Failures: 0
✅ Every public route passed ...
```

while the summary still reports the registry-derived route count.

This is an evidence-integrity failure: **absence of execution is interpreted as success**.

## Two current owners

The same mechanism exists independently in:

1. `scripts/public-surface-browser-matrix.mjs` (`GB_MATRIX_WORKERS`);
2. `scripts/public-surface-cross-browser-matrix.mjs` (`GB_CROSS_BROWSER_WORKERS`).

That makes it a class recurrence rather than a one-line typo in one runner.

## Official workflow boundary

`.github/workflows/route-registry-validators.yml` currently supplies explicit valid literals:

```yaml
env:
  GB_MATRIX_WORKERS: "4"
```

and:

```yaml
env:
  GB_CROSS_BROWSER_WORKERS: "2"
```

So this report **does not claim that current ordinary PR CI is bypassing the matrices**. The current defect is the fail-open contract of the tools themselves and the absence of an adversarial/parser/cardinality guard. A later workflow/manual/reusable invocation that changes or forwards these environment values can silently convert a broad browser witness into zero work.

## System recurrence

AuditRepo PR #316 previously recorded the same class in `source-link-audit.js`: malformed `SOURCE_LINK_CONCURRENCY` could execute zero work and return green. Current Product has repaired that owner with:

- `readPositiveIntegerEnv(...)` rejecting malformed/zero/unsafe inputs;
- an adversarial source-contract mutation that rejects bypassing the parser;
- a pool completeness invariant comparing result count with discovered link count.

The browser matrices have not inherited that closure pattern. The lesson therefore did not become a shared audit primitive / class-level rule.

## Root cause

```text
string env input
  ↓
Number(...) without finite/integer validation
  ↓
NaN survives min/max clamp
  ↓
NaN converts to zero array length
  ↓
no worker executes
  ↓
results=[]
  ↓
"no failures" treated as PASS
```

The deeper root is **vacuous-success admission**: final truth is inferred only from negative evidence (`no failing rows`) rather than from both negative evidence and a completeness witness (`all planned rows executed`).

## Suggested durable closure

A future owned harness repair should close the class, not only special-case `abc`:

1. Parse worker-count inputs with an explicit positive safe-integer parser and bounded range.
2. Fail before browser launch on invalid values.
3. Assert planned case count is non-zero for a production registry.
4. Assert every planned case was executed exactly once.
5. Assert result cardinality is compatible with the executed case set; zero contracts for a non-empty case set is always red.
6. Add dependency-free adversarial contract tests for malformed, zero, negative, unsafe-large and valid boundary values.
7. Prefer a shared parser/completeness primitive across audit runners so the fixed source-link pattern is not reimplemented inconsistently.

## What this report does not claim

- No current reader-facing Product defect.
- No claim that the existing workflow literals `4` and `2` are malformed.
- No claim that current successful browser artifacts are invalid solely because this latent path exists.
- No need for a Product UI/runtime change; this is audit/control-plane code.
