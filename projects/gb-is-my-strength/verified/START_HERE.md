# Owner Start Here — gb-is-my-strength AuditRepo

## What this repository gives you

AuditRepo is a growing evidence library and reasoning layer for `gb-is-my-strength`.

It can contain many independent passes, including reports that later prove stale, duplicate or wrong. That is useful: raw evidence shows how conclusions were reached and how audit methods improved.

The purpose is not to maintain a second exact copy of Product status. The purpose is to help answer:

- What has been observed before?
- What evidence supports or contradicts it?
- Which symptoms share one root cause?
- What is worth verifying now?
- Should we fix locally, improve a system, park it or accept the risk?

---

## The four useful views

### 1. Possible work

[`../WORK_QUEUE.md`](../WORK_QUEUE.md)

An optional owner-controlled queue. It may contain a few questions, many questions or none.

### 2. Systemic causes

[`SYSTEM_THEMES.md`](./SYSTEM_THEMES.md)

Recurring classes such as release identity, runtime ownership, strangler duplication, content authority and audit-harness quality.

### 3. Finding registry

[`MASTER_BUG_MATRIX.md`](./MASTER_BUG_MATRIX.md)

The historical registry. It still contains both active and many closed rows from the earlier exact-authority model. Use it as evidence/index, not as an obligation to keep all 376 rows globally current.

### 4. Completed waves

[`CLOSURE_LEDGER.md`](./CLOSURE_LEDGER.md)

Compact summaries of what a wave fixed, absorbed, rejected, parked or left independent.

---

## How to request work

You can choose any scope:

```text
“Verify these 50 findings and find deeper causes.”
“Fix only this visible bug.”
“Take the TTS performance theme.”
“Close everything this system fix absorbs.”
“Do a fresh broad audit and add evidence only.”
“Decide what is not worth fixing.”
```

The process should adapt to the request. AuditRepo no longer requires one fixed close-every-row sequence.

---

## What happens before a fix

The agent should:

1. read relevant historical evidence;
2. inspect the selected current Product surface directly;
3. identify local vs systemic cause;
4. choose proportionate evidence;
5. avoid overlapping active Product work;
6. explain when no fix or owner decision is better.

There is no preliminary requirement to synchronize every AuditRepo document with the latest Product HEAD.

---

## What a good result looks like

A good wave may reduce fifty claims to:

- several current local defects;
- a few systemic roots;
- duplicates absorbed into those roots;
- stale or invalid claims;
- low-value parked work;
- owner decisions.

The value is clearer causality and better choices, not a larger count of “verified bugs”.

---

## Current transition

The large historical matrix remains intact so no evidence is lost. New work uses the lighter operating model, optional queue, system themes and compact closure ledger. Old rows can be consolidated gradually in dedicated waves.

Canonical repository model: [`../../../AUDITREPO_OPERATING_MODEL.md`](../../../AUDITREPO_OPERATING_MODEL.md).
