# Vosk dead split closure — 2026-08-02

**AuditRepo base:** `e781f897ef271ba47fef508f04a7cb065f51b8bb`  
**Source PR:** #755  
**Exact final source head:** `b348e22b79cf1a802b0d32098ed0a37de5d8e67b`  
**Source squash merge:** `aed8ed2244ad566b0458e490f629d394122dbf95`  
**Last exact production:** `abf1edba190280e554dfda085bef9fb6594c896d`  
**Production claim:** none

## Verified repair

The historical finding was reproducible before repair: `js/vosk-tts-core.js` defined and exported `splitSentences`, while runtime chunking was owned by `splitTtsChunks`. The bounded source diff removed only that dead definition and export (one file, 21 deletions). A fail-closed scan found zero source call sites; Node syntax, retained export contract and `validate:all` passed.

## Exact-head workflow evidence

- Shared Files Guard `30756863997` — success
- Metadata & IndexNow Readiness `30756863994` — success
- Deploy Candidate Contract `30756863993` — success
- Print Paper Contract `30756863988` — success
- Visual Parity Guard `30756863991` — success
- Route Registry Validators `30756864007` — success
- Runtime Interactive Audit `30756864014` — success

## Disposition and arithmetic

`NEW-VOSK-DEAD-SPLITSENTENCES` → **FIXED-CURRENT / SOURCE+CI VERIFIED**.

```text
canonical IDs: 358 -> 358
closed:        183 -> 184
open:          175 -> 174
P3:             49 -> 48
```

Later source movement does not change this disposition unless the removed symbol is reintroduced. Production remains separately evidenced and is not claimed here.
