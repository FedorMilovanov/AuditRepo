# Proposal — SD-15 Vosk/genealogy verdicts on 2273b8c9

- Target: NEW-VOSK-FETCH-NO-ABORT, NEW-VOSK-DEAD-SPLITSENTENCES, AR-AUDIT-17, NF-DEAD-ENHANCE-SHIM
- Proposal type: reverify triage (data-sync / matrix-freshness; SHA-first)
- Current state (direct source on 2273b8c9):
  - NEW-VOSK-FETCH-NO-ABORT FIXED (modelDownloadController.abort present).
  - NEW-VOSK-DEAD-SPLITSENTENCES STILL OPEN (splitSentences exported, no call sites).
  - AR-AUDIT-17 STALE/FIXED candidate (validate.js only checks js/*.js, scripts/ skipped; templates not
    part of validate:all; inline "errors" are build-time placeholders replaced at generation).
  - NF-DEAD-ENHANCE-SHIM needs reverify (not rechecked in this pass).
- Proposed action: verifier closes NEW-VOSK-FETCH-NO-ABORT and AR-AUDIT-17 with evidence; keeps
  NEW-VOSK-DEAD-SPLITSENTENCES open; reverifies NF-DEAD-ENHANCE-SHIM. Fold into SD-7 lane.
- Evidence: `../evidence/sd15_vosk_genealogy.txt`
- My audited SHA (AuditRepo): `bc067a1cbaf33ed3cafa72cf6f4e5201056125db`
- Status: proposal-open
