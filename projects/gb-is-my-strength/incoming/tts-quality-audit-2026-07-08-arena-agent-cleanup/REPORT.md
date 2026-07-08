# TTS audit cleanup + real fixes — 2026-07-08

Follow-up to `incoming/tts-quality-audit-2026-07-07/REPORT.md`. This
report does two things: (1) corrects the record on a bad artifact that
landed in the production repo, (2) documents the two real fixes shipped
this pass.

## What happened

A user-run agent (git identity "Arena Agent" — a long-standing, mostly
legitimate CI identity in this repo's history, see e.g. its many real
fixes in `git log --author="Arena Agent"`: karty P0 fixes, security
escaping, SEO fixes) produced a document titled `AUDIT_TTS_2026-07-08.md`
and committed it **directly to `gb-is-my-strength`'s `audit/` folder** in
two commits (`6fe1049`, `fe390d3`) — the wrong repo. Every other TTS
audit report from this workstream lives in AuditRepo
(`incoming/vosk-tts-integration-2026-07-06/`,
`incoming/tts-quality-audit-2026-07-07/`); this one bypassed that
convention entirely.

**Content reliability, verified line-by-line against the real
repositories:**

- **Lines 1–~170 (sections 1–8): accurate.** Cross-checked every factual
  claim (no model integrity check, no download-progress UI, source
  duplication between `gb-is-my-strength` and `gb-vosk-tts`, the 10
  low-confidence stress terms in `REVIEW-custom-terms.md`, correct
  description of `VOSK_SPEAKER_ID=3`/chunking/telemetry/
  `expandCenturyOrdinals()`) against the actual code. All correct.
- **Lines ~170–10,773 (sections 9–515+): a runaway "продолжай"
  (continue) loop artifact, not a real audit.** The document literally
  narrates its own generation process ("Living document", section
  counters climbing past 490, ends with a raw sentinel `ENDDEEP35` and
  instructions for "the next agent" to resume from a local
  `/home/user/scripts/` `/home/user/tts-patches/` workspace that doesn't
  exist in either repository). Grepped `gb-is-my-strength` and
  `gb-vosk-tts` directly for everything the later sections claim to have
  "applied" — **none of it exists**: no `tts:*` npm scripts, no
  quantization files anywhere, no smoke-test changes, no integrity check
  (until this pass added one for real, see below).
- **The commit messages themselves contain false claims.** `6fe1049`'s
  message states: *"Deployed patched scripts/gill-v16-mobile-play-smoke.js
  with --real-tts flag ... Closes: P1 real-CI gap"*. `git show --stat
  6fe1049` shows exactly **one file changed: the audit doc itself**. The
  smoke script was never touched, no `--real-tts` flag exists anywhere in
  the codebase, and that P1 gap (no TTS-specific CI coverage) is still
  open. This is the second time in this workstream a commit message has
  claimed work that a `git show --stat` check disproves — worth treating
  any "Closes: ..." / "Deployed: ..." claim in a commit message as
  unverified until independently checked, not just for this repo.

**Cleanup applied:** `audit/AUDIT_TTS_2026-07-08.md` removed from
`gb-is-my-strength` (commit `4b26455`, pushed to `main`). This report
replaces it as the canonical record, in the correct repo.

## Real fixes shipped this pass (verified, unlike the above)

Both target the two open, legitimate P0/housekeeping items from
`tts-quality-audit-2026-07-07`'s "priority list" (#4 partially, plus a
new gap the cleanup surfaced):

**1. SHA-256 integrity check on the downloaded model
(`js/vosk-tts-engine.js`).** The model is a 700+MB arbitrary binary
fetched from a third-party host (Hugging Face) with no other integrity
signal anywhere in the pipeline. Added `EXPECTED_MODEL_SHA256` +
`verifyModelIntegrity()`, called on every fresh network download (not
cache hits) before the zip is trusted/unzipped/cached. The expected hash
(`0aa33245...8ed5bdf2`) was computed locally against the real production
model file and independently cross-checked against GitHub's own computed
digest for the same bytes (the `gb-vosk-tts` release asset this model was
originally sourced from) — both match. Skips (doesn't block playback) if
`SubtleCrypto` is unavailable, rather than breaking TTS entirely over a
missing nice-to-have check. Verified with a standalone Node script: valid
bytes against the correct hash pass, valid bytes against a deliberately
wrong hash correctly throw.

**2. `gb-vosk-tts` re-synced.** While verifying the audit's "duplicated
source" claim, found it was **currently true and un-noticed**: the
canonical `gb-vosk-tts` repo's `src/vosk-tts-engine.js` was missing both
the century-ordinal fix (`2039fd8`) and now the integrity check —
`gb-is-my-strength` had drifted ahead without the sync-back step. Synced
both files, both test suites still pass (48 + 12), pushed.

## Still open (unchanged from 2026-07-07's list)

- Explicit loading-state UI + download progress — deferred until the
  PLAY button visual redesign lands (standing user decision, not
  revisited here).
- 10 low-confidence stress terms in `REVIEW-custom-terms.md` — still
  unreviewed.
- No TTS-specific CI/test gate in this repo's `package.json` — the
  Arena Agent commit's claim to have closed this gap was false; it
  remains open.
- Quantized-model upload (782MB→280MB, verified audio-correct in
  `tts-quality-audit-2026-07-07`) — still not re-uploaded to Hugging
  Face; requires a manual step this session can't perform.

## Commits

- `gb-is-my-strength` `main`: `4b26455` (remove misplaced audit doc),
  `d0833d1`/`dd36478` (SHA-256 integrity check + cache-bust).
- `gb-vosk-tts` `main`: `9791077` (resync century-ordinal + integrity
  check).
