# arena-agent-2 — verification wave 2 — 2026-06-25

Second verification pass: cross-validation of `arena-agent-verifier-2` findings +
flag a dangerous misattribution in `FALSE_POSITIVES_REGISTRY`.

## Meta
- Agent: `arena-agent-2`
- Method: deterministic source grep + Python verification + Node execution proof
- Build mode: source layer (root HTML + committed files)

---

## 1. Cross-validation of verifier-2 claims — ALL CONFIRMED

| verifier-2 claim | My independent check | Result |
|---|---|---|
| PS-01 blast radius = **23 pages** | `grep -rl floating-cluster-controller.js --include=index.html \| wc -l` | ✅ **23** (8 articles + 10 baptisty-rossii + 5 nagornaya) |
| NEW-1: 2 broken TOC anchors on gill-part1 | Python: TOC `href` set − `id` set | ✅ **2**: `#sec-early-years`, `#sec-gill-spirituality` |
| NEW-1: 5 broken TOC anchors on gill-part3 | same | ✅ **5**: `#sec-legacy-main`, `#sec-rome-proverbs`, `#sec-wesley`, `#sec-coffee-house-polity`, `#sec-evaluations-map` |
| NEW-3: nagornaya font buttons dead | pages use `id="nagFontDec/Inc"` + `.nag-fontsize-btn`; `nagornaya-mobile-toc.js` listens `data-fontsize="down/up"` + `.nag-fontsize-down/up` | ✅ **selector mismatch confirmed** (0 matching elements) |
| NEW-5: feed.xml wrong weekdays (9) | Python `datetime` weekday check vs RFC-822 claim | ✅ **9 wrong**: 3× Gill "Sat 31 May"→Sun, 6× Nagornaya "Thu 01 May"→Fri |

These four high-impact findings now have **two independent confirmations** (verifier-2
+ arena-agent-2). Safe to escalate.

---

## 2. DANGEROUS MISATTRIBUTION flagged — C-07

`verified/FALSE_POSITIVES_REGISTRY_2026-06-25.md` NOTES (lines 50–51) claims:

> P0-10 (hash bomb) is the **root cause** of PS-01, PS-02, PS-03, PS-05.

This is **wrong** for PS-01/PS-02/PS-03 and directly contradicts CONFLICT_REGISTRY C-04
(which correctly identifies the IIFE lexical-scope defect).

### Deterministic proof that P0-10 ≠ cause of PS-01

Executed the **current committed file** (`floating-cluster-controller.js`, correctly
hashed at `35a91710`) in a Node DOM-stub → still throws
`ReferenceError: qs is not defined`. The `?v=` param is a cache-buster that does not
change the served file bytes; the crash is in the file's code structure, not its
reference. Fixing cache-bust hashes will NOT revive the controller.

Logged as **C-07** in `verification/CONFLICT_REGISTRY_2026-06-25.md`. The final
verifier must correct the FALSE_POSITIVES_REGISTRY note so an implementation agent
does not skip the controller edit.

---

## 3. Recommended verifier action

1. **Correct** FALSE_POSITIVES_REGISTRY lines 50–51: remove PS-01/PS-02/PS-03 from the
   "P0-10 root cause" list (only PS-05 may remain, pending dist build proof).
2. **Escalate** NEW-1, NEW-3, NEW-5 to `verified/` (now double-confirmed).
3. Keep PS-01 fix (controller edit) and P0-10 fix (cache-bust) **independent** in the
   repair order — neither closes the other.
